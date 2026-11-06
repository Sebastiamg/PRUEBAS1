<template>
<div class="formato-convenio-container p-4 min-h-full relative" :class="{ 'bg-gray-50': !themeMode, 'night-bg-container': themeMode }">

    <!-- HEADER INFO -->
    <div class="flex justify-between items-start mb-6 border-b pb-4" :class="{ 'border-gray-200': !themeMode, 'night-border': themeMode }">
        <div class="pr-4">
            <h3 class="text-xl font-bold flex flex-wrap items-center gap-3" :class="{ 'text-gray-800': !themeMode, 'night-text': themeMode }">
                <span>Visualizando Convenio:</span>
                <span class="text-primary">{{ formato.cof_nombre }}</span>
                <vs-chip v-if="formato.cof_estado == 2" color="success" class="ml-2 font-semibold">Aprobado</vs-chip>
                <vs-chip v-if="formato.cof_estado == 1" color="warning" class="ml-2 font-semibold">Pendiente de aprobación</vs-chip>
                <vs-chip v-if="formato.cof_estado == 0" color="danger" class="ml-2 font-semibold">Inactivo</vs-chip>
            </h3>
            <p class="text-sm mt-2 font-medium" :class="{ 'text-gray-600': !themeMode, 'text-gray-400': themeMode }">
                {{ formato.cof_descripcion }}
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
                cof_id: null,
                cof_nombre: '',
                cof_descripcion: '',
                cof_contenido: '',
                cof_estado: 1,
            }
        };
    },
    computed: {
        themeMode() {
            return this.$store.state.theme === 'dark';
        },
        vistaPreviaHtml() {
            var contenido = this.formato.cof_contenido || '';
            if (contenido.trim() === '') {
                return '<p style="color:#aaa; text-align:center; padding:60px 20px;">Sin contenido.</p>';
            }
            var html = contenido;
            // Tabla de componentes de ejemplo
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

            // Tabla económica de ejemplo
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
                '@NUMERO_DE_SECUENCIA':            'CV-1-C-S26-0000-AS',
                '@NOMBRE_UNIDAD_EDUCATIVA':        'UNIDAD EDUCATIVA PROLIPA',
                '@NOMBRES_APELLIDOS_BENEFICIARIO': 'NOMBRE1 NOMBRE2 APELLIDO1 APELLIDO2',
                '@PERIODOS_LECTIVOS':              '2022-2023, 2023-2024 y 2024-2025',
                '@TABLA_DE_COMPONENTES':           tablaComponentesEjemplo,
                '@TABLA_ECONOMICA':                tablaEconomicaEjemplo,
                '@ANIOS_CONVENIO_NUMERO_LETRAS':    'dos (2) años lectivos',
                '@DIRECCION_UNIDAD_EDUCATIVA':     'AV. LA PRENSA N56-89',
                '@TELEFONO_UNIDAD_EDUCATIVA':      '2247581',
                '@CORREO_UNIDAD_EDUCATIVA':        'correoinstitucion@gmail.com',
                '@CIUDAD_UNIDAD_EDUCATIVA':        'QUITO',
                '@FECHA_ACTUAL':                   '09 días del mes de enero de 2026',
                '@CEDULA_BENEFICIARIO':            '9999999999',
            };
            var keys = Object.keys(ejemplos).sort((a, b) => b.length - a.length);

            // ── Aplicar text-transform real antes de sustituir variables ──
            try {
                var parserViz = new DOMParser();
                var docViz = parserViz.parseFromString(html, 'text/html');
                var spansViz = docViz.querySelectorAll('span[style*="text-transform"]');
                spansViz.forEach(function(span) {
                    var transform = span.style.textTransform;
                    if (!transform || transform === 'none') return;
                    var walkerViz = docViz.createTreeWalker(span, NodeFilter.SHOW_TEXT, null, false);
                    var tNode;
                    while ((tNode = walkerViz.nextNode())) {
                        var txt = tNode.nodeValue;
                        tNode.nodeValue = txt.replace(/(@[A-Z_]+)|([^@]+)/g, function(match, variable, normal) {
                            if (variable) return variable;
                            if (transform === 'uppercase') return normal.toUpperCase();
                            if (transform === 'lowercase') return normal.toLowerCase();
                            if (transform === 'capitalize') {
                                return normal.toLowerCase().replace(/(?:^|\s|[-/])\S/g, function(c) { return c.toUpperCase(); });
                            }
                            return normal;
                        });
                    }
                    span.style.removeProperty('text-transform');
                });
                html = docViz.body.innerHTML;
            } catch(e) { /* silencioso */ }

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
                    html = html.split(keys[i]).join(`<span style="background-color:#ffe0b2;padding:0 4px;border-radius:3px;">${valor}</span>`);
                }
            }
            return `
<style>
.ck-preview { font-family: 'Times New Roman', Times, serif; font-size: 12pt; line-height: 1.6; margin: 20px 10px; }
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
        cargarDatos() {
            this.formato = {
                ...this.formatoDatos
            };
            this.formato.cof_estado = parseInt(this.formatoDatos.cof_estado) || 0;
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
.formato-convenio-container { position: relative; }
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
    .preview-document .ck-preview { margin: 1.5cm 1cm !important; font-size: 11pt !important; }
    .preview-document .dynamic-table-preview { background-color: transparent !important; padding: 0 !important; margin: 0 !important; }
}
/* Dark Mode */
.night-bg-container { background-color: #1a2254 !important; color: #c2c6dc !important; border-color: #262c49 !important; }
.night-bg-card { background-color: #262c49 !important; border-color: #414561 !important; }
.night-bg-header { background-color: #1A2254 !important; border-color: #1A2254 !important; color: #fff !important; }
.night-text { color: #e0e0e0 !important; }
.night-border { border-color: #414561 !important; }
.night-bg-preview { background-color: #262c49 !important; color: #c2c6dc !important; border-color: #414561 !important; }
</style>
