<template>
<div>
    <vx-card>
        <vs-tabs v-model="activeTab">
            <!-- Tab 0: Formato de precios -->
            <vs-tab label="Formato - precios">
                <div class="mt-3">
                    <div class="flex mb-3" v-if="activo">
                        <vs-button class="ml-2" color="primary" v-if="userRoot == true" type="gradient" @click="$emit('abrirCargarFormato')">
                            <ion-icon style="font-size:15px;" name="code-download-outline"></ion-icon>
                            <span class="ml-2">Cargar formato</span>
                        </vs-button>
                        <vs-button class="ml-2" color="success" type="gradient" @click="exportarFormatoLibros">
                            <i class="fa-solid fa-file-excel"></i>
                            <span class="ml-2">Exportar libros activos</span>
                        </vs-button>
                    </div>
                    <div v-if="periodoConfigNew <= mixinIdInicioFormatoNewData">
                        <FormatoPedidosVue v-if="activo" :enviarPeriodo="enviarPeriodo" :arregloSeries="arregloSeries" />
                    </div>
                    <div v-else-if="periodoConfigNew > mixinIdInicioFormatoNewData">
                        <FormatoPedidosVueNew v-if="activo" :enviarPeriodo="enviarPeriodo" :arregloSeries="arregloSeries" />
                    </div>
                </div>
            </vs-tab>

            <!-- Tab 1: Formato pagaré -->
            <vs-tab label="Formato - pagaré">
                <div class="mt-3">
                    <Formato_Pagare_Component
                        v-if="activeTab === 1 && activo"
                        :periodoSelect="periodoSelect"
                        @change="changeHandle_FormatoPagare"
                    />
                </div>
            </vs-tab>

            <!-- Tab 2: Formato convenio -->
            <vs-tab label="Formato - convenio">
                <div class="mt-3">
                    <Formato_Convenio_Component
                        v-if="activeTab === 2 && activo"
                        :periodoSelect="periodoSelect"
                        @change="changeHandle_FormatoConvenio"
                    />
                </div>
            </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>

<script>
import { mapState } from 'vuex';
import Codigosmix from '@/mixins/Codigosmix';
const FormatoPedidosVue     = () => import('@/views/pedidos/components/formato/FormatoPedidos.vue');
const FormatoPedidosVueNew  = () => import('@/views/pedidos/components/formato/FormatoPedidosModify.vue');
const Formato_Pagare_Component   = () => import('@/views/pedidos2/pedidos/gestion_pagare/formato/lista_formato.vue');
const Formato_Convenio_Component = () => import('@/views/pedidos2/pedidos/gestion_convenio/FormatoConvenio/lista_FormatoConvenio.vue');

export default {
    mixins: [Codigosmix],
    components: {
        FormatoPedidosVue,
        FormatoPedidosVueNew,
        Formato_Pagare_Component,
        Formato_Convenio_Component,
    },
    props: {
        periodoSelect: {
            type: Object,
            default: () => ({})
        },
        enviarPeriodo: {
            type: Object,
            default: () => ({})
        },
        arregloSeries: {
            type: Array,
            default: () => []
        },
        mixinIdInicioFormatoNewData: {
            default: null
        },
        activo: {
            type: Boolean,
            default: false
        },
    },
    data() {
        return {
            activeTab: 0,
        };
    },
    computed: {
        ...mapState(['userRoot']),
        periodoConfigNew() {
            return this.periodoSelect && this.periodoSelect.idperiodoescolar
                ? Number(this.periodoSelect.idperiodoescolar)
                : null;
        },
    },
    methods: {
        exportarFormatoLibros() {
            const periodo = this.enviarPeriodo || this.periodoSelect || {};
            const periodoId = periodo.idperiodoescolar;
            if (!periodoId) {
                this.$vs.notify({
                    text: 'Seleccione un período por favor',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                });
                return;
            }
            this.$vs.loading();
            this.$http.get(this.$server_url + 'export_formato_libros_activos/' + periodoId)
                .then((res) => {
                    this.$vs.loading.close();
                    const datos = res.data || [];
                    if (datos.length === 0) {
                        this.$vs.notify({
                            text: 'No hay libros activos para exportar en este período',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                        });
                        return;
                    }
                    const periodoNombre = (periodo.periodoescolar || periodo.descripcion || 'periodo').replace(/\s+/g, '_');
                    const now = new Date();
                    const fechaExport = [
                        now.getFullYear(),
                        String(now.getMonth() + 1).padStart(2, '0'),
                        String(now.getDate()).padStart(2, '0'),
                    ].join('-');
                    this.m_exportTodo(
                        ['Serie', 'Código liquidación', 'Nombre del libro', 'Descripción', 'Precio', 'Tipo', 'Período'],
                        ['serie', 'codigo_liquidacion', 'nombre_libro', 'pro_descripcion', 'precio', 'tipo', 'periodo'],
                        datos,
                        'formato_libros_activos_' + periodoNombre + '_' + fechaExport,
                        [],
                        [
                            { wch: 14 }, // Serie
                            { wch: 18 }, // Código liquidación
                            { wch: 35 }, // Nombre del libro
                            { wch: 40 }, // Descripción
                            { wch: 10 }, // Precio
                            { wch: 10 }, // Tipo
                            { wch: 16 }, // Período
                        ]
                    );
                })
                .catch((error) => {
                    this.$vs.loading.close();
                    console.log(error + ' error');
                    this.$vs.notify({
                        text: 'Error al exportar los libros activos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                });
        },
        changeHandle_FormatoPagare(e) {
            if (e.verificar_formatopagare == 1 || e.verificar_formatopagare == 2) {
                this.$emit('cerrar');
            }
        },
        changeHandle_FormatoConvenio(e) {
            if (e.verificar_formatoconvenio == 1 || e.verificar_formatoconvenio == 2) {
                this.$emit('cerrar');
            }
        },
    },
};
</script>
