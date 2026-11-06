<template>
  <div class="lista-encuestas">
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
          placeholder="Buscar encuestas..."
          class="input-busqueda"
        />

        <label class="toggle-switch">
          <input type="checkbox" v-model="filtros.soloMias" @change="cargarEncuestas" />
          <span class="toggle-slider"></span>
          <span class="toggle-label">Solo mis encuestas</span>
        </label>
      </div>

      <div class="filtros-der">
        <button @click="cargarEncuestas" class="btn-refrescar" :disabled="cargando" title="Refrescar lista">
          <Icon name="refresh" />
          <span v-if="!cargando">Refrescar</span>
          <span v-else>Cargando...</span>
        </button>

        <button @click="$emit('cambiar-vista', 'crear-encuesta')" class="btn-nuevo">
          <Icon name="plus" /> Nueva Encuesta
        </button>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando encuestas...</p>
    </div>

    <!-- Lista de encuestas -->
    <div v-else class="encuestas-grid">
      <div
        v-for="enc in encuestasFiltradas"
        :key="enc.id"
        class="encuesta-card"
        :class="`estado-${enc.estado}`"
      >
        <div class="card-header">
          <div class="card-titulo">
            <h3>{{ enc.tema }}</h3>
            <span class="badge-estado" :class="`badge-${enc.estado}`">
              {{ estadoLabel(enc.estado) }}
            </span>
          </div>

          <div class="card-acciones">
            <button
              @click="abrirModalReporte(enc.id)"
              class="btn-icon btn-report"
              title="Generar Reporte PDF"
              :disabled="generandoReporte"
              :class="{ 'btn-loading': generandoReporte }"
            >
              <Icon v-if="!generandoReporte" name="file" />
              <span v-else class="spinner-small"></span>
            </button>
            <button @click="gestionarEncuesta(enc.id)" class="btn-icon" title="Configurar">
              <Icon name="settings" />
            </button>
            <button @click="verAnalytics(enc.id)" class="btn-icon" title="Ver Estadísticas">
              <Icon name="chart" />
            </button>
            <button @click="duplicarEncuesta(enc.id)" class="btn-icon" title="Duplicar">
              <Icon name="copy" />
            </button>
            <button @click="confirmarEliminar(enc)" class="btn-icon btn-eliminar" title="Eliminar">
              <Icon name="trash" />
            </button>
          </div>
        </div>

        <p class="card-descripcion">{{ enc.descripcion }}</p>

        <div class="card-metricas">
          <div class="metrica">
            <span class="metrica-icono"><Icon name="folder" size="1.5em" /></span>
            <div>
              <span class="metrica-valor">{{ (enc.secciones && enc.secciones.length) || 0 }}</span>
              <span class="metrica-label">Secciones</span>
            </div>
          </div>

          <div class="metrica">
            <span class="metrica-icono"><Icon name="question" size="1.5em" /></span>
            <div>
              <span class="metrica-valor">{{ totalPreguntas(enc) }}</span>
              <span class="metrica-label">Preguntas</span>
            </div>
          </div>

          <div class="metrica">
            <span class="metrica-icono"><Icon name="users" size="1.5em" /></span>
            <div>
              <span class="metrica-valor">{{ enc.respuestas_count || 0 }}</span>
              <span class="metrica-label">Respuestas</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <div class="footer-info">
            <span class="info-item">
              <strong>Creado por:</strong>
              {{ enc.creador ? `${enc.creador.nombres} ${enc.creador.apellidos}` : 'Desconocido' }}
            </span>
            <span class="info-item">
              <strong>Fecha:</strong>
              {{ formatearFecha(enc.created_at) }}
            </span>
            <span class="info-item">
              <strong>Alcance:</strong>
              <template v-if="enc.es_para_todos">
                <Icon name="globe" /> Toda la empresa
              </template>
              <template v-else>
                <Icon name="building" /> {{ ((enc.departamentos && enc.departamentos.length) || 0) }} departamentos
              </template>
            </span>
            <span class="info-item" v-if="enc.fecha_inicio && enc.fecha_fin">
              <strong>Vigencia:</strong>
              {{ formatearFechaConHora(enc.fecha_inicio) }} - {{ formatearFechaConHora(enc.fecha_fin) }}
            </span>
          </div>

          <div class="footer-acciones">
            <button
              v-if="enc.estado === 'borrador'"
              @click="cambiarEstado(enc.id, 'activa')"
              class="btn-activar"
            >
              <Icon name="check-circle" /> Activar
            </button>
            <button
              v-else-if="enc.estado === 'activa'"
              @click="cambiarEstado(enc.id, 'inactiva')"
              class="btn-desactivar"
            >
              <Icon name="pause" /> Desactivar
            </button>
            <button
              v-else
              @click="cambiarEstado(enc.id, 'activa')"
              class="btn-activar"
            >
              <Icon name="play" /> Reactivar
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="encuestasFiltradas.length === 0" class="empty-state">
        <div class="empty-icon"><Icon name="clipboard" size="5rem" /></div>
        <h3>{{ tituloVacio }}</h3>
        <p>{{ mensajeVacio }}</p>
        <button @click="$emit('cambiar-vista', 'crear-encuesta')" class="btn-crear-primera">
          <Icon name="plus" /> Crear Primera Encuesta
        </button>
      </div>
    </div>

    <!-- Modal de confirmación eliminar -->
    <div v-if="modalEliminar.visible" class="modal-overlay" @click="modalEliminar.visible = false">
      <div class="modal-content" @click.stop>
        <h3><Icon name="warning" color="#f59e0b" /> Confirmar Eliminación</h3>
        <p>¿Estás seguro de eliminar la encuesta <strong>"{{ modalEliminar.encuesta && modalEliminar.encuesta.tema }}"</strong>?</p>
        <p class="modal-advertencia" style="color: #ef4444; font-weight: 600; margin-top: 12px;">
          ⚠️ Esta acción eliminará la encuesta y TODAS las respuestas asociadas de forma permanente.
        </p>
        <p class="modal-advertencia">Esta acción no se puede deshacer.</p>

        <div class="modal-acciones">
          <button @click="modalEliminar.visible = false" class="btn-cancelar">
            Cancelar
          </button>
          <button @click="eliminarEncuesta" class="btn-confirmar-eliminar">
            <Icon name="trash" /> Eliminar
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de selección de tipo de reporte -->
    <div v-if="modalReporte.visible" class="modal-overlay" @click="cerrarModalReporte">
      <div class="modal-content modal-reporte" @click.stop>
        <h3><Icon name="file" color="#3b82f6" /> Generar Reporte</h3>
        <p>Elige cómo quieres segmentar el reporte de participación. La estadística por pregunta se incluye siempre.</p>

        <div class="opciones-reporte">
          <label class="opcion-reporte" :class="{ selected: modalReporte.tipo === 'departamento' }">
            <input type="radio" v-model="modalReporte.tipo" value="departamento" />
            <Icon name="building" />
            <span>Por Departamento</span>
          </label>
          <label class="opcion-reporte" :class="{ selected: modalReporte.tipo === 'contrato' }">
            <input type="radio" v-model="modalReporte.tipo" value="contrato" />
            <Icon name="clipboard" />
            <span>Por Tipo de Contrato</span>
          </label>
        </div>

        <div class="modal-acciones">
          <button @click="cerrarModalReporte" class="btn-cancelar">
            Cancelar
          </button>
          <button @click="generarReporte" class="btn-generar-reporte" :disabled="generandoReporte">
            <Icon name="file" /> {{ generandoReporte ? 'Generando...' : 'Generar PDF' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Canvas ocultos para generación de gráficos en PDF -->
    <div style="position: absolute; left: -9999px; top: -9999px;">
      <canvas ref="tempChartCanvas" width="600" height="300"></canvas>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';
import pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import Chart from 'chart.js';

if (pdfFonts && pdfFonts.pdfMake && pdfFonts.pdfMake.vfs) {
  pdfMake.vfs = pdfFonts.pdfMake.vfs;
}

export default {
  name: 'AdminListaEncuestas',
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
      encuestas: [],
      encuestasFiltradas: [],
      cargando: false,
      generandoReporte: false,
      filtroActivo: 'activas',
      filtros: {
        busqueda: '',
        soloMias: false
      },
      modalEliminar: {
        visible: false,
        encuesta: null
      },
      modalReporte: {
        visible: false,
        encuestaId: null,
        tipo: 'departamento'
      },
      busquedaTimeout: null
    };
  },
  computed: {
    encuestasPorEstado() {
      if (this.filtroActivo === 'todas') {
        return this.encuestas;
      }

      return this.encuestas.filter(enc => {
        switch (this.filtroActivo) {
          case 'activas':
            return enc.estado === 'activa';
          case 'inactivas':
            return enc.estado === 'inactiva';
          case 'borradores':
            return enc.estado === 'borrador';
          default:
            return true;
        }
      });
    },

    contadores() {
      const activas = this.encuestas.filter(e => e.estado === 'activa').length;
      const inactivas = this.encuestas.filter(e => e.estado === 'inactiva').length;
      const borradores = this.encuestas.filter(e => e.estado === 'borrador').length;

      return {
        activas,
        inactivas,
        borradores,
        todas: this.encuestas.length
      };
    },

    tituloVacio() {
      switch (this.filtroActivo) {
        case 'activas': return 'No hay encuestas activas';
        case 'inactivas': return 'No hay encuestas inactivas';
        case 'borradores': return 'No hay borradores';
        default: return 'No hay encuestas';
      }
    },

    mensajeVacio() {
      switch (this.filtroActivo) {
        case 'activas': return 'No hay encuestas activas en este momento';
        case 'inactivas': return 'No hay encuestas desactivadas o expiradas';
        case 'borradores': return 'No hay encuestas en estado borrador';
        default: return this.filtros.soloMias ? 'Aún no has creado ninguna encuesta' : 'No se encontraron encuestas';
      }
    }
  },
  watch: {
    filtroActivo() {
      this.aplicarFiltros();
    }
  },
  mounted() {
    this.cargarEncuestas();
  },
  methods: {
    formatearTipoContrato(tipoContrato) {
      if (!tipoContrato) return 'N/A';
      
      const tipoLower = String(tipoContrato).trim().toLowerCase();
      const tipos = {
        'nomina': 'Contrato de Trabajo',
        'civil': 'Contrato Civil'
      };
      
      return tipos[tipoLower] || tipoContrato || 'N/A';
    },

    async cargarEncuestas() {
      this.cargando = true;
      try {
        const params = {
          idusuario: this.idusuario,
          solo_mias: this.filtros.soloMias
        };

        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/encuestas`,
          { params }
        );

        if (response.data.success) {
          this.encuestas = response.data.data;
          this.aplicarFiltros();
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar encuestas', tipo: 'error' });
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
      let resultado = [...this.encuestasPorEstado];

      if (this.filtros.busqueda) {
        const busqueda = this.filtros.busqueda.toLowerCase();
        resultado = resultado.filter(enc =>
          enc.tema.toLowerCase().includes(busqueda) ||
          (enc.descripcion && enc.descripcion.toLowerCase().includes(busqueda))
        );
      }

      this.encuestasFiltradas = resultado;
    },

    totalPreguntas(encuesta) {
      if (!encuesta.secciones) return 0;
      return encuesta.secciones.reduce((total, seccion) => total + ((seccion.preguntas && seccion.preguntas.length) || 0), 0);
    },

    async cambiarEstado(id, nuevoEstado) {
      try {
        const response = await this.$http.post(
          `${this.$server_url}capacitaciones_prolipa/admin/encuestas/${id}/estado`,
          { estado: nuevoEstado, idusuario: this.idusuario }
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Estado actualizado exitosamente', tipo: 'success' });
          this.cargarEncuestas();
        } else {
          this.$emit('show-toast', { mensaje: response.data.message || 'Error al cambiar estado', tipo: 'error' });
        }
      } catch (error) {
        const mensaje = (error.response && error.response.data && error.response.data.message) || 'Error al cambiar estado';
        this.$emit('show-toast', { mensaje, tipo: 'error' });
      }
    },

    async duplicarEncuesta(id) {
      try {
        const response = await this.$http.post(
          `${this.$server_url}capacitaciones_prolipa/admin/encuestas/${id}/duplicar`,
          { idusuario: this.idusuario }
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Encuesta duplicada exitosamente', tipo: 'success' });
          this.cargarEncuestas();
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al duplicar encuesta', tipo: 'error' });
      }
    },

    confirmarEliminar(encuesta) {
      this.modalEliminar.visible = true;
      this.modalEliminar.encuesta = encuesta;
    },

    async eliminarEncuesta() {
      try {
        const response = await this.$http.delete(
          `${this.$server_url}capacitaciones_prolipa/admin/encuestas/${this.modalEliminar.encuesta.id}`
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Encuesta eliminada', tipo: 'success' });
          this.modalEliminar.visible = false;
          this.cargarEncuestas();
        }
      } catch (error) {
        const mensaje = (error.response && error.response.data && error.response.data.message) || 'Error al eliminar encuesta';
        this.$emit('show-toast', { mensaje, tipo: 'error' });
      }
    },

    verAnalytics(id) {
      this.$emit('ver-analytics-encuesta', id);
    },

    gestionarEncuesta(id) {
      this.$emit('gestionar-encuesta', id);
    },

    estadoLabel(estado) {
      const labels = { activa: 'Activa', inactiva: 'Inactiva', borrador: 'Borrador' };
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
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    },

    abrirModalReporte(encuestaId) {
      this.modalReporte.visible = true;
      this.modalReporte.encuestaId = encuestaId;
      this.modalReporte.tipo = 'departamento';
    },

    cerrarModalReporte() {
      this.modalReporte.visible = false;
      this.modalReporte.encuestaId = null;
    },

    formatearTipoPregunta(tipo) {
      const labels = {
        simple: 'Opción Única',
        multiple: 'Opción Múltiple',
        texto_corto: 'Respuesta Corta',
        texto_largo: 'Respuesta Larga',
        escala: 'Escala'
      };
      return labels[tipo] || tipo;
    },

    // Métodos auxiliares para generar gráficos en canvas
    async generarGraficoDonaBase64(labels, data, colores) {
      const canvas = this.$refs.tempChartCanvas;
      if (!canvas) return null;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: colores,
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          legend: {
            display: true,
            position: 'right',
            labels: { fontSize: 10, boxWidth: 12, padding: 8 }
          },
          tooltips: { enabled: false },
          animation: { duration: 0 }
        }
      });

      // Esperar un tick para que el chart se renderice
      await new Promise(resolve => setTimeout(resolve, 50));

      // Dibujar porcentajes
      try {
        const meta = chart.getDatasetMeta(0);
        const total = data.reduce((acc, val) => acc + val, 0);
        
        ctx.save();
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 3;
        
        meta.data.forEach((arc, index) => {
          if (arc._model && arc._model.circumference > 0.1) {
            const percentage = Math.round((data[index] / total) * 100);
            const angle = (arc._model.startAngle + arc._model.endAngle) / 2;
            const radius = (arc._model.innerRadius + arc._model.outerRadius) / 2;
            const x = arc._model.x + Math.cos(angle) * radius;
            const y = arc._model.y + Math.sin(angle) * radius;
            
            ctx.fillText(percentage + '%', x, y);
          }
        });
        
        ctx.restore();
      } catch (e) {
        console.warn('No se pudieron dibujar porcentajes:', e);
      }

      const imageData = canvas.toDataURL('image/png');
      chart.destroy();
      return imageData;
    },

    generarGraficoBarrasBase64(labels, datasets, colores, segmentos) {
      const canvas = this.$refs.tempChartCanvas;
      if (!canvas) return null;

      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const datasetsFormatted = segmentos.map((seg, segIndex) => ({
        label: seg,
        data: datasets[segIndex],
        backgroundColor: colores[segIndex] || '#64748b',
        borderWidth: 0
      }));

      const chart = new Chart(ctx, {
        type: 'bar',
        data: { labels: labels, datasets: datasetsFormatted },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          scales: {
            xAxes: [{ stacked: true, ticks: { fontSize: 9 } }],
            yAxes: [{
              stacked: true,
              ticks: { beginAtZero: true, stepSize: 1, fontSize: 9 },
              scaleLabel: { display: true, labelString: 'Respuestas', fontSize: 10 }
            }]
          },
          legend: {
            display: true,
            position: 'top',
            labels: { fontSize: 10, boxWidth: 12, padding: 8 }
          },
          tooltips: { enabled: false },
          animation: { duration: 0 }
        }
      });

      const imageData = canvas.toDataURL('image/png');
      chart.destroy();
      return imageData;
    },

    async generarReporte() {
      const encuestaId = this.modalReporte.encuestaId;
      const tipoSegmento = this.modalReporte.tipo;

      try {
        this.generandoReporte = true;
        this.cerrarModalReporte();
        this.$emit('show-toast', { mensaje: 'Generando reporte PDF...', tipo: 'warning' });

        const imagenesResponse = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/imagenes-corporativas`
        );

        let imagenesCorporativas = null;
        if (imagenesResponse.data.success) {
          imagenesCorporativas = imagenesResponse.data.data;
        }

        const segmentoParam = tipoSegmento === 'departamento' ? 'departamento' : 'contrato';

        const [reporteResp, segmentadoResp] = await Promise.all([
          this.$http.get(`${this.$server_url}capacitaciones_prolipa/admin/encuestas/${encuestaId}/reporte`),
          this.$http.get(`${this.$server_url}capacitaciones_prolipa/admin/encuestas/${encuestaId}/analytics-segmentado`, {
            params: { segmento: segmentoParam }
          })
        ]);

        if (!reporteResp.data.success || !segmentadoResp.data.success) {
          this.$emit('show-toast', { mensaje: 'Error al obtener datos del reporte', tipo: 'error' });
          return;
        }

        const { encuesta, usuarios, total_usuarios } = reporteResp.data.data;
        const { segmentos, resumen_segmentos, preguntas } = segmentadoResp.data.data;

        const tituloSegmento = tipoSegmento === 'departamento' ? 'Departamento' : 'Tipo de Contrato';

        // Esperar a que el canvas esté disponible en el DOM
        await this.$nextTick();

        // Colores para los gráficos
        const colores = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#a855f7'];
        const coloresSegmento = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

        // Construir bloques de contenido para la sección de estadísticas por
        // pregunta, estilo Google Forms pero cruzado: cada opción con su
        // barra de % general, y debajo la composición por segmento (ej. de
        // ese 60% que votó "Sí", cuántos son civil y cuántos nómina).
        const bloquesPreguntas = [];
        
        for (let index = 0; index < preguntas.length; index++) {
          const pregunta = preguntas[index];
          
          bloquesPreguntas.push({
            text: `${index + 1}. ${pregunta.enunciado}`,
            style: 'preguntaTitulo',
            margin: [0, index === 0 ? 0 : 18, 0, 4]
          });
          bloquesPreguntas.push({
            text: `${this.formatearTipoPregunta(pregunta.tipo)} · ${pregunta.total_respuestas} respuesta(s)`,
            style: 'preguntaMeta',
            margin: [0, 0, 0, 8]
          });

          // Generar gráficos para preguntas de opción simple o múltiple
          if (['simple', 'multiple'].includes(pregunta.tipo) && pregunta.opciones && pregunta.opciones.length > 0) {
            const labels = pregunta.opciones.map(op => op.texto_opcion);
            const data = pregunta.opciones.map(op => op.total);
            
            // Gráfico de dona (distribución general)
            const imagenDona = await this.generarGraficoDonaBase64(labels, data, colores);

            // Insertar gráfico de dona en el PDF
            if (imagenDona) {
              bloquesPreguntas.push({
                text: 'Distribución General',
                style: 'graficoTitulo',
                margin: [0, 0, 0, 5]
              });
              bloquesPreguntas.push({
                image: imagenDona,
                width: 400,
                alignment: 'center',
                margin: [0, 0, 0, 15]
              });
            }

            // Tabla de estadísticas detallada
            const tablaDatos = {
              headerRows: 1,
              widths: ['30%', '30%', '20%', '20%'],
              body: [
                [
                  { text: 'Opción', style: 'tableHeader', fillColor: '#3b82f6', color: '#ffffff' },
                  { text: tituloSegmento, style: 'tableHeader', fillColor: '#3b82f6', color: '#ffffff' },
                  { text: 'Porcentaje', style: 'tableHeader', fillColor: '#3b82f6', color: '#ffffff', alignment: 'center' },
                  { text: 'Cantidad', style: 'tableHeader', fillColor: '#3b82f6', color: '#ffffff', alignment: 'center' }
                ]
              ]
            };

            // Agregar filas de datos
            pregunta.opciones.forEach(opcion => {
              const segmentosConDatos = segmentos.filter(seg => opcion.composicion_por_segmento[seg] > 0);
              
              segmentosConDatos.forEach((seg, segIndex) => {
                const cantidad = opcion.composicion_por_segmento[seg];
                const porcentaje = Math.round((cantidad / opcion.total) * 100);
                
                const fila = [
                  // Columna Opción (solo en la primera fila de este grupo)
                  segIndex === 0 
                    ? { 
                        stack: [
                          {
                            text: opcion.texto_opcion,
                            style: 'tableCell',
                            alignment: 'center',
                            margin: [0, (segmentosConDatos.length - 1) * 11, 0, 0]
                          }
                        ],
                        rowSpan: segmentosConDatos.length,
                        fillColor: '#ffffff'
                      }
                    : '',
                  // Columna Departamento
                  { text: tipoSegmento === 'contrato' ? this.formatearTipoContrato(seg) : seg, style: 'tableCell' },
                  // Columna Porcentaje con barra visual
                  {
                    stack: [
                      {
                        canvas: [
                          { type: 'rect', x: 0, y: 0, w: 80, h: 10, r: 5, color: '#e2e8f0' },
                          { type: 'rect', x: 0, y: 0, w: Math.max(2, (porcentaje / 100) * 80), h: 10, r: 5, color: '#3b82f6' }
                        ]
                      },
                      { text: `${porcentaje}%`, style: 'tableCellBold', alignment: 'center', margin: [0, 2, 0, 0] }
                    ],
                    alignment: 'center'
                  },
                  // Columna Cantidad
                  { text: cantidad.toString(), style: 'tableCellBold', alignment: 'center' }
                ];
                
                tablaDatos.body.push(fila);
              });
            });

            bloquesPreguntas.push({
              table: tablaDatos,
              layout: {
                hLineWidth: () => 0.5,
                vLineWidth: (i, node) => (i === 1 ? 2 : 0.5),
                hLineColor: () => '#e2e8f0',
                vLineColor: () => '#e2e8f0',
                paddingLeft: () => 8,
                paddingRight: () => 8,
                paddingTop: () => 6,
                paddingBottom: () => 6,
                fillColor: (rowIndex) => {
                  if (rowIndex === 0) return null;
                  return rowIndex % 2 === 0 ? '#f8fafc' : null;
                }
              },
              unbreakable: true,
              margin: [0, 0, 0, 15]
            });

            bloquesPreguntas.push({
              text: `${pregunta.total_respuestas} respuestas en total`,
              style: 'preguntaMeta',
              margin: [0, 0, 0, 0]
            });
          } 
          // Generar gráficos para preguntas de escala
          else if (pregunta.tipo === 'escala' && pregunta.distribucion && pregunta.distribucion.length > 0) {
            const labels = pregunta.distribucion.map(item => `Valor ${item.etiqueta}`);
            const data = pregunta.distribucion.map(item => item.total);
            
            // Gráfico de dona (distribución de respuestas)
            const imagenDona = await this.generarGraficoDonaBase64(labels, data, colores);

            // Insertar gráfico de dona en el PDF
            if (imagenDona) {
              bloquesPreguntas.push({
                text: 'Distribución de Respuestas',
                style: 'graficoTitulo',
                margin: [0, 0, 0, 5]
              });
              bloquesPreguntas.push({
                image: imagenDona,
                width: 400,
                alignment: 'center',
                margin: [0, 0, 0, 15]
              });
            }

            // Tabla de promedio por departamento
            const tablaPromedios = {
              headerRows: 1,
              widths: ['50%', '50%'],
              body: [
                [
                  { text: tituloSegmento, style: 'tableHeader', fillColor: '#3b82f6', color: '#ffffff' },
                  { text: 'Promedio', style: 'tableHeader', fillColor: '#3b82f6', color: '#ffffff', alignment: 'center' }
                ]
              ]
            };

            segmentos.forEach(seg => {
              const promedio = pregunta.promedio_por_segmento[seg] !== null ? pregunta.promedio_por_segmento[seg] : '—';
              tablaPromedios.body.push([
                { text: tipoSegmento === 'contrato' ? this.formatearTipoContrato(seg) : seg, style: 'tableCell' },
                { text: promedio, style: 'tableCellBold', alignment: 'center' }
              ]);
            });

            bloquesPreguntas.push({
              table: tablaPromedios,
              layout: {
                hLineWidth: () => 0.5,
                vLineWidth: (i, node) => (i === 1 ? 2 : 0.5),
                hLineColor: () => '#e2e8f0',
                vLineColor: () => '#e2e8f0',
                paddingLeft: () => 8,
                paddingRight: () => 8,
                paddingTop: () => 6,
                paddingBottom: () => 6,
                fillColor: (rowIndex) => {
                  if (rowIndex === 0) return null;
                  return rowIndex % 2 === 0 ? '#f8fafc' : null;
                }
              },
              unbreakable: true,
              margin: [0, 0, 0, 10]
            });

            bloquesPreguntas.push({
              text: `Promedio general: ${pregunta.promedio !== null ? pregunta.promedio : '—'}`,
              style: 'preguntaMeta',
              bold: true,
              margin: [0, 0, 0, 15]
            });

            // Tabla de estadísticas detallada
            const tablaDatos = {
              headerRows: 1,
              widths: ['30%', '30%', '20%', '20%'],
              body: [
                [
                  { text: 'Valor', style: 'tableHeader', fillColor: '#3b82f6', color: '#ffffff' },
                  { text: tituloSegmento, style: 'tableHeader', fillColor: '#3b82f6', color: '#ffffff' },
                  { text: 'Porcentaje', style: 'tableHeader', fillColor: '#3b82f6', color: '#ffffff', alignment: 'center' },
                  { text: 'Cantidad', style: 'tableHeader', fillColor: '#3b82f6', color: '#ffffff', alignment: 'center' }
                ]
              ]
            };

            // Agregar filas de datos
            pregunta.distribucion.forEach(valorItem => {
              const segmentosConDatos = segmentos.filter(seg => valorItem.composicion_por_segmento[seg] > 0);
              
              segmentosConDatos.forEach((seg, segIndex) => {
                const cantidad = valorItem.composicion_por_segmento[seg];
                const porcentaje = Math.round((cantidad / valorItem.total) * 100);
                
                const fila = [
                  // Columna Valor (solo en la primera fila de este grupo)
                  segIndex === 0 
                    ? { 
                        stack: [
                          {
                            text: `Valor ${valorItem.etiqueta}`,
                            style: 'tableCell',
                            alignment: 'center',
                            margin: [0, (segmentosConDatos.length - 1) * 11, 0, 0]
                          }
                        ],
                        rowSpan: segmentosConDatos.length,
                        fillColor: '#ffffff'
                      }
                    : '',
                  // Columna Departamento
                  { text: tipoSegmento === 'contrato' ? this.formatearTipoContrato(seg) : seg, style: 'tableCell' },
                  // Columna Porcentaje con barra visual
                  {
                    stack: [
                      {
                        canvas: [
                          { type: 'rect', x: 0, y: 0, w: 80, h: 10, r: 5, color: '#e2e8f0' },
                          { type: 'rect', x: 0, y: 0, w: Math.max(2, (porcentaje / 100) * 80), h: 10, r: 5, color: '#3b82f6' }
                        ]
                      },
                      { text: `${porcentaje}%`, style: 'tableCellBold', alignment: 'center', margin: [0, 2, 0, 0] }
                    ],
                    alignment: 'center'
                  },
                  // Columna Cantidad
                  { text: cantidad.toString(), style: 'tableCellBold', alignment: 'center' }
                ];
                
                tablaDatos.body.push(fila);
              });
            });

            bloquesPreguntas.push({
              table: tablaDatos,
              layout: {
                hLineWidth: () => 0.5,
                vLineWidth: (i, node) => (i === 1 ? 2 : 0.5),
                hLineColor: () => '#e2e8f0',
                vLineColor: () => '#e2e8f0',
                paddingLeft: () => 8,
                paddingRight: () => 8,
                paddingTop: () => 6,
                paddingBottom: () => 6,
                fillColor: (rowIndex) => {
                  if (rowIndex === 0) return null;
                  return rowIndex % 2 === 0 ? '#f8fafc' : null;
                }
              },
              unbreakable: true,
              margin: [0, 0, 0, 15]
            });

            bloquesPreguntas.push({
              text: `${pregunta.total_respuestas} respuestas en total`,
              style: 'preguntaMeta',
              margin: [0, 0, 0, 0]
            });
          } 
          // Preguntas de texto
          else {
            const totalComposicion = segmentos
              .map(seg => `${seg}: ${pregunta.total_por_segmento[seg]}`)
              .join('  ·  ');

            bloquesPreguntas.push({ text: 'Respuestas de texto libre (contenido no incluido en este resumen)', style: 'preguntaMeta', italics: true });
            bloquesPreguntas.push({ text: totalComposicion, style: 'preguntaMeta', margin: [0, 2, 0, 0] });
          }
        }

        const docDefinition = {
          pageSize: 'A4',
          pageOrientation: 'portrait',
          pageMargins: [40, 130, 40, 110],

          background: function (currentPage, pageSize) {
            if (currentPage === 1 && imagenesCorporativas) {
              const backgrounds = [];
              if (imagenesCorporativas.cabecera) {
                backgrounds.push({
                  image: imagenesCorporativas.cabecera,
                  width: pageSize.width,
                  absolutePosition: { x: 0, y: 0 }
                });
              }
              if (imagenesCorporativas.marca_agua) {
                backgrounds.push({
                  image: imagenesCorporativas.marca_agua,
                  width: 400,
                  opacity: 0.1,
                  absolutePosition: { x: (pageSize.width - 400) / 2, y: 300 }
                });
              }
              if (imagenesCorporativas.pie_pagina) {
                backgrounds.push({
                  image: imagenesCorporativas.pie_pagina,
                  width: pageSize.width,
                  absolutePosition: { x: 0, y: pageSize.height - 80 }
                });
              }
              return backgrounds;
            }
            return null;
          },

          header: null,

          content: [
            { text: `REPORTE DE ENCUESTA: ${encuesta.tema.toUpperCase()}`, style: 'title', margin: [0, 0, 0, 10] },
            {
              canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: '#3b82f6' }],
              margin: [0, 0, 0, 20]
            },
            { text: encuesta.descripcion || '', style: 'subtitle', margin: [0, 0, 0, 20] },

            {
              columns: [
                {
                  width: '*',
                  stack: [
                    { canvas: [{ type: 'rect', x: 0, y: 0, w: 515, h: 50, r: 8, color: '#eff6ff' }] },
                    {
                      text: [
                        { text: 'Total de Respuestas\n', fontSize: 10, color: '#64748b' },
                        { text: total_usuarios.toString(), fontSize: 24, bold: true, color: '#3b82f6' }
                      ],
                      alignment: 'center',
                      margin: [0, -40, 0, 0]
                    }
                  ]
                }
              ],
              margin: [0, 0, 0, 25]
            },

            { text: `PARTICIPACIÓN POR ${tituloSegmento.toUpperCase()}`, style: 'sectionTitle', margin: [0, 0, 0, 10] },
            {
              table: {
                headerRows: 1,
                widths: ['*', 100],
                body: [
                  [{ text: tituloSegmento, style: 'tableHeader' }, { text: 'Personas', style: 'tableHeader', alignment: 'center' }],
                  ...segmentos.map((seg, index) => [
                    { text: tipoSegmento === 'contrato' ? this.formatearTipoContrato(seg) : seg, style: 'tableCell', fillColor: index % 2 === 0 ? '#f8fafc' : 'white' },
                    { text: String(resumen_segmentos[seg]), style: 'tableCell', alignment: 'center', fillColor: index % 2 === 0 ? '#f8fafc' : 'white' }
                  ])
                ]
              },
              layout: 'lightHorizontalLines',
              margin: [0, 0, 0, 20]
            },

            { text: 'ESTADÍSTICA POR PREGUNTA', style: 'sectionTitle', margin: [0, 0, 0, 10] },
            ...bloquesPreguntas,

            { text: 'DETALLE DE PARTICIPANTES', style: 'sectionTitle', margin: [0, 20, 0, 10] },
            {
              table: {
                headerRows: 1,
                widths: ['*', '*', 90, 90],
                body: [
                  [
                    { text: 'Nombre Completo', style: 'tableHeader' },
                    { text: 'Departamento', style: 'tableHeader' },
                    { text: 'Tipo Contrato', style: 'tableHeader', alignment: 'center' },
                    { text: 'Completada', style: 'tableHeader', alignment: 'center' }
                  ],
                  ...usuarios.map((usuario, index) => [
                    { text: usuario.nombre_completo, style: 'tableCell', fillColor: index % 2 === 0 ? '#f8fafc' : 'white' },
                    { text: usuario.departamento, style: 'tableCell', fillColor: index % 2 === 0 ? '#f8fafc' : 'white' },
                    { text: this.formatearTipoContrato(usuario.tipo_contrato), style: 'tableCell', alignment: 'center', fillColor: index % 2 === 0 ? '#f8fafc' : 'white' },
                    { text: usuario.completada_en ? usuario.completada_en.substring(0, 10) : '-', style: 'tableCell', alignment: 'center', fillColor: index % 2 === 0 ? '#f8fafc' : 'white' }
                  ])
                ]
              },
              layout: 'lightHorizontalLines'
            }
          ],

          footer: function (currentPage, pageCount) {
            return {
              margin: [40, 20],
              columns: [
                { text: 'Generado automáticamente por Sistema de Encuestas PROLIPA', alignment: 'left', fontSize: 8, color: '#94a3b8' },
                { text: `Página ${currentPage} de ${pageCount}`, alignment: 'right', fontSize: 9, color: '#64748b' }
              ]
            };
          },

          styles: {
            title: { fontSize: 18, bold: true, color: '#1e293b', margin: [0, 0, 0, 5] },
            subtitle: { fontSize: 11, color: '#64748b', italics: true },
            sectionTitle: { fontSize: 13, bold: true, color: '#3b82f6', margin: [0, 10, 0, 5] },
            tableHeader: { bold: true, fontSize: 11, color: 'white', fillColor: '#3b82f6' },
            tableCell: { fontSize: 10, color: '#334155' },
            tableCellBold: { fontSize: 10, color: '#334155', bold: true },
            preguntaTitulo: { fontSize: 11, bold: true, color: '#1e293b' },
            preguntaMeta: { fontSize: 9, color: '#64748b' },
            graficoTitulo: { fontSize: 10, bold: true, color: '#475569' }
          }
        };

        const timestamp = new Date().getTime();
        const segmentoTexto = tipoSegmento === 'departamento' ? 'Departamento' : 'TipoContrato';
        const temaLimpio = encuesta.tema.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
        const filename = `Reporte_${temaLimpio}_${segmentoTexto}_${timestamp}.pdf`;
        pdfMake.createPdf(docDefinition).download(filename);

        this.$emit('show-toast', { mensaje: 'Reporte generado exitosamente', tipo: 'success' });
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al generar el reporte', tipo: 'error' });
      } finally {
        this.generandoReporte = false;
      }
    }
  }
};
</script>

