<template>
    <div>
        <!-- <pre>{{ arregloComprasOrdenTrabajo  }}</pre> -->
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <h4 class="mt-5">Compras de la Orden de trabajo: {{ arregloComprasOrdenTrabajo.or_codigo }}</h4>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-table max-items="20" search pagination :data="Compras">
            <template slot="header">
                <span>Cantidad: {{ Compras.length }}</span>
            </template>
            <template slot="thead">
                <vs-th> Código </vs-th>
                <vs-th>Factura</vs-th>
                <vs-th>Empresa</vs-th>
                <vs-th>Fecha Creación</vs-th>
                <vs-th>Observación</vs-th>
                <vs-th>Valores</vs-th>
                <vs-th width="100"> Acciones </vs-th>
            </template>
            <template slot-scope="{ data }">
                <vs-tr v-for="(tr, index) in data" :key="index">
                    <vs-td>
                        {{ tr.com_codigo }}
                    </vs-td>
                    <vs-td> {{ tr.com_factura }} </vs-td>
                    <vs-td> {{ tr.nombreEmpresa }} </vs-td>
                    <vs-td>{{ tr.com_fecha }} </vs-td>
                    <vs-td>{{ tr.com_observacion }}</vs-td>
                    <vs-td>
                        <small><b>IVA $:</b> {{tr.com_iva }} </small><br>
                        <small><b>Descuento $:</b> {{tr.com_descuento}} </small><br>
                        <small><b>Total $:</b> {{tr.com_valor}} </small><br>
                    </vs-td>
                    <vs-td>
                        <vs-button v-if="estado == 1" color="#FAB818" type="line" class="w-full"
                            @click="getEditar(tr);">Editar</vs-button>
                        <vs-button color="#8F4897" type="line" class="w-full" @click="getDetallesOrden(tr);">Ver
                            Detalles</vs-button>
                        <!-- <vs-button v-if="estado == 1" color="danger" type="line" class="w-full"
                            @click="getPreguntaEliminar(tr);">Eliminar</vs-button> -->
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!-- editar Compras -->
        <vs-popup class="Editado informacionformhijo" :title="`Compra de Orden de trabajo Nº: ${tabOrdenCompraTrabajo.id} `" :active.sync="popupeditar" fullscreen>
            <vs-row>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="5">
                        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12"
                            style="text-align: center"><b>Órden</b></vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <vs-input label="CODIGO:" placeholder="CODIGO:" class="w-full" icon="error_outline" disabled
                                v-model="tabOrdenCompraTrabajo.codigo" />
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <vs-input label="FECHA: " placeholder="FECHA:" class="w-full" icon="error_outline" disabled
                                v-model="tabOrdenCompraTrabajo.fecha" />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10" vs-sm="12" class="m-2">
                            <vs-input label="Proveedor: " placeholder="Proveedor" class="w-full" disabled
                                v-model="tabOrdenCompraTrabajo.prov_nombre" />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="10" vs-sm="12" class="m-2 mt-4">
                            <b>Empresa: &nbsp;</b><span> {{ tabOrdenCompraTrabajo.NombreEmpresa }}</span>
                        </vs-col>
                    </vs-row>
                    <vs-row vs-type="flex" vs-justify="center" vs-w="7">
                        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12"
                            style="text-align: center"><b>Compra</b></vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <vs-input label="Factura:*" placeholder="Factura:" class="w-full" icon="edit"
                                v-model="tabOrdenCompraTrabajo.factura" />
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                            <vs-input label="IVA $:*" class="w-full m-1" icon="edit" 
                                v-model="tabOrdenCompraTrabajo.iva" @keypress="validateInput" @paste="validatePaste" />
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                            <vs-input label="Descuento $:*" class="w-full m-1" icon="edit" 
                                v-model="tabOrdenCompraTrabajo.descuento" @keypress="validateInput" @paste="validatePaste" />
                        </vs-col>
                        <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                            <vs-input label="Valor total $:*" class="w-full m-1" icon="edit" 
                                v-model="tabOrdenCompraTrabajo.valor" @keypress="validateInput" @paste="validatePaste" />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10" vs-sm="12" class="m-2">
                            <vs-input label="Observación:" placeholder="Escribe..." class="w-full"
                                v-model="tabOrdenCompraTrabajo.observacion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <vs-row>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Detalle de
                        compra de órden</b></vs-col>
                <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                    <!-- <vs-divider>Cantidad: {{ datosOrden.length }}</vs-divider> -->
                    <br />
                    <vs-table :data="datosOrden">
                        <vs-tr v-for="(input, k) in datosOrden" :key="k">
                            <vs-td width="50"><br /><b>{{ k + 1 }}</b></vs-td>
                            <vs-td width="500">
                                <b>Id: </b> {{input.pro_codigo}}</br>
                                <b>{{input.pro_nombre}}</b></br>
                            </vs-td>
                            <vs-td width="500">
                                <b>Cantidad solicitada: </b> {{input.det_or_cantidad}}</br>
                            </vs-td>
                            <vs-td width="650">
                                <vs-input class="w-full m-1" label="Stock:*" min="0"
                                     v-model="input.det_com_cantidad" @keypress="validateInput" @paste="validatePaste"/>
                                <vs-input type="hidden" v-model="input.det_com_cantidad_antiguo" />
                            </vs-td>
                            <vs-td width="650">
                                <vs-input class="w-full m-1" label="Valor unitario:*" min="0"
                                     v-model="input.det_com_valor_u" @keypress="validatevalorUnit" @paste="validatePaste"/>
                            </vs-td>
                            <!-- <vs-td>
                                <br /><br />
                                <vs-button v-if="k > -1" @click="remover(k)" color="danger"
                                    type="relief" icon="delete"></vs-button>
                            </vs-td> -->
                        </vs-tr>

                    </vs-table>
                </vs-col>
            </vs-row>
            <br /><br />
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="editar()" color="success" type="relief">Editar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
            <!-- Popup para stock insuficientes -->
            <vs-popup v-if="popupActivoErrorStock" class="popopPadre" title="Stock's insuficientes" :active.sync="popupActivoErrorStock">
                <ErroresStock v-if="popupActivoErrorStock" :erroresStock_Lista="erroresStock_Lista" @change="changeHandleErrorStock" />
            </vs-popup>
        </vs-popup>
        <!-- detalles de compras -->
        <vs-popup class="Detal" :title="`Información Compra de Orden de trabajo Nº: ${tabOrdenCompraTrabajo.id}`" :active.sync="popupdetalles"
                fullscreen>
                <vs-row>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="5">
                            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12"
                                style="text-align: center"><b>Órden</b></vs-col>
                            <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                <vs-input label="CODIGO:" placeholder="CODIGO:" class="w-full" icon="error_outline" disabled
                                    v-model="tabOrdenCompraTrabajo.codigo" />
                            </vs-col>
                            <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                <vs-input label="FECHA: " placeholder="FECHA:" class="w-full" icon="error_outline" disabled
                                    v-model="tabOrdenCompraTrabajo.fecha" />
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10" vs-sm="12" class="m-2">
                                <vs-input label="Proveedor: " placeholder="Proveedor" class="w-full" disabled
                                    v-model="tabOrdenCompraTrabajo.prov_codigo" />
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="10" vs-sm="12" class="m-2 mt-4">
                                <b>Empresa: &nbsp;</b><span> {{ tabOrdenCompraTrabajo.NombreEmpresa }}</span>
                            </vs-col>
                        </vs-row>
                        <vs-row vs-type="flex" vs-justify="center" vs-w="7">
                            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12"
                                style="text-align: center"><b>Compra</b></vs-col>
                            <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                <vs-input label="Factura:*" placeholder="Factura:" class="w-full" disabled
                                    v-model="tabOrdenCompraTrabajo.factura" />
                            </vs-col>
                            <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                                <vs-input label="IVA $:*" class="w-full m-1" disabled v-model="tabOrdenCompraTrabajo.iva" />
                            </vs-col>
                            <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                                <vs-input label="Descuento $:*" class="w-full m-1" disabled
                                    v-model="tabOrdenCompraTrabajo.descuento" />
                            </vs-col>
                            <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                                <vs-input label="Valor total $:*" class="w-full m-1" disabled
                                    v-model="tabOrdenCompraTrabajo.valor" />
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10" vs-sm="12" class="m-2">
                                <vs-input label="Observación:" placeholder="Escribe..." class="w-full" disabled
                                    v-model="tabOrdenCompraTrabajo.observacion" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-row>
                <vs-row>
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Detalle de
                            compra de órden</b></vs-col>

                    <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-divider>Cantidad: {{ datosOrden.length }}</vs-divider>
                        <br />
                        <vs-table :data="datosOrden">
                            <vs-tr v-for="(input, k) in datosOrden" :key="k">
                                <vs-td width="50"><br /><b>{{ k + 1 }}</b></vs-td>
                                <vs-td width="500">
                                    <b>{{input.pro_nombre}}</b></br>
                                    <b>Id: </b> {{input.pro_codigo}}</br>
                                </vs-td>
                                <vs-td width="500">
                                    <b>Cantidad solicitada: </b> {{input.det_or_cantidad}}</br>
                                </vs-td>
                                <vs-td width="650">
                                    <vs-input class="w-full m-1" label="Stock:" min="0"
                                         v-model="input.det_com_cantidad" readonly />
                                </vs-td>
                                <vs-td width="650">
                                    <vs-input class="w-full m-1" label="Valor unitario:" min="0"
                                         v-model="input.det_com_valor_u" readonly />
                                </vs-td>
                            </vs-tr>
                        </vs-table>
                    </vs-col>
                </vs-row>
                <br><br>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                    <vs-button @click="getCancelar()" color="danger" type="relief">Volver</vs-button>
                </vs-col>
            </vs-popup>
        <!-- Parte de eliminar -->
        <vs-popup class="eliminar" :title="`Eliminar el registro de compra n°${codigoCompraOrdenTrabajo}`"
            :active.sync="popupEliminar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
    </div>
