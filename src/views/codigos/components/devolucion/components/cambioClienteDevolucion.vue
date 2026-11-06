<template>
<div>
    <div class="flex justify-center min-h-screen">
        <div class="w-10/12 mx-auto">
            <!-- Información de la Devolución -->
            <div class="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div class="grid grid-cols-3 gap-4 items-center">
                    <div class="text-gray-700 font-semibold">Devolución #:</div>
                    <div class="col-span-2 text-gray-900 font-bold">{{ ObjectSelected.codigo_devolucion }}</div>

                    <div class="text-gray-700 font-semibold">Observación:</div>
                    <div class="col-span-2 text-gray-900">{{ ObjectSelected.observacion }}</div>

                    <div class="text-gray-700 font-semibold">Devolución hecha a:</div>
                    <div class="col-span-2 text-red-500 font-bold">
                        {{ ObjectSelected.institucion.nombreInstitucion }} ({{ ObjectSelected.institucion.idInstitucion }})
                    </div>
                </div>
            </div>

            <!-- Buscar Datos Institucion o Librería (Solo si NO hay algo seleccionado) -->
            <div class="p-6 mt-6 bg-white rounded-lg shadow-lg border border-gray-200" v-if="!datosSeleccionado.id_institucion">
                <!-- Sección de búsqueda -->
                <div class="mb-4">
                    <h3 class="text-lg font-semibold text-gray-700 mb-2">Buscar Institución o Librería</h3>
                    <div class="flex gap-2">
                        <vs-input v-model="busqueda.puntoVenta" @keypress.enter="searchData" class="w-full" placeholder="Ingrese el nombre o punto de venta" />
                        <vs-button color="warning" type="filled" @click="searchData" icon="search" class="p-3">
                            Buscar
                        </vs-button>
                    </div>
                    <small class="text-gray-500 block mt-2">Presiona <b>Enter</b> para buscar.</small>
                </div>

                <!-- Tabla de Resultados -->
                <div v-if="arrayPuntoVenta.length > 0" class="mt-6">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="text-md font-semibold text-gray-700">Resultados de Búsqueda</h4>
                        <vs-chip color="primary" class="text-sm">Cantidad: <b>{{ arrayPuntoVenta.length }}</b></vs-chip>
                    </div>

                    <vs-table max-items="10" search pagination stripe :data="arrayPuntoVenta">
                        <template slot="thead">
                            <vs-th class="text-left">Nombre</vs-th>
                            <vs-th class="text-center">Acciones</vs-th>
                        </template>
                        <template slot-scope="{ data }">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td class="text-left">
                                    <span class="font-semibold text-gray-800">{{ tr.nombreInstitucion }}</span>
                                    <b v-if="tr.validate_pedidos == 1" class="text-green-500 ml-2">(En periodo activo)</b><br>
                                    <span v-if="tr.representante" class="text-gray-600 text-sm">Asesor: {{ tr.representante }}</span>
                                </vs-td>
                                <vs-td class="text-center">
                                    <vs-button @click="f_selectPuntoVenta(tr)" class="p-2" color="primary" type="filled" icon-pack="feather" icon="icon-check">
                                        Seleccionar
                                    </vs-button>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
            </div>

            <!-- Mostrar datos seleccionados con botón para limpiar selección -->
            <div class="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg border border-gray-200 mt-5" v-if="datosSeleccionado.id_institucion">
                <h5 class="font-semibold text-lg text-danger text-center">Datos Seleccionados para Cambio</h5>

                <div class="mt-3 space-y-2 text-gray-700 text-center">
                    <div>
                        <span class="font-semibold mr-5">Ciudad:</span>
                        <b class="text-danger ">{{ datosSeleccionado.ciudad }}</b>
                    </div>
                    <div>
                        <span class="font-semibold  mr-5">Nombre:</span>
                        <b class="text-gray-900">{{ datosSeleccionado.nombreInstitucion }} ({{ datosSeleccionado.id_institucion }})</b>
                    </div>
                </div>

                <vs-button color="danger" class="mt-4 px-5 py-2" type="filled" @click="busqueda.puntoVenta='';clearSelection()" icon="close">
                    Quitar Selección
                </vs-button>
            </div>
            <div class="flex flex-col items-center p-6 bg-white rounded-lg shadow-lg border border-gray-200 mt-5">
                    <vs-textarea v-model="observacion" label="Observación de intercambio de cliente." placeholder="Justifique el intercambio" height="200px" />
            </div>

            <!-- Botón Cambiar Cliente -->
            <div class="flex justify-center mt-5">
                <vs-button @click="f_cambiarCliente" color="primary" type="filled">Cambiar cliente</vs-button>
            </div>
        </div>
    </div>

    <div>

    </div>
