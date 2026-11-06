<template>
  <div class="form-encuesta">
    <div class="form-header">
      <h2>Nueva Encuesta</h2>
      <p>Define el tema, agrega secciones y preguntas. Puedes usar las secciones para mostrar texto informativo entre grupos de preguntas, igual que en Google Forms.</p>
    </div>

    <form @submit.prevent="enviarFormulario" class="main-form">
      <div class="form-section">
        <div class="section-title">
          <span class="step-number">1</span>
          <h3>Información General</h3>
        </div>
        <div class="form-group">
          <label>Tema de la Encuesta</label>
          <input type="text" v-model="form.tema" placeholder="Ej. Encuesta de Ambiente Laboral" required />
        </div>
        <div class="form-group">
          <label>Descripción (Opcional)</label>
          <textarea v-model="form.descripcion" rows="3" placeholder="Explica brevemente el propósito de esta encuesta..."></textarea>
        </div>

        <div class="form-group">
          <label>Alcance de la Encuesta</label>
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

          <div v-if="cargandoDepartamentos" class="loading-departamentos">
            <span><Icon name="hourglass" /> Cargando departamentos...</span>
          </div>

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

          <div v-else class="no-departamentos">
            <span><Icon name="warning" color="#f59e0b" /> No se encontraron departamentos activos.</span>
          </div>

          <p v-if="!form.es_para_todos && form.departamentos_ids.length === 0 && departamentos.length > 0" class="warning-text">
            <Icon name="warning" /> Debes seleccionar al menos un departamento
          </p>
        </div>

        <div class="vigencia-section">
          <div class="vigencia-header">
            <Icon name="calendar" size="1.3em" color="#3b82f6" />
            <h4>Vigencia de la Encuesta</h4>
            <span class="badge-opcional">Opcional</span>
          </div>

          <div class="vigencia-content">
            <div class="form-group">
              <label class="input-label">
                <Icon name="clock" size="1em" />
                Fecha y Hora de Inicio
              </label>
              <input type="datetime-local" v-model="form.fecha_inicio" class="input-datetime" />
            </div>

            <div class="form-group">
              <label class="input-label">
                <Icon name="calendar" size="1em" />
                Fecha y Hora de Fin
              </label>
              <input type="datetime-local" v-model="form.fecha_fin" :min="form.fecha_inicio" class="input-datetime" />
            </div>
          </div>
        </div>
      </div>

      <div class="form-section">
        <div class="section-title">
          <span class="step-number">2</span>
          <h3>Secciones y Preguntas</h3>
        </div>

        <div v-for="(seccion, sIndex) in form.secciones" :key="'seccion-' + sIndex" class="seccion-card animate-fade-in">
          <div class="seccion-header">
            <h4><Icon name="folder" /> Sección {{ sIndex + 1 }}</h4>
            <button type="button" @click="removerSeccion(sIndex)" class="btn-remove-card" v-if="form.secciones.length > 1">
              Eliminar Sección
            </button>
          </div>

          <div class="form-group">
            <label>Título de la Sección (Opcional)</label>
            <input type="text" v-model="seccion.titulo" placeholder="Ej. Ambiente Laboral" />
          </div>

          <div class="form-group">
            <label>Texto Informativo (Opcional)</label>
            <textarea v-model="seccion.descripcion" rows="2" placeholder="Información adicional que verá el colaborador antes de responder esta sección..."></textarea>
          </div>

          <div class="preguntas-lista">
            <div v-for="(pregunta, pIndex) in seccion.preguntas" :key="'pregunta-' + sIndex + '-' + pIndex" class="pregunta-card">
              <div class="pregunta-header">
                <h5>Pregunta {{ pIndex + 1 }}</h5>
                <button type="button" @click="removerPregunta(sIndex, pIndex)" class="btn-remove-card" v-if="seccion.preguntas.length > 1">
                  Eliminar Pregunta
                </button>
              </div>

              <div class="form-group">
                <label>Enunciado</label>
                <input type="text" v-model="pregunta.enunciado" placeholder="Ej. ¿Cómo calificarías el ambiente laboral?" required />
              </div>

              <div class="pregunta-fila">
                <div class="form-group col-small">
                  <label>Tipo de Pregunta</label>
                  <select v-model="pregunta.tipo_pregunta" @change="ajustarPreguntaPorTipo(sIndex, pIndex)">
                    <option value="simple">Opción Única</option>
                    <option value="multiple">Opción Múltiple</option>
                    <option value="escala">Escala (ej. 1 a 5)</option>
                    <option value="texto_corto">Respuesta Corta</option>
                    <option value="texto_largo">Respuesta Larga</option>
                  </select>
                </div>

                <div class="form-group col-small">
                  <label class="checkbox-label-inline">
                    <input type="checkbox" v-model="pregunta.es_obligatoria" />
                    <span>Obligatoria</span>
                  </label>
                </div>
              </div>

              <!-- Opciones para simple / multiple -->
              <div v-if="pregunta.tipo_pregunta === 'simple' || pregunta.tipo_pregunta === 'multiple'" class="opciones-container">
                <label class="opciones-label">Alternativas de Respuesta</label>

                <div v-for="(opcion, oIndex) in pregunta.opciones" :key="'opcion-' + sIndex + '-' + pIndex + '-' + oIndex" class="opcion-row">
                  <input
                    type="text"
                    v-model="opcion.texto_opcion"
                    placeholder="Texto de la alternativa"
                    required
                  />
                  <button
                    type="button"
                    @click="removerOpcion(sIndex, pIndex, oIndex)"
                    class="btn-remove-mini"
                    v-if="pregunta.opciones.length > 2"
                  >
                    ✕
                  </button>
                </div>

                <button type="button" @click="agregarOpcion(sIndex, pIndex)" class="btn-add-mini">
                  + Añadir Alternativa
                </button>
              </div>

              <!-- Config de escala -->
              <div v-if="pregunta.tipo_pregunta === 'escala'" class="escala-config">
                <div class="form-group col-small">
                  <label>Valor Mínimo</label>
                  <input type="number" v-model.number="pregunta.escala_min" min="0" />
                </div>
                <div class="form-group col-small">
                  <label>Valor Máximo</label>
                  <input type="number" v-model.number="pregunta.escala_max" min="1" />
                </div>
                <div class="form-group">
                  <label>Etiqueta Mínimo (Opcional)</label>
                  <input type="text" v-model="pregunta.escala_etiqueta_min" placeholder="Ej. Muy insatisfecho" />
                </div>
                <div class="form-group">
                  <label>Etiqueta Máximo (Opcional)</label>
                  <input type="text" v-model="pregunta.escala_etiqueta_max" placeholder="Ej. Muy satisfecho" />
                </div>
              </div>
            </div>

            <button type="button" @click="agregarPregunta(sIndex)" class="btn-add">
              + Añadir Pregunta a esta Sección
            </button>
          </div>
        </div>

        <button type="button" @click="agregarSeccion" class="btn-add btn-add-seccion">
          + Añadir Nueva Sección
        </button>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-submit" :disabled="guardando">
          <template v-if="guardando">Guardando Encuesta...</template>
          <template v-else><Icon name="rocket" /> Guardar encuesta</template>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import Icon from '../components/Icon.vue';

