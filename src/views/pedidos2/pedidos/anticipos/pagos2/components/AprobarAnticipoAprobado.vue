<template>
  <div>
    <div>
      <div class="uno" v-if="ifconvenio == 0">
        <small v-if="sendPedido.ifagregado_anticipo_aprobado == 0">Anticipo aprobado no asignado</small>
        <small v-if="sendPedido.ifagregado_anticipo_aprobado == 1">Anticipo aprobado por facturador</small>
        <small v-if="sendPedido.ifagregado_anticipo_aprobado == 2" class="font-bold">!Anticipo solicitado a gerencia ${{ sendPedido.anticipo_solicitud_for_gerencia }}</small>
        <small v-if="sendPedido.ifagregado_anticipo_aprobado == 3"><b>ANTICIPO APROBADO POR GERENCIA <span class="text-success">$ {{ sendPedido.anticipo_aprobado_gerencia }}</span></b></small>
        <small v-if="sendPedido.ifagregado_anticipo_aprobado == 4" class="text-danger">Anticipo solicitado: rechazado</small>
        <small v-if="sendPedido.ifagregado_anticipo_aprobado == 5" class="text-success">Gerencia aprueba anticipo sugerido</small>
      </div>
      <div v-else>
        <small v-if="sendConvenio.convenio_aprobado == 0">Convenio creado/pendiente </small>
        <small v-if="sendConvenio.convenio_aprobado == 1">Convenio solicitado a gerencia ${{ sendConvenio.valor_sugerido }} </small>
        <small v-if="sendConvenio.convenio_aprobado == 2" class="text-danger">Convenio anulado por  gerencia ${{ sendConvenio.valor_sugerido }} </small>
        <small v-if="sendConvenio.convenio_aprobado == 3">Convenio aprobado por gerencia ${{ sendConvenio.valor_aprobado_gerencia }} </small>
        <small v-if="sendConvenio.convenio_aprobado == 4">Convenio aprobado facturador</small>
      </div>
      <vs-tabs alignment="fixed" class="mt-1">
        <vs-tab label="Facturador" @click="tipoAccion = 1;">
          <div>
            <p class="text-center font-bold">Estas seguro de aprobar el {{ifconvenio == 0 ? 'Anticipo': 'Convenio'}}? </p>
            <vs-input type="number"  v-model="anticipo_aprobado" class="mt-1" style="width: 90%;" />
            <div class="flex mt-5 justify-center">
              <vs-button class="mr-3 mb-2" icon="check" v-if="ifconvenio==0" @click="updatePedido('anticipo_aprobado',anticipo_aprobado,'ifagregado_anticipo_aprobado',1)">Aprobar Anticipo</vs-button>
              <vs-button class="mr-3 mb-2" icon="check" v-if="ifconvenio==1" @click="updateConvenio(1,'anticipo_global',anticipo_aprobado,'convenio_aprobado',4)">Aprobar Convenio</vs-button>
              <vs-button color="warning" type="border" @click="$emit('changeHandle',0);" icon-pack="feather" class="mb-2" icon="icon-x">Cancelar</vs-button>
            </div>
          </div>
        </vs-tab>
        <vs-tab label="Gerencia" @click="tipoAccion = 0;">
            <div>
              <div class="vx-row mb-6">
                <div class="vx-col w-full">
                <vs-input class="w-full" icon-pack="feather" icon="icon-dollar-sign" icon-no-border label="Valor  a solicitar" v-model="solicitud.valor" />
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col w-full">
                <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Observación(Opcional)" v-model="solicitud.observacion" />
                </div>
            </div>
            <div class="flex justify-center">
              <vs-button class="mr-3 mb-2" v-if="ifconvenio==0" @click="solicitarAnticipo()">Solicitar</vs-button>
              <vs-button class="mr-3 mb-2" v-if="ifconvenio==1" @click="updateConvenio(4,'valor_sugerido',solicitud.valor,'convenio_aprobado',1,'observacion_sugerido',solicitud.observacion,'fecha_sugerido',fecha_sugerido)">Solicitar</vs-button>
              <vs-button color="warning" @click="$emit('changeHandle',0);" type="border" class="mb-2">Cancelar</vs-button>
            </div>
          </div>
        </vs-tab>
      </vs-tabs>

    </div>
  </div>
