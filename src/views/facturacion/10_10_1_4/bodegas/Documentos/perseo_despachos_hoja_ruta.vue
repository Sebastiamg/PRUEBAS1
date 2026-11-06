<template>
    <div>
        <vx-card>
            <!-- Filtros -->
            <vs-card class="mb-3">
                <!-- Radios -->
                <div class="hr-note mb-2">
                    <small class="text-gray-500">Filtro por la última fecha que se guarda</small>
                </div>
                <div class="hr-radios">
                    <vs-radio v-model="modo" vs-value="hoy" vs-name="hr-modo" @input="cargar">Fecha de hoy</vs-radio>
                    <vs-radio v-model="modo" vs-value="rango" vs-name="hr-modo">Entre fechas</vs-radio>
                    <vs-radio v-model="modo" vs-value="responsable" vs-name="hr-modo">Responsable y fechas</vs-radio>
                </div>

                <!-- Modo: entre fechas -->
                <div v-if="modo === 'rango' || modo === 'responsable'" class="hr-filtros mt-3">
                    <div class="hr-filtro-item">
                        <label class="hr-label">Fecha inicio</label>
                        <input type="date" v-model="fechaInicio" class="hr-input-fecha" @change="validarFechas" />
                    </div>
                    <div class="hr-filtro-item">
                        <label class="hr-label">Fecha fin</label>
                        <input type="date" v-model="fechaFin" class="hr-input-fecha" @change="validarFechas" />
                    </div>
                    <div v-if="modo === 'responsable'" class="hr-filtro-item" style="min-width:340px">
                        <label class="hr-label">Responsable (chofer)</label>
                        <v-select
                            :options="choferes"
                            :reduce="c => c.cedula"
                            :getOptionLabel="c => c.nombre_completo + ' — ' + c.cedula"
                            v-model="choferFiltro"
                            placeholder="-- Seleccione un chofer --"
                            class="w-full hr-chofer-select"
                        >
                            <template #option="c">
                                <div style="display:flex;flex-direction:column;gap:1px;padding:2px 0">
                                    <span style="font-size:13px;font-weight:600;color:#1e293b">{{ c.nombre_completo }}</span>
                                    <span style="font-size:11px;color:#64748b">{{ c.cedula }}</span>
                                </div>
                            </template>
                            <template #no-options>Sin choferes disponibles</template>
                        </v-select>
                    </div>
                </div>

                <div v-if="errorFechas" class="hr-error-fecha mt-2">
                    <i class="fa-solid fa-triangle-exclamation mr-1"></i>{{ errorFechas }}
                </div>

                <div class="hr-filtros mt-3">
                    <vs-button color="primary" type="filled" @click="cargar" :disabled="cargando">
                        <i class="fa-solid fa-search mr-1"></i> Consultar
                    </vs-button>
                    <vs-button
                        color="warning"
                        type="filled"
                        @click="popupGestionPendientes = true"
                    >
                        <i class="fa-solid fa-box-open mr-1"></i> Empacados Pendientes
                    </vs-button>
                    <vs-button
                        v-if="registros.length > 0"
                        color="success"
                        type="filled"
                        @click="popupReporte = true"
                    >
                        <i class="fa-solid fa-print mr-1"></i> Generar Reporte PDF
                    </vs-button>
                    <vs-chip v-if="registros.length > 0" color="primary">
                        {{ registros.length }} registros
                    </vs-chip>
                </div>
            </vs-card>

            <!-- Tabla -->
            <vs-table
                :data="registros"
                stripe
                pagination
                :max-items="25"
                search
                class="mt-4"
                noDataText="Sin registros para el rango seleccionado"
            >
                <template slot="thead">
                    <vs-th>Documento / Destino</vs-th>
                    <vs-th>Empaque</vs-th>
                    <vs-th>Transporte / Chofer</vs-th>
                    <vs-th width="280px">Guía / Observación</vs-th>
                </template>

                <template slot-scope="{ data }">
                    <vs-tr v-for="(tr, i) in data" :key="i">

                        <!-- Documento + Destino -->
                        <vs-td>
                            <div class="font-bold text-primary">{{ tr.ven_codigo }}</div>
                            <small v-if="tr.empresa_nombre" class="text-gray-500">
                                <i class="fa-solid fa-building mr-1"></i>{{ tr.empresa_nombre }}
                            </small>
                            <div v-if="tr.fecha_empaca" class="text-xs text-gray-400 mt-1">
                               Fecha empacado: <i class="fa-solid fa-clock mr-1"></i>{{ tr.fecha_empaca }}
                            </div>
                            <div class="mt-1">
                                <div class="font-semibold">{{ tr.nombreInstitucion || '—' }}</div>
                                <p><b>Cliente:</b> {{ tr.cliente_nombre || 'Sin cliente' }}</p>
                                <small v-if="tr.ciudad" class="text-gray-500">
                                    <i class="fa-solid fa-location-dot mr-1"></i>{{ tr.ciudad }}
                                </small>
                                <div v-if="tr.direccion" class="text-xs text-gray-400">{{ tr.direccion }}</div>
                            </div>
                        </vs-td>

                        <!-- Empaque -->
                        <vs-td>
                            <table class="hr-tabla-empaque">
                                <tr>
                                    <td>Caja grande</td>
                                    <td><b>{{ tr.caja_grande || 0 }}</b></td>
                                </tr>
                                <tr>
                                    <td>Caja pequeña</td>
                                    <td><b>{{ tr.caja_pequena || 0 }}</b></td>
                                </tr>
                                <tr>
                                    <td>Paquete</td>
                                    <td><b>{{ tr.paquete || 0 }}</b></td>
                                </tr>
                            </table>
                            <div v-if="tr.estado == 1">
                                <p class="text-danger font-medium">Empaque sin finalizar</p>
                            </div>
                        </vs-td>

                        <!-- Transporte / Chofer -->
                        <vs-td>
                            <div v-if="tr.trans_nombre" class="font-semibold">
                                <i class="fa-solid fa-truck mr-1 text-primary"></i>{{ tr.trans_nombre }}
                            </div>
                            <div v-if="tr.chofer_nombre" class="text-xs text-gray-500 mt-1">
                                <i class="fa-solid fa-user mr-1"></i>{{ tr.chofer_nombre }}
                                <span v-if="tr.chofer_cedula"> · {{ tr.chofer_cedula }}</span>
                            </div>
                        </vs-td>

                        <!-- Guía / Obs -->
                        <vs-td>
                            <div class="hr-guia-col">
                                <div class="hr-guia-top">
                                    <vs-chip v-if="tr.guia_remision" color="success" class="hr-guia-chip">
                                        <i class="fa-solid fa-file-lines mr-1"></i>{{ tr.guia_remision }}
                                    </vs-chip>
                                    <span v-else class="text-gray-400 text-xs italic">Sin guía remisión</span>
                                    <vx-tooltip text="Editar guía de remisión" position="top">
                                        <vs-button size="small" color="warning" type="filled" @click="abrirEditarGuia(tr)" class="hr-btn-editar">
                                            <i class="fa-solid fa-pen"></i>
                                        </vs-button>
                                    </vx-tooltip>
                                </div>
                                <div v-if="tr.ven_observacion" class="hr-observacion">
                                    <b>Facturador:</b> {{ tr.ven_observacion }}
                                </div>
                                <div v-if="tr.idtipodoc == 12 && tr.observacion_guia" class="hr-observacion" style="border-left-color: #10b981;">
                                    <b>Asesor:</b> {{ tr.observacion_guia }}
                                </div>
                                <div v-if="tr.observacion_empacado" class="hr-observacion" style="border-left-color: #f59e0b;">
                                    <b>Empacado:</b> {{ tr.observacion_empacado }}
                                </div>
                            </div>
                        </vs-td>

                    </vs-tr>
                </template>
            </vs-table>
        <!-- Popup editar guía -->
        <vs-popup title="Editar Guía de Remisión" :active.sync="popupEditarGuia">
            <div v-if="popupEditarGuia" class="p-2">
                <p class="mb-2 text-sm text-gray-500">Documento: <b>{{ registroEditar.ven_codigo }}</b></p>
                <vs-input
                    label="N° Guía de remisión"
                    v-model="guiaEditar"
                    placeholder="001-001-000000001"
                    class="w-full mb-4"
                />
                <div class="flex justify-end gap-2 mt-3">
                    <vs-button color="warning" type="flat" @click="popupEditarGuia = false">Cancelar</vs-button>
                    <vs-button color="primary" type="filled" @click="guardarGuia" :disabled="guardandoGuia">
                        {{ guardandoGuia ? 'Guardando...' : 'Guardar' }}
                    </vs-button>
                </div>
            </div>
        </vs-popup>

        <!-- Popup reporte PDF -->
        <vs-popup fullscreen v-if="popupReporte" :active.sync="popupReporte" title="Reporte Hoja de Ruta">
            <div class="text-center mb-3">
                <vs-button @click="m_imprimirTodos('12px', 'hoja_ruta_' + fechaInicio + '_' + fechaFin, '0px', '')">
                    <i class="fa-solid fa-print mr-1"></i> Imprimir
                </vs-button>
            </div>
            <vx-card id="seccionImprimir2">
                <PerseoDespachoExportRuta :datos="registros" />
            </vx-card>
        </vs-popup>

        <!-- Popup gestión de pendientes -->
        <vs-popup 
            fullscreen 
            v-if="popupGestionPendientes" 
            :active.sync="popupGestionPendientes" 
            title="Gestión de Empacados Pendientes"
        >
            <PerseoDespachoHojaRutaGestionEmpacados 
                @empacadoFinalizado="onEmpacadoFinalizado"
            />
        </vs-popup>

        </vx-card>
    </div>
