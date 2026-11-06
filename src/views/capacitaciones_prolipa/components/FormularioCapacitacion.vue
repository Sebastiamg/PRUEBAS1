<template>
  <div class="form-capacitacion">
    <div class="form-header">
      <h2>Nueva Capacitación Institucional</h2>
      <p>Completa los detalles del curso, añade el material de apoyo y estructura el banco de preguntas para la evaluación.</p>
    </div>

    <form @submit.prevent="enviarFormulario" class="main-form">
      <div class="form-section">
        <div class="section-title">
          <span class="step-number">1</span>
          <h3>Información General</h3>
        </div>
        <div class="form-group">
          <label>Tema de la Capacitación</label>
          <input type="text" v-model="form.tema" placeholder="Ej. Seguridad de la Información" required />
        </div>
        <div class="form-group">
          <label>Descripción / Objetivos</label>
          <textarea v-model="form.descripcion" rows="3" placeholder="Detalla el alcance de esta capacitación..." required></textarea>
        </div>

        <div class="form-group">
          <label>Alcance de la Capacitación</label>
          <div class="radio-group">
            <label class="radio-option">
              <input type="radio" v-model="form.es_para_todos" :value="true" />
              <span><Icon name="globe" /> Para toda la empresa</span>
            </label>
            <label class="radio-option">
              <input type="radio" v-model="form.es_para_todos" :value="false" />
              <span><Icon name="building" /> Para departamentos específicos</span>
            </label>
          </div>
        </div>

        <div v-if="!form.es_para_todos" class="form-group">
          <label>Seleccionar Departamentos</label>

          <!-- Mensaje de carga -->
          <div v-if="cargandoDepartamentos" class="loading-departamentos">
            <span><Icon name="hourglass" /> Cargando departamentos...</span>
          </div>

          <!-- Lista de departamentos -->
          <div v-else-if="departamentos.length > 0" class="departamentos-list">
            <label
              v-for="dept in departamentos"
              :key="dept.tdp_id"
              class="checkbox-dept"
            >
              <input
                type="checkbox"
                :value="dept.tdp_id"
                v-model="form.departamentos_ids"
              />
              <span>{{ dept.tdp_nombre }} ({{ dept.tdp_iniciales }})</span>
            </label>
          </div>

          <!-- Mensaje si no hay departamentos -->
          <div v-else class="no-departamentos">
            <span><Icon name="warning" color="#f59e0b" /> No se encontraron departamentos activos. Contacta al administrador del sistema.</span>
          </div>

          <p v-if="!form.es_para_todos && form.departamentos_ids.length === 0 && departamentos.length > 0" class="warning-text">
            <Icon name="warning" /> Debes seleccionar al menos un departamento
          </p>
        </div>

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
          <small class="form-hint">Si se desactiva, los usuarios solo verán si aprobaron o no, pero no las respuestas correctas de cada pregunta.</small>
        </div>

        <!-- Vigencia de la Capacitación -->
        <div class="vigencia-section">
          <div class="vigencia-header">
            <Icon name="calendar" size="1.3em" color="#3b82f6" />
            <h4>Vigencia de la Capacitación</h4>
            <span class="badge-opcional">Opcional</span>
          </div>

          <div class="vigencia-content">
            <div class="form-group">
              <label class="input-label">
                <Icon name="clock" size="1em" />
                Fecha y Hora de Inicio
              </label>
              <input
                type="datetime-local"
                v-model="form.fecha_inicio"
                class="input-datetime"
              />
              <small class="form-hint"><Icon name="info" size="0.9em" /> La capacitación estará disponible desde esta fecha y hora</small>
            </div>

            <div class="form-group">
              <label class="input-label">
                <Icon name="calendar" size="1em" />
                Fecha y Hora de Fin
              </label>
              <input
                type="datetime-local"
                v-model="form.fecha_fin"
                :min="form.fecha_inicio"
                class="input-datetime"
              />
              <small class="form-hint"><Icon name="info" size="0.9em" /> La capacitación dejará de estar disponible después de esta fecha y hora</small>
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">
          <span class="step-number">2</span>
          <h3>Material y Recursos de Apoyo</h3>
        </div>

        <div v-for="(recurso, index) in form.recursos" :key="'recurso-' + index" class="dinamic-row">
          <div class="form-group col-medium">
            <label>Nombre del Recurso</label>
            <input type="text" v-model="recurso.nombre_recurso" placeholder="Ej. Video Introductorio" required />
          </div>
          <div class="form-group col-small">
            <label>Tipo</label>
            <select v-model="recurso.tipo_recurso" required>
              <option value="video"><Icon name="video" /> Video (URL)</option>
              <option value="pdf"><Icon name="pdf" /> Documento PDF</option>
            </select>
          </div>
          <div class="form-group col-large">
            <label>Enlace / URL del Recurso</label>
            <input type="url" v-model="recurso.url_recurso" placeholder="https://example.com/recurso" required />
          </div>
          <button type="button" @click="removerRecurso(index)" class="btn-remove" v-if="form.recursos.length > 1">
            ✕
          </button>
        </div>

        <button type="button" @click="agregarRecurso" class="btn-add">
          + Agregar Otro Recurso
        </button>
      </div>

      <div class="form-section">
        <div class="section-title">
          <span class="step-number">3</span>
          <h3>Evaluación (Banco de Preguntas)</h3>
        </div>

        <div v-for="(pregunta, pIndex) in form.preguntas" :key="'pregunta-' + pIndex" class="pregunta-card animate-fade-in">
          <div class="pregunta-header">
            <h4>Pregunta N° {{ pIndex + 1 }}</h4>
            <button type="button" @click="removerPregunta(pIndex)" class="btn-remove-card" v-if="form.preguntas.length > 1">
              Eliminar Pregunta
            </button>
          </div>

          <div class="form-group">
            <label>Enunciado de la Pregunta</label>
            <input type="text" v-model="pregunta.enunciado" placeholder="Ej. Seleccione las opciones correctas sobre..." required />
          </div>

          <div class="form-group">
            <label>Imagen de Apoyo (Opcional)</label>
            <input
              type="url"
              v-model="pregunta.imagen_url"
              placeholder="https://ejemplo.com/imagen.jpg (Opcional)"
            />
            <div v-if="pregunta.imagen_url" class="imagen-preview">
              <img :src="pregunta.imagen_url" alt="Preview" @error="imagenError($event, pIndex)" />
            </div>
          </div>

          <div class="form-group col-small">
            <label>Tipo de Respuesta</label>
            <select v-model="pregunta.tipo_pregunta" @change="ajustarOpcionesPorTipo(pIndex)" required>
              <option value="simple">Selección Simple (Una sola respuesta)</option>
              <option value="multiple">Selección Múltiple (Varias respuestas permitidas)</option>
              <option value="vf">Verdadero / Falso</option>
            </select>
          </div>

          <div class="opciones-container">
            <label class="opciones-label">
              Alternativas de Respuesta (Marca la o las respuestas correctas)
            </label>

            <div v-for="(opcion, oIndex) in pregunta.opciones" :key="'opcion-' + pIndex + '-' + oIndex" class="opcion-row">
              <input
                v-if="pregunta.tipo_pregunta === 'multiple'"
                type="checkbox"
                v-model="opcion.es_correcta"
              />

              <input
                v-else
                type="radio"
                :name="'correcta-' + pIndex"
                :checked="opcion.es_correcta"
                @change="marcarCorrectaRadio(pIndex, oIndex)"
                required
              />

              <input
                type="text"
                v-model="opcion.texto_opcion"
                placeholder="Texto de la alternativa"
                :disabled="pregunta.tipo_pregunta === 'vf'"
                required
              />

              <button
                type="button"
                @click="removerOpcion(pIndex, oIndex)"
                class="btn-remove-mini"
                v-if="pregunta.tipo_pregunta !== 'vf' && pregunta.opciones.length > 2"
              >
                ✕
              </button>
            </div>

            <button
              type="button"
              @click="agregarOpcion(pIndex)"
              class="btn-add-mini"
              v-if="pregunta.tipo_pregunta === 'simple' || pregunta.tipo_pregunta === 'multiple'"
            >
              + Añadir Alternativa
            </button>
          </div>
        </div>

        <button type="button" @click="agregarPregunta" class="btn-add">
          + Añadir Nueva Pregunta
        </button>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="guardando">
          <template v-if="guardando">Guardando Capacitación...</template>
          <template v-else><Icon name="rocket" />  Guardar capacitación</template>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Icon from './Icon.vue';

