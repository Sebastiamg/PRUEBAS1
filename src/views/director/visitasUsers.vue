<template>
  <div class="mt-2">
    <vs-list-header color="success" icon="groups" :title="headerTitle"></vs-list-header>

    <div v-if="modoUsuarioEspecifico" class="usuario-info mb-3" style="background: #f8f8f8; padding: 15px; border-radius: 8px; margin-top: 15px;">
      <p><b>Nombre:</b> {{ usuarioSelected.nombres }} {{ usuarioSelected.apellidos }}</p>
      <p><b>Institución:</b> {{ usuarioSelected.nombreInstitucion }}</p>
      <p><b>Email:</b> {{ usuarioSelected.email }}</p>
      <p><b>Cédula:</b> {{ usuarioSelected.cedula }}</p>
    </div>
    
    <!-- Selección de Tipo de Usuario para Visitas -->
    <div v-if="!modoUsuarioEspecifico" style="display: flex; align-items: center; gap: 20px; margin-top: 15px; margin-bottom: 15px; background: #f8f8f8; padding: 15px; border-radius: 8px;">
      <span style="font-weight: bold; color: #1e1e1e; font-size: 14px;">Filtrar visitas por:</span>
      <div style="display: flex; gap: 20px;">
        <vs-radio v-model="localIdGroup" :vs-value="6" @change="onTipoUsuarioChange">
          Docentes
        </vs-radio>
        <vs-radio v-model="localIdGroup" :vs-value="4" @change="onTipoUsuarioChange">
          Estudiantes
        </vs-radio>
      </div>
    </div>

    <div class="flex" style="position: relative;top:15px">
      <div style="display: flex; gap: 32px; align-items: flex-end; padding-bottom: 10px;">
        <div style="flex:1;display:flex;flex-direction:column;">
          <span style="font-weight:600;display:block;margin-bottom:8px;">Fecha inicio</span>
          <flat-pickr :config="configdateTimePicker" v-model="fromDate" placeholder="Fecha Inicio" class="m-1"
            style="display: block;width: 100%;margin-bottom:8px;" @input="onFechaChange" />
        </div>
        <div style="flex:1;display:flex;flex-direction:column;">
          <span style="font-weight:600;display:block;margin-bottom:8px;">Fecha fin</span>
          <flat-pickr :config="configdateTimePicker" v-model="toDate" placeholder="Fecha Fin" class="m-1"
            style="display: block;width: 100%;margin-bottom:8px;" @input="onFechaChange" />
        </div>
        <div style="display:flex;align-items:flex-end;">
          <vs-button color="success" type="relief" @click="validarFechas" style="min-width:100px;"><i
              class="fa-solid fa-magnifying-glass"></i> Filtrar</vs-button>
        </div>
      </div>
    </div>

    <!--Tabla-->
    <br>
    <div id="seccionImprimir2" class="visitas-users-section">
      <vs-divider color="success" class="mt-5">VISITAS DEL MES {{ mesDescripcion.toUpperCase() }} DEL AÑO {{
        anioseleccionado }}</vs-divider>

      <!-- Acciones fuera de la tabla para que no rompan el layout en móvil -->
      <div class="tabla-acciones">
        <vs-chip color="primary">Cantidad: <b>&nbsp;{{ arregloVisitas.length }}</b></vs-chip>
        <div class="tabla-acciones-btns">
          <vs-button color="success" @click="exportToExcel" icon>
            <i class="fa-solid fa-file-excel mr-1"></i> Exportar
          </vs-button>
          <vs-button color="primary" @click="imprimirPDF" icon>
            <i class="fa-solid fa-print mr-1"></i> Imprimir
          </vs-button>
        </div>
      </div>

      <vs-table max-items="10" stripe search pagination :data="arregloVisitas" class="tabla-visitas">
      <template slot="thead">
        <vs-th width="20%">Datos</vs-th>
        <vs-th width="50%">Visitas</vs-th>
        <vs-th width="30%">Acciones</vs-th>
      </template>
      <template slot-scope="{data}">
        <vs-tr :key="indextr" v-for="(tr, indextr) in data" class="visitas-row">
          <vs-td class="visitas-td-datos">
            Nombres:
            <br>
            <span style="font-weight:600;">
              {{ tr.usuario }} {{ tr.apellidos }}<br>
            </span>
            Cédula:
            <br>
            <span style="font-weight:600;">
              {{ tr.cedula }}<br>
            </span>
          </vs-td>
          <vs-td class="visitas-td-grafico">
            <!-- Gráfico individual por docente -->
            <div v-if="getIndividualChartData(tr)" class="individual-chart-container mb-4">
              <ChartjsComponentPieChart
                :key="'chart-' + indextr + '-' + (isMobile ? 'm' : 'd')"
                :data="getIndividualChartData(tr)"
                :options="individualChartOptions"
              />
            </div>
          </vs-td>
          <vs-td class="visitas-td-acciones">
            <div class="visits-container">
              <div v-if="tr.contador15 > 0" class="visit-item login"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Ingreso al sistema'; f_mostrarDetalles(15);">
                <div class="visit-icon">
                  <i class="fas fa-sign-in-alt"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Ingreso al sistema</span>
                  <span class="visit-count">{{ tr.contador15 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador1 > 0" class="visit-item books"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Libros'; f_mostrarDetalles(1);">
                <div class="visit-icon">
                  <i class="fas fa-book"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Libros</span>
                  <span class="visit-count">{{ tr.contador1 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador2 > 0" class="visit-item units"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Unidades'; f_mostrarDetalles(2);">
                <div class="visit-icon">
                  <i class="fas fa-layer-group"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Unidades</span>
                  <span class="visit-count">{{ tr.contador2 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador3 > 0" class="visit-item notebooks"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Cuadernos'; f_mostrarDetalles(3);">
                <div class="visit-icon">
                  <i class="fas fa-book-open"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Cuadernos</span>
                  <span class="visit-count">{{ tr.contador3 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador4 > 0" class="visit-item homework"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Teletarea'; f_mostrarDetalles(4);">
                <div class="visit-icon">
                  <i class="fas fa-tv"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Teletarea</span>
                  <span class="visit-count">{{ tr.contador4 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador5 > 0" class="visit-item projects"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Proyectos'; f_mostrarDetalles(5);">
                <div class="visit-icon">
                  <i class="fas fa-project-diagram"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Proyectos</span>
                  <span class="visit-count">{{ tr.contador5 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador6 > 0" class="visit-item adaptations"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Adaptaciones curriculares'; f_mostrarDetalles(6);">
                <div class="visit-icon">
                  <i class="fas fa-cogs"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Adaptaciones curriculares</span>
                  <span class="visit-count">{{ tr.contador6 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador7 > 0" class="visit-item methodology"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Propuestas metodológicas'; f_mostrarDetalles(7);">
                <div class="visit-icon">
                  <i class="fas fa-lightbulb"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Propuestas metodológicas</span>
                  <span class="visit-count">{{ tr.contador7 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador8 > 0" class="visit-item games"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Juegos'; f_mostrarDetalles(8);">
                <div class="visit-icon">
                  <i class="fas fa-gamepad"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Juegos</span>
                  <span class="visit-count">{{ tr.contador8 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador9 > 0" class="visit-item materials"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Material'; f_mostrarDetalles(9);">
                <div class="visit-icon">
                  <i class="fas fa-folder"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Material</span>
                  <span class="visit-count">{{ tr.contador9 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador10 > 0" class="visit-item articles"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Artículos'; f_mostrarDetalles(10);">
                <div class="visit-icon">
                  <i class="fas fa-newspaper"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Artículos</span>
                  <span class="visit-count">{{ tr.contador10 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador11 > 0" class="visit-item tasks"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Tareas'; f_mostrarDetalles(11);">
                <div class="visit-icon">
                  <i class="fas fa-tasks"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Tareas</span>
                  <span class="visit-count">{{ tr.contador11 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador12 > 0" class="visit-item pdf-guide"
                @click="ObjectSelected = tr; recursoNombreSelected = 'PDF guía'; f_mostrarDetalles(12);">
                <div class="visit-icon">
                  <i class="fas fa-file-pdf"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">PDF guía</span>
                  <span class="visit-count">{{ tr.contador12 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador13 > 0" class="visit-item pdf-no-guide"
                @click="ObjectSelected = tr; recursoNombreSelected = 'PDF sin guía'; f_mostrarDetalles(13);">
                <div class="visit-icon">
                  <i class="fas fa-file-alt"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">PDF sin guía</span>
                  <span class="visit-count">{{ tr.contador13 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador14 > 0" class="visit-item didactic-guide"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Guía didáctica'; f_mostrarDetalles(14);">
                <div class="visit-icon">
                  <i class="fas fa-chalkboard-teacher"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Guía didáctica</span>
                  <span class="visit-count">{{ tr.contador14 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador16 > 0" class="visit-item planning"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Planificación'; f_mostrarDetalles(16);">
                <div class="visit-icon">
                  <i class="fas fa-calendar-alt"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Planificación</span>
                  <span class="visit-count">{{ tr.contador16 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador17 > 0" class="visit-item ministerial"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Documentos Ministeriales'; f_mostrarDetalles(17);">
                <div class="visit-icon">
                  <i class="fas fa-university"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Documentos Ministeriales</span>
                  <span class="visit-count">{{ tr.contador17 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador18 > 0" class="visit-item videos"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Videos'; f_mostrarDetalles(18);">
                <div class="visit-icon">
                  <i class="fas fa-play-circle"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Videos</span>
                  <span class="visit-count">{{ tr.contador18 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador19 > 0" class="visit-item activities"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Actividades'; f_mostrarDetalles(19);">
                <div class="visit-icon">
                  <i class="fas fa-clipboard-list"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Actividades</span>
                  <span class="visit-count">{{ tr.contador19 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>

              <div v-if="tr.contador20 > 0" class="visit-item animations"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Animaciones'; f_mostrarDetalles(20);">
                <div class="visit-icon">
                  <i class="fas fa-magic"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Animaciones</span>
                  <span class="visit-count">{{ tr.contador20 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
              <div v-if="tr.contador21 > 0" class="visit-item animations"
                @click="ObjectSelected = tr; recursoNombreSelected = 'Evaluaciones'; f_mostrarDetalles(21);">
                <div class="visit-icon">
                  <i class="fas fa-magic"></i>
                </div>
                <div class="visit-content">
                  <span class="visit-label">Evaluaciones</span>
                  <span class="visit-count">{{ tr.contador21 }}</span>
                </div>
                <div class="visit-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </div>
            </div>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>
    </div>
    <!-- Fin seccionImprimir2 -->
    <!--modales-->
    <vs-popup classContent="popup-example" title="Detalle de visitas" :active.sync="popupMostrarDetalles">
      <div v-if="popupMostrarDetalles">
        <visitasUsersDetalle :idusuario="ObjectSelected.idusuario" :nombreUsuario="ObjectSelected.usuario"
          :institucion_id="institucion.institucion_id" :recurso="recursoSelected" :fromDate="fromDate" :toDate="toDate"
          :recursoNombreSelected="recursoNombreSelected" />
      </div>
    </vs-popup>
  </div>
</template>
<script>
import moment from 'moment'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import imprimirMixin from "@/mixins/Pedidosmix";
const visitasUsersDetalle = () => import('./visitasUsersDetalle.vue');
const ChartjsComponentPieChart = () => import('../Estadisticas/charts-components/ChartjsComponentPieChart.vue');

export default {
  mixins: [imprimirMixin],
  components: {
    visitasUsersDetalle,
    flatPickr,
    ChartjsComponentPieChart,
  },
  data() {
    return {
      localIdGroup: 6,
      localUserDescription: 'Docentes',
      institucion: {},
      arregloVisitas: [],
      anios: [],
      anioSelect: '',
      anioseleccionado: '',
      yactual: null,
      menosUno: null,
      fromDate: null,
      toDate: null,
      mesDescripcion: '',
      ObjectSelected: '',
      recursoSelected: 0,
      recursoNombreSelected: '',
      popupMostrarDetalles: false,
      nombreEmpresaActual: '',
      isGeneratingPDF: false, // Flag para evitar múltiples impresiones simultáneas
      //variables para el export a excel
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      cellAutoWidth: true,
      selectedFormat: 'xls',
      isMobile: false,
      //fin variables de exportar excel
    }
  },
  computed: {
    modoUsuarioEspecifico() {
      return !!(this.usuarioSelected && this.usuarioSelected.idusuario);
    },
    headerTitle() {
      if (this.modoUsuarioEspecifico) {
        return 'Visitas de ' + this.usuarioSelected.nombres + ' ' + this.usuarioSelected.apellidos;
      }
      return 'Filtro de visitas de ' + this.localUserDescription;
    },
    configdateTimePicker() {
      return {
        dateFormat: 'Y-m-d',
        locale: 'es'
      }
    },
    individualChartOptions() {
      const isMobile = this.isMobile;
      return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: isMobile ? 'bottom' : 'right',
            labels: {
              font: {
                size: isMobile ? 9 : 11
              },
              boxWidth: isMobile ? 10 : 12,
              padding: isMobile ? 4 : 10,
              generateLabels: function(chart) {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                    const percentage = ((value * 100) / total).toFixed(1);
                    return {
                      text: `${label}: ${value} (${percentage}%)`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      hidden: false,
                      index: i
                    };
                  });
                }
                return [];
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed * 100) / total).toFixed(1);
                return `${context.label}: ${context.parsed} (${percentage}%)`;
              }
            }
          }
        }
      };
    }
  },
  created() {
    moment.locale('es');
    let me = this;
    me.localIdGroup = me.id_group;
    me.localUserDescription = me.userDescription;

    if (me.usuarioSelected && me.usuarioSelected.idusuario) {
      me.localIdGroup = Number(me.usuarioSelected.id_group) || 6;
      me.localUserDescription = me.localIdGroup === 4 ? 'Estudiantes' : 'Docentes';
    }
    
    if (me.institucionSelected) {
      me.institucion = {
        institucion_id: me.institucionSelected.idInstitucion,
        idInstitucion: me.institucionSelected.idInstitucion,
        nombreInstitucion: me.institucionSelected.nombreInstitucion
      }
    } else {
      me.institucion = JSON.parse(localStorage.getItem("institucion")) || {}
    }
  },
  mounted() {
    let me = this
    me.yactual = moment().format('YYYY');
    me.mactual = moment().format('M');
    me.mesDescripcion = moment().format('MMMM');
    me.anioseleccionado = me.yactual;
    //restar Anios
    me.menosUno = me.yactual - 1;
    me.anios.push({ anio: me.yactual });
    me.anios.push({ anio: me.menosUno });
    me.anioSelect = this.anios[0].anio
    // Establecer fecha inicio como primer día del mes actual y fecha fin como hoy
    me.fromDate = moment().startOf('month').format('YYYY-MM-DD');
    me.toDate = moment().format('YYYY-MM-DD');
    
    // Cargar empresa
    me.getEmpresaActual();
    
    // Cargar las visitas inicialmente
    me.getVisitas();
    me.checkMobile();
    window.addEventListener('resize', me.checkMobile);
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.checkMobile);
  },
  props: {
    id_group: {
      type: Number,
      required: false,
      default: 6
    },
    userDescription: {
      type: String,
      required: false,
      default: 'Docentes'
    },
    institucionSelected: {
      type: Object,
      required: false,
      default: () => null
    },
    usuarioSelected: {
      type: Object,
      required: false,
      default: () => null
    }
  },
  methods: {
    checkMobile() {
      this.isMobile = window.innerWidth <= 768;
    },
    async imprimirPDF() {
      const me = this;
      
      // Evitar múltiples ejecuciones simultáneas
      if (me.isGeneratingPDF) {
        me.$vs.notify({
          color: 'warning',
          title: 'Espere',
          text: 'Ya se está generando un reporte.'
        });
        return;
      }
      
      if (me.arregloVisitas.length === 0) {
        me.$vs.notify({
          color: 'warning',
          title: 'Sin datos',
          text: 'No hay datos para imprimir.'
        });
        return;
      }

      // Marcar como en proceso
      me.isGeneratingPDF = true;
      me.$vs.loading({ text: 'Generando reporte...' });

      // Crear notificación de advertencia
      const notifyDiv = document.createElement('div');
      notifyDiv.style.position = 'fixed';
      notifyDiv.style.top = '50%';
      notifyDiv.style.left = '50%';
      notifyDiv.style.transform = 'translate(-50%, -50%)';
      notifyDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      notifyDiv.style.color = '#fff';
      notifyDiv.style.borderRadius = '5px';
      notifyDiv.style.padding = '20px';
      notifyDiv.style.zIndex = '99999999';
      notifyDiv.style.display = 'none';
      notifyDiv.style.alignItems = 'center';
      notifyDiv.style.justifyContent = 'center';
      notifyDiv.style.fontSize = '16px';
      notifyDiv.innerHTML = `
        <span style="margin-right: 10px;">⚠️</span>
        <span>Tiene documentos para impresión abiertos, ciérrelos para poder navegar en esta página.</span>
      `;
      document.body.appendChild(notifyDiv);

      try {
        // Crear un contenedor temporal oculto para renderizar los gráficos
        const tempContainer = document.createElement('div');
        tempContainer.style.position = 'fixed';
        tempContainer.style.left = '-9999px';
        tempContainer.style.top = '0';
        tempContainer.style.width = '600px';
        document.body.appendChild(tempContainer);

        // Generar el encabezado del HTML del reporte
        let reporteHTML = `
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="margin: 5px 0;">${me.nombreEmpresaActual}</h2>
            <h3 style="margin: 5px 0;">REPORTE DE VISITAS DE ${me.localUserDescription.toUpperCase()}</h3>
            <p style="margin: 3px 0;">Desde: ${me.fromDate} - Hasta: ${me.toDate}</p>
            <p style="margin: 3px 0;"><strong>Institución:</strong> ${me.institucion.nombreInstitucion}</p>
            <hr style="margin: 15px 0; border: 1px solid #333;">
          </div>
        `;

        // Recorrer TODOS los usuarios
        for (let i = 0; i < me.arregloVisitas.length; i++) {
          const usuario = me.arregloVisitas[i];
          const chartData = me.getIndividualChartData(usuario);
          
          // Si el usuario NO tiene datos, mostrar mensaje
          if (!chartData) {
            reporteHTML += `
              <div style="page-break-inside: avoid; margin-bottom: 25px; padding: 15px; border: 2px solid #333; border-radius: 8px;">
                <div style="text-align: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #ddd;">
                  <strong style="font-size: 14px; display: block; margin-bottom: 5px;">${usuario.usuario}</strong>
                  <span style="font-size: 12px;">Cédula: ${usuario.cedula}</span>
                </div>
                <div style="text-align: center; padding: 30px; color: #999; font-style: italic;">
                  Sin visitas registradas en este período
                </div>
              </div>
            `;
            continue;
          }

          // Crear un contenedor para el gráfico temporal
          const chartDiv = document.createElement('div');
          chartDiv.style.width = '600px';
          chartDiv.style.height = '350px';
          tempContainer.appendChild(chartDiv);

          // Crear el canvas manualmente
          const canvas = document.createElement('canvas');
          canvas.width = 600;
          canvas.height = 350;
          chartDiv.appendChild(canvas);

          // Obtener el contexto 2D
          const ctx = canvas.getContext('2d');

          // Crear el gráfico manualmente (gráfico de pie simple)
          const total = chartData.datasets[0].data.reduce((a, b) => a + b, 0);
          let currentAngle = -0.5 * Math.PI; // Empezar desde arriba

          // Dibujar los segmentos
          chartData.datasets[0].data.forEach((value, index) => {
            const sliceAngle = (2 * Math.PI * value) / total;
            
            ctx.beginPath();
            ctx.arc(200, 175, 120, currentAngle, currentAngle + sliceAngle);
            ctx.lineTo(200, 175);
            ctx.fillStyle = chartData.datasets[0].backgroundColor[index];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            
            currentAngle += sliceAngle;
          });

          // Dibujar la leyenda
          let legendY = 50;
          chartData.labels.forEach((label, index) => {
            const value = chartData.datasets[0].data[index];
            const percentage = ((value * 100) / total).toFixed(1);
            const color = chartData.datasets[0].backgroundColor[index];
            
            // Cuadro de color
            ctx.fillStyle = color;
            ctx.fillRect(380, legendY - 10, 15, 15);
            ctx.strokeStyle = '#333';
            ctx.strokeRect(380, legendY - 10, 15, 15);
            
            // Texto
            ctx.fillStyle = '#333';
            ctx.font = '11px Calibri, sans-serif';
            ctx.fillText(`${label}: ${value} (${percentage}%)`, 400, legendY);
            
            legendY += 20;
          });

          // Esperar un momento para el renderizado
          await new Promise(resolve => setTimeout(resolve, 50));

          // Convertir canvas a imagen
          const imageData = canvas.toDataURL('image/png');

          // Agregar el bloque del usuario con el gráfico
          reporteHTML += `
            <div style="page-break-inside: avoid; margin-bottom: 25px; padding: 15px; border: 2px solid #333; border-radius: 8px;">
              <div style="text-align: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 2px solid #ddd;">
                <strong style="font-size: 14px; display: block; margin-bottom: 5px;">${usuario.usuario}</strong>
                <span style="font-size: 12px;">Cédula: ${usuario.cedula}</span>
              </div>
              <div style="text-align: center; margin-top: 15px;">
                <img src="${imageData}" style="max-width: 100%; height: auto;" />
              </div>
            </div>
          `;

          // Limpiar el contenedor temporal
          tempContainer.innerHTML = '';
        }

        // Eliminar el contenedor temporal
        document.body.removeChild(tempContainer);

        // Cerrar el loading ANTES de mostrar el diálogo de impresión
        me.$vs.loading.close();

        // Mostrar la notificación de advertencia
        notifyDiv.style.display = 'flex';

        // Abrir ventana de impresión
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>Reporte_Visitas_${me.localUserDescription}_${me.mesDescripcion}_${me.anioseleccionado}</title>
              <style>
                body {
                  font-family: Calibri, sans-serif;
                  font-size: 12px;
                  margin: 15px;
                }
                @media print {
                  @page {
                    size: portrait;
                    margin: 10mm;
                  }
                  img {
                    page-break-inside: avoid;
                  }
                }
              </style>
            </head>
            <body>
              ${reporteHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        
        // Esperar a que las imágenes se carguen (como el mixin)
        const images = printWindow.document.getElementsByTagName('img');
        const imageLoadPromises = Array.from(images).map(img => {
          return new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
        });

        // Esperar a que todas las imágenes se carguen
        Promise.all(imageLoadPromises).then(() => {
          printWindow.focus();

          setTimeout(() => {
            printWindow.print();
          }, 200);

          printWindow.onafterprint = () => {
            if (!printWindow.closed) {
              printWindow.close();
            }
          };
        });

        // Variable para controlar el intervalo
        let intervalId = null;
        
        // Monitorear cuando se cierra la ventana de impresión
        intervalId = setInterval(() => {
          if (printWindow.closed) {
            clearInterval(intervalId);
            if (document.body.contains(notifyDiv)) {
              notifyDiv.style.display = 'none';
              document.body.removeChild(notifyDiv);
            }
            // Liberar el flag cuando se cierre la ventana
            me.isGeneratingPDF = false;
          }
        }, 500); // Verificar cada 500ms

        // Auto-limpiar después de 15 segundos máximo
        setTimeout(() => {
          if (intervalId) {
            clearInterval(intervalId);
          }
          if (document.body.contains(notifyDiv)) {
            notifyDiv.style.display = 'none';
            document.body.removeChild(notifyDiv);
          }
          // Asegurarse de liberar el flag
          me.isGeneratingPDF = false;
        }, 15000);

      } catch (error) {
        console.error('Error al generar PDF:', error);
        me.$vs.notify({
          color: 'danger',
          title: 'Error',
          text: 'Ocurrió un error al generar el PDF: ' + error.message
        });
        // Limpiar la notificación en caso de error
        if (document.body.contains(notifyDiv)) {
          document.body.removeChild(notifyDiv);
        }
        // Liberar el flag en caso de error
        me.isGeneratingPDF = false;
      } finally {
        me.$vs.loading.close();
      }
    },
    async getEmpresaActual() {
      try {
        const res = await this.$http.get(this.$server_url + 'empresaActual');
        this.nombreEmpresaActual = res.data[0].descripcion_corta;
      } catch (err) {
        console.error('Error al cargar empresa actual:', err);
        this.nombreEmpresaActual = 'EDITORIAL PROLIPA';
      }
    },
    onTipoUsuarioChange() {
      this.localUserDescription = this.localIdGroup === 6 ? 'Docentes' : 'Estudiantes';
      this.getVisitas();
    },
    f_mostrarDetalles(recurso) {
      this.recursoSelected = recurso;
      this.popupMostrarDetalles = true;
    },
    validarFechas() {
      if (!this.fromDate || !this.toDate) {
        this.$vs.notify({ color: 'warning', title: 'Fechas requeridas', text: 'Debe seleccionar ambas fechas.' });
        return;
      }
      if (this.fromDate > this.toDate) {
        this.$vs.notify({ color: 'danger', title: 'Fechas inválidas', text: 'La fecha inicio no puede ser mayor que la fecha fin.' });
        return;
      }
      // Actualizar año y mes seleccionados basados en la fecha de inicio
      this.anioseleccionado = moment(this.fromDate).format('YYYY');
      this.mesDescripcion = moment(this.fromDate).format('MMMM');
      this.getVisitas();
    },
    onFechaChange() {
      if (!this.fromDate || !this.toDate) {
        this.arregloVisitas = [];
      }
    },
    getVisitas() {
      let me = this;
      me.arregloVisitas = []
      me.$vs.loading()
      let url = this.$server_url + 'usuarioVisitasAll?institucion_id=' + me.institucion.institucion_id + '&fromDate=' + me.fromDate + '&toDate=' + me.toDate + '&id_group=' + me.localIdGroup;
      if (me.modoUsuarioEspecifico) {
        url += '&idusuario=' + me.usuarioSelected.idusuario;
      }
      this.$http.get(url)
        .then(function (response) {
          me.$vs.loading.close()
          let datos = response.data
          datos.forEach((element, index) => {
            var cal = new Object();
            cal.idusuario = element.idusuario
            cal.usuario = element.usuario
            cal.apellidos = element.apellidos
            cal.cedula = element.cedula
            cal.email = element.email
            let getRecursos = element.visitas
            // cal.recursos = new Object();
            let contador1 = getRecursos.filter(p => p.recurso == 1)           //:libro,
            let contador2 = getRecursos.filter(p => p.recurso == 2)           //:unidades,
            let contador3 = getRecursos.filter(p => p.recurso == 3)           //:cuadernos,
            let contador4 = getRecursos.filter(p => p.recurso == 4)           //:teletarea,
            let contador5 = getRecursos.filter(p => p.recurso == 5)           //:proyectos,
            let contador6 = getRecursos.filter(p => p.recurso == 6)           //:adaptaciones,
            let contador7 = getRecursos.filter(p => p.recurso == 7)           //:propuestas,
            let contador8 = getRecursos.filter(p => p.recurso == 8)           //:juegos,
            let contador9 = getRecursos.filter(p => p.recurso == 9)           //:material,
            let contador10 = getRecursos.filter(p => p.recurso == 10)          //:articulos,
            let contador11 = getRecursos.filter(p => p.recurso == 11)          //:tareas,
            let contador12 = getRecursos.filter(p => p.recurso == 12)          //:pdf guia,
            let contador13 = getRecursos.filter(p => p.recurso == 13)          //:pdf sin guia,
            let contador14 = getRecursos.filter(p => p.recurso == 14)          //:guia didactica,
            let contador15 = getRecursos.filter(p => p.recurso == 15)          //:Ingreso al sistema,
            let contador16 = getRecursos.filter(p => p.recurso == 16)         //:Planificacion,
            let contador17 = getRecursos.filter(p => p.recurso == 17)         //:Documentos Minesterial,
            let contador18 = getRecursos.filter(p => p.recurso == 18)         //:videos tema,
            let contador19 = getRecursos.filter(p => p.recurso == 19)         //:actividades,
            let contador20 = getRecursos.filter(p => p.recurso == 20)         //:animaciones
            let contador21 = getRecursos.filter(p => p.recurso == 21)         //:evaluaciones
            for (let index = 1; index <= 21; index++) {
              try {
                eval("cal.contador" + index + "=" + "contador" + index + ".length");
              } catch (error) {
                eval("cal.contador" + index + "=" + 0);
              }
            }
            me.arregloVisitas.push(cal)
          });
        })
        .catch(function (error) {
          console.log(error)
          me.$vs.loading.close()
        })
    },
    getIndividualChartData(docente) {
      const recursos = {
        'Ingreso al sistema': docente.contador15 || 0,
        'Libros': docente.contador1 || 0,
        'Unidades': docente.contador2 || 0,
        'Cuadernos': docente.contador3 || 0,
        'Teletarea': docente.contador4 || 0,
        'Proyectos': docente.contador5 || 0,
        'Adaptaciones': docente.contador6 || 0,
        'Propuestas metodológicas': docente.contador7 || 0,
        'Juegos': docente.contador8 || 0,
        'Material': docente.contador9 || 0,
        'Artículos': docente.contador10 || 0,
        'Tareas': docente.contador11 || 0,
        'PDF guía': docente.contador12 || 0,
        'PDF sin guía': docente.contador13 || 0,
        'Guía didáctica': docente.contador14 || 0,
        'Planificación': docente.contador16 || 0,
        'Documentos Ministeriales': docente.contador17 || 0,
        'Videos': docente.contador18 || 0,
        'Actividades': docente.contador19 || 0,
        'Animaciones': docente.contador20 || 0,
        'Evaluaciones': docente.contador21 || 0
      };

      const labels = [];
      const data = [];
      const backgroundColor = [
        '#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899',
        '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444', '#22c55e',
        '#64748b', '#059669', '#dc2626', '#7c3aed', '#d97706',
        '#0284c7', '#475569', '#16a34a', '#db2777', '#047857'
      ];

      // Solo incluir recursos con visitas > 0
      Object.entries(recursos).forEach(([key, value], index) => {
        if (value > 0) {
          labels.push(key);
          data.push(value);
        }
      });

      // Si no hay datos, retornar null
      if (data.length === 0) return null;

      return {
        labels,
        datasets: [{
          data,
          backgroundColor: backgroundColor.slice(0, labels.length),
          borderWidth: 2,
          borderColor: '#ffffff'
        }]
      };
    },
    //METODOS PARA EXCEL
    //para limipiar los campos del excel
    clearFields() {
      this.fileName = ''
      this.cellAutoWidth = true
      this.selectedFormat = 'xls'
    },
    //metodo par descargar el excel
    exportToExcel() {
      let me = this;
      let headerTitle = [
        'Nombres',
        'Cédula',
        'Ingreso al sistema',
        'libro',
        'unidades',
        'cuadernos',
        'teletarea',
        'proyectos',
        'adaptaciones curriculares',
        'propuestas metodológicas',
        'juegos',
        'material',
        'articulos',
        'tareas',
        'pdf guia',
        'pdf sin guia',
        'guia didactica',
        'Planificación',
        'Documentos Minesteriales',
        'videos',
        'actividades',
        'animaciones',
        'evaluaciones'
      ];
      let headerVal = [
        'usuario',
        'cedula',
        'contador15',
        'contador1',
        'contador2',
        'contador3',
        'contador4',
        'contador5',
        'contador6',
        'contador7',
        'contador8',
        'contador9',
        'contador10',
        'contador11',
        'contador12',
        'contador13',
        'contador14',
        'contador16',
        'contador17',
        'contador18',
        'contador19',
        'contador20',
        'contador21',
      ];
      let codigoSelectedMayus = this.arregloVisitas
      for (var i = 0; i < codigoSelectedMayus.length; i++) {
        for (var key in codigoSelectedMayus[i]) {
          if (typeof codigoSelectedMayus[i][key] == "string") {
            codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
          }
        }
      }
      let reporte = 'Reporte visitas desde ' + me.fromDate + ' hasta ' + me.toDate + ' - ' + me.institucion.nombreInstitucion
      import('@/vendor/Export2Excel').then(excel => {
        const list = codigoSelectedMayus
        const data = this.formatJson(headerVal, list)
        excel.export_json_to_excel({
          header: headerTitle,
          data,
          filename: reporte,
          autoWidth: this.cellAutoWidth,
          bookType: this.selectedFormat
        })
        this.clearFields()
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j]
      }))
    },
  }
}
</script>
<style scoped>
/* ── Acciones sobre la tabla (fuera del slot header) ── */
.tabla-acciones {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 10px;
  width: 100%;
}

.tabla-acciones-btns {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Estilos para gráficos individuales por docente - vista normal */
.individual-chart-container {
  background: #f8fafc;
  border-radius: 8px;
  padding: 10px;
  border: 1px solid #e2e8f0;
  height: 380px;
  width: 260px;
  max-width: 100%;
  box-sizing: border-box;
  position: relative;
  margin-bottom: 10px;
  margin: auto;
  overflow: hidden;
}

.visits-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 100%;
}

.visit-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.visit-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transition: left 0.5s;
}

.visit-item:hover::before {
  left: 100%;
}

.visit-item:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border-color: #e2e8f0;
}

.visit-item:active {
  transform: translateY(0) scale(0.98);
}

.visit-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin-right: 12px;
  transition: all 0.3s ease;
}

.visit-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.visit-label {
  font-weight: 600;
  font-size: 14px;
  color: #374151;
  line-height: 1.2;
}

.visit-count {
  font-weight: 700;
  font-size: 16px;
  color: #1f2937;
}

.visit-arrow {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  color: #9ca3af;
  transition: all 0.3s ease;
}

.visit-item:hover .visit-arrow {
  color: #374151;
  transform: translateX(4px);
}

/* Estilos específicos por tipo de visita */
.visit-item.login {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.visit-item.login:hover {
  background: linear-gradient(135deg, #bfdbfe 0%, #93c5fd 100%);
  border-color: #3b82f6;
}

.visit-item.login .visit-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
}

.visit-item.books {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
}

.visit-item.books:hover {
  background: linear-gradient(135deg, #bbf7d0 0%, #86efac 100%);
  border-color: #10b981;
}

.visit-item.books .visit-icon {
  background: linear-gradient(135deg, #10b981, #047857);
  color: white;
}

.visit-item.units {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.visit-item.units:hover {
  background: linear-gradient(135deg, #fde68a 0%, #fcd34d 100%);
  border-color: #f59e0b;
}

.visit-item.units .visit-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.visit-item.notebooks {
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
}

.visit-item.notebooks:hover {
  background: linear-gradient(135deg, #c7d2fe 0%, #a5b4fc 100%);
  border-color: #6366f1;
}

.visit-item.notebooks .visit-icon {
  background: linear-gradient(135deg, #6366f1, #4f46e5);
  color: white;
}

.visit-item.homework {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
}

.visit-item.homework:hover {
  background: linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%);
  border-color: #ec4899;
}

.visit-item.homework .visit-icon {
  background: linear-gradient(135deg, #ec4899, #db2777);
  color: white;
}

.visit-item.projects {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.visit-item.projects:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-color: #0ea5e9;
}

.visit-item.projects .visit-icon {
  background: linear-gradient(135deg, #0ea5e9, #0284c7);
  color: white;
}

.visit-item.adaptations {
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
}

.visit-item.adaptations:hover {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-color: #8b5cf6;
}

.visit-item.adaptations .visit-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

.visit-item.methodology {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.visit-item.methodology:hover {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #f59e0b;
}

.visit-item.methodology .visit-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
  color: white;
}

.visit-item.games {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
}

.visit-item.games:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  border-color: #ef4444;
}

.visit-item.games .visit-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
}

.visit-item.materials {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.visit-item.materials:hover {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  border-color: #22c55e;
}

.visit-item.materials .visit-icon {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

.visit-item.articles {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.visit-item.articles:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-color: #64748b;
}

.visit-item.articles .visit-icon {
  background: linear-gradient(135deg, #64748b, #475569);
  color: white;
}

.visit-item.tasks {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.visit-item.tasks:hover {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-color: #059669;
}

.visit-item.tasks .visit-icon {
  background: linear-gradient(135deg, #059669, #047857);
  color: white;
}

.visit-item.pdf-guide {
  background: linear-gradient(135deg, #fef2f2 0%, #fecaca 100%);
}

.visit-item.pdf-guide:hover {
  background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
  border-color: #dc2626;
}

.visit-item.pdf-guide .visit-icon {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  color: white;
}

.visit-item.pdf-no-guide {
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
}

.visit-item.pdf-no-guide:hover {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-color: #7c3aed;
}

.visit-item.pdf-no-guide .visit-icon {
  background: linear-gradient(135deg, #7c3aed, #6d28d9);
  color: white;
}

.visit-item.didactic-guide {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
}

.visit-item.didactic-guide:hover {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-color: #d97706;
}

.visit-item.didactic-guide .visit-icon {
  background: linear-gradient(135deg, #d97706, #b45309);
  color: white;
}

.visit-item.planning {
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.visit-item.planning:hover {
  background: linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%);
  border-color: #0284c7;
}

.visit-item.planning .visit-icon {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: white;
}

.visit-item.ministerial {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.visit-item.ministerial:hover {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-color: #475569;
}

.visit-item.ministerial .visit-icon {
  background: linear-gradient(135deg, #475569, #334155);
  color: white;
}

.visit-item.videos {
  background: linear-gradient(135deg, #fce7f3 0%, #fbcfe8 100%);
}

.visit-item.videos:hover {
  background: linear-gradient(135deg, #fbcfe8 0%, #f9a8d4 100%);
  border-color: #db2777;
}

.visit-item.videos .visit-icon {
  background: linear-gradient(135deg, #db2777, #be185d);
  color: white;
}

.visit-item.activities {
  background: linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%);
}

.visit-item.activities:hover {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
  border-color: #16a34a;
}

.visit-item.activities .visit-icon {
  background: linear-gradient(135deg, #16a34a, #15803d);
  color: white;
}

.visit-item.animations {
  background: linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%);
}

.visit-item.animations:hover {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-color: #8b5cf6;
}

.visit-item.animations .visit-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
  color: white;
}

/* Responsive - visit items */
@media (max-width: 768px) {
  .visit-item {
    padding: 10px 12px;
    min-width: 0;
    width: 100%;
  }

  .visits-container {
    width: 100%;
  }

  .visit-content {
    min-width: 0;
  }

  .visit-label {
    font-size: 13px;
    white-space: normal;
  }

  .visit-count {
    font-size: 15px;
  }

  .visit-icon {
    width: 35px;
    height: 35px;
    margin-right: 10px;
    flex-shrink: 0;
  }

  .individual-chart-container {
    width: 100%;
    max-width: 100%;
    height: 300px;
    padding: 10px;
    margin: 0 auto;
    overflow: hidden;
  }
}
</style>

<style>
@media (max-width: 768px) {
  .visitas-users-section .tabla-visitas .con-tablex,
  .visitas-users-section .tabla-visitas .vs-con-tbody {
    overflow: visible !important;
  }

  .visitas-users-section .tabla-visitas .vs-table--thead {
    display: none !important;
  }

  .visitas-users-section .tabla-visitas table.vs-table--tbody-table {
    display: block !important;
    width: 100% !important;
    min-width: 0 !important;
    table-layout: auto !important;
  }

  .visitas-users-section .tabla-visitas tbody {
    display: block !important;
    width: 100% !important;
  }

  .visitas-users-section .tabla-visitas tr.visitas-row {
    display: flex !important;
    flex-direction: column !important;
    width: 100% !important;
    margin-bottom: 16px;
    padding: 14px;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #fff;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  }

  .visitas-users-section .tabla-visitas tr.visitas-row > td {
    display: block !important;
    width: 100% !important;
    max-width: 100% !important;
    min-width: 0 !important;
    overflow: visible !important;
    white-space: normal !important;
    word-break: normal !important;
    padding: 10px 0 !important;
    border: none !important;
  }

  .visitas-users-section .tabla-visitas tr.visitas-row > td > span {
    display: block;
    width: 100%;
  }

  .visitas-users-section .tabla-visitas tr.visitas-row > td:not(:last-child) {
    border-bottom: 1px solid #f1f5f9 !important;
    margin-bottom: 8px;
    padding-bottom: 12px !important;
  }

  .visitas-users-section .tabla-visitas .visitas-td-datos::before,
  .visitas-users-section .tabla-visitas .visitas-td-grafico::before,
  .visitas-users-section .tabla-visitas .visitas-td-acciones::before {
    display: block;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: #64748b;
    margin-bottom: 8px;
  }

  .visitas-users-section .tabla-visitas .visitas-td-datos::before {
    content: 'Datos';
  }

  .visitas-users-section .tabla-visitas .visitas-td-grafico::before {
    content: 'Visitas';
  }

  .visitas-users-section .tabla-visitas .visitas-td-acciones::before {
    content: 'Acciones';
  }
}
</style>
