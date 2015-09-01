const      
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    less = require('gulp-less'),
    fs = require('fs'),
    browserify = require('browserify'),
    babelify = require('babelify'),
    uglify = require('gulp-uglify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    _ = require('lodash'),
    aliasify = require('aliasify'),
    jshint = require('gulp-jshint'),
    stylish = require('jshint-stylish'),
    path = require('path'),
    runSequence = require('run-sequence'),
    cssmin = require('gulp-cssmin'),
    preprocess = require('gulp-preprocess'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload,
    glob = require('glob'),
    react = require('gulp-react'),
    gulpFilter = require('gulp-filter');


const devConfig = require('./config/dev'),
      distConfig = require('./config/dist');

const browserSyncOptions = {
    server: {
        baseDir: './'
    },
    port:  7654
};

const browserifyBaseOptions = {
    paths: ['./src/app']
};

const defaultModuleAliases = {
    'Immutable': '_external/Immutable',
    'react': '_external/react',
    'lodash': '_external/lodash',
    'jquery': '_external/jquery'
};

const taskNames = {
    jshint: 'jshint',
    css:  'css',
    html: 'html',
    vendor:  'vendor',
    bundle:  'bundle',
    copyAssets:   'copy-assets',
    serve: 'serve'
};


gulp.task(taskNames.jshint, function() {
    var jsxFilter = gulpFilter(['**/*.react.js', '**/*.jsx']);

    // For any files ending in .react.js or .jsx, apply the react transform on the file before jshinting it

    return gulp.src('./src/app/**/*.js')
        // TODO:  fix jsxFilter / react

        //.pipe(jsxFilter)
        //.pipe(react())
        //.pipe(jsxFilter.restore())
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish'))
        .pipe(jshint.reporter('fail'));   // <- hack to make the build process fail if jshint has any errors
});


function cssTask(config) {
    return function() {
        var dev = !!(config && config.cssOptions && config.cssOptions.dev),
            src = gulp.src('./src/stylesheets/main.less'),
            runLess = less({
                paths: [ path.join(__dirname, 'less', 'includes') ]
            }),
            dest = config.outputCssDir;

        if(dev) {
            return src.pipe(sourcemaps.init()).pipe(runLess).pipe(sourcemaps.write()).pipe(gulp.dest(dest));
        } else {
            return src.pipe(runLess).pipe(cssmin()).pipe(gulp.dest(dest));
        }

    };
}

function htmlTask(config) {
    return function() {
        gulp.src(config.indexHtml)
            .pipe(preprocess({context: { MODE:  config.htmlMode}}))
            .pipe(rename('index.html'))
            .pipe(gulp.dest(config.outputBaseDir));
    };
}

function copyAssetsTask(config) {
    if(config.copyAssets) {
        return function () {
            return gulp.src(config.copyAssets)
                .pipe(gulp.dest(path.join(config.outputBaseDir, 'assets')));
        };
    } else {
        return _.noop;
    }
}

function serveTask(config) {
    return function() {
        let bsOptions = _.merge({}, browserSyncOptions, config.browserSyncOptions || {});
        browserSync(bsOptions);
    }
}

function makeVendorBundler(vendorBundleConfig) {
    let bundler, inputFiles;
    inputFiles = glob.sync(vendorBundleConfig.entryFile);

    bundler = browserify(inputFiles, _.extend({}, browserifyBaseOptions, vendorBundleConfig.browserifyOptions || {}));

    function bundle() {
        gutil.log('building vendor bundle');

        let b = bundler
            .bundle()
            .on('error', function(err) { gutil.log('Browserify error: ' + err.message); })
            .pipe(source(vendorBundleConfig.outputJsFile));
        //.pipe(buffer())
        //.pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file

        if(vendorBundleConfig.uglify) {
            b = b.pipe(buffer())
                .pipe(uglify());
        }
        //.pipe(sourcemaps.write('./')) // writes .map file

        b = b.pipe(gulp.dest(vendorBundleConfig.outputJsDir));
        b.on('end', function() {
            gutil.log('vendor bundle complete');
        });

        return b;
    }

    return {
        bundle: bundle,
        bundler: bundler

    };
}

function vendorTask(vendorBundleConfig) {
    return function() {
        return makeVendorBundler(vendorBundleConfig).bundle();
    }
}

function makeBundler(config) {
    let bundler,
        inputFiles,
        bsOptions;

    inputFiles = glob.sync(config.entryFile);

    bsOptions = _.extend({}, browserifyBaseOptions, config.browserifyOptions || {});
    bundler = browserify(inputFiles, bsOptions);

    let myAliases;
    if(config.aliases) {
        myAliases = _.merge({}, defaultModuleAliases, config.aliases)
    } else {
        myAliases = defaultModuleAliases;
    }

    function bundle() {
        gutil.log('rebuilding bundle');
        let aliases = aliasify.configure({
            aliases: myAliases
            //verbose: true
        });
        let b = bundler
            .transform(babelify.configure({ optional: ["runtime"]}))
            .transform(aliases)
            .bundle()
            .on('error', function(err) { gutil.log('Browserify error: ' + err.message); })
            .pipe(source(config.outputJsFile));

        if(config.uglify) {
            b = b.pipe(buffer())
                .pipe(uglify());
        }

        b = b.pipe(gulp.dest(config.outputJsDir));
        b.on('end', function() {
            gutil.log('bundle complete');
        });

        return b;
    }

    return {
        bundle: bundle,
        bundler: bundler

    };

}

function bundleTask(config) {
    return function() {
        return makeBundler(config).bundle();
    }
}

function makePrefixer(prefix) {
    return function(s) {
        return prefix + s;
    }
}

function makeTasks(groupName, config) {
    const withPrefix = makePrefixer(groupName + '-'),
          names = _.mapValues(taskNames, withPrefix);
    gulp.task(names.vendor, vendorTask(config.vendorBundleConfig));
    gulp.task(names.css, cssTask(config));
    gulp.task(names.html, htmlTask(config));
    gulp.task(names.copyAssets, copyAssetsTask(config));
    gulp.task(names.serve, serveTask(config));
    gulp.task(names.bundle, bundleTask(config));

    let deps = [names.css, names.html, names.vendor];
    if(config.copyAssets) {
        deps.push(names.copyAssets);
    }

    gulp.task(groupName, function() {
            runSequence([taskNames.jshint], function() {
                runSequence(deps, function() {
                    runSequence(names.bundle);
                })
            })
        }
    );
}


makeTasks('dev', devConfig);
makeTasks('dist', distConfig);