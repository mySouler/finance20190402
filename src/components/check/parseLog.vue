<template>
    <div>
        <div class="department">

            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="币种">
                    <el-input v-model.trim="formData.currency"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="rateLog" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">

        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="logData.records"  style="width: 100%;" highlight-current-row
                @current-change="CurrentChange" border @selection-change="handleSelectionChange">
                <el-table-column prop="userName" label="操作人">

                </el-table-column>
                <el-table-column prop="currency" label="币种"></el-table-column>
                <el-table-column prop="userTime" label="操作时间">

                </el-table-column>
                <el-table-column   prop="logDetail" label="备注">
                </el-table-column>
            </el-table>
            <pageTool :pageData="logData"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

        </div>

        </div>
    </div>
</template>
<script>
    import {shipmentBillLog} from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";

    export default {
        data() {
            return {
                data:{},
                formData:{},
                pageData:{
                    current:1,
                    size:10
                },
                logData:{},
            }
        },
        components:{
            pageTool,
        },
        created() {

            let arg = ''
            let nowTab = this.$store.state.menuNav.editableTabsValue2
            this.$store.state.menuNav.editableTabs2.map(item=>{
                if( (item&&item.path) == nowTab){
                    arg = item.args
                    console.log("TCL: created -> arg",item, arg)
                }

            })
            let param = {}
            param.currency = arg+''

            this.rateLog(param);

        },
        mounted() {
        },

        methods: {
            getPage(val){
                console.log(val,'getPage');
                this.pageData.current = val
                // this.getCatalogueList()
                this.rateLog()

            },
            getSize(val){
                console.log(val,'getSize');
                this.pageData.size = val
                // this.getCatalogueList()
                this.rateLog()
            },
            CurrentChange(val){
                this.currentRow = val;
            },
            handleCurrentChange(){

            },
            async rateLog(val){
                let arg = Object.assign({},{groupId:"12"})


                try{
                    let data = await shipmentBillLog(arg);
                    console.log("data ====  sss",data)
                    if(data.success){
                        this.logData = data.result

                    }else{

                    }
                }catch(err){
                    console.log(err)
                }
            },
            handleSelectionChange(){

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
