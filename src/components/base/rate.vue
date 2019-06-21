<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="币种">
                    <el-input v-model.trim="formData.currency"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="getRate()" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">

        <div class="openDailog">
            <el-button  size="small" @click="uploadFun(1)">批量上传</el-button>
            <el-button  size="small" @click="rateLog" >查看日志</el-button>
            <el-button  size="small" @click="down" >批量下载</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="rateList.records"  style="width: 100%;" highlight-current-row
                @current-change="CurrentChange" border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"    width="50"> </el-table-column>
                <el-table-column prop="currency" label="币种"></el-table-column>
                <el-table-column prop="rate" label="汇率"></el-table-column>
                <el-table-column prop="dollarRate" label="美元汇率"></el-table-column>
                <el-table-column prop="curChineseName" label="中文名称"></el-table-column>

                <el-table-column prop="monthRate" label="月均汇率">

                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope" >
                        <div >
                            {{scope.row.status == 1 ? "开启" : "关闭"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="userTime" label="操作时间">

                </el-table-column>

                <el-table-column prop="userName" label="操作人">

                </el-table-column>
                <el-table-column   prop="purchasework" label="操作">
                    <template slot-scope="scope" >
                        <div>
                            <span class="link" @click.stop="edit(scope.row)"><img src="../../assets/edit.png" ></span>&nbsp;&nbsp;
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pageTool :pageData="rateList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

            <downUp v-if="visible" :propData="sendData" :centerDialogVisible.sync="visible"  >
                <strong>{{fileName}}</strong>
            </downUp>
        </div>

        <div class="myDialog">


        <el-dialog
        title="编辑"
        :visible.sync="add"
        width="20%"
        center>
        <el-form :inline="true" :model="sendData" :rules="rules" ref="ruleForm" class="demo-form-inline text-left" label-width="110px">
        <el-form-item label="币种">
            <el-input disabled  v-model.trim="sendData.currency" ></el-input>
        </el-form-item>
        <el-form-item label="汇率" >
            <el-input type="number" v-model.trim="sendData.rate" ></el-input>
        </el-form-item>
        <el-form-item label="美元汇率"   >
            <el-input type="number"  v-model.trim="sendData.dollarRate" ></el-input>
        </el-form-item>
        <el-form-item label="备注" >
            <el-input v-model.trim="sendData.rateDescr"   ></el-input>
        </el-form-item>
        <el-form-item label="状态"  >
            <el-radio v-model.trim="sendData.status" :label="1">启用</el-radio>
            <el-radio v-model.trim="sendData.status" :label="0">停用</el-radio>
        </el-form-item>

        </el-form>


    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateData()">确 定</el-button>
        <el-button @click="add = false">取 消</el-button>
    </span>
    </el-dialog>
    </div>
    </div>
    </div>
</template>
<script>
    import {finance_rateEditRateConfig,finance_rateListRateLog,finance_rateListConfig} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
    import downUp from "@/components/commonTool/down_up_xlsx";
    export default {
        data() {
            return {
                data:{},
                formData:{},
                pageData:{
                    current:1,
                    size:10
                },
                rateList:{},
                add:false,
                rules:{},
                sendData:{
                    href:"",
                    url:"",
                    sendtype:"",
                    title:'',
                    downPath:"",
                    downName:'下载'
                },
                visible:false,
                fileName:"财务汇率配置.xls",
                multipleSelection:[],
                multipCoin:[],
            }
        },
        components:{
            pageTool,
            downUp
        },
        created() {
            this.getRate();

        },
        mounted() {
        },
        methods: {
            handleSelectionChange(val){
                this.multipleSelection= []
                this.multipCoin = []
                val.map((v)=>{
                    this.multipleSelection.push(v.rateId)
                    this.multipCoin.push(v.currency)
                })
				console.log("TCL: handleSelectionChange -> this.multipleSelection", val,this.multipleSelection)
				console.log("TCL: handleSelectionChange -> this.multipCoin", val,this.multipCoin)

            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                this.getRate()
            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                this.getRate()
            },
                // 上传函数
            uploadFun(val){
                this.sendData.downPath = "/api/rate/downloadRateConfigTemplate"
                this.sendData.url = "api/rate/excel/import"
                this.sendData.type = "post"
                this.sendData.downName = "rateTemplate"

                if(val == 1){
                    this.sendData.sendtype = 1
                    this.sendData.title = "批量上传"
                }else{
                    this.sendData.sendtype = 2
                    this.sendData.title = "批量修改"
                }
                this.visible=true
            },
            CurrentChange(val){
                this.currentRow = val;
            },
            handleCurrentChange(){

            },
            edit(data){
                this.add = true
                this.sendData = Object.assign({},data)

                console.log('edit',data)
            },
            async updateData(){
                let params = this.sendData
                console.log(params,'params====params')

                try{
                    let data = await finance_rateEditRateConfig(params)
                    console.log(data,'params====data')
                    if(data.success){
                        this.$message.success(data.message)
                        this.getRate()
                        this.add = false
                    }else{
                        this.$message.error(data.message)
                    }
                }catch(e){
                    console.log(e)
                }
            },
            down(){
                let str = this.multipleSelection+''
                let params =''
                let ids = {idrateIds:str}
                str.length == 0 ? '' : params = Object.assign({},ids)

                this.$common.downloadExcl_post("api/rate/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            async getRate(){
                let arg = Object.assign({},this.formData,this.pageData)
                try{
                    let data = await finance_rateListConfig(arg);
                    console.log("data ====",data)
                    if(data.success){
                        this.rateList = data.result

                    }
                }catch(err){
                    console.log(err)
                }
            },

            rateLog(){

                let obj = {
                    name:"日志",
                    path:"/rateLog",
                    args:this.multipCoin
                }


                this.$store.commit('addTab',obj)

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
</style>
