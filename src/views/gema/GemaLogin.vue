<template>
  <div class="gema-root gema-login" :data-gema-theme="sesion.state.tema">
    <button
      class="gema-btn is-quiet is-icon gema-login-tema"
      type="button"
      :title="sesion.state.tema === 'dark' ? 'Tema claro' : 'Tema oscuro'"
      @click="sesion.alternarTema()"
    >
      <svg v-if="sesion.state.tema === 'dark'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M19.1 4.9l-1.4 1.4M6.3 17.7l-1.4 1.4" />
      </svg>
      <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
        <path d="M20 14.5A8.5 8.5 0 019.5 4a7 7 0 100 14 8.5 8.5 0 0010.5-3.5z" />
      </svg>
    </button>

    <div class="gema-login-caja">
      <div class="gema-login-marca">
        <span class="gema-login-sigla">Gestion Estrategica</span>
        <span class="gema-login-org">Prolipa</span>
      </div>

      <h1 class="gema-login-titulo">Gestion Estrategica Prolipa</h1>
      <p class="gema-login-sub">Ingrese con su cedula y su contrasena institucional.</p>

      <form class="gema-login-form" @submit.prevent="entrar">
        <div class="gema-field">
          <label class="gema-label" for="gema-cedula">Cedula</label>
          <input
            id="gema-cedula"
            v-model.trim="cedula"
            class="gema-input"
            :class="{ 'is-error': !!errores.cedula }"
            type="text"
            inputmode="numeric"
            maxlength="10"
            autocomplete="username"
            placeholder="0000000000"
            :disabled="cargando"
          />
          <span v-if="errores.cedula" class="gema-error-text">{{ errores.cedula }}</span>
          <span v-else-if="cedula.length && cedula.length < 10" class="gema-faint gema-login-pista">
            {{ cedula.length }} de 10 digitos
          </span>
        </div>

        <div class="gema-field">
          <label class="gema-label" for="gema-password">Contrasena</label>
          <div class="gema-login-pass">
            <input
              id="gema-password"
              v-model="password"
              class="gema-input"
              :class="{ 'is-error': !!errores.password }"
              :type="verPassword ? 'text' : 'password'"
              autocomplete="current-password"
              placeholder="••••••••"
              :disabled="cargando"
            />
            <button
              class="gema-login-ojo"
              type="button"
              :title="verPassword ? 'Ocultar' : 'Mostrar'"
              @click="verPassword = !verPassword"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7">
                <path v-if="verPassword" d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6-10-6-10-6z" />
                <circle v-if="verPassword" cx="12" cy="12" r="2.6" />
                <path v-else d="M3 3l18 18M10.6 6.2A9.9 9.9 0 0112 6c6.4 0 10 6 10 6a18 18 0 01-2.7 3.2M6.3 7.8A17.6 17.6 0 002 12s3.6 6 10 6c1 0 2-.1 2.8-.4" />
              </svg>
            </button>
          </div>
          <span v-if="errores.password" class="gema-error-text">{{ errores.password }}</span>
        </div>

        <div v-if="error" class="gema-alert is-error">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" class="gema-login-icono-alerta">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 8v4.5M12 16h.01" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <button class="gema-btn is-primary gema-login-btn" type="submit" :disabled="cargando">
          <span v-if="cargando" class="gema-spinner"></span>
          {{ cargando ? 'Verificando...' : 'Entrar' }}
        </button>
      </form>

      <p class="gema-login-pie">
        El acceso esta reservado al personal de Prolipa con perfil asignado en el modulo.
      </p>
    </div>
  </div>
</template>

<script>
import api, { GemaError } from '@/services/gema/gemaApi'
import sesion from '@/services/gema/gemaSesion'

