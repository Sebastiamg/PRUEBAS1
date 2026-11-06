<template>
  <div class="planificaciones-dashboard">
    <!-- Header -->
    <div class="dashboard-header">
      <div class="header-content">
        <div class="header-title-section">
  <div style="display:flex;align-items:center;gap:0.75rem;">
    <div class="user-avatar-circle">
      {{ (usuarioExterno.nombres ? usuarioExterno.nombres.charAt(0) : '') + (usuarioExterno.apellidos ? usuarioExterno.apellidos.charAt(0) : '') }}
    </div>
    <div>
      <h1 class="dashboard-title" style="margin-bottom:0.1rem;">Mis Planificaciones</h1>
      <p style="margin:0;font-size:0.8rem;color:#64748b;font-weight:500;">
        {{ usuarioExterno.nombres }} {{ usuarioExterno.apellidos }}
        <span style="display:inline-block;width:0.4rem;height:0.4rem;background:#10b981;border-radius:50%;margin-left:0.4rem;animation:pulse 2s infinite;"></span>
      </p>
    </div>
  </div>
  <div style="display:flex;align-items:center;gap:0.75rem;">
    <button @click="cerrarSesion" class="btn-logout-header" title="Cerrar Sesión">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        style="width:1.25rem;height:1.25rem;">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
      </svg>
    </button>
    <button @click="abrirModalAgregar" class="btn-add-compact">+ Nueva</button>
  </div>
