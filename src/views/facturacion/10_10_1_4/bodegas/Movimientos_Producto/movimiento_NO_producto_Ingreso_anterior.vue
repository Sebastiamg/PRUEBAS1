<template>
    <vx-card fixed-height="true">
        <!-- SECCION REGISTRO -->
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <font style="font-size: 11.5px">&nbsp;Seleccione el Proveedor</font><br>
                <!-- <v-select :options="Proveedores" :reduce="Proveedores => Proveedores.prov_codigo" label="prov_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="idmovimiento.prov_codigo" @input="guardarProveedor()" /> -->
                <v-select :options="Proveedores" :reduce="Proveedores => Proveedores.prov_codigo" label="prov_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="idmovimiento.prov_codigo" />
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-lg="12">
                <font style="font-size: 11.5px">&nbsp;Detalle</font><br>
                <vs-textarea v-model="idmovimiento.observacion" rows="3" placeholder="Ingrese un detalle" class="w-full" />
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <font style="font-size: 11.5px">&nbsp;Tipo de Movimiento</font><br>
                <vs-radio :disabled="deshabilitarRadio" class="m-2" color="primary" v-model="tipoIngreso" vs-name="radiosTipo" vs-value="0">Ingreso</vs-radio>
                <vs-radio :disabled="deshabilitarRadio" class="m-2" color="danger" v-model="tipoIngreso" vs-name="radiosTipo" vs-value="1">Egreso</vs-radio>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <div align="center">
                    <vs-button :color=btn_propiedades.btn_color @click="f_guardar_movimiento()"> {{ btn_propiedades.btn_txt }} </vs-button>
                </div>
            </vs-col>
            <vs-col v-if="CompletoIngreso" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-divider>Búsqueda de productos</vs-divider>
                <!-- {{ idmovimiento }} -->
                <!-- {{ infoPedido.libro }} hola -->
                <!-- <v-select :options="arregloLibros" :reduce="arregloLibros => arregloLibros.nombrelibro" label="nombrelibro" class="w-full h-100" placeholder="--Seleccione un texto--" v-model="infoPedido.libro" /> -->
                <vs-row vs-justify="center" vs-w="12">
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <div align="center">
                            <table>
                                <tr>
                                    <td width="500">
                                        <vs-input label="Filtre por código o nombre" placeholder="Filtre por código o nombre" icon="search" class="w-full mt-5" @keyup.enter="getLibrosxparametro()" v-model="filtrocodnombre" />
                                        <small class="mt-2" v-if="encontroresultados == 1"><span class="text-warning">El producto no existe.</span></small>
                                    </td>
                                    <td width="200">
                                        <vs-button @click="getLibrosxparametro()" style="margin-top: 36px;" color="success" type="relief">Buscar</vs-button>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </vs-col>
                </vs-row>
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" v-if="arregloLibroseleccion.length > 0">
                        <vs-divider>Seleccione el producto</vs-divider>
                        <vs-table max-items="5" search pagination :data="arregloLibroseleccion">
                            <template slot="thead">
                                <vs-th>Nombres</vs-th>
                                <vs-th>Perfil</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td>
                                        {{data[indextr].pro_codigo}}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{data[indextr].nombrelibro}}<br>
                                    </vs-td>
                                    <vs-td>
                                        <div style="display: flex;">
                                            <div>
                                                <vx-tooltip style="display: inline-block;" text="Asignar beneficiario" position="top" color="primary">
                                                    <vs-button class="modal-default-button" size="small" color="success" type="filled" @click="seleccionProducto(tr)" icon-pack="feather" icon="icon-check">Seleccionar</vs-button>
                                                </vx-tooltip> &nbsp;
                                            </div>
                                        </div>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-col v-if="CompletoIngreso" vs-lg="12" vs-sm="12" vs-xs="12" class="mb-6">
            <vs-divider>Cantidad: {{ datosSeleccionadoLibros.length }}</vs-divider>
            <vs-table :data="datosSeleccionadoLibros" no-data-text="No hay datos disponibles">
                <vs-tr v-for="(tr, k) in datosSeleccionadoLibros" :key="k" height="200">
                    <vs-td width="50">
                        <br /><b>{{ k + 1 }}</b>
                    </vs-td>
                    <vs-td width="550">
                        <b>Libro: {{ tr.nombrelibro }}</b><br />
                        <b>Codigo: </b> {{ tr.pro_codigo }}<br />
                    </vs-td>
                    <vs-td width="500">
                        <font style="font-size: 11.5px">&nbsp;Bodega</font><br>
                        <v-select :options="Empresas" :reduce="Empresas => Empresas.id" label="descripcion_corta" class="w-full h-100" placeholder="--Seleccione--" @input="validarCantidad(tr,k)" v-model="tr.emp_id" :disabled="tr.disabled" />
                    </vs-td>
                    <vs-td width="500">
                        <font style="font-size: 11.5px">&nbsp;Tipo Bodega</font><br>
                        <v-select :options="options1" :reduce="options1 => options1.value" label="text" class="w-full h-100" placeholder="--Seleccione--" v-model="tr.fmdp_tipo_bodega" @input="validarCantidad(tr,k)" :disabled="!tr.emp_id || tr.disabled" />
                    </vs-td>
                    <vs-td width="1000">
                        <vs-input class="w-full m-1" label="Cantidad: *" style="width: 200px;" placeholder="Cantidad" icon="mode_edit" min="0" v-model="tr.cantidad" @keypress="validateInput" @paste="validatePaste" @blur="validarCantidad(tr,k)" :disabled="!tr.fmdp_tipo_bodega || !tr.emp_id" />
                        <!-- <vs-input label="Cantidad: *" class="w-full m-1" placeholder="Cantidad" icon="mode_edit" type="number" min="0" v-model="tr.cantidad"/> -->
                    </vs-td>
                    <vs-td>
                        <vs-button @click="remover(k);" color="danger" type="relief" icon="delete">Quitar</vs-button>
                    </vs-td>
                </vs-tr>
            </vs-table>
        </vs-col>
        <vs-col vs-justify="center" vs-align="center" vs-w="12" class="mt-2" v-if="verificarLengthProducto == 1">
            <div align="center">
                <div align="center" style="font-size: 20px; font-weight: bold;">Una vez de click en el botón "Finalizar Ingreso No Operativo" no podrá a volver a editar
                    y los stock's de los productos incrementarán las cantidades correspondientemente.</div>
                <br>
                <br>
                <vs-button @click="guardarConStock()" type="relief">Finalizar Ingreso No Operativo</vs-button>&emsp;
            </div>
            <!-- <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button> -->
        </vs-col>
    </vx-card>
    </template>
    
    <script>
    import Vue from "vue";
    import axios from "axios";
    import vSelect from "vue-select";
    export default {
        data() {
            return {
                options1: [{
                        text: '--Seleccione--',
                        value: null
                    },
                    {
                        text: 'Notas',
                        value: 1
                    },
                    {
                        text: 'Facturas',
                        value: 2
                    },
                ],
                arregloLibros: [],
                Empresas: [],
                Proveedores: [],
                MovimientoProducto: [],
                datosSeleccionadoLibros: [],
                desabilitarindexemp_id: false,
                desabilitarindexfmdp_tipo_bopdega: false,
                datosGuardadosLibros: [],
                infoPedido: {
                    libro: '',
                },
                verificarLengthProducto: 0,
                arregloLibroseleccion: [],
                filtrocodnombre: '',
                encontroresultados: 0,
                tipoIngreso: 0,
                deshabilitarRadio: false,
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
            SecuencialIngreso: {
                type: String,
                default: '', // Asigna el valor por defecto aquí
            },
            btn_propiedades: Object,
        },
        mounted() {
            this.btn_propiedades.accion_guardar == 2 ? this.deshabilitarRadio = true : this.deshabilitarRadio = false;
            // console.log(this.idmovimiento, "yeeeeeeeeeeeee");
            if (this.idmovimiento.fmp_estado == 0) {
                this.tipoIngreso = 0;
            } else if (this.idmovimiento.fmp_estado == 2) {
                this.tipoIngreso = 1;
            }
            this.getProveedores();
            this.getEmpresa();
            if (this.btn_propiedades.accion_guardar === 2) {
                // console.log("editando")
                this.obtenerDetalleIngreo_Producto_NO();
            }
            // this.getLibros();
        },
        methods: {
            getProveedores() {
                this.$vs.loading();
                this.$http.get(this.$server_url + 'Get_provedor')
                    //axios.get(this.$apifacturacion_url + 'f_Producto')
                    .then(res => {
                        //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                        //this.Productos = resultado;
                        this.Proveedores = res.data;
                        // console.log(this.Productos);
                        // console.log(this.Proveedores);
                    })
                    .catch(err => {
                        console.log(err)
                    })
                    .finally(() => {
                        this.$vs.loading.close();
                    });
            },
            getEmpresa() {
                let me = this;
                this.$http.get(this.$server_url + 'empresa2')
                    //axios.get(this.$apifacturacion_url + 'f_Producto')
                    .then(res => {
                        //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                        //this.Productos = resultado;
                        let resultado = res.data.filter(e => e.id !== 2);
                        this.Empresas = resultado;
                        // console.log(this.Productos);
                        // console.log(this.Proveedores);
                    })
                    .catch(err => {
                        console.log(err)
                    })
            },
            validateInput(event) {
                const charCode = event.which ? event.which : event.keyCode;
                if (charCode < 48 || charCode > 57) {
                    event.preventDefault();
                }
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
            seleccionProducto(tr) {
                console.log(tr, "data recibida");
                this.infoPedido.libro = tr.nombrelibro;
                this.agregarLibro();
                this.arregloLibroseleccion = [];
            },
            agregarLibro() {
                let me = this;
                // console.log(me.datosSeleccionadoLibros,"datoslibroseleccionado");
                // Verificar si el último libro añadido tiene los campos necesarios completos
                if (this.datosSeleccionadoLibros.length > 0) {
                    let incompleto = false;
    
                    this.datosSeleccionadoLibros.forEach(libro => {
                        if ((!libro.cantidad || libro.cantidad == 0) || !libro.fmdp_tipo_bodega || !libro.emp_id) {
                            incompleto = true;
                        }
                    });
    
                    if (incompleto) {
                        me.$vs.notify({
                            text: "Complete la información de los libros añadidos, antes de añadir uno nuevo.",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        return;
                    }
                }
                if (this.infoPedido.libro !== '') {
                    const libroSeleccionado = this.arregloLibroseleccion.find(libro => libro.nombrelibro === this.infoPedido.libro);
                    // console.log(me.arregloLibroseleccion, "libro2");
                    // console.log(me.infoPedido, "infopedido2");
                    if (libroSeleccionado) {
                        this.datosSeleccionadoLibros.push({
                            ...libroSeleccionado,
                            cantidad: "",
                            // cantidadAnterior:"",
                            // fmdp_tipo_bodegaAnterior:"",
                        });
    
                        // Eliminar el libro seleccionado del array arregloLibros
                        /*
                        const index = this.arregloLibros.indexOf(libroSeleccionado);
                        if (index > -1) {
                            this.arregloLibros.splice(index, 1);
                        }
                            */
    
                        this.infoPedido.libro = '';
                    } else {
                        console.error('El libro seleccionado no se encuentra en el arreglo de libros.');
                    }
                } else {
                    me.$vs.notify({
                        text: "No se ha seleccionado ningún libro.",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                }
            },
            getLibrosxparametro() {
                let me = this;
                console.log(this.incompleto)
                if (me.filtrocodnombre.length <= 1) {
                    me.$vs.notify({
                        text: 'La busqueda debe ser mayor a 1 caracter.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return false;
                }
                this.$vs.loading();
                this.$http.get(this.$server_url + "GetProductoxcodynombre?busquedacodnombre=" + this.filtrocodnombre)
                    .then(res => {
                        const datos = res.data;
                        this.arregloLibroseleccion = datos.map(libro => ({
                            pro_codigo: libro.pro_codigo,
                            nombrelibro: libro.pro_nombre,
                        }));
                        console.log(this.arregloLibroseleccion.length, "arregloseleccion");
                        if (this.arregloLibroseleccion.length <= 0) {
                            this.encontroresultados = 1
                        } else {
                            this.encontroresultados = 0;
                        }
                        this.$vs.loading.close();
                    })
                    .catch(error => {
                        console.error('Error al obtener libros:', error);
                        this.$vs.loading.close();
                    });
            },
            getLibros() {
                this.$vs.loading();
                this.$http.get(this.$server_url + 'GetProducto')
                    .then(res => {
                        const datos = res.data;
                        this.arregloLibros = datos.map(libro => ({
                            pro_codigo: libro.pro_codigo,
                            nombrelibro: libro.pro_nombre,
                        }));
                        this.obtenerDetalleIngreo_Producto_NO();
                    })
                    .catch(error => {
                        console.error('Error al obtener libros:', error);
                        this.$vs.loading.close();
                    });
            },
            remover(index) {
                // Obtener el elemento a eliminar
                const removerItem = this.datosSeleccionadoLibros[index];
    
                // Eliminar el elemento del array datosSeleccionadoLibros
                // this.datosSeleccionadoLibros.splice(index, 1);
    
                // Crear un nuevo objeto con solo las propiedades deseadas
                // const nuevoItem = {
                //     cantidad: "",
                //     nombrelibro: removerItem.nombrelibro,
                //     pro_codigo: removerItem.pro_codigo
                // };
    
                // Agregar el elemento de vuelta al array arregloLibros
                // console.log(removerItem,"removeritem");
                // return
                // this.arregloLibros.push(nuevoItem);
    
                // Enviar una solicitud al servidor para eliminar el registro correspondiente
                this.$vs.loading()
                this.eliminarRegistroDB(removerItem);
                this.$vs.loading.close();
            },
            eliminarRegistroDB(removerItem) {
                if ((this.idmovimiento.fmp_id == 'undefined') || (this.idmovimiento.fmp_id == '') || (this.idmovimiento.fmp_id == null)) {
                    const data = {
                        removerItem: removerItem,
                        id_movimientoproducto: this.CompletoIngreso
                    };
                    this.$http.post(this.$server_url + 'eliminarDetalleMovimientoProducto', data)
                        .then(res => {
                            // Maneja la respuesta del servidor si es necesario
                            this.$vs.notify({
                                text: 'Registro eliminado con éxito.',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            // console.log('Registro eliminado con éxito:', res);
                            // this.guardar();
                            this.obtenerDetalleIngreo_Producto_NO();
                        })
                        .catch(error => {
                            // Maneja los errores si es necesario
                            console.error('Error al eliminar el registro:', error);
                        });
                } else if ((this.idmovimiento.fmp_id != 'undefined') || (this.idmovimiento.fmp_id != '') || (this.idmovimiento.fmp_id != null)) {
                    const data = {
                        removerItem: removerItem,
                        id_movimientoproducto: this.idmovimiento.fmp_id
                    };
                    this.$http.post(this.$server_url + 'eliminarDetalleMovimientoProducto', data)
                        .then(res => {
                            // Maneja la respuesta del servidor si es necesario
                            this.$vs.notify({
                                text: 'Registro eliminado con éxito.',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            })
                            // console.log('Registro eliminado con éxito:', res);
                            // this.guardar();
                            this.obtenerDetalleIngreo_Producto_NO();
    
                        })
                        .catch(error => {
                            // Maneja los errores si es necesario
                            console.error('Error al eliminar el registro:', error);
                        });
                }
            },
            validarCantidad(libro, index) {
                // console.log(libro);
                // return
                this.validarCamposCompletos();
                let libroExistente_cantidadnull = this.datosGuardadosLibros.some(libronuevo => {
                    // console.log(libronuevo,"1", libro,"2", "verficiacion1");
                    return libronuevo.pro_codigo === libro.pro_codigo &&
                        libronuevo.fmdp_tipo_bodega === libro.fmdp_tipo_bodega &&
                        libronuevo.emp_id === libro.emp_id &&
                        (libro.cantidad === '' || libro.cantidad === null || libro.cantidad === 'undefined');
                });
                // console.log(libroExistente_cantidadnotnull,"1",libroExistente_cantidadnull,"2");
                // console.log(libroExistente,"1",libro,"2",this.datosSeleccionadoLibros,"3",this.datosGuardadosLibros,"4")
                // return
                if (!libro.emp_id) {
                    this.$vs.notify({
                        text: 'Seleccione una bodega.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 5000,
                    });
                    return;
                } else if (!libro.fmdp_tipo_bodega) {
                    this.$vs.notify({
                        text: 'Seleccione el tipo bodega.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 5000,
                    });
                    return;
                } else if (libroExistente_cantidadnull) {
                    this.$vs.notify({
                        text: "Ese libro ya existe en la lista.",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                    this.obtenerDetalleIngreo_Producto_NO();
                    return;
                } else if ((libro.cantidad === '')) {
                    this.$vs.notify({
                        text: 'Ingrese la cantidad, debe ser mayor a 0.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 5000,
                    });
                    return;
                } else if (libro.cantidad === '0') {
                    this.$vs.notify({
                        text: 'No puede ingresar un valor "0" ó nulo.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 5000,
                    });
                    this.obtenerDetalleIngreo_Producto_NO();
                    return;
                } else {
                    // if (libro.cantidad === '0' || libro.cantidad === '') {
                    //     this.eliminarRegistroDB(libro)
                    //     this.remover(index)
                    // }
                    if (libro.cantidad < 0) {
                        libro.cantidad = 0;
                    }
                    this.guardar();
                }
            },
            validarCamposCompletos() {
                this.datosSeleccionadoLibros.forEach((libro, index) => {
                    if (libro.emp_id && libro.fmdp_tipo_bodega && libro.cantidad) {
                        this.$set(this.datosSeleccionadoLibros[index], 'disabled', true);
                    } else {
                        this.$set(this.datosSeleccionadoLibros[index], 'disabled', false);
                    }
                });
            },
            guardarProveedor() {
                let me = this;
                let varcoadigomovimiento = '';
                // console.log(me.idmovimiento.fmp_id, "idmovimientfoinal");
                // console.log(me.CompletoIngreso, "idmovimientfoina2l");
                // return
                if ((me.idmovimiento.fmp_id == 'undefined') || (me.idmovimiento.fmp_id == '') || (me.idmovimiento.fmp_id == null)) {
                    varcoadigomovimiento = me.CompletoIngreso
                } else if ((me.idmovimiento.fmp_id != 'undefined') || (me.idmovimiento.fmp_id != '') || (me.idmovimiento.fmp_id != null)) {
                    varcoadigomovimiento = me.idmovimiento.fmp_id
                }
                let datos = {
                    "prov_codigo": this.idmovimiento.prov_codigo,
                    "fmp_id": varcoadigomovimiento,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
                this.$http.post(this.$server_url + 'Modificarproveedor_MovientoProducto', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        // this.getMaterialcubiertaParametro();
                        me.$vs.notify({
                            text: 'Proveedor guardado con exito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    })
                    .catch(function () {
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Proveedor no se pudo guardar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            },
            guardar() {
                let me = this;
                const librosConCantidad = [];
                let cantidadTotal = 0; // Establecer cantidadTotal en 0 por defecto
                let incompleto = false;
                // console.log(this.datosSeleccionadoLibros);
                // return
                // console.log(me.idmovimiento.fmp_id, "idmovimientfoinal");
                // console.log(me.CompletoIngreso, "idmovimientfoina2l");
                // return
                if (this.datosSeleccionadoLibros.length > 0) {
                    cantidadTotal = this.datosSeleccionadoLibros.reduce((total, libro) => {
                        return total + Number(libro.cantidad);
                    }, 0);
                }
    
                this.datosSeleccionadoLibros.forEach(libro => {
                    if ((!libro.cantidad || libro.cantidad == 0) || !libro.fmdp_tipo_bodega || !libro.emp_id) {
                        incompleto = true;
                    }
                });
    
                if (incompleto) {
                    me.$vs.notify({
                        text: "Complete la información de los libros añadidos para guardar.",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                    return;
                }
    
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
    
                if ((me.idmovimiento.fmp_id == 'undefined') || (me.idmovimiento.fmp_id == '') || (me.idmovimiento.fmp_id == null)) {
                    // console.log("entro al if");
                    const datosParaGuardar = {
                        librosConCantidad: librosConCantidad,
                        id_movimientoproducto: me.CompletoIngreso,
                        cantidadTotal: cantidadTotal,
                    };
                    this.$vs.loading();
                    this.$http.post(this.$server_url + 'guardarDatosMovimientosProducto', datosParaGuardar)
                        .then(res => {
                            this.obtenerDetalleIngreo_Producto_NO();
                            this.$vs.loading.close();
                            if (res.data.status == 1) {
                                me.$vs.notify({
                                    text: res.data.message,
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
                                text: 'No se puede guardar, complete la información de los productos añadidos',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x',
                                time: 7000,
                            })
                            return
    
                        });
                } else if ((me.idmovimiento.fmp_id != 'undefined') || (me.idmovimiento.fmp_id != '') || (me.idmovimiento.fmp_id != null)) {
                    // console.log("entro al elseif")
                    const datosParaGuardar = {
                        librosConCantidad: librosConCantidad,
                        id_movimientoproducto: me.idmovimiento.fmp_id,
                        cantidadTotal: cantidadTotal,
                    };
                    this.$vs.loading();
                    this.$http.post(this.$server_url + 'guardarDatosMovimientosProducto', datosParaGuardar)
                        .then(res => {
                            this.obtenerDetalleIngreo_Producto_NO();
                            this.$vs.loading.close();
                            if (res.data.status == 1) {
                                me.$vs.notify({
                                    text: res.data.message,
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
                                text: 'No se puede guardar, complete la información de los productos añadidos',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x',
                                time: 7000,
                            })
                            return
    
                        });
                }
    
            },
            guardarConStock() {
                let me = this;
                const librosConCantidad = [];
                let cantidadTotal = 0; // Establecer cantidadTotal en 0 por defecto
                // console.log(this.idmovimiento.prov_codigo, "codigo de proveedor");
                // console.log(this.datosSeleccionadoLibros);
                // return
                // console.log(me.idmovimiento.fmp_id, "idmovimientfoinal");
                // console.log(me.CompletoIngreso, "idmovimientfoina2l");
                // return
                console.log(me.tipoIngreso, "tipoooooo");
                // return
                if ((me.idmovimiento.prov_codigo == 'undefined') || (me.idmovimiento.prov_codigo == '') || (me.idmovimiento.prov_codigo == null)) {
                    me.$vs.notify({
                        text: "Seleccione un proveedor para finalizar el ingreso.",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 7000,
                    })
                    return
                }
                if (this.datosSeleccionadoLibros.length > 0) {
                    cantidadTotal = this.datosSeleccionadoLibros.reduce((total, libro) => {
                        return total + Number(libro.cantidad);
                    }, 0);
                }
    
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
    
                if ((me.idmovimiento.fmp_id == 'undefined') || (me.idmovimiento.fmp_id == '') || (me.idmovimiento.fmp_id == null)) {
                    // console.log("entro al if");
                    const datosParaGuardar = {
                        librosConCantidad: librosConCantidad,
                        id_movimientoproducto: me.CompletoIngreso,
                        cantidadTotal: cantidadTotal,
                        tipoMovimiento: me.tipoIngreso,
                    };
                    this.$vs.loading();
                    this.$http.post(this.$server_url + 'guardarDatosMovimientosProducto_Stock', datosParaGuardar)
                        .then(res => {
                            this.obtenerDetalleIngreo_Producto_NO();
                            me.$emit('change', {
                                verificacionemitsaveandedit: 1
                            });
                            this.$vs.loading.close();
                            if (res.data.status == 1) {
                                me.$vs.notify({
                                    text: res.data.message,
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
                                text: 'No puede finalizar el ingreso con información del producto incompleta-',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x',
                                time: 7000,
                            })
                            return
    
                        });
                } else if ((me.idmovimiento.fmp_id != 'undefined') || (me.idmovimiento.fmp_id != '') || (me.idmovimiento.fmp_id != null)) {
                    // console.log("entro al elseif")
                    const datosParaGuardar = {
                        librosConCantidad: librosConCantidad,
                        id_movimientoproducto: me.idmovimiento.fmp_id,
                        cantidadTotal: cantidadTotal,
                        tipoMovimiento: me.tipoIngreso,
                    };
                    this.$vs.loading();
                    this.$http.post(this.$server_url + 'guardarDatosMovimientosProducto_Stock', datosParaGuardar)
                        .then(res => {
                            this.obtenerDetalleIngreo_Producto_NO();
                            me.$emit('change', {
                                verificacionemitsaveandedit: 1
                            });
                            this.$vs.loading.close();
                            if (res.data.status == 1) {
                                me.$vs.notify({
                                    text: res.data.message,
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
                                text: 'No puede finalizar el ingreso con información del producto incompleta-',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x',
                                time: 7000,
                            })
                            return
                        });
                }
    
            },
            obtenerDetalleIngreo_Producto_NO() {
                let me = this;
                // console.log(me.idmovimiento.fmp_id, "idmovimientfoinal");
                // console.log(me.CompletoIngreso, "idmovimientfoina2l");
                // return
                if ((me.idmovimiento.fmp_id == 'undefined') || (me.idmovimiento.fmp_id == '') || (me.idmovimiento.fmp_id == null)) {
                    this.$http.get(this.$server_url + 'obtenerDetallesMovimientosProductos/' + me.CompletoIngreso)
                        .then(response => {
                            this.datosSeleccionadoLibros = response.data.map(detalle => ({
                                nombrelibro: detalle.pro_nombre,
                                pro_codigo: detalle.pro_codigo,
                                emp_id: detalle.emp_id,
                                fmdp_tipo_bodega: detalle.fmdp_tipo_bodega,
                                cantidad: detalle.fmdp_cantidad,
                            }));
    
                            this.datosGuardadosLibros = response.data.map(detalle => ({
                                nombrelibro: detalle.pro_nombre,
                                pro_codigo: detalle.pro_codigo,
                                emp_id: detalle.emp_id,
                                fmdp_tipo_bodega: detalle.fmdp_tipo_bodega,
                                cantidad: detalle.fmdp_cantidad,
                            }));
    
                            // const detalles = this.datosSeleccionadoLibros;
    
                            // detalles.forEach(detalle => {
                            //     const index = this.arregloLibros.findIndex(libro => libro.pro_codigo === detalle.pro_codigo);
                            //     if (index !== -1) {
                            //         this.arregloLibros.splice(index, 1);
                            //     }
                            // });
                            if (me.datosSeleccionadoLibros.length > 0) {
                                me.verificarLengthProducto = 1;
                            } else if (me.datosSeleccionadoLibros.length <= 0) {
                                me.verificarLengthProducto = 0;
                            }
                            this.validarCamposCompletos();
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
                                cantidad: detalle.fmdp_cantidad
                            }));
    
                            this.datosGuardadosLibros = response.data.map(detalle => ({
                                nombrelibro: detalle.pro_nombre,
                                pro_codigo: detalle.pro_codigo,
                                emp_id: detalle.emp_id,
                                fmdp_tipo_bodega: detalle.fmdp_tipo_bodega,
                                cantidad: detalle.fmdp_cantidad,
                            }));
    
                            // const detalles = this.datosSeleccionadoLibros;
    
                            // detalles.forEach(detalle => {
                            //     const index = this.arregloLibros.findIndex(libro => libro.pro_codigo === detalle.pro_codigo);
                            //     if (index !== -1) {
                            //         this.arregloLibros.splice(index, 1);
                            //     }
                            // });
                            if (me.datosSeleccionadoLibros.length > 0) {
                                me.verificarLengthProducto = 1;
                            } else if (me.datosSeleccionadoLibros.length <= 0) {
                                me.verificarLengthProducto = 0;
                            }
                            this.validarCamposCompletos();
                            this.$vs.loading.close();
                        })
                        .catch(error => {
                            console.error('Error al obtener los datos del detalle de libros:', error);
                            this.$vs.loading.close();
                        });
                }
    
            },
            f_guardar_movimiento() {
                // console.log("entra a guardar movimiento", this.idmovimiento, 'tipo ingreso ',this.tipoIngreso);
                this.$emit('f_guardar', {
                    idmovimiento: this.idmovimiento,
                    tipoIngreso: this.tipoIngreso
                });
                this.$emit('actualizarBtnPropiedades', {
                    accion_guardar: 2, // Cambiar a modo editar
                    btn_txt: 'Editar',
                    btn_color: 'warning',
                });
                this.deshabilitarRadio = true;
            }
        },
    };
    </script>
    