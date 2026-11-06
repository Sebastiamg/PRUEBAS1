<template>
<div class="asignar-encuesta-wrap">

  <!-- Cabecera -->
  <div class="ae-header">
    <div>
      <p class="ae-titulo">{{ capacitacion.nombre }}</p>
      <span class="ae-sub">Capacitación #{{ capacitacion.id_seminario }}</span>
    </div>
    <vs-button size="small" color="primary" type="flat" icon-pack="feather" icon="icon-refresh-cw" @click="cargarAsignaciones" />
  </div>

  <!-- Lista de asignaciones -->
  <div class="ae-section">
    <p class="ae-label">Encuestas asignadas</p>

    <div v-if="cargando" class="ae-empty">
      <vs-icon icon="hourglass_empty" size="28px" color="primary" />
    </div>

    <div v-else-if="!asignaciones.length" class="ae-empty">
      <vs-icon icon="assignment" size="28px" color="grey" />
      <span>Sin encuestas asignadas aún.</span>
    </div>

    <div v-else>
      <div v-for="a in asignaciones" :key="a.id" class="ae-item">
        <div class="ae-item-info">
          <b class="ae-item-titulo">{{ a.encuesta ? a.encuesta.titulo : '—' }}</b>
          <div class="ae-item-meta">
            <vs-chip :color="a.estado === 'habilitada' ? 'success' : 'danger'" size="small">{{ a.estado }}</vs-chip>
            <span class="ae-codigo">Código: <b>{{ a.codigo_acceso }}</b></span>
            <vs-chip color="primary" size="small" title="Respuestas">
              <vs-icon icon="assignment_turned_in" size="12px" class="mr-1"/>{{ a.total_respuestas || 0 }}
            </vs-chip>
            <vs-chip color="success" size="small" title="Descargaron certificado">
              <vs-icon icon="download" size="12px" class="mr-1"/>{{ a.total_descargas || 0 }} cert.
            </vs-chip>
          </div>
          <div class="ae-grupos-tags">
            <span v-for="gid in (a.grupos_acceso ? a.grupos_acceso.split(',') : [])" :key="gid" class="ae-grupo-tag">
              {{ nombreGrupo(parseInt(gid)) }}
            </span>
          </div>
        </div>
        <div class="ae-item-acciones">
          <!-- Editar grupos -->
          <vs-button v-if="!userAsesor" size="small" radius icon-pack="feather" icon="icon-edit"
            title="Editar grupos con acceso"
            @click="editarGrupos(a)" color="primary" type="line" />
          <!-- Participantes -->
          <vs-button size="small" radius icon-pack="feather" icon="icon-users"
            title="Ver personas que respondieron la encuesta"
            @click="verParticipantes(a)" color="success" type="line" />
          <!-- Estadísticas -->
          <vs-button size="small" radius icon-pack="feather" icon="icon-bar-chart-2"
            title="Ver estadísticas"
            @click="verEstadisticas(a)" color="dark" type="line" />
          <!-- Ver Link y QR -->
          <vs-button size="small" radius icon-pack="feather" icon="icon-link-2"
            title="Ver Link y QR"
            @click="verLink(a)" color="success" type="line" />
          <!-- Copiar link -->
          <vs-button size="small" radius icon-pack="feather" icon="icon-copy"
            title="Copiar link"
            @click="copiarLink(a.codigo_acceso)" color="primary" type="line" />
          <!-- Habilitar / Cerrar -->
          <vs-button size="small" radius icon-pack="feather"
            :icon="a.estado === 'habilitada' ? 'icon-lock' : 'icon-unlock'"
            :title="a.estado === 'habilitada' ? 'Cerrar encuesta' : 'Habilitar encuesta'"
            @click="toggleEstado(a)"
            :color="a.estado === 'habilitada' ? 'warning' : 'success'" type="line" />
          <!-- Eliminar -->
          <vs-button v-if="!userAsesor" size="small" radius icon-pack="feather" icon="icon-trash"
            title="Eliminar asignación"
            @click="eliminar(a.id)" color="danger" type="line" />
          <!-- Ver Certificado -->
          <vs-button v-if="!userAsesor" size="small" radius icon-pack="feather" icon="icon-award"
            title="Vista previa del certificado"
            @click="verCertificado(a)" color="primary" type="line" />
        </div>
      </div>
    </div>
  </div>

  <!-- Formulario nueva asignación -->
  <div class="ae-section ae-form"
   v-if="!userAsesor"
  >
    <p class="ae-label">Asignar nueva encuesta</p>

    <v-select
      class="mb-3"
      :options="encuestasDisponibles"
      :reduce="e => e.id"
      label="titulo"
      v-model="encuestaSeleccionada"
      placeholder="Selecciona una encuesta..."
    />

    <p class="ae-label-sm">Grupos con acceso:</p>
    <div class="ae-grupos">
      <label v-for="g in gruposDisponibles" :key="g.id" class="ae-grupo-check"
        :class="{ activo: gruposSeleccionados.includes(g.id) }">
        <input type="checkbox" :value="g.id" v-model="gruposSeleccionados" />
        {{ g.deskripsi }}
      </label>
    </div>

    <vs-button
      color="success" type="gradient" class="w-full mt-3"
      :disabled="!encuestaSeleccionada || gruposSeleccionados.length === 0"
      @click="asignar"
    >
      <i class="feather icon-plus mr-1"></i> Asignar encuesta
    </vs-button>
  </div>

  <!-- POPUP PARTICIPANTES -->
  <vs-popup
    :title="asignacionParticipantes ? 'Participantes — ' + (asignacionParticipantes.encuesta ? asignacionParticipantes.encuesta.titulo : '') : 'Participantes'"
    :active.sync="popupParticipantes"
    style="z-index:200000;"
  >
    <encuesta-participantes-prolipa
      v-if="popupParticipantes && asignacionParticipantes && asignacionParticipantes.encuesta"
      :encuesta="asignacionParticipantes.encuesta"
      :asignacion-id="asignacionParticipantes.id"
    />
  </vs-popup>

  <!-- POPUP EDITAR GRUPOS / USUARIOS -->
  <vs-popup title="Acceso a la encuesta" :active.sync="popupEditGrupos" style="z-index:200000;">
    <encuesta-usuarios-asignacion
      v-if="popupEditGrupos && asignacionEditando"
      :asignacion="asignacionEditando"
      :key="'ua-' + (asignacionEditando ? asignacionEditando.id : 0)"
    />
  </vs-popup>

  <!-- POPUP ESTADÍSTICAS -->
  <vs-popup
    :title="asignacionStats ? 'Estadísticas — ' + (asignacionStats.encuesta ? asignacionStats.encuesta.titulo : '') : 'Estadísticas'"
    :active.sync="popupStats"
    style="z-index:200000;"
    fullscreen
  >
    <encuesta-estadisticas-prolipa
      v-if="popupStats && encuestaStats"
      :encuesta="encuestaStats"
      :asignacion-id="asignacionStats ? asignacionStats.id : null"
    />
  </vs-popup>

  <!-- POPUP CONFIRMAR ELIMINAR -->
  <vs-popup title="Confirmar eliminación" :active.sync="popupConfirmarEliminar" style="z-index:300000;">
    <div class="p-4 text-center">
      <vs-icon icon="warning" size="48px" color="danger" class="mb-3" />
      <p class="text-gray-700 mb-4">¿Seguro que deseas eliminar esta asignación?</p>
      <div class="flex gap-3 justify-center">
        <vs-button color="danger" @click="confirmarEliminar">Sí, eliminar</vs-button>
        <vs-button color="dark" type="flat" @click="popupConfirmarEliminar = false">Cancelar</vs-button>
      </div>
    </div>
  </vs-popup>

  <!-- POPUP VISTA PREVIA CERTIFICADO (misma vista que el docente) -->
  <vs-popup title="Vista previa del certificado" :active.sync="popupCertificado" style="z-index:200000;" fullscreen>
    <encuesta-certificado-prolipa
      v-if="popupCertificado && asignacionCertificadoPreview"
      preview-mode
      :preview-asignacion-id="asignacionCertificadoPreview.id"
      :preview-encuesta="asignacionCertificadoPreview.encuesta"
      :preview-nombre-entidad="capacitacion.nombre"
    />
  </vs-popup>

  <!-- POPUP LINK Y QR -->
  <vs-popup title="Enlace de Encuesta" :active.sync="popupLink" style="z-index:200000;">
    <div v-if="asignacionLink" class="p-4">

      <!-- Código QR -->
      <div class="text-center mb-6">
        <p class="text-sm text-gray-500 mb-4">Escanea el QR para acceder a la encuesta</p>
        <div class="flex justify-center mb-3">
          <img :src="qrUrl" alt="QR Encuesta" style="width:220px;height:220px;" />
        </div>
        <p class="font-mono text-xs text-gray-400 mb-3">{{ asignacionLink.codigo_acceso }}</p>
        <div class="flex justify-center">
          <vs-button color="primary" @click="descargarQR">
            <i class="fas fa-download mr-2"></i>
            Descargar QR
          </vs-button>
        </div>
      </div>

      <!-- Separador -->
      <div class="border-t pt-6">
        <p class="text-sm text-gray-500 mb-2">O comparte este enlace:</p>
        <div class="bg-gray-100 rounded p-3 mb-4 break-all font-mono text-sm">
          {{ linkEncuesta }}
        </div>
        <div class="flex gap-2 justify-center">
          <vs-button color="primary" icon="content_copy" @click="copiarLinkModal">
            Copiar Link
          </vs-button>
          <vs-button color="success" icon="open_in_new" @click="abrirLink">
            Abrir Link
          </vs-button>
        </div>
      </div>

    </div>
  </vs-popup>

