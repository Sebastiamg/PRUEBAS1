<template>
<div class="max-w-7xl mx-auto px-4">
    <!-- Título de la institución -->
    <div class="text-center mb-6">
        <h6 class="text-xl font-semibold text-primary">Libros de Institución "{{ nombre_institucion }}"</h6>
    </div>

    <!-- Select Periodo -->
    <div class="flex justify-center mb-6">
        <div class="w-full sm:w-1/6">
            <vs-input v-model="periodoPredeterminado" label="Periodo Escolar:" class="w-full" :disabled="!periodoSelect" readonly placeholder="Escribe o selecciona un periodo" />
            <!-- <small>Periodo Escolar:</small> -->
            <!-- <v-select :options="arrayPeriodos" :reduce="periodo => periodo" @input="f_selectPeriodo" label="periodoescolar" class="w-full" v-model="periodoSelect" :disabled="!periodoSelect" /> -->
        </div>
    </div>

    <!-- Token de periodo -->
    <div>
        <vs-row>
            <vs-divider>Código Token:</vs-divider>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                        <p>TOKEN UNICO DE INSTITUCIÓN POR PERIODO (Solo se genera uno por periodo)</p>
                    </vs-col>
                </vs-row>
            </vs-col>
            <!-- Botón para generar el código token -->
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                        <vs-input v-model="codigo" placeholder="Código generado" :disabled="!periodoSelect" readonly class="w-full" />
                    </vs-col>
                    <vs-col vs-type="flex" vsvs-colfy="center" vs-align="center" vs-w="1" vs-sm="1" class="m-2">
                        <vs-button @click="generarCodigo" color="primary" type="relief" :disabled="!periodoSelect">
                            Generar
                        </vs-button>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
    </div>

    <!-- URL ACCESO -->
    <div>
        <vs-row>
            <vs-divider>URL CLiente:</vs-divider>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                        <p>ESTE CAMPO SE LLENARA CUANDO EL CLIENTE INGRESE POR PRIMERA VEZ A LA LIBRERIA DIGITAL</p>
                    </vs-col>
                </vs-row>
            </vs-col>
            <!-- Botón para generar el código token -->
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                        <vs-input v-model="url" placeholder="url" :disabled="!periodoSelect || !userRoot" class="w-full" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
    </div>

    <!-- Agregar Libros -->
    <div>
        <vs-row>
            <vs-divider>Agregar Libros:</vs-divider>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                        <v-select multiple :options="arregloLibros" :reduce="libro => libro.codigo" label="nombrelibro" class="w-full h-100" placeholder="--Seleccione--" v-model="infoPedido.libro" :disabled="!periodoSelect" />
                    </vs-col>
                    <vs-col vs-type="flex" vsvs-colfy="center" vs-align="center" vs-w="1" vs-sm="1" class="m-2">
                        <vs-button @click="agregarLibro" color="success" type="relief" icon="add" :disabled="!periodoSelect || !infoPedido.libro">
                            Agregar
                        </vs-button>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
    </div>

    <!-- Campo de Búsqueda -->
    <div class="flex justify-center mb-6">
        <div class="w-full sm:w-1/2">
            <small>Buscar nombre libro:</small>
            <vs-input v-model="searchQuery" placeholder="Buscar por nombre o número de libro..." class="w-full" icon="search" :disabled="!periodoSelect" />
        </div>
    </div>

    <vs-divider>Libros Asignados: {{ filteredLibros.length }}</vs-divider>

    <!-- Lista de Libros -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <vs-col vs-type="flex" vs-align="center" v-for="(libro, index) in filteredLibros" :key="index" class="flex justify-center">
            <vx-card fixed-height="true" class="w-full">
                <!-- Información del libro en formato tabla -->
                <table class="w-full table-auto">
                    <tbody>
                        <tr>
                            <td class="px-4 py-2 font-medium text-gray-700">
                                Código del Libro: <br><strong>{{ libro.codigo }}</strong><br>
                                Nombre del Libro: <br><strong>{{ libro.nombrelibro }}</strong>

                            </td>
                            <!-- Columna con el botón de eliminación -->
                            <td class="px-4 py-2 text-right">
                                <vs-button @click="eliminarLibros(index)" color="danger" type="relief" icon="delete"></vs-button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </vx-card>
        </vs-col>
    </div>

    <!-- Botones de Acción -->
    <div class="flex justify-center mt-4 space-x-4">
        <vs-button @click="guardarInformacionLibrosInstitucion()" type="relief" :disabled="!periodoSelect">
            Guardar
        </vs-button>
    </div>
</div>
</template>

