const CamundaBpmJssdk = require("camunda-bpm-jssdk");

let apiInstance = new CamundaBpmJssdk.VersionApi();
apiInstance.getRestAPIVersion().then(
  data => {
    console.log(data.version);
  },
  error => {
    console.error(error);
  }
);
