import React, { Component } from 'react'
import { GETSUCCESS, POSTSUCCESS, PREFIX_URL } from '../constants' // 引入action类型名常量 
import { Form, Checkbox, Button, message } from 'antd'
import InputItem from './ItemInput';
const FormItem = Form.Item

export default class RowFiled extends Component {
    constructor(props) {
        super(props)
    }
    
    filedSave(e) {
        e.preventDefault();
        const k = this.props.rowid;
        this.props.form.validateFields(['name_'+k,'type_'+k,'must_need_'+k,'miaoshu_'+k,'defualt_val_'+k],(errors, values) => {
            if (errors) {
                console.log('errors', errors);
            } else {
                let params = {
                    aid: this.props.aid,
                    name: values[`name_${k}`],
                    type: values[`type_${k}`],
                    must_need: (values[`must_need_${k}`]) ? '1' : '0',
                    miaoshu: values[`miaoshu_${k}`],
                    defualt_val: values[`defualt_val_${k}`]
                }
                this.props.fetchPostsIfNeeded(PREFIX_URL + 'addField', params);
                this.timer = setTimeout(
                    () => {
                        this.success(this.props.msg);
                    }, 1000);
            }
        })
    }
    success(msg) {
        message.success(msg);
        this.props.remove(this.props.rowid)         // 返回 删除的指定行给父组件   
        this.props.fetchGetsIfNeeded(GETSUCCESS, PREFIX_URL + 'getDetail/' + this.props.aid)
    }

    cancle(){
        this.props.remove(this.props.rowid)       // 返回 删除的指定行给父组件   
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        let element;
        let operate;
        if(this.props.first_add){
            operate = (
                <FormItem>
                    <Button type="dashed" onClick={this.cancle.bind(this)} icon="minus"/>
                </FormItem>
            )
        }else{
            operate = (
                <FormItem>
                    <Button type="dashed" htmlType="submit" icon="check"/>&nbsp;&nbsp;&nbsp;
                    <Button type="dashed" onClick={this.cancle.bind(this)} icon="close"/>
                </FormItem>
            )
        }
        element =(
            <ul className="field_body">
                <li style={{width:'15%'}}>
                    <InputItem fieldid={'name_'+this.props.rowid}  placeholder='参数名称' getFieldDecorator={getFieldDecorator} />
                </li>
                <li style={{width:'10%'}}>
                {getFieldDecorator('must_need_'+this.props.rowid)(
                    <Checkbox>必填</Checkbox> 
                )}
                </li>
                <li style={{width:'15%'}}>
                    <InputItem fieldid={ 'type_'+this.props.rowid } placeholder="字段类型"  getFieldDecorator={getFieldDecorator}/>
                </li>
                <li style={{width:'38%'}}>
                    <InputItem fieldid={ 'miaoshu_'+this.props.rowid }  placeholder="字段描述" need getFieldDecorator={getFieldDecorator}/>
                </li>
                <li style={{width:'10%'}}>
                    <InputItem fieldid={'defualt_val_'+this.props.rowid } placeholder="字段默认值" need getFieldDecorator={getFieldDecorator}/>
                </li>
                <li style={{width:'12%'}}>
                    {operate}
                </li>
            </ul>
        )
       
        if(this.props.first_add){
            return(
                <div>
                    {element}
                </div>
            )
        }else{
            return (
                <Form onSubmit={this.filedSave.bind(this)}>
                    {element}
                </Form>
            )
        }
    }
}
