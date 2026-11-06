<template>
<vx-card fixed-height="true" class="memo-card">

    <!-- ══ SELECCIÓN DE DEPARTAMENTO (solo creación) ══ -->
    <div v-if="verificarcrear_actualizar === 'create'">
        <div class="section-header">
            <span class="section-icon">🏢</span>
            <span>Departamento</span>
        </div>
        <div class="form-row">
            <div class="form-col half">
                <label class="field-label">Departamento emisor <span class="req">*</span></label>
                <v-select v-model="departamentoSeleccionado" :options="departamentos" :reduce="d => d"
                    label="label" placeholder="-- Seleccione departamento --"
                    class="w-full mt-1 pv-vselect" @input="onDepartamentoChange" />
            </div>
            <!-- <div class="form-col half" v-if="previewNumeroMemo">
                <label class="field-label">Número de Memorando (preview)</label>
                <div class="numero-memo-preview">
                    <span class="numero-memo-badge">{{ previewNumeroMemo }}</span>
                    <small class="numero-memo-hint">Se confirmará al guardar</small>
                </div>
            </div> -->
        </div>
    </div>

    <!-- ══ N° MEMO en edición (solo lectura) ══ -->
    <!-- <div v-if="verificarcrear_actualizar === 'update'" class="numero-memo-edit-bar">
        <span class="numero-memo-label">N° MEMORANDO:</span>
        <span class="numero-memo-value">{{ nuevoarray.tme_numero_memo }}</span>
    </div> -->

    <!-- ══ EDITOR DE CONTENIDO ══ -->
    <div v-if="mostrarFormulario">

        <!-- INFO BANNER EDITABILIDAD -->
        <div class="info-banners" style="margin-bottom: 20px; margin-top: 24px;">
            <div class="info-banner info">
                <span class="info-banner-icon">ℹ️</span>
                <div>
                    <strong>PERSONALIZACIÓN:</strong> El modelo cargado es una referencia. Usted puede <b>editar, borrar o añadir</b> cualquier información según el propósito de su memorando.
                </div>
            </div>
        </div>

        <div class="section-header">
            <span class="section-icon">📄</span>
            <span>Contenido del Memorando</span>
        </div>

        <div style="margin-bottom: 20px;">
            <ckeditor
                v-model="nuevoarray.tmd_formatolibre"
                :config="ckEditorConfig"
                @ready="onCkReady"
            ></ckeditor>
        </div>

        <!-- ══ ACCIONES ══ -->
        <div class="actions-bar">
            <button class="btn-guardar" @click="guardar()">
                <svg viewBox="0 0 20 20" fill="currentColor" style="width:18px;height:18px">
                    <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293z" />
                </svg>
                Guardar
            </button>
            <button class="btn-cancelar" @click="getCancelar()">
                <svg viewBox="0 0 20 20" fill="currentColor" style="width:18px;height:18px">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
                Cancelar
            </button>
        </div>
    </div>

    <!-- ══ ESTADO DE ESPERA (creación sin departamento) ══ -->
    <div v-else-if="verificarcrear_actualizar === 'create'" class="waiting-selection-card">
        <div class="waiting-icon-wrapper">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                stroke-linecap="round" stroke-linejoin="round" class="waiting-svg">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="16" x2="12" y2="12"></line>
                <line x1="12" y1="8" x2="12.01" y2="8"></line>
            </svg>
        </div>
        <h3 class="waiting-title">Seleccione un departamento</h3>
        <p class="waiting-text">
            Primero seleccione el <b>departamento emisor</b> para continuar con el registro del memorando.
            El número se generará automáticamente al guardar.
        </p>
        <button class="btn-cancelar" style="margin-top:8px" @click="getCancelar()">
            <svg viewBox="0 0 20 20" fill="currentColor" style="width:18px;height:18px">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            Cancelar
        </button>
    </div>

</vx-card>
</template>

<script>
import { mapState } from 'vuex'
import vSelect from 'vue-select'
import CKEditor from 'ckeditor4-vue'

