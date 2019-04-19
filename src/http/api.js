

import axios from "axios"


//登录
const finance_login   = (data)=>{return axios.post('/sys/login',data)}
//退出
const finance_loginOut = ()=>{ return axios.post('/sys/logout')}  

//菜单列表，树形结构
const finance_menuList = ()=>{ return axios.get('/sys/permission/list')}  
//查询用户拥有的菜单权限和按钮权限
const finance_queryByUser = ()=>{ return axios.get('/sys/permission/queryByUser')}  


/*-----员工--------*/
//员工列表
const finance_saffList = ()=>{ return axios.get('/sys/user/list')}  


/*---部门---*/
//添加部门
const finance_departmentAdd = ()=>{ return axios.post('/sysdepart/sysDepart/add')}  
//部门列表 树结构数据格式
const finance_queryTreeList = ()=>{ return axios.get('/sysdepart/sysDepart/queryTreeList')}  


export {
    
    finance_login,
    finance_loginOut,
    finance_menuList,
    finance_queryByUser,
    finance_saffList,
    finance_departmentAdd,
    finance_queryTreeList


}