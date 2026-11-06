<template>
<div>
    <div v-if="menu == 0">
        <!-- <pre>{{ sendPuntos }}</pre> -->
        <div style="text-align: center;">
            <vx-card title="Cobranzas">
                <vs-row vs-justify="center">
                    <vs-col vs-w="12" class="vs-align-center m-2">
                        <h2 class="text-danger">Sin Documentos</h2>
                        <center>
                            <img width="200" style="margin-top: 25px;" src="https://cdn-icons-png.flaticon.com/512/5433/5433091.png" alt="">
                        </center>
                    </vs-col>
                </vs-row>
            </vx-card>
        </div>
    </div>
    <div v-if="menu == 3">
        <!-- <vs-button v-if="!sendPedido" line-position="top" line-origin="right" color="primary" type="line" @click="menu = 0; cliente='';getbeneficiario()">🡨 Regresar</vs-button> -->
        <div>
            <!-- <pre>{{ sendPedido }}</pre> -->
            <vx-card title="Cobranzas">
                <div class="flex">
                    <div class="flex justify-center m-2">
                        <div class="text-center items-center">
                            <img style="margin-left: 30px;" width="80" src="https://cdn-icons-png.flaticon.com/512/9582/9582985.png" alt="">
                            <span class="text-purple">Total Facturas y Notas</span><br>
                            <h2 class="mb-1 pl-1 font-bold text-purple">${{ (totalFacturas + totalNotas).toFixed(2) }}</h2>
                        </div>
                    </div>
                    <div class="flex justify-center m-2">
                        <div class="text-center items-center">
                            <img style="margin-left: 30px;" width="80" src="https://cdn-icons-png.flaticon.com/512/9582/9582990.png" alt="">
                            <span class="text-orange ml-2">Total Abonos</span><br>
                            <h2 class="mb-1 pl-5 font-bold text-orange">${{ (abonoFacturas + abonoNotas).toFixed(2) }}</h2>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>
        <div class="flex" style="flex-wrap: wrap;">
            <div class="box purple" @click="menus(1)">
                <div>
                    <h2 class="text-purple">Facturas </h2><br>
                    <div>
                        <div class="flex">
                            <h4>N° Facturas: <b class="ml-1 mt-1">{{cantidadFacturas}}</b></h4>
                        </div>
                    </div>
                    <div>
                        <div class="flex">
                            <h4>Total facturas: <b class="ml-1 mt-2">$ {{ (totalFacturas).toFixed(2) }}</b></h4>
                        </div>
                        <div class="flex">
                            <h4>Abonado: $ <b class="ml-1 mt-2">{{ abonoFacturas }}</b></h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box orange" @click="menus(2)">
                <div>
                    <h2 class="text-orange">Notas</h2><br>
                    <div>
                        <div class="flex">
                            <h4>N° Notas: <b class="ml-1 mt-1">{{ cantidadNotas }}</b></h4>
                        </div>
                    </div>
                    <div>
                        <div class="flex">
                            <h4>Total Notas: <b class="ml-1 mt-2">$ {{ (totalNotas).toFixed(2) }}</b></h4>
                        </div>
                        <div class="flex">
                            <h4>Abonado $ <b class="ml-1 mt-2">{{ abonoNotas }}</b></h4>
                        </div>
                    </div>
                </div>
            </div>
            <div class="box">
                <div>
                    <div>
                        <div class="flex">
                            <h4>N° Abonos Notas: <b class="ml-1 mt-2">{{ totalAbonoNotas }}</b></h4>
                        </div>
                        <div class="flex">
                            <vs-button type="filled" color="hsl(34, 97%, 64%)" @click="openabonoNotas()">Ver Abonos Notas</vs-button>
                        </div>
                        <div class="flex">
                            <h4>N° Abonos Facturas: <b class="ml-1 mt-2">{{ totalAbonoFacturas }}</b></h4>
                        </div>
                        <div class="flex">
                            <vs-button type="filled" color="hsl(261, 81%, 61%)" @click="openabonoFacturas()">Ver Abonos Facturas</vs-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <vx-card>
                <div class="flex justify-center">
                    <vs-button color="success" type="relief" @click="newAbono()">Nuevo Abono</vs-button>
                </div>
            </vx-card>
        </div>
    </div>
    <div v-if="menu == 1">
        <vs-button line-position="top" line-origin="right" color="primary" type="line" @click="menu = 3;">🡨 Regresar</vs-button>
        <screenFacturas :arreglofacturas="arreglofacturas" />
    </div>
    <div v-if="menu == 2">
        <vs-button line-position="top" line-origin="right" color="primary" type="line" @click="menu = 3;">🡨 Regresar</vs-button>
        <screenNotas :arreglonotas="arreglonotas" />
    </div>
    <vs-popup v-if="popupAbonos" title="Abono" :active.sync="popupAbonos">
        <vs-row>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2">
                <div class="mb-2">Destino:</div>
                <vs-radio v-model="tabAbono.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="1" :disabled="totalNotas == 0" @change="resetearValor">Notas</vs-radio>
                <vs-radio v-model="tabAbono.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="0" :disabled="totalFacturas == 0" @change="resetearValor">Facturas</vs-radio>
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2">
                <div>Valor Abono:</div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="tabAbono.valor" placeholder="Valor" :disabled="!tabAbono.notasOfactura" @keypress="validateInput" @paste="validatePaste" min="0" :max="tabAbono.notasOfactura == 0 ? (totalNotas - abonoNotas): (totalFacturas - abonoFacturas)" @input="validateQuantity()" />
            </div>
        </vs-row>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
            <vs-button @click="popupAbonos=false" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <vs-popup v-if="popupAbonosNotas" title="Notas abonos" :active.sync="popupAbonosNotas">
        <!-- <pre>{{ arregloAbonoNotas }}</pre> -->
        <vs-table max-items="10" pagination :data="arregloAbonoNotas">
            <template slot="thead">
                <vs-th>Fecha Abonosssss</vs-th>
                <vs-th>Valor Abono</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                      {{ tr.created_at }}
                    </vs-td>
                    <vs-td>
                      {{ tr.abono_notas }}
                    </vs-td>
                    <vs-td align="center">
                      <vx-tooltip text="Eliminar" position="top" color="danger">
                          <vs-button v-if="tr.estadoPerseo == 0" @click="remover(tr);" color="danger" type="relief" icon="delete"></vs-button>
                      </vx-tooltip>
                      <vs-button v-if="tr.estadoPerseo == 0" @click="tipoAbono=0;popupAbonosNotas=false;ObjectSelected=tr;openConfirmEnviarPerseo(tr,1);" class="mt-3" color="primary" type="relief" icon="check">Enviar a perseo</vs-button>
                      <br>
                      <div v-if="tr.estadoPerseo == 0">
                        <vs-chip color="warning">No enviado a perseo</vs-chip>
                      </div>
                      <div v-else>
                        <vs-chip color="success">Enviado a perseo</vs-chip>
                      </div>
                  </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="popupAbonosNotas=false" color="danger" type="relief">Volver</vs-button>
        </vs-col>
    </vs-popup>
    <vs-popup v-if="popupAbonosFacturas" title="Facturas abonos" :active.sync="popupAbonosFacturas">
        <!-- <pre>{{ arregloAbonoFacturas }}</pre> -->
        <vs-table max-items="10" pagination :data="arregloAbonoFacturas">
            <template slot="thead">
                <vs-th>Fecha Abono</vs-th>
                <vs-th>Valor Abono</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                      {{ tr.created_at }}
                    </vs-td>
                    <vs-td>
                      {{ tr.abono_facturas }}
                    </vs-td>
                    <vs-td align="center">
                        <vx-tooltip text="Eliminar" position="top" color="danger">
                            <vs-button v-if="tr.estadoPerseo == 0" @click="remover(tr);" color="danger" type="relief" icon="delete"></vs-button>
                        </vx-tooltip>
                        <vs-button v-if="tr.estadoPerseo == 0" @click="tipoAbono=1;popupAbonosFacturas=false;ObjectSelected=tr;openConfirmEnviarPerseo(tr,1);" class="mt-3" color="primary" type="relief" icon="check">Enviar a perseo</vs-button>
                        <br>
                        <div v-if="tr.estadoPerseo == 0">
                          <vs-chip color="warning">No enviado a perseo</vs-chip>
                        </div>
                        <div v-else>
                          <vs-chip color="success">Enviado a perseo</vs-chip>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="popupAbonosFacturas=false" color="danger" type="relief">Volver</vs-button>
        </vs-col>
    </vs-popup>
    <vs-popup v-if="promptVisible" title="Facturas abonos" :active.sync="promptVisible">
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b style="font-size: 15px">Confirmar Eliminacion De Abono</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    ¿Estás seguro que deseas eliminar el abono con ID {{ abono_id.abono_id }}?
                </vs-row>
                <br><br>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                    <vs-button @click="eliminarAbono(abono_id)" color="danger" type="relief">Aceptar</vs-button>
                    <vs-button @click="cancelarEliminarAbono()" color="success" type="relief">Cancelar</vs-button>
                </vs-col>
            </vs-col>
        </vs-row>
    </vs-popup>
