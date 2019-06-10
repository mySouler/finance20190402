<template>
    <div>
        <div class="department">
            
            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="收款账号">
                    <el-input v-model.trim="formData.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="paypalAccount()" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">

        <div class="openDailog">
            <el-button  size="small" @click="uploadFun(1)"  >批量上传</el-button>
            <el-button  size="small" @click="uploadFun(2)"   >批量修改</el-button>
            <el-button  size="small" @click="down" >下载</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="paypalAccountList.records"  style="width: 100%;" highlight-current-row
                @current-change="CurrentChange" border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>
                <el-table-column prop="currency" label="收款账号">
                    <el-table-column prop="rate" label="API账号">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.name}}/<br/>
                                {{scope.row.account}}<br/>
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column prop="currency" label="名字">
                    <el-table-column  label="公司名字">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.regName}}/<br/>
                                {{scope.row.company}}<br/>
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="邮箱">
                    <el-table-column label="注册日期">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.email}}/<br/>
                                {{scope.row.regTime}}<br/>
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column prop="password" label="API密码"></el-table-column>
                <el-table-column prop="token" label="API令牌"></el-table-column>
                <el-table-column prop="paymentTool" label="收款工具"></el-table-column>
                <el-table-column  label="余额">
                    <template slot-scope="scope" >
                        <div >
                            {{Number(scope.row.balance) == 0 ? 0 : Number(scope.row.balance).toFixed(4)}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  label="是否启用API">
                    <template slot-scope="scope" >
                        <div >
                            {{scope.row.flag == 1 ? "是" : "否"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope" >
                        <div >
                            {{scope.row.status == 1 ? "开启" : "关闭"}}
                        </div>
                    </template>
                </el-table-column>
                
        
                <el-table-column prop="username" label="操作人">
                    
                </el-table-column>
                <el-table-column prop="usertime" label="操作时间">
                    
                </el-table-column>
                <el-table-column    label="操作">
                    <template slot-scope="scope" >
                        <div>
                            <span class="link" @click.stop="edit(scope.row)"><img src="../../assets/edit.png" ></span>&nbsp;&nbsp;
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pageTool :pageData="paypalAccountList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>
            <downUp   :propData="sendData" :centerDialogVisible.sync="visible"  >
                <strong>{{fileName}}</strong>
            </downUp>
        </div>

        <div class="myDialog">
        <el-dialog
            title="编辑"
            :visible.sync="openEdit"
            width="25%"
            center>
            <el-form :inline="true" :model="editData" :rules="rules" ref="ruleForm" class="demo-form-inline addDiolog text-left el-dialog--center" label-width="110px">
                
                <el-form-item label="收款账号" prop="name" >
                    <el-input disabled  v-model.trim="editData.name" ></el-input>
                </el-form-item>
                <el-form-item  label="API账号" prop="account"   >
                    <el-input v-model.trim="editData.account" ></el-input>
                </el-form-item>
                <el-form-item  label="名字" prop="regName"   >
                    <el-input v-model.trim="editData.regName" ></el-input>
                </el-form-item>
                <el-form-item  label="公司名称" prop="company"   >
                    <el-input v-model.trim="editData.company" ></el-input>
                </el-form-item>
                <el-form-item  label="邮箱" prop="email"   >
                    <el-input v-model.trim="editData.email" ></el-input>
                </el-form-item>
                <el-form-item  label="注册日期" prop="regTime"   >
                    
                    <el-date-picker
                    v-model="editData.regTime"
                    :picker-options="pickerOptions"
                    type="date"
                    placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item  label="API密码" prop="password"   >
                    <el-input v-model.trim="editData.password" ></el-input>
                </el-form-item>
                <el-form-item  label="API令牌" prop="token"   >
                    <el-input v-model.trim="editData.token" ></el-input>
                </el-form-item>
                <el-form-item  label="收款工具" prop="paymentTool">
                    <el-select v-model.trim="editData.paymentTool" placeholder="请选择">
                        <el-option
                            v-for="item in tool"
                            :key="item.paymentToolId"
                            :label="item.paymentTool"
                            :value="item.paymentTool">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="Api" prop="flag"  label="是否启用"  >
                    <el-radio v-model.trim="editData.flag" :label="1">启用</el-radio>
                    <el-radio v-model.trim="editData.flag" :label="2">停用</el-radio>
                </el-form-item>
                <el-form-item class="Api" prop="status" label="状态"  >
                    <el-radio v-model.trim="editData.status" :label="1">开启</el-radio>
                    <el-radio v-model.trim="editData.status" :label="0">关闭</el-radio>
                </el-form-item>
            </el-form>


            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData('ruleForm')">确 定</el-button>
                <el-button @click="openEdit = false">取 消</el-button>
            </span>
        </el-dialog>
        </div>
        </div>
    </div>
</template>
<script>
    import {finance_paypalAccountlist,finance_paypalAccountImport,finance_editAccount,finance_payselectByPrimaryKey} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
    import downUp from "@/components/commonTool/down_up_xlsx";


    export default {
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() >= Date.now();
                    }
                },
                editData:{},
                tool:[],
                openEdit:false,
                data:{},
                formData:{},
                pageData:{
                    current:1,
                    size:10
                },
                paypalAccountList:{},
                multipleSelection:[],
                sendData:{
                    href:"",
                    url:"",
                    sendtype:"",
                    title:'',
                    downPath:"",
                    downName:'下载',
                },
                visible:false,
                fileName:"收款账号配置.xls",
                rules: {
                    paymentTool: [
                        { required: true, message: '请选择' },
                    ],
                    flag: [
                        { required: true, message: '请选择',  },
                        
                    ],
                    status: [
                        { required: true, message: '请选择',  },
                        
                    ],
                }
            }
        },
        components:{pageTool,downUp},
        created() {
            this.paypalAccount();
            //this.selectByPrimaryKey()
        },
        
        mounted() {
        },
        methods: {
            CurrentChange(val){
                this.currentRow = val;
            },
            handleCurrentChange(){

            },
            async paypalAccount(){
                let arg = Object.assign({},this.pageData,this.formData)
                
                try{
                    let data = await finance_paypalAccountlist(arg)
                    console.log(data,'params====data')
                    if(data.success){
                        this.paypalAccountList = data.result
                        
                    }else{

                    }
                }catch(e){
                    console.log(e)
                }
            },
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( v.id)
                })
				console.log("TCL: handleSelectionChange -> this.multipleSelection", val,this.multipleSelection)
                
            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                let data = Object.assign({},this.formData,this.pageData)
                this.paypalAccount()
            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                let data = Object.assign({},this.formData,this.pageData)
                this.paypalAccount()
            },
               // 上传函数
            uploadFun(val){
                this.sendData.downPath = "api/paypalAccount/downloadAccountTemplate"
                this.sendData.downName = "accountTemplate"
                
                if(val == 1){
                    this.sendData.sendtype = 1
                    this.sendData.title = "批量上传"
                    this.sendData.url = "api/paypalAccount/import"
                    this.sendData.type="post" 
                }else{
                    this.sendData.title = "批量修改"
                    this.sendData.url = "api/paypalAccount/batchChange"
                    this.sendData.type="put" 

                }
                this.visible=true
            },
            async edit(val){
				console.log("TCL: edit -> val", val)
                this.openEdit = true
                this.editData = Object.assign({},val)
                
                try{
                    let data = await finance_payselectByPrimaryKey()
					console.log("TCL: selectByPrimaryKey -> data", data)
                    this.tool = data.records
                }catch(e){
                    console.log(e)
                }
                
                
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            async updateData(formName){
                this.$refs[formName].validate( async(valid) => {
                    if (valid) {
                            console.log("TCL: updateData -> this.editData", this.editData.regTime)
                            let copyObj = Object.assign({},this.editData)

                            if(copyObj.regTime){
                                let date = this.$common.formatDateTime(copyObj.regTime)
                                copyObj.regTime = date
                            }else{
                                copyObj.regTime = ''
                            }
							console.log("TCL: updateData -> date", copyObj)
                            
                        try{
                            let data = await finance_editAccount(copyObj)
                            console.log(data,'增加')
                            if(data.success){
                                this.paypalAccount()
                                this.$message({
                                    type: 'success',
                                    message: data.message
                                }); 
                                this.openEdit = false
                            }else{

                            }
                        }catch(err){
                            console.log(err)
                            
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            async selectByPrimaryKey(){
                try{
                    let data = await finance_payselectByPrimaryKey()
					console.log("TCL: selectByPrimaryKey -> data", data)
                    
                    if(data.success){
                        
                    }else{

                    }
                }catch(e){
                    console.log(e)
                }
            },
            handleSizeChange(){

            },
            down(){
                let str = this.multipleSelection+''
                let params =''
                let ids = {ids:str}
                str.length == 0 ? '' : params = Object.assign({},ids)
                
				console.log("TCL: down -> params", params)
                this.$common.downloadExcl_post("api/paypalAccount/export",params,"accountTemplate",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
                
            },

            resetForm: function () { // 清空表单条件
                for (let key in this.formData) {
                this.formData[key] = ''
                }
                this.createtime = ''
            },
        },
        beforeDestory() {
        },
        computed: {
        },
        watch: {
        }
    }
</script>
<style lang="stylus" scoped>
    .OrderNumber
        background: #fff;
        padding-top:22px;
    .openDailog
        padding 20px 0
        .el-button
            box-sizing content-box
            border-color #16CAE1
            background #F0F9F8
            color #333
            &:hover
                background #fff
                padding: 8px 14px;
                border-width 2px;
                border-color: rgba(22, 202, 225, 1);
                color: rgb(22, 202, 225);
    .addDiolog
        >>>.el-input__inner
            width:220px;
        >>>.Api
            margin-bottom 0
            
</style>