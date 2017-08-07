import React ,{Component} from 'react'
import { Form, Input ,Button} from 'antd'
const FormItem = Form.Item
 
export default class InputItem extends Component {
    constructor(props) {
        super(props)
        this.state={
            initval:this.props.initval||'',
            err_message:this.props.placeholder
        }
    }

    render() {
        return (
            <FormItem  label= {this.props.label}  {...this.props.formItemLayout}>
                {this.props.getFieldDecorator(this.props.fieldid,{rules: [{required: this.props.need?false:true, message:this.state.err_message+'不能为空'}],initialValue:this.state.initval}
                    )(<Input type={this.props.type}  placeholder={this.props.placeholder}  autosize={{ minRows: 1, maxRows: 25}} />
                )}
                
            </FormItem>
        )
    }
}
 