<template>
  <div>
    <div>
      <div class="vx-row mb-6">
        <div class="vx-col w-full">
        <vs-input class="w-full" icon-pack="feather" @input="validateInput" :icon="icono" icon-no-border label="Porcentaje total de la comisión (ejemplo: 43%)" v-model="solicitud.valor" />
        </div>
      </div>
      <div class="vx-row mb-6">
          <div class="vx-col w-full">
          <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Observación(Opcional)" v-model="solicitud.observacion" />
          </div>
      </div>
      <div class="flex justify-center">
        <vs-button class="mr-3 mb-2" icon-pack="feather" icon="icon-save" @click="guardarSolicitud()">Solicitar</vs-button>
        <vs-button color="warning" @click="$emit('changeHandle',0);" icon-pack="feather" icon="icon-x" type="border" class="mb-2">Cancelar</vs-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
      usuario:[],
      solicitud:{
        valor:'',
        observacion:'',
        estado:0,
      },
      icono:'icon-percent'
    }
  },
  props:{
    pedido:{
      type:Object,
      default:function(){
        return {}
      }
    },
    id:{
      type:Number,
      default:0
    },
    ObjectSelected:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem('usuario'))
  },
  mounted(){
    let me = this
    me.start()
  },
  methods:{
    start(){
      let me = this
      //guardar
      if(me.id == 0){

      }
      //editar
      if(me.id > 0){
        me.solicitud.valor        = me.ObjectSelected.cantidad_solicitada
        me.solicitud.observacion  = me.ObjectSelected.observacion
        me.solicitud.estado       = me.ObjectSelected.estado
      }
    },
    guardarSolicitud(){
      //API POST
      let me = this
      if(me.solicitud.valor == ''){
        me.$vs.notify({
        text:'Debe ingresar un valor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-x'})
        return
      }
      //no puede ser menor a 10 ni mayor al 100%
      if(parseFloat(me.solicitud.valor) < 10){
        me.$vs.notify({
        text:'El valor solicitado no puede ser menor a 10',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-x'})
        return
      }
      if(parseFloat(me.solicitud.valor) > 100){
        me.$vs.notify({
        text:'El valor solicitado no puede ser mayor a 100%',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-x'})
        return
      }
      let formData = new FormData();
      formData.append('id',                   me.id);
      formData.append('saveSolicitud',        1);
      formData.append('id_pedido',            me.pedido.id_pedido);
      formData.append('tipo',                 0);
      formData.append('cantidad_solicitada',  me.solicitud.valor);
      formData.append('estado',               me.solicitud.estado);
      // formData.append('periodo_id',           me.pedido.id_periodo);
      formData.append('user_created',         me.usuario.idusuario);
      formData.append('observacion',          me.solicitud.observacion);
      me.$vs.loading()
      this.$http.post(this.$server_url+'pedidos_gerencia', formData)
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
        me.$emit('changeHandle',1)
      })
      .catch(function (error) {
        me.$vs.loading.close()
        console.log(error + ' error');
      })
    },
    validateInput() {
      // Reemplazar todo lo que no sea dígito, punto decimal o coma con una cadena vacía
      this.solicitud.valor = this.solicitud.valor.replace(/[^0-9,.]/g, '');

      // Reemplazar comas por puntos
      this.solicitud.valor = this.solicitud.valor.replace(/,/g, '.');

      // Permitir solo un punto decimal
      const dotIndex = this.solicitud.valor.indexOf('.');
      if (dotIndex !== -1) {
        // Si hay más de un punto, conserva solo el primer segmento antes del punto
        const beforeDot = this.solicitud.valor.substring(0, dotIndex);
        const afterDot = this.solicitud.valor.substring(dotIndex + 1);
        this.solicitud.valor = beforeDot + '.' + afterDot.replace('.', '');
      }

      // Si el valor comienza con un punto, añadir un 0 delante
      if (this.solicitud.valor.startsWith('.')) {
        this.solicitud.valor = '0' + this.solicitud.valor;
      }

      // Si el valor empieza con 0 seguido de un dígito diferente de punto, eliminar el 0 inicial
      if (this.solicitud.valor.length > 1 && this.solicitud.valor.startsWith('0') && !this.solicitud.valor.startsWith('0.')) {
        this.solicitud.valor = this.solicitud.valor.substring(1);
      }

      // Si el valor termina con un punto, no permitir que continúe
      if (this.solicitud.valor.endsWith('.')) {
        this.solicitud.valor = this.solicitud.valor.slice(0, -1);
      }
    }
  },
}
</script>
