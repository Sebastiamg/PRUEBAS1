<template>
  <vs-popup :title="titulo" :active.sync="isActive" class="buscar-usuario-popup">
    <div class="bu-wrap">
      <!-- Input búsqueda -->
      <div class="bu-search-row">
        <vs-input
          v-model="busqueda"
          :placeholder="placeholder"
          class="flex-1"
          icon="search"
          icon-after
          @keyup.enter.native="buscar"
        />
        <vs-button color="primary" type="filled" size="small" @click="buscar" :disabled="loading">
          <i class="fa-solid fa-magnifying-glass mr-1"></i> Buscar
        </vs-button>
      </div>

      <!-- Estados -->
      <div v-if="loading" class="bu-estado">
        <i class="fa-solid fa-spinner fa-spin mr-1"></i> Buscando...
      </div>
      <div v-else-if="sinResultados" class="bu-estado bu-vacio">
        Sin resultados para "{{ busqueda }}"
      </div>

      <!-- Resultados -->
      <div v-if="resultados.length > 0" class="bu-lista">
        <div
          v-for="u in resultados"
          :key="'bu-' + u.idusuario"
          class="bu-opcion"
          @click="seleccionar(u)"
        >
          <div class="bu-opcion-nombre">{{ u.nombres }} {{ u.apellidos }}</div>
          <div class="bu-opcion-meta">
            CI: {{ u.cedula }}
            <span v-if="searchByIdGroups && u.roles_label" class="bu-opcion-perfil"> · {{ u.roles_label }}</span>
            <span v-else-if="!searchByIdGroups && u.perfil" class="bu-opcion-perfil"> · {{ u.perfil }}</span>
          </div>
        </div>
      </div>
    </div>
  </vs-popup>
</template>

<script>
export default {
  name: 'BuscarUsuarioPopup',
  props: {
    active: { type: Boolean, default: false },
    // Roles a filtrar, ej: [17, 27, 34]
    roles: { type: Array, default: () => [] },
    titulo: { type: String, default: 'Buscar Usuario' },
    placeholder: { type: String, default: 'Nombre, apellido o cédula...' },
    // Si true, busca en id_groups (roles adicionales) en vez de id_group (rol principal)
    searchByIdGroups: { type: Boolean, default: false }
  },
  data() {
    return {
      busqueda: '',
      resultados: [],
      loading: false,
      sinResultados: false
    }
  },
  computed: {
    isActive: {
      get() { return this.active },
      set(val) { this.$emit('update:active', val) }
    }
  },
  watch: {
    active(val) {
      if (!val) this.reset()
    }
  },
  methods: {
    buscar() {
      const q = this.busqueda.trim()
      if (q.length < 2) {
        this.$vs.notify({ text: 'Ingrese al menos 2 caracteres', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
        return
      }
      this.loading = true
      this.sinResultados = false
      this.resultados = []

      let url
      if (this.searchByIdGroups) {
        // Busca en id_groups (roles adicionales)
        const rolesParam = this.roles.length > 0 ? '&roles=' + this.roles.join(',') : ''
        url = this.$server_url + 'VerifcarMetodosGet_UsuarioController?action=Get_Buscar_Por_IdGroups&q=' + encodeURIComponent(q) + rolesParam
      } else {
        // Busca por id_group (rol principal)
        const rolesParam = this.roles.length > 0 ? '&onlyRoles=' + this.roles.join(',') : ''
        url = this.$server_url + 'api/empaque-venta/buscar-chofer?q=' + encodeURIComponent(q) + rolesParam
      }

      this.$http.get(url)
        .then(res => {
          this.loading = false
          const data = Array.isArray(res.data) ? res.data : []
          if (data.length > 0) {
            this.resultados = data
          } else {
            this.sinResultados = true
          }
        })
        .catch(() => {
          this.loading = false
          this.sinResultados = true
        })
    },
    seleccionar(u) {
      this.$emit('seleccionado', u)
      this.isActive = false
    },
    reset() {
      this.busqueda = ''
      this.resultados = []
      this.sinResultados = false
      this.loading = false
    }
  }
}
</script>

<style scoped>
.bu-wrap { display: flex; flex-direction: column; gap: 10px; padding: 4px 0; }
.bu-search-row { display: flex; gap: 8px; align-items: center; }
.bu-search-row .flex-1 { flex: 1; }
.bu-estado { font-size: 12px; color: #64748b; padding: 6px 0; }
.bu-vacio { color: #f59e0b; }
.bu-lista { display: flex; flex-direction: column; gap: 4px; max-height: 280px; overflow-y: auto; }
.bu-opcion { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
.bu-opcion:hover { background: #f0f9ff; border-color: #93c5fd; }
.bu-opcion-nombre { font-size: 13px; font-weight: 600; color: #1e293b; }
.bu-opcion-meta { font-size: 11px; color: #64748b; }
.bu-opcion-perfil { color: #046AE7; font-weight: 600; }
</style>

<style>
.buscar-usuario-popup .vs-popup--background,
.buscar-usuario-popup .vs-popup { z-index: 60000 !important; }
</style>
