<template>
<div>
    <vx-card>
        <div class="mb-1">
            <div style="display: inline-flex; margin: 0px 3px 0px 3px">
                <ul class="flex mt-2">
                    <li>
                        <vs-radio v-model="estadoPerseo" class="ml-2" vs-name="radios1tipo" vs-value="0" @change="getfiltro()">Pendientes</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="estadoPerseo" class="ml-2" vs-name="radios1tipo" vs-value="1" @change="getfiltro()">Enviados</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="estadoPerseo" class="ml-2" vs-name="radios1tipo" vs-value="3" @change="getfiltro()">Anulados</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="estadoPerseo" class="ml-2" vs-name="radios1tipo" vs-value="2" @change="getfiltro()">Todos</vs-radio>
                    </li>
                </ul>
            </div>
        </div>
        <div class="vx-row">
            <vs-table search class="table users table-hover" style="width: 100%!important;" :max-items="10" pagination :data="agrupados" no-data-text="No hay datos disponibles">
                <template slot="header">
                    <vs-col vs-type="flex" vs-w="auto" class="mt-2 m-3">
                        <vs-chip class="mr-2" color="primary">Cantidad: <b>{{ agrupados.length }}</b></vs-chip>
                    </vs-col>
                </template>
                <template slot="thead">
                    <vs-th width="20%" sort-key="id_factura"> Datos Documento </vs-th>
                    <vs-th width="43%"> Datos cliente </vs-th>
                    <!-- <vs-th> Cantidad y Valor </vs-th> -->
                    <!-- <vs-th width="23%"> Pre-Facturas </vs-th> -->
                    <vs-th width="15%"> Estado </vs-th>
                    <vs-th width="5%"> Acciones </vs-th>
                </template>
                <template slot-scope="{ data }">
                    <vs-tr v-for="(tr, indextr) in data" :key="indextr">
                        <vs-td>
                            <small>{{ tr.id_factura }}</small><br>
                            <b>{{ tr.nombre }}</b><br>
                            Items: {{ tr.item }} <br />
                            libros: {{ tr.libros }} <br />
                            <b>${{ tr.ven_valor }}</b> <br />
                        </vs-td>
                        <vs-td>
                            <tr>
                                <td>
                                    <b>Institución:</b><br>
                                    <small>{{ tr.nombreInstitucion }}</small><br />
                                    <b>Dirección:</b><br>
                                    <small>{{ tr.direccionInstitucion }}</small><br />
                                    <b>Cédula cliente:</b><br>
                                    <small>{{ tr.cedula }}</small><br />
                                    <b>Nombre cliente:</b><br>
                                    <small>{{ tr.nombres }} {{ tr.apellidos }}</small>
                                </td>
                                <td v-if="tr.prefacturas.length > 0">
                                    <b>Prefacturas:</b><br>
                                    <div class="overflow-y-auto h-32">
                                        <div v-for="(t, k) in tr.prefacturas" :key="k">
                                            <p>{{ t.ven_codigo }}</p>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        </vs-td>
                        <vs-td>
                            <div v-if="tr.estadoPerseo == 1 && tr.est_ven_codigo == 0">
                                <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #0000ff">Enviado a perseo</div>
                                <b>Pedido perseo:</b>
                                <p>{{ tr.pedido_codigo }}</p>
                                <b>Fecha envio:</b>
                                <p>{{ tr.fecha_envio_perseo }}</p>
                                <br>
                            </div>
                            <div v-else-if="tr.estadoPerseo == 1 && tr.est_ven_codigo == 1" style="text-align:center;">
                                <b style="color: red;">Pedido Anulado</b><br>
                                <div style="padding:5px; border-radius:5px; color:White; font-size:17px;text-align:center; font-weight:bold; background-color: #f5515e">
                                    <b>Pedido perseo no valido:</b>
                                    <p>{{ tr.pedido_codigo }}</p>
                                </div>
                                <br>
                            </div>
                            <div v-else-if="tr.estadoPerseo == 0 && tr.est_ven_codigo == 1" style="text-align:center;">
                                <b style="color: red;">Pedido Anulado</b><br>
                                <div style="padding:5px; border-radius:5px; color:White; font-size:17px;text-align:center; font-weight:bold; background-color: #f5515e">
                                    <b>No se envio a Perseo</b>
                                </div>
                                <br>
                            </div>
                            <div v-else-if="tr.estadoPerseo == 0 && tr.est_ven_codigo == 0">
                                <vs-button color="dark" type="border" class="p-3 my-3" @click="confirmEnviarPerseo(tr)">
                                    <i class="fa-brands fa-discord"></i> Enviar a perseo
                                </vs-button>
                                <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: black">Pendiente a enviar a Perseo</div>
                            </div>
                        </vs-td>
                        <vs-td>
                            <vs-dropdown vs-custom-content vs-trigger-click>
                                <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                <vs-dropdown-menu style="width: 320px;" class="cursor">
                                    <vs-dropdown-item>
                                        <vs-button color="DarkOrchid" type="line" class="w-full" @click="factu= tr;getreporte(tr)">Generar pdf</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item>
                                        <vs-button color="danger" type="line" class="w-full" @click="confirmAnular(tr)">
                                            <i class="fa-solid fa-x"></i> Anular pedido
                                        </vs-button>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <vs-popup fullscreen :title="`${id}`" v-if="tdo==1&&id" :active.sync="popupImprimir">
            <facturaVue v-if="popupImprimir" :factu="factu" :id="id" @change="change" :op="op" />
        </vs-popup>
        <vs-popup :active.sync="mostrandoPopup" title="Verificación de Productos en Perseo">
            <!-- Estado de carga - Progreso de actualización automática -->
            <div v-if="enviandoProgreso" class="p-4">
                <div class="text-center mb-4">
                    <div class="loading-container">
                        <div class="spinner-border" role="status">
                            <span class="sr-only">Loading...</span>
                        </div>
                    </div>
                    <h3 class="text-lg font-semibold mt-2">Verificando productos en Perseo...</h3>
                    <p class="text-gray-600">Por favor espere mientras verificamos los {{ productosFaltantes.length }} productos faltantes</p>
                    <div class="mt-3 p-2 bg-blue-50 border border-blue-200 rounded-lg inline-block">
                        <span class="text-sm font-medium text-blue-800">
                            <i class="fas fa-building mr-2"></i>
                            Empresa: <strong>{{ getNombreEmpresa(ObjectSelected.id_empresa) }}</strong>
                        </span>
                    </div>
                </div>

                <div class="space-y-2">
                    <div v-for="item in progresoActualizacion" :key="item.codigo"
                         class="flex items-center justify-between p-3 border rounded-lg"
                         :class="{
                             'border-green-200 bg-green-50': item.estado === 'Actualizado',
                             'border-red-200 bg-red-50': item.estado === 'Error',
                             'border-blue-200 bg-blue-50': item.estado === 'Actualizando',
                             'border-gray-200 bg-gray-50': item.estado === 'Sin cambios',
                             'border-yellow-200 bg-yellow-50': item.estado === 'Pendiente'
                         }">
                        <div class="flex items-center">
                            <div class="mr-3">
                                <i v-if="item.estado === 'Actualizado'" class="fas fa-check-circle text-green-500"></i>
                                <i v-else-if="item.estado === 'Error'" class="fas fa-times-circle text-red-500"></i>
                                <i v-else-if="item.estado === 'Actualizando'" class="fas fa-spinner fa-spin text-blue-500"></i>
                                <i v-else-if="item.estado === 'Sin cambios'" class="fas fa-minus-circle text-gray-500"></i>
                                <i v-else class="fas fa-clock text-yellow-500"></i>
                            </div>
                            <div>
                                <span class="font-medium">{{ item.codigo }}</span>
                                <div v-if="item.mensaje" class="text-sm text-gray-600">{{ item.mensaje }}</div>
                            </div>
                        </div>
                        <vs-chip :color="getEstadoColor(item.estado)" size="small">
                            {{ item.estado }}
                        </vs-chip>
                    </div>
                </div>
            </div>

            <!-- Resultados finales -->
            <div v-if="!enviandoProgreso && progresoActualizacion.length > 0" class="p-4">
                <div class="mb-4">
                    <h3 class="text-lg font-semibold mb-4">Verificación completada</h3>

                    <!-- Alerta única que muestra el estado general -->
                    <div class="mb-4 p-4 rounded-lg border"
                         :class="{
                             'bg-green-100 border-green-300': progresoActualizacion.every(p => p.estado === 'Actualizado' || p.estado === 'Sin cambios'),
                             'bg-orange-100 border-orange-300': productosNoEncontradosEnPerseo.length > 0,
                             'bg-red-100 border-red-300': productosNoEncontradosEnPerseo.length === 0 && progresoActualizacion.some(p => p.estado === 'Error')
                         }">

                        <!-- Estado: Todos listos -->
                        <div v-if="progresoActualizacion.every(p => p.estado === 'Actualizado' || p.estado === 'Sin cambios')" class="text-center">
                            <i class="fas fa-check-circle text-green-600 text-2xl mb-2"></i>
                            <h4 class="text-green-800 font-semibold mb-2">✅ Todos los productos están listos</h4>
                            <p class="text-green-700 text-sm">Ahora puedes enviar el pedido a Perseo</p>
                        </div>

                        <!-- Estado: Productos no registrados en PERSEO -->
                        <div v-else-if="productosNoEncontradosEnPerseo.length > 0" class="text-center">
                            <i class="fas fa-exclamation-triangle text-orange-600 text-2xl mb-2"></i>
                            <h4 class="text-orange-800 font-semibold mb-2">⚠️ Productos NO registrados en PERSEO</h4>
                            <p class="text-orange-700 text-sm mb-3">
                                {{ productosNoEncontradosEnPerseo.length }} {{ productosNoEncontradosEnPerseo.length === 1 ? 'producto no se encuentra' : 'productos no se encuentran' }} registrados en PERSEO
                            </p>
                            <p class="text-orange-700 text-sm font-medium">
                                📞 Comunícate con el personal de <strong>Contabilidad</strong> para registrar {{ productosNoEncontradosEnPerseo.length === 1 ? 'este producto' : 'estos productos' }}
                            </p>
                        </div>

                        <!-- Estado: Errores técnicos -->
                        <div v-else class="text-center">
                            <i class="fas fa-exclamation-triangle text-red-600 text-2xl mb-2"></i>
                            <h4 class="text-red-800 font-semibold mb-2">❌ Errores técnicos encontrados</h4>
                            <p class="text-red-700 text-sm mb-2">
                                {{ progresoActualizacion.filter(p => p.estado === 'Error').length }} {{ progresoActualizacion.filter(p => p.estado === 'Error').length === 1 ? 'producto tiene errores' : 'productos tienen errores' }} técnicos
                            </p>
                            <p class="text-red-700 text-sm font-medium">
                                🛠️ Comunícate con el equipo de <strong>Soporte</strong> para resolver estos problemas
                            </p>
                        </div>
                    </div>

                    <!-- Resumen -->
                    <div class="grid grid-cols-3 gap-4 mb-4">
                        <div class="text-center p-3 bg-green-50 rounded-lg">
                            <div class="text-2xl font-bold text-green-600">
                                {{ progresoActualizacion.filter(p => p.estado === 'Actualizado' || p.estado === 'Sin cambios').length }}
                            </div>
                            <div class="text-sm text-green-600">Exitosos</div>
                        </div>
                        <div class="text-center p-3 bg-red-50 rounded-lg">
                            <div class="text-2xl font-bold text-red-600">
                                {{ progresoActualizacion.filter(p => p.estado === 'Error').length }}
                            </div>
                            <div class="text-sm text-red-600">Con errores</div>
                        </div>
                        <div class="text-center p-3 bg-blue-50 rounded-lg">
                            <div class="text-2xl font-bold text-blue-600">
                                {{ progresoActualizacion.length }}
                            </div>
                            <div class="text-sm text-blue-600">Total</div>
                        </div>
                    </div>
                </div>

                <!-- Lista detallada -->
                <div class="space-y-2 mb-4 max-h-64 overflow-y-auto">
                    <div v-for="item in progresoActualizacion" :key="item.codigo"
                         class="flex items-center justify-between p-3 border rounded-lg"
                         :class="{
                             'border-green-200 bg-green-50': item.estado === 'Actualizado' || item.estado === 'Sin cambios',
                             'border-red-200 bg-red-50': item.estado === 'Error'
                         }">
                        <div class="flex items-center">
                            <div class="mr-3">
                                <i v-if="item.estado === 'Actualizado'" class="fas fa-check-circle text-green-500"></i>
                                <i v-else-if="item.estado === 'Sin cambios'" class="fas fa-check-circle text-gray-500"></i>
                                <i v-else-if="item.estado === 'Error'" class="fas fa-times-circle text-red-500"></i>
                            </div>
                            <div>
                                <span class="font-medium">{{ item.codigo }}</span>
                                <div v-if="item.mensaje" class="text-sm"
                                     :class="{
                                         'text-green-600': item.estado === 'Actualizado',
                                         'text-gray-600': item.estado === 'Sin cambios',
                                         'text-red-600': item.estado === 'Error'
                                     }">
                                    {{ item.mensaje }}
                                </div>
                            </div>
                        </div>
                        <vs-chip :color="getEstadoColor(item.estado)" size="small">
                            {{ item.estado }}
                        </vs-chip>
                    </div>
                </div>

                <!-- Botones de acción -->
                <div class="flex justify-center space-x-4">
                    <!-- Botón para enviar a Perseo - solo si todos están bien Y no hay productos no encontrados -->
                    <vs-button
                        color="success"
                        v-if="progresoActualizacion.every(p => p.estado === 'Actualizado' || p.estado === 'Sin cambios') && productosNoEncontradosEnPerseo.length === 0"
                        @click="reintentarEnvioPerseo"
                        size="large">
                        <i class="fas fa-paper-plane mr-2"></i>
                        Enviar a Perseo
                    </vs-button>

                    <!-- Botón para reintentar verificación - solo si hay errores técnicos (no productos no encontrados) -->
                    <vs-button
                        color="warning"
                        v-if="progresoActualizacion.some(p => p.estado === 'Error') && productosNoEncontradosEnPerseo.length === 0"
                        @click="reiniciarVerificacion"
                        size="large">
                        <i class="fas fa-redo mr-2"></i>
                        Reintentar Verificación
                    </vs-button>

                    <!-- Botón para cerrar -->
                    <vs-button
                        color="dark"
                        type="border"
                        @click="cerrarPopup"
                        size="large">
                        <i class="fas fa-times mr-2"></i>
                        Cerrar
                    </vs-button>
                </div>
            </div>
        </vs-popup>

    </vx-card>
