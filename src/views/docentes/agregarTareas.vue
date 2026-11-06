<template>
<div>

    <vs-popup title="Confirmar" :active.sync="popupActiveConfirm">
        <div align="center">
            <div v-if="estudiantesSelect===null || estudiantesSelect==='' || estudiantesSelect.length == 0">
                La tarea será agregada para todo el curso.<br>
            </div>
            <div v-else>
                La Tarea será agregada únicamente para los estudiantes seleccionados.<br>
            </div>
            <vs-button class="mt-5" color="warning" @click="popupActiveConfirm=false; enviar()" type="filled">Aceptar</vs-button>
        </div>
    </vs-popup>

    <vx-card title="">
        <div class="vx-row mb-6 text-center">
            <div class="vx-col sm:w-1/2 w-full mb-4">
                <b>Mis Archivos </b>
                <br>
                <vs-radio @input="getArchivos" v-model="opcion" vs-value="0"></vs-radio>
                <!-- <input type="radio" id="radioPerfiles1" @input="getArchivos" v-bind:value="'0'" v-model="opcion" class="option-input radio"> -->
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-4" v-if="tipo_asignatura == 'prolipa' ">
                <b>Teletareas </b>
                <br>
                <vs-radio @input="getteletareas" v-model="opcion" vs-value="1"></vs-radio>
                <!-- <input type="radio" id="radioPerfiles2" @input="getteletareas" v-bind:value="'1'" v-model="opcion" class="option-input radio"> -->
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col w-full">
                <v-select :options="listaTareas" :reduce="listaTareas => listaTareas.idcontenido" label="nombre" v-model="idcontenido"></v-select>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Fecha de Inicio *</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <flat-pickr class="w-full" :config="configdateTimePicker" v-model="fecha_inicio" />
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Fecha de Entrega *</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <flat-pickr class="w-full" :config="configdateTimePicker" v-model="fecha_final" />
            </div>
        </div>
        <div class="vx-row mb-3">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Descripción *</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-textarea v-model="descripcion" height="150px" />
            </div>
        </div>

        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <b>Estudiante: </b><br>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select multiple :closeOnSelect="false" :options="listaEstudiantes" :reduce="listaEstudiantes => listaEstudiantes.idusuario" label="nombre_completo" v-model="estudiantesSelect"></v-select>
                <span style="font-size: 12px;">Si desea agregar la tarea para <b>todo</b> el curso, deje este campo <b>vacío</b>.</span>
            </div>
        </div>

        <div class="vx-row mt-2">
            <div class="vx-col sm:w-2/3 w-full ml-auto">

                <vs-button v-if="editarActivo===0" class="mr-3 mb-2" @click="popupActiveConfirm=true;">Agregar</vs-button>

                <vs-button v-else class="mr-3 mb-2" @click="editarTarea()">Editar</vs-button>

                <!--<vs-button color="danger" type="border" to="/docente/curso/tarea">Cancelar</vs-button>-->
                <vs-button color="danger" type="border" @click="$router.go(-1)">Cancelar</vs-button>
            </div>
        </div>
    </vx-card>
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
        flatPickr
    },
    data() {
        return {
            datei: null,
            datef: null,
            activePrompt: false,
            activePrompt2: false,
            tmpListaTareas: [],
            listaTareas: [],
            usuario: [],
            datetime: null,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:ss'
            },
            idcontenido: '',
            fecha_inicio: '',
            fecha_final: '',
            descripcion: '',
            opcion: 0,
            idTareaEditar: '',
            editarActivo: 0,
            listaEstudiantes: [],
            estudiantesSelect: [],
            popupActiveConfirm: false,
            tipo_asignatura: '',
            id_asignatura: 0,
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));

        if (localStorage.idtarea != '' || localStorage.idtarea != null) {
            this.cargarFormulario();
        } else {
            this.editarActivo = 0;
            this.fecha_inicio = '';
            this.fecha_final = '';
            this.descripcion = '';
            this.idTareaEditar = '';
            localStorage.idtarea = '';
        }
        //console.log('localStorage.idcurso: ' + localStorage.idcurso);
    },
    computed: {

    },
    mounted() {
        this.tipo_asignatura = localStorage.getItem('tipo_asignatura');
        this.id_asignatura = localStorage.getItem('idasignatura');
        this.wasSidebarOpen = this.$store.state.reduceButton
        this.$store.commit('TOGGLE_REDUCE_BUTTON', false)
        this.getArchivos();
        this.getEstudiantes();
    },
    methods: {
        async getteletareas() {
            let me = this;
            me.$vs.loading()
            me.listaTareas = []
            me.idcontenido = ''
            // var url = this.$server_url+"getContenidoTodo?idusuario=" + me.usuario.idusuario;
            var url = this.$server_url+"teletarea_asignatura/" + me.id_asignatura;
            this.$http.get(url).then(function (response) {
                    // console.log(response.data);
                    me.listaTareas = response.data;
                    // for (let index = 0; index < me.tmpListaTareas.length; index++) {
                    //     if (me.tmpListaTareas[index].idasignatura === parseInt(me.id_asignatura)) {
                    //         me.listaTareas.push(me.tmpListaTareas[index])
                    //     }
                    // }
                    console.log( me.listaTareas )
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                    me.$vs.loading.close()
                });
        },
        async getArchivos() {
            let me = this;
            me.$vs.loading()
            me.listaTareas = []
            me.idcontenido = ''
            var url = this.$server_url+"getContenido?idcurso=" + localStorage.idcurso + "&idasignatura=";
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data;
                    me.listaTareas = response.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                });
        },
        enviar() {
            let idestudiantes = [];
            for (var i = 0; i < this.estudiantesSelect.length; i++) {
                idestudiantes.push(this.estudiantesSelect[i]);
            }

            let me = this
            let formData = new FormData();
            formData.append('idestudiantes', idestudiantes);
            formData.append('finicial', me.fecha_inicio);
            formData.append('ffinal', me.fecha_final);
            formData.append('descripcion', me.descripcion);
            formData.append('idcontenido', me.idcontenido);
            formData.append('idcurso', localStorage.idcurso);
            this.$http.post(this.$server_url+"guardarTarea", formData)
                .then(function (response) {
                    //me.$router.push('/docente/curso/virtual');
                    me.$router.go(-1);
                })
                .catch(function (error) {
                    //alert('error');
                })
        },
        cargarFormulario() {
            if (localStorage.idtarea != '') {
                this.editarActivo = 1;
                this.fecha_inicio = localStorage.fecha_inicio;
                this.fecha_final = localStorage.fecha_final;
                this.descripcion = localStorage.descripcion;
                this.idTareaEditar = localStorage.idtarea;
            }
        },
        editarTarea() {
            let me = this
            let formData = new FormData();
            formData.append('finicial', me.fecha_inicio);
            formData.append('ffinal', me.fecha_final);
            formData.append('descripcion', me.descripcion);
            formData.append('idcontenido', me.idcontenido);
            formData.append('idtarea', localStorage.idtarea);
            formData.append('idcurso', localStorage.idcurso);
            this.$http.post(this.$server_url+"guardarTarea", formData)
                .then(function (response) {
                    if (response.data === 1) {
                        //alert(response.data);
                        me.fecha_inicio = '';
                        me.fecha_final = '';
                        me.descripcion = '';
                        me.idTareaEditar = '';
                        localStorage.idtarea = '';
                        me.editarActivo = 0;
                        me.idTareaEditar = '';
                        me.$vs.notify({
                            // title: 'Éxito',
                            text: 'Tarea modificada exitosamente',
                            color: 'success'
                        })
                        me.$router.go(-1);
                    } else {
                        //alert('error if: '+response.data);
                    }
                })
                .catch(function (error) {
                    //alert('error catch: ' + error);
                })
        },
        getEstudiantes() {
            //console.log(localStorage.codigo);
            let me = this;
            var url = this.$server_url+"getEstudiantes?codigo=" + localStorage.codigo;
            this.$http.get(url).then(function (response) {
                    me.listaEstudiantes = response.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },

    },
}
</script>
