<!-- =========================================================================================
    File Name: PerseoLayout.vue
    Description: Layout independiente para el módulo Perseo (sin menú lateral)
========================================================================================== -->

<template>
  <div class="perseo-layout">
    <!-- Bloqueo por inactividad -->
    <bloqueo-session
      :isSidebarActive="addNewDataSidebarr"
      @update:isSidebarActive="addNewDataSidebarr = $event"
      @closeSidebar="addNewDataSidebarr = false"
    />
    
    <!-- Header Perseo Ejecutivo -->
    <div class="perseo-header">
      <div class="perseo-header-content">
        <div class="perseo-logo">
          <div class="brand-info">
            <h1 class="perseo-title">PERSEO</h1>
            <p class="perseo-subtitle">ADMINISTRACIÓN</p>
          </div>
        </div>
        
        <!-- Empresa Seleccionada en el Header -->
        <div class="empresa-info-header" v-if="mostrarNavegacion && empresaPerseo">
          <div class="empresa-icon-small">
            <img v-if="empresaPerseo.logo" :src="empresaPerseo.logo" :alt="empresaPerseo.nombre" class="empresa-logo-img" />
            <feather-icon v-else :icon="empresaPerseo.icon || 'BriefcaseIcon'" svgClasses="w-5 h-5" />
          </div>
          <div class="empresa-text-info">
            <h2 class="empresa-nombre-header">{{ empresaPerseo.nombre }}</h2>
            <p class="empresa-desc-header">{{ empresaPerseo.descripcion }}</p>
          </div>
          <span :class="['ambiente-badge-header', empresaPerseo.perseo_enviroment === '1' ? 'ambiente-produccion' : 'ambiente-local']">
            {{ empresaPerseo.perseo_enviroment === '1' ? 'Producción' : 'Local' }}
          </span>
          <vs-button
            color="danger"
            type="gradient"
            size="small"
            icon-pack="feather"
            icon="icon-refresh-cw"
            @click="cambiarEmpresa"
            class="btn-cambiar-empresa-header"
          >
            Cambiar Empresa
          </vs-button>
        </div>
        
        <div class="perseo-user-info">
          
          
          <vs-dropdown vs-trigger-click class="cursor-pointer">
            <div class="user-avatar-container">
              <img 
                v-if="usuario.foto_user == 'default.png'"
                :src="activeUserInfo.photoURL" 
                alt="user-img" 
                width="30" 
                height="30" 
                class="user-avatar-img" 
              />
              <img 
                v-else
                :src="$data_url+'archivos/'+'perfil/'+usuario.foto_user" 
                alt="user-img" 
                width="30" 
                height="30" 
                class="user-avatar-img" 
              />
              <div class="status-indicator"></div>
            </div>

            <vs-dropdown-menu class="vx-navbar-dropdown executive-dropdown">
              <ul style="min-width: 12rem">
                <li class="dropdown-header">
                  <div class="user-info-dropdown">
                    <p class="user-name-dropdown">{{ activeUserName }}</p>
                    <!-- <p class="user-role-dropdown">Administrador</p> -->
                  </div>
                </li>
                <vs-divider class="m-0" />
                <li 
                  class="flex py-3 px-4 cursor-pointer hover:bg-primary hover:text-white transition-all"
                  @click="$router.push('/home').catch(() => {})"
                >
                  <feather-icon icon="HomeIcon" svgClasses="w-4 h-4" />
                  <span class="ml-3">Ir a Dashboard Principal</span>
                </li>
                <vs-divider class="m-0" />
                <li 
                  class="flex py-3 px-4 cursor-pointer hover:bg-danger hover:text-white transition-all"
                  @click="logout"
                >
                  <feather-icon icon="LogOutIcon" svgClasses="w-4 h-4" />
                  <span class="ml-3">Cerrar Sesión</span>
                </li>
              </ul>
            </vs-dropdown-menu>
          </vs-dropdown>
        </div>
      </div>
    </div>

    <!-- Navegación Horizontal de Módulos -->
    <div class="perseo-navigation" v-if="mostrarNavegacion">
      <div class="perseo-nav-content">
        <div 
          v-for="modulo in modulos" 
          :key="modulo.id"
          class="nav-item"
          :class="{ 'active': moduloActivo === modulo.id }"
          @click="seleccionarModulo(modulo)"
        >
          <feather-icon :icon="modulo.icon" svgClasses="w-5 h-5" />
          <span class="nav-label">{{ modulo.nombre }}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="perseo-content">
      <transition name="fade" mode="out-in">
        <router-view />
      </transition>
    </div>

    <!-- Footer Perseo -->
    <div class="perseo-footer">
      <span>© {{ new Date().getFullYear() }} Editorial Prolipa. Todos los derechos reservados.</span>
    </div>
  </div>
