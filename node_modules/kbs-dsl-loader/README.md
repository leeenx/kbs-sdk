# 简介

用于加载 dsl 的工具。目前主要加载 [kbs-dsl-maker](https://github.com/leeenx/kbs-dsl-maker) 产生的结果。

# 用法

```javascript
import dslLoad from 'kbs-dsl-loader';

async someMethod() {
  const dslJson = await dslLoad({
    url: 'http://localhost:9000/', // 输入「kbs-dsl-maker」脚手架产生成的路由
    fromHtml: true, // dslLoader 会自动解析找到 dsl 的 url
    watch: true, // 是否监听文件，开发环境建议开启
    watchOptions: {
      update: (dslJson) => {
        console.log('拿到最新的 dslJson:', dslJson);
      }
    }
  });
}
```

如果您不是使用 「kbs-dsl-maker」 产生的页面，那么「dslLoad」的入参 fromHtml 可以取 false, url 取 dsl 的最终地址即可。如下：
```javascript
async someMethod() {
  const dslJson = await dslLoad({
    url: 'url/of/dsl',
    fromHtml: false
  });
}
```
如果需要监听文件，必须保存 dsl 服务器上有 websocket 服务。前端调用如下：

```javascript
const dslJson = await dslLoad({
    url: 'url/of/dsl',
    fromHtml: false,
    watch: true,
    watchOptions: {
      host: '127.0.0.1', // websocket 的服务地址
      port: 9900, // websocket 服务的端口
      entry: 'index', // 监听的文件名
      update: (dslJson) => {
        console.log('拿到最新的 dslJson:', dslJson);
      }
    }
  });

```

websocket 发送的更新消息协议如下：

```javascript
JSON.stringify({
  entry: 'entryName',
  dslStr: JSON.stringify(dslJson)
});
```

dslLoader 是通过 entry 来区分是否需要通知更新。
