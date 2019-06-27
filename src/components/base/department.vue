<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="部门">
                    <el-input v-model.trim="formData.department"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="search" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">

        <div class="openDailog">
            <el-button  size="small" @click="uploadFun(1)" >批量上传</el-button>
            <el-button  size="small" @click="down" >下载</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="departmentData.records"  style="width: 100%;" highlight-current-row
                @current-change="CurrentChange" border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"    width="50"> </el-table-column>
                <el-table-column prop="department" label="部门"></el-table-column>
                <el-table-column prop="usertime" label="操作时间">

                </el-table-column>
                <el-table-column prop="username" label="操作人">

                </el-table-column>
            </el-table>
            <pageTool :pageData="departmentData"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

        </div>
        <downUp  v-if="visible" :propData="sendData" :centerDialogVisible.sync="visible" @successInfo="uploadData"  >
            <strong>{{fileName}}</strong>
        </downUp>
        </div>
    </div>
</template>
<script>
    import {finance_DepartmentList,finance_DepartmentSearch,finance_DepartmentAdd} from "@/http/api"
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
                departmentData:{},
                currentRow:[],
                sendData:{
                    href:"",
                    url:"",
                    sendtype:"",
                    title:'',
                    downPath:"",
                },
                visible:false,
                fileName:"部门配置.xls",
                multipleSelection:[]
            }
        },
        components:{
            pageTool,
            downUp
        },
        created() {
            this.search();

        },
        mounted() {
        },
        methods: {
            CurrentChange(val){
                this.currentRow = val;
            },
            handleSelectionChange(){

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
            uploadData(val){
              console.log('object', val)
              if(val){
                this.search()
              }
            },
                 // 上传函数
            uploadFun(val){
                this.sendData.downPath = "api/Department/model"
                this.sendData.url = "api/Department/Add"
                this.sendData.type="post"
                if(val == 1){
                    this.sendData.sendtype = 1
                    this.sendData.title = "批量上传"
                }
                this.visible=true
            },
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( `'${v.department}'`)
                })
				console.log("TCL: handleSelectionChange -> this.multipleSelection",val,this.multipleSelection)

            },
            down(){
                let str = this.multipleSelection+''
                let params = Object.assign({},this.formData,{departments:str})
                this.$common.downloadExcl_get("api/Department/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            async search(){
                let params = Object.assign({},this.formData,this.pageData)
                try{
                    let data = await finance_DepartmentSearch(params)
                    this.departmentData = data

                }catch(err){
					console.log("TCL: finance_platformSearch -> err", err)

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
