<template>
    <div>
        <vx-card>
            <div class="gestion-header">
                <h3 class="gestion-titulo">
                    <i class="fa-solid fa-box-open mr-2"></i>
                    Gestión de Empacados Pendientes
                </h3>
                <p class="gestion-descripcion">
                    Listado de empacados que están guardados pero aún no han sido finalizados (estado = 1)
                </p>
            </div>

            <!-- Botón recargar -->
            <div class="mb-3">
                <vs-button color="primary" type="border" size="small" @click="cargarPendientes" :disabled="cargando">
                    <i class="fa-solid fa-sync-alt mr-1"></i> Recargar
                </vs-button>
                <vs-chip v-if="pendientes.length > 0" color="warning" class="ml-2">
                    {{ pendientes.length }} pendientes
                </vs-chip>
            </div>

            <!-- Tabla -->
            <vs-table
                v-if="!cargando"
                :data="pendientes"
                stripe
                pagination
                :max-items="15"
                search
                noDataText="No hay empacados pendientes de finalizar"
            >
                <template slot="thead">
                    <vs-th>Documento / Cliente</vs-th>
                    <vs-th>Empaque</vs-th>
                    <vs-th>Transporte / Chofer</vs-th>
                    <vs-th>Guía</vs-th>
                    <vs-th>Fecha Guardado</vs-th>
                    <vs-th width="120px">Acciones</vs-th>
                </template>

                <template slot-scope="{ data }">
                    <vs-tr v-for="(tr, i) in data" :key="i">
                        
                        <!-- Documento + Cliente -->
                        <vs-td>
                            <div class="font-bold text-primary">{{ tr.ven_codigo }}</div>
                            <small v-if="tr.empresa_nombre" class="text-gray-500">
                                <i class="fa-solid fa-building mr-1"></i>{{ tr.empresa_nombre }}
                            </small>
                            <div class="mt-1">
                                <div class="font-semibold">{{ tr.nombreInstitucion || '—' }}</div>
                                <small class="text-gray-500">{{ tr.cliente_nombre || 'Sin cliente' }}</small>
                            </div>
                        </vs-td>

                        <!-- Empaque -->
                        <vs-td>
                            <table class="tabla-empaque-mini">
                                <tr>
                                    <td>C. Grande:</td>
                                    <td><b>{{ tr.caja_grande || 0 }}</b></td>
                                </tr>
                                <tr>
                                    <td>C. Pequeña:</td>
                                    <td><b>{{ tr.caja_pequena || 0 }}</b></td>
                                </tr>
                                <tr>
                                    <td>Paquete:</td>
                                    <td><b>{{ tr.paquete || 0 }}</b></td>
                                </tr>
                            </table>
                        </vs-td>

                        <!-- Transporte / Chofer -->
                        <vs-td>
                            <div v-if="tr.trans_nombre" class="font-semibold text-sm">
                                <i class="fa-solid fa-truck mr-1 text-primary"></i>{{ tr.trans_nombre }}
                            </div>
                            <div v-if="tr.chofer_nombre" class="text-xs text-gray-500 mt-1">
                                <i class="fa-solid fa-user mr-1"></i>{{ tr.chofer_nombre }}
                            </div>
                        </vs-td>

                        <!-- Guía -->
                        <vs-td>
                            <vs-chip v-if="tr.guia_remision" color="success" size="small">
                                {{ tr.guia_remision }}
                            </vs-chip>
                            <span v-else class="text-gray-400 text-xs italic">Sin guía</span>
                        </vs-td>

                        <!-- Fecha -->
                        <vs-td>
                            <div class="text-xs text-gray-600">
                                <i class="fa-solid fa-clock mr-1"></i>
                                {{ formatearFecha(tr.fecha_guarda) }}
                            </div>
                        </vs-td>

                        <!-- Acciones -->
                        <vs-td>
                            <div class="flex gap-1">
                                <vx-tooltip text="Editar guía" position="top">
                                    <!-- <vs-button size="small" color="warning" type="filled" @click="abrirEditarGuia(tr)">
                                        <i class="fa-solid fa-pen"></i>
                                    </vs-button> -->
                                </vx-tooltip>
                                <vx-tooltip text="Finalizar empaque" position="top">
                                    <vs-button size="small" color="success" type="filled" @click="confirmarFinalizar(tr)">
                                        <i class="fa-solid fa-check"></i> Marcar como finalizado
                                    </vs-button>
                                </vx-tooltip>
                            </div>
                        </vs-td>

                    </vs-tr>
                </template>
            </vs-table>

            <!-- Loading -->
            <div v-if="cargando" class="text-center py-8">
                <div class="loading-spinner mb-3">
                    <div class="spinner"></div>
                </div>
                <p class="text-gray-600">Cargando empacados pendientes...</p>
            </div>
        </vx-card>

        <!-- Popup editar guía -->
        <vs-popup title="Editar Guía de Remisión" :active.sync="popupEditarGuia" class="popup-editar-guia-z">
            <div v-if="popupEditarGuia" class="p-3">
                <p class="mb-2 text-sm text-gray-500">Documento: <b>{{ registroEditar.ven_codigo }}</b></p>
                <vs-input
                    label="N° Guía de remisión"
                    v-model="guiaEditar"
                    placeholder="001-001-000000001"
                    class="w-full mb-4"
                />
                <div class="flex justify-end gap-2 mt-3">
                    <vs-button color="warning" type="flat" @click="cerrarEditarGuia">Cancelar</vs-button>
                    <vs-button color="primary" type="filled" @click="guardarGuia" :disabled="guardandoGuia">
                        {{ guardandoGuia ? 'Guardando...' : 'Guardar' }}
                    </vs-button>
                </div>
            </div>
        </vs-popup>

        <!-- Popup confirmar finalizar -->
        <vs-popup title="Finalizar Empaque" :active.sync="popupConfirmarFinalizar" class="popup-confirmar-finalizar-z">
            <div v-if="popupConfirmarFinalizar" class="p-4">
                <div class="confirmar-content">
                    <div class="confirmar-icon">
                        <i class="fa-solid fa-circle-check"></i>
                    </div>
                    <p class="confirmar-texto">
                        ¿Está seguro de finalizar el empaque del documento <b>{{ registroFinalizar.ven_codigo }}</b>?
                    </p>
                    <p class="confirmar-subtexto">
                        Esta acción marcará el empaque como finalizado y no podrá deshacerse.
                    </p>
                </div>
                <div class="flex justify-center gap-3 mt-4">
                     <vs-button color="success" type="filled" @click="finalizarEmpaque">
                        <i class="fa-solid fa-check mr-1"></i> Sí, finalizar
                    </vs-button>
                    <vs-button color="danger" type="flat" @click="popupConfirmarFinalizar = false">
                        Cancelar
                    </vs-button>
                </div>
            </div>
        </vs-popup>
    </div>