</div>

        <!-- Selector de fechas -->
        <div class="date-selector">
          <button @click="navegarFecha(-1)" class="btn-nav-date">◀</button>
          <div class="current-date">
            <span class="fecha">{{ fechaActualFormateada }}</span>
            <span class="dia-semana">{{ diaSemanaActual }}</span>
          </div>
          <button @click="navegarFecha(1)" class="btn-nav-date">▶</button>
        </div>

        <!-- Mini calendario de días -->
        <div class="mini-calendario">
          <button v-for="(dia, index) in diasAnteriores" :key="index" @click="seleccionarFecha(dia.fecha)"
            :class="['dia-btn', { 'dia-activo': dia.fecha === fechaSeleccionada }]">
            <span class="dia-nombre">{{ dia.nombre }}</span>
            <span class="dia-numero">{{ dia.numero }}</span>
          </button>
        </div>

        <!-- Chips de filtros por estado -->
        <div class="estado-chips">
          <button v-for="estado in estadosDisponibles" :key="estado.valor" @click="toggleFiltroEstado(estado.valor)"
            :class="['chip-estado', 'chip-' + estado.clase, { 'chip-activo': filtroEstado === estado.valor }]">
            <span class="chip-dot"></span>
            <span class="chip-label">{{ estado.nombre }}</span>
            <span class="chip-count">{{ estado.contador }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Contenido principal -->
    <div class="activities-board">
      <!-- Loading -->
      <div v-if="cargando" class="loading-container">
        <div class="spinner"></div>
        <p>Cargando planificaciones...</p>
      </div>

      <!-- Empty state -->
      <div v-else-if="actividadesFiltradas.length === 0" class="empty-state">
        <h3>No hay planificaciones</h3>
        <p v-if="filtroEstado">No hay planificaciones con el filtro seleccionado</p>
        <p v-else>Agrega tu primera planificación para comenzar</p>
        <button @click="abrirModalAgregar" class="btn-add-first">Agregar Planificación</button>
      </div>

      <!-- Lista de actividades -->
      <div v-else class="activities-grid">
        <div v-for="actividad in actividadesFiltradas" :key="actividad.id"
          :class="['activity-card', 'card-' + actividad.estado.toLowerCase().replace(' ', '-')]">

          <div class="card-header">
            <span :class="['status-badge', 'badge-' + actividad.estado.toLowerCase().replace(' ', '-')]">
              <span class="badge-dot"></span>
              {{ actividad.estado }} 
            </span>
            <div class="dropdown-menu-container" v-if="actividad.estadoNumerico != 4">
              <button @click.stop="toggleMenuOpciones(actividad.id)" class="btn-menu">⋮</button>
              <transition name="dropdown-fade"  >
                <div v-if="menuActivo === actividad.id" class="dropdown-menu-list" @click.stop>
                  <button @click.stop="editarDesdeMenu(actividad)" class="dropdown-item">✏️ Editar</button>
                  <button v-if="actividad.estadoNumerico == 0" @click.stop="confirmarNoRealizada(actividad)"
                    class="dropdown-item">🚫 No Realizada</button>
                  <button v-if="actividad.estadoNumerico == 0" @click.stop="confirmarEliminar(actividad)"
                    class="dropdown-item">🗑️ Eliminar</button>
                </div>
              </transition>
            </div>
          </div>

          <div class="card-body" @click="verDetalle(actividad)">
            <h3 class="card-title">{{ actividad.asignado }}</h3>
            <p class="card-description">{{ actividad.titulo || 'Sin descripción' }}</p>
            <p class="card-description1">{{ actividad.descripcion || 'Sin observaciones' }}</p>

            <div class="card-meta">
              <span>📅 {{ formatearFecha(actividad.fecha) }}</span>
              <span v-if="actividad.hora">🕐 {{ actividad.hora }}</span>
            </div>

            <div class="card-footer">
              <div class="ubicacion-item">
                📍 Inicio: {{ actividad.latitud ? '✓' : '○' }}
                <span v-if="actividad.fechaInicio">({{ formatearFechaHora(actividad.fechaInicio) }})</span>
              </div>
              <div class="ubicacion-item">
                📍 Fin: {{ actividad.latitud_fin ? '✓' : '○' }}
                <span v-if="actividad.fechaFin">({{ formatearFechaHora(actividad.fechaFin) }})</span>
              </div>
            </div>
          </div>

          <!-- Botones de acción -->
          <div v-if="actividad.estadoNumerico == 0" class="acciones-desktop" @click.stop>
            <button v-if="!actividad.latitud" @click="iniciarVisita(actividad)" class="btn-accion-card btn-iniciar">
              🟢 Iniciar Visita
            </button>
            <button v-if="actividad.latitud && !actividad.latitud_fin" @click="finalizarVisita(actividad)"
              class="btn-accion-card btn-finalizar">
              🔴 Finalizar Visita
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <PlanificacionFormModal :visible="modalAbierto" :modo-edicion="modoEdicion" :usuario="usuario"
      :planificacion="planificacionSeleccionada" @close="cerrarModal" @save="guardarPlanificacionHandler" />

    <!-- Modal Confirmar Eliminar -->
    <vs-popup title="Confirmar Eliminación" :active.sync="popupConfirmDelete">
      <div style="text-align:center;padding:20px;">
        <h3>¿Está seguro?</h3>
        <p>Esta acción eliminará la planificación permanentemente.</p>
        <vs-button color="danger" @click="ejecutarEliminar">Sí, eliminar</vs-button>
        <vs-button color="dark" type="border" @click="popupConfirmDelete = false">Cancelar</vs-button>
      </div>
    </vs-popup>

    <!-- Modal Confirmar No Realizada -->
    <vs-popup title="Marcar como No Realizada" :active.sync="popupConfirmNoRealizada">
      <div style="text-align:center;padding:20px;">
        <h3>¿Marcar como No Realizada?</h3>
        <p>La planificación será marcada como no realizada.</p>
        <vs-button color="warning" @click="ejecutarNoRealizada">Sí, marcar</vs-button>
        <vs-button color="dark" type="border" @click="popupConfirmNoRealizada = false">Cancelar</vs-button>
      </div>
    </vs-popup>
    <vs-popup title="Visita en curso" :active.sync="modal_iniciada">
      <div style="text-align:center;padding:20px;">
        <h4>{{ msj_iniciada }}</h4>
        <p>Debes finalizar antes de iniciar otra visita.</p>
        <p></p>
        <vs-button class="mt-4" color="dark" type="border" @click="modal_iniciada = false">Aceptar</vs-button>
      </div>
    </vs-popup>
  </div>
</template>

<script>
import PlanificacionesService from './planificacionesService'
import PlanificacionFormModal from './PlanificacionFormModal.vue'

export default {
  name: 'ScreenPlanificacionesAgenda',
  components: { PlanificacionFormModal },
  props: {
    usuarioExterno: { type: Object, default: function () { return null } }
  },
  data: function () {
    var hoy = new Date()
    var fechaInicial = hoy.getFullYear() + '-' +
      String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
      String(hoy.getDate()).padStart(2, '0')

    // Generar días anteriores directamente aquí
    var diasIniciales = []
    var fechaBase = new Date(hoy)
    for (var i = 4; i >= 0; i--) {
      var dia = new Date(fechaBase)
      dia.setDate(fechaBase.getDate() - i)
      diasIniciales.push({
        fecha: dia.getFullYear() + '-' +
          String(dia.getMonth() + 1).padStart(2, '0') + '-' +
          String(dia.getDate()).padStart(2, '0'),
        nombre: dia.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''),
        numero: dia.getDate()
      })
    }

    return {
      cargando: false,
      modalAbierto: false,
      modoEdicion: false,
      usuario: null,
      planificacionSeleccionada: null,
      actividades: [],
      menuActivo: null,
      popupConfirmDelete: false,
      actividadAEliminar: null,
      popupConfirmNoRealizada: false,
      actividadNoRealizada: null,
      bloqueandoGPS: false,
      fechaSeleccionada: fechaInicial,
      filtroEstado: null,
      diasAnteriores: diasIniciales,
      modal_iniciada: false,
      msj_iniciada: '',
    }
  },
  computed: {
    fechaActualFormateada: function () {
      if (!this.fechaSeleccionada) return ''
      var partes = this.fechaSeleccionada.split('-')
      var fecha = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]))
      return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })
    },
    diaSemanaActual: function () {
      if (!this.fechaSeleccionada) return ''
      var partes = this.fechaSeleccionada.split('-')
      var fecha = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]))
      return fecha.toLocaleDateString('es-ES', { weekday: 'long' })
    },
    actividadesFiltradas: function () {
      var self = this
      if (!self.actividades || !Array.isArray(self.actividades)) return []

      var resultado = self.actividades.filter(function (act) {
        return act.fecha === self.fechaSeleccionada
      })

      if (self.filtroEstado) {
        resultado = resultado.filter(function (act) {
          return act.estado === self.filtroEstado
        })
      }

      return resultado.sort(function (a, b) {
        return (a.hora || '').localeCompare(b.hora || '')
      })
    },
    estadosDisponibles: function () {
      var self = this
      if (!self.actividades || !Array.isArray(self.actividades)) return []

      var actividadesFecha = self.actividades.filter(function (act) {
        return act.fecha === self.fechaSeleccionada
      })

      return [
        {
          valor: 'Generada', nombre: 'Generadas', clase: 'generada',
          contador: actividadesFecha.filter(function (a) { return a.estado === 'Generada' }).length
        },
        {
          valor: 'Registrada', nombre: 'Registradas', clase: 'registrada',
          contador: actividadesFecha.filter(function (a) { return a.estado === 'Registrada' }).length
        },
        {
          valor: 'Eliminado', nombre: 'Anuladas', clase: 'eliminado',
          contador: actividadesFecha.filter(function (a) { return a.estado === 'Eliminado' }).length
        },
        {
          valor: 'No Realizada', nombre: 'No Realizadas', clase: 'norealizada',
          contador: actividadesFecha.filter(function (a) { return a.estado === 'No Realizada' }).length
        }
      ]
    }
  },
  methods: {
    obtenerClaseEstado: function (estado) {
      return PlanificacionesService.obtenerClaseEstado(estado)
    },
    formatearFecha: function (fechaStr) {
      return PlanificacionesService.formatearFecha(fechaStr)
    },
    formatearFechaHora: function (fechaISO) {
      return PlanificacionesService.formatearFechaHora(fechaISO)
    },

    // Navegación de fecha
    navegarFecha: function (direccion) {
      var partes = this.fechaSeleccionada.split('-')
      var fecha = new Date(parseInt(partes[0]), parseInt(partes[1]) - 1, parseInt(partes[2]))
      fecha.setDate(fecha.getDate() + direccion)
      this.fechaSeleccionada = fecha.getFullYear() + '-' +
        String(fecha.getMonth() + 1).padStart(2, '0') + '-' +
        String(fecha.getDate()).padStart(2, '0')

      // Actualizar días anteriores
      var diasNuevos = []
      var fechaBase = new Date(fecha)
      for (var i = 4; i >= 0; i--) {
        var dia = new Date(fechaBase)
        dia.setDate(fechaBase.getDate() - i)
        diasNuevos.push({
          fecha: dia.getFullYear() + '-' +
            String(dia.getMonth() + 1).padStart(2, '0') + '-' +
            String(dia.getDate()).padStart(2, '0'),
          nombre: dia.toLocaleDateString('es-ES', { weekday: 'short' }).replace('.', ''),
          numero: dia.getDate()
        })
      }
      this.diasAnteriores = diasNuevos
    },

    seleccionarFecha: function (fecha) {
      this.fechaSeleccionada = fecha
    },

    toggleFiltroEstado: function (estado) {
      this.filtroEstado = this.filtroEstado === estado ? null : estado
    },

    // Cargar actividades
    cargarActividades: async function () {
      this.cargando = true
      try {
        // Verificar que el usuario existe
        if (!this.usuario) {
          // console.error('Usuario no disponible')
          this.cargando = false
          return
        }

        var usuarioId = this.usuario.idusuario || this.usuario.id

        if (!usuarioId) {
          // console.error('ID de usuario no disponible')
          this.cargando = false
          return
        }

        var res = await this.$http.get(
          this.$server_url + 'agenda-planificacion?usuario_id=' + usuarioId
        )
        if (res.data.success) {
          this.actividades = res.data.data.map(function (item) {
            return PlanificacionesService.mapearActividad(item)
          })
        }
        // // ✅ COLOCA AQUÍ EL CONSOLE
        // if (this.actividades.length > 0) {
        //   console.log('Primera actividad mapeada:', this.actividades[1])
        //   console.log('asignado:', this.actividades[0].asignado)
        // }
      } catch (error) {
        console.error('Error cargando actividades:', error)
        this.$vs.notify({ title: 'Error', text: 'Error al cargar las planificaciones', color: 'danger' })
      } finally {
        this.cargando = false
      }
    },

    toggleMenuOpciones: function (actividadId) {
      this.menuActivo = this.menuActivo === actividadId ? null : actividadId
    },
    cerrarMenuOpciones: function () {
      this.menuActivo = null
    },

    abrirModalAgregar: function () {
      this.modoEdicion = false
      this.planificacionSeleccionada = {
        fecha: this.fechaSeleccionada,
        hora: new Date().toTimeString().slice(0, 5),
        titulo: '',
        descripcion: '',
        institucion_id: null,
        institucion_id_temporal: null,
        nombre_institucion: '',
        estado_institucion_temporal: 0,
        estadoNumerico: 0,
        opciones: {}
      }
      this.modalAbierto = true
    },
    verDetalle: function (actividad) {
      // console.log('Editar desde menú - Actividad:', actividad)
      if (actividad.estadoNumerico == 4) {
        this.$vs.notify({ title: 'La planificacion ya fue finalizada', color: 'success' })
        return
      }
      this.modoEdicion = true;
      this.planificacionSeleccionada = Object.assign({}, actividad)
      if (actividad.opciones) {
        this.planificacionSeleccionada.opciones = Object.assign({}, actividad.opciones)
      }
      this.modalAbierto = true
    },
    cerrarModal: function () {
      this.modalAbierto = false
      this.planificacionSeleccionada = null
    },
    editarDesdeMenu: function (actividad) {
      this.menuActivo = null
      // console.log('Editar desde menú - Actividad:', actividad)
      this.verDetalle(actividad)
    },

    guardarPlanificacionHandler: async function (data) {
      // Verificar usuario antes de continuar
      if (!this.usuario || !this.usuario.idusuario) {
        this.usuario = PlanificacionesService.determinarUsuario(this, this.usuarioExterno)
      }

      // Si sigue sin usuario, buscar directamente en localStorage
      if (!this.usuario || !this.usuario.idusuario) {
        var userPlanificaciones = localStorage.getItem('userPlanificaciones')
        if (userPlanificaciones) {
          try {
            this.usuario = JSON.parse(userPlanificaciones)
          } catch (e) { }
        }
        if (!this.usuario) {
          var usuarioPlataforma = localStorage.getItem('usuario')
          if (usuarioPlataforma) {
            try {
              this.usuario = JSON.parse(usuarioPlataforma)
            } catch (e) { }
          }
        }
      }

      var usuarioId = null
      if (this.usuario) {
        usuarioId = this.usuario.idusuario || this.usuario.id
      }

      if (!usuarioId) {
        this.$vs.notify({ title: 'Error', text: 'No se pudo identificar al usuario', color: 'danger' })
        return
      }

      this.$vs.loading({ text: 'Guardando...' })
      try {
        var formData = data.formData
        formData.append('usuario_creador', usuarioId)

        var url = this.modoEdicion && data.id
          ? this.$server_url + 'agenda-planificacion/' + data.id
          : this.$server_url + 'agenda-planificacion'

        var response = await this.$http.post(url, formData)
        if (response.data.success) {
          this.$vs.notify({
            title: 'Éxito',
            text: 'Planificación ' + (this.modoEdicion ? 'actualizada' : 'creada'),
            color: 'success'
          })
          this.cerrarModal()
          await this.cargarActividades()
        }
      } catch (error) {
        console.error('Error guardando:', error)
        var mensaje = 'Error al guardar'
        if (error.response && error.response.data && error.response.data.message) {
          mensaje = error.response.data.message
        }
        this.$vs.notify({ title: 'Error', text: mensaje, color: 'danger' })
      } finally {
        this.$vs.loading.close()
      }
    },

    iniciarVisita: async function (actividad) {
      if (!this.usuario || !this.usuario.idusuario) {
        this.$vs.notify({ title: 'Sesión expirada', text: 'Vuelve a iniciar sesión.', color: 'danger' })
        return
      }

      var self = this
      var miUsuarioId = this.usuario.idusuario || this.usuario.id

      var visitaActiva = self.actividades.find(function (a) {
        return a.id !== actividad.id &&
          a.estadoNumerico == 0 &&
          a.latitud && a.latitud !== null && a.latitud !== '' &&
          !a.latitud_fin &&
          a.id_usuario == miUsuarioId
      })

      if (visitaActiva) {
        var fechaVisita = visitaActiva.fecha || ''
        var horaVisita = visitaActiva.hora || ''
        var detalle = ''
        if (fechaVisita) detalle = ' del ' + fechaVisita
        if (horaVisita) detalle += ' a las ' + horaVisita

        this.modal_iniciada = true;
        this.msj_iniciada = visitaActiva.titulo + ' \n' + detalle;
        return
      }

      if (actividad.latitud && actividad.latitud !== null && actividad.latitud !== '') {
        this.$vs.notify({ title: 'Atención', text: 'Esta visita ya fue iniciada.', color: 'warning' })
        return
      }

      this.registrarGPS(actividad, 'inicio')
    },
    finalizarVisita: async function (actividad) {
      // Verificar que el usuario tenga sesión activa
      if (!this.usuario || !this.usuario.idusuario) {
        this.$vs.notify({
          title: 'Sesión expirada',
          text: 'Tu sesión ha expirado. Por favor, vuelve a iniciar sesión para continuar.',
          color: 'danger',
          time: 6000
        })
        return
      }

      await this.registrarGPS(actividad, 'fin')
    },



    confirmarEliminar: function (actividad) {
      this.menuActivo = null
      if (actividad.estadoNumerico != 0) {
        this.$vs.notify({ title: 'No se puede eliminar', text: 'Solo se pueden eliminar planificaciones generadas', color: 'warning' })
        return
      }
      this.actividadAEliminar = actividad
      this.popupConfirmDelete = true
    },
    ejecutarEliminar: async function () {
      if (!this.actividadAEliminar) return
      this.popupConfirmDelete = false
      this.$vs.loading({ text: 'Eliminando...' })
      try {
        await this.$http.delete(this.$server_url + 'agenda-planificacion/' + this.actividadAEliminar.id)
        this.$vs.notify({ title: 'Éxito', text: 'Planificación eliminada', color: 'success' })
        await this.cargarActividades()
      } catch (error) {
        this.$vs.notify({ title: 'Error', text: 'Error al eliminar', color: 'danger' })
      } finally {
        this.$vs.loading.close()
        this.actividadAEliminar = null
      }
    },

    confirmarNoRealizada: function (actividad) {
      this.menuActivo = null
      this.actividadNoRealizada = actividad
      this.popupConfirmNoRealizada = true
    },
    ejecutarNoRealizada: async function () {
      if (!this.actividadNoRealizada) return
      this.popupConfirmNoRealizada = false
      this.$vs.loading({ text: 'Actualizando...' })
      try {
        await this.$http.post(
          this.$server_url + 'agenda-planificacion/' + this.actividadNoRealizada.id + '/cambiar-estado',
          { estado: 3 }
        )
        this.$vs.notify({ title: 'Éxito', text: 'Marcada como No Realizada', color: 'success' })
        await this.cargarActividades()
      } catch (error) {
        this.$vs.notify({ title: 'Error', text: 'Error al actualizar', color: 'danger' })
      } finally {
        this.$vs.loading.close()
        this.actividadNoRealizada = null
      }
    },
    cerrarSesion: function () {
      localStorage.removeItem('userPlanificaciones')
      this.$emit('logout')
    },
    registrarGPS: async function (actividad, tipo) {
      // console.log("actividad", actividad)
      if (!this.usuario || !this.usuario.idusuario) {
        this.$vs.notify({ title: 'Sesión expirada', text: 'Vuelve a iniciar sesión.', color: 'danger' })
        return
      }

      if (this.bloqueandoGPS) return
      this.bloqueandoGPS = true

      if (!navigator.geolocation) {
        this.$vs.notify({ title: 'Error', text: 'Geolocalización no soportada', color: 'danger' })
        this.bloqueandoGPS = false
        return
      }

      this.$vs.loading({ text: 'Obteniendo ubicación de ' + tipo + '...' })

      var self = this
      var usuarioId = this.usuario.idusuario || this.usuario.id

      navigator.geolocation.getCurrentPosition(
        function (position) {
          var formData = PlanificacionesService.construirFormDataGPS(actividad, tipo, position, usuarioId)

          self.$http.post(
            self.$server_url + 'agenda-planificacion/' + actividad.id,
            formData
          )
            .then(function (response) {
              // console.log("Response:", response.data.data)
              if (response.data.success) {
                // Si es fin, cambiar estado
                if (tipo === 'fin') {
                  return self.$http.post(
                    self.$server_url + 'agenda-planificacion/' + actividad.id + '/cambiar-estado',
                    { estado: 1 }
                  ).then(function () {
                    self.$vs.notify({ title: 'Éxito', text: 'Visita finalizada correctamente', color: 'success' })
                  })
                } else {
                  self.$vs.notify({ title: 'Éxito', text: 'Visita iniciada correctamente', color: 'success' })
                }
              }
            })
            .catch(function (error) {
              console.error('Error GPS:', error)
              var mensaje = 'Error al registrar ubicación'
              if (error.response && error.response.data && error.response.data.message) {
                mensaje = error.response.data.message
              }
              self.$vs.notify({ title: 'Error', text: mensaje, color: 'danger' })
            }).finally(function () {
              // SIEMPRE recargar al final
              self.$vs.loading.close()
              self.bloqueandoGPS = false
              self.cargarActividades()
            })
        },
        function (error) {
          self.$vs.loading.close()
          self.bloqueandoGPS = false
          var mensaje = PlanificacionesService.obtenerMensajeErrorGPS(error)
          self.$vs.notify({ title: 'Error', text: mensaje, color: 'danger' })
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    },
  },
  mounted: function () {
    // Intentar obtener usuario de TODAS las fuentes
    this.usuario = PlanificacionesService.determinarUsuario(this, this.usuarioExterno)

    // Si sigue null, buscar directamente
    if (!this.usuario) {
      var userPlanificaciones = localStorage.getItem('userPlanificaciones')
      if (userPlanificaciones) {
        try {
          this.usuario = JSON.parse(userPlanificaciones)
        } catch (e) { }
      }
    }

    if (!this.usuario) {
      var usuarioPlataforma = localStorage.getItem('usuario')
      if (usuarioPlataforma) {
        try {
          this.usuario = JSON.parse(usuarioPlataforma)
        } catch (e) { }
      }
    }

    // Si viene por prop, usarlo
    if (!this.usuario && this.usuarioExterno) {
      this.usuario = this.usuarioExterno
    }

    // console.log('Usuario final:', this.usuario)

    if (this.usuario && (this.usuario.idusuario || this.usuario.id)) {
      this.cargarActividades()
    } else {
      console.error('No se pudo obtener el usuario')
    }

    document.addEventListener('click', this.cerrarMenuOpciones)
  },
  beforeDestroy: function () {
    document.removeEventListener('click', this.cerrarMenuOpciones)
  }
}
</script>

<style scoped>
/* Estilos base */
.planificaciones-dashboard {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 1.5rem;
}

.dashboard-header {
  margin-bottom: 1.5rem;
}

.header-content {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.header-title-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.dashboard-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0;
}

.btn-add-compact {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

/* Date selector */
.date-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #f8fafc;
  border-radius: 3rem;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

.btn-nav-date {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  font-size: 1.2rem;
}

.current-date {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.current-date .fecha {
  font-weight: 700;
  font-size: 1rem;
}

.current-date .dia-semana {
  font-size: 0.75rem;
  color: #64748b;
  text-transform: capitalize;
}

/* Mini calendario */
.mini-calendario {
  display: flex;
  justify-content: space-around;
  margin-bottom: 1rem;
}

.dia-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: transparent;
  border: none;
  padding: 0.5rem;
  border-radius: 1rem;
  cursor: pointer;
  min-width: 3rem;
}

.dia-btn.dia-activo {
  background: #2563eb;
  color: white;
}

.dia-nombre {
  font-size: 0.7rem;
  text-transform: uppercase;
}

.dia-numero {
  font-size: 1rem;
  font-weight: 600;
}

/* Chips de estado */
.estado-chips {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
}

.chip-estado {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: 1px solid #e2e8f0;
  border-radius: 2rem;
  font-size: 0.75rem;
  font-weight: 600;
  background: white;
  cursor: pointer;
  white-space: nowrap;
}

.chip-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.chip-generada .chip-dot {
  background: #3b82f6;
}

.chip-generada {
  color: #0369a1;
}

.chip-registrada .chip-dot {
  background: #10b981;
}

.chip-registrada {
  color: #065f46;
}

.chip-eliminado .chip-dot {
  background: #ef4444;
}

.chip-eliminado {
  color: #991b1b;
}

.chip-norealizada .chip-dot {
  background: #f59e0b;
}

.chip-norealizada {
  color: #92400e;
}

.chip-activo {
  background: #0f172a;
  border-color: #0f172a;
  color: white !important;
}

.chip-activo .chip-dot {
  background: white;
}

.chip-count {
  font-weight: 700;
  padding: 0.125rem 0.375rem;
  border-radius: 1rem;
  background: rgba(0, 0, 0, 0.05);
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
}

.spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem;
  text-align: center;
}

.btn-add-first {
  padding: 0.75rem 1.5rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
}

/* Activities */
.activities-board {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.activities-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.activity-card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  border-left: 4px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  border: 1px solid #e2e8f0;
  cursor: pointer;
  transition: all 0.2s;
}

.activity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.card-generada {
  border-left-color: #3b82f6;
}

.card-registrada {
  border-left-color: #10b981;
}

.card-eliminado {
  border-left-color: #ef4444;
}

.card-norealizada {
  border-left-color: #f59e0b;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.25rem 0.625rem;
  border-radius: 9999px;
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-dot {
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
}

.badge-generada {
  background: #dbeafe;
  color: #1e40af;
}

.badge-generada .badge-dot {
  background: #3b82f6;
}

.badge-realizada {
  background: #d1fae5;
  color: #065f46;
}

.badge-realizada .badge-dot {
  background: #10b981;
}

.badge-eliminado {
  background: #fee2e2;
  color: #991b1b;
}

.badge-eliminado .badge-dot {
  background: #ef4444;
}

.badge-norealizada {
  background: #fef3c7;
  color: #92400e;
}

.badge-norealizada .badge-dot {
  background: #f59e0b;
}

.btn-menu {
  width: 2rem;
  height: 2rem;
  border: none;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  font-size: 1.2rem;
  color: #64748b;
}

.btn-menu:hover {
  background: #f1f5f9;
}

/* Dropdown */
.dropdown-menu-container {
  position: relative;
}

.dropdown-menu-list {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.25rem;
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
  min-width: 160px;
  z-index: 50;
  overflow: hidden;
}

.dropdown-item {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.625rem 1rem;
  border: none;
  background: transparent;
  font-size: 0.875rem;
  cursor: pointer;
}

.dropdown-item:hover {
  background: #f8fafc;
}

.dropdown-fade-enter-active,
.dropdown-fade-leave-active {
  transition: all 0.15s;
}

.dropdown-fade-enter,
.dropdown-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

.card-body {
  cursor: pointer;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a202c;
  margin: 0 0 0.375rem;
}

.card-description {
  font-size: 0.9rem;
  color: #475569;
  margin: 0 0 0.25rem;
}

.card-description1 {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0 0 0.75rem;
}

.card-meta {
  font-size: 0.8rem;
  color: #64748b;
  margin-bottom: 0.75rem;
}

.card-footer {
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
  margin-bottom: 0.75rem;
}

.ubicacion-item {
  font-size: 0.75rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

/* Botones de acción */
.acciones-desktop {
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #e2e8f0;
}

.btn-accion-card {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 0.875rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-iniciar {
  background: #dbeafe;
  color: #1e40af;
}

.btn-iniciar:hover {
  background: #bfdbfe;
}

.btn-finalizar {
  background: #d1fae5;
  color: #065f46;
}

.btn-finalizar:hover {
  background: #a7f3d0;
}

.btn-logout-header {
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 50%;
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-logout-header:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .planificaciones-dashboard {
    padding: 0.75rem;
  }

  .activities-grid {
    grid-template-columns: 1fr;
  }
}

/* Generada - Azul */
.badge-generada {
  background: #dbeafe;
  color: #1e40af;
}

.badge-generada .badge-dot {
  background: #3b82f6;
}

/* Registrada - Verde */
.badge-registrada {
  background: #d1fae5;
  color: #065f46;
}

.badge-registrada .badge-dot {
  background: #10b981;
}

/* Finalizada - Verde con borde */
.badge-finalizada {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

.badge-finalizada .badge-dot {
  background: #10b981;
}

/* Eliminada - Rojo */
.badge-eliminada {
  background: #fee2e2;
  color: #991b1b;
}

.badge-eliminada .badge-dot {
  background: #ef4444;
}

/* No Realizada - Naranja */
.badge-no-realizada {
  background: #fef3c7;
  color: #92400e;
}

.badge-no-realizada .badge-dot {
  background: #f59e0b;
}
.user-avatar-circle {
  width: 2.5rem;
  height: 2.5rem;
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.3);
  flex-shrink: 0;
}
</style>