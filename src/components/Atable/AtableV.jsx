// ======================================================虚拟化测试用  不使用==================================
import React from "react";
import {
    //  Popover, Tooltip,
    Checkbox,
    Space,
    Row,
    Col,
    Table,
    Button,
} from "antd";
import { Aprogress } from "@/components";
import { ReloadOutlined } from "@ant-design/icons";
import { VList } from "virtuallist-antd-keep";

import "./Atable.less";

/**
 *封装 table 组件  完全不受控组件  props只做初始化使用
 *自带初始化属性 自动请求装载数据
 *联动搜索表单
 *
 * @author zhaozy
 * @date 2021/04/09
 * @export
 * @param rowKey 表格唯一键
 * @param loadUrl 表格搜索方法
 * @param searchForm 表格搜索联动表单组件 为import值 非component
 * @param fetchParams 表格搜索额外携带参数
 * @param showTool 是否显示表格头部 默认true
 * @param renderTitleLeft 表格头部左侧部分
 * @param tableName 表格头部左侧部分 表格名称
 * @param tableMarks 表格头部左侧部分 表格名称后括号中说明
 * @param renderTitleRight 表格头部右侧按钮部分
 * @param isSummary 是否有汇总行 默认false
 * @param rowSelection 表格选择行参数
 * @param loading 表格载入状态
 * @param getSearchFormValue 方法 ref table页面获取表单值
 * @param onRefresh 方法 ref 刷新表格
 * @returns {*}
 */

