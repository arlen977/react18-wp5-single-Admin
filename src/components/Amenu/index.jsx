import "./index.less";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Aicon } from "@/components";
import { Menu } from "antd";
import Storage from "@/utils/storage";

const storage = new Storage();

/**
 *後台權限菜單
 *
 * subKey 菜單key字段 默認id
 * data menu數據data
 * childrenKey 多級菜單子元素需要拍平 所需key名 默認 children
 * @return {*}
 */
const Amenu = props => {
    const { subKey = "id", data = [],childrenKey="children" } = props;

    const navigate = useNavigate();

    const [openKeys, setOpenKeys] = useState([]); // 打開菜單數組
    const [rootSubmenuKeys, setRootSubmenuKeys] = useState([]); // 所有一級菜單subKey 數組

    // 菜单开启、关闭事件
    const onOpenChange = keys => {
        const latestOpenKey = keys.find(key => openKeys.indexOf(key) === -1);
        if (latestOpenKey && rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            setOpenKeys(keys);
            storage.setS("menuInfo", { ...storage.getS("menuInfo"), openKeys: keys });
        } else {
            // 二級菜單展開
            if(!latestOpenKey&&keys.length>0){
                setOpenKeys(keys);
                storage.setS("menuInfo", { ...storage.getS("menuInfo"), openKeys: keys });
                return
            }
            setOpenKeys(latestOpenKey ? [latestOpenKey] : []);
            storage.setS("menuInfo", { ...storage.getS("menuInfo"), openKeys: latestOpenKey });
        }
    };

    // 获取一级sub菜单id
    const getRootSubmenuKeys = () => {
        const { openKeys } = storage.reduxStorageS("menuInfo", {}); // 取出缓存的已打开菜单和选中菜单
        const keys = [];
        let _openKeys = [];

        if (data.length === 0) return;

        for (const i of data) {
            keys.push(i[subKey]);
        }

        if (openKeys) {
            _openKeys = openKeys;
        } else {
            // 无缓存 设置默认展开菜单数组 默认展开第一条菜单
            _openKeys = [keys[0]] ? [keys[0]] : [];
        }
        setOpenKeys(_openKeys);
        setRootSubmenuKeys(keys);
        storage.setS("menuInfo", { ...storage.getS("menuInfo"), openKeys: _openKeys });
    };

    // 渲染菜單
    const renderItem = menuList => {
        const list = menuList.map(item => {
            if (item.children) {
                const c = renderItem(item.children);
                return {
                    key: item.name,
                    icon: item.icon && <Aicon name={item.icon}></Aicon>,
                    label: item.title,
                    children: c,
                };
            } else {
                return {
                    key: item.name,
                    icon: item.icon && <Aicon name={item.icon}></Aicon>,
                    label: item.title,
                    onClick: () => {
                        navigate(item.path);
                    },
                };
            }
        });
        return list;
    };

    useEffect(() => {
        getRootSubmenuKeys();
    }, [data]);

    return (
        <div className="menu_content">
            <Menu
                mode="inline"
                openKeys={openKeys}
                onOpenChange={onOpenChange}
                // motion={{motionName:'my_menu'}}
                style={{
                    height: "100%",
                    borderRight: 0,
                }}
                items={renderItem(data)}
            />
        </div>
    );
};
export default Amenu;
