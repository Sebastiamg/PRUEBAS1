<template>
<div>
    <vs-button v-if="AdminBodega" @click="imprimir();m_imprimirTodos('12px',id)">Imprimir</vs-button>
    <vs-button v-else @click="m_imprimirTodos('12px',id)">Imprimir</vs-button>
    <!-- <exportLibrosObsequios :librosObsequios="selectedActa"/> -->

    <vx-card id="seccionImprimir2">
      <p style="text-align: center;font-weight: bold;">{{nombreEmpresaActual}}</p>
        <h5 class="text-center font-bold" style="text-align: center; font-weight: bold; font-size: 16px;">
            PROMOCIÓN DE VENTAS</h5>
        <h5 class="text-center font-bold" style="text-align: center; font-weight: bold; font-size: 16px;margin-top: -7px;">
            ACTA DE ENTREGA</h5>
        <h5 class="text-center font-bold mt-2" style="float:right; margin-right: 45px; text-align: center; font-weight: bold; font-size: 14px;">
            {{ selectedActa.ven_codigo }}</h5>
        <p class="letra" style="padding: 0px 60px 0px 0px; font-size: 11px; margin: 0; margin-left: 35px;">
            <b>Fecha:</b> {{ selectedActa.ven_fecha}}
        </p>
        <br>
        <table style="border: none; text-align: start; border-collapse: collapse; width: 100%;">
            <tr style="border: none;">
                <td style="border: none; text-align: start; padding: 0; width: auto;">
                    <p style="font-size: 11px; margin: 0;">
                        <b>INSTITUCIÓN BENEFICIADA:</b>
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0;" colspan="2">
                    <p style="font-size: 11px; margin: 0;">
                        {{ datosReporteActa.institucionNombre }}
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0;"></td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; text-align: start; padding: 0; width: auto;">
                    <p style="font-size: 11px; margin: 0;">
                        <b>CLIENTE:</b>
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0;" colspan="2">
                    <p style="font-size: 11px; margin: 0;">
                        {{ datosReporteActa.cliente }}
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0;"></td>
                <td style="border: none; text-align: start; padding: 0;"></td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; text-align: start; padding: 0; width: auto;">
                    <p style="font-size: 11px; margin: 0;">
                        <b>CI:</b>
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0;">
                    <p style="font-size: 11px; margin: 0;">
                        {{ datosReporteActa.identificacionCliente }}
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0; width: auto;">
                    <p style="font-size: 11px; margin: 0;">
                        <b>TELF:</b>
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0;">
                    <p style="font-size: 11px; margin: 0;">
                        {{ datosReporteActa.telefono }}
                    </p>
                </td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; text-align: start; padding: 0; width: auto;">
                    <p style="font-size: 11px; margin: 0;">
                        <b>DIRECCIÓN:</b>
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0;">
                    <p style="font-size: 11px; margin: 0;">
                        {{ datosReporteActa.direccion }}
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0;"></td>
                <td style="border: none; text-align: start; padding: 0;"></td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; text-align: start; padding: 0; width: auto;">
                    <p style="font-size: 11px; margin: 0;">
                        <b>RESPONSABLE:</b>
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0;">
                    <p style="font-size: 11px; margin: 0;">
                        {{ datosReporteActa.asesor }}
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0;"></td>
                <td style="border: none; text-align: start; padding: 0;"></td>
            </tr>
            <tr style="border: none;">
                <td style="border: none; text-align: start; padding: 0; width: auto;">
                    <p style="font-size: 11px; margin: 0;">
                        <b>OBSERVACIÓN :</b>
                    </p>
                </td>
                <td style="border: none; text-align: start; padding: 0;" colspan="3">
                    <p style="font-size: 11px; margin: 0;">
                        {{ datosReporteActa.observacionFacturador }}
                    </p>
                </td>
            </tr>
        </table>
        <br>
        <p style="padding: 0px 60px 0px 0px; font-size: 11px; margin: 0; margin-left: 35px;">
            Con esta fecha, se procede a la suscripción de la presente Acta de
            Entrega - Recepción de los productos que se otorgan en calidad de
            <b>OBSEQUIOS SIN COSTO</b>, como parte de la PROMOCIÓN DE VENTAS.
        </p>
        <br>
        <table style="table-layout: fixed; width: 90%; border-collapse: collapse; border: none; font-size: 11px; margin-top: 15px; margin-left: 45px;">
            <thead>
                <tr>
                    <td colspan="1" style=" border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0;">
                        <b>LIBROS</b>
                    </td>
                    <!-- <td colspan="1"><b>PRECIO</b></td> -->
                    <td colspan="1" style=" border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0;">
                        <b>CANTIDAD</b>
                    </td>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(tr,key) in arregloLibros" :key="key">
                    <td style="border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0;text-align: left; padding-left: 10px;" v-if="tr.id_serie === 19">
                        {{ tr.nombreproducto}} <br>
                        <b>Descripción Combo:</b> {{ tr.descripcionlibro }}
                    </td>
                    <td style=" border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0;text-align: left; padding-left: 10px;" v-else>
                        {{ tr.nombreproducto }}
                    </td>
                    <td style="border: 1px solid rgb(227, 227, 227);text-align: center;border-spacing: 0;">
                        {{ tr.det_ven_cantidad }}</td>
                </tr>
            </tbody>
        </table>
        <p style="padding: 0px 60px 0px 0px; font-size: 11px; margin: 0; margin-left: 35px; margin-top: 15px;">
            Elaborado por: {{ datosReporteActa.facturador}}
        </p>
        <br>
        <div>
            <table style="width: 100%; border-collapse: collapse; margin-top: 5px;">
                <tr>
                    <td style="text-align: center; font-size: 11px; padding: 0 60px; border: none;">
                        <b>ENTREGUÉ CONFORME</b>
                    </td>
                    <td style="text-align: center; font-size: 11px; padding: 0 60px; border: none;">
                        <b>RECIBÍ CONFORME</b>
                    </td>
                </tr>
                <tr style="height: 50px; border: none;">
                    <td colspan="2"></td>
                </tr>
                <tr>
                    <td style="text-align: center; font-size: 11px; padding: 0 60px; border: none;">
                        {{ datosReporteActa.empresa }} <br> <b>VENDEDOR</b>
                    </td>
                    <td style="text-align: center; font-size: 11px; padding: 0 60px; border: none; margin-right: 35px;">
                        {{ datosReporteActa.institucionNombre }} <br> <b>COMPRADOR</b>
                    </td>
                </tr>
            </table>
        </div>
    </vx-card>
