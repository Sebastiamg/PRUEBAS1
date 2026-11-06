<template>
    <vx-card fixed-height="true">
        <vs-row>
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <b>Egreso: </b>{{ CompletoIngreso2 }}<br />
                <b>Referencia: </b>{{ idmovimiento.fmp_id }}<br />
                <b>Proveedor: </b>{{ idmovimiento.prov_nombre }}<br />
                <vs-divider>Cantidad: {{ datosSeleccionadoLibros.length }}</vs-divider>
                <vs-table :data="datosSeleccionadoLibros">
                    <vs-tr v-for="(tr, k) in datosSeleccionadoLibros" :key="k">
                        <vs-td width="50">
                            <br /><b>{{ k + 1 }}</b>
                        </vs-td>
                        <vs-td width="550">
                            <b>Libro: {{ tr.nombrelibro }}</b><br />
                            <b>Codigo: </b> {{ tr.pro_codigo }}<br />
                        </vs-td>
                        <vs-td width="500">
                            <b><font>&nbsp;Bodega:</font></b>
                            {{ tr.descripcion_corta }}
                        </vs-td>
                        <vs-td width="800">
                            <b><font>&nbsp;Tipo Bodega: </font></b>
                            <span v-if="tr.fmdp_tipo_bodega == 1">Notas</span>
                            <span v-else-if="tr.fmdp_tipo_bodega == 2">Facturas</span>
                        </vs-td>
                        <vs-td width="800">
                            <b><font>&nbsp;Cantidad:</font></b>
                            {{ tr.cantidad }}
                            <!-- <vs-input label="Cantidad: *" class="w-full m-1" placeholder="Cantidad" icon="mode_edit" type="number" min="0" v-model="tr.cantidad"/> -->
                        </vs-td>
                    </vs-tr>
                </vs-table>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <!-- <vs-button @click="guardar()" color="primary" type="relief" icon="save">Guardar información</vs-button> -->
                    </vs-row>
                </vs-col>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-w="12" class="mt-2" v-if="verificarLengthProducto == 1">
                <div align="center">
                    <div align="center" style="font-size: 20px; font-weight: bold;">Una vez de click en el botón "Confirmar Egreso No Operativo" 
                        los stock's de los productos disminuirán las cantidades correspondientemente.</div>
                    <br>
                    <br>
                    <vs-button @click="guardarRestaStock()" type="relief">Confirmar Egreso No Operativo</vs-button>&emsp;
                </div>
                <!-- <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button> -->
            </vs-col>
        </vs-row>
    </vx-card>
    </template>
    
    <script>
    import Vue from "vue";
    import axios from "axios";
    import vSelect from "vue-select";
    export default {
        data() {
            return {
                arregloLibros: [],
                MovimientoProducto: [],
                Proveedores: [],
                datosSeleccionadoLibros: [],
                infoPedido: {
                    libro: '',
                },
                // SecuencialIngreso: "",
                LetraIngreso: "",
                NombreIngreso: "",
                // CompletoIngreso: "",
                PeriodoUser: "",
                popupActivoGuardar: false,
                popupActivoEditar: false,
                popupActivoEliminar: false,
                verificarLengthProducto: 0,
            };
        },
        components: {
            "v-select": vSelect,
        },
        props: {
            usuario: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            idmovimiento: {
                type: Object,
                default: function () {
                    return {}
                }
            },
            CompletoIngreso: {
                type: String,
                default: '',
            },
            CompletoIngreso2: {
                type: String,
                default: '',
            },
            SecuenciaEgreso: {
                type: String,
                default: '', // Asigna el valor por defecto aquí
            },
        },
        mounted() {
            this.obtenerDetalleIngreo_Producto_NO();
        },
        methods: {
            getLibros() {
                this.$vs.loading();
                this.$http.get(this.$server_url + 'GetProducto')
                .then(res => {
                    const datos = res.data;
                    this.arregloLibros = datos.map(libro => ({
                        pro_codigo: libro.pro_codigo,
                        nombrelibro: libro.pro_nombre,
                    }));
                    this.$vs.loading.close();
                    this.obtenerDetalleIngreo_Producto_NO();
                })
                .catch(error => {
                    console.error('Error al obtener libros:', error);
                    this.$vs.loading.close();
                });
            },
            guardarRestaStock() {
                let me = this;
                const usuariorespo = localStorage.getItem("usuario");
                const usuarioObjeto = JSON.parse(usuariorespo);
                const periodolocal = localStorage.getItem("periodo_id");
                //VALIDACION DE CAMPOS NULOS Y VACIOS
                // if (this.tabTipoEmpaque.tip_empa_codigo === '' || this.tabTipoEmpaque.tip_empa_codigo === null) {
                //     me.$vs.notify({
                //         text: 'Escriba el código del tipo empaque antes de guardar',
                //         color: 'danger',
                //         iconPack: 'feather',
                //         icon: 'icon-alert-triangle'
                //     });
                //     return;
                // }
                const librosConCantidad = [];

                this.datosSeleccionadoLibros.forEach(libro => {
                    const libroConCantidad = {
                        pro_codigo: libro.pro_codigo,
                        nombrelibro: libro.nombrelibro,
                        emp_id: libro.emp_id,
                        fmdp_tipo_bodega: libro.fmdp_tipo_bodega,
                        cantidad: parseInt(libro.cantidad),
                    };
                    librosConCantidad.push(libroConCantidad);
                });
    
                const datosParaGuardar = {
                    fmp_id: me.CompletoIngreso2,
                    fmp_id_referencia: me.idmovimiento.fmp_id,
                    id_periodo: periodolocal,
                    prov_codigo: me.idmovimiento.prov_codigo,
                    fmp_cantidad_total: me.idmovimiento.fmp_cantidad_total,
                    fmp_estado: 2,
                    user_created: usuarioObjeto.idusuario,
                    secuencialconteo: parseInt(me.SecuenciaEgreso),
                    librosConCantidad: librosConCantidad,
                };
                this.$vs.loading();
                this.$http.post(this.$server_url + 'guardarDatosMovimientosProducto_EgresoStock', datosParaGuardar)
                    .then(res => {
                        me.$emit('change', { verificacionemitsaveegreso: 1 });
                        this.$vs.loading.close();
                        if (res.data.status == 1) {
                            me.$vs.notify({
                                text: "Egreso generado con éxito",
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check',
                                time: 7000,
                            })
                            return
                        }
                    })
                    .catch(error => {
                        console.error('Error al guardar los datos:', error);
                        this.$vs.loading.close();
                        me.$vs.notify({
                            text: 'No puede finalizar el egreso-',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x',
                            time: 7000,
                        })
                        return
                    });

            },
            obtenerDetalleIngreo_Producto_NO() {
                let me = this;
                // console.log(me.idmovimiento.fmp_id, "idmovimientfoinal");
                // console.log(me.CompletoIngreso, "idmovimientfoina2l");
                // return
                if ((me.idmovimiento.fmp_id == 'undefined') || (me.idmovimiento.fmp_id == '') || (me.idmovimiento.fmp_id == null)) {
                    this.$vs.loading();
                    this.$http.get(this.$server_url + 'obtenerDetallesMovimientosProductos/' + me.CompletoIngreso)
                        .then(response => {
                            this.datosSeleccionadoLibros = response.data.map(detalle => ({
                                nombrelibro: detalle.pro_nombre,
                                pro_codigo: detalle.pro_codigo,
                                emp_id: detalle.emp_id,
                                fmdp_tipo_bodega: detalle.fmdp_tipo_bodega,
                                cantidad: detalle.fmdp_cantidad,
                                descripcion_corta: detalle.descripcion_corta,
                            }));
    
                            const detalles = this.datosSeleccionadoLibros;
    
                            detalles.forEach(detalle => {
                                const index = this.arregloLibros.findIndex(libro => libro.pro_codigo === detalle.pro_codigo);
                                if (index !== -1) {
                                    this.arregloLibros.splice(index, 1);
                                }
                            });
                            if(me.datosSeleccionadoLibros.length > 0){
                                me.verificarLengthProducto = 1;
                            }else if(me.datosSeleccionadoLibros.length <= 0){
                                me.verificarLengthProducto = 0;
                            }
                            this.$vs.loading.close();
                        })
                        .catch(error => {
                            console.error('Error al obtener los datos del detalle de libros:', error);
                            this.$vs.loading.close();
                        });
                } else if ((me.idmovimiento.fmp_id != 'undefined') || (me.idmovimiento.fmp_id != '') || (me.idmovimiento.fmp_id != null)) {
                    this.$vs.loading();
                    this.$http.get(this.$server_url + 'obtenerDetallesMovimientosProductos/' + me.idmovimiento.fmp_id)
                        .then(response => {
                            this.datosSeleccionadoLibros = response.data.map(detalle => ({
                                nombrelibro: detalle.pro_nombre,
                                pro_codigo: detalle.pro_codigo,
                                emp_id: detalle.emp_id,
                                fmdp_tipo_bodega: detalle.fmdp_tipo_bodega,
                                cantidad: detalle.fmdp_cantidad,
                                descripcion_corta: detalle.descripcion_corta,
                            }));
    
                            const detalles = this.datosSeleccionadoLibros;
    
                            detalles.forEach(detalle => {
                                const index = this.arregloLibros.findIndex(libro => libro.pro_codigo === detalle.pro_codigo);
                                if (index !== -1) {
                                    this.arregloLibros.splice(index, 1);
                                }
                            });
                            if(me.datosSeleccionadoLibros.length > 0){
                                me.verificarLengthProducto = 1;
                            }else if(me.datosSeleccionadoLibros.length <= 0){
                                me.verificarLengthProducto = 0;
                            }
                            this.$vs.loading.close();
                        })
                        .catch(error => {
                            console.error('Error al obtener los datos del detalle de libros:', error);
                            this.$vs.loading.close();
                        });
                }
    
            },
        },
    };
    </script>
    