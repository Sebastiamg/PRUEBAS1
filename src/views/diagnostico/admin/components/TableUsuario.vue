<template>
    <div>
        <vs-table v-if="menu == 0" max-items="5"  pagination :data="arregloEstudiantes" search>
            <template slot="header">
                <div class="flex">
                    <vs-chip transparent class="py-3" color="success">Cantidad: {{ arregloEstudiantes.length }}</vs-chip>
                    <span @click="exportToExcel()" class="cursor-pointer">
                        <vs-chip transparent class="py-3 ml-2" style="font-weight: bold;" color="warning"><i class="fa-solid fa-download"></i><span class="ml-2">Exportar</span> </vs-chip>
                    </span>
                </div>
            </template>
            <template slot="thead">
                <vs-th style="width:50%;">Datos Personales</vs-th>
                <vs-th style="width:20%;">Institución</vs-th>       
                <vs-th style="width:10%;">Estado</vs-th>  
                <vs-th style="width:10%;">Cod. ingresados</vs-th>  
                <vs-th style="width: 10%;">Período asignado</vs-th>             
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data" >                  
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
                        {{ tr.nombreInstitucion }}
                    </vs-td>
                    <vs-td>
                        <template>
                            <div v-if="tr.estado_idEstado == 1">
                                <vs-chip color="primary">
                                    <p>Activo</p>
                                </vs-chip>
                            </div>
                            <div v-else>
                                <vs-chip color="danger">
                                    <p>Desactivado</p>
                                </vs-chip>
                            </div>
                        </template>               
                    </vs-td> 
                    <vs-td>
                        <vx-tooltip  style="display: inline-block;" text="Ver códigos" position="top" color="primary">
                            <p class="cursor-pointer botonp" @click="getverCodigos(tr)">
                                <vs-chip transparent class="py-2 ml-2" style="font-weight: bold;" color="warning">{{tr.contador}}</vs-chip>
                            </p>
                        </vx-tooltip>
                    </vs-td> 
                    <vs-td>
                        <div v-if="tr.periodo == '' || tr.periodo == null">
                            No asignado
                        </div>
                        <div v-else>
                            {{ tr.periodo }}
                        </div>
                    </vs-td>           
                </vs-tr>
            </template>
        </vs-table>
        <div v-if="menu == 1">
            <vs-button radius color="success" @click="menu = 0" type="gradient" icon="reply"></vs-button>
            <verCodigos class="mt-4" :arregloCodigos = "arregloCodigos" :informacionUser="informacionUser"/>
        </div>
    </div>
</template>
<script>
import verCodigos from './verCodigos.vue'
export default{
    props:{
        arregloEstudiantes:{
            type:Array,
            defaul:[]
        },
        datosExportar:{
            type:Array,
            defaul:[]
        },
        institucion_id:{
            type:Number,
            default:0,
        },
        periodo_id:{
            type:Number,
            default:0,
        },
    },
    components:{
        verCodigos
    },  
    watch:{
        arregloEstudiantes(results){
            let me = this;
            me.menu = 0
        }
    },
    data(){
        return{
            //variables para el export a excel
            activePrompt:false,
            codigoSelected: [],
            arregloCodigos:[],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            //fin variables de excel
            menu:0,
            informacionUser:{},
        }
    },
    methods:{
        getverCodigos(tr){
            let me = this
            me.informacionUser = tr
            if(tr.contador == 0){
                me.$vs.notify({
                text:'No existe códigos para mostrar',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-code'})
                return
            }
            me.$vs.loading()
            this.$http.get(this.$server_url+'gestionEstudiante?getCodigosxEstudiante=yes&estudiante_id='+tr.idusuario+'&institucion_id='+me.institucion_id+'&periodo_id='+me.periodo_id)
            .then(function (res) {
                me.arregloCodigos = res.data
                me.menu = 1
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error + ' error');
                me.$vs.loading.close()
            })
            me.menu = 1
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
            let headerTitle = ['Estudiante','Cédula','Institución',  'Email','Cod. Ingresados'];
            let headerVal = ['estudiante', 'cedula','nombreInstitucion','email','contador'];  
            
            for (let index = 1; index < 11; index++) {
                headerTitle.push("Codigo" + index)
                headerVal.push("codigo" + index)
            }
            let codigoSelectedMayus = this.datosExportar
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
                    filename: 'ResultadoEstudiantes',
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
<style>
.botonp{
    transition: 1 ease all;
}
.botonp:hover{
    background-color: blueviolet;
}
</style>
