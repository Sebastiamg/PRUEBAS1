<template>
<div class="formas-creacion-container">
    <!-- VISTA PRINCIPAL: SELECCIÓN DE MÉTODO -->
    <div v-if="vistaActual === 'seleccion'" class="selection-view">
        <div class="selection-content">
            <div class="text-center mb-8">
                <h3 class="text-2xl font-bold mb-2" :class="themeMode ? 'text-white' : 'text-gray-800'">
                    ¿Cómo deseas empezar?
                </h3>
                <p :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                    Selecciona la mejor opción para crear tu Fichero de Mercado
                </p>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mx-auto">
                <!-- Opción 1: Crear en Blanco -->
                <div @click="crearEnBlanco()" class="option-card group" :class="{'is-dark': themeMode}">
                    <div class="card-content">
                        <div class="icon-wrapper blue">
                            <ion-icon name="document-text-outline"></ion-icon>
                        </div>
                        <div class="text-content">
                            <h4 :class="themeMode ? 'text-white' : 'text-gray-800'">
                                Fichero en Blanco
                            </h4>
                            <p :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                                Comienza desde cero ingresando toda la información manualmente.
                            </p>
                        </div>
                        <div class="card-action blue">
                            <span>Empezar</span>
                            <ion-icon name="arrow-forward"></ion-icon>
                        </div>
                    </div>
                </div>
                <!-- Opción 2: Usar otro periodo -->
                <div @click="verListaFicheros()" class="option-card group" :class="{'is-dark': themeMode}">
                    <div class="card-content">
                        <div class="icon-wrapper purple">
                            <ion-icon name="copy-outline"></ion-icon>
                        </div>
                        <div class="text-content">
                            <h4 :class="themeMode ? 'text-white' : 'text-gray-800'">
                                Copiar de Otro Periodo
                            </h4>
                            <p :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                                Usa la información de otro periodo como base.
                            </p>
                        </div>
                        <div class="card-action purple">
                            <span>Seleccionar</span>
                            <ion-icon name="arrow-forward"></ion-icon>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- VISTA SECUNDARIA: WIZARD DE COPIADO -->
    <div v-else-if="vistaActual === 'wizard_copia'" class="w-full h-full wizard-container">
        <!-- Header con botón de volver al menú -->
        <div class="wizard-header">
            <vs-button @click="vistaActual = 'seleccion'" type="border" color="dark" icon="arrow_back" class="volver-menu-btn">
                Volver al menú de creación
            </vs-button>
        </div>
        <form-wizard ref="wizardRef" color="rgba(var(--vs-primary), 1)" :title="null" :subtitle="null" nextButtonText="Siguiente" backButtonText="Atrás" finishButtonText="Finalizar y Copiar" @on-complete="onWizardComplete">
            <!-- PASO 1: SELECCIONAR PERIODO -->
            <tab-content title="1. Seleccionar Periodo" icon="feather icon-calendar" :before-change="validarSeleccionFichero">
                <div class="flex flex-col items-center">
                    <h4 class="text-lg font-semibold mb-4" :class="themeMode ? 'text-gray-100' : 'text-gray-700'">
                        Elige el periodo del fichero del cual quieres copiar la información
                    </h4>
                    <!-- BARRA DE BÚSQUEDA -->
                    <div v-if="!loading && listaFicheros.length > 0" class="w-full max-w-4xl mb-4">
                        <div class="search-container" :class="themeMode ? 'dark' : ''">
                            <ion-icon name="search-outline" class="search-icon"></ion-icon>
                            <input v-model="searchQuery" type="text" placeholder="Buscar por periodo o estado..." class="search-input" :class="themeMode ? 'dark' : ''" />
                            <button v-if="searchQuery" @click="searchQuery = ''" class="clear-search">
                                <ion-icon name="close-circle"></ion-icon>
                            </button>
                        </div>
                    </div>
                    <div v-if="loading" class="flex justify-center p-10">
                        <vs-progress indeterminate color="primary"></vs-progress>
                    </div>
                    <div v-else-if="listaFicheros.length === 0" class="text-center p-8 border rounded-lg border-dashed w-full" :class="themeMode ? 'border-gray-600' : 'border-gray-300'">
                        <ion-icon name="folder-open-outline" class="text-4xl text-gray-400 mb-2"></ion-icon>
                        <p :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
                          No se encontraron ficheros en otros periodos disponibles.
                          <br>
                          <span class="font-semibold">Regresa al menú de creación y selecciona "Fichero en Blanco".</span>
                        </p>
                    </div>
                    <div v-else-if="ficherosFiltrados.length === 0" class="text-center p-8 border rounded-lg border-dashed w-full" :class="themeMode ? 'border-gray-600' : 'border-gray-300'">
                        <ion-icon name="search-outline" class="text-4xl text-gray-400 mb-2"></ion-icon>
                        <p :class="themeMode ? 'text-gray-300' : 'text-gray-600'">No se encontraron ficheros que coincidan con "{{ searchQuery }}"</p>
                    </div>
                    <div v-else class="w-full max-w-4xl">
                        <div class="grid grid-cols-1 gap-4 max-h-[45vh] overflow-y-auto custom-scroll p-2">
                            <div v-for="(fichero, index) in ficherosPaginados" :key="index" @click="seleccionarFichero(fichero)" class="group relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200" :class="[
                                    themeMode ? 'bg-gray-800 hover:bg-gray-750' : 'bg-white hover:bg-blue-50',
                                    ficheroSeleccionadoWizard && ficheroSeleccionadoWizard.fm_id === fichero.fm_id
                                        ? 'border-primary shadow-lg scale-[1.01] z-10'
                                        : (themeMode ? 'border-gray-700 hover:border-gray-500' : 'border-gray-200 hover:border-blue-300 hover:shadow-md')
                                  ]">
                                <div class="flex justify-between items-center w-full">
                                    <div class="flex items-center space-x-4">
                                        <div class="p-3 rounded-full transition-colors duration-300 flex items-center justify-center shrink-0 w-12 h-12" :class="ficheroSeleccionadoWizard && ficheroSeleccionadoWizard.fm_id === fichero.fm_id
                                                ? 'bg-primary text-white shadow-primary/30 shadow-md'
                                                : (themeMode ? 'bg-gray-700 text-gray-400 group-hover:bg-gray-600' : 'bg-gray-100 text-gray-500 group-hover:bg-white group-hover:text-primary')">
                                            <ion-icon :name="ficheroSeleccionadoWizard && ficheroSeleccionadoWizard.fm_id === fichero.fm_id ? 'checkmark-sharp' : 'calendar-number-outline'" class="text-2xl"></ion-icon>
                                        </div>
                                        <div class="flex flex-col">
                                            <p class="font-bold text-lg leading-tight transition-colors duration-200" :class="[
                                                themeMode ? 'text-gray-100' : 'text-gray-800',
                                                ficheroSeleccionadoWizard && ficheroSeleccionadoWizard.fm_id === fichero.fm_id ? 'text-primary' : ''
                                            ]">
                                                Periodo: {{ fichero.descripcion_periodoescolar }}
                                            </p>
                                            <div class="flex items-center mt-2 space-x-2">
                                                <span class="text-xs uppercase font-semibold text-gray-400 tracking-wider">Estado Fichero:</span>
                                                <span :class="getEstadoClass(fichero.fm_estado)" class="transform scale-90 origin-left">
                                                    {{ getEstadoLabel(fichero.fm_estado) }}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <!-- Right Indicator -->
                                    <div class="pr-2">
                                        <div v-if="ficheroSeleccionadoWizard && ficheroSeleccionadoWizard.fm_id === fichero.fm_id" class="text-primary flex items-center animate-in fade-in zoom-in duration-300">
                                            <span class="text-sm font-bold mr-2 hidden sm:inline-block">Seleccionado</span>
                                            <!-- <ion-icon name="checkbox" class="text-3xl"></ion-icon> -->
                                        </div>
                                        <div v-else class="text-gray-300 group-hover:text-primary transition-colors duration-200">
                                            <ion-icon name="radio-button-off" class="text-3xl group-hover:scale-110 transition-transform duration-200"></ion-icon>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- PAGINACIÓN -->
                        <div v-if="totalPages > 1" class="pagination-container" :class="themeMode ? 'dark' : ''">
                            <button @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1" class="pagination-btn" :class="{'disabled': paginaActual === 1}">
                                <ion-icon name="chevron-back"></ion-icon>
                            </button>
                            <div class="pagination-info">
                                <span class="page-numbers">Página {{ paginaActual }} de {{ totalPages }}</span>
                                <span class="separator">|</span>
                                <span class="item-count">{{ ficherosFiltrados.length }} fichero{{ ficherosFiltrados.length !== 1 ? 's' : '' }}</span>
                            </div>
                            <button @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPages" class="pagination-btn" :class="{'disabled': paginaActual === totalPages}">
                                <ion-icon name="chevron-forward"></ion-icon>
                            </button>
                        </div>
                    </div>
                </div>
            </tab-content>
            <!-- PASO 2: SELECCIONAR SECCIONES -->
            <tab-content title="2. Personalizar Copia" icon="feather icon-check-square">
                <!-- Botones de navegación superiores del wizard -->
                <div class="wizard-nav-top">
                    <vs-button @click="volverAtras" type="border" color="primary" icon="arrow_back" size="small">
                        Volver al paso anterior
                    </vs-button>
                </div>
                <div class="flex flex-col items-center w-full">
                    <div class="w-full" v-if="visualizarFicheroReady && ficheroSeleccionadoWizard">
                        <!-- Componente visualizador en modo wizard -->
                        <Visualizar_FicheroMercado :periodoSeleccionado="{idperiodoescolar: ficheroSeleccionadoWizard.idperiodoescolar, descripcion_periodoescolar: ficheroSeleccionadoWizard.descripcion_periodoescolar}" :institucion_Enviar="ficheroSeleccionadoWizard" :Fichero_Array="[ficheroSeleccionadoWizard]" :wizardMode="true" @update:seleccion="actualizarSeleccionWizard" />
                    </div>
                </div>
                <!-- Botones de navegación inferiores del wizard (ya existentes por defecto) -->
            </tab-content>
        </form-wizard>
    </div>
