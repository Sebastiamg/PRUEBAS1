<template>
<div class="copiar-periodo-container">

    <!-- Header -->
    <div class="copiar-header" :class="{'dark': themeMode}">
        <div class="flex items-center gap-3">
            <div class="header-icon">
                <i class="feather icon-copy"></i>
            </div>
            <div>
                <h3 class="header-title" :class="themeMode ? 'text-white' : 'text-gray-800'">
                    Copiar Formatos de Periodo
                </h3>
                <p class="header-sub" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                    Destino: <strong>{{ periodoSelect.periodoescolar }}</strong>
                </p>
            </div>
        </div>
        <vs-button @click="$emit('change', { tipo: 'cancelar' })" type="border" color="dark" icon-pack="feather" icon="icon-x" size="small">
            Cancelar
        </vs-button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="flex justify-center items-center" style="min-height: 300px;">
        <div class="text-center">
            <vs-progress indeterminate color="primary" style="max-width: 260px; margin: 0 auto 12px;"></vs-progress>
            <p :class="themeMode ? 'text-gray-400' : 'text-gray-500'">Cargando periodos disponibles...</p>
        </div>
    </div>

    <!-- Sin datos generales -->
    <div v-else-if="!loading && periodosConFormatos.length === 0" class="empty-state" :class="themeMode ? 'dark' : ''">
        <i class="feather icon-folder" style="font-size: 48px; color: #a0aec0; display:block; margin-bottom: 12px;"></i>
        <p class="font-semibold" :class="themeMode ? 'text-gray-300' : 'text-gray-600'">
            No se encontraron formatos en los periodos registrados.
        </p>
        <p class="text-sm mt-2" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
            Debes crear el formato desde cero.
        </p>
    </div>

    <!-- Acordeón de Periodos -->
    <div v-else class="accordion-wrapper">
        <p class="instruccion" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
            Selecciona uno o varios formatos de la lista. Al copiar, quedarán en estado <strong>Pendiente de aprobación</strong> en el periodo actual, permitiendo que el formato pueda ser editado posteriormente.
        </p>

        <!-- contador seleccionados -->
        <div v-if="totalSeleccionados > 0" class="seleccion-badge">
            <i class="feather icon-check-square"></i>
            {{ totalSeleccionados }} formato(s) seleccionado(s)
        </div>

        <!-- ─── PESTAÑAS DE REGIONES (Sierra vs Costa) ─── -->
        <div class="region-tabs-container mb-6" :class="{'dark': themeMode}">
            <button 
                @click="activeRegionTab = 1" 
                class="region-tab" 
                :class="{'active': activeRegionTab === 1, 'dark': themeMode}"
            >
                <div class="flex items-center">
                    <i class="feather icon-umbrella mr-2"></i>
                    <span>Sierra</span>
                </div>
                <span class="tab-badge" :class="{'active': activeRegionTab === 1}">{{ periodosSierra.length }} Periodo/s</span>
            </button>
            <button 
                @click="activeRegionTab = 2" 
                class="region-tab" 
                :class="{'active': activeRegionTab === 2, 'dark': themeMode}"
            >
                <div class="flex items-center">
                    <i class="feather icon-sun mr-2"></i>
                    <span>Costa</span>
                </div>
                <span class="tab-badge" :class="{'active': activeRegionTab === 2}">{{ periodosCosta.length }} Periodo/s</span>
            </button>
        </div>

        <!-- ─── SECCIÓN SIERRA (Tab 1) ─── -->
        <div v-show="activeRegionTab === 1">
            <div v-if="periodosSierra.length === 0" class="region-empty-state" :class="{'dark': themeMode}">
                <i class="feather icon-info mb-2" style="font-size: 32px; color: #a0aec0;"></i>
                <p class="font-semibold text-sm" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                    No hay formatos disponibles en la región Sierra.
                </p>
            </div>
            
            <div v-else v-for="periodo in periodosSierra" :key="periodo.idperiodoescolar" class="accordion-item" :class="{'dark': themeMode}">
                <!-- Cabecera del acordeón -->
                <div class="accordion-header" :class="{'open': periodosAbiertos[periodo.idperiodoescolar], 'dark': themeMode}" @click="togglePeriodo(periodo.idperiodoescolar)">
                    <div class="flex items-center gap-3">
                        <div class="accordion-period-icon" :class="{'open': periodosAbiertos[periodo.idperiodoescolar]}">
                            <i class="feather icon-calendar"></i>
                        </div>
                        <div>
                            <span class="accordion-period-name" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                {{ periodo.periodoescolar }}
                            </span>
                            <span class="accordion-period-count">
                                {{ periodo.formatos.length }} formato(s)
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span v-if="seleccionadosPorPeriodo(periodo.idperiodoescolar) > 0" class="badge-count">
                            {{ seleccionadosPorPeriodo(periodo.idperiodoescolar) }} sel.
                        </span>
                        <i class="feather accordion-chevron" :class="periodosAbiertos[periodo.idperiodoescolar] ? 'icon-chevron-up' : 'icon-chevron-down'"></i>
                    </div>
                </div>

                <!-- Contenido expandido -->
                <transition name="accordion-slide">
                    <div v-if="periodosAbiertos[periodo.idperiodoescolar]" class="accordion-body" :class="{'dark': themeMode}">
                        <div class="selall-row" :class="{'dark': themeMode}">
                            <vs-checkbox :value="todoSeleccionadoEnPeriodo(periodo)" @input="toggleTodoPeriodo(periodo, $event)">
                                Seleccionar todos los formatos de este periodo
                            </vs-checkbox>
                        </div>

                        <div v-for="formato in periodo.formatos" :key="formato.paf_id" class="formato-row" :class="{'dark': themeMode, 'selected': seleccionados.includes(formato.paf_id)}">
                            <vs-checkbox v-model="seleccionados" :vs-value="formato.paf_id">
                                <span class="formato-nombre">{{ formato.paf_nombre }}</span>
                                <span v-if="formato.paf_descripcion" class="formato-desc">{{ formato.paf_descripcion }}</span>
                            </vs-checkbox>
                            <vs-chip :color="getEstadoColor(formato.paf_estado)" size="small" class="ml-auto estado-chip">
                                {{ getEstadoLabel(formato.paf_estado) }}
                            </vs-chip>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <!-- ─── SECCIÓN COSTA (Tab 2) ─── -->
        <div v-show="activeRegionTab === 2">
            <div v-if="periodosCosta.length === 0" class="region-empty-state" :class="{'dark': themeMode}">
                <i class="feather icon-info mb-2" style="font-size: 32px; color: #a0aec0;"></i>
                <p class="font-semibold text-sm" :class="themeMode ? 'text-gray-400' : 'text-gray-500'">
                    No hay formatos disponibles en la región Costa.
                </p>
            </div>
            
            <div v-else v-for="periodo in periodosCosta" :key="periodo.idperiodoescolar" class="accordion-item" :class="{'dark': themeMode}">
                <!-- Cabecera del acordeón -->
                <div class="accordion-header" :class="{'open': periodosAbiertos[periodo.idperiodoescolar], 'dark': themeMode}" @click="togglePeriodo(periodo.idperiodoescolar)">
                    <div class="flex items-center gap-3">
                        <div class="accordion-period-icon" :class="{'open': periodosAbiertos[periodo.idperiodoescolar]}">
                            <i class="feather icon-calendar"></i>
                        </div>
                        <div>
                            <span class="accordion-period-name" :class="themeMode ? 'text-gray-100' : 'text-gray-800'">
                                {{ periodo.periodoescolar }}
                            </span>
                            <span class="accordion-period-count">
                                {{ periodo.formatos.length }} formato(s)
                            </span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <span v-if="seleccionadosPorPeriodo(periodo.idperiodoescolar) > 0" class="badge-count">
                            {{ seleccionadosPorPeriodo(periodo.idperiodoescolar) }} sel.
                        </span>
                        <i class="feather accordion-chevron" :class="periodosAbiertos[periodo.idperiodoescolar] ? 'icon-chevron-up' : 'icon-chevron-down'"></i>
                    </div>
                </div>

                <!-- Contenido expandido -->
                <transition name="accordion-slide">
                    <div v-if="periodosAbiertos[periodo.idperiodoescolar]" class="accordion-body" :class="{'dark': themeMode}">
                        <div class="selall-row" :class="{'dark': themeMode}">
                            <vs-checkbox :value="todoSeleccionadoEnPeriodo(periodo)" @input="toggleTodoPeriodo(periodo, $event)">
                                Seleccionar todos los formatos de este periodo
                            </vs-checkbox>
                        </div>

                        <div v-for="formato in periodo.formatos" :key="formato.paf_id" class="formato-row" :class="{'dark': themeMode, 'selected': seleccionados.includes(formato.paf_id)}">
                            <vs-checkbox v-model="seleccionados" :vs-value="formato.paf_id">
                                <span class="formato-nombre">{{ formato.paf_nombre }}</span>
                                <span v-if="formato.paf_descripcion" class="formato-desc">{{ formato.paf_descripcion }}</span>
                            </vs-checkbox>
                            <vs-chip :color="getEstadoColor(formato.paf_estado)" size="small" class="ml-auto estado-chip">
                                {{ getEstadoLabel(formato.paf_estado) }}
                            </vs-chip>
                        </div>
                    </div>
                </transition>
            </div>
        </div>

        <!-- Botón Copiar -->
        <div class="footer-actions">
            <vs-button color="success" type="gradient" icon-pack="feather" icon="icon-copy" :disabled="totalSeleccionados === 0 || copiando" @click="confirmarCopiado()" class="shadow-lg">
                {{ copiando ? 'Copiando...' : `Copiar ${totalSeleccionados > 0 ? totalSeleccionados + ' formato(s)' : 'seleccionados'}` }}
            </vs-button>
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
    data() {
        return {
            loading: false,
            copiando: false,
            periodosConFormatos: [], // [{ idperiodoescolar, periodoescolar, region_idregion, formatos: [...] }]
            periodosAbiertos: {},    // { [idperiodoescolar]: boolean }
            seleccionados: [],       // array de paf_id seleccionados
            activeRegionTab: 1,      // 1 = Sierra, 2 = Costa
        };
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        totalSeleccionados() {
            return this.seleccionados.length;
        },
        periodosSierra() {
            return this.periodosConFormatos.filter(p => String(p.region_idregion) === '1');
        },
        periodosCosta() {
            return this.periodosConFormatos.filter(p => String(p.region_idregion) !== '1');
        }
    },
    mounted() {
        // Auto-seleccionar la pestaña de la región de destino
        this.activeRegionTab = this.periodoSelect.region_idregion == 2 ? 2 : 1;
        this.cargarPeriodos();
    },
    methods: {
        // ─── Carga periodos con formatos ────────────────────────────
        cargarPeriodos() {
            let me = this;
            me.loading = true;
            me.$http.get(me.$server_url + 'Procesar_MetodosGet_Pagare_FormatoController', {
                    params: {
                        action: 'Get_PeriodosConFormatos_PorRegion',
                        region_idregion: me.periodoSelect.region_idregion,
                        idperiodoescolar_actual: me.periodoSelect.idperiodoescolar,
                    }
                })
                .then(res => {
                    me.periodosConFormatos = res.data || [];
                    
                    // Inicializar estado abierto de los acordeones
                    const abiertosInicial = {};
                    me.periodosConFormatos.forEach(p => {
                        abiertosInicial[p.idperiodoescolar] = false;
                    });
                    
                    // Auto-abrir el primer período de cada región
                    const primeroSierra = me.periodosConFormatos.find(p => String(p.region_idregion) === '1');
                    if (primeroSierra) {
                        abiertosInicial[primeroSierra.idperiodoescolar] = true;
                    }
                    const primeroCosta = me.periodosConFormatos.find(p => String(p.region_idregion) !== '1');
                    if (primeroCosta) {
                        abiertosInicial[primeroCosta.idperiodoescolar] = true;
                    }
                    
                    me.periodosAbiertos = abiertosInicial;
                })
                .catch(err => {
                    console.error(err);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'No se pudieron cargar los periodos.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                })
                .finally(() => {
                    me.loading = false;
                });
        },

        // ─── Acordeón ────────────────────────────────────────────────────────
        togglePeriodo(id) {
            this.$set(this.periodosAbiertos, id, !this.periodosAbiertos[id]);
        },

        // ─── Selección ───────────────────────────────────────────────────────
        seleccionadosPorPeriodo(idperiodoescolar) {
            const periodo = this.periodosConFormatos.find(p => p.idperiodoescolar === idperiodoescolar);
            if (!periodo) return 0;
            return periodo.formatos.filter(f => this.seleccionados.includes(f.paf_id)).length;
        },
        todoSeleccionadoEnPeriodo(periodo) {
            return periodo.formatos.every(f => this.seleccionados.includes(f.paf_id));
        },
        toggleTodoPeriodo(periodo, valor) {
            const ids = periodo.formatos.map(f => f.paf_id);
            if (valor) {
                // Añadir todos los que no estén
                ids.forEach(id => {
                    if (!this.seleccionados.includes(id)) this.seleccionados.push(id);
                });
            } else {
                // Quitar todos los de este periodo
                this.seleccionados = this.seleccionados.filter(id => !ids.includes(id));
            }
        },

        // ─── Estado chip ─────────────────────────────────────────────────────
        getEstadoLabel(estado) {
            const mapa = {
                '0': 'Inactivo',
                '1': 'Pendiente de aprobación',
                '2': 'Aprobado'
            };
            return mapa[String(estado)] || 'Desconocido';
        },
        getEstadoColor(estado) {
            const mapa = {
                '0': 'danger',
                '1': 'warning',
                '2': 'success'
            };
            return mapa[String(estado)] || 'dark';
        },

        // ─── Confirmar y copiar ───────────────────────────────────────────────
        confirmarCopiado() {
            let me = this;
            me.$vs.dialog({
                type: 'confirm',
                color: 'success',
                title: 'Confirmar copiado',
                text: `¿Deseas copiar ${me.totalSeleccionados} formato(s) al periodo "${me.periodoSelect.periodoescolar}"? Quedarán en estado Pendiente de aprobación.`,
                acceptText: 'Sí, Copiar',
                cancelText: 'Cancelar',
                accept: () => me.ejecutarCopiado()
            });
        },
        ejecutarCopiado() {
            let me = this;
            me.copiando = true;
            me.$vs.loading();

            const userPlatform = JSON.parse(localStorage.getItem('usuario')) || {};
            const idusuario = userPlatform.idusuario || null;

            const formData = new FormData();
            formData.append('action', 'Copiar_Formatos_OtroPeriodo_Back');
            formData.append('idperiodoescolar_destino', me.periodoSelect.idperiodoescolar);
            formData.append('idusuario', idusuario);
            me.seleccionados.forEach(id => formData.append('paf_ids[]', id));

            me.$http.post(me.$server_url + 'Procesar_MetodosPost_Pagare_FormatoController', formData)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status === 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.$emit('change', {
                            tipo: 'formatos_copiados'
                        });
                    } else {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                    }
                })
                .catch(err => {
                    console.error(err);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error de conexión al copiar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                })
                .finally(() => {
                    me.copiando = false;
                });
        }
    }
};
</script>

