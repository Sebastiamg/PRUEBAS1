<template>
<vx-card class="producto-datos-basicos">
    <div class="p-2">
        <!-- ==============================
             FILA 1: CÓDIGOS Y DESCRIPCIONES
             ============================== -->
        <div class="vx-row mb-4">
            <!-- COLUMNA IZQUIERDA: CÓDIGOS -->
            <div class="vx-col sm:w-1/3 w-full">
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/3 text-sm font-bold">Código:</label>
                    <vs-input v-model="producto.productocodigo" class="w-2/3" size="small" :disabled="!isEditMode" />
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/3 text-sm">Barras:</label>
                    <vs-input v-model="producto.barras" class="w-2/3" size="small" :disabled="!isEditMode" />
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/3 text-sm">Alterno:</label>
                    <vs-input v-model="producto.alterno1" class="w-2/3" size="small" :disabled="!isEditMode" />
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/3 text-sm">Cod. Aux. SRI:</label>
                    <vs-input v-model="producto.cod_aux_sri" class="w-2/3" size="small" :disabled="!isEditMode" />
                </div>
            </div>

            <!-- COLUMNA DERECHA: DESCRIPCIONES -->
            <div class="vx-col sm:w-2/3 w-full">
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/6 text-sm font-bold">Descripción:</label>
                    <vs-input v-model="producto.descripcion" class="w-5/6" size="small" :disabled="!isEditMode" />
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/6 text-sm">Descripción corta:</label>
                    <vs-input v-model="producto.descripcioncorta" class="w-5/6" size="small" :disabled="!isEditMode" />
                </div>
            </div>
        </div>

        <!-- ==============================
             FILA 2: IMAGEN, CLASIFICACIÓN, COSTOS
             ============================== -->
        <div class="vx-row mb-6">
            <!-- IMAGEN -->
            <div class="vx-col sm:w-1/4 w-full flex justify-center items-start">
                <div class="img-container shadow-md rounded p-2 border border-solid border-gray-300">
                    <img v-if="producto.imagen_url" :src="producto.imagen_url" alt="Producto" class="responsive-img" />
                    <div v-else class="placeholder-img flex items-center justify-center bg-gray-100 text-gray-400">
                        <feather-icon icon="ImageIcon" svgClasses="w-16 h-16" />
                    </div>
                </div>
            </div>

            <!-- CLASIFICACIÓN (Dropdowns) -->
            <div class="vx-col sm:w-1/3 w-full">
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/3 text-sm">Líneas:</label>
                    <div class="w-2/3 flex">
                        <v-select :options="lista_lineas" v-model="producto.productos_lineasid" class="w-full" :reduce="label => label.productos_lineasid" label="descripcion" :disabled="!isEditMode" />
                        <vs-button icon="search" size="small" class="ml-1" color="primary" type="flat"></vs-button>
                    </div>
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/3 text-sm">Categorías:</label>
                    <div class="w-2/3 flex">
                        <v-select :options="lista_categorias" v-model="producto.productos_categoriasid" class="w-full" :reduce="label => label.productos_categoriasid" label="descripcion" :disabled="!isEditMode" />
                        <vs-button icon="search" size="small" class="ml-1" color="primary" type="flat"></vs-button>
                    </div>
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/3 text-sm">Sub Categoría:</label>
                    <div class="w-2/3 flex">
                        <v-select :options="lista_subcategorias" v-model="producto.productos_subcategoriasid" class="w-full" :reduce="label => label.productos_subcategoriasid" label="descripcion" :disabled="!isEditMode" />
                        <vs-button icon="search" size="small" class="ml-1" color="primary" type="flat"></vs-button>
                    </div>
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/3 text-sm">Sub Grupo:</label>
                    <div class="w-2/3 flex">
                        <v-select :options="lista_subgrupos" v-model="producto.productos_subgruposid" class="w-full" :reduce="label => label.productos_subgruposid" label="descripcion" :disabled="!isEditMode" />
                        <vs-button icon="search" size="small" class="ml-1" color="primary" type="flat"></vs-button>
                    </div>
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/3 text-sm">I.V.A.:</label>
                    <v-select :options="lista_iva" v-model="producto.sri_tipos_ivas_codigo" class="w-2/3" :reduce="label => label.sri_tipos_ivas_codigo" label="porcentaje" :disabled="!isEditMode" />
                </div>
            </div>

            <!-- COSTOS Y PESOS -->
            <div class="vx-col sm:w-1/3 w-full pl-4 border-l border-gray-200">
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/2 text-sm text-right pr-2">Existencia Actual:</label>
                    <vs-input v-model="producto.existenciastotales" class="w-1/2 input-number-right" disabled size="small" />
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/2 text-sm text-right pr-2">Costo Actual:</label>
                    <vs-input v-model="producto.costoactual" class="w-1/2 input-number-right" size="small" :disabled="!isEditMode" />
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/2 text-sm text-right pr-2">Costo Compra:</label>
                    <vs-input v-model="producto.costoultimacompra" class="w-1/2 input-number-right" size="small" :disabled="!isEditMode" />
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/2 text-sm text-right pr-2">Costo Estándar:</label>
                    <vs-input v-model="producto.costoestandar" class="w-1/2 input-number-right" size="small" :disabled="!isEditMode" />
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/2 text-sm text-right pr-2">Peso Bruto:</label>
                    <vs-input v-model="producto.peso_bruto" class="w-1/2 input-number-right" size="small" :disabled="!isEditMode" />
                </div>
                <div class="form-group mb-2 flex items-center">
                    <label class="w-1/2 text-sm text-right pr-2">Peso Neto:</label>
                    <vs-input v-model="producto.peso_neto" class="w-1/2 input-number-right" size="small" :disabled="!isEditMode" />
                </div>
            </div>
        </div>

        <!-- ==============================
             FILA 3: CHECKBOXES
             ============================== -->
        <div class="vx-row mb-6 px-4">
            <div class="vx-col w-full flex flex-wrap gap-4 justify-between">
                <vs-checkbox v-model="producto.estado" color="warning" :disabled="!isEditMode">Activo</vs-checkbox>
                <vs-checkbox v-model="producto.controlprecios" color="warning" :disabled="!isEditMode">Controlar Precios</vs-checkbox>
                <vs-checkbox v-model="producto.controlnegativos" color="warning" :disabled="!isEditMode">Controlar Negativos</vs-checkbox>
                <vs-checkbox v-model="producto.es_compuesto" color="warning" disabled>Compuesto</vs-checkbox>
                <vs-checkbox v-model="producto.series" color="warning" :disabled="!isEditMode">Series</vs-checkbox>
                <vs-checkbox v-model="producto.combustible" color="warning" :disabled="!isEditMode">Combustible</vs-checkbox>
                <vs-checkbox v-model="producto.vehiculos" color="warning" :disabled="!isEditMode">Vehiculos</vs-checkbox>

                <!-- Segunda línea de checks (aproximada) -->
                <div class="w-full flex flex-wrap gap-4 justify-center mt-2">
                    <vs-checkbox v-model="producto.venta" color="warning" :disabled="!isEditMode" @input="val => !val && (producto.materia_prima = false)">Venta</vs-checkbox>
                    <vs-checkbox v-model="producto.control_lotes" color="warning" :disabled="!isEditMode">Control Lotes</vs-checkbox>
                    <vs-checkbox v-model="producto.materia_prima" color="warning" :disabled="!isEditMode || !producto.venta">Materia Prima</vs-checkbox>
                    <vs-checkbox v-model="producto.registra_variantes" color="warning" :disabled="!isEditMode">Registra Variantes</vs-checkbox>
                    <vs-checkbox v-model="producto.venta_por_peso" color="warning" disabled>Venta x Peso</vs-checkbox>
                    <vs-checkbox v-model="producto.controlar_reabastecer" color="warning" disabled>Controlar Reabastecer</vs-checkbox>
                </div>
            </div>
        </div>

        <!-- ==============================
             FILA 4: TARIFAS Y MEDIDAS
             ============================== -->
        <div class="vx-row">
            <!-- TABLA DE TARIFAS -->
            <div class="vx-col sm:w-2/3 w-full pr-4">
                <div class="tarifa-header bg-gray-200 p-2 font-bold mb-0 text-sm flex">
                    <div class="w-1/4">Tarifa</div>
                    <div class="w-1/6 text-right">Precio</div>
                    <div class="w-1/6 text-right">Precio IVA</div>
                    <div class="w-1/6 text-right">Margen</div>
                    <div class="w-1/6 text-right">Utilidad $</div>
                    <div class="w-1/12 text-center">Escala</div>
                </div>
                <div class="tarifa-body">
                    <div v-for="(tarifa, index) in producto.tarifas" :key="index" class="tarifa-row flex p-1 border-b border-gray-100 hover:bg-gray-50 text-sm items-center">
                        <div class="w-1/4 font-medium">{{ tarifa.tarifadescripcion }}</div>
                        <div class="w-1/6"><input type="number" v-model.number="tarifa.precio" class="w-full text-right bg-transparent border-0 focus:border-b" :disabled="!isEditMode" /></div>
                        <div class="w-1/6"><input type="number" v-model.number="tarifa.precioiva" class="w-full text-right bg-transparent border-0 focus:border-b font-bold" :disabled="!isEditMode" /></div>
                        <div class="w-1/6 text-right">{{ tarifa.margen }}%</div>
                        <div class="w-1/6 text-right">{{ tarifa.utilidad }}</div>
                        <div class="w-1/12 text-center">{{ tarifa.escala }}</div>
                    </div>
                </div>
            </div>

            <!-- MEDIDAS -->
            <div class="vx-col sm:w-1/3 w-full pl-4 border-l border-gray-200">
                <div class="form-group mb-3">
                    <label class="block text-xs text-gray-600 mb-1">Medida de Venta:</label>
                    <v-select :options="lista_medidas" v-model="producto.unidadventa" :reduce="label => label.id" label="descripcion" :disabled="!isEditMode" />
                </div>
                <div class="form-group mb-3">
                    <label class="block text-xs text-gray-600 mb-1">Medida de Compra:</label>
                    <v-select :options="lista_medidas" v-model="producto.unidadcompra" :reduce="label => label.id" label="descripcion" :disabled="!isEditMode" />
                </div>
                <div class="form-group mb-3 flex items-end gap-2">
                    <div class="flex-1">
                        <label class="block text-xs text-gray-600 mb-1">Medida Superior:</label>
                        <v-select :options="lista_medidas" v-model="producto.unidadsuperior" :reduce="label => label.id" label="descripcion" :disabled="!isEditMode" />
                    </div>
                    <div class="w-16">
                        <vs-input v-model="producto.factorsuperior" class="w-full" size="small" :disabled="!isEditMode" />
                    </div>
                </div>
                <div class="form-group mb-3 flex items-end gap-2">
                    <div class="flex-1">
                        <label class="block text-xs text-gray-600 mb-1">Medida Inferior:</label>
                        <v-select :options="lista_medidas" v-model="producto.unidadinferior" :reduce="label => label.id" label="descripcion" :disabled="!isEditMode" />
                    </div>
                    <div class="w-16">
                        <vs-input v-model="producto.factorinferior" class="w-full" size="small" :disabled="!isEditMode" />
                    </div>
                </div>
            </div>
        </div>

    </div>
