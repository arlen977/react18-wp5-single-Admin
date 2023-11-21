import "./index.less";
import React from "react";
import { Layout } from "antd";
import Amenu from "@/components/Amenu";
import store from "@/store";
import { useSnapshot } from "valtio";
import { useMount } from "ahooks";
const { Sider } = Layout;

const ComponentSider = () => {
    const { menuData } = useSnapshot(store);

    useMount(() => {
        store.testMenu();
    });

    return (
        <Sider trigger={null} collapsible theme={"light"}>
            <Amenu subKey={"name"} data={menuData} childrenKey='childs'></Amenu>
        </Sider>
    );
};

export default ComponentSider;
