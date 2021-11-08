### 介绍
可以将vue或者其他框架生成的 `dist` 目录作为输入，然后生成预渲染之后的html页面。
### 使用示例
```javascript
const render = require('spa-prerender');
const path = require('path');

render({
  staticDir: path.join(__dirname, 'dist'),
  routes: ['/',
    '/exam',
    '/exam/chapters',
  ],
  puppeteerOptions: {
    headless: true,
    args: ['--single-process', '--no-sandbox'],
    //每次最多渲染的路由数量。避免内存不足引起的崩溃。在低端服务器上有用。
    maxConcurrentRoutes: 3,
    renderAfterDocumentEvent: 'render-event',
    skipThirdPartyRequests: true
  }
});
```
### 其他参数
其他可使用的参数请参考 https://github.com/JoshTheDerf/prerenderer 中文档的说明。
