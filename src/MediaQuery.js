// Vue
import Vue from 'vue'
import App from './MediaQuery.vue'
import VueCompositionAPI from '@vue/composition-api'

import toastrSetup from './util/toastrSetup'

import { Pagination } from 'element-ui'
Vue.component(Pagination.name, Pagination)

// all scss
import './assets/scss/index.scss'

// Vue composition-api
Vue.use(VueCompositionAPI)

// vue tool
Vue.config.productionTip = false
Vue.config.devtools = true

// toastr
toastrSetup()

// fontawesome
import '@fortawesome/fontawesome-free/css/all.css'
import '@fortawesome/fontawesome-free/js/all.js'

// init
new Vue({
  render: (h) => {
    // 都使用App主元件
    return h(App)
  }
}).$mount('#app')