</template>

<script>
export default {
    name: 'PerseoDespachoHojaRutaGestionEmpacados',
    data() {
        return {
            pendientes: [],
            cargando: false,
            popupEditarGuia: false,
            popupConfirmarFinalizar: false,
            registroEditar: {},
            registroFinalizar: {},
            guiaEditar: '',
            guardandoGuia: false,
            usuario: {}
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.cargarPendientes()
    },
    methods: {
        cargarPendientes() {
            let me = this
            me.cargando = true
            me.$vs.loading()

            me.$http.get(me.$server_url + 'api/empaque-venta/pendientes')
                .then(res => {
                    me.pendientes = res.data || []
                    me.cargando = false
                    me.$vs.loading.close()
                    
                    if (me.pendientes.length === 0) {
                        me.$vs.notify({
                            text: 'No hay empacados pendientes de finalizar',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    }
                })
                .catch(() => {
                    me.cargando = false
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Error al cargar empacados pendientes',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },

        abrirEditarGuia(tr) {
            this.registroEditar = tr
            this.guiaEditar = tr.guia_remision || ''
            this.popupEditarGuia = true
        },

        guardarGuia() {
            let me = this
            me.guardandoGuia = true

            me.$http.post(me.$server_url + 'api/empaque-venta/actualizar-guia', {
                id: me.registroEditar.id,
                guia_remision: me.guiaEditar
            })
            .then(res => {
                me.guardandoGuia = false
                if (res.data && res.data.status === 200) {
                    const idx = me.pendientes.findIndex(r => r.id === me.registroEditar.id)
                    if (idx !== -1) me.$set(me.pendientes[idx], 'guia_remision', me.guiaEditar)
                    
                    me.$vs.notify({
                        text: 'Guía actualizada correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.popupEditarGuia = false
                    
                    // Recargar la lista después de guardar
                    me.cargarPendientes()
                } else {
                    me.$vs.notify({
                        text: (res.data && res.data.message) || 'Error al guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                }
            })
            .catch(() => {
                me.guardandoGuia = false
                me.$vs.notify({
                    text: 'Error al guardar la guía',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },

        cerrarEditarGuia() {
            this.popupEditarGuia = false
            // Recargar la lista al cerrar
            this.cargarPendientes()
        },

        confirmarFinalizar(tr) {
            this.registroFinalizar = tr
            this.popupConfirmarFinalizar = true
        },

        finalizarEmpaque() {
            let me = this
            let tr = me.registroFinalizar
            
            me.popupConfirmarFinalizar = false
            me.$vs.loading()

            me.$http.post(me.$server_url + 'api/empaque-venta/finalizar', {
                ven_codigo: tr.ven_codigo,
                id_empresa: tr.id_empresa,
                user_empaca: me.usuario.idusuario
            })
            .then(res => {
                me.$vs.loading.close()
                
                if (res.data && res.data.status === 200) {
                    me.$vs.notify({
                        text: 'Empaque finalizado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time: 3000
                    })
                    
                    // Remover de la lista
                    me.pendientes = me.pendientes.filter(p => p.id !== tr.id)
                    
                    // Emitir evento para que el padre recargue
                    me.$emit('empacadoFinalizado')
                } else {
                    me.$vs.notify({
                        text: (res.data && res.data.message) || 'Error al finalizar empaque',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                }
            })
            .catch(err => {
                me.$vs.loading.close()
                let mensaje = 'Error al finalizar empaque'
                if (err.response && err.response.data && err.response.data.message) {
                    mensaje = err.response.data.message
                }
                me.$vs.notify({
                    text: mensaje,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
            })
        },

        formatearFecha(fecha) {
            if (!fecha) return '—'
            const d = new Date(fecha)
            return d.toLocaleString('es-EC', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            })
        }
    }
}
</script>

<style scoped>
.gestion-header {
    margin-bottom: 20px;
    padding-bottom: 15px;
    border-bottom: 2px solid #e2e8f0;
}

.gestion-titulo {
    font-size: 18px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
    display: flex;
    align-items: center;
}

.gestion-descripcion {
    font-size: 13px;
    color: #64748b;
    margin: 0;
}

.tabla-empaque-mini {
    font-size: 11px;
    border-collapse: collapse;
}

.tabla-empaque-mini td {
    padding: 1px 6px 1px 0;
    color: #475569;
}

.tabla-empaque-mini td:last-child {
    color: #0f172a;
}

.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #007bff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.text-primary { color: #046AE7; }
.text-gray-500 { color: #64748b; }
.text-gray-400 { color: #94a3b8; }
.text-gray-600 { color: #475569; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }

/* Z-index para el modal de editar guía */
.popup-editar-guia-z >>> .vs-popup {
    z-index: 99999 !important;
}

.popup-editar-guia-z >>> .vs-popup--background {
    z-index: 99998 !important;
}

/* Z-index para el modal de confirmar finalizar */
.popup-confirmar-finalizar-z >>> .vs-popup {
    z-index: 99999 !important;
}

.popup-confirmar-finalizar-z >>> .vs-popup--background {
    z-index: 99998 !important;
}

/* Estilos para el contenido del modal de confirmación */
.confirmar-content {
    text-align: center;
    padding: 10px 0;
}

.confirmar-icon {
    font-size: 48px;
    color: #10b981;
    margin-bottom: 15px;
}

.confirmar-texto {
    font-size: 15px;
    color: #1e293b;
    margin-bottom: 10px;
    line-height: 1.5;
}

.confirmar-subtexto {
    font-size: 13px;
    color: #64748b;
    margin: 0;
}
</style>
