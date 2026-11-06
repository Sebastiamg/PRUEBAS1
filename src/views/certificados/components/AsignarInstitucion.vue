<template>
    <div>
        <div v-if="menu == 0">
            <vs-row class="mt-5">
                <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">
                    <vs-button size="small" @click="menu = 1;" type="relief">Añadir nueva institución</vs-button>
                </vs-col>
            </vs-row>
            <vs-divider><p>Búsqueda de institución</p></vs-divider>
            <div style="width:100%;display:flex;" class="mt-5">
                <div style="width:80%;">
                    <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucionAsesor()" v-model="busquedaInstitucion" />
                </div>
                <div style="width:20%;margin-left:15px;">
                    <vs-button radius color="warning" @click="getInstitucionAsesor()" type="filled" icon="search"></vs-button>
                </div>
            </div>
            <div v-if="institucionesAsesor.length >0">
                <vs-table stripe max-items="5" search pagination :data="institucionesAsesor">
                    <template slot="header">
                        <div class="vx-row">
                            <div class="vx-col w-full m-3">
                                Cantidad: {{institucionesAsesor.length}}
                            </div>
                        </div>
                    </template>
                    <template slot="thead">
                        <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                        <vs-th sort-key="nombre">Localidad</vs-th>
                        <vs-th sort-key="nombre">Período</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].nombreInstitucion">
                                {{data[indextr].nombreInstitucion}}<br>
                            </vs-td>
                            <vs-td :data="data[indextr].nombreregion">
                                {{data[indextr].nombreregion}} <br>
                                <small>{{data[indextr].ciudad}}</small>
                            </vs-td>
                            <vs-th sort-key="nombre">{{ tr.periodo }}</vs-th>
                            <vs-td>
                                <div class="flex">
                                    <vs-button size="small" type="relief" style="border-radius: 5px;" icon-pack="feather" icon="icon-bookmark" class="mr-2" color="primary" @click="asginarInstitucion(tr);">
                                        Asignar
                                    </vs-button>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>
        <div v-if="menu == 1">
            <vs-button size="small" class="mt-3" color="success" radius="" @click="menu = 0;" icon="reply" type="gradient"></vs-button>
            <CrearInstitucionTemporalVue :arregloCiudad="arregloCiudad" @changeInstitucionCreada="changeInstitucionCreada"/>
        </div>
    </div>
</template>
<script>
import CrearInstitucionTemporalVue from './CrearInstitucionTemporal.vue';
export default{
    data(){
        return{
            busquedaInstitucion:'',
            institucionesAsesor:[],
            estado_institucion_temporal:0,
            periodo_id_temporal: 0,
            menu:0,
        }
    },
    props:{
        tipoCapacitacion:{
            type:Number,
            default:1
        },
        arregloCiudad:{
            type:Array,
            default:[]
        }
    },
    components:{
        CrearInstitucionTemporalVue,
    },
    methods:{
        getInstitucionAsesor() {
            let me = this;
            me.institucionesAsesor = [];
            if (me.busquedaInstitucion.length < 5) {
                me.$vs.notify({
                    text: 'Minimo 5 caracteres de busqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            me.$vs.loading()
            var url = ""
            ///tipoCapacitacion => . = instituciones prolipa; 1 instituciones temporales
            if(me.tipoCapacitacion == 1){
                url = this.$server_url + 'listaInsitucionAsesor?temporales=yes'+'&asesor_id=' + localStorage.asesorSeleccionado
            }else{
                url = this.$server_url + 'listaInsitucionAsesor?busqueda=' + me.busquedaInstitucion + '&cedula=' + localStorage.planificacion_cedula
            }
            this.$http.get(url)
                .then(function (res) {
                    me.institucionesAsesor = res.data;
                    me.$vs.loading.close()
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user',
                            time: 8000
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        asginarInstitucion(tr) {
            let me = this;
            if(me.tipoCapacitacion == 1){
                let datos                       = {
                    nombreInstitucion            : tr.nombreInstitucion,
                    institucion_id_temporal      : tr.institucion_temporal_id,
                    estado_institucion_temporal  : 1,
                    periodo_id_temporal          : tr.periodo_id
                }
                me.institucionesAsesor           = []
                me.changeInstitucionCreada(datos)
            }else{
                let datos                        = {
                    nombreInstitucion            : tr.nombreInstitucion,
                    institucion_id               : tr.idInstitucion,
                    estado_institucion_temporal  : 0,
                }
                me.institucionesAsesor           = []
                me.changeInstitucionCreada(datos)
            }
        },
        changeInstitucionCreada(e){
            let me = this
            me.$emit('changeInstitucionCreada',e)
        }
    }
}
</script>