</div>
</template>

<script>
import {
    FormWizard,
    TabContent
} from 'vue-form-wizard'
import 'vue-form-wizard/dist/vue-form-wizard.min.css'
const Visualizar_FicheroMercado = () => import('@/views/pedidos2/fichero_mercado/Visualizar_Fichero_Para_Copiar.vue');

export default {
    components: {
        Visualizar_FicheroMercado,
        FormWizard,
        TabContent
    },
    props: {
        institucion_Enviar: {
            type: Object,
            required: true
        },
        periodoSeleccionado: {
            type: Object,
            required: true
        }
    },
    data() {
        return {
            vistaActual: 'seleccion', // 'seleccion' | 'wizard_copia'
            loading: false,
            copiando: false,
            listaFicheros: [],
            popupFicheroMercadoVisualizar: false, // Ya no se usa para esto, pero dejaré por compatibilidad si es necesario
            institucionSeleccionada: {},
            Fichero_Array: [],
            PeriodoxInstitucion: 0,
            // Estados para Wizard
            ficheroSeleccionadoWizard: null,
            visualizarFicheroReady: false,
            seccionesSeleccionadas: {
                factores: false,
                personal: false,
                aulas: false,
                editoriales: false,
                observacion: false,
                datos_comerciales: false
            },
            // Búsqueda y paginación
            searchQuery: '',
            paginaActual: 1,
            ficherosPorPagina: 10
        };
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        ficherosFiltrados() {
            if (!this.searchQuery) {
                return this.listaFicheros;
            }
            const query = this.searchQuery.toLowerCase();
            return this.listaFicheros.filter(fichero => {
                const periodo = fichero.descripcion_periodoescolar ? fichero.descripcion_periodoescolar.toLowerCase() : '';
                const estado = this.getEstadoLabel(fichero.fm_estado).toLowerCase();
                return periodo.includes(query) || estado.includes(query);
            });
        },
        ficherosPaginados() {
            const inicio = (this.paginaActual - 1) * this.ficherosPorPagina;
            const fin = inicio + this.ficherosPorPagina;
            return this.ficherosFiltrados.slice(inicio, fin);
        },
        totalPages() {
            return Math.ceil(this.ficherosFiltrados.length / this.ficherosPorPagina);
        }
    },
    watch: {
        searchQuery() {
            // Reset página al buscar
            this.paginaActual = 1;
        }
    },
    mounted() {},
    methods: {
        crearEnBlanco() {
            this.$emit('change', {
                tipo: 'crear_vacio'
            });
        },
        async verListaFicheros() {
            this.$vs.loading();
            this.vistaActual = 'wizard_copia';
            // EJEMPLO: Si se quisiera manejar 'wizard_copia' como un estado de historial, se podría adaptar,
            // pero el mixin funciona con variables booleanas.
            // this.popupFicheroMercadoVisualizar = true; // Si se usara esto para mostrar el wizard

            this.ficheroSeleccionadoWizard = null;
            this.loading = true;
            this.listaFicheros = [];
            this.searchQuery = '';
            this.paginaActual = 1;
            try {
                // Llamada a API para obtener ficheros de la institución (historial)
                // Se asume la existencia de este endpoint o similar.
                let response = await this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                    params: {
                        action: 'Listar_Ficheros_Por_Institucion', // Confirmar action
                        idInstitucion: this.institucion_Enviar.idInstitucion
                    }
                });
                if (response.data) {
                    // Filtrar el periodo actual si es necesario, para no copiar del mismo (opcional)
                    this.listaFicheros = response.data.filter(f => f.idperiodoescolar !== this.periodoSeleccionado.idperiodoescolar);
                }
            } catch (error) {
                console.error('Error al cargar ficheros:', error);
                this.$vs.notify({
                    title: 'Error',
                    text: 'No se pudieron cargar los ficheros anteriores.',
                    color: 'danger',
                    icon: 'error'
                });
            } finally {
                this.loading = false;
                this.$vs.loading.close();
            }
        },
        // Métodos del Wizard
        seleccionarFichero(fichero) {
            this.ficheroSeleccionadoWizard = fichero;
            this.visualizarFicheroReady = false;
        },
        validarSeleccionFichero() {
            if (!this.ficheroSeleccionadoWizard) {
                this.$vs.notify({
                    title: 'Atención',
                    text: 'Debe seleccionar un periodo para continuar.',
                    color: 'warning',
                    icon: 'warning',
                    time: 6000
                });
                return false;
            }
            this.visualizarFicheroReady = true;
            return true;
        },
        actualizarSeleccionWizard(seleccion) {
            this.seccionesSeleccionadas = seleccion;
        },
        onWizardComplete() {
            if (!this.ficheroSeleccionadoWizard) return;

            // VALIDACIÓN: Verificar que al menos una sección esté seleccionada
            const algunaSeccionSeleccionada = Object.values(this.seccionesSeleccionadas).some(valor => valor === true);

            if (!algunaSeccionSeleccionada) {
                this.$vs.notify({
                    title: 'Selección requerida',
                    text: 'Debe seleccionar al menos una sección para copiar.',
                    color: 'warning',
                    icon: 'warning',
                    time: 6000
                });
                return;
            }
            // Usar la lógica de copiado existente pero adaptada
            this.procesarCopiadoWizard();
        },
        async procesarCopiadoWizard() {
            let me = this;
            me.copiando = true;
            me.$vs.loading();

            let data_Guardado = {
                action: 'Copiar_Informacion_Fichero_Nuevo',
                idFicheroOrigen: me.ficheroSeleccionadoWizard.fm_id,
                idPeriodoOrigen: me.ficheroSeleccionadoWizard.idperiodoescolar,
                idPeriodoDestino: me.periodoSeleccionado.idperiodoescolar,
                idInstitucion: me.institucion_Enviar.idInstitucion,
                user_created: JSON.parse(localStorage.getItem("usuario")).idusuario,
                secciones_a_copiar: me.seccionesSeleccionadas
            };

            console.log(data_Guardado, "test data a aenviar");
            // return;

            me.$http.post(me.$server_url + 'Procesar_MetodosPost_Fichero_MercadoController', data_Guardado)
                .then(response => {
                    if (response.data.status == 1) {
                        me.$vs.loading.close();
                        me.$vs.notify({
                            title: 'Éxito',
                            text: 'Fichero creado exitosamente.',
                            color: 'success',
                            icon: 'check_circle',
                            time: 4000
                        });
                        me.$emit('change', {
                            tipo: 'fichero_copiado'
                        });
                    } else {
                        me.$vs.loading.close();
                        me.$vs.notify({
                            title: 'Error',
                            text: response.data.message || 'No se pudo copiar.',
                            color: 'danger',
                            icon: 'error'
                        });
                    }
                })
                .catch(error => {
                    me.$vs.loading.close();
                    console.error('Error al copiar:', error);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Ocurrió un error al procesar la solicitud.',
                        color: 'danger',
                        icon: 'error'
                    });
                })
                .finally(() => {
                    me.copiando = false;
                });
        },
        // Métodos de paginación
        cambiarPagina(nuevaPagina) {
            if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
                this.paginaActual = nuevaPagina;
            }
        },
        volverAtras() {
            if (this.$refs.wizardRef) {
                this.$refs.wizardRef.prevTab();
            }
        },
        // Legacy/Unused methods removal or keep if needed elsewhere
        abrirSelectorCopia(fichero) {
            // Ya no se usa en wizard
        },
        getEstadoLabel(estado) {
            const estados = {
                1: 'Creado/Activo',
                2: 'Enviado para aprobación',
                3: 'Aprobado',
                4: 'Devuelto',
                0: 'Inactivo'
            };
            return estados[estado] || 'Desconocido';
        },
        getEstadoClass(estado) {
            const classes = {
                '1': 'chip chip-primary',
                '2': 'chip chip-warning',
                '3': 'chip chip-success',
                '4': 'chip chip-danger',
                '0': 'chip chip-dark'
            };
            return classes[String(estado)] || 'chip chip-dark'; // Convertir a string para asegurar match
        }
    }
};
</script>

