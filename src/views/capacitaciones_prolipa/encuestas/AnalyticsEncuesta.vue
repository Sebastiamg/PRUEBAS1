<template>
  <div class="analytics-container">
    <!-- Header -->
    <div class="analytics-header">
      <button @click="$emit('volver')" class="btn-volver">
        <Icon name="arrow-left" /> Volver
      </button>
      <h2 v-if="encuesta">Estadísticas: {{ encuesta.tema }}</h2>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando estadísticas...</p>
    </div>

    <!-- Contenido -->
    <div v-else-if="estadisticas" class="analytics-content">
      <!-- Métricas Generales -->
      <div class="metricas-grid">
        <div class="metrica-card">
          <div class="metrica-icono" style="background: rgba(59, 130, 246, 0.1)">
            <Icon name="users" size="2em" style="color: #3b82f6" />
          </div>
          <div class="metrica-info">
            <span class="metrica-valor">{{ estadisticas.estadisticas_generales.total_respuestas }}</span>
            <span class="metrica-label">Total Respuestas</span>
          </div>
        </div>

        <div class="metrica-card" v-for="(item, index) in estadisticas.estadisticas_generales.por_departamento" :key="'dep-' + index">
          <div class="metrica-icono" style="background: rgba(59, 130, 246, 0.1)">
            <Icon name="building" size="2em" style="color: #3b82f6" />
          </div>
          <div class="metrica-info">
            <span class="metrica-valor">{{ item.total }}</span>
            <span class="metrica-label">{{ nombreDepartamento(item.departamento_id) }}</span>
          </div>
        </div>
      </div>

      <!-- Toggle de identidad: por defecto oculto, decisión explícita del admin -->
      <div class="identidad-toggle-bar">
        <div class="identidad-toggle-texto">
          <Icon name="eye-slash" v-if="!mostrarIdentidad" />
          <Icon name="eye" v-else />
          <span>
            {{ mostrarIdentidad
              ? 'Mostrando quién respondió cada encuesta.'
              : 'Los resultados se muestran agregados. Puedes revelar el detalle nominal si lo necesitas.' }}
          </span>
        </div>
        <label class="toggle-switch">
          <input type="checkbox" v-model="mostrarIdentidad" />
          <span class="toggle-slider"></span>
          <span class="toggle-label">Mostrar quién respondió</span>
        </label>
      </div>

      <!-- Tabla de Usuarios (solo si el admin decide mostrarla) -->
      <div class="tabla-section" v-if="mostrarIdentidad">
        <h3>Detalle de Participantes</h3>
        <div class="tabla-wrapper">
          <table class="tabla-usuarios">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Cédula</th>
                <th>Departamento</th>
                <th>Tipo Contrato</th>
                <th>Completada</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(usuario, index) in estadisticas.detalle_usuarios" :key="index">
                <td>{{ usuario.nombres }} {{ usuario.apellidos }}</td>
                <td>{{ usuario.cedula }}</td>
                <td>{{ nombreDepartamento(usuario.departamento_id) }}</td>
                <td>
                  <span class="badge-contrato">{{ formatearTipoContrato(usuario.tipo_contrato) }}</span>
                </td>
                <td>{{ formatearFecha(usuario.completada_en) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Estadísticas por Pregunta -->
      <div class="preguntas-section" v-if="estadisticas.estadisticas_preguntas && estadisticas.estadisticas_preguntas.length > 0">
        <h3>Resultados por Pregunta</h3>
        <div class="preguntas-grid">
          <div v-for="(pregunta, index) in estadisticas.estadisticas_preguntas" :key="index" class="pregunta-card">
            <div class="pregunta-header">
              <span class="pregunta-numero" v-if="pregunta.seccion_titulo">{{ pregunta.seccion_titulo }}</span>
              <span class="pregunta-tipo badge-tipo">{{ formatearTipo(pregunta.tipo) }}</span>
            </div>
            <p class="pregunta-texto">{{ pregunta.enunciado }}</p>

            <!-- Opción única / múltiple -->
            <div v-if="['simple', 'multiple'].includes(pregunta.tipo)" class="opciones-resultado">
              <div v-for="(opcion, oIndex) in pregunta.estadisticas.opciones" :key="oIndex" class="opcion-resultado">
                <div class="opcion-resultado-header">
                  <span>{{ opcion.texto_opcion }}</span>
                  <span class="opcion-total">{{ opcion.total }}</span>
                </div>
                <div class="opcion-barra">
                  <div
                    class="opcion-barra-fill"
                    :style="`width: ${porcentajeOpcion(opcion.total, pregunta.estadisticas.total_respuestas)}%`"
                  ></div>
                </div>
              </div>
              <p class="total-respuestas">{{ pregunta.estadisticas.total_respuestas }} respuestas</p>
            </div>

            <!-- Escala -->
            <div v-else-if="pregunta.tipo === 'escala'" class="escala-resultado">
              <div class="escala-promedio">
                <span class="promedio-valor">{{ pregunta.estadisticas.promedio }}</span>
                <span class="promedio-label">Promedio</span>
              </div>
              <p class="total-respuestas">{{ pregunta.estadisticas.total_respuestas }} respuestas</p>
            </div>

            <!-- Texto -->
            <div v-else class="texto-resultado">
              <p class="total-respuestas">{{ pregunta.estadisticas.total_respuestas }} respuestas de texto</p>
              <div class="texto-lista" v-if="pregunta.estadisticas.respuestas_texto && pregunta.estadisticas.respuestas_texto.length">
                <div v-for="(texto, tIndex) in pregunta.estadisticas.respuestas_texto" :key="tIndex" class="texto-item">
                  "{{ texto }}"
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estadísticas segmentadas (por departamento o tipo de contrato) -->
      <div class="segmentado-section">
        <div class="segmentado-header">
          <h3>Resultados por {{ segmentoTipo === 'departamento' ? 'Departamento' : 'Tipo de Contrato' }}</h3>
          <div class="segmento-selector">
            <button
              :class="['segmento-btn', { active: segmentoTipo === 'departamento' }]"
              @click="cambiarSegmento('departamento')"
            >
              <Icon name="building" /> Por Departamento
            </button>
            <button
              :class="['segmento-btn', { active: segmentoTipo === 'contrato' }]"
              @click="cambiarSegmento('contrato')"
            >
              <Icon name="clipboard" /> Por Tipo de Contrato
            </button>
          </div>
        </div>

        <div v-if="cargandoSegmentado" class="loading-container-small">
          <div class="spinner"></div>
          <p>Cargando estadísticas segmentadas...</p>
        </div>

        <template v-else-if="segmentado">
          <!-- Resumen: cuántas personas de cada segmento respondieron en total -->
          <div class="resumen-segmentos">
            <div v-for="seg in segmentado.segmentos" :key="seg" class="resumen-segmento-item">
              <span class="resumen-segmento-valor">{{ segmentado.resumen_segmentos[seg] }}</span>
              <span class="resumen-segmento-label">{{ seg }}</span>
            </div>
          </div>

          <!-- Por cada pregunta: % general por opción + composición por segmento -->
          <div v-if="segmentado.preguntas.length > 0" class="segmentado-preguntas">
            <div v-for="(pregunta, pIndex) in segmentado.preguntas" :key="pIndex" class="pregunta-card">
              <div class="pregunta-header">
                <span class="pregunta-tipo badge-tipo">{{ formatearTipo(pregunta.tipo) }}</span>
              </div>
              <p class="pregunta-texto">{{ pregunta.enunciado }}</p>

              <!-- Opción única / múltiple: gráficos + barras con composición -->
              <div v-if="['simple', 'multiple'].includes(pregunta.tipo)" class="opciones-cruzadas">
                <!-- Gráfico de distribución -->
                <div class="graficos-pregunta-inline">
                  <div class="grafico-wrapper-inline">
                    <h4>Distribución General</h4>
                    <canvas :ref="'chartDona_' + pregunta.pregunta_id" class="chart-canvas-inline"></canvas>
                  </div>
                </div>

                <!-- Tabla simple y clara con porcentajes y cantidades -->
                <div class="tabla-estadisticas-simple">
                  <table class="tabla-respuestas">
                    <thead>
                      <tr>
                        <th class="col-valor">Opción</th>
                        <th class="col-departamento">{{ segmentoTipo === 'departamento' ? 'Departamento' : 'Tipo de Contrato' }}</th>
                        <th class="col-porcentaje">Porcentaje</th>
                        <th class="col-cantidad">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(opcion, opcionIndex) in pregunta.opciones">
                        <template v-for="(seg, segIndex) in segmentado.segmentos">
                          <tr 
                            v-if="opcion.composicion_por_segmento[seg] > 0"
                            :key="`${opcion.opcion_id}-${seg}`"
                            class="fila-dato"
                          >
                            <td v-if="esPrimerSegmentoConDatos(opcion, seg)" 
                                :rowspan="contarSegmentosConDatos(opcion)" 
                                class="col-valor-cell">
                              <div class="valor-container">
                                <span class="texto-valor">{{ opcion.texto_opcion }}</span>
                                <span class="badge-total-tabla">{{ opcion.total }}</span>
                              </div>
                            </td>
                            <td class="col-departamento-cell">
                              <div class="departamento-info">
                                <div class="color-indicator" :style="{ backgroundColor: obtenerColorSegmento(segIndex) }"></div>
                                <span>{{ segmentoTipo === 'contrato' ? formatearTipoContrato(seg) : seg }}</span>
                              </div>
                            </td>
                            <td class="col-porcentaje-cell">
                              <div class="porcentaje-visual">
                                <div class="barra-porcentaje">
                                  <div 
                                    class="barra-fill" 
                                    :style="{ 
                                      width: (opcion.composicion_por_segmento[seg] / opcion.total * 100) + '%',
                                      backgroundColor: obtenerColorSegmento(segIndex)
                                    }"
                                  ></div>
                                </div>
                                <span class="texto-porcentaje">{{ Math.round(opcion.composicion_por_segmento[seg] / opcion.total * 100) }}%</span>
                              </div>
                            </td>
                            <td class="col-cantidad-cell">
                              <span class="numero-cantidad">{{ opcion.composicion_por_segmento[seg] }}</span>
                            </td>
                          </tr>
                        </template>
                      </template>
                    </tbody>
                  </table>
                </div>

                <p class="total-respuestas">{{ pregunta.total_respuestas }} respuestas en total</p>
              </div>

              <!-- Escala: promedio general + promedio por segmento + GRÁFICOS -->
              <div v-else-if="pregunta.tipo === 'escala'" class="escala-resultado">
                <!-- Gráfico de distribución -->
                <div class="graficos-pregunta-inline" v-if="pregunta.distribucion && pregunta.distribucion.length > 0">
                  <div class="grafico-wrapper-inline">
                    <h4>Distribución de Respuestas</h4>
                    <canvas :ref="'chartDonaEscala_' + pregunta.pregunta_id" class="chart-canvas-inline"></canvas>
                  </div>
                </div>

                <!-- Promedio general -->
                <div class="escala-promedio">
                  <span class="promedio-valor">{{ pregunta.promedio !== null ? pregunta.promedio : '—' }}</span>
                  <span class="promedio-label">Promedio general</span>
                </div>

                <!-- Tabla simple y clara con porcentajes y cantidades (Escala) -->
                <div class="tabla-estadisticas-simple" v-if="pregunta.distribucion && pregunta.distribucion.length > 0">
                  <table class="tabla-respuestas">
                    <thead>
                      <tr>
                        <th class="col-valor">Valor</th>
                        <th class="col-departamento">{{ segmentoTipo === 'departamento' ? 'Departamento' : 'Tipo de Contrato' }}</th>
                        <th class="col-porcentaje">Porcentaje</th>
                        <th class="col-cantidad">Cantidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template v-for="(valorItem, valorIndex) in pregunta.distribucion">
                        <template v-for="(seg, segIndex) in segmentado.segmentos">
                          <tr 
                            v-if="valorItem.composicion_por_segmento[seg] > 0"
                            :key="`${valorItem.valor}-${seg}`"
                            class="fila-dato"
                          >
                            <td v-if="esPrimerSegmentoConDatos(valorItem, seg)" 
                                :rowspan="contarSegmentosConDatos(valorItem)" 
                                class="col-valor-cell">
                              <div class="valor-container">
                                <span class="texto-valor">Valor {{ valorItem.etiqueta }}</span>
                                <span class="badge-total-tabla">{{ valorItem.total }}</span>
                              </div>
                            </td>
                            <td class="col-departamento-cell">
                              <div class="departamento-info">
                                <div class="color-indicator" :style="{ backgroundColor: obtenerColorSegmento(segIndex) }"></div>
                                <span>{{ segmentoTipo === 'contrato' ? formatearTipoContrato(seg) : seg }}</span>
                              </div>
                            </td>
                            <td class="col-porcentaje-cell">
                              <div class="porcentaje-visual">
                                <div class="barra-porcentaje">
                                  <div 
                                    class="barra-fill" 
                                    :style="{ 
                                      width: (valorItem.composicion_por_segmento[seg] / valorItem.total * 100) + '%',
                                      backgroundColor: obtenerColorSegmento(segIndex)
                                    }"
                                  ></div>
                                </div>
                                <span class="texto-porcentaje">{{ Math.round(valorItem.composicion_por_segmento[seg] / valorItem.total * 100) }}%</span>
                              </div>
                            </td>
                            <td class="col-cantidad-cell">
                              <span class="numero-cantidad">{{ valorItem.composicion_por_segmento[seg] }}</span>
                            </td>
                          </tr>
                        </template>
                      </template>
                    </tbody>
                  </table>
                </div>
              </div>

              <!-- Texto libre: solo totales, sin exponer contenido -->
              <div v-else class="texto-resultado">
                <p class="total-respuestas">{{ pregunta.total_respuestas }} respuestas de texto en total</p>
                <div class="composicion-lista">
                  <span v-for="seg in segmentado.segmentos" :key="seg" class="composicion-chip">
                    {{ seg }}: {{ pregunta.total_por_segmento[seg] }}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </template>

        <div v-else class="empty-preview">
          <p>No hay datos suficientes para mostrar estadísticas segmentadas todavía.</p>
        </div>
      </div>
    </div>

    <!-- Error -->
    <div v-else class="error-container">
      <Icon name="alert-circle" size="3em" style="color: #ef4444" />
      <p>Error al cargar las estadísticas</p>
      <button @click="cargarEstadisticas" class="btn-reintentar">Reintentar</button>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';
