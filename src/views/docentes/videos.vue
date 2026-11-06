<template>
<vx-card title="Videos">
    <div class="text-center" id="video">
        <youtube class="float-center" :video-id="youtube"></youtube>
    </div>
    <vs-table max-items="10" search pagination :data="videos">
        <template slot="thead">
            <vs-th>Videos</vs-th>
            <vs-th>Descripción</vs-th>
            <vs-th>Asignatura</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].nombrevideo">
                    {{data[indextr].nombrevideo}}
                </vs-td>
                <vs-td :data="data[indextr].descripcionvideo">
                    {{data[indextr].descripcionvideo}}
                </vs-td>
                <vs-td :data="data[indextr].nombreasignatura">
                    {{data[indextr].nombreasignatura}}
                </vs-td>
                <vs-td :data="tr">
                    <div class="flex">
                        <vs-button :href="'#video'" class="mr-2" color="primary" @click="verVideo(tr.webvideo)">Ver Video</vs-button>
                    </div>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
</vx-card>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import Datepicker from 'vuejs-datepicker';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import StarRating from 'vue-star-rating'
import {
    getIdFromUrl
} from 'vue-youtube'
import VueYoutube from 'vue-youtube'
Vue.use(VueYoutube)
Vue.use(axios)
export default {
    components: {
        StarRating
    },
    data: function () {
        return {
            videos: [],
            usuario: [],
            search: '',
            youtube: 'DUWPEW63a4c'
        };
    },
    mounted: function mounted() {
        this.getVideos();
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    methods: {
        getVideos() {
            let me = this;
            var url = this.$server_url+"video?idusuario="+me.usuario.idusuario;
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data;
                    me.videos = response.data;
                })
                .catch(function (error) {
                   
                });
        },
        verVideo(url){
            let me = this
            const youtubeId = getIdFromUrl(url)
            me.youtube = youtubeId;
        }
    }
};
</script>
