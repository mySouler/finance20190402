<template>
  <div>
    <div class="department">
      <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
        <el-form-item label="批次号">
          <el-input v-model.trim="formData.groupId"></el-input>
        </el-form-item>
        <el-form-item label="文件名">
          <el-input v-model.trim="formData.uploadFileName"></el-input>
        </el-form-item>
        <el-form-item label="上传时间">
          <el-date-picker v-model="formData.userTime"  value-format="yyyy-MM-dd HH:mm:ss" type="datetime">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="search" @click="getShipmentBillLists" size="medium">搜索</el-button>
          <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="contentWrap">
      <div class="openDailog">
        <el-button size="small" @click="uploadFun(1)">上传</el-button>
        <el-button size="small" @click="deled">删除</el-button>
      </div>
      <div class="item orderTable  bgc_white mt_20">
        <el-table stripe :data="shipmentBillData.records" style="width: 100%;" highlight-current-row border @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50"> </el-table-column>
          <el-table-column prop="groupId" label="批次号"></el-table-column>
          <el-table-column prop="uploadFileName" label="上传文件名"></el-table-column>
          <el-table-column prop="userName" label="上传人">
          </el-table-column>
          <el-table-column prop="userTime" label="上传时间"></el-table-column>
          <el-table-column prop="status" label="流程状态">
            <template slot-scope="scope">
              <div>
                <!-- 1.待解析  2.文件解析结束", -->
                {{scope.row.status === 1 ? "待解析":"文件解析结束" }}
              </div>
            </template>
                </el-table-column>
                <el-table-column prop="parseStatus" label="解析状态">
                    <template slot-scope="scope">
                      <div>
                        <!-- 1 全部成功     2 部分成功", -->
                        {{scope.row.parseStatus === 1 ? "全部成功":"部分成功" }}
                      </div>
                    </template>
                </el-table-column>
                <el-table-column prop="handleTime" label="下载"></el-table-column>
                <el-table-column prop="handleTime" label="操作"></el-table-column>
                <el-table-column label="查看解析">
                  <template slot-scope="scope">
                    <div @click="openLog(scope.row)">
                      解析查看
                    </div>
                  </template>
                </el-table-column>
            </el-table>
            <pageTool :pageData="shipmentBillData"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

            <downUp  :propData="sendData" @successInfo="callBack" :centerDialogVisible.sync="visible"  >
                <strong>{{fileName}}</strong>
            </downUp>
        </div>

        </div>
    </div>
</template>

<script>
  import {
    shipmentBillDelect,
    shipmentBillLists,
    shipmentBillLog
  } from "@/http/api"
  import pageTool from "@/components/commonTool/pageTool";
  import downUp from "@/components/commonTool/down_up_xlsx";
  export default {
    data() {
      return {
        data: {},
        formData: {
        },

        pageData: {
          current: 1,
          size: 10
        },
        shipmentBillData: {},
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
        fileName: "物流对账.xls",
        multipleSelection: []
      }
    },
    components: {
      pageTool,
      downUp
    },
    created() {
      this.getShipmentBillLists()
    },
    mounted() {},
    methods: {
      dateTime(val){
      console.log("TCL: dateTime -> val", val)

      },
      async openLog(data) {
        let arg = Object.assign({},{groupId:data.groupId})
        try{
            let data = await shipmentBillLog(arg);
            console.log("data ====  sss",data)
            if(data.success){
                this.$message(data.result.desc)

            }else{
              this.$message.error(data.message)

            }
        }catch(err){
            console.log(err)
        }
        // let obj = {
        //     name:"解析查看",
        //     path:"/parseLog",
        //     args:this.multipCoin
        // }
        // this.$store.commit('addTab',obj)
      },
      handleSelectionChange(val) {
        this.multipleSelection = []
        val.map((v) => {
          this.multipleSelection.push(v.serial)
        })
        console.log("TCL: handleSelectionChange -> this.multipleSelection", val)
      },
      getPage(val) {
        console.log(val, 'getPage');
        this.pageData.current = val
        this.getShipmentBillLists()
      },
      getSize(val) {
        console.log(val, 'getSize');
        this.pageData.size = val
        this.getShipmentBillLists()

      },
      // 上传函数
      uploadFun(val) {
        this.sendData.downPath = "api/shipmentBill/downloadShipmentBillUploadTemplate"
        this.sendData.type = "post"
        this.sendData.title = "上传"
        this.sendData.url = "api/shipmentBill/excel/import"
        this.visible = true
      },
      callBack(val){
        console.log("TCL: callBack -> val", val)
        setTimeout(() => {
          this.getShipmentBillLists()

        }, 1300);

      },
      async deled() {
        if(this.multipleSelection.length === 0){
                  return this.$message.error("请选择要删除的数据")
                }
        let str = this.multipleSelection + ''
        let params = {}
        params.serial = str
        this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          try {
            let data = await shipmentBillDelect(params);
            console.log("data ====", data)
            if (data.success) {
              this.$message.success(data.message)
              this.getShipmentBillLists();
            }else{
              this.$message.error(data.message)
            }
          } catch (err) {
            console.log(err)
          }
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });
        });
      },

      async getShipmentBillLists() {
        let newObj = Object.assign({}, this.formData)
        newObj.type ? newObj.type = newObj.type.key : ""
        let arg = Object.assign({}, this.pageData, newObj)
        console.log("TCL: getShipmentBillLists -> arg", arg)
        try {
          let data = await shipmentBillLists(arg);
          console.log("data ====", data)
          if (data.success) {
            this.shipmentBillData = data.result
          }else{
            this.$message.error(data.message)
          }
        } catch (err) {
          console.log(err)
        }
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
    watch: {}
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
