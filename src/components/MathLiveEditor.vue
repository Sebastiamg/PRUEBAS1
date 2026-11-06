<template>
  <div class="mathlive-editor-container">
    <div class="text-field-section">
      <label class="field-label">{{ label }}</label>
      
      <!-- Siempre mostrar el área verde (crear o editar) -->
      <div v-if="!isEditingText" class="rendered-input-area" :style="{ minHeight: height }" @click="enableEditMode">
        <div v-if="hasFormulas" v-html="renderedContent" class="rendered-display"></div>
        <div v-else class="rendered-display empty-state">
          {{ textContent || 'Escriba el texto aquí...' }}
        </div>
        <div class="edit-overlay">
          <i class="feather icon-edit"></i> Clic para editar
        </div>
      </div>
      
      <!-- Modo de edición (igual para crear y editar) -->
      <div v-else class="edit-mode-container">
        <!-- Editor visual unificado (siempre usar este diseño) -->
        <div class="visual-edit-mode">
          <div v-for="(part, index) in contentParts" :key="index" class="content-part">
            <div v-if="part.type === 'text'" class="text-part">
              <div class="text-header">
                <span class="text-label">📝 Texto</span>
                <vs-button 
                  @click="removePart(index)" 
                  color="danger" 
                  type="flat" 
                  size="small"
                  icon-pack="feather"
                  icon="icon-trash-2"
                >
                </vs-button>
              </div>
              <textarea 
                v-model="part.content"
                @input="updateFromParts"
                class="text-part-input"
                rows="2"
                placeholder="Texto..."
              ></textarea>
            </div>
            
            <div v-else-if="part.type === 'formula'" class="formula-part">
              <div class="formula-header">
                <span class="formula-label">📐 Fórmula {{ Math.floor(index/2) + 1 }}</span>
                <vs-button 
                  @click="removePart(index)" 
                  color="danger" 
                  type="flat" 
                  size="small"
                  icon-pack="feather"
                  icon="icon-trash-2"
                >
                </vs-button>
              </div>
              <math-field
                :ref="'mathField' + index"
                :value="part.content"
                @input="handleFormulaInput(index, $event)"
                @focus="focusedFormulaIndex = index"
                @blur="handleFormulaBlur"
                virtual-keyboard-mode="manual"
                class="formula-editor"
              >
              </math-field>
            </div>
          </div>
          
          <div class="add-buttons-container">
            <vs-button 
              @click="addFormulaPart" 
              color="primary" 
              type="border"
              size="small"
              class="mt-2 mr-2"
            >
              ➕ Agregar fórmula
            </vs-button>
            
            <vs-button 
              @click="addTextPart" 
              color="success" 
              type="border"
              size="small"
              class="mt-2"
            >
              ➕ Agregar texto
            </vs-button>
          </div>
          
          <!-- Ejemplos rápidos siempre visibles -->
          <div class="quick-examples-section">
            <label class="examples-label">Ejemplos rápidos:</label>
            <div class="examples-buttons">
              <vs-button @click="insertQuickExample('\\frac{a}{b}')" size="small" type="border">Fracción a/b</vs-button>
              <vs-button @click="insertQuickExample('x^{2}')" size="small" type="border">Potencia x²</vs-button>
              <vs-button @click="insertQuickExample('\\sqrt{x}')" size="small" type="border">Raíz √x</vs-button>
              <vs-button @click="insertQuickExample('\\frac{-b\\pm\\sqrt{b^2-4ac}}{2a}')" size="small" type="border">Fórmula cuadrática</vs-button>
              <vs-button @click="insertQuickExample('\\pi')" size="small" type="border">Pi π</vs-button>
              <vs-button @click="insertQuickExample('\\infty')" size="small" type="border">Infinito ∞</vs-button>
            </div>
          </div>
        </div>
        
        <!-- Botones de edición -->
        <div class="edit-actions" v-if="!hideInternalButtons">
          <vs-button @click="saveEdit" color="success" size="small">
            ✓ Guardar
          </vs-button>
          <vs-button @click="cancelEdit" color="danger" type="border" size="small">
            ✗ Cancelar
          </vs-button>
        </div>
      </div>
      
      <small v-if="!isEditingText" class="edit-hint">
        💡 Haz clic en el área de arriba para editar visualmente las fórmulas
      </small>
    </div>
  </div>
</template>

<script>
import 'mathlive/mathlive-static.css';
import 'mathlive/mathlive-fonts.css';
import 'mathlive';
import { parseContentSegments, renderLatexFormula } from '@/utils/renderLatex';
import 'katex/dist/katex.min.css';