</div>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from 'vue-select'
import EncuestaEstadisticasProlipa  from '@/views/asesor/encuestas/EncuestaEstadisticasProlipa.vue'
import EncuestaParticipantesProlipa from '@/views/asesor/encuestas/EncuestaParticipantesProlipa.vue'
import EncuestaUsuariosAsignacion   from './EncuestaUsuariosAsignacion.vue'
import EncuestaCertificadoProlipa   from '@/views/asesor/encuestas/EncuestaCertificadoProlipa.vue'

export default {
  components: {
    'v-select': vSelect,
    EncuestaEstadisticasProlipa,
    EncuestaParticipantesProlipa,
    EncuestaUsuariosAsignacion,
    EncuestaCertificadoProlipa,
  },

  props: {
    // Objeto capacitación — debe tener id_seminario y nombre
    capacitacion: { type: Object, required: true }
  },

  computed: {
    ...mapState(['userRoot', 'userAsesor']),

    linkEncuesta() {
      if (!this.asignacionLink) return ''
      return `${window.location.origin}/encuesta/prolipa/a/${this.asignacionLink.codigo_acceso}`
    },

    qrUrl() {
      if (!this.linkEncuesta) return ''
      return `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(this.linkEncuesta)}`
    }
  },

  data() {
    return {
      asignaciones:       [],
      encuestasDisponibles: [],
      gruposDisponibles:  [],
      gruposSeleccionados: [6,13], // Docentes, Asesores, Evaluación Docente por defecto
      encuestaSeleccionada: null,
      cargando: false,
      // participantes
      popupParticipantes:    false,
      asignacionParticipantes: null,
      // estadísticas
      popupStats:      false,
      asignacionStats: null,
      encuestaStats:   null,
      // link y QR
      popupLink:       false,
      asignacionLink:  null,
      // eliminar
      popupConfirmarEliminar: false,
      idEliminar: null,
      popupEditGrupos:    false,
      asignacionEditando: null,
      gruposEditando:     [],
      guardandoGrupos:    false,
      // certificado preview
      popupCertificado: false,
      asignacionCertificadoPreview: null,
    }
  },

  mounted() {
    this.cargarAsignaciones()
    this.cargarEncuestasDisponibles()
    this.cargarGrupos()
  },

  methods: {
    cargarAsignaciones() {
      this.cargando = true
      this.$http.get(this.$server_url + 'encuesta_prolipa/asignaciones/capacitacion/' + this.capacitacion.id_seminario)
        .then(res => { this.asignaciones = res.data })
        .catch(() => { this.asignaciones = [] })
        .finally(() => { this.cargando = false })
    },

    cargarEncuestasDisponibles() {
      this.$http.get(this.$server_url + 'encuesta_prolipa/')
        .then(res => { this.encuestasDisponibles = res.data.filter(e => e.estado === 'habilitada') })
        .catch(() => { this.encuestasDisponibles = [] })
    },

    cargarGrupos() {
      this.$http.get(this.$server_url + 'grupos_users')
        .then(res => {
          const excluir = [0, 7, 8, 9, 12, 14, 15, 16, 17, 22, 23, 27, 28, 29, 30, 34, 35]
          this.gruposDisponibles = res.data.filter(g => !excluir.includes(g.id))
        })
        .catch(() => {})
    },

    nombreGrupo(id) {
      const g = this.gruposDisponibles.find(x => x.id === id)
      return g ? g.deskripsi : id
    },

    asignar() {
      if (!this.encuestaSeleccionada || !this.gruposSeleccionados.length) return
      const usuario = JSON.parse(localStorage.getItem('usuario'))
      this.$http.post(this.$server_url + 'encuesta_prolipa/asignaciones', {
        encuesta_id:   this.encuestaSeleccionada,
        entidad_tipo:  'capacitacion',
        entidad_id:    this.capacitacion.id_seminario,
        grupos_acceso: this.gruposSeleccionados.join(','),
        created_by:    usuario ? usuario.idusuario : null,
      })
      .then(res => {
        if (res.data.status === 1) {
          this.$vs.notify({ text: 'Encuesta asignada', color: 'success', iconPack: 'feather', icon: 'icon-check' })
          this.encuestaSeleccionada = null
          this.gruposSeleccionados  = [6, 13]
          this.cargarAsignaciones()
        } else {
          this.$vs.notify({ text: res.data.message || 'Error al asignar', color: 'warning', iconPack: 'feather', icon: 'icon-alert-circle' })
        }
      })
      .catch(() => { this.$vs.notify({ text: 'Error de conexión', color: 'danger', iconPack: 'feather', icon: 'icon-x' }) })
    },

    eliminar(id) {
      this.idEliminar = id
      this.popupConfirmarEliminar = true
    },

    confirmarEliminar() {
      this.$http.delete(this.$server_url + 'encuesta_prolipa/asignaciones/' + this.idEliminar)
        .then(res => {
          if (res.data.status === 0) {
            this.$vs.notify({ text: res.data.message, color: 'warning', iconPack: 'feather', icon: 'icon-alert-circle', time: 5000 })
            this.popupConfirmarEliminar = false
            return
          }
          this.popupConfirmarEliminar = false
          this.idEliminar = null
          this.cargarAsignaciones()
          this.$vs.notify({ text: 'Asignación eliminada', color: 'success', iconPack: 'feather', icon: 'icon-check' })
        })
        .catch(err => {
          const msg = (err.response && err.response.data && err.response.data.message)
            ? err.response.data.message
            : 'No se puede eliminar esta asignación'
          this.$vs.notify({ text: msg, color: 'danger', iconPack: 'feather', icon: 'icon-x', time: 5000 })
          this.popupConfirmarEliminar = false
        })
    },

    toggleEstado(asignacion) {
      const nuevoEstado = asignacion.estado === 'habilitada' ? 'cerrada' : 'habilitada'
      this.$http.post(this.$server_url + 'encuesta_prolipa/asignaciones/' + asignacion.id + '/estado', { estado: nuevoEstado })
        .then(() => { this.cargarAsignaciones() })
    },

    copiarLink(codigo) {
      const url = window.location.origin + '/encuesta/prolipa/a/' + codigo
      navigator.clipboard.writeText(url).then(() => {
        this.$vs.notify({ text: 'Link copiado', color: 'success', iconPack: 'feather', icon: 'icon-copy' })
      })
    },

    editarGrupos(asignacion) {
      this.asignacionEditando = asignacion
      // Pre-cargar los grupos actuales de la asignación
      this.gruposEditando = asignacion.grupos_acceso
        ? asignacion.grupos_acceso.split(',').map(Number)
        : []
      this.popupEditGrupos = true
    },

    guardarGrupos() {
      if (!this.gruposEditando.length) return
      this.guardandoGrupos = true
      this.$http.post(
        this.$server_url + 'encuesta_prolipa/asignaciones/' + this.asignacionEditando.id + '/grupos',
        { grupos_acceso: this.gruposEditando.join(',') }
      )
      .then(() => {
        this.$vs.notify({ text: 'Grupos actualizados', color: 'success', iconPack: 'feather', icon: 'icon-check' })
        this.popupEditGrupos = false
        this.cargarAsignaciones()
      })
      .catch(() => { this.$vs.notify({ text: 'Error al guardar', color: 'danger', iconPack: 'feather', icon: 'icon-x' }) })
      .finally(() => { this.guardandoGrupos = false })
    },

    verParticipantes(asignacion) {
      this.asignacionParticipantes = asignacion
      this.popupParticipantes      = true
    },

    verEstadisticas(asignacion) {
      this.asignacionStats = asignacion
      this.encuestaStats   = asignacion.encuesta || null
      this.popupStats      = true
    },

    verLink(asignacion) {
      this.asignacionLink = asignacion
      this.popupLink      = true
    },

    copiarLinkModal() {
      navigator.clipboard.writeText(this.linkEncuesta).then(() => {
        this.$vs.notify({ text: 'Link copiado al portapapeles', color: 'success', iconPack: 'feather', icon: 'icon-copy' })
      })
    },

    abrirLink() {
      window.open(this.linkEncuesta, '_blank')
    },

    descargarQR() {
      const link = document.createElement('a')
      link.href = this.qrUrl
      link.download = `QR_${this.asignacionLink.codigo_acceso}.png`
      link.target = '_blank'
      link.click()
    },

    verCertificado(asignacion) {
      this.asignacionCertificadoPreview = asignacion
      this.popupCertificado = true
    },
  }
}
</script>