import Chart from 'chart.js';

export default {
  name: 'AnalyticsEncuesta',
  components: {
    Icon
  },
  props: {
    encuestaId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      cargando: false,
      estadisticas: null,
      encuesta: null,
      departamentos: [],
      // Por defecto SIEMPRE oculto: mostrar identidad es una decisión
      // explícita que el admin toma cada vez que entra a ver estadísticas.
      mostrarIdentidad: false,
      segmentoTipo: 'departamento',
      segmentado: null,
      cargandoSegmentado: false,
      chartsInstances: {} // Para guardar instancias y destruir antes de recrear
    };
  },
  mounted() {
    this.cargarDepartamentos();
    this.cargarEstadisticas();
    this.cargarSegmentado();
  },
  methods: {
    esPrimerSegmentoConDatos(valorItem, segmentoActual) {
      if (!this.segmentado || !this.segmentado.segmentos || !valorItem || !valorItem.composicion_por_segmento) {
        return false;
      }
      const primerSegmento = this.segmentado.segmentos.find(seg => 
        valorItem.composicion_por_segmento[seg] > 0
      );
      return primerSegmento === segmentoActual;
    },

    contarSegmentosConDatos(valorItem) {
      if (!this.segmentado || !this.segmentado.segmentos || !valorItem || !valorItem.composicion_por_segmento) {
        return 1;
      }
      return this.segmentado.segmentos.filter(seg => 
        valorItem.composicion_por_segmento[seg] > 0
      ).length;
    },

    async cargarDepartamentos() {
      try {
        const response = await this.$http.get(`${this.$server_url}capacitaciones_prolipa/admin/departamentos`);
        if (response.data.success) {
          this.departamentos = response.data.data;
        }
      } catch (error) {
        // silencioso
      }
    },

    async cargarEstadisticas() {
      this.cargando = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/encuestas/${this.encuestaId}/analytics`
        );

        if (response.data.success) {
          this.estadisticas = response.data.data;
          this.encuesta = response.data.data.encuesta;
        } else {
          this.$emit('show-toast', { mensaje: 'Error al cargar estadísticas', tipo: 'error' });
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar estadísticas', tipo: 'error' });
      } finally {
        this.cargando = false;
      }
    },

    async cargarSegmentado() {
      this.cargandoSegmentado = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/encuestas/${this.encuestaId}/analytics-segmentado`,
          { params: { segmento: this.segmentoTipo } }
        );

        if (response.data.success) {
          this.segmentado = response.data.data;
          this.renderizarGraficos();
        } else {
          this.$emit('show-toast', { mensaje: 'Error al cargar estadísticas segmentadas', tipo: 'error' });
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar estadísticas segmentadas', tipo: 'error' });
      } finally {
        this.cargandoSegmentado = false;
      }
    },

    cambiarSegmento(tipo) {
      if (this.segmentoTipo === tipo) return;
      this.segmentoTipo = tipo;
      this.cargarSegmentado();
    },

    renderizarGraficos() {
      if (!this.segmentado || !this.segmentado.preguntas) return;
      
      // Doble $nextTick para asegurar que el DOM esté completamente renderizado
      this.$nextTick(() => {
        this.$nextTick(() => {
          this.segmentado.preguntas.forEach((pregunta) => {
            if (['simple', 'multiple'].includes(pregunta.tipo) && pregunta.opciones) {
              this.renderizarGraficoDona(pregunta);
              this.renderizarGraficoBarras(pregunta);
            } else if (pregunta.tipo === 'escala' && pregunta.distribucion && pregunta.distribucion.length > 0) {
              this.renderizarGraficoDonaEscala(pregunta);
              this.renderizarGraficoBarrasEscala(pregunta);
            }
          });
        });
      });
    },

    renderizarGraficoDona(pregunta) {
      const canvasRefName = 'chartDona_' + pregunta.pregunta_id;
      const canvas = this.$refs[canvasRefName];
      
      if (!canvas || !canvas[0]) return;
      
      // Destruir gráfico anterior si existe
      if (this.chartsInstances[canvasRefName]) {
        this.chartsInstances[canvasRefName].destroy();
      }
      
      const ctx = canvas[0].getContext('2d');

      const labels = pregunta.opciones.map(op => op.texto_opcion);
      const data = pregunta.opciones.map(op => op.total);
      const backgroundColor = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'];

      this.chartsInstances[canvasRefName] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColor.slice(0, labels.length),
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          legend: {
            display: true,
            position: 'right',
            labels: { fontSize: 11, boxWidth: 15, padding: 10 }
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, chartData) => {
                const dataset = chartData.datasets[tooltipItem.datasetIndex];
                const total = dataset.data.reduce((acc, val) => acc + val, 0);
                const currentValue = dataset.data[tooltipItem.index];
                const percentage = total > 0 ? Math.round((currentValue / total) * 100) : 0;
                return `${chartData.labels[tooltipItem.index]}: ${currentValue} (${percentage}%)`;
              }
            }
          }
        }
      });
    },

    renderizarGraficoBarras(pregunta) {
      const canvasRefName = 'chartBarras_' + pregunta.pregunta_id;
      const canvas = this.$refs[canvasRefName];
      
      if (!canvas || !canvas[0]) return;
      
      // Destruir gráfico anterior si existe
      if (this.chartsInstances[canvasRefName]) {
        this.chartsInstances[canvasRefName].destroy();
      }
      
      const ctx = canvas[0].getContext('2d');

      const labels = pregunta.opciones.map(op => op.texto_opcion);
      
      const datasets = this.segmentado.segmentos.map((seg, segIndex) => {
        return {
          label: seg,
          data: pregunta.opciones.map(op => op.composicion_por_segmento[seg] || 0),
          backgroundColor: this.obtenerColorSegmento(segIndex),
          borderWidth: 0
        };
      });

      this.chartsInstances[canvasRefName] = new Chart(ctx, {
        type: 'bar',
        data: { labels: labels, datasets: datasets },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          scales: {
            xAxes: [{ stacked: true, ticks: { fontSize: 10 } }],
            yAxes: [{
              stacked: true,
              ticks: { beginAtZero: true, stepSize: 1, fontSize: 10 },
              scaleLabel: { display: true, labelString: 'Cantidad de respuestas', fontSize: 11 }
            }]
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: { fontSize: 11, boxWidth: 15, padding: 10 }
          },
          tooltips: {
            mode: 'label',
            callbacks: {
              label: (tooltipItem, data) => {
                const dataset = data.datasets[tooltipItem.datasetIndex];
                return `${dataset.label}: ${tooltipItem.yLabel}`;
              }
            }
          }
        }
      });
    },

    renderizarGraficoDonaEscala(pregunta) {
      const canvasRefName = 'chartDonaEscala_' + pregunta.pregunta_id;
      const canvas = this.$refs[canvasRefName];
      
      if (!canvas || !canvas[0]) return;
      
      // Destruir gráfico anterior si existe
      if (this.chartsInstances[canvasRefName]) {
        this.chartsInstances[canvasRefName].destroy();
      }
      
      const ctx = canvas[0].getContext('2d');

      const labels = pregunta.distribucion.map(item => `Valor ${item.etiqueta}`);
      const data = pregunta.distribucion.map(item => item.total);
      const backgroundColor = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#a855f7'];

      this.chartsInstances[canvasRefName] = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: backgroundColor.slice(0, labels.length),
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          legend: {
            display: true,
            position: 'right',
            labels: { fontSize: 11, boxWidth: 15, padding: 10 }
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, chartData) => {
                const dataset = chartData.datasets[tooltipItem.datasetIndex];
                const total = dataset.data.reduce((acc, val) => acc + val, 0);
                const currentValue = dataset.data[tooltipItem.index];
                const percentage = total > 0 ? Math.round((currentValue / total) * 100) : 0;
                return `${chartData.labels[tooltipItem.index]}: ${currentValue} (${percentage}%)`;
              }
            }
          }
        }
      });
    },

    renderizarGraficoBarrasEscala(pregunta) {
      const canvasRefName = 'chartBarrasEscala_' + pregunta.pregunta_id;
      const canvas = this.$refs[canvasRefName];
      
      if (!canvas || !canvas[0]) return;
      
      // Destruir gráfico anterior si existe
      if (this.chartsInstances[canvasRefName]) {
        this.chartsInstances[canvasRefName].destroy();
      }
      
      const ctx = canvas[0].getContext('2d');

      const labels = pregunta.distribucion.map(item => `Valor ${item.etiqueta}`);
      
      const datasets = this.segmentado.segmentos.map((seg, segIndex) => {
        return {
          label: seg,
          data: pregunta.distribucion.map(item => item.composicion_por_segmento[seg] || 0),
          backgroundColor: this.obtenerColorSegmento(segIndex),
          borderWidth: 0
        };
      });

      this.chartsInstances[canvasRefName] = new Chart(ctx, {
        type: 'bar',
        data: { labels: labels, datasets: datasets },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          scales: {
            xAxes: [{ stacked: true, ticks: { fontSize: 10 } }],
            yAxes: [{
              stacked: true,
              ticks: { beginAtZero: true, stepSize: 1, fontSize: 10 },
              scaleLabel: { display: true, labelString: 'Cantidad de respuestas', fontSize: 11 }
            }]
          },
          legend: {
            display: true,
            position: 'bottom',
            labels: { fontSize: 11, boxWidth: 15, padding: 10 }
          },
          tooltips: {
            mode: 'label',
            callbacks: {
              label: (tooltipItem, data) => {
                const dataset = data.datasets[tooltipItem.datasetIndex];
                return `${dataset.label}: ${tooltipItem.yLabel}`;
              }
            }
          }
        }
      });
    },

    nombreDepartamento(id) {
      if (!id) return 'Sin departamento';
      const dept = this.departamentos.find(d => d.tdp_id === id);
      return dept ? dept.tdp_nombre : `Departamento #${id}`;
    },

    porcentajeOpcion(total, totalRespuestas) {
      if (!totalRespuestas) return 0;
      return Math.round((total / totalRespuestas) * 100);
    },

    formatearFecha(fecha) {
      if (!fecha) return '—';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    },

    formatearTipo(tipo) {
      const tipos = {
        simple: 'Opción Única',
        multiple: 'Opción Múltiple',
        texto_corto: 'Respuesta Corta',
        texto_largo: 'Respuesta Larga',
        escala: 'Escala'
      };
      return tipos[tipo] || tipo;
    },

    formatearTipoContrato(tipoContrato) {
      if (!tipoContrato) return 'N/A';
      
      const tipoLower = String(tipoContrato).trim().toLowerCase();
      const tipos = {
        'nomina': 'Contrato de Trabajo',
        'civil': 'Contrato Civil'
      };
      
      return tipos[tipoLower] || tipoContrato || 'N/A';
    },

    obtenerColorSegmento(index) {
      const colores = [
        '#3b82f6', // Azul
        '#10b981', // Verde
        '#f59e0b', // Naranja
        '#ef4444', // Rojo
        '#8b5cf6', // Púrpura
        '#ec4899', // Rosa
        '#14b8a6', // Teal
        '#f97316', // Naranja oscuro
        '#6366f1', // Índigo
        '#a855f7', // Violeta
        '#06b6d4', // Cyan
        '#84cc16', // Lima
        '#f43f5e', // Rosa rojo
        '#0ea5e9'  // Azul cielo
      ];
      return colores[index % colores.length];
    },

    calcularAnchoSegmento(cantidad, total) {
      if (total === 0) return 0;
      return (cantidad / total) * 100;
    }
  }
};
</script>

