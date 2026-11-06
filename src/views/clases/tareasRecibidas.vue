<template>
<vx-card title="Tareas Entregadas">
    <vs-button color="primary" type="border" class="m-1" @click="$router.go(-1)"><b>← Volver</b></vs-button>

    <div class="demo-alignment">
        <!-- <vs-prompt title="Ingresar Calificación" @cancel="val=''" @accept="acceptAlert" @close="close" :active.sync="activePrompt">
            <div class="con-exemple-prompt"> -->
        <vs-popup fullscreen title="Ingresar Calificación" :active.sync="activePrompt">
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <b>Fecha de Entrega</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    {{estudiante.fecha}}
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <b>Correo</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    {{estudiante.email}}
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <b>Cedula</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    {{estudiante.cedula}}
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <b>Estudiante</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    {{estudiante.nombres}} {{estudiante.apellidos}}
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <b>Tarea Entregada</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <a :href="$data_url+'tareas/'+estudiante.url" target="_blank">{{estudiante.url}}</a>
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <b>Comentario Estudiante</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    {{estudiante.comentario_estudiante}}
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <b>Nota</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <vs-input type="number" min="0" class="w-full" v-model="estudiante.nota" />
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <b>Observación</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <vs-textarea v-model="estudiante.observacion" />
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/2 w-full">
                </div>
                <div class="vx-col sm:w-1/2 w-full">
                    <vs-button class="mr-2" color="success" @click="acceptAlert()">Guardar</vs-button>
                </div>
            </div>
            <!-- </div>
        </vs-prompt> -->
        </vs-popup>
    </div>
    <vs-table max-items="10" search pagination :data="respuestas">
        <template slot="thead">
            <vs-th>Nombres</vs-th>
            <vs-th>Archivo Entregado</vs-th>
            <vs-th>Fecha de Entrega</vs-th>
            <vs-th>Nota</vs-th>
            <vs-th>Calificar</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].nombres">

                    <div class="twitter-feed-header flex items-center">
                        <div class="con-vs-avatar m-0 35px" style="width: 35px; height: 35px; background: rgb(195, 195, 195);">
                            <div class="con-img vs-avatar--con-img"><img :src="$data_url+'archivos/'+'perfil/'+data[indextr].foto_user" alt=""></div>
                        </div>
                        <div class="leading-tight ml-3">
                            <p class="feed-author font-semibold">{{data[indextr].nombres}} {{data[indextr].apellidos}}</p>
                            <span class="flex items-center">
                                <small>{{data[indextr].email}}</small>
                                <span class="ml-1 feather-icon select-none relative">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-check h-3 w-3 bg-primary rounded-full text-white">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                </span>
                            </span>
                            <span class="flex items-center">
                                <small>{{data[indextr].cedula}}</small>
                            </span>
                        </div>
                    </div>
                </vs-td>
                <vs-td :data="data[indextr].url">
                    <a :href="$data_url+'tareas'+data[indextr].url" target="_blank">{{data[indextr].url}}</a>
                </vs-td>
                <vs-td :data="data[indextr].fecha">
                    {{data[indextr].fecha}}
                </vs-td>
                <vs-td :data="data[indextr].nota">
                    {{data[indextr].nota}}
                </vs-td>
                <vs-td :data="tr">
                    <div class="flex">
                        <vs-button type="border" class="mr-2" color="success" @click="calificar(tr)">Calificar</vs-button>

                        <vs-button type="border" class="mr-2" color="danger" @click="quitar(tr)">Devolver Tarea</vs-button>
                    </div>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
</vx-card>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
export default {
    data: () => ({
        respuestas: [],
        activePrompt: false,
        val: '',
        estudiante: [],
        usuario: '',
        grupo_usuario: '',
        idusuario: '',
        datoU: '',
    }),
    mounted() {
        this.respuestas = JSON.parse(localStorage.getItem('respuesta'));
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.grupo_usuario = this.usuario.id_group;
        this.idusuario = this.usuario.idusuario;
        if (this.grupo_usuario == 10) { //director
            this.datoU = JSON.parse(localStorage.getItem('datoUser'))
            // console.log(this.datoU)
            this.idusuario = this.datoU.idusuario;
        }
    },
    created() {},
    methods: {
        calificar(item) {
            this.activePrompt = true;
            console.log(item);
            this.estudiante = item;
            console.log(this.activePrompt);
        },
        acceptAlert() {
            let me = this;
            let formData = new FormData();
            formData.append('id', me.estudiante.id);
            formData.append('idtarea', me.estudiante.tarea_idtarea);
            formData.append('nota', me.estudiante.nota);
            formData.append('observacion', me.estudiante.observacion);
            this.$http.post(this.$server_url+"postCalificacion", formData)
                .then(function (response) {
                    localStorage.setItem('respuesta', JSON.stringify(response.data));
                    me.respuestas = JSON.parse(localStorage.getItem('respuesta'));
                    me.activePrompt = false;
                    me.$vs.notify({
                        color: 'success',
                        title: '',
                        text: 'Datos guardados.'
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
        quitar(item) {
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
            let formData = new FormData();
            formData.append('id', item.id);
            formData.append('idtarea', item.tarea_idtarea);
            this.$http.post(this.$server_url+"quitarTareaEntregada", formData)
                .then(function (response) {
                    localStorage.setItem('respuesta', JSON.stringify(response.data));
                    me.respuestas = JSON.parse(localStorage.getItem('respuesta'));
                    me.$vs.notify({
                        color: 'warning',
                        title: '',
                        text: 'Tarea devuelta, el estudiante podrá reenviar la Tarea.'
                    })
                })
                .catch(function (error) {})
        }
    },
}
</script>
