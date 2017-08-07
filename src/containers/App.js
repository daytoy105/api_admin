import React, { Component } from 'react'
import { connect } from 'react-redux'
import { render } from 'react-dom'
import { Select, Card, Button, Icon, Modal,Form } from 'antd';
import { fetchGetsIfNeeded, fetchPostsIfNeeded } from '../actions/index'   // 引入action 的方法
import { GETSUCCESS, POSTSUCCESS, PREFIX_URL } from '../constants'     // 引入action类型名常量
import InputItem from '../components/ItemInput';
const FormItem = Form.Item
const Option = Select.Option
class App extends Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: false,         // Model 的显示/隐藏 状态
            projectid:'',          // 选定进入的项目id
        }
    }
    componentWillMount() {
        this.props.fetchGetsIfNeeded(GETSUCCESS,PREFIX_URL+'getProjects')           // 渲染后加载数据 
    }
    handleChange(value) {           // Select 选择框的 option  value 切换
        this.setState({ 
            projectid: value.key      //<Select> 添加了labelInValue 属性， 可以选择 option 的 value 和 text 
        })
        window.localStorage.setItem('api_pro_name',value.label);      // localStorage 存储 项目名 
    }
    handleEnter(e){
        e.preventDefault()            //在事件回调中调用preventDefault()来避免浏览器默认地提交表单。 
        this.props.form.validateFields(['select_proname'],(errors, values) => {//指定参数名['select_proname'] : 在多个表单，避免影响另一个表单的验证
            if (errors) {
                console.log('errors',errors);
            }else{
                 window.location.hash="/Main/"+this.state.projectid;    // window 的跳转 hash 能在当前页面刷新
            }
        })
    }
    checkProject(rule, value, callback) {           // 因为 option 的value 为 数字 ，而常规验证（rules: [{required: true}]）要求是字符串， 所以只能另写方法验证
        if (!value) {
            callback(new Error('项目不能为空'));
        } else {
            callback();
        }
    }
    showModal(){
        this.setState({ visible: true })
    }
    hideModal(){
        this.setState({ visible: false })

        this.props.fetchGetsIfNeeded(GETSUCCESS, PREFIX_URL + 'getProjects') ;    //调用 添加 项目 API
        
    }
    add_project(e){
        this.handleSubmit(e)        // 和 Model 一起使用下， footer 的范围不在Form 中， 所以通过另一个函数触发表单提交
    }
    handleSubmit(e){
        e.preventDefault()
        this.props.form.validateFields(['pro_name'],(errors, values) => {
            if (errors) {
                console.log('errors',errors);
            }else{
                this.props.fetchPostsIfNeeded(PREFIX_URL + 'addProject', values);
                this.timer = setTimeout( // 延时 200ms 执行
                    () => {
                        this.hideModal();
                    }, 200);
                }
        })
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    render() {
        const {json} = this.props;
        const { getFieldDecorator } = this.props.form
        let options;
        if(json.length){
            options = json.map(function(opt){
                return( <Option key = {opt.id}>{opt.name}</Option>)
            })
        }
        return (
            <div>
                <div className="header">
                    <img src={require('../assets/images/logo.png')} width="50" id="logo" />
                    <h1>API管理系统</h1>
                </div>
                <Card style={{ width: "600px", height:"300px", margin: "200px auto 100px" }}>
                    <Form layout="horizontal" onSubmit={this.handleEnter.bind(this)}>
                        <div className="project">
                            <h1> API管理系统 (React)</h1>
                        </div>
                        <div className="project_body">
                            <h2>选择进入的项目</h2>
                                <FormItem>
                                    {getFieldDecorator('select_proname',{rules: [{validator: this.checkProject}]})(
                                        <Select labelInValue  size="large" style={{ width:"480px",fontSize:"18px" }}  placeholder="Select a Project" onChange={this.handleChange.bind(this)}>
                                            {options}
                                        </Select>
                                    )}
                                    &nbsp;&nbsp;&nbsp;
                                    <Button type="dashed" onClick={this.showModal.bind(this)}><Icon type="plus"/></Button>
                                </FormItem>
                            <br />     
                        </div>
                        <div className="project_footer">
                            <Button type="primary" className="btn_enter" htmlType="submit">Enter</Button>
                        </div>
                    </Form>
                    <Modal title="新增项目" visible={this.state.visible} footer={<Button type="dashed" onClick={this.add_project.bind(this)}>确定</Button>} onCancel={this.hideModal.bind(this)}>
                        <Form onSubmit={this.handleSubmit.bind(this)}>
                            <InputItem fieldid = 'pro_name'  placeholder="项目名称" getFieldDecorator={getFieldDecorator}/>
                        </Form>
                    </Modal>
                </Card>
            </div>
        )
    }
}

App = Form.create()(App)

// 获取state中的 json 值
const getList = state => {
    return {
        json: state.update.data
    }
}

// 利用connect将组件与Redux绑定起来 
export default connect(
    getList, 
    { fetchGetsIfNeeded,fetchPostsIfNeeded}
)(App)