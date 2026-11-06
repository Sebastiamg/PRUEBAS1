<template>
    <vs-popup 
        class="popup-captura-rapida" 
        fullscreen 
        title="⚡ Captura Súper Rápida de Libros" 
        :active.sync="modalVisible"
        @close="cerrarModal"
    >
        <div v-if="modalVisible">
            <!-- Banner de instrucciones -->
            <div style="
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                margin: -15px -15px 20px -15px;
                text-align: center;
                font-size: 18px;
                font-weight: bold;
                border-radius: 0;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            ">
                ⚡ MODO CAPTURA SÚPER RÁPIDA ACTIVO ⚡
                <div style="font-size: 14px; margin-top: 5px; opacity: 0.9;">
                    <strong>📌 Instrucciones:</strong> Escribe → Enter → Cantidad → Enter → ¡Listo! Repite para el siguiente
                </div>
            </div>
            
            <!-- Contenido principal -->
            <div style="padding: 20px; background-color: #f0f8ff; border-radius: 8px; margin-bottom: 20px; overflow: visible;">
                <!-- Tabla de captura rápida -->
                <div style="background: white; border-radius: 8px; padding: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: visible;">
                    <vs-table 
                        :data="filasCaptura" 
                        :max-items="50"
                        class="tabla-captura-rapida"
                    >
                        <template slot="header">
                            <div style="display: flex; justify-content: space-between; align-items: center;">
                                <vs-chip color="primary">Tabla de Captura Rápida</vs-chip>
                                <vs-button 
                                    @click="agregarFilaCaptura" 
                                    color="success" 
                                    size="small"
                                    type="flat"
                                >
                                    ➕ Agregar Fila
                                </vs-button>
                            </div>
                        </template>
                        
                        <template slot="thead">
                            <vs-th style="width: 50px;">#</vs-th>
                            <vs-th style="width: 40%;">🔍 Buscar Libro</vs-th>
                            <vs-th style="width: 100px;">📦 Cantidad</vs-th>
                            <vs-th style="width: 80px;">📊 Stock</vs-th>
                            <vs-th style="width: 60px;">✅ Estado</vs-th>
                            <vs-th style="width: 80px;">🗑️ Acción</vs-th>
                        </template>
                        
                        <template slot-scope="{data}">
                            <vs-tr :data="fila" :key="index" v-for="(fila, index) in data">
                                <!-- Número de fila -->
                                <vs-td>
                                    <span style="font-weight: bold; color: #666;">{{ index + 1 }}</span>
                                </vs-td>
                                
                                <!-- Buscador de libro -->
                                <vs-td style="position: relative;">
                                    <vs-input 
                                        v-model="fila.textoBusqueda"
                                        @input="buscarEnFila(fila, index)"
                                        @keyup.tab="enfocarSiguienteInput(index, 'cantidad')"
                                        @keyup.enter="seleccionarPrimerResultado(fila, index)"
                                        :placeholder="`Escribe el nombre del libro...`"
                                        style="width: 100%;"
                                        :class="fila.libroSeleccionado ? 'libro-encontrado' : ''"
                                    />
                                    
                                    <!-- Dropdown de resultados -->
                                    <div 
                                        v-if="fila.resultadosBusqueda && fila.resultadosBusqueda.length > 0 && !fila.libroSeleccionado"
                                        class="dropdown-autocomplete"
                                    >
                                        <div 
                                            v-for="(libro, libroIndex) in fila.resultadosBusqueda.slice(0, 5)" 
                                            :key="libroIndex"
                                            @click="seleccionarLibroEnFila(fila, libro, index)"
                                            style="
                                                padding: 8px 12px; 
                                                cursor: pointer; 
                                                border-bottom: 1px solid #f0f0f0;
                                                font-size: 13px;
                                            "
                                            :style="libroIndex === 0 ? 'background-color: #e3f2fd;' : ''"
                                            @mouseover="$event.target.style.backgroundColor = '#e3f2fd'"
                                            @mouseout="$event.target.style.backgroundColor = libroIndex === 0 ? '#e3f2fd' : 'white'"
                                        >
                                            <div style="font-weight: bold;">{{ libro.nombre_libro }}</div>
                                            <div style="font-size: 11px; color: #666;">
                                                {{ libro.pro_codigo }} | Stock: {{ libro.stock || 0 }}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <!-- Libro seleccionado -->
                                    <div v-if="fila.libroSeleccionado" style="margin-top: 5px; font-size: 11px; color: #28a745;">
                                        ✅ <strong>{{ fila.libroSeleccionado.nombre_libro }}</strong>
                                    </div>
                                </vs-td>
                                
                                <!-- Input de cantidad -->
                                <vs-td>
                                    <vs-input 
                                        v-model="fila.cantidad"
                                        type="number"
                                        min="1"
                                        :max="fila.libroSeleccionado ? fila.libroSeleccionado.stock : 999"
                                        placeholder="0"
                                        @keyup.enter="confirmarLibroEnFila(fila, index)"
                                        @keyup.tab="enfocarSiguienteInput(index + 1, 'busqueda')"
                                        style="width: 80px;"
                                        :disabled="!fila.libroSeleccionado"
                                        :ref="`cantidad-${index}`"
                                    />
                                </vs-td>
                                
                                <!-- Stock disponible -->
                                <vs-td>
                                    <vs-chip 
                                        v-if="fila.libroSeleccionado"
                                        :color="obtenerColorStock(fila.libroSeleccionado)" 
                                        size="small"
                                    >
                                        {{ fila.libroSeleccionado.stock || 0 }}
                                    </vs-chip>
                                    <span v-else style="color: #ccc;">-</span>
                                </vs-td>
                                
                                <!-- Estado -->
                                <vs-td>
                                    <span v-if="fila.confirmado" style="color: #28a745; font-weight: bold;">✅</span>
                                    <span v-else-if="fila.libroSeleccionado && fila.cantidad" style="color: #ffc107;">⏳</span>
                                    <span v-else style="color: #ccc;">⭕</span>
                                </vs-td>
                                
                                <!-- Acción -->
                                <vs-td>
                                    <vs-button 
                                        v-if="!fila.confirmado && fila.libroSeleccionado && fila.cantidad"
                                        @click="confirmarLibroEnFila(fila, index)"
                                        color="success" 
                                        size="small"
                                        type="flat"
                                    >
                                        ✅
                                    </vs-button>
                                    <vs-button 
                                        v-if="fila.libroSeleccionado"
                                        @click="limpiarFilaCaptura(fila, index)"
                                        color="danger" 
                                        size="small"
                                        type="flat"
                                    >
                                        🗑️
                                    </vs-button>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
                
                <!-- Resumen de libros confirmados -->
                <div v-if="librosConfirmados.length > 0" style="background-color: #d4edda; padding: 15px; border-radius: 4px; margin-top: 20px;">
                    <h6 style="color: #155724; margin-bottom: 10px;">
                        ✅ Libros Confirmados para Proforma ({{ librosConfirmados.length }}):
                    </h6>
                    <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                        <span 
                            v-for="(libro, index) in librosConfirmados" 
                            :key="index"
                            style="
                                background-color: #28a745; 
                                color: white; 
                                padding: 4px 8px; 
                                border-radius: 4px; 
                                font-size: 12px;
                                cursor: pointer;
                            "
                            @click="quitarLibroConfirmado(index)"
                            title="Hacer clic para quitar"
                        >
                            {{ libro.nombre_libro }} ({{ libro.cantidadProforma }}) ❌
                        </span>
                    </div>
                </div>
            </div>
            
            <!-- Botones de acción -->
            <div class="flex justify-center gap-4 mt-6">
                <vs-button 
                    color="success" 
                    type="gradient" 
                    @click="confirmarSeleccion"
                    :disabled="librosConfirmados.length === 0"
                >
                    <i class="fas fa-check mr-2"></i>
                    Confirmar Selección ({{ librosConfirmados.length }})
                </vs-button>
                <vs-button color="danger" type="border" @click="cerrarModal">
                    <i class="fas fa-times mr-2"></i>
                    Cancelar
                </vs-button>
            </div>
        </div>
    </vs-popup>
