<template>
    <div class="listado-pedidos-obsequios">
        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
            <div class="loading-spinner mb-4">
                <div class="spinner"></div>
            </div>
            <p class="text-gray-600 text-lg">Cargando pedidos de obsequios...</p>
        </div>

        <!-- Sin pedidos -->
        <div v-else-if="pedidosObsequios.length === 0" class="bg-gray-50 p-8 rounded text-center">
            <i class="fas fa-gift text-4xl text-gray-400 mb-3"></i>
            <h4 class="text-gray-600 mb-2">No hay pedidos de obsequios</h4>
            <p class="text-gray-500">No se encontraron pedidos de obsequios para este contexto</p>
        </div>

        <!-- Tabla de pedidos -->
        <vs-table v-else stripe :data="pedidosObsequios" search>
            <template slot="header">
                <div class="flex justify-between items-center">
                    <vs-chip color="success">
                        {{ pedidosObsequios.length }} pedidos de obsequios encontrados
                    </vs-chip>
                    <!-- <vs-button  v-if="usuario.id_group == 1"
                        color="primary" 
                        type="gradient"
                        size="small"
                        @click="verTodosPedidosObsequios"
                        icon-pack="feather" 
                        icon="icon-list"
                    >
                        Ver todos los pedidos
                    </vs-button> -->
                </div>
            </template>

            <template slot="thead">
                <vs-th sort-key="id">ID</vs-th>
                <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                <vs-th sort-key="total_unidades">Unidades</vs-th>
                <vs-th sort-key="porcentaje_descuento">Descuento</vs-th>
                <vs-th sort-key="estado_libros_obsequios">Estado</vs-th>
                <vs-th sort-key="creador">Creador</vs-th>
                <vs-th sort-key="created_at">Fecha Creación</vs-th>
                <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :data="pedido" :key="index" v-for="(pedido, index) in data">
                    <vs-td>
                        <span class="font-bold text-primary">#{{ pedido.id }}</span>
                    </vs-td>

                    <vs-td>
                        <div>
                            <p class="font-semibold">{{ pedido.nombreInstitucion }}</p>
                            <p class="text-xs text-gray-500">{{ pedido.ciudad }}</p>
                        </div>
                    </vs-td>

                    <vs-td>
                        <vs-chip color="primary">
                            {{ pedido.total_unidades || 0 }} unidades
                        </vs-chip>
                    </vs-td>

                    <vs-td>
                        <vs-chip :color="pedido.porcentaje_descuento >= 100 ? 'success' : 'warning'">
                            {{ pedido.porcentaje_descuento || 0 }}%
                        </vs-chip>
                    </vs-td>

                    <vs-td>
                        <vs-chip :color="getEstadoColor(pedido.estado_libros_obsequios)">
                            {{ getEstadoTexto(pedido.estado_libros_obsequios) }}
                        </vs-chip>
                    </vs-td>

                    <vs-td>
                        <div>
                            <p class="text-sm">{{ pedido.creador || 'N/A' }}</p>
                            <p class="text-xs text-gray-500">{{ pedido.tipo_creador }}</p>
                        </div>
                    </vs-td>

                    <vs-td>
                        {{ formatearFecha(pedido.created_at) }}
                    </vs-td>

                    <vs-td>
                        <div class="flex flex-col gap-2">
                            <!-- Botón Aprobar - Solo si está pendiente (estado 3, 6 o 7) -->
                            <vs-button 
                                v-if="[3, 6, 7].includes(pedido.estado_libros_obsequios) && (usuario.id_group == 22 || usuario.id_group == 23 || usuario.id_group == 1)"
                                color="success" 
                                type="relief"
                                size="small"
                                @click="aprobarPedido(pedido)"
                                class="w-full"
                            >
                                <i class="fas fa-check mr-1"></i>
                                Aprobar
                            </vs-button>
                            
                            <!-- Botón Rechazar - Solo si está pendiente -->
                            <vs-button 
                                v-if="[3, 6, 7].includes(pedido.estado_libros_obsequios) && (usuario.id_group == 22 || usuario.id_group == 23 || usuario.id_group == 1)"
                                color="danger" 
                                type="relief"
                                size="small"
                                @click="rechazarPedido(pedido)"
                                class="w-full"
                            >
                                <i class="fas fa-times mr-1"></i>
                                Rechazar
                            </vs-button>
                            
                            <!-- Botón Generar Transacción - Solo si está aprobado (estado 4 o 5) -->
                            <vs-button 
                                v-if="[4, 5].includes(pedido.estado_libros_obsequios)"
                                color="primary" 
                                type="gradient" 
                                size="small"
                                @click="abrirModalVenta(pedido)"
                                class="w-full"
                            >
                                <i class="fas fa-cash-register mr-1"></i>
                                Generar Transacción
                            </vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>

        <!-- Modal para CREAR Transacción de Obsequios -->
        <ObsequiosModalPerseo 
            :visible.sync="popupObsequiosPerseo"
            :pedido-obsequio="pedidoObsequioSeleccionado"
            :pedido-original="pedidoOriginal"
            :totalizado="totalizado"
            :periodo-select="periodoSelect"
            @venta-obsequio-generada="handleVentaObsequioGenerada"
            @cerrar="cerrarModalObsequio"
        />
        
        <!-- Modal para Ver Todos los Pedidos de Obsequios -->
        <vs-popup 
            class="popup-libros-obsequios-full" 
            fullscreen 
            title="Listado Completo de Pedidos Libros Hijos Docentes/Obsequios" 
            :active.sync="popupLibrosObsequiosFull"
        >
            <div v-if="popupLibrosObsequiosFull" class="p-4">
                <LibrosObsequiosComponent :fromListadoVentas="true" />
            </div>
        </vs-popup>
    </div>
