<template>
  <div class="gestion-firmas">
    <div class="firmas-header">
      <button @click="volver" class="btn-volver">
        <Icon name="arrow-left" /> Volver
      </button>
      <h2><Icon name="certificate" /> Vista Previa del Certificado</h2>
      <p class="subtitle">{{ capacitacion.tema }}</p>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="loading-container">
      <div class="spinner"></div>
      <p>Cargando datos...</p>
    </div>

    <!-- Contenido -->
    <div v-else class="firmas-content">
      <!-- Preview del certificado -->
      <div class="preview-certificado">
        <h3><Icon name="certificate" /> Vista Previa del Certificado</h3>
        <p class="hint">Así se verán las firmas en el certificado generado</p>
        
        <!-- Botón de descarga de preview -->
        <div class="preview-actions">
          <button @click="descargarPreview" class="btn-preview-download" :disabled="descargandoPreview">
            <span v-if="descargandoPreview"><Icon name="hourglass" /> Generando...</span>
            <span v-else><Icon name="download" /> Descargar Vista Previa</span>
          </button>
          <p class="hint">Genera un certificado de ejemplo para ver cómo quedará el diseño final</p>
        </div>

        <!-- Contenedor con scroll para móvil -->
        <div class="certificado-container">
          <div class="certificado-mock">
          <!-- Imagen de fondo -->
          <div class="cert-background">
            <img :src="fondoUrl" alt="Fondo">
          </div>

          <!-- Logo esquina superior izquierda (CALMED) -->
          <div class="cert-logo-corner-left">
            <img :src="logoCalmedUrl" alt="CALMED">
          </div>

          <!-- Logo esquina superior derecha (Prolipa) -->
          <div class="cert-logo-corner-right">
            <img :src="logoProlipaCornerUrl" alt="Prolipa">
          </div>

          <!-- Contenido del certificado -->
          <div class="cert-content">
            <p class="confiere-text">Confiere el presente</p>
            <h4 class="cert-titulo">CERTIFICADO</h4>
            
            <div class="nombre-line">
              <span class="a-text">A</span>
              <div class="nombre-ejemplo">JUAN EJEMPLO PÉREZ GARCÍA</div>
            </div>
            
            <p class="participacion-text">Por su exitosa participación en:</p>
            <p class="tema-ejemplo">{{ capacitacion.tema }}</p>

            <!-- Detalles del certificado -->
            <div class="cert-details">
              <span class="detail-item"><strong>Fecha:</strong> 18 de junio de 2026</span>
              <span class="detail-separator">•</span>
              <span class="detail-item"><strong>Código:</strong> PREV-20260618-0009</span>
              <span v-if="capacitacion.duracion_estimada && capacitacion.duracion_estimada > 0" class="detail-separator">•</span>
              <span v-if="capacitacion.duracion_estimada && capacitacion.duracion_estimada > 0" class="detail-item"><strong>Duración:</strong> {{ capacitacion.duracion_estimada }} {{ capacitacion.duracion_estimada == 1 ? 'hora' : 'horas' }}</span>
            </div>

            <!-- Firmas en el footer -->
            <div class="cert-firmas">
              <!-- Firma 1 -->
              <div class="firma-mock">
                <div class="firma-placeholder-img">Firma 1</div>
                <div class="firma-linea"></div>
                <p class="firma-nombre">Gerente General</p>
                <p class="firma-cargo">Prolipa Cía. Ltda.</p>
              </div>

              <!-- Logo centro + QR -->
              <div class="qr-section">
                <div class="logo-centro">
                  <img :src="logoUrl" alt="Prolipa">
                </div>
                <div class="qr-placeholder-small">QR</div>
                <p class="qr-text">VERIFICAR</p>
                <p class="qr-code">8-0009</p>
              </div>

              <!-- Firma 2 -->
              <div class="firma-mock">
                <div class="firma-placeholder-img">Firma 2</div>
                <div class="firma-linea"></div>
                <p class="firma-nombre">Sistema</p>
                <p class="firma-cargo">Capacitador</p>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';

