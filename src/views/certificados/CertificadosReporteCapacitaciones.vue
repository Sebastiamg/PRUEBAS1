<template>
    <div class="reporte-asesores mt-4">
        <div class="alerta-realizadas mb-4">
            <span class="alerta-realizadas__icon">ℹ️</span>
            <p class="alerta-realizadas__texto">
                Este reporte muestra únicamente capacitaciones en estado <strong>Realizada</strong>.
                No se incluyen pendientes ni canceladas.
            </p>
        </div>

        <vs-divider>Filtros</vs-divider>

        <div class="vx-row mb-3">
            <div class="vx-col w-full">
                <span class="block mb-2">Filtrar por</span>
                <ul class="flex flex-wrap">
                    <li class="mr-4 mb-2">
                        <vs-radio v-model="tipoFiltro" vs-name="tipoFiltroReporte" vs-value="fechas">Por fechas</vs-radio>
                    </li>
                    <li class="mb-2">
                        <vs-radio v-model="tipoFiltro" vs-name="tipoFiltroReporte" vs-value="anios">Por años</vs-radio>
                    </li>
                </ul>
            </div>
        </div>

        <div class="vx-row mb-4">
            <div class="vx-col w-full md:w-1/3 mb-3">
                <span class="block mb-1">Asesor</span>
                <v-select
                    :options="asesoresDisponibles"
                    :reduce="opt => opt.id_usuario"
                    label="nombres"
                    placeholder="Todos los asesores"
                    class="w-full"
                    v-model="filtroAsesor"
                    :disabled="!asesoresDisponibles.length"
                    clearable
                />
            </div>
            <template v-if="tipoFiltro === 'fechas'">
                <div class="vx-col w-full md:w-1/3 mb-3">
                    <span class="block mb-1">Fecha inicio</span>
                    <flat-pickr
                        :config="configFecha"
                        v-model="fechaFrom"
                        placeholder="Desde"
                        class="w-full"
                    />
                </div>
                <div class="vx-col w-full md:w-1/3 mb-3">
                    <span class="block mb-1">Fecha fin</span>
                    <flat-pickr
                        :config="configFecha"
                        v-model="fechaTo"
                        placeholder="Hasta"
                        class="w-full"
                    />
                </div>
            </template>
            <div v-else class="vx-col w-full md:w-2/3 mb-3">
                <span class="block mb-2">Año</span>
                <ul class="flex flex-wrap">
                    <li v-for="(item, index) in anios" :key="index" class="mr-3 mb-2">
                        <vs-radio
                            v-model="anioSelect"
                            vs-name="anioReporte"
                            :vs-value="item.anio"
                        >{{ item.anio }}</vs-radio>
                    </li>
                </ul>
            </div>
        </div>

        <div class="vx-row mb-4 items-center">
            <div class="vx-col w-full flex items-end flex-wrap">
                <vs-button color="primary" type="filled" icon="search" @click="buscar">
                    Buscar
                </vs-button>
                <!-- <vs-button color="warning" type="border" icon="clear" class="ml-2" @click="limpiarFiltros">
                    Limpiar
                </vs-button> -->
                <vs-button
                    v-if="reporte.length"
                    color="success"
                    type="border"
                    icon="file_download"
                    class="ml-5"
                    @click="exportarExcel"
                >
                    Exportar Excel
                </vs-button>
            </div>
        </div>

        <div v-if="reporte.length" class="resumen-global mb-5">
            <div class="resumen-card">
                <span class="resumen-num">{{ reporteFiltrado.length }}</span>
                <span class="resumen-label">Asesores</span>
            </div>
            <div class="resumen-card resumen-card--azul">
                <span class="resumen-num">{{ totalesGlobales.capacitaciones }}</span>
                <span class="resumen-label">Capacitaciones</span>
            </div>
            <div class="resumen-card resumen-card--verde">
                <span class="resumen-num">{{ totalesGlobales.asistentes }}</span>
                <span class="resumen-label">Asistentes</span>
            </div>
            <div class="resumen-card resumen-card--amarillo">
                <span class="resumen-num">{{ totalesGlobales.encuestas }}</span>
                <span class="resumen-label">Enc. asignadas</span>
            </div>
            <div class="resumen-card resumen-card--naranja">
                <span class="resumen-num">{{ totalesGlobales.respuestasEncuesta }}</span>
                <span class="resumen-label">Resp. encuesta</span>
            </div>
            <div class="resumen-card resumen-card--morado">
                <span class="resumen-num">{{ totalesGlobales.capacitadores }}</span>
                <span class="resumen-label">Capacitadores</span>
            </div>
        </div>

        <div v-if="cargando" class="text-center py-10">
            <p class="text-gray-500">Cargando reporte...</p>
        </div>
        <div v-else-if="!reporte.length && buscado" class="text-center py-10">
            <p class="text-gray-500">No se encontraron capacitaciones realizadas con los filtros seleccionados.</p>
        </div>
        <div v-else-if="reporte.length">
            <div class="busqueda-wrapper mb-3">
                <vs-input
                    v-model="busqueda"
                    placeholder="Buscar por asesor o institución..."
                    icon="search"
                    class="busqueda-input w-full"
                />
            </div>

            <div v-if="!reporteFiltrado.length" class="text-center py-6">
                <p class="text-gray-500">No hay resultados para la búsqueda.</p>
            </div>

            <div v-for="(asesor, index) in reporteFiltrado" :key="asesor.id_usuario || index" class="drill-row">
                <div class="drill-header" @click="toggleAsesor(asesor.id_usuario)">
                    <span class="drill-arrow">{{ expandedAsesor === asesor.id_usuario ? '▼' : '▶' }}</span>
                    <span class="font-semibold flex-1">
                        {{ asesor.asesor }}
                        <span class="text-xs text-gray-500 font-normal ml-1">(#{{ asesor.id_usuario }})</span>
                    </span>
                    <span class="drill-chips" @click.stop>
                        <vx-tooltip text="Capacitaciones realizadas" position="top" color="primary" class="chip-tooltip mr-2">
                            <vs-chip color="primary">{{ asesor.total_capacitaciones }} cap.</vs-chip>
                        </vx-tooltip>
                        <vx-tooltip text="Total de asistentes registrados" position="top" color="success" class="chip-tooltip mr-2">
                            <vs-chip color="success">{{ asesor.total_asistentes }} asist.</vs-chip>
                        </vx-tooltip>
                        <vx-tooltip text="Encuestas asignadas a las capacitaciones" position="top" color="warning" class="chip-tooltip mr-2">
                            <vs-chip color="warning">{{ asesor.total_encuestas }} enc.</vs-chip>
                        </vx-tooltip>
                        <vx-tooltip text="Personas que respondieron la encuesta" position="top" color="danger" class="chip-tooltip mr-2">
                            <vs-chip color="danger">{{ asesor.total_respuestas_encuesta || 0 }} resp.</vs-chip>
                        </vx-tooltip>
                        <vx-tooltip text="Capacitadores distintos que participaron" position="top" color="dark" class="chip-tooltip">
                            <vs-chip color="dark">{{ asesor.total_capacitadores }} capac.</vs-chip>
                        </vx-tooltip>
                    </span>
                </div>

                <div v-if="expandedAsesor === asesor.id_usuario" class="drill-body">
                    <vs-table stripe :data="asesor.capacitaciones">
                        <template slot="thead">
                            <vs-th>Tema / Programa</vs-th>
                            <vs-th>Institución</vs-th>
                            <vs-th>Fecha</vs-th>
                            <vs-th>Asistentes</vs-th>
                            <vs-th>Enc. asign.</vs-th>
                            <vs-th>Resp. encuesta</vs-th>
                            <vs-th>Capacitadores</vs-th>
                        </template>
                        <template slot-scope="{ data }">
                            <vs-tr :data="cap" :key="cap.id_seminario" v-for="cap in data">
                                <vs-td>
                                    <p class="font-semibold mb-1">
                                        {{ cap.tema || cap.nombre }}
                                        <span class="text-xs text-gray-500 font-normal ml-1">(#{{ cap.id_seminario }})</span>
                                    </p>
                                    <span class="text-xs text-gray-500">{{ cap.area_capacitacion }} · {{ cap.tipo === 0 ? 'Presencial' : 'Virtual' }}</span>
                                </vs-td>
                                <vs-td>
                                    <p>{{ cap.nombreInstitucion }}</p>
                                    <vs-chip v-if="cap.estado_institucion_temporal == 1 || cap.estado_institucion_temporal == '1'" color="warning" size="small" class="mt-1">Temporal</vs-chip>
                                </vs-td>
                                <vs-td>
                                    <span>{{ formatFecha(cap.fecha_inicio) }}</span>
                                    <br>
                                    <span class="text-xs text-gray-500">{{ cap.hora_inicio }} - {{ cap.hora_fin }}</span>
                                </vs-td>
                                <vs-td>{{ cap.cant_asistentes != null ? cap.cant_asistentes : 0 }}</vs-td>
                                <vs-td>{{ cap.cant_encuestas != null ? cap.cant_encuestas : 0 }}</vs-td>
                                <vs-td>{{ cap.cant_respuestas_encuesta != null ? cap.cant_respuestas_encuesta : 0 }}</vs-td>
                                <vs-td>
                                    <vs-chip color="primary" size="small" class="mb-1">{{ cap.cant_capacitadores }}</vs-chip>
                                    <div v-for="(capac, ci) in cap.capacitadores" :key="ci" class="text-xs mb-1">
                                        {{ capac.nombres }} {{ capac.apellidos }}
                                        <span class="text-gray-500">({{ capac.cedula }})</span>
                                    </div>
                                    <span v-if="!cap.capacitadores.length" class="text-xs text-gray-400">Sin capacitadores</span>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css'
import moment from 'moment'
import * as XLSX from 'xlsx'

export default {
    name: 'CertificadosReporteCapacitaciones',
    components: {
        vSelect,
        flatPickr,
    },
    data() {
        const yactual = moment().format('YYYY')
        return {
            asesoresDisponibles: [],
            reporteCompleto: [],
            filtroAsesor: null,
            tipoFiltro: 'fechas',
            fechaFrom: moment().startOf('month').format('YYYY-MM-DD'),
            fechaTo: moment().format('YYYY-MM-DD'),
            anioSelect: yactual,
            anios: [
                { anio: yactual },
                { anio: String(Number(yactual) - 1) },
                { anio: String(Number(yactual) - 2) },
            ],
            configFecha: {
                enableTime: false,
                dateFormat: 'Y-m-d',
            },
            expandedAsesor: null,
            busqueda: '',
            cargando: false,
            buscado: false,
            currentUser: null,
            ignorarAutoBuscar: false,
        }
    },
    computed: {
        reporte() {
            if (!this.filtroAsesor) {
                return this.reporteCompleto
            }
            return this.reporteCompleto.filter(a => a.id_usuario == this.filtroAsesor)
        },
        reporteFiltrado() {
            const q = (this.busqueda || '').trim().toLowerCase()
            if (!q) {
                return this.reporte
            }

            return this.reporte.map(a => {
                const nombreMatch = (a.asesor || '').toLowerCase().includes(q)
                if (nombreMatch) {
                    return {
                        ...a,
                        capacitaciones: (a.capacitaciones || []).slice(),
                    }
                }
                const caps = (a.capacitaciones || []).filter(c =>
                    (c.nombreInstitucion || '').toLowerCase().includes(q)
                )
                if (!caps.length) {
                    return null
                }
                return this.recalcularAsesor(a, caps)
            }).filter(Boolean)
        },
        totalesGlobales() {
            return this.reporteFiltrado.reduce((acc, a) => {
                acc.capacitaciones += a.total_capacitaciones || 0
                acc.asistentes += a.total_asistentes || 0
                acc.encuestas += a.total_encuestas || 0
                acc.respuestasEncuesta += a.total_respuestas_encuesta || 0
                acc.capacitadores += a.total_capacitadores || 0
                return acc
            }, { capacitaciones: 0, asistentes: 0, encuestas: 0, respuestasEncuesta: 0, capacitadores: 0 })
        },
        fechasRango() {
            return {
                from: this.fechaFrom,
                to: this.fechaTo,
            }
        },
    },
    created() {
        this.currentUser = JSON.parse(localStorage.getItem('usuario'))
    },
    mounted() {
        this.$nextTick(() => {
            this.autoBuscar()
        })
    },
    watch: {
        tipoFiltro() {
            this.filtroAsesor = null
            this.autoBuscar()
        },
        anioSelect() {
            if (this.tipoFiltro === 'anios') {
                this.filtroAsesor = null
                this.autoBuscar()
            }
        },
        fechasRango() {
            if (this.tipoFiltro === 'fechas') {
                this.filtroAsesor = null
                this.autoBuscar()
            }
        },
    },
    methods: {
        validarFiltros(mostrarAvisos) {
            if (this.tipoFiltro === 'fechas') {
                if (!this.fechaFrom || !this.fechaTo) {
                    return false
                }
                if (this.fechaFrom > this.fechaTo) {
                    if (mostrarAvisos) {
                        this.notify('La fecha inicio no puede ser mayor a la fecha fin', 'warning')
                    }
                    return false
                }
            } else if (!this.anioSelect) {
                if (mostrarAvisos) {
                    this.notify('Seleccione un año', 'warning')
                }
                return false
            }
            return true
        },
        autoBuscar() {
            if (this.ignorarAutoBuscar || this.cargando) {
                return
            }
            if (!this.validarFiltros(true)) {
                return
            }
            this.ejecutarBusqueda(false)
        },
        buscar() {
            if (!this.validarFiltros(true)) {
                return
            }
            this.ejecutarBusqueda(true)
        },
        ejecutarBusqueda(mostrarAvisoVacio) {
            const params = new URLSearchParams()
            params.append('idusuario', this.currentUser.idusuario)
            if (this.tipoFiltro === 'fechas') {
                params.append('fecha_from', this.fechaFrom)
                params.append('fecha_to', this.fechaTo)
            } else {
                params.append('anio', this.anioSelect)
            }

            this.cargando = true
            this.buscado = true
            this.expandedAsesor = null
            this.$vs.loading()

            this.$http.get(`${this.$server_url}reporte/capacitaciones-por-asesor?${params.toString()}`)
                .then(res => {
                    this.reporteCompleto = res.data || []
                    this.asesoresDisponibles = this.reporteCompleto.map(a => ({
                        id_usuario: a.id_usuario,
                        nombres: a.asesor,
                    }))
                    if (!this.reporteCompleto.length && mostrarAvisoVacio) {
                        this.notify('No se encontraron capacitaciones realizadas', 'warning')
                    }
                })
                .catch(err => {
                    this.notify(`Error al obtener el reporte: ${err}`, 'danger')
                    this.reporteCompleto = []
                    this.asesoresDisponibles = []
                })
                .finally(() => {
                    this.cargando = false
                    this.$vs.loading.close()
                })
        },
        // limpiarFiltros() {
        //     this.ignorarAutoBuscar = true
        //     this.filtroAsesor = null
        //     this.tipoFiltro = 'fechas'
        //     this.fechaFrom = moment().startOf('month').format('YYYY-MM-DD')
        //     this.fechaTo = moment().format('YYYY-MM-DD')
        //     this.anioSelect = moment().format('YYYY')
        //     this.busqueda = ''
        //     this.reporte = []
        //     this.expandedAsesor = null
        //     this.buscado = false
        //     this.$nextTick(() => {
        //         this.ignorarAutoBuscar = false
        //         this.autoBuscar()
        //     })
        // },
        toggleAsesor(id) {
            this.expandedAsesor = this.expandedAsesor === id ? null : id
        },
        recalcularAsesor(asesor, capacitaciones) {
            const capacitadorIds = {}
            capacitaciones.forEach(cap => {
                ;(cap.capacitadores || []).forEach(c => {
                    capacitadorIds[c.idusuario] = true
                })
            })
            return {
                ...asesor,
                capacitaciones,
                total_capacitaciones: capacitaciones.length,
                total_encuestas: capacitaciones.reduce((s, c) => s + (c.cant_encuestas || 0), 0),
                total_respuestas_encuesta: capacitaciones.reduce((s, c) => s + (c.cant_respuestas_encuesta || 0), 0),
                total_asistentes: capacitaciones.reduce((s, c) => s + (c.cant_asistentes || 0), 0),
                total_capacitadores: Object.keys(capacitadorIds).length,
            }
        },
        formatFecha(fecha) {
            return fecha ? moment(fecha).format('DD/MM/YYYY') : '-'
        },
        formatCapacitadores(capacitadores) {
            if (!capacitadores || !capacitadores.length) return 'Sin capacitadores'
            return capacitadores
                .map(c => `${c.nombres} ${c.apellidos} (${c.cedula})`)
                .join('; ')
        },
        exportarExcel() {
            if (!this.reporte.length) {
                this.notify('No hay datos para exportar', 'warning')
                return
            }

            const hojaGeneral = this.reporteFiltrado.map(a => ({
                Asesor: a.asesor,
                'Total capacitaciones': a.total_capacitaciones,
                'Total asistentes': a.total_asistentes,
                'Total encuestas asignadas': a.total_encuestas,
                'Total respuestas encuesta': a.total_respuestas_encuesta || 0,
                'Total capacitadores': a.total_capacitadores,
            }))

            hojaGeneral.push({
                Asesor: 'TOTAL GENERAL',
                'Total capacitaciones': this.totalesGlobales.capacitaciones,
                'Total asistentes': this.totalesGlobales.asistentes,
                'Total encuestas asignadas': this.totalesGlobales.encuestas,
                'Total respuestas encuesta': this.totalesGlobales.respuestasEncuesta,
                'Total capacitadores': this.totalesGlobales.capacitadores,
            })

            const hojaDetalle = []
            this.reporteFiltrado.forEach(asesor => {
                asesor.capacitaciones.forEach(cap => {
                    hojaDetalle.push({
                        ID: cap.id_seminario,
                        Asesor: asesor.asesor,
                        Tema: cap.tema || cap.nombre,
                        Institución: cap.nombreInstitucion,
                        'Tipo institución': cap.tipoInstitucion || (cap.estado_institucion_temporal == 1 || cap.estado_institucion_temporal == '1' ? 'Temporal' : 'Prolipa'),
                        Área: cap.area_capacitacion,
                        Modalidad: cap.tipo === 0 ? 'Presencial' : 'Virtual',
                        Fecha: this.formatFecha(cap.fecha_inicio),
                        Horario: `${cap.hora_inicio || ''} - ${cap.hora_fin || ''}`,
                        'Cant. asistentes': cap.cant_asistentes != null ? cap.cant_asistentes : 0,
                        'Enc. asignadas': cap.cant_encuestas != null ? cap.cant_encuestas : 0,
                        'Personas resp. encuesta': cap.cant_respuestas_encuesta != null ? cap.cant_respuestas_encuesta : 0,
                        'Cant. capacitadores': cap.cant_capacitadores != null ? cap.cant_capacitadores : 0,
                        Capacitadores: this.formatCapacitadores(cap.capacitadores),
                    })
                })
            })

            const wb = XLSX.utils.book_new()
            const wsGeneral = XLSX.utils.json_to_sheet(hojaGeneral)
            const wsDetalle = XLSX.utils.json_to_sheet(hojaDetalle)

            XLSX.utils.book_append_sheet(wb, wsGeneral, 'Resumen por Asesor')
            XLSX.utils.book_append_sheet(wb, wsDetalle, 'Detalle Capacitaciones')

            const sufijo = this.tipoFiltro === 'fechas'
                ? `${this.fechaFrom}_${this.fechaTo}`
                : this.anioSelect

            XLSX.writeFile(wb, `reporte_capacitaciones_asesores_${sufijo}.xlsx`)
        },
        notify(text, color) {
            this.$vs.notify({ title: color === 'danger' ? 'Error' : 'Aviso', text, color })
        },
    },
}
</script>

<style scoped>
.alerta-realizadas {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 14px;
    background: #eef4ff;
    border: 1px solid #c7d9f5;
    border-left: 4px solid #2563eb;
    border-radius: 8px;
    box-sizing: border-box;
    width: 100%;
    max-width: 100%;
}
.alerta-realizadas__icon {
    flex-shrink: 0;
    font-size: 16px;
    line-height: 1.4;
}
.alerta-realizadas__texto {
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
    color: #1e3a5f;
    word-wrap: break-word;
    overflow-wrap: break-word;
}
@media (max-width: 640px) {
    .alerta-realizadas {
        flex-direction: row;
        padding: 10px 12px;
    }
    .alerta-realizadas__texto {
        font-size: 12px;
        line-height: 1.45;
    }
}
.busqueda-wrapper {
    width: 100%;
    max-width: 480px;
}
.busqueda-wrapper >>> .vs-con-input,
.busqueda-wrapper >>> .vs-inputx {
    width: 100%;
}
@media (max-width: 768px) {
    .busqueda-wrapper {
        max-width: 100%;
    }
}
.resumen-global {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
}
.resumen-card {
    flex: 1;
    min-width: 120px;
    background: #f8f9fa;
    border-radius: 8px;
    padding: 12px 16px;
    text-align: center;
    border: 1px solid #e9ecef;
}
.resumen-card--azul { background: #eef2ff; border-color: #c7d2fe; }
.resumen-card--verde { background: #ecfdf5; border-color: #a7f3d0; }
.resumen-card--amarillo { background: #fffbeb; border-color: #fde68a; }
.resumen-card--naranja { background: #fff7ed; border-color: #fdba74; }
.resumen-card--morado { background: #f5f3ff; border-color: #ddd6fe; }
.resumen-num {
    display: block;
    font-size: 1.5rem;
    font-weight: 700;
    color: #1a1a2e;
}
.resumen-label {
    font-size: 0.75rem;
    color: #6b7280;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}
.drill-row {
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    margin-bottom: 8px;
    overflow: hidden;
}
.drill-header {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    cursor: pointer;
    background: #fafafa;
    transition: background 0.15s;
}
.drill-header:hover {
    background: #f3f4f6;
}
.drill-arrow {
    margin-right: 10px;
    color: #6b7280;
    font-size: 0.75rem;
    width: 14px;
}
.drill-body {
    padding: 12px 16px 16px;
    background: #fff;
    border-top: 1px solid #e5e7eb;
}
.drill-chips {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: flex-end;
}
.chip-tooltip {
    display: inline-block;
}
@media (max-width: 640px) {
    .drill-chips {
        width: 100%;
        margin-top: 8px;
        justify-content: flex-start;
    }
}
</style>
