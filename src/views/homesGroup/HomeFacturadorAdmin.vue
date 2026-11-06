<template>
  <div class="dashboard-admin">
    <div style="display: none;">
      <screenNotificacionVue
        :cambiarNotificacion="cambiarNotificacion"
        @ChangecantidadMensajes="changeCantidadMensajes"
      />
    </div>
    <div class="dashboard-admin__grid">
      <div class="kpi-card" @click="f_irDevoluciones">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--success"><i class="feather icon-refresh-cw"></i></div>
          <h5>Devoluciones</h5>
        </div>
        <div v-if="loadingDevoluciones" class="kpi-card__loading">Cargando...</div>
        <template v-else>
          <div class="kpi-card__value">{{ formatNumber(totalDevolucionesPendientes) }}</div>
          <p class="kpi-card__meta">Pendientes</p>
        </template>
      </div>

      <div class="kpi-card" @click="popupNotificaciones = true">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--primary"><i class="feather icon-message-square"></i></div>
          <h5>Notificaciones</h5>
        </div>
        <div class="kpi-card__value">{{ formatNumber(cantidadMensajes) }}</div>
        <p class="kpi-card__meta">Mensajes</p>
      </div>    

      <div class="kpi-card" @click="navegarYActivarMenu">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--warning"><i class="feather icon-book-open"></i></div>
          <h5>Guías</h5>
        </div>
        <div v-if="loadingGuias" class="kpi-card__loading">Cargando...</div>
        <template v-else>
          <div class="kpi-card__value">{{ formatNumber(cantidadGuias) }}</div>
          <p class="kpi-card__meta">Pendientes</p>
        </template>
      </div>

      <div class="kpi-card" @click="ActivarMenu">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--purple"><i class="feather icon-gift"></i></div>
          <h5>Obsequios</h5>
        </div>
        <div v-if="loadingObsequios" class="kpi-card__loading">Cargando...</div>
        <template v-else>
          <div class="kpi-card__value">{{ formatNumber(cantidadObsequios) }}</div>
          <p class="kpi-card__meta">Pendientes</p>
        </template>
      </div>

      <div class="kpi-card" @click="ActivarMenuLibrosObsequios">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--success"><i class="feather icon-book"></i></div>
          <h5>Libros Hijos Docentes</h5>
        </div>
        <div v-if="loadingLibros" class="kpi-card__loading">Cargando...</div>
        <template v-else>
          <div class="kpi-card__value">{{ formatNumber(cantidadObsequiosLibros) }}</div>
          <p class="kpi-card__meta">Pendientes</p>
        </template>
      </div>

      <div class="kpi-card" @click="$router.push('/p_pedidos')">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--danger"><i class="feather icon-file-text"></i></div>
          <h5>Contratos</h5>
        </div>
        <div v-if="loadingContratos" class="kpi-card__loading">Cargando...</div>
        <div v-else class="kpi-card__table">
          <template v-for="(tr, index) in datos">
            <div class="kpi-card__row kpi-card__row--danger" :key="index" v-if="tr.contratos > 0">
              <span>{{ tr.periodo }}</span>
              <b>{{ formatNumber(tr.contratos) }}</b>
            </div>
          </template>
          <div v-if="datos.filter(d => d.contratos > 0).length === 0" style="text-align: center; color: gray; font-size: 0.8rem; margin-top: 10px;">
            No hay pendientes
          </div>
        </div>
      </div>

      <div class="kpi-card" @click="$router.push('/pedidos/alcanceListado')">
        <div class="kpi-card__header">
          <div class="kpi-card__icon kpi-card__icon--warning"><i class="feather icon-layers"></i></div>
          <h5>Alcances Pendientes</h5>
        </div>
        <div v-if="loadingAlcances" class="kpi-card__loading">Cargando...</div>
        <div v-else class="kpi-card__table">
          <template v-for="(tr, index) in arrayAlcances">
            <div class="kpi-card__row kpi-card__row--warning" :key="index" v-if="tr.contadorAlcanceAbierto > 0">
              <span>{{ tr.periodoescolar }}</span>
              <b>{{ formatNumber(tr.contadorAlcanceAbierto) }}</b>
            </div>
          </template>
          <div v-if="arrayAlcances.filter(a => a.contadorAlcanceAbierto > 0).length === 0" style="text-align: center; color: gray; font-size: 0.8rem; margin-top: 10px;">
            No hay pendientes
          </div>
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

    <vs-popup
      classContent="popup-example"
      fullscreen
      title="Mensajes asesor - facturador"
      :active.sync="popupNotificaciones"
      @close="RecargarNotificaciones()"
    >
      <screenNotificacionVue :cambiarNotificacion="cambiarNotificacion" />
    </vs-popup>
  </div>
