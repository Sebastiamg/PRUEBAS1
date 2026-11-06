<template>
<vs-row>
    <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
      <vs-row vs-type="flex" vs-justify="center" vs-w="12">
        <vs-checkbox icon-pack="feather" icon="icon-check" color="danger" v-model="obsequiosCheck" @input="selectedOption = '100%';solomandar()"><b>MARCAR COMO OBSEQUIOS</b></vs-checkbox><br>
        <vs-alert :active="obsequiosCheck" color="danger" icon-pack="feather" icon="icon-info">
          <span>Este pedido se guardara como <b>OBSEQUIO</b></span>
        </vs-alert>
      </vs-row>
    </vs-col> -->
    <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-4">
      <vs-row vs-type="flex" vs-justify="center" vs-w="12">
        <b>Detalle pedido</b>
      </vs-row>
    </vs-col> -->
    <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-4">
        <vs-row vs-justify="center" vs-w="12">
            <b>Detalle pedido</b>
            <vs-divider>Configuracion del pedido:</vs-divider>
            <!-- <b>Configuracion del pedido:</b> -->
            <div style="display: flex; flex-wrap: wrap;">
                <vs-radio v-if="!obsequiosCheck" v-model="selectedOption" vs-value="institucion" class="mr-5 ml-5" @change="verificarSeleccionDescuento">Descuento por institución</vs-radio>
                <vs-radio v-model="selectedOption" vs-value="100%" class="ml-5" @change="verificarSeleccionDescuento">Descuento 100%</vs-radio>
                <vs-radio v-if="!obsequiosCheck" v-model="selectedOption" vs-value="otro" class="ml-5" @change="verificarSeleccionDescuento">Otro porcentaje</vs-radio>
                <vs-checkbox icon-pack="feather" icon="icon-check" color="danger" v-model="obsequiosCheck" @change="handleCheckboxChange" class="ml-5">
                    <b>MARCAR COMO OBSEQUIOS</b>
                </vs-checkbox>
            </div>
        </vs-row>
        <vs-row vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2 mb-4">
            <div>
                <vs-alert :active="obsequiosCheck" color="danger" icon-pack="feather" icon="icon-info">
                    <span>Este pedido se guardara como <b>OBSEQUIO, NO COMO HIJO DOCENTES</b></span>
                </vs-alert>
            </div>
        </vs-row>
    </vs-col>
    <vs-row>
        <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-col v-if="selectedOption === 'institucion'" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="m-2">
                        <div>Porcentaje de institución:</div>
                        <vs-input label="" class="w-1/6" v-model="porcentajePedidoLibrosObsequios.institucionPorcentaje" readonly />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col v-else-if="selectedOption === '100%'" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="m-2">
                        <div>Porcentaje del 100%:</div>
                        <vs-input label="" class="w-1/6" v-model="porcentajePedidoLibrosObsequios.procentaje100" readonly />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col v-else-if="selectedOption === 'otro'" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="m-2">
                        <div>Otro porcentaje (%):</div>
                        <vs-input 
                            label="" 
                            class="w-1/6" 
                            v-model="porcentajePedidoLibrosObsequios.otroPorcentaje" 
                            type="number" 
                            min="0" 
                            max="100" 
                            @blur="validarOtroPorcentaje"
                            @input="verificarSeleccionDescuento"
                        />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-col>
    </vs-row>

    <br><br>
    <vs-row>
        <vs-divider>Agregar Libros:</vs-divider>
        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
            <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                    <!-- <v-select :options="arregloLibros" :reduce="arregloLibros => arregloLibros.nombrelibro" label="nombrelibro"
              class="w-full h-100" placeholder="--Seleccione--" v-model="infoPedido.libro"  /> -->
                    <v-select :options="arregloLibros" :reduce="arregloLibros => arregloLibros.nombrelibro" label="nombrelibro" class="w-full h-100" placeholder="--Seleccione--" v-model="infoPedido.librosSeleccionados" multiple />
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
                    <vs-input label="Cantidad: *" class="w-full m-1" placeholder="Cantidad" icon="mode_edit" type="number" min="0" v-model="tr.cantidad" @blur="validarCantidad(tr,k);guardarYmandar(tr,k)" />
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
    <vs-popup small title="Confirmación" :active.sync="popuptodoslosLibros">
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
            // infoPedido: {
            //   libro: '',
            // },
            infoPedido: {
                librosSeleccionados: []
            },
            datosSeleccionadoLibros: [],
            selectedOption: '',
            porcentajePedidoLibrosObsequios: {
                institucionPorcentaje: 0,
                procentaje100: 100,
                otroPorcentaje: ''
            },
            cantidadValida: false,
            cantidadPedidoTotal: 0,
            cantidadItemsPedidos: 0,
            popuptodoslosLibros: false,
            obsequiosCheck: false,
            mixinIdInicioFormatoNewData: null,
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
        this.getLibros();
        this.getPorcentajeDescuetoInstitucion();
        if (this.librosObsequios.estado_libros_obsequios === 8) {
            me.obsequiosCheck = true;
        }
        me.solomandar();
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
            let total = 0;
            this.datosSeleccionadoLibros.forEach(libro => {
                total += libro.precio * libro.cantidad;

            });

            let descuento = 0;
            if (this.selectedOption === 'institucion') {
                descuento = this.porcentajePedidoLibrosObsequios.institucionPorcentaje;
            } else if (this.selectedOption === '100%') {
                descuento = this.porcentajePedidoLibrosObsequios.procentaje100;
            } else if (this.selectedOption === 'otro') {
                descuento = this.porcentajePedidoLibrosObsequios.otroPorcentaje || 0;
            }

            let totalDescuento = (total * descuento) / 100;
            let totalConDescuento = total - totalDescuento;

            return totalConDescuento.toFixed(2);
        }
    },
    methods: {
        verificarLibrosobsequios() {
            for (let idx = this.datosSeleccionadoLibros.length - 1; idx >= 0; idx--) {
                if (!this.datosSeleccionadoLibros[idx].cantidad) {
                    // Eliminar el registro con la cantidad inválida
                    this.remover(idx);
                }
            }
        },
        verificarSeleccionDescuento() {
            if (this.selectedOption) {
                this.guardar();
            }
        },
        validarOtroPorcentaje() {
            let porcentaje = parseFloat(this.porcentajePedidoLibrosObsequios.otroPorcentaje);
            
            if (isNaN(porcentaje) || porcentaje < 0) {
                this.porcentajePedidoLibrosObsequios.otroPorcentaje = 0;
            } else if (porcentaje > 100) {
                this.porcentajePedidoLibrosObsequios.otroPorcentaje = 100;
            }
        },
        handleCheckboxChange() {
            if (this.obsequiosCheck) {
                // Si se marca como obsequio, forzar a 100% de descuento
                this.selectedOption = '100%';
            } else {
                // Si se desmarca, mantener la selección actual o usar institución por defecto
                if (this.selectedOption === '100%') {
                    this.selectedOption = 'institucion';
                }
            }
            this.solomandar();
        },
        // cambioObsequio(){
        //   let me = this;
        //   if (me.obsequiosCheck) {
        //     me.selectedOption = '100%';
        //   } else {
        //     me.selectedOption = 'institucion';
        //   }
        // },
        cargarLibros() {
            this.popuptodoslosLibros = false;
        },
        getLibrostodos() {
            let me = this;
            this.$vs.loading();
            // Acceder a la key 'pid' desde localStorage
            let pid = localStorage.getItem('pid');

            // Definir la rutaxperiodo en base al valor de pid
            let rutaxperiodo = '';
            if (pid <= me.mixinIdInicioFormatoNewData) {
                rutaxperiodo = 'get_val_pedidoLibrosObsequiosInfoTodoSinPedido?periodo=';
            } else if (pid > me.mixinIdInicioFormatoNewData) {
                rutaxperiodo = 'get_Libros_todos_activos?periodo=';
            }
            this.$http.get(this.$server_url + rutaxperiodo + me.sendPedido.id_periodo)
                .then(res => {
                    const datos = res.data;
                    let librosFiltrados;
                    // Obtener los IDs de los libros ya seleccionados
                    const idsSeleccionados = new Set(this.datosSeleccionadoLibros.map(libro => libro.id));
                    if (idsSeleccionados.length > 0) {
                        librosFiltrados = datos.filter(libro => idsSeleccionados.has(libro.id));
                    } else {
                        librosFiltrados = datos
                    }
                    // Filtrar los datos recibidos para eliminar los libros que ya están en datosSeleccionadoLibros
                    // const librosFiltrados = datos.filter(libro => idsSeleccionados.has(libro.id));

                    // Mapear los datos filtrados
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
        guardarYmandar() {
            // console.log("dos")   
            this.guardar();
            this.cantidadItemsPedidos = this.datosSeleccionadoLibros.length
            this.$emit('guardar_informacion', this.cantidadItemsPedidos, this.librosObsequios.estado_libros_obsequios, this.obsequiosCheck);
        },
        solomandar() {
            this.cantidadItemsPedidos = this.datosSeleccionadoLibros.length
            this.$emit('guardar_informacion', this.cantidadItemsPedidos, this.librosObsequios.estado_libros_obsequios, this.obsequiosCheck);
            this.guardar();
        },
        getLibros() {
            let me = this;
            this.$vs.loading();
            // Acceder a la key 'pid' desde localStorage
            let pid = localStorage.getItem('pid');
            // Definir la rutaxperiodo en base al valor de pid
            let rutaxperiodo = '';
            if (pid <= me.mixinIdInicioFormatoNewData) {
                rutaxperiodo = 'get_val_pedidoLibrosObsequiosInfoTodo/';
            } else if (pid > me.mixinIdInicioFormatoNewData) {
                rutaxperiodo = 'get_val_pedidoLibrosObsequiosInfoTodo_new/';
            }
            this.$http.get(this.$server_url + rutaxperiodo + this.sendPedido.id_pedido)
                .then(res => {
                    const datos = res.data;
                    // Utiliza un mapa para filtrar duplicados por 'codigo_liquidacion'
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
                    // Configurar el tipo de descuento después de obtener el porcentaje de la institución
                    this.configurarTipoDescuento();
                })
                .catch(error => {
                    console.error('Error al obtener descuento:', error);
                    this.$vs.loading.close();
                });
        },
        // agregarLibro() {
        //   let me = this;
        //   if (this.infoPedido.libro !== '') {
        //     const libroSeleccionado = this.arregloLibros.find(libro => libro.nombrelibro === this.infoPedido.libro);
        //     if (libroSeleccionado) {
        //       this.datosSeleccionadoLibros.push({ ...libroSeleccionado, cantidad: "" });

        //       // Eliminar el libro seleccionado del array arregloLibros
        //       const index = this.arregloLibros.indexOf(libroSeleccionado);
        //       if (index > -1) {
        //         this.arregloLibros.splice(index, 1);
        //       }

        //       this.infoPedido.libro = '';
        //     } else {
        //       console.error('El libro seleccionado no se encuentra en el arreglo de libros.');
        //     }
        //   } else {
        //     console.error('No se ha seleccionado ningún libro.');
        //   }
        // },
        agregarLibro() {
            let me = this;
            // Asegúrate de que haya libros seleccionados
            if (this.infoPedido.librosSeleccionados.length > 0) {
                // Iterar sobre los libros seleccionados
                this.infoPedido.librosSeleccionados.forEach((libroSeleccionadoNombre) => {
                    const libroSeleccionado = this.arregloLibros.find(libro => libro.nombrelibro === libroSeleccionadoNombre);
                    if (libroSeleccionado) {
                        this.datosSeleccionadoLibros.push({
                            ...libroSeleccionado,
                            cantidad: ""
                        });

                        // Eliminar el libro seleccionado del array arregloLibros
                        const index = this.arregloLibros.indexOf(libroSeleccionado);
                        if (index > -1) {
                            this.arregloLibros.splice(index, 1);
                        }
                    } else {
                        console.error('El libro seleccionado no se encuentra en el arreglo de libros.');
                    }
                });

                // Limpiar el modelo de libros seleccionados
                this.infoPedido.librosSeleccionados = [];
            } else {
                console.error('No se han seleccionado libros.');
            }
        },
        remover(index) {
            // Obtener el elemento a eliminar
            const removerItem = this.datosSeleccionadoLibros[index];

            // Eliminar el elemento del array datosSeleccionadoLibros
            this.datosSeleccionadoLibros.splice(index, 1);

            // Agregar el elemento de vuelta al array arregloLibros
            this.arregloLibros.push(removerItem);

            // Enviar una solicitud al servidor para eliminar el registro correspondiente
            this.eliminarRegistroDB(removerItem);
        },
        eliminarRegistroDB(removerItem) {

            const data = {
                removerItem: removerItem,
                librosObsequiosId: this.librosObsequios.id
            };
            this.$http.post(this.$server_url + 'eliminarRegistroDetallePedidoLibro', data)
                .then(res => {
                    // Maneja la respuesta del servidor si es necesario
                    console.log('Registro eliminado con éxito:', res);
                    // this.guardar();
                })
                .catch(error => {
                    // Maneja los errores si es necesario
                    console.error('Error al eliminar el registro:', error);
                });
        },
        validarCantidad(libro, index) {
            // this.$set(libro, 'cantidadValida', libro.cantidad !== '' && libro.cantidad !== 0);
            if (libro.cantidad === '0' || libro.cantidad === '') {
                this.cantidadValida = true
                this.eliminarRegistroDB(libro)
                this.remover(index)
                // console.log(this.cantidadValida);
            } else {
                this.cantidadValida = false
                // console.log(this.cantidadValida);
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
            let cantidadTotal = 0; // Establecer cantidadTotal en 0 por defecto

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

            let porcentajeDescuento;
            if (this.selectedOption === 'institucion') {
                porcentajeDescuento = this.porcentajePedidoLibrosObsequios.institucionPorcentaje;
            } else if (this.selectedOption === '100%') {
                porcentajeDescuento = this.porcentajePedidoLibrosObsequios.procentaje100;
            } else if (this.selectedOption === 'otro') {
                porcentajeDescuento = this.porcentajePedidoLibrosObsequios.otroPorcentaje;
            }

            const datosParaGuardar = {
                librosConCantidad: librosConCantidad,
                porcentajeDescuento: porcentajeDescuento,
                id_librosObsequios: me.librosObsequios.id,
                cantidadTotal: cantidadTotal,
                obsequio: me.obsequiosCheck,

            };
            if (!porcentajeDescuento && porcentajeDescuento !== 0) {
                me.$vs.notify({
                    text: 'Falta el porcentaje de descuento',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                })
                return;
            }
            // Validación adicional para "otro porcentaje"
            if (this.selectedOption === 'otro') {
                const porcentajeNumero = parseFloat(this.porcentajePedidoLibrosObsequios.otroPorcentaje);
                if (isNaN(porcentajeNumero) || porcentajeNumero < 0 || porcentajeNumero > 100) {
                    me.$vs.notify({
                        text: 'El porcentaje debe ser un número válido entre 0 y 100',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                    return;
                }
            }
            // const cantidadInvalida = this.datosSeleccionadoLibros.some(libro => {
            //     const cantidadNumero = parseInt(libro.cantidad);
            //     return cantidadNumero === 0 || isNaN(cantidadNumero);
            // });
            // if (cantidadInvalida || this.cantidadValida) {
            //     me.$vs.notify({
            //         text: 'La cantidad no puede estar vacía o ser igual a 0',
            //         color: 'danger',
            //         iconPack: 'feather',
            //         icon: 'icon-x'
            //     });
            //     return;
            // }
            this.$vs.loading();
            this.$http.post(this.$server_url + 'guardarDatosPedidoLibrosObsequios', datosParaGuardar)
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
        // Función para obtener los datos del detalle de libros desde el servidor
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
                        this.guardarYmandar();
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
        configurarTipoDescuento() {
            if (this.librosObsequios.porcentaje_descuento === 100) {
                this.selectedOption = '100%';
                this.porcentajePedidoLibrosObsequios.procentaje100 = this.librosObsequios.porcentaje_descuento;
            } else if (this.librosObsequios.porcentaje_descuento === this.porcentajePedidoLibrosObsequios.institucionPorcentaje) {
                this.selectedOption = 'institucion';
            } else if (this.librosObsequios.porcentaje_descuento !== undefined && this.librosObsequios.porcentaje_descuento !== null) {
                // Es un porcentaje personalizado
                this.selectedOption = 'otro';
                this.porcentajePedidoLibrosObsequios.otroPorcentaje = this.librosObsequios.porcentaje_descuento;
            }
            
            if (this.selectedOption) {
                let descuentoDatos = this.librosObsequios.porcentaje_descuento;
                this.calcularTotalPedidoDescuento(descuentoDatos);
            }
        },
    }
};
</script>
