<template>
<div>
    <vx-card>
        <!-- Botones principales -->
        <div class="tabs-buttons-container">
            <button
                v-for="(tab, index) in mainTabs"
                :key="index"
                @click="activeTab = index"
                :class="['tab-button', { 'active': activeTab === index }]"
            >
                {{ tab.label }}
            </button>
        </div>

        <!-- Contenido de tabs principales -->
        <div class="tab-content">
            <!-- Tab 0: Facturado por Asesor -->
            <div v-show="activeTab === 0">
                <vx-card title="Seleccione el período para desplegar">
                    <small>Buscar periodo:</small>
                    <v-select :options="arrayPeriodos" :reduce="periodo => periodo" @input="f_selectPeriodo" label="periodoescolar" class="w-full" v-model="periodoSelect" />
                </vx-card>
                <div v-if="mostrar" class="mt-4">
                    <vx-card>
                        <ReporteFacturadoXAsesores :periodo_id="periodo_id" :nombrePeriodo="nombrePeriodo" :ifExterno="Number(1)" v-if="periodoSelect" />
                    </vx-card>
                </div>
            </div>

            <!-- Tab 1: Facturado por Año -->
            <div v-show="activeTab === 1">
                <!-- Búsqueda por año única ARRIBA de los botones -->
                <div class="year-search-container mb-4">
                    <div class="flex items-center mb-2">
                        <p class="flex items-center">
                            <ion-icon name="contract-outline" class="mr-2"></ion-icon>
                            Búsqueda por Año
                        </p>
                    </div>
                    <div class="mb-4">
                        <label class="block">
                            Año:
                            <v-select
                                :options="arrayYearFacturado"
                                :reduce="year => year.valor"
                                label="year"
                                class="w-full"
                                v-model="selectedYearFacturado"
                                placeholder="Selecciona un año"
                            />
                            <span v-if="!selectedYearFacturado" style="color: red;">Seleccione el año.</span>
                        </label>
                    </div>
                </div>

                <!-- Botones de empresa -->
                <div class="sub-tabs-buttons-container">
                    <button
                        @click="activeSubTab1 = 0"
                        :class="['sub-tab-button', { 'active': activeSubTab1 === 0 }]"
                    >
                        Prolipa
                    </button>
                    <button
                        @click="activeSubTab1 = 1"
                        :class="['sub-tab-button', { 'active': activeSubTab1 === 1 }]"
                    >
                        Iluminar
                    </button>
                </div>

                <!-- Contenido según empresa seleccionada -->
                <div class="sub-tab-content" v-if="selectedYearFacturado">
                    <ReporteFacturadoFecha
                        v-if="activeSubTab1 === 0"
                        :yearExterno="selectedYearFacturado"
                        :key="`prolipa-facturado-${selectedYearFacturado}-${activeSubTab1}`"
                    />
                    <ReporteFacturadoFechaI
                        v-if="activeSubTab1 === 1"
                        :yearExterno="selectedYearFacturado"
                        :key="`iluminar-facturado-${selectedYearFacturado}-${activeSubTab1}`"
                    />
                </div>
            </div>

            <!-- Tab 2: Despachado x Bodega por Año -->
            <div v-show="activeTab === 2">
                <!-- Búsqueda por año única ARRIBA de los botones -->
                <div class="year-search-container mb-4">
                    <div class="flex items-center mb-2">
                        <p class="flex items-center">
                            <ion-icon name="contract-outline" class="mr-2"></ion-icon>
                            Búsqueda por Año
                        </p>
                    </div>
                    <div class="mb-4">
                        <label class="block">
                            Año:
                            <v-select
                                :options="arrayYearDespachado"
                                :reduce="year => year.valor"
                                label="year"
                                class="w-full"
                                v-model="selectedYearDespachado"
                                placeholder="Selecciona un año"
                            />
                            <span v-if="!selectedYearDespachado" style="color: red;">Seleccione el año.</span>
                        </label>
                    </div>
                </div>

                <!-- Botones de empresa -->
                <div class="sub-tabs-buttons-container">
                    <button
                        @click="activeSubTab2 = 0"
                        :class="['sub-tab-button', { 'active': activeSubTab2 === 0 }]"
                    >
                        Prolipa
                    </button>
                    <button
                        @click="activeSubTab2 = 1"
                        :class="['sub-tab-button', { 'active': activeSubTab2 === 1 }]"
                    >
                        Iluminar
                    </button>
                </div>

                <!-- Contenido según empresa seleccionada -->
                <div class="sub-tab-content" v-if="selectedYearDespachado">
                    <ReporteVendidoFecha
                        v-if="activeSubTab2 === 0"
                        :yearExterno="selectedYearDespachado"
                        :key="`prolipa-despachado-${selectedYearDespachado}-${activeSubTab2}`"
                    />
                    <ReporteVendidoFechaI
                        v-if="activeSubTab2 === 1"
                        :yearExterno="selectedYearDespachado"
                        :key="`iluminar-despachado-${selectedYearDespachado}-${activeSubTab2}`"
                    />
                </div>
            </div>

            <!-- Tab 3: Cobrado por Año -->
            <div v-show="activeTab === 3">
                <!-- Búsqueda por año única ARRIBA de los botones -->
                <div class="year-search-container mb-4">
                    <div class="flex items-center mb-2">
                        <p class="flex items-center">
                            <ion-icon name="contract-outline" class="mr-2"></ion-icon>
                            Búsqueda por Año
                        </p>
                    </div>
                    <div class="mb-4">
                        <label class="block">
                            Año:
                            <v-select
                                :options="arrayYearCobrado"
                                :reduce="year => year.valor"
                                label="year"
                                class="w-full"
                                v-model="selectedYearCobrado"
                                placeholder="Selecciona un año"
                            />
                            <span v-if="!selectedYearCobrado" style="color: red;">Seleccione el año.</span>
                        </label>
                    </div>
                </div>

                <!-- Botones de empresa -->
                <div class="sub-tabs-buttons-container">
                    <button
                        @click="activeSubTab3 = 0"
                        :class="['sub-tab-button', { 'active': activeSubTab3 === 0 }]"
                    >
                        Prolipa
                    </button>
                    <button
                        @click="activeSubTab3 = 1"
                        :class="['sub-tab-button', { 'active': activeSubTab3 === 1 }]"
                    >
                        Iluminar
                    </button>
                </div>

                <!-- Contenido según empresa seleccionada -->
                <div class="sub-tab-content" v-if="selectedYearCobrado">
                    <ReporteCobradoFecha
                        v-if="activeSubTab3 === 0"
                        :yearExterno="selectedYearCobrado"
                        :key="`prolipa-cobrado-${selectedYearCobrado}-${activeSubTab3}`"
                    />
                    <ReporteCobradoFechaI
                        v-if="activeSubTab3 === 1"
                        :yearExterno="selectedYearCobrado"
                        :key="`iluminar-cobrado-${selectedYearCobrado}-${activeSubTab3}`"
                    />
                </div>
            </div>

            <!-- Tab 4: Reportes Ventas-Abonos-Devoluciones -->
            <div v-show="activeTab === 4">
                <div class="sub-tabs-buttons-container">
                    <button
                        @click="activeSubTab4 = 0"
                        :class="['sub-tab-button', { 'active': activeSubTab4 === 0 }]"
                    >
                        Prolipa
                    </button>
                    <button
                        @click="activeSubTab4 = 1"
                        :class="['sub-tab-button', { 'active': activeSubTab4 === 1 }]"
                    >
                        Iluminar
                    </button>
                </div>
                <div class="sub-tab-content">
                    <div v-show="activeSubTab4 === 0">
                        <vx-card title="Seleccione el período ">
                            <small>Buscar periodo:</small>
                            <v-select :options="arrayPeriodos" :reduce="periodo => periodo" label="periodoescolar" class="w-full" v-model="periodoSelect" />
                        </vx-card>
                        <ReporteVentas :periodoSelect="periodoSelect" v-if="periodoSelect" />
                    </div>
                    <div v-show="activeSubTab4 === 1">
                        <vx-card title="Seleccione el período ">
                            <small>Buscar periodo:</small>
                            <v-select :options="arrayPeriodosIluminar" :reduce="periodo => periodo" label="periodoescolar" class="w-full" v-model="periodoIluminarSelect" />
                        </vx-card>
                        <ReporteVentasI :periodoSelect="periodoIluminarSelect" v-if="periodoIluminarSelect" />
                    </div>
                </div>
            </div>

            <!-- Tab 5: Desfase en Saldos Facturados -->
            <div v-show="activeTab === 5">
                <vx-card title="Seleccione el período ">
                    <small>Buscar periodo:</small>
                    <v-select :options="arrayPeriodos" :reduce="periodo => periodo" label="periodoescolar" class="w-full" v-model="periodoSelect" />
                    <div class="sub-tabs-buttons-container mt-4">
                        <button
                            @click="activeSubTab5 = 0"
                            :class="['sub-tab-button', { 'active': activeSubTab5 === 0 }]"
                        >
                            Prolipa
                        </button>
                        <button
                            @click="activeSubTab5 = 1"
                            :class="['sub-tab-button', { 'active': activeSubTab5 === 1 }]"
                        >
                            Calmed
                        </button>
                    </div>
                    <div class="sub-tab-content">
                        <desfasFacturacion :periodoSelect="periodoSelect" :empresa="1" v-show="activeSubTab5 === 0" />
                        <desfasFacturacion :periodoSelect="periodoSelect" :empresa="3" v-show="activeSubTab5 === 1" />
                    </div>
                </vx-card>
            </div>

            <!-- Tab 6: Cuentas X Cobrar -->
            <div v-show="activeTab === 6">
                <div class="sub-tabs-buttons-container">
                    <button
                        @click="activeSubTab6 = 0"
                        :class="['sub-tab-button', { 'active': activeSubTab6 === 0 }]"
                    >
                        Prolipa
                    </button>
                </div>
                <div class="sub-tab-content">
                    <ReporteCuentasXCobrar v-show="activeSubTab6 === 0" />
                </div>
            </div>

            <!-- Tab 7: Asociar Notas de Credito -->
            <div v-show="activeTab === 7">
                <!-- Búsqueda por año única ARRIBA de los botones -->
                <div class="year-search-container mb-4">
                    <div class="flex items-center mb-2">
                        <p class="flex items-center">
                            <ion-icon name="contract-outline" class="mr-2"></ion-icon>
                            Búsqueda por Año
                        </p>
                    </div>
                    <div class="mb-4">
                        <label class="block">
                            Año:
                            <v-select
                                :options="arrayYearNotasCredito"
                                :reduce="year => year.valor"
                                label="year"
                                class="w-full"
                                v-model="selectedYearNotasCredito"
                                placeholder="Selecciona un año"
                            />
                            <span v-if="!selectedYearNotasCredito" style="color: red;">Seleccione el año.</span>
                        </label>
                    </div>
                </div>

                <!-- Botones de empresa -->
                <div class="sub-tabs-buttons-container">
                    <button
                        @click="activeSubTab7 = 0"
                        :class="['sub-tab-button', { 'active': activeSubTab7 === 0 }]"
                    >
                        Prolipa
                    </button>
                    <button
                        @click="activeSubTab7 = 1"
                        :class="['sub-tab-button', { 'active': activeSubTab7 === 1 }]"
                    >
                        Calmed
                    </button>
                </div>

                <!-- Contenido según empresa seleccionada -->
                <div class="sub-tab-content" v-if="selectedYearNotasCredito">
                    <AsociarnotasCredito
                        v-if="activeSubTab7 === 0"
                        :empresa="1"
                        :yearExterno="selectedYearNotasCredito"
                        :key="`prolipa-${selectedYearNotasCredito}-${activeSubTab7}`"
                    />
                    <AsociarnotasCredito
                        v-if="activeSubTab7 === 1"
                        :empresa="3"
                        :yearExterno="selectedYearNotasCredito"
                        :key="`calmed-${selectedYearNotasCredito}-${activeSubTab7}`"
                    />
                </div>
            </div>

            <!-- Tab 8: REPORTE GENERAL PEDIDOS -->
            <div v-show="activeTab === 8">
                <vx-card title="Seleccione el período ">
                    <small>Buscar periodo:</small>
                    <v-select :options="arrayPeriodos" :reduce="periodo => periodo" label="periodoescolar" class="w-full" v-model="periodoSelect" />
                    <ScreenReporteVentasVue :periodo_id="periodoSelect.idperiodoescolar" :nombrePeriodo="periodoSelect.periodoescolar" v-if="periodoSelect" />
                </vx-card>
            </div>

            <!-- Tab 9: Conteo libros pedidos -->
            <div v-show="activeTab === 9">
                <small>Buscar periodo:</small>
                <v-select :options="arrayPeriodos" :reduce="periodo => periodo" label="periodoescolar" class="w-full" v-model="periodoSelect" />
                <div v-if="periodoSelect" class="mt-4">
                    <ReportePedidosTotalLibrosxPeriodoVue :periodoConsulta="periodoSelect.idperiodoescolar"/>
                </div>
            </div>

            <!-- Tab 10: Reporte Pedidos Periodos -->
            <div v-show="activeTab === 10">
                <ReporteVentaPeriodosVue />
            </div>

            <!-- Tab 11: Devoluciones Facturación + SUB-TABS -->
            <div v-show="activeTab === 11">
                <vs-tabs
                    v-model="activeSubTab11"
                    :value.sync="activeSubTab11"
                    :conceal="true"
                    alignment="fixed"
                >
                    <vs-tab label="Devoluciones" icon-pack="feather" icon="icon-rotate-ccw" />
                    <vs-tab label="Búsqueda Documentos" icon-pack="feather" icon="icon-search" />

                    <div class="sub-tab-content p-4">
                        <DevolucionDocumentosFacturacionVue v-if="activeSubTab11 === 0" />
                        <PreFacturasVue v-if="activeSubTab11 === 1" :periodoSelect="periodoSelect" :contabilidad="true" />
                    </div>
                </vs-tabs>
            </div>
        </div>
    </vx-card>
