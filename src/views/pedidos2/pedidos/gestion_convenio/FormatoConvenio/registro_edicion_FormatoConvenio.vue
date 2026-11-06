<template>
<div class="formato-convenio-container p-4 min-h-full relative" :class="{ 'bg-gray-50': !themeMode, 'night-bg-container': themeMode }">

    <!-- TOP ACTION BAR -->
    <div class="flex justify-between items-start mb-6 border-b pb-4" :class="{ 'border-gray-200': !themeMode, 'night-border': themeMode }">
        <div class="pr-4">
            <h3 class="text-xl font-bold flex flex-wrap items-center gap-3" :class="{ 'text-gray-800': !themeMode, 'night-text': themeMode }">
                <span>{{ formato.cof_id ? 'Editando Convenio' : 'Nuevo Convenio' }}</span>
                <span v-if="formato.cof_id" class="text-primary">{{ formato.cof_nombre }}</span>
                <vs-chip v-if="verificar_creacion_edicion === 2 && formato.cof_estado == 2" color="success" class="ml-2 font-semibold">Aprobado</vs-chip>
                <vs-chip v-if="verificar_creacion_edicion === 2 && formato.cof_estado == 1" color="warning" class="ml-2 font-semibold">Pendiente de aprobación</vs-chip>
                <vs-chip v-if="verificar_creacion_edicion === 2 && formato.cof_estado == 0" color="danger" class="ml-2 font-semibold">Anulado</vs-chip>
            </h3>
            <p class="text-sm mt-1" :class="{ 'text-gray-500': !themeMode, 'text-gray-400': themeMode }">
                Complete la información y configure el contenido del formato. Al guardar quedará en estado <b>Pendiente de aprobación</b>.
            </p>
        </div>
        <div class="flex gap-2 items-center flex-wrap justify-end">
            <vs-button color="dark" type="border" icon="arrow_back" @click="cerrar">
                {{ verificar_creacion_edicion === 2 ? 'Cancelar Edición' : 'Cancelar Creación' }}
            </vs-button>
            <vx-tooltip text="Guarda el formato en estado Pendiente. Desde el listado podrás aprobarlo.">
                <vs-button color="primary" type="gradient" class="font-bold shadow-md" icon="save" @click="guardarFormato(1)">
                    {{ verificar_creacion_edicion === 2 ? 'Guardar Cambios' : 'Guardar Formato' }}
                </vs-button>
            </vx-tooltip>
        </div>
    </div>

    <vs-row class="gap-y-4">
        <!-- Form Inputs -->
        <vs-col vs-w="12">
            <vs-card class="shadow-sm rounded-lg border mb-0" :class="{ 'border-gray-100': !themeMode, 'night-bg-card night-border': themeMode }">
                <div slot="header" class="p-3 rounded-t-lg -mx-4 -mt-4 mb-2 border-b" :class="{ 'bg-white border-gray-100': !themeMode, 'night-bg-header night-border': themeMode }">
                    <h4 class="font-bold flex items-center" :class="{ 'text-gray-700': !themeMode, 'night-text': themeMode }">
                        <vs-icon icon="info" class="mr-2 text-primary"></vs-icon> Información General del Formato
                    </h4>
                </div>
                <vs-row class="mt-2">
                    <vs-col vs-w="12" vs-sm="12" vs-md="12" vs-lg="12" class="p-2">
                        <vs-input class="w-full text-lg font-medium" label="Nombre del Formato" placeholder="Ej: Formato Oficial Costa 2026" v-model="formato.cof_nombre" ref="cof_nombre" :class="classvalidar_cof_nombre" maxlength="150" />
                    </vs-col>
                    <vs-col vs-w="12" class="p-2 mt-2">
                        <vs-textarea label="Descripción" v-model="formato.cof_descripcion" height="80px" counter="500" ref="cof_descripcion" :class="classvalidar_cof_descripcion" />
                    </vs-col>
                </vs-row>
            </vs-card>
        </vs-col>

        <!-- Variables toolbar — ancho completo -->
        <vs-col vs-w="12" class="mt-4">
            <div class="toolbar-insert p-4 rounded-xl border shadow-sm" :class="{ 'bg-white border-gray-200': !themeMode, 'night-bg-toolbar night-border': themeMode }">
                <p class="text-sm font-bold mb-3 uppercase tracking-wide flex items-center gap-2" :class="{ 'text-primary': !themeMode, 'text-primary-light': themeMode }">
                    <vs-icon icon="ads_click" size="small"></vs-icon>
                    <span>Variables Dinámicas (Clic para insertar en el editor)</span>
                </p>
                <div class="flex flex-wrap gap-x-6 gap-y-3">
                    <!-- Grupo 1: Unidad Educativa -->
                    <div>
                        <span class="text-xs font-semibold block mb-2" :class="{ 'text-gray-500': !themeMode, 'text-gray-400': themeMode }">Unidad Educativa:</span>
                        <div class="flex flex-wrap gap-2">
                            <vx-tooltip text="Ej: UNIDAD EDUCATIVA PROLIPA">
                                <vs-button size="small" type="border" color="success" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@NOMBRE_UNIDAD_EDUCATIVA')">Nombre U. Educativa</vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Ej: AV. LA PRENSA N56-89">
                                <vs-button size="small" type="border" color="success" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@DIRECCION_UNIDAD_EDUCATIVA')">Dirección U. Educativa</vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Ej: 2247581">
                                <vs-button size="small" type="border" color="success" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@TELEFONO_UNIDAD_EDUCATIVA')">Teléfono U. Educativa</vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Ej: correoinstitucion@gmail.com">
                                <vs-button size="small" type="border" color="success" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@CORREO_UNIDAD_EDUCATIVA')">Correo U. Educativa</vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Ej: QUITO">
                                <vs-button size="small" type="border" color="success" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@CIUDAD_UNIDAD_EDUCATIVA')">Ciudad U. Educativa</vs-button>
                            </vx-tooltip>
                        </div>
                    </div>
                    <!-- Grupo 2: Beneficiario -->
                    <div>
                        <span class="text-xs font-semibold block mb-2" :class="{ 'text-gray-500': !themeMode, 'text-gray-400': themeMode }">Beneficiario:</span>
                        <div class="flex flex-wrap gap-2">
                            <vx-tooltip text="Ej: NOMBRE1 NOMBRE2 APELLIDO1 APELLIDO2">
                                <vs-button size="small" type="border" color="warning" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@NOMBRES_APELLIDOS_BENEFICIARIO')">Nombres y Apellidos Beneficiario</vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Ej: 9999999999">
                                <vs-button size="small" type="border" color="warning" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@CEDULA_BENEFICIARIO')">Cédula Beneficiario</vs-button>
                            </vx-tooltip>
                        </div>
                    </div>
                    <!-- Grupo 3: Períodos y Vigencia -->
                    <div>
                        <span class="text-xs font-semibold block mb-2" :class="{ 'text-gray-500': !themeMode, 'text-gray-400': themeMode }">Períodos y Vigencia:</span>
                        <div class="flex flex-wrap gap-2">
                            <vx-tooltip text="Ej: CV-1-C-S26-0000-AS">
                                <vs-button size="small" type="border" color="primary" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@NUMERO_DE_SECUENCIA')">Número de Secuencia</vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Ej: 2022-2023, 2023-2024 y 2024-2025">
                                <vs-button size="small" type="border" color="primary" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@PERIODOS_LECTIVOS')">Períodos Lectivos</vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Ej: dos (2) años lectivos">
                                <vs-button size="small" type="border" color="primary" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@ANIOS_CONVENIO_NUMERO_LETRAS')">Años Convenio (Nro. y Letras)</vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Ej: 09 días del mes de enero de 2026">
                                <vs-button size="small" type="border" color="primary" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@FECHA_ACTUAL')">Fecha Actual</vs-button>
                            </vx-tooltip>
                        </div>
                    </div>
                    <!-- Grupo 4: Tablas automáticas -->
                    <div>
                        <span class="text-xs font-semibold block mb-2" :class="{ 'text-gray-500': !themeMode, 'text-gray-400': themeMode }">Tablas Automáticas del Sistema:</span>
                        <div class="flex flex-wrap gap-2">
                            <vx-tooltip text="Inserta la tabla de componentes completa generada por el sistema">
                                <vs-button size="small" type="border" color="danger" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@TABLA_DE_COMPONENTES')">Tabla de Componentes</vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Inserta la tabla económica completa generada por el sistema">
                                <vs-button size="small" type="border" color="danger" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholderCK('@TABLA_ECONOMICA')">Tabla Económica</vs-button>
                            </vx-tooltip>
                        </div>
                    </div>
                </div>
                <!-- Separador + Transformación de texto -->
                <div class="mt-3 pt-3 border-t" :class="{ 'border-gray-200': !themeMode, 'night-border': themeMode }">
                    <p class="text-xs font-semibold mb-2 uppercase tracking-wide" :class="{ 'text-gray-500': !themeMode, 'text-gray-400': themeMode }">
                        <vs-icon icon="text_format" size="small" class="mr-1"></vs-icon>
                        Transformar texto seleccionado en el editor:
                    </p>
                    <div class="flex flex-wrap gap-2">
                        <vx-tooltip text="Ej: HOLA MUNDO → Hola Mundo (primera letra de cada palabra en mayúscula)">
                            <vs-button size="small" type="filled" color="dark" class="font-semibold" @click="aplicarTransformCK('capitalize')">Aa Capitalizar</vs-button>
                        </vx-tooltip>
                        <vx-tooltip text="Convierte el texto seleccionado a MAYÚSCULAS">
                            <vs-button size="small" type="filled" color="dark" class="font-semibold" @click="aplicarTransformCK('uppercase')">AA MAYÚSCULAS</vs-button>
                        </vx-tooltip>
                        <vx-tooltip text="Convierte el texto seleccionado a minúsculas">
                            <vs-button size="small" type="filled" color="dark" class="font-semibold" @click="aplicarTransformCK('lowercase')">aa minúsculas</vs-button>
                        </vx-tooltip>
                        <vx-tooltip text="Quita cualquier transformación aplicada">
                            <vs-button size="small" type="border" color="dark" @click="aplicarTransformCK('none')">Quitar transformación</vs-button>
                        </vx-tooltip>
                    </div>
                </div>
            </div>
        </vs-col>
        <vs-col vs-w="12" class="mt-4">
            <vs-row vs-justify="space-between" vs-type="flex" class="w-full">
                <!-- Editor Column -->
                <vs-col vs-w="12" vs-lg="6" vs-md="6" vs-sm="12" vs-xs="12" class="mb-4 pr-0 md:pr-2">
                    <vs-card class="shadow-sm rounded-lg border mb-0" :class="{ 'border-gray-100': !themeMode, 'night-bg-card night-border': themeMode }">
                        <div slot="header" class="p-3 rounded-t-lg -mx-4 -mt-4 mb-2 border-b" :class="{ 'bg-blue-50 border-blue-100': !themeMode, 'night-bg-header night-border': themeMode }">
                            <h4 class="font-bold flex items-center" :class="{ 'text-blue-800': !themeMode, 'night-text': themeMode }">
                                <vs-icon icon="edit" class="mr-2"></vs-icon> Editor del Formato
                            </h4>
                        </div>

                        <!-- CKEditor 4 + botón flotante de herramientas extra -->
                        <div class="ckeditor-wrapper" :class="classvalidar_cof_contenido" style="position:relative;">
                            <ckeditor
                                v-model="formato.cof_contenido"
                                :config="ckEditorConfig"
                                @ready="onCkReady"
                            ></ckeditor>

                            <!-- ── Botón flotante de herramientas extra ── -->
                            <div class="ck-float-menu-wrap">
                                <button
                                    class="ck-float-trigger"
                                    :class="{ 'ck-float-trigger--open': floatMenuAbierto }"
                                    @mousedown.prevent="floatMenuAbierto = !floatMenuAbierto"
                                    title="Herramientas de texto extra"
                                >
                                    <vs-icon icon="text_format" size="18px"></vs-icon>
                                </button>

                                <!-- Menú desplegable -->
                                <transition name="ck-float-fade">
                                    <div v-if="floatMenuAbierto" class="ck-float-menu" :class="{ 'ck-float-menu--dark': themeMode }">
                                        <p class="ck-float-menu__title">Transformar texto seleccionado</p>
                                        <div class="ck-float-menu__items">
                                            <button class="ck-float-item" @mousedown.prevent="aplicarTransformYCerrar('capitalize')">
                                                <span class="ck-float-item__icon">Aa</span>
                                                <span class="ck-float-item__label">Capitalizar</span>
                                                <span class="ck-float-item__hint">Hola Mundo</span>
                                            </button>
                                            <button class="ck-float-item" @mousedown.prevent="aplicarTransformYCerrar('uppercase')">
                                                <span class="ck-float-item__icon">AA</span>
                                                <span class="ck-float-item__label">MAYÚSCULAS</span>
                                                <span class="ck-float-item__hint">HOLA MUNDO</span>
                                            </button>
                                            <button class="ck-float-item" @mousedown.prevent="aplicarTransformYCerrar('lowercase')">
                                                <span class="ck-float-item__icon">aa</span>
                                                <span class="ck-float-item__label">minúsculas</span>
                                                <span class="ck-float-item__hint">hola mundo</span>
                                            </button>
                                            <div class="ck-float-menu__divider"></div>
                                            <button class="ck-float-item ck-float-item--remove" @mousedown.prevent="aplicarTransformYCerrar('none')">
                                                <vs-icon icon="format_clear" size="14px" class="ck-float-item__icon-mat"></vs-icon>
                                                <span class="ck-float-item__label">Quitar transformación</span>
                                            </button>
                                        </div>
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </vs-card>
                </vs-col>
                <!-- Preview Column -->
                <vs-col vs-w="12" vs-lg="6" vs-md="6" vs-sm="12" vs-xs="12" class="mb-4 pl-0 md:pl-2">
                    <vs-card class="shadow-sm rounded-lg border mb-0" :class="{ 'bg-gray-50 border-gray-100': !themeMode, 'night-bg-card night-border': themeMode }">
                        <div slot="header" class="p-3 rounded-t-lg -mx-4 -mt-4 mb-2 border-b" :class="{ 'bg-green-50 border-green-100': !themeMode, 'night-bg-header night-border': themeMode }">
                            <h4 class="font-bold flex items-center" :class="{ 'text-green-800': !themeMode, 'night-text': themeMode }">
                                <vs-icon icon="visibility" class="mr-2"></vs-icon> Vista Previa (Simulada)
                            </h4>
                        </div>
                        <div class="preview-document rounded-lg shadow-inner"
                             :class="{ 'bg-white border-gray-200': !themeMode, 'night-bg-preview night-border night-text': themeMode }"
                             v-html="vistaPreviaHtml">
                        </div>
                    </vs-card>
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>
</div>
</template>

