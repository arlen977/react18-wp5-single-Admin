// cdn 根路径
exports.cdnBaseHttp = "https://arlencc.oss-cn-hongkong.aliyuncs.com/cdn";
const APP_ENV = process.env.APP_ENV;
const isEnvProduction = APP_ENV === 'production';

// name 模块名称，与package.json同名 scope 模块作用域命名 js js地址 css css地址

// 开发环境需要的js工具
const devToolsCdn = !isEnvProduction ? [{
        name: 'eruda',
        scope: 'eruda',
        version: "2.4.1",
        js: 'eruda.min.js',
    },
    {
        name: 'eruda',
        scope: 'eruda',
        version: "2.4.1",
        js: 'erudaInit.js',
    }
] : [];
// 生产cdn
const prodCdn = [{
        name: 'axios',
        scope: 'axios',
        version: "0.24.0",
        js: 'axios.min.js'
    },
    // { name: 'element-ui', scope: 'ELEMENT', js: 'index.js', css: 'theme-chalk/index.css' },
]

// 最终 cdn 配置
exports.externalConfig = [
    ...devToolsCdn,
    // ...prodCdn

]


// 导出cdn模块配置
exports.getExternalModules = config => {
    let externals = {}; // 结果
    config = config || this.externalConfig; // 默认使用utils下的配置
    config.forEach(item => { // 遍历配置
        // 拼接css 和 js 完整链接
        item.css = item.css && [this.cdnBaseHttp, item.name, item.version, item.css].join('/');
        item.js = item.js && [this.cdnBaseHttp, item.name, item.version, item.js].join('/');
        externals[item.name] = item.scope; // 为打包时准备
    });
    return externals;
};






// // 获取版本号 
// exports.getModulesVersion = () => {
//     let mvs = {};
//     let regexp = /^npm_package_.{0,3}dependencies_/gi;
//     for (let m in process.env) { // 从node内置参数中读取，也可直接import 项目文件进来
//         if (regexp.test(m)) { // 匹配模块
//             // 获取到模块版本号
//             mvs[m.replace(regexp, '').replace(/_/g, '-')] = process.env[m].replace(/(~|\^)/g, '');
//         }
//     }
//     return mvs;
// };