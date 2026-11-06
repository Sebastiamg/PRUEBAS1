<template>
<div class="dashboard-bodega">
    <vs-divider>Estadisticas:</vs-divider>

    <section class="dashboard-bodega__stats">
        <article class="stat-card" @click="irGuias">
            <div class="stat-card__icon">
                <feather-icon icon="TruckIcon" svgClasses="w-6 h-6" />
            </div>
            <div class="stat-card__content">
                <span class="stat-card__value">
                    {{ loading.guias ? '...' : datos.guiasSinDespachar }}
                </span>
                <span class="stat-card__label">Guias Sin Despachar</span>
            </div>
        </article>

        <article class="stat-card" @click="irTextos">
            <div class="stat-card__icon">
                <feather-icon icon="FileTextIcon" svgClasses="w-6 h-6" />
            </div>
            <div class="stat-card__content">
                <span class="stat-card__value">
                    {{ loading.textos ? '...' : datosDespachotextos.length }}
                </span>
                <span class="stat-card__label">Textos Sin Despachar</span>
            </div>
        </article>

        <article class="stat-card" @click="irGuias">
            <div class="stat-card__icon">
                <feather-icon icon="RotateCcwIcon" svgClasses="w-6 h-6" />
            </div>
            <div class="stat-card__content">
                <span class="stat-card__value">
                    {{ loading.guias ? '...' : datos.devueltasPendientes }}
                </span>
                <span class="stat-card__label">Devoluciones Pendientes</span>
            </div>
        </article>
    </section>

    <vs-collapse class="dashboard-bodega__collapse">
        <vs-collapse-item>
            <template #header>
                <div class="collapse-header">
                    <div class="collapse-header__left">
                        <feather-icon icon="LayersIcon" svgClasses="w-5 h-5" />
                        <span>Combos por Temporada</span>
                    </div>
                </div>
            </template>

            <div class="dashboard-bodega__action">
                <vs-button color="primary" type="filled" size="small" icon="arrow_forward" @click.stop="guardarEnLocalYRedirigir">
                    Registrar Combos
                </vs-button>
            </div>

            <div class="dashboard-bodega__table-wrap">
                <ListadoCombosxTemporada />
            </div>
        </vs-collapse-item>
    </vs-collapse>
</div>
</template>

<script>
const ListadoCombosxTemporada = () => import("@/views/facturacion/10_10_1_4/orden_pedido/components/ListadoCombosxTemporada.vue");
export default {
    name: 'DashboardBodegaAdmin',
    data() {
        return {
            datosDespachotextos: [],
            loading: {
                guias: false,
                textos: false,
            },
            datos: {
                guiasSinDespachar: 0,
                guiasDespachadas: 0,
                devueltasPendientes: 0,
                devueltasAprobadas: 0,
            }
        };
    },
    components: {
        ListadoCombosxTemporada
    },
    mounted() {
        this.loadDeferredData();
    },
    methods: {
        irGuias() {
            this.$store.dispatch('actualizarDesdeHome', 1);
            this.$router.push('/home/bodega');
        },
        irTextos() {
            this.$store.dispatch('actualizarDesdeHome', 2);
            this.$router.push('/home/bodega');
        },
        loadDeferredData() {
            let me = this;
            let runLoad = function() {
                Promise.all([
                    me.getDatos(),
                    me.getDatosDespachoTextos(),
                ]);
            };

            if (typeof window !== 'undefined' && window.requestAnimationFrame) {
                window.requestAnimationFrame(function() {
                    setTimeout(runLoad, 40);
                });
            } else {
                setTimeout(runLoad, 40);
            }
        },
        getDatos() {
            let me = this;
            me.loading.guias = true;
            return this.$http.get(this.$server_url + 'guias?datosGuias=yes')
                .then(res => {
                    me.datos = res.data
                })
                .catch(() => {
                    me.$f_notificacion('No se pudo cargar las guias.', 'danger', 'icon-alert-triangle', 3500);
                })
                .finally(() => {
                    me.loading.guias = false;
                });
        },
        getDatosDespachoTextos() {
            let me = this;
            me.loading.textos = true;
            return this.$http.get(this.$server_url + 'GetVentasPendientes')
                .then(res => {
                    me.datosDespachotextos = res.data
                })
                .catch(() => {
                    me.$f_notificacion('No se pudo cargar textos pendientes.', 'danger', 'icon-alert-triangle', 3500);
                })
                .finally(() => {
                    me.loading.textos = false;
                });
        },
        guardarEnLocalYRedirigir() {
            const key = 'sicom';
            const valorActual = localStorage.getItem(key);
            let nuevoValor;
            if (valorActual) {
                try {
                    const obj = JSON.parse(valorActual);
                    obj.submenu = 4;
                    nuevoValor = obj;
                } catch (e) {
                    nuevoValor = {
                        menu: 0,
                        submenu: 4
                    };
                }
            } else {
                nuevoValor = {
                    menu: 0,
                    submenu: 4
                };
            }
            localStorage.setItem(key, JSON.stringify(nuevoValor));
            this.$router.push('/asis_gerencia/general');
        },
    },
};
</script>

