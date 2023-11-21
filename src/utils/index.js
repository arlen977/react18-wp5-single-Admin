import React from "react";
import { AtableCellEllipsis, AcolorText } from "@/components";
import { lazyLoad, routes } from "@/routes";
import { Tooltip } from "antd";

/**
 *获取url参数
 *
 * @author zhaozy
 * @date 2021/04/23
 * @export
 * @param variable
 * @returns {*}
 */
export function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split("&");
    for (let i = 0; i < vars.length; i++) {
        const pair = vars[i].split("=");
        if (pair[0] === variable) {
            return pair[1];
        }
    }
    return false;
}

/**
 *获取某个字符出现的位置
 *
 * @export
 * @param {*} str
 * @param {*} queryStr
 * @param {*} pon
 * @return {*}
 */
export function findPosition(str, queryStr, pon) {
    var x = str.indexOf(queryStr);
    for (var i = 0; i < pon; i++) {
        x = str.indexOf(queryStr, x + 1);
    }
    return x;
}
/**
 *表格Columns 添加初始化默认值
 *
 * @author zhaozy
 * @date 2021/07/12
 * @export
 * @param columns
 * @param type   字段颜色
 * @param prefix   字段前部分拼接
 * @param suffix   字段后部分拼接 如 %
 * @returns {*}
 */
export function mergeColumns(columns) {
    let _columns = [];
    for (let item of columns) {
        const obj = {
            key: item.dataIndex,
            align: "center",
            visible: true,
            ellipsis: {
                showTitle: false,
            },
            render: value => (
                <AtableCellEllipsis>
                    <Tooltip placement="topLeft" title={formatSource(item, value, true)}>
                        <span style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>
                            {value !== "" && value !== undefined && value !== null && item.prefix}
                            {formatSource(item, value)}
                            {value !== "" && value !== undefined && value !== null && item.suffix}
                        </span>
                    </Tooltip>
                </AtableCellEllipsis>
            ),
            ...item,
        };
        _columns.push(obj);
    }
    return _columns;
}
// Columns 个别字段格式化  showTipValue为tooltip专用
function formatSource(item, value, showTipValue = false) {
    if (item.formatSource) {
        const data = item.formatSource;
        const com = data.find(i => i.value === value);
        // 如果匹配不到 并且传入了默认显示值
        if (com === undefined && data[data.length - 1]?.defaultValue) {
            if (showTipValue) return data[data.length - 1]?.defaultValue;
            return <AcolorText>{data[data.length - 1]?.defaultValue}</AcolorText>;
        }
        if (com) {
            if (showTipValue) return com.text;
            return <AcolorText type={com.type}>{com.text}</AcolorText>;
        }
    }

    // valueType 为可选颜色类型 不传默认黑色
    if (showTipValue) return value;
    return <AcolorText type={item.colorType}>{value}</AcolorText>;
}

/**
 *嵌套数组扁平化
 *
 * @author zhaozy
 * @date 2021/03/15
 * @export
 * @param arr
 * @returns {*}
 */
export function flatten(arr, childrenKey = "children") {
    let res = [];
    if (arr.length === 0) return res;
    for (let i = 0; i < arr.length; i++) {
        res.push(arr[i]);
        if (Array.isArray(arr[i][childrenKey])) {
            res = res.concat(flatten(arr[i][childrenKey], childrenKey));
        }
    }
    return res;
}

/**
 *数组关联组合 重组数据
 *
 * @author zhaozy
 * @date 2021/04/30
 * @export
 * @param arr
 * @param { id } 需要增加或替换数组内 key 对象
 * @param [isFlatten=false] 是否先拍平数组
 * @param [flattenkey] flatten 合并数组 子数组的key 默认children
 */
export function arrComb({
    arr = [],
    id = undefined,
    path = undefined,
    title = undefined,
    icon = undefined,
    parentId = undefined,
    isFlatten = false,
    flattenkey = "children",
}) {
    let list = arr;
    // 拍平
    if (isFlatten) {
        list = flatten(arr, flattenkey);
    }
    // 增加自定义属性并赋值
    for (let i of list) {
        id && (i["id"] = i[id]);
        path && (i["path"] = i[path]);
        title && (i["title"] = i[title]);
        icon && (i["icon"] = i[icon]);
        // 父级parentId是空 如果不是父级 设置增加自定义 id
        if (parentId && i[parentId]) {
            i["parentId"] = i[parentId];
            const parent = list.find(item => item[id] === i[parentId]);
            i["parentName"] = parent.menuName;
        } else {
            // 是父级删除重命名之前的children
            // i["children"] = i[flattenkey];
            delete i[flattenkey];
            i["path"] = "/" + i[path];
        }
    }
    // 重新组合
    let l = makeComb(list);
    return l;
}

export function makeComb(arr) {
    const carr = [].concat(arr);
    const map = new Map();
    carr.forEach(function (item) {
        map.set(item.id, Object.assign(item));
    });
    const v = [];
    for (const item of carr) {
        const parent = map.get(item.parentId);
        if (parent) {
            (parent.children || (parent.children = [])).push(item);
        } else {
            v.push(item);
        }
    }
    return v;
}

/**
 *遍歷數組 修改與增加對應值 返回合適的菜單與路由數據結構
 *
 * @export
 */
export function reviseArr({ arr = [], id = undefined, path = undefined, title = undefined, icon = undefined, children = undefined }) {
    const menuList = arr;
    // 增加自定义属性并赋值
    for (let i of menuList) {
        id && (i["id"] = i[id]);
        path && (i["path"] = i[path]);
        title && (i["title"] = i[title]);
        icon && (i["icon"] = i[icon]);
        children && (i["children"] = i[children]);

        // 1 說明是父級
        if (i.type !== 1) {
            i.element = lazyLoad(`business/${i.path}`);
            i.meta = { title: i.title };
        }

        if (i[children]) {
            reviseArr({ arr: i[children], path, title, icon, children });
        }
        // // 父级parentId是空 如果不是父级 设置增加自定义 id
        // if (parentId && i[parentId]) {
        //     i["parentId"] = i[parentId];
        //     const parent = list.find(item => item[id] === i[parentId]);
        //     i["parentName"] = parent.menuName;
        // } else {
        //     // 是父级删除重命名之前的children
        //     // i["children"] = i[flattenkey];
        //     delete i[flattenkey];
        //     i["path"] = "/" + i[path];
        // }
    }

    const routerList = [...routes];

    const r = (flatten(menuList, "childs") || []).filter(item => item.type !== 1);

    routerList.map(item => {
        if (item.path === "/") {
            item.children = r;
        }
    });

    return { menuList, routerList };
}

/**
 *对象深克隆
 *
 * @author zhaozy
 * @date 2021/04/30
 * @param origin
 * @param target
 * @returns {*}
 */
export function deepClone(obj) {
    if (typeof obj !== "object" || obj === null) {
        return obj;
    }

    let result = Array.isArray(obj) ? [] : {};

    for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
            result[key] = deepClone(obj[key]);
        }
    }

    return result;
}
