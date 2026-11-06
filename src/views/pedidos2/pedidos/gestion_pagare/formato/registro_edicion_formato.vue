<template>
<div class="formato-pagare-container p-4 min-h-full relative" :class="{ 'bg-gray-50': !themeMode, 'night-bg-container': themeMode }">

    <!-- TOP ACTION BAR -->
    <div class="flex justify-between items-start mb-6 border-b pb-4" :class="{ 'border-gray-200': !themeMode, 'night-border': themeMode }">
        <div class="pr-4">
            <h3 class="text-xl font-bold flex flex-wrap items-center gap-3" :class="{ 'text-gray-800': !themeMode, 'night-text': themeMode }">
                <span>{{ formato.paf_id ? 'Editando Pagaré' : 'Nuevo Pagaré' }}</span>
                <span v-if="formato.paf_id" class="text-primary">{{ formato.paf_nombre }}</span>
                <vs-chip v-if="verificar_creacion_edicion === 2 && formato.paf_estado == 2" color="success" class="ml-2 font-semibold">Aprobado</vs-chip>
                <vs-chip v-if="verificar_creacion_edicion === 2 && formato.paf_estado == 1" color="warning" class="ml-2 font-semibold">Pendiente de aprobación</vs-chip>
                <vs-chip v-if="verificar_creacion_edicion === 2 && formato.paf_estado == 0" color="danger" class="ml-2 font-semibold">Anulado</vs-chip>
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
                        <vs-input class="w-full text-lg font-medium" label="Nombre del Formato" placeholder="Ej: Formato Oficial Costa 2026" v-model="formato.paf_nombre" ref="paf_nombre" :class="classvalidar_paf_nombre" maxlength="150" />
                    </vs-col>
                    <vs-col vs-w="12" class="p-2 mt-2">
                        <vs-textarea label="Descripción" v-model="formato.paf_descripcion" height="80px" counter="500" ref="paf_descripcion" :class="classvalidar_paf_descripcion" />
                    </vs-col>
                </vs-row>
            </vs-card>
        </vs-col>

        <!-- Quill Editor & Preview -->
        <vs-col vs-w="12" class="mt-4">
            <vs-row vs-justify="space-between" vs-type="flex" class="w-full">
                <!-- Editor Column -->
                <vs-col vs-w="12" vs-lg="6" vs-md="6" vs-sm="12" vs-xs="12" class="mb-4 pr-0 md:pr-4">
                    <vs-card class="shadow-sm rounded-lg border h-full flex flex-col mb-0" :class="{ 'border-gray-100': !themeMode, 'night-bg-card night-border': themeMode }">
                        <div slot="header" class="p-3 rounded-t-lg -mx-4 -mt-4 mb-2 border-b" :class="{ 'bg-blue-50 border-blue-100': !themeMode, 'night-bg-header night-border': themeMode }">
                            <h4 class="font-bold flex items-center" :class="{ 'text-blue-800': !themeMode, 'night-text': themeMode }">
                                <vs-icon icon="edit" class="mr-2"></vs-icon> Editor del Formato
                            </h4>
                        </div>

                        <!-- Variables toolbar -->
                        <div class="toolbar-insert mb-4 p-4 rounded-xl border shadow-sm mt-2" :class="{ 'bg-white border-gray-200': !themeMode, 'night-bg-toolbar night-border': themeMode }">
                            <p class="text-sm font-bold mb-3 uppercase tracking-wide flex items-center gap-2" :class="{ 'text-primary': !themeMode, 'text-primary-light': themeMode }">
                                <vs-icon icon="ads_click" size="small"></vs-icon>
                                <span>Variables Dinámicas (Clic para insertar en el editor)</span>
                            </p>

                            <div class="space-y-4">
                                <!-- Grupo 1: Financiero y Plazos -->
                                <div>
                                    <span class="text-xs font-semibold block mb-2" :class="{ 'text-gray-500': !themeMode, 'text-gray-400': themeMode }">Financiero y Plazos:</span>
                                    <div class="flex flex-wrap gap-2">
                                        <vx-tooltip text="Ej: 001-P-2026">
                                            <vs-button size="small" type="border" color="primary" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@NUMERO_DE_SECUENCIA')">N° Secuencial</vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip text="Ej: 2,546.85">
                                            <vs-button size="small" type="border" color="primary" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@VALOR')">Valor Número($)</vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip text="Ej: DOS MIL QUINIENTOS CUARENTA Y SEIS CON 85/100 DÓLARES">
                                            <vs-button size="small" type="border" color="primary" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@VALOR_LETRAS')">Valor en Letras</vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip text="Ej: 188">
                                            <vs-button size="small" type="border" color="primary" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@DIAS')">Días Número</vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip text="Ej: ciento ochenta y ocho">
                                            <vs-button size="small" type="border" color="primary" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@DIAS_LETRAS')">Días en Letras</vs-button>
                                        </vx-tooltip>
                                    </div>
                                </div>

                                <!-- Grupo 2: Beneficiario y Contrato -->
                                <div>
                                    <span class="text-xs font-semibold block mb-2" :class="{ 'text-gray-500': !themeMode, 'text-gray-400': themeMode }">Beneficiario y Contrato:</span>
                                    <div class="flex flex-wrap gap-2">
                                        <vx-tooltip text="Ej: NOMBRE1 NOMBRE2 APELLIDO1 APELLIDO2">
                                            <vs-button size="small" type="border" color="warning" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@NOMBRES_APELLIDOS_BENEFICIARIO')">Nombres y Apellidos Beneficiario</vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip text="Ej: 1726548971">
                                            <vs-button size="small" type="border" color="warning" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@CEDULA_BENEFICIARIO')">Cédula Beneficiario</vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip text="Ej: AV. LA PRENSA N56-89">
                                            <vs-button size="small" type="border" color="warning" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@DIRECCION_BENEFICIARIO')">Dirección Beneficiario</vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip text="Ej: 25 de mayo de 2026">
                                            <vs-button size="small" type="border" color="warning" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@FECHA_GENERACION_CONTRATO')">Fecha Contrato</vs-button>
                                        </vx-tooltip>
                                    </div>
                                </div>

                                <!-- Grupo 3: Empresa e Institución -->
                                <div>
                                    <span class="text-xs font-semibold block mb-2" :class="{ 'text-gray-500': !themeMode, 'text-gray-400': themeMode }">Empresa e Institución:</span>
                                    <div class="flex flex-wrap gap-2">
                                        <vx-tooltip text="Ej: GRUPOCALMED CÍA. LTDA.">
                                            <vs-button size="small" type="border" color="success" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@EMPRESA')">Empresa</vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip text="Ej: 1793205618001">
                                            <vs-button size="small" type="border" color="success" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@RUC')">RUC Empresa</vs-button>
                                        </vx-tooltip>
                                        <vx-tooltip text="Ej: QUITO">
                                            <vs-button size="small" type="border" color="success" class="font-semibold" :class="{ 'bg-white': !themeMode }" @click="insertarPlaceholder('@CIUDAD_INSTITUCION')">Ciudad</vs-button>
                                        </vx-tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div class="quill-wrapper flex-grow rounded-lg overflow-hidden border mt-2" :class="[classvalidar_paf_contenido, { 'border-gray-200': !themeMode, 'night-border night-bg-preview night-quill': themeMode }]">
                            <quill-editor ref="quillEditor" v-model="formato.paf_contenido" :options="quillOptions" class="quill-editor-custom" />
                        </div>
                    </vs-card>
                </vs-col>

                <!-- Preview Column -->
                <vs-col vs-w="12" vs-lg="6" vs-md="6" vs-sm="12" vs-xs="12" class="transition-all duration-300">
                    <vs-card class="shadow-sm rounded-lg border h-full flex flex-col mb-0" :class="{ 'bg-gray-50 border-gray-100': !themeMode, 'night-bg-card night-border': themeMode }">
                        <div slot="header" class="p-3 rounded-t-lg -mx-4 -mt-4 mb-2 border-b" :class="{ 'bg-green-50 border-green-100': !themeMode, 'night-bg-header night-border': themeMode }">
                            <h4 class="font-bold flex items-center" :class="{ 'text-green-800': !themeMode, 'night-text': themeMode }">
                                <vs-icon icon="visibility" class="mr-2"></vs-icon> Vista Previa (Simulada)
                            </h4>
                        </div>
                        <div class="mb-4 p-3 flex items-center justify-between rounded-lg border shadow-sm mt-4" :class="{ 'bg-white border-gray-200': !themeMode, 'night-bg-toolbar night-border': themeMode }">
                            <div>
                                <p class="text-xs font-semibold mb-2 uppercase tracking-wide" :class="{ 'text-emerald-600': !themeMode, 'text-emerald-400': themeMode }">
                                    <vs-icon icon="bolt" size="small" class="mr-1"></vs-icon> Motor de Renderizado Ficticio
                                </p>
                                <p class="text-sm" :class="{ 'text-gray-500': !themeMode, 'text-gray-400': themeMode }">
                                    Las variables son reemplazadas al instante para demostrar el acabado del documento real.
                                </p>
                            </div>
                            <!-- <vs-icon icon="fact_check" size="large" :color="themeMode ? '#e0e0e0' : '#b0bec5'"></vs-icon> -->
                        </div>
                        <div class="preview-document mt-2 rounded-lg shadow-inner flex-grow min-h-[300px]" :class="{ 'bg-white border-gray-200': !themeMode, 'night-bg-preview night-border night-text': themeMode }" v-html="vistaPreviaHtml">
                        </div>
                    </vs-card>
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>
</div>
</template>

