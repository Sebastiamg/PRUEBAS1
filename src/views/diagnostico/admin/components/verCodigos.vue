<template>
    <div>
        <vs-alert color="success" class="p-3" style="min-height: 80px;">
            <p><i class="fa-solid fa-user"></i><b class="ml-3">Estudiante:</b> {{ informacionUser.estudiante }}</p>
            <p><i class="fa-solid fa-credit-card"></i><b class="ml-2">Cédula:    </b> {{ informacionUser.cedula }}</p>
        </vs-alert>
        <vs-table max-items="10" search pagination :data="arregloCodigos">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloCodigos.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Código</vs-th>
                <vs-th>Libro</vs-th>
                <vs-th>Prueba diagnóstico</vs-th>
                <vs-th>Calificación diagnóstica</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].codigo}}<br>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].nombrelibro}}<br>
                    </vs-td>
                    <vs-td>
                        <div v-if="tr.prueba_diagnostica == 1">
                            <p>
                                <vs-chip transparent class="py-2 ml-2" style="font-weight: bold;" color="success">Realizada</vs-chip>
                            </p>
                        </div>
                        <div v-else>
                            <p>
                                <vs-chip transparent class="py-2 ml-2" style="font-weight: bold;" color="warning">Pendiente</vs-chip>
                            </p>
                        </div>
                    </vs-td>
                    <vs-td>
                        <p>
                            <vs-chip transparent class="py-2 ml-2" style="font-weight: bold;" color="warning">{{tr.calificacion_diagnostica}}/{{ tr.cantidad_preguntas }}</vs-chip>
                        </p>
                    </vs-td>
                    <vs-td>
                        <div style="display: flex;">
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
            <FormatoPruebaVue :estudiante="informacionUser.estudiante" :calificacion="calificacion" :nombrelibro="nombrelibro" :arregloRespuestas="arregloRespuestas"/>
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
        informacionUser:{
            type:Object,
            default:{}
        }
    },
    data(){
        return{
            arregloRespuestas:[],
            popupRespuestas:false,
            title:'',
            nombrelibro:'',
            calificacion:'',
        }
    },
    mounted(){
        let me = this;
        me.title = "Resultado del estudiante: "+ me.informacionUser.estudiante
    },
    methods:{
        verPrueba(tr){
            let me = this;
            me.nombrelibro              = tr.nombrelibro
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
            formData.append('diagnostico_libros_id', tr.id);
            formData.append('estudiante_id',         tr.estudiante_id);
            this.$http.post(this.$server_url+'getDatosDiagnostico', formData)
            .then(function (res) {
                me.arregloRespuestas = res.data
                me.popupRespuestas   = true
            })
            .catch(function (error) {})
        }
    }
}
</script>