<script>
import CKEditor from 'ckeditor4-vue';

// ── Helpers de transformación de texto ──────────────────────────────────────
function _ckTransformarTexto(texto, tipo) {
    if (tipo === 'uppercase') return texto.toUpperCase();
    if (tipo === 'lowercase') return texto.toLowerCase();
    if (tipo === 'capitalize') {
        return texto.toLowerCase().replace(/(?:^|\s|[-/])\S/g, function(c) { return c.toUpperCase(); });
    }
    return texto;
}

function _ckAplicarTransformAEditor(editor, tipo) {
    editor.focus();
    editor.fire('saveSnapshot');

    var selection = editor.getSelection();
    if (!selection) return;
    var ranges = selection.getRanges();
    if (!ranges || !ranges.length) return;

    for (var r = 0; r < ranges.length; r++) {
        var walker = new CKEDITOR.dom.walker(ranges[r].clone());
        walker.evaluator = function(n) { return n.type === CKEDITOR.NODE_TEXT; };
        var textNodes = [];
        var node;
        while ((node = walker.next())) { textNodes.push(node); }

        textNodes.forEach(function(textNode) {
            var texto = textNode.getText();
            if (!texto.trim()) return;

            // Limpiar spans de text-transform previos en padres
            var p = textNode.getParent();
            while (p && p.getName && p.getName() !== 'body') {
                if (p.getName() === 'span') {
                    p.removeStyle('text-transform');
                    if (!p.getAttribute('style') && !p.getAttribute('class')) {
                        p.remove(true); // desenvolver span vacío, conservar contenido
                        return; // el nodo fue reorganizado, salir de este textNode
                    }
                }
                p = p.getParent ? p.getParent() : null;
            }

            if (tipo === 'none') return; // solo limpió, no envuelve

            // Envolver el nodo de texto en un span con text-transform
            // El reporte lo procesa en sustituirVariables (paso 2) para
            // aplicar la transformación real al renderizar, incluyendo variables
            var newSpan = new CKEDITOR.dom.element('span');
            newSpan.setStyle('text-transform', tipo);
            var nodeRange = editor.createRange();
            nodeRange.setStartBefore(textNode);
            nodeRange.setEndAfter(textNode);
            nodeRange.deleteContents();
            nodeRange.insertNode(newSpan);
            newSpan.append(new CKEDITOR.dom.text(texto));
        });
    }
    editor.fire('updateSnapshot');
}

