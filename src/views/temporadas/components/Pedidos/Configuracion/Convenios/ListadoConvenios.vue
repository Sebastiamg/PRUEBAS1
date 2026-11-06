<template>
  <div>
    <vs-alert color="primary">Listado de pagos aprobados de tipo convenio</vs-alert>
    <vs-table :data="arrayAgreements" v-if="menu == 0" class="mt-2">
      <template slot="thead">
        <vs-th width="10%">Convenio #</vs-th>
        <vs-th>Datos</vs-th>
        <vs-th>Valor</vs-th>
        <vs-th v-if="showSuggested">Valor sugerido</vs-th>
        <vs-th v-if="!showSuggested && groupFacturador">Acciones</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            {{ indextr + 1  }}
          </vs-td>
          <vs-td>
            #{{ tr.doc_codigo}} <br>
            <b>Contrato:</b>
            <p>{{ tr.ven_codigo }}</p>
            <b>Fecha creación:</b>
            <p>{{ tr.doc_fecha | fecha }}</p>
            <b>Estado:</b>
            <p>
              <vs-chip color="primary" v-if="tr.estado == 1">Cerrado</vs-chip>
              <vs-chip color="danger" v-else>Pendiente Cerrar</vs-chip>
            </p>
          </vs-td>
          <vs-td :data="tr.doc_valor">
            <b>Valor:</b>
            <p>{{ tr.doc_valor | filtrarDecimal }}</p>
          </vs-td>
          <vs-td v-if="showSuggested">
            <p class="text-success">{{ tr.valueSuggested | filtrarDecimal }}</p>
          </vs-td>
          <vs-td v-if="!showSuggested && groupFacturador">
            <vs-dropdown vs-custom-content vs-trigger-click v-if="datosConvenio.estado == 1">
              <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
              <vs-dropdown-menu style="width: 320px;" class="cursor informacionformhijo3">
                <!--CONTRATO ABIERTO (estado == 0)-->
                <div v-if="tr.estado == 0">
                  <vs-dropdown-item>
                    <vs-button color="success" @click="convenioSelect=tr;confirmCerrarContrato(tr);" type="line" icon-pack="feather" icon="icon-check" class="w-full">Cerrar</vs-button>
                  </vs-dropdown-item>
                  <vs-dropdown-item>
                    <vs-button color="warning" type="line" @click="convenioSelect=tr;$emit('changeRecharge',2,tr);" icon-pack="feather" icon="icon-edit" class="w-full">Editar</vs-button>
                  </vs-dropdown-item>
                  <!-- <vs-dropdown-item>
                    <vs-button color="danger" type="line" icon-pack="feather" icon="icon-x" class="w-full" @click="convenioSelect=tr;menu = 1;">Eliminar</vs-button>
                  </vs-dropdown-item> -->
                </div>
                <!--CONTRATO CERRADO (estado == 1)-->
                <div v-if="tr.estado == 1">
                  <vs-dropdown-item>
                    <vs-button color="primary" icon-pack="feather" icon="icon-settings" type="line" class="w-full" @click="convenioSelect=tr;confirmReabrirContrato(tr)">Reabrir</vs-button>
                  </vs-dropdown-item>
                </div>
              </vs-dropdown-menu>
            </vs-dropdown>
            <p class="mt-3"></p>
            <div v-if="tr.fecha_cierre">
              <b>Fecha último cierre:</b>
              <p>{{ tr.fecha_cierre }}</p>
            </div>
            <div v-if="tr.user_cierre_nombre">
              <b>Responsable:</b>
              <p>{{ tr.user_cierre_nombre }}</p>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    <vx-card v-if="menu == 1" :title="'Eliminar pago divido del contrato '+convenioSelect.ven_codigo">
      <ConfirmEliminarVue @changeConfirm="changeConfirm"/>
    </vx-card>
  </div>
