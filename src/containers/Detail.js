import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import InfoItem from '../components/ItemInfo';
import ApiField from '../components/ApiField';
import { GETMENU, GETSUCCESS, POSTSUCCESS, PREFIX_URL } from '../constants'   // 引入action类型名常量
import * as ApiActions from '../actions/index'    // 引入action 方法
import {Form, Card, Button, message, Modal } from 'antd'

class Detail extends Component {
    constructor(props) {
        super(props)
    }
    componentWillMount() {                    // 渲染前 加载 数据               
        this.props.actions.fetchGetsIfNeeded(GETSUCCESS, PREFIX_URL + 'getDetail/' + this.props.params.id)
    }
    componentWillReceiveProps(nextProps) {          //根据 传入的参数不同 ，渲染不同的 detail 页面
        if (nextProps.params.id !== this.props.params.id) {
            this.props.actions.fetchGetsIfNeeded(GETSUCCESS, PREFIX_URL + 'getDetail/' + nextProps.params.id)
        }
    }
    confirm() {          // 确认删除                                       
        let _this = this;   // this : 上下文已改变
        Modal.confirm({
            title: '确认要删除API吗',
            onOk() {            // 另写onOk(), 
                return new Promise((resolve, reject) => {
                    _this.deleteApi();     // 调用 deleteApi
                    setTimeout(resolve, 1000);       // 延时 1s 后 ， 确认框 隐藏
                }).catch((err) => console.log(err));
            }
        });
    }
    deleteApi() {
        let value = { del_aid: this.props.params.id }
        this.props.actions.fetchPostsIfNeeded(PREFIX_URL + 'deleteApi', value);
        this.timer = setTimeout(            // 延时 1s 执行
            () => {
                this.success(this.props.msg)
            }, 1000);
    }
    success(msg) {
        message.success(msg);
        this.props.actions.fetchGetsIfNeeded(GETMENU, PREFIX_URL + 'getModules_Api/' + this.props.params.pid)
        window.location.hash = '/Main/' + this.props.params.pid;
    }

    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    render() {
        const { json, module, actions, msg } = this.props;
        if (json) {
            let login = json.login==1? '是':'否';
            let notice = json.notice==''? '没有':json.notice;
            let ret_data = json.ret_data==''? '没有':json.ret_data;
            /****   params:
                 type : input 的 类型  取值 : text / textarea 
                 fieldid : input 的 id 
                 text  : input 的 value 
                 name  : input 的 name 
                 aid  :  api 的 id                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                 pid :   项目的 id
                 {...actions}  :  action 中的 方法
                 msg :   api 返回的 消息
                 radio_edit  :  radio 类型 
                 radio_method　: 请求 方式 的radio 类型
            ****/
            return (
                <Card id="detail_box" title={<h2>{json.name}</h2>} extra = { <Button onClick = { this.confirm.bind(this) }  style={{fontSize:'18px'}} type="dashed" shape="circle-outline" icon="delete" />} style={{ width: "88%", margin: "0 auto" }} >
                    <InfoItem type = 'text' fieldid = 'url' text={json.url} name="URL" aid={json.id} pid={this.props.pid}  {...actions} msg={msg} />
                    <InfoItem type = 'text' fieldid = 'method' text={json.method} name="请求方式" aid={json.id} pid={this.props.pid} radio_edit radio_method {...actions} msg={msg} />
                    <InfoItem type = 'text' fieldid = 'login' text={login} radio_edit name="是否需要登录" aid={json.id} pid={this.props.pid} {...actions} msg={msg} />
                    <ApiField text = {json.field} name="请求参数" aid={json.id} actions={actions} msg={msg} />
                    <InfoItem type = 'textarea' fieldid = 'notice' text={notice} name="注意事项" aid={json.id} pid={this.props.pid} {...actions} msg={msg} />
                    <InfoItem type = 'textarea' fieldid = 'ret_data' text={ret_data} name="返回结果" aid={json.id}  pid={this.props.pid} {...actions} msg={msg} />
                </Card>
            )
        }else{
           return( <div></div> )
        }
        
    }
}
// 获取state中的 json ，module ， msg 值
const getList = state => {
    return {
        json: state.update.data,
        module: state.update.modules,
        msg:  state.update.msg
    }
}
const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(ApiActions, dispatch)
    }
} 
export default connect(
    getList, 
    mapDispatchToProps
)(Detail)