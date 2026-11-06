<template>
    <div>
        <vs-table max-items="10" search pagination :data="arregloCodigos">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloCodigos.length }}</b></vs-chip>
                <span @click="exportToExcel()" class="cursor-pointer">
                    <vs-chip transparent class="py-3 ml-2" style="font-weight: bold;" color="warning"><i class="fa-solid fa-download"></i><span class="ml-2">Exportar</span> </vs-chip>
                </span>
            </template>
            <template slot="thead">
                <vs-th>Datos Personales</vs-th>
                <vs-th>Institución</vs-th>      
                <vs-th>Código</vs-th>
                <vs-th>Prueba diagnóstico</vs-th>
                <vs-th>Calificación diagnóstica</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <br/>
                        Nombres:
                        <br>        
                        <span style="font-weight:600;  " >
                        {{ tr.estudiante }}<br>
                        </span>
                        Cédula:
                        <br>  
                        <span style=" font-weight:600; " >
                        {{ tr.cedula }}<br>
                        </span>
                        Email:
                        <br>  
                        <span style=" font-weight:600; " >
                        {{ tr.email }}<br>
                        </span>
                    </vs-td>
                    <vs-td>
                        Institución:
                        <br>  
                        <span style=" font-weight:600; " >
                        {{ tr.nombreInstitucion }}<br>
                        </span>
                        Período:
                        <br>  
                        <span style=" font-weight:600; " >
                            <div v-if="tr.periodo == '' || tr.periodo == null">
                                No asignado
                            </div>
                            <div v-else>
                                {{ tr.periodo }}
                            </div>
                        </span>
                    </vs-td>
                    <vs-td>
                        Libro:
                        <br>  
                        <span style=" font-weight:600; " >
                        {{ tr.nombrelibro }}<br>
                        </span>
                        Código:
                        <br>  
                        <span style=" font-weight:600; " >
                            <div v-if="tr.statusCodigo == '1'">
                               <vs-chip color="primary">{{ tr.codigo }}</vs-chip> <br>
                            </div>
                            <div v-else>
                                <vs-chip color="danger">{{ tr.codigo }}</vs-chip> <br>
                            </div>
                        </span>
                    </vs-td>
                    <vs-td>
                        <div v-if="tr.statusCodigo == '1'">
                            <div v-if="tr.prueba_diagnostica == 1">
                                <p>
                                    <vs-chip transparent class="py-2 ml-2" style="font-weight: bold;" color="success">Realizada</vs-chip>
                                </p>
                            </div>
                            <div v-if="tr.prueba_diagnostica == 0">
                                <p>
                                    <vs-chip transparent class="py-2 ml-2" style="font-weight: bold;" color="warning">Pendiente</vs-chip>
                                </p>
                            </div>
                        </div>
                    </vs-td>
                    <vs-td>
                        <p v-if="tr.statusCodigo == '1'">
                            <vs-chip transparent class="py-2 ml-2" style="font-weight: bold;" color="warning">{{tr.calificacion_final}}</vs-chip>
                        </p>
                    </vs-td>
                    <vs-td>
                        <div style="display: flex;" v-if="tr.statusCodigo == '1'">
                            <vx-tooltip style="display: inline-block;" text="Ver prueba diagnóstica" position="top" color="primary">
                                <p class="cursor-pointer" @click="verPrueba(tr)">
                                    <vs-chip transparent class="py-2 ml-2" style="font-weight: bold;" color="primary"><i class="fa-solid fa-file"></i> <b class="ml-1">Ver prueba</b></vs-chip>
                                </p>
                            </vx-tooltip> &nbsp;
                        </div>
                    </vs-td> 
                </vs-tr>
            </template>
        </vs-table> 
        <!--MODALES-->
        <!--Modal para ver las respuestas del estudiante-->
        <vs-popup class="holamundo" fullscreen title="Resultado prueba diagnóstica" :active.sync="popupRespuestas">
            <FormatoPruebaVue :estudiante="estudiante" :calificacion="calificacion" :nombrelibro="nombrelibro" :arregloRespuestas="arregloRespuestas"/>
        </vs-popup>
    </div>
</template>
<script>
import FormatoPruebaVue from './FormatoPrueba.vue';
export default{
    components:{
        FormatoPruebaVue
    },
    props:{
        arregloCodigos:{
            type:Array,
            default:[],
        },
    },
    data(){
        return{
            arregloRespuestas:[],
            popupRespuestas:false,
            estudiante:'',
            nombrelibro:'',
            calificacion:'',
            //variables para el export a excel
            activePrompt:false,
            codigoSelected: [],
            arregloCodigos:[],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            //fin variables de exportar excel
        }
    },
    mounted(){
        let me = this;
    },
    methods:{
        verPrueba(tr){
            let me = this;
            me.nombrelibro              = tr.nombrelibro
            me.estudiante               = tr.estudiante
            me.calificacion             = tr
            if(tr.calificacion_diagnostica == 0){
                me.$vs.notify({
                text:'Aún no dado esta prueba el estudiante',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-file'})
                return 
            }
            let formData = new FormData();
            formData.append('diagnostico_libros_id', tr.diagnostico_libros_id);
            formData.append('estudiante_id',         tr.idusuario);
            this.$http.post(this.$server_url+'getDatosDiagnostico', formData)
            .then(function (res) {
                me.arregloRespuestas = res.data
                me.popupRespuestas   = true
            })
            .catch(function (error) {})
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
            let headerTitle = ['Estudiante','Cédula','Institución',  'Email','Estado','Período asignado','libro','Cóodigo','Calificacion'];
            let headerVal = ['estudiante', 'cedula','nombreInstitucion','email','estado','periodo','libro','codigo','calificacion_final'];  
            let codigoSelectedMayus = this.arregloCodigos
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
                    filename: 'Reporte calificaciones',
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
            //     this.guardarActivo = '';
            //     this.generarActivo = ' ';
            //     this.textAlertCant = '';
            //     this.cantidad = '';
            //     this.codigoSelected = [];
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