</template>
<script>
const ConfirmEliminarVue = () => import('../../../../../configuracion/Reutilizable/ConfirmEliminar.vue')
// import ConfirmEliminarVue from '../../../../../configuracion/Reutilizable/ConfirmEliminar.vue';
export default {
  components:{
    ConfirmEliminarVue,
  },
  data(){
    return{
      menu:0,
      convenioSelect:'',
    }
  },
  props:{
    datosConvenio:{
      type:Object,
      default:function(){
        return {}
      }
    },
    usuario:{
      type:Object,
      default:function(){
        return {}
      }
    },
    idConvenio:{
      type:Number,
      default:0,
    },
    arrayAgreements:{
      type:Array,
      default:function(){
        return []
      }
    },
    showSuggested:{
      type:Boolean,
      default:false,
    },
    setAnticipoGlobal:{
      type:Number,
      validator(value){
      return value%1!==0
      }
    },
    groupFacturador:{
      type:Boolean,
      default:false,
    },
    datosInstitucion:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  watch:{
    showSuggested(results){
      this.showSuggested = results
    },
    arrayAgreements(results){
      this.arrayAgreements = results
    }
  },
  mounted(){
    let me = this
  },
  methods:{
    changeConfirm(e){
      let me = this
      if(e == 0) { me.menu = 0 }
      else { me.eliminarConveniohijo() }
    },
    eliminarConveniohijo(){
      let me = this
      let formData = new FormData();
      formData.append('eliminarHijoConvenio', 'yes')
      formData.append('id',                   me.convenioSelect.doc_codigo);
      formData.append('user_created',         me.usuario.idusuario)
      formData.append('idConvenio',           me.idConvenio)
      this.$http.post(this.$server_url+'eliminarConvenio', formData)
      .then(res => {
        if(res.data.status == 0){
          me.$vs.notify({
          text:res.data.message,
          color:'danger',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.menu = 0;
        me.$emit('changeRecharge',1)
        me.$vs.notify({
          text:'Se elimino con éxito',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
      })
      .catch((e)=>{
        // me.$vs.loading.close()
      })
    },
    confirmCerrarContrato(tr){
      let me = this
      this.$vs.dialog({
        type:'confirm',
        color: 'success',
        title: `Confirmar`,
        acceptText:'Si, deseo cerrar el pago del contrato',
        cancelText:'Cancelar',
        text: 'Estás seguro de cerrar el pago del contrato?',
        accept:this.cerrarContrato
      })
    },
    cerrarContrato(){
      let me = this
      let formData = new FormData()
      formData.append('cerrarContratoConvenio', 'yes')
      formData.append('doc_codigo',             me.convenioSelect.doc_codigo)
      formData.append('user_created',           me.usuario.idusuario)
      formData.append('idConvenio',             me.idConvenio)
      me.$vs.loading()
      this.$http.post(this.$server_url+'convenio', formData)
      .then(function (res) {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({ text:res.data.message, color:'warning', iconPack:'feather', icon:'icon-alert-triangle', time:5000 })
          return
        }
        me.$vs.notify({ text:'Contrato cerrado correctamente', color:'success', iconPack:'feather', icon:'icon-check' })
        me.$emit('changeRecharge',1)
      })
      .catch(function () { me.$vs.loading.close() })
    },
    confirmReabrirContrato(tr){
      let me = this
      this.$vs.dialog({
        type:'confirm',
        color: 'primary',
        title: `Confirmar`,
        acceptText:'Si, deseo reabrir el pago del contrato',
        cancelText:'Cancelar',
        text: 'Estás seguro de reabrir el contrato?',
        accept:this.reabrirContrato
      })
    },
    reabrirContrato(){
      let me = this
      let formData = new FormData()
      formData.append('reabrirContratoConvenio', 'yes')
      formData.append('doc_codigo',              me.convenioSelect.doc_codigo)
      formData.append('user_created',            me.usuario.idusuario)
      formData.append('idConvenio',              me.idConvenio)
      me.$vs.loading()
      this.$http.post(this.$server_url+'convenio', formData)
      .then(function (res) {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.$vs.notify({ text:res.data.message, color:'warning', iconPack:'feather', icon:'icon-alert-triangle', time:5000 })
          return
        }
        me.$vs.notify({ text:'Contrato reabierto correctamente', color:'success', iconPack:'feather', icon:'icon-check' })
        me.$emit('changeRecharge',1)
      })
      .catch(function () { me.$vs.loading.close() })
    },
  }
}
</script>
<style>
.informacionformhijo3 {
    z-index: 51003;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
