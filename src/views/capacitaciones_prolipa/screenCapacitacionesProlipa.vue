<template>
  <div class="capacitaciones-container">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'ScreenCapacitacionesProlipaPadre',
  mounted() {
    this.verificarSesionLocal();
  },
  methods: {
    verificarSesionLocal() {
      const userCapacitaciones = localStorage.getItem('userCapacitaciones');
      
      if (!userCapacitaciones) {
        // No hay sesión, redirigir al login
        this.irAlLogin();
        return;
      }

      try {
        const user = JSON.parse(userCapacitaciones);
        
        // Validar que el objeto user tenga los campos requeridos
        if (!user || !user.idusuario || !user.cedula || !user.tdp_id) {
          // Datos incompletos, limpiar y redirigir al login
          this.irAlLogin();
          return;
        }

        // Usuario válido - dejar que la navegación fluya naturalmente
        // No forzar ninguna redirección aquí
        
      } catch (err) {
        // Error al parsear JSON, limpiar y redirigir al login
        this.irAlLogin();
      }
    },
    irAlLogin() {
      localStorage.removeItem('userCapacitaciones');
      this.$router.push({ name: 'capacitaciones_prolipa_login' }).catch(() => {});
    }
  }
};
</script>

<style scoped>
.capacitaciones-container {
  width: 100%;
  height: 100%;
}
</style>
