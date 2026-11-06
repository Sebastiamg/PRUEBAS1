<template>
  <div>
    <!-- <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/ne_actividades/'+url+'/?init='+pag_inicio+'&final='+pag_fin"></iframe> -->

      <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="$data_url+'archivos/upload/ne_actividades/'+url"></iframe>
      <vs-button color="danger" @click="salir()" style="margin-top: 50px; margin-right: 8px; float:right" class="mb-3 text-right" >Salir</vs-button>
  </div>
  </template>

  <script>
  export default {
      data() {
        return {
          url: '',
          pag_inicio:1,
          pag_fin:500
        }
      },
      methods: {
        salir(){
          if(this.usuario.id_group == 1){
            this.$router.push('/nee_documentos');
          }
          if(this.usuario.id_group == 4){
            this.$router.push('/estudiante/necesidades-educativas');
          }
          if(this.usuario.id_group == 6){
            this.$router.push('/Home/nee_documentos/');
          }
        }
      },
      mounted() {
        let me = this;
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.url          = localStorage.Exteriorurl
      },
  }
  </script>
