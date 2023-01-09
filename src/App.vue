<template>
  <div id="app">
     <Home />
  </div>
</template>

<script>
import Home from './views/Home.vue'

// 主外頁
export default {
  name: 'App',
  components: { Home }
}
</script>

<style lang="scss">
@import '~bootstrap/scss/bootstrap';
</style>
