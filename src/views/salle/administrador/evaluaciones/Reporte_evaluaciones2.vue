<template>
  <div>
    <vx-card
      title="Filtro de Reportes"
      title-color="primary"
    >
      <!--MENU-->
      <div class="vx-row mt-4">
        <div
          class="menu-card menu0 active w-full sm:w-1/2 md:w-1/3 lg:w-1/6 xl:w-1/6 m-2"
          @click="menu = 0; estadoMenu();"
        >
          <div class="icon-wrapper">
            <span class="icon-container">
              <svg height="24px" width="24px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 370.32 370.32">
                <g>
                  <path d="M320.816,63.219L261.94,4.339C259.156,1.561,255.39,0,251.457,0H74.271
                      C58.219,0,45.16,13.06,45.16,29.112v312.095c0,16.053,13.059,29.113,29.111,29.113h221.777c16.052,0,29.111-13.06,29.111-29.113
                      V73.703C325.16,69.769,323.6,65.998,320.816,63.219z M293.547,337.907H76.773V32.414h154.088v43.577
                      c0,10.554,8.554,19.106,19.105,19.106h43.58V337.907z"/>
                  <path d="M103.827,149.16c0,8.284,6.716,15,15,15h132.667c8.284,0,15-6.716,15-15s-6.716-15-15-15H118.827
                      C110.542,134.16,103.827,140.876,103.827,149.16z"/>
                  <path d="M251.494,224.16H118.827c-8.284,0-15,6.716-15,15s6.716,15,15,15h132.667c8.284,0,15-6.716,15-15
                      S259.778,224.16,251.494,224.16z"/>
                </g>
              </svg>
            </span>
          </div>
          <div class="menu-content">
            <h6 class="menu-title">Reporte</h6>
            <span class="menu-subtitle">Comparativa</span>
          </div>
        </div>

        <div
          class="menu-card menu1 w-full sm:w-1/2 md:w-1/3 lg:w-1/6 xl:w-1/6 m-2"
          @click="menu = 1; estadoMenu();"
        >
          <div class="icon-wrapper">
            <span class="icon-container icon-warning">
              <svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 19V6.2C5 5.0799 5 4.51984 5.21799 4.09202C5.40973 3.71569 5.71569 3.40973 6.09202 3.21799C6.51984 3 7.0799 3 8.2 3H15.8C16.9201 3 17.4802 3 17.908 3.21799C18.2843 3.40973 18.5903 3.71569 18.782 4.09202C19 4.51984 19 5.0799 19 6.2V17H7C5.89543 17 5 17.8954 5 19ZM5 19C5 20.1046 5.89543 21 7 21H19M18 17V21M15 13.5C14.7164 12.3589 13.481 11.5 12 11.5C10.519 11.5 9.28364 12.3589 9 13.5M12 7.5H12.01M13 7.5C13 8.05228 12.5523 8.5 12 8.5C11.4477 8.5 11 8.05228 11 7.5C11 6.94772 11.4477 6.5 12 6.5C12.5523 6.5 13 6.94772 13 7.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </span>
          </div>
          <div class="menu-content">
            <h6 class="menu-title">Detalle</h6>
            <span class="menu-subtitle">Reporte</span>
          </div>
        </div>
      </div>
    </vx-card>

    <div class="mt-3">
      <!--REPORTE PROMEDIOS COMPARATIVA-->
      <div v-if="menu == 0">
        <ScreenComparativaPromediosVue
          :arregloPeriodos="arregloPeriodos"
          :arregloInstituciones="arregloInstituciones"
          class="fade-in"
        />
      </div>

      <!--REPORTE DETALLE AREAS - ASIGNATURAS-->
      <div v-if="menu == 1">
        <ScreenDetalleAreasVue
          :arregloPeriodos="arregloPeriodos"
          :arregloInstituciones="arregloInstituciones"
          class="fade-in"
        />
      </div>
    </div>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import ScreenComparativaPromediosVue from '@/views/salle/administrador/evaluaciones/components/reporte/ScreenComparativaPromedios'
import ScreenDetalleAreasVue from '@/views/salle/administrador/evaluaciones/components/reporte/ScreenDetalleAreas'

