// reducers/index.js
import { combineReducers } from 'redux' // 利用combineReducers 合并reducers
import { routerReducer } from 'react-router-redux' // 将routerReducer一起合并管理
import { GETSUCCESS, GETMENU, GETMODULES, REFRESHDATA, POSTSUCCESS } from '../constants' // 引入action类型常量名
// 初始化state数据
const initialState = {
        data: [],
        modules:[],
        menu: [],
        msg:''
    }
    // 通过dispatch action进入
function update(state = initialState, action) {
    // 根据不同的action type进行state的更新
    switch (action.type) {
        case GETSUCCESS:
            //return Object.assign({}, state, {data:action.json})     //es6的写法
            return {...state, data: action.json } //es7的写法
        case GETMODULES:
            return {...state, modules: action.json } //es7的写法
        case GETMENU:
            return Object.assign({}, state, { menu: action.json })
        case REFRESHDATA:
            return Object.assign({}, state, { data: [] })
        case POSTSUCCESS:
            return Object.assign({}, state, { msg: action.msg })
        default:
            return state
    }
}
export default combineReducers({
    update,
    routing: routerReducer
})
