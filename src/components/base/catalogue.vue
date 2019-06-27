<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="分类名称">
                    <el-input v-model.trim="formData.cataloguename"></el-input>
                </el-form-item>
                <el-form-item label="平台名称">
                    <el-input v-model.trim="formData.ptname"></el-input>
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
            <el-button  size="small" @click="uploadFun(2)" >批量修改</el-button>
            <el-button  size="small" @click="down" >批量下载</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="catalogueList.records"  style="width: 100%;" highlight-current-row
                border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>
                <el-table-column prop="cataloguename" label="分类名称"></el-table-column>
                <el-table-column prop="cataloguelevel" label="分类等级"></el-table-column>
                <el-table-column prop="ptname" label="平台名称"></el-table-column>
                <el-table-column  label="平台费率">
                    <template slot-scope="scope" >
                        <div>
                            {{scope.row.ptcost*100+"%"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope" >
                        <div>
                            {{scope.row.status == 1 ? "开启" : "关闭"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="usertime" label="操作时间">

                </el-table-column>
                <el-table-column prop="username" label="操作人">

                </el-table-column>
            </el-table>
            <pageTool :pageData="catalogueList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

            <downUp v-if="visible" :propData="sendData" :centerDialogVisible.sync="visible" @successInfo="uploadData" >
                <strong>{{fileName}}</strong>
            </downUp>
        </div>

        </div>
    </div>
</template>
<script>
    import {finance_catalogueList,finance_selectByPrimaryKey,finance_export} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
    import downUp from "@/components/commonTool/down_up_xlsx";
    export default {
        data() {
            return {
                data:{},
                formData:{

                },
                pageData:{
                    current:1,
                    size:10
                },
                catalogueList:{},
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
                fileName:"分类平台费.xls",
                multipleSelection:[]
            }
        },
        components:{
            pageTool,
            downUp
        },
        created() {
            this.search()

        },
        mounted() {
        },
        methods: {
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( `'${v.serial}'`)
                })
				console.log("TCL: handleSelectionChange -> this.multipleSelection", this.multipleSelection)

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
                this.sendData.downPath = "api/Catalogue/model"
                this.sendData.url = "api/Catalogue/AddOrUpd"
                this.sendData.type="post"
                if(val == 1){
                    this.sendData.sendtype = 1
                    this.sendData.title = "批量上传"
                }else{
                    this.sendData.sendtype = 2
                    this.sendData.title = "批量修改"
                }
                this.visible=true
            },
            uploadData(val){
              console.log('object', val)
              if(val){
                this.search()

              }
            },
            down(){
                let str = this.multipleSelection+''
                let params = Object.assign({},this.formData,{serial:str})
                console.log("TCL: down -> params", params)
                this.$common.downloadExcl_get("api/Catalogue/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },

            async search(){
                // let params = this.formData
                let params = Object.assign({},this.pageData,this.formData)
                try{
                    let data = await finance_selectByPrimaryKey(params);
                    console.log("data ====  sss",data)
                    this.catalogueList = data
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
