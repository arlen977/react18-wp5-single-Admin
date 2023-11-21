import React, { useEffect, useState } from "react";
import { Select } from "antd";

import Storage from "@/utils/storage";

const storage = new Storage();

/**
 *复用相同option的select
 *
 * @author zhaozy
 * @date 2021/05/17
 * @param selectType 为公共接口名 例 getUserTaskList 活动名称  selectType如果是remote的话 会调用传入的方法取数据
 * @returns {*}
 */
const Aselect = props => {
    const [list, setList] = useState([]);
    const { selectType, remoteFn = null, ..._props } = props;

    useEffect(async () => {
        if (selectType === "remote") {
            setList([]);
            const res = await remoteFn();
            console.log(res);
        } else {
            setList(storage.reduxStorageS(props.selectType, []));
        }
    }, [selectType]);

    return (
        <React.Fragment>
            <Select {..._props}>
                {list.map(o => (
                    <Select.Option value={o.value} key={o.value}>
                        {o.label}
                    </Select.Option>
                ))}
            </Select>
        </React.Fragment>
    );
};

export default Aselect;
