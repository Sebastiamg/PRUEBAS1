<template>
    <div>
        <!-- Botón flotante para abrir configuración -->
        <div v-if="mostrarBoton" class="config-toggle-btn" @click="toggleSidebar" :class="{'config-btn-active': visible}">
            <feather-icon icon="SettingsIcon" :class="{'rotating': visible}" size="24"></feather-icon>
            <span class="config-tooltip">{{ visible ? 'Ocultar' : 'Mostrar' }} Configuración</span>
        </div>

        <!-- Panel lateral de configuración -->
        <transition name="slide-config">
            <div v-if="visible" class="config-sidebar">
                <div class="config-header">
                    <h4 class="font-bold mb-3 headers-xd">
                        <feather-icon icon="SettingsIcon" size="12" class="inline mr-2" color=""></feather-icon>
                        Configuración de Proforma
                    </h4>
                    <vs-button
                        @click="toggleSidebar" 
                        style="color: white;"
                        type="flat" 
                        size="small"
                        icon-pack="feather"
                        icon="icon-x"
                    ></vs-button>
                </div>
                
                <div class="config-body">
                    <!-- Opción: Permitir cargar todos los libros -->
                    <div class="config-option">
                        <div class="config-option-header">
                            <div class="config-option-info">
                                <feather-icon icon="BookOpenIcon" size="14" class="mr-2"></feather-icon>
                                <span class="config-option-title">Permitir cargar todos los libros</span>
                            </div>
                            <vs-switch 
                                v-model="config.permitirTodosLibros"
                                @input="actualizarConfig('permitirTodosLibros', $event)"
                                color="success"
                            >
                                <span slot="on">SI</span>
                                <span slot="off">NO</span>
                            </vs-switch>
                        </div>
                        <p class="config-option-description">
                            Permite agregar libros adicionales que no están en el pedido original
                        </p>
                        <div v-if="config.permitirTodosLibros" class="config-option-status active">
                            <feather-icon icon="CheckCircleIcon" size="14" class="mr-1"></feather-icon>
                            Función activada - Puede agregar libros extras
                        </div>
                        <div v-else class="config-option-status inactive">
                            <feather-icon icon="XCircleIcon" size="14" class="mr-1"></feather-icon>
                            Solo libros del pedido disponibles
                        </div>
                    </div>
                    
                    <!-- Opción: Permitir usar stock mínimo -->
                    <div class="config-option">
                        <div class="config-option-header">
                            <div class="config-option-info">
                                <feather-icon icon="AlertTriangleIcon" size="14" class="mr-2"></feather-icon>
                                <span class="config-option-title">Habilitar proformar con stock mínimo</span>
                            </div>
                            <vs-switch 
                                v-model="config.permitirUsarStockMinimo"
                                @input="actualizarConfig('permitirUsarStockMinimo', $event)"
                                color="danger"
                            >
                                <span slot="on">SI</span>
                                <span slot="off">NO</span>
                            </vs-switch>
                        </div>
                        <p class="config-option-description">
                            Permite usar el stock reservado como mínimo de seguridad (Stock mínimo: {{ stockMinimo }})
                        </p>
                        <div v-if="config.permitirUsarStockMinimo" class="config-option-status active-warning">
                            <feather-icon icon="AlertCircleIcon" size="14" class="mr-1"></feather-icon>
                            ⚠️ Puede usar stock del mínimo reservado
                        </div>
                        <div v-else class="config-option-status inactive">
                            <feather-icon icon="ShieldIcon" size="14" class="mr-1"></feather-icon>
                            Stock mínimo protegido
                        </div>
                    </div>
                    
                    <!-- Más opciones de configuración pueden ir aquí -->
                </div>
            </div>
        </transition>
        
        <!-- Overlay para cerrar el sidebar -->
        <div 
            v-if="visible" 
            class="config-overlay"
            @click="toggleSidebar"
        ></div>
    </div>
</template>

