<template>
  <div>
    <!-- Mostrar login si no hay sesión -->
    <LoginPlanificaciones
      v-if="!usuarioLogueado"
      @login-success="handleLoginSuccess"
      @logout="handleLogout"
    />

    <!-- Mostrar la vista principal si hay sesión -->
    <ScreenPlanificacionesAgenda
      v-else
      :usuarioExterno="usuario"
      @logout="cerrarSesion"
    />
  </div>
</template>

<script>
import LoginPlanificaciones from './LoginPlanificaciones.vue'
import ScreenPlanificacionesAgenda from './ScreenPlanificacionesAgenda.vue'

export default {
  name: 'IndexPlanificaciones',
  components: {
    LoginPlanificaciones,
    ScreenPlanificacionesAgenda
  },
  data() {
    return {
      usuario: null,
      usuarioLogueado: false
    }
  },
  created() {
    this.verificarSesion()
  },
  methods: {
    verificarSesion() {
      const userPlanificaciones = localStorage.getItem('userPlanificaciones')
      if (userPlanificaciones) {
        try {
          this.usuario = JSON.parse(userPlanificaciones)
          this.usuarioLogueado = true
        } catch (error) {
          console.error('Error al parsear usuario:', error)
          localStorage.removeItem('userPlanificaciones')
        }
      }
    },

    handleLoginSuccess(usuario) {
      this.usuario = usuario
      this.usuarioLogueado = true
    },

    handleLogout() {
      this.cerrarSesion()
    },

    cerrarSesion() {
      this.usuario = null
      this.usuarioLogueado = false
      localStorage.removeItem('userPlanificaciones')
    }
  }
}
</script>