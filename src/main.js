import Vue from 'vue'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify';

Vue.config.productionTip = false

Vue.filter('capitalize', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

Vue.filter('limitDescription330Char', function (value) {
  if (!value) return ''
  value = value.toString()
  return value.substring(0,330)+"..."
})

new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
