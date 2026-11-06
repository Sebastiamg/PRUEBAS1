<template>
  <div class="produccion-module">
    <!-- Sub-navegación de Producción -->
    <div class="sub-navigation">
      <div class="sub-nav-content">
        <div 
          v-for="item in subMenuItems" 
          :key="item.id"
          class="sub-nav-item"
          :class="{ 'active': subMenuActivo === item.id }"
          @click="cambiarVista(item)"
        >
          <feather-icon :icon="item.icon" svgClasses="w-4 h-4" />
          <span class="sub-nav-label">{{ item.nombre }}</span>
        </div>
      </div>
    </div>

    <!-- Contenido de la vista activa -->
    <div class="module-content">
      <transition name="fade" mode="out-in">
        <component :is="componenteActivo" />
      </transition>
    </div>
  </div>
</template>

<script>
import Recetas from './Recetas.vue';
import Ordenes from './Ordenes.vue';

export default {
  name: "Produccion",
  components: {
    Recetas,
    Ordenes
  },
  data() {
    return {
      subMenuActivo: 1,
      subMenuItems: [
        {
          id: 1,
          nombre: "Recetas",
          icon: "BookIcon",
          componente: "Recetas"
        },
        {
          id: 2,
          nombre: "Órdenes",
          icon: "ClipboardIcon",
          componente: "Ordenes"
        }
      ],
      componenteActivo: "Recetas"
    };
  },
  methods: {
    cambiarVista(item) {
      this.subMenuActivo = item.id;
      this.componenteActivo = item.componente;
    }
  }
};
</script>

<style lang="scss" scoped>
.produccion-module {
  display: flex;
  flex-direction: column;
  gap: 0;
  height: 100%;
}

.sub-navigation {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  margin: -1.5rem -1.5rem 1.5rem -1.5rem;
  padding: 0 1.5rem;
}

.sub-nav-content {
  display: flex;
  gap: 0.5rem;
}

.sub-nav-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  color: #64748b;
  font-weight: 500;
  font-size: 0.875rem;
  border-bottom: 2px solid transparent;

  &:hover {
    background: #f8fafc;
    color: #1e3c72;
  }

  &.active {
    color: #1e3c72;
    border-bottom-color: #1e3c72;
    background: #f0f4ff;
    
    .sub-nav-label {
      font-weight: 600;
    }
  }
}

.sub-nav-label {
  white-space: nowrap;
}

.module-content {
  flex: 1;
  min-height: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .sub-navigation {
    margin: -1rem -1rem 1rem -1rem;
    padding: 0 1rem;
  }

  .sub-nav-content {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    
    &::-webkit-scrollbar {
      height: 3px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #cbd5e1;
      border-radius: 3px;
    }
  }

  .sub-nav-item {
    padding: 0.6rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
