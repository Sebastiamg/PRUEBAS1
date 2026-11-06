<script>
import { Bar } from 'vue-chartjs'
import Chart from 'chart.js'

// Plugin para redondear barras
Chart.elements.Rectangle.prototype.draw = function() {
  var ctx = this._chart.ctx;
  var vm = this._view;
  var left, right, top, bottom, signX, signY, borderSkipped, radius;
  var borderWidth = vm.borderWidth;
  var cornerRadius = 8; // Radio de redondeo

  if (!vm.horizontal) {
    // Barra vertical
    left = vm.x - vm.width / 2;
    right = vm.x + vm.width / 2;
    top = vm.y;
    bottom = vm.base;
    signX = 1;
    signY = bottom > top ? 1 : -1;
    borderSkipped = vm.borderSkipped || 'bottom';
  } else {
    // Barra horizontal
    left = vm.base;
    right = vm.x;
    top = vm.y - vm.height / 2;
    bottom = vm.y + vm.height / 2;
    signX = right > left ? 1 : -1;
    signY = 1;
    borderSkipped = vm.borderSkipped || 'left';
  }

  // Ajustar borderWidth si es necesario
  if (borderWidth) {
    var barSize = Math.min(Math.abs(left - right), Math.abs(top - bottom));
    borderWidth = borderWidth > barSize ? barSize : borderWidth;
    var halfStroke = borderWidth / 2;
    
    var borderLeft = left + (borderSkipped !== 'left' ? halfStroke * signX : 0);
    var borderRight = right + (borderSkipped !== 'right' ? -halfStroke * signX : 0);
    var borderTop = top + (borderSkipped !== 'top' ? halfStroke * signY : 0);
    var borderBottom = bottom + (borderSkipped !== 'bottom' ? -halfStroke * signY : 0);

    if (borderLeft !== borderRight) {
      top = borderTop;
      bottom = borderBottom;
    }
    if (borderTop !== borderBottom) {
      left = borderLeft;
      right = borderRight;
    }
  }

  ctx.beginPath();
  ctx.fillStyle = vm.backgroundColor;
  ctx.strokeStyle = vm.borderColor;
  ctx.lineWidth = borderWidth;

  // Ajustar cornerRadius para que no sea mayor que el tamaño de la barra
  var barWidth = Math.abs(right - left);
  var barHeight = Math.abs(bottom - top);
  if (cornerRadius > barWidth / 2) {
    cornerRadius = barWidth / 2;
  }
  if (cornerRadius > barHeight / 2) {
    cornerRadius = barHeight / 2;
  }

  // Dibujar barra con esquinas superiores redondeadas
  ctx.moveTo(left, bottom);
  ctx.lineTo(left, top + cornerRadius);
  ctx.quadraticCurveTo(left, top, left + cornerRadius, top);
  ctx.lineTo(right - cornerRadius, top);
  ctx.quadraticCurveTo(right, top, right, top + cornerRadius);
  ctx.lineTo(right, bottom);
  ctx.closePath();

  ctx.fill();
  if (borderWidth) {
    ctx.stroke();
  }
};

export default {
  name: 'ActividadChart',
  extends: Bar,
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
        this.$data._chart.destroy();
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
          position: 'bottom',
          labels: {
            fontColor: '#1e293b',
            fontSize: 13,
            padding: 20,
            usePointStyle: true,
            boxWidth: 12
          }
        },
        scales: {
          xAxes: [{
            gridLines: {
              display: true,
              color: 'rgba(203, 213, 225, 0.5)',
              drawBorder: true,
              drawOnChartArea: true,
              drawTicks: true,
              zeroLineColor: 'rgba(148, 163, 184, 0.5)'
            },
            ticks: {
              fontColor: '#1e293b',
              fontSize: 12,
              padding: 8
            }
          }],
          yAxes: [{
            gridLines: {
              color: 'rgba(203, 213, 225, 0.5)',
              zeroLineColor: 'rgba(148, 163, 184, 0.6)',
              drawBorder: false
            },
            ticks: {
              fontColor: '#1e293b',
              fontSize: 12,
              beginAtZero: true,
              stepSize: 1,
              padding: 10,
              callback: function(value) {
                if (Number.isInteger(value)) {
                  return value;
                }
              }
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
