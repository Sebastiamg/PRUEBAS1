<template>
<div>
    <vs-popup title="Errores en excel de los codigos" :active.sync="modalErrores" style="padding: 0% !important;">
        <div class="w-full" style="background: rgb(121,9,9); padding: 20px; border-radius: 5px; background: linear-gradient(90deg, rgba(121,9,9,1) 28%, rgba(255,0,48,1) 100%); color: white;">
            <div class="vx-row">
                <div class="vx-col sm:w-1/2 w-full">
                    <b>Código</b>
                </div>
                <div class="vx-col sm:w-1/2 w-full">
                    <b>Institución</b>
                </div>
            </div>
            <vs-divider></vs-divider>
            <div :key="index" v-for="(item, index) in errores">
                <div class="vx-row">
                    <div class="vx-col sm:w-1/2 w-full">
                        <span v-if="item.codigo"> {{item.codigo}} </span>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        <span v-if="item.Id_institucion"> {{item.Id_institucion}} </span>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        <span v-if="item.comentario"> {{item.comentario}} </span>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        <span v-if="item.venta_estado"> {{item.venta_estado}} </span>
                    </div>
                </div>
            </div>
        </div>
    </vs-popup>
    <vs-popup title="Códigos no encontrados" :active.sync="modalCedulas" @accept="recargar()" @close="recargar()" @cancel="recargar()" style="padding: 0% !important;">
        <div class="w-full" style="background: rgb(235,147,25); background: linear-gradient(90deg, rgba(235,147,25,1) 28%, rgba(255,166,0,1) 100%); color: white; border-radius: 5px; padding: 10px;">
            <div class="vx-row">
                <div class="vx-col w-full" align="center">
                    <b>Codigos a las que no se aplicaron correctamente</b>
                </div>
            </div>
            <vs-divider></vs-divider>
            <div :key="index" v-for="(item, index) in cedulas_no_encontradas">
                <div class="vx-row">
                    <div class="vx-col w-full" align="center"> <span> {{item}} </span> </div>
                </div>
            </div>
        </div>
    </vs-popup>
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
        <div v-if="modalConfirm">
            <div class="w-full mb-base" align="center">
                <h4>Está seguro de aplicar estos <b>{{ arrayCodigosDocumentosD[0].data.length }}</b> códigos?
                    a <b>{{ arrayCodigosDocumentosD[0].institucion_select }}</b>
                </h4>
            </div>
            <div class="flex justify-center mt-2" style="flex-direction: column;align-items: center;">
                <div v-if="ifNuevoDocumento == 0">
                    <b>Guardar en DOCUMENTO:</b>
                    <p>{{ documentSelected.codigo_devolucion }}</p>
                </div>
                <b>Período</b>
                <p>{{ arrayPeriodos.find(p => p.idperiodoescolar == periodoSelected).periodoescolar }}</p>
                <b>Cantidad de cajas</b>
                <p>{{ cantidadCajas }}</p>
                <b>Cantidad de paquetes</b>
                <p>{{ cantidadPaquetes }}</p>
            </div>
            <div class="w-full mt-2" align="center">
                <vs-button class="mb-2" color="danger" type="gradient" @click="procesarPagos()"> Confirmar </vs-button>
            </div>
        </div>
    </vs-popup>
    <div slot="header" style="margin-top: -15px;">
        <!-- <p>Generar devolución por documentos</p> -->
        <vs-alert class="mt-5 responsive-alert">
            <p class="mt-1 text-center">
                Este import van a crear documentos de devolución que pasan a
                <b>Estado creado</b> para posteriomente en la búsqueda de documentos
                cambiar el <b>Estado a Revisado</b>
            </p>
            <p class="mt-1 text-center">
                <b>Máximo 1000 códigos</b> por documento de devolución
            </p>
        </vs-alert>
    </div>
    <vs-card class="mt-1">
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
        <vs-divider></vs-divider>
        <!--PERIODO-->
        <div class="mt-5 vx-row">
            <div v-if="userRoot || AdminBodega" class="vx-col w-full">
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
            <div class="vx-col w-full">
                <div class="vx-row">
                    <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
                        <span>Seleccione la región</span>
                        <ul class="flex mt-1" style="flex-wrap: wrap;">
                            <li class="mr-3">
                                <vs-radio v-model="tipoRegion" @input="periodoSelected='';arrayPeriodos=[];obtenerPeriodos();" vs-name="radios1tipoFiltro" vs-value="1">Sierra</vs-radio>
                            </li>
                            <li class="mr-3">
                                <vs-radio v-model="tipoRegion" @input="periodoSelected='';arrayPeriodos=[];obtenerPeriodos();" vs-name="radios1tipoFiltro" vs-value="2">Costa</vs-radio>
                            </li>
                        </ul>
                    </div>
                    <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
                        <span>Seleccione el período</span>
                        <v-select :options="arrayPeriodos" :reduce="arrayPeriodos => arrayPeriodos.idperiodoescolar" label="periodoescolar" class="w-full mt-2" v-model="periodoSelected" />
                    </div>
                </div>
            </div>
        </div>

        <!--cajas-->
        <div class="vx-row mt-5">
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
                <span>Cantidad de cajas</span>
                <vs-input v-model="cantidadCajas" type="number" @paste="f_control_cajas" @blur="f_control_cajas" class="mt-1 w-full" />
            </div>
            <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
                <span>Cantidad de paquetes</span>
                <vs-input v-model="cantidadPaquetes" type="number" @paste="f_control_paquetes" @blur="f_control_paquetes" class="mt-1 w-full" />
            </div>
        </div>
        <vs-row class="mt-5">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-textarea counter="500" style="width:100%;" label="Observacion" :counter-danger.sync="counterDanger" v-model="observacion" />
            </vs-col>
        </vs-row>
    </vs-card>
    <div v-if="menu == 0">
        <vs-card>
            <div class="mb-6 mt-5" align="center">
                <import-excel :onSuccess="loadDataInTable" class="mb-4" />
                <div>
                    <vs-row>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" vs-sm="12" vs-xs="12">
                            <vs-card>
                                <div class="header">
                                    <p style="font-weight: bold;">Formato del archivo excel</p>
                                    <table class="tabla">
                                        <tr>
                                            <th class="th1">codigo</th>
                                        </tr>
                                        <tr>
                                            <td class="td1">xxx</td>
                                        </tr>
                                    </table>
                                </div>
                            </vs-card>
                        </vs-col>
                    </vs-row>
                </div>
            </div>
        </vs-card>
    </div>
    <!--RESULTADOS-->
    <!--check mostrar-->
    <ul>
        <li v-if="tipoBodega == 0 && tableData.length > 0">
            <vs-alert color="warning">
                <p>En la importacion de <b>códigos individuales</b>, se va a limpiar el <b>paquete</b>, el <b>combo generado y el combo del libro</b> de los códigos </p>
            </vs-alert>
            <br>
        </li>
        <li v-if="titleImportacion">
            <p class="font-semibold"><i class="fa-solid fa-check text-success"></i> <span class="text-success ml-1">Tipo Importación:</span> {{ titleImportacion }}</p>
        </li>
        <li v-if="codigosPerdidos">
            <vs-checkbox v-model="checkMostrarResultados" class="mt-4" vs-label="Mostrar resultados" color="success" vs-type="border">
                Mostrar resultados
            </vs-checkbox>
        </li>
        <li v-if="CodigosNoEncontrados.length > 0">
            <vs-checkbox v-model="checkMostrarCodigosNoEncontrados" class="mt-4" vs-label="Mostrar resultados" color="success" vs-type="border">
                Mostrar <b>{{ CodigosNoEncontrados.length }} {{ tipoCode }}</b> No encontrados en el archivo de excel
            </vs-checkbox>
        </li>
        <li v-if="arrayComparativoPaquetes.length > 0">
            <vs-checkbox v-model="checkMostrarResumenPaquetes" class="mt-4" vs-label="Mostrar resumen Paquetes" color="success" vs-type="border">
                Mostrar Resumen de {{ tipoBodega == 1 ? 'Paquetes' :' Combos' }}
            </vs-checkbox>
        </li>
        <li v-if="arrayComparativoPaquetes.length > 0" class="ml-2 mt-1 font-medium">Se detectarón <b>{{ arrayComparativoPaquetes.length }}</b> {{ tipoBodega == 1 ? 'paquetes' :' combos' }}</li>
    </ul>
    <div v-if="checkMostrarCodigosNoEncontrados && CodigosNoEncontrados.length > 0">
        <TableReutilizableVue :title="tipoCode + ' No encontrados'" :headers="[tipoCode]" :fieldKeys="['codigo']" :tableData="CodigosNoEncontrados" />
    </div>

    <!--mostrar tabla de codigos no encontrados-->
    <!--mostrar resumen de paquetes-->
    <div v-if="checkMostrarResumenPaquetes && arrayComparativoPaquetes.length > 0">
        <TablaResumenPaquetesDevueltosVue v-if="tipoBodega == 1" :arrayComparativoPaquetes="arrayComparativoPaquetes" />
        <TablaResumenCombosDevueltosVue v-if="tipoBodega == 2" :arrayComparativoPaquetes="arrayComparativoPaquetes" @sendDatosValidationCombos="sendDatosValidationCombos" />
    </div>
    <!--fin mostrar resumen de paquetes-->
    <!--fin mostrar tabla de codigos no encontrados-->
    <div v-if="codigosPerdidos && checkMostrarResultados">
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-alert active="true" style="height: 100px;" color="success">
                    <p class="text-center font-bold"><i class="fa-solid fa-check"></i> Documento de devolución creado correctamente. {{ porcentaje }} códigos</p>
                    <div class="flex justify-center mt-1">
                        <vs-button v-if="codigosSinCodigoUnion.length > 0" @click="popupProblemasCodigosUnion = true;" color="primary" type="border">Mostrar códigos sin código unión</vs-button>
                    </div>
                </vs-alert>
            </vs-col>
        </vs-row>
        <!--codigo no existen-->
        <vs-row>
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
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6" v-if="codigoNoExiste.length>0">
                    <vs-list>
                        <p>Cantidad <span>{{ codigoNoExiste.length }}</span></p>
                        <vs-list-header icon="supervisor_account" title="Códigos que no existen"></vs-list-header>
                        <vs-list-item :key="s" v-for="(tr, s) in codigoNoExiste" icon="check" :title="tr.codigo">
                        </vs-list-item>
                    </vs-list>
                </vs-col>
            </vs-card>
        </vs-row>
        <vs-row>
            <vs-card v-if="codigosConLiquidacion.length > 0">
                <div class="header">
                    <span style="font-weight:bold;">Codigos que ya ha sido liquidados / o estan en otra institución</span>
                </div>
                <TableRadiosCodigosListaVue :arregloCodigos="codigosConLiquidacion" :openModal="Number(1)" :ifErrorProforma="Number(1)" />
            </vs-card>
        </vs-row>
    </div>
    <div v-if="menu == 1" class="mt-5">
        <!--boton subir otro archivo-->
        <div class="flex justify-start">
            <vs-button @click="f_limpiarNuevoFile()" color="warning" type="border" class="mb-4"><i class="fa-solid fa-right-left"></i> Subir otro archivo</vs-button>
        </div>
        <ImportDevolucionReviewVue :tipoBodega="tipoBodega" :documentSelected="documentSelected" :ifNuevoDocumento="ifNuevoDocumento" :dLiquidado="dLiquidado" :arregloCodigos="arrayCodigosPreview" @openConfirm="preConfirm" @changeInstitucion="changeInstitucion" />
    </div>
    <!--MODAL PARA EXPORTAR A EXCEL-->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
        <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
            <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
        </vs-alert>
        <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" />
    </vs-prompt>
    <!--MODAL CONFIRMAR TIPO DE IMPORTADO-->
    <vs-popup small title="Tipo de Importación" :active.sync="popupConfirmTipoImportado" @close="handleClose" :class="{ 'hide-close': !showCloseButton }">
        <p class="text-2xl text-warning font-bold text-center">Que tipo de importación va a realizar?</p>
        <p class="text-center mt-5 text-danger font-bold"> Los códigos normales máximo 1000</p>
        <p class="text-danger mt-2 text-center font-bold">!Los paquete y combos máximo 200 </p>
        <!-- <vs-divider></vs-divider> -->
        <div class="flex justify-center mt-2" style="flex-wrap: wrap;">
            <vs-button class="m-3" color="primary" @click="tipoBodega= 0;tipoCode='Códigos';titleImportacion = 'Importacion Códigos';buscarCodigosForDevolucion();">Códigos</vs-button>
            <vs-button class="m-3" color="#29BCC6" @click="tipoBodega= 1;tipoCode='Paquetes';titleImportacion = 'Importacion Paquetes';buscarCodigosForDevolucion();" type="border" icon-pack="feather" icon="icon-package"> Paquetes</vs-button>
            <vs-button class="m-3" color="#f89e9b" @click="tipoBodega= 2;tipoCode='Combos';titleImportacion = 'Importacion Combos';buscarCodigosForDevolucion();" type="border" icon-pack="feather" icon="icon-package"> Combos</vs-button>
        </div>
        <vs-divider></vs-divider>
        <div class="flex justify-center mt-8">
            <vs-button @click="f_limpiarNuevoFile();popupConfirmTipoImportado=false;" color="danger" type="border" class="mb-4"><i class="fa-solid fa-circle-xmark"></i> Cancelar</vs-button>
        </div>
    </vs-popup>
    <!--MODAL PARA MOSTRAR CODIGOS SIN CODIGO UNION-->
    <vs-popup classContent="popup-example" title="Códigos sin código Unión" fullscreen :active.sync="popupProblemasCodigosUnion">
        <gestionCodigosListaVue :arregloCodigos="codigosSinCodigoUnion" :openModal="Number(0)" />
    </vs-popup>
    <!--MODAL PARA MOSTRAR LOS CODIGOS CAMBIANDOS DE DOCUMENTOS-->
    <vs-popup fullscreen title="Resultado de codigos cambiados de Notas a Pre factura" :active.sync="popupResultadosCambiadosDocumentos">
        <div v-if="popupResultadosCambiadosDocumentos">
            <DevolucionResumenNotasToPrefacturaVue :porcentaje="porcentaje" :arrayCodigosProblemas="arrayCodigosProblemas" :arrayCodigosInsuficientesNotas="arrayCodigosInsuficientesNotas" :arrayLibrosNoExistenEnNota="arrayLibrosNoExistenEnNota" />
        </div>
    </vs-popup>
    <!--modal para resultados pre-->
    <!--resultados-->
    <vs-popup classContent="popup-example" title="Resultados" :active.sync="popupResultadosPreValidacion">
        <div v-if="popupResultadosPreValidacion">
            <p class="text-center"><b>Códigos correctos: </b>{{ porcentajePre }}</p>
        </div>
        <vs-card>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6" v-if="codigosNoCambiadosPreValidacion.length > 0">
                <vs-list>
                    <p>Cantidad <span>{{ codigosNoCambiadosPreValidacion.length }}</span></p>
                    <vs-list-header icon="supervisor_account" title="Códigos con problemas"></vs-list-header>
                    <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiadosPreValidacion" icon="check" :title="tr.codigo">
                        <p v-if="tr.mensaje !='0'"> {{ tr.mensaje }}</p>
                    </vs-list-item>
                </vs-list>
            </vs-col>
        </vs-card>
        <div class="flex justify-center mt-3">
            <vs-button @click="popupResultadosPreValidacion = false">Aceptar</vs-button>
        </div>
    </vs-popup>
    <!--popup para errores-->
    <vs-popup classContent="popup-example" title="Resultados" :active.sync="popupMostrarErrores">
        <div v-if="popupMostrarErrores">
            <TableReutilizableVue :title="'Se encontraros los siguientes errores'" :headers="['codigo','mensaje']" :fieldKeys="['codigo','mensaje']" :ifexportar="Number(1)" :tableData="codigosNoCambiados" />
        </div>
    </vs-popup>