<style scoped>
.dashboard-bodega {
    width: 100%;
    height: 100%;
    padding: 0.75rem 0;
    margin-bottom: 50px;
}

.dashboard-bodega__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    grid-gap: 1rem;
    margin-top: 1.25rem;
}

.stat-card {
    display: flex;
    align-items: center;
    min-height: 112px;
    padding: 1rem 1.1rem;
    border: 1px solid #e9edf3;
    border-radius: 12px;
    background: #ffffff;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-3px);
    border-color: #046ae7;
    box-shadow: 0 10px 24px rgba(4, 106, 231, 0.12);
}

.stat-card__icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    background: #eef4ff;
    color: #046ae7;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.stat-card__content {
    margin-left: 0.85rem;
}

.stat-card__value {
    display: block;
    font-size: 1.75rem;
    line-height: 1.05;
    font-weight: 700;
    color: #1f2a44;
}

.stat-card__label {
    display: block;
    margin-top: 0.3rem;
    font-size: 0.9rem;
    color: #6c7486;
}

.dashboard-bodega__collapse {
    margin-top: 1rem;
}

.collapse-header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.collapse-header__left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 600;
    color: #1f2a44;
}

.dashboard-bodega__action {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.75rem;
}

.dashboard-bodega__table-wrap {
    background: #ffffff;
    border: 1px solid #eef1f7;
    border-radius: 10px;
    min-height: 140px;
    max-height: 520px;
    overflow-y: auto;
    padding: 0.5rem;
    padding-right: 0.2rem;
}

.dashboard-bodega ::v-deep .vs-collapse-item {
    background: #ffffff;
    border: 1px solid #e9edf3;
    border-radius: 12px;
    overflow: hidden;
}

.dashboard-bodega ::v-deep .vs-collapse-item--open .vs-collapse-item__header {
    border-bottom: 1px solid #eef1f7;
}

.dashboard-bodega ::v-deep .vs-collapse-item__content {
    background: #ffffff;
}

@media (max-width: 768px) {
    .dashboard-bodega__stats {
        grid-template-columns: 1fr;
    }

    .dashboard-bodega__action {
        justify-content: center;
    }
}

body.theme-dark .stat-card {
    background: #10163a;
    border-color: #262c49;
}

body.theme-dark .stat-card__value,
body.theme-dark .collapse-header__left {
    color: #f2f4ff;
}

body.theme-dark .stat-card__label {
    color: #c2c6dc;
}

body.theme-dark .stat-card__icon {
    background: #1f2a4e;
}

body.theme-dark .dashboard-bodega ::v-deep .vs-collapse-item {
    background: #10163a;
    border-color: #262c49;
}

body.theme-dark .dashboard-bodega__table-wrap,
body.theme-dark .dashboard-bodega ::v-deep .vs-collapse-item__content {
    background: #10163a;
    border-color: #262c49;
}
</style>
