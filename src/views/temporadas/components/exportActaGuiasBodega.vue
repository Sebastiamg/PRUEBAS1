<template>
    <div>
        <div align="center">
            <!-- Parametros Imprimir: 1.-Tamaño general del texto, 2.- Nombre del archivo, 3.- Tamaño del borde td, 4.- Nombre Marca Agua-->
            <vs-button @click="m_imprimirTodos('12px',nombrearchivo,'0px')">Imprimir</vs-button>
        </div>
        <vx-card id="seccionImprimir2">
            <table style="width: 100%;">
                <tr>
                    <td style="width: 25%; vertical-align: top;">
                        <img :src="imagenEmpresa" alt="logo" width="150" style="max-height: 150px;">
                    </td>
                    <td style="width: 50%; text-align: center;">
                        <h5 class="font-bold" style="margin: 0; font-size: 16px;">ACTA DE ENTREGA</h5>
                        <h5 class="font-bold mt-2" style="margin-top: 10px; font-size: 16px;">BODEGA</h5>
                    </td>
                    <td style="width: 25%; text-align: right; vertical-align: top;">
                        <h6 class="font-bold mt-4" style="margin-top: 20px; font-size: 15px">{{ pedido.ven_codigo }}</h6>
                    </td>
                </tr>
            </table>

            <table style="width: 100%; margin-top: 10px;">
                <tr>
                    <td style="width: 70%;">
                        <p class="letra2">Quito, {{ mesd }}, {{ day }} de {{ mes }} del {{ year }}</p>
                    </td>
                    <td style="width: 30%; text-align: left;">
                        <p class="letra2 font-bold">Ref:</p>
                    </td>
                </tr>
            </table>
            <br>
            <table style="width: 100%;">
                <tr>
                    <td style="width: 30%;">
                        <b>RESPONSABLE:</b>
                    </td>
                    <td style="width: 70%;">
                        <p>{{ pedido.asesor.toUpperCase() }}</p>
                    </td>
                </tr>
                <tr>
                    <td style="width: 30%;">
                        <b>CI:</b>
                    </td>
                    <td style="width: 70%;">
                        <p>{{ pedido.cedula }}</p>
                    </td>
                </tr>
            </table>
            <br>
            <p class="sp25 letra2" style="text-align: justify;">
                Con esta fecha, se procede a la suscripción de la presente Acta de Entrega - Recepción de los productos que se otorgan en calidad de
                <b>OBSEQUIOS SIN COSTO,</b> como parte de la PROMOCIÓN DE VENTAS.
            </p>
            <br>
            <div align="center">
                <table class="table tabla2 mi-clase-de-tabla" align="center" style="border-collapse: collapse; font-size: 14px;">
                    <thead align="center">
                        <tr>
                            <td style="border: 1px solid gray;" width="300"><b>Cantidad</b></td>
                            <td style="border: 1px solid gray;" width="700"><b>Nombre</b></td>
                            <td width="700" style="text-align: center; border: 1px solid gray;"><b>Código</b></td>
                        </tr>
                    </thead>
                    <tbody v-for="(tr, key) in arregloLibros" :key="key">
                        <tr>
                            <td style="text-align: center; border: 1px solid gray;">
                                <p class="mr-3">{{ tr.valor - tr.cantidad_pendiente_especifico }}</p>
                            </td>
                            <td style="text-align: center; border: 1px solid gray;">
                                <p>GUIA {{ tr.nombrelibro.toUpperCase() }}</p>
                            </td>
                            <td style="text-align: center; border: 1px solid gray;">
                                G{{ tr.codigo_liquidacion }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <table style="width: 100%; margin-top: 30px; text-align: center;">
                <tr>
                    <td style="width: 50%;">
                        <p class="font-bold">ENTREGUÉ CONFORME</p>
                    </td>
                    <td style="width: 50%;">
                        <p class="font-bold">RECIBÍ CONFORME</p>
                    </td>
                </tr>
            </table>
            <table style="width: 100%; margin-top: 90px; text-align: center;">
                <tr>
                    <td style="width: 50%;">
                        <p class="font-bold">BODEGA</p>
                    </td>
                    <td style="width: 50%;">
                        <p>{{ pedido.asesor.toUpperCase() }}</p>
                        <p class="font-bold">VENDEDOR</p>
                    </td>
                </tr>
            </table>
            <div id="ultimo-elemento" style="font-size: 10px; text-align: left;">
                <p v-if="pedido.facturador !=null">Por: {{ pedido.facturador.toUpperCase() }}</p>
            </div>
        </vx-card>
        <!-- <div class="w-full p-2 bg-gray-400 text-center">
             <vs-button color="primary" @click="imprimirEval()" type="border">Imprimir</vs-button>
         </div> -->
    </div>
    </template>

    <script>
    import moment from "moment";
    import html2pdf from "html2pdf.js"
    import imprimirMixin from "@/mixins/Pedidosmix";
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
                imagenEmpresa: '',
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
            me.day = moment().format('DD');
            me.mes = moment().format('MMMM');
            me.mesd = moment().format('dddd');
            me.year = moment().format('YYYY')
            me.fecha = me.day + '-' + me.mes.substring(0, 3) + '-' + me.year
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
            setTimeout((e) => {
                me.getDatosEmpresa()
            }, 1000)
        },
        methods: {
            getDatosEmpresa() {
                let me = this
                me.$http.get(me.$server_url + 'empresa')
                    .then(res => {
                        me.empresa = res.data.filter(p => p.id == me.pedido.empresa_id)
                        if (me.empresa.length == 0) {
                            me.$vs.notify({
                                text: "No se ha configurado la empresa",
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                                time: 2000
                            })
                            return
                        }
                        me.imagenEmpresa = me.empresa[0].img_base64
                        me.getLibros()
                    })
                    .catch((e) => {
                        console.log(e)
                    })
            },
            //funcion para obtener el dia de 365
            getDay() {
                const hoy = new Date(); // Crear una instancia del objeto Date
                const año = hoy.getFullYear(); // Obtener el año actual
                const diaDelAño = Math.ceil((hoy - new Date(año, 0, 1)) / 86400000); // Obtener el número del día del año actual (86400000 = número de milisegundos en un día)
                return diaDelAño;
                //console.log("Hoy es el día número " + diaDelAño + " del año " + año); // Mostrar el número del día del año actual en la consola
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
                        // me.$vs.notify({
                        //     text: "Espere mientras se va generando el archivo...",
                        //     color: 'primary',
                        //     iconPack: 'feather',
                        //     icon: 'icon-file',
                        //     time: 3000
                        // })
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
