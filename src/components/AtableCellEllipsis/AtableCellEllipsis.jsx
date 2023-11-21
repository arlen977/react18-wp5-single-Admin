import React from "react";

/**
 *表格单元格超出隐藏 解决table max-content问题
 *
 * @author zhaozy
 * @date 2021/07/09
 * @param props
 * @returns {*}
 */
const AtableCellEllipsis = props => {
    return (
        <div style={{ display: "grid", placeItems: "stretch" }}>
            <div style={{ whiteSpace: "nowrap", textOverflow: "ellipsis", overflow: "hidden" }}>{props.children}</div>
        </div>
    );
};
export default AtableCellEllipsis;
