<template>
    <div>
        <div align="center">
          <!-- Parametros Imprimir: 1.-Tamaño general del texto, 2.- Nombre del archivo, 3.- Tamaño del borde td, 4.- Nombre Marca Agua-->
            <vs-button v-if="ObjectEdit.prof_estado == 0" @click="m_imprimirTodos('12px',adato[0].prof_id,'0px','Proforma Anulada')">Imprimir</vs-button>
            <vs-button v-else-if="PendienteProforma == true" @click="m_imprimirTodos('12px',adato[0].prof_id,'0px','Proforma no aprobada')">Imprimir</vs-button>
            <vs-button v-else-if="PendienteProforma != true && ObjectEdit.prof_estado != 0" @click="m_imprimirTodos('12px',adato[0].prof_id,'0px',)">Imprimir</vs-button>
        </div>
        <vx-card id="seccionImprimir2">
          <p style="text-align: center;font-weight: bold;">{{nombreEmpresaActual}}</p>
            <div v-for="(tr, k) in adato" :key="k">
                <table class="table tabla1">
                    <tr>
                        <td><img class="img-responsive mb-2 ml-1" :src="img" style="display: flex;width: 100px;"></td>
                        <td colspan="4" style="text-align: center;"><b>Proforma Nº: {{tr.prof_id}} </b></td>
                    </tr>
                    <!-- <tr>
                            <td><b>Cliente:</b></td>
                            <td colspan="3">{{tr.cliente}}</td>
                        </tr> -->
                    <tr>
                        <td><b>Temporada:</b></td>
                        <td>{{tr.temporada}}</td>
                        <td width="100"></td>
                        <td width="100"></td>
                    </tr>
                    <tr>
                        <td><b>Cliente:</b></td>
                        <td>{{tr.cliente}}</td>
                        <td width="100"></td>
                        <td width="100"></td>
                    </tr>
                    <tr>
                        <td><b>Fecha:</b></td>
                        <td>{{tr.fecha}}</td>
                        <td width="30"></td>
                    </tr>
                    <tr>
                        <td><b>Elaborado por:</b></td>
                        <td>{{tr.user}}</td>
                    </tr>
                </table>
            </div>

            <table class="table tabla2 mi-clase-de-tabla">
                <caption><b>Detalles de la Proforma</b></caption>
                <thead align="center">
                    <tr>
                        <th width="25"># </th>
                        <th width="300">Código </th>
                        <th width="300">Detalle </th>
                        <th width="75">Cantidad</th>
                        <th width="100">Valor Unitario</th>
                        <th width="75">Valor Total</th>
                    </tr>
                </thead>
                <tbody v-for="(input, k) in array" :key="k">
                    <tr>
                        <td><b>{{ k + 1 }}</b></td>
                        <td>{{ input.pro_codigo }}</td>
                        <td>
                            Serie {{input.nombre }} <br>
                            <span v-if="input.id_serie==19"> <b>Descripción combo:</b> {{ input.descripcion }}</span>
                        </td>
                        <td align="center">{{ input.det_prof_cantidad }}</td>
                        <td align="center">{{ input.det_prof_valor_u }}</td>
                        <td align="right">{{ input.subtotal = (input.det_prof_cantidad * input.det_prof_valor_u).toFixed(2) }}</td>
                    </tr>
                    <!-- <tr v-if="(k + 1) % 29 === 0" class="html2pdf__page-break"> -->
                        <!-- Salto de página después de cada 25 elementos -->
                    <!-- </tr>
                    <tr v-if="(k + 1) % 29 === 0" class="page-break" style="height: 25px;"></tr> -->

                </tbody>
            </table>

            <div v-for="(tr, k) in resumen" :key="k">
                <table class="table tabla2">
                    <tbody>
                        <tr>
                            <td colspan="2" width="340"></td>
                            <td colspan="2" width="200"><b>Subtotal $:</b></td>
                            <td style="text-align: right;" width="100"><b>{{ tr.subtotal.toFixed(2) }}</b></td>
                        </tr>
                        <tr>
                            <td colspan="2"></td>
                            <td colspan="2"><b>Descuento {{ tr.porcentaje }}% $:</b></td>
                            <td style="text-align: right;"><b>{{ tr.descuento.toFixed(2) }}</b></td>
                        </tr>
                        <tr>
                            <td colspan="2"></td>
                            <td colspan="2"><b>Subtotal - Descuento $:</b></td>
                            <td style="text-align: right;"><b>{{ (tr.subtotal - tr.descuento).toFixed(2) }}</b></td>
                        </tr>
                        <tr>
                            <td colspan="2"></td>
                            <td colspan="2"><b>Transporte $:</b></td>
                            <td style="text-align: right;"><b>{{ tr.transporte.toFixed(2) }}</b></td>
                        </tr>
                        <tr>
                            <td colspan="2"></td>
                            <td colspan="2"><b>TOTAL $:</b></td>
                            <td style="text-align: right;"><b>{{ tr.total.toFixed(2) }}</b></td>
                        </tr>
                        <tr>
                            <td colspan="2"><br /></td>
                            <td colspan="2"></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td colspan="5" style="text-align: center;">____________________ <br /> revisado por<br />DEPARTAMENTO COBRANZA</td>
                        </tr>
                        <tr>
                            <td colspan="5"></td>
                        </tr>
                        <tr>
                            <td colspan="5"></td>
                        </tr>
                        <tr>
                            <td colspan="5"></td>
                        </tr>
                        <tr>
                            <td colspan="5" style="text-align: left;"><b>Observaciones:</b> {{ tr.observacion }}<br /><b>NOTA: </b> LA VALIDEZ DE UNA PROFORMA SUELE SER DE 48 HORAS, LO QUE SIGNIFICA QUE LOS PRECIOS Y CONDICIONES ESTIPULADOS EN EL DOCUMENTO SON VÁLIDOS POR ESE TIEMPO.</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </vx-card>
    </div>
    </template>

    <script>
    import VueHtml2pdf from 'vue-html2pdf';
    import imprimirMixin from "@/mixins/Pedidosmix";
    export default {
        mixins: [imprimirMixin],
        components: {
            VueHtml2pdf,
        },
        data: () => ({
            id: '',
            img:'',
            nombreEmpresaActual:'',
        }),
        mounted() {
            let me = this;
            this.id = this.adato[0].prof_id;
            this.empresaActual()
            this.empresa(this.ObjectEdit.emp_id);
            // if (this.id !== '' || this.id !== null) {
            //     setTimeout(function () {
            //         me.pdf1();
            //     }, 2000);
            // }
        },
        props: {
            adato: {
                type: Array,
                default: function () {
                    return []
                }
            },
            array: {
                type: Array,
                default: function () {
                    return []
                }
            },
            resumen: {
                type: Array,
                default: function () {
                    return []
                }
            },
            PendienteProforma: {
                type: Boolean,
                default: false
            },
            ObjectEdit: {
                type: Object,
                default: function () {
                    return {}
                }
            }
        },
        methods: {
          async empresaActual(){
          await this.$http.get(this.$server_url + 'empresaActual')
            .then(res => {
                this.nombreEmpresaActual = res.data[0].descripcion_corta;
            })
            .catch(err => {
                console.log(err);
            });
        },
          async empresa(a) {
              await this.$http.get(this.$server_url + 'GetVuser?id=' + a)
                  .then(res => {
                      this.img = res.data;
                      this.$vs.loading.close();
                  })
                  .catch(err => {
                      console.log(err);
                      this.$vs.loading.close();
                  });
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
