import React from "react";
import { proxy } from "valtio";
import { USER_INFO, RESOURCE_URL } from "@/api";
import { routes, lazyLoad } from "@/routes";
import Storage from "@/utils/storage";
import testMenu from "@/routes/testMenu";
import { arrComb, flatten, reviseArr ,deepClone} from "@/utils";

const storage = new Storage();

// 公共狀態
const store = proxy({
    menuData: storage.reduxStorageS("menuData", []),
    appRoutes: storage.reduxStorageS("appRoutes", routes),
    ws: null,
    wsData: {},
    userInfo: storage.reduxStorageS("userInfo"),
    resourceUrl: storage.reduxStorageS("resourceUrl", ""), //资源服务前缀
    tabBarActive: storage.reduxStorageS("tabBarActive", "home"), // 選中菜單
    languageList: [
        { label: "繁体中文", value: "zh-Hant" },
        { label: "English", value: "en" },
    ],
    getUserInfo: async () => {
        const { code, data } = await USER_INFO();
        storage.setS("userInfo", data);
        store.userInfo = data;
        // 登錄後socket握手
        React.$ws.send(
            JSON.stringify({
                command: 599,
                data: {
                    token: React.$storage.getS("Token"),
                },
            })
        );
    },
    getResourceUrl: async () => {
        const { code, data } = await RESOURCE_URL();
        storage.setS("resourceUrl", data);
        store.resourceUrl = data;
    },
    // socket 數據變化
    handleMessage: (e, open) => {
        store.wsData = e;
    },

    testMenu: () => {
        setTimeout(() => {
            let { menuList, routerList } = reviseArr({ arr: testMenu, id: "id", path: "path", icon: "icon", title: "name", children: "childs" });
            store.menuData = menuList;
            storage.setS("menuData", menuList);
            // storage.setS("appRoutes", routerList);

        }, 2000);
    },
});

export default store;
