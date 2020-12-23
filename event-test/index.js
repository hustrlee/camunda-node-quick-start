const axios = require("axios");
const bpmClient = axios.create({
  baseURL: "http://localhost:8080/engine-rest",
  headers: { "Content-Type": "application/json" }
});

const msgOpt = {
  url: "",
  method: "post",
  data: {}
};
