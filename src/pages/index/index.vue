<template>
  <view class="container">
    首页
  </view>
</template>

<script lang="ts">
// > 启用类型推导
import { defineComponent } from 'vue'
import type { PropType } from 'vue';

export default defineComponent({
  name: "Index",
  components: {},
  props: {},
  data() {
    return {

    };
  },
  mounted() { },
  computed: {

  },
  onLoad: function (option: any) {

  },
  created() {

  },
  onPullDownRefresh() {

  },
  onShow() {

  },
  methods: {
  },
})
</script>

<style lang="scss">
@import "~@/static/css/common.scss";

.container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0px 24rpx;
  box-sizing: border-box;
}
</style>