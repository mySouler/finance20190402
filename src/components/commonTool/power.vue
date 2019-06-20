<template>
  <div>
    <div class="myDialog staff">
      <el-dialog title="菜单权限" :visible.sync="openPower" @close="$emit('update:openPowerDia', false)"  width="20%" center>
        <div v-loading="load">
          <el-tree :data="powerList"
            show-checkbox
            :expand-on-click-node="true"
            :check-on-click-node="true"
            :default-expanded-keys="defaultChoose"
            :default-checked-keys="allKey"
            node-key="id"
            ref="tree"

            :highlight-current="true"
            :props="defaultProps">
          </el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
                      <el-button @click="updateData" >确定</el-button>
                      <el-button  @click="$emit('update:openPowerDia', false)">取 消</el-button>
                  </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        defaultChoose: [],
        allKey: [],
        openPower: this.openPowerDia,
        powerList: [],
        load: true,
        allCheckData: [],
      }
    },
    mounted(){
      // console.log(this.openPower,'openPower')
      // console.log(this.initUrl,'initUrl')
      // console.log(this.updataUrl,'updataUrl')
      // console.log(this.type,'type')
      // console.log(this.id,'id')
      this.power();
    },
    props:["initUrl","updataUrl","type","id","openPowerDia"],
    methods: {

      async power(data) {

        this.allCheckData.length = 0
        this.powerList = []
        this.defaultChoose = []
        let params = {}
        params[this.type] = this.id
        let result = await this.initUrl(params)
        console.log("TCL: power -> result", result)
        this.powerList = result.result
        if (result.success) {
          this.load = false
          if (this.powerList.length > 0) {
            this.defaultChoose.push(this.powerList[0].id)
            this.powerList.map(item => {
              this.allKey.push(item.id)
              console.log("TCL: power -> item.children", item.children.length)
              if (item.children && item.children.length > 0) {
                item.children.map(item => {
                  this.allKey.push(item.id)
                  if (item.children.children && item.children.children.length > 0) {
                    item.children.children.map(item => {
                      this.allKey.push(item.id)
                    })
                  }
                })
              }
            })
          }
        } else {
          setTimeout(() => {
            this.load = false
          }, 1500)
        }
      },
      handleCheckChange(data) {
        if (data.parentId) {
          let choose = data.parentId + ',' + data.id;
          this.allCheckData.push(choose)
        }
        console.log(data,"allchoose");
      },
      async updateData() {
        this.allCheckData.length = 0
        let allChoose = this.$refs.tree.getCheckedNodes();
        allChoose.forEach((item)=>{
          this.handleCheckChange(item)
        })
        console.log("TCL: updateData -> chooseData updateData",this.allCheckData)
        console.log("TCL: updateData -> chooseData updateData chooseData + ''",this.allCheckData + '')

        try {
          let params = {}
          params[this.type] = this.id
          params.permissionIds = this.allCheckData + ''
          let data = await this.updataUrl(params)
          if (data.success) {
            this.$message.success(data.message)
            setTimeout(() => {
              this.$emit('update:openPowerDia', false)
            }, 500)

          } else {
            this.$message.error(data.message)
            setTimeout(() => {
              this.$emit('update:openPowerDia', false)
            }, 2000)
          }

        } catch (error) {
          console.log("TCL: updateData -> error", error)
        }

      },
    },
    watch: {
        openPowerDia(val){
          console.log("TCL: openPowerDia -> val", val)
          this.openPower = val

        },

    }
  }
</script>
