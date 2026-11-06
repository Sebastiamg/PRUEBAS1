<template>
  <div>
      <div class="mt-3">
        <!--CONTADOR SELECCIONADO-->
        <!-- <div class="vx-row">
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 my-2">
            <div>
              <p class="text-success text-2xl font-bold">Total Descuento: <b>{{ filtrarDecimal(sumaSeleccionado) }}</b></p>
            </div>
          </div>
        </div> -->
        <!--GUARDAR-->
        <!-- <div class="vx-row">
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2 my-2">
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Palabra personalizada (Ejemplo: Descuento Cupón)" v-model="campoPersonalizado" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                <span>Estado:</span>
                <ul class="flex mt-2">
                  <li>
                    <vs-radio v-model="tipoPersonalizado" class="mr-2" vs-name="radios1tipoPersonalizado" vs-value="1">Activo</vs-radio>
                  </li>
                  <li>
                    <vs-radio v-model="tipoPersonalizado" vs-name="radios1tipoPersonalizado" vs-value="0">Desactivado</vs-radio>
                  </li>
                </ul>
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col w-full">
                <vs-button class="mr-3 mb-2" @click="guardarDescuento()">Guardar cambios</vs-button>
              </div>
            </div>
          </div>
        </div> -->
        <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Campo Personalizado:" v-model="campoPersonalizado" />
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Valor:" v-model="Cantidad" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col w-1/2">
            <span>Estado:</span>
            <ul class="flex mt-2">
              <li>
                <vs-radio v-model="tipoPersonalizado" class="mr-2" vs-name="radios1tipoPersonalizado" vs-value="1">Activo</vs-radio>
              </li>
              <li>
                <vs-radio v-model="tipoPersonalizado" vs-name="radios1tipoPersonalizado" vs-value="0">Desactivado</vs-radio>
              </li>
            </ul>
          </div>
          <div class="vx-col w-1/2">
            <span>Calculo:</span>
            <ul class="flex mt-2">
              <li>
                <vs-radio v-model="calculo" class="mr-2" vs-name="radios1calculo" vs-value="0">Resta</vs-radio>
              </li>
              <li>
                <vs-radio v-model="calculo" vs-name="radios1calculo" vs-value="1">Suma</vs-radio>
              </li>
            </ul>
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col w-full">
            <vs-button class="mr-3 mb-2">Guardar</vs-button>
          </div>
        </div>
      </div>
  </div>
</template>
<script>
export default {
  data(){
    return{
      campoPersonalizado:'',
      total_descuento:0,
      tipoPersonalizado:'',
      calculo:0,
    }
  },
  props:{
    datosInstitucion:{
      type:Object,
      default:function(){
        return {}
      }
    },
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    id:{
      type: Number,
      default:0
    },
  },
  methods:{
    saveValor(){
      let me = this;
      if(me.valo)
      me.descuentoSelect         = ""
      const {idInstitucion, id_periodo, contrato }         = me.datosInstitucion
      const { num_verificacion } = me.VerificacionSelect
      const { idusuario }        = me.usuario
      let formData = new FormData();
      formData.append('id',                     me.id)
      formData.append('institucion_id',         idInstitucion)
      formData.append('periodo_id',             id_periodo)
      formData.append('contrato',               contrato);
      formData.append('num_verificacion',       num_verificacion);
      formData.append('user_created',           idusuario);
      formData.append('verificacion_id',        me.VerificacionSelect.id)
      formData.append('saveValorDinamico',     'yes')
      formData.append('tipo',                   2)
      formData.append('calculo',                me.calculo)
      me.$vs.loading()
      this.$http.post(this.$server_url+'verificacionesDescuentos', formData)
      .then(res => {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({
          text:res.data.message,
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.$vs.notify({
          text:res.data.message,
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
        me.$emit('updateValuesVerificacion',true)
      })
      .catch((e) =>{
        me.$vs.loading.close()
      })
    },
  }
}
</script>