</div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select';
const facturaVue = () => import('./facturaReal.vue');
export default {
    components: {
        flatPickr,
        'v-select': vSelect,
        facturaVue,
    },

    data: () => ({
        datos: [],
        agrupados: [],
        estadoPerseo: 0,
        id: '',
        op: '',
        tdo: 0,
        factu: '',
        ObjectSelected: '',
        popupImprimir: false,
        productosFaltantes: [],
        progresoActualizacion: [],
        productosNoEncontradosEnPerseo: [],
        mostrandoPopup: false,
        enviandoProgreso: false
    }),
    props: {
        periodoSelect: {
            type: Object,
            default: () => ({}),
        },
    },
    mounted() {
        this.estadoPerseo = 0;
        this.$vs.loading();
        this.getagrupados();
        setTimeout(() => {
            this.getfiltro();
            this.$vs.loading.close();
        }, 1000)

    },
    // computed: {
    //     filteredAgrupados() {
    //         if (!this.searchQuery) {
    //             return this.agrupados; // Devuelve todos los datos si no hay búsqueda
    //         }

    //         const query = this.searchQuery.toLowerCase();
    //         return this.agrupados.filter(item => {
    //             return (
    //                 item.ven_codigo.toLowerCase().includes(query) ||
    //                 item.nombreInstitucion.toLowerCase().includes(query) ||
    //                 item.cedula.toLowerCase().includes(query) ||
    //                 (item.nombres + ' ' + item.apellidos).toLowerCase().includes(query)
    //             );
    //         });
    //     },
    // },
    methods: {
        getagrupados() {
            let me = this;
            me.$vs.loading();
            me.$http.get(this.$server_url + 'GetFacturasxAgrupaXPeriodo?periodo=' + this.periodoSelect.idperiodoescolar)
                .then((res) => {
                    me.datos = res.data;
                    me.getfiltro()
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },
        getfiltro() {
            let me = this;
            me.agrupados = []
            //TIPO documento=============
            //todas
            if (me.estadoPerseo == 0) {
                let dato = me.datos.filter(p => p.estadoPerseo == 0 && p.est_ven_codigo == 0);
                me.agrupados = dato;
            } else if (me.estadoPerseo == 1) {
                let dato = me.datos.filter(p => p.estadoPerseo == 1);
                me.agrupados = dato;

            } else if (me.estadoPerseo == 2) {
                let dato = me.datos;
                me.agrupados = dato;
            } else if (me.estadoPerseo == 3) {
                let dato = me.datos.filter(p => p.est_ven_codigo == 1);
                me.agrupados = dato;
            }
        },
        change(e) {
            if (e == true) {
                this.tdo = 0;
            }
        },
        getreporte(tr) {
            this.tdo = 0;
            this.id = tr.id_factura;
            if (tr.idtipodoc == 11) {
                this.tdo = 1;
                this.op = '1';
                console.log('object');
            }
            this.popupImprimir = true;
        },
        //METODOS DE PERSEO
        confirmEnviarPerseo(tr) {
            this.ObjectSelected = tr;
            this.$vs.dialog({
                type: 'confirm',
                color: 'dark',
                title: 'Enviar a Perseo',
                text: `¿Está seguro de enviar lo facturado real ${tr.id_factura} para crear un pedido en Perseo?`,
                acceptText: 'Aceptar',
                accept: this.enviarPerseo,
                cancelText: 'Cancelar',
                cancel: false
            })
        },
        enviarPerseo() {
            let me = this;
            let formData = new FormData();
            formData.append("ven_codigo", this.ObjectSelected.id_factura);
            formData.append("id_empresa", this.ObjectSelected.id_empresa);

            me.$vs.loading();

            this.$http.post(this.$server_url + "api/perseo/transaccion/pedidos_crear", formData)
                .then((res) => {
                    me.$vs.loading.close();

                    if (res.data.status == 0 && res.data.codigosFaltantes) {
                        me.productosFaltantes = res.data.codigosFaltantes.split(',').map(c => c.trim());
                        me.progresoActualizacion = []; // Inicializar vacío
                        me.mostrandoPopup = true;

                        // Ejecutar automáticamente la verificación después de un breve delay
                        setTimeout(() => {
                            me.actualizarProductosFaltantes();
                        }, 500);
                        return;
                    }

                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        return;
                    }

                    if (res.data.fault) {
                        me.$vs.notify({
                            text: "Ocurrió un error en el envío a Perseo",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        return;
                    }

                    me.getagrupados();
                    me.$vs.notify({
                        text: "Envío a Perseo exitoso",
                        color: "success",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                })
                .catch((error) => {
                    console.error(error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "No se pudo enviar a Perseo",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },

        actualizarProductosFaltantes() {
            let me = this;

            // Inicializar arrays
            me.progresoActualizacion = me.productosFaltantes.map(codigo => ({
                codigo: codigo,
                estado: 'Pendiente',
                mensaje: ''
            }));
            me.productosNoEncontradosEnPerseo = [];

            me.enviandoProgreso = true;

            const promesas = me.progresoActualizacion.map((item, index) => {
                me.$set(me.progresoActualizacion[index], 'estado', 'Actualizando');
                me.$set(me.progresoActualizacion[index], 'mensaje', 'Verificando en Perseo...');

                let empresa = 'calmed';
                if (me.ObjectSelected.id_empresa == 1 || me.ObjectSelected.id_empresa == 6) {
                    empresa = 'prolipa';
                } else if (me.ObjectSelected.id_empresa == 3) {
                    empresa = 'calmed';
                } else if (me.ObjectSelected.id_empresa == 4) {
                    empresa = 'calmed26';
                } else if (me.ObjectSelected.id_empresa == 5) {
                    empresa = 'prolipa26';
                }

                // Evitar errores 404 si el código contiene espacios o caracteres especiales
                let codigoCodificado = encodeURIComponent(item.codigo);
                let url = `${me.$server_url}verificarProductosPerseo/${codigoCodificado}/${empresa}`;

                return me.$http.get(url)
                    .then(res => {
                        if (res.data.estado === 1) {
                            me.$set(me.progresoActualizacion[index], 'estado', 'Actualizado');
                            me.$set(me.progresoActualizacion[index], 'mensaje', res.data.mensaje || 'Producto actualizado correctamente');
                        } else if (res.data.estado === 0) {
                            me.$set(me.progresoActualizacion[index], 'estado', 'Sin cambios');
                            me.$set(me.progresoActualizacion[index], 'mensaje', res.data.mensaje || 'No hay cambios necesarios');
                        } else {
                            me.$set(me.progresoActualizacion[index], 'estado', 'Error');
                            me.$set(me.progresoActualizacion[index], 'mensaje', res.data.mensaje || 'Error desconocido');

                            // Verificar si es un error de "no se encuentra en Perseo"
                            if (res.data.mensaje && res.data.mensaje.includes('no se encuentra en Perseo')) {
                                me.productosNoEncontradosEnPerseo.push(item.codigo);
                            }
                        }
                    })
                    .catch(error => {
                        console.error(`Error verificando producto ${item.codigo}:`, error);
                        me.$set(me.progresoActualizacion[index], 'estado', 'Error');

                        // Extraer mensaje de error más específico
                        let mensajeError = 'Error de conexión';
                        if (error.response && error.response.data) {
                            if (error.response.data.mensaje) {
                                mensajeError = error.response.data.mensaje;
                                // Verificar si es un error de "no se encuentra en Perseo"
                                if (mensajeError.includes('no se encuentra en Perseo')) {
                                    me.productosNoEncontradosEnPerseo.push(item.codigo);
                                }
                            } else if (error.response.data.message) {
                                mensajeError = error.response.data.message;
                            } else if (typeof error.response.data === 'string') {
                                mensajeError = error.response.data;
                            }
                        } else if (error.message) {
                            mensajeError = error.message;
                        }

                        me.$set(me.progresoActualizacion[index], 'mensaje', mensajeError);
                    });
            });

            Promise.all(promesas).then(() => {
                me.enviandoProgreso = false;

                // Mostrar notificación de resumen
                const actualizados = me.progresoActualizacion.filter(p => p.estado === 'Actualizado').length;
                const errores = me.progresoActualizacion.filter(p => p.estado === 'Error').length;
                const noEncontrados = me.productosNoEncontradosEnPerseo.length;

                if (noEncontrados > 0) {
                    me.$vs.notify({
                        text: `${noEncontrados} productos no están registrados en PERSEO. Contacta con Contabilidad.`,
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                    });
                } else if (errores === 0) {
                    me.$vs.notify({
                        text: `Verificación completada. ${actualizados} productos procesados correctamente. Reenviando a Perseo automáticamente...`,
                        color: "success",
                        iconPack: "feather",
                        icon: "icon-check",
                    });

                    // Reenvío automático a Perseo
                    setTimeout(() => {
                        me.reintentarEnvioPerseo();
                    }, 1500);
                } else {
                    me.$vs.notify({
                        text: `Verificación completada con ${errores} errores técnicos. Contacta con Soporte.`,
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                    });
                }
            });
        },

        getEstadoColor(estado) {
            switch (estado) {
                case 'Actualizado':
                    return 'success';
                case 'Error':
                    return 'danger';
                case 'Actualizando':
                    return 'primary';
                case 'Sin cambios':
                    return 'dark';
                case 'Pendiente':
                default:
                    return 'warning';
            }
        },

        getNombreEmpresa(id_empresa) {
            switch (id_empresa) {
                case 1:
                    return 'PROLIPA';
                case 5:
                    return 'PROLIPA 2026';
                case 4:
                    return 'CALMED 2026';
                default:
                    return 'CALMED';
            }
        },

        reiniciarVerificacion() {
            // Reiniciar el array de progreso y volver a ejecutar la verificación
            this.progresoActualizacion = [];
            this.productosNoEncontradosEnPerseo = [];
            this.actualizarProductosFaltantes();
        },

        cerrarPopup() {
            this.mostrandoPopup = false;
            this.progresoActualizacion = [];
            this.productosFaltantes = [];
            this.productosNoEncontradosEnPerseo = [];
        },

        reintentarEnvioPerseo() {
            this.mostrandoPopup = false;
            this.enviarPerseo(); // vuelve a intentar el envío original
        },

        //FIN METODOS DE PERSEO
        confirmAnular(tr) {
            this.ObjectSelected = tr;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Anular pedido',
                text: `¿Está seguro de anular ${tr.id_factura} ?`,
                acceptText: 'Aceptar',
                accept: this.AnularPedido,
                cancelText: 'Cancelar',
                cancel: false
            })
        },
        AnularPedido() {
            let me = this;
            let formData = new FormData();
            formData.append("ven_codigo", this.ObjectSelected.id_factura);
            formData.append("id_empresa", this.ObjectSelected.id_empresa);
            formData.append("estado", 1);

            me.$vs.loading();

            this.$http
                .post(this.$server_url + "anularPedido", formData)
                .then((res) => {
                    me.$vs.loading.close();
                    if (res.data.success) {

                        this.ObjectSelected.est_ven_codigo = 1;

                        me.$vs.notify({
                            text: `Pedido ${this.ObjectSelected.id_factura} anulado correctamente.`,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                        });
                    } else {
                        me.$vs.notify({
                            text: `No se pudo anular el pedido ${this.ObjectSelected.id_factura}.`,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x',
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "Ocurrió un error al intentar anular el pedido.",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },

    },
}
</script>

<style scoped>
.loading-container {
    display: flex;
    justify-content: center;
    margin-bottom: 1rem;
}

.spinner-border {
    display: inline-block;
    width: 2rem;
    height: 2rem;
    vertical-align: text-bottom;
    border: .25em solid currentColor;
    border-right-color: transparent;
    border-radius: 50%;
    animation: spinner-border .75s linear infinite;
    color: #7367f0;
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0,0,0,0);
    white-space: nowrap;
    border: 0;
}

@keyframes spinner-border {
    to { transform: rotate(360deg); }
}

.space-y-2 > * + * {
    margin-top: 0.5rem;
}

.space-x-4 > * + * {
    margin-left: 1rem;
}

.grid {
    display: grid;
}

.grid-cols-2 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
}

.grid-cols-3 {
    grid-template-columns: repeat(3, minmax(0, 1fr));
}

.gap-4 {
    gap: 1rem;
}

.text-center {
    text-align: center;
}

.text-lg {
    font-size: 1.125rem;
}

.text-sm {
    font-size: 0.875rem;
}

.text-4xl {
    font-size: 2.25rem;
}

.text-2xl {
    font-size: 1.5rem;
}

.font-semibold {
    font-weight: 600;
}

.font-bold {
    font-weight: 700;
}

.font-medium {
    font-weight: 500;
}

.p-3 {
    padding: 0.75rem;
}

.p-4 {
    padding: 1rem;
}

.mb-2 {
    margin-bottom: 0.5rem;
}

.mb-4 {
    margin-bottom: 1rem;
}

.mt-2 {
    margin-top: 0.5rem;
}

.mt-3 {
    margin-top: 0.75rem;
}

.mr-2 {
    margin-right: 0.5rem;
}

.mr-3 {
    margin-right: 0.75rem;
}

.m-1 {
    margin: 0.25rem;
}

.max-h-64 {
    max-height: 16rem;
}

.overflow-y-auto {
    overflow-y: auto;
}

.border {
    border-width: 1px;
}

.border-green-200 {
    border-color: #a7f3d0;
}

.border-red-200 {
    border-color: #fecaca;
}

.border-blue-200 {
    border-color: #bfdbfe;
}

.border-gray-200 {
    border-color: #e5e7eb;
}

.border-yellow-200 {
    border-color: #fef3c7;
}

.border-green-300 {
    border-color: #86efac;
}

.border-red-300 {
    border-color: #fca5a5;
}

.border-orange-300 {
    border-color: #fdba74;
}

.bg-green-50 {
    background-color: #f0fdf4;
}

.bg-red-50 {
    background-color: #fef2f2;
}

.bg-blue-50 {
    background-color: #eff6ff;
}

.bg-gray-50 {
    background-color: #f9fafb;
}

.bg-yellow-50 {
    background-color: #fffbeb;
}

.bg-green-100 {
    background-color: #dcfce7;
}

.bg-red-100 {
    background-color: #fee2e2;
}

.bg-orange-100 {
    background-color: #ffedd5;
}

.text-green-500 {
    color: #10b981;
}

.text-green-600 {
    color: #059669;
}

.text-green-700 {
    color: #047857;
}

.text-green-800 {
    color: #065f46;
}

.text-red-500 {
    color: #ef4444;
}

.text-red-600 {
    color: #dc2626;
}

.text-red-700 {
    color: #b91c1c;
}

.text-red-800 {
    color: #991b1b;
}

.text-orange-600 {
    color: #ea580c;
}

.text-orange-700 {
    color: #c2410c;
}

.text-orange-800 {
    color: #9a3412;
}

.text-blue-500 {
    color: #3b82f6;
}

.text-blue-600 {
    color: #2563eb;
}

.text-blue-800 {
    color: #1e40af;
}

.text-gray-500 {
    color: #6b7280;
}

.text-gray-600 {
    color: #4b5563;
}

.text-yellow-500 {
    color: #f59e0b;
}

.text-warning {
    color: #f59e0b;
}

.rounded-lg {
    border-radius: 0.5rem;
}

.inline-block {
    display: inline-block;
}

.flex {
    display: flex;
}

.items-center {
    align-items: center;
}

.justify-between {
    justify-content: space-between;
}

.justify-center {
    justify-content: center;
}

.fa-spin {
    animation: fa-spin 2s infinite linear;
}

@keyframes fa-spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}
</style>
