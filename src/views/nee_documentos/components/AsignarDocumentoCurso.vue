<template>
  <div>
    <div v-if="menu == '0'">
      <!--ASIGNAR DOCUMENTO-->
      <div style="width: 100%;" class="scroll">
        <div>
            <p class="font-bold letra">Libro:</p>
            <v-select @input="getCursosDocente()" :disabled="desdeLibro == 1 ? true : false" :options="arregloAsignaturas" :reduce="arregloAsignaturas => arregloAsignaturas" label="nombreasignatura" class="w-full" v-model="asignaturaSelect" />
        </div>
        <div style="margin-top: 15px;" >
            <p class="font-bold letra">Cursos:</p>
            <v-select :options="arreglosCurso" :reduce="arreglosCurso => arreglosCurso" label="nombreCurso" class="w-full" v-model="cursoSelect" />
        </div>
        <div class="vx-row mt-4">
          <div class="vx-col sm:w-1/2 w-full">
            <p class="ml-2 letra font-bold">Fecha inicio:</p>
            <flat-pickr :config="configdateTimePicker" v-model="asignar.fecha_inicio"  placeholder="Fecha Inicio" class="m-1 w-full" style="display: inline-block;width: 100%;" />
          </div>
          <div class="vx-col sm:w-1/2 w-full">
            <p class="ml-2 letra font-bold">Fecha fin:</p>
            <flat-pickr :config="configdateTimePicker" v-model="asignar.fecha_fin"  placeholder="Fecha Inicio" class="m-1 w-full" style="display: inline-block;width: 100%;" />
          </div>
        </div>
        <div class="vx-row mt-4">
          <div class="vx-col sm:w-full w-full mb-2">
            <vs-textarea counter="500" label="Observación" :counter-danger.sync="counterDanger" v-model="asignar.observacion" />
          </div>
        </div>
        <div style="margin-top: -5px;" class="flex justify-center">
          <button class="boton">
            <feather-icon icon="SendIcon" svgClasses="h-4 w-4" class="ml-1" style="position: relative;top: 3px;" />
            <span class="ml-1" @click="asignarDocumento()">Asignar al curso</span>
          </button>
        </div>
      </div>
      <!--TABLA ASIGNADOS-->
      <vs-collapse >
        <vs-collapse-item>
          <div slot="header">
            <vs-avatar color="success" icon-pack="feather" icon="icon-airplay" style="position:absolute;bottom:10px;" />
            <span style="margin-left:40px;">Ver cursos asignados</span>
          </div>
          <vs-table max-items="5" search pagination :data="arregloAsignados">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloAsignados.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Curso</vs-th>
                <vs-th>Detalle</vs-th>
                <vs-th>Observación</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                      <b>Código</b>
                      <p>{{ tr.codigo_curso }}</p><br>
                      <b>Asignatura</b>
                      <p>{{ tr.nombreasignatura }}</p><br>
                    </vs-td>
                    <vs-td>
                      <b>Fecha inicio:</b>
                      <p>{{ tr.fecha_inicio }}</p>
                      <b>Fecha fin:</b>
                      <p>{{ tr.fecha_fin }}</p>
                    </vs-td>
                    <vs-td>
                      {{ tr.observacion }}
                    </vs-td>
                    <vs-td>
                      <vs-button color="danger" class="p-2" type="border" @click="asignadoSelect =tr;menu = 1;">
                        <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="ml-1" style="position: relative;top: 3px;" />
                        <span class="ml-1">Eliminar</span>
                      </vs-button>
                    </vs-td>
                </vs-tr>
            </template>
          </vs-table>
        </vs-collapse-item>
       </vs-collapse>

    </div>
    <div v-else>
      <p class="text-center">Estás seguro de eliminar la asignación?</p>
      <div class="vx-row mt-2" style="margin-left:-80px;">
        <div class="vx-col sm:w-2/3 w-full ml-auto">
          <vs-button class="mr-3 mb-2" @click="eliminarAsignacion()">Si, deseo eliminar</vs-button>
          <vs-button color="warning" type="border" class="mb-2" @click="menu = 0;">Cancelar</vs-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import vSelect from 'vue-select';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default{
  components:{
    vSelect,
    flatPickr,
  },
  data(){
    return{
      menu:0,
      arreglosCurso:[],
      arregloAsignados:[],
      asignaturaSelect:'',
      cursoSelect:'',
      asignadoSelect:'',
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d'
      },
      counterDanger: false,
      asignar:{
        id:0,
        // estado:true,
        fecha_inicio:null,
        fecha_fin:null,
        observacion:'',
      },
    }
  },
  props:{
    neetSelect:{
      type:Object,
      default:{}
    },
    arregloAsignaturas:{
      type:Array,
      default:[]
    },
    usuario:{
      type:Array,
      default:[]
    },
    desdeLibro:{
      type:Number,
      default:0,
    },
    desdeCurso:{
      type:Number,
      default:0,
    },
    codigoCurso:{
      type:String,
      default:""
    },
    setidasignatura:{
      type:String,
      default:""
    },
    setnombreasignatura:{
      type:String,
      default:""
    },
  },
  mounted() {
    let me = this;
    me.getCursosAsignados()
    //si ingresa desde el libro
    if(me.desdeLibro == 1){
      me.asignaturaSelect = { idasignatura:me.setidasignatura,nombreasignatura:me.setnombreasignatura }
      me.getCursosDocente()
    }
  },
  methods: {
    getCursosAsignados(){
      let me = this
      this.$http.get(this.$server_url + 'neetTema?getCursosAsignados=yes&idusuario='+me.usuario.idusuario+'&periodo_id='+localStorage.periodo_id+'&neet_upload_id='+me.neetSelect.neet_upload_id)
      .then(function (res) {
        let datos = res.data
        //si ingresa desde el libro
        if(me.desdeLibro == 1){
          me.arregloAsignados = datos.filter(p => p.id_asignatura == me.setidasignatura)
        }
        //si ingresa desde el curso
        if(me.desdeCurso == 1){

        }
        //si ingresa desde el home
        else{
          me.arregloAsignados = res.data
        }
      })
      .catch(function (error) {})
    },
    getCursosDocente() {
      let me = this
      me.arreglosCurso = []
      me.cursoSelect = ""
      if( me.asignaturaSelect == null || me.asignaturaSelect == "" || me.asignaturaSelect == undefined ){
        me.$vs.notify({
        text:'Seleccione una asignatura por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      let formData = new FormData();
      formData.append('id_usuario',     me.usuario.idusuario);
      formData.append('id_asignatura',  me.asignaturaSelect.idasignatura);
      formData.append('periodo_id',     localStorage.periodo_id)
      this.$http.post(this.$server_url+'curso_libro_docente', formData)
      .then(function (res) {
        me.arreglosCurso = res.data
        if(me.arreglosCurso.length == 0){
          me.$vs.notify({
          text:'No tiene cursos asignados a '+me.asignaturaSelect.nombreasignatura,
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
        }
      })
      .catch(function (error) {})
    },
    asignarDocumento(){
      let me = this;
      me.msg = ""
      if(me.neetSelect.neet_upload_id == null || me.neetSelect.neet_upload_id == "" || me.neetSelect.neet_upload_id == undefined){
        me.msg = "Seleccione algun documento para asignar"
        me.f_notificaciones(me.msg, 'warning', 'icon-alert-triangle')
        return
      }
      if(me.asignar.fecha_inicio == null || me.asignar.fecha_inicio == "" || me.asignar.fecha_inicio == undefined){
        me.msg = "Seleccione una fecha inicio por favor"
        me.f_notificaciones(me.msg, 'warning', 'icon-alert-triangle')
        return
      }
      if(me.asignar.fecha_fin == null || me.asignar.fecha_fin == "" || me.asignar.fecha_fin == undefined){
        me.msg = "Seleccione una fecha fin por favor"
        me.f_notificaciones(me.msg, 'warning', 'icon-alert-triangle')
        return
      }
      if(me.asignar.fecha_inicio > me.asignar.fecha_fin){
        me.msg = "La fecha inicio no puede mayor a la fecha fin"
        me.f_notificaciones(me.msg, 'warning', 'icon-alert-triangle')
        return
      }
      let formData = new FormData();
      formData.append('save_AsignarDocumentoCurso', "yes");
      formData.append('codigo_curso',               me.cursoSelect.codigo);
      formData.append('neet_upload_id',             me.neetSelect.neet_upload_id);
      formData.append('idusuario',                  me.usuario.idusuario)
      formData.append('periodo_id',                 localStorage.periodo_id)
      formData.append('id',                         me.asignar.id);
      formData.append('fecha_inicio',               me.asignar.fecha_inicio);
      formData.append('fecha_fin',                  me.asignar.fecha_fin);
      formData.append('observacion',                me.asignar.observacion);
      formData.append('estado',                     1);
      me.$vs.loading()
      this.$http.post(this.$server_url+'neetTema', formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.f_notificaciones(res.data.message, 'danger', 'icon-alert-triangle')
            return
          }
          me.$vs.notify({
            text: res.data.message,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
          me.getCursosAsignados()
          me.limpiar()
          me.cursoSelect = ""
        })
        .catch(function (error) { me.$vs.loading.close() })
    },
    limpiar(){
      let me = this;
      me.cursoSelect          = ""
      me.asignar.id           = 0
      me.asignar.fecha_inicio = null
      me.asignar.fecha_fin    = null
      me.asignar.observacion  = ""
    },
    eliminarAsignacion(){
      let me = this;
      let formData = new FormData();
      formData.append('eliminarAsignacionCurso','yes')
      formData.append('id',                      me.asignadoSelect.id)
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
          me.asignadoSelect = ""
          me.menu           = 0
          me.getCursosAsignados()
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
  },
}
</script>
</script>
<style scoped>
*{
    font-family: sans-serif;
}
div.scroll {
    margin:4px, 4px;
    padding:4px;
    width: 100%;
    height: 85%;
    overflow-x: hidden;
    overflow-y: auto;
    text-align:justify;
}
.letra{
    font-size: 12px;
}
.alto {
    height: 150px;
    display: inline-block;
}
.boton{
    background-color: #1c84c6;
    color: white;
    padding: 10px;
    border-color: #fff!important;
    width: 200px;
    cursor: pointer;
    transition: 0.5s ease-in;
    border: none;
    border-radius: 5px;
}
.boton:hover{
    background-color: #095280;
}
.farchivo{
    margin-bottom: -10px;
    cursor: pointer; color: gray; width: 100%;
    font-size: 11px;
    line-height: 80%;
    transition: 0.5 ease all;
    padding: 10px 10px;
}
.farchivo:hover{
    background-color: #7C7B89;
    color:white;
    border-radius: 5px;
}
</style>