</template>

<script>
import screenNotificacionVue from '../pedidos/notificaciones/screenNotificacion.vue'
const RevisionesPendientesHome = () => import('../pedidos2/verificaciones/revision/revisionesPendientes.vue')

export default {
  name: 'HomeFacturadorAdmin',
  components: {
    screenNotificacionVue,
    RevisionesPendientesHome
  },
  data() {
    return {
      datos: [],
      cantidadMensajes: 0,
      popupNotificaciones: false,
      cambiarNotificacion: false,
      arregloGuias: [],
      arregloObsequiosPorAprobar: [],
      arregloObsequios: [],
      cantidadGuias: 0,
      cantidadObsequios: 0,
      cantidadObsequiosLibros: 0,
      arregloObsequiosLibros: [],
      arrayAlcances: [],
      totalDevolucionesPendientes: 0,
      loadingDevoluciones: false,
      loadingGuias: false,
      loadingObsequios: false,
      loadingLibros: false,
      loadingContratos: false,
      loadingAlcances: false,
    }
  },
  mounted() {
    localStorage.setItem('menuIndex', 0)
    this.getDevolucionesPendentes()
    this.loadDeferredCards()
  },
  methods: {
    loadDeferredCards() {
      let me = this
      const schedule = function(callback) {
        if (typeof window.requestIdleCallback === 'function') {
          window.requestIdleCallback(callback)
        } else {
          setTimeout(callback, 0)
        }
      }

      schedule(function() {
        me.getDatos()
        me.getGuias()
        me.getLibrosObsequios()
        me.getObsequios()
        me.getAlcancesPendientes()
      })
    },
    formatNumber(value) {
      var parsed = Number(value)
      if (isNaN(parsed)) {
        return value
      }
      return parsed.toLocaleString('es-EC')
    },
    navegarYActivarMenu() {
      localStorage.setItem('menuIndex', 1)
      this.$router.push('/p_pedidos')
    },
    ActivarMenu() {
      localStorage.setItem('menuIndex', 2)
      this.$router.push('/p_pedidos')
    },
    ActivarMenuLibrosObsequios() {
      localStorage.setItem('menuIndex', 0)
      this.$router.push('/p_pedidos')
    },
    RecargarNotificaciones() {
      this.cambiarNotificacion = !this.cambiarNotificacion
    },
    changeCantidadMensajes(e) {
      this.cantidadMensajes = e
    },
    getDatos() {
      let me = this
      me.loadingContratos = true
      this.$http.get(this.$server_url + 'pedidos?homeAdmin=yes')
        .then(function (res) {
          me.datos = res.data
          me.loadingContratos = false
        })
        .catch(function (error) {
          me.loadingContratos = false
        })
    },
    getAlcancesPendientes() {
      let me = this
      me.loadingAlcances = true
      this.$http.get(this.$server_url + 'getAlcancesPendientes')
        .then(function (res) {
          me.arrayAlcances = res.data
          me.loadingAlcances = false
        })
        .catch(function (error) {
          me.loadingAlcances = false
        })
    },
    getGuias() {
      let me = this
      me.loadingGuias = true
      this.$http.get(this.$server_url + 'get_pedidos_guias')
        .then(function (res) {
          me.arregloGuias = res.data.filter(p => (p.estado_entrega == 0) && (p.estado == 1) && (p.pedido_facturacion === 1) && (p.facturacion_vee == '1'))
          me.cantidadGuias = me.arregloGuias.length
          me.loadingGuias = false
        })
        .catch(function (error) {
          me.loadingGuias = false
        })
    },
    getLibrosObsequios() {
      let me = this
      me.loadingLibros = true
      this.$http.get(this.$server_url + 'getLibrosObsequiosGerencia')
        .then(function (res) {
          me.arregloObsequiosPorAprobar = res.data.filter(l => (l.estado_libros_obsequios == 3 || l.estado_libros_obsequios == 4) && l.estado_libros_obsequios != 1)
          me.cantidadObsequiosLibros = me.arregloObsequiosPorAprobar.length
          me.loadingLibros = false
        })
        .catch(function (error) {
          me.loadingLibros = false
        })
    },
    getDevolucionesPendentes() {
      let me = this
      me.totalDevolucionesPendientes = 0
      me.loadingDevoluciones = true
      this.$http.get(this.$server_url + 'devoluciones?filtroDocumentosDevueltos=1&revisados=1')
        .then(function (res) {
          me.totalDevolucionesPendientes = res.data.length
          me.loadingDevoluciones = false
        })
        .catch(function (error) {
          me.loadingDevoluciones = false
        })
    },
    getObsequios() {
      let me = this
      me.loadingObsequios = true
      this.$http.get(this.$server_url + 'obsequio?listadoObsequiofacturador=yes')
        .then(function (res) {
          let datos = res.data
          if (datos.length > 0) {
            me.arregloObsequiosLibros = datos.filter(p => p.pedido_facturacion == 1 && p.estado == 1)
            me.cantidadObsequios = me.arregloObsequiosLibros.length
          } else {
            me.arregloObsequios = []
          }
          me.loadingObsequios = false
        })
        .catch(function (error) {
          me.loadingObsequios = false
        })
    },
    f_irDevoluciones() {
      localStorage.menuIndex = 5
      this.$router.push('/p_pedidos')
    },
  }
}
</script>