</div>
</template>

<script>
import vSelect from 'vue-select';
import Generalmix from '@/mixins/Generalmix';

export default {
    mixins: [Generalmix],
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            usuario: [],
            arrayClientes: [],
            id_cliente: null,
            busqueda: {
                puntoVenta: '',
            },
            arrayClientes: [],
            arrayPuntoVenta: [],
            datosSeleccionado: {
                nombreInstitucion: '',
                ciudad: '',
                id_institucion: '',
            },
            observacion: '',
        }
    },
    props: {
        ObjectSelected: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    methods: {
        f_cambiarCliente() {

            let me = this;

            if (me.ObjectSelected.id_cliente == me.id_cliente) {
                this.$vs.notify({
                    text: 'No se puede cambiar el cliente al mismo.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            if (!me.id_cliente) {
                this.$vs.notify({
                    text: 'No se puede cambiar el cliente a ninguno.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.observacion) {
                this.$vs.notify({
                    text: 'Ingrese la observación de cambio de cliente.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            let formData = new FormData();
            formData.append('codigo_devolucion',    me.ObjectSelected.codigo_devolucion);
            formData.append('nuevo_id_cliente',     me.id_cliente);
            formData.append('usuario',              me.usuario.idusuario);
            formData.append('observacion',          me.observacion);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'devoluciones?CambioClienteDevolucion=yes', formData)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status == 0) {
                        me.m_message(res.data.message, 'danger');
                        return;
                    } else if (res.data.status == 1) {
                        me.m_message(res.data.message, 'success');
                        me.$emit('cierreCambioCliente')
                    }

                })
                .catch(err => {
                    me.$vs.loading.close();
                    me.m_message('Error al cambiar cliente', 'danger'); // Manejar el error
                })
        },
        searchData() {
            let me = this
            me.arrayPuntoVenta = []
            if (me.busqueda.puntoVenta.length < 4) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Debe ingresar al menos 4 caracteres',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                })
                return
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'devoluciones?InstitucionesCambio=yes&busqueda=' + me.busqueda.puntoVenta)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arrayPuntoVenta = res.data
                    if (me.arrayPuntoVenta.length == 0) {
                        me.$vs.notify({
                            title: 'Error',
                            text: 'No se encontraron datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al buscar los datos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    })
                })
        },
        f_selectPuntoVenta(tr) {
            let me = this
            me.id_institucion = null;
            me.datosSeleccionado.nombreInstitucion = tr.nombreInstitucion
            me.datosSeleccionado.ciudad = tr.ciudad
            me.datosSeleccionado.id_institucion = tr.idInstitucion
            if (tr.idInstitucion) {
                me.id_cliente = tr.idInstitucion
            }
            me.arrayPuntoVenta = []
        },
        clearSelection() {
            this.datosSeleccionado = {
                nombreInstitucion: '',
                ciudad: '',
                id_institucion: '',
            };
            this.arrayPuntoVenta = []; // Opcional: limpiar la búsqueda anterior
        }
    }
}
</script>