</template>

<script>
const ObsequiosModalPerseo = () => import('./ObsequiosModalPerseo.vue');
const LibrosObsequiosComponent = () => import('@/views/pedidos2/pedidos/libros/librosObsequios/librosObsequios.vue');

export default {
    name: 'ListadoPedidosObsequios',
    components: {
        ObsequiosModalPerseo,
        LibrosObsequiosComponent
    },
    props: {
        contrato: {
            type: String,
            required: false,
            default: null
        },
        totalizado: {
            type: Object,
            required: false,
            default: () => ({})
        },
        pedidoOriginal: {
            type: Object,
            required: false,
            default: () => ({})
        },
        periodoSelect: {
            type: Object,
            required: false,
            default: () => ({})
        }
    },
    data() {
        return {
            pedidosObsequios: [],
            loading: false,
            popupObsequiosPerseo: false,
            popupLibrosObsequiosFull: false,
            pedidoObsequioSeleccionado: null,
            usuario: JSON.parse(localStorage.getItem('usuario') || '{}')
        }
    },
    mounted() {
        this.obtenerPedidosObsequios();
    },
    watch: {
        contrato(newVal) {
            if (newVal) {
                this.obtenerPedidosObsequios();
            }
        },
        totalizado: {
            handler(newVal) {
                if (newVal && newVal.ca_codigo_agrupado) {
                    this.obtenerPedidosObsequios();
                }
            },
            deep: true
        }
    },
    methods: {
        async obtenerPedidosObsequios() {
            let me = this;

            var contratosConsulta = [];
            var totalizadoActual = me.totalizado ? me.totalizado : {};

            if (totalizadoActual && totalizadoActual.contratos) {
                contratosConsulta = totalizadoActual.contratos
                    .split(',')
                    .map(function(item) { return item ? item.trim() : ''; })
                    .filter(function(item) { return item !== ''; });
            }

            if (contratosConsulta.length === 0 && me.contrato) {
                contratosConsulta = [me.contrato];
            }

            if (contratosConsulta.length === 0) {
                me.pedidosObsequios = [];
                return;
            }

            me.loading = true;

            try {
                var solicitudes = contratosConsulta.map(function(contratoItem) {
                    return me.$http.get(me.$server_url + 'obtener_pedidos_obsequios_por_contrato', {
                        params: { contrato: contratoItem }
                    });
                });

                var respuestas = await Promise.all(solicitudes);
                var pedidosUnificados = [];
                var idsVistos = {};

                respuestas.forEach(function(respuesta) {
                    if (respuesta && respuesta.data && respuesta.data.status === 200 && respuesta.data.data && Array.isArray(respuesta.data.data)) {
                        respuesta.data.data.forEach(function(item) {
                            if (!idsVistos[item.id]) {
                                idsVistos[item.id] = true;
                                pedidosUnificados.push(item);
                            }
                        });
                    }
                });

                pedidosUnificados.sort(function(a, b) {
                    return (b.id || 0) - (a.id || 0);
                });

                me.loading = false;
                me.pedidosObsequios = pedidosUnificados;
            } catch (error) {
                me.loading = false;
                console.error('Error al obtener pedidos obsequios:', error);
                me.$vs.notify({
                    text: 'Error al cargar pedidos de obsequios',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                me.pedidosObsequios = [];
            }
        },
        
        getEstadoColor(estado) {
            const colores = {
                0: 'dark',      // abierto
                1: 'success',   // cerrado
                2: 'danger',    // rechazado
                3: 'primary',   // enviado
                4: 'success',   // aprobado gerencia
                5: 'success',   // aprobado facturador admin
                6: 'warning',   // aprobado/pendiente
                7: 'primary',   // preaprobado
                8: 'success',   // creado como obsequio
                9: '#d63ec2'    // creado como obsequio
            };
            return colores[estado] || 'dark';
        },
        
        getEstadoTexto(estado) {
            const textos = {
                0: 'Abierto',
                1: 'Cerrado',
                2: 'Rechazado',
                3: 'Enviado',
                4: 'Aprobado Gerencia',
                5: 'Aprobado Facturador',
                6: 'Aprobado/Pendiente',
                7: 'Preaprobado',
                8: 'Obsequio',
                9: 'Facturación Completa'
            };
            return textos[estado] || 'Desconocido';
        },
        
        formatearFecha(fecha) {
            if (!fecha) return 'N/A';
            const date = new Date(fecha);
            return date.toLocaleDateString('es-EC', { 
                year: 'numeric', 
                month: 'short', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        },
        
        abrirModalVenta(pedido) {
            console.log('Abriendo modal de obsequios para pedido:', pedido);
            this.pedidoObsequioSeleccionado = pedido;
            this.popupObsequiosPerseo = true;
        },
        
        cerrarModalObsequio() {
            this.popupObsequiosPerseo = false;
            this.pedidoObsequioSeleccionado = null;
        },
        
        handleVentaObsequioGenerada(ventaData) {
            console.log('Venta de obsequio generada:', ventaData);
            
            this.$vs.notify({
                title: '✅ Transacción Generada',
                text: 'La transacción de obsequios se generó exitosamente en Perseo',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check-circle',
                position: 'top-center'
            });
            
            // Cerrar modal
            this.cerrarModalObsequio();
            
            // Recargar lista de pedidos de obsequios
            this.obtenerPedidosObsequios();
            
            // Emitir evento al padre para que actualice otros componentes si es necesario
            this.$emit('venta-obsequio-generada', ventaData);
        },
        
        verTodosPedidosObsequios() {
            let me = this;
            
            // Guardar el pedido original en el store para que esté disponible en librosObsequios.vue
            me.$store.dispatch('setPedido', {});
            me.$store.dispatch('setPedido', me.pedidoOriginal);
            
            // Abrir el popup con el componente librosObsequios
            me.popupLibrosObsequiosFull = true;
            
            // Notificar al usuario
            me.$vs.notify({
                title: 'Abriendo Gestión de Libros Obsequios',
                text: 'Visualizando todos los pedidos de Libros Hijos Docentes/Obsequios',
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-list',
                position: 'top-right'
            });
        },
        
        aprobarPedido(pedido) {
            let me = this;
            
            me.$vs.dialog({
                type: 'confirm',
                color: 'success',
                title: 'Aprobar Pedido de Libros Obsequios',
                text: `¿Estás seguro de aprobar el pedido #${pedido.id}? No se generará venta, solo se cambiará el estado de aprobación según tu rol.`,
                accept: () => {
                    me.ejecutarAprobacion(pedido);
                },
                acceptText: 'Sí, aprobar',
                cancelText: 'Cancelar'
            });
        },
        
        ejecutarAprobacion(pedido) {
            let me = this;
            
            let formData = new FormData();
            formData.append('id', pedido.id);
            formData.append('observacion_asesor', 'Aprobado desde listado de ventas');
            formData.append('user_created_name', me.usuario.nombres + ' ' + me.usuario.apellidos);
            formData.append('user_created', me.usuario.idusuario);
            
            me.$vs.loading();
            me.$http.post(me.$server_url + 'AprobarLibrosObsequiosSoloEstado', formData)
                .then(function (res) {
                    me.$vs.loading.close();
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    }
                    
                    let mensaje = res.data.message || 'Pedido aprobado correctamente';
                    if (res.data.tipo_aprobacion) {
                        mensaje = `Pedido aprobado correctamente como ${res.data.tipo_aprobacion}`;
                    }
                    
                    me.$vs.notify({
                        text: mensaje,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    
                    // Recargar lista
                    me.obtenerPedidosObsequios();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error al aprobar el pedido',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                });
        },
        
        rechazarPedido(pedido) {
            let me = this;
            
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Rechazar Pedido de Libros Obsequios',
                text: `¿Estás seguro de rechazar el pedido #${pedido.id}? Esta acción cambiará el estado del pedido a rechazado.`,
                accept: () => {
                    me.ejecutarRechazo(pedido);
                },
                acceptText: 'Sí, rechazar',
                cancelText: 'Cancelar'
            });
        },
        
        ejecutarRechazo(pedido) {
            let me = this;
            
            let formData = new FormData();
            formData.append('id', pedido.id);
            formData.append('estado_libros_obsequios', 2);
            
            me.$vs.loading();
            me.$http.post(me.$server_url + 'changeEstadoPedidoLibrosObsequios', formData)
                .then(function (res) {
                    me.$vs.loading.close();
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    }
                    
                    me.$vs.notify({
                        text: 'Pedido rechazado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    
                    // Recargar lista
                    me.obtenerPedidosObsequios();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error al rechazar el pedido',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                });
        }
    }
}
</script>

<style scoped>
.listado-pedidos-obsequios {
    padding: 20px 0;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner {
    border: 3px solid rgba(0, 0, 0, 0.1);
    border-left-color: #4CAF50;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}
</style>

<style>
/* Estilos globales para el popup de libros obsequios - Solo cuando está activo */
.popup-libros-obsequios-full.con--active .vs-popup {
    z-index: 50000 !important;
}

.popup-libros-obsequios-full.con--active .vs-popup--background {
    background: rgba(0, 0, 0, 0.7) !important;
    z-index: 50000 !important;
}

.popup-libros-obsequios-full.con--active .vs-popup--content {
    z-index: 50001 !important;
    background: #fff !important;
}

/* Asegurar que los botones y elementos dentro del popup sean clickeables */
.popup-libros-obsequios-full .vx-card,
.popup-libros-obsequios-full vs-button,
.popup-libros-obsequios-full button,
.popup-libros-obsequios-full .vs-table,
.popup-libros-obsequios-full vs-radio,
.popup-libros-obsequios-full vs-chip {
    position: relative;
    z-index: auto;
    pointer-events: auto;
}

/* Asegurar que los botones de la tabla principal sean clickeables */
.listado-pedidos-obsequios vs-button,
.listado-pedidos-obsequios button {
    position: relative;
    z-index: 10;
    pointer-events: auto;
}

/* Z-index para diálogos de confirmación - Por encima del popup principal */
.vs-dialog {
    z-index: 52000 !important;
}

.vs-dialog-dark {
    z-index: 51999 !important;
}
</style>