<style scoped>
.informacionformhijo {
    z-index: 51002;
}

/* WIZARD CONTAINER */
.wizard-container {
    display: flex;
    flex-direction: column;
    height: 100%;
}

.wizard-header {
    padding: 1rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    background: white;
}

.dark .wizard-header {
    background: #10163A;
    border-bottom-color: #2d3748;
}

.volver-menu-btn {
    font-size: 0.95rem !important;
}

/* WIZARD NAVIGATION TOP */
.wizard-nav-top {
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 2px solid #e2e8f0;
}

.dark .wizard-nav-top {
    border-bottom-color: #2d3748;
}

/* SEARCH CONTAINER */
.search-container {
    position: relative;
    display: flex;
    align-items: center;
    background: white;
    border: 2px solid #e2e8f0;
    border-radius: 12px;
    padding: 0.75rem 1rem;
    transition: all 0.3s ease;
}

.search-container:focus-within {
    border-color: rgba(var(--vs-primary), 1);
    box-shadow: 0 0 0 3px rgba(var(--vs-primary), 0.1);
}

.search-container.dark {
    background: #1a1f3a;
    border-color: #2d3748;
}

.search-container.dark:focus-within {
    border-color: rgba(var(--vs-primary), 1);
    box-shadow: 0 0 0 3px rgba(var(--vs-primary), 0.2);
}

