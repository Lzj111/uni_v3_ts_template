# 一、规范
  1、结构调整后及时修改“二”
  2、目录名称统一使用小写
  3、组件名统一使用PascalCase命名方式(以大写字符开头),后面最好不用添加component名，如TaskList.vue
  4、组件和js中优先使用双引号""

# 二、结构说明(processcenter\src)
│  App.vue
│  env.d.ts
│  main.ts  // >> 入口文件
│  manifest.json
│  pages.json
│  shime-uni.d.ts
│  uni.scss
│  
├─@types  >> 智能提示
│      core.d.ts
│      
├─components  >> 通用组件
│  └─business // >> 业务通用组件
├─pages  >> 业务页面
│  ├─index
│  │      index.vue
│  │      TaskList.vue
│  │      ToDoList.vue
│  │      
│  └─to_do
│          to_do.vue
│          
├─static
│  │  config.json  >> 站点配置文件
│  │  
│  ├─css  >> css通用文件
|  |
│  ├─font  >> 字体图标
│  │      iconfont.css
│  │      iconfont.ttf
│  │      
│  └─images  >> 图片存放目录
│          index_bg.png
│          logo.png
│          
└─utils  >> 通用工具方法
        api.ts  // >> 全局API请求:所有用到的API统一放在该文件,便于管理
        core.ts  // >> core文件:一些核心方法写在此处(如http请求)
        util.ts  // >> 通用方法
