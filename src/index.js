/**
 * @Author: zuokangsheng
 * @Date:   2021-11-08 11:52:34
 * @Last Modified by:   zuokangsheng
 * @Last Modified time: 2021-11-11 13:44:42
 */
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const PuppeteerRenderer = require('@prerenderer/renderer-puppeteer');
const Prerenderer = require('@prerenderer/prerenderer');

module.exports = async function(options) {
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

    // copy the spa-index.html for spa render
    const copyOriginIndexHtml = () => {
        fs.copyFileSync(path.join(staticDir, 'index.html'), path.join(staticDir, 'index-spa.html'));
    };

    try {
        await prerenderer.initialize();
        const renderedRoutes = await prerenderer.renderRoutes(routes);
        copyOriginIndexHtml();
        renderedRoutes.forEach(renderedRoute => {
            const outputDir = path.join(staticDir, renderedRoute.route);
            const outputFile = `${outputDir}/index.html`;
            const htmlContent = renderedRoute.html;

            mkdirp.sync(outputDir);
            fs.writeFileSync(outputFile, htmlContent);
        });
        prerenderer.destroy();
    } catch (error) {
        prerenderer.destroy();
        console.error(error);
        throw error;
    }
}