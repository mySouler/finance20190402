<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="组别">
                    <el-input v-model.trim="formData.groups"></el-input>
                </el-form-item>

                <el-form-item label="时间">
                  <el-date-picker v-model="formData.times"  value-format="yyyy-MM-dd HH:mm:ss" type="datetime"></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button class="search" @click="getInventList" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">


        <div class="openDailog">
            <el-button  size="small" @click="uploadFun(1)" >新增</el-button>
            <el-button  size="small" @click="deled" >删除</el-button>
            <el-button  size="small" @click="down" >下载</el-button>

        </div>

        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="inventLists.records" class="warehouse"  style="width: 100%;" highlight-current-row
                border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>
                <el-table-column  >
                  <el-table-column prop="groups" label="组别">

                  </el-table-column>
                </el-table-column>
                <el-table-column prop="offer" align="center" label="正式工">
                  <el-table-column prop="offercialCount" label="实际出勤人数">

                  </el-table-column>
                  <el-table-column prop="offercialHour" label="实际出勤总工时">

                  </el-table-column>
                  <el-table-column prop="offercialAvg" label="均工价">

                  </el-table-column>
                  <el-table-column prop="offercialCost" label="人力成本">

                  </el-table-column>
                </el-table-column>
                <el-table-column prop="offer" align="center" label="长期工">
                  <el-table-column prop="longCount" label="实际出勤人数">

                  </el-table-column>
                  <el-table-column prop="longHour" label="实际出勤总工时">

                  </el-table-column>
                  <el-table-column prop="longAvg" label="均工价">

                  </el-table-column>
                  <el-table-column prop="longCost" label="人力成本">

                  </el-table-column>
                </el-table-column>
                <el-table-column  >
                  <el-table-column prop="groupCost" label="组人力成本">

                  </el-table-column>
                  <el-table-column prop="times" label="时间">

                  </el-table-column>

                </el-table-column>
            </el-table>
            <pageTool :pageData="inventLists"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

            <downUp  :propData="sendData" :centerDialogVisible.sync="visible"  >
                <strong>{{fileName}}</strong>
            </downUp>
        </div>

        </div>
    </div>
</template>
<script>
    import { inventList,    inventDelete} from "@/http/api"
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
                inventLists:{},
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
                fileName:"仓库人力成本配置.xls",
                multipleSelection:[]
            }
        },
        components:{
            pageTool,
            downUp
        },
        created() {

            this.getInventList()

        },
        mounted() {
        },
        methods: {
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( v.serial)
                })

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
                this.sendData.downPath = "api/inventoryCost/downloadInventoryCostConfigTemplate"


                if(val == 1){
                    this.sendData.type="post"
                    this.sendData.title = "批量新增"
                    this.sendData.url = "api/inventoryCost/batchAdd"
                }
                this.visible=true
            },
            async deled(){
              if(this.multipleSelection.length === 0){
                  return this.$message.error("请选择要删除的数据")
                }
                let str = this.multipleSelection+''
                let params = {}
                params.serial = str
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async() => {
                    try{
                        let data = await inventDelete(params);
                        console.log("data ====",data)
                        if(data.success){
                            this.$message.success(data.message)
                            this.getInventList();
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
                this.$common.downloadExcl_post("api/inventoryCost/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            async getInventList(){
                let newObj = Object.assign({},this.formData)

                newObj.type?newObj.type =newObj.type.key:""
                let arg = Object.assign({},this.pageData,newObj)
                try{
                    let data = await inventList(arg);
                    console.log("data ====",data)
                    if(data.success){
                        this.inventLists = data.result
                    }else{
                      this.$message.error(data.message)
                    }
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
    .warehouse
      >>>.is-leaf div label
        margin-top 45px;
</style>
