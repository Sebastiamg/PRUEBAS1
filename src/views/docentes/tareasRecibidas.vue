<template>
<vx-card title="Tareas Entregadas">
    <div class="demo-alignment">
        <!-- <vs-prompt title="Ingresar Calificación" @cancel="val=''" @accept="acceptAlert" @close="close" :active.sync="activePrompt"> -->
        <vs-popup fullscreen title="fullscreen" :active.sync="activePrompt">
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <b>Correos</b>
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
                    <a :href="$data_url+'tareas/'+estudiante.url" target="_blank">
                        {{estudiante.url}}
                    </a>
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <b>Fecha de Entregas</b>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    {{estudiante.fecha}}
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
        </vs-popup>
    </div>
    <vs-table max-items="10" search pagination :data="respuestas">
        <template slot="thead">
            <vs-th>Nombres</vs-th>
            <vs-th>Archivo Entregado</vs-th>
            <vs-th>Fecha de Entrega</vs-th>
            <vs-th>Nota</vs-th>
            <vs-th>Calificsdfsdfar</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].nombres">
                    {{data[indextr].nombres}} {{data[indextr].apellidos}}
                </vs-td>
                <vs-td :data="data[indextr].url">
                    <a :href="$data_url+'tareas/'+data[indextr].url" target="_blank">{{data[indextr].url}}</a>
                </vs-td>
                <vs-td :data="data[indextr].fecha">
                    {{data[indextr].fecha}}
                </vs-td>
                <vs-td :data="data[indextr].nota">
                    {{data[indextr].nota}}
                </vs-td>
                <vs-td :data="tr">
                    <div class="flex">
                        <vs-button type="border" class="mr-2" color="success" @click="calificar(tr)">Calificsdfsdfar</vs-button>
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
    }),
    mounted() {
        this.respuestas = JSON.parse(localStorage.getItem('respuesta'));
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
    },
}
</script>
