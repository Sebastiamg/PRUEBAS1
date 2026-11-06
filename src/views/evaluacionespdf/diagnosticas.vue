<template>
<div>
    <vs-button @click="popupActive=true" color="primary" type="filled">Agregar</vs-button>
    <vs-popup title="Agregar Evaluación" :active.sync="popupActive">
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Nombre</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" v-model="evaluacion.nombre" />
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Descripción</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" v-model="evaluacion.descripcion" />
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Asignatura</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select :options="asignaturas" :reduce="asignaturas => asignaturas.idasignatura" label="nombreasignatura" v-model="evaluacion.idasignatura"></v-select>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Evaluación</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <input type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-2/3 w-full ml-auto">
                <vs-button class="mr-3 mb-2" @click="guardar()">Guardar</vs-button>
            </div>
        </div>
    </vs-popup>
    <vs-table max-items="5" search pagination :data="evaluaciones">
        <template slot="thead">
            <vs-th sort-key="nombre">Nombre</vs-th>
            <vs-th sort-key="descripcion">Descripción</vs-th>
            <vs-th sort-key="descripcion">Archivo</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="tr.nombre">
                    {{tr.nombre}}
                </vs-td>
                <vs-td :data="tr.descripcion">
                    {{tr.descripcion}}
                </vs-td>
                <vs-td :data="tr.descripcion">
                    <vs-button size="small" icon-pack="feather" icon="icon-file" :href="'http://localhost'+tr.evaluacion['url']" target="_blank" class="mr-2" color="primary"></vs-button>
                </vs-td>
                <vs-td :data="tr">
                    <div class="flex text-center">
                        <vs-button size="small" icon-pack="feather" icon="icon-edit" class="mr-2" color="primary"></vs-button>
                        <vs-button size="small" icon-pack="feather" icon="icon-delete" class="mr-2" color="danger"></vs-button>
                    </div>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.use(axios)
Vue.component("v-select", vSelect);
export default {
    data() {
        return {
            popupActive: false,
            evaluaciones: [],
            evaluacion: [],
            asignaturas: [],
            files: '',
            file: {}
        }
    },
    mounted() {
        this.getEvaluaciones();
        this.getAsignaturas();
    },
    methods: {
        handleFileUpload() {
            this.file = this.$refs.file.files[0];
        },
        successUpload() {
            this.$vs.notify({
                color: 'success',
                title: 'Upload Success',
                text: 'Lorem ipsum dolor sit amet, consectetur'
            })
        },
        getEvaluaciones() {
            let me = this;
            this.$http.get(this.$server_url+"evaluaciones?tipoEvaluacion=1")
                .then(function (response) {
                    me.evaluaciones = response.data;
                    console.log(me.evaluaciones)
                })
                .catch(function (error) {})
        },
        getAsignaturas() {
            let me = this;
            this.$http.get(this.$server_url+'asignatura')
                .then(function (response) {
                    me.asignaturas = response.data;
                    console.log(me.asignaturas);
                })
                .catch(function (error) {})
        },
        guardar() {
            let me = this;
            var usuario = JSON.parse(localStorage.getItem("usuario"));
            let formData = new FormData();
            formData.append('files', me.file);
            this.$http.post(this.$server_url+"upload", formData)
                .then(function (response) {
                    console.log(response.data[0]['id']);
                    this.$http.post(this.$server_url+"evaluaciones", {
                            nombre: me.evaluacion.nombre,
                            descripcion: me.evaluacion.descripcion,
                            idasignatura: me.evaluacion.idasignatura,
                            tipoEvaluacion: 1,
                            creador: usuario.idusuario,
                            evaluacion: response.data[0]['id']
                        })
                        .then(function (response) {
                            me.getEvaluaciones();
                            me.evaluacion=[];
                            me.file=[];
                            me.$refs.file="";
                            me.popupActive = false;
                            me.$vs.notify({
                                color: 'success',
                                title: 'Guardado...',
                            })
                        })
                        .catch(function (error) {})
                })
                .catch(function (error) {})
        }
    },
}
</script>