</template>
<script>
    import Vue from "vue";
    import axios from "axios";
    import vSelect from "vue-select";
    const ErroresStock = () => import("@/views/facturacion/10_10_1_4/orden_pedido/components/Stocks_Insuficientes_Compra_Orden_Produccion.vue");
    export default {
        components: {
            "v-select": vSelect,
            ErroresStock,
        },
        data() {
            return {
                Compras: [],
                ComprasOrdenTrabajo: '',
                estado: '',
                idCompra: '',
                //editar
                tabOrdenCompraTrabajo: {
                    id:"",
                    codigo: "",
                    fecha: "",
                    prov_codigo: "",
                    observacion: "",
                    factura: "",
                    valor: "",
                    iva: "",
                    descuento: "",
                    observacion: "",
                    factura: "",
                    nota: "",
                    empresa: "",
                    NombreEmpresa:"",
                },
                datosOrden: [],
                codigoCompraOrdenTrabajo:'',
                empresa:'',
                //popups
                popupeditar: false,
                popupEliminar: false,
                esDistribucion: false,
                popupdetalles:false,
                popupActivoErrorStock: false,
                erroresStock_Lista: [],
            };
        },
        props: {
            arregloComprasOrdenTrabajo: {
                type: Object,
                default: {},
            }
        },
        computed: {},
        created() {
            let me = this
            me.usuario = JSON.parse(localStorage.getItem("usuario"));
        },
        mounted() {
            let me = this;
            me.getComprasOrdenTrabajo();
            me.ComprasOrdenTrabajo = me.arregloComprasOrdenTrabajo;
            me.estado = me.arregloComprasOrdenTrabajo.or_estado;
        },
        methods: {
            validateInput(event) {
                const charCode = event.which ? event.which : event.keyCode;
                if (charCode < 48 || charCode > 57) {
                    event.preventDefault();
                }
            },
            validatevalorUnit(event) {
                const charCode = event.which ? event.which : event.keyCode;
                const char = String.fromCharCode(charCode);
                // Permitir números (0-9), punto (.) y coma (,)
                if (!/^[0-9.,]+$/.test(char)) {
                    event.preventDefault();
                }
                // Reemplazar coma por punto
                event.target.value = event.target.value.replace(/,/g, '.');
            },
            validatePaste(event) {
                const clipboardData = event.clipboardData || window.clipboardData;
                const pastedText = clipboardData.getData('text/plain');
                // Filtrar solo los números del texto pegado
                const numbersOnly = pastedText.replace(/[^\d]/g, '');
                // Insertar el texto filtrado en la posición del cursor
                document.execCommand("insertText", false, numbersOnly);
                // Prevenir la acción de pegar por defecto
                event.preventDefault();
            },
            getComprasOrdenTrabajo() {
                let me = this
                this.$vs.loading();
                this.$http.get(this.$server_url + 'Get_ComprasOrden?orden_trabajo=' + me.arregloComprasOrdenTrabajo.or_codigo)
                    .then(res => {
                        let datos = res.data
                        me.Compras = datos
                        this.$vs.loading.close();
                    })
                    .catch(function (error) {
                        console.log(error + " error");
                        me.$vs.loading.close();
                    });
            },
            getEditar(tr) {
                this.popupeditar = true;
                this.tabOrdenCompraTrabajo.id = tr.com_codigo;
                this.tabOrdenCompraTrabajo.codigo = tr.orden_trabajo;
                this.tabOrdenCompraTrabajo.codigo = tr.orden_trabajo;
                this.tabOrdenCompraTrabajo.fecha = tr.com_fecha;
                this.tabOrdenCompraTrabajo.prov_nombre = tr.prov_nombre;
                this.tabOrdenCompraTrabajo.prov_codigo = tr.prov_codigo;
                this.tabOrdenCompraTrabajo.empresa = tr.com_empresa;
                this.tabOrdenCompraTrabajo.NombreEmpresa = tr.nombreEmpresa;
                this.tabOrdenCompraTrabajo.factura = tr.com_factura;
                this.tabOrdenCompraTrabajo.iva = tr.com_iva;
                this.tabOrdenCompraTrabajo.descuento = tr.com_descuento;
                this.tabOrdenCompraTrabajo.valor = tr.com_valor;
                this.tabOrdenCompraTrabajo.observacion = tr.com_observacion;
                this.datosOrden = [];
                if (tr.com_distribucion === 0) {
                    this.esDistribucion=true;
                }else {
                    this.esDistribucion = false;
                }
                this.traerDatosCompra(tr);
            },
            traerDatosCompra(tr){
                let me = this;
                me.$vs.loading();

                var url = "";
                url = this.$server_url + "Get_ComparOrdendetalle?com_codigo=" + tr.com_codigo;
                this.$http
                    .get(url)
                    .then(function (res) {
                        res.data.forEach((input) => {
                            input.det_com_cantidad_antiguo = input.det_com_cantidad;
                            input.det_com_factura_antiguo = input.det_com_factura;
                            input.det_com_nota_antiguo = input.det_com_nota;
                        });
                        me.datosOrden = res.data;
                        me.$vs.loading.close();
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: "success",
                                iconPack: "feather",
                                icon: "icon-user",
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error + " error");
                        this.datosOrden = [];
                        me.$vs.loading.close();
                    });
            },
            remover(index) {
                // Obtener el elemento a eliminar
                const removerItem = this.datosOrden[index];

                // Eliminar el elemento del array datosSeleccionadoLibros
                this.datosOrden.splice(index, 1);

                // Agregar el elemento de vuelta al array arregloLibros
                // this.arregloLibros.push(removerItem);

                // Enviar una solicitud al servidor para eliminar el registro correspondiente
                this.eliminarDetalleDB(removerItem);
            },
            eliminarDetalleDB(removerItem){
                let me = this;
                me.$vs.loading();
                const data = {
                    det_com_codigo: removerItem,
                };
                console.log('xd', data)
                this.$http.post(this.$server_url + 'Eliminar_DetalleCompraOrden', data)
                .then(res => {
                    // Maneja la respuesta del servidor si es necesario
                    console.log('Detalle eliminado con éxito:', res);
                    if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: "success",
                                iconPack: "feather",
                                icon: "icon-user",
                            });
                        }
                    me.$vs.loading.close();
                })
                .catch(error => {
                    // Maneja los errores si es necesario
                    console.error('Error al eliminar el registro:', error);
                    me.$vs.loading.close();
                });
            },
            getPreguntaEliminar(tr) {
                this.popupEliminar = true;
                this.codigoCompraOrdenTrabajo = tr.com_codigo
                this.empresa = tr.com_empresa
                if (tr.com_distribucion === 0) {
                    this.esDistribucion=true;
                }else {
                    this.esDistribucion = false;
                }
            },
            getEliminar() {
                let me = this;
                let datos = {
                    com_codigo: me.codigoCompraOrdenTrabajo,
                    distribuirStock: me.esDistribucion,
                    empresa: me.empresa,
                };
                me.$vs.loading();
                this.$http.post(this.$server_url + "Eliminar_ComprasOrdentrabajo", datos)
                    .then((data) => {
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "Compra orden de trabajo eliminado con exito",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                        me.getComprasOrdenTrabajo();
                        me.getCancelar();
                    })
                    .catch(function () {
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "Compra orden de trabajo no se pudo eliminar",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    });
            },
            getCancelar() {
                this.popupeditar = false;
                this.popupEliminar = false;
                this.esDistribucion = false;
                this.popupdetalles = false;
            },
            editar() {
            let me = this;
            me.idusuarioresp = me.usuario.iniciales;
            let idusuariop = me.usuario.idusuario;
            let formData = new FormData();
            let datosEnviar = [];

            if (me.datosOrden.length === 0) {
                me.$vs.notify({
                    text: "No hay detalles para guardar",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }

            // Capturar los valores antiguos antes de cualquier cambio
            let datosOrdenAntiguos = JSON.parse(JSON.stringify(me.datosOrden));

            me.datosOrden.forEach((input, index) => {
                let datosElemento = {
                    com_codigo: me.tabOrdenCompraTrabajo.id,
                    prov_codigo: me.tabOrdenCompraTrabajo.prov_codigo,
                    com_responsable: me.idusuarioresp,
                    com_factura: me.tabOrdenCompraTrabajo.factura,
                    com_valor: me.tabOrdenCompraTrabajo.valor,
                    com_iva: me.tabOrdenCompraTrabajo.iva,
                    com_descuento: me.tabOrdenCompraTrabajo.descuento,
                    com_observacion: me.tabOrdenCompraTrabajo.observacion,
                    orden_trabajo: me.tabOrdenCompraTrabajo.codigo,
                    user_created: idusuariop,
                    pro_codigo: input.pro_codigo,
                    gru_pro_codigo: input.gru_pro_codigo,
                    cantidades_antiguo: datosOrdenAntiguos[index].det_com_cantidad_antiguo,
                    cantidades: input.det_com_cantidad !== undefined && input.det_com_cantidad !== null && input.det_com_cantidad !== '' ? input.det_com_cantidad : 0,
                    valorunit: input.det_com_valor_u !== undefined && input.det_com_valor_u !== null && input.det_com_valor_u !== '' ? input.det_com_valor_u : 0,
                };
                datosEnviar.push(datosElemento);
            });

            if (!me.tabOrdenCompraTrabajo.factura) {
                me.$vs.notify({
                    text: "Escriba la factura de la compra antes de guardar",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            // if (!me.tabOrdenCompraTrabajo.valor) {
            //     me.$vs.notify({
            //         text: "Escriba el valor total de la compra antes de guardar",
            //         color: "danger",
            //         iconPack: "feather",
            //         icon: "icon-alert-triangle",
            //     });
            //     return;
            // }
            if (!me.tabOrdenCompraTrabajo.observacion) {
                me.$vs.notify({
                    text: "Escriba la observacion de la compra antes de guardar",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            
            if (me.datosOrden.length == 0) {
                me.$vs.notify({
                    text: "Agregue los detalles antes de guardar",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }

            formData.append("data_detallecompra", JSON.stringify(datosEnviar));
            formData.append("com_codigo", me.tabOrdenCompraTrabajo.id);
            formData.append("prov_codigo", me.tabOrdenCompraTrabajo.prov_codigo);
            formData.append("com_responsable", me.idusuarioresp);
            formData.append("com_factura", me.tabOrdenCompraTrabajo.factura);
            formData.append("com_valor", me.tabOrdenCompraTrabajo.valor);
            formData.append("com_iva", me.tabOrdenCompraTrabajo.iva);
            formData.append("com_descuento", me.tabOrdenCompraTrabajo.descuento);
            formData.append("com_observacion", me.tabOrdenCompraTrabajo.observacion);
            formData.append("empresa", me.tabOrdenCompraTrabajo.empresa);
            formData.append("user_created", idusuariop);
            formData.append("orden_trabajo", me.tabOrdenCompraTrabajo.codigo);
            formData.append("editar", 'yes');

            me.$vs.loading();
            this.$http.post(this.$server_url + "PostCompraOrdenTrabajo_Registrar_modificar", formData)
                .then((res) => {
                    me.$vs.loading.close();
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: "La Compra orden de trabajo y los detalles se ha guardado con exito",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                        this.popupeditar = false;
                        me.getComprasOrdenTrabajo()
                    } else if (res.data.status == 3) {
                        console.log("llego 3");
                        me.erroresStock_Lista = res.data;
                        me.popupActivoErrorStock = true;
                    }                           
                })
                .catch((error) => {
                    me.$vs.loading.close();
                    if (error.data.status == 0) {
                        me.$vs.notify({
                            text: "Compra Orden de trabajo no se pudo guardar",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    }
                });
        },
            actualizarCantidades(input) {
                input.det_com_cantidad = parseInt(input.det_com_factura) + parseInt(input.det_com_nota);
            },

            getDetallesOrden(tr){
                let me = this;
                this.popupdetalles = true;
                this.tabOrdenCompraTrabajo.id = tr.com_codigo;
                this.tabOrdenCompraTrabajo.codigo = tr.orden_trabajo;
                this.tabOrdenCompraTrabajo.codigo = tr.orden_trabajo;
                this.tabOrdenCompraTrabajo.fecha = tr.com_fecha;
                this.tabOrdenCompraTrabajo.prov_nombre = tr.prov_nombre;
                this.tabOrdenCompraTrabajo.prov_codigo = tr.prov_codigo;
                this.tabOrdenCompraTrabajo.empresa = tr.com_empresa;
                this.tabOrdenCompraTrabajo.NombreEmpresa = tr.nombreEmpresa;
                this.tabOrdenCompraTrabajo.factura = tr.com_factura;
                this.tabOrdenCompraTrabajo.iva = tr.com_iva;
                this.tabOrdenCompraTrabajo.descuento = tr.com_descuento;
                this.tabOrdenCompraTrabajo.valor = tr.com_valor;
                this.tabOrdenCompraTrabajo.observacion = tr.com_observacion;
                this.datosOrden = [];
                if (tr.com_distribucion === 0) {
                    this.esDistribucion=true;
                }else {
                    this.esDistribucion = false;
                }

                me.$vs.loading();

                var url = "";
                url = this.$server_url + "Get_ComparOrdendetalle?com_codigo=" + tr.com_codigo;
                this.$http
                    .get(url)
                    .then(function (res) {
                        me.datosOrden = res.data;
                        me.$vs.loading.close();
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: "success",
                                iconPack: "feather",
                                icon: "icon-user",
                            });
                        }
                    })
                    .catch(function (error) {
                        console.log(error + " error");
                        this.datosOrden = [];
                        me.$vs.loading.close();
                    });
            },
            changeHandleErrorStock(e) {
                let me = this;
                if (e.verificacionemitdeerrorlistado == 2) {
                    me.popupActivoErrorStock = false;
                    console.log("Emit recibido por cerrar.")
                }
            },
        },
    };
</script>
<style scoped>
.popopPadre {
    z-index: 51008;
    /* Valor mayor que el del popup del padre */
    position: fixed;
    /* Asegúrate de que la posición sea adecuada */
}

.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}
</style>
