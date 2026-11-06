<template>
  <div class="mt-5">
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Seleccione cobro de venta directa:</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <ul class="flex">
          <!--COBRO SELECT => 0 = NADA; 1 = 100%; 2 =porcentaje de la escuela; 3=> Personalizado-->
          <li>
            <vs-radio v-model="cobroSelect" @input="tipoPago = 3" class="mr-2" vs-name="radios1cobroSelect" vs-value="1">Cobro 100%</vs-radio>
          </li>
          <li>
            <vs-radio v-model="cobroSelect" @input="tipoPago = 0" class="mr-2" vs-name="radios1cobroSelect" vs-value="2">Cobro porcentaje escuela</vs-radio>
          </li>
        </ul>
      </div>
    </div>
    <!--FORMA DE PAGO-->
    <div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Forma de pago:</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <ul class="leftx">
            <li>
              <vs-radio v-model="tipoPago" v-if="cobroSelect == '2'" vs-name="radios1tipoPago" vs-value="1">Cancelar Total</vs-radio>
            </li>
            <li>
              <vs-radio v-model="tipoPago" v-if="cobroSelect == '2'" vs-name="radios1tipoPago" vs-value="2">Descontar</vs-radio>
            </li>
            <li>
              <vs-radio v-model="tipoPago" v-if="cobroSelect == '1'" vs-name="radios1tipoPago" vs-value="3">Regalado</vs-radio>
            </li>
          </ul>
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col sm:w-2/3 w-full ml-auto">
          <vs-button class="mr-3 mb-2" @click="guardarCobro()">Guardar</vs-button>
          <vs-button color="warning" type="border" class="mb-2" @click="$emit('changeReturn',1)">Cancelar</vs-button>
        </div>
      </div>
    </div>

  </div>
</template>
<script>
import vSelect from 'vue-select'
export default{
  components:{
    vSelect,
  },
  data(){
    return{
      usuario:[],
      cobroSelect:0,
      tipoPago:0,
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  props:{
    sendPedido:{
      type:Object,
      default:{}
    },
    setcobro_venta_directa:{
      type:Number,
      default:0
    },
    settipoPago:{
      type:Number,
      default:0
    },
    setcampoPersonalizado:{
      type:String,
      default:''
    },
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    datosInstitucion:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  mounted() {
    let me = this;
    me.cobroSelect = me.setcobro_venta_directa
    me.tipoPago    = me.settipoPago
  },
  methods: {
    changeReturnPersonalizado(e){
      let me = this;
      me.$emit('changeReturnPersonalizado',e)
    },
    guardarCobro(){
      let me = this;
      if(me.tipoPago == 0){
        me.$vs.notify({
        text:'Seleccione un tipo de pago por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      let formData = new FormData();
      formData.append('actualizarDosCampo',  "yes")
      formData.append('campo',              'cobro_venta_directa')
      formData.append('campo2',             'tipoPago')
      formData.append('verificacion_id',    me.VerificacionSelect.id);
      formData.append('valor',              me.cobroSelect);
      formData.append('valor2',             me.tipoPago);
      formData.append('user_created',       me.usuario.idusuario)
      this.$http.post(this.$server_url+'updateVerificacion', formData)
      .then(function (res) {
        let datos = {
          save:1,
          sendValor:me.cobroSelect,
          sendTipo:me.tipoPago
        }
        me.$emit('changeReturn',datos)
        me.$vs.notify({
        text:'Se guardo correctamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
      .catch(function (error) {})
    },
  },
}
</script>
