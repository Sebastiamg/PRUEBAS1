<template>
<div class="gf-builder">

    <!-- Header acciones -->
    <div class="gf-toolbar">
        <vs-button color="primary" size="small" @click="abrirForm()">
            <i class="feather icon-plus mr-1"></i> Agregar pregunta
        </vs-button>
        <vs-button
            v-if="preguntas.length > 1"
            color="dark" size="small" type="border"
            @click="guardarOrden" :disabled="guardandoOrden"
        >
            {{ guardandoOrden ? 'Guardando...' : 'Guardar orden' }}
        </vs-button>
    </div>

    <!-- Estado vacío -->
    <div v-if="!preguntas.length" class="gf-empty">
        <i class="feather icon-help-circle gf-empty-icon"></i>
        <p>Aún no hay preguntas. Agrega la primera.</p>
    </div>

    <!-- Lista de preguntas (drag visual con flechas) -->
    <div v-else class="gf-list">
        <div
            v-for="(p, i) in preguntas"
            :key="p.id || i"
            class="gf-card"
            :class="{ 'gf-card--active': editandoId === (p.id || i) }"
        >
            <!-- Drag handle + número -->
            <div class="gf-card-left">
                <div class="gf-order-btns">
                    <button class="gf-order-btn" :disabled="i === 0" @click="mover(i, -1)">▲</button>
                    <span class="gf-num">{{ i + 1 }}</span>
                    <button class="gf-order-btn" :disabled="i === preguntas.length - 1" @click="mover(i, 1)">▼</button>
                </div>
            </div>

            <!-- Contenido -->
            <div class="gf-card-body">
                <div class="gf-card-top">
                    <span class="gf-tipo-badge" :class="'gf-tipo--' + p.tipo">{{ labelTipo(p.tipo) }}</span>
                    <p class="gf-pregunta-texto">{{ p.texto }}</p>
                </div>

                <!-- Preview según tipo -->
                <div class="gf-preview">
                    <!-- Escala -->
                    <div v-if="p.tipo === 'escala'" class="gf-preview-escala">
                        <span v-for="n in (p.escala_maxima || 10)" :key="n" class="gf-escala-num">{{ n }}</span>
                    </div>
                    <!-- Varias opciones (radio) -->
                    <div v-else-if="p.tipo === 'multiple'" class="gf-preview-opciones">
                        <div v-for="(op, j) in p.opciones" :key="j" class="gf-preview-op">
                            <span class="gf-radio-dot"></span>
                            <span>{{ op.texto }}</span>
                        </div>
                    </div>
                    <!-- Casillas (checkbox) -->
                    <div v-else-if="p.tipo === 'casillas'" class="gf-preview-opciones">
                        <div v-for="(op, j) in p.opciones" :key="j" class="gf-preview-op">
                            <span class="gf-check-box"></span>
                            <span>{{ op.texto }}</span>
                        </div>
                    </div>
                    <!-- Abierta -->
                    <div v-else-if="p.tipo === 'abierta'" class="gf-preview-abierta">
                        Respuesta de texto libre...
                    </div>
                </div>
            </div>

            <!-- Acciones -->
            <div class="gf-card-actions">
                <button class="gf-action-btn gf-action-btn--edit" @click="abrirForm(p)" title="Editar">
                    <i class="feather icon-edit-2"></i>
                </button>
                <button class="gf-action-btn gf-action-btn--del" @click="eliminar(p, i)" title="Eliminar">
                    <i class="feather icon-trash-2"></i>
                </button>
            </div>
        </div>
    </div>

    <!-- POPUP FORM -->
    <vs-popup
        :title="form.id ? 'Editar pregunta' : 'Nueva pregunta'"
        :active.sync="popup"
        style="z-index:51000"
    >
        <div class="gf-form">

            <!-- Texto -->
            <div class="gf-form-group">
                <label class="gf-label">Pregunta *</label>
                <vs-input class="w-full" v-model="form.texto" placeholder="Escribe la pregunta..." />
            </div>

            <!-- Selector de tipo estilo Google Forms -->
            <div class="gf-form-group">
                <label class="gf-label">Tipo de respuesta</label>
                <div class="gf-tipo-grid">
                    <button
                        v-for="t in tipos" :key="t.value"
                        class="gf-tipo-btn"
                        :class="{ 'gf-tipo-btn--active': form.tipo === t.value }"
                        @click="cambiarTipo(t.value)"
                    >
                        <span class="gf-tipo-icon">{{ t.icon }}</span>
                        <span class="gf-tipo-label">{{ t.label }}</span>
                    </button>
                </div>
            </div>

            <!-- Preview / config según tipo -->

            <!-- ESCALA: preview automático -->
            <div v-if="form.tipo === 'escala'" class="gf-tipo-preview gf-tipo-preview--escala">
                <label class="gf-label mb-2">Escala máxima</label>
                <div class="flex items-center gap-3 mb-3">
                    <span class="text-sm text-gray-600">Del 1 al</span>
                    <input 
                        type="number" 
                        v-model.number="form.escala_maxima" 
                        min="2" 
                        max="10"
                        class="escala-input"
                        placeholder="10"
                    />
                    <span class="text-xs text-gray-400">(mín: 2, máx: 10)</span>
                </div>
                <p class="gf-preview-hint">Se generan automáticamente las opciones del 1 al {{ form.escala_maxima }}</p>
                <div class="gf-escala-preview-row">
                    <span v-for="n in form.escala_maxima" :key="n" class="gf-escala-preview-num">{{ n }}</span>
                </div>
            </div>

            <!-- MÚLTIPLE / CASILLAS: opciones editables -->
            <div v-if="form.tipo === 'multiple' || form.tipo === 'casillas'" class="gf-tipo-preview">
                <label class="gf-label">Opciones</label>
                <div v-for="(op, i) in form.opciones" :key="i" class="gf-opcion-row">
                    <span v-if="form.tipo === 'multiple'" class="gf-radio-dot"></span>
                    <span v-else class="gf-check-box"></span>
                    <vs-input v-model="op.texto" class="flex-1" :placeholder="'Opción ' + (i + 1)" />
                    <button class="gf-remove-op" @click="form.opciones.splice(i, 1)" title="Quitar">✕</button>
                </div>
                <button class="gf-add-op" @click="form.opciones.push({ texto: '' })">
                    <i class="feather icon-plus"></i> Agregar opción
                </button>
            </div>

            <!-- ABIERTA: preview -->
            <div v-if="form.tipo === 'abierta'" class="gf-tipo-preview gf-tipo-preview--abierta">
                <p class="gf-preview-hint">El docente escribirá su respuesta libremente</p>
                <div class="gf-abierta-preview">Escribe tu respuesta aquí...</div>
            </div>

            <vs-button color="success" class="w-full mt-4" @click="guardar" :disabled="guardando">
                {{ guardando ? 'Guardando...' : (form.id ? 'Actualizar' : 'Agregar pregunta') }}
            </vs-button>

        </div>
    </vs-popup>