export default {
    components: {
        'v-select': vSelect,
        ckeditor: CKEditor.component,
    },
    props: {
        verificarcrear_actualizar: { type: String, default: '' },
        tab_Memo: { type: Object, default: () => ({}) }
    },
    data() {
        return {
            departamentos: [],
            departamentoSeleccionado: null,
            previewNumeroMemo: '',
            nuevoarray: {
                tme_id: 0,
                tme_numero_memo: '',
                tmd_formatolibre: '',
                created_by: '',
                updated_by: '',
            },
            ckEditorConfig: {
                toolbar: [
                    { name: 'document',    items: ['Source', '-', 'NewPage', 'Preview', 'Print', '-', 'Templates'] },
                    { name: 'clipboard',   items: ['Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord', '-', 'Undo', 'Redo'] },
                    { name: 'editing',     items: ['Find', 'Replace', '-', 'SelectAll', '-', 'Scayt'] },
                    '/',
                    { name: 'basicstyles', items: ['Bold', 'Italic', 'Underline', 'Strike', 'Subscript', 'Superscript', '-', 'CopyFormatting', 'RemoveFormat'] },
                    { name: 'paragraph',   items: ['NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote', 'CreateDiv', '-', 'JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock', '-', 'BidiLtr', 'BidiRtl', 'Language'] },
                    { name: 'links',       items: ['Link', 'Unlink', 'Anchor'] },
                    { name: 'insert',      items: ['Image', 'Flash', 'Table', 'HorizontalRule', 'Smiley', 'SpecialChar', 'PageBreak', 'Iframe'] },
                    '/',
                    { name: 'styles',      items: ['Styles', 'Format', 'Font', 'FontSize'] },
                    { name: 'colors',      items: ['TextColor', 'BGColor'] },
                    { name: 'tools',       items: ['Maximize', 'ShowBlocks'] },
                    { name: 'about',       items: ['About'] },
                ],
                height: 500,
                removePlugins: 'elementspath',
                resize_enabled: true,
                language: 'es',
                versionCheck: false,
                extraPlugins: 'justify,font,colorbutton,colordialog,find,flash,iframe,pagebreak,showblocks,smiley,specialchar,templates,bidi,copyformatting',
            },
        }
    },
    computed: {
        ...mapState(['auth', 'userRoot', 'susuario']),
        mostrarFormulario() {
            if (this.verificarcrear_actualizar === 'update') return true
            return !!this.departamentoSeleccionado
        },
    },
    watch: {
        // En edición, el contenido llega async (getContenido). Si CKEditor ya está
        // montado cuando llega, hay que forzar setData manualmente.
        'nuevoarray.tmd_formatolibre'(newVal) {
            if (this._ckEditorInstance && newVal) {
                const current = this._ckEditorInstance.getData()
                if (current !== newVal) {
                    this._ckEditorInstance.setData(newVal)
                }
            }
        }
    },
    mounted() {
        let user = {};
        try {
            const userPlatform = JSON.parse(localStorage.getItem('usuario'));
            const userProlipa = JSON.parse(localStorage.getItem('userProlipa'));
            let currentPath = this.$route.path;
            if (currentPath.includes('/reportes_talento_humano')) {
                user = userPlatform || {};
            } else if (currentPath.includes('/talento-humano/reportes')) {
                user = userProlipa || {};
            } else {
                user = userPlatform || userProlipa || {};
            }
        } catch (error) {}

        // ── Fix z-index de diálogos de CKEditor 4 para que aparezcan
        //    por encima de los popups fullscreen de Vuesax ──────────────
        //    (manejado globalmente en ckeditor-zindex-fix.css + onCkReady)

        this.getDepartamentosActivos()

        if (this.verificarcrear_actualizar === 'create') {
            this.nuevoarray.created_by = user.idusuario
            this.nuevoarray.updated_by = user.idusuario
        } else if (this.verificarcrear_actualizar === 'update') {
            const t = this.tab_Memo
            this.nuevoarray.tme_id          = t.tme_id
            this.nuevoarray.tme_numero_memo = t.tme_numero_memo || ''
            this.nuevoarray.updated_by      = user.idusuario
            this.getContenido()
        }
    },
    methods: {
        // ── API ──────────────────────────────────────────────
        onCkReady(editor) {
            // Guardar referencia para poder hacer setData desde el watcher
            this._ckEditorInstance = editor
            // Forzar el contenido en el editor una vez que está listo,
            // por si el v-model se asignó antes de que CKEditor terminara de inicializar
            if (this.nuevoarray.tmd_formatolibre) {
                editor.setData(this.nuevoarray.tmd_formatolibre)
            }
        },
        getDepartamentosActivos() {
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Memo?action=Get_DepartamentosActivos')
                .then(res => { this.departamentos = res.data })
                .catch(err => console.log(err))
        },
        getContenido() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url + 'VerifcarMetodosGet_Memo?action=Get_DetalleMemo&tme_id=' + me.nuevoarray.tme_id)
                .then(res => {
                    if (res.data && res.data.length > 0) {
                        me.nuevoarray.tmd_formatolibre = res.data[0].tmd_formatolibre || ''
                    }
                    me.$vs.loading.close()
                })
                .catch(err => {
                    console.log(err)
                    me.$vs.loading.close()
                })
        },
        // ── Handlers ─────────────────────────────────────────
        onDepartamentoChange(dpto) {
            if (!dpto) {
                this.previewNumeroMemo = ''
                this.nuevoarray.tmd_formatolibre = ''
                return
            }
            const anio = new Date().getFullYear()
            const sec  = String((dpto.tdp_secuencial_memo || 0) + 1).padStart(3, '0')
            this.previewNumeroMemo = `GC-PL-${dpto.tdp_iniciales}-${anio}-${sec}`
            // Cargar plantilla por defecto
            this.nuevoarray.tmd_formatolibre = this.getPlantillaDefault(dpto.label)
        },
        getPlantillaDefault(nombreDepartamento) {
            const meses = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
            const hoy = new Date();
            const fechaActual = `Quito, ${hoy.getDate()} de ${meses[hoy.getMonth()]} de ${hoy.getFullYear()}`;

            // Periodo del mes de horas suplementarias/extraordinarias: siempre del 23 al 22 del mes siguiente.
            // Se calcula en base al ciclo vigente según la fecha actual.
            const inicioPeriodo = new Date(hoy.getFullYear(), hoy.getMonth() - (hoy.getDate() < 23 ? 1 : 0), 23);
            const finPeriodo = new Date(inicioPeriodo.getFullYear(), inicioPeriodo.getMonth() + 1, 22);
            const textoPeriodo = `el periodo comprendido entre el <strong>23 de ${meses[inicioPeriodo.getMonth()]} de ${inicioPeriodo.getFullYear()}</strong> y el <strong>22 de ${meses[finPeriodo.getMonth()]} de ${finPeriodo.getFullYear()}</strong>`;

            return `
<p>Memorando Nro.- GC-PL-<span style="text-align:justify">
  <span style="background-color:#ffff33">JB</span></span>-2026-
</p>
<p style="font-size:12px; margin-bottom:15px;">
  ${fechaActual}
</p>

<p style="font-size:12px; line-height:1.8;">
  Ingeniero<br />
  <strong>Miguel Calder&oacute;n</strong><br />
  <strong>APODERADO GENERAL</strong><br />
  <strong>GRUPOCALMED CIA. LTDA.</strong><br />
  Presente.-
</p>

<p><strong>ASUNTO:</strong>&nbsp;<span style="font-size:11.0pt"><span style="font-family:&quot;Calibri&quot;,sans-serif">
  Solicitud de Autorizaci&oacute;n de Horas Suplementarias y Extraordinarias</span></span>
</p>

<p style="font-size:12px; text-align:justify; line-height:1.8;">
  De mi consideraci&oacute;n:<br /><br />
  Yo, <strong>[Nombre del Jefe]</strong>, en calidad de Jefe de <strong>${nombreDepartamento}</strong> (departamento) de la empresa,
  respetuosamente me dirijo a usted con el fin de de solicitar su autorización para que el equipo de trabajo de dicho departamento realice
  horas suplementarias y extraordinarias durante ${textoPeriodo}, en virtud de la necesidad de atender actividades
  específicas relacionadas con la operatividad del área.
</p>

<p style="text-align:justify"><strong>Fundamentaci&oacute;n:</strong><br />
<span style="background-color:#ffff33">La realizaci&oacute;n de horas suplementarias y extraordinarias
    es necesaria debido a aumentos en las entregas, inventarios y requerimientos urgentes que requieren
    atenci&oacute;n inmediata para cumplir con los plazos establecidos y garantizar la continuidad operativa.
</span>
</p>

<p style="text-align:justify"><strong><span style="font-size:11.0pt"><span style="font-family:&quot;Calibri&quot;,sans-serif">
  Detalle del personal y horas solicitadas:</span></span></strong>
</p>

<table align="center" border="1" cellpadding="4" cellspacing="0" style="width:100%">
  <thead>
    <tr>
      <th style="background-color:#f0f0f0; text-align:center; width:40px">ITEM</th>
      <th style="background-color:#f0f0f0; text-align:center">NOMBRES Y APELLIDOS</th>
      <th style="background-color:#f0f0f0; text-align:center; width:25%">CARGO</th>
      <th style="background-color:#f0f0f0; text-align:center; width:120px">HORAS SUPLEMENTARIAS</th>
      <th style="background-color:#f0f0f0; text-align:center; width:120px">HORAS EXTRAORDINARIAS</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="text-align:center"><strong>1</strong></td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td style="text-align:center">&nbsp;</td>
      <td style="text-align:center">&nbsp;</td>
    </tr>
    <tr>
      <td style="text-align:center"><strong>2</strong></td>
      <td>&nbsp;</td>
      <td>&nbsp;</td>
      <td style="text-align:center">&nbsp;</td>
      <td style="text-align:center">&nbsp;</td>
    </tr>
    <tr>
      <td colspan="3" style="font-weight:bold; text-align:right">TOTAL:</td>
      <td style="text-align:center">&nbsp;</td>
      <td style="text-align:center">&nbsp;</td>
    </tr>
  </tbody>
</table>

<p style="text-align:justify"><strong><span style="font-size:11.0pt"><span style="font-family:&quot;Calibri&quot;,sans-serif">
  Total de horas solicitadas:</span></span></strong>
</p>

<p style="text-align:justify"><span style="font-size:11.0pt"><span style="font-family:&quot;Calibri&quot;,sans-serif">- Horas suplementarias: <span style="background-color:yellow">cantidad total</span></span></span></p>

<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif">
  - Horas extraordinarias: <span style="background-color:yellow">cantidad total</span></span></span>
</p>

<p style="text-align:justify"><span style="font-size:11.0pt"><span style="font-family:&quot;Calibri&quot;,sans-serif">
  Solicito su autorizaci&oacute;n para proceder con la organizaci&oacute;n y cumplimiento del trabajo adicional, garantizando el pago
  de las horas suplementarias y extraordinarias, conforme a la legislaci&oacute;n laboral vigente y a las pol&iacute;ticas internas de la empresa.</span></span>
</p>

<p style="text-align:justify"><span style="font-size:11.0pt"><span style="font-family:&quot;Calibri&quot;,sans-serif">
  Para constancia, el presente memorando es suscrito de manera conjunta por el Jefe Departamental y por todos los colaboradores
  que realizar&aacute;n horas suplementarias y extraordinarias, quienes expresamente solicitan su autorizaci&oacute;n para la ejecuci&oacute;n de las mismas durante el per&iacute;odo se&ntilde;alado.</span></span>
</p>

<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif">
  Agradecemos su atenci&oacute;n y aprobaci&oacute;n.</span></span>
</p>

<p style="text-align:justify"><span style="font-size:11pt"><span style="font-family:Calibri,sans-serif">
  Atentamente, </span></span>
</p>

<table align="center" border="1" cellpadding="4" cellspacing="1" style="width:33.33%">
	<tbody>
		<tr>
			<td style="height:75px">
			<p>&nbsp;</p>
			</td>
		</tr>
		<tr>
			<td style="text-align:center"><strong>[Nombre del Jefe]</strong></td>
		</tr>
		<tr>
			<td style="text-align:center">CARGO</td>
		</tr>
	</tbody>
</table>

<p style="font-size:11px; font-weight:bold; margin-bottom:10px; text-align:center; text-transform:uppercase">
  Firmas de Colaboradores
</p>

<table align="center" border="1" cellpadding="4" cellspacing="1" style="width:100%">
	<tbody>
		<tr>
			<td style="height:75px">
			<p>&nbsp;</p>
			</td>
			<td style="height:75px">
			<p>&nbsp;</p>
			</td>
			<td style="height:75px">&nbsp;</td>
		</tr>
		<tr>
			<td style="text-align:center"><strong>[Colaborador 1]</strong></td>
			<td style="text-align:center"><strong>[Colaborador 2]</strong></td>
			<td style="text-align:center"><strong>[Colaborador 3]</strong></td>
		</tr>
		<tr>
			<td style="text-align:center">CARGO</td>
			<td style="text-align:center">CARGO</td>
			<td style="text-align:center">CARGO</td>
		</tr>
	</tbody>
</table>`
        },
        // ── Guardar ──────────────────────────────────────────
        guardar() {
            let me = this

            if (me.verificarcrear_actualizar === 'create' && !me.departamentoSeleccionado) {
                me.$vs.notify({ text: 'Seleccione el departamento', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                return
            }
            if (!me.nuevoarray.tmd_formatolibre || me.nuevoarray.tmd_formatolibre.trim() === '') {
                me.$vs.notify({ text: 'El contenido del memorando no puede estar vacío', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                return
            }

            const datos = {
                action:           'Post_Registrar_modificar_Memo',
                tme_id:           me.verificarcrear_actualizar === 'update' ? me.nuevoarray.tme_id : null,
                tdp_id:           me.departamentoSeleccionado ? me.departamentoSeleccionado.value : null,
                tmd_formatolibre: me.nuevoarray.tmd_formatolibre,
                created_by:       me.nuevoarray.created_by,
                updated_by:       me.nuevoarray.updated_by,
            }

            me.$vs.loading()
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_Memo', datos)
                .then(res => {
                    me.$vs.loading.close()
                    if (res.data.status == 1) {
                        me.$vs.notify({ text: res.data.message, color: 'success', iconPack: 'feather', icon: 'icon-check' })
                        me.$emit('change', { verificacionemitsaveandedit: 1 })
                    } else {
                        me.$vs.notify({ text: res.data.message, color: 'danger', iconPack: 'feather', icon: 'icon-x' })
                    }
                })
                .catch(() => {
                    me.$vs.loading.close()
                    me.$vs.notify({ text: 'Error al guardar', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' })
                })
        },
        getCancelar() { this.$emit('change', { verificacionemitsaveandedit: 2 }) }
    }
}
</script>

<style scoped>
.memo-card { font-family: 'Inter', 'Segoe UI', sans-serif; color: #1e293b; }

/* ── Section header ── */
.section-header {
    display: flex; align-items: center; gap: 10px;
    font-size: 13px; font-weight: 700; letter-spacing: 0.08em;
    text-transform: uppercase; color: #64748b;
    padding: 10px 0 10px 4px;
    border-bottom: 2px solid #e2e8f0; margin-bottom: 20px;
}
.section-icon { font-size: 16px; }

/* ── Info banners ─────────────────────────────────────── */
.info-banners {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.info-banner {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 12px 16px;
    border-radius: 8px;
    font-size: 13px;
    line-height: 1.5;
    border-left: 4px solid;
}

.info-banner.info {
    background: #f0f9ff;
    border-color: #0ea5e9;
    color: #0369a1;
}

.info-banner-icon {
    font-size: 18px;
    flex-shrink: 0;
    margin-top: 2px;
}

/* ── Form layout ── */
.form-row { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 16px; }
.form-col { box-sizing: border-box; }
.form-col.half  { flex: 1 1 calc(50% - 8px); min-width: 220px; }
.field-label { display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 6px; letter-spacing: 0.03em; }
.req { color: #ef4444; }

/* ── Número memo (edición) ── */
.numero-memo-edit-bar {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 16px; background: #eff6ff;
    border: 1.5px solid #bfdbfe; border-radius: 10px; margin-bottom: 4px;
}
.numero-memo-label { font-size: 11px; font-weight: 800; color: #1d4ed8; letter-spacing: 0.06em; text-transform: uppercase; }
.numero-memo-value { font-size: 16px; font-weight: 800; color: #1e40af; }

/* ── Número memo (preview) ── */
.numero-memo-preview {
    display: flex; flex-direction: column; gap: 4px;
    padding: 10px 14px; background: #f0fdf4;
    border: 1.5px solid #bbf7d0; border-radius: 10px; margin-top: 6px;
}
.numero-memo-badge { font-size: 15px; font-weight: 800; color: #15803d; letter-spacing: 0.04em; }
.numero-memo-hint  { font-size: 10px; color: #64748b; font-style: italic; }

/* ── Actions bar ── */
.actions-bar {
    display: flex; justify-content: center; gap: 16px;
    padding: 24px 0 8px; border-top: 1.5px solid #f1f5f9; margin-top: 8px;
}
.btn-guardar {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 28px;
    background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
    color: #fff; border: none; border-radius: 10px;
    font-size: 14px; font-weight: 700; cursor: pointer;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35); transition: all 0.2s;
}
.btn-guardar:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(99,102,241,0.45); }
.btn-cancelar {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 11px 28px; background: #fff; color: #ef4444;
    border: 1.5px solid #fecaca; border-radius: 10px;
    font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s;
}
.btn-cancelar:hover { background: #fff0f0; border-color: #fca5a5; transform: translateY(-2px); }

/* ── Waiting state ── */
.waiting-selection-card {
    margin-top: 32px; padding: 48px 20px;
    background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 16px;
    text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px;
}
.waiting-icon-wrapper {
    width: 60px; height: 60px; background: #f1f5f9; border-radius: 50%;
    display: flex; align-items: center; justify-content: center; color: #94a3b8;
}
.waiting-svg { width: 34px; height: 34px; }
.waiting-title { font-size: 18px; font-weight: 700; color: #475569; margin: 0; }
.waiting-text { font-size: 14px; color: #64748b; max-width: 420px; line-height: 1.6; margin: 0; }
.waiting-text b { color: #334155; }

/* ── Select Fix ── */
::v-deep .vs__dropdown-menu {
    z-index: 999999 !important;
}
</style>

<style>
.vs__dropdown-menu {
    z-index: 1000000 !important;
}
</style>
