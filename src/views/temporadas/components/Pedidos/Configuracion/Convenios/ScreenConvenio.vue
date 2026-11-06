<template>
  <div>
    <vx-card title="Datos Convenio">
      <vs-alert color="danger" v-if="(arrayAgreements.length > aniosDivider) && arrayInformation.length > 0"><p class="text-center font-bold">Error: Hay contratos {{ arrayAgreements.length }} y {{ aniosDivider}} años de convenio</p></vs-alert>
      <div v-if="popupAddAgreement == false && open == true">
        <div>
          <div v-if="sendPedido.estado == 0">
            <!--pedido aun esta pendiente no se puede crear el convenio-->
            <vs-alert color="warning" class="mt-3">El pedido aun no ha esta activo</vs-alert>
          </div>
          <div v-else>
            <vs-button v-if="datosConvenio.estado !=2 || datosConvenio.id_convenio_autorizacion == datosConvenio.id || sendPedido.pedidos_convenios_id == 0"  @click="popupAddAgreement = true;" color="primary" type="border">Crear Convenio</vs-button>
          </div>
        </div>
      </div>
      <vs-button v-if="arrayInformation.length == 0 && popupAddAgreement"          @click="popupAddAgreement = false;" color="primary" type="border">◄ Regresar</vs-button>
      <!--CREAR CONVENIO-->
      <CrearConvenioVue  v-if="popupAddAgreement" :ObjectPedido="sendPedido" :usuario="usuario" :datosInstitucion="datosInstitucion"  :groupFacturador="groupFacturador" @changeRecharge="changeRecharge"/>
      <!--LISTADO INFORMACION CONVENIO-->
      <DatosConveniosVue v-else :idConvenio="idConvenio" :sendPedido="sendPedido" :arrayInformation="arrayConvenios" :userRoot="userRoot" :groupFacturador="groupFacturador"  @changeRecharge="changeRecharge" :usuario="usuario"/>
    </vx-card>
    <!--LISTADO DE CONTRATOS DEL CONVENIO-->
    <vx-card :title="'Contratos del Convenio #'+idConvenio " class="mt-3" v-if="arrayInformation.length > 0">
      <div class="vx-row ml-1">
        <p> <vs-chip>CONVENIO GLOBAL:           <b class="ml-1">              {{ setAnticipoGlobal | filtrarDecimal }}</b></vs-chip></p>
        <p> <vs-chip>TOTAL CONTRATOS:           <b class="ml-1">              {{ valuesAgreements  | filtrarDecimal }}</b></vs-chip></p>
        <p> <vs-chip>VALOR CONVENIO DISPONIBLE: <b class="ml-1 text-success"> {{ (setAnticipoGlobal - valuesAgreements) | filtrarDecimal }}</b></vs-chip></p>
      </div>
      <!--LISTADO DE CONTRATOS-->
      <div v-if="popupAddContract == false">
        <div class="flex mt-5 justify-center" >
          <div class="flex" v-if="!showSuggested && groupFacturador">
            <vs-button class="p-2" v-if="arrayAgreements.length > 0 && datosConvenio.estado == 1" @click="intentAddContrato()" color="primary" type="border" icon-pack="feather" icon="icon-plus">Agregar contrato</vs-button>
            <vs-button v-if="arrayAgreements.length > 0 && datosConvenio.estado == 1" @click="showSuggested = true;setValuesAgreements(1)" color="#3CA7E5" class="ml-3 p-2" type="filled" icon-pack="feather" icon="icon-eye">Mostrar valores sugeridos</vs-button>
          </div>
        </div>
        <vs-button @click="getConvenios"><i class="fa-solid fa-arrow-rotate-right"></i></vs-button>
        <ListadoConveniosVue :datosConvenio="datosConvenio" :idConvenio="idConvenio" :arrayAgreements="arrayAgreements" :groupFacturador="groupFacturador" @changeRecharge="changeRecharge" :showSuggested="showSuggested" :setAnticipoGlobal="setAnticipoGlobal" :usuario="usuario"  :datosInstitucion="datosInstitucion" class="mt-5"/>
        <div v-if="showSuggested">
          <div class="flex justify-center mt-5">
            <vs-button class="mr-3 mb-2" icon="check" @click="updateValuesSuggested()">Aplicar valores sugeridos</vs-button>
            <vs-button color="warning" type="border" icon-pack="feather" icon="icon-x" class="mb-2" @click="showSuggested = false;">Cancelar</vs-button>
          </div>
        </div>
      </div>
      <!--MODALES-->
      <!--MODAL PARA CREAR-->
      <div v-if="popupAddContract" class="mt-5">
        <CrearContratoConvenioVue @changeRecharge="getDatosConvenio" :idConvenio="idConvenio" :idConvenioHijo="idConvenioHijo" :agreementSonObject="agreementSonObject" :arrayContracts="arrayContracts" :arrayInformation="arrayInformation" :usuario="usuario"/>
      </div>
    </vx-card>
  </div>
