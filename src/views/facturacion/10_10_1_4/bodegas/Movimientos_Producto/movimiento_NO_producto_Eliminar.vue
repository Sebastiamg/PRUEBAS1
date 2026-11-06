<template>
<div>
    <!--FORMULARIO INFORMACION PAGO-->
    <div>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getEliminarMovimientoNO()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </div>
</div>
</template>

    
<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
export default {
    components: {
        vSelect,
        flatPickr,
    },
    data() {
        return {
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s',
                defaultDate: new Date()
            },
            estadonuevo: '',
            popupBeneficiarios: false,
            estado_anterior: '',
            menu: 0,
            deuda_anterior_estado: 0,
            datosSeleccionadoLibros: [],
        }
    },
    props: {
        CompletoIngreso: {
            type: String,
            default: '',
            // required:true,
        },
        // idmovimiento: {
        //     type: Array,
        //     default: () => []
        // }
        idmovimiento: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {
        let me = this;
        // this.verificarseleccion()
        console.log(this.CompletoIngreso, "verifiacionprop1");
        console.log(this.idmovimiento, "verifiacionprop2");
        if (me.idmovimiento.fmp_estado == 1) {
            this.obtenerDetalleIngreo_Producto_NO();
        } else {

        }
    },
    methods: {
        getEliminarMovimientoNO() {
            let me = this;
            if (me.idmovimiento.fmp_estado == 1) {
                // me.obtenerDetalleIngreo_Producto_NO();
                const librosConCantidad = [];
                me.datosSeleccionadoLibros.forEach(libro => {
                    const libroConCantidad = {
                        pro_codigo: libro.pro_codigo,
                        nombrelibro: libro.nombrelibro,
                        emp_id: libro.emp_id,
                        fmdp_tipo_bodega: libro.fmdp_tipo_bodega,
                        cantidad: parseInt(libro.cantidad),
                    };
                    librosConCantidad.push(libroConCantidad);
                });
                let datos = {
                    "fmp_id": me.idmovimiento.fmp_id,
                    "fmp_estado": me.idmovimiento.fmp_estado,
                    "librosConCantidad": librosConCantidad,
                }
                me.$vs.loading()
                this.$http.post(this.$server_url + "Eliminar_MovimientoProducto", datos)
                    .then(data => {
                        me.$vs.loading.close()
                        // this.getTipoEmpaqueParametro();
                        me.$vs.notify({
                            text: 'Movimiento eliminado con exito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemitdelete: 1
                        });
                    })
                    .catch(function () {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Movimiento no se pudo eliminar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })

            } else if (me.idmovimiento.fmp_estado == 0 || me.idmovimiento.fmp_estado == 2) {
                let datos = {
                    "fmp_id": me.idmovimiento.fmp_id,
                    "fmp_estado": me.idmovimiento.fmp_estado,
                }
                me.$vs.loading()
                this.$http.post(this.$server_url + "Eliminar_MovimientoProducto", datos)
                    .then(data => {
                        me.$vs.loading.close()
                        // this.getTipoEmpaqueParametro();
                        me.$vs.notify({
                            text: 'Movimiento eliminado con exito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificacionemitdelete: 1
                        });
                    })
                    .catch(function () {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Movimiento no se pudo eliminar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            }
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitdelete: 2
            });
        },
        obtenerDetalleIngreo_Producto_NO() {
            let me = this;
            // console.log(me.idmovimiento.fmp_id, "idmovimientfoinal");
            // console.log(me.CompletoIngreso, "idmovimientfoina2l");
            // return
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
                    this.$vs.loading.close();
                })
                .catch(error => {
                    console.error('Error al obtener los datos del detalle de libros:', error);
                    this.$vs.loading.close();
                });

        },
    }
}
</script>
