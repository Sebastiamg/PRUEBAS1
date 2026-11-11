<template>
<div class="vx-row">
    <vs-button v-if="AdminBodega" @click="imprimir();m_imprimirTodos('12px',id)">Imprimir</vs-button>
    <vs-button v-else @click="m_imprimirTodos('12px',id)">Imprimir</vs-button>
    <vx-card id="seccionImprimir2">
        <table>
            <thead v-if="tipo==2">
                <tr>
                    <td></td>
                    <td colspan="4" style="text-align: center;"><b> {{nota.id}} </b>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <p>{{nota.fecha}}</p>
                    </td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <p>{{nota.cliente}}</p>
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        <p>{{nota.ruc}}</p>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td colspan="4">
                        <p>{{nota.institucion}}</p>
                    </td>
                </tr>

                <tr>
                    <td></td>
                    <td>
                        <p>{{nota.direcccion}}</p>
                    </td>
                    <td width="50"></td>
                    <td></td>
                    <td>
                        <p>{{nota.telefono}}</p>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <p>{{nota.proforma}}</p>
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        <p>{{nota.user}}</p>
                    </td>
                </tr>
                <tr style="height: 8px; border: transparent"></tr>
            </thead>
            <thead v-if="tipo==1">
                <tr>
                    <td><img class="img-responsive mb-2 ml-1" v-bind:src="datosProp" style="display: flex;width: 100px;"></td>
                    <td colspan="4" style="text-align: center;">
                      <b> NOTA DE ENTREGA </b> <span class="ml-6">{{nota.letra}}</span> <b> {{nota.id}} </b>
                      <div class="vx-row" v-if="nota.id">
                      <div class="vx-col w-full sm:w-full md:w-fulllg:w-fullxl:w-full mb-6" v-if="groupBodega">
                          <barcodeReutilizableVue :barcodeValue="nota.id" :width="0.8" :height="20" :barcodeId="'barcode-nota'" />
                        </div>
                      </div>
                    </td>
                </tr>
                <tr>
                    <td> <b>Fecha:</b></td>
                    <td>
                        <p>{{nota.fecha}}</p>
                    </td>
                    <td></td>
                    <td></td>
                    <td>
                        <p v-if="nota.letra =='L'">NO APLICA</p>
                        <p v-if="nota.letra =='V'">{{nota.responsable}}</p>
                    </td>
                </tr>
                <tr>
                    <td><b>Cliente: </b></td>
                    <td>
                        <p>{{nota.cliente}}</p>
                    </td>
                    <td></td>
                    <td><b>RUC: </b></td>
                    <td>
                        <p>{{nota.ruc}}</p>
                    </td>
                </tr>
                <tr>
                    <td v-if="nota.letra=='V'"><b>Institución: </b></td>
                    <td v-if="nota.letra=='L'"><b>Librería: </b></td>
                    <td colspan="4">
                        <p>{{nota.institucion}}</p>
                    </td>
                </tr>

                <tr>
                    <td><b>Dirección: </b></td>
                    <td>
                        <p>{{nota.direcccion}}</p>
                    </td>
                    <td width="50"></td>
                    <td><b>Telefóno: </b></td>
                    <td>
                        <p>{{nota.telefono}}</p>
                    </td>
                </tr>
                <tr>
                    <td><b v-if="nota.proforma">Pre-Proforma: </b></td>
                    <td>
                      <div v-if="!groupBodega">
                        <span >{{nota.proforma}}</span>
                      </div>
                      <div v-else style="display: flex; flex-direction: column; align-items: center;">
                        <span >{{nota.proforma}}</span>
                        <barcodeReutilizableVue  :barcodeValue="nota.proforma" :width="0.8" :height="20" :barcodeId="'barcode-proforma'" />
                      </div>
                    </td>
                    <td></td>
                    <td> <b v-if="nota.letra =='L'">Facturador:</b>
                        <b v-if="nota.letra =='V'">Cód. promotor/Vendedor:</b></td>
                    <td>
                        <p>{{nota.user}}</p>
                    </td>
                </tr>
                <tr style="height: 8px; border: transparent"></tr>
            </thead>
        </table>
        <table class="tabla1">
            <thead>
                <tr v-if="tipo==1">
                    <th>Código </th>
                    <th>Cantidad</th>
                    <th>Descripción </th>
                    <th>Valor Unitario</th>
                    <th>Valor Total</th>
                </tr>
                <tr v-if="tipo==2">
                    <th colspan="5" style="height: 10px;"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(input, k) in deta" :key="k">
                    <td>{{ input.pro_codigo }}</td>
                    <td align="center">{{ input.det_ven_cantidad }}</td>
                    <td> {{input.nombre}} <span v-if="input.id_serie==19"><br> {{ input.descripcionlibro }} </span></td>
                    <td align="center">{{ input.det_ven_valor_u }}</td>
                    <td style="text-align: right;">{{ input.subtotal=(input.det_ven_cantidad*input.det_ven_valor_u).toFixed(2) }}</td>
                </tr>
            </tbody>
        </table>
        <table class="tabla1">
            <tbody>
                <tr>
                    <td rowspan="5" align="letf"><b>Observación:</b> {{nota.observacion}}<br /><br />
                        <b>Notas: </b> SOLO SE ACEPTARAN RECLAMOS DENTRO DE LOS 4 DÍAS POSTERIORES AL DESPACHO </td>
                    <td style="min-width: 100px;"> <b v-if="tipo==1">Suman $:</b></td>
                    <td style="text-align: right; min-width:80px">
                        <b>{{nota.subtotal=(deta.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0)).toFixed(2)}}</b>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: left;"> <b v-if="tipo==1">Desc. {{nota.descuento}} $:</b></td>
                    <td style="text-align: right;">
                        <b>{{parseFloat(nota.descontar).toFixed(2)}}</b>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: left;"> <b v-if="tipo==1">Subtotal $:</b></td>
                    <td style="text-align: right;">
                        <b>{{parseFloat(nota.subtotal-nota.descontar).toFixed(2)}}</b>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: left;"> <b v-if="tipo==1">Transporte $:</b></td>
                    <td style="text-align: right;">
                        <b>{{parseFloat(nota.transporte).toFixed(2)}}</b>
                    </td>
                </tr>
                <tr>
                    <td style="text-align: left;"> <b v-if="tipo==1">TOTAL $:</b></td>
                    <td style="text-align: right;">
                        <b>{{parseFloat(parseFloat(nota.subtotal-nota.descontar).toFixed(2)-parseFloat(nota.transporte).toFixed(2)).toFixed(2)}}</b>
                    </td>
                </tr>
            </tbody>
        </table>
        <vs-row style="height: 80px;" v-if="tipo==1">
            <vs-col vs-justify="center" vs-align="center" vs-w="12" vs-type="flex">
                <vs-row vs-justify="center" vs-align="center" vs-w="10" vs-type="flex" class="m-t2">

                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row v-if="tipo==1">
            <vs-col vs-justify="center" vs-align="center" vs-w="6" vs-type="flex">
                <vs-row vs-justify="center" vs-align="center" vs-w="10" vs-type="flex">
                    <b>________________________________</b><br />
                    <p>Deudor / Recibí Conforme</p>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-w="6" vs-type="flex">
                <vs-row vs-justify="center" vs-align="center" vs-w="10" vs-type="flex">
                    <b>________________________________</b><br />
                    <p>Entregué Conforme</p>
                </vs-row>
            </vs-col>
        </vs-row>
    </vx-card>
    <!-- <div v-if="popupcarga">
                <FileUploadModal @change="changeHandle" />
            </div> -->
