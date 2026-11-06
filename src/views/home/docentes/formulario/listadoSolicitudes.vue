<template>
    <div>
        <div v-if="verSolicitud == true">
            <vs-button type="border" icon="reply" size="small" @click="verSolicitud = false;getForms();" text-color="#7367F0">Regresar a solicitudes</vs-button>    
            <verSolicitudesVue :id = "formulario_id"/>
        </div>
        <vx-card
            v-else
            :title="title"
            title-color="success"
            subtitle="Una vez creado el formulario se generara un link para ser compartido con el docente.">
             <div class="w-full p-2 bg-gray-400 text-center">
                <div class="flex">
                    <p class="font-medium">Filtrar por:</p>
                    <ul class="flex ml-2">
                        <li>
                        <vs-radio v-model="tipo" @input="getForms()" class="ml-3" vs-name="radios1" vs-value="1"><span class="font-medium">{{ sumaSinSolicitudes }}</span> Todas</vs-radio>
                        </li> 
                        <li>
                        <vs-radio v-model="tipo" @input="getForms()" class="ml-3" vs-name="radios1" vs-value="0"><span>{{ conSolicitudes }}</span> Solicitudes Pendientes</vs-radio>
                        </li>
                    </ul>
                </div>
                <vs-divider></vs-divider>
             </div>
            <vs-table search :data="tmparregloForms" stripe pagination max-items="5">
                <template>
                <div slot="header" class="flex">
                  <vs-button class="ml-4" v-if="tipoData == 'institucion'" color="rgb(62, 201, 214)" @click="popupAgregar = true;limpiar();" icon="add" type="filled">Generar Formulario</vs-button>
                </div>
                </template>
                <template slot="thead">
                <vs-th sort-key="nombreInstitucion">Datos</vs-th>
                <vs-th sort-key="nombreInstitucion">Enlace</vs-th>
                <vs-th sort-key="nombreInstitucion">Solicitudes</vs-th>
                <vs-th sort-key="nombreInstitucion">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].nombreInstitucion">
                    <p class="font-bold">Institución:</p>
                    <span>{{ tr.nombreInstitucion }}</span><br>
                    <p class="font-bold">Período:</p>
                    <span>{{ tr.periodo }}</span><br>
                    <p class="font-bold">Editor:</p>
                    <span>{{ tr.editor }}</span><br>
                    </vs-td>
                    <vs-td :data="data[indextr].nombreInstitucion">
                    <p class="font-bold">Link:</p>
                    <span style="cursor:pointer;" @click="openEnlace(tr)" target class="text-primary">{{ tr.link }}</span><br>
                    <p class="font-bold">Fecha expiración:</p>
                    <span>{{ tr.fecha_expiracion }}</span><br>
                    <p class="font-bold">Observacion:</p>
                    <span>{{ tr.observacion }}</span><br>
                    <p class="font-bold">Estado:</p>
                    <vs-chip color="success" v-if="tr.estado == '1'">Activado</vs-chip>
                    <vs-chip color="danger" v-else>Desactivado</vs-chip>
                    </vs-td>
                    <vs-td>
                        <vs-chip color="primary">{{ tr.cantidad }} Solicitudes</vs-chip>
                    </vs-td>
                    <vs-td>
                    <div class="flex"> 
                        <vx-tooltip style="display: inline-block;" text="Copiar link" position="top" color="success">
                            <vs-button size="small" class="modal-default-button" color="success" @click="copiarLink(data[indextr])" type="line" icon-pack="feather" icon="icon-copy">
                            </vs-button>
                        </vx-tooltip>
                        <vx-tooltip class="ml-3" style="display: inline-block;" text="Ver solicitudes" position="top" color="success">
                            <vs-button size="small" class="modal-default-button" color="warning" @click="verSolicitud = true;formulario_id = tr.id;" type="line" icon-pack="feather" icon="icon-info">
                            </vs-button>
                        </vx-tooltip>
                        <vx-tooltip class="ml-3" style="display: inline-block;" text="Editar" position="top" color="success">
                            <vs-button size="small" class="modal-default-button" color="warning" @click="openEditar(data[indextr]);generar=false;formulario_id = tr.id;" type="line" icon-pack="feather" icon="icon-edit">
                            </vs-button>
                        </vx-tooltip>
                        <vx-tooltip class="ml-3" style="display: inline-block;" text="Eliminar" position="top" color="success">
                            <vs-button size="small" class="modal-default-button" color="danger" @click="openConfirm(data[indextr])" type="line" icon-pack="feather" icon="icon-trash">
                            </vs-button>
                        </vx-tooltip>
                    </div>
                    </vs-td>
                </vs-tr>
                </template>
            </vs-table>
        </vx-card>
         <!--MODAL PARA AGREGAR-->
      <vs-popup classContent="popup-example" fullscreen  title="Generar Formulario" :active.sync="popupAgregar">
        <vs-tabs :color="colorx">
          <vs-tab @click="colorx = 'success'" label="Información">
            <div class="vx-row mb-6">
              <div class="vx-col sm:w-1/3 w-full">
                <span>Institución</span>
              </div>
              <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" icon-pack="feather" disabled icon="icon-user" icon-no-border v-model="formularioNombreInstitucion" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col sm:w-1/3 w-full">
                <span>Periodo</span>
              </div>
              <div class="vx-col sm:w-2/3 w-full">
                <vs-input type="email" class="w-full" disabled icon-pack="feather" icon="icon-bookmark" icon-no-border v-model="formularioPeriodo" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col sm:w-1/3 w-full">
                <span>Fecha expiración</span>
              </div>
              <div class="vx-col sm:w-2/3 w-full">
                  <flat-pickr :config="configdateTimePicker" v-model="formulario.toDate" placeholder="Fecha Fin" class="m-1" style="display: inline-block;width: 100%" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col sm:w-1/3 w-full">
                <span>Descripción</span>
              </div>
              <div class="vx-col sm:w-2/3 w-full">
                <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-edit" icon-no-border v-model="formulario.descripcion" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col sm:w-1/3 w-full">
                <span>Estado</span>
              </div>
              <div class="vx-col sm:w-2/3 w-full">
                <ul class="flex">
                  <li>
                    <vs-radio v-model="formulario.estado" vs-name="radiosEstado2" vs-value="1">Activo</vs-radio>
                  </li>
                  <li>
                    <vs-radio class="ml-2" v-model="formulario.estado" vs-name="radiosEstado2" vs-value="0">Desactivado</vs-radio>
                  </li>
                </ul> 
              </div>
            </div>
            <div class="vx-row">
              <div class="vx-col sm:w-2/3 w-full ml-auto">
                <vs-button class="mr-3 mb-2" @click="guardarFormulario()">Guardar</vs-button>
                <vs-button color="warning" type="border" class="mb-2" @click="popupAgregar = false;">Cancelar</vs-button>
              </div>
            </div>
          </vs-tab>
          <vs-tab @click="colorx = 'danger'" label="Seleccionar libros">
            <div v-if = "formulario.id == 0" class="con-tab-ejemplo">
                <small>Debe crear el formulario para seleccionar libros por favor</small>
            </div>
            <div v-else>
                <asesorSelectBookVue :formulario_id = "formulario_id" :formularioNombreInstitucion = "formularioNombreInstitucion" :formularioPeriodo="formularioPeriodo"/>
            </div>
          </vs-tab>
        </vs-tabs>
      </vs-popup>
      <!--MODAL PARA EDITAR-->
      <vs-popup classContent="popup-example"  fullscreen title="Editar Formulario" :active.sync="popupEditar">
        <vs-tabs :color="colorx">
          <vs-tab @click="colorx = 'success'" label="Información">
            <div class="vx-row mb-6">
              <div class="vx-col sm:w-1/3 w-full">
                <span>Institución</span>
              </div>
              <div class="vx-col sm:w-2/3 w-full">
                <vs-input class="w-full" icon-pack="feather" disabled icon="icon-user" icon-no-border v-model="formularioNombreInstitucion" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col sm:w-1/3 w-full">
                <span>Periodo</span>
              </div>
              <div class="vx-col sm:w-2/3 w-full">
                <vs-input type="email" class="w-full" disabled icon-pack="feather" icon="icon-bookmark" icon-no-border v-model="formularioPeriodo" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col sm:w-1/3 w-full">
                <span>Fecha expiración</span>
              </div>
              <div class="vx-col sm:w-2/3 w-full">
                  <flat-pickr :config="configdateTimePicker" v-model="formulario.toDate" placeholder="Fecha Fin" class="m-1" style="display: inline-block;width: 100%" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col sm:w-1/3 w-full">
                <span>Descripción</span>
              </div>
              <div class="vx-col sm:w-2/3 w-full">
                <vs-input type="text" class="w-full" icon-pack="feather" icon="icon-edit" icon-no-border v-model="formulario.descripcion" />
              </div>
            </div>
            <div class="vx-row mb-6">
              <div class="vx-col sm:w-1/3 w-full">
                <span>Estado</span>
              </div>
              <div class="vx-col sm:w-2/3 w-full">
                <ul class="flex">
                  <li>
                    <vs-radio v-model="formulario.estado" vs-name="radiosEstado" vs-value="1">Activo</vs-radio>
                  </li>
                  <li>
                    <vs-radio class="ml-2" v-model="formulario.estado" vs-name="radiosEstado" vs-value="0">Desactivado</vs-radio>
                  </li>
                </ul> 
              </div>
            </div>
            <div class="vx-row">
              <div class="vx-col sm:w-2/3 w-full ml-auto">
                <vs-button class="mr-3 mb-2" @click="guardarFormulario()">Guardar</vs-button>
                <vs-button color="warning" type="border" class="mb-2" @click="popupAgregar = false;popupEditar=false;">Cancelar</vs-button>
              </div>
            </div>
          </vs-tab>
          <vs-tab @click="colorx = 'danger'" label="Seleccionar libros">
            <div v-if = "formulario_id == 0" class="con-tab-ejemplo">
                <small>Debe crear el formulario para seleccionar libros por favor</small>
            </div>
            <div v-else>
                <asesorSelectBookVue :formulario_id = "formulario_id" :formularioNombreInstitucion = "formularioNombreInstitucion" :formularioPeriodo="formularioPeriodo"/>
            </div>
          </vs-tab>
        </vs-tabs>
      </vs-popup>
    </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import verSolicitudesVue from './components/verSolicitudes.vue';
