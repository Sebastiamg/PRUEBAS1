<template>
  <div>
    <!-- LOGIN -->
    <div v-if="!usuario && !mostrarRegistro" class="login-container">
      <div class="login-card">
        <div class="login-header">
          <div class="logo-circle"><span style="font-size:2rem;">📋</span></div>
          <h2>Encuesta Prolipa</h2>
          <p>Ingresa tu cédula para continuar</p>
        </div>

        <div v-if="encuesta" class="encuesta-info">
          <b>Encuesta: {{ encuesta.titulo }}</b>
          <span v-if="encuesta.descripcion" class="text-sm text-gray-400 block mt-1">{{ encuesta.descripcion }}</span>
        </div>

        <div v-if="encuesta && encuesta.estado !== 'habilitada'" class="alert-cerrada">
          ⚠️ Esta encuesta no está disponible en este momento.
        </div>
        <div v-else>
          <label class="input-label">Número de Cédula</label>
          <input type="text" v-model="cedula" @keyup.enter="ingresar" placeholder="Ingresa tu cédula"
            class="modern-input" maxlength="15" />
          <button @click="ingresar" class="btn-login" :disabled="cargando">{{ cargando ? 'Verificando...' : 'Ingresar'
          }}</button>
          <p v-if="errorLogin" class="error-msg">{{ errorLogin }}</p>
        </div>
      </div>
    </div>

    <!-- FORMULARIO DE REGISTRO -->
    <div v-if="mostrarRegistro" class="login-container">
      <div class="login-card" style="max-width: 520px;">
        <div class="login-header">
          <div class="logo-circle"><span style="font-size:2rem;">📝</span></div>
          <h2>Registro</h2>
          <p>Completa tus datos para continuar</p>
        </div>

        <div v-if="encuesta" class="encuesta-info">
          <b>Encuesta: {{ encuesta.titulo }}</b>
        </div>

        <div class="form-registro">
          <div class="form-group">
            <label class="input-label">Cédula *</label>
            <input type="text" v-model="datosRegistro.cedula" class="modern-input" maxlength="15" readonly />
          </div>

          <div class="form-group">
            <label class="input-label">Nombres *</label>
            <input type="text" v-model="datosRegistro.nombres" class="modern-input" placeholder="Ingresa tus nombres" maxlength="200" />
          </div>

          <div class="form-group">
            <label class="input-label">Apellidos *</label>
            <input type="text" v-model="datosRegistro.apellidos" class="modern-input" placeholder="Ingresa tus apellidos" maxlength="200" />
          </div>

          <div class="form-group">
            <label class="input-label">Correo Electrónico *</label>
            <input type="email" v-model="datosRegistro.email" class="modern-input" placeholder="ejemplo@correo.com" maxlength="200" />
          </div>

          <div class="form-group">
            <label class="input-label">Teléfono</label>
            <input type="text" v-model="datosRegistro.telefono" @input="validarTelefono" class="modern-input" placeholder="Número de teléfono" maxlength="10" />
          </div>

          <button @click="registrarUsuario" class="btn-login" :disabled="registrando">
            {{ registrando ? 'Registrando...' : 'Completar Registro' }}
          </button>

          <button @click="cancelarRegistro" class="btn-cancelar">
            Cancelar
          </button>

          <p v-if="errorRegistro" class="error-msg">{{ errorRegistro }}</p>
        </div>
      </div>
    </div>

    <!-- ENCUESTA RESPONDIDA (recién enviada) -->
    <div v-else-if="respondida && encuesta" class="resultado-container">
      <div class="resultado-card">
        <span style="font-size:4rem;">✅</span>
        <h2>Tu respuesta ha sido registrada con éxito</h2>
        <p>Gracias por ser parte de la transformación educativa que impulsamos</p>
        <p class="text-sm text-gray-400 mt-2">{{ encuesta.titulo }}</p>
        <button @click="irCertificado" class="btn-certificado mt-4">🎓 Descargar certificado</button>
        <button @click="cerrarSesion" class="btn-salir-resultado mt-3">Cerrar sesión</button>
      </div>
    </div>

    <!-- YA HABÍA RESPONDIDO ANTES -->
    <div v-else-if="yaRespondio && encuesta" class="resultado-container">
      <div class="resultado-card">
        <span style="font-size:4rem;">📋</span>
        <h2>Ya realizaste esta encuesta</h2>
        <p>Tu participación ya fue registrada anteriormente.</p>
        <p class="text-sm text-gray-400 mt-2">{{ encuesta.titulo }}</p>
        <button @click="irCertificado" class="btn-certificado mt-4">🎓 Descargar certificado</button>
        <button @click="cerrarSesion" class="btn-salir-resultado mt-3">Cerrar sesión</button>
      </div>
    </div>

    <!-- ENCUESTA NO DISPONIBLE -->
    <div v-else-if="encuesta && encuesta.estado !== 'habilitada'" class="resultado-container">
      <div class="resultado-card">
        <span style="font-size:4rem;">🔒</span>
        <h2>Encuesta no disponible</h2>
        <p v-if="encuesta.estado === 'cerrada'">Esta encuesta ya fue cerrada.</p>
        <p v-else>Esta encuesta aún no ha sido habilitada.</p>
        <p class="text-sm text-gray-400 mt-2">{{ encuesta.titulo }}</p>
      </div>
    </div>
    
    <!-- VERIFICANDO -->
    <div v-else-if="yaRespondio === null" class="resultado-container">
      <div class="resultado-card">
        <span style="font-size:2.5rem;">⏳</span>
        <p style="color:#94a3b8; margin-top:0.75rem;">Verificando...</p>
      </div>
    </div>

    <!-- FORMULARIO -->
    <div v-else-if="usuario && encuesta && encuesta.titulo" class="encuesta-container">

      <div class="encuesta-header">
        <h3>{{ encuesta.titulo }}</h3>
        <p v-if="encuesta.descripcion" class="text-gray-500 text-sm">{{ encuesta.descripcion }}</p>
        <p v-if="nombreEntidad" class="text-sm mt-1" style="color:#6366f1;">
          🏫 {{ nombreEntidad }}
        </p>

        <div class="usuario-badge">
          👤 {{ usuario.nombres }} {{ usuario.apellidos }}
          <button @click="cerrarSesion" class="btn-salir">Salir</button>
        </div>
        <div class="instruccion-banner" v-if="encuesta.preguntas && encuesta.preguntas.some(p => p.tipo === 'escala')">
          📋 <strong>Instrucción:</strong> Califique cada pregunta según la escala indicada, donde <strong>1</strong> es la calificación más baja y el número más alto es la mejor.
        </div>
      </div>

      <div v-for="(pregunta, index) in encuesta.preguntas" :key="pregunta.id" class="pregunta-card">
        <p class="pregunta-numero">Pregunta {{ index + 1 }}</p>
        <p class="pregunta-texto">{{ pregunta.texto }}</p>

        <!-- Escala: estrellas -->
        <div v-if="pregunta.tipo === 'escala'" class="estrellas-container">
          <p class="text-xs text-gray-500 mb-2">Escala del 1 al {{ pregunta.escala_maxima || 10 }}</p>
          <span v-for="n in (pregunta.escala_maxima || 10)" :key="n" class="estrella" @click="setEscala(pregunta.id, n, pregunta.escala_maxima || 10)"
            @mouseover="hoverEscala[pregunta.id] = n" @mouseleave="hoverEscala[pregunta.id] = 0"
            :style="{ color: (hoverEscala[pregunta.id] >= n || respuestas[pregunta.id] >= n) ? '#f59e0b' : '#d1d5db' }">★</span>
          <span v-if="respuestas[pregunta.id]" class="escala-valor">{{ respuestas[pregunta.id] }} / {{ pregunta.escala_maxima || 10 }}</span>
        </div>

        <!-- Simple 1-10: números clicables -->
        <div v-if="pregunta.tipo === 'simple'" class="escala-numerica-container">
          <button v-for="n in (pregunta.escala_maxima || 10)" :key="n" type="button" class="escala-num-btn"
            :class="{ activo: respuestas[pregunta.id] === n }" @click="setEscala(pregunta.id, n, pregunta.escala_maxima || 10)">{{ n }}</button>
          <span v-if="respuestas[pregunta.id]" class="escala-valor">{{ respuestas[pregunta.id] }} / {{ pregunta.escala_maxima || 10 }}</span>
        </div>

        <!-- Casillas: checkbox multi-select con opciones definidas -->
        <div v-if="pregunta.tipo === 'casillas'" class="opciones-container">
          <label v-for="opcion in pregunta.opciones" :key="opcion.id" class="opcion-item">
            <input type="checkbox" :value="opcion.id" v-model="respuestas[pregunta.id]" />
            <span>{{ opcion.texto }}</span>
          </label>
        </div>

        <div v-if="pregunta.tipo === 'multiple'" class="opciones-container">
          <label v-for="opcion in pregunta.opciones" :key="opcion.id" class="opcion-item">
            <input type="checkbox" :value="opcion.id" v-model="respuestas[pregunta.id]" />
            <span>{{ opcion.texto }}</span>
          </label>
        </div>

        <div v-if="pregunta.tipo === 'abierta'">
          <textarea v-model="respuestas[pregunta.id]" class="textarea-abierta"
            placeholder="Escribe tu respuesta aquí..." rows="3" />
        </div>
      </div>

      <p v-if="errorEnvio" class="error-msg text-center mb-3">{{ errorEnvio }}</p>

      <button @click="enviarRespuestas" class="btn-enviar" :disabled="enviando">
        {{ enviando ? 'Enviando...' : 'Enviar Respuestas' }}
      </button>

    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      // Modo: 'asignacion' (nuevo) | 'legacy' (por código encuesta)
      modo: null,
      codigoAcceso: null,
      asignacionId: null,
      gruposAcceso: [],
      tipoAcceso: 'grupos',
      usuariosAcceso: [],
      nombreEntidad: localStorage.getItem('nombreEntidadEncuesta') || null,

      codigo: null,
      encuesta: null,
      usuario: (() => {
        try { return JSON.parse(localStorage.getItem('userEncuestaProlipa')) || null }
        catch (e) { return null }
      })(),
      cedula: '',
      cargando: false,
      errorLogin: '',
      respondida: false,
      yaRespondio: null,
      enviando: false,
      errorEnvio: '',
      respuestas: {},
      hoverEscala: {},

      // Para registro
      mostrarRegistro: false,
      registrando: false,
      errorRegistro: '',
      datosRegistro: {
        cedula: '',
        nombres: '',
        apellidos: '',
        email: '',
        telefono: ''
      }
    }
  },

  mounted() {
    // Detectar modo según parámetros de ruta
    if (this.$route.params.codigoAcceso) {
      this.modo = 'asignacion'
      this.codigoAcceso = this.$route.params.codigoAcceso
      this.cargarPorAsignacion()
    } else {
      this.modo = 'legacy'
      this.codigo = this.$route.params.codigo
      this.cargarEncuesta()
    }
  },

  methods: {

    /** Modo nuevo: carga por código de asignación */
    cargarPorAsignacion() {
      let me = this
      me.$http.get(me.$server_url + 'encuesta_prolipa/acceso/' + me.codigoAcceso)
        .then(res => {
          const data = res.data
          console.log('Datos de acceso recibidos:', data)
          me.asignacionId = data.asignacion_id
          me.gruposAcceso = data.grupos_acceso
            ? data.grupos_acceso.split(',').map(Number)
            : [6, 13]
          me.tipoAcceso = data.tipo_acceso || 'grupos'
          me.usuariosAcceso = data.usuarios_acceso
            ? JSON.parse(data.usuarios_acceso)
            : []

          // Guardar nombre de la capacitación para el certificado
          if (data.nombre_entidad) {
            localStorage.setItem('nombreEntidadEncuesta', data.nombre_entidad)
            me.nombreEntidad = data.nombre_entidad
          }

          // Guardar fecha_fin para el certificado
          if (data.fecha_fin) {
            const fechaSola = data.fecha_fin.split(' ')[0]  // Extrae solo YYYY-MM-DD
            localStorage.setItem('fechaFinEncuesta', fechaSola)
            me.fechaFin = fechaSola;
          }

          // Guardar firma / P12 del capacitador para el certificado
          if (data.tipo_firma) {
            localStorage.setItem('tipoFirmaCapacitadorEncuesta', data.tipo_firma)
          } else {
            localStorage.removeItem('tipoFirmaCapacitadorEncuesta')
          }
          if (data.nombre_capacitador) {
            localStorage.setItem('nombreCapacitadorEncuesta', data.nombre_capacitador)
          } else {
            localStorage.removeItem('nombreCapacitadorEncuesta')
          }
          if (data.idusuario_capacitador) {
            localStorage.setItem('idusuarioCapacitadorEncuesta', String(data.idusuario_capacitador))
          } else {
            localStorage.removeItem('idusuarioCapacitadorEncuesta')
          }
          if (data.firma_capacitador) {
            localStorage.setItem('firmaCapacitadorEncuesta', data.firma_capacitador)
          } else {
            localStorage.removeItem('firmaCapacitadorEncuesta')
          }

          // Construir objeto encuesta con estado de la asignación
          me.encuesta = {
            ...data.encuesta,
            // La encuesta se considera "habilitada" solo si la asignación lo está
            estado: data.estado === 'habilitada' && data.encuesta.estado === 'habilitada'
              ? 'habilitada'
              : 'cerrada'
          }

          data.encuesta.preguntas.forEach(p => {
            me.$set(me.respuestas, p.id, (p.tipo === 'multiple' || p.tipo === 'casillas') ? [] : null)
            me.$set(me.hoverEscala, p.id, 0)
          })

          if (me.usuario) {
            // Validar acceso según tipo antes de continuar
            if (me.tipoAcceso === 'usuarios') {
              const ids = me.usuariosAcceso.map(Number)
              if (!ids.includes(me.usuario.idusuario)) {
                me.usuario = null
                localStorage.removeItem('userEncuestaProlipa')
                me.yaRespondio = false
                me.errorLogin = 'No tienes acceso a esta encuesta'
                return
              }
            } else if (!me.gruposAcceso.includes(me.usuario.id_group)) {
              me.usuario = null
              localStorage.removeItem('userEncuestaProlipa')
              me.yaRespondio = false
              me.errorLogin = 'No tienes acceso a esta encuesta'
              return
            }
            me.verificarYaRespondio()
          } else {
            me.yaRespondio = false
          }
        })
        .catch(() => {
          me.encuesta = null
          me.yaRespondio = false
        })
    },

    /** Modo legacy: carga por código de encuesta */
    cargarEncuesta() {
      let me = this
      me.$http.get(me.$server_url + 'encuesta_prolipa/codigo/' + me.codigo)
        .then(res => {
          me.encuesta = res.data
          res.data.preguntas.forEach(p => {
            me.$set(me.respuestas, p.id, (p.tipo === 'multiple' || p.tipo === 'casillas') ? [] : null)
            me.$set(me.hoverEscala, p.id, 0)
          })
          if (me.usuario) {
            me.verificarYaRespondio()
          } else {
            me.yaRespondio = false
          }
        })
        .catch(() => {
          me.encuesta = null
          me.yaRespondio = false
        })
    },

    verificarYaRespondio() {
      let me = this
      const params = me.asignacionId ? `?asignacion_id=${me.asignacionId}` : ''
      me.$http.get(me.$server_url + 'encuesta_prolipa/' + me.encuesta.id + '/ya_respondio/' + me.usuario.idusuario + params)
        .then(res => {
          if (res.data.ya_respondio) {
            me.yaRespondio = true
            localStorage.setItem('dataEncuestaCertificado', JSON.stringify(me.encuesta))
          } else {
            me.yaRespondio = false
          }
        })
        .catch(() => { me.yaRespondio = false })
    },

    ingresar() {
      let me = this
      me.errorLogin = ''
      if (!me.cedula || me.cedula.length < 2) { me.errorLogin = 'Ingresa una cédula válida'; return }

      me.cargando = true

      // Parámetros según modo
      const params = { cedula: me.cedula }
      if (me.modo === 'asignacion' && me.asignacionId) {
        params.asignacion_id = me.asignacionId
      } else if (me.encuesta) {
        params.encuesta_id = me.encuesta.id
      }

      const query = Object.keys(params).map(k => k + '=' + params[k]).join('&')

      me.$http.get(me.$server_url + 'verificarCedulaDocente?' + query)
        .then(res => {
          me.cargando = false
          if (res.data.status === 1) {
            me.usuario = res.data.usuario
            localStorage.setItem('userEncuestaProlipa', JSON.stringify(res.data.usuario))
            me.yaRespondio = null
            if (me.encuesta) me.verificarYaRespondio()
          } else {
             if (res.data.status === 2) {
                me.$vs.notify({
                text: res.data.message,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-circle',
                time: 5000
              })
              return 
             }
            // Usuario no encontrado, mostrar notificación y formulario de registro
            me.$vs.notify({
              text: 'Su cédula no se encuentra registrada. Por favor complete el formulario de registro.',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-circle',
              time: 5000
            })
            me.mostrarFormularioRegistro()
          }
        })
        .catch(() => { 
          me.cargando = false
          me.errorLogin = 'Error de conexión, intenta nuevamente'
        })
    },

    mostrarFormularioRegistro() {
      this.datosRegistro.cedula = this.cedula
      this.mostrarRegistro = true
      this.errorLogin = ''
    },

    cancelarRegistro() {
      this.mostrarRegistro = false
      this.datosRegistro = {
        cedula: '',
        nombres: '',
        apellidos: '',
        email: '',
        telefono: ''
      }
      this.errorRegistro = ''
    },

    validarTelefono() {
      // Solo permitir números y limitar a 10 dígitos
      this.datosRegistro.telefono = this.datosRegistro.telefono.replace(/[^\d]/g, '').substring(0, 10)
    },

    registrarUsuario() {
      let me = this
      me.errorRegistro = ''

      // Limpiar espacios de los campos
      me.datosRegistro.nombres = me.datosRegistro.nombres.trim()
      me.datosRegistro.apellidos = me.datosRegistro.apellidos.trim()
      me.datosRegistro.email = me.datosRegistro.email.trim()
      me.datosRegistro.telefono = me.datosRegistro.telefono.trim()

      // Validaciones
      if (!me.datosRegistro.cedula || me.datosRegistro.cedula.length < 10) {
        me.errorRegistro = 'La cédula debe tener al menos 10 dígitos'
        return
      }
      if (!me.datosRegistro.nombres || me.datosRegistro.nombres.length < 2) {
        me.errorRegistro = 'Ingresa tus nombres (mínimo 2 caracteres)'
        return
      }
      if (me.datosRegistro.nombres.length > 200) {
        me.errorRegistro = 'Los nombres no pueden exceder 200 caracteres'
        return
      }
      if (!me.datosRegistro.apellidos || me.datosRegistro.apellidos.length < 2) {
        me.errorRegistro = 'Ingresa tus apellidos (mínimo 2 caracteres)'
        return
      }
      if (me.datosRegistro.apellidos.length > 200) {
        me.errorRegistro = 'Los apellidos no pueden exceder 200 caracteres'
        return
      }
      if (!me.datosRegistro.email || !me.datosRegistro.email.includes('@')) {
        me.errorRegistro = 'Ingresa un correo electrónico válido'
        return
      }
      if (me.datosRegistro.email.length > 200) {
        me.errorRegistro = 'El correo no puede exceder 200 caracteres'
        return
      }
      if (me.datosRegistro.telefono && me.datosRegistro.telefono.length > 10) {
        me.errorRegistro = 'El teléfono no puede exceder 10 dígitos'
        return
      }

      me.registrando = true

      const formData = new FormData()
      formData.append('cedula', me.datosRegistro.cedula)
      formData.append('nombres', me.datosRegistro.nombres)
      formData.append('apellidos', me.datosRegistro.apellidos)
      formData.append('email', me.datosRegistro.email)
      formData.append('telefono', me.datosRegistro.telefono || '')
      formData.append('institucion', '1658') // Institución por defecto

      me.$http.post(me.$server_url + 'registerEncuesta', formData)
        .then(res => {
          me.registrando = false
          if (res.data && res.data.data) {
            // Registro exitoso, guardar usuario y continuar
            me.usuario = res.data.data
            localStorage.setItem('userEncuestaProlipa', JSON.stringify(res.data.data))
            me.mostrarRegistro = false
            me.yaRespondio = null
            if (me.encuesta) me.verificarYaRespondio()
            
            me.$vs.notify({
              text: 'Registro completado exitosamente',
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-check',
              time: 3000
            })
          } else {
            me.errorRegistro = 'Error al procesar el registro'
          }
        })
        .catch(err => {
          me.registrando = false
          if (err.response && err.response.status === 422 && err.response.data.errors) {
            // Recopilar todos los errores y mostrarlos separados por comas
            const errors = err.response.data.errors
            const mensajes = []
            
            Object.keys(errors).forEach(campo => {
              if (Array.isArray(errors[campo])) {
                mensajes.push(...errors[campo])
              } else {
                mensajes.push(errors[campo])
              }
            })
            
            me.errorRegistro = mensajes.join(', ')
          } else {
            me.errorRegistro = 'Error de conexión, intenta nuevamente'
          }
        })
    },

    cerrarSesion() {
      this.usuario = null
      this.yaRespondio = false
      localStorage.removeItem('userEncuestaProlipa')
      localStorage.removeItem('nombreEntidadEncuesta')
      // localStorage.removeItem('firmaCapacitadorEncuesta')
      localStorage.removeItem('fechaFinEncuesta')
    },

    setEscala(preguntaId, valor, escalaMax = 10) {
      if (valor < 1 || valor > escalaMax) return
      this.$set(this.respuestas, preguntaId, valor)
    },

    irCertificado() {
      // Guardar asignacion_id para que el certificado pueda registrar la descarga
      if (this.asignacionId) {
        localStorage.setItem('asignacionIdEncuesta', this.asignacionId)
      } else {
        localStorage.removeItem('asignacionIdEncuesta')
      }
      window.open('/encuesta/prolipa/certificado', '_blank')
    },

    enviarRespuestas() {
      let me = this
      me.errorEnvio = ''

      for (let p of me.encuesta.preguntas) {
        const r = me.respuestas[p.id]
        if ((p.tipo === 'simple' || p.tipo === 'escala') && !r) { me.errorEnvio = 'Por favor califica todas las preguntas'; return }
        if ((p.tipo === 'simple' || p.tipo === 'escala') && (r < 1 || r > (p.escala_maxima || 10))) { me.errorEnvio = 'Valor fuera de rango'; return }
        if ((p.tipo === 'multiple' || p.tipo === 'casillas') && (!r || r.length === 0)) { me.errorEnvio = 'Selecciona al menos una opción en cada pregunta'; return }
        if (p.tipo === 'abierta' && (!r || !r.trim())) { me.errorEnvio = 'Completa todas las preguntas abiertas'; return }
      }

      const respuestas = me.encuesta.preguntas.map(p => {
        const r = me.respuestas[p.id]
        if (p.tipo === 'simple') return { pregunta_id: p.id, tipo: 'simple', valor: r }
        if (p.tipo === 'escala') return { pregunta_id: p.id, tipo: 'escala', valor: r }
        if (p.tipo === 'multiple') return { pregunta_id: p.id, tipo: 'multiple', opciones: r }
        if (p.tipo === 'casillas') return { pregunta_id: p.id, tipo: 'casillas', opciones: r }
        if (p.tipo === 'abierta') return { pregunta_id: p.id, tipo: 'abierta', texto: r }
      })

      const payload = {
        encuesta_id: me.encuesta.id,
        usuario_id: me.usuario.idusuario,
        respuestas
      }

      // Incluir asignacion_id si estamos en modo asignación
      if (me.modo === 'asignacion' && me.asignacionId) {
        payload.asignacion_id = me.asignacionId
      }

      me.enviando = true
      me.$http.post(me.$server_url + 'encuesta_prolipa/responder', payload)
        .then(res => {
          me.enviando = false
          if (res.data.status === 1) {
            localStorage.setItem('dataEncuestaCertificado', JSON.stringify(me.encuesta))
            me.respondida = true
          } else {
            me.errorEnvio = res.data.message || 'Error al enviar'
          }
        })
        .catch(() => { me.enviando = false; me.errorEnvio = 'Error de conexión, intenta nuevamente' })
    }
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.login-card {
  background: rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 2.5rem;
  width: 100%;
  max-width: 440px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.logo-circle {
  width: 70px;
  height: 70px;
  background: rgba(59, 130, 246, 0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.login-header h2 {
  color: #e2e8f0;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.login-header p {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0;
}

.encuesta-info {
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 0.75rem;
  padding: 0.875rem 1rem;
  color: #cbd5e1;
  margin-bottom: 1.25rem;
  font-size: 0.95rem;
}

.institucion-badge {
  display: inline-block;
  margin-top: 0.5rem;
  background: rgba(99, 102, 241, 0.15);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: 0.5rem;
  padding: 0.25rem 0.6rem;
  font-size: 0.8rem;
  color: #a5b4fc;
}

.alert-cerrada {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 0.75rem;
  padding: 1rem;
  color: #fca5a5;
  text-align: center;
  font-size: 0.9rem;
}

.input-label {
  display: block;
  color: #cbd5e1;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.modern-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
  box-sizing: border-box;
}

.modern-input:focus {
  border-color: #3b82f6;
}

.modern-input::placeholder {
  color: #64748b;
}

.btn-login {
  width: 100%;
  margin-top: 1rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #f87171;
  font-size: 0.85rem;
  margin-top: 0.75rem;
}

.resultado-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.resultado-card {
  text-align: center;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1.5rem;
  padding: 3rem 2rem;
  max-width: 400px;
  width: 100%;
}

.resultado-card h2 {
  color: #e2e8f0;
  font-size: 1.5rem;
  margin: 1rem 0 0.5rem;
}

.resultado-card p {
  color: #94a3b8;
  margin: 0;
}

.encuesta-container {
  max-width: 680px;
  margin: 0 auto;
  padding: 1.5rem;
}

.encuesta-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e5e7eb;
}

.encuesta-header h3 {
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.25rem;
}

.instruccion-banner {
  background: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 0.5rem;
  padding: 0.6rem 0.875rem;
  font-size: 0.875rem;
  color: #1e40af;
  margin: 0.75rem 0 0;
}

.usuario-badge {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.75rem;
  font-size: 0.9rem;
  color: #6b7280;
}

.btn-salir {
  background: none;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 0.2rem 0.6rem;
  font-size: 0.8rem;
  cursor: pointer;
  color: #6b7280;
}

.btn-salir:hover {
  background: #f3f4f6;
}

.pregunta-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.pregunta-numero {
  font-size: 0.75rem;
  color: #9ca3af;
  font-weight: 600;
  margin: 0 0 0.25rem;
  text-transform: uppercase;
}

.pregunta-texto {
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 1rem;
}

.escala-numerica-container {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.escala-num-btn {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.5rem;
  border: 2px solid #d1d5db;
  background: white;
  font-weight: 700;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.15s;
  color: #374151;
}

.escala-num-btn:hover {
  border-color: #3b82f6;
  color: #3b82f6;
}

.escala-num-btn.activo {
  background: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.estrellas-container {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.estrella {
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.1s;
  user-select: none;
}

.estrella:hover {
  transform: scale(1.2);
}

.escala-valor {
  margin-left: 0.75rem;
  font-size: 0.9rem;
  font-weight: 700;
  color: #f59e0b;
}

.opciones-container {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.opcion-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  cursor: pointer;
  font-size: 0.95rem;
}

.opcion-item:hover {
  background: #f9fafb;
}

.textarea-abierta {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  font-size: 0.95rem;
  resize: vertical;
  outline: none;
  box-sizing: border-box;
}

.textarea-abierta:focus {
  border-color: #3b82f6;
}

.btn-enviar {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, #059669, #10b981);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 0.5rem;
}

.btn-enviar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-certificado {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #7c3aed, #a855f7);
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
}

.btn-certificado:hover {
  opacity: 0.85;
}

.btn-salir-resultado {
  display: block;
  width: 100%;
  padding: 0.6rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  color: #94a3b8;
  font-size: 0.85rem;
  cursor: pointer;
}

.btn-salir-resultado:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #e2e8f0;
}

.form-registro {
  margin-top: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.btn-cancelar {
  width: 100%;
  margin-top: 0.75rem;
  padding: 0.75rem;
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 0.75rem;
  color: #94a3b8;
  font-size: 0.9rem;
  cursor: pointer;
}

.btn-cancelar:hover {
  background: rgba(255, 255, 255, 0.05);
  color: #e2e8f0;
}

@media (max-width: 640px) {
  .encuesta-container {
    padding: 1rem;
  }

  .estrella {
    font-size: 1.6rem;
  }
}
</style>
