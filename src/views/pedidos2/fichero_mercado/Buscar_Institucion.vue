<template>
<div class="mt-2">
    <div class="flex flex-col space-y-4 w-full max-w-4xl mx-auto">
        <div class="flex flex-col space-y-1">
            <!-- Texto descriptivo encima del input -->
            <span class="text-gray-600 text-sm">Ingrese el nombre de la institución o punto de venta</span>
            <div class="flex space-x-2">
                <vs-input v-model="busqueda.nombreInstitucion" placeholder="Buscar Institución / Punto de venta" @keypress.enter="seachInstitucion_Verificar()" class="flex-1" />
                <vs-button type="filled" @click="seachInstitucion_Verificar()" icon="search">
                    Buscar
                </vs-button>
            </div>
        </div>
    </div>
    <br>
    <!-- {{ periodoSeleccionado }} -->
    <!-- Tabla de resultados -->
    <div class="row" v-if="array_Lista_Establecimientos.length > 0">
        <vx-card title="Selección de Institución" class="pb-3" fixed-height="true">
            <vs-table :max-items="array_Lista_Establecimientos.length" search pagination :data="array_Lista_Establecimientos">
                <template slot="header">
                    <vs-chip color="primary">
                        Cantidad: <b>{{ array_Lista_Establecimientos.length }}</b>
                    </vs-chip>
                </template>

                <template slot="thead">
                    <vs-th>Institución</vs-th>
                    <vs-th>Existe Fichero Registrado</vs-th>
                    <vs-th>Estado Fichero</vs-th>
                    <vs-th style="width: 12%; text-align: center;">Acciones</vs-th>
                </template>

                <template slot-scope="{ data }">
                    <vs-tr v-for="(tr, indextr) in data" :key="tr.idInstitucion">
                        <!-- Nombre -->
                        <vs-td>
                            <strong>{{ tr.nombreInstitucion }}</strong><br>
                            <small class="text-gray-600">
                                👤 <b>Asesor:</b> {{ tr.asesor_nombre || 'Sin asesor asignado' }}
                            </small>
                        </vs-td>

                        <!-- Existe fichero -->
                        <vs-td>
                            <span v-if="tr.existe_fichero" class="text-success font-semibold">Sí</span>
                            <span v-else class="text-danger font-semibold">No</span>
                        </vs-td>

                        <!-- Estado del fichero -->
                        <vs-td>
                            <template v-if="tr.existe_fichero">
                                <span v-if="tr.fm_estado == 1" class="text-green-500 font-semibold">Creado/Activo</span>
                                <span v-else-if="tr.fm_estado == 2" class="text-blue-500 font-semibold">Enviado para aprobación</span>
                                <span v-else-if="tr.fm_estado == 0" class="text-yellow-500 font-semibold">Inactivo</span>
                                <span v-else-if="tr.fm_estado == 3" style="color: rgb(16, 185, 129); font-weight: 600;">Aprobado</span>
                                <span v-else class="text-red-500 font-semibold">Estado desconocido</span>
                            </template>
                            <template v-else>
                                <span class="text-muted">—</span>
                            </template>
                        </vs-td>

                        <!-- Botones -->
                        <vs-td style="text-align: center;">
                            <vs-button @click="seleccionarInstitucion(tr)" color="primary" type="filled" icon-pack="feather" icon="icon-check" size="small">
                                Seleccionar
                            </vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
    </div>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
export default {
    data() {
        return {
            busqueda: {
                nombreInstitucion: ''
            },
            array_Lista_Establecimientos: [],
            institucionSeleccionada: null,
        };
    },
    props: {
        periodoSeleccionado: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    mounted() {},
    methods: {
        seachInstitucion_Verificar() {
            if (this.userRoot == true) {
                this.searchInstitucion_Root();
            } else if (this.userAsesor == true) {
                this.searchInstitucion_Asesor();
            }
        },
        searchInstitucion_Root() {
            if (!this.busqueda.nombreInstitucion || this.busqueda.nombreInstitucion.length < 4) {
                this.$vs.notify({
                    title: 'Alerta',
                    text: 'Debe ingresar al menos 4 caracteres.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            this.$vs.loading();
            this.array_Lista_Establecimientos = [];

            // 👇 Construyes el objeto de parámetros arriba
            let enviardata = {
                action: 'institucionesxRegion',
                busqueda: this.busqueda.nombreInstitucion,
                regionperiodo: this.periodoSeleccionado.region_idregion,
                periodoSelect: this.periodoSeleccionado.idperiodoescolar
            };

            // 👇 Lo pasas en params, axios lo convierte en query string automáticamente
            this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                    params: enviardata
                })
                .then(response => {
                    this.$vs.loading.close();
                    if (response.data && response.data.length > 0) {
                        this.array_Lista_Establecimientos = response.data;
                    } else {
                        this.$vs.notify({
                            title: 'Alerta',
                            text: 'No se encontraron datos',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                })
                .catch(error => {
                    this.$vs.loading.close();
                    console.error('Error al buscar instituciones:', error);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Error al buscar los datos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },

        searchInstitucion_Asesor() {
            let usuariorespo = localStorage.getItem("usuario");
            let usuariolocal = JSON.parse(usuariorespo);
            if (!this.busqueda.nombreInstitucion || this.busqueda.nombreInstitucion.length < 4) {
                this.$vs.notify({
                    title: 'Alerta',
                    text: 'Debe ingresar al menos 4 caracteres.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            this.$vs.loading();
            this.array_Lista_Establecimientos = [];

            // 👇 Construyes el objeto de parámetros arriba
            let enviardata = {
                action: 'institucionesxRegion_y_Asesor',
                busqueda: this.busqueda.nombreInstitucion,
                regionperiodo: this.periodoSeleccionado.region_idregion,
                idusuario_asesor: usuariolocal.idusuario,
                periodoSelect: this.periodoSeleccionado.idperiodoescolar
            };

            // 👇 Lo pasas en params, axios lo convierte en query string automáticamente
            this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                    params: enviardata
                })
                .then(response => {
                    this.$vs.loading.close();
                    if (response.data && response.data.length > 0) {
                        this.array_Lista_Establecimientos = response.data;
                    } else {
                        this.$vs.notify({
                            title: 'Alerta',
                            text: 'No se encontraron datos',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                })
                .catch(error => {
                    this.$vs.loading.close();
                    console.error('Error al buscar instituciones:', error);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Error al buscar los datos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },

        seleccionarInstitucion(institucion) {
            this.$emit('change', {
                informacion_institucion: institucion
            });
        },
    }
};
</script>
