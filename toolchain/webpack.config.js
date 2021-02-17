const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const package = require('../package.json');

const fs = require('fs');
const cert = fs.readFileSync(path.join(__dirname, './keys/server.crt'));
const key = fs.readFileSync(path.join(__dirname, './keys/server.key'));

const distDir = './dist';

module.exports = function (env, argv) {
    const plugins = [
        new HtmlWebpackPlugin({
            template: './src/html/index.html',
            filename: path.join(__dirname, '../', distDir, 'index.html'),
            alwaysWriteToDisk: true,
            inject: false,
        }),
        new webpack.EnvironmentPlugin(['SERVER_URL']),
        new webpack.DefinePlugin({
            'process.env.VERSION': JSON.stringify(package.version),
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '../src/raw'),
                    to: path.join(__dirname, '../', distDir),
                },
            ],
        }),
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.join(__dirname, '../src/raw.' + (argv.mode === 'production' ? 'prod' : 'dev')),
                    to: path.join(__dirname, '../', distDir),
                },
            ],
        }),
        // new BundleAnalyzerPlugin(),
    ];

    return {
        entry: {
            bundle: ['babel-polyfill', './src/css/index.scss', './src/js/index.tsx'],
            agent: {
                import: './src/js/agent/index.ts',
                filename: '../[name].js',
            },
        },
        devtool: argv.mode === 'production' ? false : 'inline-source-map',
        output: {
            filename: '[name].js',
            path: path.resolve(__dirname, '..', distDir, 'static'),
            publicPath: `/static/`,
            // publicPath: argv.mode === 'production' ? `${config.baseUrl}static/` : 'https://192.168.1.15/static/',
        },
        devServer: {
            // https: {
            //     key,
            //     cert,
            // },
            port: 9000,
            inline: true,
            writeToDisk: true,
            contentBase: path.join(__dirname, '..', distDir),
            disableHostCheck: true,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
                'Access-Control-Allow-Headers': 'X-Requested-With, content-type, Authorization',
            },
            // open: true
        },
        mode: argv.mode,
        stats:
            argv.mode === 'development'
                ? {
                      warnings: false,
                  }
                : 'errors-only',
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    use: ['ts-loader'],
                    exclude: /node_modules/,
                },
                {
                    test: /\.(css|scss)$/,
                    oneOf: [
                        {
                            test: /\.module\.(css|scss)$/,
                            use: [
                                'style-loader',
                                {
                                    loader: 'css-loader',
                                    options: {
                                        sourceMap: false,
                                        importLoaders: 1,
                                        modules: {
                                            localIdentName: '[name]__[local]--[hash:base64:5]',
                                        },
                                    },
                                },
                                'postcss-loader',
                                'sass-loader',
                                {
                                    loader: 'sass-resources-loader',
                                    options: {
                                        resources: ['./src/css/core.scss'],
                                    },
                                },
                            ],
                        },
                        {
                            use: [
                                'style-loader',
                                'css-loader',
                                'postcss-loader',
                                'sass-loader',
                                {
                                    loader: 'sass-resources-loader',
                                    options: {
                                        resources: ['./src/css/core.scss'],
                                    },
                                },
                            ],
                        },
                    ],
                },
                {
                    test: /\.(png|jpg|gif|svg|webp)$/,
                    use: {
                        loader: 'file-loader',
                        options: {
                            limit: 15000,
                            name: '[name].[ext]',
                            outputPath: 'images/',
                        },
                    },
                },
                {
                    test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
                    use: [
                        {
                            // loader: 'url-loader',
                            loader: 'file-loader',
                            options: {
                                name: '[name].[ext]',
                                outputPath: 'fonts/',
                            },
                        },
                    ],
                },
                {
                    test: /\.(txt|html|glsl)$/,
                    use: 'raw-loader',
                },
            ],
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.css', '.scss'],
            modules: ['src/js', 'node_modules'],
            alias: {
                react: 'preact/compat',
                'react-dom/test-utils': 'preact/test-utils',
                'react-dom': 'preact/compat',
            },
        },
        optimization: {
            splitChunks: {
                cacheGroups: {
                    styles: {
                        name: 'styles',
                        test: /\.css$/,
                        chunks: 'all',
                        enforce: true,
                    },
                },
            },
        },
        plugins: plugins,
    };
};
