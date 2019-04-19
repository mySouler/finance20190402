<template>
  
    <section class="el-container warp">
        <aside class="menuNav">
        <el-menu
          :collapse="isCollapse"
          :default-active="$route.path"
          @open="handleOpen"
          @close="handleClose"
          unique-opened
          class="el-menu-vertical-demo "
          background-color="transparent"
          text-color="#9c9eae"
          active-text-color="#fff"
          router
        >
          <el-submenu  router="item" v-for="(item,index) in menuList" :key="item.id" :index="item.name">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item-group >
              <el-menu-item v-for="(key,index) in item.children" :key="key.id" @click="addTab(key.name,key.url)"   :index="key.url">{{key.name}}</el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
        </aside>
      <div class="el-container is-vertical">
          <el-header>
            <el-tooltip class="item" effect="dark" content="显示或隐藏左侧按钮" placement="bottom">
              <el-button size="small"  @click="openMenu">开关</el-button>
            </el-tooltip>
            <div class="loginInfo">
              {{$store.state.loginInfo}}
              <span>{{$store.state.loginInfo.username}}</span>
              <span>按钮</span>
              <span @click="loginOut"><img src="../assets/close.png" alt=""></span>
            </div>
            
            
          </el-header>

          <el-tabs v-model="$store.state.menuNav.editableTabsValue2" type="card"  @tab-click="chooseTab($store.state.menuNav.editableTabsValue2)" closable @tab-remove="removeTab">
            <el-tab-pane
      
              v-for="item in editableTabs2"
              :key="item.name"
              :label="item.title"
              :name="item.name"
            >
              <el-main>
                <div style="padding: 20px;background-color: #f9f9f9" id="load_warp">
                  <router-view></router-view>
                </div>
              </el-main>
            </el-tab-pane>
          </el-tabs>
          
      </div>
    </section>
  
</template>


<script>
import{ mapState,mapGetters } from "vuex"
import {finance_loginOut,finance_menuList,finance_queryByUser} from "@/http/api"

  export default {
    name: "index",
    data() {
      return {
        
          isCollapse: false
        
      }
    },
    created() {},
    computed:{
        ...mapState({
            menuList:state=>state.menuNav.menuList,
            editableTabs2:state=>state.menuNav.editableTabs2,
            // editableTabsValue2:state=>state.menuNav.editableTabsValue2,
            tabIndex:state=>state.menuNav.tabIndex
        })
    },
    mounted() {
      console.log('$route.path',this.$route)
      let name = this.$route.name
      let path = this.$route.path
      this.addTab(name,path)
      this.menuListFun()   //菜单
    },
    methods: {
      loginOut(){
        let that = this
        console.log('退出')
        finance_loginOut().then((res)=>{
          console.log(res,'res')
          if(res.code == 200 ){
            
            that.$message({
              type: 'success',
              message: '退出成功'
            })
            that.$router.push('/')
            sessionStorage.removeItem('token')
          }else{
          
          }

        }).catch((error)=>{
          console.log(error)
        })
      },
      menuListFun(){
        finance_menuList().then((data)=>{
          console.log(data,'----')
          if(data.success){
            this.$store.state.menuNav.menuList = data.result
          }
        })
      },
      openMenu(){
        this.isCollapse = !this.isCollapse
        
      },
      chooseTab(val){
        this.$router.push(val)
        console.log('选中了')

      },
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      addTab(name,path){
        console.log(name,path,'target')
        let obj = {
          name,
          path
        }
        this.$store.commit('addTab',obj)
      },
      removeTab(target){
        this.$store.commit('removeTab',target)
        this.$router.push(this.$store.state.menuNav.editableTabsValue2)
        
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
  
  .menuNav
    background: #253744;
    height:100%;
  .el-menu-vertical-demo:not(.el-menu--collapse) {
    width: 200px;
    min-height: 400px;
    

  }
  .el-menu
    border-right:none
  .el-menu--collapse 
    li
      width:100%;
  >>>.el-submenu__title:hover,.el-menu-item:hover
    background #2d2f3c !important;
    color #fff !important;

  .el-header
    padding:15px !important;
    background #fff
    border-bottom:1px solid #ddd;
  .loginInfo
    float right
    line-height 30px;
    span 
      margin-left 30px;
      display: inline-block;
      vertical-align: middle;
      img
        vertical-align: middle;

  .el-menu-item.is-active
    position relative
    background #2d2f3c !important
    &::before
      display block
      position absolute
      left:0
      content :''
      width 2px 
      height:100%;
      background: -webkit-linear-gradient(#1fe7b8,#16cae1); /* Safari 5.1 - 6.0 */
      background: -o-linear-gradient(#1fe7b8,#16cae1); /* Opera 11.1 - 12.0 */
      background: -moz-linear-gradient(#1fe7b8,#16cae1); /* Firefox 3.6 - 15 */
      background: linear-gradient(#1fe7b8,#16cae1); /* 标准的语法 */    
    
  >>>.el-tabs__header
    background #fff
    padding:15px;
  >>>.el-icon-arrow-down:before
    content:"";
    background url(../assets/jia.png) center center no-repeat;
    display block
    width:12px;
    height:12px;
  >>>.el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow:before
    background url(../assets/jian.png) center center no-repeat;

</style>

