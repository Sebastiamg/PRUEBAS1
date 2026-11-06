<template>
    <div>
        <vs-table max-items="5" fullscreen search pagination :data="devoluciones">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: {{ devoluciones.length }}</vs-chip>
                    <vs-button color="warning" size="small" class="ml-3" style="margin-top:-5px;" @click="exportToExcel()">Exportar</vs-button>
                </template>
                <template slot="thead">
                    <vs-th>Codigo</vs-th>
                    <vs-th>Devolucion</vs-th>
                    <vs-th>Observacion</vs-th>
                    <vs-th>Editor</vs-th>
                    <vs-th>Estado</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{ tr.codigo }}
                        </vs-td>
                        <vs-td>
                            <p style="font-weight:bold;">Fecha devolucion:</p>
                            <span>{{ data[indextr].fecha_devolucion }}</span>
                            <p style="font-weight:bold;">Periodo:</p>
                            <span>{{tr.periodoescolar}}</span>
                            <p style="font-weight:bold;">Institucion:</p>
                            <span>{{tr.nombreInstitucion}}</span>
                                <p style="font-weight:bold;">Cliente:</p>
                            <span>{{tr.cliente}}</span>
                        </vs-td>
                        <vs-td>
                            {{ tr.observacion }}
                        </vs-td>
                        <vs-td>
                            {{ tr.editor }}
                        </vs-td>
                        <vs-td>
                            <vs-chip color="success" v-if="tr.estado == '1'">Activo</vs-chip>
                            <vs-chip color="warning" v-else>Desactivado</vs-chip>
                        </vs-td>
                    </vs-tr>
                </template>
        </vs-table>
    </div>
</template>
<script>
export default{
    data(){
        return{
            //variables para el export a excel
            activePrompt:false,
            codigoSelected: [],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xlsx',
            //fin variables para el export a excel
        }
    },
    props:{
        devoluciones:{
            type:Array,
            default:[],
        },
    },
    methods:{
        //METODOS PARA EXCEL
        //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
        exportToExcel() {
            let headerTitle = ['codigo','Fecha devolucion','Institucion','Periodo','Cliente',  'Editor','Observacion'];
            let headerVal = ['codigo', 'fecha_devolucion','nombreInstitucion','periodoescolar','cliente','editor','observacion'];
            let codigoSelectedMayus = this.devoluciones
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
                var nombrefile = ""
                if(this.openModal == 1){
                    nombrefile = this.fileName
                }else{
                    nombrefile = "Reporte de devolucion"
                }
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: nombrefile,
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
