<template>
<div>
    <vs-tabs v-model="activeTab" color="primary" class="w-full">
        <!-- Pestaña de Visualización -->
        <vs-tab label="👁️ Visualizar Pagaré" v-if="verificar_creacion_edicion === 2">
            <visualizar-formato :formatoDatos="formatoActivo" :periodoSelect="periodoSelect" @change="handleVisualizarAct" @editar="activeTab = (verificar_creacion_edicion === 2 ? 1 : 0)" />
        </vs-tab>

        <!-- Pestaña de Edición / Creación -->
        <vs-tab :label="verificar_creacion_edicion === 2 ? '✏️ Editar Pagaré' : '✨ Nuevo Pagaré'">
            <registro-edicion-formato :formatoDatos="formatoActivo" :periodoSelect="periodoSelect" :verificar_creacion_edicion="verificar_creacion_edicion" @change="handleEditarAct" />
        </vs-tab>
    </vs-tabs>
</div>
</template>

<script>
const RegistroEdicionFormato = () => import('@/views/pedidos2/pedidos/gestion_pagare/formato/registro_edicion_formato.vue');
const VisualizarFormato = () => import('@/views/pedidos2/pedidos/gestion_pagare/formato/visualizar_formato.vue');

export default {
    components: {
        RegistroEdicionFormato,
        VisualizarFormato
    },
    props: {
        formatoDatos: {
            type: Object,
            default: () => null
        },
        periodoSelect: {
            type: Object,
            default: () => {}
        },
        verificar_creacion_edicion: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            activeTab: 0,
            formatoActivo: null,
        }
    },
    watch: {
        formatoDatos: {
            immediate: true,
            handler(newVal) {
                this.formatoActivo = newVal ? {
                    ...newVal
                } : null;
            }
        },
        verificar_creacion_edicion: {
            immediate: true,
            handler(newVal) {
                // Si es modo Creacion (1), solo hay 1 tab ("Nuevo Pagaré"), que es el índice 0.
                if (newVal === 1) {
                    this.activeTab = 0;
                } else if (newVal === 2) {
                    // Si es modo Edición (2), comenzamos en la pestaña visualizador (índice 0).
                    this.activeTab = 0;
                }
            }
        },
        activeTab() {
            // Fuerza a que al cambiar de pestaña el modal regrese al tope, evitando saltos del Quill Editor o Tabs
            setTimeout(() => {
                const popupContent = document.querySelector('.informacionformhijodehijo .vs-popup--content') || document.querySelector('.vs-popup--content');
                if (popupContent) popupContent.scrollTop = 0;
            }, 100);
        }
    },
    methods: {
        handleVisualizarAct(e) {
            if (e.verificaremit_regsitro_edicion === 2) {
                this.$emit('change', e); // Cancelar / Cerrar
            } else if (e.verificaremit_regsitro_edicion === 1) {
                this.$emit('change', e); // Acción guardada / actualizada
            }
        },
        handleEditarAct(e) {
            if (e.verificaremit_regsitro_edicion === 2) {
                // Canceló edición
                if (this.verificar_creacion_edicion === 2) {
                    this.activeTab = 0; // Hay un ID existente, regresarlo a la pestaña visualizador
                } else {
                    this.$emit('change', e); // Era nuevo, cerrar por completo
                }
            } else if (e.verificaremit_regsitro_edicion === 1) {
                // Se guardó exitosamente
                this.$emit('change', e); // Notificar a la lista general para que recargue
                // Nota: la acción de arriba cierra el popUp principal en ListaFormato.
            }
        }
    }
}
</script>

<style>
.gestion-pagare-tabs .vs-tabs--ul {
    margin-bottom: 0 !important;
    border-bottom: 1px solid #e0e0e0;
}

.theme-dark .gestion-pagare-tabs .vs-tabs--ul {
    border-bottom: 1px solid #414561;
}
</style>
