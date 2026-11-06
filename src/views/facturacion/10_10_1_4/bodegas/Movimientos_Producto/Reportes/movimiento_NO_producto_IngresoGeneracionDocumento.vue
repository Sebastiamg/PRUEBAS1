<template>
<div>
    <div align="center">
        <!-- Parametros Imprimir: 1.-Tamaño general del texto, 2.- Nombre del archivo, 3.- Tamaño del borde td, 4.- Nombre Marca Agua-->
        <vs-button @click="m_imprimirTodos('12px',nombrearchivo,'0px')">Imprimir</vs-button>
    </div>
    <!-- <exportLibrosObsequios :librosObsequios="selectedActa"/> -->
    <vx-card id="seccionImprimir2">
        <div align="center">
            <b style="font-size: 17px;">Registro de Movimiento NO OPERATIVO</b>
            <br>
            <b style="font-size: 17px;" v-if="verificacionIngresoEgreso == 1">INGRESO</b>
            <b style="font-size: 17px;" v-if="verificacionIngresoEgreso == 2">EGRESO</b>
        </div>
        <br>
        <br>
        <table>
            <tr>
                <table>
                    <tr>
                        <td width="700">
                            <p class="margintd"><b>Codigo Documento:</b> {{ idmovimiento.fmp_id }}</p>
                            <!-- <p class="margintd" v-if="verificacionIngresoEgreso == 2"><b>Codigo Documento:</b> {{ MovimientoEgreso[0].fmp_id }}</p> -->
                        </td>
                        <td width="500">
                            <p class="margintd"><b>Fecha:</b> {{ idmovimiento.dupdatedmov }}</p>
                            <!-- <p class="margintd" v-if="verificacionIngresoEgreso == 2"><b>Fecha:</b> {{ MovimientoEgreso[0].dupdatedmov }}</p> -->
                        </td>
                    </tr>
                    <tr>
                        <td width="700">
                            <p class="margintd"><b>Proveedor:</b> {{ idmovimiento.prov_nombre }}</p>
                            <!-- <p class="margintd" v-if="verificacionIngresoEgreso == 2"><b>Proveedor:</b> {{ MovimientoEgreso[0].prov_nombre }}</p> -->
                        </td>
                        <td width="500">
                            <p class="margintd"><b>RUC/CI:</b> {{ idmovimiento.prov_ruc }}</p>
                            <!-- <p class="margintd" v-if="verificacionIngresoEgreso == 2"><b>RUC/CI:</b> {{ MovimientoEgreso[0].prov_ruc }}</p> -->
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="margintd"><b>Dirección:</b> {{ idmovimiento.prov_direccion }}</p>
                            <!-- <p class="margintd" v-if="verificacionIngresoEgreso == 2"><b>Dirección:</b> {{ MovimientoEgreso[0].prov_direccion }}</p> -->
                        </td>
                        <td>
                            <p class="margintd"><b>Items:</b> {{ IngresoEgresoReporte.length }}</p>
                        </td>
                    </tr>
                </table>
            </tr>
        </table>
        <br>
        <br>
        <div align="center">
            <table style="border: 1px solid #000;font-size: 11px;margin-top: 15px;">
                <thead>
                    <tr style="border: 1px solid #000;font-size: 11px; text-align: center;">
                        <td style="border-right: 1px solid #000;" width="160" colspan="1">
                            <b v-if="verificacionIngresoEgreso == 1">CANTIDAD AUMENTADA</b>
                            <b v-else-if="verificacionIngresoEgreso == 2">CANTIDAD DISMINUIDA</b>
                            <b v-else>CANTIDAD</b> <!-- Texto por defecto si no es 1 ni 2 -->
                        </td>
                        <td style="border-right: 1px solid #000;" width="160"><b>CODIGO ASOCIADO</b></td>
                        <td style="border-right: 1px solid #000;" width="300" colspan="1"><b>DETALLE</b></td>
                        <td style="border-right: 1px solid #000;" width="200" colspan="1"><b>BODEGA</b></td>
                        <td style="border-right: 1px solid #000;" width="100" colspan="1"><b>TIPO BODEGA</b></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(tr,key) in IngresoEgresoReporte" :key="key" style="border: 1px solid #000;font-size: 11px; text-align: center;">
                        <td style="border-right: 1px solid #000;">{{ tr.fmdp_cantidad}} </td>
                        <td style="border-right: 1px solid #000;">{{ tr.pro_codigo }}</td>
                        <td style="border-right: 1px solid #000;">{{ tr.pro_nombre }}</td>
                        <td style="border-right: 1px solid #000;">{{ tr.fmdp_tipo_bodega == 3 ? 'RESERVAR' : tr.descripcion_corta }} </td>
                        <td style="border-right: 1px solid #000;">
                            <p v-if="tr.fmdp_tipo_bodega == 1">Notas</p>
                            <p v-if="tr.fmdp_tipo_bodega == 2">Facturas</p>
                            <p v-if="tr.fmdp_tipo_bodega == 3">Reservar</p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <br>
        <table>
            <tr>
                <td>
                    <b>Observación:</b> {{ idmovimiento.observacion }}
                </td>
            </tr>
        </table>
        <table style="width: 200px;">
            <tr>
                <td>
                    <div style="page-break-inside: avoid; text-align: left; margin-top: 100px;">
                        <hr style="width: 100%; border: 1px solid black;">
                        <div align="center"><strong>Autorizado por:</strong></div>
                    </div>
                </td>
            </tr>
        </table>
    </vx-card>
