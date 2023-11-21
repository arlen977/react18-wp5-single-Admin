import React from "react";

const importAll = requireContext => requireContext.keys().forEach(requireContext);
try {
    importAll(require.context("../../assets/icon/lego/", true, /\.svg$/));
} catch (error) {
    console.log(error);
}

/**
 *Lego icon 封装
 *
 * @param {*} props
 * @return {*}
 */
function LegoIcon(props) {
    const { name, size, className } = props;
    let width, height;
    // 传入数字
    if (size) {
        // 是数字类型
        if (!isNaN(size)) {
            width = size;
            height = size;
        }
        // 如果是数组类型
        if (size instanceof Array) {
            width = size[0];
            height = size[1];
        }
    } else {
        width = 20;
        height = 20;
    }
    return (
        <>
            {name ? (
                <svg className={["lego_icon", className].join(" ")} style={{ width: width + "px", height: height + "px" }}>
                    <use xlinkHref={"#" + name} />
                </svg>
            ) : null}
        </>
    );
}

export default LegoIcon;
