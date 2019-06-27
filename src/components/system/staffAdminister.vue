<template>
  <div>
    <div class="OrderNumber department">
      <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
        <el-form-item label="用户名">
          <el-input v-model.trim="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="部门">
          <el-select v-model="formData.department" placeholder="请选择">
            <el-option v-for="item in departments" :key="item.id" :label="item.departName" :value="item.departName">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="search" @click="saffInit" size="medium">查询</el-button>
          <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="contentWrap">
      <div class="openDailog">
        <el-button size="small" @click="openAdd">新增</el-button>
      </div>
      <div class="item orderTable  bgc_white mt_20">
        <el-table stripe :data="saffList.records" style="width: 100%;" highlight-current-row @current-change="CurrentChange" border @selection-change="handleSelectionChange">
          <el-table-column prop="username" label="用户名"></el-table-column>
          <el-table-column prop="department" label="部门"></el-table-column>
          <el-table-column prop="position" label="岗位"></el-table-column>
          <el-table-column prop="status" label="状态">
            <template slot-scope="scope">
                <div >
                    {{scope.row.status == 1 ? "开启" : "关闭"}}
                </div>
            </template>
        </el-table-column>
        <el-table-column prop="purchasework" label="操作">
            <template slot-scope="scope">
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
        @close="closeHandle"
        width="20%"
        center>
            <el-form :inline="true" :model="roleInfo" :rules="rules" ref="ruleForm" class="demo-form-inline roleDiolog" label-width="110px">
                <el-form-item label="用户名" prop="username">
                    <el-input  v-model.trim="roleInfo.username" ></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="username">
                    <el-input type="password" v-model.trim="roleInfo.password" ></el-input>
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
        <power v-bind="powerProp" v-if="openPower" :openPowerDia.sync="openPower" ></power>
    </div>
    </div>
</template>

<script>
  import {
    finance_saffList,
    finance_userEdit,
    finance_userAdd,
    finance_treeList,
    finance_userDepartList,
    finance_departmens,
    finance_userPermission,
    finance_updateUserPermission
  } from "@/http/api"
  import pageTool from "@/components/commonTool/pageTool";
  import power from "@/components/commonTool/power";
  export default {
    data() {
      return {
        data: {},
        formData: {},
        pageData: {
          current: 1,
          size: 10
        },
        roles: [
          // {key:"1",value:"经理"},
          // {key:"2",value:"主管"},
          // {key:"3",value:"组长"},
          // {key:"4",value:"职员"}
        ],
        roleObj: {},
        roleInfo: {
        },
        status: false,
        add: false,
        departmentVal: '',
        rules: {
          username: [{
            required: true,
            message: '请输入',
            trigger: 'blur'
          }, ],
          department: [{
            required: true,
            message: '请选择',
            trigger: 'blur'
          }, ],
          positionId: [{
            required: true,
            message: '请选择',
            trigger: 'blur'
          }, ]
        },
        saffList: {},
        currentRow: null,
        departments: [],
        sendData: {
          href: "",
          url: "",
          sendtype: "",
          title: '',
          downPath: "",
        },
        title: "新增",
        visible: false,
        fileName: "分类平台费.xls",
        multipleSelection: [],
        add_edit_status: true,
        powerProp:{
          "initUrl":finance_userPermission,
          "updataUrl":finance_updateUserPermission,
          "type":"userId",
          "id":"",
        },
        openPower:false,
      }
    },
    created() {
      this.saffInit();
      this.initDepartment()
      this.getDepart();
    },
    components: {
      pageTool,
      power
    },
    mounted() {
    },
    methods: {
      CurrentChange(val) {
        this.currentRow = val;
      },
      handleCurrentChange() {
      },
      openAdd(data) {
        this.title = "新增"
        this.roleInfo = {}
        this.roleInfo.status = 1
        this.add = this.add_edit_status = true
      },
      edit(data) {
        console.log("TCL: edit -> data", data)
        this.title = "编辑"
        this.add = true
        this.roleInfo = {}
        this.roleInfo = Object.assign({}, data)
        this.add_edit_status = false
      },
      getPage(val) {
        console.log(val, 'getPage');
        this.pageData.current = val
        this.saffInit()
      },
      getSize(val) {
        console.log(val, 'getSize');
        this.pageData.size = val
        this.saffInit()
      },
      handleSelectionChange(val) {
        this.multipleSelection = []
        val.map((v) => {
          this.multipleSelection.push(`'${v.serial}'`)
        })
      },
      power(data){
        this.openPower = true
        console.log(this.openPower,data)
        this.powerProp.id=data.id
      },
      async getDepart() {
        try {
          let data = await finance_departmens();
          if (data.success) {
            this.roles = data.result
            data.result.map(res => {
              this.roleObj[res.id] = res.roleName
            })
          }
        } catch (err) {
          console.log(err)
        }
      },
      async updateInfo(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            this.roleInfo.position = this.roleObj[this.roleInfo.positionId]
            try {
              let data = null
              console.log("TCL: updateInfo -> this.roleInfo", this.roleInfo)
              if (this.add_edit_status) {
                data = await finance_userAdd(this.roleInfo)
                console.log("TCL: finance_userAdd -> data", data)
              } else {
                data = await finance_userEdit(this.roleInfo)
                console.log("TCL: finance_userEdit -> data", data)
              }
              if (data.success) {
                this.$message.success(data.message)
                this.saffInit()
                setTimeout(() => {
                  this.add = false
                }, 1000)
              } else {
                this.$message.error(data.message)
              }
            } catch (error) {
              console.log("TCL: openAdd -> error", error)
            }
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      saffInit() {
        let params = Object.assign({}, this.formData, this.pageData)
        finance_saffList(params).then((res) => {
          console.log(res, 'data')
          if (res.success) {
            this.saffList = res.result
          }
        }).catch((error) => {
          console.log(error)
        })
      },
      initDepartment() {
        finance_treeList().then((data) => {
          console.log("TCL: saffInit -> data", data)
          if (data.success) {
            this.departments = data.result[0].children
          }
        })
      },
      async userDepart(data = {id: ''}) {
        let obj = {}
        obj.userId = data.id
        try {
          let data = await finance_userDepartList(obj)
          console.log("TCL: userDepart -> data", data)
        } catch (err) {
          console.log("TCL: userDepart -> err", err)
        }
      },
      closeHandle(){
        this.$refs["ruleForm"].resetFields();
      },
      resetForm: function() { // 清空表单条件
        for (let key in this.formData) {
          this.formData[key] = ''
        }
        this.createtime = ''
      },
    },
    beforeDestory() {},
    computed: {},
    watch: {

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
