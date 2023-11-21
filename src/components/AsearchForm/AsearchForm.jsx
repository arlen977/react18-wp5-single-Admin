import React from "react";
import { Row, Col, Button, Space, Form, DatePicker, Select, Modal, message } from "antd";
import { DownOutlined, UpOutlined } from "@ant-design/icons";
import AuthComponent from "../AauthComponent/AauthComponent";
import Aselect from "../Aform/components/Aselect/Aselect";
import AtrimInput from "../Aform/components/AtrimInput/AtrimInput";
// import { TA_BtnClick } from "@/utils/taMethod";
import moment from "moment";
import "./AsearchForm.less";
const AuthButton = AuthComponent(Button);
const { RangePicker } = DatePicker;

/**
 *封装表格头部搜索表单组件
 *
 * @author zhaozy
 * @date 2021/04/14
 * @class AsearchForm
 */
class AsearchForm extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            expand: true,
            expandText: "收起",
            count: 100,
            submitType: "",
        };
        this.exportUrl = this.props.exportUrl?.bind(this);
    }
    componentDidMount() {
        setTimeout(() => {
            this.props.onSetTableY && this.props.onSetTableY(this.formBoxRef.clientHeight);
        }, 0);
    }
    getY = () => {
        return this.formBoxRef.clientHeight;
    };
    renderItem = item => {
        switch (item.type) {
            case "input":
            case undefined:
                return <AtrimInput {...item} />;
            case "select":
                if (item.selectType) {
                    return (
                        <Aselect
                            allowClear
                            selectType={item.selectType}
                            placeholder={item.placeholder ? item.placeholder : "请选择"}
                            {...item.elOptions}
                        ></Aselect>
                    );
                } else {
                    return (
                        <Select allowClear placeholder={item.placeholder ? item.placeholder : "请选择"} {...item.elOptions}>
                            {(item.list || []).map(o => (
                                <Select.Option value={o.value} key={o.value}>
                                    {o.label}
                                </Select.Option>
                            ))}
                        </Select>
                    );
                }
            case "date-picker": {
                // 日期类型设置默认format与className
                const { className, ...datePicker } = item.elOptions || {};
                return (
                    <DatePicker
                        allowClear
                        placeholder={item.placeholder ? item.placeholder : item.label}
                        format={item.format || "YYYYMMDD"}
                        className={["common-date-picker", className]}
                        {...datePicker}
                    />
                );
            }
            case "range-picker": {
                const { className, ...rangePicker } = item.elOptions || {};
                return (
                    <RangePicker
                        allowClear
                        placeholder={item.placeholder ? item.placeholder : ["开始时间", "结束时间"]}
                        format={item.format || "YYYYMMDD"}
                        className={["common-date-picker", className]}
                        allowEmpty={[true, true]} // 是否可以直选中一个时间段
                        {...rangePicker}
                    />
                );
            }
            case "custom":
                return item.render();
            default:
                return;
        }
    };
    // 获取表单提交动作 传递到table 触发onSearch
    onFinish = values => {
        TA_BtnClick({ buttonname: "查询" });
        this.props.getFormData();
    };
    // 导出
    exportEx = () => {
        let _this = this;
        Modal.confirm({
            title: "确定导出查询数据吗？",
            content: "",
            okText: "确认",
            cancelText: "取消",
            confirmLoading: _this.props.loading,
            onOk() {
                return new Promise(resolve => {
                    _this
                        .exportUrl(_this.getFormValue(), {
                            onDownloadProgress(a) {
                                var percent = parseInt(100 * (a.loaded / a.total));
                                console.log(percent);
                            },
                        })
                        .then(res => {
                            message.success(res.message);
                            resolve();
                        })
                        .catch(() => {
                            resolve();
                        });
                });
            },
            onCancel() {},
        });
    };
    // 暴露方法  让外部设置对应表单字段 Obj 格式
    setFormValue = value => {
        this.formRef.setFieldsValue(value);
    };
    // 获取表单数据
    getFormValue = () => {
        const formData = this.formValueFormat(this.formRef.getFieldValue());
        return formData;
    };
    // 表单数据自定义格式化输出
    formValueFormat(values) {
        let formData = {};
        this.props.formItemOptions.map(item => {
            let val;
            /**
             * 如果传入自定义format函数则使用传入的
             * 没有则使用默认的格式化函数
             */
            if (item.valueFormat) {
                val = item.valueFormat(values[item.name]);
            } else {
                val = this._defaultValueFormat(item, values[item.name]);
            }
            /**
             * 如果返回的是对象 并且对象参数中
             * _noMerge 为true 则保留该对象 否则默认合并对象
             * _noDel   为true 则不删除对象 否则默认删除合并前对象
             */
            if (typeof val === "object" && val !== null) {
                val._noMerge
                    ? delete val._noMerge && delete val._noDel && (formData[item.name] = val)
                    : val._noDel
                    ? delete val._noMerge && delete val._noDel && (formData = { ...formData, ...val }) && (formData[item.name] = val)
                    : delete formData[item.name] && (formData = { ...formData, ...val });
            } else {
                formData[item.name] = val;
            }
            return true;
        });
        return formData;
    }
    // 默认格式化函数
    _defaultValueFormat = (item, value) => {
        if (item.type === "date-picker") {
            return this._datePickerValueFormat(item, value);
        } else if (item.type === "range-picker") {
            return this._rangePickerValueFormat(item, value);
        } else {
            return value;
        }
    };
    // 默认格式化时间
    _datePickerValueFormat = (item, value) => {
        if (!value) return;
        return moment(value).format(item.format || "YYYYMMDD");
    };
    // 默认range时间格式化
    _rangePickerValueFormat = (item, value) => {
        if (!value) return;
        // 需要判断某一个时间是否为空
        const startDate = value[0] ? moment(value[0]).format("YYYYMMDD") : "";
        const endDate = value[1] ? moment(value[1]).format("YYYYMMDD") : "";

        return { [item.startDate ? item.startDate : "startDate"]: startDate, [item.endDate ? item.endDate : "endDate"]: endDate };
    };

    // 表单重置
    handleReset = () => {
        TA_BtnClick({ buttonname: "搜索表单重置" });
        this.formRef.resetFields();
    };
    render() {
        const { expand, expandText, count } = this.state;
        const { loading, exportAuth, title, titleTip, formOption } = this.props;
        const { formLayout = 6, showExpand = true, ...options } = formOption;

        return (
            <div
                className="search_form_container"
                ref={ref => {
                    this.formBoxRef = ref;
                }}
            >
                {title && (
                    <div className="common-page-title">
                        {title}
                        {titleTip && <span className="title-tip">（{titleTip}）</span>}
                    </div>
                )}
                <Form
                    className="search_form"
                    onFinish={this.onFinish}
                    {...options}
                    ref={ref => {
                        this.formRef = ref;
                    }}
                >
                    <Row>
                        {(this.props.formItemOptions.slice(0, count) || []).map(item => {
                            // 字段是否展示
                            const { visible = true } = item;
                            if (!visible) return false;
                            return (
                                <Col span={formLayout} key={item.name}>
                                    <Form.Item name={item.name} label={item.label} {...item.itemOptions}>
                                        {this.renderItem(item)}
                                    </Form.Item>
                                </Col>
                            );
                        })}
                        <Col flex={1} className="common-text-right">
                            <Space>
                                <AuthButton auth={exportAuth} type="primary" loading={loading} onClick={() => this.exportEx()} />

                                <Button type="primary" htmlType="submit" loading={loading}>
                                    查询
                                </Button>
                                <Button onClick={this.handleReset}>重置</Button>
                                {this.props.formItemOptions.length > 3 && showExpand ? (
                                    <a
                                        style={{ marginLeft: 10 }}
                                        onClick={() => {
                                            setTimeout(() => {
                                                this.props.onSetTableY(this.formBoxRef.clientHeight);
                                            }, 0);
                                            if (expand) {
                                                this.setState({ expand: false, count: 3, expandText: "展开" });
                                            } else {
                                                this.setState({ expand: true, count: 999, expandText: "收起" });
                                            }
                                        }}
                                    >
                                        {expandText}
                                        {expand ? <UpOutlined /> : <DownOutlined />}
                                    </a>
                                ) : null}
                            </Space>
                        </Col>
                    </Row>
                </Form>
            </div>
        );
    }
}

export default AsearchForm;