</template>
<script>
import PagosRepository from '../../../../../../repositories/PagoRepository'
import moment from 'moment'
export default {
  data() {
    return{
      solicitud:{
        valor:'',
        observacion:'',
        anticipo_aprobado:'',
        fecha_sugerido:'',
      },
      //tipoAccion = convenio; 1 = anticipo 0
      tipoAccion:1,
    }
  },
  props:{
    sendPedido:{
      type:Object,
      default:function(){ return { } }
    },
    usuario:{
      type:Object,
      default:function(){ return { } }
    },
    userRoot:{
      type:Boolean,
      default:false,
    },
    sendConvenio:{
      type:Object,
      default:function(){
        return {}
      }
    },
    ifconvenio:{
      type:Number,
      default:0,
    }
  },
  mounted(){
    let me = this
    me.setValues()
    //fecha sugerida anio mes dia hora minuto segundo
    me.fecha_sugerido = moment().format('YYYY-MM-DD HH:mm:ss')
  },
  methods:{
    setValues(){
      let me = this
      //====ANTICIPO APROBADO
      if(me.ifconvenio == 0){
        //=====FACTURADOR===
        if(me.sendPedido.ifagregado_anticipo_aprobado > 0){
          me.anticipo_aprobado    = me.sendPedido.anticipo_aprobado
        }else{
          if(me.sendPedido.anticipoAsesor > 0 ){
            me.anticipo_aprobado    = me.sendPedido.anticipoAsesor
          }else{
            me.anticipo_aprobado    = me.sendPedido.anticipo
          }
        }
        //===GERENCIA===
        me.solicitud.valor        = me.anticipo_aprobado
        me.solicitud.observacion  = me.sendPedido.anticipo_solicitud_observacion
        return
      }
      //====CONVENIO
      else{
         //=====FACTURADOR===
        //si aun no esta aprobado el anticipo asigno al input el anticipo sugerido
        if(me.sendConvenio.anticipo_global > me.sendConvenio.valor_sugerido){
          me.anticipo_aprobado    = me.sendConvenio.anticipo_global
          me.solicitud.valor      = me.sendConvenio.anticipo_global
        }else{
          me.anticipo_aprobado    = me.sendConvenio.valor_sugerido
          me.solicitud.valor      = me.sendConvenio.valor_sugerido
        }
        //===GERENCIA===

        me.solicitud.observacion  = me.sendConvenio.observacion_sugerido

      }
    },
    //FACTURADOR
    updatePedido(campo,valor,campo2,valor2){
      let me = this
      let formData = new FormData();
      formData.append('actualizarDosCampo',         'yes');
      formData.append('anticipoAprobado',           'yes');
      formData.append('user_created',               me.usuario.idusuario);
      formData.append('id_group',                   me.usuario.id_group);
      formData.append('id_pedido',                  me.sendPedido.id_pedido);
      formData.append('campo',                      campo)
      formData.append('campo2',                     campo2)
      formData.append('valor',                      valor)
      formData.append('valor2',                     valor2)
      me.$vs.loading()
      this.$http.post(this.$server_url+'updateThePedido', formData)
      .then(res => {
        me.$vs.loading.close()
        me.$vs.notify({
        text:res.data.message,
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
        me.$emit('changeHandle',1)
      })
      .catch((e)=>{
        me.$vs.loading.close()
      })
    },
    updateConvenio(cantidad,campo1,valor1,campo2,valor2,campo3,valor3,campo4,valor4){
      let me = this;
      let formData = new FormData();
      formData.append('updateCamposDatos',    'yes')
      if(cantidad == 1)                       { formData.append('unCampo', 'yes') }
      if(cantidad == 2)                       { formData.append('dosCampos', 'yes') }
      if(cantidad == 3)                       { formData.append('tresCampos', 'yes') }
      if(cantidad == 4)                       { formData.append('cuatroCampos', 'yes') }
      formData.append('id',                   me.sendConvenio.id);
      formData.append('campo1',               campo1);
      formData.append('campo2',               campo2);
      formData.append('campo3',               campo3);
      formData.append('campo4',               campo4)
      formData.append('valor1',               valor1)
      formData.append('valor2',               valor2)
      formData.append('valor3',               valor3)
      formData.append('valor4',               valor4)
      formData.append('user_created',         me.usuario.idusuario)
      formData.append('idConvenio',           me.sendConvenio.id)
      formData.append('tipoAccion',           me.tipoAccion)
      this.$http.post(this.$server_url+'convenio', formData)
      .then(res => {
        if(res.data.status == 0){
          me.$vs.notify({
          text:res.data.message,
          color:'danger',
          iconPack: 'feather',
          icon:'icon-x'})
          return
        }
        me.$emit('changeHandle',1)
          me.$vs.notify({
          text:'Se guardo correctamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})

      })
      .catch((e)=>{
        // me.$vs.loading.close()
      })
    },
    solicitarAnticipo(){
      let me = this;
      if(me.sendPedido.estado == 2){
        me.$vs.notify({
          color: 'warning',
          title: 'Mensaje',
          text: 'No se puede modificar el pedido anulado',
          time:5000,
        })
        return false
      }

      if(me.solicitud.valor < 50){
        me.$vs.notify({
        text:'El valor no puede ser menor a 50',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      let formData = new FormData();
      //====ANTICIPO
      formData.append('actualizarTresCampo',      'yes')
      formData.append('id_pedido',                me.sendPedido.id_pedido);
      formData.append('campo',                    'anticipo_solicitud_for_gerencia')
      formData.append('campo2',                   'anticipo_solicitud_observacion')
      //estado 2 => SOLICITUD A GERENCIA
      formData.append('campo3',                   'ifagregado_anticipo_aprobado')
      formData.append('valor',                    me.solicitud.valor)
      //====CONVENIO
      if(me.solicitud.observacion == null ||      me.solicitud.observacion == "null" ) {  formData.append('valor2',  "") }
      else{ formData.append('valor2',             me.solicitud.observacion)}
      formData.append('valor3',                   2)
      me.$vs.loading()
      this.$http.post(this.$server_url+'updateThePedido', formData)
      .then(res => {
          me.$vs.loading.close()

          me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.$emit('changeHandle',1)
      })
      .catch((e) => {
        me.$vs.loading.close()
      })
    },
  }
}
</script>
