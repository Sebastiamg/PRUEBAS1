<template>
  <div class="escanear-container">
    <div class="escanear-header">
      <button @click="volver" class="btn-back">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver
      </button>
      <h1>Escaneo de Documento #{{ ven_codigo }}</h1>
      <div class="status-badge" :class="estadoBadgeClass">
        {{ estadoTexto }}
      </div>
    </div>

    <div class="escanear-content">
      <div class="info-panel">
        <div class="info-row">
          <span class="label">Documento:</span>
          <span class="value">Venta #{{ ven_codigo }}</span>
        </div>
        <div class="info-row">
          <span class="label">Fecha inicio escaneo:</span>
          <span class="value">{{ fechaInicio || 'No iniciado' }}</span>
        </div>
        <div class="info-row">
          <span class="label">Mis códigos subidos:</span>
          <span class="value">{{ codigosSubidosUsuario }}</span>
        </div>
        <div class="info-row">
          <span class="label">Total códigos subidos:</span>
          <span class="value total-codigos">{{ codigosSubidosTotal }}</span>
        </div>
        <div class="info-row" v-if="fechaFin">
          <span class="label">Fecha finalización:</span>
          <span class="value">{{ fechaFin }}</span>
        </div>
      </div>

      <div class="acciones-panel">
        <button v-if="miEstado !== 'en_proceso'" @click="iniciarEscaneo" class="btn-iniciar" :disabled="cargando">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ miEstado === 'finalizado' ? 'Iniciar Nuevo Escaneo' : 'Iniciar Escaneo' }}
        </button>

        <button v-if="miEstado === 'en_proceso'" @click="finalizarEscaneo" class="btn-finalizar" :disabled="cargando">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Finalizar Escaneo
        </button>
      </div>

      <div class="usuarios-panel" v-if="usuariosAsignados.length > 0">
        <h3>Usuarios asignados</h3>
        <div class="usuarios-list">
          <div v-for="user in usuariosAsignados" :key="user.id" class="usuario-item" :class="{
            'finalizado': user.estado === 2,
            'proceso': user.estado === 1,
            'es-mi-usuario': user.usuario_id === userData.idusuario
          }">
            <div class="usuario-avatar">
              <span>{{ getIniciales(user.nombres, user.apellidos) }}</span>
              <span v-if="user.estado === 1" class="estado-indicador activo"></span>
              <span v-else-if="user.estado === 2" class="estado-indicador completado"></span>
            </div>
            <div class="usuario-info">
              <div class="usuario-header">
                <strong>
                  {{ user.nombres }} {{ user.apellidos }}
                  <span v-if="user.usuario_id === userData.idusuario" class="mi-usuario-tag">(yo)</span>
                </strong>
                <span class="usuario-estado" :class="{
                  'estado-activo': user.estado === 1,
                  'estado-completado': user.estado === 2
                }">
                  <span v-if="user.estado === 1" class="estado-chip proceso">🟢 EN PROCESO</span>
                  <span v-else-if="user.estado === 2" class="estado-chip finalizado">✅ FINALIZADO</span>
                </span>
              </div>
              <div class="usuario-fechas">
                <span v-if="user.fecha_inicio" class="fecha">
                  📅 Inicio: {{ formatFechaCompleta(user.fecha_inicio) }}
                </span>
                <span v-if="user.fecha_fin" class="fecha">
                  🏁 Fin: {{ formatFechaCompleta(user.fecha_fin) }}
                </span>
                <span v-if="user.estado === 1 && user.fecha_inicio" class="tiempo-transcurrido">
                  ⏱️ Tiempo: {{ calcularTiempoTranscurrido(user.fecha_inicio) }}
                </span>
                <span v-if="user.estado === 2 && user.fecha_inicio && user.fecha_fin" class="tiempo-total">
                  ⏱️ Duración total: {{ calcularDuracionTotal(user.fecha_inicio, user.fecha_fin) }}
                </span>
              </div>
            </div>
            <div class="usuario-codigos" v-if="user.codigos_subidos > 0">
              📦 {{ user.codigos_subidos }} códigos
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EscanearDocumento',

  data() {
    return {
      ven_codigo: null,
      fechaInicio: null,
      codigosSubidosUsuario: 0,
      codigosSubidosTotal: 0,
      fechaFin: null,
      miEstado: 'pendiente',
      cargando: false,
      usuariosAsignados: [],
      userData: null,
      codigosSubidos: 0,
      estadoVenta: null,
      escaneoActivoId: null
    }
  },

  computed: {
    estadoBadgeClass() {
      if (this.estadoVenta === 'anulado') return 'badge-anulado'
      if (this.estadoVenta === 'despachado') return 'badge-despachado'
      if (this.miEstado === 'finalizado') return 'badge-finalizado'
      if (this.miEstado === 'en_proceso') return 'badge-proceso'
      return 'badge-pendiente'
    },
    estadoTexto() {
      if (this.estadoVenta === 'anulado') return 'ANULADO'
      if (this.estadoVenta === 'despachado') return 'DESPACHADO'
      if (this.miEstado === 'finalizado') return 'FINALIZADO'
      if (this.miEstado === 'en_proceso') return 'EN PROCESO'
      return 'PENDIENTE'
    }
  },

  created() {
    this.cargarUsuario()
    this.obtenerCodigoDocumento()
    this.cargarEstadoDocumento()
  },

  methods: {
    cargarUsuario() {
      var userData = localStorage.getItem('userBodega')
      if (userData) {
        this.userData = JSON.parse(userData)
      }
    },

    obtenerCodigoDocumento() {
      this.ven_codigo = this.$route.params.codigo
      if (!this.ven_codigo) {
        this.$router.push('/bodega/escanear')
      }
    },

    cargarEstadoDocumento() {
      this.cargando = true

      this.$http.get(this.$server_url + 'buscarDocumento', {
        params: {
          usuario_id: this.userData.idusuario,
          ven_codigo: this.ven_codigo
        }
      })
        .then(function(response) {
          this.cargando = false

          if (response.data.status === 1) {
            var documento = response.data.documento

            if (documento) {
              this.miEstado = documento.mi_estado
              this.fechaInicio = documento.fecha_inicio
              this.fechaFin = documento.fecha_fin
              this.estadoVenta = documento.estado_venta
              this.codigosSubidosUsuario = documento.codigos_subidos_usuario || 0
              this.codigosSubidosTotal = documento.codigos_subidos || 0
              this.escaneoActivoId = documento.escaneo_activo_id || null
            }

            this.cargarUsuariosAsignados()
          } else {
            this.$vs.notify({
              text: response.data.message || 'Error al cargar el documento',
              color: 'warning',
              time: 3000
            })
          }
        }.bind(this))
        .catch(function(error) {
          this.cargando = false
          console.error('Error:', error)
          this.$vs.notify({
            text: 'Error al cargar el documento',
            color: 'danger',
            time: 3000
          })
        }.bind(this))
    },

    volver() {
      this.$router.push('/bodega/escanear')
    },

    iniciarEscaneo() {
      this.cargando = true
      this.$http.post(this.$server_url + 'iniciarEscaneoDocumento', {
        ven_codigo: this.ven_codigo,
        usuario_id: this.userData.idusuario
      })
        .then(function(response) {
          this.cargando = false
          if (response.data.status === 1) {
            this.miEstado = 'en_proceso'
            this.fechaInicio = response.data.data.fecha_inicio
            this.escaneoActivoId = response.data.data.id
            this.codigosSubidosUsuario = 0
            this.fechaFin = null
            this.$vs.notify({
              text: response.data.message || 'Sesión de escaneo iniciada',
              color: 'success',
              time: 3000
            })
            this.cargarUsuariosAsignados()
            this.cargarEstadoDocumento()
          } else {
            this.$vs.notify({
              text: response.data.message,
              color: 'warning',
              time: 3000
            })
          }
        }.bind(this))
        .catch(function(error) {
          this.cargando = false
          console.error('Error:', error)
          this.$vs.notify({
            text: 'Error al iniciar escaneo',
            color: 'danger',
            time: 3000
          })
        }.bind(this))
    },

    finalizarEscaneo() {
      if (!this.escaneoActivoId) {
        this.$vs.notify({
          text: 'No hay una sesión activa para finalizar',
          color: 'warning',
          time: 3000
        })
        return
      }

      this.$vs.dialog({
        type: 'confirm',
        title: 'Finalizar Escaneo',
        text: '¿Estás seguro de que has completado el escaneo de todos los códigos?',
        acceptText: 'Sí, finalizar',
        cancelText: 'Cancelar',
        accept: function() {
          this.cargando = true
          this.$http.post(this.$server_url + 'finalizarEscaneoUsuario', {
            escaneo_id: this.escaneoActivoId,
            ven_codigo: this.ven_codigo,
            usuario_id: this.userData.idusuario
          })
            .then(function(response) {
              this.cargando = false
              if (response.data.status === 1) {
                this.miEstado = 'finalizado'
                this.fechaFin = new Date().toLocaleString()
                this.escaneoActivoId = null
                this.$vs.notify({
                  text: response.data.message,
                  color: 'success',
                  time: 3000
                })
                this.cargarEstadoDocumento()
              } else {
                this.$vs.notify({
                  text: response.data.message || 'Error al finalizar escaneo',
                  color: 'warning',
                  time: 3000
                })
              }
            }.bind(this))
            .catch(function(error) {
              this.cargando = false
              console.error('Error:', error)
              this.$vs.notify({
                text: 'Error al finalizar el escaneo',
                color: 'danger',
                time: 3000
              })
            }.bind(this))
        }.bind(this)
      })
    },

    getIniciales(nombres, apellidos) {
      if (!nombres) return '??'
      return (nombres.charAt(0) + (apellidos ? apellidos.charAt(0) : '')).toUpperCase()
    },

    formatFechaCompleta(fecha) {
      if (!fecha) return ''
      var date = new Date(fecha)
      return date.toLocaleString('es-EC', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      })
    },

    calcularTiempoTranscurrido(fechaInicio) {
      var inicio = new Date(fechaInicio)
      var ahora = new Date()
      var diferenciaMs = ahora - inicio
      var diferenciaSegundos = Math.floor(diferenciaMs / 1000)
      var dias = Math.floor(diferenciaSegundos / 86400)
      var horas = Math.floor((diferenciaSegundos % 86400) / 3600)
      var minutos = Math.floor((diferenciaSegundos % 3600) / 60)
      if (dias > 0) {
        return dias + 'd ' + horas + 'h ' + minutos + 'm'
      } else if (horas > 0) {
        return horas + 'h ' + minutos + 'm'
      } else {
        return minutos + 'm'
      }
    },

    calcularDuracionTotal(fechaInicio, fechaFin) {
      var inicio = new Date(fechaInicio)
      var fin = new Date(fechaFin)
      var diferenciaMs = fin - inicio
      var diferenciaSegundos = Math.floor(diferenciaMs / 1000)
      var dias = Math.floor(diferenciaSegundos / 86400)
      var horas = Math.floor((diferenciaSegundos % 86400) / 3600)
      var minutos = Math.floor((diferenciaSegundos % 3600) / 60)
      if (dias > 0) {
        return dias + 'd ' + horas + 'h ' + minutos + 'm'
      } else if (horas > 0) {
        return horas + 'h ' + minutos + 'm'
      } else {
        return minutos + 'm'
      }
    },

    cargarUsuariosAsignados() {
      this.$vs.loading({
        color: '#046AE7'
      })
      this.$http.get(this.$server_url + 'usuariosAsignadosDocumento', {
        params: {
          ven_codigo: this.ven_codigo
        }
      })
        .then(function(response) {
          if (response.data.status === 1) {
            this.usuariosAsignados = response.data.usuarios || []
          }
        }.bind(this))
        .catch(function(error) {
          console.error('Error al cargar usuarios asignados:', error)
        }.bind(this))
        .finally(function() {
          this.$vs.loading.close()
        }.bind(this))
    }
  }
}
</script>

