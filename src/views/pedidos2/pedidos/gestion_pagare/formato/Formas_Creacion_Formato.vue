<template>
<div class="formas-creacion-container">
    <!-- Título -->
    <div class="selection-view">
        <div class="selection-content">
            <div class="text-center mb-8">
                <h3 class="text-2xl font-bold mb-2" :class="themeMode ? 'text-white' : 'text-gray-800'">
                    ¿Cómo deseas crear el formato?
                </h3>
                <p :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                    Selecciona la mejor opción para el periodo <strong>{{ periodoSelect.periodoescolar }}</strong>
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
                <!-- Opción 1: Crear en Blanco -->
                <div @click="crearEnBlanco()" class="option-card group" :class="{'is-dark': themeMode}">
                    <div class="card-content">
                        <div class="icon-wrapper blue">
                            <i class="feather icon-file-plus"></i>
                        </div>
                        <div class="text-content">
                            <h4 :class="themeMode ? 'text-white' : 'text-gray-800'">
                                Formato en Blanco
                            </h4>
                            <p :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                                Comienza desde cero escribiendo el contenido del pagaré manualmente.
                            </p>
                        </div>
                        <div class="card-action blue">
                            <span>Empezar</span>
                            <i class="feather icon-arrow-right"></i>
                        </div>
                    </div>
                </div>

                <!-- Opción 2: Copiar del Mismo o de Otro Periodo -->
                <div @click="copiarDePeriodo()" class="option-card group" :class="{'is-dark': themeMode}">
                    <div class="card-content">
                        <div class="icon-wrapper purple">
                            <i class="feather icon-copy"></i>
                        </div>
                        <div class="text-content">
                            <h4 :class="themeMode ? 'text-white' : 'text-gray-800'">
                                Copiar del Mismo o de Otro Periodo
                            </h4>
                            <p :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                                Usa formatos ya existentes en el mismo o en otro periodo como base.
                            </p>
                        </div>
                        <div class="card-action purple">
                            <span>Seleccionar</span>
                            <i class="feather icon-arrow-right"></i>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script>
export default {
    props: {
        periodoSelect: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        }
    },
    methods: {
        crearEnBlanco() {
            this.$emit('change', {
                tipo: 'crear_vacio'
            });
        },
        copiarDePeriodo() {
            this.$emit('change', {
                tipo: 'copiar_periodo'
            });
        }
    }
};
</script>

<style scoped>
.formas-creacion-container {
    height: 100%;
    min-height: 55vh;
    display: flex;
    flex-direction: column;
}

.selection-view {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    animation: fadeIn 0.45s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.selection-content {
    width: 100%;
    max-width: 900px;
}

/* ─── Cards ──────────────────────────────────────────── */
.option-card {
    background: white;
    border-radius: 16px;
    padding: 2.5rem 2rem;
    cursor: pointer;
    border: 1px solid #e2e8f0;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.02);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    overflow: hidden;
    height: 100%;
}

.option-card:hover {
    transform: translateY(-8px);
    border-color: #cbd5e0;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.option-card.is-dark {
    background: #10163A;
    border-color: #2d3748;
}

.option-card.is-dark:hover {
    border-color: #4a5568;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.35);
}

.card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
}

/* ─── Icon ───────────────────────────────────────────── */
.icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    margin-bottom: 24px;
    transition: transform 0.3s ease;
}

.option-card:hover .icon-wrapper {
    transform: scale(1.1) rotate(5deg);
}

.icon-wrapper.blue {
    background: linear-gradient(135deg, #ebf4ff 0%, #c3dafe 100%);
    color: #4299e1;
}

.icon-wrapper.purple {
    background: linear-gradient(135deg, #faf5ff 0%, #e9d8fd 100%);
    color: #9f7aea;
}

.option-card.is-dark .icon-wrapper.blue {
    background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
    color: #63b3ed;
}

.option-card.is-dark .icon-wrapper.purple {
    background: linear-gradient(135deg, #553c9a 0%, #44337a 100%);
    color: #b794f4;
}

/* ─── Text ───────────────────────────────────────────── */
.text-content {
    flex: 1;
    margin-bottom: 24px;
}

.text-content h4 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 12px;
}

/* ─── Action Button ──────────────────────────────────── */
.card-action {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-weight: 600;
    font-size: 0.95rem;
    padding: 10px 20px;
    border-radius: 50px;
    transition: all 0.3s ease;
    background-color: transparent;
}

.option-card:hover .card-action.blue {
    background-color: #ebf8ff;
    color: #3182ce;
}

.option-card:hover .card-action.purple {
    background-color: #faf5ff;
    color: #805ad5;
}

.option-card.is-dark:hover .card-action.blue {
    background-color: rgba(66, 153, 225, 0.15);
    color: #63b3ed;
}

.option-card.is-dark:hover .card-action.purple {
    background-color: rgba(159, 122, 234, 0.15);
    color: #b794f4;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