export default {
  name: 'FormularioCapacitacion',
  components: {
    Icon
  },
  props: {
    idusuario: {
      type: [Number, String],
      default: null
    }
  },
  data() {
    return {
      guardando: false,
      cargandoDepartamentos: true,
      departamentos: [],
      form: {
        tema: '',
        descripcion: '',
        es_para_todos: true,
        mostrar_respuestas_correctas: true,
        departamentos_ids: [],
        fecha_inicio: null,
        fecha_fin: null,
        recursos: [
          { nombre_recurso: '', tipo_recurso: 'video', url_recurso: '' }
        ],
        preguntas: [
          {
            enunciado: '',
            imagen_url: '',
            tipo_pregunta: 'simple',
            opciones: [
              { texto_opcion: '', es_correcta: true },
              { texto_opcion: '', es_correcta: false }
            ]
          }
        ]
      }
    };
  },
  mounted() {
    this.cargarDepartamentos();
  },
  methods: {
    // Cargar departamentos desde el backend
    async cargarDepartamentos() {
      this.cargandoDepartamentos = true;
      try {
        const response = await this.$http.get(`${this.$server_url}VerifcarMetodosGet_DepartamentosProlipa?action=Get_DepartamentosProlipaActivo`);

        // La respuesta es directamente el array de departamentos, no viene dentro de data.success
        if (Array.isArray(response.data)) {
          this.departamentos = response.data;
        } else {
        }
      } catch (error) {
      } finally {
        this.cargandoDepartamentos = false;
      }
    },

    // SISTEMA DE TOASTS DINÁMICOS (EMITE EVENTO AL PADRE)
    showToast(mensaje, tipo = 'success') {
      this.$emit('show-toast', { mensaje, tipo });
    },

    // MÉTODOS PARA RECURSOS
    agregarRecurso() {
      this.form.recursos.push({ nombre_recurso: '', tipo_recurso: 'video', url_recurso: '' });
    },
    removerRecurso(index) {
      this.form.recursos.splice(index, 1);
    },

    // MÉTODOS PARA PREGUNTAS
    agregarPregunta() {
      this.form.preguntas.push({
        enunciado: '',
        imagen_url: '',
        tipo_pregunta: 'simple',
        opciones: [
          { texto_opcion: '', es_correcta: true },
          { texto_opcion: '', es_correcta: false }
        ]
      });
    },
    removerPregunta(index) {
      this.form.preguntas.splice(index, 1);
    },
    ajustarOpcionesPorTipo(pIndex) {
      const pregunta = this.form.preguntas[pIndex];
      if (pregunta.tipo_pregunta === 'vf') {
        pregunta.opciones = [
          { texto_opcion: 'Verdadero', es_correcta: true },
          { texto_opcion: 'Falso', es_correcta: false }
        ];
      } else {
        pregunta.opciones = [
          { texto_opcion: '', es_correcta: true },
          { texto_opcion: '', es_correcta: false }
        ];
      }
    },

    // Manejar error de carga de imagen
    imagenError(event, pIndex) {
      event.target.style.display = 'none';
      this.$emit('show-toast', { mensaje: 'Error al cargar la imagen de la pregunta ' + (pIndex + 1), tipo: 'warning' });
    },

    // MÉTODOS PARA ALTERNATIVAS
    agregarOpcion(pIndex) {
      this.form.preguntas[pIndex].opciones.push({ texto_opcion: '', es_correcta: false });
    },
    removerOpcion(pIndex, oIndex) {
      const opciones = this.form.preguntas[pIndex].opciones;
      if (opciones[oIndex].es_correcta && this.form.preguntas[pIndex].tipo_pregunta === 'simple') {
        opciones[0].es_correcta = true;
      }
      opciones.splice(oIndex, 1);
    },
    marcarCorrectaRadio(pIndex, oIndex) {
      this.form.preguntas[pIndex].opciones.forEach((opc, idx) => {
        opc.es_correcta = idx === oIndex;
      });
    },

    // ENVÍO AL ENDPOINT DEFINIDO
    async enviarFormulario() {
      if (!this.idusuario) {
        this.showToast("Error: Sesión de administrador no válida.", "error");
        return;
      }

      // Validar departamentos si no es para todos
      if (!this.form.es_para_todos && this.form.departamentos_ids.length === 0) {
        this.showToast("Debes seleccionar al menos un departamento", "error");
        return;
      }

      this.guardando = true;

      const payload = {
        idusuario: this.idusuario,
        tema: this.form.tema,
        descripcion: this.form.descripcion,
        es_para_todos: this.form.es_para_todos,
        departamentos: this.form.es_para_todos ? [] : this.form.departamentos_ids,
        fecha_inicio: this.form.fecha_inicio || null,
        fecha_fin: this.form.fecha_fin || null,
        mostrar_respuestas_correctas: this.form.mostrar_respuestas_correctas,
        recursos: this.form.recursos,
        preguntas: this.form.preguntas
      };

      try {
        const response = await this.$http.post(`${this.$server_url}capacitaciones_prolipa/admin/capacitaciones`, payload);
        if (response.data.success) {
          this.showToast("¡Evaluación guardada con éxito!", "success");
          this.resetFormulario();
        }
      } catch (error) {
        this.showToast("Ocurrió un error al procesar el guardado en el servidor.", "error");
      } finally {
        this.guardando = false;
      }
    },
    resetFormulario() {
      this.form = {
        tema: '',
        descripcion: '',
        es_para_todos: true,
        mostrar_respuestas_correctas: true,
        departamentos_ids: [],
        fecha_inicio: null,
        fecha_fin: null,
        recursos: [{ nombre_recurso: '', tipo_recurso: 'video', url_recurso: '' }],
        preguntas: [{
          enunciado: '',
          imagen_url: '',
          tipo_pregunta: 'simple',
          opciones: [{ texto_opcion: '', es_correcta: true }, { texto_opcion: '', es_correcta: false }]
        }]
      };
    }
  }
};
</script>

