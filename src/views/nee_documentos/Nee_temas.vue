<template>
  <vs-card
  title="Temas"
  title-color="primary"
  >
      <div>
        <vs-table pagination max-items="25" search :data="arregloTemas">
          <template slot="header">
            <div style="display:flex;">
              <vs-chip color="success" style="font-size:12px;">
                 Cantidad: {{arregloTemas.length}}
              </vs-chip>
              <!-- <vs-button color="warning" type="line" icon="description"  size="small" class="mr-5 ml-3" style="font-size: 14px;" @click="activePrompt=true;">Exportar</vs-button> -->
              <vs-button type="line" icon="save" @click="popupAgregar = true;limpiar();title='Agregar Tema'">Añadir tema</vs-button>
            </div>
          </template>
          <template slot="thead">
              <vs-th sort-key="nombre">Nombre</vs-th>
              <vs-th sort-key="nombre">Estado</vs-th>
              <vs-th sort-key="nombre">Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td :data="data[indextr].nombre">
                    <b>Tema:</b>
                    <p>{{ tr.nombre }}</p>
                  </vs-td>
                  <vs-td :data="data[indextr].estado">
                      <vs-chip v-if="tr.estado == 1" color="success">
                          Activado
                      </vs-chip>
                        <vs-chip v-else color="danger">
                          Desactivado
                      </vs-chip>
                  </vs-td>
                  <vs-td :data="data[indextr].nombre">
                    <div class="flex">
                      <vx-tooltip class="ml-3" style="display: inline-block;" text="Editar" position="top" color="success">
                        <vs-button size="small" class="modal-default-button" color="warning" @click="openEditar(data[indextr]);title='Editar Tema';" type="line" icon-pack="feather" icon="icon-edit">
                        </vs-button>
                      </vx-tooltip>
                      <vx-tooltip class="ml-3" style="display: inline-block;" text="Eliminar" position="top" color="success">
                        <vs-button size="small" class="modal-default-button" color="danger" @click="openConfirm(data[indextr])" type="line" icon-pack="feather" icon="icon-trash">
                        </vs-button>
                      </vx-tooltip>
                    </div>
                  </vs-td>
              </vs-tr>
          </template>
        </vs-table>
      </div>
      <!--MODAL PARA AGREGAR-->
      <vs-popup classContent="popup-example" :title="title" :active.sync="popupAgregar">
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Nombre tema</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <vs-input class="w-full" icon-pack="feather" icon="icon-align-justify" icon-no-border v-model="tema.nombre" />
          </div>
        </div>
        <div class="vx-row mb-6">
          <div class="vx-col sm:w-1/3 w-full">
            <span>Estado</span>
          </div>
          <div class="vx-col sm:w-2/3 w-full">
            <div>
              <vs-radio class="mr-2" v-model="tema.estado" vs-name="radios1estado" vs-value="1">Activo</vs-radio>
              <vs-radio v-model="tema.estado" vs-name="radios1estado" vs-value="0">Inactivo</vs-radio>
            </div>
          </div>
        </div>
        <div class="vx-row">
          <div class="vx-col sm:w-2/3 w-full ml-auto">
            <vs-button class="mr-3 mb-2"  @click="guardarTema()">{{ title }}</vs-button>
            <vs-button color="warning" type="border" class="mb-2" @click="popupAgregar = false;">Cancelar</vs-button>
          </div>
        </div>
      </vs-popup>
  </vs-card>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
export default {
  data(){
    return{
      id:0,
      usuario:[],
      arregloTemas:[],
      popupAgregar:false,
      title:'',
      tema:{
        nombre:'',
        estado:1,
      },
    }
  },
  mounted(){
    let me = this;
    me.getTemas()
  },
  methods:{
    getTemas(){
      let me = this
      me.$vs.loading()
      this.$http.get(this.$server_url+`neetTema?listadoTemas=yes`).then(res => {
        me.$vs.loading.close()
        me.arregloTemas = res.data;
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error)
        })
    },
    //para guardar las areas
    guardarTema(){
      let me = this;
      //datos que se obtienen de los inputs
      if(me.tema.nombre == ''){
        this.$vs.notify({
          text:'Debe escribir un nombre de tema',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
        return;
      }
      let formData = new FormData();
      formData.append('save_temas',   "yes");
      formData.append('id',           me.id)
      formData.append('nombre',       me.tema.nombre);
      formData.append('estado',       me.tema.estado)
      formData.append('user_created', me.usuario.idusuario)
      me.$vs.loading()
      this.$http.post(this.$server_url+'neetTema', formData)
        .then(function (res) {
          me.$vs.loading.close()
          me.$vs.notify({
            text: res.data.message,
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.getTemas()
          me.popupAgregar = false
        })
        .catch(function (error) { me.$vs.loading.close() })
    },
    openEditar(tr){
      let me = this
      me.id                 = tr.id
      me.tema.nombre        = tr.nombre
      me.tema.estado        = tr.estado
      me.popupAgregar = true;
    },
    openConfirm(tr){
      let me = this
      me.id           = tr.id
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        title: `Confirmar`,
        acceptText:'Si, deseo eliminar',
        cancelText:'Cancelar',
        text: 'Estas seguro de eliminar?',
        accept:this.eliminar
      })
    },
    eliminar(){
      let me = this;
      let formData = new FormData();
      formData.append('eliminar_tema','yes')
      formData.append('id',           me.id)
      me.$vs.loading()
      this.$http.post(this.$server_url+'neetEliminar', formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
              text: res.data.message,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-triangle',
              time:5000
            })
            return
          }
          me.$vs.notify({
            text: "Se elimino correctamente",
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.id = 0
          me.getTemas()
        })
        .catch(function (error) { me.$vs.loading.close() })
    },
    limpiar(){
      let me                      = this;
      me.generar                  = false
      me.id                       = 0
      me.tema.nombre              = ''
      me.tema.estado              = '1'
    },
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  components: {
    'v-select': vSelect,
  },
}
</script>
<style>
#botonreporte{
  display:none;
}
#botonexcel{
  display:none;
  margin:0 10px;
}
</style>