</div>
</template>

<script>
import PeriodoRepository from '@/repositories/PeriodoRepository';
const ReporteFacturadoXAsesores = () => import('../../pedidos2/pedidos/reportes/ReporteFacturadoXAsesores.vue');
const ReporteFacturadoFecha = () => import('@/views/pedidos2/pedidos/reportes/ReporteFacturadoXFecha.vue');
const ReporteFacturadoFechaI = () => import('@/views/pedidos2/pedidos/reportes/ReporteFacturadoXFechaI.vue');
const ReporteVendidoFecha = () => import('@/views/pedidos2/pedidos/reportes/ReporteVendidoXFecha.vue');
const ReporteVendidoFechaI = () => import('@/views/pedidos2/pedidos/reportes/ReporteVendidoXFechaI.vue');
const ReporteCobradoFecha = () => import('@/views/pedidos2/pedidos/reportes/ReporteCobradoXFecha.vue');
const ReporteCobradoFechaI = () => import('@/views/pedidos2/pedidos/reportes/ReporteCobradoXFechaI.vue');
const ReporteVentas = () => import('@/views/pedidos2/pedidos/reportes/components/reporteCobranza.vue');
const desfasFacturacion = () => import('@/views/pedidos2/pedidos/proforma/desfasFacturacion.vue');
const ReporteVentasI = () => import('@/views/pedidos2/pedidos/reportes/components/reporteCobranzaI.vue');
const ReporteCuentasXCobrar = () => import('@/views/pedidos2/pedidos/reportes/ReporteCuentasXCobrar.vue');
const AsociarnotasCredito = () => import('@/views/pedidos2/pedidos/reportes/AsociarnotasCredito.vue');
const ReporteGeneralAnualVue = () => import('@/views/pedidos2/pedidos/reportes/components/ReporteGeneralAnual.vue');
const ReporteVentasPedidosPorFecha = () => import('@/views/pedidos2/pedidos/reportes/components/ReporteVentasPedidosPorFecha.vue');
const ScreenReporteVentasVue = () => import('../../pedidos2/pedidos/reportes/components/ScreenReporteVentas.vue')
const ReportePedidosTotalLibrosxPeriodoVue = () => import('@/views/pedidos2/pedidos/reportes/reportePedidos/ReportePedidosTotalLibrosxPeriodo.vue');
const ReporteVentaPeriodosVue = () => import('@/views/pedidos/gerencia/reportes/ReporteVentaPeriodos.vue');
const DevolucionDocumentosFacturacionVue = () => import('@/views/codigos/components/devolucion/components/DevolucionDocumentosFacturacion.vue');
const PreFacturasVue = () => import('@/views/pedidos2/pedidos/proforma/preFacturas.vue');
import vSelect from 'vue-select';
import Generalmix from '../../../mixins/Generalmix';

