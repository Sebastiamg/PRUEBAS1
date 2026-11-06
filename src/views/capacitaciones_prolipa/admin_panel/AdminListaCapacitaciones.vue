<template>
  <div class="lista-capacitaciones">
    <!-- Tabs de filtros -->
    <div class="filter-tabs">
      <button 
        :class="['filter-tab', { active: filtroActivo === 'activas' }]"
        @click="filtroActivo = 'activas'"
      >
        <Icon name="check-circle" size="1.2em" />
        Activas
        <span class="badge">{{ contadores.activas }}</span>
      </button>
      <button 
        :class="['filter-tab', { active: filtroActivo === 'en_progreso' }]"
        @click="filtroActivo = 'en_progreso'"
      >
        <Icon name="hourglass" size="1.2em" />
        En Progreso
        <span class="badge">{{ contadores.en_progreso }}</span>
      </button>
      <button 
        :class="['filter-tab', { active: filtroActivo === 'inactivas' }]"
        @click="filtroActivo = 'inactivas'"
      >
        <Icon name="pause" size="1.2em" />
        Inactivas
        <span class="badge">{{ contadores.inactivas }}</span>
      </button>
      <button 
        :class="['filter-tab', { active: filtroActivo === 'borradores' }]"
        @click="filtroActivo = 'borradores'"
      >
        <Icon name="edit" size="1.2em" />
        Borradores
        <span class="badge">{{ contadores.borradores }}</span>
      </button>
      <button 
        :class="['filter-tab', { active: filtroActivo === 'todas' }]"
        @click="filtroActivo = 'todas'"
      >
        <Icon name="list" size="1.2em" />
        Todas
        <span class="badge">{{ contadores.todas }}</span>
      </button>
    </div>

    <!-- Barra de filtros -->
    <div class="filtros-bar">
      <div class="filtros-izq">
        <input
          type="text"
          v-model="filtros.busqueda"
          @input="buscar"
          placeholder="Buscar capacitaciones..."
          class="input-busqueda"
        />
        
        <label class="toggle-switch">
          <input type="checkbox" v-model="filtros.soloMias" @change="cargarCapacitaciones" />
          <span class="toggle-slider"></span>
          <span class="toggle-label">Solo mis capacitaciones</span>
        </label>
      </div>

      <div class="filtros-der">
        <button @click="cargarCapacitaciones" class="btn-refrescar" :disabled="cargando" title="Refrescar lista">
          <Icon name="refresh" />
          <span v-if="!cargando">Refrescar</span>
          <span v-else>Cargando...</span>
        </button>
        
        <button @click="$emit('cambiar-vista', 'crear')" class="btn-nuevo">
          <Icon name="plus" /> Nueva Capacitación
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando capacitaciones...</p>
    </div>

    <!-- Lista de capacitaciones -->
    <div v-else class="capacitaciones-grid">
      <div
        v-for="cap in capacitacionesFiltradas"
        :key="cap.id"
        class="capacitacion-card"
        :class="`estado-${cap.estado}`"
      >
        <!-- Header de la card -->
        <div class="card-header">
          <div class="card-titulo">
            <h3>{{ cap.tema }}</h3>
            <span class="badge-estado" :class="`badge-${cap.estado}`">
              {{ estadoLabel(cap.estado) }}
            </span>
          </div>
          
          <div class="card-acciones">
            <button 
              @click="generarReporte(cap.id)" 
              class="btn-icon btn-report" 
              title="Generar Reporte PDF"
              :disabled="generandoReporte"
              :class="{ 'btn-loading': generandoReporte }"
            >
              <Icon v-if="!generandoReporte" name="file" />
              <span v-else class="spinner-small"></span>
            </button>
            <button @click="gestionarCapacitacion(cap.id)" class="btn-icon" title="Gestionar">
              <Icon name="settings" />
            </button>
            <button @click="gestionarFirmas(cap.id)" class="btn-icon" title="Gestionar Firmas">
              <Icon name="signature" />
            </button>
            <button @click="verAnalytics(cap.id)" class="btn-icon" title="Ver Analytics">
              <Icon name="chart" />
            </button>
            <button @click="duplicarCapacitacion(cap.id)" class="btn-icon" title="Duplicar">
              <Icon name="copy" />
            </button>
            <button @click="confirmarEliminar(cap)" class="btn-icon btn-eliminar" title="Eliminar">
              <Icon name="trash" />
            </button>
          </div>
        </div>

        <!-- Descripción -->
        <p class="card-descripcion">{{ cap.descripcion }}</p>

        <!-- Métricas -->
        <div class="card-metricas">
          <div class="metrica">
            <span class="metrica-icono"><Icon name="book" size="1.5em" /></span>
            <div>
              <span class="metrica-valor">{{ (cap.recursos && cap.recursos.length) || 0 }}</span>
              <span class="metrica-label">Recursos</span>
            </div>
          </div>

          <div class="metrica">
            <span class="metrica-icono"><Icon name="question" size="1.5em" /></span>
            <div>
              <span class="metrica-valor">{{ (cap.preguntas && cap.preguntas.length) || 0 }}</span>
              <span class="metrica-label">Preguntas</span>
            </div>
          </div>

          <div class="metrica">
            <span class="metrica-icono"><Icon name="users" size="1.5em" /></span>
            <div>
              <span class="metrica-valor">{{ (cap.estadisticas && cap.estadisticas.total_usuarios) || 0 }}</span>
              <span class="metrica-label">Usuarios</span>
            </div>
          </div>

          <div class="metrica">
            <span class="metrica-icono"><Icon name="check-circle" size="1.5em" /></span>
            <div>
              <span class="metrica-valor">{{ (cap.estadisticas && cap.estadisticas.usuarios_aprobados) || 0 }}</span>
              <span class="metrica-label">Aprobados</span>
            </div>
          </div>
        </div>

        <!-- Estadísticas adicionales -->
        <div v-if="cap.estadisticas" class="card-stats">
          <div class="stat-item">
            <span class="stat-label">Tasa de aprobación:</span>
            <div class="stat-barra">
              <div 
                class="stat-progreso" 
                :style="`width: ${cap.estadisticas.tasa_aprobacion}%`"
              ></div>
            </div>
            <span class="stat-valor">{{ cap.estadisticas.tasa_aprobacion }}%</span>
          </div>

          <div class="stat-item">
            <span class="stat-label">Puntaje promedio:</span>
            <span class="stat-valor-grande">{{ cap.estadisticas.puntaje_promedio }}%</span>
          </div>
        </div>

        <!-- Info adicional -->
        <div class="card-footer">
          <div class="footer-info">
            <span class="info-item">
              <strong>Creado por:</strong> 
              {{ cap.creador ? `${cap.creador.nombres} ${cap.creador.apellidos}` : 'Desconocido' }}
            </span>
            <span class="info-item">
              <strong>Fecha:</strong> 
              {{ formatearFecha(cap.created_at) }}
            </span>
            <span class="info-item">
              <strong>Alcance:</strong> 
              <template v-if="cap.es_para_todos">
                <Icon name="globe" /> Toda la empresa
              </template>
              <template v-else>
                <Icon name="building" /> {{ ((cap.departamentos && cap.departamentos.length) || 0) }} departamentos
              </template>
            </span>
            <span class="info-item" v-if="cap.fecha_inicio && cap.fecha_fin">
              <strong>Vigencia:</strong> 
              {{ formatearFechaConHora(cap.fecha_inicio) }} - {{ formatearFechaConHora(cap.fecha_fin) }}
            </span>
          </div>

          <!-- Botones de acción -->
          <div class="footer-acciones">
            <button
              v-if="cap.estado === 'borrador'"
              @click="cambiarEstado(cap.id, 'activa')"
              class="btn-activar"
            >
              <Icon name="check-circle" /> Activar
            </button>
            <button
              v-else-if="cap.estado === 'activa'"
              @click="cambiarEstado(cap.id, 'inactiva')"
              class="btn-desactivar"
            >
              <Icon name="pause" /> Desactivar
            </button>
            <button
              v-else
              @click="cambiarEstado(cap.id, 'activa')"
              class="btn-activar"
            >
              <Icon name="play" /> Reactivar
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="capacitacionesFiltradas.length === 0" class="empty-state">
        <div class="empty-icon"><Icon name="book" size="5rem" /></div>
        <h3>{{ tituloVacio }}</h3>
        <p>{{ mensajeVacio }}</p>
        <button @click="$emit('cambiar-vista', 'crear')" class="btn-crear-primera">
          <Icon name="plus" /> Crear Primera Capacitación
        </button>
      </div>
    </div>

    <!-- Modal de confirmación eliminar -->
    <div v-if="modalEliminar.visible" class="modal-overlay" @click="modalEliminar.visible = false">
      <div class="modal-content" @click.stop>
        <h3><Icon name="warning" color="#f59e0b" /> Confirmar Eliminación</h3>
        <p>¿Estás seguro de eliminar la capacitación <strong>"{{ modalEliminar.capacitacion && modalEliminar.capacitacion.tema }}"</strong>?</p>
        <p class="modal-advertencia">Esta acción no se puede deshacer.</p>
        
        <div class="modal-acciones">
          <button @click="modalEliminar.visible = false" class="btn-cancelar">
            Cancelar
          </button>
          <button @click="eliminarCapacitacion" class="btn-confirmar-eliminar">
            <Icon name="trash" /> Eliminar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

