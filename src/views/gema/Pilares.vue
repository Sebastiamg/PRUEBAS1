<template>
  <div>
    <div class="gema-toolbar">
      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="filtro" class="gema-input" type="text" placeholder="Buscar pilar u objetivo..." />
      </div>

      <label class="gema-row gema-inactivos">
        <input v-model="verInactivos" type="checkbox" />
        <span class="gema-muted">Ver inactivos</span>
      </label>

      <div class="gema-spacer"></div>

      <button v-if="puedeCrear" class="gema-btn is-primary" type="button" @click="nuevoPilar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14" /></svg>
        Nuevo pilar
      </button>
    </div>

    <div v-if="cargando" class="gema-card gema-empty">Cargando...</div>

    <div v-else-if="!pilaresVisibles.length" class="gema-card gema-empty">
      <div class="gema-empty-title">No hay pilares</div>
      Los pilares son el primer nivel de la matriz: GENTE, CLIENTE, FINANCIERO, EFICIENCIA.
    </div>

    <!-- Un bloque por pilar, con sus objetivos anidados: es la jerarquia real -->
    <div v-else class="gema-pil-lista">
      <section v-for="pilar in pilaresVisibles" :key="pilar.pilar_id" class="gema-card" :class="{ 'is-off': !pilar.estado }">
        <header class="gema-card-head">
          <div class="gema-row gema-pil-cab">
            <span class="gema-pil-marca" :style="{ background: pilar.color }"></span>
            <span class="gema-h2">{{ pilar.nombre }}</span>
            <span v-if="!pilar.estado" class="gema-chip is-gris">Inactivo</span>
            <span class="gema-faint gema-pil-conteo">
              {{ pilar.objetivos_count }} objetivos · {{ pilar.metas_count }} metas · {{ pilar.kpis_count }} KPIs
            </span>
          </div>

          <div class="gema-row">
            <button v-if="puedeCrear" class="gema-btn is-sm" type="button" @click="nuevoObjetivo(pilar)">
              Agregar objetivo
            </button>
            <button v-if="puedeEditar" class="gema-btn is-sm is-icon" type="button" title="Editar pilar" @click="editarPilar(pilar)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 20h4L20 8l-4-4L4 16v4z" />
              </svg>
            </button>
            <button v-if="puedeEliminar" class="gema-btn is-sm is-icon is-danger" type="button" title="Eliminar pilar" @click="eliminarPilar(pilar)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                <path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" />
              </svg>
            </button>
          </div>
        </header>

        <p v-if="pilar.descripcion" class="gema-pil-desc">{{ pilar.descripcion }}</p>

        <div v-if="objetivosDe(pilar).length" class="gema-table-scroll">
          <table class="gema-table">
            <thead>
              <tr>
                <th>Objetivo</th>
                <th style="width: 70px">Orden</th>
                <th style="width: 80px">Estado</th>
                <th class="is-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="o in objetivosDe(pilar)" :key="o.objetivo_id" :class="{ 'is-inactive': !o.estado }">
                <td class="is-wrap">{{ o.descripcion }}</td>
                <td class="gema-num gema-faint">{{ o.orden }}</td>
                <td>
                  <span class="gema-chip" :class="o.estado ? 'is-verde' : 'is-gris'">
                    {{ o.estado ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="is-actions">
                  <div class="gema-row gema-row-actions">
                    <button v-if="puedeEditar" class="gema-btn is-sm is-icon" type="button" title="Editar" @click="editarObjetivo(o)">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                        <path d="M4 20h4L20 8l-4-4L4 16v4z" />
                      </svg>
                    </button>
                    <button v-if="puedeEliminar" class="gema-btn is-sm is-icon is-danger" type="button" title="Eliminar" @click="eliminarObjetivo(o)">
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

        <div v-else class="gema-empty gema-pil-vacio">Este pilar aun no tiene objetivos.</div>
      </section>
    </div>

    <!-- ===================== PANEL PILAR ===================== -->
    <gema-panel
      :abierto="panelPilar"
      :titulo="formPilar.pilar_id ? 'Editar pilar' : 'Nuevo pilar'"
      @cerrar="panelPilar = false"
    >
      <div class="gema-field">
        <label class="gema-label">Nombre *</label>
        <input v-model.trim="formPilar.nombre" class="gema-input" :class="{ 'is-error': errores.nombre }" type="text" placeholder="Ej: EFICIENCIA" />
        <span v-if="errores.nombre" class="gema-error-text">{{ errores.nombre }}</span>
      </div>

      <div class="gema-field">
        <label class="gema-label">Descripcion</label>
        <textarea v-model.trim="formPilar.descripcion" class="gema-textarea" placeholder="Que persigue este pilar"></textarea>
      </div>

      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Color</label>
          <div class="gema-row">
            <input v-model="formPilar.color" class="gema-color" type="color" />
            <input v-model.trim="formPilar.color" class="gema-input" type="text" maxlength="7" />
          </div>
        </div>

        <div class="gema-field">
          <label class="gema-label">Orden</label>
          <input v-model.number="formPilar.orden" class="gema-input" type="number" min="0" />
        </div>
      </div>

      <label class="gema-row">
        <input v-model="formPilar.estado" type="checkbox" />
        <span>Activo</span>
      </label>

      <template #pie>
        <button class="gema-btn" type="button" @click="panelPilar = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardarPilar">
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </gema-panel>

    <!-- ===================== PANEL OBJETIVO ===================== -->
    <gema-panel
      :abierto="panelObjetivo"
      :titulo="formObjetivo.objetivo_id ? 'Editar objetivo' : 'Nuevo objetivo'"
      :subtitulo="nombrePilar(formObjetivo.pilar_id)"
      @cerrar="panelObjetivo = false"
    >
      <div class="gema-field">
        <label class="gema-label">Pilar *</label>
        <select v-model.number="formObjetivo.pilar_id" class="gema-select">
          <option v-for="p in pilares" :key="p.pilar_id" :value="p.pilar_id">{{ p.nombre }}</option>
        </select>
      </div>

      <div class="gema-field">
        <label class="gema-label">Descripcion del objetivo *</label>
        <textarea
          v-model.trim="formObjetivo.descripcion"
          class="gema-textarea"
          :class="{ 'is-error': errores.descripcion }"
          rows="4"
          placeholder="Ej: Optimizar e integrar nuestros procesos mediante soluciones que maximicen nuestra capacidad."
        ></textarea>
        <span v-if="errores.descripcion" class="gema-error-text">{{ errores.descripcion }}</span>
      </div>

      <div class="gema-grid-2">
        <div class="gema-field">
          <label class="gema-label">Orden</label>
          <input v-model.number="formObjetivo.orden" class="gema-input" type="number" min="0" />
        </div>

        <label class="gema-row gema-check-abajo">
          <input v-model="formObjetivo.estado" type="checkbox" />
          <span>Activo</span>
        </label>
      </div>

      <template #pie>
        <button class="gema-btn" type="button" @click="panelObjetivo = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="guardando" @click="guardarObjetivo">
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
  name: 'GemaPilares',

  components: { GemaPanel },

  data () {
    return {
      cargando: true,
      guardando: false,
      filtro: '',
      verInactivos: false,
      pilares: [],
      objetivos: [],
      panelPilar: false,
      panelObjetivo: false,
      formPilar: this.pilarVacio(),
      formObjetivo: this.objetivoVacio(),
      errores: {}
    }
  },

  computed: {
    puedeCrear () { return sesion.puede('param_pilares', 'crear') },
    puedeEditar () { return sesion.puede('param_pilares', 'editar') },
    puedeEliminar () { return sesion.puede('param_pilares', 'eliminar') },

    pilaresVisibles () {
      const texto = this.filtro.trim().toLowerCase()

      return this.pilares.filter((p) => {
        if (!this.verInactivos && !p.estado) return false
        if (!texto) return true

        if (p.nombre.toLowerCase().includes(texto)) return true

        // Tambien coincide si alguno de sus objetivos coincide.
        return this.objetivos.some(
          (o) => o.pilar_id === p.pilar_id && (o.descripcion || '').toLowerCase().includes(texto)
        )
      })
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    pilarVacio () {
      return { pilar_id: null, nombre: '', descripcion: '', color: '#4b5563', orden: null, estado: true }
    },

    objetivoVacio (pilarId = null) {
      return { objetivo_id: null, pilar_id: pilarId, descripcion: '', orden: null, estado: true }
    },

    async cargar () {
      this.cargando = true

      try {
        const [pilares, objetivos] = await Promise.all([
          api.get('parametrizacion/pilares'),
          api.get('parametrizacion/objetivos')
        ])

        this.pilares = pilares.data
        this.objetivos = objetivos.data
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    objetivosDe (pilar) {
      return this.objetivos.filter((o) => o.pilar_id === pilar.pilar_id && (this.verInactivos || o.estado))
    },

    nombrePilar (id) {
      const p = this.pilares.find((x) => x.pilar_id === id)

      return p ? p.nombre : ''
    },

    // ----------------------------------------------------------------- pilar
    nuevoPilar () {
      this.formPilar = this.pilarVacio()
      this.errores = {}
      this.panelPilar = true
    },

    editarPilar (pilar) {
      this.formPilar = { ...pilar, estado: !!pilar.estado }
      this.errores = {}
      this.panelPilar = true
    },

    async guardarPilar () {
      this.guardando = true
      this.errores = {}

      try {
        const r = this.formPilar.pilar_id
          ? await api.put(`parametrizacion/pilares/${this.formPilar.pilar_id}`, this.formPilar)
          : await api.post('parametrizacion/pilares', this.formPilar)

        this.panelPilar = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        this.aplicarErrores(e)
      } finally {
        this.guardando = false
      }
    },

    eliminarPilar (pilar) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar pilar',
        text: `Se eliminara "${pilar.nombre}". Si tiene KPIs asociados solo se desactivara.`,
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`parametrizacion/pilares/${pilar.pilar_id}`)
            this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
            this.cargar()
          } catch (e) {
            this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
          }
        }
      })
    },

    // -------------------------------------------------------------- objetivo
    nuevoObjetivo (pilar) {
      this.formObjetivo = this.objetivoVacio(pilar.pilar_id)
      this.errores = {}
      this.panelObjetivo = true
    },

    editarObjetivo (objetivo) {
      this.formObjetivo = { ...objetivo, estado: !!objetivo.estado }
      this.errores = {}
      this.panelObjetivo = true
    },

    async guardarObjetivo () {
      this.guardando = true
      this.errores = {}

      try {
        const r = this.formObjetivo.objetivo_id
          ? await api.put(`parametrizacion/objetivos/${this.formObjetivo.objetivo_id}`, this.formObjetivo)
          : await api.post('parametrizacion/objetivos', this.formObjetivo)

        this.panelObjetivo = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        this.aplicarErrores(e)
      } finally {
        this.guardando = false
      }
    },

    eliminarObjetivo (objetivo) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Eliminar objetivo',
        text: 'Si tiene metas asociadas solo se desactivara.',
        acceptText: 'Eliminar',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`parametrizacion/objetivos/${objetivo.objetivo_id}`)
            this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
            this.cargar()
          } catch (e) {
            this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
          }
        }
      })
    },

    aplicarErrores (e) {
      if (e.errores) {
        Object.keys(e.errores).forEach((campo) => {
          this.errores[campo] = e.errores[campo][0]
        })
        this.errores = { ...this.errores }
      }

      this.$vs.notify({ title: 'No se pudo guardar', text: e.message, color: 'danger' })
    }
  }
}
</script>

<style lang="scss" scoped>
.gema-inactivos { font-size: var(--gema-fs-sm); cursor: pointer; }
.gema-pil-lista { display: flex; flex-direction: column; gap: var(--gema-u3); }
.gema-card.is-off { opacity: 0.65; }
.gema-pil-cab { min-width: 0; }
.gema-pil-marca { width: 3px; height: 14px; border-radius: 2px; flex: none; }
.gema-pil-conteo { font-size: var(--gema-fs-xs); white-space: nowrap; }

.gema-pil-desc {
  margin: 0;
  padding: var(--gema-u2) var(--gema-u3);
  font-size: var(--gema-fs-sm);
  line-height: 1.45;
  color: var(--gema-text-2);
  border-bottom: 1px solid var(--gema-border);
}

.gema-pil-vacio { padding: var(--gema-u4) var(--gema-u3); font-size: var(--gema-fs-sm); }

.gema-color {
  width: 30px;
  height: 30px;
  padding: 2px;
  background: var(--gema-surface);
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius);
  cursor: pointer;
  flex: none;
}

.gema-check-abajo { align-self: end; height: 30px; }
</style>
