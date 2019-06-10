<template>
    <div>
        <div class="department">
            
            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="币种" >
                    <el-input v-model.trim="formData.currency"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="getRate" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">

        <div class="openDailog">
            <el-button  size="small" @click="opneAdd"  >新增</el-button>
            <el-button  size="small" @click="deleData"   >删除</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="rateList.records"  style="width: 100%;" highlight-current-row
                @current-change="CurrentChange" border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"  :selectable='selectInit'     width="50">
                    
                </el-table-column>
                <el-table-column prop="currency" label="币种"></el-table-column>
                <el-table-column prop="rate" label="汇率"></el-table-column>
                <el-table-column prop="dollarRate" label="美元汇率"></el-table-column>
                <el-table-column prop="effectiveTime" label="生效时间"></el-table-column>
                <el-table-column label="是否更新">
                    <template slot-scope="scope" >
                        <div>
                            {{scope.row.status == 1 ? "已更新" : "待更新"}}
                        </div>
                    </template>    
                </el-table-column>
                <el-table-column prop="userTime" label="操作时间"></el-table-column>
                <el-table-column prop="userName" label="操作人"></el-table-column>
            </el-table>
            <pageTool :pageData="rateList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>
            
        </div>

        <div class="myDialog">
        <el-dialog
        title="新增"
        :visible.sync="add"
        width="20%"
        center>
            <el-form :inline="true" :model="sendData" :rules="rules" ref="ruleForm" class="demo-form-inline addDiolog text-left" label-width="110px">
                <el-form-item  label="币种" prop="currency">
                    <el-select v-model.trim="sendData.currency" placeholder="请选择">
                        <el-option
                        v-for="item in coin"
                        :key="item.rateId"
                        :label="item.currency"
                        :value="item.currency">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="汇率" prop="rate" >
                    <el-input type="number"   v-model.trim="sendData.rate" ></el-input>
                </el-form-item>
                <el-form-item   label="美元汇率" prop="dollarRate"   >
                    <el-input type="number"  v-model.trim="sendData.dollarRate" ></el-input>
                </el-form-item>
                <el-form-item  label="生效日期" prop="effectiveTime" >
                    <el-date-picker
                        v-model="sendData.effectiveTime"
                        type="datetime"
                        :picker-options="pickerOptions"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
            </el-form>


            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData('ruleForm')">确 定</el-button>
                <el-button @click="add = false">取 消</el-button>
            </span>
        </el-dialog>
        </div>
        </div>
    </div>
</template>
<script>
    import {finance_addChangeRate,finance_deleteChangeRate,finance_listPreChangeRate,finance_rateListCurrency} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";

    export default {
        data() {
            return {
                data:{},
                formData:{},
                pageData:{
                    currrent:1,
                    size:10
                },
                rateList:{},
                sendData:{},
                rules:{},
                add:false,
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7
                    }
                },
                coin:[],
                multipleSelection:[],
                rules: {
                    currency: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    rate: [
                        { required: true, message: '请输入', trigger: 'blur' },
                    ],
                    dollarRate: [
                        { required: true, message: '请输入', trigger: 'blur' },
                        
                    ],
                    effectiveTime: [
                        { required: true, message: '请选择', trigger: 'blur' },
                        
                    ],
                }
            }
        },
        created() {
            this.getRate();

        },
        components:{
            pageTool,
        },
        mounted() {
        },
        methods: {
            selectInit(row,index){
                
                if(row.status==1){
                    return false //不可勾选
                }else{    
                    return true  //可勾选
                }
            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                // this.getCatalogueList()
                this.rateList()
                
            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                // this.getCatalogueList()
                this.rateList()
            },
            CurrentChange(val){
                this.currentRow = val;
            },
            handleSelectionChange(val) {
                let that = this

                console.log("TCL: handleSelectionChange -> val", val)
                this.multipleSelection = []
                val.map(v=>{
                    that.multipleSelection.push(v.serial)
                })

            },
            async opneAdd(){
                this.add = true
                this.sendData ={}
                try{
                    let data = await finance_rateListCurrency()
					console.log("TCL: opneAdd -> data", data)
                    if(data.success){
                        this.coin =data.result
                    }
                }catch(error){
                    console.log("TCL: opneAdd -> error", error)

                }
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            async updateData(formName){
                this.$refs[formName].validate( async(valid) => {
                    if (valid) {
                        let parmas = this.sendData
                        let arg = JSON.parse(JSON.stringify(parmas))
                        arg.effectiveTime = this.$common.formatDateTime(parmas.effectiveTime.getTime())
                        try{
                            let data = await finance_addChangeRate(arg)
                            console.log(data,'增加')
                            if(data.success){
                                this.getRate();
                                this.$message({
                                    type: 'success',
                                    message: data.message
                                }); 
                                this.add = false
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
            async getRate(){
                let arg = Object.assign({},this.pageData,this.formData)
                
                try{
                    let data = await finance_listPreChangeRate(arg);
                    console.log("data ====",data)
                    if(data.success){
                        this.rateList = data.result
                        
                    }
                }catch(err){
                    console.log(err)
                }
            },
            async deleData(){
                
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then( async() =>{
                        let parmas = {}
                        parmas.serial = this.multipleSelection.toString()
                        let msgRet = await finance_deleteChangeRate(parmas)
						console.log("TCL: deleData -> msgRet", msgRet)

                        if(msgRet.success){
                            this.getRate();
                            this.$message({
                                type: 'success',
                                message: msgRet.message
                            }); 
                            
                        }else{
                            this.$message({
                                type: 'info',
                                message: msgRet.message
                            });   
                        }
                        
                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
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
            width:200px;
</style>