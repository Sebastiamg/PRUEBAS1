<template>
  <div class="planificaciones">

    <!-- HEADER -->
    <div class="header">
      <div class="header-left">
        <h2>Planificaciones</h2>
      </div>
      <div class="header-right">
        <button class="btn-add" @click="abrirModalAgregar">+ Nueva</button>
      </div>
    </div>
    <!-- FILTROS -->
    <div class="filtros-container">

      <!-- NAVEGADOR DE SEMANAS -->
      <div class="semana-nav">
        <button @click="semanaAnterior" :disabled="semanaOffset <= -12" class="btn-nav-semana">
          ◀
        </button>
        <div class="semana-info">
          <span class="semana-label">{{ semanaActual }}</span>
          <span class="semana-subtitle">{{ semanaOffset === 0 ? 'Semana actual' : 'Semana ' + (semanaOffset < 0
            ? 'anterior' : 'siguiente') }}</span>
        </div>
        <button @click="semanaSiguiente" class="btn-nav-semana">
          ▶
        </button>
        <button v-if="semanaOffset !== 0" @click="irSemanaActual" class="btn-hoy">
          Hoy
        </button><br />
      </div>

      <!-- BARRA DE DÍAS -->
      <div class="barra-dias" v-if="semanaOffset <= 0">
        <button v-for="(dia, index) in diasBarra" :key="index" @click="seleccionarDia(dia.fecha)"
          :class="['dia-btn', { 'dia-activo': dia.fecha === diaSeleccionado, 'dia-hoy': dia.esHoy }]">
          <span class="dia-nombre">{{ dia.nombre }}</span>
          <span class="dia-numero">{{ dia.numero }}</span>
          <span v-if="dia.cantidad > 0" class="dia-badge">{{ dia.cantidad }}</span>
        </button>
      </div>

      <!-- Chips de estado -->
      <div class="estado-chips">
        <button v-for="chip in chipsEstado" :key="chip.valor" @click="toggleFiltroEstado(chip.valor)"
          :class="['chip-estado', 'chip-' + chip.clase, { 'chip-activo': filtroEstado === chip.valor }]">
          <span class="chip-dot"></span>
          <span>{{ chip.nombre }}</span>
        </button>
        <button @click="toggleFiltroEstado('Finalizada')"
          :class="['chip-estado', 'chip-finalizada', { 'chip-activo': filtroEstado === 'Finalizada' }]">
          <span class="chip-dot"></span>
          <span>Finalizadas</span>
        </button>
        <button v-if="filtroEstado" @click="filtroEstado = null" class="chip-estado chip-limpiar">
          Todos
        </button>
      </div>
    </div>


    <!-- LOADING -->
    <div v-if="cargando" class="loading-container">
      <div class="loading-spinner"></div>
      <p class="loading-text">Cargando planificaciones...</p>
    </div>

    <!-- LISTA -->
    <div v-else class="listado">

      <div v-if="actividadesFiltradas.length === 0" class="empty">
        {{ mensajeVacio }}
      </div>

      <div v-for="actividad in actividadesFiltradas" :key="actividad.id" class="card col-lg-4 col-md-6 col-12 mb-3">

        <!-- HEADER CARD -->
        <div class="card-header">
          <span
            :class="['estado', 'estado-' + actividad.estado.toLowerCase().replace(/ /g, '-').normalize('NFD').replace(/[\u0300-\u036f]/g, '')]">
            {{ actividad.estado }}
          </span>
          <div class="acciones">
            <button v-if="!actividad.latitud && !actividad.latitud_fin && actividad.estadoNumerico == 0"
              class="btn-inicio" @click.stop="iniciarVisita(actividad)">
              Iniciar
            </button>
            <button v-if="actividad.latitud && !actividad.latitud_fin && actividad.estadoNumerico == 0" class="btn-fin"
              @click.stop="finalizarVisita(actividad)">
              Finalizar
            </button>
            <button v-if="actividad.estadoNumerico != 4" class="btn-edit"
              @click.stop="editarActividad(actividad)">Editar</button>
          </div>
        </div>

        <!-- CONTENT -->
        <div class="card-body">
          <h3>{{ actividad.nombreInstitucion || 'Sin institución' }}</h3>
          <p class="titulo">{{ actividad.titulo }}</p>
          <p class="descripcion">{{ actividad.descripcion || 'Sin observaciones' }}</p>

          <div class="fechas">
            <div>📅 {{ actividad.fecha }}</div>
            <div v-if="actividad.hora">🕐 {{ actividad.hora }}</div>
            <div>📍 Inicio: {{ actividad.latitud ? '✓' : '' }}</div>
            <div>📍 Fin: {{ actividad.latitud_fin ? '✓' : '' }}</div>
          </div>
        </div>

      </div>

    </div>
    <vs-popup title="Visita en curso" :active.sync="modal_iniciada">
      <div style="text-align:center;padding:20px;">
        <h4>{{ msj_iniciada }}</h4>
        <p>Debes finalizar antes de iniciar otra visita.</p>
        <vs-button class="mt-4" color="dark" type="border" @click="modal_iniciada = false">Aceptar</vs-button>
      </div>
    </vs-popup>

    <!-- MODAL PARA AGREGAR/EDITAR -->
    <PlanificacionFormModal :visible="modalAbierto" :modo-edicion="modoEdicion" :usuario="usuario"
      :planificacion="planificacionSeleccionada" @close="cerrarModal" @save="guardarPlanificacion" />
  </div>
