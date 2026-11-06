<template>
  <div>
    <!--FORMULARIO INFORMACION PAGO-->
    <div>
      <p class="mt-5 font-bold">Crear Pago</p>

      <vs-divider>Información del Pago</vs-divider>

      <!-- CAMPOS DEL FORMULARIO -->
      <div class="mt-3">
        <!-- Campos principales en flex wrap -->
        <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
          <!-- Tipo de Pago -->
          <div style="flex: 1; min-width: 280px;">
            <span>Tipo de Pago: <span class="text-danger">*</span></span>
            <v-select
              :options="arrayTiposPagos"
              :disabled="disabledTipo"
              :reduce="arrayTiposPagos => arrayTiposPagos.id"
              label="nombre"
              class="w-full"
              v-model="sendValor.tipo_pago_id"
            />
          </div>

          <!-- Forma de pago -->
          <div style="flex: 1; min-width: 280px;">
            <span>Forma de pago: <span class="text-danger">*</span></span>
            <v-select
              :options="arrayFormasPagos"
              :reduce="arrayFormasPagos => arrayFormasPagos.tip_pag_codigo"
              label="tip_pag_nombre"
              class="w-full"
              v-model="sendValor.forma_pago_id"
            />
          </div>

          <!-- Total -->
          <div style="flex: 1; min-width: 280px;">
            <vs-input
              class="w-full"
              icon-pack="feather"
              icon="icon-credit-card"
              icon-no-border
              label="Total"
              v-model="sendValor.valor"
              @input="sendValor.valor = limpiarValorNumerico(sendValor.valor, sendValor.tipo_pago_id == 3)"
            />
          </div>

          <!-- Observación -->
          <div style="flex: 1 1 100%; min-width: 280px;">
            <vs-input
              class="w-full"
              icon-pack="feather"
              icon="icon-message-square"
              icon-no-border
              label="Observación"
              v-model="sendValor.observacion"
            />
          </div>
        </div>

        <!-- Alertas de tipo de pago -->
        <div v-if="sendValor.tipo_pago_id" class="mb-4">
          <vs-alert v-if="sendValor.tipo_pago_id == 3" class="mt-2" color="warning">El valor de las deudas tienen que ir con negativo - <b>(Estas deudas apareceran en el proximo año)</b></vs-alert>
          <vs-alert v-if="sendValor.tipo_pago_id == 4" class="mt-2" color="warning">!Solo puede existir un pago de convenio por contrato</vs-alert>
          <vs-alert v-if="sendValor.tipo_pago_id == 5" class="mt-2" color="warning">Este valor se va a sumar con el valor de comisión en el reporte</vs-alert>
          <vs-alert v-if="sendValor.tipo_pago_id == 7" class="mt-2" color="warning">Este valor se va a sumar con el valor de comisión en el reporte  - <b>(Solo puede haber un solo pago de otro valor para cancelar)</b></vs-alert>
        </div>

        <!-- Campos para tipo 2: Mostrar en reporte y texto dinámico -->
        <div v-if="sendValor.tipo_pago_id == 2" style="display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px;">
          <!-- Mostrar en el reporte -->
          <div style="flex: 1; min-width: 280px;">
            <span><b>Mostrar en el reporte</b></span>
            <ul class="flex mt-3">
              <li>
                <vs-radio v-model="sendValor.mostrar_reporte" class="mr-3" vs-name="radios1mostrar_reporte" vs-value="0">No</vs-radio>
              </li>
              <li>
                <vs-radio v-model="sendValor.mostrar_reporte" vs-name="radios1mostrar_reporte" vs-value="1">Si</vs-radio>
              </li>
            </ul>
          </div>

          <!-- Texto a mostrar en el reporte -->
          <div style="flex: 1; min-width: 280px;">
            <vs-input
              class="w-full"
              icon-pack="feather"
              icon="icon-credit-card"
              placeholder="Ejm. OTROS VALORES POR CANCELAR"
              icon-no-border
              label="Texto a mostrar en el reporte"
              v-model="sendValor.campo_dinamico"
            />
          </div>
        </div>

        <!-- Campo dinámico solo para tipo 7 -->
        <div v-if="sendValor.tipo_pago_id == 7" class="vx-row mb-4">
          <div class="vx-col w-full md:w-1/2">
            <vs-input
              class="w-full"
              icon-pack="feather"
              icon="icon-credit-card"
              placeholder="Ejm. OTROS VALORES POR CANCELAR"
              icon-no-border
              label="Texto a mostrar en el reporte"
              v-model="sendValor.campo_dinamico"
            />
          </div>
        </div>

        <!-- Registrar como Anticipo -->
        <div v-if="sendValor.tipo_pago_id == 1" class="vx-row mb-4">
          <div class="vx-col w-full">
            <span><b>Registrar como Anticipo del Pedido</b> (Se muestra en el reporte)</span>
            <ul class="flex mt-2">
              <li>
                <vs-radio v-model="sendValor.ifAntAprobado" class="mr-3" vs-name="radios1ifAntAprobado" vs-value="0">No</vs-radio>
              </li>
              <li>
                <vs-radio v-model="sendValor.ifAntAprobado" vs-name="radios1ifAntAprobado" vs-value="1">Si</vs-radio>
              </li>
            </ul>
          </div>
        </div>

        <!-- Alerta Anticipo -->
        <div v-if="id > 0 && sendValor.ifAntAprobado == 1" class="mb-3">
          <vs-alert color="warning">
            El <b>valor</b> del anticipo del pedido solo se puede editar desde el botón de <b>Cambiar anticipo solicitado</b>
          </vs-alert>
        </div>

        <!-- Botón Guardar -->
        <div class="flex mt-4" style="justify-content: center;">
          <vs-button class="mr-3 mb-2" style="color:white!important" icon-pack="feather" icon="icon-user-check" @click="subirDocumento()">Guardar Pago</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import axios from 'axios'
