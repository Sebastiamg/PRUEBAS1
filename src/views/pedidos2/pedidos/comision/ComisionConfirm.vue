<template>
  <div>
      <p><b>Anticipo Solicitado:</b> {{  ObjectSelected.cantidad_solicitada }} %</p>
      <p><b>Observación:</b>         {{  ObjectSelected.observacion }}</p>
      <vs-divider></vs-divider>
      <div>
        <vx-input-group class="mb-base" v-if="estado == 1">
          <template slot="prepend">
          <div class="prepend-text bg-primary">
              <span>Aprobar valor de:</span>
          </div>
          </template>
          <vs-input v-model="cantidadAprobar" type="number" placeholder="Ingrese el porcentaje a aprobar" />
        </vx-input-group>
        <!--obsevacion-->
        <vx-input-group class="mb-base">
          <template slot="prepend">
          <div class="prepend-text bg-primary">
              <span>Observación</span>
          </div>
          </template>
          <vs-input v-model="observacion" type="text" placeholder="Observación" />
        </vx-input-group>
      </div>
      <div class="flex justify-center mt-5">
        <vs-button v-if="estado == 1" color="success" @click="f_aprobar_pago(1)" type="gradient">Aprobar Comisión</vs-button>
        <vs-button v-if="estado == 3" color="danger"  @click="f_aprobar_pago(3)" type="gradient">Rechazar Comisión</vs-button>
        <!--buton de cancelar-->
        <vs-button color="warning" class="ml-3" @click="$emit('changeHandle',0)" type="gradient">Cancelar</vs-button>
      </div>
  </div>
</template>
<script>
export default{
  data(){
    return{
      usuario:[],
      observacion:'',
      cantidadAprobar:0,
    }
  },
  props:{
    ObjectSelected:{
      type:Object,
      default:function(){
        return {}
      }
    },
    estado:{
      type:Number,
      default:0
    },
    cantidad_solicitada:{
      type:Number,
      default:0
    },
    aprobadoDespues:{
      type:Number,
      default:0
    }
  },
  created(){
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
  },
  mounted(){
    let me = this
    me.cantidadAprobar = me.cantidad_solicitada
  },
  methods:{
    f_aprobar_pago(){
      let me = this
      if(me.cantidadAprobar > 0){
        const { idusuario, id_group } = me.usuario
        let formData = new FormData()
        formData.append('id',                    me.ObjectSelected.id)
        //rechazar
        if(me.estado == 3)                       { formData.append('cantidad_finalizada',   "") }
        //aprobar
        else{                                     formData.append('cantidad_finalizada',  me.cantidadAprobar) }
        formData.append('aprobarSolicitud',      1)
        formData.append('id_pedido',              me.ObjectSelected.id_pedido)
        formData.append('estado',                 me.estado)
        formData.append('observacion_finaliza',   me.observacion)
        formData.append('id_grupo_finaliza',      id_group)
        formData.append('user_finaliza',          idusuario)
        formData.append('aprobadoDespues',        me.aprobadoDespues)
        me.$vs.loading()
        me.$http.post(me.$server_url+'pedidos_gerencia',formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
              title: 'Error',
              text: res.data.message,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-circle'
            })
            return
          }
          me.$vs.notify({
            title: 'Exito',
            text: 'Se ha aprobado la comisión',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
          me.$emit('changeHandle',2)
          //limpiar
          me.observacion = ''
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error + ' error');
        })
      }else{
        me.$vs.notify({
          title: 'Error',
          text: 'Ingrese un valor mayor a 0',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      }
    }
  }
}
</script>
