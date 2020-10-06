import Vue from 'vue'
import App from './App.vue'
import "@babel/polyfill";
// import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import "roboto-fontface/css/roboto/roboto-fontface.css";
import "@mdi/font/css/materialdesignicons.css";
import GAuth from 'vue-google-oauth2'
require('dotenv').config()
Vue.config.productionTip = false

const gauthOption = {
  clientId: process.env.VUE_APP_CLIENT_ID,
  scope: 'https://www.googleapis.com/auth/calendar',
  prompt: 'consent'
}

Vue.use(GAuth, gauthOption)

new Vue({
  vuetify,
  store,
  render: h => h(App)
}).$mount('#app')
