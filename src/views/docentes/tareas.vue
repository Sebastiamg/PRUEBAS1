<template>
<div>
    <div>
        <vs-table max-items="10" search pagination :data="listaTareas">
            <template slot="header">
                <vs-button @click="verAgregar" color="dark">Agregar tareas</vs-button>
            </template>
            <template slot="thead">
                <vs-th>Id</vs-th>
                <vs-th>Nombre</vs-th>
                <vs-th sort-key="descripcion">Descripción</vs-th>
                <vs-th sort-key="fecha_inicio">Fecha inicio</vs-th>
                <!-- <vs-th sort-key="fecha_final">Foro</vs-th> -->
                <vs-th>Tareas entregadas</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].tarea.nombre">
                        T{{indextr}}
                    </vs-td>
                    <vs-td :data="data[indextr].tarea.nombre">
                        <a :href="$data_url+'tareas/'+data[indextr].tarea.url" :download="data[indextr].tarea.nombre" rel="noopener noreferrer">
                            <div v-if="data[indextr].tarea.nombre != null">
                                <span v-if="data[indextr].tarea.nombre.length<35">{{ data[indextr].tarea.nombre}}</span>
                                <span v-else>{{ data[indextr].tarea.nombre.substring(25,0)}}....</span>
                            </div>
                        </a>
                    </vs-td>
                    <vs-td :data="data[indextr].tarea.descripcion">
                        {{data[indextr].tarea.descripcion}}<br>
                        <div v-if="data[indextr].tarea.usuario_idusuario===null">
                            <span style="font-size: 13px;">Tarea para todo el curso</span>
                        </div>
                        <div v-else style="color: #ECA100;">
                            <span style="font-size: 13px;">Tarea para: {{ data[indextr].tarea.nombres_estudiante }}</span>
                        </div>
                    </vs-td>
                    <vs-td :data="data[indextr].tarea.fecha_inicio">
                        {{data[indextr].tarea.fecha_inicio}}<br>
                        {{data[indextr].tarea.fecha_final}}
                    </vs-td>
                    <!-- <vs-td :data="data[indextr].tarea" class="text-center">
                        <div class="flex">
                            <vs-button color="primary" type="relief" @click="foro(data[indextr].tarea)">Foro</vs-button>
                        </div>
                    </vs-td> -->
                    <vs-td class="text-center" :data="tr.respuesta">
                        <div class="flex">
                            <vs-button color="primary" @click="getRespuestas(tr.respuesta)"><b>{{tr.total[0]['cantidad']}}</b></vs-button>
                        </div>
                    </vs-td>
                    <vs-td class="text-center" :data="data[indextr].tarea">
                        <vs-button type="relief" color="warning" class="mb-2 w-full" size="small" @click="editar(data[indextr].tarea)"><b>Editar</b></vs-button>
                        <br>
                        <vs-button type="relief" color="danger" class="w-full" size="small" @click="confirmaEliminar(data[indextr].tarea.idtarea)"><b>Eliminar</b></vs-button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Datepicker from 'vuejs-datepicker';
