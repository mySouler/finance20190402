
export default {
    state: {
        menuList:  [
            {
            "menuname": "系统管理",
            "menuicon": "icon-icon-test5",
            "menuurl": "#",
            "id": 1,
            "parentid": 0,
            "list2": [{
                "menuname": "员工管理",
                "menuicon": "#",
                "menuurl": "/index/Employee",
                "id": 2,
                "parentid": 1
            }, {
                "menuname": "部门管理",
                "menuicon": "#",
                "menuurl": "/index/Department",
                "id": 3,
                "parentid": 1
            }, {
                "menuname": "角色管理",
                "menuicon": "#",
                "menuurl": "/index/Role",
                "id": 4,
                "parentid": 1
            }, {
                "menuname": "菜单管理",
                "menuicon": "#",
                "menuurl": "/index/Order",
                "id": 5,
                "parentid": 1
            }, {
                "menuname": "字典管理",
                "menuicon": "#",
                "menuurl": "/index/Dictionaries",
                "id": 6,
                "parentid": 1
            }]
            }, 
            {
            "menuname": "采购管理",
            "menuicon": "icon-icon-test",
            "menuurl": "#",
            "id": 7,
            "parentid": 0,
            "list2": [{
                "menuname": "智能采购",
                "menuicon": "#",
                "menuurl": "/index/SmartPurchasing",
                "id": 8,
                "parentid": 7
            }, {
                "menuname": "批次管理",
                "menuicon": "#",
                "menuurl": "/index/BatchManagement",
                "id": 9,
                "parentid": 7
            }, {
                "menuname": "签收管理",
                "menuicon": "#",
                "menuurl": "/index/Sign",
                "id": 10,
                "parentid": 7
            }, {
                "menuname": "采购不显示",
                "menuicon": "#",
                "menuurl": "/index/PayNoShow",
                "id": 11,
                "parentid": 7
            }, {
                "menuname": "缺货管理",
                "menuicon": "#",
                "menuurl": "/index/LackGoodsManagement",
                "id": 12,
                "parentid": 7
            }, {
                "menuname": "退货管理",
                "menuicon": "#",
                "menuurl": "/index/ReturnManagement",
                "id": 13,
                "parentid": 7
            }, {
                "menuname": "调价管理",
                "menuicon": "#",
                "menuurl": "/index/PricesManagement",
                "id": 14,
                "parentid": 7
            }, {
                "menuname": "SKU供应商ID更换",
                "menuicon": "#",
                "menuurl": "/index/SkuIdReplace",
                "id": 15,
                "parentid": 7
            }, {
                "menuname": "1688API付款",
                "menuicon": "#",
                "menuurl": "/index/PayAlibb",
                "id": 16,
                "parentid": 7
            }, {
                "menuname": "付款管理",
                "menuicon": "#",
                "menuurl": "/index/PayManagement",
                "id": 17,
                "parentid": 7
            }, {
                "menuname": "新品运费",
                "menuicon": "#",
                "menuurl": "/index/NewFreight",
                "id": 41,
                "parentid": 7
            }, {
                "menuname": "到付运费",
                "menuicon": "#",
                "menuurl": "/index/TopayBatch",
                "id": 45,
                "parentid": 7
            }, {
                "menuname": "采购不显示配置表",
                "menuicon": "#",
                "menuurl": "/index/PayNoShowControl",
                "id": 46,
                "parentid": 7
            }]
        }],
        editableTabsValue2: '/index',
        editableTabs2: [{
            title: '首页',
            name: '/index',
            content:"",
        }],
        
        tabIndex: 1
    },
    getters: {
        
    },
    mutations: {
        addTab(state,value) {
            let include = state.editableTabs2.some((item)=>{
                return item.name == value.path
            })
            console.log(include,'include')
            if(!include){
                let newTabName = ++state.tabIndex + '';
                state.editableTabs2.push({
                    title:value.name,
                    name: value.path,
                });
                state.editableTabsValue2 = value.path;
            }else{
                state.editableTabsValue2 = value.path;
            }
            console.log(state.editableTabs2,state.editableTabsValue2)
        },
        removeTab(state,targetName) {
            console.log(targetName,'targetName')
            let tabs = state.editableTabs2;

            let activeName = state.editableTabsValue2;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.name === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.name;
                        }
                    }
                });
            }
            
            state.editableTabsValue2 = activeName;
            console.log(activeName,'activeName')
            state.editableTabs2 = tabs.filter(tab => tab.name !== targetName);

        }
    },
    actions:{

    },
    
}