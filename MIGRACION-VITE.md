# Migración de Vue CLI + Webpack a Vite (Vue 2.7.16)

Rama de trabajo: `migracion-vite`. Vue CLI y Vite conviven durante la migración:

| Comando | Herramienta | Salida |
|---|---|---|
| `npm run serve` / `npm run build` | Vue CLI 3 + webpack 4 (sin cambios; lo usa el deploy a QA) | `dist/` |
| `npm run dev:vite` / `npm run build:vite` / `npm run preview:vite` | Vite 7.3.8 + `@vitejs/plugin-vue2` 2.3.4 | `dist-vite/` |

`npm run serve` y `npm run dev:vite` usan el mismo puerto (8080), así que se ejecutan de a uno.

## Decisiones

- **Vite 7.3.8**, no 8.x: `@vitejs/plugin-vue2` 2.3.4 solo declara compatibilidad hasta `vite ^7`. Vite 7 requiere Node `^20.19 || >=22.12`.
- **Navegadores (opción B):** `build.target = ['es2020', 'chrome87', 'edge88', 'firefox78', 'safari14']`, para no excluir tablets con iOS 14/15. Sin `@vitejs/plugin-legacy`.
- **PostCSS en paralelo:** Vue CLI usa PostCSS 7 (`postcss` 7.0.39, `autoprefixer` 9.8.8 y `postcss-rtl` 1.7.3 en la raíz). Vite usa PostCSS 8 con los plugins de `tools/vite-postcss` (`autoprefixer` 10.6.2, `postcss-rtl` 2.0.0, `postcss` 8.5.32), cargados inline desde `vite.config.mjs`. No pueden estar los dos en la raíz porque `postcss-rtl@1.7.3` usa `postcss` sin declararlo y falla con PostCSS 8 (`Cannot read properties of undefined (reading 'unprefixed')`).
- **`package.json` referencia `file:tools/vite-postcss`:** `package.json` y la carpeta `tools/` deben commitearse juntos; si no, `npm install` falla.
- **`index.html` de Vite en la raíz.** Vue CLI sigue usando `public/index.html`. Si se cambia uno, hay que cambiar el otro.

## Cambios de código para Vite (E3)

Todos funcionan igual con Vue CLI/webpack 4 y con Vite.

| Cambio | Archivos | Motivo |
|---|---|---|
| `require()` de imágenes estáticas → `import` | `src/store/state.js`, `src/views/docentes/chat/moduleChatState.js`, `src/components/upload/upload.vue`, `src/layouts/components/navbar/components/SearchBar.vue`, `src/layouts/components/navbar/components/I18n.vue`, `src/views/contenidos/editar.vue`, `src/views/contenidos/nuevo.vue`, `src/views/institucion/addlibro.vue`, `src/views/materialapoyo/material_subir/components/upload.vue`, `src/views/pedidos2/pedidos/cobranzas/components/RetencionUpload.vue`, `src/views/asesor/encuestas/EncuestaCertificadoProlipa.vue` | `require` no existe en el navegador con Vite |
| `require()` de imágenes dinámicas → mapa de `import` + método | `src/views/juegos/cartas.vue` (25 archivos de `src/assets/cartas`), `src/views/varios/Varios.vue` (5 de `enlaces/`) | Igual que el contexto de webpack; `import.meta.glob` no compila en webpack 4 |
| `require()` de CSS → `import` | `src/main.js` (iconfont) y 5 vistas con `vue-simple-calendar/static/css/default.css` (como último import, para conservar el orden del CSS) | Igual que arriba |
| `require('jquery')` → `import jQuery from 'jquery'` | `src/main.js` | Se mantiene `window.$ = window.jQuery` en la misma posición |
| `require('./gemaApi')` → `await import('./gemaApi')` | `src/services/gema/gemaSesion.js` | Con Vite fallaba en silencio (el `catch` lo ocultaba) |
| `require('file-saver')` → `import` | `src/views/codigos/combos/components/asignacion/CombosGeneradosImportAsignacionErrorNivel.vue` | Igual que arriba |
| `require('script-loader!file-saver')` → `import { saveAs } from 'file-saver'` | `src/vendor/Export2Excel.js` | Sintaxis exclusiva de webpack; además rompía el escaneo de dependencias de Vite (causa de los 504 y recargas en desarrollo) |
| `require.ensure` → `import().then()` | `src/views/salle/administrador/evaluaciones/PreguntasComponent.vue` | API exclusiva de webpack |
| `import()` con variable → import explícito | `src/views/temporadas/components/Pedidos/Descuentos/MenuDescuentos.vue` | Vite no resuelve imports variables a la propia carpeta (quedaba un 404 en producción) |
| Se quitan imports sin uso de módulos de Node | `src/views/admin/reporteria/material/ReporteTareas.vue` (`http`), `src/views/librosserie/series.vue` (`path`) | Rompían el build de Vite |
| `<template lang="html">` → `<template>` | 13 componentes de `admin/`, `nee_documentos/`, `asesor/planificaciones_agenda/`, `talento_humano/`, `pedidos2/pedidos/proforma/` y `pedidos2/pedidos/reportes/` | `@vitejs/plugin-vue2` busca un preprocesador "html"; vue-loader lo ignoraba |

