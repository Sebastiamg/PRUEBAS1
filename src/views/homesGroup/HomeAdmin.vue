<template>
  <div v-if="usuario.id_group == 1" class="dashboard-admin">
    <div class="dashboard-admin__grid">
      <div class="kpi-card">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--warning">
            <i class="feather icon-credit-card"></i>
          </div>
          <span class="kpi-card__label">Tickets abiertos</span>
        </div>
        <div class="kpi-card__value">{{ formatNumber(cantTicketsAbiertos) }}</div>
        <p class="kpi-card__meta">Cerrados: {{ formatNumber(cantTicketsCerrados) }}</p>
        <div class="kpi-card__action">
          <vs-button color="success" size="small" type="filled" :to="{ name: 'soporte', params: {} }">Ver Tickets</vs-button>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--success">
            <i class="feather icon-list"></i>
          </div>
          <span class="kpi-card__label">Solicitudes pendientes</span>
        </div>
        <div class="kpi-card__value">{{ formatNumber(cantFormsSolicitudes) }}</div>
        <p class="kpi-card__meta">Total formularios: {{ formatNumber(cantFormsDocente) }}</p>
        <div class="kpi-card__action">
          <vs-button color="warning" size="small" type="filled" @click="$emit('ver-solicitudes')">Ver Solicitudes</vs-button>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--primary">
            <i class="feather icon-search"></i>
          </div>
          <span class="kpi-card__label">Total de preguntas</span>
        </div>
        <div class="kpi-card__value" >{{ formatNumber(totalPreguntas) }}</div>
        <div class="kpi-card__table">
          <div class="kpi-card__row">
            <span>Opción múltiple</span>
            <b>{{ formatNumber(c_preg0) }}</b>
          </div>
          <div class="kpi-card__row">
            <span>Respuesta cerrada</span>
            <b>{{ formatNumber(c_preg1) }}</b>
          </div>
          <div class="kpi-card__row">
            <span>Verdadero/Falso</span>
            <b>{{ formatNumber(c_preg2) }}</b>
          </div>
          <div class="kpi-card__row">
            <span>Opción simple</span>
            <b>{{ formatNumber(c_preg3) }}</b>
          </div>
          <div class="kpi-card__row">
            <span>Respuesta abierta</span>
            <b>{{ formatNumber(c_preg4) }}</b>
          </div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--warning">
            <i class="feather icon-package"></i>
          </div>
          <span class="kpi-card__label">Juegos administrables</span>
        </div>
        <div class="kpi-card__value">{{ formatNumber(totalJuegos) }}</div>
        <div class="kpi-card__table">
          <div class="kpi-card__row" v-for="(item, index) in juegosLista" :key="index">
            <span>{{ item.nombre_tipo_juego }}</span>
            <b>{{ formatNumber(item.cantidad) }}</b>
          </div>
        </div>
      </div>

      <div class="kpi-card">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--primary">
            <i class="feather icon-activity"></i>
          </div>
          <span class="kpi-card__label">Gestion Estrategica</span>
        </div>
        <div class="kpi-card__table">
          <div class="kpi-card__row">
            <span>Metas, KPIs y actividades diarias de la organizacion.</span>
          </div>
        </div>
        <div class="kpi-card__action">
          <!-- GEMA tiene sesion propia: el modulo pedira cedula y contrasena. -->
          <vs-button color="primary" size="small" type="filled" to="/gema">Entrar a Gestion Estrategica</vs-button>
        </div>
      </div>

    </div>

    <div class="dashboard-admin__revision-wrap">
      <div class="module-card module-card--half">
        <div class="module-card__head">
          <div class="kpi-card__icon kpi-card__icon--primary">
            <i class="feather icon-check-square"></i>
          </div>
          <h5>Revisiones de Verificaciones</h5>
        </div>
        <RevisionesPendientesHome />
      </div>
    </div>
  </div>
</template>

<script>
const RevisionesPendientesHome = () => import('../pedidos2/verificaciones/revision/revisionesPendientes.vue')

