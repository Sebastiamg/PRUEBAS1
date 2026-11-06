<template>
  <div class="editar-capacitacion">
    <div class="editar-header">
      <button @click="$emit('cerrar')" class="btn-volver">
        <Icon name="arrow-left" /> Volver
      </button>
      <h2><Icon name="pencil" /> Editar Capacitación</h2>
    </div>

    <div v-if="cargando" class="loading-container">
      <p><Icon name="hourglass" /> Cargando capacitación...</p>
    </div>

    <div v-else-if="capacitacion" class="editar-content">
      <!-- INFO BÁSICA -->
      <div class="info-header">
        <h3>{{ capacitacion.tema }}</h3>
        <span class="badge-borrador"><Icon name="edit" /> Borrador</span>
      </div>
      <p class="descripcion">{{ capacitacion.descripcion }}</p>

      <!-- ADVERTENCIA -->
      <div class="advertencia-box">
        <Icon name="warning" color="#f59e0b" /> <strong>Nota:</strong> Solo puedes editar capacitaciones en estado "Borrador". 
        Una vez activada, el contenido no puede modificarse.
      </div>

      <form @submit.prevent="guardarCambios">
        <!-- SECCIÓN RECURSOS -->
        <div class="form-section">
          <div class="section-title">
            <span class="step-number">1</span>
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
                <option value="enlace"><Icon name="link" /> Enlace</option>
                <option value="imagen"><Icon name="image" /> Imagen</option>
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

        <!-- SECCIÓN PREGUNTAS -->
        <div class="form-section">
          <div class="section-title">
            <span class="step-number">2</span>
            <h3>Evaluación (Banco de Preguntas)</h3>
          </div>

          <div v-for="(pregunta, pIndex) in form.preguntas" :key="'pregunta-' + pIndex" class="pregunta-card">
            <div class="pregunta-header">
              <h4>Pregunta N° {{ pIndex + 1 }}</h4>
              <button type="button" @click="removerPregunta(pIndex)" class="btn-remove-card" v-if="form.preguntas.length > 1">
                Eliminar Pregunta
              </button>
            </div>

            <div class="form-group">
              <label>Enunciado de la Pregunta</label>
              <input type="text" v-model="pregunta.enunciado" placeholder="Ej. Seleccione las opciones correctas..." required />
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
                <option value="simple">Selección Simple</option>
                <option value="multiple">Selección Múltiple</option>
                <option value="vf">Verdadero / Falso</option>
              </select>
            </div>

            <div class="opciones-container">
              <label class="opciones-label">
                Alternativas de Respuesta (Marca la o las correctas)
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

        <!-- BOTONES DE ACCIÓN -->
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
import Icon from './Icon.vue';

