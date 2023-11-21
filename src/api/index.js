//  公共API
import { Fetch } from "@/utils/http/Fetch";


/**
 *用戶信息
 *
 * @export
 * @param {*} [data={}]
 * @return {*} 
 */
export function USER_INFO(data = {}) {
    return Fetch("/user/account/curr",{ method: "post", data });
}


/**
 *获取资源服务地址前缀
 *
 * @export
 * @param {*} [data={}]
 * @return {*} 
 */
export function RESOURCE_URL(data = {}) {
    return Fetch("/rsi/rsiDetail", { method: "post", data });
}


/**
 *圖片上傳
 *
 * @export
 * @param {*} [data={}]
 * @return {*} 
 */
export function UPLOAD(data = {}) {
    return Fetch("/rsi/upload/img", { method: "post", data });
}