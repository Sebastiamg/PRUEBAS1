<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="filtro" class="gema-input" type="text" placeholder="Buscar KPI..." />
      </div>

      <div class="gema-spacer"></div>
      <button class="gema-btn is-sm" type="button" @click="cargar">Actualizar</button>
    </div>

    <gema-tabla
      :columnas="columnas"
      :filas="visibles"
      :cargando="cargando"
      texto-vacio="No hay valores esperando validacion"
    >
      <template #vacio>
        Cuando alguien envie un valor a validacion aparecera aqui.
      </template>

      <template #default="{ filas }">
        <tr v-for="v in filas" :key="v.kpi_valor_id">
          <td><span class="gema-chip" :class="v.kpi.nivel === 'N3' ? 'is-accent' : ''">{{ v.kpi.nivel }}</span></td>
          <td class="gema-faint">{{ v.kpi.departamento ? v.kpi.departamento.tdp_iniciales : 'GG' }}</td>
          <td class="is-wrap">{{ v.kpi.nombre }}</td>
          <td class="gema-faint gema-num">{{ v.periodo.etiqueta }}</td>
          <td class="is-num">
            <gema-indicador
              :valor="v.valor_indicador"
              :unidad="v.kpi.unidad_medida"
              :semaforo="v.semaforo"
            />
          </td>
          <td class="gema-faint gema-num">
            <template v-if="v.numerador !== null">{{ v.numerador }} / {{ v.denominador }}</template>
            <template v-else-if="v.valor_real !== null">{{ v.valor_real }}</template>
            <template v-else>—</template>
          </td>
          <td class="gema-faint gema-val-quien">
            {{ v.registrado_por ? v.registrado_por.nombres + ' ' + v.registrado_por.apellidos : '—' }}
          </td>
          <td class="is-actions">
            <div class="gema-row">
              <button class="gema-btn is-sm" type="button" @click="validar(v)">Validar</button>
              <button class="gema-btn is-sm is-danger" type="button" @click="abrirRechazo(v)">Devolver</button>
            </div>
          </td>
        </tr>
      </template>
    </gema-tabla>

    <!-- ======================= PANEL DE RECHAZO ======================= -->
    <gema-panel
      :abierto="!!rechazando"
      titulo="Devolver el valor"
      :subtitulo="rechazando ? rechazando.kpi.nombre : ''"
      @cerrar="rechazando = null"
    >
      <p class="gema-alert is-warn">
        El valor vuelve a quien lo capturo. Cuando lo corrija y lo guarde, pasara de
        nuevo a borrador y podra reenviarlo.
      </p>

      <div class="gema-field">
        <label class="gema-label">Motivo *</label>
        <textarea
          v-model.trim="comentario"
          class="gema-textarea"
          rows="4"
          placeholder="Explique que hay que corregir"
        ></textarea>
      </div>

      <template #pie>
        <button class="gema-btn" type="button" @click="rechazando = null">Cancelar</button>
        <button class="gema-btn is-danger" type="button" :disabled="!comentario || procesando" @click="rechazar">
          {{ procesando ? 'Enviando...' : 'Devolver' }}
        </button>
      </template>
    </gema-panel>

    <!-- Continuidad del proceso: en que paso va y cual sigue -->
    <gema-siguiente seccion="kpi_validacion" />
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'
import GemaIndicador from './componentes/GemaIndicador.vue'
import GemaSiguiente from './componentes/GemaSiguiente.vue'

export default {
  name: 'GemaValidacionValores',

  components: { GemaTabla, GemaPanel, GemaIndicador, GemaSiguiente },

  data () {
    return {
      cargando: true,
      procesando: false,
      filtro: '',
      valores: [],
      rechazando: null,
      comentario: '',
      columnas: [
        { clave: 'nivel', titulo: 'Nivel', ancho: '62px', valor: (v) => v.kpi.nivel },
        { clave: 'unidad', titulo: 'Und.', ancho: '58px', valor: (v) => (v.kpi.departamento ? v.kpi.departamento.tdp_iniciales : 'GG') },
        { clave: 'nombre', titulo: 'KPI', valor: (v) => v.kpi.nombre },
        { clave: 'periodo', titulo: 'Periodo', ancho: '86px', valor: (v) => v.periodo.etiqueta },
        { clave: 'indicador', titulo: 'Indicador', numerica: true, ancho: '112px', valor: (v) => v.valor_indicador },
        { clave: 'calculo', titulo: 'Calculo', numerica: true, ancho: '120px', ordenable: false },
        { clave: 'registrado', titulo: 'Capturado por', ancho: '160px', valor: (v) => (v.registrado_por ? v.registrado_por.nombres : '') },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    }
  },

  computed: {
    visibles () {
      const texto = this.filtro.trim().toLowerCase()

      if (!texto) return this.valores

      return this.valores.filter((v) => v.kpi.nombre.toLowerCase().includes(texto))
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    async cargar () {
      this.cargando = true

      try {
        const r = await api.get('valores/validacion')
        this.valores = r.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    validar (valor) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'primary',
        title: 'Validar el valor',
        text: `Al validar, "${valor.kpi.nombre}" queda en firme y se recalculan los KPIs consolidados que dependen de el.`,
        acceptText: 'Validar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.post(`valores/${valor.kpi_valor_id}/validar`)
            this.$vs.notify({ title: 'Validado', text: r.message, color: 'success' })
            this.cargar()
          } catch (e) {
            this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
          }
        }
      })
    },

    abrirRechazo (valor) {
      this.rechazando = valor
      this.comentario = ''
    },

    async rechazar () {
      this.procesando = true

      try {
        const r = await api.post(`valores/${this.rechazando.kpi_valor_id}/rechazar`, {
          observacion: this.comentario
        })

        this.rechazando = null
        this.$vs.notify({ title: 'Devuelto', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.procesando = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-val-quien { font-size: var(--gema-fs-sm); }
</style>
