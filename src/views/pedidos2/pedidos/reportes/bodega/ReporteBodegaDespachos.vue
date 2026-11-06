<template>
    <div>
        <vx-card title="Reporte de despachos bodegas" class="overflow-visible">
            <ul class="flex">
                <li class="mr-4">
                    Seleccione el tipo de venta
                </li>
                <li class="mr-4">
                    <vs-radio v-model="tipoVenta" @input="getBodegaDespacho" vs-name="radios1tipoVenta" vs-value="1">Venta directa</vs-radio>
                </li>
                <li class="mr-5">
                    <vs-radio v-model="tipoVenta" @input="getBodegaDespacho" vs-name="radios1tipoVenta" vs-value="2">Venta lista</vs-radio>
                </li>
                <!-- <li>
                    <vs-checkbox v-model="ifDevueltos" @input="getBodegaDespacho" vs-name="checkbox1" vs-color="primary">Devueltos</vs-checkbox>
                </li> -->
                <li class="mr-5">
                    <vs-radio v-model="tipoVenta" @input="getBodegaDespacho" vs-name="radios1tipoVenta" vs-value="3">Devueltos</vs-radio>
                </li>
                <!-- <li>
                    <vs-button @click="getBodegaDespacho" icon="search" style="margin-top: -10px;" color="primary" class="mb-4">Obtener reporte</vs-button>
                </li> -->
            </ul>
        </vx-card>

        <vx-card class="mt-5">
            <!-- Asegúrate de que 'arrayBodegaDespacho' esté mostrando la información correctamente -->
            <div>
                <h3>Valores Totales </h3>
                <p class="mt-2">Valor total: {{ totalValor | filtrarDecimal }}</p>
                <p>Cantidad total: {{ totalCantidad | filtrarDecimal }}</p>
            </div>
            <vs-divider></vs-divider>
            <p class="font-bold text-center">{{ 'Reporte de despachos bodega ' + nombrePeriodo + 
                    (tipoVenta == 1 ? ' - Venta directa' : 
                    (tipoVenta == 2 ? ' - Venta lista' : ' - Devueltos')) }}
            </p>
            <vs-table max-items="10" search pagination :data="arrayBodegaDespacho">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: <b> {{ arrayBodegaDespacho.length }}</b></vs-chip>
                    <vs-button color="success" class="mb-2 p-3 ml-3" @click="exportar"><i class="fa-solid fa-download"></i> Exportar</vs-button>
                </template>
                <template slot="thead">
                    <vs-td>Id</vs-td>
                    <vs-th>Institución</vs-th>
                    <vs-th>Cantidad codigos</vs-th>
                    <vs-th>Valor</vs-th>
                    <vs-th v-if="tipoVenta == 3">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{ tr.idInstitucion }}
                        </vs-td>
                        <vs-td>
                            {{data[indextr].nombreInstitucion}}<br>
                           <small>{{tr.asesor}} </small>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].cantidad_codigos}}<br>
                        </vs-td>
                        <vs-td>
                            {{ tr.total_valor }}
                        </vs-td>
                        <vs-td v-if="tipoVenta == 3">
                            <!--ver detalles-->
                            <vs-button color="primary" type="filled" @click="ObjectedSelected=tr;verDetalle(data[indextr])">Ver detalles</vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
             <!-- <TableReutilizableVue
                :title="'Reporte de despachos bodega ' + nombrePeriodo + 
                    (tipoVenta == 1 ? ' - Venta directa' : 
                    (tipoVenta == 2 ? ' - Venta lista' : ' - Devueltos'))"
                :headers="['Institución','Cantidad codigos','Valor']"
                :fieldKeys="['nombreInstitucion','cantidad_codigos','total_valor']"
                :ifexportar="1"
                :nombrearchivo="nombrearchivo"
                :tableData="arrayBodegaDespacho"
            /> -->
            <vs-popup classContent="popup-example" title="Detalle" :active.sync="popupMostrarDetalle">
                <div v-if="popupMostrarDetalle">
                    <b>Institución:</b> {{ObjectedSelected.nombreInstitucion}}<br>
                    <TableReutilizableVue
                    title=""
                    :headers="['Código','Factura','Documento de venta']"
                    :fieldKeys="['codigo','factura','documento']"
                    :ifexportar="1"
                    :nombrearchivo="'Individuales ' + nombrePeriodo + '_'+ObjectedSelected.nombreInstitucion+'_Devueltos'"
                    :tableData="arrayDetalle"
                    />
                </div>
            </vs-popup>
        </vx-card>
    </div>