<script>
import {
    quillEditor
} from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';

export default {
    components: {
        quillEditor
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
            classvalidar_paf_nombre: '',
            classvalidar_paf_descripcion: '',
            classvalidar_paf_contenido: '',
            formato: {
                paf_id: null,
                paf_nombre: '',
                paf_descripcion: '',
                paf_contenido: '',
                paf_estado: 1,
            },
            quillOptions: {
                theme: 'snow',
                modules: {
                    toolbar: [
                        ['bold', 'italic', 'underline', 'strike'],
                        [{
                            header: [1, 2, 3, false]
                        }],
                        [{
                            color: []
                        }, {
                            background: []
                        }],
                        [{
                            align: []
                        }],
                        ['clean']
                    ]
                },
                placeholder: 'Escribe el texto del pagaré aquí... usa los botones para insertar variables'
            }
        };
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        vistaPreviaHtml() {
            var contenido = this.formato.paf_contenido || '';
            if (contenido.trim() === '') {
                return '<p style="color:#aaa; text-align:center; padding:60px 20px;">Escribe o inserta variables para ver la vista previa.</p>';
            }
            var html = contenido;
            var ejemplos = {
                '@NUMERO_DE_SECUENCIA': '001-P-2026',
                '@VALOR_LETRAS': 'DOS MIL QUINIENTOS CUARENTA Y SEIS CON 85/100 DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA',
                '@DIAS_LETRAS': 'ciento ochenta y ocho',
                '@VALOR': '2,546.85',
                '@DIAS': '188',
                '@EMPRESA': 'GRUPOCALMED CÍA. LTDA.',
                '@RUC': '1793205618001',
                '@FECHA_GENERACION_CONTRATO': '25 de mayo de 2026',
                '@NOMBRES_APELLIDOS_BENEFICIARIO': 'NOMBRE1 NOMBRE2 APELLIDO1 APELLIDO2',
                '@CEDULA_BENEFICIARIO': '1726548971',
                '@DIRECCION_BENEFICIARIO': 'AV. LA PRENSA N56-89',
                '@CIUDAD_INSTITUCION': 'QUITO'
            };
            // Ordenar por longitud descendente para evitar reemplazos parciales
            var keys = Object.keys(ejemplos).sort((a, b) => b.length - a.length);
            for (var i = 0; i < keys.length; i++) {
                var valor = ejemplos[keys[i]];
                html = html.split(keys[i]).join(`<span style="background-color:#ffe0b2;padding:0 4px;border-radius:3px;">${valor}</span>`);
            }
            return `
<style>
.ql-editor-preview {
    font-family: 'Times New Roman', Times, serif;
    font-size: 12pt;
    line-height: 1.6;
    margin: 20px 5px;
}

.ql-editor-preview p,
.ql-editor-preview div,
.ql-editor-preview ol,
.ql-editor-preview ul {
    margin: 0 0 1em 0;
}

.ql-align-center {
    text-align: center !important;
}

.ql-align-right {
    text-align: right !important;
}

.ql-align-justify {
    text-align: justify !important;
}

.ql-align-left {
    text-align: left !important;
}
</style><div class="ql-editor-preview ql-editor">${html}</div>`;
        }
    },
    mounted() {
        this.cargarDatos();
    },
    methods: {
        cargarDatos() {
            const userPlatform = JSON.parse(localStorage.getItem('usuario'));
            if (this.formatoDatos) {
                this.formato.paf_id = this.formatoDatos.paf_id;
                this.formato.paf_nombre = this.formatoDatos.paf_nombre;
                this.formato.paf_descripcion = this.formatoDatos.paf_descripcion;
                this.formato.paf_contenido = this.formatoDatos.paf_contenido;
                this.formato.paf_estado = parseInt(this.formatoDatos.paf_estado) || 0;
            } else {
                this.formato.paf_id = null;
                this.formato.paf_nombre = '';
                this.formato.paf_descripcion = '';
                this.formato.paf_contenido = '';
                this.formato.paf_estado = 1;
            }
        },

        validarcampo_vacio(campo, mensaje) {
            let me = this;
            if (campo === 'paf_nombre') {
                const el = me.$refs.paf_nombre.$el.querySelector('input');
                if (el) el.focus();
                me.classvalidar_paf_nombre = 'stylevalidar';
                setTimeout(() => {
                    me.classvalidar_paf_nombre = '';
                }, 1500);
            } else if (campo === 'paf_contenido') {
                if (me.$refs.quillEditor && me.$refs.quillEditor.quill) me.$refs.quillEditor.quill.focus();
                me.classvalidar_paf_contenido = 'stylevalidar';
                setTimeout(() => {
                    me.classvalidar_paf_contenido = '';
                }, 1500);
            } else if (campo === 'paf_descripcion') {
                const el = me.$refs.paf_descripcion.$el.querySelector('textarea');
                if (el) el.focus();
                me.classvalidar_paf_descripcion = 'stylevalidar';
                setTimeout(() => {
                    me.classvalidar_paf_descripcion = '';
                }, 1500);
            }
            me.$vs.notify({
                text: mensaje,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
        },

        insertarPlaceholder(placeholder) {
            var self = this;
            this.$nextTick(function () {
                if (!self.$refs || !self.$refs.quillEditor || !self.$refs.quillEditor.quill) return;
                var quill = self.$refs.quillEditor.quill;
                var range = quill.getSelection(true) || {
                    index: quill.getLength(),
                    length: 0
                };
                quill.insertText(range.index, placeholder);
                quill.setSelection(range.index + placeholder.length);
                quill.focus();
            });
        },

        guardarFormato(estadoGuardado) {
            let me = this;
            if (!me.formato.paf_nombre || me.formato.paf_nombre.trim() === '') {
                me.validarcampo_vacio('paf_nombre', 'Debe ingresar el nombre del formato');
                return;
            }
            if (me.formato.paf_nombre.length > 150) {
                me.validarcampo_vacio('paf_nombre', 'El nombre no puede exceder los 150 caracteres');
                return;
            }
            if (me.formato.paf_descripcion && me.formato.paf_descripcion.length > 500) {
                me.validarcampo_vacio('paf_descripcion', 'La descripción no puede exceder los 500 caracteres');
                return;
            }
            if (!me.formato.paf_contenido || me.formato.paf_contenido.trim() === '') {
                me.validarcampo_vacio('paf_contenido', 'El contenido del formato no puede estar vacío');
                return;
            }

            // Capturar idusuario desde localStorage
            const userPlatform = JSON.parse(localStorage.getItem('usuario')) || {};
            const idusuario = userPlatform.idusuario || null;

            me.$vs.loading();
            const formData = new FormData();
            formData.append('action', 'GaurdarDatos_Pagare_Formato_Back');
            if (me.formato.paf_id) formData.append('paf_id', me.formato.paf_id);
            formData.append('paf_nombre', me.formato.paf_nombre);
            formData.append('paf_descripcion', me.formato.paf_descripcion || '');
            formData.append('paf_contenido', me.formato.paf_contenido);
            formData.append('paf_estado', estadoGuardado);
            formData.append('idperiodoescolar', me.periodoSelect.idperiodoescolar);
            formData.append('idusuario', idusuario);

            me.$http.post(me.$server_url + 'Procesar_MetodosPost_Pagare_FormatoController', formData)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.$emit('change', {
                            verificaremit_regsitro_edicion: 1
                        });
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
            this.$emit('change', {
                verificaremit_regsitro_edicion: 2
            });
        }
    }
};
</script>

<style scoped>
.formato-pagare-container { position: relative; }
.quill-wrapper { min-height: 480px; position: relative; }
.quill-editor-custom { min-height: 480px; background: white; }
.quill-editor-custom ::v-deep .ql-container { height: auto !important; min-height: 400px; }
.preview-document {
    min-height: 460px;
    height: 100%;
    border: 1px solid #e0e0e0;
    background: white;
    padding: 1px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}
.toolbar-insert .vs-button { min-width: 110px; font-size: 0.85rem; padding: 6px 10px; }
.stylevalidar {
    box-shadow: 0px 0px 2px 4px #ff0000 !important;
    border-radius: 5px;
}
/* Dark Mode */
.night-bg-container { background-color: #1a2254 !important; color: #c2c6dc !important; border-color: #262c49 !important; }
.night-bg-card { background-color: #262c49 !important; border-color: #414561 !important; }
.night-bg-header { background-color: #1A2254 !important; border-color: #1A2254 !important; color: #fff !important; }
.night-text { color: #e0e0e0 !important; }
.night-border { border-color: #414561 !important; }
.night-bg-toolbar { background-color: #1a2254 !important; border-color: #414561 !important; color: #e0e0e0 !important; }
.night-bg-preview { background-color: #262c49 !important; color: #c2c6dc !important; border-color: #414561 !important; }
</style>

<style>
/* QUILL DARK THEME — sin scope para forzar sobre el DOM de Quill */
.night-quill .ql-toolbar.ql-snow {
    background-color: #1a2254 !important;
    border-color: #414561 !important;
}

.night-quill .ql-toolbar.ql-snow .ql-stroke {
    stroke: #c2c6dc !important;
}

.night-quill .ql-toolbar.ql-snow .ql-fill {
    fill: #c2c6dc !important;
}

.night-quill .ql-toolbar.ql-snow .ql-picker-label,
.night-quill .ql-toolbar.ql-snow .ql-picker-item,
.night-quill .ql-toolbar.ql-snow .ql-picker {
    color: #c2c6dc !important;
}

.night-quill .ql-container.ql-snow {
    background-color: #262c49 !important;
    border-color: #414561 !important;
    color: #c2c6dc !important;
}

.night-quill .ql-editor {
    background-color: #262c49 !important;
    color: #c2c6dc !important;
}

.night-quill .ql-snow .ql-picker-options {
    background-color: #1a2254 !important;
    border-color: #414561 !important;
}
</style>