export default {
  name: 'EditarCapacitacion',
  components: {
    Icon
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
      form: {
        recursos: [],
        preguntas: []
      }
    };
  },
  mounted() {
    this.cargarCapacitacion();
  },
  methods: {
    async cargarCapacitacion() {
      this.cargando = true;
      try {
        const response = await this.$http.get(`${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${this.capacitacionId}`);
        
        if (response.data.success) {
          this.capacitacion = response.data.data;
          
          // Verificar que sea borrador
          if (this.capacitacion.estado !== 'borrador') {
            this.$emit('show-toast', { mensaje: 'Solo puedes editar capacitaciones en borrador', tipo: 'error' });
            this.$emit('cerrar');
            return;
          }

          // Cargar recursos
          this.form.recursos = this.capacitacion.recursos.map(r => ({
            id: r.id,
            nombre_recurso: r.nombre_recurso,
            tipo_recurso: r.tipo_recurso,
            url_recurso: r.url_recurso,
            descripcion: r.descripcion || ''
          }));

          // Cargar preguntas con opciones
          const preguntasSource = this.capacitacion.preguntas || [];
          
          if (!preguntasSource || preguntasSource.length === 0) {
            this.form.preguntas = [{
              enunciado: '',
              imagen_url: '',
              tipo_pregunta: 'simple',
              opciones: [
                { texto_opcion: '', es_correcta: true },
                { texto_opcion: '', es_correcta: false }
              ]
            }];
          } else {
            this.form.preguntas = preguntasSource.map(p => ({
              id: p.id,
              enunciado: p.enunciado,
              imagen_url: p.imagen_url || '',
              tipo_pregunta: p.tipo_pregunta,
              opciones: (p.opciones || []).map(o => ({
                id: o.id,
                texto_opcion: o.texto_opcion,
                es_correcta: o.es_correcta
              }))
            }));
          }
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al cargar la capacitación', tipo: 'error' });
      } finally {
        this.cargando = false;
      }
    },

    // MÉTODOS DE RECURSOS
    agregarRecurso() {
      this.form.recursos.push({ nombre_recurso: '', tipo_recurso: 'video', url_recurso: '', descripcion: '' });
    },
    removerRecurso(index) {
      this.form.recursos.splice(index, 1);
    },

    // MÉTODOS DE PREGUNTAS
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
      }
    },

    // MÉTODOS DE OPCIONES
    agregarOpcion(pIndex) {
      this.form.preguntas[pIndex].opciones.push({ texto_opcion: '', es_correcta: false });
    },
    removerOpcion(pIndex, oIndex) {
      const opciones = this.form.preguntas[pIndex].opciones;
      if (opciones[oIndex].es_correcta && this.form.preguntas[pIndex].tipo_pregunta === 'simple') {
        if (opciones.length > 1) {
          opciones[0].es_correcta = true;
        }
      }
      opciones.splice(oIndex, 1);
    },
    marcarCorrectaRadio(pIndex, oIndex) {
      this.form.preguntas[pIndex].opciones.forEach((opc, idx) => {
        opc.es_correcta = idx === oIndex;
      });
    },

    imagenError(event, pIndex) {
      event.target.style.display = 'none';
      this.$emit('show-toast', { mensaje: 'Error al cargar imagen de pregunta ' + (pIndex + 1), tipo: 'warning' });
    },

    async guardarCambios() {
      this.guardando = true;
      try {
        const payload = {
          idusuario: this.idusuario,
          recursos: this.form.recursos,
          preguntas: this.form.preguntas
        };

        const response = await this.$http.put(
          `${this.$server_url}capacitaciones_prolipa/admin/capacitaciones/${this.capacitacionId}/contenido`,
          payload
        );

        if (response.data.success) {
          this.$emit('show-toast', { mensaje: 'Contenido actualizado exitosamente', tipo: 'success' });
          this.$emit('cerrar');
          this.$emit('actualizar-lista');
        }
      } catch (error) {
        this.$emit('show-toast', { mensaje: 'Error al guardar los cambios', tipo: 'error' });
      } finally {
        this.guardando = false;
      }
    }
  }
};
</script>

<style scoped>
/* Reutilizamos estilos del FormularioCapacitacion */
.editar-capacitacion {
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
  background-color: rgba(251, 191, 36, 0.2);
  color: #fbbf24;
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

.form-section {
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.step-number {
  background-color: #3b82f6;
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: bold;
}

.section-title h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #1e293b;
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
input[type="url"],
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

.dinamic-row {
  display: flex;
  gap: 12px;
  align-items: flex-end;
  margin-bottom: 12px;
}

.col-small { flex: 1; }
.col-medium { flex: 2; }
.col-large { flex: 3; }

.btn-add {
  background: transparent;
  border: 1px dashed #3b82f6;
  color: #60a5fa;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.85rem;
  margin-top: 8px;
}

.btn-add:hover {
  background-color: rgba(59, 130, 246, 0.1);
}

.btn-remove {
  background-color: rgba(244, 63, 94, 0.1);
  border: 1px solid rgba(244, 63, 94, 0.2);
  color: #fda4af;
  padding: 10px 14px;
  border-radius: 8px;
  cursor: pointer;
}

.pregunta-card {
  background-color: #1e293b;
  border-radius: 10px;
  padding: 16px;
  margin-bottom: 16px;
  border-left: 4px solid #3b82f6;
}

.pregunta-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.pregunta-header h4 {
  margin: 0;
  color: #ffffff;
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
  background: rgba(15, 23, 42, 0.4);
  padding: 12px;
  border-radius: 8px;
}

.opciones-label {
  font-size: 0.8rem;
  color: #94a3b8;
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

.opcion-row input[type="radio"],
.opcion-row input[type="checkbox"] {
  transform: scale(1.2);
  cursor: pointer;
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

.imagen-preview {
  margin-top: 12px;
  padding: 8px;
  background-color: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  text-align: center;
}

.imagen-preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 6px;
  object-fit: contain;
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

.btn-submit:hover {
  background-color: #2563eb;
}

.btn-submit:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>
