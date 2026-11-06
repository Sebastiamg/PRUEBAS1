<script>
import { Radar } from 'vue-chartjs'
import Chart from 'chart.js'

export default {
  name: 'DepartamentosChart',
  extends: Radar,
  props: {
    chartData: {
      type: Object,
      required: true
    },
    options: {
      type: Object,
      default: null
    }
  },
  watch: {
    chartData: {
      handler() {
        if (this.$data._chart) {
          this.$data._chart.destroy();
        }
        this.renderChartWithData();
      },
      deep: true
    }
  },
  mounted() {
    this.renderChartWithData();
  },
  methods: {
    renderChartWithData() {
      const defaultOptions = {
        responsive: true,
        maintainAspectRatio: false,
        legend: {
          display: true,
          position: 'right',
          labels: {
            fontColor: '#1e293b',
            fontSize: 12,
            padding: 15,
            usePointStyle: true,
            boxWidth: 10
          }
        },
        scale: {
          gridLines: {
            color: 'rgba(203, 213, 225, 0.5)',
            lineWidth: 1
          },
          angleLines: {
            color: 'rgba(203, 213, 225, 0.5)',
            lineWidth: 1
          },
          ticks: {
            fontColor: '#1e293b',
            fontSize: 11,
            beginAtZero: true,
            stepSize: 1,
            backdropColor: 'rgba(0, 0, 0, 0)',
            showLabelBackdrop: false,
            callback: function(value) {
              if (Number.isInteger(value)) {
                return value;
              }
            }
          },
          pointLabels: {
            fontColor: '#1e293b',
            fontSize: 13,
            fontStyle: 'bold'
          }
        },
        tooltips: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          titleFontSize: 13,
          titleFontColor: '#fff',
          bodyFontColor: '#fff',
          bodyFontSize: 12,
          displayColors: true,
          borderColor: 'rgba(148, 163, 184, 0.3)',
          borderWidth: 1,
          xPadding: 12,
          yPadding: 12,
          cornerRadius: 6,
          callbacks: {
            label: function(tooltipItem, data) {
              const label = data.datasets[tooltipItem.datasetIndex].label || '';
              return ` ${label}: ${tooltipItem.value}`;
            }
          }
        }
      };

      const finalOptions = this.options ? { ...defaultOptions, ...this.options } : defaultOptions;
      
      this.renderChart(this.chartData, finalOptions);
    }
  }
}
</script>
