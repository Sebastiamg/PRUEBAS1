<template>
    <div class="emp-wrap">
        <!-- Info doc -->
        <div class="emp-doc-info">
            <span class="emp-doc-codigo">{{ ObjectedSelected.ven_codigo }}</span>
            <span class="emp-doc-cliente">
                <i class="fa-solid fa-user"></i>
                {{ ObjectedSelected.nombre_cliente || ObjectedSelected.cliente_nombre }}
                <span v-if="ObjectedSelected.nombreInstitucion"> — {{ ObjectedSelected.nombreInstitucion }}</span>
            </span>
        </div>
        <span v-if="guarda_nombre">
            <i class="fa-solid fa-user mr-1"></i>Guardado por: {{ guarda_nombre }}
            <span v-if="fechaGuarda" class="ml-2"><i class="fa-solid fa-clock mr-1"></i>Fecha guardado: {{ fechaGuarda }}</span>
        </span>
        <!-- Banner solo ver -->
        <div v-if="soloVer" class="emp-solo-ver-banner">
            <i class="fa-solid fa-lock mr-2"></i>
            <span>Empaque finalizado — solo lectura</span>
            <span v-if="empacadorNombre" class="emp-solo-ver-sep">|</span>
            <span v-if="empacadorNombre"><i class="fa-solid fa-user mr-1"></i>Finalizado por: {{ empacadorNombre }}</span>
            <span v-if="fechaEmpaca" class="emp-solo-ver-sep">|</span>
            <span v-if="fechaEmpaca"><i class="fa-solid fa-clock mr-1"></i>Fecha finalización: {{ fechaEmpaca }}</span>
        </div>

        <!-- Detalle de productos -->
        <div v-if="detalleItems.length > 0" class="emp-detalle">
            <div class="emp-detalle-header" @click="mostrarDetalle = !mostrarDetalle" style="cursor:pointer">
                <i class="fa-solid fa-list-ul mr-1"></i> Detalle del documento
                <span class="emp-detalle-badge">{{ detalleItems.length }} ítems</span>
                <i :class="mostrarDetalle ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye'" class="ml-auto" style="color:#64748b"></i>
            </div>
            <div v-if="mostrarDetalle" class="emp-detalle-tabla">
                <div class="emp-detalle-row emp-detalle-thead">
                    <span>Código</span>
                    <span>Producto</span>
                    <span class="text-center">Cant.</span>
                </div>
                <div
                    v-for="(item, i) in detalleItems"
                    :key="'det-' + i"
                    class="emp-detalle-row"
                >
                    <span class="emp-detalle-codigo">{{ item.pro_codigo }}</span>
                    <span class="emp-detalle-nombre">{{ item.pro_nombre }}</span>
                    <span class="emp-detalle-cant">{{ item.det_ven_cantidad }}</span>
                </div>
            </div>
        </div>

        <!-- Cantidades en fila compacta -->
        <div class="emp-cantidades">
            <div class="emp-cant-item" v-for="campo in camposCantidad" :key="campo.key">
                <span class="emp-cant-label">{{ campo.label }} <span v-if="!soloVer" class="emp-required">*</span></span>
                <div class="emp-cant-controls">
                    <button class="emp-btn-num" @click="!soloVer && (form[campo.key] = Math.max(0, form[campo.key] - 1))" :disabled="soloVer">−</button>
                    <input type="number" class="emp-num-input" v-model.number="form[campo.key]" min="0" :readonly="soloVer" />
                    <button class="emp-btn-num emp-btn-plus" @click="!soloVer && form[campo.key]++" :disabled="soloVer">+</button>
                </div>
            </div>
        </div>
        <p v-if="!soloVer" class="emp-hint">* Al menos uno debe ser mayor a 0</p>

        <!-- Transporte + Guía -->
        <div class="emp-row-2">
            <div class="emp-field">
                <label class="emp-label">
                    Transporte 
                    <span v-if="!soloVer && form.id_chofer !== 0" class="emp-required">*</span>
                    <span v-if="form.id_chofer === 0" class="text-xs text-gray-400 ml-1">(opcional)</span>
                </label>
                <v-select
                    :options="transportes"
                    label="trans_nombre"
                    :reduce="t => t.trans_codigo"
                    v-model="form.id_transporte"
                    placeholder="-- Seleccione --"
                    class="w-full"
                    :loading="loadingTransporte"
                    :disabled="soloVer"
                />
            </div>
            <div class="emp-field">
                <label class="emp-label">Guía de remisión</label>
                <vs-input v-model="form.guia_remision" placeholder="001-001-000000001" class="w-full" :disabled="soloVer" />
            </div>
        </div>

        <!-- Observaciones -->
        <div class="emp-field">
            <label class="emp-label">Observaciones</label>
            <vs-textarea v-model="form.observaciones" placeholder="Observaciones del empaque..." rows="2" class="w-full" :disabled="soloVer" />
        </div>

        <!-- Chofer -->
        <div class="emp-field">
            <label class="emp-label">Chofer <span v-if="!soloVer" class="emp-required">*</span></label>
            <div v-if="soloVer" class="emp-chofer-row">
                <div v-if="choferSeleccionado" class="emp-chofer-chip">
                    <i class="fa-solid fa-user-check"></i>
                    {{ choferSeleccionado.nombres }} {{ choferSeleccionado.apellidos }}
                    <span class="emp-chofer-ci">{{ choferSeleccionado.cedula }}</span>
                </div>
                <span v-else class="text-gray-400 text-sm">Sin chofer asignado</span>
            </div>
            <v-select
                v-else
                :options="choferes"
                :reduce="c => c"
                :getOptionLabel="c => c.nombres + ' ' + c.apellidos + ' — ' + c.cedula"
                v-model="choferSeleccionado"
                @input="onChoferInput"
                placeholder="-- Seleccione un chofer --"
                class="w-full emp-chofer-select"
                :loading="loadingChoferes"
            >
                <template #option="c">
                    <div class="emp-chofer-option">
                        <span class="emp-chofer-option-nombre">{{ c.nombres }} {{ c.apellidos }}</span>
                        <span class="emp-chofer-option-ci">{{ c.cedula }}</span>
                    </div>
                </template>
                <template #no-options>Sin choferes disponibles</template>
            </v-select>
        </div>

        <!-- Guardar — oculto en modo solo ver -->
        <div v-if="!soloVer" class="emp-footer">
            <vs-button color="primary" type="filled" @click="guardarEmpaque" :disabled="guardando">
               <i class="fa-solid fa-floppy-disk"></i>
                {{ guardando ? 'Guardando...' : 'Guardar Empaque' }}
            </vs-button>
            <vs-button color="success" type="filled" class="ml-5" @click="confirmarFinalizar" :disabled="guardando">
                <i class="fa-solid fa-box-open mr-1"></i>
                {{ guardando ? 'Procesando...' : 'Finalizar Empaque y marcar Despachar' }}
            </vs-button>
        </div>

        <br><br><br>
    </div>
