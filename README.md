# operation-admin
运营管理系统后台

## 前序准备

  你的本地环境需要安装 node 和 git。我们的技术栈基于 ES2015+、React、dva、g2 和 antd，提前了解和学习这些知识会非常有帮助。node版本请尽量用最新版本，保证大于6.5版本。
  安装好node之后，请安装yarn或者cnpm,npm(三选一，示例使用yarn作为包管理工具)
  ```
    npm install yarn -g
  ```

## 目录结构
  ```
  ├── mock                     # 本地模拟数据
  ├── public
  │   └── favicon.ico          # Favicon
  ├── src
  │   ├── assets               # 本地静态资源
  │   ├── common               # 应用公用配置，如导航信息
  │   ├── components           # 业务通用组件
  │   ├── constant             # 全局变量配置
  │   ├── e2e                  # 集成测试用例
  │   ├── layouts              # 通用布局
  │   ├── models               # dva model
  │   ├── routes               # 业务页面入口和常用模板
  │   ├── services             # 后台接口服务
  │   ├── utils                # 工具库
  │   ├── g2.js                # 可视化图形配置
  │   ├── theme.js             # 主题配置
  │   ├── index.ejs            # HTML 入口模板
  │   ├── index.js             # 应用入口
  │   ├── index.less           # 全局样式
  │   └── router.js            # 路由入口
  ├── tests                    # 测试工具
  ├── README.md
  └── package.json
  ```

## 编译步骤

1. Installation

    ``yarn install``

2. 配置全局变量

    ```
      /* 配置文件位置:src/constant/config.js */

      //单点登录URL
      export const URL = 'https://login.robo2025.com';

      //网站内容接口URL
      export const URL1 = 'http://139.199.96.235:9002';

      //验证登录接口URL
      export const LOGIN_URL = URL + '/server/authorize';

      //注册接口URL
      export const REGISTER_URL = URL + '/register';

      //登录接口URL
      export const LOGOUT_URL = URL + '/logout';

      // 静态web服务器地址
      let myHost = "http://localhost:8000";
    ```

3. 打包编译

    ``npm run build``

4. 打包后内容

    打包后文件位于开发环境根目录的dist目录下,我们支持了代码分割和动态加载，只有进入对应路由后才会加载相应的代码，避免首屏加载过多不必要的 JS 文件，提高大规模前端应用研发的扩展性。
    ```
    ├── 0.2df975b2.async.js
    ├── 1.2df975b2.async.js
    ├── 10.2df975b2.async.js
    ├── 11.[hash].async.js
    ├── 12.[hash].async.js
    ├── 13.[hash].async.js
    ├── 14.[hash].async.js
    ```

5. 将打包好的文件放置到web服务器下
