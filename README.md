# mall-admin-web
<p>
  <a href="https://github.com/macrozheng/mall"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/%E5%90%8E%E5%8F%B0%E9%A1%B9%E7%9B%AE-mall-blue.svg" alt="后台项目"></a>
  <a href="http://qm.qq.com/cgi-bin/qm/qr?k=V6xu5c12j9qhnMUNdDRzakNxRKzOxibQ"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/QQ%E7%BE%A4-959351312-red.svg" alt="QQ群"></a>
  <a href="http://qm.qq.com/cgi-bin/qm/qr?k=M5Edq2TiJL_ShcOEeYjwcmdGmq4zZrd_"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/QQ%E7%BE%A4-553018255-red.svg" alt="QQ群"></a>
  <a href="https://gitee.com/macrozheng/mall-admin-web"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/%E7%A0%81%E4%BA%91-%E9%A1%B9%E7%9B%AE%E5%9C%B0%E5%9D%80-orange.svg" alt="码云"></a>
</p>

## 前言

This project is the front-end part of separation project，后端项目`mall`地址：[传送门](https://github.com/kratos47mhs/mall)。

## Project Introduction

`mall-admin-web`Is a front-end project of an e-commerce back-end management system，Based on Vue + Element. Product management、Order management、Member Management、Promotion Management、Operations Management、Content management、Statistical report、Financial Management、Rights management, settings, etc.

### Project demo

Project online demo address：[http://www.macrozheng.com/admin/](http://www.macrozheng.com/admin/)

![https://github.com/macrozheng/mall/blob/master/document/resource/mall-admin.gif](https://github.com/macrozheng/mall/blob/master/document/resource/mall-admin.gif)

### Used Technologies

technology | Description | Official website
----|----|----
Vue | Front-end framework | [https://vuejs.org/](https://vuejs.org/)
Vue-router | Routing framework | [https://router.vuejs.org/](https://router.vuejs.org/)
Vuex | state management pattern | [https://vuex.vuejs.org/](https://vuex.vuejs.org/)
Element | Front-end UI framework | [https://element.eleme.io/](https://element.eleme.io/)
Axios | Front-end HTTP framework | [https://github.com/axios/axios](https://github.com/axios/axios)
v-charts | Charting framework based on Echarts | [https://v-charts.js.org/](https://v-charts.js.org/)
Js-cookie | cookie management tools | [https://github.com/js-cookie/js-cookie](https://github.com/js-cookie/js-cookie)
nprogress | Progress bar controls | [https://github.com/rstacruz/nprogress](https://github.com/rstacruz/nprogress)
vue-element-admin | Project scaffolding reference | [https://github.com/PanJiaChen/vue-element-admin](https://github.com/PanJiaChen/vue-element-admin)

### Project layout

``` lua
src -- Source directory
├── api -- axios网络请求定义
├── assets -- 静态图片资源文件
├── components -- 通用组件封装
├── icons -- svg矢量图片文件
├── router -- vue-router路由配置
├── store -- vuex的状态管理
├── styles -- 全局css样式
├── utils -- 工具类
└── views -- 前端页面
    ├── home -- 首页
    ├── layout -- 通用页面加载框架
    ├── login -- 登录页
    ├── oms -- 订单模块页面
    ├── pms -- 商品模块页面
    └── sms -- 营销模块页面
```

## 搭建步骤
- 下载node并安装：[https://nodejs.org/dist/v12.14.0/node-v12.14.0-x64.msi](https://nodejs.org/dist/v12.14.0/node-v12.14.0-x64.msi);
- 该项目为前后端分离项目，访问本地访问接口需搭建后台环境，搭建请参考后端项目[传送门](https://github.com/macrozheng/mall);
- There is no need to set up a background environment to access the online interface, just change the BASE_API in the config / dev.env.js file to[http://120.27.63.9:8080](http://120.27.63.9:8080)即可;
- 克隆源代码到本地，使用IDEA打开，并完成编译;
- 在IDEA命令行中运行命令：npm install,下载相关依赖;
- 在IDEA命令行中运行命令：npm run dev,运行项目;
- 访问地址：[http://localhost:8090](http://localhost:8090) 即可打开后台管理系统页面;
- 具体部署过程请参考：[mall前端项目的安装与部署](http://www.macrozheng.com/#/deploy/mall_deploy_web)
- `注意`：如果遇到无法运行npm命令，需要配置npm的环境变量，如在path变量中添加：C:\Users\zhenghong\AppData\Roaming\npm;
- `注意`：如果遇到npm install无法成功下载依赖，请参考[使用Jenkins一键打包部署前端应用，就是这么6！](http://www.macrozheng.com/#/reference/jenkins_vue) 中`遇到的坑`部分。

## 许可证

[Apache License 2.0](https://github.com/macrozheng/mall-admin-web/blob/master/LICENSE)

Copyright (c) 2018-2020 macrozheng
