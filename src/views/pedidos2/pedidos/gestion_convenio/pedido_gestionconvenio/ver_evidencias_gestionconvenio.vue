<template>
<div class="ve-wrapper" :class="{ 've-dark': themeMode }">

    <!-- ══ HEADER ══ -->
    <div class="ve-header">
        <div class="ve-header-icon">
            <feather-icon icon="EyeIcon" svgClasses="w-6 h-6" />
        </div>
        <div>
            <h3 class="ve-header-title">Evidencias del Convenio</h3>
            <p class="ve-header-sub">Código: <strong>{{ cdp_codigo }}</strong></p>
        </div>
        <vs-button v-if="(userFacturador || userAdminFacturador || userRoot) && cdp_estado != '2'" size="small" color="#3182ce" type="filled" icon-pack="feather" icon="icon-upload-cloud" class="ml-auto" @click="abrirSubir">
            Agregar más
        </vs-button>
    </div>

    <!-- ══ CARGANDO ══ -->
    <div v-if="cargando" class="ve-loading">
        <div class="ve-spinner"></div>
        <p>Cargando evidencias...</p>
    </div>

    <!-- ══ EMPTY STATE ══ -->
    <div v-else-if="!cargando && evidencias.length === 0" class="ve-empty">
        <feather-icon icon="InboxIcon" svgClasses="w-16 h-16" style="color:#475569;" />
        <p class="ve-empty-title">Sin evidencias cargadas</p>
        <p class="ve-empty-sub">Este convenio aún no tiene archivos de evidencia asociados.</p>
        <vs-button v-if="cdp_estado != '2'" type="filled" color="#3182ce" icon-pack="feather" icon="icon-upload-cloud" @click="abrirSubir">
            Subir evidencia
        </vs-button>
    </div>

    <!-- ══ GRID DE EVIDENCIAS ══ -->
    <div v-else class="ve-grid">
        <transition-group name="ve-fade" tag="div" class="ve-grid-inner">
            <div v-for="ev in evidencias" :key="ev.egf_id" class="ve-card">
                <!-- Preview -->
                <div class="ve-card-preview" @click="verArchivo(ev)">
                    <img v-if="esImagen(ev.egf_archivo)" :src="getUrl(ev)" :alt="ev.egf_archivo" class="ve-preview-img" />
                    <div v-else class="ve-preview-pdf">
                        <feather-icon icon="FileTextIcon" svgClasses="w-14 h-14" style="color:#ef4444;" />
                        <span class="ve-pdf-label">PDF</span>
                    </div>
                    <!-- Overlay hover -->
                    <div class="ve-card-overlay">
                        <feather-icon icon="ZoomInIcon" svgClasses="w-8 h-8" style="color:#fff;" />
                    </div>
                </div>

                <!-- Info -->
                <div class="ve-card-info">
                    <p class="ve-card-name" :title="ev.egf_archivo">{{ nombreCorto(ev.egf_archivo) }}</p>
                    <div class="ve-card-meta">
                        <span class="ve-meta-chip ve-meta-size">{{ ev.egf_tamano || '—' }} MB</span>
                        <!-- <span class="ve-meta-chip ve-meta-date">{{ formatFecha(ev.created_at) }}</span> -->
                    </div>
                </div>

                <!-- Botón eliminar -->
                <button v-if="(userFacturador || userAdminFacturador || userRoot) && (cdp_estado != '2' || userRoot)" class="ve-card-delete" :class="{ 've-card-delete--confirm': ev._confirmando }" @click="toggleConfirmar(ev)" :disabled="ev._eliminando">
                    <span v-if="!ev._confirmando && !ev._eliminando">
                        <feather-icon icon="Trash2Icon" svgClasses="w-4 h-4" /> Eliminar
                    </span>
                    <span v-else-if="ev._eliminando">
                        Eliminando...
                    </span>
                    <span v-else>
                        ¿Confirmar?
                    </span>
                </button>

                <!-- Cancelar confirmación -->
                <button v-if="ev._confirmando && !ev._eliminando" class="ve-card-cancel" @click="ev._confirmando = false">
                    Cancelar
                </button>
            </div>
        </transition-group>
    </div>

    <!-- ══ POPUP SUBIR MÁS ══ -->
    <vs-popup title="Agregar Evidencias" :active.sync="popupSubirMas" class="ve-popup-subir">
        <subir_evidencia_gestionconvenio v-if="popupSubirMas" :cdp_id="cdp_id" :cdp_codigo="cdp_codigo" :tamanioExistenteMegas="totalMegasExistentes" @change="changeHandleSubir" />
    </vs-popup>

    <!-- ══ LIGHTBOX IMAGEN ══ -->
    <div v-if="lightboxAbierto" class="ve-lightbox" @click.self="cerrarLightbox">
        <div class="ve-lightbox-inner">
            <button class="ve-lightbox-close" @click="cerrarLightbox">
                <feather-icon icon="XIcon" svgClasses="w-6 h-6" />
            </button>
            <img v-if="lightboxEsImagen" :src="lightboxUrl" class="ve-lightbox-img" :alt="lightboxNombre" />
            <iframe v-else :src="lightboxUrl" class="ve-lightbox-pdf" frameborder="0"></iframe>
            <p class="ve-lightbox-name">{{ lightboxNombre }}</p>
        </div>
    </div>

