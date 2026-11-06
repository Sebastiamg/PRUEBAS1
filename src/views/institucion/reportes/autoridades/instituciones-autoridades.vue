<template>
  <div>
    <div>
        <vs-table stripe max-items="10" search pagination :data="arrayTodo">
          <template slot="header">
              <vs-chip color="success" transparent>Cantidad: <b> {{ arrayTodo.length }}</b></vs-chip>
              <vs-button color="success" v-if="arrayTodo.length > 0"  class="mb-2 p-3 ml-3" @click="exportar"><i class="fa-solid fa-download"></i> Exportar</vs-button>
          </template>
          <template slot="thead">
              <vs-th width="250">Usuario</vs-th>
              <vs-th width="150">Autoridad</vs-th>
          </template>
          <template slot-scope="{data}">
              <vs-tr :data="item" :key="indextr" v-for="(item, indextr) in data">
                  <vs-td>
                      {{ item.nombres }} {{ item.apellidos }}<br>
                      <b>Fecha de nacimiento:</b>
                      <p>{{ item.fecha_nacimiento }}</p>
                      <b>Email:</b>
                      <p>{{ item.email }}</p>
                      <b>Cédula:</b>
                      <p>{{ item.cedula }}</p>
                  </vs-td>
                  <vs-td>
                    {{ item.cargo }}<br>
                  </vs-td>
              </vs-tr>
          </template>
      </vs-table>
    </div>
  </div>
</template>
<script>
import Codigosmix from "@/mixins/Codigosmix";
export default{
  mixins: [Codigosmix],
  data(){
    return{
      arrayInstitucionesAutoridades:[],
      arrayTodo:[],
      usuario:[],
    }
  },
  props:{
    institucionSelected:{
      type:Number,
      default:function(){
        return 0
      }
    },
    nombreInstitucion:{
      type:String,
      default:function(){
        return ''
      }
    }
  },
  created(){
    this.usuario = JSON.parse(localStorage.getItem('usuario'))
    this.getReporte()
  },
  methods:{
    getReporte(){
      let me = this;
      // me.arrayInstitucionesAutoridades = []
      me.arrayTodo = []
      me.$vs.loading()
      this.$http.get(this.$server_url + `metodosGetInstitucion?action=Get_Autorizades_Institucion&institucion_id=${this.institucionSelected}`)
        .then(function (response) {
          me.$vs.loading.close()
          // me.arrayInstitucionesAutoridades = response.data.agrupados;
          me.arrayTodo = response.data.todos;
          if(me.arrayTodo.length == 0){
            me.$vs.notify({
              text: 'No hay instituciones con autoridades',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-check'
            })
          }
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error + ' error');
          me.$vs.notify({
            title: 'Error',
            text: 'Error al cargar los datos',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
        })
    },
     exportar() {
      let me = this;
      let nameFile = 'Reporte_Autoridades_'+me.nombreInstitucion
      let headers = ['Institución','Nombres','Apellidos','Email','Autoridad','Fecha de nacimiento','Cédula'];
      let fieldKeys = ['nombreInstitucion','nombres','apellidos','email','cargo','fecha_nacimiento','cedula'];
      me.m_exportTodo(headers, fieldKeys, me.arrayTodo, nameFile);
    },
  }
}
</script>
