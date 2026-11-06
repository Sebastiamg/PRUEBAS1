// planificacionesService.js
// Servicio centralizado para toda la lógica de planificaciones

export const PlanificacionesService = {
  // Constantes de estados
  ESTADOS: {
    GENERADA: 0, //asesor crea la planificacion
    REALIZADA: 1, //asesor finaliza la visita - latitud y longitud de fin
    ELIMINADO: 2,
    NO_REALIZADA: 3,
    FINALIZADA: 4 // administrador finaliza la visita
  },

  ESTADOS_TEXTO: {
    0: 'Generada',
    1: 'Realizada',  
    2: 'Eliminado',
    3: 'No Realizada',
    4: 'Finalizada'     // ← El supervisor la finaliza
  },
  // Clases CSS para badge
  ESTADOS_BADGE_CLASES: {
    0: 'bg-yellow-100 text-yellow-800',   // Amarillo
    1: 'bg-blue-100 text-blue-800',       // Azul
    2: 'bg-red-100 text-red-800',         // Rojo
    3: 'bg-gray-100 text-gray-800',       // Gris oscuro
    4: 'bg-green-100 text-green-800'      // Verde
  },

  // Clases CSS para texto
  ESTADOS_CLASES: {
    0: 'text-yellow-600 bg-yellow-100',
    1: 'text-blue-600 bg-blue-100',
    2: 'text-red-600 bg-red-100',
    3: 'text-gray-600 bg-gray-100',
    4: 'text-green-600 bg-green-100'
  },

  // Iconos
  ESTADOS_ICONOS: {
    0: 'fa-clock-o',
    1: 'fa-check-circle',
    2: 'fa-trash',
    3: 'fa-times-circle',
    4: 'fa-flag-checkered'
  },

  // Mapear actividad desde API
  mapearActividad(item) {
    const opciones = JSON.parse(item.opciones || '{}')

    let fechaSolo = ''
    if (item.startDate) {
      if (item.startDate.includes('T')) {
        fechaSolo = item.startDate.split('T')[0]
      } else {
        fechaSolo = item.startDate.substring(0, 10)
      }
    }

    return {
      id: item.id,
      titulo: item.title,
      descripcion: item.url,
      fecha: fechaSolo,
      hora: item.hora_inicio,
      // estado: this.obtenerEstadoTexto(item.estado),
      estado: this.obtenerEstadoTexto(Number(item.estado)),  // ← Convertir a número

      asignado: item.nombre_institucion || item.nombre_institucion_temporal || 'Sin institución',
      // estadoNumerico: item.estado,
      estadoNumerico: Number(item.estado),  // ← Convertir a número
      id_usuario: item.id_usuario,
      opciones: opciones,

      // Ubicación inicio
      latitud: item.latitud,
      longitud: item.longitud,
      fecha_captura_longitud: item.fecha_captura_longitud,
      fechaInicio: item.fecha_captura_longitud,

      // Ubicación fin
      latitud_fin: item.latitud_fin,
      longitud_fin: item.longitud_fin,
      fecha_captura_longitud_fin: item.fecha_captura_longitud_fin,
      fechaFin: item.fecha_captura_longitud_fin,

      // Institución
      institucion_id: item.institucion_id,
      institucion_id_temporal: item.institucion_id_temporal,
      estado_institucion_temporal: item.estado_institucion_temporal,
      periodo_id: item.periodo_id,
      nombre_institucion: item.nombre_institucion,
      nombre_institucion_temporal: item.nombre_institucion_temporal,
      nombreInstitucion: item.nombre_institucion || item.nombre_institucion_temporal,

      // Datos completos
      datosCompletos: item
    }
  },

  // Obtener texto del estado
  obtenerEstadoTexto(estado) {
    return this.ESTADOS_TEXTO[Number(estado)] || 'Desconocido'  // ← Convertir a número
  },

  // Obtener clase CSS según estado
  obtenerClaseEstado(estado) {
    const clases = {
      Generada: 'generada',
      Realizada: 'realizada',
      Eliminado: 'eliminado',
      'No Realizada': 'norealizada',
      Finalizada: 'finalizada'
    }
    return clases[estado] || 'generada'
  },

  // Formatear fecha YYYY-MM-DD a formato legible
  formatearFecha(fechaStr) {
    if (!fechaStr) return ''

    if (fechaStr.match(/^\d{4}-\d{2}-\d{2}$/)) {
      const partes = fechaStr.split('-')
      const year = parseInt(partes[0])
      const month = parseInt(partes[1]) - 1
      const day = parseInt(partes[2])
      const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
      return day.toString().padStart(2, '0') + ' ' + meses[month] + ' ' + year
    }

    const fecha = fechaStr.includes(' ') ? fechaStr.replace(' ', 'T') : fechaStr
    const dateObj = new Date(fecha + 'T00:00:00')

    if (isNaN(dateObj.getTime())) return fechaStr

    return dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })
  },

  // Formatear fecha y hora
  formatearFechaHora(fechaISO) {
    if (!fechaISO) return ''

    if (fechaISO.includes(' ')) {
      const partes = fechaISO.split(' ')
      const fechaParte = partes[0].split('-')
      const horaParte = partes[1].split(':')
      const year = parseInt(fechaParte[0])
      const month = parseInt(fechaParte[1]) - 1
      const day = parseInt(fechaParte[2])
      const hour = parseInt(horaParte[0])
      const minute = parseInt(horaParte[1])
      const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
      return day.toString().padStart(2, '0') + ' ' + meses[month] + ' ' + year + ', ' + hour.toString().padStart(2, '0') + ':' + minute.toString().padStart(2, '0')
    }

    const fecha = new Date(fechaISO)
    if (isNaN(fecha.getTime())) return fechaISO

    return fecha.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  },

  // Formatear fecha para inputs (YYYY-MM-DD)
  formatFecha(date) {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return year + '-' + month + '-' + day
  },

  // Verificar si una actividad está finalizada
  estaFinalizada(actividad) {
    // return actividad.latitud_fin !== null && actividad.latitud_fin !== undefined && actividad.latitud_fin !== ''
    return Number(actividad.estadoNumerico) === 4

  },

  // Obtener mensaje de error para GPS
  obtenerMensajeErrorGPS(error) {
    if (error.code === error.PERMISSION_DENIED) {
      return 'Permiso de ubicación denegado. Por favor, activa el GPS.'
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      return 'Información de ubicación no disponible. Verifica que el GPS esté activado.'
    } else if (error.code === error.TIMEOUT) {
      return 'Tiempo de espera agotado. Intenta nuevamente en un lugar con mejor señal.'
    }
    return 'No se pudo obtener la ubicación'
  },

  // Construir FormData para GPS
  construirFormDataGPS(actividad, tipo, position, usuarioId) {
    const formData = new FormData()
    formData.append('_method', 'PUT')
    formData.append('title', actividad.titulo)
    formData.append('startDate', actividad.fecha)
    formData.append('hora_inicio', actividad.hora || '00:00:00')
    formData.append('hora_fin', actividad.hora || '00:00:00')
    formData.append('endDate', actividad.fecha)
    formData.append('usuario_editor', usuarioId)
    formData.append('estado', actividad.estadoNumerico || 0)
    formData.append('opciones', JSON.stringify(actividad.opciones || {}))

    if (actividad.descripcion) {
      formData.append('url', actividad.descripcion)
    }

    // Mantener institución si existe
    if (actividad.institucion_id) {
      formData.append('institucion_id', actividad.institucion_id)
      formData.append('estado_institucion_temporal', '0')
    }
    if (actividad.institucion_id_temporal) {
      formData.append('institucion_id_temporal', actividad.institucion_id_temporal)
      formData.append('nombre_institucion_temporal', actividad.nombre_institucion || actividad.asignado)
      formData.append('estado_institucion_temporal', '1')
    }
    if (actividad.periodo_id) {
      formData.append('periodo_id', actividad.periodo_id)
    }

    const ahora = new Date()
    const fechaHora = ahora.getFullYear() + '-' +
      String(ahora.getMonth() + 1).padStart(2, '0') + '-' +
      String(ahora.getDate()).padStart(2, '0') + ' ' +
      String(ahora.getHours()).padStart(2, '0') + ':' +
      String(ahora.getMinutes()).padStart(2, '0') + ':' +
      String(ahora.getSeconds()).padStart(2, '0')

    if (tipo === 'inicio') {
      formData.append('latitud', position.coords.latitude.toString())
      formData.append('longitud', position.coords.longitude.toString())
      formData.append('fecha_captura_longitud', fechaHora)
    } else {
      formData.append('latitud_fin', position.coords.latitude.toString())
      formData.append('longitud_fin', position.coords.longitude.toString())
      formData.append('fecha_captura_longitud_fin', fechaHora)
    }

    return formData
  },

  // Construir FormData para guardar planificación
  construirFormDataGuardar(datos, modoEdicion, usuarioId) {
    const formData = new FormData()

    if (modoEdicion && datos.id) {
      formData.append('_method', 'PUT')
    }

    formData.append('title', datos.titulo)
    formData.append('startDate', datos.fecha)
    formData.append('hora_inicio', datos.hora)
    formData.append('hora_fin', datos.hora)
    formData.append('endDate', datos.fecha)
    formData.append('url', datos.descripcion || '')
    formData.append('usuario_creador', usuarioId)
    formData.append('estado', datos.estadoNumerico || 0)

    const opcionesSinEditorial = Object.assign({}, datos.opciones)
    delete opcionesSinEditorial.editorial
    formData.append('opciones', JSON.stringify(opcionesSinEditorial))

    if (datos.opciones && datos.opciones.otraEditorial && datos.opciones.editorial) {
      formData.append('nombre_editorial', datos.opciones.editorial)
    }

    if (datos.institucion_id) {
      formData.append('institucion_id', datos.institucion_id)
      formData.append('estado_institucion_temporal', '0')
    }
    if (datos.institucion_id_temporal) {
      formData.append('institucion_id_temporal', datos.institucion_id_temporal)
      formData.append('nombre_institucion_temporal', datos.nombre_institucion)
      formData.append('estado_institucion_temporal', '1')
    }
    if (datos.periodo_id) {
      formData.append('periodo_id', datos.periodo_id)
    }

    return formData
  },

  // Obtener mensaje de error del response
  obtenerMensajeError(error, mensajeDefault) {
    if (error.response && error.response.data && error.response.data.message) {
      return error.response.data.message
    }
    if (error.message) {
      return error.message
    }
    return mensajeDefault || 'Error desconocido'
  },

  // Determinar usuario desde diferentes fuentes
  determinarUsuario: function () {
    // Opción 1: userPlanificaciones (ruta /asesor/planificaciones)
    var userPlanificaciones = localStorage.getItem('userPlanificaciones')
    if (userPlanificaciones) {
      try {
        this.usuario = JSON.parse(userPlanificaciones)
        return
      } catch (e) {
        console.error('Error al parsear userPlanificaciones:', e)
      }
    }

    // Opción 2: Propiedad externa (usada en IndexPlanificaciones)
    if (this.$parent && this.$parent.usuarioExterno) {
      this.usuario = this.$parent.usuarioExterno
      return
    }

    // Opción 3: usuario de la plataforma (ruta /home y otras vistas)
    var usuarioPlataforma = localStorage.getItem('usuario')
    if (usuarioPlataforma) {
      try {
        this.usuario = JSON.parse(usuarioPlataforma)
        return
      } catch (e) {
        console.error('Error al parsear usuario:', e)
      }
    }

    // Opción 4: Recibir como prop
    if (this.$attrs && this.$attrs.usuario) {
      this.usuario = this.$attrs.usuario
    }
  },
  // Métodos
  getEstadoTexto(estado) {
    return this.ESTADOS_TEXTO[estado] || 'Desconocido';
  },

  getEstadoClase(estado) {
    return this.ESTADOS_CLASES[estado] || 'text-gray-600 bg-gray-100';
  },

  getEstadoIcono(estado) {
    return this.ESTADOS_ICONOS[estado] || 'fa-question-circle';
  },

  getBadgeClase(estado) {
    return this.ESTADOS_BADGE_CLASES[estado] || 'bg-gray-100 text-gray-800';
  }
}

export default PlanificacionesService