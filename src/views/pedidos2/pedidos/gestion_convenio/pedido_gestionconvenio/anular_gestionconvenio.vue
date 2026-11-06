<template>
<vx-card fixed-height="true" :class="{ 'theme-dark': themeMode }">
    <div class="text-center mt-4">
        <!-- Ícono + Mensaje -->
        <div class="flex items-start justify-center gap-3 mb-4 px-4 max-w-full">
            <feather-icon icon="AlertTriangleIcon" svgClasses="w-12 h-12 text-warning" />
            <p class="text-gray-700 text-sm md:text-base leading-relaxed max-w-md text-left">
                Esta acción cambiará el estado del convenio a <strong>Anulado</strong>. No se podrán subir nuevas evidencias para el mismo. Esta acción es irreversible.
            </p>
        </div>

        <!-- Info del Convenio -->
        <div v-if="convenio" class="mb-5 p-4 rounded-lg text-left max-w-md mx-auto border border-solid anular-info-card">
            <p class="text-sm my-1 text-gray-700"><b>Código: </b> <span class="text-primary font-semibold">{{ convenio.cdp_codigo }}</span></p>
            <p class="text-sm my-1 text-gray-700"><b>Año Inicio: </b> <span class="text-success font-bold">{{ convenio.cdp_anio_comienza }}</span></p>
            <p class="text-sm my-1 text-gray-700"><b>Año Final: </b> <span class="text-gray-600 font-semibold">{{ convenio.cdp_anio_termina }}</span></p>
        </div>

        <!-- Observación de anulación -->
        <div class="max-w-md mx-auto mb-6 text-left">
            <label class="block text-sm font-semibold text-gray-700 mb-1">
                Observación de la anulación <span class="text-danger">*</span>
            </label>
            <textarea
                v-model="observacion"
                ref="obsTextarea"
                class="anular-textarea"
                placeholder="Ingrese el motivo o detalle de la anulación..."
                rows="2"
                @input="ajustarAltura"
            ></textarea>
            <p v-if="mostrarErrorObs" class="text-danger text-xs mt-1">⚠ La observación es obligatoria para anular.</p>
        </div>

        <!-- Contenedor de botones -->
        <div class="mt-4 flex flex-wrap justify-center gap-4">
            <vs-button @click="postAnularConvenio()" type="relief" color="warning" icon-pack="feather" icon="icon-slash" :disabled="anulando">
                {{ anulando ? 'Anulando...' : 'Sí, Anular' }}
            </vs-button>
            <vs-button @click="getCancelar()" color="dark" type="relief">
                Cancelar
            </vs-button>
        </div>
    </div>
</vx-card>
</template>

<script>
import { mapState } from "vuex";

export default {
    name: 'anular_gestionconvenio',
    data() {
        return {
            anulando: false,
            observacion: '',
            mostrarErrorObs: false,
        };
    },
    props: {
        convenio: {
            type: Object,
            default: function () { return null; }
        },
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
    },
    methods: {
        ajustarAltura() {
            const el = this.$refs.obsTextarea;
            if (!el) return;
            el.style.height = 'auto';
            el.style.height = el.scrollHeight + 'px';
        },

        postAnularConvenio() {
            let me = this;
            if (!me.convenio || !me.convenio.cdp_id) return;

            // Validar observación obligatoria
            if (!me.observacion || !me.observacion.trim()) {
                me.mostrarErrorObs = true;
                me.$refs.obsTextarea && me.$refs.obsTextarea.focus();
                return;
            }
            me.mostrarErrorObs = false;

            me.anulando = true;
            me.$vs.loading();

            const usuarioJSON = localStorage.getItem('usuario');
            const usuarioObj  = JSON.parse(usuarioJSON || '{}');
            const idusuario   = usuarioObj.idusuario || null;

            const payload = {
                action:       'Post_Anular_Convenio_Pedido',
                cdp_id:       me.convenio.cdp_id,
                idusuario:    idusuario,
                observacion:  me.observacion.trim(),
            };

            me.$http.post(me.$server_url + 'VerifcarMetodosPost_Convenio_Documento_Pedido', payload)
                .then(res => {
                    me.$vs.loading.close();
                    const data = res.data;
                    if (data.status === 1) {
                        me.$vs.notify({
                            title: 'Convenio Anulado',
                            text: 'El convenio fue anulado correctamente.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.$emit('change', { verificacionemitanular: 1 });
                    } else {
                        me.$vs.notify({
                            title: 'Error',
                            text: data.message || 'No se pudo anular el convenio.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        title: 'Error de conexión',
                        text: 'No se pudo conectar con el servidor.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                })
                .finally(() => {
                    me.anulando = false;
                });
        },

        getCancelar() {
            this.$emit('change', { verificacionemitanular: 2 });
        },
    },
};
</script>

<style scoped>
.anular-textarea {
    width: 100%;
    min-height: 64px;
    max-height: 260px;
    resize: none;
    overflow-y: hidden;
    padding: 0.6rem 0.85rem;
    border: 1.5px solid #e2e8f0;
    border-radius: 8px;
    font-size: 0.9rem;
    color: #2d3748;
    background: #f8fafc;
    line-height: 1.6;
    transition: border-color 0.2s, box-shadow 0.2s;
    font-family: inherit;
    box-sizing: border-box;
}
.anular-textarea:focus {
    outline: none;
    border-color: #f6993f;
    box-shadow: 0 0 0 3px rgba(246, 153, 63, 0.15);
    background: #fff;
}
.anular-textarea::placeholder {
    color: #a0aec0;
}

/* Dark mode styles for annulment modal */
.theme-dark .anular-info-card {
    background: rgba(15, 23, 42, 0.5);
    border-color: #334155;
}

.theme-dark .anular-textarea {
    background: rgba(15, 23, 42, 0.6);
    color: #cbd5e1;
    border-color: #334155;
}
.theme-dark .anular-textarea:focus {
    background: rgba(15, 23, 42, 0.8);
    border-color: #7367f0;
    box-shadow: 0 0 0 3px rgba(115, 103, 240, 0.15);
}

.theme-dark .text-gray-700 {
    color: #cbd5e1 !important;
}
.theme-dark .text-gray-600 {
    color: #94a3b8 !important;
}
.theme-dark .vx-card {
    background-color: #1e293b !important;
    color: #cbd5e1 !important;
}

</style>