export default {
  name: 'MathLiveEditor',
  props: {
    value: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: 'Contenido'
    },
    height: {
      type: String,
      default: '120px'
    },
    preview: {
      type: Boolean,
      default: true
    },
    hideInternalButtons: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      textContent: this.value || '',
      showMathField: false,
      currentLatex: '',
      isEditingText: false,
      originalContent: '', // Para cancelar edición
      contentParts: [], // Array de partes: {type: 'text'|'formula', content: string}
      inlineLatex: '', // Para el editor inline
      focusedFormulaIndex: null // Índice de la fórmula actualmente enfocada
    }
  },
  computed: {
    hasFormulas() {
      return this.textContent && this.textContent.includes('$$');
    },
    renderedContent() {
      if (!this.textContent) return '';

      return parseContentSegments(this.textContent)
        .map((segment) => {
          if (segment.type === 'formula') {
            return renderLatexFormula(segment.content);
          }

          return this.escapeHtml(segment.content).replace(/\n/g, '<br>');
        })
        .join('');
    }
  },
  watch: {
    value: {
      handler(newVal) {
        // Cuando el valor cambia desde fuera (ej: al cargar desde BD)
        if (newVal !== this.textContent) {
          this.textContent = newVal || '';
          // Si está en modo edición, re-parsear
          if (this.isEditingText) {
            this.$nextTick(() => {
              this.parseContentToParts();
            });
          }
        }
      },
      immediate: true // Ejecutar inmediatamente al montar
    },
    textContent(newVal) {
      this.$emit('input', newVal);
    },
    showMathField(isOpen) {
      if (isOpen) {
        // Cuando se abre el editor, limpiar el campo matemático
        this.$nextTick(() => {
          const mf = this.$refs.mathField;
          if (mf) {
            mf.value = '';
            this.currentLatex = '';
          }
        });
      }
    }
  },
  methods: {
    escapeHtml(text) {
      return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    },
    handleTextChange() {
      this.$emit('input', this.textContent);
    },
    parseContentToParts() {
      this.contentParts = parseContentSegments(this.textContent).map((segment) => ({
        type: segment.type,
        content: segment.content
      }));

      if (this.contentParts.length === 0) {
        this.contentParts.push({
          type: 'text',
          content: this.textContent || ''
        });
      }

      this.$nextTick(() => {
        this.contentParts.forEach((part, index) => {
          if (part.type === 'formula') {
            const ref = this.$refs['mathField' + index];
            if (ref && ref[0]) {
              ref[0].value = part.content;
            }
          }
        });
      });
    },
    handleFormulaInput(index, event) {
      // Actualizar el contenido de la fórmula específica
      this.contentParts[index].content = event.target.value;
      this.updateFromParts();
    },
    handleFormulaBlur() {
      // Mantener el índice enfocado por un momento para que los botones funcionen
      setTimeout(() => {
        // Solo limpiar si no hay otro campo enfocado
        const activeElement = document.activeElement;
        if (!activeElement || activeElement.tagName !== 'MATH-FIELD') {
          this.focusedFormulaIndex = null;
        }
      }, 200);
    },
    updateFromParts() {
      // Reconstruir textContent desde contentParts
      let newContent = '';
      
      this.contentParts.forEach(part => {
        if (part.type === 'text') {
          newContent += part.content;
        } else if (part.type === 'formula') {
          newContent += `$$${part.content}$$`;
        }
      });
      
      this.textContent = newContent;
      this.$emit('input', this.textContent);
    },
    addFormulaPart() {
      // Solo agregar la fórmula, sin inputs de texto adicionales
      this.contentParts.push({
        type: 'formula',
        content: ''
      });
      
      this.updateFromParts();
      
      // Enfocar el nuevo campo matemático
      this.$nextTick(() => {
        const lastFormulaIndex = this.contentParts.length - 1;
        const ref = this.$refs['mathField' + lastFormulaIndex];
        if (ref && ref[0]) {
          ref[0].focus();
          this.focusedFormulaIndex = lastFormulaIndex;
        }
      });
    },
    addTextPart() {
      // Agregar un campo de texto
      this.contentParts.push({
        type: 'text',
        content: ''
      });
      
      this.updateFromParts();
      
      // Enfocar el nuevo campo de texto
      this.$nextTick(() => {
        const textInputs = this.$el.querySelectorAll('.text-part-input');
        if (textInputs.length > 0) {
          textInputs[textInputs.length - 1].focus();
        }
      });
    },
    removePart(index) {
      this.contentParts.splice(index, 1);
      this.updateFromParts();
    },
    enableEditMode() {
      // Guardar el contenido original para poder cancelar
      this.originalContent = this.textContent;
      this.isEditingText = true;
      
      // Parsear el contenido en partes editables
      this.parseContentToParts();
      
      // Si no hay partes, inicializar con una parte de texto vacía
      if (this.contentParts.length === 0) {
        this.contentParts.push({
          type: 'text',
          content: this.textContent || ''
        });
      }
      
      // Enfocar el primer campo
      this.$nextTick(() => {
        if (this.contentParts.length > 0) {
          if (this.contentParts[0].type === 'text') {
            const textInputs = this.$el.querySelectorAll('.text-part-input');
            if (textInputs.length > 0) {
              textInputs[0].focus();
            }
          } else if (this.contentParts[0].type === 'formula') {
            const ref = this.$refs['mathField0'];
            if (ref && ref[0]) {
              ref[0].focus();
            }
          }
        }
      });
    },
    saveEdit() {
      this.isEditingText = false;
      this.originalContent = '';
      this.contentParts = [];
      this.focusedFormulaIndex = null;
      this.$emit('input', this.textContent);
      this.$vs.notify({
        text: 'Cambios guardados correctamente',
        color: 'success',
        icon: 'check'
      });
    },
    cancelEdit() {
      // Restaurar el contenido original
      this.textContent = this.originalContent;
      this.isEditingText = false;
      this.originalContent = '';
      this.contentParts = [];
      this.focusedFormulaIndex = null;
      this.$emit('input', this.textContent);
    },
    handleBlur() {
      // No cerrar automáticamente el modo edición al perder el foco
    },
    focusTextArea() {
      this.enableEditMode();
    },
    handleInlineMathInput(event) {
      // Actualizar el valor del editor inline
      this.inlineLatex = event.target.value;
    },
    insertInlineMath() {
      if (!this.inlineLatex || this.inlineLatex.trim() === '') {
        this.$vs.notify({
          text: 'Por favor escribe una fórmula primero',
          color: 'warning'
        });
        return;
      }
      
      // Limpiar el LaTeX
      const cleanLatex = this.inlineLatex.trim();
      
      // Verificar si hay contenido antes
      const needsSpaceBefore = this.textContent.length > 0 && !this.textContent.endsWith(' ') && !this.textContent.endsWith('\n');
      const spaceAfter = ' ';
      
      // Insertar la fórmula
      const formula = `${needsSpaceBefore ? ' ' : ''}$$${cleanLatex}$$${spaceAfter}`;
      this.textContent += formula;
      this.$emit('input', this.textContent);
      
      // Limpiar el campo
      this.inlineLatex = '';
      const mf = this.$refs.inlineMathField;
      if (mf) {
        mf.value = '';
      }
      
      this.$vs.notify({
        text: 'Fórmula insertada correctamente',
        color: 'success'
      });
    },
    insertInlineExample(latex) {
      const mf = this.$refs.inlineMathField;
      if (mf) {
        mf.value = latex;
        this.inlineLatex = latex;
        mf.focus();
      }
    },
    insertQuickExample(latex) {
      // Si hay una fórmula enfocada, insertar ahí (agregando al contenido existente)
      if (this.focusedFormulaIndex !== null && this.contentParts[this.focusedFormulaIndex]) {
        const ref = this.$refs['mathField' + this.focusedFormulaIndex];
        if (ref && ref[0]) {
          // Obtener el contenido actual
          const currentContent = this.contentParts[this.focusedFormulaIndex].content || '';
          // Agregar el nuevo contenido (con espacio si ya hay contenido)
          const newContent = currentContent ? `${currentContent} ${latex}` : latex;
          
          ref[0].value = newContent;
          this.contentParts[this.focusedFormulaIndex].content = newContent;
          this.updateFromParts();
          ref[0].focus();
          return;
        }
      }
      
      // Si no hay fórmula enfocada, buscar la primera fórmula vacía
      const emptyFormulaIndex = this.contentParts.findIndex(part => 
        part.type === 'formula' && (!part.content || part.content.trim() === '')
      );
      
      if (emptyFormulaIndex >= 0) {
        // Insertar en la primera fórmula vacía
        const ref = this.$refs['mathField' + emptyFormulaIndex];
        if (ref && ref[0]) {
          ref[0].value = latex;
          this.contentParts[emptyFormulaIndex].content = latex;
          this.updateFromParts();
          ref[0].focus();
          this.focusedFormulaIndex = emptyFormulaIndex;
          return;
        }
      }
      
      // Si no hay fórmulas vacías, crear una nueva (solo la fórmula)
      this.contentParts.push({
        type: 'formula',
        content: latex
      });
      
      this.updateFromParts();
      
      // Enfocar el nuevo campo matemático
      this.$nextTick(() => {
        const formulaIndex = this.contentParts.length - 1;
        const ref = this.$refs['mathField' + formulaIndex];
        if (ref && ref[0]) {
          ref[0].focus();
          this.focusedFormulaIndex = formulaIndex;
        }
      });
    },
    openMathField() {
      this.currentLatex = '';
      this.showMathField = true;
      
      // Configurar el teclado virtual después de que el modal se abra
      this.$nextTick(() => {
        const mf = this.$refs.mathField;
        if (mf) {
          mf.focus();
          // Mostrar el teclado virtual
          if (window.mathVirtualKeyboard) {
            window.mathVirtualKeyboard.show();
          }
        }
      });
    },
    closeMathField() {
      this.showMathField = false;
      this.currentLatex = '';
      // Ocultar el teclado virtual
      if (window.mathVirtualKeyboard) {
        window.mathVirtualKeyboard.hide();
      }
    },
    handleMathInput(event) {
      // Obtener el valor en formato LaTeX desde el math-field
      const mf = event.target;
      // MathLive usa la propiedad 'value' que devuelve LaTeX
      this.currentLatex = mf.value;
    },
    insertMathIntoText() {
      if (!this.currentLatex || this.currentLatex.trim() === '') {
        this.$vs.notify({
          text: 'Por favor escribe una fórmula primero',
          color: 'warning'
        });
        return;
      }
      
      // Limpiar el LaTeX de espacios innecesarios
      const cleanLatex = this.currentLatex.trim();
      
      // Verificar si hay contenido antes y después para agregar espacios
      const needsSpaceBefore = this.textContent.length > 0 && !this.textContent.endsWith(' ') && !this.textContent.endsWith('\n');
      const spaceAfter = ' ';
      
      // Insertar la fórmula con espacios apropiados
      const formula = `${needsSpaceBefore ? ' ' : ''}$$${cleanLatex}$$${spaceAfter}`;
      this.textContent += formula;
      this.$emit('input', this.textContent);
      
      this.$vs.notify({
        text: 'Fórmula insertada correctamente',
        color: 'success'
      });
      
      this.closeMathField();
    },
    clearMath() {
      this.currentLatex = '';
      const mf = this.$refs.mathField;
      if (mf) {
        mf.value = '';
        mf.focus();
      }
    },
    insertExample(latex) {
      const mf = this.$refs.mathField;
      if (mf) {
        mf.value = latex;
        this.currentLatex = latex;
        mf.focus();
      }
    },
    resetEditor() {
      // Método público para resetear completamente el editor
      this.textContent = '';
      this.isEditingText = false;
      this.originalContent = '';
      this.contentParts = [];
      this.focusedFormulaIndex = null;
      this.inlineLatex = '';
      this.currentLatex = '';
      this.showMathField = false;
      this.$emit('input', '');
    }
  },
  mounted() {
    // Configurar el teclado virtual de MathLive
    if (window.mathVirtualKeyboard) {
      window.mathVirtualKeyboard.layouts = [
        'numeric',
        'symbols',
        'alphabetic',
        'greek'
      ];
    }
    
    // Asegurar que textContent tenga el valor inicial
    if (this.value && !this.textContent) {
      this.textContent = this.value;
    }
  }
}
</script>

