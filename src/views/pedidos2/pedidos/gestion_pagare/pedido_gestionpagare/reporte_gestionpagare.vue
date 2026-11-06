<template>
<div>
    <!-- ── Botones de acción ── -->
    <div style="display:flex; justify-content:center; margin: 16px 0; gap: 12px; flex-direction: column; align-items: center;">
        <div style="display:flex; justify-content:center; gap: 12px;">
            <vs-button v-if="datosPagare && String(datosPagare.pgc_estado) !== '2'" color="dark" type="line" icon-pack="feather" icon="icon-printer" :disabled="!reporteListo" @click="imprimirPDF()">
                Imprimir / Descargar PDF
            </vs-button>
            <vs-button v-if="datosPagare && String(datosPagare.pgc_estado) === '2'" color="dark" type="line" icon-pack="feather" icon="icon-printer" :disabled="!reporteListo" @click="imprimirAnulado()">
                Imprimir / Descargar PDF
            </vs-button>
            <vs-button color="danger" type="line" @click="getCancelar()">Cerrar</vs-button>
        </div>
    </div>

    <!-- ── Cargando ── -->
    <div v-if="!reporteListo" style="text-align:center; padding:60px; color:#aaa;">
        <div class="loader-ring" style="margin: 0 auto 16px;"></div>
        <p>Cargando datos del pagaré...</p>
    </div>

    <!-- ══ CONTENIDO IMPRIMIBLE ══ -->
    <div id="seccionImprimir2" v-if="reporteListo">
        <div class="pagare-print-wrap">
            <!-- Contenido HTML del formato con variables ya sustituidas (incluye estilos inline inyectados dinámicamente) -->
            <div class="pagare-contenido-libre ql-editor" v-html="contenidoFinal"></div>
        </div>
    </div>
</div>
</template>

<script>
import moment from 'moment';
import imprimirMixin from "@/mixins/Pedidosmix.js";

