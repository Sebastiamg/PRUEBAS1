<template>
<vx-card fixed-height="true">
    <div class="text-center mt-4">

        <!-- ── Estado inicial: confirmación ───────────────────────── -->
        <template v-if="!eliminando">
            <!-- Ícono + Texto informativo -->
            <div class="flex items-center justify-center gap-3 flex-wrap mb-4 px-4">
                <feather-icon icon="Trash2Icon" svgClasses="w-16 h-16 text-danger" />
                <p class="text-gray-600 text-base leading-relaxed max-w-lg text-left">
                    ⚠️ Al eliminar este convenio, este dejará de aparecer en la plataforma y se eliminarán
                 físicamente todos los archivos de evidencia asociados. Esta acción es irreversible.
                </p>
            </div>

            <!-- Info del Convenio -->
            <div v-if="convenio" class="mb-6 p-4 bg-gray-50 rounded-lg text-left max-w-md mx-auto border border-solid border-gray-200">
                <p class="text-sm my-1 text-gray-700"><b>Código: </b> <span class="text-primary font-semibold">{{ convenio.cdp_codigo }}</span></p>
                <p class="text-sm my-1 text-gray-700"><b>Año Inicio: </b> <span class="text-success font-bold">{{ convenio.cdp_anio_comienza }}</span></p>
                <p class="text-sm my-1 text-gray-700"><b>Año Final: </b> <span class="text-gray-600 font-semibold">{{ convenio.cdp_anio_termina }}</span></p>
            </div>

            <!-- Botones -->
            <div class="mt-6 flex flex-wrap justify-center gap-4">
                <vs-button @click="getEliminar_Convenio()" type="relief" color="danger">
                    Sí, Eliminar
                </vs-button>
                <vs-button @click="getCancelar()" color="dark" type="relief">
                    Cancelar
                </vs-button>
            </div>
        </template>

        <!-- ── Estado de progreso: eliminando ─────────────────────── -->
        <template v-else>
            <div class="progress-panel max-w-md mx-auto py-4">

                <!-- Icono animado -->
                <div class="spinner-wrap mb-4">
                    <div class="spinner-ring"></div>
                    <feather-icon icon="Trash2Icon" svgClasses="w-8 h-8 text-danger spinner-icon" />
                </div>

                <!-- Título de fase -->
                <h4 class="font-bold text-lg text-gray-800 mb-1">{{ faseTitulo }}</h4>
                <p class="text-sm text-gray-500 mb-4">{{ faseDescripcion }}</p>

                <!-- Barra de progreso -->
                <div v-if="totalArchivos > 0" class="progress-bar-wrap mb-3">
                    <div class="progress-bar-track">
                        <div class="progress-bar-fill" :style="{ width: porcentaje + '%' }"></div>
                    </div>
                    <div class="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Archivo {{ archivoActual }} de {{ totalArchivos }}</span>
                        <span>{{ porcentaje }}%</span>
                    </div>
                </div>

                <!-- Nota -->
                <p class="text-xs text-gray-400 mt-3">
                    Por favor espere, no cierre esta ventana...
                </p>
            </div>
        </template>

    </div>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import axios from "axios";

export default {
    name: 'eliminar_gestionconvenio',
    data() {
        return {
            eliminando: false,
            faseTitulo: '',
            faseDescripcion: '',
            totalArchivos: 0,
            archivoActual: 0,
        };
    },
    props: {
        convenio: {
            type: Object,
            default: function () {
                return null;
            }
        },
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        porcentaje() {
            if (!this.totalArchivos) return 0;
            return Math.round((this.archivoActual / this.totalArchivos) * 100);
        },
    },
    methods: {
        async getEliminar_Convenio() {
            let me = this;
            if (!me.convenio || !me.convenio.cdp_id) return;

            // ── Fase 1: eliminando registro en BD ─────────────────────
            me.eliminando = true;
            me.faseTitulo = 'Eliminando el convenio...';
            me.faseDescripcion = 'Se está procesando la eliminación en el servidor.';
            me.totalArchivos = 0;
            me.archivoActual = 0;

            try {
                const res = await me.$http.post(
                    me.$server_url + "VerifcarMetodosPost_Convenio_Documento_Pedido", {
                        action: "Post_Eliminar_Convenio_Pedido",
                        cdp_id: me.convenio.cdp_id
                    }
                );

                const data = res.data;

                if (data.status !== 1) {
                    me.$vs.notify({
                        text: data.message || 'El convenio no se pudo eliminar.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                    me.eliminando = false;
                    return;
                }

                // ── Fase 2: eliminar archivos físicos ─────────────────
                const evidencias = data.evidencias || [];
                me.totalArchivos = evidencias.length;

                if (evidencias.length > 0) {
                    me.faseTitulo = 'Eliminando archivos de evidencia...';
                    me.faseDescripcion = `Se eliminarán ${evidencias.length} archivo(s) físico(s) del servidor de archivos.`;

                    for (let i = 0; i < evidencias.length; i++) {
                        const ev = evidencias[i];
                        me.archivoActual = i + 1;
                        me.faseDescripcion = `Eliminando archivo ${i + 1} de ${evidencias.length}: ${ev.egf_archivo}`;

                        try {
                            await axios.post(me.$data_url + 'api/eliminarArchivoConvenio', {
                                egf_archivo: ev.egf_archivo,
                                egf_url: ev.egf_url,
                            });
                        } catch (errFisico) {
                            console.warn('No se pudo eliminar el archivo físico:', ev.egf_archivo, errFisico);
                        }
                    }
                }

                // ── Fase 3: completado ────────────────────────────────
                me.faseTitulo = '¡Eliminación completada!';
                me.faseDescripcion = evidencias.length > 0 ?
                    `El convenio y ${evidencias.length} archivo(s) de evidencia fueron eliminados.` :
                    'El convenio fue eliminado correctamente.';

                // Breve pausa para que el usuario vea el estado final
                await new Promise(r => setTimeout(r, 800));

                me.$vs.notify({
                    text: me.faseDescripcion,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });

                me.$emit('change', {
                    verificacionemiteliminar: 1
                });

            } catch (err) {
                console.error(err);
                me.$vs.notify({
                    text: 'El convenio no se pudo eliminar por un error de conexión.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
                me.eliminando = false;
            }
        },

        getCancelar() {
            this.$emit('change', {
                verificacionemiteliminar: 2
            });
        },
    },
};
</script>

<style scoped>
/* ── Spinner animado ────────────────────────────────────── */
.spinner-wrap {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 72px;
    height: 72px;
}

.spinner-ring {
    position: absolute;
    inset: 0;
    border: 4px solid #fee2e2;
    border-top-color: #ef4444;
    border-radius: 50%;
    animation: spin 0.9s linear infinite;
}

.spinner-icon {
    position: relative;
    z-index: 1;
    animation: pulse 1.2s ease-in-out infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

@keyframes pulse {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0.5;
    }
}

/* ── Barra de progreso ──────────────────────────────────── */
.progress-bar-wrap {
    width: 100%;
}

.progress-bar-track {
    background: #fee2e2;
    border-radius: 999px;
    height: 10px;
    overflow: hidden;
}

.progress-bar-fill {
    background: linear-gradient(90deg, #ef4444, #b91c1c);
    height: 100%;
    border-radius: 999px;
    transition: width 0.35s ease;
}
</style>
