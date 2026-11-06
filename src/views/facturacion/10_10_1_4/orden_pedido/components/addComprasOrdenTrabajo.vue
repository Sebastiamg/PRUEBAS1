<template>
<div>
    <!-- <pre>{{ arregloComprasOrdenTrabajo }}</pre> -->
    <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <h4 class="mt-5">Nueva Compra de la Orden de trabajo: {{ tabOrdenCompraTrabajo.codigo }}
                </h4>
            </vs-row>
        </vs-col>
    </vs-row>
    <!-- {{ arregloComprasOrdenTrabajo }} -->
    <vs-row class="mt-5">
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Órden</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <vs-input label="CODIGO:" placeholder="CODIGO:" class="w-full" icon="error_outline" disabled v-model="tabOrdenCompraTrabajo.codigo" />
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <vs-input label="FECHA: " placeholder="FECHA:" class="w-full" icon="error_outline" disabled v-model="tabOrdenCompraTrabajo.fecha" />
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10" vs-sm="12" class="m-2">
                    <vs-input label="Proveedor: " placeholder="Proveedor" class="w-full" disabled v-model="arregloComprasOrdenTrabajo.prov_nombre" />
                </vs-col>
                <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="10" vs-sm="12" class="m-2">
                    <b>Empresa: &nbsp;</b><span> {{ arregloComprasOrdenTrabajo.nombreEmpresa }}</span>
                </vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Compra</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <vs-input label="Factura:*" placeholder="Factura:" class="w-full" icon="edit" v-model="tabOrdenCompraTrabajo.factura" />
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                    <vs-input label="IVA $:*" placeholder="00,00" class="w-full m-1" icon="edit" v-model="tabOrdenCompraTrabajo.iva" type="text" @keypress="validateInput" @paste="validatePaste" />
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                    <vs-input label="Descuento $:*" placeholder="00,00" class="w-full m-1" icon="edit" v-model="tabOrdenCompraTrabajo.descuento" type="text" @keypress="validateInput" @paste="validatePaste" />
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-w="3" class="m-2">
                    <vs-input label="Valor total $:*" placeholder="00,00" class="w-full m-1" icon="edit" v-model="tabOrdenCompraTrabajo.valor" type="text" @keypress="validateInput" @paste="validatePaste" />
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10" vs-sm="12" class="m-2">
                    <vs-textarea label="Observación:" placeholder="Escribe..." class="w-full" v-model="tabOrdenCompraTrabajo.observacion" />
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>
    <vs-row>
        <!-- {{ datosOrden }} -->
        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Detalle de compra
                de órden</b></vs-col>

        <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-divider>Cantidad: {{ datosOrden.length }}</vs-divider>
            <br />
            <vs-table search :data="datosOrden">
                <template slot-scope="{ data }">
                    <vs-tr v-for="(input, k) in data" :key="k">
                        <vs-td width="50"><br /><b>{{ k + 1 }}</b></vs-td>
                        <vs-td width="250">
                            <b>Libro {{input.pro_nombre}}</b><br>
                            <b>Id: </b> {{input.pro_codigo}}<br>
                            <b># Páginas: </b> {{input.det_or_int_paginas}}<br>
                        </vs-td>
                        <vs-td width="250">
                            <b>Cantidad solicitada: </b> {{input.det_or_cantidad}}<br>
                            <b>Fecha Posible Entrega: </b> {{input.det_or_posible_entrega}}<br>
                        </vs-td>
                        <vs-td width="250">
                            <template v-if="input.det_com_cantidad==null || input.det_com_cantidad==0">
                                <b>Cantidad Recibida: </b> {{input.det_com_cantidad=0}}<br>
                            </template>
                            <template v-else>
                                <b>Cantidad Recibida: </b> {{input.det_com_cantidad}}<br>
                            </template>
                            <b>Cantidad Pendiente: </b> {{parseInt(input.det_or_cantidad) - parseInt(input.det_com_cantidad)}}<br>
                        </vs-td>
                        <vs-td width="320">
                            <vs-input class="w-full m-1" label="Stock:*" v-model="input.cantidades" @blur="ceroCantidades(input)" @keypress="validateInput" @paste="validatePaste" />
                            <vs-input class="w-full m-1" label="Valor Unitario:*" v-model="input.valorunit" @keypress="validatevalorUnit" @paste="validatePaste" @blur="cerovalorunit(input)" />
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="guardarCompraOrden()" color="success" type="relief">Guardar</vs-button>
        </vs-col>
    </vs-row>
</div>
</template>

<script>
import Vue from "vue";
// import axios from "axios";
import vSelect from "vue-select";

