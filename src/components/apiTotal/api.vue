<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="apiForm text-left" label-width="100px">
                <el-form-item label="平台数据">
                    <el-select
                      v-model="formData.platform"
                      filterable
                      placeholder="请选择平台数据">
                      <el-option
                        v-for="item in searchData.platformmentList"
                        :key="item"
                        :label="item"
                        :value="item">
                      </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="发货时间">
                    <el-date-picker v-model="formData.expressTime"  value-format="yyyy-MM-dd HH:mm:ss" type="daterange"></el-date-picker>
                </el-form-item>
                <el-form-item label="退款时间">
                    <el-date-picker v-model="formData.refundTime"  value-format="yyyy-MM-dd HH:mm:ss" type="daterange"></el-date-picker>
                </el-form-item>
                <el-form-item label="订单时间">
                    <el-date-picker v-model="formData.orderTime"  value-format="yyyy-MM-dd HH:mm:ss" type="daterange"></el-date-picker>
                </el-form-item>
                <el-form-item label="开发员">
                      <el-select
                        v-model="formData.developuserrealname"
                        filterable
                        placeholder="请选择开发员">
                        <el-option
                          v-for="item in searchData.developuserrealnameList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="开发员姓名">
                      <el-select
                        v-model="formData.developusername"
                        filterable
                        placeholder="请选择开发员姓名">
                        <el-option
                          v-for="item in searchData.developusernameList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="商品编号">
                    <el-input v-model.trim="formData.sku"></el-input>
                </el-form-item>
                <el-form-item label="运货方式">
                      <el-select
                        v-model="formData.expressType"
                        filterable
                        placeholder="请选择运货方式">
                        <el-option
                          v-for="item in searchData.expressTypeList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                 <el-form-item label="退款类型">
                      <el-select
                        v-model="formData.refundType"
                        filterable
                        placeholder="请选择退款类型">
                        <el-option
                          v-for="item in refundType"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="退款原因">
                    <el-input v-model.trim="formData.reason"></el-input>
                </el-form-item>
                <el-form-item label="店铺">
                      <el-select
                        v-model="formData.shopname"
                        filterable
                        placeholder="请选择店铺">
                        <el-option
                          v-for="item in searchData.shopList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="国家">
                    <el-input v-model.trim="formData.custCountryCn"></el-input>
                </el-form-item>

                <el-form-item label="部门">
                      <el-select
                        v-model="formData.department"
                        filterable
                        placeholder="请选择部门">
                        <el-option
                          v-for="item in searchData.departmentList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="组别">
                      <el-select
                        v-model="formData.shopgroup"
                        filterable
                        placeholder="请选择组别">
                        <el-option
                          v-for="item in searchData.shopgroupList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item label="采购员">
                      <el-select
                        v-model="formData.purusername"
                        filterable
                        placeholder="请选择采购员">
                        <el-option
                          v-for="item in searchData.purusernameList"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                  <el-form-item label="交易单号">
                    <el-input v-model.trim="formData.orderId"></el-input>
                </el-form-item>
                  <el-form-item label="订单号">
                    <el-input v-model.trim="formData.orderid"></el-input>
                </el-form-item>
                <el-form-item label="退款数据类型">
                      <el-select
                        v-model="formData.datatype"
                        filterable
                        placeholder="请选择退款数据类型">
                        <el-option
                          v-for="item in datatype"
                          :key="item"
                          :label="item"
                          :value="item">
                        </el-option>
                      </el-select>
                </el-form-item>
                <el-form-item class="apiSearch" label="搜索">
                    <el-button class="search" @click="getApiDataList()" size="medium">搜索</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">


        <div class="openDailog">
            <el-button  size="small" @click="down(0)" >下载</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="apiDataList.records"  style="width: 100%;" highlight-current-row
                border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>
                <el-table-column prop="orderId" label="交易单号">
                  <el-table-column prop="orderid" label="订单单号">
                      <template slot-scope="scope">
                          <div>
                              {{scope.row.orderId}}/<br/>
                              {{scope.row.orderid}}<br/>
                          </div>
                      </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="developuserrealname" width="100" label="开发员">
                  <el-table-column prop="developusername" label="开发员姓名">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.developuserrealname}}/<br/>
                            {{scope.row.developusername}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="sku" label="商品编号">
                  <el-table-column prop="expressType" label="货运方式">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.sku}}/<br/>
                            {{scope.row.expressType}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                  <el-table-column prop="refundType" label="退款类型">
                  <el-table-column prop="exchangeRate" label="汇率">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.refundType}}/<br/>
                            {{scope.row.exchangeRate}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>

                  <el-table-column prop="refundmoney" label="退款金额">
                  <el-table-column prop="rmb" label="退款金额（人民币）">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.refundmoney}}/<br/>
                            {{scope.row.rmb}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="orderTotal" label="订单原始金额">
                  <el-table-column prop="currency" label="币种">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.orderTotal}}/<br/>
                            {{scope.row.currency}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="status" label="订单状态">
                  <el-table-column prop="reason" label="退款原因">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.status}}/<br/>
                            {{scope.row.reason}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="purusername" label="采购员">
                  <el-table-column prop="shopname" label="店铺">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.purusername}}/<br/>
                            {{scope.row.shopname}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                  <el-table-column prop="custCountryCn" label="国家">
                  <el-table-column prop="orderTime" label="订单时间">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.custCountryCn}}/<br/>
                            {{scope.row.orderTime}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                  <el-table-column prop="costprice" label="成本价">
                  <el-table-column prop="refundTime" label="退款创建时间">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.costprice}}/<br/>
                            {{scope.row.refundTime}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="platform" label="平台">
                  <el-table-column prop="packageName" label="包材">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.platform}}/<br/>
                            {{scope.row.packageName}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="department" label="部门">
                  <el-table-column prop="shopgroup" label="组别">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.department}}/<br/>
                            {{scope.row.shopgroup}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>
                <el-table-column prop="username" label="店铺负责人">
                  <el-table-column prop="expressTime" label="发货时间">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.username}}/<br/>
                            {{scope.row.expressTime}}<br/>
                        </div>
                    </template>
                  </el-table-column>
                </el-table-column>


            </el-table>
            <pageTool :pageData="apiDataList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

        </div>
        </div>
         <div class="myDialog jurisBox" >
          <el-dialog title="请选择下载维度" :visible.sync="openDailog" @close="closeDia"   width="27%" center>
              <div>
                <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                <div style="margin: 15px 0;"></div>
                <el-checkbox-group v-model="checkedItems" @change="handleIemChange">
                  <el-checkbox v-for="item in optionDatas" :label="item" :key="item">{{item}}</el-checkbox>
                </el-checkbox-group>
              </div>
              <span slot="footer" class="dialog-footer">
                  <el-button  @click="openDailog=false">取 消</el-button>
                  <el-button @click="down(1)" >确定</el-button>
              </span>
          </el-dialog>
        </div>
    </div>
