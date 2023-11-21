import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useRequest } from "ahooks";
import Atable from "@/components/Atable/AtableN";
import { getSecondsBetList, getLanguageList } from "../../api";
import { mergeColumns } from "@/utils";

//

const _columns = mergeColumns([
    {
        title: "终端机身号",
        dataIndex: "pairsName",
        width: 250,
        fixed: "left",
    },
    {
        title: "设备状态",
        dataIndex: "settleStatus",
        width: 80,
        formatSource: [
            { value: 1, text: "正常" },
            { value: "2", text: "冻结" },
            { value: "3", text: "注销" },
        ],
    },
    {
        title: "收款标识",
        dataIndex: "isWin",
        width: 100,
        formatSource: [
            { value: 1, text: "收款费率" },
            { value: 1, text: "非收款费率" },
        ],
    },
    {
        title: "设备密码",
        dataIndex: "profit",
        width: 150,
    },
    {
        title: "操作",
        key: "111",
        fixed: "right",
        render: (text, record) => {
            return (
                <div className="common-tabel-operation">
                    {/* 查看设备 */}
                    {/* <LookForm selectedKey={record.equipCsn}></LookForm> */}
                    {/* 设备解绑 */}
                    {/* {record.bindstatus === "B" && <EquipUnbind selectedKey={record.equipCsn} onTableRef={() => this.tableRef}></EquipUnbind>} */}
                </div>
            );
        },
    },
]);

const DataTable = () => {
    const [columns, SetColumns] = useState(_columns);
    let formdata = new FormData();
    formdata.append("account", "123123123@123.com");
    formdata.append("password", "123456");
    formdata.append("loginType", "email");

    const { data, runAsync, run } = useRequest(
        params => getLanguageList(),

        {
            manual: true,
            defaultParams: [{ id: "2" }],
            onBefore: params => {
                console.log("執行前");
                // throw new Error("停止請求");
            },
        }
    );

    useEffect(() => {
        run();
    }, []);

    return (
        <div>
            <Atable
                // ref={this.tableRef}
                rowKey={"equipCsn"}
                // loadUrl={getSecondsBetList}
                columns={columns}
                dataSourceKey={"records"}
                // rowSelection={rowSelection}
                // renderTitleRight={this.renderTitleRight}
                // searchForm={SearchForm}
            ></Atable>
        </div>
    );
};

export default DataTable;
