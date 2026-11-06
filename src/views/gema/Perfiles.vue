<template>
  <div>
    <div class="gema-toolbar">
      <span class="gema-muted">
        Cada perfil decide que secciones ve y que puede hacer en cada una.
      </span>

      <div class="gema-spacer"></div>

      <button v-if="puedeCrear" class="gema-btn is-primary" type="button" @click="nuevo">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
        Nuevo perfil
      </button>
    </div>

    <div v-if="cargando" class="gema-card gema-empty">Cargando...</div>

    <template v-else>
      <!-- Lista de perfiles -->
      <div class="gema-table-wrap gema-perf-lista">
        <table class="gema-table">
          <thead>
            <tr>
              <th style="width: 140px">Codigo</th>
              <th style="width: 180px">Nombre</th>
              <th>Descripcion</th>
              <th class="is-num" style="width: 84px">Usuarios</th>
              <th style="width: 90px">Estado</th>
              <th class="is-actions">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="p in perfiles"
              :key="p.perfil_id"
              :class="{ 'is-selected': seleccionado && seleccionado.perfil_id === p.perfil_id, 'is-inactive': !p.estado }"
              @click="seleccionar(p)"
            >
              <td class="gema-perf-codigo">{{ p.codigo }}</td>
              <td>
                {{ p.nombre }}
                <span v-if="p.es_root" class="gema-chip is-accent">root</span>
              </td>
              <td class="is-wrap gema-faint gema-perf-desc">{{ p.descripcion || '—' }}</td>
              <td class="is-num">{{ p.usuarios_count }}</td>
              <td>
                <span class="gema-chip" :class="p.estado ? 'is-verde' : 'is-gris'">
                  {{ p.estado ? 'Activo' : 'Inactivo' }}
                </span>
              </td>
              <td class="is-actions">
                <div class="gema-row gema-row-actions">
                  <button v-if="puedeEditar && !p.es_root" class="gema-btn is-sm is-icon" type="button" title="Editar" @click.stop="editar(p)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M4 20h4L20 8l-4-4L4 16v4z" />
                    </svg>
                  </button>
                  <button v-if="puedeEliminar && !p.es_root" class="gema-btn is-sm is-icon is-danger" type="button" title="Eliminar" @click.stop="eliminar(p)">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                      <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Matriz de permisos del perfil seleccionado -->
      <section v-if="seleccionado" class="gema-card">
        <header class="gema-card-head">
          <div class="gema-row">
            <span class="gema-h2">Permisos de {{ seleccionado.nombre }}</span>
            <span v-if="seleccionado.es_root" class="gema-chip is-accent">acceso total</span>
            <span v-else-if="sucio" class="gema-chip is-ambar">sin guardar</span>
          </div>

          <button
            v-if="puedeEditar && !seleccionado.es_root"
            class="gema-btn is-primary is-sm"
            type="button"
            :disabled="!sucio || guardando"
            @click="guardarMatriz"
          >
            {{ guardando ? 'Guardando...' : 'Guardar permisos' }}
          </button>
        </header>

        <p v-if="seleccionado.es_root" class="gema-alert gema-perf-nota">
          El perfil root tiene todos los permisos por definicion; su matriz no se edita.
          Esa condicion se administra en la base de datos para que no se pueda escalar
          privilegios desde la interfaz.
        </p>

        <div class="gema-table-scroll">
          <table class="gema-table">
            <thead>
              <tr>
                <th style="width: 130px">Grupo</th>
                <th>Seccion</th>
                <th v-for="a in ACCIONES" :key="a" style="width: 84px" class="gema-perf-acc">{{ a }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="s in secciones" :key="s.codigo">
                <td class="gema-faint">{{ s.grupo }}</td>
                <td>{{ s.nombre }}</td>
                <td v-for="a in ACCIONES" :key="a" class="gema-perf-acc">
                  <input
                    type="checkbox"
                    :checked="matriz[s.codigo] && matriz[s.codigo][a]"
                    :disabled="seleccionado.es_root || !puedeEditar"
                    @change="alternar(s.codigo, a)"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="gema-table-foot">
          <span>Sin el permiso "ver" el resto no tiene efecto: la seccion no aparece en el menu.</span>
        </div>
      </section>
    </template>

    <gema-panel
      :abierto="panel"
      :titulo="form.perfil_id ? 'Editar perfil' : 'Nuevo perfil'"
      @cerrar="panel = false"
    >
      <div class="gema-field">
        <label class="gema-label">Codigo *</label>
        <input v-model.trim="form.codigo" class="gema-input" :class="{ 'is-error': errores.codigo }" type="text" placeholder="ej: coordinador" />
        <span v-if="errores.codigo" class="gema-error-text">{{ errores.codigo }}</span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Nombre *</label>
        <input v-model.trim="form.nombre" class="gema-input" :class="{ 'is-error': errores.nombre }" type="text" />
        <span v-if="errores.nombre" class="gema-error-text">{{ errores.nombre }}</span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Descripcion</label>
        <textarea v-model.trim="form.descripcion" class="gema-textarea" rows="2"></textarea>
      </div>

      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Orden</label>
          <input v-model.number="form.orden" class="gema-input" type="number" min="0" />
        </div>

        <label class="gema-row gema-check-abajo">
          <input v-model="form.estado" type="checkbox" />
          <span>Activo</span>
        </label>
      </div>

      <p class="gema-alert">
        Despues de crearlo, seleccionelo en la lista para definir sus permisos.
      </p>

      <template #pie>
        <button class="gema-btn" type="button" @click="panel = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardar">
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </gema-panel>
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaPanel from './componentes/GemaPanel.vue'

export default {
  name: 'GemaPerfiles',

  components: { GemaPanel },

  data () {
    return {
      ACCIONES: ['ver', 'crear', 'editar', 'eliminar'],
      cargando: true,
      guardando: false,
      perfiles: [],
      secciones: [],
      seleccionado: null,
      matriz: {},
      matrizOriginal: '',
      panel: false,
      form: this.vacio(),
      errores: {}
    }
  },

  computed: {
    puedeCrear () { return sesion.puede('admin_perfiles', 'crear') },
    puedeEditar () { return sesion.puede('admin_perfiles', 'editar') },
    puedeEliminar () { return sesion.puede('admin_perfiles', 'eliminar') },

    /** Compara contra la copia original para saber si hay cambios pendientes. */
    sucio () {
      return JSON.stringify(this.matriz) !== this.matrizOriginal
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    vacio () {
      return { perfil_id: null, codigo: '', nombre: '', descripcion: '', orden: null, estado: true }
    },

    async cargar () {
      this.cargando = true

      try {
        const [perfiles, secciones] = await Promise.all([
          api.get('admin/perfiles'),
          api.get('admin/secciones')
        ])

        this.perfiles = perfiles.data
        this.secciones = secciones.data.secciones
        this.ACCIONES = secciones.data.acciones

        // Se mantiene la seleccion tras recargar.
        if (this.seleccionado) {
          const vigente = this.perfiles.find((p) => p.perfil_id === this.seleccionado.perfil_id)
          this.seleccionar(vigente || this.perfiles[0])
        } else if (this.perfiles.length) {
          this.seleccionar(this.perfiles[0])
        }
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    seleccionar (perfil) {
      if (!perfil) return

      if (this.sucio && this.seleccionado && this.seleccionado.perfil_id !== perfil.perfil_id) {
        this.$vs.notify({
          title: 'Cambios sin guardar',
          text: 'Guarde o descarte los permisos antes de cambiar de perfil.',
          color: 'warning'
        })
        return
      }

      this.seleccionado = perfil
      this.matriz = JSON.parse(JSON.stringify(perfil.matriz || {}))
      this.matrizOriginal = JSON.stringify(this.matriz)
    },

    alternar (seccion, accion) {
      const fila = { ...(this.matriz[seccion] || {}) }
      fila[accion] = !fila[accion]

      // Quitar "ver" apaga el resto: dar permiso de crear sin poder ver la
      // seccion seria un permiso muerto.
      if (accion === 'ver' && !fila.ver) {
        fila.crear = false
        fila.editar = false
        fila.eliminar = false
      }

      // Marcar cualquier otra accion implica poder ver.
      if (accion !== 'ver' && fila[accion]) {
        fila.ver = true
      }

      this.matriz = { ...this.matriz, [seccion]: fila }
    },

    async guardarMatriz () {
      this.guardando = true

      try {
        const r = await api.put(`admin/perfiles/${this.seleccionado.perfil_id}/permisos`, {
          matriz: this.matriz
        })

        this.matrizOriginal = JSON.stringify(this.matriz)
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    },

    nuevo () {
      this.form = this.vacio()
      this.errores = {}
      this.panel = true
    },

    editar (perfil) {
      this.form = {
        perfil_id: perfil.perfil_id,
        codigo: perfil.codigo,
        nombre: perfil.nombre,
        descripcion: perfil.descripcion || '',
        orden: perfil.orden,
        estado: !!perfil.estado
      }
      this.errores = {}
      this.panel = true
    },

    async guardar () {
      this.guardando = true
      this.errores = {}

      try {
        const r = this.form.perfil_id
          ? await api.put(`admin/perfiles/${this.form.perfil_id}`, this.form)
          : await api.post('admin/perfiles', this.form)

        this.panel = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        if (e.errores) {
          const errores = {}
          Object.keys(e.errores).forEach((campo) => { errores[campo] = e.errores[campo][0] })
          this.errores = errores
        }
        this.$vs.notify({ title: 'No se pudo guardar', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    },

    eliminar (perfil) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar perfil',
        text: `Se eliminara "${perfil.nombre}". Solo se puede si no tiene usuarios asignados.`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`admin/perfiles/${perfil.perfil_id}`)
            this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })

            if (this.seleccionado && this.seleccionado.perfil_id === perfil.perfil_id) {
              this.seleccionado = null
              this.matriz = {}
              this.matrizOriginal = '{}'
            }

            this.cargar()
          } catch (e) {
            this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-perf-lista { margin-bottom: var(--gema-u3); }
.gema-perf-codigo { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: var(--gema-fs-sm); color: var(--gema-text-2); }
.gema-perf-desc { font-size: var(--gema-fs-sm); }
.gema-perf-acc { text-align: center !important; }
.gema-perf-nota { margin: var(--gema-u3); }
.gema-check-abajo { align-self: end; height: 30px; }
</style>
