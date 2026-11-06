<template>
    <transition name="slide-fade">
        <div v-if="mostrar"
             class="ambiente-indicator"
             :class="tipoAmbiente === 'produccion' ? 'ambiente-produccion' : 'ambiente-local'">
            <div class="ambiente-content">
                <div class="ambiente-icon">
                    <i :class="tipoAmbiente === 'produccion' ? 'fa fa-cloud' : 'fa fa-desktop'"></i>
                </div>
                <div class="ambiente-info">
                    <span class="empresa-nombre">{{ empresaNombre }}</span>
                </div>
                <div class="ambiente-badge" :class="tipoAmbiente">
                    Ambiente: {{ tipoAmbiente === 'produccion' ? 'Producción' : 'Pruebas' }}
                </div>
            </div>
        </div>
    </transition>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'EmpresaAmbienteIndicator',
    computed: {
        ...mapState(['empresaAmbiente']),
        mostrar() {
            return this.empresaAmbiente && this.empresaAmbiente.visible ? this.empresaAmbiente.visible : false;
        },
        empresaNombre() {
            return this.empresaAmbiente && this.empresaAmbiente.empresaNombre ? this.empresaAmbiente.empresaNombre : 'Empresa';
        },
        tipoAmbiente() {
            return this.empresaAmbiente && this.empresaAmbiente.tipo ? this.empresaAmbiente.tipo : 'local';
        }
    },
    watch: {
        'empresaAmbiente.visible'(newVal) {
            if (newVal) {
                // Auto-ocultar después de 8 segundos
                setTimeout(() => {
                    if (this.$store.commit) {
                        this.$store.commit('OCULTAR_AMBIENTE_EMPRESA');
                    }
                }, 10000);
            }
        }
    }
}
</script>

<style scoped>
.ambiente-indicator {
    position: fixed;
    top: 80px;
    right: 20px;
    z-index: 99999;
    padding: 12px 20px;
    border-radius: 10px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    min-width: 220px;
    backdrop-filter: blur(10px);
}

.ambiente-produccion {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    border-left: 4px solid #155724;
}

.ambiente-local {
    background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%);
    border-left: 4px solid #856404;
}

.ambiente-content {
    display: flex;
    align-items: center;
    gap: 12px;
}

.ambiente-icon {
    font-size: 24px;
    color: white;
}

.ambiente-info {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.empresa-nombre {
    font-weight: bold;
    color: white;
    font-size: 14px;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.ambiente-tipo {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.9);
}

.ambiente-badge {
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.ambiente-badge.produccion {
    background: rgba(255, 255, 255, 0.3);
    color: white;
}

.ambiente-badge.local {
    background: rgba(0, 0, 0, 0.2);
    color: white;
}

/* Animaciones */
.slide-fade-enter-active {
    transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
    transition: all 0.3s ease-in;
}

.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateX(100%);
    opacity: 0;
}

@media (max-width: 768px) {
    .ambiente-indicator {
        top: auto;
        bottom: 20px;
        right: 10px;
        left: 10px;
        min-width: auto;
    }
}
</style>