<style scoped>
/* -----------------------------------------
   DISEÑO ESTRUCTURAL DEL FORMULARIO CLARO
-------------------------------------------- */
.form-capacitacion {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  color: #1e293b;
  max-width: 900px;
  margin: 0 auto;
}
.form-header { margin-bottom: 24px; text-align: left; }
.form-header h2 { font-size: 1.5rem; color: #3b82f6; margin: 0 0 4px 0; }
.form-header p { color: #475569; font-size: 0.9rem; margin: 0; }
.form-section { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px; margin-bottom: 20px; text-align: left; }
.section-title { display: flex; align-items: center; gap: 10px; margin-bottom: 16px; }
.step-number { background-color: #3b82f6; color: white; border-radius: 50%; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; font-size: 0.8rem; font-weight: bold; }
.section-title h3 { margin: 0; font-size: 1.1rem; color: #1e293b; }
.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; width: 100%; }
.form-group label { font-size: 0.85rem; color: #475569; font-weight: 600; }
input[type="text"], input[type="url"], textarea, select { background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; color: #1e293b; font-size: 0.9rem; width: 100%; box-sizing: border-box; }
input:focus, textarea:focus, select:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
.dinamic-row { display: flex; gap: 12px; align-items: flex-end; margin-bottom: 12px; }
.col-small { flex: 1; }
.col-medium { flex: 2; }
.col-large { flex: 3; }
.btn-add { background: transparent; border: 1px dashed #3b82f6; color: #60a5fa; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; margin-top: 8px; }
.btn-add:hover { background-color: rgba(59, 130, 246, 0.1); }
.btn-remove { background-color: rgba(244, 63, 94, 0.1); border: 1px solid rgba(244, 63, 94, 0.2); color: #fda4af; padding: 10px 14px; border-radius: 8px; cursor: pointer; }
.pregunta-card { background-color: #ffffff; border-radius: 10px; padding: 16px; margin-bottom: 16px; border-left: 4px solid #3b82f6; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; }
.pregunta-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.pregunta-header h4 { margin: 0; color: #1e293b; }
.btn-remove-card { background: transparent; border: none; color: #f43f5e; font-size: 0.85rem; cursor: pointer; font-weight: 600; }
.opciones-container { margin-top: 14px; background: #f8fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
.opciones-label { font-size: 0.8rem; color: #475569; display: block; margin-bottom: 8px; font-weight: 600; }
.opcion-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.opcion-row input[type="radio"], .opcion-row input[type="checkbox"] { transform: scale(1.2); cursor: pointer; }
.btn-remove-mini { background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.9rem; padding: 0 4px; }
.btn-add-mini { background: transparent; border: none; color: #3b82f6; font-size: 0.8rem; cursor: pointer; font-weight: bold; padding: 4px 0; display: block; }
.form-actions { display: flex; justify-content: flex-end; margin-top: 20px; }
.btn-submit { background-color: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 0.95rem; transition: background 0.2s; }
.btn-submit:hover { background-color: #2563eb; }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }

/* Estilos para radio buttons y checkboxes de departamentos */
.radio-group {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.radio-option {
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

.radio-option:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.radio-option input[type="radio"] {
  cursor: pointer;
  transform: scale(1.2);
}

.radio-option span {
  font-size: 0.95rem;
  font-weight: 500;
}

.departamentos-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.checkbox-dept {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background-color: #ffffff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e2e8f0;
}

.checkbox-dept:hover {
  background-color: #eff6ff;
  border-color: #3b82f6;
}

.checkbox-dept input[type="checkbox"] {
  cursor: pointer;
  transform: scale(1.1);
}

.checkbox-dept span {
  font-size: 0.9rem;
}

.warning-text {
  color: #f59e0b;
  font-size: 0.85rem;
  margin-top: 8px;
  font-weight: 600;
}

.loading-departamentos,
.no-departamentos {
  padding: 16px;
  background-color: #eff6ff;
  border-radius: 8px;
  text-align: center;
  color: #475569;
  font-size: 0.9rem;
  border: 1px solid #bfdbfe;
}

.no-departamentos {
  background-color: #fef3c7;
  color: #92400e;
  border-color: #fde68a;
}

.imagen-preview {
  margin-top: 12px;
  padding: 8px;
  background-color: #f8fafc;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e2e8f0;
}

.imagen-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 6px;
  object-fit: contain;
}

/* Estilos para la sección de vigencia */
.vigencia-section {
  background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%);
  border: 1px solid #bfdbfe;
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
}

.vigencia-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #cbd5e1;
}

.vigencia-header h4 {
  margin: 0;
  font-size: 1.1rem;
  color: #1e293b;
  flex: 1;
}

.badge-opcional {
  background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.vigencia-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
  margin-bottom: 8px;
}

/* Vigencia - Campos de fecha y hora */
.form-section-subtitle {
  font-size: 1rem;
  font-weight: 600;
  color: #60a5fa;
  margin: 20px 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 1px solid rgba(59, 130, 246, 0.2);
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

input[type="datetime-local"].input-datetime {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  color: #1e293b;
  font-size: 0.9rem;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  cursor: pointer;
}

input[type="datetime-local"].input-datetime::-webkit-calendar-picker-indicator {
  filter: invert(0.2);
  cursor: pointer;
}

input[type="datetime-local"].input-datetime:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-hint {
  color: #475569;
  font-size: 0.8rem;
  font-style: italic;
  margin-top: 4px;
}

.checkbox-label {
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

.checkbox-label:hover {
  border-color: #3b82f6;
  background-color: #eff6ff;
}

.checkbox-label input[type="checkbox"] {
  cursor: pointer;
  transform: scale(1.2);
}

.checkbox-text {
  font-size: 0.95rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
