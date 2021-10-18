# 多实例活动（Multiple-Instance Activity）

多实例活动是为业务流程中的某个步骤定义重复的一种方式。在编程概念中，多实例匹配 `for each` 构造：它允许对给定集合中的每个项目依次或并行执行某个步骤甚至完整的子流程。

多实例是一个常规活动，它定义了额外的属性（所谓的 `multi-instance characteristics`），这将导致活动在运行时多次执行。以下活动可以成为多实例活动：

- 服务任务
- 发送任务
- 用户任务
- 业务规则任务
- 脚本任务
- 接收任务
- 手动任务
- 嵌入式子流程
- 调用活动
- 事务子流程

网关或事件不能成为多实例。

如果活动是多实例，则在活动底部用三条短线表示。三个垂直线表示实例将**并行**执行，而三个水平线表示**顺序**执行。

![](imgs/multiple-instance-mark.svg)

根据规范要求，流程引擎将创建以下的流程变量：

- `nrOfInstances`：实例的总数。
- `nrOfActiveInstances`：当前活动（即尚未完成）实例的数量。对于顺序执行多实例，这将始终为 1。
- `nrOfCompletedInstances`：已经完成的实例数。

可以通过调用 `execution.getVariable(x)` 方法来查询这些值。

> 这些值是 execution local variable，可以通过 `GET /execution/{id}/localVariables/{varName}` 来查询这些值。

另外，流程引擎将为每个执行实例创建以下的局部变量（即对其它的执行不可见，且不存储在流程实例级别）：

- `loopCounter`：指示特定实例在多实例循环中的索引。