</template>

<script>
const TableReutilizableVue = () => import('../components/TableReutilizable.vue');
import Codigosmix from "@/mixins/Codigosmix";
import Generalmix from '../../../../../mixins/Generalmix';

export default {
    mixins: [Generalmix,Codigosmix],
    components: {
        TableReutilizableVue
    },
    data() {
        return {
            tipoVenta: '1', // Inicialización de tipo de venta
            arrayBodegaDespacho: [], // Inicialización del array
            nombrearchivo: '',
            totalValor:0,
            totalCantidad:0,
            ifDevueltos:false,
            popupMostrarDetalle:false,
            ObjectedSelected: '',
            arrayDetalle:[],
            headers:[],
            fieldKeys:[],
        };
    },
    props: {
        periodo_id: {
            type: Number,
            default: 0
        },
        nombrePeriodo: {
            type: String,
            default: ""
        }
    },
    methods: {
        f_setearNombreArchivo() {
            let tipoV = this.tipoVenta == 1 
            ? 'Venta directa' 
            : (this.tipoVenta == 2 
                ? 'Venta lista' 
            : 'Devueltos');
            let tipoD = this.ifDevueltos == true ? 'Devueltos' : ''
            this.nombrearchivo = '_ReporteBodegaDespacho_' + this.nombrePeriodo + '_' + tipoV + '_' + tipoD;
        },
        async getBodegaDespacho() {
            this.f_setearNombreArchivo();
            this.totalValor = 0;
            this.totalCantidad = 0;
            this.arrayBodegaDespacho = []; // Limpiar los resultados anteriores
            try {
                if(this.periodo_id == 0 || this.periodo_id == "" || this.periodo_id == undefined){
                    this.m_message("No se ha seleccionado un periodo", "error");
                    return;
                }
                this.$vs.loading(); // Mostrar el loading
                // Asegúrate de que la URL sea correcta
                const url = `metodosGetCodigos?getReporteXTipoVenta=1&periodo=${this.periodo_id}&tipoVenta=${this.tipoVenta}`;
                const response = await this.$http.get(this.$server_url + url);
                
                this.arrayBodegaDespacho = response.data; // Asignar los datos de la respuesta

                if (this.arrayBodegaDespacho.length === 0) {
                    this.m_message("No hay datos para mostrar", "warning");
                }

                // Sumar totalValor con parseFloat
                this.totalValor = this.arrayBodegaDespacho.reduce(
                    (total, item) => total + parseFloat(item.total_valor || 0),
                    0
                );
                // Sumar totalCantidad con parseFloat
                this.totalCantidad = this.arrayBodegaDespacho.reduce(
                    (total, item) => total + parseFloat(item.cantidad_codigos || 0),
                    0
                );
                //el total_valor colocar toFixed(2)
                this.arrayBodegaDespacho.forEach(element => {
                    element.total_valor = element.total_valor.toFixed(2) * 1;
                });
            } catch (error) {
                this.m_message("Ocurrió un error al obtener los datos", "error");
            } finally {
                this.$vs.loading.close(); // Cerrar el loading
            }
        },
        verDetalle(){
            let me = this;
            me.arrayDetalle = []
            this.$http.get(this.$server_url+`devoluciones?getDevolucionSon=1&id_cliente=${ me.ObjectedSelected.idInstitucion }&id_periodo=${ me.periodo_id }`)
                .then(function (res) {
                    me.arrayDetalle = res.data
                    if(me.arrayDetalle.length > 0){
                        me.popupMostrarDetalle = true
                    }else{
                        me.m_message("No hay datos para mostrar", "warning");
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        exportar(){
            let me = this
            me.headers = ['Id','Asesor','Institución','Cantidad codigos','Valor']
            me.fieldKeys = ['idInstitucion','asesor','nombreInstitucion','cantidad_codigos','total_valor']
            me.m_exportTodo(me.headers,me.fieldKeys,me.arrayBodegaDespacho,me.nombrearchivo)
        },
    }
};
</script>
