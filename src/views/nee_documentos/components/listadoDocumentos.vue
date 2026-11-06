<template>
  <div>
    <!--FILTRO-->
    <div v-if="!userDocente">
      <p class="mt-5">Filtrar por temas:</p>
      <v-select class="mb-4 w-full" @input="setearListado()" v-model="temaSelect" :options="arregloTemas" label="nombre" :reduce="arregloTemas => arregloTemas.id" />
    </div>
    <section>
      <vs-table max-items="20" stripe search pagination :data="tmpArregloDocumentos">
          <template slot="header">
              <span>Cantidad: {{ tmpArregloDocumentos.length}} </span>
          </template>
          <template slot="thead">
              <vs-th>#</vs-th>
              <vs-th width="20%">Tema</vs-th>
              <vs-th>Documento</vs-th>
              <vs-th>Archivos</vs-th>
              <vs-th>Actividades</vs-th>
              <vs-th v-if="!userEstudiante">Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                {{ tr.id }}<br>
              </vs-td>
              <vs-td>
                <b>Tema: </b>
                <br>
                <p class="mt-2">{{ tr.tema }}</p><br>
                <b>Nivel: </b>
                <br>
                <p style="margin-left: -3px;"> <vs-chip><b>{{ tr.subnivel }}</b></vs-chip></p><br><br>
                <b>Estado: </b>
                <p v-if="tr.estado == 1">Activo</p>
                <p v-else>Inactivo</p>
                <div v-if="tr.solucionario == '1'">
                  <vs-chip transparent color="rgb(11, 189, 135)" type="flat">Solucionario</vs-chip>
                </div>
              </vs-td>
              <vs-td>
                <b>Nombre:</b>
                <p>{{ tr.nombre_documento }}</p>
                <b>Descripción:</b>
                <p>{{ tr.desc_documento }}</p>
                <b>Fecha:</b>
                <p>{{ tr.created_at | fecha }}</p>
              </vs-td>
              <vs-td>
                <div v-if="tr.files.length > 0" v-for="(item,key2) in tr.files" :key="key2">
                  <p class="imagen" @click="documento=item.url;openDocument(item)">
                    <b> {{ item.archivo }}
                      <!--IMAGE-->
                      <ion-icon v-if="item.url.substr(-3) == 'png' || item.url.substr(-3) == 'jpg' || item.url.substr(-3) == 'PNG'" style="font-size:20px;color:green;position:relative;top:5px;" name="camera-outline"></ion-icon>
                      <!--PDF-->
                      <ion-icon v-else style="font-size:20px;color:green;position:relative;top:5px;" name="document-outline"></ion-icon>
                    </b>
                  </p>
                </div>
              </vs-td>
              <vs-td>
                <div v-if="tr.actividad1 || tr.actividad2 || tr.actividad3 || tr.actividad4 || tr.actividad">
                  <div v-if="tr.actividad1">
                    <b>Actividad 1:</b>
                    <p class="enlace" @click="verActividad(tr.actividad1)">{{ tr.actividad1 }}</p>
                    <br>
                  </div>
                  <div v-if="tr.actividad2">
                    <b>Actividad 2:</b>
                    <p class="enlace" @click="verActividad(tr.actividad2)">{{ tr.actividad2 }}</p>
                    <br>
                  </div>
                  <div v-if="tr.actividad3">
                    <b>Actividad 3:</b>
                    <p class="enlace" @click="verActividad(tr.actividad3)">{{ tr.actividad3 }}</p>
                    <br>
                  </div>
                  <div v-if="tr.actividad4">
                    <b>Actividad 4:</b>
                    <p class="enlace" @click="verActividad(tr.actividad4)">{{ tr.actividad4 }}</p>
                    <br>
                  </div>
                  <div v-if="tr.actividad5">
                    <b>Actividad 5:</b>
                    <p class="enlace" @click="verActividad(tr.actividad5)">{{ tr.actividad5 }}</p>
                  </div>
                </div>
                <div v-else>
                  <p>No hay actividades registradas</p>
                </div>
              </vs-td>
              <vs-td>
                <div>
                  <vx-tooltip style="display: inline-block;" text="Asignar" position="top" color="primary">
                    <vs-button class="inline m-2" type="line" v-if="btnAsignar == '1' && tr.nee_subnivel != '5'" color="success" @click="$emit('changeAsignar',tr)" >ASIGNAR</vs-button>
                  </vx-tooltip>
                  <vx-tooltip style="display: inline-block;" text="Editar" position="top" color="primary">
                    <vs-button class="inline m-2" type="line" v-if="btnEditar == '1' && !userDocente" radius color="primary" icon="edit" @click="feditar(tr)" />
                  </vx-tooltip>
                  <!--Eliminar-->
                  <vx-tooltip style="display: inline-block;" text="Eliminar" position="top" color="primary">
                    <vs-button class="inline m-2" type="line"  v-if="btnEliminar == '1' && !userDocente" radius color="danger" icon="delete" @click="ficha = tr;f_confirmarDelete(tr)" />
                  </vx-tooltip>
                  <!--asignar a curso-->
                  <div v-for="(item,key) in tr.cursosAsignados">
                    <small class="font-bold text-warning" v-if="item.codigo_curso == codigoCurso"><ion-icon name="book-outline"></ion-icon> Tarea asignada</small>
                  </div>
                  <vx-tooltip style="display: inline-block;" text="Asignar necesidad educativa a un curso" position="top" color="primary">
                    <vs-button v-if="userDocente" class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" size="small" icon-pack="feather" icon="icon-check" type="filled" target="_blank" color="success" @click="neetSelect = tr;getSeleccionadas()">Asignar</vs-button>
                  </vx-tooltip>
                </div>
              </vs-td>
            </vs-tr>
          </template>
      </vs-table>
    </section>
    <!-- HTML !-->
    <!--MODAL PARA MOSTRAR DOCUMENTO-->
    <vs-popup class="holamundo" :title="'Ver archivo'" fullscreen :active.sync="popupDocumento">
      <div class="flex" style="justify-content: center;">
        <image-zoom
          :regular="$data_url+'archivos/neetFiles'+'/'+documento"
          :zoom-amount="3"
          :click-zoom="true"
          click-message="De click para aumentar"
          img-class="img-fluid"
          >
        </image-zoom>
      </div>
    </vs-popup>
    <!--MODAL PARA ASIGNAR A UN CURSO DESDE EL DOCENTE-->
    <vs-popup fullscreen :title="'Asignar: ' + neetSelect.documento" :active.sync="popupAsignarCurso">
      <AsignarDocumentoCursoVue
      v-if="popupAsignarCurso"
      :usuario="usuario"
      :arregloAsignaturas="arregloAsignaturas"
      :neetSelect="neetSelect"
      :desdeLibro="desdeLibro"
      :desdeCurso="desdeCurso"
      :codigoCurso="codigoCurso"
      :setidasignatura="setidasignatura"
      :setnombreasignatura="setnombreasignatura"
      />
  </vs-popup>
  </div>
