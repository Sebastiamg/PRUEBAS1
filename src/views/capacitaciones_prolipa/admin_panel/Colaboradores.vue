<template>
  <div class="colaboradores-container">
    <div class="colaboradores-header">
      <div>
        <h2><Icon name="users" /> Gestión de Colaboradores</h2>
        <p class="subtitle">Administra los colaboradores de Prolipa y sus departamentos</p>
      </div>
    </div>

    <!-- Filtros -->
    <div class="filtros-panel">
      <div class="filtro-busqueda">
        <input 
          type="text" 
          v-model="filtros.busqueda" 
          placeholder="Buscar por nombre, apellido o cédula..."
          @input="buscarColaboradores"
          class="input-busqueda"
        />
      </div>
      
      <div class="filtro-departamento">
        <select v-model="filtros.departamento_id" @change="cargarColaboradores" class="select-filtro">
          <option value="">Todos los departamentos</option>
          <option v-for="dept in departamentos" :key="dept.tdp_id" :value="dept.tdp_id">
            {{ dept.tdp_nombre }}
          </option>
        </select>
      </div>
      
      <button @click="limpiarFiltros" class="btn-limpiar">
        <Icon name="refresh" /> Limpiar filtros
      </button>
    </div>

    <!-- Tabla de colaboradores -->
    <div class="tabla-colaboradores">
      <div v-if="cargando" class="loading">
        <div class="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Cargando colaboradores...</p>
      </div>

      <div v-else-if="colaboradores.length === 0" class="sin-datos">
        <Icon name="alert" size="3rem" color="#94a3b8" />
        <p>No se encontraron colaboradores</p>
      </div>

      <table v-else class="tabla">
        <thead>
          <tr>
            <th>Cédula</th>
            <th>Nombres</th>
            <th>Apellidos</th>
            <th>Email</th>
            <th>Departamento</th>
            <th>Tipo de Contrato</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="colaborador in colaboradores" :key="colaborador.idusuario">
            <td>{{ colaborador.cedula || 'N/A' }}</td>
            <td>{{ colaborador.nombres }}</td>
            <td>{{ colaborador.apellidos }}</td>
            <td>{{ colaborador.email || 'N/A' }}</td>
            <td>
              <select 
                :value="colaborador.tdp_id || ''"
                @change="actualizarDepartamento(colaborador, $event.target.value)"
                class="select-departamento-inline"
                :disabled="actualizandoUsuario === colaborador.idusuario"
              >
                <option value="">Sin asignar</option>
                <option v-for="dept in departamentos" :key="dept.tdp_id" :value="dept.tdp_id">
                  {{ dept.tdp_nombre }}
                </option>
              </select>
            </td>
            <td>
              <select
                :value="colaborador.tipo_contrato || ''"
                @change="actualizarTipoContrato(colaborador, $event.target.value)"
                class="select-departamento-inline"
                :disabled="actualizandoUsuario === colaborador.idusuario"
              >
                <option value="">Sin asignar</option>
                <option value="nomina">Contrato de Trabajo</option>
                <option value="civil">Contrato Civil</option>
              </select>
            </td>
            <td>
              <label class="toggle-switch" :title="colaborador.estado == '1' ? 'Desactivar' : 'Activar'">
                <input 
                  type="checkbox" 
                  :checked="colaborador.estado == '1'"
                  @change="cambiarEstado(colaborador, $event.target.checked)"
                  :disabled="actualizandoUsuario === colaborador.idusuario"
                />
                <span class="toggle-slider"></span>
              </label>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Eliminado el modal -->
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';