function nuevaOpcion() {
  return { texto_opcion: '' };
}

function nuevaPregunta() {
  return {
    enunciado: '',
    tipo_pregunta: 'simple',
    es_obligatoria: true,
    escala_min: 1,
    escala_max: 5,
    escala_etiqueta_min: '',
    escala_etiqueta_max: '',
    opciones: [nuevaOpcion(), nuevaOpcion()]
  };
}

function nuevaSeccion() {
  return {
    titulo: '',
    descripcion: '',
    preguntas: [nuevaPregunta()]
  };
}

export default {
  name: 'FormularioEncuesta',
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
        departamentos_ids: [],
        fecha_inicio: null,
        fecha_fin: null,
        secciones: [nuevaSeccion()]
      }
    };
  },
  mounted() {
    this.cargarDepartamentos();
  },
  methods: {
    async cargarDepartamentos() {
      this.cargandoDepartamentos = true;
      try {
        const response = await this.$http.get(`${this.$server_url}capacitaciones_prolipa/admin/departamentos`);
        if (response.data.success) {
          this.departamentos = response.data.data;
        }
      } catch (error) {
        // silencioso, se muestra el estado "no hay departamentos"
      } finally {
        this.cargandoDepartamentos = false;
      }
    },

    showToast(mensaje, tipo = 'success') {
      this.$emit('show-toast', { mensaje, tipo });
    },

    agregarSeccion() {
      this.form.secciones.push(nuevaSeccion());
    },
    removerSeccion(index) {
      this.form.secciones.splice(index, 1);
    },

    agregarPregunta(seccionIndex) {
      this.form.secciones[seccionIndex].preguntas.push(nuevaPregunta());
    },
    removerPregunta(seccionIndex, preguntaIndex) {
      this.form.secciones[seccionIndex].preguntas.splice(preguntaIndex, 1);
    },
    ajustarPreguntaPorTipo(seccionIndex, preguntaIndex) {
      const pregunta = this.form.secciones[seccionIndex].preguntas[preguntaIndex];
      if ((pregunta.tipo_pregunta === 'simple' || pregunta.tipo_pregunta === 'multiple') && pregunta.opciones.length < 2) {
        pregunta.opciones = [nuevaOpcion(), nuevaOpcion()];
      }
    },

    agregarOpcion(seccionIndex, preguntaIndex) {
      this.form.secciones[seccionIndex].preguntas[preguntaIndex].opciones.push(nuevaOpcion());
    },
    removerOpcion(seccionIndex, preguntaIndex, opcionIndex) {
      this.form.secciones[seccionIndex].preguntas[preguntaIndex].opciones.splice(opcionIndex, 1);
    },

    validarFormulario() {
      if (!this.form.tema.trim()) {
        this.showToast('El tema de la encuesta es obligatorio', 'error');
        return false;
      }

      if (!this.form.es_para_todos && this.form.departamentos_ids.length === 0) {
        this.showToast('Debes seleccionar al menos un departamento', 'error');
        return false;
      }

      for (const seccion of this.form.secciones) {
        for (const pregunta of seccion.preguntas) {
          if (!pregunta.enunciado.trim()) {
            this.showToast('Todas las preguntas deben tener un enunciado', 'error');
            return false;
          }

          if (['simple', 'multiple'].includes(pregunta.tipo_pregunta)) {
            const opcionesValidas = pregunta.opciones.filter(o => o.texto_opcion.trim());
            if (opcionesValidas.length < 2) {
              this.showToast('Las preguntas de opción única/múltiple necesitan al menos 2 alternativas', 'error');
              return false;
            }
          }

          if (pregunta.tipo_pregunta === 'escala') {
            if (pregunta.escala_min === null || pregunta.escala_max === null || pregunta.escala_min >= pregunta.escala_max) {
              this.showToast('El rango de la escala no es válido', 'error');
              return false;
            }
          }
        }
      }

      return true;
    },

    async enviarFormulario() {
      if (!this.idusuario) {
        this.showToast('Error: Sesión de administrador no válida.', 'error');
        return;
      }

      if (!this.validarFormulario()) {
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
        secciones: this.form.secciones.map(seccion => ({
          titulo: seccion.titulo,
          descripcion: seccion.descripcion,
          preguntas: seccion.preguntas.map(pregunta => ({
            enunciado: pregunta.enunciado,
            tipo_pregunta: pregunta.tipo_pregunta,
            es_obligatoria: pregunta.es_obligatoria,
            escala_min: pregunta.tipo_pregunta === 'escala' ? pregunta.escala_min : null,
            escala_max: pregunta.tipo_pregunta === 'escala' ? pregunta.escala_max : null,
            escala_etiqueta_min: pregunta.tipo_pregunta === 'escala' ? pregunta.escala_etiqueta_min : null,
            escala_etiqueta_max: pregunta.tipo_pregunta === 'escala' ? pregunta.escala_etiqueta_max : null,
            opciones: ['simple', 'multiple'].includes(pregunta.tipo_pregunta)
              ? pregunta.opciones.filter(o => o.texto_opcion.trim())
              : []
          }))
        }))
      };

      try {
        const response = await this.$http.post(`${this.$server_url}capacitaciones_prolipa/admin/encuestas`, payload);
        if (response.data.success) {
          this.showToast('¡Encuesta guardada con éxito!', 'success');
          this.resetFormulario();
          this.$emit('encuesta-creada');
        } else {
          this.showToast(response.data.message || 'Error al guardar la encuesta', 'error');
        }
      } catch (error) {
        const mensaje = (error.response && error.response.data && error.response.data.message) || 'Ocurrió un error al procesar el guardado en el servidor.';
        this.showToast(mensaje, 'error');
      } finally {
        this.guardando = false;
      }
    },

    resetFormulario() {
      this.form = {
        tema: '',
        descripcion: '',
        es_para_todos: true,
        departamentos_ids: [],
        fecha_inicio: null,
        fecha_fin: null,
        secciones: [nuevaSeccion()]
      };
    }
  }
};
</script>

