# CamundaObject反序列化复盘

## 起因

在我们创建的并行外部服务任务（ServiceTask）的时候，BPMN图要求配置Collection和Element Variable两个字段，字段类型要求为array（Object）。注：[task-markers](https://docs.camunda.org/manual/latest/reference/bpmn20/tasks/task-markers/)。

反正根据规则，通过node.js调用RestAPI去创建ProcessInstance的，在传Variables中，Collection传的为json字符串通过JSON.parse()后的json对象，然后type类型不传，让系统补充为[object]。

```js
variables: {
                "images":{
                    "value":JSON.parse(images)
            	}
			}
```

但是也由此产生了一个问题，在ProcessVariables中，images保存的是序列化过的数据格式。

```js
images: 'rO0ABXNyABdqYXZhLnV0aWwuTGlua2VkSGFzaE1hcDTATlwQbMD7AgABWgALYWNjZXNzT3JkZXJ4cgARamF2YS51dGlsLkhhc2hNYXAFB9rBwxZg0QMAAkYACmxvYWRGYWN0b3JJAAl0aHJlc2hvbGR4cD9AAAAAAAAMdwgAAAAQAAAAA3QAAmlkdAADMTAydAAEbmFtZXQAGzU2YWM1MzhkN2Q0NjQucG5nX2ZvNzQyLmpwZ3QAA3VybHQAO2h0dHBzOi8vYW0uemRtaW1nLmNvbS8yMDE2MDEvMzAvNTZhYzUzOGQ3ZDQ2NC5wbmdfZm83NDIuanBneAA='
```

## 问题

上面的序列化问题对平常接口使用没什么影响，并行任务能正确创建，通过RestAPI的[Get Process Variable](https://docs.camunda.org/manual/latest/reference/rest/process-instance/variables/get-variable/)接口也能正常请求到属性的值，只是在参数上需要加上**deserializeValue=true**。但是当我们作为一个`ServiceTask`或者`Message Intermediate Throw Event`这种【ExternalTask】元素使用的时候，会调用Camunda官方提供的【[camunda-external-task-client-js](https://github.com/camunda/camunda-external-task-client-js/)】包，进行ExternalTask类任务的操作。

但是在使用过程中，发现task.variables.getAll()函数返回的对象中，“object”类对象值是序列化过的结果，并没有反序列化。而且官方文档中并没有查找到相关的反序列化参数。

## 过程

分析源码过程中，首先试图从网络请求部分解决，找到got的文件，在【__internal - EngineService.js】中，被封装成了request，并且进一步封装除了request.get() / request.post() 两个函数，入参都具有path参数。一开始想了个蠢办法，因为`deserializeValues`都是query段参数，所以尝试在这两个函数中增加判断，如果path中不包含【 **?** 】字符，则补充`deserializeValues=true`参数。

```js
if(path.indexOf('?')<0){
    path = path + "?deserializeValues=true";
}
```

由于绝大部分Camunda的RestAPI都不需要query带参，所以这个带参理论上是有效且不会造成额外坏影响的。但是很不幸，加了这个代码，并没有效果。

## 解决

最终定位到，**Task**的**Variables**在订阅成功的时候就已经获取到了，发现使用的是【[fetch and lock](https://docs.camunda.org/manual/latest/reference/rest/external-task/fetch/)】函数。反查源码，发现在EngineService.js中调用。

反查官方API中，【POST `/external-task/fetchAndLock`】的`topics`对象的入参包含了`deserializeValues`参数。

找到包源码中的`Client.js`对象实现的部分。

```js
    // collect topics that have subscriptions
    const topics = Object.entries(topicSubscriptions).map(
      ([
        topicName,
        {
          businessKey,
          lockDuration,
          variables,
          processDefinitionId,
          processDefinitionIdIn,
          processDefinitionKey,
          processDefinitionKeyIn,
          processDefinitionVersionTag,
          processVariables,
          tenantIdIn,
          withoutTenantId,
          localVariables
        }
      ]) => {
```

**发现入参中缺少了官方api的`deserializeValues`参数作为入参。**

最终解决方案是在参数列表中补充一个`deserializeValues`参数。

```js
          withoutTenantId,
          localVariables,
          deserializeValues
        }
      ]) => {
```

并且在下方补完判断参数。

```js
        if (!isUndefinedOrNull(deserializeValues)) {
          topic.deserializeValues = deserializeValues;
        }
```

完整代码：

```js
    // collect topics that have subscriptions
    const topics = Object.entries(topicSubscriptions).map(
      ([
        topicName,
        {
          businessKey,
          lockDuration,
          variables,
          processDefinitionId,
          processDefinitionIdIn,
          processDefinitionKey,
          processDefinitionKeyIn,
          processDefinitionVersionTag,
          processVariables,
          tenantIdIn,
          withoutTenantId,
          localVariables,
          deserializeValues
        }
      ]) => {
        let topic = { topicName, lockDuration };

        if (!isUndefinedOrNull(variables)) {
          topic.variables = variables;
        }

        if (!isUndefinedOrNull(businessKey)) {
          topic.businessKey = businessKey;
        }

        if (!isUndefinedOrNull(processDefinitionId)) {
          topic.processDefinitionId = processDefinitionId;
        }

        if (!isUndefinedOrNull(processDefinitionIdIn)) {
          topic.processDefinitionIdIn = processDefinitionIdIn;
        }

        if (!isUndefinedOrNull(processDefinitionKey)) {
          topic.processDefinitionKey = processDefinitionKey;
        }

        if (!isUndefinedOrNull(processDefinitionKeyIn)) {
          topic.processDefinitionKeyIn = processDefinitionKeyIn;
        }

        if (!isUndefinedOrNull(processDefinitionVersionTag)) {
          topic.processDefinitionVersionTag = processDefinitionVersionTag;
        }

        if (!isUndefinedOrNull(processVariables)) {
          topic.processVariables = processVariables;
        }

        if (!isUndefinedOrNull(tenantIdIn)) {
          topic.tenantIdIn = tenantIdIn;
        }

        if (!isUndefinedOrNull(withoutTenantId)) {
          topic.withoutTenantId = withoutTenantId;
        }

        if (!isUndefinedOrNull(localVariables)) {
          topic.localVariables = localVariables;
        }

        if (!isUndefinedOrNull(deserializeValues)) {
          topic.deserializeValues = deserializeValues;
        }

        return topic;
      }
    );
```

在这样修改过之后，只需要在订阅服务的时候，新增一个`deserializeValues:true`的参数就可以了。

```js
 client.subscribe("service-ptmt-single-task",{deserializeValues:true}, function ({ task, taskService }) {
     //doSomething...
 });
```



## 番外

### 为什么不使用RestAPI通过网络请求去获取？

在**service-task**创建的时候，如果已经订阅了事件，那么在收到订阅的时候，会触发马上请求RestAPI。但是，这个时候任务的相关对象并没有完全实现，部分任务数据库记录并没有存在，请求`/variable-instance?deserializeValues=true`的话，很容易就触发500错误，提示*`OptimisticLockingException`*或者*`*RestException*`*等各种奇奇怪怪的错误，必须加一个定时器，延后一定时间再执行（虽然这样也没法保证一定不出错。定时500ms ~ 2500ms，偶尔还是会报错，错误捕获还是必须手动写好）。但是由此引起的代码反复，增加回调，冗余，不好修改，性能低下，是不能接受的。

