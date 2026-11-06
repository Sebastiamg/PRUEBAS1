<template>
  <div class="gestion-capacitacion">
    <div class="gestion-header">
      <button @click="$emit('cerrar')" class="btn-volver">
        <Icon name="arrow-left" /> Volver a Lista
      </button>
      <h2><Icon name="settings" /> Gestionar Capacitación</h2>
    </div>

    <div v-if="cargando" class="loading-container">
      <p><Icon name="hourglass" /> Cargando capacitación...</p>
    </div>

    <div v-else-if="capacitacion" class="gestion-content">
      <!-- SECCIÓN 1: INFORMACIÓN BÁSICA -->
      <div class="seccion-card">
        <div class="seccion-header">
          <h3><Icon name="edit" /> Información Básica</h3>
          <span :class="'badge-estado badge-' + capacitacion.estado">
            {{ estadoTexto }}
          </span>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Tema</label>
            <input 
              type="text" 
              v-model="form.tema" 
              :disabled="capacitacion.estado === 'activa'"
              placeholder="Tema de la capacitación"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Descripción</label>
            <textarea 
              v-model="form.descripcion" 
              rows="3"
              :disabled="capacitacion.estado === 'activa'"
              placeholder="Descripción y objetivos"
            ></textarea>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 2: CONFIGURACIÓN DE EVALUACIÓN -->
      <div class="seccion-card">
        <div class="seccion-header">
          <h3><Icon name="config" /> Configuración de Evaluación</h3>
        </div>

        <div class="form-row dos-columnas">
          <div class="form-group">
            <label><Icon name="calendar" /> Fecha de Inicio</label>
            <input type="datetime-local" v-model="form.fecha_inicio" />
            <small>Dejar vacío = disponible desde ya</small>
          </div>

          <div class="form-group">
            <label><Icon name="calendar" /> Fecha de Fin</label>
            <input type="datetime-local" v-model="form.fecha_fin" />
            <small>Dejar vacío = sin fecha límite</small>
          </div>
        </div>

        <div class="form-row dos-columnas">
          <div class="form-group">
            <label><Icon name="target" /> Puntaje Mínimo de Aprobación (%)</label>
            <input 
              type="number" 
              v-model.number="form.puntaje_minimo_aprobacion" 
              min="0" 
              max="100"
              step="0.01"
            />
          </div>

          <div class="form-group">
            <label><Icon name="refresh" /> Intentos Permitidos</label>
            <input 
              type="number" 
              v-model.number="form.intentos_permitidos" 
              min="0"
            />
            <small>0 = Intentos ilimitados</small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label><Icon name="clock" /> Duración Estimada (horas)</label>
            <input 
              type="number" 
              v-model.number="form.duracion_estimada" 
              min="0"
            />
            <small>Opcional - Tiempo estimado para completar en horas</small>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label class="checkbox-label">
              <input 
                type="checkbox" 
                v-model="form.mostrar_respuestas_correctas"
              />
              <span class="checkbox-text">
                <Icon name="eye" /> Mostrar respuestas correctas al finalizar la evaluación
              </span>
            </label>
            <small>Si se desactiva, los usuarios solo verán si aprobaron o no, pero no las respuestas correctas</small>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 3: ALCANCE -->
      <div class="seccion-card">
        <div class="seccion-header">
          <h3><Icon name="globe" /> Alcance de la Capacitación</h3>
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
                <span>{{ dept.tdp_nombre }} ({{ dept.tdp_iniciales }})</span>
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
              <Icon name="building" /> {{ capacitacion.departamentos ? capacitacion.departamentos.length : 0 }} departamento(s) seleccionados
            </span>
          </div>

          <div v-if="!form.es_para_todos && capacitacion.departamentos && capacitacion.departamentos.length > 0" class="departamentos-asignados">
            <span 
              v-for="dept in capacitacion.departamentos" 
              :key="dept.tdp_id"
              class="dept-chip"
            >
              {{ dept.tdp_nombre }} ({{ dept.tdp_iniciales }})
            </span>
          </div>

          <button 
            v-if="capacitacion.estado === 'borrador'"
            @click="iniciarEdicionAlcance" 
            class="btn-editar-alcance"
          >
            <Icon name="pencil" /> Editar Alcance
          </button>
        </div>
      </div>

      <!-- SECCIÓN 4: ESTADÍSTICAS (solo si está activa o inactiva) -->
      <div v-if="capacitacion.estado !== 'borrador'" class="seccion-card">
        <div class="seccion-header">
          <h3><Icon name="chart" /> Estadísticas</h3>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon"><Icon name="users" size="2rem" /></div>
            <div class="stat-valor">{{ (capacitacion.estadisticas && capacitacion.estadisticas.total_usuarios) || 0 }}</div>
            <div class="stat-label">Usuarios Participantes</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon"><Icon name="check-circle" size="2rem" color="#60a5fa" /></div>
            <div class="stat-valor">{{ (capacitacion.estadisticas && capacitacion.estadisticas.usuarios_aprobados) || 0 }}</div>
            <div class="stat-label">Aprobados</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon"><Icon name="close" size="2rem" color="#ef4444" /></div>
            <div class="stat-valor">{{ (capacitacion.estadisticas && capacitacion.estadisticas.usuarios_reprobados) || 0 }}</div>
            <div class="stat-label">Reprobados</div>
          </div>

          <div class="stat-card">
            <div class="stat-icon"><Icon name="analytics" size="2rem" color="#3b82f6" /></div>
            <div class="stat-valor">{{ (capacitacion.estadisticas && capacitacion.estadisticas.puntaje_promedio) || 0 }}%</div>
            <div class="stat-label">Puntaje Promedio</div>
          </div>
        </div>
      </div>

      <!-- SECCIÓN 5: RECURSOS Y PREGUNTAS -->
      <div class="seccion-card">
        <div class="seccion-header">
          <h3><Icon name="book" /> Contenido</h3>
        </div>

        <!-- Tabs para contenido -->
        <div class="contenido-tabs">
          <button 
            @click="tabContenido = 'resumen'" 
            class="tab-btn-small"
            :class="{ active: tabContenido === 'resumen' }"
          >
            <Icon name="list" /> Resumen
          </button>
          <button 
            @click="tabContenido = 'material'" 
            class="tab-btn-small"
            :class="{ active: tabContenido === 'material' }"
          >
            <Icon name="book" /> Material
          </button>
          <button 
            @click="tabContenido = 'evaluacion'" 
            class="tab-btn-small"
            :class="{ active: tabContenido === 'evaluacion' }"
          >
            <Icon name="question" /> Evaluación
          </button>
          <button 
            @click="tabContenido = 'preview'" 
            class="tab-btn-small"
            :class="{ active: tabContenido === 'preview' }"
          >
            <Icon name="eye" /> Vista Previa
          </button>
        </div>

        <!-- Tab: Resumen -->
        <div v-if="tabContenido === 'resumen'" class="tab-content-small">
          <div class="contenido-resumen">
            <div class="resumen-item">
              <span class="resumen-icon"><Icon name="document" size="1.5rem" /></span>
              <span class="resumen-text">{{ capacitacion.recursos ? capacitacion.recursos.length : 0 }} recursos de apoyo</span>
            </div>
            <div class="resumen-item">
              <span class="resumen-icon"><Icon name="question" size="1.5rem" /></span>
              <span class="resumen-text">{{ capacitacion.preguntas ? capacitacion.preguntas.length : 0 }} preguntas de evaluación</span>
            </div>
          </div>

          <button 
            v-if="capacitacion.estado === 'borrador'" 
            @click="editarContenido"
            class="btn-secondary"
          >
            <Icon name="pencil" /> Editar Recursos y Preguntas
          </button>
        </div>

        <!-- Tab: Material de Apoyo -->
        <div v-if="tabContenido === 'material'" class="tab-content-small">
          <div v-if="capacitacion.recursos && capacitacion.recursos.length > 0" class="preview-recursos">
            <div v-for="(recurso, index) in capacitacion.recursos" :key="recurso.id || index" class="recurso-preview-card">
              <div class="recurso-preview-header">
                <div class="recurso-numero-small">#{{ index + 1 }}</div>
                <div class="recurso-info-small">
                  <h4>{{ recurso.nombre_recurso }}</h4>
                  <span class="recurso-tipo-badge">{{ tipoRecursoLabel(recurso.tipo_recurso) }}</span>
                </div>
              </div>

              <!-- Video Player -->
              <div v-if="recurso.tipo_recurso === 'video'" class="recurso-video-preview">
                <VideoPlayer :url="recurso.url_recurso" />
              </div>

              <!-- Otros recursos -->
              <div v-else class="recurso-link-preview">
                <a :href="recurso.url_recurso" target="_blank" class="btn-ver-small">
                  <Icon name="external-link" /> Ver Recurso
                </a>
              </div>
            </div>
          </div>
          <div v-else class="empty-preview">
            <Icon name="alert" size="2.5rem" color="#94a3b8" />
            <p>No hay material de apoyo configurado</p>
          </div>
        </div>

        <!-- Tab: Evaluación -->
        <div v-if="tabContenido === 'evaluacion'" class="tab-content-small">
          <div v-if="capacitacion.preguntas && capacitacion.preguntas.length > 0" class="preview-preguntas">
            <div v-for="(pregunta, pIndex) in capacitacion.preguntas" :key="pregunta.id || pIndex" class="pregunta-preview-card">
              <div class="pregunta-preview-header">
                <span class="pregunta-num">Pregunta {{ pIndex + 1 }}</span>
                <span class="pregunta-tipo-badge" :class="'tipo-' + pregunta.tipo_pregunta">
                  {{ tipoPreguntaLabel(pregunta.tipo_pregunta) }}
                </span>
              </div>

              <p class="pregunta-enunciado-text">{{ pregunta.enunciado }}</p>

              <!-- Imagen si existe -->
              <div v-if="pregunta.imagen_url" class="pregunta-imagen-preview">
                <img :src="pregunta.imagen_url" alt="Imagen" />
              </div>

              <!-- Opciones -->
              <div class="pregunta-opciones-preview">
                <div v-for="(opcion, oIndex) in pregunta.opciones" :key="opcion.id || oIndex" class="opcion-preview" :class="{ correcta: opcion.es_correcta }">
                  <Icon v-if="pregunta.tipo_pregunta === 'multiple'" :name="opcion.es_correcta ? 'check-square' : 'square'" />
                  <Icon v-else :name="opcion.es_correcta ? 'check-circle' : 'circle'" />
                  <span>{{ opcion.texto_opcion }}</span>
                  <span v-if="opcion.es_correcta" class="badge-correcta-small">
                    <Icon name="check" /> Correcta
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-preview">
            <Icon name="alert" size="2.5rem" color="#94a3b8" />
            <p>No hay preguntas configuradas</p>
          </div>
        </div>

        <!-- Tab: Vista Previa (Como lo ve el usuario) -->
        <div v-if="tabContenido === 'preview'" class="tab-content-small">
          <div class="preview-intro">
            <div class="preview-badge">
              <Icon name="eye" /> Vista de Usuario Final
            </div>
            <p class="preview-descripcion">Esta es la vista que verán los colaboradores al acceder a esta capacitación</p>
          </div>

          <!-- Simulación de la vista del usuario -->
          <div class="user-preview-container">
            <!-- Header de la capacitación -->
            <div class="user-preview-header">
              <h2 class="user-preview-title">{{ capacitacion.tema }}</h2>
              <p class="user-preview-desc">{{ capacitacion.descripcion }}</p>
              
              <div class="user-preview-meta">
                <div class="meta-item" v-if="capacitacion.duracion_estimada">
                  <Icon name="clock" />
                  <span>{{ capacitacion.duracion_estimada }}h estimadas</span>
                </div>
                <div class="meta-item">
                  <Icon name="target" />
                  <span>{{ capacitacion.puntaje_minimo_aprobacion }}% para aprobar</span>
                </div>
                <div class="meta-item" v-if="capacitacion.intentos_permitidos > 0">
                  <Icon name="refresh" />
                  <span>{{ capacitacion.intentos_permitidos }} intentos</span>
                </div>
                <div class="meta-item" v-else>
                  <Icon name="refresh" />
                  <span>Intentos ilimitados</span>
                </div>
              </div>
            </div>

            <!-- Material de Apoyo -->
            <div class="user-preview-section" v-if="capacitacion.recursos && capacitacion.recursos.length > 0">
              <h3 class="user-section-title">
                <Icon name="book" /> Material de Apoyo
              </h3>
              <div class="user-recursos-list">
                <div v-for="(recurso, index) in capacitacion.recursos" :key="recurso.id || index" class="user-recurso-card">
                  <div class="user-recurso-icon">
                    <Icon :name="recurso.tipo_recurso === 'video' ? 'video' : 'pdf'" size="1.5rem" />
                  </div>
                  <div class="user-recurso-info">
                    <h4>{{ recurso.nombre_recurso }}</h4>
                    <span class="user-recurso-tipo">{{ tipoRecursoLabel(recurso.tipo_recurso) }}</span>
                  </div>
                  <div class="user-recurso-accion">
                    <span class="btn-ver-recurso">Ver</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Evaluación Preview -->
            <div class="user-preview-section" v-if="capacitacion.preguntas && capacitacion.preguntas.length > 0">
              <h3 class="user-section-title">
                <Icon name="question" /> Evaluación
              </h3>
              <div class="user-eval-info">
                <p><Icon name="list" /> {{ capacitacion.preguntas.length }} preguntas en total</p>
                <p><Icon name="target" /> Aprobación con {{ capacitacion.puntaje_minimo_aprobacion }}% o más</p>
              </div>

              <!-- Muestra de preguntas -->
              <div class="user-pregunta-sample">
                <div v-for="(pregunta, pIndex) in capacitacion.preguntas.slice(0, 2)" :key="pregunta.id || pIndex" class="user-pregunta-card">
                  <div class="user-pregunta-numero">Pregunta {{ pIndex + 1 }} de {{ capacitacion.preguntas.length }}</div>
                  <h4 class="user-pregunta-texto">{{ pregunta.enunciado }}</h4>
                  
                  <!-- Imagen de pregunta si existe -->
                  <div v-if="pregunta.imagen_url" class="user-pregunta-imagen">
                    <img :src="pregunta.imagen_url" alt="Imagen de pregunta" />
                  </div>

                  <div class="user-pregunta-opciones">
                    <div v-for="(opcion, oIndex) in pregunta.opciones" :key="opcion.id || oIndex" class="user-opcion">
                      <input 
                        :type="pregunta.tipo_pregunta === 'multiple' ? 'checkbox' : 'radio'" 
                        :name="'preview-q' + pIndex"
                        disabled
                      />
                      <label>{{ opcion.texto_opcion }}</label>
                    </div>
                  </div>
                </div>

                <div v-if="capacitacion.preguntas.length > 2" class="user-more-questions">
                  <Icon name="hourglass" />
                  <span>Y {{ capacitacion.preguntas.length - 2 }} pregunta(s) más...</span>
                </div>
              </div>

              <div class="user-action-button">
                <button class="btn-iniciar-eval" disabled>
                  <Icon name="rocket" /> Iniciar Evaluación
                </button>
              </div>
            </div>

            <div v-else class="user-preview-empty">
              <Icon name="alert" size="2rem" color="#94a3b8" />
              <p>No hay contenido de evaluación para previsualizar</p>
            </div>
          </div>
        </div>
      </div>

      <!-- BOTONES DE ACCIÓN -->
      <div class="acciones-footer">
        <button 
          v-if="capacitacion.estado === 'borrador'" 
          @click="activarCapacitacion"
          class="btn-activar"
          :disabled="guardando"
        >
          <Icon name="rocket" /> Activar Capacitación
        </button>

        <button 
          v-if="capacitacion.estado === 'activa'" 
          @click="desactivarCapacitacion"
          class="btn-desactivar"
          :disabled="guardando"
        >
          <Icon name="pause" /> Desactivar Capacitación
        </button>

        <button 
          v-if="capacitacion.estado === 'inactiva'" 
          @click="reactivarCapacitacion"
          class="btn-activar"
          :disabled="guardando"
        >
          <Icon name="play" /> Reactivar Capacitación
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
import Icon from './Icon.vue';
import VideoPlayer from './VideoPlayer.vue';