</template>

<script>
import PlanificacionesService from './planificacionesService';
import PlanificacionFormModal from './PlanificacionFormModal.vue';

export default {
  name: 'PlanificacionesAgendaListado',
  components: { PlanificacionFormModal },

  data() {
    return {
      $service: PlanificacionesService,
      actividades: [],
      cargando: false,
      usuario: null,
      bloqueandoGPS: false,
      modalAbierto: false,
      modoEdicion: false,
      planificacionSeleccionada: null,
      filtroEstado: null,  // null = todos (excepto Finalizadas)
      // Chips de estado
      chipsEstado: [
        { valor: 'Generada', nombre: 'Generadas', clase: 'generada' },
        { valor: 'Realizada', nombre: 'Realizadas', clase: 'realizada' },
        { valor: 'No Realizada', nombre: 'No Realizadas', clase: 'no-realizada' }
      ],

      // Control de carga por estado
      estadoCargado: {
        activas: false,     // Generadas + Realizadas (por defecto)
        finalizadas: false  // Finalizadas (solo si se pide)
      },
      filtroFechaInicio: this.getFechaDefecto(-5),
      filtroFechaFin: this.getFechaDefecto(5),
      modal_iniciada: false,
      msj_iniciada: '',
      // diasSemana: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
      diasBarra: [],
      diaSeleccionado: this.getFechaHoy(),
      semanaOffset: 0, // 0 = semana actual, -1 = semana anterior, etc.
      semanaActual: '',
      mensajeVacio: 'No hay planificaciones para mostrar'
    }
  },

  computed: {
    actividadesFiltradas: function () {
      var self = this
      var resultado = this.actividades.slice()

      // Si hay día seleccionado, filtrar por ese día
      if (self.diaSeleccionado) {
        resultado = resultado.filter(function (a) { return a.fecha === self.diaSeleccionado })
      } else if (self.diasBarra.length > 0) {
        // Filtrar por el rango de la semana actual (lunes a sábado)
        var inicioSemana = self.diasBarra[0].fecha
        var finSemana = self.diasBarra[5].fecha
        resultado = resultado.filter(function (a) {
          return a.fecha >= inicioSemana && a.fecha <= finSemana
        })
      }

      // Filtrar por estado
      if (self.filtroEstado) {
        resultado = resultado.filter(function (a) { return a.estado === self.filtroEstado })
      } else {
        resultado = resultado.filter(function (a) {
          return a.estado !== 'Finalizada' && a.estado !== 'Eliminada'
        })
      }

      return resultado.sort(function (a, b) {
        if (a.fecha === b.fecha) {
          return (a.hora || '').localeCompare(b.hora || '')
        }
        return a.fecha.localeCompare(b.fecha)
      })
    },
  },
  methods: {

    determinarUsuario: function () {
      if (this.$parent && this.$parent.usuarioExterno) {
        this.usuario = this.$parent.usuarioExterno
        return
      }

      var userPlanificaciones = localStorage.getItem('userPlanificaciones')
      if (userPlanificaciones) {
        try {
          this.usuario = JSON.parse(userPlanificaciones)
          return
        } catch (e) { }
      }

      var usuarioPlataforma = localStorage.getItem('usuario')
      if (usuarioPlataforma) {
        try {
          this.usuario = JSON.parse(usuarioPlataforma)
          return
        } catch (e) { }
      }

      if (this.$attrs && this.$attrs.usuario) {
        this.usuario = this.$attrs.usuario
      }
    },

    // cerrarSesion: function () {
    //   this.$emit('logout')
    // },

    // APLICAR FILTROS
    // aplicarFiltros: function () {
    //   // El computed se actualiza automáticamente
    //   this.cargarActividades() // Recargar con nuevas fechas

    // },

    // limpiarFiltroFechas: function () {
    //   this.filtroFechaInicio = ''
    //   this.filtroFechaFin = ''
    // },
    seleccionarDia: function (fecha) {
      this.diaSeleccionado = fecha
      this.filtroFechaInicio = fecha
      this.filtroFechaFin = fecha
    },

    toggleFiltroEstado: function (estado) {
      // Si es Finalizada, verificar caché
      if (estado === 'Finalizada' && !this.estadoCargado.finalizadas) {
        this.cargarFinalizadas()
      }

      // Toggle: si ya está seleccionado, lo quita
      if (this.filtroEstado === estado) {
        this.filtroEstado = null
      } else {
        this.filtroEstado = estado
      }
    },

    // CARGAR FINALIZADAS (solo cuando se pide)
    cargarFinalizadas: function () {
      var self = this
      var usuarioId = this.usuario.idusuario || this.usuario.id

      this.$http.get(
        this.$server_url + 'agenda-planificacion?usuario_id=' + usuarioId + '&estado=4'
      ).then(function (res) {
        if (res.data.success) {
          var finalizadas = res.data.data.map(function (item) {
            return PlanificacionesService.mapearActividad(item)
          })

          // ✅ ACTUALIZAR existentes o agregar nuevos
          finalizadas.forEach(function (nueva) {
            var existe = self.actividades.findIndex(function (a) { return a.id === nueva.id })
            if (existe >= 0) {
              // Reemplazar con datos actualizados
              self.actividades.splice(existe, 1, nueva)
            } else {
              self.actividades.push(nueva)
            }
          })

          self.estadoCargado.finalizadas = true
        }
      }).catch(function (e) {
        console.error('Error cargando finalizadas:', e)
      })
    },

    // MODAL
    abrirModalAgregar: function () {
      this.modoEdicion = false
      this.planificacionSeleccionada = null
      this.modalAbierto = true
    },

    abrirModalEditar: function (actividad) {
      this.modoEdicion = true
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

    // GUARDAR
    guardarPlanificacion: async function (data) {
      this.$vs.loading({ text: 'Guardando...' })
      try {
        var url = this.modoEdicion && data.id
          ? this.$server_url + 'agenda-planificacion/' + data.id
          : this.$server_url + 'agenda-planificacion'

        await this.$http.post(url, data.formData)
        this.$vs.notify({ title: 'Éxito', text: 'Planificación guardada', color: 'success' })
        this.cerrarModal()
        // Resetear caché y recargar
        this.estadoCargado.activas = false
        await this.cargarActividades()
      } catch (e) {
        this.$vs.notify({ title: 'Error', text: 'Error al guardar', color: 'danger' })
      } finally {
        this.$vs.loading.close()
      }
    },

    // CARGAR ACTIVIDADES (Generadas + Registradas por defecto)
    cargarActividades: async function () {
      this.cargando = true
      try {
        if (!this.usuario) {
          this.cargando = false
          return
        }

        var usuarioId = this.usuario.idusuario || this.usuario.id
        if (!usuarioId) {
          this.cargando = false
          return
        }

        var res = await this.$http.get(
          this.$server_url + 'agenda-planificacion?usuario_id=' + usuarioId
        )

        if (res.data.success) {
          var self = this
          var nuevasActividades = res.data.data.map(function (item) {
            return PlanificacionesService.mapearActividad(item)
          })

          // ✅ Actualizar existentes o agregar nuevos items         
          nuevasActividades.forEach(function (nueva) {
            var existe = self.actividades.findIndex(function (a) { return a.id === nueva.id })
            if (existe >= 0) {
              self.actividades.splice(existe, 1, nueva)
            } else {
              self.actividades.push(nueva)
            }
          })
        }
      } catch (error) {
        console.error('Error cargando actividades:', error)
      } finally {
        this.cargando = false
      }
    },
    iniciarVisita: async function (actividad) {
      // Verificar sesión
      if (!this.usuario || !this.usuario.idusuario) {
        this.$vs.notify({
          title: 'Sesión expirada',
          text: 'Tu sesión ha expirado. Vuelve a iniciar sesión.',
          color: 'danger'
        })
        return
      }

      // Verificar que no haya otra visita iniciada (búsqueda local)
      var self = this
      var visitaActiva = self.actividades.find(function (a) {
        return a.id !== actividad.id &&
          a.estadoNumerico == 0 &&
          a.latitud &&
          a.latitud !== null &&
          a.latitud !== '' &&
          !a.latitud_fin
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

    // finalizarVisita: async function (actividad) {
    //   if (!PlanificacionesService.puedeFinalizar(actividad)) {
    //     this.notify('No se puede finalizar')
    //     return
    //   }
    //   this.registrarGPS(actividad, 'fin')
    // },
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

    registrarGPS: async function (actividad, tipo) {
      if (this.bloqueandoGPS) return
      this.bloqueandoGPS = true

      var self = this
      var usuarioId = this.usuario.idusuario || this.usuario.id

      navigator.geolocation.getCurrentPosition(
        async function (pos) {
          try {
            var formData = PlanificacionesService.construirFormDataGPS(actividad, tipo, pos, usuarioId)
            var res = await self.$http.post(
              self.$server_url + 'agenda-planificacion/' + actividad.id,
              formData
            )

            if (!res.data.success) {
              self.error(res.data.message || 'Error guardando')
            } else {
              if (tipo === 'fin') {
                await self.$http.post(
                  self.$server_url + 'agenda-planificacion/' + actividad.id + '/cambiar-estado',
                  { estado: 1 }  // 1 = Registrada
                )
              }
              self.notify('Registro exitoso')
            }
            await self.cargarActividades()
          } catch (e) {
            self.error('Error GPS')
          }
          self.bloqueandoGPS = false
        },
        function (error) {
          self.bloqueandoGPS = false
          self.error(PlanificacionesService.obtenerMensajeErrorGPS(error))
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    },

    editarActividad: function (actividad) {
      if (PlanificacionesService.estaFinalizada(actividad)) {
        this.$vs.notify({
          title: 'Info',
          text: 'No puedes editar una visita finalizada',
          color: 'warning'
        })
        return
      }
      this.abrirModalEditar(actividad)
    },

    notify: function (txt) {
      this.$vs.notify({ title: 'Info', text: txt, color: 'success' })
    },

    error: function (txt) {
      this.$vs.notify({ title: 'Error', text: txt, color: 'danger' })
    },
    getFechaDefecto: function (dias) {
      var fecha = new Date();
      fecha.setDate(fecha.getDate() + dias);
      var year = fecha.getFullYear();
      var month = String(fecha.getMonth() + 1).padStart(2, '0');
      var day = String(fecha.getDate()).padStart(2, '0');
      return year + '-' + month + '-' + day;
    },
    limpiarFiltroFechas: function () {
      this.filtroFechaInicio = this.getFechaDefecto(-5)
      this.filtroFechaFin = this.getFechaDefecto(5)
      this.cargarActividades() // Recargar con fechas por defecto
    },
    getFechaHoy: function () {
      var hoy = new Date()
      return hoy.getFullYear() + '-' +
        String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
        String(hoy.getDate()).padStart(2, '0')
    },

    generarDiasBarra: function () {
      var hoy = new Date()
      var fechaReferencia = new Date(hoy)
      fechaReferencia.setDate(hoy.getDate() + (this.semanaOffset * 7))
      var diaSemana = fechaReferencia.getDay()

      var lunes = new Date(fechaReferencia)
      if (diaSemana === 0) {
        lunes.setDate(fechaReferencia.getDate() - 6)
      } else {
        lunes.setDate(fechaReferencia.getDate() - (diaSemana - 1))
      }

      this.diasBarra = []
      var nombres = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

      for (var i = 0; i < 6; i++) {
        var dia = new Date(lunes)
        dia.setDate(lunes.getDate() + i)
        var fechaStr = dia.getFullYear() + '-' +
          String(dia.getMonth() + 1).padStart(2, '0') + '-' +
          String(dia.getDate()).padStart(2, '0')

        // Contar cuántas planificaciones hay para este día
        var cantidad = this.actividades.filter(function (a) {
          return a.fecha === fechaStr && a.estado !== 'Finalizada' && a.estado !== 'Eliminada'
        }).length

        this.diasBarra.push({
          fecha: fechaStr,
          nombre: nombres[dia.getDay()],
          numero: dia.getDate(),
          mes: dia.getMonth(),
          esHoy: fechaStr === this.getFechaHoy(),
          cantidad: cantidad
        })
      }

      // Formatear el rango de la semana
      var primerDia = this.diasBarra[0]
      var ultimoDia = this.diasBarra[5]
      var meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

      if (primerDia.mes === ultimoDia.mes) {
        this.semanaActual = primerDia.numero + ' - ' + ultimoDia.numero + ' ' + meses[ultimoDia.mes]
      } else {
        this.semanaActual = primerDia.numero + ' ' + meses[primerDia.mes] + ' - ' + ultimoDia.numero + ' ' + meses[ultimoDia.mes]
      }
    },
    semanaAnterior: function () {
      if (this.semanaOffset > -12) { // Máximo 3 meses atrás (12 semanas)
        this.semanaOffset--
        this.generarDiasBarra()
        // this.seleccionarDia(this.diasBarra[0].fecha) // Seleccionar el lunes
        this.diaSeleccionado = null

      }
    },

    // if (this.semanaOffset < 0) {
    //   this.semanaOffset++
    //   this.generarDiasBarra()
    //   if (this.semanaOffset === 0) {
    //     this.seleccionarDia(this.getFechaHoy()) // Volver al día actual
    //   } else {
    //     this.seleccionarDia(this.diasBarra[0].fecha)
    //   }
    // }
    // semanaSiguiente: function () {
    //   this.semanaOffset++
    //   this.generarDiasBarra()
    //   if (this.semanaOffset === 0) {
    //     this.seleccionarDia(this.getFechaHoy())
    //   } else {
    //     this.seleccionarDia(this.diasBarra[0].fecha)
    //   }
    // },
    semanaSiguiente: function () {
      this.semanaOffset++
      this.generarDiasBarra()
      this.diaSeleccionado = null
    },

    irSemanaActual: function () {
      this.semanaOffset = 0
      this.generarDiasBarra()
      this.seleccionarDia(this.getFechaHoy())
      this.diaSeleccionado = null

    },
  },


  mounted: function () {
    this.determinarUsuario()
    this.generarDiasBarra()  // ← NUEVO
    if (this.usuario) {
      this.cargarActividades()
    }
  }
}
</script>

<style scoped>
.planificaciones {
  padding: 1rem;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.header-left h2 {
  margin: 0;
}

.header-right {
  display: flex;
  gap: 0.5rem;
}

.btn-add {
  padding: 0.5rem 1rem;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
}

.loading,
.empty {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.listado {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.card {
  background: white;
  border-radius: 0.75rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  border-left: 4px solid #3b82f6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}



.acciones {
  display: flex;
  gap: 0.5rem;
}

.acciones button {
  padding: 0.375rem 0.75rem;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
}

.btn-inicio {
  background: #d1fae5;
  color: #065f46;
}

.btn-fin {
  background: #fef3c7;
  color: #92400e;
}

.btn-edit {
  background: #e0f2fe;
  color: #0369a1;
}

.card-body h3 {
  margin: 0 0 0.25rem;
  font-size: 1rem;
}

.titulo {
  font-weight: 600;
  margin: 0 0 0.25rem;
}

.descripcion {
  color: #64748b;
  font-size: 0.875rem;
  margin: 0 0 0.5rem;
}

.fechas {
  font-size: 0.75rem;
  color: #64748b;
}

/* Estado base */
.estado {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  display: inline-block;
}

/* Generada - Azul */
.estado-generada {
  background: #dbeafe;
  color: #1e40af;
}

/* Registrada - Verde */
.estado-realizada {
  background: #d1fae5;
  color: #065f46;
}

/* Finalizada - Verde con borde */
.estado-finalizada {
  background: #d1fae5;
  color: #065f46;
  border: 1px solid #6ee7b7;
}

/* Eliminado - Rojo */
.estado-eliminado {
  background: #fee2e2;
  color: #991b1b;
}

/* No Realizada - Naranja */
.estado-no-realizada {
  background: #fef3c7;
  color: #92400e;
}

/* ===== FILTROS ===== */
.filtros-container {
  background: white;
  border-radius: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Chips de estado */
.estado-chips {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.chip-estado {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.65rem;
  border: 1px solid #e2e8f0;
  border-radius: 1.5rem;
  font-size: 0.7rem;
  font-weight: 600;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.chip-estado:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.chip-dot {
  width: 0.4rem;
  height: 0.4rem;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Colores de chips */
.chip-generada {
  color: #1e40af;
  border-color: #bfdbfe;
}

.chip-generada .chip-dot {
  background: #3b82f6;
}

.chip-realizada {
  color: #065f46;
  border-color: #a7f3d0;
}

.chip-realizada .chip-dot {
  background: #10b981;
}

.chip-no-realizada {
  color: #92400e;
  border-color: #fde68a;
}

.chip-no-realizada .chip-dot {
  background: #f59e0b;
}

.chip-finalizada {
  color: #065f46;
  border-color: #86efac;
}

.chip-finalizada .chip-dot {
  background: #10b981;
}

.chip-limpiar {
  color: #64748b;
  border-color: #cbd5e1;
}

/* Chip activo */
.chip-activo {
  background: #0f172a;
  border-color: #0f172a;
  color: white !important;
}

.chip-activo .chip-dot {
  background: white !important;
}

/* Barra de días */
.barra-dias {
  display: flex;
  justify-content: space-between;
  gap: 0;
  padding-bottom: 0.75rem;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #e2e8f0;
}

.barra-dias .dia-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  padding: 0.5rem 0.2rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
  min-width: 0;
}

.barra-dias .dia-btn:hover {
  background: #f1f5f9;
}

.barra-dias .dia-nombre {
  font-size: 0.65rem;
  color: #64748b;
  text-transform: uppercase;
  font-weight: 600;
}

.barra-dias .dia-numero {
  font-size: 0.95rem;
  font-weight: 700;
  color: #334155;
  margin-top: 0.1rem;
}

.barra-dias .dia-activo {
  background: #2563eb;
  border-color: #2563eb;
}

.barra-dias .dia-activo .dia-nombre,
.barra-dias .dia-activo .dia-numero {
  color: white;
}

/* ✅ Agregar esto para el hover */
.barra-dias .dia-activo:hover {
  background: #1d4ed8;
  border-color: #1d4ed8;
}

.barra-dias .dia-activo:hover .dia-nombre,
.barra-dias .dia-activo:hover .dia-numero {
  color: white;
}

.barra-dias .dia-hoy {
  border-color: #2563eb;
  border-width: 2px;
}

/* Navegación de semana */
.semana-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.semana-label {
  font-size: 0.85rem;
  font-weight: 700;
  color: #334155;
  min-width: 120px;
  text-align: center;
}

.btn-nav-semana {
  width: 2rem;
  height: 2rem;
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  background: white;
  cursor: pointer;
  font-size: 0.9rem;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.btn-nav-semana:hover:not(:disabled) {
  background: #f1f5f9;
  color: #334155;
}

.btn-nav-semana:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.btn-hoy {
  padding: 0.3rem 0.6rem;
  border: 1px solid #2563eb;
  border-radius: 1rem;
  background: white;
  color: #2563eb;
  cursor: pointer;
  font-size: 0.7rem;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-hoy:hover {
  background: #2563eb;
  color: white;
}

.dia-badge {
  font-size: 0.55rem;
  background: #3b82f6;
  color: white;
  border-radius: 50%;
  width: 1rem;
  height: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.15rem;
  font-weight: 700;
}

.dia-activo .dia-badge {
  background: white;
  color: #2563eb;
}

.semana-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 140px;
}

.semana-subtitle {
  font-size: 0.65rem;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 0.1rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
}

.loading-spinner {
  width: 2.5rem;
  height: 2.5rem;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #64748b;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
}

@media (max-width: 992px) {
  .listado {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 576px) {
  .listado {
    grid-template-columns: 1fr;
  }
}
</style>