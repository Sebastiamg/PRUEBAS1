<template>
<div class="formato-pagare-container p-4 min-h-full relative" :class="{ 'bg-gray-50': !themeMode, 'night-bg-container': themeMode }">

    <!-- HEADER INFO -->
    <div class="flex justify-between items-start mb-6 border-b pb-4" :class="{ 'border-gray-200': !themeMode, 'night-border': themeMode }">
        <div class="pr-4">
            <h3 class="text-xl font-bold flex flex-wrap items-center gap-3" :class="{ 'text-gray-800': !themeMode, 'night-text': themeMode }">
                <span>Visualizando Pagaré:</span>
                <span class="text-primary">{{ formato.paf_nombre }}</span>
                <vs-chip v-if="formato.paf_estado == 2" color="success" class="ml-2 font-semibold">Aprobado</vs-chip>
                <vs-chip v-if="formato.paf_estado == 1" color="warning" class="ml-2 font-semibold">Pendiente de aprobación</vs-chip>
                <vs-chip v-if="formato.paf_estado == 0" color="danger" class="ml-2 font-semibold">Inactivo</vs-chip>
            </h3>
            <p class="text-sm mt-2 font-medium" :class="{ 'text-gray-600': !themeMode, 'text-gray-400': themeMode }">
                {{ formato.paf_descripcion }}
            </p>
        </div>
        <div class="flex gap-2 items-center flex-wrap justify-end">
            <vs-button color="dark" type="border" icon="arrow_back" @click="cerrar">Volver a la Lista</vs-button>
        </div>
    </div>

    <!-- PREVIEW -->
    <vs-row>
        <vs-col vs-w="12">
            <vs-card class="shadow-sm rounded-lg border h-full flex flex-col mb-0" :class="{ 'bg-gray-50 border-gray-100': !themeMode, 'night-bg-card night-border': themeMode }">
                <div slot="header" class="p-3 rounded-t-lg -mx-4 -mt-4 mb-2 border-b" :class="{ 'bg-green-50 border-green-100': !themeMode, 'night-bg-header night-border': themeMode }">
                    <h4 class="font-bold flex items-center" :class="{ 'text-green-800': !themeMode, 'night-text': themeMode }">
                        <vs-icon icon="visibility" class="mr-2"></vs-icon> Vista Previa del Documento
                    </h4>
                </div>
                <div class="preview-document mt-2 border rounded-lg shadow-inner flex-grow min-h-[400px]" :class="{ 'bg-white border-gray-200': !themeMode, 'night-bg-preview night-border night-text': themeMode }" v-html="vistaPreviaHtml">
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
</div>
</template>

<script>
export default {
    props: {
        formatoDatos: {
            type: Object,
            required: true
        },
        periodoSelect: {
            type: Object,
            default: () => {}
        }
    },
    data() {
        return {
            formato: {
                paf_id: null,
                paf_nombre: '',
                paf_descripcion: '',
                paf_contenido: '',
                paf_estado: 1,
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
                return '<p style="color:#aaa; text-align:center; padding:60px 20px;">Sin contenido.</p>';
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
            this.formato = {
                ...this.formatoDatos
            };
            this.formato.paf_estado = parseInt(this.formatoDatos.paf_estado) || 0;
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
.preview-document {
    min-height: 480px;
    height: 100%;
    border: 1px solid #e0e0e0;
    background: white;
    padding: 1px;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}
@media print {
    body * { visibility: hidden; }
    .preview-document, .preview-document * { visibility: visible; }
    .preview-document {
        position: absolute; left: 0; top: 0; width: 100%;
        margin: 0; padding: 0; border: none !important; box-shadow: none !important;
    }
    .preview-document .ql-editor-preview { margin: 1.5cm 1cm !important; font-size: 11pt !important; }
}
/* Dark Mode */
.night-bg-container { background-color: #1a2254 !important; color: #c2c6dc !important; border-color: #262c49 !important; }
.night-bg-card { background-color: #262c49 !important; border-color: #414561 !important; }
.night-bg-header { background-color: #1A2254 !important; border-color: #1A2254 !important; color: #fff !important; }
.night-text { color: #e0e0e0 !important; }
.night-border { border-color: #414561 !important; }
.night-bg-preview { background-color: #262c49 !important; color: #c2c6dc !important; border-color: #414561 !important; }
</style>
