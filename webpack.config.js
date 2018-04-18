const path = require('path');
const globby = require('globby');
const webpack = require('webpack')
// 读取js路径 
const jsPath = globby.sync(['./src/js/*.js']);
const jsArray = [];
const tmpEntry = {};
let tmpHtml = [];
jsPath.forEach((v) => {
    const nowName = path.parse(v).name;
    jsArray.push(nowName);
    tmpEntry[nowName] = v;
});
const env = process.env.NODE_ENV;
module.exports = {
    entry: tmpEntry,
    output: {
        path: __dirname + '/dist',
        filename: "js/[name].js"
    },
    module: {
        loaders: [{
                test: /\.html$/,
                loader: "raw-loader"
            },
            {
                test: /\.rgl$/,
                loader: 'rgl-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader?cacheDirectory'
            }
        ]
    },
    devtool: 'source-map',

};

if (env !== 'production') {
    // module.exports.watch = true;
} else {
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.optimize.UglifyJsPlugin({
            sourceMap: true,
            compress: {
                warnings: false
            }
        }),
    ])
}