<style scoped>
.mathlive-editor-container {
  width: 100%;
}

.text-field-section {
  margin-bottom: 15px;
}

.field-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
  font-size: 14px;
}

.rendered-input-area {
  position: relative;
  min-height: 120px;
  padding: 12px;
  border: 2px solid #4CAF50;
  border-radius: 8px;
  background: #f8f9fb;
  cursor: pointer;
  transition: all 0.3s;
  overflow: visible;
}

.rendered-input-area:hover {
  background: #e8f5e9;
  border-color: #2E7D32;
}

.rendered-input-area:hover .edit-overlay {
  opacity: 1;
}

.edit-overlay {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(46, 125, 50, 0.9);
  color: white;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  display: flex;
  align-items: center;
  gap: 5px;
}

.rendered-display {
  font-size: 16px;
  line-height: 2.4;
  color: #374151;
  min-height: 80px;
  overflow: visible;
}

.rendered-display >>> .ML__latex,
.rendered-display >>> .katex {
  display: inline-block;
  vertical-align: middle;
  margin: 0.15em 0.1em;
  overflow: visible;
}

.rendered-display.empty-state {
  color: #9ca3af;
  font-style: italic;
}

.edit-mode-container {
  position: relative;
}

.text-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e5e8ed;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Courier New', monospace;
  resize: vertical;
  transition: border-color 0.3s;
  line-height: 1.6;
}

