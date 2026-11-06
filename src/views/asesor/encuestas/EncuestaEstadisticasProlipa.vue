<template>
<div class="estadisticas-wrap">

    <div v-if="cargando" class="text-center py-8">
        <vs-icon icon="hourglass_empty" size="40px" color="primary" />
        <p class="text-gray-400 mt-2">Cargando estadísticas...</p>
    </div>

    <div v-else-if="!estadisticas.length" class="text-center py-8">
        <vs-icon icon="bar_chart" size="40px" color="grey" />
        <p class="text-gray-400 mt-2">Aún no hay respuestas registradas.</p>
    </div>

    <div v-else>

        <!-- Resumen general -->
        <div class="resumen-bar">
            <div class="resumen-item">
                <span class="resumen-num">{{ totalDocentes }}</span>
                <span class="resumen-label">Respondieron</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-num">{{ promedioGeneral }}</span>
                <span class="resumen-label">Promedio general</span>
            </div>
            <div class="resumen-item">
                <span class="resumen-num">{{ estadisticas.length }}</span>
                <span class="resumen-label">Preguntas</span>
            </div>
        </div>

        <!-- GRÁFICO DE BARRAS — preguntas simples/escala -->
        <div v-if="preguntasSimples.length" class="grafico-card mb-4">
            <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-semibold text-gray-600">Promedio por pregunta (porcentaje normalizado)</p>
                <span v-if="preguntaMasBaja" class="text-xs text-red-400">
                    ⚠️ Más baja: "{{ preguntaMasBaja.label }}" — {{ preguntaMasBaja.porcentaje }}%
                </span>
            </div>
            <chartjs-component-bar-chart
                :data="barChartData"
                :options="barChartOptions"
                :height="220"
            />
        </div>

        <!-- Tarjeta por pregunta -->
        <div v-for="(item, i) in estadisticas" :key="i" class="pregunta-stat-card">

            <div class="pregunta-stat-header">
                <span class="pregunta-num">{{ i + 1 }}</span>
                <p class="pregunta-texto">{{ item.pregunta }}</p>
                <vs-chip :color="chipColor(item.tipo)" size="small" class="ml-auto flex-shrink-0">{{ item.tipo }}</vs-chip>
            </div>

            <!-- SIMPLE / ESCALA: barra de promedio -->
            <div v-if="item.tipo === 'simple' || item.tipo === 'escala'" class="mt-3">
                <div class="flex items-center gap-3">
                    <div class="barra-fondo">
                        <div class="barra-relleno" :style="{ width: (item.opciones.porcentaje || 0) + '%', background: colorPromedio(item.opciones.promedio, item.escala_maxima) }"></div>
                    </div>
                    <span class="promedio-num" :style="{ color: colorPromedio(item.opciones.promedio, item.escala_maxima) }">
                        {{ item.opciones.promedio }} / {{ item.escala_maxima || 10 }} ({{ item.opciones.porcentaje }}%)
                    </span>
                </div>
                <p class="text-xs text-gray-400 mt-1">{{ item.total_respuestas }} respuestas</p>
            </div>

            <!-- MULTIPLE / CASILLAS: barras por opción -->
            <div v-if="item.tipo === 'multiple' || item.tipo === 'casillas'" class="mt-3">
                <div v-for="(op, j) in item.opciones" :key="j" class="opcion-stat-row">
                    <span class="opcion-texto">{{ op.opcion }}</span>
                    <div class="barra-fondo opcion-barra">
                        <div class="barra-relleno" :style="{ width: op.porcentaje + '%', background: '#6c63ff' }"></div>
                    </div>
                    <span class="opcion-pct">{{ op.porcentaje }}%</span>
                    <span class="opcion-cant text-gray-400">({{ op.cantidad }})</span>
                </div>
                <p class="text-xs text-gray-400 mt-1">{{ item.total_respuestas }} respuestas</p>
            </div>

            <!-- ABIERTA: botón para ver respuestas -->
            <div v-if="item.tipo === 'abierta'" class="mt-3">
                <vs-button size="small" color="primary" type="flat" @click="verAbiertas(item, i)">
                    <i class="feather icon-message-square mr-1"></i>
                    Ver {{ item.total_respuestas }} respuestas abiertas
                </vs-button>
                <div v-if="abiertasVisibles[i]" class="abiertas-lista mt-2">
                    <div v-if="cargandoAbiertas[i]" class="text-xs text-gray-400">Cargando...</div>
                    <div v-else>
                        <div v-for="(txt, k) in respuestasAbiertas[i]" :key="k" class="abierta-item">
                            "{{ txt }}"
                        </div>
                        <div v-if="!respuestasAbiertas[i] || !respuestasAbiertas[i].length" class="text-xs text-gray-400">
                            Sin respuestas aún.
                        </div>
                    </div>
                </div>
            </div>

        </div>

        <!-- TOP ENCUESTADOS — al final -->
        <div class="grafico-card mt-4">
            <div class="flex items-center justify-between mb-2">
                <p class="text-sm font-semibold text-gray-600">🏆 Top encuestados</p>
                <div class="flex items-center gap-1">
                    <span class="text-xs text-gray-400">Mostrar:</span>
                    <select class="top-select" v-model="topLimit" @change="cargarTop">
                        <option value="5">Top 5</option>
                        <option value="10">Top 10</option>
                        <option value="15">Top 15</option>
                    </select>
                </div>
            </div>
            <div v-if="cargandoTop" class="text-xs text-gray-400 py-2">Cargando...</div>
            <div v-else-if="topDocentes.length">
                <chartjs-component-horizontal-bar-chart
                    :data="topChartData"
                    :options="topChartOptions"
                    :height="(topDocentes.length * 34) + 30"
                />
            </div>
            <div v-else class="text-xs text-gray-400 py-2">Sin respuestas aún.</div>
        </div>

    </div>

