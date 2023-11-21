// 发送验证码 input

import React, { useState, useRef, useEffect } from "react";
import { Input, Button, Row, Col, message } from "antd";
// import { COMMON_SMS_SEND } from "@/api";
import { regExpConfig } from "@/utils/regular.config";

/**
 *发送验证码组件
 *
 * @author zhaozy
 * @date 2021/07/15
 * @param props phone 传入手机号
 * @param type  短信类型
 * @returns {*}
 */
const AauthCodeInput = props => {
    const { value, onChange, type, errorMsg = "请输入正确的手机号", inputProps } = props;
    const [count, setCount] = useState("获取验证码");
    const [disabled, setDisabled] = useState(false);
    const timerRef = useRef(); // 计时器

    // 组件卸载前清除定时器
    useEffect(() => {
        return () => {
            clearInterval(timerRef.current);
        };
    }, []);
    // 发送验证码
    const send = () => {
        const { phone } = props;
        let _phone;

        if (typeof phone === "function") {
            _phone = phone();
        } else if (typeof phone === "string") {
            _phone = phone;
        }
        if (!_phone || !regExpConfig.mobile.test(_phone)) {
            message.warning(errorMsg);
            return;
        }

        setDisabled(true);
        // COMMON_SMS_SEND({ phone: _phone, type: type })
        //     .then(res => {
        //         message.success(res.message);
        //         timekeeping();
        //     })
        //     .catch(err => {
        //         setDisabled(false);
        //     });
    };
    // 倒计时
    const timekeeping = () => {
        const { count = 60 } = props;
        let _count = count;
        timerRef.current = setInterval(() => {
            if (_count === 0) {
                clearInterval(timerRef.current);
                setCount("重新获取");
                setDisabled(false);
                return;
            }
            _count -= 1;
            setCount(_count + "s");
        }, 1000);
    };
    return (
        <Row justify={"space-between"}>
            <Col span={15}>
                <Input value={value} onChange={onChange} {...inputProps} />
            </Col>
            <Col flex="auto" className={"common-text-right"}>
                <Button className="common-line-button" disabled={disabled} style={{ width: "5.625rem" }} onClick={() => send()}>
                    {count}
                </Button>
            </Col>
        </Row>
    );
};
export default AauthCodeInput;
