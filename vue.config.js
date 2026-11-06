/*=========================================================================================
  File Name: vue.config.js
  Description: configuration file of vue
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/
const webpack = require('webpack');

module.exports = {
    publicPath: '/',
    transpileDependencies: [
        'vue-echarts',
        'resize-detector'
    ],
    chainWebpack: config => {
        // Vue CLI agrega por defecto un <link rel="prefetch"> en el index.html
        // por CADA chunk generado con import() dinamico. Como el router tiene
        // cientos de vistas lazy, esto generaba ~1700 prefetch al arrancar,
        // haciendo que el navegador descargue TODAS las vistas de la app en
        // segundo plano aunque el usuario nunca las visite. Se desactiva para
        // que cada chunk se pida solo cuando el usuario navega a esa vista.
        config.plugins.delete('prefetch')
    },
    configureWebpack: {
        optimization: {
            // Antes esto era solo `{ chunks: 'all' }`, sin agrupar nada: cada modulo
            // importado dinamicamente (cada vista lazy del router, que son cientos)
            // termina siendo un chunk .js suelto, y el navegador tiene que pedirlos
            // uno por uno. Con estos "cacheGroups" el codigo de node_modules se junta
            // en un solo `chunk-vendors` y el codigo compartido entre varias vistas en
            // `chunk-common`, asi que el arranque pide muchos menos archivos.
            splitChunks: {
                chunks: 'all',
                cacheGroups: {
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'chunk-vendors',
                        chunks: 'all',
                        priority: -10
                    },
                    common: {
                        name: 'chunk-common',
                        minChunks: 2,
                        priority: -20,
                        chunks: 'all',
                        reuseExistingChunk: true
                    }
                }
            }
        },
        plugins: [
            new webpack.DefinePlugin({
                // allow access to process.env from within the vue app
                'process.env': {
                    apiProlipa: JSON.stringify(process.env[`${process.env.NODE_ENV.toUpperCase()}_API_PROLIPA`]),
                    apiProlipaData: JSON.stringify(process.env[`${process.env.NODE_ENV.toUpperCase()}_API_PROLIPA_DATA`]),
                    apiStrapi: JSON.stringify(process.env[`${process.env.NODE_ENV.toUpperCase()}_API_STRAPI`]),
                    socket: JSON.stringify(process.env[`${process.env.NODE_ENV.toUpperCase()}_SOCKET`]),
                    webSocketPort: JSON.stringify(process.env.WEB_SOCKET_PORT || 6001),
                    wsKey: JSON.stringify(process.env.ws_key || 'local'),
                    wsCluster: JSON.stringify(process.env.ws_cluster || 'mt1'),
                }
            })
        ]
    },
    // devServer: {
    //   overlay: {
    //     warnings: true,
    //     errors: true
    //   }
    // }
}