</div>
</template>

<script>
import {
    mapState
} from "vuex";
import axios from 'axios';
const subir_evidencia_gestionconvenio = () => import('@/views/pedidos2/pedidos/gestion_convenio/pedido_gestionconvenio/subir_evidencia_gestionconvenio.vue');

export default {
    name: 'ver_evidencias_gestionconvenio',
    components: {
        subir_evidencia_gestionconvenio
    },

    props: {
        cdp_id: {
            type: [Number, String],
            default: null
        },
        cdp_codigo: {
            type: String,
            default: ''
        },
        cdp_estado: {
            type: [Number, String],
            default: null
        },
    },

    data() {
        return {
            evidencias: [],
            cargando: false,
            popupSubirMas: false,
            lightboxAbierto: false,
            lightboxUrl: '',
            lightboxNombre: '',
            lightboxEsImagen: false,
            extensionesImagen: ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
        };
    },

    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega', 'userFacturador', 'userAdminFacturador']),
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        totalMegasExistentes() {
            return this.evidencias.reduce((sum, ev) => sum + parseFloat(ev.egf_tamano || 0), 0);
        }
    },

    mounted() {
        this.cargarEvidencias();
    },

    methods: {
        // ── Carga ────────────────────────────────────────────────────
        cargarEvidencias() {
            let me = this;
            me.cargando = true;
            me.$http.get(
                me.$server_url + `VerifcarMetodosGet_Convenio_Documento_Pedido?action=Get_Evidencias_xConvenio&cdp_id=${me.cdp_id}`
            ).then(res => {
                me.evidencias = (res.data || []).map(e => ({
                    ...e,
                    _confirmando: false,
                    _eliminando: false,
                }));
            }).catch(err => {
                console.error('Error cargando evidencias:', err);
                me.$vs.notify({
                    title: 'Error',
                    text: 'No se pudieron cargar las evidencias.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
            }).finally(() => {
                me.cargando = false;
            });
        },

        // ── Eliminar ─────────────────────────────────────────────────
        toggleConfirmar(ev) {
            if (ev._confirmando) {
                // Segundo clic = confirma la eliminación
                this.eliminarEvidencia(ev);
            } else {
                // Primer clic = pide confirmación
                // Cierra otras confirmaciones abiertas
                this.evidencias.forEach(e => {
                    if (e !== ev) e._confirmando = false;
                });
                ev._confirmando = true;
            }
        },

        async eliminarEvidencia(ev) {
            let me = this;
            ev._eliminando = true;

            try {
                // 1) Eliminar de la BD y actualizar cdp_estado si corresponde
                const res = await me.$http.post(
                    me.$server_url + 'VerifcarMetodosPost_Convenio_Documento_Pedido', {
                        action: 'Post_Eliminar_Evidencia_Convenio',
                        egf_id: ev.egf_id,
                        cdp_id: me.cdp_id,
                        is_root: me.userRoot ? 1 : 0,
                    }
                );

                if (res.data.status !== 1) {
                    throw new Error(res.data.message || 'Error al eliminar la evidencia.');
                }

                // 2) Eliminar archivo físico desde el files project
                try {
                    await axios.post(me.$data_url + 'api/eliminarArchivoConvenio', {
                        egf_archivo: res.data.egf_archivo,
                        egf_url: res.data.egf_url,
                    });
                } catch (errFisico) {
                    console.warn('No se pudo eliminar el archivo físico:', errFisico);
                }

                me.$vs.notify({
                    title: 'Evidencia eliminada',
                    text: 'La evidencia fue eliminada correctamente.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check',
                    time: 4000,
                });

                // Recargar lista y emitir para que la lista actualice el estado del convenio
                me.cargarEvidencias();
                me.$emit('change', {
                    verificacionemit: 1
                });

            } catch (err) {
                console.error('Error eliminando evidencia:', err);
                me.$vs.notify({
                    title: 'Error',
                    text: err.message || 'No se pudo eliminar la evidencia.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x',
                });
                ev._confirmando = false;
                ev._eliminando = false;
            }
        },

        // ── Lightbox ─────────────────────────────────────────────────
        verArchivo(ev) {
            this.lightboxUrl = this.getUrl(ev);
            this.lightboxNombre = ev.egf_archivo;
            this.lightboxEsImagen = this.esImagen(ev.egf_archivo);
            this.lightboxAbierto = true;
        },

        cerrarLightbox() {
            this.lightboxAbierto = false;
            this.lightboxUrl = '';
        },

        // ── Subir más ────────────────────────────────────────────────
        abrirSubir() {
            this.popupSubirMas = true;
        },

        changeHandleSubir(e) {
            this.popupSubirMas = false;
            if (e.verificacionemit === 1) {
                this.cargarEvidencias();
                setTimeout(() => {
                    this.$emit('change', {
                        verificacionemit: 1
                    });
                }, 350);
            }
        },

        // ── Helpers ──────────────────────────────────────────────────
        esImagen(nombre) {
            if (!nombre) return false;
            const ext = nombre.split('.').pop().toLowerCase();
            return this.extensionesImagen.includes(ext);
        },

        getUrl(ev) {
            // $data_url ya apunta al files project (ej: http://localhost/plataformaprolipa_files/public/)
            return this.$data_url + ev.egf_url + '/' + ev.egf_archivo;
        },

        nombreCorto(nombre) {
            if (!nombre) return '—';
            return nombre.length > 28 ? '...' + nombre.slice(-25) : nombre;
        },

        formatFecha(fecha) {
            if (!fecha) return '—';
            const d = new Date(fecha);
            const p = n => String(n).padStart(2, '0');
            return `${p(d.getDate())}/${p(d.getMonth()+1)}/${d.getFullYear()}`;
        },
    },
};
</script>

<style scoped>
/* ── Wrapper ──────────────────────────────────────────────────── */
.ve-wrapper {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    color: #2d3748;
    padding: 1.5rem;
    min-height: 280px;
    position: relative;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}
.ve-wrapper.ve-dark {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border-color: transparent;
    color: #e2e8f0;
    box-shadow: none;
}

/* ── Header ───────────────────────────────────────────────────── */
.ve-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
    flex-wrap: wrap;
}
.ve-dark .ve-header {
    border-bottom-color: rgba(255, 255, 255, 0.08);
}

