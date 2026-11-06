<template>
  <vx-card
  :title="title"
  title-color="primary"
  subtitle="Seleccione para generar códigos de activacion, diágnostica"
  >
    <div v-if="permisoRoot || usuario.id_group == 28">
      <vs-divider></vs-divider>
      <!--MENU-->
      <div>
        <div v-if="menu == 0"><GenerarCodigosGrafitexVue/></div>
      </div>
    </div>
    <div v-else>
      <vs-alert color="danger"><p class="text-center">No tienes permisos para ver esta vista</p></vs-alert>
    </div>
    <br><br><br><br><br><br><br><br><br><br>
  </vx-card>
</template>
<script>
import  GenerarCodigosGrafitexVue from '@/views/codigos/grafitex/components/GenerarCodigosGrafitex'
export default{
  data(){
    return{
      menu:0,
      title:'Generar Códigos Grafitex',
      permisoRoot:false,
      usuario:[],
    }
  },
  components:{
    GenerarCodigosGrafitexVue,
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this;
    me.getUserRoot()
  },
  methods:{
    getUserRoot() {
      let me = this;
      this.$http.get(this.$server_url+'permisos?permiso=yes&usuario_id='+me.usuario.idusuario)
        .then(function (res) {
          if(res.data.status == '1'){
              me.permisoRoot = true
          }else{
              me.permisoRoot = false
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
      },
  }
}
</script>
<style lang="scss" scoped>
@import '@/assets/scss/general/general.scss';
    .btna{
        font-size: 14px!important;
        @include button-1;
        background-color:var(--colorazul);
    }
    .btna:hover{
        opacity: 0.7;
    }
</style>
