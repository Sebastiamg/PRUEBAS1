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
            <b style="font-size: 17px;" v-if="verificacionIngresoEgreso == 3">COMBOS</b>
        </div>
        <br>
        <br>
        <table>
            <tr>
                <table>
                    <tr>
                        <td width="700">
                            <p class="margintd"><b>Codigo Documento:</b> {{ idmovimiento.fmp_id }}</p>
                        </td>
                        <td width="500">
                            <p class="margintd"><b>Fecha:</b> {{ idmovimiento.dupdatedmov }}</p>
                        </td>
                    </tr>
                    <tr>
                        <td>
                            <p class="margintd"><b>Items:</b> {{ CombosReporte.length }}</p>
                        </td>
                    </tr>
                </table>
            </tr>
        </table>
        <br>
        <br>
        <div align="center">
            <table style="border: 1px solid #000;font-size: 11px;margin-top: 15px;" v-for="(tr, key) in CombosReporte" :key="key">
                <thead>
                    <tr>
                        <td colspan="5" style="border-right: 1px solid #000;" width="100">
                            <div align="center">
                                <b>Código combo: </b>{{ tr.pro_codigo_general }}
                            </div>
                        </td>
                    </tr>
                    <tr style="border: 1px solid #000;font-size: 11px; text-align: center;">
                        <td style="border-right: 1px solid #000;" width="100"><b>CANTIDAD</b></td>
                        <td style="border-right: 1px solid #000;" width="100"><b>CODIGO ASOCIADO</b></td>
                        <td style="border-right: 1px solid #000;" width="300"><b>DETALLE</b></td>
                        <td style="border-right: 1px solid #000;" width="200"><b>BODEGA</b></td>
                        <td style="border-right: 1px solid #000;" width="100"><b>TIPO BODEGA</b></td>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(sub, subKey) in tr.subcodigos" :key="subKey" style="border: 1px solid #000;font-size: 11px; text-align: center;">
                        <td style="border-right: 1px solid #000;">{{ sub.fmdp_cantidad }}</td>
                        <td style="border-right: 1px solid #000;">{{ sub.pro_codigo }}</td>
                        <td style="border-right: 1px solid #000;">
                            {{ sub.pro_nombre }}
                        </td>
                        <td style="border-right: 1px solid #000;">
                            <span v-if="sub.descripcion_corta == null">RESERVAR</span>
                            <span v-else>{{ sub.descripcion_corta }}</span>
                        </td>
                        <td style="border-right: 1px solid #000;">
                            <p v-if="sub.fmdp_tipo_bodega == 1">Notas</p>
                            <p v-if="sub.fmdp_tipo_bodega == 2">Facturas</p>
                            <p v-if="sub.fmdp_tipo_bodega == 3">Reservar</p>
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
            CombosReporte: [],
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
            if (this.verificacionIngresoEgreso == 3) {
                this.nombrearchivo = 'Reporte_Movimiento_Combo_' + this.idmovimiento.fmp_id;
                this.getMovimientoProducto_IngresoReporte();
            } else {
                console.log("Verificacion no validada.")
            }
        },
        getMovimientoProducto_IngresoReporte() {
            let me = this;
            console.log(me.idmovimiento.fmp_id, "sssssssssssss");
            me.CombosReporte = [];
            me.$vs.loading();

            me.$http.get(this.$server_url + 'reporteCombosDetalleMovimientoProductos?fmp_id=' + me.idmovimiento.fmp_id)
                .then(res => {
                    // Obtener los códigos generales únicos
                    let codigosGenerales = [
                        ...new Set(
                            res.data
                            .filter(p => p.fmdp_tipo_bodega != 3) // Excluir tipo bodega RESERVAR
                            .filter(p => p.fmdp_tipo_codigo_combo === "codigo_combo") // Obtener solo los códigos generales
                            .sort((a, b) => a.fmdp_id - b.fmdp_id) // Ordenar por fmdp_id ascendente
                            .map(p => p.pro_codigo)
                        )
                    ];

                    // Buscar los registros que tienen un pro_codigo igual al pro_codigo_general
                    let registrosConCodigoGeneral = res.data.filter(p => p.fmdp_tipo_bodega != 3 && codigosGenerales.includes(p.pro_codigo));

                    // Agrupar y ordenar por código general
                    let agrupados = codigosGenerales.map(codigoGeneral => {
                        // Filtrar todos los registros que pertenecen a este código general
                        let subcodigos = res.data
                            .filter(p => p.fmdp_tipo_bodega != 3) // Excluir tipo bodega RESERVAR
                            .filter(p => p.fmdp_tipo_codigo_combo === codigoGeneral); // Traemos todos los subcódigos para este código general

                        // Filtrar los registros que coinciden con el pro_codigo_general (el mismo código que el general)
                        let codigoGeneralRegistro = registrosConCodigoGeneral
                            .filter(p => p.pro_codigo === codigoGeneral)
                            .sort((a, b) => {
                                // Primero, ordenamos por pro_codigo
                                if (a.pro_codigo !== b.pro_codigo) {
                                    return a.pro_codigo.localeCompare(b.pro_codigo); // Orden ascendente por pro_codigo
                                }
                                // Si los pro_codigo son iguales, ordenamos por fmdp_id
                                return a.fmdp_id - b.fmdp_id; // Orden ascendente por fmdp_id (numérico)
                            });
                        // Los demás subcódigos, ordenados por pro_codigo ascendente
                        let otrosSubcodigos = subcodigos.filter(p => p.pro_codigo !== codigoGeneral)
                            .sort((a, b) => {
                                // Primero, ordenamos por pro_codigo
                                if (a.pro_codigo !== b.pro_codigo) {
                                    return a.pro_codigo.localeCompare(b.pro_codigo); // Orden ascendente por pro_codigo
                                }
                                // Si los pro_codigo son iguales, ordenamos por fmdp_id
                                return a.fmdp_id - b.fmdp_id; // Orden ascendente por fmdp_id (numérico)
                            });
                        // Combinar los registros con el código general al principio y los demás subcódigos
                        return {
                            pro_codigo_general: codigoGeneral,
                            subcodigos: [...codigoGeneralRegistro, ...otrosSubcodigos] // Primero los que coinciden, luego los demás
                        };
                    });

                    me.CombosReporte = agrupados;

                    console.log(me.CombosReporte); // Verifica la estructura en consola
                    me.$vs.loading.close();
                    me.showExportComponent = true;
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
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
