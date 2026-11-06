<template>
<div>
    <!-- ── Botones de acción ── -->
    <div style="display:flex; justify-content:center; margin: 16px 0; gap: 12px; flex-direction: column; align-items: center;">
        <div style="display:flex; justify-content:center; gap: 12px;">
            <vs-button v-if="datosConvenio && String(datosConvenio.cdp_estado) !== '2'" color="dark" type="line" icon-pack="feather" icon="icon-printer" :disabled="!reporteListo" @click="imprimirPDF()">
                Imprimir / Descargar PDF
            </vs-button>
            <vs-button v-if="datosConvenio && String(datosConvenio.cdp_estado) === '2'" color="dark" type="line" icon-pack="feather" icon="icon-printer" :disabled="!reporteListo" @click="imprimirAnulado()">
                Imprimir / Descargar PDF
            </vs-button>
            <vs-button color="danger" type="line" @click="getCancelar()">Cerrar</vs-button>
        </div>
    </div>

    <!-- ── Cargando ── -->
    <div v-if="!reporteListo" style="text-align:center; padding:60px; color:#aaa;">
        <div class="loader-ring" style="margin: 0 auto 16px;"></div>
        <p>Cargando datos del convenio...</p>
    </div>

    <!-- ══ CONTENIDO IMPRIMIBLE ══ -->
    <div id="seccionImprimir2" v-if="reporteListo">
        <div class="convenio-print-wrap">
            <!-- Contenido HTML del formato con variables ya sustituidas (incluye estilos inline inyectados dinámicamente) -->
            <div class="convenio-contenido-libre" v-html="contenidoFinal"></div>
        </div>
    </div>
</div>
</template>

<script>
import moment from 'moment';
// Mixin con cabecera, pie de página y marca de agua corporativa (imágenes).
// Para volver a imprimir sin encabezados cambia al Pedidosmix.js original.
import imprimirMixin from "@/mixins/ImprimirConEncabezadoMix.js";

