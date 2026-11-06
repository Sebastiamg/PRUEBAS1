<template>
<div class="participantes-wrap">

    <div v-if="cargando" class="text-center py-8">
        <vs-icon icon="hourglass_empty" size="40px" color="primary" />
        <p class="text-gray-400 mt-2">Cargando participantes...</p>
    </div>

    <div v-else>
        <!-- Resumen -->
        <div class="resumen-bar">
            <div class="resumen-item"><span class="resumen-num">{{ data.total }}</span><span class="resumen-label">Respondieron</span></div>
            <div class="resumen-item"><span class="resumen-num">{{ porcentaje }}%</span><span class="resumen-label">Con promedio</span></div>
            <div class="resumen-item"><span class="resumen-num" style="color:#10b981">{{ totalDescargas }}</span><span class="resumen-label">Descargaron cert.</span></div>
        </div>

        <!-- Filtros -->
        <div class="flex gap-2 mb-3 flex-wrap items-center justify-between">
            <div class="flex gap-2 flex-1 flex-wrap">
                <vs-input v-model="busqueda" placeholder="Buscar por nombre o cédula..." icon="search" class="flex-1" style="min-width:200px"/>
                <div class="flex gap-1">
                    <button v-for="f in filtros" :key="f.value" class="filtro-btn" :class="{ active: filtroActivo === f.value }" @click="filtroActivo = f.value">{{ f.label }}</button>
                </div>
            </div>
            <vs-button color="success" size="small" @click="exportar" class="flex-shrink-0">
                <i class="fa-solid fa-file-excel mr-1"></i> Exportar
            </vs-button>
        </div>

        <!-- Tabla -->
        <vs-table :data="docentesFiltrados" no-data-text="No hay docentes que coincidan">
            <template slot="thead">
                <vs-th>#</vs-th>
                <vs-th>Docente</vs-th>
                <vs-th>Cédula</vs-th>
                <vs-th>Rol</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Certificado</vs-th>
                <vs-th>Promedio</vs-th>
                <vs-th>Fecha respuesta</vs-th>
                <vs-th></vs-th>
            </template>
            <template slot-scope="{ data }">
                <vs-tr v-for="(tr, i) in data" :key="tr.idusuario">
                    <vs-td>{{ i + 1 }}</vs-td>
                    <vs-td><span class="font-semibold">{{ tr.apellidos }}, {{ tr.nombres }}</span></vs-td>
                    <vs-td><span class="font-mono text-sm">{{ tr.cedula }}</span></vs-td>
                    <vs-td><span class="text-sm text-gray-600">{{ tr.rol || '—' }}</span></vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.respondio" color="success">
                            <vs-icon icon="check_circle" size="14px" class="mr-1"/>Respondió
                        </vs-chip>
                        <vs-chip v-else color="danger">
                            <vs-icon icon="schedule" size="14px" class="mr-1"/>Pendiente
                        </vs-chip>
                    </vs-td>
                    <vs-td>
                        <vs-chip v-if="tr.descargo_certificado" color="success" size="small">
                            <vs-icon icon="download_done" size="13px" class="mr-1"/>Descargó
                        </vs-chip>
                        <vs-chip v-else color="grey" size="small">
                            <vs-icon icon="download" size="13px" class="mr-1"/>No descargó
                        </vs-chip>
                    </vs-td>
                    <vs-td>
                        <div v-if="tr.promedio !== null && tr.promedio !== undefined" class="flex items-center gap-1">
                            <div class="mini-barra-fondo">
                                <div class="mini-barra-relleno" :style="{ width: (tr.promedio*10)+'%', background: colorPromedio(tr.promedio) }"></div>
                            </div>
                            <span class="font-bold text-sm" :style="{ color: colorPromedio(tr.promedio) }">{{ tr.promedio }}</span>
                        </div>
                        <span v-else class="text-xs text-gray-300">—</span>
                    </vs-td>
                    <vs-td>
                        <span v-if="tr.fecha_respuesta" class="text-sm text-gray-500">{{ formatFecha(tr.fecha_respuesta) }}</span>
                        <span v-else class="text-sm text-gray-300">—</span>
                    </vs-td>
                    <vs-td>
                        <button v-if="tr.respondio" class="btn-ver-resp" @click="verRespuestas(tr)" title="Ver respuestas">
                            📋 Ver
                        </button>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>

        <p v-if="!data.total" class="text-center text-gray-400 text-sm mt-4">Aún no hay respuestas registradas para esta encuesta.</p>
    </div>

    <!-- POPUP RESPUESTAS DEL DOCENTE -->
    <vs-popup
        :title="docenteSeleccionado ? 'Respuestas — ' + docenteSeleccionado.nombres + ' ' + docenteSeleccionado.apellidos : 'Respuestas'"
        :active.sync="popupRespuestas"
        style="z-index:300000"
    >
        <div v-if="cargandoRespuestas" class="text-center py-6">
            <vs-icon icon="hourglass_empty" size="32px" color="primary"/>
            <p class="text-gray-400 mt-2 text-sm">Cargando...</p>
        </div>
        <div v-else-if="!respuestasDocente.length" class="text-center py-6">
            <p class="text-gray-400 text-sm">Sin respuestas registradas.</p>
        </div>
        <div v-else class="respuestas-wrap">
            <div v-for="(r, i) in respuestasDocente" :key="i" class="resp-item">
                <p class="resp-pregunta">{{ i+1 }}. {{ r.pregunta }}</p>

                <!-- Simple / Escala: barra -->
                <div v-if="r.tipo === 'simple' || r.tipo === 'escala'" class="flex items-center gap-2 mt-1">
                    <div class="barra-resp-fondo">
                        <div class="barra-resp-relleno" :style="{ width: ((r.valor_escala / (r.escala_maxima || 10)) * 100)+'%', background: colorPromedio(r.valor_escala, r.escala_maxima) }"></div>
                    </div>
                    <span class="font-bold" :style="{ color: colorPromedio(r.valor_escala, r.escala_maxima) }">{{ r.valor_escala }} / {{ r.escala_maxima || 10 }}</span>
                </div>

                <!-- Múltiple / Casillas: chips -->
                <div v-if="r.tipo === 'multiple' || r.tipo === 'casillas'" class="flex flex-wrap gap-1 mt-1">
                    <vs-chip v-for="(op, oi) in r.opciones" :key="oi" color="primary" size="small">{{ op }}</vs-chip>
                </div>

                <!-- Abierta: texto -->
                <div v-if="r.tipo === 'abierta'" class="resp-abierta mt-1">
                    "{{ r.texto_abierto }}"
                </div>
            </div>
        </div>
    </vs-popup>

