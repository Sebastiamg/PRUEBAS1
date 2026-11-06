<template>
<div>
    <vx-card :title="title">
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Grado</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" v-model="nombre" />
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Área</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" v-model="seccion" />
            </div>
        </div>
        <div v-if="usuario.id_group == 16">

        </div>
        <div class="vx-row mb-6" v-else>
            <div class="vx-col sm:w-1/3 w-full">
                <span>Asignatura</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vx-input-group>
                    <v-select class="w-full" v-model="asignaturaSelected" :options="asignaturas" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                    <template slot="append">
                        <div class="append-text btn-addon">
                        <vs-button color="primary" @click="otraActivo=true">Otra</vs-button>
                        </div>
                    </template>
                </vx-input-group>
            </div>
        </div>

        <div class="p-2 mb-2 mt-4" v-if="otraActivo===true" align="justify" style="background-color: #FFC8D4; color: #D50430; border-radius: 5px;">
            <span>
                Antes de crear otra asignatura, verifique nuevamente en el listado asignaturas que se encuentra en la parte superior.<br>
                Las asignaturas de naturales, sociales, lengua, matemática, computación y eca que ya pertenecen a prolipa, serán eliminadas por un administrador.
            </span>
        </div>
        <span v-if="otraActivo===true">Para mayor información escribanos a soporte@prolipa.com.ec</span>

        <div class="vx-row mb-6" v-if="otraActivo===true">
            <div class="vx-col sm:w-2/3 w-full ml-auto">
                Especifique: <br>

                <vx-input-group>
                    <vs-input v-model="nombre_otra_asignatura" class="w-full"></vs-input>

                    <template slot="append">
                        <div class="append-text btn-addon">
                        <vs-button color="dark" @click="crearOtraAsignatura()">Guardar</vs-button>
                        </div>
                    </template>
                </vx-input-group>
            </div>
        </div>

        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Paralelo</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" v-model="aula" />
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-2/3 w-full ml-auto">
              <vs-button class="mr-3 mb-2" @click="enviar">Enviar</vs-button>
              <vs-button  v-if="desdeModal == 1" color="danger" type="border" @click="$emit('changeReturn',0)" class="mb-2">Cancelar</vs-button>
              <vs-button v-else color="danger" type="border" @click="$router.go(-1)" class="mb-2">Cancelar</vs-button>
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
    data() {
        return {
            nombre: '',
            seccion: '',
            materia: '',
            aula: '',
            usuario:[],
            idcurso:'',
            title:'',
            asignaturas: [],
            asignaturaSelected: {},
            otraActivo: false,
            nombre_otra_asignatura: '',
        }
    },
    created() {
        let me = this;
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if(localStorage.idcurso == ''){
            this.title = "Agregar nuevo curso"
        }else{
            this.title = "Editar Curso"
            this.$http.get(this.$server_url+'curso/' + localStorage.idcurso )
                .then(function (response) {
                    console.log(response.data);
                    me.idcurso = response.data.idcurso
                    me.nombre = response.data.nombre
                    me.seccion = response.data.seccion
                    me.materia = response.data.materia
                    me.asignaturaSelected = {id: localStorage.idasignatura, label: localStorage.nombreasignatura}
                    me.aula = response.data.aula
                })
                .catch(function (error) {})
        }
        if(me.desdeModal == 1){  me.asignaturaSelected = {id: localStorage.idasignatura, label: localStorage.nombreasignatura} }
    },
    mounted() {
        this.getAsignaturas()
    },
    components: {
        'v-select': vSelect
    },
    props:{
      desdeModal:{
        type:Number,
        default:0
      },
    },
    methods: {
        getAsignaturas(){
            let me = this
            this.$http.get(this.$server_url+'asignaturasDoc/'+me.usuario.idusuario).then(res => {
                me.asignaturas = res.data;
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        enviar() {
            let me = this;
            let formData = new FormData();
            formData.append("idusuario", me.usuario.idusuario);
            formData.append("idcurso", me.idcurso);
            formData.append("nombre", me.nombre);
            formData.append("seccion", me.seccion);
            formData.append("materia", '---');
            formData.append("aula", me.aula);
            if(me.usuario.id_group == 16){
                formData.append('id_asignatura',localStorage.idasignatura)
            }else{
                formData.append("id_asignatura", me.asignaturaSelected.id);
            }
            this.$http.post(this.$server_url+'curso',formData)
                .then(function (response) {
                    if(me.desdeModal == 1){
                      me.$vs.notify({
                      text:'Curso creado con éxito',
                      color:'success',
                      iconPack: 'feather',
                      icon:'icon-check'})
                      me.$emit('changeReturn',1)
                    }else{
                      me.$router.go(-1);
                    }
                })
                .catch(function (error) {})
        },
        crearOtraAsignatura(){
            let me = this
            let formData = new FormData();

            formData.append('otraAsignatura',"yes");
            formData.append('nombreasignatura', me.nombre_otra_asignatura);
            formData.append('area_idarea', 83);
            formData.append('nivel_idnivel', 30);
            formData.append('tipo_asignatura', 0);
            me.$vs.loading()
            this.$http.post(this.$server_url+'asignatura', formData)
            .then(function (res) {
                me.getAsignaturas()
                me.asignaturaSelected.id = res.data.idasignatura
                me.asignaturaSelected.label = res.data.nombreasignatura
                me.asignaturaDocente(res.data.idasignatura)
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        asignaturaDocente(id_asignatura){
            let me = this
            let formData = new FormData();
            formData.append('usuario_idusuario', me.usuario.idusuario);
            formData.append('asignatura_idasignatura', id_asignatura);

            me.$vs.loading()
            this.$http.post(this.$server_url+'guardar_asignatura_usuario', formData)
            .then(function (res) {
                me.nombre_otra_asignatura = ''
                me.otraActivo = false
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    },
}
</script>
