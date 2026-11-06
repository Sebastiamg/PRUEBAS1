<template lang="html">
<div>
    <vs-button v-if="AdminBodega" @click="imprimir();m_imprimirTodos('12px',id)">Imprimir</vs-button>
    <vs-button v-else @click="m_imprimirTodos('12px',id)">Imprimir</vs-button>

    <vx-card id="seccionImprimir2">
      <p style="text-align: center;font-weight: bold;">{{nombreEmpresaActual}}</p>
        <table>
            <thead>
                <tr>
                    <td><img class="img-responsive mb-2 ml-1" v-bind:src="datosProp" style="display: flex;width: 100px;"></td>
                    <td colspan="4" style="text-align: center;"><b>COMPROBANTE DE TRANSACCIÓN: {{factura.id}} </b>
                        <span class="ml-6" v-if="factura.letra=='V'"> Directa</span>
                        <span class="ml-6" v-else> Por Lista</span>
                    </td>
                </tr>
                <!-- <tr>
                    <td v-if="factura.letra=='V'"><b>Institución: </b></td>
                    <td v-if="factura.letra=='L'"><b>Librería: </b></td>
                    <td colspan="4">{{factura.institucion}}</td>
                </tr> -->
                <tr>
                    <td><b>Cliente: </b></td>
                    <td>{{factura.cliente}}</td>
                    <td></td>
                    <td><b>RUC: </b></td>
                    <td>{{factura.ruc}}</td>
                </tr>
                <tr>
                    <td><b>Fecha: </b></td>
                    <td>{{factura.fecha}}</td>
                    <td></td>
                    <td><b>Correo: </b></td>
                    <td>{{factura.correo}}</td>
                </tr>
                <tr>
                    <!-- <td><b>Dirección: </b></td>
                    <td>{{factura.direcccion}}</td> -->
                    <td width="50"></td>
                    <td><b>Telefóno: </b></td>
                    <td>{{factura.telefono}}</td>
                </tr>
                <tr>
                    <template>
                        <td><b v-if="factura.prefacturas.length>0">Pre-facturas: </b></td>
                        <td>
                            <div v-if="factura.prefacturas.length>0">
                                <span v-for="(t, k) in factura.prefacturas" :key="k">
                                    {{ t.ven_codigo }}<span v-if="k < factura.prefacturas.length - 1">, </span>
                                </span>
                            </div>
                        </td>
                    </template>
                    <td></td>
                    <td><b>Facturado por: </b></td>
                    <td>{{factura.user}}</td>
                </tr>
                <tr style="height: 8px; border: transparent"></tr>
            </thead>
        </table>
        <table>
            <tbody>
                <tr>
                    <table class="table tabla2 mi-clase-de-tabla">
                        <thead align="center">
                            <tr>
                                <th width="25">Código</th>
                                <th width="100">Cantidad</th>
                                <th width="350">Descripción</th>
                                <th width="150">Valor Unitario</th>
                                <th width="100">Valor Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(input, k) in deta" :key="k">
                                <td><b>{{ input.pro_codigo }}</b></td>
                                <td align="center">{{ input.det_ven_cantidad }}</td>
                                <td>{{ input.id_serie == '19'? input.nombre + ' ' + input.descripcionlibro: input.nombre}}</td>
                                <td align="center">{{ input.det_ven_valor_u }}</td>
                                <td style="text-align: right;">{{ input.subtotal=(input.det_ven_cantidad*input.det_ven_valor_u).toFixed(2) }}</td>
                            </tr>
                        </tbody>
                    </table>
                </tr>
                <tr>
                    <table class="table tabla2 mi-clase-de-tabla" style="font-size: 11px;">
                        <tbody>
                            <tr>
                                <td colspan="4" rowspan="6" align="left" width="300">
                                    <div v-if="factura.observacion"><br /><br /><br />
                                        <b>Observación:</b> {{factura.observacion}}<br /><br />
                                        <b>Nota: </b> SOLO SE ACEPTARAN RECLAMOS DENTRO DE LOS 4 DÍAS POSTERIORES AL DESPACHO
                                    </div>
                                </td>
                                <td><b>Subtotal $:</b></td>
                                <td style="text-align: right;" width="100">
                                    <b>{{factura.subtotal=(deta.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0)).toFixed(2)}}</b>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Descuento {{factura.descuento}} $:</b></td>
                                <td style="text-align: right;">
                                    <b>{{parseFloat(factura.descontar).toFixed(2)}}</b>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Subtotal - Descuento $:</b></td>
                                <td style="text-align: right;">
                                    <b>{{parseFloat(factura.subtotal-factura.descontar).toFixed(2)}}</b>
                                </td>
                            </tr>
                            <tr>
                                <td><b>IVA $:</b></td>
                                <td style="text-align: right;">
                                    <b>{{parseFloat(factura.iva).toFixed(2)}}</b>
                                </td>
                            </tr>
                            <tr>
                                <td><b>Transporte $:</b></td>
                                <td style="text-align: right;">
                                    <b>{{parseFloat(factura.transporte).toFixed(2)}}</b>
                                </td>
                            </tr>
                            <tr>
                                <td><b>TOTAL $:</b></td>
                                <td style="text-align: right;">
                                    <b>{{parseFloat(factura.total).toFixed(2)}}</b>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </tr>
            </tbody>
        </table>
    </vx-card>

    <!-- <div v-if="popupcarga">
                    <FileUploadModal @change="changeHandle" />
                </div> -->
