<!-- =========================================================================================
    File Name: SeleccionEmpresa.vue
    Description: Vista principal de Perseo - Selección de empresa estilo tradicional
========================================================================================== -->

<template>
  <div class="seleccion-empresa-container">
    <div class="seleccion-card">
      <!-- Logo y Título -->
      <div class="header-section">
        <div class="icon-container">
          <feather-icon icon="BriefcaseIcon" svgClasses="w-16 h-16" class="main-icon" />
        </div>
        <h1 class="title-main">ADMINISTRACIÓN PERSEO</h1>
        <p class="subtitle">Seleccione la empresa con la que desea trabajar</p>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-section">
        <vs-progress indeterminate color="primary"></vs-progress>
        <p class="loading-text">Cargando empresas disponibles...</p>
      </div>
      <!-- Empresas Grid Compacto -->
      <div v-else class="empresas-grid">
        <div
          v-for="empresa in empresas"
          :key="empresa.id"
          class="empresa-card"
          @click="seleccionarEmpresa(empresa)"
        >
          <!-- Badge de Ambiente -->
          <span :class="['ambiente-badge', empresa.perseo_enviroment === '1' ? 'ambiente-produccion' : 'ambiente-local']">
            {{ empresa.perseo_enviroment === '1' ? 'Producción' : 'Local' }}
          </span>
          
          <!-- Logo -->
          <div class="empresa-logo">
            <img v-if="empresa.logo" :src="empresa.logo" :alt="empresa.nombre" />
            <feather-icon v-else :icon="empresa.icon" svgClasses="w-12 h-12" />
          </div>
          
          <!-- Info -->
          <h3 class="empresa-nombre">{{ empresa.nombre }}</h3>
          <p class="empresa-descripcion">{{ empresa.descripcion }}</p>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && empresas.length === 0" class="empty-state">
        <feather-icon icon="AlertCircleIcon" svgClasses="w-16 h-16 text-warning" />
        <p class="empty-text">No hay empresas disponibles</p>
        <p class="empty-subtext">Contacte con el administrador del sistema</p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "SeleccionEmpresa",
  data() {
    return {
      loading: true,
      empresas: [],
    };
  },
  mounted() {
    this.cargarEmpresas();
  },
  methods: {
    async cargarEmpresas() {
      let me = this;
      me.loading = true;
      
      this.$http.get(this.$server_url + 'empresa')
        .then(res => {
          // Filtrar empresa con id 2 y mapear datos de la API
          me.empresas = res.data
            .filter(empresa => empresa.id != 2)
            .map(empresa => ({
              id: empresa.id,
              nombre: empresa.descripcion_corta || empresa.nombre || 'Sin nombre',
              descripcion: empresa.descripcion || 'Sistema de gestión',
              icon: me.getIconoEmpresa(empresa.id),
              logo: empresa.img_base64 || null,
              perseo_enviroment: empresa.perseo_enviroment || '0',
              usuarios: 0 // Este dato vendría de otra consulta si lo necesitas
            }));
          
          me.loading = false;
        })
        .catch(err => {
          console.error('Error al cargar empresas:', err);
          me.$vs.notify({
            title: "Error",
            text: "No se pudieron cargar las empresas disponibles",
            color: "danger",
            position: "top-right",
          });
          me.loading = false;
        });
    },
    
    getIconoEmpresa(id) {
      // Mapeo de iconos según el ID de empresa
      const iconos = {
        1: 'BookIcon',
        3: 'TruckIcon',
        4: 'HomeIcon',
        5: 'PackageIcon',
        6: 'ShoppingCartIcon',
      };
      return iconos[id] || 'BriefcaseIcon';
    },

    seleccionarEmpresa(empresa) {
      // Guardar empresa en localStorage
      localStorage.setItem("perseo_empresa_actual", JSON.stringify(empresa));
      
      // Guardar empresa en Vuex (estado global)
      this.$store.commit('SET_EMPRESA_PERSEO', empresa);

      this.$vs.notify({
        title: "Empresa Seleccionada",
        text: `Has seleccionado: ${empresa.nombre}`,
        color: "success"
      });

      // Redirigir al dashboard de Perseo
      this.$router.push({
        name: "perseo-dashboard",
        params: { empresaId: empresa.id },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.seleccion-empresa-container {
  min-height: calc(100vh - 200px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.seleccion-card {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-width: 1200px;
  width: 100%;
  animation: slideUp 0.5s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
}

.icon-container {
  display: inline-flex;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  margin-bottom: 1.5rem;

  .main-icon {
    color: white;
  }
}

.title-main {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.125rem;
  color: #7c8ba1;
  margin: 0;
}

.loading-section {
  text-align: center;
  padding: 3rem 0;
}

.loading-text {
  margin-top: 1.5rem;
  color: #7c8ba1;
  font-size: 1rem;
}

.empresas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.empresa-card {
  position: relative;
  background: white;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #667eea;
    box-shadow: 0 8px 24px rgba(102, 126, 234, 0.2);
    transform: translateY(-4px);

    .empresa-logo {
      transform: scale(1.05);
    }
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

.empresa-logo {
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f7fafc;
  border-radius: 12px;
  margin: 0 auto 1rem;
  overflow: hidden;
  transition: transform 0.3s ease;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 0.5rem;
  }

  .feather-icon {
    color: #667eea;
  }
}

.empresa-nombre {
  font-size: 1.125rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.5rem 0;
}

.empresa-descripcion {
  font-size: 0.875rem;
  color: #7c8ba1;
  margin: 0;
  line-height: 1.4;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
}

.empty-text {
  font-size: 1.25rem;
  font-weight: 600;
  color: #2c3e50;
  margin-top: 1rem;
}

.empty-subtext {
  font-size: 1rem;
  color: #7c8ba1;
  margin-top: 0.5rem;
}

// Responsive
@media (max-width: 768px) {
  .seleccion-card {
    padding: 2rem 1.5rem;
  }

  .title-main {
    font-size: 2rem;
  }

  .empresas-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .empresa-logo {
    width: 80px;
    height: 80px;
  }
}
</style>
