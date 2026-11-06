<template>
    <div>
        <div align="center">
            <!-- Parametros Imprimir: 1.-Tamaño general del texto, 2.- Nombre del archivo, 3.- Tamaño del borde td, 4.- Nombre Marca Agua-->
            <vs-button @click="m_imprimirTodos('12px',nombrearchivo,'0px')">Imprimir</vs-button>
        </div>
        <vx-card id="seccionImprimir2" style="padding: 20px;">
            <table style="width: 100%; border-collapse: collapse;">
                <tr>
                    <td colspan="2" class="text-center" style="font-weight: bold; font-size: 18px; text-align: center;">
                        PROMOCIÓN DE VENTAS
                    </td>
                </tr>
                <tr>
                    <td colspan="2" class="text-center" style="font-weight: bold; font-size: 18px; margin-top: 10px; text-align: center;">
                        ACTA DE ENTREGA
                    </td>
                </tr>
                <tr>
                    <td colspan="2" class="text-right" style="font-weight: bold; font-size: 14px; margin-top: -20px; text-align: right;">
                        {{ pedido.ven_codigo }}
                    </td>
                </tr>
                <tr>
                    <td style="width: 70%; font-size: 14px; text-align: left;">
                        Quito, {{ mesd }}, {{ day }} de {{ mes }} del {{ year }}
                    </td>
                    <td class="text-left" style="font-weight: bold; font-size: 14px; text-align: left;">
                        Ref:
                    </td>
                </tr>
            </table>
            <br>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                    <td style="width: 30%; font-weight: bold; text-align: left;">
                        RESPONSABLE:
                    </td>
                    <td style="width: 70%; text-align: left;">
                        {{ pedido.responsable.toUpperCase() }}
                    </td>
                </tr>
                <tr>
                    <td style="width: 30%; font-weight: bold; text-align: left;">
                        CI:
                    </td>
                    <td style="width: 70%; text-align: left;">
                        {{ pedido.cedula }}
                    </td>
                </tr>
            </table>
            <br>
            <p class="sp25" style="font-size: 14px; text-align: justify;">
                Con esta fecha, se procede a la suscripción de la presente Acta de Entrega - Recepción de los productos que se otorgan en calidad de
                <b>OBSEQUIOS SIN COSTO,</b> como parte de la PROMOCIÓN DE VENTAS.
            </p>
            <br>
            <div align="center">
                <table class="table tabla2 mi-clase-de-tabla" align="center" style="border-collapse: collapse; font-size: 14px;">
                    <thead align="center">
                        <tr>
                            <td width="300" style="text-align: center; border: 1px solid gray;"><b>Cantidad</b></td>
                            <td width="700" style="text-align: center; border: 1px solid gray;"><b>Nombre</b></td>
                            <td width="700" style="text-align: center; border: 1px solid gray;"><b>Código</b></td>
                        </tr>
                    </thead>
                    <tbody v-for="(tr, key) in arregloLibros" :key="key">
                        <tr>
                            <td style="text-align: center; border: 1px solid gray;">
                                {{ tr.valor }}
                            </td>
                            <td style="text-align: center; border: 1px solid gray;">
                                GUIA {{ tr.nombrelibro.toUpperCase() }}
                            </td>
                            <td style="text-align: center; border: 1px solid gray;">
                                G{{ tr.codigo_liquidacion }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <br>
            <table style="width: 100%; border-collapse: collapse; margin-top: 30px; text-align: center;">
                <tr>
                    <td style="width: 50%; font-weight: bold;">
                        ENTREGUÉ CONFORME
                    </td>
                    <td style="width: 50%; font-weight: bold;">
                        RECIBÍ CONFORME
                    </td>
                </tr>
            </table>
            <table style="width: 100%; border-collapse: collapse; margin-top: 110px; text-align: center;">
                <tr>
                    <td style="width: 50%; font-weight: bold;">
                        PROLIPA CIA. LTDA
                    </td>
                    <td style="width: 50%;">
                        <p>{{ pedido.responsable.toUpperCase() }}</p>
                        <p style="font-weight: bold;">VENDEDOR</p>
                    </td>
                </tr>
            </table>
            <div id="ultimo-elemento" style="font-size: 10px; margin-top: 10px; text-align: left;">
                <p v-if="pedido.observacion"><b>Observación:</b> {{ pedido.observacion }}</p>
            </div>
            <div id="ultimo-elemento" style="font-size: 10px; margin-top: 10px; text-align: left;">
                <p v-if="pedido.facturador != null">Por: {{ pedido.facturador.toUpperCase() }}</p>
            </div>
        </vx-card>
        <!-- <div class="w-full p-2 bg-gray-400 text-center">
            <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir</vs-button>
        </div> -->
    </div>
    </template>

    <script>
    import moment from "moment";
    import imprimirMixin from "@/mixins/Pedidosmix";
    import html2pdf from "html2pdf.js"
    export default {
        mixins: [imprimirMixin],
        data() {
            return {
                arregloContrato: [],
                arregloLibros: [],
                day: '',
                mes: '',
                mesd: '',
                year: '',
                anio: '',
                fecha: '',
                telefono: '',
                nombrearchivo: '',
                mixinIdInicioFormatoNewData: null,
            }
        },
        props: {
            pedido: {
                type: Array,
                default: {},
            },
        },
        created() {
            let me = this;
            moment.lang("es")
            me.nombrearchivo = me.pedido.ven_codigo + ".pdf"
            // me.contrato = me.$route.params.id
        },
        mounted() {
            let me = this
            // Verifica si los datos existen en localStorage
            const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
            if (mixinData) {
            // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
            const parsedData = JSON.parse(mixinData);
            me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
            console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
            } else {
                console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
            }
            // FIN Verificación si los datos existen en localStorage
            me.getLibros()
        },
        methods: {
            //funcion para obtener el dia de 365
            getDay() {
                const hoy = new Date(); // Crear una instancia del objeto Date
                const año = hoy.getFullYear(); // Obtener el año actual
                const diaDelAño = Math.ceil((hoy - new Date(año, 0, 1)) / 86400000); // Obtener el número del día del año actual (86400000 = número de milisegundos en un día)
                return diaDelAño;
                //console.log("Hoy es el día número " + diaDelAño + " del año " + año); // Mostrar el número del día del año actual en la consola
            },
            getFecha(){
              // let me = this
              // me.day = moment(me.fecha_aprobado_facturacion).format('DD');
              // me.mes = moment(me.fecha_aprobado_facturacion).format('MMMM');
              // me.mesd = moment(me.fecha_aprobado_facturacion).format('dddd');
              // me.year = moment(me.fecha_aprobado_facturacion).format('YYYY')
              // me.fecha = me.day + '-' + me.mes.substring(0, 3) + '-' + me.year
              let me = this;
              me.day = moment(me.fecha_aprobado_facturacion).format('DD'); // Día con dos dígitos
              me.mes = moment(me.fecha_aprobado_facturacion).format('MMMM'); // Nombre completo del mes
              me.mesd = moment(me.fecha_aprobado_facturacion).format('dddd'); // Nombre completo del día de la semana
              me.year = moment(me.fecha_aprobado_facturacion).format('YYYY'); // Año con cuatro dígitos
              me.fecha = me.day + '-' + me.mes.substring(0, 3) + '-' + me.year;
            },
            getLibros(id_pedido) {
                let me = this
                let nuevarutaxperiodo = '';
                if (me.pedido.id_periodo <= me.mixinIdInicioFormatoNewData) {
                    nuevarutaxperiodo = 'get_val_pedidoInfo/'
                }else if (me.pedido.id_periodo > me.mixinIdInicioFormatoNewData) {
                    nuevarutaxperiodo = 'get_val_pedidoInfo_new/'
                }
                me.$vs.loading()
                this.$http.get(this.$server_url + nuevarutaxperiodo + me.pedido.id_pedido)
                    .then(res => {
                        me.$vs.loading.close()
                        let librosNormales = []
                        let libroPlanLector = []
                        let getNormalesOrdenado = []
                        let getPlanLectorOrdenado = []
                        //proceso
                        let datos = res.data
                        if (datos.length == 0) {
                            me.$vs.notify({
                                text: "No se encontraron libros",
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                time: 2000
                            })
                            return
                        }
                        librosNormales = datos.filter(p => p.valor > 0 && p.id_serie != 6)
                        libroPlanLector = datos.filter(p => p.valor > 0 && p.id_serie == 6)
                        getNormalesOrdenado = me.ordenarLibros(librosNormales)
                        getPlanLectorOrdenado = me.ordenarLibros(libroPlanLector)
                        //unir array con spread operator
                        me.arregloLibros = [...getNormalesOrdenado, ...getPlanLectorOrdenado]
                        me.fecha_aprobado_facturacion = res.data[0].fecha_aprobado_facturacion
                        me.getFecha()
                        // setTimeout(function() {me.imprimirEval()}, 1000);
                    })
                    .catch((e) => {
                        me.$vs.loading.close()
                    })
            },
            ordenarLibros(datos) {
                let me = this
                let predatos = []
                let valores = []
                predatos = datos.filter(p => p.valor > 0)
                valores = predatos.sort(function (a, b) {
                    var nombreA = a.nombrelibro.toLowerCase();
                    var nombreB = b.nombrelibro.toLowerCase();
                    var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
                    var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
                    nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
                    nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final
                    if (nombreA < nombreB) {
                        return -1;
                    }
                    if (nombreA > nombreB) {
                        return 1;
                    }
                    if (numA && !numB) { // si a tiene número y b no, b va primero
                        return 1;
                    }
                    if (!numA && numB) { // si b tiene número y a no, a va primero
                        return -1;
                    }
                    if (numA && numB) { // si ambos tienen número, compararlos
                        if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
                            return -1;
                        }
                        if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
                            return 1;
                        }
                        return numA - numB; // comparar los números directamente
                    }
                    return 0; // si son iguales en todo, no hay diferencia
                });
                return valores
            },
            imprimirEval() {
                let me = this
                var element = document.getElementById('seccionImprimir2');
                var opt = {
                    margin: 0.5,
                    // margin:         [1.5, 0.5, 1, 1],
                    filename: me.nombrearchivo,
                    image: {
                        type: 'jpeg',
                        quality: 0.98
                    },
                    html2canvas: {
                        scale: 2
                    },
                    pagebreak: {
                        mode: 'avoid-all',
                        inside: "avoid",
                        before: '#page2el'
                    },
                    // jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
                    jsPDF: {
                        unit: 'in',
                        format: 'letter',
                        orientation: 'portrait'
                    }
                    //jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
                };
                html2pdf().from(element).set(opt).save();
                me.arregloContrato = []
                me.arregloLibros = []
                me.$vs.notify({
                    text: "Archivo descargado correctamente",
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-file',
                    time: 2000
                })
                me.$emit('change', true)
            },
        }
    }
    </script>

    <style scoped>
    .captcha {
        font-size: 9px !important;
    }

    .label_inputs {
        font-size: 12px;
        color: black;
        margin-top: 2px;
        padding-left: 2px;
    }

    @media print {
        .mi-clase-de-tabla td {
            page-break-before: always;
        }
    }

    .tabla1,
    .tabla2 {
        table-layout: auto;
        width: 90%;
        border-collapse: collapse;
        margin: 35px auto;
    }

    .tabla1 td,
    .tabla2 td {
        padding: 5px;
        box-sizing: border-box;
    }

    .table-cell {
        border: 1px solid black;
    }

    .marca-agua {
        position: fixed;
        top: 45%;
        /* Ajusta la posición verticalmente según tus preferencias */
        left: 50%;
        /* Ajusta la posición horizontalmente según tus preferencias */
        transform: translate(-50%, -50%);
        /* Ajusta la rotación según tus preferencias */
        font-size: 48px;
        font-weight: bolder;
        color: rgba(0, 0, 0, 0.1);
        /* Color de la marca de agua (en este caso, gris claro semitransparente) */
        pointer-events: none;
        /* Evita que la marca de agua sea seleccionable o cliqueable */
        z-index: -1000;
        /* Ajusta el z-index para que esté detrás de otros elementos */
    }
    </style>
