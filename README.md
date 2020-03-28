# mall-admin-web
<p>
  <a href="https://github.com/macrozheng/mall"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/%E5%90%8E%E5%8F%B0%E9%A1%B9%E7%9B%AE-mall-blue.svg" alt="后台项目"></a>
  <a href="http://qm.qq.com/cgi-bin/qm/qr?k=V6xu5c12j9qhnMUNdDRzakNxRKzOxibQ"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/QQ%E7%BE%A4-959351312-red.svg" alt="QQ群"></a>
  <a href="http://qm.qq.com/cgi-bin/qm/qr?k=M5Edq2TiJL_ShcOEeYjwcmdGmq4zZrd_"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/QQ%E7%BE%A4-553018255-red.svg" alt="QQ群"></a>
  <a href="https://gitee.com/macrozheng/mall-admin-web"><img src="http://macro-oss.oss-cn-shenzhen.aliyuncs.com/mall/badge/%E7%A0%81%E4%BA%91-%E9%A1%B9%E7%9B%AE%E5%9C%B0%E5%9D%80-orange.svg" alt="码云"></a>
</p>

## Foreword

This project is the front-end part of separation project，Backend project `mall` address：[Portal](https://github.com/kratos47mhs/mall)。

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
├── api -- axios network request definition
├── assets -- Still picture resource file
├── components -- Common component package
├── icons -- svg vector picture file
├── router -- vue-router routing configuration
├── store -- vuex state management
├── styles -- Global css style
├── utils -- Tools
└── views -- Front page
    ├── home -- Home
    ├── layout -- Common page loading framework
    ├── login -- Landing page
    ├── oms -- Order module page
    ├── pms -- Product module page
    └── sms -- Marketing module page
```

## Build steps
- Download node and install：[https://nodejs.org/dist/v12.16.1/node-v12.16.1-x64.msi](https://nodejs.org/dist/v12.16.1/node-v12.16.1-x64.msi);
- This project is a front-end and back-end separation project. A back-end environment is required to access the local access interface.[Portal](https://github.com/macrozheng/mall);
- There is no need to set up a back-end environment to access the online interface, just change the BASE_API in the config / dev.env.js file to[http://120.27.63.9:8080](http://120.27.63.9:8080)only;
- Clone the source code locally, open it with IDEA, and complete the compilation;
- Run command in IDEA command line：npm install,Download related dependencies;
- Run command in IDEA command line：npm run dev,Run the project;
- address：[http://localhost:8090](http://localhost:8090) You can open the back-end Admin page;
- Please refer to the specific deployment process：[Installation and deployment of mall front-end projects](http://www.macrozheng.com/#/deploy/mall_deploy_web)
- `note`：If you can't run npm command，Need to configure npm environment variables，Such as adding in path variable：C:\Users\zhenghong\AppData\Roaming\npm;
- `note`：If you encounter npm install and cannot successfully download the dependencies，Please refer to[Use Jenkins to deploy and deploy front-end applications in one click. That's it!](http://www.macrozheng.com/#/reference/jenkins_vue) In the `Encountered Pit` section.

## license

[Apache License 2.0](https://github.com/macrozheng/mall-admin-web/blob/master/LICENSE)

Copyright (c) 2018-2020 macrozheng
