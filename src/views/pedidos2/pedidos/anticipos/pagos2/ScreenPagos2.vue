<template>
  <div>
    <div v-if="sendPedido.id_pedido">
      <Pagos2BannerVue :sendPedido="sendPedido" :userRoot="userRoot" :usuario="usuario" :arregloPagos="arregloPagosTemp"/>
      <vs-tabs alignment="fixed">
        <vs-tab label="Listado de Pagos" @click="generateAnticipoDeuda();menu = 0;getListadoPagos();">
          <div>
          </div>
        </vs-tab>
        <vs-tab label="Configuración Convenio" @click="menu = 1;">
          <div>
          </div>
        </vs-tab>
      </vs-tabs>
      <!-- <ul class="flex">
        <li>
          <vs-radio v-model="menu" @input="getListadoPagos();" vs-name="radios1menu" class="mr-3" vs-value="0">Listado de Pagos</vs-radio>
        </li>
        <li>
          <vs-radio v-model="menu" vs-name="radios1menu" vs-value="1">Configuración Convenio</vs-radio>
        </li>
      </ul> -->
      <!--COMPONENTES-->
      <div v-if="menu == 0" class="mt-2">
        <div class="flex flex-wrap gap-2" v-if="estadoPagos == 1">
          <vs-button color="primary" v-if="sendPedido.estado != 2" class="p-2" type="filled" icon="add" @click="id = 0;popupAdd = true;">Crear Pago</vs-button>
          <vs-button color="primary" v-if="sendPedido.contrato_generado && arregloVerificaciones.length > 0" @click="updatePagos = true;" icon-pack="feather" icon="icon-loader" class="p-3" type="border">Actualizar Valores</vs-button>
        </div>

        <!-- Radio buttons para filtrar activos/inactivos -->
        <div class="flex items-center gap-4 mt-3 mb-2" v-if="userRoot">
          <vs-radio v-model="estadoPagos" vs-name="estadoPagos" vs-value="1" @input="getListadoPagos()">Activos</vs-radio>
          <vs-radio v-model="estadoPagos" vs-name="estadoPagos" vs-value="2" @input="getListadoPagos()">Inactivos</vs-radio>
        </div>

        <Pagos2ListadoVue  @showCreate="showCreate" @abrirDetallesPago="abrirDetallesPago" @rechargePedido="rechargePedido" @rechargeValores="rechargePedido();getListadoPagos();" :arregloPagos="arregloPagos" :sendPedido="sendPedido" :groupFacturador="groupFacturador" :userRoot="userRoot" :usuario="usuario" :estadoPagos="estadoPagos"/>
      </div>
      <div v-if="menu == 1">
        <ScreenConvenioVue :datosInstitucion="datosInstitucion"/>
      </div>
      <vs-popup @close="menuPagos=0;getListadoPagos();" fullscreen title="Mantenimiento Documentos" :active.sync="popupAdd" class="popupPadre">
        <div v-if="popupAdd">
          <br>
          <vx-card>
            <vs-alert>
              <p>Complete este formulario para registrar un nuevo pago a la escuela. Asegúrese de completar todos los campos</p>
            </vs-alert>
            <Pagos2CrearVue
              v-if="popupAdd"
              :sendPedido="sendPedido"
              @showCreate="showCreate"
              :userRoot="userRoot"
              :id="id"
              :ObjectSelect="ObjectSelect"
              :usuario="usuario"
            />
          </vx-card>
        </div>
      </vs-popup>

      <div v-if="updatePagos">
        <div v-for="(item,key) in arregloVerificaciones" :key="key">
          <ScreenRellenarPagosVue
          :cantidadVerificaciones="arregloVerificaciones.length"
          :VerificacionSelect="item"
          :sendPedido="sendPedido"
          :datosInstitucion="datosInstitucion"
          :contrato="sendPedido.contrato_generado"
          @changeHandleUpdatePayments="changeHandleUpdatePayments"
          />
        </div>
      </div>

      <!--MODAL LOADING-->
      <vs-popup :title="'Cargando....'" :active.sync="updatePagos">
        <Loading1Vue :title="'Espere mientras se actualiza los valores.......'"/>
      </vs-popup>

      <!-- Modal de Detalles de Pago - FUERA del modal padre -->
      <vs-popup
        fullscreen
        title="Detalles de Pago"
        :active.sync="popupDetallesPago"
        class="popupPadre"
      >
        <div v-if="popupDetallesPago && id > 0">
          <Pagos2DetallesPagoVue :id_pago="Number(id)" @actualizarListadoPagos="getListadoPagos" />
        </div>
      </vs-popup>
    </div>
  </div>