</template>
<script>
import axios from 'axios'
import imageZoom from 'vue-image-zoomer';
import _color from '@/assets/utils/color.js';
import vSelect from 'vue-select';
import tableFiltroUsuarioVue from '@/views/usuarios/tipos/components/tableFiltroUsuario'
import AsignarDocumentoCursoVue from '@/views/nee_documentos/components/AsignarDocumentoCurso'
export default{
  data(){
    return{
      usuario:[],
      userAdmin:false,
      userDocente:false,
      userEstudiante:false,
      //variables files
      popupDocumento:false,
      documento:'',
      //fin variables files
      //variables para asignar ficha a curso
      cursosDocente:[],
      modalAsignarCurso:false,
      ficha:{},
      //fin variables para asignar ficha a curso
      tmpArregloDocumentos:[],
      temaSelect:'',
      //variables para asignar a un curso
      popupAsignarCurso:false,
      neetSelect:{},
      arregloAsignaturas:[],
      //fin variables para asignar a un curso
    }
  },
  created() {
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
    if(me.usuario.id_group == 1) me.userAdmin      = true
    if(me.usuario.id_group == 6) me.userDocente    = true
    if(me.usuario.id_group == 4) me.userEstudiante = true
  },
  watch:{
    listaDatos(results){
      let me = this
      me.setearListado();
    },
  },
  mounted(){
    let me = this;
  },
  props:{
    listaDatos:{
      type:Array,
      default:[],
    },
    arregloTemas:{
      type:Array,
      default:[],
    },
    btnEditar:{
      type:Number,
      default:1
    },
    btnEliminar:{
      type:Number,
      default:1
    },
    btnAsignar:{
      type:Number,
      default:0
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
  components:{
    'v-select': vSelect,
    imageZoom,
    tableFiltroUsuarioVue,
    AsignarDocumentoCursoVue,
  },
  mounted() {
    let me = this;
    me.setearListado()
  },
  methods:{
    feditar(tr){
      let me = this
      me.$emit('changeEdit',tr)
    },
    setearListado(){
      let me = this;
      me.tmpArregloDocumentos = []
      if(me.temaSelect == null || me.temaSelect == "" || me.temaSelect == undefined){
        me.tmpArregloDocumentos = me.listaDatos
        return
      }
      if(me.listaDatos.length > 0){
        me.tmpArregloDocumentos = me.listaDatos.filter(p => p.tema_id == me.temaSelect)
        let datos = {
          temaSelect: me.temaSelect
        }
        me.$emit('recharge',datos)
        return
      }
    },
    f_confirmarDelete(tr){
      let me = this;
      this.$http.get(this.$server_url+'neetTema/'+tr.id)
        .then(function (res) {
          let info = res.data.asignaciones
          if(info.length > 0){
            me.$vs.notify({
            text:'No se puede eliminar por que existe asignaciones de este documento en algunos usuarios',
            color:'danger',
            iconPack: 'feather',
            icon:'icon-check',
            time:4000
            })
            return
          }else{
           me.preContinuarEliminacion()
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
        })
    },
    preContinuarEliminacion(){
      this.$vs.dialog({
        type:'confirm',
        color: 'danger',
        acceptText:'Si, deseo eliminar',
        cancelText:'Cancelar',
        title: `Confirmar`,
        text: 'Estas seguro de eliminar?',
        accept:this.deleteDocumentos
      })
    },
    deleteDocumentos(){
      let me = this;
      let formData = new FormData();
      formData.append('id',me.ficha.id);
      me.$vs.loading()
      axios.post(this.$data_url + 'api/eliminarNEET', formData)
      .then(res => {
      me.$vs.loading.close()
      me.$emit('recharge',true)
      me.$vs.notify({
        text:'Se elimino correctamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
      .catch((e) =>{
          me.$vs.loading.close()
      })
    },
    //metodos files
    openDocument(item){
      let me = this;
      if (item.url.substr(-3) == "pdf") {
          window.open(this.$data_url+'archivos/neetFiles/' + me.documento, '_blank');
          return
      } else if ( item.url.substr(-3) == "doc" || item.url.substr(-3) == "ocx" || item.url.substr(-3) == "xls" || item.url.substr(-3) == "lsx" ) {
          window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url+'archivos/proyectos/' + item.url, '_blank');
          return
      }
      me.popupDocumento = true;
    },
    verActividad(url){
      let me = this;
      localStorage.Exteriorurl = url
      let route = this.$router.resolve({path: '/admin_neet_actividad'});
      window.open(route.href, '_blank');
    },
    //********METODOS DE ASIGNAR CURSOS**************************
    getSeleccionadas() {
      let me = this;
      let data = new FormData();
      data.append('idusuario',  me.usuario.idusuario)
      data.append('periodo_id', localStorage.periodo_id)
      me.$vs.loading();
      this.$http.post(this.$server_url + "asignaturas_x_docente_xPeriodo", data)
        .then(res => {
          me.$vs.loading.close();
          me.arregloAsignaturas = res.data;
          me.popupAsignarCurso  = true
        })
        .catch(function(e){
            me.$vs.loading.close();
        })
    },
    //********FIN METODOS PAR ASIGNAR CURSOS*********************
  }
}
</script>
<style scoped>
.imagen{
  cursor:pointer;
  opacity:0.8;
  transition: 1s ease all;
}
.imagen:hover{
  text-decoration: underline;
  color:#217bc5;
  text-shadow:2px 4px 2px #ccc;
}
/*ENLACE*/

@import url("https://fonts.googleapis.com/css?family=Montserrat:400,700");

body {
  font-family: Montserrat, sans-serif;
}

.hover-container {
  text-align: center;
  margin-bottom: 2em;
}

/* --- this is the code you probably want ---- */

.enlace {
  cursor: pointer;
  border-bottom: 3px solid #ff8cbc;
  transition: all 0.25s linear;
  position: relative;
}

.enlace:before {
  content: "";
  display: block;
  width: 100%;
  height: 3px;
  background-color: #61a3ff;
  position: absolute;
  left: 0;
  bottom: -3px; /* this is to match where the border is */
  transform-origin: left;
  transform: scale(0);
  transition: 0.25s linear;
/*   will-change: transform; */
}

.enlace:hover:before {
  transform: scale(1);
}
.enlace:hover{
  opacity: 0.8;
  transform: translateY(-1px);
}
</style>