Sin cambios en el código: los imports `.vue` sin extensión (los resuelve `resolve.extensions`), los CSS de mathlive (alias), los SCSS (`loadPaths` y alias `~`) y los usos de `process.env` (`define`).

## Pruebas funcionales y correcciones (E4)

Las pruebas de E4 ejecutan en el navegador cada módulo que sirve Vite (Chrome, Edge y Firefox), no solo su transformación. Así aparecieron fallos que el rastreo HTTP de E3 no detectaba. Correcciones autorizadas:

| Cambio | Archivos | Motivo |
|---|---|---|
| `optimizeDeps.include: ['lodash/debounce', 'echarts/lib/echarts']` | `vite.config.mjs` | `vue-echarts/components/ECharts.vue` es un `.vue` dentro de `node_modules`; Vite no escanea sus imports y estas dos dependencias CommonJS llegaban sin convertir al navegador (los gráficos no cargaban) |
| Se quita el import y el registro sin uso de `NotificationDropDown.vue` | `src/views/Home.vue` | Formaba un ciclo con `NotificationDropDown.vue`, que importa `Home.vue`. Con ESM nativo el ciclo lanza `Cannot access ... before initialization`; con webpack quedaba `undefined` en silencio. Home no usaba ese componente en su plantilla |
| `var pdfFonts = require ('pdfmake/build/vfs_fonts.js')` → `import pdfFonts from 'pdfmake/build/vfs_fonts.js'` | `Listado-docentes.vue`, `pdfdocente.vue`, `pdfinstitucion.vue`, `reporteestudiantebarra.vue` (en `src/views/institucion/reportes/components/`) y `src/views/librosserie/gestionliquidacion.vue` | El espacio en `require (` hizo que no se detectaran en E3 |
| `pdfMake.vfs = pdfFonts.pdfMake.vfs` → `pdfMake.vfs = pdfFonts.pdfMake ? pdfFonts.pdfMake.vfs : pdfFonts` | Los mismos 5 archivos | Ver "pdfmake" |

### pdfmake

**Causa (previa a la migración).** pdfmake 0.2.15 (2024-11-02) cambió el formato de `build/vfs_fonts.js`: hasta 0.2.14 hacía `this.pdfMake.vfs = {...}`, y desde 0.2.15 exporta las fuentes directamente (`module.exports = vfs`). `package.json` declara `"pdfmake": "^0.2.0"` y `package-lock.json` está en `.gitignore`, así que cada instalación resuelve la última 0.2.x (hoy 0.2.23, de 2026-01-11). Con ella, `pdfFonts.pdfMake` es `undefined` y la línea `pdfMake.vfs = pdfFonts.pdfMake.vfs` lanza `Cannot read properties of undefined (reading 'vfs')` al cargar el módulo, igual con Vue CLI que con Vite. Fallaban `/reporte/institucion/`, `/reporte/docente/listado`, `/reporte/estudiantes/listado` y `/facturadores/codigos`: la pantalla no llegaba a cargar.

**Solución.** Se mantiene pdfmake 0.2.23; no hace falta actualizarlo ni sustituirlo. La línea nueva acepta los dos formatos (anterior y posterior a 0.2.15), por lo que sigue funcionando aunque una instalación resuelva otra versión 0.2.x.

**Otros usos de pdfmake (sin cambios):**
- `AdminListaCapacitaciones.vue` y `AdminListaEncuestas.vue` (pantalla `/capacitaciones_prolipa_admin`) importan `* as pdfFonts` y solo asignan `pdfMake.vfs` si existe `pdfFonts.pdfMake`, cosa que con 0.2.23 nunca ocurre. Aun así generan PDF correctos: el build de pdfmake publica `window.pdfMake` y, al cargarse después, `vfs_fonts.js` registra las fuentes por su cuenta con `addVirtualFileSystem`.
- `MetricasGlobales.vue` usa el mismo patrón, pero ningún componente lo importa.
- `liquidacionCodigosBarras.vue` importa pdfmake sin usarlo: la descarga está comentada.
- `videos.vue` y `ticketCerrado.vue` solo tienen código comentado.

