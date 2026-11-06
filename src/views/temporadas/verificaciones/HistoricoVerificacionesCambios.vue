<template>
  <div>
    <div v-if="menu != 0">
      <vs-button @click="menu = 0;">◄ Regresar</vs-button>
    </div>
    <div v-if="menu == 0">
      <vs-alert color="warning" class="mt-3">
        <p class="text-center font-bold">La venta total ha tenido algunos cambios</p>
      </vs-alert>
      <vs-table max-items="3" search pagination :data="arrayHistoricoChanges">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayHistoricoChanges.length }}</b></vs-chip>
        </template>
        <template slot="thead">
          <vs-th>Valores</vs-th>
          <vs-th>Observación</vs-th>
          <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <b>Valor anterior:</b>
                <p>{{ tr.valor_anterior }}</p>
                <b>Valor nuevo:</b>
                <p>{{ tr.valor_nuevo }}</p>
                <b>Estado:</b> <br><br>
                <vs-chip v-if="tr.estado == 1" color="success">Revisado</vs-chip>
                <vs-chip v-else color="danger">Pendiente por aceptar</vs-chip>
              </vs-td>
              <vs-td>
                <b>Observación:</b>
                <p>{{ tr.observacion }}</p>
                <b>Editor:</b>
                <p>{{tr.editor }}</p>
              </vs-td>
              <vs-td>
                <vs-button v-if="tr.estado == 0" @click="ObjectSelected=tr;menu=1;" color="warning"><i class="fa-regular fa-circle-check"></i> marcar como revisado</vs-button>
              </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
    <!--formulario-->
    <div v-if="menu == 1">
      <vs-alert color="primary" class="mt-3">
        <p>Aqui se guarda un comentario por que la venta total cambio</p>
      </vs-alert>
      <div class="vx-row mb-6 mt-5">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Valor anterior</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" disabled icon-pack="feather" icon="icon-user" icon-no-border v-model="ObjectSelected.valor_anterior" />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Valor nuevo</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input type="text" disabled class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border v-model="ObjectSelected.valor_nuevo" />
        </div>
      </div>
      <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
          <span>Observación (obligatorio)</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border v-model="observacion" />
        </div>
      </div>

      <div class="vx-row">
        <div class="vx-col sm:w-2/3 w-full ml-auto">
          <vs-button class="mr-3 mb-2" @click="aceptarCambioVerificacion();">Guardar</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return{
      menu:0,
      ObjectSelected:'',
      usuario:[],
      observacion:'',
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  props:{
    arrayHistoricoChanges:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  methods:{
    aceptarCambioVerificacion(){
      let me = this;
      //la observacion no puede quedar vacia
      if(me.observacion == ''){
        me.$vs.notify({
          text:'La observación es obligatoria',
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'})
        return
      }
      //la observacion no puede tener menos de 3 caracteres
      if(me.observacion.length < 3){
        me.$vs.notify({
          text:'La observación debe tener al menos 3 caracteres',
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'})
        return
      }
      let formData = new FormData();
      formData.append('user_created', me.usuario.idusuario);
      formData.append('id',           me.ObjectSelected.id);
      formData.append('observacion',  me.observacion);
      me.$vs.loading()
      this.$http.post(this.$server_url+'aceptarCambioVerificacion', formData)
      .then(res => {
      me.$vs.loading.close()
      if(res.data.status == 0){
        me.$vs.notify({
          text:res.data.message,
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'})
        return
      }
      me.$vs.notify({
        text:res.data.message,
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
      me.menu  = 0
      me.$emit('changeRecharge',true)
    }
  }
}
</script>
