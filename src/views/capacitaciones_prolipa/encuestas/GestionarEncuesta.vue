<template>
  <div class="gestion-encuesta">
    <div class="gestion-header">
      <button @click="$emit('cerrar')" class="btn-volver">
        <Icon name="arrow-left" /> Volver a Lista
      </button>
      <h2><Icon name="settings" /> Configurar Encuesta</h2>
    </div>

    <div v-if="cargando" class="loading-container">
      <p><Icon name="hourglass" /> Cargando encuesta...</p>
    </div>

    <div v-else-if="encuesta" class="gestion-content">
      <!-- SECCIÓN 1: INFORMACIÓN BÁSICA -->
      <div class="seccion-card">
        <div class="seccion-header">
          <h3><Icon name="edit" /> Información Básica</h3>
          <span :class="'badge-estado badge-' + encuesta.estado">
            {{ estadoTexto }}
          </span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Tema</label>
            <input
              type="text"
              v-model="form.tema"
              placeholder="Tema de la encuesta"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Descripción</label>
            <textarea
              v-model="form.descripcion"
              rows="3"
              placeholder="Descripción del propósito de la encuesta"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 2: VIGENCIA -->
      <div class="seccion-card">
        <div class="seccion-header">
          <h3><Icon name="calendar" /> Vigencia de la Encuesta</h3>
        </div>

        <p class="hint-activacion" v-if="encuesta.estado === 'borrador'">
          <Icon name="info" /> Para poder activar la encuesta necesitas configurar al menos la <strong>Fecha de Inicio</strong>.
        </p>

        <div class="form-row dos-columnas">
          <div class="form-group">
            <label><Icon name="calendar" /> Fecha de Inicio</label>
            <input type="datetime-local" v-model="form.fecha_inicio" />
            <small>Requerida para poder activar la encuesta</small>
          </div>

          <div class="form-group">
            <label><Icon name="calendar" /> Fecha de Fin</label>
            <input type="datetime-local" v-model="form.fecha_fin" :min="form.fecha_inicio" />
            <small>Dejar vacío = sin fecha límite</small>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 3: ALCANCE -->
      <div class="seccion-card">
        <div class="seccion-header">
          <h3><Icon name="globe" /> Alcance de la Encuesta</h3>
        </div>

        <!-- Modo de edición -->
        <div v-if="editandoAlcance" class="edicion-alcance">
          <div class="form-group">
            <label>
              <input
                type="radio"
                value="true"
                v-model="formAlcance.es_para_todos"
              />
              <Icon name="globe" /> Para toda la empresa
            </label>
            <label>
              <input
                type="radio"
                value="false"
                v-model="formAlcance.es_para_todos"
              />
              <Icon name="building" /> Para departamentos específicos
            </label>
          </div>

          <div v-if="formAlcance.es_para_todos === 'false'" class="departamentos-selector">
            <p class="selector-label">Selecciona los departamentos:</p>
            <div class="departamentos-grid">
              <label
                v-for="dept in departamentosDisponibles"
                :key="dept.tdp_id"
                class="dept-checkbox"
              >
                <input
                  type="checkbox"
                  :value="dept.tdp_id"
                  v-model="formAlcance.departamentos"
                />
                <span>{{ dept.tdp_nombre }}</span>
              </label>
            </div>
            <p v-if="formAlcance.departamentos.length === 0" class="error-mensaje">
              <Icon name="warning" /> Debes seleccionar al menos un departamento
            </p>
          </div>

          <div class="acciones-alcance">
            <button @click="cancelarEdicionAlcance" class="btn-cancelar-alcance">
              Cancelar
            </button>
            <button
              @click="guardarAlcance"
              class="btn-guardar-alcance"
              :disabled="!validarAlcance"
            >
              Guardar Alcance
            </button>
          </div>
        </div>

        <!-- Modo de vista -->
        <div v-else class="vista-alcance">
          <div class="alcance-info">
            <span v-if="form.es_para_todos" class="badge-alcance todo">
              <Icon name="globe" /> Para toda la empresa
            </span>
            <span v-else class="badge-alcance departamentos">
              <Icon name="building" /> {{ encuesta.departamentos ? encuesta.departamentos.length : 0 }} departamento(s) seleccionados
            </span>
          </div>

          <div v-if="!form.es_para_todos && encuesta.departamentos && encuesta.departamentos.length > 0" class="departamentos-asignados">
            <span
              v-for="dept in encuesta.departamentos"
              :key="dept.tdp_id"
              class="dept-chip"
            >
              {{ dept.tdp_nombre }}
            </span>
          </div>

          <button @click="iniciarEdicionAlcance" class="btn-editar-alcance">
            <Icon name="pencil" /> Editar Alcance
          </button>
        </div>
      </div>

      <!-- SECCIÓN 4: ESTADÍSTICAS (solo si no es borrador) -->
      <div v-if="encuesta.estado !== 'borrador'" class="seccion-card">
        <div class="seccion-header">
          <h3><Icon name="chart" /> Estadísticas</h3>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon"><Icon name="users" size="2rem" /></div>
            <div class="stat-valor">{{ encuesta.respuestas_count || 0 }}</div>
            <div class="stat-label">Respuestas Recibidas</div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 5: CONTENIDO -->
      <div class="seccion-card">
        <div class="seccion-header">
          <h3><Icon name="folder" /> Contenido</h3>
        </div>

        <div class="contenido-tabs">
          <button
            @click="tabContenido = 'resumen'"
            class="tab-btn-small"
            :class="{ active: tabContenido === 'resumen' }"
          >
            <Icon name="list" /> Resumen
          </button>
          <button
            @click="tabContenido = 'secciones'"
            class="tab-btn-small"
            :class="{ active: tabContenido === 'secciones' }"
          >
            <Icon name="question" /> Secciones y Preguntas
          </button>
        </div>

        <!-- Tab: Resumen -->
        <div v-if="tabContenido === 'resumen'" class="tab-content-small">
          <div class="contenido-resumen">
            <div class="resumen-item">
              <span class="resumen-icon"><Icon name="folder" size="1.5rem" /></span>
              <span class="resumen-text">{{ encuesta.secciones ? encuesta.secciones.length : 0 }} secciones</span>
            </div>
            <div class="resumen-item">
              <span class="resumen-icon"><Icon name="question" size="1.5rem" /></span>
              <span class="resumen-text">{{ totalPreguntas }} preguntas</span>
            </div>
          </div>

          <button
            v-if="encuesta.estado === 'borrador'"
            @click="editarContenido"
            class="btn-secondary"
          >
            <Icon name="pencil" /> Editar Secciones y Preguntas
          </button>
          <p v-else class="hint-solo-borrador">
            <Icon name="info" /> El contenido solo puede editarse mientras la encuesta está en borrador.
          </p>
        </div>

        <!-- Tab: Secciones y Preguntas -->
        <div v-if="tabContenido === 'secciones'" class="tab-content-small">
          <div v-if="encuesta.secciones && encuesta.secciones.length > 0" class="preview-secciones">
            <div v-for="(seccion, sIndex) in encuesta.secciones" :key="seccion.id || sIndex" class="seccion-preview-card">
              <div class="seccion-preview-header">
                <span class="seccion-num">Sección {{ sIndex + 1 }}</span>
                <h4 v-if="seccion.titulo">{{ seccion.titulo }}</h4>
              </div>
              <p v-if="seccion.descripcion" class="seccion-descripcion-preview">{{ seccion.descripcion }}</p>

              <div v-for="(pregunta, pIndex) in seccion.preguntas" :key="pregunta.id || pIndex" class="pregunta-preview-card">
                <div class="pregunta-preview-header">
                  <span class="pregunta-num">Pregunta {{ pIndex + 1 }}</span>
                  <span class="pregunta-tipo-badge">{{ tipoPreguntaLabel(pregunta.tipo_pregunta) }}</span>
                </div>
                <p class="pregunta-enunciado-text">{{ pregunta.enunciado }}</p>

                <div v-if="['simple', 'multiple'].includes(pregunta.tipo_pregunta)" class="pregunta-opciones-preview">
                  <div v-for="(opcion, oIndex) in pregunta.opciones" :key="opcion.id || oIndex" class="opcion-preview">
                    <span>{{ opcion.texto_opcion }}</span>
                  </div>
                </div>
                <div v-else-if="pregunta.tipo_pregunta === 'escala'" class="escala-preview">
                  Escala de {{ pregunta.escala_min }} a {{ pregunta.escala_max }}
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-preview">
            <Icon name="alert" size="2.5rem" color="#94a3b8" />
            <p>No hay secciones configuradas</p>
          </div>
        </div>
      </div>

      <!-- BOTONES DE ACCIÓN -->
      <div class="acciones-footer">
        <button
          v-if="encuesta.estado === 'borrador'"
          @click="activarEncuesta"
          class="btn-activar"
          :disabled="guardando"
        >
          <Icon name="rocket" /> Activar Encuesta
        </button>

        <button
          v-if="encuesta.estado === 'activa'"
          @click="desactivarEncuesta"
          class="btn-desactivar"
          :disabled="guardando"
        >
          <Icon name="pause" /> Desactivar Encuesta
        </button>

        <button
          v-if="encuesta.estado === 'inactiva'"
          @click="reactivarEncuesta"
          class="btn-activar"
          :disabled="guardando"
        >
          <Icon name="play" /> Reactivar Encuesta
        </button>

        <button
          @click="guardarCambios"
          class="btn-guardar"
          :disabled="guardando"
        >
          <template v-if="guardando">
            <Icon name="hourglass" /> Guardando...
          </template>
          <template v-else>
            <Icon name="save" /> Guardar Cambios
          </template>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';

