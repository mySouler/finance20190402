<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model.trim="formData.name"></el-input>
                </el-form-item>


                <el-form-item>
                    <el-button class="search" @click="getPermissionList" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">


        <div class="openDailog">
            <el-button  size="small" @click="add(1)" >新增</el-button>
            <el-button  size="small" @click="deled" >删除</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="permissionLists.records"  style="width: 100%;" highlight-current-row
                border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>
                <el-table-column prop="name" label="用户名"></el-table-column>
                <el-table-column prop="platform" label="平台"></el-table-column>
                <el-table-column prop="department" label="部门">

                </el-table-column>
                <el-table-column prop="username" label="操作人"></el-table-column>
                <el-table-column prop="usertime" label="操作时间"></el-table-column>
                <el-table-column  label="操作">
                    <template slot-scope="scope">
                      <div @click="add(0,scope.row)" >
                        编辑
                      </div>
                    </template>
                </el-table-column>
            </el-table>
            <pageTool :pageData="permissionLists"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>


        </div>

        </div>

        <div class="myDialog jurisBox" >
          <el-dialog :title="myTitle" :visible.sync="openDailog"   width="36%" center>

              <el-form :inline="true" :model="myData" class="rightPanel demo-form-inline text-left" label-width="100px">

                <el-form-item label="用户名">
                      <el-select
                        v-model="myData.name"
                        multiple
                        filterable
                        :disabled="disName"
                        placeholder="请选择用户">
                        <!-- position -->
                        <el-option
                          v-for="item in userList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                 <el-form-item label="平台">
                      <el-select
                        v-model="myData.platform"
                        multiple
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
                 <el-form-item label="部门">
                      <el-select
                        v-model="myData.department"
                        multiple
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
    import {permissionList,permissionUpdate,permissionDelete,permissionInset,finance_DepartmentList,finance_platformList,finance_saffList,getUserProperties} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
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
                permissionLists:{},
                rules:{},
                department:{},
                myTitle:"新增",
                openDailog:false,
                myData:{},
                departments:[],
                platformLists:[],
                userList:[],
                disName:false,
                multipleSelection:[],
            }
        },
        components:{
            pageTool,
        },
        created() {

            this.getPermissionList()

        },
        mounted() {

            this.departmentList();
            this.platformList();
            this.userProperties();



        },
        methods: {
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( v.name)
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
            async userProperties(){
              let data = await getUserProperties()
              console.log("TCL: userProperties -> data", data.result)
              if(data.success){
                this.userList = data.result.map(item=>
                  item.allData =  item.username + `(${item.position})`
                )
                console.log("TCL: userProperties -> this.userList", this.userList)
                // this.userList = Object.assign({},)

              }
            },




            async add(val,data){
                let that = this;
                this.openDailog = true;

                if(val){
                  this.disName = false
                  this.myTitle ="新增"
                  this.$nextTick(()=>{
                    this.myData.department = this.myData.name = this.myData.platform = []
                  })
                }else{
                  this.myTitle ="编辑"
                  this.disName = true

                  function writeData(data){
                    for(let type in data){
                      if(type == "name" || type == "platform" || type == "department"){
                          let info = data[type].split(',')
                          console.log("TCL: writeData -> info", info)
                          if(info.length === 0 ||info.length === 1 &&info[0] === ''){
                            that.myData[type] = []
                          }else{
                            that.myData[type] = data[type].split(',')
                          }
                        }
                      }

                  }
                  console.log("TCL: add -> data", data)
                  this.$nextTick(()=>{
                    writeData(data)
                  })
                }

            },
            async addData(){
                let params = Object.assign({},this.myData)

                if(params.name.length ===0 ){
                  return this.$message.error("请选择用户")
                }

                if(params.platform.length ===0 ){
                  return this.$message.error("请选择平台")
                }
                if(params.department.length ===0 ){
                  return this.$message.error("请选择部门")
                }
                params.name = params.name +'';
                params.department = params.department +'';
                params.platform = params.platform +'';

                console.log("TCL: addData -> params", this.myData)
                let data = ''
                if(this.myTitle == "新增"){
                  data = await permissionInset(params)
                  console.log("TCL: addData -> data", data)

                }else{
                  data = await permissionUpdate(params)
                  console.log("TCL: addData -> data", data)

                }
                this.getPermissionList();
                this.$message.success(data)
                this.openDailog =false
            },

            async deled(){
                if(this.multipleSelection.length === 0){
                  return this.$message.error("请选择要删除的数据")
                }
                let str = this.multipleSelection+''
                let params = {}
                params.name = str
                this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(async() => {
                    try{
                        let data = await permissionDelete(params);
                        console.log("data ====",data)
                        this.getPermissionList();
                        this.$message.success(data)

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

            async getPermissionList(){
                let newObj = Object.assign({},this.formData)

                newObj.type?newObj.type =newObj.type.key:""
                let arg = Object.assign({},this.pageData,newObj)
                try{
                    let data = await permissionList(arg);
                    console.log("data ====",data)

                        this.permissionLists = data
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
                    this.permissionLists = data
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
    .jurisBox
        >>>.el-form-item,.el-select
          width 100%
        >>>.el-form-item__content
          width: calc(100% - 100px);
</style>