<style scoped>
/* ─── Contenedor principal ─────────────────────────────────── */
.copiar-periodo-container {
    min-height: 65vh;
    display: flex;
    flex-direction: column;
    animation: fadeIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
}

/* ─── Header ────────────────────────────────────────────────── */
.copiar-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1.25rem 1.5rem;
    border-bottom: 1px solid #e2e8f0;
    background: #fff;
    border-radius: 12px 12px 0 0;
    margin-bottom: 1.25rem;
}

.copiar-header.dark {
    background: #10163A;
    border-bottom-color: #2d3748;
}

.header-icon {
    width: 46px;
    height: 46px;
    background: linear-gradient(135deg, #faf5ff 0%, #e9d8fd 100%);
    color: #9f7aea;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
}

.header-title {
    font-size: 1.1rem;
    font-weight: 700;
    margin: 0;
}

.header-sub {
    font-size: 0.85rem;
    margin: 0;
}

/* ─── Empty state ───────────────────────────────────────────── */
.empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem;
    border: 2px dashed #e2e8f0;
    border-radius: 12px;
    margin: 1rem;
    text-align: center;
}

.empty-state.dark {
    border-color: #2d3748;
}

/* ─── Instrucción / Wrapper ─────────────────────────────────── */
.accordion-wrapper {
    flex: 1;
    padding: 0 0.5rem 1rem;
    overflow-y: auto;
}

