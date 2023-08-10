import { createSSRApp } from "vue";

import App from "./App.vue";
import uviewPlus from "uview-plus";
// 导入Unocss // import 'uno.css'
import { http, log } from "./utils/core";

export function createApp() {
  const app = createSSRApp(App);
  // > 全局引入uview组件
  app.use(uviewPlus);
  // > 将http对象挂载到vue上供全局使用
  app.config.globalProperties.$http = http;
  // > 将通用日志对象挂载vue带上供全局使用
  app.config.globalProperties.Log = log;
  
  return {
    app,
  };
}

uni.$u.config.unit = 'rpx';