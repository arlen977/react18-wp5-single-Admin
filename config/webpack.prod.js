/* eslint-disable */
// webpack production 配置
const {
    merge
} = require('webpack-merge');
const path = require("path")
const common = require('./webpack.common.js');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const WebpackBar = require('webpackbar');
const {
    WebpackManifestPlugin
} = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const cdnConfig = require("./cdn")
const externalConfig = JSON.parse(JSON.stringify(cdnConfig.externalConfig)); // 读取配置
const externalModules = cdnConfig.getExternalModules(externalConfig); // 获取到合适路径和忽略模块

module.exports = (env) => {
    return merge(common(env), {
        mode: 'production',
        target: ["web","es5"],
        output: {
            filename: "static/js/[name].[contenthash].js", // 多页面配置
            clean: true, // 在生成文件之前清空 output 目录
            path: path.join(__dirname, '../dist'),
            publicPath: "./",
        },
        externals: externalModules, // 构建时忽略的资源
        plugins: [
            new WebpackBar(),
            // 打包分析
            // new BundleAnalyzerPlugin(),

            // 生成 manifest.json
            new WebpackManifestPlugin(),
            // 将 css 从 js 中分离
            new MiniCssExtractPlugin({
                filename: "static/css/[name].[contenthash].css",
                chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
            }),
             // 複製public內文件
             new CopyPlugin({
                patterns: [
                    {
                        from: path.resolve(__dirname, "../public"),
                        to: path.resolve(__dirname, "../dist"), //放到output文件夹下
                        globOptions: {
                            dot: true,
                            gitignore: false,
                            ignore: [
                                // 配置不用copy的文件
                                "**/index.html",
                            ],
                        },
                    },
                ],
            }),
        ],
        optimization: {
            minimize: true, //告知 webpack 使用 TerserPlugin 或其它在 optimization.minimizer定义的插件压缩 bundle。
            minimizer: [ // 允许你通过提供一个或多个定制过的 TerserPlugin 实例，覆盖默认压缩工具(minimizer)。
                new TerserPlugin({
                    parallel: true,
                    terserOptions:{
                        compress:{
                            pure_funcs: ['console.log'], // 删除控制台打印
                        },
                        safari10: true, // 解决 Safari 10/11 循环范围和 中的错误
                    }
                }),
                new CssMinimizerPlugin(),
            ],
            splitChunks: {
                chunks: 'async'
            },
        }
    })
}