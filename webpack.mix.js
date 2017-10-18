let mix = require('laravel-mix');
let SVGSpritemapPlugin = require('svg-spritemap-webpack-plugin');
/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/app.js', 'public/js')
   .js('resources/assets/js/admin.js', 'public/js')
   .sass('resources/assets/sass/app.scss', 'public/css');
   
   mix.browserSync("cms.dev");
   mix.sourceMaps();
   mix.version();
   mix.webpackConfig({
    plugins: [
        new SVGSpritemapPlugin({
           src: 'resources/assets/svg/*.svg',
           filename : '/images/sprite.svg',
           prefix : 'icon-',
           svgo : {removeTitle : true},
           svg4everybody: false
        })
    ] 
});