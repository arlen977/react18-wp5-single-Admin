import { Fetch } from "@/utils/http/Fetch";

/**
 *用户登录 mock
 *
 * @author zhaozy
 * @date 2021/03/11
 * @export
 * @param data
 * @returns {*}
 */
export function USER_LOGIN(data = {}) {
    return Fetch("/user/login",{ method: "post", data });
}