// Configurar fuentes de pdfMake
if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

// URLs de imágenes corporativas para PDFs
const URL_CABECERA = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_CABECERA_PRINCIPAL.png';
const URL_MARCA_AGUA = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_MARCA_AGUA.png';
const URL_PIE_PAGINA = 'https://data.prolipadigital.com.ec/archivos/upload/img_plataforma/DOCUMENTOS_PIE_PAGINA_PRINCIPAL.png';

export default {
  name: 'AdminListaCapacitaciones',
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
      capacitaciones: [],
      capacitacionesFiltradas: [],
      cargando: false,
      generandoReporte: false, // Estado para bloquear botón durante generación
      filtroActivo: 'activas',
      filtros: {
        busqueda: '',
        estado: '',
        soloMias: false
      },
      modalEliminar: {
        visible: false,
        capacitacion: null
      },
      busquedaTimeout: null
    };
  },
  computed: {
    capacitacionesPorEstado() {
      if (this.filtroActivo === 'todas') {
        return this.capacitaciones;
      }

      const ahora = new Date();

      return this.capacitaciones.filter(cap => {
        const stats = cap.estadisticas || {};
        
        // Verificar vigencia
        const fechaInicio = cap.fecha_inicio ? new Date(cap.fecha_inicio) : null;
        const fechaFin = cap.fecha_fin ? new Date(cap.fecha_fin) : null;
        
        const yaInicio = !fechaInicio || ahora >= fechaInicio;
        const yaExpiro = fechaFin && ahora > fechaFin;

        switch (this.filtroActivo) {
          case 'activas':
            // Activas: estado activa Y aún no ha llegado fecha_inicio
            return cap.estado === 'activa' && !yaInicio;
          
          case 'en_progreso':
            // En Progreso: estado activa Y ya inició Y no ha expirado
            return cap.estado === 'activa' && yaInicio && !yaExpiro;
          
          case 'inactivas':
            // Inactivas: estado inactiva O expiradas (pasó fecha_fin)
            return cap.estado === 'inactiva' || (cap.estado === 'activa' && yaExpiro);
          
          case 'borradores':
            // Borradores: estado borrador
            return cap.estado === 'borrador';
          
          default:
            return true;
        }
      });
    },

    contadores() {
      const ahora = new Date();
      
      const activas = this.capacitaciones.filter(cap => {
        if (cap.estado !== 'activa') return false;
        const fechaInicio = cap.fecha_inicio ? new Date(cap.fecha_inicio) : null;
        const yaInicio = !fechaInicio || ahora >= fechaInicio;
        return !yaInicio; // Aún no ha iniciado
      }).length;

      const en_progreso = this.capacitaciones.filter(cap => {
        if (cap.estado !== 'activa') return false;
        const fechaInicio = cap.fecha_inicio ? new Date(cap.fecha_inicio) : null;
        const fechaFin = cap.fecha_fin ? new Date(cap.fecha_fin) : null;
        const yaInicio = !fechaInicio || ahora >= fechaInicio;
        const yaExpiro = fechaFin && ahora > fechaFin;
        return yaInicio && !yaExpiro; // Ya inició y no ha expirado
      }).length;

      const inactivas = this.capacitaciones.filter(cap => {
        if (cap.estado === 'inactiva') return true;
        if (cap.estado === 'activa') {
          const fechaFin = cap.fecha_fin ? new Date(cap.fecha_fin) : null;
          return fechaFin && ahora > fechaFin; // Expiradas
        }
        return false;
      }).length;

      const borradores = this.capacitaciones.filter(cap => 
        cap.estado === 'borrador'
      ).length;

      return {
        activas,
        en_progreso,
        inactivas,
        borradores,
        todas: this.capacitaciones.length
      };
    },

    tituloVacio() {
      switch (this.filtroActivo) {
        case 'activas':
          return 'No hay capacitaciones activas pendientes de inicio';
        case 'en_progreso':
          return 'No hay capacitaciones en progreso';
        case 'inactivas':
          return 'No hay capacitaciones inactivas';
        case 'borradores':
          return 'No hay borradores';
        case 'todas':
          return 'No hay capacitaciones';
        default:
          return 'No hay capacitaciones';
      }
    },

    mensajeVacio() {
      switch (this.filtroActivo) {
        case 'activas':
          return 'No hay capacitaciones activas que aún no hayan llegado a su fecha de inicio';
        case 'en_progreso':
          return 'No hay capacitaciones activas dentro de su período de vigencia';
        case 'inactivas':
          return 'No hay capacitaciones desactivadas o expiradas';
        case 'borradores':
          return 'No hay capacitaciones en estado borrador';
        case 'todas':
          return this.filtros.soloMias ? 'Aún no has creado ninguna capacitación' : 'No se encontraron capacitaciones';
        default:
          return '';
      }
    }
  },
  watch: {
    filtroActivo() {
      this.aplicarFiltros();
    }
  },
  mounted() {
    this.cargarCapacitaciones();
  },
  watch: {
    filtroActivo() {
      this.aplicarFiltros();
    }
  },
  methods: {
    async cargarCapacitaciones() {
      this.cargando = true;
      try {
        const params = {
          idusuario: this.idusuario,
          solo_mias: this.filtros.soloMias,
          estado: this.filtros.estado
        };

        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones`,
          { params }
        );

        if (response.data.success) {
          this.capacitaciones = response.data.data;
          this.aplicarFiltros();
          this.$emit('show-toast', { mensaje: 'Capacitaciones cargadas', tipo: 'success' });
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar capacitaciones', tipo: 'error' });
      } finally {
        this.cargando = false;
      }
    },

    buscar() {
      clearTimeout(this.busquedaTimeout);
      this.busquedaTimeout = setTimeout(() => {
        this.aplicarFiltros();
      }, 300);
    },

    aplicarFiltros() {
      // Primero aplicar filtro de estado activo
      let resultado = [...this.capacitacionesPorEstado];

      // Filtro de búsqueda
      if (this.filtros.busqueda) {
        const busqueda = this.filtros.busqueda.toLowerCase();
        resultado = resultado.filter(cap =>
          cap.tema.toLowerCase().includes(busqueda) ||
          cap.descripcion.toLowerCase().includes(busqueda)
        );
      }

      this.capacitacionesFiltradas = resultado;
    },

    async cambiarEstado(id, nuevoEstado) {
      try {
        const response = await this.$http.post(
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${id}/estado`,
          {
            estado: nuevoEstado,
            idusuario: this.idusuario
          }
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Estado actualizado exitosamente', tipo: 'success' });
          this.cargarCapacitaciones();
        } else {
          // Mostrar mensaje de error específico del backend
          this.$emit('show-toast', { 
            mensaje: response.data.message || 'Error al cambiar estado', 
            tipo: 'error' 
          });
        }
      } catch (error) {
        // Mostrar mensaje de error específico si viene del backend
        const errorMessage = (error.response && error.response.data && error.response.data.message) 
          || 'Error al cambiar estado';
        this.$emit('show-toast', { mensaje: errorMessage, tipo: 'error' });
      }
    },

    async duplicarCapacitacion(id) {
      try {
        const response = await this.$http.post(
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${id}/duplicar`,
          { idusuario: this.idusuario }
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Capacitación duplicada exitosamente', tipo: 'success' });
          this.cargarCapacitaciones();
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al duplicar capacitación', tipo: 'error' });
      }
    },

    confirmarEliminar(capacitacion) {
      this.modalEliminar.visible = true;
      this.modalEliminar.capacitacion = capacitacion;
    },

    async eliminarCapacitacion() {
      try {
        const response = await this.$http.delete(
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${this.modalEliminar.capacitacion.id}`
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Capacitación eliminada', tipo: 'success' });
          this.modalEliminar.visible = false;
          this.cargarCapacitaciones();
        }
      } catch (error) {
        const errorMessage = (error.response && error.response.data && error.response.data.message) || 'Error al eliminar capacitación';
        this.$emit('show-toast', { 
          mensaje: errorMessage, 
          tipo: 'error' 
        });
      }
    },

    verAnalytics(id) {
      this.$emit('ver-analytics', id);
    },

    gestionarCapacitacion(id) {
      this.$emit('gestionar-capacitacion', id);
    },

    gestionarFirmas(id) {
      this.$emit('gestionar-firmas', id);
    },

    editarCapacitacion(id) {
      this.$emit('editar-capacitacion', id);
    },

    estadoLabel(estado) {
      const labels = {
        'activa': 'Activa',
        'inactiva': 'Inactiva',
        'borrador': 'Borrador'
      };
      return labels[estado] || estado;
    },

    formatearFecha(fecha) {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    },

    formatearFechaConHora(fecha) {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    async generarReporte(capacitacionId) {
      try {
        // Bloquear el botón
        this.generandoReporte = true;
        
        // Mostrar mensaje de carga con color visible
        this.$emit('show-toast', { mensaje: 'Generando reporte PDF...', tipo: 'warning' });

        // 1. Obtener imágenes corporativas del backend
        const imagenesResponse = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/imagenes-corporativas`
        );

        let imagenesCorporativas = null;
        if (imagenesResponse.data.success) {
          imagenesCorporativas = imagenesResponse.data.data;
        }

        // 2. Obtener datos del reporte
        const dataResponse = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${capacitacionId}/reporte`
        );

        if (dataResponse.data.success) {
          const { capacitacion, usuarios, total_usuarios } = dataResponse.data.data;

          // Configurar el documento PDF con imágenes corporativas
          const docDefinition = {
            pageSize: 'A4',
            pageOrientation: 'portrait',
            // Márgenes: sin márgenes laterales en la primera página para imágenes full-width
            pageMargins: [40, 130, 40, 110],
            
            // Background con imágenes corporativas SOLO en página 1
            background: function(currentPage, pageSize) {
              if (currentPage === 1 && imagenesCorporativas) {
                const backgrounds = [];
                
                // Cabecera - Ocupa todo el ancho de la página (sin márgenes)
                if (imagenesCorporativas.cabecera) {
                  backgrounds.push({
                    image: imagenesCorporativas.cabecera,
                    width: pageSize.width, // Ancho completo de la página (595.28pt para A4)
                    absolutePosition: { x: 0, y: 0 } // Desde la esquina superior izquierda
                  });
                }
                
                // Marca de agua (centro de la página)
                if (imagenesCorporativas.marca_agua) {
                  backgrounds.push({
                    image: imagenesCorporativas.marca_agua,
                    width: 400,
                    opacity: 0.1,
                    absolutePosition: { x: (pageSize.width - 400) / 2, y: 300 }
                  });
                }
                
                // Pie de página - Ocupa todo el ancho de la página (sin márgenes)
                if (imagenesCorporativas.pie_pagina) {
                  backgrounds.push({
                    image: imagenesCorporativas.pie_pagina,
                    width: pageSize.width, // Ancho completo de la página
                    absolutePosition: { x: 0, y: pageSize.height - 80 } // Ajustar según altura del pie
                  });
                }
                
                return backgrounds;
              }
              return null;
            },
            
            // Header simple para páginas 2+
            header: function(currentPage) {
              if (currentPage > 1) {
                return {
                  margin: [40, 20, 40, 10],
                  columns: [
                    {
                      text: 'PROLIPA - Sistema de Capacitaciones',
                      fontSize: 9,
                      color: '#64748b'
                    },
                    {
                      text: `Página ${currentPage}`,
                      alignment: 'right',
                      fontSize: 9,
                      color: '#64748b'
                    }
                  ]
                };
              }
              return null;
            },
            
            content: [
              // Título principal con nombre de la capacitación
              {
                text: `REPORTE DE CAPACITACIÓN: ${capacitacion.tema.toUpperCase()}`,
                style: 'title',
                margin: [0, 0, 0, 10]
              },
              
              // Línea divisoria
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
                margin: [0, 0, 0, 20]
              },
              
              // Descripción de la capacitación
              {
                text: capacitacion.descripcion,
                style: 'subtitle',
                margin: [0, 0, 0, 20]
              },
              
              // Card con información resumida
              {
                columns: [
                  {
                    width: '*',
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: 240, h: 50,
                            r: 8,
                            color: '#eff6ff'
                          }
                        ]
                      },
                      {
                        text: [
                          { text: 'Total de Usuarios\n', fontSize: 10, color: '#64748b' },
                          { text: total_usuarios.toString(), fontSize: 24, bold: true, color: '#3b82f6' }
                        ],
                        alignment: 'center',
                        margin: [0, -40, 0, 0]
                      }
                    ]
                  },
                  {
                    width: '*',
                    stack: [
                      {
                        canvas: [
                          {
                            type: 'rect',
                            x: 0, y: 0,
                            w: 240, h: 50,
                            r: 8,
                            color: '#f0fdf4'
                          }
                        ]
                      },
                      {
                        text: [
                          { text: 'Usuarios Aprobados\n', fontSize: 10, color: '#64748b' },
                          { text: usuarios.filter(u => u.aprobado === 'Sí').length.toString(), fontSize: 24, bold: true, color: '#10b981' }
                        ],
                        alignment: 'center',
                        margin: [0, -40, 0, 0]
                      }
                    ]
                  }
                ],
                columnGap: 15,
                margin: [0, 0, 0, 25]
              },
              
              // Tabla de usuarios
              {
                text: 'DETALLE DE PARTICIPANTES',
                style: 'sectionTitle',
                margin: [0, 0, 0, 10]
              },
              {
                table: {
                  headerRows: 1,
                  widths: ['*', '*', 50, 50, 50],
                  body: [
                    // Encabezados
                    [
                      { text: 'Nombre Completo', style: 'tableHeader' },
                      { text: 'Departamento', style: 'tableHeader' },
                      { text: 'N° Intentos', style: 'tableHeader', alignment: 'center' },
                      { text: 'Puntaje', style: 'tableHeader', alignment: 'center' },
                      { text: 'Aprobado', style: 'tableHeader', alignment: 'center' }
                    ],
                    // Filas de datos
                    ...usuarios.map((usuario, index) => [
                      { text: usuario.nombre_completo, style: 'tableCell', fillColor: index % 2 === 0 ? '#f8fafc' : 'white' },
                      { text: usuario.departamento, style: 'tableCell', fillColor: index % 2 === 0 ? '#f8fafc' : 'white' },
                      { text: usuario.numero_intentos, style: 'tableCell', alignment: 'center', fillColor: index % 2 === 0 ? '#f8fafc' : 'white' },
                      { text: usuario.puntaje, style: 'tableCell', alignment: 'center', fillColor: index % 2 === 0 ? '#f8fafc' : 'white' },
                      { 
                        text: usuario.aprobado, 
                        style: 'tableCell', 
                        alignment: 'center',
                        color: usuario.aprobado === 'Sí' ? '#10b981' : '#ef4444',
                        bold: true,
                        fillColor: index % 2 === 0 ? '#f8fafc' : 'white'
                      }
                    ])
                  ]
                },
                layout: {
                  hLineWidth: function (i, node) {
                    return i === 0 || i === 1 || i === node.table.body.length ? 1 : 0.5;
                  },
                  vLineWidth: function () {
                    return 0.5;
                  },
                  hLineColor: function () {
                    return '#cbd5e1';
                  },
                  vLineColor: function () {
                    return '#cbd5e1';
                  }
                }
              }
            ],
            
            // Footer con paginación
            footer: function(currentPage, pageCount) {
              return {
                margin: [40, 20],
                columns: [
                  {
                    text: 'Generado automáticamente por Sistema de Capacitaciones PROLIPA',
                    alignment: 'left',
                    fontSize: 8,
                    color: '#94a3b8'
                  },
                  {
                    text: `Página ${currentPage} de ${pageCount}`,
                    alignment: 'right',
                    fontSize: 9,
                    color: '#64748b'
                  }
                ]
              };
            },
            
            styles: {
              title: {
                fontSize: 18,
                bold: true,
                color: '#1e293b',
                margin: [0, 0, 0, 5]
              },
              subtitle: {
                fontSize: 11,
                color: '#64748b',
                italics: true
              },
              sectionTitle: {
                fontSize: 13,
                bold: true,
                color: '#3b82f6',
                margin: [0, 10, 0, 5]
              },
              tableHeader: {
                bold: true,
                fontSize: 11,
                color: 'white',
                fillColor: '#3b82f6'
              },
              tableCell: {
                fontSize: 10,
                color: '#334155'
              }
            }
          };

          // Generar y descargar el PDF
          const timestamp = new Date().getTime();
          const filename = `Reporte_Capacitacion_${capacitacionId}_${timestamp}.pdf`;
          pdfMake.createPdf(docDefinition).download(filename);

          this.$emit('show-toast', { mensaje: 'Reporte generado exitosamente', tipo: 'success' });
        } else {
          this.$emit('show-toast', { mensaje: 'Error al obtener datos del reporte', tipo: 'error' });
        }
      } catch (error) {
        this.$emit('show-toast', { 
          mensaje: 'Error al generar el reporte', 
          tipo: 'error' 
        });
      } finally {
        // Desbloquear el botón
        this.generandoReporte = false;
      }
    }
  }
};
</script>

