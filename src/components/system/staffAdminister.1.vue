<template>
    <div>
        <div class="OrderNumber department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model.trim="formData.username"></el-input>
                </el-form-item>
                <el-form-item label="部门">

                    <el-select v-model="formData.department" placeholder="请选择">
                        <el-option
                        v-for="item in departments"
                        :key="item.id"
                        :label="item.departName"
                        :value="item.departName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button class="search"  @click="saffInit" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">

        <div class="openDailog">
            <el-button  size="small" @click="openAdd" >新增</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="saffList.records" style="width: 100%;" highlight-current-row
                @current-change="CurrentChange" border @selection-change="handleSelectionChange">
                <el-table-column prop="username" label="用户名"></el-table-column>
                <el-table-column prop="department" label="部门"></el-table-column>
                <el-table-column prop="position" label="岗位"></el-table-column>
                <el-table-column prop="status" label="状态">
                    <template slot-scope="scope" >
                        <div >
                            {{scope.row.status == 1 ? "开启" : "关闭"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="purchasework" label="操作">
                    <template  slot-scope="scope">
                        <div>
                            <span class="link" @click.stop="edit(scope.row)"><img src="../../assets/edit.png" ></span>&nbsp;&nbsp;
                            <span class="link" @click.stop="power(scope.row)"><img src="../../assets/power.png" ></span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <pageTool :pageData="saffList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

        </div>
        <div class="myDialog">
        <el-dialog
        :title="title"
        :visible.sync="add"
        width="20%"
        center>
            <el-form :inline="true" :model="roleInfo" :rules="rules" ref="ruleForm" class="demo-form-inline roleDiolog" label-width="110px">
                <el-form-item label="用户名" prop="username">
                    <el-input  v-model.trim="roleInfo.username" ></el-input>
                </el-form-item>
                <el-form-item label="部门"  prop="department" >
                    <el-select v-model="roleInfo.department" placeholder="请选择">
                        <el-option
                        v-for="item in departments"
                        :key="item.id"
                        :label="item.departName"
                        :value="item.departName">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="岗位"  prop="positionId" >
                    <el-select v-model="roleInfo.positionId" placeholder="请选择">
                        <el-option
                        v-for="item in roles"
                        :key="item.id"
                        :label="item.roleName"
                        :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="" >
                    <el-radio v-model="roleInfo.status" :label="1">启用</el-radio>
                    <el-radio v-model="roleInfo.status" :label="0">停用</el-radio>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateInfo('ruleForm')">确 定</el-button>
                <el-button @click="add = false">取 消</el-button>
            </span>
        </el-dialog>
        </div>
        <div class="myDialog staff">
            <el-dialog

            title="菜单权限"
            :visible.sync="openPower"
            width="20%"

            center>
              <div v-loading="load"  >


                <el-tree

                    :data="powerList"
                    show-checkbox
                    :expand-on-click-node="true"
                    :check-on-click-node="true"
                    :default-expanded-keys="defaultChoose"
                    :default-checked-keys="allKey"
                    node-key="id"
                    ref="tree"

                    @check-change="handleCheckChange"
                    :highlight-current="true"
                    :props="defaultProps">
                </el-tree>

                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="updateData" >确定</el-button>
                    <el-button  @click="openPower=false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
    </div>
</template>
<script>
    import {finance_saffList,finance_userEdit,finance_userAdd,finance_treeList,finance_userDepartList,finance_departmens,finance_userPermission,finance_updateUserPermission} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
    export default {
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                defaultChoose:[],
                allKey:[],
                openPower:false,
                powerList:[],
                data:{},
                formData:{},
                pageData:{
                    current:1,
                    size:10
                },
                roles:[
                    // {key:"1",value:"经理"},
                    // {key:"2",value:"主管"},
                    // {key:"3",value:"组长"},
                    // {key:"4",value:"职员"}
                ],
                roleObj:{},
                roleInfo:{

                },
                status:false,
                add:false,
                departmentVal:'',
                rules:{
                    username: [
                        { required: true, message: '请输入', trigger: 'blur' },
                    ],
                    department: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ],
                    positionId: [
                        { required: true, message: '请选择', trigger: 'blur' },
                    ]
                },
                saffList:{},
                currentRow:null,
                departments:[],
                sendData:{
                    href:"",
                    url:"",
                    sendtype:"",
                    title:'',
                    downPath:"",
                },
                title:"新增",
                visible:false,
                fileName:"分类平台费.xls",
                multipleSelection:[],
                add_edit_status:true,
                load:true,
                allCheckData:{},

            }
        },
        created() {
            this.saffInit();
            this.initDepartment()
            this.getDepart();
        },
        components:{
            pageTool,
        },
        mounted() {

        },
        methods: {
            CurrentChange(val){
                this.currentRow = val;
            },
            handleCurrentChange(){

            },
            openAdd(data){
                this.title = "新增"
                this.roleInfo = {}
                this.roleInfo.status = 1
                this.add = this.add_edit_status = true
            },
            edit(data){
                console.log("TCL: edit -> data", data)
                this.title = "编辑"
                this.add = true
                this.roleInfo = {}
                this.roleInfo = Object.assign({},data)
                this.add_edit_status = false
            },
            async updateData(){

                // let chooseData = this.$refs.tree.getCheckedKeys()


                let chooseData = []
                // console.log("TCL: updateData -> chooseData updateData",this.allCheckData)
                for(let item in this.allCheckData){
                  chooseData.push(this.allCheckData[item])
                }

                try{
                    let params = {}
                        params.userId = this.roleInfo.id
                        params.permissionIds = chooseData + ''

                    let data = await finance_updateUserPermission(params)
                    if(data.success){

                        this.$message.success(data.message)

                        setTimeout(()=>{
                            this.openPower = false
                        },500)
                    }else{
                        this.$message.error(data.message)

                    }
                    setTimeout(()=>{
                        this.openPower = false
                    },2000)

                }catch(error){
                    console.log("TCL: updateData -> error", error)

                }

                // openPower

            },

            handleCheckChange(data, checked, indeterminate) {

              if(data.parentId){
                if(checked){

                  this.allCheckData[data.id] =data.parentId+','+ data.id ;

                }else{

                  delete this.allCheckData[data.id]

                }
              }
              console.log(data, checked, indeterminate,'chooooooooooooooo');
            },
            async power(data){
                this.allCheckData={}
                this.roleInfo = {}
                this.roleInfo = Object.assign({},data)
                this.powerList = []
                this.defaultChoose = []
                this.openPower = true
                let params = {}
                params.userId = data.id
                let result = await finance_userPermission(params)
                console.log("TCL: power -> result", result)
                this.powerList = result.result
                if( result.success){
                  this.load = false
                  if(this.powerList.length>0){
                      this.defaultChoose.push(this.powerList[0].id)
                      this.powerList.map(item=>{
                          this.allKey.push(item.id)
                console.log("TCL: power -> item.children", item.children.length)

                          if(item.children&&item.children.length>0){
                              item.children.map(item=>{
                                  this.allKey.push(item.id)
                                  if(item.children.children&&item.children.children.length>0){
                                      item.children.children.map(item=>{
                                          this.allKey.push(item.id)

                                      })
                                  }
                              })

                          }
                      })

                }
              }else{
                setTimeout(()=>{
                    this.load = false
                },1500)
              }


            },
            handleSizeChange(){

            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                this.saffInit()

            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                this.saffInit()
            },
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( `'${v.serial}'`)
                })

            },
            async getDepart(){
                try{
                    let data = await finance_departmens();
                    if(data.success){
                        this.roles = data.result
                        data.result.map(res=>{
                            this.roleObj[res.id] = res.roleName
                        })

                    }
                }catch(err){
                    console.log(err)
                }
            },
            async updateInfo(formName){
                this.$refs[formName].validate( async(valid) => {
                    if (valid) {
                        this.roleInfo.position = this.roleObj[this.roleInfo.positionId]
                        try{
                            let data = null
                            console.log("TCL: updateInfo -> this.roleInfo", this.roleInfo)
                            if(this.add_edit_status){
                                data = await finance_userAdd(this.roleInfo)
                                console.log("TCL: finance_userAdd -> data", data)
                            }else{
                                data = await finance_userEdit(this.roleInfo)
                                console.log("TCL: finance_userEdit -> data", data)
                            }
                            if(data.success){
                                this.$message.success(data.message)
                                this.saffInit()
                                setTimeout(()=>{
                                    this.add = false
                                },1000)
                            }else{
                                this.$message.error(data.message)
                            }

                        }catch(error){
                            console.log("TCL: openAdd -> error", error)
                        }
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            saffInit(){
                let params = Object.assign({},this.formData,this.pageData)
                finance_saffList(params).then((res)=>{
                    console.log(res,'data')
                    if(res.success){
                        this.saffList = res.result
                    }
                }).catch((error)=>{
                    console.log(error)
                })

            },
            initDepartment(){
                finance_treeList().then((data)=>{
					console.log("TCL: saffInit -> data", data)
                    if(data.success){
                        this.departments = data.result[0].children
                    }

                })
            },
            async userDepart(data={id:''}){
                let obj = {}
                obj.userId  = data.id
                try{
                    let data = await finance_userDepartList(obj)
					console.log("TCL: userDepart -> data", data)
                }catch(err){
				console.log("TCL: userDepart -> err", err)

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
          'openPower':function(value){
              if(!value){
                this.load = true
              }
          }
        }
    }
</script>
<style lang="stylus" scoped>


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
    .roleDiolog
        >>>.el-input__inner
            width:188px
    .staff
        >>>.el-dialog
            min-height:300px;

</style>
