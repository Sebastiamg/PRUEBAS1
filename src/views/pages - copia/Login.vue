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

    <vs-popup title="Información" :active.sync="popupIrRegistro">
        <div align="center">
            <vs-alert style="font-size: 20px;" active="true" color="warning" class="mb-6">
                Antes de rendir esta evaluación debes iniciar sesión.<br>Si aún no te has registrado, puedes hacerlo en este momento.
            </vs-alert>

            <vs-button type="border" @click="popupIrRegistro=false; $router.push('/registro');" class=" m-2 mb-2">Usuario nuevo</vs-button>

            <vs-button type="border" @click="popupIrRegistro=false; $router.push('/');" class="mb-2 m-2 ">Iniciar sesión</vs-button>
        </div>
    </vs-popup>

    <div class="vx-col sm:w-1/2 md:w-1/2 lg:w-3/4 xl:w-3/5 sm:m-0 m-4">
        <vx-card>
            <div slot="no-body" class="full-page-bg-color-black">

                <div class="vx-row  justify-center items-center">

                    <div class="vx-col sm:w-full md:w-full lg:w-1/2">
                        <div class="p-8 login-tabs-container">

                            <div class="vx-card__title mb-4">
                                <img src="@/assets/images/prolipa.png" alt="login" class="img-responsive mx-auto">
                            </div>

                            <div>
                                <vs-input icon-pack="feather" icon="icon icon-user" icon-after placeholder="Usuario" vs-placeholder="Usuario" v-model="email" class="w-full mt-8" />
                                <vs-input icon-pack="feather" v-on:keyup.enter="postLogin()" type="password" icon="icon icon-lock" icon-after placeholder="Contraseña" vs-placeholder="Contraseña" v-model="password" class="w-full mt-6" />

                                <span class="text-danger text-sm">{{ errors }}</span>
                                <div class="flex flex-wrap justify-between my-5">
                                    <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Recordarme</vs-checkbox>
                                    <router-link to="/restaurar">Olvide mi contraseña?</router-link>
                                </div>
                                <vs-button class="w-full" @click="postLogin()">Iniciar sesión</vs-button>
                                <vs-button type="border" to="/registro" class="w-full mt-6">Registro Estudiantes</vs-button>

                            </div>

                        </div>
                    </div>
                    <div class="vx-col hidden lg:block lg:w-1/2">
                        <img src="@/assets/images/register.jpg" alt="login" class="mx-auto">
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
Vue.use(axios)
export default {
    data() {
        return {
            email: "",
            password: "",
            checkbox_remember_me: false,
            errors: '',
            popupIrRegistro: false
        }
    },
    mounted() {

        if (localStorage.tk != null) {
            this.$router.push('/home');
            console.log(localStorage.tk);
        } else {
            this.linkEvaluacion = localStorage.getItem('evaluacionxLink')

            if (this.linkEvaluacion != '' && this.linkEvaluacion != null) {
                this.popupIrRegistro = true
            }
        }
    },
    methods: {
        postLogin() {
            let me = this;
            let formData = new FormData();
            me.errors = '';
            formData.append('name_usuario', me.email);
            formData.append('password', me.password);
            this.$http.post(this.$server_url+'login', formData)
                .then(function (response) {
                    if (response.data.datos.length > 0) {
                        me.$vs.notify({
                            text: 'Bienvenido!',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        localStorage.tk = response.data.token;
                        localStorage.setItem('usuario', JSON.stringify(response.data.datos));
                        me.$router.push('/home');
                    } else {
                        me.errors = 'Usuario o contraseña no válidos';
                    }
                })
                .catch(function (error) {
                    if (error.response.status == 401) {
                        me.errors = error.response.data;
                        console.log(me.errors.message);
                    }
                })
        }
    },
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
