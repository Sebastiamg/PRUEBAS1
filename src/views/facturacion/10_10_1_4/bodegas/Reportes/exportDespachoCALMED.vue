<template>
    <div>
        <div class="overflow-y-auto h-auto">
            <h5 class="text-center font-bold">HOJA DE DESPACHO DIARIA</h5>
            <br>
            Día de despacho: {{ fecha }}
            <div class="row">
                <table class="tabla2" style=" width: 95%; border-collapse: collapse; border: none; font-size: 11px; margin-top: 15px;">
                    <tbody v-for="(tr,key) in datosReporte" :key="key" style="border: 2px solid #000000">
                        <tr style="border: 0.5px solid #333232">
                            <td colspan="7" width="10000" style="text-align: center;border: 0.5px solid #333232"><b>{{ tr.remi_num_factura }}</b></td>
                        </tr>
                        <tr style="border: 0.5px solid #333232">
                            <td colspan="7" width="10000" style="text-align:justify;border: 0.5px solid #333232">
                                <p><b>Cliente:</b> {{ tr.remi_destinatario }}</p>
                                <p><b>RUC / C.I. :</b> {{ tr.remi_ruc_destinatario}}</p>
                                <p><b>Teléfono: </b> {{ tr.telefono}}</p>
                                <p><b>Destino: </b> {{ tr.ciudad  }} - {{ tr.remi_direccion }}</p>
    
                            </td>
                        </tr>
                        <tr style="border: 0.5px solid #333232">
                            <td style="border: 0.5px solid #333232"><b>Empaques:</b></td>
                            <td style="border: 0.5px solid #333232"><b>Caja grande</b></td>
                            <td style="border: 0.5px solid #333232"><b>Caja pequeña</b></td>
                            <td style="border: 0.5px solid #333232"><b>Paquete</b></td>
                            <td style="border: 0.5px solid #333232"><b>Sobre</b></td>
                            <td style="border: 0.5px solid #333232"><b>TOTAL CAJAS</b></td>
                            <td style="border: 0.5px solid #333232"><b>TOTAL</b></td>
                        </tr>
                        <tr style="border: 0.5px solid #333232">
                            <td style="border: 0.5px solid #333232">
                                <b>Cantidad:</b>
                            </td>
                            <td style="border: 0.5px solid #333232">
                                {{ tr.remi_carton}}
                            </td>
                            <td style="border: 0.5px solid #333232">
                                {{ tr.remi_rollo}}
                            </td>
                            <td style="border: 0.5px solid #333232">
                                {{ tr.remi_paquete }}
                            </td>
                            <td style="border: 0.5px solid #333232">
                                {{ tr.remi_funda }}
                            </td>
                            <td style="border: 0.5px solid #333232">
                                {{ parseInt(tr.remi_carton)+parseInt(tr.remi_rollo)}}
                            </td>
                            <td style="border: 0.5px solid #333232">
                                {{ parseInt(tr.remi_carton)+parseInt(tr.remi_rollo)+parseInt(tr.remi_paquete)+parseInt(tr.remi_funda)}}
                            </td>
                        </tr>
                        <tr style="border: 0.5px solid #333232">
                            <td colspan="3" style="text-align:justify;border: 0.5px solid #333232">
                                <b>Empresa de Transporte:</b> {{ tr.trans_nombre }}
                            </td>
                            <td colspan="2" style="text-align:justify;border: 0.5px solid #333232">
                                <b>Tipo de Flete: </b>
                                <span v-if="tr.remi_flete == 1"><b>Al cobro</b></span>
                                <span v-else-if="tr.remi_pagado == 1"><b>Pagado</b></span>
                                <span v-else><b>Ninguno</b></span>
                            </td>
                            <td colspan="2" style="text-align:justify;border: 0.5px solid #333232">
                                <b class="m-2">N° de Guía:</b> {{ tr.remi_guia_remision }}
                            </td>
                        </tr>
                        <tr style="border: 0.5px solid #333232">
                            <td colspan="3" style="text-align:justify;border: 0.5px solid #333232">
                                <p style="text-align: left"><b>Observación: </b> {{ tr.remi_obs }}</p>
                            </td>
                            <td colspan="2" style="text-align:justify;border: 0.5px solid #333232">
                                <p style="text-align: left"><b>ENVIADO: </b> {{ tr.remi_fecha_inicio }}</p>
                            </td>
                            <td colspan="2" style="text-align:justify;border: 0.5px solid #333232">
                                <p style="text-align: left"><b>Responsable: </b> {{ tr.remi_nombre_transportista }}</p>
                            </td>
                        </tr>
                        <tr v-if="guiaValidate" style="border: 0.5px solid #333232">
                            <td colspan="7" style="text-align: center;border: 0.5px solid #333232">
                                <p style="text-align: left"><b>Guia Remision: </b> {{ tr.remi_guia_remision }}</p>
                                <div class="box-input" v-if="tr.url">
                                    <div class="flex" style="justify-content: center;">
                                        <div class="flex" style="flex-direction: column;">
                                            <img id="img1" width="200" class="img-responsive mb-2 ml-1" :src="$data_url+'archivos/remision/guias/'+tr.url" style="border-radius: 5px;margin: 0 auto;">
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                
                <br />
                <table class="tabla2" style=" width: 95%; border-collapse: collapse; border: none; font-size: 11px; margin-top: 15px;">
                    <tbody style="border: 2px solid #000000">
                        <tr style="border: 0.5px solid #333232">
                            <th class="m-2"><b>Cantidad despachos # </b></th>
                            <th class="m-2">Empaques:</th>
                            <th class="m-2">Cajas grandes</th>
                            <th class="m-2">Cajas pequeñas</th>
                            <th class="m-2">Paquetes</th>
                            <th class="m-2">Sobres</th>
                            <th class="m-2"><b>TOTAL EMPAQUES</b></th>
                        </tr>
                        <tr style="border: 0.5px solid #333232">
                            <td><b>{{datosReporte.length}}</b></td>
                            <td>Cantidad: </td>
                            <td>{{ total }}</td>
                            <td>{{ total1 }}</td>
                            <td>{{ total2 }}</td>
                            <td>{{ total3 }}</td>
                            <td>
                                {{ (parseInt(total)||0)+(parseInt(total1)||0)+(parseInt(total2)||0)+(parseInt(total3)||0) }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    </template>
    
    <script>
    export default {
        data() {
            return {
                nombrearchivo: '',
                popupCarga: false,
                fecha: '',
                datosReporte: '',
                guiaValidate: false,
            }
        },
        props: {
            datos: {
                type: Array,
                default: () => [],
            },
            conguia:{
                type: Boolean,
                default: false
            },
        },
        watch:{
            conguia(val){
                this.guiaValidate = val
            }
        },
        created() {
            let me = this;
            me.fecha = me.mostrarFechayhora();
        },
        computed: {
            total() {
                if (!Array.isArray(this.datosReporte)) return 0;
                return this.datosReporte.reduce((prev, curr) => prev + (parseInt(curr.remi_carton) || 0), 0);
            },
            total1() {
                if (!Array.isArray(this.datosReporte)) return 0;
                return this.datosReporte.reduce((prev, curr) => prev + (parseInt(curr.remi_rollo) || 0), 0);
            },
            total2() {
                if (!Array.isArray(this.datosReporte)) return 0;
                return this.datosReporte.reduce((prev, curr) => prev + (parseInt(curr.remi_paquete) || 0), 0);
            },
            total3() {
                if (!Array.isArray(this.datosReporte)) return 0;
                return this.datosReporte.reduce((prev, curr) => prev + (parseInt(curr.remi_funda) || 0), 0);
            },
        },
        mounted() {
            let me = this;
            me.datosReporte = me.datos;
            me.guiaValidate = me.conguia;
        },
        methods: {
            mostrarFechayhora: function () {
                const date = new Date();
                const formatear =
                    date.getFullYear() +
                    "-" +
                    ("0" + (date.getMonth() + 1)).slice(-2) +
                    "-" +
                    ("0" + date.getDate()).slice(-2) +
                    " " +
                    ("0" + date.getHours()).slice(-2) +
                    ":" +
                    ("0" + date.getMinutes()).slice(-2) +
                    ":" +
                    ("0" + date.getSeconds()).slice(-2);
    
                return formatear;
            },
            verificacionparaimprimir() {
                let me = this;
                if (this.datosReporte.length > 0) {
                    setTimeout(() => {
                        setTimeout(function () {
                            me.$vs.notify({
                                text: "Archivo descargado correctamente",
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-file',
                                time: 2000
                            })
                        }, 4000); // Espera 3 segundos después de imprimirEval()
                    }, 500);
                } else {
                    console.log("No hay nada que imprimir entro a else")
                    me.$vs.notify({
                        text: "No hay nada para imprimir en el reporte",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                }
            },
        }
    }
    </script>
    
    <style scoped>
    .html2canvas-container {
        width: 3000px !important;
        height: 3000px !important;
    }
    
    * {
        font-family: Arial;
    }
    
    #ultimo-elemento {
        margin-top: 300px;
    }
    
    .letra {
        padding: 0px 60px 0px 0px;
        font-size: 11px;
        margin-left: 35px;
    }
    
    .letra2 {
        font-size: 12px;
    }
    
    .letra3 {
        display: flex;
        font-size: 11px;
        margin-left: 35px;
    }
    
    .letra4 {
        margin-top: 15px;
        margin-left: 55px;
        font-size: 11px;
    }
    
    .letra5 {
        display: flex;
        justify-content: space-evenly;
        width: 90%;
        margin-left: 35px;
        font-size: 11px;
        margin-top: 105px;
    }
    
    .tabla1 {
        table-layout: fixed;
        width: 95%;
        border-collapse: collapse;
        border: none;
        margin-left: 15px;
    }
    
    .tabla2 {
        /*table-layout: fixed;*/
        width: 95%;
        border-collapse: collapse;
        border: none;
        font-size: 11px;
        margin-top: 15px;
        /* border: 1px solid #000000; */
    }
    
    .sp25 {
        margin-top: 25px;
    }
    
    .sp55 {
        margin-top: 55px;
    }
    
    .-mt20 {
        margin-top: -20px;
    }
    
    @media print {
        td {
            page-break-before: always;
        }
    
        p {
            page-break-before: always;
        }
    }
    
    .encabezado,
    td,
    th {
        border: 1px solid rgb(39, 39, 39);
        text-align: center;
        border-spacing: 0;
    }
    
    thead {
        border: 2px solid #000000
    }
    
    .rotar {
        font-size: 8px;
        /* writing-mode: vertical-lr;
           transform: rotate(180deg); */
    }
    
    .font1 {
        font-size: 8px;
    }
    
    tr {
        border: 0.5px solid #333232
    }
    
    td {
        border: 0.5px solid #333232
    }
    
    tbody {
        border: 2px solid #000000
    }
    </style>
    