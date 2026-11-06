<template>
<div class="ua-wrap">

    <!-- Tipo de acceso -->
    <div class="ua-tipo-acceso mb-4">
        <p class="ua-label">Tipo de acceso:</p>
        <div class="flex gap-2 flex-wrap">
            <button v-for="t in tiposAcceso" :key="t.value"
                class="ua-tipo-btn"
                :class="{ active: tipoAcceso === t.value }"
                @click="cambiarTipo(t.value)"
            >{{ t.label }}</button>
        </div>
    </div>

    <!-- SECCIÓN GRUPOS (visible si tipo = grupos) -->
    <div v-if="tipoAcceso === 'grupos'" class="ua-section mb-4">
        <p class="ua-label">Grupos con acceso:</p>
        <div class="ae-grupos">
            <label v-for="g in gruposDisponibles" :key="g.id" class="ae-grupo-check"
                :class="{ activo: gruposEditando.includes(g.id) }">
                <input type="checkbox" :value="g.id" v-model="gruposEditando" @change="guardarGrupos"/>
                {{ g.deskripsi }}
            </label>
        </div>
    </div>

    <!-- SECCIÓN USUARIOS INDIVIDUALES (visible si tipo = usuarios) -->
    <div v-if="tipoAcceso === 'usuarios'">

        <!-- TABS para Búsqueda / Importar -->
        <div class="ua-tabs mb-4">
            <div class="ua-tabs-header">
                <button
                    class="ua-tab-btn"
                    :class="{ active: tabActivo === 'busqueda' }"
                    @click="tabActivo = 'busqueda'"
                >
                    👤 Búsqueda individual
                </button>
                <button
                    class="ua-tab-btn"
                    :class="{ active: tabActivo === 'excel' }"
                    @click="tabActivo = 'excel'"
                >
                    📂 Importar desde Excel
                </button>
            </div>

            <div class="ua-tab-content">
                <!-- TAB 1: Búsqueda Individual -->
                <div v-show="tabActivo === 'busqueda'" class="ua-section">
                    <div class="flex gap-2 mb-3 flex-wrap text-xs">
                        <vs-radio v-model="tipoBusqueda" vs-name="ua-radio" vs-value="cedula">Cédula</vs-radio>
                        <vs-radio v-model="tipoBusqueda" vs-name="ua-radio" vs-value="email">Email</vs-radio>
                        <vs-radio v-model="tipoBusqueda" vs-name="ua-radio" vs-value="usuario">Usuario</vs-radio>
                    </div>
                    <div class="flex gap-2 mb-3">
                        <vs-input
                            v-model="busqueda"
                            :placeholder="'Buscar por ' + tipoBusqueda + '...'"
                            icon="search"
                            class="flex-1"
                            @keyup.enter="buscarUsuario"
                        />
                        <vs-button color="primary" @click="buscarUsuario" :disabled="buscando">
                            {{ buscando ? '...' : 'Buscar' }}
                        </vs-button>
                    </div>

                    <!-- Resultados búsqueda -->
                    <div v-if="resultadosBusqueda.length" class="ua-resultados">
                        <div v-for="u in resultadosBusqueda" :key="u.idusuario" class="ua-resultado-item">
                            <div>
                                <b>{{ u.nombres }} {{ u.apellidos }}</b>
                                <span class="text-xs text-gray-400 ml-2">{{ u.cedula }}</span>
                                <span class="text-xs text-gray-400 ml-2">{{ u.email }}</span>
                                <vs-chip color="primary" size="small" class="ml-1">{{ u.perfil }}</vs-chip>
                            </div>
                            <vs-button size="small" color="success" type="flat" icon-pack="feather" icon="icon-plus"
                                @click="agregarUsuario(u)" title="Agregar" />
                        </div>
                    </div>
                    <p v-else-if="busquedaRealizada && !resultadosBusqueda.length" class="text-sm text-gray-400 py-2">
                        No se encontraron usuarios.
                    </p>
                </div>

                <!-- TAB 2: Importar Excel -->
                <div v-show="tabActivo === 'excel'" class="ua-section">
                    <p class="text-sm text-gray-500 mb-3">El Excel debe tener una columna <b>cedula</b></p>
                    <import-excel :onSuccess="onExcelCargado" class="mb-3" />

                    <div v-if="excelCedulas.length" class="mb-3">
                        <vs-alert color="success" class="mb-2">
                            {{ excelCedulas.length }} cédulas cargadas. ¿Procesar?
                        </vs-alert>
                        <vs-button color="primary" @click="importarExcel" :disabled="importando">
                            {{ importando ? 'Procesando...' : 'Importar cédulas' }}
                        </vs-button>
                    </div>

                    <!-- Resultados import -->
                    <div v-if="resultadoImport">
                        <vs-chip color="success" class="mb-3">✅ {{ resultadoImport.agregados }} agregados</vs-chip>
                        <div v-if="resultadoImport.no_existen.length" class="mb-3">
                            <p class="text-xs font-semibold text-red-500 mb-2">No existen en el sistema:</p>
                            <div class="ua-cedulas-error">
                                <span v-for="c in resultadoImport.no_existen" :key="c" class="ua-cedula-tag error">{{ c }}</span>
                            </div>
                        </div>
                        <div v-if="resultadoImport.ya_asignados.length">
                            <p class="text-xs font-semibold text-yellow-500 mb-2">Ya estaban asignados:</p>
                            <div class="ua-cedulas-error">
                                <span v-for="c in resultadoImport.ya_asignados" :key="c" class="ua-cedula-tag warning">{{ c }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Lista de usuarios asignados -->
        <div class="ua-section">
            <div class="flex items-center justify-between mb-2">
                <p class="ua-label">Usuarios asignados ({{ usuariosAsignados.length }}):</p>
                <vs-button size="small" color="primary" type="flat" icon-pack="feather" icon="icon-refresh-cw"
                    @click="cargarUsuarios" title="Recargar" />
            </div>

            <div v-if="cargandoUsuarios" class="text-center py-4">
                <vs-icon icon="hourglass_empty" size="24px" color="primary"/>
            </div>
            <div v-else-if="!usuariosAsignados.length" class="text-sm text-gray-400 py-2">
                Sin usuarios asignados aún.
            </div>
            <div v-else class="ua-lista-usuarios">
                <div v-for="u in usuariosAsignados" :key="u.idusuario" class="ua-usuario-item">
                    <div>
                        <b class="text-sm">{{ u.apellidos }}, {{ u.nombres }}</b>
                        <vs-chip color="primary" size="small" class="ml-1">{{ u.perfil || '—' }}</vs-chip>
                        <span class="text-xs text-gray-400 ml-2">{{ u.cedula }}</span>
                    </div>
                    <vs-button size="small" color="danger" type="flat" icon-pack="feather" icon="icon-x"
                        @click="quitarUsuario(u.idusuario)" title="Quitar" />
                </div>
            </div>
        </div>
    </div>

</div>
</template>

<script>
import ImportExcel from '@/views/codigos/components/importExcel.vue'

export default {
    components: { ImportExcel },

    props: {
        asignacion: { type: Object, required: true }
    },

    data() {
        return {
            tipoAcceso:       this.asignacion.tipo_acceso || 'grupos',
            gruposDisponibles: [],
            gruposEditando:   [],
            // tabs
            tabActivo:        'busqueda',
            // búsqueda individual
            busqueda:         '',
            tipoBusqueda:     'cedula',
            buscando:         false,
            busquedaRealizada: false,
            resultadosBusqueda: [],
            // usuarios asignados
            usuariosAsignados: [],
            cargandoUsuarios:  false,
            // excel
            excelCedulas:     [],
            importando:       false,
            resultadoImport:  null,
            tiposAcceso: [
                { value: 'grupos',   label: '👥 Por grupos' },
                { value: 'usuarios', label: '👤 Usuarios específicos' },
            ]
        }
    },

    mounted() {
        this.cargarGrupos()
        // Siempre cargar usuarios para tener la lista lista
        this.cargarUsuarios()
        this.gruposEditando = this.asignacion.grupos_acceso
            ? this.asignacion.grupos_acceso.split(',').map(Number)
            : []
    },

    methods: {
        cargarGrupos() {
            this.$http.get(this.$server_url + 'grupos_users')
                .then(res => {
                    const excluir = [0, 7, 8, 9, 12, 14, 15, 16, 17, 22, 23, 27, 28, 29, 30, 34, 35]
                    this.gruposDisponibles = res.data.filter(g => !excluir.includes(g.id))
                })
        },

        guardarGrupos() {
            this.$http.post(this.$server_url + 'encuesta_prolipa/asignaciones/' + this.asignacion.id + '/grupos',
                { grupos_acceso: this.gruposEditando.join(',') })
                .then(() => this.$vs.notify({ text: 'Grupos actualizados', color: 'success', iconPack: 'feather', icon: 'icon-check' }))
        },

        cambiarTipo(tipo) {
            this.tipoAcceso = tipo
            this.$http.post(this.$server_url + 'encuesta_prolipa/asignaciones/' + this.asignacion.id + '/tipo-acceso',
                { tipo_acceso: tipo })
                .then(() => {
                    this.$vs.notify({ text: 'Tipo de acceso actualizado', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                    if (tipo === 'usuarios') this.cargarUsuarios()
                })
        },

        buscarUsuario() {
            if (!this.busqueda.trim() || this.busqueda.length < 3) return
            this.buscando = true
            this.busquedaRealizada = false
            this.$http.get(this.$server_url + 'busquedaFiltroEstudiante?busqueda=' + this.tipoBusqueda + '&razonBusqueda=' + this.busqueda)
                .then(res => {
                    this.resultadosBusqueda = Array.isArray(res.data) ? res.data.slice(0, 5) : []
                    this.busquedaRealizada = true
                })
                .catch(() => { this.resultadosBusqueda = [] })
                .finally(() => { this.buscando = false })
        },

        agregarUsuario(u) {
            this.$http.post(this.$server_url + 'encuesta_prolipa/asignaciones/' + this.asignacion.id + '/usuarios',
                { idusuario: u.idusuario })
                .then(res => {
                    if (res.data.status === 0) {
                        this.$vs.notify({ text: res.data.message, color: 'warning', iconPack: 'feather', icon: 'icon-alert-circle', time: 5000 })
                    } else {
                        this.$vs.notify({ text: 'Usuario agregado', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                        this.resultadosBusqueda = []
                        this.busqueda = ''
                        this.busquedaRealizada = false
                        // Limpiar resultados de importación previa
                        this.resultadoImport = null
                        this.cargarUsuarios()
                    }
                })
                .catch(() => {
                    this.$vs.notify({ text: 'Error al agregar usuario', color: 'danger', iconPack: 'feather', icon: 'icon-x' })
                })
        },

        quitarUsuario(uid) {
            this.$http.delete(this.$server_url + 'encuesta_prolipa/asignaciones/' + this.asignacion.id + '/usuarios/' + uid)
                .then(() => {
                    this.$vs.notify({ text: 'Usuario removido', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                    this.cargarUsuarios()
                })
        },

        cargarUsuarios() {
            this.cargandoUsuarios = true
            this.$http.get(this.$server_url + 'encuesta_prolipa/asignaciones/' + this.asignacion.id + '/usuarios')
                .then(res => { this.usuariosAsignados = res.data })
                .finally(() => { this.cargandoUsuarios = false })
        },

        onExcelCargado({ results }) {
            // Extrae columna "cedula"
            this.excelCedulas = results
                .map(r => (r.cedula || r.Cedula || r.CEDULA || '').toString().trim())
                .filter(c => c.length > 0)
            this.resultadoImport = null
            // Limpiar búsqueda individual previa
            this.resultadosBusqueda = []
            this.busqueda = ''
            this.busquedaRealizada = false
        },

        importarExcel() {
            if (!this.excelCedulas.length) return
            this.importando = true
            this.$http.post(this.$server_url + 'encuesta_prolipa/asignaciones/' + this.asignacion.id + '/usuarios/import',
                { cedulas: this.excelCedulas })
                .then(res => {
                    this.resultadoImport = res.data
                    this.excelCedulas = []
                    // Limpiar búsqueda individual previa
                    this.resultadosBusqueda = []
                    this.busqueda = ''
                    this.busquedaRealizada = false
                    this.cargarUsuarios()
                    this.$vs.notify({ text: res.data.agregados + ' usuarios importados', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                })
                .finally(() => { this.importando = false })
        },
    }
}
</script>

<style scoped>
.ua-wrap { padding: 0.25rem 0; }
.ua-label { font-size: 0.78rem; font-weight: 600; color: #64748b; margin-bottom: 0.4rem; text-transform: uppercase; letter-spacing: 0.04em; }
.ua-section { background: #f8fafc; border-radius: 0.6rem; padding: 0.75rem; margin-bottom: 0.75rem; }

.ua-tipo-btn {
    padding: 0.3rem 0.85rem; border-radius: 99px; border: 1px solid #e5e7eb;
    background: #fff; font-size: 0.82rem; cursor: pointer; color: #6b7280; transition: all 0.15s;
}
.ua-tipo-btn:hover  { border-color: #6c63ff; color: #6c63ff; }
.ua-tipo-btn.active { background: #6c63ff; color: #fff; border-color: #6c63ff; }

/* Tabs */
.ua-tabs { margin-bottom: 1rem; }
.ua-tabs-header {
    display: flex;
    gap: 0.5rem;
    border-bottom: 2px solid #e5e7eb;
    margin-bottom: 0;
}
.ua-tab-btn {
    padding: 0.6rem 1.2rem;
    border: none;
    background: transparent;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    color: #6b7280;
    transition: all 0.2s;
    border-bottom: 3px solid transparent;
    margin-bottom: -2px;
}
.ua-tab-btn:hover { color: #6c63ff; }
.ua-tab-btn.active {
    color: #6c63ff;
    border-bottom-color: #6c63ff;
}
.ua-tab-content { padding-top: 0; }

.ua-buscador { display: flex; gap: 8px; align-items: center; }

.ua-resultados { border: 1px solid #e5e7eb; border-radius: 0.5rem; overflow: hidden; max-height: 300px; overflow-y: auto; }
.ua-resultado-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.5rem 0.75rem; border-bottom: 1px solid #f1f5f9; background: #fff;
}
.ua-resultado-item:last-child { border-bottom: none; }

.ua-lista-usuarios { display: flex; flex-direction: column; gap: 4px; }
.ua-usuario-item {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0.4rem 0.6rem; background: #fff; border: 1px solid #e5e7eb; border-radius: 0.4rem;
}

.ua-cedulas-error { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 4px; max-height: 150px; overflow-y: auto; }
.ua-cedula-tag {
    font-size: 0.72rem; padding: 2px 8px; border-radius: 99px;
}
.ua-cedula-tag.error   { background: #fee2e2; color: #dc2626; }
.ua-cedula-tag.warning { background: #fef3c7; color: #d97706; }

/* Reutilizar estilos de grupos del componente padre */
.ae-grupos { display: flex; flex-wrap: wrap; gap: 6px; }
.ae-grupo-check {
    display: flex; align-items: center; gap: 5px; font-size: 0.8rem; cursor: pointer;
    padding: 4px 10px; border: 1px solid #e5e7eb; border-radius: 6px; color: #374151; transition: all 0.15s;
}
.ae-grupo-check.activo { background: #eff6ff; border-color: #3b82f6; color: #1d4ed8; }
.ae-grupo-check input  { cursor: pointer; }
</style>