<style scoped>
.asignar-encuesta-wrap { padding: 0.25rem 0; }

.ae-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 1rem;
}
.ae-titulo  { font-size: 1rem; font-weight: 700; color: #1e293b; margin: 0; }
.ae-sub     { font-size: 0.75rem; color: #94a3b8; }

.ae-section { margin-bottom: 1.25rem; }
.ae-label   { font-size: 0.8rem; font-weight: 600; color: #64748b; margin-bottom: 0.6rem; text-transform: uppercase; letter-spacing: 0.04em; }
.ae-label-sm { font-size: 0.78rem; color: #64748b; margin-bottom: 0.4rem; }

.ae-empty {
  display: flex; align-items: center; gap: 0.5rem;
  color: #94a3b8; font-size: 0.85rem; padding: 0.75rem 0;
}

.ae-item {
  display: flex; align-items: flex-start; justify-content: space-between; gap: 0.75rem;
  padding: 0.75rem 1rem; border: 1px solid #e5e7eb; border-radius: 0.6rem; margin-bottom: 0.5rem;
  background: #fff;
}
.ae-item-info  { flex: 1; min-width: 0; }
.ae-item-titulo { font-size: 0.95rem; color: #1f2937; }
.ae-item-meta  { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.25rem; flex-wrap: wrap; }
.ae-codigo     { font-size: 0.78rem; color: #6b7280; }
.ae-item-acciones { display: flex; gap: 4px; flex-shrink: 0; align-items: center; }

.ae-grupos-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 0.35rem; }
.ae-grupo-tag {
  font-size: 0.7rem; background: #f1f5f9; color: #475569;
  padding: 2px 7px; border-radius: 99px; border: 1px solid #e2e8f0;
}

.ae-form { border-top: 1px solid #f1f5f9; padding-top: 1rem; }

.ae-grupos { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 0.5rem; }
.ae-grupo-check {
  display: flex; align-items: center; gap: 5px; font-size: 0.8rem; cursor: pointer;
  padding: 4px 10px; border: 1px solid #e5e7eb; border-radius: 6px; color: #374151;
  transition: all 0.15s;
}
.ae-grupo-check.activo { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
.ae-grupo-check input  { cursor: pointer; }
</style>
