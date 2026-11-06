<template>
<div>
    <vs-table max-items="10" search pagination :data="listaTareas">
        <template slot="header">
            <h3>
                Tareas Enviadas
            </h3>
        </template>
        <template slot="thead">
            <vs-th sort-key="docente">Tarea Docente</vs-th>
            <vs-th sort-key="estudiante">Tarea Estudiante</vs-th>
            <vs-th sort-key="fecha_final">Observaciones</vs-th>
            <vs-th sort-key="fecha_final">Nota</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].tareadocente">
                    <a :href="$data_url+'tareas/'+data[indextr].urldocente" target="_blank">
                    <div v-if="data[indextr].tareadocente!=null">
                        <span v-if="data[indextr].tareadocente.length<30">{{ data[indextr].tareadocente}}</span>
                        <span v-else>{{ data[indextr].tareadocente.substring(30,0)}}....</span>
                    </div>
                    </a>
                    <br>
                    {{data[indextr].descripcion}}
                    <br>
                    {{data[indextr].fecha_inicio}}
                    <br>
                    {{data[indextr].fecha_final}}
                </vs-td>
                <vs-td :data="data[indextr].nombre">
                    <a :href="$data_url+'tareas/'+data[indextr].url" target="_blank">
                        
                        <span v-if="data[indextr].nombre.length<30">{{ data[indextr].nombre}}</span>
                        <span v-else>{{ data[indextr].nombre.substring(30,0)}}....</span>
                    </a>
                    <br>
                    {{data[indextr].comentario_estudiante}}
                    <br>
                    {{data[indextr].fecha}}
                </vs-td>
                <!-- 
                <vs-td :data="data[indextr].fecha_inicio">
                    <span>Inicio</span>
                    <br>
                    {{data[indextr].fecha_inicio}}
                    <br>
                    <span>Final</span>
                    <br>
                    {{data[indextr].fecha_final}}
                </vs-td> -->
                <vs-td :data="data[indextr].observacion">
                    <vs-alert color="primary" title="Observaciones" active="true">
                        <span v-text="data[indextr].observacion">
                        </span>
                    </vs-alert>
                </vs-td>
                <vs-td :data="data[indextr].nota" class="text-center">
                    <vs-alert v-if="data[indextr].nota != null" color="success" title="Nota" active="true">
                        <b>
                            {{data[indextr].nota}}
                        </b>
                    </vs-alert>
                    <vs-alert v-else color="danger" title="Por calificar" active="true">
                        <b>
                            0
                        </b>
                    </vs-alert>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Datepicker from 'vuejs-datepicker';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        Datepicker,
        flatPickr
    },
    data() {
        return {
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s'
            },
            datei: null,
            datef: null,
            activePrompt: false,
            activePrompt2: false,
            listaTareas: [],
            listaContenido: [],
            usuario: [],
            tarea: {},
            idcurso: ''
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.idcurso = localStorage.getItem('idcurso')
    },
    mounted() {
        this.getTareas();
    },
    methods: {
        getTareas(id) {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            var url = this.$server_url+"tareaEstudianteRealizada?idcurso=" + me.idcurso + "&idusuario=" + me.usuario.idusuario;
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data;
                    me.listaTareas = response.data;
                    // console.log(respuesta)
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                });
        },
    },
}
</script>
