<template>
<div class="wrapper-despacho">
    <vx-card>
        <!-- ===== ENCABEZADO ===== -->
        <div class="despacho-header mb-4">
            <div class="despacho-header-icon">🏢</div>
            <div>
                <h3 class="text-lg font-bold">Buscar Institución/Punto de Venta para Despacho</h3>
                <p class="despacho-subtitle">Busca y selecciona las instituciones o puntos de venta para el despacho.</p>
            </div>
        </div>

        <!-- ===== BUSCADOR ===== -->
        <vs-row class="mb-4" align="center">
            <vs-col vs-w="12" class="flex justify-center items-center space-x-3 flex-wrap">
                <vs-input v-model="filtro_buscar" placeholder="Busque por nombre de institución o punto de venta..." icon="icon-search" icon-pack="feather" style="width: 100%; max-width: 600px;" @keyup.enter="buscarInstitucion" />
                <vs-button color="success" type="relief" class="mt-2 sm:mt-0" @click="buscarInstitucion">
                    Buscar
                </vs-button>
                <small v-if="errorBusqueda" class="despacho-error mt-2 w-full text-center">
                    <i class="feather icon-alert-circle mr-1"></i>{{ errorBusqueda }}
                </small>
            </vs-col>
        </vs-row>

        <!-- ===== TABLA DE RESULTADOS ===== -->
        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">

                <!-- Resultados encontrados -->
                <div v-if="estadoBusqueda === 2">
                    <vs-divider>{{ resultados.length }} institución(es) encontrada(s)</vs-divider>
                    <vs-table max-items="10" search pagination :data="resultados" no-data-text="No hay datos disponibles" class="tabla-despacho">
                        <template slot="thead">
                            <vs-th width="500">Institución / Punto de Venta</vs-th>
                            <vs-th>Ubicación</vs-th>
                            <vs-th>Tipo</vs-th>
                            <vs-th>Acción</vs-th>
                        </template>
                        <template slot-scope="{ data }">
                            <vs-tr v-for="(tr, indextr) in data" :key="indextr" class="fila-despacho">
                                <vs-td width="700">
                                    <div class="flex items-center gap-2">
                                        <span class="font-medium">{{ tr.nombreInstitucion }}</span>
                                    </div>
                                </vs-td>
                                <vs-td width="250">
                                    <div v-if="tr.nombreprovincia || tr.nombre || tr.parr_nombre" class="ubicacion-stack">
                                        <div v-if="tr.nombreprovincia" class="ubicacion-row">
                                            <b>Provincia: </b>
                                            <span>{{ tr.nombreprovincia }}</span>
                                        </div>
                                        <div v-if="tr.nombre" class="ubicacion-row">
                                            <b>Ciudad: </b>
                                            <span>{{ tr.nombre }}</span>
                                        </div>
                                        <div v-if="tr.parr_nombre" class="ubicacion-row">
                                            <b>Parroquia: </b>
                                            <span>{{ tr.parr_nombre }}</span>
                                        </div>
                                    </div>
                                    <span v-else class="text-gray-400 italic text-xs">Sin ubicación</span>
                                </vs-td>
                                <vs-td width="300">
                                    <span v-if="tr.punto_venta == 1" class="tipo-pv">Punto de Venta</span>
                                    <span v-else class="tipo-inst">Institución</span>
                                </vs-td>
                                <vs-td align="center" width="100">
                                    <!-- Ya seleccionada -->
                                    <div v-if="estaSeleccionada(tr)">
                                        <span class="text-green-600 font-semibold items-center">
                                            <i class="feather icon-check mr-1"></i> Agregada
                                        </span>
                                    </div>
                                    <!-- Botón agregar -->
                                    <div v-else>
                                        <vx-tooltip text="Agregar establecimiento para despacho" position="top" color="success">
                                            <vs-button size="small" color="success" type="filled" icon-pack="feather" icon="icon-plus" @click="seleccionarInstitucion(tr)">
                                                Agregar
                                            </vs-button>
                                        </vx-tooltip>
                                    </div>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>

                <!-- Sin resultados -->
                <div v-else-if="estadoBusqueda === 1">
                    <vs-alert color="warning" title="Sin resultados">
                        <p>No se encontraron instituciones con ese nombre. Intenta con un término diferente.</p>
                    </vs-alert>
                </div>

            </vs-col>
        </vs-row>

    </vx-card>
