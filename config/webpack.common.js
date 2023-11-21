/* eslint-disable */
// webpack 公共配置
const path = require("path");
const getCSSModuleLocalIdent = require("react-dev-utils/getCSSModuleLocalIdent");
const Dotenv = require("dotenv-webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const cdnConfig = require("./cdn");
const externalConfig = JSON.parse(JSON.stringify(cdnConfig.externalConfig)); // 读取配置
cdnConfig.getExternalModules(externalConfig); // 获取到合适的路径（引用类型，自动改变）
const srcPath = path.join(__dirname, "..", "src"); // src 目录路径

const { theme } = require("antd/lib");
const { convertLegacyToken } = require("@ant-design/compatible/lib");

const { defaultAlgorithm, defaultSeed } = theme;

const mapToken = defaultAlgorithm(defaultSeed);
const v4Token = convertLegacyToken(mapToken);

// css/css module 正则表达式
const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;

// less/less module 正则表达式
const lessRegex = /\.less$/;
const lessModuleRegex = /\.module\.less$/;
// stylus/stylus module 正则表达式
const stylRegex = /\.styl$/;
const stylModuleRegex = /\.module\.styl$/;

const APP_ENV = process.env.APP_ENV; // 当前开发区分执行环境，该变量会有多个值
const APP_NODE_ENV = process.env.APP_NODE_ENV; // 当前编译环境变量，该变量只有development或者production

const isEnvDevelopment = APP_NODE_ENV === "development";
const isEnvProduction = APP_NODE_ENV === "production";

module.exports = env => {
    // 根据环境区分加载对应样式loader
    const getStyleLoaders = (cssOptions, preProcessor, more = []) => {
        const loaders = [
            isEnvDevelopment && require.resolve("style-loader"), //style-loader与MiniCssExtractPlugin冲突，所以需要区分加载
            isEnvProduction && {
                loader: MiniCssExtractPlugin.loader,
            },
            {
                loader: require.resolve("css-loader"),
                options: cssOptions,
            },
            {
                loader: require.resolve("postcss-loader"),
            },
        ].filter(Boolean);
        if (preProcessor) {
            loaders.push(
                {
                    loader: require.resolve("resolve-url-loader"),
                    options: {
                        sourceMap: isEnvProduction,
                    },
                },
                ...more
            );
        }
        return loaders;
    };
    return {
        entry: path.join(__dirname, `../src/index.js`),
        plugins: [
            // 加载对应的环境变量文件
            new Dotenv({
                path: path.join(__dirname, `../.env.${APP_ENV}`),
                systemvars: true,
            }),
            // 生成 index.html
            new HtmlWebpackPlugin({
                template: path.join(__dirname, "..", `public/index.html`),
                filename: `index.html`,
                cdnConfig: [],
                // onlyCss: false, //加载css
            }),
        ],
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "../src"),
            },
            extensions: [".jsx", ".js"],
        },
        module: {
            rules: [
                {
                    test: /\.(jsx|js|tsx|ts|)?$/,
                    use: [
                        {
                            loader: "babel-loader",
                            options:{
                                plugins:[
                                    isEnvDevelopment&&require.resolve('react-refresh/babel')
                                ].filter(Boolean)
                            }
                        },
                    ],
                    include: srcPath,
                    exclude: [/node_modules/],
                },
               
                {
                    test: cssRegex,
                    exclude: cssModuleRegex,
                    use: getStyleLoaders({
                        importLoaders: 1,
                        sourceMap: isEnvProduction,
                    }),
                },
                {
                    test: cssModuleRegex,
                    use: getStyleLoaders({
                        importLoaders: 1,
                        sourceMap: isEnvProduction,
                        modules: {
                            getLocalIdent: getCSSModuleLocalIdent,
                        },
                    }),
                },
              
                
                {
                    test: stylRegex,
                    exclude: stylModuleRegex,
                    use: getStyleLoaders(
                        {
                            importLoaders: 2,
                            sourceMap: isEnvProduction,
                        },
                        "stylus-loader"
                    ),
                },
                {
                    test: stylModuleRegex,
                    use: getStyleLoaders(
                        {
                            importLoaders: 2,
                            sourceMap: isEnvProduction,
                            modules: {
                                getLocalIdent: getCSSModuleLocalIdent,
                            },
                        },
                        "stylus-loader"
                    ),
                },
                {
                    test: lessRegex,
                    exclude: lessModuleRegex,
                    use: getStyleLoaders(
                        {
                            importLoaders: 2,
                            sourceMap: isEnvProduction,
                        },
                        true,
                        [
                            {
                                loader: "less-loader",
                               
                            },
                           
                        ]
                    ),
                    sideEffects: true,
                },
                {
                    test: lessModuleRegex,
                    use: getStyleLoaders(
                        {
                            importLoaders: 2,
                            sourceMap: isEnvProduction,
                            modules: {
                                getLocalIdent: getCSSModuleLocalIdent,
                            },
                        },
                        true,
                        [
                            {
                                loader: "less-loader",
                              
                            },
                        ]
                    ),
                },
                {
                    test: /\.svg$/,
                    use: ["@svgr/webpack"],
                    resourceQuery: /url/, // *.svg?url
                },
                {
                    test: /\.svg$/,
                    use: [
                        { loader: "svg-sprite-loader", options: {} },
                        {
                            loader: "svgo-loader",
                            options: {
                                plugins: [
                                    {
                                        name: "removeAttrs",
                                        params: {
                                            attrs: "(stroke)",
                                        },
                                    },
                                    {
                                        name: "removeAttributesBySelector",
                                        params: {
                                            selectors: [
                                                // 找到对应的值 删除
                                                { selector: "[fill = 'none']", attributes: "fill" },
                                                { selector: "[fill = '#B6C2CD']", attributes: "fill" },
                                            ],
                                        },
                                    },
                                    // 自定义插件
                                    {
                                        name: "customPluginName",
                                        type: "perItem", // 'perItem', 'perItemReverse' or 'full'
                                        params: {
                                            optionName: "#324558",
                                        },
                                        fn: (ast, params, info) => {
                                            if (ast?.attributes?.fill === "#324558") {
                                                ast.attributes.fill = "currentColor";
                                            }
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                    resourceQuery: { not: [/url/] },
                },
                {
                    test: /\.(jpe?g|png|gif|woff|woff2|eot|ttf|otf)$/i,
                    type: "asset/resource",
                    generator: {
                        filename: 'static/image/[hash][ext][query]'
                    }
                },
            ],
        },
    };
};
