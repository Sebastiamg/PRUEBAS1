<template>
  <div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Docentes asignados</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <v-select :options="arregloDocentes" multiple :reduce="arregloDocentes => arregloDocentes" label="nombre_completo" class="w-full" v-model="docentesAsignadosSelect" />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Documento</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input type="email" class="w-full" disabled icon-pack="feather" icon="icon-file" icon-no-border v-model="objectNecesidad.documento" />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Tema</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input class="w-full" icon-pack="feather" disabled  icon="icon-smartphone" icon-no-border v-model="objectNecesidad.tema" />
      </div>
    </div>
    <div class="vx-row mb-6">
      <div class="vx-col sm:w-1/3 w-full">
        <span>Nivel</span>
      </div>
      <div class="vx-col sm:w-2/3 w-full">
        <vs-input type="text" class="w-full" disabled icon-pack="feather" icon="icon-bookmark" icon-no-border v-model="objectNecesidad.subnivel" />
      </div>
    </div>
    <div class="vx-row">
      <div class="vx-col sm:w-2/3 w-full ml-auto flex">
        <vs-button class="mr-3 mb-2" icon-pack="feather" icon="icon-save" @click="asignarDocumento()">Asignar</vs-button>
        <vs-button color="warning" type="border" class="mb-2" @click="$emit('changeRecharge','1')">Cancelar</vs-button>
      </div>
    </div>
  </div>
</template>
<script>
import UserRepository from '../../../../repositories/UserRepository';
import vSelect from 'vue-select'
export default{
  components:{
    vSelect,
  },
  data(){
    return{
      usuario:[],
      arregloDocentes:[],
      docentesAsignadosSelect:[],
      msg:'',
    }
  },
  props:{
    objectNecesidad:{
      type:Object,
      default:{}
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me = this
    me.getUsuarios()
    me.getAsignados()
  },
  methods:{
    getUsuarios(){
      let me = this;
      me.$vs.loading()
      UserRepository.getUsuariosXRolxInstitucion(6,me.usuario.institucion_idInstitucion).then(p => {
        me.$vs.loading.close()
        me.arregloDocentes = p.data
      })
    },
    getAsignados() {
      let me = this;
      me.arregloAsignados                 = []
      let periodo                         = localStorage.periodo_id
      const { neet_upload_id }            = me.objectNecesidad
      const { institucion_idInstitucion } = me.usuario
      this.$http.get(this.$server_url + 'neetTema?getDocentesXDocumento=yes&periodo_id='+periodo+'&institucion_id='+institucion_idInstitucion+'&neet_upload_id='+neet_upload_id)
        .then(res => {
          if(res.data.length > 0) me.docentesAsignadosSelect = res.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    asignarDocumento(){
      let me = this;
      me.msg = ""
      if(me.objectNecesidad.neet_upload_id == null || me.objectNecesidad.neet_upload_id == "" || me.objectNecesidad.neet_upload_id == undefined){
        me.msg = "Selecccione algun documento para asignar"
        me.f_notificaciones(me.msg, 'warning', 'icon-alert-triangle')
        return
      }
      //setear idusuarios
      const asignados = me.docentesAsignadosSelect.map(({ idusuario}) => ({ idusuario }))
      let formData = new FormData();
      formData.append('asignarDocentes',  "yes");
      formData.append('docentes',         JSON.stringify(asignados))
      formData.append('neet_upload_id',   me.objectNecesidad.neet_upload_id);
      formData.append('user_created',     me.usuario.idusuario)
      formData.append('institucion_id',   me.usuario.institucion_idInstitucion)
      formData.append('periodo_id',       localStorage.periodo_id)
      formData.append('id_group',         6)
      me.$vs.loading()
      this.$http.post(this.$server_url+'neetTema', formData)
        .then(function (res) {
          me.$vs.loading.close()
          me.$vs.notify({
            text: "Se asigno correctamente",
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.$emit('changeRecharge','1')
        })
        .catch(function (error) { me.$vs.loading.close() })
    },
    f_notificaciones(msj, color, icono) {
      let me = this;
      me.$vs.notify({
        text: msj,
        color: color,
        iconPack: 'feather',
        icon: icono
      })
      return;
    },
  }
}
</script>
