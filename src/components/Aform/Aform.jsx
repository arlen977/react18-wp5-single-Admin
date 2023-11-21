import React, { useState, useRef, useImperativeHandle, useEffect } from "react";
import { Form, Input, DatePicker, Select, Row, Col, Switch, Radio, Checkbox, InputNumber, TreeSelect } from "antd";
import dayjs from 'dayjs'
import Aselect from "./components/Aselect/Aselect";
import AnumberInput from "./components/AnumberInput/AnumberInput";
import AtrimInput from "./components/AtrimInput/AtrimInput";
import "./Aform.less";
const { RangePicker } = DatePicker;

/**
 *封装表单
 *Hook
 *
 * @author zhaozy
 * @date 2021/04/15
 * @param  fref                 表单ref
 * @param  valueFormat          表单字段格式化
 * @param  formOptions          表单配置:
 * {
 * formLayout：表单布局 24 单列 12双列 默认24;
 * disabled：表单全局禁用;
 * readOnly：表单全局只读;
 * mode：表单模式  默认form  可选look;
 * }
 * @param  formItemOptions      <Form.Item> 配置
 * @param  rules                表单校验规则
 * @param  onFormMount          表单加载完成方法
 * @param  onFormData           获取最终表单数据
 * @param  onReset              重置表单数据 可传入name 保留值 类型为数组
 * @returns {*}
 */
