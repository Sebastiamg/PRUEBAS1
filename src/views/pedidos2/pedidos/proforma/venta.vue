<template>
<vx-card :title="sendPedido.id_pedido == 0||setPuntos.ca_codigo_agrupado==''  ? 'Crear Pedido':'Informacion #'+id">
    <vs-col vs-type="flex" vs-w="12" class="mt-2 m-3">
        <vs-button type="border" color="primary" class="mr-2" @click="getfactpdf();startLoading()">Exportar PDF</vs-button>
        <vs-button type="border" color="success" class="mr-2" @click="getExcelx();startLoading()">Exportar Excel</vs-button>
        <vs-button type="border" style="border-radius: 45%;" color="primary" class="mr-2" @click="getventas();calculos()" icon="refresh"></vs-button>
    </vs-col>
    <!--POPUP generacion de documentos excel o pdf-->
    <div v-if="popupcarga">
        <FileUploadModal @change="changeHandle" />
    </div>
    <div class="vx-row">
        <vs-table search :data="inputs" no-data-text="No hay datos disponibles">
            <template slot="header">
                <vs-chip color="primary">Cantidad: <b>{{ inputs.length }} </b></vs-chip>
            </template>

            <template slot="thead">
                <vs-th colspan="2" width="200" class="text-center"> # Item </vs-th>
                <vs-th width="300"> Código </vs-th>
                <vs-th width="500"> Descripción </vs-th>
                <vs-th width="200"> Cantidad solicitada </vs-th>
                <vs-th width="200"> Cantidad vendida </vs-th>
                <vs-th width="200"> Descuento </vs-th>
                <vs-th width="200"> Precio </vs-th>
                <vs-th width="200"> Cantidad vendida*Precio </vs-th>
                <vs-th width="200"> total - descuento </vs-th>
            </template>
            <template slot-scope="{ data }">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td> <b>{{ indextr + 1 }}</b></vs-td>
                    <vs-td> 
                        <vs-tooltip align="center" :text="getTooltipText(tr)" position="bottom" color="dark" class="w-full">
                            <template>‎</template>
                            <vs-chip :color="tr.valor < tr.cantidadl ? 'danger' : tr.valor == tr.cantidadl ? 'success' : 'warning'"></vs-chip>
                        </vs-tooltip>
                    </vs-td>
                    <vs-td> {{ tr.codigo_liquidacion }} <br /> </vs-td>
                    <vs-td><p>Serie {{ tr.nombrelibro}}<br /></p>  </vs-td>
                    <vs-td> {{ tr.valor}} <br /> </vs-td>
                    <vs-td> {{ tr.cantidadl}} <br /> </vs-td>
                    <vs-td> {{ tr.descuentoPorcentaje}} <br /> </vs-td>
                    <vs-td> ${{ tr.precio }} <br /> </vs-td>
                    <vs-td> ${{ tr.subtotal}} <br /> </vs-td>
                    <vs-td> ${{ (tr.subtotal*tr.descuentoPorcentaje)/100 }} <br /> </vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td colspan="4"><b>TOTALES</b></vs-td>
                    <vs-td><b>{{ total1 }}</b></vs-td>
                    <vs-td><b>{{ total2 }}</b></vs-td>
                    <vs-td></vs-td>
                    <vs-td></vs-td>
                    <vs-td><b>SUBTOTAL $</b></vs-td>
                    <vs-td><b>{{ total3 }}</b></vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td colspan="4"></vs-td>
                    <vs-td></vs-td>
                    <vs-td></vs-td>
                    <vs-td></vs-td>
                    <vs-td></vs-td>
                    <vs-td><b>Descuento $</b></vs-td>
                    <vs-td><b>{{ valordescuento }}</b></vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td colspan="4"></vs-td>
                    <vs-td></vs-td>
                    <vs-td></vs-td>
                    <vs-td></vs-td>
                    <vs-td></vs-td>
                    <vs-td><b>Transporte $</b></vs-td>
                    <vs-td><b>{{ trans}}</b></vs-td>
                </vs-tr>
                <vs-tr>
                    <vs-td colspan="4"></vs-td>
                    <vs-td></vs-td>
                    <vs-td></vs-td>
                    <vs-td></vs-td>
                    <vs-td></vs-td>
                    <vs-td><b>TOTAL $</b></vs-td>
                    <vs-td><b>{{ total4 }}</b></vs-td>
                </vs-tr>
            </template>
        </vs-table>

    </div>
    <div>
        <VueHtml2pdf :show-layout="false" :float-layout="true" :enable-download="true" :preview-modal="true" :pdf-margin="{ top: 35, left:35, right:35, bottom: 35}" :pdf-padding="{ top: 35, left:35, right:35, bottom: 35}" :paginate-elements-by-height="1400" filename="reporte de ventas" :pdf-quality="2" pdf-format="a4" pdf-orientation="portrait" pdf-content-width="800px" :manual-pagination="true" ref="html2Pdf">
            <section slot="pdf-content" class="m-6">
                <table class="table tabla1 m-5">
                    <tr>
                        <td colspan="5" style="text-align: center;"><b>REPORTE DE VENTAS </b></td>
                    </tr>
                    <tr>
                        <td>Código agrupado:</td>
                        <td>#{{ id }}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Temporada:</td>
                        <td>{{nombre_periodo}}</td>
                        <td></td>
                        <td></td>
                        <td></td>
                    </tr>
                    <tr>
                        <td>Fecha:</td>
                        <td>{{factura.fecha}}</td>
                        <td></td>
                    </tr>
                </table>
                <table class="m-3">
                    <thead>
                        <th width="25"># </th>
                        <th width="100">Código</th>
                        <th width="275">Descripción</th>
                        <th width="100">Cantidad solicitada</th>
                        <th width="100">Cantidad vendida</th>
                        <th width="100">Precio</th>
                        <th width="100">Cantidad vendida*Precio</th>
                    </thead>
                    <tbody v-for="(input, k)  in inputs" :key="k">
                        <tr>
                            <td><b>{{ k + 1 }}</b></td>
                            <td><b>{{ input.codigo_liquidacion }}</b></td>
                            <td> Serie {{ input.nombrelibro}}</td>
                            <td style="text-align: center;">{{ input.valor}}</td>
                            <td style="text-align: center;">{{ input.cantidadl}}</td>
                            <td>{{ input.precio}}</td>
                            <td style="text-align: right;">{{ input.subtotal}}</td>
                        </tr>

                        <tr v-if="(k + 1) % 28 === 0" class="html2pdf__page-break">
                            <!-- Salto de página después de cada 25 elementos -->
                        </tr>
                        <tr v-if="(k + 1) % 28 === 0" class="page-break" style="height: 25px;"></tr>
                    </tbody>
                </table>
                <table class="m-3">
                    <tr>
                        <td width="25"></td>
                        <td width="100"></td>
                        <td width="275" style="align-content: center;"> <b>TOTALES</b></td>
                        <td width="100" style="align-content: left;">{{ total1}}</td>
                        <td width="100" style="align-content: left;">{{ total2}}</td>
                        <td width="100" style="align-content: center;"><b>TOTAL $</b></td>
                        <td width="100" style="text-align: right;">{{ total3}}</td>
                    </tr>
                </table>
            </section>
        </VueHtml2pdf>
    </div>
