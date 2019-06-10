
export default {
    state: {
        menuList:  [],
        editableTabsValue2: '/index/home',
        editableTabs2: [{
            title: '首页',
            path: '/index/home',
            content:"",
        }],
        
        tabIndex: 1
    },
    getters: {
        
    },
    mutations: {
        addTab(state,value) {
            console.log(value,'router="item" ')
            let include = state.editableTabs2.some((item)=>{
                if( item.path ==  value.path ){
                    item.title = value.name
                    item.path  =  value.path
                    item.args  = value.args||''
                }
                return item.path ==  value.path
            })
            console.log(include,'include')
            if(!include){
                state.editableTabs2.push({
                    title:value.name,
                    path: value.path,
                    args:value.args||'',
                });
            }
            state.editableTabsValue2 =  value.path
            console.log('editableTabs2',state.editableTabs2)
        },
        removeTab(state,targetName) {
            console.log(targetName,'targetName')
            let tabs = state.editableTabs2;

            let activeName = state.editableTabsValue2;
            if (activeName === targetName) {
                tabs.forEach((tab, index) => {
                    if (tab.path === targetName) {
                        let nextTab = tabs[index + 1] || tabs[index - 1];
                        if (nextTab) {
                            activeName = nextTab.path;
                        }
                    }
                });
            }
            state.editableTabsValue2 = activeName;
            console.log(activeName,'activeName')
            state.editableTabs2 = tabs.filter(tab => tab.path !== targetName);

            if(state.editableTabs2.length == 0){
                
                state.editableTabsValue2 = ""
            }
        }
    },
    actions:{

    },
    
}