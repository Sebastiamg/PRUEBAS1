<template>
  <div class="recetas-view">
    <div class="view-header">
      <h2 class="view-title">Recetas de Producción</h2>
      <vs-button color="primary" icon-pack="feather" icon="icon-plus">
        Nueva Receta
      </vs-button>
    </div>

    <div class="content-placeholder">
      <feather-icon icon="BookIcon" svgClasses="w-16 h-16 text-gray-400" />
      <p class="placeholder-text">Gestión de recetas de producción</p>
      <p class="placeholder-subtext">Esta sección está en desarrollo</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Recetas"
};
</script>

<style lang="scss" scoped>
.recetas-view {
  height: 100%;
}

.view-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  background: white;
  border-radius: 12px;
  padding: 3rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
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
</style>
