<template>
<div>
    <div class="flex flex-wrap">
        <!-- Buscar -->
        <vx-tooltip :text="!handlers.buscar ? 'No disponible' : 'Buscar registros'">
            <div class="btn-wrapper">
                <vs-button color="rgb(52, 152, 219)" class="btn-mantenimiento m-2" :disabled="!handlers.buscar || isEditMode" @click="handlers.buscar && $emit('buscar')">
                    Buscar
                    <i class="fa-solid fa-search ml-2"></i>
                </vs-button>
                <div v-if="!handlers.buscar" class="sin-api-badge">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
        </vx-tooltip>

        <!-- Nuevo -->
        <vx-tooltip :text="!handlers.nuevo ? 'No disponible' : 'Crear nuevo registro'">
            <div class="btn-wrapper">
                <vs-button color="primary" class="btn-mantenimiento m-2" :disabled="!handlers.nuevo || isEditMode" @click="handlers.nuevo && $emit('nuevo')">
                    Nuevo
                    <i class="fa-solid fa-plus ml-2"></i>
                </vs-button>
                <div v-if="!handlers.nuevo" class="sin-api-badge">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
        </vx-tooltip>

        <!-- Modificar -->
        <vx-tooltip :text="!handlers.modificar ? 'No disponible' : 'Modificar'">
            <div class="btn-wrapper">
                <vs-button color="warning" class="btn-mantenimiento m-2" :disabled="!handlers.modificar || isEditMode" @click="handlers.modificar && $emit('modificar')">
                    Modificar
                    <i class="fa-solid fa-pencil ml-2"></i>
                </vs-button>
                <div v-if="!handlers.modificar" class="sin-api-badge">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
        </vx-tooltip>

        <!-- Eliminar -->
        <vx-tooltip :text="!handlers.eliminar ? 'No disponible' : 'Eliminar'">
            <div class="btn-wrapper">
                <vs-button color="danger" class="btn-mantenimiento m-2" :disabled="!handlers.eliminar || isEditMode" @click="handlers.eliminar && $emit('eliminar')">
                    Eliminar
                    <i class="fa-solid fa-trash ml-2"></i>
                </vs-button>
                <div v-if="!handlers.eliminar" class="sin-api-badge">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
        </vx-tooltip>

        <!-- Guardar -->
        <vx-tooltip :text="!handlers.guardar ? 'No disponible' : 'Guardar cambios'">
            <div class="btn-wrapper">
                <vs-button
                    color="success"
                    class="btn-mantenimiento btn-guardar m-2"
                    :disabled="!handlers.guardar || !isEditMode"
                    @click="handlers.guardar && $emit('guardar')"
                >
                    Guardar
                    <i class="fa-solid fa-floppy-disk ml-2"></i>
                </vs-button>
                <div v-if="!handlers.guardar" class="sin-api-badge">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
        </vx-tooltip>

        <!-- Cancelar -->
        <vx-tooltip :text="!handlers.cancelar ? 'No disponible' : 'Cancelar operación'">
            <div class="btn-wrapper">
                <vs-button
                    color="rgb(108, 117, 125)"
                    class="btn-mantenimiento btn-cancelar m-2"
                    :disabled="!handlers.cancelar || !isEditMode"
                    @click="handlers.cancelar && $emit('cancelar')"
                >
                    Cancelar
                    <i class="fa-solid fa-x ml-2"></i>
                </vs-button>
                <div v-if="!handlers.cancelar" class="sin-api-badge">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
        </vx-tooltip>

        <!-- Actualizar -->
        <vx-tooltip :text="!handlers.actualizar ? 'No disponible' : 'Actualizar'">
            <div class="btn-wrapper">
                <vs-button color="rgb(155, 89, 182)" class="btn-mantenimiento m-2" :disabled="!handlers.actualizar || isEditMode" @click="handlers.actualizar && $emit('actualizar')">
                    Actualizar
                    <i class="fa-solid fa-arrows-rotate"></i>
                </vs-button>
                <div v-if="!handlers.actualizar" class="sin-api-badge">
                    <i class="fa-solid fa-xmark"></i>
                </div>
            </div>
        </vx-tooltip>
    </div>
</div>
</template>

<script>
export default {
    name: 'BotoneraProductos',
    props: {
        // Objeto que indica qué handlers están disponibles
        handlers: {
            type: Object,
            default: () => ({
                buscar: true,
                nuevo: true,
                modificar: true,
                eliminar: true,
                guardar: true,
                cancelar: true,
                actualizar: true
            })
        },
        // Indica si estamos en modo edición
        isEditMode: {
            type: Boolean,
            default: false
        }
    },
    emits: ['buscar', 'nuevo', 'modificar', 'eliminar', 'guardar', 'cancelar', 'actualizar']
}
</script>

<style lang="scss" scoped>
.btn-wrapper {
    position: relative;
    display: inline-block;
}

.btn-mantenimiento {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    transition: none !important; // Sin transiciones para cambios instantáneos

    &:disabled {
        opacity: 0.95 !important;
        cursor: not-allowed !important;
        background: #e5e7eb !important;
        color: #9ca3af !important;
        border-color: #d1d5db !important;
        transition: none !important;

        &:hover {
            transform: none !important;
            box-shadow: none !important;
        }
    }

    &:not(:disabled) {
        transition: box-shadow 0.15s ease, transform 0.15s ease !important;
    }
}

/* Estilos específicos para botón Guardar cuando está habilitado */
.btn-guardar {
    &:not(:disabled) {
        background: linear-gradient(135deg, #10b981 0%, #059669 100%) !important;
        box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);

        &:hover {
            box-shadow: 0 4px 8px rgba(16, 185, 129, 0.4);
            transform: translateY(-1px);
        }
    }
}

/* Estilos específicos para botón Cancelar cuando está habilitado */
.btn-cancelar {
    &:not(:disabled) {
        background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%) !important;
        box-shadow: 0 2px 4px rgba(107, 114, 128, 0.3);

        &:hover {
            box-shadow: 0 4px 8px rgba(107, 114, 128, 0.4);
            transform: translateY(-1px);
        }
    }
}

.sin-api-badge {
    position: absolute;
    top: -6px;
    right: -6px;
    width: 18px;
    height: 18px;
    background: #ff4757;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 10;

    i {
        color: white;
        font-size: 10px;
        font-weight: bold;
    }
}
</style>
