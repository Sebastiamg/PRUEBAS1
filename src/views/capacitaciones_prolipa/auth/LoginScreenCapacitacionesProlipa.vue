<template>
  <div class="login-container">
    <div class="particles-wrapper">
      <div
        v-for="n in 15"
        :key="n"
        :style="getParticleStyle(n)"
        class="particle"
      ></div>
    </div>

    <div class="login-content">

      <div class="brand-header">
        <div class="logo-wrapper">
          <div class="logo-bg"></div>
          <div class="logo-box">
            <svg class="icon-main" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
        <h1>Capacitaciones Prolipa</h1>
        <p class="subtitle">Sistema de reportes administrativos y Talento Humano</p>
      </div>

      <div class="login-card">

        <div v-if="cedulaExiste" class="session-active animate-fade-in">
          <div class="success-icon-wrapper">
            <div class="success-glow"></div>
            <div class="success-icon-box">
              <svg class="icon-check" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          <div class="text-space">
            <h3>¡Bienvenido de vuelta!</h3>
            <p>Tu sesión institucional se encuentra activa.</p>
          </div>

          <button @click="cerrarSession()" class="btn-logout">
            <svg class="icon-btn" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Cerrar Sesión Activa
          </button>
        </div>

        <div v-else class="form-wrapper">
          <div class="form-header">
            <div class="lock-icon-box">
              <svg class="icon-lock" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2>Acceso Seguro</h2>
          </div>

          <div class="form-body">
            <div class="input-group">
              <label :class="{'label-focus': inputFocused}">Número de Cédula</label>

              <div class="input-relative">
                <div class="input-icon-left">
                  <svg :class="inputFocused ? 'icon-focus' : 'icon-blur'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                  </svg>
                </div>

                <input
                  type="text"
                  v-model="cedula"
                  @focus="inputFocused = true"
                  @blur="inputFocused = false"
                  @keyup.enter="enviarCedula()"
                  placeholder="0000000000"
                  maxlength="10"
                  :class="['input-field', {'input-field-focus': inputFocused}]"
                />
              </div>

              <div v-if="cedula.length > 0" class="char-counter text-xs">
                <span :class="cedula.length === 10 ? 'text-blue' : 'text-amber'">
                  {{ cedula.length }} / 10 dígitos ingresados
                </span>
              </div>
            </div>

            <div class="input-group">
              <label :class="{'label-focus': passwordFocused}">Contraseña</label>

              <div class="input-relative">
                <div class="input-icon-left">
                  <svg :class="passwordFocused ? 'icon-focus' : 'icon-blur'" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </div>

                <input
                  type="password"
                  v-model="password"
                  @focus="passwordFocused = true"
                  @blur="passwordFocused = false"
                  @keyup.enter="enviarCedula()"
                  placeholder="••••••••"
                  :class="['input-field', {'input-field-focus': passwordFocused}]"
                />
              </div>
            </div>

            <div v-if="error" class="error-alert animate-fade-in">
              <svg class="icon-error" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{{ error }}</span>
            </div>

            <button
              @click="enviarCedula()"
              class="btn-submit"
              :disabled="cargando"
            >
              <div v-if="cargando" class="spinner"></div>
              <span v-else class="btn-content">
                Autenticar Cuenta
                <svg class="icon-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </span>
            </button>

            <div class="info-banner">
              <svg class="icon-info" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Acceso corporativo de uso exclusivo para colaboradores de <span class="highlight">Prolipa</span>.</p>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginCapacitaciones',
  emits: ['autenticado', 'logout'],

  data() {
    return {
      cedula: '',
      password: '',
      cargando: false,
      error: null,
      cedulaExiste: false,
      user: null,
      inputFocused: false,
      passwordFocused: false
    };
  },

  mounted() {
    const userCapacitaciones = localStorage.getItem("userCapacitaciones");
    if (userCapacitaciones) {
      try {
        this.user = JSON.parse(userCapacitaciones);
        if (this.user && this.user.cedula && this.user.cedula.length >= 10) {
          this.cedulaExiste = true;
          this.$emit('autenticado', this.user);

          // Redireccionar automáticamente si ya tiene una sesión guardada
          this.redireccionarUsuario(this.user);
        }
      } catch (err) {
        localStorage.removeItem('userCapacitaciones');
      }
    }
  },

  methods: {
    getParticleStyle(n) {
      const size = Math.random() * 3 + 1.5;
      const duration = Math.random() * 15 + 12;
      const delay = Math.random() * -10;
      const left = Math.random() * 100;

      return {
        width: `${size}px`,
        height: `${size}px`,
        left: `${left}%`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`
      };
    },

    cerrarSession() {
      this.cedulaExiste = false;
      this.cedula = '';
      this.password = '';
      this.user = null;
      this.error = null;
      localStorage.removeItem('userCapacitaciones');
      this.$emit('logout');
    },

    esCedulaValida(ced) {
      if (ced.length !== 10) return false;
      if (!/^\d+$/.test(ced)) return false;

      const provincia = parseInt(ced.substring(0, 2), 10);
      if (provincia < 1 || provincia > 24) return false;

      const tercerDigito = parseInt(ced.substring(2, 3), 10);
      if (tercerDigito > 5) return false;

      const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
      let suma = 0;

      for (let i = 0; i < 9; i++) {
        let valor = parseInt(ced.charAt(i), 10) * coeficientes[i];
        if (valor > 9) valor -= 9;
        suma += valor;
      }

      const total = (Math.ceil(suma / 10) * 10) - suma;
      const digitoVerificador = parseInt(ced.charAt(9), 10);

      return total === digitoVerificador || (total === 10 && digitoVerificador === 0);
    },

    // Nueva función encargada exclusivamente del redireccionamiento de rutas
    redireccionarUsuario(usuario) {
      // Si es usuario de Prolipa, redirigir al panel de usuario
      if (parseInt(usuario.es_usuario_prolipa) === 1) {
        this.$router.push({ name: 'capacitaciones_prolipa_usuario' }).catch(() => {});
      } else {
        // Si no es usuario de Prolipa, no debería tener acceso
        // Podrías redirigir a una página de error o mostrar un mensaje
        this.error = 'No tiene permisos para acceder a este módulo';
        this.cerrarSession();
      }
    },

    async enviarCedula() {
      this.error = null;

      if (this.cedula.length < 10) {
        this.error = 'La cédula debe tener exactamente 10 caracteres.';
        return;
      }

      if (!this.esCedulaValida(this.cedula)) {
        this.error = 'El número de cédula ingresado no es válido para Ecuador.';
        return;
      }

      if (!this.password || this.password.trim() === '') {
        this.error = 'Debe ingresar su contraseña.';
        return;
      }

      this.cargando = true;

      try {
        const response = await this.$http.get(`${this.$server_url}verificarAccesoCapacitacionProlipa`,  {
          params: { 
            cedula: this.cedula,
            password: this.password
          }
        });

        if (response.data && response.data.success) {
          this.cedulaExiste = true;
          this.user = response.data.user;
          localStorage.setItem('userCapacitaciones', JSON.stringify(response.data.user));
          this.$emit('autenticado', this.user);

          // Ejecutamos el redireccionamiento tras el login exitoso
          this.redireccionarUsuario(this.user);
        } else {
          this.error = response.data.message || 'El colaborador no se encuentra registrado.';
        }
      } catch (err) {
        if (err.response && err.response.data && err.response.data.message) {
          this.error = err.response.data.message;
        } else {
          this.error = 'Error de comunicación con el servidor central.';
        }
      } finally {
        this.cargando = false;
      }
    }
  }
};
</script>

<style scoped>
/* -----------------------------------------
   ESTILOS BASE ESTRUCTURALES (Evitan roturas)
-------------------------------------------- */
.login-container {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 32px 16px;
  overflow: hidden;
  box-sizing: border-box;
  background: #0b0f19;
  background-image: radial-gradient(circle at 50% 50%, #1e2640 0%, #0b0f19 100%);
  font-family: system-ui, -apple-system, sans-serif;
}

.login-content {
  position: relative;
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  z-index: 10;
}

.brand-header {
  text-align: center;
  margin-bottom: 2rem;
}

.brand-header h1 {
  font-size: 1.85rem;
  font-weight: 800;
  color: #ffffff;
  margin: 12px 0 6px 0;
  letter-spacing: -0.025em;
}

.brand-header .subtitle {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}

.login-card {
  position: relative;
  padding: 2.5rem 2rem;
  border-radius: 24px;
  background-color: rgba(15, 23, 42, 0.65);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
}

/* -----------------------------------------
   ELEMENTOS DE DISEÑO (Logos e Iconos)
-------------------------------------------- */
.logo-wrapper {
  display: inline-block;
  position: relative;
}
.logo-bg {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(37, 99, 235, 0.25);
  border-radius: 20px;
  filter: blur(12px);
}
.logo-box {
  position: relative;
  padding: 14px;
  background-color: #0f172a;
  border: 1px solid rgba(59, 130, 246, 0.3);
  border-radius: 20px;
}
.icon-main {
  width: 32px;
  height: 32px;
  color: #60a5fa;
}

.form-header {
  text-align: center;
  margin-bottom: 1.5rem;
}
.form-header h2 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
  margin: 8px 0 0 0;
}
.lock-icon-box {
  width: 36px;
  height: 36px;
  margin: 0 auto;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
}
.icon-lock {
  width: 18px;
  height: 18px;
  color: #60a5fa;
}

/* Campos de entrada */
.input-group {
  margin-bottom: 1.25rem;
  text-align: left;
}
.input-group label {
  display: block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
  transition: color 0.2s ease;
}
.label-focus {
  color: #3b82f6 !important;
}
.input-relative {
  position: relative;
}
.input-icon-left {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 20;
  display: flex;
  align-items: center;
}
.input-icon-left svg {
  width: 20px;
  height: 20px;
  transition: color 0.2s ease;
}
.icon-focus { color: #3b82f6; }
.icon-blur { color: #475569; }

.input-field {
  width: 100%;
  padding: 12px 16px 12px 44px;
  background-color: rgba(2, 6, 23, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  box-sizing: border-box;
  transition: all 0.25s ease;
}
.input-field:hover {
  border-color: rgba(255, 255, 255, 0.15);
}
.input-field-focus {
  outline: none;
  border-color: #3b82f6 !important;
  background-color: rgba(2, 6, 23, 0.8) !important;
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.15);
}

.char-counter {
  margin-top: 6px;
  font-weight: 600;
}
.text-blue { color: #60a5fa; }
.text-amber { color: #f59e0b; }

/* Botón de envío */
.btn-submit {
  width: 100%;
  padding: 14px 20px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
}
.btn-submit:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.35);
}
.btn-submit:active:not(:disabled) {
  transform: translateY(1px);
}
.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.icon-arrow {
  width: 16px;
  height: 16px;
}

/* Banner Informativo */
.info-banner {
  display: flex;
  align-items: start;
  gap: 10px;
  padding: 12px;
  background-color: rgba(2, 6, 23, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  margin-top: 1.25rem;
  text-align: left;
}
.icon-info {
  width: 16px;
  height: 16px;
  color: #60a5fa;
  flex-shrink: 0;
  margin-top: 2px;
}
.info-banner p {
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.4;
}
.info-banner .highlight {
  color: #e2e8f0;
  font-weight: 600;
}

/* Alertas de error */
.error-alert {
  display: flex;
  align-items: start;
  gap: 10px;
  padding: 12px;
  background-color: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 12px;
  margin-bottom: 1.25rem;
  text-align: left;
  color: #fb7185;
  font-size: 0.8rem;
  font-weight: 500;
}
.icon-error {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  margin-top: 1px;
}

/* Estado de sesión activa */
.session-active {
  text-align: center;
  padding: 1rem 0;
}
.success-icon-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 1.5rem;
}
.success-glow {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(59, 130, 246, 0.25);
  border-radius: 50%;
  filter: blur(12px);
  transform: scale(1.3);
}
.success-icon-box {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.3);
}
.icon-check {
  width: 32px;
  height: 32px;
  color: #ffffff;
}
.text-space h3 {
  font-size: 1.35rem;
  color: #ffffff;
  margin: 0 0 6px 0;
}
.text-space p {
  font-size: 0.875rem;
  color: #94a3b8;
  margin: 0 0 2rem 0;
}
.btn-logout {
  width: 100%;
  padding: 12px 20px;
  background-color: rgba(244, 63, 94, 0.08);
  border: 1px solid rgba(244, 63, 94, 0.2);
  color: #fda4af;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
}
.btn-logout:hover {
  background-color: rgba(244, 63, 94, 0.15);
  border-color: rgba(244, 63, 94, 0.3);
}
.icon-btn {
  width: 16px;
  height: 16px;
}

/* Animación de partículas */
.particles-wrapper {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}
.particle {
  position: absolute;
  background-color: #3b82f6;
  border-radius: 50%;
  opacity: 0;
  animation: float linear infinite;
}

/* Spinner */
.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  margin: 0 auto;
  animation: spin 0.8s linear infinite;
}

/* Keyframes de animación */
@keyframes float {
  0% { transform: translateY(105vh) scale(0.8); opacity: 0; }
  15% { opacity: 0.25; }
  85% { opacity: 0.25; }
  100% { transform: translateY(-5vh) scale(1.2); opacity: 0; }
}
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
.animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
</style>