<style lang="scss" scoped>
.escanear-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
}

.escanear-header {
  background: white;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  border-bottom: 1px solid #e2e8f0;

  h1 {
    font-size: 1.25rem;
    margin: 0;
    color: #1e293b;
  }
}

.btn-back {
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
    background: #f1f5f9;
    border-color: #94a3b8;
  }
}

.status-badge {
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

  &.badge-despachado {
    background: #ede9fe;
    color: #5b21b6;
  }

  &.badge-anulado {
    background: #fee2e2;
    color: #991b1b;
  }
}

.escanear-content {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.info-panel,
.acciones-panel,
.usuarios-panel {
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-row {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #e2e8f0;

  &:last-child {
    border-bottom: none;
  }

  .label {
    font-weight: 600;
    color: #64748b;
  }

  .value {
    color: #1e293b;
  }
}

.acciones-panel {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-iniciar,
.btn-finalizar {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;

  svg {
    width: 1.25rem;
    height: 1.25rem;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-iniciar {
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  color: white;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
  }
}

.btn-finalizar {
  background: #10b981;
  color: white;

  &:hover:not(:disabled) {
    background: #059669;
    transform: translateY(-2px);
  }
}

.usuarios-panel {
  h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: #1e293b;
  }
}

.usuarios-list {
  display: grid;
  gap: 0.75rem;
}

.usuario-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem;
  background: #f8fafc;
  border-radius: 0.75rem;
  border-left: 4px solid #cbd5e1;

  &.finalizado {
    border-left-color: #10b981;
  }

  &.proceso {
    border-left-color: #3b82f6;
  }

  &.es-mi-usuario {
    background: #eff6ff;
    border-left-color: #2563eb;
  }
}

.usuario-avatar {
  position: relative;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #2563eb 0%, #3b82f6 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 1rem;

  .estado-indicador {
    position: absolute;
    bottom: -2px;
    right: -2px;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    border: 2px solid white;

    &.activo {
      background: #f59e0b;
      animation: pulse 1.5s ease-in-out infinite;
    }

    &.completado {
      background: #10b981;
    }
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

.usuario-info {
  flex: 1;

  strong {
    display: block;
    font-size: 0.875rem;
    color: #1e293b;
  }
}

.usuario-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.usuario-estado {
  .estado-chip {
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.7rem;
    font-weight: 600;

    &.proceso {
      background: #fef3c7;
      color: #92400e;
    }

    &.finalizado {
      background: #d1fae5;
      color: #065f46;
    }
  }
}

.usuario-fechas {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 0.5rem;

  .fecha {
    font-size: 0.7rem;
    color: #64748b;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
  }

  .tiempo-transcurrido {
    font-size: 0.7rem;
    color: #f59e0b;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: #fef3c7;
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
  }

  .tiempo-total {
    font-size: 0.7rem;
    color: #10b981;
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.25rem;
    background: #d1fae5;
    padding: 0.125rem 0.5rem;
    border-radius: 12px;
  }
}

.mi-usuario-tag {
  font-size: 0.7rem;
  font-weight: normal;
  color: #2563eb;
  background: #dbeafe;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  margin-left: 0.5rem;
}

.usuario-codigos {
  background: #e2e8f0;
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 600;
  color: #475569;
}
</style>