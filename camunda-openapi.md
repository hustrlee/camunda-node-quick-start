# 使用 OpenAPI 构建 Camunda REST API 文档及客户端

OpenAPI 规范（最初被称为 Swagger 规范）是一种机器可读接口文件的规范，用于描述、生成、使用和可视化 RESTful API。Camunda 官方提供符合 OpenAPI 3.0.2 规范的 REST API 描述文件（[Camunda 官方下载](https://app.camunda.com/nexus/service/rest/repository/browse/camunda-bpm/org/camunda/bpm/camunda-engine-rest-openapi/?__hstc=12929896.cea68860d9fb41d2663c7bcdc5d03ba0.1589530777836.1610689876718.1610937634661.79&__hssc=12929896.6.1610937634661&__hsfp=2532042457)，选择正确的版本，下载 `jar` 文件，然后解压得到 `openapi.json` 描述文件）。

通过该描述文件，开发者可以：

- 获得完整的 Camunda REST API 文档
- 在可视化环境体验、测试 API
- 可使用 OpenAPI 构建工具，构建多种语言的客户端（包括：Node.js Client library）



## 构建 Camunda REST API 可视化文档

使用 Docker 部署 [Swagger UI](https://swagger.io/tools/swagger-ui/) 可以轻松的部署可视化文档。

