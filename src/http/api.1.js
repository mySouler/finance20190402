
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
const finance_saffList = (data)=>{ return axios.get('/sys/user/listUserPage',{params:data })}  
//sys/user/userDepartList 查询指定用户和部门关联的数据
const finance_userDepartList = (data)=>{ return axios.get('/sys/user/userDepartList',{params:data })}  
//sys/user/add 添加员工
const finance_userAdd = (data)=>{ return axios.post('/sys/user/add',data)}  
//sys/user/edit 编辑员工信息
const finance_userEdit = (data)=>{ return axios.put('/sys/user/edit',data)}  


/*---部门---*/
//添加部门
const finance_departmentAdd = (data)=>{ return axios.post('/sysdepart/sysDepart/add',data)}  
//部门列表 树结构数据格式
const finance_treeList = ()=>{ return axios.get('/sysdepart/sysDepart/queryTreeList')}  
//部门搜索功能方法,根据关键字模糊搜索相关部门
const finance_searchDepartment = (data)=>{ return axios.get('/sysdepart/sysDepart/searchBy',{params:data })}  

//查询所有用户所对应的角色信息
const finance_userRole= ()=>{ return axios.get('/sys/role/list')}  


// 分类配置
//----Catalogue
const finance_catalogueList= (data)=>{ return axios.get('/Catalogue/list',{params:data })}   

//  /Catalogue/AddOrUpd 批量新增或修改分类平台信息(flag : 1.新增 2.修改' )
const finance_AddOrUpd= (data)=>{ return axios.post('/Catalogue/AddOrUpd',data)}   
// Catalogue/selectByPrimaryKey 平台名称,分类名称 模糊查询
const finance_selectByPrimaryKey= (data)=>{ return axios.get('/Catalogue/selectByPrimaryKey',{params:data })}   
// /Catalogue/export 下载导出excl
const finance_export= (data)=>{ return axios.get('/Catalogue/export',{params:data })}   
// /Catalogue/delete 批量删除分类平台信息
const finance_delete= (data)=>{ return axios.get('/Catalogue/delete',{params:data })}   

// /paymentTool 收款工具
//收款工具信息列表
const finance_paymentToolList= (data)=>{ return axios.get('/paymentTool/list',{params:data })}   
// 批量新增或修改收款工具信息(flag : 1.新增 2.修改' )
const finance_payAddOrUpd= (data)=>{ return axios.post('/paymentTool/AddOrUpd',data)}   
//收款工具名称模糊查询  平台名称,分类名称 模糊查询
const finance_payselectByPrimaryKey= (data)=>{ return axios.get('/paymentTool/selectByPrimaryKey',{params:data })} 


//paypalAccount
//paypalAccount/list收款账号列表
const finance_paypalAccountlist= (data)=>{ return axios.get('/paypalAccount/list',{params:data })}   
//paypalAccount/import 导入PaypalAccount 配置的excel
const finance_paypalAccountImport= (data)=>{ return axios.post('/paypalAccount/import',data)}   
//paypalAccount/change PaypalAccount 编辑
const finance_editAccount= (data)=>{ return axios.put('/paypalAccount/editAccount',data)}



//paypalAccount/batchChange 导入PaypalAccount 批量修改的excel



// 汇率配置
//rate/editRateConfig 汇率配置编辑
const finance_rateEditRateConfig=  (data)=>{ return axios.put('/rate/editRateConfig',data)}   
/// 汇率配置列表 以及根据币种搜索
const finance_rateListConfig=  (data)=>{ return axios.get('/rate/listConfigRatePage',{params:data })}   
/// 汇率操作日志列表 以及根据币种搜索
const finance_rateListRateLog= (data)=>{ return axios.get('/rate/listRateLogPage',{params:data })}   
// 币种
const finance_rateListCurrency= (data)=>{ return axios.get('/rate/listCurrency',{params:data })}   



