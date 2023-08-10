<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
import Utils from '@/utils/util';

onLaunch((options: any) => {
  console.log("App Launch => ", options);
});
onShow(() => {
  console.log("App Show");
});
onHide(() => {
  console.log("App Hide");
});

// > 页面跳转拦截器
let NavigateToInterceptor: Function = function () {
  // > 路由页面地址
  let _currentUrl: string = "";
  uni.addInterceptor('navigateTo', {
    // > 页面跳转前进行拦截, invoke根据返回值进行判断是否继续执行跳转
    invoke(e) {
      _currentUrl = e.url;
    },
    success(e) {
      let titleStr: string | null = Utils.getUrlParam(_currentUrl, "title");
      console.log("NavigateToInterceptor.addInterceptor.navigateTo=>", _currentUrl);
      titleStr && uni.setNavigationBarTitle({ title: titleStr });
    }
  })
}
</script>

<style lang="scss">
/* uview-plus样式文件 */
@import "uview-plus/index.scss";
/* 引入字体图标 */
@import url("./static/font/iconfont.css");
/* 引入方正字体 */
@import url("./static/font/FZZhengHeiS-EB-GB.css");

/* #ifdef H5 */
uni-page-head {
  display: none;
}

uni-page-wrapper {
  height: calc(100% - env(safe-area-inset-top)) !important;
}

/* #endif */
</style>