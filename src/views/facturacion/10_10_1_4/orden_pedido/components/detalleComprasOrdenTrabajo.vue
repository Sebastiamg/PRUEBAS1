<template>
    <div>
        <!-- <pre>{{ arregloComprasOrdenTrabajo }}</pre> -->
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <h4 class="mt-5">Detalle Orden de trabajo: {{ arregloComprasOrdenTrabajo.or_codigo }}</h4>
                </vs-row>
            </vs-col>
        </vs-row>
    <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <vs-input label="Código:" class="w-full" icon="error_outline" disabled
                        v-model="arregloComprasOrdenTrabajo.or_codigo" />
                </vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <vs-input label="Fecha: " class="w-full" icon="error_outline" disabled
                        v-model="arregloComprasOrdenTrabajo.or_fecha" />
                </vs-col>
            </vs-row>
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <vs-input label="Proveedor: " class="w-full" icon="error_outline" disabled
                        v-model="arregloComprasOrdenTrabajo.prov_nombre" />
                </vs-col>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                    <vs-textarea label="Observación: *" placeholder="Escribe..." class="w-full" icon="error_outline"
                        v-model="arregloComprasOrdenTrabajo.or_observacion" disabled />
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>
    <vs-row>
        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Detalle de
                orden</b></vs-col>
        <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-divider>Cantidad: {{ datosOrden.length }}</vs-divider>
            <br />
            <vs-table max-items="5" search pagination :data="datosOrden">
            <template slot-scope="{ data }">
                <vs-tr v-for="(datos, k) in data" :key="k">
                    <vs-td width="50"><br /><b>{{ k + 1 }}</b></vs-td>
                    <vs-td width="550">
                        <b>Nombre: </b>{{datos.pro_nombre}}</br></br>
                        <b>Id: </b> {{datos.pro_codigo}}</br>
                    </vs-td>
                    <vs-td width="550">
                        <b>Páginas: </b> {{datos.det_or_int_paginas}}</br>
                        <b>Tamaño: </b> {{datos.det_or_tamaño}}</br>
                        <b>Acabados: </b> {{datos.det_or_acabados}}</br>
                        <b>Recubrimiento: </b> {{datos.det_or_recubrimiento}}</br>
                        <b>Código Interior: </b> {{datos.det_or_in_codigo}}</br>
                        <b>Tintas Interior: </b> {{datos.det_or_in_tintas}}</br>
                        <b>Código Cubierta: </b> {{datos.mat_cub_codigo}}</br>
                        <b>Tintas Cubierta:: </b> {{datos.det_or_cub_tintas}}</br>
                    </vs-td>
                    <vs-td width="800">
                        <b>Cantidad: </b> {{datos.det_or_cantidad}}</br>
                        <b>Posible Entrega: </b> {{datos.det_or_posible_entrega}}</br>
                        <b>Observaciones: </b> {{datos.det_or_observaciones}}</br>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>           
        </vs-col>
    </vs-row>
</div>
</template>
<script>
    import Vue from "vue";
    import axios from "axios";
    import vSelect from "vue-select";

    export default {
        components: {
            "v-select": vSelect,

        },
        data() {
            return {               
                tabOrdenTrabajo: {
                    codigo: "",
                    fecha: "",
                    prov_codigo: "",
                    pro_nombre: "",
                    observacion: "",
                },
                datosOrden: [],
            };
        },
        props: {
            arregloComprasOrdenTrabajo: {
                type: Object,
                default: {},
            }
        },
        computed: {},
        mounted() {
            let me = this;
            me.getDetallesOrden();
        },
        methods: {
            getDetallesOrden() {
                let me = this;
                me.$vs.loading();
                this.$http.get(this.$server_url + 'get_detalleOrdenTrabajo?or_codigo=' + me.arregloComprasOrdenTrabajo.or_codigo)
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
                            me.datosOrden = [];
                            me.$vs.loading.close();
                        });                
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
                   
        },
    };
</script>