</div>
</template>


<script>
// import VueHtml2pdf from "vue-html2pdf";
// import exportLibrosObsequios from "./exportLibrosObsequios";
// import exportDetalleLibrosObsequios from "./exportDetalleLibrosObsequios";
import {    mapState } from "vuex";
import imprimirMixin from "@/mixins/Pedidosmix";
export default {
    mixins: [imprimirMixin],
    computed: {
        ...mapState(["AdminBodega",  'groupFacturador']),
    },
    components: {
        // VueHtml2pdf,
        // exportLibrosObsequios,
        // exportDetalleLibrosObsequios,
    },
    data() {
        return {
            usuario: [],
            arregloActas: [],
            selectedActa: {}, // Cambiado a objeto
            acta: "",
            datosReporteActa: {},
            arregloLibros: [],
            showExportComponent: false,
            popupDatosDetalle: false,
            popupDetallePedidoLibroObsequio: false,
            observacion_detalle: "",
            seleccionados: [],
            total: 0,
            valorDescuento: 0,
            subtotal: 0,
            valorTotal: 0,
            descuento: 0,
            nombreEmpresaActual:'',
        };
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    props: {
        factu: {
            type: Object,
            default: {}
        },
        id: {
            type: String,
            default: ''
        },
    },
    mounted() {
        this.descuento = this.factu.ven_desc_por;
        this.generateActaPDF(this.factu);
        this.empresaActual();
    },
    methods: {
      async empresaActual(){
          await this.$http.get(this.$server_url + 'empresaActual')
            .then(res => {
                this.nombreEmpresaActual = res.data[0].descripcion_corta;
            })
            .catch(err => {
                console.log(err);
            });
        },
        // calcularSubTotal(tr) {
        //     return tr.det_ven_cantidad * tr.det_ven_valor_u;
        // },
        // calcularTotal() {
        //     let total = 0;
        //     let totalLibros = 0;
        //     for (let i = 0; i < this.arregloLibros.length; i++) {
        //         total += this.calcularSubTotal(this.arregloLibros[i]);
        //     }
        //     for (let i = 0; i < this.arregloLibros.length; i++) {
        //         totalLibros += this.arregloLibros[i].det_ven_cantidad;
        //     }
        //     this.total = total;
        //     let descuento = this.librosObsequios.porcentaje_descuento
        //     this.valorDescuento = (total * descuento) / 100

        //     this.subtotal = total

        //     this.valorTotal = total - this.valorDescuento
        // },
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
                        text: "Ocurrio un error al imprimir",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        generateActaPDF(acta) {
            this.selectedActa = acta;
            this.datosReporteActa = {};
            this.arregloLibros.splice(0, this.arregloLibros.length);
            this.showExportComponent = false;
            this.reporteLibrosObsequiosActa(this.selectedActa.ven_codigo, this.selectedActa.id_empresa);
        },
        reporteLibrosObsequiosActa(acta, empresa) {
            let me = this;
            me.$vs.loading();
            this.$http
                .get(this.$server_url + "reporteLibrosObsequiosActa?ven_codigo=" + acta + "&empresa=" + empresa)
                .then((res) => {
                    me.datosReporteActa = res.data[0];
                    // console.log(me.datosReporteActa);
                    me.obtenerDetalleDocumentosLibrosObsequios(acta, empresa);
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
        obtenerDetalleDocumentosLibrosObsequios(acta, empresa) {
            let me = this;
            me.$vs.loading();
            this.$http
                .get(this.$server_url + "obtenerDetalleDocumentosLibrosObsequios?ven_codigo=" + acta + "&empresa=" + empresa)
                .then((res) => {
                    let nuevosLibros = res.data.filter(libro => libro.det_ven_cantidad !== 0);
                    this.arregloLibros.push(...nuevosLibros);
                    // this.calcularTotal();
                    me.$vs.loading.close();
                    this.popupReportePdf = true;
                    this.showExportComponent = true;
                    // this.$nextTick(() => {
                    //     this.$refs.html2Pdf.generatePdf();
                    // });
                })
                .catch((err) => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
    },
};
</script>
