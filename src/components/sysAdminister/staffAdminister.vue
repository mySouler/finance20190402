<template>
    <div>
        <div class="OrderNumber">
            
            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="用户名">
                    <el-input v-model.trim="formData.purusername"></el-input>
                </el-form-item>
                <el-form-item label="部门">
                    <el-date-picker value-format="yyyy-MM-dd" v-model="formData.createtime" type="daterange" @change="getTime" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" size="small">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="openDailog">
            <el-button type="primary" size="small" @click="add=true" >新增</el-button>
        </div>
        <div class="item orderTable  bgc_white mt_20">
            <el-table :data="listArray.rows" style="width: 100%;" border @selection-change="handleSelectionChange">
                <el-table-column prop="purusername" label="采购员"></el-table-column>
                <el-table-column prop="hintskunum" label="部门"></el-table-column>
                <el-table-column prop="purchasenum" label="岗位"></el-table-column>
                <el-table-column prop="notskunum" label="状态"></el-table-column>
                <el-table-column prop="purchasework" label="操作"></el-table-column>
            </el-table>
            <div v-if="listArray&&listArray.rows&&listArray.rows.length>0" class="pagination">
                <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listArray.pageOn" :page-sizes="[10,20,50,100]" :page-size="listArray.limit" :total="listArray.total" layout="total, sizes, prev, pager, next, jumper">
                </el-pagination>
            </div>
        </div>

        <el-dialog
      title="新增"
      :visible.sync="add"
      width="20%"
      center>
        <el-form :inline="true" :model="sendData" :rules="rules" ref="ruleForm" class="demo-form-inline text-left" label-width="110px">
        <el-form-item label="用户名">
          <el-input :disabled="true"  v-model.trim="sendData" ></el-input>
        </el-form-item>
         <el-form-item label="部门"  prop="" >
          <el-select v-model="departmentVal" placeholder="请选择">
            <el-option
            v-for="item in department"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>
        </el-form-item>
         <el-form-item label="岗位"  prop="" >
          <el-input v-model.trim="sendData" ></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="" >
            <el-radio v-model="status" label="1">启用</el-radio>
            <el-radio v-model="status" label="2">停用</el-radio>
        </el-form-item>
       
      </el-form>


      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateData()">确 定</el-button>
        <el-button @click="add = false">取 消</el-button>

      </span>
    </el-dialog>
    
    </div>
</template>
<script>
    import {finance_saffList,finance_queryTreeList} from "@/http/api"

    // "avatar": "string",
    //     "birthday": "2019-04-19T09:16:54.378Z",
    //     "createBy": "string",
    //     "createTime": "2019-04-19T09:16:54.378Z",
    //     "delFlag": "string",
    //     "email": "string",
    //     "id": "string",
    //     "password": "string",
    //     "phone": "string",
    //     "realname": "string",
    //     "salt": "string",
    //     "sex": 0,
    //     "status": 0,
    //     "updateBy": "string",
    //     "updateTime": "2019-04-19T09:16:54.378Z",
    //     "username": "string"
    export default {
        data() {
            return {
                data:{},
                formData:{},
                pageData:{
                page:1,
                limit:10
                },
                listArray:{
                    rows:[],
                },
                status:false,
                currentPage3:'1',
                add:false,
                department: [{
                    value: '选项1',
                    label: '黄金糕'
                    }, {
                    value: '选项2',
                    label: '双皮奶'
                    }, {
                    value: '选项3',
                    label: '蚵仔煎'
                    }, {
                    value: '选项4',
                    label: '龙须面'
                    }, {
                    value: '选项5',
                    label: '北京烤鸭'
                }],
                departmentVal:'',
                sendData:{},
                rules:{},
              
            }
        },
        created() {
        },
        mounted() {
            this.saffInit();
        },
        methods: {
            saffInit(){
                finance_saffList().then((data)=>{
                    console.log(data,'data')

                })
                finance_queryTreeList().then((data)=>{
                    console.log(data,'部门列表')

                })
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
<style lang="stylus">
    
</style>