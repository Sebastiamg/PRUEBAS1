<template>
<div class="ev-upload-wrapper" :class="{ 'ev-dark': themeMode }">

    <!-- ══ HEADER ══ -->
    <div class="ev-header">
        <div class="ev-header-icon">
            <feather-icon icon="EyeIcon" svgClasses="w-6 h-6" />
        </div>
        <div>
            <h3 class="ev-header-title">Subir Evidencia</h3>
            <p class="ev-header-sub">Pagaré: <strong>{{ pgc_codigo }}</strong></p>
        </div>
    </div>

    <!-- ══ ZONA DRAG & DROP ══ -->
    <div class="ev-dropzone" :class="{ 'ev-dropzone--active': isDragging, 'ev-dropzone--error': errorTamano }" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="onDrop" @click="$refs.fileInput.click()">
        <input ref="fileInput" type="file" multiple :accept="tiposAceptados" style="display:none;" @change="onFilesSelected" />
        <div class="ev-dropzone-inner">
            <div class="ev-dropzone-icon" :class="{ 'ev-dropzone-icon--active': isDragging }">
                <feather-icon icon="UploadCloudIcon" svgClasses="w-12 h-12" />
            </div>
            <p class="ev-dropzone-text">
                <span v-if="!isDragging">Arrastra tus archivos aquí o <strong>haz clic para seleccionar</strong></span>
                <span v-else>Suelta los archivos aquí...</span>
            </p>
            <p class="ev-dropzone-hint">PDF, JPG, JPEG, PNG, GIF, BMP, WEBP &nbsp;•&nbsp; Máx. 5 MB en total</p>
        </div>
    </div>

    <!-- ══ LISTA DE ARCHIVOS SELECCIONADOS ══ -->
    <transition-group name="ev-list" tag="div" class="ev-file-list" v-if="archivosSeleccionados.length">
        <div v-for="(f, idx) in archivosSeleccionados" :key="f.uid" class="ev-file-card" :class="{ 'ev-file-card--img': f.esImagen }">
            <!-- Preview / Icono -->
            <div class="ev-file-thumb">
                <img v-if="f.esImagen && f.preview" :src="f.preview" alt="preview" class="ev-thumb-img" />
                <div v-else class="ev-thumb-pdf">
                    <feather-icon icon="FileTextIcon" svgClasses="w-8 h-8" style="color:#e24d4d;" />
                </div>
            </div>

            <!-- Info -->
            <div class="ev-file-info">
                <p class="ev-file-name" :title="f.file.name">{{ f.file.name }}</p>
                <p class="ev-file-size">{{ formatBytes(f.file.size) }}</p>
            </div>

            <!-- Eliminar de la cola -->
            <button class="ev-file-remove" @click.stop="removeFile(idx)" title="Quitar">
                <feather-icon icon="XIcon" svgClasses="w-4 h-4" />
            </button>
        </div>
    </transition-group>

    <!-- ══ CONTADOR DE TAMAÑO TOTAL ══ -->
    <div class="ev-size-bar" v-if="archivosSeleccionados.length || localTamanioExistenteMegas > 0">
        <div class="ev-size-labels">
            <span>{{ localTamanioExistenteMegas > 0 ? 'Total (Existente + Selección):' : 'Total seleccionado:' }}</span>
            <span :class="errorTamano ? 'ev-size-over' : 'ev-size-ok'">
                {{ formatBytes(totalBytes) }} / 5.00 MB
            </span>
        </div>
        <div class="ev-size-track">
            <div class="ev-size-fill" :class="errorTamano ? 'ev-size-fill--over' : 'ev-size-fill--ok'" :style="{ width: Math.min(100, porcentajeTamano) + '%' }"></div>
        </div>
        <p v-if="errorTamano" class="ev-size-msg-error">
            ⚠ La suma de archivos supera los 5 MB. Elimina alguno para continuar.
        </p>
    </div>

    <!-- ══ BOTONES ══ -->
    <div class="ev-actions">
        <vs-button color="danger" type="flat" icon-pack="feather" icon="icon-x" @click="getCancelar">Cancelar</vs-button>

        <vs-button color="#3182ce" type="filled" icon-pack="feather" icon="icon-upload-cloud" :disabled="!puedeSubir || subiendo" @click="subirEvidencias">
            {{ subiendo ? 'Subiendo...' : 'Subir Evidencia' }}
        </vs-button>
    </div>

    <!-- ══ OVERLAY DE PROGRESO ══ -->
    <div v-if="subiendo" class="ev-overlay">
        <div class="ev-overlay-card">
            <div class="ev-overlay-spinner"></div>
            <p class="ev-overlay-text">Subiendo archivos... {{ uploadPct }}%</p>
            <div class="ev-overlay-track">
                <div class="ev-overlay-fill" :style="{ width: uploadPct + '%' }"></div>
            </div>
            <p class="ev-overlay-hint">No cierre esta pestaña hasta que termine.</p>
        </div>
    </div>

