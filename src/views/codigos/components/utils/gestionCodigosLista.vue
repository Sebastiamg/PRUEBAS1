<template>
    <div>
        <vs-table max-items="25" search stripe pagination :data="arregloCodigos">
            <template slot="header">
                <div class="flex">
                    <small class="font-bold">Cantidad: {{ arregloCodigos.length }}</small>
                    <div v-if="openModal == 1">
                        <vs-button color="warning"
                            v-if="usuario.id_group == 1 || usuario.id_group == 17 || usuario.id_group == 27 || usuario.id_group == 11"
                            class="ml-3" style="margin-top:-5px;" @click="activePrompt = true">Exportar</vs-button>
                    </div>
                    <div v-else>
                        <vs-button color="warning"
                            v-if="usuario.id_group == 1 || usuario.id_group == 17 || usuario.id_group == 27 || usuario.idusuario == 553 || usuario.idusuario == 45550"
                            class="ml-3" style="margin-top:-5px;" @click="exportToExcel()">Exportar</vs-button>
                    </div>
                    <div class="flex ml-2">
                        <span
                            style="background:#1EC09B;color:white;padding:10px;border-radius: 5px;margin-top: -5px;"><b>Códigos
                                Activación: {{ SumaCodigosActivos }}</b></span>
                        <span class="ml-2"
                            style="background:#1E4DC0;color:white;padding:10px;border-radius: 5px;margin-top: -5px;"><b>Códigos
                                Diagnóstico: {{ SumaCodigosDiagnostico }}</b></span>
                    </div>
                </div>
            </template>
            <template slot="thead">
                <vs-th sort-key="codigo">Código</vs-th>
                <!-- <vs-th sort-key="estudiante">Estudiante</vs-th> -->
                <vs-th sort-key="nombreInstitucion">Información (Codigo de barras)</vs-th>
                <vs-th sort-key="codigo">Verificaciones</vs-th>
                <vs-th sort-key="codigo">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].codigo">

                        <!--plus-->
                        <div v-if="tr.plus == '1'" class="my-3">
                            <p><b style="background-color:#000 ;padding: 10px;color:white;border-radius: 5px;">Plus</b>
                            </p>
                        </div>
                        <p v-if="tr.prueba_diagnostica == '1'" class="font-bold text-warning">Código Diagnóstica:</p>
                        <p v-else class="font-bold">Código Activación:</p>
                        {{ data[indextr].codigo }}
                        <p v-if="tr.prueba_diagnostica == '1'" class="font-bold">Código Activación:</p>
                        <p v-else class="font-bold text-warning">Código Diagnóstica:</p>
                        {{ data[indextr].codigo_union }}
                        <p v-if="tr.codigo_paquete" style="font-weight:bold;">Paquete Código:</p>
                        {{ data[indextr].codigo_paquete }}
                        <p v-if="tr.codigo_paquete" style="font-weight:bold;">Fecha registro paquete:</p>
                        {{ data[indextr].fecha_registro_paquete }}
                        <p style="font-weight:bold;">Libro:</p>
                        <span>{{ data[indextr].book }}</span>
                        <p style="font-weight:bold;">Serie:</p>
                        <span>{{ data[indextr].serie }}</span>
                        <p style="font-weight:bold;">Fecha create:</p>
                        <span>{{ data[indextr].created_at }}</span>
                        <p style="font-weight:bold;">Creador:</p>
                        <span>{{ data[indextr].creador }}</span>
                        <p style="font-weight:bold;">Contrato:</p>
                        <span>{{ data[indextr].contrato }}</span>
                        <div
                            v-if="(usuario.id_group == 1 || usuario.id_group == 17 || usuario.id_group == 27 || usuario.idusuario == 553 || usuario.idusuario == 45550)">
                            <!-- <p  class="font-bold">Cantidad devoluciones:</p>
                        <span>{{ tr.devolucion }}</span> -->
                            <p class="font-bold">Ultima Devolucion:</p>
                            <span>{{ tr.devolucionInstitucion }}</span>
                        </div>
                        <div v-if="tr.estado == '2'">
                            <vs-chip color="danger">Bloqueado</vs-chip>
                        </div>
                        <div v-else>
                            <vs-chip color="success">Activo</vs-chip>
                        </div>
                        <div
                            v-if="(usuario.id_group == 1 || usuario.id_group == 17 || usuario.id_group == 27 || usuario.idusuario == 553 || usuario.idusuario == 45550)">
                            <vs-divider></vs-divider>
                            <div class="flex">
                                <vs-button color="primary" v-if="tr.devolucion > 0" icon="info" type="filled"
                                    @click="returnCodes(tr);">
                                    Ver devolución
                                </vs-button>
                                <vs-button color="dark" class="ml-2" icon-pack="feather" icon="icon-bar-chart-2"
                                    type="filled" @click="codigo = tr; popupHistorico = true;">
                                    Ver Historico
                                </vs-button>
                            </div>
                        </div>
                    </vs-td>
                    <!-- <vs-td :data="data[indextr].estudiante">
                        <p style="font-weight:bold;">Nombres:</p>
                        <p style="font-size:12px;letter-spacing:1px;">{{ data[indextr].estudiante }}</p>
                        <p style="font-weight:bold;">Email:</p>
                        <span>
                            {{ data[indextr].email }}
                        </span>
                        <p style="font-weight:bold;">Cedula:</p>
                        <span>{{ data[indextr].cedula }}</span>
                        <p v-if="ifFechaEstudiante == 1" style="font-weight:bold;">Fecha registro:</p>
                        <span v-if="ifFechaEstudiante == 1">{{ data[indextr].fecha_registro }}</span>
                        <p style="font-weight:bold;">Institución:</p>
                        <span>{{ data[indextr].nombreInstitucion }}</span>
                        <p style="font-weight:bold;">Periodo:</p>
                        <span>{{ data[indextr].periodo }}</span>
                    </vs-td> -->
                    <vs-td :data="data[indextr].barrasEstado">
                        <p style="font-weight:bold;">contador:</p>
                        <span>{{ data[indextr].contador }}</span>
                        <!-- <span v-if="tr.contador > 1">{{ data[indextr].contador }}</span> -->
                        <p style="font-weight:bold;">bc_estado:</p>
                        <span v-if="tr.bc_estado == 2" class="text-success font-semibold">{{ tr.barrasEstado }}</span>
                        <span v-else>{{ tr.barrasEstado }}</span>
                        <p style="font-weight:bold;">Institución directa (bc_institucion):</p>
                        <span>{{ tr.institucionBarra }}</span>
                        <p style="font-weight:bold;">bc_periodo:</p>
                        <span>{{ tr.periodo_barras }}</span>
                        <p style="font-weight:bold;">bc_fecha_ingreso:</p>
                        <span>{{ tr.bc_fecha_ingreso }}</span>
                        <p style="font-weight:bold;">venta_estado:</p>
                        <p v-if="tr.ventaEstado"
                            style="background-color: #47BFF3;width: 120px;color:white;border-radius: 5px;border: none;padding: 2px;text-align: center;">
                            {{ data[indextr].ventaEstado }}</p>
                        <p class="font-bold">Institucion lista (venta_lista_institucion):</p>
                        <span> {{ tr.InstitucionLista }}</span>
                        <p>
                            <vs-chip color="success" v-if="tr.estado_liquidacion == '1'">
                                Por liquidarse
                            </vs-chip>
                            <vs-chip :color="'warning'" v-if="tr.estado_liquidacion == '2'">
                                Regalado
                            </vs-chip>

                            <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '0'">
                                Liquidado
                            </vs-chip>
                            <vs-chip color="danger"
                                v-else-if="tr.estado_liquidacion == '3' && (permisoRoot || usuario.id_group == 17 || usuario.id_group == 27)">
                                DEVUELTO
                            </vs-chip>
                            <vs-chip color="danger" v-else-if="tr.estado_liquidacion == '4'">
                                CÓDIGO GUIA
                            </vs-chip>
                            <vs-chip :color="'danger'" v-if="tr.liquidado_regalado == 1">
                                Liquidado Regalado
                            </vs-chip>
                            <!-- <vs-chip :color="'warning'" v-if="tr.liquidado_regalado == 0 && tr.estado_liquidacion == '2'">
                            Regalado sin liquidar
                        </vs-chip> -->
                        </p>
                        <p class="mt-1">
                            <vs-chip color="#4C438B" v-if="tr.prueba_diagnostica == '1'">
                                Código diagnostico
                            </vs-chip>
                            <vs-chip color="#438B86" v-if="tr.prueba_diagnostica == '0'">
                                Código Activación
                            </vs-chip>
                        </p>
                        <p class="mt-1">
                            <vs-chip color="#284B09" v-if="tr.porcentaje_descuento > '0'">
                                Descuento% {{ tr.porcentaje_descuento }}
                            </vs-chip>
                        </p>
                        <p class="mt-1">
                            <vs-chip color="#0E8AB3" v-if="tr.factura">
                                Factura # {{ tr.factura }}
                            </vs-chip>
                        </p>
                        <p class="mt-1">
                            <vs-chip color="#000" v-if="tr.codigo_proforma">
                                Pre Factura # {{ tr.codigo_proforma }}
                            </vs-chip>
                        </p>
                        <br><br> <br>

                        <div class="mt-2" v-if="tr.proforma_empresa">
                            <b>Empresa Pre factura</b>
                            <p>{{ tr.descripcion_empresa }}</p>
                        </div>
                        <div v-if="tr.documento_devolucion">
                            <b>Documento de Devolución</b>
                            <p>{{ tr.documento_devolucion }}</p>
                        </div>
                        <!--devuelto_proforma-->
                        <div v-if="tr.devuelto_proforma == '1'">
                            <p><b>Devuelto en nota/pre factura:</b> si</p>
                        </div>
                        <div v-if="tr.errorProforma">
                            <b class="text-2xl"><i class="fa-solid fa-triangle-exclamation"></i> Error Pre Factura:</b>
                            <p class="font-bold text-danger">{{ tr.mensajeErrorProforma }}</p>
                        </div>
                        <div v-if="tr.asesor">
                            <b>Asesor GUIA</b>
                            <p>{{ tr.asesor }}</p>
                        </div>
                        <div v-if="tr.combo">
                            <b>Combo:</b>
                            <p>{{ tr.combo }}</p>
                        </div>
                        <div v-if="tr.codigo_combo">
                            <b>codigo_combo:</b>
                            <p>{{ tr.codigo_combo }}</p>
                        </div>
                        <div v-if="tr.quitar_de_reporte">
                            <b>Quitar reporte:</b>
                            <p>Si</p>
                        </div>
                    </vs-td>
                    <vs-td>
                        <span style=" font-weight:600; ">
                            <vs-chip color="primary" v-if="tr.verif1 > 0">Verificación Nº 1 <span class="ml-3"
                                    v-if="permisoRoot"># {{ tr.verif1 }}</span></vs-chip>
                            <vs-chip color="primary" v-if="tr.verif2 > 0">Verificación Nº 2 <span class="ml-3"
                                    v-if="permisoRoot"># {{ tr.verif2 }}</span></vs-chip>
                            <vs-chip color="primary" v-if="tr.verif3 > 0">Verificación Nº 3 <span class="ml-3"
                                    v-if="permisoRoot"># {{ tr.verif3 }}</span></vs-chip>
                            <vs-chip color="primary" v-if="tr.verif4 > 0">Verificación Nº 4 <span class="ml-3"
                                    v-if="permisoRoot"># {{ tr.verif4 }}</span></vs-chip>
                            <vs-chip color="primary" v-if="tr.verif5 > 0">Verificación Nº 5 <span class="ml-3"
                                    v-if="permisoRoot"># {{ tr.verif5 }}</span></vs-chip>
                        </span>
                    </vs-td>
                    <vs-td class="flex">
                        <vx-tooltip class="ml-3" style="display: inline-block;" text="Editar" position="top"
                            color="success">
                            <vs-button size="small" v-if="btnEditar == 1" class="modal-default-button" color="success"
                                @click="openEditCodigo(tr)" type="line" icon-pack="feather" icon="icon-edit">
                            </vs-button>
                        </vx-tooltip>
                        <vx-tooltip class="ml-3" style="display: inline-block;" text="Eliminar" position="top"
                            color="warning">
                            <vs-button size="small" v-if="permisoRoot && (btnEliminar == 1)"
                                class="modal-default-button" color="danger" @click="openConfirm(data[indextr])"
                                type="line" icon-pack="feather" icon="icon-trash">
                            </vs-button>
                        </vx-tooltip>
                        <vx-tooltip class="ml-3" style="display: inline-block;" text="Cambiar estudiante" position="top"
                            color="warning">
                            <vs-button v-if="permisoRoot && (btnEstudiante == 1)" radius color="success" type="line"
                                icon-pack="feather" icon="icon-search" @click="editarCodigoEstudiante(data[indextr]);"
                                size="small"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display:inline-block" color="danger" text="Bloquear código">
                            <vs-button
                                v-if="(data[indextr].estado == 0) && (btnBloquear == 1) && (usuario.id_group == 1)"
                                color="danger" type="line" icon-pack="feather" icon="icon-x-circle"
                                @click="ConfirmCambiadoEstadoCodigo(data[indextr], 2)" size="small"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display:inline-block" color="warning" text="Desbloquear código">
                            <vs-button
                                v-if="(data[indextr].estado == 2) && (btnBloquear == 1) && (usuario.id_group == 1)"
                                color="warning" type="line" icon-pack="feather" icon="icon-check"
                                @click="ConfirmCambiadoEstadoCodigo(data[indextr], 0)" size="small"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display:inline-block" color="warning" text="Añadir a storage">
                            <vs-button v-if="btnAddStorage == 1 && (usuario.id_group == 1)" color="warning" type="line"
                                radius icon-pack="feather" icon="icon-archive" @click="$emit('changeAddStorage', tr)"
                                size="large"></vs-button>
                        </vx-tooltip>
                        <!-- <vx-tooltip style="display:inline-block" color="purple" text="Quitar del reporte de facturación">
                        <vs-button v-if="permisoRoot" color="purple" type="line" icon="filter" @click="f_quitar_de_reporte(tr.codigo)"></vs-button>
                    </vx-tooltip> -->
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--MODAL PARA EXPORTAR A EXCEL-->
        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel"
            accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
            </vs-alert>
            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />
        </vs-prompt>
        <!--MODAL PARA VER LA DEVOLUCION-->
        <vs-popup class="holamundo" fullscreen :title="titleReturns" :active.sync="popupReturns">
            <ListadoDevolucionesCodigosVue v-if="popupReturns" :devoluciones="devoluciones" />
        </vs-popup>
        <!--MODAL PARA VER EL HISTORICO-->
        <vs-popup class="holamundo" fullscreen :title="'Ver historico del código ' + codigo.codigo"
            :active.sync="popupHistorico">
            <historicoCodigosVue v-if="popupHistorico" :codigo="codigo" />
        </vs-popup>
        <!--MODAL PARA QUITAR CODIGO DEL REPORTE, DEVUELTO POR FACTURACION-->
        <vs-popup :title="'Quitar codigo ' + codigo" :active.sync="popupQuitarDeReporte">
            <p>El código devuelto por facturación se debe activar la opcion <b>Quitar del reporte (1)</b>, para que el
                estudiante pueda usar en su perfil.</p>
            <div class="text-center pt-5">
                <h4>{{ codigo }}</h4>
                <vs-button class="m-1" @click="f_aceptar_quitar(codigo)" color="success">Si, activar opción</vs-button>
                <vs-button class="m-1" @click="f_cancelar()" color="danger">Cancelar</vs-button>
            </div>
        </vs-popup>
    </div>