export default {
  name: 'Colaboradores',
  components: {
    Icon
  },
  data() {
    return {
      cargando: true,
      colaboradores: [],
      departamentos: [],
      filtros: {
        busqueda: '',
        departamento_id: ''
      },
      actualizandoUsuario: null,
      busquedaTimeout: null
    };
  },
  mounted() {
    this.cargarDepartamentos();
    this.cargarColaboradores();
  },
  methods: {
    async cargarDepartamentos() {
      try {
        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/departamentos`
        );
        
        if (response.data.success) {
          this.departamentos = response.data.data;
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar departamentos', tipo: 'error' });
      }
    },

    async cargarColaboradores() {
      this.cargando = true;
      try {
        const params = new URLSearchParams();
        if (this.filtros.busqueda) params.append('busqueda', this.filtros.busqueda);
        if (this.filtros.departamento_id) params.append('departamento_id', this.filtros.departamento_id);

        const response = await this.$http.get(
          `${this.$server_url}capacitaciones_prolipa/admin/colaboradores?${params.toString()}`
        );
        
        if (response.data.success) {
          this.colaboradores = response.data.data;
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar colaboradores', tipo: 'error' });
      } finally {
        this.cargando = false;
      }
    },

    buscarColaboradores() {
      // Debounce para no hacer muchas peticiones
      clearTimeout(this.busquedaTimeout);
      this.busquedaTimeout = setTimeout(() => {
        this.cargarColaboradores();
      }, 500);
    },

    limpiarFiltros() {
      this.filtros.busqueda = '';
      this.filtros.departamento_id = '';
      this.cargarColaboradores();
    },

    async actualizarDepartamento(colaborador, nuevoDepartamentoId) {
      if (!nuevoDepartamentoId) {
        this.$emit('show-toast', { mensaje: 'Selecciona un departamento', tipo: 'error' });
        return;
      }

      // Si es el mismo departamento, no hacer nada
      if (colaborador.tdp_id && colaborador.tdp_id.toString() === nuevoDepartamentoId.toString()) {
        return;
      }

      this.actualizandoUsuario = colaborador.idusuario;
      try {
        const response = await this.$http.put(
          `${this.$server_url}capacitaciones_prolipa/admin/colaboradores/${colaborador.idusuario}/departamento`,
          { tdp_id: parseInt(nuevoDepartamentoId) }
        );
        
        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Departamento actualizado exitosamente', tipo: 'success' });
          this.cargarColaboradores();
        }
      } catch (error) {
        const mensaje = error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Error al actualizar departamento';
        this.$emit('show-toast', { mensaje: mensaje, tipo: 'error' });
        // Recargar para revertir el cambio visual
        this.cargarColaboradores();
      } finally {
        this.actualizandoUsuario = null;
      }
    },

    async actualizarTipoContrato(colaborador, nuevoTipoContrato) {
      if (!nuevoTipoContrato) {
        this.$emit('show-toast', { mensaje: 'Selecciona un tipo de contrato', tipo: 'error' });
        return;
      }

      if (colaborador.tipo_contrato && colaborador.tipo_contrato === nuevoTipoContrato) {
        return;
      }

      this.actualizandoUsuario = colaborador.idusuario;
      try {
        const response = await this.$http.put(
          `${this.$server_url}capacitaciones_prolipa/admin/colaboradores/${colaborador.idusuario}/tipo-contrato`,
          { tipo_contrato: nuevoTipoContrato }
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Tipo de contrato actualizado exitosamente', tipo: 'success' });
          this.cargarColaboradores();
        }
      } catch (error) {
        const mensaje = error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Error al actualizar tipo de contrato';
        this.$emit('show-toast', { mensaje: mensaje, tipo: 'error' });
        this.cargarColaboradores();
      } finally {
        this.actualizandoUsuario = null;
      }
    },

    async cambiarEstado(colaborador, activar) {
      const nuevoEstado = activar ? '1' : '2';
      
      this.actualizandoUsuario = colaborador.idusuario;
      try {
        const response = await this.$http.put(
          `${this.$server_url}capacitaciones_prolipa/admin/colaboradores/${colaborador.idusuario}/estado`,
          { estado: nuevoEstado }
        );
        
        if (response.data.success) {
          const accion = activar ? 'activado' : 'desactivado';
          this.$emit('show-toast', { mensaje: `Colaborador ${accion} exitosamente`, tipo: 'success' });
          this.cargarColaboradores();
        }
      } catch (error) {
        const mensaje = error.response && error.response.data && error.response.data.message ? error.response.data.message : 'Error al cambiar estado';
        this.$emit('show-toast', { mensaje: mensaje, tipo: 'error' });
        // Recargar para revertir el cambio visual
        this.cargarColaboradores();
      } finally {
        this.actualizandoUsuario = null;
      }
    }
  }
};
</script>

<style scoped>
.colaboradores-container {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.colaboradores-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.colaboradores-header h2 {
  font-size: 2rem;
  color: #1e293b;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

/* Filtros */
.filtros-panel {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
  align-items: center;
}

.filtro-busqueda {
  flex: 1;
  min-width: 300px;
}

.input-busqueda {
  width: 100%;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.input-busqueda::placeholder {
  color: #94a3b8;
}

.input-busqueda:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.filtro-departamento {
  min-width: 250px;
}

.select-filtro,
.select-departamento {
  width: 100%;
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.select-filtro:focus,
.select-departamento:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-filtro option,
.select-departamento option {
  background: #ffffff;
  color: #1e293b;
}

.btn-limpiar {
  padding: 12px 20px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 8px;
  color: #f87171;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
}

.btn-limpiar:hover {
  background: rgba(239, 68, 68, 0.2);
  transform: translateY(-1px);
}

/* Tabla */
.tabla-colaboradores {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  overflow-x: auto;
}

.loading,
.sin-datos {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  margin-top: 80px;
  color: #64748b;
}

.loading-dots {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.loading-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #3b82f6;
  animation: bounce 1.4s infinite ease-in-out both;
}

.loading-dots span:nth-child(1) {
  animation-delay: -0.32s;
}

.loading-dots span:nth-child(2) {
  animation-delay: -0.16s;
}

@keyframes bounce {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.tabla {
  width: 100%;
  border-collapse: collapse;
  min-width: 1050px;
}

.tabla thead th {
  text-align: left;
  padding: 12px;
  background-color: #f8fafc;
  color: #475569;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 2px solid #e2e8f0;
  white-space: nowrap;
}

.tabla tbody td {
  padding: 16px 12px;
  border-bottom: 1px solid #f1f5f9;
  color: #1e293b;
  font-size: 0.95rem;
}

.tabla tbody tr:hover {
  background-color: #f8fafc;
}

.select-departamento-inline {
  width: 100%;
  max-width: 300px;
  padding: 8px 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #1e293b;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
}

.select-departamento-inline:focus {
  outline: none;
  border-color: #3b82f6;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.select-departamento-inline:disabled {
  opacity: 0.5;
  cursor: wait;
  background: #f1f5f9;
}

.select-departamento-inline option {
  background: #ffffff;
  color: #1e293b;
  padding: 8px;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 26px;
  cursor: pointer;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(239, 68, 68, 0.3);
  border: 2px solid rgba(239, 68, 68, 0.5);
  transition: all 0.3s ease;
  border-radius: 26px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
  left: 2px;
  bottom: 2px;
  background-color: #ef4444;
  transition: all 0.3s ease;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.toggle-switch input:checked + .toggle-slider {
  background-color: rgba(16, 185, 129, 0.3);
  border-color: rgba(16, 185, 129, 0.5);
}

.toggle-switch input:checked + .toggle-slider:before {
  background-color: #10b981;
  transform: translateX(24px);
}

.toggle-switch input:disabled + .toggle-slider {
  opacity: 0.5;
  cursor: not-allowed;
}

.toggle-switch:hover .toggle-slider:not(input:disabled + .toggle-slider) {
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
  .colaboradores-container {
    padding: 16px;
  }

  .colaboradores-header h2 {
    font-size: 1.5rem;
  }

  .filtros-panel {
    flex-direction: column;
    align-items: stretch;
  }

  .filtro-busqueda,
  .filtro-departamento {
    min-width: 100%;
  }

  .tabla-colaboradores {
    padding: 16px;
    overflow-x: auto;
  }

  .select-departamento-inline {
    max-width: 100%;
    font-size: 0.85rem;
  }
}
</style>
