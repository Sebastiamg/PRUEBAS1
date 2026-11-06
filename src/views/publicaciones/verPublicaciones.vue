<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <!-- <vs-button v-if="grupo_admin > 1" @click="volverDocentes()" color="dark" type="border">Volver</vs-button> &nbsp; -->
        <!-- <vs-button v-if="grupo_admin == 1" style="display: inline" color="dark" size="small" type="border" icon-pack="feather" @click="volver()" icon="icon-arrow-left">Volver</vs-button> -->

        <div class="">
            <vs-tabs alignment="fixed">
                <vs-tab v-bind:label="itarea.nombre" v-for="(itarea, indarea) in areas" :key="indarea">
                    <span v-for="(item,index) in publicaciones" :key="index">
                        <div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/3 xl:w-1/3 mb-2 p-3 enlinea" v-if="item.asignatura.id == itarea.id ">
                            <div class="card m-1" @click="verPublicacion(item)">
                                <span v-if="item.portada == undefined">
                                    <img src="https://foro.prolipadigital.com.ec/uploads/portada_publicaciones_cfefb0594c.jpg" alt="Avatar" style="width:100%">
                                </span>
                                <span v-else>
                                    <img :src="'https://foro.prolipadigital.com.ec'+item.portada.url" alt="Avatar" style="width:100%">
                                </span>
                                <div class="pl-3">
                                    <small style="font-size: 10px"> {{item.updatedAt | fecha }} </small></div>
                                <div class="container descripcion">
                                    <h5> {{item.nombre}} </h5>
                                </div>
                            </div>
                        </div>
                    </span>
                </vs-tab>
            </vs-tabs>
        </div>

    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'

import axios from 'axios'
import vSelect from 'vue-select'
import moment from "moment";
Vue.filter('fecha', function (value) {
    if (value) {
        return moment(String(value)).format('YYYY-MM-DD HH:mm')
    }
});
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            publicaciones: [],
            areas: [{
                'id': 1,
                'nombre': 'Lengua'
            }, {
                'id': 2,
                'nombre': 'Matemática'
            }, {
                'id': 3,
                'nombre': 'Ciencias Naturales'
            }, {
                'id': 4,
                'nombre': 'Ciencias Sociales'
            }, {
                'id': 5,
                'nombre': 'Enseñanza educación'
            }],
            tituloTab: '',
            modalPDF: false,
            documentoUrl: '',
            formatoDoc: 0,
            grupo_admin: '',
            contenido: '',

        }
    },
    mounted() {
        localStorage.removeItem('verArticulo');
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.grupo_admin = this.usuario.id_group
        this.modalPDF = false;
        this.getPublicaciones();
    },
    methods: {
        getPublicaciones() {
            let me = this;
            axios.get('https://foro.prolipadigital.com.ec/publicaciones?estado=true')
                .then(res => {
                    me.publicaciones = res.data;
                    // console.log(me.publicaciones)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        volver() {
            this.$router.go(-1);
        },
        volverDocentes() {
            this.$router.back();
        },
        verPublicacion(item) {
            let me = this;
            if (item.archivo[0].length == 0) {
                me.$vs.notify({
                    text: 'Este archivo no existe',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            window.open('https://docs.google.com/viewer?url=https://foro.prolipadigital.com.ec' + item.archivo[0].url, '_blank')
            // localStorage.setItem('verArticulo', JSON.stringify(item.archivo[0]));
            // me.$vs.loading.close()
            // this.$router.push('/articulo');

            // me.modalPDF = true;
        },

    }
}
</script>

<style lang="css">
.enlinea {
    display: inline-block;
}

.card {
    cursor: zoom-in;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
    transition: 0.3s;
    width: 98%;
    border-radius: 5px;
}

.card:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.5);
}

.card img {
    border-radius: 5px 5px 0 0;
    height: 150px;
}

.descripcion {
    height: 110px;
    overflow: hidden;
    padding: 10px;
}
</style>
