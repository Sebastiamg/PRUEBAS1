<template>
  <vx-card
  :title="'Listado de Necesidades Educativas'"
  :subtitle="'Asignatura: '+setnombreasignatura"
  >
      <div v-if="menu == '0'">
        <NeetDocenteVue
          v-if="arregloAsignados.length > 0"
          :arregloAsignados="arregloAsignados"
          :arregloTemas="arregloTemas"
          :desdeLibro="1"
          :setidasignatura="setidasignatura"
          :setnombreasignatura="setnombreasignatura"
        />
        <div v-else>
          <vs-alert title="Mensaje" color="rgb(231, 154, 23)" active="true">
            <p>No hay archivos Necesidades Educaivas asignadas a su perfil</p>
          </vs-alert>
        </div>
      </div>
  </vx-card>
</template>
<script>
import NeetDocenteVue from '@/views/home/neet/NeetDocente'
import NeetRepository from '@/repositories/NeetRepository'
export default {
  components:{
    NeetDocenteVue,
  },
  data(){
    return{
      menu:0,
      usuario:[],
      arregloAsignados:[],
      arregloTemas:[],
      setidasignatura:'',
      setnombreasignatura:'',
    }
  },
  created(){
    let me = this
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted() {
    let me = this
    me.getNecesidadesEducativas()
    me.setidasignatura      = localStorage.idasignatura
    me.setnombreasignatura  = localStorage.nombreasignatura
  },
  methods: {
    getNecesidadesEducativas(){
      let me = this
      const { idusuario,institucion_idInstitucion } = me.usuario
      NeetRepository.getNecesidadesEducativasxUsuario(idusuario,institucion_idInstitucion).then( r => { me.arregloAsignados = r.data })
    },
  },
}
</script>
