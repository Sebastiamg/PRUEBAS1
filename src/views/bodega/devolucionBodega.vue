<template>
  <vs-card>
      <!-- Header Section -->
      <div class="text-white p-6 rounded mb-6 shadow">
          <div class="flex items-center justify-center">
              <i class="fas fa-undo-alt text-3xl mr-4"></i>
              <div class="text-center">
                  <h1 class="text-2xl font-bold text-primary">Devolución de códigos sueltos</h1>
                  <p class="text-primary mt-2" style="opacity: 0.9">
                      <i class="fas fa-info-circle mr-2"></i>
                      Máximo 1500 registros por carga
                  </p>
              </div>
          </div>
      </div>
      <div>
        <!--otros documentos-->
        <div class="flex" style="justify-content: space-between;">
          <ul class="flex">
            <li class="mr-3">
                <span>Documento:</span>
            </li>
            <li class="mr-2">
                <vs-radio v-model="ifNuevoDocumento" @input="f_limpiarDocumento" vs-name="radios1ifNuevoDocumento" vs-value="1">Nuevo</vs-radio>
            </li>
            <li class="mr-2">
                <vs-radio @input="f_documentosCreados()" v-model="ifNuevoDocumento" vs-name="radios1ifNuevoDocumento" vs-value="0">Buscar uno existente</vs-radio>
            </li>
          </ul>
        </div>
        <div v-if="ifNuevoDocumento == 0">
          <span>Seleccione el documento: <b>(SOLO APARECERA LOS DOCUMENTOS QUE ESTEN EN ESTADO CREADO)</b></span>
          <v-select :options="arrayDocomentosCreados" @input="f_selectedDocumento()" :reduce="arrayDocomentosCreados => arrayDocomentosCreados" label="documento_cliente" class="w-full mt-2" v-model="documentSelected" />
        </div>
      </div>
      <!-- Devolver liquidados -->
      <div v-if="userRoot || AdminBodega" class="vx-col w-full mt-3">
        <ul class="leftx" style="display:flex;flex-direction: row;">
          <li>Devolver liquidados</li>
          <li class="ml-2">
              <vs-radio v-model="dLiquidado" vs-name="radiosdLiquidado" vs-value="0">No</vs-radio>
          </li>
          <li class="ml-2">
              <vs-radio v-model="dLiquidado" vs-name="radiosdLiquidado" vs-value="1">Si</vs-radio>
          </li>
        </ul>
      </div>
      <!-- Configuration Section -->
      <vs-card class="mb-6 mt-4">
          <div slot="header" class="flex items-center">
              <i class="fas fa-cog text-primary mr-2"></i>
              <h3 class="text-lg font-semibold">Configuración Inicial</h3>
          </div>
          <!-- Región y Período -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <!-- Selección de Región -->
              <div>
                  <label class="block text-sm font-medium mb-3">
                      <i class="fas fa-map-marker-alt mr-2"></i>Seleccione la Región
                  </label>
                  <div class="flex justify-center space-x-6 bg-light p-4 rounded-lg">
                      <vs-radio v-model="region" vs-name="radiosRegion" @input="getPerriodosXregion()" vs-value="1" class="text-lg">
                          <i class="fas fa-mountain mr-2"></i>Sierra
                      </vs-radio>
                      <vs-radio v-model="region" vs-name="radiosRegion" @input="getPerriodosXregion()" vs-value="2" class="text-lg">
                          <i class="fas fa-water mr-2"></i>Costa
                      </vs-radio>
                  </div>
              </div>
              <!-- Selección de Período -->
              <div>
                  <label class="block text-sm font-medium text-gray-700 mb-3">
                      <i class="fas fa-calendar-alt mr-2"></i>Seleccione el Período
                      <span v-if="!region" class="text-red-500 text-sm">(Seleccione región primero)</span>
                  </label>
                  <v-select :options="arrayPeriodos" :reduce="(periodo) => periodo.idperiodoescolar" placeholder="Seleccione un período..." label="periodoescolar" class="w-full" v-model="periodoSelected" :disabled="!region || arrayPeriodos.length === 0" @input="buscarCodigosForDevolucion();">
                      <template #no-options>
                          <span v-if="!region">Seleccione una región primero</span>
                          <span v-else>No hay períodos disponibles</span>
                      </template>
                  </v-select>
              </div>
          </div>
          <!-- Observación -->
          <div class="grid grid-cols-1 md:grid-cols-1 gap-6">
              <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">
                      <i class="fas fa-comment mr-2"></i>Observación
                      <span class="text-red-500">*</span>
                      <span class="text-red-500 text-sm"></span>
                  </label>
                  <vs-input class="w-full" icon-pack="feather" icon="icon-edit" placeholder="Ingrese una observación" v-model="observacion"/>
              </div>
          </div>
      </vs-card>


      <!-- Existing Result Display Sections -->
      <div v-if="codigosPerdidos == true && ((tipoBodega == '3' || tipoBodega == '4') || (tipoIngreso == 1 || tipoIngreso == 2))">
          <vs-card v-if="arregloErroresPaquetes.length > 0">
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                  <vs-list>
                      <p>Cantidad <span>{{ arregloErroresPaquetes.length }}</span></p>
                      <vs-list-header icon="supervisor_account" title="Hubo problemas con algunos paquetes"></vs-list-header>
                      <vs-list-item :key="indextr" v-for="(tr, indextr) in arregloErroresPaquetes" icon="check" :title="tr.paquete">
                          <p> {{ tr.problema }}</p>
                      </vs-list-item>
                  </vs-list>
              </vs-col>
          </vs-card>
          <div v-if="arregloResumen.length > 0 || (tipoIngreso == 1 || tipoIngreso == 2)">
              <TableResumenPaqueteVue class="mt-4" v-if="arregloResumen.length > 0" :arregloResumen="arregloResumen" :arregloFormatoSend="arregloFormatoSend" />
          </div>
      </div>
      <vs-row v-if="tableData.length > 0 && tableData.length <= 2000" class="mt-2">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
              <!--boton para mostrar los errores que no se puede devolver-->
              <vs-button v-if="arrayCodigosProblemasForDevolver.length > 0" class="mb-2 ml-5" color="warning" type="border" @click="popupMostrarCodigosProblemasDevolver = true"> <i class="fa-solid fa-triangle-exclamation"></i> Mostrar Errores </vs-button>
          </vs-col>
      </vs-row>
      <!-- Modal para mostrar los códigos que se devolvieron -->
      <!-- <div v-if="codigosPerdidos == true" class="mt-2 flex justify-center">
        <vs-button class="mb-2 mr-5" color="success" @click="popupImprimirPdf=true;"><i class="fa-solid fa-file-pdf"></i> Imprimir PDF </vs-button>
      </div> -->
      <vs-row v-if="codigosPerdidos == true">
          <vs-card>
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6" v-if="codigosNoCambiados.length > 0">
                  <vs-list>
                      <p>Cantidad <span>{{ codigosNoCambiados.length }}</span></p>
                      <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron cambiar"></vs-list-header>
                      <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo">
                          <p v-if="tr.mensaje !='0'"> {{ tr.mensaje }}</p>
                      </vs-list-item>
                  </vs-list>
              </vs-col>
              <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6" v-if="codigoNoExiste.length > 0">
                  <vs-list>
                      <p>Cantidad <span>{{ codigoNoExiste.length }}</span></p>
                      <vs-list-header icon="supervisor_account" title="Códigos que no existen"></vs-list-header>
                      <vs-list-item :key="s" v-for="(tr, s) in codigoNoExiste" icon="check" :title="tr.codigo"></vs-list-item>
                  </vs-list>
              </vs-col>
          </vs-card>
      </vs-row>
      <vs-row v-if="codigosPerdidos == true && tipoBodega == '0'">
          <devolucion-bodega-informacion
              v-if="codigosConLiquidacion.length > 0"
              :codigosConLiquidacion="codigosConLiquidacion"
              :codigoSelected.sync="codigoSelected"
              :ifNuevoDocumento="ifNuevoDocumento"
              @exportar="activePrompt = true"
          />
      </vs-row>

      <div v-if="menu == 0">
        <!-- Componente ImportExcel -->
        <import-excel :onSuccess="loadDataInTable" class="mb-4" />
        <!-- Formato del archivo excel -->
        <vs-card class="mt-4">
            <div slot="header" class="flex items-center">
                <i class="fas fa-table text-primary mr-2"></i>
                <h3 class="text-lg font-semibold">Formato del archivo Excel</h3>
            </div>
            <div class="overflow-x-auto">
                <table class="tabla w-full">
                    <thead>
                        <tr>
                            <th class="th1 px-4 py-2 text-center">codigo</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="td1 px-4 py-2 text-center">xxx</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </vs-card>
      </div>
      <!--Review CODIGOS-->
      <div v-if="menu == 1" class="mt-5">
        <!--boton subir otro archivo-->
        <div class="flex justify-start">
            <vs-button @click="f_limpiarCancelar()" color="warning" type="border" class="mb-4"><i class="fa-solid fa-right-left"></i> Subir otro archivo</vs-button>
        </div>
        <DevolucionBodegaSueltosReviewVue
        :documentSelected="documentSelected"
        :arregloCodigos="arrayCodigosPreview"
        @openConfirm="openConfirm"
        @changeInstitucion="changeInstitucion"
        :ifNuevoDocumento="ifNuevoDocumento"
        :dLiquidado="dLiquidado"
        />
      </div>
      <vs-popup fullscreen title="Códigos con problemas" :active.sync="modalLiquidacion">
          <devolucion-bodega-informacion
              v-if="codigosConLiquidacion.length > 0"
              :codigosConLiquidacion="codigosConLiquidacion"
              :codigoSelected.sync="codigoSelected"
              @exportar="activePrompt = true"
          />
      </vs-popup>

      <!-- Modal para Exportar a Excel -->
      <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
          <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
              <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
          </vs-alert>
          <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
          <v-select v-model="selectedFormat" :options="formats" class="my-4" />
          <div class="flex"></div>
      </vs-prompt>
      <!-- Modal Confirmar Tipo de Importado -->
      <vs-popup small title="Tipo de Importación" :active.sync="popupConfirmTipoImportado" @close="popupConfirmTipoImportado = true;">
        <p class="text-2xl text-warning font-bold text-center">¿Qué tipo de importación va a realizar?</p>
        <!-- <p class="text-danger mt-2 text-center">¡Los paquetes máximo 200 paquetes!</p> -->
        <vs-divider></vs-divider>
        <div class="flex justify-center mt-2" style="flex-wrap: wrap;">
            <vs-button class="m-3" color="primary" @click="tipoBodega= 0;popupConfirmTipoImportado=false;titleImportacion = 'Importación Códigos';ejecutarValidacion();">Combos sueltos</vs-button>
            <vs-button class="m-3" color="#29BCC6" @click="tipoBodega= 3;popupConfirmTipoImportado=false;titleImportacion = 'Importación Paquetes';ejecutarValidacion();" type="border" icon-pack="feather" icon="icon-package"> Paquetes</vs-button>
            <!-- <vs-button class="m-3" color="#f87770" @click="tipoBodega= 4;popupConfirmTipoImportado=false;titleImportacion = 'Importación Combos';ejecutarValidacion();" type="border" icon-pack="feather" icon="icon-package"> Combos</vs-button> -->
        </div>
        <div class="flex justify-center mt-2">
          <vs-button class="mt-2" color="danger" @click="popupConfirmTipoImportado=false;f_limpiarCancelar();"><i class="fa-solid fa-circle-xmark"></i> Cancelar</vs-button>
        </div>
      </vs-popup>

      <!-- Modal Problemas Diagnóstico o Paquetes -->
      <vs-popup fullscreen small title="Problemas con los códigos de su archivo" :active.sync="popupProblemasDiagnostico">
          <div v-if="(tipoBodega == 3 || tipoBodega == 4) || (tipoIngreso == 1 || tipoIngreso == 2)">
              <TablaErroresPaqueteVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasPaquete="arregloProblemasPaquete" />
          </div>
      </vs-popup>
      <vs-popup fullscreen title="Códigos que no se van poder devolver" :active.sync="popupMostrarCodigosProblemasDevolver">
          <vs-card v-if="popupMostrarCodigosProblemasDevolver">
              <div class="header">
                  <span style="font-weight:bold;color: red;font-size: 20px;">Codigos que no se pueden devolver</span>
              </div>
              <TableReutilizableVue :title="'Individuales'" :headers="['Código','Mensaje','Institución']" :fieldKeys="['codigo','mensaje','institucionBarra']" :ifexportar="Number(1)" :tableData="arrayCodigosProblemasForDevolver" />
          </vs-card>
      </vs-popup>


      <!-- Existing Modals and Import Section -->
      <vs-popup small title="Confirmación" :active.sync="modalConfirm">
          <div class="w-full mb-base" align="center">
              <h4>Está seguro de aplicar estos códigos?</h4>
              <b class="mt-2">Tipo de importación: <span style="font-weight: bold;" class="text-danger">{{titleImportacion}}</span></b>
          </div>
          <div v-if="ifNuevoDocumento == 0" class="flex justify-center">
            <p><b>Guardar en DOCUMENTO:</b></p>
            <p> {{ documentSelected.codigo_devolucion }}</p>
            <br><br>
          </div>
          <div class="w-full" align="center">
              <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
          </div>
      </vs-popup>
      <!--Modal para imprimir PDF-->
      <vs-popup title="Confirmación" :active.sync="popupImprimirPdf" fullscreen>
        <div v-if="popupImprimirPdf">
            <DevolucionBodegaImprimirVue
            :id_devolucion="codigoslibros_devolucion_desarmados_header_id"
            />
        </div>
      </vs-popup>
      <!--popup para errores-->
      <vs-popup classContent="popup-example" title="Resultados" :active.sync="popupMostrarErrores">
          <div v-if="popupMostrarErrores">
              <TableReutilizableVue :title="'Se encontraros los siguientes errores'" :headers="['codigo','mensaje']" :fieldKeys="['codigo','mensaje']" :ifexportar="Number(1)" :tableData="codigosNoCambiados" />
          </div>
      </vs-popup>
  </vs-card>