import teletareasVue from './teletareas.vue';
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
            listaTareas: [],
            teletareas: [],
            usuario: [],
            datetime: null,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'd-m-Y H:i'
            },
            opcion: 0,
            eliminarId:'',
            grupo_usuario: '',
            idusuario: '',
            datoU: '',
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    mounted() {
        this.grupo_usuario = this.usuario.id_group;
        this.idusuario = this.usuario.idusuario;
        if (this.grupo_usuario == 10) { //director
            this.datoU = JSON.parse(localStorage.getItem('datoUser'))
            // console.log(this.datoU)
            this.idusuario = this.datoU.idusuario;
        }

        this.getTareas();
        this.getteletareas();
    },
    methods: {
        acceptAlert() {
            let me = this;
            let formData = new FormData();
            formData.append('idlibro', me.idlibro);
            formData.append('idcurso', localStorage.idcurso);
            this.$http.post(this.$server_url+'postLibroCurso', formData)
                .then(function (response) {
                    me.getLibros();
                    me.$vs.notify({
                        color: 'success',
                        title: 'Guardado',
                        text: 'Libro Agregado'
                    })
                })
                .catch(function (error) {})

        },
        close() {
            this.$vs.notify({
                color: 'danger',
                title: '',
                text: 'Datos no guardados!'
            })
        },
        clearValMultiple() {
            this.valMultipe.value1 = "";
            this.valMultipe.value2 = "";
        },
        getTareas() {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })

            var url = this.$server_url+"getTareasDocentes?idcurso=" + localStorage.idcurso;
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data;
                    if (response.data.length != 0) {
                        me.listaTareas = response.data.items;
                    } else {
                        me.listaTareas = [];
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                });

        },
        getRespuestas(respuesta) {
            let me  = this;
            localStorage.setItem('respuesta', JSON.stringify(respuesta));
            if (me.grupo_usuario == 10) {
                this.$router.push('/director/institucion/docentes/contenidos/libro/curso/tareas/recibidas');
                
            }else{

                this.$router.push('/clase/virtual/tareas');
            }
        },
        async getteletareas() {
            let me = this;
            var url = this.$server_url+"getContenidoTodo?idusuario=" + me.idusuario;
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data;
                    me.teletareas = response.data.items;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        foro(item) {
            localStorage.idtarea = item.idtarea;
            localStorage.nombre = item.nombre;
            localStorage.url = item.url;
            localStorage.descripcion = item.descripcion;
            localStorage.fecha_inicio = item.fecha_inicio;
            localStorage.fecha_final = item.fecha_final;
            this.$router.push('/docente/curso/virutal/foro');
        },
        verAgregar() {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            localStorage.idtarea = '';
            this.$router.push('/docente/curso/tarea/nueva');
        },
        confirmaEliminar(id) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            me.eliminarId = id;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar esta tarea?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminar
            })
        },
        eliminar() {
            let me = this;
            
            me.$vs.loading({
                color: '#046AE7'
            })
            this.$http
                .get(this.$server_url+"eliminarTarea?id=" + me.eliminarId)
                .then(function (response) {
                    me.getTareas(me.idcurso);
                })
                .catch(function (error) {
                    if (error.response.status == 422) {
                        me.errors = error.response.data.errors;
                    }
                });
        },
        editar(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            localStorage.idtarea = item.idtarea;
            localStorage.nombre = item.nombre;
            localStorage.url = item.url;
            localStorage.descripcion = item.descripcion;
            localStorage.fecha_inicio = item.fecha_inicio;
            localStorage.fecha_final = item.fecha_final;
            //alert('localStorage.idcurso: ' + localStorage.idcurso);
            this.$router.push('/docente/curso/tarea/nueva');
        }
    },
}
</script>

<style>
@keyframes click-wave {
    0% {
        height: 25px;
        width: 25px;
        opacity: 0.35;
        position: relative;
    }

    100% {
        height: 60px;
        width: 60px;
        margin-left: -20px;
        margin-top: -20px;
        opacity: 0;
    }
}

.option-input {
    -webkit-appearance: none;
    -moz-appearance: none;
    -ms-appearance: none;
    -o-appearance: none;
    appearance: none;
    position: relative;
    top: 13.33333px;
    right: 0;
    bottom: 0;
    left: 0;
    height: 25px;
    width: 25px;
    transition: all 0.15s ease-out 0s;
    background: #cbd1d8;
    border: none;
    color: #fff;
    cursor: pointer;
    display: inline-block;
    margin-right: 0.5rem;
    outline: none;
    position: relative;
    z-index: 1000;
}

.option-input:hover {
    background: #046AE7;
}

.option-input:checked {
    background: #046AE7;
}

.option-input:checked::before {
    height: 25px;
    width: 25px;
    position: absolute;
    content: '✔';
    display: inline-block;
    font-size: 26.66667px;
    text-align: center;
    line-height: 25px;
}

.option-input:checked::after {
    -webkit-animation: click-wave 0.65s;
    -moz-animation: click-wave 0.65s;
    animation: click-wave 0.65s;
    background: #046AE7;
    content: '';
    display: block;
    position: relative;
    z-index: 100;
}

.option-input.radio {
    border-radius: 50%;
}

.option-input.radio::after {
    border-radius: 50%;
}
</style>