export default {
    mixins: [imprimirMixin],

    props: {
        pgc_id: {
            type: [Number, String],
            default: null,
        },
        // Año final seleccionado al momento de generar el pagaré
        aniosAnteriorSelect: {
            type: [String, Number],
            default: '',
        },
    },

    data() {
        return {
            datosPagare: null,
            reporteListo: false,
            contenidoFinal: '',
            nombreArchivo: 'Pagare.pdf',
            // Variables internas para cálculos de fecha
            yearActual: new Date().getFullYear(),
        };
    },

    mounted() {
        moment.locale('es');
        this.cargarDatosPagare();
    },

    methods: {
        // ─── Carga datos del backend ─────────────────────────────────────
        cargarDatosPagare() {
            let me = this;

            me.$http.get(me.$server_url + `VerifcarMetodosGet_Pagare_Pedido?action=Get_DatosPagare_ParaReporte&pgc_id=${me.pgc_id}`)
                .then(res => {
                    const d = res.data;
                    if (!d || !d.pgc_id) {
                        me.$vs.notify({
                            title: 'Error',
                            text: 'No se encontraron datos del pagaré.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                        return;
                    }
                    me.datosPagare = d;
                    me.nombreArchivo = `Pagare-${d.pgc_codigo || d.pgc_id}.pdf`;
                    me.contenidoFinal = me.sustituirVariables(d);
                    me.reporteListo = true;
                })
                .catch(err => {
                    console.error('Error cargando datos del pagaré:', err);
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al cargar los datos del pagaré.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                });
        },

        // ─── Sustituye todas las variables @XXXX en el HTML del formato ──
        sustituirVariables(d) {
            if (!d.paf_contenido) return '<p>El formato no tiene contenido.</p>';

            let html = d.paf_contenido;

            // Calcular días
            const dias = this.getDay(d);
            const diasLetras = this.numeroALetras(dias);

            // Monto
            const monto = parseFloat(d.pgc_monto) || 0;
            const montoFormato = this.formatDecimal(monto);
            const montoLetras = (this.numeroALetras(monto)).toUpperCase() + ' DÓLARES DE LOS ESTADOS UNIDOS DE AMÉRICA';

            // Fecha del contrato formateada
            const fechaContrato = this.getFechaContrato(d.fecha_generacion_contrato);

            // Sustituciones
            const vars = {
                '@NUMERO_DE_SECUENCIA': d.pgc_codigo || '',
                '@EMPRESA': (d.empresa_nombre || '').toUpperCase(),
                '@RUC': d.empresa_ruc || '',
                '@DIAS_LETRAS': diasLetras,
                '@DIAS': String(dias),
                '@VALOR': montoFormato,
                '@VALOR_LETRAS': montoLetras,
                '@FECHA_GENERACION_CONTRATO': fechaContrato,
                '@NOMBRES_APELLIDOS_BENEFICIARIO': (d.beneficiario_nombres || '').toUpperCase(),
                '@CEDULA_BENEFICIARIO': d.beneficiario_cedula || '',
                '@DIRECCION_BENEFICIARIO': (d.beneficiario_direccion || '').toUpperCase(),
                '@CIUDAD_INSTITUCION': (d.ciudad_nombre || '').toUpperCase(),
            };

            // Sustituir todas las ocurrencias de cada variable en el HTML (ordenando por longitud descendente para evitar colisión de prefijos como @VALOR y @VALOR_LETRAS)
            Object.keys(vars)
                .sort((a, b) => b.length - a.length)
                .forEach(key => {
                    html = html.split(key).join(vars[key]);
                });

            // Estilos inline inyectados dinámicamente para que el mixin los capture en la pestaña de impresión
            const estilosImpresion = `
        
<style>
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

.pagare-contenido-libre {
    font-family: Arial, sans-serif !important;
    font-size: 11px !important;
    line-height: 1.3 !important;
    color: #111 !important;
}

.pagare-contenido-libre p {
    margin: 0 0 3px 0 !important;
    padding: 0 !important;
}

.pagare-print-wrap {
    padding: 15px 25px !important;
}

/* Quitar fondo de highlights en impresión */
.pagare-contenido-libre strong[style*="background-color"],
.pagare-contenido-libre span[style*="background-color"] {
    background-color: transparent !important;
    color: inherit !important;
}
</style>
      `;

            return estilosImpresion + html;
        },

        // ─── Impresión usando el mixin (igual que reporte_permisovacacion) ─
        imprimirPDF() {
            let me = this;
            me.m_imprimirTodos('11px', me.nombreArchivo, '0px', '', 'portrait');
        },

        imprimirAnulado() {
            let me = this;
            me.m_imprimirTodos('11px', me.nombreArchivo, '0px', 'ANULADO', 'portrait');
        },

        getCancelar() {
            this.$emit('change', {
                verificacionemitimprimir: 2
            });
        },

        // ══════════════════════════════════════════════════════════════════
        // LÓGICA DE CÁLCULO DE DÍAS (portada de exportPagare.vue)
        // ══════════════════════════════════════════════════════════════════

        /**
         * Calcula los días totales entre la fecha de generación del contrato
         * y el año final seleccionado, según la región (Sierra=1, Costa=2)
         */
        getDay(d) {
            const fechaGenerarC = (d.fecha_generacion_contrato || '').substring(0, 10);
            const preyear = String(this.aniosAnteriorSelect || d.pgc_anio || this.yearActual);
            // region_idregion: 1 = Sierra, 2 = Costa
            const region = parseInt(d.region_idregion) || 1;

            if (region === 2) {
                // Costa → hasta 30 de septiembre
                return this.calculoFechaLimite(preyear, 2, fechaGenerarC);
            } else {
                // Sierra → hasta 31 de diciembre
                return this.calculoFechaLimite(preyear, 1, fechaGenerarC);
            }
        },

        calculoFechaLimite(fechaFin, region, fechaGenerarC) {
            // SIERRA
            if (region === 1) {
                return this.obtenerDiasXAnio(region, fechaGenerarC, fechaFin);
            }

            // COSTA: puede abarcar múltiples años
            const arrayDeAnios = this.generarArrayDeAnios(this.yearActual, fechaFin);
            const anioUltimo = arrayDeAnios.length > 1 ? arrayDeAnios.length - 1 : 0;
            let resultadoDays = 0;

            for (let i = 0; i < arrayDeAnios.length; i++) {
                let FInicio = '';
                let FFin = '';
                const anioEnCurso = arrayDeAnios[i];
                let result = 0;

                if (arrayDeAnios.length === 1) {
                    if (i === 0) {
                        FInicio = fechaGenerarC;
                        FFin = arrayDeAnios[i] + '-09-30';
                        result = this.obtenerDiasXAnio(region, FInicio, FFin) + 1;
                    }
                } else {
                    if (i === 0) {
                        FInicio = fechaGenerarC;
                        FFin = arrayDeAnios[i] + '-12-31';
                        result = this.obtenerDiasXAnio(region, FInicio, FFin) + 1;
                    } else if (i === anioUltimo) {
                        FInicio = anioEnCurso + '/01/01';
                        FFin = arrayDeAnios[i] + '-09-30';
                        result = this.obtenerDiasXAnio(region, FInicio, FFin) + 1;
                    } else {
                        FInicio = anioEnCurso + '/01/01';
                        FFin = arrayDeAnios[i] + '-12-31';
                        result = this.obtenerDiasXAnio(region, FInicio, FFin) + 1;
                    }
                }
                resultadoDays += result;
            }
            return resultadoDays;
        },

        obtenerDiasXAnio(region, FInicio, FFin) {
            let preFechaLimite = '';
            if (region === 2) {
                // Costa: ya viene la fecha límite directa
                preFechaLimite = FFin;
            } else {
                // Sierra: hasta 31 de diciembre del año indicado
                preFechaLimite = FFin + '-12-31';
            }
            const fechaInicio = new Date(FInicio);
            const fechaFin_ = new Date(preFechaLimite);
            const diff = fechaFin_.getTime() - fechaInicio.getTime();
            return Math.round(diff / (1000 * 3600 * 24));
        },

        generarArrayDeAnios(inicio, fin) {
            const arr = [];
            const start = parseInt(inicio);
            const end = parseInt(fin);
            for (let i = start; i <= end; i++) arr.push(i);
            return arr;
        },

        /**
         * Formatea la fecha del contrato como "17 de marzo de 2026"
         */
        getFechaContrato(fechaStr) {
            if (!fechaStr) return '';
            const fecha = fechaStr.substring(0, 10);
            const day = moment(fecha).format('D');
            const mes = moment(fecha).format('MMMM');
            const year = moment(fecha).format('YYYY');
            return `${day} de ${mes} de ${year}`;
        },

        /**
         * Formatea número con dos decimales y separador de miles (ej: 2,546.85)
         */
        formatDecimal(numero) {
            if (numero === null || numero === undefined) return '0.00';
            return parseFloat(numero).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },

        /**
         * Convierte un número a su representación en letras en español
         * (portada de exportPagare.vue)
         */
        numeroALetras(numero) {
            let parteEntera = Math.floor(numero);
            let parteDecimal = Math.round((numero - parteEntera) * 100);

            const unidades = ['', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
            const especiales = ['', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
            const decenas = ['', 'diez', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
            const centenas = ['', 'ciento', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

            const convertirNumero = (num) => {
                if (num === 0) return 'cero';
                if (num < 0) return 'menos ' + convertirNumero(Math.abs(num));

                let palabras = [];
                let indiceBloque = 0;

                while (num > 0) {
                    let bloque = num % 1000;
                    if (bloque !== 0) {
                        let palabrasBloque = [];
                        let centenasBloque = Math.floor(bloque / 100);
                        let decenasBloque = bloque % 100;
                        let unidadesBloque = bloque % 10;
                        let decenasNum = Math.floor(decenasBloque / 10);

                        if (centenasBloque === 1 && decenasBloque === 0 && unidadesBloque === 0) {
                            palabrasBloque.push('cien');
                        } else if (centenasBloque !== 0) {
                            palabrasBloque.push(centenas[centenasBloque]);
                        }

                        if (decenasBloque >= 11 && decenasBloque <= 19) {
                            palabrasBloque.push(especiales[decenasBloque - 10]);
                        } else if (decenasBloque === 10) {
                            palabrasBloque.push('diez');
                        } else if (decenasBloque >= 20 && decenasBloque <= 29) {
                            if (unidadesBloque === 0) {
                                palabrasBloque.push('veinte');
                            } else {
                                palabrasBloque.push('veinti' + unidades[unidadesBloque]);
                            }
                        } else {
                            if (decenasNum > 0) palabrasBloque.push(decenas[decenasNum]);
                            if (unidadesBloque !== 0 && decenasNum > 0) {
                                palabrasBloque.push('y');
                                palabrasBloque.push(unidades[unidadesBloque]);
                            } else if (unidadesBloque !== 0 && decenasNum === 0) {
                                palabrasBloque.push(unidades[unidadesBloque]);
                            }
                        }

                        if (indiceBloque === 1) {
                            if (bloque === 1) {
                                palabrasBloque = ['mil'];
                            } else {
                                palabrasBloque.push('mil');
                            }
                        } else if (indiceBloque === 2) {
                            if (bloque === 1) {
                                palabrasBloque.push('millón');
                            } else {
                                palabrasBloque.push('millones');
                            }
                        }

                        palabras.push(palabrasBloque.join(' '));
                    }
                    indiceBloque++;
                    num = Math.floor(num / 1000);
                }
                return palabras.reverse().join(' ').trim();
            };

            let resultado = convertirNumero(parteEntera);
            if (parteDecimal > 0) resultado += ' con ' + parteDecimal + '/100';
            return resultado;
        },
    },
};
</script>

<!-- Estilos para los contenidos de Quill Editor / html guardado -->
<style>
.pagare-print-wrapper {
  font-family: Arial, sans-serif;
  font-size: 11px;
  padding: 20px 30px;
  color: #111;
  background: #fff;
}

/* Respetar clases de Quill Editor */
.pagare-contenido-libre.ql-editor {
  font-family: Arial, sans-serif;
  font-size: 11px;
  line-height: 1.7;
  color: #111;
  padding: 0;
}

/* Alineaciones de Quill */
.pagare-contenido-libre .ql-align-center  { text-align: center !important; }
.pagare-contenido-libre .ql-align-right   { text-align: right  !important; }
.pagare-contenido-libre .ql-align-justify { text-align: justify !important; }

/* Párrafos */
.pagare-contenido-libre p {
  margin: 0 0 3px 0 !important;
  padding: 0 !important;
  text-align: inherit;
}

/* Quitar fondo de los highlights de variables (ya sustituidas) */
.pagare-contenido-libre strong[style*="background-color"],
.pagare-contenido-libre span[style*="background-color"] {
  background-color: transparent !important;
  color: inherit !important;
}

/* Loader ring */
.loader-ring {
  width: 36px;
  height: 36px;
  border: 4px solid #e2e8f0;
  border-top-color: #3182ce;
  border-radius: 50%;
  animation: spin-pagare 0.8s linear infinite;
}
@keyframes spin-pagare {
  to { transform: rotate(360deg); }
}

@media print {
  .pagare-contenido-libre p { page-break-inside: avoid; }
}
</style>
