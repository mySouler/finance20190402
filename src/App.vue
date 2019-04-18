<template>
  <div id="app" class="mainBox">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style >
#app{
  display: -ms-flexbox;
  display: flex;
  -ms-flex-direction: column;
  flex-direction: column;
  display: -webkit-flex;
  -ms-flex: 1;
  flex: 1;
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  color: #333;
  background: #f5f5f5;
  min-height: 900px;
}
.white{
  background: #fff !important;
}
</style>
