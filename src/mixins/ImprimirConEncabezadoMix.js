
// ════════════════════════════════════════════════════════════════════════════
// ImprimirConEncabezadoMix.js
// Mixin de impresión con CABECERA, PIE DE PÁGINA y MARCA DE AGUA (imágenes).
//
// ── Técnica (verificada en Chrome/Edge) ─────────────────────────────────────
//
//  El spec HTML de impresión garantiza que <thead> se repita al INICIO de
//  cada hoja y <tfoot> al FINAL de cada hoja.
//  Usamos una tabla de layout (invisible) que tiene:
//    • thead → celda vacía de la altura exacta de la cabecera
//    • tfoot → celda vacía de la altura exacta del pie
//    • tbody → todo el contenido del reporte (se expande libremente)
//
//  Sobre cada celda de thead/tfoot sobreponemos la imagen con position:fixed
//  (que también se repite en cada hoja) y exactamente del mismo tamaño.
//
// ── Numeración de páginas ────────────────────────────────────────────────────
//
//  Se usa CSS counter(page) / counter(pages) con un pseudo-elemento ::after
//  dentro del div .doc-pie (position:fixed → aparece en cada hoja).
//  Este es el único método 100% fiable: el navegador conoce el número de
//  página real en el momento de renderizar cada hoja de impresión.
//  NO se usa JS para calcular páginas (ese enfoque acumula desfases porque
//  offsetHeight en beforeprint refleja el layout de pantalla, no de impresión).
//
//  Resultado:
//  ┌──────────────── CADA HOJA ────────────────────────┐
//  │ ┌── CABECERA (imagen fixed) ───────────────────┐  │
//  │ │ thead reserva este espacio en todas las hojas│  │
//  │ └──────────────────────────────────────────────┘  │
//  │   (gap)                                           │
//  │   CONTENIDO (tbody — nunca toca cabecera/pie)     │
//  │   (gap)                                           │
//  │ ┌── PIE DE PÁGINA (imagen fixed) ─────────────┐  │
//  │ │ tfoot reserva este espacio · Pág. X / Y aquí│  │
//  │ └──────────────────────────────────────────────┘  │
//  └───────────────────────────────────────────────────┘
//
// ── CONFIGURACIÓN — solo toca esta sección si necesitas ajustar algo ─────────
// ════════════════════════════════════════════════════════════════════════════

// ── URLs de las imágenes corporativas ──────────────────────────────────────
const URL_CABECERA   = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_CABECERA_PRINCIPAL.png';
const URL_MARCA_AGUA = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_MARCA_AGUA.png';
const URL_PIE_PAGINA = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_PIE_PAGINA_PRINCIPAL.png';

// ── Margen mínimo de @page (solo seguridad física de la impresora) ─────────
const PAPER_EDGE_MM = 3;

// ── Espacio (gap) entre imagen y texto (mm) ────────────────────────────────
const GAP_CABECERA_MM = 1;
const GAP_PIE_MM      = 1;

// ── Márgenes laterales TOTALES del texto (mm, contando el @page de 3mm) ───
// El padding lateral de la celda de contenido = MARGIN - PAPER_EDGE.
const CONTENT_MARGIN_LEFT_MM  = 25;
const CONTENT_MARGIN_RIGHT_MM = 20;

// ── Opacidad de la marca de agua (0 = invisible · 1 = sólido) ─────────────
const MARCA_AGUA_OPACIDAD = 0.07;

// ── Alturas de respaldo si la imagen no carga ─────────────────────────────
const CABECERA_FALLBACK_MM = 28;
const PIE_FALLBACK_MM      = 22;
// ─────────────────────────────────────────────────────────────────────────────

function precargarImagen(src, fallbackMM) {
    return new Promise((resolve) => {
        const img   = new Image();
        img.onload  = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
        img.onerror = () => resolve({ w: 210, h: fallbackMM * 3.7795 });
        img.src     = src;
    });
}

function alturaImagenMM(dim, pageWidthMM) {
    if (!dim.w) return 0;
    return (dim.h / dim.w) * pageWidthMM;
}

// ─────────────────────────────────────────────────────────────────────────────

