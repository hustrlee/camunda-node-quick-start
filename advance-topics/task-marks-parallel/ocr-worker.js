const axios = require("axios");
const { Client, logger } = require("camunda-external-task-client-js");

const axiosClient = axios.create({
  baseURL: "http://localhost:8080/engine-rest/",
  headers: { accept: "application/json" },
});

const client = new Client({
  baseUrl: "http://localhost:8080/engine-rest",
  use: logger,
});

client.subscribe("simulate_ocr", async ({ task, taskService }) => {
  const callerId = task.variables.get("callerId");

  console.log("Serving caller Id:", callerId);

  // 假设 OCR 服务需要 0.5s
  await new Promise((resovle) => {
    setTimeout(() => {
      resovle();
    }, 0.5 * 1000);
  });

  console.log("Complete service for caller Id:", callerId);

  // 发送 ocr_completed 消息
  try {
    const res = await axiosClient.post("/message", {
      messageName: "ocr_completed",
      localCorrelationKeys: {
        callerId: {
          value: callerId,
          type: "String",
        },
      },
    });
    console.log("Send completed message. Result:", JSON.stringify(res.data));
  } catch (err) {
    console.log(err.message);
  } finally {
    await taskService.complete(task);
  }
});
