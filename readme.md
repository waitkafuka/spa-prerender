### 介绍
可以将vue或者其他框架打包生成的 `dist` 目录作为输入，然后生成预渲染之后的html页面。生成的页面完全静态化，可以提升访问效率和SEO的友好。  
需要注意的是谷歌爬虫可以执行同步js然后抓取渲染后的页面，但是百度仍然不支持，因此国内需要百度抓取的，可以使用此技术。
### 使用示例
```javascript
const SpaRenderer = require('@waitkafuka/spa-prerender');
const path = require('path');

const options = {
  staticDir: path.join(__dirname, 'dist'),
  basePath: 'base',//可选，当项目有basePath的时候设置。同router中的base和publicPath。确保staticDir/basePath/index.html存在
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
wechat: zks_1927
