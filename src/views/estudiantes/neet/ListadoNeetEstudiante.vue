<template>
  <div
  >
    <!--LISTADO-->
    <div v-if="menu == 0">
      <vs-table max-items="10" search pagination :data="arregloTareas">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ arregloTareas.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Tarea</vs-th>
            <vs-th>Fechas</vs-th>
            <vs-th>Observación</vs-th>
            <vs-th v-if="userDocente">Tareas enviadas</vs-th>
            <vs-th colspan="2" style="width:100px;">Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              <b>Nombre:</b>
              <p>{{ tr.nombre_documento }}</p>
              <b>Nivel: </b>
              <br>
              <p style="margin-left: -3px;"> <vs-chip><b>{{ tr.subnivel }}</b></vs-chip></p><br><br>
            </vs-td>
            <vs-td>
              <b>Fecha inicio:</b>
              <p>{{ tr.fecha_inicio }}</p>
              <b>Fecha fin:</b>
              <p>{{ tr.fecha_fin }}</p>
            </vs-td>
            <vs-td height="30%" width="30%">
              <div class="overflow-y-auto h-24">
                {{ tr.observacion }}
              </div>
            </vs-td>
            <vs-td v-if="userDocente">
              {{ tr.tarea.length }}
            </vs-td>
            <vs-td align="center">
              <button class="btnV m-2" @click="tarea = tr; menu = 1; id = tr.id">
                <feather-icon icon="AirplayIcon" svgClasses="h-4 w-4" class="ml-2" style="position: inherit;top:3px" />
                <span class="ml-2">Revisar</span>
              </button>
              <button class="btnV ml-2 m-2" v-if="userDocente" @click="tarea = tr; popupEditarTarea = true;">
                <feather-icon icon="EditIcon" svgClasses="h-4 w-4" class="ml-2" style="position: inherit;top:3px" />
                <span class="ml-2">Editar</span>
              </button>
              <button class="btnV ml-2 m-2" v-if="userDocente" @click="tarea = tr; f_confirmarDelete();">
                <feather-icon icon="TrashIcon" svgClasses="h-4 w-4" class="ml-2" style="position: inherit;top:3px" />
                <span class="ml-2">Quitar tarea</span>
              </button>
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
    </div>
    <!--DETALLE-->
    <div v-if="menu == 1">
      <vs-button @click="menu = 0;" class="mt-3"><span class="text">← Regresar</span></vs-button>
      <DetalleTareaVue :tarea="tarea" :codigoCurso="codigoCurso"/>
    </div>
    <!--MODALES-->
    <vs-popup classContent="popup-example" :title="'Editar tarea:'" :active.sync="popupEditarTarea">
      <InformacionTareaVue
      :usuario="usuario"
      v-if="popupEditarTarea"
      :tarea="tarea"
      :codigoCurso="codigoCurso"
      @changeRecharge="changeRecharge
      "/>
    </vs-popup>
  </div>
  </template>
  <script>
  import DetalleTareaVue from './DetalleTarea.vue'
  import flatPickr from 'vue-flatpickr-component';
  import InformacionTareaVue from './components/InformacionTarea.vue';
  import 'flatpickr/dist/flatpickr.css';
  import axios from 'axios'
  export default {
    data() {
      return {
        id: 0,
        menu: 0,
        usuario: [],
        tarea: {},
        userDocente:false,
        popupEditarTarea:false,
      }
    },
    components: {
      flatPickr,
      DetalleTareaVue,
      InformacionTareaVue,
    },
    props:{
      codigoCurso:{
        type:String,
        default:'',
      },
      arregloTareas:{
        type:Array,
        default:[]
      },
      filtro:{
        type:Number,
        default:0
      },
      desdeCurso:{
        type:Number,
        default:0,
      }
    },
    watch:{
      filtro(results){
        let me = this;
        me.menu = 0
      },
      arregloTareas(results){
        let me = this;
        me.arregloTareas = results
      },
    },
    created() {
      let me = this;
      me.usuario          = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
      let me = this;
      if(me.usuario.id_group == 6) me.userDocente = true
    },
    methods: {
      changeRecharge(e){
        let me = this;
        if(e == 1) {
          me.popupEditarTarea = false
          return
        }
        me.popupEditarTarea = false
        me.$emit('changeRecharge',true)
      },
      f_confirmarDelete(){
        this.$vs.dialog({
          type:'confirm',
          color: 'danger',
          acceptText:'Si, deseo quitar',
          cancelText:'Cancelar',
          title: `Confirmar`,
          text: 'Estas seguro de quitar la tarea?',
          accept:this.eliminarAsignacion
        })
      },
      eliminarAsignacion(){
        let me = this;
        let formData = new FormData();
        formData.append('eliminarAsignacionCurso','yes')
        formData.append('id',                      me.tarea.id)
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
              text: "Se quito la tarea correctamente correctamente",
              color: 'primary',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            me.$emit('changeRecharge',true)
          })
          .catch(function (error) { me.$vs.loading.close() })
      },
    }
  }
  </script>

  <style scoped>
  .button-38 {
      background-color: #FFFFFF;
      border: 0;
      border-radius: 25px;
      box-sizing: border-box;
      color: #111827;
      font-family: "Inter var", ui-sans-serif, system-ui, -apple-system, system-ui, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
      font-size: .875rem;
      font-weight: 600;
      line-height: 1.25rem;
      padding: .75rem 1rem;
      text-align: center;
      text-decoration: none #D1D5DB solid;
      text-decoration-thickness: auto;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
      cursor: pointer;
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
  }

  .button-38:hover {
      background-color: rgb(249, 250, 251);
  }

  .button-38:focus {
      outline: 2px solid transparent;
      outline-offset: 2px;
  }

  .button-38:focus-visible {
      box-shadow: none;
  }

  /**Btn regresar */
  .button-48 {
      appearance: none;
      background-color: #FFFFFF;
      border-width: 0;
      box-sizing: border-box;
      color: #000000;
      cursor: pointer;
      display: inline-block;
      font-family: Clarkson, Helvetica, sans-serif;
      font-size: 14px;
      font-weight: 500;
      letter-spacing: 0;
      line-height: 1em;
      margin: 0;
      opacity: 1;
      outline: 0;
      padding: 1em 2.2em;
      position: relative;
      text-align: center;
      text-decoration: none;
      text-rendering: geometricprecision;
      text-transform: uppercase;
      transition: opacity 300ms cubic-bezier(.694, 0, 0.335, 1), background-color 100ms cubic-bezier(.694, 0, 0.335, 1), color 100ms cubic-bezier(.694, 0, 0.335, 1);
      user-select: none;
      -webkit-user-select: none;
      touch-action: manipulation;
      vertical-align: baseline;
      white-space: nowrap;
  }

  .button-48:before {
      animation: opacityFallbackOut .5s step-end forwards;
      backface-visibility: hidden;
      background-color: #EBEBEB;
      clip-path: polygon(-1% 0, 0 0, -25% 100%, -1% 100%);
      content: "";
      height: 100%;
      left: 0;
      position: absolute;
      top: 0;
      transform: translateZ(0);
      transition: clip-path .5s cubic-bezier(.165, 0.84, 0.44, 1), -webkit-clip-path .5s cubic-bezier(.165, 0.84, 0.44, 1);
      width: 100%;
  }

  .button-48:hover:before {
      animation: opacityFallbackIn 0s step-start forwards;
      clip-path: polygon(0 0, 101% 0, 101% 101%, 0 101%);
  }

  .button-48:after {
      background-color: #FFFFFF;
  }

  .button-48 span {
      z-index: 1;
      position: relative;
  }
  .link{
      font-weight: 700;
      text-decoration: underline;
      cursor: pointer;
      transition: 1s ease;
  }
  .link:hover{
      color: cornflowerblue;
  }
  /**ESTILOS BOTONES */
  .btnV{
      color:#3E4448;
      background-color:#EBF3F8;
      border: none;
      padding: 5px 10px;
      border-radius: 5px;
      font-weight: 100;
      font-size: 11px;
      transition: 0.5s ease;
      cursor: pointer;
  }
  .btnV:hover{
      color: #3EA0EA;
  }
  </style>