</template>

<script>
export default {
    name: 'CapturaRapidaModal',
    props: {
        visible: {
            type: Boolean,
            default: false
        },
        librosDisponibles: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            modalVisible: this.visible,
            filasCaptura: [
                { 
                    textoBusqueda: '', 
                    libroSeleccionado: null, 
                    cantidad: '', 
                    confirmado: false, 
                    resultadosBusqueda: [] 
                }
            ],
            librosConfirmados: []
        }
    },
    watch: {
        visible(newVal) {
            this.modalVisible = newVal;
            if (newVal) {
                this.resetearModal();
            }
        },
        modalVisible(newVal) {
            this.$emit('update:visible', newVal);
        }
    },
    methods: {
        cerrarModal() {
            this.modalVisible = false;
            this.$emit('cerrar');
        },
        
        resetearModal() {
            this.filasCaptura = [
                { 
                    textoBusqueda: '', 
                    libroSeleccionado: null, 
                    cantidad: '', 
                    confirmado: false, 
                    resultadosBusqueda: [] 
                }
            ];
            this.librosConfirmados = [];
        },
        
        confirmarSeleccion() {
            if (this.librosConfirmados.length === 0) {
                this.$vs.notify({
                    text: 'No hay libros confirmados para agregar',
                    color: 'warning'
                });
                return;
            }
            
            this.$emit('libros-confirmados', this.librosConfirmados);
            this.cerrarModal();
        },
        
        // ========================================
        // MÉTODOS PARA CAPTURA SÚPER RÁPIDA
        // ========================================
        
        agregarFilaCaptura() {
            this.filasCaptura.push({
                textoBusqueda: '',
                libroSeleccionado: null,
                cantidad: '',
                confirmado: false,
                resultadosBusqueda: []
            });
        },
        
        buscarEnFila(fila, index) {
            const texto = fila.textoBusqueda.toLowerCase();
            
            if (texto.length < 2) {
                fila.resultadosBusqueda = [];
                fila.libroSeleccionado = null;
                return;
            }
            
            // Buscar en la lista de libros disponibles
            fila.resultadosBusqueda = this.librosDisponibles.filter(libro =>
                libro.nombre_libro.toLowerCase().includes(texto) ||
                libro.pro_codigo.toLowerCase().includes(texto)
            ).slice(0, 5); // Máximo 5 resultados
        },
        
        seleccionarPrimerResultado(fila, index) {
            if (fila.resultadosBusqueda && fila.resultadosBusqueda.length > 0) {
                this.seleccionarLibroEnFila(fila, fila.resultadosBusqueda[0], index);
            }
        },
        
        seleccionarLibroEnFila(fila, libro, index) {
            fila.libroSeleccionado = libro;
            fila.textoBusqueda = libro.nombre_libro;
            fila.resultadosBusqueda = [];
            fila.cantidad = '1'; // Cantidad por defecto
            
            // Enfocar el input de cantidad
            this.$nextTick(() => {
                this.enfocarSiguienteInput(index, 'cantidad');
            });
        },
        
        enfocarSiguienteInput(index, tipo) {
            this.$nextTick(() => {
                if (tipo === 'cantidad') {
                    const cantidadInput = this.$refs[`cantidad-${index}`];
                    if (cantidadInput && cantidadInput[0]) {
                        cantidadInput[0].$el.querySelector('input').focus();
                    }
                } else if (tipo === 'busqueda') {
                    // Agregar nueva fila si es necesario
                    if (index >= this.filasCaptura.length) {
                        this.agregarFilaCaptura();
                    }
                    
                    // Pequeño delay para asegurar que el DOM se actualice
                    setTimeout(() => {
                        const inputs = this.$el.querySelectorAll('table input[type="text"]');
                        if (inputs[index]) {
                            inputs[index].focus();
                        }
                    }, 100);
                }
            });
        },
        
        confirmarLibroEnFila(fila, index) {
            if (!fila.libroSeleccionado || !fila.cantidad) {
                this.$vs.notify({
                    text: 'Seleccione un libro y especifique la cantidad',
                    color: 'warning'
                });
                return;
            }
            
            const cantidad = parseInt(fila.cantidad);
            const stock = fila.libroSeleccionado.stock || 0;
            
            if (cantidad > stock) {
                this.$vs.notify({
                    text: 'La cantidad no puede ser mayor al stock disponible',
                    color: 'danger'
                });
                return;
            }
            
            // Verificar si el libro ya está confirmado
            const indiceExistente = this.librosConfirmados.findIndex(
                libro => libro.pro_codigo === fila.libroSeleccionado.pro_codigo
            );
            
            if (indiceExistente >= 0) {
                // Actualizar cantidad si ya existe
                this.librosConfirmados[indiceExistente].cantidadProforma = cantidad;
                this.$vs.notify({
                    text: 'Cantidad actualizada',
                    color: 'success'
                });
            } else {
                // Agregar nuevo libro
                this.librosConfirmados.push({
                    ...fila.libroSeleccionado,
                    cantidadProforma: cantidad
                });
                this.$vs.notify({
                    text: '✅ Libro confirmado',
                    color: 'success'
                });
            }
            
            // Marcar fila como confirmada
            fila.confirmado = true;
            
            // Pasar al siguiente input
            this.enfocarSiguienteInput(index + 1, 'busqueda');
        },
        
        limpiarFilaCaptura(fila, index) {
            fila.textoBusqueda = '';
            fila.libroSeleccionado = null;
            fila.cantidad = '';
            fila.confirmado = false;
            fila.resultadosBusqueda = [];
        },
        
        quitarLibroConfirmado(index) {
            this.librosConfirmados.splice(index, 1);
            this.$vs.notify({
                text: 'Libro removido de la proforma',
                color: 'warning'
            });
        },
        
        obtenerColorStock(libro) {
            if (libro.stock === undefined) return 'dark';
            if (libro.stock === 0) return 'danger';
            if (libro.stock < libro.cantidad) return 'warning';
            return 'success';
        }
    }
}
</script>

