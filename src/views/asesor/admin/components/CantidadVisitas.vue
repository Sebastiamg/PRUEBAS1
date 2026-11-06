<template>
    <div class="mt-5">
        <vs-alert active="true">
            <p style="text-align:center;">Cantidad de instituciones pertenecientes prolipa</p>
        </vs-alert>
        <vs-table max-items="10" search pagination :data="getReportVisitas" v-model="codigoSelected" multiple>
            <template slot="header">
                Cantidad Instituciones: {{getReportVisitas.length}}
                <vs-button color="warning" size="small" class="ml-3" style="font-size: 14px;" @click="tipo= 1;activePrompt=true;">Exportar</vs-button>
            </template>
            <template slot="thead">
                <vs-th>Institucion</vs-th>
                <vs-th>Ciudad</vs-th>
                <vs-th>Cantidad de visitas</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].nombreInstitucion}}<br>
                        <small>{{tr.region}}</small>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].ciudad}}<br>
                    </vs-td>  
                    <vs-td>
                        {{data[indextr].contador}}<br>
                    </vs-td>   
                </vs-tr>
            </template>
        </vs-table>   
        <vs-alert active="true">
            <p style="text-align:center;">Cantidad de instituciones temporales</p>
        </vs-alert>
        <vs-table max-items="10" search pagination :data="getReportVisitasTemporales" v-model="codigoSelected2" multiple>
           <template slot="header">
                Cantidad Instituciones: {{getReportVisitasTemporales.length}}
                <vs-button color="warning" size="small" class="ml-3" style="font-size: 14px;margin-left: 50px;" @click="tipo= 2;activePrompt=true;">Exportar</vs-button>
            </template>
            <template slot="thead">
                <vs-th>Institucion</vs-th>
                <vs-th>Ciudad</vs-th>
                <vs-th>Cantidad de visitas</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].nombre_institucion}}<br>
                        <small>{{tr.region}}</small>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].ciudad}}<br>
                    </vs-td> 
                    <vs-td>
                        {{data[indextr].contador}}<br>
                    </vs-td>   
                </vs-tr>
            </template>
        </vs-table>
        <!--modal exportar-->
            <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
            <div class="flex">
                <!--<span class="mr-4">Cell Auto Width:</span>
                <vs-switch v-model="cellAutoWidth">Cell Auto Width</vs-switch>-->
            </div>
        </vs-prompt>
    </div>
</template>
<script>
export default {
    data() {
      return{
        getReportVisitas:[],
        getReportVisitasTemporales:[],
        //VARIABLES PARA EXPORTAR A EXCEL
        codigoSelected: [],
        codigoSelected2: [],
        formats: ['xls', 'xlsx', 'csv', 'txt'],
        fileName:null,
        selectedFormat: 'xls',
        cellAutoWidth: true,
        activePrompt: false,
        //FIN VARIABLES PARA EXPORTAR A EXCEL
        tipo:1,
      }  
    },
    props:{
        ReportVisitas:{
            type:Array,
            default: []
        },
         ReportVisitasTemporales:{
            type:Array,
            default: []
        },
    
    },
     watch: {
        ReportVisitas (results) {
            this.reRenderVisitas(results)
        },
        ReportVisitasTemporales (results) {
            this.reRenderVisitasTemporales(results)
        },
    },
    methods:{
        reRenderVisitas (results) {
            const me = this 
            me.getReportVisitas = results 
        },
        reRenderVisitasTemporales(results){
            const me = this 
            me.getReportVisitasTemporales = results 
        },
        //METODOS PARA EXPORTAR A EXCEL
        exportToExcel() {
            let me = this;
            var arregloCodigos = []
            var headerTitle = []
            var headerVal = []
            if(me.tipo == 1){
                headerTitle = [ 'Institucion','Contador','Ciudad'];
                headerVal = [ 'nombreInstitucion','contador','ciudad'];
                arregloCodigos =  this.codigoSelected
            }else{
                headerTitle = [ 'Institucion','Contador','Ciudad'];
                headerVal = [ 'nombre_institucion','contador','ciudad'];
                arregloCodigos =  this.codigoSelected2
            }
            import('@/vendor/Export2Excel').then(excel => {
                const data = this.formatJson(headerVal, arregloCodigos)
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
                this.codigoSelected2 = [];
            })
        },

        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
            //limpiar campos para exportar de nuevo
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //FIN METODOS PARA EXPORTAR A EXCEL
    }
}
</script>