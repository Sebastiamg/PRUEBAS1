<template>
  <div id="dashboard-analytics">
    <InstitutionBanner
      :nombreInstitucion="nombreInstitucion"
      :imagenInsitucion="imagenInsitucion"
      :dataUrl="$data_url"
    />

    <HomeGlobales />

    <HomeDirectorWelcome :usuario="usuario" :aplica_matricula="aplica_matricula" />
    
    <!-- nomina colaboradores -->
    <div v-if="usuario.id_groups == 36">
      <HomeNomina :usuario="usuario" />
    </div>
    <!--NEET-->
    <div v-if="usuario.id_group == 31">
      <HomeNeetVue />
    </div>
    <!---SALLE DOCENTE-->
    <div v-if="usuario.id_group == 13">
      <Home_Salle_Docente />
    </div>
    <ProformasSummary
      :proformas="proformas"
      :pendientes="pendientes"
      :aprobadas="aprobadas"
      :anuladas="anuladas"
      :finalizadas="finalizadas"
      @ver-proformas="$router.push('/pedidos/libreria')"
    />

    <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-3" v-if="capacitaciones.length">
      <div style="background: white; border-radius: 8px; padding: 20px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);">
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
          <h2 style="font-size: 22px; font-weight: 600; color: #1f2937; margin: 0;">
            Capacitaciones
          </h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div v-for="(estados, anio) in resumenPorAnio" :key="anio" style="background: #f9fafb;
                      border: 1px solid #e2e8f0; border-radius: 8px;  padding: 16px;  text-align: center; transition: all 0.2s ease; position: relative;">

            <!-- <div
              style="position: absolute; top: 0; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, #6366f1, #8b5cf6); border-radius: 20px 20px 0 0;">
            </div> -->

            <div style="font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 12px; margin-top: 2px;">
              {{ anio }}
            </div>

            <div style="display: flex; justify-content: space-between; margin-bottom: 16px; gap: 8px;">
              <div style="flex: 1; background: #fef3c7; border-radius: 6px; padding: 8px;">
                <div style="font-size: 20px; font-weight: 700; color: #d97706; margin-bottom: 2px;">
                  {{ estados.pendiente }}
                </div>
                <div style="font-size: 10px; color: #92400e; font-weight: 600; text-transform: uppercase;">
                  Pendientes
                </div>
              </div>

              <div style="flex: 1; background: #d1fae5; border-radius: 6px; padding: 8px;">
                <div style="font-size: 20px; font-weight: 700; color: #059669; margin-bottom: 2px;">
                  {{ estados.finalizada }}
                </div>
                <div style="font-size: 10px; color: #065f46; font-weight: 600; text-transform: uppercase;">
                  Finalizadas
                </div>
              </div>
            </div>

            <vs-button @click="seleccionarAnio(anio)" icon-pack="feather" icon="icon-eye" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; border: none; border-radius: 8px; padding: 10px 20px; font-size: 13px; font-weight: 600;
                              box-shadow: 0 2px 8px rgba(99, 102, 241, 0.3); cursor: pointer;">
              Ver detalles
            </vs-button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal con capacitaciones -->
    <vs-popup v-if="mostrarModal" :active.sync="mostrarModal" title="Capacitaciones - Detalles" fullscreen
      class="informacionformhijo" @close="getCapacitaciones();">
      <div style="background: white; border-bottom: 1px solid #e5e7eb; padding: 24px;">
        <div style="display: flex; align-items: center; justify-content: space-between;">
          <div style="display: flex; align-items: center;">
            <svg style="height: 24px; width: 24px; color: #2563eb; margin-right: 12px;" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h2 style="font-size: 18px; font-weight: 600; color: #111827;">Gestión de Capacitaciones</h2>
          </div>
          <vs-button type="flat" color="primary" class="text-sm" icon-pack="feather" icon="icon-refresh-cw"
            @click="getCapacitaciones(); $vs.notify({ title: 'Lista actualizada', text: 'Los datos se han refrescado correctamente.', color: 'success', position: 'top-center' });">
            Actualizar
          </vs-button>
        </div>
      </div>
      <div>
        <!-- Lista de Capacitaciones -->
        <div style="padding: 20px;">
          <div v-for="cap in capacitacionesFiltradasPorEstado" :key="cap.id"
            style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; margin-bottom: 24px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">

            <!-- Header de la capacitación -->
            <div
              style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%); padding: 20px; border-bottom: 1px solid #e5e7eb;">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
                <!-- Título e institución a la izquierda -->
                <div style="flex: 1;">
                  <h3 style="font-size: 20px; font-weight: 600; color: #1f2937; margin: 0 0 8px 0;">{{ cap.nombre }}
                  </h3>
                  <p style="margin: 0; font-size: 14px; color: #6b7280;">
                    <strong style="color: #374151;">Institución:</strong> {{ cap.nombreInstitucion }}
                  </p>
                </div>

                <!-- Fecha y horario a la derecha en recuadro bonito -->
                <div
                  style="background: white; border: 1px solid #d1d5db; border-radius: 8px; padding: 12px 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); min-width: 200px;">
                  <div style="display: flex; align-items: center; margin-bottom: 6px;">
                    <svg style="width: 16px; height: 16px; color: #3b82f6; margin-right: 6px;" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span style="font-size: 13px; font-weight: 600; color: #374151;">{{ formatFecha(cap.fecha_inicio)
                      }}</span>
                  </div>
                  <div style="display: flex; align-items: center;">
                    <svg style="width: 16px; height: 16px; color: #10b981; margin-right: 6px;" fill="none"
                      viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span style="font-size: 13px; font-weight: 600; color: #374151;">{{
                      formatearHoraTexto(cap.hora_inicio) }} - {{ formatearHoraTexto(cap.hora_fin) }}</span>
                  </div>
                </div>
              </div>

              <!-- Chips en línea separada -->
              <div style="display: flex; gap: 12px; align-items: center;">
                <vs-chip :color="estadoLabelColorTipo(cap.tipo)" size="small">{{ estadoLabelTipo(cap.tipo) }}</vs-chip>
                <vs-chip :color="estadoLabelColor(cap.estado_capacitacion)" size="small">{{
                  estadoLabel(cap.estado_capacitacion) }}</vs-chip>
              </div>
            </div>


            <!-- Contenido principal -->
            <div style="padding: 20px;">
              <!-- Subtitle con información de la capacitación -->
              <div
                style="margin-bottom: 20px; padding: 12px; background: #f9fafb; border-radius: 6px; border-left: 3px solid #3b82f6;">
                <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 600; color: #374151;">Información de la
                  Capacitación</h4>
                <p style="margin: 0; font-size: 13px; color: #6b7280; line-height: 1.4;">
                  {{ cap.nombreInstitucion }}
                </p>
              </div>

              <!-- Botones de reunión -->
              <div v-if="cap.link_reunion" style="margin-bottom: 20px;">
                <div
                  style="display: flex; gap: 12px; align-items: center; justify-content: center; padding: 16px; background: #f0f9ff; border-radius: 8px; border: 1px solid #0ea5e9;">
                  <a :href="cap.link_reunion" target="_blank" rel="noopener noreferrer"
                    style="display: inline-flex; align-items: center; padding: 12px 24px; background: #0ea5e9; color: white; text-decoration: none; border-radius: 8px; font-weight: 500; transition: all 0.2s;">
                    <svg style="width: 18px; height: 18px; margin-right: 8px;" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Unirse a la reunión
                  </a>
                  <button @click="copiarLink(cap.link_reunion)"
                    style="padding: 12px; background: #e5e7eb; border: none; border-radius: 8px; cursor: pointer; transition: all 0.2s;"
                    :title="copiado ? 'Copiado!' : 'Copiar enlace'">
                    <svg style="width: 18px; height: 18px; color: #6b7280;" fill="none" viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Observación administrativa -->
              <div v-if="cap.observacion_admin" style="margin-top: 20px;">
                <div style="border: 1px solid #f63b3b; border-radius: 8px; overflow: hidden; background: white;">
                  <div
                    style="background: #f63b3bea; color: white; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between;">
                    <div style="display: flex; align-items: center;">
                      <svg style="width: 20px; height: 20px; margin-right: 8px;" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span style="font-weight: 600; font-size: 15px;">Observación</span>
                    </div>
                    <span
                      style="background: rgba(255,255,255,0.2); padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 500;">
                      Importante
                    </span>
                  </div>
                  <div
                    style="padding: 20px; background: #f8fafc; border-top: 1px solid #e2e8f0; max-height: 200px; overflow-y: auto;">
                    <p
                      style="margin: 0; line-height: 1.7; color: #374151; white-space: pre-line; font-size: 14px; word-wrap: break-word;">
                      {{ cap.observacion_admin }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="!capacitacionesFiltradasPorEstado.length"
          style="text-align: center; color: #6b7280; padding: 40px 0; font-size: 18px;">
          No hay capacitaciones para los filtros seleccionados.
        </div>
      </div>
    </vs-popup>


    <div v-if="usuario.id_group == 22 || usuario.id_group == 23">
      <HomeFacturadorAdmin />
    </div>
    <div>
      <docenteHome v-if="usuario.id_group == 6" :ObjectInstitucion="ObjectInstitucion"
        :verEvaluacionSalle="verEvaluacionSalle"></docenteHome>
    </div>
    <!--asesor-->
    <div>
      <!-- <asesorHome :cantTicketsAbiertos="cantTicketsAbiertos" v-if="usuario.id_group == 11" -->
      <asesorHome v-if="usuario.id_group == 11"
        :cantFormsDocente="cantFormsDocente" :cantFormsSolicitudes="cantFormsSolicitudes">
      </asesorHome>
    </div>
    <div v-if="usuario.id_group == 33 ">
      <ScreenSolicitud />
    </div>
    <HomeDirectorExtras v-if="usuario.id_group == 10" :usuario="usuario" :instituciones_director="instituciones_director" />

    <HomeSalleAdmin v-if="usuario.id_group == 12"
      :usuario="usuario"
      :listaUsuariosSalle="listaUsuariosSalle"
      :evaluaciones_salle="evaluaciones_salle"
    />
    <div v-if="usuario.id_group == 4">
      <HomeEstudianteVue />
    </div>
    <HomeAdmin v-if="usuario.id_group == 1"
      :usuario="usuario"
      :cantTicketsAbiertos="cantTicketsAbiertos"
      :cantTicketsCerrados="cantTicketsCerrados"
      :usuarioActivos="usuarioActivos"
      :usuariosProlipa="usuariosProlipa"
      :cantFormsSolicitudes="cantFormsSolicitudes"
      :cantFormsDocente="cantFormsDocente"
      :t_curso1="t_curso1"
      :t_curso0="t_curso0"
      :c_eval="c_eval"
      :c_preg0="c_preg0"
      :c_preg1="c_preg1"
      :c_preg2="c_preg2"
      :c_preg3="c_preg3"
      :c_preg4="c_preg4"
      :c_multi0="c_multi0"
      :c_multi1="c_multi1"
      :c_juegos0="c_juegos0"
      :c_codigos="c_codigos"
      :c_codigos_total="c_codigos_total"
      :c_semi="c_semi"
      :c_enc="c_enc"
      :totalProReservar="totalProReservar"
      :totalProDeposito_Prolipa="totalProDeposito_Prolipa"
      :totalProStock_Prolipa="totalProStock_Prolipa"
      :totalProDeposito_CALMED="totalProDeposito_CALMED"
      :totalProStock_CALMED="totalProStock_CALMED"
      @ver-solicitudes="verSolicitudFormulario"
      @red-stock-productos="Red_StockProductos"
    />
    <vx-card v-if="usuario.id_group == 25">
      <screen_gerenciaVue />
    </vx-card>
    <!--bodega admin-->
    <div>
      <HomeBodegaAdminVue v-if="usuario.id_group == 27" />
    </div>
    <vs-popup title="Seleccione su institución" :active.sync="popupActive">
      <p class="mb-6">Por favor seleccione la institución a la que pertenece antes de continuar.</p>
      Ciudad:
      <v-select class="w-full mb-6" :options="ciudades" v-model="ciudad" @input="verInstCiudad()"
        :dir="$vs.rtl ? 'rtl' : 'ltr'" />
      Institución:
      <v-select class="w-full mb-6" :options="instituciones" v-model="institucion" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
      <vs-button class="w-full mt-4 mb-1" @click="asignarInstitucion()" color="success"
        type="filled">Guardar</vs-button>
    </vs-popup>
    <!--MODAL PARA CAMBIAR DE PASSWORD-->
    <vs-popup class="holamundo" title="Actualización de contraseña" :active.sync="popupChangePassword"
      @close="handleClose" :class="{ 'hide-close': !showCloseButton }">
      <popupChangePasswordVue v-if="popupChangePassword" @changeRecarge="changeRecarge" />
    </vs-popup>
  </div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
import VueApexCharts from 'vue-apexcharts'
import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import ChangeTimeDurationDropdown from '@/components/ChangeTimeDurationDropdown.vue'
import VxTimeline from '@/components/timeline/VxTimeline'
import vSelect from 'vue-select'
import InstitutionBanner from './homesGroup/shared/InstitutionBanner.vue'
import ProformasSummary from './homesGroup/shared/ProformasSummary.vue'
import HomeGlobales from './homesGroup/shared/HomeGlobales.vue'
import HomeDirectorWelcome from './homesGroup/HomeDirectorWelcome.vue'
import HomeDirectorExtras from './homesGroup/HomeDirectorExtras.vue'
import HomeSalleAdmin from './homesGroup/HomeSalleAdmin.vue'
import HomeAdmin from './homesGroup/HomeAdmin.vue'
import HomeFacturadorAdmin from './homesGroup/HomeFacturadorAdmin.vue'
import HomeNomina from './homesGroup/HomeNomina.vue'
import docenteHome from './home/docenteHome.vue'
const asesorHome = () => import('./home/asesorHome.vue')
// import io from 'socket.io-client';
// import EstudiantesMatricula from './gestion_matricula/estudiante/matricula_estudiante.vue'
import popupChangePasswordVue from './home/components/todos/popupChangePassword.vue'
import screen_gerenciaVue from './home/gerencia/screen_gerencia.vue'
import HomeNeetVue from '@/views/home/neet/HomeNeet'
import moment from 'moment'
const HomeBodegaAdminVue = () => import('./home/bodega/dashboardBodegaAdmin.vue')
const HomeEstudianteVue = () =>  import('./home/HomeEstudiante.vue')
const ScreenSolicitud = () =>  import('./facturacion/10_10_1_4/Reposicion/homelibreria.vue')
import NotificationService from '@/services/NotificationService';
const Home_Salle_Docente = () => import('./home/Home_Salle_Docente.vue');
export default {
  data() {
    return {
      // socket: io("https://socket.prolipadigital.com.ec"),
      popupActive: false,
      instituciones: [],
      proformas:[],
      anuladas:'',
      pendientes:'',
      finalizadas:'',
      aprobadas:'',
      ciudades: [],
      ciudad: '',
      institucion: '',
      usuario: [],
      curso: [],
      cursod: [],
      tareasd: [],
      contenidos: [],
      tareasp: [],
      tarease: [],
      subscribersGained: {
        series: [{
          name: 'Subscribers',
          data: [0, 3, 20, 4]
        }],
      },
      usr_live: 0,
      usr_students: [],
      usr_teachers: [],
      linkEvaluacion: '',
      vectorLink: [],
      urlBack: '',
      urlV: [],
      urlOrigen: '',
      t_curso0: 0,
      t_curso1: 0,
      c_eval: 0,
      c_preg0: 0,
      c_preg1: 0,
      c_preg2: 0,
      c_preg3: 0,
      c_preg4: 0,
      c_multi0: 0,
      c_multi1: 0,
      c_juegos0: 0,
      c_juegos1: 0,
      c_semi: 0,
      c_enc: 0,
      c_user0: 0,
      c_user1: 0,
      c_user2: 0,
      c_user3: 0,
      c_codigos: 0,
      c_codigos_total: 0,
      c_accesos: 0,
      d_accesos: 0,
      e_accesos: 0,
      a_accesos: 0,
      conectados: 0,
      reset_storage: 50, // accesos a la plataforma, y vuelve a recargar el localStorage, para verificar cambios futuros
      cant_eval: [],
      cantArchivos: [],
      instituciones_director: [],
      //salle
      listaUsuariosSalle: '',
      listaAdmins: '',
      usuarioActivos: 0,
      usuariosProlipa: 0,
      salleInstituciones: '',
      cantTicketsAbiertos: '',
      cantTicketsCerrados: '',
      areas_salle: 0,
      asignaturas_salle: 0,
      evaluaciones_salle: 0,
      aplica_matricula: 0,
      //fin salle,
      periodo: 0,
      nombreInstitucion: '',
      imagenInsitucion: '',
      //form de docente
      cantFormsDocente: 0,
      cantFormsSolicitudes: 0,
      //fin forms de docente
      //variables para change password
      popupChangePassword: false,
      showCloseButton: false,
      //fin variables para change password,
      //variables salle
      ObjectInstitucion:{},
      configuracionSalle:[],
      verEvaluacionSalle:false,
      //fin variables salle
      totalProReservar:0,
      totalProDeposito_Prolipa:0,
      totalProDeposito_CALMED:0,
      totalProStock_Prolipa:0,
      totalProStock_CALMED:0,

      //capacitaciones
      capacitaciones: [],
      capacitacionSeleccionada: null,
      mostrarModal: false,
      anioSeleccionado: null,
      estadosSeleccionados: ['0'],
      refreshKey: 0,
      copiado: false,
    }
  },
  created() {
    let me = this;
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    // me.formsDocente();
    if (this.usuario.capacitador == 1) {
      // Notificaciones capacitaciones - deshabilitado
    }

  },
  components: {
    VueApexCharts,
    StatisticsCardLine,
    ChangeTimeDurationDropdown,
    VxTimeline,
    'v-select': vSelect,
    InstitutionBanner,
    ProformasSummary,
    HomeGlobales,
    HomeDirectorWelcome,
    HomeDirectorExtras,
    HomeSalleAdmin,
    HomeAdmin,
    HomeFacturadorAdmin,
    HomeNomina,
    docenteHome,
    asesorHome,
    // EstudiantesMatricula,
    popupChangePasswordVue,
    screen_gerenciaVue,
    HomeNeetVue,
    HomeBodegaAdminVue,
    HomeEstudianteVue,
    ScreenSolicitud,
    Home_Salle_Docente
  },
  mounted() {
    let me = this
    me.getPeriodoInstitucion();
    localStorage.removeItem('grupoInst');
    this.linkEvaluacion = localStorage.getItem('evaluacionxLink')
    if (this.linkEvaluacion) {
      this.urlBack = window.location.href
      this.urlV = this.urlBack.split('/')
      this.urlOrigen = this.urlV[0] + '/' + this.urlV[1] + '/' + this.urlV[2]
      this.vectorLink = (this.linkEvaluacion).split('-')
      this.evaluacionUrl()
    }
    this.getInstitucion();
    this.$nextTick(function () {
      me.loadDeferredHomeData();
    })
  },
  computed: {
    resumenPorAnio() {
      const resumen = {};

      this.capacitaciones.forEach(cap => {
        const anio = new Date(cap.fecha_inicio).getFullYear();
        const estado = cap.estado_capacitacion;

        if (!resumen[anio]) {
          resumen[anio] = { pendiente: 0, finalizada: 0 };
        }

        if (estado === 1) {
          resumen[anio].pendiente++;
        } else if (estado === 2) {
          resumen[anio].finalizada++;
        }
      });

      return resumen;
    },

    capacitacionesFiltradasPorAnio() {
      if (!this.anioSeleccionado) return [];
      return this.capacitaciones.filter(cap => {
      const anioCap = new Date(cap.fecha_inicio).getFullYear();
      return anioCap === Number(this.anioSeleccionado);
      });
    },
    capacitacionesFiltradasPorEstado() {
      if (this.estadosSeleccionados.includes('0')) {
      return this.capacitacionesFiltradasPorAnio;
      }
      return this.capacitacionesFiltradasPorAnio.filter(cap =>
      this.estadosSeleccionados.includes(String(cap.estado_capacitacion))
      );
    }
  },
  watch: {
    estadosSeleccionados(newVal) {
      if (!newVal.includes('0') && newVal.length === 0) {
          this.estadosSeleccionados = ['0']; // Volver a "Todas" si no hay selección
      } else if (newVal.includes('0') && newVal.length > 1) {
          this.estadosSeleccionados = ['0']; // Si se selecciona "Todas", desmarcar las demás
      }
    }
  },
  methods: {
    loadDeferredHomeData() {
      let me = this
      const schedule = function(callback) {
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(callback)
        } else {
          setTimeout(callback, 0)
        }
      }

      schedule(function() {
        if (me.usuario.id_group == 1) {
          me.cantidadTicketsAbiertos();
          me.cantidadTicketsCerrados();
          me.formsDocente();
          me.getConteoAdminLigero();
        }

        if (me.usuario.id_group == 10) {
          me.getInstitucionesDirector();
        }

        if (me.usuario.id_group == 12) {
          me.getUsuariosSalle();
        }

        if (me.usuario.id_group == 6 || me.usuario.id_group == 13) {
          me.getEvaluacionSalle();
        }

        if (me.usuario.id_group === 29 || me.usuario.id_group === 30) {
          me.$router.push({ name: 'biblioteca' })
        }

        me.changePassword()

        if (me.usuario.capacitador == 1) {
          me.getCapacitaciones();
        }
      })
    },
    //capacitaciones
    async seleccionarAnio(anio) {
      // Mostrar loading en el botón
      this.cargandoModal = true;

      // Siempre asignar el año seleccionado (sin toggle)
      this.anioSeleccionado = anio;
      this.estadoSeleccionado = ['0']; // Reiniciar el filtro de estado al cambiar de año

      // Pequeña pausa para mostrar el loading
      await new Promise(resolve => setTimeout(resolve, 300));

      // Siempre abrir el modal
      this.mostrarModal = true;

      this.cargandoModal = false;
    },
    cerrarModal() {
      // Solo cerrar el modal sin resetear el año seleccionado
      this.mostrarModal = false;
      // No llamar getCapacitaciones() para mantener el estado
    },
    formatearHoraTexto(hora) {
      if (!hora) return '';

      const [horaStr, minutosStr] = hora.split(':');
      let h = parseInt(horaStr, 10);
      const m = minutosStr.padStart(2, '0');

      const ampm = h >= 12 ? 'p. m.' : 'a. m.';
      h = h % 12 || 12; // convierte 13 -> 1, 0 -> 12

      const articulo = h === 1 ? 'la' : 'las';
      return `${articulo} ${h}:${m} ${ampm}`;
    },
     copiarLink(link) {
      navigator.clipboard.writeText(link)
        .then(() => {
          this.$vs.notify({
            title: '¡Enlace copiado!',
            text: 'El link de reunión fue copiado al portapapeles.',
            color: 'primary',
            position: 'top-center' // Puedes usar 'center', 'top-center', 'bottom-center', etc.
          });
        })
        .catch(() => {
          this.$vs.notify({
            title: 'Error',
            text: 'No se pudo copiar el enlace.',
            color: 'danger',
            position: 'top-center'
          });
        });
    },
    tieneLinkReunion(link) {
      return !!link && link.trim() !== '';
    },
    formatFecha(fecha) {
      const d = new Date(fecha);
      return isNaN(d) ? 'Fecha inválida' : d.toLocaleDateString("es-EC", {
          weekday: "short",
          year: "numeric",
          month: "short",
          day: "numeric",
      });
    },
    estadoLabel(estado) {
      switch (estado) {
          case 1:
              return 'Pendiente';
          case 2:
              return 'Finalizada';
          default:
              return 'Desconocido';
      }
    },
    estadoLabelColor(estado) {
      switch (estado) {
          case 1:
              return 'warning';
          case 2:
              return 'danger';
          default:
              return 'primary';
      }
    },
    estadoLabelTipo(estado) {
      switch (estado) {
          case 0:
              return 'Presencial';
          case 1:
              return 'Virtual';
          default:
              return 'Desconocido';
      }
    },
    estadoLabelColorTipo(estado) {
      switch (estado) {
          case 0:
              return 'primary';
          case 1:
              return 'dark';
          default:
              return 'primary';
      }
    },
    getCapacitaciones() {
      this.$vs.loading();
      this.$http.get(this.$server_url + `TraerCapacionesAsesor?id_asesor=${this.usuario.idusuario}`)
          .then((res) => {
          this.capacitaciones.splice(0, this.capacitaciones.length, ...res.data);
          console.log('Datos de API:', res.data);

          // this.anioSeleccionado = null;
          // Reiniciar filtros solo si es necesario
          if (!this.anioSeleccionado) {
            // Detecta el primer año con capacitaciones como filtro por defecto
            const primerAnio = res.data.length ? new Date(res.data[0].fecha_inicio).getFullYear() : null;
            this.anioSeleccionado = primerAnio;
          }
          this.estadosSeleccionados = ['0'];
          this.$vs.loading.close();
          })
          .catch((error) => {
          console.error('Error al cargar capacitaciones:', error);
          }).finally(() => {
          this.$vs.loading.close();
          });
    },
    //fin capacitaciones

    getEvaluacionSalle(){
      let me = this
      this.$http.get(this.$server_url+'salle/periodos?byInstitucion='+ me.usuario.institucion_idInstitucion)
      .then(res =>{
        let datos  = res.data
        var periodoEvaluacion = 0
          if(datos.length > 0){
            let searcEvaluacionActiva = datos.filter(p => p.estado == 1)
            if(searcEvaluacionActiva.length > 0){
              periodoEvaluacion = searcEvaluacionActiva[0].id
              me.getEstadoEvaluacionSalle(periodoEvaluacion)
            }else{
            }
          }else{
          }
      })
    },
    getEstadoEvaluacionSalle(periodoEvaluacion){
      let me = this;
      me.configuracionSalle = []
      this.$http.get(this.$server_url+'institucionConfiguracionSalle/' + me.usuario.institucion_idInstitucion+'/'+periodoEvaluacion)
      .then(res => {
        me.configuracionSalle = res.data;
        if(me.configuracionSalle.length == 0){
          me.verEvaluacionSalle = false
          return
        }
        const fechaActual = moment();
        // Formatea la fecha en el formato "Y-m-d"
        const fechaFormateada = fechaActual.format("YYYY-MM-DD");
        let datos = res.data[0]
        const { fecha_fin } = datos
        let getFechaFin = fecha_fin.substring(0,10)
        if(fechaFormateada < getFechaFin ){ me.verEvaluacionSalle = true}
        else                              { me.verEvaluacionSalle = false}
      })
    },
    handleClose() {
      let me = this;
      me.popupChangePassword = true
    },
    changeRecarge(e) {
      let me = this;
      me.popupChangePassword = false
    },
    changePassword() {
      let me = this;
      //excepto los estudiantes
      if (me.usuario.id_group == 4) {
        return
      } else {
        // Si change_password == 1 (contraseña reseteada o primer inicio de sesión), mostrar popup
        if (me.usuario.change_password == 1) {
          me.popupChangePassword = true
        }
      }
    },
    esFechaValida(fecha) {
      if (fecha == null || fecha == "null" || fecha == "") {
        return false
      }
      var dateObj = new Date(fecha);
      return !isNaN(dateObj);
    },
    //para ir a las solicitudes del formulario de registro de libros de los docentes
    verSolicitudFormulario() {
      let me = this;
      localStorage.setItem('formulario', 'todo')
      me.$router.push('/formulario/solicitudes')
    },
    //para obtener el perido atual
    getPeriodoInstitucion() {
      let me = this;
      this.$http.get(this.$server_url + 'institucionTraerPeriodo?institucion_id=' + me.usuario.institucion_idInstitucion)
        .then(function (res) {
          me.periodo = res.data[0].periodo
          localStorage.setItem('periodo_id', res.data[0].periodo)
          localStorage.setItem('descripcion_periodo', res.data[0].descripcion)
          localStorage.setItem('nombreInstitucion', res.data[0].nombreInstitucion)
          localStorage.setItem('region', res.data[0].region)
          me.nombreInstitucion = res.data[0].nombreInstitucion
          me.imagenInsitucion = res.data[0].imgenInstitucion
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    ServiceSocket() {
      console.log("id grupo" + this.usuario.id_group)
    },
    getCantidadUsuarios() {
      let me = this;
      this.$http.get(this.$server_url + 'traerCantidadUsuarios')
        .then(res => {
          me.usuarioActivos = res.data.usuarioActivos[0].totalactivo
          me.usuariosProlipa = res.data.usuariosProlipa[0].totalprolipa
          // me.docentesCosta = res.data.docentesCosta.length
          // me.docentesSierra = res.data.docentesSierra.length
          // me.estudiantesCosta = res.data.estudiantesCosta.length
          // me.estudiantesSierra = res.data.estudiantesSierra.length
        })
        .catch(err => {
          console.log(err)
        })
    },
    getStockProductos() {
        let me = this;
        me.$vs.loading();
        this.$http.get(this.$server_url + "GetProducto")
            .then((res) => {
            // Filtramos los productos que tienen gru_pro_codigo = 1, 2 o 3
            const productosFiltrados = res.data.filter(producto =>
                producto.gru_pro_codigo === 1 ||
                producto.gru_pro_codigo === 2 ||
                producto.gru_pro_codigo === 3 ||
                producto.gru_pro_codigo === 6
            );

            // Sumamos los valores de pro_reservar de los productos filtrados
            const totalProReservar = productosFiltrados.reduce((total, producto) => {
                return total + producto.pro_reservar;
            }, 0);

            const totalProStock_Prolipa = productosFiltrados.reduce((total, producto) => {
                return total + producto.pro_stock;
            }, 0);

            const totalProStock_CALMED = productosFiltrados.reduce((total, producto) => {
                return total + producto.pro_stockCalmed;
            }, 0);

            const totalProDeposito_Prolipa = productosFiltrados.reduce((total, producto) => {
                return total + producto.pro_deposito;
            }, 0);

            const totalProDeposito_CALMED = productosFiltrados.reduce((total, producto) => {
                return total + producto.pro_depositoCalmed;
            }, 0);

            // Asignamos los productos filtrados a this.Productos
            me.Productos = productosFiltrados;

            // Guardamos el total de pro_reservar
            me.totalProReservar = totalProReservar;
            me.totalProStock_Prolipa = totalProStock_Prolipa;
            me.totalProStock_CALMED = totalProStock_CALMED;
            me.totalProDeposito_Prolipa = totalProDeposito_Prolipa;
            me.totalProDeposito_CALMED = totalProDeposito_CALMED;
            me.$vs.loading.close();
        })
        .catch((err) => {
            console.log(err);
            me.$vs.loading.close();
        });
    },
    getStockProductosSumados() {
      let me = this; console.log('getStockProductosSumados')
      me.$vs.loading();
      this.$http.get(this.$server_url + "getProductosSuma")
        .then((res) => {
          me.totalProReservar = res.data[0].total_reservar;
          me.totalProStock_Prolipa = res.data[0].total_stock;
          me.totalProStock_CALMED = res.data[0].total_stockCalmed;
          me.totalProDeposito_Prolipa = res.data[0].total_deposito;
          me.totalProDeposito_CALMED = res.data[0].total_depositoCalmed;
          me.$vs.loading.close();
        })
        .catch((err) => {
          console.error(err);
          me.$vs.loading.close();
        });
    },
    Red_StockProductos(){
      // Supongamos que 'totalProReservar' es el valor que quieres almacenar
      const valorlocalstorage = 1;
      // Establece el valor en local storage
      localStorage.setItem('dashboardstock', valorlocalstorage);
      //Ruta de redireccion
      this.$router.push({
          path: '/asis_gerencia/general',
      });
    },
    getUsuariosSalle() {
      let me = this;
      me.$vs.loading();
      const parametros ={
                'contarUsuarios':true,
                'tipo_institucion': me.usuario.institucion.tipo_institucion
            }
      this.$http.post(this.$server_url + 'usuarioSalle', parametros)
        .then(res => {
          me.listaUsuariosSalle = res.data;
          me.$vs.loading.close();
        })
        .catch(err => {
          console.log(err)
          me.$vs.loading.close();
        })
    },
    getTarease() {
      let me = this;
      me.$vs.loading({
        color: '#046AE7'
      })
    },


    //====TICKETS======
    cantidadTicketsAbiertos() {
      let me = this;
      this.$http.get(this.$server_url + 'ticket?cantAbiertos=yes')
        .then(function (response) {
          let datos = response.data
          // if (datos.length > 0) {
          //   if (me.usuario.id_group == '1') {
          //     let getInfo = datos.filter(p => p.ticket_asesor == '0' || p.ticket_asesor == null)
          //     me.cantTicketsAbiertos = getInfo.length;
          //   } else {
          //     let getInfo = datos.filter(p => p.ticket_asesor == '1' && p.vendedorInstitucion == me.usuario.cedula)
          //     me.cantTicketsAbiertos = getInfo.length;
          //   }
          // }
          if (datos.length > 0) {
  let getInfo = datos.filter(p => p.ticket_asesor == '0' || p.ticket_asesor == null)
  me.cantTicketsAbiertos = getInfo.length;
} else {
  me.cantTicketsAbiertos = 0;
}

        })
        .catch(function (error) { })
    },
    cantidadTicketsCerrados() {
      let me = this;
      this.$http.get(this.$server_url + 'ticket?cantCerrados=yes')
        .then(function (response) {
          if (response.data.length > 0) {
            me.cantTicketsCerrados = response.data[0].cantidadC;
          }
        })
        .catch(function (error) { })
    },

    //====FIN TICKETS======
    //====FORMULARIO DOCENTE========
    formsDocente() {
      let me = this;
      this.$http.get(this.$server_url + 'formularioDocente?all=yes')
        .then(function (response) {
          me.cantFormsDocente = response.data.forms.length;
          me.cantFormsSolicitudes = response.data.solicitudes.length
        })
        .catch(function (error) { })
    },
    getConteoAdminLigero() {
      let me = this;
      this.$http.get(this.$server_url + 'cant_preguntas')
        .then(function (res) {
          me.c_preg0 = res.data[0].cantidad;
          me.c_preg1 = res.data[1].cantidad;
          me.c_preg2 = res.data[2].cantidad;
          me.c_preg3 = res.data[3].cantidad;
          me.c_preg4 = res.data[4].cantidad;
        })
        .catch(function (error) { })

      this.$http.get(this.$server_url + 'cant_juegos')
        .then(function (res) {
          me.c_juegos0 = res.data;
        })
        .catch(function (error) { })
    },
    //====FIN FORMULARIO DOCENTE====
    contenidosDocente() {
      let me = this;
      this.$http.get(this.$server_url + 'contenidos?idusuario=' + me.usuario.idusuario)
        .then(function (response) {
          me.contenidos = response.data;
        })
        .catch(function (error) { })
    },
    cantidadArchivos() {
      let me = this;
      this.$http.get(this.$server_url + 'cant_contenido/' + me.usuario.idusuario)
        .then(function (response) {
          me.cantArchivos = response.data;
        })
        .catch(function (error) { })
    },
    getInstitucion() {
      let me = this;
      this.$http.get(this.$server_url + 'verificarInstitucion/' + me.usuario.idusuario)
        .then(function (response) {
          if (response.data[0].institucion_idInstitucion === null) {
            me.getCiudad();
            me.popupActive = true
          } else {
            me.ObjectInstitucion = response.data[0]
            me.aplica_matricula  = response.data[0].aplica_matricula
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    getCiudad() {
      let me = this;
      this.$http.get(this.$server_url + 'ciudades')
        .then(function (response) {
          me.ciudades = response.data;
        })
        .catch(function (error) { })
    },
    verInstCiudad() {
      let me = this;
      this.$http.get(this.$server_url + 'verInstitucionCiudad/' + me.ciudad.id)
        .then(function (response) {
          me.instituciones = response.data;
        })
        .catch(function (error) { })
    },
    asignarInstitucion() {
      let me = this;
      if (me.institucion === '' || me.institucion === null) {
        me.$vs.notify({
          text: 'Seleccione una institución antes de guardar',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }
      var formData = new FormData();
      formData.append("institucion", me.institucion.id);
      formData.append("usuario", me.usuario.idusuario);
      this.$http.post(this.$server_url + 'asignarInstitucion', formData)
        .then(function (response) {
          me.popupActive = false;
          me.$vs.notify({
            text: 'Institución guardada exitosamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    evaluacionUrl() {
      let me = this
      let formData = new FormData();
      formData.append("codigo", me.vectorLink[1]);
      formData.append("idusuario", me.usuario.idusuario);
      this.$http.post(this.$server_url + 'verificarCursoEstudiante', formData)
        .then(function (res) {
          if (res.data != '') {
            localStorage.evaluacionxLink = ''
            window.location.href = me.urlOrigen + '/responderEvaluacion/' + me.linkEvaluacion
          } else {
            me.addClase()
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    addClase() {
      let me = this
      let formData = new FormData();
      formData.append("codigo", me.vectorLink[1]);
      formData.append("idusuario", me.usuario.idusuario);
      this.$http.post(this.$server_url + 'addClase', formData)
        .then(function (res) {
          localStorage.evaluacionxLink = ''
          window.location.href = me.urlOrigen + '/responderEvaluacion/' + me.linkEvaluacion
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    cantidad_evaluaciones() {
      let me = this;
      console.log(me.usuario.idusuario)
      this.$http.get(this.$server_url + 'cant_evaluaciones/' + me.usuario.idusuario)
        .then(function (res) {
          me.cant_eval = res.data;
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    getConteo() {
      let me = this;
      me.c_accesos = JSON.parse(localStorage.getItem('inProlipa'));
      if (me.c_accesos == null) {
        localStorage.inProlipa = 0;
      }
      me.c_accesos++
      localStorage.inProlipa = me.c_accesos;
      if (localStorage.inProlipa > me.reset_storage) {
        localStorage.inProlipa = 0;
      }
      me.c_user0 = JSON.parse(localStorage.getItem('total_user0'));
      me.c_user1 = JSON.parse(localStorage.getItem('total_user1'));
      me.c_user2 = JSON.parse(localStorage.getItem('total_user2'));
      me.c_user3 = JSON.parse(localStorage.getItem('total_user3'));
      if (me.c_user0 == 0 || me.c_user0 == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_user')
          .then(function (res) {
            localStorage.total_user0 = me.c_user0 = res.data[1].cantidad;
            localStorage.total_user1 = me.c_user1 = res.data[2].cantidad;
            localStorage.total_user2 = me.c_user2 = res.data[3].cantidad;
            localStorage.total_user3 = me.c_user3 = res.data[4].cantidad;
            // console.log(me.c_user)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.t_curso0 = JSON.parse(localStorage.getItem('total_cur0'));
      me.t_curso1 = JSON.parse(localStorage.getItem('total_cur1'));
      if (me.t_curso0 == 0 || me.t_curso0 == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_cursos')
          .then(function (res) {
            localStorage.total_cur0 = me.t_curso0 = res.data[0].cantidad;
            localStorage.total_cur1 = me.t_curso1 = res.data[1].cantidad;
            // console.log(me.t_cursos)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_eval = JSON.parse(localStorage.getItem('total_eva'));
      if (me.c_eval == 0 || me.c_eval == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_evaluaciones')
          .then(function (res) {
            // me.c_eval = (res.data)
            localStorage.total_eva = me.c_eval = res.data[0].cantidad;
            // console.log(me.c_eval)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_preg0 = JSON.parse(localStorage.getItem('total_preg0'));
      me.c_preg1 = JSON.parse(localStorage.getItem('total_preg1'));
      me.c_preg2 = JSON.parse(localStorage.getItem('total_preg2'));
      me.c_preg3 = JSON.parse(localStorage.getItem('total_preg3'));
      me.c_preg4 = JSON.parse(localStorage.getItem('total_preg4'));
      if (me.c_preg0 == 0 || me.c_preg0 == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_preguntas')
          .then(function (res) {
            // me.c_preg = (res.data)
            localStorage.total_preg0 = me.c_preg0 = res.data[0].cantidad;
            localStorage.total_preg1 = me.c_preg1 = res.data[1].cantidad;
            localStorage.total_preg2 = me.c_preg2 = res.data[2].cantidad;
            localStorage.total_preg3 = me.c_preg3 = res.data[3].cantidad;
            localStorage.total_preg4 = me.c_preg4 = res.data[4].cantidad;
            // console.log(me.c_eval)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_multi0 = JSON.parse(localStorage.getItem('total_multi0'));
      me.c_multi1 = JSON.parse(localStorage.getItem('total_multi1'));
      if (me.c_multi0 == 0 || me.c_multi0 == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_multimedia')
          .then(function (res) {
            localStorage.total_multi0 = me.c_multi0 = res.data[0].cantidad;
            localStorage.total_multi1 = me.c_multi1 = res.data[1].cantidad;
            // console.log(me.c_multi)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_juegos0 = localStorage.getItem('total_juego0');
      if (localStorage.inProlipa > 1) {
        this.$http.get(this.$server_url + 'cant_juegos')
          .then(function (res) {
            // console.log( res.data[0].cantidad )
            localStorage.total_juego0 = (res.data[0].cantidad);
            me.c_juegos0 = res.data;
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_codigos = JSON.parse(localStorage.getItem('total_cod1'));
      if (me.c_codigos == 0 || me.c_codigos == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_codigos')
          .then(function (res) {
            // me.c_codigos = (res.data[0].cantidad)
            localStorage.total_cod1 = me.c_codigos = res.data;
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_codigos_total = JSON.parse(localStorage.getItem('total_cod0'));
      if (me.c_codigos_total == 0 || me.c_codigos_total == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_codigostotal')
          .then(function (res) {
            // me.c_codigos_total = (res.data[0].cantidad)
            localStorage.total_cod0 = me.c_codigos_total = res.data;
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_semi = JSON.parse(localStorage.getItem('semin'));
      if (me.c_semi == 0 || me.c_semi == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_seminarios')
          .then(function (res) {
            // me.c_semi = (res.data)
            localStorage.semin = me.c_semi = res.data[0].cantidad;
            // console.log(me.c_semi)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
      me.c_enc = JSON.parse(localStorage.getItem('total_encu'));
      if (me.c_enc == 0 || me.c_enc == null || localStorage.inProlipa == 0) {
        this.$http.get(this.$server_url + 'cant_encuestas')
          .then(function (res) {
            // me.c_semi = (res.data)
            localStorage.total_encu = me.c_enc = res.data[0].cantidad;
            // console.log(me.c_semi)
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    },
    getInstitucionesDirector() {
      let me = this;
      this.$http.get(this.$server_url + 'verInstitucionDirector?idusuario=' + me.usuario.idusuario)
        .then(res => {
          me.instituciones_director = (res.data)
        })
        .catch(err => {
          console.error(err);
        })
    },
    //para cambiar de grupo al estudiante
    cambiarGrupoMatricula(grupo) {
      let me = this;
      this.$http.get(this.$server_url + 'cambiarEstadoMatricula?grupo=' + grupo + '&idusuario=' + me.usuario.idusuario)
        .then(function (res) {
          location.reload();
          me.$router.push('/')
          localStorage.clear();
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    getEstadoMatricula(periodo) {
      let me = this;
      // let periodo = localStorage.getItem('periodo_id')
      let idusuario = me.usuario.idusuario
      this.$http.get(this.$server_url + 'valores/pensiones?periodo_id=' + periodo + '&idusuario=' + idusuario)
        .then(function (res) {
          if (res.data.length > 0) {
            me.ifMatriculado = res.data.buscarEstudianteReserva[0].estado_matricula
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    getproformas(){
      let me = this;
      me.$http.get(me.$server_url + "Get_proformasCliente?usuario=" + me.usuario.idusuario)
        .then(function (res) {
            me.proformas = res.data;
            me.anuladas = res.data.filter(p=> p.prof_estado == 0).length;
            me.pendientes = res.data.filter(p=> p.prof_estado == 1).length;
            me.finalizadas = res.data.filter(p=> p.prof_estado == 2).length;
            me.aprobadas = res.data.filter(p=> p.prof_estado == 3).length;
            // me.series = [
            //     me.pendientes,
            //     me.finalizadas,
            //     me.aprobadas,
            //     me.anuladas
            // ];
            // console.log(this.series);
        })
        .catch(function (error) {
            console.error('Error al obtener pedidos:', error);
        });
    },
  },

}
</script>

<style lang="scss">
.hide-close .vs-popup--close {
  display: none;
}

/*! rtl:begin:ignore */
#dashboard-analytics {

  .fondo-director {
    background-image: linear-gradient(to top, #00c6fb 0%, #005bea 100%);
  }

  .alto {
    min-height: 190px;
  }

  .numero1 {
    font-size: 1.5em;
  }

  .color1 {
    color: rgb(45, 133, 171);
  }

  .con-example-images {
    max-height: 500px,
      overflow auto
  }



  .greet-user {
    position: relative;

    .decore-left {
      position: absolute;
      left: 0;
      top: 0;
    }

    .decore-right {
      position: absolute;
      right: 0;
      top: 0;
    }
  }

  @media(max-width: 576px) {

    .decore-left,
    .decore-right {
      width: 140px;
    }
  }
}
.message_p {
  background: #06d755;
  color: #fff;
  min-width: 20px;
  height: 23px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  width: 23px;
}

.padre {
  width: 100%;
  display: flex;
  flex-direction: column;
  min-height: 200px;  /* Ajusté la altura para que sea un poco más pequeño */
  border: 1px solid none;
  border-radius: 10px;
  padding: 0;
}

.padreb {
  box-shadow: 1px 3px 5px rgba(174, 98, 202, 0.6);
}

.hijo1 {
  text-align: center;
  border-radius: 10px;
  width: 100%;
}

.hijo1b {
  background: #b121f4;  /* fallback for old browsers */
  background: -webkit-linear-gradient(to right, #a473f2, #7c2bff);
  background: linear-gradient(to right, #a473f2, #7c2bff);
}

.hijo1 > h3 {
  color: white;
  font-weight: 300;
  letter-spacing: 2px;
  padding: 5px;
  font-size: 1.2rem; /* Aumento la legibilidad, pero aún ajustable para pantallas pequeñas */
}

.hijo2 {
  margin-top: 10px;
  cursor: pointer;
  text-align: center;
}

/* Media Queries for Responsiveness */

/* Mobile View */
@media (max-width: 640px) {
  .padre {
    padding: 10px; /* Añadir padding para pantallas más pequeñas */
    min-height: 250px; /* Aumento la altura en pantallas más pequeñas */
  }

  .hijo1 > h3 {
    font-size: 1rem; /* Ajusto el tamaño de la fuente */
  }

  .hijo2 {
    margin-top: 15px; /* Aumento el margen */
  }
}

/* Tablet View */
@media (max-width: 768px) {
  .padre {
    padding: 15px; /* Añadir padding en tabletas */
  }

  .hijo1 > h3 {
    font-size: 1.1rem; /* Ajusto el tamaño de la fuente */
  }
}

.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>

