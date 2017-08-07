import React ,{Component} from 'react'
import { Form, Input, Radio} from 'antd'
const RadioGroup = Radio.Group
const FormItem = Form.Item
export default class RadioItem extends Component {
    constructor(props) {
        super(props)
        this.state={
            value:this.props.default
        }
    }
    onChange(e) {  
        this.setState({
          value: e.target.value,
        });
        
    }
    render() {
        
        return (
            <FormItem label= {this.props.name} {...this.props.formItemLayout}>
             {this.props.getFieldDecorator(this.props.fieldid, {initialValue:this.state.value
              })(
                <RadioGroup onChange={this.onChange.bind(this)} >
                  {
                        this.props.radios.map((e,index) =>
                            <Radio key= {index} value={e.value}>{e.text}</Radio>
                        )
                    }
                </RadioGroup>
              )}
            </FormItem>
        )
    }
}
 