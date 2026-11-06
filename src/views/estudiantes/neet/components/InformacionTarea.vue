<template>
  <div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Fecha inicio:</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <flat-pickr :config="configdateTimePicker" v-model="asignar.fecha_inicio"  placeholder="Fecha Inicio" class="m-1 w-full" style="display: inline-block;width: 100%;" />
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Fecha fin:</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <flat-pickr :config="configdateTimePicker" v-model="asignar.fecha_fin"  placeholder="Fecha Inicio" class="m-1 w-full" style="display: inline-block;width: 100%;" />
        </div>
    </div>
    <div class="vx-row mb-6">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Observación</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <vs-textarea counter="500" label="Observación" :counter-danger.sync="counterDanger" v-model="asignar.observacion" />
        </div>
    </div>
    <div class="vx-row">
        <div class="vx-col sm:w-2/3 w-full ml-auto">
        <vs-button class="mr-3 mb-2" @click="guardarAsignacion(1)" v-if="asignar.estado">Guardar</vs-button>
        <!-- <vs-button class="mr-3 mb-2" @click="guardarAsignacion(0)" color="warning" v-else>Desactivar recurso</vs-button> -->
        <vs-button color="warning" type="border" class="mb-2" @click="$emit('changeRecharge','1')">Cancelar</vs-button>
        </div>
    </div>
  </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default{
  components:{
    flatPickr,
  },
  data(){
    return{
      asignar:{
        id:0,
        estado:true,
        fecha_inicio:null,
        fecha_fin:null,
        observacion:'',
      },
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d H:i:s'
      },
      counterDanger: false,
    }
  },
  props:{
    tarea:{
      type:Object,
      default:{},
    },
    usuario:{
      type:Object,
      default:{},
    },
    codigoCurso:{
      type:String,
      default:'',
    },
  },
  mounted() {
    let me = this
    me.setEditar()
  },
  methods:{
    setEditar(){
      let me = this;
      me.asignar.id             = me.tarea.id
      me.asignar.estado         = me.tarea.estado
      me.asignar.fecha_inicio   = me.tarea.fecha_inicio
      me.asignar.fecha_fin      = me.tarea.fecha_fin
      me.asignar.observacion    = me.tarea.observacion
    },
    guardarAsignacion(est){
      let me = this;
      let formData = new FormData();
      if(me.asignar.fecha_inicio == null || me.asignar.fecha_inicio == "" || me.asignar.fecha_inicio == undefined){
        me.$vs.notify({
        text:'Seleccione una fecha inicio por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      if(me.asignar.fecha_fin == null || me.asignar.fecha_fin == "" || me.asignar.fecha_fin == undefined){
        me.$vs.notify({
        text:'Seleccione una fecha inicio por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      if(me.asignar.fecha_inicio > me.asignar.fecha_fin){
        me.$vs.notify({
        text:'La fecha inicio no puede mayor a la fecha fin',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      formData.append('saveGuardaTarea',"yes")
      formData.append('id',             me.asignar.id);
      formData.append('neet_upload_id', me.tarea.neet_upload_id);
      formData.append('periodo_id',     localStorage.periodo_id);
      formData.append('codigo_curso',   me.codigoCurso);
      formData.append('fecha_inicio',   me.asignar.fecha_inicio);
      formData.append('fecha_fin',      me.asignar.fecha_fin);
      formData.append('observacion',    me.asignar.observacion);
      formData.append('estado',         est);
      formData.append('idusuario',      me.usuario.idusuario)
      me.$vs.loading()
      this.$http.post(this.$server_url+'neetTema', formData)
      .then(res => {
      me.getRecurso();
      me.$vs.loading.close()
      me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
      })
      me.$emit('changeRecharge','2')
    },
  }
}
</script>
