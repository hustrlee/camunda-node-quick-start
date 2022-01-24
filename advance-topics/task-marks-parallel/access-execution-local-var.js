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

bpmClient.subscribe(
  "access-execution-local-var",
  async ({ task, taskService }) => {
    const parentActivityInstanceId = task.variables.get(
      "parentActivityInstanceId"
    );
    console.log("parentActivityInstanceId:", parentActivityInstanceId);

    await taskService.complete(task);
  }
);
