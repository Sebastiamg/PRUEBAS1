<template>
<div>
    <div v-if="!userAdminFacturador && !userFacturador">
      <vs-alert color="warning">
        <p class="text-center font-bold">Todo lo devuelto se va devolver al stock de Calmed Notas</p>
      </vs-alert>
    </div>
    <div class="container">

        <div>
            <ul class="flex" style="flex-wrap: wrap;">
                <li class="mr-3" v-if="userRoot || AdminBodega">
                    <vs-radio v-model="tipoFiltro" @input="mostrarFacturacion=0;arrayDocumentos=[];f_getDocuments();" vs-name="radios1tipoFiltro" vs-value="0">Por Fechas</vs-radio>
                </li>
                <li class="mr-3" v-if="userRoot || AdminBodega">
                    <vs-radio v-model="tipoFiltro" @input="mostrarFacturacion=0;arrayDocumentos=[];documentoBusqueda='';" vs-name="radios1tipoFiltro" vs-value="1">Documento (Bodega)</vs-radio>
                </li>
                <li class="mr-3" v-if="groupFacturador">
                    <vs-radio v-model="tipoFiltro" @input="mostrarFacturacion=0;arrayDocumentos=[];f_getDocuments();" vs-name="radios1tipoFiltro" vs-value="3">Pendiente de finalizar</vs-radio>
                </li>
                <li v-if="groupFacturador">
                    <vs-radio v-model="tipoFiltro" @input="handleFinalizadosFilter" vs-name="radios1tipoFiltro" vs-value="4">Finalizados</vs-radio>
                </li>
            </ul>
        </div>
        <!--filtro fechas-->
        <div v-if="tipoFiltro == 0 && (groupFacturador || AdminBodega)">
            <div>
                <div class="filter-header mt-5">
                    <p>Filtro de fechas</p>
                </div>
                <div class="date-grid">
                    <div class="date-field">
                        <p>Fecha Inicio</p>
                        <flat-pickr :config="configdateTimePicker" @input="arrayDocumentos=[];" v-model="fromDate" placeholder="Fecha Inicio" class="input-picker" />
                    </div>
                    <div class="date-field">
                        <p>Fecha Fin</p>
                        <flat-pickr :config="configdateTimePicker" @input="f_getDocuments" v-model="toDate" placeholder="Fecha Fin" class="input-picker" />
                    </div>
                </div>
            </div>
        </div>
        <!-- filtro por documento (Bodega) -->
        <div v-if="tipoFiltro == 1 && (groupFacturador || AdminBodega)">
            <div class="filter-header mt-5">
                <p>Filtro por documento (Bodega)</p>
            </div>
            <div class="">
                <!--input-->
                <div class="">
                    <p>Buscar por documento:</p>
                    <vs-input v-model="documentoBusqueda" @keyup.enter="f_getDocuments" class="w-full" placeholder="Documento o Cliente"></vs-input>
                </div>
            </div>
        </div>
        <div class="button-container" v-if="userRoot || facturadoresUser || userAdminFacturador">
            <button class="filter-button" v-if="tipoFiltro!=4" @click="f_getDocuments">Filtrar</button>
            <button class="filter-button filter-button-historico ml-5" @click="f_abrirHistorico">
                <i class="fas fa-history"></i> Ver Histórico intercambios
            </button>
        </div>
    </div>
    <!--fin container-->
    <!--Facturador-->
    <div v-if="tipoFiltro == 3">
        <vs-alert>
            <p class="text-center">Finalize los documentos de devolución subidos por bodega</p>
        </vs-alert>
    </div>
    <!--Finalizados-->
    <div v-if="tipoFiltro == 4">
        <ul class="flex">
            <li>
                <vs-radio v-model="mostrarFacturacion" class="mr-3" vs-name="radios1mostrarFacturacion" vs-value="1">Documentos Facturacion</vs-radio>
            </li>
            <li>
                <vs-radio v-model="mostrarFacturacion" vs-name="radios1mostrarFacturacion" vs-value="0">Documentos Bodega</vs-radio>
            </li>
        </ul>
        <!-- FILTRO DE FECHAS PARA FINALIZADOS -->
        <div v-if="mostrarFacturacion == 0" class="mt-5">
            <div class="filter-header">
                <p>Filtro de fechas (Finalizados)</p>
            </div>
            <vs-alert color="warning" class="mb-3">
                <i class="fa-solid fa-info-circle"></i> Solo puede seleccionar fechas de los últimos 8 meses.
            </vs-alert>
            <div class="flex items-end gap-3">
                <div class="flex-1">
                    <p>Fecha Inicio</p>
                    <flat-pickr :config="configdateTimePickerFinalizados" v-model="fromDate" placeholder="Fecha Inicio" class="input-picker" />
                </div>
                <div class="flex-1">
                    <p>Fecha Fin</p>
                    <flat-pickr :config="configdateTimePickerFinalizados" v-model="toDate" placeholder="Fecha Fin" class="input-picker" />
                </div>
                <div>
                    <button class="filter-button" @click="f_getDocuments">Buscar</button>
                </div>
            </div>
        </div>
    </div>
    <!--tabla de documentos facturacion-->
    <div v-if="mostrarFacturacion == 1">
        <DevolucionDocumentosFacturacionVue class="mt-5" />
    </div>
    <!--tabla de documentos-->
    <vs-table max-items="10" search pagination stripe :data="arrayDocumentos" v-if="mostrarFacturacion == 0">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ arrayDocumentos.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Devolucion #</vs-th>
            <vs-th>Fechas</vs-th>
            <vs-th v-if="tipoFiltro == 0 || tipoFiltro == 1 || tipoFiltro == 2">Cantidad de libros</vs-th>
            <vs-th>Editor</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                    #{{tr.id}}<br>
                    {{data[indextr].codigo_devolucion}}<br>
                    <p v-if="tr.cantidadCombos > 0"><b v-if="tr.cantidadCombos > 0" class="text-danger">Documento con combos:</b> Si</p>
                    <div v-if="tr.importacion_con_combos == 1">
                      <p v-if="tr.combo_estado == 0" class="text-danger">⚠️ combos no devueltos aún</p>
                    </div>
                    <b>Cliente:</b> <br>
                    <div v-if="tr.institucion">
                        #{{ tr.institucion.idInstitucion }}
                        <br>
                        {{tr.institucion.nombreInstitucion}}

                    </div>
                    <div v-else>
                        <b>Sin cliente</b>
                    </div>
                    <b>Observación:</b>
                    <p>{{data[indextr].observacion}}</p>
                    <div class="flex justify-between">
                        <p><b>Cajas: </b> {{ tr.cantidadCajas }} <b class="ml-5">Paquetes: </b> {{ tr.cantidadPaquetes }}</p>
                    </div>
                    <b>Estado Documento:</b>
                    <div style="background-color:#ceb860;border-radius: 5px;" v-if="tr.estado == 0">
                        <p class="text-white text-center font-semibold p-1">Creado</p>
                    </div>
                    <div style="background-color:#60b2ce;border-radius: 5px;" v-if="tr.estado == 1">
                        <p class="text-white text-center font-semibold p-1">Revisado y devuelto</p>
                    </div>
                    <div style="background-color:#60ce62;border-radius: 5px;" v-if="tr.estado == 2">
                        <p class="text-white text-center font-semibold p-1">Finalizado</p>
                    </div>
                    <div style="background-color:#f75e35;border-radius: 5px;" v-if="tr.estado == 3">
                        <p class="text-white text-center font-semibold p-1">Anulado</p>
                    </div>
                    <div class="flex justify-center items-center">
                        <b v-if="(tr.estado == 1 || tr.estado == 2) && tr.cantidadHijosSInempresa >0 && ( groupBodega || groupFacturador )" class="text-danger"> {{ tr.cantidadHijosSInempresa }} CODIGOS SIN EMPRESA </b>
                    </div>
                    <!-- <div v-if="tr.cantidadCombos > 0" class="mt-2 py-1" style="background-color:#ec6641;border-radius: 5px;color:white;">
                        <p class="text-center font-bold">Documentos con combos</p>
                    </div> -->
                    <div v-if="tr.combo_estado == 1" class="mt-2 py-1" style="background-color:#418aec;border-radius: 5px;color:white;">
                        <p class="text-center font-bold">Combos devueltos</p>
                    </div>
                    <div v-if="tr.combo_estado == 0 && tr.estado == 1 && tr.importacion_con_combos == 1" class="mt-2 py-1" style="background-color:#f14f4a;border-radius: 5px;color:white;">
                        <p class="text-center font-bold">Combos falta devolver</p>
                    </div>
                    <div v-if="tr.intercambio_cliente == '1'" class="intercambio-container">
                        <div class="info-text">
                            <b class="text-danger">Se intercambió de cliente</b><br>
                            <b>Usuario responsable:</b>
                            <p>{{ tr.usuario_intercambio.nombres }} {{ tr.usuario_intercambio.apellidos }}</p>
                        </div>

                        <vs-button type="line" color="primary" size="small" @click="observacionSeleccionada='';abrirModal(tr.observacion_intercambio_cliente)">
                            Ver observación del intercambio
                        </vs-button>
                    </div>

                </vs-td>
                <vs-td>
                    <b>Período:</b>
                    <p>{{ tr.periodo }}</p>
                    <b>Fecha de creación:</b>
                    <p>{{ tr.created_at }}</p>
                    <b>Fecha de revisión:</b>
                    <p>{{ tr.fecha_revisado }}</p>
                    <b>Fecha de finalización:</b>
                    <p>{{ tr.fecha_finalizacion }}</p>
                </vs-td>
                <vs-td v-if="tipoFiltro == 0 || tipoFiltro == 1 || tipoFiltro == 2">
                    <b>Total de códigos:</b>
                    <p>{{ tr.cantidadHijos }}</p>
                    <br>
                    <b>Creados:</b>
                    <p>{{ tr.cantidadCreados }}</p>
                    <b>Revisados:</b>
                    <p>{{ tr.cantidadSonRevisados }}</p>
                    <b>Finalizados:</b>
                    <p>{{ tr.cantidadSonFinalizados }}</p>
                </vs-td>
                <vs-td>
                    <div v-if="tr.usuario">
                        <b>Usuario creador:</b>
                        <p>{{ tr.usuario.nombres }} {{ tr.usuario.apellidos }}</p>
                    </div>
                    <div v-if="tr.usuario_revision">
                        <b>Usuario revisa:</b>
                        <p>{{ tr.usuario_revision.nombres }} {{ tr.usuario_revision.apellidos }}</p>
                    </div>
                    <div v-if="tr.usuario_finalizacion">
                        <b>Usuario finaliza:</b>
                        <p>{{ tr.usuario_finalizacion.nombres }} {{ tr.usuario_finalizacion.apellidos }}</p>
                    </div>
                </vs-td>
                <vs-td>
                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu >
                            <vs-dropdown-item   style="width:280px">
                                <vs-button type="line" class="w-full" v-if="(tr.estado == 0 ) && groupBodega" color="warning" @click="Editar_DevolucionCabecera(tr); enviardataEdicion = tr"><i class="fa-solid fa-pen"></i>
                                    <span> Editar</span>
                                </vs-button>
                                <vs-button type="line" class="w-full" v-if="groupBodega" color="primary" @click="f_verCodigos(tr,1)"><i class="fa-solid fa-folder"></i>
                                    <span> Revisar</span>
                                </vs-button>
                                <vs-button type="line" class="w-full" v-if="tr.estado == 1  && (groupBodega || groupFacturador)  && tr.cantidadHijosSInempresa >0 " color="danger" @click="ObjectSelected=tr;f_verCodigos(tr,4)"><i class="fa-solid fa-folder"></i>
                                    <span> Sin Empresa</span>
                                </vs-button>
                                <vs-button type="line" class="w-full" v-if="(tr.estado == 1) && groupFacturador" color="primary" @click="ObjectSelected=tr;f_verCodigos(tr,2)"><i class="fa-solid fa-folder"></i>
                                    <span> Finalizar</span>
                                </vs-button>
                                <!-- <vs-button type="line" class="w-full" v-if="tr.estado == 2" color="primary" @click="f_verCodigos(tr,3)"><i class="fa-solid fa-folder"></i>
                                    <span> Ver libros</span>
                                </vs-button> -->
                                <vs-button type="line" class="w-full" v-if="groupBodega" color="success" @click="ObjectSelected=tr;generateCombos(tr)">
                                    <i class="fa-solid fa-file-pdf"></i> Imprimir(B)
                                </vs-button>
                                <!--boton eliminar-->
                                <vs-button type="line" class="w-full"  @click="ObjectSelected=tr;confirmEliminarDocumento(tr);" v-if="(tr.estado == 0 && tr.combo_estado == 0) && (userRoot || AdminBodega)" color="danger">
                                    <i class="fa-solid fa-trash"></i> Eliminar
                                </vs-button>
                                <vs-button type="line" class="w-full" @click="ObjectSelected=tr;popupMostrarTodosCodigos=true;" v-if="groupBodega" color="dark">
                                    <i class="fa-solid fa-folder"></i> Mostrar todos los códigos
                                </vs-button>
                                <!--boton para regresar a revisado-->
                                <vs-button v-if="userRoot && tr.estado == '2'" class="w-full" type="line" @click="ObjectSelected=tr;openConfirmRegresarRevisado();" color="danger">
                                    <i class="fa-solid fa-rotate-left"></i> Regresar a revisado
                                </vs-button>
                                <!--<vs-button type="line" class="w-full" v-if="(userRoot || groupFacturador || userFacturador || userAdminFacturador) && tr.estado == 1" color="#5F74BA" @click="ObjectSelected=tr;popupIntercambiarCodigos=true"><i class="fa-solid fa-exchange-alt"></i>
                                    <span> Intercambiar códigos a otro documento</span>
                                </vs-button>-->
                                <vs-button type="line" class="w-full" v-if="tr.estado == 1" color="danger" @click="ObjectSelected=tr;popupCambioCliente=true"><i class="fa-solid fa-user"></i>
                                    <span> Cambio de cliente</span>
                                </vs-button>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <!--fin tabla de documentos-->
    <!--ver codigos agrupados SIN EMPRESA-->
    <vs-popup classContent="popup-example" title="Devoluciones SIN EMPRESA" :active.sync="popupMostrarCodigosSinEmpresa" fullscreen>
        <div v-if="popupMostrarCodigosSinEmpresa">
            <div>
                <DevolucionSinEmpresa class="mt-2" @changeFinishedDevolucion="changeFinishedDevolucion" :arrayEmpresas="arrayEmpresas" :ObjectSelected="ObjectSelected" :arrayCodigosDevueltosSinEmpresa="arrayCodigosDevueltosSinEmpresa" :arrayCodigosRegaladosSinEmpresa="arrayCodigosRegaladosSinEmpresa" :arrayCodigosRegaladosSinEmpresaLiquidados="arrayCodigosRegaladosSinEmpresaLiquidados" :arrayCodigosRegaladosSinEmpresaActas="arrayCodigosRegaladosSinEmpresaActas" :arrayCodigosRegaladosSinEmpresaActasLiquidados="arrayCodigosRegaladosSinEmpresaActasLiquidados" :arrayCodigos="arrayCodigosSinEmpresa" />
            </div>
        </div>
    </vs-popup>
    <!--ver codigos-->
    <vs-popup classContent="popup-example" class="popupPadre" title="Revisar códigos" :active.sync="popupMostrarCodigos" fullscreen>
        <div v-if="popupMostrarCodigos">
          <b>Documento: {{ ObjectSelected.codigo_devolucion }}</b>
            <vs-tabs alignment="fixed">
                <vs-tab label="Revision">
                    <div class="mt-4">
                        <TableDevolucionRevisarVue :arrayCodigos="arrayCodigos" :ObjectSelected="ObjectSelected" @updateDevolucion="updateDevolucion" @updateQuitarCodigos="updateQuitarCodigos"/>
                    </div>
                </vs-tab>
                <vs-tab label="Combos">
                    <div class="mt-4">
                        <DevolucionAgregarCombosVue :ObjectSelected="ObjectSelected" :institucion_id_select="ObjectSelected.id_cliente" :institucion_select="ObjectSelected.institucion.nombreInstitucion" :periodoSelected="ObjectSelected.periodo_id" :nombrePeriodo="ObjectSelected.periodo" @changeRecharge="changeRecharge" />
                    </div>
                </vs-tab>

            </vs-tabs>
        </div>
    </vs-popup>
    <!--fin ver codigos-->
    <vs-popup classContent="popup-example" title="Mostrar códigos" :active.sync="popupMostrarInstitucion">
        <div v-if="popupMostrarInstitucion">
            <TableSelectInstitucion @changeHandle="changeHandle" :busquedaExterna="busquedaCliente" :ifBusquedaExterna="Number(1)" />
        </div>
    </vs-popup>
    <!--ver codigos agrupados FACTURADOR-->
    <vs-popup classContent="popup-example" title="Devoluciones Finalizar" :active.sync="popupMostrarCodigosAgrupados" fullscreen>
        <div v-if="popupMostrarCodigosAgrupados">
            <!-- <pre>{{arrayFinalizar}}</pre> -->
            <div class="flex justify-center" v-if="ObjectSelected.estado == 1">
                <vs-button @click="confirmFinalizado();"><i class="fa-solid fa-flag-checkered"></i> Marcar como finalizado</vs-button>
            </div>
            <div>
                <DevolucionReporteFacturacionVue class="mt-2" @changeFinished="changeFinished" :arrayEmpresas="arrayEmpresas" :ObjectSelected="ObjectSelected" />
            </div>
        </div>
    </vs-popup>

    <!-- popup intercambiar codigos -->
    <vs-popup classContent="popup-example" class="popupPadre" title="Intercambiar códigos" :active.sync="popupIntercambiarCodigos" fullscreen>
      <div v-if="popupIntercambiarCodigos">
        <IntercambiarCodigos :header="ObjectSelected" @close="popupIntercambiarCodigos=false" @moved="f_getDocuments" />
      </div>
    </vs-popup>
    <!--resultados-->
    <vs-popup classContent="popup-example" title="Resultados" :active.sync="popupResultados">
        <div v-if="popupResultados">
            <p class="text-center"><b>Codigos revisados y devueltos: </b>{{ porcentaje }}</p>
        </div>
        <div v-if="codigosNoCambiados.length > 0">
            <TableReutilizableVue :title=" ' Códigos que no se pudieron cambiar'" :headers="['codigo','Mensaje']" :fieldKeys="['codigo','mensaje']" :ifexportar="Number(1)" :tableData="codigosNoCambiados" />
        </div>

        <div class="flex justify-center mt-3">
            <vs-button @click="popupResultados = false">Aceptar</vs-button>
        </div>
    </vs-popup>
    <!--modal para imprimir-->
    <vs-popup classContent="popup-example" title="Imprimir" fullscreen :active.sync="popupImprimir">
        <div v-if="popupImprimir">
          <!-- si hay errores en los combos -->
          <div v-if="arrayErroresGenerateCombo.length > 0">
              <p class="text-danger text-center font-bold">Se encontraron errores en los combos</p>
              <TableReutilizableVue :title=" 'Errores en los combos'" :headers="['Combo del libro','Combo etiqueta','Mensaje']" :fieldKeys="['combo','codigo_combo','mensajeError']" :ifexportar="Number(1)" :tableData="arrayErroresGenerateCombo" />
          </div>
          <DevolucionReporteBodegaVue
          :ObjectSelected="ObjectSelected"
          :arrayCodigos="arrayCodigos"
          :arrayCodigosExclude="arrayCodigosExclude"
          :arrayBodegaLiquidados="arrayBodegaLiquidados"
          :arrayBodegaActasRegalados="arrayBodegaActasRegalados"
          :arrayBodegaActasLiquidados="arrayBodegaActasLiquidados"
          :arrayBodegaRegalados="arrayBodegaRegalados"
          :arrayBodegaRegaladosLiquidados="arrayBodegaRegaladosLiquidados"
          :arrayBodegaGuias="arrayBodegaGuias"
          :arrayCodigosCombosRegalados="arrayCodigosCombosRegalados"
           />
        </div>
    </vs-popup>
    <!-- SECCION EDITAR CABECERA -->
    <vs-popup class="registrodevolucion" @close="f_getDocuments();" :title="`Editar Cabecera: ${enviardataEdicion.codigo_devolucion}`" :active.sync="popupGuardarEditarDevolucionCabecera">
        <EdicionCabweceraDevolucion v-if="popupGuardarEditarDevolucionCabecera" :enviardataEdicion="enviardataEdicion" @change="changeHandleEditar_DevolucionCabecera" />
    </vs-popup>
    <!--Modal para mostrar todos los codigos-->
    <vs-popup classContent="popup-example" title="Mostrar todos los códigos" :active.sync="popupMostrarTodosCodigos" fullscreen>
        <div v-if="popupMostrarTodosCodigos">
            <DevolucionMostrarTodosCodigosVue :ObjectSelected="ObjectSelected" />
        </div>
    </vs-popup>
    <!--Modal para cambiar cliente-->
    <vs-popup fullscreen class="informacionformhijo" title="Cambiar cliente" :active.sync="popupCambioCliente">
        <div v-if="popupCambioCliente">
            <cambioClienteDevolucion :ObjectSelected="ObjectSelected" v-if="popupCambioCliente" @cierreCambioCliente="cierreCambioCliente" />
        </div>
    </vs-popup>
    <vs-popup title="Detalle Observación" :active.sync="mostrarModal">
        <vs-textarea v-model="observacionSeleccionada" disabled class="observacion-textarea" />
    </vs-popup>
    <!--Modal para mostrar histórico de códigos devolución-->
    <vs-popup fullscreen class="informacionformhijo popup-historico" title="Histórico de Códigos Devolución" :active.sync="popupMostrarHistorico">
        <div v-if="popupMostrarHistorico">
            <DevolucionHistoricoCodigosVue :arrayHistorico="arrayHistoricoCodigosDevolucion" />
        </div>
    </vs-popup>

    <!--Modal para mostrar errores de validación de Perseo-->
    <vs-popup class="popup-errores-validacion" title="❌ No se puede finalizar" :active.sync="popupErroresValidacion">
        <div v-if="popupErroresValidacion" class="px-4 py-3">
            <div class="errores-lista">
                <div v-for="(error, index) in erroresValidacion" :key="index" class="error-item mb-3 p-3" style="background-color: #fee; border-left: 4px solid #f44336; border-radius: 4px;">
                    <i class="fa-solid fa-exclamation-triangle" style="color: #f44336; margin-right: 8px;"></i>
                    <span v-html="error"></span>
                </div>
            </div>
            <div class="flex justify-center mt-4">
                <vs-button @click="popupErroresValidacion = false" color="primary">
                    Entendido
                </vs-button>
            </div>
        </div>
    </vs-popup>

