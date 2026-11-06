
<template>
  <div class="gestion-bodega-container">
    <div class="gestion-bodega-content">
      <!--BUSQUEDA DE INSTITUCIONES Y GESTION-->
      <GestionBodegaInstitucion
        ref="gestionBodegaInstitucion"
        :arrayPeriodos="arrayPeriodos"
        :arrayEmpresas="arrayEmpresas"
        :radioRegalado="radioRegalado"
        :observacion.sync="observacion"
        :institucionData="institucionData"
        @institucion-asignada="handleInstitucionAsignada"
        @documento-asignado="handleDocumentoAsignado"
        @institucion-limpiada="handleInstitucionLimpiada"
        @tipo-busqueda-cambiado="handleTipoBusquedaCambiado"
      />
      <!--FILTRO RADIOS-->
      <vs-row class="ml-2" style="margin-top: -15px;">
        <vs-divider v-if="activeTypes">Tipos</vs-divider>
        <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="12" v-if="activeTypes">
          <ul class="flex" style="flex-wrap: wrap;">
            <li class="m-2">
              <vs-radio
                v-model="radioRegalado"
                @input="codigosPerdidos=false;"
                vs-name="radios1Regalado"
                vs-value="0"
                :disabled="idtipodoc == 2 || (idtipodoc == 4 && ven_p_libros_obsequios > 0)">
                Usan y liquidan
              </vs-radio>
                <!-- <vs-radio
                v-model="radioRegalado"
                @input="codigosPerdidos=false;"
                vs-name="radios1Regalado"
                vs-value="0"
                :disabled="idtipodoc == 2">
                Usan y liquidan
              </vs-radio> -->
            </li>
            <li class="m-2">
              <vs-radio
                v-model="radioRegalado"
                @input="codigosPerdidos=false;"
                vs-name="radios1Regalado"
                vs-value="1"
                :disabled="idtipodoc == 1 || idtipodoc == 3">
                Regalado (No entra a la liquidación)
              </vs-radio>
            </li>
            <li class="m-2">
              <vs-radio
                v-model="radioRegalado"
                @input="codigosPerdidos=false;"
                vs-name="radios1Regalado"
                vs-value="2"
                :disabled="idtipodoc == 1 || idtipodoc == 3">
                Regalados y bloqueado (No usan y no liquidan)
              </vs-radio>
            </li>
            <!-- <li class="m-2" v-if="!activePaquete">
              <vs-radio v-model="radioRegalado" @input="codigosPerdidos=false;" vs-name="radios1Regalado" vs-value="3">BLOQUEADO (No usan y no liquidan)</vs-radio>
            </li>
            <li class="m-2" v-if="!activePaquete">
              <vs-radio v-model="radioRegalado" @input="codigosPerdidos=false;" vs-name="radios1Regalado" vs-value="4">GUIA</vs-radio>
            </li> -->
          </ul>
        </vs-col>
      </vs-row>
      <!--SI ES GUIA GUARDAR PERIODO Y ASESOR-->
      <vx-card title="Datos GUIA" v-if="radioRegalado == 4">
        <div class="vx-row">
          <div class="vx-col w-1/2">
            <p>Seleccione el período <span class="text-danger">(Obligatorio)</span></p>
            <v-select :options="arrayPeriodos" :reduce="arrayPeriodos => arrayPeriodos" label="periodoescolar" class="w-full mt-2" v-model="periodoSelect" />
          </div>
          <div class="vx-col w-1/2">
            <p>Seleccione el asesor que va recibir las guias <span class="text-danger">(Obligatorio)</span></p>
            <v-select :options="arrayAsesores" :reduce="arrayAsesores => arrayAsesores.id_asesor" label="asesor" class="w-full mt-2" v-model="asesorSelect" />
          </div>
        </div>
      </vx-card>
      <!--DOCUMENTOS VENTAS-->
      <vx-card title="Documentos de venta" v-if="institucion_id > 0 && radioRegalado != 4 && tipoBusqueda == 'institucion'" class="mt-2">
        <!-- Mensaje informativo cuando se busca por documento -->
        <vs-alert v-if="tipoBusqueda == 'documento'" color="primary" class="mb-3">
          <i class="fa fa-info-circle"></i>
          Los campos están bloqueados porque el documento fue seleccionado automáticamente desde la búsqueda.
        </vs-alert>

        <span v-if="comboSelected || tipoComboImportacion == 1">
          <!--Obligatorio seleccionar un documento prefactura / nota si se selecciona un combo-->
          <p v-if="!proforma.proforma" class="text-danger"><i class="fa-solid fa-triangle-exclamation"></i> Obligatorio seleccionar un documento prefactura / nota si se selecciona un combo</p>
        </span>
        <div class="vx-row">
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
            <small>Empresa:</small>
            <v-select
              :options="arrayEmpresas"
              @input="comboSelected='';f_listadoProformasAgrupadas();"
              :reduce="arrayEmpresas => arrayEmpresas.id"
              label="nombre"
              class="w-full"
              v-model="proforma.empresa"
              :disabled="tipoBusqueda == 'documento'" />
          </div>
          <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
            <small>Documentos:</small>
            <v-select
              :options="arrayProformas"
              :reduce="arrayProformas => arrayProformas.ven_codigo"
              label="ven_codigo"
              class="w-full"
              v-model="proforma.proforma"
              @input="comboSelected='';f_setTipoVentaFromDocumento();f_validarComboDocumento();validacionDocumentoNoCombos();"
              :disabled="tipoBusqueda == 'documento'" />
          </div>
        </div>
      </vx-card>
      <!--COMBOS-->
      <vx-card title="Sección Combos" subtitle="(Seleccione una empresa y un documento para buscar los combos)" class="mt-2" v-if="tipoBodega == 4 && nombreInstitucion && tableData.length > 0">
        <div>
          <ul class="flex">
            <li class="mr-3">
              <p>Tipo de combo:</p>
            </li>
            <li class="mr-3">
              <vs-radio v-model="tipoComboImportacion" vs-name="radios1tipoComboImportacion" @input="comboSelected='';errorComboEnDocumento=false;f_validarComboDocumento();" vs-value="0">Se tomara la columna codigo del excel</vs-radio>
            </li>
            <li>
              <vs-radio v-model="tipoComboImportacion" @input="comboSelected='';errorComboEnDocumento=false;getCombos();f_validarComboDocumento();" vs-name="radios1tipoComboImportacion" vs-value="1">Se tomara la columna codigo y la columna combo del excel</vs-radio>
            </li>
          </ul>
        </div>
        <div class="vx-row" v-if="tipoComboImportacion == 0">
          <div v-if="tipoBodega == 4">
            <p v-if="!comboSelected" class="text-danger ml-3">!Es obligatorio elegir un combo del libro</p>
          </div>
          <div class="vx-col w-full sm:w-full">
            <small>Combo del libro:</small>
            <v-select :options="arrayCombos" :reduce="arrayCombos => arrayCombos.pro_codigo" label="combolibro" class="w-full" v-model="comboSelected" @input="f_validarComboDocumento();" />
          </div>
        </div>
      </vx-card>
      <!--FIN PERSEO-->

      <!--AREA DE IMPORTACION-->
      <div v-if="arrayInformacionDocumento.length > 0 || tableData.length > 0 || arrayInformacionDocumento.length == 0" class="mb-2 mt-3">
        <!-- Sección compacta cuando hay códigos cargados -->
        <div v-if="tableData.length > 0" class="seccion-importacion-compacta">
          <div class="header-importacion-compacta">
            <div class="info-excel-cargado">
              <i class="fa fa-check-circle text-success"></i>
              <span><strong>{{ titleImportacion }}</strong> - {{ totalCodigos }} códigos listos</span>
            </div>
            <div class="acciones-compactas">
              <vs-button size="small" color="warning" type="filled" @click="limpiarExcel()">
                <i class="fa fa-file-upload"></i> Subir otro archivo
              </vs-button>
              <vs-button v-if="tipoBodega != 4 && arrayCodigosEncontrados.length > 0"
                size="small" color="primary" type="filled" @click="popupDetalleCodigos = true">
                <i class="fa fa-eye"></i> Detalle códigos
              </vs-button>
              <vs-button v-if="tipoBodega == 4 && arrayAgrupadosCombos.length > 0"
                size="small" color="primary" type="filled" @click="popupDetalleCombos = true">
                <i class="fa fa-cubes"></i> Detalle combos
              </vs-button>
              <vs-button size="small" color="success" type="filled" v-if="radioRegalado!=='' && !documentoYaDespachado" @click="validacionDocumentoNoCombos();openConfirm(0)">
                <i class="fa fa-save"></i> Importar códigos
              </vs-button>
              <vs-button size="small" color="success" type="filled" v-if="documentoYaDespachado" @click="confirmarDespacho()">
                <i class="fa fa-truck"></i> Iniciar proceso de empaque
              </vs-button>
            </div>
          </div>

          <!-- Mensaje cuando todos los items ya están despachados -->
          <div v-if="documentoYaDespachado" class="alert-despachado-completo mt-2">
            <i class="fa fa-check-circle"></i>
            Los items del documento han sido enviados a empacado en su totalidad. Presione el botón <strong>Enviar a empacado el documento</strong>.
          </div>
          <!-- Tabla cruce: facturado vs por subir -->
          <div v-if="arrayInformacionDocumento.length > 0 && (arregloFormatoSend.length > 0 || arrayCodigosEncontrados.length > 0)" class="tabla-cruce-wrapper mt-3">
            <div class="cruce-filtro-row">
              <label class="cruce-filtro-label">
                <input type="checkbox" v-model="soloMostrarSubir" />
                <span>Mostrar solo los que se van a subir</span>
              </label>
              <label v-if="hayItemsSobrantes" class="cruce-filtro-label ml-3">
                <input type="checkbox" v-model="soloMostrarSobrantes" />
                <span class="cruce-filtro-danger">⚠ Mostrar items que sobrepasan el documento</span>
              </label>
            </div>
            <table class="tabla-cruce">
              <thead>
                <tr>
                  <th style="width:30px;"></th>
                  <th>Código</th>
                  <th>Producto</th>
                  <th class="text-center">Solicitado</th>
                  <th class="text-center">Subido</th>
                  <th class="text-center" style="display:none">Disponible</th>
                  <th class="text-center">Por subir</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="(item, idx) in arrayInformacionDocumento">
                  <tr v-if="cruceRowVisible(item)" :key="idx" :class="getCruceRowClass(item)">
                    <td class="text-center cruce-check-cell">
                      <i v-if="getCruceCount(item) > 0 && !isSobrante(item)" class="fa fa-check-circle cruce-icon-ok"></i>
                      <i v-else-if="isSobrante(item)" class="fa fa-exclamation-circle cruce-icon-danger"></i>
                      <i v-else class="fa fa-circle-o cruce-icon-empty"></i>
                    </td>
                    <td>
                      <strong>{{ item.pro_codigo }}</strong>
                    </td>                    <td>
                      <span class="cruce-nombre">{{ item.pro_nombre }}</span>
                      <span v-if="item.ifcombo == 1" class="badge-cruce-combo ml-1"><i class="fa fa-cubes"></i> Combo</span>
                    </td>
                    <td class="text-center"><strong>{{ item.det_ven_cantidad }}</strong></td>
                    <td class="text-center">
                      <span :class="item.det_ven_cantidad_despacho >= item.det_ven_cantidad ? 'cruce-ok' : 'cruce-warn'">
                        {{ item.det_ven_cantidad_despacho }}
                      </span>
                    </td>
                    <td class="text-center" style="display:none">
                      <strong :class="(item.det_ven_cantidad - item.det_ven_cantidad_despacho) > 0 ? 'cruce-disponible' : 'cruce-warn'">
                        {{ item.det_ven_cantidad - item.det_ven_cantidad_despacho }}
                      </strong>
                    </td>
                    <td class="text-center">
                      <strong :class="isSobrante(item) ? 'cruce-subir-danger' : getCruceCount(item) > 0 ? 'cruce-subir-active' : 'cruce-subir-zero'">
                        {{ getCruceCount(item) }}
                      </strong>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>

          <!-- Botones de errores en línea -->
          <div v-if="arregloProblemasDiagnostico.length > 0 || arregloProblemasPaquete.length > 0 || arrayCodigosNoEnDocumento.length > 0 || arrayErroresValidacionCombos.length > 0"
               class="botones-errores-compactos mt-2">
            <vs-button v-if="arregloProblemasDiagnostico.length > 0 || arregloProblemasPaquete.length > 0"
                       size="small" color="danger" type="flat" @click="popupProblemasDiagnostico = true;">
              <i class="fa-solid fa-triangle-exclamation"></i> Errores ({{ arregloProblemasDiagnostico.length + arregloProblemasPaquete.length }})
            </vs-button>
            <vs-button v-if="arrayCodigosNoEnDocumento.length > 0"
                       size="small" color="danger" type="flat" @click="popupCodigosGeneralesError = true;">
              <i class="fa-solid fa-file-excel"></i> Errores doc. ({{ arrayCodigosNoEnDocumento.length }})
            </vs-button>
            <vs-button v-if="arrayErroresValidacionCombos.length > 0"
                       size="small" color="danger" type="flat" @click="popupMostrarErroresCombosNoCoindicen = true;">
              <i class="fa-solid fa-layer-group"></i> Errores combos ({{ arrayErroresValidacionCombos.length }})
            </vs-button>
          </div>
        </div>

        <!-- Sección normal cuando NO hay códigos cargados -->
        <div v-else align="center">
          <div class="vx-col w-full">
            <p style="color:#2D9ADA;font-size:13px;">
              <i class="fa fa-file" aria-hidden="true"></i> Importación de códigos <span style="font-weight: 600;">(máx. 1500 registros)</span>
            </p>
          </div>
          <import-excel :onSuccess="loadDataInTable" class="mb-3" />
        </div>

        <!---CONTADOR DE CODIGOS INGRESADOS-->
        <vs-row v-if="codigosPerdidos == true" class="mt-5">
          <div v-if="tipoBodega == '1' || tipoBodega == '2'" style="width: 100%;" class="flex justify-center">
            <ul class="features flex justify-center">
              <li>
                <span class="icon">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                  </svg>
                </span>
                <span><strong>Códigos Activación Importados: {{ contadorA }} </strong></span>
              </li>
              <li>
                <span class="icon">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                  </svg>
                </span>
                <span><strong>Códigos Diágnostico Importados: {{ contadorD }} </strong></span>
              </li>
              <li>
                <span class="icon">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                  </svg>
                </span>
                <span><strong>Total Importados: {{ contadorA+ contadorD }} </strong></span>
              </li>
              <li v-if="sumaNoIngresados > 0">
                <span class="icon">
                  <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 0h24v24H0z" fill="none"></path>
                    <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                  </svg>
                </span>
                <span><strong class="text-danger">Códigos No ingresados: {{ sumaNoIngresados }} </strong></span>
              </li>
            </ul>
          </div>
          <vs-col v-if="tipoBodega == '0'" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-alert active="true" >
                Se importo   {{ porcentaje }} códigos
                <vs-button v-if="codigosSinCodigoUnion.length > 0" @click="popupProblemasCodigosUnion = true;" color="primary" type="border">Mostrar códigos sin código unión</vs-button>
            </vs-alert>
          </vs-col>
        </vs-row>
        <!--RESUMEN PAQUETES-->
        <div v-if="codigosPerdidos == true && (tipoBodega == '3' || tipoBodega == '4')">
          <vs-card v-if="arregloErroresPaquetes.length > 0">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                <vs-list>
                  <p>Cantidad <span>{{ arregloErroresPaquetes.length }}</span></p>
                    <vs-list-header icon="supervisor_account" :title="'Hubo problemas con algunos '+(tipoBodega == 3 ? 'paquetes' : 'combos')"></vs-list-header>
                    <vs-list-item :key="indextr" v-for="(tr, indextr) in arregloErroresPaquetes" icon="check" :title="tr.paquete" >
                      <p> {{ tr.problema }}</p>
                    </vs-list-item>
                </vs-list>
            </vs-col>
          </vs-card>
          <div>
            <p class="font-bold">Importado como: {{ titleImportacion }}</p>
          </div>
          <TableResumenPaqueteVue
          :arregloResumen="arregloResumen"
          :arregloFormatoSend="arregloFormatoSend" class="mt-1"
          :tipoDescripcion="tipoBodega == 3 ? 'Paquete' : 'Combo'"
          />
        </div>
         <!---FIN CONTADOR DE CODIGOS INGRESADOS-->
        <vs-row >
          <vs-col v-if="codigosNoCambiados.length > 0" vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
            <vs-list>
              <vs-list-header icon="supervisor_account" title="Códigos que no se pudieron cambiar"></vs-list-header>
              <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoCambiados" icon="check" :title="tr.codigo" >
                <p v-if="tr.mensaje !='0'"> {{ tr.mensaje }}</p>
              </vs-list-item>
            </vs-list>
          </vs-col>
          <vs-col v-if="codigosNoExisten.length > 0" vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
            <vs-list>
              <vs-list-header icon="supervisor_account" title="Códigos que no existen"></vs-list-header>
              <vs-list-item :key="indextr" v-for="(tr, indextr) in codigosNoExisten" icon="check" :title="tr.codigo" >
              </vs-list-item>
            </vs-list>
          </vs-col>
        </vs-row>
        <vs-row>
        </vs-row>
        <vs-row v-if="codigosPerdidos == true">
          <vx-card
            title="Codigos que no se pudieron guardar"
            v-if="codigoConProblemas.length > 0"
            >
            <TableRadiosCodigosListaVue :arregloCodigos="codigoConProblemas" :openModal="Number(1)" :ifErrorProforma="Number(1)"/>
          </vx-card>
        </vs-row>
      </div>
      <vx-card v-if="tableData.length && header.length">
        <vs-table stripe pagination :max-items="10" search :data="tableData">
          <template slot="header">
            <h4>Códigos a subir {{tableData.length}}</h4>
          </template>
          <template slot="thead">
            <vs-th :sort-key="heading" v-for="heading in header" :key="heading">{{ heading }}</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="col" v-for="(col, indexcol) in data[indextr]" :key="indexcol + col">
                {{ col }}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vx-card>
    </div>
    <!--MODALES-->
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
          </div>
        </div>
      </div>
    </vs-popup>
    <!--MODAL PARA CONFIRMAR-->
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
      <div v-if="modalConfirm" class="modal-confirm-content">
        <!-- Título -->
        <div class="modal-header-section">
          <p class="text-2xl font-bold text-center mb-2">{{ titleImportacion }}</p>
          <vs-divider></vs-divider>
        </div>

        <!-- Acción -->
        <div class="modal-info-card accion-card">
          <div class="info-label">Acción:</div>
          <div class="info-value">
            <span v-if="radioRegalado == '0'">Usan y liquidan</span>
            <span v-if="radioRegalado == '1'">Regalado no entra a liquidación</span>
            <span v-if="radioRegalado == '2'">Regalados y bloqueados (No usan ni liquidan)</span>
            <span v-if="radioRegalado == '3'">Bloqueados (No usan ni liquidan)</span>
            <span v-if="radioRegalado == '4'">GUIA</span>
          </div>
        </div>

        <!-- Códigos y Periodo -->
        <div class="modal-info-card">
          <div class="info-row">
            <span class="info-label">Total de códigos:</span>
            <span class="info-value text-success font-bold">{{ totalCodigos }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Periodo:</span>
            <span class="info-value text-danger font-bold" v-if="radioRegalado == 4">{{ periodoSelect.periodoescolar }}</span>
            <span class="info-value text-danger font-bold" v-else>{{ periodoDescripcion }}</span>
          </div>
        </div>

        <!--si sube un documento proforma-->
        <div v-if="proforma.proforma" class="modal-info-card documento-card">
          <div class="card-title">
            <i class="fa fa-file-text-o mr-2"></i>Información del Documento
          </div>
          <div class="info-row">
            <span class="info-label">Documento:</span>
            <span class="info-value text-danger font-bold">{{ proforma.proforma }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Empresa:</span>
            <span class="info-value text-danger font-bold">{{ arrayEmpresas.find(p => p.id == proforma.empresa).nombre }}</span>
          </div>
          <div class="info-row">
            <span class="info-label">Tipo de venta:</span>
            <span class="info-value font-bold">
              <span class="badge-venta success" v-if="venta_estado == 1">
                <i class="fa fa-check-circle"></i> Venta directa
              </span>
              <span class="badge-venta primary" v-else-if="venta_estado == 2">
                <i class="fa fa-list"></i> Venta lista
              </span>
              <span class="badge-venta warning" v-else>
                <i class="fa fa-exclamation-triangle"></i> No seleccionado
              </span>
            </span>
          </div>
          <!-- Usuario que escanea (solo para AdminBodega) -->
          <div v-if="(AdminBodega || userRoot) && usuario_escaneo" class="info-row">
            <span class="info-label">Usuario escaneador:</span>
            <span class="info-value font-bold">
              <span class="badge-venta info">
                <i class="fa fa-user"></i> {{ usuario_escaneo }}
              </span>
            </span>
          </div>
        </div>

        <!--si seleccion un combo-->
        <div v-if="comboSelected" class="modal-info-card">
          <div class="info-row">
            <span class="info-label">Combo a asignar:</span>
            <span class="info-value text-danger font-bold">{{ comboSelected }}</span>
          </div>
        </div>

        <!--tipoComboImportacion = 1 -->
        <div v-if="tipoComboImportacion == 1" class="modal-info-card">
          <div class="info-row">
            <span class="info-label">Combo a asignar:</span>
            <span class="info-value text-danger">Se añadirá el combo del libro que se encuentra en la columna de combo de su archivo</span>
          </div>
        </div>

        <!---CODIGO BLOQUEADOS-->
        <div v-if="arrayCodigosBloqueados.length > 0 && radioRegalado == '0'" class="mt-3">
          <vs-alert color="danger" active="true">
            <span>Hay códigos que están bloqueados (No regalados)</span>
          </vs-alert>
          <TableReutilizableVue
            :title="'Codigos Bloqueados'"
            :headers="['codigo']"
            :fieldKeys="['codigo']"
            :ifexportar="Number(1)"
            :maxItems="5"
            :tableData="arrayCodigosBloqueados"
          />
        </div>

        <!-- Botón confirmar -->
        <div class="w-full mt-4" align="center">
          <vs-button class="mb-2" color="danger" type="gradient" size="large" @click="procesarPagos()">
            <i class="fa fa-check mr-2"></i> Confirmar
          </vs-button>
        </div>
      </div>
    </vs-popup>
    <!--MODAL PROBLEMAS DIAGNOSTICO O PAQUETES-->
    <vs-popup fullscreen small title="Problemas con los códigos de su archivo" :active.sync="popupProblemasDiagnostico">
      <div v-if="tipoBodega == 1 || tipoBodega == 2">
        <TableProblemasDiagnosticoVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasDiagnostico="arregloProblemasDiagnostico"/>
      </div>
      <div v-if="tipoBodega == 3 || tipoBodega == 4">
        <TablaErroresPaqueteVue v-if="popupProblemasDiagnostico" :items="10" :arregloProblemasPaquete="arregloProblemasPaquete" :tipoImortacion="tipoBodega == 3 ? 'paquete' : 'combo'"/>
      </div>
    </vs-popup>
    <vs-popup small title="Codigos diágnostico no existen" :active.sync="popupCodigosDiagnosticoNoexisten">
      <TableProblemasDiagnosticoVue v-if="popupCodigosDiagnosticoNoexisten" :items="5" :arregloProblemasDiagnostico="arregloCodigosDiagnosticoNoexisten"/>
    </vs-popup>
    <!--MODAL CONFIRMAR TIPO DE IMPORTADO-->
    <vs-popup small title="Tipo de Importación" :active.sync="popupConfirmTipoImportado" @close="popupConfirmTipoImportado=true;">
      <div v-if="popupConfirmTipoImportado">
        <TipoImportacionVue v-if="popupConfirmTipoImportado" @changeTipo="changeTipo" :tableData="tableData"/>
        <div class="flex justify-center mt-2">
          <vs-button class="mt-2" color="danger" @click="popupConfirmTipoImportado=false;f_limpiarCancelar();"><i class="fa-solid fa-circle-xmark"></i> Cancelar</vs-button>
        </div>
      </div>
    </vs-popup>
      <!--MODAL PARA MOSTRAR CODIGOS SIN CODIGO UNION-->
      <vs-popup classContent="popup-example" title="Códigos sin código Unión" fullscreen :active.sync="popupProblemasCodigosUnion">
      <gestionCodigosLista :arregloCodigos="codigosSinCodigoUnion" :openModal="Number(0)"/>
    </vs-popup>
    <!--MODAL PARA MOSTRAR ERRORES COMBOS NO COINDICEN-->
    <vs-popup title="Errores en combos" :active.sync="popupMostrarErroresCombosNoCoindicen" fullscreen>
      <!--table reutilizable-->
      <TableReutilizableVue

        :title="'Errores en combos'"
        :headers="['combo etiqueta','combo del libro', 'Libros del combo', 'problema']"
        :fieldKeys="['codigoCombo', 'combo', 'codigos_combos', 'error']"
        :ifexportar="Number(1)"
        :maxItems="5"
        :tableData="arrayErroresValidacionCombos"
      />
    </vs-popup>
    <!--MODAL PARA MOSTRAR ERRORES EN CODIGOS NO ENCONTRADOS EN EL DOCUMENTO-->
    <vs-popup title="Códigos no encontrados en el documento" :active.sync="popupCodigosGeneralesError" fullscreen>
      <!--table reutilizable-->
      <TableReutilizableVue

        :title="'Códigos no encontrados en el documento'"
        :headers="['Código','Mensaje']"
        :fieldKeys="['codigo','message']"
        :ifexportar="Number(1)"
        :maxItems="5"
        :tableData="arrayCodigosNoEnDocumento"
      />
    </vs-popup>

    <!-- Modal estado de escaneo -->
    <GestionBodegaResultadoDocumento
      v-if="popupEstadoEscaneo"
      :active.sync="popupEstadoEscaneo"
      :escaneoFinalizado="escaneoFinalizado"
      :documentoVenta="documentoVentaEscaneado"
      :informacionDocumento="arrayInformacionDocumento"
      :mostrarMensajeProblemas="codigoConProblemas.length > 0"
      @despachar="despacharDocumento"
      @cerrar="handleCerrarModalEscaneo"
    />

    <!-- Modal de selección de sesiones de escaneo para documentos seleccionados manualmente -->
    <GestionbodegaEscaneo
      :active.sync="modalSesionesEscaneoDocumento"
      :sesionesEscaneo="sesionesEscaneoDisponiblesDocumento"
      @sesion-seleccionada="handleSesionSeleccionadaDocumento"
    />
    <!-- Modal detalle de códigos -->
    <GestionBodegaDetalleCodigos
      :active.sync="popupDetalleCodigos"
      :codigos="arrayCodigosEncontrados"
    />

    <!-- Modal detalle de combos -->
    <GestionBodegaDetalleCombos
      :active.sync="popupDetalleCombos"
      :combos="arrayAgrupadosCombos"
    />

  </div>
</template>
<script>
import gestionCodigosLista from '../../gestionCodigosLista.vue'
import ImportExcel from '@/views/codigos/components/importExcel'
import vSelect from 'vue-select'
import TableProblemasDiagnosticoVue from '../../TableProblemasDiagnostico.vue'
import TipoImportacionVue from '@/views/codigos/components/utils/components/GestionLiquidacion/TipoImportacion'
import GestionBodegaInstitucion from './GestionBodegaInstitucion.vue'
import GestionbodegaEscaneo from './GestionbodegaEscaneo.vue'
import GestionBodegaResultadoDocumento from './GestionBodegaResultadoDocumento.vue'
import GestionBodegaDetalleCodigos from './GestionBodegaDetalleCodigos.vue'
import GestionBodegaDetalleCombos from './GestionBodegaDetalleCombos.vue'
const TablaErroresPaqueteVue             = () => import('@/views/codigos/paquetes/components/TablaErroresPaquete')
const TableResumenPaqueteVue             = () => import('@/views/codigos/components/utils/components/GestionLiquidacion/TableResumenPaquete')
const TableRadiosCodigosListaVue         = () => import('./TableRadiosCodigosLista.vue')
const TableReutilizableVue               = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
import PeriodoRepository from '@/repositories/PeriodoRepository'
import PedidosRepository from '../../../../../../repositories/PedidosRepository'
import LibroRepository from '../../../../../../repositories/LibroRepository'
import Generalmix from '../../../../../../mixins/Generalmix'
import Paquetemix from '../../../../../../mixins/Paquetemix'
  import {
    mapState
} from "vuex";
export default {
  mixins: [Generalmix, Paquetemix],
  components: {
    ImportExcel,
    vSelect,
    gestionCodigosLista,
    TableProblemasDiagnosticoVue,
    TipoImportacionVue,
    TablaErroresPaqueteVue,
    TableResumenPaqueteVue,
    TableRadiosCodigosListaVue,
    TableReutilizableVue,
    GestionBodegaInstitucion,
    GestionbodegaEscaneo,
    GestionBodegaResultadoDocumento,
    GestionBodegaDetalleCodigos,
    GestionBodegaDetalleCombos,
  },
  data () {
    return {
      codigosPerdidos:false,
      tableData: [],
      header: [],
      sheetName: '',
      usuario: [],
      modalConfirm: false,
      modalErrores: false,
      errores: [],
      cedulas_no_encontradas: [],
      codigosNoCambiados:[],
      arregloCodigosDiagnosticoNoexisten:[],
      popupCodigosDiagnosticoNoexisten:false,
      porcentaje:0,
      nombreInstitucion:'',
      EstadoConfiguracion:0,
      institucion_id:0,
      periodo_id:0,
      id_institucionPedido: null,
      radioRegalado:'0',
      venta_estado:0,
      cantidadNoExisten:0,
      error:false,
      periodoDescripcion:'',
      ciudadDescripcion:'',
      factura:'',
      checkFactura:true,
      tipoBusqueda:'documento', // Tipo de búsqueda actual (documento o institucion)
      periodo_configurado: null, // Periodo configurado cuando EstadoConfiguracion = 1
      idtipodoc: null, // Tipo de documento
      ven_p_libros_obsequios:null,//obsequios hijos docentes
      institucionData: { // Datos reactivos para el card de institución
        nombreInstitucion: '',
        periodoDescripcion: '',
        venta_estado: 0,
        empresa: '',
        documento: '',
        pedido_codigo: null,
        fecha_inicio_escaneo: null,
        observaciones_escaneo: null
      },
      //VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      tipoBodega:0,
      arregloProblemasDiagnostico:[],
      popupProblemasDiagnostico:false,
      popupConfirmTipoImportado:false,
      contadorA:0,
      contadorD:0,
      titleImportacion:'Importacion Sticker (Activación)',
      //FIN VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      //variables para codigos union
      codigosSinCodigoUnion:[],
      popupProblemasCodigosUnion:false,
      //fin variables para codigos union
      totalCodigos:0,
      //variables paquete
      cantidadPaquete:20,
      //FIN VARIABLES PARA TIPO DE ACTIVACION O DIAGNOSTICO
      //VARIABLES PARA ERRORES CODIGOS PAQUETES
      arregloProblemasPaquete:[],
      arregloFormatoSend:[],
      arregloFormatoSendOriginal:[],
      arrayPaquetes:[],
      arregloErroresPaquetes:[],
      codigoConProblemas:[],
      //FIN VARIABLES PARA ERRORES CODIGOS PAQUETES
      //fin variables paquetes
      observacion:'',
      activeTypes:false,
      activePaquete:false,
      //VARIABLES PARA PERIODOS EN EL ROOT
      arrayPeriodos:[],
      //FIN VARIABLES PARA PERIODOS EN EL ROOT
      arrayProformas:[],
      arrayEmpresas:[],
      proforma:{
        empresa:'',
        proforma:''
      },
      //variables para guias
      arrayAsesores:[],
      asesorSelect:'',
      //fin variables para guias
      //variables combos
      popupMostrarErroresCombosNoCoindicen:false,
      arrayAgrupadosCombos:[],
      arrayAllCombos:[],
      arrayCombos:[],
      comboSelected:'',
      tipoComboImportacion:0,
      errorCombos:false,
      errorComboEnDocumento:false,
      arrayErroresValidacionCombos:[],
      //fin variables combos
      //variables para previsualizar
      CodigosNoEncontrados:[],
      arrayCodigosEncontrados:[],
      //fin variables para previsualizar
      arrayCodigosBloqueados:[],
      errorDocumentos:false,
      codigosNoExisten:[],
      arrayCodigosNoEnDocumento:[],
      popupCodigosGeneralesError:false,
      //variables para modal de escaneo
      popupEstadoEscaneo:false,
      escaneoFinalizado:false,
      totalCodigosReal:0,
      totalCodigosSubidos:0,
      documentoVentaEscaneado:'',
      empresaVentaEscaneada:'',
      escaneoSelected: null, // ID de la sesión de escaneo seleccionada
      usuario_escaneo: null, // Nombre del usuario que escanea
      comentarioDespacho: '', // Comentario para el despacho del documento
      arrayInformacionDocumento: [], // Información detallada de los productos del documento
      //variables para modal de selección de sesiones desde f_setTipoVentaFromDocumento
      modalSesionesEscaneoDocumento: false,
      sesionesEscaneoDisponiblesDocumento: [],
      documentoTemporalProforma: null,
      //variable para controlar visibilidad de área de importación
      mostrarAreaImportacion: false,
      soloMostrarSubir: false,
      soloMostrarSobrantes: false,
      popupDetalleCodigos: false,
      popupDetalleCombos: false,
    }
  },
  created(){
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.codigosPerdidos = false
  },
  mounted(){
    let me = this;
    me.obtenerPeriodos()
    me.getAsesores()
    me.getCombos()
    me.getEmpresas()
    me.ejecutarContratosDocumentos()
  },
  watch:{
    factura(newValue, oldValue){
      if(newValue !== "" && newValue !== oldValue){
        const cleanedValue = newValue.replace(/\s/g, "");
        if(cleanedValue !== newValue) {
          this.$nextTick(() => {
            this.factura = cleanedValue;
          });
        }
      }
    }
  },
  computed:{
    sumaNoIngresados(){
      let me = this;
      if(me.codigosPerdidos){
        let total      = me.totalCodigos - (me.contadorA + me.contadorD)
        return total
      }
    },
    porSubirPorLibro() {
      const result = {}
      if (this.tipoBodega !== 4) {
        this.arrayCodigosEncontrados.forEach(c => {
          const key = c.codigo_liquidacion
          if (key) result[key] = (result[key] || 0) + 1
        })
      }
      return result
    },
    itemsConSobrante() {
      if (!this.arrayInformacionDocumento.length) return []
      // Si el documento ya está completamente despachado, no hay sobrantes reales
      if (this.documentoYaDespachado) return []
      return this.arrayInformacionDocumento.filter(item => {
        const disponible = item.det_ven_cantidad - item.det_ven_cantidad_despacho
        return disponible > 0 && this.getCruceCount(item) > disponible
      })
    },
    hayItemsSobrantes() {
      return this.itemsConSobrante.length > 0
    },
    documentoYaDespachado() {
      if (!this.arrayInformacionDocumento.length) return false
      return this.arrayInformacionDocumento.every(item =>
        item.det_ven_cantidad_despacho >= item.det_ven_cantidad
      )
    },
    ...mapState(["auth",'userRoot','susuario','groupFacturador','AdminBodega','userBodegaNormal']),

  },
  methods: {
    confirmarDespacho() {
      let me = this
      me.$vs.dialog({
        type: 'confirm',
        color: 'warning',
        title: 'Confirmar inicio de empaque',
        text: `¿Está seguro de iniciar el proceso de empaque para el documento ${me.documentoVentaEscaneado || me.proforma.proforma}? Esta acción no se puede deshacer.`,
        acceptText: 'Sí, iniciar proceso de empaque',
        cancelText: 'Cancelar',
        accept: () => { me.despacharDocumento() }
      })
    },
    getCruceCount(item) {
      if (this.tipoBodega == 4) {
        if (this.tipoComboImportacion == 0) {
          return this.comboSelected === item.pro_codigo ? this.arregloFormatoSend.length : 0
        }
        return this.arregloFormatoSend.filter(c => c.combo === item.pro_codigo).length
      }
      return this.porSubirPorLibro[item.pro_codigo] || 0
    },
    isSobrante(item) {
      if (this.documentoYaDespachado) return false
      const disponible = item.det_ven_cantidad - item.det_ven_cantidad_despacho
      return disponible > 0 && this.getCruceCount(item) > disponible
    },
    cruceRowVisible(item) {
      if (this.soloMostrarSobrantes) return this.isSobrante(item)
      if (this.soloMostrarSubir) return this.getCruceCount(item) > 0
      return true
    },
    getCruceRowClass(item) {
      if (this.isSobrante(item)) return 'cruce-row-danger'
      const count = this.getCruceCount(item)
      return count > 0 ? 'cruce-row-active' : 'cruce-row-inactive'
    },
    getEmpresas(){
      let me = this;
      let url = `${this.$server_url}empresa2`
      this.$http.get(url).then(function (response) {
        me.arrayEmpresas = response.data;
      }).catch(function (error) {
        console.log(error);
      });
    },
    getCombos(){
      let me = this
      LibroRepository.getAllCombos().then(r => { this.arrayAllCombos = r.data });
    },
    obtenerPeriodos(){
      let me = this;
      PeriodoRepository.getPeriodos().then( p => { me.arrayPeriodos = p.data; });
    },
    getAsesores(){
      let me = this
      return PedidosRepository.rep_getAsesores().then(r => { me.arrayAsesores = r.data } )
    },
    ejecutarContratosDocumentos(){
      let me = this;
      const ids = [26, 27, 5, 7];

      ids.forEach(id => {
        let url = `${this.$server_url}llenarContratosDirecta/${id}`
        this.$http.get(url).then(function (response) {
        }).catch(function (error) {
          console.log(`Error al obtener contratos para ID ${id}:`, error);
        });
      });
    },
    // Handlers para el componente GestionBodegaInstitucion
    handleInstitucionAsignada(institucion) {
      let me = this
      me.tipoBusqueda = 'institucion'
      me.nombreInstitucion = institucion.nombreInstitucion
      me.institucion_id = institucion.idInstitucion
      me.periodo_id = institucion.periodo_id
      me.periodoDescripcion = institucion.periodoDescripcion
      me.ciudadDescripcion = institucion.ciudadDescripcion
      me.EstadoConfiguracion = institucion.EstadoConfiguracion
      me.periodo_configurado = institucion.periodo_configurado || null
      me.venta_estado = institucion.venta_estado
      me.id_institucionPedido = institucion.id_institucionPedido
      me.idtipodoc = null // Resetear idtipodoc cuando se asigna institución
      me.ven_p_libros_obsequios =null
      // Inicializar institucionData
      me.institucionData = {
        nombreInstitucion: institucion.nombreInstitucion,
        periodoDescripcion: institucion.periodoDescripcion,
        venta_estado: 0,
        empresa: '',
        documento: '',
        pedido_codigo: null,
        fecha_inicio_escaneo: null,
        observaciones_escaneo: null
      }

      // Limpiar documentos
      me.proforma.empresa = ''
      me.proforma.proforma = ''
      me.arrayProformas = []

      // Resetear datos de documento (cuando se busca por institución no hay documento)
      me.arrayInformacionDocumento = []
      me.documentoVentaEscaneado = ''
      me.mostrarAreaImportacion = true // Mostrar área de importación por defecto
    },
    handleDocumentoAsignado(documento) {
      console.log("=== INICIO handleDocumentoAsignado ===")
      console.log("documento completo:", documento)

      let me = this

      // Si viene del flujo "Iniciar proceso de empaque", ir directo al confirm
      if (documento.iniciarEmpaque) {
        me.documentoVentaEscaneado = documento.ven_codigo || documento.documento
        me.proforma.empresa = documento.empresa
        me.proforma.proforma = documento.documento
        me.escaneoSelected = documento.escaneoSelected || null
        me.confirmarDespacho()
        return
      }

      me.tipoBusqueda = 'documento'
      me.nombreInstitucion = documento.nombreInstitucion
      me.institucion_id = documento.idInstitucion
      me.periodo_id = documento.periodo_id
      me.periodoDescripcion = documento.periodoDescripcion
      me.ciudadDescripcion = documento.ciudadDescripcion
      me.EstadoConfiguracion = documento.EstadoConfiguracion
      me.periodo_configurado = null // En búsqueda por documento siempre es null
      me.venta_estado = documento.venta_estado
      me.id_institucionPedido = documento.id_institucionPedido
      me.idtipodoc = documento.idtipodoc || null // Asignar idtipodoc desde el documento
      me.ven_p_libros_obsequios = documento.ven_p_libros_obsequios || null // ver si es obsequios hijo docente o 100%

      console.log("idtipodoc asignado:", me.idtipodoc)
      console.log("radioRegalado ANTES de la lógica:", me.radioRegalado)

      // Capturar y mostrar la información del documento si existe
      if (documento.arrayInformacionDocumento && documento.arrayInformacionDocumento.length > 0) {
        me.arrayInformacionDocumento = documento.arrayInformacionDocumento
        me.documentoVentaEscaneado = documento.ven_codigo

        // Verificar si el escaneo está finalizado (todos los productos despachados completamente)
        const todosCompletados = documento.arrayInformacionDocumento.every(item =>
          item.det_ven_cantidad_despacho >= item.det_ven_cantidad
        )

        me.escaneoFinalizado = todosCompletados

        // No mostrar el modal, sino el detalle inline
        me.mostrarAreaImportacion = false

        console.log('arrayInformacionDocumento capturado:', me.arrayInformacionDocumento)
        console.log('escaneoFinalizado:', me.escaneoFinalizado)
      } else {
        // Si no hay arrayInformacionDocumento, mostrar área de importación
        me.arrayInformacionDocumento = []
        me.mostrarAreaImportacion = true
      }

      // Seleccionar automáticamente el radioRegalado según idtipodoc
      if (me.idtipodoc == 1 || me.idtipodoc == 3) {
        console.log("Entrando en condición idtipodoc == 1 o 3")
        me.radioRegalado = '0'; // Usan y liquidan
        console.log("radioRegalado asignado a '0'")
      } else if (me.idtipodoc == 2 || (me.idtipodoc == 4 && me.ven_p_libros_obsequios > 0)) {
        console.log("Entrando en condición idtipodoc == 2 o 4")
        me.radioRegalado = '1'; // Regalado
        console.log("radioRegalado asignado a '1'")
      } else {
        me.radioRegalado = '0'; // Valor por defecto si no coincide con ninguna condición
        console.log("No entró en ninguna condición, idtipodoc:", me.idtipodoc)
      }

      console.log("radioRegalado DESPUÉS de la lógica:", me.radioRegalado)

      // Asignar empresa y documento
      me.proforma.empresa = documento.empresa
      me.proforma.proforma = documento.documento

      // Capturar el escaneoSelected del documento
      me.escaneoSelected = documento.escaneoSelected || null
      console.log('escaneoSelected capturado:', me.escaneoSelected)

      // Capturar el usuario que escanea
      me.usuario_escaneo = documento.usuario_escaneo || null
      console.log('usuario_escaneo capturado:', me.usuario_escaneo)

      // Actualizar institucionData con información completa incluyendo sesión de escaneo
      me.institucionData = {
        nombreInstitucion: documento.nombreInstitucion,
        periodoDescripcion: documento.periodoDescripcion,
        venta_estado: documento.venta_estado,
        empresa: documento.empresa,
        documento: documento.documento,
        pedido_codigo: documento.pedido_codigo || null,
        fecha_inicio_escaneo: documento.fecha_inicio_escaneo || null,
        observaciones_escaneo: documento.observaciones_escaneo || null,
        usuario_escaneo: documento.usuario_escaneo || null
      }

      console.log('Documento asignado:', {
        empresa: me.proforma.empresa,
        documento: me.proforma.proforma,
        institucion_id: me.institucion_id,
        idtipodoc: me.idtipodoc,
        ven_p_libros_obsequios:me.ven_p_libros_obsequios,
        radioRegalado: me.radioRegalado,
        institucionData: me.institucionData
      })

      // Usar $nextTick para asegurar que los datos estén actualizados antes de llamar a las APIs
      me.$nextTick(() => {
        // Primero cargar las proformas
        me.f_listadoProformasAgrupadas()

        // Luego cargar los combos del documento seleccionado
        console.log('Verificando condiciones para cargar combos:', {
          empresa: me.proforma.empresa,
          proforma: me.proforma.proforma,
          institucion_id: me.institucion_id
        })

        if (me.proforma.empresa && me.proforma.proforma && me.institucion_id) {
          me.$http.get(
            me.$server_url + `metodosGetVentas?getProductoDetalleVenta=1&id_empresa=${me.proforma.empresa}&ven_codigo=${me.proforma.proforma}`
          ).then(function (res) {
            // Filtrar solo los combos
            me.arrayCombos = res.data.filter(p => p.ifcombo == 1)
            if(me.arrayCombos.length > 0){
              me.$vs.notify({
                text: `Se cargaron ${me.arrayCombos.length} combos`,
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check'
              })
            }
          }).catch(function (error) {
            console.log('Error al cargar combos:', error)
          })
        } else {
          console.log('No se cumplieron las condiciones para cargar combos')
        }
      })

      console.log("=== FIN handleDocumentoAsignado ===")
    },
    handleInstitucionLimpiada() {
      let me = this
      console.log('handleInstitucionLimpiada ejecutado')

      me.tipoBusqueda = 'documento'
      me.nombreInstitucion = ''
      me.institucion_id = 0
      me.periodo_id = 0
      me.periodo_configurado = null
      me.periodoDescripcion = ''
      me.ciudadDescripcion = ''
      me.EstadoConfiguracion = 0
      me.venta_estado = 0
      me.id_institucionPedido = null
      me.idtipodoc = null // Limpiar idtipodoc
      me.ven_p_libros_obsequios = null
      me.escaneoSelected = null // Limpiar sesión de escaneo
      me.usuario_escaneo = null // Limpiar usuario escaneador
      me.proforma.empresa = ''
      me.proforma.proforma = ''
      me.arrayProformas = []
      me.arrayCombos = []
      me.comboSelected = ''
      me.tipoComboImportacion = 0
      me.tableData = []
      me.codigosPerdidos = false

      // Limpiar institucionData
      me.institucionData = {
        nombreInstitucion: '',
        periodoDescripcion: '',
        venta_estado: 0,
        empresa: '',
        documento: '',
        pedido_codigo: null,
        fecha_inicio_escaneo: null,
        observaciones_escaneo: null
      }

      console.log('Datos limpiados en el padre')
    },
    handleTipoBusquedaCambiado() {
      let me = this
      console.log('handleTipoBusquedaCambiado ejecutado - Reseteando activeTypes a false')

      // Resetear activeTypes cuando cambia el tipo de búsqueda
      me.activeTypes = false

      console.log('activeTypes reseteado a:', me.activeTypes)
    },
    changeTipo(e,sendData){
      let me = this
      me.CodigosNoEncontrados       = [];
      me.arrayCodigosEncontrados    = [];
      me.arrayCodigosBloqueados     = [];
      me.arrayErroresValidacionCombos = [];
      me.CodigosNoEncontrados       = sendData.CodigosNoEncontrados
      me.arrayCodigosEncontrados    = sendData.arrayCodigosEncontrados
      // Transformar arrayAgrupadosCombos para que codigosHijos solo contenga códigos de activación con propiedad 'codigo'
      me.arrayAgrupadosCombos       = sendData.arrayAgrupadosCombos.map(combo => ({
        ...combo,
        codigosHijos: combo.codigosHijos.map(hijo => ({
          codigo: hijo.codigoActivacion,
          codigoActivacion: hijo.codigoActivacion,
          codigoDiagnostico: hijo.codigoDiagnostico,
          codigo_liquidacion: hijo.codigo_liquidacion,
          institucionPuntoVenta: hijo.institucionPuntoVenta || null,
        }))
      }))
      //obtener codigos bloqueados
      me.arrayCodigosBloqueados     = me.arrayCodigosEncontrados.filter(p => p.estado == 2 && p.estado_liquidacion != 2)
      //3 => paquetes, 4 => combos
      if(e.sendtipoBodega == 3)    {
        me.activeTypes = true;
        me.activePaquete = true;
        // No resetear radioRegalado aquí, mantener el valor según idtipodoc
      }
      else {
        me.activeTypes = true;
        me.activePaquete = false;
      }

      // Seleccionar radioRegalado según idtipodoc
      if (me.idtipodoc == 1 || me.idtipodoc == 3) {
        me.radioRegalado = '0'; // Usan y liquidan
      } else if (me.idtipodoc == 2 || (me.idtipodoc == 4 && me.ven_p_libros_obsequios > 0)) {
        me.radioRegalado = '1'; // Regalado
      } else {
        me.radioRegalado = '0'; // Valor por defecto si no hay idtipodoc
      }

      console.log('changeTipo - idtipodoc:', me.idtipodoc, 'radioRegalado:', me.radioRegalado);

      me.tipoBodega                 = e.sendtipoBodega
      me.titleImportacion           = e.sendtitleImportacion
      me.cantidadPaquete            = e.sendcantidadPaquete
      me.popupConfirmTipoImportado  = false;
      me.ejecutarValidacion()
      // VALIDACION DOCUMENTO NO COMBOS
      me.validacionDocumentoNoCombos()
      // Para combos: ejecutar validación de combo/documento automáticamente
      if (me.tipoBodega == 4) {
        me.$nextTick(() => { me.f_validarComboDocumento() })
      }
    },
    validacionDocumentoNoCombos() {
      let me = this;
      me.arrayCodigosNoEnDocumento = [];

      if (me.proforma.empresa && me.proforma.proforma && me.arrayCodigosEncontrados.length > 0 && me.tipoBodega != 4) {
        this.$http
          .get(
            this.$server_url +
              `metodosGetVentas?getProductoDetalleVenta=1&id_empresa=${me.proforma.empresa}&ven_codigo=${me.proforma.proforma}`
          )
          .then(function (res) {
            const data = res.data; // Datos de la API

            // Obtener todos los pro_codigo de la API y aplicar trim() para eliminar espacios
            const codigosApi = data.map(item => item.pro_codigo.trim().toUpperCase());
            console.log("Códigos en el documento (API):", codigosApi);
            console.log("Códigos encontrados en el archivo:", me.arrayCodigosEncontrados.map(c => c.codigo_liquidacion));
            // Recorrer los códigos de arrayCodigosEncontrados
            me.arrayCodigosEncontrados.forEach(c => {
              c.message = ''; // Reiniciar mensaje
              // Normalizar el código_liquidacion del archivo también
              const codigoNormalizado = c.codigo_liquidacion.trim().toUpperCase();
              if (!codigosApi.includes(codigoNormalizado)) {
                c.message = `el codigo ${c.codigo_liquidacion} No se encuentra en el documento`;
                // Guarda el objeto completo
                me.arrayCodigosNoEnDocumento.push(c);
              }
            });

            // Mostrar resultado
            if (me.arrayCodigosNoEnDocumento.length > 0) {
              // Puedes mostrar un modal de error si lo usas en tu app
              me.popupCodigosGeneralesError = true;
            }else{
              me.$vs.notify({
                color: 'success',
                title: 'Validación exitosa',
                text: 'Todos los códigos se encuentran en el documento.',
                icon: 'check_circle',
              });
            }
          })
          .catch(err => {
            console.error("Error al consultar la API:", err);
          });
      }
    },


    ejecutarValidacion(){
      let me = this;
      if(me.tipoBodega == 1 || me.tipoBodega == 2) { me.validateCodigos() }
      if(me.tipoBodega == 3) { me.validateCodigosPaquete() }
      if(me.tipoBodega == 4) { me.validateCodigosCombo() }
    },
    validateCodigos(){
      let me                            = this;
      try{
        let datos                       = []
        me.arregloProblemasDiagnostico  = []
        datos                           = me.tableData
        var preValores                  = []
        //quitar types NumRow
        datos.forEach(element => {
          var obj = new Object();
          obj.codigo = element.codigo.trim().toUpperCase()
          preValores.push(obj)
        });
        var getLongitud = datos.length
        var longitud    = getLongitud/2
        for(var i = 0; i<longitud;i++){
          // Creamos un nuevo array para almacenar los objetos quitados
          const nuevoArray        = [];
          let   codigoActivacion  = "";
          let   codigoDiagnostico = "";
          // Quitamos los dos primeros objetos del array original y los agregamos al nuevo array
          nuevoArray.push(preValores.splice(0, 2));
          var setear = nuevoArray.flat()
          //====VALIDACION SI SOLO HAY UN CODIGO====
          if(setear.length == 1){
            var cal = new Object
            //ACTIVACION - DIAGNOSTICO)
            if(me.tipoBodega == 1){
              cal.codigoActivacion =  setear[0].codigo
              cal.codigoDiagnostico  =  ""
            }
            //DIAGNOSTICO - ACTIVACION)
            if(me.tipoBodega == 2){
              cal.codigoDiagnostico =  setear[0].codigo
              cal.codigoActivacion  =  ""
            }
            cal.problema          =  'formato'
            me.arregloProblemasDiagnostico.push(cal)
          }
          //==SI TODO ESTA NORMAL===
          else{
            //ACTIVACION - DIAGNOSTICO)
            if(me.tipoBodega == 1){
              codigoActivacion      = setear[0].codigo;
              codigoDiagnostico     = setear[1].codigo
            }
            //DIAGNOSTICO - ACTIVACION)
            if(me.tipoBodega == 2){
              codigoDiagnostico     = setear[0].codigo
              codigoActivacion      = setear[1].codigo;
            }
            //============ACTIVACION==================================
            //VALIDACION SI NO SON STRING
            if (typeof codigoActivacion !== 'string' || typeof codigoDiagnostico !== 'string' ) {
              var cal = new Object
              cal.codigoActivacion  =  codigoActivacion
              cal.codigoDiagnostico =  codigoDiagnostico
              cal.problema          =  'formato'
              me.arregloProblemasDiagnostico.push(cal)
            }
            else{
              const activacionMinuscula = codigoActivacion.toLowerCase();
              //validar que el codigo de activacion no tenga una P
              if(activacionMinuscula.startsWith("p")){
                //validar meñique que el codigo de activacion se permita empezar por p DONDE SEA PLM no hago nada
                if(activacionMinuscula.startsWith("plm")){
                }else{
                  var cal = new Object
                  cal.codigoActivacion  =  codigoActivacion
                  cal.codigoDiagnostico =  codigoDiagnostico
                  cal.problema          =  'activacion'
                  me.arregloProblemasDiagnostico.push(cal)
                }
              }
              //=============DIAGNOSTICO===================================
              //validar que el codigo de activacion tenga una P
              const diagnosticoMinuscula = codigoDiagnostico.toLowerCase();
              //validar si es meñique debe tener 2 pp
              if(activacionMinuscula.startsWith("plm")){
                //si no inicia por 2 pp
                if(!diagnosticoMinuscula.startsWith("pp")){
                  var cal = new Object
                  cal.codigoActivacion  =  codigoActivacion
                  cal.codigoDiagnostico =  codigoDiagnostico
                  cal.problema          =  'diagnostico'
                  me.arregloProblemasDiagnostico.push(cal)
                }
              }
              //diferente a meñique
              else{
                if(!diagnosticoMinuscula.startsWith("p")){
                  var cal = new Object
                  cal.codigoActivacion  =  codigoActivacion
                  cal.codigoDiagnostico =  codigoDiagnostico
                  cal.problema          =  'diagnostico'
                  me.arregloProblemasDiagnostico.push(cal)
                }
              }
            }
          }
        }//Fin FOR
        //si hay errores en el archivo mostramos un modal
        if(me.arregloProblemasDiagnostico.length > 0){
          me.popupProblemasDiagnostico = true
        }
      }
      catch (err) {
        console.log("err",err)
        alert("Hubo problemas con tu archivo excel")
      }
    },
    //==================================METODOS PAQUETES===================
    validateCodigosPaquete() {
      let me = this;
      try {
        // Llamamos al método de validación y almacenamos los resultados en arregloFormatoSend
        const resultado = me.m_validatePaquete(me.tableData,'paquete','paq');  // Asumiendo que `validatePaquete` es tu método de validación
        me.arregloFormatoSend      = resultado.arregloFormatoSend;  // Asignamos los paquetes válidos
        me.arregloFormatoSendOriginal = resultado.arregloFormatoSend;
        me.arregloProblemasPaquete = resultado.arregloProblemasPaquete;  // Asignamos los problemas
        // Si hay errores en el archivo, mostramos el modal
        if (me.arregloProblemasPaquete.length > 0) {
          me.popupProblemasDiagnostico = true;
        }
      } catch (err) {
        console.log("err", err);
        alert("Hubo problemas con tu archivo excel");
      }
    },
    validateCodigosCombo() {
      let me = this;
      me.errorCombos = false
      try {
        // Llamamos al método de validación y almacenamos los resultados en arregloFormatoSend
        const resultado = me.m_validatePaquete(me.tableData,'combo','cmb');  // Asumiendo que `validatePaquete` es tu método de validación
        me.arregloFormatoSend = resultado.arregloFormatoSend;  // Asignamos los paquetes válidos
        me.arregloFormatoSendOriginal = resultado.arregloFormatoSend; // Guardamos el arreglo original
        me.arregloProblemasPaquete = resultado.arregloProblemasPaquete;  // Asignamos los problemas
        // Si hay errores en el archivo, mostramos el modal
        if (me.arregloProblemasPaquete.length > 0) {
          me.popupProblemasDiagnostico = true;
        }

      } catch (err) {
        console.log("err", err);
        alert("Hubo problemas con tu archivo excel");
      }
    },

    //===================================FIN METODOS PAQUETES===============
    eliminarInstitucionSeleccionada(){
      let me = this;
      me.nombreInstitucion = ""
      me.instituciones = []
      me.institucion_id = 0
      me.periodo_id = 0
      me.periodoDescripcion = ""
      //limpiar la proforma
      me.proforma.empresa = ""
      me.proforma.proforma = ""
      //limpiar tipo de venta y id_institucionPedido
      me.venta_estado = 0
      me.id_institucionPedido = null
    },
    changePeriodo(){
      let me = this
      if(me.instituciones.length > 0){
        me.instituciones.map(function (item) {
          item.EstadoConfiguracion      = 1
          item.periodo_configurado      = me.periodoSelect.idperiodoescolar
          item.periodoNombreConfigurado = me.periodoSelect.periodoescolar
        })
      }
    },
    getInstitucion() {
      let me = this;
      me.periodoSelect                        = ""
      me.codigosPerdidos                      = false
      me.instituciones                        = [];
      me.arregloCodigosDiagnosticoNoexisten   = []
      me.nombreInstitucion                    = "";
      me.institucion_id                       = 0;
      //limpiar la proforma
      me.proforma.empresa                     = ""
      me.proforma.proforma                    = ""
      //limpiar tipo de venta y id_institucionPedido
      me.venta_estado                         = 0
      me.id_institucionPedido                 = null
      if(me.busquedaInstitucion.length < 5){
        me.$vs.notify({
        text:'Minimo 5 caracteres de busqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      me.$vs.loading()
      this.$http.get(this.$server_url + 'listaInsitucion?busqueda='+me.busquedaInstitucion)
        .then(function (res) {
          let datos = res.data
          me.instituciones = datos
          // if(datos.length > 0){
          //   me.instituciones = datos.filter(p => p.statusPeriodo == '1')
          // }
          me.$vs.loading.close()
          if(res.data.message){
            me.$vs.notify({
            text: res.data.message,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-user'
            })
          }
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
    },
    getDocumentoVenta() {
      let me = this;
      me.periodoSelect                        = ""
      me.codigosPerdidos                      = false
      me.instituciones                        = [];
      me.arregloCodigosDiagnosticoNoexisten   = []
      me.nombreInstitucion                    = "";
      me.institucion_id                       = 0;
      //limpiar la proforma
      me.proforma.empresa                     = ""
      me.proforma.proforma                    = ""
      //limpiar tipo de venta y id_institucionPedido
      me.venta_estado                         = 0
      me.id_institucionPedido                 = null

      if(me.busquedaInstitucion.length < 5){
        me.$vs.notify({
        text:'Minimo 5 caracteres de busqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }

      me.$vs.loading()
      this.$http.get(this.$server_url + 'devoluciones?buscarDocumentoVenta=1&documento='+me.busquedaInstitucion)
        .then(function (res) {
          let datos = res.data

          if(datos.length == 0){
            me.$vs.notify({
              text: 'No se encontraron documentos con ese criterio',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            me.$vs.loading.close()
            return
          }

          // Mostrar resultados en la tabla (uno o múltiples)
          me.instituciones = datos

          me.$vs.notify({
            text: `Se encontraron ${datos.length} documento(s)`,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })

          me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
          me.$vs.notify({
            text: 'Error al buscar el documento',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          })
        })
    },
    asignarInstitucion(tr){
      let me = this;
      me.arrayProformas        = []
      me.error = false
      me.nombreInstitucion     = tr.nombreInstitucion

      // Si viene de búsqueda por institución
      if(me.tipoBusqueda == 'institucion'){
        me.institucion_id        = tr.idInstitucion
        me.EstadoConfiguracion   = tr.EstadoConfiguracion
        if(tr.EstadoConfiguracion == 1){
          me.periodo_id            = tr.periodo_configurado
          me.periodoDescripcion    = tr.periodoNombreConfigurado
        }else{
          me.periodo_id            = tr.periodo_id
          me.periodoDescripcion    = tr.periodo
        }
        me.ciudadDescripcion     = tr.ciudad
      }

      me.instituciones         = []
      //limpiar la proforma
      me.proforma.empresa      = ""
      me.proforma.proforma     = ""
      //limpiar tipo de venta y id_institucionPedido
      me.venta_estado          = 0
      me.id_institucionPedido  = null
    },
    f_listadoProformasAgrupadas(){
      let me = this;
      me.arrayProformas = []

      // Solo limpiar proforma.proforma si NO es búsqueda por documento
      if (me.tipoBusqueda !== 'documento') {
        me.proforma.proforma = ""
        me.venta_estado = 0 // Resetear tipo de venta al cambiar empresa
        me.id_institucionPedido = null // Resetear id_institucionPedido al cambiar empresa
      }

      if(me.proforma.empresa == "" || me.proforma.empresa == null || me.proforma.empresa == undefined){
        me.$vs.notify({
        text:'Debe seleccionar una empresa por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }

      // Determinar qué periodo usar: si EstadoConfiguracion = 1, usar periodo_configurado, sino periodo_id
      let periodoParaAPI = me.periodo_id
      if (me.EstadoConfiguracion == 1 && me.periodo_configurado) {
        periodoParaAPI = me.periodo_configurado
      }

      this.$http.get(this.$server_url+`devoluciones?listadoProformasAgrupadas=1&institucion=${me.institucion_id}&periodo_id=${periodoParaAPI}&id_usuario=${me.usuario.idusuario}`)
      .then(function (res) {
        let datos = res.data
        if(datos.length == 0){
          me.$vs.notify({
          text:'No hay documentos de la institución'+me.nombreInstitucion+ 'de la empresa '+me.arrayEmpresas.find(p => p.id == me.proforma.empresa).nombre,
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        //filtrar emp_id con me.proforma.empresa
        me.arrayProformas = datos.filter(p => p.id_empresa == me.proforma.empresa)
        if(me.arrayProformas.length == 0){
          me.$vs.notify({
          text:'No hay documentos de la institución'+me.nombreInstitucion+ 'de la empresa '+me.arrayEmpresas.find(p => p.id == me.proforma.empresa).nombre,
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }else{
          //se encontrato tal resultados
          // me.$vs.notify({
          // text:'Se encontraron '+me.arrayProformas.length+' documentos de la institución '+me.nombreInstitucion+ ' de la empresa '+me.arrayEmpresas.find(p => p.id == me.proforma.empresa).nombre,
          // color:'success',
          // iconPack: 'feather',
          // icon:'icon-check'})
        }
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    f_setTipoVentaFromDocumento(){
      let me = this;
      // Si se quita el documento, resetear el tipo de venta y el id_institucionPedido
      if(!me.proforma.proforma || me.proforma.proforma == "" || me.proforma.proforma == null){
        me.venta_estado = 0;
        me.id_institucionPedido = null;
        me.idtipodoc = null; // Resetear idtipodoc
        me.ven_p_libros_obsequios =null;
        me.radioRegalado = '0'; // Resetear a valor por defecto
        // Limpiar institucionData creando un nuevo objeto para forzar reactividad
        me.institucionData = {
          ...me.institucionData,
          venta_estado: 0,
          empresa: '',
          documento: '',
          pedido_codigo: null,
          fecha_inicio_escaneo: null,
          observaciones_escaneo: null,
          usuario_escaneo: null
        };
        return;
      }
      // Buscar el documento seleccionado en arrayProformas
      const documentoSeleccionado = me.arrayProformas.find(p => p.ven_codigo == me.proforma.proforma);

      // Asignar arrayInformacionDocumento SIEMPRE, antes de cualquier return
      if (documentoSeleccionado) {
        if (documentoSeleccionado.arrayInformacionDocumento && documentoSeleccionado.arrayInformacionDocumento.length > 0) {
          me.arrayInformacionDocumento = documentoSeleccionado.arrayInformacionDocumento
          me.documentoVentaEscaneado = documentoSeleccionado.ven_codigo
        } else {
          me.$http.get(me.$server_url + 'devoluciones?buscarDocumentoVenta=1&documento=' + documentoSeleccionado.ven_codigo + '&id_usuario=' + me.usuario.idusuario)
            .then(function(r) {
              if (r.data && r.data.length > 0 && r.data[0].arrayInformacionDocumento) {
                me.arrayInformacionDocumento = r.data[0].arrayInformacionDocumento
                me.documentoVentaEscaneado = documentoSeleccionado.ven_codigo
              }
            }).catch(function() {})
        }
      }

      console.log('Documento seleccionado:', documentoSeleccionado);
      console.log('idtipodoc del documento:', documentoSeleccionado ? documentoSeleccionado.idtipodoc : null);

      // Validar que el documento no esté en proceso de empaque
      if (documentoSeleccionado && documentoSeleccionado.proceso_empacar == 1) {
        me.$vs.notify({
          text: 'Este documento ya inició un proceso de empaque.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        me.proforma.proforma = null
        return
      }

      // Validar que el documento tenga sesión de escaneo activa
      if(documentoSeleccionado && (!documentoSeleccionado.sessionEscaneo || documentoSeleccionado.sessionEscaneo.length === 0)){
        me.$vs.notify({
          text: 'No tiene una sesión de escaneo activa. Debe activar una sesión primero.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        // Limpiar la selección del documento
        me.proforma.proforma = null;
        me.venta_estado = 0;
        me.id_institucionPedido = null;
        me.idtipodoc = null;
        me.ven_p_libros_obsequios= null;
        me.radioRegalado = '0';
        me.escaneoSelected = null;
        me.usuario_escaneo = null;
        // Limpiar institucionData
        me.institucionData = {
          ...me.institucionData,
          venta_estado: 0,
          empresa: '',
          documento: '',
          pedido_codigo: null,
          fecha_inicio_escaneo: null,
          observaciones_escaneo: null,
          usuario_escaneo: null
        };
        return;
      }

      // Si hay sesiones disponibles, siempre mostrar modal para seleccionar
      if(documentoSeleccionado && documentoSeleccionado.sessionEscaneo && documentoSeleccionado.sessionEscaneo.length >= 1){
        me.documentoTemporalProforma = documentoSeleccionado;
        me.sesionesEscaneoDisponiblesDocumento = documentoSeleccionado.sessionEscaneo;
        me.modalSesionesEscaneoDocumento = true;
        return;
      }

      if(documentoSeleccionado && documentoSeleccionado.tip_ven_codigo){
        // Asignar el tipo de venta desde el documento
        me.venta_estado = documentoSeleccionado.tip_ven_codigo;
        // Asignar el id_institucionPedido desde el documento
        me.id_institucionPedido = documentoSeleccionado.id_institucionPedido || null;
        // Asignar el idtipodoc desde el documento
        me.idtipodoc = documentoSeleccionado.idtipodoc || null;
        me.ven_p_libros_obsequios = documentoSeleccionado.ven_p_libros_obsequios || null;
        console.log('idtipodoc asignado:', me.idtipodoc);

        // Seleccionar automáticamente el radioRegalado según idtipodoc
        if (me.idtipodoc == 1 || me.idtipodoc == 3) {
          me.radioRegalado = '0'; // Usan y liquidan
          me.$vs.notify({
            text: 'Tipo de documento detectado: Se seleccionó automáticamente "Usan y liquidan"',
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-info'
          });
        } else if (me.idtipodoc == 2 || (me.idtipodoc == 4 && me.ven_p_libros_obsequios > 0)) {
          me.radioRegalado = '1'; // Regalado
          me.$vs.notify({
            text: 'Tipo de documento detectado: Se seleccionó automáticamente "Regalado (No entra a la liquidación)"',
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-info'
          });
        }else{
          me.radioRegalado = '0'; // Valor por defecto si no hay idtipodoc
        }

        console.log('radioRegalado seleccionado:', me.radioRegalado);

        // Actualizar el card morado con la información del documento seleccionado
        if (me.tipoBusqueda == 'institucion') {
          // Obtener datos de la sesión de escaneo
          const sesionEscaneo = documentoSeleccionado.sessionEscaneo && documentoSeleccionado.sessionEscaneo.length > 0 ? documentoSeleccionado.sessionEscaneo[0] : null

          // Crear un nuevo objeto para forzar la reactividad de Vue
          me.institucionData = {
            ...me.institucionData,
            venta_estado: documentoSeleccionado.tip_ven_codigo,
            empresa: me.proforma.empresa,
            documento: documentoSeleccionado.ven_codigo,
            pedido_codigo: documentoSeleccionado.pedido_codigo || null,
            fecha_inicio_escaneo: sesionEscaneo ? sesionEscaneo.fecha_inicio : null,
            observaciones_escaneo: sesionEscaneo ? sesionEscaneo.observaciones : null,
            usuario_escaneo: sesionEscaneo ? sesionEscaneo.nombreUsuario : null
          };

          console.log('institucionData actualizado:', me.institucionData);

          me.$vs.notify({
            text: `Documento ${documentoSeleccionado.ven_codigo} seleccionado`,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });

          // Llenar arrayInformacionDocumento para mostrar la tabla de facturado/despachado
          if (documentoSeleccionado.arrayInformacionDocumento && documentoSeleccionado.arrayInformacionDocumento.length > 0) {
            me.arrayInformacionDocumento = documentoSeleccionado.arrayInformacionDocumento
            me.documentoVentaEscaneado = documentoSeleccionado.ven_codigo
          }
        }

        // Siempre actualizar arrayInformacionDocumento al seleccionar documento
        if (documentoSeleccionado.arrayInformacionDocumento && documentoSeleccionado.arrayInformacionDocumento.length > 0) {
          me.arrayInformacionDocumento = documentoSeleccionado.arrayInformacionDocumento
          me.documentoVentaEscaneado = documentoSeleccionado.ven_codigo
        } else {
          // Si no viene en arrayProformas, consultarlo directamente
          me.$http.get(me.$server_url + 'metodosGetVentas?getProductoDetalleVenta=1&id_empresa=' + me.proforma.empresa + '&ven_codigo=' + documentoSeleccionado.ven_codigo)
            .then(function(r) {
              if (r.data && r.data.length > 0) {
                me.arrayInformacionDocumento = r.data.map(function(item) {
                  return {
                    pro_codigo: item.pro_codigo,
                    pro_nombre: item.nombre || item.pro_codigo,
                    pro_descripcion: item.pro_descripcion || '',
                    ifcombo: item.ifcombo || 0,
                    det_ven_cantidad: item.det_ven_cantidad || 0,
                    det_ven_cantidad_despacho: item.det_ven_cantidad_despacho || 0,
                  }
                })
                me.documentoVentaEscaneado = documentoSeleccionado.ven_codigo
              }
            }).catch(function() {})
        }

        // Mostrar notificación informativa
        const tipoVentaTexto = documentoSeleccionado.tip_ven_codigo == 1 ? 'Venta directa' : 'Venta lista';
        me.$vs.notify({
          text: `Tipo de venta asignado automáticamente: ${tipoVentaTexto}`,
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-check'
        });
      } else {
        me.venta_estado = 0;
        me.id_institucionPedido = null;
        me.idtipodoc = null;
        me.ven_p_libros_obsequios = null;
        me.radioRegalado = '0';
        // Limpiar institucionData
        me.institucionData = {
          ...me.institucionData,
          venta_estado: 0,
          empresa: '',
          documento: '',
          pedido_codigo: null,
          fecha_inicio_escaneo: null,
          observaciones_escaneo: null,
          usuario_escaneo: null
        };
      }
    },
    handleSesionSeleccionadaDocumento(data) {
      let me = this;
      console.log('Sesión seleccionada desde f_setTipoVentaFromDocumento:', data);

      // Guardar el ID de la sesión seleccionada
      me.escaneoSelected = data.id;
      me.usuario_escaneo = data.sesion ? data.sesion.nombreUsuario : null;
      console.log('usuario_escaneo capturado (modal):', me.usuario_escaneo);

      // Usar el documento temporal guardado
      if (me.documentoTemporalProforma) {
        const documentoSeleccionado = me.documentoTemporalProforma;
        const sesionEscaneo = data.sesion;

        // Asignar el tipo de venta desde el documento
        me.venta_estado = documentoSeleccionado.tip_ven_codigo;
        me.id_institucionPedido = documentoSeleccionado.id_institucionPedido || null;
        me.idtipodoc = documentoSeleccionado.idtipodoc || null;
        me.ven_p_libros_obsequios = documentoSeleccionado.ven_p_libros_obsequios || null;

        // Seleccionar automáticamente el radioRegalado según idtipodoc
        if (me.idtipodoc == 1 || me.idtipodoc == 3) {
          me.radioRegalado = '0';
          me.$vs.notify({
            text: 'Tipo de documento detectado: Se seleccionó automáticamente "Usan y liquidan"',
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-info'
          });
        } else if (me.idtipodoc == 2 || (me.idtipodoc == 4 && me.ven_p_libros_obsequios > 0)) {
          me.radioRegalado = '1';
          me.$vs.notify({
            text: 'Tipo de documento detectado: Se seleccionó automáticamente "Regalado (No entra a la liquidación)"',
            color: 'primary',
            iconPack: 'feather',
            icon: 'icon-info'
          });
        }else{
          me.radioRegalado = '0'; // Valor por defecto si no hay idtipodoc
        }

        // Actualizar el card morado con la información del documento seleccionado
        if (me.tipoBusqueda == 'institucion') {
          me.institucionData = {
            ...me.institucionData,
            venta_estado: documentoSeleccionado.tip_ven_codigo,
            empresa: me.proforma.empresa,
            documento: documentoSeleccionado.ven_codigo,
            pedido_codigo: documentoSeleccionado.pedido_codigo || null,
            fecha_inicio_escaneo: sesionEscaneo ? sesionEscaneo.fecha_inicio : null,
            observaciones_escaneo: sesionEscaneo ? sesionEscaneo.observaciones : null,
            usuario_escaneo: sesionEscaneo ? sesionEscaneo.nombreUsuario : null
          };
        }

        me.$vs.notify({
          text: `Documento ${documentoSeleccionado.ven_codigo} seleccionado con sesión #${data.id}`,
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-check'
        });

        // Limpiar documento temporal
        me.documentoTemporalProforma = null;
      }
    },
    loadDataInTable ({ results, header, meta }) {
      let me = this;
      this.totalCodigos                       = 0
      this.arregloProblemasDiagnostico        = []
      this.arregloCodigosDiagnosticoNoexisten = []
      this.codigosNoExisten                   = []
      this.header                             = header
      this.tableData                          = results
      me.totalCodigos                         = results.length
      me.codigosPerdidos                      = false
      this.codigosNoCambiados                 = []
      this.sheetName = meta.sheetName
      this.popupConfirmTipoImportado          = true;
      this.arregloProblemasPaquete            = []
      this.arregloResumen                     = []
      this.arregloCodigosDiagnosticoNoexisten = []
      this.arregloFormatoSend                 = []
      this.arregloFormatoSendOriginal         = []
      // Auto-detectar columna combo en el excel
      const tieneColumnaCombo = header.map(h => h.toLowerCase().trim()).includes('combo')
      this.tipoComboImportacion               = tieneColumnaCombo ? 1 : 0
      this.comboSelected                      = ''
      this.arrayErroresValidacionCombos       = []
      this.arrayCodigosNoEnDocumento          = []
      this.arrayAgrupadosCombos               = []
      this.CodigosNoEncontrados               = []
      this.arrayCodigosEncontrados            = []
      this.arrayCodigosBloqueados             = []
    },
    procesarPagos(){
      let me = this
      if(me.radioRegalado === ""){
        me.$vs.notify({
        text:'Debe seleccionar un tipo por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      // validar observacion 4 carecteres minimo y trim
      if(me.observacion.length < 4 || me.observacion.trim() === ""){
        me.$vs.notify({
        text:'La observación debe tener al menos 4 caracteres',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      //si colocan usan y liquidan
      if(me.radioRegalado != 4 && (me.venta_estado == 0 || me.venta_estado == null || me.venta_estado == undefined || me.venta_estado == "null" || me.venta_estado == "") ){
        me.$vs.notify({
        text:'Debe seleccionar un tipo de venta por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      // si es venta directa el id_institucionPedido es obligatorio
      if(me.venta_estado == 1 && (me.id_institucionPedido == null || me.id_institucionPedido == undefined)){
        me.$vs.notify({
        text:'El documento seleccionado no es válido para venta directa, no contiene un pedido asociado. Por favor seleccione otro documento',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      me.factura  = ""
      if(me.error){
        me.$vs.notify({
        text:'La institucion no tiene periodo',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      if(me.institucion_id <= 0){
        me.$vs.notify({
        text:'Seleccione una institución por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false
      }
      if(me.radioRegalado == 4){
        //validar que el periodoSelect no esta vacia ni nula
        if(me.periodoSelect == "" || me.periodoSelect == null || me.periodoSelect == undefined){
          me.$vs.notify({
          text:'Debe seleccionar un periodo por favor para las guias',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        //validar que el asesorSelect no vacia ni nula
        if(me.asesorSelect == "" || me.asesorSelect == null || me.asesorSelect == undefined){
          me.$vs.notify({
          text:'Debe seleccionar un asesor por favor para las guias',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
      }
      //si escogio tipo de importacion Diagnostico
      if(me.tipoBodega == 1 || me.tipoBodega == 2){
        if(me.arregloProblemasDiagnostico.length > 0){
          me.$vs.notify({
          text:'Existe codigos de activación con problemas corriga por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
      }
      //si escogio tipo de paquete
      if(me.tipoBodega == 3 || me.tipoBodega == 4){
        if(me.arregloProblemasPaquete.length > 0){
          me.$vs.notify({
          text:'Existe codigos del '+(me.tipoBodega == 3 ? 'paquete' : 'combo')+' con problemas corriga por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
        if(me.arregloFormatoSend.length > 200){
          me.$vs.notify({
          text:'No puedes subir mas de 200 '+(me.tipoBodega == 3 ? 'paquetes' : 'combos'),
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        if(me.arregloFormatoSend.length == 0){
          me.$vs.notify({
          text:'Hubo problemas para subir los '+(me.tipoBodega == 3 ? 'paquetes' : 'combos'),
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false
        }
      }
      let formData = new FormData();
      var json_pagos = ""
      if(me.tipoBodega == 3 || me.tipoBodega == 4) {  json_pagos = JSON.stringify(me.arregloFormatoSend) }
      else                                         {  json_pagos = JSON.stringify(me.tableData) }
      let comentario = ""
      var mensajeDocumento   = ""
      //proforma
      formData.append('proforma_empresa', me.proforma.empresa)
      formData.append('codigo_proforma',  me.proforma.proforma)
      if(me.proforma.proforma == null || me.proforma.proforma == "" || me.proforma.proforma == undefined){
        formData.append('ifSetProforma',0)
      }else{
        let empresaEncontrada = me.arrayEmpresas.find(function(e) { return e.id == me.proforma.empresa; });
        let empresaNombre = empresaEncontrada ? empresaEncontrada.descripcion_corta : '';
        mensajeDocumento = `_agregar_${me.proforma.proforma}_${empresaNombre}`;
        formData.append('ifSetProforma',1)
      }
      if(me.venta_estado == '1') { comentario = "Venta directa "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura + mensajeDocumento }
      if(me.venta_estado == '2') { comentario = "Venta lista "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura + mensajeDocumento }
      if(me.radioRegalado == 1)  { comentario = "Regalado "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura + mensajeDocumento }
      if(me.radioRegalado == 2)  { comentario = "Regalado y bloqueado "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura +mensajeDocumento }
      if(me.radioRegalado == 3)  { comentario = "Bloqueado "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura + mensajeDocumento }
      if(me.radioRegalado == 4)  { comentario = "CÓDIGO GUIA "+me.nombreInstitucion+'_'+me.ciudadDescripcion+'_'+me.periodoDescripcion+'_'+me.factura + mensajeDocumento }
      formData.append('data_codigos',       json_pagos);
      formData.append('id_usuario',         me.usuario.idusuario);
      formData.append('regalado',           me.radioRegalado);
      formData.append('institucion',        'yes')
      formData.append('institucion_id',     me.institucion_id)
      if(me.radioRegalado == 4){
        formData.append('periodo_id',       me.periodoSelect.idperiodoescolar); formData.append('asesor_id',me.asesorSelect);
      }else{
        formData.append('periodo_id',       me.periodo_id)
      }
      console.log("observacion send", me.observacion)
      let preComentarioSendd               = me.observacion + '_' + comentario
      console.log("preComentarioSendd",preComentarioSendd)
      formData.append('comentario',         preComentarioSendd )
      formData.append('factura',            me.factura)
      formData.append('venta_estado',       me.venta_estado)
      formData.append('tipoBodega',         me.tipoBodega)
      formData.append('id_institucionPedido', me.id_institucionPedido || '')
      formData.append('tipoComboImportacion', me.tipoComboImportacion)
      // Agregar ID de sesión de escaneo si existe
      if(me.escaneoSelected) {
        formData.append('escaneoSelected', me.escaneoSelected)
        console.log('Enviando escaneoSelected a API:', me.escaneoSelected)
      }
      if((me.comboSelected == "" || me.comboSelected == null || me.comboSelected == undefined)){
        //si el combo es indvidual por excel envio ifSetCombo = 1
        if(me.tipoComboImportacion == 1){
          formData.append('ifSetCombo', 1)
        }else{
          formData.append('ifSetCombo', 0)
        }
      }
      else{
        formData.append('ifSetCombo',1)
        formData.append('comboSelected',me.comboSelected)
      }
      var url = ""
      //tipo importacion Anterior
      if(me.tipoBodega == 0){
        url = this.$server_url+'codigos/import/gestion'
      }
      //tipo importacion Activacion - Diagnostico
      if(me.tipoBodega == 1 || me.tipoBodega == 2 ){
        url = this.$server_url+'codigos/import/gestion/diagnostico'
      }
      //tipo paquete
      if(me.tipoBodega == 3 || me.tipoBodega == 4 ){
        url = this.$server_url+'paquetes/importPaqueteGestion'
      }
      me.$vs.loading()
      this.$http.post(url, formData)
      .then(res => {
        me.$vs.loading.close()
        if(res.data.status == 0){
          me.m_message(res.data.message,'danger','icon-alert-triangle',5000)
          return
        }
        me.$vs.notify({
          text:'Códigos procesados exitosamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'
        })
        me.modalConfirm        = false
        me.tableData           = []
        me.factura             = ''
        me.observacion         = ''
        me.codigoConProblemas  = res.data.codigoConProblemas || []

        // Activacion - diagnostica normal
        if(this.tipoBodega == 1 || this.tipoBodega == 2){
          me.contadorA = res.data.contadorA
          me.contadorD = res.data.contadorD
          me.$vs.notify({
            text: `Ingresados: ${me.contadorA} código${me.contadorA !== 1 ? 's' : ''} de activación y ${me.contadorD} código${me.contadorD !== 1 ? 's' : ''} de diagnóstico`,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check',
            time: 6000
          })
          if(res.data.CodigosDiagnosticoNoexisten && res.data.CodigosDiagnosticoNoexisten.length > 0){
            me.arregloCodigosDiagnosticoNoexisten = res.data.CodigosDiagnosticoNoexisten
            me.popupCodigosDiagnosticoNoexisten   = true
          }
        }
        // Paquetes
        if(this.tipoBodega == 3 || this.tipoBodega == 4){
          me.arregloResumen        = res.data.arregloResumen
          me.codigoConProblemas    = res.data.codigoConProblemas || []
          me.arregloErroresPaquetes = res.data.arregloErroresPaquetes
        }
        // Tipo 0
        if(this.tipoBodega == 0){
          me.porcentaje            = res.data.ingresados
          me.codigosNoCambiados    = res.data.codigosNoCambiados
          me.codigosNoExisten      = res.data.codigosNoExisten
          me.codigosSinCodigoUnion = res.data.codigosSinCodigoUnion
          if(me.codigosSinCodigoUnion.length > 0){
            me.popupProblemasCodigosUnion = true
          }
        }

        me.codigosPerdidos = true

        // Mostrar modal de estado de escaneo si la API lo devuelve
        if(res.data.escaneoFinalizado !== undefined){
          me.escaneoFinalizado         = res.data.escaneoFinalizado
          me.totalCodigosReal          = res.data.totalCodigosReal
          me.totalCodigosSubidos       = res.data.totalCodigosSubidos
          me.documentoVentaEscaneado   = me.proforma.proforma || ''
          me.empresaVentaEscaneada     = me.proforma.empresa || ''
          me.arrayInformacionDocumento = res.data.arrayInformacionDocumento || []
          me.popupEstadoEscaneo        = true
        }
      })
      .catch(function (error) {
        me.$vs.notify({
        text:'Verifique que la información se haya guardado correctamente.',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-alert-triangle'})
        me.$vs.loading.close()
        // setTimeout(function() {location.reload()}, 1000);
      })
    },
    async  openConfirm() {
      let me = this
      // Esperar 1 segundo antes de seguir
      await new Promise(resolve => setTimeout(resolve, 1000));
      // VALIDAR QUE DEBE INGRESAR EL COMENTARIO ANTES DE PROCESAR
      if(me.observacion.length < 4 || me.observacion.trim() === ""){
        me.$vs.notify({
        text:'La observación debe tener al menos 4 caracteres',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return false;
      }
      // Validar que no haya items que sobrepasan el documento
      if (this.hayItemsSobrantes && this.arrayInformacionDocumento.length > 0) {
        me.$vs.notify({
          text: `Hay ${this.itemsConSobrante.length} item(s) que sobrepasan la cantidad disponible en el documento. Corrija antes de importar.`,
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
          time: 6000
        })
        me.soloMostrarSobrantes = true
        return
      }
      if(me.arrayCodigosNoEnDocumento.length > 0){
        me.$vs.notify({
          text: `Existen ${me.arrayCodigosNoEnDocumento.length} códigos que no se encuentran en el documento seleccionado`,
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        me.popupCodigosGeneralesError = true
        me.modalConfirm = false
        return
      }
      if(me.arrayErroresValidacionCombos.length > 0){
        me.$vs.notify({
          text: `Se encontraron ${me.arrayErroresValidacionCombos.length} errores en la validación de combos`,
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        me.popupMostrarErroresCombosNoCoindicen = true
        return
      }
      if(me.tipoBodega == 4){
        if(me.arrayAgrupadosCombos.length == 0) {
          me.$vs.notify({
            text: 'No hay códigos asignados en los combos',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          });
          return;
        }
      }

      // Validar documento y empresa (obligatorio excepto para GUIA)
      if(me.radioRegalado != 4){
        if(me.proforma.proforma == null || me.proforma.proforma == "" || me.proforma.proforma == undefined){
          me.$vs.notify({
            text:'Debe seleccionar un documento de venta (obligatorio)',
            color:'danger',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
          return
        }
        if(me.proforma.empresa == null || me.proforma.empresa == "" || me.proforma.empresa == undefined){
          me.$vs.notify({
            text:'Debe seleccionar la empresa (obligatorio)',
            color:'danger',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
          return
        }
      }
      //importacion por combos
      if(me.tipoBodega == 4){
        //si elige solo la columna codigo del excel y un combo general
        let preerrorDocumentosValidate = localStorage.getItem('errorDocumentosValidate')
        if(me.errorDocumentos){
          me.m_message(preerrorDocumentosValidate,"warning",'icon-check',5000)
          return
        }
        if(me.tipoComboImportacion == 0){
          if(me.comboSelected == "" || me.comboSelected == null || me.comboSelected == undefined){
            me.$vs.notify({
            text:'Debe seleccionar un combo del libro',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return false;
          }
        }
      }
      if(me.radioRegalado == 4){
        //validar que el periodoSelect no esta vacia ni nula
        if(me.periodoSelect == "" || me.periodoSelect == null || me.periodoSelect == undefined){
          me.$vs.notify({
          text:'Debe seleccionar un periodo por favor para las guias',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
        //validar que el asesorSelect no vacia ni nula
        if(me.asesorSelect == "" || me.asesorSelect == null || me.asesorSelect == undefined){
          me.$vs.notify({
          text:'Debe seleccionar un asesor por favor para las guias',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return false;
        }
      }
      //volver a revisar que este bien el formato del excel
      if( !me.tableData[0].codigo){
        me.$vs.loading.close()
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      if(me.arregloProblemasDiagnostico.length > 0){
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      if(me.arregloProblemasPaquete.length > 0){
        me.$vs.notify({ text:'Corrija el formato del excel y vuelva a intentar.', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle'})
        return
      }
      //si selecciona un combo debe seleccionar un documento prefactura / nota
      if(me.comboSelected && me.tipoComboImportacion == 0){
        if(me.proforma.proforma == "" || me.proforma.proforma == null || me.proforma.proforma == undefined){
          me.$vs.notify({ text:'Debe seleccionar un documento prefactura / nota si se selecciona un combo', color:'warning', iconPack: 'feather', icon:'icon-alert-triangle', time:6000 })
          return
        }
      }
      if(me.errorComboEnDocumento){
        let setComboNoExisteDocumento = localStorage.getItem("setComboNoExisteDocumento")
        me.$vs.notify({ text:setComboNoExisteDocumento, color:'warning', iconPack: 'feather', icon:'icon-alert-triangle', time:6000 })
        return
      }
      if(me.tipoComboImportacion == 1){
        //el combo de tablaData no debe estar vacio
        let validateCombosVacios = me.tableData.filter(p =>
        !('combo' in p) || p.combo == ""
        );
        if (validateCombosVacios.length > 0) {
          me.m_message("En su columna de combo existe combos de libros vacios, por favor revise el archivo",'warning')
          return
        }
        //validar errorCombos
        if(me.errorCombos){
          const setComboNoExiste = localStorage.getItem("setComboNoExiste")
          me.m_message(`No existe el combo: ${setComboNoExiste} en el documento`,'warning')
          return
        }
      }
      me.errores = []
      $.each(me.tableData,function(key, value){
        if( !value.codigo){
          me.errores.push(value)
        }
      })
      if( me.errores.length > 0 ){
        me.modalErrores = true
      }else{
        me.modalConfirm = true
      }
    },
    f_validarComboDocumento(){
      let me = this
      me.errorCombos = false
      me.errorComboEnDocumento = false
      me.errorDocumentos = false
      me.arregloFormatoSend = me.arregloFormatoSendOriginal;
      //si eligen la columna codigo y combo del excel
      if(me.tipoComboImportacion == 1){
        me.comboSelected = ''

        //validar que la columna combo exista en el excel
        let validateCombosVacios = me.tableData.filter(p =>
        !('combo' in p) || p.combo == ""
        );
        if (validateCombosVacios.length > 0) {
          me.m_message("No existe su columna combo del excel o algun combo del libro vacio en su archivo del excel",'warning','icon-check',5000)
          return
        }
      }
      if(this.proforma.empresa == null || this.proforma.empresa == "" || this.proforma.empresa == undefined){
        localStorage.setItem('errorDocumentosValidate','Debe seleccionar un documento para los combos')
        me.errorDocumentos = true
        return
      }
      if(this.proforma.proforma == null || this.proforma.proforma == "" || this.proforma.proforma == undefined){
        me.errorDocumentos = true
        return
      }
      this.$http.get(this.$server_url+`metodosGetVentas?getProductoDetalleVenta=1&id_empresa=${ this.proforma.empresa }&ven_codigo=${ this.proforma.proforma }`)
      .then(function (res) {

        me.arrayCombos = res.data.filter(p => p.ifcombo == 1)
        let datos = me.arrayCombos
        if(me.tipoComboImportacion == 0){
          if(me.comboSelected == "" || me.comboSelected == null || me.comboSelected == undefined){
            // si no esta seleccionado no hacer nada
          }else{
           me.f_validacionIndividualesCombo();
          }
        }
        //si es elijen la columna  codigo y un la columna combo del excel
        if(me.tipoComboImportacion == 1){
          if(me.arrayCombos.length == 0){
            localStorage.setItem('errorDocumentosValidate','El documento no tiene combos para asignar')
            me.m_message("El documento no tiene combos para asignar","warning","icon-check",5000)
            me.errorDocumentos = true
            return
          }

          //validar que el combo del excel exista en el documento
          me.tableData.forEach(element => {
            //buscar en arrayCombos si existe el codigo colocar el documento y id_empresa
            let setCombo = me.arrayCombos.find(p => p.pro_codigo == element.combo)
            if(!setCombo){
              me.errorCombos = true
              localStorage.setItem("setComboNoExiste",element.combo)
            }
          });

          //si no hay errores en errorCombos
          if (!me.errorCombos) {
            let uniqueCombos = [...new Set(me.tableData.map(element => element.combo))]; // Extrae valores únicos
            uniqueCombos.forEach(combo => {
              let setCombo = datos.find(p => p.pro_codigo == combo);
              if (!setCombo) {
                me.m_message(`El combo ${combo} no existe en el documento de venta`, 'danger','icon-check', 5000);
                localStorage.setItem('setComboNoExisteDocumento', `El combo ${combo} no existe en el documento de venta`);
                me.errorComboEnDocumento = true;
              }else{
                me.f_validacionIndividualesCombo();
              }
            });
          }
        }
      })
      .catch(function (error) {
          console.log(error + ' error');
      })
    },
    f_validacionIndividualesCombo() {
      let me = this;
      me.errorCombos = false
      try {
        // Enriquecer arregloFormatoSend con información de combos
        me.arregloFormatoSend = me.arregloFormatoSend.map(item => {
          let comboEncontrado = null; // Inicializar comboEncontrado
          if(me.tipoComboImportacion == 0){
            comboEncontrado  = me.arrayCombos.find(combo => combo.pro_codigo == me.comboSelected);
          }else if(me.tipoComboImportacion == 1){
             // Buscar el combo en arrayAllCombos por codigo_liquidacion
           comboEncontrado = me.arrayAllCombos.find(combo => combo.codigo_liquidacion == item.combo);
          }
          if (comboEncontrado) {
            return {
              ...item,
              nombre_combo: comboEncontrado.nombre,
              codigos_combos_array: comboEncontrado.codigos_combos ? comboEncontrado.codigos_combos.split(',') : [],
              codigos_combos: comboEncontrado.codigos_combos,
              ifErrorCombo: 0,
              messageError: '',
              combo: comboEncontrado.codigo_liquidacion,
            };
          } else {
            return {
              ...item,
              nombre_combo: '',
              codigos_combos_array: [],
              codigos_combos:'',
              ifErrorCombo: 1,
              messageError: `No existe el combo ${item.combo}`,
              combo: item.combo,
            };
          }
        });

        // BUSCAR CODIGO EN CODIGOS INDIVIDUALES
        me.arregloFormatoSend =me.arregloFormatoSend.map(p => {
          return{
            ...p,
            codigosHijos:me.arrayAgrupadosCombos.filter(item => item.codigoCombo == p.codigo) || []
          }
        })

        console.log("arregloFormatoSend2", me.arregloFormatoSend);

        // Validar si algún combo no tiene códigos asignados
        let combosSinCodigos = me.arregloFormatoSend.filter(item => item.codigosHijos.length == 0);
        if (combosSinCodigos.length > 0) {
          me.errorCombos = true;
          combosSinCodigos.forEach(item => {
            me.$vs.notify({
              text: `No existe códigos asignados al combo: ${item.combo}`,
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            });
            // Agregar al arrayErroresValidacionCombos
            me.arrayErroresValidacionCombos.push({
              codigoCombo: item.codigo,
              codigos_combos: item.codigos_combos || '',
              error: 'No existe códigos asignados al combo',
              combo: item.combo
            });
          });
          me.tableData = [];
          me.arregloProblemasPaquete = [];
          //abrir el modal de errores
          me.popupMostrarErroresCombosNoCoindicen = true;
          return;
        }


        //validar del arregloFormatoSend si no existen el combo
        me.errorCombos = me.arregloFormatoSend.some(item => item.ifErrorCombo == 1);
        if(me.errorCombos){
          me.errorComboEnDocumento = true;
          me.$vs.notify({
            text: 'No existe el combo en la base de datos' + me.arregloFormatoSend[0].combo,
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          });
          me.tableData = [];
          me.arregloProblemasPaquete = [];
        }else{
          me.f_validateCodigosDelCombo();
        }
      } catch (err) {
        console.log("err", err);
        alert("Hubo problemas con tu archivo excel");
      }
    },
    f_validateCodigosDelCombo(){
      let me = this;
      if(me.arrayAgrupadosCombos.length == 0) {
        me.$vs.notify({
          text: 'No existe codigos en los codigos en los combos',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        return;
      }
      me.arrayAgrupadosCombos = me.arrayAgrupadosCombos.map(item => {
        // Buscar el combo en arrayAllCombos por codigo_liquidacion
        const comboEncontrado = me.arregloFormatoSend.find(combo => combo.codigo == item.codigoCombo);
        return {
          ...item,
          combo: comboEncontrado ? comboEncontrado.combo : '',
          codigosDelCombo: comboEncontrado ? comboEncontrado.codigos_combos_array : [],
          codigos_combos: comboEncontrado ? comboEncontrado.codigos_combos : '',
        }
      });
      console.log("arrayAgrupadosCombosResult", me.arrayAgrupadosCombos);
      // Array para almacenar errores de validación
      me.arrayErroresValidacionCombos = [];

      // Validar cada combo
      me.arrayAgrupadosCombos.forEach(combo => {
        let errores = [];

        // Extraer códigos de liquidación de codigosHijos
        const codigosLiquidacionHijos = combo.codigosHijos.map(hijo => hijo.codigo_liquidacion);

        // Validación 1: Misma cantidad de códigos
        if (codigosLiquidacionHijos.length !== combo.codigosDelCombo.length) {
          if (codigosLiquidacionHijos.length > combo.codigosDelCombo.length) {
            errores.push("El combo tiene más códigos de los esperados");
          } else {
            errores.push("El combo tiene menos códigos de los esperados");
          }
        }

        // Validación 2: No se pueden repetir los mismos codigo_liquidacion
        const codigosUnicos = [...new Set(codigosLiquidacionHijos)];
        if (codigosUnicos.length !== codigosLiquidacionHijos.length) {
          errores.push("Hay códigos de liquidación duplicados");
        }

        // Validación 3: Los códigos deben existir en codigosDelCombo
        const codigosFaltantes = codigosLiquidacionHijos.filter(codigo => !combo.codigosDelCombo.includes(codigo));
        const codigosSobrantes = combo.codigosDelCombo.filter(codigo => !codigosLiquidacionHijos.includes(codigo));

        if (codigosFaltantes.length > 0) {
          errores.push(`Códigos no válidos para este combo: ${codigosFaltantes.join(', ')}`);
        }

        if (codigosSobrantes.length > 0) {
          errores.push(`Faltan códigos del combo: ${codigosSobrantes.join(', ')}`);
        }

        // Si hay errores, agregar al array de errores
        if (errores.length > 0) {
          me.arrayErroresValidacionCombos.push({
            codigoCombo: combo.codigoCombo,
            codigos_combos: combo.codigos_combos,
            error: errores.join(' | '),
            combo: combo.combo,
          });
        }
      });


      // Si hay errores de validación, mostrar notificación
      if (me.arrayErroresValidacionCombos.length > 0) {
        me.$vs.notify({
          text: `Se encontraron ${me.arrayErroresValidacionCombos.length} errores en la validación de combos`,
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        });
        me.popupMostrarErroresCombosNoCoindicen = true;
      }else{
        me.$vs.notify({
          text: 'Todos los codigos de cada combo del libro han sido validados correctamente',
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-check'
        });
      }
    },
    f_limpiarCancelar(){
      let me = this
      me.popupConfirmTipoImportado = false
      me.comboSelected = ''
      me.errorCombos = false
      me.errorComboEnDocumento = false
      me.errorDocumentos = false
      me.arrayCombos = []
      me.arrayCodigosBloqueados = []
      me.codigosNoCambiados = ''
      me.codigosNoExisten = []
      me.arrayCodigosEncontrados = []
      me.tableData = []
      me.arregloProblemasDiagnostico = []
      me.arrayCodigosNoEnDocumento = []
    },
    async despacharDocumento() {
      let me = this

      // Validar que tengamos el documento
      if (!me.documentoVentaEscaneado) {
        me.$vs.notify({
          title: 'Error',
          text: 'No se encontró el documento de venta',
          color: 'danger',
          icon: 'error'
        })
        return
      }

      const empresaParaDespacho = me.empresaVentaEscaneada || me.proforma.empresa
      if (!empresaParaDespacho) {
        me.$vs.notify({
          title: 'Error',
          text: 'No se encontró la empresa del documento',
          color: 'danger',
          icon: 'error'
        })
        return
      }

      // Preparar FormData
      let formData = new FormData()
      formData.append('ven_codigo', me.documentoVentaEscaneado)
      formData.append('id_empresa', empresaParaDespacho)
      formData.append('user_despacha', me.usuario.idusuario)

      // Agregar comentario si existe (aunque el API no lo usa, lo dejamos para futuro)
      if (me.comentarioDespacho) {
        formData.append('comentario', me.comentarioDespacho)
      }

      try {
        me.$vs.loading()
        const url = `${me.$server_url}metodosPostCodigos?Post_enviarDespacharDocumento=1`
        const response = await me.$http.post(url, formData)

        me.$vs.loading.close()

        if (response.data.status === 1) {
          me.$vs.notify({
            title: 'Éxito',
            text: response.data.message || 'Documento enviado a empacado correctamente',
            color: 'success',
            icon: 'check_circle'
          })

          // Cerrar modal y limpiar
          const docParaBusqueda = me.documentoVentaEscaneado
          me.popupEstadoEscaneo = false
          me.comentarioDespacho = ''
          me.escaneoFinalizado = false
          me.documentoVentaEscaneado = ''
          me.empresaVentaEscaneada = ''
          me.totalCodigosReal = 0
          me.totalCodigosSubidos = 0
          me.arrayInformacionDocumento = []
          me.tableData = []
          me.codigosPerdidos = false
          me.$nextTick(() => {
            if (me.$refs.gestionBodegaInstitucion) {
              me.$refs.gestionBodegaInstitucion.limpiarTodo(true)
              if (docParaBusqueda) me.$refs.gestionBodegaInstitucion.busqueda = docParaBusqueda
            }
          })
        } else {
          me.$vs.notify({
            title: 'Error',
            text: response.data.message || 'No se pudo enviar a empacado el documento',
            color: 'danger',
            icon: 'error'
          })
        }
      } catch (error) {
        me.$vs.loading.close()
        console.error('Error al enviar a empacado el documento:', error)
        me.$vs.notify({
          title: 'Error',
          text: 'Error al enviar a empacado el documento. Intente nuevamente.',
          color: 'danger',
          icon: 'error'
        })
      }
    },
    handleCerrarModalEscaneo() {
      let me = this
      // Solo cerrar el popup, sin limpiar nada
      me.popupEstadoEscaneo = false
    },
    limpiarExcel() {
      let me = this
      me.tableData = []
      me.header = []
      me.totalCodigos = 0
      me.arregloProblemasDiagnostico = []
      me.arregloProblemasPaquete = []
      me.arrayCodigosNoEnDocumento = []
      me.arrayErroresValidacionCombos = []
      me.CodigosNoEncontrados = []
      me.arrayCodigosEncontrados = []
      me.arrayCodigosBloqueados = []
      me.$vs.notify({
        title: 'Listo',
        text: 'Puedes subir un nuevo archivo',
        color: 'success',
        iconPack: 'feather',
        icon: 'icon-check'
      })
    },
  }
}

</script>
<style scoped>
.tabla{
  width: 100%;
  margin-top: 10px;
}
 .tabla {

  border: 1px solid #D1E5F1;
  padding: 2px;
  border-radius: 5px;
}
.th1{
  background-color: #2D9ADA;
  border-radius: 5px;
  color:white;
}
.td1, .th1{
 padding: 10px;
 text-align: center;
 border:none;
}
/* Estilos para el selector de tipo de búsqueda */
/* Radio buttons simples */
.search-type-radios {
  display: flex;
  gap: 24px;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid #e0e0e0;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.radio-option input[type="radio"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #667eea;
}

.radio-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  transition: color 0.2s ease;
}

.radio-label i {
  font-size: 16px;
  color: #667eea;
}

.radio-option:hover .radio-label {
  color: #667eea;
}

/* Contenedor de búsqueda */
.search-container {
  width: 100%;
  margin-top: 8px;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.search-input-wrapper {
  width: 100%;
}

/* Contenedor de tipo de venta y comentario */
.tipo-venta-comentario-container {
  width: 100%;
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* Tipo de venta y comentario en la misma fila */
.tipo-venta-comentario-row {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
  align-items: flex-start;
}

/* Sección de tipo de venta */
.tipo-venta-section {
  flex: 0 0 auto;
  min-width: 250px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.tipo-venta-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.tipo-venta-icon {
  color: #667eea;
  font-size: 16px;
}

.tipo-venta-text {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.tipo-venta-status {
  display: flex;
  justify-content: flex-start;
}

/* Sección de comentario */
.comentario-section {
  flex: 1;
  min-width: 300px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.comentario-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.comentario-label i {
  color: #667eea;
  font-size: 16px;
}

.comentario-input {
  width: 100%;
}

.comentario-input >>> .vs-inputx {
  height: 48px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.comentario-input >>> .vs-inputx:focus {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

/* Indicador de estado tipo radio */
.status-indicator {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  background: #f8f9fa;
  border-radius: 50px;
  border: 2px solid transparent;
  transition: all 0.3s ease;
}

.status-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-dot::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: white;
  position: absolute;
}

.status-text {
  font-size: 14px;
  font-weight: 600;
}

/* Estados */
.status-indicator.success {
  background: #e8f5e9;
  border-color: #4caf50;
}

.status-indicator.success .status-dot {
  background: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
}

.status-indicator.success .status-text {
  color: #2e7d32;
}

.status-indicator.primary {
  background: #e3f2fd;
  border-color: #2196f3;
}

.status-indicator.primary .status-dot {
  background: #2196f3;
  box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.2);
}

.status-indicator.primary .status-text {
  color: #1565c0;
}

.status-indicator.warning {
  background: #fff3e0;
  border-color: #ff9800;
}

.status-indicator.warning .status-dot {
  background: #ff9800;
  box-shadow: 0 0 0 3px rgba(255, 152, 0, 0.2);
}

.status-indicator.warning .status-text {
  color: #e65100;
}

/* Estilos para el label de búsqueda */
.search-label {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-label i {
  color: #667eea;
  font-size: 16px;
}

/* Input con botón en línea */
.input-with-button {
  display: flex;
  gap: 12px;
  align-items: stretch;
  width: 100%;
}

.search-input-field {
  flex: 1;
  min-width: 0;
}

.search-input-field >>> .vs-inputx {
  height: 48px;
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 2px solid #e0e0e0;
  transition: all 0.3s ease;
}

.search-input-field >>> .vs-inputx:focus {
  border-color: #667eea;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.2);
}

.search-input-field >>> .vs-icon {
  font-size: 18px;
  color: #667eea;
}

/* Botón de búsqueda en línea */
.search-button-inline {
  height: 48px;
  padding: 0 32px;
  font-weight: 600;
  font-size: 15px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(33, 150, 243, 0.3);
  transition: all 0.3s ease;
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-button-inline i {
  font-size: 16px;
}

.search-button-inline:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(33, 150, 243, 0.4);
}

/* Responsive */
@media (max-width: 768px) {
  .search-type-radios {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .input-with-button {
    flex-direction: column;
  }

  .search-button-inline {
    width: 100%;
    justify-content: center;
  }

  .tipo-venta-comentario-row {
    flex-direction: column;
    gap: 20px;
  }

  .tipo-venta-section {
    width: 100%;
    min-width: 100%;
  }

  .comentario-section {
    width: 100%;
    min-width: 100%;
  }

  .tipo-venta-status {
    width: 100%;
  }

  .status-indicator {
    width: 100%;
    justify-content: center;
  }
}

/* Estilos para la tarjeta de institución asignada */
.institucion-asignada-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 8px 24px rgba(102, 126, 234, 0.3);
  width: 100%;
  animation: slideIn 0.4s ease;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.institucion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.institucion-info {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  flex: 1;
}

.institucion-icon {
  font-size: 32px;
  color: #4caf50;
  background: white;
  padding: 12px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.institucion-label {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 4px 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.institucion-nombre {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.institucion-periodo {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.institucion-periodo i {
  font-size: 16px;
}

.periodo-text {
  font-weight: 600;
  color: #ffd700;
}

.delete-button {
  background: rgba(255, 255, 255, 0.15) !important;
  color: white !important;
  border: 1px solid rgba(255, 255, 255, 0.25) !important;
  padding: 6px 14px !important;
  font-weight: 500 !important;
  font-size: 12px !important;
  transition: all 0.3s ease !important;
}

.delete-button:hover {
  background: rgba(244, 67, 54, 0.85) !important;
  border-color: #f44336 !important;
  transform: scale(1.03);
}

/* Estilos existentes */

.features {
  display: flex;
  flex-direction: column;
}
.features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.features li + * {
  margin-top: 0.75rem;
}
.features .icon {
  background-color: #1FCAC5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
.features .icon svg {
  width: 14px;
  height: 14px;
}
.features + * {
  margin-top: 1.25rem;
}
.text-container {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap; /* Permite que el texto se ajuste cuando no cabe */
  width: 100%;
  box-sizing: border-box; /* Asegura que el padding no afecte el ancho total */
}

.responsive-text {
  color: red;
  font-weight: bold;
  word-wrap: break-word; /* Permite que las palabras largas se dividan en varias líneas */
  white-space: normal; /* Permite que el texto se ajuste dentro del contenedor */
  overflow: hidden;    /* Oculta cualquier texto que se desborde */
  text-overflow: ellipsis; /* Agrega puntos suspensivos al final si el texto es demasiado largo */
  max-width: 100%; /* Asegura que el texto se ajuste al contenedor */
  font-size: 1em; /* Puedes ajustar el tamaño si es necesario */
}

.text-primary {
  color: blue; /* El color para el periodo */
}

/* Estilos existentes */
.modal-confirm-content {
  padding: 10px;
}

.modal-header-section {
  margin-bottom: 20px;
}

.modal-info-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 16px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.modal-info-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.modal-info-card.accion-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
}

.modal-info-card.accion-card .info-label,
.modal-info-card.accion-card .info-value {
  color: white;
}

.modal-info-card.documento-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-left: 4px solid #2196f3;
}

.card-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.info-row:last-child {
  border-bottom: none;
}

.info-label {
  font-size: 14px;
  color: #666;
  font-weight: 500;
  min-width: 140px;
}

.modal-info-card.accion-card .info-label {
  font-size: 16px;
  font-weight: 600;
}

.info-value {
  font-size: 14px;
  color: #333;
  text-align: right;
  flex: 1;
}

.modal-info-card.accion-card .info-value {
  font-size: 16px;
  font-weight: 600;
}

/* Badge pequeño para tipo de venta en modal */
.badge-venta {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 500;
  gap: 6px;
}

.badge-venta i {
  font-size: 14px;
}

.badge-venta.success {
  background-color: #4caf50;
  color: white;
}

.badge-venta.primary {
  background-color: #2196f3;
  color: white;
}

.badge-venta.warning {
  background-color: #ff9800;
  color: white;
}

.badge-venta.info {
  background-color: #00897b;
  color: white;
}

/* Estilos para la tarjeta compacta de institución */
.institucion-asignada-card-compacta {
  background: linear-gradient(135deg, #5b6f9e 0%, #6b7fa8 100%);
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(91, 111, 158, 0.25);
  width: 100%;
  animation: slideIn 0.4s ease;
}

.institucion-header-compacta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}

.institucion-info-compacta {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  flex: 1;
}

.institucion-info-compacta .institucion-icon {
  font-size: 24px;
  color: #4caf50;
  background: white;
  padding: 8px;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.institucion-info-compacta .institucion-label {
  font-size: 10px;
  color: #f5f7fa;
  margin: 0 0 2px 0;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
}

.institucion-info-compacta .institucion-nombre {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
  line-height: 1.2;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.institucion-info-compacta .institucion-periodo {
  font-size: 11px;
  color: #f5f7fa;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 6px;
}

.institucion-info-compacta .institucion-periodo i {
  font-size: 12px;
}

.institucion-info-compacta .periodo-text {
  font-weight: 600;
  color: #ffd54f;
}

/* Grid de información compactada */
.info-compacta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  background: transparent;
  padding: 12px;
  border-radius: 8px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .info-label {
  font-size: 10px;
  color: #f5f7fa;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: auto;
}

.info-item .info-label i {
  font-size: 11px;
}

.info-item .info-value {
  font-size: 13px;
  color: #ffffff;
  font-weight: 600;
  text-align: left;
}

.info-item .info-value .text-muted {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
  font-size: 12px;
}

/* Status chips pequeños */
.status-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  white-space: nowrap;
}

.status-chip.success {
  background: rgba(76, 175, 80, 0.25);
  border: 1px solid rgba(76, 175, 80, 0.5);
  color: #c8e6c9;
}

.status-chip.primary {
  background: rgba(33, 150, 243, 0.25);
  border: 1px solid rgba(33, 150, 243, 0.5);
  color: #bbdefb;
}

.status-chip.warning {
  background: rgba(255, 152, 0, 0.25);
  border: 1px solid rgba(255, 152, 0, 0.5);
  color: #ffe0b2;
}

.status-dot-small {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

.status-chip.success .status-dot-small {
  background: #81c784;
  box-shadow: 0 0 0 2px rgba(129, 199, 132, 0.3);
}

.status-chip.primary .status-dot-small {
  background: #64b5f6;
  box-shadow: 0 0 0 2px rgba(100, 181, 246, 0.3);
}

.status-chip.warning .status-dot-small {
  background: #ffb74d;
  box-shadow: 0 0 0 2px rgba(255, 183, 77, 0.3);
}

/* Badge de documento */
.documento-badge {
  background: rgba(255, 255, 255, 0.2);
  padding: 4px 10px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 12px;
  border: 1px solid rgba(255, 255, 255, 0.35);
  display: inline-block;
  color: #ffffff;
}

/* Contenedor de comentario simple */
.comentario-container-simple {
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border: 1px solid #e8e8e8;
  transition: all 0.3s ease;
  width: 100%;
}

.comentario-container-simple:hover {
  border-color: #7c8db5;
  box-shadow: 0 3px 10px rgba(124, 141, 181, 0.12);
}

.comentario-label-simple {
  font-size: 12px;
  font-weight: 600;
  color: #555;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.comentario-label-simple i {
  color: #7c8db5;
  font-size: 13px;
}

.comentario-input-simple {
  width: 100%;
}

.comentario-input-simple >>> .vs-inputx {
  border-radius: 6px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
  font-size: 13px;
}

.comentario-input-simple >>> .vs-inputx:focus {
  border-color: #7c8db5;
  box-shadow: 0 0 0 3px rgba(124, 141, 181, 0.08);
}

/* Responsive para grid compacto */
@media (max-width: 768px) {
  .info-compacta-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .institucion-header-compacta {
    flex-direction: column;
    align-items: flex-start;
  }

  .delete-button {
    width: 100%;
  }
}

/* Estilos para contenedores principales */
.gestion-bodega-container {
  width: 100%;
}

.gestion-bodega-content {
  width: 100%;
}

/* ============================================ */
/*  ESTILOS PARA SECCIÓN DE IMPORTACIÓN COMPACTA  */
/* ============================================ */

.seccion-importacion-compacta {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 14px 16px;
  margin-bottom: 16px;
}

.header-importacion-compacta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}

.info-excel-cargado {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #1e293b;
  font-size: 14px;
}

.info-excel-cargado i {
  font-size: 16px;
  color: #16a34a;
}

.acciones-compactas {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.acciones-compactas .vs-button {
  font-weight: 600;
}

.botones-errores-compactos {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  padding-top: 10px;
  border-top: 1px solid #e2e8f0;
  margin-top: 8px;
}

@media (max-width: 768px) {
  .header-importacion-compacta {
    flex-direction: column;
    align-items: flex-start;
  }

  .acciones-compactas {
    width: 100%;
  }

  .acciones-compactas button {
    flex: 1;
  }
}

/* ============================================ */
/*  TABLA CRUCE FACTURADO vs POR SUBIR          */
/* ============================================ */
.cruce-filtro-row {
  padding: 6px 8px 8px;
  display: flex;
  align-items: center;
}

.cruce-filtro-label {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #475569;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
}

.cruce-filtro-label input[type="checkbox"] {
  width: 15px;
  height: 15px;
  cursor: pointer;
  accent-color: #4338ca;
}

.tabla-cruce-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-top: 8px;
}

.tabla-cruce {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 13px;
}

.tabla-cruce thead th {
  padding: 8px 12px;
  color: #475569;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  background: #f1f5f9;
  border-bottom: 1px solid #e2e8f0;
}

.tabla-cruce tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s;
}

.tabla-cruce tbody tr:hover {
  background: #f8fafc;
}

.tabla-cruce tbody td {
  padding: 8px 12px;
  color: #334155;
  vertical-align: middle;
}

.cruce-nombre {
  font-size: 12px;
  color: #475569;
}

.badge-cruce-combo {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  background: #eef2ff;
  color: #4338ca;
  border: 1px solid #a5b4fc;
  padding: 1px 7px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 700;
}

.cruce-ok { color: #16a34a; font-weight: 700; }
.cruce-warn { color: #d97706; font-weight: 700; }
.cruce-subir { color: #4338ca; font-weight: 700; }
.cruce-subir-active { color: #16a34a; font-weight: 700; font-size: 14px; }
.cruce-subir-zero { color: #cbd5e1; font-weight: 600; }
.cruce-subir-danger { color: #dc2626; font-weight: 700; font-size: 14px; }
.cruce-disponible { color: #0891b2; font-weight: 700; }

.cruce-row-active { background: #f0fdf4 !important; }
.cruce-row-active:hover { background: #dcfce7 !important; }
.cruce-row-inactive { opacity: 0.75; }
.cruce-row-danger { background: #fef2f2 !important; }
.cruce-row-danger:hover { background: #fee2e2 !important; }

.cruce-check-cell { width: 30px; }
.cruce-icon-ok { color: #16a34a; font-size: 15px; }
.cruce-icon-empty { color: #cbd5e1; font-size: 15px; }
.cruce-icon-danger { color: #dc2626; font-size: 15px; }

.cruce-filtro-danger { color: #dc2626; font-weight: 600; }
.ml-3 { margin-left: 16px; }

.alert-despachado-completo {
  background: #f0fdf4;
  border: 1px solid #86efac;
  border-radius: 6px;
  padding: 8px 14px;
  color: #15803d;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.alert-despachado-completo i {
  color: #16a34a;
  font-size: 15px;
}

.cruce-total-row td {
  background: #f8fafc;
  padding: 8px 12px;
  font-size: 13px;
}

.ml-1 { margin-left: 4px; }

/* ============================================ */
/*  ESTILOS PARA DETALLE DE DOCUMENTO INLINE   */
/* ============================================ */

.documento-detalle-header-compact h3 {
  color: #1e293b;
  margin: 0;
  font-size: 16px;
}

.documento-detalle-header-compact p {
  margin: 0;
  font-size: 12px;
}

.tabla-documento-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.tabla-documento {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.tabla-documento thead {
  background: #f1f5f9;
}

.tabla-documento thead th {
  padding: 9px 12px;
  text-align: left;
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  color: #475569;
  border-bottom: 1px solid #e2e8f0;
}

.tabla-documento thead th:nth-child(4),
.tabla-documento thead th:nth-child(5),
.tabla-documento thead th:nth-child(6) {
  text-align: center;
}

.tabla-documento tbody tr {
  border-bottom: 1px solid #f1f5f9;
  transition: background 0.15s;
}

.tabla-documento tbody tr:hover {
  background-color: #f8fafc;
}

.tabla-documento tbody tr.combo-row {
  background-color: #fffbeb;
}

.tabla-documento tbody tr.combo-row:hover {
  background-color: #fef9c3;
}

.tabla-documento tbody td {
  padding: 9px 12px;
  font-size: 13px;
  color: #334155;
}

.tabla-documento tbody td strong { font-size: 13px; }
.tabla-documento tbody td small  { font-size: 11px; }

.badge-combo,
.badge-individual {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 600;
  text-transform: uppercase;
}

.badge-combo {
  background: #fdf4ff;
  color: #7e22ce;
  border: 1px solid #e9d5ff;
}

.badge-individual {
  background: #eff6ff;
  color: #1d4ed8;
  border: 1px solid #bfdbfe;
}

.progress-container {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar-wrapper {
  flex: 1;
  height: 16px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar {
  height: 100%;
  transition: width 0.5s ease, background-color 0.3s ease;
  border-radius: 8px;
}

.progress-text {
  min-width: 45px;
  text-align: right;
  font-weight: 700;
  font-size: 12px;
  color: #334155;
}

.resumen-compacto {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
  font-size: 12px;
  border: 1px solid #e2e8f0;
}

.resumen-compacto .resumen-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.resumen-compacto .resumen-item i { font-size: 13px; }
.resumen-compacto .resumen-item strong { font-size: 13px; color: #1e293b; }
.resumen-compacto .separator { color: #cbd5e1; }

@media (max-width: 768px) {
  .tabla-documento thead th,
  .tabla-documento tbody td {
    padding: 7px 6px;
    font-size: 11px;
  }

  .resumen-compacto {
    flex-wrap: wrap;
    gap: 8px;
    font-size: 11px;
  }

  .resumen-compacto .separator { display: none; }
}
</style>
