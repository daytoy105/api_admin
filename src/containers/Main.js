import React ,{ Component } from 'react'
import { render } from 'react-dom'
import { connect } from 'react-redux'
import { Link} from 'react-router'
import { fetchGetsIfNeeded} from '../actions/index'
import { GETMENU ,GETSUCCESS, PREFIX_URL} from '../constants'  // 引入action类型名常量 
import { Menu, Icon, Button} from 'antd'
const SubMenu = Menu.SubMenu

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '' ,
            openKeys: [],       // 菜单展开项
            rightHeight:0
        }
    }
    componentDidMount() {
        console.log(this.refs.leftMenu.offsetHeight)
        this.getUser()
        this.props.fetchGetsIfNeeded(GETMENU, PREFIX_URL+'getModules_Api/'+this.props.params.pid);
        
    }
    onOpenChange(openKeys) {
        const latestOpenKey = openKeys.find(key => !(this.state.openKeys.indexOf(key) > -1));
        this.setState({ openKeys: this.getKeyPath(latestOpenKey) });
    }
    getKeyPath(key) {
        return [key] || [];
    }
    getUser(){
        this.setState({
            username: 'mimiya'
        })
    }
    componentWillReceiveProps(nextProps) {       
        let l = this.refs.leftMenu.offsetHeight
        let lc = this.refs.leftMenu.lastChild.offsetHeight
        let height = lc > l? (lc+200): l
        console.log('leftMenu height',lc , l ,height);
        console.log('detail height',document.getElementById('#detail_box') );
        this.setState({rightHeight:height})
    }

    render() {
        const { menu} = this.props;
        let pro_name = window.localStorage.getItem('api_pro_name')
        let Rendermenu;
        if(menu.length){
            Rendermenu = menu.map((e,index)=>
                <SubMenu key={'sub'+e.id} title={<span><Icon type="mail" /><span>{e.name}</span></span>} >
                    {e.children.map((sub) =>
                        <Menu.Item key={sub.id}>
                            <Link to={'/Main/'+this.props.params.pid+'/Detail/'+sub.id}>{sub.name}</Link>
                        </Menu.Item>
                    )}
                </SubMenu>
            )
        }
        return (
            <div>
                <div id="leftMenu"  ref="leftMenu" > 
                    <Link to={"/Main/"+this.props.params.pid}><img src='./dist/images/logo.png' width="50" id="logo"/></Link>
                    <Menu theme="dark" style={{ width: 210 }}  mode="inline" openKeys={this.state.openKeys} onOpenChange={this.onOpenChange.bind(this)}>
                        {Rendermenu} 
                    </Menu>
                </div>
                <div id="rightWrap" >
                    <div className="right-header">
                        <Link to={"/Main/"+this.props.params.pid}><Button type="dashed" style={{marginBottom:'10px'}}><Icon type="plus"/></Button></Link>
                        <span className="pro_name">{pro_name}</span>
                        <Menu mode="horizontal" style={{float:'right'}}>
                            <SubMenu title={<span><Icon type="user" />{ this.state.username }</span>}>
                                <Menu.Item><Link to="/" >退出</Link></Menu.Item>
                            </SubMenu>
                        </Menu>
                    </div>
                    <div className="right-box" >
                        { this.props.children }
                    </div>
                </div>
            </div>
        )
    }
}

const getList = state => {
    return {
        menu: state.update.menu
    }
}

export default connect(
    getList, 
    { fetchGetsIfNeeded}
)(Main)
