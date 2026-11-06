<template>
  <div>
    <div v-if="datosAgrupados.length > 0" >
      <vs-alert color="danger" style="height: 80px;">
        <p class="font-bold text-center">Ya existen documentos de venta generados, consulte antes con su facturador.</p>
      </vs-alert>
      <br>
    </div>
    <br>
    <div>
      <div v-if="menu == 0">
        <div>
          <ul class="flex justify-center">
            <li>
              <vs-radio v-model="testado" @input="getSolicitudesComision();" vs-name="radios1tipo" class="mr-3" vs-value="0"><b>{{sumarPendientes}}</b> Pendientes</vs-radio>
            </li>
            <li>
              <vs-radio v-model="testado" @input="getSolicitudesComision();" vs-name="radios1tipo" class="mr-3" vs-value="1"><b>{{sumarAprobadas}} </b>Aprobadas</vs-radio>
            </li>
            <li>
              <vs-radio v-model="testado" @input="getSolicitudesComision();" vs-name="radios1tipo" vs-value="3"><b>{{sumarRechazadas}}</b> Rechazadas</vs-radio>
            </li>
          </ul>
        </div>
        <ComisionListadoVue :testado="testado" :arraySolicitudes="tmpArraySolicitudes" :pendientes="pendientes" @changeCreate="changeCreate" @changeEdit="changeEdit" @changeDelete="changeDelete" @changeAprobar="changeAprobar"/>
      </div>
      <!--CREAR-->
      <div v-if="menu == 1">
        <ComisionCrearVue @changeHandle="changeHandle" :pedido="pedido" :id="Number(id)" :ObjectSelected="ObjectSelected"/>
      </div>
      <!--confirm eliminar-->
      <div v-if="menu == 2">
        <ConfirmEliminarVue otroValor="1" title="Estás seguro de eliminar esta solicitud ?" subtitle="Si, deseo eliminar" @changeConfirm="changeConfirmDelete" />
      </div>
      <!--confirm aprobar /rechazar-->
      <div v-if="menu == 3">
        <ComisionConfirmVue :ObjectSelected="ObjectSelected" :estado="estado" :cantidad_solicitada="cantidad_solicitada" @changeHandle="changeHandle" :aprobadoDespues="aprobadoDespues"/>
      </div>
    </div>
  </div>
</template>
<script>
const ComisionListadoVue = () => import('./ComisionListado.vue')
const ComisionCrearVue   = () => import('./ComisionCrear.vue')
const ConfirmEliminarVue = () => import("@/views/configuracion/Reutilizable/ConfirmEliminar.vue");
const ComisionConfirmVue = () => import('./ComisionConfirm.vue')
export default {
  components:{
    ComisionListadoVue,
    ComisionCrearVue,
    ConfirmEliminarVue,
    ComisionConfirmVue
  },
  data() {
    return{
      menu:0,
      arraySolicitudes:[],
      tmpArraySolicitudes:[],
      datosAgrupados:[],
      ObjectSelected:'',
      pendientes:0,
      testado:0,
      cantidad_solicitada:0,
      estado:0,
      id:0,
      aprobadoDespues:0
    }
  },
  props:{
    pedido:{
      type:Object,
      default:function(){
        return {}
      }
    },
    tipo:{
      type:Number,
      default:0,
    }
  },
  mounted(){
    let me = this
    me.getSolicitudesComision()
  },
  computed:{
    sumarPendientes(){
      let me = this
      let total = 0
      me.arraySolicitudes.forEach(function(item){
        if(item.estado == 0){
          total++
        }
      })
      return total
    },
    sumarAprobadas(){
      let me = this
      let total = 0
      me.arraySolicitudes.forEach(function(item){
        if(item.estado == 1){
          total++
        }
      })
      return total
    },
    sumarRechazadas(){
      let me = this
      let total = 0
      me.arraySolicitudes.forEach(function(item){
        if(item.estado == 3){
          total++
        }
      })
      return total
    }
  },
  methods:{
    changeAprobar(e,est,aDespues=0){
      console.log("aDespues", aDespues)
      let me                  = this
      me.estado               = est
      me.ObjectSelected       = e
      me.cantidad_solicitada  = e.cantidad_solicitada
      me.menu                 = 3
      me.aprobadoDespues      = aDespues
    },
    changeHandle(e){
      let me = this
      if(e == 0)  { me.menu = 0}
      if(e == 1)  { me.getSolicitudesComision(); me.menu = 0 }
      if(e == 2)  { me.getSolicitudesComision(); me.menu = 0; me.$emit('ChangeRegresar',true) }
      // recargar pedido
      me.$emit('rechargePedido',me.pedido.id_pedido)
    },
    changeCreate(e){
      let me = this
      me.menu = 1
      me.id = 0
    },
    changeEdit(e){
      let me = this
      me.menu = 1
      me.id = e.id
      me.ObjectSelected = e
    },
    changeDelete(e){
      let me = this
      me.ObjectSelected = e
      me.menu = 2
    },
    changeConfirmDelete(e){
      let me = this
      if(e == 1){
        me.deleteSolicitud()
      }
      me.menu = 0
    },
    getSolicitudesComision(){
      let me = this
      me.tmpArraySolicitudes  = []
      me.arraySolicitudes     = []
      me.datosAgrupados       = []
      me.pendientes           = 0
      me.$vs.loading()
      this.$http.get(this.$server_url+`pedidos_gerencia?listarSolicitudesPedido=1&id_pedido=${me.pedido.id_pedido}&tipo=${me.tipo}`)
      .then(function (res) {
          me.$vs.loading.close()
          me.arraySolicitudes     = res.data.arregloComision
          me.tmpArraySolicitudes  = res.data.arregloComision.filter(item => item.estado == me.testado)
          me.datosAgrupados       = res.data.agrupado
          me.pendientes = 0
          me.arraySolicitudes.forEach(function(item){
            if(item.estado == 0){
              me.pendientes++
            }
          })
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error + ' error');
      })
    },
    deleteSolicitud(){
      //API POST
      let me = this
      let formData = new FormData();
      formData.append('eliminarSolicitud',1);
      formData.append('id',               me.ObjectSelected.id);
      me.$vs.loading()
      this.$http.post(this.$server_url+'deleteMetodos', formData)
      .then(res => {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({
          text:res.data.message,
          color:'danger',
          iconPack: 'feather',
          icon:'icon-x'})
          return
        }
        me.$vs.notify({
        text:res.data.message,
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
        me.getSolicitudesComision()
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error + ' error');
      })
    },
  },
}
</script>