export default {
  name: 'GemaLogin',

  data () {
    return {
      sesion,
      cedula: '',
      password: '',
      verPassword: false,
      cargando: false,
      error: null,
      errores: {}
    }
  },

  created () {
    // Si ya hay token valido no tiene sentido mostrar el login.
    if (sesion.autenticado) {
      this.reanudar()
    }
  },

  methods: {
    async reanudar () {
      try {
        const r = await api.get('auth/me')
        sesion.aplicar(r.data)
        this.irAlDestino()
      } catch (e) {
        // Token viejo: gemaApi ya limpio la sesion, se queda en el login.
      }
    },

    /**
     * Validacion de cedula ecuatoriana (modulo 10). El backend la repite; esta
     * copia solo evita un viaje al servidor por un dato mal escrito.
     */
    cedulaValida (ced) {
      if (!/^\d{10}$/.test(ced)) return false

      const provincia = parseInt(ced.substring(0, 2), 10)
      if (provincia < 1 || provincia > 24) return false
      if (parseInt(ced.charAt(2), 10) > 5) return false

      const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2]
      let suma = 0

      for (let i = 0; i < 9; i++) {
        let valor = parseInt(ced.charAt(i), 10) * coeficientes[i]
        if (valor > 9) valor -= 9
        suma += valor
      }

      const verificador = (Math.ceil(suma / 10) * 10) - suma
      const digito = parseInt(ced.charAt(9), 10)

      return verificador === digito || (verificador === 10 && digito === 0)
    },

    async entrar () {
      this.error = null
      this.errores = {}

      if (!this.cedulaValida(this.cedula)) {
        this.errores.cedula = 'Cedula invalida.'
        return
      }

      if (!this.password) {
        this.errores.password = 'Ingrese su contrasena.'
        return
      }

      this.cargando = true

      try {
        const r = await api.post('auth/login', {
          cedula: this.cedula,
          password: this.password
        })

        sesion.aplicar(r.data)
        this.irAlDestino()
      } catch (e) {
        if (e instanceof GemaError && e.errores) {
          Object.keys(e.errores).forEach((campo) => {
            this.errores[campo] = e.errores[campo][0]
          })
        }
        this.error = e.message
        this.password = ''
      } finally {
        this.cargando = false
      }
    },

    irAlDestino () {
      const destino = this.$route.query.redirect || '/gema'
      this.$router.replace(destino).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
// Pantalla plana a proposito: una tarjeta centrada sobre el color de lienzo.
// Sin degradados, sin particulas, sin glow.
.gema-login {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--gema-u4);
  position: relative;
}

.gema-login-tema {
  position: absolute;
  top: var(--gema-u3);
  right: var(--gema-u3);
}

.gema-login-caja {
  width: 100%;
  max-width: 348px;
  padding: var(--gema-u6);
  background: var(--gema-surface);
  border: 1px solid var(--gema-border);
  border-radius: var(--gema-radius-lg);
}

.gema-login-marca {
  display: flex;
  align-items: baseline;
  gap: var(--gema-u2);
  margin-bottom: var(--gema-u4);
}

.gema-login-sigla {
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: var(--gema-accent-text);
}

.gema-login-org {
  font-size: var(--gema-fs-xs);
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gema-text-3);
  padding-left: var(--gema-u2);
  border-left: 1px solid var(--gema-border);
}

.gema-login-titulo {
  font-size: var(--gema-fs-md);
  font-weight: 600;
  line-height: 1.35;
  margin: 0 0 3px;
}

.gema-login-sub {
  font-size: var(--gema-fs-sm);
  color: var(--gema-text-2);
  margin: 0 0 var(--gema-u4);
}

.gema-login-form {
  display: flex;
  flex-direction: column;
  gap: var(--gema-u3);
}

.gema-login-pista { font-size: var(--gema-fs-xs); }

.gema-login-pass {
  position: relative;

  .gema-input { padding-right: 30px; }
}

.gema-login-ojo {
  position: absolute;
  right: 4px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  color: var(--gema-text-3);
  background: none;
  border: none;
  border-radius: 3px;
  cursor: pointer;

  svg { width: 14px; height: 14px; }
  &:hover { color: var(--gema-text); }
}

.gema-login-icono-alerta { width: 14px; height: 14px; flex: none; margin-top: 1px; }

.gema-login-btn {
  height: 34px;
  margin-top: var(--gema-u);
}

.gema-login-pie {
  margin: var(--gema-u4) 0 0;
  padding-top: var(--gema-u3);
  border-top: 1px solid var(--gema-border);
  font-size: var(--gema-fs-xs);
  line-height: 1.45;
  color: var(--gema-text-3);
}
</style>
