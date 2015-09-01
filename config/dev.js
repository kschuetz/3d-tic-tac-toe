
const _ = require('lodash'),
     commonConfig = require('./common'),
    vendorBundleBaseConfig = require('./vendor');

module.exports = _.merge({}, commonConfig, {
    htmlMode:       'dev',

    outputJsDir:    './build/js',
    outputCssDir:   './build/css',
    //aliases:        getDevAliases(),
    browserSyncOptions: {
        server: {
            baseDir: './build'
        }
        //startPath:  './build'
    },
    outputBaseDir:  './build',

    cssOptions: {
        dev: true
    },

    vendorBundleConfig:  _.merge({}, vendorBundleBaseConfig, {
        outputJsDir:    './build/js',
        browserifyOptions: {
            debug: true
        }
    })
});