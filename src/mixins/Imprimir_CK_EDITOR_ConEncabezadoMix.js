// ════════════════════════════════════════════════════════════════════════════
// ReporteTHConEncabezadoMix.js
// Mixin de impresión para Talento Humano con CABECERA, PIE DE PÁGINA y MARCA DE AGUA.
// ════════════════════════════════════════════════════════════════════════════

const URL_CABECERA   = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_CABECERA_PRINCIPAL.png';
const URL_MARCA_AGUA = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_MARCA_AGUA.png';
const URL_PIE_PAGINA = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_PIE_PAGINA_PRINCIPAL.png';

const PAPER_EDGE_MM = 3;
const GAP_CABECERA_MM = 1;
const GAP_PIE_MM      = 1;

const CONTENT_MARGIN_LEFT_MM  = 25;
const CONTENT_MARGIN_RIGHT_MM = 20;

const MARCA_AGUA_OPACIDAD = 0.07;
const CABECERA_FALLBACK_MM = 28;
const PIE_FALLBACK_MM      = 22;

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

export default {
    methods: {
        /**
         * Abre una ventana de impresión de Talento Humano con cabecera, pie de página
         * y marcas de agua.
         */
        async m_imprimirTH(
            estiloSize      = '12px',
            nombreArchivo   = 'documento',
            textomarca_agua = '',
            orientacion     = 'portrait'
        ) {
            // ── Notificación flotante ───────────────────────────────────────
            const notifyDiv = document.createElement('div');
            notifyDiv.style.cssText = [
                'position:fixed','top:50%','left:50%',
                'transform:translate(-50%,-50%)',
                'background:rgba(0,0,0,0.8)','color:#fff',
                'border-radius:5px','padding:20px',
                'z-index:99999999','display:flex','align-items:center','justify-content:center',
                'font-size:16px','font-family:Calibri,sans-serif'
            ].join(';');
            notifyDiv.innerHTML = `
                <span style="margin-right:10px;">⚠️</span>
                <span>Tiene documentos para impresión abiertos, ciérrelos para poder navegar en esta página.</span>
            `;
            document.body.appendChild(notifyDiv);
            setTimeout(() => { notifyDiv.style.display = 'none'; }, 10000);

            // ── Dimensiones ──────────────────────────────────────────────────
            const PAGE_W_MM = (orientacion === 'landscape') ? 297 : 210;
            const pageSize  = orientacion || 'portrait';

            const [dimCab, dimPie] = await Promise.all([
                precargarImagen(URL_CABECERA,   CABECERA_FALLBACK_MM),
                precargarImagen(URL_PIE_PAGINA, PIE_FALLBACK_MM),
            ]);

            const cabHeightMM = parseFloat(alturaImagenMM(dimCab, PAGE_W_MM).toFixed(2));
            const pieHeightMM = parseFloat(alturaImagenMM(dimPie, PAGE_W_MM).toFixed(2));

            const cellPaddingLeftMM  = CONTENT_MARGIN_LEFT_MM  - PAPER_EDGE_MM;
            const cellPaddingRightMM = CONTENT_MARGIN_RIGHT_MM - PAPER_EDGE_MM;

            const printContents = document.getElementById('seccionImprimir2').innerHTML;

            const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>${nombreArchivo}</title>
    <style>
        * { box-sizing: border-box; }

        html, body {
            margin:  0;
            padding: 0;
            height:  auto !important;
            min-height: 0 !important;
            overflow: visible !important;
            font-family: Calibri, sans-serif;
            font-size: ${estiloSize};
            color: #333;
        }

        .no-print { display: none !important; }

        table.prolipa-layout {
            width:           100%;
            border-collapse: collapse;
            border:          none !important;
            margin:          0 !important;
            padding:         0 !important;
        }

        table.prolipa-layout > thead > tr > td.phd {
            height:      ${cabHeightMM}mm;
            min-height:  ${cabHeightMM}mm;
            padding:     0 !important;
            border:      none !important;
            line-height: 0;
        }

        table.prolipa-layout > tfoot > tr > td.pft {
            height:      ${pieHeightMM}mm;
            min-height:  ${pieHeightMM}mm;
            padding:     0 !important;
            border:      none !important;
            line-height: 0;
        }

        table.prolipa-layout > tbody > tr > td.pct {
            padding:        ${GAP_CABECERA_MM}mm ${cellPaddingRightMM}mm ${GAP_PIE_MM}mm ${cellPaddingLeftMM}mm;
            vertical-align: top;
            border:         none !important;
        }

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

        .doc-pie {
            position:    fixed;
            bottom:      0;
            left:        0;
            right:       0;
            height:      ${pieHeightMM}mm;
            z-index:     900;
            overflow:    hidden;
            line-height: 0;
        }
        .doc-pie img {
            width:   100%;
            height:  auto;
            display: block;
        }

        /* ══ NÚMERO DE PÁGINA ════════════════════════════════════════════
           Los .num-pagina-item se generan por JS en beforeprint.
           top en mm directo — sin conversión px que acumule error de escala.
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

        .doc-marca-agua-texto {
            position:       fixed;
            top:            50%;
            left:           50%;
            transform:      translate(-50%, -50%) rotate(-45deg);
            font-size:      7.5rem;
            color:          rgba(0, 0, 0, 0.1);
            z-index:        999;
            pointer-events: none;
            user-select:    none;
            white-space:    nowrap;
            text-align:     center;
            font-weight:    bold;
            text-transform: uppercase;
        }

        /* ── Estilos del Contenido del Memorando (Scoping a .pct) ── */
        table.prolipa-layout > tbody > tr > td.pct table {
            border-collapse: collapse;
            font-size: ${estiloSize};
        }

        table.prolipa-layout > tbody > tr > td.pct td, 
        table.prolipa-layout > tbody > tr > td.pct th {
            font-size: ${estiloSize};
            padding: 3px;
            vertical-align: middle;
        }

        table.prolipa-layout > tbody > tr > td.pct table[align="center"] {
            margin-left: auto;
            margin-right: auto;
            display: table;
        }
        table.prolipa-layout > tbody > tr > td.pct table[align="left"] {
            margin-left: 0;
            margin-right: auto;
        }
        table.prolipa-layout > tbody > tr > td.pct table[align="right"] {
            margin-left: auto;
            margin-right: 0;
        }

        table.prolipa-layout > tbody > tr > td.pct table[width="100%"] {
            width: 100%;
        }

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
            .doc-cabecera,
            .doc-pie,
            .doc-marca-agua,
            .doc-marca-agua-texto {
                display:    block !important;
                visibility: visible !important;
            }
            table.prolipa-layout,
            table.prolipa-layout > thead > tr > td,
            table.prolipa-layout > tfoot > tr > td,
            table.prolipa-layout > tbody > tr > td {
                border: none !important;
                outline: none !important;
            }
        }
    </style>
</head>
<body>

    <div class="doc-cabecera">
        <img src="${URL_CABECERA}" alt="Cabecera Prolipa" />
    </div>
    <div class="doc-pie">
        <img src="${URL_PIE_PAGINA}" alt="Pie de página Prolipa" />
    </div>
    <img class="doc-marca-agua" src="${URL_MARCA_AGUA}" alt="Marca de agua" />

    ${textomarca_agua ? `<div class="doc-marca-agua-texto">${textomarca_agua}</div>` : ''}

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

</body>
</html>`;

            const newWin = window.open('', '_blank');
            newWin.document.write(htmlContent);
            newWin.document.close();

            const images = newWin.document.getElementsByTagName('img');
            const imageLoadPromises = Array.from(images).map(img =>
                new Promise(resolve => {
                    img.onload = resolve;
                    img.onerror = resolve;
                })
            );

            Promise.all(imageLoadPromises).then(() => {
                try {
                    const scriptEl = newWin.document.createElement('script');
                    scriptEl.textContent = `
(function() {
    var PAPEL_ALT_MM  = ('${pageSize}' === 'landscape') ? (210 - 2 * ${PAPER_EDGE_MM}) : (297 - 2 * ${PAPER_EDGE_MM});
    var PAPEL_ANCH_MM = ('${pageSize}' === 'landscape') ? (297 - 2 * ${PAPER_EDGE_MM}) : (210 - 2 * ${PAPER_EDGE_MM});
    var PIE_ALT_MM    = ${pieHeightMM};

    function calcularYPonerNumeros() {
        var wrap = document.getElementById('num-pagina-wrap');
        if (!wrap) return;
        wrap.innerHTML = '';

        // Medir ancho del papel y 1mm en px usando un elemento de referencia
        var ref = document.createElement('div');
        ref.style.cssText = 'position:absolute;top:0;left:0;width:' + PAPEL_ANCH_MM + 'mm;height:1mm;visibility:hidden;pointer-events:none;';
        document.body.appendChild(ref);
        var refRect  = ref.getBoundingClientRect();
        var pxPorMm  = refRect.height;
        var papelAnchPx = refRect.width;
        document.body.removeChild(ref);

        // Forzar body al ancho del papel para medir altura real
        var s = document.body.style;
        var ow = s.width, omw = s.minWidth, oxw = s.maxWidth, oo = s.overflow;
        s.width    = papelAnchPx + 'px';
        s.minWidth = papelAnchPx + 'px';
        s.maxWidth = papelAnchPx + 'px';
        s.overflow = 'visible';
        var docAltPx = document.body.offsetHeight;
        s.width = ow; s.minWidth = omw; s.maxWidth = oxw; s.overflow = oo;

        var docAltMM  = docAltPx / pxPorMm;
        var totalPags = Math.max(1, Math.ceil(docAltMM / PAPEL_ALT_MM));

        var TEXTO_ALT_MM = 1.5;
        for (var i = 1; i <= totalPags; i++) {
            var topMM = (i * PAPEL_ALT_MM) - (PIE_ALT_MM / 2) - TEXTO_ALT_MM;
            var el = document.createElement('div');
            el.className   = 'num-pagina-item';
            el.style.top   = topMM + 'mm';
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
                newWin.onafterprint = () => {
                    if (!newWin.closed) newWin.close();
                };
            });

            const intervalId = setInterval(() => {
                if (newWin.closed) {
                    clearInterval(intervalId);
                    notifyDiv.style.display = 'none';
                    if (document.body.contains(notifyDiv)) document.body.removeChild(notifyDiv);
                }
            }, 1000);
        }
    }
};
