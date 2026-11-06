<template>
<div>
<vs-prompt
    @cancel="activePromptEliminar=false;"
    @accept="eliminarJuego()"
    @close="activePromptEliminar=false;"
    :active.sync="activePromptEliminar" color="danger" title="Confirmar">
    <div class="con-exemple-prompt">
    ¿Está seguro de eliminar este juego?
    </div>
</vs-prompt>

<vx-card :title="'Juego: ' + nombre_juego_calif + ' - Curso: ' + nombre_curso_calif" :subtitle="'Tipo: ' + tipo_juego_calif">
    <!-----listado calificaciones--------->
    <div v-if="tipo_juego_calif == 'Rompecabezas' ">
      <b style="color: orange;">La calificación de este tipo de juego se representa como: (cantidad de piezas . cantidad de movimientos)</b>
    </div>
    <vs-table stripe pagination max-items="25" search :data="calificaciones">
        <template slot="header">
            <vs-button color="primary" class="mr-2" type="border" icon-pack="feather" @click="$router.go(-1)" icon="icon-arrow-left"><b>Volver</b></vs-button>

            <vs-button @click="$router.push('/docente/tipos_juegos_docente')" color="dark" type="filled">Zona de diversión</vs-button>
        </template>

       <template slot="thead">
            <vs-th>Estudiante</vs-th>
            <vs-th>Cédula</vs-th>
            <vs-th>Calificaciones</vs-th>
        </template>

        <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
                {{data[indextr].nombres}} {{data[indextr].apellidos}}
            </vs-td>
            <vs-td>
                {{data[indextr].cedula}}
            </vs-td>
            <vs-td :data="item" :key="index" v-for="(item, index) in data[indextr].calificaciones">
                {{item.calificacion}}
            </vs-td>
        </vs-tr>
        </template>
    </vs-table>
    <!------fin listado calificaciones--------->
</vx-card>
</div>
</template>

<script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import Vue from 'vue'
    import axios from 'axios'
    import vSelect from 'vue-select'
    import moment from 'moment'
    import $ from 'jquery'
    export default {
        data(){
            return {
                calificaciones: [],
                usuario: [],
                tabActivo: 1,
                id_juego: '',
                id_tipo_juego: '',
                nombre_tipo_juego: '',
                juegoElimin: [],
                activePromptEliminar: false,
                url_juego: '',
                nombre_juego_calif: '',
                tipo_juego_calif: '',
                nombre_curso_calif: '',
            }
        },
        components: {
                'v-select': vSelect,
                flatPickr,
        },
        created(){
            let me = this
            me.usuario = JSON.parse(localStorage.getItem('usuario'));
            me.id_tipo_juego = localStorage.getItem('id_tipo_juego')
            me.nombre_tipo_juego = localStorage.getItem('nombre_tipo_juego')
        },
        mounted() {
            let me = this
            me.nombre_juego_calif = localStorage.nombre_juego_calif
            me.tipo_juego_calif = localStorage.tipo_juego_calif
            me.nombre_curso_calif = localStorage.nombre_curso_calif
            me.getCalificaciones()
        },
        methods: {
            getCalificaciones(){
                let me = this
                me.$vs.loading()
                const formData = new FormData();
                formData.append('codigo', localStorage.codigo_calif);
                formData.append('id_juego', localStorage.id_curso_calif);
                this.$http.post(this.$server_url+'j_juegos_tipo_curso_doc', formData)
                .then(res => {
                    me.calificaciones = res.data.items;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                    me.$vs.loading.close()
                })
            },
            openConfirmEliminar(){
                let me = this;
                me.activePromptEliminar = true;
            },
        },
    }
</script>

<style>
    .btnwizard{
        width: 65px;
        height: 65px;
        font-size: 22px;
        padding: 0px;
        border-radius: 100%;
        border: 2px solid rgb(29, 90, 182);
        background-color: white;
        color: rgb(29, 90, 182);
        cursor: pointer;
    }
</style>
