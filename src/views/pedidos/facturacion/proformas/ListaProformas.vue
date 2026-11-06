<template>
    <div class="lista-proformas-container">
        <!-- Header -->
        <div class="flex justify-between items-center mb-4">
            <div>
                <h3 class="text-xl font-bold">Proformas del Contrato</h3>
                <p class="text-sm text-gray-600">{{ contratoSeleccionado }}</p>
            </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
            <div class="loading-spinner mb-4">
                <div class="spinner"></div>
            </div>
            <p class="text-gray-600 text-lg">Cargando proformas...</p>
        </div>

        <!-- Tabla de proformas -->
        <vs-table v-else-if="proformas.length > 0" search :data="proformas" :max-items="10" pagination stripe>
            <template slot="header">
                <vs-chip color="primary">{{ proformas.length }} proformas encontradas</vs-chip>
            </template>

            <template slot="thead">
                <vs-th sort-key="prof_id" width="220">Código</vs-th>
                <vs-th>Inf. Proforma</vs-th>
                <vs-th>Detalles</vs-th>
                <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :data="proforma" :key="index" v-for="(proforma, index) in data">
                    <vs-td justify="center" align="center">
                        <div class="font-mono font-bold text-primary">
                            {{ proforma.prof_id || 'SOLICITUD' }}
                        </div>
                        <!-- Badge PERSEO -->
                        <div v-if="proforma.proforma_perseo === 1" class="mt-2">
                            <vs-chip color="rgb(134, 4, 98)" size="small">
                                <i class="fas fa-rocket mr-1"></i>PERSEO
                            </vs-chip>
                        </div>
                        <div v-if="proforma.empresa_logo" class="mt-2">
                            <img :src="proforma.empresa_logo" class="w-16 h-8 object-contain" />
                        </div>
                    </vs-td>

                    <vs-td>
                        <div style="max-width: 350px;">
                            <!-- Empresa -->
                            <div class="flex items-center mb-2">
                                <span class="font-semibold text-sm">{{ proforma.empresa_nombre }}</span>
                            </div>
                            
                            <!-- Cliente -->
                            <div class="mb-2">
                                <p class="text-xs text-gray-500 font-semibold">Cliente:</p>
                                <p class="font-semibold text-sm">{{ proforma.cliente_nombre || 'Sin cliente' }}</p>
                                <p class="text-xs text-gray-500">
                                    <span v-if="proforma.cliente_ruc" class="font-mono">RUC: {{ proforma.cliente_ruc }}</span>
                                    <span v-else>Sin RUC</span>
                                </p>
                                <p v-if="proforma.cliente_email" class="text-xs text-blue-500">{{ proforma.cliente_email }}</p>
                            </div>
                            
                            <!-- Despacho -->
                            <div>
                                <p class="text-xs text-gray-500 font-semibold">Despacho:</p>
                                <p class="font-semibold text-sm">{{ proforma.despacho_nombre || 'Sin despacho' }}</p>
                                <p class="text-xs text-gray-500">
                                    <span v-if="proforma.despacho_ruc" class="font-mono">RUC: {{ proforma.despacho_ruc }}</span>
                                    <span v-else>Sin RUC</span>
                                </p>
                                <p v-if="proforma.despacho_direccion" class="text-xs text-blue-500">{{ proforma.despacho_direccion }}</p>
                            </div>
                        </div>
                    </vs-td>

                    <vs-td>
                        <div style="max-width: 250px;">
                            <!-- Items y Cantidades -->
                            <div class="mb-2 flex gap-2">
                                <vx-tooltip text="Total de ítems">
                                    <vs-chip color="dark" size="small">
                                        <i class="fas fa-box mr-1"></i>{{ proforma.total_items }}
                                    </vs-chip>
                                </vx-tooltip>
                                <vx-tooltip text="Cantidad total libros">
                                    <vs-chip color="primary" size="small">
                                        <i class="fas fa-cubes mr-1"></i>{{ proforma.total_cantidad }}
                                    </vs-chip>
                                </vx-tooltip>
                            </div>
                            
                            <!-- Total -->
                            <div class="mb-2">
                                <p class="text-xs text-gray-500 font-semibold">Total:</p>
                                <span class="font-bold text-success text-lg">
                                    ${{ parseFloat(proforma.prof_total || 0).toFixed(2) }}
                                </span>
                            </div>
                            
                            <!-- Creado por -->
                            <div>
                                <p class="text-xs text-gray-500 font-semibold">Creado por:</p>
                                <p class="font-semibold text-sm">{{ proforma.creado_por }}</p>
                                <p class="text-xs text-gray-500 font-mono">{{ proforma.creado_por_cedula }}</p>
                            </div>
                            
                            <!-- Estado -->
                            <div class="mb-2">
                                <p class="text-xs text-gray-500 font-semibold">Estado:</p>
                                <vs-chip :color="getEstadoColor(proforma.prof_estado)" size="small">
                                    {{ getEstadoTexto(proforma.prof_estado) }}
                                </vs-chip><br>
                            </div>
                        </div>
                    </vs-td>

                    <vs-td>
                        <div class="flex flex-col gap-2">
                            <!-- Botón Editar - Solo visible si está Pendiente -->
                            <vs-button 
                                v-if="proforma.prof_estado === 1"
                                color="warning" 
                                size="small" 
                                type="flat"
                                icon="edit"
                                @click="editarProforma(proforma)"
                                title="Editar Proforma"
                            >
                                Editar
                            </vs-button>
                            
                            <!-- Botón Aprobar - Solo visible si está Pendiente -->
                            <vs-button 
                                v-if="proforma.prof_estado === 1"
                                color="success" 
                                size="small" 
                                type="flat"
                                icon="check"
                                @click="aprobarProforma(proforma)"
                                title="Aprobar Proforma"
                            >
                                Aprobar
                            </vs-button>
                            
                            <!-- Botón Anular - Solo visible si está Pendiente o Aprobado (NO Aprobado con pendiente) -->
                            <vs-button 
                                v-if="proforma.prof_estado === 1 || proforma.prof_estado === 3"
                                color="danger" 
                                size="small" 
                                type="flat"
                                icon="block"
                                @click="anularProforma(proforma)"
                                title="Anular Proforma"
                            >
                                Anular
                            </vs-button>
                            
                            <!-- Botón Eliminar - Solo visible si está Anulada -->
                            <vs-button 
                                v-if="proforma.prof_estado === 0"
                                color="danger" 
                                size="small" 
                                type="border"
                                icon="delete"
                                @click="eliminarProforma(proforma)"
                                title="Eliminar Proforma (Anulada)"
                            >
                                Eliminar
                            </vs-button>
                            
                            <!-- Botón Crear Venta - Solo visible si está Aprobado -->
                            <vs-button 
                                v-if="proforma.prof_estado === 3 || proforma.prof_estado === 6"
                                color="primary" 
                                size="small" 
                                type="gradient"
                                icon="shopping_cart"
                                @click="crearVenta(proforma)"
                                title="Crear Documento de Venta"
                            >
                                Crear Venta
                            </vs-button>
                            
                            <!-- Botón Ver PDF -->
                            <vs-button 
                                color="primary" 
                                size="small" 
                                type="border"
                                icon="visibility"
                                @click="verPDF(proforma)"
                                title="Ver PDF"
                            >
                                Ver PDF
                            </vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>

        <!-- Sin proformas -->
        <div v-else-if="!loading" class="bg-orange-50 p-8 rounded text-center">
            <i class="fas fa-file-invoice text-4xl text-orange-400 mb-4"></i>
            <h4 class="text-orange-600 font-bold mb-2">No hay proformas para este contrato</h4>
            <p class="text-orange-500">Aún no se han generado proformas para este contrato</p>
        </div>

        <!-- Popup hijo para PDF -->
        <vs-popup-history 
            v-if="popupPDF" 
            fullscreen 
            class="popup-pdf-hijo" 
            :title="`Proforma ${proformaSeleccionada.prof_id || ''}`" 
            :active.sync="popupPDF"
        >
            <ReporteProformaPDF 
                v-if="popupPDF"
                :proforma="proformaSeleccionada"
                @cerrar="popupPDF = false"
            />
        </vs-popup-history>

        <!-- Popup Aprobar Proforma -->
        <vs-popup-history
            class="aprobar" 
            title="Confirmación" 
            :active.sync="popupAprobar"
        >
            <p>
                ¿Confirma que desea aprobar la proforma #: {{ proformaSeleccionada ? proformaSeleccionada.prof_id : '' }} para la venta?
            </p>
            <div class="flex justify-center gap-3 mt-4">
                <vs-button @click="confirmarAprobar" type="relief">
                    Aceptar
                </vs-button>
                <vs-button @click="popupAprobar = false" color="danger" type="relief">
                    Cancelar
                </vs-button>
            </div>
        </vs-popup-history>

        <!-- Popup Anular Proforma -->
        <vs-popup-history 
            class="desactivar" 
            title="Anulación" 
            :active.sync="popupAnular"
        >
            <center>
                <p>
                    ¿Confirma que desea anular la proforma #: {{ proformaSeleccionada ? proformaSeleccionada.prof_id : '' }}?
                </p>
                <div class="flex justify-center mt-3">
                    <vs-button @click="confirmarAnular" type="relief">
                        Aceptar
                    </vs-button>
                    <vs-button @click="popupAnular = false" color="danger" type="relief" class="ml-2">
                        Cancelar
                    </vs-button>
                </div>
            </center>
        </vs-popup-history>

        <!-- Popup Eliminar Proforma -->
        <vs-popup-history
            class="eliminar" 
            title="Eliminación" 
            :active.sync="popupEliminar"
        >
            <p>
                ¿Confirma que desea eliminar la proforma #: {{ proformaSeleccionada ? proformaSeleccionada.prof_id : '' }}?
            </p>
            <div class="flex justify-center gap-3 mt-4">
                <vs-button @click="confirmarEliminar" type="relief">
                    Aceptar
                </vs-button>
                <vs-button @click="popupEliminar = false" color="danger" type="relief">
                    Cancelar
                </vs-button>
            </div>
        </vs-popup-history>

        <!-- Popup Crear Documento de Venta -->
        <vs-popup-history
            fullscreen 
            class="popup-venta-hijo" 
            :title="`Crear Documento de Venta - Proforma ${proformaSeleccionada ? proformaSeleccionada.prof_id : ''}`" 
            :active.sync="popupCrearVenta"
        >
            <DocumentoVenta 
                v-if="popupCrearVenta"
                :proforma="proformaSeleccionada"
                :contrato="contrato"
                @cerrar="cerrarCrearVenta"
                @actualizar="actualizarLista"
            />
        </vs-popup-history>
    </div>
