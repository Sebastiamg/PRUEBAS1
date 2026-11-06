<template>
<vs-row>
    <vs-row>
        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                    <b class="text-danger">PEDIDO Y DOCUMENTO REALIZADO CON {{ librosObsequios.porcentaje_descuento }}% DE DESCUENTO.</b>
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>
    <vs-row>
        <vs-divider>Detalle libros:</vs-divider>
        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                    <v-select :options="arregloLibros" :reduce="arregloLibros => arregloLibros.nombrelibro" label="nombrelibro" class="w-full h-100" placeholder="--Seleccione--" v-model="infoPedido.libro" />
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="1" vs-sm="1" class="m-2">
                    <vs-button @click="agregarLibro" color="success" type="relief" icon="add">Agregar</vs-button>
                </vs-col>
            </vs-row>
        </vs-col>
        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6" vs-sm="6" class="m-2">
                    <vs-button @click="popuptodoslosLibros=true" color="danger" type="border">Reflejar todos los libros</vs-button>
                </vs-col>
            </vs-row>
        </vs-col>
    </vs-row>

    <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
        <vs-divider>Cantidad libros: {{ datosSeleccionadoLibros.length }}</vs-divider>
        <vs-table :data="datosSeleccionadoLibros">
            <vs-tr v-for="(tr, k) in datosSeleccionadoLibros" :key="k">
                <vs-td width="50">
                    <br /><b>{{ k + 1 }}</b>
                </vs-td>
                <vs-td width="550">
                    <span v-if="tr.serie === 19">
                        <b>Combo: {{ tr.nombrelibro }}</b><br />
                        <b>Descripción: </b>{{ tr.descripcion }}<br />
                    </span>
                    <span v-else><b>Libro: {{ tr.nombrelibro }}</b><br /></span>
                    <b>Codigo: </b> {{ tr.codigo }}<br />
                    <b>Precio: </b> {{ tr.precio }}<br />
                    <b>Stock: </b> {{ tr.stock }}<br />
                </vs-td>
                <vs-td width="1000">
                    <vs-input label="Cantidad: *" class="w-full m-1" placeholder="Cantidad" icon="mode_edit" type="number" min="0" v-model="tr.cantidad" @blur="validarCantidad(tr,k);guardarYmandar()" />
                </vs-td>
                <vs-td>
                    <vs-button v-if="datosSeleccionadoLibros.length>1" @click="remover(k);guardarYmandar()" color="danger" type="relief" icon="delete">Quitar</vs-button>
                </vs-td>
            </vs-tr>
        </vs-table>
        <br><br>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="end" vs-w="12">
                <b>Valor subtotal Pedido: {{ calcularTotalPedido() }}</b>
            </vs-row>
            <vs-row vs-type="flex" vs-justify="end" vs-w="12">
                <b>Total con descuento: {{ totalConDescuento }}</b>
            </vs-row>
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <!-- <vs-button @click="guardarYmandar()" color="primary" type="relief" icon="save">Guardar información</vs-button> -->
            </vs-row>
        </vs-col>
    </vs-col>
    <vs-popup small title="Confirmación" :active.sync="popuptodoslosLibros" class="popophijo">
        <div class="w-full mb-base" align="center">
            <h4>¿Está seguro de que desea añadir libros externos al pedido original?</h4>
        </div>
        <div class="w-full" align="center">
            <vs-button class="mb-2" color="danger" type="gradient" @click="getLibrostodos()"> Confirmar </vs-button>
        </div>
    </vs-popup>
</vs-row>
</template>

