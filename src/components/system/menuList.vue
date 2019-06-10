<template>
    <div>
        <div class="department">
            
            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model.trim="formData.purusername"></el-input>
                </el-form-item>
                <el-form-item label="部门">
                    <el-input v-model.trim="formData.purusername"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="onSubmit" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">

        <div class="openDailog">
            <el-button  size="small" @click="add=true" >新增</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table stripe :data="menuData" style="width: 100%;" highlight-current-row :row-key="getRowKeys"
                @current-change="CurrentChange" border @selection-change="handleSelectionChange">
                <el-table-column  prop="name" label="菜单名称"></el-table-column>
                <el-table-column  prop="url" label="资源路径"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope" >
                        <div >
                            {{scope.row.alwaysShow == 1 ? "开启" : "关闭"}}
                        </div>
                    </template>
                </el-table-column>
                <el-table-column  prop="purchasework" label="操作">
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
        <el-form-item label="用户名">
            <el-input  v-model.trim="sendData.username" ></el-input>
        </el-form-item>
      
        <el-form-item label="岗位"  prop="" >
            <el-input v-model.trim="sendData.sendData" ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="" >
            <el-radio v-model="sendData.status" label="1">启用</el-radio>
            <el-radio v-model="sendData.status" label="2">停用</el-radio>
        </el-form-item>
    
        </el-form>


    <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateData()">确 定</el-button>
        <el-button @click="add = false">取 消</el-button>
    </span>
    </el-dialog>
        </div>
    </div>
</template>
<script>
    import {finance_menuList} from "@/http/api"
    export default {
        data() {
            return {
                data:{},
                formData:{},
                pageData:{
                page:1,
                limit:10
                },
                menuData:[],
                sendData:{},
                add:false,
                rules:{},
                department:{},
            }
        },
        created() {
            this.menuList();

        },
        mounted() {
        },
        methods: {
            getRowKeys(row){
                return row.id
            },
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
            async menuList(){
                try{
                    let data = await finance_menuList()
                    console.log(data,'menuList')
                    if(data.success){
                        this.menuData = data.result
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