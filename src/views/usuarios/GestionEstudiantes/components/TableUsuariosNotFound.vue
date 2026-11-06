<template>
    <div>
        <vs-table max-items="3"  pagination :data="arregloEstudiantes" search>
            <template slot="header">
                <div class="flex">
                    <vs-chip transparent class="py-3" color="success">Cantidad: {{ arregloEstudiantes.length }}</vs-chip>
                    <span @click="exportToExcel()" class="cursor-pointer">
                        <vs-chip transparent class="py-3" style="font-weight: bold;" color="warning"><i class="fa-solid fa-download"></i><span class="ml-2">Exportar</span> </vs-chip>
                    </span>
                </div>
            </template>
            <template slot="thead">
                <vs-th style="width:60%;">Cedula</vs-th>           
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" >                  
                    <vs-td>
                        {{ tr.cedula }}<br>
                    </vs-td>          
                </vs-tr>
            </template>
        </vs-table>
    </div>
</template>
<script>
export default{
    props:{
        arregloEstudiantes:{
            type:Array,
            defaul:[]
        }
    },
    data(){
        return{
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
            let headerTitle = ['Cédula'];
            let headerVal = ['cedula'];  
            let codigoSelectedMayus = this.arregloEstudiantes
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
                    filename: 'Cedulas no encontradas',
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