<style scoped>
/* Popup con z-index alto */
.popup-captura-rapida {
    z-index: 51003 !important;
}

.popup-captura-rapida .vs-popup {
    padding: 20px;
    z-index: 51003 !important;
}

/* Estilos para la tabla de captura rápida */
.tabla-captura-rapida {
    border-radius: 8px;
}

.tabla-captura-rapida .vs-table__tr {
    min-height: 60px !important;
}

.tabla-captura-rapida .vs-table__td {
    padding: 15px 12px !important;
    vertical-align: middle !important;
    position: relative !important;
}

.tabla-captura-rapida .vs-table__th {
    padding: 15px 12px !important;
    font-weight: bold !important;
}

/* Estilos para libro encontrado */
.libro-encontrado input {
    border-color: #28a745 !important;
    background-color: #f8fff8 !important;
}

.vs-table td {
    position: relative;
}

.vs-table .vs-td {
    vertical-align: top;
}

/* Hover effects */
.vs-table tbody tr:hover {
    background-color: #f8f9fa;
}

/* Estilos para el dropdown de autocomplete */
.dropdown-autocomplete {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #ddd;
    border-radius: 4px;
    max-height: 150px;
    overflow-y: auto;
    z-index: 9999;
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    margin-top: 2px;
}

/* Utility classes */
.flex {
    display: flex;
}

.justify-center {
    justify-content: center;
}

.gap-4 {
    gap: 1rem;
}

.mt-6 {
    margin-top: 1.5rem;
}

/* Responsive adjustments */
@media (max-width: 768px) {
    .tabla-captura-rapida {
        font-size: 12px;
    }
    
    .tabla-captura-rapida .vs-table__td {
        padding: 8px 4px !important;
    }
}
</style>