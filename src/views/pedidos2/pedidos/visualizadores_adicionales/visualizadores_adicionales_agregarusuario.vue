<template>
<!-- Popup para Buscar y Agregar Visualizadores (Grupo 11) -->
<vs-popup class="holamundo" title="Agregar Nuevo Visualizador" :active.sync="popupActivo">
    <div class="p-3">
        <p class="text-xs text-gray-500 mb-4">Lista de usuarios disponibles (Grupo Asesores). Filtra por cédula, nombre o apellido.</p>

        <!-- Buscador -->
        <div class="flex items-center space-x-2 mb-4">
            <vs-input v-model="buscarQuery" placeholder="Filtrar por cédula, nombre o apellido..." class="w-full search-input" @keyup.enter="cargarUsuariosGrupo11" icon="icon-search" icon-pack="feather" />
            <vs-button color="primary" type="filled" icon-pack="feather" icon="icon-search" @click="cargarUsuariosGrupo11" :disabled="cargandoUsuarios" class="search-btn shadow-md">
                Buscar
            </vs-button>
        </div>

        <!-- Lista de Usuarios -->
        <div v-if="usuariosGrupo11.length > 0" class="results-container pr-1 max-h-96 overflow-y-auto">
            <div v-for="user in usuariosGrupo11" :key="user.idusuario" class="user-result-row flex items-center justify-between p-3 mb-2 rounded-lg border border-solid border-gray-100 transition-all duration-300">
                <div class="flex items-center">
                    <vs-avatar color="dark" :text="user.nombres ? user.nombres[0] + (user.apellidos ? user.apellidos[0] : '') : 'U'" size="35px" class="mr-3" />
                    <div>
                        <span class="font-medium text-sm block text-gray-800">{{ user.nombres }} {{ user.apellidos }}</span>
                        <span class="text-xs text-gray-400 block">Cédula: {{ user.cedula }}</span>
                        <span class="text-xs text-primary font-medium">{{ user.grupo_descripcion || 'Grupo 11' }}</span>
                    </div>
                </div>

                <!-- Estado / Botón Agregar -->
                <div class="flex items-center">
                    <vs-chip v-if="estaAgregado(user)" color="warning" class="font-semibold text-xs py-1">
                        Ya agregado
                    </vs-chip>
                    <vx-tooltip v-else style="display: inline-block;" text="Agregar" position="top" color="success">
                        <vs-button radius color="success" type="gradient" icon-pack="feather" icon="icon-plus" size="small" class="shadow-md hover-scale" @click="agregarVisualizador(user)" />
                    </vx-tooltip>
                </div>
            </div>
        </div>

        <!-- Cargando -->
        <div v-else-if="cargandoUsuarios" class="flex flex-col items-center justify-center py-10">
            <vs-progress indeterminate color="primary" class="w-1/2"></vs-progress>
            <span class="text-xs text-gray-400 mt-3">Cargando usuarios...</span>
        </div>

        <!-- Sin Resultados -->
        <div v-else class="text-center py-10 border border-dashed border-gray-200 rounded-lg">
            <feather-icon icon="SearchIcon" svgClasses="w-8 h-8 text-gray-300 mb-2" />
            <p class="text-xs text-gray-400">No se encontraron usuarios activos del Grupo 11.</p>
        </div>
    </div>
</vs-popup>
</template>

<script>
export default {
    props: {
        active: {
            type: Boolean,
            default: false
        },
        pedido: {
            type: Object,
            default: () => ({})
        },
        visualizadores: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            usuariosGrupo11: [],
            buscarQuery: "",
            cargandoUsuarios: false
        };
    },
    computed: {
        popupActivo: {
            get() {
                return this.active;
            },
            set(val) {
                this.$emit('update:active', val);
            }
        }
    },
    watch: {
        active(val) {
            if (val) {
                this.buscarQuery = "";
                this.cargarUsuariosGrupo11();
            }
        }
    },
    methods: {
        cargarUsuariosGrupo11() {
            this.cargandoUsuarios = true;
            this.usuariosGrupo11 = [];

            const params = {
                action: 'Get_Usuarios_idgroup_11',
                buscar: this.buscarQuery
            };

            this.$http.get(this.$server_url + 'VerifcarMetodosGet_PedidosVisualizadores', {
                    params
                })
                .then(res => {
                    this.usuariosGrupo11 = res.data;
                })
                .catch(error => {
                    console.error('Error al cargar usuarios:', error);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un error al obtener la lista de usuarios.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                })
                .finally(() => {
                    this.cargandoUsuarios = false;
                });
        },
        estaAgregado(usuario) {
            return this.visualizadores.some(v => v.idusuario === usuario.idusuario);
        },
        agregarVisualizador(usuario) {
            if (this.estaAgregado(usuario)) {
                this.$vs.notify({
                    title: 'Ya asignado',
                    text: 'Este usuario ya está asignado como visualizador de este pedido.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            this.$vs.loading();
            const payload = {
                action: 'Post_agregar_usuario_extra',
                id_pedido: this.pedido.id_pedido,
                idusuario: usuario.idusuario
            };

            this.$http.post(this.$server_url + 'VerifcarMetodosPost_PedidosVisualizadores', payload)
                .then(res => {
                    this.$vs.notify({
                        title: 'Éxito',
                        text: 'Usuario agregado como visualizador adicional.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    this.$emit('added');
                })
                .catch(error => {
                    console.error('Error al agregar visualizador:', error);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'No se pudo agregar al visualizador.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                })
                .finally(() => {
                    this.$vs.loading.close();
                });
        }
    }
};
</script>

<style scoped>
.search-input>>>input {
    height: 42px;
    border-radius: 8px !important;
}

.search-btn {
    height: 42px;
    border-radius: 8px;
    padding: 0 20px;
}

.user-result-row {
    background: #fff;
}

.user-result-row:hover {
    background: #fbfcfe;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.03);
}

.results-container::-webkit-scrollbar {
    width: 6px;
}

.results-container::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
}

.results-container::-webkit-scrollbar-thumb {
    background: #cbd5e0;
    border-radius: 10px;
}

.results-container::-webkit-scrollbar-thumb:hover {
    background: #a0aec0;
}
</style>