**Pruebas.** Se ejecutaron con los dev servers de Vite (8080) y de Vue CLI (`vue-cli-service serve --port 8081`), en Chrome y en Edge; no en Firefox. En cada caso, el arnés:
1. Carga el componente con el cargador lazy del router.
2. Genera el PDF:
   - En los 6 casos de los reportes y la liquidación llama al método real de PDF del componente, sin montarlo, con un `this` de prueba que incluye acentos y ñ.
   - En los 2 de capacitaciones, cuyos métodos piden datos al backend, genera un documento sintético con la misma instancia de pdfmake que configura el módulo.
3. Captura la descarga real de `.download()`.
4. Abre el archivo con PyMuPDF.

Resultado en las 4 combinaciones:
- Los 8 casos generan un PDF válido de una página, con Roboto incrustada (Regular, Medium e Italic), el texto completo con acentos, el logo y las tablas.
- En los 6 casos corregidos, `pdfMake.vfs` queda asignado con las fuentes.
- No hay errores de consola nuevos.
- Antes de la corrección fallaban esos mismos 6 casos en ambos bundlers.
- La carga de los 2449 módulos con Vite pasó de 8 fallos a 0.

Quedan pendientes:
- Probar el PDF sobre los builds de producción (E5).
- Probar en Firefox.
- Probar los métodos de capacitaciones con datos reales (requiere sesión).

**Recomendación (sin aplicar):** fijar la versión de pdfmake o versionar `package-lock.json`, para que QA no resuelva otra versión distinta a la probada.

### Rendimiento de la API en desarrollo (diagnóstico, sin cambios)

Las peticiones de 2-3 s con respuestas pequeñas no se deben a la red ni al bundler. Las causa el servidor de desarrollo de la API, que atiende las peticiones de una en una, y el frontend lo agrava con muchas peticiones simultáneas, cada una con su preflight. Fuentes: el HAR de un inicio de sesión real con Vite (admin, `idgrupo=1`) y mediciones con curl y Chrome sin sesión.

- **Servidor de un solo hilo (comprobado).**
  - La API local corre con `php -S 127.0.0.1:8000 server.php` (`php artisan serve`), que atiende las peticiones de una en una; en Windows no admite varios workers.
  - Con curl, 6 peticiones simultáneas terminan escalonadas (TTFB de 0,28 / 0,52 / 0,72 / 0,94 / 1,16 / 1,36 s) y tardan casi lo mismo que en secuencia (1,53 s frente a 1,85 s).
  - En el HAR, las 30 peticiones de la carga de Home terminan una tras otra, con una mediana de 269 ms entre cada una.
  - Una petición sola tarda unos 0,20 s (`sanctum/csrf-cookie`, sin base de datos) y entre 0,22 y 0,27 s con las consultas de `cant_preguntas`, `cant_juegos` o `menu`. La base de datos (10.10.3.201) está en la LAN a menos de 10 ms.
  - El retraso viene de la cola, no de cada petición: cant_preguntas, por ejemplo, esperó 7,7 s en cola y tuvo 3,2 s de TTFB.
- **Un preflight CORS por cada petición (comprobado).**
  - `axios.defaults.withXSRFToken = true` (anterior a la migración) añade `X-XSRF-TOKEN` a las peticiones hacia otro origen (8080 → 8000). Los 28 `OPTIONS` del HAR piden solo esa cabecera.
  - `config/cors.php` responde `Access-Control-Max-Age: 0`, así que no se guarda ningún preflight.
  - Resultado: 28 GET/POST y 28 OPTIONS pasan por el mismo único hilo, es decir, el doble de trabajo. Desde el clic en "Ingresar" hasta la última petición pasaron 18 s.
- **Esperas en el frontend (comprobado en el HAR y el código).**
  - `Main.vue` (`mounted`) hace `await` de `mixin_FormatoNewId()`, que pide `Gettablaconfiguracionparanuevoformato` con `$vs.loading()` a pantalla completa, antes de pedir el menú, el periodo, la institución activa, `userInfo`, los permisos y las configuraciones 9 y 10. En el HAR, esas peticiones salen 8,5 s más tarde que las de Home.
  - Ninguna de esas llamadas lee el resultado del mixin: solo lo usan otras pantallas, desde localStorage. Por tanto podrían lanzarse en paralelo sin alterar dependencias de datos, con un matiz: hoy, si esa petición falla, `mounted` se corta y no se cargan ni el menú ni los permisos.
