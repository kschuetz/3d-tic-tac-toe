
const _ = require('lodash'),
     commonConfig = require('./common'),
    vendorBundleBaseConfig = require('./vendor');

module.exports = _.merge({}, commonConfig, {
    htmlMode:       'dev',

    outputJsDir:    './dev/js',
    outputCssDir:   './dev/css',
    //aliases:        getDevAliases(),
    browserSyncOptions: {
        server: {
            baseDir: './dev'
        }
        //startPath:  './build'
    },
    outputBaseDir:  './dev',

    cssOptions: {
        dev: true
    },

    vendorBundleConfig:  _.merge({}, vendorBundleBaseConfig, {
        outputJsDir:    './dev/js',
        browserifyOptions: {
            debug: true
        }
    })
});