<template>
  <div id="app">
    <EditService />
  </div>
</template>

<script>
import EditService  from './views/EditService.vue';
// 主外頁
export default {
  name: 'App',
  components: { EditService }
}
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';
</style>