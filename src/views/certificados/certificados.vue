<template>
  <div>
    <vs-tabs alignment="center" v-if="usuario.id_group == 1 || usuario.id_group == 5 || usuario.capacitador == 1">
      <vs-tab label="Seminarios">
        <div>
          <vs-row class="my-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <ul style="display: flex;">
                <!-- <li>
                  <vs-radio v-model="menuTipo" color="success" @input="getSeminarios(); tipoSeminario = 'Seminario'"
                    vs-name="radioMenu" vs-value="0">Seminarios</vs-radio>
                </li>-->
                <!-- <li>
                  <vs-radio v-model="menuTipo" color="primary" @input="getSeminarios(); tipoSeminario = 'Webinar'"
                    class="ml-2" vs-name="radioMenu" vs-value="1">Webinars</vs-radio>
                </li> -->
                <li v-if="usuario.id_group == 1 || usuario.id_group == 5">
                  <vs-radio v-model="menuTipo" color="warning" @input="getSeminarios(); tipoSeminario = 'Capacitación'"
                    class="ml-2" vs-name="radioMenu" vs-value="2">Capacitaciones</vs-radio>
                </li>
                <li>
                  <vs-radio v-model="menuTipo" color="success" @input="getSeminarios(); tipoSeminario = 'Capacitación'"
                    class="ml-2" vs-name="radioMenu" vs-value="3">Reportes</vs-radio>
                </li>
              </ul>
            </vs-col>
          </vs-row>
          <!--Filtro de las capacitaciones-->
          <vs-card class="my-2" v-if="menuTipo == 2 && MenuCapacitacion == 0">
            <div class="header">
              <p>Filtro de las capacitaciones</p>
            </div>
            <div class="m-3" style="width:100%;">
              <vs-input style="display:inline-block" type="date" v-model="filtro_fecha_ini"
                class="mb-4 mr-4 col-3 sm:col-12" label="Fecha inicio"></vs-input>
              <vs-input style="display:inline-block" type="date" v-model="filtro_fecha_fin"
                class="mb-4 mr-4 col-3 sm:col-12" label="Fecha fin"></vs-input>
              <vs-select style="display:inline-block; min-width:250px" class="mr-2" autocomplete label="Asesores"
                v-model="m_asesores">
                <vs-select-item :key="index" :value="item" :text="item.nombres" v-for="(item, index) in lista_asesores" />
              </vs-select>
              <vx-tooltip style="display: inline-block;" text="Filtrar" position="top" color="primary">
                <vs-button style="display:inline-block" @click="f_filtro_fechas();" radius icon-pack="feather"
                  icon="icon-filter" color="primary" type="filled"></vs-button>
              </vx-tooltip>
              <vx-tooltip style="display: inline-block;" text="Mostrar todo" position="top" color="primary">
                <vs-button style="display:inline-block" class="ml-3" @click="f_filtro_fechas(0);" radius
                  icon-pack="feather" icon="icon-x" color="warning" type="filled"></vs-button>
              </vx-tooltip>
              <vs-button color="primary" v-if="usuario.id_group == 1" @click="MenuCapacitacion = 1;" class="ml-5" type="border">Temas de capacitación</vs-button>
              <vs-button color="success" v-if="usuario.id_group == 1 || usuario.id_group == 5" @click="MenuCapacitacion = 2;" class="ml-5 p-2" type="border"> <ion-icon
                  style="font-size:18px;position: relative;top:3px;" name="print-outline"></ion-icon> Reporte de capacitación</vs-button>
            </div>
            <div class="m-3" v-if="MenuCapacitacion == 1">
              <vs-button radius color="success" @click="MenuCapacitacion = 0;" type="gradient" icon="reply"></vs-button>
            </div>
          </vs-card>
          <!-- REPORTE DE CAPACITACIONES -->
          <vs-card class="my-2" v-if="menuTipo == 3 && MenuCapacitacion == 0">
            <reporte />
          </vs-card>
          <!--TABLA-->
          <vx-card class="w-full" style="min-height: 500px;" v-if="MenuCapacitacion == 0 && menuTipo != 3">
            <vs-table multiple v-model="codigoSelected" stripe pagination max-items="25" search :data="seminarios">
              <template slot="header">
                <p>Cantidad: <span style="font-weight:bold;">{{ seminarios.length }}</span></p>
                <vs-button v-if="menuTipo != 2"
                  @click="editar_activo = false; popupSeminario = true; tipo_webinar = ''; id_seminario = ''; nombre_seminario = ''; descripcion_seminario = ''; fecha_inicio = ''; fecha_fin = ''; link_reunion = ''; link_recurso = ''; clave_recurso = ''; capacitador = ''; institucion = {};"
                  size="small" style="font-size: 14px;" color="dark" class="mr-3 ml-4" type="filled">
                  Crear seminario
                </vs-button>
                <!-- <vs-button v-if="menuTipo == 2 && periodo_seminarios != null" size="small" @click="MenuCapacitacion = 3;"
                  style="font-size: 10px;" color="dark" class="mr-3 ml-4" type="filled">
                  Crear Capacitación
                </vs-button> -->
                <vs-button v-if="menuTipo == 2 && periodo_seminarios != null" size="small"
                  @click="modalCreateCapacitacion = true;" style="font-size: 10px;" color="success" class="mr-3 ml-4"
                  type="filled">
                  Crear Capacitación
                </vs-button>
                <div class="ml-2" v-if="menuTipo == 2">
                  <vs-button color="warning" size="small" class="mr-3" style="font-size: 14px;"
                    @click="activePrompt = true;">Exportar</vs-button>
                </div>
                <v-select style="width:50%;" class="mr-3 ml-2" :options="periodos" :reduce="periodos => periodos"
                  label="periodo" v-model="periodo_seminarios" @input="getSeminarios()"></v-select>
                <vx-tooltip style="display: inline-block;" text="Recargar" position="top" color="primary">
                  <vs-button style="display:inline-block" @click="getSeminarios()" radius icon-pack="feather"
                    icon="icon-refresh-cw" color="primary" type="line"></vs-button>
                </vx-tooltip>
              </template>
              <template slot="thead">
                <vs-th style="width: 60px;">#</vs-th>
                <vs-th sort-key="nombre">{{ tipoSeminario }}</vs-th>
                <vs-th>Fechas</vs-th>
                <vs-th>Nivel/Área</vs-th>
                <vs-th sort-key="Institucion">Institucion</vs-th>
                <!-- <vs-th>Resp/Asist.</vs-th> -->
                <vs-th>Cant. Asistentes</vs-th>
                <vs-th style="width: 200px;">Acciones</vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td>
                    <p v-if="usuario.idusuario == 35748">id:{{ tr.id_seminario }}</p>
                    {{ indextr + 1 }}
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.tipo_webinar == '2'">
                      <b>Tema:</b>
                      <p style="font-size: 14px;"> {{ data[indextr].nombre }}</p>
                      <small>Area: {{ data[indextr].area_capacitacion }}</small><br>
                      <small>Capacitador: {{ data[indextr].capacitadores }}</small>
                      <p style="margin-top: 1px;"></p>
                      <span v-if="data[indextr].estado_capacitacion == 0"><br>
                        <vs-chip color="danger">Cancelada</vs-chip>
                      </span>
                      <span v-if="data[indextr].estado_capacitacion == 1"><br>
                        <vs-chip color="warning">Pendiente</vs-chip>
                      </span>
                      <span v-if="data[indextr].estado_capacitacion == 2"><br>
                        <vs-chip color="success">Realizada</vs-chip>
                      </span>
                      <vs-chip color="primary">{{ tr.tipo == '0' ? 'Presencial' : 'Virtual' }}</vs-chip>
                    </div>
                    <div v-else>
                      {{ tr.nombre }} <br> {{ tr.descripcion }} <br>
                      <vs-chip color="success" class="mt-1" v-if="tr.asistencia_activa == '1'">
                        Asistencia Activa
                      </vs-chip>
                    </div> <br><br>
                    <p>Link: de reunión</p>
                    <vx-tooltip style="display: inline-block;" text="Ver Enlace" position="top" color="success">
                      <vs-button size="large" radius icon-pack="feather" icon="icon-eye"
                        @click="verEnlace(tr.link_reunion)" color="success" type="line"></vs-button>
                    </vx-tooltip>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.tipo_webinar == '2'">
                      <small>Fecha capacitación:</small><br>
                      {{ data[indextr].fecha_inicio }}<br>
                      <small>Fecha fin:</small><br />
                      {{ data[indextr].fecha_fin }}<br>
                      <small>Hora Inicio:</small> {{ data[indextr].hora_inicio }}<br>
                      <small>Hora fin:</small> {{ data[indextr].hora_fin }}<br>
                      <small>Horas capacitación:</small> {{ data[indextr].horas_capacitacion || 6 }}<br>
                      <small>Fecha create:</small><br />
                      {{ data[indextr].created_at }}<br>
                      <small>Fecha actualización:</small> {{ data[indextr].updated_at }}<br>

                    </div>
                    <div v-else>
                      {{ tr.fecha_inicio }} <br> {{ tr.fecha_fin }}
                    </div>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.tipo_webinar == '2'">
                      <small><b>Nivel:</b></small><br>
                      {{ tr.nombreofertaAcademica || 'No especificado' }}<br>
                      <small class="mt-2"><b>Área:</b></small><br>
                      {{ tr.area_capacitacion || 'No especificada' }}
                    </div>
                    <div v-else>
                      -
                    </div>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.tipo_webinar == '2'">
                      <div v-if="tr.estado_institucion_temporal == 0">
                        {{ tr.nombre_institucion }}
                        <br>
                        {{ tr.nombre_ciudad }}
                      </div>
                      <div v-else>
                        {{ tr.nombre_institucion_temporal }}
                        <br>
                        {{ tr.ciudad }}
                      </div>
                      <small><br>Asesor: {{ data[indextr].asesor }}</small>
                      <small><br>cedula: {{ data[indextr].cedula }}</small>
                    </div>
                    <div v-else>
                      {{ tr.nombre_institucion }}
                      <br>
                      {{ tr.nombre_ciudad }}
                    </div>
                  </vs-td>
                  <vs-td>
                    <div v-if="tr.tipo_webinar == '1'">
                      {{ tr.cant_respuestas }}
                    </div>
                    <div v-else>
                        {{ tr.cant_asistentes }}
                      <!-- Encuestas asignadas — solo capacitaciones -->
                      <div v-if="tr.tipo_webinar == '2'" class="mt-1">
                        <vs-chip :color="parseInt(tr.cant_encuestas) > 0 ? 'success' : 'danger'" size="small">
                          <vs-icon :icon="parseInt(tr.cant_encuestas) > 0 ? 'assignment_turned_in' : 'assignment_late'" size="13px" class="mr-1"/>
                          {{ tr.cant_encuestas }} {{ parseInt(tr.cant_encuestas) == 1 ? 'encuesta' : 'encuestas' }}
                        </vs-chip>
                      </div>
                    </div>
                  </vs-td>
                  <vs-td style="width: 230px;">
                    <vx-tooltip style="display: inline-block;" v-if="tr.tipo_webinar == 2" text="Editar capacitación"
                      position="top" color="primary">
                      <vs-button style="display:inline-block" @click="f_cambio_estado(tr)"
                        radius icon-pack="feather" icon="icon-edit" color="primary" type="line"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip style="display: inline-block;" v-else :text="'Editar ' + tipoSeminario" position="top"
                      color="primary">
                      <vs-button size="large" radius icon-pack="feather" icon="icon-edit"
                        @click="editarFormulario(tr)" color="primary"
                        type="line"></vs-button>
                    </vx-tooltip>
                    <!-- <vx-tooltip style="display: inline-block;" :text="'Detalle ' + tipoSeminario" position="top"
                      color="dark">
                      <vs-button size="large" class="ml-1" radius icon-pack="feather" icon="icon-list"
                        @click="asistentesSeminario(tr)" color="dark" type="line"></vs-button>
                    </vx-tooltip> -->
                    <!-- Botón encuestas — solo para capacitaciones -->
                    <vx-tooltip v-if="tr.tipo_webinar == '2'" style="display: inline-block;" text="Encuestas" position="top" color="warning">
                      <vs-button size="large" class="ml-1" radius icon-pack="feather" icon="icon-clipboard"
                        @click="abrirEncuestas(tr)" color="warning" type="line"></vs-button>
                    </vx-tooltip>
                    <vx-tooltip style="display: inline-block;" :text="'Eliminar ' + tipoSeminario" position="top"
                      color="danger">
                      <vs-button size="large" radius icon-pack="feather" icon="icon-trash" @click="eliminarSeminario(tr)"
                        color="danger" type="line"></vs-button>
                    </vx-tooltip>
                  </vs-td>
                </vs-tr>
              </template>
            </vs-table>
          </vx-card>
          <!--TEMAS DE CAPACITACION-->
          <vs-card class="w-full" style="min-height:500px;" v-if="MenuCapacitacion == 1">
            <vs-button color="primary" type="border" @click="MenuCapacitacion = 0;">← Regresar</vs-button>
            <temas />
          </vs-card>
          <!--REPORTE CAPACITACIONES-->
          <vx-card v-if="MenuCapacitacion == 2" title="Reporte de capacitaciones" title-color="primary">
            <vs-button color="primary" type="border" @click="MenuCapacitacion = 0;">← Regresar</vs-button>
            <!-- <ReporteCapacitacionesVue :lista_asesores="lista_asesores" :periodos="periodos"
              :arregloCapacitadores="arregloCapacitadores" /> -->
            <CertificadosReporteCapacitaciones />
          </vx-card>
          <!--CREAR  CAPACITACION-->
          <vx-card v-if="MenuCapacitacion == 3" title="Crear capacitaciones"
            :subtitle="'Periodo ' + periodo_seminarios.descripcion" title-color="primary">
            <vs-button color="primary" type="border" @click="MenuCapacitacion = 0;">← Regresar</vs-button>
            <CrearCapacitacionVue :lista_asesores="lista_asesores" :periodos="periodos"
              :arregloCapacitadores="arregloCapacitadores" :periodoSelect="periodo_seminarios"
              @recharge="rechargeCapacitacion" />
          </vx-card>
        </div>
      </vs-tab>
      <vs-tab label="Resumen Webinars" v-if="usuario.id_group == 1">
        <div>
          <ResumenSeminarios />
        </div>
      </vs-tab>
      <vs-tab label="Encuestas Prolipa" v-if="usuario.id_group == 1 || usuario.id_group == 5">
        <ScreenEncuestasVue />
      </vs-tab>
    </vs-tabs>
    <!--modales-->
    <!-- MODAL PARA VER EL LINK DEL SEMINARIO-->
    <vs-popup class="holamundo" title="Link del seminario" :active.sync="popupVerlink">
      <a :href="url" target="_blank"> {{ url }} </a>
    </vs-popup>
    <!-- MODAL PARA VER EL DETALLE  DEL SEMINARIO-->
    <vs-popup title="Listado de Asistentes" fullscreen :active.sync="popupAsistentes">
      <div style="display:flex;flex-direction: column;">
        <div>
          <vs-list>
            <vs-list-header color="success" :title="title"></vs-list-header>
            <div v-if="tipo == '1'" style="margin-top:10px;">
              <vs-list-item color="primary" title="Cantidad Registrados" :subtitle="cant_registrados"></vs-list-item>
            </div>
            <div v-else style="margin-top:10px;">
            </div>
            <vs-list-item color="primary" title="Total asistentes" :subtitle="cantidad_asistentes"></vs-list-item>
            <vs-list-item color="primary" title="Total Encuestas llenadas" :subtitle="cantidad_encuestas"></vs-list-item>
          </vs-list>
        </div>
      </div>
      <vs-tabs alignment="center">
        <vs-tab label="Asistencia">
          <div>
            <vs-table stripe pagination max-items="10" search :data="asistentes">
              <template slot="thead">
                <vs-th style="width: 60px;">#</vs-th>
                <vs-th sort-key="Datos">Datos</vs-th>
                <vs-th sort-key="Email">Email</vs-th>
                <vs-th sort-key="Rol">Rol</vs-th>
                <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                <vs-th sort-key="Asistencia">Asistencia</vs-th>
              </template>
              <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                  <vs-td> {{ indextr + 1 }} </vs-td>
                  <vs-td>
                    Nombres:
                    <br>
                    <span style="font-weight:600;  ">
                      {{ tr.nombres }} {{ tr.apellidos }}<br>
                    </span>
                    Cedula:
                    <br>
                    <span style="font-weight:600;  ">
                      {{ tr.cedula }}<br>
                    </span>
                  </vs-td>
                  <vs-td> {{ tr.email }} </vs-td>
                  <vs-td> {{ tr.rol }} </vs-td>
                  <vs-td>
                    {{ tr.nombreInstitucion }}
                  </vs-td>
                  <td>
                    <div v-if="tr.asistencia == 1">
                      <vs-chip color="success">
                        Si
                      </vs-chip>
                    </div>
                    <div v-else>
                      <vs-chip color="danger">
                        No
                      </vs-chip>
                    </div>
                  </td>
                </vs-tr>
              </template>
            </vs-table>
          </div>
        </vs-tab>
        <vs-tab label="Respuestas">
          <div>
            <detalleSeminarios />
          </div>
        </vs-tab>
      </vs-tabs>
    </vs-popup>
    <vs-popup title="Seminario" :active.sync="popupSeminario">
      <div style="font-size: 12px;">Institución:</div>
      <v-select class="w-full mb-3" :disabled="institucion_disabled" @input="getPeriodoInstitucion()"
        :options="instituciones" :reduce="instituciones => instituciones" label="nombre_institucion"
        v-model="institucion"></v-select>
      <vs-input class="inputx mb-3 w-full" label="Nombre seminario" v-model="nombre_seminario" />
      <!-- <vs-input class="inputx mb-3 w-full" label="Descripción" v-model="descripcion_seminario"/> -->
      <div class="vx-col w-full">
        <vs-input class="mb-3 w-full" label="Descripción seminario" v-model="descripcion_seminario" />
      </div>
      <vs-input class="inputx mb-3 w-full" label="Link de reunión" v-model="link_reunion" />
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full">
          <div style="font-size: 12px;">Fecha inicio: </div>
          <flat-pickr class="mb-3 w-full" :config="configdateTimePicker" v-model="fecha_inicio"
            placeholder="Fecha inicio" />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <div style="font-size: 12px;">Fecha fin: </div>
          <flat-pickr class="mb-3 w-full" :config="configdateTimePicker" v-model="fecha_fin" placeholder="Fecha inicio" />
        </div>
      </div>
      <div class="vx-row mb-4">
        <div class="vx-col sm:w-1/2 w-full">
          <vs-input class="inputx mb-3 w-full" label="Capacitador" v-model="capacitador" />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <vs-input class="inputx mb-3 w-full" type="number" label="Cantidad de asistentes" v-model="cant_asistentes" />
        </div>
      </div>
      <div class="vx-row mb-4">
        <div class="vx-col sm:w-1/2 w-full">
          <vs-input class="inputx mb-3 w-full" label="Link recurso posterior" v-model="link_recurso" />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          <vs-input class="inputx mb-3 w-full" label="Clave acceso" v-model="clave_recurso" />
        </div>
      </div>
      <div class="vx-row mb-base">
        <div class="vx-col sm:w-1/2 w-full" align="center">
          <vs-switch @input="institucionActiva()" color="primary" icon-pack="feather" vs-icon-on="icon-check-circle"
            vs-icon-off="icon-slash" v-model="tipo_webinar" style="width: 150px;">
            <span slot="on">Webinar</span>
            <span slot="off">Seminario</span>
          </vs-switch>
        </div>
        <div class="vx-col sm:w-1/2 w-full" align="center">
          <vs-switch color="dark" icon-pack="feather" vs-icon-on="icon-check-circle" vs-icon-off="icon-slash"
            v-model="asistencia_activa" style="width: 150px;">
            <span slot="on">asistencia activa</span>
            <span slot="off">asistencia inactiva</span>
          </vs-switch>
        </div>
      </div>
      <vs-button v-if="editar_activo == false" color="success" class="w-full mb-1" type="gradient"
        @click="agregar_seminario()">Guardar</vs-button>
      <vs-button v-else color="primary" class="w-full mb-1" type="gradient"
        @click="editar_seminario();">Editar</vs-button>
    </vs-popup>
    <!--Modal crear capacitacion (nuevo unificado)-->
    <vs-popup title="Crear capacitacións" :active.sync="modalCreateCapacitacion">
      <CapacitacionFormModalVue v-if="modalCreateCapacitacion" mode="create"
        :arregloCapacitadores="arregloCapacitadores" :periodoSelect="periodo_seminarios"
        @recharge="rechargeSeminarios" @close="modalCreateCapacitacion = false" />
    </vs-popup>
    <!--Modal editar capacitacion-->
    <vs-popup title="Detalles capacitación:" :active.sync="modalAdd" fullscreen>
      <CapacitacionFormModalVue v-if="modalAdd" mode="edit" :arregloCapacitadores="arregloCapacitadores"
        :capacitacion="capacitacion" :periodoSelect="periodo_seminarios" @rechargeSeminarios="rechargeSeminarios" />
    </vs-popup>
    <!--modal exportar capacitacion-->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel"
      accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
      <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
        <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
      </vs-alert>
      <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
      <v-select v-model="selectedFormat" :options="formats" class="my-4" />
    </vs-prompt>

    <!-- MODAL ENCUESTAS DE CAPACITACIÓN -->
    <vs-popup title="Encuestas de la capacitación" :active.sync="modalEncuestas" style="z-index:99999;">
      <certificados-asignar-encuesta
        v-if="modalEncuestas && capacitacionEncuesta"
        :capacitacion="capacitacionEncuesta"
        :key="capacitacionEncuesta.id_seminario"
      />
    </vs-popup>
  </div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css';
