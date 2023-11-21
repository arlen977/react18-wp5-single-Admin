import React, { useState, useEffect } from "react";
import { HashRouter } from "react-router-dom";
import { RouterGurad } from "@/routes/guard";
import { routes } from "@/routes";
import store from "@/store";
import { reviseArr, deepClone } from "@/utils";
import { useSnapshot } from "valtio";
import { px2remTransformer, StyleProvider } from "@ant-design/cssinjs";

import "./App.less";

const App = () => {
    const { menuData } = useSnapshot(store);
    const [appRoutes, setAppRoutes] = useState(routes);

    const px2rem = px2remTransformer({
        rootValue: 160, // 32px = 1rem; @default 16
    });

    useEffect(() => {
        let { routerList } = reviseArr({ arr: deepClone(menuData), id: "id", path: "path", icon: "icon", title: "name", children: "childs" });
        setAppRoutes(routerList);
    }, [menuData]);

    return (
        <StyleProvider transformers={[px2rem]}>
            <HashRouter>
                <RouterGurad routes={appRoutes}></RouterGurad>
            </HashRouter>
        </StyleProvider>
    );
};

export default App;
