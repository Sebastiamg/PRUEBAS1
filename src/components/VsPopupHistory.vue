<template>
    <vs-popup
        v-bind="$attrs"
        v-on="popupListeners"
        :active.sync="internalActive"
    >
        <slot />
    </vs-popup>
</template>

<script>
/**
 * VsPopupHistory - Componente wrapper de vs-popup con manejo automático del historial del navegador
 * 
 * Uso con active.sync (Vuesax estándar):
 *   <vs-popup-history :active.sync="popup" title="Mi Popup">
 *     Contenido del popup
 *   </vs-popup-history>
 * 
 * Uso con v-model:
 *   <vs-popup-history v-model="popup" title="Mi Popup">
 *     Contenido del popup
 *   </vs-popup-history>
 * 
 * Props opcionales:
 *   :history-control="false"  - Desactiva el control del historial (por defecto true)
 *   :confirm-close="true"     - Muestra confirmación antes de cerrar (por defecto false)
 *   confirm-message="..."     - Mensaje personalizado para la confirmación
 */
export default {
    name: 'VsPopupHistory',
    inheritAttrs: false,
    props: {
        // Soporte para :active.sync (estándar de Vuesax)
        active: {
            type: Boolean,
            default: undefined
        },
        // Soporte para v-model
        value: {
            type: Boolean,
            default: undefined
        },
        // Control automático del historial del navegador
        historyControl: {
            type: Boolean,
            default: true // Siempre activo por defecto
        },
        // Mostrar confirmación antes de cerrar
        confirmClose: {
            type: Boolean,
            default: false
        },
        // Mensaje de confirmación personalizado
        confirmMessage: {
            type: String,
            default: '¿Estás seguro de cerrar este popup? Los cambios no guardados se perderán.'
        }
    },
    data() {
        return {
            internalActive: this.active !== undefined ? this.active : this.value,
            historyStateAdded: false
        }
    },
    computed: {
        popupListeners() {
            // Pasar todos los listeners menos los que manejamos nosotros
            const { input, 'update:active': updateActive, ...listeners } = this.$listeners;
            return listeners;
        }
    },
    watch: {
        // Watch para :active.sync
        active(newVal) {
            if (newVal !== undefined) {
                this.internalActive = newVal;
                this.handleActiveChange(newVal);
            }
        },
        // Watch para v-model
        value(newVal) {
            if (newVal !== undefined && this.active === undefined) {
                this.internalActive = newVal;
                this.handleActiveChange(newVal);
            }
        },
        internalActive(newVal) {
            // Emitir cambios para ambos métodos
            if (this.active !== undefined) {
                this.$emit('update:active', newVal);
            }
            if (this.value !== undefined) {
                this.$emit('input', newVal);
            }
        }
    },
    mounted() {
        if (this.historyControl) {
            window.addEventListener('popstate', this.handleBackButton);
        }
    },
    beforeDestroy() {
        if (this.historyControl) {
            window.removeEventListener('popstate', this.handleBackButton);
            this.removeFromHistory();
        }
    },
    methods: {
        handleActiveChange(newVal) {
            if (newVal && this.historyControl) {
                this.addToHistory();
            } else if (!newVal && this.historyControl) {
                this.removeFromHistory();
            }
        },
        
        addToHistory() {
            if (!this.historyStateAdded) {
                window.history.pushState({ popup: true }, '');
                this.historyStateAdded = true;
                console.log('📌 VsPopupHistory: Estado agregado al historial');
            }
        },
        
        removeFromHistory() {
            if (this.historyStateAdded) {
                // Solo hacer back si el estado actual es nuestro popup
                if (window.history.state && window.history.state.popup) {
                    window.history.back();
                }
                this.historyStateAdded = false;
                console.log('🔙 VsPopupHistory: Estado removido del historial');
            }
        },
        
        handleBackButton(event) {
            // Si el popup está abierto y se presiona el botón atrás
            if (this.internalActive) {
                console.log('⬅️ VsPopupHistory: Botón atrás detectado');
                
                // Si está configurado para confirmar
                if (this.confirmClose) {
                    const confirmed = confirm(this.confirmMessage);
                    
                    if (confirmed) {
                        this.closePopup();
                    } else {
                        // Reestablecer el estado si el usuario cancela
                        this.addToHistory();
                    }
                } else {
                    // Cerrar sin confirmar
                    this.closePopup();
                }
            }
        },
        
        closePopup() {
            this.historyStateAdded = false; // Prevenir doble back
            this.internalActive = false;
            
            // Emitir para ambos métodos
            if (this.active !== undefined) {
                this.$emit('update:active', false);
            }
            if (this.value !== undefined) {
                this.$emit('input', false);
            }
            this.$emit('close');
        }
    }
}
</script>

<style scoped>
/* Heredar estilos de vs-popup */
</style>
