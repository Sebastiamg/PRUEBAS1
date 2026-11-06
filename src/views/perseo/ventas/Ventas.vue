<template>
  <div class="ventas-module">
    <div class="view-header">
      <h2 class="view-title">Ventas</h2>
    </div>

    <div class="content-placeholder">
      <feather-icon icon="ShoppingCartIcon" svgClasses="w-16 h-16 text-gray-400" />
      <p class="placeholder-text">Módulo de Ventas</p>
      <p class="placeholder-subtext">Esta sección está en desarrollo</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "Ventas"
};
</script>

<style lang="scss" scoped>
.ventas-module {
  height: 100%;
}

.view-header {
  margin-bottom: 2rem;
}

.view-title {
  font-size: 1.75rem;
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
