<template>
<div>
    <!-- <vs-popup fullscreen title="Publicación" :active.sync="modalPDF"> -->
    <vs-button color="danger" @click="modalPDF=false; volver();" type="relief">Cerrar</vs-button>
    <small> Si el artículo no se carga, debe estar muy pesado, intente nuevamente por favor. </small>
    <iframe v-if="formatoDoc == 0" id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; margin-left: auto; margin-right: auto; padding: 0px; top: 0px;  left: 0px;" v-bind:src="'https://docs.google.com/viewer?url='+documentoUrl+'&embedded=true'"></iframe>

    <div v-else>
        <img :src="documentoUrl" alt="Avatar" style="width:100%">
    </div>

    <!-- </vs-popup> -->
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
            tituloTab: '',
            modalPDF: false,
            documentoUrl: '',
            formatoDoc: 0,
            grupo_admin: '',
            contenido: '',
            articulo: '',
            usuario: '',

        }
    },
    mounted() {
        this.$vs.loading.close()
        this.articulo = JSON.parse(localStorage.getItem('verArticulo'))
        console.log( this.articulo )
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        if (this.articulo.mime == 'application/pdf' || this.articulo.mime == '"application/vnd.openxmlformats-officedocument.wordprocessingml.document"') {
            this.formatoDoc = 0;
        }
        if (this.articulo.mime == 'image/jpeg' || this.articulo.mime == 'image/png' || this.articulo.mime == 'image/gif') {
            this.formatoDoc = 1;
        }
        this.contenido = this.articulo.url
        this.documentoUrl = 'https://foro.prolipadigital.com.ec' + this.contenido;
        this.grupo_admin = this.usuario.id_group
    },
    methods: {
        volver() {
            console.log(this.modalPDF)
            this.$router.go(-1);
        },
    }
}
</script>

<style lang="css">
#t0_iframe {
    display: block;
    /* iframes are inline by default */
    background: #000;
    border: none;
    /* Reset default border */
    height: 100vh;
    /* Viewport-relative units */
    width: 100%;
}
</style>
