<template>
  <div class="escaneador-container">
    <div class="escaneador-header">
      <div class="user-info">
        <div class="user-avatar">
          <span>{{ inicialesUsuario }}</span>
        </div>
        <div class="user-details">
          <h3>{{ userData.nombres }} {{ userData.apellidos }}</h3>
          <p>Cédula: {{ userData.cedula }}</p>
        </div>
      </div>
      <button @click="cerrarSesionGeneral" class="btn-logout-header">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Cerrar Sesión
      </button>
    </div>

    <div class="escaneador-content">
      <div class="documentos-panel">
        <div class="panel-header">
          <h2>Buscar Documento</h2>
        </div>

        <div class="buscador-container">
          <div class="search-box">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" v-model="documentoBuscar" placeholder="Ingrese número de documento..."
              class="search-input" @keyup.enter="buscarDocumentoEspecifico" />
          </div>
          <button @click="buscarDocumentoEspecifico" class="btn-buscar" :disabled="buscando">
            {{ buscando ? 'Buscando...' : 'Buscar' }}
          </button>
        </div>

        <div class="panel-body" v-if="documentoEncontrado">
          <div class="documento-card" :class="estadoCardClass">
            <div class="documento-card-header">
              <div class="documento-icon">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="documento-titulo">
                <h4>{{ documentoEncontrado.ven_codigo }}</h4>
                <span class="badge" :class="getEstadoClass(documentoEncontrado)">{{ getEstadoTexto(documentoEncontrado) }}</span>
              </div>
            </div>

            <div class="documento-detalles">
              <div class="detalle-item">
                <span class="label">📅 Fecha:</span>
                <span>{{ formatFecha(documentoEncontrado.ven_fecha) }}</span>
              </div>
              <div class="detalle-item" v-if="documentoEncontrado.fecha_inicio">
                <span class="label">⏱️ Inicio:</span>
                <span>{{ formatFecha(documentoEncontrado.fecha_inicio) }}</span>
              </div>
              <div class="detalle-item" v-if="documentoEncontrado.fecha_fin">
                <span class="label">🏁 Fin:</span>
                <span>{{ formatFecha(documentoEncontrado.fecha_fin) }}</span>
              </div>
              <div class="detalle-item">
                <span class="label">📦 Mis códigos:</span>
                <span>{{ documentoEncontrado.codigos_subidos_usuario || 0 }}</span>
              </div>
              <div class="detalle-item">
                <span class="label">📦 Total códigos:</span>
                <span>{{ documentoEncontrado.codigos_subidos || 0 }}</span>
              </div>
            </div>

            <div class="acciones-botones">
              <button v-if="documentoEncontrado.mi_estado !== 'en_proceso'"
                @click="iniciarEscaneoDesdeModal(documentoEncontrado.ven_codigo)" class="btn-iniciar"
                :disabled="cargandoAccion">
                {{ documentoEncontrado.mi_estado === 'finalizado' ? '🔄 Iniciar Nuevo Escaneo' : '▶ Iniciar Escaneo' }}
              </button>
              <button v-if="documentoEncontrado.mi_estado === 'en_proceso'" @click="finalizarEscaneoDesdeModal"
                class="btn-finalizar" :disabled="cargandoAccion">
                ⏹️ Finalizar Escaneo
              </button>
            </div>

            <div class="usuarios-section" v-if="documentoEncontrado.usuarios_escaneando && documentoEncontrado.usuarios_escaneando.length">
              <h5>👥 Usuarios asignados ({{ documentoEncontrado.usuarios_escaneando.length }})</h5>
              <div class="usuarios-grid">
                <div v-for="user in documentoEncontrado.usuarios_escaneando" :key="user.id" class="usuario-card"
                  :class="{ 'usuario-activo': user.estado === 1, 'usuario-finalizado': user.estado === 2 }">
                  <div class="usuario-avatar-small">
                    <span>{{ getIniciales(user.nombres, user.apellidos) }}</span>
                    <span class="estado-punto"
                      :class="{ 'punto-activo': user.estado === 1, 'punto-finalizado': user.estado === 2 }"></span>
                  </div>
                  <div class="usuario-info-small">
                    <strong>{{ user.nombres }} {{ user.apellidos }}</strong>
                    <span v-if="user.usuario_id === userData.idusuario" class="mi-usuario-tag">(yo)</span>
                    <span class="usuario-estado-texto">{{ user.estado === 1 ? 'En proceso' : 'Finalizado' }}</span>
                    <div class="usuario-fechas-small">
                      <span>Inicio: {{ formatHora(user.fecha_inicio) }}</span>
                      <span v-if="user.fecha_fin">Fin: {{ formatHora(user.fecha_fin) }}</span>
                    </div>
                  </div>
                  <div class="usuario-codigos-small" v-if="user.codigos_subidos > 0">
                    📦 {{ user.codigos_subidos }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="panel-body" v-else-if="buscando">
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Buscando documento...</p>
          </div>
        </div>

        <div class="panel-body" v-else-if="busquedaRealizada && !documentoEncontrado">
          <div class="empty-state">
            <p>No se encontró el documento</p>
          </div>
        </div>
      </div>

      <div class="documentos-panel" v-if="misDocumentosActivos.length">
        <div class="panel-header">
          <h2>📋 Mis documentos en proceso</h2>
          <div class="document-count">{{ misDocumentosActivos.length }}</div>
        </div>
        <div class="panel-body">
          <div class="documentos-grid">
            <div v-for="doc in misDocumentosActivos" :key="doc.ven_codigo" class="documento-mini-card"
              @click="seleccionarDocumentoMini(doc.ven_codigo)">
              <div class="mini-icon">📄</div>
              <div class="mini-info">
                <strong>{{ doc.ven_codigo }}</strong>
                <span>Inicio: {{ formatHora(doc.fecha_inicio) }}</span>
                <span>📦 {{ doc.codigos_subidos || 0 }} códigos</span>
              </div>
              <div class="mini-arrow">▶</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <vs-popup v-model="modalEscaneoVisible" width="550px">
      <template #header>
        <h4 class="modal-title">📷 Escaneando: {{ documentoEscaneando }}</h4>
      </template>
      <div class="modal-scanner-content">
        <div class="scanner-placeholder">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
          </svg>
          <p>Área de escaneo de códigos</p>
          <small>Aquí irá el componente de escáner</small>
        </div>
      </div>
      <template #footer>
        <div class="modal-footer-actions">
          <button @click="finalizarEscaneoDesdeModal" class="btn-finalizar-modal">✅ Finalizar Escaneo</button>
          <button @click="cerrarModal" class="btn-cerrar-modal">❌ Cerrar</button>
        </div>
      </template>
    </vs-popup>
  </div>
</template>

<script>
export default {
  name: 'index',

  data() {
    return {
      userData: null,
      documentoBuscar: '',
      documentoEncontrado: null,
      misDocumentosActivos: [],
      buscando: false,
      busquedaRealizada: false,
      cargandoAccion: false,
      modalEscaneoVisible: false,
      documentoEscaneando: null,
      escaneoActivoId: null
    }
  },

  computed: {
    inicialesUsuario() {
      if (!this.userData) return '??'
      var nombres = this.userData.nombres || ''
      var apellidos = this.userData.apellidos || ''
      return (nombres.charAt(0) + (apellidos ? apellidos.charAt(0) : '')).toUpperCase() || 'U'
    },
    estadoCardClass() {
      var estado = this.documentoEncontrado ? this.documentoEncontrado.mi_estado : null
      return {
        'estado-pendiente': estado === 'pendiente',
        'estado-proceso': estado === 'en_proceso',
        'estado-finalizado': estado === 'finalizado'
      }
    }
  },

  created() {
    this.validarAutenticacion()
    this.cargarMisDocumentosActivos()
  },

  methods: {
    validarAutenticacion() {
      var userBodega = localStorage.getItem('userBodega')
      if (!userBodega) {
        this.$router.push('/bodega/login')
        return
      }
      try {
        this.userData = JSON.parse(userBodega)
        if (!this.userData.idusuario) {
          this.$router.push('/bodega/login')
        }
      } catch (error) {
        console.error('Error:', error)
        this.$router.push('/bodega/login')
      }
    },

    cargarMisDocumentosActivos() {
      this.$http.get(this.$server_url + 'misDocumentosActivos', { 
        params: { usuario_id: this.userData.idusuario } 
      })
        .then(function(res) {
          if (res.data.status === 1) {
            this.misDocumentosActivos = res.data.documentos || []
          }
        }.bind(this))
        .catch(function(err) {
          console.error('Error:', err)
        }.bind(this))
    },

    buscarDocumentoEspecifico() {
      if (!this.documentoBuscar.trim()) {
        this.$vs.notify({ text: 'Ingrese un número de documento', color: 'warning', time: 3000 })
        return
      }

      this.buscando = true
      this.busquedaRealizada = true
      this.documentoEncontrado = null

      this.$http.get(this.$server_url + 'buscarDocumento', {
        params: { 
          usuario_id: this.userData.idusuario, 
          ven_codigo: this.documentoBuscar.trim().toUpperCase() 
        }
      }).then(function(res) {
        this.buscando = false
        if (res.data.status === 1) {
          this.documentoEncontrado = res.data.documento
          this.escaneoActivoId = this.documentoEncontrado.escaneo_activo_id
        } else {
          this.$vs.notify({ text: res.data.message || 'Documento no encontrado', color: 'warning', time: 3000 })
        }
      }.bind(this)).catch(function(err) {
        this.buscando = false
        console.error('Error:', err)
        this.$vs.notify({ text: 'Error al buscar documento', color: 'danger', time: 3000 })
      }.bind(this))
    },

    seleccionarDocumentoMini(ven_codigo) {
      this.documentoBuscar = ven_codigo
      this.buscarDocumentoEspecifico()
    },

    getEstadoClass(doc) {
      if (doc.mi_estado === 'finalizado') return 'badge-finalizado'
      if (doc.mi_estado === 'en_proceso') return 'badge-proceso'
      return 'badge-pendiente'
    },

    getEstadoTexto(doc) {
      if (doc.mi_estado === 'finalizado') return 'FINALIZADO'
      if (doc.mi_estado === 'en_proceso') return 'EN PROCESO'
      return 'PENDIENTE'
    },

    formatFecha(fecha) {
      if (!fecha) return ''
      return new Date(fecha).toLocaleString()
    },

    formatHora(fecha) {
      if (!fecha) return ''
      return new Date(fecha).toLocaleTimeString()
    },

    getIniciales(nombres, apellidos) {
      if (!nombres) return '??'
      return (nombres.charAt(0) + (apellidos ? apellidos.charAt(0) : '')).toUpperCase()
    },

    iniciarEscaneoDesdeModal(ven_codigo) {
      this.cargandoAccion = true
      this.$http.post(this.$server_url + 'iniciarEscaneoDocumento', {
        ven_codigo: ven_codigo,
        usuario_id: this.userData.idusuario
      }).then(function(res) {
        this.cargandoAccion = false
        if (res.data.status === 1) {
          this.documentoEscaneando = ven_codigo
          this.escaneoActivoId = res.data.data.id
          this.modalEscaneoVisible = true
          this.buscarDocumentoEspecifico()
          this.cargarMisDocumentosActivos()
        } else {
          this.$vs.notify({ text: res.data.message || 'Error al iniciar escaneo', color: 'warning', time: 3000 })
        }
      }.bind(this)).catch(function(err) {
        this.cargandoAccion = false
        console.error('Error:', err)
        this.$vs.notify({ text: 'Error al iniciar el escaneo', color: 'danger', time: 4000 })
      }.bind(this))
    },

    finalizarEscaneoDesdeModal() {
      if (!this.escaneoActivoId) {
        this.$vs.notify({ text: 'No hay una sesión activa para finalizar', color: 'warning', time: 3000 })
        return
      }

      this.$vs.dialog({
        type: 'confirm',
        title: 'Finalizar Escaneo',
        text: '¿Estás seguro de que has completado el escaneo de todos los códigos?',
        acceptText: 'Sí, finalizar',
        cancelText: 'Cancelar',
        accept: function() {
          this.cargandoAccion = true
          this.$http.post(this.$server_url + 'finalizarEscaneoUsuario', {
            escaneo_id: this.escaneoActivoId,
            ven_codigo: this.documentoEscaneando || (this.documentoEncontrado ? this.documentoEncontrado.ven_codigo : null),
            usuario_id: this.userData.idusuario
          }).then(function(res) {
            this.cargandoAccion = false
            if (res.data.status === 1) {
              this.$vs.notify({ text: res.data.message, color: 'success', time: 3000 })
              this.modalEscaneoVisible = false
              this.documentoEscaneando = null
              this.escaneoActivoId = null
              this.buscarDocumentoEspecifico()
              this.cargarMisDocumentosActivos()
            } else {
              this.$vs.notify({ text: res.data.message || 'Error al finalizar escaneo', color: 'warning', time: 3000 })
            }
          }.bind(this)).catch(function(err) {
            this.cargandoAccion = false
            console.error('Error:', err)
            this.$vs.notify({ text: 'Error al finalizar el escaneo', color: 'danger', time: 3000 })
          }.bind(this))
        }.bind(this)
      })
    },

    cerrarModal() {
      this.modalEscaneoVisible = false
      this.documentoEscaneando = null
    },

    cerrarSesionGeneral() {
      this.$vs.dialog({
        type: 'confirm',
        title: 'Cerrar Sesión',
        text: '¿Estás seguro de que deseas cerrar sesión?',
        accept: function() {
          localStorage.removeItem('userBodega')
          this.$router.push('/bodega/login')
        }.bind(this)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.escaneador-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.escaneador-header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e2e8f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.user-avatar {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
}

.user-details h3 {
  margin: 0;
  font-size: 1rem;
  color: #1e293b;
}

.user-details p {
  margin: 0;
  font-size: 0.875rem;
  color: #64748b;
}

.btn-logout-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s;

  svg {
    width: 1rem;
    height: 1rem;
  }

  &:hover {
    background: #ef4444;
    border-color: #ef4444;
    color: white;
  }
}

.escaneador-content {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.documentos-panel {
  background: white;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.panel-header {
  padding: 1rem 1.5rem;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;

  h2 {
    margin: 0;
    font-size: 1.125rem;
    color: #1e293b;
  }
}

.document-count {
  background: #2563eb;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
}

.buscador-container {
  padding: 1rem 1.5rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  border-bottom: 1px solid #e2e8f0;
}

.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;

  svg {
    width: 1.25rem;
    height: 1.25rem;
    color: #94a3b8;
  }

  .search-input {
    flex: 1;
    border: none;
    background: none;
    outline: none;
    font-size: 0.875rem;
  }
}

.btn-buscar {
  padding: 0.5rem 1.5rem;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.panel-body {
  padding: 1.5rem;
}

.documento-card {
  background: #f8fafc;
  border-radius: 1rem;
  padding: 1.25rem;
  border-left: 4px solid transparent;

  &.estado-pendiente {
    border-left-color: #f59e0b;
  }

  &.estado-proceso {
    border-left-color: #3b82f6;
  }

  &.estado-finalizado {
    border-left-color: #10b981;
  }
}

.documento-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
  flex-wrap: wrap;
}

.documento-titulo {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;

  h4 {
    margin: 0;
    font-size: 1rem;
    color: #1e293b;
  }
}

.documento-icon {
  width: 48px;
  height: 48px;
  background: #e0e7ff;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    width: 24px;
    height: 24px;
    color: #2563eb;
  }
}

.badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;

  &.badge-pendiente {
    background: #fef3c7;
    color: #92400e;
  }

  &.badge-proceso {
    background: #dbeafe;
    color: #1e40af;
  }

  &.badge-finalizado {
    background: #d1fae5;
    color: #065f46;
  }
}

.documento-detalles {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.75rem;
}

.detalle-item {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;

  .label {
    font-weight: 600;
    color: #64748b;
  }
}

.acciones-botones {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-bottom: 1.5rem;
}

.btn-iniciar,
.btn-finalizar {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-iniciar {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;
}

.btn-finalizar {
  background: #10b981;
  color: white;
}

.usuarios-section {
  margin-top: 1rem;

  h5 {
    margin: 0 0 0.75rem 0;
    font-size: 0.875rem;
    color: #1e293b;
  }
}

.usuarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 0.75rem;
}

.usuario-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: white;
  border-radius: 0.75rem;
  border-left: 3px solid #cbd5e1;

  &.usuario-activo {
    border-left-color: #f59e0b;
    background: #fffbeb;
  }

  &.usuario-finalizado {
    border-left-color: #10b981;
  }
}

.usuario-avatar-small {
  position: relative;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
}

.estado-punto {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid white;

  &.punto-activo {
    background: #f59e0b;
    animation: pulse 1.5s ease-in-out infinite;
  }

  &.punto-finalizado {
    background: #10b981;
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.9);
  }
}

.usuario-info-small {
  flex: 1;

  strong {
    display: block;
    font-size: 0.8rem;
  }

  .usuario-estado-texto {
    font-size: 0.7rem;
    color: #64748b;
  }
}

.usuario-fechas-small {
  display: flex;
  gap: 0.5rem;
  font-size: 0.65rem;
  color: #94a3b8;
}

.usuario-codigos-small {
  font-size: 0.7rem;
  background: #e2e8f0;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
}

.mi-usuario-tag {
  font-size: 0.65rem;
  background: #dbeafe;
  color: #2563eb;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}

.documentos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 0.75rem;
}

.documento-mini-card {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.3s;
  border-left: 3px solid #3b82f6;

  &:hover {
    background: #f1f5f9;
    transform: translateX(4px);
  }

  .mini-icon {
    font-size: 1.5rem;
  }

  .mini-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;

    strong {
      font-size: 0.8rem;
    }

    span {
      font-size: 0.7rem;
      color: #64748b;
    }
  }

  .mini-arrow {
    color: #94a3b8;
    font-size: 0.8rem;
  }
}

.loading-state,
.empty-state {
  text-align: center;
  padding: 2rem;

  p {
    color: #64748b;
  }
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #e2e8f0;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.modal-title {
  margin: 0;
  font-size: 1.2rem;
  color: #1e293b;
}

.modal-scanner-content {
  padding: 1rem 0;
  min-height: 300px;
}

.scanner-placeholder {
  text-align: center;
  padding: 2rem;
  background: #f8fafc;
  border-radius: 0.75rem;

  svg {
    width: 4rem;
    height: 4rem;
    color: #94a3b8;
    margin-bottom: 1rem;
  }

  p {
    margin: 0;
    color: #64748b;
  }

  small {
    color: #94a3b8;
  }
}

.modal-footer-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid #e2e8f0;
}

.btn-finalizar-modal,
.btn-cerrar-modal {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
}

.btn-finalizar-modal {
  background: #10b981;
  color: white;
}

.btn-cerrar-modal {
  background: #ef4444;
  color: white;
}

@media (max-width: 640px) {
  .escaneador-header {
    flex-direction: column;
    text-align: center;
  }

  .escaneador-content {
    padding: 1rem;
  }

  .buscador-container {
    flex-direction: column;
  }

  .acciones-botones {
    flex-direction: column;
  }

  .usuarios-grid,
  .documentos-grid {
    grid-template-columns: 1fr;
  }
}
</style>