</vx-card>
</template>

    
<script>
import {
    mapState
} from "vuex";
import VueHtml2pdf from 'vue-html2pdf';
const FileUploadModal = () => import('@/views/pedidos2/pedidos/proforma/FileUploadModal.vue')
import XLSX from 'xlsx';
export default {
    components: {
        VueHtml2pdf,
        FileUploadModal,
    },
    data: () => ({
        id: '',
        usuario: [],
        inputs: [],
        ventas: [],
        sendPedido: '',
        total1: 0,
        total2: 0,
        total3: 0,
        valordescuento: 0,
        trans: 0,
        total4: 0,
        setPuntos: '',
        popupcarga: false,
        factura: {
            cliente: '',
            temporada: '',
            fecha: '',
            user: '',
        },
        nombre_periodo: '',
        descuento: [{ descuento: 0, transporte: 0 }],
        mixinIdInicioFormatoNewData: null,
    }),
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
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if (me.usuario.id_group == 33) {
            this.setMenu = 3
        } else {
            this.setMenu = 1
        }
        this.nombre_periodo = localStorage.getItem('nombre_periodoPuntos');
        if (this.setMenu == 0) {
            this.sendPedido = this.ObjectPedido;
        }
        if (this.setMenu == 1) {
            this.setPuntos = this.ObjectPuntos;
        }
        this.getventas();

    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'ObjectPuntos', 'userAsesor']),
    },
    methods: {
        getTooltipText(tr) {
            if (tr.valor < tr.cantidadl) {
                return 'La Venta se pasó';
            } else if (tr.valor == tr.cantidadl) {
                return 'Solicitado = vendido';
            } else {
                return 'Falta vender';
            }
        },
        calculos() {
            this.inputs.forEach(p => {
                p.precio = (p.precio).toFixed(2);
                p.subtotal = (p.cantidadl * p.precio).toFixed(2);
                p.descuentoValor = ((p.subtotal * p.descuentoPorcentaje)/100).toFixed(2);
            });
            this.total1 = this.inputs.reduce((prev, curr) => prev + parseInt(curr.valor), 0);
            this.total2 = this.inputs.reduce((prev, curr) => prev + parseInt(curr.cantidadl), 0);
            this.total3 = this.inputs.reduce((prev, curr) => prev + parseFloat(curr.subtotal), 0).toFixed(2);
            this.valordescuento = this.inputs.reduce((prev, curr) => prev + parseFloat(curr.descuentoValor), 0).toFixed(2);;
            this.trans=(this.descuento[0].transporte).toFixed(2);
            this.total4=(parseFloat(this.total3)-parseFloat(this.valordescuento)+parseFloat(this.trans)).toFixed(2);
        },
        async getventas() {
            this.$vs.loading();
            this.inputs = [];
            this.ventas = [];
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let nombre = usuarioObjeto.nombres;
            let apellido = usuarioObjeto.apellidos;
            let f = this.mostrarFechayhora();
            if (this.setMenu == 0) {
                this.id = this.sendPedido.id_pedido;
                await this.getinfopedido();
                this.factura.cliente = this.sendPedido.nombreInstitucion;
                this.factura.temporada = this.sendPedido.periodo;
                this.factura.user = nombre + " " + apellido;
                this.factura.fecha = f;
            }
            if (this.setMenu == 1) {
                this.id = this.setPuntos.ca_codigo_agrupado;
                await this.getinfopedidoDespacho();
                this.factura.cliente = this.setPuntos.nombreDespacho;
                this.factura.temporada = this.setPuntos.id_periodo;
                this.factura.user = nombre + " " + apellido;
                this.factura.fecha = f;
            }
            await this.venta(this.setMenu);
            await this.venta(2);
            
            if (this.inputs.length !== 0 && this.ventas.length !== 0) {
                let dto;
                let vents;
                this.inputs = this.inputs.filter(input => {
                    // Buscar una coincidencia en el array de ventas
                    const venta = this.ventas.find(vent => vent.pro_codigo === input.codigo_liquidacion);
                    if (venta) {
                        input.cantidadl = venta.cantidad;
                        input.descuentoPorcentaje = venta.ven_desc_por;
                        return true; // Mantener el elemento en el array
                    } else {
                        input.cantidadl = 0;
                        input.descuentoPorcentaje = 0;
                        return false; // Eliminar el elemento del array
                    }
                });
                this.ventas.forEach(venta => {
                    const existsInInputs = this.inputs.some(input => input.codigo_liquidacion === venta.pro_codigo);
                    if (!existsInInputs) {
                        dto = {
                            codigo_liquidacion: venta.pro_codigo,
                            cantidadl: venta.cantidad,
                            valor: venta.cantidad,
                            precio: venta.det_ven_valor_u,
                            nombrelibro: venta.nombrelibro || '',
                            descuentoPorcentaje: venta.ven_desc_por,
                        };
                        this.inputs.push(dto);
                    }
                });
                this.$vs.loading.close();
            }
            if (this.inputs.length != 0 && this.ventas.length == 0) {
                this.inputs.forEach(p => {
                    p.cantidadl = 0
                });
                console.log(this.inputs);
                this.$vs.loading.close();
            }
            this.calculos();
        },
        async venta(tipo) {
            let buscar = '';
            if (tipo == 0) {
                buscar = this.sendPedido.id_pedido;
            }
            if (tipo == 1 || tipo == 2) {
                buscar = this.setPuntos.ca_codigo_agrupado
            }
            await this.$http
                .get(this.$server_url + "GetVentas?pedido_id=" + buscar + "&tipo=" + tipo)
                .then((res) => {
                    if (tipo == 2) {
                        this.descuento = res.data;
                        if (!this.descuento) {
                            this.$vs.notify({
                                text: "No exiten ventas registradas",
                                color: "warning",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                            this.$vs.loading.close();
                        }
                    } else {
                        this.ventas = res.data;
                        if (this.ventas.length == 0) {
                            this.$vs.notify({
                                text: "No exiten ventas registradas",
                                color: "warning",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                            this.$vs.loading.close();
                        }
                    }
                    this.$vs.loading.close();
                })
                .catch((err) => {
                    console.log(err);
                    this.$vs.loading.close();
                });
        },
        mostrarFechayhora: function () {
            const date = new Date();
            const formatear =
                date.getFullYear() +
                "-" +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + date.getDate()).slice(-2) +
                " " +
                ("0" + date.getHours()).slice(-2) +
                ":" +
                ("0" + date.getMinutes()).slice(-2) +
                ":" +
                ("0" + date.getSeconds()).slice(-2);

            return formatear;
        },
        async getinfopedidoDespacho() {
            this.inputs = [];
            let me = this;
            let nuevarutaxperiodo = '';
            if (me.setPuntos.id_periodo <= me.mixinIdInicioFormatoNewData) {
                nuevarutaxperiodo = `pedidosDespacho?id_despacho=${me.setPuntos.ca_codigo_agrupado}&id_periodo=${me.setPuntos.id_periodo}`;
            } else if (me.setPuntos.id_periodo > me.mixinIdInicioFormatoNewData) {
                nuevarutaxperiodo = `pedidosDespacho_new?id_despacho=${me.setPuntos.ca_codigo_agrupado}&id_periodo=${me.setPuntos.id_periodo}`;
            }
            await this.$http.get(this.$server_url + nuevarutaxperiodo)
                .then(res => {

                    this.inputs = res.data;
                })
                .catch(err => {
                    console.log(err)
                });
        },
        async getinfopedido() {
            this.inputs = [];
            let me = this;
            await this.$http.get(this.$server_url + 'get_val_pedidoInfoTodoSuma/' + this.sendPedido.id_pedido)
                .then(res => {
                    this.inputs = res.data;
                })
                .catch(err => {
                    console.log(err)
                });
        },
        startLoading() {
            this.popupcarga = true;
        },
        changeHandle(e) {
            let me = this;
            me.popupcarga = false;
        },
        exportToExcel() {
            let me = this;
            let headerTitle = ""
            let headerVal = ""
            //INSTITUCION
            let TitleInstitucion = []
            TitleInstitucion.push("")
            TitleInstitucion.push("REPORTE DE VENTAS")
            TitleInstitucion.push("")
            TitleInstitucion.push("")
            TitleInstitucion.push("")
            TitleInstitucion.push("")
            TitleInstitucion.push("")
            //TEMPORADA
            let TitleTemporada = []
            TitleTemporada.push("TEMPORADA:")
            TitleTemporada.push(me.nombre_periodo)
            TitleTemporada.push("")
            TitleTemporada.push("")
            TitleTemporada.push("")
            TitleTemporada.push("")
            TitleTemporada.push("")
            //Codigo Agrupado
            let TitleCodigoAgrupado = []
            TitleCodigoAgrupado.push("Código agrupado:")
            TitleCodigoAgrupado.push(me.id)
            TitleCodigoAgrupado.push("")
            TitleCodigoAgrupado.push("")
            TitleCodigoAgrupado.push("")
            TitleCodigoAgrupado.push("")
            TitleCodigoAgrupado.push("")
            //FECHA REPORTE
            let TitleFecha = []
            TitleFecha.push("FECHA:")
            TitleFecha.push(me.factura.fecha)
            TitleFecha.push("")
            TitleFecha.push("")
            TitleFecha.push("")
            TitleFecha.push("")
            TitleFecha.push("")
            let TitleEspacio = []
            TitleEspacio.push("")
            TitleEspacio.push("")
            TitleEspacio.push("")
            TitleEspacio.push("")
            TitleEspacio.push("")
            TitleEspacio.push("")
            TitleEspacio.push("")
            //CODIGOS
            headerTitle = [
                'CODIGO',
                'DETALLE',
                'CANTIDAD SOLICITADA',
                'CANTIDAD ENTREGADA',
                'VALOR UNIDAD',
                'CANTIDAD ENTREGADA * VALOR UNIDAD'
            ];
            headerVal = [
                'codigo_liquidacion',
                'nombrelibro',
                'valor',
                'cantidadl',
                'precio',
                'subtotal',
            ];
            import('@/vendor/Export2Excel').then(excel => {
                const data = this.formatJson(headerVal, this.inputs)
                let preData = data[0]

                excel.export_json_to_excel({
                    multiHeader: [TitleInstitucion, TitleTemporada, TitleCodigoAgrupado, TitleFecha, TitleEspacio],
                    header: headerTitle,
                    data,
                    filename: "reporte",
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }));
        },
        //limpiar campos para exportar de nuevo
        clearFields() {
            this.fileName = 'reporte de ventas'
            this.cellAutoWidth = true
            this.selectedFormat = 'xlsx'
        },
        getExcelx() {
            let datos = '';
            datos = {
                codigo_liquidacion: '',
                nombrelibro: 'TOTALES',
                valor: this.total1,
                cantidadl: this.total2,
                precio: 'TOTAL',
                subtotal: this.total3,
            }
            this.inputs.push(datos);
            if (this.inputs) {
                this.exportToExcel();
            }

        },
        pdf1() {
            const options = {
                margin: [10, 20] // [left, top] en mm
            };
            this.$refs.html2Pdf.generatePdf(options);
        },
        getfactpdf() {
            if (this.inputs) {
                this.pdf1();
            }
        },
    },
}
</script>

    <style>
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

    .tabla2 {
        table-layout: auto;
        width: 90%;
        font-size: 11px;
        margin-left: 40px;
        margin-right: 40px;
    }
    </style>