</template>

<script>
const ReporteProformaPDF = () => import('@/views/pedidos/facturacion/imprimir/ReporteProformaPDF.vue');
const DocumentoVenta = () => import('@/views/pedidos/facturacion/Ventas/DocumentoVenta.vue');

export default {
    components: {
        ReporteProformaPDF,
        DocumentoVenta
    },
    props: {
        contrato: {
            type: String,
            required: true
        },
        librosPedido: {
            type: Array,
            required: false,
            default: () => ([])
        }
    },
    data() {
        return {
            proformas: [],
            loading: false,
            contratoSeleccionado: '',
            popupPDF: false,
            proformaSeleccionada: null,
            popupAprobar: false,
            popupAnular: false,
            popupEliminar: false,
            popupCrearVenta: false
        }
    },
    mounted() {
        this.contratoSeleccionado = this.contrato;
        this.getProformas();
    },
    methods: {
        getProformas() {
            let me = this;
            me.loading = true;
            
            const url = `${me.$server_url}get_proformas_por_contrato?contrato=${me.contrato}`;
            
            me.$http.get(url)
            .then(res => {
                me.loading = false;
                if (res.data.status === 200) {
                    me.proformas = res.data.data;
                } else {
                    me.proformas = [];
                }
            })
            .catch((e) => {
                me.loading = false;
                console.error('Error al cargar proformas:', e);
                me.$vs.notify({
                    text: 'Error al cargar las proformas',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            });
        },
        
        getEstadoColor(estado) {
            const colores = {
                0: 'danger',    // Anulado
                1: 'warning',   // Pendiente
                2: 'success',   // Finalizada
                3: 'primary',   // Aprobado
                4: 'dark',      // PreAprobado
                5: 'success',   // Aceptado
                6: 'warning'    // Aprobado con pendiente
            };
            return colores[estado] || 'dark';
        },
        
        getEstadoTexto(estado) {
            const textos = {
                0: 'Anulado',
                1: 'Pendiente',
                2: 'Finalizada',
                3: 'Aprobado',
                4: 'PreAprobado',
                5: 'Aceptado',
                6: 'Aprobado con pendiente'
            };
            return textos[estado] || 'Desconocido';
        },
        
        verPDF(proforma) {
            let me = this;
            me.proformaSeleccionada = proforma;
            me.popupPDF = true;
        },
        
        editarProforma(proforma) {
            console.log('🔧 Editando proforma desde ListaProformas:', proforma);
            console.log('   - ID:', proforma.id);
            console.log('   - Código:', proforma.prof_id);
            console.log('   - Estado:', proforma.prof_estado);
            console.log('   - Es Perseo:', proforma.proforma_perseo === 1);
            
            // Validar que tengamos un ID válido
            if (!proforma || !proforma.id) {
                console.error('❌ Error: Proforma sin ID válido', proforma);
                this.$vs.notify({
                    title: 'Error',
                    text: 'No se puede editar esta proforma: ID inválido',
                    color: 'danger'
                });
                return;
            }
            
            // Emitir evento al componente padre con el ID de la proforma Y el tipo
            this.$emit('editar-proforma', {
                id: proforma.id,
                esPerseo: proforma.proforma_perseo === 1
            });
        },
        
        aprobarProforma(proforma) {
            console.log('✅ Preparando aprobar proforma:', proforma);
            this.proformaSeleccionada = proforma;
            this.popupAprobar = true;
        },
        
        confirmarAprobar() {
            let me = this;
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            const idusuario = usuario.idusuario;
            
            me.$vs.loading();
            
            let formData = new FormData();
            formData.append('id', me.proformaSeleccionada.id);
            formData.append('prof_estado', 3); // Estado aprobado
            formData.append('idusuario', idusuario);
            
            me.$http.post(me.$server_url + 'Put_Estado_Proforma', formData)
                .then(res => {
                    me.$vs.loading.close();
                    me.popupAprobar = false;
                    
                    if (res.data.status == 200) {
                        me.$vs.notify({
                            title: 'Éxito',
                            text: 'Proforma aprobada exitosamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.getProformas();
                    } else {
                        me.$vs.notify({
                            title: 'Error',
                            text: 'No se pudo aprobar la proforma',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();
                    console.error('Error al aprobar proforma:', err);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al aprobar la proforma',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },
        
        anularProforma(proforma) {
            console.log('🚫 Preparando anular proforma:', proforma);
            this.proformaSeleccionada = proforma;
            this.popupAnular = true;
        },
        
        confirmarAnular() {
            let me = this;
            const usuario = JSON.parse(localStorage.getItem('usuario'));
            const idusuario = usuario.idusuario;
            
            me.$vs.loading();
            
            let formData = new FormData();
            formData.append('id', me.proformaSeleccionada.id);
            formData.append('prof_estado', 0); // Estado anulado
            formData.append('idusuario', idusuario);
            
            me.$http.post(me.$server_url + 'Put_Estado_Proforma', formData)
                .then(res => {
                    me.$vs.loading.close();
                    me.popupAnular = false;
                    
                    if (res.data.status == 200) {
                        me.$vs.notify({
                            title: 'Éxito',
                            text: 'Proforma anulada exitosamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.getProformas();
                    } else {
                        me.$vs.notify({
                            title: 'Error',
                            text: 'No se pudo anular la proforma',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();
                    console.error('Error al anular proforma:', err);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al anular la proforma',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },
        
        eliminarProforma(proforma) {
            console.log('🗑️ Preparando eliminar proforma:', proforma);
            this.proformaSeleccionada = proforma;
            this.popupEliminar = true;
        },
        
        confirmarEliminar() {
            let me = this;
            me.$vs.loading();
            
            me.$http.get(me.$server_url + `Delete_proforma?prof_id=${me.proformaSeleccionada.id}`)
                .then(res => {
                    me.$vs.loading.close();
                    me.popupEliminar = false;
                    
                    if (res.data.status == 200) {
                        me.$vs.notify({
                            title: 'Éxito',
                            text: 'Proforma eliminada exitosamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.getProformas();
                    } else {
                        me.$vs.notify({
                            title: 'Error',
                            text: res.data.message || 'No se pudo eliminar la proforma',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();
                    console.error('Error al eliminar proforma:', err);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al eliminar la proforma',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },
        
        crearVenta(proforma) {
            console.log('🛒 Preparando crear documento de venta:', proforma);
            this.proformaSeleccionada = proforma;
            this.popupCrearVenta = true;
        },
        
        cerrarCrearVenta() {
            this.popupCrearVenta = false;
        },
        
        actualizarLista() {
            this.popupCrearVenta = false;
            this.getProformas();
            
            // ✅ Emitir evento al padre para que recargue los datos del listado general
            this.$emit('venta-creada');
            console.log('✅ Evento venta-creada emitido al componente padre');
        },
        
        cerrar() {
            this.$emit('cerrar');
        }
    }
}
</script>

<style scoped>
.lista-proformas-container {
    padding: 20px;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner {
    width: 60px;
    height: 60px;
    border: 6px solid #f3f3f3;
    border-top: 6px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Z-index para popup hijo */
.popup-pdf-hijo {
    z-index: 51010 !important;
}

.popup-venta-hijo {
    z-index: 51010 !important;
}
</style>
