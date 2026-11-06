<template>
  <div class="editar-encuesta">
    <div class="editar-header">
      <button @click="$emit('cerrar')" class="btn-volver">
        <Icon name="arrow-left" /> Volver
      </button>
      <h2><Icon name="pencil" /> Editar Secciones y Preguntas</h2>
    </div>

    <div v-if="cargando" class="loading-container">
      <p><Icon name="hourglass" /> Cargando encuesta...</p>
    </div>

    <div v-else-if="encuesta" class="editar-content">
      <div class="info-header">
        <h3>{{ encuesta.tema }}</h3>
        <span class="badge-borrador"><Icon name="edit" /> Borrador</span>
      </div>
      <p class="descripcion">{{ encuesta.descripcion }}</p>

      <div class="advertencia-box">
        <Icon name="warning" color="#f59e0b" /> <strong>Nota:</strong> Solo puedes editar el contenido mientras la encuesta está en estado "Borrador".
      </div>

      <form @submit.prevent="guardarCambios">
        <div v-for="(seccion, sIndex) in form.secciones" :key="'seccion-' + sIndex" class="seccion-card">
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
            <textarea v-model="seccion.descripcion" rows="2" placeholder="Información adicional para el colaborador..."></textarea>
          </div>

          <div v-for="(pregunta, pIndex) in seccion.preguntas" :key="'pregunta-' + sIndex + '-' + pIndex" class="pregunta-card">
            <div class="pregunta-header">
              <h5>Pregunta {{ pIndex + 1 }}</h5>
              <button type="button" @click="removerPregunta(sIndex, pIndex)" class="btn-remove-card" v-if="seccion.preguntas.length > 1">
                Eliminar Pregunta
              </button>
            </div>

            <div class="form-group">
              <label>Enunciado</label>
              <input type="text" v-model="pregunta.enunciado" placeholder="Ej. ¿Cómo calificarías...?" required />
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

            <div v-if="pregunta.tipo_pregunta === 'simple' || pregunta.tipo_pregunta === 'multiple'" class="opciones-container">
              <label class="opciones-label">Alternativas de Respuesta</label>

              <div v-for="(opcion, oIndex) in pregunta.opciones" :key="'opcion-' + sIndex + '-' + pIndex + '-' + oIndex" class="opcion-row">
                <input type="text" v-model="opcion.texto_opcion" placeholder="Texto de la alternativa" required />
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

        <button type="button" @click="agregarSeccion" class="btn-add btn-add-seccion">
          + Añadir Nueva Sección
        </button>

        <div class="form-actions">
          <button type="button" @click="$emit('cerrar')" class="btn-cancelar">
            Cancelar
          </button>
          <button type="submit" class="btn-submit" :disabled="guardando">
            <template v-if="guardando"><Icon name="hourglass" /> Guardando...</template>
            <template v-else><Icon name="save" /> Guardar Cambios</template>
          </button>
        </div>
      </form>
    </div>
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
  name: 'EditarEncuesta',
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
      form: {
        secciones: [nuevaSeccion()]
      }
    };
  },
  mounted() {
    this.cargarEncuesta();
  },
  methods: {
    async cargarEncuesta() {
      this.cargando = true;
      try {
        const response = await this.$http.get(`${this.$server_url}capacitaciones_prolipa/admin/encuestas/${this.encuestaId}`);

        if (response.data.success) {
          this.encuesta = response.data.data;

          if (this.encuesta.estado !== 'borrador') {
            this.$emit('show-toast', { mensaje: 'Solo puedes editar el contenido de encuestas en borrador', tipo: 'error' });
            this.$emit('cerrar');
            return;
          }

          const secciones = this.encuesta.secciones || [];

          if (secciones.length === 0) {
            this.form.secciones = [nuevaSeccion()];
          } else {
            this.form.secciones = secciones.map(seccion => ({
              id: seccion.id,
              titulo: seccion.titulo || '',
              descripcion: seccion.descripcion || '',
              preguntas: (seccion.preguntas || []).map(pregunta => ({
                id: pregunta.id,
                enunciado: pregunta.enunciado,
                tipo_pregunta: pregunta.tipo_pregunta,
                es_obligatoria: !!pregunta.es_obligatoria,
                escala_min: pregunta.escala_min,
                escala_max: pregunta.escala_max,
                escala_etiqueta_min: pregunta.escala_etiqueta_min || '',
                escala_etiqueta_max: pregunta.escala_etiqueta_max || '',
                opciones: (pregunta.opciones || []).map(opcion => ({
                  id: opcion.id,
                  texto_opcion: opcion.texto_opcion
                }))
              }))
            }));
          }
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar la encuesta', tipo: 'error' });
      } finally {
        this.cargando = false;
      }
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
      if ((pregunta.tipo_pregunta === 'simple' || pregunta.tipo_pregunta === 'multiple') && (!pregunta.opciones || pregunta.opciones.length < 2)) {
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
      for (const seccion of this.form.secciones) {
        for (const pregunta of seccion.preguntas) {
          if (!pregunta.enunciado.trim()) {
            this.$emit('show-toast', { mensaje: 'Todas las preguntas deben tener un enunciado', tipo: 'error' });
            return false;
          }

          if (['simple', 'multiple'].includes(pregunta.tipo_pregunta)) {
            const opcionesValidas = pregunta.opciones.filter(o => o.texto_opcion.trim());
            if (opcionesValidas.length < 2) {
              this.$emit('show-toast', { mensaje: 'Las preguntas de opción única/múltiple necesitan al menos 2 alternativas', tipo: 'error' });
              return false;
            }
          }

          if (pregunta.tipo_pregunta === 'escala') {
            if (pregunta.escala_min === null || pregunta.escala_max === null || pregunta.escala_min >= pregunta.escala_max) {
              this.$emit('show-toast', { mensaje: 'El rango de la escala no es válido', tipo: 'error' });
              return false;
            }
          }
        }
      }
      return true;
    },

    async guardarCambios() {
      if (!this.validarFormulario()) {
        return;
      }

      this.guardando = true;
      try {
        const payload = {
          idusuario: this.idusuario,
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

        const response = await this.$http.put(
          `${this.$server_url}capacitaciones_prolipa/admin/encuestas/${this.encuestaId}/contenido`,
          payload
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Contenido actualizado exitosamente', tipo: 'success' });
          this.$emit('cerrar');
          this.$emit('actualizar-lista');
        }
      } catch (error) {
        const mensaje = (error.response && error.response.data && error.response.data.message) || 'Error al guardar los cambios';
        this.$emit('show-toast', { mensaje, tipo: 'error' });
      } finally {
        this.guardando = false;
      }
    }
  }
};
</script>

<style scoped>
.editar-encuesta {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 24px;
  color: #1e293b;
  max-width: 900px;
  margin: 0 auto;
}

.editar-header {
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

.editar-header h2 {
  margin: 0;
  color: #3b82f6;
  font-size: 1.5rem;
}

.loading-container {
  text-align: center;
  padding: 40px;
  color: #475569;
}

.info-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.info-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.3rem;
}

.badge-borrador {
  background-color: rgba(251, 191, 36, 0.15);
  color: #b45309;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.descripcion {
  color: #475569;
  margin-bottom: 24px;
  line-height: 1.5;
}

.advertencia-box {
  background-color: #fef3c7;
  border: 1px solid #fde68a;
  border-radius: 8px;
  padding: 12px 16px;
  color: #92400e;
  margin-bottom: 24px;
  font-size: 0.9rem;
}

.seccion-card {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 18px;
  margin-bottom: 18px;
  border-left: 4px solid #3b82f6;
}

.seccion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.seccion-header h4 {
  margin: 0;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
  width: 100%;
}

.form-group label {
  font-size: 0.85rem;
  color: #475569;
  font-weight: 600;
}

input[type="text"],
input[type="number"],
textarea,
select {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px 12px;
  color: #1e293b;
  font-size: 0.9rem;
  width: 100%;
  box-sizing: border-box;
}

input:focus,
textarea:focus,
select:focus {
  border-color: #3b82f6;
  outline: none;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.col-small {
  flex: 1;
}

.pregunta-card {
  background-color: #ffffff;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 14px;
  border: 1px solid #e2e8f0;
  border-left: 4px solid #3b82f6;
}

.pregunta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.pregunta-header h5 {
  margin: 0;
  color: #1e293b;
  font-size: 0.95rem;
}

.pregunta-fila {
  display: flex;
  gap: 16px;
  align-items: flex-end;
}

.checkbox-label-inline {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-direction: row !important;
  padding-top: 10px;
}

.checkbox-label-inline input {
  width: auto;
  transform: scale(1.2);
  cursor: pointer;
}

.btn-remove-card {
  background: transparent;
  border: none;
  color: #f43f5e;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
}

.opciones-container {
  margin-top: 14px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.opciones-label {
  font-size: 0.8rem;
  color: #475569;
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
}

.opcion-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.btn-remove-mini {
  background: transparent;
  border: none;
  color: #ef4444;
  cursor: pointer;
  font-size: 0.9rem;
  padding: 0 4px;
}

.btn-add-mini {
  background: transparent;
  border: none;
  color: #3b82f6;
  font-size: 0.8rem;
  cursor: pointer;
  font-weight: bold;
  padding: 4px 0;
  display: block;
}

.escala-config {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-top: 12px;
  background: #f8fafc;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.btn-add {
  background: transparent;
  border: 1px dashed #3b82f6;
  color: #3b82f6;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  margin-top: 4px;
}

.btn-add:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.btn-add-seccion {
  border-color: #3b82f6;
  color: #3b82f6;
  display: block;
  margin-top: 8px;
  margin-bottom: 20px;
}

.btn-add-seccion:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
}

.btn-cancelar {
  background-color: #ffffff;
  border: 1px solid #cbd5e1;
  color: #475569;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancelar:hover {
  background-color: #f8fafc;
  border-color: #94a3b8;
}

.btn-submit {
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-submit:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