export default {
  name: 'GestionarEncuesta',
  components: {
    Icon
  },
  props: {
    encuestaId: {
      type: Number,
      required: true
    },
    idusuario: {
      type: [Number, String],
      required: true
    }
  },
  data() {
    return {
      cargando: true,
      guardando: false,
      encuesta: null,
      departamentosDisponibles: [],
      editandoAlcance: false,
      tabContenido: 'resumen',
      form: {
        tema: '',
        descripcion: '',
        fecha_inicio: null,
        fecha_fin: null,
        es_para_todos: true
      },
      formAlcance: {
        es_para_todos: 'true',
        departamentos: []
      }
    };
  },
  computed: {
    estadoTexto() {
      const estados = { activa: 'Activa', inactiva: 'Inactiva', borrador: 'Borrador' };
      return estados[this.encuesta.estado] || 'Desconocido';
    },
    validarAlcance() {
      if (this.formAlcance.es_para_todos === 'true') return true;
      return this.formAlcance.departamentos.length > 0;
    },
    totalPreguntas() {
      if (!this.encuesta || !this.encuesta.secciones) return 0;
      return this.encuesta.secciones.reduce((total, seccion) => total + ((seccion.preguntas && seccion.preguntas.length) || 0), 0);
    }
  },
  mounted() {
    this.cargarEncuesta();
    this.cargarDepartamentos();
  },
  methods: {
    async cargarEncuesta() {
      this.cargando = true;
      try {
        const response = await this.$http.get(`${this.$server_url}capacitaciones_prolipa/admin/encuestas/${this.encuestaId}`);

        if (response.data.success) {
          this.encuesta = response.data.data;

          this.form = {
            tema: this.encuesta.tema,
            descripcion: this.encuesta.descripcion,
            fecha_inicio: this.formatearFechaParaInput(this.encuesta.fecha_inicio),
            fecha_fin: this.formatearFechaParaInput(this.encuesta.fecha_fin),
            es_para_todos: this.encuesta.es_para_todos
          };
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar la encuesta', tipo: 'error' });
      } finally {
        this.cargando = false;
      }
    },

    formatearFechaParaInput(fecha) {
      if (!fecha) return null;
      const date = new Date(fecha);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    },

    async guardarCambios() {
      this.guardando = true;
      try {
        const payload = {
          idusuario: this.idusuario,
          ...this.form
        };

        const response = await this.$http.put(
          `${this.$server_url}capacitaciones_prolipa/admin/encuestas/${this.encuestaId}`,
          payload
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Cambios guardados exitosamente', tipo: 'success' });
          await this.cargarEncuesta();
        }
      } catch (error) {
        const mensaje = (error.response && error.response.data && error.response.data.message) || 'Error al guardar los cambios';
        this.$emit('show-toast', { mensaje, tipo: 'error' });
      } finally {
        this.guardando = false;
      }
    },

    async activarEncuesta() {
      await this.cambiarEstado('activa');
    },
    async desactivarEncuesta() {
      await this.cambiarEstado('inactiva');
    },
    async reactivarEncuesta() {
      await this.cambiarEstado('activa');
    },

    async cambiarEstado(nuevoEstado) {
      this.guardando = true;
      try {
        const response = await this.$http.post(
          `${this.$server_url}capacitaciones_prolipa/admin/encuestas/${this.encuestaId}/estado`,
          { estado: nuevoEstado, idusuario: this.idusuario }
        );

        if (response.data.success) {
          this.$emit('show-toast', {
            mensaje: `Encuesta ${nuevoEstado === 'activa' ? 'activada' : 'desactivada'} correctamente`,
            tipo: 'success'
          });
          await this.cargarEncuesta();
        }
      } catch (error) {
        const mensaje = (error.response && error.response.data && error.response.data.message) || 'Error al cambiar el estado';
        this.$emit('show-toast', { mensaje, tipo: 'error' });
      } finally {
        this.guardando = false;
      }
    },

    editarContenido() {
      this.$emit('editar-contenido', this.encuesta);
    },

    async cargarDepartamentos() {
      try {
        const response = await this.$http.get(`${this.$server_url}capacitaciones_prolipa/admin/departamentos`);
        if (response.data.success) {
          this.departamentosDisponibles = response.data.data;
        }
      } catch (error) {
        // silencioso
      }
    },

    iniciarEdicionAlcance() {
      this.formAlcance.es_para_todos = this.encuesta.es_para_todos ? 'true' : 'false';
      this.formAlcance.departamentos = this.encuesta.departamentos
        ? this.encuesta.departamentos.map(d => d.tdp_id)
        : [];
      this.editandoAlcance = true;
    },

    cancelarEdicionAlcance() {
      this.editandoAlcance = false;
      this.formAlcance = { es_para_todos: 'true', departamentos: [] };
    },

    async guardarAlcance() {
      if (!this.validarAlcance) {
        this.$emit('show-toast', { mensaje: 'Debes seleccionar al menos un departamento', tipo: 'error' });
        return;
      }

      this.guardando = true;
      try {
        const esParaTodos = this.formAlcance.es_para_todos === 'true';

        const payload = {
          idusuario: this.idusuario,
          tema: this.encuesta.tema,
          descripcion: this.encuesta.descripcion,
          es_para_todos: esParaTodos,
          departamentos: esParaTodos ? [] : this.formAlcance.departamentos,
          fecha_inicio: this.encuesta.fecha_inicio,
          fecha_fin: this.encuesta.fecha_fin
        };

        const response = await this.$http.put(
          `${this.$server_url}capacitaciones_prolipa/admin/encuestas/${this.encuestaId}`,
          payload
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Alcance actualizado exitosamente', tipo: 'success' });
          this.editandoAlcance = false;
          await this.cargarEncuesta();
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al actualizar el alcance', tipo: 'error' });
      } finally {
        this.guardando = false;
      }
    },

    tipoPreguntaLabel(tipo) {
      const labels = {
        simple: 'Opción Única',
        multiple: 'Opción Múltiple',
        texto_corto: 'Respuesta Corta',
        texto_largo: 'Respuesta Larga',
        escala: 'Escala'
      };
      return labels[tipo] || tipo;
    }
  }
};
</script>

<style scoped>
.gestion-encuesta {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  color: #1e293b;
  max-width: 1200px;
  margin: 0 auto;
}

.gestion-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.btn-volver {
  background: #ffffff;
  color: #3b82f6;
  border: 1px solid #e2e8f0;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-volver:hover {
  background: #eff6ff;
  border-color: #3b82f6;
}

.gestion-header h2 {
  margin: 0;
  color: #3b82f6;
  font-size: 1.5rem;
}

.loading-container {
  text-align: center;
  padding: 40px;
  color: #475569;
}

.seccion-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.seccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e2e8f0;
}

.seccion-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.1rem;
}