</div>
</template>

<script>
import {
    mapState
} from 'vuex';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
// Importar el idioma español para flatpickr
import { Spanish } from 'flatpickr/dist/l10n/es.js';
import moment from 'moment';
import Generalmix from '@/mixins/Generalmix';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
const TableSelectInstitucion = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableSelectInstitucion.vue');
const TableDevolucionRevisarVue = () => import('./TableDevolucionRevisar.vue');
const DevolucionReporteBodegaVue = () => import('./components/DevolucionReporteBodega.vue');
const DevolucionReporteFacturacionVue = () => import('./components/DevolucionReporteFacturacion.vue');
const EdicionCabweceraDevolucion = () => import('@/views/codigos/components/devolucion/Devolucion_Editar_Devolucion.vue');
const DevolucionDocumentosFacturacionVue = () => import('./components/DevolucionDocumentosFacturacion.vue');
const DevolucionAgregarCombosVue = () => import('./components/DevolucionAgregarCombos.vue');
const DevolucionSinEmpresa = () => import('./components/DevolucionSinEmpresa.vue');
const DevolucionMostrarTodosCodigosVue = () => import('./components/DevolucionMostrarTodosCodigos.vue');
const IntercambiarCodigos = () => import('./components/IntercambiarCodigos.vue');
const cambioClienteDevolucion = () => import('./components/cambioClienteDevolucion.vue');
const DevolucionHistoricoCodigosVue = () => import('./components/DevolucionHistoricoCodigos.vue');
export default {
    mixins: [Generalmix],
    components: {
        flatPickr,
        TableReutilizableVue,
        TableSelectInstitucion,
        TableDevolucionRevisarVue,
        DevolucionReporteBodegaVue,
        DevolucionReporteFacturacionVue,
        EdicionCabweceraDevolucion,
        DevolucionDocumentosFacturacionVue,
        DevolucionAgregarCombosVue,
        DevolucionSinEmpresa,
        DevolucionMostrarTodosCodigosVue,
        IntercambiarCodigos,
        cambioClienteDevolucion,
        DevolucionHistoricoCodigosVue
    },
    data() {
        return {
            fromDate: null,
            toDate: null,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                locale: Spanish, // Configurar en español
                onChange: this.onDateChange,
            },
            // Configuración especial para Finalizados (con límite de 8 meses)
            configdateTimePickerFinalizados: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                locale: Spanish,
                minDate: moment().subtract(8, 'months').format('YYYY-MM-DD'), // Bloquear fechas anteriores a 8 meses
                maxDate: moment().format('YYYY-MM-DD'), // Bloquear fechas futuras
                onChange: this.onDateChange,
            },
            arrayDocumentos: [],
            popupMostrarCodigos: false,
            popupMostrarCodigosAgrupados: false,
            ObjectSelected: null,
            arrayCodigos: [],
            titulo: '',
            tipoFiltro: '0',
            busquedaCliente: '',
            popupMostrarInstitucion: false,
            id_cliente: null,
            nombreCliente: null,
            hasFetchedDocuments: false, // Inicializa el flag
            usuario: [],
            facturadoresUser: false,
            tituloBoton: '',
            //variables resultados
            popupResultados: false,
            porcentaje: 0,
            codigosNoCambiados: [],
            //fin variables resultados
            popupImprimir: false,
            arrayCodigosExclude: [],
            //variables para facturador finalizado
            arrayCodigosDevueltosSinEmpresa: [],
            //actas
            arrayCodigosRegaladosSinEmpresaActas: [],
            //fin variables para facturador finalizado
            //bodega
            arrayBodegaLiquidados: [],
            arrayBodegaActasRegalados: [],
            arrayBodegaActasLiquidados: [],
            arrayBodegaRegalados: [],
            arrayBodegaRegaladosLiquidados: [],
            arrayBodegaGuias: [],
            //combos (se mantienen para compatibilidad con DevolucionSinEmpresa)
            arrayBodegaCombos: [],
            //fin bodega
            //facturador
            arrayEmpresas: [],
            arrayFinalizar: [],
            //fin facturador
            popupGuardarEditarDevolucionCabecera: false,
            enviardataEdicion: [],
            mostrarFacturacion: 0,
            //sin empresa
            popupMostrarCodigosSinEmpresa: false,
            arrayCodigosSinEmpresa: [],
            //fin sin empresa
            popupMostrarTodosCodigos: false,
            //variables para filtro por documento
            documentoBusqueda: '',
            //fin variables para filtro por documento
            //modal para cambiar cliente
            popupCambioCliente: false,
            // popup para intercambiar codigos
            popupIntercambiarCodigos: false,
            mostrarModal: false,
            observacionSeleccionada: '',
            arrayErroresGenerateCombo:[],
            arrayCodigosCombosRegalados: [],
            popupMostrarHistorico: false,
            arrayHistoricoCodigosDevolucion: [],
            periodoNuevoModulo:29,
            // Popup para errores de validación
            popupErroresValidacion: false,
            erroresValidacion: [],
        };
    },
    created() {
        let me = this
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        const {
            id_group
        } = me.usuario
        me.facturadoresUser = id_group == 22 || id_group == 23 ? true : false
    },
    mounted() {
        let me = this
        if (!this.hasFetchedDocuments) {
            //con moment
            this.fromDate = moment().startOf('month').format('YYYY-MM-DD');
            this.toDate = moment().endOf('month').format('YYYY-MM-DD');
            this.hasFetchedDocuments = true; // Marca como ya ejecutado
        }
        if (me.facturadoresUser) {
            me.tipoFiltro = 3
            me.f_getDocuments()
        }
        localStorage.removeItem("filtroDevolucion")
    },
    computed: {
        ...mapState(['userRoot', 'groupFacturador', 'AdminBodega', 'groupBodega','userFacturador','userAdminFacturador']),
    },
    methods: {
        abrirModal(observacion) {
            if (!observacion) {
                this.$vs.notify({
                    text: 'No se encontró ninguna observación',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            this.observacionSeleccionada = observacion;
            this.mostrarModal = true;
        },
        coincide(observacion, institucionNombre) {
            console.log(`Comparando: "${observacion}" con "${institucionNombre}"`);

            // Usar expresión regular para eliminar todos los caracteres invisibles y espacios
            const cleanedObservacion = observacion ? observacion.replace(/[\s\u200B\u00A0]+/g, '').toLowerCase() : '';
            const cleanedInstitucion = institucionNombre ? institucionNombre.replace(/[\s\u200B\u00A0]+/g, '').toLowerCase() : '';

            console.log(`Observación limpiada: "${cleanedObservacion}"`);
            console.log(`Institución limpiada: "${cleanedInstitucion}"`);

            // Realizar la comparación
            return cleanedObservacion.includes(cleanedInstitucion);
        },

        cierreCambioCliente() {

            this.popupCambioCliente = false;
            this.f_getDocuments();

        },
        async f_abrirHistorico() {
            let me = this;
            try {
                this.$vs.loading();
                const url = `devoluciones?getHistoricoCodigosDevolucionSon=1`;
                const response = await this.$http.get(`${this.$server_url}${url}`);
                me.arrayHistoricoCodigosDevolucion = response.data;

                if (me.arrayHistoricoCodigosDevolucion.length === 0) {
                    me.m_message('No se encontró histórico', 'warning');
                } else {
                    me.popupMostrarHistorico = true;
                }
            } catch (error) {
                console.error('Error al obtener histórico:', error);
                me.m_message('Error al obtener el histórico', 'danger');
            } finally {
                this.$vs.loading.close();
            }
        },
        openInstitucion() {
            let me = this
            //no puede estar vacio
            if (me.busquedaCliente == '') {
                me.$vs.notify({
                    text: 'Debe ingresar una institución',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            //quitar espacios con trim
            me.busquedaCliente = me.busquedaCliente.trim()
            me.popupMostrarInstitucion = true
        },
        Editar_DevolucionCabecera() {
            this.popupGuardarEditarDevolucionCabecera = true;
        },
        changeHandleEditar_DevolucionCabecera(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemitsaveandedit); // Debería imprimir 1
            if (e.verificacionemitsaveandedit == 1) {
                console.log("Emit recibido por guardado.");
                me.popupGuardarEditarDevolucionCabecera = false;
                me.f_getDocuments();
            } else if (e.verificacionemitsaveandedit == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupGuardarEditarDevolucionCabecera = false;
                me.f_getDocuments();
            } else {
                console.log("Emit no recibido");
            }
        },
        changeRecharge(e) {
            let me = this;
            this.f_getDocuments()
        },
        updateDevolucion(e) {
            let me = this;
            me.porcentaje = 0
            this.f_getDocuments()
            me.popupMostrarCodigos = false;
            //resultados
            me.porcentaje = e.cambiados
            me.codigosNoCambiados = e.codigosNoCambiados
            me.popupResultados = true
        },
        updateQuitarCodigos(){
          let me = this;
          console.log("llego al update quitar codigos");
          this.f_getDocuments()
          me.popupMostrarCodigos = false;
        },
        onDateChange(selectedDates, dateStr, instance) {
            instance.close();
        },
        changeHandle(e) {
            let me = this;
            me.id_cliente = e.idInstitucion;
            me.nombreCliente = e.nombreInstitucion;
            me.popupMostrarInstitucion = false;
            me.arrayDocumentos = [];
            me.f_getDocuments();
        },
        cleanInstitucion() {
            let me = this;
            me.id_cliente = null;
            me.nombreCliente = null;
            me.arrayDocumentos = [];
        },
        handleFinalizadosFilter() {
            let me = this;
            me.mostrarFacturacion = 1;
            me.arrayDocumentos = [];
            // Establecer fechas automáticamente: primer día del mes actual hasta hoy
            me.fromDate = moment().startOf('month').format('YYYY-MM-DD');
            me.toDate = moment().format('YYYY-MM-DD');
            // Ejecutar la búsqueda automáticamente
            me.f_getDocuments();
        },
        async f_getDocuments() {
            let me = this;
            me.arrayDocumentos = [];
            var url = '';
            //FILTRO POR FECHAS
            if (me.tipoFiltro == 0) {
                // Validar fechas
                if (!this.fromDate || !this.toDate) {
                    this.m_message('Por favor, seleccione ambas fechas.', 'warning', );
                    return;
                }
                //la fecha fromDate no puede ser mayor a la fecha toDate
                if (this.fromDate > this.toDate) {
                    this.m_message('La fecha de inicio no puede ser mayor a la fecha de fin.', 'warning');
                    return;
                }

                url = `devoluciones?filtroDocumentosDevueltos=1&fechaInicio=${this.fromDate}&fechaFin=${this.toDate}`;

            }
            //FILTRO POR DOCUMENTO
            else if (me.tipoFiltro == 1) {
                if (!this.documentoBusqueda) {
                    this.m_message('Por favor, introduzca un documento.', 'warning');
                    return;
                }
                //documentoBusqueda minimo 3 letras
                if (this.documentoBusqueda.length < 2) {
                    this.m_message('Introduzca un documento con 2 letras.', 'warning');
                    return;
                }
                url = `devoluciones?filtroDocumentosDevueltos=1&documentos=${this.documentoBusqueda}`;
            }
            //Pendientes de finalizar
            else if (me.tipoFiltro == 3) {
                url = `devoluciones?filtroDocumentosDevueltos=1&revisados=1`;
            }
            //finalizados (CON RANGO DE FECHAS)
            else if (me.tipoFiltro == 4) {
                // Validar fechas
                if (!this.fromDate || !this.toDate) {
                    this.m_message('Por favor, seleccione ambas fechas.', 'warning');
                    return;
                }
                // Validar que fecha inicio no sea mayor a fecha fin
                if (this.fromDate > this.toDate) {
                    this.m_message('La fecha de inicio no puede ser mayor a la fecha de fin.', 'warning');
                    return;
                }

                url = `devoluciones?filtroDocumentosDevueltos=1&finalizados=1&fechaInicio=${this.fromDate}&fechaFin=${this.toDate}`;
            }
            // Iniciar el loading
            this.$vs.loading();

            try {
                const response = await this.$http.get(`${this.$server_url}${url}`);
                this.arrayDocumentos = response.data;

                // Verificar si no hay documentos
                if (this.arrayDocumentos.length == 0) {
                    this.m_message('No se encontraron documentos', 'warning', );
                }
            } catch (error) {
                console.error('Error al obtener documentos:', error);
                this.m_message('Error al obtener los documentos', 'danger');
            } finally {
                // Cerrar el loading en cualquier caso
                this.$vs.loading.close();
            }
        },
        async f_verCodigos(tr, tipo) {
            let me = this;
            console.log(tipo, "tipo");
            me.ObjectSelected = tr;
            const {
                institucion,
                codigo_devolucion,
                id
            } = tr;
            const nombreCliente = institucion ? institucion.nombreInstitucion : 'Sin cliente';
            me.titulo = `Mostrar codigos de documento devolucion: ${codigo_devolucion} - ${nombreCliente}`;
            if (tipo == 2 || tipo == 3) {
                await me.f_obtenerCodigosAgrupados(tipo);
            } else if (tipo == 4) {
                await me.f_obtenerCodigosAgrupados(tipo);
                await me.f_obtenerCodigos(tipo);
            } else {
                await me.f_obtenerCodigos();
            }
        },
        async f_obtenerCodigosAgrupados(tipo) {
            let me = this;
            let ProcesoNuevo = 0;
            if (me.periodoNuevoModulo <= me.ObjectSelected.periodo_id) {
                ProcesoNuevo = 1;
            }
            if (ProcesoNuevo === 1) {
                await me.f_obtenerCodigosAgrupadosPorDocumento(tipo);
            } else {
                await me.f_obtenerCodigosAgrupadosPorEmpresa(tipo);
            }
        },

        // ── PROCESO NUEVO: agrupa empresa → factura_perseo ──────────────────────
        async f_obtenerCodigosAgrupadosPorDocumento(tipo) {
            let me = this;
            me.arrayCodigos  = [];
            me.arrayEmpresas = [];
            try {
                let tipoCodigos = tipo == 2 || tipo == 4 ? 'revisados' : 'finalizados';
                const url = `devoluciones?getCodigosxDocumentoDevolucion=1&id_documento=${me.ObjectSelected.id}&${tipoCodigos}=1`;
                const response = await me.$http.get(me.$server_url + url);
                const allData  = response.data;

                const combosData = allData.filter(p => p.tipo_codigo == 1);
                const datos      = allData.filter(p => p.tipo_codigo == 0 && p.combo == null);

                if (datos.length == 0 && combosData.length == 0) {
                    me.m_message('No se encontraron códigos', 'warning');
                    return;
                }

                // Construir empresas únicas
                let empresasMap = new Map();
                allData.forEach(item => {
                    const id_empresa      = (item.id_empresa == null || item.id_empresa == 0) ? 0 : item.id_empresa;
                    const descripcion_corta = id_empresa === 0 ? 'Sin Empresa' : (item.descripcion_corta || 'Sin Empresa');
                    if (!empresasMap.has(id_empresa)) {
                        empresasMap.set(id_empresa, {
                            id_empresa,
                            descripcion_corta,
                            arrayCodigos: [],
                            documentos: [],       // ← sub-agrupación por factura_perseo
                            subtotal: 0,
                            total: 0,
                            cantidad: 0,
                            ven_codigo: ''
                        });
                    }
                });
                me.arrayEmpresas = Array.from(empresasMap.values()).sort((a, b) => a.id_empresa - b.id_empresa);

                me.arrayEmpresas.forEach(empresa => {
                    const esSinEmpresa  = empresa.id_empresa === 0;
                    const filtroEmpresa = (item) => esSinEmpresa
                        ? (item.id_empresa == null || item.id_empresa == 0)
                        : item.id_empresa == empresa.id_empresa;

                    const datosEmpresa  = datos.filter(filtroEmpresa);
                    const combosEmpresa = combosData.filter(filtroEmpresa);

                    // Agrupar por documento + factura_perseo dentro de la empresa (CÓDIGOS NORMALES)
                    let docsMap = new Map();
                    datosEmpresa.forEach(item => {
                        const docKey = `${item.documento || 'Sin Documento'}||${item.factura_perseo || 'Sin Factura'}`;
                        if (!docsMap.has(docKey)) {
                            docsMap.set(docKey, {
                                documento: item.documento || 'Sin Documento',
                                factura_perseo: item.factura_perseo || 'Sin Factura',
                                fecha_envio_perseo: item.fecha_envio_perseo || null,
                                items: [],
                                combos: []
                            });
                        }
                        docsMap.get(docKey).items.push(item);
                    });

                    // Agrupar COMBOS por documento + factura_perseo
                    combosEmpresa.forEach(item => {
                        const docKey = `${item.documento || 'Sin Documento'}||${item.factura_perseo || 'Sin Factura'}`;
                        if (!docsMap.has(docKey)) {
                            docsMap.set(docKey, {
                                documento: item.documento || 'Sin Documento',
                                factura_perseo: item.factura_perseo || 'Sin Factura',
                                fecha_envio_perseo: item.fecha_envio_perseo || null,
                                items: [],
                                combos: []
                            });
                        }
                        docsMap.get(docKey).combos.push(item);
                    });

                    let documentos = [];
                    docsMap.forEach(({ documento, factura_perseo, fecha_envio_perseo, items, combos }) => {
                        const devueltos          = me.f_obtenerCodigosXEmpresaDevueltosDescuento(items.filter(i => i.documento_estado_liquidacion != 2));
                        const regaladosActas     = me.f_obtenerCodigosXEmpresaDevueltosDescuento(items.filter(i => i.documento_estado_liquidacion == 2 && i.estado_codigo == 2 && i.documento_regalado_liquidado == 0), `Actas`);
                        const regaladosActasLiq  = me.f_obtenerCodigosXEmpresaDevueltosDescuento(items.filter(i => i.documento_estado_liquidacion == 2 && i.estado_codigo == 2 && i.documento_regalado_liquidado == 1), `Actas liquidados`);
                        const regalados          = me.f_obtenerCodigosXEmpresaDevueltosDescuento(items.filter(i => i.documento_estado_liquidacion == 2 && i.estado_codigo != 2 && i.documento_regalado_liquidado == 0), `Regalados`);
                        const regaladosLiq       = me.f_obtenerCodigosXEmpresaDevueltosDescuento(items.filter(i => i.documento_estado_liquidacion == 2 && i.estado_codigo != 2 && i.documento_regalado_liquidado == 1), `Regalados liquidados`);

                        // Procesar combos de este documento
                        const arrayCombos = combos.length > 0 ? me.f_obtenerCodigosXEmpresaDevueltosDescuento(combos, '', 1) : [];

                        const codigos = [...devueltos, ...regalados, ...regaladosActas, ...regaladosLiq, ...regaladosActasLiq, ...arrayCombos];
                        codigos.sort((a, b) => a.codigo.localeCompare(b.codigo));

                        // Inyectar documento, factura_perseo y fecha_envio_perseo en cada item para que lleguen al back al finalizar
                        codigos.forEach(c => {
                            c.documento_venta = documento;
                            c.factura_perseo  = factura_perseo;
                            c.fecha_envio_perseo = fecha_envio_perseo;
                        });

                        documentos.push({
                            documento,
                            factura_perseo,
                            fecha_envio_perseo,
                            arrayCodigos: codigos,
                            subtotal: codigos.reduce((t, i) => t + parseFloat(i.subtotal || 0), 0),
                            total:    codigos.reduce((t, i) => t + parseFloat(i.total    || 0), 0),
                            cantidad: codigos.reduce((t, i) => t + parseFloat(i.cantidad || 0), 0),
                        });
                    });

                    // arrayCodigos = todos los códigos de la empresa (para compatibilidad)
                    const todosLosCodigos = documentos.reduce((acc, d) => acc.concat(d.arrayCodigos), []);

                    empresa.documentos   = documentos;
                    empresa.arrayCodigos = todosLosCodigos;
                    empresa.subtotal     = todosLosCodigos.reduce((t, i) => t + parseFloat(i.subtotal || 0), 0);
                    empresa.total        = todosLosCodigos.reduce((t, i) => t + parseFloat(i.total    || 0), 0);
                    empresa.cantidad     = todosLosCodigos.reduce((t, i) => t + parseFloat(i.cantidad || 0), 0);
                });

                // Compatibilidad DevolucionSinEmpresa
                const empresaSinEmpresa = me.arrayEmpresas.find(e => e.id_empresa === 0);
                me.arrayCodigosDevueltosSinEmpresa            = empresaSinEmpresa ? empresaSinEmpresa.arrayCodigos : [];
                me.arrayCodigosRegaladosSinEmpresa            = [];
                me.arrayCodigosRegaladosSinEmpresaActas       = [];
                me.arrayCodigosRegaladosSinEmpresaLiquidados  = [];
                me.arrayCodigosRegaladosSinEmpresaActasLiquidados = [];

                if (tipo == 4) {
                    me.popupMostrarCodigosSinEmpresa = true;
                } else {
                    me.popupMostrarCodigosAgrupados = true;
                }
            } catch (e) {
                console.error("Error fetching codes:", e);
            }
        },

        // ── PROCESO ANTERIOR: agrupa solo por empresa ────────────────────────────
        async f_obtenerCodigosAgrupadosPorEmpresa(tipo) {
            let me = this;
            me.arrayCodigos  = [];
            me.arrayEmpresas = [];
            try {
                let tipoCodigos = tipo == 2 || tipo == 4 ? 'revisados' : 'finalizados';
                const url = `devoluciones?getCodigosxDocumentoDevolucion=1&id_documento=${me.ObjectSelected.id}&${tipoCodigos}=1`;
                const response = await me.$http.get(me.$server_url + url);
                const allData  = response.data;

                let empresasMap = new Map();
                allData.forEach(item => {
                    const id_empresa      = (item.id_empresa == null || item.id_empresa == 0) ? 0 : item.id_empresa;
                    const descripcion_corta = id_empresa === 0 ? 'Sin Empresa' : (item.descripcion_corta || 'Sin Empresa');
                    if (!empresasMap.has(id_empresa)) {
                        empresasMap.set(id_empresa, { id_empresa, descripcion_corta, arrayCodigos: [], subtotal: 0, total: 0, cantidad: 0, ven_codigo: '' });
                    }
                });
                me.arrayEmpresas = Array.from(empresasMap.values()).sort((a, b) => a.id_empresa - b.id_empresa);

                const combosData = allData.filter(p => p.tipo_codigo == 1);
                const datos      = allData.filter(p => p.tipo_codigo == 0 && p.combo == null);

                if (datos.length == 0 && combosData.length == 0) {
                    me.m_message('No se encontraron códigos', 'warning');
                    return;
                }

                me.arrayEmpresas.forEach(empresa => {
                    const esSinEmpresa  = empresa.id_empresa === 0;
                    const filtroEmpresa = (item) => esSinEmpresa
                        ? (item.id_empresa == null || item.id_empresa == 0)
                        : item.id_empresa == empresa.id_empresa;

                    const combosEmpresa = combosData.filter(filtroEmpresa);
                    const arrayCombos   = combosEmpresa.length > 0
                        ? me.f_obtenerCodigosXEmpresaDevueltosDescuento(combosEmpresa, '', 1)
                        : [];

                    const devueltos          = me.f_obtenerCodigosXEmpresaDevueltosDescuento(datos.filter(item => filtroEmpresa(item) && item.documento_estado_liquidacion != 2));
                    const regaladosActas     = me.f_obtenerCodigosXEmpresaDevueltosDescuento(datos.filter(item => filtroEmpresa(item) && item.documento_estado_liquidacion == 2 && item.estado_codigo == 2 && item.documento_regalado_liquidado == 0), esSinEmpresa ? 'Actas sin empresa' : `Actas ${empresa.descripcion_corta}`);
                    const regaladosActasLiq  = me.f_obtenerCodigosXEmpresaDevueltosDescuento(datos.filter(item => filtroEmpresa(item) && item.documento_estado_liquidacion == 2 && item.estado_codigo == 2 && item.documento_regalado_liquidado == 1), esSinEmpresa ? 'Actas liquidados sin empresa' : `Actas liquidados ${empresa.descripcion_corta}`);
                    const regalados          = me.f_obtenerCodigosXEmpresaDevueltosDescuento(datos.filter(item => filtroEmpresa(item) && item.documento_estado_liquidacion == 2 && item.estado_codigo != 2 && item.documento_regalado_liquidado == 0), esSinEmpresa ? 'Regalados sin empresa' : `Regalados ${empresa.descripcion_corta}`);
                    const regaladosLiq       = me.f_obtenerCodigosXEmpresaDevueltosDescuento(datos.filter(item => filtroEmpresa(item) && item.documento_estado_liquidacion == 2 && item.estado_codigo != 2 && item.documento_regalado_liquidado == 1), esSinEmpresa ? 'Regalados liquidados sin empresa' : `Regalados liquidados ${empresa.descripcion_corta}`);

                    const todosLosCodigos = [...devueltos, ...regalados, ...regaladosActas, ...regaladosLiq, ...regaladosActasLiq, ...arrayCombos];
                    todosLosCodigos.sort((a, b) => a.codigo.localeCompare(b.codigo));

                    empresa.arrayCodigos = todosLosCodigos;
                    empresa.subtotal     = todosLosCodigos.reduce((t, i) => t + parseFloat(i.subtotal || 0), 0);
                    empresa.total        = todosLosCodigos.reduce((t, i) => t + parseFloat(i.total    || 0), 0);
                    empresa.cantidad     = todosLosCodigos.reduce((t, i) => t + parseFloat(i.cantidad || 0), 0);
                });

                const empresaSinEmpresa = me.arrayEmpresas.find(e => e.id_empresa === 0);
                me.arrayCodigosDevueltosSinEmpresa            = empresaSinEmpresa ? empresaSinEmpresa.arrayCodigos : [];
                me.arrayCodigosRegaladosSinEmpresa            = [];
                me.arrayCodigosRegaladosSinEmpresaActas       = [];
                me.arrayCodigosRegaladosSinEmpresaLiquidados  = [];
                me.arrayCodigosRegaladosSinEmpresaActasLiquidados = [];

                if (tipo == 4) {
                    me.popupMostrarCodigosSinEmpresa = true;
                } else {
                    me.popupMostrarCodigosAgrupados = true;
                }
            } catch (e) {
                console.error("Error fetching codes:", e);
            }
        },
        f_obtenerCodigosXEmpresaDevueltosDescuento(preArray, observacion_codigo = '', tipo = 0) {
            let me = this;
            //tipo 0 => codigo normal 1 => codigo combo
            let result = [];
            let map = new Map();

            for (const item of preArray) {
                // Crear una clave única combinando `codigo_liquidacion` y `ven_desc_por`
                const key = `${item.codigo_liquidacion}-${item.ven_desc_por}`;
                let totalLibrosCombo = 0
                let cantidadTotallibrosCombo = 0
                if (!map.has(key)) {
                    map.set(key, true); // agregar clave al Map
                    let descuento = 0
                    //solo actas tienen 100% cuanto no tienen empresa
                    if ((item.id_empresa == 0 || item.id_empresa == null) && item.documento_estado_liquidacion == 2 && item.estado_codigo == 2) {
                        descuento = 100
                    } else {
                        descuento = item.ven_desc_por
                    }
                    let preCantidad = 0
                    if (tipo == 0) {
                        preCantidad = preArray.filter(
                            (item2) => item2.codigo_liquidacion === item.codigo_liquidacion && item2.ven_desc_por === item.ven_desc_por
                        ).length
                    }
                    //combo
                    if (tipo == 1) {
                        let getCombo = preArray.filter(
                            (item2) => item2.codigo_liquidacion === item.codigo_liquidacion && item2.ven_desc_por === item.ven_desc_por
                        )
                        if(me.ObjectSelected.combo_estado == 1){
                           //sumar la propiedad combo_cantidad_devuelta en preCantidad
                          preCantidad = getCombo.reduce((total, item) => total + parseFloat(item.combo_cantidad_devuelta), 0);
                        }
                        if(me.ObjectSelected.combo_estado == 0){
                          //sumar la propiedad combo_cantidad en preCantidad
                          preCantidad = getCombo.reduce((total, item) => total + parseFloat(item.combo_cantidad), 0);
                        }
                        let totalLibros = item.codigos_combos.split(',')
                        totalLibrosCombo = totalLibros.length
                        //multiplicar la preCantidad  por el totalLibrosCombo
                        cantidadTotallibrosCombo = preCantidad * totalLibrosCombo
                    }

                    result.push({
                        codigo: item.codigo_liquidacion,
                        cantidad: preCantidad,
                        nombrelibro: item.nombrelibro,
                        precio: item.precio,
                        descripcion_corta: item.descripcion_corta,
                        id_empresa: item.id_empresa,
                        documento_estado_liquidacion: item.documento_estado_liquidacion,
                        ven_desc_por: descuento,
                        observacion_codigo: observacion_codigo,
                        totalLibrosCombo: totalLibrosCombo,
                        cantidadTotallibrosCombo: cantidadTotallibrosCombo,
                        tipo_codigo: item.tipo_codigo
                    });
                }
            }

            // Calcular subtotal y total con descuento aplicado
            result.forEach((obj) => {
                obj.subtotal = (obj.cantidad * obj.precio).toFixed(2);
                obj.total = (obj.subtotal * (1 - obj.ven_desc_por / 100)).toFixed(2);
            });


            return result;
        },

        f_obtenerCodigosXEmpresaDevueltos(preArray) {
            let me = this
            //DEVUELTOS
            //agrupar por codigo_liquidacion y la cantidad que se repite y motrar el nombre del libro y guardar en arrayCodigosDevueltos
            let result = [];
            let map = new Map();
            for (const item of preArray) {
                if (!map.has(item.codigo_liquidacion)) {
                    map.set(item.codigo_liquidacion, true); // set any value to Map
                    result.push({
                        codigo: item.codigo_liquidacion,
                        cantidad: preArray.filter((item2) => item2.codigo_liquidacion == item.codigo_liquidacion).length,
                        nombrelibro: item.nombrelibro,
                        precio: item.precio,
                        descripcion_corta: item.descripcion_corta,
                        id_empresa: item.id_empresa,
                        documento_estado_liquidacion: item.documento_estado_liquidacion,
                        tipo_codigo: item.tipo_codigo
                    });
                }
            }

            return result
        },
        async f_obtenerCodigos(tipo) {
            let me = this;
            me.arrayCodigos = [];
            try {
                const url = `devoluciones?getCodigosxDocumentoDevolucion=1&id_documento=${me.ObjectSelected.id}&porcliente=1&sinCombos=1`;
                const response = await me.$http.get(this.$server_url + url);
                me.arrayCodigos = response.data;
                me.arrayCodigosSinEmpresa = response.data[0].data.filter(item => !item.id_empresa);
                if (me.arrayCodigos.length == 0) {
                    me.m_message('No se encontraron códigos', 'warning');
                    return
                }
                if (tipo == 4) {
                    me.popupMostrarCodigos = false;
                } else {
                    me.popupMostrarCodigos = true;
                }
            } catch (e) {
                console.error("Error fetching codes:", e);
            }
        },
        generateCombos(){
            let me = this
            me.arrayErroresGenerateCombo = []
            let url = `devoluciones?generateCombos=1&id_devolucion=${ me.ObjectSelected.id }`
            this.$http.get(this.$server_url + url)
            .then(function (res) {

                me.f_imprimirCodigosBodega(me.ObjectSelected)
                if(res.data.status == 0 || res.data.status == '2'){
                  return;
                }
                me.arrayErroresGenerateCombo = res.data.noDisponibles
                if(me.arrayErroresGenerateCombo.length > 0){
                  me.m_message('Algunos códigos no se pudieron generar porque no están disponibles', 'warning');

                }
            })
            .catch(function (error) {
                console.log(error + ' error');
            })
        },
        async f_imprimirCodigosBodega(tr) {
            let me = this;
            me.ObjectSelected = tr;
            me.arrayCodigos = [];
            // me.arrayCodigosExclude  = [];
            me.arrayBodegaLiquidados = [];
            me.arrayBodegaActasRegalados = [];
            me.arrayBodegaActasLiquidados = [];
            me.arrayBodegaRegalados = [];
            me.arrayBodegaRegaladosLiquidados = [];
            me.arrayBodegaGuias = [];
            me.arrayBodegaCombos = [];
            me.arrayCodigosCombosRegalados = [];
            let getCombosNormales          = []
            let getCodigosCombosRegalados  = []
            try {
                const url = `devoluciones?getCodigosxDocumentoDevolucion=1&id_documento=${me.ObjectSelected.id}&individualSinCliente=1`;
                const response = await me.$http.get(this.$server_url + url);
                getCombosNormales         = response.data.filter(p => p.tipo_codigo == 1 && p.idtipodoc != 2);
                getCodigosCombosRegalados = response.data.filter(p => p.tipo_codigo == 1 && p.idtipodoc == 2);
                console.log("getCombos",getCombosNormales)
                console.log("getCodigosCombosRegalados",getCodigosCombosRegalados)
                me.arrayBodegaCombos            = me.f_obtenerCodigosXEmpresaDevueltosDescuento(getCombosNormales, '', 1)
                me.arrayCodigosCombosRegalados  = me.f_obtenerCodigosXEmpresaDevueltosDescuento(getCodigosCombosRegalados, '', 1)
                console.log("arrayBodegaCombosNormales",me.arrayBodegaCombos)
                console.log("arrayCodigosCombosRegalados",me.arrayCodigosCombosRegalados)
                let datos = response.data.filter(p => p.combo == null && p.tipo_codigo == 0);
                if (datos.length == 0) {
                    if(me.arrayBodegaCombos.length > 0 || me.arrayCodigosCombosRegalados.length > 0){
                       // si por lo menos hay combos dejar pasar
                    }else{
                        me.m_message('No se encontraron códigos', 'warning');
                        me.popupImprimir = true;
                        return
                    }
                }
                //excluir los codigos que tienen estado_liquidacion = 0, es decir que no se han liquidado
                //los codigos que tienen estado_liquidacion =2, es decir regalados
                //los codigos que tienen estado liquidacion 4 es decir codigos guias
                //Codigos normales
                let preArray = datos.filter((item) => {
                    return item.documento_estado_liquidacion != 0 && item.documento_estado_liquidacion != 2 && item.documento_estado_liquidacion != 4;
                });
                //Codigos liquidados
                let preArrayLiquidados = datos.filter((item) => {
                    return item.documento_estado_liquidacion == 0;
                });
                //Codigos actas regalados sin liquidar
                let preArrayActasRegalados = datos.filter((item) => {
                    return item.documento_estado_liquidacion == 2 && item.estado_codigo == 2 && item.documento_regalado_liquidado == 0;
                });
                //Codigos Actas regalados liquidados
                let preArrayActasLiquidados = datos.filter((item) => {
                    return item.documento_estado_liquidacion == 2 && item.estado_codigo == 2 && item.documento_regalado_liquidado == 1;
                });
                //Codigos regalados normales sin liquidar
                let preArrayRegalados = datos.filter((item) => {
                    return item.documento_estado_liquidacion == 2 && item.estado_codigo == 0 && item.documento_regalado_liquidado == 0;
                });
                //Codigos regalados normales liquidados
                let preArrayRegaladosLiquidados = datos.filter((item) => {
                    return item.documento_estado_liquidacion == 2 && item.estado_codigo == 0 && item.documento_regalado_liquidado == 1;
                });
                //GUIAS
                let preArrayGuias = datos.filter((item) => {
                    return item.documento_estado_liquidacion == 4;
                });
                //Codigo regalados sin liquidar
                me.arrayCodigos = me.f_obtenerCodigosXEmpresaDevueltos(preArray)
                me.arrayBodegaLiquidados = me.f_obtenerCodigosXEmpresaDevueltos(preArrayLiquidados)
                me.arrayBodegaActasRegalados = me.f_obtenerCodigosXEmpresaDevueltos(preArrayActasRegalados)
                me.arrayBodegaActasLiquidados = me.f_obtenerCodigosXEmpresaDevueltos(preArrayActasLiquidados)
                me.arrayBodegaRegalados = me.f_obtenerCodigosXEmpresaDevueltos(preArrayRegalados)
                me.arrayBodegaRegaladosLiquidados = me.f_obtenerCodigosXEmpresaDevueltos(preArrayRegaladosLiquidados)
                me.arrayBodegaGuias = me.f_obtenerCodigosXEmpresaDevueltos(preArrayGuias)
                //unir arrayBodegaCombos con arrayCodigos
                me.arrayCodigos = [...this.arrayCodigos, ...this.arrayBodegaCombos]
                console.log("arrayCodigos",me.arrayCodigos)
                me.popupImprimir = true;
            } catch (e) {
                console.error("Error fetching codes:", e);
            }
        },
        changeFinished(e) {
            let me = this
            me.arrayFinalizar = []
            me.arrayFinalizar = e
        },
        confirmFinalizado() {
            let me = this;
            if (me.arrayFinalizar.length == 0) {
                me.m_message('No se encontraron códigos', 'warning');
                return
            }

            // Validaciones para proceso nuevo (periodo >= 29)
            if (me.periodoNuevoModulo <= me.ObjectSelected.periodo_id) {
                // Validar factura_perseo y fecha_envio_perseo en cada empresa y documento
                let errores = [];

                me.arrayEmpresas.forEach(empresa => {
                    if (empresa.documentos && empresa.documentos.length > 0) {
                        empresa.documentos.forEach(doc => {
                            // Validar factura_perseo
                            if(doc.fecha_envio_perseo){
                                if (!doc.factura_perseo || doc.factura_perseo === 'Sin Factura') {
                                    errores.push(`El documento <b>${doc.documento}</b> no tiene factura de Perseo`);
                                }
                            }
                        });
                    }
                });

                // Si hay errores, mostrarlos en el popup y no continuar
                if (errores.length > 0) {
                    me.erroresValidacion = errores;
                    me.popupErroresValidacion = true;
                    return;
                }
            }

            me.popupMostrarCodigosAgrupados = false;
            me.$vs.dialog({
                title: 'Confirmar finalización',
                type: 'confirm',
                color: 'warning',
                text: '¿Estás seguro de que deseas finalizar este documento?',
                cancelText: 'Cancelar',
                acceptText: 'Aceptar',
                accept: () => {
                    me.f_finalizarDocumento();
                },
                cancel: () => {
                    me.popupMostrarCodigosAgrupados = true;
                }
            })
        },
        async f_finalizarDocumento() {
            let me = this;
            try {
                if (!this.ObjectSelected || !this.usuario) {
                    throw new Error('Datos requeridos no están disponibles');
                }
                const formData = new FormData();
                formData.append('id_documento', this.ObjectSelected.id);
                formData.append('id_usuario', this.usuario.idusuario);
                formData.append('iniciales', this.usuario.iniciales)
                formData.append('arrayEmpresas', JSON.stringify(this.arrayFinalizar))
                formData.append('periodo_id', me.ObjectSelected.periodo_id)
                formData.append('id_cliente', me.ObjectSelected.id_cliente)
                formData.append('finalizacion', 1);

                const url = 'devoluciones?updateDocumentoDevolucion=1';
                this.$vs.loading();

                const response = await this.$http.post(this.$server_url + url, formData);
                if (response.data.status == 0) {
                    this.m_message(response.data.message, 'danger');
                    return;
                }
                //ObjectSelect.estado = 2
                me.ObjectSelected.estado = 2
                this.m_message(response.data.message, 'success');
                this.popupMostrarCodigos = false;
                this.popupMostrarCodigosAgrupados = true;
                this.f_getDocuments();
            } catch (e) {
                console.error('Error finalizando documento:', e);
                this.m_message('Error al finalizar el documento', 'danger');
            } finally {
                this.$vs.loading.close();
            }
        },
        //METODOS PARA ELIMINAR
        confirmEliminarDocumento() {
            let me = this;
            me.$vs.dialog({
                title: 'Confirmar eliminación',
                type: 'confirm',
                color: 'warning',
                text: '¿Estás seguro de que deseas eliminar este documento?',
                cancelText: 'Cancelar',
                acceptText: 'Aceptar',
                accept: () => {
                    me.f_eliminarDocumento();
                },
                cancel: () => {}
            })
        },
        f_eliminarDocumento() {
            let me = this;
            let formData = new FormData();
            formData.append('id_documento', me.ObjectSelected.id);
            formData.append('eliminarDocumentoDevolucion', 1);

            me.$vs.loading(); // Mostrar loading al comenzar la solicitud

            this.$http.post(this.$server_url + 'metodosEliminarDevolucion', formData)
                .then(res => {
                    if (res.data.status == 0) {
                        me.m_message(res.data.message, 'danger');
                        return;
                    }
                    me.m_message(res.data.message, 'success');
                    me.f_getDocuments(); // Actualizar documentos si la eliminación fue exitosa
                })
                .catch(err => {
                    me.m_message('Error en la solicitud: ' + err.message, 'danger'); // Manejar el error
                })
                .finally(() => {
                    me.$vs.loading.close(); // Cerrar loading siempre
                });
        },
        changeFinishedDevolucion(status) {
            if (status) {
                // Si es true, cierra el popup
                this.popupMostrarCodigosSinEmpresa = false;
                this.f_getDocuments();
            } else {
                // Si es false, abre el popup
                this.popupMostrarCodigosSinEmpresa = true;
            }
        },
        //METODOS PARA REGRESAR A REVISADO
        openConfirmRegresarRevisado() {
            let me = this;
            me.$vs.dialog({
                title: 'Regresar a revisado',
                type: 'confirm',
                color: 'warning',
                text: '¿Estás seguro de que deseas regresar este documento' + me.ObjectSelected.codigo_devolucion + ' a revisado?',
                cancelText: 'Cancelar',
                acceptText: 'Aceptar',
                accept: () => {
                    me.f_regresarRevisado();
                },
                cancel: () => {}
            })
        },
        f_regresarRevisado() {
            let me = this;
            let formData = new FormData();
            formData.append('returnToReview', '1');
            formData.append('id_documento', me.ObjectSelected.id);
            me.$vs.loading(); // Mostrar loading al comenzar la solicitud

            this.$http.post(this.$server_url + 'devoluciones', formData)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status == 0) {
                        me.m_message(res.data.message, 'danger');
                        return;
                    }
                    me.m_message(res.data.message, 'success');
                    me.f_getDocuments(); // Actualizar documentos si la eliminación fue exitosa
                })
                .catch(err => {
                    me.$vs.loading.close();
                    me.m_message('Error al regresar a revisado', 'danger'); // Manejar el error
                })
        },
    }
};
</script>

<style scoped>
/* Contenedor principal */
.container {
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
    border-radius: 12px;
    background-color: #fdfdfd;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

/* Encabezado */
.filter-header {
    text-align: center;
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e0e0e0;
}

.filter-header p {
    font-size: 20px;
    font-weight: 600;
    color: #333;
    margin: 0;
}

/* Grid de las fechas */
.date-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
}

/* Campo de fecha */
.date-field {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.date-field p {
    font-size: 16px;
    font-weight: 500;
    color: #555;
    margin: 0;
}

/* Input de fecha */
.input-picker {
    padding: 10px;
    width: 100%;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    font-size: 14px;
    color: #333;
}

.input-picker:hover,
.input-picker:focus {
    border-color: #007bff;
    outline: none;
    box-shadow: 0 4px 8px rgba(0, 123, 255, 0.2);
}

/* Contenedor del botón */
.button-container {
    text-align: center;
    margin-top: 20px;
}

/* Botón de filtrar */
.filter-button {
    padding: 12px 24px;
    background-color: #007bff;
    color: #fff;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.filter-button:hover {
    background-color: #0056b3;
    /* Color más oscuro al hacer hover */
    box-shadow: 0 4px 12px rgba(0, 91, 187, 0.3);
}

.filter-button:focus {
    outline: none;
    box-shadow: 0 4px 12px rgba(0, 91, 187, 0.5);
}

.filter-button-historico {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    margin-left: 12px;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
    font-weight: 700;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
}

.filter-button-historico:hover {
    background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
    box-shadow: 0 8px 25px rgba(102, 126, 234, 0.6);
    transform: translateY(-2px);
}

.filter-button-historico:active {
    transform: translateY(0px);
    box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
}

.filter-button-historico i {
    margin-right: 8px;
}

.informacionformhijo {
    z-index: 51001;
}

.intercambio-container {
  display: flex;
  align-items: center; /* Alinea verticalmente */
  justify-content: space-between; /* Separa el texto a la izquierda y el botón a la derecha */
  width: 100%;
}

.info-text {
  flex-grow: 1; /* Ocupa el espacio disponible a la izquierda */
}
.popupPadre{
    z-index: 51001;
}

/* Popup de errores de validación - z-index alto para aparecer sobre otros popups */
.popup-errores-validacion {
    z-index: 99999 !important;
}

.popup-errores-validacion::v-deep .vs-popup {
    z-index: 99999 !important;
}

.popup-errores-validacion::v-deep .vs-popup--background {
    z-index: 99998 !important;
    background: rgba(0, 0, 0, 0.7) !important;
}

.popup-errores-validacion::v-deep .vs-popup--content {
    z-index: 100000 !important;
    max-width: 600px;
}

.popup-errores-validacion::v-deep .vs-popup--header {
    z-index: 100001 !important;
}

/* Alternativa con >>> para compatibilidad */
.popup-errores-validacion >>> .vs-popup {
    z-index: 99999 !important;
}

.popup-errores-validacion >>> .vs-popup--background {
    z-index: 99998 !important;
    background: rgba(0, 0, 0, 0.7) !important;
}

.popup-errores-validacion >>> .vs-popup--content {
    z-index: 100000 !important;
    max-width: 600px;
}

.popup-errores-validacion >>> .vs-popup--header {
    z-index: 100001 !important;
}

.errores-lista {
    max-height: 400px;
    overflow-y: auto;
    padding: 10px 0;
}

.error-item {
    transition: box-shadow 0.2s ease;
    display: flex;
    align-items: center;
    font-size: 14px;
    line-height: 1.6;
}

.error-item:hover {
    box-shadow: 0 2px 8px rgba(244, 67, 54, 0.2);
}

.error-item span {
    flex: 1;
}
</style>
