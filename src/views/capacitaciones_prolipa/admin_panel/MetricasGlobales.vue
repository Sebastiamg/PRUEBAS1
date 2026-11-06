<template>
  <div class="metricas-globales">
    <div class="metricas-header">
      <h2><Icon name="analytics" /> Configuración y Reportes Avanzados</h2>
      <p>Panel de administración avanzada del módulo de capacitaciones</p>
    </div>

    <!-- Navegación por pestañas -->
    <div class="tabs-navigation">
      <button 
        v-for="tab in tabs" 
        :key="tab.id"
        @click="tabActual = tab.id"
        class="tab-btn"
        :class="{ active: tabActual === tab.id }"
      >
        <Icon :name="tab.icon" />
        {{ tab.label }}
      </button>
    </div>

    <!-- Contenido de pestañas -->
    <div class="tab-content">
      <!-- TAB 1: REPORTES AVANZADOS -->
      <div v-if="tabActual === 'reportes'" class="tab-panel animate-fade-in">
        <div class="panel-header">
          <h3><Icon name="document" /> Exportar Reportes</h3>
          <p>Descarga información detallada en formato PDF o Excel</p>
        </div>

        <div class="reportes-grid">
          <div class="reporte-card">
            <div class="reporte-icon"><Icon name="book" size="2.5rem" color="#3b82f6" /></div>
            <div class="reporte-info">
              <h4>Reporte de Capacitaciones</h4>
              <p>Listado completo con estadísticas y resultados</p>
            </div>
            <div class="btn-group">
              <button @click="generarReportePDF('capacitaciones')" class="btn-export btn-pdf" :disabled="exportando">
                <Icon name="document" /> PDF
              </button>
              <button @click="exportarReporteExcel('capacitaciones')" class="btn-export btn-excel" :disabled="exportando">
                <Icon name="download" /> Excel
              </button>
            </div>
          </div>

          <div class="reporte-card">
            <div class="reporte-icon"><Icon name="users" size="2.5rem" color="#10b981" /></div>
            <div class="reporte-info">
              <h4>Reporte de Usuarios</h4>
              <p>Participación, puntajes y certificados emitidos</p>
            </div>
            <div class="btn-group">
              <button @click="generarReportePDF('usuarios')" class="btn-export btn-pdf" :disabled="exportando">
                <Icon name="document" /> PDF
              </button>
              <button @click="exportarReporteExcel('usuarios')" class="btn-export btn-excel" :disabled="exportando">
                <Icon name="download" /> Excel
              </button>
            </div>
          </div>

          <div class="reporte-card">
            <div class="reporte-icon"><Icon name="trophy" size="2.5rem" color="#a855f7" /></div>
            <div class="reporte-info">
              <h4>Reporte de Certificados</h4>
              <p>Todos los certificados emitidos con detalles</p>
            </div>
            <div class="btn-group">
              <button @click="generarReportePDF('certificados')" class="btn-export btn-pdf" :disabled="exportando">
                <Icon name="document" /> PDF
              </button>
              <button @click="exportarReporteExcel('certificados')" class="btn-export btn-excel" :disabled="exportando">
                <Icon name="download" /> Excel
              </button>
            </div>
          </div>

          <div class="reporte-card">
            <div class="reporte-icon"><Icon name="building" size="2.5rem" color="#f59e0b" /></div>
            <div class="reporte-info">
              <h4>Reporte por Departamentos</h4>
              <p>Análisis de participación por departamento</p>
            </div>
            <div class="btn-group">
              <button @click="generarReportePDF('departamentos')" class="btn-export btn-pdf" :disabled="exportando">
                <Icon name="document" /> PDF
              </button>
              <button @click="exportarReporteExcel('departamentos')" class="btn-export btn-excel" :disabled="exportando">
                <Icon name="download" /> Excel
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 2: CONFIGURACIÓN GLOBAL -->
      <div v-if="tabActual === 'configuracion'" class="tab-panel animate-fade-in">
        <div class="panel-header">
          <h3><Icon name="settings" /> Configuración del Sistema</h3>
          <p>Parámetros globales del módulo de capacitaciones</p>
        </div>

        <div class="config-section">
          <div class="config-card">
            <h4>Parámetros por Defecto</h4>
            <div class="form-group">
              <label>Intentos Permitidos por Defecto</label>
              <input type="number" v-model.number="configuracion.intentos_default" min="0" />
              <small>0 = ilimitados</small>
            </div>

            <div class="form-group">
              <label>Puntaje Mínimo de Aprobación (%)</label>
              <input type="number" v-model.number="configuracion.puntaje_minimo_default" min="0" max="100" />
            </div>

            <div class="form-group">
              <label>Duración Estimada por Defecto (horas)</label>
              <input type="number" v-model.number="configuracion.duracion_default" min="0" step="0.5" />
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="configuracion.mostrar_respuestas_default" />
                <span>Mostrar respuestas correctas por defecto</span>
              </label>
            </div>

            <button @click="guardarConfiguracion" class="btn-save" :disabled="guardando">
              <Icon name="save" /> Guardar Configuración
            </button>
          </div>

          <div class="config-card">
            <h4>Notificaciones</h4>
            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="configuracion.notificar_nuevas" />
                <span>Notificar a usuarios sobre nuevas capacitaciones</span>
              </label>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="configuracion.notificar_recordatorio" />
                <span>Enviar recordatorios de capacitaciones pendientes</span>
              </label>
            </div>

            <div class="form-group">
              <label class="checkbox-label">
                <input type="checkbox" v-model="configuracion.notificar_certificado" />
                <span>Notificar automáticamente al emitir certificado</span>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- TAB 3: GESTIÓN DE DEPARTAMENTOS -->
      <div v-if="tabActual === 'departamentos'" class="tab-panel animate-fade-in">
        <div class="panel-header">
          <h3><Icon name="building" /> Gestión de Departamentos</h3>
          <p>Administra los departamentos de la empresa</p>
          <button @click="abrirModalDepartamento()" class="btn-new">
            <Icon name="plus" /> Nuevo Departamento
          </button>
        </div>

        <div v-if="cargandoDepartamentos" class="loading">
          <div class="spinner"></div>
          <p>Cargando departamentos...</p>
        </div>

        <div v-else class="departamentos-table">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Iniciales</th>
                <th>Estado</th>
                <th>Usuarios</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="dept in departamentos" :key="dept.tdp_id">
                <td>{{ dept.tdp_id }}</td>
                <td>{{ dept.tdp_nombre }}</td>
                <td><span class="badge-iniciales">{{ dept.tdp_iniciales }}</span></td>
                <td>
                  <span class="badge-estado" :class="dept.tdp_estado === 1 ? 'activo' : 'inactivo'">
                    {{ dept.tdp_estado === 1 ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td>{{ dept.usuarios_count || 0 }}</td>
                <td class="acciones-td">
                  <button @click="abrirModalDepartamento(dept)" class="btn-icon" title="Editar">
                    <Icon name="edit" />
                  </button>
                  <button @click="toggleEstadoDepartamento(dept)" class="btn-icon" title="Cambiar Estado">
                    <Icon :name="dept.tdp_estado === 1 ? 'pause' : 'play'" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- TAB 4: LOGS Y AUDITORÍA -->
      <div v-if="tabActual === 'logs'" class="tab-panel animate-fade-in">
        <div class="panel-header">
          <h3><Icon name="clock" /> Logs y Auditoría</h3>
          <p>Historial de actividades y cambios en el sistema</p>
        </div>

        <div class="filtros-logs">
          <select v-model="filtrosLogs.tipo" @change="cargarLogs">
            <option value="">Todos los tipos</option>
            <option value="creacion">Creaciones</option>
            <option value="edicion">Ediciones</option>
            <option value="eliminacion">Eliminaciones</option>
            <option value="cambio_estado">Cambios de Estado</option>
          </select>

          <input 
            type="date" 
            v-model="filtrosLogs.fecha_desde" 
            @change="cargarLogs"
            placeholder="Desde"
          />

          <input 
            type="date" 
            v-model="filtrosLogs.fecha_hasta" 
            @change="cargarLogs"
            placeholder="Hasta"
          />
        </div>

        <div v-if="cargandoLogs" class="loading">
          <div class="spinner"></div>
          <p>Cargando logs...</p>
        </div>

        <div v-else class="logs-timeline">
          <div v-for="log in logs" :key="log.id" class="log-item">
            <div class="log-icon" :class="'tipo-' + log.tipo">
              <Icon :name="getLogIcon(log.tipo)" />
            </div>
            <div class="log-content">
              <div class="log-header">
                <strong>{{ log.usuario_nombre }}</strong>
                <span class="log-accion">{{ log.accion }}</span>
              </div>
              <p class="log-descripcion">{{ log.descripcion }}</p>
              <span class="log-fecha">{{ formatearFechaHora(log.created_at) }}</span>
            </div>
          </div>
          
          <div v-if="logs.length === 0" class="empty-logs">
            <Icon name="alert" size="3rem" color="#94a3b8" />
            <p>No hay logs registrados</p>
          </div>
        </div>
      </div>

      <!-- TAB 5: MÉTRICAS DE ADMINISTRADORES -->
      <div v-if="tabActual === 'administradores'" class="tab-panel animate-fade-in">
        <div class="panel-header">
          <h3><Icon name="users" /> Métricas de Administradores</h3>
          <p>Rendimiento del equipo administrativo</p>
        </div>

        <div v-if="cargandoAdmins" class="loading">
          <div class="spinner"></div>
          <p>Cargando métricas...</p>
        </div>

        <div v-else class="admins-grid">
          <div v-for="admin in administradores" :key="admin.idusuario" class="admin-card">
            <div class="admin-avatar">{{ admin.iniciales }}</div>
            <div class="admin-info">
              <h4>{{ admin.nombres }} {{ admin.apellidos }}</h4>
              <p class="admin-email">{{ admin.email }}</p>
            </div>
            <div class="admin-stats">
              <div class="stat">
                <span class="stat-valor">{{ admin.capacitaciones_creadas }}</span>
                <span class="stat-label">Creadas</span>
              </div>
              <div class="stat">
                <span class="stat-valor">{{ admin.capacitaciones_activas }}</span>
                <span class="stat-label">Activas</span>
              </div>
              <div class="stat">
                <span class="stat-valor">{{ admin.ultima_actividad }}</span>
                <span class="stat-label">Última Actividad</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Departamento -->
    <div v-if="modalDepartamento.visible" class="modal-overlay" @click="cerrarModalDepartamento">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>
            <Icon name="building" /> 
            {{ modalDepartamento.editando ? 'Editar Departamento' : 'Nuevo Departamento' }}
          </h3>
          <button @click="cerrarModalDepartamento" class="btn-close">×</button>
        </div>

        <form @submit.prevent="guardarDepartamento" class="modal-form">
          <div class="form-group">
            <label>Nombre del Departamento</label>
            <input 
              type="text" 
              v-model="modalDepartamento.form.tdp_nombre" 
              placeholder="Ej. Recursos Humanos"
              required
            />
          </div>

          <div class="form-group">
            <label>Iniciales</label>
            <input 
              type="text" 
              v-model="modalDepartamento.form.tdp_iniciales" 
              placeholder="Ej. RRHH"
              maxlength="10"
              required
            />
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" v-model="modalDepartamento.form.tdp_estado" />
              <span>Departamento Activo</span>
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" @click="cerrarModalDepartamento" class="btn-cancel">
              Cancelar
            </button>
            <button type="submit" class="btn-save" :disabled="guardando">
              <Icon name="save" /> Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>


<script>
import Icon from '../components/Icon.vue';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import Chart from 'chart.js';

// Configurar fuentes de pdfMake
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

// URLs de imágenes corporativas para PDFs
const URL_CABECERA = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_CABECERA_PRINCIPAL.png';
const URL_MARCA_AGUA = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_MARCA_AGUA.png';
const URL_PIE_PAGINA = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_PIE_PAGINA_PRINCIPAL.png';

export default {
  name: 'MetricasGlobales',
  components: {
    Icon
  },
  props: {
    idusuario: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      tabActual: 'reportes',
      tabs: [
        { id: 'reportes', label: 'Reportes', icon: 'document' },
        { id: 'configuracion', label: 'Configuración', icon: 'settings' },
        { id: 'departamentos', label: 'Departamentos', icon: 'building' },
        { id: 'logs', label: 'Auditoría', icon: 'clock' },
        { id: 'administradores', label: 'Administradores', icon: 'users' }
      ],
      exportando: false,
      guardando: false,
      
      // Configuración
      configuracion: {
        intentos_default: 3,
        puntaje_minimo_default: 70,
        duracion_default: 1,
        mostrar_respuestas_default: true,
        notificar_nuevas: true,
        notificar_recordatorio: false,
        notificar_certificado: true
      },

      // Departamentos
      departamentos: [],
      cargandoDepartamentos: false,
      modalDepartamento: {
        visible: false,
        editando: false,
        form: {
          tdp_id: null,
          tdp_nombre: '',
          tdp_iniciales: '',
          tdp_estado: true
        }
      },

      // Logs
      logs: [],
      cargandoLogs: false,
      filtrosLogs: {
        tipo: '',
        fecha_desde: '',
        fecha_hasta: ''
      },

      // Administradores
      administradores: [],
      cargandoAdmins: false
    };
  },
  mounted() {
    this.cargarDepartamentos();
  },
  watch: {
    tabActual(newTab) {
      if (newTab === 'departamentos') {
        this.cargarDepartamentos();
      } else if (newTab === 'logs') {
        this.cargarLogs();
      } else if (newTab === 'administradores') {
        this.cargarAdministradores();
      }
    }
  },
  methods: {
    // ========== REPORTES PDF CON PDFMAKE ==========
    async generarReportePDF(tipo) {
      this.exportando = true;
      
      try {
        const datosReporte = await this.cargarDatosReporte(tipo);
        
        if (!datosReporte || datosReporte.length === 0) {
          this.$emit('show-toast', { 
            mensaje: 'No hay datos disponibles para este reporte', 
            tipo: 'warning' 
          });
          return;
        }

        let docDefinition;

        switch(tipo) {
          case 'capacitaciones':
            docDefinition = await this.crearPDFCapacitaciones(datosReporte);
            break;
          case 'usuarios':
            docDefinition = await this.crearPDFUsuarios(datosReporte);
            break;
          case 'certificados':
            docDefinition = await this.crearPDFCertificados(datosReporte);
            break;
          case 'departamentos':
            docDefinition = await this.crearPDFDepartamentos(datosReporte);
            break;
        }

        pdfMake.createPdf(docDefinition).download(`Reporte_${tipo}_${Date.now()}.pdf`);

        this.$emit('show-toast', { 
          mensaje: 'Reporte PDF generado exitosamente', 
          tipo: 'success' 
        });

      } catch (error) {
        this.$emit('show-toast', { 
          mensaje: 'Error al generar el reporte PDF', 
          tipo: 'error' 
        });
      } finally {
        this.exportando = false;
      }
    },

    // Crear PDF de Capacitaciones
    async crearPDFCapacitaciones(datos) {
      const chartImage = await this.generarGraficoCapacitaciones(datos.slice(0, 10));
      const totalParticipantes = datos.reduce((sum, c) => sum + (c.participantes || 0), 0);
      const totalCertificados = datos.reduce((sum, c) => sum + (c.certificados || 0), 0);
      const promedioGeneral = datos.length > 0 
        ? (datos.reduce((sum, c) => sum + parseFloat(c.promedio_puntaje || 0), 0) / datos.length).toFixed(2)
        : 0;

      return {
        pageOrientation: 'portrait',
        pageMargins: [40, 80, 40, 60],
        header: function(currentPage) {
          return {
            columns: [
              {
                image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
                width: 0,
                margin: [40, 20, 0, 0]
              },
              {
                stack: [
                  { text: 'PROLIPA', style: 'headerTitle', color: '#3b82f6' },
                  { text: 'Sistema de Capacitaciones y Talento Humano', style: 'headerSubtitle' }
                ],
                margin: [40, 20, 0, 0]
              },
              {
                text: new Date().toLocaleDateString('es-ES', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }),
                alignment: 'right',
                margin: [0, 25, 40, 0],
                fontSize: 9,
                color: '#64748b'
              }
            ]
          };
        },
        footer: function(currentPage, pageCount) {
          return {
            columns: [
              {
                text: 'Documento generado automáticamente',
                fontSize: 8,
                color: '#94a3b8',
                margin: [40, 10, 0, 0]
              },
              {
                text: `Página ${currentPage} de ${pageCount}`,
                alignment: 'right',
                fontSize: 9,
                color: '#64748b',
                margin: [0, 10, 40, 0]
              }
            ]
          };
        },
        content: [
          // Título principal
          {
            stack: [
              { text: 'REPORTE DE CAPACITACIONES', style: 'title', margin: [0, 0, 0, 5] },
              { text: 'Análisis Completo con Estadísticas y Resultados', style: 'subtitle' },
              {
                canvas: [
                  {
                    type: 'line',
                    x1: 0, y1: 0,
                    x2: 515, y2: 0,
                    lineWidth: 2,
                    lineColor: '#3b82f6'
                  }
                ],
                margin: [0, 10, 0, 20]
              }
            ]
          },
          
          // Resumen ejecutivo con cards mejorados
          {
            text: 'RESUMEN EJECUTIVO',
            style: 'sectionTitle',
            margin: [0, 0, 0, 15]
          },
          {
            columns: [
              {
                stack: [
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: 120, h: 70,
                        r: 8,
                        color: '#eff6ff'
                      }
                    ]
                  },
                  {
                    text: [
                      { text: datos.length.toString(), fontSize: 32, bold: true, color: '#3b82f6' },
                      { text: '\nCapacitaciones', fontSize: 10, color: '#64748b' }
                    ],
                    alignment: 'center',
                    margin: [0, -55, 0, 0]
                  }
                ],
                width: 120
              },
              {
                stack: [
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: 120, h: 70,
                        r: 8,
                        color: '#f0fdf4'
                      }
                    ]
                  },
                  {
                    text: [
                      { text: totalParticipantes.toString(), fontSize: 32, bold: true, color: '#10b981' },
                      { text: '\nParticipantes', fontSize: 10, color: '#64748b' }
                    ],
                    alignment: 'center',
                    margin: [0, -55, 0, 0]
                  }
                ],
                width: 120
              },
              {
                stack: [
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: 120, h: 70,
                        r: 8,
                        color: '#faf5ff'
                      }
                    ]
                  },
                  {
                    text: [
                      { text: totalCertificados.toString(), fontSize: 32, bold: true, color: '#a855f7' },
                      { text: '\nCertificados', fontSize: 10, color: '#64748b' }
                    ],
                    alignment: 'center',
                    margin: [0, -55, 0, 0]
                  }
                ],
                width: 120
              },
              {
                stack: [
                  {
                    canvas: [
                      {
                        type: 'rect',
                        x: 0, y: 0,
                        w: 120, h: 70,
                        r: 8,
                        color: '#fffbeb'
                      }
                    ]
                  },
                  {
                    text: [
                      { text: `${promedioGeneral}%`, fontSize: 32, bold: true, color: '#f59e0b' },
                      { text: '\nPromedio', fontSize: 10, color: '#64748b' }
                    ],
                    alignment: 'center',
                    margin: [0, -55, 0, 0]
                  }
                ],
                width: 120
              }
            ],
            columnGap: 10,
            margin: [0, 0, 0, 25]
          },

          // Gráfico
          chartImage ? {
            stack: [
              { text: 'TOP 10 CAPACITACIONES MÁS POPULARES', style: 'sectionTitle', margin: [0, 0, 0, 15] },
              { image: chartImage, width: 500, alignment: 'center' }
            ],
            margin: [0, 0, 0, 25]
          } : {},

          // Tabla detallada
          {
            text: 'DETALLE DE CAPACITACIONES',
            style: 'sectionTitle',
            margin: [0, 0, 0, 15],
            pageBreak: 'before'
          },
          {
            table: {
              headerRows: 1,
              widths: ['*', 80, 60, 70],
              body: [
                [
                  { text: 'TÍTULO', style: 'tableHeader' },
                  { text: 'ESTADO', style: 'tableHeader', alignment: 'center' },
                  { text: 'PARTICIPANTES', style: 'tableHeader', alignment: 'center' },
                  { text: 'CERTIFICADOS', style: 'tableHeader', alignment: 'center' }
                ],
                ...datos.map((cap, index) => [
                  { 
                    text: (cap.titulo || cap.tema || 'Sin título').substring(0, 60),
                    fontSize: 9,
                    color: '#1e293b'
                  },
                  { 
                    text: cap.estado === 'activa' || cap.estado === 1 ? 'ACTIVA' : 'INACTIVA',
                    fontSize: 8,
                    bold: true,
                    alignment: 'center',
                    color: cap.estado === 'activa' || cap.estado === 1 ? '#10b981' : '#ef4444',
                    fillColor: cap.estado === 'activa' || cap.estado === 1 ? '#d1fae5' : '#fee2e2'
                  },
                  { 
                    text: (cap.participantes || 0).toString(),
                    fontSize: 9,
                    alignment: 'center',
                    bold: true,
                    color: '#3b82f6'
                  },
                  { 
                    text: (cap.certificados || 0).toString(),
                    fontSize: 9,
                    alignment: 'center',
                    bold: true,
                    color: '#a855f7'
                  }
                ])
              ]
            },
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex === 0 ? null : (rowIndex % 2 === 0 ? '#f8fafc' : null);
              },
              hLineWidth: function (i, node) {
                return i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5;
              },
              vLineWidth: function () { return 0.5; },
              hLineColor: function (i) { return i === 0 || i === 1 ? '#3b82f6' : '#e2e8f0'; },
              vLineColor: function () { return '#e2e8f0'; },
              paddingLeft: function() { return 10; },
              paddingRight: function() { return 10; },
              paddingTop: function() { return 8; },
              paddingBottom: function() { return 8; }
            }
          }
        ],
        styles: {
          headerTitle: {
            fontSize: 20,
            bold: true
          },
          headerSubtitle: {
            fontSize: 9,
            color: '#64748b',
            margin: [0, 2, 0, 0]
          },
          title: {
            fontSize: 22,
            bold: true,
            color: '#1e293b'
          },
          subtitle: {
            fontSize: 12,
            color: '#64748b',
            italics: true
          },
          sectionTitle: {
            fontSize: 14,
            bold: true,
            color: '#1e293b',
            fillColor: '#f1f5f9',
            margin: [0, 0, 0, 0],
            padding: [0, 5, 0, 5]
          },
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: '#ffffff',
            fillColor: '#3b82f6'
          }
        },
        defaultStyle: {
          font: 'Roboto'
        }
      };
    },

    // Crear PDF de Usuarios
    async crearPDFUsuarios(datos) {
      const totalCerts = datos.reduce((sum, u) => sum + (u.certificados || u.total_certificados || 0), 0);
      const promedioTotal = datos.length > 0 
        ? (datos.reduce((sum, u) => sum + (parseFloat(u.promedio || u.puntaje_promedio || 0)), 0) / datos.length).toFixed(2)
        : 0;

      return {
        pageOrientation: 'portrait',
        pageMargins: [40, 60, 40, 60],
        header: {
          columns: [
            { text: 'PROLIPA', style: 'header', margin: [40, 20, 0, 0] },
            { text: new Date().toLocaleDateString('es-ES'), alignment: 'right', margin: [0, 20, 40, 0], fontSize: 10, color: '#64748b' }
          ]
        },
        footer: function(currentPage, pageCount) {
          return {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'center',
            fontSize: 9,
            color: '#64748b'
          };
        },
        content: [
          { text: 'Reporte de Usuarios', style: 'title' },
          { text: 'Participación, puntajes y certificados emitidos', style: 'subtitle' },
          { text: '\n' },
          
          // Resumen
          {
            columns: [
              {
                width: '*',
                stack: [
                  { text: 'Total Usuarios', style: 'cardLabel' },
                  { text: datos.length.toString(), style: 'cardValue', color: '#10b981' }
                ],
                margin: [0, 0, 5, 10]
              },
              {
                width: '*',
                stack: [
                  { text: 'Certificados', style: 'cardLabel' },
                  { text: totalCerts.toString(), style: 'cardValue', color: '#a855f7' }
                ],
                margin: [5, 0, 5, 10]
              },
              {
                width: '*',
                stack: [
                  { text: 'Promedio', style: 'cardLabel' },
                  { text: `${promedioTotal}%`, style: 'cardValue', color: '#fbbf24' }
                ],
                margin: [5, 0, 0, 10]
              }
            ]
          },

          { text: '\n' },

          // Tabla
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto'],
              body: [
                [
                  { text: 'Usuario', style: 'tableHeader' },
                  { text: 'Certificados', style: 'tableHeader' },
                  { text: 'Promedio', style: 'tableHeader' }
                ],
                ...datos.map(user => [
                  { text: `${user.nombres || user.nombre || ''} ${user.apellidos || user.apellido || ''}`.trim() || 'Sin nombre', fontSize: 9 },
                  { text: (user.certificados || user.total_certificados || 0).toString(), fontSize: 9, alignment: 'center' },
                  { text: `${parseFloat(user.promedio || user.puntaje_promedio || 0).toFixed(2)}%`, fontSize: 9, alignment: 'center' }
                ])
              ]
            },
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex === 0 ? '#10b981' : (rowIndex % 2 === 0 ? '#f8fafc' : null);
              },
              hLineWidth: function () { return 0.5; },
              vLineWidth: function () { return 0.5; },
              hLineColor: function () { return '#e2e8f0'; },
              vLineColor: function () { return '#e2e8f0'; }
            }
          }
        ],
        styles: {
          header: {
            fontSize: 20,
            bold: true,
            color: '#3b82f6'
          },
          title: {
            fontSize: 18,
            bold: true,
            color: '#1e293b'
          },
          subtitle: {
            fontSize: 11,
            color: '#64748b',
            margin: [0, 5, 0, 0]
          },
          cardLabel: {
            fontSize: 10,
            color: '#64748b',
            margin: [0, 0, 0, 5]
          },
          cardValue: {
            fontSize: 24,
            bold: true
          },
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: 'white'
          }
        }
      };
    },

    // Crear PDF de Certificados
    async crearPDFCertificados(datos) {
      return {
        pageOrientation: 'landscape',
        pageMargins: [40, 60, 40, 60],
        header: {
          columns: [
            { text: 'PROLIPA', style: 'header', margin: [40, 20, 0, 0] },
            { text: new Date().toLocaleDateString('es-ES'), alignment: 'right', margin: [0, 20, 40, 0], fontSize: 10, color: '#64748b' }
          ]
        },
        footer: function(currentPage, pageCount) {
          return {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'center',
            fontSize: 9,
            color: '#64748b'
          };
        },
        content: [
          { text: 'Reporte de Certificados', style: 'title' },
          { text: 'Todos los certificados emitidos con detalles', style: 'subtitle' },
          { text: '\n' },
          
          { text: `Total de certificados emitidos: ${datos.length}`, fontSize: 11, margin: [0, 0, 0, 15] },

          // Tabla
          {
            table: {
              headerRows: 1,
              widths: ['*', '*', 'auto', 'auto'],
              body: [
                [
                  { text: 'Usuario', style: 'tableHeader' },
                  { text: 'Capacitación', style: 'tableHeader' },
                  { text: 'Puntaje', style: 'tableHeader' },
                  { text: 'Fecha', style: 'tableHeader' }
                ],
                ...datos.map(cert => [
                  { text: (cert.usuario_nombre || cert.nombres || 'N/A').substring(0, 30), fontSize: 9 },
                  { text: (cert.capacitacion_titulo || cert.titulo || 'N/A').substring(0, 40), fontSize: 9 },
                  { text: `${cert.puntaje || cert.puntaje_obtenido || 0}%`, fontSize: 9, alignment: 'center' },
                  { text: cert.fecha_emision || cert.created_at ? new Date(cert.fecha_emision || cert.created_at).toLocaleDateString('es-ES') : 'N/A', fontSize: 9 }
                ])
              ]
            },
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex === 0 ? '#a855f7' : (rowIndex % 2 === 0 ? '#f8fafc' : null);
              },
              hLineWidth: function () { return 0.5; },
              vLineWidth: function () { return 0.5; },
              hLineColor: function () { return '#e2e8f0'; },
              vLineColor: function () { return '#e2e8f0'; }
            }
          }
        ],
        styles: {
          header: {
            fontSize: 20,
            bold: true,
            color: '#3b82f6'
          },
          title: {
            fontSize: 18,
            bold: true,
            color: '#1e293b'
          },
          subtitle: {
            fontSize: 11,
            color: '#64748b',
            margin: [0, 5, 0, 0]
          },
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: 'white'
          }
        }
      };
    },

    // Crear PDF de Departamentos
    async crearPDFDepartamentos(datos) {
      const chartImage = await this.generarGraficoDepartamentos(datos);
      const totalUsuarios = datos.reduce((sum, d) => sum + (d.usuarios || d.usuarios_count || 0), 0);

      return {
        pageOrientation: 'portrait',
        pageMargins: [40, 60, 40, 60],
        header: {
          columns: [
            { text: 'PROLIPA', style: 'header', margin: [40, 20, 0, 0] },
            { text: new Date().toLocaleDateString('es-ES'), alignment: 'right', margin: [0, 20, 40, 0], fontSize: 10, color: '#64748b' }
          ]
        },
        footer: function(currentPage, pageCount) {
          return {
            text: `Página ${currentPage} de ${pageCount}`,
            alignment: 'center',
            fontSize: 9,
            color: '#64748b'
          };
        },
        content: [
          { text: 'Reporte por Departamentos', style: 'title' },
          { text: 'Análisis de participación por departamento', style: 'subtitle' },
          { text: '\n' },
          
          // Resumen
          {
            columns: [
              {
                width: '*',
                stack: [
                  { text: 'Total Departamentos', style: 'cardLabel' },
                  { text: datos.length.toString(), style: 'cardValue', color: '#f59e0b' }
                ],
                margin: [0, 0, 5, 10]
              },
              {
                width: '*',
                stack: [
                  { text: 'Total Usuarios', style: 'cardLabel' },
                  { text: totalUsuarios.toString(), style: 'cardValue', color: '#10b981' }
                ],
                margin: [5, 0, 0, 10]
              }
            ]
          },

          { text: '\n' },

          // Gráfico
          chartImage ? { image: chartImage, width: 500, alignment: 'center', margin: [0, 0, 0, 20] } : {},

          // Tabla
          {
            table: {
              headerRows: 1,
              widths: ['*', 'auto', 'auto', 'auto'],
              body: [
                [
                  { text: 'Departamento', style: 'tableHeader' },
                  { text: 'Usuarios', style: 'tableHeader' },
                  { text: 'Certificados', style: 'tableHeader' },
                  { text: 'Promedio', style: 'tableHeader' }
                ],
                ...datos.map(dept => [
                  { text: (dept.nombre || dept.tdp_nombre || 'Sin nombre').substring(0, 40), fontSize: 9 },
                  { text: (dept.usuarios || dept.usuarios_count || 0).toString(), fontSize: 9, alignment: 'center' },
                  { text: (dept.certificados || 0).toString(), fontSize: 9, alignment: 'center' },
                  { text: `${dept.promedio || 0}%`, fontSize: 9, alignment: 'center' }
                ])
              ]
            },
            layout: {
              fillColor: function (rowIndex) {
                return rowIndex === 0 ? '#f59e0b' : (rowIndex % 2 === 0 ? '#f8fafc' : null);
              },
              hLineWidth: function () { return 0.5; },
              vLineWidth: function () { return 0.5; },
              hLineColor: function () { return '#e2e8f0'; },
              vLineColor: function () { return '#e2e8f0'; }
            }
          }
        ],
        styles: {
          header: {
            fontSize: 20,
            bold: true,
            color: '#3b82f6'
          },
          title: {
            fontSize: 18,
            bold: true,
            color: '#1e293b'
          },
          subtitle: {
            fontSize: 11,
            color: '#64748b',
            margin: [0, 5, 0, 0]
          },
          cardLabel: {
            fontSize: 10,
            color: '#64748b',
            margin: [0, 0, 0, 5]
          },
          cardValue: {
            fontSize: 24,
            bold: true
          },
          tableHeader: {
            bold: true,
            fontSize: 10,
            color: 'white'
          }
        }
      };
    },

    // Generar gráfico de Chart.js para Capacitaciones
    async generarGraficoCapacitaciones(datos) {
      if (!datos || datos.length === 0) return null;

      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');

      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: datos.map(d => (d.titulo || d.nombre || '').substring(0, 20)),
          datasets: [{
            label: 'Participantes',
            data: datos.map(d => d.participantes || d.total_participantes || 0),
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderColor: '#3b82f6',
            borderWidth: 2
          }]
        },
        options: {
          responsive: false,
          animation: false,
          legend: { display: true },
          scales: {
            yAxes: [{
              ticks: { beginAtZero: true }
            }],
            xAxes: [{
              ticks: {
                maxRotation: 45,
                minRotation: 45
              }
            }]
          }
        }
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const imageData = canvas.toDataURL('image/png');
      chart.destroy();
      
      return imageData;
    },

    // Generar gráfico para Departamentos
    async generarGraficoDepartamentos(datos) {
      if (!datos || datos.length === 0) return null;

      const canvas = document.createElement('canvas');
      canvas.width = 800;
      canvas.height = 400;
      const ctx = canvas.getContext('2d');

      const chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: datos.map(d => d.nombre || d.tdp_nombre || ''),
          datasets: [{
            label: 'Usuarios',
            data: datos.map(d => d.usuarios || d.usuarios_count || 0),
            backgroundColor: 'rgba(251, 191, 36, 0.7)',
            borderColor: '#fbbf24',
            borderWidth: 2
          }]
        },
        options: {
          responsive: false,
          animation: false,
          legend: { display: true },
          scales: {
            yAxes: [{
              ticks: { beginAtZero: true }
            }]
          }
        }
      });

      await new Promise(resolve => setTimeout(resolve, 500));

      const imageData = canvas.toDataURL('image/png');
      chart.destroy();
      
      return imageData;
    },

    // ========== REPORTES EXCEL ==========
    async exportarReporteExcel(tipo) {
      this.exportando = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/reportes/${tipo}`,
          { responseType: 'blob' }
        );

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `reporte_${tipo}_${Date.now()}.xlsx`);
        document.body.appendChild(link);
        link.click();
        link.remove();

        this.$emit('show-toast', { mensaje: 'Reporte descargado exitosamente', tipo: 'success' });
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al generar el reporte', tipo: 'error' });
      } finally {
        this.exportando = false;
      }
    },

    // Cargar datos según tipo de reporte
    async cargarDatosReporte(tipo) {
      try {
        let endpoint = '';
        
        switch(tipo) {
          case 'capacitaciones':
            endpoint = `${this.$server_url}capacitaciones_prolipa/admin/reportes/capacitaciones-pdf`;
            break;
          case 'usuarios':
            endpoint = `${this.$server_url}capacitaciones_prolipa/admin/reportes/usuarios-pdf`;
            break;
          case 'certificados':
            endpoint = `${this.$server_url}capacitaciones_prolipa/admin/reportes/certificados-pdf`;
            break;
          case 'departamentos':
            endpoint = `${this.$server_url}capacitaciones_prolipa/admin/reportes/departamentos-pdf`;
            break;
        }

        const response = await this.$http.get(endpoint);
        
        if (response.data && response.data.success && response.data.data) {
          return response.data.data;
        }

        return this.generarDatosMock(tipo);

      } catch (error) {
        return this.generarDatosMock(tipo);
      }
    },

    // Generar datos mock para pruebas
    generarDatosMock(tipo) {
      switch(tipo) {
        case 'capacitaciones':
          return [
            { titulo: 'Seguridad Industrial', estado: 1, participantes: 45 },
            { titulo: 'Calidad Total', estado: 1, participantes: 32 },
            { titulo: 'Liderazgo Efectivo', estado: 1, participantes: 28 },
            { titulo: 'Gestión de Proyectos', estado: 1, participantes: 25 },
            { titulo: 'Comunicación Asertiva', estado: 0, participantes: 18 }
          ];
        case 'usuarios':
          return [
            { nombres: 'Juan', apellidos: 'Pérez', certificados: 5, promedio: 88.5 },
            { nombres: 'María', apellidos: 'González', certificados: 4, promedio: 92.3 },
            { nombres: 'Carlos', apellidos: 'López', certificados: 3, promedio: 85.7 },
            { nombres: 'Ana', apellidos: 'Martínez', certificados: 6, promedio: 91.2 }
          ];
        case 'certificados':
          return [
            { 
              usuario_nombre: 'Juan Pérez', 
              capacitacion_titulo: 'Seguridad Industrial', 
              puntaje: 88, 
              fecha_emision: new Date() 
            },
            { 
              usuario_nombre: 'María González', 
              capacitacion_titulo: 'Calidad Total', 
              puntaje: 92, 
              fecha_emision: new Date() 
            }
          ];
        case 'departamentos':
          return this.departamentos;
        default:
          return [];
      }
    },

    // ========== CONFIGURACIÓN ==========
    async guardarConfiguracion() {
      this.guardando = true;
      try {
        const response = await this.$http.post(
          `${this.$server_url}capacitaciones_prolipa/admin/configuracion`,
          {
            idusuario: this.idusuario,
            configuracion: this.configuracion
          }
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Configuración guardada', tipo: 'success' });
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al guardar', tipo: 'error' });
      } finally {
        this.guardando = false;
      }
    },

    // ========== DEPARTAMENTOS ==========
    async cargarDepartamentos() {
      this.cargandoDepartamentos = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}VerifcarMetodosGet_DepartamentosProlipa?action=Get_DepartamentosProlipa`
        );
        this.departamentos = Array.isArray(response.data) ? response.data : [];
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar departamentos', tipo: 'error' });
      } finally {
        this.cargandoDepartamentos = false;
      }
    },

    abrirModalDepartamento(departamento = null) {
      if (departamento) {
        this.modalDepartamento.editando = true;
        this.modalDepartamento.form = {
          tdp_id: departamento.tdp_id,
          tdp_nombre: departamento.tdp_nombre,
          tdp_iniciales: departamento.tdp_iniciales,
          tdp_estado: departamento.tdp_estado === 1
        };
      } else {
        this.modalDepartamento.editando = false;
        this.modalDepartamento.form = {
          tdp_id: null,
          tdp_nombre: '',
          tdp_iniciales: '',
          tdp_estado: true
        };
      }
      this.modalDepartamento.visible = true;
    },

    cerrarModalDepartamento() {
      this.modalDepartamento.visible = false;
    },

    async guardarDepartamento() {
      this.guardando = true;
      try {
        const payload = {
          ...this.modalDepartamento.form,
          tdp_estado: this.modalDepartamento.form.tdp_estado ? 1 : 0
        };

        const url = this.modalDepartamento.editando
          ? `${this.$server_url}capacitaciones_prolipa/admin/departamentos/${payload.tdp_id}`
          : `${this.$server_url}capacitaciones_prolipa/admin/departamentos`;

        const method = this.modalDepartamento.editando ? 'put' : 'post';
        
        const response = await this.$http[method](url, payload);

        if (response.data.success) {
          this.$emit('show-toast', { 
            mensaje: this.modalDepartamento.editando ? 'Departamento actualizado' : 'Departamento creado', 
            tipo: 'success' 
          });
          this.cerrarModalDepartamento();
          this.cargarDepartamentos();
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al guardar departamento', tipo: 'error' });
      } finally {
        this.guardando = false;
      }
    },

    async toggleEstadoDepartamento(departamento) {
      try {
        const nuevoEstado = departamento.tdp_estado === 1 ? 0 : 1;
        const response = await this.$http.put(
          `${this.$server_url}capacitaciones_prolipa/admin/departamentos/${departamento.tdp_id}`,
          {
            ...departamento,
            tdp_estado: nuevoEstado
          }
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Estado actualizado', tipo: 'success' });
          this.cargarDepartamentos();
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cambiar estado', tipo: 'error' });
      }
    },

    // ========== LOGS ==========
    async cargarLogs() {
      this.cargandoLogs = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/logs`,
          { params: this.filtrosLogs }
        );
        
        if (response.data.success) {
          this.logs = response.data.data;
        }
      } catch (error) {
        this.logs = [];
      } finally {
        this.cargandoLogs = false;
      }
    },

    getLogIcon(tipo) {
      const icons = {
        'creacion': 'plus',
        'edicion': 'edit',
        'eliminacion': 'trash',
        'cambio_estado': 'refresh'
      };
      return icons[tipo] || 'clock';
    },

    // ========== ADMINISTRADORES ==========
    async cargarAdministradores() {
      this.cargandoAdmins = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/metricas-administradores`
        );
        
        if (response.data.success) {
          this.administradores = response.data.data.map(admin => ({
            ...admin,
            iniciales: `${admin.nombres.charAt(0)}${admin.apellidos.charAt(0)}`
          }));
        }
      } catch (error) {
        this.administradores = [];
      } finally {
        this.cargandoAdmins = false;
      }
    },

    formatearFechaHora(fecha) {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toLocaleString('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>


<style scoped>
.metricas-globales {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.metricas-header {
  margin-bottom: 24px;
}

.metricas-header h2 {
  font-size: 1.75rem;
  color: #60a5fa;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.metricas-header p {
  color: #94a3b8;
  margin: 0;
}

/* Tabs Navigation */
.tabs-navigation {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  color: #ffffff;
  background-color: rgba(59, 130, 246, 0.05);
}

.tab-btn.active {
  color: #60a5fa;
  border-bottom-color: #3b82f6;
}

/* Tab Content */
.tab-content {
  animation: fadeIn 0.3s ease-out;
}

.tab-panel {
  background-color: rgba(30, 41, 59, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 24px;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
  gap: 12px;
}

.panel-header h3 {
  font-size: 1.25rem;
  color: #ffffff;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.panel-header p {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 4px 0 0 0;
  flex-basis: 100%;
}

/* Reportes */
.reportes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.reporte-card {
  background-color: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  transition: all 0.3s;
}

.reporte-card:hover {
  transform: translateY(-2px);
  border-color: #3b82f6;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

.reporte-icon {
  text-align: center;
}

.reporte-info h4 {
  color: #ffffff;
  margin: 0 0 4px 0;
  font-size: 1.1rem;
}

.reporte-info p {
  color: #94a3b8;
  margin: 0;
  font-size: 0.85rem;
}

.btn-group {
  display: flex;
  gap: 8px;
}

.btn-export {
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.9rem;
}

.btn-pdf {
  background-color: #ef4444;
  color: white;
}

.btn-pdf:hover:not(:disabled) {
  background-color: #dc2626;
  transform: translateY(-1px);
}

.btn-excel {
  background-color: #10b981;
  color: white;
}

.btn-excel:hover:not(:disabled) {
  background-color: #059669;
  transform: translateY(-1px);
}

.btn-export:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Configuración */
.config-section {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.config-card {
  background-color: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
}

.config-card h4 {
  color: #60a5fa;
  margin: 0 0 16px 0;
  font-size: 1rem;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 6px;
  font-weight: 600;
}

.form-group input[type="text"],
.form-group input[type="number"] {
  width: 100%;
  padding: 10px 12px;
  background-color: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
}

.form-group small {
  display: block;
  margin-top: 4px;
  font-size: 0.75rem;
  color: #64748b;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background-color: rgba(30, 41, 59, 0.5);
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.checkbox-label:hover {
  background-color: rgba(30, 41, 59, 0.8);
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
  transform: scale(1.2);
}

.btn-save,
.btn-new {
  padding: 10px 20px;
  background-color: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.btn-save:hover:not(:disabled),
.btn-new:hover {
  background-color: #059669;
  transform: translateY(-1px);
}

.btn-save:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Departamentos Table */
.departamentos-table {
  overflow-x: auto;
}

.departamentos-table table {
  width: 100%;
  border-collapse: collapse;
}

.departamentos-table th {
  text-align: left;
  padding: 12px;
  background-color: rgba(59, 130, 246, 0.1);
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.85rem;
  border-bottom: 2px solid rgba(59, 130, 246, 0.2);
}

.departamentos-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

.departamentos-table tr:hover {
  background-color: rgba(59, 130, 246, 0.05);
}

.badge-iniciales {
  padding: 4px 8px;
  background-color: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.badge-estado {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-estado.activo {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.badge-estado.inactivo {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.acciones-td {
  display: flex;
  gap: 8px;
}

.btn-icon {
  background: transparent;
  border: none;
  padding: 6px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  color: #94a3b8;
}

.btn-icon:hover {
  background-color: rgba(255, 255, 255, 0.05);
  color: #ffffff;
}

/* Logs Timeline */
.filtros-logs {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.filtros-logs select,
.filtros-logs input[type="date"] {
  padding: 10px 12px;
  background-color: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: white;
  font-size: 0.9rem;
}

.logs-timeline {
  max-height: 600px;
  overflow-y: auto;
}

.log-item {
  display: flex;
  gap: 16px;
  padding: 16px;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  margin-bottom: 12px;
  border-left: 3px solid #3b82f6;
}

.log-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.log-icon.tipo-creacion {
  background-color: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.log-icon.tipo-edicion {
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.log-icon.tipo-eliminacion {
  background-color: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.log-icon.tipo-cambio_estado {
  background-color: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.log-content {
  flex: 1;
}

.log-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.log-header strong {
  color: #ffffff;
}

.log-accion {
  color: #60a5fa;
  font-size: 0.9rem;
}

.log-descripcion {
  color: #94a3b8;
  margin: 0 0 4px 0;
  font-size: 0.9rem;
}

.log-fecha {
  color: #64748b;
  font-size: 0.8rem;
}

.empty-logs {
  text-align: center;
  padding: 60px 20px;
  color: #94a3b8;
}

/* Administradores */
.admins-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.admin-card {
  background-color: rgba(15, 23, 42, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.admin-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  margin: 0 auto;
}

.admin-info {
  text-align: center;
}

.admin-info h4 {
  color: #ffffff;
  margin: 0 0 4px 0;
  font-size: 1.1rem;
}

.admin-email {
  color: #94a3b8;
  font-size: 0.85rem;
  margin: 0;
}

.admin-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.admin-stats .stat {
  text-align: center;
}

.admin-stats .stat-valor {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #60a5fa;
}

.admin-stats .stat-label {
  display: block;
  font-size: 0.75rem;
  color: #94a3b8;
}

/* Loading */
.loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-content {
  background-color: #1e293b;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  border: 1px solid rgba(255, 255, 255, 0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-close {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 2rem;
  cursor: pointer;
  line-height: 1;
  padding: 0;
  width: 32px;
  height: 32px;
  transition: color 0.2s;
}

.btn-close:hover {
  color: #ffffff;
}

.modal-form {
  padding: 24px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.btn-cancel {
  padding: 10px 20px;
  background-color: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  background-color: rgba(148, 163, 184, 0.2);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out forwards;
}

/* Responsive */
@media (max-width: 1024px) {
  .reportes-grid,
  .config-section,
  .admins-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .metricas-globales {
    padding: 16px;
  }

  .tabs-navigation {
    overflow-x: scroll;
  }

  .tab-btn {
    padding: 10px 16px;
    font-size: 0.85rem;
  }

  .filtros-logs {
    flex-direction: column;
  }

  .btn-group {
    flex-direction: column;
  }

  .panel-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
