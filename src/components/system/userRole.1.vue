<template>
    <div>
        <div class="department">
            <el-form :inline="true" :model="formData" class="rightPanel demo-form-inline text-left" label-width="100px">
                <el-form-item label="岗位">
                    <el-input v-model.trim="formData.roleName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button class="search" @click="roleInfo" size="medium">查询</el-button>
                    <el-button @click="resetForm" size="small" type="text" class="btn_text">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="contentWrap">
            <div class="item orderTable  bgc_white mt_20">
                <el-table stripe :data="roleData.records" style="width: 100%;" highlight-current-row @current-change="CurrentChange" border @selection-change="handleSelectionChange">
                    <el-table-column prop="roleName" label="岗位"></el-table-column>
                    <el-table-column prop="createBy" label="板块权限">
                        <template slot-scope="scope">
                            <div>

                                <span class="link" @click.stop="rolePower(scope.row)"><img src="../../assets/power.png" ></span>
                            </div>
                        </template>
                </el-table-column>

            </el-table>
            <pageTool :pageData="roleData"  @sizeChange="getSize" @pageChange="getPage" ></pageTool>

        </div>
        <downUp v-if="visible" :propData="sendData" :centerDialogVisible.sync="visible"  >
            <strong>{{fileName}}</strong>
        </downUp>
        <div class="myDialog staff">
            <el-dialog
            title="菜单权限"
            :visible.sync="openPower"
            width="20%"

            center>
            <div v-loading="load"  >
                <el-tree
                    :data="powerList"
                    show-checkbox
                    :expand-on-click-node="true"
                    :check-on-click-node="true"
                    :default-expanded-keys="defaultChoose"
                    :default-checked-keys="allKey"
                    node-key="id"
                    ref="tree"
                    @check-change="handleCheckChange"
                    :highlight-current="true"
                    :props="defaultProps">
                </el-tree>
            </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="updateData" >确定</el-button>
                    <el-button  @click="openPower=false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
    </div>
</template>
<script>
    import {
        finance_userRole,
        finance_roleList,
        finance_rolePermission,
        finance_updateRolePermissionn
    } from "@/http/api"
    import pageTool from "@/components/commonTool/pageTool";
    import downUp from "@/components/commonTool/down_up_xlsx";
    export default {
        data() {
            return {
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                defaultChoose: [],
                allKey: [],
                openPower: false,
                powerList: [],
                data: {},
                formData: {},
                pageData: {
                    pages: 1,
                    size: 10
                },
                roleData: {},
                sendData: {},
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
                fileName: "分类平台费.xls",
                multipleSelection: [],
                load:true,
                allCheckData:{},
            }
        },
        created() {
            this.roleInfo();
        },
        mounted() {},
        components: {
            pageTool,
            downUp
        },
        methods: {
            CurrentChange(val) {
                this.currentRow = val;
            },
            getPage(val) {
                console.log(val, 'getPage');
                this.pageData.current = val
            },
            getSize(val) {
                console.log(val, 'getSize');
                this.pageData.size = val
            },
            handleSelectionChange(val) {
                this.multipleSelection = []
                val.map((v) => {
                    this.multipleSelection.push(`'${v.serial}'`)
                })
                console.log("TCL: handleSelectionChange -> this.multipleSelection", this.multipleSelection)
            },
            async roleInfo() {
                let params = Object.assign({}, this.formData, this.pageData)
                try {
                    let data = await finance_roleList(params);
                    if (data.success) {
                        this.roleData = data.result
                        console.log(data, 'roleInfo')
                    }
                } catch (err) {
                    console.log(err)
                }
            },
            async rolePower(data) {
                this.allCheckData={}
                this.powerList = []
                this.defaultChoose = []
                let params = {}
                params.roleId = data.id
                this.openPower = true
                try {
                    let result = await finance_rolePermission(params)
                    console.log("TCL: rolePower -> data", data)
                    this.powerList = result.result
                    if( result.success){
                    this.load = false
                    if (this.powerList.length > 0) {
                        this.defaultChoose.push(this.powerList[0].id)
                        this.powerList.map(item=>{
                            this.allKey.push(item.id)
                                console.log("TCL: power -> item.children", item.children.length)
                            if(item.children&&item.children.length>0){
                                item.children.map(item=>{
                                    this.allKey.push(item.id)
                                    if(item.children.children&&item.children.children.length>0){
                                        item.children.children.map(item=>{
                                            this.allKey.push(item.id)
                                        })
                                    }
                                })
                            }
                        })
                    }
                    }else{
                      setTimeout(()=>{
                          this.load = false
                      },1500)
                    }
                    console.log('power', result.result)
                } catch (err) {
                    console.log("TCL: rolePower -> err", err)
                }
            },
            async updateData(){
                let chooseData = this.$refs.tree.getCheckedKeys()



                try{
                    let params = {}
                        params.userId = this.roleInfo.id
                        params.permissionIds = chooseData+''
                        console.log("TCL: updateData -> params", params)

                    let data = await finance_updateUserPermission(params)
                    if(data.success){
                        this.$message.success(data.message)

                        setTimeout(()=>{
                            this.openPower = false
                        },500)
                    }else{
                        this.$message.error(data.message)

                    }
                    setTimeout(()=>{
                        this.openPower = false
                    },2000)
                    console.log("TCL: updateData -> data", data)

                }catch(error){
                    console.log("TCL: updateData -> error", error)

                }

                // openPower

            },
            handleCheckChange(data, checked, indeterminate) {
                console.log(data, checked, indeterminate, 'chooooooooooooooo');
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
        watch: {
          'openPower':function(value){
              if(!value){
                this.load = true
              }
          }
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
