### 介绍
可以将vue或者其他框架生成的 `dist` 目录作为输入，然后生成预渲染之后的html页面。
### 使用示例
```javascript
const SpaRenderer = require('@waitkafuka/spa-prerender');
const path = require('path');

const options = {
  staticDir: path.join(__dirname, 'dist'),
  routes: ['/',
    '/exam',
  ],
  puppeteerOptions: {
    headless: true,
    maxConcurrentRoutes: 0,
    renderAfterDocumentEvent: 'render-event',
    skipThirdPartyRequests: true
  }
};
const spaRenderer = new SpaRenderer(options)
return spaRenderer.render().then(() => {
  console.log('预渲染完毕。');
});
```
### 其他参数
其他可使用的参数请参考 https://github.com/JoshTheDerf/prerenderer 中文档的说明。

### contact
zhen0578@qq.com  
wechat:zks_1927
