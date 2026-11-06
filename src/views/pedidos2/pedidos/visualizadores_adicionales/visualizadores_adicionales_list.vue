<template>
<div class="vx-row">
    <!-- Listado de Visualizadores Adicionales del Pedido -->
    <div class="vx-col w-full mb-base">
        <div class="premium-card p-6">
            <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4">
                <div class="mb-3 sm:mb-0">
                    <h4 class="text-primary font-semibold flex items-center">
                        <feather-icon icon="UsersIcon" class="mr-2 text-primary" svgClasses="w-6 h-6" />
                        Visualizadores Adicionales
                    </h4>
                    <span class="text-xs text-gray-500">Usuarios adicionales asignados para ver y dar seguimiento a este pedido.</span>
                </div>
                <vs-button color="primary" type="gradient" icon-pack="feather" icon="icon-user-plus" class="shadow-md hover-scale" @click="abrirPopupAgregar">
                    Agregar nuevo visualizador
                </vs-button>
            </div>

            <!-- Tabla de Visualizadores del Pedido -->
            <div v-if="visualizadores.length > 0" class="mt-4">
                <vs-table stripe :data="visualizadores" max-items="10" pagination class="modern-table">
                    <template slot="thead">
                        <vs-th>Usuario</vs-th>
                        <vs-th>Cédula</vs-th>
                        <vs-th>Rol / Grupo</vs-th>
                        <vs-th class="text-center">Acciones</vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="tr.nombres">
                                <div class="flex items-center">
                                    <vs-avatar color="primary" :text="tr.nombres ? tr.nombres[0] + (tr.apellidos ? tr.apellidos[0] : '') : 'U'" size="35px" class="mr-3 shadow-sm" />
                                    <div>
                                        <span class="font-medium text-sm block">{{ tr.nombres }} {{ tr.apellidos }}</span>
                                        <span class="text-xs text-gray-400">ID: {{ tr.idusuario }}</span>
                                    </div>
                                </div>
                            </vs-td>

                            <vs-td :data="tr.cedula">
                                <span class="text-sm font-medium">{{ tr.cedula || '---' }}</span>
                            </vs-td>

                            <vs-td :data="tr.grupo_descripcion">
                                <vs-chip color="primary" class="font-semibold text-xs py-1">
                                    {{ tr.grupo_descripcion || 'Usuario' }}
                                </vs-chip>
                            </vs-td>

                            <vs-td class="text-center">
                                <div class="flex items-center justify-center">
                                    <vx-tooltip style="display: inline-block;" text="Eliminar" position="top" color="danger">
                                        <vs-button radius color="danger" type="gradient" icon-pack="feather" icon="icon-trash-2" size="small" class="hover-scale shadow-md" @click="confirmarEliminar(tr)" />
                                    </vx-tooltip>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>

            <!-- Empty State -->
            <div v-else class="text-center py-12 flex flex-col items-center justify-center empty-state-container mt-4">
                <div class="empty-icon-wrap mb-4">
                    <feather-icon icon="UserXIcon" svgClasses="w-12 h-12 text-gray-400 stroke-1" />
                </div>
                <h5 class="text-gray-600 font-semibold mb-1">Sin visualizadores asignados</h5>
                <p class="text-xs text-gray-400 max-w-xs mb-4">Actualmente ningún usuario adicional tiene permisos de visualización. Añade uno nuevo haciendo clic en el botón.</p>
                <vs-button color="primary" type="border" icon-pack="feather" icon="icon-user-plus" size="small" @click="abrirPopupAgregar">
                    Agregar Visualizador
                </vs-button>
            </div>
        </div>
    </div>

    <!-- Componente Popup Modular de Agregar Visualizadores -->
    <VisualizadoresAdicionalesAdd class="informacionformhijo" :active.sync="popupActivo" :pedido="pedido" :visualizadores="visualizadores" @added="cargarVisualizadores"/>
</div>
</template>

<script>
import VisualizadoresAdicionalesAdd from "@/views/pedidos2/pedidos/visualizadores_adicionales/visualizadores_adicionales_agregarusuario.vue";

export default {
    components: {
        VisualizadoresAdicionalesAdd
    },
    props: {
        pedido: {
            type: Object,
            default: () => ({})
        },
    },
    data() {
        return {
            visualizadores: [],
            popupActivo: false,
            cargandoLista: false,
            usuario: JSON.parse(localStorage.getItem("usuario") || "Anonimo")
        };
    },
    created() {
        this.cargarVisualizadores();
    },
    methods: {
        cargarVisualizadores() {
            this.cargandoLista = true;
            this.$vs.loading();
            const params = {
                action: 'Get_Visualizadores_x_idpedido',
                id_pedido: this.pedido.id_pedido
            };
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_PedidosVisualizadores', {
                    params
                })
                .then(res => {
                    this.visualizadores = res.data;
                })
                .catch(error => {
                    console.error('Error al cargar visualizadores:', error);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'No se pudo cargar la lista de visualizadores.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                })
                .finally(() => {
                    this.$vs.loading.close();
                    this.cargandoLista = false;
                });
        },
        abrirPopupAgregar() {
            this.popupActivo = true;
        },
        confirmarEliminar(usuario) {
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar Eliminación',
                text: `¿Está seguro de que desea eliminar a ${usuario.nombres} ${usuario.apellidos} como visualizador de este pedido?`,
                acceptText: 'Eliminar',
                cancelText: 'Cancelar',
                accept: () => this.eliminarVisualizador(usuario)
            });
        },
        eliminarVisualizador(usuario) {
            this.$vs.loading();
            const payload = {
                action: 'Post_eliminar_usuario_extra',
                id_pedido: this.pedido.id_pedido,
                idusuario: usuario.idusuario
            };

            this.$http.post(this.$server_url + 'VerifcarMetodosPost_PedidosVisualizadores', payload)
                .then(res => {
                    this.$vs.notify({
                        title: 'Éxito',
                        text: 'Usuario eliminado de los visualizadores adicionales.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-trash-2'
                    });
                    this.cargarVisualizadores();
                })
                .catch(error => {
                    console.error('Error al eliminar visualizador:', error);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'No se pudo eliminar al visualizador.',
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
.premium-card {
    border-radius: 12px;
    box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.05);
    background: #fff;
    transition: all 0.3s ease;
}

.premium-card:hover {
    box-shadow: 0 6px 25px 0 rgba(0, 0, 0, 0.08);
}

.modern-table {
    border-collapse: separate;
    border-spacing: 0 8px;
}

.modern-table>>>th {
    background: #f8f9fa;
    color: #4a5568;
    font-weight: 600;
    font-size: 0.75rem;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    padding: 12px 16px;
    border-bottom: 2px solid #edf2f7;
}

.modern-table>>>td {
    padding: 12px 16px;
    background: #fff;
    border-top: 1px solid #edf2f7;
    border-bottom: 1px solid #edf2f7;
}

.modern-table>>>tr:hover td {
    background-color: #f7fafc;
}

.hover-scale {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.hover-scale:hover {
    transform: scale(1.08);
}

.empty-state-container {
    background: #fbfbfb;
    border-radius: 10px;
    border: 1px dashed #e2e8f0;
}

.empty-icon-wrap {
    background: #edf2f7;
    padding: 16px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
}

.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