</template>

<script>
import vSelect from 'vue-select'
import imprimirMixin from '@/mixins/Pedidosmix'
const PerseoDespachoExportRuta = () => import('@/views/facturacion/10_10_1_4/bodegas/Reportes/perseo_despachos_export_ruta.vue')
const PerseoDespachoHojaRutaGestionEmpacados = () => import('@/views/facturacion/10_10_1_4/bodegas/Documentos/perseo_despachos_hoja_ruta_gestion_empacados.vue')

export default {
    name: 'PerseoDespachoHojaRuta',
    mixins: [imprimirMixin],
    components: { 
        PerseoDespachoExportRuta, 
        PerseoDespachoHojaRutaGestionEmpacados,
        'v-select': vSelect 
    },
    data() {
        const hoy = new Date()
        const hoyLocal = hoy.getFullYear() + '-' +
            String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
            String(hoy.getDate()).padStart(2, '0')
        const primerDia = new Date(hoy.getFullYear(), hoy.getMonth(), 1)
        const primerDiaLocal = primerDia.getFullYear() + '-' +
            String(primerDia.getMonth() + 1).padStart(2, '0') + '-' +
            String(primerDia.getDate()).padStart(2, '0')
        return {
            modo:          'hoy',
            fechaInicio:   primerDiaLocal,
            fechaFin:      hoyLocal,
            choferFiltro:  null,
            choferes:      [],
            errorFechas:   '',
            registros:     [],
            cargando:      false,
            popupReporte:  false,
            popupGestionPendientes: false,
            popupEditarGuia: false,
            registroEditar:  {},
            guiaEditar:      '',
            guardandoGuia:   false
        }
    },
    mounted() {
        this.cargarChoferes()
        this.cargar()
    },
    watch: {
        modo(val) {
            this.registros    = []
            this.choferFiltro = null
            this.errorFechas  = ''
            if (val === 'hoy') {
                this.cargar()
            }
        },
        choferFiltro(val) {
            if (!val) {
                this.registros = []
                return
            }
            if (this.fechaInicio && this.fechaFin && this.validarFechas()) {
                this.cargar()
            }
        }
    },
    methods: {
        abrirEditarGuia(tr) {
            this.registroEditar  = tr
            this.guiaEditar      = tr.guia_remision || ''
            this.popupEditarGuia = true
        },
        guardarGuia() {
            const me = this
            me.guardandoGuia = true
            me.$http.post(me.$server_url + 'api/empaque-venta/actualizar-guia', {
                id:            me.registroEditar.id,
                guia_remision: me.guiaEditar
            })
            .then(res => {
                me.guardandoGuia = false
                if (res.data && res.data.status === 200) {
                    // actualizar en la lista local sin recargar
                    const idx = me.registros.findIndex(function(r) { return r.id === me.registroEditar.id })
                    if (idx !== -1) me.$set(me.registros[idx], 'guia_remision', me.guiaEditar)
                    me.$vs.notify({ text: 'Guía actualizada', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                    me.popupEditarGuia = false
                } else {
                    me.$vs.notify({ text: (res.data && res.data.message) || 'Error al guardar', color: 'danger', iconPack: 'feather', icon: 'icon-x' })
                }
            })
            .catch(() => {
                me.guardandoGuia = false
                me.$vs.notify({ text: 'Error al guardar la guía', color: 'danger', iconPack: 'feather', icon: 'icon-x' })
            })
        },
        cargarChoferes() {
            var me = this
            me.$http.get(me.$server_url + 'VerifcarMetodosGet_UsuarioController?action=Get_Choferes')
                .then(function(res) {
                    me.choferes = (res.data || []).map(function(u) {
                        return {
                            idusuario:       u.idusuario,
                            cedula:          u.cedula,
                            nombre_completo: u.nombres + ' ' + u.apellidos,
                            cedula_display:  u.cedula
                        }
                    })
                })
                .catch(function() {})
        },
        validarFechas() {
            this.errorFechas = ''
            if (!this.fechaInicio || !this.fechaFin) return true
            if (this.fechaInicio > this.fechaFin) {
                this.errorFechas = 'La fecha inicio no puede ser mayor a la fecha fin'
                return false
            }
            if (this.fechaFin < this.fechaInicio) {
                this.errorFechas = 'La fecha fin no puede ser menor a la fecha inicio'
                return false
            }
            return true
        },
        cargar() {
            var me = this
            me.errorFechas = ''

            if (me.modo === 'hoy') {
                var hoy = new Date()
                var hoyStr = hoy.getFullYear() + '-' +
                    String(hoy.getMonth() + 1).padStart(2, '0') + '-' +
                    String(hoy.getDate()).padStart(2, '0')
                me.fechaInicio = hoyStr
                me.fechaFin    = hoyStr
            } else {
                if (!me.validarFechas()) return
                if (me.modo === 'responsable' && !me.choferFiltro) {
                    me.$vs.notify({ text: 'Seleccione un responsable', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                    return
                }
            }

            me.cargando = true
            me.$vs.loading()

            var url = 'api/empaque-venta/hoja-ruta?fecha_inicio=' + me.fechaInicio + '&fecha_fin=' + me.fechaFin
            if (me.modo === 'responsable' && me.choferFiltro) {
                url += '&cedula_chofer=' + me.choferFiltro
            }

            me.$http.get(me.$server_url + url)
                .then(function(res) {
                    me.registros = res.data || []
                    me.cargando  = false
                    me.$vs.loading.close()
                    if (me.registros.length === 0) {
                        me.$vs.notify({ text: 'Sin registros para el filtro seleccionado', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                    }
                })
                .catch(function() {
                    me.cargando = false
                    me.$vs.loading.close()
                    me.$vs.notify({ text: 'Error al cargar la hoja de ruta', color: 'danger', iconPack: 'feather', icon: 'icon-x' })
                })
        },
        
        onEmpacadoFinalizado() {
            // Recargar el listado cuando se finaliza un empacado desde el modal
            this.$vs.notify({
                text: 'Recargando listado...',
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-refresh-cw',
                time: 2000
            })
            this.cargar()
        }
    }
}
</script>

<style scoped>
.hr-guia-col { display: flex; flex-direction: column; gap: 6px; min-width: 220px; }
.hr-guia-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.hr-guia-chip { flex-shrink: 0; }
.hr-btn-editar { flex-shrink: 0; min-width: 32px; padding: 0 8px; }
.hr-observacion { font-size: 12px; color: #475569; background: #f8fafc; border-left: 3px solid #cbd5e1; padding: 4px 8px; border-radius: 0 4px 4px 0; word-break: break-word; max-width: 260px; }
.hr-radios { display: flex; gap: 20px; flex-wrap: wrap; align-items: center; }
.hr-error-fecha { font-size: 12px; color: #ef4444; font-weight: 600; }
.hr-filtros { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; padding: 4px 0; }
.hr-filtro-item { display: flex; flex-direction: column; gap: 3px; }
.hr-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
.hr-input-fecha { padding: 5px 10px; border: 1px solid #cbd5e1; border-radius: 6px; font-size: 13px; color: #334155; background: #f8fafc; outline: none; }
.hr-input-fecha:focus { border-color: #046AE7; box-shadow: 0 0 0 2px rgba(4,106,231,0.1); }
.hr-tabla-empaque { font-size: 11px; border-collapse: collapse; }
.hr-tabla-empaque td { padding: 1px 6px 1px 0; color: #475569; }
.hr-tabla-empaque td:last-child { color: #0f172a; }
.text-primary { color: #046AE7; }
.text-gray-500 { color: #64748b; }
.text-gray-400 { color: #94a3b8; }
.text-gray-300 { color: #cbd5e1; }
.font-bold { font-weight: 700; }
.font-semibold { font-weight: 600; }
.hr-chofer-select >>> .vs__selected { color: #1e293b !important; font-size: 13px; font-weight: 500; }
.hr-chofer-select >>> .vs__dropdown-option { color: #1e293b; font-size: 13px; padding: 8px 12px; }
.hr-chofer-select >>> .vs__dropdown-option--highlight { background: #eff6ff; color: #1d4ed8; }
.hr-chofer-select >>> .vs__search { color: #1e293b; }
.hr-chofer-select >>> .vs__dropdown-menu { border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }
</style>