export default {
  components: {
    ScreenComparativaPromediosVue,
    ScreenDetalleAreasVue,
  },
  data() {
    return {
      arregloPeriodos: [],
      arregloInstituciones: [],
      menu: 0,
    }
  },
  mounted() {
    let me = this;
    me.getPeriodosEvaluacion()
    me.getInstituciones()
    let menuSelect = localStorage.menuReporte
    if (menuSelect) {
      me.menu = menuSelect
      setTimeout(function() { me.estadoMenu() }, 1000);
    } else {
      setTimeout(function() { me.estadoMenu() }, 1000);
    }
  },
  methods: {
    getPeriodosEvaluacion() {
      let me = this;
      this.$http.get(this.$server_url + 'salle/periodos?tipo_institucion_id='+localStorage.getItem('Salletipo_institucion_id'))
        .then(function(response) {
          me.arregloPeriodos = response.data;
        })
        .catch(function(error) {})
    },
    getInstituciones() {
      let me = this
      this.$http.get(this.$server_url + 'instituciones_salle_select?tipo_institucion='+localStorage.getItem('Salletipo_institucion_id'))
        .then(res => {
          me.arregloInstituciones = res.data
        })
        .catch(function(error) {
          console.log(error);
        })
    },
    estadoMenu() {
      let me = this;
      localStorage.setItem('menuReporte', me.menu)
      var divs = document.querySelectorAll(".menu-card");
      for (var i = 0; i < divs.length; i++) {
        divs[i].classList.remove("active");
      }
      const container = document.querySelector(".menu" + me.menu);
      container.classList.add("active");
    },
  }
}
</script>

<style scoped>
.menu-card {
  padding: 1.5rem 1rem;
  background: #ffffff;
  border: 2px solid #e8eef7;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
}

.menu-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, rgba(var(--vs-primary), 0.8), rgba(var(--vs-primary), 0.4));
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s ease;
}

.menu-card:hover {
  transform: translateY(-4px);
  border-color: rgba(var(--vs-primary), 0.3);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.08);
}

.menu-card:hover::before {
  transform: scaleX(1);
}

.menu-card.active {
  border: 2px solid rgba(var(--vs-primary), 0.5);
  background: linear-gradient(135deg, rgba(var(--vs-primary), 0.03) 0%, #ffffff 100%);
  box-shadow: 0 4px 12px rgba(var(--vs-primary), 0.15);
}

.menu-card.active::before {
  transform: scaleX(1);
  background: linear-gradient(90deg, rgba(var(--vs-primary), 1), rgba(var(--vs-primary), 0.6));
}

.icon-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 1rem;
}

.icon-container {
  padding: 0.875rem;
  display: inline-flex;
  border-radius: 12px;
  background: rgba(var(--vs-primary), 0.08);
  transition: all 0.3s ease;
}

.icon-container svg {
  fill: rgba(var(--vs-primary), 1);
  transition: all 0.3s ease;
}

.icon-warning {
  background: rgba(var(--vs-warning), 0.08);
}

.icon-warning svg {
  stroke: rgba(var(--vs-warning), 1);
  fill: none;
}

.menu-card:hover .icon-container {
  transform: scale(1.1) rotate(5deg);
  background: rgba(var(--vs-primary), 0.15);
}

.menu-card:hover .icon-warning {
  background: rgba(var(--vs-warning), 0.15);
}

.menu-card.active .icon-container {
  background: rgba(var(--vs-primary), 0.12);
  box-shadow: 0 4px 8px rgba(var(--vs-primary), 0.2);
}

.menu-card.active .icon-warning {
  background: rgba(var(--vs-warning), 0.12);
  box-shadow: 0 4px 8px rgba(var(--vs-warning), 0.2);
}

.menu-content {
  text-align: center;
}

.menu-title {
  margin-bottom: 0.25rem;
  font-size: 0.9375rem;
  font-weight: 600;
  color: #2c3e50;
  letter-spacing: 0.01em;
}

.menu-subtitle {
  font-size: 0.8125rem;
  color: #64748b;
  font-weight: 500;
}

.menu-card.active .menu-title {
  color: rgba(var(--vs-primary), 1);
}

.fade-in {
  animation: fadeInSlide 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 1.25rem;
  background: #ffffff;
  border: 1px solid #e8eef7;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

@keyframes fadeInSlide {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .menu-card {
    padding: 1.25rem 0.875rem;
  }

  .menu-title {
    font-size: 0.875rem;
  }

  .menu-subtitle {
    font-size: 0.75rem;
  }
}
</style>