</div>
</template>

<script>
export default {
    props: {
        encuesta: { type: Object, required: true }
    },

    data() {
        return {
            preguntas: [],
            popup: false,
            guardando: false,
            guardandoOrden: false,
            editandoId: null,

            form: { id: null, texto: '', tipo: 'escala', escala_maxima: 10, opciones: [] },

            tipos: [
                { value: 'escala',   icon: '📊', label: 'Escala' },
                { value: 'multiple', icon: '🔘', label: 'Varias opciones' },
                { value: 'casillas', icon: '☑️',  label: 'Casillas' },
                { value: 'abierta',  icon: '✏️',  label: 'Respuesta abierta' },
            ]
        }
    },

    watch: {
        encuesta: { immediate: true, handler(val) { if (val && val.id) this.cargar() } },
        
        'form.escala_maxima'(newVal) {
            // Ajustar automáticamente si está fuera de rango
            if (newVal && newVal > 10) {
                this.$set(this.form, 'escala_maxima', 10)
            } else if (newVal && newVal < 2) {
                this.$set(this.form, 'escala_maxima', 2)
            }
        }
    },

    methods: {
        cargar() {
            this.$http.get(this.$server_url + 'encuesta_prolipa/' + this.encuesta.id + '/preguntas')
                .then(res => {
                    this.preguntas = res.data
                        .sort((a, b) => (a.orden || 0) - (b.orden || 0))
                        .map(p => ({
                            id:      p.id,
                            texto:   p.texto,
                            tipo:    p.tipo,
                            escala_maxima: p.escala_maxima || 10,
                            orden:   p.orden || 0,
                            opciones: (p.opciones || []).map(o => ({ id: o.id, texto: o.texto }))
                        }))
                })
                .catch(err => console.log(err))
        },

        labelTipo(tipo) {
            const t = this.tipos.find(x => x.value === tipo)
            return t ? t.icon + ' ' + t.label : tipo
        },

        abrirForm(p = null) {
            if (p) {
                this.form = {
                    id:      p.id,
                    texto:   p.texto,
                    tipo:    p.tipo,
                    escala_maxima: p.escala_maxima || 10,
                    opciones: (p.opciones || []).map(o => ({ id: o.id, texto: o.texto }))
                }
                this.editandoId = p.id
            } else {
                this.form = { id: null, texto: '', tipo: 'escala', escala_maxima: 10, opciones: [] }
                this.editandoId = null
            }
            this.popup = true
        },

        cambiarTipo(tipo) {
            this.$set(this.form, 'tipo', tipo)
            if (tipo !== 'multiple' && tipo !== 'casillas') {
                this.$set(this.form, 'opciones', [])
            }
        },

        guardar() {
            const me = this
            if (!me.form.texto.trim()) {
                return me.$vs.notify({ color: 'warning', text: 'El texto de la pregunta es obligatorio' })
            }
            
            // Validar escala_maxima si es tipo escala
            if (me.form.tipo === 'escala') {
                if (!me.form.escala_maxima || me.form.escala_maxima < 2 || me.form.escala_maxima > 10) {
                    return me.$vs.notify({ color: 'warning', text: 'La escala debe estar entre 2 y 10' })
                }
            }
            
            if (me.form.tipo === 'multiple' || me.form.tipo === 'casillas') {
                if (me.form.opciones.length < 2) {
                    return me.$vs.notify({ color: 'warning', text: 'Agrega al menos 2 opciones' })
                }
                if (me.form.opciones.some(o => !o.texto.trim())) {
                    return me.$vs.notify({ color: 'warning', text: 'Hay opciones vacías' })
                }
            }

            me.guardando = true
            me.$http.post(me.$server_url + 'encuesta_prolipa/' + me.encuesta.id + '/preguntas', {
                preguntas: [me.form]
            })
            .then(() => {
                me.guardando = false
                me.popup = false
                me.editandoId = null
                me.cargar()
                me.$vs.notify({ color: 'success', text: me.form.id ? 'Pregunta actualizada' : 'Pregunta agregada' })
            })
            .catch(err => { me.guardando = false; console.log(err) })
        },

        mover(index, dir) {
            const nuevo = index + dir
            if (nuevo < 0 || nuevo >= this.preguntas.length) return
            const arr = [...this.preguntas]
            ;[arr[index], arr[nuevo]] = [arr[nuevo], arr[index]]
            arr.forEach((p, i) => { p.orden = i + 1 })
            this.preguntas = arr
        },

        guardarOrden() {
            const me = this
            me.guardandoOrden = true
            me.$http.post(me.$server_url + 'encuesta_prolipa/' + me.encuesta.id + '/orden', {
                orden: me.preguntas.map((p, i) => ({ id: p.id, orden: i + 1 }))
            })
            .then(() => { me.$vs.notify({ color: 'success', text: 'Orden guardado' }) })
            .catch(err => console.log(err))
            .finally(() => { me.guardandoOrden = false })
        },

        eliminar(p, i) {
            this.$vs.dialog({
                type: 'confirm', color: 'danger',
                title: 'Eliminar pregunta',
                text: '¿Seguro que deseas eliminar esta pregunta?',
                accept: () => {
                    if (p.id) {
                        this.$http.delete(this.$server_url + 'encuesta_prolipa/pregunta/' + p.id)
                            .then(() => {
                                this.preguntas.splice(i, 1)
                                this.$vs.notify({ color: 'success', text: 'Pregunta eliminada' })
                            })
                            .catch(err => console.log(err))
                    } else {
                        this.preguntas.splice(i, 1)
                    }
                }
            })
        }
    }
}
</script>

