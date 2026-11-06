<template>
  <div class="cobros-screen">
    <div class="view-header">
      <h2 class="view-title">Cobros</h2>
    </div>

    <div class="content-placeholder">
      <feather-icon icon="DollarSignIcon" svgClasses="w-16 h-16 text-gray-400" />
      <p class="placeholder-text">Gestión de Cobros</p>
      <p class="placeholder-subtext">Esta sección está en desarrollo</p>
    </div>
  </div>
</template>

<script>
export default {
  name: "CobrosScreen",
  data() {
    return {
      // Data para gestión de cobros
    };
  },
  methods: {
    // Métodos para gestión de cobros
  }
};
</script>

<style lang="scss" scoped>
.cobros-screen {
  padding: 1rem;
}

.view-header {
  margin-bottom: 1.5rem;
}

.view-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.content-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  background: white;
  border-radius: 8px;
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