</div>
</template>

    
<script>
import Vue from "vue";
import axios from "axios";
import imprimirMixin from "@/mixins/Pedidosmix";
import vSelect from "vue-select";
export default {
    mixins: [imprimirMixin],
    data() {
        return {
            arregloLibros: [],
            Proveedores: [],
            MovimientoProducto: [],
            datosSeleccionadoLibros: [],
            infoPedido: {
                libro: '',
            },
            LetraIngreso: "",
            NombreIngreso: "",
            PeriodoUser: "",
            cantidadAnterior: 0,
            showExportComponent: false,
            IngresoEgresoReporte: [],
            MovimientoEgreso: [],
            nombrearchivo: '',
        };
    },
    components: {
        "v-select": vSelect,
        // VueHtml2pdf
    },
    props: {
        usuario: {
            type: Object,
            default: function () {
                return {}
            }
        },
        idmovimiento: {
            type: Object,
            default: function () {
                return {}
            }
        },
        CompletoIngreso: {
            default: '',
        },
        SecuencialIngreso: {
            default: '', // Asigna el valor por defecto aquí
        },
        verificacionIngresoEgreso: {
            default: '', // Asigna el valor por defecto aquí
        },
    },
    mounted() {
        console.log(this.idmovimiento, "hhhhh");
        this.generateActaPDF();
        // this.setupButton();
    },
    methods: {
        generateActaPDF() {
            this.showExportComponent = false;
            console.log(this.verificacionIngresoEgreso, "verifiacioningresoegreso");
            if (this.verificacionIngresoEgreso == 1) {
                this.nombrearchivo = 'Reporte_Movimiento_Ingreso_' + this.idmovimiento.fmp_id;
                this.getMovimientoProducto_IngresoReporte();
            } else if (this.verificacionIngresoEgreso == 2) {
                this.nombrearchivo = 'Reporte_Movimiento_Egreso_' + this.idmovimiento.fmp_id;
                this.getMovimientoProducto_IngresoReporte();
            } else {
                console.log("Verificacion no validada.")
            }
        },
        getMovimientoProducto_IngresoReporte() {
            let me = this;
            console.log(me.idmovimiento.fmp_id, "sssssssssssss");
            me.IngresoEgresoReporte = [];
            me.$vs.loading()
            me.$http.get(this.$server_url + 'reporteIngresoDetalleMovimientoProductos?fmp_id=' + me.idmovimiento.fmp_id)
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    me.IngresoEgresoReporte = res.data.filter(p => p.fmdp_tipo_bodega != 3);
                    me.$vs.loading.close();
                    me.showExportComponent = true;
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close()
                })
        },
    },
};
</script>

    
<style scoped>
@media print {
    .footer-autorizado {
        page-break-before: always;
        display: block;
        text-align: center;
        margin-top: 200px;
        font-size: 12px;
    }

    .last-page-footer {
        display: block;
    }

    .non-last-page-footer {
        display: none;
    }
}
</style>
