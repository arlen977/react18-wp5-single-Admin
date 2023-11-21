## 自定义封装 ant 表单组件

# 使用方式
```
rules: {
        username: [
            {
                required: true,
                message: "Please input your username 测试",
            },
        ],
    },
formOptions = {
                formLayout:24
                labelCol: { span: 2 },
                wrapperCol: { span: 22 },
                initialValues: {},
            };
formItemOptions = [
            {
                label: "一级代理商名称",
                name: "username",
                rules: [
                    {
                        required: true,
                        message: "Please input your username",
                    },
                ],
            },
            {
                type: "select",
                label: "Select",
                name: "select",
                itemOptions:{
                    list:[]
                }
            },
            {
                type: "date-picker",
                name: "picker",
                label: "date-picker",
                elOptions: {
                    format: "YYYYMMDD",
                    className: "common-date-picker",
                },
            },
        ];

        <Aform
            ref={ref => {
                this.formRef = ref;
            }}
            formOptions={formOptions}
            formItemOptions={formItemOptions}
            onFinish={this.onFinish}
            rules={rules}
        ></Aform>

        this.formRef.onSubmit();
        this.formRef.onCancel();

```

# formOptions       Object      为Form表单对应props值
# formItemOptions   Object      为Form.item 对应props值

**formOptions     字段详细**
*formLayout     Number          表单排列 默认24 单行排列

**formItemOptions 字段详细**
* type          String          渲染表单值类型：input、select、date-picker 等，不传默认为input
* name          String          lable 表单字段name
* label         String          label 表单字段label
* list          Array           type为select，radio，checkbox时，list数组为select等值
* valueFormat   Function        参数value，自定义格式化函数
* itemOptions   Object          form.item 属性值 label、name字段除外
* elOptions     Object          input等渲染元素属性值

**rules 字段详细**
* rules         Object           表单校验规则 key为表单name value为规则数组

**事件方法 先声明ref**
* this.formRef.onSubmit()       触发表单提交
* this.formRef.onCancel()       触发表单重置