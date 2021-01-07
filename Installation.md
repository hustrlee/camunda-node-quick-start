

# Camunda BPM 的安装

本文档介绍 Camunda BPM 的发布版本、Run 版本的 Docker 部署、Run 版本的基本配置。对于 Node.js 开发者来说，使用 Docker 部署 Camunda BPM Run 是最简单，且几乎无需具备 Java 开发经验的部署方式。

相关官方安装文档：[Installation - Camunda Docs](https://docs.camunda.org/manual/latest/installation/)



## Camunda BPM 的发布版本

Camunda BPM 提供了两个发行版本：

- **Full Distribution** 是以 **WAR** 形式发布的版本，它需要运行在 Java 应用服务器上，例如：Wildfly 或者 Tomcat。
- **Camunda BPM Run** 是预先打包好的 spring boot 应用，只需要 Java Runtime Environment 8+。

对于 Node.js 开发者来说，只能采用独立/集群工作引擎服务器开发模式（详见：[Camunda BPM 的 Node.js 开发架构]()），使用任意发布版本都没有明显的区别。其中，Camunda BPM Run 部署对 Java 开发知识的依赖最少，也更符合微服务的开发理念，因此推荐使用 Camunda BPM Run 版本。



## Docker 部署

