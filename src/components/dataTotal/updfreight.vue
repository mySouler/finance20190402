<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="批次号">
                    <el-input v-model.trim="formData.groupId"></el-input>
                </el-form-item>
                <el-form-item label="文件名">
                    <el-input v-model.trim="formData.fileName"></el-input>
                </el-form-item>
                <el-form-item label="运单号">
                    <el-input v-model.trim="formData.expressId"></el-input>

                </el-form-item>
                <el-form-item label="订单号">
                    <el-input v-model.trim="formData.orderId"></el-input>

                </el-form-item>

                <el-form-item>
                    <el-button class="search" @click="getSmtLists" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">


        <div class="openDailog">
            <el-button  size="small" @click="uploadFun(1)" >SMT上传</el-button>
            <el-button  size="small" @click="deled" >删除</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="smtLists.records" style="width: 100%;" highlight-current-row
                border >

                <el-table-column prop="groupId" label="批次号"></el-table-column>
                <el-table-column prop="fileName" label="上传文件名"></el-table-column>
                <el-table-column prop="userName" label="上传人"></el-table-column>
                <el-table-column prop="upTime" label="上传时间"></el-table-column>
                <el-table-column prop="status" label="状态">
                  <template slot-scope="scope">
                    <div>
                      {{scope.row.status == 1 ? "等待发货数据获取":"发货数据已获取"}}
                      <!-- 1.等待发货数据获取 2.发货数据已获取 -->
                    </div>
                  </template>
                </el-table-column>

                <el-table-column  label="操作">
                  <template slot-scope="scope" >
                      <div>
                          <span class="link" @click.stop="operation(scope.row,1)"><img src="../../assets/s.png" ></span>&nbsp;&nbsp;
                          <span class="link" @click.stop="operation(scope.row,0)"><img src="../../assets/d.png" ></span>&nbsp;&nbsp;
                      </div>
                  </template>
                </el-table-column>
            </el-table>
            <pageTool :pageData="smtLists"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

            <downUp v-if="visible"  :propData="sendData" :centerDialogVisible.sync="visible"   @successInfo="uploadData" >
                <strong>{{fileName}}</strong>
            </downUp>
        </div>
        </div>
        <div class="myDialog jurisBox" >
          <el-dialog  title="查看" :visible.sync="openDailog"  width="42%" center>
              <el-table stripe :data="smtListChilds" height="480"   style="width: 100%;" highlight-current-row
                border >
                <el-table-column prop="expressId" label="订单号/运单号"></el-table-column>
                <el-table-column prop="expressFree" label="运费"></el-table-column>
                <el-table-column prop="weight" label="账单重量"></el-table-column>
            </el-table>
            <!-- <pageTool :pageData="pageInit"  @pageChange="DialogPage" ></pageTool> -->
            <el-pagination v-if="smtListChilds.length"   @current-change="DialogPage"  :page-sizes="[30]"  :total="pageInit.total" layout="total, sizes, prev, pager, next, jumper">
            </el-pagination>

          </el-dialog>
        </div>
    </div>
</template>
<script>
    import {smtExpressList,    smtExpressDelete,    smtExpressDetail} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
    import downUp from "@/components/commonTool/down_up_xlsx";
    export default {
        data() {
            return {
                pageInit:{
                  records:[],
                  pageOn:1,
                  total:0,
                },
                openDailog:false,
                formData:{ },
                pageData:{
                    current:1,
                    size:10
                },
                smtLists:{},
                smtListChilds:[],
                sendData:{
                    href:"",
                    url:"",
                    sendtype:"",
                    title:'',
                    downPath:"",
                },
                visible:false,
                fileName:"SMT上传.xls",
                multipleSelection:[],
                oldList:[],
                pageTotal:[0,30]
            }
        },
        components:{
            pageTool,
            downUp
        },
        created() {

            this.getSmtLists()

        },
        computed:{

        },
        mounted() {
        },
        methods: {
            async operation(val,arg){
                let obj ={}

                this.smtListChilds = []
                if(arg){
                  this.openDailog = true

                  obj.groupId = val.groupId
                  try{

                    let data = await smtExpressDetail(obj)
                    console.log("TCL: operation -> data", data)
                    if(data.success){
                      let page = this.pageTotal
                      this.oldList = data.result

                      this.pageInit.total = data.result.length
                      this.smtListChilds = data.result.slice(page[0],page[1])
                      this.pageInit.records = this.smtListChilds
                    }else{
                      this.$message.error(data.message)
                    }
                  }catch(error){
                    console.log("TCL: operation -> error", error)
                  }
                }else{
                  obj = {}
                  obj.groupId = val.groupId
                  this.down(obj)
                }

            },
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( v.groupId)
                })
                console.log("TCL: handleSelectionChange -> this.multipleSelection", val)

            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                this.getSmtLists();


            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                this.getSmtLists();
            },
            DialogPage(val){
                console.log(val,'getPage');
                let page = this.pageTotal
                page[0] = (val-1)*30
                page[1] = (val)*30
                this.smtListChilds = this.oldList.slice(page[0],page[1])
            },


            uploadData(val){
              console.log('object', val)
              if(val){
                this.getSmtLists()

              }
            },
              // 上传函数
            uploadFun(val){
                this.sendData.downPath = "api/smtExpress/downloadSmtExpressTemplate"
                this.sendData.type="post"
                this.sendData.title = "SMT上传"
                this.sendData.url = "api/smtExpress/excel/import"
                this.visible=true
            },
            async deled(){
                if(this.multipleSelection.length === 0){
                  return this.$message.error("请选择要删除的数据")
                }
                let str = this.multipleSelection+''
                let params = {}
                params.groupId = str
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async() => {
                    try{
                        let data = await smtExpressDelete(params);
                        console.log("data ====",data)
                        if(data.success){
                            this.$message.success(data.message)
                            this.getSmtLists();
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
            down(params){
                this.$common.downloadExcl_post("api/smtExpress/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            async getSmtLists(){
                let newObj = Object.assign({},this.formData)

                newObj.type?newObj.type =newObj.type.key:""
                let arg = Object.assign({},this.pageData,newObj)
                try{
                    let data = await smtExpressList(arg);
                    console.log("data ====",data)
                    if(data.success){
                        this.smtLists = data.result
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
                    this.smtLists = data
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

        watch: {
          openDailog(val){
            if(!val){
              this.pageInit.records = []
              this.pageInit.pageOn = 1
              this.pageInit.total = 0
              this.pageTotal[0] = 0
              this.pageTotal[1] = 30
            }
          }
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
    .jurisBox
        >>>.el-dialog__header
              display none

        >>>.el-table td, .el-table th
            padding:8px 0
        >>>.el-pagination
            text-align center
            padding-top:16px;
        // >>>.el-pagination__sizes
        //     // display none
</style>