.text-input:focus {
  outline: none;
  border-color: #4CAF50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.visual-edit-mode {
  border: 2px solid #4CAF50;
  border-radius: 8px;
  padding: 15px;
  background: #f8f9fb;
}

.content-part {
  margin-bottom: 15px;
}

.add-buttons-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.text-part {
  margin-bottom: 10px;
}

.text-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.text-label {
  font-weight: 600;
  color: #3b82f6;
  font-size: 13px;
}

.text-part-input {
  width: 100%;
  padding: 10px;
  border: 2px solid #e5e8ed;
  border-radius: 6px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
  min-height: 50px;
}

.text-part-input:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.formula-part {
  background: white;
  border: 2px solid #8b5cf6;
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 10px;
}

.formula-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.formula-label {
  font-weight: 600;
  color: #7c3aed;
  font-size: 13px;
}

.formula-editor {
  width: 100%;
  font-size: 24px;
  padding: 15px;
  border: 2px solid #e5e8ed;
  border-radius: 6px;
  min-height: 80px;
  background: #faf5ff;
}

.formula-editor:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-top: 12px;
  justify-content: flex-end;
}

.edit-hint {
  display: block;
  margin-top: 8px;
  color: #6b7280;
  font-style: italic;
  font-size: 12px;
}

.simple-editor {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.inline-formula-section {
  background: #f0f9ff;
  border: 2px solid #3b82f6;
  border-radius: 8px;
  padding: 15px;
}

.formula-section-label {
  display: block;
  font-weight: 600;
  color: #1e40af;
  margin-bottom: 10px;
  font-size: 14px;
}

.inline-math-field {
  width: 100%;
  font-size: 24px;
  padding: 15px;
  border: 2px solid #e5e8ed;
  border-radius: 6px;
  min-height: 70px;
  background: white;
  margin-bottom: 10px;
}

.inline-math-field:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.quick-examples-section {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e0d4f7;
  background: #faf5ff;
  padding: 15px;
  border-radius: 8px;
}

.examples-label {
  display: block;
  font-weight: 600;
  color: #7c3aed;
  margin-bottom: 10px;
  font-size: 13px;
}

.examples-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
  gap: 8px;
}