.badge-estado {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-activa {
  background-color: rgba(34, 197, 94, 0.15);
  color: #16a34a;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.badge-inactiva {
  background-color: rgba(239, 68, 68, 0.15);
  color: #dc2626;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-borrador {
  background-color: rgba(100, 116, 139, 0.15);
  color: #475569;
  border: 1px solid rgba(100, 116, 139, 0.3);
}

.form-row {
  margin-bottom: 16px;
}

.dos-columnas {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
}

.form-group input,
.form-group textarea {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  color: #1e293b;
  font-size: 0.9rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-group small {
  font-size: 0.75rem;
  color: #64748b;
}

.hint-activacion {
  background-color: #fef3c7;
  border: 1px solid #fde68a;
  color: #92400e;
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.85rem;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.hint-solo-borrador {
  color: #64748b;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
}

.alcance-info {
  margin-bottom: 16px;
}

.badge-alcance {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  display: inline-block;
}

.badge-alcance.todo {
  background-color: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.badge-alcance.departamentos {
  background-color: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.departamentos-asignados {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.dept-chip {
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #2563eb;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stat-card {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
}

.stat-valor {
  font-size: 1.8rem;
  font-weight: bold;
  color: #3b82f6;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.85rem;
  color: #475569;
}

.contenido-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid #e2e8f0;
}

.tab-btn-small {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: none;
  color: #64748b;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab-btn-small:hover {
  color: #1e293b;
}

.tab-btn-small.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.contenido-resumen {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.resumen-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.resumen-text {
  color: #475569;
  font-size: 0.95rem;
}

.btn-secondary {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #2563eb;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #eff6ff;
  border-color: #2563eb;
}

.preview-secciones {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.seccion-preview-card {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #3b82f6;
  border-radius: 12px;
  padding: 16px;
}

.seccion-preview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.seccion-num {
  font-weight: 700;
  color: #2563eb;
  font-size: 0.85rem;
}

.seccion-preview-header h4 {
  margin: 0;
  color: #1e293b;
}

.seccion-descripcion-preview {
  color: #64748b;
  font-size: 0.9rem;
  margin-bottom: 12px;
}

.pregunta-preview-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px;
  margin-top: 10px;
}

.pregunta-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.pregunta-num {
  font-weight: 700;
  color: #3b82f6;
  font-size: 0.85rem;
}

.pregunta-tipo-badge {
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  background-color: rgba(59, 130, 246, 0.15);
  color: #2563eb;
}

.pregunta-enunciado-text {
  color: #1e293b;
  font-size: 0.95rem;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.pregunta-opciones-preview {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.opcion-preview {
  padding: 6px 10px;
  background-color: #f8fafc;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #475569;
}

.escala-preview {
  font-size: 0.85rem;
  color: #64748b;
}

.empty-preview {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-preview p {
  margin-top: 12px;
}

.acciones-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
  flex-wrap: wrap;
}

.btn-activar,
.btn-desactivar,
.btn-guardar {
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-activar {
  background-color: #22c55e;
  color: white;
}

.btn-activar:hover:not(:disabled) {
  background-color: #16a34a;
}

.btn-desactivar {
  background-color: #ef4444;
  color: white;
}

.btn-desactivar:hover:not(:disabled) {
  background-color: #dc2626;
}

.btn-guardar {
  background-color: #3b82f6;
  color: white;
}

.btn-guardar:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-activar:disabled,
.btn-desactivar:disabled,
.btn-guardar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.edicion-alcance {
  padding: 20px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.edicion-alcance .form-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 20px;
}

.edicion-alcance .form-group label {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  background-color: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.edicion-alcance .form-group label:hover {
  border-color: #3b82f6;
  background-color: #f5f3ff;
}

.edicion-alcance .form-group input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.departamentos-selector {
  margin-top: 16px;
}

.selector-label {
  font-size: 0.9rem;
  color: #475569;
  margin-bottom: 12px;
  font-weight: 600;
}

.departamentos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 10px;
  margin-bottom: 12px;
}

.dept-checkbox {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}

.dept-checkbox:hover {
  background-color: #f5f3ff;
  border-color: #3b82f6;
}

.dept-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.error-mensaje {
  color: #ef4444;
  font-size: 0.85rem;
  margin-top: 8px;
}

.acciones-alcance {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 16px;
}

.btn-cancelar-alcance,
.btn-guardar-alcance {
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn-cancelar-alcance {
  background-color: #f1f5f9;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.btn-cancelar-alcance:hover {
  background-color: #e2e8f0;
}

.btn-guardar-alcance {
  background-color: #3b82f6;
  color: white;
}

.btn-guardar-alcance:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-guardar-alcance:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-editar-alcance {
  margin-top: 16px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #2563eb;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-editar-alcance:hover {
  background: rgba(59, 130, 246, 0.2);
}

@media (max-width: 768px) {
  .dos-columnas {
    grid-template-columns: 1fr;
  }

  .acciones-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .departamentos-grid {
    grid-template-columns: 1fr;
  }

  .acciones-alcance {
    flex-direction: column;
  }

  .btn-cancelar-alcance,
  .btn-guardar-alcance {
    width: 100%;
  }
}
</style>
