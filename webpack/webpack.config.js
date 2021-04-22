'use strict'
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

function get_entry(dir) {
    return fs.readdirSync(path.resolve(__dirname, dir)).reduce(
        (entry, file_name) => {
            if (
                /\.(js|ts|webx)$/.test(file_name) &&
                fs.statSync(path.resolve(__dirname, dir + file_name)).isFile()
            ) {
                entry[dir + file_name.replace(/\.[^\.]+$/, "")] = path.resolve(__dirname, dir + file_name)
            }
            return entry;
        },
        {}
    )
}

module.exports = {
    mode: 'production',
    //mode: 'development',
    entry: {
        ...get_entry('../js/'),
        //vendor: ['babel-polyfill']
    },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: 'js/[name].js',
        chunkFilename: 'js/[id].js',
        //globalObject: "this",
        //libraryTarget: "commonjs"
    },
    module: {
        unknownContextCritical: false,
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.html$/,
                use: [{
                    loader: "html-loader",
                    options: {
                        //attrs: "false"
                    }
                }]
            }, {
                test: /\.webx$/,
                loader: "webx-loader"
            },
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader'
                },
            }],
    },

    resolve: {
        extensions: ['.js', '.ts', '.tsx']
    },
    plugins: [
        new webpack.optimize.ModuleConcatenationPlugin(),
        ...(fs.readdirSync(path.resolve(__dirname, '../')).reduce((hwps, file_name) => {
            let full_path_name = path.resolve(__dirname, '../' + file_name);
            if (/\.html$/.test(file_name) && fs.statSync(full_path_name).isFile()) {
                hwps.push(new HtmlWebpackPlugin({
                    template: full_path_name,
                    filename: file_name,
                    inject: false,
                    minify: false,
                }));
            }
            return hwps;
        }, [])),
        new CopyWebpackPlugin(
            [/*"css", "img",*/ "js/Ace"/*,"performance-vue.html","performance-webx.html"*/].map(dir => {
                return {
                    from: path.resolve(__dirname, '../' + dir),
                    to: "./" + dir
                }
            })
        ),
        //new CleanWebpackPlugin()
    ]
};