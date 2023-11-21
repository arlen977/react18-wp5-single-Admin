import React from "react";
import { Checkbox, Space, Row, Col, Table, Button } from "antd";
// import { Aprogress } from "@/components";
import { ReloadOutlined } from "@ant-design/icons";
import ResizeObserver from "rc-resize-observer";

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
 * @param setY 是否启用动态设置y高度的方法 需要固定高度时设为false
 * @param staticY 当不使用头部表单时需要给一个计算高度  如果设置了固定高度例如modal 则不需要这个参数
 * @param showTool 是否显示表格头部 默认true
 * @param renderTitleLeft 表格头部左侧部分
 * @param tableName 表格头部左侧部分 表格名称
 * @param showTableName 是否展示表格头部左侧部分 表格名称
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
        this._columns = [];

        this.state = {
            y: 0, //动态设置表格高度
            setY: true, // 是否启用动态设置y高度的方法 需要固定高度时设为false
            x: "max-content",
            rowKey: "id",
            size: "small",
            sticky: false,
            dataSource: [],
            dataSourceKey: "result",
            tableAllResult: {}, // table 接口返回的所有数据
            scrollToFirstRowOnChange: true,
            isSummary: false, //是否有汇总行
            mySummary: [], // 汇总行数据
            showTool: true, // 是否展示列表头
            showTableName: false, // 是否显示表格名称  默认显示 数据表
            tableName: "数据表", // 表格名称
            tableMarks: "", //表格名称后括号中说明
            pagiFieldsName: {},
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
    static getDerivedStateFromProps(props) {
        // 只接受部分更改
        return {
            loading: props.loading,
            rowSelection: props.rowSelection,
            fetchParams: props.fetchParams,
            columns: props.columns,
            dataSource: props.dataSource !== undefined ? props.dataSource : [],
        };
    }

    componentDidMount() {
        if (!this.props.searchForm) {
            this.onSetTableY(this.props.staticY || 0);
        }
        this.loadData();
        this.setState({
            tableId: window.location.href,
        });
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
                <div id="aTableTitle">
                    <div className="table_title">
                        <Row>
                            {this.state.showTableName && <Col span={10}>{this.props.renderTitleLeft?.() ?? this.renderTitleLeft()}</Col>}
                            <Col span={this.state.showTableName ? 14 : 24} className="common-text-right">
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

    // 获取表格接口返回的所有数据
    getTableAllData = () => {
        return this.state.tableAllResult;
    };

    setColumns = columns => {
        const newArr = columns.filter(item => item.visible);
        this.setState({
            columns: newArr,
        });
    };

    // 装载表格数据
    loadData = () => {
        const { dataSourceKey, pagiFieldsName } = this.state;
        this.progressRef && this.progressRef.onStart();
        const { current, pageSize } = this.state.pagination;
        let searFormData = {};
        const { num = "pageNum", size = "pageSize" } = pagiFieldsName;
        // 如果有搜索表单
        if (this.props.searchForm) {
            const formRef = this.formRef.current.formRef.current; // 获取 AsearchForm组件实例
            searFormData = formRef.getFormValue();
        }

        // 执行请求
        this.props.loadUrl &&
            this.props
                .loadUrl({ [num]: current, [size]: pageSize, ...searFormData, ...this.state.fetchParams })
                .then(res => {
                    // 每次查询后清空选中的数据
                    this.state.rowSelection && this.state.rowSelection.onChange([]);
                    // 首次进入页面时获取接口返回值
                    this.props.setResponseData && this.props.setResponseData(res.data);
                    // 如果有汇总行
                    if (this.state.isSummary) {
                        // let sum = res.data?.sumResult || {};
                        // let _summary = [];
                        // this.state.columns.forEach((item, index) => {
                        //     if (sum[item.key]) {
                        //         _summary.push({
                        //             index,
                        //             value: sum[item.key],
                        //         });
                        //     } else {
                        //         _summary.push({
                        //             index,
                        //             value: "",
                        //         });
                        //     }
                        // });
                        // this.setState({
                        //     mySummary: _summary,
                        // });

                        // 以上可能移除（后续汇总新增单独接口 之前给的接口全部改掉之后， 上面可以去除掉） 使用 this.loadDataSummary 方法
                        if (this.props.loadSummaryUrl) {
                            this.loadDataSummary({ current, size: pageSize, ...searFormData, ...this.state.fetchParams });
                        }
                    }

                    this.setState(
                        {
                            tableAllResult: res.data,
                            dataSource: res.data instanceof Array ? res.data : res.data[dataSourceKey],
                            pagination: {
                                ...this.state.pagination,
                                total: res.data.count,
                                pageSize: res.data.pageSize,
                                current: res.data.pageNum,
                            },
                        },
                        () => {
                            this.progressRef && this.progressRef.onEnd();
                        }
                    );
                })
                .catch(err => {
                    console.log(err);
                    this.progressRef && this.progressRef.onError();
                    // 加载数据错误或者权限校验拦截之类 抛出err
                    this.props.onError && this.props.onError(err);
                });
    };

    // 加载汇总
    loadDataSummary = data => {
        this.props.loadSummaryUrl &&
            this.props
                .loadSummaryUrl(data)
                .then(res => {
                    let sum = res.data?.sumResult || {};
                    let _summary = [];
                    this.state.columns.forEach((item, index) => {
                        if (sum[item.key] !== undefined) {
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
                })
                .catch(() => {
                    this.progressRef && this.progressRef.onError();
                });
    };

    // 刷新
    onRefresh = () => {
        console.log("test");
        // 重置checkbox
        // this._columns.forEach(item => {
        //     item.visible = true;
        // });
        // 重置表格列
        this.setState(
            {
                // columns: this._columns,
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
                this.props.onPaginationChange && this.props.onPaginationChange({ pageSize, current });
            }
        );
    };
    // 表单查询按钮触发
    onSearch = () => {
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
        const { setY } = this.state;
        if (!setY) return;
        let num;
        let aLayoutContentH = document.getElementById("aLayoutContent").clientHeight;
        let fontSize = parseInt(document.documentElement.style.fontSize);
        let yH = y / fontSize; // 搜索框高度
        let tableTitleH = document.getElementById("aTableTitle")?.clientHeight ? document.getElementById("aTableTitle")?.clientHeight / fontSize : 0;
        // 通过字体缩放比例获取对应元素当前的高度
        let paginationH = (56 * window.afontScale) / fontSize;
        let summaryH = (42 * window.afontScale) / fontSize;
        let otherH = (60 * window.afontScale) / fontSize; // 其他无法计算的固定高度 表头 边距
        if (this.state.isSummary) {
            num = yH + tableTitleH + paginationH + summaryH + otherH;
        } else {
            num = yH + tableTitleH + paginationH + otherH;
        }
        this.setState({
            y: aLayoutContentH - num * fontSize,
        });
    };
    // 窗口变化重新设置
    resizeSetY = () => {
        let id = window.location.href;
        // 不是当前页面 不监听
        if (id !== this.state.tableId || !this.state.setY) return;
        if (!this.state.searchForm) {
            this.onSetTableY(0);
        } else {
            let y = this.formRef.current.formRef.current.getY();
            this.onSetTableY(y);
        }
    };
    // 节流
    throttle = method => {
        clearTimeout(method.tid);
        method.tid = setTimeout(function () {
            method.call(this);
        }, 1000);
    };
    // 如果行可选 点击行 选中
    selectRow = record => {
        if (!this.state.rowSelection) return;
        if (record.noChecked) return;
        const { rowKey } = this.state;
        let selectedRowKeys = [...this.state.rowSelection.selectedRowKeys];
        let selectedRows = [...this.state.rowSelection.selectedRows];
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
                selectedRows.splice(selectedRows.indexOf(record[rowKey]), 1);
            } else {
                selectedRowKeys.push(record[rowKey]);
                selectedRows.push(record);
            }
        }

        this.state.rowSelection.onChange(selectedRowKeys, selectedRows);
    };

    render() {
        const SearchForm = this.props.searchForm;
        const { searchFormProps = {} } = this.props; // 传入SearchForm的props
        const { isSummary, mySummary, y, x, dataSource, scroll = {} } = this.state;
        return (
            <React.Fragment>
                {/* 监控大小变化 */}
                <ResizeObserver
                    onResize={() => {
                        this.throttle(this.resizeSetY);
                    }}
                >
                    {/* 只是用于元素检测 无其他用处 */}
                    <div className="table_resize_box"></div>
                </ResizeObserver>

                {/* 是否展示进度 */}
                {/* {showProgress && <Aprogress ref={ref => (this.progressRef = ref)}></Aprogress>} */}
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
                                onClick: () => this.selectRow(record),
                                onDoubleClick: () => {},
                                onContextMenu: () => {},
                                onMouseEnter: () => {}, // 鼠标移入行
                                onMouseLeave: () => {},
                            };
                        }}
                        // components={VList({
                        //     height: y ? y : scroll.y, // 此值和scrollY值相同. 必传. (required).  same value for scrolly
                        // })}
                        summary={() => {
                            return (
                                <Table.Summary fixed>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0} colSpan={1} className={"sum_fixed"}>
                                            <span>汇总</span>
                                        </Table.Summary.Cell>
                                        {mySummary.map(item => {
                                            return item.index === 0 ? null : (
                                                <Table.Summary.Cell index={item.index + 1} key={item.index + item.value}>
                                                    {/* {item.value === ""
                                                        ? null
                                                        : this.props.loadSummaryUrl
                                                        ? item.value
                                                        : (Number(item.value) / 100).toFixed(2)} */}
                                                    {/* 兼容之前汇总(之前汇总前端处理为元)，等到汇总全部 摘出接口 用下面这个 */}
                                                    {item.value === "" ? null : item.value}
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
                                onClick: () => {
                                    this.selectRow(record);
                                },
                                onDoubleClick: () => {},
                                onContextMenu: () => {},
                                onMouseEnter: () => {}, // 鼠标移入行
                                onMouseLeave: () => {},
                            };
                        }}
                        {...this.state}
                        components={VList({
                            height: y ? y : scroll.y, // 此值和scrollY值相同. 必传. (required).  same value for scrolly
                        })}
                    ></Table>
                )}
            </React.Fragment>
        );
    }
}
export default Atable;