</vx-card>
</template>

<script>
// No importamos Generalmix aquí para mantener limpio el scope, o se puede agregar si hace falta
import vSelect from 'vue-select';
// Importamos Generalmix para usar $vs.loading y otros
import Generalmix from '../../../../mixins/Generalmix';

export default {
    mixins: [Generalmix],
    components: {
        vSelect
    },
    props: {
        isEditMode: {
            type: Boolean,
            default: false
        },
        idProducto: {
            type: [Number, String],
            default: null
        }
    },
    data() {
        return {
            producto: {
                productocodigo: '',
                barras: '',
                alterno1: '',
                cod_aux_sri: '',
                descripcion: '',
                descripcioncorta: '',
                imagen_url: null,
                // IDs
                productos_lineasid: null,
                productos_categoriasid: null,
                productos_subcategoriasid: null,
                productos_subgruposid: null,
                porcentajeiva: null,
                // numeric
                existenciastotales: 0.0,
                costoactual: 0.000000,
                costoultimacompra: 0.000000,
                costoestandar: 0.000000,
                peso_bruto: 0.0000,
                peso_neto: 0.0000,
                // checks
                estado: true,
                venta: false,
                controlprecios: false,
                controlnegativos: false,
                es_compuesto: false,
                series: false,
                combustible: false,
                vehiculos: false,
                control_lotes: false,
                materia_prima: false,
                registra_variantes: false,
                venta_por_peso: false,
                controlar_reabastecer: false,
                // Arrays
                tarifas: [{
                        tarifadescripcion: 'Precio 1',
                        precio: 0,
                        precioiva: 0,
                        margen: 0,
                        utilidad: 0,
                        escala: 0
                    },
                    {
                        tarifadescripcion: 'Precio 2',
                        precio: 0,
                        precioiva: 0,
                        margen: 0,
                        utilidad: 0,
                        escala: 0
                    },
                    {
                        tarifadescripcion: 'Precio 3',
                        precio: 0,
                        precioiva: 0,
                        margen: 0,
                        utilidad: 0,
                        escala: 0
                    },
                ],
                // Units
                unidadventa: null,
                unidadcompra: null,
                unidadsuperior: null,
                unidadinferior: null,
                factorsuperior: 0,
                factorinferior: 0
            },
            // Listas
            lista_lineas: [],
            lista_categorias: [],
            lista_subcategorias: [],
            lista_subgrupos: [],
            lista_iva: [], // Esto quizás también debería venir del back
            lista_medidas: [{
                id: 1,
                descripcion: 'Unidad'
            }, {
                id: 2,
                descripcion: 'Caja'
            }], // Esto debe venir del back
        }
    },
    mounted() {
        if (this.idProducto) {
            this.cargarDatosProducto(this.idProducto);
        }
    },
    methods: {
        // Método para consultar datos directamente desde API
        async cargarDatosProducto(productosid) {
            try {
                this.$vs.loading();
                const enviardata = {
                    action: 'productos_consulta_x_productosid',
                    id_empresa: this.empresaPerseo ? this.empresaPerseo.id : 1,
                    productosid: productosid
                };
                const response = await this.$http.post(
                    this.$server_url + 'api/perseo/productos/Procesar_MetodosPost_Productos',
                    enviardata
                );
                this.$vs.loading.close();
                if (response.data && response.data.productos && response.data.productos.length > 0) {
                    // Cargar listas si vienen en la respuesta
                    if (response.data.lineas) this.lista_lineas = response.data.lineas;
                    if (response.data.categorias) this.lista_categorias = response.data.categorias;
                    if (response.data.subcategorias) this.lista_subcategorias = response.data.subcategorias;
                    if (response.data.subgrupos) this.lista_subgrupos = response.data.subgrupos;
                    if (response.data.iva) this.lista_iva = response.data.iva;

                    const producto = response.data.productos[0];
                    this.actualizarDatos(producto);
                } else {
                    this.$vs.notify({
                        title: 'Error',
                        text: 'No se encontraron datos del producto',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                }
            } catch (error) {
                this.$vs.loading.close();
                console.error(error);
                this.$vs.notify({
                    title: 'Error',
                    text: 'Error al obtener datos del producto',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            }
        },
        // Método local para mapear datos
        actualizarDatos(datos) {
            if (datos) {
                // Mapear datos
                this.producto = {
                    ...this.producto,
                    ...datos
                };

                // Mapear booleanos explícitos y JSON
                this.producto.venta = datos.venta === 1 || datos.venta === true || datos.venta === '1';
                this.producto.estado = datos.estado === 1 || datos.estado === true || datos.estado === '1';
                this.producto.controlprecios = datos.controlprecios === 1 || datos.controlprecios === true || datos.controlprecios === '1';
                this.producto.controlnegativos = datos.controlnegativos === 1 || datos.controlnegativos === true || datos.controlnegativos === '1';

                // Parsing parametros_json para combustible
                try {
                    let params = {};
                    if (datos.parametros_json) {
                        params = typeof datos.parametros_json === 'string' ?
                            JSON.parse(datos.parametros_json) :
                            datos.parametros_json;
                    }
                    this.producto.combustible = params.combustible === 1 || params.combustible === '1' || params.combustible === true;
                } catch (e) {
                    console.error('Error parsing parametros_json', e);
                    this.producto.combustible = false;
                }
                // Asegurar tarifas minimo 3
                if (!this.producto.tarifas || this.producto.tarifas.length === 0) {
                    this.producto.tarifas = [{
                            tarifadescripcion: 'Precio 1',
                            precio: 0,
                            precioiva: 0,
                            margen: 0,
                            utilidad: 0,
                            escala: 0
                        },
                        {
                            tarifadescripcion: 'Precio 2',
                            precio: 0,
                            precioiva: 0,
                            margen: 0,
                            utilidad: 0,
                            escala: 0
                        },
                        {
                            tarifadescripcion: 'Precio 3',
                            precio: 0,
                            precioiva: 0,
                            margen: 0,
                            utilidad: 0,
                            escala: 0
                        }
                    ];
                }
            }
        },
        async guardarProducto() {
            console.log('guardarProducto: Método iniciado');
            let me = this;
            return new Promise((resolve, reject) => {
                let data_Guardado = {
                    action: 'productos_EditarCompleto',
                    producto: this.producto
                };
                console.log('guardarProducto: Enviando datos al servidor', data_Guardado);
                me.$http.post(me.$server_url + 'api/perseo/productos/Procesar_MetodosPost_Productos', data_Guardado)
                    .then(response => {
                        console.log('guardarProducto: Respuesta recibida', response.data);
                        if (response.data.status == 1) {
                            me.$vs.notify({
                                title: 'Éxito',
                                text: 'Datos actualizados correctamente.',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                            console.log('guardarProducto: Guardado exitoso, resolviendo Promise');
                            resolve();
                        } else {
                            console.log('guardarProducto: Status no es 1, rechazando Promise', response.data.message);
                            reject("guardarProducto else", response.data.message);
                        }
                    })
                    .catch(error => {
                        console.error('guardarProducto: Error en la petición HTTP:', error);
                        me.$vs.notify({
                            title: 'Error',
                            text: 'Error al guardar el fichero de mercado.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("guardarProducto catch", error);
                    });
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.producto-datos-basicos {
    font-size: 0.9rem;
}

.img-container {
    width: 140px;
    height: 140px;
}

.responsive-img {
    max-width: 100%;
    max-height: 100%;
}

.placeholder-img {
    width: 100%;
    height: 100%;
}

// Input styles adjusted to match screenshot tight spacing
.vs-input--input.small {
    padding: 0.3rem !important;
}

.input-number-right {
    ::v-deep input {
        text-align: right;
    }
}

// Adjust checkbox list
.vs-checkbox-primary {
    margin-right: 10px;
}
</style>
