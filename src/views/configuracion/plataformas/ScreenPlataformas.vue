<template>
  <vx-card title="Generación Plataformas">
    <div v-if="menu == 0">
      <PlataformaListadoVue @showCreate="showCreate" :arrayPlataformas="arrayPlataformas"/>
    </div>
    <div v-if="menu != 0">
      <vs-button color="primary" type="filled" @click="menu = 0;">◄ Regresar</vs-button>
    </div>
    <div v-if="menu == 1">
      <PlataformaCrearVue  @showCreate="showCreate" :usuario="usuario" :id="id" :ObjectSelect="ObjectSelect" />
    </div>
  </vx-card>
</template>
<script>
import axios from 'axios'
const PlataformaListadoVue = () => import('./PlataformaListado.vue')
const PlataformaCrearVue   = () => import('./PlataformaCrear.vue')
export default {
  components:{
    PlataformaListadoVue,
    PlataformaCrearVue,
  },
  data() {
    return{
      usuario:[],
      id:0,
      menu:0,
      ObjectSelect:'',
      arrayPlataformas:[],
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
    me.getPlattforms()
  },
  methods:{
    getPlattforms(){
      let me = this;
      this.$http.get(this.$server_url+'plataformas/plataformas')
      .then(function (res) {
        me.arrayPlataformas = res.data
      })
      .catch(function (error) {
        console.log(error + ' error');
      })
    },
    showCreate(e,values=''){
      let me              = this
      me.id               = 0;
      me.menu             = e
      me.ObjectSelect     = values
      if(values.id)       { me.id = values.id }
      me.getPlattforms()
    },
  }
}
</script>