</template>
<script>
    import {apiDataLists,getSearchs,finance_shopgroupList,finance_shopList} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
    export default {
        data() {
            return {
                formData:{},
                datatype:["全部","正常","作废"],
                refundType:["全额退","部分退"],
                pageData:{
                    current:1,
                    size:10
                },
                searchData:{},
                apiDataList:{},
                rules:{},
                department:{},
                myTitle:"新增",
                openDailog:false,
                myData:{},
                departments:[],
                platformLists:[],
                userList:[],
                disName:false,
                checkAll: false,
                optionDatas: [
                  "交易单号",
                  "订单单号",
                  "开发员",
                  "开发员姓名",
                  "商品编号",
                  "货运方式",
                  "退款类型",
                  "汇率",
                  "退款金额",
                  "退款金额(人民币)",
                  "订单原始金额",
                  "币种",
                  "订单状态",
                  "退款原因",
                  "采购员",
                  "店铺",
                  "国家",
                  "订单时间",
                  "成本价",
                  "退款创建时间",
                  "平台",
                  "包材",
                  "部门",
                  "组别",
                  "店铺负责人",
                  "发货时间"
                ],
                checkedItems_en: [
                  "交易单号_OrderId",
                  "订单单号_Orderid",
                  "开发员_Developuserrealname",
                  "开发员姓名_Developusername",
                  "商品编号_Sku",
                  "货运方式_ExpressType",
                  "退款类型_RefundType",
                  "汇率_ExchangeRate",
                  "退款金额_Refundmoney",
                  "退款金额(人民币)_Rmb",
                  "订单原始金额_OrderTotal",
                  "币种_Currency",
                  "订单状态_Status",
                  "退款原因_Reason",
                  "采购员_Purusername",
                  "店铺_Shopname",
                  "国家_CustCountryCn",
                  "订单时间_OrderTime",
                  "成本价_Costprice",
                  "退款创建时间_RefundTime",
                  "平台_Platform",
                  "包材_PackageName",
                  "部门_Department",
                  "组别_Shopgroup",
                  "店铺负责人_Username",
                  "发货时间_ExpressTime"
                ],
                checkedItems: [],
                isIndeterminate: true,
                multipleSelection:[]
            }
        },
        components:{
            pageTool,
        },
        created() {

            this.searchList()
        },
        mounted() {



        },
        methods: {
            handleCheckAllChange(val) {
              this.checkedItems = val ? this.optionDatas : [];
              this.isIndeterminate = false;
            },
            handleIemChange(value) {
              let checkedCount = value.length;
              this.checkAll = checkedCount === this.optionDatas.length;
              this.isIndeterminate = checkedCount > 0 && checkedCount < this.optionDatas.length;
            },
            handleSelectionChange(val){
                this.multipleSelection=[]
                this.multipleSelection = val.map((v)=>
                    v.serial
                )
                console.log("TCL: handleSelectionChange -> this.multipleSelection", val)

            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                // this.getconfigList()

            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                // this.getconfigList()
            },
            closeDia(){
              this.checkedItems = []
              this.checkAll = false
            },
            async searchList(){
              try{
                let data = await getSearchs()
                let shopgroupList = await finance_shopgroupList()
                let shopList = await finance_shopList()
                this.searchData = data
                this.searchData.shopgroupList = shopgroupList
                this.searchData.shopList = shopList
              }catch(error){
                console.log("TCL: searchList -> error", error)
              }
            },
            down(arg){
                if(arg){
                  let newObj = Object.assign({},this.formData)
                  if(!this.handleData(newObj)){
                    return
                  }
                  let obj = {}
                  if(this.multipleSelection.length>0){
                    let str = this.multipleSelection+''
                    obj.serial = str
                  }

                  if(this.checkedItems.length>0){

                    let title_en = []
                    this.checkedItems.forEach(item=>{
                        this.checkedItems_en.forEach(key=>{
                          if(key.indexOf(item) != -1){
                            title_en.push( key.split("_")[1])
                          }
                        }
                        )
                    })
                    obj.title_cn = this.checkedItems + ''
                    obj.title_en = title_en + ''
                    console.log("TCL: down -> title_en", title_en)
                  }
                  let params =  Object.assign({},obj,newObj)

                  console.log("TCL: down -> params", params)
                  this.$common.downloadExcl_get("api/Api/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
                  this.openDailog = false

                }else{
                  this.openDailog = true
                }
            },
            async getApiDataList(){
                let newObj = Object.assign({},this.formData)
                if(!this.handleData(newObj)){
                  return
                }

                console.log("TCL: getApiDataList -> newObj.expressTime", newObj)
                let params = Object.assign({},this.pageData,newObj)
                try{
                    let data = await apiDataLists(params);
                    console.log("data ====",data)
                    this.apiDataList = data
                }catch(err){
                    console.log(err)
                }
            },
            handleData(newObj){
                if(!newObj.platform){
                  this.$message.error("请选择平台数据")
                  return false
                }
                /*!newObj.expressTime||newObj.expressTime.length===0
                  && !newObj.refundTime||newObj.refundTime.length===0
                  && !newObj.orderTime||newObj.orderTime.length===0*/
                if(!newObj.expressTime && !newObj.refundTime&& !newObj.orderTime){
                  this.$message.error("请选择发货时间,退款时间,订单时间中的一个")
                  return false
                }

                if(newObj.expressTime&&newObj.expressTime.length>0){
                  newObj.expressTime_start = newObj.expressTime[0];
                  newObj.expressTime_end = newObj.expressTime[1];
                  delete newObj.expressTime;
                }
                if(newObj.refundTime&&newObj.refundTime.length>0){
                  newObj.refundTime_start = newObj.refundTime[0];
                  newObj.refundTime_end = newObj.refundTime[1];
                  delete newObj.refundTime;
                }
                if(newObj.orderTime&&newObj.orderTime.length>0){
                  newObj.orderTime_start = newObj.orderTime[0];
                  newObj.orderTime_end = newObj.orderTime[1];
                  delete newObj.orderTime;
                }
                return true
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
        >>>.el-checkbox
          margin-top:15px;
          min-width:130px;
          margin-right:50px
          &:nth-of-type(3n){
            margin-right:0
          }
    .apiForm
      >>>input[type='text']
        width 200px
      >>>.el-form-item
        margin-bottom:20px !important;
      .apiSearch
        >>>label
          opacity:0
</style>