class Atable extends React.Component {
    constructor(props) {
        super(props);
        const { pagination, ...data } = this.props;
        this._columns = [...this.props.columns];
        this.state = {
            y: 0, //动态设置表格高度
            x: "max-content",
            rowKey: "id",
            size: "small",
            sticky: false,
            dataSource: [],
            scrollToFirstRowOnChange: true,
            isSummary: false, //是否有汇总行
            mySummary: [], // 汇总行数据
            showTool: true, // 是否展示列表头
            tableName: "数据表", // 表格名称
            tableMarks: "", //表格名称后括号中说明
            pagination: {
                defaultPageSize: 10,
                total: 20,
                pageSize: 10,
                current: 1,
                pageSizeOptions: ["10", "20", "50", "100", "500"],
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total, range) => `共 ${total} 条`,
                onChange: (current, pageSize) => {
                    this.onTableChange(current, pageSize);
                },
                ...pagination,
            },
            fetchParams: {},
            ...data,
        };
        this.formRef = React.createRef();
    }

    // 合并props
    static getDerivedStateFromProps(props, state) {
        // 只接受部分更改
        return {
            loading: props.loading,
            rowSelection: props.rowSelection,
            fetchParams: props.fetchParams,
        };
    }

    componentDidMount() {
        this.loadData();
    }

    // 动态显隐表格列
    renderColumnSetting = () => {
        return (
            <div>
                {this._columns.map((item, index) => {
                    if (index === this._columns.length - 1) {
                        return null;
                    }
                    return (
                        <div className="ck_box" key={item.key}>
                            <Checkbox
                                value={item.key}
                                checked={item.visible}
                                onChange={e => {
                                    if (!e.target.checked) {
                                        item.visible = false;
                                    } else {
                                        item.visible = true;
                                    }

                                    const newArr = this._columns.filter(item => item.visible);
                                    this.setState({
                                        columns: newArr,
                                    });
                                }}
                            >
                                {item.title}
                            </Checkbox>
                        </div>
                    );
                })}
            </div>
        );
    };
    // 表格头部左侧部分 默认
    renderTitleLeft = () => {
        const { tableName, tableMarks } = this.state;
        const { selectedRowKeys = [] } = this.state.rowSelection ?? {};
        const hasSelected = selectedRowKeys.length > 0;
        return (
            <span className="common-flex-align">
                <span className={"common-page-title"}>
                    {tableName}
                    <span className={"marks"}>{tableMarks}</span>
                </span>
                {hasSelected ? (
                    <span className="antd-alert-info">
                        <span
                            style={{
                                marginRight: "10px",
                                marginLeft: "10px",
                            }}
                        >
                            已选择 {selectedRowKeys.length} 项
                        </span>
                        <a
                            onClick={() => {
                                this.state.rowSelection.onChange([]);
                            }}
                        >
                            取消选择
                        </a>
                    </span>
                ) : null}
            </span>
        );
    };
    // 表格头部操作栏
    renderSetting = () => {
        if (this.state.showTool) {
            return (
                <div>
                    <div className="table_title">
                        <Row>
                            <Col span={10}>{this.props.renderTitleLeft?.() ?? this.renderTitleLeft()}</Col>
                            <Col span={14} className="common-text-right">
                                <div className="table_tool">
                                    <Space size="middle">
                                        {this.props.renderTitleRight?.()}
                                        <Button className={"common-line-button"} onClick={this.onRefresh} icon={<ReloadOutlined />}>
                                            刷新
                                        </Button>
                                        {/* <Tooltip placement="top" title={"刷新"}>
                                            <ReloadOutlined style={{ fontSize: "16px" }} onClick={this.onRefresh} />
                                        </Tooltip> */}
                                        {/* <Tooltip placement="top" title={"列设置"}>
                                            <Popover
                                                overlayClassName="table_title_setting"
                                                trigger="click"
                                                title="列设置"
                                                placement="bottomRight"
                                                content={this.renderColumnSetting?.()}
                                            >
                                                <SettingOutlined style={{ fontSize: "16px" }} />
                                            </Popover>
                                        </Tooltip> */}
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            );
        } else {
            return null;
        }
    };

    // table 页面获取表单值
    getSearchFormValue = () => {
        return this.formRef.current.formRef.current.getFormValue();
    };

    // 装载表格数据
    loadData = () => {
        this.progressRef && this.progressRef.onStart();
        const { current, pageSize } = this.state.pagination;
        let searFormData = {};
        // 如果有搜索表单
        if (this.props.searchForm) {
            const formRef = this.formRef.current.formRef.current; // 获取 AsearchForm组件实例
            searFormData = formRef.getFormValue();
        }

        // 执行请求
        this.props.loadUrl &&
            this.props
                .loadUrl({ current, size: pageSize, ...searFormData, ...this.state.fetchParams })
                .then(res => {
                    // 每次查询后清空选中的数据
                    this.state.rowSelection && this.state.rowSelection.onChange([]);
                    // 如果有汇总行
                    if (this.state.isSummary) {
                        let sum = res.data?.sumResult;
                        let _summary = [];
                        this.state.columns.forEach((item, index) => {
                            if (sum[item.key]) {
                                _summary.push({
                                    index,
                                    value: sum[item.key],
                                });
                            } else {
                                _summary.push({
                                    index,
                                    value: "",
                                });
                            }
                        });
                        this.setState({
                            mySummary: _summary,
                        });
                    }

                    this.setState(
                        {
                            dataSource: res.data?.resultList,
                            pagination: {
                                ...this.state.pagination,
                                total: res.pager.totalSize,
                            },
                        },
                        () => {
                            this.progressRef && this.progressRef.onEnd();
                        }
                    );
                })
                .catch(err => {
                    this.progressRef && this.progressRef.onError();
                });
    };
    // 刷新
    onRefresh = () => {
        // 重置checkbox
        this._columns.forEach(item => {
            item.visible = true;
        });
        // 重置表格列
        this.setState(
            {
                columns: this._columns,
                pagination: {
                    ...this.state.pagination,
                    current: 1,
                },
            },
            () => {
                this.loadData();
            }
        );
        // 清空选择项
        this.state.rowSelection && this.state.rowSelection.onChange([]);
    };
    onTableChange = (current, pageSize) => {
        console.log("current", current);
        console.log("pageSize", pageSize);
        this.setState(
            {
                pagination: {
                    ...this.state.pagination,
                    pageSize,
                    current,
                },
            },
            () => {
                this.loadData();
            }
        );
    };
    // 表单查询按钮触发
    onSearch = data => {
        this.setState(
            {
                pagination: {
                    ...this.state.pagination,
                    current: 1,
                },
            },
            () => {
                this.loadData();
            }
        );
    };
    // 动态根据搜索表单设置表格高度
    onSetTableY = y => {
        let winH = document.documentElement.clientHeight;
        let fontSize = parseInt(document.documentElement.style.fontSize);
        let yH = y / fontSize;
        let headerH = 80 / fontSize;
        let breadcrumbH = 60 / fontSize;
        let tableTitleH = 66 / fontSize;
        let paginationH = 60 / fontSize;
        let summaryH = 42 / fontSize;
        let num;
        if (this.state.isSummary) {
            num = yH + headerH + breadcrumbH + tableTitleH + paginationH + summaryH + 6.2;
        } else {
            num = yH + headerH + breadcrumbH + tableTitleH + paginationH + 6.2;
        }
        // if (this.state.isSummary) {
        //     num = (y + 365) / 16;
        // } else {
        //     num = (y + 325) / 16;
        // }
        this.setState({
            y: winH - num * fontSize,
        });
    };
    // 如果行可选 点击行 选中
    selectRow = record => {
        if (!this.state.rowSelection) return;
        if (record.noChecked) return;
        const { rowKey } = this.state;
        let selectedRowKeys = [...this.state.rowSelection.selectedRowKeys];
        // 单选
        if (this.state.rowSelection.type === "radio") {
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
            } else {
                selectedRowKeys.push(record[rowKey]);
            }
        }

        this.state.rowSelection.onChange(selectedRowKeys);
    };
    render() {
        const SearchForm = this.props.searchForm;
        const { searchFormProps = {} } = this.props; // 传入SearchForm的props
        const { isSummary, mySummary, y, x, dataSource, showProgress = true } = this.state;
        return (
            <React.Fragment>
                {/* 是否展示进度 */}
                {showProgress && <Aprogress ref={ref => (this.progressRef = ref)}></Aprogress>}
                {/* 是否有搜索表单 */}
                {SearchForm ? (
                    <SearchForm
                        ref={this.formRef}
                        onSearch={this.onSearch}
                        onSetTableY={this.onSetTableY}
                        loading={this.state.loading}
                        {...searchFormProps}
                    ></SearchForm>
                ) : null}
                {/* 汇总行 */}
                {isSummary ? (
                    <Table
                        className="list_table"
                        scroll={{ y: y, x: dataSource.length > 0 ? x : "100%" }}
                        title={this.renderSetting}
                        {...this.state}
                        onRow={record => {
                            return {
                                onClick: e => this.selectRow(record),
                                onDoubleClick: event => {},
                                onContextMenu: event => {},
                                onMouseEnter: event => {}, // 鼠标移入行
                                onMouseLeave: event => {},
                            };
                        }}
                        // components={VList({
                        //     height: y, // 此值和scrollY值相同. 必传. (required).  same value for scrolly
                        // })}
                        summary={pageData => {
                            return (
                                <Table.Summary fixed>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={1} className={"sum_fixed"}>
                                            <span>汇总</span>
                                        </Table.Summary.Cell>
                                        {mySummary.map(item => {
                                            return item.index === 0 ? null : (
                                                <Table.Summary.Cell index={item.index + 1} key={item.index + item.value}>
                                                    {item.value === "" ? null : (Number(item.value) / 100).toFixed(2)}
                                                </Table.Summary.Cell>
                                            );
                                        })}
                                    </Table.Summary.Row>
                                </Table.Summary>
                            );
                        }}
                    ></Table>
                ) : (
                    <Table
                        className="list_table"
                        scroll={{ y: y, x: dataSource.length > 0 ? x : "100%" }}
                        title={this.renderSetting}
                        onRow={record => {
                            return {
                                onClick: event => {
                                    console.log(event.target);
                                    this.selectRow(record);
                                },
                                onDoubleClick: event => {},
                                onContextMenu: event => {},
                                onMouseEnter: event => {}, // 鼠标移入行
                                onMouseLeave: event => {},
                            };
                        }}
                        {...this.state}
                        components={VList({
                            height: y, // 此值和scrollY值相同. 必传. (required).  same value for scrolly
                        })}
                    ></Table>
                )}
            </React.Fragment>
        );
    }
}
export default Atable;
