import React from 'react' // 引入React
import { Router, Route, IndexRoute } from 'react-router'

// 引入单个页面（包括嵌套的子页面）
import App from './containers/App.js'
import Main from './containers/Main.js'
import Index from './containers/Index.js'
import Detail from './containers/Detail.js'

import './assets/css/main.css';

const Container = (props) => {
  return (
    <div>{props.children}</div>
  );
};

const routes = (
    <Route path="/" component={Container}> 
        <IndexRoute component={App}/>
        <Route path="Main/:pid"  component={Main} >
            <IndexRoute component={Index} />
            <Route path="Detail/:id" component={Detail} />
        </Route>
    </Route>
)

/*// 动态加载  重构路由
const routes = {
    childRoutes: [{
        path: '/',
        component: require('./containers/Container.js'),
        indexRoute: {
            getComponent(nextState, callback) {
                require.ensure([], require => {
                    callback(null, require('./containers/App.js'))
                }, 'app')
            }
        },
        childRoutes: [{
            path: 'Main/:pid',
            component: require('./containers/Main.js'),
            indexRoute: {
                getComponent(nextState, callback) {
                    require.ensure([], require => {
                        callback(null, require('./containers/Index.js'))
                    }, 'index')
                }
            },
            childRoutes: [{
                path: 'Detail/:id',
                getComponent(nextState, callback) {
                    require.ensure([], require => {
                        callback(null, require('./containers/Detail.js'))
                    }, 'detail')
                }
            }]
        }]
    }]
}
*/
export default routes;