// /rate/listPreChangeRate 汇率预修改列表 及根据币种查询
const finance_listPreChangeRate= (data)=>{ return axios.get('/rate/listPreChangeRate',{params:data })}   
// /rate/deleteChangeRate 汇率预修--删除
const finance_deleteChangeRate= (data)=>{ return axios.post('/rate/deleteChangeRate',data)}   
// /rate/addChangeRate 汇率预修--新增
const finance_addChangeRate= (data)=>{ return axios.post('/rate/addChangeRate',data)}  



//店铺组别
// 批量新增或修改店铺信息(flag : 1.新增 2.修改 )
const finance_shopAddOrUpd= (data)=>{ return axios.post('/Shop/AddOrUpd',data)}  
// /Shop/list 店铺信息列表
const finance_shopList= (data)=>{ return axios.get('/Shop/list',{params:data })}  
//  Shop/selectByPrimaryKey 店铺信息模糊查询
const finance_shopSearch= (data)=>{ return axios.get('/Shop/selectByPrimaryKey',{params:data})}  

//店铺管理
// 批量新增或修改店铺信息(flag : 1.新增 2.修改 )
const finance_shopgroupAddOrUpd= (data)=>{ return axios.post('/Shopgroup/AddOrUpd',data)}  
// /Shopgroup/list 店铺组别信息列表
const finance_shopgroupList= (data)=>{ return axios.get('/Shopgroup/list',{params:data})}  
//  Shopgroup/selectByPrimaryKey 店铺组别模糊查询
const finance_shopgroupSearch= (data)=>{ return axios.get('/Shopgroup/selectByPrimaryKey',{params:data })}  


//平台
// /Shopgroup/list 平台信息列表
const finance_platformList= (data)=>{ return axios.get('/Platform/list',{params:data})}  
//Platform/delete 批量删除平台信息
const finance_platformDelete= (data)=>{ return axios.delete('/Platform/delete',{params:data})}  
//Platform/AddOrUpd 批量新增或修改平台信息(flag : 1.新增 2.修改 )
const finance_platformAddOrUpd= (data)=>{ return axios.post('/Platform/AddOrUpd',data)}  

//Platform/selectByPrimaryKey 平台名称模糊查询
const finance_platformSearch= (data)=>{ return axios.get('/Platform/selectByPrimaryKey',{params:data})}  



//部门配置
//Department/Add 批量新增销售部门
const finance_DepartmentAdd= (data)=>{ return axios.post('/Department/Add',data)}  
//Department/list 销售部门信息列表
const finance_DepartmentList= (data)=>{ return axios.get('/Department/list',{params:data})}  
//Department/selectByPrimaryKey 销售部门模糊查询
const finance_DepartmentSearch= (data)=>{ return axios.get('/Department/selectByPrimaryKey',{params:data})}  


export {
    
    finance_login,
    finance_loginOut,
    finance_menuList,
    finance_queryByUser,
    finance_saffList,
    finance_userEdit,
    finance_userAdd,
    finance_userDepartList,
    finance_departmentAdd,
    finance_treeList,
    finance_userRole,
    finance_searchDepartment,
    finance_catalogueList,
    finance_selectByPrimaryKey,
    finance_export,
    finance_delete,
    finance_AddOrUpd,
    finance_paymentToolList,
    finance_payAddOrUpd,
    finance_payselectByPrimaryKey,
    finance_rateEditRateConfig,
    finance_rateListRateLog,
    finance_rateListConfig,
    finance_deleteChangeRate,
    finance_addChangeRate,
    finance_listPreChangeRate,
    finance_shopList,
    finance_shopSearch,
    finance_shopAddOrUpd,
    finance_shopgroupAddOrUpd,
    finance_shopgroupList,
    finance_shopgroupSearch,
    finance_platformList,
    finance_platformDelete,
    finance_platformAddOrUpd,
    finance_platformSearch,
    finance_DepartmentAdd,
    finance_DepartmentList,
    finance_DepartmentSearch,
    finance_paypalAccountlist,
    finance_paypalAccountImport,
    finance_editAccount,
    finance_rateListCurrency,

}