<script>
import PeriodoRepository from '@/repositories/PeriodoRepository';
import flatPickr from 'vue-flatpickr-component';
import vSelect from 'vue-select'
import CryptoJS from 'crypto-js';
import {
    mapState
} from "vuex";
export default {
    data() {
        return {
            nombre_institucion: '',
            codigo_institucion: '',
            periodoSelect: null,
            periodoPredeterminado: null,
            arrayPeriodos: [],
            periodo_id: 0,
            nombrePeriodo: '',
            Institucion: [],
            tabLibros: [],
            searchQuery: "",
            arregloLibros: [],
            infoPedido: {
                libro: [],
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                onChange: this.onDateChange,
            },
            FechaInicio: '',
            fechaExpiracion: '',
            codigo: '',
            url: '',
            institucionDatos: '',
        };
    },
    components: {
        "v-select": vSelect,
        flatPickr,
    },
    mounted() {
        this.nombre_institucion = this.datosInstitucion.nombreInstitucion;
        this.codigo_institucion = this.datosInstitucion.idInstitucion;
        this.obtenerPeriodos();
    },
    props: {
        datosInstitucion: {
            type: Object,
            required: true,
        },
    },
    computed: {
        filteredLibros() {
            const query = this.searchQuery.toLowerCase();
            return this.tabLibros.filter(libro => {
                const nombreLibro = libro.nombrelibro ? libro.nombrelibro.toLowerCase() : '';

                const libroId = libro.id ? libro.id.toString() : '';

                return nombreLibro.includes(query) || libroId.includes(query);
            });
        },
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'AdminFacturador']),

    },
    methods: {
        generarCodigo() {
            // if (!this.fechaExpiracion) {
            //     this.$vs.notify({
            //         text: 'Por favor, seleccione fecha expiracion.',
            //         color: 'warning',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-triangle',
            //     });
            //     return;
            // }

            // Formatear las fechas en un formato adecuado para generar el token
            // const fechaExpiracion = new Date(this.fechaExpiracion).toISOString().split('T')[0]; // yyyy-mm-dd

            // Generar el código token con las fechas y el hash
            // this.codigo = `${this.generarHash(fechaExpiracion)}-${fechaExpiracion}-${this.codigo_institucion}`;
            this.codigo = `${this.generarHash(`${this.periodoPredeterminado}`+`${this.nombre_institucion}`)}-${this.codigo_institucion}`;

            console.log('Código Token Generado:', this.codigo);
        },

        // Método para generar el hash
        generarHash(str) {
            return CryptoJS.MD5(str).toString(CryptoJS.enc.Base64);
        },
        obtenerPeriodos() {
            PeriodoRepository.getPeriodos()
                .then(p => {
                    this.arrayPeriodos = p.data.filter(p => p.idperiodoescolar == this.datosInstitucion.periodo_id);
                    this.periodoSelect = this.arrayPeriodos[0];
                    this.periodoPredeterminado = this.arrayPeriodos[0].periodoescolar;
                    this.f_selectPeriodo();
                })
                .catch(error => {
                    this.$vs.notify({
                        text: 'Error al cargar los períodos.',
                        color: 'error',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                    console.error(error);
                });
        },
        getInfoinstitucion_libros() {
            this.$vs.loading();
            this.$http.get(`${this.$server_url}getInfoinstitucion_libros?periodo=${this.periodoSelect.idperiodoescolar}&institucion=${this.codigo_institucion}`)
                .then(res => {
                    this.institucionDatos = res.data;
                    if (this.institucionDatos.length > 0) {
                        this.codigo = res.data[0].li_codigo;
                        this.fechaExpiracion = res.data[0].expires_at;
                        this.url = res.data[0].li_url;
                    }
                    this.$vs.loading.close();
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.$vs.notify({
                        text: 'Error al obtener libros de institución.',
                        color: 'error',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                    console.error('Error al obtener libros de institución', error);
                });
        },
        getinstitucion_libros() {
            this.$vs.loading();
            this.$http.get(`${this.$server_url}getinstitucion_libros?periodo=${this.periodoSelect.idperiodoescolar}&institucion=${this.codigo_institucion}`)
                .then(res => {
                    this.Institucion = res.data;
                    this.tabLibros = res.data.map(libro => ({
                        id: libro.lid_idLibro,
                        codigo: libro.lid_producto,
                        nombrelibro: libro.nombre,
                    }));
                    this.getLibrostodos();

                    this.$vs.loading.close();
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.$vs.notify({
                        text: 'Error al obtener libros de institución.',
                        color: 'error',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                    console.error('Error al obtener libros de institución', error);
                });
        },
        getLibrostodos() {
            if (!this.periodoSelect) return;

            this.$vs.loading();
            const url = `${this.$server_url}${this.periodo_id <= 27 ? 'get_val_pedidoLibrosObsequiosInfoTodoSinPedido?periodo=' : 'get_val_pedidoLibrosObsequiosInfoTodoSinPedido_new?periodo='}${this.periodo_id}`;
            this.$http.get(url)
                .then(res => {
                    // Extraer los códigos de los libros ya seleccionados (tabLibros)
                    const codigosSeleccionados = this.tabLibros.map(libro => libro.codigo);

                    // Filtrar los libros que no están en los libros ya agregados (compara los códigos)
                    const librosFiltrados = res.data.filter(libro => !codigosSeleccionados.includes(libro.pro_codigo));

                    // Mapeo de los libros filtrados a la estructura que necesitas
                    this.arregloLibros = librosFiltrados.map(libro => ({
                        id: libro.idlibro,
                        codigo: libro.pro_codigo, // Utilizamos pro_codigo para la comparación
                        nombrelibro: libro.nombrelibro,
                    }));

                    this.$vs.loading.close();
                })
                .catch(error => {
                    this.$vs.loading.close();
                    this.$vs.notify({
                        text: 'Error al obtener los libros.',
                        color: 'error',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                    console.error('Error al obtener libros:', error);
                });
        },
        agregarLibro() {
            if (this.infoPedido.libro && this.infoPedido.libro.length > 0) {
                // Filtrar los libros seleccionados y verificar si ya están en tabLibros
                const librosSeleccionados = this.arregloLibros.filter(libro =>
                    this.infoPedido.libro.includes(libro.codigo) // Buscar los libros seleccionados
                );

                // Asegurarse de no duplicar los libros en tabLibros
                librosSeleccionados.forEach(libroSeleccionado => {
                    const existsInTabLibros = this.tabLibros.some(libro => libro.codigo === libroSeleccionado.codigo);

                    if (!existsInTabLibros) {
                        // Agregar el libro a tabLibros
                        this.tabLibros.push(libroSeleccionado);

                        // Eliminar el libro de arregloLibros (porque ya ha sido seleccionado)
                        const index = this.arregloLibros.findIndex(libro => libro.codigo === libroSeleccionado.codigo);
                        if (index !== -1) {
                            this.arregloLibros.splice(index, 1); // Eliminar el libro del arreglo
                        }
                    }
                });

                // Restablecer la selección de libros
                this.infoPedido.libro = []; // Limpiar los libros seleccionados en infoPedido
            }
        },

        eliminarLibros(index) {
            const libroAEliminar = this.tabLibros[index];

            // Eliminar el libro de tabLibros
            this.tabLibros.splice(index, 1);

            // Verificar si el libro ya está en arregloLibros para evitar duplicados
            const existsInArreglo = this.arregloLibros.some(libro => libro.codigo === libroAEliminar.codigo);

            if (!existsInArreglo) {
                // Crear un nuevo objeto de libro con las propiedades correctas
                this.arregloLibros.push({
                    id: libroAEliminar.id,
                    codigo: libroAEliminar.codigo,
                    nombrelibro: libroAEliminar.nombrelibro
                });
            }
        },
        f_selectPeriodo() {
            let me = this;
            if (!this.periodoSelect) {
                this.$vs.notify({
                    text: 'Seleccione un periodo por favor.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                });
                return;
            }
            this.periodo_id = this.periodoSelect.idperiodoescolar;
            this.nombrePeriodo = this.periodoSelect.periodoescolar;
            this.codigo = '';
            this.fechaExpiracion = '';
            this.getinstitucion_libros();
            this.getInfoinstitucion_libros();
        },
        guardarInformacionLibrosInstitucion() {
            if (!this.periodoSelect) {
                this.$vs.notify({
                    text: 'Por favor, seleccione un periodo.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                });
                return;
            }

            if (this.tabLibros.length === 0) {
                this.$vs.notify({
                    text: 'Debe agregar al menos un libro.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                });
                return;
            }

            // Crear el objeto con los datos que se van a guardar
            const datos = {
                codigo_institucion: this.codigo_institucion,
                periodo_id: this.periodoSelect.idperiodoescolar,
                libros: this.tabLibros.map(libro => ({
                    idlibro: libro.id,
                    codigo: libro.codigo,
                    nombrelibro: libro.nombrelibro
                })),
                expires: this.fechaExpiracion,
                codigo: this.codigo,
                url: this.url,
            };

            // Realizar el POST para guardar los datos
            this.$vs.loading(); // Mostrar un indicador de carga

            this.$http.post(`${this.$server_url}guardarLibrosInstitucion`, datos)
                .then(response => {
                    this.$vs.loading.close(); // Cerrar el indicador de carga

                    if (response.data.success) {
                        this.$vs.notify({
                            text: 'Información guardada con éxito.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                        });
                        // Puedes reiniciar los datos si es necesario:
                        this.tabLibros = []; // Limpiar la lista de libros
                        this.infoPedido.libro = ''; // Limpiar el libro seleccionado
                        this.searchQuery = ''; // Limpiar el campo de búsqueda
                        this.getinstitucion_libros();
                    } else {
                        this.$vs.notify({
                            text: 'Error al guardar la información.',
                            color: 'error',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                        });
                    }
                })
                .catch(error => {
                    this.$vs.loading.close(); // Cerrar el indicador de carga
                    console.error('Error al guardar la información:', error);
                    this.$vs.notify({
                        text: 'Hubo un problema al guardar la información.',
                        color: 'error',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                });
        }
    },
};
</script>
