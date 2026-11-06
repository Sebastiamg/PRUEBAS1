<template lang="html">
  <vx-card>
    <vs-tabs :color="colorx">
      <vs-tab label="Temas" icon-pack="feather" icon="icon-align-justify" @click="getTemas();colorx = '#8B0000';menu = 0;">
        <Nee_temasVue/>
      </vs-tab>
      <vs-tab label="Subir documentos" icon-pack="feather" icon="icon-upload" @click="getTemas();colorx = '#551A8B';menu = 1;">
        <Nee_ScreenSubirVue :arregloTemas="arregloTemas"/>
      </vs-tab>
      <vs-tab label="Asignar documentos" icon-pack="feather" icon="icon-user" @click="getTemas();colorx = '#569B58';menu = 2;">
        <AsignarDocumentosVue v-if="menu == '2'" :arregloTemas="arregloTemas"/>
      </vs-tab>
    </vs-tabs>
  </vx-card>
</template>
<script>
import Nee_temasVue from './Nee_temas.vue';
import Nee_ScreenSubirVue from '@/views/nee_documentos/Nee_ScreenSubir'
import AsignarDocumentosVue from '@/views/nee_documentos/components/AsignarDocumentos'
export default {
  data(){
    return{
      colorx: '#8B0000',
      arregloTemas:[],
      menu:0,
    }
  },
  components:{
    Nee_temasVue,
    Nee_ScreenSubirVue,
    AsignarDocumentosVue,
  },
  mounted() {
    let me = this;
    me.getTemas()
  },
  methods: {
    getTemas(){
      let me = this
      me.$vs.loading()
      this.$http.get(this.$server_url+`neetTema?listadoTemas=yes`).then(res => {
        me.$vs.loading.close()
        me.arregloTemas = res.data;
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error)
        })
    },
  },
}
</script>
</template>
