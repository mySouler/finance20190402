
export default {
    state: {
        menuList:  [],
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