.ve-header-icon {
    width: 44px;
    height: 44px;
    background: linear-gradient(135deg, #7c3aed, #3182ce);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 14px rgba(124, 58, 237, 0.35);
    color: #fff;
    flex-shrink: 0;
}

.ve-header-title {
    font-size: 1.1rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0;
}
.ve-dark .ve-header-title {
    color: #f1f5f9;
}

.ve-header-sub {
    font-size: 0.82rem;
    color: #718096;
    margin: 0;
}
.ve-dark .ve-header-sub {
    color: #94a3b8;
}

/* ── Loading ──────────────────────────────────────────────────── */
.ve-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 3rem;
    color: #718096;
}
.ve-dark .ve-loading {
    color: #64748b;
}

.ve-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #e2e8f0;
    border-top-color: #3182ce;
    border-radius: 50%;
    animation: ve-spin 0.9s linear infinite;
}
.ve-dark .ve-spinner {
    border-color: rgba(255, 255, 255, 0.08);
    border-top-color: #63b3ed;
}

@keyframes ve-spin {
    to { transform: rotate(360deg); }
}

/* ── Empty ────────────────────────────────────────────────────── */
.ve-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 3rem 1rem;
    text-align: center;
}

.ve-empty-title {
    font-size: 1rem;
    font-weight: 700;
    color: #718096;
    margin: 0;
}
.ve-dark .ve-empty-title {
    color: #94a3b8;
}

.ve-empty-sub {
    font-size: 0.85rem;
    color: #a0aec0;
    margin: 0;
}
.ve-dark .ve-empty-sub {
    color: #64748b;
}

/* ── Grid ─────────────────────────────────────────────────────── */
.ve-grid-inner {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1rem;
}

/* ── Card ─────────────────────────────────────────────────────── */
.ve-card {
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    overflow: hidden;
    transition: transform 0.2s, box-shadow 0.2s;
}
.ve-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}
.ve-dark .ve-card {
    background: rgba(255, 255, 255, 0.03);
    border-color: rgba(255, 255, 255, 0.07);
}
.ve-dark .ve-card:hover {
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

/* Preview */
.ve-card-preview {
    position: relative;
    height: 130px;
    overflow: hidden;
    cursor: pointer;
    background: #edf2f7;
    display: flex;
    align-items: center;
    justify-content: center;
}
.ve-dark .ve-card-preview {
    background: rgba(0, 0, 0, 0.2);
}

.ve-preview-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}
.ve-card:hover .ve-preview-img {
    transform: scale(1.06);
}

