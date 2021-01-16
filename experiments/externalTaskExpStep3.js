const {
  Client,
  logger,
  Variables
} = require("camunda-external-task-client-js");
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

// 封装异步的 timeout 函数
const timeout = delayms => {
  return new Promise(resolve => {
    setTimeout(resolve, delayms);
  });
};

// 订阅主题: "simple-service"
client.subscribe("simple-service", async function ({ task, taskService }) {
  // 获取流程变量值
  const label = task.variables.get("label");
  console.log("[流程：%s] 外部服务开始运行...", label);

  // 让外部任务持续运行一段时间
  const end = 10;
  for (let i = 0; i < end; i++) {
    // 模拟异步执行一段耗时的程序：
    // 异步延时 1s
    await timeout(1000);
    console.log("[流程：%s] 外部服务已循环 %d 次...", label, i);
  }

  // 完成外部任务时，更新流程变量
  await taskService.complete(task);
  console.log("[流程：%s] 外部服务结束.", label);
});
