<template>
<div>
    <vs-row class="mt-5">
        <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-table max-items="10" :data="arregloActas" stripe>
                <!-- <vs-table  multiple v-model="seleccionados" max-items="20" :data="arregloActas"> -->
                <template slot="header">
                    <span>Cantidad: {{ arregloActas.length }}</span>
                </template>
                <template slot="thead">
                    <vs-th>Detalles ACTA #</vs-th>
                    <!-- <vs-th>Fecha Acta</vs-th>
                    <vs-th>Observación</vs-th> -->
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <!-- <vs-td> {{ tr.ven_codigo }} </vs-td>
                        <vs-td> {{ tr.ven_fecha }} </vs-td>
                        <vs-td> {{ tr.ven_observacion }} </vs-td> -->
                        <vs-td> 
                            <b> {{ tr.ven_codigo }} </b> <br>
                            <b>Fecha:</b> {{ tr.ven_fecha }} <br>
                            <b>Observación: </b>{{ tr.ven_observacion }} <br>
                            <b>Descuento:</b> {{ tr.ven_desc_por }}%
                        </vs-td>
                        <vs-td>
                            <!-- <vs-button class="w-full" color="success" icon-pack="feather" icon="icon-file" type="line" @click="selectedActa = tr ;generateActaPDF(tr)">Documento PDF</vs-button> -->
                            <!-- <vs-button class="w-full" color="success" icon-pack="feather" icon="icon-file" type="line" @click="selectedActa = tr ;generateActaPDF(tr)">Documento
                                    PDF</vs-button> -->
                            <vs-button class="w-full" color="success" icon-pack="feather" icon="icon-file" type="line" @click="selectedActa = tr ; getDocumentos(tr.ven_codigo, tr.id_empresa)">Documento PDF</vs-button> -
                            <vs-button class="w-full mt-2" color="primary" icon-pack="feather" icon="icon-download" type="line" @click="documentoCambioPorcentaje = tr; porcentaje_detalle = tr.ven_desc_por; popupcambioPorcentaje = true;">Cambio de Porcentaje</vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-col>
    </vs-row>
    <vs-row vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                <vs-button color="success" v-if="(usuario.id_group == 22 ||  usuario.id_group == 23 || usuario.id_group == 1) && arregloActas.length > 100000000000" @click="AbrirDatosDetalle()" type="filled">Detalle aprobados</vs-button>
            </vs-col>
        </vs-row>
    </vs-row>
    <!-- <pre>{{ seleccionados }}</pre> -->
    <vs-row>
        <!--DATOS DETALLE-->
        <vs-popup class="holamundo" title="Observacion Detalle" :active.sync="popupDatosDetalle">
            <vs-row>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <vs-textarea label="Observación:" placeholder="Escribe..." class="w-full" v-model="observacion_detalle" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br>
            <vs-row>
                <vs-button @click="guardarDatosDetalle();" type="relief" color="success">Guardar</vs-button>&emsp;
            </vs-row>
        </vs-popup>
        <div v-if="popupDetallePedidoLibroObsequio">
            <exportDetalleLibrosObsequios style="display:none;" :observacion_detalle="observacion_detalle" :tipoFile="tipoFile" :librosObsequios="librosObsequios" @change="changeHandle" />
        </div>
    </vs-row>
    <!-- <vs-popup fullscreen class="reporte" :title="`Documento ${selectedActa.ven_codigo}`" :active.sync="popupReportePdf">
            <div align="center" class="mb-3">
                <vs-button @click="m_imprimirTodos('12px',selectedActa.ven_codigo ,'0px','')">Imprimir</vs-button>
            </div>
            <div v-if="librosObsequios.porcentaje_descuento < 100">
                <vx-card id="seccionImprimir2" v-if="librosObsequios.porcentaje_descuento < 100">
                    <p style="text-align: center;font-weight: bold;">{{nombreEmpresaActual}}</p>
                    <table style="width: 100%; border-collapse: collapse; border: none;">
                        <tr style="border: none;">
                            <td style="border: none; width: 25%; padding-left: 20px; vertical-align: top;">
                                <span v-if="datosReporteActa.empresaid == 3">
                                    <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/66be7af7ced27grupo_calmed.png" style="width: 100px;">
                                </span>
                                <span v-if="datosReporteActa.empresaid == 1">
                                    <img src="https://data.prolipadigital.com.ec/archivos/facturacion/empresa/663d3f5a3be25logo-Prolipa-1.png" style="width: 150px;">
                                </span>
                            </td>
                            <td style="border: none; width: 20%; text-align: center;">
                                <h5 class="text-start font-bold" style="font-weight: bold; font-size: 16px; margin: 0;">
                                    NOTA DE ENTREGA
                                </h5>
                            </td>
                            <td style="border: none; width: 10%; text-align: center;">
                                <h5 class="font-bold" style="font-weight: bold; font-size: 16px; margin: 0;">
                                    V
                                </h5>
                            </td>
                            <td style="border: none; width: 35%; text-align: right; padding-right: 70px;">

                                <h5 class="text-center font-bold" style="font-weight: bold; font-size: 16px; margin: 0;">
                                    {{ selectedActa.ven_codigo }}

                                </h5>
                            </td>
                        </tr>
                    </table>
                    <table class="tabla45" style="width: 100%; border-collapse: collapse; border: none; text-align: start;">
                        <tr>
                            <td colspan="4" style="height: 20px; border: none;"></td>
                        </tr>
                        <tr style="border: none;">
                            <td style="border: none; text-align: left; padding-left:0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;"><b>Fecha de emisión:</b></p>
                            </td>
                            <td style="border: none; text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;">{{ selectedActa.ven_fecha }}</p>
                            </td>
                            <td colspan="2" style="border: none;">{{datosReporteActa.facturador}}</td>
                        </tr>
                        <tr style="border: none;">
                            <td style="border: none; text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;"><b>Cliente:</b></p>
                            </td>
                            <td style="border: none; text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;">{{ datosReporteActa.cliente }}</p>
                            </td>
                            <td style="border: none; text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;"><b>R.U.C./C.I.:</b></p>
                            </td>
                            <td style="border: none; text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;">{{ datosReporteActa.identificacionCliente }}</p>
                            </td>
                        </tr>
                        <tr style="border: none;">
                            <td style="border: none; text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;"><b>Atención:</b></p>
                            </td>
                            <td style="border: none; text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;">{{ datosReporteActa.institucionNombre }}</p>
                            </td>
                            <td style="border: none; text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;"><b>Dirección:</b></p>
                            </td>
                            <td style="border: none; text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;">{{ datosReporteActa.direccion }}</p>
                            </td>
                        </tr>
                        <tr style="border: none;">
                            <td style="border: none; text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;"><b>Telf:</b></p>
                            </td>
                            <td style="border: none; text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;">{{ datosReporteActa.telefono }}</p>
                            </td>
                            <td style="border: none;text-align: left; padding-left: 0px;">
                                <p class="letra" style="font-size: 11px; margin: 0;"><b>Cod. promotor/Vendedor:</b></p>
                            </td>
                            <td style="border: none; text-align: left; padding-left: 0;">
                                <p class="letra" style="font-size: 11px; margin: 0;">{{ datosReporteActa.asesor }}</p>
                            </td>
                        </tr>
                        <tr style="border: none;">
                            <td colspan="4" style="height: 20px; border: none;"></td>
                        </tr>
                    </table>
                    <b>{{ selectedActa.ven_p_libros_obsequios?'HIJOS DOCENTES':'' }}</b>
                    <br>
                    <table class="tabla3" style="width: 100%; border-collapse: collapse; border: none; text-align: start;">
                        <thead>
                            <tr>
                                <td colspan="1"><b>COD.</b></td>
                                <td colspan="1"><b>CANT.</b></td>
                                <td colspan="1"><b>DESCRIPCION</b></td>
                                <td colspan="1" style="text-align: center"><b>V. UNIT.</b></td>
                                <td colspan="1" style="text-align: center"><b>V. TOTAL</b></td>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(tr,key) in arregloLibros" :key="key">
                                <td>{{ tr.pro_codigo }} </td>
                                <td>{{ tr.det_ven_cantidad }} </td>
                                <td v-if="tr.id_serie === 19">
                                    {{ tr.nombreproducto}} <br>
                                    <b>Descripción Combo:</b> {{ tr.descripcionlibro }}
                                </td>
                                <td v-else>
                                    {{ tr.nombreproducto }}
                                </td>
                                <td style="text-align: center">{{ (tr.det_ven_valor_u).toFixed(2) }} </td>
                                <td style="text-align: center">{{ (calcularSubTotal(tr)).toFixed(2) }} </td>
                            </tr>
                        </tbody>
                    </table>
                    <br><br>
                    <table style="width: 100%; border-collapse: collapse; border: none; text-align: left;">
                        <tr>
                            <td style="width: 70%; vertical-align: top;">
                                <table style="width: 100%; border-collapse: collapse; border: none; text-align: left;">
                                    <tr>
                                        <td style="padding-right: 10px; width: 100px; font-size: 11px; vertical-align: top;">
                                            <b>Observaciones:</b>
                                        </td>
                                        <td style="font-size: 11px; vertical-align: top;">
                                            <p>{{ datosReporteActa.observacionFacturador }}</p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                            <td style="width: 30%; vertical-align: top; padding-right: 20px;">
                                <table class="tableSub" style="width: 100%; border-collapse: collapse; border: none; text-align: left;">
                                    <tr>
                                        <td style="width: 100px; padding: 5px 0;"><b>Suman</b></td>
                                        <td style="width: 50px; padding: 5px 5px; text-align: left">{{ formatNumber(total) }}</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 100px; padding: 5px 0;"><b>Desc.{{librosObsequios.porcentaje_descuento}}%</b></td>
                                        <td style="width: 50px; padding: 5px 5px;text-align: left">{{ formatNumber(valorDescuento) }}</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 100px; padding: 5px 0;"><b>Sub. Total</b></td>
                                        <td style="width: 50px; padding: 5px 5px;text-align: left">{{ formatNumber(subtotal-valorDescuento) }}</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 100px; padding: 5px 0;"><b>Transporte</b></td>
                                        <td style="width: 50px; padding: 5px 5px;text-align: left">0.00</td>
                                    </tr>
                                    <tr>
                                        <td style="width: 100px; padding: 5px 0;"><b>TOTAL</b></td>
                                        <td style="width: 50px; padding: 5px 5px;text-align: left">{{ formatNumber(valorTotal) }}</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <br><br><br><br><br><br>
                    <div>
                        <div>
                            <div style="font-size: 11px; float: left; text-align: center; border-top: solid 1px black; margin-left: 80px; padding: 0px 15px;">
                                <b>Deudor / Recibí Conforme</b>
                            </div>
                            <div style="font-size: 11px; float: right; text-align: center; border-top: solid 1px black; margin-right: 80px; padding: 0px 30px;"><b>Entregué Conforme</b></div>
                        </div>
                    </div>
                </vx-card>
            </div>
            <div v-if="librosObsequios.porcentaje_descuento==100">
                <vx-card id="seccionImprimir2" v-if="librosObsequios.porcentaje_descuento==100">
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
                    <table style="border: none; text-align: start; border-collapse: collapse; width:80%; margin-left: 35px">
                        <tr style="border: none;">
                            <td style="border: none; text-align: start; padding: 0; width: auto;">
                                <p style="font-size: 11px; margin: 0;">
                                    <b>INSTITUCIÓN BENEFICIADA:</b>
                                </p>
                            </td>
                            <td style="border: none; text-align: left; padding: 0;" colspan="2">
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
                            <td style="border: none; text-align: left; padding: 0;" colspan="2">
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
                            <td style="border: none; text-align: left; padding: 0;">
                                <p style="font-size: 11px; margin: 0;">
                                    {{ datosReporteActa.identificacionCliente }}
                                </p>
                            </td>
                            <td style="border: none; text-align: start; padding: 0; width: auto;">
                                <p style="font-size: 11px; margin: 0;">
                                    <b>TELF:</b>
                                </p>
                            </td>
                            <td style="border: none; text-align: left; padding: 0;">
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
                            <td style="border: none; text-align: left; padding: 0;">
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
                            <td style="border: none; text-align: left; padding: 0;">
                                <p style="font-size: 11px; margin: 0;">
                                    {{ datosReporteActa.asesor }}
                                </p>
                            </td>
                            <td style="border: none; text-align: start; padding: 0;"></td>
                            <td style="border: none; text-align: start; padding: 0;"></td>
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
                    <br><br>
                    <p style="padding: 0px 60px 0px 0px; font-size: 11px; margin: 0; margin-left: 35px; margin-top: 15px;"> <b>OBSERVACIÓN :</b> {{ datosReporteActa.observacionFacturador }} </p>
                    <br>
                    <div>
                        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
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
                    <br>
                    <p style="padding: 0px 60px 0px 0px; font-size: 11px; margin: 0; margin-left: 35px; margin-top: 15px;">
                        <b>Elaborado por:</b> {{ datosReporteActa.facturador}}
                    </p>
                </vx-card>
            </div>
        </vs-popup> -->
    <vs-popup fullscreen v-if="popupDocumento" :title="'Detalle:'" :active.sync="popupDocumento" class="popopPadre">
        <div v-if="popupDocumento">
            <documentoVenta :DocumentoVenta="DocumentoVenta[0]" :DocumentoDetalleVenta="DocumentoDetalleVenta"/>
        </div>
    </vs-popup>
    <!--Cambio porcentaje-->
    <vs-popup class="popopPadre" :title="`Cambio porcentaje ${documentoCambioPorcentaje.ven_codigo}`" :active.sync="popupcambioPorcentaje">
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <vs-input max="100" label="Porcentaje de descuento:" class="w-full" v-model="porcentaje_detalle" type="number" min="0" @input="porcentaje_detalle = Math.min(100, Math.max(0, porcentaje_detalle))"/>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <br>
        <vs-row>
            <vs-button @click="guardarCambioPorcentaje();" type="relief" color="success">Guardar</vs-button>&emsp;
        </vs-row>
    </vs-popup>