</div>
</template>

<script>
import ChartjsComponentBarChart           from '@/views/Estadisticas/charts-components/ChartjsComponentBarChart.vue'
import ChartjsComponentHorizontalBarChart from '@/views/Estadisticas/charts-components/ChartjsComponentHorizontalBarChart.vue'

export default {
    components: { ChartjsComponentBarChart, ChartjsComponentHorizontalBarChart },

    props: {
        encuesta:     { type: Object, required: true },
        asignacionId: { type: [Number, String], default: null }
    },

    data() {
        return {
            estadisticas: [],
            totalDocentes: 0,
            cargando: true,
            abiertasVisibles: {},
            cargandoAbiertas: {},
            respuestasAbiertas: {},
            // Top Docentes
            topDocentes: [],
            cargandoTop: false,
            topLimit: 10
        }
    },

    computed: {
        promedioGeneral() {
            const simples = this.estadisticas.filter(e =>
                (e.tipo === 'simple' || e.tipo === 'escala') && e.opciones && e.opciones.porcentaje !== null
            )
            if (!simples.length) return '—'
            const sum = simples.reduce((acc, e) => acc + parseFloat(e.opciones.porcentaje || 0), 0)
            return (sum / simples.length).toFixed(2) + '%'
        },

        preguntasSimples() {
            return this.estadisticas.filter(e =>
                (e.tipo === 'simple' || e.tipo === 'escala') && e.opciones && e.opciones.promedio !== null
            )
        },

        preguntaMasBaja() {
            if (!this.preguntasSimples.length) return null
            const min = this.preguntasSimples.reduce((prev, curr) =>
                parseFloat(curr.opciones.porcentaje) < parseFloat(prev.opciones.porcentaje) ? curr : prev
            )
            return {
                label: min.pregunta.length > 30 ? min.pregunta.substring(0, 30) + '…' : min.pregunta,
                porcentaje: parseFloat(min.opciones.porcentaje).toFixed(2)
            }
        },

        barChartData() {
            const masBajaLabel = this.preguntaMasBaja ? this.preguntaMasBaja.label : null
            const labels = this.preguntasSimples.map((e, i) => {
                const txt = e.pregunta.length > 20 ? e.pregunta.substring(0, 20) + '…' : e.pregunta
                return txt
            })
            const valores = this.preguntasSimples.map(e => parseFloat(e.opciones.porcentaje))
            const colores = this.preguntasSimples.map(e => {
                const lbl = e.pregunta.length > 30 ? e.pregunta.substring(0, 30) + '…' : e.pregunta
                return lbl === masBajaLabel ? '#ef4444' : '#6c63ff'
            })
            return {
                labels,
                datasets: [{
                    label: 'Porcentaje',
                    data: valores,
                    backgroundColor: colores,
                    borderRadius: 6
                }]
            }
        },

        barChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                title: {
                    display: true,
                    text: 'Promedio por pregunta (%)',
                    fontSize: 13,
                    fontColor: '#374151'
                },
                scales: {
                    yAxes: [{
                        ticks: { min: 0, max: 100, stepSize: 20, callback: v => v + '%' },
                        gridLines: { color: '#f1f5f9' }
                    }],
                    xAxes: [{
                        gridLines: { display: false },
                        ticks: { fontSize: 11 }
                    }]
                },
                tooltips: {
                    callbacks: {
                        label: ctx => ' ' + ctx.yLabel.toFixed(2) + '%'
                    }
                }
            }
        },

        topChartData() {
            const labels = this.topDocentes.map(d => d.nombre)
            const valores = this.topDocentes.map(d => parseFloat(d.porcentaje))
            return {
                labels,
                datasets: [{
                    label: 'Porcentaje',
                    data: valores,
                    backgroundColor: valores.map(v => v >= 80 ? '#10b981' : v >= 50 ? '#f59e0b' : '#ef4444'),
                    borderRadius: 4
                }]
            }
        },

        topChartOptions() {
            return {
                responsive: true,
                maintainAspectRatio: false,
                legend: { display: false },
                scales: {
                    xAxes: [{ ticks: { min: 0, max: 100, stepSize: 20, callback: v => v + '%' }, gridLines: { color: '#f1f5f9' } }],
                    yAxes: [{ ticks: { fontSize: 11 }, gridLines: { display: false } }]
                },
                tooltips: {
                    callbacks: { label: ctx => ' ' + parseFloat(ctx.xLabel).toFixed(2) + '%' }
                }
            }
        }
    },

    mounted() {
        this.cargar()
        this.cargarTop()
    },

    methods: {
        cargar() {
            let me = this
            me.cargando = true
            const params = me.asignacionId ? { params: { asignacion_id: me.asignacionId } } : {}
            Promise.all([
                me.$http.get(me.$server_url + 'encuesta_prolipa/' + me.encuesta.id + '/estadisticas', params),
                me.$http.get(me.$server_url + 'encuesta_prolipa/' + me.encuesta.id + '/total', params)
            ]).then(([resEst, resTotal]) => {
                me.estadisticas  = resEst.data
                me.totalDocentes = resTotal.data.total_respuestas
            }).catch(err => console.log(err))
              .finally(() => { me.cargando = false })
        },

        cargarTop() {
            this.cargandoTop = true
            const params = { encuesta_id: this.encuesta.id, limit: this.topLimit }
            if (this.asignacionId) params.asignacion_id = this.asignacionId
            this.$http.get(this.$server_url + 'encuesta_prolipa/estadisticas/top-docentes', { params })
            .then(res => { this.topDocentes = res.data })
            .catch(err => console.log(err))
            .finally(() => { this.cargandoTop = false })
        },

        chipColor(tipo) {
            if (tipo === 'simple' || tipo === 'escala')     return 'warning'
            if (tipo === 'multiple' || tipo === 'casillas') return 'primary'
            return 'success'
        },

        colorPromedio(val, escalaMax = 10) {
            if (!val) return '#9ca3af'
            const porcentaje = (val / escalaMax) * 100
            if (porcentaje >= 80) return '#10b981'
            if (porcentaje >= 50) return '#f59e0b'
            return '#ef4444'
        },

        verAbiertas(item, index) {
            this.$set(this.abiertasVisibles, index, !this.abiertasVisibles[index])
            if (this.abiertasVisibles[index] && !this.respuestasAbiertas[index]) {
                this.$set(this.cargandoAbiertas, index, true)
                this.$http.get(this.$server_url + 'encuesta_prolipa/pregunta/' + item.pregunta_id + '/abiertas')
                    .then(res => { this.$set(this.respuestasAbiertas, index, res.data) })
                    .catch(() => { this.$set(this.respuestasAbiertas, index, []) })
                    .finally(() => { this.$set(this.cargandoAbiertas, index, false) })
            }
        }
    }
}
</script>

