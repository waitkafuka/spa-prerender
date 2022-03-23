/**
 * @Author: zuokangsheng
 * @Date:   2021-11-08 11:52:34
 * @Last Modified by:   zuokangsheng
 * @Last Modified time: 2021-11-13 12:44:05
 */
 const fs = require('fs');
 const path = require('path');
 const mkdirp = require('mkdirp');
 const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer');
 const Prerenderer = require('@prerenderer/prerenderer');
 
 /**
  * refactor the code, add retry function and optimize the destroy logic.change it to promise, so it can function well when retrying.otherwise, many server and puppeteer instances will pending and stop the program to exit when retrying happened.
  */
 class SpaRenderer {
     constructor(options) {
         this._options = options || {};
         this._prerenderer = null;
     }
 
     /**
      * initial build puppeteer and express server
      * @returns 
      */
     async _buildRenderer () {
         const { staticDir, basePath, puppeteerOptions } = this._options;
         if (!staticDir) {
             console.error('please specify a static directory: staticDir');
             return;
         }
 
         if (basePath) {
             this._options.indexPath = path.join(staticDir, basePath, 'index.html');
         }
 
         const prerenderer = new Prerenderer({
             ...this._options,
             staticDir,
             renderer: new PuppeteerRenderer(puppeteerOptions)
         });
 
         await prerenderer.initialize();
         this._prerenderer = prerenderer;
         console.log('prerenderer initialize successfully, start render routes...');
     }
 
     // copy the spa-index.html for spa render
     _copyOriginIndexHtml (indexPath, staticDir) {
         if (indexPath) {
             if (!fs.existsSync(path.join(indexPath, '../', 'index-spa.html'))) {
                 fs.copyFileSync(indexPath, path.join(indexPath, '../', 'index-spa.html'));
             }
         } else {
             if (!fs.existsSync(path.join(staticDir, 'index-spa.html'))) {
                 fs.copyFileSync(path.join(staticDir, 'index.html'), path.join(staticDir, 'index-spa.html'));
             }
         }
     }
 
     /**
      *  render and save routes
      */
     async _renderRoutesAndSave () {
         const { staticDir, indexPath, routes } = this._options;
         const renderedRoutes = await this._prerenderer.renderRoutes(routes);
         console.log('render routes successfully');
 
         this._copyOriginIndexHtml(indexPath, staticDir);
 
         renderedRoutes.forEach(renderedRoute => {
             const outputDir = path.join(staticDir, renderedRoute.route);
             const outputFile = `${outputDir}/index.html`;
             const htmlContent = renderedRoute.html;
 
             mkdirp.sync(outputDir);
             fs.writeFileSync(outputFile, htmlContent);
         });
 
         console.log('files rendered and saved. render finished, shutdown the renderer');
         await this._destroy();
     }
 
     /**
      * destroy the express and puppeteer
      */
     async _destroy () {
         await this._shutdownExpress();
         console.log('express shutdown');
 
         await this._prerenderer._renderer._puppeteer.close();
         console.log('puppeteer shutdown');
     }
 
     /**
      * shutdown express , return promise so can determin the moment
      */
     _shutdownExpress () {
         return new Promise((resolve, reject) => {
             try {
                 this._prerenderer._server._nativeServer.close(() => {
                     resolve();
                 });
             } catch (error) {
                 reject(error);
             }
         });
     }
 
     /**
      * @param {*} options 
      * initial the enviroment, start render, save files. and then shutdown the express server and puppeteer.
      */
     async render (options) {
         try {
             await this._buildRenderer(options);
             // return;
             await this._renderRoutesAndSave();
         } catch (error) {
             console.error('an error occured while rendering: ', error);
             console.log('render retrying...');
             await this._destroy();
             await this.render(options);
         }
     }
 }
 
 module.exports = SpaRenderer;