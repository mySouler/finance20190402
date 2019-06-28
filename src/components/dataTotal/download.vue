<template>
    <div class="dataDown download">
        <div class="department">
            <div class="openDailog">
              <el-button  size="small" @click="down(1)" >下载</el-button>
              <el-button  size="small" @click="down(0)" >错误数据下载</el-button>
              <el-button  size="small" @click="uploadFun(1)" >sku发货数据修正</el-button>
              <el-button  size="small" @click="uploadFun(0)" >订单发货数据修正</el-button>
              <el-button  size="small" @click="search">查询</el-button>
            </div>

            <el-form inline :model="formData" class="apiForm text-left" label-width="100px">
                <el-form-item label="报表类型">
                    <el-select
                        v-model="formData.orderOrSku"
                        filterable
                        placeholder="请选择">
                        <el-option
                          v-for="item in orderOrSku"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="订单类型">
                    <el-select
                        v-model="formData.orderType"
                        multiple
                        filterable
                        placeholder="请选择">
                        <el-option
                          v-for="(item,index) in searchData.orderTypeList"
                          :key="index"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="组别">
                    <el-select
                        v-model="formData.shopgroup"
                        filterable
                        multiple
                        placeholder="请选择">
                        <el-option
                          v-for="item in searchData.shopgroup"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="平台">
                    <el-select
                        v-model="formData.platform"
                        filterable
                        multiple
                        placeholder="请选择">
                        <el-option
                          v-for="item in searchData.platformmentList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <br/>
                <el-form-item label="部门">
                    <el-select
                        v-model="formData.department"
                        filterable
                        multiple
                        placeholder="请选择">
                        <el-option
                          v-for="item in searchData.departmentList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="是否有账单">
                      <el-select
                        v-model="formData.bill"
                        filterable
                        placeholder="请选择">
                        <el-option
                          v-for="item in bills"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="时间类型">
                    <el-select
                        v-model="formData.timeType"
                        filterable
                        placeholder="请选择">
                        <el-option
                          v-for="item in timeTypes"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                    <el-date-picker v-model="formData.times"  value-format="yyyy-MM-dd HH:mm:ss" type="daterange"></el-date-picker>
                </el-form-item>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="订单特性">
                      <el-checkbox-group v-model="orderChar" >
                        <el-checkbox v-for="(item,index) in orderChars" :label="item" :key="index">{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item label="订单集团">
                      <el-checkbox-group v-model="bloc" >
                        <el-checkbox v-for="(item,index) in searchData.blocList" :label="item" :key="index">{{item}}</el-checkbox>
                      </el-checkbox-group>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item  class="carrier" label="承运商">
                      <el-checkbox-group @change="searchExpressList" v-model="carrier" >
                        <el-checkbox v-for="(item,index) in searchData.carrierList" :label="item" :key="index">{{item}}</el-checkbox>
                      </el-checkbox-group>
                      <span @click="toggle(1,'carrierTag')">{{carrierTag}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row>
                  <el-col :span="24">
                    <el-form-item class="expressType"  label="货运方式">
                      <el-checkbox-group    v-model="expressType" >
                        <el-checkbox v-for="(item,index) in searchData.expressTypeList" :label="item" :key="index">{{item}}</el-checkbox>
                      </el-checkbox-group>
                      <span v-if="openTag" @click="toggle(0,'expressTag')">{{expressTag}}</span>
                    </el-form-item>
                  </el-col>
                </el-row>

            </el-form>
        </div>
        <downUp  v-if="visible" :propData="sendData"  :centerDialogVisible.sync="visible"  >
            <strong>{{fileName}}</strong>
        </downUp>
    </div>
</template>
<script>
    import downUp from "@/components/commonTool/down_up_xlsx";
    import {sendLogin,finance_shopgroupList,queryCount,expressTypeList} from "@/http/api"
    export default {
        data() {
            return {
                openTag:true,
                carrierTag:"展开",
                expressTag:"展开",
                orderChar:[],
                bloc:[],
                carrier:[],
                expressType:[],
                departments:[],
                orderOrSku:["sku","order"],
                orderChars:["特性空白","单单订单","单多订单","多产品"],
                bills:['',"是","否"],
                timeTypes:["发货时间","订单时间"],
                formData:{  },
                searchData:{
                  expressTypeList:[],
                  carrierList:[],
                },
                expressTypeData:[],
                carrierData:[],
                openDailog:false,
                multipleSelection:[],
                sendData:{
                    href:"",
                    url:"",
                    sendtype:"",
                    title:'',
                    downPath:"",
                    type:"post",
                },
                visible:false,
                fileName:'',
            }
        },
        components:{
          downUp,
        },
        created() {
          this.getSearch()

        },
        mounted() {


        },
        methods: {
            toggle(arg,val){
              if(this[val] == "展开" ){
                this[val] = "隐藏";
                console.log("TCL: toggle -> this.expressTypeData", this.expressTypeData)

                if(arg){
                  this.searchData.carrierList     = this.carrierData
                }else{
                  this.searchData.expressTypeList = this.expressTypeData
                }
              }else{
                this[val] = "展开";
                if(arg){
                  this.searchData.carrierList     =  this.carrierData.slice(0,14)
                }else{
                  this.searchData.expressTypeList =  this.expressTypeData.slice(0,8);
                }
              }



            },
            async searchExpressList(data){
              this.openTag = false
              console.log("TCL: searchExpressList -> data", data)
              let obj = {}
              obj.carrier = ("\'" + data.join("'/'") + "\'").split("/") + ""
              try{
                let list = await expressTypeList(obj)
                if(list.length === 0){
                  this.openTag = true
                  this.searchData.expressTypeList = this.expressTypeData.slice(0,8);
                  this.expressTag = "展开";

                }else{
                  this.searchData.expressTypeList = list

                }
                console.log("TCL: searchExpressList -> list", list)

              }catch(error){

              }

            },
            async getSearch(){
              try{
                let searchList = await sendLogin()
                let shop = await finance_shopgroupList()
                this.searchData = searchList
                this.expressTypeData = searchList.expressTypeList
                this.carrierData = searchList.carrierList

                this.searchData.expressTypeList = searchList.expressTypeList.slice(0,8)
                this.searchData.carrierList = searchList.carrierList.slice(0,14)



                this.searchData.shopgroup = shop

              }catch(error){
                console.log("TCL: getSearch -> error", error)

              }
            },
            async search(){
              let newObj = Object.assign({},this.formData)
              console.log("TCL: search -> newObj", newObj)
              if(this.handleData(newObj)){
                  try{
                      let queryData = await queryCount(newObj)
                      console.log("TCL: search -> queryData", queryData)
                      this.$notify({
                        message: `根据下载条件，本次共${queryData}条数据可下载`,
                        type: 'success',
                      });

                  }catch(error){
                    console.log("TCL: search -> error", error)

                  }
              }
            },
            handleData(newObj){
                console.log("TCL: handleData -> newObj", newObj)
                if(!newObj.orderOrSku){
                  this.$message.error("请选择报表类型")
                  return false
                }

                if(!newObj.timeType){
                  this.$message.error("请选择时间类型")
                  return false
                }

                if(!newObj.times){
                  this.$message.error("请选择时间")
                  return false
                }

                if(newObj.timeType&&newObj.times){

                  if(newObj.timeType == "发货时间"){
                    newObj.expressTime_start = newObj.times[0]
                    newObj.expressTime_end = newObj.times[1]

                  }else if(newObj.timeType == "订单时间"){
                    newObj.orderTime_start =  newObj.times[0]
                    newObj.orderTime_end =  newObj.times[1]
                  }
                  delete newObj.timeType
                  delete newObj.times
                }


                newObj.platform&&newObj.platform.length>0 ? newObj.platform =  ("\'" + newObj.platform.join("'/'") + "\'").split("/") + "" : ""
                newObj.orderType&&newObj.orderType.length>0 ? newObj.orderType =  ("\'" + newObj.orderType.join("'/'") + "\'").split(" ") + "" : ""
                newObj.department&&newObj.department.length>0 ? newObj.department =  ("\'" + newObj.department.join("'/'") + "\'").split("/") + "" : ""
                newObj.shopgroup&&newObj.shopgroup.length>0 ? newObj.shopgroup =  ("\'" + newObj.shopgroup.join("'/'") + "\'").split("/") + "" : ""
                newObj.bill&&newObj.bill.length>0 ? newObj.bill == "是"?newObj.bill = "yes":newObj.bill == "否"? newObj.bill = "no" : "" : delete newObj.bill;

                this.expressType.length>0 ? newObj.expressType =  ("\'" + this.expressType.join("'/'") + "\'").split("/") + "" : ""
                this.carrier.length>0 ? newObj.carrier =  ("\'" + this.carrier.join("'/'") + "\'").split("/") + "" : ""
                this.bloc.length>0 ? newObj.bloc =  ("\'" + this.bloc.join("'/'") + "\'").split("/") + "" : ""
                this.orderChar.length>0 ?  newObj.orderChar =  ("\'" + this.orderChar.join("'/'") + "\'").split("/") + "" :  ""

                return true
            },

            uploadFun(val){
                this.sendData.downPath = ""
                this.sendData.url = "api/SendDownload/upd"
                this.sendData.type="post"
                if(val == 1){
                    this.sendData.sendtype = "sku"
                    this.sendData.title = "sku发货数据修正"
                }else{
                    this.sendData.sendtype = "order"
                    this.sendData.title = "订单发货数据修正"
                }
                this.visible=true
            },

            down(arg,url,name){
                let newObj = Object.assign({},this.formData)
                if(!arg){
                  newObj.wrongData = "yes"
                }

                if(this.handleData(newObj)){
                  console.log("TCL: down -> params", newObj)
                  this.$common.downloadExcl_get("api/SendDownload/selectByPrimaryKey",newObj,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
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
    .download
      >>>.el-checkbox-group
          border:1px solid #DCDFE6;
          padding:0 20px;
    .dataDown
      .department
        margin-bottom 0 !important
        height: calc(100vh - 100px)
    .openDailog
        padding 10px 0 30px 20px
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
    .apiForm
      >>>input[type='text']
        width 200px
      >>>.el-form-item
        margin-bottom:20px !important;
      >>>.apiSearch
        label
          opacity:0;
    .noData
      border:none !important
      &+p
        color:red
    .carrier,.expressType
        width calc(100% - 40px);
        >>>.el-form-item__content
            width calc(100% - 110px);
            >span
                color:#08ddad
                cursor pointer
    .expressType
      >>>.el-checkbox
        width: 204px;
        margin-right: 0;

</style>
