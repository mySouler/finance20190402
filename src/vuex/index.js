

import Vue from 'vue'
import Vuex from 'vuex'
import menuNav from './menuNav'
Vue.use(Vuex)


const state = {
    loginInfo:{
        
    }
};
const mutations = {

};

const actions = {
    
}
const modules = {
    menuNav
}
const store = new Vuex.Store({
    state,
    mutations,
    actions,
    modules,
})

export default store;