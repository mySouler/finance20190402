<template>
    <div>
        <div class="department">
            
            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                
                <el-form-item label="部门名称">
                    <el-input v-model.trim="formData.keyWord"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="queryDepartment" size="small">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
            <div class="openDailog">
                <el-button  size="small" @click="add=true" >新增</el-button>
            </div>
        </div>
        
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="departmentData" style="width: 100%;" highlight-current-row
                @current-change="CurrentChange" border @selection-change="handleSelectionChange">
                <el-table-column prop="departName" label="部门名称"></el-table-column>
                <el-table-column prop="hintskunum" label="添加人"></el-table-column>
                <el-table-column prop="purchasenum" label="添加时间"></el-table-column>
                <el-table-column prop="purchasework" label="操作">
                    <template >
                        <div>
                            <span class="link" @click.stop="edit"><img src="../../assets/edit.png" ></span>&nbsp;&nbsp;
                            <span class="link" @click.stop="power"><img src="../../assets/power.png" ></span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog
        title="新增"
        :visible.sync="add"
        width="20%"
        center>
            <el-form :inline="true" :model="sendData" :rules="rules" ref="ruleForm" class="demo-form-inline text-left" label-width="110px">
            <el-form-item label="部门名称">
                <el-input  v-model.trim="sendData.departName" ></el-input>
            </el-form-item>
            </el-form>


            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addDepartment()">确 定</el-button>
                <el-button @click="add = false">取 消</el-button>
            </span>
        </el-dialog>
    
    </div>
</template>
<script>
    import {finance_treeList,finance_departmentAdd,finance_searchDepartment} from "@/http/api"
    export default {
        data() {
            return {
                data:{},
                formData:{},
                pageData:{
                page:1,
                limit:10
                },
                departmentData:[],
                sendData:{},
                add:false,
                rules:{},
                department:{},
            }
        },
        created() {
            this.departInfo();

        },
        mounted() {
        },
        methods: {
            CurrentChange(val){
                this.currentRow = val;
            },
            handleCurrentChange(){

            },
            edit(){
                console.log('edit')
            },
            power(){
                console.log('power')

            },
            handleSizeChange(){

            },
            async departInfo(){
                try{
                    let  data = await finance_treeList()
                    console.log(data,'departInfo')

                    if(data.success){
                        this.departmentData = data.result[0].children
                    }
                    
                }catch(err){
                    console.log(err);
                }
                
            },
            async addDepartment(){
                let parame = this.sendData
                if( !this.sendData.sysDepart ){
                    return this.$message.error("请输入部门名称")
                }
                try{
                    
                    let data = await finance_departmentAdd(parame)
                    console.log(data,'add---')
                    if(data.success){
                        this.$message.success(data.message)
                        this.departInfo()
                    }else{
                        this.$message.error(data.message)

                    }
                }catch(err){
                    console.log(err)
                }
            },
            async queryDepartment(){
                if( !this.formData.keyWord ){
                    return this.$message.error("请输入部门名称")
                }
                try{
                    let data = await finance_searchDepartment(this.formData)
                    console.log(data,'search')
                    if(data.success){
                        this.departmentData = data.result
                    }else{
                        this.$message.error(data.message)

                    }
                }catch(err){
                    console.log(err)
                }
            },
            handleSelectionChange(){
                
            },
            getTime(date){ //获取时间格式
                console.log(date,'time')
                if(date){
                return date[0]+'*'+date[1]
                }
            },
            onSubmit(){

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
    .rightPanel
        float right
</style>