</template>
<script>
import {
    mapState,
    mapActions
} from 'vuex'
import PedidosRepository from '../../../../../../repositories/PedidosRepository'
const ListadoConveniosVue           = () => import('./ListadoConvenios.vue')
const DatosConveniosVue             = () => import('./DatosConvenios')
const CrearContratoConvenioVue      = () => import('./CrearContratoConvenio')
const CrearConvenioVue              = () => import('./CrearConvenio.vue')
export default {
  components:{
    ListadoConveniosVue,
    DatosConveniosVue,
    CrearContratoConvenioVue,
    CrearConvenioVue,
  },
  data() {
    return{
      usuario:[],
      id_pedido:0,
      arrayInformation:[],
      arrayAgreements:[],
      arrayContracts:[],
      sendPedido:'',
      setAnticipoGlobal:0,
      aniosDivider:0,
      valuesAgreements:0,
      showSuggested:false,
      idConvenio:0,
      popupAddAgreement:false,
      //variables for contract
      popupAddContract:false,
      idConvenioHijo:0,
      agreementSonObject:'',
      //end variables for contract
      open:false,
      datosInstitucion:'',
      datosConvenio:'',
      arrayConvenios:[],
    }
  },
  computed:{
      ...mapState(['pedidoId','userRoot','groupFacturador','ObjectPedido']),
  },
  created(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this
    me.id_pedido          = me.ObjectPedido.id_pedido
    me.sendPedido         = me.ObjectPedido
    me.datosInstitucion   = me.ObjectPedido
    me.getDatosConvenio()
    me.getContratos()
  },
  methods:{
    getPedido(){
      let me = this
      me.sendPedido = []
      PedidosRepository.getPedidoXID(me.id_pedido).then(r => { me.sendPedido = r.data[0]; })
    },
    changeRecharge(e,tr){
      let me = this
      me.arrayAgreements = []
      me.getPedido()
      //cancel
      if(e == 0){ me.popupAddContract = true; }
      if(e == 1){
        me.getDatosConvenio()
        let datos = {
          "tipo"                            :8,
        }
        me.$emit('recharge',datos)
      }
      //crud
      if(e == 2){
        me.popupAddContract   = true
        me.idConvenioHijo     = tr.doc_codigo
        me.agreementSonObject = tr
      }
      //resete values
      if(e == 3) {
        me.getPedido()
        me.getDatosConvenio()
        me.setValuesAgreements(0)
          let datos = {
          "tipo"                            :8,
        }
        me.$emit('recharge',datos)
      }
      //only recharge
      if(e == 4){
        me.getDatosConvenio()
      }
    },
    getContratos(){
      let me = this;
      me.arrayContracts                  = []
      const { id_institucion,id_periodo  }  = me.ObjectPedido
      this.$http.get(this.$server_url+`convenio?allContratoXInstitucion=yes&institucion_id=${id_institucion}`)
        .then(function (res) {
          me.arrayContracts = res.data
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    getDatosConvenio() {
      let me = this;
      me.arrayAgreements                   = []
      me.arrayInformation                  = []
      me.aniosDivider                      = 0
      me.valuesAgreements                  = 0
      me.showSuggested                     = false
      me.popupAddContract                  = false
      me.popupAddAgreement                 = false
      me.tooContracts                      = false
      const { id_institucion,id_periodo  }  = me.datosInstitucion
      me.$vs.loading()
      this.$http.get(this.$server_url+`convenio?AllConvenios=yes&institucion_id=${id_institucion}`)
        .then(function (res) {
          me.$vs.loading.close()
          let datos = res.data
          if(datos.length > 0){
            me.arrayConvenios     = datos
            me.arrayInformation   = datos.filter(p => p.periodo_id == id_periodo || p.id == me.sendPedido.pedidos_convenios_id)
            if(me.arrayInformation.length > 0){
              me.open = false;
              // me.arrayInformation   = datos
              me.setAnticipoGlobal  = me.arrayInformation[0].anticipo_global
              me.aniosDivider       = me.arrayInformation[0].convenio_anios
              me.idConvenio         = me.arrayInformation[0].id
              me.datosConvenio      = me.arrayInformation[0]
              if(me.aniosDivider > 0){
                me.setIdConvenioToHijos()
                me.getConvenios(res.data[0].id)
              }
              //si el convenio esta cerrado coloco el open en true
              if(me.arrayInformation[0].estado == 2){
                me.open = true;
              }
            }else{
              me.open = true;
            }
          }else{
            me.open = true;
          }
      })
      .catch(function (error) {
        me.$vs.loading.close()
        me.$vs.notify({
        text:'Error al cargar los datos',
        color:'danger',
        iconPack: 'feather',
        icon:'icon-check'})
        console.log(error + ' error');
      })
    },
    setIdConvenioToHijos(){
      let me = this;
      const { id_institucion,id_periodo  }  = me.datosInstitucion
      this.$http.get(this.$server_url+`convenio?setIdConvenioToHijos=yes&institucion_id=${id_institucion}&periodo_id=${id_periodo}&idConvenio=${me.idConvenio}`)
        .then(function (res) {
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    getConvenios(){
      let me = this;
      me.arrayAgreements                  = []
      me.valuesAgreements                 = 0
      me.$vs.loading()
      this.$http.get(this.$server_url+`convenio?getConveniosXIdTodos=yes&id=${me.idConvenio}`)
        .then(function (res) {
          me.$vs.loading.close()
          let datos = res.data
          if(datos.length > 0){
            me.arrayAgreements    = datos
            //VALOR TOTAL CONTRATOS
            me.arrayAgreements.map(p => {
              me.valuesAgreements = parseFloat(me.valuesAgreements) + parseFloat(p.doc_valor)
            })
          }
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error + ' error');
      })
    },
    intentAddContrato(){
      let me = this;
      if(me.arrayAgreements.length >= me.aniosDivider){
        me.$vs.notify({
        text:`Ya no puedes crear más contratos por que el convenio es solo ${ me.aniosDivider } años`,
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      me.idConvenioHijo   = 0;
      me.popupAddContract = true;
    },
    setValuesAgreements(type){
      //type => 0 => actualizar valores a 0 => 1 mostrar valores sugeridos
      let   me = this
      let  count  = 1
      me.arrayAgreements.map((p,index) => {
        //update a 0
        if(type == 0){
          p.valueSuggested = 0
        }
        //values suggested
        else{
          if(count == me.aniosDivider){
            p.valueSuggested = parseFloat(me.arrayInformation[0].anticipo_global / me.arrayInformation[0].convenio_anios)
          }else{
            p.valueSuggested = me.redondearHaciaArriba(parseFloat(me.arrayInformation[0].anticipo_global / me.arrayInformation[0].convenio_anios))
          }
        }
        count++
      })
      //update values suggested
      if(type == 0){ me.updateValuesSuggested() }
    },
    updateValuesSuggested(){
      let me = this;
      let formData = new FormData();
      formData.append('updateValuesSuggested',  'yes')
      formData.append('data_contratos',         JSON.stringify(me.arrayAgreements))
      formData.append('user_created',           me.usuario.idusuario);
      formData.append('idConvenio',             me.idConvenio)
      this.$http.post(this.$server_url+'convenio', formData)
      .then(res => {
        if(res.data.status == 0){
          me.$vs.notify({
          text:res.data.message,
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.showSuggested = false
        me.getDatosConvenio()
        me.$vs.notify({
          text:'Se guardo con éxito',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
      })
      .catch((e)=>{
        // me.$vs.loading.close()
      })
    },
    redondearHaciaArriba(numero) {
      if(numero == 0 || numero == undefined || numero == null){ return 0 }
      return Math.ceil(numero);
    }
  }
}
</script>