export default {
  name: 'GestionFirmas',
  components: {
    Icon
  },
  props: {
    capacitacionId: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      cargando: true,
      descargandoPreview: false,
      capacitacion: {}
    };
  },
  computed: {
    logoUrl() {
      return this.$server_url.replace(/\/$/, '') + '/storage/images/prolipa.png';
    },
    logoCalmedUrl() {
      return this.$server_url.replace(/\/$/, '') + '/images/logo CALMED B.png';
    },
    logoProlipaCornerUrl() {
      return this.$server_url.replace(/\/$/, '') + '/images/logo_prolipa_b.png';
    },
    fondoUrl() {
      return this.$server_url.replace(/\/$/, '') + '/images/FondoCertificadoCapacitacion.jpeg';
    }
  },
  mounted() {
    this.cargarCapacitacion();
  },
  methods: {
    async cargarCapacitacion() {
      this.cargando = true;
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${this.capacitacionId}`
        );
        
        if (response.data.success) {
          this.capacitacion = response.data.data;
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar los datos de la capacitación', tipo: 'error' });
      } finally {
        this.cargando = false;
      }
    },

    volver() {
      this.$emit('volver');
    },

    async descargarPreview() {
      this.descargandoPreview = true;
      try {
        // Construir URL del endpoint
        const url = `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${this.capacitacionId}/certificado-ejemplo`;
        
        // Crear enlace temporal para descarga
        const link = document.createElement('a');
        link.href = url;
        link.download = `Preview_Certificado_${this.capacitacion.tema || 'Ejemplo'}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al generar el preview del certificado', tipo: 'error' });
      } finally {
        this.descargandoPreview = false;
      }
    }
  }
};
</script>

<style scoped>
.gestion-firmas {
  background-color: #f8fafc;
  min-height: 100vh;
  color: #1e293b;
  padding: 24px;
}

.firmas-header {
  margin-bottom: 32px;
}

.btn-volver {
  background: #ffffff;
  color: #3b82f6;
  border: 1px solid #e2e8f0;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
  margin-bottom: 16px;
}

.btn-volver:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

.firmas-header h2 {
  margin: 0 0 8px 0;
  font-size: 1.8rem;
  color: #3b82f6;
}

.subtitle {
  color: #475569;
  font-size: 0.95rem;
  margin: 0;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #475569;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.firmas-content {
  max-width: 1200px;
  margin: 0 auto;
}

.preview-certificado {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
}

.preview-certificado h3 {
  margin: 0 0 8px 0;
  font-size: 1.3rem;
  color: #1e293b;
}

.hint {
  color: #475569;
  font-size: 0.85rem;
  font-style: italic;
}

/* Contenedor con scroll horizontal */
.certificado-container {
  overflow-x: auto;
  overflow-y: hidden;
  margin-top: 20px;
  -webkit-overflow-scrolling: touch;
  border-radius: 12px;
  background: #f1f5f9;
  padding: 10px;
}

.certificado-mock {
  background: white;
  border-radius: 12px;
  width: 900px;
  height: 600px;
  margin: 0 auto;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
  flex-shrink: 0;
}

/* Fondo con imagen */
.cert-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.cert-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

/* Logo esquina superior izquierda (CALMED) */
.cert-logo-corner-left {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 10;
}

.cert-logo-corner-left img {
  max-width: 105px;
  height: auto;
  max-height: 38px;
}

/* Logo esquina superior derecha (Prolipa) */
.cert-logo-corner-right {
  position: absolute;
  top: 6px;
  right: 10px;
  z-index: 10;
}

.cert-logo-corner-right img {
  max-width: 98px;
  height: auto;
  max-height: 34px;
}

/* Contenido principal */
.cert-content {
  position: relative;
  z-index: 5;
  padding: 100px 40px 15px;
  text-align: center;
}

.confiere-text {
  font-family: 'Brush Script MT', cursive, Georgia, serif;
  font-size: 13px;
  color: rgba(13, 59, 102, 0.6);
  font-style: italic;
  margin-bottom: 5px;
}

.cert-titulo {
  font-size: 32px;
  font-weight: bold;
  color: #0d3b66;
  text-transform: uppercase;
  letter-spacing: 6px;
  margin: 0 0 14px 0;
  font-family: Georgia, 'Times New Roman', serif;
}

.nombre-line {
  display: flex;
  align-items: baseline;
  justify-content: center;
  margin-bottom: 12px;
}

.a-text {
  font-family: 'Brush Script MT', cursive, Georgia, serif;
  font-size: 18px;
  color: rgba(13, 59, 102, 0.6);
  font-style: italic;
  margin-right: 8px;
}

.nombre-ejemplo {
  font-size: 20px !important;
  font-weight: bold;
  font-family: Impact, 'Arial Black', Arial, sans-serif;
  color: #0d3b66 !important;
  text-transform: uppercase;
  border-bottom: 2px solid rgba(13, 59, 102, 0.6);
  padding-bottom: 3px;
  min-width: 280px;
  text-align: center;
  letter-spacing: 1px;
  margin: 0 !important;
  background: none !important;
}