.search-icon {
    font-size: 1.5rem;
    color: #a0aec0;
    margin-right: 0.75rem;
    flex-shrink: 0;
}

.search-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    font-size: 1rem;
    color: #2d3748;
    padding: 0;
}

.search-input.dark {
    color: #e2e8f0;
}

.search-input::placeholder {
    color: #a0aec0;
}

.clear-search {
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #a0aec0;
    transition: color 0.2s ease;
    font-size: 1.5rem;
}

.clear-search:hover {
    color: #4a5568;
}

.dark .clear-search:hover {
    color: #cbd5e0;
}

/* PAGINATION CONTAINER */
.pagination-container {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    margin-top: 1.5rem;
    padding: 1rem;
    background: white;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
}

.pagination-container.dark {
    background: #1a1f3a;
    border-color: #2d3748;
}

.pagination-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border: 2px solid rgba(var(--vs-primary), 1);
    background: rgba(var(--vs-primary), 0.1);
    color: rgba(var(--vs-primary), 1);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 1.25rem;
}

.pagination-btn:hover:not(.disabled) {
    background: rgba(var(--vs-primary), 1);
    color: white;
    transform: scale(1.05);
}

.pagination-btn.disabled {
    opacity: 0.3;
    cursor: not-allowed;
    border-color: #cbd5e0;
    background: #f7fafc;
    color: #a0aec0;
}

