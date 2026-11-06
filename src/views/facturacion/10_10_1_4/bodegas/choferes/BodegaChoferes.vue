<template>
  <div class="bc-wrap">
    <!-- Header -->
    <div class="bc-header">
      <h4 class="bc-title"><i class="fa-solid fa-truck mr-2"></i>Choferes asignados</h4>
      <vs-button color="primary" type="filled" size="small" @click="popupAsignar = true">
        <i class="fa-solid fa-user-plus mr-1"></i> Asignar Chofer
      </vs-button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="bc-estado">
      <i class="fa-solid fa-spinner fa-spin mr-1"></i> Cargando choferes...
    </div>

    <!-- Tabla -->
    <vs-table v-else max-items="10" search pagination :data="choferes">
      <template slot="header">
        <vs-chip color="primary">Total: <b>&nbsp;{{ choferes.length }}</b></vs-chip>
      </template>
      <template slot="thead">
        <vs-th sort-key="nombres">Nombre</vs-th>
        <vs-th sort-key="cedula">Cédula</vs-th>
        <vs-th>Roles</vs-th>
        <vs-th width="100">Acciones</vs-th>
      </template>
      <template slot-scope="{ data }">
        <vs-tr v-for="(tr, i) in data" :key="i">
          <vs-td>
            <div class="bc-nombre">{{ tr.nombres }} {{ tr.apellidos }}</div>
            <small class="bc-email">{{ tr.email }}</small>
          </vs-td>
          <vs-td>{{ tr.cedula }}</vs-td>
          <vs-td>
            <div class="bc-roles">
              <span v-for="r in tr.roles" :key="r.id" class="bc-rol-badge">{{ r.nombre }}</span>
            </div>
          </vs-td>
          <vs-td>
            <vx-tooltip text="Quitar rol de chofer" position="top" color="danger">
              <vs-button
                size="small"
                color="danger"
                type="flat"
                icon-pack="feather"
                icon="icon-user-minus"
                @click="confirmarQuitar(tr)"
                :disabled="quitando === tr.idusuario"
              />
            </vx-tooltip>
          </vs-td>
        </vs-tr>
      </template>
    </vs-table>

    <!-- Popup asignar chofer -->
    <BuscarUsuarioPopup
      :active.sync="popupAsignar"
      :roles="[17, 27]"
      titulo="Asignar Chofer"
      placeholder="Nombre, apellido o cédula..."
      @seleccionado="asignarChofer"
    />
  </div>
</template>

<script>
import BuscarUsuarioPopup from './BuscarUsuarioPopup.vue'

export default {
  name: 'BodegaChoferes',
  components: { BuscarUsuarioPopup },
  data() {
    return {
      choferes: [],
      loading: false,
      quitando: null,
      popupAsignar: false
    }
  },
  mounted() {
    this.cargarChoferes()
  },
  methods: {
    cargarChoferes() {
      this.loading = true
      this.$http.get(this.$server_url + 'VerifcarMetodosGet_UsuarioController?action=Get_Choferes')
        .then(res => { this.choferes = res.data || []; this.loading = false })
        .catch(() => { this.loading = false })
    },
    confirmarQuitar(chofer) {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Quitar rol de chofer',
        text: `¿Quitar el rol de chofer a ${chofer.nombres} ${chofer.apellidos}? Sus otros roles no se verán afectados.`,
        acceptText: 'Sí, quitar',
        cancelText: 'Cancelar',
        accept: () => this.quitarChofer(chofer)
      })
    },
    quitarChofer(chofer) {
      this.quitando = chofer.idusuario
      this.$http.post(this.$server_url + 'metodosPostUsuario', { action: 'Post_Quitar_Chofer', idusuario: chofer.idusuario })
        .then(res => {
          this.quitando = null
          const color = res.data.status === 1 ? 'success' : 'danger'
          const icon  = res.data.status === 1 ? 'icon-check' : 'icon-x'
          this.$vs.notify({ text: res.data.message, color, iconPack: 'feather', icon })
          if (res.data.status === 1) this.cargarChoferes()
        })
        .catch(() => {
          this.quitando = null
          this.$vs.notify({ text: 'Error al quitar el rol', color: 'danger', iconPack: 'feather', icon: 'icon-x' })
        })
    },
    asignarChofer(usuario) {
      this.$http.post(this.$server_url + 'metodosPostUsuario', { action: 'Post_Asignar_Chofer', idusuario: usuario.idusuario })
        .then(res => {
          if (res.data.status === 1) {
            this.$vs.notify({ text: `${usuario.nombres} ${usuario.apellidos} asignado como chofer`, color: 'success', iconPack: 'feather', icon: 'icon-check' })
            this.cargarChoferes()
          } else if (res.data.status === 2) {
            this.$vs.notify({ text: `${usuario.nombres} ${usuario.apellidos} ya está asignado como chofer`, color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
          } else {
            this.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-x' })
          }
        })
        .catch(() => {
          this.$vs.notify({ text: 'Error al asignar el rol', color: 'danger', iconPack: 'feather', icon: 'icon-x' })
        })
    }
  }
}
</script>

<style scoped>
.bc-wrap  { padding: 16px; display: flex; flex-direction: column; gap: 12px; }
.bc-header { display: flex; align-items: center; justify-content: space-between; }
.bc-title  { font-size: 15px; font-weight: 700; color: #1e293b; margin: 0; }
.bc-estado { font-size: 13px; color: #64748b; padding: 8px 0; }
.bc-nombre { font-size: 13px; font-weight: 700; color: #1e293b; }
.bc-email  { font-size: 11px; color: #64748b; }
.bc-roles  { display: flex; flex-wrap: wrap; gap: 4px; }
.bc-rol-badge {
  font-size: 10px; font-weight: 600;
  padding: 1px 7px; border-radius: 10px;
  background: #dbeafe; color: #1d4ed8;
  border: 1px solid #bfdbfe;
}
</style>
