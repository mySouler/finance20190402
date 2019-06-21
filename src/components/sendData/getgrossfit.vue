<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="部门">
                    <el-input v-model.trim="formData.department"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="getInventList" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">


        <div class="openDailog">
            <el-button  size="small" @click="add" >新增</el-button>
            <el-button  size="small" @click="deled" >删除</el-button>
            <el-button  size="small" @click="down" >下载</el-button>

        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="inventLists.records"   style="width: 100%;" highlight-current-row
                border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>
                <el-table-column prop="department" label="部门"> </el-table-column>
                <el-table-column prop="platform" label="平台"> </el-table-column>
                <el-table-column prop="field" label="适用字段"> </el-table-column>
                <el-table-column prop="usertime" label="新增时间"> </el-table-column>
                <el-table-column prop="username" label="新增人"> </el-table-column>

            </el-table>
            <pageTool :pageData="inventLists"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

            <downUp v-if="visible"  :propData="sendData" :centerDialogVisible.sync="visible"  >
                <strong>{{fileName}}</strong>
            </downUp>
        </div>

        </div>

          <div class="myDialog DialogBox" >
          <el-dialog title="新增" :visible.sync="openDailog"  @close="closeDailog"  width="25%" center>
              <el-form :inline="true" :model="myData"  class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="部门">
                      <el-select
                        v-model="myData.department"
                        filterable
                        placeholder="请选择部门">
                        <el-option
                          v-for="item in departments"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="平台">
                      <el-select
                        v-model="myData.platform"
                        filterable
                        placeholder="请选择平台">
                        <el-option
                          v-for="item in platformLists"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="适用字段">

                <el-checkbox-group v-model="myData.field">
                  <el-checkbox label="平台费用"></el-checkbox>
                  <el-checkbox label="收款费用"></el-checkbox>
                  <el-checkbox label="资金费用"></el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-form>
              <span slot="footer" class="dialog-footer">
                  <el-button  @click="openDailog=false">取 消</el-button>
                  <el-button @click="addData" >确定</el-button>

              </span>
          </el-dialog>
          </div>
    </div>
</template>
<script>
    import { grossConfigList,    grossConfigInset,    grossConfigDelete,    grossConfigUpdate,finance_DepartmentList,finance_platformList} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
    import downUp from "@/components/commonTool/down_up_xlsx";
    export default {
        data() {
            return {
                data:{},
                formData:{

                },
                departments:[],
                platformLists:[],
                pageData:{
                    current:1,
                    size:10
                },
                inventLists:{},
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
                multipleSelection:[],
                myData:{
                  department:'',
                  platform:"",
                  field:[]
                },
                openDailog:false,
            }
        },
        components:{
            pageTool,
            downUp
        },
        created() {

            this.getInventList()
            this.departmentList();
            this.platformList();
        },
        mounted() {
        },
        methods: {
            closeDailog(){
              this.myData.field = []
              this.myData.department = this.myData.platform = ''
            },
            async departmentList(){
                let data = await finance_DepartmentList()
                console.log("TCL: DepartmentList -> data", data)
                this.departments = data
              },
            async platformList(){
                let data = await finance_platformList()
                console.log("TCL: DepartmentList -> data", data)
                this.platformLists = data
              },
            async add(val,data){
              let that = this;
              this.openDailog = true;

            },
            async addData(){
                let params = Object.assign({},this.myData)
                params.field = params.field + ''
                // if(params.platform.length ===0 ){
                //   return this.$message.error("请选择平台")
                // }

                if(params.department.length ===0 ){
                  return this.$message.error("请选择部门")
                }
                try{
                  let data = await grossConfigInset(params)
                  this.getInventList();
                  this.$message.success(data)
                  this.openDailog =false
                }catch(error){
                  this.openDailog =false
                }
            },
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( `'${v.serial}'`)
                })

            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                this.getInventList();

            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                this.getInventList();
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
                        let data = await grossConfigDelete(params);
                        console.log("data ====",data)
                        this.$message.success(data)
                        this.getInventList();
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
                this.$common.downloadExcl_get("api/GrossConfig/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            async getInventList(){
                let newObj = Object.assign({},this.formData)

                newObj.type?newObj.type =newObj.type.key:""
                let arg = Object.assign({},this.pageData,newObj)
                try{
                    let data = await grossConfigList(arg);
                    console.log("data ====",data)
                        this.inventLists = data

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
    .DialogBox
        >>>.el-form-item,.el-select
          width 100%
        >>>.el-form-item__content
          width: calc(100% - 150px);

</style>
