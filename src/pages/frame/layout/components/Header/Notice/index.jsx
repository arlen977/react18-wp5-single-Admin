import "./index.less";
import React from "react";
// import { AiconFont } from "@/components";
import { Badge, Popover, Tabs, Avatar, notification } from "antd";

// import WSocket from "@/utils/http/socket";

const { TabPane } = Tabs;

const Notice = () => {
    const noticeData = [{ id: "1", content: "222", date: "1997" }];
    const renderTabs = () => {
        return (
            <React.Fragment>
                <Tabs defaultActiveKey="1" className="notice_tabs" centered>
                    <TabPane tab={`通知 (${noticeData.length})`} key="1">
                        <ul className="notice_content">
                            {noticeData.slice(-5).map(item => (
                                <li className="notice_item" key={item.id}>
                                    <div className="avatar">
                                        <Avatar size={40}>USER</Avatar>
                                    </div>
                                    <div className="content">
                                        <p className="value">{item.content}</p>
                                        <p className="date">{item.date}</p>
                                    </div>
                                </li>
                            ))}
                            {noticeData.length === 0 && (
                                <div className="no_notice">
                                    <img src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg" className="image" alt="" />
                                    <div className="tip">您已查看所有通知</div>
                                </div>
                            )}
                        </ul>
                    </TabPane>
                </Tabs>
                <div className="notice_footer">
                    <div className="_btn" onClick={() => {}}>
                        清空 通知
                    </div>
                    <div className="_btn">查看更多</div>
                </div>
            </React.Fragment>
        );
    };

    return (
        <div className="notice_container">
            <Popover content={renderTabs} trigger="click" overlayClassName={"notice_popover"}>
                <Badge count={noticeData.length}>11</Badge>
            </Popover>
        </div>
    );
};

export default Notice;