</template>
<script>
  import {
    mapState
} from "vuex";
import PedidosRepository from "../../../../../repositories/PedidosRepository";
import PagosRepository from "../../../../../repositories/PagoRepository";
const Pagos2ListadoVue        = () => import('./Pagos2Listado.vue')
const Pagos2CrearVue          = () => import('./Pagos2Crear.vue')
const ScreenConvenioVue       = () => import('../../../../temporadas/components/Pedidos/Configuracion/Convenios/ScreenConvenio.vue')
const Pagos2BannerVue         = () => import('./components/Pagos2Banner.vue')
const Loading1Vue             = () => import('../../../../configuracion/Reutilizable/Loading1.vue')
const ScreenRellenarPagosVue  = () => import('../../../../temporadas/components/Pedidos/Pagos/components/Verificacion/ScreenRellenarPagos.vue')
const Pagos2DetallesPagoVue    = () => import('./components/Pagos2DetallesPago.vue')
export default {
  components:{
    Pagos2ListadoVue,
    Pagos2CrearVue,
    ScreenConvenioVue,
    Pagos2BannerVue,
    Loading1Vue,
    ScreenRellenarPagosVue,
    Pagos2DetallesPagoVue,
  },
  data() {
    return{
      id:0,
      menu:0,
      menuPagos:0,
      ObjectSelect:'',
      usuario:[],
      popupAdd:false,
      popupDetallesPago:false,
      sendPedido:'',
      arregloPagos:[],
      arregloPagosTemp:[],
      datosInstitucion:'',
      updatePagos:false,
      arregloVerificaciones:[],
      estadoPagos:1, // 1 = Activos, 2 = Inactivos
    }
  },
  computed:{
  ...mapState(["auth",'userRoot','susuario','ObjectPedido','groupFacturador','userAsesor']),
  },
  watch:{
    ObjectPedido(results){
      let me = this
      me.sendPedido = me.ObjectPedido
    },
    arregloPagos(results){
      let me = this
      me.arregloPagos     = results
    },
    arregloPagosTemp(results){
      let me = this
      me.arregloPagosTemp = results
    }
  },
  // watch:{
  //   sendPedido(results){
  //     let me = this
  //     me.getListadoPagos()
  //   }
  // },
  mounted(){
    let me = this
    this.usuario  = JSON.parse(localStorage.getItem("usuario"))
    me.popupAdd   = false
    me.sendPedido = me.ObjectPedido
    me.getListadoPagos()
    me.datosInstitucion         = {
      idInstitucion           :me.sendPedido.id_institucion,
      nombreInstitucion       :me.sendPedido.nombreInstitucion,
      id_periodo              :me.sendPedido.id_periodo,
    }
    if(me.groupFacturador){ me.getVerificaciones() }
    //EJECUTAR POPUP DE ACTUALIZAR VALORES
    // if(me.sendPedido.datos_verificacion_por_ingresar == 1){
    //   me.updatePagos = true
    // }
    // console.log(this.sendPedido.id_pedido,"hola")
  },
  methods:{
    recargarPagos(){
      let me = this
      this.$http.get(this.$server_url+`pedidos/${me.ObjectPedido.id_pedido}`)
      .then(function (res) {
        me.generateAnticipoDeuda()
        me.getListadoPagos()
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    generateAnticipoDeuda(){
      let me = this;
      PagosRepository.generateAnticiposDeuda(me.ObjectPedido.id_pedido).then(r => {  })
    },
    getVerificaciones(){
      let me = this
      this.$http.get(this.$server_url+`n_verificacion?getVerificacionXcontrato=yes&contrato=${ me.sendPedido.contrato_generado }`)
        .then(function (res) {
          let datos = res.data.filter(p => p.estado == 0)
          if(datos.length > 0){
            me.arregloVerificaciones = datos.sort((a, b) => a.id - b.id);
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    changeHandleUpdatePayments(e){
      let me = this
      me.updatePagos = false
      me.rechargePedido()
      me.getListadoPagos()
    },
    abrirDetallesPago(doc_codigo){
      let me = this
      me.id = doc_codigo
      // Cerrar el modal padre primero para evitar problemas de z-index
      me.popupDetallesPago = true
      // Esperar un momento para que se cierre el modal padre
      // setTimeout(() => {
      //   me.popupDetallesPago = true
      // }, 100)
    },
    rechargePedido(){
      let me = this
      PedidosRepository.getPedidoXID(me.sendPedido.id_pedido).then(r => { this.$store.dispatch('setPedido',r.data[0]); })
    },
    showCreate(e,values=''){
      let me                = this
      me.id                 = 0;
      if(e == 1)            { me.popupAdd = true; }
      if(e.tipo == 2)       { me.id       = e.setId ;}
      me.ObjectSelect       = values
      if(values.doc_codigo) { me.id = values.doc_codigo }
      me.rechargePedido()
    },
    getListadoPagos(){
      let me = this;
      const { id_institucion, id_periodo, contrato_generado:contrato } = me.sendPedido
      var url = ""

      // Determinar URL según estado y si tiene contrato
      if(contrato == "" || contrato == null || contrato == undefined) {
        // Sin contrato
        if(me.estadoPagos == 1) {
          url = this.$server_url + `pedigo_Pagos?ListadoListaPagosSinContrato=yes&institucion_id=${ id_institucion }&periodo_id=${ id_periodo }`
        } else {
          url = this.$server_url + `pedigo_Pagos?ListadoListaPagosEliminadosSinContrato=yes&institucion_id=${ id_institucion }&periodo_id=${ id_periodo }`
        }
      }else{
        // Con contrato
        if(me.estadoPagos == 1) {
          url = this.$server_url + `pedigo_Pagos?ListadoListaPagos=yes&contrato=${ contrato }`
        } else {
          url = this.$server_url + `pedigo_Pagos?ListadoListaPagosEliminados=yes&contrato=${ contrato }`
        }
      }

      me.$vs.loading()
      this.$http.get(url)
        .then(function (res) {
          me.$vs.loading.close()
          me.arregloPagos     = res.data.filter(p => p.tipo_pago_id != 3)
          me.arregloPagosTemp = res.data
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error + ' error');
        })
    },
  }
}
</script>
<style scoped>
::v-deep .popupPadre {
    z-index: 51001 !important;
}

.btn-activo {
  background-color: #efa057 !important;
  color: white !important;
  border: 1px solid #efa057;
}

.btn-inactivo {
  background-color: white !important;
  color: black !important;
  border: 1px solid #ccc;
}
</style>
