<template>
  <div>
    <!--boton regresar-->
    <vs-button v-if="menu != 0" @click="menu = 0;"><i class="fa-solid fa-arrow-left"></i> <span class="ml-2">Regresar</span> </vs-button>
    <br>
    <vx-card title="Seleccione el cliente para facturar" v-if="menu == 1">
      <div class="vx-row">
        <div class="vx-col w-full">
          <!--grupo 33 => libreria-->
          <tableFiltroUsuarioVue @changeDirector="changeHandleUsuario" :grupoEspecifico="Number(1)" :grupo="Number(33)" />
        </div>
      </div>
      <div class="vx-row">
        <div class="vx-col w-full">
          <!--button Guardar-->
          <vs-button @click="actalizarDatos()" icon="save" color="primary" class="mt-4 w-full">Actualizar Representante</vs-button>
        </div>
      </div>
    </vx-card>
    <vx-card class="mt-2" :title="'Informacion Institución'" v-if="menu == 0">
      <vs-button @click="menu = 1;"><i class="fa-solid fa-user"></i> <span class="ml-2">Agregar representante</span> </vs-button>
      <vs-table max-items="10" search pagination :data="arrayLibrerias">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arrayLibrerias.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Nombre</vs-th>
            <vs-th>Representante</vs-th>
            <vs-th>Estado</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                {{data[indextr].nombreInstitucion}}<br>
              </vs-td>
              <vs-td>
                <div v-if="tr.representante">
                  <p>{{ tr.representante.nombres }} {{ tr.representante.apellidos }}</p>
                </div>
                <div v-else>
                  <p class="text-danger">No tiene representante</p>
                </div>
              </vs-td>
              <vs-td>
                  <vs-chip v-if="tr.estado_idEstado == 1" color="success">Activo</vs-chip>
                  <vs-chip v-else color="danger">Inactivo</vs-chip>
              </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </vx-card>
  </div>
</template>
<script>
const tableFiltroUsuarioVue = () => import('../../../../usuarios/tipos/components/tableFiltroUsuario.vue')
import FacturacionRepository from '../../../../../repositories/FacturacionRepository'
export default {
  components:{
    tableFiltroUsuarioVue,
  },
  data() {
    return{
      userSelected:'',
      arrayLibrerias:[],
      menu:0,
    }
  },
  props:{
    ObjectSelected:{
      type:Object,
      default:()=>{}
    }
  },
  mounted(){
    this.getDatosInstitucion()
  },
  methods:{
    getDatosInstitucion(){
      FacturacionRepository.getDatoLibreria(this.ObjectSelected.id_despacho).then(r => { this.arrayLibrerias = r.data })
    },
    changeHandleUsuario(e){
      let me = this
      me.userSelected = e
    },
    actalizarDatos(){
      let me = this
      if(me.userSelected.idusuario == undefined || me.userSelected.idusuario == null || me.userSelected.idusuario == ""){
        me.$vs.notify({
          title: 'Advertencia',
          text: 'Seleccione un representante',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        });
        return
      }
      let formData = new FormData()
      formData.append('actualizarDatosFactura',   '1')
      formData.append('idrepresentante',          me.userSelected.idusuario)
      formData.append('id',                       me.ObjectSelected.id_despacho)
      me.$vs.loading();
      this.$http.post(this.$server_url+'datosFactura/datosFactura',formData)
      .then(function (res) {
          me.$vs.loading.close();
          me.$vs.notify({
              title: 'Exito',
              text: 'Datos actualizados',
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-alert-circle'
          });
          me.getDatosInstitucion()
          me.menu = 0
      })
      .catch(function (error) {
          me.$vs.loading.close();
          me.$vs.notify({
              title: 'Error',
              text: 'Error al actualizar los datos',
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-circle'
          });
      })
    }
  }
}
</script>
