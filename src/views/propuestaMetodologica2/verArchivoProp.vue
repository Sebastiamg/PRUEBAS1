<template>
<div>
    <!-- <vs-popup fullscreen title="Publicación" :active.sync="modalPDF"> -->

    <vs-button color="danger" @click="modalPDF=false; volver();" style="float: right; margin-top:-15px; " type="relief">Cerrar</vs-button>
    <small> Si el archivo no se visualiza, es posible que sea muy pesado, favor regrese a la pantalla anterior, y proceda con la descarga</small>
    <iframe v-if="formatoDoc == 0" id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; margin-left: auto; margin-right: auto; padding: 0px; top: 0px;  left: 0px;" v-bind:src="'https://view.officeapps.live.com/op/embed.aspx?src='+documentoUrl+'&embedded=true'"></iframe>

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
            previo: '',

        }
    },
    mounted() {
        this.$vs.loading.close()
        this.articulo = JSON.parse(localStorage.getItem('verArticulo'))
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.formatoDoc = 0;
        this.contenido = this.articulo.url
        this.documentoUrl = 'https://foro.prolipadigital.com.ec' + this.contenido;
        if (this.previo) {
            this.documentoUrl = this.previo;
        }
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
