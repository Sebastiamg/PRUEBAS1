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
        <vx-card>
            <div slot="no-body" class="full-page-bg-color-black">

                <div class="vx-row  justify-center items-center">

                    <div class="vx-col sm:w-full md:w-full lg:w-1/2">
                        <div class="p-8 login-tabs-container">

                            <div class="vx-card__title mb-4">
                                <img src="@/assets/images/prolipa.png" alt="login" class="img-responsive mx-auto">
                            </div>

                            <div v-if="usuario !== null">
                                <vs-input icon-pack="feather" type="email" icon="icon icon-mail" icon-after placeholder="Correo" vs-placeholder="Correo" v-model="email" class="w-full mt-8" />
                                <span class="text-danger text-sm">{{ errors.message }}</span>
                                <div v-if="respuesta !== ''">
                                    <br>
                                    <vs-alert title="Restaurar" active="true" color="success">
                                        {{respuesta}}<br>
                                    {{mensaje}}
                                    </vs-alert>
                                    <br>
                                </div>
                                <!-- <vs-button class="mt-8 w-full" @click="postLogin()">Enviar</vs-button> -->
                                <vs-button class="mt-8 w-full" @click="verificar()">Enviar</vs-button>
                                <vs-button class="mt-8 w-full" color="warning" to="/">Volver</vs-button> <br>
                                <p><br></p>
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
            errors: [],
            respuesta: '',
            miEmail: '',
            usuario: '',
            mensaje: '',
        }
    },
    mounted() {

    },
    methods: {
        verificar() {
            let me = this;
            me.mensaje = '';
            if (me.email === "") {
                me.$vs.notify({
                    text: 'Ingrese su email',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-triangle'
                })
                return
            }
            if (!me.validEmail(me.email)) {
                me.$vs.notify({
                    text: 'Este correo no es válido',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-triangle'
                })
                return
            }
            me.$vs.loading();
            // console.log(me.email)
            this.$http.get(this.$server_url+'verificarCorreo/' + me.email)
                .then(function (res) {
                    if (res.data.length > 0) {
                        me.mensaje = 'Favor verifique su bandeja de entrada, hemos enviado un código de acceso temporal para restaurar su contraseña.'
                        me.$vs.notify({
                            text: 'Mensaje de restauración de contraseña, enviado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-triangle'
                        })
                        me.postLogin();
                    } else {
                        me.$vs.notify({
                            text: 'Por favor verifique su correo, no hemos logrado encontrarlo.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-triangle'
                        })
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error)
                    me.$vs.notify({
                        text: 'Error de conexión, estamos restableciendo el servicio',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-triangle'
                    })
                    me.$vs.loading.close()
                })
        },
        validEmail: function (email) {
            var re = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
            return re.test(email);
        },
        postLogin() {
            let me = this;
            let formData = new FormData();
            formData.append('email', me.email);
            this.$http.post(this.$server_url+'restaurar', formData)
                .then(function (response) {
                    me.respuesta = response.data
                    console.log(me.respuesta)
                    // localStorage.tk = response.data.tk;
                    // localStorage.setItem('usuario', JSON.stringify(response.data.datos));
                    // me.$router.push('/home');
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