<style scoped>
.form-encuesta {
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
input[type="text"], input[type="number"], textarea, select { background-color: #ffffff; border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px 12px; color: #1e293b; font-size: 0.9rem; width: 100%; box-sizing: border-box; }
input:focus, textarea:focus, select:focus { border-color: #3b82f6; outline: none; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
.col-small { flex: 1; }

.radio-group { display: flex; flex-direction: column; gap: 12px; }
.radio-option { display: flex; align-items: center; gap: 10px; padding: 12px; background-color: #ffffff; border: 2px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
.radio-option:hover { border-color: #3b82f6; background-color: #eff6ff; }
.radio-option input[type="radio"] { cursor: pointer; transform: scale(1.2); }
.radio-option span { font-size: 0.95rem; font-weight: 500; }

.departamentos-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 10px; max-height: 300px; overflow-y: auto; padding: 12px; background-color: #f8fafc; border-radius: 8px; border: 1px solid #e2e8f0; }
.checkbox-dept { display: flex; align-items: center; gap: 8px; padding: 8px; background-color: #ffffff; border-radius: 6px; cursor: pointer; border: 1px solid #e2e8f0; }
.checkbox-dept:hover { background-color: #eff6ff; border-color: #3b82f6; }
.checkbox-dept input[type="checkbox"] { cursor: pointer; transform: scale(1.1); }
.warning-text { color: #f59e0b; font-size: 0.85rem; margin-top: 8px; font-weight: 600; }
.loading-departamentos, .no-departamentos { padding: 16px; background-color: #eff6ff; border-radius: 8px; text-align: center; color: #475569; font-size: 0.9rem; border: 1px solid #bfdbfe; }
.no-departamentos { background-color: #fef3c7; color: #92400e; border-color: #fde68a; }

.vigencia-section { background: linear-gradient(135deg, #eff6ff 0%, #f8fafc 100%); border: 1px solid #bfdbfe; border-radius: 12px; padding: 20px; margin-top: 24px; }
.vigencia-header { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid #cbd5e1; }
.vigencia-header h4 { margin: 0; font-size: 1.1rem; color: #1e293b; flex: 1; }
.badge-opcional { background: linear-gradient(135deg, #f59e0b 0%, #f97316 100%); color: white; font-size: 0.7rem; font-weight: 700; padding: 4px 12px; border-radius: 20px; text-transform: uppercase; letter-spacing: 0.5px; }
.vigencia-content { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.input-label { display: flex; align-items: center; gap: 8px; font-size: 0.85rem; color: #475569; font-weight: 600; margin-bottom: 8px; }

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

.seccion-card { background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; margin-bottom: 18px; border-left: 4px solid #3b82f6; }
.seccion-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.seccion-header h4 { margin: 0; color: #1e293b; display: flex; align-items: center; gap: 8px; }

.pregunta-card { background-color: #f8fafc; border-radius: 10px; padding: 16px; margin-bottom: 14px; border: 1px solid #e2e8f0; border-left: 4px solid #3b82f6; }
.pregunta-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
.pregunta-header h5 { margin: 0; color: #1e293b; font-size: 0.95rem; }
.pregunta-fila { display: flex; gap: 16px; align-items: flex-end; }
.checkbox-label-inline { display: flex; align-items: center; gap: 8px; flex-direction: row !important; padding-top: 10px; }
.checkbox-label-inline input { width: auto; transform: scale(1.2); cursor: pointer; }

.btn-remove-card { background: transparent; border: none; color: #f43f5e; font-size: 0.85rem; cursor: pointer; font-weight: 600; }
.opciones-container { margin-top: 14px; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
.opciones-label { font-size: 0.8rem; color: #475569; display: block; margin-bottom: 8px; font-weight: 600; }
.opcion-row { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.btn-remove-mini { background: transparent; border: none; color: #ef4444; cursor: pointer; font-size: 0.9rem; padding: 0 4px; }
.btn-add-mini { background: transparent; border: none; color: #3b82f6; font-size: 0.8rem; cursor: pointer; font-weight: bold; padding: 4px 0; display: block; }

.escala-config { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 12px; background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }

.preguntas-lista { margin-top: 12px; }
.btn-add { background: transparent; border: 1px dashed #3b82f6; color: #60a5fa; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600; font-size: 0.85rem; margin-top: 4px; }
.btn-add:hover { background-color: rgba(59, 130, 246, 0.1); }
.btn-add-seccion { border-color: #3b82f6; color: #3b82f6; }
.btn-add-seccion:hover { background-color: rgba(59, 130, 246, 0.1); }

.form-actions { display: flex; justify-content: flex-end; margin-top: 20px; }
.btn-submit { background-color: #3b82f6; color: white; border: none; padding: 12px 24px; border-radius: 8px; font-weight: bold; cursor: pointer; font-size: 0.95rem; transition: background 0.2s; }
.btn-submit:hover { background-color: #2563eb; }
.btn-submit:disabled { opacity: 0.5; cursor: not-allowed; }

@keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
.animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
</style>
