<template>
  <div class="login-bodega-container">
    <div class="particles-background">
      <div class="particle" v-for="n in 20" :key="n" :style="getParticleStyle(n)"></div>
    </div>

    <div class="login-content">
      <div class="login-header">
        <div class="logo-container">
          <div class="logo-circle">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
        </div>
        <h1 class="main-title">Escáner Bodega</h1>
        <p class="subtitle">Sistema de control de despachos</p>
      </div>

      <div class="login-card">
        <div class="card-glow"></div>

        <div class="login-form">
          <div class="form-header">
            <div class="icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2>Acceso al Sistema</h2>
            <p>Ingresa tu cédula para continuar</p>
          </div>

          <div class="form-body">
            <div class="input-group" :class="{ 'focused': inputFocused, 'has-value': cedula.length > 0 }">
              <label class="input-label">Número de Cédula</label>
              <div class="input-wrapper">
                <div class="input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>
                <input type="text" v-model="cedula" @focus="inputFocused = true" @blur="inputFocused = false"
                  @keyup.enter="verificarAcceso()" placeholder="Ingrese su cédula" class="modern-input"
                  maxlength="15" />
              </div>
            </div>

            <button @click="verificarAcceso()" class="btn-login" :disabled="cargando">
              <div v-if="cargando" class="loading-spinner"></div>
              <svg v-else xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span>Ingresar al Sistema</span>
            </button>

            <div class="info-box">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Solo personal autorizado de bodega puede acceder</p>
            </div>
          </div>
        </div>
      </div>

      <div class="login-footer">
        <p>© 2026 Prolipa - Sistema de Escáner Bodega</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginBodega',

  data() {
    return {
      cedula: '',
      inputFocused: false,
      cargando: false
    }
  },

  methods: {
    getParticleStyle(n) {
      const size = Math.random() * 4 + 2
      const duration = Math.random() * 20 + 10
      const delay = Math.random() * 5
      const left = Math.random() * 100
      return {
        width: size + 'px',
        height: size + 'px',
        left: left + '%',
        animationDuration: duration + 's',
        animationDelay: delay + 's'
      }
    },

    verificarAcceso() {
      if (this.cedula.length < 2) {
        this.$vs.notify({
          color: 'warning',
          title: 'Validación',
          text: 'La cédula debe tener al menos 2 caracteres'
        })
        return false
      }

      this.cargando = true

      this.$http.get(this.$server_url + 'verificarAccesoBodega?cedula=' + this.cedula)
        .then((response) => {
          this.cargando = false
          
          if (response.data.status === 1 && response.data.usuario) {
            localStorage.setItem('userBodega', JSON.stringify(response.data.usuario))

            this.$vs.notify({
              text: 'Bienvenido ' + response.data.usuario.nombres + '!',
              color: 'success',
              time: 2000,
              iconPack: 'feather',
              icon: 'icon-check'
            })

            this.$router.push('/bodega/escanear')
          } else {
            this.$vs.notify({
              title: 'Acceso Denegado',
              text: response.data.message || 'No tiene permisos',
              color: 'warning',
              time: 4000
            })
          }
        })
        .catch((error) => {
          this.cargando = false
          console.error('Error:', error)
          this.$vs.notify({
            title: 'Error de Conexión',
            text: 'No se pudo verificar el acceso',
            color: 'danger',
            time: 4000
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
$primary: #2563eb;
$gradient-primary: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);

.login-bodega-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

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
  box-shadow: 0 8px 30px rgba(37, 99, 235, 0.25);
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
    box-shadow: 0 8px 30px rgba(37, 99, 235, 0.25);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 12px 40px rgba(37, 99, 235, 0.35);
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

.login-footer {
  text-align: center;
  margin-top: 2rem;
  color: #64748b;
  font-size: 0.875rem;

  p {
    margin: 0;
  }
}

@media (max-width: 640px) {
  .login-bodega-container {
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
</style>