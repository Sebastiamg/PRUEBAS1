<template>
<div>
    <div class="vx-row">
        <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-3" v-for="(item,$index) in materials" :key="$index">
            <vx-card class="text-center">
                <div slot="no-body">
                    <img class="responsive card-img-top" v-bind:src="$data_url+'tareas/img/'+item.imagenmaterial" alt="Card image cap">
                </div>
                <div class="mt-4">
                    <p class="font-bold">
                        {{item.nombrematerial}}
                    </p>
                    <small>
                        {{item.descripcionmaterial}}
                    </small>
                </div>
                <div class="mt-4">
                    <div class="w-3/3 mt-2 ml-auto mt-3">
                        <vs-button color="primary" class="w-full" type="border" icon-pack="feather" @click="datomaterial(item.webmaterial)" icon="icon-book">Material Web</vs-button>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            activePrompt: false,
            activePrompt2: false,
            val: '',
            idmaterial: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            materials: [],
            usuario: []
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
        this.getLibros()
    },
    methods: {
        async getLibros() {
            let me = this;
            this.$http.get(this.$server_url+'material?idusuario=' + me.usuario.idusuario)
                .then(function (response) {
                    me.materials = response.data
                })
                .catch(function (error) {})
        },
        datomaterial(url) {
            localStorage.url = url;
            this.$router.push('/docente/material/digital');
        },
    },
}
</script>