export default {
    mixins: [imprimirMixin],

    props: {
        cdp_id: {
            type: [Number, String],
            default: null,
        },
        aniosAnteriorSelect: {
            type: [String, Number],
            default: '',
        },
    },

    data() {
        return {
            datosConvenio: null,
            reporteListo: false,
            contenidoFinal: '',
            nombreArchivo: 'Convenio.pdf',
            yearActual: new Date().getFullYear(),
            arregloLibros: [],
            arregloAreas: [],
            letraBachillerato: 'BG',
        };
    },

    mounted() {
        moment.locale('es');
        this.cargarDatos();
    },

    methods: {
        // ─── Paso 1+2+3: datos convenio → libros → renderizar ─────────
        async cargarDatos() {
            let me = this;
            try {
                const res = await me.$http.get(
                    me.$server_url + `VerifcarMetodosGet_Convenio_Documento_Pedido?action=Get_DatosConvenio_ParaReporte&cdp_id=${me.cdp_id}`
                );
                const d = res.data;
                if (!d || !d.cdp_id) {
                    me.$vs.notify({ title: 'Error', text: 'No se encontraron datos del convenio.', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
                    return;
                }
                me.datosConvenio = d;
                me.nombreArchivo = `Convenio-${d.cdp_codigo || d.cdp_id}.pdf`;
                // Paso 2: libros y áreas del pedido (para @TABLA_DE_COMPONENTES y @TABLA_ECONOMICA)
                await me.cargarDatosLibros(d.id_pedido, d.id_periodo);
                // Paso 3: sustituir variables y mostrar
                me.contenidoFinal = me.sustituirVariables(d);
                me.reporteListo = true;
                me.$nextTick(() => {
                    me.ajustarEspaciadoFirmas();
                });
            } catch (err) {
                console.error('Error cargando convenio:', err);
                me.$vs.notify({ title: 'Error', text: 'Error al cargar los datos del convenio.', color: 'danger', iconPack: 'feather', icon: 'icon-x' });
            }
        },

        // ─── Carga libros/áreas desde el pedido ───────────────────────
        async cargarDatosLibros(id_pedido, id_periodo) {
            let me = this;
            if (!id_pedido) return;
            const endpoint = (parseInt(id_periodo) > 26)
                ? `get_val_pedidoInfoTodo_new/${id_pedido}`
                : `get_val_pedidoInfoTodo/${id_pedido}`;
            try {
                const res = await me.$http.get(me.$server_url + endpoint);
                const datos2 = (res.data || []).filter(p => p.valor > 0);
                if (!datos2.length) return;
                me.arregloLibros = me.procesarLibros(datos2);
                me.arregloAreas  = me.renderAreas(me.arregloLibros);
            } catch (e) {
                console.error('Error cargando libros:', e);
            }
        },

        // ─── Procesa libros: suma por idlibro, quita duplicados ───────
        procesarLibros(datos2) {
            const sumaValores = datos2.reduce((acc, v) => {
                acc[v.idlibro] = (acc[v.idlibro] || 0) + v.valor;
                return acc;
            }, {});
            let hash = {};
            const unico = datos2.filter(o => hash[o.nombrelibro] ? false : (hash[o.nombrelibro] = true));
            const arr = unico.map(el => ({
                serieArea: el.serieArea, idlibro: el.idlibro, anio: el.anio,
                version: el.version, nombrelibro: el.nombrelibro,
                precio: el.precio, valor: sumaValores[el.idlibro] || el.valor,
            }));
            return arr.sort((a, b) => {
                const na = a.nombrelibro.toLowerCase().replace(/\d+$/, '');
                const nb = b.nombrelibro.toLowerCase().replace(/\d+$/, '');
                return na < nb ? -1 : na > nb ? 1 : 0;
            });
        },

        // ─── Genera arregloAreas (igual que renderAreas de exportConvenio) ─
        renderAreas(tr) {
            let me = this;
            let hash = {};
            let unico = tr.map(el => ({ serieArea: el.serieArea }))
                         .filter(o => hash[o.serieArea] ? false : (hash[o.serieArea] = true));
            unico = unico.map(p => { p.valores = tr.filter(s => s.serieArea === p.serieArea); return p; });
            return unico.map(el => ({
                serieArea: el.serieArea,
                inicial1: el.valores.filter(p => [115, 658, 662].includes(p.idlibro)),
                inicial2: el.valores.filter(p => [114, 529, 663].includes(p.idlibro)),
                uno:    el.valores.filter(p => p.anio == 1 && !p.version && ![115,658,662].includes(p.idlibro)),
                dos:    el.valores.filter(p => p.anio == 2 && !p.version && ![114,529,663].includes(p.idlibro)),
                tres:   el.valores.filter(p => p.anio == 3  && !p.version),
                cuatro: el.valores.filter(p => p.anio == 4  && !p.version),
                cinco:  el.valores.filter(p => p.anio == 5  && !p.version),
                seis:   el.valores.filter(p => p.anio == 6  && !p.version),
                siete:  el.valores.filter(p => p.anio == 7  && !p.version),
                ocho:   el.valores.filter(p => p.anio == 8  && !p.version),
                nueve:  el.valores.filter(p => p.anio == 9  && !p.version),
                diez:   el.valores.filter(p => p.anio == 10 && !p.version),
                bgu1:   el.valores.filter(p => p.anio == 1  && p.version === me.letraBachillerato),
                bgu2:   el.valores.filter(p => p.anio == 2  && p.version === me.letraBachillerato),
                bgu3:   el.valores.filter(p => p.anio == 3  && p.version === me.letraBachillerato),
            })).sort((a, b) => a.serieArea < b.serieArea ? 1 : a.serieArea > b.serieArea ? -1 : 0);
        },

        // ─── Genera HTML para @TABLA_DE_COMPONENTES ──────────────────
        generarTablaComponentes(fontSize = '9.5px') {
            const LB = this.letraBachillerato;
            const fontStyle = 'font-family:Cambria,Georgia,serif;';
            let html = `
                <table style="width:95%; border-collapse: collapse; margin-top:15px; border: 1px solid black; font-size: ${fontSize} !important; ${fontStyle}">
                <thead>
                    <tr>
                        <td width="300" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}">Áreas</td>
                        <td width="100" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>Inicial 1</b></td>
                        <td width="100" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>Inicial 2</b></td>
                        <td width="80" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>1</b></td>
                        <td width="80" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>2</b></td>
                        <td width="80" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>3</b></td>
                        <td width="80" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>4</b></td>
                        <td width="80" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>5</b></td>
                        <td width="80" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>6</b></td>
                        <td width="80" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>7</b></td>
                        <td width="80" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>8</b></td>
                        <td width="80" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>9</b></td>
                        <td width="80" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>10</b></td>
                        <td width="100" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>1${LB}</b></td>
                        <td width="100" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>2${LB}</b></td>
                        <td width="100" style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}"><b>3${LB}</b></td>
                    </tr>
                </thead>
                <tbody>`;
            this.arregloAreas.forEach(tr => {
                const ck = arr => arr.length > 0 ? '&#10004;' : '';
                html += `
                    <tr>
                        <td style="border:1px solid black; font-size:0.9em; text-align:left; padding:4px; font-weight:bold; ${fontStyle}">
                            ${tr.serieArea.charAt(0).toUpperCase() + tr.serieArea.slice(1)}
                        </td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.inicial1)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.inicial2)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.uno)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.dos)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.tres)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.cuatro)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.cinco)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.seis)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.siete)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.ocho)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.nueve)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.diez)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.bgu1)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.bgu2)}</td>
                        <td style="border:1px solid black; text-align:center; padding:4px; ${fontStyle}">${ck(tr.bgu3)}</td>
                    </tr>`;
            });
            html += `</tbody></table>`;
            return html;
        },

        // ─── Genera HTML para @TABLA_ECONOMICA ───────────────────────
        generarTablaEconomica(fontSize = '9.5px') {
            const fontStyle = 'font-family:Cambria,Georgia,serif;';
            let html = `
                <table style="width:90%; border-collapse: collapse; margin-top:15px; border: 1px solid black; font-size: ${fontSize} !important; ${fontStyle}">
                <thead>
                    <tr>
                        <td style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; width:45%; ${fontStyle}">
                            <b>LIBRO</b>
                        </td>
                        <td style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}">
                            <b>PRECIO</b>
                        </td>
                        <td style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}">
                            <b>CANTIDAD</b>
                        </td>
                        <td style="border:1px solid black; font-weight:bold; text-align:center; padding:6px; background-color:#f0f0f0; ${fontStyle}">
                            <b>SUBTOTAL</b>
                        </td>
                    </tr>
                </thead>
                <tbody>`;
            let granTotal = 0;
            this.arregloLibros.forEach(tr => {
                const precio = parseFloat(tr.precio) || 0;
                const cantidad = parseFloat(tr.valor) || 0;
                const subtotal = precio * cantidad;
                granTotal += subtotal;
                html += `
                    <tr>
                        <td style="border:1px solid black; text-align:left; padding:6px; ${fontStyle}">
                            ${tr.nombrelibro}
                        </td>
                        <td style="border:1px solid black; text-align:center; padding:6px; ${fontStyle}">
                            $${precio.toFixed(2)}
                        </td>
                        <td style="border:1px solid black; text-align:center; padding:6px; ${fontStyle}">
                            ${cantidad}
                        </td>
                        <td style="border:1px solid black; text-align:center; padding:6px; ${fontStyle}">
                            $${subtotal.toFixed(2)}
                        </td>
                    </tr>`;
            });
            html += `
                    <tr>
                        <td colspan="3" style="border:1px solid black; text-align:right; padding:8px; font-weight:bold; background-color:#f0f0f0; ${fontStyle}">
                            <b>TOTAL:</b>
                        </td>
                        <td style="border:1px solid black; text-align:center; padding:8px; font-weight:bold; background-color:#f0f0f0; ${fontStyle}">
                            $${granTotal.toFixed(2)}
                        </td>
                    </tr>`;
            html += `</tbody></table>`;
            return html;
        },

        // ─── "2026-2027, 2027-2028" ───────────────────────────────────
        generarPeriodosLectivos(anioInicio, anioFin) {
            anioInicio = parseInt(anioInicio);
            anioFin    = parseInt(anioFin);
            const periodos = [];
            for (let i = anioInicio; i < anioFin; i++) {
                periodos.push(`${i}-${i + 1}`);
            }
            if (periodos.length <= 1) return periodos.join('');
            return periodos.slice(0, -1).join(', ') + ' y ' + periodos.at(-1);
        },

        // ─── "dos (2) años lectivos" / "un (1) año lectivo" ──────────
        aniosConvenioLetras(n) {
            n = parseInt(n);
            const pal = ['', 'un', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez'];
            const letra = (n > 0 && n <= 10) ? pal[n] : String(n);
            return `${letra} (${n}) ${n === 1 ? 'año lectivo' : 'años lectivos'}`;
        },

        // ─── "09 días del mes de enero de 2026" ─────────────────────
        formatFechaLarga(fechaStr) {
            if (!fechaStr) return '';
            const f   = String(fechaStr).substring(0, 10);
            const dia = String(new Date(f.replace(/-/g, '/')).getDate()).padStart(2, '0');
            const mes = moment(f).format('MMMM');
            const anio = moment(f).format('YYYY');
            return `${dia} días del mes de ${mes} de ${anio}`;
        },

        // ─── Sustituye variables @XXXX del formato HTML ───────────────
        sustituirVariables(d) {
            if (!d.cof_contenido) return '<p>El formato no tiene contenido.</p>';

            let html = d.cof_contenido;

            let fontSizeComponentes = '9.5px';
            let fontSizeEconomica = '9.5px';

            // Marcar la tabla de firmas y detectar el font-size de los placeholders de tablas
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // 1. Marcar tabla de firmas
                const tables = doc.querySelectorAll('table');
                tables.forEach(table => {
                    const hasPlaceholder = table.innerHTML.includes('@NOMBRES_APELLIDOS_BENEFICIARIO');
                    const hasNestedTables = table.querySelectorAll('table').length > 0;
                    if (hasPlaceholder && !hasNestedTables) {
                        table.classList.add('tabla-firmas-beneficiario');
                    }
                });

                // Helper para buscar el elemento padre que contiene el texto del placeholder
                const buscarElementoConTexto = (root, text) => {
                    const walker = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT, null, false);
                    let node;
                    while (node = walker.nextNode()) {
                        if (node.nodeValue.includes(text)) {
                            return node.parentElement;
                        }
                    }
                    return null;
                };

                // 2. Obtener font-size para @TABLA_DE_COMPONENTES
                const parentComp = buscarElementoConTexto(doc.body, '@TABLA_DE_COMPONENTES');
                if (parentComp) {
                    let current = parentComp;
                    while (current && current !== doc.body) {
                        if (current.style && current.style.fontSize) {
                            fontSizeComponentes = current.style.fontSize;
                            break;
                        }
                        current = current.parentElement;
                    }
                }

                // 3. Obtener font-size para @TABLA_ECONOMICA
                const parentEco = buscarElementoConTexto(doc.body, '@TABLA_ECONOMICA');
                if (parentEco) {
                    let current = parentEco;
                    while (current && current !== doc.body) {
                        if (current.style && current.style.fontSize) {
                            fontSizeEconomica = current.style.fontSize;
                            break;
                        }
                        current = current.parentElement;
                    }
                }

                html = doc.body.innerHTML;
            } catch (e) {
                console.error('Error al procesar el formato HTML:', e);
            }

            // Limpieza suave de &nbsp; (solo los convierte a espacio normal, sin limitar cantidad)
            // html = this.limpiarNbsp(html);

            const anioInicio = parseInt(d.cdp_anio_comienza || this.yearActual);
            const anioFin    = parseInt(d.cdp_anio_termina    || this.yearActual);
            const totalAnios = anioFin - anioInicio;

            const vars = {
                '@NUMERO_DE_SECUENCIA': d.cdp_codigo || '',
                '@FECHA_ACTUAL': this.formatFechaLarga(d.convenio_fecha_creacion),
                '@NOMBRE_UNIDAD_EDUCATIVA': (d.institucion_nombre || '').toUpperCase(),
                '@NOMBRES_APELLIDOS_BENEFICIARIO': (d.beneficiario_nombres || '').toUpperCase(),
                '@CEDULA_BENEFICIARIO': d.beneficiario_cedula || '',
                '@DIRECCION_UNIDAD_EDUCATIVA': d.institucion_direccion || '',
                '@TELEFONO_UNIDAD_EDUCATIVA': d.institucion_telefono || '',
                '@CORREO_UNIDAD_EDUCATIVA': d.beneficiario_correo || '',
                '@CIUDAD_UNIDAD_EDUCATIVA': (d.ciudad_nombre || '').toUpperCase(),
                '@PERIODOS_LECTIVOS': this.generarPeriodosLectivos(anioInicio, anioFin),
                '@ANIOS_CONVENIO_NUMERO_LETRAS': this.aniosConvenioLetras(totalAnios),
                '@TABLA_DE_COMPONENTES': this.generarTablaComponentes(fontSizeComponentes),
                '@TABLA_ECONOMICA': this.generarTablaEconomica(fontSizeEconomica),
            };

            // ── PASO 1: Sustituir variables primero ──
            Object.keys(vars).sort((a, b) => b.length - a.length)
                .forEach(key => { html = html.split(key).join(vars[key]); });

            // ── PASO 2: Aplicar text-transform DESPUÉS de sustituir variables ──
            // Ahora el texto real (ej: "JUAN CARLOS MEDINA") ya está en el HTML
            // y podemos transformarlo correctamente según el span padre.
            try {
                const parserTT = new DOMParser();
                const docTT = parserTT.parseFromString(html, 'text/html');
                const spansConTransform = docTT.querySelectorAll('span[style*="text-transform"]');

                function aplicarTransformTexto(texto, transform) {
                    if (transform === 'uppercase') return texto.toUpperCase();
                    if (transform === 'lowercase') return texto.toLowerCase();
                    if (transform === 'capitalize') {
                        return texto.toLowerCase().replace(/(?:^|\s|[-/])\S/g, function(c) { return c.toUpperCase(); });
                    }
                    return texto;
                }

                spansConTransform.forEach(function(span) {
                    const transform = span.style.textTransform;
                    if (!transform || transform === 'none') return;

                    const walkerTT = docTT.createTreeWalker(span, NodeFilter.SHOW_TEXT, null, false);
                    const textNodesToProcess = [];
                    let tNode;
                    // Recopilar primero para no mutar durante el recorrido
                    while ((tNode = walkerTT.nextNode())) {
                        textNodesToProcess.push(tNode);
                    }
                    textNodesToProcess.forEach(function(tn) {
                        tn.nodeValue = aplicarTransformTexto(tn.nodeValue, transform);
                    });

                    // Quitar el text-transform ya que se aplicó de forma real
                    span.style.removeProperty('text-transform');
                });

                html = docTT.body.innerHTML;
            } catch (e) {
                console.error('Error aplicando text-transform:', e);
            }

            const estilosImpresion = `
        <style>
            /*
             * NOTA: @page NO se define aquí.
             * ImprimirConEncabezadoMix.js controla todo el layout de página:
             * márgenes, cabecera y pie de página. Solo ajusta los estilos
             * del CONTENIDO en este bloque (fuentes, clases, etc.).
             */
            @media print {

            .convenio-contenido-libre {
                font-size: 9.5px !important;           /* ← TAMAÑO GENERAL DEL TEXTO */
            }

            .convenio-contenido-libre * {
                line-height: 1.48 !important;
            }

            /* Los elementos con font-family inline (del CKEditor o de las tablas generadas)
               tienen prioridad automáticamente al no haber !important en el wildcard */

            .convenio-contenido-libre p {
                margin: 0.188px 0 0.25px 0 !important;        /* ← Espacio entre párrafos */
            }

            /* ================================================ */
            /* === CONTROL DEL ESPACIO GENERADO POR &nbsp; === */
            /* ================================================ */
            .convenio-contenido-libre {
                word-spacing: 0.45px !important;       /* ← ESTA ES LA LÍNEA MÁS IMPORTANTE PARA CONTROLAR EL TAMAÑO VISUAL DE LOS ESPACIOS (&nbsp;) */
                letter-spacing: 0.03px !important;     /* ← Ajuste fino entre letras */
            }

            /* Tablas centradas y herencia de tamaño de letra */
            .convenio-contenido-libre table {
                margin-left: auto !important;
                margin-right: auto !important;
                display: table !important;
                font-size: inherit;
            }

            /* Evitar salto de página dentro de la tabla de firmas del beneficiario */
            .convenio-contenido-libre table.tabla-firmas-beneficiario {
                page-break-inside: avoid !important;
                break-inside: avoid !important;
            }

            /* Tabla de firmas: cero espaciado vertical, todo apegado */
            .convenio-contenido-libre table.tabla-firmas-beneficiario,
            .convenio-contenido-libre table.tabla-firmas-beneficiario td,
            .convenio-contenido-libre table.tabla-firmas-beneficiario th,
            .convenio-contenido-libre table.tabla-firmas-beneficiario p,
            .convenio-contenido-libre table.tabla-firmas-beneficiario span,
            .convenio-contenido-libre table.tabla-firmas-beneficiario div {
                margin: 0 !important;
                padding: 0 !important;
                line-height: 1.2 !important;
                word-spacing: normal !important;
                letter-spacing: normal !important;
            }

            .convenio-contenido-libre td,
            .convenio-contenido-libre th {
                font-size: inherit;
            }

            .convenio-contenido-libre h1 { font-size: 13px !important; }
            .convenio-contenido-libre h2 { font-size: 12px !important; }
            .convenio-contenido-libre h3 { font-size: 10.5px !important; }
            }
        </style>`;

            return estilosImpresion + html;
        },

        // ==================== NUEVA FUNCIÓN DE LIMPIEZA ====================
        limpiarNbsp(html) {
            if (!html) return '';

            let clean = html;

            // Solo convertimos &nbsp; a espacio normal (NO limitamos la cantidad de espacios)
            clean = clean.replace(/&nbsp;/g, ' ');

            // Limpiamos solo espacios innecesarios al inicio y final de párrafos
            clean = clean.replace(/<p>\s+/gi, '<p>');
            clean = clean.replace(/\s+<\/p>/gi, '</p>');

            clean = clean.replace(/<p>\s*<\/p>/gi, '');

            return clean.trim();
        },

        imprimirPDF() {
            this.ajustarEspaciadoFirmas();
            this.m_imprimirTodos('11px', this.nombreArchivo, '0px', '', 'portrait');
        },

        imprimirAnulado() {
            this.ajustarEspaciadoFirmas();
            this.m_imprimirTodos('11px', this.nombreArchivo, '0px', 'ANULADO', 'portrait');
        },

        ajustarEspaciadoFirmas() {
            const container = document.getElementById('seccionImprimir2');
            if (!container) return;

            // Buscar la tabla de firmas identificada previamente por contener @NOMBRES_APELLIDOS_BENEFICIARIO
            const tablaFirmas = container.querySelector('table.tabla-firmas-beneficiario');

            if (!tablaFirmas) return;

            // Eliminar cualquier espaciador anterior si existe
            const anterior = container.querySelector('.espaciador-firmas-dinamico');
            if (anterior) {
                anterior.remove();
            }

            // Calcular posición
            const containerRect = container.getBoundingClientRect();
            const tableRect = tablaFirmas.getBoundingClientRect();
            const relativeOffsetTop = tableRect.top - containerRect.top;

            // Altura de página útil estimada para impresión A4/Letter (~1000px a 1040px)
            const pageHeight = 1010; 
            const positionInPage = relativeOffsetTop % pageHeight;

            // Si la tabla inicia al principio de una hoja (por ejemplo, en los primeros 65px de la página)
            if (positionInPage >= 0 && positionInPage < 65) {
                const spacer = document.createElement('div');
                spacer.className = 'espaciador-firmas-dinamico';
                spacer.style.height = '50px'; // Altura equivalente a dos saltos de línea (br)
                tablaFirmas.parentNode.insertBefore(spacer, tablaFirmas);
            }
        },

        getCancelar() {
            this.$emit('change', { verificacionemitimprimir: 2 });
        },
    },
};
</script>

<!-- Estilos para contenido generado por CKEditor -->
<style>
/* ── Wrapper de impresión ── */
.convenio-print-wrap {
  padding: 15px 25px;
  background: #fff;
}

/* ── Contenedor del HTML de CKEditor ── */
.convenio-contenido-libre {
  font-family: Cambria, Georgia, serif;
  font-size: 9.5px !important;
  line-height: 1.6;
  color: #111;
}

/* Párrafos */
.convenio-contenido-libre p {
  margin: 0 0 5px 0;
  padding: 0;
}

/* Headings */
.convenio-contenido-libre h1,
.convenio-contenido-libre h2,
.convenio-contenido-libre h3 {
  font-family: Cambria, Georgia, serif;
  margin: 6px 0 4px 0;
}

/* Listas */
.convenio-contenido-libre ul,
.convenio-contenido-libre ol {
  margin: 0 0 5px 0;
  padding-left: 20px;
}
.convenio-contenido-libre li {
  margin: 0 0 2px 0;
}

/* Formato inline */
.convenio-contenido-libre strong { font-weight: bold; }
.convenio-contenido-libre em     { font-style: italic; }
.convenio-contenido-libre u      { text-decoration: underline; }

/* Quitar colores de fondo de variables ya sustituidas */
.convenio-contenido-libre *[style*="background-color"] {
  background-color: transparent !important;
  color: inherit !important;
}

/* Tablas generadas por @TABLA_* */
.convenio-contenido-libre table {
  border-collapse: collapse;
  margin: 8px 0;
  font-size: inherit;
}

/* Evitar salto de página dentro de la tabla de firmas del beneficiario */
.convenio-contenido-libre table.tabla-firmas-beneficiario {
  page-break-inside: avoid;
  break-inside: avoid;
}

/* ── Tabla de firmas: cero espaciado vertical, todo apegado ── */
.convenio-contenido-libre table.tabla-firmas-beneficiario,
.convenio-contenido-libre table.tabla-firmas-beneficiario td,
.convenio-contenido-libre table.tabla-firmas-beneficiario th,
.convenio-contenido-libre table.tabla-firmas-beneficiario p,
.convenio-contenido-libre table.tabla-firmas-beneficiario span,
.convenio-contenido-libre table.tabla-firmas-beneficiario div,
.convenio-contenido-libre table.tabla-firmas-beneficiario br + * {
  margin: 0 !important;
  padding: 0 !important;
  line-height: 1.2 !important;
  word-spacing: normal !important;
  letter-spacing: normal !important;
}
.convenio-contenido-libre table td,
.convenio-contenido-libre table th {
  border: 1px solid #ccc;
  padding: 3px 5px;
  font-size: inherit;
  /* text-align se respeta desde el style inline del CKEditor */
}

/* Loader ring */
.loader-ring {
  width: 36px;
  height: 36px;
  border: 4px solid #e2e8f0;
  border-top-color: #3182ce;
  border-radius: 50%;
  animation: spin-convenio 0.8s linear infinite;
}
@keyframes spin-convenio {
  to { transform: rotate(360deg); }
}

@media print {
  .convenio-contenido-libre p { page-break-inside: avoid; }
}
</style>
