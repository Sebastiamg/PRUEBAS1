<template>
  <vx-card>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Actividad 1</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" icon-pack="feather" icon="icon-layout" icon-no-border v-model="objectDocumento.actividad1" />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Actividad 2</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-layout" icon-no-border  v-model="objectDocumento.actividad2" />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Actividad 3</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" icon-pack="feather" icon="icon-layout" icon-no-border  v-model="objectDocumento.actividad3" />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Actividad 4</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-layout" icon-no-border  v-model="objectDocumento.actividad4" />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Actividad 5</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-layout" icon-no-border  v-model="objectDocumento.actividad5" />
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col sm:w-2/3 w-full ml-auto">
        <vs-button class="mr-3 mb-2" icon="save" @click="guardarActividadesNeet()">Guardar</vs-button>
      </div>
    </div>
  </vx-card>
</template>
<script>
export default{
  data(){
    return{
      usuario:[],
    }
  },
  props:{
    objectDocumento:{
      type:Object,
      default:{}
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  methods:{
    guardarActividadesNeet(){
      let me = this;
      const  valor      = { "guardarActividadesNeet" :"yes" , "user_created" :me.usuario.idusuario }
      const datosEnviar = { ...me.objectDocumento, ...valor }
      me.$vs.loading()
      this.$http.post(this.$server_url+'neetTema', datosEnviar)
      .then(res => {
      me.$vs.loading.close()
      me.$vs.notify({
        text:res.data.message,
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
    }
  }
}
</script>
