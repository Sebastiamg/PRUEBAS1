<template>
<div>
    <v-select class="mb-4" :options="instituciones" label="nombreInstitucion" v-model="institucion" @input="getCursos(institucion.idInstitucion)"></v-select>
    <card :institucion="institucion"></card>
    <div class="vx-row">
        <cardcursos class="w-1/4 mb-8" v-for="(item,$index) in cursos" :key="$index" :curso="item"></cardcursos>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
import card from './card.vue'
import cardcursos from './cursos.vue'
Vue.use(axios)
Vue.component("v-select", vSelect);
export default {
    components: {
        card,
        cardcursos
    },
    data() {
        return {
            usuario: [],
            instituciones: [],
            institucion: {},
            cursos:[]
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        console.log(this.usuario.idusuario)
    },
    mounted() {
        this.getInstituciones();
    },
    methods: {
        getInstituciones() {
            let me = this;
            this.$http.get(this.$server_url+'institucion')
                .then(function (response) {
                    me.instituciones = response.data;
                        // console.log(me.instituciones);
                })
                .catch(function (error) {})
        },
        getCursos(id) {
            let me = this;
            this.$http.get(this.$server_url+'cursosInstitucion/' + id)
                .then(res => {
                    me.cursos=res.data
                })
                .catch(err => {
                    console.error(err);
                })
        }
    },
}
</script>
