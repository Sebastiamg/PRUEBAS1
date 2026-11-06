<template>
  <div>
    <div class="flex mt-5">
      <div style="width: 40%;">
        <p> <ion-icon name="contract-outline"></ion-icon>  Filtro de pedidos por período</p>
      </div>
      <div style="width: 60%;">
        <!-- idperiodoescolar -->
        <v-select :options="arregloPeriodos" @input="limpiarCache();getPedidos()" :reduce="arregloPeriodos => arregloPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelect" />
          <br>
      </div>
    </div>
    <vs-divider>
      <vs-button color="warning" v-if="changePeriodo == false" type="flat" icon="star">Ningun período Seleccionado</vs-button>
      <vs-button  v-else color="success" type="flat" icon="star">Periodo seleccionado: <b>{{ periodoSelect.periodoescolar }}</b></vs-button>
    </vs-divider>
    <!-- BOTON GENERAR FORMATO-->
    <div class="mt-2"  v-if="changePeriodo">
      <vs-button v-if="usuario.id_group == 23 || userRoot == true" type="gradient"><ion-icon name="grid-outline"></ion-icon> <span class="ml-2" @click="verFormato();">Generar formato</span> </vs-button>
    </div>
    <!--VER PEDIDOS-->
    <div v-if="changePeriodo" class="mt-3">
      <listado_pedidosVue :periodoSelect="periodoSelect" :pedidos="pedidos" @changeRecarge="changeHandleRecarga"/>
    </div>
    <!--MODAL FORMATO PEDIDOS PRECIOS-->
    <vs-popup fullscreen :title="'Formato de libros del período ' +enviarPeriodo.periodoescolar" :active.sync="popupFormato">
      <vs-button  class="ml-2" color="success" v-if="userRoot == true" type="gradient"><ion-icon style="font-size:15px;" name="code-download-outline"></ion-icon> <span class="ml-2" @click="popupFormato = false;popupCargarFormato = true;">Cargar formato</span> </vs-button>
      <FormatoPedidosVue v-if="popupFormato" :enviarPeriodo="enviarPeriodo" :arregloSeries="arregloSeries"/>
    </vs-popup>
    <!--CARGAR FORMATO ANTERIOR PARA LLENAR EN EL PERIODO NUEVO-->
    <vs-popup :title="'Cargar formato para el período '" :active.sync="popupCargarFormato">
      <CargarFormatoVue v-if="popupCargarFormato" :periodoSelect="periodoSelect" @rechargeFormato="rechargeFormato"/>
    </vs-popup>
  </div>
</template>
<script>
import vSelect from 'vue-select'
const FormatoPedidosVue  = () => import('./components/formato/FormatoPedidos.vue')
const CargarFormatoVue   = () => import('@/views/pedidos/components/formato/CargarFormato')
import listado_pedidosVue from './listado_pedidos2.vue';
import Codigosmix from "@/mixins/Codigosmix";
export default{
  components:{
    vSelect,
    listado_pedidosVue,
    FormatoPedidosVue,
    CargarFormatoVue,
  },
  mixins: [Codigosmix],
  data(){
    return{
      usuario:[],
      arregloPeriodos:[],
      periodoSelect:'',
      changePeriodo:false,
      popupFormato:false,
      enviarPeriodo:'',
      //variables formato
      arregloSeries:[],
      //fin variables formato
      userRoot:false,
      popupCargarFormato:false,
      pedidos:[],
    }
  },
  watch:{
    periodoSelect(results){
      let me = this;
      if(results == null || results == null || results == undefined){
        me.changePeriodo = false
        localStorage.removeItem('pid')
        localStorage.removeItem('pnombre')
      }else{
        me.changePeriodo = true
        localStorage.setItem('pid',    results.idperiodoescolar)
        localStorage.setItem('pnombre',results.periodoescolar)
        me.getPedidos()
      }
    }
  },
  created(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this;
    me.getPeriodos()
    me.getSeries()
    me.getUserRoot(me.usuario);
    let searchPeriodoActive = localStorage.pid
    let searchPeriodoName   = localStorage.pnombre
    if(searchPeriodoActive){
      me.periodoSelect = { idperiodoescolar:searchPeriodoActive, periodoescolar:searchPeriodoName }
    }
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
    getPeriodos(){
      let me = this
      me.$vs.loading();
      this.$http.get(this.$server_url+'get_periodos_pedidos')
      .then(res => {
        me.$vs.loading.close();
        let datos = res.data
        if(datos.length == 0){
          localStorage.removeItem('pid')
          localStorage.removeItem('pnombre')
          me.arregloPeriodos = []
          return
        }
        if( me.usuario.id_group == 22 || me.usuario.id_group == 23 || me.usuario.id_group == 1 ){
          me.arregloPeriodos = datos.filter(p => p.pedido_facturacion == 1)
        }
        if( me.usuario.id_group == 17 || me.usuario.id_group == 27 ){
          me.arregloPeriodos = datos.filter(p => p.pedido_bodega == 1)
        }
        if( me.usuario.id_group == 11 || me.usuario.id_group == 11 ){
          me.arregloPeriodos = datos.filter(p => p.pedido_asesor == 1)
        }
        if(me.arregloPeriodos.length == 0){
          localStorage.removeItem('pid')
          localStorage.removeItem('pnombre')
        }
      })
      .catch(function (error) {
        me.$vs.loading.close();
      })
    },
    changeHandleRecarga(e){
      let me = this;
      me.limpiarCache()
      me.getPedidos()
    },
    getPedidos(){
      let me        = this
      var ruta      = ""
      me.pedidos    = []
      if(me.usuario.id_group == 22) ruta = this.$server_url+'get_pedidos_periodo_facturador/'+me.periodoSelect.idperiodoescolar+'/'+me.usuario.idusuario
      else ruta = this.$server_url+'get_pedidos_periodo/'+me.periodoSelect.idperiodoescolar
      me.$vs.loading();
      this.$http.get(ruta)
      .then(res => {
        me.$vs.loading.close();
        let datos = res.data.filter(p => p.facturacion_vee == 1)
        if(me.usuario.id_group == 22){
          me.pedidos    = datos.filter(p =>  ( (p.ifagregado_anticipo_aprobado == 1 || p.ifagregado_anticipo_aprobado == 3 ) || (p.anticipo == 0 || p.anticipo == '' || p.anticipo == null)) )
          // me.tmpPedidos = datos.filter(p =>  ( (p.ifagregado_anticipo_aprobado == 1 || p.ifagregado_anticipo_aprobado == 3 ) || (p.anticipo == 0 || p.anticipo == '' || p.anticipo == null)) )
          return
        }
        if(me.usuario.id_group == 1){
          me.pedidos    = res.data
          // me.tmpPedidos = res.data
        }
        else{
          me.pedidos    = datos
        }
      })
    },
    getSeries(){
      let me = this
      me.arregloSeries = []
      this.$http.get(this.$server_url+'series_full')
      .then(res => {
          me.arregloSeries = res.data
      })
    },
    verFormato(){
      let me = this;
      let datos  = me.arregloPeriodos
      let setear = datos.filter(p => p.idperiodoescolar == me.periodoSelect.idperiodoescolar)
      me.enviarPeriodo  = setear[0]
      me.popupFormato   = true
    },
    //Metodos para cargar formato
    rechargeFormato(e){
      let me = this;
      me.popupCargarFormato = false;
      me.popupFormato       = true;
    },
  }
}
</script>
