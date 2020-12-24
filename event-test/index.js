const axios = require("axios");
const bpmClient = axios.create({
  baseURL: "http://localhost:8080/engine-rest",
  headers: { "Content-Type": "application/json" }
});

const msgOpt = {
  url: "/message",
  method: "post",
  data: {
    messageName: "msg_add_note",
    processInstanceId: "ffe4390a-45c6-11eb-86f6-0242ac120002",
    processVariables: {
      someText: {
        value: "第一条实例信息."
      }
    }
  }
};

bpmClient
  .request(msgOpt)
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err.message);
  });
