<template>
    <vx-card>
        <div class="flex mt-5">
            <div style="width: 40%;">
                <p> <ion-icon name="contract-outline"></ion-icon>  Filtro de instituciones por período</p>
            </div>
            <div style="width: 60%;">
                <v-select @input="getInstitucionesReporte()" :options="arrayPeriodos" :reduce="arrayPeriodos => arrayPeriodos.idperiodoescolar" label="periodoescolar" class="w-full" v-model="periodoSelect" />
            </div>
        </div>
        <vs-divider></vs-divider>
        <div v-if="arregloReporte.length > 0">
            <vs-table multiple v-model="codigoSelected" max-items="10" search pagination :data="arregloReporte">
                <template slot="header">
                    <vs-chip  color="primary">Cantidad: <b> {{ arregloReporte.length }}</b></vs-chip>
                    <span class="cursor-pointer" @click="activePrompt=true;"><vs-chip  color="success" ><b><ion-icon name="download-outline"></ion-icon> Exportar</b></vs-chip></span>
                </template>
                <template slot="thead">
                    <vs-th>Institución</vs-th>
                    <vs-th>Venta bruta</vs-th>
                    <vs-th>Venta neta</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].INSTITUCION}}<br>
                            <p><b>Ciudad:</b> {{ tr.INS_CIUDAD }}</p>
                            <p><b>Contrato:</b> {{ tr.CONTRATO }}</p>
                            <p><b>Vendedor:</b> {{ tr.VENDEDOR }}</p>
                        </vs-td>
                        <vs-td>
                            {{ filtrarDecimal(tr.VEN_VALOR) }}
                        </vs-td>
                        <vs-td>
                            {{ filtrarDecimal(tr.ven_neta) }}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
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
import vSelect from 'vue-select'
import PeriodoRepository from '@/repositories/PeriodoRepository'
export default{
    data(){
        return{
            arregloReporte:[],
            arrayPeriodos:[],
            periodoSelect:'',
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
        vSelect,
    },
    mounted(){
        let me = this;
        me.obtenerPeriodos()
    },
    methods:{
      obtenerPeriodos(){
        let me = this;
        PeriodoRepository.getPeriodos().then( p => { me.arrayPeriodos = p.data.filter(p => p.reporte_gerencia == 1 ) });
      },
        getInstitucionesReporte(){
            let me = this;
            me.arregloReporte = []
            if( me.periodoSelect == "" || me.periodoSelect == null || me.periodoSelect == undefined ){
                me.$vs.notify({
                text:'Seleccione un período por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.$vs.loading()
            this.$http.get(this.$server_url+'reporteVentaInstituciones?periodo_id='+me.periodoSelect)
                .then(function (res) {
                    me.$vs.loading.close()
                    let datos = res.data
                    datos.forEach(element => {
                        var cal = new Object();
                        cal.VEN_VALOR   = parseFloat(element.VEN_VALOR).toFixed(2)
                        cal.PERIODO     = element.PERIODO
                        cal.ven_neta    = parseFloat(element.ven_neta).toFixed(2)
                        cal.INSTITUCION = element.INSTITUCION
                        cal.INS_CIUDAD  = element.INS_CIUDAD
                        cal.CONTRATO    = element.CONTRATO
                        cal.VENDEDOR    = element.VENDEDOR
                        me.arregloReporte.push(cal)
                    });
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })

        },
        filtrarDecimal(numero){
            let me = this
            if(numero == 0){
                return numero
            }else{
                let preNumero = parseFloat(numero)
                const transformar = (preNumero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
                return transformar
            }
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
            let headerTitle = ['Institución','Ciudad','Contrato',  'Venta Bruta','Venta Neta','Vendedor'];
            let headerVal = ['INSTITUCION', 'INS_CIUDAD','CONTRATO','VEN_VALOR','ven_neta','VENDEDOR'];
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
