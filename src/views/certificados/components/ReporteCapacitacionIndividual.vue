<template>
    <div>
        <div class="flex mt-5">
            <div style="width: 25%;">
                <p> <ion-icon style="font-size: 18px;position: relative;top: 3px;" name="people-circle-outline"></ion-icon> Seleccione el capacitador</p>
            </div>
            <div style="width: 50%;">
                <v-select :options="arregloCapacitadores" @input="arregloReporte = [];" :reduce="arregloCapacitadores => arregloCapacitadores" label="capacitador" class="w-full" v-model="asesorSelect" />
            </div>
        </div>
        <!-- <div class="flex mt-5">
            <div style="width: 25%;">
                <p> <ion-icon style="font-size: 18px;position: relative;top: 3px;" name="people-circle-outline"></ion-icon> Seleccione el asesor</p>
            </div>
            <div style="width: 50%;">
                <v-select :options="lista_asesores" @input="arregloReporte = [];" :reduce="lista_asesores => lista_asesores" label="nombres" class="w-full" v-model="asesorSelect" />
            </div>
        </div> -->
        <vs-divider>Filtro de Reporte</vs-divider>
        <div class="vx-row mb-4">
            <div class="vx-col w-full sm:w-full md:w-1/4 lg:w-1/4 xl:w-1/4 p-2 bg-gray-400 text-center" >
                <ul class="flex">
                    <li>
                    <vs-radio v-model="tipoFiltro" @input="valorSelect = '';arregloReporte = [];" vs-name="radios1tipoFiltro" vs-value="0">Por período</vs-radio>
                    </li>
                    <li>
                    <vs-radio v-model="tipoFiltro" @input="valorSelect = '';arregloReporte = [];" class="ml-2" vs-name="radios1tipoFiltro" vs-value="1">Por meses</vs-radio>
                    </li>
                </ul> 
            </div>
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 p-2 bg-gray-500" >
                <div v-if="tipoFiltro == 0">
                    <v-select :options="periodos" :reduce="periodos => periodos.idperiodoescolar" label="periodoescolar" class="w-full" v-model="valorSelect" />
                </div>    
                <div v-if="tipoFiltro == 1">
                    <ul class="flex">
                        <li v-for="(tr,index) in anios" :key="index">
                            <vs-radio v-model="valorSelect" @input="arregloReporte = [];" class="m-2" vs-name="radios1" :vs-value="tr.anio">{{ tr.anio }}</vs-radio>
                        </li>
                    </ul>
                </div>
                <vs-button class="mt-5" @click="getReporte()" color="primary" type="border" icon="search">Buscar</vs-button>
            </div>
        </div>
         <!--MOSTRAR REPORTE-->
        <vs-table max-items="10" stripe search pagination :data="arregloReporte">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloReporte.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Institución</vs-th>
                <vs-th>Contador capacitaciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        <!--Institucion prolipa-->
                        <div v-if="tr.estado_institucion_temporal == 0">
                            <b>Asesor</b>
                            <p>{{ tr.asesor }}</p>
                            <b>Institución</b>
                            <p>{{ tr.nombreInstitucion }}</p>
                            <b>Ciudad</b>
                            <p>{{ tr.ciudad }}</p>
                            <!-- <b>Período</b>
                            <p>{{ tr.periodo }}</p> -->
                        </div>
                        <!--Institucion Temporal-->
                        <div v-else>
                            <b>Institución</b>
                            <p>{{ tr.nombre_institucion_temporal }}</p>
                            <b>Ciudad</b>
                            <p>{{ tr.ciudad_temporal }}</p>
                            <b>Período</b>
                            <p>{{ tr.periodo }}</p>
                        </div>        
                    </vs-td>
                    <vs-td>
                        <!--FILTRO POR PERIODO-->
                        <div v-if="tipoFiltro == 0">
                            <vs-divider> <p><b>Total visitas:</b> {{ tr.reporte.length }} </p></vs-divider>
                            <div v-if="tr.reporte.length > 0">
                                {{ item }}
                                <p v-for="(item,key2) in tr.reporte" :key="key2"><b>*</b> {{ item.tema }}</p>
                            </div>
                        </div>
                        <!--FILTRO POR MESES-->
                        <div v-else>
                            <vs-list>
                                <vs-list-header :title="'Año '+valorSelect"></vs-list-header>
                                <p>Enero        <b v-if="tr.reporte[0].Ene > 0">{{ tr.reporte[0].Ene }}</b> <span v-else>{{ tr.reporte[0].Ene }}</span></p>
                                <p>Febrero      <b v-if="tr.reporte[0].Feb > 0">{{ tr.reporte[0].Feb }}</b> <span v-else>{{ tr.reporte[0].Feb }}</span></p>
                                <p>Marzo        <b v-if="tr.reporte[0].Mar > 0">{{ tr.reporte[0].Mar }}</b> <span v-else>{{ tr.reporte[0].Mar }}</span></p>
                                <p>Abril        <b v-if="tr.reporte[0].Abr > 0">{{ tr.reporte[0].Abr }}</b> <span v-else>{{ tr.reporte[0].Abr }}</span></p>
                                <p>Mayo         <b v-if="tr.reporte[0].May > 0">{{ tr.reporte[0].May }}</b> <span v-else>{{ tr.reporte[0].May }}</span></p>
                                <p>Junio        <b v-if="tr.reporte[0].Jun > 0">{{ tr.reporte[0].Jun }}</b> <span v-else>{{ tr.reporte[0].Jun }}</span></p>
                                <p>Julio        <b v-if="tr.reporte[0].Jul > 0">{{ tr.reporte[0].Jul }}</b> <span v-else>{{ tr.reporte[0].Jul }}</span></p>
                                <p>Agosto       <b v-if="tr.reporte[0].Ago > 0">{{ tr.reporte[0].Ago }}</b> <span v-else>{{ tr.reporte[0].Ago }}</span></p>
                                <p>Septiembre   <b v-if="tr.reporte[0].Sep > 0">{{ tr.reporte[0].Sep }}</b> <span v-else>{{ tr.reporte[0].Sep }}</span></p>
                                <p>Octubre      <b v-if="tr.reporte[0].Oct > 0">{{ tr.reporte[0].Oct }}</b> <span v-else>{{ tr.reporte[0].Oct }}</span></p>
                                <p>Noviembre    <b v-if="tr.reporte[0].Nov > 0">{{ tr.reporte[0].Nov }}</b> <span v-else>{{ tr.reporte[0].Nov }}</span></p>
                                <p>Diciembre    <b v-if="tr.reporte[0].Dic > 0">{{ tr.reporte[0].Dic }}</b> <span v-else>{{ tr.reporte[0].Dic }}</span></p>
                            </vs-list>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <br><br><br>
    </div>
