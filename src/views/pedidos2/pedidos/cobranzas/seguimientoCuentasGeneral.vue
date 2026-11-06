<template>
    <div class="p-4 space-y-4" style="background-color: white; border-radius: 15px;">
        <h2 class="text-2xl font-semibold text-gray-700">Seguimiento de Cuentas</h2>
    
        <div>
            <label class="block text-sm font-medium text-gray-600">Selecciona una Cuenta de Pago</label>
            <v-select v-model="cuePagSeleccionado" :options="cuentasPagoConTodas" label="cue_pag_nombre" :reduce="item => item" placeholder="Seleccionar cuenta" class="mt-2 w-full" @input="limpiarDatos" />
        </div>
    
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
                <label class="block text-sm font-medium text-gray-600">Fecha de Inicio</label>
                <flat-pickr :config="configdateTimePicker" v-model="fechaInicio" placeholder="Fecha de inicio" class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md" @input="limpiarDatos" />
            </div>
    
            <div>
                <label class="block text-sm font-medium text-gray-600">Fecha de Fin</label>
                <flat-pickr :config="configdateTimePicker" v-model="fechaFin" placeholder="Fecha de fin" class="mt-2 w-full px-3 py-2 border border-gray-300 rounded-md" @input="limpiarDatos" />
            </div>
        </div>
    
        <div class="mt-4">
            <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                <li class="modelx">
                </li>
                <li style="margin:10px 10px 0px 0px;">
                    <vs-radio vs-name="radios1" vs-value="0" v-model="selectedOption" @input="limpiarDatos();busqueda='Todo'">Todo</vs-radio>
                </li>
                <li style="margin:10px 10px 0px 0px;">
                    <vs-radio vs-name="radios2" vs-value="1" v-model="selectedOption" @input="limpiarDatos();busqueda='Pendientes'">Pendientes</vs-radio>
                </li>
                <li style="margin:10px 10px 0px 0px;">
                    <vs-radio vs-name="radios3" vs-value="2" v-model="selectedOption" @input="limpiarDatos();busqueda='Verificados'">Verificados</vs-radio>
                </li>
            </ul>
        </div>
    
        <vs-button @click="obtenerAbonos" color="primary" class="w-full sm:w-auto mt-4">
            Obtener Abonos
        </vs-button>
    
        <!-- Mostrar los resultados -->
        <div class="mt-6" style="overflow-x:auto;">
            <vs-table v-if="busquedacheck === 'Todo'" max-items="10" pagination search :data="abonos" no-data-text="No hay datos disponibles">
                <template slot="header">
                    <div class="flex items-center" v-if="abonos.length > 0">
                        <h5 v-if="abonos.length > 0" class="mx-5"><b>Cuenta: {{ cuePagSeleccionado.cue_pag_nombre }}</b></h5>
                        <h5 class="mx-5"><b>Total Abono:</b> {{ totalAbonado | filtrarDecimal }}</h5>
                        <vs-button @click="downloadReportAbonos" color="success" class="w-full sm:w-auto mx-4" icon-pack="feather" icon="icon-file-text">
                            Exportar a Excel
                        </vs-button>
                    </div>
                </template>
    
                <template slot="thead">
                    <vs-th width="250" sort-key="abono_id">
                        {{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'N° RETENCIÓN' : 'N° ABONO' }}</vs-th>
                    <!-- <vs-th sort-key="cue_pag_nombre">NOM. CUENTA</vs-th> -->
                    <vs-th>
                        {{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'INFORMACIÓN RETENCIÓN' : 'INFORMACIÓN ABONO' }}</vs-th>
                    <vs-th v-if="cuePagSeleccionado.cue_pag_codigo == 8" sort-key="abono_empresa">EVIDENCIA</vs-th>
                    <vs-th>INFORMACION CLIENTE</vs-th>
                    <!-- <vs-th sort-key="abono_empresa">CLIENTE</vs-th>
                    <vs-th sort-key="abono_empresa">LUGAR DESPACHO</vs-th> -->
                </template>
    
                <template slot-scope="{ data }">
                    <vs-tr :key="tr.abono_id" v-for="(tr, indextr) in data" :data="tr">
                        <!-- N° ABONO -->
                        <vs-td>{{ tr.abono_id }} <br><b>Creado el: </b> {{ tr.created_at }}</vs-td>
    
                        <!-- NOM. CUENTA -->
                        <!-- <vs-td>{{ tr.cue_pag_nombre }}</vs-td> -->
                        <vs-td width="350">
                            <small><b>{{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'Documento Retención:' : 'Documento Abono:' }}</b> {{ tr.abono_documento }}</small>
                            <br>
                            <small><b>{{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'Valor Retención:' : 'Valor Abono:' }}</b>
                                ${{ cuePagSeleccionado.cue_pag_codigo == 8 ? tr.abono_valor_retencion : (tr.abono_facturas > 0 ? tr.abono_facturas : (tr.abono_notas > 0 ? tr.abono_notas : 0)) }}
                            </small>
                            <br>
                            <small><b>{{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'Fecha Retención:' : 'Fecha Abono:' }}</b> {{ tr.abono_fecha }}</small>
                        </vs-td>
                        <!-- EVIDENCIA -->
                        <vs-td v-if="cuePagSeleccionado.cue_pag_codigo == 8" width="100">
                            <div v-if="tr.egf_url == null">
                                <!-- <b style="color: red;">No hay evidencia cargada para esta retención.</b> -->
                            </div>
                            <vs-button v-else style="display: inline" @click="mostrarArchivo(tr)" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                        </vs-td>
                        <!-- INFORMACION CLIENTE -->
                        <vs-td width="700">
                            <small><b>Empresa: </b>{{ tr.abono_empresa == 1 ? 'PROLIPA' : 'CALMED S.A' }}</small>
                            <br>
                            <small><b>Cliente: </b>{{ tr.cliente || 'No Disponible' }}</small>
                            <br>
                            <small><b>Lugar Despacho: </b>{{ tr.institucion || 'No Disponible' }}</small>
                            <br>
                            <small><b>Concepto: </b>{{ tr.abono_concepto || 'No Disponible' }}</small>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
    
            <vs-table v-if="busquedacheck === 'Pendientes'" max-items="10" pagination search :data="abonosPendientes" multiple v-model="abonosSeleccionados" no-data-text="No hay datos disponibles">
                <template slot="header">
                    <div class="flex items-center" v-if="abonos.length > 0">
                        <h5 class="mx-5" v-if="abonos.length > 0"><b>Cuenta: {{ cuePagSeleccionado.cue_pag_nombre }}</b></h5>
                        <h5 class="mx-5"><b>Total Abono:</b> {{ totalAbonado | filtrarDecimal }}</h5>
                        <vs-button @click="downloadReportAbonos" color="success" class="w-full sm:w-auto mx-4" icon-pack="feather" icon="icon-file-text">
                            Exportar a Excel
                        </vs-button>
                        <vs-button v-if="abonosSeleccionados.length > 0" @click="CambioEstadoAbonos(2)" color="danger" class="w-full sm:w-auto mx-4" icon-pack="feather" icon="icon-check">
                            Marcar como verificados ({{ abonosSeleccionados.length }})
                        </vs-button>
                    </div>
                </template>
    
                <template slot="thead">
                    <vs-th width="250" sort-key="abono_id">
                        {{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'N° RETENCIÓN' : 'N° ABONO' }}</vs-th>
                    <!-- <vs-th sort-key="cue_pag_nombre">NOM. CUENTA</vs-th> -->
                    <vs-th>
                        {{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'INFORMACIÓN RETENCIÓN' : 'INFORMACIÓN ABONO' }}</vs-th>
                    <vs-th v-if="cuePagSeleccionado.cue_pag_codigo == 8" sort-key="abono_empresa">EVIDENCIA</vs-th>
                    <vs-th>INFORMACION CLIENTE</vs-th>
                    <!-- <vs-th sort-key="abono_empresa">CLIENTE</vs-th>
                    <vs-th sort-key="abono_empresa">LUGAR DESPACHO</vs-th> -->
                </template>
    
                <template slot-scope="{ data }">
                    <vs-tr :key="tr.abono_id" v-for="(tr, indextr) in data" :data="tr">
                        <!-- N° ABONO -->
                        <vs-td>{{ tr.abono_id }} <br><b>Creado el: </b> {{ tr.created_at }}</vs-td>
    
                        <!-- NOM. CUENTA -->
                        <!-- <vs-td>{{ tr.cue_pag_nombre }}</vs-td> -->
                        <vs-td width="350">
                            <small><b>{{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'Documento Retención:' : 'Documento Abono:' }}</b> {{ tr.abono_documento }}</small>
                            <br>
                            <small><b>{{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'Valor Retención:' : 'Valor Abono:' }}</b>
                                ${{ cuePagSeleccionado.cue_pag_codigo == 8 ? tr.abono_valor_retencion : (tr.abono_facturas > 0 ? tr.abono_facturas : (tr.abono_notas > 0 ? tr.abono_notas : 0)) }}
                            </small>
                            <br>
                            <small><b>{{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'Fecha Retención:' : 'Fecha Abono:' }}</b> {{ tr.abono_fecha }}</small>
                        </vs-td>
                        <!-- EVIDENCIA -->
                        <vs-td v-if="cuePagSeleccionado.cue_pag_codigo == 8" width="100">
                            <div v-if="tr.egf_url == null">
                                <!-- <b style="color: red;">No hay evidencia cargada para esta retención.</b> -->
                            </div>
                            <vs-button v-else style="display: inline" @click="mostrarArchivo(tr)" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                        </vs-td>
                        <!-- INFORMACION CLIENTE -->
                        <vs-td width="700">
                            <small><b>Empresa: </b>{{ tr.abono_empresa == 1 ? 'PROLIPA' : 'CALMED S.A' }}</small>
                            <br>
                            <small><b>Cliente: </b>{{ tr.cliente || 'No Disponible' }}</small>
                            <br>
                            <small><b>Lugar Despacho: </b>{{ tr.institucion || 'No Disponible' }}</small>
                            <br>
                            <small><b>Concepto: </b>{{ tr.abono_concepto || 'No Disponible' }}</small>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
    
            <vs-table v-if="busquedacheck === 'Verificados'" max-items="10" pagination search :data="abonosVerificados" no-data-text="No hay datos disponibles">
                <template slot="header">
                    <div class="flex items-center" v-if="abonos.length > 0">
                        <h5 class="mx-5" v-if="abonos.length > 0"><b>Cuenta: {{ cuePagSeleccionado.cue_pag_nombre }}</b></h5>
                        <h5 class="mx-5"><b>Total Abono:</b> {{ totalAbonado | filtrarDecimal }}</h5>
                        <vs-button @click="downloadReportAbonos" color="success" class="w-full sm:w-auto mx-4" icon-pack="feather" icon="icon-file-text">
                            Exportar a Excel
                        </vs-button>
                    </div>
                </template>
    
                <template slot="thead">
                    <vs-th width="250" sort-key="abono_id">
                        {{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'N° RETENCIÓN' : 'N° ABONO' }}</vs-th>
                    <!-- <vs-th sort-key="cue_pag_nombre">NOM. CUENTA</vs-th> -->
                    <vs-th>
                        {{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'INFORMACIÓN RETENCIÓN' : 'INFORMACIÓN ABONO' }}</vs-th>
                    <vs-th v-if="cuePagSeleccionado.cue_pag_codigo == 8" sort-key="abono_empresa">EVIDENCIA</vs-th>
                    <vs-th>INFORMACION CLIENTE</vs-th>
                    <!-- <vs-th sort-key="abono_empresa">CLIENTE</vs-th>
                    <vs-th sort-key="abono_empresa">LUGAR DESPACHO</vs-th> -->
                </template>
    
                <template slot-scope="{ data }">
                    <vs-tr :key="tr.abono_id" v-for="(tr, indextr) in data" :data="tr">
                        <!-- N° ABONO -->
                        <vs-td>{{ tr.abono_id }} <br><span>Fecha verificación: {{ tr.fecha_verificacion }}</span> </vs-td>
    
                        <!-- NOM. CUENTA -->
                        <!-- <vs-td>{{ tr.cue_pag_nombre }}</vs-td> -->
                        <vs-td width="350">
                            <small><b>{{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'Documento Retención:' : 'Documento Abono:' }}</b> {{ tr.abono_documento }}</small>
                            <br>
                            <small><b>{{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'Valor Retención:' : 'Valor Abono:' }}</b>
                                ${{ cuePagSeleccionado.cue_pag_codigo == 8 ? tr.abono_valor_retencion : (tr.abono_facturas > 0 ? tr.abono_facturas : (tr.abono_notas > 0 ? tr.abono_notas : 0)) }}
                            </small>
                            <br>
                            <small><b>{{ cuePagSeleccionado.cue_pag_codigo == 8 ? 'Fecha Retención:' : 'Fecha Abono:' }}</b> {{ tr.abono_fecha }}</small>
                        </vs-td>
                        <!-- EVIDENCIA -->
                        <vs-td v-if="cuePagSeleccionado.cue_pag_codigo == 8" width="100">
                            <div v-if="tr.egf_url == null">
                                <!-- <b style="color: red;">No hay evidencia cargada para esta retención.</b> -->
                            </div>
                            <vs-button v-else style="display: inline" @click="mostrarArchivo(tr)" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                        </vs-td>
                        <!-- INFORMACION CLIENTE -->
                        <vs-td width="700">
                            <small><b>Empresa: </b>{{ tr.abono_empresa == 1 ? 'PROLIPA' : 'CALMED S.A' }}</small>
                            <br>
                            <small><b>Cliente: </b>{{ tr.cliente || 'No Disponible' }}</small>
                            <br>
                            <small><b>Lugar Despacho: </b>{{ tr.institucion || 'No Disponible' }}</small>
                            <br>
                            <small><b>Concepto: </b>{{ tr.abono_concepto || 'No Disponible' }}</small>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
    
        </div>
    </div>
    </template>
    
    <script>
    import {
        utils,
        writeFile
    } from 'xlsx';
    import moment from 'moment';
    import vSelect from "vue-select";
    import flatPickr from 'vue-flatpickr-component';
    
    export default {
        components: {
            "v-select": vSelect,
            flatPickr,
        },
        data() {
            return {
                selectedOption: 0,
                usuario: JSON.parse(localStorage.getItem("usuario")),
                cuentasPago: [],
                cuentasPagoConTodas: [],
                cuePagSeleccionado: null,
                fechaInicio: null,
                fechaFin: null,
                abonos: [],
                abonosPendientes: [],
                abonosVerificados: [],
                configdateTimePicker: {
                    enableTime: true,
                    dateFormat: 'Y-m-d',
                    onChange: this.onDateChange,
                },
                totalAbonado: 0,
                abonosSeleccionados: [],
                busqueda: 'Todo',
                busquedacheck: null
            };
        },
        props: {
            predioSeleccionado: {
                type: Number,
                default: 0,
            }
        },
        created() {
            this.obtenerCuentasPago();
        },
        mounted() {
            if (!this.hasFetchedDocuments) {
                //con moment
                this.fromDate = moment().startOf('month').format('YYYY-MM-DD');
                this.toDate = moment().endOf('month').format('YYYY-MM-DD');
                this.hasFetchedDocuments = true; // Marca como ya ejecutado
            }
        },
        methods: {
            mostrarArchivo(tr) {
                console.log(tr.egf_url, "datos");
                // return;
                if (tr.egf_url.substr(-3) == "pdf" || tr.egf_url.substr(-3) == "png" || tr.egf_url.substr(-3) == "jpg" || tr.egf_url.substr(-4) == "jpeg" || tr.egf_url.substr(-3) == "PNG" || tr.egf_url.substr(-3) == "gif") {
                    window.open(this.$data_url + 'archivos/evidenciaglobal/' + tr.egft_nombre + '/' + tr.egf_url, '_blank');
                } else if (tr.egf_url.substr(-3) == "doc" || tr.egf_url.substr(-3) == "docx" || tr.egf_url.substr(-3) == "ocx" || tr.egf_url.substr(-3) == "xls" || tr.egf_url.substr(-3) == "lsx") {
                    window.open('https://view.officeapps.live.com/op/embed.aspx?src=' + this.$data_url + 'archivos/evidenciaglobal/' + tr.egft_nombre + '/' + tr.egf_url, '_blank');
                }
            },
            obtenerCuentasPago() {
                let me = this;
    
                me.$vs.loading();
                this.$http.get(this.$server_url + 'obtenerCuentasPago')
                    .then(res => {
                        this.cuentasPago = res.data;
                        this.cuentasPagoConTodas = [
                            { cue_pag_codigo: 'todas', cue_pag_nombre: 'TODAS LAS CUENTAS' },
                            ...res.data
                        ];
                        me.$vs.loading.close();
                    })
                    .catch(function (error) {
                        me.$vs.loading.close();
                    });
            },
    
            obtenerAbonos() {
                let me = this;
                
                if (!this.cuePagSeleccionado) {
                    me.$vs.notify({
                        title: 'Error',
                        text: "Debe seleccionar una cuenta.",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return;
                }
                
                if (this.fechaInicio && !this.fechaFin) {
                    me.$vs.notify({
                        title: 'Error',
                        text: "Debe seleccionar la fecha de final.",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return;
                }
                
                if (!this.fechaInicio && this.fechaFin) {
                    me.$vs.notify({
                        title: 'Error',
                        text: "Debe seleccionar la fecha de inicio.",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return;
                }
    
                const params = {
                    fecha_inicio: this.fechaInicio,
                    fecha_final: this.fechaFin,
                    cuenta: this.cuePagSeleccionado.cue_pag_codigo,
                    busqueda: this.busqueda,
                    temporada: this.predioSeleccionado
                };
    
                me.busquedacheck = me.busqueda;
    
                me.$vs.loading();
                // Realizar la solicitud HTTP
                this.$http.get(this.$server_url + 'obtenerAbonosCuentas', {
                        params
                    })
                    .then(res => {
                        const dataFiltrada = this.cuePagSeleccionado.cue_pag_codigo == 8 ? res.data.filter(item => item.abono_estado == 0 || item.abono_estado == 2) : res.data;
                        if (me.busquedacheck === 'Pendientes') {
                            me.abonosPendientes = dataFiltrada;
                            let total = 0;
                            // Recorriendo los abonosPendientes para calcular el total
                            me.abonosPendientes.forEach((item) => {
                                // Verificamos si 'abono_facturas' tiene valor y si no, usamos 'abono_notas'
                                const valorAbono = me.cuePagSeleccionado.cue_pag_codigo == 8 ? item.abono_valor_retencion : (item.abono_facturas > 0 ? item.abono_facturas : item.abono_notas);
                                total += valorAbono ? parseFloat(valorAbono) : 0; // Sumamos el valor si existe
                            });
                            me.totalAbonado = total;
                            me.$vs.loading.close();
                        }
                        if (me.busquedacheck === 'Verificados') {
                            me.abonosVerificados = dataFiltrada;
                            let total = 0;
                            // Recorriendo los abonosVerificados para calcular el total
                            me.abonosVerificados.forEach((item) => {
                                // Verificamos si 'abono_facturas' tiene valor y si no, usamos 'abono_notas'
                                const valorAbono = me.cuePagSeleccionado.cue_pag_codigo == 8 ? item.abono_valor_retencion : (item.abono_facturas > 0 ? item.abono_facturas : item.abono_notas);
                                total += valorAbono ? parseFloat(valorAbono) : 0; // Sumamos el valor si existe
                            });
                            me.totalAbonado = total;
                            me.$vs.loading.close();
                        }
                        if (me.busquedacheck === 'Todo') {
                            me.abonos = dataFiltrada;
                            let total = 0;
                            // Recorriendo los abonos para calcular el total
                            me.abonos.forEach((item) => {
                                // Verificamos si 'abono_facturas' tiene valor y si no, usamos 'abono_notas'
                                const valorAbono = me.cuePagSeleccionado.cue_pag_codigo == 8 ? item.abono_valor_retencion : (item.abono_facturas > 0 ? item.abono_facturas : item.abono_notas);
                                total += valorAbono ? parseFloat(valorAbono) : 0; // Sumamos el valor si existe
                            });
                            me.totalAbonado = total;
                            me.$vs.loading.close();
                        }
                        this.abonos = dataFiltrada;
                        let total = 0;
                        // Recorriendo los abonos para calcular el total
                        this.abonos.forEach((item) => {
                            // Verificamos si 'abono_facturas' tiene valor y si no, usamos 'abono_notas'
                            const valorAbono = me.cuePagSeleccionado.cue_pag_codigo == 8 ? item.abono_valor_retencion : (item.abono_facturas > 0 ? item.abono_facturas : item.abono_notas);
                            total += valorAbono ? parseFloat(valorAbono) : 0; // Sumamos el valor si existe
                        });
                        me.totalAbonado = total;
                        me.$vs.loading.close();
                    })
                    .catch(function (error) {
                        console.error('Error al obtener abonos:', error);
                        me.$vs.loading.close();
                    });
            },
    
            onDateChange(selectedDates, dateStr, instance) {
                instance.close();
            },
    
            limpiarDatos() {
                let me = this;
                this.abonos = [];
                this.abonosPendientes = [];
                this.abonosVerificados = [];
                this.totalAbonado = 0;
                this.abonosSeleccionados = [];
                if (me.selectedOption === 0) {
                    this.busquedacheck = 'Todo';
                }
                if (me.selectedOption === 1) {
                    this.busquedacheck = 'Pendientes';
                }
                if (me.selectedOption === 2) {
                    this.busquedacheck = 'Verificados';
                }
    
            },
    
            downloadReportAbonos() {
                let me = this;
                const reportTitle = `Reporte de Seguimiento-Cuenta: ${(this.cuePagSeleccionado.cue_pag_nombre).trim()}`;
    
                const fecha = new Date();
                const opciones = {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                };
                const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
                const wsData = this.prepareAbonoData(reportTitle, fechaFormateada);
    
                const wb = utils.book_new();
                const ws = utils.aoa_to_sheet(wsData);
    
                // Combinar celdas para el título y cabecera
                ws['!merges'] = [{
                        s: {
                            r: 0,
                            c: 0
                        },
                        e: {
                            r: 0,
                            c: 7
                        }
                    }, // Combina el título en la primera fila
                    {
                        s: {
                            r: 1,
                            c: 0
                        },
                        e: {
                            r: 1,
                            c: 7
                        }
                    },
                    {
                        s: {
                            r: 2,
                            c: 0
                        },
                        e: {
                            r: 2,
                            c: 7
                        }
                    },
                ];
    
                // Agregar la hoja al libro
                utils.book_append_sheet(wb, ws, 'Seguimiento de Abonos');
    
                // Exportar el archivo
                writeFile(wb, `${reportTitle}.xlsx`);
            },
    
            prepareAbonoData(reportTitle, fecha) {
                const wsData = [];
    
                let totalAbono = 0;
    
                wsData.push([reportTitle]);
                wsData.push(['Fecha: ' + fecha]);
                wsData.push([this.fechaInicio && this.fechaFin ? `Desde: ${this.fechaInicio} Hasta: ${this.fechaFin}` : '']);
                wsData.push([]);
    
                // Columnas alineadas con el backend (reporteAbonosGlobal)
                wsData.push([
                    'N° ABONO/RETENCIÓN',
                    'AÑO',
                    'FECHA ABONO/RETENCIÓN',
                    'PERIODO',
                    'CUENTA DE PAGO',
                    'NÚMERO CUENTA',
                    'DOCUMENTO ABONO/RETENCIÓN',
                    'VALOR ABONO/RETENCIÓN',
                    'EMPRESA',
                    'CLIENTE',
                    'RUC CLIENTE',
                    'LUGAR DESPACHO',
                    'CONCEPTO',
                    'ESTADO',
                    'FECHA CREACIÓN'
                ]);
    
                this.abonos.forEach(item => {
                    // Lógica de valor igual al backend
                    const valorAbono = this.cuePagSeleccionado.cue_pag_codigo == 8 
                        ? item.abono_valor_retencion * 1 
                        : (item.abono_facturas > 0 ? item.abono_facturas * 1 : item.abono_notas * 1);
                    
                    const abonoFecha = item.abono_fecha ? item.abono_fecha : 'No disponible';
                    const abonoDocumento = item.abono_documento ? item.abono_documento : '';
                    
                    // Mapeo de empresas igual al backend
                    const empresaNombre = item.abono_empresa == 1 ? 'PROLIPA' 
                        : item.abono_empresa == 3 ? 'CALMED S.A'
                        : item.abono_empresa == 5 ? 'PROLIPA 2026'
                        : item.abono_empresa == 4 ? 'CALMED 2026'
                        : 'OTRA';
                    
                    // Estado igual al backend
                    const estadoNombre = item.abono_estado == 0 ? 'Pendiente' 
                        : item.abono_estado == 2 ? 'Verificado' 
                        : 'Otro';
                    
                    // Extraer año de la fecha
                    const year = item.abono_fecha ? new Date(item.abono_fecha).getFullYear() : '';
    
                    totalAbono += valorAbono;
    
                    wsData.push([
                        item.abono_id,
                        year,
                        abonoFecha,
                        item.periodo_nombre || '',
                        item.cue_pag_nombre,
                        item.cue_pag_numero || '',
                        abonoDocumento,
                        valorAbono.toFixed(2) * 1,
                        empresaNombre,
                        item.cliente || '',
                        item.ruc_cliente || '',
                        item.institucion || '',
                        item.abono_concepto || '',
                        estadoNombre,
                        item.created_at || ''
                    ]);
                });
    
                wsData.push(['', '', '', '', '', '', 'Total Abono:', totalAbono.toFixed(2) * 1, '', '', '', '', '', '', '']);
    
                wsData.push(['']);
    
                return wsData;
            },
            CambioEstadoAbonos(estado) {
                let me = this;
                if (!this.abonosSeleccionados) {
                    me.$vs.notify({
                        title: 'Error',
                        text: "Debe seleccionar almenos un abono.",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return;
                }
                let abonos = this.abonosSeleccionados.map(abono => abono.abono_id);
                me.$vs.loading();
                this.$http.post(this.$server_url + 'cambioEstadoCuentas', {
                        cuentas: abonos,
                        estado: estado,
                        usuario: this.usuario.idusuario
                    })
                    .then(res => {
                        me.$vs.notify({
                            title: 'Éxito',
                            text: 'Datos guardados correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.$vs.loading.close();
                        me.obtenerAbonos();
                        me.abonosSeleccionados = [];
                    })
                    .catch(error => {
                        me.$vs.notify({
                            title: 'Error',
                            text: 'Error al guardar los datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        me.abonosSeleccionados = [];
                        me.$vs.loading.close();
                    })
            }
        },
        computed: {
            esTablaMultiple() {
                // Si el filtro es 'pendientes' o 'verificados', se debe permitir selección múltiple
                return this.busquedacheck === 'pendientes'; // Solo es múltiple si no está en 'todo'
            },
        },
    };
    </script>
    