<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">

                <el-form-item label="部门">
                  <el-input v-model.trim="formData.department"></el-input>

                </el-form-item>
                 <el-form-item label="新增人">
                  <el-input v-model.trim="formData.userName"></el-input>

                </el-form-item>
                 <el-form-item label="集团">
                  <el-input v-model.trim="formData.bloc"></el-input>

                </el-form-item>
                 <el-form-item label="平台">
                  <el-input v-model.trim="formData.platform"></el-input>

                </el-form-item>
                 <el-form-item label="年月">
                  <el-input v-model.trim="formData.time"></el-input>

                </el-form-item>


                <el-form-item>
                    <el-button class="search" @click="getconfigListpage" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">


        <div class="openDailog">
            <el-button  size="small" @click="uploadFun()" >批量新增</el-button>
            <el-button  size="small" @click="down" >下载</el-button>
            <el-button  size="small" @click="deled" >删除</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="configList.records"  style="width: 100%;" highlight-current-row
                border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>
                <el-table-column prop="department" label="部门"></el-table-column>
                <el-table-column prop="bloc" label="集团"></el-table-column>
                <el-table-column prop="platform" label="平台"></el-table-column>
                <el-table-column prop="sellCost" label="销售人力成本/天"></el-table-column>
                <el-table-column prop="time" label="年月"></el-table-column>
                <el-table-column prop="userTime" label="新增时间">
                </el-table-column>
                <el-table-column prop="userName" label="新增人"></el-table-column>
            </el-table>
            <pageTool :pageData="configList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

            <downUp  :propData="sendData" :centerDialogVisible.sync="visible"  >
                <strong>{{fileName}}</strong>
            </downUp>
        </div>

        </div>
    </div>
</template>
<script>
    import { configListpage,deleteSellCost} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
    import downUp from "@/components/commonTool/down_up_xlsx";
    export default {
        data() {
            return {
                data:{},
                formData:{

                },
                sendTypes:[
                  {
                    value:"真仓",
                    key:1,
                  },
                  {
                    value:"假仓",
                    key:0,
                  }
                ],
                pageData:{
                    current:1,
                    size:10
                },
                configList:{},
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
                fileName:"销售人力成本配置.xls",
                multipleSelection:[]
            }
        },
        components:{
            pageTool,
            downUp
        },
        created() {

            this.getconfigListpage()

        },
        mounted() {
        },
        methods: {
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( v.serial)
                })
				console.log("TCL: handleSelectionChange -> this.multipleSelection", val)

            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                // this.getconfigList()
                this.search()

            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                // this.getconfigList()
                this.search()
            },
              // 上传函数
            uploadFun(val){
                this.sendData.downPath = "api/sellCost/downloadSendSellCostConfigTemplate"
                this.sendData.type="post"
                this.sendData.title = "批量新增"
                this.sendData.url = "api/sellCost/batchAdd"

                this.visible=true
            },
            async deled(){
              if(this.multipleSelection.length === 0){
                  return this.$message.error("请选择要删除的数据")
                }
                let str = this.multipleSelection+''
                let params = {}
                params.serial = str
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async() => {
                    try{
                        let data = await deleteSellCost(params);
                        console.log("data ====",data)
                        if(data.success){
                            this.$message.success(data.message)
                            this.getconfigListpage();
                        }
                    }catch(err){
                        console.log(err)
                    }

                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消删除'
                  });
                });


            },
            down(){
                let str = this.multipleSelection+''
                let params = {}
                params.serial = str
                console.log("TCL: down -> params", params)
                this.$common.downloadExcl_post("api/sellCost/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            async getconfigListpage(){
                let newObj = Object.assign({},this.formData)

                newObj.type?newObj.type =newObj.type.key:""
                let arg = Object.assign({},this.pageData,newObj)
                try{
                    let data = await configListpage(arg);
                    console.log("data ====",data)
                    if(data.success){
                        this.configList = data.result
                    }
                }catch(err){
                    console.log(err)
                }
            },
            async search(){
                // let params = this.formData
                let params = Object.assign({},this.pageData,this.formData)
                try{
                    let data = await finance_selectByPrimaryKey(params);
                    console.log("data ====  sss",data)
                    this.configList = data
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
