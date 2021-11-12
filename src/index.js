/**
 * @Author: zuokangsheng
 * @Date:   2021-11-08 11:52:34
 * @Last Modified by:   zuokangsheng
 * @Last Modified time: 2021-11-12 10:30:35
 */
 const fs = require('fs');
 const path = require('path');
 const mkdirp = require('mkdirp');
 const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer');
 const Prerenderer = require('@prerenderer/prerenderer');
 
 async function  render(options){
 
     const { staticDir, routes, puppeteerOptions } = options;
     if (!staticDir) {
         console.error('please specify a static directory: staticDir')
         return;
     }
 
     const prerenderer = new Prerenderer({
         staticDir,
         routes,
         renderer: new PuppeteerRenderer(puppeteerOptions)
     });
 
     try {
         await prerenderer.initialize();
 
         const renderedRoutes = await prerenderer.renderRoutes(routes);
 
         // copy the spa-index.html for spa render
         if(!fs.existsSync(path.join(staticDir, 'index-spa.html'))){
             fs.copyFileSync(path.join(staticDir, 'index.html'), path.join(staticDir, 'index-spa.html'));
         }
         
         renderedRoutes.forEach(renderedRoute => {
             const outputDir = path.join(staticDir, renderedRoute.route);
             const outputFile = `${outputDir}/index.html`;
             const htmlContent = renderedRoute.html;
 
             mkdirp.sync(outputDir);
             fs.writeFileSync(outputFile, htmlContent);
         });
         console.log('render finished, shut down the renderer');
         await prerenderer.destroy();
         process.exit(0);
     } catch (error) {
         console.log('an error occured: ',error);
         console.log('retrying...');
         await render(options);
     }
 }
 
 module.exports = render