export default {
  name: 'HomeAdmin',
  components: {
    RevisionesPendientesHome
  },
  computed: {
    totalPreguntas() {
      const a = this.toNumber(this.c_preg0)
      const b = this.toNumber(this.c_preg1)
      const c = this.toNumber(this.c_preg2)
      const d = this.toNumber(this.c_preg3)
      const e = this.toNumber(this.c_preg4)
      return a + b + c + d + e
    },
    juegosLista() {
      return Array.isArray(this.c_juegos0) ? this.c_juegos0 : []
    },
    totalJuegos() {
      if (!Array.isArray(this.c_juegos0)) {
        return 0
      }
      return this.c_juegos0.reduce((total, item) => {
        const valor = item && item.cantidad != null ? Number(item.cantidad) : 0
        return total + (isNaN(valor) ? 0 : valor)
      }, 0)
    }
  },
  methods: {
    toNumber(value) {
      const parsed = Number(value)
      return isNaN(parsed) ? 0 : parsed
    },
    formatNumber(value) {
      const parsed = Number(value)
      if (isNaN(parsed)) {
        return value
      }
      return parsed.toLocaleString('es-EC')
    }
  },
  props: {
    usuario: {
      type: [Object, Array],
      required: true
    },
    cantTicketsAbiertos: {
      type: [Number, String],
      default: 0
    },
    cantTicketsCerrados: {
      type: [Number, String],
      default: 0
    },
    usuarioActivos: {
      type: [Number, String],
      default: 0
    },
    usuariosProlipa: {
      type: [Number, String],
      default: 0
    },
    cantFormsSolicitudes: {
      type: [Number, String],
      default: 0
    },
    cantFormsDocente: {
      type: [Number, String],
      default: 0
    },
    c_preg0: {
      type: [Number, String],
      default: 0
    },
    c_preg1: {
      type: [Number, String],
      default: 0
    },
    c_preg2: {
      type: [Number, String],
      default: 0
    },
    c_preg3: {
      type: [Number, String],
      default: 0
    },
    c_preg4: {
      type: [Number, String],
      default: 0
    },
    c_juegos0: {
      type: [Array, Number],
      default: function() {
        return []
      }
    }
  }
}
</script>

<style scoped>
.dashboard-admin {
  margin-bottom: 1.5rem;
}

.dashboard-admin__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #24292f;
}

.dashboard-admin__topbar {
  margin-bottom: 1rem;
}

.dashboard-admin__subtitle {
  margin: 0;
  margin-top: 0.2rem;
  font-size: 0.88rem;
  color: #6b7280;
}

.dashboard-admin__grid {
  display: grid;
  grid-template-columns: repeat(1, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.kpi-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.85rem;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
  display: grid;
  grid-template-rows: auto auto auto 1fr;
  min-height: 155px;
}

.kpi-card__header {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.kpi-card__icon {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 14px;
}

.kpi-card__icon--primary {
  background: #046AE7;
}

.kpi-card__icon--success {
  background: #28C76F;
}

.kpi-card__icon--warning {
  background: #FF9F43;
}

.kpi-card__label {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 600;
}

.kpi-card__value {
  margin-top: 0.45rem;
  font-size: 1.65rem;
  line-height: 1;
  font-weight: 700;
  color: #1f2937;
  text-align: center;
}

.kpi-card__meta {
  margin: 0.3rem 0 0.5rem 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.kpi-card__table {
  margin-top: 0.35rem;
  display: grid;
  gap: 0.15rem;
}

.kpi-card__row {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 0.6rem;
  padding: 0.1rem 0;
}

.kpi-card__row span {
  font-size: 0.84rem;
  color: #4b5563;
}

.kpi-card__row b {
  font-size: 0.86rem;
  color: #1f2937;
}

.kpi-card__action {
  align-self: end;
}

.dashboard-admin__revision-wrap {
  margin-top: 1rem;
}

.module-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.85rem;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
}

.module-card--half {
  width: 100%;
}

.module-card__head {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  margin-bottom: 0.55rem;
}

.module-card__head h5 {
  margin: 0;
  font-size: 0.98rem;
  font-weight: 600;
  color: #374151;
}

@media (min-width: 768px) {
  .dashboard-admin__grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (min-width: 1200px) {
  .dashboard-admin__grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
</style>
