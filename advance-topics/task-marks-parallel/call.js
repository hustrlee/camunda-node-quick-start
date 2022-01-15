var callerId = execution.getParentActivityInstanceId();
console.log("调用协作流程，CallerId:", callerId);

execution
  .getProcessEngineServices()
  .getRuntimeService()
  .createMessageCorrelation("msg-call-assist")
  .correlate();

console.log("完成调用");
