<template>
  <div id="login" class="text_center">
    
    <div class="login-content">
      <div class="content-main">
        <h2>衡哲财务系统</h2>

        <div class="loginForm">
          <div>
              <label for="">
                <span>
                  <img src="../assets/user.png" alt="">
                </span>
                <input type="text" v-model="username" placeholder="请输入账号"  >
              </label>
              <p>
                {{rules.username}}
              </p>
          </div>
          <div >
              <label for="">
                  <span>
                    <img src="../assets/pwd.png" alt="">
                  </span>
                  <input @keyup.enter="loginBtn()" type="password" v-model="password" placeholder="请输入密码"  >
              </label>
              <p>
                {{rules.password}}
                
              </p>
          </div>
          <div class="radios">
              <el-checkbox v-model="checked">记住密码</el-checkbox>
          </div>
          <button @click="loginBtn" :class="{activeLogin:login}">登 录</button>
          
        </div>
        <!-- <el-form :model="formData" status-icon :rules="rules" ref="formData" label-width="0" class="demo-formData">
          <el-form-item prop="username">
            <el-input class="login_input" placeholder="请输入账号" v-model="formData.username" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item prop="password" style="margin-top: 20px">
            <el-input class="login_input" @keydown.13.native="submitFormData('formData')"  placeholder="请输入密码" v-model="formData.password" type="password"  auto-complete="off"></el-input>
          </el-form-item>

          <el-form-item style="margin-top: 30px">
            <el-button @click="submitFormData('formData')" style="width: 350px;" type="primary" >登 录</el-button>
          </el-form-item>
        </el-form> -->
      </div>
    </div>
  </div>
</template>

<script>
  import {finance_login} from "@/http/api"
  
  export default {
    name: 'Login',
    data () {
      return {
        login:false,
        username: '',
        password: '',
        checked:false,
        rules: {
          username:'',
          password:'',
        }
      };
    },
    methods: {
      loginBtn: function (){
        let that = this
        if(this.username.length==0){
          this.rules.username = "请输入用户名"
          return
        }
        if(this.password.length==0){
          this.rules.password = "请输入密码"
          return
        }
        let parmams ={}
        parmams.username = this.username 
        parmams.password = this.password
        console.log(parmams)
        finance_login(this.$qs.stringify(parmams)).then((res)=>{
          console.log(res,'res')
          if(res.code == 200 ){

            this.$store.state.loginInfo = res.result.userInfo
            this.$store.state.loginInfo.token = res.result.token
            sessionStorage.setItem('token',res.result.token)
            sessionStorage.setItem('userInfo', JSON.stringify(res.result.userInfo))

            that.$message({
              type: 'success',
              message: '登录成功'
            })
            that.$router.push('/index')
            
          
          }else{
            that.$message({
              type: 'error',
              message: res.message
            })
          }

        }).catch(()=>{

        })
        // that.$message
        
      },
      resetForm (formName) {
        this.$refs[formName].resetFields()
      }
    },
    watch:{
      username:function(val){
        if(val.length>0){
          this.rules.username = ""

        }
      },
      password:function(val){
        if(val.length>0){
          this.rules.password = ""

        }
        if(val.length>0&&this.username.length>0){
            this.login = true
        }else{
            this.login = false
        }
      }
    }
  }
</script>
<style lang="stylus">
    input::-webkit-input-placeholder {
        /* placeholder颜色  */
        color: #ddd;
        /* placeholder字体大小  */
        font-size: 18px;
        
     }
  #login 
    display: flex;
    flex-direction: column;
    display: -webkit-flex;
    justify-content center
    align-items center
    flex: 1;
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    color: #333333;
    background-color: white;
    background:url(../assets/bg.png) center center no-repeat;
    background-size:cover;
    .el-input__inner
      width: 100%;
      height: 40px;
  .login-content
    width:1190px;
    height:824px;
    display flex
    justify-content flex-end
    background-color: white;
    padding-top:190px 
    background:url(../assets/loginPic.png) 100px 190px  no-repeat;
    background-color #fff;
    border-radius 25px;
    box-shadow 0 5px 18px 2px #1785cb

  .content-main
    width 400px;
    .loginForm
      width 80%
      label 
        border-bottom 1px solid  #ccc
        display block
        &+p
          min-height 30px;
          line-height 30px;
          font-size 13px;
          color red;
          text-align left
        img
          border:none
          vertical-align middle
      .radios
        label 
          border-bottom none
      input
        width 88%
        outline none
        border none
        line-height 30px;
        padding 5px 5px 5px 16px;
        font-size 14px
      button
        cursor pointer
        width 100%
        height 50px;
        line-height 50px;
        border-radius 5px;
        font-size 18px;
        color #fff;
        border:none;
        outline none
        background: -webkit-linear-gradient(left,#45d5e7,#4cecc6); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(left,#45d5e7,#4cecc6); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(left,#45d5e7,#4cecc6); /* Firefox 3.6 - 15 */
        background: linear-gradient(left,#45d5e7,#4cecc6); /* 标准的语法 */  
      button.activeLogin  
        background: -webkit-linear-gradient(left,#16cae1,#1fe7b8); /* Safari 5.1 - 6.0 */
        background: -o-linear-gradient(left,#16cae1,#1fe7b8); /* Opera 11.1 - 12.0 */
        background: -moz-linear-gradient(left,#16cae1,#1fe7b8); /* Firefox 3.6 - 15 */
        background: linear-gradient(left,#16cae1,#1fe7b8); /* 标准的语法 */  
  .radios
    margin:-12px 0 42px;
    text-align left;
    .el-checkbox__input.is-checked+.el-checkbox__label 
      color: #16cae1;
    .el-checkbox__input.is-checked .el-checkbox__inner
      background-color: #16cae1;
      border-color: #16cae1;
    .el-checkbox__input.is-focus .el-checkbox__inner
      border-color: #16cae1;
  .content-main h2
      width 80%
      font-weight: normal;
      padding 20px 0 70px
      font-size 30px
  .login-content .el-button{
    width 100% !important
    padding: 14px 20px;
    
  }
  .login-content .el-button span{
    font-size: 16px;
  }
  


</style>


