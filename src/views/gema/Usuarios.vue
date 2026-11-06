<template>
  <div>
    <div class="gema-tiles">
      <div class="gema-tile">
        <div class="gema-tile-label">Elegibles</div>
        <div class="gema-tile-value">{{ usuarios.length }}</div>
        <div class="gema-tile-note">personal Prolipa activo del grupo 36</div>
      </div>
      <div class="gema-tile" :class="{ 'is-alerta': sinPerfil > 0 }">
        <div class="gema-tile-label">Sin perfil</div>
        <div class="gema-tile-value">{{ sinPerfil }}</div>
        <div class="gema-tile-note">no pueden entrar al modulo</div>
      </div>
      <div class="gema-tile">
        <div class="gema-tile-label">Con acceso</div>
        <div class="gema-tile-value">{{ usuarios.length - sinPerfil }}</div>
      </div>
    </div>

    <div class="gema-toolbar">
      <div class="gema-search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" />
        </svg>
        <input v-model="filtro" class="gema-input" type="text" placeholder="Nombre o cedula..." />
      </div>

      <select v-model="tdpFiltro" class="gema-select gema-usr-filtro">
        <option :value="null">Todas las unidades</option>
        <option v-for="d in departamentos" :key="d.tdp_id" :value="d.tdp_id">{{ d.tdp_nombre }}</option>
      </select>

      <select v-model="perfilFiltro" class="gema-select gema-usr-filtro">
        <option :value="null">Todos los perfiles</option>
        <option value="sin">Sin perfil</option>
        <option v-for="p in perfiles" :key="p.perfil_id" :value="p.perfil_id">{{ p.nombre }}</option>
      </select>

      <div class="gema-spacer"></div>
      <button class="gema-btn is-sm" type="button" @click="cargar">Actualizar</button>
    </div>

    <p class="gema-alert gema-usr-ayuda">
      Solo aparecen aqui los colaboradores marcados como usuario Prolipa, activos y
      con el grupo 36 (Talento Humano) entre sus grupos. Quien no cumpla esas tres
      condiciones no puede acceder al modulo, tenga perfil o no.
    </p>

    <gema-tabla
      :columnas="columnas"
      :filas="visibles"
      :cargando="cargando"
      orden-inicial="nombre"
      texto-vacio="No hay colaboradores con esos filtros"
    >
      <template #default="{ filas }">
        <tr v-for="u in filas" :key="u.idusuario" :class="{ 'is-inactive': !u.perfil_id }">
          <td class="gema-num gema-faint">{{ u.cedula }}</td>
          <td>{{ u.nombres }} {{ u.apellidos }}</td>
          <td class="gema-faint">{{ u.departamento || '—' }}</td>
          <td>
            <span v-if="u.jefe_departamento === '1'" class="gema-chip">Jefe</span>
          </td>
          <td>
            <span v-if="u.perfil_id" class="gema-chip" :class="u.es_root ? 'is-accent' : 'is-verde'">
              {{ u.perfil_nombre }}
            </span>
            <span v-else class="gema-chip is-gris">Sin acceso</span>
          </td>
          <td class="gema-faint">
            {{ u.alcance_tdp_id ? nombreUnidad(u.alcance_tdp_id) : (u.perfil_id ? 'Todas' : '—') }}
          </td>
          <td class="is-actions">
            <div class="gema-row gema-row-actions">
              <button v-if="puedeEditar" class="gema-btn is-sm" type="button" @click="abrir(u)">
                {{ u.perfil_id ? 'Cambiar' : 'Dar acceso' }}
              </button>
              <button
                v-if="puedeEliminar && u.perfil_id"
                class="gema-btn is-sm is-icon is-danger"
                type="button"
                title="Quitar acceso"
                @click="revocar(u)"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" />
                </svg>
              </button>
            </div>
          </td>
        </tr>
      </template>
    </gema-tabla>

    <gema-panel
      :abierto="panel"
      titulo="Perfil de acceso"
      :subtitulo="elegido ? elegido.nombres + ' ' + elegido.apellidos : ''"
      @cerrar="panel = false"
    >
      <dl v-if="elegido" class="gema-kv">
        <dt>Cedula</dt><dd class="gema-num">{{ elegido.cedula }}</dd>
        <dt>Unidad</dt><dd>{{ elegido.departamento || 'Sin unidad' }}</dd>
        <dt>Correo</dt><dd>{{ elegido.email || '—' }}</dd>
      </dl>

      <div class="gema-field">
        <label class="gema-label">Perfil *</label>
        <select v-model.number="form.perfil_id" class="gema-select">
          <option :value="null" disabled>Seleccione...</option>
          <option v-for="p in perfiles" :key="p.perfil_id" :value="p.perfil_id">
            {{ p.nombre }}<template v-if="p.es_root"> (acceso total)</template>
          </option>
        </select>
      </div>

      <div class="gema-field">
        <label class="gema-label">Alcance</label>
        <select v-model.number="form.alcance_tdp_id" class="gema-select">
          <option :value="null">Todas las unidades</option>
          <option v-for="d in departamentos" :key="d.tdp_id" :value="d.tdp_id">{{ d.tdp_nombre }}</option>
        </select>
        <span class="gema-faint gema-usr-pista">
          Limita lo que ve y valida a una sola unidad. Dejelo en "todas" para gerencia
          y para quien deba ver la organizacion completa.
        </span>
      </div>

      <p v-if="perfilElegidoEsRoot" class="gema-alert is-warn">
        El perfil root tiene acceso total y puede ver el modulo como cualquier otro
        colaborador. Asignelo solo a quien administre el sistema.
      </p>

      <template #pie>
        <button class="gema-btn" type="button" @click="panel = false">Cancelar</button>
        <button class="gema-btn is-primary" type="button" :disabled="!form.perfil_id || guardando" @click="guardar">
          {{ guardando ? 'Guardando...' : 'Guardar' }}
        </button>
      </template>
    </gema-panel>
  </div>