</div>
</template>

<script>
import Codigosmix from '@/mixins/Codigosmix'

export default {
    mixins: [Codigosmix],

    props: {
        encuesta:     { type: Object, required: true },
        asignacionId: { type: [Number, String], default: null }
    },

    data() {
        return {
            data: { total: 0, respondieron: 0, pendientes: 0, docentes: [] },
            cargando: true,
            busqueda: '',
            filtroActivo: 'todos',
            filtros: [
                { label: 'Todos',        value: 'todos' },
                { label: 'Respondieron', value: 'respondio' }
            ],
            popupRespuestas: false,
            docenteSeleccionado: null,
            respuestasDocente: [],
            cargandoRespuestas: false
        }
    },

    computed: {
        porcentaje() {
            if (!this.data.total) return 0
            const conPromedio = (this.data.docentes || []).filter(d => d.promedio !== null).length
            return Math.round((conPromedio / this.data.total) * 100)
        },
        totalDescargas() {
            return (this.data.docentes || []).filter(d => d.descargo_certificado).length
        },
        docentesFiltrados() {
            let lista = this.data.docentes || []
            if (this.filtroActivo === 'respondio') lista = lista.filter(d => d.respondio)
            if (this.filtroActivo === 'pendiente') lista = lista.filter(d => !d.respondio)
            if (this.busqueda.trim()) {
                const q = this.busqueda.toLowerCase()
                lista = lista.filter(d =>
                    (d.nombres + ' ' + d.apellidos).toLowerCase().includes(q) ||
                    (d.cedula || '').includes(q)
                )
            }
            return lista
        }
    },

    mounted() { this.cargar() },

    methods: {
        cargar() {
            this.cargando = true
            const params = this.asignacionId ? { params: { asignacion_id: this.asignacionId } } : {}
            this.$http.get(this.$server_url + 'encuesta_prolipa/' + this.encuesta.id + '/participantes', params)
                .then(res => { this.data = res.data })
                .catch(err => console.log(err))
                .finally(() => { this.cargando = false })
        },

        verRespuestas(docente) {
            this.docenteSeleccionado = docente
            this.respuestasDocente   = []
            this.popupRespuestas     = true
            this.cargandoRespuestas  = true
            const params = this.asignacionId ? { params: { asignacion_id: this.asignacionId } } : {}
            this.$http.get(this.$server_url + 'encuesta_prolipa/' + this.encuesta.id + '/respuestas-docente/' + docente.idusuario, params)
                .then(res => { this.respuestasDocente = res.data })
                .catch(err => console.log(err))
                .finally(() => { this.cargandoRespuestas = false })
        },

        formatFecha(fecha) {
            if (!fecha) return '—'
            const d = new Date(fecha)
            return d.toLocaleDateString('es-EC') + ' ' + d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
        },

        colorPromedio(val, escalaMax = 10) {
            if (!val) return '#9ca3af'
            const porcentaje = (val / escalaMax) * 100
            if (porcentaje >= 80) return '#10b981'
            if (porcentaje >= 50) return '#f59e0b'
            return '#ef4444'
        },

        exportar() {
            const rows = this.data.docentes || []
            const datos = rows.map(d => ({
                apellidos:       d.apellidos || '',
                nombres:         d.nombres  || '',
                cedula:          d.cedula   || '',
                estado:          d.respondio ? 'Respondió' : 'Pendiente',
                promedio:        d.promedio  !== null && d.promedio !== undefined ? d.promedio : '',
                fecha_respuesta: d.fecha_respuesta ? this.formatFecha(d.fecha_respuesta) : ''
            }))

            const headers   = ['Apellidos', 'Nombres', 'Cédula', 'Estado', 'Promedio', 'Fecha respuesta']
            const fieldKeys = ['apellidos', 'nombres', 'cedula', 'estado', 'promedio', 'fecha_respuesta']
            const nombre    = 'participantes_' + (this.encuesta.codigo || this.encuesta.id)

            this.m_exportTodo(headers, fieldKeys, datos, nombre)
        }
    }
}
</script>