</div>
</template>

    
<script>
import VueHtml2pdf from "vue-html2pdf";
import exportLibrosObsequios from "./exportLibrosObsequios";
import exportDetalleLibrosObsequios from "./exportDetalleLibrosObsequios";
const documentoVenta = () => import('@/views/pedidos2/pedidos/proforma/documentoVenta.vue');
import imprimirMixin from "@/mixins/Pedidosmix";
export default {
    mixins: [imprimirMixin],
    components: {
        VueHtml2pdf,
        exportLibrosObsequios,
        exportDetalleLibrosObsequios,
        documentoVenta,
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
            popupReportePdf: false,
            observacion_detalle: "",
            seleccionados: [],
            total: 0,
            valorDescuento: 0,
            subtotal: 0,
            valorTotal: 0,
            nombreEmpresaActual: '',
            //imprimir
            DocumentoDetalleVenta: [],
            DocumentoVenta: [],
            popupDocumento: false,

            //cambio porcentaje
            popupcambioPorcentaje: false,
            porcentaje_detalle: '',
            documentoCambioPorcentaje: '',
        };
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    props: {
        librosObsequios: {
            type: Object,
            default: {},
        },
    },
    mounted() {
        this.getLibros();
        this.empresaActual()
    },
    methods: { 
        guardarCambioPorcentaje() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'Post_ActualizarPorcentaje_VentaActa?id_empresa=' + me.documentoCambioPorcentaje.id_empresa + '&ven_codigo=' + me.documentoCambioPorcentaje.ven_codigo + '&ven_desc_por=' + me.porcentaje_detalle)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    me.popupcambioPorcentaje = false;
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-check-circle'
                    })
                    this.$emit('retorn');
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        getDocumentos(documentos, empresa) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentos=yes&documentos=' + documentos + '&empresa=' + empresa)
                .then((res) => {
                    me.DocumentoVenta = res.data;
                    if (me.DocumentoVenta.length > 0) {
                        let codigo = me.DocumentoVenta[0].ven_codigo;
                        let empresa = me.DocumentoVenta[0].empresa_id;
                        this.getDocumentosDetalles(codigo, empresa);
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Documento no encontrado.',
                            type: 'error',
                        });
                    }

                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los documentos.',
                        type: 'error',
                    });
                    me.$vs.loading.close();
                });
        },
        getDocumentosDetalles(codigo, empresa) {
            let me = this;
            // console.log(codigo, empresa,'dsdsadsaddsa');
            me.$vs.loading();
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentosDetalles=yes&codigo=' + codigo + '&empresa=' + empresa)
                .then((res) => {
                    this.DocumentoDetalleVenta = res.data;
                    if (this.DocumentoDetalleVenta.length > 0) {
                        this.popupDocumento = true;
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Detalle Documento no encontrado.',
                            type: 'error',
                        });
                    }
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los detalles de los documentos.',
                        type: 'error',
                    });
                    me.$vs.loading.close();
                });
        },
        async empresaActual() {
            await this.$http.get(this.$server_url + 'empresaActual')
                .then(res => {
                    this.nombreEmpresaActual = res.data[0].descripcion_corta;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        formatNumber(value) {
            return parseFloat(value).toFixed(2);
        },
        calcularSubTotal(tr) {
            return tr.det_ven_cantidad * tr.det_ven_valor_u;
        },
        calcularTotal() {
            let total = 0;
            let totalLibros = 0;
            for (let i = 0; i < this.arregloLibros.length; i++) {
                total += this.calcularSubTotal(this.arregloLibros[i]);
            }
            for (let i = 0; i < this.arregloLibros.length; i++) {
                totalLibros += this.arregloLibros[i].det_ven_cantidad;
            }
            this.total = total;
            let descuento = this.librosObsequios.porcentaje_descuento
            this.valorDescuento = (total * descuento) / 100

            this.subtotal = total

            this.valorTotal = total - this.valorDescuento
        },
        generateActaPDF(acta) {
            this.selectedActa = acta;
            this.datosReporteActa = {};
            this.arregloLibros.splice(0, this.arregloLibros.length);
            this.showExportComponent = false;
            this.reporteLibrosObsequiosActa(this.selectedActa.ven_codigo, this.selectedActa.id_empresa);
        },
        getLibros() {
            this.$vs.loading();
            this.$http
                .get(this.$server_url + "obtenerDocumentosLibrosObsequios/" + this.librosObsequios.id)
                .then((res) => {
                    // this.arregloActas = res.data.filter(p=> p.id_empresa == 7); hecho para comprobar el boton de detalles de las actas
                    this.arregloActas = res.data;
                    this.porcentaje_descuento = this.arregloActas.length > 0 ? this.arregloActas[0].porcentaje_descuento : "";
                    this.$vs.loading.close();
                })
                .catch((error) => {
                    console.error(error);
                    this.$vs.loading.close();
                });
        },
        reporteLibrosObsequiosActa(acta, empresa) {
            let me = this;
            me.$vs.loading();
            this.$http
                .get(this.$server_url + "reporteLibrosObsequiosActa?ven_codigo=" + acta + "&empresa=" + empresa)
                .then((res) => {
                    me.datosReporteActa = res.data[0];
                    console.log(me.datosReporteActa);
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
                    this.calcularTotal();
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
        realizarDetalle(tipo) {
            let me = this;
            me.tipoFile = tipo
            me.popupDetallePedidoLibroObsequio = true
        },
        guardarDatosDetalle() {
            let me = this;
            me.realizarDetalle(1)
            me.popupDatosDetalle = false
        },
        AbrirDatosDetalle() {
            let me = this;
            me.observacion_detalle = '';
            me.popupDatosDetalle = true;
            // console.log("Número de elementos seleccionados:", me.seleccionados.length);
            // if(me.seleccionados.length != 0) { // Cambio aquí
            //   me.observacion_detalle = '';
            //   me.popupDatosDetalle = true;
            // } else {
            //   this.$vs.notify({
            //       text: 'Seleccione una Acta para el detalle.',
            //       color: 'danger',
            //       iconPack: 'feather',
            //       icon: 'icon-alert-triangle'
            //   });
            // }
        },
        changeHandle(e) {
            let me = this;
            me.popupDetallePedidoLibroObsequio = false
        },
    },
};
</script>

    
<style>
.popopPadre {
    z-index: 51008;
    /* Valor mayor que el del popup del padre */
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}

#table {
    font-family: Arial;
}

.letra {
    padding: 0px 60px 0px 0px;
    font-size: 11px;
    margin: 0;
    margin-left: 35px;
}

.letrax {
    padding: 0px 60px 0px 0px;
    font-size: 11px;
    margin: 0;
    margin-left: 10px;
}

.letra2 {
    padding: 0px 60px 0px 0px;
    font-size: 11px;
}

.letra3 {
    padding: 0px 60px 0px 0px;
    font-size: 11px;
    margin-right: 35px;
}

.letra4 {
    padding: 0px 60px 0px 0px;
    font-size: 11px;
    margin-right: 20px;
}

.tabla2 {
    table-layout: fixed;
    width: 90%;
    border-collapse: collapse;
    border: none;
    font-size: 11px;
    margin-top: 15px;
    margin-left: 45px;
}

table .tabla45 {
    table-layout: fixed;
    border-collapse: collapse;
}

@media print {
    td {
        page-break-before: always;
    }

    p {
        page-break-before: always;
    }
}

.tabla2 td,
.tabla2 th {
    border: 1px solid rgb(227, 227, 227);
    text-align: center;
    border-spacing: 0;
}

.tabla3 {
    table-layout: auto;
    width: 90%;
    border-collapse: collapse;
    border: none;
    font-size: 11px;
    margin-top: 15px;
    margin-left: 45px;
}

.tabla3 tr {
    text-align: center;
}

.tabla3 td {
    text-align: left;
}

.letraTabla {
    font-size: 11px;
}

.tableSub {
    table-layout: auto;
    font-size: 11px;
    margin-left: 15px;

}
</style>
