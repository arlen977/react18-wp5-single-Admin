import "./index.less";
import React from "react";
import { Layout, Row, Col, Avatar, Modal } from "antd";
import { Aicon } from "@/components";
import Notice from "./Notice";

const { Header } = Layout;

const ComponentHeader = () => {
    const userInfo = {};
    return (
        <div id="aHeader">
            <Header className="header">
                <Row className="header_row">
                    <Col span="10" className="common-flex-align header_col">
                        <div className="welcome_text">
                            您好，欢迎<span className="welcome_name"> {userInfo?.name || "admin"} </span>进入管理平台
                        </div>
                    </Col>
                    <Col span="14" className="common-text-right header_col">
                        <div className="header_menu">
                            <div className="header_menu_item">
                                <Notice></Notice>
                            </div>
                            <div className="header_menu_item">{/* <UpdatePasswordForm></UpdatePasswordForm> */}</div>
                            <div className="header_menu_item">
                                <Aicon name="tuichu" className="header_menu_icon"></Aicon>
                                <span onClick={() => {}}>退出登录</span>
                            </div>
                            <div className="header_menu_item">
                                <Avatar
                                    className="header_menu_icon header_menu_avatar"
                                    src={"https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"}
                                />
                                <span>{userInfo.name}</span>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Header>
        </div>
    );
};

export default ComponentHeader;