export default {
    data() { return { myVariable: 10 }; },

    methods: {
        /**
         * Abre una ventana de impresión con cabecera, pie de página y marca
         * de agua en CADA HOJA, completamente aislados del área de contenido.
         *
         * Misma firma que Pedidosmix.js — los componentes solo cambian el import.
         *
         * @param {string} estiloSize      Tamaño de fuente base, ej: "11px"
         * @param {string} nombreArchivo   Título del documento
         * @param {string} tamanoborde     Grosor borde de celdas, ej: "0px"
         * @param {string} textomarca_agua Reservado para compatibilidad
         * @param {string} orientacion     "portrait" | "landscape" | ""
         */
        async m_imprimirTodos(
            estiloSize      = '12px',
            nombreArchivo   = 'documento',
            tamanoborde     = '0px',
            textomarca_agua = '',
            orientacion     = ''
        ) {
            // ── Notificación ────────────────────────────────────────────────
            const notifyDiv = document.createElement('div');
            notifyDiv.style.cssText = [
                'position:fixed','top:50%','left:50%',
                'transform:translate(-50%,-50%)',
                'background:rgba(0,0,0,0.82)','color:#fff',
                'border-radius:6px','padding:20px 28px',
                'z-index:99999999','display:flex','align-items:center','gap:10px',
                'font-size:15px','font-family:Calibri,sans-serif',
                'box-shadow:0 4px 24px rgba(0,0,0,0.35)',
            ].join(';');
            notifyDiv.innerHTML = `
                <span style="font-size:22px;">⚠️</span>
                <span>Tiene documentos para impresión abiertos, ciérrelos para poder navegar en esta página.</span>
            `;
            document.body.appendChild(notifyDiv);
            setTimeout(() => { notifyDiv.style.display = 'none'; }, 10000);

            // ── Dimensiones reales de las imágenes ──────────────────────────
            const PAGE_W_MM = (orientacion === 'landscape') ? 297 : 210;
            const pageSize  = orientacion || 'portrait';

            const [dimCab, dimPie] = await Promise.all([
                precargarImagen(URL_CABECERA,   CABECERA_FALLBACK_MM),
                precargarImagen(URL_PIE_PAGINA, PIE_FALLBACK_MM),
            ]);

            // Altura exacta al 100% del ancho disponible (conserva proporciones)
            const cabHeightMM = parseFloat(alturaImagenMM(dimCab, PAGE_W_MM).toFixed(2));
            const pieHeightMM = parseFloat(alturaImagenMM(dimPie, PAGE_W_MM).toFixed(2));

            // Padding lateral de la celda de contenido
            // = margen total deseado MENOS el @page margin de 3mm
            const cellPaddingLeftMM  = CONTENT_MARGIN_LEFT_MM  - PAPER_EDGE_MM; // 22mm
            const cellPaddingRightMM = CONTENT_MARGIN_RIGHT_MM - PAPER_EDGE_MM; // 17mm

            // ── Contenido del reporte ────────────────────────────────────────
            const printContents = document.getElementById('seccionImprimir2').innerHTML;

            // ── HTML de impresión ────────────────────────────────────────────
            const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>${nombreArchivo}</title>
    <style>

        /* ── Reset base ─────────────────────────────────────────────── */
        * { box-sizing: border-box; }

        html, body {
            margin:  0;
            padding: 0;
            height:  auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            font-family: Calibri, sans-serif;
            font-size: ${estiloSize};
        }

        .no-print { display: none !important; }

        /* ══ TABLA DE LAYOUT ═════════════════════════════════════════════
           Invisible — solo sirve para garantizar que thead y tfoot
           aparezcan en CADA HOJA (comportamiento estándar en Chrome).
           ════════════════════════════════════════════════════════════════ */
        table.prolipa-layout {
            width:           100%;
            border-collapse: collapse;
            border:          none !important;
        }

        /* Celda de cabecera: altura = imagen de cabecera exacta */
        table.prolipa-layout > thead > tr > td.phd {
            height:      ${cabHeightMM}mm;
            min-height:  ${cabHeightMM}mm;
            padding:     0;
            border:      none !important;
            line-height: 0;
            /* Contenido vacío — la imagen fixed lo cubre */
        }

        /* Celda de pie: altura = imagen de pie exacta */
        table.prolipa-layout > tfoot > tr > td.pft {
            height:      ${pieHeightMM}mm;
            min-height:  ${pieHeightMM}mm;
            padding:     0;
            border:      none !important;
            line-height: 0;
        }

        /* Celda de contenido: márgenes del texto del reporte */
        table.prolipa-layout > tbody > tr > td.pct {
            padding:        ${GAP_CABECERA_MM}mm ${cellPaddingRightMM}mm ${GAP_PIE_MM}mm ${cellPaddingLeftMM}mm;
            vertical-align: top;
            border:         none !important;
        }

        /* ══ CABECERA (imagen) ═══════════════════════════════════════════
           position:fixed → repite en la parte superior de CADA hoja.
           Solapa exactamente la celda thead vacía.
           top:0 left:0 right:0 → coincide con el área de contenido del @page.
           width:100% height:auto → sin estirado, proporciones naturales.
           ════════════════════════════════════════════════════════════════ */
        .doc-cabecera {
            position:    fixed;
            top:         0;
            left:        0;
            right:       0;
            height:      ${cabHeightMM}mm;
            z-index:     900;
            overflow:    hidden;
            line-height: 0;
        }
        .doc-cabecera img {
            width:   100%;
            height:  auto;
            display: block;
        }

        /* ══ PIE DE PÁGINA (imagen) ══════════════════════════════════════
           Simétrico a la cabecera, solapa la celda tfoot vacía.
           ════════════════════════════════════════════════════════════════ */
        .doc-pie {
            position:    fixed;
            bottom:      0;
            left:        0;
            right:       0;
            height:      ${pieHeightMM}mm;
            z-index:     900;
            overflow:    hidden;
            line-height: 0;
            /* Necesario para que position:absolute de hijos funcione */
            position:    fixed;
        }
        .doc-pie img {
            width:   100%;
            height:  auto;
            display: block;
        }
        /* ══ NÚMERO DE PÁGINA ════════════════════════════════════════════
           Los .num-pagina-item se generan por JS en beforeprint.
           position:absolute dentro de #num-pagina-wrap (position:absolute
           desde top:0 del documento). Un div por hoja, con top en mm
           calculado directamente — sin conversión px que acumule error.
           ════════════════════════════════════════════════════════════════ */
        #num-pagina-wrap {
            position:       absolute;
            top:            0;
            left:           0;
            width:          100%;
            height:         0;
            pointer-events: none;
        }
        .num-pagina-item {
            position:    absolute;
            right:       ${cellPaddingRightMM + PAPER_EDGE_MM}mm;
            font-family: Calibri, Arial, sans-serif;
            font-size:   8.5pt;
            font-weight: bold;
            color:       #333;
            z-index:     1000;
            white-space: nowrap;
            line-height: 1;
        }
        @media screen {
            #num-pagina-wrap { display: none; }
        }

        /* ══ MARCA DE AGUA ══════════════════════════════════════════════ */
        .doc-marca-agua {
            position:       fixed;
            top:            50%;
            left:           50%;
            transform:      translate(-50%, -50%);
            width:          72%;
            height:         auto;
            opacity:        ${MARCA_AGUA_OPACIDAD};
            z-index:        -1;
            pointer-events: none;
            user-select:    none;
        }

        /* ══ MARCA DE AGUA (Texto, ej: ANULADO) ═════════════════════════ */
        .doc-marca-agua-texto {
            position:       fixed;
            top:            50%;
            left:           50%;
            transform:      translate(-50%, -50%) rotate(-45deg);
            font-size:      7.5rem;
            color:          rgba(0, 0, 0, 0.1); /* Gris suave translúcido */
            z-index:        999; /* Se sobrepone al texto para garantizar lectura pero con gran transparencia */
            pointer-events: none;
            user-select:    none;
            white-space:    nowrap;
            text-align:     center;
            font-weight:    bold;
            text-transform: uppercase;
        }

        /* ══ Estilos para las tablas del CONTENIDO ══════════════════════
           Se aplican solo a las tablas dentro de la celda de contenido,
           no a la tabla de layout.
           ════════════════════════════════════════════════════════════════ */
        table.prolipa-layout > tbody > tr > td.pct table {
            width: 100%;
            border-collapse: collapse;
            font-size: ${estiloSize};
        }
        table.prolipa-layout > tbody > tr > td.pct th,
        table.prolipa-layout > tbody > tr > td.pct td {
            border:    ${tamanoborde} solid #ddd;
            padding:   3px;
            font-size: ${estiloSize};
        }
        table.prolipa-layout > tbody > tr > td.pct th {
            text-align:       left;
            background-color: #f2f2f2;
        }

        @media print {
            .doc-cabecera,
            .doc-pie,
            .doc-marca-agua,
            .doc-marca-agua-texto {
                display:    block !important;
                visibility: visible !important;
            }
        }

    </style>
</head>
<body>

    <!-- ══ Imágenes fixed — sobrelapan thead/tfoot en cada hoja ══ -->
    <div class="doc-cabecera">
        <img src="${URL_CABECERA}" alt="Cabecera Prolipa" />
    </div>
    <div class="doc-pie">
        <img src="${URL_PIE_PAGINA}" alt="Pie de página Prolipa" />
    </div>
    <img class="doc-marca-agua" src="${URL_MARCA_AGUA}" alt="Marca de agua" />

    <!-- Marca de agua de texto (opcional, ej: ANULADO) -->
    ${textomarca_agua ? `<div class="doc-marca-agua-texto">${textomarca_agua}</div>` : ''}

    <!-- ══ Tabla de layout ══
         thead y tfoot repiten en CADA HOJA según el spec HTML de impresión.
         Las celdas están vacías — las imágenes fixed las cubren visualmente.
         El contenido va en tbody y nunca invade las zonas de cabecera/pie. ══ -->
    <table class="prolipa-layout">
        <thead>
            <tr><td class="phd"></td></tr>
        </thead>
        <tfoot>
            <tr><td class="pft"></td></tr>
        </tfoot>
        <tbody>
            <tr>
                <td class="pct">
                    ${printContents}
                </td>
            </tr>
        </tbody>
    </table>

    <!-- ══ Contenedor de números de página (llenado por JS en beforeprint) ══ -->
    <div id="num-pagina-wrap"></div>

    <!--
        OVERRIDE FINAL: al final del body gana en cascada CSS.
        @page margin:${PAPER_EDGE_MM}mm → solo seguridad de impresora.
        Los márgenes del texto los controla el padding de .pct.
        El componente .vue NO debe definir @page margin-top/bottom.
    -->
    <style>
        @media print {
            html, body {
                height: auto !important;
                min-height: 0 !important;
                overflow: visible !important;
            }
            @page {
                size:   ${pageSize};
                margin: ${PAPER_EDGE_MM}mm;
            }
            /* Asegurar que la tabla de layout no tenga bordes en print */
            table.prolipa-layout,
            table.prolipa-layout > thead > tr > td,
            table.prolipa-layout > tfoot > tr > td,
            table.prolipa-layout > tbody > tr > td {
                border: none !important;
                outline: none !important;
            }
        }
    </style>

</body>
</html>`;

            // ── Abrir nueva pestaña e imprimir ────────────────────────────────
            const newWin = window.open('', '_blank');
            newWin.document.write(htmlContent);
            newWin.document.close();

            // Esperar que carguen todas las imágenes antes de imprimir
            const allImages    = Array.from(newWin.document.getElementsByTagName('img'));
            const loadPromises = allImages.map(img =>
                new Promise(resolve => { img.onload = resolve; img.onerror = resolve; })
            );

            Promise.all(loadPromises).then(() => {
                // ── Script de numeración inyectado en la ventana de impresión ──
                // Se ejecuta en beforeprint. La estrategia correcta:
                //
                // 1. Forzar el body al ancho EXACTO del papel (sin márgenes @page)
                //    para que offsetHeight refleje la altura real de impresión.
                // 2. Calcular cuántas páginas hay: ceil(alturaDoc / alturaHoja).
                // 3. Para cada página i (base-1), el número debe aparecer dentro
                //    del área del pie. El área del pie ocupa la banda inferior de
                //    cada hoja, desde (alturaHoja - pieAlturaPx) hasta alturaHoja.
                //    Centramos el texto en esa banda:
                //      topPx = (i-1)*alturaHoja + alturaHoja - (pieAlturaPx/2)
                //    Es decir: fondo de la hoja anterior + altura hoja - mitad del pie.
                //
                // El desfase que tenía la versión anterior venía de usar
                //   topPx = i * papelAltPx - offsetInfPx
                // que posiciona respecto al fondo de la hoja i, pero como
                // offsetHeight es el layout de pantalla (más corto que el de
                // impresión), totalPags quedaba subestimado y las posiciones
                // se iban corriendo hacia arriba conforme avanzaban las páginas.
                try {
                    const scriptEl = newWin.document.createElement('script');
                    scriptEl.textContent = `
(function() {

    // ── Estrategia: trabajar en mm, no en px ─────────────────────────────
    //
    // El desfase anterior venía de convertir mm→px con getBoundingClientRect,
    // que usa la escala de pantalla (96dpi), distinta a la escala interna
    // del motor de impresión de Chrome. El error era pequeño por hoja pero
    // se acumulaba → el número subía progresivamente.
    //
    // Solución: medir la altura del documento directamente en mm usando un
    // elemento de referencia de 1mm de altura. Así la relación es 1:1 y no
    // hay acumulación de error de escala.
    //
    // Para la posición top de cada número usamos CSS mm directamente
    // (el.style.top = X + 'mm'), lo que el navegador renderiza en la escala
    // correcta de impresión sin ninguna conversión nuestra.

    var PAPEL_ALT_MM  = ('${pageSize}' === 'landscape') ? (210 - 2 * ${PAPER_EDGE_MM}) : (297 - 2 * ${PAPER_EDGE_MM});
    var PAPEL_ANCH_MM = ('${pageSize}' === 'landscape') ? (297 - 2 * ${PAPER_EDGE_MM}) : (210 - 2 * ${PAPER_EDGE_MM});
    var PIE_ALT_MM    = ${pieHeightMM};

    function calcularYPonerNumeros() {
        var wrap = document.getElementById('num-pagina-wrap');
        if (!wrap) return;
        wrap.innerHTML = '';

        // ── Forzar body al ancho del papel para medir altura en mm ───────
        // Usamos un elemento de referencia de 1mm para convertir la altura
        // del body (en px) a mm de forma proporcional — sin asumir 96dpi.
        var ref = document.createElement('div');
        ref.style.cssText = 'position:absolute;top:0;left:0;width:' + PAPEL_ANCH_MM + 'mm;height:1mm;visibility:hidden;pointer-events:none;';
        document.body.appendChild(ref);
        var refRect = ref.getBoundingClientRect();
        var pxPorMm = refRect.height; // altura de 1mm en px según este layout
        var papelAnchPx = refRect.width;
        document.body.removeChild(ref);

        // Forzar el ancho del body al ancho del papel y medir
        var s = document.body.style;
        var ow = s.width, omw = s.minWidth, oxw = s.maxWidth, oo = s.overflow;
        s.width    = papelAnchPx + 'px';
        s.minWidth = papelAnchPx + 'px';
        s.maxWidth = papelAnchPx + 'px';
        s.overflow = 'visible';
        var docAltPx = document.body.offsetHeight;
        s.width = ow; s.minWidth = omw; s.maxWidth = oxw; s.overflow = oo;

        // Convertir altura del doc a mm usando la misma referencia
        var docAltMM = docAltPx / pxPorMm;

        // ── Total de páginas ──────────────────────────────────────────────
        var totalPags = Math.max(1, Math.ceil(docAltMM / PAPEL_ALT_MM));

        // ── Posicionar un div por página ──────────────────────────────────
        // Todo en mm — el navegador aplica la escala de impresión correcta.
        //
        //  Para hoja i (1-based):
        //    bottom de la hoja = i * PAPEL_ALT_MM  (en mm desde top del doc)
        //    centro del pie    = bottom - PIE_ALT_MM/2
        //    ajuste texto      = ~2mm (mitad de 8.5pt ≈ 3mm)
        //
        var TEXTO_ALT_MM = 1.5;
        for (var i = 1; i <= totalPags; i++) {
            var topMM = (i * PAPEL_ALT_MM) - (PIE_ALT_MM / 2) - TEXTO_ALT_MM;
            var el = document.createElement('div');
            el.className   = 'num-pagina-item';
            el.style.top   = topMM + 'mm';   // ← mm directo, sin conversión px
            // el.textContent = 'Pág. ' + i + ' / ' + totalPags;
            el.textContent = 'Pág. ' + i;
            wrap.appendChild(el);
        }
    }

    window.addEventListener('beforeprint', calcularYPonerNumeros);

    if (window.matchMedia) {
        var mq = window.matchMedia('print');
        var h = function(e) { if (e.matches) calcularYPonerNumeros(); };
        if (mq.addEventListener) mq.addEventListener('change', h);
        else if (mq.addListener) mq.addListener(h);
    }
})();
                    `;
                    newWin.document.head.appendChild(scriptEl);
                } catch(e) {
                    console.warn('No se pudo inyectar script de paginación:', e);
                }

                newWin.focus();
                setTimeout(() => { newWin.print(); }, 400);
                newWin.onafterprint = () => { if (!newWin.closed) newWin.close(); };
            });

            // Limpiar notificación cuando se cierre la pestaña
            const intervalId = setInterval(() => {
                if (newWin.closed) {
                    clearInterval(intervalId);
                    notifyDiv.style.display = 'none';
                    if (document.body.contains(notifyDiv)) document.body.removeChild(notifyDiv);
                }
            }, 1000);
        },
    },
};
