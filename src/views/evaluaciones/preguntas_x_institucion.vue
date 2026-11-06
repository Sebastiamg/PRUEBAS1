<template>
  <div>
    <div class="mt-5">
      <vs-tabs color="success">
        <vs-tab label="Asignar Preguntas(?)" @click="menu = 0;">
            <AsignarPreguntasVue :arrayInstituciones="arrayInstituciones" :asignaturas="asignaturas" v-if="menu == 0"/>
        </vs-tab>
        <vs-tab label="Listado de Preguntas asignadas" @click="menu = 1;">
            <ListadoPreguntasVue :arrayInstituciones="arrayInstituciones" :asignaturas="asignaturas" v-if="menu == 1"/>
        </vs-tab>
        <vs-tab label="Copiar preguntas por Institución" @click="menu = 2;">
          <TranspasarPreguntasVue :arrayInstituciones="arrayInstituciones" :asignaturas="asignaturas" v-if="menu == 2"/>
      </vs-tab>
      </vs-tabs>
    </div>
  </div>
</template>
<script>
const AsignarPreguntasVue     = () => import('./PreguntasInstituciones/AsignarPreguntas.vue')
const ListadoPreguntasVue     = () => import('./PreguntasInstituciones/ListadoPreguntasAsignadas.vue')
const TranspasarPreguntasVue  = () => import('./PreguntasInstituciones/TranspasarPreguntas.vue')
export default {
  components: {
    AsignarPreguntasVue,
    ListadoPreguntasVue,
    TranspasarPreguntasVue,
  },
  data() {
    return{
      menu:0,
      arrayInstituciones:[],
      asignaturas:[],
    }
  },
  mounted () {
    this.getInstituciones();
    this.f_inicio();
  },
  methods: {
    // Your methods here
    f_inicio() {
      let me = this;
      me.$vs.loading()
      this.$http.get(this.$server_url + 'asignaturasDoc/0').then(res => {
          me.asignaturas = res.data;
          me.$vs.loading.close()
      })
    },
    getInstituciones(){
      let me = this;
      this.$http.get(this.$server_url + 'get_evaluaciones_instituciones?getInstituciones=yes').then(res => {
        me.arrayInstituciones = res.data;
      })
    },
  },
}
</script>