<style scoped>
.dashboard-admin {
  margin-bottom: 1.5rem;
}

.dashboard-admin__topbar {
  margin-bottom: 1rem;
}

.dashboard-admin__title {
  margin: 0;
  font-size: 1.15rem;
  font-weight: 700;
  color: #24292f;
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
  align-items: start;
  margin-bottom: 1rem;
}

.kpi-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 0.85rem;
  box-shadow: 0 1px 2px rgba(16, 24, 40, 0.06);
  display: flex;
  flex-direction: column;
  cursor: pointer;
}

.kpi-card__header {
  display: flex;
  align-items: center;
  gap: 0.55rem;
}

.kpi-card__header h5 {
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #6b7280;
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

.kpi-card__icon--danger {
  background: #EA5455;
}

.kpi-card__icon--purple {
  background: #8B5CF6;
}

.kpi-card__value {
  margin-top: 0.45rem;
  font-size: 1.65rem;
  line-height: 1;
  font-weight: 700;
  color: #1f2937;
}

.kpi-card__meta {
  margin: 0.3rem 0 0.5rem 0;
  font-size: 0.85rem;
  color: #6b7280;
}

.kpi-card__loading {
  margin-top: 0.55rem;
  color: #6b7280;
  font-size: 0.86rem;
  font-weight: 600;
}

.kpi-card__table {
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  width: 100%;
}

.kpi-card__row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0.6rem;
  background: #f8fafc;
  border: 1px solid #f1f5f9;
  border-radius: 6px;
  width: 100%;
}

.kpi-card__row span {
  font-size: 0.82rem;
  color: #475569;
  font-weight: 500;
}

.kpi-card__row b {
  font-size: 0.75rem;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  font-weight: 700;
  background: #e2e8f0;
  color: #334155;
}

.kpi-card__row--danger b {
  background: #fee2e2;
  color: #dc2626;
}

.kpi-card__row--warning b {
  background: #ffedd5;
  color: #ea580c;
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
