<template>
    <div>
        <table class="styled-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Estudiante</th>
                    <th>Fecha de entrega</th>
                    <th>Tarea</th>
                    <th>Calificación</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(item,key) in arregloEstudiantes" :key="key">
                    <td>{{ key + 1  }}</td>
                    <td>{{ item.estudiante }}</td>
                    <td>
                        <div v-if="item.tarea.length > 0">
                            {{ item.tarea[0].created_at }}
                        </div>
                        <div v-else>
                            <span>Tarea aun no subida</span>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.tarea.length > 0">
                            <button class="btnV" @click="estudianteTarea=item;getRespuestasTareas()">
                                <feather-icon icon="FileTextIcon" svgClasses="h-4 w-4" class="ml-2" style="position: inherit;top:3px" />
                                <span class="ml-2">Ver Tarea</span>
                            </button>
                        </div>
                        <div v-else>
                            <span>Tarea aun no subida</span>
                        </div>
                    </td>
                    <td>
                        <div v-if="item.tarea.length > 0">
                            <span>{{ item.tarea[0].calificacion }}</span>
                        </div>
                        <div v-else>
                            <span>0</span>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <!--MODALES-->
        <vs-popup classContent="popup-example" title="Mostrar tarea" :active.sync="popupMostrarTarea">
            <div>
                <h4 class="title-informacion">Tarea enviada</h4>
            </div>
            <DetalleTareasEnviadasVue @recharge="recharge" v-if="popupMostrarTarea" :arregloRespuestas="arregloRespuestas" :userDocente="userDocente" :estudianteTarea="estudianteTarea"/>
        </vs-popup>
    </div>
</template>
<script>
import DetalleTareasEnviadasVue from './DetalleTareasEnviadas.vue';
export default{
    data(){
        return{
            arregloEstudiantes:[],
            arregloRespuestas:[],
            estudianteTarea:{},
            popupMostrarTarea:false,
        }
    },
    components:{
        DetalleTareasEnviadasVue,
    },
    props:{
        codigoCurso:{
            type:String,
            default:'',
        },
        recurso:{
            type:Object,
            default:{}
        },
        userDocente:{
            type:Boolean,
            default:false,
        }
    },
    mounted() {
        let me = this;
        me.getEstudiantes()
    },
    methods: {
        getEstudiantes(){
           let me = this;
           let datos = me.codigoCurso + "*"+me.recurso.id
           this.$http.get(this.$server_url+'neetTema?listadoEstudiantesXCurso=yes&datos='+datos)
            .then(function (res) {
              me.arregloEstudiantes = res.data
            })
            .catch(function (error) {
              console.log(error + ' error');
              me.$vs.loading.close()
            })
        },
        getRespuestasTareas(){
            let me = this
            this.$http.get(this.$server_url + 'neetTema?listadoRespuestas=yes&tarea_id='+me.estudianteTarea.tarea[0].id)
                .then(function (res) {
                    me.arregloRespuestas = res.data
                    me.popupMostrarTarea = true
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        recharge(e){
            let me = this
            me.getEstudiantes()
            me.popupMostrarTarea = false
        },
    },
}
</script>
<style lang="scss">
@import '@/assets/scss/general/general.scss';
.styled-table {
  border-collapse: collapse;
  margin: 25px 0;
  font-size: 0.9em;
  font-family: sans-serif;
  min-width: 100%;

}
.styled-table thead tr {
  background-color: #EBF3F8;
  color: #22262D;
  text-align: left;
}
.styled-table th,
.styled-table td {
    padding: 12px 15px;
}
.styled-table tbody tr {
  border-bottom: 1px solid #dddddd;
}

.styled-table tbody tr:nth-of-type(even) {
  background-color: #f3f3f3;
}

.styled-table tbody tr:last-of-type {
  border-bottom: 2px solid #009879;
}
.styled-table tbody tr.active-row {
  font-weight: bold;
  color: #009879;
}
/*ESTILOS BOTONES*/
.btnV{
    color:#3E4448;
    background-color:#EBF3F8;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    font-weight: 100;
    font-size: 11px;
    transition: 0.5s ease;
    cursor: pointer;
}
.btnV:hover{
    color: #3EA0EA;
}
.title-informacion{
    background-color: var(--fondo);
    padding: 10px;
    color:var(--titulo)
}
</style>
