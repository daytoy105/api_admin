import React,{ Component }  from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as ApiActions from '../actions/index'
import AddSection from '../components/AddSection';
class Index extends Component {
    constructor(props) {
        super(props)   
    }
    render() {
        const {actions ,module ,msg} = this.props;
        return (
            <div>
                <AddSection  pid={this.props.params.pid} module={module}  {...actions} msg={msg}/>
            </div>
        )
    }       
}
const getList = state => {
    return {
        module: state.update.modules,
        msg: state.update.msg
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
)(Index)