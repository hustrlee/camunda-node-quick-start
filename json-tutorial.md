# 在 Camunda 中如何使用 JSON

JSON 是 Javascript 的基本数据类型（Object），而在 Java 中没有 JSON 这种数据类型。Camunda BPM 是基于 Java 开发的，因此用特殊的方式来处理 JSON。在 Camunda BPM 中，有两种 JSON 的处理方式：

- 将 JSON 映射成 `java.util.LinkedHashMap` 对象
- 引入 Spin plug-in 来处理 JSON 数据

> 下面的例子使用以下的 JSON 数据：
>
> ```javascript
> customer = {
>   name: "jonny",
>   address: {
>     street: "12 High Street",
>     postcode: 1234
>   }
> }
> ```



## 将 JSON 映射成 `java.util.LinkedHashMap` 对象

在调用 Camunda BPM REST-API 时，系统会自动将 JSON 映射成 `java.util.HashMap` 对象，无须做任何设置。例如：

```
variables: {
  customer: {
    value: {
      "name": "jonny",
      "address": {
        "street": "12 High Street",
        "postcode": 1234
      }
    }
  }
}
```



### 在 Expression 中使用 JSON 数据

在这种模式下，可以在 Expression 中直接使用 JSON。

```
${customer.address.postcode == 1234}
```

> Camunda BPM 中，Expression 通常用于计算分支条件，或者设置 `assignee` 等。



### 在 Script 中使用 JSON 数据

在这种模式下，可以在 Script 中直接使用 JSON。

```javascript
if (customer.address.postcode === 1234) {...}
```

> Camunda BPM 支持 Groovy、Javascript、Jython、JRuby 四种脚步语言，其中：Javascript 是 JRE 的一部分，开箱即用，无须配置。对于 Node 程序员来说，Javascript 自然是首选。
>
> Script 主要用于：Script Task、计算分支条件等。



### 存储（持久化）

数据库不直接支持 `java.util.LinkedHashMap`，因此在存储时必须进行 Serialize，而在读取时需要进行 Deserialize。`customer` 经过 Serialize 后的数据如下：

```
rO0ABXNyABdqYXZhLnV0aWwuTGlua2VkSGFzaE1hcDTATlwQbMD7AgABWgALYWNjZXNzT3JkZXJ4cgARamF2YS51dGlsLkhhc2hNYXAFB9rBwxZg0QMAAkYACmxvYWRGYWN0b3JJAAl0aHJlc2hvbGR4cD9AAAAAAAADdwgAAAAEAAAAAnQABG5hbWV0AAVqb25ueXQAB2FkZHJlc3NzcQB+AAA/QAAAAAAAA3cIAAAABAAAAAJ0AAZzdHJlZXR0AA4xMiBIaWdoIFN0cmVldHQACHBvc3Rjb2Rlc3IAEWphdmEubGFuZy5JbnRlZ2VyEuKgpPeBhzgCAAFJAAV2YWx1ZXhyABBqYXZhLmxhbmcuTnVtYmVyhqyVHQuU4IsCAAB4cAAABNJ4AHgA
```



### 优缺点

优点：

- 使用方便

缺点：

- 需进行 Serialize 和 Deserialize，占用存储空间，效率低。



## 引入 Spin plug-in 来处理 JSON 数据

Spin Plug-in 是用于处理 JSON 数据的类。它以字符串的形式保存 JSON 数据，以方便持久化；使用一组方法来解析字符串，模拟读写 JSON 字段。

在 Node 中，可以使用以下的方式：

```javascript
let customer = {
  name: "jonny",
  address: {
    street: "12 High Street",
    postcode: 1234
  }
};

let variables = {
  customer: {
    value: JSON.stringify(customer),
    type: "Json"
  }
}
```



### 在 Expression 中使用 JSON 数据

使用 S 类来访问 JSON 数据。

```
${customer.prop("address").prop("postcode").numberValue() == 1234}
```



### 在 Script 中使用 JSON 数据

使用 S 类来访问 JSON 数据。

```javascript
if (customer.prop("address").prop("postcode").numberValue() === 1234) {...}
```



### 存储（持久化）

数据库直接存储字符串。



### 常用的 Spin Method

| 功能                         | 方法                              | 备注                                                         |
| ---------------------------- | --------------------------------- | ------------------------------------------------------------ |
| 构造一个 Spin                | `S("{\"customer\": "\Kermit\"}")` |                                                              |
| 将 Spin 转换成字符串         | `customer.toString()`             | 假设 `customer` 已经是一个 `Json`                            |
| 读取 JSON 的字段             | `customer.prop("name").value()`   | `prop()` 方法的返回结果仍然是 `Json`，需要转换成基本数据类型 |
| 将 `Json` 字段转换成字符串   | `stringValue()`                   |                                                              |
| 将 `Json` 字段转换成数字型   | `numberValue()`                   |                                                              |
| 将 `Json` 字段转换成布尔型   | `boolValue()`                     |                                                              |
| 自行判断 `Json` 字段数据类型 | `value()`                         | 在 Javascript 中，使用该方法。                               |

完整的 `Json` 操作文档，参考官方文档：[Reading JSON](https://docs.camunda.org/manual/7.15/reference/spin/json/01-reading-json/)。