import asesorSelectBookVue from './components/asesorSelectBook.vue';
export default {
    data() {
        return{
            arregloForms:[],
            tmparregloForms:[],
            usuario:[],
            id:0,
            popupAgregar:false,
            popupEditar:false,
            verSolicitud:false,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            formulario:{
              toDate:null,
              descripcion:'',
              institucion:'',
              periodo:'',
              estado:'1',
            },
            formulario_id:'',
            tipo:1,
            tipoData:'',
            title:'',
            colorx:'success'
        }
    },
    components:{
        flatPickr,
        verSolicitudesVue,
        asesorSelectBookVue,
    },
    props:{
        formularioInstitucion:{
          type:Number,
          default:0
        },
        formularioNombreInstitucion:{
          type:String,
          default:0,
        },
        formularioPeriodo:{
          type:String,
          default:"",
        },
        formularioPeriodo_id:{
          type:Number,
          default:0,
        },
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getForms();
    },
    mounted(){
        let me = this;
        me.tipoData = localStorage.formulario
        if(me.tipoData == 'todo'){
            me.title = "Solicitudes de Formularios de docentes"
        }else{
            me.title = "Solicitudes de Formularios de docentes de la institución "+me.formularioNombreInstitucion
        }
    },
    computed:{
      sumaSinSolicitudes(){
        let me = this;
        if(me.tipoData == 'todo'){
          let datos = me.arregloForms
          return datos.length
        }else{
          let datos = me.arregloForms.filter(p => (p.institucion_id == me.formularioInstitucion))
          return datos.length
        }
      },
      conSolicitudes(){
        let me = this;
        if(me.tipoData == 'todo'){
          let datos = me.arregloForms.filter(p => p.cantidad > 0)
          return datos.length
        }else{
          let datos = me.arregloForms.filter(p => (p.institucion_id == me.formularioInstitucion)  && (p.cantidad > 0))
          return datos.length
        }
      },
    },
    methods:{
        //para obtener todos los formularios generados
        getForms() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'formularioDocente?solicitudes=yes')
                .then(function (res) {
                    me.$vs.loading.close();
                    me.arregloForms = res.data
                    let datos = res.data
                    if(me.tipoData == 'todo'){
                        if(me.tipo == '0'){
                            me.tmparregloForms = datos.filter(p => p.cantidad > 0)
                        }else{
                            me.tmparregloForms = datos
                        }
                    }else{
                         let datos = res.data
                        //filtrar los que tienen solicitudes
                        if(me.tipo == '0'){
                            me.tmparregloForms = datos.filter(p => (p.institucion_id == me.formularioInstitucion)  && (p.cantidad > 0))
                        }else{
                            me.tmparregloForms = datos.filter(p => (p.institucion_id == me.formularioInstitucion))
                        }
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error + ' error');
                })
        },
        openEnlace(tr){
            window.open(tr.link)
        },
         copiarLink(tr){
            let me = this;
            let ruta = tr.link
            var aux = document.createElement("input");
            aux.setAttribute("value", ruta);
            document.body.appendChild(aux);
            aux.select();
            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({ text: 'Error al copiar el link', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                } else {
                    me.$vs.notify({ text: 'Link copiado', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }
            document.body.removeChild(aux);
        },
        openEditar(tr){
          let me = this;
          me.formulario.id          = tr.id
          me.formulario.toDate      = tr.fecha_expiracion
          me.formulario.descripcion = tr.observacion
          me.formulario.institucion = tr.nombreInstitucion
          me.formulario.periodo     = tr.periodo
          me.formulario.estado      = tr.estado
          me.popupEditar            = true
        },
        guardarFormulario(){
          let me = this;
          let host = location.protocol + '//' + location.hostname +':'+ location.port + '/formulario/docente/'+ me.formularioInstitucion +'/'
          if(me.formulario.toDate == null || me.formulario.toDate == "" || me.formulario.toDate == undefined){
            me.$vs.notify({
                text: "Debe seleccionar una fecha vencimiento por favor",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            })
            return
          }
          let formData = new FormData();
          me.$vs.loading()
          formData.append('id',               me.formulario.id)
          formData.append('institucion_id',   me.formularioInstitucion)
          formData.append('periodo_id',       me.formularioPeriodo_id)
          formData.append('user_created',     me.usuario.idusuario)
          formData.append('link',             host)
          formData.append('observacion',      me.formulario.descripcion)
          formData.append('fecha_expiracion', me.formulario.toDate)
          formData.append('estado',           me.formulario.estado)
          this.$http.post(this.$server_url+'GenerarFormulario', formData)
              .then(function (res) {
                  me.$vs.loading.close()
                  me.$vs.notify({
                      text: res.data.message,
                      color: 'primary',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  })
                  me.getForms()
                  if(me.formulario.id == 0){
                    me.popupAgregar   = true;
                    me.formulario_id  = res.data.datos.id
                    me.formulario.id  = res.data.id
                  } 
                  else{
                    me.popupEditar  = false;
                    limpiar()
                  }
                  
              })
              .catch(function (error) {me.$vs.loading.close()})
        },
         openConfirm(tr){
            let me = this;
            me.id = tr.id
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar?',
                accept:this.eliminarLink
            })
        },
        eliminarLink(){
        let me = this
        me.$vs.loading()
        this.$http.delete(this.$server_url+'formularioDocente/'+me.id)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time:3000,
                    })
                    return
                }
                me.$vs.notify({
                    text: 'Se elimino correctamente el formulario',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.getForms()
            })
            .catch(function (error) {
            me.$vs.loading.close()
            console.log(error)
            })
        },
        limpiar(){
          let me = this;
          me.formulario.id          = 0
          me.formulario_id          = 0
          me.formulario.toDate      = null
          me.formulario.descripcion = ""
          me.formulario.institucion = ""
          me.formulario.periodo     = ""
          me.formulario.estado      = 1
        },
    }
}
</script>