</template>
<script>
import vSelect from 'vue-select';
import moment from 'moment'
export default{
    data(){
        return{
            asesorSelect:'',
            valorSelect:'',
            tipoFiltro:0,
            anios:[],
            arregloReporte:[],
            yactual:null,
            menosUno:null,
            menosDos:null,
        }
    },
    components:{
        vSelect,
    },
    props:{
        lista_asesores:{
            type:Array,
            default:[],
        },
        periodos:{
            type:Array,
            default:[],
        },
        arregloCapacitadores:{
            type:Array,
            default:[],
        },
    },
    created(){
        let me = this;
        me.yactual = moment().format('YYYY');
        //restar Anios
        me.menosUno = me.yactual - 1;
        me.menosDos = me.yactual - 2;
        me.anios.push({anio:me.yactual});
        me.anios.push({anio:me.menosUno});
        me.anios.push({anio:me.menosDos});  
        me.anioSelect = this.anios[0].anio
    },
    methods:{
        getReporte(){ 
            let me = this;
            if( me.asesorSelect == "" || me.asesorSelect == null || me.asesorSelect == undefined ){
                me.$vs.notify({
                text:'Seleccione un capacitador para filtrar',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if( me.valorSelect == "" || me.valorSelect == null || me.valorSelect == undefined ){
                me.$vs.notify({
                text:'Seleccione algun valor de filtro',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            this.$vs.loading()
            var datos =  this.asesorSelect.idusuario +'*'+this.tipoFiltro + '*'+ this.valorSelect;
            this.$http.get(this.$server_url + 'reporteCapacitaciones/' + datos)
            .then(res => {
               this.$vs.loading.close()
               me.arregloReporte = res.data
            })
            .catch((e) =>{
                this.$vs.loading.close()
            })
        }
    }
}
</script>