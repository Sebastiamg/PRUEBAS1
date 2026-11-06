<!-- =========================================================================================
    File Name: PerseoDashboard.vue
    Description: Dashboard principal después de seleccionar empresa en Perseo
========================================================================================== -->

<template>
  <div class="perseo-dashboard">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card" v-for="stat in stats" :key="stat.title">
        <div class="stat-icon" :style="{ background: stat.color }">
          <feather-icon :icon="stat.icon" svgClasses="w-6 h-6" class="text-white" />
        </div>
        <div class="stat-content">
          <h3 class="stat-value">{{ stat.value }}</h3>
          <p class="stat-title">{{ stat.title }}</p>
          <span class="stat-change" :class="stat.trend">
            {{ stat.change }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PerseoDashboard",
  data() {
    return {
      empresaActual: {},
      stats: [
        // {
        //   title: "Usuarios Activos",
        //   value: "450",
        //   change: "+12% desde el mes pasado",
        //   trend: "positive",
        //   icon: "UsersIcon",
        //   color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        // },
        // {
        //   title: "Transacciones",
        //   value: "1,250",
        //   change: "+8% desde el mes pasado",
        //   trend: "positive",
        //   icon: "ActivityIcon",
        //   color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        // },
        // {
        //   title: "Ingresos",
        //   value: "$45,680",
        //   change: "+23% desde el mes pasado",
        //   trend: "positive",
        //   icon: "DollarSignIcon",
        //   color: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
        // },
        // {
        //   title: "Satisfacción",
        //   value: "98%",
        //   change: "+2% desde el mes pasado",
        //   trend: "positive",
        //   icon: "SmileIcon",
        //   color: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
        // },
      ],
    };
  },
  mounted() {
    this.cargarEmpresaActual();
  },
  methods: {
    cargarEmpresaActual() {
      // Primero intentar cargar desde Vuex
      let empresa = this.$store.state.empresaPerseo;
      
      // Si no está en Vuex, cargar desde localStorage
      if (!empresa) {
        const empresaLocal = localStorage.getItem("perseo_empresa_actual");
        if (empresaLocal) {
          empresa = JSON.parse(empresaLocal);
          // Guardar en Vuex para futuras consultas
          this.$store.commit('SET_EMPRESA_PERSEO', empresa);
        }
      }
      
      if (empresa) {
        this.empresaActual = empresa;
      } else {
        // Si no hay empresa seleccionada, regresar a selección
        this.$router.push("/perseo");
      }
    }
  },
};
</script>

<style lang="scss" scoped>
.perseo-dashboard {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  }
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 12px;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0 0 0.25rem;
}

.stat-title {
  font-size: 0.875rem;
  color: #7c8ba1;
  margin: 0 0 0.5rem;
}

.stat-change {
  font-size: 0.75rem;
  font-weight: 600;

  &.positive {
    color: #28a745;
  }

  &.negative {
    color: #dc3545;
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
