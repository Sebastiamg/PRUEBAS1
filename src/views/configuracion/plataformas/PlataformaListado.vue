<template>
  <div>
    <div>
      <vs-button color="primary" class="p-2" type="filled" icon="add" @click="$emit('showCreate',1)">Crear Plataforma</vs-button>
      <vs-table max-items="10" search pagination :data="arrayPlataformas">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayPlataformas.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Enlace</vs-th>
            <vs-th>Archivo</vs-th>
            <vs-th>Estado</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <b>Nombre:</b>
                <p>{{tr.nombre}}</p>
                <b>Enlace:</b>
                <p class="text-primary cursor-pointer" style="text-decoration: underline;" @click="openLink(tr)">{{tr.link}}</p>
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
                  <vs-chip v-if="tr.estado == 1" color="success">Activo</vs-chip>
                  <vs-chip v-else color="danger">Inactivo</vs-chip>
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
  </div>
</template>
<script>
import axios from 'axios'
export default {
  data() {
    return{
      ObjectSelect:'',
    }
  },
  mounted(){
    let me = this
  },
  props:{
    arrayPlataformas:{
      type:Array,
      default:function(){
        return []
      }
    },
  },
  methods:{
    openConfirm(){
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        title: `Confirm`,
        acceptText:'Si, deseo eliminar',
        cancelText:'Cancelar',
        text: 'Estás seguro de eliminar?',
        accept:this.eliminarArchivo
      })
    },
    eliminarArchivo(){
      let me = this
      let formData = new FormData();
      formData.append('deleteRegistroArchivo',    "yes")
      formData.append('archivoPlataforma',        'yes')
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
          me.$emit('showCreate',0)
      })
      .catch(function (error) {
          me.$vs.loading.close()
      })
    },
    openDocument(tr){
      let me = this;
      let ruta = me.$data_url+'archivos/configuracion/plataforma/'+tr.url
      window.open(ruta,'_blank')
    },
    openLink(tr){
      let ruta = tr.link
      window.open(ruta,'_blank')
    },
  }
}
</script>