<style scoped>
.gf-builder { padding: 0.5rem 0; }

.gf-toolbar {
    display: flex; gap: 0.5rem; margin-bottom: 1.25rem;
}

.gf-empty {
    text-align: center; padding: 3rem 1rem; color: #94a3b8;
}
.gf-empty-icon { font-size: 2.5rem; display: block; margin-bottom: 0.5rem; }

/* Cards */
.gf-list { display: flex; flex-direction: column; gap: 0.75rem; }

.gf-card {
    display: flex; align-items: flex-start; gap: 0.75rem;
    background: #fff; border: 1.5px solid #e5e7eb;
    border-radius: 0.875rem; padding: 1rem;
    transition: border-color 0.15s, box-shadow 0.15s;
}
.gf-card:hover { border-color: #c7d2fe; box-shadow: 0 2px 12px rgba(108,99,255,0.08); }
.gf-card--active { border-color: #6c63ff; }

.gf-card-left { display: flex; flex-direction: column; align-items: center; gap: 2px; flex-shrink: 0; }
.gf-order-btns { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.gf-order-btn {
    background: none; border: none; cursor: pointer;
    color: #94a3b8; font-size: 0.65rem; padding: 1px 4px;
    border-radius: 4px; transition: color 0.15s, background 0.15s;
}
.gf-order-btn:hover:not(:disabled) { color: #6c63ff; background: #f0f0ff; }
.gf-order-btn:disabled { opacity: 0.3; cursor: default; }
.gf-num {
    font-size: 0.75rem; font-weight: 700; color: #6c63ff;
    background: #f0f0ff; border-radius: 50%;
    width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;
}

.gf-card-body { flex: 1; min-width: 0; }
.gf-card-top { display: flex; align-items: flex-start; gap: 0.5rem; margin-bottom: 0.5rem; }

.gf-tipo-badge {
    font-size: 0.7rem; font-weight: 600; padding: 2px 8px;
    border-radius: 99px; white-space: nowrap; flex-shrink: 0;
}
.gf-tipo--escala   { background: #fef3c7; color: #92400e; }
.gf-tipo--multiple { background: #e0e7ff; color: #3730a3; }
.gf-tipo--casillas { background: #d1fae5; color: #065f46; }
.gf-tipo--abierta  { background: #f3f4f6; color: #374151; }

.gf-pregunta-texto { font-size: 0.95rem; font-weight: 600; color: #1f2937; margin: 0; }

/* Previews */
.gf-preview { margin-top: 0.25rem; }
.gf-preview-escala { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.gf-escala-num {
    width: 28px; height: 28px; border-radius: 50%;
    border: 1.5px solid #d1d5db; display: flex; align-items: center; justify-content: center;
    font-size: 0.78rem; font-weight: 600; color: #6b7280;
}
.gf-preview-opciones { display: flex; flex-direction: column; gap: 0.3rem; }
.gf-preview-op { display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: #374151; }
.gf-radio-dot {
    width: 14px; height: 14px; border-radius: 50%;
    border: 2px solid #9ca3af; flex-shrink: 0;
}
.gf-check-box {
    width: 14px; height: 14px; border-radius: 3px;
    border: 2px solid #9ca3af; flex-shrink: 0;
}
.gf-preview-abierta {
    font-size: 0.85rem; color: #9ca3af; font-style: italic;
    border-bottom: 1px solid #d1d5db; padding-bottom: 4px;
}

/* Acciones card */
.gf-card-actions { display: flex; flex-direction: column; gap: 0.35rem; flex-shrink: 0; }
.gf-action-btn {
    width: 30px; height: 30px; border-radius: 8px; border: none;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 14px; transition: background 0.15s;
}
.gf-action-btn--edit  { background: #e0e7ff; color: #4338ca; }
.gf-action-btn--edit:hover  { background: #c7d2fe; }
.gf-action-btn--del   { background: #fee2e2; color: #b91c1c; }
.gf-action-btn--del:hover   { background: #fecaca; }

/* Form popup */
.gf-form { padding: 0.25rem; }
.gf-form-group { margin-bottom: 1.25rem; }
.gf-label { font-size: 0.85rem; font-weight: 600; color: #374151; display: block; margin-bottom: 0.4rem; }

/* Tipo grid */
.gf-tipo-grid {
    display: grid; grid-template-columns: repeat(2, 1fr); gap: 0.5rem;
}
.gf-tipo-btn {
    display: flex; align-items: center; gap: 0.5rem;
    padding: 0.625rem 0.875rem; border-radius: 0.625rem;
    border: 1.5px solid #e5e7eb; background: #f9fafb;
    cursor: pointer; transition: all 0.15s; text-align: left;
}
.gf-tipo-btn:hover { border-color: #a5b4fc; background: #f0f0ff; }
.gf-tipo-btn--active { border-color: #6c63ff; background: #f0f0ff; }
.gf-tipo-icon { font-size: 1.1rem; }
.gf-tipo-label { font-size: 0.85rem; font-weight: 600; color: #374151; }
.gf-tipo-btn--active .gf-tipo-label { color: #4338ca; }

/* Tipo previews en form */
.gf-tipo-preview {
    background: #f8fafc; border: 1px solid #e5e7eb;
    border-radius: 0.625rem; padding: 0.875rem 1rem; margin-bottom: 1rem;
}
.gf-tipo-preview--escala { background: #fffbeb; border-color: #fde68a; }
.gf-tipo-preview--abierta { background: #f9fafb; }
.gf-preview-hint { font-size: 0.78rem; color: #6b7280; margin-bottom: 0.5rem; }
.gf-escala-preview-row { display: flex; gap: 0.35rem; flex-wrap: wrap; }
.gf-escala-preview-num {
    width: 32px; height: 32px; border-radius: 50%;
    border: 1.5px solid #fbbf24; background: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 0.85rem; font-weight: 700; color: #92400e;
}
.gf-abierta-preview {
    font-size: 0.85rem; color: #9ca3af; font-style: italic;
    border-bottom: 1px solid #d1d5db; padding-bottom: 6px;
}

/* Opciones editables */
.gf-opcion-row {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;
}
.gf-remove-op {
    background: none; border: none; cursor: pointer;
    color: #9ca3af; font-size: 0.85rem; padding: 2px 6px;
    border-radius: 4px; transition: color 0.15s;
}
.gf-remove-op:hover { color: #ef4444; }
.gf-add-op {
    background: none; border: 1.5px dashed #d1d5db;
    border-radius: 0.5rem; padding: 0.4rem 0.875rem;
    font-size: 0.82rem; color: #6c63ff; cursor: pointer;
    width: 100%; text-align: left; transition: border-color 0.15s, background 0.15s;
    display: flex; align-items: center; gap: 0.35rem;
}
.gf-add-op:hover { border-color: #6c63ff; background: #f5f3ff; }

/* Input de escala máxima */
.escala-input {
    width: 80px; padding: 0.5rem 0.75rem; border-radius: 0.5rem;
    border: 2px solid #e5e7eb; background: #fff;
    font-size: 1rem; font-weight: 600; color: #1f2937;
    text-align: center; transition: all 0.15s;
}
.escala-input:focus {
    outline: none; border-color: #6c63ff; background: #f5f7ff;
}
.escala-input:hover { border-color: #c7d2fe; }
</style>
