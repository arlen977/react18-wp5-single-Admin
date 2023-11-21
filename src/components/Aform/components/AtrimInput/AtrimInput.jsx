// 自动清除空格 Input组件 可与表单一起使用

import React, { useState } from "react";
import { Input } from "antd";

const AtrimInput = props => {
    const { value, name, onChange, elOptions, disabled, readOnly } = props;
    const [val, setVal] = useState();

    const triggerChange = changedValue => {
        return onChange(changedValue[name]);
    };

    const onValChange = e => {
        //   去除空格
        const newVal = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
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

export default AtrimInput;
