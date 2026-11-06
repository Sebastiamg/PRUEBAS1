<template>
  <div class="mis-certificados">
    <div class="certificados-header">
      <h2><Icon name="trophy" color="#fbbf24" /> Mis Certificados</h2>
      <p class="subtitle">Certificados obtenidos por capacitaciones completadas</p>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p><Icon name="hourglass" /> Cargando certificados...</p>
    </div>

    <!-- Sin certificados -->
    <div v-else-if="certificados.length === 0" class="empty-state">
      <div class="empty-icon"><Icon name="certificate" size="5rem" /></div>
      <h3>No tienes certificados aún</h3>
      <p>Completa capacitaciones para obtener certificados de logro</p>
      <button @click="$emit('ir-a-capacitaciones')" class="btn-primary">
        Ver Capacitaciones Disponibles
      </button>
    </div>

    <!-- Lista de certificados -->
    <div v-else class="certificados-grid">
      <div 
        v-for="cert in certificados" 
        :key="cert.id" 
        class="certificado-card"
      >
        <!-- Badge de estrella -->
        <div class="certificado-badge">
          <Icon name="star" size="1.5rem" color="#FFD700" />
        </div>

        <!-- Contenido -->
        <div class="certificado-content">
          <div class="certificado-icon"><Icon name="graduation" size="3rem" color="#60a5fa" /></div>
          
          <h3 class="certificado-tema">{{ cert.capacitacion.tema }}</h3>
          
          <div class="certificado-info">
            <div class="info-item">
              <span class="label">Código:</span>
              <span class="value">{{ cert.codigo_certificado }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">Fecha de emisión:</span>
              <span class="value">{{ formatearFecha(cert.fecha_emision) }}</span>
            </div>
            
            <div class="info-item">
              <span class="label">Puntaje obtenido:</span>
              <span class="value score">{{ cert.puntaje_obtenido || 'N/A' }}%</span>
            </div>

            <div v-if="(cert.veces_descargado || 0) > 0" class="info-item">
              <span class="label">Descargas:</span>
              <span class="value">{{ cert.veces_descargado }}</span>
            </div>
            
            <div v-if="cert.fecha_descarga" class="info-item">
              <span class="label">Última descarga:</span>
              <span class="value">{{ formatearFecha(cert.fecha_descarga) }}</span>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="certificado-actions">
          <button 
            @click="descargarCertificado(cert)" 
            class="btn-download"
            :disabled="descargando === cert.id"
          >
            <span v-if="descargando === cert.id"><Icon name="hourglass" /> Descargando...</span>
            <span v-else><Icon name="download" /> Descargar PDF</span>
          </button>
          
          <button 
            @click="verDetalles(cert)" 
            class="btn-view"
          >
            <Icon name="eye" /> Ver Detalles
          </button>
        </div>
      </div>
    </div>

    <!-- Estadísticas resumidas -->
    <div v-if="certificados.length > 0" class="estadisticas-footer">
      <div class="stat-box">
        <div class="stat-icon"><Icon name="medal" size="3rem" color="#fbbf24" /></div>
        <div class="stat-content">
          <div class="stat-value">{{ certificados.length }}</div>
          <div class="stat-label">Certificados Obtenidos</div>
        </div>
      </div>

      <div class="stat-box">
        <div class="stat-icon"><Icon name="analytics" size="3rem" color="#3b82f6" /></div>
        <div class="stat-content">
          <div class="stat-value">{{ promedioGeneral }}%</div>
          <div class="stat-label">Promedio General</div>
        </div>
      </div>

      <div class="stat-box">
        <div class="stat-icon"><Icon name="download" size="3rem" color="#60a5fa" /></div>
        <div class="stat-content">
          <div class="stat-value">{{ totalDescargas }}</div>
          <div class="stat-label">Total Descargas</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';

export default {
  name: 'MisCertificados',
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
      cargando: true,
      certificados: [],
      descargando: null
    };
  },
  computed: {
    promedioGeneral() {
      if (this.certificados.length === 0) return '0';
      
      // Filtrar certificados que tienen puntaje válido
      const certificadosConPuntaje = this.certificados.filter(cert => {
        // Verificar si existe el puntaje en el intento
        const puntaje = cert.puntaje_obtenido || (cert.intento && cert.intento.puntaje_obtenido);
        return puntaje != null && !isNaN(puntaje) && parseFloat(puntaje) > 0;
      });
      
      if (certificadosConPuntaje.length === 0) return '0';
      
      const suma = certificadosConPuntaje.reduce((acc, cert) => {
        const puntaje = cert.puntaje_obtenido || (cert.intento && cert.intento.puntaje_obtenido);
        return acc + parseFloat(puntaje);
      }, 0);
      
      return (suma / certificadosConPuntaje.length).toFixed(2);
    },
    totalDescargas() {
      return this.certificados.reduce((acc, cert) => {
        const descargas = parseInt(cert.veces_descargado) || 0;
        return acc + descargas;
      }, 0);
    }
  },
  mounted() {
    this.cargarCertificados();
  },
  methods: {
    async cargarCertificados() {
      this.cargando = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/mis-certificados`,
          {
            params: { idusuario: this.idusuario }
          }
        );
        
        if (response.data.success) {
          this.certificados = response.data.data;
        }
      } catch (error) {
        this.$emit('show-toast', {
          mensaje: 'Error al cargar certificados',
          tipo: 'error'
        });
      } finally {
        this.cargando = false;
      }
    },

    async descargarCertificado(certificado) {
      this.descargando = certificado.id;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/usuario/certificados/${certificado.id}/descargar`,
          {
            responseType: 'blob'
          }
        );
        
        // Crear blob y descargar
        const blob = new Blob([response.data], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `Certificado_${certificado.codigo_certificado}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        // Recargar para actualizar contador de descargas
        this.cargarCertificados();
        
        this.$emit('show-toast', {
          mensaje: 'Certificado descargado exitosamente',
          tipo: 'success'
        });
      } catch (error) {
        this.$emit('show-toast', {
          mensaje: 'Error al descargar el certificado',
          tipo: 'error'
        });
      } finally {
        this.descargando = null;
      }
    },

    verDetalles(certificado) {
      // Navegar a los resultados de ese intento
      if (certificado.intento && certificado.intento.id) {
        this.$emit('ver-resultados', certificado.intento.id);
      } else {
        this.$emit('show-toast', {
          mensaje: 'No se pudo cargar los detalles del intento',
          tipo: 'error'
        });
      }
    },

    formatearFecha(fecha) {
      if (!fecha) return 'N/A';
      const date = new Date(fecha);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }
  }
};
</script>

<style scoped>
.mis-certificados {
  padding: 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.certificados-header {
  margin-bottom: 32px;
  text-align: center;
}

.certificados-header h2 {
  font-size: 2rem;
  margin-bottom: 8px;
  color: #ffffff;
}

.subtitle {
  color: #94a3b8;
  font-size: 1rem;
}

/* Loading */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #94a3b8;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(59, 130, 246, 0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.empty-icon {
  font-size: 5rem;
  margin-bottom: 24px;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin-bottom: 12px;
  color: #ffffff;
}

.empty-state p {
  color: #94a3b8;
  margin-bottom: 24px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 14px 32px;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

/* Grid de Certificados */
.certificados-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.certificado-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  position: relative;
  transition: all 0.3s;
  overflow: hidden;
}

.certificado-card:hover {
  transform: translateY(-4px);
  border-color: rgba(102, 126, 234, 0.5);
  box-shadow: 0 12px 30px rgba(102, 126, 234, 0.2);
}

.certificado-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  background: linear-gradient(135deg, #FFD700, #FFA500);
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.certificado-content {
  margin-bottom: 20px;
}

.certificado-icon {
  font-size: 3rem;
  text-align: center;
  margin-bottom: 16px;
}

.certificado-tema {
  font-size: 1.25rem;
  margin-bottom: 16px;
  color: #ffffff;
  text-align: center;
  line-height: 1.4;
}

.certificado-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 8px 12px;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
}

.label {
  color: #94a3b8;
  font-size: 0.9rem;
}

.value {
  color: #ffffff;
  font-weight: 600;
}

.value.score {
  color: #60a5fa;
  font-size: 1.1rem;
}

.certificado-actions {
  display: flex;
  gap: 12px;
}

.btn-download,
.btn-view {
  flex: 1;
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-download {
  background-color: #3b82f6;
  color: white;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.btn-download:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.btn-download:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-view {
  background-color: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.btn-view:hover {
  background-color: rgba(148, 163, 184, 0.2);
  color: #cbd5e1;
}

/* Estadísticas Footer */
.estadisticas-footer {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-top: 40px;
  padding: 32px;
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.8));
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-box {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.stat-icon {
  font-size: 3rem;
  opacity: 0.8;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: #60a5fa;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.9rem;
  color: #94a3b8;
}

/* Responsive */
@media (max-width: 768px) {
  .certificados-grid {
    grid-template-columns: 1fr;
  }

  .certificado-actions {
    flex-direction: column;
  }

  .estadisticas-footer {
    grid-template-columns: 1fr;
  }
}
</style>