.instruccion {
    font-size: 0.875rem;
    margin-bottom: 1rem;
    line-height: 1.5;
}

/* ─── Badge contador ────────────────────────────────────────── */
.seleccion-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: linear-gradient(135deg, #ebf4ff, #c3dafe);
    color: #2b6cb0;
    font-size: 0.85rem;
    font-weight: 600;
    padding: 6px 14px;
    border-radius: 50px;
    margin-bottom: 1.25rem;
}

/* ─── Pestañas de Región ────────────────────────────────────── */
.region-tabs-container {
    display: flex;
    gap: 12px;
    background: #f1f5f9;
    padding: 6px;
    border-radius: 14px;
    border: 1px solid #e2e8f0;
}
.region-tabs-container.dark {
    background: #1d2544;
    border-color: #2d3748;
}

.region-tab {
    flex: 1;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 16px;
    border-radius: 10px;
    border: none;
    background: transparent;
    font-weight: 600;
    font-size: 0.9rem;
    color: #64748b;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.region-tab.dark {
    color: #a0aec0;
}
.region-tab:hover {
    color: #334155;
    background: rgba(255, 255, 255, 0.45);
}
.region-tab.dark:hover {
    color: #fff;
    background: rgba(255, 255, 255, 0.05);
}

.region-tab.active {
    background: #fff;
    color: #7367F0;
    box-shadow: 0 4px 12px rgba(115, 103, 240, 0.12);
}
.region-tab.active.dark {
    background: #10163A;
    color: #7367F0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.tab-badge {
    background: #cbd5e1;
    color: #475569;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 20px;
    transition: all 0.2s ease;
}
.tab-badge.active {
    background: #7367F0;
    color: #fff;
}

