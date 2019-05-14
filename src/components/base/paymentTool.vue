<template>
    <div>
        <div class="department">
            
            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="收款工具">
                    <el-input v-model.trim="formData.paymentTool"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="search" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="openDailog">
            <el-button  size="small" @click="uploadFun(1)" >批量上传</el-button>
            <el-button  size="small" @click="uploadFun(2)" >批量修改</el-button>
            <el-button  size="small" @click="down" >批量下载</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="payList.records"  style="width: 100%;" highlight-current-row
                @current-change="CurrentChange" border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>
                <el-table-column prop="paymentTool" label="收款工具"></el-table-column>
                <el-table-column  label="收款费率">
                    <template slot-scope="scope" >
                        <div>
                            {{scope.row.collectionRate*100000/1000+"%"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="note" label="备注"></el-table-column>
                <el-table-column  label="状态">
                    <template slot-scope="scope" >
                        <div>
                            {{scope.row.status == 1 ? "开启" : "关闭"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="operatingTime" label="操作时间">
                    
                </el-table-column>
                <el-table-column prop="operationPeople" label="操作人">
                    
                </el-table-column>
            </el-table>
            <pageTool :pageData="payList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>
            
            <downUp  :propData="sendData" :centerDialogVisible.sync="visible"  >
                <strong>{{fileName}}</strong>
            </downUp>
        </div>
    
    </div>
</template>
<script>
    import {finance_payAddOrUpd,finance_payselectByPrimaryKey} from "@/http/api"
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
                payList:{},
                add:false,
                rules:{},
                department:{},
                sendData:{
                    href:"",
                    url:"",
                    sendtype:"",
                    title:'',
                    downPath:"",
                },
                visible:false,
                fileName:"收款工具配置.xls",
                multipleSelection:[]

            }
        },
        created() {
            this.search();

        },
        components:{
            pageTool,
            downUp
        },
        mounted() {
        },
        methods: {
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( `'${v.paymentToolId}'`)
                })
				console.log("TCL: handleSelectionChange -> this.multipleSelection", val,this.multipleSelection)
                
            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                
                this.search()
            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                
                this.search()
            },
              // 上传函数
            uploadFun(val){
                this.sendData.downPath = "api/paymentTool/model"
                this.sendData.url = "api/paymentTool/AddOrUpd"
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
            handleSizeChange(){

            },
            down(){
                let str = this.multipleSelection+''
                let params = Object.assign({},this.formData,{paymentToolId:str})
                this.$common.downloadExcl_get("api/paymentTool/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            async search(){
                let arg = Object.assign({},this.formData,this.pageData)
                try{
                    let data = await finance_payselectByPrimaryKey(arg);
                    console.log("data ====  sss",data)
                    this.payList = data
                }catch(err){
                    console.log(err)
                }
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