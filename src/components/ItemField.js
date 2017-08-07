import React, { Component } from 'react'
import { Form, message, Button, Checkbox ,Modal } from 'antd'
import { GETSUCCESS, POSTSUCCESS, PREFIX_URL } from '../constants' // 引入action类型名常量 
import InputItem from './ItemInput';
const FormItem = Form.Item

class FieldItem extends Component {
    constructor(props, context) {
        super(props, context)
        this.state = {
            editing: false,
            checked: true
        }
    }
    componentWillMount(){    // 在render 前 改变checkbox的值 
        let { fields } = this.props;
        this.setState({ checked: fields.must_need == 1 ? true : false })
    }
    filedSave(e) {
        e.preventDefault();
        this.props.form.validateFields((errors, values) => {
            if (errors) {
                console.log('errors', errors);
            } else {
                values.aid = this.props.aid;
                values.id = this.props.id;
                values.must_need = (this.state.checked) ? '1' : '0'
                this.props.fetchPostsIfNeeded(PREFIX_URL + 'editField', values);
                this.timer = setTimeout(
                    () => {
                        this.success(this.props.msg);
                    }, 1000);
                this.setState({ editing: false })
            }
        })
    }
    success(msg) {
        message.success(msg);
        this.props.fetchGetsIfNeeded(GETSUCCESS, PREFIX_URL + 'getDetail/' + this.props.aid)
    }
    edit() {
        this.setState({ editing: true })
    }
    cancle(){
        this.setState({ editing: false })
    }
    confirm() {
        let _this = this;
        Modal.confirm({
            title: '确认要删除`请求参数`吗' ,
            onOk() {
                return new Promise((resolve, reject) => {
                    _this.delete();
                    setTimeout(resolve, 500);
                }).catch((err) => console.log(err));
            }
        });
    }
    delete() {
        let value={id : this.props.id}
        this.props.fetchPostsIfNeeded(PREFIX_URL + 'deleteField', value);
        this.timer = setTimeout(
          () => { 
            this.success(this.props.msg); 
        },500);
    }
    onChange(e) {
        this.setState({ checked: e.target.checked })
    }
   
    render() {
        const { fields } = this.props;
        const { getFieldDecorator } = this.props.form
        let element;
        let must_need = fields.must_need == 1 ? 'true' : 'false';
        if(this.state.editing){
            element = (
                <Form onSubmit={this.filedSave.bind(this)}>
                    <ul className="field_body">
                        <li style={{width:'15%'}}>
                            <InputItem fieldid='name' initval = {fields.name} placeholder="参数名" getFieldDecorator={getFieldDecorator}/>
                        </li>
                        <li style={{width:'10%'}}>
                            <Checkbox checked={this.state.checked} onChange={this.onChange.bind(this)}>必填</Checkbox> 
                        </li>
                        <li style={{width:'15%'}}>
                            <InputItem fieldid='type' initval = {fields.type}  placeholder="字段类型" getFieldDecorator={getFieldDecorator}/>
                        </li>
                        <li style={{width:'38%'}}>
                            <InputItem fieldid='miaoshu' initval = {fields.miaoshu} need getFieldDecorator={getFieldDecorator}/>
                        </li>
                        <li style={{width:'10%'}}>
                            <InputItem fieldid='defualt_val' initval = {fields.defualt_val}  need getFieldDecorator={getFieldDecorator}/>
                        </li>
                        <li style={{width:'12%'}}>
                            <FormItem>
                                <Button type="dashed" htmlType="submit" icon="check"/>&nbsp;&nbsp;&nbsp;
                                <Button type="dashed" onClick={this.cancle.bind(this)} icon="close"/>
                            </FormItem>
                        </li>
                    </ul>
                </Form>
            )
        }else{
            element = (
                <ul className="field_body">
                    <li style={{width:'15%'}}>{fields.name}</li>
                    <li style={{width:'10%'}}>{must_need}</li>
                    <li style={{width:'15%'}}>{fields.type}</li>
                    <li style={{width:'38%'}}>{fields.miaoshu}</li>
                    <li style={{width:'10%'}}>{fields.defualt_val}</li>
                    <li style={{width:'12%'}}>
                        <Button type="dashed" onClick={this.edit.bind(this)} icon="edit"/>&nbsp;&nbsp;&nbsp;
                        <Button type="dashed" onClick={this.confirm.bind(this)} icon="delete"/>
                    </li>
                </ul>
            )
        }

        return ( 
            <div>
                {element}
            </div>
        )
    }
}

FieldItem = Form.create()(FieldItem)
export default FieldItem