<style scoped>
.estadisticas-wrap { padding: 0.25rem 0; }

.resumen-bar {
    display: flex; gap: 1rem; margin-bottom: 1.25rem;
    background: #f8fafc; border-radius: 0.75rem; padding: 0.875rem 1rem;
}
.resumen-item { flex: 1; text-align: center; }
.resumen-num   { display: block; font-size: 1.5rem; font-weight: 700; color: #1e293b; }
.resumen-label { font-size: 0.75rem; color: #94a3b8; }

.pregunta-stat-card {
    background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem;
    padding: 1rem 1.25rem; margin-bottom: 0.875rem;
}
.pregunta-stat-header { display: flex; align-items: flex-start; gap: 0.75rem; }
.pregunta-num {
    min-width: 26px; height: 26px; background: #6c63ff; color: white;
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 700; flex-shrink: 0;
}
.pregunta-texto { font-size: 0.95rem; font-weight: 600; color: #1f2937; margin: 0; flex: 1; }

.barra-fondo {
    flex: 1; height: 10px; background: #f1f5f9; border-radius: 99px; overflow: hidden;
}
.barra-relleno { height: 100%; border-radius: 99px; transition: width 0.6s ease; }
.promedio-num  { font-size: 1rem; font-weight: 700; min-width: 60px; text-align: right; }

.opcion-stat-row {
    display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.4rem;
}
.opcion-texto { font-size: 0.82rem; color: #374151; min-width: 120px; max-width: 160px; }
.opcion-barra { min-width: 80px; }
.opcion-pct   { font-size: 0.82rem; font-weight: 600; color: #6c63ff; min-width: 38px; text-align: right; }
.opcion-cant  { font-size: 0.78rem; }

.abiertas-lista { background: #f8fafc; border-radius: 0.5rem; padding: 0.75rem; }
.abierta-item   { font-size: 0.85rem; color: #374151; padding: 0.35rem 0; border-bottom: 1px solid #e5e7eb; font-style: italic; }
.abierta-item:last-child { border-bottom: none; }

.grafico-card {
    background: #fff;
    border: 1px solid #e5e7eb;
    border-radius: 0.75rem;
    padding: 1rem 1.25rem;
}
</style>
