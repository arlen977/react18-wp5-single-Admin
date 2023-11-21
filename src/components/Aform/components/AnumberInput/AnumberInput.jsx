import React, { useState } from "react";
import { Input } from "antd";

/**
 *只允许输入数字 可选择保留小数位数 与ant inputNumber 功能相似 但保留Input组件其他功能 可与表单一起使用
 *
 * @author zhaozy
 * @date 2021/07/21
 * @param toFixed 保留小数位数 默认0 为整数
 * @param min 可输入最小值 默认不限制
 * @param max 可输入最大值 默认不限制
 * @returns {*}
 */
const AnumberInput = props => {
    const { value, name, onChange, toFixed = 0, disabled, readOnly, min = undefined, max = undefined, elOptions } = props;
    const [val, setVal] = useState();

    const triggerChange = changedValue => {
        return onChange(changedValue[name]);
    };

    const onValChange = e => {
        if (isNaN(parseInt(e.target.value))) {
            setVal("");
            triggerChange({
                [name]: "",
            });
            return;
        }
        let newVal = "";
        //   去除空格
        let trimVal = e.target.value.replace(/(^\s*)|(\s*$)|([^\d.])/g, "");
        // let trimVal = e.target.value.replace(/[^\d+.d*$]/g, "");
        // let trimVal = e.target.value.replace(/^[1-9]\d*\.\d*|0\.\d*[1-9]\d*$/g, "");

        // 整数
        if (toFixed === 0) {
            if (trimVal === "") {
                newVal = trimVal;
            } else {
                newVal = parseInt(trimVal);
            }
        } else {
            // 小数 保留指定位数  不使用 fixed 会自动四舍五入
            const index = trimVal.indexOf(".");
            if (trimVal === "") {
                newVal = trimVal;
            } else {
                if (index !== -1) {
                    const _val = trimVal.substr(0, index + 1) + trimVal.substr(index + 1, toFixed);
                    newVal = _val;
                } else {
                    newVal = parseInt(trimVal);
                }
            }
        }

        // 最小数
        if (trimVal && min && parseInt(trimVal) < min) {
            newVal = min;
        }
        // 最大数
        if (trimVal && max && parseInt(trimVal) > max) {
            newVal = max;
        }
        setVal(newVal);

        triggerChange({
            [name]: newVal,
        });
    };

    return (
        <Input
            type="text"
            value={value || val}
            onChange={onValChange}
            allowClear
            disabled={disabled}
            readOnly={readOnly}
            placeholder={props.placeholder ? props.placeholder : props.label}
            {...elOptions}
        />
    );
};

export default AnumberInput;
