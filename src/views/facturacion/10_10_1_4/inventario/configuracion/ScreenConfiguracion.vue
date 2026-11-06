<template>
  <div>
    <vx-card title="Configuración General" v-if="userRoot">
      <div v-if="menu == 0">
        <ConfiguracionListadoVue @showCreate="showCreate" :arrayConfiguration="arrayConfiguration"/>
      </div>
      <div v-if="menu != 0">
        <vs-button color="primary" type="filled" @click="menu = 0;">◄ Regresar</vs-button>
      </div>
      <div v-if="menu == 1">
        <ConfiguracionCrearVue  @showCreate="showCreate" :usuario="usuario" :id="id" :ObjectSelect="ObjectSelect" />
      </div>
    </vx-card>
  </div>
</template>
<script>
  import {
      mapState
  } from "vuex";
const ConfiguracionListadoVue = () => import('./ConfiguracionListado.vue')
const ConfiguracionCrearVue   = () => import('./ConfiguracionCrear.vue')
export default {
  components:{
    ConfiguracionListadoVue,
    ConfiguracionCrearVue
  },
  data() {
    return{
      id:0,
      menu:0,
      arrayConfiguration:[],
      usuario:[],
      ObjectSelect:'',
    }
  },
  computed:{
    ...mapState(["auth",'userRoot','susuario']),
  },
  mounted(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
    if(me.userRoot) { me.getConfiguracion(); }
  },
  methods:{
    getConfiguracion() {
      let me = this;
      this.$http.get(this.$server_url+'inventario/configuracion')
        .then(function (res) {
          me.arrayConfiguration = res.data
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
      if(values.id)       { me.id = values.id; }
      me.getConfiguracion()
    },
  }
}
</script>
