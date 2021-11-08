/**
 * @Author: zuokangsheng
 * @Date:   2021-11-08 11:52:34
 * @Last Modified by:   zuokangsheng
 * @Last Modified time: 2021-11-08 15:58:21
 */
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer');
const Prerenderer = require('@prerenderer/prerenderer');

module.exports = function(options) {
    const { staticDir, routes, puppeteerOptions } = options;
    if (!staticDir) {
        console.error('请指定源文件夹路径: staticDir')
        return;
    }

    const prerenderer = new Prerenderer({
        staticDir,
        routes,
        renderer: new PuppeteerRenderer(puppeteerOptions)
    });

    // copy the spa-index.html for spa render
    const copyOriginIndexHtml = () => {
        fs.copyFileSync(path.join(staticDir, 'index.html'), path.join(staticDir, 'index-spa.html'));
    };

    // Initialize is separate from the constructor for flexibility of integration with build systems.
    return prerenderer.initialize()
        .then(() => {
            return prerenderer.renderRoutes(prerenderer._options.routes);
        })
        .then(async renderedRoutes => {
            // copy index.html to index-spa.html
            copyOriginIndexHtml();
            // {
            //   route: String (The route rendered)
            //   html: String (The resulting HTML)
            // }
            renderedRoutes.forEach(renderedRoute => {
                try {
                    const outputDir = path.join(staticDir, renderedRoute.route);
                    const outputFile = `${outputDir}/index.html`;
                    const htmlContent = renderedRoute.html;

                    mkdirp.sync(outputDir);
                    fs.writeFileSync(outputFile, htmlContent);
                } catch (e) {
                    console.error(e);
                    throw e;
                }
            });

            prerenderer.destroy();
        })
        .catch(err => {
            prerenderer.destroy();
            console.error(err);
            throw err;
        });
}