</div>
</template>

<script>
const barcodeReutilizableVue = () => import('./barcodeReutilizable.vue');
import { mapState } from "vuex";
import imprimirMixin from "@/mixins/Pedidosmix";
export default {
    mixins: [imprimirMixin],
    computed: {
        ...mapState(["AdminBodega",  'groupFacturador','groupBodega']),
    },
    components: {
        barcodeReutilizableVue,
    },
    data: () => ({
        nombre_periodo: '',
        sendPedido: '',
        setPuntos: '',
        deta: [],
        notas: [],
        nota: {
            id: '',
            emp: '',
            letra: '',
            estado: '',
            fecha: '',
            institucion: '',
            cliente: '',
            direcccion: '',
            telefono: '',
            proforma: '',
            user: '',
            responsable: '',
            observacion: '',
            subtotal: '',
            descuento: '',
            decontar: '',
            transporte: '',
            total: '',
        },
        datosProp: '',
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
        tipo: {
            type: Number,
            default: 0
        },
    },
    mounted() {
        this.empresa(this.factu.id_empresa);
        this.getnotapdf(this.factu);

    },
    methods: {
        async data(a, b) {
            await this.$http.get(this.$server_url + 'Get_DFactura?ven_codigo=' + a + '&idemp=' + b)
                .then(res => {
                    this.deta = res.data;
                    this.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err);
                    this.$vs.loading.close();
                });
        },
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
                    if(res.data.status == '0'){
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        return;
                    }
                    if (res.status === 200) {
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
        // pdf1() {
        //     let me = this
        //     var element = document.getElementById('seccionImprimir2');
        //     var opt = {
        //         margin: 0.5,
        //         // margin:         [1.5, 0.5, 1, 1],
        //         filename: me.id + ".pdf",
        //         image: {
        //             type: 'jpeg',
        //             quality: 1
        //         },
        //         html2canvas: {
        //             scale: 2
        //         },
        //         pagebreak: {
        //             mode: 'avoid-all',
        //             inside: "avoid",
        //             before: '#page2el'
        //         },
        //         // jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
        //         jsPDF: {
        //             unit: 'in',
        //             format: 'letter',
        //             orientation: 'portrait'
        //         }
        //         //jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        //     };
        //     html2pdf().from(element).set(opt).save();
        //     setTimeout(() => {
        //         me.$emit('change', true);
        //     }, 10000); // Cambia 5000 a la cantidad de milisegundos que deseas de retraso
        // },
        async getnotapdf(tr) {
            let me = this;
            me.nota.id = tr.ven_codigo;
            if (tr.ven_tipo_inst) {
                me.nota.letra = tr.ven_tipo_inst;
            } else {
                me.nota.letra = 'V';
            }
            me.nota.institucion = tr.nombreInstitucion;
            me.nota.emp = tr.descripcion_corta;
            me.nota.cliente = tr.cliente;

            me.nota.fecha = tr.ven_fecha;
            if (tr.telefono) {
                me.nota.telefono = tr.telefono;
            } else {
                me.nota.telefono = tr.telefonoInstitucion;
            }
            me.nota.ruc = tr.cedula;

            me.nota.direcccion = tr.direccionInstitucion;
            if (me.nota.letra == 'L') {
                me.nota.user = tr.responsable;
            } else if (me.nota.letra == 'V') {
                me.nota.user = tr.asesor;
                me.nota.responsable = tr.responsable;
            }

            me.nota.correo = tr.email;
            me.nota.proforma = tr.ven_idproforma;
            if (tr.ven_observacion) {
                me.nota.observacion = tr.ven_observacion;
            } else {
                me.nota.observacion = tr.prof_observacion;
            }
            me.nota.descuento = tr.ven_desc_por + "%";
            me.nota.descontar = tr.ven_descuento
            if (tr.ven_transporte) {
                me.nota.transporte = tr.ven_transporte;
            } else {
                me.nota.transporte = 0;
            }

            me.nota.total = tr.ven_valor
            me.nota.subtotal = parseFloat(tr.ven_valor) - parseFloat(tr.ven_transporte) - parseFloat(tr.iva) + parseFloat(tr.ven_descuento);
            await this.data(tr.ven_codigo, tr.id_empresa);
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
    }
}
</script>

<style>
.vs-row {
    width: 100%;
    /* Ajustar el ancho al 100% para que ocupe todo el ancho del documento */
    font-size: 10px;
    /* Reducir un poco el tamaño de fuente para que quepa en el espacio más limitado */
    margin: 0 auto;
}

.tabla1 {
    width: 100%;
    /* Ajustar el ancho al 100% para que ocupe todo el ancho del documento */
    font-size: 12px;
    /* Reducir un poco el tamaño de fuente para que quepa en el espacio más limitado */
    margin: 0 auto;
    /* Centrar la tabla en el documento */
}

.tabla1 td {
    padding: 1px;
    text-align: left;
    word-wrap: break-word;
}
</style>
