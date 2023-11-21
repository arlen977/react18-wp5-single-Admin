import React from "react";

// 颜色文字
/**
 *颜色文字 传入type
 *
 * @author zhaozy
 * @date 2021/07/09
 * @param props
 * @returns {*}
 */
const AcolorText = props => {
    const colors = {
        success: "#52c41a",
        error: "#ff0000",
        processing: "#1890ff",
    };
    return (
        <span style={{ color: colors[props.type] }}>
            {props.children !== "" && props.children !== undefined && props.children !== null ? props.children : "-"}
        </span>
    );
};

export default AcolorText;