export default {
  name: 'GestionarCapacitacion',
  components: {
    Icon,
    VideoPlayer
  },
  props: {
    capacitacionId: {
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
      capacitacion: null,
      departamentosDisponibles: [],
      editandoAlcance: false,
      tabContenido: 'resumen',
      form: {
        tema: '',
        descripcion: '',
        fecha_inicio: null,
        fecha_fin: null,
        puntaje_minimo_aprobacion: 70.00,
        intentos_permitidos: 3,
        duracion_estimada: null,
        mostrar_respuestas_correctas: true,
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
      const estados = {
        activa: 'Activa',
        inactiva: 'Inactiva',
        borrador: 'Borrador'
      };
      return estados[this.capacitacion.estado] || 'Desconocido';
    },
    validarAlcance() {
      if (this.formAlcance.es_para_todos === 'true') return true;
      return this.formAlcance.departamentos.length > 0;
    }
  },
  mounted() {
    this.cargarCapacitacion();
    this.cargarDepartamentos();
  },
  methods: {
    async cargarCapacitacion() {
      this.cargando = true;
      try {
        const response = await this.$http.get(`${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${this.capacitacionId}`);
        
        if (response.data.success) {
          this.capacitacion = response.data.data;
          
          // Llenar el formulario con los datos actuales
          this.form = {
            tema: this.capacitacion.tema,
            descripcion: this.capacitacion.descripcion,
            fecha_inicio: this.formatearFechaParaInput(this.capacitacion.fecha_inicio),
            fecha_fin: this.formatearFechaParaInput(this.capacitacion.fecha_fin),
            puntaje_minimo_aprobacion: this.capacitacion.puntaje_minimo_aprobacion,
            intentos_permitidos: this.capacitacion.intentos_permitidos,
            duracion_estimada: this.capacitacion.duracion_estimada,
            mostrar_respuestas_correctas: this.capacitacion.mostrar_respuestas_correctas !== undefined ? this.capacitacion.mostrar_respuestas_correctas : true,
            es_para_todos: this.capacitacion.es_para_todos
          };
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar la capacitación', tipo: 'error' });
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
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${this.capacitacionId}`,
          payload
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Cambios guardados exitosamente', tipo: 'success' });
          await this.cargarCapacitacion(); // Recargar datos
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al guardar los cambios', tipo: 'error' });
      } finally {
        this.guardando = false;
      }
    },

    async activarCapacitacion() {
      await this.cambiarEstado('activa');
    },

    async desactivarCapacitacion() {
      await this.cambiarEstado('inactiva');
    },

    async reactivarCapacitacion() {
      await this.cambiarEstado('activa');
    },

    async cambiarEstado(nuevoEstado) {
      this.guardando = true;
      try {
        const response = await this.$http.post(
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${this.capacitacionId}/estado`,
          {
            estado: nuevoEstado,
            idusuario: this.idusuario
          }
        );

        if (response.data.success) {
          this.$emit('show-toast', { 
            mensaje: `Capacitación ${nuevoEstado === 'activa' ? 'activada' : 'desactivada'} correctamente`, 
            tipo: 'success' 
          });
          await this.cargarCapacitacion();
        }
      } catch (error) {
        // Mostrar el mensaje de error del servidor si existe
        const mensaje = (error.response && error.response.data && error.response.data.message) || 'Error al cambiar el estado';
        this.$emit('show-toast', { mensaje, tipo: 'error' });
      } finally {
        this.guardando = false;
      }
    },

    editarContenido() {
      this.$emit('editar-contenido', this.capacitacion);
    },

    async cargarDepartamentos() {
      try {
        const response = await this.$http.get(
          `${this.$server_url}VerifcarMetodosGet_DepartamentosProlipa?action=Get_DepartamentosProlipaActivo`
        );
        this.departamentosDisponibles = response.data || [];
      } catch (error) {
      }
    },

    iniciarEdicionAlcance() {
      this.formAlcance.es_para_todos = this.capacitacion.es_para_todos ? 'true' : 'false';
      this.formAlcance.departamentos = this.capacitacion.departamentos 
        ? this.capacitacion.departamentos.map(d => d.tdp_id) 
        : [];
      this.editandoAlcance = true;
    },

    cancelarEdicionAlcance() {
      this.editandoAlcance = false;
      this.formAlcance = {
        es_para_todos: 'true',
        departamentos: []
      };
    },

    async guardarAlcance() {
      if (!this.validarAlcance) {
        this.$emit('show-toast', { 
          mensaje: 'Debes seleccionar al menos un departamento', 
          tipo: 'error' 
        });
        return;
      }

      this.guardando = true;
      try {
        const esParaTodos = this.formAlcance.es_para_todos === 'true';
        
        const payload = {
          idusuario: this.idusuario,
          tema: this.capacitacion.tema,
          descripcion: this.capacitacion.descripcion,
          es_para_todos: esParaTodos,
          departamentos: esParaTodos ? [] : this.formAlcance.departamentos,
          // Preservar fechas y configuración existente
          fecha_inicio: this.capacitacion.fecha_inicio,
          fecha_fin: this.capacitacion.fecha_fin,
          tiempo_minimo: this.capacitacion.tiempo_minimo,
          limite_intentos: this.capacitacion.limite_intentos,
          puntaje_minimo_aprobacion: this.capacitacion.puntaje_minimo_aprobacion,
          mostrar_respuestas_correctas: this.capacitacion.mostrar_respuestas_correctas
        };

        const response = await this.$http.put(
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${this.capacitacionId}`,
          payload
        );

        if (response.data.success) {
          this.$emit('show-toast', { 
            mensaje: 'Alcance actualizado exitosamente', 
            tipo: 'success' 
          });
          this.editandoAlcance = false;
          await this.cargarCapacitacion();
        }
      } catch (error) {
        this.$emit('show-toast', { 
          mensaje: 'Error al actualizar el alcance', 
          tipo: 'error' 
        });
      } finally {
        this.guardando = false;
      }
    },

    tipoRecursoLabel(tipo) {
      const labels = {
        video: 'Video',
        pdf: 'Documento PDF',
        documento: 'Documento',
        enlace: 'Enlace Web',
        imagen: 'Imagen'
      };
      return labels[tipo] || 'Recurso';
    },

    tipoPreguntaLabel(tipo) {
      const labels = {
        simple: 'Selección Simple',
        multiple: 'Selección Múltiple',
        vf: 'Verdadero/Falso'
      };
      return labels[tipo] || tipo;
    }
  }
};
</script>

<style scoped>
.gestion-capacitacion {
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
  background-color: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.badge-inactiva {
  background-color: rgba(239, 68, 68, 0.2);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.badge-borrador {
  background-color: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
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

.form-group input:disabled,
.form-group textarea:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  background-color: #f1f5f9;
}

.form-group small {
  font-size: 0.75rem;
  color: #64748b;
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
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.badge-alcance.departamentos {
  background-color: rgba(168, 85, 247, 0.2);
  color: #c084fc;
}

.departamentos-asignados {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dept-chip {
  background-color: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa;
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
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 16px;
  text-align: center;
}

.stat-icon {
  font-size: 2rem;
  margin-bottom: 8px;
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
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
}

.resumen-icon {
  font-size: 1.5rem;
}

.resumen-text {
  color: #475569;
  font-size: 0.95rem;
}

.btn-secondary {
  background: #ffffff;
  border: 1px solid #cbd5e1;
  color: #7c3aed;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #f5f3ff;
  border-color: #7c3aed;
}

.acciones-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  align-items: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  flex-wrap: wrap;
}

.btn-preview,
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

.btn-preview {
  background-color: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.btn-preview:hover {
  background-color: rgba(139, 92, 246, 0.3);
}

.btn-activar {
  background-color: #22c55e;
  color: white;
}

.btn-activar:hover {
  background-color: #16a34a;
}

.btn-desactivar {
  background-color: #ef4444;
  color: white;
}

.btn-desactivar:hover {
  background-color: #dc2626;
}

.btn-guardar {
  background-color: #3b82f6;
  color: white;
}

.btn-guardar:hover {
  background-color: #2563eb;
}

.btn-activar:disabled,
.btn-desactivar:disabled,
.btn-guardar:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Edición de alcance */
.edicion-alcance {
  padding: 20px;
  background-color: #ffffff;
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
  background-color: #eff6ff;
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
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
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
  background-color: #eff6ff;
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
  background-color: rgba(148, 163, 184, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(148, 163, 184, 0.3);
}

.btn-cancelar-alcance:hover {
  background-color: rgba(148, 163, 184, 0.2);
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

.vista-alcance {
  position: relative;
}

.btn-editar-alcance {
  margin-top: 16px;
  background: rgba(139, 92, 246, 0.1);
  border: 1px solid rgba(139, 92, 246, 0.3);
  color: #a78bfa;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-editar-alcance:hover {
  background: rgba(139, 92, 246, 0.2);
}

@media (max-width: 768px) {
  .dos-columnas {
    grid-template-columns: 1fr;
  }

  .acciones-footer {
    flex-direction: column;
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

/* Tabs de Contenido */
.contenido-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.05);
}

.tab-btn-small {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: transparent;
  border: none;
  color: #94a3b8;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  border-bottom: 3px solid transparent;
  transition: all 0.2s;
}

.tab-btn-small:hover {
  color: #ffffff;
}

.tab-btn-small.active {
  color: #60a5fa;
  border-bottom-color: #3b82f6;
}

.tab-content-small {
  animation: fadeInTab 0.3s ease-out;
}

@keyframes fadeInTab {
  from {
    opacity: 0;
    transform: translateY(8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Preview de Recursos */
.preview-recursos {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.recurso-preview-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
}

.recurso-preview-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.recurso-numero-small {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: white;
  flex-shrink: 0;
  font-size: 0.9rem;
}

.recurso-info-small {
  flex: 1;
}

.recurso-info-small h4 {
  margin: 0 0 6px 0;
  color: #ffffff;
  font-size: 1rem;
}

.recurso-tipo-badge {
  display: inline-block;
  background-color: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.recurso-video-preview {
  padding: 0 16px 16px 16px;
}

.recurso-link-preview {
  padding: 0 16px 16px 16px;
  display: flex;
  justify-content: flex-end;
}

.btn-ver-small {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #3b82f6;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  transition: all 0.2s;
  border: none;
  cursor: pointer;
}

.btn-ver-small:hover {
  background-color: #2563eb;
  transform: translateY(-1px);
}

.empty-preview {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.empty-preview p {
  margin-top: 12px;
  font-size: 1rem;
}

/* Preview de Preguntas */
.preview-preguntas {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pregunta-preview-card {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #3b82f6;
  border-radius: 12px;
  padding: 16px;
}

.pregunta-preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.pregunta-num {
  font-weight: 700;
  color: #60a5fa;
  font-size: 0.95rem;
}

.pregunta-tipo-badge {
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
}

.pregunta-tipo-badge.tipo-simple {
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.pregunta-tipo-badge.tipo-multiple {
  background-color: rgba(139, 92, 246, 0.2);
  color: #a78bfa;
}

.pregunta-tipo-badge.tipo-vf {
  background-color: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
}

.pregunta-enunciado-text {
  color: #ffffff;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 12px 0;
}

.pregunta-imagen-preview {
  margin: 12px 0;
  padding: 12px;
  background-color: #ffffff;
  border-radius: 8px;
  text-align: center;
}

.pregunta-imagen-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 6px;
  object-fit: contain;
}

.pregunta-opciones-preview {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.opcion-preview {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background-color: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  transition: all 0.2s;
}

.opcion-preview.correcta {
  background-color: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
}

.opcion-preview span {
  color: #475569;
  font-size: 0.9rem;
  flex: 1;
}

.opcion-preview.correcta span {
  color: #ffffff;
  font-weight: 600;
}

.badge-correcta-small {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background-color: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-top: 2px;
  width: 18px;
  height: 18px;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-text {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 0.95rem;
}

/* ============================================
   ESTILOS PARA VISTA PREVIA DEL USUARIO
============================================ */
.preview-intro {
  margin-bottom: 24px;
  text-align: center;
}

.preview-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #8b5cf6, #6366f1);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.preview-descripcion {
  color: #94a3b8;
  font-size: 0.9rem;
  margin: 0;
}

.user-preview-container {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(59, 130, 246, 0.05));
  border: 2px solid rgba(139, 92, 246, 0.2);
  border-radius: 16px;
  padding: 24px;
  margin-top: 16px;
}

.user-preview-header {
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 24px;
}

.user-preview-title {
  color: #ffffff;
  font-size: 1.8rem;
  margin: 0 0 12px 0;
  font-weight: 700;
}

.user-preview-desc {
  color: #475569;
  font-size: 1rem;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

.user-preview-meta {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-top: 20px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: #ffffff;
  border-radius: 20px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 500;
}

.user-preview-section {
  margin-bottom: 32px;
}

.user-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  color: #60a5fa;
  font-size: 1.3rem;
  margin: 0 0 20px 0;
  font-weight: 700;
}

.user-recursos-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.user-recurso-card {
  display: flex;
  align-items: center;
  gap: 16px;
  background-color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  transition: all 0.3s;
}

.user-recurso-card:hover {
  transform: translateY(-2px);
  border-color: rgba(59, 130, 246, 0.4);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.user-recurso-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.user-recurso-info {
  flex: 1;
}

.user-recurso-info h4 {
  margin: 0 0 4px 0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
}

.user-recurso-tipo {
  color: #94a3b8;
  font-size: 0.8rem;
  font-weight: 500;
}

.user-recurso-accion {
  flex-shrink: 0;
}

.btn-ver-recurso {
  display: inline-block;
  padding: 8px 20px;
  background-color: #3b82f6;
  color: white;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: not-allowed;
  opacity: 0.7;
}

.user-eval-info {
  background-color: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 24px;
}

.user-eval-info p {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #475569;
  font-size: 0.95rem;
  margin: 8px 0;
}

.user-pregunta-sample {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-pregunta-card {
  background-color: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
}

.user-pregunta-numero {
  color: #60a5fa;
  font-weight: 700;
  font-size: 0.85rem;
  margin-bottom: 12px;
}

.user-pregunta-texto {
  color: #ffffff;
  font-size: 1.1rem;
  line-height: 1.6;
  margin: 0 0 16px 0;
  font-weight: 600;
}

.user-pregunta-imagen {
  margin: 16px 0;
  padding: 12px;
  background-color: #ffffff;
  border-radius: 8px;
  text-align: center;
}

.user-pregunta-imagen img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 6px;
  object-fit: contain;
}

.user-pregunta-opciones {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.user-opcion {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: #ffffff;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  cursor: not-allowed;
  transition: all 0.2s;
}

.user-opcion:hover {
  border-color: rgba(59, 130, 246, 0.3);
}

.user-opcion input {
  width: 18px;
  height: 18px;
  cursor: not-allowed;
}

.user-opcion label {
  color: #475569;
  font-size: 0.95rem;
  cursor: not-allowed;
}

.user-more-questions {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 20px;
  background-color: rgba(139, 92, 246, 0.1);
  border: 2px dashed rgba(139, 92, 246, 0.3);
  border-radius: 12px;
  color: #a78bfa;
  font-weight: 600;
  font-size: 0.95rem;
}

.user-action-button {
  display: flex;
  justify-content: center;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 2px solid rgba(255, 255, 255, 0.1);
}

.btn-iniciar-eval {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  font-size: 1rem;
  cursor: not-allowed;
  opacity: 0.7;
}

.user-preview-empty {
  text-align: center;
  padding: 40px 20px;
  color: #94a3b8;
}

.user-preview-empty p {
  margin-top: 12px;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .user-preview-container {
    padding: 16px;
  }

  .user-preview-title {
    font-size: 1.4rem;
  }

  .user-section-title {
    font-size: 1.1rem;
  }

  .user-preview-meta {
    gap: 12px;
  }

  .meta-item {
    font-size: 0.75rem;
    padding: 6px 12px;
  }

  .user-recurso-card {
    flex-direction: column;
    text-align: center;
  }

  .btn-iniciar-eval {
    padding: 12px 24px;
    font-size: 0.9rem;
  }
}
</style>
