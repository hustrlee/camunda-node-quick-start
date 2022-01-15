const axios = require("axios");
const axiosClient = axios.create({
  baseURL: "http://localhost:8080/engine-rest",
  headers: { accept: "application/json" },
});

const { Client, logger } = require("camunda-external-task-client-js");
const bpmClient = new Client({
  baseUrl: "http://localhost:8080/engine-rest",
  use: logger,
});

bpmClient.subscribe("call-assist", async ({ task, taskService }) => {
  const loopCounter = task.variables.get("loopCounter");
  const callerId = task.variables.get("callerId");
  console.log("callerId:", callerId);

  try {
    await axiosClient.post("/message", {
      messageName: "msg-call-assist",
      processVariables: {
        callerId: {
          value: callerId,
          type: "String",
        },
        loopCounter: {
          value: loopCounter,
          type: "Integer",
        },
      },
    });
  } catch (err) {
    console.log(err.message);
  }

  await taskService.complete(task);
});