export default {
    components: {
        ckeditor: CKEditor.component,
    },
    props: {
        formatoDatos: {
            type: Object,
            default: () => null
        },
        periodoSelect: {
            type: Object,
            default: () => {}
        },
        verificar_creacion_edicion: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            classvalidar_cof_nombre: '',
            classvalidar_cof_descripcion: '',
            classvalidar_cof_contenido: '',
            floatMenuAbierto: false,
            formato: {
                cof_id: null,
                cof_nombre: '',
                cof_descripcion: '',
                cof_contenido: '',
                cof_estado: 1,
            },
            ckEditorConfig: {
                editorplaceholder: 'Escribe el texto del convenio aquí... usa los botones para insertar variables',
                toolbar: [
                    { name: 'document', items: [
                        'Source', '-', 'NewPage', 'Preview', 'Print'
                    ]},
                    { name: 'clipboard', items: [
                        'Cut', 'Copy', 'Paste', 'PasteText', 'PasteFromWord',
                        '-', 'Undo', 'Redo'
                    ]},
                    { name: 'editing', items: [
                        'Find', 'Replace', '-', 'SelectAll'
                    ]},
                    '/',
                    { name: 'basicstyles', items: [
                        'Bold', 'Italic', 'Underline', 'Strike',
                        'Subscript', 'Superscript',
                        '-', 'CopyFormatting',
                        '-', 'RemoveFormat'
                    ]},
                    { name: 'paragraph', items: [
                        'NumberedList', 'BulletedList',
                        '-', 'Outdent', 'Indent',
                        '-', 'Blockquote',
                        '-', 'JustifyLeft', 'JustifyCenter',
                        'JustifyRight', 'JustifyBlock'
                    ]},
                    { name: 'links', items: [
                        'Link', 'Unlink', 'Anchor'
                    ]},
                    { name: 'insert', items: [
                        'Table',
                        'HorizontalRule',
                        'SpecialChar',
                        'PageBreak'
                    ]},
                    '/',
                    { name: 'styles', items: [
                        'Styles',
                        'Format',
                        'Font',
                        'FontSize'
                    ]},
                    { name: 'colors', items: [
                        'TextColor',
                        'BGColor'
                    ]},
                    { name: 'tools', items: [
                        'Maximize',
                        'ShowBlocks'
                    ]}
                ],
                height: 520,
                removePlugins: 'elementspath',
                resize_enabled: true,
                language: 'es',
                versionCheck: false,
                extraPlugins: 'justify,font,colorbutton,colordialog,find,showblocks,specialchar,editorplaceholder,copyformatting',

                // ── Tamaños de fuente: lista completa con todos los intermedios ──
                // Se agrega otherOptions para permitir escribir un tamaño personalizado
                fontSize_sizes:
                    '8/8px;9/9px;10/10px;10.5/10.5px;11/11px;11.5/11.5px;12/12px;' +
                    '12.5/12.5px;13/13px;13.5/13.5px;14/14px;14.5/14.5px;15/15px;' +
                    '15.5/15.5px;16/16px;17/17px;18/18px;19/19px;20/20px;22/22px;' +
                    '24/24px;26/26px;28/28px;32/32px;36/36px;48/48px;72/72px',

                // ── Fuentes: lista completa + Cambria agregada ──
                font_names:
                    'Arial/Arial, Helvetica, sans-serif;' +
                    'Calibri/Calibri, sans-serif;' +
                    'Cambria/Cambria, Georgia, serif;' +
                    'Comic Sans MS/Comic Sans MS, cursive;' +
                    'Courier New/Courier New, Courier, monospace;' +
                    'Georgia/Georgia, serif;' +
                    'Helvetica/Helvetica, sans-serif;' +
                    'Lucida Sans Unicode/Lucida Sans Unicode, Lucida Grande, sans-serif;' +
                    'Tahoma/Tahoma, Geneva, sans-serif;' +
                    'Times New Roman/Times New Roman, Times, serif;' +
                    'Trebuchet MS/Trebuchet MS, Helvetica, sans-serif;' +
                    'Verdana/Verdana, Geneva, sans-serif;' +
                    'Aptos/Aptos, sans-serif',

                // ── Sangría: reducir el espacio por defecto de 40px a 20px ──
                indentOffset: 20,
                indentUnit: 'px',

                // ── Estilos personalizados: solo estructurales (heading, párrafo, cita)
                //    Los text-transform se manejan con botones propios en la interfaz ──
                stylesSet: [
                    { name: 'Título 1', element: 'h1' },
                    { name: 'Título 2', element: 'h2' },
                    { name: 'Título 3', element: 'h3' },
                    { name: 'Título 4', element: 'h4' },
                    { name: 'Título 5', element: 'h5' },
                    { name: 'Título 6', element: 'h6' },
                    { name: 'Párrafo',  element: 'p'  },
                    { name: 'Cita',     element: 'blockquote' },
                    { name: 'Código',   element: 'pre' },
                ],
            },
        };
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        vistaPreviaHtml() {
            var contenido = this.formato.cof_contenido || '';
            if (contenido.trim() === '') {
                return '<p style="color:#aaa; text-align:center; padding:60px 20px;">Escribe o inserta variables para ver la vista previa.</p>';
            }
            var html = contenido;

            // Tabla de componentes de ejemplo para la vista previa
            var tablaComponentesEjemplo = `<table style="width:100%;border-collapse:collapse;margin:10px 0;">
  <thead>
    <tr>
      <th style="border:1px solid #000;padding:6px;background:#f5f5f5;">Áreas</th>
      <th style="border:1px solid #000;padding:6px;background:#f5f5f5;">Inicial 1</th>
      <th style="border:1px solid #000;padding:6px;background:#f5f5f5;">Inicial 2</th>
      <th style="border:1px solid #000;padding:6px;background:#f5f5f5;">1</th>
      <th style="border:1px solid #000;padding:6px;background:#f5f5f5;">2</th>
      <th style="border:1px solid #000;padding:6px;background:#f5f5f5;">3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #000;padding:6px;"><strong>Sinapsis Matemáticas</strong></td>
      <td style="border:1px solid #000;padding:6px;text-align:center;">✓</td>
      <td style="border:1px solid #000;padding:6px;text-align:center;">✓</td>
      <td style="border:1px solid #000;padding:6px;text-align:center;">✓</td>
      <td style="border:1px solid #000;padding:6px;text-align:center;">✓</td>
      <td style="border:1px solid #000;padding:6px;text-align:center;">✓</td>
    </tr>
  </tbody>
</table>`;

            // Tabla económica de ejemplo para la vista previa
            var tablaEconomicaEjemplo = `<table style="width:100%;border-collapse:collapse;margin:10px 0;">
  <thead>
    <tr>
      <th style="border:1px solid #000;padding:6px;background:#f5f5f5;">LIBRO</th>
      <th style="border:1px solid #000;padding:6px;background:#f5f5f5;">PRECIO</th>
      <th style="border:1px solid #000;padding:6px;background:#f5f5f5;">CANTIDAD</th>
      <th style="border:1px solid #000;padding:6px;background:#f5f5f5;">SUBTOTAL</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border:1px solid #000;padding:6px;">Sinapsis Matemáticas</td>
      <td style="border:1px solid #000;padding:6px;">$26.90</td>
      <td style="border:1px solid #000;padding:6px;">3</td>
      <td style="border:1px solid #000;padding:6px;">$80.70</td>
    </tr>
    <tr>
      <td style="border:1px solid #000;padding:6px;"><strong>TOTAL</strong></td>
      <td style="border:1px solid #000;padding:6px;"></td>
      <td style="border:1px solid #000;padding:6px;"></td>
      <td style="border:1px solid #000;padding:6px;"><strong>$80.70</strong></td>
    </tr>
  </tbody>
</table>`;

            var ejemplos = {
                '@NUMERO_DE_SECUENCIA':              'CV-1-C-S26-0000-AS',
                '@NOMBRE_UNIDAD_EDUCATIVA':          'UNIDAD EDUCATIVA PROLIPA',
                '@NOMBRES_APELLIDOS_BENEFICIARIO':   'NOMBRE1 NOMBRE2 APELLIDO1 APELLIDO2',
                '@PERIODOS_LECTIVOS':                '2022-2023, 2023-2024 y 2024-2025',
                '@TABLA_DE_COMPONENTES':             tablaComponentesEjemplo,
                '@TABLA_ECONOMICA':                  tablaEconomicaEjemplo,
                '@ANIOS_CONVENIO_NUMERO_LETRAS':      'dos (2) años lectivos',
                '@DIRECCION_UNIDAD_EDUCATIVA':       'AV. LA PRENSA N56-89',
                '@TELEFONO_UNIDAD_EDUCATIVA':        '2247581',
                '@CORREO_UNIDAD_EDUCATIVA':          'correoinstitucion@gmail.com',
                '@CIUDAD_UNIDAD_EDUCATIVA':          'QUITO',
                '@FECHA_ACTUAL':                     '09 días del mes de enero de 2026',
                '@CEDULA_BENEFICIARIO':              '9999999999',
            };

            // ── En la vista previa del editor, los spans con text-transform
            //    se muestran tal cual via CSS — no se procesan aquí.
            //    El reporte (sustituirVariables) los aplana al renderizar el PDF.
            // Ordenar por longitud descendente para evitar reemplazos parciales
            var keys = Object.keys(ejemplos).sort((a, b) => b.length - a.length);
            for (var i = 0; i < keys.length; i++) {
                var valor = ejemplos[keys[i]];
                if (keys[i] === '@TABLA_DE_COMPONENTES' || keys[i] === '@TABLA_ECONOMICA') {
                    // Envolver las tablas dinámicas en un contenedor destacado con el mismo color que las otras variables
                    var wrapper = `
<div class="dynamic-table-preview" style="background-color: #ffe0b2; padding: 8px; border-radius: 4px; margin: 12px 0;">
    ${valor}
</div>`;
                    html = html.split(keys[i]).join(wrapper);
                } else {
                    html = html.split(keys[i]).join(
                        `<span style="background-color:#ffe0b2;padding:0 4px;border-radius:3px;">${valor}</span>`
                    );
                }
            }
            return `
<style>
.ck-preview { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; margin: 20px 5px; }
.ck-preview p, .ck-preview div { margin: 0 0 1em 0; }
.ck-preview ol, .ck-preview ul { margin: 0 0 1em 0; padding-left: 2.5em; }
.ck-preview ol { list-style-type: decimal !important; }
.ck-preview ul { list-style-type: disc !important; }
.ck-preview ol li, .ck-preview ul li { display: list-item !important; list-style: inherit !important; }
.ck-preview h1, .ck-preview h2, .ck-preview h3 { text-align: center; font-weight: bold; margin: 10px 0 8px; }
.ck-preview h3 { text-align: left; text-transform: uppercase; }
.ck-preview table { width: 100%; border-collapse: collapse; margin: 12px 0; background-color: #ffffff; }
.ck-preview table:not([border="0"]), .ck-preview table:not([border="0"]) th, .ck-preview table:not([border="0"]) td { border: 1px solid #000; }
.ck-preview table[border="0"], .ck-preview table[border="0"] th, .ck-preview table[border="0"] td { border: none !important; }
.ck-preview th, .ck-preview td { padding: 6px; text-align: left; }
</style><div class="ck-preview">${html}</div>`;
        }
    },
    mounted() {
        this.cargarDatos();
    },
    methods: {
        // Guarda la instancia de CKEditor al estar lista y carga el contenido
        onCkReady(editor) {
            this._ckEditorInstance = editor;
            if (this.formato.cof_contenido) {
                editor.setData(this.formato.cof_contenido);
            }

            // ── Fix font: limpiar font-family en <span> anidados antes de aplicar nueva fuente ──
            editor.on('beforeCommandExec', function (evt) {
                if (evt.data.name !== 'font') return;
                var selection = editor.getSelection();
                if (!selection) return;
                var ranges = selection.getRanges();
                if (!ranges || !ranges.length) return;
                for (var r = 0; r < ranges.length; r++) {
                    var walker = new CKEDITOR.dom.walker(ranges[r]);
                    walker.evaluator = function (node) { return node.type === CKEDITOR.NODE_ELEMENT; };
                    var node;
                    while ((node = walker.next())) {
                        if (node.getName && node.getName() === 'span') {
                            node.removeStyle('font-family');
                            if (!node.getAttribute('style') && !node.getAttribute('class')) node.remove(true);
                        }
                    }
                }
            });

            // ── Fix alineación: después de ejecutar justify*, forzar text-align
            //    directamente en el elemento bloque contenedor ──
            editor.on('afterCommandExec', function (evt) {
                var alignMap = { justifyleft: 'left', justifycenter: 'center', justifyright: 'right', justifyblock: 'justify' };
                var align = alignMap[evt.data.name];
                if (!align) return;

                var sel = editor.getSelection();
                if (!sel) return;
                var ranges = sel.getRanges();
                if (!ranges || !ranges.length) return;

                var blockTags = { p:1, div:1, h1:1, h2:1, h3:1, h4:1, h5:1, h6:1, li:1, td:1, th:1 };
                for (var r = 0; r < ranges.length; r++) {
                    var el = ranges[r].startContainer;
                    if (el.type === CKEDITOR.NODE_TEXT) el = el.getParent();
                    while (el && !blockTags[el.getName ? el.getName() : '']) {
                        el = el.getParent ? el.getParent() : null;
                    }
                    if (el) el.setStyle('text-align', align);
                }
            });

            // ── Comandos de transformación de texto registrados directamente
            //    en la instancia del editor — sin plugin externo, sin CDN ──
            // IMPORTANTE: usar IIFE para capturar el valor de 'tipo' correctamente
            // en cada iteración (evitar el bug de closure en forEach).
            var transformDefs = [
                { name: 'ttCapitalize', tipo: 'capitalize' },
                { name: 'ttUppercase',  tipo: 'uppercase'  },
                { name: 'ttLowercase',  tipo: 'lowercase'  },
                { name: 'ttNone',       tipo: 'none'       },
            ];
            transformDefs.forEach(function(t) {
                (function(cmdName, cmdTipo) {
                    editor.addCommand(cmdName, {
                        exec: function(ed) { _ckAplicarTransformAEditor(ed, cmdTipo); }
                    });
                })(t.name, t.tipo);
            });
        },

        cargarDatos() {
            if (this.formatoDatos) {
                this.formato.cof_id          = this.formatoDatos.cof_id;
                this.formato.cof_nombre      = this.formatoDatos.cof_nombre;
                this.formato.cof_descripcion = this.formatoDatos.cof_descripcion;
                this.formato.cof_contenido   = this.formatoDatos.cof_contenido;
                this.formato.cof_estado      = parseInt(this.formatoDatos.cof_estado) || 0;
            } else {
                this.formato.cof_id          = null;
                this.formato.cof_nombre      = '';
                this.formato.cof_descripcion = '';
                this.formato.cof_contenido   = '';
                this.formato.cof_estado      = 1;
            }
        },

        // Inserta el placeholder en la posición del cursor de CKEditor
        insertarPlaceholderCK(placeholder) {
            var self = this;
            this.$nextTick(function () {
                if (!self._ckEditorInstance) return;
                self._ckEditorInstance.insertText(placeholder);
                self._ckEditorInstance.focus();
                if (document.activeElement && typeof document.activeElement.blur === 'function') {
                    document.activeElement.blur();
                }
            });
        },

        // Llama al helper global para aplicar transformación de texto desde los botones de la toolbar Vue
        aplicarTransformCK(tipo) {
            if (!this._ckEditorInstance) return;
            _ckAplicarTransformAEditor(this._ckEditorInstance, tipo);
            if (document.activeElement && typeof document.activeElement.blur === 'function') {
                document.activeElement.blur();
            }
        },

        // Aplica la transformación y cierra el menú flotante
        aplicarTransformYCerrar(tipo) {
            this.aplicarTransformCK(tipo);
            this.floatMenuAbierto = false;
        },

        // Aplica text-transform directamente sobre los nodos del texto seleccionado
        // Funciona eliminando cualquier text-transform previo en todos los elementos
        // contenidos en la selección antes de aplicar el nuevo valor.
        aplicarTextTransform(valor) {
            var editor = this._ckEditorInstance;
            if (!editor) return;

            editor.focus();
            var selection = editor.getSelection();
            if (!selection) return;
            var ranges = selection.getRanges();
            if (!ranges || !ranges.length) return;

            editor.fire('saveSnapshot');

            for (var r = 0; r < ranges.length; r++) {
                var range = ranges[r];

                // Recopilar todos los nodos de texto dentro del rango
                var walker = new CKEDITOR.dom.walker(range.clone());
                walker.evaluator = function (node) { return node.type === CKEDITOR.NODE_TEXT; };

                var textNodes = [];
                var node;
                while ((node = walker.next())) {
                    textNodes.push(node);
                }

                // Para cada nodo de texto: limpiar text-transform en padres span y aplicar el nuevo
                textNodes.forEach(function (textNode) {
                    // Subir por los padres quitando text-transform existente
                    var parent = textNode.getParent();
                    while (parent && parent.getName && parent.getName() !== 'body') {
                        if (parent.getName() === 'span') {
                            parent.removeStyle('text-transform');
                            // Limpiar span vacío de atributos
                            if (!parent.getAttribute('style') && !parent.getAttribute('class')) {
                                // No lo removemos ahora para no romper el árbol durante el recorrido
                            }
                        }
                        parent = parent.getParent();
                    }

                    // Ahora envolver el nodo de texto en un <span> con el nuevo text-transform
                    if (valor !== 'none') {
                        var spanHtml = '<span style="text-transform:' + valor + ';">' + textNode.getText() + '</span>';
                        var newRange = editor.createRange();
                        newRange.setStartBefore(textNode);
                        newRange.setEndAfter(textNode);
                        newRange.deleteContents();
                        var fragment = CKEDITOR.dom.element.createFromHtml(spanHtml);
                        newRange.insertNode(fragment);
                    }
                });
            }

            editor.fire('updateSnapshot');
        },

        validarcampo_vacio(campo, mensaje) {
            let me = this;
            if (campo === 'cof_nombre') {
                const el = me.$refs.cof_nombre.$el.querySelector('input');
                if (el) el.focus();
                me.classvalidar_cof_nombre = 'stylevalidar';
                setTimeout(() => { me.classvalidar_cof_nombre = ''; }, 1500);
            } else if (campo === 'cof_contenido') {
                if (me._ckEditorInstance) me._ckEditorInstance.focus();
                me.classvalidar_cof_contenido = 'stylevalidar';
                setTimeout(() => { me.classvalidar_cof_contenido = ''; }, 1500);
            } else if (campo === 'cof_descripcion') {
                const el = me.$refs.cof_descripcion.$el.querySelector('textarea');
                if (el) el.focus();
                me.classvalidar_cof_descripcion = 'stylevalidar';
                setTimeout(() => { me.classvalidar_cof_descripcion = ''; }, 1500);
            }
            me.$vs.notify({
                text: mensaje,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
        },

        guardarFormato(estadoGuardado) {
            let me = this;

            // Sincronizar datos del editor antes de validar
            if (me._ckEditorInstance) {
                me.formato.cof_contenido = me._ckEditorInstance.getData();
            }

            if (!me.formato.cof_nombre || me.formato.cof_nombre.trim() === '') {
                me.validarcampo_vacio('cof_nombre', 'Debe ingresar el nombre del formato');
                return;
            }
            if (me.formato.cof_nombre.length > 150) {
                me.validarcampo_vacio('cof_nombre', 'El nombre no puede exceder los 150 caracteres');
                return;
            }
            if (me.formato.cof_descripcion && me.formato.cof_descripcion.length > 500) {
                me.validarcampo_vacio('cof_descripcion', 'La descripción no puede exceder los 500 caracteres');
                return;
            }
            if (!me.formato.cof_contenido || me.formato.cof_contenido.trim() === '') {
                me.validarcampo_vacio('cof_contenido', 'El contenido del formato no puede estar vacío');
                return;
            }

            const userPlatform = JSON.parse(localStorage.getItem('usuario')) || {};
            const idusuario = userPlatform.idusuario || null;

            me.$vs.loading();
            const formData = new FormData();
            formData.append('action', 'GaurdarDatos_Convenio_Formato_Back');
            if (me.formato.cof_id) formData.append('cof_id', me.formato.cof_id);
            formData.append('cof_nombre', me.formato.cof_nombre);
            formData.append('cof_descripcion', me.formato.cof_descripcion || '');
            formData.append('cof_contenido', me.formato.cof_contenido);
            formData.append('cof_estado', estadoGuardado);
            formData.append('idperiodoescolar', me.periodoSelect.idperiodoescolar);
            formData.append('idusuario', idusuario);

            me.$http.post(me.$server_url + 'Procesar_MetodosPost_Convenio_Formato', formData)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.$emit('change', { verificaremit_regsitro_edicion: 1 });
                    } else {
                        me.$vs.notify({
                            text: res.data.message || 'Error al guardar el formato',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    }
                })
                .catch(err => {
                    me.$vs.loading.close();
                    console.log(err);
                    me.$vs.notify({
                        text: 'Error de conexión al guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },

        cerrar() {
            this.$emit('change', { verificaremit_regsitro_edicion: 2 });
        },
    }
};
</script>

<style scoped>
.formato-convenio-container { position: relative; }
.ckeditor-wrapper { min-height: 480px; position: relative; }
.preview-document {
    height: 660px;
    overflow-y: auto;
    border: 1px solid #e0e0e0;
    background: white;
    padding: 8px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}
.toolbar-insert .vs-button { min-width: 110px; font-size: 0.85rem; padding: 6px 10px; }
.stylevalidar {
    box-shadow: 0px 0px 2px 4px #ff0000 !important;
    border-radius: 5px;
}

/* ── Botón flotante de herramientas extra sobre el CKEditor ── */
.ck-float-menu-wrap {
    position: absolute;
    bottom: 12px;
    right: 12px;
    z-index: 999;
}

/* Botón trigger */
.ck-float-trigger {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: #1e40af;
    border: none;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 3px 10px rgba(30,64,175,0.45);
    transition: background 0.18s, transform 0.18s;
}
.ck-float-trigger:hover { background: #1d4ed8; transform: scale(1.08); }
.ck-float-trigger--open { background: #1d4ed8; transform: rotate(15deg) scale(1.08); }

/* Panel desplegable */
.ck-float-menu {
    position: absolute;
    bottom: 48px;
    right: 0;
    width: 220px;
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.13);
    padding: 10px 0 6px;
    overflow: hidden;
}
.ck-float-menu--dark {
    background: #1e293b;
    border-color: #334155;
    color: #e2e8f0;
}

.ck-float-menu__title {
    font-size: 0.68rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #94a3b8;
    padding: 0 14px 6px;
    margin: 0;
}

.ck-float-menu__items { display: flex; flex-direction: column; }

.ck-float-item {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 7px 14px;
    border: none;
    background: transparent;
    width: 100%;
    text-align: left;
    cursor: pointer;
    transition: background 0.12s;
    color: inherit;
}
.ck-float-item:hover { background: #f1f5f9; }
.ck-float-menu--dark .ck-float-item:hover { background: #334155; }

.ck-float-item__icon {
    width: 26px;
    height: 26px;
    border-radius: 5px;
    background: #dbeafe;
    color: #1e40af;
    font-size: 0.75rem;
    font-weight: 800;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.ck-float-item__icon-mat {
    width: 26px;
    height: 26px;
    border-radius: 5px;
    background: #f1f5f9;
    color: #64748b;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}
.ck-float-item__label {
    font-size: 0.82rem;
    font-weight: 600;
    flex: 1;
}
.ck-float-item__hint {
    font-size: 0.7rem;
    color: #94a3b8;
    font-style: italic;
}
.ck-float-item--remove .ck-float-item__label { color: #64748b; font-weight: 500; }

.ck-float-menu__divider {
    height: 1px;
    background: #e2e8f0;
    margin: 4px 10px;
}
.ck-float-menu--dark .ck-float-menu__divider { background: #334155; }

/* Animación del menú */
.ck-float-fade-enter-active,
.ck-float-fade-leave-active { transition: opacity 0.15s, transform 0.15s; }
.ck-float-fade-enter, .ck-float-fade-leave-to { opacity: 0; transform: translateY(8px) scale(0.97); }
/* Dark Mode */
.night-bg-container { background-color: #1a2254 !important; color: #c2c6dc !important; border-color: #262c49 !important; }
.night-bg-card { background-color: #262c49 !important; border-color: #414561 !important; }
.night-bg-header { background-color: #1A2254 !important; border-color: #1A2254 !important; color: #fff !important; }
.night-text { color: #e0e0e0 !important; }
.night-border { border-color: #414561 !important; }
.night-bg-toolbar { background-color: #1a2254 !important; border-color: #414561 !important; color: #e0e0e0 !important; }
.night-bg-preview { background-color: #262c49 !important; color: #c2c6dc !important; border-color: #414561 !important; }
</style>
