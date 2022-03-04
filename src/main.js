import Vue from 'vue';
import App from './App.vue';
import router from './router';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import 'vue-directive-image-previewer/dist/assets/style.css';
import VueDirectiveImagePreviewer from 'vue-directive-image-previewer';

Vue.use(Antd);
Vue.use(VueDirectiveImagePreviewer, {
  zIndex: 9999,  //层级显示
  previewSize: 6 //6倍图
});
Vue.config.productionTip = false;

Vue.directive('title', {
  inserted: function (el) {
      document.title = el.dataset.title;
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