<style scoped>
.lista-encuestas {
  width: 100%;
  overflow: hidden;
}

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
}

.toggle-label {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
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

.encuestas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 20px;
}

.encuesta-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.3s;
}

.encuesta-card:hover {
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

.card-metricas {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
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
  min-width: 0;
}

.metrica > div {
  min-width: 0;
  overflow: hidden;
}

.metrica-valor {
  display: block;
  font-size: 1.2rem;
  font-weight: 700;
  color: #3b82f6;
  white-space: nowrap;
}

.metrica-label {
  display: block;
  font-size: 0.7rem;
  color: #64748b;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

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

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
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
  margin: 20px;
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
}

.btn-confirmar-eliminar {
  background-color: #ef4444;
  color: white;
}

.btn-confirmar-eliminar:hover {
  background-color: #dc2626;
}

.modal-reporte h3 {
  color: #3b82f6;
  display: flex;
  align-items: center;
  gap: 8px;
}

.opciones-reporte {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 16px 0 20px;
}

.opcion-reporte {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px;
  background-color: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  color: #1e293b;
}

.opcion-reporte:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.opcion-reporte.selected {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.opcion-reporte input[type="radio"] {
  cursor: pointer;
  transform: scale(1.15);
}

.btn-generar-reporte {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #3b82f6;
  color: white;
}

.btn-generar-reporte:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-generar-reporte:disabled {
  opacity: 0.5;
  cursor: not-allowed;
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

  .encuestas-grid {
    grid-template-columns: 1fr;
  }

  .card-metricas {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-footer {
    flex-direction: column;
    gap: 12px;
    align-items: stretch;
  }
}
</style>
