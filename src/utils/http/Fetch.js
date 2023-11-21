// 統一fetch
import Storage from "@/utils/storage";
const storage = new Storage();

const baseUrl = window.envConfig[process.env.APP_ENV].baseUrl

function changeDataType(obj) {
    const formData = new FormData();
    if (typeof obj === "object") {
        for (let i in obj) {
            formData.append(i, obj[i]);
        }
    }
    return formData;
}

export const Fetch = async (url, options) => {
    const res = await fetch(baseUrl+url, {
        method: options.method,
        headers: {
            'x7cp54t24yywtx':storage.getS('Token'),
            'Accept-Language':storage.getS('language'),
            ...options.headers,
        },
        body: changeDataType(options.data),
        // referrer: "about:client",
        // referrerPolicy: "no-referrer-when-downgrade",
        mode: "cors",
        // credentials: "same-origin",
        // cache: "default",
        // redirect: "follow",
        // integrity: "",
        // keepalive: false,
        // signal: undefined,
        ...options,
    });
    console.log(`%c接口 ${url} 请求数据：`, "color:#8cdcfe;font-size:13px;", options.data); // 方便调试查看
    return res.json().then(data => {
        console.log(`%c接口 ${url} 返回数据：`, "color:#00be00;font-size:13px;", data); // 方便调试查看
        return data;
    });
};

// cache    指定如何处理缓存
//          default：默认值，先在缓存里面寻找匹配的请求。
//          no-store：直接请求远程服务器，并且不更新缓存。
//          reload：直接请求远程服务器，并且更新缓存。
//          no-cache：将服务器资源跟本地缓存进行比较，有新的版本才使用服务器资源，否则使用缓存。
//          force-cache：缓存优先，只有不存在缓存的情况下，才请求远程服务器。
//          only-if-cached：只检查缓存，如果缓存里面不存在，将返回504错误。

// mode     指定请求的模式
//          cors：默认值，允许跨域请求。
//          same-origin：只允许同源请求。
//          no-cors：请求方法只限于 GET、POST 和 HEAD，并且只能使用有限的几个简单标头，不能添加跨域的复杂标头，相当于提交表单所能发出的请求。

// credentials  属性指定是否发送 Cookie
//              same-origin：默认值，同源请求时发送 Cookie，跨域请求时不发送。
//              include：不管同源请求，还是跨域请求，一律发送 Cookie。
//              omit：一律不发送。

// signal       指定一个 AbortSignal 实例，用于取消fetch()请求

// keepalive    属性用于页面卸载时，告诉浏览器在后台保持连接，继续发送数据

// redirect     属性指定 HTTP 跳转的处理方法
//              follow：默认值，fetch()跟随 HTTP 跳转。
//              error：如果发生跳转，fetch()就报错。
//              manual：fetch()不跟随 HTTP 跳转，但是response.url属性会指向新的 URL，response.redirected属性会变为true，由开发者自己决定后续如何处理跳转。

// integrity    属性指定一个哈希值，用于检查 HTTP 回应传回的数据是否等于这个预先设定的哈希值

// integrity    属性指定一个哈希值，用于检查 HTTP 回应传回的数据是否等于这个预先设定的哈希值 这个属性可以为任意字符串，也可以设为空字符串（即不发送referer标头）

// referrerPolicy   属性用于设定Referer标头的规则
//                  no-referrer-when-downgrade：默认值，总是发送Referer标头，除非从 HTTPS 页面请求 HTTP 资源时不发送。
//                  no-referrer：不发送Referer标头。
//                  origin：Referer标头只包含域名，不包含完整的路径。
//                  origin-when-cross-origin：同源请求Referer标头包含完整的路径，跨域请求只包含域名。
//                  same-origin：跨域请求不发送Referer，同源请求发送。
//                  strict-origin：Referer标头只包含域名，HTTPS 页面请求 HTTP 资源时不发送Referer标头。
//                  strict-origin-when-cross-origin：同源请求时Referer标头包含完整路径，跨域请求时只包含域名，HTTPS 页面请求 HTTP 资源时不发送该标头。
//                  unsafe-url：不管什么情况，总是发送Referer标头。
