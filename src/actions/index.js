import { REFRESHDATA,POSTSUCCESS } from '../constants' // 引入action类型名常量
import  'whatwg-fetch' // 可以引入fetch来进行Ajax
import  queryString from 'querystring'
export const refreshData = () => {
    return {
        type: REFRESHDATA
    }
}

export const getSuccess = (type, json) => {
    return {
        type: type,
        json
    }
}

export const postSuccess = (msg) => {
    return {
        type: POSTSUCCESS,
        msg
    }
}

function fetchGets(type,url) {
    return dispatch => {
        return fetch(url)
            .then((res) => { console.log(res.status);
                return res.json() })
            .then((data) => {
                dispatch(getSuccess(type, data.data));
            })
            .catch((e) => { console.log(e.message) })
    }
}


// 这里的方法返回一个函数进行异步操作
export function fetchGetsIfNeeded(type, url) {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        return dispatch(fetchGets(type, url))
    }
}

function fetchPosts(url,params) {
    return dispatch => {
        return fetch(url,  {
                method:'POST', 
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: queryString.stringify(params)})
            .then((res) => { console.log(res.status);
                return res.json() })
            .then((data) => {
                dispatch(postSuccess(data.msg));
            })
            .catch((e) => { console.log(e.message) })
    }
}

// 这里的方法返回一个函数进行异步操作
export function fetchPostsIfNeeded(url,params) {
    // 注意这个函数也接收了 getState() 方法
    // 它让你选择接下来 dispatch 什么
    return (dispatch, getState) => {
        return dispatch(fetchPosts(url,params))
    }
}

