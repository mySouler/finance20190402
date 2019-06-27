<template>
  <div>
    <div class="department">
      <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
        <el-form-item label="岗位">
          <el-input v-model.trim="formData.roleName"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="search" @click="roleInfo" size="medium">查询</el-button>
          <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="contentWrap">
      <div class="item orderTable  bgc_white mt_20">
        <el-table stripe :data="roleData.records" style="width: 100%;" highlight-current-row border>
          <el-table-column prop="roleName" label="岗位"></el-table-column>
          <el-table-column prop="createBy" label="板块权限">
            <template slot-scope="scope">
                <div>
                    <span class="link" @click.stop="rolePower(scope.row)"><img src="../../assets/power.png" ></span>
                </div>
            </template>
          </el-table-column>

        </el-table>
        <pageTool :pageData="roleData"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

      </div>
      <downUp v-if="visible" :propData="sendData" :centerDialogVisible.sync="visible"  >
          <strong>{{fileName}}</strong>
      </downUp>
      </div>
      <power v-bind="powerProp" v-if="openPower" :openPowerDia.sync="openPower" ></power>
  </div>
</template>

<script>
  import {
    finance_userRole,
    finance_roleList,
    finance_rolePermission,
    finance_updateRolePermissionn
  } from "@/http/api"

  import pageTool from "@/components/commonTool/pageTool";
  import downUp from "@/components/commonTool/down_up_xlsx";
  import power from "@/components/commonTool/power";

  export default {
    data() {
      return {
        data: {},
        formData: {},
        pageData: {
          pages: 1,
          size: 10
        },
        roleData: {},
        sendData: {},
        add: false,
        rules: {},
        department: {},
        sendData: {
          href: "",
          url: "",
          sendtype: "",
          title: '',
          downPath: "",
        },
        visible: false,
        fileName: "分类平台费.xls",
        multipleSelection: [],
        powerProp:{
          "initUrl":finance_rolePermission,
          "updataUrl":finance_updateRolePermissionn,
          "type":"roleId",
          "id":"",
        },
        openPower:false,
      }
    },
    created() {
      this.roleInfo();
    },
    mounted() {},
    components: {
      pageTool,
      downUp,
      power
    },
    methods: {
      getPage(val) {
        console.log(val, 'getPage');
        this.pageData.current = val
        this.roleInfo()
      },
      getSize(val) {
        console.log(val, 'getSize');
        this.pageData.size = val
        this.roleInfo()
      },
      uploadData(val){
        console.log('object', val)
        if(val){
          this.roleInfo()

        }
      },
      rolePower(data){
        this.openPower = true
        console.log(this.openPower,data)
        this.powerProp.id=data.id
      },
      async roleInfo() {
        let params = Object.assign({}, this.formData, this.pageData)
        try {
          let data = await finance_roleList(params);
          if (data.success) {
            this.roleData = data.result
            console.log(data, 'roleInfo')
          }
        } catch (err) {
          console.log(err)
        }
      },
      resetForm: function() {
        // 清空表单条件
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