export default {
  components:{
    vSelect,
  },
  data() {
    return{
      sendValor:{
        valor:'',
        observacion:'',
        forma_pago_id:'',
        tipo_pago_id:1,
        ifAntAprobado:0,
        campo_dinamico:'OTROS VALORES POR CANCELAR',
        mostrar_reporte:0,
        subtotal:0,
        iva_valor:0,
        retencion:0,
      },
      arrayFormasPagos:[],
      arrayTiposPagos:[],
      disabledTipo:false,
    }
  },
  props:{
    userRoot:{
      type:Boolean,
      default:false,
      required:true,
    },
    ObjectSelect:{
      type:Object,
      default:function(){
        return {}
      },
    },
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
    sendPedido:{
      type:Object,
      default:function(){
        return {}
      }
    },
    contrato:{
      type:String,
      default:""
    },
    id:{
      type:Number,
      default:0,
    },
  },
  watch:{
    id(results){
      this.id = results
    },
  },
  created(){
    let me = this;
    me.getFormasPagos()
    me.getTiposPagos()
  },
  mounted(){
    let me = this;
    if(me.id > 0){
      me.sendValor ={
        valor:                      me.ObjectSelect.doc_valor,
        observacion:                me.ObjectSelect.doc_observacion,
        forma_pago_id:              me.ObjectSelect.forma_pago_id,
        tipo_pago_id:               me.ObjectSelect.tipo_pago_id,
        ifAntAprobado:              me.ObjectSelect.ifAntAprobado,
        campo_dinamico:             me.ObjectSelect.campo_dinamico,
        mostrar_reporte:            me.ObjectSelect.mostrar_reporte,
        subtotal:                   me.ObjectSelect.subtotal || 0,
        iva_valor:                  me.ObjectSelect.iva_valor || 0,
        retencion:                  me.ObjectSelect.retencion || 0,
      }
      if(me.ObjectSelect.tipo_pago_id == 4){
        me.disabledTipo = true
      }
    }
  },
  methods:{
    limpiarValorNumerico(valor, permitirNegativo = false) {
      const str = String(valor)
      const esNegativo = permitirNegativo && str.trimStart().startsWith('-')
      // Elimina todo lo que no sea número o punto decimal
      let limpio = str.replace(/[^0-9.]/g, '')
      // Evita múltiples puntos
      const partes = limpio.split('.')
      if (partes.length > 2) {
        limpio = partes[0] + '.' + partes.slice(1).join('')
      }
      // Limitar a máximo 6 dígitos antes del punto decimal
      if (limpio.includes('.')) {
        const [entero, decimal] = limpio.split('.')
        if (entero.length > 6) {
          limpio = entero.substring(0, 6) + '.' + decimal
        }
      } else {
        if (limpio.length > 6) {
          limpio = limpio.substring(0, 6)
        }
      }
      // Permitir signo negativo al inicio (tipo pago 3: deudas)
      if (esNegativo) {
        limpio = limpio === '' ? '-' : '-' + limpio
      }
      // Permitir campo vacío, no forzar a '0'
      return limpio
    },
    getTiposPagos(){
      let me  = this
      var url = ""
      url = this.$server_url + 'pedigo_Pagos?getTiposPagos=yes'
      this.$http.get(url)
        .then(res => {
          me.arrayTiposPagos = res.data.filter(p => p.id != 4) //filtramos tipo pago convenio colectivo
        })
        .catch(error => {
          console.log(error)
        })
    },
    getFormasPagos(){
      let me  = this
      var url = ""
      url = this.$server_url + 'pedigo_Pagos?getFormasPago=yes'
      this.$http.get(url)
        .then(res => {
          me.arrayFormasPagos = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    subirDocumento(){
      let me = this;
      const { forma_pago_id,tipo_pago_id } = me.sendValor
      if(tipo_pago_id == null || tipo_pago_id == "" || tipo_pago_id == undefined || tipo_pago_id == 0){
        me.$vs.notify({
          text: "Debe seleccionar un Tipo de pago",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }
      if(forma_pago_id == null || forma_pago_id == "" || forma_pago_id == undefined || forma_pago_id == 0){
        me.$vs.notify({
          text: "Debe seleccionar una forma de pago",
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return
      }
      if(me.sendValor.tipo_pago_id == 3){
        if(me.sendValor.valor > 0){
          me.$vs.notify({
            text: `El valor de las deudas tienen que ir con negativo -`,
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          return
        }
      }
      let formData = new FormData();
      formData.append('saveValorPago',             "yes")
      formData.append('id',                        me.id)
      formData.append('doc_valor',                 me.sendValor.valor)
      formData.append('subtotal',                  me.sendValor.subtotal)
      formData.append('iva_valor',                 me.sendValor.iva_valor)
      formData.append('retencion',                 me.sendValor.retencion)
      formData.append('user_created',              me.usuario.idusuario)
      formData.append('forma_pago_id',             me.sendValor.forma_pago_id)
      formData.append('tipo_pago_id',              me.sendValor.tipo_pago_id)
      formData.append('doc_observacion',           me.sendValor.observacion)
      //ANTICIPO PEDIDO
      if(me.sendValor.tipo_pago_id == 1){         formData.append('ifAntAprobado', me.sendValor.ifAntAprobado)   }
      else{                                       formData.append('ifAntAprobado', 0)                            }
      //informacion pedido
      formData.append('ven_codigo',               me.sendPedido.contrato_generado)
      formData.append('institucion_id',           me.sendPedido.id_institucion)
      formData.append('periodo_id',               me.sendPedido.id_periodo)
      formData.append('id_pedido',                me.sendPedido.id_pedido)
      formData.append('campo_dinamico',           me.sendValor.campo_dinamico)
      //si no es tipo pago 2 mostrar en reporte 0
      if(me.sendValor.tipo_pago_id == 2){         formData.append('mostrar_reporte', me.sendValor.mostrar_reporte)   }
      else{
        formData.append('mostrar_reporte',        0)
      }
      if(me.userRoot){ formData.append('permisoPago','yes') }
      me.$vs.loading()
      this.$http.post(this.$server_url+'pedigo_Pagos', formData)
      .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:5000
            })
            return
          }
          var getId       = res.data.doc_codigo
          me.$vs.notify({
          text:"Se guardo correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          var datos = {
            tipo:2,
            setId:getId
          }
          me.$emit('showCreate',datos)
      })
      .catch(function (error) {
          me.$vs.loading.close()
      })
    },
  }
}
</script>
