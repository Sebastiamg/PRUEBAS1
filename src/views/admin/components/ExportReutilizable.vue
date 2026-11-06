<template>
    <div>
        <!----modal exportar--------->
        <vs-popup title="Exportar a Excel" class="export-options"  :active.sync="activePrompt">
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
            <div class="flex">
                <vs-button color="primary" @click="exportToExcel" type="relief">Guardar</vs-button>
                <vs-button color="warning"  class="ml-2" @click="cerrar();" type="relief">Cancelar</vs-button>
            </div>
        </vs-popup>
    </div>
</template>
<script>
import vSelect from 'vue-select'
export default {
    data() {
        return{
            fileName:'',
            //variables para el export a excel
            reportesActivo: 0,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            //fin variables para el export a excel
            getheaderTitle:[],
            getheaderVal:[],
            arrayDatos:[],
        }
    },
     props:{
        headerTitle:{
            type:Array,
            default: []
        },
        headerVal:{
            type:Array,
            default: []
        },
        codigoSelected:{
            type:Array,
            default: []
        },
         activePrompt:{
            type:Boolean,
            default:false,
         }
    },
    components:{
        vSelect
    },
    mounted(){
        let me =this;
        me.fileName = ''
       
    },
    methods:{
        cerrar(){
            let me = this;
            me.activePrompt=false;
            this.$emit('cerrar',false)  
        },
       //METODOS PARA EXCEL
       //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        exportToExcel() {
            // let headerTitle = ['codigo','institucion estudiante','periodo estudiante','libro', 'registrado', 'cedula', 'nombres', 'apellidos', 'email','estado','contrato','liquidacion','código de barras','bc_estado','venta estado','institucion barras','periodo barras'];
            // let headerVal = ['codigo', 'nombreInstitucion','periodo','libro', 'registrado', 'cedula', 'nombres', 'apellidos', 'email','codigoEstado','contrato','liquidacion','status','barrasEstado','ventaEstado','institucionBarra','periodo_barras'];  
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
                const data = this.formatJson(this.headerVal, list)
                excel.export_json_to_excel({
                    header: this.headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
                this.cerrar();
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