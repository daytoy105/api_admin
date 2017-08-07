import React, { Component } from 'react'
import { GETMENU, GETSUCCESS, GETMODULES, POSTSUCCESS, PREFIX_URL,ADD_KEY } from '../constants'  // 引入action类型名常量 
import { Form, Card, message, Button, Modal, Icon, Select, Checkbox } from 'antd';
import RadioItem from './ItemRadio';
import InputItem from './ItemInput';
import FieldRow from './RowField'
const FormItem = Form.Item
const Option = Select.Option

class AddSection extends Component {
    constructor(props) {
        super(props)
        this.state = {
            add:[],       //  它的数组个数 即为 请求参数添加的个数 
            uuid :0,      //  数组值
            visible: false,    // model 的 显示/ 隐藏
            method:[{value:'get',text:'get'},{value:'post',text:'post'}],    // 请求方式的 单选框的值 
            login:[{value:'1',text:'是'},{value:'0',text:'否'}]              // 是否登录的 单选框的值 
        }
    }
    componentWillMount() {    // 所属模块 select中的选择  
        this.props.fetchGetsIfNeeded(GETMODULES,PREFIX_URL+'getModules/'+this.props.pid)      // this.props.fetchGetsIfNeeded() 从父组件中获得 
    }
    //（添加请求字段的方法） 
    add_key(){
        this.setState({
            uuid: this.state.uuid +1         // 添加请求参数 的数组 中值的递增 
        });
        const nextKeys = this.state.add ? this.state.add.concat(this.state.uuid):[1] ;    // 请求参数 的数组的拼接
        this.setState({
            add: nextKeys
        });
    }
    sub_key(k){
        this.setState({
            add: this.state.add.filter(key => key !== k)           // 删除 数组中指定的元素 filter ,即为删除指定的某一个行请求参数 
        });
    }
    // 添加API
    handleSubmit(e){
        e.preventDefault()
        this.props.form.validateFields((errors, values) => {       // 表单验证 ， 默认获得所有的值
            if (errors) {
                console.log('errors',errors);
            }else{
                //console.log('原始values:', values)
                let params = {
                    pid: this.props.pid,
                    a_mid: values.a_mid.replace(/"/g, ''),
                    a_name: values.a_name,
                    a_url: values.a_url,
                    a_method: values.a_method,
                    a_login: values.a_login,
                    a_notice: values.a_notice,
                    a_result: values.a_result
                }
                // 添加请求参数 
                let n = this.state.uuid
                //console.log(n)
                let a_field = "";
                for (let i = 0; i < n; i++) {
                    values['must_need_' + i] = (values['must_need_' + i]) ? '1' : '0';
                    if(values['name_'+i] && values['type_'+i]){
                        a_field += `(aid, '${values['name_'+i]}' , '${values['must_need_'+i]}' , '${values['type_'+i]}' , '${values['miaoshu_'+i]}' , '${values['defualt_val_'+i]}' , 'addtime'),`;
                    }
                }
                if(a_field){      // 请求参数为空时， 不提交
                    a_field = a_field.substring(0, a_field.length - 1);
                    params.a_field = a_field;
                }
                //console.log('params',params);
                this.props.fetchPostsIfNeeded(PREFIX_URL + 'addapi', params);
                this.timer = setTimeout(
                  () => { 
                    this.success(this.props.msg); 
                },1000);
            }
        });
    }
    
    success(msg) {
        message.success(msg);
        this.props.form.resetFields()
        this.setState({
            add:[]
        });
        this.props.fetchGetsIfNeeded(GETMENU, PREFIX_URL + 'getModules_Api/' + this.props.pid) ;
    }
    //  添加 模块 
    showModal(){
        this.setState({ visible: true })
    }
    hideModal(){
        this.setState({ visible: false })
        this.timer = setTimeout(
          () => { 
            this.props.fetchGetsIfNeeded(GETMODULES, PREFIX_URL + 'getModules/'+this.props.pid) ; 
            this.props.fetchGetsIfNeeded(GETMENU, PREFIX_URL + 'getModules_Api/' + this.props.pid) ;
        },1000);
        
    }
    add_module(e){                // 和 Model 一起使用下， footer 的范围不在Form 中， 所以通过另一个函数触发表单提交
        this.handleModule(e)
    }
    handleModule(e){
        e.preventDefault()
        this.props.form.validateFields(['mod_name'],(errors, values) => {
            if (errors) {
                console.log('errors',errors);
            }else{
                values.mod_pid = this.props.pid;
                this.props.fetchPostsIfNeeded(PREFIX_URL + 'addModule', values);
                this.hideModal();
            }
        })
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }

    render() {
        const { module, actions} = this.props;
        let options;                      // 所属模块的渲染   
        if(module.length){
            options = module.map((opt,i)=>
                <Option key={i} value = {'"'+opt.id+'"'}>{opt.name}</Option>
            )
        }
        const { form } = this.props;         //  表单 属性 
        const { getFieldDecorator } = form      // 表单的双向绑定  
        const formItemLayout = {             // 表单 元素的布局
            labelCol: { span: 4 },
            wrapperCol: { span:18}
        }
        let keys= this.state.add ? this.state.add:[] ;       // 请求参数 的添加 
        let _this = this;              // this 的 上下文已改变 
        let filed_item = keys.map((e,index)=>
                <FieldRow key={e} first_add form={form} remove={_this.sub_key.bind(_this)} rowid = {e} />
            );
        /*******
        InputItem
             params 
                fieldid : input 的 id 
                label : label 的 text 值
                placeholder : input 的 placeholder 
                getFieldDecorator ： 表单的双向绑定
                formItemLayout ：元素的布局
        RadioItem 
            params 
                radios : radio 的 个数的渲染的数组
                default: radio 的 默认选择项
        *****/
        return (
           <Card title={<h2>新增API</h2>} style={{ width: "80%", margin: "20px auto" }} >
                <Form layout="horizontal" onSubmit={this.handleSubmit.bind(this)}>
                    <FormItem  label= '所属模块' {...formItemLayout}  >
                        {getFieldDecorator('a_mid',{rules: [{required:true, message:'所属模块不能为空'}]})(
                            <Select style={{width:"90%"}} placeholder="Select a Module" >
                                {options}
                            </Select>
                        )}
                        &nbsp;&nbsp;&nbsp;
                        <Button type="dashed" onClick={this.showModal.bind(this)}><Icon type="plus"/></Button>
                    </FormItem>
                    <InputItem fieldid = 'a_name' label="标题/名称" placeholder="标题/名称" getFieldDecorator={getFieldDecorator}  formItemLayout={formItemLayout}/>
                    <InputItem fieldid = 'a_url' label="URL" placeholder="URL" getFieldDecorator={getFieldDecorator} formItemLayout={formItemLayout}/>
                    <RadioItem fieldid ='a_method' name='请求方式' radios={this.state.method} default='get' formItemLayout={formItemLayout} getFieldDecorator={getFieldDecorator} />
                    <RadioItem fieldid ='a_login' name='是否需要登录' radios={this.state.login} default='0'  formItemLayout={formItemLayout} getFieldDecorator={getFieldDecorator} />    
                    <div className="keycode">
                        <div className="key_header">
                            <span className="key_field">请求参数:</span>
                            <Button className="add_key" type="dashed" icon="plus" onClick={this.add_key.bind(this)}></Button>&nbsp;&nbsp;&nbsp;
                        </div>
                        {filed_item}
                    </div>
                    <InputItem type="textarea" fieldid = 'a_notice' label="注意事项" placeholder="注意事项" need getFieldDecorator={getFieldDecorator} formItemLayout={formItemLayout}/>
                    <InputItem type="textarea" fieldid = 'a_result' label="返回结果" placeholder="返回结果" need getFieldDecorator={getFieldDecorator} formItemLayout={formItemLayout}/>
                    <FormItem style={{ marginTop: 24 }}>
                        <Button type="primary" htmlType="submit" className="btn_submit" >确定</Button>
                    </FormItem>
                </Form> 
                <Modal title="新增模块" visible={this.state.visible} footer={<Button type="dashed" onClick={this.add_module.bind(this)}>确定</Button>} onCancel={this.hideModal.bind(this)}>
                    <Form onSubmit={this.handleModule.bind(this)}>
                        <InputItem fieldid = 'mod_name'  placeholder="模块名称" getFieldDecorator={getFieldDecorator}/>
                    </Form>
                </Modal>
            </Card>
        )
    }
}
AddSection = Form.create()(AddSection)
export default AddSection
 