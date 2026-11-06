<template>
<div>

    <!-- Sub-tabs -->
    <div class="subtabs mb-4">
        <button class="subtab-btn" :class="{ active: seccion === 'asesor' }"      @click="seccion = 'asesor'">👤 Por Asesor</button>
        <button class="subtab-btn" :class="{ active: seccion === 'capacitacion' }" @click="seccion = 'capacitacion'">🎓 Por Capacitación</button>
    </div>

    <!-- ===== RN06: POR ASESOR ===== -->
    <vx-card v-if="seccion === 'asesor'" class="p-4">
        <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold">Estadísticas por Asesor</h4>
            <vs-button size="small" color="primary" type="flat" icon="refresh" @click="cargarAsesores">Actualizar</vs-button>
        </div>

        <div v-if="cargandoAsesores" class="text-center py-10">
            <vs-icon icon="hourglass_empty" size="40px" color="primary"/>
            <p class="text-gray-400 mt-2">Cargando...</p>
        </div>
        <div v-else-if="!asesores.length" class="text-center py-10">
            <p class="text-gray-400">No hay datos disponibles.</p>
        </div>
        <div v-else>
            <div class="resumen-global mb-5">
                <div class="resumen-card"><span class="resumen-num">{{ asesores.length }}</span><span class="resumen-label">Asesores</span></div>
                <div class="resumen-card resumen-card--azul"><span class="resumen-num">{{ totalEncuestasAsesores }}</span><span class="resumen-label">Encuestas</span></div>
                <div class="resumen-card resumen-card--verde"><span class="resumen-num">{{ totalRespuestasAsesores }}</span><span class="resumen-label">Respuestas</span></div>
                <div class="resumen-card resumen-card--amarillo"><span class="resumen-num">{{ promedioGlobalAsesores }}</span><span class="resumen-label">Promedio global</span></div>
            </div>
            <vs-input v-model="busquedaAsesor" placeholder="Buscar asesor..." icon="search" class="mb-3" style="max-width:280px"/>

            <div v-for="(tr, i) in asesoresFiltrados" :key="i" class="drill-row">
                <!-- Fila asesor -->
                <div class="drill-header" @click="toggleAsesor(tr)">
                    <span class="drill-arrow">{{ expandedAsesor === tr.idusuario ? '▼' : '▶' }}</span>
                    <span class="font-semibold flex-1">{{ tr.asesor }}</span>
                    <span class="font-mono text-sm text-gray-400 mr-3">{{ tr.cedula }}</span>
                    <vs-chip color="primary" class="mr-2">{{ tr.total_encuestas }} enc.</vs-chip>
                    <vs-chip :color="tr.total_respuestas > 0 ? 'success' : 'grey'" class="mr-2">{{ tr.total_respuestas }} resp.</vs-chip>
                    <div v-if="tr.promedio_global !== null" class="flex items-center gap-1">
                        <div class="mini-barra-fondo"><div class="mini-barra-relleno" :style="{ width: (tr.promedio_global*10)+'%', background: colorPromedio(tr.promedio_global) }"></div></div>
                        <span class="font-bold text-sm" :style="{ color: colorPromedio(tr.promedio_global) }">{{ tr.promedio_global }}</span>
                    </div>
                </div>

                <!-- Encuestas del asesor -->
                <div v-if="expandedAsesor === tr.idusuario" class="drill-body">
                    <div v-if="cargandoDetalle[tr.idusuario]" class="text-center py-3 text-gray-400 text-sm">Cargando encuestas...</div>
                    <div v-else-if="detalleAsesor[tr.idusuario] && detalleAsesor[tr.idusuario].length">
                        <div v-for="enc in detalleAsesor[tr.idusuario]" :key="enc.id" class="encuesta-drill">
                            <div class="encuesta-drill-header" @click="toggleEncuesta('a_'+enc.id, enc.id)">
                                <span class="drill-arrow text-xs">{{ expandedEncuesta === 'a_'+enc.id ? '▼' : '▶' }}</span>
                                <div class="flex-1">
                                    <span class="font-semibold text-sm">{{ enc.titulo }}</span>
                                </div>
                                <span class="font-mono text-xs text-gray-400 mr-2">{{ enc.codigo }}</span>
                                <vs-chip :color="enc.estado === 'habilitada' ? 'success' : enc.estado === 'borrador' ? 'warning' : 'danger'" size="small" class="mr-2">{{ enc.estado }}</vs-chip>
                                <vs-chip :color="enc.respuestas_count > 0 ? 'success' : 'grey'" size="small" class="mr-2">{{ enc.respuestas_count }} resp.</vs-chip>
                                <button class="btn-participantes" @click.stop="abrirParticipantes(enc)" title="Ver participantes">👥</button>
                            </div>
                            <!-- Preguntas de la encuesta -->
                            <div v-if="expandedEncuesta === 'a_'+enc.id" class="preguntas-drill">
                                <div v-for="(p, pi) in enc.preguntas" :key="pi" class="pregunta-drill-item">
                                    <p class="pregunta-drill-texto">{{ pi+1 }}. {{ p.texto }}</p>
                                    <div v-if="(p.tipo === 'simple' || p.tipo === 'escala') && p.detalle.promedio !== null" class="flex items-center gap-2 mt-1">
                                        <div class="mini-barra-fondo"><div class="mini-barra-relleno" :style="{ width: (p.detalle.porcentaje || 0) + '%', background: colorPromedio(p.detalle.porcentaje) }"></div></div>
                                        <span class="font-bold text-sm" :style="{ color: colorPromedio(p.detalle.porcentaje) }">{{ p.detalle.promedio }} / {{ p.escala_maxima || 10 }} ({{ p.detalle.porcentaje }}%)</span>
                                    </div>
                                    <div v-if="p.tipo === 'multiple' || p.tipo === 'casillas'" class="mt-1">
                                        <div v-for="(op, oi) in p.detalle" :key="oi" class="opcion-drill-row">
                                            <span class="opcion-drill-texto">{{ op.opcion }}</span>
                                            <div class="barra-pregunta-fondo opcion-barra"><div class="barra-pregunta-relleno" :style="{ width: op.porcentaje+'%', background:'#6c63ff' }"></div></div>
                                            <span class="text-xs font-semibold text-indigo-500">{{ op.porcentaje }}%</span>
                                            <span class="text-xs text-gray-400">({{ op.cantidad }})</span>
                                        </div>
                                    </div>
                                    <div v-if="p.tipo === 'abierta'" class="text-xs text-gray-400 mt-1 italic">Pregunta abierta — ver en detalle de encuesta</div>
                                </div>
                                <!-- Gráfico de barras resumen -->
                                <div v-if="buildBarData(enc.preguntas)" class="grafico-drill-card mt-3">
                                    <p class="text-xs font-semibold text-gray-500 mb-2">📊 Promedio por pregunta</p>
                                    <chartjs-component-bar-chart
                                        :data="buildBarData(enc.preguntas)"
                                        :options="barDrillOptions"
                                        :height="180"
                                    />
                                </div>
                                <!-- Top Docentes por encuesta -->
                                <div class="grafico-drill-card mt-3">
                                    <div class="flex items-center justify-between mb-2">
                                        <p class="text-xs font-semibold text-gray-500">🏆 Top Docentes</p>
                                        <div class="flex items-center gap-1">
                                            <span class="text-xs text-gray-400">Mostrar:</span>
                                            <select class="top-select" :value="topLimitEnc[enc.id] || 10" @change="cambiarLimitTop(enc.id, $event.target.value)">
                                                <option value="5">Top 5</option>
                                                <option value="10">Top 10</option>
                                                <option value="15">Top 15</option>
                                            </select>

                                        </div>
                                    </div>
                                    <div v-if="cargandoTopEnc[enc.id]" class="text-xs text-gray-400 py-2">Cargando...</div>
                                    <div v-else-if="topEncuesta[enc.id] && topEncuesta[enc.id].length">
                                        <chartjs-component-horizontal-bar-chart
                                            :data="buildTopBarData(enc.id)"
                                            :options="topBarOptions(enc.id)"
                                            :height="(topEncuesta[enc.id].length * 34) + 30"
                                        />
                                    </div>
                                    <div v-else-if="topEncuesta[enc.id] && !topEncuesta[enc.id].length" class="text-xs text-gray-400 py-2">Sin respuestas aún.</div>
                                    <div v-else class="text-xs text-gray-400 py-2 italic">Cargando top...</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-else class="text-sm text-gray-400 py-2 pl-4">Sin encuestas.</div>
                </div>
            </div>
        </div>
    </vx-card>

    <!-- ===== RN07: POR CAPACITACIÓN ===== -->
    <vx-card v-if="seccion === 'capacitacion'" class="p-4">
        <div class="flex items-center justify-between mb-4">
            <h4 class="text-lg font-semibold">Estadísticas por Capacitación</h4>
            <vs-button size="small" color="primary" type="flat" icon="refresh" @click="cargarCapacitaciones">Actualizar</vs-button>
        </div>

        <div v-if="cargandoCap" class="text-center py-10">
            <vs-icon icon="hourglass_empty" size="40px" color="primary"/>
            <p class="text-gray-400 mt-2">Cargando...</p>
        </div>
        <div v-else-if="!capacitaciones.length" class="text-center py-10">
            <p class="text-gray-400">No hay datos disponibles.</p>
        </div>
        <div v-else>
            <div class="resumen-global mb-5">
                <div class="resumen-card"><span class="resumen-num">{{ capacitaciones.length }}</span><span class="resumen-label">Capacitaciones</span></div>
                <div class="resumen-card resumen-card--azul"><span class="resumen-num">{{ totalAsignacionesCap }}</span><span class="resumen-label">Asignaciones</span></div>
                <div class="resumen-card resumen-card--verde"><span class="resumen-num">{{ totalRespuestasCap }}</span><span class="resumen-label">Respuestas</span></div>
                <div class="resumen-card resumen-card--amarillo"><span class="resumen-num">{{ promedioGlobalCap }}</span><span class="resumen-label">Promedio global</span></div>
            </div>
            <vs-input v-model="busquedaCap" placeholder="Buscar capacitación o asesor..." icon="search" class="mb-3" style="max-width:320px"/>

            <div v-for="(tr, i) in capacitacionesFiltradas" :key="i" class="drill-row">
                <div class="drill-header">
                    <span class="drill-arrow">🎓</span>
                    <div class="flex-1">
                        <span class="font-semibold">{{ tr.nombre_capacitacion }}</span>
                        <span class="text-xs text-gray-400 ml-2">{{ tr.asesor }}</span>
                    </div>
                    <vs-chip color="primary" class="mr-2">{{ tr.total_asignaciones }} asig.</vs-chip>
                    <vs-chip :color="tr.total_respuestas > 0 ? 'success' : 'grey'" class="mr-2">{{ tr.total_respuestas }} resp.</vs-chip>
                    <div v-if="tr.promedio_global !== null" class="flex items-center gap-1">
                        <div class="mini-barra-fondo"><div class="mini-barra-relleno" :style="{ width: (tr.promedio_global*10)+'%', background: colorPromedio(tr.promedio_global) }"></div></div>
                        <span class="font-bold text-sm" :style="{ color: colorPromedio(tr.promedio_global) }">{{ tr.promedio_global }}</span>
                    </div>
                </div>
            </div>
        </div>
    </vx-card>

    <!-- POPUP PARTICIPANTES -->
    <vs-popup
        :title="encuestaParticipantes ? 'Participantes — ' + encuestaParticipantes.titulo : 'Participantes'"
        :active.sync="popupParticipantes"
        style="z-index:60000"
    >
        <EncuestaParticipantesProlipa
            v-if="popupParticipantes && encuestaParticipantes"
            :encuesta="encuestaParticipantes"
        />
    </vs-popup>

