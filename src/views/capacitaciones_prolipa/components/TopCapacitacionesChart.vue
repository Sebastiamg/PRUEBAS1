<script>
import { HorizontalBar } from 'vue-chartjs'
import Chart from 'chart.js'

export default {
  name: 'TopCapacitacionesChart',
  extends: HorizontalBar,
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
          display: false
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: true,
              color: 'rgba(203, 213, 225, 0.5)',
              drawBorder: false
            },
            ticks: {
              fontColor: '#1e293b',
              fontSize: 12,
              beginAtZero: true,
              stepSize: 1,
              callback: function(value) {
                if (Number.isInteger(value)) {
                  return value;
                }
              }
            }
          }],
          yAxes: [{
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              fontColor: '#1e293b',
              fontSize: 12,
              padding: 10
            }
          }]
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
              return ` Intentos: ${tooltipItem.value}`;
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