/* ─── Empty state de Región ────────────────────────────────── */
.region-empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2.5rem;
    border: 1px dashed #e2e8f0;
    border-radius: 12px;
    text-align: center;
    background: rgba(248, 250, 252, 0.4);
    margin: 0.5rem 0;
}
.region-empty-state.dark {
    border-color: #2d3748;
    background: rgba(26, 31, 58, 0.25);
}

/* ─── Acordeón ─────────────────────────────────────────────── */
.accordion-item {
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    margin-bottom: 0.75rem;
    overflow: hidden;
    transition: box-shadow 0.25s ease;
}

.accordion-item:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.accordion-item.dark {
    border-color: #2d3748;
    background: #10163A;
}

.accordion-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    cursor: pointer;
    background: #f8fafc;
    transition: background 0.2s ease;
    user-select: none;
}

.accordion-header:hover {
    background: #f1f5f9;
}

.accordion-header.open {
    background: linear-gradient(135deg, #ebf4ff 0%, #e0ecff 100%);
}

.accordion-header.dark {
    background: #1a1f3a;
}

.accordion-header.dark.open {
    background: linear-gradient(135deg, #1e2a5a 0%, #1a2050 100%);
}

.accordion-period-icon {
    width: 36px;
    height: 36px;
    background: #e2e8f0;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    color: #64748b;
    transition: all 0.25s ease;
    flex-shrink: 0;
}

.accordion-period-icon.open {
    background: linear-gradient(135deg, #4299e1, #3182ce);
    color: #fff;
}

.accordion-period-name {
    font-weight: 700;
    font-size: 0.95rem;
    display: block;
    line-height: 1.3;
}

.accordion-period-count {
    font-size: 0.78rem;
    color: #94a3b8;
    display: block;
}

.accordion-chevron {
    font-size: 18px;
    color: #94a3b8;
    transition: transform 0.25s ease;
}

.badge-count {
    background: linear-gradient(135deg, #4299e1, #3182ce);
    color: #fff;
    font-size: 0.75rem;
    font-weight: 700;
    padding: 2px 10px;
    border-radius: 50px;
}

/* ─── Body acordeón ─────────────────────────────────────────── */
.accordion-body {
    padding: 0.5rem 1.25rem 1rem;
    background: #fff;
    border-top: 1px solid #e2e8f0;
}

.accordion-body.dark {
    background: #131929;
    border-top-color: #2d3748;
}

.selall-row {
    padding: 0.6rem 0.5rem;
    border-bottom: 1px dashed #e2e8f0;
    margin-bottom: 0.5rem;
}

.selall-row.dark {
    border-bottom-color: #2d3748;
}

.formato-row {
    display: flex;
    align-items: center;
    padding: 0.65rem 0.75rem;
    border-radius: 8px;
    margin-bottom: 4px;
    transition: background 0.18s ease;
    gap: 6px;
}

.formato-row:hover {
    background: #f8fafc;
}

.formato-row.dark:hover {
    background: #1e2a5a;
}

.formato-row.selected {
    background: #ebf4ff;
}

.formato-row.dark.selected {
    background: #1e2a5a;
}

.formato-nombre {
    font-weight: 600;
    font-size: 0.9rem;
    display: block;
}

.formato-desc {
    font-size: 0.78rem;
    color: #94a3b8;
    display: block;
    margin-top: 2px;
}

.estado-chip {
    font-size: 0.72rem !important;
    flex-shrink: 0;
}

/* ─── Footer ─────────────────────────────────────────────────── */
.footer-actions {
    display: flex;
    justify-content: flex-end;
    padding: 1rem 0 0;
    margin-top: 0.5rem;
    border-top: 1px solid #e2e8f0;
}

/* ─── Transición acordeón ────────────────────────────────────── */
.accordion-slide-enter-active,
.accordion-slide-leave-active {
    transition: max-height 0.3s ease, opacity 0.25s ease;
    max-height: 1000px;
    overflow: hidden;
}

.accordion-slide-enter,
.accordion-slide-leave-to {
    max-height: 0;
    opacity: 0;
}

/* ─── Animación entrada ──────────────────────────────────────── */
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(16px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}
</style>