</div>
</template>

<script>
import EncuestaParticipantesProlipa from './EncuestaParticipantesProlipa.vue'
import ChartjsComponentBarChart from '@/views/Estadisticas/charts-components/ChartjsComponentBarChart.vue'
import ChartjsComponentHorizontalBarChart from '@/views/Estadisticas/charts-components/ChartjsComponentHorizontalBarChart.vue'

export default {
    components: { EncuestaParticipantesProlipa, ChartjsComponentBarChart, ChartjsComponentHorizontalBarChart },

    props: {},

    data() {
        return {
            seccion: 'asesor',
            asesores: [], capacitaciones: [],
            cargandoAsesores: false, cargandoCap: false,
            busquedaAsesor: '', busquedaCap: '',
            expandedAsesor: null, expandedEncuesta: null,
            detalleAsesor: {}, cargandoDetalle: {},
            popupParticipantes: false,
            encuestaParticipantes: null,
            // Top docentes por encuesta (drill-down)
            topEncuesta: {}, cargandoTopEnc: {}, topLimitEnc: {}
        }
    },

    computed: {
        totalEncuestasAsesores()  { return this.asesores.reduce((a, e) => a + e.total_encuestas, 0) },
        totalRespuestasAsesores() { return this.asesores.reduce((a, e) => a + e.total_respuestas, 0) },
        promedioGlobalAsesores() {
            const c = this.asesores.filter(e => e.promedio_global !== null)
            if (!c.length) return '—'
            return (c.reduce((a, e) => a + parseFloat(e.promedio_global), 0) / c.length).toFixed(2)
        },
        asesoresFiltrados() {
            if (!this.busquedaAsesor.trim()) return this.asesores
            const q = this.busquedaAsesor.toLowerCase()
            return this.asesores.filter(a => a.asesor.toLowerCase().includes(q) || (a.cedula||'').includes(q))
        },
        totalAsignacionesCap()  { return this.capacitaciones.reduce((a, c) => a + c.total_asignaciones, 0) },
        totalRespuestasCap()    { return this.capacitaciones.reduce((a, c) => a + c.total_respuestas, 0) },
        promedioGlobalCap() {
            const c = this.capacitaciones.filter(e => e.promedio_global !== null)
            if (!c.length) return '—'
            return (c.reduce((a, e) => a + parseFloat(e.promedio_global), 0) / c.length).toFixed(2)
        },
        capacitacionesFiltradas() {
            if (!this.busquedaCap.trim()) return this.capacitaciones
            const q = this.busquedaCap.toLowerCase()
            return this.capacitaciones.filter(c =>
                (c.nombre_capacitacion||'').toLowerCase().includes(q) || (c.asesor||'').toLowerCase().includes(q)
            )
        },
        barDrillOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                scales: {
                    yAxes: [{ ticks: { min: 0, max: 100, stepSize: 20, callback: v => v + '%' }, gridLines: { color: '#f1f5f9' } }],
                    xAxes: [{ gridLines: { display: false }, ticks: { fontSize: 10 } }]
                },
                tooltips: {
                    callbacks: { label: ctx => ' ' + parseFloat(ctx.yLabel).toFixed(2) + '%' }
                }
            }
        }
    },

    mounted() { this.cargarAsesores() },

    watch: {
        seccion(val) {
            if (val === 'capacitacion' && !this.capacitaciones.length) this.cargarCapacitaciones()
        }
    },

    methods: {
        cargarAsesores() {
            this.cargandoAsesores = true
            this.$http.get(this.$server_url + 'encuesta_prolipa/estadisticas/asesores')
                .then(res => { this.asesores = res.data })
                .catch(err => console.log(err))
                .finally(() => { this.cargandoAsesores = false })
        },
        cargarCapacitaciones() {
            this.cargandoCap = true
            this.$http.get(this.$server_url + 'encuesta_prolipa/estadisticas/instituciones')
                .then(res => { this.capacitaciones = res.data })
                .catch(err => console.log(err))
                .finally(() => { this.cargandoCap = false })
        },
        toggleAsesor(tr) {
            if (this.expandedAsesor === tr.idusuario) { this.expandedAsesor = null; return }
            this.expandedAsesor = tr.idusuario
            this.expandedEncuesta = null
            if (!this.detalleAsesor[tr.idusuario]) this.cargarDetalleAsesor(tr.idusuario)
        },
        cargarDetalleAsesor(asesor_id) {
            this.$set(this.cargandoDetalle, asesor_id, true)
            this.$http.get(this.$server_url + 'encuesta_prolipa/estadisticas/encuestas-detalle', {
                params: { asesor_id }
            })
                .then(res => { this.$set(this.detalleAsesor, asesor_id, res.data) })
                .catch(err => console.log(err))
                .finally(() => { this.$set(this.cargandoDetalle, asesor_id, false) })
        },

        toggleEncuesta(key, encId) {
            this.expandedEncuesta = this.expandedEncuesta === key ? null : key
            if (this.expandedEncuesta === key && encId && !this.topEncuesta[encId]) {
                this.cargarTopEncuesta(encId)
            }
        },

        colorPromedio(val) {
            if (!val) return '#9ca3af'
            if (val >= 80) return '#10b981'
            if (val >= 50) return '#f59e0b'
            return '#ef4444'
        },

        buildBarData(preguntas) {
            const simples = (preguntas || []).filter(p => (p.tipo === 'simple' || p.tipo === 'escala') && p.detalle && p.detalle.porcentaje !== null)
            if (!simples.length) return null
            const minVal = Math.min(...simples.map(p => parseFloat(p.detalle.porcentaje)))
            return {
                labels: simples.map(p => p.texto.length > 22 ? p.texto.substring(0, 22) + '…' : p.texto),
                datasets: [{
                    label: 'Porcentaje',
                    data: simples.map(p => parseFloat(p.detalle.porcentaje)),
                    backgroundColor: simples.map(p =>
                        parseFloat(p.detalle.porcentaje) === minVal ? '#ef4444' : '#6c63ff'
                    ),
                    borderRadius: 5
                }]
            }
        },

        abrirParticipantes(enc) {
            this.encuestaParticipantes = enc
            this.popupParticipantes = true
        },

        cargarTopEncuesta(encId) {
            const limit = this.topLimitEnc[encId] || 10
            this.$set(this.cargandoTopEnc, encId, true)
            this.$http.get(this.$server_url + 'encuesta_prolipa/estadisticas/top-docentes', {
                params: { encuesta_id: encId, limit }
            })
            .then(res => { this.$set(this.topEncuesta, encId, res.data) })
            .catch(err => console.log(err))
            .finally(() => { this.$set(this.cargandoTopEnc, encId, false) })
        },

        cambiarLimitTop(encId, val) {
            this.$set(this.topLimitEnc, encId, parseInt(val))
            this.cargarTopEncuesta(encId)
        },

        buildTopBarData(encId) {
            const rows = this.topEncuesta[encId]
            if (!rows || !rows.length) return null
            return {
                labels: rows.map(d => d.docente.length > 28 ? d.docente.substring(0, 28) + '…' : d.docente),
                datasets: [{
                    label: 'Promedio %',
                    data: rows.map(d => d.porcentaje),
                    backgroundColor: '#3b82f6',
                    borderRadius: 4
                }]
            }
        },

        topBarOptions(encId) {
            const me = this
            return {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                scales: {
                    xAxes: [{ ticks: { min: 0, max: 100, callback: v => v + '%' }, gridLines: { color: '#f1f5f9' } }],
                    yAxes: [{ gridLines: { display: false }, ticks: { fontSize: 11 } }]
                },
                tooltips: {
                    callbacks: {
                        label(ctx) {
                            const rows = me.topEncuesta[encId] || []
                            const d = rows[ctx.index]
                            return d ? ' ' + parseFloat(ctx.xLabel).toFixed(2) + '%  (' + d.promedio + '/10)' : ''
                        }
                    }
                }
            }
        }
    }
}
</script>