</template>

<script>
import BloqueoSession from "@/layouts/main/session";

export default {
  name: "PerseoLayout",
  components: {
    BloqueoSession
  },
  data() {
    return {
      activeUserName: "Usuario",
      usuario: {},
      moduloActivo: null,
      addNewDataSidebarr: false,
      
      // ⏱️ CONFIGURACIÓN DE INACTIVIDAD (en segundos)
      IDLE_TIMEOUT_SECONDS: 3600, // 1 hora = 3600 segundos
      
      modulos: [
        {
          id: 1,
          nombre: "Producción",
          icon: "PackageIcon",
          ruta: "/perseo/produccion"
        },
        {
          id: 2,
          nombre: "Inventario",
          icon: "ArchiveIcon",
          ruta: "/perseo/inventario"
        },
        {
          id: 3,
          nombre: "Tesorería",
          icon: "DollarSignIcon",
          ruta: "/perseo/tesoreria"
        },
        {
          id: 4,
          nombre: "Cartera",
          icon: "CreditCardIcon",
          ruta: "/perseo/cartera"
        },
        {
          id: 5,
          nombre: "Ventas",
          icon: "ShoppingCartIcon",
          ruta: "/perseo/ventas"
        },
      ],
    };
  },
  computed: {
    activeUserInfo() {
      return this.$store.state.AppActiveUser;
    },
    mostrarNavegacion() {
      // Mostrar navegación solo si no estamos en la ruta de selección de empresa
      return this.$route.path !== '/perseo';
    },
    empresaPerseo() {
      return this.$store.state.empresaPerseo;
    }
  },
  created() {
    this.getUserInfo();
    this.cargarEmpresaActual();
    this.detectarModuloActivo();
  },
  async mounted() {
    // No activar el sistema de bloqueo en páginas de login
    const isLoginPage = ['/', '/login', '/ingreso', '/docente-ingreso'].includes(this.$route.path);
    
    if (!isLoginPage) {
      // Listen for storage changes from other tabs
      window.addEventListener('storage', this.handleStorageChange);
      
      // Track user activity in THIS tab and share it with other tabs
      this.setupActivityTracking();
    }
    
    // Si hay flag de sesión bloqueada, limpiar y redirigir
    try {
      if (localStorage.getItem('session_locked')) {
        try { localStorage.removeItem('tk'); } catch(_) {}
        try { localStorage.removeItem('usuario'); } catch(_) {}
        try { localStorage.removeItem('session_locked'); } catch(_) {}
        this.$router.push('/');
        return;
      }
    } catch (e) {
      // ignore
    }
  },
  beforeDestroy() {
    // Clean up storage listener
    window.removeEventListener('storage', this.handleStorageChange);
    // Clean up activity listeners
    this.cleanupActivityTracking();
  },
  watch: {
    '$route'() {
      this.detectarModuloActivo();
      this.cargarEmpresaActual();
    }
  },
  methods: {
    cargarEmpresaActual() {
      // Cargar empresa del localStorage si no está en Vuex
      if (!this.$store.state.empresaPerseo) {
        const empresaGuardada = localStorage.getItem("perseo_empresa_actual");
        if (empresaGuardada) {
          try {
            const empresa = JSON.parse(empresaGuardada);
            this.$store.commit('SET_EMPRESA_PERSEO', empresa);
          } catch (error) {
            console.error("Error al cargar empresa:", error);
          }
        }
      }
    },
    // Sistema de inactividad global
    async onidle() {
      // Ejecutar logout cuando se detecta inactividad
      try {
        await this.$store.dispatch('logout');
      } catch (err) {
        console.warn('Logout dispatch failed on idle:', err);
      }
      
      // Limpiar storage de autenticación y establecer flag de bloqueo
      try { localStorage.removeItem('tk'); } catch(_) {}
      try { localStorage.removeItem('usuario'); } catch(_) {}
      try { localStorage.removeItem('last_activity'); } catch(_) {}
      try { localStorage.setItem('session_locked', '1'); } catch (_) {}
      
      this.addNewDataSidebarr = true;
    },
    
    setupActivityTracking() {
      // Actualizar timestamp de última actividad en cualquier interacción
      const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
      const updateActivity = () => {
        try {
          localStorage.setItem('last_activity', Date.now().toString());
        } catch (e) {
          console.warn('Error updating last_activity:', e);
        }
      };
      
      // Guardar referencia al handler para poder removerlo después
      this._activityHandler = updateActivity;
      
      // Agregar listeners para todos los eventos de actividad
      events.forEach(event => {
        window.addEventListener(event, this._activityHandler, { passive: true });
      });
      
      // Inicializar con timestamp actual
      updateActivity();
      
      // Verificar inactividad cada segundo (entre TODAS las pestañas)
      this._idleCheckInterval = setInterval(() => {
        this.checkGlobalInactivity();
      }, 1000);
    },
    
    cleanupActivityTracking() {
      if (this._activityHandler) {
        const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        events.forEach(event => {
          window.removeEventListener(event, this._activityHandler);
        });
      }
      if (this._idleCheckInterval) {
        clearInterval(this._idleCheckInterval);
      }
    },
    
    checkGlobalInactivity() {
      // No verificar si ya está bloqueado
      if (this.addNewDataSidebarr) return;
      
      // No verificar en páginas de login
      const isLoginPage = ['/', '/login', '/ingreso', '/docente-ingreso'].includes(this.$route.path);
      if (isLoginPage) return;
      
      try {
        const lastActivity = localStorage.getItem('last_activity');
        if (!lastActivity) return;
        
        const lastActivityTime = parseInt(lastActivity, 10);
        const now = Date.now();
        const idleTimeMs = now - lastActivityTime;
        const idleTimeSeconds = Math.floor(idleTimeMs / 1000);
        
        // Calcular tiempo restante
        const remainingSeconds = this.IDLE_TIMEOUT_SECONDS - idleTimeSeconds;
        const remainingMinutes = Math.floor(remainingSeconds / 60);
        const remainingSecondsDisplay = remainingSeconds % 60;
        
        // Guardar tiempo restante en localStorage
        if (remainingSeconds > 0) {
          localStorage.setItem('session_remaining_time', `${remainingMinutes}m ${remainingSecondsDisplay}s`);
          localStorage.setItem('session_remaining_seconds', remainingSeconds.toString());
        } else {
          localStorage.removeItem('session_remaining_time');
          localStorage.removeItem('session_remaining_seconds');
        }
        
        // Si inactivo por más del tiempo configurado, bloquear
        if (idleTimeSeconds >= this.IDLE_TIMEOUT_SECONDS) {
          this.onidle();
        }
      } catch (e) {
        console.warn('Error checking global inactivity:', e);
      }
    },
    
    handleStorageChange(event) {
      // Cuando otra pestaña se bloquea, bloquear esta también
      if (event.key === 'session_locked' && !event.oldValue && event.newValue) {
        this.addNewDataSidebarr = true;
        return;
      }
      
      // SOLO recargar si este tab está mostrando el bloqueo Y otro tab hace login exitoso
      if (event.key === 'usuario' && event.newValue && !event.oldValue) {
        try {
          const newUser = JSON.parse(event.newValue);
          if (newUser && newUser.idusuario) {
            if (this.addNewDataSidebarr === true) {
              this.addNewDataSidebarr = false;
              window.location.reload();
            }
          }
        } catch (e) {
          console.warn('Error parsing new usuario from storage event:', e);
        }
      }
      
      // Si session_locked se elimina en otra pestaña (login exitoso), refrescar SOLO si está bloqueado
      if (event.key === 'session_locked' && event.oldValue && !event.newValue) {
        if (localStorage.getItem('usuario') && localStorage.getItem('tk')) {
          if (this.addNewDataSidebarr === true) {
            this.addNewDataSidebarr = false;
            window.location.reload();
          }
        }
      }
    },
    getUserInfo() {
      const usuarioData = localStorage.getItem("usuario");
      if (usuarioData) {
        this.usuario = JSON.parse(usuarioData);
        this.activeUserName = this.usuario.nombres + " " + this.usuario.apellidos || "Usuario";
      }
    },
    async logout() {
      await this.$store.dispatch("logout");
      this.$router.push("/");
    },
    cambiarEmpresa() {
      localStorage.removeItem("perseo_empresa_actual");
      this.$store.commit('SET_EMPRESA_PERSEO', null);
      this.$router.push("/perseo").catch(() => {});
    },
    seleccionarModulo(modulo) {
      this.moduloActivo = modulo.id;
      // Navegar a la ruta del módulo
      this.$router.push(modulo.ruta).catch(() => {});
    },
    detectarModuloActivo() {
      const rutaActual = this.$route.path;
      const modulo = this.modulos.find(m => rutaActual.includes(m.ruta));
      if (modulo) {
        this.moduloActivo = modulo.id;
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.perseo-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
}

.perseo-header {
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  padding: 0.5rem 2.5rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.perseo-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1600px;
  margin: 0 auto;
  min-height: 50px;
  gap: 0.5rem;
}

.perseo-logo {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.brand-info {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.perseo-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: white;
  margin: 0;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  line-height: 1;
}

.perseo-subtitle {
  font-size: 0.55rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  font-weight: 500;
}

.perseo-user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-avatar-container {
  position: relative;
  cursor: pointer;
  transition: transform 0.2s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.user-avatar-img {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
  display: block;
  object-fit: cover;
}

.status-indicator {
  position: absolute;
  bottom: 0px;
  right: 0px;
  width: 8px;
  height: 8px;
  background: #10b981;
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
}

.empresa-info-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
  max-width: 550px;
  margin: 0 1.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.empresa-icon-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  background: rgb(255, 255, 255);
  border-radius: 8px;
  color: white;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  overflow: hidden;

  .empresa-logo-img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 0.25rem;
  }
}

.empresa-text-info {
  flex: 1;
  min-width: 0;
}

.empresa-nombre-header {
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  margin: 0 0 0.15rem;
  line-height: 1.2;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.empresa-desc-header {
  font-size: 0.7rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
  line-height: 1.3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ambiente-badge-header {
  display: inline-block;
  padding: 0.4rem 0.85rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  white-space: nowrap;
}

.btn-cambiar-empresa-header {
  flex-shrink: 0;
  
  ::v-deep .vs-button {
    padding: 0.4rem 0.7rem !important;
    font-size: 0.7rem !important;
    font-weight: 600 !important;
    border: 1.5px solid rgba(255, 255, 255, 0.35) !important;
    color: white !important;
    background: transparent !important;
    border-radius: 6px !important;
    transition: all 0.3s ease !important;
    
    &:hover {
      background: rgba(255, 255, 255, 0.15) !important;
      border-color: rgba(255, 255, 255, 0.6) !important;
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
    }
  }
}

.perseo-navigation {
  background: white;
  border-bottom: 2px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  position: sticky;
  top: 50px;
  z-index: 90;
}

.perseo-nav-content {
  display: flex;
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2.5rem;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.7rem 1.2rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  color: #64748b;
  font-weight: 500;
  border-bottom: 2px solid transparent;

  &:hover {
    background: #f8fafc;
    color: #1e3c72;
  }

  &.active {
    color: #1e3c72;
    border-bottom-color: #1e3c72;
    background: #f0f4ff;
    
    .nav-label {
      font-weight: 600;
    }
  }
}

.nav-label {
  font-size: 0.8rem;
  white-space: nowrap;
}

.perseo-content {
  flex: 1;
  padding: 1.5rem;
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
}

.perseo-footer {
  background: white;
  padding: 1.5rem;
  text-align: center;
  color: #64748b;
  font-size: 0.875rem;
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.05);
}

.executive-dropdown {
  ::v-deep .dropdown-header {
    padding: 1rem;
    background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
    color: white;
  }

  ::v-deep .user-info-dropdown {
    text-align: left;
  }

  ::v-deep .user-name-dropdown {
    font-size: 1rem;
    font-weight: 600;
    margin: 0 0 0.25rem;
  }

  ::v-deep .user-role-dropdown {
    font-size: 0.75rem;
    opacity: 0.9;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  ::v-deep ul li {
    transition: all 0.2s ease;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

// Tablets y pantallas medianas
@media (max-width: 1200px) {
  .empresa-info-header {
    max-width: 450px;
    margin: 0 1rem;
    gap: 0.75rem;
  }

  .btn-cambiar-empresa-header {
    ::v-deep .vs-button {
      padding: 0.35rem 0.65rem !important;
      font-size: 0.68rem !important;
    }
  }
}

@media (max-width: 1024px) {
  .perseo-header {
    padding: 0.5rem 1.5rem;
  }

  .empresa-info-header {
    max-width: 380px;
    margin: 0 0.75rem;
    gap: 0.65rem;
    padding: 0.45rem 0.85rem;
  }

  .empresa-desc-header {
    display: none;
  }

  .ambiente-badge-header {
    padding: 0.3rem 0.65rem;
    font-size: 0.65rem;
  }
}

// Móviles
@media (max-width: 768px) {
  .perseo-header {
    padding: 0.5rem 1rem;
  }

  .perseo-title {
    font-size: 1rem;
    letter-spacing: 1.5px;
  }

  .perseo-subtitle {
    display: none;
  }

  .perseo-content {
    padding: 1rem;
  }

  .perseo-logo {
    gap: 0.75rem;
  }

  .empresa-info-header {
    max-width: 100%;
    padding: 0.4rem 0.6rem;
    gap: 0.5rem;
    margin: 0 0.5rem;
  }

  .ambiente-badge-header {
    display: none;
  }

  .empresa-icon-small {
    width: 36px;
    height: 36px;
  }

  .empresa-nombre-header {
    font-size: 0.8rem;
  }

  .empresa-desc-header {
    display: none;
  }

  .btn-cambiar-empresa-header {
    ::v-deep .vs-button {
      padding: 0.3rem 0.5rem !important;
      font-size: 0.65rem !important;

      .vs-button__content {
        span {
          display: none;
        }
      }
    }
  }

  .perseo-nav-content {
    padding: 0 1rem;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      height: 4px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 4px;
    }
  }

  .nav-item {
    padding: 0.6rem 1rem;
    
    .nav-label {
      font-size: 0.75rem;
    }
  }
}

// Móviles pequeños
@media (max-width: 480px) {
  .perseo-header {
    padding: 0.4rem 0.75rem;
  }

  .empresa-info-header {
    padding: 0.35rem 0.5rem;
    gap: 0.4rem;
    margin: 0 0.25rem;
  }

  .empresa-icon-small {
    width: 32px;
    height: 32px;
  }

  .empresa-nombre-header {
    font-size: 0.75rem;
  }

  .user-avatar-img {
    width: 26px !important;
    height: 26px !important;
  }
}
.ambiente-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.ambiente-produccion {
  background: #d4edda;
  color: #155724;
}

.ambiente-local {
  background: #fff3cd;
  color: #856404;
}
</style>