</template>

<script>
import ListadoDevolucionesCodigosVue from './ListadoDevolucionesCodigos.vue';
import historicoCodigosVue from '../../components/historicoCodigos.vue'
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    name: 'gestionCodigosLista',
    props: {
        arregloCodigos: {
            type: Array,
            default: [],
        },
        btnEditar: {
            type: Number,
            default: 0,
        },
        btnEliminar: {
            type: Number,
            default: 0,
        },
        btnEstudiante: {
            type: Number,
            default: 0,
        },
        btnBloquear: {
            type: Number,
            default: 0,
        },
        ifFechaEstudiante: {
            type: Number,
            default: 0,
        },
        openModal: {
            type: Number,
            default: 0,
        },
        btnAddStorage: {
            type: Number,
            default: 0,
        }
    },
    computed: {
        SumaCodigosActivos() {
            let me = this;
            let datos = me.arregloCodigos.filter(p => (p.prueba_diagnostica == 0));
            let resultado = datos.length
            return resultado
        },
        SumaCodigosDiagnostico() {
            let me = this;
            let datos = me.arregloCodigos.filter(p => (p.prueba_diagnostica == 1));
            let resultado = datos.length
            return resultado
        },
    },
    data() {
        return {
            usuario: [],
            devoluciones: [],
            popupReturns: false,
            titleReturns: '',
            //variables para el export a excel
            activePrompt: false,
            codigoSelected: [],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xlsx',
            permisoRoot: false,
            //fin variables para el export a excel
            //variables para ver el historico
            popupHistorico: false,
            codigo: {}, //fin variables para ver el historico
            popupQuitarDeReporte: false,
        };
    },
    components: {
        ListadoDevolucionesCodigosVue,
        historicoCodigosVue,
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getUserRoot()
        // me.arregloCodigos.forEach(p => {
        //   if(p.bc_estado == 1){
        //     p.pruebas = "good"
        //   }else{
        //     p.pruebas = "bad"
        //   }
        // });
    },
    methods: {
        getUserRoot() {
            let me = this;
            this.$http.get(this.$server_url + 'permisos?permiso=yes&usuario_id=' + me.usuario.idusuario)
                .then(function (res) {
                    if (res.data.status == '1') {
                        me.permisoRoot = true
                    } else {
                        me.permisoRoot = false
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        openEditCodigo(tr) {
            let me = this;
            let datos = {
                "codigosEdit": tr,
                "nuevo": true,
                "editar": 1,
                "eliminar": 0,
            }
            me.$emit('crud', datos)
        },
        openConfirm(tr) {
            let me = this;
            let datos = {
                "id": tr.codigo,
                "eliminar": 1,
            }
            me.$emit('crud', datos)
        },
        //methods to return codes
        returnCodes(tr) {
            let me = this
            me.titleReturns = "Informacion de devoluciones del codigo " + tr.codigo
            me.$vs.loading();
            this.$http.get(this.$server_url + 'codigo/devoluciones/' + tr.codigo)
                .then(res => {
                    me.$vs.loading.close();
                    me.devoluciones = res.data
                    me.popupReturns = true;
                })
                .catch(function (e) {
                    me.$vs.loading.close();
                });
        },
        editarCodigoEstudiante(tr) {
            let me = this;
            let datos = {
                "info": tr,
                "tipo": "editar",
            }
            me.$emit('crud', datos)
        },
        ConfirmCambiadoEstadoCodigo(tr, estado) {
            let me = this;
            let datos = {
                "info": tr,
                "tipo": "bloquear",
                "estado": estado
            }
            me.$emit('crud', datos)
        },
        //METODOS PARA EXCEL
        //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
        exportToExcel() {
            return import('@/vendor/Export2Excel').then(excel => {
                let nombrearchivo = '';
                if (this.openModal == 1) {
                    nombrearchivo = this.fileName;
                } else {
                    nombrearchivo = localStorage.getItem('tit_archivo_excel') || 'Reporte_codigos';
                }
                const { cellAutoWidth, selectedFormat } = this;

                // Función para obtener el número de verificación
                const getVerificacion = (item) => {
                    const verificaciones = [];
                    if (item.verif1 > 0) verificaciones.push(`Verificación 1 #${item.verif1}`);
                    if (item.verif2 > 0) verificaciones.push(`Verificación 2 #${item.verif2}`);
                    if (item.verif3 > 0) verificaciones.push(`Verificación 3 #${item.verif3}`);
                    if (item.verif4 > 0) verificaciones.push(`Verificación 4 #${item.verif4}`);
                    if (item.verif5 > 0) verificaciones.push(`Verificación 5 #${item.verif5}`);
                    return verificaciones.join(' | '); // o usar '\n' para salto de línea en Excel
                };

                const processedData = this.arregloCodigos.map(item => {
                    return {
                        ...item,
                        descripcion_empresa: item.descripcion_empresa || '',
                        devueltoEnDocumento: item.devuelto_proforma == 1 ? 'SI' : 'NO',
                        // Añadir la verificación formateada
                        verificacion: getVerificacion(item),
                        // Primero convertir a mayúsculas
                        ...Object.fromEntries(
                            Object.entries(item).map(([key, value]) => [
                                key,
                                typeof value === 'string' ? value.toUpperCase() : value
                            ])
                        ),
                        // Luego forzar que quitar_de_reporte tenga el valor "SI" o ""
                        quitar_de_reporte: item.quitar_de_reporte === 1 ? 'SI' : ''
                    };
                });

                if (processedData.length === 0) {
                    this.$f_notificacion('No hay datos válidos para exportar.', 'warning', 'icon-alert-circle');
                    return;
                }

                const headerConfig = [
                    { title: 'codigo', value: 'codigo' },
                    { title: 'Codigo union', value: 'codigo_union' },
                    { title: 'Paquete', value: 'codigo_paquete' },
                    { title: 'Combo', value: 'combo' },
                    { title: 'Combo Generado', value: 'codigo_combo' },
                    { title: 'Documento Facturacion', value: 'codigo_proforma' },
                    { title: 'Empresa documento', value: 'descripcion_empresa' },
                    { title: 'Devuelto en nota o pre factura', value: 'devueltoEnDocumento' },
                    { title: 'Devolución documento', value: 'documento_devolucion' },
                    // { title: 'institucion estudiante', value: 'nombreInstitucion' }, // ELIMINADO
                    // { title: 'periodo estudiante', value: 'periodo' }, // ELIMINADO
                    // { title: 'estudiante', value: 'estudiante' }, // ELIMINADO
                    // { title: 'cedula', value: 'cedula' }, // ELIMINADO
                    { title: 'estado', value: 'codigoEstado' },
                    { title: 'liquidacion', value: 'liquidacion' },
                    { title: 'bc_estado', value: 'barrasEstado' },
                    { title: 'venta estado', value: 'ventaEstado' },
                    { title: 'verificacion', value: 'verificacion' },
                    { title: 'institucion barras', value: 'institucionBarra' },
                    { title: 'periodo barras', value: 'periodo_barras' },
                    { title: 'institucion lista', value: 'InstitucionLista' },
                    { title: 'Tipo código', value: 'tipoCodigo' },
                    { title: 'Quitado del reporte de facturación', value: 'quitar_de_reporte' }
                ];

                const headerTitle = headerConfig.map(h => h.title);
                const headerVal = headerConfig.map(h => h.value);

                excel.export_json_to_excel({
                    header: headerTitle,
                    data: this.formatJson(headerVal, processedData),
                    filename: nombrearchivo,
                    autoWidth: cellAutoWidth,
                    bookType: selectedFormat
                });

                this.clearFields();
                this.resetExportState();

            }).catch(error => {
                console.error('Error al exportar a Excel:', error);
                this.$f_notificacion('No se pudo generar el archivo Excel', 'danger', 'icon-alert-circle');
            });
        },


        // Función auxiliar para resetear estado
        resetExportState() {
            this.guardarActivo = '';
            this.generarActivo = ' ';
            this.textAlertCant = '';
            this.cantidad = '';
            this.codigoSelected = [];
        },

        // Función formatJson optimizada
        formatJson(fields, data) {
            return data.map(item => fields.map(field => item[field]));
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
        f_quitar_de_reporte(e) {
            console.log(e)
            this.codigo = e;
            this.popupQuitarDeReporte = true;
        },
        f_aceptar_quitar(codigo) {
            let me = this;
            console.log(codigo)
            this.$vs.loading()
            this.$http.get(this.$server_url + 'quitar_del_reporte_facturacion/' + codigo)
                .then(function (res) {
                    console.log(res.data);
                    me.$vs.notify({
                        text: res.data.mensaje + ' ' + res.data.codigo,
                        color: res.data.estado == '1' ? 'success' : 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time: 4000
                    })
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
                .finally(() => {
                    this.$vs.loading.close();
                    this.popupQuitarDeReporte = false;
                })

        },
        f_cancelar() {
            this.popupQuitarDeReporte = false;
        }
    },
};
</script>

<style lang="scss" scoped></style>
