<template>
<vx-card class="p-2">

    <!-- Cabecera -->
    <div class="pe-header">
        <div>
            <h4 class="pe-titulo">📋 Mis Encuestas</h4>
            <span class="pe-sub">Historial de encuestas respondidas</span>
        </div>
        <vs-button size="small" color="primary" type="flat" icon-pack="feather" icon="icon-refresh-cw" @click="recargar" title="Recargar" />
    </div>

    <!-- Filtro de periodo -->
    <div class="pe-filtro" v-if="periodos.length">
        <label class="pe-label-sm">Filtrar por periodo:</label>
        <div class="pe-periodo-btns">
            <button
                class="pe-periodo-btn"
                :class="{ active: periodoSeleccionado === null }"
                @click="periodoSeleccionado = null; cargar()"
            >Todos</button>
            <button
                v-for="p in periodos" :key="p.idperiodoescolar"
                class="pe-periodo-btn"
                :class="{ active: periodoSeleccionado === p.idperiodoescolar }"
                @click="periodoSeleccionado = p.idperiodoescolar; cargar()"
            >{{ p.periodoescolar || p.descripcion }}</button>
        </div>
    </div>

    <!-- Cargando -->
    <div v-if="cargando" class="pe-empty">
        <vs-icon icon="hourglass_empty" size="32px" color="primary" />
        <span>Cargando...</span>
    </div>

    <!-- Sin resultados -->
    <div v-else-if="!encuestas.length" class="pe-empty">
        <vs-icon icon="assignment" size="32px" color="grey" />
        <span>No has respondido encuestas aún.</span>
    </div>

    <!-- Lista -->
    <div v-else class="pe-lista">
        <div v-for="item in encuestas" :key="item.respuesta_id" class="pe-item">
            <div class="pe-item-info">
                <b class="pe-item-titulo">{{ item.encuesta_titulo }}</b>
                <span v-if="item.nombre_capacitacion" class="pe-capacitacion">
                    <vs-icon icon="school" size="14px" class="mr-1"/>{{ item.nombre_capacitacion }}
                </span>
                <div class="pe-item-meta">
                    <vs-chip color="success" size="small">
                        <vs-icon icon="check_circle" size="12px" class="mr-1"/>Respondida
                    </vs-chip>
                    <span v-if="item.periodoescolar" class="pe-periodo-tag">
                        📅 {{ item.periodoescolar }}
                    </span>
                    <span class="pe-fecha">{{ formatFecha(item.fecha_respuesta) }}</span>
                </div>
            </div>
            <div class="pe-item-acciones">
                <!-- Estado descarga -->
                <vs-chip v-if="item.descargo_certificado" color="success" size="small" class="mr-2">
                    <vs-icon icon="download_done" size="12px" class="mr-1"/>Descargado
                </vs-chip>
                <vs-chip v-else color="warning" size="small" class="mr-2">
                    <vs-icon icon="download" size="12px" class="mr-1"/>Sin descargar
                </vs-chip>
                <!-- Botón descargar certificado -->
                <vs-button
                    size="small" color="primary" type="gradient"
                    icon-pack="feather" icon="icon-award"
                    @click="descargarCertificado(item)"
                    title="Descargar certificado"
                >Certificado</vs-button>
            </div>
        </div>
    </div>

</vx-card>
</template>

