<template>
  <div>
    <div v-if="menu == 0">
      <vs-button color="primary" class="p-2 ml-5" type="filled"  icon="add" @click="$emit('showCreate',1)">Crear Evidencia</vs-button>
      <vs-table max-items="10" search pagination :data="arraySeveralEvidences">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arraySeveralEvidences.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Valor</vs-th>
            <vs-th>Archivo</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <b>Valor:</b>
                <p>{{tr.valor}}</p>
                <b>Codigo / Nº de documento:</b>
                <p>{{tr.codigo}}</p>
              </vs-td>
              <vs-td>
                <p v-if="!tr.archivo">
                  <b class="text-danger"> Solicitud de evidencias: No subida </b>
                </p>
                <p v-else class="imagen" @click="openDocument(tr)">
                    <b> {{tr.archivo}}:
                        <!--PDF-->
                        <ion-icon v-if="tr.archivo.substr(-3) == 'pdf'" style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                        <!--IMAGE-->
                        <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                    </b>
                 </p>
              </vs-td>
              <vs-td>
                <div style="display: flex;">
                  <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                      <vs-button class="modal-default-button mr-3" size="small" color="success" @click="$emit('showCreate',1,tr)" type="filled" icon-pack="feather" icon="icon-edit"> </vs-button>
                  </vx-tooltip> &nbsp;
                  <vx-tooltip style="display: inline-block;" text="Eliminar" position="top" color="primary">
                      <vs-button class="modal-default-button" size="small" color="danger" @click="ObjectSelect = tr;openConfirm();" type="filled" icon-pack="feather" icon="icon-x-square"> </vs-button>
                  </vx-tooltip> &nbsp;
                </div>
              </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </div>
    <div v-if="menu == 1" :title="'Eliminar Registro '">
      <ConfirmEliminarVue @changeConfirm="changeConfirm" class="mt-5"/>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import PagosRepository from '../../../../../../../repositories/PagoRepository'
const ConfirmEliminarVue = () => import('../../../../../../configuracion/Reutilizable/ConfirmEliminar.vue')
export default {
  components:{
    ConfirmEliminarVue,
  },
  data() {
    return{
      ObjectSelect:'',
      menu:0,
    }
  },
  mounted(){
    let me = this
  },
  props:{
    arraySeveralEvidences:{
      type:Array,
      default:function(){
        return []
      }
    },
    ObjectPadre:{
      type:Object,
      default:function(){
        return {}
      }
    }
  },
  methods:{
    openConfirm(){
      let me = this
        if(me.ObjectPadre.estado != 0){
        me.$vs.notify({
        text:"El registro de pago ya ha sido aprobado o anulado",
        color:'danger',
        iconPack: 'feather',
        icon:'icon-check',
        time:5000
        })
        return
      }
      me.menu = 1
    },
    changeConfirm(e){
      let me = this
      if(e == 0) { me.menu = 0 }
      else { me.eliminarArchivo() }
    },
    eliminarArchivo(){
      let me = this
      let formData = new FormData();
      formData.append('deleteRegistroArchivo',    "yes")
      formData.append('archivoPagoHijo',          'yes')
      formData.append('id',                       me.ObjectSelect.id)
      //informacion
      me.$vs.loading()
      const config = { headers: { 'Content-Type': 'multipart/form-data' } };
      axios.post(this.$data_url + 'api/eliminarValores', formData, config)
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
          me.$vs.notify({
          text:"Se elimino correctamente",
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          PagosRepository.updateValuesVariasEvidencias(me.ObjectPadre.doc_codigo)
          me.$emit('showCreate',0)
          me.menu = 0;
      })
      .catch(function (error) {
          me.$vs.loading.close()
      })
    },
    openDocument(tr){
      let me = this;
      let ruta = me.$data_url+'archivos/pedidos/pagos/'+tr.url
      window.open(ruta,'_blank')
    },
    openLink(tr){
      let ruta = tr.link
      window.open(ruta,'_blank')
    },
  }
}
</script>