import detalleSeminarios from './detalle_seminarios.vue'
import ResumenSeminarios from './components/ResumenSeminarios.vue'
import temas from '../admin/capacitaciones.vue'
import ReporteCapacitacionesVue from './components/ReporteCapacitaciones.vue';
import CrearCapacitacionVue from './components/CrearCapacitacion.vue'
import CapacitacionFormModalVue from './components/CapacitacionFormModal.vue'
import CertificadosAsignarEncuesta from './components/CertificadosAsignarEncuesta.vue'
const CertificadosReporteCapacitaciones = () => import('./CertificadosReporteCapacitaciones.vue');
import reporte from '../capacitaciones/reporte.vue';
import ScreenEncuestasVue from '../asesor/encuestas/ScreenEncuestas.vue';

Vue.use(axios)
export default {
  components: {
    'v-select': vSelect,
    flatPickr,
    detalleSeminarios,
    ResumenSeminarios,
    temas,
    ReporteCapacitacionesVue,
    CrearCapacitacionVue,
    CapacitacionFormModalVue,
    CertificadosAsignarEncuesta,
    reporte,
    ScreenEncuestasVue,
    CertificadosReporteCapacitaciones
  },
  data() {
    return {
      usuario:[],
      modalAdd: false,
      modalCreateCapacitacion: false,
      tipoSeminario: 'Capacitación',
      menuTipo: '2',
      title: '',
      tipo: '',
      popupVerlink: false,
      popupSeminario: false,
      seminarios: [],
      nombre_seminario: '',
      descripcion_seminario: '',
      instituciones: [],
      fecha_inicio: '',
      fecha_fin: '',
      configdateTimePicker: {
        enableTime: true,
        dateFormat: 'Y-m-d H:i:s'
      },
      editar_activo: false,
      institucion: {},
      id_seminario: '',
      link_reunion: '',
      capacitador: '',
      cant_asistentes: 0,
      asistencia_activa: '',
      popupAsistentes: false,
      asistentes: [],
      tipo_webinar: '0',
      institucion_disabled: false,
      url: '',
      cant_respuestas: '',
      cant_registrados: '',
      cantidad_asistentes: '',
      cantidad_encuestas: '',
      tipo_web: 0,
      periodo: '',
      link_recurso: '',
      clave_recurso: '',
      periodos: [],
      periodo_seminarios: {},
      //variables para capacitaciones
      nombreInstitucion: '',
      institucion_id: '',
      institucion_id_temporal: '',
      estado_institucion_temporal: 0,
      periodo_id_temporal: 0,
      nombreInstitucionTemporal: '',
      filtroInstituciones: [],
      estado: '0',
      messageError: "",
      ciudadSelect: '',
      error: false,
      MenuCapacitacion: 0,
      capacitacion: {},
      region: '',
      filtro_fecha_ini: '',
      filtro_fecha_fin: '',
      m_asesores: '',
      lista_asesores: '',
      agenda_capacitaciones: [],
      //para exportar
      codigoSelected: [],
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      fileName: null,
      selectedFormat: 'xls',
      cellAutoWidth: true,
      activePrompt: false,
      arregloCapacitadores: [],
      arregloPeriodos: [],
      // encuestas de capacitación
      modalEncuestas: false,
      capacitacionEncuesta: null,
      gruposDisponibles: [],
      gruposSeleccionados: [6, 11, 13], // Docentes, Asesores, Evaluación Docente por defecto
    }
  },
  mounted() {
    let me = this;
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.getPeriodos()
    this.getInstituciones()
    me.f_lista_Asesores();
    me.getCapacitadores()
    if(me.usuario.capacitador == 1 && (me.usuario.id_group != 1 && me.usuario.id_group != 5)){
      me.menuTipo = 3
    }
  },
  methods: {
    getCapacitadores() {
      let me = this;
      this.$http.get(this.$server_url + 'getCapacitadores')
        .then(function (res) {
          me.arregloCapacitadores = res.data
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    //METODOS DE LAS CAPACITACIONES
    f_filtro_fechas(item) {
      let me = this;
      if (item == 0) {
        me.filtro_fecha_ini = "";
        me.filtro_fecha_fin = "";
        me.m_asesores = ""
      }
      me.f_array_filtro_contenido();
    },
    f_array_filtro_contenido() {
      let me = this;
      me.seminarios = [];
      if (me.filtro_fecha_ini != "") { //filtro con fecha inicio
        if (me.filtro_fecha_fin != "") { //filtro con fecha inicio y fin
          if (me.m_asesores != "") { //filtro fecha inicio, fecha fin y asesor
            // console.log('f ini f_fin y asesor')
            for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
              if (me.agenda_capacitaciones[index].fecha_inicio.substr(0, 10) >= me.filtro_fecha_ini &&
                me.agenda_capacitaciones[index].fecha_fin.substr(0, 10) <= me.filtro_fecha_fin &&
                me.agenda_capacitaciones[index].cedula == me.m_asesores.cedula) {
                me.seminarios.push(me.agenda_capacitaciones[index])
              }
            }
          } else { //filtro fecha inicio, fecha fin sin asesor
            // console.log('f ini f_fin')
            for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
              if (me.agenda_capacitaciones[index].fecha_inicio.substr(0, 10) >= me.filtro_fecha_ini &&
                me.agenda_capacitaciones[index].fecha_fin.substr(0, 10) <= me.filtro_fecha_fin) {
                me.seminarios.push(me.agenda_capacitaciones[index])
              }
            }
          }
        } else if (me.m_asesores != "") { //filtro con fecha inicio y asesor
          // console.log('f_inic y asesor')
          for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
            if (me.agenda_capacitaciones[index].fecha_inicio.substr(0, 10) >= me.filtro_fecha_ini &&
              me.agenda_capacitaciones[index].cedula == me.m_asesores.cedula) {
              me.seminarios.push(me.agenda_capacitaciones[index])
            }
          }
        } else { //filtro con fecha inicio y asesor
          // console.log('solo f_inic')
          for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
            if (me.agenda_capacitaciones[index].fecha_inicio.substr(0, 10) >= me.filtro_fecha_ini) {
              me.seminarios.push(me.agenda_capacitaciones[index])
            }
          }
        }
        return
      }
      if (me.filtro_fecha_fin != "") { //filtro con fecha fin
        if (me.m_asesores != "") {
          // console.log('f_fin y asesor')
          for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
            if (me.agenda_capacitaciones[index].fecha_fin.substr(0, 10) <= me.filtro_fecha_fin &&
              me.agenda_capacitaciones[index].cedula == me.m_asesores.cedula) {
              me.seminarios.push(me.agenda_capacitaciones[index])
            }
          }
        } else {
          // console.log('solo_f_fin')
          for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
            if (me.agenda_capacitaciones[index].fecha_fin.substr(0, 10) <= me.filtro_fecha_fin) {
              me.seminarios.push(me.agenda_capacitaciones[index])
            }
          }
        }
        return
      }
      if (me.m_asesores != "") { //filtro con asesor
        // console.log('solo_asesor')
        for (let index = 0; index < me.agenda_capacitaciones.length; index++) {
          if (me.agenda_capacitaciones[index].cedula == me.m_asesores.cedula) {
            me.seminarios.push(me.agenda_capacitaciones[index])
          }
        }
        return
      }
      // console.log('sin fechas, sin asesor')
      me.seminarios = me.agenda_capacitaciones;
    },
    f_lista_Asesores(item) {
      let me = this;
      this.$http.get(this.$server_url + 'listaAsesores')
        .then(function (res) {
          me.lista_asesores = res.data
          // console.log(res.data)
          me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    //para importar a excel
    exportToExcel() {
      let headerTitle = ['Tipo', 'Nombre', 'Area', 'Capacitadores', 'Asesor', 'Institucion', 'Link', 'Asistentes', 'Fecha capacitación', 'Hora inicio', 'Hora fin', 'Horas capacitación', 'fecha create', 'estado'];
      let headerVal = ['tipo', 'nombre', 'nombrearea', 'capacitadores', 'asesor', 'institucionFinal', 'link_reunion', 'cant_asistentes', 'fecha_inicio', 'hora_inicio', 'hora_fin', 'horas_capacitacion', 'created_at', 'estadoCapacitacion'];
      import('@/vendor/Export2Excel').then(excel => {
        const data = this.formatJson(headerVal, this.codigoSelected)
        excel.export_json_to_excel({
          header: headerTitle,
          data,
          filename: this.fileName,
          autoWidth: this.cellAutoWidth,
          bookType: this.selectedFormat,
        })
        this.clearFields()
        this.guardarActivo = '';
        this.generarActivo = ' ';
        this.textAlertCant = '';
        this.cantidad = '';
        this.codigoSelected = [];
      })
    },

    formatJson(filterVal, jsonData) {
      console.log(jsonData)
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'tipo') {
          return v[j] === 0 ? 'Presencial' : 'Virtual';
        }
        if (j === 'horas_capacitacion') {
          return v[j] != null && v[j] !== '' ? v[j] : 6;
        }
        return v[j];
      }))
    },
    //limpiar campos para exportar de nuevo
    clearFields() {
      this.fileName = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xls'
    },
    //FIN DE METODOS DE LAS CAPACITACIONES
    verEnlace(url) {
      let me = this;
      me.url = url;
      me.popupVerlink = true;
    },
    getPeriodos() {
      let me = this;
      this.$http.get(this.$server_url + 'get_periodos_seminarios')
        .then(function (res) {
          let datos = res.data
          //me.periodos = datos.filter(p => p.idperiodoescolar != 20 && p.idperiodoescolar != 17 && p.idperiodoescolar != 15 && p.idperiodoescolar != 14 && p.idperiodoescolar > 11)
          me.periodos = datos
          me.periodo_seminarios = me.periodos[0]
          me.getSeminarios()
        })
    },
    getSeminarios() {
      let me = this;
      me.seminarios = []
      if (me.periodo_seminarios == null | me.periodo_seminarios == "" || me.periodo_seminarios == undefined) {
        me.$vs.notify({ text: 'Seleccione un período por favor', color: 'warning', iconPack: 'feather', icon: 'icon-check' })
        return
      }
      me.$vs.loading()
      this.$http.get(this.$server_url + 'get_seminarios/' + me.periodo_seminarios.idperiodoescolar)
        .then(function (res) {
          me.$vs.loading.close()
          let datos = res.data
          if (me.menuTipo == 2) {
            me.agenda_capacitaciones = datos.filter(p => p.tipo_webinar == me.menuTipo)
            me.seminarios = datos.filter(p => p.tipo_webinar == me.menuTipo)
            return
          }
          if (me.menuTipo == 1) {
            me.seminarios = datos.filter(p => p.tipo_webinar == me.menuTipo)
            return
          } else {
            me.seminarios = datos.filter(p => p.tipo_webinar != "1" && p.tipo_webinar != "2")
            console.log('1', me.seminarios)
            return
          }
        })
        .catch(function (error) {
          me.$vs.loading.close()
        })
    },
    getInstituciones() {
      let me = this;
      me.$vs.loading()
      this.$http.get(this.$server_url + 'get_instituciones')
        .then(function (res) {
          me.instituciones = res.data
          me.$vs.loading.close()
        })
        .catch(function (error) {
          me.$vs.loading.close()
        })
    },
    //para obtener el perido atual
    getPeriodoInstitucion() {
      let me = this;
      this.$http.get(this.$server_url + 'institucionTraerPeriodo?institucion_id=' + me.institucion.id_institucion)
        .then(function (res) {
          me.periodo = res.data[0].periodo
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    agregar_seminario() {
      let me = this
      me.$vs.loading()
      if (me.tipo_webinar == "" || me.tipo_webinar == null || me.tipo_webinar == undefined) {
        me.tipo_web = "0"
      } else {
        me.tipo_web = me.tipo_webinar
      }
      let seminario = {
        'id_seminario': '',
        'nombre': me.nombre_seminario,
        'descripcion': me.descripcion_seminario,
        'fecha_inicio': me.fecha_inicio,
        'fecha_fin': me.fecha_fin,
        'link_reunion': me.link_reunion,
        'id_institucion': me.institucion.id_institucion,
        'capacitador': me.capacitador,
        'cant_asistentes': me.cant_asistentes,
        'asistencia_activa': me.asistencia_activa,
        'tipo_webinar': me.tipo_web,
        'periodo_id': me.periodo,
        'link_recurso': me.link_recurso,
        'clave_recurso': me.clave_recurso,
      }
      this.$http.post(this.$server_url + 'guardar_seminario', seminario)
        .then(function (res) {
          me.getSeminarios()
          me.popupSeminario = false
          me.$vs.loading.close()
          me.institucion.id_institucion = ""
          me.periodo = ""
        })
        .catch(function (error) {
          me.popupSeminario = false
          me.$vs.loading.close()
        })
    },
    f_cambio_estado(item) {
      let me = this;
      localStorage.setItem('asesorSeleccionado', item.id_usuario)
      localStorage.setItem('planificacion_cedula', item.cedula)
      localStorage.setItem('planificacion_asesor_id', item.id_usuario)
      me.capacitacion = item
      me.modalAdd = true;
    },
    editarFormulario(item) {
      let me = this
      me.capacitador = ''
      me.cant_asistentes = ''
      me.id_seminario = item.id_seminario
      me.nombre_seminario = item.nombre
      me.descripcion_seminario = item.descripcion
      me.fecha_inicio = item.fecha_inicio
      me.fecha_fin = item.fecha_fin
      me.link_reunion = item.link_reunion
      me.institucion = item
      me.capacitador = item.capacitador
      me.cant_asistentes = item.cant_asistentes
      me.asistencia_activa = item.asistencia_activa
      me.tipo_webinar = item.tipo_webinar
      me.link_recurso = item.link_recurso
      me.clave_recurso = item.clave_recurso
      me.institucionActiva()
      me.editar_activo = true
      me.popupSeminario = true
    },
    editar_seminario() {
      let me = this
      me.$vs.loading()
      const seminario = {
        'id_seminario': me.id_seminario,
        'nombre': me.nombre_seminario,
        'descripcion': me.descripcion_seminario,
        'fecha_inicio': me.fecha_inicio,
        'fecha_fin': me.fecha_fin,
        'link_reunion': me.link_reunion,
        'id_institucion': me.institucion.id_institucion,
        'capacitador': me.capacitador,
        'cant_asistentes': me.cant_asistentes,
        'asistencia_activa': me.asistencia_activa,
        'tipo_webinar': me.tipo_webinar,
        'link_recurso': me.link_recurso,
        'clave_recurso': me.clave_recurso,
      }

      this.$http.post(this.$server_url + 'guardar_seminario', seminario)
        .then(function (res) {
          me.$vs.loading.close()
          me.getSeminarios()
          me.popupSeminario = false
          me.modalAdd = false
          if (res.data.message) {
            me.$vs.notify({
              text: res.data.message,
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-check'
            })
          }

        })
        .catch(function (error) {
          me.popupSeminario = false
          me.$vs.loading.close()
        })
    },
    detalleSeminario(item) {
      let me = this
      me.$router.push('/detalle_seminarios/' + item.id_seminario)
    },
    eliminarSeminario(item) {
      let me = this
      me.id_seminario = item.id_seminario
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirmar`,
        text: '¿Está seguro de eliminar este seminario?',
        accept: this.confirmEliminarSeminario
      })
    },
    confirmEliminarSeminario() {
      let me = this
      this.$http.get(this.$server_url + 'eliminar_seminario/' + me.id_seminario)
        .then(function (res) {
          if (res.data && res.data.status === 0) {
            me.$vs.notify({ text: res.data.message, color: 'warning', iconPack: 'feather', icon: 'icon-alert-circle', time: 6000 })
            return
          }
          me.getSeminarios()
          me.$vs.loading.close()
        })
        .catch(function (error) {
          const msg = (error.response && error.response.data && error.response.data.message)
            ? error.response.data.message
            : 'No se puede eliminar esta capacitación'
          me.$vs.notify({ text: msg, color: 'danger', iconPack: 'feather', icon: 'icon-x', time: 6000 })
          me.$vs.loading.close()
        })
    },
    //para obtener el conteno para webinar
    getContenoWebinar(seminario_id) {
      let me = this;
      this.$http.get(this.$server_url + 'seminario?contar=yes&seminario_id=' + seminario_id)
        .then(function (res) {
          me.cant_registrados = res.data.registrados[0].registrados
          me.cantidad_asistentes = res.data.asistentes[0].asistentes;
          me.cantidad_encuestas = res.data.encuestas;
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    asistentesSeminario(item) {
      let me = this
      //Para las respuestas
      me.tipo = item.tipo_webinar
      if (me.tipo == 1) {
        me.title = "Detalle webinar" + " " + item.nombre
      } else {
        me.title = "Detalle Seminario" + " " + item.nombre
      }
      me.cant_respuestas = item.cant_respuestas
      localStorage.setItem('id_seminario', item.id_seminario)
      localStorage.data_seminario = JSON.stringify(item);
      //Para los asistentes
      me.getContenoWebinar(item.id_seminario)
      this.$http.get(this.$server_url + 'asistentes_seminario/' + item.id_seminario)
        .then(function (res) {
          me.asistentes = res.data
          me.popupAsistentes = true
          me.$vs.loading.close()
        })
        .catch(function (error) {
          me.$vs.loading.close()
        })
    },
    institucionActiva() {
      if (this.tipo_webinar == 1 || this.tipo_webinar == true) {
        this.institucion_disabled = true
      } else {
        this.institucion_disabled = false
      }
    },
    //=================CAPACITACIONES=//============
    rechargeCapacitacion(e) {
      let me = this;
      me.MenuCapacitacion = 0
      me.getSeminarios()
    },
    //recargar seminarios
    rechargeSeminarios() {
      let me = this;
      me.getSeminarios()
      me.popupSeminario = false
      me.modalAdd = false
      me.modalCreateCapacitacion = false
    },

    // ─── ENCUESTAS DE CAPACITACIÓN ───────────────────────────────────────────────
    abrirEncuestas(capacitacion) {
      this.capacitacionEncuesta = capacitacion;
      this.modalEncuestas = true;
    },
  },

  watch: {
    // Al cerrar el modal de encuestas, recarga la lista para actualizar el chip
    modalEncuestas(val) {
      if (!val) this.getSeminarios()
    }
  },
}
</script>
<style lang="css">
.select-asesores {
  text-transform: uppercase
}
</style>