<script>
export default {
    data() {
        return {
            usuario:            JSON.parse(localStorage.getItem('usuario')) || null,
            encuestas:          [],
            periodos:           [],
            periodoSeleccionado: null,
            cargando:           false,
        }
    },

    mounted() {
        this.cargar()
    },

    methods: {
        recargar() {
            // Resetea todo para que cargar() vuelva a detectar el periodo por defecto
            this.periodos           = []
            this.periodoSeleccionado = null
            this.encuestas          = []
            this.cargar()
        },

        cargar() {
            if (!this.usuario) return
            this.cargando = true
            const params = this.periodoSeleccionado ? { params: { periodo_id: this.periodoSeleccionado } } : {}
            this.$http.get(this.$server_url + 'encuesta_prolipa/mis-encuestas/' + this.usuario.idusuario, params)
                .then(res => {
                    this.encuestas = res.data.encuestas || []
                    const periodos = res.data.periodos || []
                    // Cargar periodos solo la primera vez
                    if (!this.periodos.length && periodos.length) {
                        this.periodos = periodos
                        // Seleccionar el periodo con mayor id (el más reciente)
                        const maxPeriodo = periodos.reduce((max, p) =>
                            p.idperiodoescolar > max.idperiodoescolar ? p : max, periodos[0])
                        this.periodoSeleccionado = maxPeriodo.idperiodoescolar
                        // Recargar con el periodo seleccionado
                        this.cargando = false
                        this.cargar()
                    }
                })
                .catch(err => console.log(err))
                .finally(() => { this.cargando = false })
        },

        descargarCertificado(item) {
            // Guardar datos en localStorage para el componente de certificado
            localStorage.setItem('userEncuestaProlipa', JSON.stringify(this.usuario))
            localStorage.setItem('dataEncuestaCertificado', JSON.stringify({
                id:     item.encuesta_id,
                titulo: item.encuesta_titulo,
                codigo: item.encuesta_codigo,
            }))
            if (item.nombre_capacitacion) {
                localStorage.setItem('nombreEntidadEncuesta', item.nombre_capacitacion)
            } else {
                localStorage.removeItem('nombreEntidadEncuesta')
            }
            if (item.firma_capacitador) {
                localStorage.setItem('firmaCapacitadorEncuesta', item.firma_capacitador)
            } else {
                localStorage.removeItem('firmaCapacitadorEncuesta')
            }
            if (item.tipo_firma) {
                localStorage.setItem('tipoFirmaCapacitadorEncuesta', item.tipo_firma)
            } else {
                localStorage.removeItem('tipoFirmaCapacitadorEncuesta')
            }
            if (item.nombre_capacitador) {
                localStorage.setItem('nombreCapacitadorEncuesta', item.nombre_capacitador)
            } else {
                localStorage.removeItem('nombreCapacitadorEncuesta')
            }
            if (item.idusuario_capacitador) {
                localStorage.setItem('idusuarioCapacitadorEncuesta', String(item.idusuario_capacitador))
            } else {
                localStorage.removeItem('idusuarioCapacitadorEncuesta')
            }
            if (item.fecha_fin_capacitacion) {
                const fechaSola = String(item.fecha_fin_capacitacion).split(/[ T]/)[0]
                localStorage.setItem('fechaFinEncuesta', fechaSola)
            } else {
                localStorage.removeItem('fechaFinEncuesta')
            }
            if (item.asignacion_id) {
                localStorage.setItem('asignacionIdEncuesta', item.asignacion_id)
            } else {
                localStorage.removeItem('asignacionIdEncuesta')
            }
            window.open('/encuesta/prolipa/certificado', '_blank')
        },

        formatFecha(fecha) {
            if (!fecha) return '—'
            const d = new Date(fecha)
            return d.toLocaleDateString('es-EC') + ' ' + d.toLocaleTimeString('es-EC', { hour: '2-digit', minute: '2-digit' })
        }
    }
}
</script>

<style scoped>
.pe-header {
    display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 1.25rem;
    padding-bottom: 0.75rem; border-bottom: 1px solid #f1f5f9;
}
.pe-titulo  { font-size: 1.1rem; font-weight: 700; color: #1e293b; margin: 0 0 2px; }
.pe-sub     { font-size: 0.75rem; color: #94a3b8; }

.pe-filtro  { margin-bottom: 1rem; }
.pe-label-sm { font-size: 0.78rem; color: #64748b; display: block; margin-bottom: 0.4rem; }
.pe-periodo-btns { display: flex; flex-wrap: wrap; gap: 6px; }
.pe-periodo-btn {
    padding: 0.3rem 0.75rem; border-radius: 99px; border: 1px solid #e5e7eb;
    background: #fff; font-size: 0.8rem; cursor: pointer; color: #6b7280; transition: all 0.15s;
}
.pe-periodo-btn:hover  { border-color: #6c63ff; color: #6c63ff; }
.pe-periodo-btn.active { background: #6c63ff; color: #fff; border-color: #6c63ff; }

.pe-empty {
    display: flex; align-items: center; gap: 0.5rem;
    color: #94a3b8; font-size: 0.85rem; padding: 1rem 0;
}

.pe-lista { display: flex; flex-direction: column; gap: 0.6rem; }

.pe-item {
    display: flex; align-items: center; justify-content: space-between; gap: 0.75rem;
    padding: 0.75rem 1rem; border: 1px solid #e5e7eb; border-radius: 0.6rem; background: #fff;
}
.pe-item-info  { flex: 1; min-width: 0; }
.pe-item-titulo { font-size: 0.95rem; color: #1f2937; display: block; margin-bottom: 0.4rem; }
.pe-capacitacion {
    font-size: 0.8rem; color: #6366f1; display: flex; align-items: center; margin-top: 2px; margin-bottom: 0.35rem;
}
.pe-item-meta  { display: flex; align-items: center; gap: 0.5rem; margin-top: 0.35rem; flex-wrap: wrap; }
.pe-periodo-tag { font-size: 0.75rem; color: #64748b; }
.pe-fecha      { font-size: 0.75rem; color: #94a3b8; }
.pe-item-acciones { display: flex; align-items: center; flex-shrink: 0; gap: 4px; }

/* Responsive para móvil */
@media (max-width: 640px) {
    .pe-item {
        flex-direction: column;
        align-items: flex-start;
        padding: 1rem;
        gap: 0.75rem;
    }

    .pe-item-info {
        width: 100%;
    }

    .pe-item-titulo {
        font-size: 0.9rem;
        line-height: 1.4;
        margin-bottom: 0.5rem;
    }

    .pe-capacitacion {
        font-size: 0.78rem;
        margin-bottom: 0.5rem;
    }

    .pe-item-meta {
        width: 100%;
        gap: 0.4rem;
        margin-top: 0.25rem;
    }

    .pe-item-acciones {
        width: 100%;
        justify-content: space-between;
        gap: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px solid #f1f5f9;
    }

    .pe-header {
        flex-direction: row;
        align-items: flex-start;
    }

    .pe-titulo {
        font-size: 1rem;
    }

    .pe-sub {
        font-size: 0.72rem;
    }
}
</style>