</div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'subir_evidencia_gestionpagare',

    props: {
        pgc_id: {
            type: [Number, String],
            default: null
        },
        pgc_codigo: {
            type: String,
            default: ''
        },
        tamanioExistenteMegas: {
            type: Number,
            default: 0
        },
    },

    data() {
        return {
            archivosSeleccionados: [],
            isDragging: false,
            subiendo: false,
            uploadPct: 0,
            tiposAceptados: 'image/jpeg,image/jpg,image/png,image/gif,image/bmp,image/webp,image/svg+xml,application/pdf,.pdf,.jpg,.jpeg,.png,.gif,.bmp,.webp,.svg',
            extensionesPermitidas: ['pdf', 'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'],
            MAX_BYTES: 5 * 1024 * 1024, // 5 MB
            localTamanioExistenteMegas: 0,
        };
    },

    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        totalBytesSeleccionados() {
            return this.archivosSeleccionados.reduce((sum, f) => sum + f.file.size, 0);
        },
        tamanioExistenteBytes() {
            return Math.round(this.localTamanioExistenteMegas * 1024 * 1024);
        },
        totalBytes() {
            return this.totalBytesSeleccionados + this.tamanioExistenteBytes;
        },
        porcentajeTamano() {
            return (this.totalBytes / this.MAX_BYTES) * 100;
        },
        errorTamano() {
            return this.totalBytes > this.MAX_BYTES;
        },
        puedeSubir() {
            return this.archivosSeleccionados.length > 0 && !this.errorTamano;
        },
    },

    mounted() {
        if (this.tamanioExistenteMegas) {
            this.localTamanioExistenteMegas = this.tamanioExistenteMegas;
        } else if (this.pgc_id) {
            this.cargarTamanioExistente();
        }
    },

    methods: {
        cargarTamanioExistente() {
            let me = this;
            me.$http.get(
                me.$server_url + `VerifcarMetodosGet_Pagare_Pedido?action=Get_Evidencias_xPagare&pgc_id=${me.pgc_id}`
            ).then(res => {
                const evidencias = res.data || [];
                const totalMegas = evidencias.reduce((sum, ev) => sum + parseFloat(ev.egf_tamano || 0), 0);
                me.localTamanioExistenteMegas = totalMegas;
            }).catch(err => {
                console.error('Error al cargar tamaño de evidencias existentes:', err);
            });
        },

        // ── Drag & drop ──────────────────────────────────────────────
        onDrop(e) {
            this.isDragging = false;
            const files = Array.from(e.dataTransfer.files);
            this.agregarArchivos(files);
        },

        onFilesSelected(e) {
            const files = Array.from(e.target.files);
            this.agregarArchivos(files);
            e.target.value = '';
        },

        agregarArchivos(files) {
            files.forEach(file => {
                const ext = file.name.split('.').pop().toLowerCase();
                if (!this.extensionesPermitidas.includes(ext)) {
                    this.$vs.notify({
                        title: 'Tipo no permitido',
                        text: `"${file.name}" no es un tipo de archivo válido.`,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 5000,
                    });
                    return;
                }
                // Evitar duplicados (mismo nombre + tamaño)
                const existe = this.archivosSeleccionados.some(f => f.file.name === file.name && f.file.size === file.size);
                if (existe) return;

                const esImagen = file.type.startsWith('image/');
                const uid = Date.now() + '_' + Math.random();
                const entry = {
                    uid,
                    file,
                    esImagen,
                    preview: null
                };

                if (esImagen) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        entry.preview = e.target.result;
                    };
                    reader.readAsDataURL(file);
                }

                this.archivosSeleccionados.push(entry);
            });
        },

        removeFile(idx) {
            this.archivosSeleccionados.splice(idx, 1);
        },

        // ── Subida ───────────────────────────────────────────────────
        async subirEvidencias() {
            let me = this;
            if (!me.puedeSubir || me.subiendo) return;

            me.subiendo = true;
            me.uploadPct = 0;

            try {
                // 1) Enviar archivos al files project para guardar físicamente y obtener nombres definitivos
                const formData = new FormData();
                me.archivosSeleccionados.forEach(f => {
                    formData.append('archivos[]', f.file);
                });

                const resFiles = await axios.post(
                    me.$data_url + 'api/guardarArchivosPagare',
                    formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        },
                        onUploadProgress: (evt) => {
                            if (evt.total) {
                                me.uploadPct = Math.round((evt.loaded * 100) / evt.total);
                            }
                        },
                    }
                );

                if (!resFiles.data || resFiles.data.status !== 1) {
                    throw new Error((resFiles.data && resFiles.data.message) || 'Error al guardar los archivos en el servidor de files.');
                }

                const archivosDefinitivos = resFiles.data.archivos; // [{egf_archivo, egf_url, egf_tamano}]

                // 2) Guardar registros en la BD del backend + actualizar pgc_estado
                const usuarioJSON = localStorage.getItem('usuario');
                const usuarioObj = JSON.parse(usuarioJSON || '{}');
                const idusuario = usuarioObj.idusuario || null;

                const resServer = await me.$http.post(
                    me.$server_url + 'VerifcarMetodosPost_Pagare_Pedido', {
                        action: 'Post_Subir_Evidencia_Pagare',
                        pgc_id: me.pgc_id,
                        idusuario: idusuario,
                        archivos: archivosDefinitivos,
                    }
                );

                if (resServer.data.status !== 1) {
                    throw new Error(resServer.data.message || 'Error al registrar las evidencias.');
                }

                // me.$vs.notify({
                //   title: '¡Evidencias subidas!',
                //   text: 'Los archivos de evidencia se guardaron correctamente.',
                //   color: 'success', iconPack: 'feather', icon: 'icon-check', time: 5000,
                // });

                me.$emit('change', {
                    verificacionemit: 1
                });

            } catch (err) {
                console.error('Error al subir evidencias:', err);
                me.$vs.notify({
                    title: 'Error al subir',
                    text: err.message || 'No se pudieron subir los archivos.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x',
                    time: 7000,
                });
            } finally {
                me.subiendo = false;
            }
        },

        getCancelar() {
            this.$emit('change', {
                verificacionemit: 2
            });
        },

        // ── Helpers ──────────────────────────────────────────────────
        formatBytes(bytes) {
            if (bytes < 1024) return bytes + ' B';
            if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
            return (bytes / 1048576).toFixed(2) + ' MB';
        },
    },
};
</script>

