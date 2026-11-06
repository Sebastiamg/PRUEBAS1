<template>
  <div class="user-encuestas">
    <div class="header-section">
      <div>
        <h2><Icon name="clipboard" /> Encuestas</h2>
        <p>Encuestas disponibles para ti</p>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando encuestas...</p>
    </div>

    <!-- Lista de encuestas -->
    <div v-else class="encuestas-list">
      <div
        v-for="enc in encuestas"
        :key="enc.id"
        class="encuesta-item"
        :class="{ 'ya-respondida': enc.ya_respondida }"
      >
        <div class="enc-contenido">
          <div class="enc-info">
            <div class="enc-header">
              <h3>{{ enc.tema }}</h3>
              <span v-if="enc.ya_respondida" class="badge-respondida">
                <Icon name="check-circle" color="#10b981" /> Respondida
              </span>
            </div>

            <p class="enc-descripcion">{{ enc.descripcion }}</p>

            <div class="enc-metricas">
              <span class="metrica-item">
                <Icon name="question" size="1.1em" />
                {{ enc.total_preguntas }} preguntas
              </span>
              <span class="metrica-item" v-if="enc.fecha_fin">
                <Icon name="calendar" size="1.1em" />
                Disponible hasta {{ formatearFechaConHora(enc.fecha_fin) }}
              </span>
            </div>
          </div>

          <div class="enc-acciones">
            <button
              v-if="enc.ya_respondida"
              disabled
              class="btn-accion btn-disabled"
            >
              <Icon name="check-circle" /> Ya Respondida
            </button>
            <button
              v-else
              @click="responderEncuesta(enc)"
              class="btn-accion btn-responder"
            >
              <Icon name="pencil" /> Responder
            </button>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="encuestas.length === 0" class="empty-state">
        <div class="empty-icon"><Icon name="clipboard" size="5rem" /></div>
        <h3>No hay encuestas disponibles</h3>
        <p>Actualmente no tienes encuestas pendientes por responder</p>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';

export default {
  name: 'UserListaEncuestas',
  components: {
    Icon
  },
  props: {
    idusuario: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      encuestas: [],
      cargando: true
    };
  },
  mounted() {
    this.cargarEncuestas();
  },
  methods: {
    async cargarEncuestas() {
      this.cargando = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/encuestas`,
          { params: { idusuario: this.idusuario } }
        );

        if (response.data.success) {
          this.encuestas = response.data.data;
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar encuestas', tipo: 'error' });
      } finally {
        this.cargando = false;
      }
    },

    responderEncuesta(encuesta) {
      this.$emit('responder-encuesta', encuesta);
    },

    formatearFechaConHora(fecha) {
      if (!fecha) return '';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    }
  }
};
</script>

<style scoped>
.user-encuestas {
  width: 100%;
}

.header-section {
  margin-bottom: 24px;
}

.header-section h2 {
  margin: 0 0 4px 0;
  font-size: 1.8rem;
  color: #60a5fa;
}

.header-section p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.95rem;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #94a3b8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(96, 165, 250, 0.1);
  border-top-color: #60a5fa;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.encuestas-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.encuesta-item {
  background-color: #1e293b;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s;
}

.encuesta-item:hover {
  border-color: #60a5fa;
  transform: translateX(4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.encuesta-item.ya-respondida {
  border-left: 4px solid #10b981;
}

.enc-contenido {
  display: flex;
  padding: 20px;
  gap: 24px;
}

.enc-info {
  flex: 1;
}

.enc-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.enc-header h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #60a5fa;
}

.badge-respondida {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.enc-descripcion {
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 16px;
}

.enc-metricas {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.metrica-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #94a3b8;
}

.enc-acciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  min-width: 180px;
}

.btn-accion {
  padding: 12px 20px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.btn-responder {
  background-color: #60a5fa;
  color: white;
}

.btn-responder:hover {
  background-color: #3b82f6;
}

.btn-disabled {
  background-color: rgba(148, 163, 184, 0.1);
  color: #64748b;
  cursor: not-allowed;
  opacity: 0.6;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
}

.empty-icon {
  margin-bottom: 20px;
  opacity: 0.5;
}

.empty-state h3 {
  color: #94a3b8;
  margin-bottom: 8px;
  font-size: 1.5rem;
}

.empty-state p {
  color: #64748b;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .filtros {
    flex-direction: column;
    gap: 12px;
  }

  .filtros select {
    width: 100%;
  }

  .encuesta-item {
    padding: 16px;
  }

  .enc-contenido {
    flex-direction: column;
    gap: 12px;
  }

  .enc-info {
    flex: 1;
  }

  .enc-tema {
    font-size: 1rem;
  }

  .enc-descripcion {
    font-size: 0.8rem;
  }

  .enc-acciones {
    min-width: auto;
    width: 100%;
  }

  .enc-metricas {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
    justify-content: space-between;
  }

  .enc-metrica {
    font-size: 0.75rem;
    min-width: calc(50% - 4px);
  }

  .btn-responder,
  .btn-completada {
    width: 100%;
    padding: 10px;
    font-size: 0.875rem;
  }
}

@media (max-width: 480px) {
  .enc-tema {
    font-size: 0.95rem;
  }

  .enc-metrica {
    min-width: 100%;
  }
}
</style>