</template>

<script>
import api from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'
import GemaTabla from './componentes/GemaTabla.vue'
import GemaPanel from './componentes/GemaPanel.vue'

export default {
  name: 'GemaUsuarios',

  components: { GemaTabla, GemaPanel },

  data () {
    return {
      cargando: true,
      guardando: false,
      filtro: '',
      tdpFiltro: null,
      perfilFiltro: null,
      usuarios: [],
      departamentos: [],
      perfiles: [],
      panel: false,
      elegido: null,
      form: { idusuario: null, perfil_id: null, alcance_tdp_id: null },
      columnas: [
        { clave: 'cedula', titulo: 'Cedula', ancho: '112px' },
        { clave: 'nombre', titulo: 'Colaborador', valor: (u) => `${u.nombres} ${u.apellidos}` },
        { clave: 'departamento', titulo: 'Unidad', ancho: '170px' },
        { clave: 'jefe', titulo: '', ancho: '58px', ordenable: false },
        { clave: 'perfil_nombre', titulo: 'Perfil', ancho: '150px' },
        { clave: 'alcance', titulo: 'Alcance', ancho: '150px', valor: (u) => u.alcance_tdp_id },
        { clave: 'acciones', titulo: 'Acciones', acciones: true }
      ]
    }
  },

  computed: {
    puedeEditar () { return sesion.puede('admin_usuarios', 'editar') },
    puedeEliminar () { return sesion.puede('admin_usuarios', 'eliminar') },

    sinPerfil () {
      return this.usuarios.filter((u) => !u.perfil_id).length
    },

    visibles () {
      const texto = this.filtro.trim().toLowerCase()

      return this.usuarios.filter((u) => {
        if (this.tdpFiltro && u.tdp_id !== this.tdpFiltro) return false

        if (this.perfilFiltro === 'sin' && u.perfil_id) return false
        if (this.perfilFiltro && this.perfilFiltro !== 'sin' && u.perfil_id !== this.perfilFiltro) return false

        if (!texto) return true

        return `${u.nombres} ${u.apellidos} ${u.cedula}`.toLowerCase().includes(texto)
      })
    },

    perfilElegidoEsRoot () {
      const p = this.perfiles.find((x) => x.perfil_id === this.form.perfil_id)

      return !!(p && p.es_root)
    }
  },

  created () {
    this.cargar()
  },

  methods: {
    async cargar () {
      this.cargando = true

      try {
        const r = await api.get('admin/usuarios')
        this.usuarios = r.data
        this.departamentos = r.departamentos || []
        this.perfiles = r.perfiles || []
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: e.message, color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    nombreUnidad (id) {
      const d = this.departamentos.find((x) => x.tdp_id === id)

      return d ? d.tdp_nombre : '—'
    },

    abrir (usuario) {
      this.elegido = usuario
      this.form = {
        idusuario: usuario.idusuario,
        perfil_id: usuario.perfil_id,
        // Por omision se propone su propia unidad: es el caso mas comun.
        alcance_tdp_id: usuario.perfil_id ? usuario.alcance_tdp_id : usuario.tdp_id
      }
      this.panel = true
    },

    async guardar () {
      this.guardando = true

      try {
        const r = await api.post('admin/usuarios/asignar', this.form)
        this.panel = false
        this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
        this.cargar()
      } catch (e) {
        this.$vs.notify({ title: 'No se pudo guardar', text: e.message, color: 'danger' })
      } finally {
        this.guardando = false
      }
    },

    revocar (usuario) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Quitar acceso',
        text: `${usuario.nombres} ${usuario.apellidos} dejara de entrar a Gestion Estrategica y se cerraran sus sesiones abiertas.`,
        acceptText: 'Quitar acceso',
        cancelText: 'Cancelar',
        accept: async () => {
          try {
            const r = await api.del(`admin/usuarios/${usuario.idusuario}`)
            this.$vs.notify({ title: 'Listo', text: r.message, color: 'success' })
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
.gema-usr-filtro { width: 176px; }
.gema-usr-ayuda { margin: 0 0 var(--gema-u3); }
.gema-usr-pista { font-size: var(--gema-fs-xs); line-height: 1.4; }
</style>