</div>
</template>

<script>
export default {
    name: 'EstablecimientoParaDespacho',
    props: {
        Enviar_InstitucionesSelect: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            filtro_buscar: '',
            resultados: [],
            estadoBusqueda: 0, // 0=inicial, 1=sin resultados, 2=con resultados
            errorBusqueda: ''
        };
    },
    methods: {
        estaSeleccionada(tr) {
            return this.Enviar_InstitucionesSelect.some(
                i => Number(i.idInstitucion) === Number(tr.idInstitucion)
            );
        },

        buscarInstitucion() {
            this.errorBusqueda = '';
            if (!this.filtro_buscar || this.filtro_buscar.trim().length < 2) {
                this.errorBusqueda = 'Escribe al menos 2 caracteres para buscar.';
                return;
            }

            this.$vs.loading();
            this.estadoBusqueda = 0;
            this.resultados = [];

            const params = {
                action: 'Consulta_Instituciones_Para_Despacho',
                nombreInstitucion: this.filtro_buscar.trim()
            };

            this.$http
                .get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                    params
                })
                .then(res => {
                    this.$vs.loading.close();
                    const data = res.data || [];
                    if (data.length > 0) {
                        this.resultados = data;
                        this.estadoBusqueda = 2;
                    } else {
                        this.estadoBusqueda = 1;
                    }
                })
                .catch(() => {
                    this.$vs.loading.close();
                    this.estadoBusqueda = 1;
                    this.$vs.notify({
                        title: 'Error',
                        text: 'No se pudo realizar la búsqueda.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },

        seleccionarInstitucion(tr) {
            if (this.estaSeleccionada(tr)) {
                this.$vs.notify({
                    text: 'Esta institución ya fue agregada.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            // Emitir igual que Asignacion_Usuarios: emitir y dejar el popup abierto
            this.$emit('change', {
                verificar_EstablecimientoParaDespacho: 1,
                institucion: tr
            });

            this.$vs.notify({
                text: `"${tr.nombreInstitucion}" agregada como establecimiento para despacho.`,
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
            });
        }
    }
};
</script>

<style scoped>
.wrapper-despacho {
    padding: 8px;
}

/* ===== HEADER ===== */
.despacho-header {
    display: flex;
    align-items: center;
    gap: 14px;
}

.despacho-header-icon {
    font-size: 2rem;
    line-height: 1;
}

.despacho-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0 0 2px 0;
}

.despacho-subtitle {
    font-size: 0.82rem;
    color: #718096;
    margin: 0;
}

/* ===== ERROR ===== */
.despacho-error {
    display: block;
    color: #e53e3e;
    font-size: 0.8rem;
}

/* ===== TABLA ===== */
.tabla-despacho {
    border-radius: 12px;
    overflow: hidden;
    font-size: 14px;
}

.fila-despacho {
    transition: background-color 0.2s ease;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

/* ===== BADGES ===== */
.despacho-badge {
    display: inline-block;
    padding: 2px 7px;
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    flex-shrink: 0;
}

.badge-pv {
    background: #ebf4ff;
    color: #3182ce;
    border: 1px solid #bee3f8;
}

.badge-inst {
    background: #faf5ff;
    color: #805ad5;
    border: 1px solid #e9d8fd;
}

/* ===== TIPOS ===== */
.tipo-pv {
    background: #ebf4ff;
    color: #2b6cb0;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
}

.tipo-inst {
    background: #faf5ff;
    color: #6b46c1;
    padding: 3px 10px;
    border-radius: 999px;
    font-size: 0.78rem;
    font-weight: 600;
}

/* ===== UBICACIÓN ===== */
.ubicacion-stack {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 0.8rem;
}

.ubicacion-row {
    display: flex;
    align-items: center;
    gap: 2px;
    white-space: nowrap;
}
</style>
