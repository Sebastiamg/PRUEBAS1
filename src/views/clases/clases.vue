<!-- =========================================================================================
    File Name: KnowledgeBaseCategory.vue
    Description: Knowledge Base Category Page
    ----------------------------------------------------------------------------------------
    Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
      Author: Pixinvent
    Author URL: http://www.themeforest.net/user/pixinvent
========================================================================================== -->

<template>
<div id="knowledge-base-category-page">
    <div class="vx-row mt-4 match-height">
        <div class="vx-col w-full sm:w-1/2 md:w-1/4 mb-base" v-for="section in curso" :key="section.id">
            <!-- <vx-card title-color="#fff" content-color="#fff" card-background="linear-gradient(360deg, #2573EA, #86a8e7, #fff)"> -->
            <vx-card class="text-center">
                <h3> <b>{{ section.nombre }} {{ section.seccion }}</b></h3>
                <img src="@/assets/images/pages/graphic-3.png" alt="graphic" width="100" class="mx-auto">
                <h5 class="form-control"><b></b></h5>
                <h5 class="form-control"><b>{{ section.materia }}</b></h5>
                <span class="">Materia</span>
                <h5 class="form-control"><b>{{ section.aula }}</b></h5>
                <span class="">Aula</span>
                <h5 class="form-control"><b>{{ section.codigo }}</b></h5>
                <span class="">Codigo de la clase</span>
                <vs-row class="mt-4">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                        <vs-button type="relief" @click="verClase(section)">Ver Clase</vs-button>
                    </vs-col>
                </vs-row>
            </vx-card>
        </div>
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
            curso:[],
            usuario:[]
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    computed: {},
    methods: {
        getCurso() {
            let me = this;
            this.$http.get(this.$server_url+'curso?idusuario='+me.usuario.idusuario)
                .then(function (response) {
                    me.curso = response.data;
                })
                .catch(function (error) {})
        },
        verClase(section){
            localStorage.codigo = section.codigo;
            this.$router.push('/clase/virtual');
        }
    },
    components: {},
    mounted() {
        this.getCurso();
    }
}
</script>
