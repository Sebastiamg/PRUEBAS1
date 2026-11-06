<template>
<div class="vx-row">
    <div class="vx-col w-full">
        <!-- Título elegante -->
        <div>
            <h2 class="text-2xl font-bold text-center text-gray-800 tracking-wide mb-4 border-b pb-2">
                📑 Fichero de Mercado
            </h2>
            <!-- 🔹 SOLO para userAsesor: Selección de Período -->
            <div v-if="userAsesor && !userRoot">
                <label class="block text-gray-700 font-semibold mb-1">
                    Período Escolar
                </label>
                <vx-tooltip v-if="Dinamica_Componentes == 'fichero_detalle' || Dinamica_Componentes == 'fichero_listado'" text="Para cambiar el período debe regresar a la lista de ficheros." position="bottom">
                    <v-select :options="Periodo_Escolar" label="periodoescolar" placeholder="--Seleccione un Período--" v-model="periodoSeleccionado" class="w-full" @input="Accion_AL_Cambio_Periodo()" :disabled="true" />
                </vx-tooltip>
                <v-select v-else :options="Periodo_Escolar" label="periodoescolar" placeholder="--Seleccione un Período--" v-model="periodoSeleccionado" class="w-full" @input="Accion_AL_Cambio_Periodo()" />
            </div>
        </div>
        <br>
        <!-- 🔹 Mostrar vx-card -->
        <!-- Para el asesor: solo si seleccionó período -->
        <!-- Para el root: siempre visible -->
        <vx-card v-if="(userAsesor && periodoSeleccionado) || userRoot">
            <vs-tabs v-model="activeTab">
                <!-- TAB: Lista ficheros (Root o Asesor) -->
                <vs-tab v-if="userRoot || userAsesor" label="Lista ficheros" @click="Dinamica_Componentes = 'fichero_lista_aprobado'">
                    <Fichero_Listado_Para_Aprobacion :key="keyAprobacion" :periodoSeleccionado="userRoot ? null : periodoSeleccionado" @change="changeListaFicheroCompleto" />
                </vs-tab>
                <!-- TAB: Búsqueda de ficheros por Institución (solo Root) -->
                <vs-tab v-if="userRoot" label="Búsqueda de ficheros por Institución" @click="tabBusqueda_ficheros()">
                    <vx-card>
                        <div v-if="Dinamica_Componentes == 'fichero_detalle'" class="text-center mb-4">
                            <vs-button @click="regresarABuscador" color="primary" type="filled" icon-pack="feather" icon="icon-arrow-left">
                                Buscar otra Institución
                            </vs-button>
                        </div>
                        <div v-if="Dinamica_Componentes == 'fichero_general'">
                            <div>
                                <label class="block text-gray-700 font-semibold mb-1">
                                    Período Escolar
                                </label>
                                <vx-tooltip v-if="Dinamica_Componentes == 'fichero_detalle' || Dinamica_Componentes == 'fichero_listado'" text="Para cambiar el período debe regresar a la búsqueda de instituciones." position="bottom">
                                    <v-select :options="Periodo_Escolar" label="periodoescolar" placeholder="--Seleccione un Período--" v-model="periodoSeleccionado_Root" class="w-full" @input="Accion_AL_Cambio_Periodo()" :disabled="true" />
                                </vx-tooltip>
                                <v-select v-else :options="Periodo_Escolar" label="periodoescolar" placeholder="--Seleccione un Período--" v-model="periodoSeleccionado_Root" @open="espacioDropdown = true" @close="espacioDropdown = false" class="w-full" @input="Accion_AL_Cambio_Periodo()" />
                                <div v-if="espacioDropdown" style="height: 200px; pointer-events: none;"></div>
                            </div>
                            <Buscar_InstitucionVue :key="periodoSeleccionado_Root.idperiodoescolar" v-if="periodoSeleccionado_Root" :periodoSeleccionado="periodoSeleccionado_Root" @change="changeBuscarInstitucion" />
                        </div>
                        <div v-if="Dinamica_Componentes == 'fichero_detalle' && periodoSeleccionado_Root">
                            <Detalle_x_Institucion :Info_Institucion="institucionSeleccionada" :periodoSeleccionado="periodoSeleccionado_Root" @change="changeDetalleInstitucion" />
                        </div>
                    </vx-card>
                </vs-tab>
                <!-- TAB: CRUD PRINCIPALES (Root) -->
                <vs-tab v-if="userRoot" label="Configuración Fichero">
                    <Fichero_Cruds_Principales />
                </vs-tab>
            </vs-tabs>
        </vx-card>
    </div>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from 'vue-select';
const Buscar_InstitucionVue = () => import('@/views/pedidos2/fichero_mercado/Buscar_Institucion.vue');
const Detalle_x_Institucion = () => import('@/views/pedidos2/fichero_mercado/Detalle_x_Institucion.vue');
const Fichero_Listado_Para_Aprobacion = () => import('@/views/pedidos2/fichero_mercado/Fichero_Listado_Completo.vue');
const Fichero_Cruds_Principales = () => import('@/views/pedidos2/fichero_mercado/screen_component_crud.vue');