</template>

<script>
import {
    mapState
} from "vuex";
import ImportExcel from './import_excel.vue'
import gestionCodigosListaVue from '../codigos/components/utils/gestionCodigosLista.vue';
const TablaErroresPaqueteVue = () => import('@/views/codigos/paquetes/components/TablaErroresPaquete')
const TableResumenPaqueteVue = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableResumenPaquete.vue')
const TableRadiosCodigosListaVue = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableRadiosCodigosLista.vue')
import Paquetemix from '../../mixins/Paquetemix';
import Generalmix from '../../mixins/Generalmix';
import DevolucionBodegaInformacion from './componentes/DevolucionBodegaInformacion.vue';
import vSelect from 'vue-select';
import PeriodoRepository from '@/repositories/PeriodoRepository';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
const DevolucionBodegaImprimirVue  = () => import('./componentes/DevolucionBodegaImprimir.vue');
const DevolucionBodegaSueltosReviewVue  = () => import('./DevolucionBodegaSueltosReview.vue');

export default {
    mixins: [Paquetemix, Generalmix],
    components: {
        ImportExcel,
        gestionCodigosListaVue,
        TablaErroresPaqueteVue,
        TableResumenPaqueteVue,
        TableRadiosCodigosListaVue,
        'v-select': vSelect,
        TableReutilizableVue
        , DevolucionBodegaInformacion,
        DevolucionBodegaImprimirVue,
        DevolucionBodegaSueltosReviewVue
    },
    data() {
        return {
            codigosPerdidos: false,
            modalLiquidacion: false,
            tableData: [],
            header: [],
            sheetName: '',
            usuario: [],
            modalConfirm: false,
            modalErrores: false,
            errores: [],
            tipo_selected: '',
            codigosNoCambiados: [],
            codigoNoExiste: [],
            codigosConLibro: [],
            porcentaje: 0,
            region: '2',
            observacion: '',
            codigosConLiquidacion: [],
            codigoSelected: [],
            tipo: false,
            codigo: '',
            activePrompt: false,
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            tipoBodega: 0,
            titleImportacion: '',
            popupConfirmTipoImportado: false,
            popupProblemasDiagnostico: false,
            arregloFormatoSend: [],
            arregloProblemasPaquete: [],
            arregloResumen: [],
            arregloErroresPaquetes: [],
            tipoIngreso: 0,
            codigoIndividual: '',
            arrayPeriodos: [],
            periodoSelected: '',
            arrayCodigosEncontrados: [],
            arrayCodigosProblemasForDevolver: [],
            popupMostrarCodigosProblemasDevolver: false,
            popupImprimirPdf: false,
            codigoslibros_devolucion_desarmados_header_id:0,
            popupMostrarErrores: false,
            //variables para asignar en un mismo documento
            ifNuevoDocumento: 1,
            arrayDocomentosCreados: [],
            documentSelected: '',
            //fin variables para asignar en un mismo documento
            arrayCodigosPreview: [],
            menu: 0,
            institucion_id_select:0,
            institucion_select: '',
            arrayCodigosDocumentosD: [],
            dLiquidado: 0,
        };
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.codigosPerdidos = false;
    },
    mounted() {
        let me = this;
        me.getPerriodosXregion();
    },
    computed: {
      ...mapState(['userRoot', 'AdminBodega']),
    },
    methods: {
        getPerriodosXregion() {
            this.periodoSelected = '';
            this.instituciones = [];
            this.$vs.loading();
            PeriodoRepository.getPeriodos()
                .then((p) => {
                    this.arrayPeriodos = p.data;
                    this.filtrarPeriodos(p.data);
                    this.$vs.loading.close();
                })
                .catch((error) => {
                    this.$vs.notify({
                        text: 'Error al cargar los períodos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                    console.error(error);
                    this.$vs.loading.close();
                });
        },
        filtrarPeriodos(datos) {
            this.arrayPeriodos = datos.filter((p) => p.region_idregion == this.region);
        },
        ejecutarValidacion() {
            let me = this;
            if (me.tipoBodega == 0) {
                me.validateCodigosIndividual();
                if (me.tableData.length > 0) {
                    me.buscarCodigosForDevolucion();
                }
            } else if (me.tipoBodega == 3) {
                me.validateCodigosPaquete();
                if (me.arregloFormatoSend.length > 0) {
                    me.buscarCodigosForDevolucion();
                }
            } else if (me.tipoBodega == 4) {
                me.validateCodigosCombo();
                if (me.arregloFormatoSend.length > 0) {
                    me.buscarCodigosForDevolucion();
                }
            }
        },
        limpiarData() {
            let me = this;
            me.tableData = [];
            me.codigosPerdidos = false;
            me.arrayCodigosEncontrados = [];
            me.codigoNoExiste = [];
            me.arregloResumen = [];
            me.arregloFormatoSend = [];
            me.arregloProblemasPaquete = [];
            me.arregloErroresPaquetes = [];
        },
        validateCodigosIndividual() {
            let me = this;
            if (me.tableData.length > 1500) {
                me.$vs.notify({
                    text: 'No puedes subir más de 1500 códigos.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
                me.limpiarData();
                me.popupConfirmTipoImportado = false;
                return;
            }
            const contienePaquetes = me.tableData.some((item) => item.codigo.startsWith('paq-') || item.codigo.startsWith('PAQ-'));
            const contieneCombos = me.tableData.some((item) => item.codigo.startsWith('cmb-') || item.codigo.startsWith('CMB-'));
            if (contienePaquetes) {
                me.$vs.notify({
                    text: 'El archivo contiene paquetes, por favor suba el archivo en el modulo de paquetes.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
                me.limpiarData();
                me.popupConfirmTipoImportado = false;
                return;
            }
            if (contieneCombos) {
                me.$vs.notify({
                    text: 'El archivo contiene combos, por favor suba el archivo en el modulo de combos.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
                me.limpiarData();
                me.popupConfirmTipoImportado = false;
                return;
            }
        },
        validateCodigosPaquete() {
            let me = this;
            if (me.tableData.length > 200) {
                me.$vs.notify({
                    text: 'No puedes subir más de 200 paquetes.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
                me.limpiarData();
                me.popupConfirmTipoImportado = false;
                return;
            }
            let valid = true;
            for (let i = 0; i < me.tableData.length; i++) {
                if (!me.tableData[i].codigo.startsWith('PAQ-')) {
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                me.$vs.notify({
                    text: 'El archivo contiene códigos que no son paquetes, corrija por favor.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
                me.limpiarData();
                me.popupConfirmTipoImportado = false;
                return;
            }
            try {
                const resultado = me.m_validatePaquete(me.tableData, 'paquete', 'paq');
                me.arregloFormatoSend = resultado.arregloFormatoSend;
                me.arregloProblemasPaquete = resultado.arregloProblemasPaquete;
                if (me.arregloProblemasPaquete.length > 0) {
                    me.popupProblemasDiagnostico = true;
                }
            } catch (err) {
                console.log('err', err);
                alert('Hubo problemas con tu archivo excel');
                me.limpiarData();
            }
        },
        validateCodigosCombo() {
            let me = this;
            me.errorCombos = false;
            if (me.tableData.length > 200) {
                me.$vs.notify({
                    text: 'No puedes subir más de 200 combos.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
                me.limpiarData();
                me.popupConfirmTipoImportado = false;
                return;
            }
            let valid = true;
            for (let i = 0; i < me.tableData.length; i++) {
                if (!me.tableData[i].codigo.startsWith('CMB-')) {
                    valid = false;
                    break;
                }
            }
            if (!valid) {
                me.$vs.notify({
                    text: 'El archivo contiene códigos que no son combos, corrija por favor.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
                me.limpiarData();
                me.popupConfirmTipoImportado = false;
                return;
            }
            try {
                const resultado = me.m_validatePaquete(me.tableData, 'combo', 'cmb');
                me.arregloFormatoSend = resultado.arregloFormatoSend;
                me.arregloProblemasPaquete = resultado.arregloProblemasPaquete;
                if (me.arregloProblemasPaquete.length > 0) {
                    me.popupProblemasDiagnostico = true;
                }
            } catch (err) {
                console.log('err', err);
                alert('Hubo problemas con tu archivo excel');
            }
        },
        loadDataInTable({
            results,
            header,
            meta
            }) {
            let me = this;
            me.codigosPerdidos = false;
            me.header = header;
            me.tableData = results;
            me.sheetName = meta.sheetName;
            me.arregloFormatoSend = [];
            me.arregloProblemasPaquete = [];
            me.arregloResumen = [];
            me.arregloErroresPaquetes = [];
            me.codigoNoExiste = [];
            me.arrayCodigosEncontrados = [];
            me.arrayCodigosProblemasForDevolver = [];
            me.codigoslibros_devolucion_desarmados_header_id = 0;
            if (!header.includes('codigo')) {
                me.$vs.notify({
                    text: 'El archivo Excel debe contener una columna "codigo".',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
                me.limpiarData();
                return;
            }
            let validateCodigos = me.tableData.filter((p) => !('codigo' in p) || p.codigo === '');
            if (validateCodigos.length > 0) {
                me.$vs.notify({
                    text: 'Existen códigos vacíos, por favor revise el archivo y suba solo códigos válidos.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
                me.limpiarData();
                return;
            }
            me.tableData.forEach((codigo) => {
                codigo.codigo = codigo.codigo.toUpperCase();
            });
            me.$vs.notify({
                text: `Archivo cargado exitosamente con ${me.tableData.length} códigos. Seleccione el tipo de importación.`,
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check',
                time: 3000,
            });
            setTimeout(() => {
                me.popupConfirmTipoImportado = true;
            }, 500);
        },
        buscarCodigosForDevolucion() {
            let me = this;
            me.arrayCodigosProblemasForDevolver = [];
            me.arrayCodigosPreview = [];
            me.arrayCodigosEncontrados = [];
            if (!me.header.includes('codigo')) {
                me.$vs.notify({
                    text: 'El archivo Excel debe contener una columna "codigo".',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
                me.limpiarData();
                me.popupConfirmTipoImportado = false;
                return;
            }
            let validateCodigos = me.tableData.filter((p) => !('codigo' in p) || p.codigo === '');
            if (validateCodigos.length > 0) {
                me.$vs.notify({
                    text: 'Existen códigos vacíos, por favor revise el archivo y suba solo códigos válidos.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 6000,
                });
                me.limpiarData();
                me.popupConfirmTipoImportado = false;
                return;
            }
            me.tableData.forEach((codigo) => {
                codigo.codigo = codigo.codigo.toUpperCase();
            });
            let json_pagos = JSON.stringify(me.tableData);
            let formData = new FormData();
            formData.append('data_codigos', json_pagos);
            // formData.append('mostrarSoloCodigos', '1');
            // formData.append('periodoEspecifico', me.periodoSelected);
            if (me.tipoBodega == '3') {
                formData.append('getPrevisualizarPaquetes', '1');
            } else if (me.tipoBodega == '4') {
                formData.append('getPrevisualizarPaquetes', '1');
                formData.append('mostrarCombos', '1');
            } else {
                formData.append('getPrevisualizarCodigos', '1');
            }
            me.$vs.loading();
            me.$http
                .post(me.$server_url + 'metodosPostCodigos', formData)
                .then((res) => {
                    me.$vs.loading.close();
                    me.arrayCodigosPreview = res.data;
                    let datosEncontratos = res.data.encontrados || [];
                    me.arrayCodigosEncontrados = datosEncontratos;
                    if (datosEncontratos.length == 0) {
                        me.$vs.notify({
                            text: 'No se encontraron códigos válidos para devolución.',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                        });
                        me.limpiarData();
                        return;
                    }
                    datosEncontratos.forEach(p => {
                      let preEstadoLiquidacion = p.estado_liquidacion;
                      let preLiquidadoRegalado = p.liquidado_regalado || 0;
                      let mensaje = '';

                      if (preEstadoLiquidacion == 0) {
                          mensaje = 'Código liquidado';
                      } else if (preEstadoLiquidacion == 3) {
                          mensaje = 'Código devuelto';
                      } else if (preEstadoLiquidacion == 2 && preLiquidadoRegalado == 1) {
                          mensaje = 'Código liquidado regalado';
                      }
                      // Si el precio es 0 no se puede devolver
                      else if (p.precio == 0) {
                          mensaje = 'Código no se puede devolver, precio 0';
                      }
                      else if (p.documento_devolucion) {
                          mensaje = 'Código ya tiene asignado un documento de devolución ' + p.documento_devolucion;
                      }

                      if (mensaje) {
                          me.arrayCodigosProblemasForDevolver.push({
                              codigo: p.codigo,
                              mensaje: mensaje,
                              estado_liquidacion: preEstadoLiquidacion,
                              liquidado_regalado: preLiquidadoRegalado,
                              institucionBarra: p.institucionDirecta || p.institucionPuntoVenta || 'N/A',
                              periodo_barras: p.periodoescolar || 'N/A',
                          });
                      }
                  });

                  if (res.data.no_encontrados.length > 0) {
                    me.codigoNoExiste = res.data.no_encontrados.map((codigo) => ({
                        codigo
                    }));
                  }
                  //abrir modal si hay codigos devueltos liquidados o regalados
                  if (me.arrayCodigosProblemasForDevolver.length > 0) {
                      me.popupMostrarCodigosProblemasDevolver = true;
                  }else{
                    me.menu = 1;
                  }
                })
                .catch((error) => {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error al validar los códigos: ' + error.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                    me.limpiarData();
                });
        },
        procesarPagos() {
            let me = this
            let formData = new FormData();
            let sendArrayCodigos = me.arrayCodigosDocumentosD.map(element => element.data).flat(10);
            if (sendArrayCodigos.length == 0) {
                me.m_message("No hay codigos para subir", "danger");
                return
            }
            let sendEnviar = []
            sendArrayCodigos.forEach((p) => {
                sendEnviar.push({
                    codigo: p.codigo.toUpperCase(),
                    precio: p.precio,
                    libro_idReal: p.libro_idReal || 0,
                });
            });
            formData.append('data_codigos', JSON.stringify(sendArrayCodigos));
            formData.append('id_usuario', me.usuario.idusuario);
            if (me.ifNuevoDocumento == 0) {
                formData.append('observacion', 'agregar_a_documento_'+ me.documentSelected.codigo_devolucion +'_'+ me.observacion);
            } else {
                formData.append('observacion', 'crear_documento_sueltos_' + me.observacion);
            }
            formData.append('dLiquidado', me.dLiquidado);
            formData.append('institucion_id', me.institucion_id_select);
            formData.append('periodo_id', me.periodoSelected)
            formData.append('ifNuevoDocumento', me.ifNuevoDocumento)
            formData.append('documento_cliente', me.documentSelected.codigo_devolucion)
            formData.append('documento_clienteId', me.documentSelected.id)
            if (me.usuario.id_group == 17 || me.usuario.id_group == 27) {
              formData.append('iniciales', 'MWG');
            } else {
                formData.append('iniciales', me.usuario.iniciales);
            }
            //tipo paquete
            var url = "codigos/devolucionSueltosCrearDocumentos"
            me.$vs.loading()
            this.$http.post(this.$server_url + url, formData)
              .then(res => {
                me.$vs.loading.close()
                if (res.data.status == 0) {
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return
                }
                me.$vs.notify({
                    text: 'Códigos procesados exitosamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                me.codigo = ""
                me.modalConfirm = false
                me.dLiquidado = 0
                // me.tableData = []
                me.codigosPerdidos = true
                me.codigoslibros_devolucion_desarmados_header_id = res.data.codigoslibros_devolucion_desarmados_header_id || 0;

                me.codigosConLiquidacion = res.data.codigosConLiquidacion
                if (me.codigosConLiquidacion.length > 0) {
                    me.modalLiquidacion = true
                }
                me.codigosNoCambiados = res.data.codigosNoCambiados
                me.codigoNoExiste     = res.data.codigoNoExiste
                me.porcentaje         = res.data.cambiados
                if (me.codigosNoCambiados.length > 0) {
                    me.popupMostrarErrores = true
                }
                me.buscarCodigosForDevolucion()
                // abrir pdf
                // me.popupImprimirPdf = true;
              })
              .catch(function (error) {
                  me.$vs.notify({
                      text: 'Verifique que la información se haya guardado correctamente.',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  })
                  me.$vs.loading.close()
              })
        },
        changeInstitucion(e) {
          let me = this
          me.institucion_id_select = e.institucion_id_select
          me.institucion_select    = e.institucion_select
        },
        openConfirm(e) {
          let me = this;
          me.arrayCodigosDocumentosD = e
          if (me.ifNuevoDocumento == 0) {
              //validar que no este vacio nulo undefined documentoSelected
              if (me.documentSelected.codigo_devolucion == null || me.documentSelected.codigo_devolucion == '' || me.documentSelected.codigo_devolucion == undefined) {
                  me.m_message('Debe seleccionar un documento', 'danger')
                  me.modalConfirm = false
                  return false
              }
          }
          // Verifica si hay algún elemento que NO tiene 'codigo'
          const hayCamposInvalidos = me.tableData.some(item => !item.codigo);

          if (hayCamposInvalidos) {
              me.$vs.loading.close();
              me.$vs.notify({
                  text: 'Corrija el formato del excel y vuelva a intentar.',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle',
              });
              return;
          }
          if(me.arrayCodigosProblemasForDevolver.length > 0) {
              me.$vs.notify({
                  text: 'Existen códigos con problemas, por favor revise los códigos con problemas.',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle',
              });
              return;
          }
          if (me.arregloProblemasPaquete.length > 0) {
              me.$vs.notify({
                  text: 'Corrija el formato del excel de paquetes y vuelva a intentar.',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle',
              });
              return;
          }
          if (me.institucion_id_select <= 0) {
              me.$vs.notify({
                  text: 'Seleccione una institución por favor',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-check'
              })
              me.modalConfirm = false
              return false
          }

          //periodoSelected
          if(me.periodoSelected == "" || me.periodoSelected == null || me.periodoSelected == undefined) {
              me.$vs.notify({
                  text: 'Debe seleccionar un periodo',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-check'
              })
              me.modalConfirm = false
              return
          }
          if (me.observacion == "") {
              me.$vs.notify({
                  text: 'Debe ingresar una observación',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-check'
              })
              me.modalConfirm = false
              return
          }
          if (me.observacion.length < 5) {
              me.$vs.notify({
                  text: 'La observación debe tener al menos 5 caracteres',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-check'
              })
              me.modalConfirm = false
              return
          }
          //si escogio tipo de paquete o combo
          if (me.tipoBodega == 3 || me.tipoBodega == 4) {
              if (me.arregloProblemasPaquete.length > 0) {
                  me.$vs.notify({
                      text: `Existe codigos del ${me.tipoBodega == 3 ? 'paquete' : 'combo'} con problemas corriga por favor`,
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-check'
                  })
                  me.modalConfirm = false
                  return false
              }
              if (me.arregloFormatoSend.length > 200) {
                  me.$vs.notify({
                      text: 'No puedes subir mas de 200 ' + me.tipoBodega == 3 ? 'paquetes' : 'combos',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-check'
                  })
                  me.modalConfirm = false
                  return false;
              }
              if (me.arregloFormatoSend.length == 0) {
                  me.$vs.notify({
                      text: 'Hubo problemas para subir los ' + me.tipoBodega == 3 ? 'paquetes' : 'combos',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-check'
                  })
                  me.modalConfirm = false
                  return false
              }
          }
          me.errores = [];
          $.each(me.tableData, (key, value) => {
              if (!value.codigo) {
                  me.errores.push(value);
              }
          });
          if (me.errores.length > 0) {
              me.modalErrores = true;
          } else {
              me.modalConfirm = true;
          }
        },
        // METODOS PARA CARGAR DOCUMENTOS
        f_documentosCreados() {
          let me = this
          me.arrayDocomentosCreados = []
          var url = `devoluciones?getDevolucionesCombosDesarmados=1&estadoFiltro=0`
          this.$http.get(this.$server_url + url)
          .then(function (res) {
              me.arrayDocomentosCreados = res.data;
          })
          .catch(function (error) {
              console.log(error + ' error');
          })
        },
        f_selectedDocumento() {
          let me = this
          if (me.documentSelected == "" || me.documentSelected == null || me.documentSelected == undefined) {
            me.region = '';
            me.periodoSelected = '';
            me.observacion = '';
            me.documentSelected = '';
          } else {
            me.region = me.documentSelected.region;
            me.$nextTick(() => {
              me.getPerriodosXregion();
              me.periodoSelected = me.documentSelected.periodo_id;
              me.observacion = me.documentSelected.observacion;
              me.buscarCodigosForDevolucion();
            });
          }
        },
        f_limpiarDocumento() {
          let me = this
          me.documentSelected = ''
        },
        clearFields() {
            this.fileName = '';
            this.cellAutoWidth = true;
            this.selectedFormat = 'xls';
        },
        exportToExcel() {
            let headerTitle = ['codigo', 'liquidacion', 'institucion barras', 'periodo barras', 'Mensaje'];
            let headerVal = ['codigo', 'liquidacion', 'institucionBarra', 'periodo_barras', 'mensaje'];
            let codigoSelectedMayus = this.codigoSelected;
            for (var i = 0; i < codigoSelectedMayus.length; i++) {
                for (var key in codigoSelectedMayus[i]) {
                    if (typeof codigoSelectedMayus[i][key] == 'string') {
                        codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                    }
                }
            }
            import('@/vendor/Export2Excel').then((excel) => {
                const list = codigoSelectedMayus;
                const data = this.formatJson(headerVal, list);
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat,
                });
                this.clearFields();
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
            });
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map((v) =>
                filterVal.map((j) => {
                    return v[j];
                })
            );
        },
        f_limpiarCancelar(){
          let me = this;
          me.tableData = [];
          me.codigosPerdidos = false;
          me.arrayCodigosEncontrados = [];
          me.arrayCodigosProblemasForDevolver = [];
          me.codigoNoExiste = [];
          me.arregloResumen = [];
          me.arregloProblemasPaquete = [];
          me.arregloFormatoSend = [];
          me.codigoslibros_devolucion_desarmados_header_id = 0;
          this.menu = 0;
        },
    },
};
</script>

<style scoped>
.tabla {
    width: 100%;
    margin-top: 10px;
    border: 1px solid #d1e5f1;
    padding: 2px;
    border-radius: 5px;
}

.th1 {
    background-color: #f17f76;
    border-radius: 5px;
    color: white;
}

.td1,
.th1 {
    padding: 10px;
    text-align: center;
    border: none;
}

.excel-import-container {
    margin-top: 20px;
}

.bg-light {
    background-color: #f8fafc;
}

.vs-collapse {
    background: #ffffff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.vs-collapse-item {
    border-bottom: 1px solid #e2e8f0;
}

.vs-collapse-item__header {
    padding: 1rem;
    font-weight: 600;
    font-size: 1.1rem;
    color: #1f2937;
    transition: background-color 0.2s ease;
}

.vs-collapse-item__header:hover {
    background-color: #f8fafc;
}

.vs-collapse-item__content {
    padding: 1.5rem;
}

.vs-table {
    margin-top: 1rem;
}

.vs-chip {
    font-size: 0.85rem;
    padding: 0.25rem 0.75rem;
}

@media (max-width: 768px) {
    .vs-collapse-item__header {
        font-size: 1rem;
        padding: 0.75rem;
    }

    .vs-collapse-item__content {
        padding: 1rem;
    }

    .vs-table {
        font-size: 0.9rem;
    }
}
</style>