const Aform = props => {
    const [lookFormData, setLookFormData] = useState({});
    const [form] = Form.useForm();
    const formRef = useRef();
    const { formOptions, formItemOptions, rules = {}, onFormMount, onFormData, ...formFuncProps } = props;
    const { formLayout = 24, disabled, readOnly, bordered = true, mode = "form", ...options } = formOptions;
    // 暴露方法  告知挂载完成状态
    useEffect(() => {
        onFormMount && onFormMount();
    }, []);
    // 暴露的子组件方法，给父组件调用
    useImperativeHandle(props.fref, () => {
        return {
            onSubmit,
            onReset,
            getFieldValue,
            onSetFormValue,
            ...formRef.current,
        };
    });
    // 表单提交
    const onSubmit = () => {
        form.submit();
    };
    // 表单重置
    const onReset = (retainList = []) => {
        let retainValue = {}; // 需要保留的值对象
        if (retainList.length > 0) {
            for (let i of retainList) {
                retainValue[i] = form.getFieldValue(i);
            }
        }
        form.resetFields();
        form.setFieldsValue(retainValue);
    };
    // 表单设置值 b 是否使用format后的数据设置表单 默认false
    const onSetFormValue = (obj, b = false) => {
        if (mode === "look") {
            const formData = formatFormData(obj);
            setLookFormData(formData);
            return;
        }
        if (b) {
            const formData = formatFormData(obj);
            // 处理过后的数据赋值给表单
            form.setFieldsValue(formData);
        } else {
            const newObj = setFormPicker(obj);
            form.setFieldsValue(newObj);
        }
    };
    const getFieldValue = () => {
        return form.getFieldsValue();
    };
    // 设置表单回显值时 对picker 时间类进行特殊处理 然后赋值
    const setFormPicker = obj => {
        const pickerList = formItemOptions.filter(item => item.type === "date-picker" || item.type === "range-picker");
        if (pickerList.length === 0) return obj;

        for (let i of pickerList) {
            // 普通的日期框
            if (i.type === "date-picker") {
                obj[i.name] && (obj[i.name] = dayjs(obj[i.name]));
            } else if (i.type === "range-picker") {
                // 起-始日期框
                obj[i.name] = [obj[i.startDate] && dayjs(obj[i.startDate]), obj[i.endDate] && dayjs(obj[i.endDate])];
            }
        }
        return obj;
    };
    // 提交or设置 前处理表单数据
    const formatFormData = values => {
        let formData = {};
        formItemOptions.map(item => {
            let val;
            /**
             * 如果传入自定义format函数则使用传入的
             * 没有则使用默认的格式化函数
             */
            if (item.valueFormat) {
                val = item.valueFormat(values[item.name]);
            } else {
                val = _defaultValueFormat(item, values[item.name]);
            }
            /**
             * 如果返回的是对象 并且对象参数中
             * _noMerge 为true 则保留该对象 否则默认合并对象
             * _noDel   为true 则不删除对象 否则默认删除合并前对象
             */
            if (typeof val === "object" && val !== null && !Array.isArray(val)) {
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
    };
    // 处理表单数据 返回给父组件
    const onFinish = values => {
        const formData = formatFormData(values);
        onFormData(formData);
    };
    // 表单字段错误 提交埋点
    const onFinishFailed = ({ values, errorFields, outOfDate }) => {
        let errList = [];
        for (let i of errorFields) {
            errList = [...errList, ...i.errors];
        }
    };
    // 默认格式化函数
    const _defaultValueFormat = (item, value) => {
        // 特殊处理时间控件
        if (item.type === "date-picker") {
            return _datePickerValueFormat(item, value);
        } else if (item.type === "range-picker") {
            return _rangePickerValueFormat(item, value);
        } else if (item.formatSource) {
            // 如果传入了需要格式显示的源对象 多用于查看表单
            const v = item.formatSource.find(i => i.value === value);
            // 如果匹配不到 并且传入了默认显示值
            if (v === undefined && item.formatSource[item.formatSource.length - 1]?.defaultValue) {
                return item.formatSource[item.formatSource.length - 1]?.defaultValue;
            }
            return v?.text ?? "";
        } else {
            return value;
        }
    };
    // 默认range时间格式化
    const _rangePickerValueFormat = (item, value) => {
        if (!value) return;
        // 需要判断某一个时间是否为空
        const startDate = value[0] ? dayjs(value[0]).format("YYYYMMDD") : "";
        const endDate = value[1] ? dayjs(value[1]).format("YYYYMMDD") : "";

        return { [item.startDate ? item.startDate : "startDate"]: startDate, [item.endDate ? item.endDate : "endDate"]: endDate };
    };
    // 默认格式化时间
    const _datePickerValueFormat = (item, value) => {
        if (!value) return;
        return dayjs(value).format(item.format || "YYYYMMDD");
    };

    // 渲染表单item
    const renderItem = item => {
        if (mode === "form") {
            switch (item.type) {
                case "input":
                case undefined: {
                    if (item.inputType) {
                        const TypeInput = Input[item.inputType];
                        return (
                            <TypeInput
                                allowClear
                                bordered={bordered}
                                disabled={disabled}
                                readOnly={readOnly}
                                placeholder={item.placeholder ? item.placeholder : item.label}
                                {...item.elOptions}
                            />
                        );
                    } else {
                        return <AtrimInput disabled={disabled} readOnly={readOnly} {...item} />;
                    }
                }
                case "inputNumber": {
                    // 数字输入框  只能输入整数 会四舍五入
                    const { className, ...inputNumber } = item.elOptions || {};
                    return (
                        <InputNumber
                            bordered={bordered}
                            disabled={disabled}
                            readOnly={readOnly}
                            min={item.min}
                            max={item.max}
                            precision={item.precision ?? 0}
                            placeholder={item.placeholder ? item.placeholder : item.label}
                            step={item.step ?? 1}
                            className={["common-input-number", className]}
                            {...inputNumber}
                        />
                    );
                }
                // 只允许输入数字 可选择保留小数位数 不会四舍五入
                case "numberInput":
                    return <AnumberInput bordered={bordered} disabled={disabled} readOnly={readOnly} {...item}></AnumberInput>;
                case "date-picker": {
                    // 日期类型设置默认format与className
                    const { className, ...datePicker } = item.elOptions || {};
                    return (
                        <DatePicker
                            allowClear
                            bordered={bordered}
                            disabled={disabled}
                            readOnly={readOnly}
                            format={item.format || "YYYYMMDD"}
                            placeholder={item.placeholder ? item.placeholder : item.label}
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
                            bordered={bordered}
                            disabled={disabled}
                            readOnly={readOnly}
                            format={item.format || "YYYYMMDD"}
                            placeholder={item.placeholder ? item.placeholder : ["开始时间", "结束时间"]}
                            className={["common-date-picker", className]}
                            allowEmpty={[true, true]}
                            {...rangePicker}
                        />
                    );
                }
                case "switch":
                    return <Switch disabled={disabled} readOnly={readOnly} {...item.elOptions} />;

                case "select":
                    if (item.selectType) {
                        return (
                            <Aselect
                                bordered={bordered}
                                disabled={disabled}
                                readOnly={readOnly}
                                allowClear
                                selectType={item.selectType}
                                placeholder={item.placeholder ? item.placeholder : "请选择"}
                                {...item.elOptions}
                            ></Aselect>
                        );
                    } else {
                        return (
                            <Select
                                bordered={bordered}
                                disabled={disabled}
                                readOnly={readOnly}
                                allowClear
                                placeholder={item.placeholder ? item.placeholder : "请选择"}
                                {...item.elOptions}
                            >
                                {(item.list || []).map(o => (
                                    <Select.Option
                                        value={item.selectValue ? o[item.selectValue] : o.value}
                                        key={item.selectValue ? o[item.selectValue] : o.value}
                                    >
                                        {item.selectLabel ? o[item.selectLabel] : o.label}
                                    </Select.Option>
                                ))}
                            </Select>
                        );
                    }
                case "treeSelect":
                    return (
                        <TreeSelect
                            bordered={bordered}
                            disabled={disabled}
                            readOnly={readOnly}
                            allowClear
                            placeholder={item.placeholder ? item.placeholder : "请选择"}
                            dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                            treeData={item.treeData}
                            {...item.elOptions}
                        />
                    );
                case "radio":
                    return (
                        <Radio.Group disabled={disabled} readOnly={readOnly} {...item.elOptions}>
                            {(item.list || []).map(o => (
                                <Radio value={o.value} key={o.value}>
                                    {o.label}
                                </Radio>
                            ))}
                        </Radio.Group>
                    );
                case "checkbox":
                    return (
                        <Checkbox.Group disabled={disabled} readOnly={readOnly} {...item.elOptions}>
                            <Row>
                                {(item.list || []).map(o => (
                                    <Col span={12} key={o.value}>
                                        <Checkbox value={o.value}>{o.label}</Checkbox>
                                    </Col>
                                ))}
                            </Row>
                        </Checkbox.Group>
                    );
                case "custom":
                    return item.render();
                default:
                    return;
            }
        } else if (mode === "look") {
            // 表单模式为查看 不渲染表单组件  改为文字渲染
            switch (item.type) {
                case "custom":
                    return item.render();
                default:
                    return (
                        <Row>
                            <Col span={props.formOptions.labelCol.span} className="look_form_label">
                                {item.label}：
                            </Col>
                            <Col span={props.formOptions.wrapperCol.span} className="look_form_value">
                                {lookFormData[item.name]}
                            </Col>
                        </Row>
                    );
            }
        }
    };
    return (
        <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            {...options}
            form={form}
            ref={formRef}
            className={["a_form", mode === "look" && "look_form"].join(" ")}
            onFinish={values => onFinish(values)}
            onFinishFailed={onFinishFailed}
            {...formFuncProps}
        >
            <Row>
                {mode === "form" &&
                    (formItemOptions || []).map(item => {
                        // 字段是否展示 visible 不会收集数据   hidden 会继续收集数据和验证
                        const { visible = true, hidden = false } = item;
                        if (!visible) return null;
                        // 特定类型默认参数对象
                        const specialData = {};
                        if (item.valuePropName) {
                            specialData.valuePropName = item.valuePropName;
                        }
                        // 分割线
                        if (item.type === "line" && !hidden) {
                            return (
                                <Col span={24} key={Math.random().toString(36).substr(2)}>
                                    <div className="form_line"></div>
                                </Col>
                            );
                        }
                        // 全自定义字段 一般用于表单装饰类 如自定义表头 额外样式等
                        if (item.type === "allCustom" && !hidden) {
                            return item.render();
                        }
                        return (
                            <Col span={item.span ? item.span : formLayout} key={item.key ? item.key : item.name} hidden={hidden}>
                                <Form.Item
                                    name={item.name}
                                    label={item.label}
                                    rules={
                                        rules[item.name] ? rules[item.name] : item.required ? [{ required: true, message: item.errorMsg }] : undefined
                                    }
                                    {...item.formItemLayout}
                                    {...item.itemOptions}
                                    {...specialData}
                                >
                                    {renderItem(item)}
                                </Form.Item>
                            </Col>
                        );
                    })}
                {mode === "look" &&
                    (formItemOptions || []).map(item => {
                        const { visible = true } = item;
                        if (!visible) return false;
                        // 分割线
                        if (item.type === "line") {
                            return (
                                <Col span={24} key={Math.random().toString(36).substr(2)}>
                                    <div className="form_line"></div>
                                </Col>
                            );
                        }
                        return (
                            <Col span={formLayout || 24} key={item.name}>
                                {renderItem(item)}
                            </Col>
                        );
                    })}
            </Row>
        </Form>
    );
};

export default Aform;
