/* eslint-disable */
// webpack development 配置
const {
    merge
} = require("webpack-merge");
const ip = require('ip');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin'); //node终端输出工具
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin"); // 不刷新瀏覽器 熱更新
const common = require("./webpack.common.js");
const portfinder = require('portfinder'); // 端口被占用 自动切换下一端口
const devConfig = {
    mode: "development",
    // target: 'web', // 需要设置web 否则HRM热更新无效
    stats: "errors-only", // 控制台日志 仅错误时打印
    devtool:"cheap-module-source-map",
    cache: {
        type: 'filesystem',
        // 可选配置
        buildDependencies: {
            config: [__filename], // 当构建依赖的config文件（通过 require 依赖）内容发生变化时，缓存失效
        },
        name: 'development-cache', // 配置以name为隔离，创建不同的缓存文件，如生成PC或mobile不同的配置缓存
    },
    plugins: [
        new ReactRefreshWebpackPlugin({
            overlay:false
        }), // 添加热更新插件
    ],
    devServer: {
        port: 9527,
        // hot: true, // 热更新，开启后不需要在使用HRM插件
        open: true, // 自动打开浏览器
        historyApiFallback: true, 
        client: {
            // progress: true, // 打包进度
            logging: 'info', // 允许在浏览器中设置日志级别
            overlay: { // 当出现编译错误或警告时，在浏览器中显示全屏覆盖。
                errors: true,
                warnings: false,
            },
        },
        proxy: {
            '/futures': {
              target: 'http://119.28.111.167:8181',
            //   pathRewrite: { "^/hk": "" },
              changeOrigin: true,
              secure: false,
            }
          }

    },
    optimization: {
        moduleIds: "deterministic",
    },
}


module.exports = (env) => {
    return new Promise((resolve, reject) => {
        //查找端口号
        portfinder.getPort({
            port: 9527, // 最小端口号
            stopPort: 9999 // 最大端口号
        }, (err, port) => {

            if (err) {
                reject(err);
                return;
            }

            //端口被占用时就重新设置evn和devServer的端口
            devConfig.devServer.port = port;
            const _plugins = [
                // 终端输出美化
                new FriendlyErrorsWebpackPlugin({
                    compilationSuccessInfo: {
                        messages: [`You application is running here. \n\n     Local:            http://localhost:${port}/ \n     On Your Network:  http://${ip.address()}:${port}/`]
                    },
                    clearConsole: true,
                }),
            ]
            devConfig.plugins = [...devConfig.plugins,..._plugins ]
            return resolve(merge(common(env), devConfig));
        });

    });
}