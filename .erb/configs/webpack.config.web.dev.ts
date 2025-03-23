import 'webpack-dev-server'
import path from 'path'
import webpack from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import { merge } from 'webpack-merge'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'
import baseConfig from './webpack.config.base'
import webpackPaths from './webpack.paths'

const port = process.env.PORT || 3000;

const configuration: webpack.Configuration = {
    devtool: 'inline-source-map',
    mode: 'development',
    target: 'web', // Simplified to web-only target

    entry: [
        `webpack-dev-server/client?http://localhost:${port}`,
        'webpack/hot/only-dev-server',
        path.join(webpackPaths.srcRendererPath, 'index.tsx'),
    ],

    output: {
        path: webpackPaths.distRendererPath,
        publicPath: '/',
        filename: 'main.bundle.js', // Simplified output name
    },

    module: {
        rules: [
            {
                test: /\.s?(c|a)ss$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            sourceMap: true,
                            importLoaders: 1,
                        },
                    },
                    'sass-loader',
                ],
                include: /\.module\.s?(c|a)ss$/,
            },
            {
                test: /\.s?css$/,
                use: ['style-loader', 'css-loader', 'sass-loader', 'postcss-loader'],
                exclude: /\.module\.s?(c|a)ss$/,
            },
            // Fonts
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            // Images
            {
                test: /\.(png|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            // SVG
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: '@svgr/webpack',
                        options: {
                            prettier: false,
                            svgo: false,
                            svgoConfig: {
                                plugins: [{ removeViewBox: false }],
                            },
                            titleProp: true,
                            ref: true,
                        },
                    },
                    'file-loader',
                ],
            },
        ],
    },

    plugins: [
        new webpack.EnvironmentPlugin({
            NODE_ENV: 'development',
        }),

        new BundleAnalyzerPlugin({
            analyzerMode: process.env.ANALYZE === 'true' ? 'server' : 'disabled',
            analyzerPort: 8889,
        }),

        new HtmlWebpackPlugin({
            filename: 'index.html', // Direct output to root
            template: path.join(webpackPaths.srcRendererPath, 'index.ejs'),
            minify: false, // Disable minification for development
            inject: 'body', // Explicit injection point
            favicon: path.join(webpackPaths.srcRendererPath, 'favicon.ico'),
        }),
    ],

    devServer: {
        port,
        hot: true,
        compress: true,
        static: {
            directory: webpackPaths.distRendererPath,
        },
        historyApiFallback: true,
        headers: { 'Access-Control-Allow-Origin': '*' },
    },
}

export default merge(baseConfig, configuration)