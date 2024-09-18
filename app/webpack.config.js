const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/app.ts',
    devtool: "inline-source-map",
    target: "node",
    mode: "production",

    plugins: [
        new webpack.BannerPlugin({ banner: "#!/usr/bin/env -S node --enable-source-maps", raw: true }),
    ],
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /(^uiLog)|(\.html?$)|(\.js?$)/,
                type:"asset/source",
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'dms.js',
        path: path.resolve(__dirname, 'dist'),
    },
};