.pagination-container.dark .pagination-btn.disabled {
    border-color: #4a5568;
    background: #2d3748;
    color: #718096;
}

.pagination-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    font-size: 0.95rem;
    color: #4a5568;
}

.dark .pagination-info {
    color: #cbd5e0;
}

.page-numbers {
    font-weight: 600;
    color: rgba(var(--vs-primary), 1);
}

.separator {
    color: #cbd5e0;
    font-weight: 300;
}

.item-count {
    color: #718096;
    font-size: 0.875rem;
}

.dark .item-count {
    color: #a0aec0;
}

/* NUEVOS ESTILOS PARA VISTA DE SELECCIÓN */
.formas-creacion-container {
    height: 100%;
    min-height: 65vh;
    display: flex;
    flex-direction: column;
}

.selection-view {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    animation: fadeIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.selection-content {
    width: 100%;
    max-width: 900px;
}

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

/* MODO OSCURO (Usando clase dinámica .is-dark) */
.option-card.is-dark {
    background: #10163A;
    border-color: #2d3748;
}

.option-card.is-dark:hover {
    border-color: #4a5568;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3);
}

.card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    height: 100%;
}

.icon-wrapper {
    width: 80px;
    height: 80px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 40px;
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

/* Modo oscuro para iconos */
.option-card.is-dark .icon-wrapper.blue {
    background: linear-gradient(135deg, #2c5282 0%, #1a365d 100%);
    color: #63b3ed;
}

.option-card.is-dark .icon-wrapper.purple {
    background: linear-gradient(135deg, #553c9a 0%, #44337a 100%);
    color: #b794f4;
}

.text-content {
    flex: 1;
    margin-bottom: 24px;
}

.text-content h4 {
    font-size: 1.25rem;
    font-weight: 700;
    margin-bottom: 12px;
}

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

/* Modo oscuro para botones */
.option-card.is-dark:hover .card-action.blue {
    background-color: rgba(66, 153, 225, 0.15);
}

.option-card.is-dark:hover .card-action.purple {
    background-color: rgba(159, 122, 234, 0.15);
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

/* UTILITIES (PRESERVADAS) */
.custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: #888 #f1f1f1;
}

.custom-scroll::-webkit-scrollbar {
    width: 6px;
}

.custom-scroll::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
}

.custom-scroll::-webkit-scrollbar-thumb:hover {
    background: #555;
}

/* Chip Styles reused from Listado */
.chip {
    display: inline-block;
    min-width: 60px;
    text-align: center;
    border-radius: 16px;
    padding: 4px 12px;
    font-weight: bold;
    font-size: 10px;
    color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    transition: background 0.3s, transform 0.2s;
}

.chip-primary {
    background-color: #1F74FF;
    color: #fff;
}

.chip-success {
    background-color: #46C93A;
    color: #fff;
}

.chip-danger {
    background-color: #FF4757;
    color: #fff;
}

.chip-warning {
    background-color: #FFBA00;
    color: #000;
}

.chip-dark {
    background-color: #1E1E1E;
    color: #fff;
}
</style>
