import { Fetch } from "@/utils/http/Fetch";

/**
 * mock table 数据
 *
 * @author zhaozy
 * @date 2021/03/11
 * @export
 * @param data
 * @returns {*}
 */
export function getSecondsBetList(data = {}) {
    return Fetch("/agent/getSecondsBetList", { method: "post", data });
}

export function getLanguageList(data) {
    return Fetch("/futures/api/user/getLanguageList", { method: "post", data });
}
