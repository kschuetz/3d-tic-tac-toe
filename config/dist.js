
const _ = require('lodash'),
    commonConfig = require('./common'),
    vendorBundleBaseConfig = require('./vendor');

module.exports = _.merge({}, commonConfig, {
    htmlMode:       'production',

    outputJsDir:    './dist/js',
    outputCssDir:   './dist/css',

    outputBaseDir:  './dist',
    browserSyncOptions: {
        server: {
            baseDir: './dist'
        }
        //startPath:  './dist'
    },
    uglify: true,
    vendorBundleConfig:  _.merge({}, vendorBundleBaseConfig, {
        outputJsDir:    './dist/js',
        uglify:  true
    })
});