<style scoped>
.participantes-wrap { padding: 0.25rem 0; }

.resumen-bar { display: flex; gap: 0.75rem; margin-bottom: 0.75rem; background: #f8fafc; border-radius: 0.75rem; padding: 0.75rem 1rem; flex-wrap: wrap; }
.resumen-item       { flex: 1; text-align: center; min-width: 70px; }
.resumen-num        { display: block; font-size: 1.4rem; font-weight: 700; color: #1e293b; }
.resumen-label      { font-size: 0.72rem; color: #94a3b8; }
.resumen-item--verde .resumen-num { color: #10b981; }
.resumen-item--rojo  .resumen-num { color: #ef4444; }

.progreso-barra  { height: 8px; background: #fee2e2; border-radius: 99px; overflow: hidden; }
.progreso-relleno { height: 100%; background: linear-gradient(90deg, #10b981, #34d399); border-radius: 99px; transition: width 0.6s ease; }

.filtro-btn { padding: 0.3rem 0.75rem; border-radius: 99px; border: 1px solid #e5e7eb; background: #fff; font-size: 0.8rem; cursor: pointer; color: #6b7280; transition: all 0.15s; }
.filtro-btn:hover  { border-color: #6c63ff; color: #6c63ff; }
.filtro-btn.active { background: #6c63ff; color: #fff; border-color: #6c63ff; }

.mini-barra-fondo   { width: 60px; height: 7px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
.mini-barra-relleno { height: 100%; border-radius: 99px; transition: width 0.5s ease; }

.btn-ver-resp {
    padding: 0.25rem 0.6rem; background: #eff6ff; border: 1px solid #bfdbfe;
    border-radius: 0.4rem; font-size: 0.78rem; cursor: pointer; color: #1d4ed8;
    transition: background 0.15s;
}
.btn-ver-resp:hover { background: #dbeafe; }

/* Popup respuestas */
.respuestas-wrap { padding: 0.25rem 0; }
.resp-item { padding: 0.75rem 0; border-bottom: 1px solid #f0f0f0; }
.resp-item:last-child { border-bottom: none; }
.resp-pregunta { font-size: 0.9rem; font-weight: 600; color: #1f2937; margin: 0; }
.barra-resp-fondo   { flex: 1; max-width: 180px; height: 9px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
.barra-resp-relleno { height: 100%; border-radius: 99px; transition: width 0.5s ease; }
.resp-abierta { background: #f8fafc; border-left: 3px solid #6c63ff; padding: 0.5rem 0.75rem; border-radius: 0 0.4rem 0.4rem 0; font-size: 0.875rem; color: #374151; font-style: italic; }
</style>