<style scoped>
/* ── Wrapper ──────────────────────────────────────────────────── */
.ev-upload-wrapper {
    position: relative;
    padding: 1.5rem;
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    color: #2d3748;
    min-height: 300px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

/* Dark mode wrapper */
.ev-upload-wrapper.ev-dark {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    border-color: transparent;
    color: #e2e8f0;
    box-shadow: none;
}

/* ── Header ───────────────────────────────────────────────────── */
.ev-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #e2e8f0;
}
.ev-dark .ev-header {
    border-bottom-color: rgba(255, 255, 255, 0.08);
}

.ev-header-icon {
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #3182ce, #7c3aed);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    box-shadow: 0 4px 14px rgba(49, 130, 206, 0.4);
}

.ev-header-title {
    font-size: 1.2rem;
    font-weight: 700;
    color: #2d3748;
    margin: 0;
}
.ev-dark .ev-header-title {
    color: #f1f5f9;
}

.ev-header-sub {
    font-size: 0.85rem;
    color: #718096;
    margin: 0;
}
.ev-dark .ev-header-sub {
    color: #94a3b8;
}

/* ── Dropzone ─────────────────────────────────────────────────── */
.ev-dropzone {
    border: 2px dashed #bee3f8;
    border-radius: 14px;
    padding: 2.5rem 1.5rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.25s ease;
    background: #f0f9ff;
}
.ev-dark .ev-dropzone {
    border-color: rgba(99, 179, 237, 0.35);
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(6px);
}