.examples-buttons button {
  width: 100%;
  font-size: 12px;
}

.action-buttons-main {
  display: flex;
  gap: 10px;
  margin-bottom: 15px;
  flex-wrap: wrap;
}

.math-popup {
  z-index: 99999 !important;
}

.math-editor-wrapper {
  padding: 30px;
  max-width: 1000px;
  margin: 0 auto;
}

.instructions {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 30px;
}

.instructions h3 {
  margin-bottom: 15px;
  font-size: 20px;
}

.instructions ul {
  list-style: none;
  padding: 0;
}

.instructions li {
  padding: 8px 0;
  font-size: 16px;
}

.math-field-container {
  background: white;
  border: 3px solid #4CAF50;
  border-radius: 12px;
  padding: 25px;
  margin-bottom: 30px;
}

.math-label {
  display: block;
  font-weight: 600;
  color: #374151;
  margin-bottom: 15px;
  font-size: 16px;
}

.math-input-field {
  width: 100%;
  font-size: 32px;
  padding: 20px;
  border: 2px solid #e5e8ed;
  border-radius: 8px;
  min-height: 100px;
  background: #f8f9fb;
}

.action-buttons {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
}

.action-buttons button {
  min-width: 180px;
  height: 55px;
  font-size: 16px;
  font-weight: 600;
}

.quick-examples {
  background: #f8f9fb;
  border: 2px solid #e5e8ed;
  border-radius: 12px;
  padding: 20px;
}

.quick-examples h4 {
  color: #374151;
  margin-bottom: 15px;
  font-size: 16px;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 10px;
}

.examples-grid button {
  width: 100%;
}
</style>
