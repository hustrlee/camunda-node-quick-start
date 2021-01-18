# Camunda BPM OpenAPI 说明

本目录下是 Camunda BPM REST API 的 OpenAPI 描述文件，遵循 [OpenAPI Spec. 3.0.2](https://swagger.io/docs/specification/about/) 规范。

可以利用 OpenAPI 描述文件生成：

- 客户端
- REST API 文档及测试环境



## Javascript 客户端

客户端的生成方法请浏览 [Camunda-BPM-JSSDK 项目](https://github.com/hustrlee/camunda-bpm-jssdk)。

可以直接使用预编译的 JS 客户端，最新版本为：`jssdk/camunda_bpm_rest_api-7.13.0.tgz`



### 安装

将 `.tgz` 拷贝到工程目录下，运行：

```bash
$ npm install camunda_bpm_rest_api-7.13.0.tgz --save
```



### API 文档

`node_modules/camunda_bpm_rest_api/dist/api-reference.md`



### Sample

```javascript
// 假设 Camunda BPM 已经安装，且 REST API 根路径为：http://localhost:8080/engine-rest
// 如果根路径不正确，请修改 node_modules/camunda_bpm_rest_api/dist/ApiClient.js 中的 basePath

const CamundaSDK = require("camunda_bpm_rest_api");

let versionApi = new CamundaSDK.VersionApi();

// 使用 .then
versionApi.getRestAPIVersion().then(
  data => {
    console.log("Camunda BPM Engine Version: " + data.version);
  },
  error => {
    console.error(error);
  }
);

// 使用 async/await
(async () => {
  let data = await versionApi.getRestAPIVersion();
  console.log("Camunda BPM Engine Version: " + data.version);
})();
```



## 搭建 Camunda Engine REST API 文档及测试环境

使用 Docker 部署 [Swagger UI](https://swagger.io/tools/swagger-ui/) 来搭建环境。

启动 swagger-ui：

```bash
$ docker-compose up -d
```

入口：http://localhost:88



### 开启 CORS

为了测试 Camunda BPM REST API，需要开启 CORS。

camunda-bpm-platform:latest 是 Tomcat 容器发行版，Tomcat 开启 CORS 的方法参阅官方文档：[http://tomcat.apache.org/tomcat-7.0-doc/config/filter.html#CORS_Filter](https://tomcat.apache.org/tomcat-7.0-doc/config/filter.html#CORS_Filter)

修改 `web.xml`，添加 `CorsFilter`：

```xml
<!-- =================== Enable Cors ================================== -->

<filter>
  <filter-name>CorsFilter</filter-name>
  <filter-class>org.apache.catalina.filters.CorsFilter</filter-class>
  <init-param>
    <param-name>cors.allowed.origins</param-name>
    <param-value>*</param-value>
  </init-param>
</filter>
<filter-mapping>
  <filter-name>CorsFilter</filter-name>
  <url-pattern>/*</url-pattern>
</filter-mapping>
```