</div>
</template>


<script>
// import VueHtml2pdf from 'vue-html2pdf';
// import html2pdf from "html2pdf.js"
// const FileUploadModal = () => import('@/views/pedidos2/pedidos/proforma/FileUploadModal.vue')
import {    mapState } from "vuex";
import imprimirMixin from "@/mixins/Pedidosmix";
export default {
    mixins: [imprimirMixin],
    computed: {
        ...mapState(["AdminBodega",  'groupFacturador']),
    },
    // components: {
    //     VueHtml2pdf,
    //     FileUploadModal,
    // },
    data: () => ({
        usuario: [],
        deta: [],
        setMenu: '',
        factura: {
            tipo: '',
            img: '',
            id: '',
            estado: '',
            institucion: '',
            cliente: '',
            fecha: '',
            telefono: '',
            ruc: '',
            direcccion: '',
            user: '',
            correo: '',
            proforma: '',
            observacion: '',
            descuento: '',
            subtotal: '',
            iva: '',
            descontar: '',
            transporte: '',
            total: '',
            letra: '',
            prefacturas: '',
        },
        popupcarga: false,
        datosProp: '',
        nombreEmpresaActual:'',
    }),
    props: {
        factu: {
            type: Object,
            default: {}
        },
        id: {
            type: String,
            default: ''
        },
        op: {
            type: String,
            default: ''
        },
    },
    mounted() {
        let me = this;
        this.empresa(this.factu.id_empresa);
        this.empresaActual()
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        // this.startLoading();
        this.getfactpdf(this.factu);
    },
    methods: {
        async empresa(a) {
            await this.$http.get(this.$server_url + 'GetVuser?id=' + a)
                .then(res => {
                    this.datosProp = res.data;
                    this.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    this.$vs.loading.close();
                });
        },
        async empresaActual(){
          await this.$http.get(this.$server_url + 'empresaActual')
            .then(res => {
                this.nombreEmpresaActual = res.data[0].descripcion_corta;
            })
            .catch(err => {
                console.log(err);
            });
        },
        //         imprimir() {
        //             const printContents = document.getElementById('seccionImprimir2').innerHTML;
        //             const win = window.open('', '', 'width=800,height=600');
        //             win.document.write(`
        //         <html>
        //           <head>
        //             <title>Impresión</title>

        //
        // body {
        //     font-family: Calibri, sans-serif;
        //     font-size: 5px;
        // }

        // table {
        //     width: 100%;
        //     border-collapse: collapse;
        // }

        // th,
        // td {
        //     border: 1px solid #ddd;
        //     padding: 8px;
        // }

        // th {
        //     text-align: left;
        //     background-color: #f2f2f2;
        // }
        //
        //           </head>
        //           <body>
        //             ${printContents}
        //           </body>
        //         </html>
        //       `);
        //             win.document.close();
        //             win.print();
        //             win.close();
        //         },
        startLoading() {
            this.popupcarga = true;
        },
        imprimir() {
            let formData = new FormData();
            let me = this;
            formData.append("ven_codigo", this.id);
            formData.append("id_empresa", me.factu.id_empresa);
            me.$vs.loading();
            this.$http
                .post(this.$server_url + "imprimirDVenta", formData)
                .then((res) => {
                    me.$vs.loading.close();
                    if (res.status === 200) {
                      if(res.data.status == '0'){
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        return;
                    }
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.$emit('change', true);
                    }
                    if (res.status === 500) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "No se pudo anular",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        changeHandle(e) {
            let me = this;
            me.popupcarga = false;
        },
        pdf1() {
            // let me = this;
            // this.$refs.html2Pdf.generatePdf();
            let me = this
            var element = document.getElementById('seccionImprimir2');
            var opt = {
                margin: [0.2, 0, 0.2, 0],
                // margin:         [1.5, 0.5, 1, 1],
                filename: me.id + ".pdf",
                image: {
                    type: 'jpeg',
                    quality: 1
                },
                html2canvas: {
                    scale: 1.5
                },
                pagebreak: {
                    mode: 'avoid-all',
                    inside: "avoid",
                    before: '#page2el'
                },
                // jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                jsPDF: {
                    unit: 'in',
                    format: 'letter',
                    orientation: 'portrait'
                }
                //jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
            };
            html2pdf().set(opt).from(element).save();
            setTimeout(() => {
                me.$emit('change', true);
            }, 10000); // Cambia 5000 a la cantidad de milisegundos que deseas de retraso
        },
        async data(a, b) {
            let url;
            if (this.op) {
                url = this.$server_url + 'Get_DatoFactura?ven_codigo=' + a + '&idemp=' + b;
            } else {
                url = this.$server_url + 'Get_DFactura?ven_codigo=' + a + '&idemp=' + b;
            }
            await this.$http.get(url)
                .then(res => {
                    this.deta = res.data;
                    this.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    this.$vs.loading.close();
                });
        },
        async getfactpdf(tr) {
            this.deta = [];
            let me = this;
            console.log(tr);
            me.factura.id = tr.id_factura;
            me.factura.institucion = tr.nombreInstitucion;
            if (tr.cliente) {
                me.factura.cliente = tr.cliente;
            } else {
                me.factura.cliente = tr.nombres + " " + tr.apellidos;
            }
            if (tr.prefacturas) {
                me.factura.prefacturas = tr.prefacturas;
            }
            me.factura.fecha = tr.ven_fecha;
            me.factura.telefono = tr.telefonoInstitucion;
            me.factura.ruc = tr.cedula;
            me.factura.letra = tr.ven_tipo_inst;
            me.factura.direcccion = tr.direccionInstitucion;
            me.factura.user = tr.responsable;
            me.factura.correo = tr.email;
            me.factura.proforma = tr.ven_idproforma;
            me.factura.observacion = tr.prof_observacion;
            me.factura.descuento = tr.ven_desc_por + "%";
            me.factura.iva = tr.ven_iva;
            me.factura.descontar = tr.ven_descuento
            me.factura.transporte = tr.ven_transporte
            me.factura.total = tr.ven_valor
            me.factura.subtotal = parseFloat(tr.ven_valor) - parseFloat(tr.ven_transporte) - parseFloat(tr.iva) + parseFloat(tr.ven_descuento);
            await this.data(tr.id_factura, tr.id_empresa);
            if (me.deta.length > 0) {
                // this.pdf1();
            } else {
                me.$vs.notify({
                    text: "No se pudo generar pdf",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-x",
                });
            }
        },
    },
}
</script>


<style>
.captcha {
    font-size: 9px !important;
}

.label_inputs {
    font-size: 12px;
    color: black;
    margin-top: 2px;
    padding-left: 2px;
}

@media print {
    .mi-clase-de-tabla td {
        page-break-before: always;
    }

    .oculto-impresion * {
        display: none !important;
    }
}

.tabla1 {
    table-layout: auto;
    width: 90%;
    border-collapse: collapse;
    margin: 35px;
    margin-bottom: 20px;

}

.tabla2 {
    table-layout: auto;
    width: 90%;
    font-size: 11px;
    margin-left: 35px;
    margin-right: 35px;
}

.table-cell {
    border: 1px solid black;
    /* Define el borde de 1 píxel y sólido de color negro */
}
</style>
