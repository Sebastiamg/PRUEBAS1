<template>
    <div class="vx-col md:w-full w-full mb-base">
        <vx-card>
            <vs-button color="primary" type="border" icon-pack="feather" icon="icon-plus"
                @click="agregarUsuario();">Agregar</vs-button>
            <vs-tabs alignment="fixed">
                <vs-tab :label="'Docentes ( ' + listaDocentesFiltrados.length + ' )'">
                    <div class="mt-5">
                       <ul class="flex flex-col md:flex-row gap-2 md:gap-4">
                        <li class="md:mr-4">
                          Filtrar por:
                        </li>
                        <li class="md:mr-2">
                          <vs-radio v-model="tipoFiltro" @input="institucionSelect='';listaDocentes = []" vs-name="radios1tipoFiltro" vs-value="0">Institución</vs-radio>
                        </li>
                        <li class="md:mr-2">
                          <vs-radio v-model="tipoFiltro" @input="docenteBusqueda = '';listaDocentes = []" vs-name="radios1tipoFiltro" vs-value="1">Docente (email, cédula)</vs-radio>
                        </li>
                      </ul>
                    </div>

                    <div v-if="listaDocentes.length > 0" class="mt-5 mb-4">
                      <div class="flex flex-wrap gap-3 items-center">
                        <span class="font-semibold">Tipo de Institución:</span>
                        <div v-if="tipoFiltro == 0 && institucionSelect">
                          <p>{{ institucionSelect.tipo_institucion_descripcion }}</p>
                        </div>
                        <div v-if="tipoFiltro == 1">
                          <vs-radio
                              v-model="filtroTipoInstitucion"
                              :vs-value="null"
                              class="filter-radio"
                            >
                              Todos
                              <span class="badge-count ml-1">{{ totalDocentes }}</span>
                            </vs-radio>
                            <vs-radio
                              v-for="tipo in tiposInstitucionConDocentes"
                              :key="tipo.id"
                              v-model="filtroTipoInstitucion"
                              :vs-value="tipo.id"
                              class="filter-radio"
                            >
                              {{ tipo.descripcion }}
                              <span class="badge-count ml-1">{{ contadoresTipos[tipo.id] }}</span>
                            </vs-radio>
                        </div>

                      </div>
                    </div>
                    <div class="flex flex-col md:flex-row gap-3 md:gap-0 mb-6 items-stretch md:items-center">
                        <v-select v-model="institucionSelect" :options="instituciones" label="institucion_ciudad"
                            :reduce="instituciones => instituciones" placeholder="Seleccione una institución"
                            @input="cargarDocentesPorInstitucion" class="w-full md:w-full md:mx-6" v-if="tipoFiltro == 0">
                          </v-select>
                          <vs-input v-if="tipoFiltro == 1" @keyup.enter="cargarDocentesPorInstitucion" class="w-full md:mr-2" label="Cédula o email" placeholder="Cédula o email" v-model="docenteBusqueda"></vs-input>
                        <vx-tooltip text="Recargar usuarios" position="top" color="primary">
                          <vs-button v-if="institucionSelect || tipoFiltro == 1" class="w-full md:w-auto mt-2 md:mt-6 md:mb-5" @click="cargarDocentesPorInstitucion"><i class="fa-solid fa-magnifying-glass"></i></vs-button>
                        </vx-tooltip>
                    </div>
                    <div>
                       <vs-chip>Cantidad: {{ listaDocentesFiltrados.length }}</vs-chip>
                    </div>
                    <vs-table stripe max-items="20" search pagination :data="listaDocentesFiltrados" style="margin-top:-20px" no-data-text="No existen docentes registrados...">
                        <template slot="thead">
                            <vs-th sort-key="email">Acceso</vs-th>
                            <vs-th sort-key="estado_idEstado">Estado</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                  <b>Nombres:</b>
                                  <p>{{ data[indextr].nombres }} {{ data[indextr].apellidos }} </p>
                                  <b>Email:</b>
                                  <p>{{ tr.email }}</p>
                                  <b>Documento de identidad:</b>
                                  <p>{{ tr.cedula }}</p>
                                  <b>Institución:</b>
                                  <div class="flex items-center mt-1">
                                    <i class="feather icon-check-circle text-success mr-2" style="font-size: 18px;"></i>
                                    <div>
                                      <p>{{ tr.nombreInstitucion }}</p>
                                      <small><b>Tipo:</b> {{ tr.tipo_InstitucionDescripcion }}</small>
                                    </div>
                                  </div>
                                </vs-td>
                                <vs-td>
                                    <div>
                                        <vs-button @click="confirmaEstado(tr)" v-if="data[indextr].estado_idEstado == 1" color="success"
                                            size="small">Activo</vs-button>
                                        <vs-button @click="confirmaEstado(tr)" v-if="data[indextr].estado_idEstado == 2" color="danger"
                                            size="small">Bloqueado</vs-button>
                                        <br><br>
                                         <p><b>Evaluaciones realizadas:</b> {{ tr.intentosEvaluaciones.length }}</p>
                                         <div v-if="tr.intentosEvaluaciones.length">
                                           <p v-if="tr.intentosEvaluaciones[0].descripcion_finalizacion">{{ tr.intentosEvaluaciones[0].descripcion_finalizacion }}</p>
                                        </div>
                                    </div>
                                </vs-td>
                                <vs-td>
                                    <vs-dropdown vs-custom-content vs-trigger-click>
                                        <vs-button type="relief" class="a-icon">
                                            Opciones
                                            <vs-icon class="" icon="expand_more"></vs-icon>
                                        </vs-button>
                                        <vs-dropdown-menu class="loginx">
                                            <vs-dropdown-item style="width:200px;"
                                                @click="user = tr; popupAsignarAsignaturas = true;">
                                                <span class="feather icon icon-book"></span> Asignaturas
                                            </vs-dropdown-item>
                                            <vs-dropdown-item style="width:200px;margin-top:5px;"
                                                @click="editarUsuario(tr)">
                                                <span class="feather icon icon-edit"></span> Editar
                                            </vs-dropdown-item>
                                            <vs-dropdown-item style="width:200px;margin-top:5px;"
                                                @click="confirmaResetear(tr)">
                                                <span class="feather icon-corner-down-left"></span> Resetear contraseña
                                            </vs-dropdown-item>
                                            <vs-dropdown-item style="width:200px;margin-top:5px;"
                                                @click="confirmaIntento(tr)">
                                                <span class="feather icon-refresh-ccw"></span> Permitir nuevo intento de
                                                evaluación
                                            </vs-dropdown-item>
                                            <vs-dropdown-item style="width:200px;margin-top:5px;"
                                                @click="irPrevisualizacion(tr);">
                                                <span class="feather icon icon-eye"></span> Previsualizar
                                            </vs-dropdown-item>
                                            <vs-dropdown-item style="width:200px;margin-top:5px;"
                                            v-if="tr.intentosEvaluaciones.length > 0"
                                                @click="revisarEvaluacion(tr)">
                                                <span class="feather icon icon-check"></span> Revisar Evaluación
                                            </vs-dropdown-item>
                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>
                <vs-tab :label="'Administradores ( ' + listaAdmins.length + ' )'">
                    <vs-table max-items="20" search pagination :data="listaAdmins" style="margin-top:-20px" no-data-text="No existen administradores registrados...">
                        <template slot="thead">
                            <vs-th sort-key="email">Acceso</vs-th>
                            <vs-th sort-key="estado_idEstado">Estado</vs-th>
                            <vs-th sort-key="institucion">Institución</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    <b>Nombres:</b>
                                    <p>{{ data[indextr].nombres }} {{ data[indextr].apellidos }}</p>
                                    <b>Email:</b>
                                    <p>{{ tr.email }}</p>
                                    <b>Documento de identidad:</b>
                                    <p>{{ tr.cedula }}</p>
                                </vs-td>
                                <vs-td>
                                    <div @click="confirmaEstado(tr)">
                                        <vs-button v-if="data[indextr].estado_idEstado == 1" color="success"
                                            size="small">Activo</vs-button>
                                        <vs-button v-if="data[indextr].estado_idEstado == 2" color="danger"
                                            size="small">Bloqueado</vs-button>
                                    </div>
                                </vs-td>
                                <vs-td>
                                    <div class="flex items-center">
                                        <i class="feather icon-check-circle text-success mr-2" style="font-size: 20px;"></i>
                                        <div>
                                            <p>{{ data[indextr].institucion_ciudad }}</p>
                                            <small><b>Tipo:</b> {{ tr.tipo_institucionDescripcion }}</small>
                                        </div>
                                    </div>
                                </vs-td>
                                <vs-td>
                                    <div class="flex">
                                        <vx-tooltip text="editar" position="top" style="display: inline-block"
                                            color="warning">
                                            <vs-button size="large" type="line" radius icon-pack="feather" class="mr-2"
                                                icon="icon-edit" color="warning" @click="editarUsuario(tr)"></vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip text="resetear contraseña" position="top"
                                            style="display: inline-block" color="primary">
                                            <vs-button size="large" type="line" radius icon-pack="feather"
                                                icon="icon-refresh-ccw" color="primary"
                                                @click="confirmaResetear(tr)"></vs-button>
                                        </vx-tooltip>
                                    </div>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>
            </vs-tabs>
        </vx-card>
        <!--MODALES-->
        <!--MODAL PARA REVISAR LA EVALUACION-->
        <vs-popup classContent="popup-example" fullscreen title="Previsualizar Evaluación"
            :active.sync="popupRevisarEvaluacion">
            <RevisarEvaluacionSalleVue v-if="popupRevisarEvaluacion" :user="user" @changeReturn="changeReturn" />
        </vs-popup>
        <!--VER ASIGNATURAS-->
        <vs-popup classContent="popup-example" fullscreen title="Asignaturas Docente"
            :active.sync="popupAsignarAsignaturas">
            <usuarioAsignaturaVue :desdeAdmin="1" :user="user" v-if="popupAsignarAsignaturas" />
        </vs-popup>
        <!--EDITAR-->
        <vs-popup classContent="popup-example" fullscreen title="Mantenimiento de Docente" :active.sync="popupEditar">
            <agregarUsuarioVue :editar="editar" :user="user" v-if="popupEditar" @recharge="recharge" />
        </vs-popup>
    </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import RevisarEvaluacionSalleVue from '../../docente/evaluaciones/RevisarEvaluacionSalle.vue'