.participacion-text {
  font-family: 'Brush Script MT', cursive, Georgia, serif;
  font-size: 12px;
  color: rgba(13, 59, 102, 0.6);
  font-style: italic;
  margin-bottom: 8px;
}

.tema-ejemplo {
  font-size: 15px !important;
  font-weight: bold;
  color: #0d3b66 !important;
  margin: 8px auto 12px !important;
  max-width: 70%;
  line-height: 1.3;
  padding: 0 !important;
  background: none !important;
  border: none !important;
  display: block;
  font-family: Georgia, 'Times New Roman', serif;
}

.cert-details {
  margin: 12px auto;
  font-size: 8px;
  color: rgba(13, 59, 102, 0.8);
  padding: 5px 10px;
  background: rgba(13, 59, 102, 0.05);
  border: 1px solid rgba(13, 59, 102, 0.25);
  border-radius: 14px;
  display: inline-block;
  font-family: Georgia, 'Times New Roman', serif;
}

.detail-item {
  margin: 0 6px;
  display: inline-block;
}

.detail-item strong {
  font-weight: bold;
  color: #0d3b66;
}

.detail-separator {
  margin: 0 3px;
  color: rgba(13, 59, 102, 0.6);
}

/* Firmas en el footer */
.cert-firmas {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10px;
  gap: 15px;
  padding: 0 15px;
}

.firma-mock {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  max-width: 30%;
}

.firma-mock img {
  max-width: 75px;
  max-height: 28px;
  object-fit: contain;
  margin-bottom: 4px;
}

.firma-placeholder-img {
  width: 75px;
  height: 22px;
  border: 1px dashed rgba(13, 59, 102, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(13, 59, 102, 0.03);
  border-radius: 3px;
  margin-bottom: 4px;
  font-size: 6px;
  color: rgba(13, 59, 102, 0.5);
  font-style: italic;
}

.firma-placeholder {
  width: 75px;
  height: 22px;
  border: 1px dashed rgba(13, 59, 102, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(13, 59, 102, 0.03);
  border-radius: 3px;
  margin-bottom: 4px;
}

.firma-placeholder p {
  font-size: 6px;
  color: rgba(13, 59, 102, 0.5);
  margin: 0;
  font-style: italic;
}

.firma-linea {
  width: 85%;
  height: 1.2px;
  background-color: rgba(13, 59, 102, 0.6);
}

.firma-nombre {
  font-weight: 600;
  color: #0d3b66;
  margin: 3px 0;
  font-size: 7.5px;
  text-align: center;
  line-height: 1.2;
  font-family: Georgia, 'Times New Roman', serif;
}

.firma-cargo {
  color: rgba(13, 59, 102, 0.6);
  font-size: 6.5px;
  margin: 0;
  font-style: italic;
  text-align: center;
  font-family: Georgia, 'Times New Roman', serif;
}

/* Sección QR + Logo Centro */
.qr-section {
  flex: 0 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.logo-centro {
  text-align: center;
  margin-bottom: 3px;
}

.logo-centro img {
  max-width: 65px;
  height: auto;
  max-height: 26px;
  opacity: 0.7;
}

.qr-placeholder-small {
  width: 34px;
  height: 34px;
  border: 1.5px dashed rgba(13, 59, 102, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 6px;
  color: rgba(13, 59, 102, 0.5);
  background: rgba(13, 59, 102, 0.03);
  border-radius: 3px;
  font-weight: bold;
  font-family: Georgia, 'Times New Roman', serif;
}

.qr-text {
  font-size: 6px;
  color: #0d3b66;
  margin: 0;
  font-weight: 600;
  letter-spacing: 0.4px;
  font-family: Georgia, 'Times New Roman', serif;
}

.qr-code {
  font-size: 5.5px;
  color: rgba(13, 59, 102, 0.5);
  margin: 0;
  font-family: 'Courier New', monospace;
}

.preview-actions {
  text-align: center;
  margin: 20px 0;
  padding: 16px;
  background-color: #eff6ff;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
}

.btn-preview-download {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 12px 32px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
}

.btn-preview-download:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-2px);
}

.btn-preview-download:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 1024px) {
  .firmas-content {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .gestion-firmas {
    padding: 16px;
  }

  .preview-certificado {
    padding: 16px;
  }
  
  .certificado-container {
    padding: 5px;
    margin-top: 16px;
  }

  .btn-preview-download {
    padding: 10px 20px;
    font-size: 0.9rem;
  }
  
  .hint {
    font-size: 0.8rem;
  }
}
</style>