export default {
    components: {
        "v-select": vSelect,
    },
    data() {
        return {
            usuario: [],
            tabOrdenCompraTrabajo: {
                id: "",
                codigo: "",
                fecha: "",
                prov_codigo: "",
                prov_nombre: "",
                empresa: "",
                observacion: "",
                factura: "",
                valor: "",
                iva: "",
                descuento: "",
            },
            datosOrden: [],
            idCompra: '',
            Empresas: [],
        };
    },
    props: {
        arregloComprasOrdenTrabajo: {
            type: Object,
            default: {},
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"));
    },
    mounted() {
        let me = this;
        me.getOrdenCompraTrabajo();
        me.GetEmpresas();
        this.tabOrdenCompraTrabajo.codigo = this.arregloComprasOrdenTrabajo.or_codigo;
        this.tabOrdenCompraTrabajo.fecha = this.arregloComprasOrdenTrabajo.or_fecha;
        this.tabOrdenCompraTrabajo.prov_codigo = this.arregloComprasOrdenTrabajo.prov_codigo;
        this.tabOrdenCompraTrabajo.prov_nombre = this.arregloComprasOrdenTrabajo.prov_nombre;
    },
    methods: {
        GetEmpresas() {
            this.$vs.loading();
            this.$http
                .get(this.$server_url + "empresa2")
                .then((res) => {
                    this.Empresas = res.data.filter(empresa => empresa.id != 2);
                    if (!this.tabOrdenCompraTrabajo.empresa && this.arregloComprasOrdenTrabajo.or_empresa) {
                        this.tabOrdenCompraTrabajo.empresa = this.arregloComprasOrdenTrabajo.or_empresa;
                    }
                    this.$vs.loading.close();
                })
                .catch((error) => {
                    console.error(error);
                    this.$vs.loading.close();
                });
        },
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
            // Reemplazar la coma por un punto justo después de ingresarla
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
        getOrdenCompraTrabajo() {
            let me = this;
            me.$vs.loading();
            // Realizar la primera consulta
            this.$http.get(this.$server_url + 'get_detalleOrdenTrabajo?or_codigo=' + me.arregloComprasOrdenTrabajo.or_codigo)
                .then((res) => {
                    // Almacenar los datos de la primera consulta
                    let datosOrdenTrabajo = res.data;
                    // Realizar la segunda consulta
                    this.$http.get(this.$server_url + 'get_detalleOrdenTrabajoCantidades?or_codigo=' + me.arregloComprasOrdenTrabajo.or_codigo)
                        .then((resCantidad) => {
                            // Almacenar los datos de la segunda consulta
                            let cantidades = resCantidad.data;
                            // Iterar sobre los datos de la primera consulta
                            datosOrdenTrabajo.forEach((orden) => {
                                //Inicializar las variables
                                orden.cantidades = 0;
                                orden.valorunit = 0;
                                // Buscar coincidencias en la segunda consulta
                                let cantidadEncontrada = cantidades.find((item) => {
                                    return item.or_codigo === orden.or_codigo && item.pro_codigo === orden.pro_codigo;
                                });
                                // Si se encuentra la coincidencia, asignar la cantidad correspondiente
                                if (cantidadEncontrada) {
                                    orden.det_com_cantidad = cantidadEncontrada.det_com_cantidad;
                                }
                            });
                            // Asignar los datos modificados a datosOrden
                            me.datosOrden = datosOrdenTrabajo;
                            console.log(me.datosOrden, "hola1");
                            me.$vs.loading.close();
                        })
                        .catch((error) => {
                            console.log(error + " error");
                            me.datosOrden = [];
                            me.$vs.loading.close();
                        });
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-user",
                        });
                    }
                })
                .catch((error) => {
                    console.log(error + " error");
                    me.datosOrden = [];
                    me.$vs.loading.close();
                });
        },
        guardarCompraOrden() {
            let me = this;
            me.idusuarioresp = me.usuario.iniciales;
            let idusuariop = me.usuario.idusuario;
            let formData = new FormData();
            let datosEnviar = [];

            if (!me.datosOrden.some(input =>
                (input.cantidades !== undefined && input.cantidades !== null) &&
                (input.valorunit !== undefined && input.valorunit !== null)
            )) {
                me.$vs.notify({
                    text: "Agregue cantidad y valor unitario antes de guardar",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }

            me.datosOrden.forEach((input) => {
                let datosElemento = {
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
                    cantidades: input.cantidades || 0,
                    valorunit: input.valorunit || 0,
                };
                datosEnviar.push(datosElemento);
            });

            const campos = ['factura', 'iva', 'descuento', 'valor', 'observacion'];
            for (const campo of campos) {
                if (!this.tabOrdenCompraTrabajo[campo]) {
                    this.$vs.notify({
                        text: `Por favor, complete el campo ${campo} antes de guardar.`,
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                    });
                    return;
                }
            }

            formData.append("data_detallecompra", JSON.stringify(datosEnviar));
            formData.append("empresa", me.tabOrdenCompraTrabajo.empresa);
            formData.append("prov_codigo", me.tabOrdenCompraTrabajo.prov_codigo);
            formData.append("com_responsable", me.idusuarioresp);
            formData.append("com_factura", me.tabOrdenCompraTrabajo.factura);
            formData.append("com_valor", me.tabOrdenCompraTrabajo.valor);
            formData.append("com_iva", me.tabOrdenCompraTrabajo.iva);
            formData.append("com_descuento", me.tabOrdenCompraTrabajo.descuento);
            formData.append("com_observacion", me.tabOrdenCompraTrabajo.observacion);
            formData.append("user_created", idusuariop);
            formData.append("orden_trabajo", me.tabOrdenCompraTrabajo.codigo);
            formData.append("editar", 'no');

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
                    }
                    this.$emit('guardadoExitoso');
                })
                .catch((error) => {
                    me.$vs.loading.close();
                    if (error.data && error.data.status == 0) {
                        me.$vs.notify({
                            text: error.data.error,
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    }
                });
        },
        ceroCantidades(item) {
            if (item.cantidades == '') {
                this.$set(item, 'cantidades', 0);
            } else if (typeof item.cantidades == 'string') {
                item.cantidades = parseInt(item.cantidades, 10);
            }
        },
        cerovalorunit(item) {
            if (item.valorunit == '') {
                this.$set(item, 'valorunit', 0);
            } else if (typeof item.valorunit == 'string') {
                item.valorunit = parseFloat(item.valorunit, 10);
            }
        },
    },
};
</script>