<style scoped>
.lista-capacitaciones {
  width: 100%;
  overflow: hidden;
}

/* Filter Tabs */
.filter-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filter-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-tab:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: #3b82f6;
}

.filter-tab.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.filter-tab .badge {
  background-color: #f1f5f9;
  color: #64748b;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
  min-width: 24px;
  text-align: center;
}

.filter-tab.active .badge {
  background-color: rgba(255, 255, 255, 0.25);
  color: white;
}

/* Barra de filtros */
.filtros-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.filtros-izq {
  display: flex;
  gap: 12px;
  align-items: center;
  flex: 1;
}

.filtros-der {
  display: flex;
  gap: 12px;
  align-items: center;
}

.input-busqueda {
  flex: 1;
  max-width: 400px;
  padding: 10px 14px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
  font-size: 0.9rem;
}

.input-busqueda:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.input-busqueda::placeholder {
  color: #64748b;
}

/* Toggle Switch */
.toggle-switch {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  user-select: none;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 48px;
  height: 24px;
  background-color: #e2e8f0;
  border-radius: 24px;
  transition: all 0.3s;
  border: 2px solid #cbd5e1;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background-color: #ffffff;
  top: 1px;
  left: 2px;
  transition: all 0.3s;
}

.toggle-switch input[type="checkbox"]:checked + .toggle-slider {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.toggle-switch input[type="checkbox"]:checked + .toggle-slider::before {
  transform: translateX(24px);
  background-color: #ffffff;
}

.toggle-label {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
}

.toggle-switch:hover .toggle-label {
  color: #3b82f6;
}

.btn-nuevo {
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.btn-nuevo:hover {
  background-color: #2563eb;
}

.btn-refrescar {
  padding: 10px 16px;
  background-color: #ffffff;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 8px;
  white-space: nowrap;
}

.btn-refrescar:hover:not(:disabled) {
  background-color: #f1f5f9;
  color: #3b82f6;
  border-color: #cbd5e1;
}

.btn-refrescar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Grid de capacitaciones */
.capacitaciones-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.capacitacion-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
}

.capacitacion-card:hover {
  border-color: #3b82f6;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.card-titulo {
  flex: 1;
}

.card-titulo h3 {
  margin: 0 0 6px 0;
  font-size: 1.1rem;
  color: #3b82f6;
}

.badge-estado {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-activa {
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
}

.badge-inactiva {
  background-color: rgba(251, 146, 60, 0.1);
  color: #ea580c;
}

.badge-borrador {
  background-color: rgba(100, 116, 139, 0.1);
  color: #475569;
}

.card-acciones {
  display: flex;
  gap: 6px;
}

.btn-icon {
  background: transparent;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s;
}

.btn-icon:hover {
  background-color: #f1f5f9;
  color: #3b82f6;
}

.btn-icon:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;
}

.btn-icon.btn-loading {
  opacity: 0.7;
}

.spinner-small {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.btn-eliminar:hover {
  background-color: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.btn-report:hover {
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.card-descripcion {
  color: #64748b;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Métricas */
.card-metricas {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 16px;
}

.metrica {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  min-width: 0; /* Permite que los hijos se compriman */
}

.metrica-icono {
  font-size: 1.5rem;
  flex-shrink: 0; /* El icono no se comprime */
}

.metrica > div {
  min-width: 0; /* Permite que el contenedor de texto se comprima */
  overflow: hidden; /* Oculta desbordamiento */
}

.metrica-valor {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #3b82f6;
  white-space: nowrap; /* El número no se rompe */
}

.metrica-label {
  display: block;
  font-size: 0.7rem;
  color: #64748b;
  white-space: nowrap; /* Evita salto de línea */
  overflow: hidden; /* Oculta desbordamiento */
  text-overflow: ellipsis; /* Añade ... si es muy largo */
}

/* Estadísticas */
.card-stats {
  padding: 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.stat-item:last-child {
  margin-bottom: 0;
}

.stat-label {
  font-size: 0.85rem;
  color: #64748b;
  min-width: 140px;
}

.stat-barra {
  flex: 1;
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.stat-progreso {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: width 0.3s;
}

.stat-valor {
  font-size: 0.85rem;
  font-weight: 600;
  color: #3b82f6;
  min-width: 40px;
  text-align: right;
}

.stat-valor-grande {
  font-size: 1.2rem;
  font-weight: 700;
  color: #059669;
}

/* Footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
}

.footer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item {
  font-size: 0.8rem;
  color: #64748b;
}

.footer-acciones {
  display: flex;
  gap: 8px;
}

.btn-activar,
.btn-desactivar {
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-activar {
  background-color: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.btn-activar:hover {
  background-color: rgba(16, 185, 129, 0.15);
}

.btn-desactivar {
  background-color: rgba(251, 146, 60, 0.1);
  color: #ea580c;
  border: 1px solid rgba(251, 146, 60, 0.2);
}

.btn-desactivar:hover {
  background-color: rgba(251, 146, 60, 0.15);
}

/* Empty state */
.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
  overflow: hidden;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 16px;
  color: #cbd5e1;
}

.empty-state h3 {
  color: #475569;
  margin-bottom: 8px;
}

.empty-state p {
  color: #64748b;
  margin-bottom: 24px;
}

.btn-crear-primera {
  padding: 12px 24px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-crear-primera:hover {
  background-color: #2563eb;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  overflow-y: auto;
}

.modal-content {
  background-color: #ffffff;
  padding: 24px;
  border-radius: 12px;
  max-width: 500px;
  width: 90%;
  border: 1px solid #e2e8f0;
  position: relative;
  margin: 20px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-content h3 {
  margin: 0 0 12px 0;
  color: #f59e0b;
}

.modal-content p {
  color: #64748b;
  margin-bottom: 8px;
}

.modal-advertencia {
  color: #ef4444;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.modal-acciones {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

.btn-cancelar,
.btn-confirmar-eliminar {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancelar {
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-cancelar:hover {
  background-color: #e2e8f0;
  color: #475569;
}

.btn-confirmar-eliminar {
  background-color: #ef4444;
  color: white;
}

.btn-confirmar-eliminar:hover {
  background-color: #dc2626;
}

/* Responsive */
@media (max-width: 1400px) {
  .capacitaciones-grid {
    grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  }
  
  .card-metricas {
    gap: 10px;
  }
  
  .metrica {
    padding: 8px 6px;
    gap: 6px;
  }
  
  .metrica-icono {
    font-size: 1.3rem;
  }
  
  .metrica-label {
    font-size: 0.65rem;
  }
}

@media (max-width: 1024px) {
  .capacitaciones-grid {
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .filtros-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .filtros-izq {
    flex-direction: column;
  }

  .filtros-der {
    width: 100%;
    justify-content: stretch;
  }

  .filtros-der button {
    flex: 1;
  }

  .input-busqueda {
    max-width: none;
  }

  .capacitaciones-grid {
    grid-template-columns: 1fr;
  }

  .card-metricas {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .metrica {
    padding: 8px;
  }

  .metrica-label {
    font-size: 0.65rem;
  }

  .card-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}
</style>