.ev-dropzone:hover,
.ev-dropzone--active {
    border-color: #3182ce;
    background: #ebf8ff;
    box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.12);
}
.ev-dark .ev-dropzone:hover,
.ev-dark .ev-dropzone--active {
    border-color: #63b3ed;
    background: rgba(49, 130, 206, 0.07);
}

.ev-dropzone--error {
    border-color: #fc8181;
    background: #fff5f5;
}
.ev-dark .ev-dropzone--error {
    background: rgba(252, 129, 129, 0.06);
}

.ev-dropzone-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
}

.ev-dropzone-icon {
    color: #3182ce;
    transition: transform 0.3s ease;
}
.ev-dark .ev-dropzone-icon {
    color: #63b3ed;
}

.ev-dropzone-icon--active {
    transform: translateY(-4px) scale(1.1);
}

.ev-dropzone-text {
    color: #4a5568;
    font-size: 0.95rem;
    margin: 0;
}
.ev-dark .ev-dropzone-text {
    color: #cbd5e1;
}

.ev-dropzone-text strong {
    color: #2b6cb0;
}
.ev-dark .ev-dropzone-text strong {
    color: #90cdf4;
}

.ev-dropzone-hint {
    color: #a0aec0;
    font-size: 0.78rem;
    margin: 0;
}
.ev-dark .ev-dropzone-hint {
    color: #64748b;
}

/* ── File list ────────────────────────────────────────────────── */
.ev-file-list {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    margin-top: 1rem;
}

.ev-file-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: #f7fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 0.6rem 0.85rem;
    transition: background 0.2s;
}
.ev-file-card:hover {
    background: #edf2f7;
}
.ev-dark .ev-file-card {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.07);
}
.ev-dark .ev-file-card:hover {
    background: rgba(255, 255, 255, 0.07);
}

.ev-file-thumb {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 8px;
    overflow: hidden;
    background: #e2e8f0;
    display: flex;
    align-items: center;
    justify-content: center;
}
.ev-dark .ev-file-thumb {
    background: rgba(255, 255, 255, 0.05);
}

.ev-thumb-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.ev-thumb-pdf {
    display: flex;
    align-items: center;
    justify-content: center;
}

.ev-file-info {
    flex: 1;
    min-width: 0;
}

.ev-file-name {
    font-size: 0.85rem;
    font-weight: 600;
    color: #2d3748;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0;
}
.ev-dark .ev-file-name {
    color: #e2e8f0;
}

.ev-file-size {
    font-size: 0.75rem;
    color: #718096;
    margin: 0;
}
.ev-dark .ev-file-size {
    color: #64748b;
}

