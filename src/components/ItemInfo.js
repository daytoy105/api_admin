import React, { Component } from 'react'
import { Button, message, Form } from 'antd'
import InputItem from './ItemInput';
import RadioItem from './ItemRadio';
import { GETSUCCESS, POSTSUCCESS, PREFIX_URL } from '../constants' // 引入action类型名常量
class InfoItem extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            editing: false,
            values:{},
            method:[{value:'get',text:'get'},{value:'post',text:'post'}],
            login:[{value:'1',text:'是'},{value:'0',text:'否'}]
        }
    }
    edit() {
        this.setState({ editing: true })
    }
    cancel(){
        this.setState({ editing: false })
    }
    handleField(e){            // Button 的区域  不在Form 范围中， 所以需要通过另外 的函数 来触发 表单的提交
        this.handleSubmit(e)
    }
    handleSubmit(e){
        e.preventDefault()
        this.props.form.validateFields([this.props.fieldid],(errors, values) => {
            if (errors) {
                console.log('errors',errors);
            }else{
                let params = { 'id': this.props.aid, 'value': values[this.props.fieldid], 'field':this.props.fieldid }
                this.props.fetchPostsIfNeeded(PREFIX_URL + 'editApi', params);
                this.timer = setTimeout(
                    () => {
                        this.success(this.props.msg);
                    }, 1000);
                this.setState({ editing: false })    // 
            }
        })
    }
    success(msg) {
        message.success(msg);
        this.props.fetchGetsIfNeeded(GETSUCCESS, PREFIX_URL + 'getDetail/' + this.props.aid)
    }
    componentWillUnmount() {
        this.timer && clearTimeout(this.timer);
    }
    componentWillReceiveProps(nextProps) {      //页面切换时，编辑状态的切换   
        if(nextProps.aid !== this.props.aid){
           this.setState({ editing: false })
        }
    }

    render() {
        let element;
        let operate;
        const { getFieldDecorator } = this.props.form
        if (this.state.editing) {
            operate =(
                <span className="item_operate" >
                    <Button  type="dashed" shape="circle-outline" icon="check" onClick={this.handleField.bind(this)}/> &nbsp;&nbsp;
                    <Button  type="dashed" shape="circle-outline" icon="close"  onClick={this.cancel.bind(this)}/> 
                </span>
            )
            if(this.props.radio_edit){
                element =(
                    <Form onSubmit={this.handleSubmit.bind(this)}> 
                        <RadioItem  fieldid = { this.props.fieldid } radios={this.props.radio_method ? this.state.method:this.state.login} default={this.props.radio_method?this.props.text:(this.props.text = this.props.text=='是'? '1': '0')} getFieldDecorator={getFieldDecorator}/>
                    </Form>
                )
            }else{
                element = (
                    <Form onSubmit={this.handleSubmit.bind(this)}> 
                        <InputItem type={this.props.type} fieldid={ this.props.fieldid } initval ={ this.props.text } placeholder={ this.props.name } editing = { this.state.editing } getFieldDecorator={getFieldDecorator}/>
                    </Form>
                )
            }
            
        } else {
            operate =(
                <Button className="item_operate" onClick = { this.edit.bind(this) } type="dashed" shape="circle-outline" icon="edit" />
            )
            element = (
                <pre className={this.props.type=='text'? '':"textarea_item"}> 
                   {this.props.text}
                </pre>
            )
        }
        return ( 
            <dl>
                <dt>
                    <span className="item_title">{ this.props.name }</span>
                    { operate }
                </dt>
                <dd>
                    { element }
                </dd>
            </dl>

        )
    }
}
InfoItem = Form.create()(InfoItem)
export default InfoItem
