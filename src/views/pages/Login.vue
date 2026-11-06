<template>
<div class="h-screen flex w-full" id="page-login">
    <div class="w-full sm:m-0 m-4">
        <vx-card>
            <div slot="no-body" class="full-page-bg-color">
                <div class="vx-row">
                    <div class="hidden h-screen lg:block lg:w-2/3 h-full flex items-center">
                        <div class="app m-auto px-8 self-center h-full flex items-center">
                            <div class="">
                                <carousel>
                                    <carousel-slide v-for="slide in slideres" :key="slide" class="carousel-slider">
                                        <img :src="slide" :alt="slide">
                                    </carousel-slide>
                                </carousel>
                            </div>
                        </div>
                    </div>
                    <div class="sm:w-full h-screen md:w-full lg:w-1/3 d-theme-dark-bg">
                        <div class="h-full flex item-center">
                            <div class="px-8 m-auto">
                                <div class="text-center flex justify-center mb-16 lg:mb-20 md:mb-20 sm:mb-6">
                                    <img src="@/assets/images/prolipa.png" alt="login" class="md:w-2/5 lg:w-3/4 sm:w-2/5 w-3/4 text-center">
                                </div>
                                <div class="vx-card__title lg:mt-4 md:mt-4">
                                    <h4 class="title font-bold text-2xl text-center">Bienvenidos</h4>
                                </div>
                                <div>
                                    <vs-input icon-pack="feather" icon="icon icon-user" icon-after label="Usuario" v-model="user.email" class="sm:w-full lg:w-full mx-auto mt-6" />
                                    <vs-input icon-pack="feather" v-on:keyup.enter="login()" type="password" icon="icon icon-lock" icon-after label="Contraseña" v-model="user.password" class="sm:w-full lg:w-full mx-auto mt-6" />

                                    <div class="text-danger p-1 text-sm text-center mx-auto justify-center">{{ errors }}</div>
                                    <div class="text-right p-3">
                                        <!-- <vs-checkbox v-model="checkbox_remember_me" class="mb-3">Recordarme</vs-checkbox> -->
                                        <router-link to="/restaurar">Olvidé mi contraseña</router-link>
                                    </div>
                                    <div class="flex flex-wrap justify-between">
                                        <vs-button class="w-full mx-auto" type="relief" size="medium" color="success" @click="login()">Iniciar sesión</vs-button>

                                        <!-- <vs-button class="w-2/3 mx-auto" type="relief" size="medium" color="success" @click="getHome()">verificar</vs-button> -->
                                    </div>

                                    <div class="flex flex-wrap justify-between boton1">
                                        <vs-button type="border" to="/registro" size="medium" class="w-full mt-6 mx-auto">Registro estudiantes</vs-button>
                                    </div>

                                    <div class="flex flex-wrap" v-if="preguntasFaq.length > 0" style="justify-content:center;">
                                        <vs-button type="border" color="warning" @click="popupPreguntasFaq=true" size="medium" class="w-full mt-6 mx-auto">Preguntas frecuentes?</vs-button>

                                    </div>

                                    <div class="flex flex-wrap justify-between boton1">
                                        <vs-button type="border" color="danger" @click="irWebinar()" target="_blank" size="medium" class="w-full mt-6 mx-auto">Webinars</vs-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </vx-card>
    </div>
    <!--Modales-->
    <!--Modal de Preguntas Frecuentes-->
    <div class="centerx">

        <vs-popup
        fullscreen
         title="Preguntas Frecuentes" :active.sync="popupPreguntasFaq">
        <div>

            <vs-collapse accordion >
                <vs-collapse-item :key="indextr" v-for="(item, indextr) in preguntasFaq">

                    <div slot="header" style="color:#4EA6EA;font-weight:bold;font-size:25px;">

                        {{ item.pregunta }}
                    </div>

                    <p v-text="item.descripcion">

                    </p>
                    <br/>
                     <!-- <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 500px;" v-bind:src="item.video"></iframe> -->
                    <div>
                         <video-embed :src="item.video"></video-embed>
                    </div>

                    <br>
                    <div v-if="item.url == null">

                    </div>
                    <div v-else>
                        <img width="700" :src="$server_url+'preguntas_frecuentes/'+item.url"/>
                    </div>

                    <br><br>

                </vs-collapse-item>

            </vs-collapse>
        </div>

        </vs-popup>
    </div>
