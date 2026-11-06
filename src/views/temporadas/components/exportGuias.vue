<template>
    <div>
        <div align="center">
            <!-- Parametros Imprimir: 1.-Tamaño general del texto, 2.- Nombre del archivo, 3.- Tamaño del borde td, 4.- Nombre Marca Agua-->
            <vs-button @click="imprimirEval()" style="font-size: 12px">Imprimir</vs-button>
        </div>
        <vx-card id="seccionImprimir2">
            <p style="margin-left: 45px;color: red;">Pedido #{{ id_pedido }}</p>
            <div class="vx-row" style="margin-left: 35px;">
                <div class="vx-col md:w-1/3 w-full mb-3">
                    <div class="label_inputs">Asesor</div>
                    <p style="font-weight: 500;" class="text-primary">{{pedido.asesor.nombres}}</p>
                </div>
                <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
                    <div class="label_inputs">Periodo</div>
                    <p>{{ nombrePeriodo }}</p>
                    <!-- <v-select disabled :options="periodos" :reduce="periodos => periodos" label="periodoescolar" v-model="pedido.periodo" class="w-full" /> -->
                </div>
                <div class="vx-col lg:w-1/3 md:w-full sm:w-full mb-3">
                    <div class="label_inputs">Fecha envío</div>
                    <p>{{ pedido.fecha_envio.substring(0,10) }}</p>
                </div>
                <div class="vx-col lg:w-full md:w-full sm:w-full mb-full">
                    <table>
                        <tr>
                            <td>Observación Asesor:</td>
                            <td>
                                <div v-if="pedido.observacion == null || pedido.observacion == ''">No tiene observación.</div>
                                <div v-else-if="pedido.observacion != null || pedido.observacion != ''">{{ pedido.observacion }}</div>
                            </td>
                        </tr>
                    </table>
                </div>
            </div>
            <div v-if="id_periodo > mixinIdInicioFormatoNewData">
                <div :key="index" v-for="(item, index) in series">
                    <div slot="header" class="text-center">
                        <table class="table_pedidos">
                            <tr>
                                <td style="border: 1.5px solid rgb(200, 200, 200); min-height: 20px">
                                    <b>SERIE {{ item.nombre_serie.toUpperCase() }}</b>
                                </td>
                            </tr>
                        </table>
                    </div>
                    <div class="w-full" style="overflow-x:auto;">
                        <table class="table_pedidos">
                            <thead>
                                <tr class="text-center" v-if="item.areas && item.areas.length">
                                    <td rowspan="3" style="width: 25%;"><b>Áreas</b></td>
                                    <td v-if="item.id_serie != 6" :colspan="maxLevelsCount(item.areas)" style="width: 65%;"><b>Niveles</b></td>
                                    <td v-else :colspan="1" rowspan="2" style="width: 65%;"><b>Libros</b></td> <!-- Cambiado a colspan="1" -->
                                    <td v-if="item.id_serie == 6" rowspan="2" style="width: 10%;"><b>Cantidad</b></td>
                                </tr>
                                <tr>
                                    <td v-if="item.id_serie != 6" v-for="(year, index) in maxLevel(item.areas)" :key="index" style="border: 1px solid rgb(227, 227, 227);" width="50">
                                        <div align="center">{{ year }}</div>
                                    </td>
                                </tr>
                                <tr>
                                    <td v-if="item.id_serie != 6" v-for="(year, index) in maxLevel(item.areas)" :key="'txt-' + index" style="border: 1px solid rgb(227, 227, 227);" width="50">
                                        <div align="center">GUIA</div>
                                    </td>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="text-center" v-if="item.areas && item.areas.length" v-for="(tr, indextr) in item.areas" :key="tr.idarea">
                                    <td style="background-color: #52C117; color:#ffffff; width: 100px;">
                                        <b>{{ tr.nombrearea }}</b>
                                    </td>
                                    <!-- Columna de libros (solo para id_serie == 6) -->
                                    <td v-if="item.id_serie == 6" align="center">
                                        <div>
                                            <table style="width: 100%; table-layout: fixed;">
                                                <tr v-for="libro in tr.libros" :key="libro.idlibro" style="width: 100%; border: 1.5px solid rgb(200, 200, 200);">
                                                    <td style="width: 100%; text-align: left; border: transparent;">
                                                        <b>{{ libro.nombrelibro }}</b>
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                    <!-- Columna de cantidades (solo para id_serie == 6) -->
                                    <td v-if="item.id_serie == 6" align="center" class="guiaEstilo">
                                        <div>
                                            <table style="width: 100%; table-layout: fixed;">
                                                <tr v-for="libro in tr.libros" :key="libro.idlibro" style="width: 100%; border: 1.5px solid rgb(200, 200, 200);">
                                                    <td style="width: 100%; text-align: center; border: transparent;">
                                                        {{ libro.pvn_cantidad }}
                                                    </td>
                                                </tr>
                                            </table>
                                        </div>
                                    </td>
                                    <td v-else v-for="(year, index) in maxLevel(item.areas)" :key="index" align="center" class="guiaEstilo">
                                        <div v-for="libro in tr.libros" v-if="libro.year === year">
                                            {{ libro.pvn_cantidad }} <!-- Para los demás casos -->
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td :colspan="maxLevelsCount_plas(item.areas)">
                                        <table>
                                            <tr>
                                                <td width="1000" style="border: transparent;"><b style="font-size: 10px;">TOTAL GUIAS</b></td>
                                                <td class="input_totales" width="150" align="center" style="border: transparent;">
                                                    {{ item.totalPvnCantidad }}
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
                <div class="w-full text-center">
                    <b class="text-warning ml-5">
                        CANTIDAD DE UNIDADES DE GUIAS TOTAL : <div style="display: inline-block;">{{ calculos.totalGuias }}</div><br>
                    </b>
                </div>
            </div>
            <div v-else-if="id_periodo <= mixinIdInicioFormatoNewData">
                <div>
                    <div :key="index" v-for="(item, index) in series">
                        <div slot="header" class="text-center">
                            <p v-if="index > 0" style="height: 15px;"></p>
                            <b>SERIE {{item.nombre_serie.toUpperCase()}}</b>
                        </div>
                        <div class="w-full" style="overflow-x:auto;">
                            <table class="table_pedidos">
                                <tr class="text-center">
                                    <td rowspan="3" style="width: 200px;"><b>Áreas</b></td>
                                    <td colspan="20"><b>Niveles</b></td>
                                    <td rowspan="3" style="width: 70px;" v-if="tipo_form == 'textos'"><b>PVP</b></td>
                                </tr>
                                <tr class="text-center">
                                    <td colspan="2"><b>1</b></td>
                                    <td colspan="2"><b>2</b></td>
                                    <td colspan="2"><b>3</b></td>
                                    <td colspan="2"><b>4</b></td>
                                    <td colspan="2"><b>5</b></td>
                                    <td colspan="2"><b>6</b></td>
                                    <td colspan="2"><b>7</b></td>
                                    <td colspan="2"><b>8</b></td>
                                    <td colspan="2"><b>9</b></td>
                                    <td colspan="2"><b>10</b></td>
                                </tr>
                                <tr class="text-center">
                                    <td><b>GUÍA</b></td>
                                    <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                                    <td><b>GUÍA</b></td>
                                    <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                                    <td><b>GUÍA</b></td>
                                    <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                                    <td><b>GUÍA</b></td>
                                    <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                                    <td><b>GUÍA</b></td>
                                    <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                                    <td><b>GUÍA</b></td>
                                    <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                                    <td><b>GUÍA</b></td>
                                    <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                                    <td><b>GUÍA</b></td>
                                    <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                                    <td><b>GUÍA</b></td>
                                    <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                                    <td><b>GUÍA</b></td>
                                    <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                                </tr>
                                <tr class="text-center" align="center" :key="indextr" v-for="(tr, indextr) in item.areas">
                                    <td style="background-color: #52C117;color:white;"> <b>{{tr.nombrearea}}</b> </td>
                                    <td> <input :class="['input_pvp_tabla t_guia',  (tr.n1 == '' || tr.n1 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+0" @blur="guardar_valor(tr.idarea, item.id_serie, 0,1)" :hidden="!tr.n1" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n1 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_texto', (tr.n1 == '' || tr.n1 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+1" @blur="guardar_valor(tr.idarea, item.id_serie, 1,1)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n1 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_guia',  (tr.n2 == '' || tr.n2 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+2" @blur="guardar_valor(tr.idarea, item.id_serie, 2,2)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n2 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_texto', (tr.n2 == '' || tr.n2 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+3" @blur="guardar_valor(tr.idarea, item.id_serie, 3,2)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n2 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_guia',  (tr.n3 == '' || tr.n3 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+4" @blur="guardar_valor(tr.idarea, item.id_serie, 4,3)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n3 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_texto', (tr.n3 == '' || tr.n3 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+5" @blur="guardar_valor(tr.idarea, item.id_serie, 5,3)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n3 : true" /></td>
                                    <td> <input :class="['input_pvp_tabla t_guia',  (tr.n4 == '' || tr.n4 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+6" @blur="guardar_valor(tr.idarea, item.id_serie, 6,4)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n4 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_texto', (tr.n4 == '' || tr.n4 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+7" @blur="guardar_valor(tr.idarea, item.id_serie, 7,4)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n4 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_guia',  (tr.n5 == '' || tr.n5 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+8" @blur="guardar_valor(tr.idarea, item.id_serie, 8,5)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n5 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_texto', (tr.n5 == '' || tr.n5 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+9" @blur="guardar_valor(tr.idarea, item.id_serie, 9,5)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n5 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_guia',  (tr.n6 == '' || tr.n6 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+10" @blur="guardar_valor(tr.idarea, item.id_serie, 10,6)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n6 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_texto', (tr.n6 == '' || tr.n6 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+11" @blur="guardar_valor(tr.idarea, item.id_serie, 11,6)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n6 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_guia',  (tr.n7 == '' || tr.n7 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+12" @blur="guardar_valor(tr.idarea, item.id_serie, 12,7)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n7 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_texto', (tr.n7 == '' || tr.n7 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+13" @blur="guardar_valor(tr.idarea, item.id_serie, 13,7)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n7 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_guia',  (tr.n8 == '' || tr.n8 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+14" @blur="guardar_valor(tr.idarea, item.id_serie, 14,8)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n8 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_texto', (tr.n8 == '' || tr.n8 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+15" @blur="guardar_valor(tr.idarea, item.id_serie, 15,8)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n8 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_guia',  (tr.n9 == '' || tr.n9 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+16" @blur="guardar_valor(tr.idarea, item.id_serie, 16,9)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n9 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_texto', (tr.n9 == '' || tr.n9 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+17" @blur="guardar_valor(tr.idarea, item.id_serie, 17,9)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n9 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_guia',  (tr.n10 == '' || tr.n10 == null) ?'': 'guiaEstilo']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+18" @blur="guardar_valor(tr.idarea, item.id_serie, 18,10)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n10 : true" /> </td>
                                    <td> <input :class="['input_pvp_tabla t_texto', (tr.n10 == '' || tr.n10 == null) ?'': 'test']" type="number" :id="item.id_serie+'_'+tr.idarea+'_'+19" @blur="guardar_valor(tr.idarea, item.id_serie, 19,10)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? !tr.n10 : true" /> </td>
                                    <td><input class="input_pvp_tabla input_pvp" v-show="tipo_form == 'textos'" readonly type="number" :id="item.id_serie+'_'+tr.idarea+'_'+20" :value="tr.pvp" /> </td>
                                </tr>
                                <tr class="text-center">
                                    <td> <b style="font-size: 12px;">{{tipo_form == 'textos' ? 'TOTAL TEXTOS' :'TOTAL GUIAS'}}</b> </td>
                                    <td colspan="7" v-show="tipo_form == 'textos'" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_textos_serie_'+item.id_serie" type="number" /> </td>
                                    <td colspan="7" v-show="tipo_form == 'guias'" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_textos_serie2_'+item.id_serie" type="number" /> </td>
                                    <td colspan="6" style="font-size: 12px;" v-show="tipo_form == 'textos'"> <b>TOTAL USD</b> </td>
                                    <td colspan="8" class="input_totales" v-show="tipo_form == 'textos'"> <input readonly class="input_totales input_pvp_tabla" :id="'total_usd_serie_'+item.id_serie" type="number" /> </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div>
                        <p style="height: 15px;"></p>
                        <div slot="header" class="text-center"> <b>PLAN LECTOR</b> </div>
                        <div class="w-full" style="overflow-x:auto;">
                            <table class="table_pedidos">
                                <tr class="text-center">
                                    <td><b>LIBRO</b></td>
                                    <td><b>GUÍA</b></td>
                                    <td>&nbsp;<b>TXT</b>&nbsp;&nbsp;</td>
                                    <td v-show="tipo_form == 'textos'" style="width: 100px;">&nbsp;<b>PVP</b>&nbsp;&nbsp;</td>
                                </tr>
                                <tr class="text-center" align="center" :key="index" v-for="(item, index) in series_plan_lector">
                                    <td style="background-color: #52C117;color:white;"> <b>{{item.nombrelibro}}</b> </td>
                                    <td> <input class="input_pvp_tabla t_guia" type="number" :id="6+'_'+item.id_libro+'_'+0" @blur="guardar_valor(item.id_libro, 6, 0,-1)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? false:true" /> </td>
                                    <td> <input class="input_pvp_tabla t_texto" type="number" :id="6+'_'+item.id_libro+'_'+1" @blur="guardar_valor(item.id_libro, 6, 1,-1)" :disabled="usuario.id_group==11 && (contrato_generado == null || contrato_generado == '') ? false:true" /> </td>
                                    <td v-show="tipo_form == 'textos'"> <input class="input_pvp_tabla input_pvp" readonly type="number" :value="item.pvp" :id="6+'_'+item.id_libro+'_'+20" /> </td>
                                </tr>
                                <tr class="text-center">
                                    <td> <b style="font-size: 12px;">{{tipo_form == 'textos' ? 'TOTAL TEXTOS' :'TOTAL GUIAS'}}</b> </td>
                                    <td colspan="2" v-show="tipo_form == 'textos'" style="font-size: 12px;"> <b>TOTAL USD</b> </td>
                                    <td colspan="2" v-show="tipo_form == 'textos'" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_textos_serie_'+6" type="number" /> </td>
                                    <td colspan="2" v-show="tipo_form == 'guias'" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_textos_serie2_'+6" type="number" /> </td>
                                    <td colspan="2" v-show="tipo_form == 'textos'" class="input_totales"> <input readonly class="input_totales input_pvp_tabla" :id="'total_usd_serie_'+6" type="number" /> </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="w-full text-center">
                        <b class="text-warning ml-5">
                            CANTIDAD DE UNIDADES DE GUIAS TOTAL : <div style="display: inline-block;">{{ total_unidades_guias }} </div><br>
                        </b>
                    </div>
                </div>
            </div>
        </vx-card>
        <!-- <div class="w-full p-2 bg-gray-400 text-center">
                    <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir</vs-button>
                </div> -->
    </div>
    </template>
    
    <script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import {
        FormWizard,
        TabContent
    } from 'vue-form-wizard'
    import 'vue-form-wizard/dist/vue-form-wizard.min.css'
    import vSelect from 'vue-select';
    import html2pdf from "html2pdf.js"
    import moment from "moment";
    import imprimirMixin from "@/mixins/Pedidosmix";
    export default {
        mixins: [imprimirMixin],
        components: {
            FormWizard,
            TabContent,
            flatPickr,
            'v-select': vSelect,
        },
        data: () => ({
            usuario: [],
            series: [],
            periodos: [],
            arregloPedidos: [],
            series_plan_lector: [],
            tipo_form: 'guias',
            total_usd: 0,
            total_unidades: 0,
            total_unidades_guias: 0,
            porcentaje_descuento: 0,
            porcentaje_descuento_series_basicas: 0,
            //variables para observacion y anticipo
            disableAsesor: false,
            pvn_tipo: 0,
            pedido: {
                id_pedido: 0,
                periodo: '',
                tipo_venta: '',
                fecha_envio: '',
                fecha_entrega: '',
                institucion: '',
                asesor: '',
                descuento: '',
                anticipo: '',
                ifanticipo: 0,
                observacion: '',
                ruc: '',
                direccionInstitucion: '',
                nivel: '',
                tipo_descripcion: '',
                telefonoInstitucion: '',
                id_periodo: ''
            },
            calculos: {
                cantidadtotal_libros: 0,
                pvptotal_libros: 0,
                suma_seriesBasicas: 0,
                multiplicacionPConfigurado: 0,
                RestaAutorizada: 0,
                resultadoComisionAsesor: 0,
                anticipo_calculado: 0,
                pendienteLiquidar: 0,
                totalGuias: 0,
            },
            //fin variables para  observacion y anticipo
            suma_bruta_series_b: 0,
            arregloSeriesBasicas: [],
            pendienteLiquidar: 0,
            anticipo_aprobado: 0,
            contrato_generado: '',
            multiplicacionPConfigurado: 0,
            RestaAutorizada: 0,
            resultadoComisionAsesor: 0,
            //variables de series basicas
            //variables de cabecera
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            nombrePeriodo: '',
            isrunLoading_metodoInicial: false,
            mixinIdInicioFormatoNewData: null,
        }),
        props: {
            ObjectPedido:{
                type:Object,
                default:function(){
                    return {}
                }
            },
            id_pedido: {
                type: Number,
                default: 0
            },
            id_periodo: {
                type: Number,
                default: 0
            },
        },
        mounted() {
            let me = this;
            // Verifica si los datos existen en localStorage
            const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');            
            if (mixinData) {
            // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
            const parsedData = JSON.parse(mixinData);
            me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
            console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
            } else {
                console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
            }
            // FIN Verificación si los datos existen en localStorage
            if (me.id_periodo <= me.mixinIdInicioFormatoNewData) {
                console.log(me.id_periodo, "ide del periodo");
                moment.locale("es")
                me.mes = moment().format('MMMM');
                me.year = moment().format('YYYY')
                this.pedido.periodo = {
                    idperiodoescolar: localStorage.id_periodo_selected,
                    periodoescolar: localStorage.nombre_periodo_selected
                }
                this.usuario = JSON.parse(localStorage.getItem('usuario'))
                this.nombrePeriodo = localStorage.nombre_periodo_selected
                this.usuario_id = this.usuario.idusuario
                this.getSeries()
                this.getLibrosPlanLector()
                me.getPedidos()
                me.getPeriodos()
                this.disableAsesor = true
            } else if (me.id_periodo > me.mixinIdInicioFormatoNewData) {
                console.log(me.id_periodo, "ide del periodo2");
                moment.locale("es")
                me.mes = moment().format('MMMM');
                me.year = moment().format('YYYY')
                this.nombrePeriodo = localStorage.nombre_periodo_selected
                me.getmetodoInicial_NEW();
            }
        },
        methods: {
            async getmetodoInicial_NEW() {
                let me = this;
                me.isrunLoading_metodoInicial = true;
                me.$vs.loading();
                try {
                    await me.getSeries_new();
                    await me.get_val_pedido_new();
                    await me.calcularTotalPvnCantidad_new();
                    await me.calcularCantidadTotalLibros_new();
                    await me.getPedidos();
                    me.isrunLoading_metodoInicial = false;
                    me.$vs.loading.close();
                } catch (error) {
                    console.error('Error en getmetodoInicial_NEW:', error);
                    me.$vs.loading.close();
                }
            },
            maxLevel(areas) {
                const levels = new Set();
                areas.forEach(area => {
                    area.libros.forEach(libro => {
                        if (libro.year >= 0) {
                            levels.add(libro.year);
                        }
                    });
                });
                return Array.from(levels).sort((a, b) => a - b); // Devuelve un array de niveles ordenados
            },
            maxLevelsCount(areas) {
                // Devuelve la cantidad de niveles únicos
                return this.maxLevel(areas).length;
            },
            maxLevelsCount_plas(areas) {
                // Devuelve la cantidad de niveles únicos más uno
                return this.maxLevel(areas).length + 2;
            },
            getPeriodos() {
                let me = this
                this.$http.get(this.$server_url + 'get_periodos_activos')
                    .then(res => {
                        me.periodos = res.data
                    })
            },
            async getPedidos() {
                return new Promise((resolve, reject) => {
                    let me = this
                    if (me.isrunLoading_metodoInicial = false) {
                        me.$vs.loading();
                    }
                    this.$http.get(this.$server_url + 'get_datos_pedido_guias/' + me.id_pedido)
                        .then(res => {
                            if (me.isrunLoading_metodoInicial = false) {
                                me.$vs.loading.close();
                            }
                            me.pedido.id_pedido = res.data[0].id_pedido
                            me.pedido.fecha_envio = res.data[0].fecha_envio
                            me.pedido.observacion = res.data[0].observacion
                            me.pedido.asesor = {
                                idusuario: res.data[0].id_asesor,
                                nombres: res.data[0].nombres + ' ' + res.data[0].apellidos
                            }
                            me.cedula_asesor = res.data[0].cedula
                            resolve();
                            // me.$vs.notify({
                            //     text: "Espere mientras se va generando el archivo...",
                            //     color: 'primary',
                            //     iconPack: 'feather',
                            //     icon: 'icon-file',
                            //     time:3000
                            // })
                            // setTimeout(function() {me.imprimirEval()}, 2000)
                        })
                        .catch(err => {
                            reject(err);
                            me.$vs.loading.close()
                        })
                });
            },
            imprimirEval() {
                let me = this;
    
                // Crear el overlay
                const overlay = document.createElement('div');
                overlay.style.position = 'fixed';
                overlay.style.top = '0';
                overlay.style.left = '0';
                overlay.style.width = '100%';
                overlay.style.height = '100%';
                overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Fondo semitransparente
                overlay.style.zIndex = '99999998'; // Asegúrate de que esté debajo de la notificación
                document.body.appendChild(overlay);
    
                // Crear y mostrar el aviso de notificación
                const notifyDiv = document.createElement('div');
                notifyDiv.style.position = 'fixed';
                notifyDiv.style.top = '50%';
                notifyDiv.style.left = '50%';
                notifyDiv.style.transform = 'translate(-50%, -50%)';
                notifyDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
                notifyDiv.style.color = '#fff';
                notifyDiv.style.borderRadius = '5px';
                notifyDiv.style.padding = '20px';
                notifyDiv.style.zIndex = '99999999'; // Asegúrate de que esté por encima del overlay
                notifyDiv.style.display = 'flex';
                notifyDiv.style.alignItems = 'center';
                notifyDiv.style.justifyContent = 'center';
                notifyDiv.style.fontSize = '16px';
                notifyDiv.innerHTML = `
                <span style="margin-right: 10px;">⚠️</span>
                <span>Espere mientras se descarga el pdf.</span>
            `;
                document.body.appendChild(notifyDiv);
    
                // Función para generar el PDF
                const generateAndSavePDF = () => {
                    var element = document.getElementById('seccionImprimir2');
                    var opt = {
                        margin: [0, 0, 0.5, 0],
                        filename: "ReporteGuias.pdf",
                        image: {
                            type: 'jpeg',
                            quality: 0.98
                        },
                        html2canvas: {
                            dpi: 192,
                            scale: 2,
                            letterRendering: true
                        },
                        pagebreak: {
                            mode: 'avoid-all'
                        },
                        jsPDF: {
                            unit: 'pt',
                            format: 'a4',
                            orientation: 'portrait'
                        }
                    };
    
                    // Generar y guardar el PDF
                    html2pdf().from(element).set(opt).toPdf().get('pdf').then(pdf => {
                        // Guardar el archivo PDF
                        pdf.save('ReporteGuias.pdf');
    
                        // Eliminar el overlay y la notificación después de que se haya generado el PDF y se haya guardado
                        document.body.removeChild(notifyDiv);
                        document.body.removeChild(overlay);
    
                        // Limpiar el arreglo de pedidos
                        me.arregloPedidos = [];
                    }).catch(err => {
                        // En caso de error, también eliminar el overlay y la notificación
                        document.body.removeChild(notifyDiv);
                        document.body.removeChild(overlay);
                        console.error('Error al generar el PDF:', err);
                    });
                };
    
                // Esperar 1 segundo antes de generar el PDF
                setTimeout(generateAndSavePDF, 1000);
            },
            getSeries() {
                let me = this
                this.$http.get(this.$server_url + 'series_formato_periodo/' + me.id_periodo)
                    .then(res => {
                        me.series = res.data
                        me.getLibrosPlanLector()
                    })
            },
            getLibrosPlanLector() {
                let me = this
                this.$http.get(this.$server_url + 'get_pvp_planes_periodo/' + me.id_periodo)
                    .then(res => {
                        me.series_plan_lector = res.data
                        me.get_val_pedido()
                    })
            },
            get_val_pedido() {
                let me = this
                if (!me.id_pedido) {
                    return
                }
                me.$vs.loading();
                this.$http.get(this.$server_url + 'get_val_pedido/' + me.id_pedido)
                    .then(res => {
                        me.porcentaje_descuento = res.data[0].descuento
                        me.porcentaje_descuento_series_basicas = res.data[0].porcentaje_descuento
                        me.contrato_generado = res.data[0].contrato_generado
                        $.each(res.data, function (key, value) {
                            try {
                                // console.log(value.id_serie+'_'+value.id_area+'_'+value.tipo_val + ' == ' + value.valor)
                                document.getElementById(value.id_serie + '_' + value.id_area + '_' + value.tipo_val).value = value.valor
                            } catch (error) {}
                        });
                        me.activar_tipo()
                        let array_series = []
                        array_series = me.groupArrayOfObjects(res.data, "id_serie")
                        me.total_usd = 0
                        me.total_unidades = 0
                        me.total_unidades_guias = 0
                        $.each(array_series, function (key, value) {
                            let array_areas_serie = []
                            array_areas_serie = me.groupArrayOfObjects(value, "id_area")
                            let total_serie = 0;
                            let total_libros = 0;
                            let total_guias = 0;
                            var val_pvp_area = 0
                            $.each(array_areas_serie, function (key_1, value_1) { // recorre las areas de cada serie
                                let sum_celdas_area = 0;
                                $.each(value_1, function (key_2, value_2) { // recorre las celdas de cada area; tipo_val = posicion celda
                                    // console.log('value_2.tipo_val: '+value_2.tipo_val+' value_2.valo: '+value_2.valor)
                                    if (parseInt(value_2.tipo_val) % 2 != 0) { //sumar solo cantidades de textos
                                        total_libros += value_2.valor
                                        sum_celdas_area += value_2.valor
                                    }
                                    if (parseInt(value_2.tipo_val) % 2 == 0) { //sumar solo cantidades de las guias
                                        total_guias += value_2.valor
                                    }
                                });
                                //valor de pvp de area
                                val_pvp_area = document.getElementById(value[0].id_serie + '_' + value_1[0].id_area + '_' + 20).value //obtiene el pvp de cada area
                                // console.log('sum_celdas_area*val_pvp_area = '+sum_celdas_area+' * '+val_pvp_area)
                                total_serie += (sum_celdas_area * val_pvp_area)
                            });
                            document.getElementById('total_textos_serie_' + value[0].id_serie).value = total_libros
                            document.getElementById('total_textos_serie2_' + value[0].id_serie).value = total_guias
                            document.getElementById('total_usd_serie_' + value[0].id_serie).value = total_serie
                            me.total_usd = me.total_usd + parseFloat(total_serie);
                            me.total_unidades = me.total_unidades + parseInt(total_libros);
                            me.total_unidades_guias = me.total_unidades_guias + parseInt(total_guias)
                            //me.guardarTotalPedido()
                        });
                        me.sumarAreasBasicas()
                        // me.guardarTotalPedido()
                        me.$vs.loading.close();
    
                    })
                    .catch(err => {})
            },
            sumarAreasBasicas() {
                let me = this;
                var resultado = 0
                me.arregloSeriesBasicas.forEach(element => {
                    let valor = parseFloat(document.getElementById('total_usd_serie_' + element.id_serie).value)
                    if (!isNaN(valor)) {
                        resultado += valor;
                    }
                });
                me.suma_bruta_series_b = resultado
                me.multiplicacionPConfigurado = ((me.suma_bruta_series_b * this.porcentaje_descuento_series_basicas) / 100).toFixed(2)
                me.RestaAutorizada = ((me.suma_bruta_series_b) - (me.multiplicacionPConfigurado))
                me.resultadoComisionAsesor = ((me.RestaAutorizada * me.porcentaje_descuento) / 100).toFixed(2)
                if (me.selectifanticipo) {
                    //suma de series basica
                    //se mutltiplica * el porcentaje de configuracion
                    //se resta el valor sumas basica - la multiplicacion del porcentaje
                    //se multiplica el resultado de ese valor x la comision del asesor
                    //se multiplica el resultado de la comision del asesor * 0.50
                    let anticipoSugerido50 = ((me.resultadoComisionAsesor * 50) / 100).toFixed(2)
                    me.pedido.anticipo = anticipoSugerido50
                    me.pendienteLiquidar = me.resultadoComisionAsesor - me.anticipoAprobado
                } else {
                    me.pedido.anticipo = 0
                    me.pendienteLiquidar = me.resultadoComisionAsesor - me.anticipoAprobado
                }
                let datos = {
                    anticipo: me.pedido.anticipo,
                    liquidar: me.pendienteLiquidar
                }
                me.$emit('changePedido', datos)
            },
            async guardar_valor(id, serie, index, libro) {
                let me = this
                if (document.getElementById(serie + '_' + id + '_' + index).value == '') { // no guardar cuando no se digita algo
                    return;
                }
                let valor = document.getElementById(serie + '_' + id + '_' + index).value
                if (valor == 0) {
                    document.getElementById(serie + '_' + id + '_' + index).value = ''
                }
                me.$vs.loading();
                let formData = new FormData();
                formData.append('id_pedido', me.id_pedido);
                formData.append('valor', document.getElementById(serie + '_' + id + '_' + index).value);
                formData.append('tipo_val', index);
                formData.append('id_serie', serie);
                formData.append('id_area', id);
                if (libro == '-1') {
                    formData.append('plan_lector', id)
                    formData.append('libro', '0')
                } else {
                    formData.append('plan_lector', '0')
                    formData.append('libro', libro)
                }
                await this.$http.post(this.$server_url + 'save_val_pedido', formData)
                    .then(res => {
                        me.$vs.loading.close();
                        if (res.data.status == 0) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-check',
                                time: 8000
                            })
                            me.getSeries()
                            return
                        }
                        if (res.data.status == 2) {
                            me.getSeries()
                        }
                        me.$vs.notify({
                            text: 'Guardado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.get_val_pedido()
                    })
    
            },
            async guardarTotalPedido() {
                let me = this
                let total_usd_format = me.total_usd.toFixed(2)
                await me.$http.get(me.$server_url + 'guardar_total_pedido/' + me.id_pedido + '/' + total_usd_format + '/' + me.total_unidades + '/' + me.total_unidades_guias)
                    .then(res => {
                        // console.log('total actualizado: ' + total_usd_format)
                    })
            },
            groupArrayOfObjects(list, key) {
                return list.reduce(function (rv, x) {
                    (rv[x[key]] = rv[x[key]] || []).push(x);
                    return rv;
                }, {});
            },
            activar_tipo() {
                if (this.tipo_form == 'textos') {
                    $('.t_texto').css('display', 'block');
                    $('.t_guia').css('display', 'none');
                } else {
                    $('.t_guia').css('display', 'block');
                    $('.t_texto').css('display', 'none');
                }
    
            },
            //SECCION NUEVOS METODOS
            async getSeries_new() {
                let me = this;
                return new Promise((resolve, reject) => {
                    if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                        me.$vs.loading();
                    }
    
                    this.$http.get(this.$server_url + 'series_formato_periodo_new/' + me.id_periodo + '/' + me.id_pedido + '/' + me.pvn_tipo)
                        .then(res => {
                            // Filtrar las series para incluir solo áreas y libros con pvn_cantidad > 0
                            me.series = Object.values(res.data).map(serie => {
                                serie.areas = serie.areas.map(area => {
                                    // Filtrar los libros en el área
                                    area.libros = area.libros.filter(libro => libro.pvn_cantidad > 0);
                                    return area;
                                }).filter(area => area.libros.length > 0); // Filtrar áreas que no tienen libros
    
                                return serie;
                            }).filter(serie => serie.areas.length > 0); // Filtrar series que no tienen áreas
    
                            console.log(me.series, "DATADESERIES");
    
                            if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                                me.$vs.loading.close();
                            }
                            resolve();
                        })
                        .catch(err => {
                            if (me.isrunLoading_metodoInicial == false && me.isrunLoading_blur_pvn_cantidad == false) {
                                me.$vs.loading.close();
                            }
                            reject(err);
                        });
                });
            },
            async get_val_pedido_new() {
                let me = this
                return new Promise((resolve, reject) => {
                    if (!me.id_pedido) {
                        return
                    }
                    me.$vs.loading()
                    this.$http.get(this.$server_url + 'get_val_pedido_new/' + me.id_pedido)
                        .then(res => {
                            if (res.data.length <= 0) {
                                me.porcentaje_descuento = 0;
                                me.porcentaje_descuento_series_basicas = 0;
                                me.contrato_generado = 0;
                                me.$vs.loading.close()
                            } else if (res.data.length > 0) {
                                me.porcentaje_descuento = res.data[0].descuento
                                me.porcentaje_descuento_series_basicas = res.data[0].porcentaje_descuento
                                me.contrato_generado = res.data[0].contrato_generado
                                me.$vs.loading.close()
                            }
                            resolve();
                        })
                        .catch(err => {
                            reject(err);
                            me.$vs.loading.close()
                        })
                })
            },
            async calcularTotalPvnCantidad_new() {
                return new Promise((resolve, reject) => {
                    if (Array.isArray(this.series)) {
                        this.series.forEach(serie => {
                            let totalPvnCantidad = 0;
                            let totalPvpUsd = 0; // Variable para almacenar la suma de totalPvpUsdLibro por serie
                            if (Array.isArray(serie.areas)) {
                                serie.areas.forEach(area => {
                                    if (Array.isArray(area.libros)) {
                                        area.libros.forEach(libro => {
                                            totalPvnCantidad += libro.pvn_cantidad || 0;
                                            // Calcular el valor multiplicado para cada libro
                                            const totalPvpUsdLibro = parseFloat((libro.pfn_pvp * (libro.pvn_cantidad || 0)).toFixed(2));
                                            // Almacenar este valor en el objeto libro
                                            this.$set(libro, 'totalPvpUsdLibro', totalPvpUsdLibro);
                                            // Sumar el totalPvpUsdLibro para la serie completa
                                            totalPvpUsd += totalPvpUsdLibro;
                                        });
                                    }
                                });
                            }
                            // Guardar el total de pvn_cantidad en la serie
                            this.$set(serie, 'totalPvnCantidad', totalPvnCantidad);
                            // Guardar el total de PVP en USD en la serie
                            this.$set(serie, 'totalPvpUsd', totalPvpUsd);
                        });
                        resolve();
                    } else {
                        console.error("`this.series` no es un array:", this.series);
                        reject("`this.series` no es un array:", this.series);
                    }
                });
            },
            async calcularCantidadTotalLibros_new() {
                return new Promise((resolve, reject) => {
                    this.calculos.totalGuias = this.series.reduce((total, serie) => {
                        return total + serie.totalPvnCantidad;
                    }, 0);
                    resolve();
                });
            },
        },
    }
    </script>
    
    <style scoped>
    @media print {
    
        td,
        tr {
            page-break-before: always;
        }
    
        table,
        td {
            page-break-after: always;
        }
    }
    
    * {
        font-size: 10px;
        font-weight: bold;
    }
    
    input[type=number].input_pvp_tabla::-webkit-inner-spin-button,
    input[type=number].input_pvp_tabla::-webkit-outer-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    
    input[type=number].input_pvp_tabla {
        -moz-appearance: textfield;
    }
    
    input[type=number].input_pvp_tabla {
        width: 100%;
        height: 100%;
        border: none;
        font-size: 9px !important;
        text-align: center;
        color: rgb(60, 108, 192);
        padding-top: -100px !important;
    }
    
    table.table_pedidos td {
        border: 1px solid rgb(227, 227, 227);
        height: 18px;
    }
    
    table.table_pedidos th {
        border: 1px solid rgb(227, 227, 227);
        height: 18px;
    }
    
    table.table_pedidos {
        width: 90%;
        margin: 0 auto;
        border-collapse: collapse;
    }
    
    .input_totales {
        background-color: #31B10C;
        color: white !important;
        font-weight: bold;
    }
    
    .input_pvp {
        background-color: #fcfcd9;
        color: black !important;
        border-radius: 0%;
        width: 100%;
        height: 100%;
    }
    
    .test {
        color: black !important;
        background-color: #fcfcd9;
    
    }
    
    .test {
        /* color:white!important;
            background-color: #6B97F5; */
    }
    
    .test:hover,
    .guiaEstilo:hover {
        color: black;
    }
    
    .guiaEstilo {
        color: #2559AD !important;
        background-color: #BCF3AE;
    }
    
    .font1 {
        background-color: #fcfcd9;
        color: black !important;
        ;
        font-weight: bold;
    }
    </style>
    