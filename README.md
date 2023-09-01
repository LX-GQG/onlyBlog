# onlyBolg
基于koa和sequelize 开发的result api 后台 ，使用bcryptjs对密码进行加密，并进行了权限控制，分配权限，根据权限进行路由拦截。

使用sequelize对数据库进行操作，jwt对token进行封装，log4js进行日志监控，https访问，文件上传，跨域

Koa 框架做服务端 API 接口，只做了简单的基础，其余内容可以根据代码进行扩展

后台管理系统地址：https://github.com/LX-GQG/onlyBlogAdmin

## 1.1 项目功能
- 文章管理
- 权限管理
    - 用户管理
    - 用户组管理

## 1.2 项目结构
```
├─app.js (入口文件)
├─package-lock.json
├─package.json
├─README.md
├─utils (工具库)
|   ├─auth.js (登录权限的中间件)
|   ├─log4.js (封装日志)
|   ├─token.js (验证token jwt)
|   └─utils.js (封装的函数，方法库)
├─ssl(存放https证书)
├─router (路由)
|   ├─index.js (封装路由) 
|   └─router.js (路由列表)
├─public (上传文件)
├─models (业务逻辑映射成数据模型)
├─middleware (中间件)
|     ├─error.js (封装统一返回错误)
|     ├─index.js (封装统一)
|     └─response.js (封装统一返回内容)
├─logs (日志记录)
├─controllers (控制层，数据处理)
├─config (配置)
|   ├─config.js (数据库配置)
|   ├─db.js (连接数据库)
|   ├─dbContent.js (封装数据库方法)
|   └─secret.js (密钥)
```

## 1.4 启动项目
```
# 进入项目根目录

cd onlyBlog

# 安装依赖包

npm install 或者 yarn install

# 启动 Node.js Koa2 项目

npm run dev 或者 yarn dev
```
本项目有权限控制，需登录，请求头上需要Authorization: Bearer + token才可以访问，Bearer和token需要用空格隔开。
超级管理员拥有全部权限 
账号：admin
密码：123456
默认端口为3000，即可通过 https://localhost:3000/api/xxx 调用接口