</div>
</template>

<script>
import {
    mapState
} from 'vuex'
import Vue from 'vue'
import Embed from 'v-video-embed'
// global register
Vue.use(Embed);
import Carousel from './components/carousel/Carousel.vue';
import CarouselSlide from './components/carousel/CarouselSlide';
export default {
    data() {
        return {
            colorx: "#4E9AE1",
            popupPreguntasFaq: false,
            slideres: [
                './login/s1.jpg',
                './login/s2.jpg',
                './login/s3.jpg',
                './login/s4.jpg',
                './login/s5.jpg',
                './login/s6.jpg',

            ],
            user: {
                email: '',
                password: '',
            },
            checkbox_remember_me: false,
            popupIrRegistro: false,
            slides: 's1.jpg',
            inc: 1,
            rdn: 1,
            x: true,
            repeticiones: 30,
            anterior: '',
            cadena: '',
            preguntasFaq: []
        }
    },
    components: {
        Carousel: Carousel,
        CarouselSlide: CarouselSlide,
    },
    computed: {
        ...mapState(['usuario']),
        ...mapState(['auth']),
        ...mapState(['errors'])
    },
    mounted() {
        this.getUsuario();
        this.slides = 's' + Math.ceil(Math.random() * 6) + '.jpg';
        this.getSlides();
        this.preguntasfaq();
    },
    methods: {
        irWebinar() {
            let route = this.$router.resolve({
                path: '/webinar/presentacion'
            });

            window.open(route.href, '_blank');
        },
        //traer las preguntas frecuentes
        async preguntasfaq() {
            let me = this;
            await this.$http.get(this.$server_url + "preguntasfaq")
                .then(function (response) {
                    me.preguntasFaq = response.data
                })
                .catch(function (error) {
                    console.log(error)
                });

        },
        async getUsuario() {
            await this.$store.dispatch('getUsuario', this.user);
            if (this.$store.state.auth == true) {
                return await this.$router.push('/home');
            } else {

            }
        },
        async login() {

            let me = this;

            await this.$store.dispatch('login', this.user);

            if (localStorage.getItem("bloqueoUser") == "yes") {
                this.$store.dispatch('logout')
                // alert("bloqueado")
                me.$vs.notify({
                    text: 'Su usuario se encuentra bloqueado, por favor envíe un correo a soporte@prolipa.com.ec, para reestablecer su acceso',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 8000
                })
                return await this.$router.push('/');

            } else {

                return await this.$router.push('/home');
            }

            //

        },
        getSlides() {
            let me = this;
            // console.log('slides')
            me.inc++;
            me.rdn = Math.ceil(Math.random() * 6);
            me.slides = 's' + me.rdn + '.jpg';

        },
    },
}
</script>

<style lang="scss">
.title {
    font-family: 'Montserrat';
    font-style: normal;
    color: #0E369E;
}

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

/*Estilos del slider*/
.app {
    display: flex;
    justify-content: center;
}

.carousel {
    position: relative;
    overflow: hidden;
    width: 800px;
    height: 500px;
    z-index: 10;
}

.btn {
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.5);
    border: 1px solid transparent;
    margin: 5px 10px;
    color: #FFF;
    height: 50px;
    width: 50px;
    position: absolute;
    margin-top: -25px;
    z-index: 2;
}

.btn:hover {
    cursor: pointer;
}

.btn:focus {
    outline: none;
}

.btn-next {
    top: 50%;
    right: 0;
}

.btn-prev {
    top: 50%;
    left: 0;
}

.carousel-slider {
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
}

.carousel-slider img {
    width: 100%;
    height: 100%;
}

.embed-responsive-item {
    width: 60% !important;
    margin: auto;
    height: 450px;
}
</style>