<style scoped>
.analytics-container {
  width: 100%;
  padding: 20px;
}

.analytics-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 30px;
}

.btn-volver {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #ffffff;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-volver:hover {
  background-color: #f8fafc;
  color: #1e293b;
  border-color: #cbd5e1;
}

.analytics-header h2 {
  color: #3b82f6;
  margin: 0;
  font-size: 1.5rem;
}

.loading-container,
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #475569;
  gap: 16px;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.btn-reintentar {
  padding: 10px 20px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.metricas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.metrica-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s;
}

.metrica-card:hover {
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.metrica-icono {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.metrica-info {
  display: flex;
  flex-direction: column;
}

.metrica-valor {
  font-size: 2rem;
  font-weight: 700;
  color: #3b82f6;
  line-height: 1;
  margin-bottom: 4px;
}

.metrica-label {
  font-size: 0.85rem;
  color: #94a3b8;
}

/* Toggle de identidad */
.identidad-toggle-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  background-color: #f5f3ff;
  border: 1px solid #ddd6fe;
  border-radius: 12px;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.identidad-toggle-texto {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #5b21b6;
  font-size: 0.9rem;
  flex: 1;
  min-width: 240px;
}

.toggle-switch {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  user-select: none;
}

.toggle-switch input[type="checkbox"] {
  display: none;
}

.toggle-slider {
  position: relative;
  width: 44px;
  height: 22px;
  background-color: #e2e8f0;
  border-radius: 22px;
  transition: all 0.3s;
  border: 2px solid #cbd5e1;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: #ffffff;
  top: 2px;
  left: 2px;
  transition: all 0.3s;
}

.toggle-switch input[type="checkbox"]:checked + .toggle-slider {
  background-color: #3b82f6;
  border-color: #3b82f6;
}

.toggle-switch input[type="checkbox"]:checked + .toggle-slider::before {
  transform: translateX(20px);
}

.toggle-label {
  color: #5b21b6;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.tabla-section {
  margin-bottom: 40px;
}

.tabla-section h3 {
  color: #3b82f6;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.tabla-wrapper {
  overflow-x: auto;
  background-color: #ffffff;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.tabla-usuarios {
  width: 100%;
  border-collapse: collapse;
}

.tabla-usuarios thead {
  background-color: #f8fafc;
}

.tabla-usuarios th {
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #475569;
  font-size: 0.9rem;
}

.tabla-usuarios td {
  padding: 12px;
  border-top: 1px solid #f1f5f9;
  color: #1e293b;
  font-size: 0.9rem;
}

.tabla-usuarios tbody tr:hover {
  background-color: #f8fafc;
}

.badge-contrato {
  padding: 4px 10px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.8rem;
  background-color: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  text-transform: capitalize;
}

.preguntas-section h3 {
  color: #3b82f6;
  margin-bottom: 20px;
  font-size: 1.3rem;
}

.preguntas-grid {
  display: grid;
  gap: 20px;
}

.pregunta-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.pregunta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.pregunta-numero {
  font-weight: 600;
  color: #3b82f6;
  font-size: 0.9rem;
}

.badge-tipo {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  background-color: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  font-weight: 600;
}

.pregunta-texto {
  color: #1e293b;
  margin-bottom: 16px;
  line-height: 1.5;
  font-weight: 600;
}

.opciones-resultado {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.opcion-resultado-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #334155;
  margin-bottom: 4px;
}

.opcion-total {
  font-weight: 700;
  color: #3b82f6;
}

.opcion-barra {
  height: 8px;
  background-color: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.opcion-barra-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  transition: width 0.3s;
}

.total-respuestas {
  margin-top: 10px;
  font-size: 0.8rem;
  color: #64748b;
}

.escala-resultado {
  text-align: center;
  padding: 10px 0;
}

.escala-promedio {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.promedio-valor {
  font-size: 2.2rem;
  font-weight: 700;
  color: #3b82f6;
}

.promedio-label {
  font-size: 0.85rem;
  color: #64748b;
}

.texto-lista {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 10px;
  max-height: 220px;
  overflow-y: auto;
}

.texto-item {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 0.85rem;
  color: #334155;
  font-style: italic;
}

.segmentado-section {
  margin-top: 40px;
}

.segmentado-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 20px;
}

.segmentado-header h3 {
  color: #3b82f6;
  margin: 0;
  font-size: 1.3rem;
}

.segmento-selector {
  display: flex;
  gap: 8px;
}

.segmento-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 16px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
}

.segmento-btn:hover {
  background-color: #f1f5f9;
  border-color: #cbd5e1;
  color: #3b82f6;
}

.segmento-btn.active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.loading-container-small {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 20px;
  color: #64748b;
  gap: 12px;
}

.resumen-segmentos {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.resumen-segmento-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 14px 22px;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  min-width: 120px;
}

.resumen-segmento-valor {
  font-size: 1.6rem;
  font-weight: 700;
  color: #3b82f6;
}

.resumen-segmento-label {
  font-size: 0.8rem;
  color: #475569;
  font-weight: 600;
  text-align: center;
}

.segmentado-preguntas {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.detalle-numerico {
  margin-top: 20px;
}

.graficos-pregunta-inline {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 20px 0;
}

.grafico-wrapper-inline {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.grafico-wrapper-inline h4 {
  margin: 0 0 16px 0;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
  width: 100%;
}

.chart-canvas-inline {
  max-width: 400px;
  width: 100%;
}

.opciones-cruzadas {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.opcion-cruzada {
  padding-bottom: 4px;
}

.composicion-lista {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.composicion-lista-centrada {
  justify-content: center;
  margin-top: 14px;
}

.composicion-chip {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

/* Nuevos estilos mejorados */
.composicion-lista-mejorada {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  align-items: center;
}

.composicion-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.composicion-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.badge-segmento {
  font-weight: 500;
  opacity: 0.95;
}

.badge-valor {
  background-color: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 700;
  font-size: 0.9rem;
}

.promedio-segmentos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin: 16px 0;
}

.promedio-segmento-card {
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  border-left: 4px solid;
  transition: all 0.2s;
}

.promedio-segmento-card:hover {
  background-color: #f1f5f9;
  transform: translateX(2px);
}

.promedio-segmento-nombre {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 500;
  margin-bottom: 4px;
}

.promedio-segmento-valor {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

/* Tabla simple y clara de estadísticas */
.tabla-estadisticas-simple {
  margin: 20px 0;
  overflow-x: auto;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tabla-respuestas {
  width: 100%;
  border-collapse: collapse;
  background-color: #ffffff;
  font-size: 0.95rem;
}

.tabla-respuestas thead {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
}

.tabla-respuestas th {
  padding: 14px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  border-bottom: 2px solid #1e40af;
}

.col-valor {
  width: 30%;
  min-width: 200px;
}

.col-departamento {
  width: 30%;
  min-width: 180px;
}

.col-porcentaje {
  width: 25%;
  min-width: 150px;
}

.col-cantidad {
  width: 15%;
  min-width: 100px;
  text-align: center;
}

.fila-dato {
  transition: background-color 0.2s;
  border-bottom: 1px solid #e2e8f0;
}

.fila-dato:nth-child(even) {
  background-color: #f8fafc;
}

.fila-dato:hover {
  background-color: #eff6ff;
}

/* Separador visual entre grupos de valores diferentes */
.fila-dato + .fila-dato:has(.col-valor-cell) {
  border-top: 3px solid #94a3b8;
}

.col-valor-cell {
  padding: 16px;
  border-right: 3px solid #cbd5e1;
  background-color: #ffffff;
  position: relative;
}

.valor-container {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-direction: column;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: calc(100% - 32px);
}

.texto-valor {
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
  flex: 1;
}

.badge-total-tabla {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  padding: 6px 14px;
  border-radius: 20px;
  font-weight: 700;
  font-size: 1rem;
  min-width: 40px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
}

.col-departamento-cell {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.departamento-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-indicator {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  flex-shrink: 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.col-porcentaje-cell {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
}

.porcentaje-visual {
  display: flex;
  align-items: center;
  gap: 12px;
}

.barra-porcentaje {
  flex: 1;
  height: 24px;
  background-color: #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.05);
}

.barra-fill {
  height: 100%;
  border-radius: 12px;
  transition: width 0.4s ease;
  min-width: 4px;
}

.texto-porcentaje {
  font-weight: 700;
  color: #1e293b;
  min-width: 45px;
  text-align: right;
  font-size: 1rem;
}

.col-cantidad-cell {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
}

.numero-cantidad {
  display: inline-block;
  font-weight: 700;
  font-size: 1.2rem;
  color: #3b82f6;
  background-color: #eff6ff;
  padding: 6px 16px;
  border-radius: 8px;
  min-width: 40px;
}

/* Tabla de promedios por segmento */
.tabla-promedios-segmento {
  margin: 24px 0;
}

.titulo-tabla-promedios {
  color: #475569;
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
}

.tabla-compacta {
  font-size: 0.9rem;
  width: 100%;
}

.tabla-compacta thead {
  background: linear-gradient(135deg, #64748b, #475569);
}

.col-segmento-header {
  width: 60%;
  text-align: left;
  padding-left: 20px;
}

.col-promedio-header-solo {
  width: 40%;
  text-align: center;
}

.fila-promedio {
  transition: background-color 0.2s;
}

.fila-promedio:nth-child(even) {
  background-color: #f8fafc;
}

.fila-promedio:hover {
  background-color: #f0f9ff;
}

.col-segmento-cell {
  padding: 14px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.col-promedio-cell {
  padding: 14px 20px;
  border-bottom: 1px solid #e2e8f0;
  text-align: center;
}

.numero-promedio {
  display: inline-block;
  font-weight: 700;
  font-size: 1.5rem;
  color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff, #dbeafe);
  padding: 10px 24px;
  border-radius: 12px;
  min-width: 60px;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.2);
}

/* Responsive para tabla */
@media (max-width: 768px) {
  .tabla-estadisticas-simple {
    font-size: 0.85rem;
  }

  .tabla-respuestas th {
    padding: 10px 12px;
    font-size: 0.8rem;
  }

  .col-valor-cell,
  .col-departamento-cell,
  .col-porcentaje-cell,
  .col-cantidad-cell {
    padding: 10px 12px;
  }

  .badge-total-tabla {
    padding: 4px 10px;
    font-size: 0.9rem;
  }

  .numero-cantidad {
    font-size: 1rem;
    padding: 4px 12px;
  }

  .texto-porcentaje {
    font-size: 0.9rem;
  }
}

.empty-preview {
  text-align: center;
  padding: 30px 20px;
  color: #94a3b8;
}

@media (max-width: 768px) {
  .analytics-container {
    padding: 16px;
  }

  .metricas-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }

  .metrica-card {
    padding: 16px;
  }

  .metrica-valor {
    font-size: 1.5rem;
  }

  .identidad-toggle-bar {
    flex-direction: column;
    align-items: stretch;
  }

  .tabla-wrapper {
    overflow-x: scroll;
  }

  .tabla-usuarios {
    min-width: 700px;
  }

  .promedio-segmentos-grid {
    grid-template-columns: 1fr;
  }

  .graficos-pregunta-inline {
    grid-template-columns: 1fr;
  }

  .tabla-distribucion-optimizada {
    font-size: 0.9rem;
  }
}
</style>