export default {
    mixins: [Generalmix],
    components: {
        vSelect,
        ReporteFacturadoXAsesores,
        ReporteFacturadoFecha,
        ReporteVendidoFecha,
        ReporteVendidoFechaI,
        ReporteFacturadoFechaI,
        ReporteCobradoFecha,
        ReporteCobradoFechaI,
        ReporteVentas,
        ReporteVentasI,
        desfasFacturacion,
        ReporteCuentasXCobrar,
        AsociarnotasCredito,
        ReporteGeneralAnualVue,
        ReporteVentasPedidosPorFecha,
        ScreenReporteVentasVue,
        ReportePedidosTotalLibrosxPeriodoVue,
        ReporteVentaPeriodosVue,
        DevolucionDocumentosFacturacionVue,
        PreFacturasVue
    },
    data() {
        let activeTab = 0;
        let activeSubTab1 = 0;
        let activeSubTab2 = 0;
        let activeSubTab3 = 0;
        let activeSubTab4 = 0;
        let activeSubTab5 = 0;
        let activeSubTab6 = 0;
        let activeSubTab7 = 0;
        let activeSubTab8 = 0;
        let activeSubTab11 = 0;  // NUEVO: sub-tab para Devoluciones Facturación

        try {
            const savedState = JSON.parse(localStorage.getItem('tabsState'));
            if (savedState) {
                activeTab = savedState.activeTab || 0;
                activeSubTab1 = savedState.activeSubTab1 || 0;
                activeSubTab2 = savedState.activeSubTab2 || 0;
                activeSubTab3 = savedState.activeSubTab3 || 0;
                activeSubTab4 = savedState.activeSubTab4 || 0;
                activeSubTab5 = savedState.activeSubTab5 || 0;
                activeSubTab6 = savedState.activeSubTab6 || 0;
                activeSubTab7 = savedState.activeSubTab7 || 0;
                activeSubTab11 = savedState.activeSubTab11 || 0;
            }
        } catch (error) {
            console.error('Error al leer el estado de localStorage:', error);
        }

        return {
            activeTab,
            activeSubTab1,
            activeSubTab2,
            activeSubTab3,
            activeSubTab4,
            activeSubTab5,
            activeSubTab6,
            activeSubTab7,
            activeSubTab11,
            mainTabs: [
                { label: 'Facturado por Asesor' },
                { label: 'Facturado por Año' },
                { label: 'Despachado x Bodega por Año' },
                { label: 'Cobrado por Año' },
                { label: 'Reportes Ventas-Abonos-Devoluciones' },
                { label: 'Desfase en Saldos Facturados' },
                { label: 'Cuentas X Cobrar' },
                { label: 'Asociar Notas de Credito' },
                { label: 'REPORTE GENERAL PEDIDOS' },
                { label: 'Conteo libros pedidos' },
                { label: 'Reporte Pedidos Periodos' },
                { label: 'Devoluciones Facturación' }
            ],
            arrayPeriodos: [],
            mostrarReporteAnual: false,
            reporteAnualKey: 0,
            periodoContabilidadSelect: null,
            arrayPeriodosIluminar: [],
            periodo_id: 0,
            nombrePeriodo: '',
            periodoSelect: null,
            periodoIluminarSelect: null,
            mostrar: false,
            radios1: 'Prolipa',
            //totales
            totalVentasBodega: 0,
            totalVentasFacturacion: 0,
            totalVentasPerseo: 0,
            periodoSelectTotales: null,
            periodoIluminarSelectTotales: null,

            datosVentas: [],
            totalGeneral: 0,
            arrayYearNotasCredito: [],
            selectedYearNotasCredito: null,
            arrayYearFacturado: [],
            selectedYearFacturado: null,
            arrayYearDespachado: [],
            selectedYearDespachado: null,
            arrayYearCobrado: [],
            selectedYearCobrado: null,

        };
    },
    computed: {
        // Procesar períodos para mostrar solo un período por año
        periodosUnicos() {
            const periodosMap = new Map();

            this.arrayPeriodos.forEach(periodo => {
                // Extraer el año del nombre del período
                const match = periodo.periodoescolar.match(/(\d{4})/);
                if (match) {
                    const año = match[1];

                    // Si no existe el año en el mapa, o si el período actual tiene mayor ID, lo guardamos
                    if (!periodosMap.has(año) || periodo.idperiodoescolar > periodosMap.get(año).idperiodoescolar) {
                        periodosMap.set(año, {
                            ...periodo,
                            periodoescolar: año, // Solo mostrar el año
                            periodoOriginal: periodo.periodoescolar // Guardar el nombre original
                        });
                    }
                }
            });

            // Convertir el mapa a array y ordenar por año descendente
            return Array.from(periodosMap.values()).sort((a, b) => b.periodoescolar - a.periodoescolar);
        },

        // Procesar períodos de Iluminar de la misma manera
        periodosIluminarUnicos() {
            const periodosMap = new Map();

            this.arrayPeriodosIluminar.forEach(periodo => {
                // Extraer el año del nombre del período
                const match = periodo.periodoescolar.match(/(\d{4})/);
                if (match) {
                    const año = match[1];

                    // Si no existe el año en el mapa, o si el período actual tiene mayor ID, lo guardamos
                    if (!periodosMap.has(año) || periodo.idperiodoescolar > periodosMap.get(año).idperiodoescolar) {
                        periodosMap.set(año, {
                            ...periodo,
                            periodoescolar: año, // Solo mostrar el año
                            periodoOriginal: periodo.periodoescolar // Guardar el nombre original
                        });
                    }
                }
            });

            // Convertir el mapa a array y ordenar por año descendente
            return Array.from(periodosMap.values()).sort((a, b) => b.periodoescolar - a.periodoescolar);
        }
    },
    mounted() {
        this.obtenerPeriodos();
        this.obtenerPeriodosIluminar();
        this.generateYearsNotasCredito();
        this.generateYearsFacturado();
        this.generateYearsDespachado();
        this.generateYearsCobrado();
    },
    methods: {
        obtenerPeriodosIluminar() {
            PeriodoRepository.getPeriodosIluminar()
                .then(p => {
                    this.arrayPeriodosIluminar = p.data.filter(p => p.reporte_contabilidad == 1);
                })
                .catch(error => {
                    this.m_message("Error al cargar los períodos", "error");
                    console.error(error);
                });
        },
        generateYearsNotasCredito() {
            const currentYear = new Date().getFullYear();
            const startYear = 2024;
            this.arrayYearNotasCredito = Array.from({
                length: currentYear + 1 - startYear + 1
            }, (v, i) => ({
                year: startYear + i,
                valor: (startYear + i).toString()
            }));
        },
        generateYearsFacturado() {
            const currentYear = new Date().getFullYear();
            const startYear = 2024;
            this.arrayYearFacturado = Array.from({
                length: currentYear + 1 - startYear + 1
            }, (v, i) => ({
                year: startYear + i,
                valor: (startYear + i).toString()
            }));
        },
        generateYearsDespachado() {
            const currentYear = new Date().getFullYear();
            const startYear = 2024;
            this.arrayYearDespachado = Array.from({
                length: currentYear + 1 - startYear + 1
            }, (v, i) => ({
                year: startYear + i,
                valor: (startYear + i).toString()
            }));
        },
        generateYearsCobrado() {
            const currentYear = new Date().getFullYear();
            const startYear = 2024;
            this.arrayYearCobrado = Array.from({
                length: currentYear + 1 - startYear + 1
            }, (v, i) => ({
                year: startYear + i,
                valor: (startYear + i).toString()
            }));
        },
        obtenerPeriodos() {
            PeriodoRepository.getPeriodos()
                .then(p => {
                    this.arrayPeriodos = p.data.filter(p => p.reporte_contabilidad == 1);
                })
                .catch(error => {
                    this.m_message("Error al cargar los períodos", "error");
                    console.error(error);
                });
        },
        f_selectPeriodo() {
            this.mostrar = false;
            this.$vs.loading();

            setTimeout(() => {
                if (!this.periodoSelect) {
                    this.m_message("Seleccione un periodo por favor", "warning");
                    this.$vs.loading.close();
                    return;
                }

                this.periodo_id = this.periodoSelect.idperiodoescolar;
                this.nombrePeriodo = this.periodoSelect.periodoescolar;
                this.mostrar = true;
                this.$vs.loading.close();
            }, 1000);
        },
        saveTabState() {
            const state = {
                activeTab: this.activeTab,
                activeSubTab1: this.activeSubTab1,
                activeSubTab2: this.activeSubTab2,
                activeSubTab3: this.activeSubTab3,
                activeSubTab4: this.activeSubTab4,
                activeSubTab5: this.activeSubTab5,
                activeSubTab6: this.activeSubTab6,
                activeSubTab7: this.activeSubTab7,
                activeSubTab11: this.activeSubTab11,
            };
            localStorage.setItem('tabsState', JSON.stringify(state));
        },
        toggleReporteAnual() {
            if (this.mostrarReporteAnual) {
                // Si está visible, lo ocultamos
                this.mostrarReporteAnual = false;
            } else {
                // Si está oculto, lo mostramos
                this.mostrarReporteAnual = true;
                // Incrementamos la key para forzar la recarga del componente
                this.reporteAnualKey += 1;
            }
        },
        recargarReporte() {
            // Función específica para recargar el reporte
            // Incrementamos la key para forzar la recarga del componente
            this.reporteAnualKey += 1;

            this.$vs.notify({
                title: 'Reporte Actualizado',
                text: 'El reporte se ha actualizado correctamente',
                color: 'success'
            });
        },
    },
    watch: {
        activeTab() {
            // Limpiar selecciones al cambiar de tab principal
            this.periodoSelect = null;
            this.periodoIluminarSelect = null;
            this.saveTabState();
        },
        activeSubTab1() {
            this.saveTabState();
        },
        activeSubTab2() {
            this.saveTabState();
        },
        activeSubTab3() {
            this.saveTabState();
        },
        activeSubTab4() {
            this.saveTabState();
        },
        activeSubTab5() {
            this.saveTabState();
        },
        activeSubTab6() {
            this.saveTabState();
        },
        activeSubTab7() {
            this.saveTabState();
        },
        periodoSelect: {
            handler(newVal) {
                // Cuando cambia periodoSelect, forzar actualización del componente hijo
                if (newVal && this.activeTab === 9) {
                    // El componente hijo se actualizará automáticamente con el nuevo valor
                    this.$forceUpdate();
                }
            },
            deep: true
        }
    },
};
</script>

