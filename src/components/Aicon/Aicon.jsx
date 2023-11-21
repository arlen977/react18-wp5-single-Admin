import React, { Fragment, useState, useEffect } from "react";
import Icon from "@ant-design/icons";

/**
 * 自定义icon
 * 传入svg名称
 * <Aicon name={item.icon}></Aicon>
 */

const Aicon = props => {
    const [component, setComponent] = useState(null);
    useEffect(() => {
        const url = props.path
            ? import("../../assets/icon/" + props.path + "/" + props.name + ".svg?url")
            : import("../../assets/icon/" + props.name + ".svg?url");
        url.then(({ default: Component }) => {
            setComponent(Component);
        }).catch(() => {
            setComponent(null);
        });
    },[props.name]);

    return(
        <Fragment>{component ? <Icon component={()=>component} {...props}></Icon> : null}</Fragment>
    )
};

export default Aicon