</div>
</template>

<script>
import screenFacturas from "./facturas/screenFacturas.vue";
import screenNotas from "./facturas/screenNotas.vue";
import vSelect from "vue-select";

export default {
    components: {
        "v-select": vSelect,
        screenFacturas,
        screenNotas,
    },
    data() {
        return {
            menu: 0,
            arreglofacturas: [],
            arreglonotas: [],
            arregloBeneficiario: [],
            arregloNotasFacturas: [],
            cantidadFacturas: 0,
            totalFacturas: 0,
            abonoFacturas: 0,
            cantidadNotas: 0,
            totalNotas: 0,
            abonoNotas: 0,
            totalAbonoFacturas: 0,
            totalAbonoNotas: 0,
            popupAbonos: false,
            popupAbonosNotas: false,
            popupAbonosFacturas: false,
            tabAbono: {
                notasOfactura: '',
                valor: '',
            },
            cliente: '',
            disableRadios: false,
            disableFacturas: false,
            arregloAbonoNotas: [],
            arregloAbonoFacturas: [],
            arrayPuntos: [],
            pedidoPuntosOInstitucion: '',
            institucionPuntosOInstitucion: '',
            periodoPuntosOInstitucion: '',
            promptVisible: false,
            abono_id:'',
            setMenu:0,
            ObjectSelected:'',
            tipoAbono:0,
        };
    },
    props: {
        sendPedido: {
            type: [Object, Array],
            default: () => ({}),
        },
        sendPuntos: {
            type: [Object, Array],
            default: () => ({}),
        }
    },
    computed: {},
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
        let me = this;
        me.setMenu = localStorage.setMenu
        if (me.sendPedido && Object.keys(me.sendPedido).length > 0) {
            me.pedidoPuntosOInstitucion = me.sendPedido.id_pedido;
            me.institucionPuntosOInstitucion = me.sendPedido.id_institucion;
            me.periodoPuntosOInstitucion = me.sendPedido.id_periodo;
            me.getFacturaNotaParametro();

        } else {
            console.log('sendPedido está vacío');
        }

        if (me.sendPuntos && Object.keys(me.sendPuntos).length > 0) {
            // me.getFacturaNotaParametroPunto();
            me.pedidoPuntosOInstitucion = me.sendPuntos.id_despacho;
            me.institucionPuntosOInstitucion = me.sendPuntos.id;
            me.periodoPuntosOInstitucion = me.sendPuntos.id_periodo;
            me.getFacturaNotaParametro();

        } else {
            console.log('sendPuntos está vacío');
        }
    },
    methods: {
      openConfirmEnviarPerseo(abono,tipo) {
        //tipo 0 = notas, 1 = facturas
        let me = this;
        me.$vs.dialog({
            title: 'Confirmación',
            text: `¿Estás seguro que deseas enviar el abono con ID ${abono.abono_id} a Perseo?`,
            acceptText: 'Enviar',
            cancelText: 'Cancelar',
            type: 'confirm',
            color: 'dark',
            accept: () => {
                me.enviarPerseo(abono);
            },
            //cancelar
            cancel: () => {
              if(tipo == 0) {  me.popupAbonosNotas = true; }
              if(tipo == 1) {  me.popupAbonosFacturas = true; }
            }
        });
      },
      enviarPerseo() {
        let me = this;
        let formData = new FormData();
        formData.append("abono_id", this.ObjectSelected.abono_id);
        me.$vs.loading();
        this.$http
            .post(this.$server_url + "api/perseo/transaccion/cobros_crear", formData)
            .then((res) => {
                if (res.data != null || res.data != undefined || res.data != 0) {
                    me.$vs.loading.close();
                    if(res.data.status == 0){
                        me.$vs.notify({
                            text: res.data.message,
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        return;
                    }
                    if(res.data.fault){
                        me.$vs.notify({
                            text: "Ocurrio un error en el envío a Perseo",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        return;
                    }
                    if(me.tipoAbono == 0){
                        me.obtenerAbonos('notas')
                    }else{
                        me.obtenerAbonos('facturas')
                    }
                    me.$vs.notify({
                        text: "Envío a Perseo exitoso",
                        color: "success",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    //abrir modal
                    if(me.tipoAbono == 0){
                        me.popupAbonosNotas = true;
                    }
                    if(me.tipoAbono == 1){
                        me.popupAbonosFacturas = true;
                    }
                } else {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "Se produjo algún fallo en el envío a Perseo",
                        color: "#F8C471",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                }
            })
            .catch((error) => {
                console.log(error);
                me.$vs.loading.close();
                me.$vs.notify({
                    text: "No se pudo enviar a Perseo",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-x",
                });
            });
      },
      // enviarAbonoPerseo(abono) {
      //   let me = this
      //   me.$http.post(me.$server_url + 'enviarAbonoPerseo', {
      //       abono_id: abono.abono_id
      //   })
      //   .then(res => {
      //       if (res.data.message) {
      //           me.$vs.notify({
      //               text: res.data.message,
      //               color: "success",
      //               iconPack: "feather",
      //               icon: "icon-check-circle",
      //           });
      //       } else {
      //           me.$vs.notify({
      //               text: 'Abono enviado a Perseo correctamente',
      //               color: "success",
      //               iconPack: "feather",
      //               icon: "icon-check-circle",
      //           });
      //       }
      //       me.popupAbonosNotas = false;
      //       me.popupAbonosFacturas = false;
      //       me.promptVisible = false;
      //   })
      // },
        resetearValor() {
            let me = this;
            me.tabAbono.valor = '';
        },
        validateInput(event) {
            const charCode = event.which ? event.which : event.keyCode;
            if ((charCode < 48 || charCode > 57) && charCode !== 44 && charCode !== 46) {
                event.preventDefault();
            }
        },
        validatePaste(event) {
            const clipboardData = event.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData('text/plain');
            const numbersOnly = pastedText.replace(/[^\d]/g, '');
            document.execCommand("insertText", false, numbersOnly);
            event.preventDefault();
        },
        validateQuantity() {
            let me = this;
            if (me.tabAbono.notasOfactura == 0) {
                let diferencia = this.totalFacturas - this.abonoFacturas;
                if (me.tabAbono.valor > diferencia) {
                    me.tabAbono.valor = diferencia.toFixed(2);
                }
            } else {
                let diferencia = this.totalNotas - this.abonoNotas;
                if (me.tabAbono.valor > diferencia) {
                    me.tabAbono.valor = diferencia.toFixed(2);
                }
            }

        },
        menus(menu) {
            let me = this;
            me.menu = menu;
        },
        newAbono() {
            let me = this;
            me.popupAbonos = true;
            me.tabAbono.valor = '';
            me.tabAbono.notasOfactura = '';
        },
        guardarnuevo() {
            let me = this;
            let totalesFacturaNotas = (me.totalFacturas + me.totalNotas).toFixed(2);
            if (!me.tabAbono.notasOfactura) {
                me.$vs.notify({
                    text: 'No a seleccionado',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabAbono.valor) {
                me.$vs.notify({
                    text: 'No a ingresado el valor del abono',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            // if (me.tabAbono.notasOfactura == 1) {
            //     if(me.tabAbono.valor > (this.totalNotas - this.abonoNotas)){
            //         me.$vs.notify({
            //             text: 'Supero el valor de abono permitido',
            //             color: 'warning',
            //             iconPack: 'feather',
            //             icon: 'icon-alert-triangle'
            //         });
            //         return;
            //     }
            // }
            // if (me.tabAbono.notasOfactura == 0) {
            //     if(me.tabAbono.valor > (this.totalFacturas - this.abonoFacturas)){
            //         me.$vs.notify({
            //             text: 'Supero el valor de abono permitido',
            //             color: 'warning',
            //             iconPack: 'feather',
            //             icon: 'icon-alert-triangle'
            //         });
            //         return;
            //     }
            // }
            if (me.tabAbono.valor == 0) {
                me.$vs.notify({
                    text: 'No puede enviar un abono 0',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let formData = new FormData();
            formData.append("notasOfactura", me.tabAbono.notasOfactura);
            formData.append("abono_valor", me.tabAbono.valor);
            formData.append("pedido", me.pedidoPuntosOInstitucion);
            formData.append("abono_totalNotas", (me.totalNotas).toFixed(2));
            formData.append("abono_totalFacturas", (me.totalFacturas).toFixed(2));
            formData.append('user_created', me.usuario.idusuario);
            formData.append("tipo", me.setMenu );
            me.$vs.loading();
            this.$http.post(this.$server_url + 'abono_registro', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close();
                    } else {
                        me.$vs.notify({
                            text: 'Se guardó correctamente',
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.popupAbonos = false
                        me.$vs.loading.close();

                        me.$http.get(me.$server_url + 'abono_pedido?pedido=' + me.pedidoPuntosOInstitucion)
                            .then(function (resAbono) {
                                let abonoDatos = resAbono.data;

                                if (abonoDatos.length > 0) {
                                    me.abonoFacturas = parseFloat(abonoDatos[0].abonofacturas);
                                    me.abonoNotas = parseFloat(abonoDatos[0].abononotas);
                                    me.totalAbonoFacturas = parseFloat(abonoDatos[0].totalAbonoFacturas);
                                    me.totalAbonoNotas = parseFloat(abonoDatos[0].totalAbonoNotas);
                                } else {
                                    me.abonoFacturas = 0;
                                    me.abonoNotas = 0;
                                    me.totalAbonoFacturas = 0;
                                    me.totalAbonoNotas = 0;
                                }
                            })
                            .catch(function (errorAbono) {
                                console.log(errorAbono + ' error');
                            });
                    }
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: error.response.data.message, // Aquí usamos error en lugar de res
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close();
                });
        },

        getFacturaNotaParametro() {
            let me = this;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'get_facturasNotasxParametro?institucion=' + me.institucionPuntosOInstitucion + '&periodo=' + me.periodoPuntosOInstitucion)
                .then(function (res) {
                    let datos = res.data;
                    me.arregloNotasFacturas = datos;

                    if (me.arregloNotasFacturas.length > 0) {
                        me.menu = 3;
                        me.arreglofacturas = datos.filter(item => item.idtipodoc === 1);
                        me.cantidadFacturas = me.arreglofacturas.length;
                        me.totalFacturas = me.arreglofacturas.reduce((total, factura) => total + factura.ven_valor, 0);

                        me.arreglonotas = datos.filter(item => item.idtipodoc === 4 || item.idtipodoc === 3);
                        me.cantidadNotas = me.arreglonotas.length;
                        me.totalNotas = me.arreglonotas.reduce((total, nota) => total + nota.ven_valor, 0);

                        me.$http.get(me.$server_url + 'abono_pedido?pedido=' + me.pedidoPuntosOInstitucion)
                            .then(function (resAbono) {
                                let abonoDatos = resAbono.data;

                                if (abonoDatos.length > 0) {
                                    me.abonoFacturas = parseFloat(abonoDatos[0].abonofacturas);
                                    me.abonoNotas = parseFloat(abonoDatos[0].abononotas);
                                    me.totalAbonoFacturas = parseFloat(abonoDatos[0].totalAbonoFacturas);
                                    me.totalAbonoNotas = parseFloat(abonoDatos[0].totalAbonoNotas);
                                } else {
                                    me.abonoFacturas = 0;
                                    me.abonoNotas = 0;
                                    me.totalAbonoFacturas = 0;
                                    me.totalAbonoNotas = 0;
                                }
                            })
                            .catch(function (errorAbono) {
                                console.log(errorAbono + ' error');
                            });
                    } else {
                        me.$vs.notify({
                            text: "Cliente sin documentos",
                            color: "warning",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
        getbeneficiario(valor) {
            let me = this
            let url = '';
            if (valor == 'si') {
                url = 'get_todo_beneficiarios?pedido=si&pedidoid=' + me.sendPedido.id_pedido
            } else {
                url = 'get_beneficiarios_pedidos/' + me.sendPedido.id_pedido
            }
            this.$vs.loading();
            this.$http.get(this.$server_url + url)
                .then(res => {
                    let datos = res.data
                    me.arregloBeneficiario = datos
                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        openabonoNotas() {
            let me = this;
            me.popupAbonosNotas = true;
            me.obtenerAbonos('notas')

        },
        openabonoFacturas() {
            let me = this;
            me.popupAbonosFacturas = true;
            me.obtenerAbonos('facturas')

        },
        obtenerAbonos(documento) {
            let me = this;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'obtenerAbonos?pedido=' + me.pedidoPuntosOInstitucion)
                .then(res => {
                    if (documento === 'notas') {
                        me.arregloAbonoNotas = res.data.abonos_con_notas.map(abono => ({
                            ...abono,
                            created_at: new Date(abono.created_at).toLocaleString(),
                            updated_at: new Date(abono.updated_at).toLocaleString()
                        }));
                    } else if (documento === 'facturas') {
                        me.arregloAbonoFacturas = res.data.abonos_con_facturas.map(abono => ({
                            ...abono,
                            created_at: new Date(abono.created_at).toLocaleString(),
                            updated_at: new Date(abono.updated_at).toLocaleString()
                        }));
                    }

                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
        remover(abono) {
            let me = this;
            me.abono_id = abono;
            me.popupAbonosNotas = false;
            me.popupAbonosFacturas = false
            me.promptVisible = true;

            // me.$vs.dialog({
            //     title: 'Confirmación',
            //     text: `¿Estás seguro que deseas eliminar el abono con ID ${abono.abono_id}?`,
            //     acceptText: 'Eliminar',
            //     cancelText: 'Cancelar',
            //     type: 'confirm',
            //     color: 'dark',
            //     accept: me.eliminarAbono(abono),
            //     accept: () => {
            //         me.eliminarAbono(abono);
            //     }
            // });
            // me.$vs.prompt({
            //     title: 'Confirmación',
            //     text: `¿Estás seguro que deseas eliminar el abono con ID ${abono.abono_id}?`,
            //     acceptText: 'Eliminar',
            //     cancelText: 'Cancelar',
            //     type: 'confirm',
            //     color: 'dark',
            //     accept: () => {
            //         // Esta función se ejecutará cuando se haga clic en "Eliminar"
            //         me.eliminarAbono(abono);
            //     }
            // });
        },
        cancelarEliminarAbono() {
            this.popupAbonosNotas = true;
            this.popupAbonosFacturas = true;
            this.promptVisible = false;
        },
        eliminarAbono(abono){
            let me = this;
            this.$http.post(this.$server_url + 'eliminarAbono?', {
                    abono_id: abono.abono_id
                })
                .then(res => {
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check-circle",
                        });
                    } else {
                        me.$vs.notify({
                            text: 'Abono eliminado correctamente',
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check-circle",
                        });
                    }
                    me.promptVisible = false;
                    me.popupAbonosNotas = false;
                    me.popupAbonosFacturas = false;
                    me.$http.get(me.$server_url + 'abono_pedido?pedido=' + me.pedidoPuntosOInstitucion)
                        .then(function (resAbono) {
                            let abonoDatos = resAbono.data;

                            if (abonoDatos.length > 0) {
                                me.abonoFacturas = parseFloat(abonoDatos[0].abonofacturas);
                                me.abonoNotas = parseFloat(abonoDatos[0].abononotas);
                                me.totalAbonoFacturas = parseFloat(abonoDatos[0].totalAbonoFacturas);
                                me.totalAbonoNotas = parseFloat(abonoDatos[0].totalAbonoNotas);
                            } else {
                                me.abonoFacturas = 0;
                                me.abonoNotas = 0;
                                me.totalAbonoFacturas = 0;
                                me.totalAbonoNotas = 0;
                            }
                        })
                        .catch(function (errorAbono) {
                            console.log(errorAbono + ' error');
                        });
                })
                .catch(error => {
                    console.error('Error al eliminar abono:', error);
                    me.$vs.notify({
                        text: 'Error al eliminar el abono',
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                    });
                });
        }
    }
}
</script>

<style>
.box p {
    color: hsl(229, 6%, 66%);
}

.box {
    border-radius: 5px;
    box-shadow: 0px 30px 40px -20px hsl(229, 6%, 66%);
    padding: 30px;
    margin: 20px;
    background-color: white;
    cursor: pointer;
    transition: 1s ease;
}

.box:hover {
    box-shadow: 15px 10px 15px #0000;
}

@media (max-width: 912px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 820px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 450px) {
    .box {
        height: 200px;
    }

    .img {
        margin-top: -40px;
    }
}

@media (max-width: 400px) {
    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 414px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 375px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 280px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 950px) and (min-width: 450px) {
    .box {
        text-align: center;
        height: 180px;
    }
}

.purple {
    border-top: 3px solid hsl(261, 81%, 61%);
}

.orange {
    border-top: 3px solid hsl(34, 97%, 64%);
}

@media (min-width: 950px) {
    .row1-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .row2-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .box-down {
        position: relative;
        top: 150px;
    }

    .box {
        width: 28%;

    }

    .header p {
        width: 30%;
    }

}

.facturas {
    background: #c018b8;
    color: #fff;
    min-width: 20px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    width: 25px;
}

.text-purple {
    color: hsl(261, 81%, 61%);
    ;
}

.text-orange {
    color: hsl(34, 97%, 64%);
}

/* .box.purple {
    position: relative;
    padding: 20px;  Ajusta según sea necesario
    background-image: url('https://cdn-icons-png.flaticon.com/512/3062/3062544.png');
    background-size:auto;
    background-position: center;
    background-repeat: no-repeat;
    background-blend-mode: lighten; Ajusta el blend mode según sea necesario

    background-color: rgba(255, 255, 255, 0.5); Fondo semitransparente
    color: #333; Color del texto para asegurar contraste
}

.box.purple .content {
    position: relative;
    z-index: 1;
} */
</style>
