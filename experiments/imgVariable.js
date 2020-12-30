const axios = require("axios");
const bpmClient = axios.create({
  baseURL: "http://localhost:8080/engine-rest",
  headers: { "Content-Type": "application/json" }
});

const json = {
  aString: "这是一个字符串",
  aNumber: 100,
  aBoolean: true
};
const array = [1, 1, 2, 3, 5, "斐波那契数列"];
const text = "5paH5pys5paH5Lu256S65L6L44CC";

const taskId = "42f4d5d5-4982-11eb-9728-0242ac120002"; // 请根据实际情况修改taskId
const opt = {
  method: "post",
  url: `/task/${taskId}/variables`,
  data: {
    modifications: {
      aJson: {
        value: JSON.stringify(json),
        type: "Json"
      },
      anotherJson: {
        value: json
      },
      aArray: {
        value: array
      },
      aFile: {
        value: text,
        type: "File",
        valueInfo: {
          filename: "textFile.txt",
          mimetype: "text/plain",
          encoding: "UTF-8"
        }
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
