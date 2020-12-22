# Camunda BPM 的 Node.js 开发快速指南



## Camunda BPM 概述

Camunda 基于 Java 的 BPM 框架，支持 BPMN（工作流/过程自动化）、CMMN（事件管理）和 DMN（业务决策管理）等标准。

下图展示了 Camunda 中最重要的组件，以及典型的用户角色。

![架构](./img/architecture-overview.png)



### 工作流/过程引擎（Process Engine）

- 过程引擎是一个 Java Library，用于执行 BPMN 2.0 过程、CMMN 1.1 事件和 DMN 1.3 决策表。它使用了关系数据库来做数据持久化。



### 建模器（Modeler）

- Camunda 提供了**建模器**，用于 BPMN 2.0、CMMN 1.1 的流程图建模，以及 DMN 1.3 的决策表建模。

- 也可以使用**在线的建模器**：[bpmn.io](https://bpmn.io) 来完成建模。



### Web 应用

- **REST API** 允许 Javascript 应用使用**过程引擎**，这是 Node.js 开发者使用 Camunda BPM 的方式。
- **Camunda Tasklist** 是基于 Web 的任务管理应用，它允许用户查看工作流任务，修改任务数据。
- **Camunda Cockpit** 是基于 Web 的工作流实例管理应用，它允许用户监控工作流实例，探查工作流实例的状态，修正被中断的工作流。
- **Camunda Admin** 是用户管理、组管理和授权的 Web 应用。



## Camunda BPM 平台的 Node.js 开发架构

### 独立的过程引擎服务器（Standalone/Remote Process Engine Server）

![独立的过程引擎服务](./img/standalone-process-engine.png)

**过程引擎**作为一个独立的服务器运行，提供网络服务。远程应用（Node.js 应用）通过 REST API 和过程引擎进行交互。



### 集群模式（Clustering Model）

**过程引擎**也支持集群部署，每个**过程引擎**实例必须连接到同一个共享的数据库。

![集群模式](./img/clustered-process-engine.png)



## Camunda BPM 的部署

### Camunda BPM 的发布

- **Full Distribution** 是以 **WAR** 形式发布的版本，它需要运行在 Java 应用服务器上，例如：Wildfly 或者 Tomcat。部署 **Full Distribution** 需要一定的 Java 开发基础，对 Node.js 开发者不友好。
- **Camunda BPM Run** 是预先打包好的 spring boot 应用，包括：Camunda BPM Platform 和 REST API，无需任何 Java 开发知识，就可以部署。



### Docker 部署

**Camunda BPM Run** 的部署固然不需要 Java Application Server，但是仍然离不开 Java 环境：运行 Camunda BPM Run 需要 **Java Runtime Environment 8+**。

采用 Docker 部署可以进一步简化部署过程：Camunda 已经预先将运行环境和 Camunda BPM Run 打包成 Docker 镜像，发布在 [hub.docker.com](https://hub.docker.com/r/camunda/camunda-bpm-platform) 上，只需要运行以下命令，就可以方便的部署最新的 Camunda BPM Run。

```bash
docker pull camunda/camunda-bpm-platform:run-latest
docker run -d --name camunda -p 8080:8080 camunda/camunda-platform:run-latest
```

部署成功后，可以通过：

- http://localhost:8080/camunda/app/ 来访问 Camunda webapps（Cockpit，Tasklist，Admin）
- http://localhost:8080/engine-rest/engine 来访问 REST API

- 默认的用户名/密码：demo/demo



## Camunda BPM Run 的配置

Camunda BPM Run 是 Spring Boot 应用，因此需要少许 Spring Boot 应用配置的知识：

- Spring Boot 可以通过配置文件来进行配置，Camunda BPM Run 的配置文件位于：`configuration/`
- Camunda BPM Run 提供了两个配置文件：`default.yml` 和 `production.yml` 分别用于开发和生产环境
  - 不带任何参数启动，使用 `default.yml`
  - 使用参数 `--production` 启动，使用 `production.yml`
- 可以使用环境变量来覆盖配置文件中的配置项
  - Docker 部署时，使用环境变量来进行配置，是比较方便的方式
  - 使用环境变量参数使得 `docker run` 命令很长，使用 `docker-compose` 进行部署，更为方便



### 配置数据库

Camunda BPM Run 默认连接到 H2 内存数据库，需要连接到一个独立的数据库来实现数据持久化。

#### 数据库的选择

Camunda BPM Run 支持主流的数据库，并内置了 MySQL 和 PostgreSQL 的 JDBC 驱动。

Camunda 官方文档公布支持的数据库：

- MySQL 5.6 / 5.7
- PostgreSQL 9.4 / 9.6 / 10.4 / 10.7 / 11.1 / 11.2 / 12.2

通常认为：

- PostgreSQL 在可靠性和数据完整性上优于 MySQL
- MySQL 被 Orcale 收购后，遭到很多去 Orcale 化开发者的弃用
- 与 PostgreSQL 12 相比，MySQL 5 过于陈旧，而 Camunda 官方并没有宣称支持 MySQL 8

因此，采用 PostgreSQL 12.2 来做数据持久化。



#### 数据库的部署

同样采用 `docker-compose` 部署 PostgreSQL 12.2 最为方便。

`docker-compose.yaml`：

```yaml
version: "3.8"
services:
	camunda-db:
		image: postgres:12.2
		container_name: camunda-db
		environment:
			- POSTGRES_PASSWORD=camunda
      - POSTGRES_USER=camunda
      - POSTGRES_DB=camunda
    expose:
      - 5432
    volumes:
      - camunda_pgdata:/var/lib/postgresql/data
    command: postgres

volumes:
	camunda_pgdata:
```



#### 连接数据库

连接数据库需要设置以下属性：

| 前缀              | 属性名             | 描述                                                         |
| ----------------- | ------------------ | ------------------------------------------------------------ |
| spring.datasource | .url               | 数据库的 JDBC 连接路径                                       |
|                   | .driver-class-name | 数据库 JDBC 驱动的类名。需要将 JDBC 驱动存储到 `configuration/userlib` 目录下。Camunda BPM Run 发行版已经内置了 MySQL 和 PostgreSQL 的 JDBC 驱动 |
|                   | .username          | 数据库连接的用户名                                           |
|                   | .password          | 数据库连接的用户密码                                         |

如果采用上一节的参数部署 PostgreSQL，则对应的 Camunda BPM Run 的数据库配置（`docker-compose.yaml`）为：

```yaml
...
		environment:
      - SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
      - SPRING_DATASOURCE_URL=jdbc:postgresql://camunda-db:5432/camunda
      - SPRING_DATASOURCE_USERNAME=camunda
      - SPRING_DATASOURCE_PASSWORD=camunda
```

> 在使用环境变量设置 Spring Boot 应用时：
>
> - 属性的连接符使用 "`_`" 来取代 "`.`"
> - 属性的所有字母均需要大写



### 配置跨域

由于使用 Docker 部署独立服务器，且采用了 REST API 远程调用的开发架构，因此 Camunda BPM Run 服务器必须允许跨域的资源访问。

配置跨域的属性为：

| 前缀                 | 属性名           | 描述                                       | 默认值                   |
| -------------------- | ---------------- | ------------------------------------------ | ------------------------ |
| camunda.bpm.run.cors | .enabled         | 是否允许跨域                               | false                    |
|                      | .allowed-origins | 允许跨域访问的来源列表，用逗号隔开多个来源 | 所有来源，包括 `file://` |

为了确保打开跨域，可以添加以下环境变量到 `docker-compose.yaml`：

```yaml
...
		environment:
			...
			- CAMUNDA_BPM_RUN_CORS_ENABLED=true
```



### 完整的 `docker-compose.yaml` 示例

```yaml
version: "3.8"
services:
  camunda-bpm:
    image: camunda/camunda-bpm-platform:run-latest
    container_name: camunda-bpm
    restart: unless-stopped
    depends_on:
      - camunda-db
    environment:
      - SPRING_DATASOURCE_DRIVER_CLASS_NAME=org.postgresql.Driver
      - SPRING_DATASOURCE_URL=jdbc:postgresql://camunda-db:5432/camunda
      - SPRING_DATASOURCE_USERNAME=camunda
      - SPRING_DATASOURCE_PASSWORD=camunda
      - CAMUNDA_BPM_RUN_CORS_ENABLED=true
    volumes:
      - ../../process-definition:/camunda/configuration/resources
    expose:
      - 8080

  camunda-db:
    image: postgres:12
    container_name: camunda-db
    restart: unless-stopped
    environment:
      - POSTGRES_PASSWORD=camunda
      - POSTGRES_USER=camunda
      - POSTGRES_DB=camunda
    expose:
      - 5432
    volumes:
      - camunda_pgdata:/var/lib/postgresql/data
    command: postgres
    
volumes:
  camunda_pgdata:
```

