import "./index.less";
import React, { useState } from "react";
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import ComponentHeader from "./components/Header";
import ComponentSider from "./components/Sider";

const { Content } = Layout;

const PagesLayout = () => {
    const [componentShow, _] = useState("1"); //是否隐藏侧边栏，顶栏，缓存tab  1 不隐藏

    return (
        <div className="">
            <Layout className={"home_layout"}>
                <ComponentHeader></ComponentHeader>
                <Layout style={{ overflow: "hidden", paddingBottom: "12Px", paddingTop: componentShow === "1" ? "0" : "12Px" }}>
                    <ComponentSider></ComponentSider>
                    <Layout>
                        <Content className={"home_layout_content"}>
                            {/* {keepingTabShow && <KeepingTabs></KeepingTabs>} */}
                            {/* <Breadcrumb></Breadcrumb> */}
                            <div className="content_box">
                                <div id="aLayoutContent" className={"content"}>
                                    <Outlet />
                                    {/* <RenderRoutes routes={routers}></RenderRoutes> */}
                                </div>
                            </div>
                        </Content>
                    </Layout>
                </Layout>
                {/* {process.env.NODE_ENV !== "production" && <ConfigDrawer></ConfigDrawer>} */}
            </Layout>
        </div>
    );
};

export default PagesLayout;