<script>
import vSelect from 'vue-select';
export default {
    data() {
        return {
            usuario: [],
            arregloLibros: [],
            infoPedido: {
                libro: '',
            },
            datosSeleccionadoLibros: [],
            selectedOption: '',
            porcentajePedidoLibrosObsequios: {
                institucionPorcentaje: 0,
                procentaje100: 100
            },
            cantidadValida: false,
            cantidadPedidoTotal: 0,
            cantidadItemsPedidos: 0,
            popuptodoslosLibros: false,
            obsequiosCheck: false,
        };
    },
    props: {
        sendPedido: {
            type: Object,
            default: {},
        },
        librosObsequios: {
            type: Object,
            default: {},
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        let me = this;
        this.getLibros();
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    computed: {
        datosSeleccionadoLibrosValidados() {
            return this.datosSeleccionadoLibros.map(libro => ({
                ...libro,
                cantidadValida: libro.cantidad !== '' && libro.cantidad !== 0
            }));
        },
        totalConDescuento() {
            let me = this;
            let total = 0;
            this.datosSeleccionadoLibros.forEach(libro => {
                total += libro.precio * libro.cantidad;

            });

            let descuento = me.librosObsequios.porcentaje_descuento;

            let totalDescuento = (total * descuento) / 100;
            let totalConDescuento = total - totalDescuento;

            return totalConDescuento.toFixed(2);
        }
    },
    methods: {
        guardarYmandar() {
            this.guardar();
        },
        cargarLibros() {
            this.popuptodoslosLibros = false;
        },
        getLibrostodos() {
            let me = this;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'get_val_pedidoLibrosObsequiosInfoTodoSinPedido?periodo=' + me.sendPedido.id_periodo)
                .then(res => {
                    const datos = res.data;
                    let librosFiltrados;
                    const idsSeleccionados = new Set(this.datosSeleccionadoLibros.map(libro => libro.id));
                    if (idsSeleccionados.length > 0) {
                        librosFiltrados = datos.filter(libro => idsSeleccionados.has(libro.id));
                    } else {
                        librosFiltrados = datos
                    }
                    this.arregloLibros = librosFiltrados.map(libro => ({
                        id: libro.id,
                        nombrelibro: libro.nombrelibro,
                        precio: libro.precio,
                        stock: libro.pro_stock,
                        codigo: libro.codigo_liquidacion,
                        serie: libro.id_serie,
                        descripcion: libro.descripcion,
                    }));

                    this.$vs.loading.close();
                    me.popuptodoslosLibros = false;
                    this.obtenerDetalleLibros();
                })
                .catch(error => {
                    console.error('Error al obtener libros:', error);
                    this.$vs.loading.close();
                });
        },
        calcularTotalPedido() {
            let total = 0;
            this.datosSeleccionadoLibros.forEach(libro => {
                total += libro.precio * libro.cantidad;
            });
            return (total).toFixed(2);
        },
        calcularTotalPedidoDescuento(descuento) {

            let total = 0;
            this.datosSeleccionadoLibros.forEach(libro => {
                total += libro.precio * libro.cantidad;
            });
            let valorDescuento = 0;
            let totalDescuento = 0;
            valorDescuento = descuento
            totalDescuento = (total * valorDescuento) / 100
            return totalDescuento;
        },
        getLibros() {
            this.$vs.loading();
            this.$http.get(this.$server_url + 'get_val_pedidoLibrosObsequiosInfoTodo/' + this.sendPedido.id_pedido)
                .then(res => {
                    const datos = res.data;
                    const uniqueBooks = datos.reduce((acc, libro) => {
                        if (!acc.some(item => item.codigo_liquidacion === libro.codigo_liquidacion)) {
                            acc.push(libro);
                        }
                        return acc;
                    }, []);

                    this.arregloLibros = uniqueBooks.map(libro => ({
                        id: libro.id,
                        nombrelibro: libro.nombrelibro,
                        precio: libro.precio,
                        stock: libro.stockNotas,
                        codigo: libro.codigo_liquidacion,
                        precio: libro.precio,
                        serie: libro.id_serie,
                        descripcion: libro.descripcion,
                    }));
                    this.$vs.loading.close();
                    this.obtenerDetalleLibros();
                })
                .catch(error => {
                    console.error('Error al obtener libros:', error);
                    this.$vs.loading.close();
                });
        },
        getPorcentajeDescuetoInstitucion() {
            this.$vs.loading();
            this.$http.get(this.$server_url + 'getDescuentoInstitucion/' + this.sendPedido.id_pedido)
                .then(res => {
                    this.porcentajePedidoLibrosObsequios.institucionPorcentaje = res.data[0].descuento;
                    this.$vs.loading.close();
                })
                .catch(error => {
                    console.error('Error al obtener descuento:', error);
                    this.$vs.loading.close();
                });
        },
        agregarLibro() {
            let me = this;
            if (this.infoPedido.libro !== '') {
                const libroSeleccionado = this.arregloLibros.find(libro => libro.nombrelibro === this.infoPedido.libro);
                if (libroSeleccionado) {
                    this.datosSeleccionadoLibros.push({
                        ...libroSeleccionado,
                        cantidad: ""
                    });
                    const index = this.arregloLibros.indexOf(libroSeleccionado);
                    if (index > -1) {
                        this.arregloLibros.splice(index, 1);
                    }

                    this.infoPedido.libro = '';
                } else {
                    console.error('El libro seleccionado no se encuentra en el arreglo de libros.');
                }
            } else {
                console.error('No se ha seleccionado ningún libro.');
            }
        },
        remover(index) {
            const removerItem = this.datosSeleccionadoLibros[index];
            this.datosSeleccionadoLibros.splice(index, 1);
            this.arregloLibros.push(removerItem);
            this.eliminarRegistroDB(removerItem);
        },
        eliminarRegistroDB(removerItem) {

            const data = {
                removerItem: removerItem,
                librosObsequiosId: this.librosObsequios.id
            };
            this.$http.post(this.$server_url + 'eliminarRegistroDetallesPedidoACTA', data)
                .then(res => {
                    console.log('Registro eliminado con éxito:', res);
                    // this.guardar();
                })
                .catch(error => {
                    console.error('Error al eliminar el registro:', error);
                });
        },
        validarCantidad(libro, index) {
            if (libro.cantidad === '0' || libro.cantidad === '') {
                this.cantidadValida = true
                this.eliminarRegistroDB(libro)
                this.remover(index)
            } else {
                this.cantidadValida = false
            }
            if (libro.cantidad < 0) {
                libro.cantidad = 0;
            }
            this.calcularTotalPedido();
        },
        guardar() {
            let me = this;
            if (this.datosSeleccionadoLibros.length === 0) {
                me.$vs.notify({
                    text: 'No hay libros seleccionados para guardar.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            const librosConCantidad = [];
            let cantidadTotal = 0;

            if (this.datosSeleccionadoLibros.length > 0) {
                cantidadTotal = this.datosSeleccionadoLibros.reduce((total, libro) => {
                    return total + Number(libro.cantidad);
                }, 0);
            }

            this.datosSeleccionadoLibros.forEach(libro => {
                const libroConCantidad = {
                    nombrelibro: libro.nombrelibro,
                    codigo: libro.codigo,
                    precio: libro.precio,
                    stock: libro.stock,
                    cantidad: parseInt(libro.cantidad),
                    cantidadPendiente: parseInt(libro.cantidad),
                };
                librosConCantidad.push(libroConCantidad);
            });

            const datosParaGuardar = {
                librosConCantidad: librosConCantidad,
                porcentajeDescuento: me.librosObsequios.porcentaje_descuento,
                id_librosObsequios: me.librosObsequios.id,
                cantidadTotal: cantidadTotal,

            };
            this.$vs.loading();
            this.$http.post(this.$server_url + 'guardarDetallesModificarPedidoLibrosObsequios', datosParaGuardar)
                .then(res => {
                    this.$vs.loading.close();
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        return
                    }
                })
                .catch(error => {
                    console.error('Error al guardar los datos:', error);
                    this.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error al guardar los datos-',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    return

                });
        },
        obtenerDetalleLibros() {
            let me = this;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'obtenerDatosDetalleLibros/' + me.librosObsequios.id)
                .then(response => {
                    this.datosSeleccionadoLibros = response.data.map(detalle => ({
                        nombrelibro: detalle.pro_nombre,
                        codigo: detalle.pro_codigo,
                        precio: detalle.p_libros_valor_u,
                        stock: detalle.pro_deposito,
                        cantidad: detalle.p_libros_cantidad
                    }));
                    if (this.datosSeleccionadoLibros.length > 0) {
                        this.cantidadItemsPedidos = this.datosSeleccionadoLibros.length
                    }
                    const detalles = this.datosSeleccionadoLibros;

                    detalles.forEach(detalle => {
                        const index = this.arregloLibros.findIndex(libro => libro.codigo === detalle.codigo);
                        if (index !== -1) {
                            this.arregloLibros.splice(index, 1);
                        }
                    });

                    this.$vs.loading.close();
                })
                .catch(error => {
                    console.error('Error al obtener los datos del detalle de libros:', error);
                    this.$vs.loading.close();
                });
        },
    }
};
</script>

<style scoped>
.popophijo {
    z-index: 51010;
    position: fixed;
}
</style>
