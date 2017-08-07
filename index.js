import React from 'react'  // 引入React
import { render } from 'react-dom' // 引入render方法
import { Provider } from 'react-redux' // 利用Provider可以使我们的 store 能为下面的组件所用
import { Router ,Route, IndexRoute,hashHistory } from 'react-router' // Browser history 是由 React Router 创建浏览器应用推荐的 history
import finalCreateStore from './src/store/configureStore'  //引入store配置
import reducer from './src/reducers'  // 引入reducers集合
import routes from './src/routes'   // 引入路由配置

// 给增强后的store传入reducer
const store = finalCreateStore(reducer)

render(
    <Provider store={store}>
        <Router  routes={routes}  history={hashHistory} />
    </Provider>,
    document.getElementById('app')
)