<script>
export default {
    name: 'ConfigProforma',
    props: {
        // Objeto de configuración
        config: {
            type: Object,
            required: true,
            default: () => ({
                permitirTodosLibros: false,
                permitirUsarStockMinimo: false
            })
        },
        // Stock mínimo
        stockMinimo: {
            type: Number,
            default: 0
        },
        // Mostrar el botón flotante
        mostrarBoton: {
            type: Boolean,
            default: true
        },
        // Visibilidad del sidebar (v-model)
        value: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            visible: this.value
        }
    },
    watch: {
        value(newVal) {
            this.visible = newVal;
        },
        visible(newVal) {
            this.$emit('input', newVal);
        }
    },
    methods: {
        toggleSidebar() {
            this.visible = !this.visible;
        },
        actualizarConfig(campo, valor) {
            // Emitir evento para actualizar la configuración en el padre
            this.$emit('update-config', { campo, valor });
        }
    }
}
</script>

<style scoped>
/* Botón flotante de configuración */
.config-toggle-btn {
    position: fixed;
    top: 100px;
    right: 20px;
    width: 48px;
    height: 48px;
    background: #c43c3c;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s ease;
    z-index: 51002;
}

.config-toggle-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.config-toggle-btn.config-btn-active {
    background: #f56565;
}

.config-toggle-btn .feather-icon {
    color: white;
}

.config-toggle-btn .rotating {
    animation: rotate 0.5s linear infinite;
}

@keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
}

.config-tooltip {
    position: absolute;
    right: 60px;
    background: rgba(0, 0, 0, 0.85);
    color: white;
    padding: 6px 10px;
    border-radius: 4px;
    font-size: 12px;
    white-space: nowrap;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.3s ease;
}

.config-toggle-btn:hover .config-tooltip {
    opacity: 1;
}

/* Panel lateral de configuración */
.config-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 360px;
    height: 100vh;
    background: white;
    box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);
    z-index: 51003;
    display: flex;
    flex-direction: column;
}

.config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 20px;
    border-bottom: 1px solid #e8e8e8a8;
    background: #858383;
    color: white;
    font-size: 13px;
    font-weight: 600;
}

.config-header h4 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: white;
}

.config-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px;
    background: #fafafa;
}

.config-option {
    background: white;
    border: 1px solid #e8e8e8;
    border-radius: 6px;
    padding: 14px;
    margin-bottom: 12px;
    transition: all 0.2s ease;
}

.config-option:hover {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.config-option-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.config-option-info {
    display: flex;
    align-items: center;
    flex: 1;
}

.config-option-title {
    font-weight: 600;
    font-size: 13px;
    color: #2c3e50;
}

.config-option-description {
    font-size: 12px;
    color: #606c76;
    margin: 6px 0;
    line-height: 1.5;
}

.config-option-status {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 500;
    margin-top: 8px;
}

.config-option-status.active {
    background: #e8f5e9;
    color: #2e7d32;
}

.config-option-status.active-warning {
    background: #fff3e0;
    color: #e65100;
}

.config-option-status.inactive {
    background: #f5f5f5;
    color: #757575;
}

/* Overlay */
.config-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    z-index: 51001;
}

/* Animación de slide */
.slide-config-enter-active,
.slide-config-leave-active {
    transition: transform 0.3s ease;
}

.slide-config-enter,
.slide-config-leave-to {
    transform: translateX(100%);
}

/* Utilidades */
.mt-6 { margin-top: 1.5rem; }
.p-3 { padding: 0.75rem; }
.bg-gray-100 { background-color: #fafafa; }
.rounded-lg { border-radius: 6px; }
.text-xs { font-size: 11px; }
.font-semibold { font-weight: 600; }
.mb-2 { margin-bottom: 0.5rem; }
.text-gray-700 { color: #2c3e50; }
.space-y-1 > * + * { margin-top: 0.25rem; }
.flex { display: flex; }
.items-center { align-items: center; }
.w-3 { width: 12px; }
.h-3 { height: 12px; }
.rounded-full { border-radius: 50%; }
.bg-green-500 { background-color: #48bb78; }
.bg-yellow-500 { background-color: #f6ad55; }
.bg-red-500 { background-color: #f56565; }
.bg-gray-700 { background-color: #4a5568; }
.mr-2 { margin-right: 0.5rem; }
.mr-1 { margin-right: 0.25rem; }
.text-gray-600 { color: #606c76; }
.text-gray-500 { color: #a0aec0; }
.italic { font-style: italic; }
.inline { display: inline; }
.headers-xd {
    display: flex;
    align-items: center;
    font-size: 13px;
    font-weight: 600;
}
</style>
