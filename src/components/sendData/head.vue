<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="货运方式">
                    <el-input v-model.trim="formData.expressType"></el-input>
                </el-form-item>
                <el-form-item label="货运方式属性">

                    <el-select v-model.trim="formData.type">
                      <el-option
                        v-for="item in sendTypes"
                        :key="item.key"
                        :label="item.value"
                        :value="item">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作时间">
                    <el-date-picker v-model="formData.date" value-format="yyyy-MM-dd" type="daterange"></el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button class="search" @click="getHeadConfigList" size="medium">查询</el-button>
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
            <el-table stripe :data="headList.records"  style="width: 100%;" highlight-current-row
                border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>
                <el-table-column prop="expressType" label="货运方式"></el-table-column>
                <el-table-column prop="offer" label="报价"></el-table-column>
                <el-table-column prop="type" label="货运方式属性">
                  <template slot-scope="scope">
                    <div>
                      {{scope.row.type === 0 ? "假仓":"真仓" }}
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="handleTime" label="操作时间"></el-table-column>
                <el-table-column prop="username" label="操作人"></el-table-column>
            </el-table>
            <pageTool :pageData="headList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

            <downUp v-if="visible"  :propData="sendData" :centerDialogVisible.sync="visible" @successInfo="uploadData"  >
                <strong>{{fileName}}</strong>
            </downUp>
        </div>

        </div>
    </div>
</template>
<script>
    import { headConfigList,updateHeadConfig,deleteHeadConfig} from "@/http/api"
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
                headList:{},
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
                fileName:"头程配置表--模板下载.xls",
                multipleSelection:[]
            }
        },
        components:{
            pageTool,
            downUp
        },
        created() {

            this.getHeadConfigList()

        },
        mounted() {
        },
        methods: {
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( v.headSerial)
                })
				console.log("TCL: handleSelectionChange -> this.multipleSelection", val)

            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                this.getHeadConfigList();

            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                this.getHeadConfigList();
            },
            uploadData(val){
              console.log('object', val)
              if(val){
                this.getHeadConfigList()

              }
            },
              // 上传函数
            uploadFun(val){
                this.sendData.downPath = "api/headConfig/downloadHeadConfigTemplate"


                if(val == 1){
                    this.sendData.type="post"
                    this.sendData.title = "批量新增"
                    this.sendData.url = "api/headConfig/batchAdd"
                }else{
                    this.sendData.type="put"
                    this.sendData.url = "api/headConfig/updateHeadConfig"
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
                params.headSerial = str
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async() => {
                    try{
                        let data = await deleteHeadConfig(params);
                        console.log("data ====",data)
                        if(data.success){
                            this.$message.success(data.message)
                            this.getHeadConfigList();
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
                params.headSerial = str
                console.log("TCL: down -> params", params)

                this.$common.downloadExcl_post("api/headConfig/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            async getHeadConfigList(){
                let newObj = Object.assign({},this.formData)

                newObj.type?newObj.type =newObj.type.key:""

                console.log('object :', newObj);
                if(newObj.date&&newObj.date.length){
                  newObj.startTime = newObj.date[0]
                  newObj.endTime   = newObj.date[1]
                  delete newObj.date
                }

                let arg = Object.assign({},this.pageData,newObj)
                try{
                    let data = await headConfigList(arg);
                    console.log("data ====",data)
                    if(data.success){
                        this.headList = data.result
                    }else{
                      this.$message.error(data.message)
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
                    this.headList = data
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