- **Peticiones repetidas o inútiles.**
  - `permisos/{id}` se pide dos veces, desde `NotificationDropDown.vue` y desde `Main.vue`.
  - `verNotificacionPedidos?tipo=1` se pide dos veces, desde `NotificationDropDown.vue` y desde `screenNotificacion.vue`.
  - `screenNotificacion.vue` pide `mostrarMensajesPedido?id_pedido=undefined`.
  - `user` (al iniciar sesión) y `userInfo` (en `Main.vue`) devuelven el usuario autenticado con distinto contenido (1,5 KB y 2,7 KB), y `userInfo` ejecuta además `Cache::flush()` en el backend.
- **Probables, sin aislar.** El servidor tarda unos 0,2 s por petición, aunque sea trivial. Posibles causas: PHP 7.4.19 sin OPcache (`php_opcache.dll` existe pero no está cargado), la ausencia de `config:cache` y `route:cache` con un `routes/web.php` de 2775 líneas, y `APP_DEBUG=true`.
- **Red y navegador (descartados).** En el HAR, la conexión dura menos de 5 ms y la recepción menos de 8 ms. El tiempo `blocked` es la espera por el servidor. Solo curl tarda unos 0,2 s en conectar con `localhost` (frente a 1 ms con `127.0.0.1`), y Chrome no tiene ese problema.
- **Vite frente a Vue CLI.**
  - Sin sesión, las dos peticiones de la pantalla de login tienen TTFB del mismo orden con ambos (3 corridas), y Vite las lanza antes: entre 0,9 y 1,5 s tras la navegación, frente a 1,7-3,1 s con Vue CLI en desarrollo.
  - Las peticiones las define el código fuente, que es el mismo. Falta comparar el flujo con sesión en Vue CLI: solo hay HAR de Vite.

**Recomendaciones (sin aplicar, requieren autorización):**
- Backend y entorno de desarrollo:
  - Servir la API local con Apache/Nginx de Laragon en lugar de `php artisan serve`. Es la medida principal, porque elimina la cola.
  - Medir después el efecto de OPcache, `config:cache` y `route:cache`.
  - Quitar `Cache::flush()` de `userInfo`.
  - Subir `max_age` en `config/cors.php`. Ayuda poco, porque el preflight se guarda por URL: evita los repetidos, no los de la primera carga.
- Frontend:
  - Lanzar en paralelo las peticiones de `Main.vue` que no dependen del mixin, conservando el manejo de errores.
  - Eliminar los duplicados y la petición con `id_pedido=undefined`.

### Optimizaciones de frontend: lote 1 (O1 aplicado, O5 revertido)

Solo se cambió el frontend; el backend, las dependencias y el despliegue no se tocaron.

**O1 (aplicado).** En `src/main.js`, `axios.defaults.withXSRFToken` pasa de `true` a una función que devuelve `false` para GET y HEAD:
- Los GET dejan de enviar `X-XSRF-TOKEN` y, por tanto, de requerir un preflight `OPTIONS`.
- Las cookies de sesión se siguen enviando (`withCredentials`).
- POST, PUT, PATCH y DELETE conservan el token, que es lo único que verifica `VerifyCsrfToken`.

Verificación sin sesión (Vite en 8080, Chrome, antes y después):
- Los GET pasaron de 3 `OPTIONS` a 0, sin la cabecera y con la cookie de sesión.
- `POST /logout` como invitado responde 204, sin 419; el mismo POST forzado sin token responde 419.
- 6 GET en paralelo tardan 1,44-1,48 s, frente a 2,56-2,71 s antes (3 rondas). Está medido con el backend de desarrollo de un solo hilo; en producción el ahorro es una ida y vuelta por GET, sin medir.
- La carga de 2449 módulos no tiene fallos y solo muestra los errores preexistentes.

Queda pendiente verificar con sesión el login, los formularios reales, el logout y la ausencia de 419, usando los HAR por rol.

**O5 (revertido).** En `screenNotificacion.vue`, cambiar `if (this.datosEnviar)` por `if (this.datosEnviar && this.datosEnviar.id_pedido)` elimina la petición `mostrarMensajesPedido?id_pedido=undefined`, pero duplicaba el contador de mensajes no leídos de los grupos 11, 22 y 23:
- `NotificationDropDown.vue` escribe ese contador de dos formas: con `+=` en su propia petición (línea 621) y con `=` en el evento del hijo oculto (línea 535).
- Con O5, la respuesta del hijo llega primero y el total queda en 2N. Con datos de prueba (N = 5) el contador marcaba 10.
- Se revirtió: el archivo quedó idéntico al original y el contador vuelve a marcar 5.

