<!-- =========================================================================================
    File Name: Login.vue
    Description: Login Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
<div class="h-screen flex w-full vx-row no-gutter items-center justify-center" id="page-login">
    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
        <vx-card title="Registro del Estudiante">
            <div slot="no-body" class="full-page-bg-color-black">

                <div class="vx-col sm:w-full md:w-full">
                    <div class="p-8 login-tabs-container">
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Cédula</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input class="w-full" icon-pack="feather" icon="icon-code" icon-no-border v-model="estudiante.cedula" />
                                <span class="text-danger text-sm">{{ errors.cedula }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Nombres</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border v-model="estudiante.nombres" />
                                <span class="text-danger text-sm">{{ errors.nombres }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Apellidos</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border v-model="estudiante.apellidos" />
                                <span class="text-danger text-sm">{{ errors.apellidos }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Correo</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border v-model="estudiante.email" />
                                <span class="text-danger text-sm">{{ errors.email }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Teléfono</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="estudiante.telefono" />
                            </div>
                        </div>
                        <div class="vx-row mb-6">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Contraseña</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input type="password" class="w-full" icon-pack="feather" icon="icon-lock" icon-no-border v-model="estudiante.password" />
                                <span class="text-danger text-sm">{{ errors.password }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Región</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <ul class="demo-alignment">
                                    <li>
                                        <vs-radio @input="getInstitucion()" v-model="idregion" vs-value="2">Costa</vs-radio>
                                    </li>
                                    <li>
                                        <vs-radio @input="getInstitucion()" v-model="idregion" vs-value="1">Sierra</vs-radio>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Ciudad</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <v-select :options="ciudad" @input="getInstitucion()" :reduce="ciudad => ciudad.idciudad" label="nombre" v-model="idciudad"></v-select>
                            </div>
                        </div>
                        <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Institución</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <v-select :options="instituciones" :reduce="instituciones => instituciones.idInstitucion" label="nombreInstitucion" v-model="estudiante.idinstitucion"></v-select>
                                <span class="text-danger text-sm">{{ errors.institucion }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Paralelo</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input class="w-full" v-model="estudiante.paralelo" />
                                <span class="text-danger text-sm">{{ errors.paralelo }}</span>
                            </div>
                        </div>
                        <div class="vx-row mb-6" v-if="registroEvaluacion==false">
                            <div class="vx-col sm:w-1/3 w-full">
                                <span>Grado</span>
                            </div>
                            <div class="vx-col sm:w-2/3 w-full">
                                <vs-input min="0" type="text" class="w-full" v-model="estudiante.grado" />
                                <span class="text-danger text-sm">{{ errors.grado }}</span>
                            </div>
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-2/3 w-full ml-auto">
                                <vs-button class="mr-3 mb-2" @click="guardar(estudiante)">Guardar</vs-button>
                                <vs-button color="danger" type="border" class="mb-2" to="/">Salir</vs-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </vx-card>
    </div>
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
            email: "",
            password: "",
            checkbox_remember_me: false,
            errors: {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                password: '',
                paralelo: '',
                grado: '',
            },
            ciudad: [],
            institucion: [],
            instituciones: [],
            idregion: '',
            idciudad: '',
            estudiante: {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                idinstitucion: '',
                password: '',
                paralelo: '',
                grado: '',
            },
            linkEvaluacion: '',
            vectorLink: '',
            registroEvaluacion: false,
        }
    },
    mounted() {
        this.linkEvaluacion = localStorage.getItem('evaluacionxLink')
        
        if( this.linkEvaluacion != '' && this.linkEvaluacion != null ){
            this.registroEvaluacion = true
            this.vectorLink = (this.linkEvaluacion).split('-')
        }

        this.getCiudadSelect();
        this.getInstitucion();
        if (localStorage.tk != null) {
            this.$router.push('/home');
        } else {}
    },
    methods: {
        guardar(item) {
            let me = this
            let formData = new FormData();
            me.errors = {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                idinstitucion: '',
                password: '',
                paralelo: '',
                grado: '',
            }
            
            let institucionID = item.idinstitucion;
            let paraveloEval = item.paralelo;
            let gradoEval = item.grado;
            if( me.registroEvaluacion === true ){
                institucionID = me.vectorLink[2]
                paraveloEval = '-'
                gradoEval = '-'
            }
            formData.append('cedula', item.cedula)
            formData.append('nombres', item.nombres)
            formData.append('apellidos', item.apellidos)
            formData.append('email', item.email)
            formData.append('name_usuario', item.email)
            formData.append('institucion', institucionID)
            formData.append('password', item.password)
            formData.append('paralelo', paraveloEval)
            formData.append('grado', gradoEval)
            this.$http.post(this.$server_url+"register", formData)
                .then(function (response) {
                    localStorage.tk = response.data.token
                    localStorage.setItem('usuario', JSON.stringify(response.data.datos));
                    me.$router.push('/home');
                })
                .catch(function (error) {
                    if (error.response.status == 422) {
                        try {
                            me.errors.cedula = error.response.data.errors.cedula[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.nombres = error.response.data.errors.nombres[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.apellidos = error.response.data.errors.apellidos[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.email = error.response.data.errors.email[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.institucion = error.response.data.errors.institucion[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.paralelo = error.response.data.errors.paralelo[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.password = error.response.data.errors.password[0]
                        } catch (error) {

                        }
                        try {
                            me.errors.grado = error.response.data.errors.grado[0]
                        } catch (error) {

                        }
                    }
                })
        },
        getInstitucion() {
            let me = this;
            this.$http.get(this.$server_url+'selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) {})
        },
        async getCiudadSelect() {
            let me = this;
            this.$http.get(this.$server_url+"ciudad").then(function (response) {
                me.ciudad = response.data
            });
        },
    }
}
</script>

<style lang="scss">
#page-login {
    .social-login-buttons {
        .bg-facebook {
            background-color: #1551b1
        }

        .bg-twitter {
            background-color: #00aaff
        }

        .bg-google {
            background-color: #4285F4
        }

        .bg-github {
            background-color: #333
        }
    }
}
</style>
