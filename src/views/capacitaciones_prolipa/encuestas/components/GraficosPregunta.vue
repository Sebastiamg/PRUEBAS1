<template>
  <div class="graficos-pregunta">
    <!-- Gráfico de dona: distribución general -->
    <div class="grafico-wrapper" v-if="pregunta.opciones && pregunta.opciones.length > 0">
      <h4>Distribución General</h4>
      <canvas :ref="'chartDona' + preguntaIndex" class="chart-canvas"></canvas>
    </div>

    <!-- Gráfico de barras apiladas: composición por segmento -->
    <div class="grafico-wrapper" v-if="pregunta.opciones && pregunta.opciones.length > 0">
      <h4>Composición por {{ segmentoTipo === 'departamento' ? 'Departamento' : 'Contrato' }}</h4>
      <canvas :ref="'chartBarras' + preguntaIndex" class="chart-canvas"></canvas>
    </div>
  </div>
</template>

<script>
import Chart from 'chart.js';

export default {
  name: 'GraficosPregunta',
  props: {
    pregunta: {
      type: Object,
      required: true
    },
    preguntaIndex: {
      type: Number,
      required: true
    },
    segmentos: {
      type: Array,
      required: true
    },
    segmentoTipo: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      chartDona: null,
      chartBarras: null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.renderizarGraficos();
    });
  },
  beforeDestroy() {
    if (this.chartDona) {
      this.chartDona.destroy();
    }
    if (this.chartBarras) {
      this.chartBarras.destroy();
    }
  },
  watch: {
    pregunta: {
      handler() {
        this.renderizarGraficos();
      },
      deep: true
    }
  },
  methods: {
    renderizarGraficos() {
      if (!this.pregunta.opciones) return;

      this.$nextTick(() => {
        this.renderizarGraficoDona();
        this.renderizarGraficoBarras();
      });
    },

    renderizarGraficoDona() {
      const canvasRefName = 'chartDona' + this.preguntaIndex;
      const canvas = this.$refs[canvasRefName];
      
      if (!canvas || !canvas.length) return;
      
      const ctx = canvas[0].getContext('2d');

      if (this.chartDona) {
        this.chartDona.destroy();
      }

      const labels = this.pregunta.opciones.map(op => op.texto_opcion);
      const data = this.pregunta.opciones.map(op => op.total);
      const backgroundColor = [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#ec4899',
        '#14b8a6',
        '#f97316'
      ];

      this.chartDona = new Chart(ctx, {
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
            labels: {
              fontSize: 11,
              boxWidth: 15,
              padding: 10
            }
          },
          tooltips: {
            callbacks: {
              label: (tooltipItem, data) => {
                const dataset = data.datasets[tooltipItem.datasetIndex];
                const total = dataset.data.reduce((acc, val) => acc + val, 0);
                const currentValue = dataset.data[tooltipItem.index];
                const percentage = total > 0 ? Math.round((currentValue / total) * 100) : 0;
                return `${data.labels[tooltipItem.index]}: ${currentValue} (${percentage}%)`;
              }
            }
          }
        }
      });
    },

    renderizarGraficoBarras() {
      const canvasRefName = 'chartBarras' + this.preguntaIndex;
      const canvas = this.$refs[canvasRefName];
      
      if (!canvas || !canvas.length) return;
      
      const ctx = canvas[0].getContext('2d');

      if (this.chartBarras) {
        this.chartBarras.destroy();
      }

      const labels = this.pregunta.opciones.map(op => op.texto_opcion);
      
      const coloresSegmento = {
        0: '#3b82f6',
        1: '#10b981',
        2: '#f59e0b',
        3: '#ef4444',
        4: '#8b5cf6'
      };

      const datasets = this.segmentos.map((seg, segIndex) => {
        return {
          label: seg,
          data: this.pregunta.opciones.map(op => op.composicion_por_segmento[seg] || 0),
          backgroundColor: coloresSegmento[segIndex] || '#64748b',
          borderWidth: 0
        };
      });

      this.chartBarras = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: labels,
          datasets: datasets
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          aspectRatio: 2,
          scales: {
            xAxes: [{
              stacked: true,
              ticks: {
                fontSize: 10
              }
            }],
            yAxes: [{
              stacked: true,
              ticks: {
                beginAtZero: true,
                stepSize: 1,
                fontSize: 10
              },
              scaleLabel: {
                display: true,
                labelString: 'Cantidad de respuestas',
                fontSize: 11
              }
            }]
          },
          legend: {
            display: true,
            position: 'top',
            labels: {
              fontSize: 11,
              boxWidth: 15,
              padding: 10
            }
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
    }
  }
};
</script>

<style scoped>
.graficos-pregunta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin: 20px 0;
}

.grafico-wrapper {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.grafico-wrapper h4 {
  margin: 0 0 16px 0;
  color: #475569;
  font-size: 0.9rem;
  font-weight: 600;
  text-align: center;
}

.chart-canvas {
  max-height: 300px;
}
</style>
