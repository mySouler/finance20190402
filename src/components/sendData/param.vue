<template>
    <div>
        <div class="department">


        </div>
        <div class="contentWrap">


        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="BillList"  style="width: 100%;" highlight-current-row
                border>
                <!-- <el-table-column   type="selection"      width="50"> </el-table-column> -->
                <el-table-column prop="username" label="操作人"></el-table-column>

                <el-table-column prop="usertime" label="操作时间"></el-table-column>
                <el-table-column prop="bill" label="修正运费参数"></el-table-column>
                <el-table-column prop="usertime" label="操作">
                  <template  slot-scope="scope">
                        <div>
                            <span class="link" @click.stop="edit(scope.row)">编辑</span>&nbsp;&nbsp;
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- <pageTool :pageData="BillList"  @sizeChange="getSize" @pageChange="getPage" ></pageTool> -->
        </div>

        <div class="myDialog editFrom" >
          <el-dialog title="编辑" :visible.sync="openEdit"   width="24%" center>

              <el-form :inline="true" :model="editFrom" class="rightPanel demo-form-inline text-left" label-width="100px">

                <el-form-item label="修正运费参数">
                    <el-input  v-model.number="editFrom.bill"></el-input>
                </el-form-item>
            </el-form>
              <span slot="footer" class="dialog-footer">
                  <el-button  @click="openEdit=false">取 消</el-button>
                  <el-button @click="editData" >确定</el-button>

              </span>
          </el-dialog>
        </div>

        </div>
    </div>
</template>
<script>
    import {getKisBill,updBill} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
    export default {
        data() {
            return {
                pageData:{
                    current:1,
                    size:10
                },
                BillList:[],
                editFrom:{},
                multipleSelection:[],
                openEdit:false,
            }
        },
        components:{
            pageTool,
        },
        created() {

            this.getBillList()

        },
        mounted() {
        },

        methods: {

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

            edit(data){
              this.openEdit = true
              this.editFrom = {}

            },
            async editData(){
              let editFrom = this.editFrom
              if(!editFrom.bill){
                return this.$message.error("修正运费参数不能为空")
              }
              try{
                let result = await updBill(editFrom)
                console.log("TCL: addData -> result", result)
                this.$message.success(result);
                this.getBillList();
                this.openEdit = false;
              }catch(error){
              console.log("TCL: addData -> error", error)

              }
            },

            async getBillList(){

                let arg = Object.assign({},this.pageData)
                try{
                    let data = await getKisBill(arg);


                    this.BillList = data

                    console.log("data ====",data)

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
    .editFrom
      >>>.el-form-item
        width:100%
      >>>.el-form-item__content
        width:65%
      p
        text-align center
        color red
</style>
