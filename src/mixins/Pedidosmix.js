
import Vue from 'vue'
import axios from 'axios'
export default {
    data() {
        return {
            myVariable: 10,
        }
    },
    methods: {
        //historico hospital
        async m_imprimirTodos(estiloSize = "12px", nombreArchivo = "documento", tamanoborde = "0px", textomarca_agua = '', orientacion = '') {

            // Crear el div para la notificación
            const notifyDiv = document.createElement('div');
            notifyDiv.style.position = 'fixed';
            notifyDiv.style.top = '50%';
            notifyDiv.style.left = '50%';
            notifyDiv.style.transform = 'translate(-50%, -50%)';
            notifyDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            notifyDiv.style.color = '#fff';
            notifyDiv.style.borderRadius = '5px';
            notifyDiv.style.padding = '20px';
            notifyDiv.style.zIndex = '99999999'; // Asegúrate de que esté por encima de otros elementos
            notifyDiv.style.display = 'flex';
            notifyDiv.style.alignItems = 'center';
            notifyDiv.style.justifyContent = 'center';
            notifyDiv.style.fontSize = '16px';
            notifyDiv.innerHTML = `
            <span style="margin-right: 10px;">⚠️</span>
            <span>Tiene documentos para impresión abiertos, ciérrelos para poder navegar en esta página.</span>
        `;

            // Añadir el div al body
            document.body.appendChild(notifyDiv);

            // Mostrar la notificación
            notifyDiv.style.display = 'block';

            // Ocultar la notificación después de 10 segundos
            setTimeout(() => {
                notifyDiv.style.display = 'none';
            }, 10000);

            const printContents = document.getElementById('seccionImprimir2').innerHTML;

            const htmlContent = `
        <html>
            <head>
                <title>${nombreArchivo}</title>
                <style>
                body {
                    font-family: Calibri, sans-serif;
                    font-size: ${estiloSize}; /* Tamaño de fuente para el body */
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: ${estiloSize}; /* Asegurarse de que la tabla también tenga el tamaño de fuente correcto */
                }
                th,
                td {
                    border: ${tamanoborde} solid #ddd;
                    padding: 3px;
                    font-size: ${estiloSize}; /* Tamaño de fuente para las celdas */
                }
                th {
                    text-align: left;
                    background-color: #f2f2f2;
                }
                .no-print {
                    display: none !important;
                }
                .visit-arrow {
                    display: none !important;
                }
                .watermark {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%) rotate(-45deg); /* Ajuste para la rotación diagonal */
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
                        transform: translate(-50%, -50%) rotate(-45deg); /* Ajuste para la rotación diagonal */
                        font-size: 5rem;
                        color: rgba(0, 0, 0, 0.1);
                        z-index: -1;
                        pointer-events: none;
                        user-select: none;
                        white-space: nowrap;
                        text-align: center;
                    }
                    /* Agregar la orientación basada en el parámetro */
                    @page {
                    size: ${orientacion ? orientacion : 'portrait'}; /* Usa "portrait" para vertical y "landscape" para horizontal */
                    margin: 10mm; /* Margen de la página */
                    }
                }
                </style>
            </head>
            <body>
                <div class="watermark">${textomarca_agua}</div>
                ${printContents}
            </body>
        </html>
        `;

            // Crear una nueva pestaña para imprimir
            const newWin = window.open('', '_blank');

            // Escribir el contenido HTML en la nueva pestaña
            newWin.document.write(htmlContent);
            newWin.document.close();

            // Esperar a que las imágenes se carguen
            const images = newWin.document.getElementsByTagName('img');
            const imageLoadPromises = Array.from(images).map(img => {
                return new Promise((resolve) => {
                    img.onload = resolve; // Resuelve la promesa cuando la imagen se carga
                    img.onerror = resolve; // Resuelve la promesa si hay un error en la carga
                });
            });

            // Esperar a que todas las imágenes se carguen
            Promise.all(imageLoadPromises).then(() => {

                newWin.focus();

                setTimeout(() => {
                    newWin.print();
                }, 200);

                newWin.onafterprint = () => {
                    if (!newWin.closed) {
                        newWin.close();
                    }
                };

            });

            // Monitorear cuando se cierra la pestaña de impresión
            let intervalId = setInterval(() => {
                if (newWin.closed) {
                    clearInterval(intervalId); // Detener la verificación cuando se cierre la pestaña
                    notifyDiv.style.display = 'none'; // Ocultar la notificación en la pestaña principal
                    document.body.removeChild(notifyDiv); // Eliminar el div de la notificación del DOM
                }
            }, 1000); // Verificar cada segundo si la pestaña está cerrada
        }
    },
};
