'use strict';

var
    webpack = require('webpack');

module.exports = {
    output:  {
        filename: "scripts/main.js"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new webpack.optimize.CommonsChunkPlugin("vendor", "scripts/vendor.js", Infinity)
    ],
    resolve: {
        alias: {
            'jquery': "jquery/src/jquery.js"
        }
    },
    entry:   {
        app:    "./src/scripts/main.js",
        vendor: "./src/scripts/vendor.js"
    }
};
