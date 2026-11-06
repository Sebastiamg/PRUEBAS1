<template>
  <div>
    <p class="text-center text-2xl font-bold text-primary" v-if="activadas > 0">{{ activadas }} preguntas activadas</p>
    <div v-if="preguntasInactivas.length > 0">
      <h5 class="text-warning text-center">{{ preguntasInactivas.length }} preguntas se encuentan inactivas</h5>
      <div class="flex justify-center">
        <vs-button color="primary" class="mt-3" @click="ActivarPreguntas()" type="border">Activar Preguntas</vs-button>
      </div>
    </div>
    <vs-table max-items="10" search pagination :data="PreguntasNoIngresadas">
      <template slot="header">
          <vs-chip  color="primary">Cantidad: <b> {{ PreguntasNoIngresadas.length }}</b></vs-chip>
      </template>
      <template slot="thead">
        <vs-th>Pregunta</vs-th>
        <vs-th>Período evaluación</vs-th>
        <vs-th>Estado</vs-th>
        <vs-th>Motivo</vs-th>
      </template>
      <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <span v-html="data[indextr].descripcion"></span>
            </vs-td>
            <vs-td>
              <p v-for="(item,key) in arregloPeriodos" :key="key">
                <span v-if="item.id == tr.n_evaluacion">{{ item.nombre }}</span>
              </p>
            </vs-td>
            <vs-td>
              <vs-chip color="primary" v-if="tr.estado == 1">
                Activo
              </vs-chip>
              <vs-chip color="warning" v-else>
                Desactivado
              </vs-chip>
            </vs-td>
            <vs-td>
              <!-- <p v-for="(item,key) in arregloPreguntas" :key="key">
                <vs-chip color="danger" v-if="item.pregunta.id_pregunta == tr.id_pregunta">Ya existe la pregunta</vs-chip>
              </p> -->
              <p >
                <vs-chip color="danger">Ya existe la pregunta</vs-chip>
              </p>
            </vs-td>
          </vs-tr>
      </template>
    </vs-table>
  </div>
</template>
<script>
export default{
  props:{
    PreguntasNoIngresadas:{
      type:Array,
      default:[],
    },
    arregloPeriodos:{
      type:Array,
      default:[],
    },
    arregloPreguntas:{
      type:Array,
      default:[]
    },
  },
  data(){
    return{
      usuario:[],
      preguntasInactivas:[],
      activadas:0,
    }
  },
  created(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
  },
  mounted(){
    let me  = this;
    me.preguntasInactivas = me.PreguntasNoIngresadas.filter(p => p.estado == 0)
  },
  methods:{
    ActivarPreguntas(){
      let me = this
      let formData = new FormData();
      formData.append('data_preguntas', JSON.stringify(me.preguntasInactivas));
      formData.append('user_created',   me.usuario.idusuario)
      me.$vs.loading()
      this.$http.post(this.$server_url+'salle/ActivarPreguntas', formData)
      .then(res => {
      me.$vs.loading.close()
      if(res.data.status == 0){
        me.$vs.notify({
        text:res.data.message,
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check',
        })
        return
      }
      me.PreguntasNoIngresadas  = res.data.arregloPreguntasActivas
      let msg                   = `Se movio ${res.data.ingresadas}  preguntas correctamente `
      me.$vs.notify({
        text:msg,
        color:'success',
        iconPack: 'feather',
        icon:'icon-check',
        time:4000,
        })
        me.activadas = res.data.ingresadas
        me.preguntasInactivas = []
      })
    },
  },
}
</script>