</template>

<script>
import vSelect from 'vue-select'

export default {
    name: 'PerseoDespachoEmpacar',
    components: { 'v-select': vSelect },
    props: {
        ObjectedSelected: { type: Object, required: true },
        soloVer: { type: Boolean, default: false }
    },
    data() {
        return {
            form: { caja_grande: 0, caja_pequena: 0, paquete: 0, id_transporte: null, id_chofer: null, guia_remision: '', observaciones: '' },
            camposCantidad: [
                { key: 'caja_grande',  label: 'Caja Grande'  },
                { key: 'caja_pequena', label: 'Caja Pequeña' },
                { key: 'paquete',      label: 'Paquete'      },
            ],
            transportes: [],
            loadingTransporte: false,
            popupChofer: false,
            busquedaChofer: '',
            resultadosChofer: [],
            choferSeleccionado: null,
            loadingChofer: false,
            sinResultados: false,
            guardando: false,
            usuario: null,
            detalleItems: [],
            guarda_nombre: '',
            fechaGuarda: '',
            empacadorNombre: '',
            fechaEmpaca: '',
            mostrarDetalle: true,
            choferes: [],
            loadingChoferes: false
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.cargarTransportes()
        // Primero cargar choferes, luego cargar empaque para que encuentre la coincidencia
        this.cargarChoferes().then(() => {
            this.cargarEmpaque()
        })
        this.cargarDetalle()
    },
    methods: {
        cargarDetalle() {
            if (!this.ObjectedSelected || !this.ObjectedSelected.ven_codigo) return
            this.$http.get(this.$server_url + 'api/empaque-venta/detalle?ven_codigo=' + this.ObjectedSelected.ven_codigo + '&id_empresa=' + this.ObjectedSelected.id_empresa)
                .then(res => { this.detalleItems = res.data || [] })
                .catch(() => {})
        },
        cargarEmpaque() {
            if (!this.ObjectedSelected || !this.ObjectedSelected.ven_codigo) return
            this.$http.get(this.$server_url + 'empaque_venta?ven_codigo=' + this.ObjectedSelected.ven_codigo)
                .then(res => {
                    const e = res.data
                    if (!e || !e.id) return
                    this.form.caja_grande  = e.caja_grande  || 0
                    this.form.caja_pequena = e.caja_pequena || 0
                    this.form.paquete      = e.paquete      || 0
                    this.form.id_transporte = e.id_transporte || null
                    this.form.guia_remision = e.guia_remision || ''
                    this.form.observaciones = e.observaciones || ''
                    this.form.id_chofer     = e.id_chofer !== null && e.id_chofer !== undefined ? e.id_chofer : null
                    
                    // Buscar el chofer en el array de choferes cargados
                    if (this.form.id_chofer !== null && this.form.id_chofer !== undefined) {
                        this.choferSeleccionado = this.choferes.find(c => c.idusuario === this.form.id_chofer) || null
                    }
                    console.log("hola mundo",this.form)
                    // retiro de oficina
                    if(this.form.id_chofer == 0){
                        this.choferSeleccionado = this.choferes.find(c => c.idusuario === this.form.id_chofer) || null
                    }
                    
                    this.guarda_nombre   = e.guarda_nombre   || ''
                    this.fechaGuarda     = e.fecha_guarda     || ''
                    this.empacadorNombre = e.empacador_nombre || ''
                    this.fechaEmpaca     = e.fecha_empaca     || ''
                })
                .catch(() => {})
        },
        cargarTransportes() {
            this.loadingTransporte = true
            this.$http.get(this.$server_url + 'Get_Transporte')
                .then(res => { this.transportes = res.data; this.loadingTransporte = false })
                .catch(() => { this.loadingTransporte = false })
        },
        cargarChoferes() {
            this.loadingChoferes = true
            return this.$http.get(this.$server_url + 'VerifcarMetodosGet_UsuarioController?action=Get_Choferes')
                .then(res => {
                    // Ya viene "Retiro de oficina" desde el backend, no agregarlo aquí
                    this.choferes = res.data || []
                    this.loadingChoferes = false
                })
                .catch(() => { this.loadingChoferes = false })
        },
        onChoferInput(val) {
            this.form.id_chofer = val ? val.idusuario : null
        },
        seleccionarChofer(u) {
            this.choferSeleccionado = u
            this.form.id_chofer = u.idusuario
            this.popupChofer = false
            this.resultadosChofer = []
            this.busquedaChofer = ''
            this.sinResultados = false
        },
        limpiarChofer() {
            this.choferSeleccionado = null
            this.form.id_chofer = null
        },
        validar() {
            const totalCantidad = (this.form.caja_grande || 0) + (this.form.caja_pequena || 0) + (this.form.paquete || 0)
            if (totalCantidad === 0) {
                this.$vs.notify({ text: 'Debe ingresar al menos una cantidad (caja grande, caja pequeña o paquete)', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                return false
            }
            
            // Permitir 0 (Retiro de oficina) pero no null ni undefined
            if (this.form.id_chofer === null || this.form.id_chofer === undefined) {
                this.$vs.notify({ text: 'Seleccione un chofer', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                return false
            }
            
            // Si el chofer NO es "Retiro de oficina" (id_chofer !== 0), el transporte es obligatorio
            if (this.form.id_chofer !== 0 && !this.form.id_transporte) {
                this.$vs.notify({ text: 'Seleccione un transporte', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                return false
            }
            
            return true
        },
        confirmarFinalizar() {
            if (!this.validar()) return
            this.$vs.dialog({
                type: 'confirm',
                color: 'success',
                title: 'Finalizar Empaque',
                text: 'Al finalizar se registrará la fecha de empaque y el documento quedará marcado como empacado.\n\nSu documento pasará a despacho.\n\n¿Continuar?',
                acceptText: 'Sí, finalizar',
                cancelText: 'Cancelar',
                accept: this.finalizarEmpaque
            })
        },
        finalizarEmpaque() {
            if (!this.ObjectedSelected || !this.ObjectedSelected.ven_codigo) return
            if (!this.validar()) return
            this.guardando = true
            // Solo llama al endpoint de finalizar.
            // El guardado (con user_guarda) lo hace el bodeguero con el botón "Guardar Empaque".
            // NO se vuelve a guardar aquí para no sobreescribir user_guarda con el usuario que finaliza.
            this.$http.post(this.$server_url + 'api/empaque-venta/finalizar', {
                    ven_codigo:  this.ObjectedSelected.ven_codigo,
                    id_empresa:  this.ObjectedSelected.id_empresa,
                    user_empaca: this.usuario ? this.usuario.idusuario : null
                })
                .then(res => {
                    this.guardando = false
                    if (res.data && res.data.status === 200) {
                        this.$vs.notify({ text: res.data.message || 'Empaque finalizado y documento despachado correctamente', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                        this.$emit('guardado', res.data)
                    } else {
                        this.$vs.notify({ text: (res.data && res.data.message) || 'Error al finalizar', color: 'danger', iconPack: 'feather', icon: 'icon-x' })
                    }
                })
                .catch(err => {
                    this.guardando = false
                    const msg = (err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Error al finalizar el empaque'
                    this.$vs.notify({ text: msg, color: 'danger', iconPack: 'feather', icon: 'icon-x' })
                })
        },
        guardarEmpaque() {
            if (!this.ObjectedSelected || !this.ObjectedSelected.ven_codigo) return
            if (!this.validar()) return
            this.guardando = true
            const datos = {
                ven_codigo:    this.ObjectedSelected.ven_codigo,
                id_empresa:    this.ObjectedSelected.id_empresa,
                caja_grande:   this.form.caja_grande  || 0,
                caja_pequena:  this.form.caja_pequena || 0,
                paquete:       this.form.paquete      || 0,
                id_transporte: this.form.id_transporte || null,
                id_chofer:     this.form.id_chofer,
                guia_remision: this.form.guia_remision || null,
                observaciones: this.form.observaciones || null,
                user_guarda:   this.usuario ? this.usuario.idusuario : null
            }
            this.$http.post(this.$server_url + 'empaque_venta', datos)
                .then(res => {
                    this.guardando = false
                    if (res.data && res.data.status === 200) {
                        this.$vs.notify({ text: res.data.message || 'Empaque guardado', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                        this.$emit('guardado', res.data)
                    } else {
                        this.$vs.notify({ text: (res.data && res.data.message) || 'Error al guardar', color: 'danger', iconPack: 'feather', icon: 'icon-x' })
                    }
                })
                .catch(err => {
                    this.guardando = false
                    const msg = (err.response && err.response.data && err.response.data.message) ? err.response.data.message : 'Error al guardar el empaque'
                    this.$vs.notify({ text: msg, color: 'danger', iconPack: 'feather', icon: 'icon-x' })
                })
        },

    }
}
</script>

<style scoped>
.emp-wrap { padding: 12px 16px; display: flex; flex-direction: column; gap: 12px; }

/* Banner solo ver */
.emp-solo-ver-banner { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; padding: 8px 12px; background: #fef9c3; border: 1px solid #fde047; border-radius: 6px; font-size: 12px; font-weight: 600; color: #854d0e; }
.emp-solo-ver-sep { color: #d97706; opacity: 0.5; }

/* Detalle productos */
.emp-detalle { border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; }
.emp-detalle-header { display: flex; align-items: center; gap: 6px; padding: 7px 12px; background: #f8fafc; font-size: 12px; font-weight: 700; color: #334155; border-bottom: 1px solid #e2e8f0; }
.emp-detalle-badge { margin-left: auto; background: #e0f2fe; color: #0369a1; font-size: 10px; font-weight: 700; padding: 1px 7px; border-radius: 10px; }
.emp-detalle-tabla { max-height: 180px; overflow-y: auto; }
.emp-detalle-row { display: grid; grid-template-columns: 110px 1fr 50px; gap: 8px; padding: 5px 12px; font-size: 12px; border-bottom: 1px solid #f1f5f9; align-items: center; }
.emp-detalle-row:last-child { border-bottom: none; }
.emp-detalle-thead { background: #f1f5f9; font-size: 10px; font-weight: 700; color: #64748b; text-transform: uppercase; }
.emp-detalle-codigo { color: #046AE7; font-weight: 600; font-size: 11px; }
.emp-detalle-nombre { color: #1e293b; }
.emp-detalle-cant { text-align: center; font-weight: 700; color: #0f172a; }

/* Doc info */
.emp-doc-info { display: flex; flex-direction: column; gap: 2px; padding: 8px 12px; background: #f0f9ff; border-left: 3px solid #046AE7; border-radius: 4px; }
.emp-doc-codigo { font-size: 14px; font-weight: 800; color: #0f172a; }
.emp-doc-cliente { font-size: 12px; color: #475569; }
.emp-doc-cliente i { margin-right: 4px; color: #046AE7; }

/* Cantidades */
.emp-cantidades { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.emp-cant-item { display: flex; flex-direction: column; gap: 4px; }
.emp-cant-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }
.emp-cant-controls { display: flex; align-items: center; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; }
.emp-btn-num { width: 28px; height: 28px; border: none; background: #f1f5f9; color: #334155; font-size: 16px; cursor: pointer; flex-shrink: 0; transition: background 0.15s; }
.emp-btn-num:hover { background: #e2e8f0; }
.emp-btn-plus { background: #dbeafe; color: #1d4ed8; }
.emp-btn-plus:hover { background: #bfdbfe; }
.emp-num-input { flex: 1; border: none; text-align: center; font-size: 13px; font-weight: 700; color: #1e293b; outline: none; width: 0; min-width: 0; padding: 0 2px; }
.emp-num-input::-webkit-inner-spin-button, .emp-num-input::-webkit-outer-spin-button { -webkit-appearance: none; }
.emp-required { color: #ef4444; }
.emp-hint { font-size: 10px; color: #94a3b8; margin-top: -6px; }

/* Row 2 */
.emp-row-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
.emp-field { display: flex; flex-direction: column; gap: 3px; }
.emp-label { font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; }

/* Chofer select option */
.emp-chofer-option { display: flex; flex-direction: column; gap: 1px; padding: 2px 0; }
.emp-chofer-option-nombre { font-size: 13px; font-weight: 600; color: #1e293b; }
.emp-chofer-option-ci { font-size: 11px; color: #64748b; }

/* Fix color texto seleccionado y dropdown */
.emp-chofer-select >>> .vs__selected { color: #1e293b !important; font-size: 13px; font-weight: 500; }
.emp-chofer-select >>> .vs__dropdown-option { color: #1e293b; font-size: 13px; padding: 8px 12px; }
.emp-chofer-select >>> .vs__dropdown-option--highlight { background: #eff6ff; color: #1d4ed8; }
.emp-chofer-select >>> .vs__search { color: #1e293b; }
.emp-chofer-select >>> .vs__dropdown-menu { border: 1px solid #e2e8f0; border-radius: 6px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); }

/* Chofer chip (solo ver) */
.emp-chofer-row { display: flex; align-items: center; }
.emp-chofer-chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 10px; background: #f0fdf4; border: 1px solid #86efac; border-radius: 20px; font-size: 12px; font-weight: 600; color: #166534; }
.emp-chofer-chip i { color: #16a34a; }
.emp-chofer-ci { color: #64748b; font-weight: 400; font-size: 11px; }
.emp-chofer-clear { background: none; border: none; cursor: pointer; color: #94a3b8; font-size: 16px; line-height: 1; padding: 0 2px; margin-left: 2px; }
.emp-chofer-clear:hover { color: #ef4444; }

/* Footer */
.emp-footer { display: flex; justify-content: center; padding-top: 4px; border-top: 1px solid #f1f5f9; }

/* Popup chofer — z-index alto para estar sobre el popup padre */
.emp-popup-chofer { z-index: 60000 !important; }

/* Contenido popup chofer */
.emp-chofer-search { display: flex; flex-direction: column; gap: 10px; }
.emp-chofer-input-row { display: flex; gap: 8px; align-items: center; }
.emp-chofer-input-row .flex-1 { flex: 1; }
.emp-chofer-estado { font-size: 12px; color: #64748b; padding: 6px 0; }
.emp-chofer-vacio { color: #f59e0b; }
.emp-chofer-lista { display: flex; flex-direction: column; gap: 4px; max-height: 260px; overflow-y: auto; }
.emp-chofer-opcion { padding: 8px 12px; border: 1px solid #e2e8f0; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
.emp-chofer-opcion:hover { background: #f0f9ff; border-color: #93c5fd; }
.emp-chofer-opcion-nombre { font-size: 13px; font-weight: 600; color: #1e293b; }
.emp-chofer-opcion-ci { font-size: 11px; color: #64748b; }
.emp-chofer-opcion-perfil { color: #046AE7; font-weight: 600; }

@media (max-width: 600px) {
    .emp-cantidades { grid-template-columns: repeat(2, 1fr); }
    .emp-row-2 { grid-template-columns: 1fr; }
}
</style>

<!-- Override global para que el popup del chofer quede sobre el popup padre -->
<style>
.emp-popup-chofer .vs-popup--background,
.emp-popup-chofer .vs-popup {
    z-index: 60000 !important;
}
</style>
