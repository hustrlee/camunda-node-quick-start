const { Client, logger } = require("camunda-external-task-client-js");
// 为控制台日志添加时间标签
require("console-stamp")(console);

// 配置客户端:
//  - 'baseUrl': 流程引擎的 URL
//  - 'logger': 日志记录
//  - 'asyncResponseTimeout': 长轮询超时时间（超时后，客户端会自动再次发起连接）
const config = {
  baseUrl: "http://localhost:8080/engine-rest",
  use: logger,
  asyncResponseTimeout: 5000
};

// 创建客户端实例
const client = new Client(config);

// 订阅主题: "simple-service"
client.subscribe("simple-service", async function ({ task, taskService }) {
  // 业务代码
  console.log("外部服务开始运行...");

  // 完成外部任务
  await taskService.complete(task);
  console.log("外部服务结束.");
});