<style scoped>
/* Contenedor de botones principales */
.tabs-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
}

.tab-button {
  flex: 1 1 auto;
  min-width: 150px;
  padding: 12px 16px;
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  color: #666;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.tab-button:hover {
  border-color: #3498db;
  color: #3498db;
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.2);
}

.tab-button.active {
  background: linear-gradient(135deg, #3498db 0%, #2980b9 100%);
  border-color: #2980b9;
  color: white;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

/* Contenedor de botones secundarios (sub-tabs) */
.sub-tabs-buttons-container {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
  padding: 8px;
  background: #f1f3f5;
  border-radius: 6px;
}

.sub-tab-button {
  flex: 1 1 auto;
  min-width: 120px;
  padding: 10px 14px;
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 5px;
  color: #666;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.sub-tab-button:hover {
  border-color: #27ae60;
  color: #27ae60;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(39, 174, 96, 0.2);
}

.sub-tab-button.active {
  background: linear-gradient(135deg, #27ae60 0%, #229954 100%);
  border-color: #229954;
  color: white;
  box-shadow: 0 3px 10px rgba(39, 174, 96, 0.3);
}

/* Contenido de tabs */
.tab-content {
  padding: 10px 0;
}

.sub-tab-content {
  padding: 10px 0;
}

/* Responsive para móvil */
@media (max-width: 768px) {
  .tabs-buttons-container {
    flex-direction: column;
    gap: 10px;
  }

  .tab-button {
    min-width: 100%;
    padding: 14px 16px;
    font-size: 15px;
  }

  .sub-tabs-buttons-container {
    flex-direction: column;
    gap: 8px;
  }

  .sub-tab-button {
    min-width: 100%;
    padding: 12px 14px;
    font-size: 14px;
  }
}

/* Estilos existentes */
.reporte-contabilidad-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #e9ecef;
  margin-bottom: 20px;
}

.botones-reporte {
  display: flex;
  align-items: center;
  gap: 10px;
}

.reporte-titulo {
  color: #2c3e50;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.reporte-titulo i {
  color: #3498db;
}

.reporte-anual-container {
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-top: 15px;
  position: relative;
}

/* Responsive para el header del reporte */
@media (max-width: 768px) {
  .reporte-contabilidad-header {
    flex-direction: column;
    gap: 15px;
    text-align: center;
  }

  .reporte-titulo {
    justify-content: center;
  }

  .botones-reporte {
    flex-direction: column;
    width: 100%;
  }

  .botones-reporte .vs-button {
    width: 100%;
    margin: 5px 0;
  }
}
</style>
