/**
 * ReporteTH.mix.js
 * Mixin de impresión para reportes de Talento Humano.
 * Respeta los estilos inline generados por CKEditor (align, cellpadding,
 * background-color, white-space, etc.) sin pisarlos con reglas globales.
 */
export default {
    methods: {
        async m_imprimirTH(estiloSize = '12px', nombreArchivo = 'documento', textomarca_agua = '', orientacion = 'portrait') {

            // Notificación flotante mientras la ventana de impresión está abierta
            const notifyDiv = document.createElement('div')
            notifyDiv.style.cssText = `
                position:fixed; top:50%; left:50%;
                transform:translate(-50%,-50%);
                background:rgba(0,0,0,0.8); color:#fff;
                border-radius:5px; padding:20px;
                z-index:99999999; display:flex;
                align-items:center; justify-content:center;
                font-size:16px;
            `
            notifyDiv.innerHTML = `
                <span style="margin-right:10px;">⚠️</span>
                <span>Tiene documentos para impresión abiertos, ciérrelos para poder navegar en esta página.</span>
            `
            document.body.appendChild(notifyDiv)
            setTimeout(() => { notifyDiv.style.display = 'none' }, 10000)

            const printContents = document.getElementById('seccionImprimir2').innerHTML

            const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${nombreArchivo}</title>
    <style>
        body {
            font-family: Calibri, sans-serif;
            font-size: ${estiloSize};
            color: #333;
            margin: 0;
            padding: 0;
        }

        /* ── Estilos base que NO pisan los atributos inline de CKEditor ── */

        /* Las tablas mantienen su propio ancho si lo tienen definido */
        table {
            border-collapse: collapse;
            font-size: ${estiloSize};
        }

        /* Celdas: solo font-size y padding mínimo, sin border ni background forzados */
        td, th {
            font-size: ${estiloSize};
            padding: 3px;
            vertical-align: middle;
        }

        /* Respetar align="center" en tablas (atributo HTML presentacional) */
        table[align="center"] {
            margin-left: auto;
            margin-right: auto;
        }
        table[align="left"] {
            margin-left: 0;
            margin-right: auto;
        }
        table[align="right"] {
            margin-left: auto;
            margin-right: 0;
        }

        /* Respetar width="100%" en tablas */
        table[width="100%"] {
            width: 100%;
        }

        /* Marca de agua */
        .watermark {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 5rem;
            color: rgba(0, 0, 0, 0.1);
            z-index: -1;
            pointer-events: none;
            user-select: none;
            white-space: nowrap;
            text-align: center;
        }

        @media print {
            .watermark {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-45deg);
                font-size: 5rem;
                color: rgba(0, 0, 0, 0.1);
                z-index: -1;
                pointer-events: none;
                user-select: none;
                white-space: nowrap;
                text-align: center;
            }
            @page {
                size: ${orientacion};
                margin: 10mm;
            }
        }
    </style>
</head>
<body>
    <div class="watermark">${textomarca_agua}</div>
    ${printContents}
</body>
</html>`

            const newWin = window.open('', '_blank')
            newWin.document.write(htmlContent)
            newWin.document.close()

            // Esperar a que las imágenes se carguen antes de imprimir
            const images = newWin.document.getElementsByTagName('img')
            const imageLoadPromises = Array.from(images).map(img =>
                new Promise(resolve => {
                    img.onload = resolve
                    img.onerror = resolve
                })
            )

            Promise.all(imageLoadPromises).then(() => {
                newWin.focus()
                setTimeout(() => { newWin.print() }, 200)
                newWin.onafterprint = () => {
                    if (!newWin.closed) newWin.close()
                }
            })

            // Ocultar notificación cuando se cierre la ventana
            const intervalId = setInterval(() => {
                if (newWin.closed) {
                    clearInterval(intervalId)
                    notifyDiv.style.display = 'none'
                    document.body.removeChild(notifyDiv)
                }
            }, 1000)
        }
    }
}
