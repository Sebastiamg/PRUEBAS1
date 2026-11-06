<template>
  <div>
    <template>
      <div>
        <!--MENU-->
        <ul class="flex">
          <li>
            <vs-radio v-model="filtro" @input="filtroTipo()" class="mr-2" vs-name="radios1tipo" vs-value="0"><b>{{ sumaPendientes }}</b> Pendientes</vs-radio>
          </li>
          <li>
            <vs-radio v-model="filtro" @input="filtroTipo()" class="mr-2" vs-name="radios1tipo" vs-value="1"><b>{{ SumaAnulados }}</b> Anulados</vs-radio>
          </li>
          <li>
            <vs-radio v-model="filtro" @input="filtroTipo()" vs-name="radios1tipo" vs-value="2"><b>{{ sumaContratos }}</b> Contratos</vs-radio>
          </li>
        </ul>
        <!--FIN MENU-->
        <listadoContratosProlipaVue :tmpArregloPedidos="tmpArregloPedidos" :id_periodo="id_periodo" @ChangeRecarge="getPedidos"/>
      </div>
    </template>
  </div>
</template>
<script>
import listadoContratosProlipaVue from '@/views/pedidos/asesor/contratos/listadoContratosProlipa'
export default{
  components:{
    listadoContratosProlipaVue,
  },
  data(){
    return{
      usuario:[],
      userAsesor:0,
      arregloPedidos:[],
      tmpArregloPedidos:[],
      filtro:0,
    }
  },
  props:{
    id_periodo:{
      type:Number,
      default:0,
    },
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
    me.userAsesor = me.usuario.idusuario
  },
  mounted(){
    let me = this;
    me.getPedidos()
  },
  computed:{
    sumaPendientes(){
      let me = this;
      let datos       = me.arregloPedidos.filter(p => (p.estado == '0' || p.estado == '1') && (p.contrato_generado == null || p.contrato_generado == "") )
      let resultado   = datos.length
      return resultado
    },
    SumaAnulados(){
      let me = this
      let datos       = me.arregloPedidos.filter( p => p.estado == 2 );
      let resultado   = datos.length
      return resultado
    },
    sumaContratos(){
      let me = this
      let datos       = me.arregloPedidos.filter( p => p.estado == 1 && p.contrato_generado != null );
      let resultado   = datos.length
      return resultado
    },
  },
  methods:{
    filtroTipo(){
      let me = this;
      //para ver los pedidos pendientes
      if(me.filtro == 0){
        let datos             = me.arregloPedidos.filter(p => (p.estado == '0' || p.estado == '1') && (p.contrato_generado == null || p.contrato_generado == "") )
        me.tmpArregloPedidos  = datos
        return
      }
      //para ver los anulados
      if(me.filtro == 1){
        let datos             = me.arregloPedidos.filter( p => p.estado == 2 );
        me.tmpArregloPedidos  = datos
        return
      }
      //para ver los contratos
      if(me.filtro == 2){
        let datos             = me.arregloPedidos.filter( p => p.estado == 1 && p.contrato_generado != null );
        me.tmpArregloPedidos  = datos
        return
      }
    },
    getPedidos(){
      let me = this;
      me.arregloPedidos = []
      me.$vs.loading()
      var sendUsuario = ""
      if(me.userAsesor == 68750){
          sendUsuario = "26087"
      }else{
          sendUsuario = me.userAsesor
      }
      var url = this.$server_url+`getPedidosXAsesorXPeriodo?periodo_id=${ me.id_periodo }&idusuario=${ sendUsuario}`
      me.$vs.loading()
      this.$http.get(url)
        .then(function (res) {
          me.$vs.loading.close()
          me.arregloPedidos = res.data
          me.filtroTipo()
        })
        .catch(function (error) {
            me.$vs.loading.close()
            console.log(error + ' error');
        })
    },

  }
}
</script>
