import React, { useState } from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { USER_LOGIN } from "./api";
// import { observer } from "mobx-react-lite";
// import { useStores } from "@/store";

import "./index.less";

const Login = () => {
    const navigate = useNavigate();
    // const { counterStore } = useStores();
    const counterStore={}
    const { counter ={}} = counterStore;
    console.log(counter);

    const [form, setForm] = useState({});

    const go = () => {
        setTimeout(() => {
            navigate("/");
        }, 1000);
        USER_LOGIN().then(res => {
            console.log(res);
        });
    };

    return (
        <div className="login_container">
            <div className="login_content">
                <div className="form_container">
                    <div className="title">
                        <img className="login_logo" src={process.env.REACT_APP_IMAGE + "/login_logo.png"} alt="" />
                    </div>
                    <Form
                        onFinish={() => {
                            navigate("/");
                        }}
                        className="login_form"
                        initialValues={form}
                    >
                        <Form.Item
                            name="username"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入用户名",
                                },
                            ]}
                        >
                            <Input
                                className="login_input"
                                prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)", fontSize: "20px" }} />}
                                placeholder="请输入用户名"
                                bordered={false}
                            />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: "请输入密码",
                                },
                            ]}
                        >
                            <Input
                                className="login_input"
                                prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)", fontSize: "20px" }} />}
                                type="password"
                                placeholder="请输入密码"
                                bordered={false}
                            />
                        </Form.Item>
                        {/* <Form.Item className="nc_container">
                            <div id="nc"></div>
                        </Form.Item> */}
                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login_form_button" loading={false} disabled={false}>
                                登 录
                            </Button>
                        </Form.Item>
                        <div>
                            <Button className="find_back_pwd" type="link" size="small" onClick={() => {}}>
                                忘记密码
                            </Button>
                        </div>
                    </Form>
                </div>
            </div>
            {/* <ForgetPwd visible={visible} close={this.close} onRef={this.onRef} /> */}
        </div>
    );
}

export default Login;