</div>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from 'vue-select'
const TablaErroresPaqueteVue = () => import('@/views/codigos/paquetes/components/TablaErroresPaquete')
const TableResumenPaqueteVue = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableResumenPaquete')
const TableRadiosCodigosListaVue = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableRadiosCodigosLista.vue')
const ImportDevolucionReviewVue = () => import('@/views/codigos/components/utils/ImportDevolucionReview.vue')
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
const TablaResumenPaquetesDevueltosVue = () => import('@/views/codigos/components/utils/paquetes/TablaResumenPaquetesDevueltos.vue')
const TablaResumenCombosDevueltosVue = () => import('@/views/codigos/components/utils/combos/TablaResumenCombosDevueltos.vue')
const DevolucionResumenNotasToPrefacturaVue = () => import('@/views/codigos/components/devolucion/components/DevolucionResumenNotasToPrefactura.vue')
import Generalmix from '@/mixins/Generalmix'
import ImportExcel from '@/views/codigos/components/importExcel';
import gestionCodigosListaVue from '@/views/codigos/components/utils/gestionCodigosLista';
import PeriodoRepository from "../../../../repositories/PeriodoRepository";

export default {
    mixins: [Generalmix],
    components: {
        ImportExcel,
        vSelect,
        gestionCodigosListaVue,
        TablaErroresPaqueteVue,
        TableResumenPaqueteVue,
        TableRadiosCodigosListaVue,
        ImportDevolucionReviewVue,
        TableReutilizableVue,
        TablaResumenPaquetesDevueltosVue,
        TablaResumenCombosDevueltosVue,
        DevolucionResumenNotasToPrefacturaVue,
    },
    data() {
        return {
            codigosPerdidos: false,
            tableData: [],
            header: [],
            sheetName: '',
            usuario: [],
            modalConfirm: false,
            modalErrores: false,
            errores: [],
            tipo_selected: '',
            cedulas_no_encontradas: [],
            modalCedulas: false,
            codigosNoCambiados: [],
            codigosNoCambiadosPreValidacion: [],
            codigosConLiquidacion: [],
            codigoNoExiste: [],
            porcentaje: 0,
            usuarioSeleccionado: '',
            razonBusqueda: '',
            valorBusqueda: 'cedula',
            estudiantesCursos: [],
            region: '2',
            periodos: [],
            periodo: {
                getPeriodo: ''
            },
            datos: {
                usuario: '',
                idusuario: '',
                periodo: '',
            },
            //variables para el export a excel
            activePrompt: false,
            codigoSelected: [],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xlsx',
            codigosNoExisten: [],
            cantidadNoExisten: 0,
            instituciones: [],
            busquedaInstitucion: '',
            nombreInstitucion: '',
            institucion_id: '',
            cliente: '',
            observacion: '',
            counterDanger: false,
            periodo: '',
            tipo: '1',
            title: 'Estos códigos van a ser devueltos seran quitados el usuario, venta_estado, etc. Mientras no esten liquidados ni Leidos',
            //variables para codigos union
            codigosSinCodigoUnion: [],
            popupProblemasCodigosUnion: false,
            //fin variables para codigos union
            dLiquidado: 0,
            tipoBodega: 0,
            titleImportacion: '',
            popupConfirmTipoImportado: false,
            popupProblemasDiagnostico: false,
            arregloFormatoSend: [],
            arregloProblemasPaquete: [],
            arregloResumen: [],
            arregloErroresPaquetes: [],
            codigoNoExiste: [],
            showCloseButton: false,
            //variables para preview
            arrayCodigosPreview: [],
            arrayCodigosEncontrados: [],
            arrayPaquetesEncontrados: [],
            arrayCodigosDocumentosD: [],
            menu: 0,
            checkMostrarResultados: false,
            CodigosNoEncontrados: [],
            checkMostrarCodigosNoEncontrados: [],
            checkMostrarResumenPaquetes: false,
            arrayComparativoPaquetes: [],
            //fin variables para preview
            tipoCode: 'Códigos',
            arrayPeriodos: [],
            tipoRegion: '1',
            periodoSelected: '',
            cantidadCajas: 0,
            cantidadPaquetes: 0,
            empresaSelected: '',
            institucion_id_select: 0,
            venta_lista_institucionSelect: '',
            ifNotaCredito: 0,
            arrayCodigosNotaCredito: [],
            popupResultadosCambiadosDocumentos: false,
            arrayCodigosProblemas: [],
            arrayCodigosInsuficientesNotas: [],
            arrayLibrosNoExistenEnNota: [],
            ifNuevoDocumento: 1,
            arrayDocomentosCreados: [],
            documentSelected: '',
            //variables pre validacion
            popupResultadosPreValidacion: false,
            popupMostrarErrores: false,
            porcentajePre: 0,
            //fin variables pre validacion
            //variables combos
            ifcombo: 0,
            ValidatefaltanLibrosCombo: false,
            ValidateDemasLibrosCombo: false,
            ValidateCodigosCombosNoCoincide: false,
            ValidateCodigosCombosDuplicados: false,
            ValidateCodigosComboNoExiste: false,
            ValidateCombosSinPrecio: false,
            periodoNuevoModulo:29,

            //fin variables combos
        }
    },
    computed: {
        ...mapState(['userRoot', 'AdminBodega']),
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.codigosPerdidos = false
        this.obtenerPeriodos()
        //eliminar filtroDevolucion del localStorage
        localStorage.removeItem('filtroDevolucion')
        localStorage.removeItem('filtroEmpresaSeleccionada')
    },
    mounted() {
        let me = this
        me.institucion_id_select = 0
        me.venta_lista_institucionSelect = ''
        me.f_documentosCreados()
    },
    methods: {
        changeInstitucion(e) {
            let me = this
            console.log("prueba", e)
            me.institucion_id_select = e.institucion_id_select
            me.institucion_select = e.institucion_select
            me.venta_lista_institucionSelect = e.venta_lista_institucion
        },
        f_control_cajas() {
            let me = this;

            // Convertir a número
            me.cantidadCajas = Number(me.cantidadCajas);

            // Asegurarse de que no sea menor que 0
            if (me.cantidadCajas < 0) {
                me.cantidadCajas = 0;
            }

            // Limitar a un máximo de 100
            if (me.cantidadCajas > 100) {
                me.cantidadCajas = 100;
            }
        },
        f_control_paquetes() {
            let me = this
            //convertir a numero
            me.cantidadPaquetes = parseInt(me.cantidadPaquetes)
            if (me.cantidadPaquetes < 0) {
                me.cantidadPaquetes = 0
            }
            //si es mayor a 100 color 100
            if (me.cantidadPaquetes > 100) {
                me.cantidadPaquetes = 100
            }
        },
        obtenerPeriodos() {
            let me = this;
            me.arrayReporte = []
            return PeriodoRepository.getPeriodos().then(p => {
                let datos = p.data
                if (me.tipoRegion == 1) {
                    datos = datos.filter(p => p.region_idregion == 1)
                } else {
                    datos = datos.filter(p => p.region_idregion == 2)
                }
                me.arrayPeriodos = datos;
            });
        },
        preConfirm(e) {
            let me = this
            if (me.ValidatefaltanLibrosCombo || me.ValidateDemasLibrosCombo || me.ValidateCodigosCombosNoCoincide || me.ValidateCodigosCombosDuplicados || me.ValidateCodigosComboNoExiste || me.ValidateCombosSinPrecio) {
                me.m_message('Existe problemas con los combos de su archivo', 'warning', 'icon-alert-triangle')
                return
            }
            me.arrayCodigosDocumentosD       = e
            me.ifNotaCredito                 = e[0].ifNotaCredito
            me.arrayCodigosNotaCredito       = e[0].arrayCodigosNotaCredito
            me.institucion_id_select         = e[0].institucion_id_select
            me.institucion_select            = e[0].institucion_select
            me.venta_lista_institucionSelect = e[0].venta_lista_institucion

            //api post
            let formData = new FormData()
            formData.append('validateBeforeCreate', 1);
            let arrayCodigoSendD = []
            arrayCodigoSendD = me.arrayCodigosDocumentosD
            let sendArrayCodigos = arrayCodigoSendD.map(element => element.data).flat(10);
            if (sendArrayCodigos.length == 0) {
                me.m_message("No hay codigos para subir", "danger");
                return
            }
            //codigos
            formData.append('data_codigos', JSON.stringify(sendArrayCodigos));
            if (me.dLiquidado == 1) formData.append('dLiquidado', me.dLiquidado)
            this.$http.post(this.$server_url + 'devoluciones', formData)
                .then(response => {
                    if (response.data.status == 0) {
                        me.m_message(response.data.message, 'danger')
                        return
                    }
                    me.porcentajePre = response.data.cambiados
                    me.codigosNoCambiadosPreValidacion = response.data.codigosNoCambiados
                    if (me.codigosNoCambiadosPreValidacion.length > 0) {
                        me.popupResultadosPreValidacion = true
                    } else {
                        me.openConfirm()
                    }
                })
                .catch(error => {
                    me.m_message(error.data.error, 'danger')
                })
        },
        openConfirm() {
            let me = this

            if (me.ifNuevoDocumento == 0) {
                //si  no eligen crear un nuevo documento debe tener el institucion_id_select que el documentSelected.id_cliente
                if (me.documentSelected.id_cliente == me.institucion_id_select) {} else {
                    me.m_message(`No es posible agregar códigos al cliente ${me.institucion_select} ya que tiene otro cliente ${ me.documentSelected.nombreInstitucion } `, 'warning')
                    return
                }
            }
            if (me.periodoNuevoModulo <= me.periodoSelected) {
              // proceso nuevo
              if(me.venta_lista_institucionSelect == "" || me.venta_lista_institucionSelect == null || me.venta_lista_institucionSelect == undefined){
                  me.m_message(`El campo venta_lista_institucionSelect ${me.venta_lista_institucionSelect} es requerido`, 'warning')
                  return
              }
            }

            //debe elegir un periodo
            if (me.periodoSelected == undefined || me.periodoSelected == null || me.periodoSelected == "") {
                me.$vs.notify({
                    text: 'Debe seleccionar un periodo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
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
            me.errores = []
            $.each(me.tableData, function (key, value) {
                if (!value.codigo) {
                    me.errores.push(value)
                }
            })
            if (me.errores.length > 0) {
                me.modalErrores = true
            } else {
                me.modalConfirm = true
            }
        },

        handleClose() {
            let me = this;
            me.popupConfirmTipoImportado = true
        },
        validarCodigos() {
            const me = this;

            const LIMITES = {
                normal: 1000,
                paquete: 200,
                combo: 200
            };

            const PREFIXES = {
                paquete: ['paq-', 'PAQ-'],
                combo: ['cmb-', 'CMB-']
            };

            const showError = (message) => {
                me.m_message(message, 'warning');
                me.f_limpiarNuevoFile();
                me.popupConfirmTipoImportado = false;
            };

            const validarPrefijos = (items, prefixes) =>
                items.some(item => !prefixes.some(prefix => item.codigo && item.codigo.startsWith(prefix)));

            // Validar que todas las filas tengan la columna "codigo"
            if (me.tableData.some(item => !item || !item.codigo)) {
                me.$vs.loading.close();
                me.$vs.notify({
                    text: 'Corrija el formato del Excel. Todas las filas deben tener columna "codigo".',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                me.f_limpiarNuevoFile();
                me.popupConfirmTipoImportado = false;
                return false;
            }

            // Validar duplicados
            const codigos = me.tableData.map(item => item.codigo);
            const codigosUnicos = new Set(codigos);
            if (codigosUnicos.size !== codigos.length) {
                showError('El archivo contiene códigos duplicados.');
                return false;
            }

            // Validación según tipo de bodega
            switch (me.tipoBodega) {
                case 0: // Normal
                    if (me.tableData.length > LIMITES.normal) {
                        showError(`No puedes subir más de ${LIMITES.normal} códigos.`);
                        return false;
                    }

                    if (me.tableData.some(item =>
                            PREFIXES.paquete.some(prefix => item.codigo && item.codigo.startsWith(prefix))
                        )) {
                        showError('El archivo contiene paquetes, por favor suba el archivo en el módulo de paquetes.');
                        return false;
                    }

                    if (me.tableData.some(item =>
                            PREFIXES.combo.some(prefix => item.codigo && item.codigo.startsWith(prefix))
                        )) {
                        showError('El archivo contiene combos, por favor suba el archivo en el módulo de combos.');
                        return false;
                    }
                    break;

                case 1: // Paquetes
                    if (me.tableData.length > LIMITES.paquete) {
                        showError(`No puedes subir más de ${LIMITES.paquete} paquetes.`);
                        return false;
                    }

                    if (validarPrefijos(me.tableData, PREFIXES.paquete)) {
                        showError('El archivo no contiene solo paquetes.');
                        return false;
                    }
                    break;

                case 2: // Combos
                    if (me.tableData.length > LIMITES.combo) {
                        showError(`No puedes subir más de ${LIMITES.combo} combos.`);
                        return false;
                    }

                    if (validarPrefijos(me.tableData, PREFIXES.combo)) {
                        showError('El archivo no contiene solo combos.');
                        return false;
                    }
                    break;

                default:
                    showError('Tipo de bodega no reconocido.');
                    return false;
            }

            return true;
        },

        buscarCodigosForDevolucion() {
            const me = this;

            // Validación antes de procesar
            if (!me.validarCodigos()) {
                return;
            }

            me.arrayCodigosPreview = [];
            me.popupConfirmTipoImportado = false;

            // Convertir todos los códigos a mayúsculas
            me.tableData.forEach(codigo => {
                codigo.codigo = codigo.codigo.toUpperCase();
            });

            const json_pagos = JSON.stringify(me.tableData);
            const formData = new FormData();
            formData.append('data_codigos', json_pagos);

            if (me.tipoBodega == 1 || me.tipoBodega == 2) {
                if (me.tipoBodega == 2) {
                    formData.append('mostrarCombos', '1')
                }
                formData.append('getPrevisualizarPaquetes', '1');
            } else {
                formData.append('getPrevisualizarCodigos', '1');
            }

            me.$http.post(me.$server_url + 'metodosPostCodigos', formData)
                .then(res => {
                    me.$vs.loading.close();

                    if (res.data.status == 0) {
                        me.m_message(res.data.message);
                        return;
                    }

                    me.arrayCodigosPreview = res.data;

                    if (res.data.no_encontrados && res.data.no_encontrados.length > 0) {
                        me.checkMostrarCodigosNoEncontrados = true;
                        me.CodigosNoEncontrados = res.data.no_encontrados.map(codigo => ({
                            codigo
                        }));
                    }

                    if (res.data.encontrados.length > 0) {
                        me.arrayCodigosEncontrados = res.data.encontrados;
                        if (me.arrayCodigosEncontrados.length == 0) {
                            me.$vs.notify({
                                text: 'No se encontraron códigos',
                                color: 'warning',
                                iconPack: 'feather',
                                icon: 'icon-alert-triangle'
                            });
                            return;
                        }
                    }

                    if (me.tipoBodega == 1 || me.tipoBodega == 2) {
                        me.arrayPaquetesEncontrados = res.data.paquetesEncontrados || [];
                        if (me.arrayPaquetesEncontrados.length > 0) {
                            me.f_procesoPaquetes();
                        }
                    }

                    me.f_documentosCreados();
                    me.menu = 1;
                })
                .catch(error => {
                    console.error(error);
                    me.$vs.loading.close();
                    me.f_limpiarNuevoFile();
                    me.m_message("Ocurrió un error al agrupar los códigos: " + error, 'danger');
                    me.popupConfirmTipoImportado = false;
                });
        },

        f_procesoPaquetes() {
            let me = this
            //recorrer el array de arrayPaquetesEncontrados y encontrar en el array arrayCodigosEncontrados y colocar en el arrayComparativoPaquetes
            me.arrayComparativoPaquetes = []
            const combinedData = me.arrayCodigosEncontrados
            // Aplana todos los codigos dentro de los arrays 'data' de cada objeto
            const allCodigos = combinedData.flatMap(obj => obj.data);
            me.arrayPaquetesEncontrados.forEach(paquete => {
                var codigosFiltrados = []
                if (me.tipoBodega == 1) {
                    codigosFiltrados = allCodigos.filter(codigo => codigo.codigo_paquete == paquete);
                }
                if (me.tipoBodega == 2) {
                    codigosFiltrados = allCodigos.filter(codigo => codigo.codigo_combo == paquete);
                }
                //cuantos tiene estado_liquidacion = 3 seria como devueltos
                const devueltos = codigosFiltrados.filter(codigo => codigo.estado_liquidacion == 3).length;
                //cantidad de codigosFiltrados
                const cantidadCodigos = codigosFiltrados.length
                me.arrayComparativoPaquetes.push({
                    paquete: paquete,
                    codigos: codigosFiltrados,
                    devueltos: devueltos,
                    cantidadCodigos: cantidadCodigos
                });
            })
            //si es combo mostrar resumen de combos
            if (me.tipoBodega == 2) {
                me.checkMostrarResumenPaquetes = true
            }
        },
        loadDataInTable({
            results,
            header,
            meta
        }) {
            this.codigosPerdidos = false;
            this.checkMostrarResultados = false;
            this.checkMostrarCodigosNoEncontrados = false;
            this.header = header
            this.tableData = results
            this.sheetName = meta.sheetName
            this.popupConfirmTipoImportado = true;
            this.arregloFormatoSend = []
            this.arregloProblemasPaquete = []
            this.arregloResumen = []
            this.arregloErroresPaquetes = []
            this.codigoNoExiste = []
            this.institucion_id_select = 0
            this.venta_lista_institucionSelect = ''
        },

        procesarPagos() {
            let me = this
            if (me.ifNuevoDocumento == 0) {
                //validar que no este vacio nulo undefined documentoSelected
                if (me.documentSelected.codigo_devolucion == null || me.documentSelected.codigo_devolucion == '' || me.documentSelected.codigo_devolucion == undefined) {
                    me.m_message('Debe seleccionar un documento', 'danger')
                    me.modalConfirm = false
                    return false
                }
            }
            //CAJAS
            //si cajas no es un numero
            if (isNaN(me.cantidadCajas)) {
                me.m_message('Debe ingresar un numero de cajas', 'danger')
                me.modalConfirm = false
                return false
            }
            //cajas no puede ser menor a 0 ni mayor a 1000
            if (me.cantidadCajas < 0 || me.cantidadCajas > 1000) {
                me.m_message('El numero de cajas debe ser mayor a 0 y menor a 1000', 'danger')
                me.modalConfirm = false
                return false
            }
            //PAQUETES
            //si cajas no es un numero
            if (isNaN(me.cantidadPaquetes)) {
                me.m_message('Debe ingresar un numero de paquetes', 'danger')
                me.modalConfirm = false
                return false
            }
            //cajas no puede ser menor a 0 ni mayor a 1000
            if (me.cantidadPaquetes < 0 || me.cantidadPaquetes > 1000) {
                me.m_message('El numero de paquetes debe ser mayor a 0 y menor a 1000', 'danger')
                me.modalConfirm = false
                return false
            }
            //la cantidad de cajas o paquetes deber mayor a 0 cualquiera
            if (me.cantidadCajas == 0 && me.cantidadPaquetes == 0) {
                me.m_message('Debe ingresar al menos un número de cajas o paquetes', 'danger', '8000')
                me.modalConfirm = false
                return false
            }
            if (me.institucion_id_select == 0 || me.institucion_id_select == null || me.institucion_id_select == undefined) {
                me.m_message('Debe seleccionar una institución', 'danger')
                me.modalConfirm = false
                return false
            }

            let formData = new FormData();
            formData.append('admin', 'yes')
            formData.append('id_usuario', me.usuario.idusuario);
            formData.append('usuario_editor', me.usuario.idusuario);
            formData.append('id_group', me.usuario.id_group);
            if (me.usuario.id_group == 17 || me.usuario.id_group == 27) {
                formData.append('iniciales', 'MWG');
            } else {
                formData.append('iniciales', me.usuario.iniciales);
            }
            formData.append('institucion_id_select', me.institucion_id_select);
            formData.append('venta_lista_institucionSelect', me.venta_lista_institucionSelect);
            if (me.ifNuevoDocumento == 0) {
                formData.append('observacion', me.observacion);
            } else {
                formData.append('observacion', 'crear_documento_devolucion_' + me.observacion);
            }
            formData.append('periodo_id', me.periodoSelected)
            formData.append('cantidadCajas', me.cantidadCajas)
            formData.append('cantidadPaquetes', me.cantidadPaquetes)
            if (me.tipoBodega == 0) {
                formData.append('tipo_importacion', '1')
            }
            if (me.tipoBodega == 1) {
                formData.append('tipo_importacion', '2')
            }
            if (me.tipoBodega == 2) {
                formData.append('tipo_importacion', '3')
            }
            formData.append('ifNotaCredito', me.ifNotaCredito)
            formData.append('ifNuevoDocumento', me.ifNuevoDocumento)
            formData.append('documento_cliente', me.documentSelected.codigo_devolucion)
            formData.append('documento_clienteId', me.documentSelected.id)
            let arrayCodigoSendD = []
            arrayCodigoSendD = me.arrayCodigosDocumentosD
            //filtrar bc_institucion > 0
            if (arrayCodigoSendD.length == 0) {
                this.m_message("Debe seleccionar un institución", "danger");
                return
            }
            //codigos
            //guardar en sendArrayCodigos la propiedad data de sendArrayCodigos
            let sendArrayCodigos = arrayCodigoSendD.map(element => element.data).flat(10);
            if (sendArrayCodigos.length == 0) {
                me.m_message("No hay codigos para subir", "danger");
                return
            }
            //codigos
            formData.append('data_codigos', JSON.stringify(sendArrayCodigos));
            //clientes
            let ArrayClienteSend = me.arrayCodigosDocumentosD.map(({
                data,
                ...rest
            }) => rest);
            formData.append('arrayCodigosDocumentosD', JSON.stringify(ArrayClienteSend))
            if (me.dLiquidado == 1) formData.append('dLiquidado', me.dLiquidado)
            //tipo paquete
            var url = ""
            url = 'codigos/devolucionCrearDocumentos'
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
                        return false
                    }
                    me.menu = 0
                    me.$vs.notify({
                        text: 'Códigos procesados exitosamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.modalConfirm = false
                    // me.tableData              = []
                    me.codigosPerdidos = true
                    me.checkMostrarResultados = true
                    me.dLiquidado = 0
                    //paquetes
                    me.codigosConLiquidacion = res.data.codigosConLiquidacion
                    me.codigosNoCambiados = res.data.codigosNoCambiados
                    me.codigosSinCodigoUnion = res.data.codigosSinCodigoUnion
                    if (me.codigosSinCodigoUnion.length > 0) {
                        me.popupProblemasCodigosUnion = true
                    }
                    if (me.codigosNoCambiados.length > 0) {
                        me.popupMostrarErrores = true
                    }
                    me.codigoNoExiste = res.data.codigoNoExiste
                    me.porcentaje = res.data.cambiados
                    me.buscarCodigosForDevolucion()
                    me.f_documentosCreados()
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
        recargar() {
            location.reload()
        },

        f_documentosCreados() {
            let me = this
            me.arrayDocomentosCreados = []
            var url = `devoluciones?getDocumentosDevolucion=1&creadas=1`
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
            if (me.documentSelected == "" || me.documentSelected == null || me.documentSelected == undefined) {} else {
                me.tipoRegion = me.documentSelected.region;
                me.$nextTick(() => {
                    me.obtenerPeriodos();
                    me.periodoSelected = me.documentSelected.periodo_id;
                    me.cantidadCajas = me.documentSelected.cantidadCajas;
                    me.cantidadPaquetes = me.documentSelected.cantidadPaquetes;
                    me.observacion = me.documentSelected.observacion;
                });
            }
        },
        f_limpiarDocumento() {
            let me = this
            me.documentSelected = ''
        },
        //METODOS PARA VALIDACION COMBOS
        sendDatosValidationCombos(e) {
            let me = this
            me.ValidatefaltanLibrosCombo = e.ValidatefaltanLibrosCombo
            me.ValidateDemasLibrosCombo = e.ValidateDemasLibrosCombo
            me.ValidateCodigosCombosNoCoincide = e.ValidateCodigosCombosNoCoincide
            me.ValidateCodigosCombosDuplicados = e.ValidateCodigosCombosDuplicados
            me.ValidateCodigosComboNoExiste = e.ValidateCodigosComboNoExiste
            me.ValidateCombosSinPrecio = e.ValidateCombosSinPrecio
        },
        //FIN METODOS PARA VALIDACION COMBOS
        //METODOS PARA EXCEL
        //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
        exportToExcel() {
            let headerTitle = ['codigo', 'institucion estudiante', 'periodo estudiante', 'estudiante', 'cedula', 'estado', 'liquidacion', 'código de barras', 'bc_estado', 'venta estado', 'institucion barras', 'periodo barras'];
            let headerVal = ['codigo', 'nombreInstitucion', 'periodo', 'estudiante', 'cedula', 'codigoEstado', 'liquidacion', 'status', 'barrasEstado', 'ventaEstado', 'institucionBarra', 'periodo_barras'];
            let codigoSelectedMayus = this.codigoSelected
            for (var i = 0; i < codigoSelectedMayus.length; i++) {
                for (var key in codigoSelectedMayus[i]) {
                    if (typeof codigoSelectedMayus[i][key] == "string") {
                        codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
                    }
                }
            }
            import('@/vendor/Export2Excel').then(excel => {
                const list = codigoSelectedMayus
                const data = this.formatJson(headerVal, list)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
        f_limpiarNuevoFile() {
            let me = this
            this.menu = 0;
            this.tableData = [];
            this.codigosPerdidos = false;
            this.checkMostrarResultados = false;
            this.checkMostrarCodigosNoEncontrados = false;
            this.codigosSinCodigoUnion = [];
            this.codigosConLiquidacion = [];
            this.codigoNoExiste = [];
            this.CodigosNoEncontrados = [];
            this.checkMostrarResumenPaquetes = false;
            this.arrayComparativoPaquetes = [];
            this.tipoBodega = 0;
            this.titleImportacion = '';
            this.ValidatefaltanLibrosCombo = false;
            this.ValidateDemasLibrosCombo = false;
            this.ValidateCodigosCombosNoCoincide = false;
            this.ValidateCodigosCombosDuplicados = false;
            this.ValidateCodigosComboNoExiste = false;
            this.ValidateCombosSinPrecio = false;
        },
    }
}
</script>

<style scoped>
.tabla {
    width: 100%;
    margin-top: 10px;
}

.tabla {

    border: 1px solid #D1E5F1;
    padding: 2px;
    border-radius: 5px;
}

.th1 {
    background-color: #BE75E3;
    border-radius: 5px;
    color: white;
}

.td1,
.th1 {
    padding: 10px;
    text-align: center;
    border: none;
}

.hide-close .vs-popup--close {
    display: none;
}

.responsive-alert {
    padding: 20px;
    height: auto !important;
}

@media (min-width: 768px) {
    .responsive-alert {
        padding: 16px 40px;
        /* más espacioso en escritorio */
    }
}
</style>