export default {
    data() {
        return {
            Dinamica_Componentes: 'fichero_general', // Asegurar que está inicializada como null
            institucionSeleccionada: null,
            Periodo_Escolar: [],
            periodoSeleccionado: null, // Variable para controlar el período
            periodoSeleccionado_Root: null,
            activeTab: 0,
            keyAprobacion: 0,
            espacioDropdown: false,
        }
    },
    components: {
        'v-select': vSelect,
        Buscar_InstitucionVue,
        Detalle_x_Institucion,
        Fichero_Listado_Para_Aprobacion,
        Fichero_Cruds_Principales
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem("usuario")) || {};
        this.getPeriodosTodo();
        // Observamos los cambios de roles por si Vuex aún no los carga al inicio
        this.$watch(
            () => [this.userRoot, this.userAsesor],
            () => {
                if (this.userRoot !== false || this.userAsesor !== false) {
                    this.$nextTick(() => {
                        this.validacion_perfiles_fichero();
                    });
                }
            }
        );

        // Validamos si ya están disponibles al montar
        if (this.userRoot !== false || this.userAsesor !== false) {
            this.validacion_perfiles_fichero();
        }

        // Opcional: aviso si no tiene permisos
        // setTimeout(() => {
        //     let me = this;
        //     if (this.userRoot !== true && this.userAsesor !== true) {
        //         me.$vs.notify({
        //             text: 'No tiene permiso para acceder a esta sección',
        //             color: 'danger',
        //             iconPack: 'feather',
        //             icon: 'icon-x'
        //         });
        //     }
        // }, 4000);
    },

    methods: {
        Accion_AL_Cambio_Periodo() {
            this.regresarABuscador();
            // 👇 Reiniciar el componente de aprobación
            this.keyAprobacion += 1;
        },
        getPeriodosTodo() {
            this.$http.get(this.$server_url + 'GetPeriodoescolar_FicheroMercado')
                .then(res => {
                    this.Periodo_Escolar = res.data
                })
                .catch(err => console.error(err));
        },
        regresarABuscador() {
            // Notificación opcional
            this.Dinamica_Componentes = 'fichero_general';
            if (this.periodoSeleccionado == null && this.userAsesor) {
                this.$vs.notify({
                    title: 'Seleccionar',
                    text: 'Seleccione un periodo.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-search'
                });
            } else if (this.periodoSeleccionado_Root == null && this.userRoot) {
                this.$vs.notify({
                    title: 'Seleccionar',
                    text: 'Seleccione un periodo.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-search'
                });
            } else if ((this.periodoSeleccionado_Root != null && this.activeTab == 1 && this.userRoot == true)) {
                this.$vs.notify({
                    title: 'Búsqueda',
                    text: 'Búsque una institución.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-search'
                });
            }
        },
        tabBusqueda_ficheros() {
          this.periodoSeleccionado = null;
          this.periodoSeleccionado_Root = null;
          this.Dinamica_Componentes = 'fichero_general';
          this.regresarABuscador();
        },
        changeBuscarInstitucion(e) {
            // console.log(e, "heyyy");
            this.institucionSeleccionada = e.informacion_institucion;
            this.Dinamica_Componentes = 'fichero_detalle';
            // Notificación
            this.$vs.notify({
                title: 'Institución Seleccionada',
                text: `Se seleccionó: ${e.informacion_institucion.nombreInstitucion}`,
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
            });
        },
        changeListaFicheroCompleto(e) {
            if (e.verificar_ListadoFicheroCompleto == 'bloquearSelect') {
                this.Dinamica_Componentes = 'fichero_listado';
            } else if (e.verificar_ListadoFicheroCompleto == 'desbloquearSelect') {
                this.Dinamica_Componentes = '';
            }
        },
        changeDetalleInstitucion(e) {
            console.log(e, "heyyy2");
        },
        validacion_perfiles_fichero() {
            let me = this;
            // 👇 Aquí controlas qué tab se muestra por defecto
            if (me.userRoot === true) {
                // ROOT → puede ver ambos tabs → por defecto el primero
                me.activeTab = 0;
            } else if (me.userAsesor === true && me.userRoot === false) {
                // ASESOR → solo puede ver el segundo tab (Creación)
                me.activeTab = 2; // Solo hay uno visible, índice 0
            }
            // 🔧 Aseguramos no romper el vs-tabs si los tabs aún no existen
            me.$nextTick(() => {
                const tabs = document.querySelectorAll('.vs-tabs--ul li');
                if (tabs.length > 0 && tabs[me.activeTab]) {
                    tabs[me.activeTab].click();
                }
            });
        },
    }
};
</script>
