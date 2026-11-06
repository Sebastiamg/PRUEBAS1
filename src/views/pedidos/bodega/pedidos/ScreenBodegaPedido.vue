<template>
  <vx-card
  title="Listado de Pedidos"
  title-color="primary"
  >
    <!--VER PEDIDOS-->
    <div class="mt-3">
      <listado_pedidosVue :periodoSelect="periodoSelect" :pedidos="pedidos" @changeRecarge="changeHandleRecarga"/>
    </div>
  </vx-card>
</template>
<script>
import vSelect from 'vue-select'
import listado_pedidosVue from '../../listado_pedidos2.vue';
export default{
  components:{
    vSelect,
    listado_pedidosVue,
  },
  data(){
    return{
      usuario:[],
      periodoSelect:'',
      userRoot:false,
      pedidos:[],
    }
  },
  created(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this;
    me.getPedidos()
    me.getUserRoot(me.usuario);
  },
  methods:{
    getUserRoot(dato) {
      let me = this;
      this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
        .then((result) => {
          if (result.data.length > 0) {
            me.userRoot = true;
          }
        })
        .catch((err) => {
            console.log(err)
        })
    },
    changeHandleRecarga(e){
      let me = this;
      me.getPedidos()
    },
    getPedidos(){
      let me        = this
      var ruta      = ""
      me.pedidos    = []
      ruta = this.$server_url+'getAllPedidos'
      me.$vs.loading();
      this.$http.get(ruta)
      .then(res => {
        me.$vs.loading.close();
        let datos = res.data.filter(p => p.facturacion_vee == 1)
        me.pedidos    = datos
      })
    },
  }
}
</script>
