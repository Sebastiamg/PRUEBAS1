<template>
  <div class="login-planificaciones-container">
    <!-- Partículas de fondo animadas -->
    <div class="particles-background">
      <div class="particle" v-for="n in 20" :key="n" :style="getParticleStyle(n)"></div>
    </div>

    <!-- Contenedor principal con animación de entrada -->
    <div class="login-content" :class="{ 'fade-in': true }">
      <!-- Header con logo y título -->
      <div class="login-header">
        <div class="logo-container">
          <div class="logo-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <h1 class="main-title">Planificaciones Prolipa</h1>
        <p class="subtitle">Sistema de gestión de actividades y seguimiento</p>
      </div>

      <!-- Card de login -->
      <div class="login-card">
        <div class="card-glow"></div>
        
        <!-- Indicador de estado -->
        <div class="status-indicator" v-if="cedulaExiste == 1">
          <div class="status-icon success">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="status-text">
            <h3>¡Bienvenido!</h3>
            <p>Sesión iniciada correctamente</p>
          </div>
          <button @click="cerrarSession()" class="btn-logout">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión
          </button>
        </div>

        <!-- Formulario de login -->
        <div v-else class="login-form">
          <div class="form-header">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2>Acceso al Sistema</h2>
            <p>Ingresa tu cédula para continuar</p>
          </div>

          <div class="form-body">
            <!-- Input de cédula con diseño moderno -->
            <div class="input-group" :class="{ 'focused': inputFocused, 'has-value': cedula.length > 0 }">
              <label class="input-label">Número de Cédula</label>
              <div class="input-wrapper">
                <div class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <input
                  type="text"
                  v-model="cedula"
                  @focus="inputFocused = true"
                  @blur="inputFocused = false"
                  @keyup.enter="IngresoPlanificaciones()"
                  placeholder="Ingrese su cédula"
                  class="modern-input"
                  maxlength="15"
                />
                <div class="input-border"></div>
              </div>
              <div class="input-hint" v-if="cedula.length > 0">
                <span :class="{ 'valid': cedula.length >= 2 && cedula.length <= 15, 'invalid': cedula.length < 2 || cedula.length > 15 }">
                  {{ cedula.length }} caracteres
                </span>
              </div>
            </div>

            <!-- Botón de ingreso con animación -->
            <button 
              @click="IngresoPlanificaciones()" 
              class="btn-login"
              :disabled="cargando"
            >
              <div v-if="cargando" class="loading-spinner"></div>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span>Ingresar al Sistema</span>
            </button>

            <!-- Información adicional -->
            <div class="info-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Solo asesores activos pueden acceder al sistema</p>
            </div>
          </div>
        </div>
      </div>
     
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginPlanificaciones',
  
  data: () => ({
    inicio: 'ingreso',
    cedula: '',
    cedulaExiste: 0,
    user: [],
    inputFocused: false,
    cargando: false
  }),

  created() {
    let me = this
    // Intentar cargar usuario desde localStorage
    const userPlanificaciones = localStorage.getItem("userPlanificaciones")
    if (userPlanificaciones) {
      try {
        me.user = JSON.parse(userPlanificaciones)
        if (me.user && me.user.cedula && me.user.cedula.length > 5) {
          me.cedulaExiste = 1
          me.$emit('login-success', me.user)
        }
      } catch (error) {
        console.error('Error al parsear userPlanificaciones:', error)
        localStorage.removeItem("userPlanificaciones")
      }
    }
  },

  methods: {
    getParticleStyle(n) {
      const size = Math.random() * 4 + 2
      const duration = Math.random() * 20 + 10
      const delay = Math.random() * 5
      const left = Math.random() * 100
      
      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`
      }
    },

    cerrarSession() {
      let me = this
      me.cedulaExiste = 0
      me.cedula = ''
      me.user = []
      localStorage.removeItem('userPlanificaciones')
      me.$emit('logout')
      me.$vs.notify({
        text: 'Sesión cerrada correctamente',
        color: 'success',
        time: 3000,
        iconPack: 'feather',
        icon: 'icon-check'
      })
    },

    IngresoPlanificaciones() {
      let me = this
      
      if (me.cedula.length < 2) {
        me.$vs.notify({
          color: 'warning',
          title: 'Validación',
          text: 'La cédula debe tener al menos 2 caracteres'
        })
        return false
      }

      if (me.cedula.length > 15) {
        me.$vs.notify({
          color: 'warning',
          title: 'Validación',
          text: 'La cédula no puede tener más de 15 caracteres'
        })
        return false
      }
      
      me.verificarExistenciaCedula()
    },

    verificarExistenciaCedula() {
      let me = this
      me.cargando = true
      
      this.$http.get(this.$server_url + 'verificarCedulaAsesor?cedula=' + me.cedula)
        .then(function (response) {
          me.cargando = false
          
          if (response.data.status === 1 && response.data.usuario) {
            me.cedulaExiste = 1
            me.user = response.data.usuario
            
            // Guardar en localStorage con clave específica
            localStorage.setItem('userPlanificaciones', JSON.stringify(response.data.usuario))
            
            me.$vs.notify({
              text: '¡Bienvenido! Acceso concedido',
              color: 'success',
              time: 4000,
              iconPack: 'feather',
              icon: 'icon-check'
            })
            
            // Emitir evento de login exitoso
            me.$emit('login-success', response.data.usuario)
          } else {
            me.$vs.notify({
              title: 'Acceso Denegado',
              text: 'No se encontró un asesor activo con esta cédula',
              color: 'warning',
              time: 4000,
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
          }
        })
        .catch(function (error) {
          me.cargando = false
          console.error('Error al verificar cédula:', error)
          me.$vs.notify({
            title: 'Error de Conexión',
            text: 'No se pudo verificar la cédula. Intente nuevamente',
            color: 'danger',
            time: 4000,
            iconPack: 'feather',
            icon: 'icon-alert-circle'
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
// Variables
$primary: #1e40af;
$primary-light: #3b82f6;
$primary-dark: #1e3a8a;
$success: #10b981;
$warning: #f59e0b;
$danger: #ef4444;
$gradient-1: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
$gradient-2: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
$gradient-3: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
$gradient-primary: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);

// Contenedor principal
.login-planificaciones-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

// Partículas de fondo
.particles-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.particle {
  position: absolute;
  background: rgba(59, 130, 246, 0.15);
  border-radius: 50%;
  animation: float linear infinite;
  pointer-events: none;
}

@keyframes float {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100vh) rotate(360deg);
    opacity: 0;
  }
}

// Contenido principal
.login-content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 480px;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Header
.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo-container {
  display: flex;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.logo-circle {
  width: 80px;
  height: 80px;
  background: $gradient-primary;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 30px rgba(59, 130, 246, 0.25);
  animation: pulse 2s ease-in-out infinite;
  
  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 8px 30px rgba(59, 130, 246, 0.25);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 40px rgba(59, 130, 246, 0.35);
  }
}

.main-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #e2e8f0;
  margin: 0 0 0.5rem 0;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.subtitle {
  color: #94a3b8;
  font-size: 1rem;
  margin: 0;
}

// Card de login
.login-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 2.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

.card-glow {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%);
  animation: rotate 20s linear infinite;
  pointer-events: none;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Indicador de estado (sesión iniciada)
.status-indicator {
  position: relative;
  z-index: 1;
  text-align: center;
  animation: fadeIn 0.5s ease-out;
}

.status-icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &.success {
    background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    box-shadow: 0 10px 30px rgba(16, 185, 129, 0.4);
  }
  
  svg {
    width: 40px;
    height: 40px;
    color: white;
  }
}

.status-text {
  margin-bottom: 2rem;
  
  h3 {
    color: white;
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
  }
  
  p {
    color: #94a3b8;
    margin: 0;
  }
}

.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: rgba(239, 68, 68, 0.1);
  border: 2px solid rgba(239, 68, 68, 0.3);
  border-radius: 0.75rem;
  color: #fca5a5;
  font-weight: 600;
  font-size: 0.9375rem;
  cursor: pointer;
  transition: all 0.3s;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  &:hover {
    background: rgba(239, 68, 68, 0.2);
    border-color: rgba(239, 68, 68, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(239, 68, 68, 0.2);
  }
}

// Formulario de login
.login-form {
  position: relative;
  z-index: 1;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.icon-wrapper {
  width: 60px;
  height: 60px;
  margin: 0 auto 1rem;
  background: rgba(59, 130, 246, 0.08);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 30px;
    height: 30px;
    color: #60a5fa;
  }
}

.form-header h2 {
  color: white;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
}

.form-header p {
  color: #94a3b8;
  font-size: 0.9375rem;
  margin: 0;
}

// Input group
.input-group {
  margin-bottom: 1.5rem;
  position: relative;
}

.input-label {
  display: block;
  color: #cbd5e1;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  transition: all 0.3s;
}

.input-wrapper {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #64748b;
    transition: all 0.3s;
  }
}

.modern-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.75rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s;
  position: relative;
  z-index: 1;
  
  &::placeholder {
    color: #64748b;
  }
  
  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.08);
    border-color: #2563eb;
    box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
  }
}

.input-group.focused {
  .input-label {
    color: #2563eb;
  }
  
  .input-icon svg {
    color: #2563eb;
  }
}

.input-hint {
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  
  span {
    &.valid {
      color: #10b981;
    }
    
    &.invalid {
      color: #f59e0b;
    }
  }
}

// Botón de login
.btn-login {
  width: 100%;
  padding: 1rem;
  background: $gradient-primary;
  border: none;
  border-radius: 0.75rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 8px 25px rgba(37, 99, 235, 0.25);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 12px 35px rgba(37, 99, 235, 0.3);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    cursor: not-allowed;
  }
}

.loading-spinner {
  width: 1.125rem;
  height: 1.125rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

// Info box
.info-box {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 1rem;
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.15);
  border-radius: 0.75rem;
  
  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #60a5fa;
    flex-shrink: 0;
    margin-top: 0.125rem;
  }
  
  p {
    color: #cbd5e1;
    font-size: 0.875rem;
    margin: 0;
    line-height: 1.5;
  }
}

// Footer
.login-footer {
  text-align: center;
  margin-top: 2rem;
  color: #64748b;
  font-size: 0.875rem;
  
  p {
    margin: 0 0 0.5rem 0;
  }
}

.footer-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  
  a {
    color: #94a3b8;
    text-decoration: none;
    transition: color 0.3s;
    
    &:hover {
      color: #3b82f6;
    }
  }
  
  span {
    color: #475569;
  }
}

// Responsive
@media (max-width: 640px) {
  .login-planificaciones-container {
    padding: 1rem;
  }
  
  .main-title {
    font-size: 2rem;
  }
  
  .login-card {
    padding: 1.5rem;
  }
  
  .logo-circle {
    width: 60px;
    height: 60px;
    
    svg {
      width: 30px;
      height: 30px;
    }
  }
}

// Animaciones adicionales
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
