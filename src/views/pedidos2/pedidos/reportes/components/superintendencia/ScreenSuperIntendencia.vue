<template>
  <div class="p-6">

    <!-- Header -->
    <div class="mb-6">
      <h2 class="text-2xl font-bold text-dark mb-1">Reportes Superintendencia</h2>
      <p class="text-gray-500 text-sm">Selecciona el tipo de reporte que deseas visualizar</p>
    </div>

    <!-- Menú de navegación -->
    <div class="reporte-menu mb-6">
      <!-- Botón 1: Milton (22-23-24) -->
      <div
        class="reporte-btn"
        :class="{ active: vista_activa === 'milton' }"
        @click="vista_activa = 'milton'"
      >
        <div class="reporte-btn__icon">
          <vs-icon icon="history" size="28px"></vs-icon>
        </div>
        <div class="reporte-btn__content">
          <span class="reporte-btn__title">Reporte Costa 22, 23, 24</span>
          <span class="reporte-btn__sub">Ventas Milton · Períodos anteriores</span>
        </div>
        <div v-if="vista_activa === 'milton'" class="reporte-btn__indicator"></div>
      </div>

      <!-- Botón 2: Perseo 2025 -->
      <div
        class="reporte-btn"
        :class="{ active: vista_activa === 'perseo' }"
        @click="vista_activa = 'perseo'"
      >
        <div class="reporte-btn__icon">
          <vs-icon icon="bar_chart" size="28px"></vs-icon>
        </div>
        <div class="reporte-btn__content">
          <span class="reporte-btn__title">Reporte 2025</span>
          <span class="reporte-btn__sub">Ventas Perseo · Por período</span>
        </div>
        <div v-if="vista_activa === 'perseo'" class="reporte-btn__indicator"></div>
      </div>

      <!-- Botón 3: Prolipa (enviado a Perseo) -->
      <div
        class="reporte-btn"
        :class="{ active: vista_activa === 'prolipa' }"
        @click="vista_activa = 'prolipa'"
      >
        <div class="reporte-btn__icon">
          <vs-icon icon="send" size="28px"></vs-icon>
        </div>
        <div class="reporte-btn__content">
          <span class="reporte-btn__title">Reporte enviado a Perseo</span>
          <span class="reporte-btn__sub">Ventas Prolipa · Por período</span>
        </div>
        <div v-if="vista_activa === 'prolipa'" class="reporte-btn__indicator"></div>
      </div>
    </div>

    <!-- Componentes cargados según selección -->
    <transition name="fade-slide" mode="out-in">
      <super-intendencia-milton v-if="vista_activa === 'milton'" key="milton" />
      <super-intendencia2025    v-else-if="vista_activa === 'perseo'"  key="perseo" />
      <super-intendencia-prolipa v-else-if="vista_activa === 'prolipa'" key="prolipa" />
    </transition>

  </div>
</template>

<script>
import SuperIntendenciaMilton  from './SuperIntendenciaMilton.vue';
import SuperIntendencia2025    from './SuperIntendencia2025.vue';
import SuperIntendenciaProlipa from './SuperIntendenciaProlipa.vue';

export default {
  name: 'ScreenSuperIntendencia',
  components: {
    SuperIntendenciaMilton,
    SuperIntendencia2025,
    SuperIntendenciaProlipa
  },
  data() {
    return {
      vista_activa: 'milton' // vista por defecto
    };
  }
};
</script>

<style scoped>
/* ── Menú de botones ── */
.reporte-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.reporte-btn {
  position: relative;
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 220px;
  background: #ffffff;
  border: 2px solid #e8eaf0;
  border-radius: 14px;
  padding: 18px 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0,0,0,0.04);
}

.reporte-btn:hover {
  border-color: #7367f0;
  box-shadow: 0 6px 20px rgba(115, 103, 240, 0.15);
  transform: translateY(-2px);
}

.reporte-btn.active {
  border-color: #7367f0;
  background: linear-gradient(135deg, rgba(115, 103, 240, 0.06) 0%, rgba(115, 103, 240, 0.02) 100%);
  box-shadow: 0 8px 24px rgba(115, 103, 240, 0.2);
}

/* Ícono */
.reporte-btn__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: rgba(115, 103, 240, 0.1);
  color: #7367f0;
  flex-shrink: 0;
  transition: background 0.25s;
}

.reporte-btn.active .reporte-btn__icon {
  background: #7367f0;
  color: #ffffff;
}

/* Textos */
.reporte-btn__content {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.reporte-btn__title {
  font-weight: 700;
  font-size: 14px;
  color: #2c2c3e;
  line-height: 1.2;
}

.reporte-btn.active .reporte-btn__title {
  color: #7367f0;
}

.reporte-btn__sub {
  font-size: 11px;
  color: #9899ac;
  font-weight: 500;
}

/* Indicador activo (barra derecha) */
.reporte-btn__indicator {
  position: absolute;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 4px;
  height: 60%;
  background: #7367f0;
  border-radius: 4px 0 0 4px;
}

/* ── Transición entre vistas ── */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.22s ease, transform 0.22s ease;
}
.fade-slide-enter {
  opacity: 0;
  transform: translateY(10px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
