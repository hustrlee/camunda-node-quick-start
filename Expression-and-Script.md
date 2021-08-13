# 表达式和脚本

表达式和脚本在 Camunda BPM 中广泛应用于各种自动化任务。本文档描述了 Node 程序需要知道的表达式和脚本的相关信息。



## 支持什么样的表达式和脚本

### 表达式

Camunda BPM 支持“统一表达语言“（EL，Unified Expression Language）。EL 是 JSP 2.1 标准的一部分，请参考 [EL 官方文档](https://docs.oracle.com/javaee/5/tutorial/doc/bnahq.html)，特别是[官方文档示例](https://docs.oracle.com/javaee/5/tutorial/doc/bnahq.html#bnain)。



### 脚本

Camunda BPM 支持 Javascript、Groovy、JRuby 和 Jython 四种脚本语言。其中，Javascript 是 Java 标准的一部分，因此是开箱即用的，无须配置。其它三种脚本均需要通过配置才能开启。对 Node 程序员而言，Javascript 是最友好的。



## 访问变量

