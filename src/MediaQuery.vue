<template>
  <div id="app">
    <MediaQuery />
  </div>
</template>

<script>
import MediaQuery  from './views/MediaQuery.vue';
// 主外頁
export default {
  name: 'App',
  components: { MediaQuery }
}
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';
</style>