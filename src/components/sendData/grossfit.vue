<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="部门">
                    <el-input v-model.trim="formData.deptname"></el-input>
                </el-form-item>
                <el-form-item label="平台">
                    <el-input v-model.trim="formData.ptName"></el-input>
                </el-form-item>
                <el-form-item label="组别">
                    <el-input v-model.trim="formData.groupName"></el-input>
                </el-form-item>
                <el-form-item label="操作人">
                    <el-input v-model.trim="formData.userName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="getConfigListpage" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">


        <div class="openDailog">
            <el-button  size="small" @click="uploadFun(1)" >批量新增</el-button>
            <el-button  size="small" @click="uploadFun(2)" >批量修改</el-button>
            <el-button  size="small" @click="down" >下载</el-button>
            <el-button  size="small" @click="deled" >删除</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="configList.records"  style="width: 100%;" highlight-current-row
                border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>
                <el-table-column prop="deptname" label="部门"></el-table-column>
                <el-table-column prop="ptName" label="平台"></el-table-column>
                <el-table-column prop="groupName" label="组别"></el-table-column>
                <el-table-column prop="refundRate" label="退款率">
                  <template slot-scope="scope">
                    <div>
                      {{(scope.row.refundRate || 0)*1000/10+ "%"}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="publicationRate" label="刊登费率">
                  <template slot-scope="scope">
                    <div>
                      {{(scope.row.publicationRate || 0)*1000/10+ "%"}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="inventoryprofitandlossRate" label="库存损益率">
                   <template slot-scope="scope">
                    <div>
                      {{(scope.row.inventoryprofitandlossRate || 0)*1000/10 + "%"}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="vatTax" label="VAT报税">
                   <template slot-scope="scope">
                    <div>
                      {{(scope.row.vatTax || 0)*1000/10+ "%"}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="marketingcost" label="营销费率">
                   <template slot-scope="scope">
                    <div>
                      {{(scope.row.marketingcost || 0) *1000/10+ "%"}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="friedpoints" label="炒分费用">
                   <template slot-scope="scope">
                    <div>
                      {{(scope.row.friedpoints || 0)*1000/10+ "%"}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="vpsplatformspecific" label="VPS及平台推广费率">
                   <template slot-scope="scope">
                    <div>
                      {{(scope.row.vpsplatformspecific || 0)*1000/10+ "%"}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="platformRate" label="平台费率">
                   <template slot-scope="scope">
                    <div>
                      {{(scope.row.platformRate || 0)*1000/10+ "%"}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="collectionRate" label="收款费率">
                   <template slot-scope="scope">
                    <div>
                      {{(scope.row.collectionRate || 0)*10000/100+ "%"}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="fundRate" label="资金费率">
                   <template slot-scope="scope">
                    <div>
                      {{(scope.row.fundRate || 0)*1000/10+ "%"}}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="userName" label="操作人"></el-table-column>
                <el-table-column prop="userTime" label="操作时间"></el-table-column>
            </el-table>
            <pageTool :pageData="configList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

            <downUp v-if="visible"  :propData="sendData" :centerDialogVisible.sync="visible"  >
                <strong>{{fileName}}</strong>
            </downUp>
        </div>

        </div>
    </div>
</template>
<script>
    import {finance_configListpage,finance_configDelete,finance_configExport} from "@/http/api"
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
                fileName:"日进订单毛利--模板下载.xls",
                multipleSelection:[]
            }
        },
        components:{
            pageTool,
            downUp
        },
        created() {
            // this.getconfigList();
            this.getConfigListpage()

        },
        mounted() {
        },
        methods: {
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( v.id)
                })
				console.log("TCL: handleSelectionChange -> this.multipleSelection", this.multipleSelection)

            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                this.getConfigListpage();

            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                this.getConfigListpage();

            },
              // 上传函数
            uploadFun(val){
                this.sendData.downPath = "api/dailyMargin/downloadDailyMarginConfigTemplate"
                this.sendData.type="put"
                if(val == 1){

                    this.sendData.title = "批量新增"
                    this.sendData.url = "api/dailyMargin/batchAdd"
                }else{

                    this.sendData.url = "api/dailyMargin/batchChange"
                    this.sendData.title = "批量修改"
                }
                this.visible=true
            },
            async deled(){
                if(this.multipleSelection.length === 0){
                  return this.$message.error("请选择要删除的数据")
                }
                let str = this.multipleSelection+''
                let params = {}
                params.id = str
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async() => {
                    try{
                        let data = await finance_configDelete(params);
                        console.log("data ====",data)
                        if(data.success){
                            this.$message(data.message)
                            this.getConfigListpage();
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
                params.id = str
                console.log("TCL: down -> params", params)
                this.$common.downloadExcl_post("api/dailyMargin/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            async getConfigListpage(){

                let arg = Object.assign({},this.formData)
                console.log('=========arg===========================');
                console.log(arg);
                console.log('=============arg=======================');
                try{
                    let data = await finance_configListpage(arg);
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
