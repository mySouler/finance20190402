<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
               <el-form-item label="平台">
                    <el-input v-model.trim="formData.platform"></el-input>
                </el-form-item>
                <el-form-item label="货运方式">
                    <el-input v-model.trim="formData.expressType"></el-input>
                </el-form-item>

                <el-form-item label="订单属性">
                      <el-select
                        v-model="formData.ordertype"
                        filterable
                        placeholder="请选择">
                        <el-option
                          v-for="(item,index) in ordertypeData"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button class="search" @click="getfreeList" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">


        <div class="openDailog">
            <el-button  size="small" @click="addPanel" >新增</el-button>
            <el-button  size="small" @click="down" >下载</el-button>
            <el-button  size="small" @click="deled" >删除</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="freeList.records"  style="width: 100%;" highlight-current-row
                border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>
                <el-table-column prop="platform" label="平台"></el-table-column>
                <el-table-column prop="expressType" label="货运方式"></el-table-column>
                <el-table-column prop="ordertype" label="订单属性"></el-table-column>
                <el-table-column prop="usertime" label="新增时间"></el-table-column>
                <el-table-column prop="username" label="新增人"></el-table-column>
            </el-table>
            <pageTool :pageData="freeList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>
        </div>

        <div class="myDialog addFrom" >
          <el-dialog title="新增" :visible.sync="openAdd"   width="24%" center>

              <el-form :inline="true" :model="addFrom" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="平台">
                    <el-select
                        v-model="addFrom.platform"
                        placeholder="请选择">
                        <el-option
                          v-for="(item,index) in initList.platformmentList"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="货运方式">
                    <el-select
                        v-model="addFrom.expressType"
                        placeholder="请选择">
                        <el-option
                          v-for="(item,index) in initList.expressTypeList"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>

                <el-form-item label="订单属性">
                    <el-select
                        v-model="addFrom.ordertype"
                        placeholder="请选择">
                        <el-option
                          v-for="(item,index) in ordertypeData"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
            </el-form>
            <p>
              注：1.平台、货运方式、订单属性，必须填一个，才可保存


            </p>
            <p>
              2.三选一、三选二、或者都填写是可以正常保存；
            </p>

              <span slot="footer" class="dialog-footer">
                  <el-button  @click="openAdd=false">取 消</el-button>
                  <el-button @click="addData" >确定</el-button>

              </span>
          </el-dialog>
        </div>

        </div>
    </div>
</template>
<script>
    import {selectByPrimaryKeyFree,deleteFree,insertFree,orderTypeList,platformAndExpressType} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
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
                freeList:{},
                add:false,
                rules:{},
                department:{},
                addFrom:{},
                sendData:{
                    href:"",
                    url:"",
                    sendtype:"",
                    title:'',
                    downPath:"",
                },
                visible:false,
                fileName:"头程配置表--模板下载.xls",
                multipleSelection:[],
                openAdd:false,
                ordertypeData:[],
                initList:{}
            }
        },
        components:{
            pageTool,
        },
        created() {

            this.getfreeList()
            this.getOrdertype()
            this.getPlatformAndExpressType()
        },
        mounted() {
        },
        methods: {
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{

                    this.multipleSelection.push( `'${v.serial}'`)
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

            addPanel(){
              this.openAdd = true
              this.addFrom = {}
            },
            async getOrdertype(){
                try{
                  let data = await orderTypeList()
                  console.log(data,'data');

                  this.ordertypeData = data
                }catch(error){

                }
            },
            async getPlatformAndExpressType(){
                try{
                  let data = await platformAndExpressType()
                  console.log(data,'d2222ata');
                  this.initList = data

                }catch(error){

                }
            },

            async addData(){
              let addFrom = this.addFrom
              if(addFrom.expressType || addFrom.ordertype || addFrom.platform ){

              }else{
                return this.$message.error("平台、货运方式、订单属性，必须填一个")
              }
              try{
                let result = await insertFree(addFrom)
                console.log("TCL: addData -> result", result)
                this.$message.success(result);
                this.getfreeList();
                this.openAdd = false;
              }catch(error){
              console.log("TCL: addData -> error", error)

              }
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
                        let data = await deleteFree(params);
                        console.log("data ====",data)

                        this.$message.success(data)
                        this.getfreeList();
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

                this.$common.downloadExcl_get("api/FreightConfig/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            async getfreeList(){
                let newObj = Object.assign({},this.formData)

                newObj.type?newObj.type =newObj.type.key:""
                let arg = Object.assign({},this.pageData,newObj)
                try{
                    let data = await selectByPrimaryKeyFree(arg);
                    console.log("data ====",data)
                    this.freeList = data
                }catch(err){
                    console.log(err)
                }
            },
            async search(){
                // let params = this.formData
                let params = Object.assign({},this.pageData,this.formData)
                try{
                    let data = await selectByPrimaryKeyFree(params);
                    console.log("data ====  sss",data)
                    this.freeList = data
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
    .addFrom
      >>>.el-form-item,>>>.el-select
        width:100%
      >>>.el-form-item__content
        width:65%
      p
        text-align center
        color red
</style>