<style scoped>
.subtabs { display: flex; gap: 0.5rem; border-bottom: 2px solid #e5e7eb; margin-bottom: 1rem; }
.subtab-btn {
    padding: 0.5rem 1.25rem; border: none; background: none;
    font-size: 0.9rem; font-weight: 600; color: #94a3b8; cursor: pointer;
    border-bottom: 3px solid transparent; margin-bottom: -2px; transition: all 0.15s;
}
.subtab-btn:hover  { color: #6c63ff; }
.subtab-btn.active { color: #6c63ff; border-bottom-color: #6c63ff; }

.resumen-global { display: flex; gap: 1rem; flex-wrap: wrap; }
.resumen-card { flex: 1; min-width: 110px; background: #f8fafc; border-radius: 0.75rem; padding: 0.875rem; text-align: center; border: 1px solid #e5e7eb; }
.resumen-num   { display: block; font-size: 1.6rem; font-weight: 700; color: #1e293b; }
.resumen-label { font-size: 0.7rem; color: #94a3b8; }
.resumen-card--verde   .resumen-num { color: #10b981; }
.resumen-card--amarillo .resumen-num { color: #f59e0b; }
.resumen-card--azul    .resumen-num { color: #6c63ff; }

/* Drill-down rows */
.drill-row { border: 1px solid #e5e7eb; border-radius: 0.75rem; margin-bottom: 0.5rem; overflow: hidden; }
.drill-header {
    display: flex; align-items: center; gap: 0.75rem; padding: 0.75rem 1rem;
    cursor: pointer; background: #f8fafc; transition: background 0.15s;
}
.drill-header:hover { background: #f0f4ff; }
.drill-arrow { font-size: 0.7rem; color: #6c63ff; min-width: 12px; }
.drill-body { padding: 0.5rem 1rem 0.75rem; background: #fff; }

.encuesta-drill { border: 1px solid #e5e7eb; border-radius: 0.5rem; margin-bottom: 0.4rem; overflow: hidden; }
.encuesta-drill-header {
    display: flex; align-items: center; gap: 0.5rem; padding: 0.6rem 0.875rem;
    cursor: pointer; background: #fafafa; transition: background 0.15s;
}
.encuesta-drill-header:hover { background: #f0f4ff; }

.preguntas-drill { padding: 0.75rem 1rem; background: #fff; border-top: 1px solid #f0f0f0; }
.pregunta-drill-item { padding: 0.5rem 0; border-bottom: 1px solid #f5f5f5; }
.pregunta-drill-item:last-child { border-bottom: none; }
.pregunta-drill-texto { font-size: 0.875rem; font-weight: 600; color: #1f2937; margin: 0; }

.barra-pregunta-fondo  { flex: 1; max-width: 200px; height: 8px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
.barra-pregunta-relleno { height: 100%; border-radius: 99px; transition: width 0.5s ease; }

.opcion-drill-row { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.3rem; }
.opcion-drill-texto { font-size: 0.8rem; color: #374151; min-width: 100px; max-width: 150px; }
.opcion-barra { min-width: 80px; max-width: 120px; }

.mini-barra-fondo  { width: 60px; height: 6px; background: #f1f5f9; border-radius: 99px; overflow: hidden; }
.mini-barra-relleno { height: 100%; border-radius: 99px; transition: width 0.5s ease; }

.btn-participantes {
    background: #e0f2fe; border: none; border-radius: 6px;
    padding: 3px 7px; cursor: pointer; font-size: 14px;
    transition: background 0.15s, transform 0.1s;
    flex-shrink: 0;
}
.btn-participantes:hover  { background: #bae6fd; transform: scale(1.1); }
.btn-participantes:active { transform: scale(0.95); }

.grafico-drill-card {
    background: #f8fafc;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
}

.top-select {
    border: 1px solid #d1d5db;
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 0.85rem;
    color: #374151;
    cursor: pointer;
    outline: none;
}
.top-select:focus { border-color: #6c63ff; }

.btn-cargar-top {
    background: #6c63ff; color: #fff; border: none;
    border-radius: 6px; padding: 3px 10px;
    font-size: 0.78rem; cursor: pointer; transition: background 0.15s;
}
.btn-cargar-top:hover { background: #5a52d5; }
</style>
