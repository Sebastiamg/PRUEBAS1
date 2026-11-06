<template>
    <div>
        <!-- Botones de acción -->
        <div align="center" class="no-print mb-4">
            <vs-button @click="imprimirPDF" icon="print" color="primary">
                Imprimir
            </vs-button>
        </div>

        <!-- Contenido del PDF -->
        <div id="seccionImprimirFO" class="contenido-impresion">
            
            <div class="header-outside">
                <div style="width: 150px; text-align: center;">
                    <img v-if="img" :src="img" style="width: 120px;">
                </div>
                <div class="title-container">
                    <h2 class="main-title">FACTURA OPERATIVA</h2>
                    <h3 class="doc-code">{{ factura.ven_codigo }}</h3>
                </div>
            </div>

            <table class="content-table">
                <tr>
                    <td class="label-cell">CLIENTE:</td>
                    <td class="value-cell">{{ datosCliente.razonsocial }}</td>
                </tr>
                <tr>
                    <td class="label-cell">RUC:</td>
                    <td class="value-cell">{{ datosCliente.identificacion }}</td>
                </tr>
                <!-- <tr>
                    <td class="label-cell" style="width: 150px;">INSTITUCION:</td>
                    <td class="value-cell">{{ institucionNombre }}</td>
                </tr> -->
                <tr>
                    <td class="label-cell">DIRECCION:</td>
                    <td class="value-cell">{{ datosCliente.direccion || '' }}</td>
                </tr>
                <tr>
                    <td class="label-cell">TELEFONO:</td>
                    <td class="value-cell">{{ telefonos }}</td>
                </tr>
                <tr>
                    <td class="label-cell">CÓDIGO:</td>
                    <td class="value-cell">{{ factura.ven_codigo }}</td>
                </tr>
            </table>

            <div class="footer-container">
                <div class="observation-box">
                    <div class="total-label">OBSERVACIÓN:</div>
                    <span class="value-text">{{ factura.ven_observacion }}</span>
                </div>
                <div class="total-box-inline">
                    <div class="total-label">VALOR</div>
                    <div class="total-value">{{ parseFloat(factura.ven_valor).toFixed(2) }}</div>
                </div>
            </div>

            <div style="margin-top: 50px; font-size: 12px; padding-left: 20px;">
                {{ formatearFecha(factura.ven_fecha) }}
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        factura: {
            type: Object,
            required: true
        },
        datosCliente: {
            type: Object,
            required: true
        },
        empresa: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            img: '',
            institucionNombre: ''
        }
    },
    computed: {
        telefonos() {
            let tels = [];
            if (this.datosCliente.telefono1) tels.push(this.datosCliente.telefono1);
            if (this.datosCliente.telefono2) tels.push(this.datosCliente.telefono2);
            return tels.join(' - ');
        }
    },
    mounted() {
        this.getEmpresaLogo(this.empresa.id);
        // this.getInstitucion(); // Oculto por solicitud
    },
    methods: {
        async getEmpresaLogo(empresaId) {
            try {
                const res = await this.$http.get(this.$server_url + 'GetVuser?id=' + empresaId);
                this.img = res.data;
            } catch (err) {
                console.error('Error al cargar logo:', err);
            }
        },
        // async getInstitucion() { ... }, // Ya no se usa por ahora
        formatearFecha(fecha) {
            if (!fecha) return '-';
            const date = new Date(fecha);
            return date.toLocaleDateString('es-EC', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }) + ' ' + date.toLocaleTimeString('es-EC', {
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        imprimirPDF() {
            const printContents = document.getElementById('seccionImprimirFO').innerHTML;
            const newWin = window.open('', '_blank');

            const htmlContent = `
            <html>
                <head>
                    <title>Factura Operativa ${this.factura.ven_codigo}</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            margin: 20px;
                        }
                        .contenido-impresion {
                            width: 100%;
                            max-width: 800px;
                            margin: 0 auto;
                        }
                        .header-outside {
                            display: flex;
                            justify-content: space-between;
                            align-items: center;
                            margin-bottom: 20px;
                            padding-bottom: 10px;
                        }
                        .title-container {
                            text-align: right;
                            flex-grow: 1;
                        }
                        .main-title {
                            font-size: 24px;
                            font-weight: bold;
                            margin: 0;
                            color: #333;
                        }
                        .doc-code {
                            font-size: 18px;
                            margin: 5px 0 0 0;
                            color: #555;
                        }
                        .content-table {
                            width: 100%;
                            border-collapse: collapse;
                            margin-top: 10px;
                        }
                        .content-table td {
                            border: 1px solid #ccc;
                            padding: 10px;
                            font-size: 14px;
                        }
                        .label-cell {
                            font-weight: bold;
                            width: 150px;
                            background-color: #f9f9f9;
                        }
                        .value-cell {
                            text-transform: uppercase;
                        }
                        .footer-container {
                            display: flex;
                            border: 1px solid #ccc;
                            margin-top: 20px;
                        }
                        .observation-box {
                            flex: 1;
                            /* padding: 10px; */
                            border-right: 1px solid #ccc;
                        }
                        .label-text {
                            font-weight: bold;
                            margin-right: 5px;
                        }
                        .total-box-inline {
                            width: 200px;
                            text-align: center;
                            display: flex;
                            flex-direction: column;
                        }
                        .total-label {
                            background-color: #f9f9f9;
                            font-weight: bold;
                            padding: 8px;
                            border-bottom: 1px solid #ccc;
                            flex-grow: 0;
                        }
                        .total-value {
                            padding: 15px;
                            font-size: 18px;
                            font-weight: bold;
                            color: #333;
                            flex-grow: 1;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                        }
                        .value-text{
                            padding-left: 10px;
                        }
                        @media print {
                            @page {
                                margin: 0;
                                size: auto;
                            }
                            .no-print {
                                display: none !important;
                            }
                        }
                    </style>
                </head>
                <body>
                    ${printContents}
                </body>
            </html>
            `;

            newWin.document.write(htmlContent);
            newWin.document.close();

            // Esperar imagenes
            const images = newWin.document.getElementsByTagName('img');
            const imageLoadPromises = Array.from(images).map(img => {
                return new Promise((resolve) => {
                    if (img.complete) resolve();
                    else {
                        img.onload = resolve;
                        img.onerror = resolve;
                    }
                });
            });

            Promise.all(imageLoadPromises).then(() => {
                setTimeout(() => {
                    newWin.print();
                    newWin.close();
                }, 500); 
            });
        }
    }
}
</script>

<style scoped>
/* Estilos para la vista previa en el popup */
.contenido-impresion {
    font-family: Arial, sans-serif;
    background-color: white;
    padding: 20px;
    width: 100%;
    margin: 0 auto;
}

.header-outside {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    border-bottom: 2px solid #ddd;
    padding-bottom: 10px;
}

.title-container {
    text-align: right;
    flex-grow: 1;
}

.main-title {
    font-size: 24px;
    font-weight: bold;
    margin: 0;
    color: #333;
}

.doc-code {
    font-size: 18px;
    margin: 5px 0 0 0;
    color: #555;
}

.content-table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
}

.content-table td {
    border: 1px solid #ccc;
    padding: 10px;
    font-size: 14px;
}

.label-cell {
    font-weight: bold;
    width: 150px;
    background-color: #f9f9f9;
}

.value-cell {
    text-transform: uppercase;
}

.footer-container {
    display: flex;
    border: 1px solid #ccc;
    margin-top: 20px;
}

.observation-box {
    flex: 1;
    /* padding: 10px; */
    border-right: 1px solid #ccc;
}

.label-text {
    font-weight: bold;
    margin-right: 5px;
}

.total-box-inline {
    width: 200px;
    text-align: center;
    display: flex;
    flex-direction: column;
}

.total-label {
    background-color: #f9f9f9;
    font-weight: bold;
    padding: 8px;
    border-bottom: 1px solid #ccc;
}

.total-value {
    font-size: 18px;
    font-weight: bold;
    padding: 15px;
    color: #333;
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
}

.value-text{
    padding-left: 10px;
}
</style>
