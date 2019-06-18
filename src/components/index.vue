<template>

    <section class="el-container warp">

        <aside class="menuNav">
        <el-menu
          :collapse="isCollapse"
          :default-active="routeName"
          @open="handleOpen"
          @close="handleClose"
          @select="select"
          unique-opened
          class="el-menu-vertical-demo "
          background-color="transparent"
          text-color="#9c9eae"
          active-text-color="#fff"
        >
          <img v-show="!isCollapse" src="../assets/logo.png" alt="">
          <el-submenu  v-for="(item,index) in menuList" :key="item.id" :index="item.name">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{item.name}}</span>
            </template>
            <el-menu-item-group >
              <el-menu-item v-for="(key,index) in item.children" :key="key.id" @click="addTab(key.name,key.url)"   :index="key.url">
                {{key.name}}
              </el-menu-item>
            </el-menu-item-group>
            <!-- <el-submenu :index="item.children.url">
              <template slot="title">{{}}</template>
              <el-menu-item index="1-4-1">选项1</el-menu-item>
            </el-submenu> -->
          </el-submenu>
        </el-menu>
        </aside>
      <div class="el-container is-vertical">
          <el-header>
            <el-tooltip class="item" effect="dark" content="显示或隐藏左侧按钮" placement="bottom">
              <el-button class="menuIcon" size="small" @click="openMenu">
                  <img src="../assets/home.png" alt="">
              </el-button>
            </el-tooltip>
            <div class="loginInfo">
              <span>{{userName}}</span>
              <span><img src="../assets/xiaoxi.png" alt=""></span>
              <span @click="loginOut"><img src="../assets/close.png" alt=""></span>
            </div>


          </el-header>
          <div class="tab">

            <el-tabs :value="routeName" type="card"  @tab-click="chooseTab" closable @tab-remove="removeTab">
              <el-tab-pane
                v-for="item in editableTabs2"
                :key="item.path"
                :label="item.title"
                :name="item.path"

              >
              </el-tab-pane>
            </el-tabs>

            <!-- <span @click="clearAll">
                关闭全部
            </span> -->
          </div>

          <div  id="load_warp">
            <router-view  :name="currentTab" ></router-view>
          </div>

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
    created() {
        // window.location.reload()

        console.log('$route.path',this.$route)
        let name = this.$route.name
        let path = this.$route.path
        this.menuListFun()   //菜单
        // this.getMenu()
    },
    computed:{
        ...mapState({
            menuList:state=>state.menuNav.menuList,
            editableTabs2:state=>state.menuNav.editableTabs2,
            tabIndex:state=>state.menuNav.tabIndex,
            userName:state=> (sessionStorage.getItem('userInfo') ? JSON.parse(sessionStorage.getItem('userInfo')).username :""),
            routeName:state=>state.menuNav.editableTabsValue2,
            currentTab:state=> state.menuNav.editableTabsValue2.substring(state.menuNav.editableTabsValue2.lastIndexOf('/')+1)
        }),

    },
    mounted() {

    },
    methods: {
      select(row){
        console.log(row,'select')
      },
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
            sessionStorage.removeItem('userInfo')


          }else{

            this.$message.error("退出失败")

          }

        }).catch((error)=>{
          console.log(error)
        })
      },
      menuListFun(){
        finance_menuList().then((data)=>{
          console.log(data,'----')
          if(data&&data.success){
            this.$store.state.menuNav.menuList = data.result
          }
        })
      },
      // async getMenu(){
      //   try{
      //   }catch(err){
      //     console.log("TCL: getMenu -> err", err)

      //   }
      // },
      clearAll(){
        this.$store.state.menuNav.editableTabs2 =[]
      },
      openMenu(){
        this.isCollapse = !this.isCollapse

      },
      chooseTab(val){
        this.$store.state.menuNav.editableTabsValue2 = val.name
        console.log(val,'--')
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
          path,
        }
        this.$store.commit('addTab',obj)
      },
      removeTab(target){
        this.$store.commit('removeTab',target)
      },
    }
  };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>

  .menuNav
    background: #253744;

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
    background #eeeff2
    // padding:0 15px 15px;
    margin-bottom 0;
  >>>.el-icon-arrow-down:before
    content:"";
    background url(../assets/jia.png) center center no-repeat;
    display block
    width:12px;
    height:12px;
  >>>.el-submenu.is-opened>.el-submenu__title .el-submenu__icon-arrow:before
    background url(../assets/jian.png) center center no-repeat;
  >>>.menuIcon
    border:none;
    padding: 9px 0px
  >>>.menuIcon:hover,>>>.menuIcon:focus
    background none
  .tab
      >>>.el-tabs--card>.el-tabs__header .el-tabs__item.is-active
        background #fff
        position relative
        &::before
          content :"";
          display block
          width 100%;
          height 2px;
          background #fff;
          position absolute
          bottom -2px
          left:0;

      >>>.el-tabs--card>.el-tabs__header .el-tabs__nav
        border:none
      >>>.el-tabs--card>.el-tabs__header
        border-bottom none
  #load_warp
      background-color: #f9f9f9
      >>>.department
          padding:18px 0
          background #fff
          margin-bottom 16px;
          .el-form-item
            margin-bottom 0
      >>>.contentWrap
        padding:0 20px 20px;
</style>