import usuarioAsignaturaVue from './usuarioAsignatura.vue'
import agregarUsuarioVue from './agregarUsuario.vue'
export default {
    components: {
        'v-select': vSelect,
        RevisarEvaluacionSalleVue,
        usuarioAsignaturaVue,
        agregarUsuarioVue
    },
    data() {
        return {
            listaDocentes: '',
            listaAdmins: '',
            miusuario: '',
            datoEditar: '',
            num: '',
            ///variables para previsualizar evaluacion
            user: {},
            popupEditar: false,
            popupRevisarEvaluacion: false,
            //fin variables para previsualizar evaluacion
            //variables para asignar asignaturas
            popupAsignarAsignaturas: false,
            //fin variables para asignar asignaturas ss
            editar: 0,
            institucionSelect: {
                'idInstitucion': '',
                'institucion_ciudad': '',
                'tipo_institucion_descripcion': ''
            },
            instituciones: [],
            loadingPropiedades: {
                text: 'obteniendo listado...',
                color: 'success',
                type: 'sound',
            },
            tipoFiltro:0, //0 por institucion; 1 por cedula o email
            docenteBusqueda:'',
            arrayTiposInstitucion: [],
            filtroTipoInstitucion: null
        }
    },    computed: {
        listaDocentesFiltrados() {
            let me = this;
            if (!me.listaDocentes || !me.listaDocentes.length) return [];

            if (me.filtroTipoInstitucion === null) {
                return me.listaDocentes;
            }

            return me.listaDocentes.filter(docente =>
                docente.tipo_institucion_id === me.filtroTipoInstitucion
            );
        },
        contadoresTipos() {
            let me = this;
            let contadores = {};

            if (!me.listaDocentes || !me.listaDocentes.length) return contadores;

            me.listaDocentes.forEach(docente => {
                let tipoId = docente.tipo_institucion_id;
                if (tipoId) {
                    contadores[tipoId] = (contadores[tipoId] || 0) + 1;
                }
            });

            return contadores;
        },
        totalDocentes() {
            return this.listaDocentes ? this.listaDocentes.length : 0;
        },
        tiposInstitucionConDocentes() {
            let me = this;
            return me.arrayTiposInstitucion.filter(tipo =>
                (me.contadoresTipos[tipo.id] || 0) > 0
            );
        }
    },    mounted() {
        let me = this;
        localStorage.removeItem('datoUsuario')
        localStorage.removeItem('editar')
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.miusuario = me.usuario;
        me.getUsuarios();
        me.getInstituciones();
        me.obtenerTiposInstitucion();
    },
    methods: {
        recharge(e) {
            let me = this;
            if (e == 1) { me.popupEditar = false; return }
            me.popupEditar = false
            me.getUsuarios()
            // Si hay docentes cargados, recargarlos también
            if (me.listaDocentes && me.listaDocentes.length > 0) {
                me.cargarDocentesPorInstitucion()
            }
        },
        changeReturn() {
            let me = this;
            me.popupRevisarEvaluacion = false;
        },
        obtenerTiposInstitucion() {
          let me = this;
          me.$vs.loading();
          this.$http.get(this.$server_url + 'metodosGetInstitucion?action=Get_ListarTiposInstitucion')
              .then(function (res) {
                  if (res.data.status == 1) {
                      me.arrayTiposInstitucion = res.data.data;
                  } else {
                      me.$vs.notify({
                          text: res.data.message || 'Error al cargar los tipos de institución',
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-alert-triangle'
                      });
                  }
                  me.$vs.loading.close();
              })
              .catch(function (error) {
                  console.log(error);
                  me.$vs.notify({
                      text: 'Error de conexión al cargar los tipos de institución',
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  });
                  me.$vs.loading.close();
              });
        },
        getUsuarios() {
            let me = this;
            me.$vs.loading();
            const parametros ={
                'tipoUsuario':'admin',
                'tipo_institucion':localStorage.getItem('Salletipo_institucion_id')
            }
            this.$http.post(this.$server_url + 'usuarioSalle', parametros)
                .then(res => {
                    me.listaAdmins = res.data.admins;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        agregarUsuario() {
            let me = this;
            me.popupEditar = true
            me.editar = 0
        },
        editarUsuario(item) {
            let me = this;
            me.editar = 1
            me.user = {
                ...item
            }
            me.popupEditar = true
        },
        confirmaEstado(item) {
            let me = this;
            let msj = '';
            me.datoEditar = item;
            if (item.estado_idEstado == 1) {
                msj = "BLOQUEAR ";
                me.num = 2;
            } else {
                msj = "ACTIVAR ";
                me.num = 1;
            }
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en ' + msj + ' a este usuario?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.estadoUsuario
            })
        },
        estadoUsuario() {
            let me = this;
            let datas = new FormData();
            datas.append('idusuario', me.datoEditar.idusuario);
            datas.append('estado', me.num);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'activa_desactiva_user', datas)
                .then(res => {
                    // console.log(res.data)
                    me.$vs.notify({
                        text: 'Usuario editado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close();
                    me.getUsuarios();
                })
                .catch(err => {
                    me.$vs.loading.close();
                    // console.log(err)
                })
        },
        confirmaResetear(item) {
            let me = this;
            // console.log(item)
            me.datoEditar = item;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'La contraseña será reemplazada por el número de cédula.',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.resetearClave
            })
        },
        resetearClave() {
            let me = this;
            me.$vs.loading();
            let datas = new FormData();
            datas.append('idusuario', me.datoEditar.idusuario);
            datas.append('cedula', me.datoEditar.cedula);
            this.$http.post(this.$server_url + 'updatePassword', datas)
                .then(res => {
                    // console.log(res.data)
                    me.$vs.notify({
                        text: 'Contraseña reseteada, correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close();
                    me.getUsuarios();
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        asignaturasUsuario(item) {
            let me = this;
            localStorage.usuSalle = (item.idusuario);
            me.$router.push('/admin/usuarioasignaturas');
        },
        confirmaIntento(item) {
            let me = this;
            me.datoEditar = item;
            // var url = `metodosGetPreguntasSalle?getIntentosXEvaluacion=1&id_evaluacion=1&id_usuario=${datoEditar.idusuario}`
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Está seguro de renovar el intento para el docente seleccionado? La evaluación actual ya no será calificada.',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.renovarIntento
            })
        },
        renovarIntento() {
            let me = this
            me.$vs.loading();
            let data = new FormData();
            data.append('idusuario', me.datoEditar.idusuario);
            data.append('n_evaluacion', localStorage.EvaluacionSelectSalle)
            this.$http.post(this.$server_url + 'salle_intento_eval', data)
                .then(res => {
                  if(res.data.status == 0){
                      me.$vs.notify({
                          text: res.data.message,
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-alert-triangle'
                      })
                      me.$vs.loading.close();
                      return;
                  }
                    me.$vs.notify({
                        text: 'El docente podrá rendir la evaluación una vez más',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close();
                    me.cargarDocentesPorInstitucion()
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close();
                })
        },
        irPrevisualizacion(tr) {
            let me = this
            me.user.nombres = tr.nombres
            me.user.apellidos = tr.apellidos
            me.user.cedula = tr.cedula
            me.user.institucion_idInstitucion = tr.idInstitucion
            me.user.idusuario = tr.idusuario
            me.user.id_evaluacion = tr.id_evaluacion
            me.popupRevisarEvaluacion = true
        },
        revisarEvaluacion(item) {
            let me = this
            if (item.id_evaluacion == null || item.id_evaluacion == 'null' || item.id_evaluacion == '') {
                me.$vs.notify({
                    text: 'El docente seleccionado aún no ha rendido una evaluación',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            } else {
                let datos_docente = item.nombres + ' ' + item.apellidos + ' - ' + item.cedula
                localStorage.setItem('tipo_revisar', 1);
                localStorage.setItem('revisa_admin_salle', 1);
                localStorage.setItem('id_evaluacion_salle', item.id_evaluacion);
                localStorage.setItem('idusuario_evaluacion_salle', item.idusuario);
                localStorage.setItem('idInstitucionDocente', item.idInstitucion)
                localStorage.setItem('datos_docente_revisando', datos_docente);
                me.$router.push('/salle/docente/evaluacion');
            }
        },
        getInstituciones() {
            let me = this;
            let idTipo = localStorage.getItem('Salletipo_institucion_id') || '';
            if(idTipo == "" || idTipo == null || idTipo == 'null'){
               me.$vs.notify({
                    text: 'No se ha seleccionado un período de evaluación válido. Por favor, seleccione un período para cargar las instituciones.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            this.$http.get(this.$server_url + 'institucionesSalle?tipo_institucion=' + idTipo)
                .then(res => {
                    me.instituciones = res.data
                })
                .catch(err => {
                    console.log(err)
                })
        },
        cargarDocentesPorInstitucion() {
            let me = this;
            if(me.tipoFiltro == 0){
              if (!me.institucionSelect){
                  me.listaDocentes=[];
                  return;
              }
            }

            if(me.tipoFiltro == 1){
              // trim
              me.docenteBusqueda = me.docenteBusqueda.trim();
            }
            if(me.tipoFiltro == 1 && (me.docenteBusqueda=='' || me.docenteBusqueda.length<3)){
                me.$vs.notify({
                    text: 'Ingrese al menos 3 caracteres para la búsqueda por cédula o email',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            me.$vs.loading(me.loadingPropiedades);
            let url = "docentesInstitucionSalle";
            let formData = new FormData();

            // filtro por institucion
            if (me.tipoFiltro == 0) {
              formData.append('institucion', me.institucionSelect.idInstitucion);
              formData.append('evaluacion', localStorage.EvaluacionSelectSalle);
              formData.append('docente', 0);
            }
            // filtro por cedula o email
            else {
              formData.append('institucion', 0);
              formData.append('evaluacion', localStorage.EvaluacionSelectSalle);
              formData.append('docente', me.docenteBusqueda);
            }

            this.$http.post(this.$server_url + url, formData)
              .then(res => {
                me.listaDocentes = res.data;
                if(me.usuario.id_group == 12){
                  //tipo_institucion_id
                  me.listaDocentes = me.listaDocentes.filter(docente => docente.tipo_institucion_id == localStorage.getItem('Salletipo_institucion_id'));
                }else{
                  // no hacer nada, mostrar todos los docentes encontrados
                }
                if(me.listaDocentes.length == 0){
                  me.$vs.notify({
                      text: 'No se encontraron docentes con los criterios de búsqueda',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  })
                }
              })
              .catch(err => {
                console.log(err);
              })
              .finally(() => {
                me.$vs.loading.close();
              });


        }
    }
}
</script>

<style scoped>
.filter-radio {
  margin-right: 1rem;
}

.badge-count {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
  font-weight: 900;
  background-color: #0066cc;
  color: white;
  min-width: 24px;
  text-align: center;
}
</style>