.ve-preview-pdf {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.25rem;
}

.ve-pdf-label {
    font-size: 0.7rem;
    font-weight: 700;
    color: #ef4444;
    letter-spacing: 1px;
}

.ve-card-overlay {
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.2s ease;
}
.ve-card:hover .ve-card-overlay {
    opacity: 1;
}

/* Card info */
.ve-card-info {
    padding: 0.6rem 0.75rem 0.4rem;
}

.ve-card-name {
    font-size: 0.78rem;
    font-weight: 600;
    color: #4a5568;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 0 0.35rem;
}
.ve-dark .ve-card-name {
    color: #cbd5e1;
}

.ve-card-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.3rem;
}

.ve-meta-chip {
    font-size: 0.68rem;
    padding: 2px 7px;
    border-radius: 20px;
    font-weight: 600;
}

.ve-meta-size {
    background: rgba(49, 130, 206, 0.1);
    color: #2b6cb0;
}
.ve-dark .ve-meta-size {
    background: rgba(99, 179, 237, 0.1);
    color: #63b3ed;
}

.ve-meta-date {
    background: #edf2f7;
    color: #718096;
}
.ve-dark .ve-meta-date {
    background: rgba(160, 174, 192, 0.08);
    color: #94a3b8;
}

/* Delete button */
.ve-card-delete {
    width: 100%;
    background: rgba(239, 68, 68, 0.05);
    border: none;
    border-top: 1px solid #fed7d7;
    color: #e53e3e;
    font-size: 0.78rem;
    font-weight: 600;
    padding: 0.5rem;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.3rem;
}
.ve-card-delete:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.12);
}
.ve-dark .ve-card-delete {
    background: rgba(239, 68, 68, 0.07);
    border-top-color: rgba(255, 255, 255, 0.05);
    color: #f87171;
}
.ve-dark .ve-card-delete:hover:not(:disabled) {
    background: rgba(239, 68, 68, 0.15);
}

.ve-card-delete--confirm {
    background: rgba(239, 68, 68, 0.18) !important;
    color: #c53030;
}
.ve-dark .ve-card-delete--confirm {
    background: rgba(239, 68, 68, 0.25) !important;
    color: #fca5a5;
}

.ve-card-delete:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.ve-card-cancel {
    width: 100%;
    background: #f7fafc;
    border: none;
    border-top: 1px solid #e2e8f0;
    color: #718096;
    font-size: 0.75rem;
    padding: 0.35rem;
    cursor: pointer;
    transition: background 0.2s;
}
.ve-card-cancel:hover {
    background: #edf2f7;
}
.ve-dark .ve-card-cancel {
    background: rgba(255, 255, 255, 0.04);
    border-top-color: rgba(255, 255, 255, 0.04);
    color: #94a3b8;
}
.ve-dark .ve-card-cancel:hover {
    background: rgba(255, 255, 255, 0.07);
}

/* ── Lightbox ─────────────────────────────────────────────────── */
.ve-lightbox {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.85);
    backdrop-filter: blur(8px);
    z-index: 99999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.ve-lightbox-inner {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.ve-lightbox-close {
    position: absolute;
    top: -2.5rem;
    right: 0;
    background: rgba(255, 255, 255, 0.1);
    border: none;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    cursor: pointer;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.2s;
}
.ve-lightbox-close:hover {
    background: rgba(255, 255, 255, 0.2);
}

.ve-lightbox-img {
    max-width: 85vw;
    max-height: 80vh;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
    object-fit: contain;
}

.ve-lightbox-pdf {
    width: 80vw;
    height: 80vh;
    border-radius: 8px;
    background: #fff;
}

.ve-lightbox-name {
    color: #94a3b8;
    font-size: 0.8rem;
    margin-top: 0.75rem;
    text-align: center;
    max-width: 80vw;
    word-break: break-all;
}

/* ── Transitions ──────────────────────────────────────────────── */
.ve-fade-enter-active,
.ve-fade-leave-active {
    transition: all 0.3s ease;
}
.ve-fade-enter {
    opacity: 0;
    transform: scale(0.9);
}
.ve-fade-leave-to {
    opacity: 0;
    transform: scale(0.85);
}

/* ── Popup subir ──────────────────────────────────────────────── */
.ve-popup-subir {
    z-index: 55000;
}
</style>
