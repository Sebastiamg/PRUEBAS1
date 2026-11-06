<template>
    <vx-card>
        <vs-table multiple v-model="codigoSelected" max-items="10" stripe search pagination :data="arregloPedidos">
            <template slot="header">
                <vs-chip  color="primary">Cantidad:  {{ arregloPedidos.length }} </vs-chip>
                <span class="cursor-pointer" @click="activePrompt=true;"><vs-chip  color="success" ><b><ion-icon name="download-outline"></ion-icon> Exportar</b></vs-chip></span>
            </template>
            <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th>Asesor</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr  :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{ tr.id_pedido }}
                    </vs-td>
                    <vs-td>
                        <b>Asesor:</b>
                        <p> {{data[indextr].responsable}}</p>
                        <b>Institución:</b>
                        <p> {{data[indextr].nombreInstitucion}}<br> </p>
                        <b>Ciudad:</b>
                        <p>{{ tr.nombre_ciudad }}</p>
                        <b>Fecha aprobado por gerencia</b>
                        <p> {{data[indextr].fecha_aprobacion_anticipo_gerencia}}<br> </p>
                        <b>Fecha generación contrato</b>
                        <p> {{data[indextr].fecha_generar_contrato}}<br> </p>
                        <b>Contrato:</b>
                        <p> {{data[indextr].contrato_generado}}<br> </p>
                    </vs-td>
                    <vs-td>
                        <div style="display: flex;">
                            <div>
                                <!--COLOCAR RECIBIDAS-->
                                <vx-tooltip style="display: inline-block;" text="Reporte Trazabilidad" position="top" color="primary">
                                    <vs-button class="modal-default-button" size="small" color="primary" @click="pedido= tr;popupReporte = true;" type="filled" icon-pack="feather" icon="icon-credit-card"> Reporte trazabilidad </vs-button>
                                </vx-tooltip> &nbsp;
                            </div>
                        </div>
                    </vs-td> 
                </vs-tr>
            </template>
        </vs-table>
        <!--MODAL PARA VER  EL REPORTE -->
        <vs-popup class="holamundo" fullscreen title="Reporte de trazabilidad" :active.sync="popupReporte">
            <div v-if="popupReporte">
                <ReporteTrazabilidadDetalleVue :pedido="pedido"/>
            </div>
        </vs-popup>
        <!--MODAL PARA EXPORTAR A EXCEL-->
        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
            <div class="flex">
            </div>
         </vs-prompt>
    </vx-card>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import ReporteTrazabilidadDetalleVue from './ReporteTrasabilidadDetalle.vue'
export default{
    data(){
        return{
            arregloPedidos:[],
            pedido:{},
            popupReporte:false,
            //variables para el export a excel
            activePrompt:false,
            codigoSelected: [],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
        }
    },
    components:{
        flatPickr,
        ReporteTrazabilidadDetalleVue,
    },
    mounted(){
        let me = this;
        me.getPedidos()
        me.fromDate = new Date();
    },
    methods:{
        getPedidos(){
            let me = this
            me.popupUpload = false;
            me.$vs.loading();
            this.$http.get(this.$server_url+'getPedidosGerencia')
            .then(res => {
                me.$vs.loading.close();
                me.arregloPedidos = res.data
            })
        },
          //METODOS PARA EXCEL
        //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
        exportToExcel() {
            let headerTitle = [
                'Vendedor',
                'Institución',
                'Ciudad',
                'Contrato',
                'Creacion pedido',
                'Anticipo aprobado',
                'Contabilidad recibe',
                'Contabilidad sube cheque sin firmar',
                'Contabilidad sube cheque firmado',
                'Facturador recibe cheque',
                'Facturador envia cheque asesor',
                'Asesor sube pagaré firmado',
                'Facturador recibe orden firmada fisico',
                'Contabilidad reciben orden firmada fisico'
                ];
            let headerVal = [
                'responsable',
                'nombreInstitucion',
                'nombre_ciudad',
                'contrato_generado',
                'f_creacionPedido',
                'fecha_contabilidad_recibe',
                'fecha_contabilidad_sube_cheque_sin_firmar',
                'fecha_subir_cheque',
                'fecha_facturador_recibe_cheque',
                'fecha_envio_cheque_for_asesor',
                'fecha_orden_firmada',
                'fecha_que_recibe_orden_firmada',
                'fecha_que_recibe_orden_firmada_contabilidad'
            ];  
            let codigoSelectedMayus = this.codigoSelected
            for (var i = 0; i < codigoSelectedMayus.length; i++) {
                for (var key in codigoSelectedMayus[i]) {
                    if (typeof codigoSelectedMayus[i][key] == "string") {
                        codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                    }
                }
            }
            import('@/vendor/Export2Excel').then(excel => {
                const list = codigoSelectedMayus
                const data = this.formatJson(headerVal, list)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
    }
}
</script>