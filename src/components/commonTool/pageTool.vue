<template>
    <div v-if="pageData.records && pageData.records.length>0" class="pagination">
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="pageData.pageOn" :page-sizes="[10,20,50,100]" :page-size="pageData.limit" :total="pageData.total" layout="total, sizes, prev, pager, next, jumper">
        </el-pagination>
    </div>
</template>
<script>
export default {
    data(){
        return{
            
        }
    },
    props:{
        pageData:{
            type: Object,
            default: function () {
                return {
                    records:[],
                    pageOn:'',
                    limit:'',
                    total:''
                }
            }
        }
    },
    methods:{
        handleSizeChange(val) {
            console.log(`每页 ${val} 条===`);
            this.$emit("sizeChange",val)
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.$emit("pageChange",val)
        },
    }
}
</script>