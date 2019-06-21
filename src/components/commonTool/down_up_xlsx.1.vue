<template>
    <div class="down_up">
        <el-dialog :title="title"
            :visible.sync="switchStatus"
            @close="$emit('update:centerDialogVisible', false)"
            width="450px" center>
            <p v-if="downPath">
                <a href="javascript:;" @click="downLoad" >下载模板<slot></slot></a>
            </p>
            <div>
                <el-upload class="upload"
                ref="upload"
                :action="url"
                :auto-upload="autoUpload"
                :on-success="uploadSuccess"
                :on-error="uploadError"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :on-exceed="handleExceed"
                :http-request="uploadFun"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                :file-list="fileList">
                    <input type="text">
                    <el-button size="small" type="primary">选择文件</el-button>
                </el-upload>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button  @click="submitUpload">上传</el-button>
                <el-button  @click="switchStatus=false">取 消</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
    export default {
        data() {
            return {
                fileList:[],
                autoUpload:false,
                switchStatus:this.centerDialogVisible,
                sendtype:this.propData.sendtype,
                url:this.propData.url,
                title:this.propData.title,
                downPath:this.propData.downPath,
                downName:this.propData.downName || "下载",
                type:this.propData.type||"post",
            }
        },
        props: {
            propData:{
                default:function(){
                    return {
                        url:"",//上传路径
                        sendtype:"",// flag :1.新增 2.修改
                        title:'', //标题
                        downPath:'',
                        type:"post",
                    }
                }
            },

            centerDialogVisible:{
                type:Boolean,
                default:false
            },
        },
        mounted(){
          console.log('=========== propData=========================');
          console.log(this.propData);
          console.log('============ propData========================');
        },
        watch:{
            centerDialogVisible (val) {
                this.switchStatus = val
            },
            propData: {
                handler: function (val, oldVal) {
                    console.log(val,'valvalvalval');
                    this.sendtype = val.sendtype,
                    this.url = val.url,
                    this.title = val.title
                    this.type = val.type
                    this.downPath = val.downPath
                    this.downName = val.downName || "下载"
                },
                deep: true
            },
        },
        methods: {
            downLoad:function(){

                this.$common.downloadExcl_get(this.downPath,{},this.downName,this.$loading({text:"正在下载",spinner:"el-icon-loading",background:"rgba(0, 0, 0, 0.8)"}))
            },
            uploadFun:function(content){
                let that = this

                let token = sessionStorage.getItem('token')

                let param = new FormData()  // 创建form对象
                param.append('file', content.file)
                if(this.sendtype){
                    param.append('flag', this.sendtype)
                }
                let config = {
                    headers: {'Content-Type': 'multipart/form-data'}
                }

                this.$http[this.type](this.url,param, config).then((res) => {
                    console.log(res,'resresresres');
                    if (res.code == 200) {
                        this.$message.success(res.message)

                    } else {
                        this.$message.error(res.message)
                    }
                    that.$emit("successInfo",res.message)
                    setTimeout(()=>{
                        this.switchStatus = false
                    },1000)
                }).catch(err => {
                    console.log(err,'uploadFun');

                })
                return false
            },
            submitUpload: function() {
                this.$refs.upload.submit();


                this.fileList = [];
            },
            uploadSuccess(response, file, fileList) {
                // if (response.code === 200) {
                //     if (response.obj.length <= 0) {
                //         this.$message.success(response.message)
                //     } else {
                //         this.$message.error(response.message)
                //     }
                // } else {
                //     this.$message.error(response.message)
                // }
            },
            uploadError(err, file, fileList) {
                this.$message.error('上传失败，请重新选择文件上传')
            },
            handleRemove: function(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview: function(file) {
                console.log(file);
            },
            beforeRemove(file, fileList) {
                return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },

        }
    }
</script>
<style lang="stylus">
    .down_up
        p
            padding-bottom 30px
            a
                background url(../../assets/down.png) top left no-repeat
                padding-left: 30px;
            strong
                margin-left:10px;
                color #08DDAD;
                font-size 12px
        .upload
            font-size 0
            input
                height 30px;
                width:80%;
                border:1px solid #bbb;
                vertical-align middle
                border-right none
            button
                background: linear-gradient(180deg, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 0%, rgba(230, 235, 243, 1) 100%, rgba(230, 235, 243, 1) 100%);
                box-sizing: border-box;
                border-width: 1px;
                border-style: solid;
                border-color: rgba(217, 217, 217, 1);
                color:#333
                border-radius 0
                vertical-align middle
        .el-upload
            width:100%
        .el-button
            width: 80px;
            height: 30px;
            line-height 30px;
            padding:0
            color #fff
            background rgba(22, 202, 225, 1);
            border-radius 0
            font-size 12px
            &+button
                color: #808080;
                background #fff
        .el-dialog__footer
            padding-bottom 40px
        .el-dialog__header
            background-color: rgba(221, 226, 227, 1);
            text-align left
            padding: 10px 20px 10px;
            .el-dialog__title
                font-size 14px
            .el-dialog__headerbtn
                top:12px

</style>