.ev-file-remove {
    flex-shrink: 0;
    background: none;
    border: none;
    cursor: pointer;
    color: #e53e3e;
    padding: 4px;
    border-radius: 6px;
    transition: background 0.2s;
}
.ev-file-remove:hover {
    background: rgba(229, 62, 62, 0.1);
}
.ev-dark .ev-file-remove {
    color: #f87171;
}
.ev-dark .ev-file-remove:hover {
    background: rgba(248, 113, 113, 0.15);
}

/* ── Size bar ─────────────────────────────────────────────────── */
.ev-size-bar {
    margin-top: 1rem;
}

.ev-size-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.82rem;
    color: #718096;
    margin-bottom: 0.4rem;
}
.ev-dark .ev-size-labels {
    color: #94a3b8;
}

.ev-size-ok {
    color: #276749;
    font-weight: 700;
}
.ev-dark .ev-size-ok {
    color: #68d391;
}

.ev-size-over {
    color: #c53030;
    font-weight: 700;
}
.ev-dark .ev-size-over {
    color: #fc8181;
}

.ev-size-track {
    height: 6px;
    background: #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
}
.ev-dark .ev-size-track {
    background: rgba(255, 255, 255, 0.07);
}

.ev-size-fill {
    height: 100%;
    border-radius: 10px;
    transition: width 0.3s ease;
}

.ev-size-fill--ok {
    background: linear-gradient(90deg, #276749, #38a169);
}

.ev-size-fill--over {
    background: linear-gradient(90deg, #c53030, #fc8181);
}

.ev-size-msg-error {
    color: #c53030;
    font-size: 0.8rem;
    margin-top: 0.4rem;
}
.ev-dark .ev-size-msg-error {
    color: #fc8181;
}

/* ── Actions ──────────────────────────────────────────────────── */
.ev-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
}

/* ── Overlay ──────────────────────────────────────────────────── */
.ev-overlay {
    position: absolute;
    inset: 0;
    background: rgba(255, 255, 255, 0.88);
    backdrop-filter: blur(6px);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
}
.ev-dark .ev-overlay {
    background: rgba(15, 23, 42, 0.88);
}

.ev-overlay-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 14px;
    padding: 2rem 2.5rem;
    text-align: center;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
}
.ev-dark .ev-overlay-card {
    background: rgba(30, 41, 59, 0.95);
    border-color: rgba(99, 179, 237, 0.2);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);
}

.ev-overlay-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid #e2e8f0;
    border-top-color: #3182ce;
    border-radius: 50%;
    animation: ev-spin 0.9s linear infinite;
    margin: 0 auto 1rem;
}
.ev-dark .ev-overlay-spinner {
    border-color: rgba(255, 255, 255, 0.1);
    border-top-color: #63b3ed;
}

@keyframes ev-spin {
    to { transform: rotate(360deg); }
}

.ev-overlay-text {
    color: #2d3748;
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
}
.ev-dark .ev-overlay-text {
    color: #e2e8f0;
}

.ev-overlay-track {
    height: 6px;
    background: #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
    width: 200px;
    margin: 0 auto 0.75rem;
}
.ev-dark .ev-overlay-track {
    background: rgba(255, 255, 255, 0.07);
}

.ev-overlay-fill {
    height: 100%;
    background: linear-gradient(90deg, #3182ce, #63b3ed);
    border-radius: 10px;
    transition: width 0.3s ease;
}

.ev-overlay-hint {
    color: #718096;
    font-size: 0.78rem;
}
.ev-dark .ev-overlay-hint {
    color: #64748b;
}

/* ── List transitions ─────────────────────────────────────────── */
.ev-list-enter-active,
.ev-list-leave-active {
    transition: all 0.3s ease;
}

.ev-list-enter {
    opacity: 0;
    transform: translateY(-8px);
}

.ev-list-leave-to {
    opacity: 0;
    transform: translateX(20px);
}
</style>
