<template>
    <div>
        <div class="department">
            
            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="组别名称">
                    <el-input v-model.trim="formData.name"></el-input>
                </el-form-item>
                <el-form-item label="平台">
                    <el-input v-model.trim="formData.platname"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="onSubmit" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="openDailog">
            <el-button  size="small" @click="uploadFun(1)" >批量上传</el-button>
            <el-button  size="small" @click="uploadFun(2)" >批量修改</el-button>
            <el-button  size="small" @click="down" >下载</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="shopData.records" style="width: 100%;" highlight-current-row
                @current-change="CurrentChange" border @selection-change="handleSelectionChange">
                <el-table-column   type="selection"      width="50"> </el-table-column>

                <el-table-column width="174" prop="monthStart" label="开铺时间"></el-table-column>
                <el-table-column   label="店铺名称/">
                    <el-table-column width="175" label="店铺真实名称">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.name}}/<br/>
                                {{scope.row.realname}}
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="店铺组别/">
                    <el-table-column width="187"   label="店铺负责人">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.shopgroup}}/<br/>
                                {{scope.row.username}}
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column width="118" prop="department" label="部门"></el-table-column>
                <el-table-column width="60" prop="area" label="地区"></el-table-column>
                <el-table-column width="92" prop="platname" label="平台"></el-table-column>
                <el-table-column width="88" prop="bloc" label="集团"></el-table-column>
                <el-table-column width="80" label="平台费率">
                    <template slot-scope="scope">
                        <div>
                            {{scope.row.platformFee*100000/1000+"%"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column width="127" prop="firstTool" label="收款工具"></el-table-column>
                <el-table-column  label="收款账号/">
                    <el-table-column   width="230" label="收款账号备用">
                        <template slot-scope="scope">
                            <div>
                                {{scope.row.account}}/
                                {{scope.row.accountSecond}}
                            </div>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column  width="99" prop="firstSmallandbig" label="大/小收款额"></el-table-column>
                <el-table-column width="60"  prop="status" label="状态">
                    <template slot-scope="scope" >
                        <div>
                            {{scope.row.status == 1 ? "开启" : "关闭"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  width="168" prop="usertime" label="操作时间"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
            </el-table>
            <pageTool :pageData="shopData"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>
            
            <downUp  :propData="sendData" :centerDialogVisible.sync="visible"  >
                <strong>{{fileName}}</strong>
            </downUp>

        </div>
    
    </div>
</template>
<script>
    import {finance_shopAddOrUpd,finance_shopList,finance_shopSearch} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
    import downUp from "@/components/commonTool/down_up_xlsx";
    export default {
        data() {
            return {
                data:{},
                visible:false,
                formData:{},
                pageData:{
                    current:1,
                    size:10
                },
                sendData:{
                    href:"",
                    url:"",
                    sendtype:"",
                    title:'',
                    downPath:"",
                },
                shopData:{},
                add:false,
                rules:{},
                sendType:1,
                fileName:"财务店铺管理.xlsx",
                multipleSelection:[]
            }
        },
        components:{
            pageTool,
            downUp
        },
        created() {
            this.onSubmit();

        },
        mounted() {
        },
        methods: {
            // 上传函数
            uploadFun(val){
                this.sendData.url = "api/Shop/AddOrUpd"
                this.sendData.downPath = "api/Shop/model"
                this.sendData.type = "post"
                if(val == 1){
                    this.sendData.sendtype = 1
                    this.sendData.title = "批量上传"
                }else{
                    this.sendData.sendtype = 2
                    this.sendData.title = "批量修改"
                }
                this.visible=true
            },
            CurrentChange(val){
                this.currentRow = val;
            },
            handleSelectionChange(val){
                this.multipleSelection=[]
                val.map((v)=>{
                    this.multipleSelection.push( `'${v.shopid}'`)
                })
				console.log("TCL: handleSelectionChange -> this.multipleSelection", val,this.multipleSelection)
                
            },
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                this.onSubmit()
            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                this.onSubmit()
            },
            async onSubmit(){
                let arg = Object.assign({},this.formData,this.pageData)
                try{
                    let data = await finance_shopSearch(arg);
                    console.log(data,'shopgroupInfo')
                    
                    this.shopData = {}
                    this.shopData = data
                }catch(err){
                    console.log(err)
                }
            },
            down(){
                let str = this.multipleSelection+''
                let params = Object.assign({},this.formData,{shopid:str})
                this.$common.downloadExcl_get("api/Shop/export",params,"下载",this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            
            getTime(date){ //获取时间格式
                console.log(date,'time')
                if(date){
                return date[0]+'*'+date[1]
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
</style>