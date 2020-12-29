const axios = require("axios");
const bpmClient = axios.create({
  baseURL: "http://localhost:8080/engine-rest",
  headers: { "Content-Type": "application/json" }
});

const processDefinitionKey = "tutorial-1";

const opt = {
  method: "post",
  url: `/process-definition/key/${processDefinitionKey}/start`,
  data: {
    variables: {
      info: {
        value: "第一个示例流程实例。"
      }
    }
  }
};

bpmClient
  .request(opt)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err.message);
  });
