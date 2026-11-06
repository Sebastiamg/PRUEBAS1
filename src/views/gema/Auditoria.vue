<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="accion" class="gema-input" type="text" placeholder="Accion (ej: valor_validar)" @keyup.enter="buscar" />
      </div>

      <select v-model.number="idusuario" class="gema-select gema-aud-colaborador" @change="buscar">
        <option :value="null">Todo colaborador</option>
        <option v-for="p in personas" :key="p.idusuario" :value="p.idusuario">{{ p.nombre_completo }}</option>
      </select>

      <input v-model="desde" class="gema-input gema-aud-fecha" type="date" />
      <span class="gema-faint">a</span>
      <input v-model="hasta" class="gema-input gema-aud-fecha" type="date" />

      <div class="gema-toolbar-sep"></div>

      <label class="gema-row gema-aud-check">
        <input v-model="soloImpersonadas" type="checkbox" />
        <span class="gema-muted">Solo suplantaciones</span>
      </label>

      <div class="gema-spacer"></div>
      <button class="gema-btn is-primary is-sm" type="button" @click="buscar">Buscar</button>
    </div>

    <gema-tabla
      :columnas="columnas"
      :filas="registros"
      :cargando="cargando"
      texto-vacio="No hay registros con esos filtros"
    >
      <template #default="{ filas }">
        <tr v-for="r in filas" :key="r.auditoria_id" @click="seleccionado = r">
          <td class="gema-num gema-faint">{{ formatoFechaHora(r.created_at) }}</td>
          <td><span class="gema-chip">{{ r.accion }}</span></td>
          <td>{{ r.usuario_nombre || '—' }}</td>
          <td>
            <span v-if="r.actor_real_nombre" class="gema-chip is-ambar" title="Accion ejecutada suplantando">
              {{ r.actor_real_nombre }}
            </span>
            <span v-else class="gema-faint">—</span>
          </td>
          <td class="gema-faint">{{ r.entidad || '—' }}</td>
          <td class="gema-num gema-faint">{{ r.entidad_id || '—' }}</td>
          <td class="gema-num gema-faint">{{ r.ip || '—' }}</td>
        </tr>
      </template>

      <template #pie>
        <div class="gema-row">
          <button class="gema-btn is-sm" type="button" :disabled="pagina <= 1" @click="irA(pagina - 1)">Anterior</button>
          <span class="gema-faint">Pagina {{ pagina }} de {{ ultimaPagina }} · {{ total }} registros</span>
          <button class="gema-btn is-sm" type="button" :disabled="pagina >= ultimaPagina" @click="irA(pagina + 1)">Siguiente</button>
        </div>
      </template>
    </gema-tabla>

    <!-- Detalle: el antes y el despues de la accion -->
    <gema-panel
      :abierto="!!seleccionado"
      :titulo="seleccionado ? seleccionado.accion : ''"
      :subtitulo="seleccionado ? formatoFechaHora(seleccionado.created_at) : ''"
      ancho
      @cerrar="seleccionado = null"
    >
      <template v-if="seleccionado">
        <dl class="gema-kv">
          <dt>Usuario</dt><dd>{{ seleccionado.usuario_nombre || '—' }}</dd>
          <dt v-if="seleccionado.actor_real_nombre">Ejecutado por</dt>
          <dd v-if="seleccionado.actor_real_nombre">{{ seleccionado.actor_real_nombre }} (suplantando)</dd>
          <dt>Entidad</dt><dd>{{ seleccionado.entidad || '—' }} {{ seleccionado.entidad_id || '' }}</dd>
          <dt>IP</dt><dd class="gema-num">{{ seleccionado.ip || '—' }}</dd>
        </dl>

        <div v-if="seleccionado.datos_antes">
          <span class="gema-eyebrow">Antes</span>
          <pre class="gema-aud-json">{{ formatoJson(seleccionado.datos_antes) }}</pre>
        </div>

        <div v-if="seleccionado.datos_despues">
          <span class="gema-eyebrow">Despues</span>
          <pre class="gema-aud-json">{{ formatoJson(seleccionado.datos_despues) }}</pre>
        </div>
      </template>

      <template #pie>
        <button class="gema-btn" type="button" @click="seleccionado = null">Cerrar</button>
      </template>
    </gema-panel>
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'

export default {
  name: 'GemaAuditoria',

  components: { GemaTabla, GemaPanel },

  data () {
    return {
      cargando: true,
      accion: '',
      idusuario: null,
      desde: '',
      hasta: '',
      soloImpersonadas: false,
      registros: [],
      personas: [],
      seleccionado: null,
      pagina: 1,
      ultimaPagina: 1,
      total: 0,
      columnas: [
        { clave: 'created_at', titulo: 'Fecha y hora', ancho: '150px' },
        { clave: 'accion', titulo: 'Accion', ancho: '190px' },
        { clave: 'usuario_nombre', titulo: 'Usuario', ancho: '200px' },
        { clave: 'actor_real_nombre', titulo: 'Suplantado por', ancho: '200px' },
        { clave: 'entidad', titulo: 'Entidad', ancho: '160px' },
        { clave: 'entidad_id', titulo: 'Id', numerica: true, ancho: '70px' },
        { clave: 'ip', titulo: 'IP', ancho: '120px' }
      ]
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    async cargar () {
      this.cargando = true

      try {
        const r = await api.get('admin/auditoria', {
          accion: this.accion || undefined,
          idusuario: this.idusuario || undefined,
          desde: this.desde || undefined,
          hasta: this.hasta || undefined,
          solo_impersonadas: this.soloImpersonadas ? 1 : undefined,
          page: this.pagina,
          per_page: 50
        })

        this.registros = r.data
        this.total = r.total
        this.ultimaPagina = r.last_page
        // Solo viene en la pagina 1 (ver el backend), para no mandarla en cada busqueda.
        if (r.personas) this.personas = r.personas
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    buscar () {
      this.pagina = 1
      this.cargar()
    },

    irA (pagina) {
      this.pagina = pagina
      this.cargar()
    },

    formatoFechaHora (valor) {
      if (!valor) return '—'

      const d = new Date(valor)

      return d.toLocaleString('es-EC', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      })
    },

    formatoJson (valor) {
      try {
        return JSON.stringify(typeof valor === 'string' ? JSON.parse(valor) : valor, null, 2)
      } catch (e) {
        return String(valor)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-aud-fecha { width: 132px; }
.gema-aud-colaborador { width: 220px; }
.gema-aud-check { font-size: var(--gema-fs-sm); cursor: pointer; }

.gema-aud-json {
  margin: 3px 0 0;
  padding: var(--gema-u2);
  max-height: 240px;
  overflow: auto;
  font-family: ui-monospace, "SF Mono", Menlo, monospace;
  font-size: var(--gema-fs-xs);
  line-height: 1.5;
  color: var(--gema-text-2);
  background: var(--gema-surface-2);
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius);
  white-space: pre;
}
</style>
