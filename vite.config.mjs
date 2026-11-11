/*=========================================================================================
  Configuracion de Vite (Vue 2.7). Convive con Vue CLI durante la migracion:
  `npm run serve` / `npm run build` siguen usando vue.config.js; este archivo solo lo
  usan `npm run dev:vite`, `npm run build:vite` y `npm run preview:vite`.
==========================================================================================*/
import { defineConfig, loadEnv, normalizePath } from 'vite'
import vue2 from '@vitejs/plugin-vue2'
import { fileURLToPath } from 'node:url'
import tailwindcss from 'tailwindcss'
// autoprefixer 10 + postcss-rtl 2 (PostCSS 8) viven en tools/vite-postcss: en la raiz quedan
// las versiones de PostCSS 7 que necesita Vue CLI.
import postcss8 from 'vite-postcss-plugins'

const src = normalizePath(fileURLToPath(new URL('./src', import.meta.url)))
const nodeModules = normalizePath(fileURLToPath(new URL('./node_modules', import.meta.url)))

export default defineConfig(({ mode }) => {
    // Mismo .env que Vue CLI. El tercer argumento '' carga todas las variables en la config,
    // pero al navegador solo llegan las que se listan en `define`.
    const env = loadEnv(mode, process.cwd(), '')
    const prefijo = mode.toUpperCase() // DEVELOPMENT_* con `vite`, PRODUCTION_* con `vite build`
    // Igual que el DefinePlugin de vue.config.js: si falta la variable queda `undefined`
    const valor = (v) => (v === undefined ? 'undefined' : JSON.stringify(v))

    return {
        base: '/',
        plugins: [vue2()],
        resolve: {
            // 133 imports de .vue sin extension (85 archivos) que webpack resolvia solo
            extensions: ['.mjs', '.js', '.mts', '.ts', '.jsx', '.tsx', '.json', '.vue'],
            alias: [
                // vue-filepond importa 'vue/dist/vue.esm' (build completo, como en webpack). Va antes
                // del alias 'vue' que agrega @vitejs/plugin-vue2, que si no lo convierte en una ruta rota.
                { find: /^vue\/dist\/vue\.esm$/, replacement: 'vue/dist/vue.esm.js' },
                // `@import "~paquete/..."` en SCSS, sintaxis de webpack
                { find: /^~(?=[^/])/, replacement: '' },
                // mathlive no publica estos CSS en su campo "exports": webpack 4 lo ignora, Vite no
                { find: /^mathlive\/mathlive-(static|fonts)\.css$/, replacement: `${nodeModules}/mathlive/mathlive-$1.css` },
                { find: '@', replacement: src }
            ]
        },
        define: {
            'process.env.apiProlipa': valor(env[`${prefijo}_API_PROLIPA`]),
            'process.env.apiProlipaData': valor(env[`${prefijo}_API_PROLIPA_DATA`]),
            'process.env.socket': valor(env[`${prefijo}_SOCKET`]),
            'process.env.webSocketPort': valor(env.WEB_SOCKET_PORT || 6001),
            'process.env.wsKey': valor(env.ws_key || 'local'),
            'process.env.wsCluster': valor(env.ws_cluster || 'mt1'),
            'process.env.BASE_URL': valor('/'),
            'process.env.NODE_ENV': valor(mode === 'production' ? 'production' : 'development')
        },
        css: {
            // Config inline: Vite no lee postcss.config.js (ese es el de Vue CLI, con PostCSS 7)
            postcss: { plugins: [tailwindcss, postcss8.autoprefixer, postcss8.postcssRtl] },
            preprocessorOptions: {
                // `@import "vuexy/..."` es relativo a src/assets/scss
                scss: { loadPaths: [`${src}/assets/scss`] }
            }
        },
        optimizeDeps: {
            // Su entrada (src/main.js) importa un .vue: esbuild no puede pre-empaquetarlo
            exclude: ['vue-backtotop'],
            // vue-echarts/components/ECharts.vue es un .vue dentro de node_modules: Vite no escanea
            // sus imports y estos dos (CommonJS) llegaban sin convertir al navegador (E4, B1)
            include: ['lodash/debounce', 'echarts/lib/echarts']
        },
        // 8080 como Vue CLI: es el origen que el backend acepta (CORS / Sanctum)
        server: { port: 8080, strictPort: true },
        preview: { port: 8080, strictPort: true },
        build: {
            outDir: 'dist-vite',
            // Opcion B aprobada: Safari/iOS 14 como minimo (tablets de colegios)
            target: ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14'],
            // Vue CLI publica .map en produccion (productionSourceMap por defecto); se mantiene igual
            sourcemap: true
        }
    }
})
