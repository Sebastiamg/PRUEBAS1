<template>
  <div class="cartera-module">
    <!-- Ribbon Menu -->
    <div class="ribbon-container">
      <div class="ribbon-menu">
        <!-- Sección Cobros -->
        <div class="ribbon-section">
          <div class="ribbon-section-content">
            <div class="ribbon-group">
              <div
                class="ribbon-item ribbon-item-large"
                :class="{ active: activeSection === 'cobros' }"
                @click="setActiveSection('cobros')"
              >
                <div class="ribbon-icon">
                  <feather-icon icon="DollarSignIcon" svgClasses="w-8 h-8" />
                </div>
                <span class="ribbon-label">Cobros</span>
              </div>
            </div>
          </div>
          <div class="ribbon-section-title">Gestión</div>
        </div>

        <!-- Separador -->
        <div class="ribbon-separator"></div>

        <!-- Sección Bancos -->
        <div class="ribbon-section">
          <div class="ribbon-section-content">
            <div class="ribbon-group ribbon-group-vertical">
              <div class="ribbon-row">
                <div
                  class="ribbon-item ribbon-item-small"
                  :class="{ active: activeSection === 'bancos' }"
                  @click="setActiveSection('bancos')"
                >
                  <feather-icon icon="CreditCardIcon" svgClasses="w-4 h-4" />
                  <span>Bancos</span>
                </div>
                <div
                  class="ribbon-item ribbon-item-small"
                  :class="{ active: activeSection === 'bancos_clientes' }"
                  @click="setActiveSection('bancos_clientes')"
                >
                  <feather-icon icon="UsersIcon" svgClasses="w-4 h-4" />
                  <span>Bancos Clientes</span>
                </div>
              </div>
            </div>
          </div>
          <div class="ribbon-section-title">Configuración</div>
        </div>
      </div>
    </div>

    <!-- Contenido dinámico basado en la sección activa -->
    <div class="content-area">
      <div v-if="activeSection === 'cobros'" class="section-content">
        <CobrosScreen />
      </div>
      <div v-else-if="activeSection === 'bancos'" class="section-content">
        <BancosScreen />
      </div>
      <div v-else-if="activeSection === 'bancos_clientes'" class="section-content">
        <BancosClientesScreen />
      </div>
      <div v-else class="content-placeholder">
        <feather-icon icon="CreditCardIcon" svgClasses="w-16 h-16 text-gray-400" />
        <p class="placeholder-text">Módulo de Cartera</p>
        <p class="placeholder-subtext">Seleccione una opción del menú</p>
      </div>
    </div>
  </div>
</template>

<script>
const CobrosScreen = () => import("./cobros/cobros_screen.vue");
const BancosScreen = () => import("./bancos/bancos_screen.vue");
const BancosClientesScreen = () => import("./bancos/bancos_clientes_screen.vue");

export default {
  name: "Cartera",
  components: {
    CobrosScreen,
    BancosScreen,
    BancosClientesScreen
  },
  data() {
    return {
      activeSection: localStorage.getItem('perseo_menu_cartera') || null
    };
  },
  methods: {
    setActiveSection(section) {
      this.activeSection = section;
      localStorage.setItem('perseo_menu_cartera', section);
    }
  }
};
</script>

<style lang="scss" scoped>
.cartera-module {
  height: 100%;
}

/* Ribbon Container */
.ribbon-container {
  background: linear-gradient(to bottom, #f8f9fa 0%, #e9ecef 100%);
  border-bottom: 1px solid #dee2e6;
  padding: 0;
  margin-bottom: 1rem;
}

.ribbon-menu {
  display: flex;
  align-items: stretch;
  background: linear-gradient(to bottom, #ffffff 0%, #f5f5f5 100%);
  border: 1px solid #d0d0d0;
  border-radius: 0 0 4px 4px;
  padding: 4px 8px;
  overflow-x: auto;
}

/* Ribbon Section */
.ribbon-section {
  display: flex;
  flex-direction: column;
  padding: 4px 8px;
  min-width: fit-content;
}

.ribbon-section-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 4px 0;
}

.ribbon-section-title {
  font-size: 11px;
  color: #666;
  text-align: center;
  padding: 4px 0 2px;
  border-top: 1px solid #e0e0e0;
  margin-top: 4px;
}

/* Ribbon Group */
.ribbon-group {
  display: flex;
  gap: 4px;
  align-items: flex-start;
}

.ribbon-group-vertical {
  flex-direction: column;
  gap: 2px;
}

.ribbon-row {
  display: flex;
  gap: 8px;
}

/* Ribbon Separator */
.ribbon-separator {
  width: 1px;
  background: linear-gradient(to bottom, transparent 10%, #c0c0c0 50%, transparent 90%);
  margin: 8px 4px;
  align-self: stretch;
}

/* Ribbon Items */
.ribbon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.15s ease;
  border: 1px solid transparent;

  &:hover {
    background: linear-gradient(to bottom, #e8f4fc 0%, #d4ebf9 100%);
    border-color: #7fc4e8;
  }

  &.active {
    background: linear-gradient(to bottom, #cce5ff 0%, #b3d9ff 100%);
    border-color: #4da6ff;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }
}

.ribbon-item-large {
  padding: 8px 12px;
  min-width: 60px;

  .ribbon-icon {
    margin-bottom: 4px;
    color: #e67e22;
  }

  .ribbon-label {
    font-size: 11px;
    color: #333;
    text-align: center;
    line-height: 1.2;
  }
}

.ribbon-item-small {
  flex-direction: row;
  padding: 4px 10px;
  gap: 6px;

  span {
    font-size: 11px;
    color: #333;
    white-space: nowrap;
  }

  .feather-icon {
    color: #e67e22;
  }
}

/* Content Area */
.content-area {
  background: white;
  border-radius: 8px;
  min-height: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-content {
  padding: 2rem;

  h3 {
    font-size: 1.5rem;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 0.5rem;
  }

  p {
    color: #64748b;
  }
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  padding: 3rem;
}

.placeholder-text {
  font-size: 1.1rem;
  font-weight: 600;
  color: #64748b;
  margin: 1rem 0 0.5rem;
}

.placeholder-subtext {
  font-size: 0.9rem;
  color: #94a3b8;
  margin: 0;
}

/* Scrollbar para el ribbon */
.ribbon-menu::-webkit-scrollbar {
  height: 6px;
}

.ribbon-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.ribbon-menu::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.ribbon-menu::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>
