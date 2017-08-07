import React, { Component } from 'react'
import { GETSUCCESS, POSTSUCCESS, PREFIX_URL } from '../constants' // 引入action类型名常量 
import { Form , Button } from 'antd'
import FieldItem from './ItemField'
import InputItem from './ItemInput';
import FieldRow from './RowField'

let uuid = 0;
class ApiFiled extends Component {
    constructor(props) {
        super(props)
        this.state = {
            add: []
        }
    }
    // （添加请求字段的方法） 
    add_key(){
        uuid++;
        const nextKeys = this.state.add ? this.state.add.concat(uuid):[1] ;
        this.setState({
            add: nextKeys
        });
    }
    remove_key(k){
        this.setState({
            add: this.state.add.filter(key => key !== k)
        });
    }
    componentWillReceiveProps(nextProps) {     // 添加的状态切换 
        if(nextProps.aid !== this.props.aid){
            this.setState({
                add: []
            });
        }
    }
    render() {
        const { actions, msg, aid } = this.props;
        const { form } = this.props;
        const { getFieldDecorator } = form
        let element;
        let keys= this.state.add ? this.state.add:[] ;
        let _this = this;
        let filed_item = keys.map((e,index)=>
                <FieldRow key = { e } remove = { _this.remove_key.bind(_this) } rowid = { e } form = { form } aid = { aid } {...actions } msg = { msg } />
            );
        if(this.props.text==undefined || !this.props.text.length){
            element = (
                <div></div>
            )
        }else{
            element=(     
                <div>           
                    {this.props.text.map(field =>
                        <FieldItem key= {field.id } fields = { field } aid = { this.props.aid } id = { field.id } {...actions } msg = { msg } />
                    )}
                </div>
            )
        }
        return (
            <dl className="item_wrap">
                <dt>
                    <span className="item_title">{ this.props.name }</span>
                    <Button className="item_operate" onClick = { _this.add_key.bind(_this) } type="dashed" shape="circle-outline" icon="plus" />
                </dt>
                <dd>
                    <ul className="field_header">
                        <li style={{width:'15%'}}>参数名</li>
                        <li style={{width:'10%'}}>必填</li>
                        <li style={{width:'15%'}}>类型</li>
                        <li style={{width:'38%'}}>说明</li>
                        <li style={{width:'10%'}}>默认值</li>
                        <li style={{width:'12%'}}>操作</li>
                    </ul>
                    {element}
                    {filed_item}
                </dd>
            </dl>
        )
    }
}
ApiFiled = Form.create()(ApiFiled)  //经过 Form.create 包装的组件将会自带 this.props.form 属性
export default ApiFiled