La corrección propuesta añade un archivo (cambiar `+=` por `=` en `NotificationDropDown.vue:621`) y está pendiente de autorización.

## Hallazgos de seguridad (documentados, sin cambios en esta migración)

### xlsx 0.14.5

- Llega de forma transitiva por `tableexport@5.2.0` y la importa `src/vendor/Export2Excel.js` (`import XLSX from 'xlsx'`), que usan las exportaciones a Excel de muchas vistas. **No quitar `tableexport`** sin antes declarar `xlsx` explícitamente.
- Advisories que la afectan (npm audit, severidad alta):
  - Prototype Pollution — GHSA-4r6h-8v6p-xvw6 (CVE-2023-30533), corregido en 0.19.3.
  - ReDoS — GHSA-5pgg-2g8v-p4x9 (CVE-2024-22363), corregido en 0.20.2.
  - DoS en SheetJS Pro — GHSA-g973-978j-2c3p, GHSA-3x9f-74h4-2fqr, GHSA-8vcr-vxm8-293m, corregidos en 0.17.0.
- SheetJS dejó de publicar en npm: las versiones corregidas solo están en `https://cdn.sheetjs.com`. Actualizarla requiere analizar aparte la API que usa `Export2Excel.js` (`XLSX.SSF._table`, `XLSX.utils`, `XLSX.write`).
- Además `index.html` carga `xlsx@0.15.1` desde unpkg como global `XLSX`, también afectada.

### npm audit

| Momento | low | moderate | high | critical | total |
|---|---|---|---|---|---|
| Antes de la migración (E0) | 22 | 77 | 38 | 9 | 146 |
| Tras instalar Vite (E1) | 23 | 77 | 38 | 9 | 147 |

- La única entrada nueva es `@vitejs/plugin-vue2` (low), heredada de su peer `vue` 2.7 (Vue 2 está fuera de soporte). `vite` 7.3.8 no tiene hallazgos.
- Críticas actuales: `@vue/cli-service`, `ejs`, `form-data`, `html-webpack-plugin`, `jspdf` (directa), `loader-utils`, `request`, `webpack-bundle-analyzer`, `xmldom`. La mayoría son del toolchain de Vue CLI/webpack y desaparecen al retirarlo (fase final); `jspdf` es de runtime y requiere su propio análisis.
- Altas directas de runtime: `ag-grid-community`, `jspdf`, `tableexport`, `vue-apollo`, `vue-doc-preview`, `vue-html2pdf`.

## Otros hallazgos (previos a la migración, sin cambios)

- `src/views/salle/administrador/evaluaciones/PreguntasComponent.vue` (`exportarErroresExcel`) llama `export_json_to_excel(tHeader, data, nombre)` con argumentos posicionales, pero la función espera un objeto `{ header, data, filename }`: esa exportación ya fallaba antes de la migración.

- `src/views/pedidos/components/formato/FormatoPedidosModify.vue:234` usa `eval` (Rollup lo advierte).
- Algunas reglas con `/deep/` están en bloques `<style>` sin `scoped`, por lo que quedan literales en el CSS y el navegador las descarta (pasa igual con Vue CLI).
- `src/main.js` exporta `server` en la línea 362, pero `src/store/actions.js` lo importa y lo usa antes, desde `getUsuario` (`main.js:240`) y `getEmpresaPlataforma` (`App.vue:105`), por el ciclo `main.js` ↔ `store/actions.js`. Con Vite da `Cannot access 'server' before initialization`; con webpack `server` vale `undefined` y produce un 404 a `/undefinedempresa`. El efecto es el mismo.
- El WebSocket de Echo (`server1.prolipadigital.com.ec:6001`) no es alcanzable desde la red de desarrollo; la configuración es igual en Vite y en `vue.config.js`.
- `[vue-router] Duplicate named routes` (`digitallibro`, `digitaljuego`, `page-formulario`).
- `src/views/home/neet/NeetAsignados.vue` tiene un `@import url(...)` después de otras reglas: el navegador lo ignora.
- Sin sesión, `Main.vue` y la navbar se renderizan un instante con el usuario en `null` antes de redirigir (`Cannot read properties of null`).
- QA despliega en Apache con `public/.htaccess` (reescritura SPA, `index.html` sin caché, assets con `max-age=31536000, immutable`). El `Dockerfile` y `cloud_config/` no corresponden al despliegue actual.
