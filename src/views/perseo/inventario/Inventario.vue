<template>
  <div class="inventario-module">
    <!-- Ribbon Menu -->
    <div class="ribbon-container">
      <div class="ribbon-menu">
        <!-- Sección Productos -->
        <div class="ribbon-section">
          <div class="ribbon-section-content">
            <div class="ribbon-group">
              <div
                class="ribbon-item ribbon-item-large"
                :class="{ active: activeSection === 'productos' }"
                @click="setActiveSection('productos')"
              >
                <div class="ribbon-icon">
                  <feather-icon icon="PackageIcon" svgClasses="w-8 h-8" />
                </div>
                <span class="ribbon-label">Productos</span>
              </div>
              <!-- <div
                class="ribbon-item ribbon-item-large"
                :class="{ active: activeSection === 'servicios' }"
                @click="setActiveSection('servicios')"
              >
                <div class="ribbon-icon">
                  <feather-icon icon="ToolIcon" svgClasses="w-8 h-8" />
                </div>
                <span class="ribbon-label">Servicios</span>
              </div> -->
            </div>
          </div>
          <div class="ribbon-section-title">Opciones de Productos</div>
        </div>

        <!-- Separador -->
        <div class="ribbon-separator"></div>

        <!-- Sección Clasificación -->
        <div class="ribbon-section">
          <div class="ribbon-section-content">
            <div class="ribbon-group ribbon-group-vertical">
              <div class="ribbon-row">
                <div
                  class="ribbon-item ribbon-item-small"
                  :class="{ active: activeSection === 'linea' }"
                  @click="setActiveSection('linea')"
                >
                  <feather-icon icon="GitBranchIcon" svgClasses="w-4 h-4" />
                  <span>Línea</span>
                </div>
                <div
                  class="ribbon-item ribbon-item-small"
                  :class="{ active: activeSection === 'categorias' }"
                  @click="setActiveSection('categorias')"
                >
                  <feather-icon icon="GridIcon" svgClasses="w-4 h-4" />
                  <span>Categorías</span>
                </div>
                <div
                  class="ribbon-item ribbon-item-small"
                  :class="{ active: activeSection === 'subcategorias1' }"
                  @click="setActiveSection('subcategorias1')"
                >
                  <feather-icon icon="LayersIcon" svgClasses="w-4 h-4" />
                  <span>Subcategorías 1</span>
                </div>
              </div>
              <div class="ribbon-row">
                <div
                  class="ribbon-item ribbon-item-small"
                  :class="{ active: activeSection === 'subcategorias2' }"
                  @click="setActiveSection('subcategorias2')"
                >
                  <feather-icon icon="LayersIcon" svgClasses="w-4 h-4" />
                  <span>Subcategorías 2</span>
                </div>
              </div>
            </div>
          </div>
          <div class="ribbon-section-title">Opciones de Productos</div>
        </div>

        <!-- Separador -->
        <div class="ribbon-separator"></div>
        <!-- Sección Ajustes-->
        <div class="ribbon-section">
          <div class="ribbon-section-content">
            <div class="ribbon-group ribbon-group-vertical">
              <div class="ribbon-row">
                <div
                  class="ribbon-item ribbon-item-small"
                  :class="{ active: activeSection === 'almacen' }"
                  @click="setActiveSection('almacen')"
                >
                  <feather-icon icon="GitBranchIcon" svgClasses="w-4 h-4" />
                  <span>Almacenes</span>
                </div>
              </div>
            </div>
          </div>
          <div class="ribbon-section-title">Ajustes</div>
        </div>
      </div>
    </div>

    <!-- Contenido dinámico basado en la sección activa -->
    <div class="content-area">
      <div v-if="activeSection === 'productos'" class="section-content">
        <h3>Productos</h3>
        <p>Gestión de productos del inventario</p>
        <ProductosScreen />
      </div>
      <div v-else-if="activeSection === 'servicios'" class="section-content">
        <h3>Servicios</h3>
        <p>Gestión de servicios</p>
      </div>
      <div v-else-if="activeSection === 'linea'" class="section-content">
        <LineaScreen />
      </div>
      <div v-else-if="activeSection === 'categorias'" class="section-content">
        <CategoriaScreen />
      </div>
      <div v-else-if="activeSection === 'subcategorias1'" class="section-content">
        <Subcategoria1Screen />
      </div>
      <div v-else-if="activeSection === 'subcategorias2'" class="section-content">
        <Subcategoria2Screen />
      </div>
      <div v-else-if="activeSection === 'almacen'" class="section-content">
        <AlmacenScreen />
      </div>
      <div v-else class="content-placeholder">
        <feather-icon icon="ArchiveIcon" svgClasses="w-16 h-16 text-gray-400" />
        <p class="placeholder-text">Módulo de Inventario</p>
        <p class="placeholder-subtext">Seleccione una opción del menú</p>
      </div>
    </div>
  </div>
</template>

<script>
const LineaScreen = () => import("./linea/linea_screen.vue");
const CategoriaScreen = () => import("./categoria/categoria_screen.vue");
const Subcategoria1Screen = () => import("./subcategoria1/subcategoria1_screen.vue");
const Subcategoria2Screen = () => import("./subcategoria2/subcategoria2_screen.vue");
const AlmacenScreen = () => import("./almacen/perseo_almacen_screen.vue");
const ProductosScreen = () => import('@/views/perseo/inventario/producto/producto_screen.vue');

export default {
  components: {
    LineaScreen,
    CategoriaScreen,
    Subcategoria1Screen,
    Subcategoria2Screen,
    AlmacenScreen,
    ProductosScreen,
  },
  name: "Inventario",
  data() {
    return {
      activeSection: localStorage.getItem('perseo_menu_inventario') || 'productos'
    };
  },
  methods: {
    setActiveSection(section) {
      this.activeSection = section;
      localStorage.setItem('perseo_menu_inventario', section);
    }
  }
};
</script>

<style lang="scss" scoped>
.inventario-module {
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
