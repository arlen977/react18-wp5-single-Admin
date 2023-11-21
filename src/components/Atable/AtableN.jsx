import React, { useState, useRef, useImperativeHandle, useEffect } from "react";
import { Checkbox, Space, Row, Col, Table, Button } from "antd";
import { ReloadOutlined } from "@ant-design/icons";

const Atable = props => {
    const { pagination, searchFormProps = {}, ...data } = props;
    const formRef = useRef();
    const [defState, setDefState] = useState({
        x: "max-content",
        rowKey: "id",
        size: "small",
        sticky: false,
        dataSource: [],
        dataSourceKey: "result",
        scrollToFirstRowOnChange: true,
        showTool: true, // 是否展示列表头
        pagiFieldsName: {}, // 自定义pagination的传参值
        pagination: {
            defaultPageSize: 10,
            total: 20,
            pageSize: 20,
            current: 1,
            pageSizeOptions: ["10", "20", "50", "100", "500"],
            showQuickJumper: true,
            showSizeChanger: true,
            showTotal: total => `共 ${total} 条`,
            onShowSizeChange: () => {},
            onChange: (current, pageSize) => {
                onTableChange(current, pageSize);
            },
            ...pagination,
        },
        fetchParams: {},
        ...data,
    });

    // // 合并props
    // static getDerivedStateFromProps(props) {
    //     // 只接受部分更改
    //     return {
    //         loading: props.loading,
    //         rowSelection: props.rowSelection,
    //         fetchParams: props.fetchParams,
    //         columns: props.columns,
    //         dataSource: props.dataSource !== undefined ? props.dataSource : [],
    //     };
    // }

    useEffect(() => {
        loadData();
    });

    // 装载表格数据
    const loadData = () => {
        const { dataSourceKey, pagiFieldsName } = defState;
        const { current, pageSize } = defState.pagination;
        let searFormData = {};
        const { num = "pageNum", size = "pageSize" } = pagiFieldsName;
        // 如果有搜索表单
        if (props.searchForm) {
            const formRef = formRef.current.formRef.current; // 获取 AsearchForm组件实例
            searFormData = formRef.getFormValue();
        }
        // 执行请求
        props.loadUrl &&
            props
                .loadUrl({ [num]: current, [size]: pageSize, ...searFormData, ...defState.fetchParams })
                .then(res => {
                    // 每次查询后清空选中的数据
                    defState.rowSelection && defState.rowSelection.onChange([]);
                    setDefState({
                        ...defState,
                        dataSource: res.data instanceof Array ? res.data : res.data[dataSourceKey],
                        pagination: {
                            ...defState.pagination,
                            total: res.data.count,
                            pageSize: res.data.pageSize,
                            current: res.data.pageNum,
                        },
                    });
                })
                .catch(err => {
                    console.log(err);
                    // 加载数据错误或者权限校验拦截之类 抛出err
                    props.onError && props.onError(err);
                });
    };

    // table 页面获取表单值
    const getSearchFormValue = () => {
        return formRef.current.formRef.current.getFormValue();
    };

    // 表单查询按钮触发
    const onSearch = () => {
        setDefState(
            {
                ...defState,
                pagination: {
                    ...defState.pagination,
                    current: 1,
                },
            }
            // () => {
            //     loadData();
            // }
        );
    };

    // 如果行可选 点击行 选中
    const selectRow = record => {
        if (!defState.rowSelection) return;
        if (record.noChecked) return;
        const { rowKey } = defState;
        let selectedRowKeys = [...defState.rowSelection.selectedRowKeys];
        let selectedRows = [...defState.rowSelection.selectedRows];
        // 单选
        if (defState.rowSelection.type === "radio") {
            if (selectedRowKeys.indexOf(record[rowKey]) >= 0) {
                selectedRowKeys = [];
            } else {
                selectedRowKeys = [];
                selectedRowKeys.push(record[rowKey]);
            }
        } else {
            // 多选
            if (selectedRowKeys.indexOf(record[rowKey]) >= 0) {
                selectedRowKeys.splice(selectedRowKeys.indexOf(record[rowKey]), 1);
                selectedRows.splice(selectedRows.indexOf(record[rowKey]), 1);
            } else {
                selectedRowKeys.push(record[rowKey]);
                selectedRows.push(record);
            }
        }

        defState.rowSelection.onChange(selectedRowKeys, selectedRows);
    };
    // 表格页数改变事件
    const onTableChange = (current, pageSize) => {
        setDefState(
            {
                ...defState,
                pagination: {
                    ...defState.pagination,
                    pageSize,
                    current,
                },
            }
            // () => {
            //     loadData();
            //     props.onPaginationChange && props.onPaginationChange({ pageSize, current });
            // }
        );
    };

    const SearchForm = props.searchForm;
    const { y, x, dataSource, scroll = {} } = defState;
    console.log(dataSource);
    return (
        <>
            {SearchForm ? (
                <SearchForm
                    ref={formRef}
                    onSearch={onSearch}
                    // onSetTableY={this.onSetTableY}
                    // loading={this.state.loading}
                    {...searchFormProps}
                ></SearchForm>
            ) : null}
            <Table
                className="list_table"
                scroll={{ y: y, x: dataSource.length > 0 ? x : "100%" }}
                // title={this.renderSetting}
                onRow={record => {
                    return {
                        onClick: () => {
                            selectRow(record);
                        },
                        onDoubleClick: () => {},
                        onContextMenu: () => {},
                        onMouseEnter: () => {}, // 鼠标移入行
                        onMouseLeave: () => {},
                    };
                }}
                {...defState}
                // components={VList({
                //     height: y ? y : scroll.y, // 此值和scrollY值相同. 必传. (required).  same value for scrolly
                // })}
            ></Table>
        </>
    );
};

export default Atable;
