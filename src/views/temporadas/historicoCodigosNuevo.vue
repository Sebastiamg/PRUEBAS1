<template>
  <div>
      <vx-card title="Información de Verificaciones" title-color="primary" :subtitle="nombreInstitucion">
          <div style="display:flex;margin-left:20px;" v-if="desdePedido == 0">
              <div>
                  <vs-input icon="search" @keyup.enter="getInformacionLiquidacion()" placeholder="Buscar Contrato" v-model="contrato" />
              </div>
              <div>
                  <vs-button radius color="primary" @click="getInformacionLiquidacion()" type="border" style="margin-left:10px;" icon="search"></vs-button>
              </div>
          </div>
          <!--VENTA REAL-->
          <!-- <VentaRealVue v-if="contrato" :contrato="contrato"/> -->
          <!--FIN VENTA REAL-->
          <p class="text-2xl">Detalles</p>
          <vs-divider></vs-divider>
          <div>
              <br>
              <vs-chip transparent color="primary" class="ml-2">
                  Cantidad Verificaciones: <span style="font-weight: bold;"> {{ InformacionLiquidacion.length }}</span>
              </vs-chip>
              <br />
              <vs-table max-items="10" stripe search pagination :data="InformacionLiquidacion" style="margin-top:-40px">
                  <template slot="thead">
                      <vs-th>Contratos</vs-th>
                      <vs-th>Verificación</vs-th>
                      <vs-th>Fechas</vs-th>
                      <!-- <vs-th>Documentos</vs-th> -->
                      <vs-th colspan="2">Acciones</vs-th>
                  </template>
                  <template slot-scope="{data}">
                      <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                          <vs-td>
                              #{{ tr.id }}
                              <br> {{data[indextr].contrato}}<br>
                          </vs-td>
                          <vs-td>
                              <b>Núm. verificación:</b>
                              <p>{{data[indextr].num_verificacion}}</p><br>
                              <div v-if="tr.estado == '0'">
                                  <tr>
                                      <b>Estado verificación:</b><br>
                                      <vs-chip v-if="tr.estado == '1'" color="primary">
                                          Abierto
                                      </vs-chip>
                                      <vs-chip v-else color="warning" class="mt-2">
                                          Cerrada
                                      </vs-chip>
                                  </tr>
                                  <tr class="no-click">
                                      <b>Estado revision:</b><br>
                                      <vs-chip v-if="tr.estado_revision == '1'" color="primary">
                                          Revisado
                                      </vs-chip>
                                      <vs-chip v-else-if="tr.estado_revision == '0'" color="danger" class="mt-2">
                                          Pendiente de revisión
                                      </vs-chip>
                                  </tr>
                              </div>
                              <div v-if="tr.estado == '1'">
                                  <b>Estado verificación:</b><br>
                                  <vs-chip v-if="tr.estado == '1'" color="primary">
                                      Abierto
                                  </vs-chip>
                                  <vs-chip v-else color="warning" class="mt-2">
                                      Cerrada
                                  </vs-chip>
                              </div>
                          </vs-td>
                          <vs-td>
                              <b>Fecha inicio:</b>
                              <p>{{tr.fecha_inicio}}</p><br>
                              <b>Fecha fin:</b>
                              <p>{{tr.fecha_fin}}</p>
                          </vs-td>
                          <vs-td>
                              <!--Observacion Revision-->
                              <div>
                                  <div v-if="tr.observacion.length > 0" class="alerta observacion-revision text-center" @click="pedido = tr;openObservacion()">
                                      <strong>Observaciónes ( {{ tr.observacion.length }} )</strong>
                                  </div>
                              </div>
                              <!-- Evidencia Verificación -->
                              <div v-if="tr.file_evidencia && tr.file_evidencia.length">
                                  <div v-for="(fileR, indexR) in tr.file_evidencia" :key="'evidencia' + indexR">
                                      <p class="imagen" @click="tipoDocumento = 'evidencia'; documento = fileR; tabDoc=0; openDocument(tr, tr.file_evidencia[indexR],'evidencia')">
                                          <b>{{ indexR + 1 }} .- Evidencia Verificación
                                              <i v-if="fileR.egf_archivo.substr(-3) === 'pdf'" class="fa-solid fa-file-pdf icono-pastel rojo"></i>
                                              <i v-else-if="fileR.egf_archivo.substr(-4) === 'docx'" class="fa-solid fa-file-word icono-pastel azul"></i>
                                              <ion-icon v-else class="icono-pastel verde" name="camera-outline"></ion-icon>
                                          </b>
                                      </p>
                                      <p class="text-sm">Fecha subida evidencia: {{ fileR.created_at }}</p>
                                      <p class="text-sm" v-if="fileR.creador">Responsable de Subida Evidencia: {{ fileR.creador }}</p>
                                      <p class="text-sm" v-else>Responsable de Subida Evidencia: Ninguno</p>
                                  </div>
                              </div>

                              <!-- Factura -->
                              <div v-if="tr.file_factura && tr.file_factura.length">
                                  <div v-for="(fileF, indexF) in tr.file_factura" :key="'factura' + indexF">
                                      <p class="imagen" @click="tipoDocumento = 'factura'; documento = fileF; tabDoc=1; openDocument(tr, tr.file_factura[indexF],'factura')">
                                          <b>{{ indexF + 1 }} .- Factura
                                              <i v-if="fileF.egf_archivo.substr(-3) === 'pdf'" class="fa-solid fa-file-pdf icono-pastel rojo"></i>
                                              <i v-else-if="fileF.egf_archivo.substr(-4) === 'docx'" class="fa-solid fa-file-word icono-pastel azul"></i>
                                              <ion-icon v-else class="icono-pastel verde" name="camera-outline"></ion-icon>
                                          </b>
                                      </p>
                                      <p class="text-sm">Fecha subida evidencia: {{ fileF.created_at }}</p>
                                      <p class="text-sm" v-if="fileF.creador">Responsable de Subida Factura: {{ fileF.creador }}</p>
                                      <p class="text-sm" v-else>Responsable de Subida Factura: Ninguno</p>
                                  </div>
                                  <vs-button v-if="userAsesor && tr.estado == 0 && tr.file_factura" @click="pedido = tr;f_notificacionFactura(1);" class="p-2"><i class="fa-solid fa-bell"></i> Notificar a facturación</vs-button>
                              </div>

                              <!-- Revisones -->
                              <div v-if="tr.files_revision && tr.files_revision.length">
                                  <div v-for="(file, index) in tr.files_revision" :key="index">
                                      <p class="imagen" @click="tipoDocumento = 'revisiones'; documento = file.egf_archivo; tabDoc=2; openDocument(tr, tr.files_revision[index],'revisiones')">
                                          <b>{{ index + 1 }} .- Evidencia Revisión
                                              <i v-if="file.egf_archivo.substr(-3) === 'pdf'" class="fa-solid fa-file-pdf icono-pastel rojo"></i>
                                              <i v-else-if="file.egf_archivo.substr(-4) === 'docx'" class="fa-solid fa-file-word icono-pastel azul"></i>
                                              <ion-icon v-else class="icono-pastel verde" name="camera-outline"></ion-icon>
                                          </b>
                                      </p>
                                      <p class="text-sm" v-if="tr.files_revision.length > 0">Fecha de subida Revisión: {{ file.created_at }}</p>
                                      <p class="text-sm" v-if="file.creador">Responsable de Subida Revisión: {{ file.creador }}</p>
                                      <p class="text-sm" v-else>Responsable de Subida Revisión: Ninguno</p>
                                  </div>
                              </div>
                          </vs-td>
                          <vs-td>
                              <vs-dropdown vs-custom-content vs-trigger-click>
                                  <vs-button class="a-icons" href.prevent icon="more_vert" type="border" v-if="tr.estado == 0"></vs-button>
                                  <vs-dropdown-menu style="width: 320px;" class="cursor">
                                      <!--VER DETALLE-->
                                      <vs-dropdown-item>
                                          <vs-button class="w-full" color="primary" @click="startDetalle(tr)" type="line">Ver detalle </vs-button>
                                      </vs-dropdown-item>
                                      <!--OBSERVACION-->
                                      <vs-dropdown-item v-if="desdePedido == 1 && (userFacturador || userRoot || userAsesor) ">
                                          <vs-button color="warning" type="line" class="w-full" @click="pedido = tr;openObservacion()">Observación</vs-button>
                                      </vs-dropdown-item>
                                      <vs-dropdown-item v-if="desdePedido == 1 && (userFacturador || userRoot)">
                                          <!--estado => 0 = cerrada; 1 = abierta;-->
                                          <!--FACTURADOR SUBE EVIDENCIA DE VERIFICACION-->
                                          <vs-button color="success" type="line" class="w-full" @click="pedido = tr;obtenerArchivosGuardados('verificacion')">&nbsp;&nbsp;&nbsp;Subir evidencia &nbsp;&nbsp;&nbsp;</vs-button>
                                      </vs-dropdown-item>
                                      <!--ASESOR SUBE FACTURA-->
                                      <vs-dropdown-item v-if="(userAsesor || userRoot || userFacturador)">
                                          <vs-button color="danger" type="line" class="w-full" @click="pedido = tr;obtenerArchivosGuardados('factura')">Subir Factura</vs-button>
                                      </vs-dropdown-item>
                                      <vs-dropdown-item v-if="desdePedido == 1 && (userFacturador || userRoot)">
                                          <!--VER DOCUMENTOS-->
                                          <vs-button color="primary" type="line" class="w-full" @click="tabDoc=0;previewFactura=null;verDocumentos(tr)"><i class="fa-solid fa-folder-open"></i>Ver Documentos</vs-button>
                                      </vs-dropdown-item>
                                      <vs-divider v-if="!disableAsesor">SECCIÓN-REVISIÓN</vs-divider>
                                      <vs-dropdown-item v-if="desdePedido == 1 && (userFacturador || userRoot) && (tr.estado_revision == 0 || tr.estado_revision == 1)">
                                          <!--SUBE EVIDENCIA DE REVISION-->
                                          <vs-button type="line" class="w-full" color="red" @click="pedido = tr;obtenerArchivosGuardados('revision');">Subir evidencia revisión <i class="fa-solid fa-file-pdf" style="font-size:20px;color:red;position:relative;"></i></vs-button>
                                      </vs-dropdown-item>
                                      <vs-divider v-if="!disableAsesor"></vs-divider>
                                  </vs-dropdown-menu>
                              </vs-dropdown>
                          </vs-td>
                      </vs-tr>
                  </template>
              </vs-table>
          </div>
      </vx-card>
      <!--MODALES-->
      <!--MODAL PARA DETALLES DE LA VERIFICACION -->
      <vs-popup class="informacionformhijo" :title="title" fullscreen :active.sync="popupDetalleVerificacion" @close="filtroMenu = 100;">
        <!--MENU-->
          <nav class="breadcrumbs mt-3">
              <span class="breadcrumbs__item btnMenu activeBtn menuVerificacion0 cursor-pointer" @click="filtroMenu = 0;estadoMenu();">Verificación Libros</span>
              <span v-if="!userAsesor" class="breadcrumbs__item btnMenu menuVerificacion1 cursor-pointer" @click="filtroMenu = 1;estadoMenu();">Códigos Docentes</span>
              <span v-if="userAsesor" class="breadcrumbs__item btnMenu menuVerificacion2 cursor-pointer" @click="filtroMenu = 2;estadoMenu();">Valores</span>
              <span v-else class="breadcrumbs__item btnMenu menuVerificacion2 cursor-pointer" @click="filtroMenu = 2;estadoMenu();">Configuración General</span>
              <!-- <span                    class="breadcrumbs__item btnMenu menuVerificacion4 cursor-pointer"  @click="filtroMenu = 4;estadoMenu();">Convenios</span> -->
              <span class="breadcrumbs__item btnMenu menuVerificacion3 cursor-pointer" @click="filtroMenu = 3;estadoMenu();">Porcentajes Beneficiarios</span>
              <span class="breadcrumbs__item btnMenu menuVerificacion4 cursor-pointer" @click="filtroMenu = 4;estadoMenu();">Reportes</span>
              <span v-if="!userAsesor" class="breadcrumbs__item btnMenu menuVerificacion5 cursor-pointer" @click="filtroMenu = 5;estadoMenu();">Liquidados Devueltos</span>
              <span v-if="!userAsesor" class="breadcrumbs__item btnMenu menuVerificacion6 cursor-pointer" @click="filtroMenu = 6;estadoMenu();">Combos Liquidados</span>
              <span v-if="!userAsesor" class="breadcrumbs__item btnMenu menuVerificacion7 cursor-pointer" @click="filtroMenu = 7;estadoMenu();">Histórico de códigos</span>

          </nav>
          <!--MENU-->
          <!--COMPONENTES-->
          <div>
            <!--VERIFICACION LIBROS-->
              <div v-if="filtroMenu == 0">
                  <TableVerificadosVue @recharge="recharge"  :VerificacionSelect="pedido" :setcobro_venta_directa="setcobro_venta_directa" :settipoPago="settipoPago" :settotalDescuento="settotalDescuento" :setcampoPersonalizado="setcampoPersonalizado" :desdePedido="desdePedido" :sendPedido="sendPedido" :verTipo="Number(2)" :datosInstitucion="datosInstitucion" :arrayCodigosVerificacion="arrayCodigosVerificacion" :arrayCombos="arrayCombos" :arrayTodo="arrayTodo" />
              </div>
              <div v-if="filtroMenu == 1">
                  <ScreenRegaladosVue :userFacturador="userFacturador" :userRoot="userRoot" :userAsesor="userAsesor" :usuario="usuario" :datosInstitucion="datosInstitucion" :VerificacionSelect="pedido" :arregloRegalados="arregloRegalados" :desdePedido="desdePedido" :setcobro_venta_directa="setcobro_venta_directa" :setcampoPersonalizado="setcampoPersonalizado" :sendPedido="sendPedido" :settipoPago="settipoPago" :setPersonalizado="setPersonalizado" :contrato="contrato" :DetalleVerificacion="DetalleVerificacion" @recharge="recharge" />
              </div>
              <div v-if="filtroMenu == 2">
                  <ScreenConfiguracionVerificacionVue :VerificacionSelect="pedido" :setpermiso_cobro_venta_directa="setpermiso_cobro_venta_directa" :sumaTotalVALOR="sumaTotalVALOR" :sumaTotalValorRegalados="Number(totalRegalados) || 0" :DetalleVerificacion="DetalleVerificacion" :id_periodo="sendPedido.id_periodo" :tipoReporte="tipoReporte" :totalCobroVenta="Number(totalCobroVenta) || 0" :sendPedido="sendPedido" :userAsesor="userAsesor" :datosInstitucion="datosInstitucion" @recharge="recharge" :sumaTotalRegalados="sumaTotalRegalados" />
              </div>
              <!-- <div v-if="filtroMenu == 4">
                <ScreenConvenioVue :datosInstitucion="datosInstitucion" @recharge="recharge"/>
              </div> -->
              <div v-if="filtroMenu == 3">
                  <BeneficiariosPorcentajeVue :pedido="sendPedido" :ventaBruta="sendPedido.total_venta" :comision="sendPedido.descuento" :id_pedido="sendPedido.id_pedido" :contrato_generado="contrato" :desdeVerificacion="1" :VerificacionSelect="pedido" />
                  <registrar_beneficiariosVue :pedido="sendPedido" :desdeVerificacion="1" :VerificacionSelect="pedido" />
              </div>
              <div v-if="filtroMenu == 4">
                  <div>
                      <vs-button class="m-2" @click="exportToExcelDetalle(0)" color="success" type="border">Códigos Libros</vs-button>
                      <vs-button class="m-2" v-if="desdePedido == '1'" @click="exportVerificacionPdf(1);tipoReporte=0;" color="dark" type="border">Reporte pdf</vs-button>
                      <vs-button class="m-2" v-if="desdePedido == '1'" @click="exportVerificacionPdf(1);tipoReporte=1;" color="warning" type="border">Reporte excel</vs-button>
                      <vs-button class="m-2" v-if="desdePedido == '1'" @click="exportVerificacionPdf(2);tipoVenta=1;" color="#CE2A7F" type="border">Reporte Venta Directa</vs-button>
                      <vs-button class="m-2" v-if="desdePedido == '1'" @click="exportVerificacionPdf(2);tipoVenta=2;" color="#AECF3C" type="border">Reporte Venta Lista</vs-button>
                      <vs-button class="m-2" v-if="desdePedido == '1'" @click="exportToExcelDetalle(1);" color="#503CE5" type="border">Códigos hijos docentes</vs-button>
                      <vs-button class="m-2" v-if="desdePedido == '1'" @click="buscarTodoCodigos(0);" color="#5F108F" type="border">lista total códigos</vs-button>
                      <vs-button class="m-2" v-if="desdePedido == '1'" @click="buscarTodoCodigos(1);" color="#484D85" type="border">lista total códigos(no devueltos)</vs-button>
                  </div>
              </div>
              <div v-if="filtroMenu == 5">
                  <LiquidadosDevueltosVue :sendVerificacion="pedido" :contrato="contrato" @recharge="recharge" />
              </div>
              <div v-if="filtroMenu == 6">
                <CombosLiquidadosVerificacionVue :sendVerificacion="pedido" :contrato="contrato" />
              </div>
              <!--HISTORICO DE CODIGOS INDIVIDUALES-->
              <div v-if="filtroMenu == 7">
                <historicoCodigosIndividualesVue :sendVerificacion="pedido" />
              </div>
          </div>
          <!--FIN COMPONENTES-->
      </vs-popup>
      <!--MODAL PARA VER LOS CODIGOS DE LA VERIFICACION -->
      <vs-popup :title="title2" :active.sync="popupVerCodigos" @close="abrirModal()">
          <vs-list>
              <vs-list-header :title="ArregloVerCodigos.length +' Códigos'"></vs-list-header>
              <vs-list-item :key="indextr" v-for="(tr, indextr) in ArregloVerCodigos" :title="tr.codigo">
              </vs-list-item>
          </vs-list>
      </vs-popup>
      <!--MOSTRAR CODIGOS Y DEVOLUCION-->
      <vs-popup :title="'DEVOLUCIÓN CÓDIGOS LIQUIDADOS'" :active.sync="popupVerDevolucionCodigos" @close="abrirModal2()">
          <div v-if="popupVerDevolucionCodigos">
              <VerDevolucionCodigosVue :ArregloVerCodigos="ArregloVerCodigos" :sendPedido="sendPedido" @changeHandleDevolucion="changeHandleDevolucion" />
          </div>
      </vs-popup>
      <!--POPUP PARA CAMBIAR DE NUMERO DE VERIFICACION-->
      <vs-popup style="color:rgb(255,255,255)" background-color="rgba(255,255,255,.6)" title="background" :active.sync="popupChangeLiquidacion">
      </vs-popup>
      <!--MODAL SUBIR SOLICITUD DE OBSEQUIOS-->
      <vs-popup classContent="popup-example" title="Subir evidencia" :active.sync="popupSolicitud" fullscreen>
          <p class="font-bold text-warning text-2xl text-center">Evidencia de verificación</p>
          <vs-divider>SUBA ARCHIVO DE LA EVIDENCIA DE VERIFICACIÓN</vs-divider>
          <UploadVerificacionVue v-if="popupSolicitud" :pedido="pedido" titlebtn="Subir evidencia" tipoDocumento='evidencia' campo_file="file_evidencia" campo_fecha="fecha_subir_evidencia" :imgOld="archivosGuardados" @recharge="getRefrescarDocumentos" />
      </vs-popup>
      <vs-popup classContent="popup-example" title="Subir Factura" :active.sync="popupSolicitudFactura" fullscreen @close="getRefrescarDocumentos(1)">
          <p class="font-bold text-warning text-2xl text-center">Suba la factura</p>
          <vs-divider>SUBA ARCHIVO LA FACTURA</vs-divider>
          <UploadVerificacionVue v-if="popupSolicitudFactura" :pedido="pedido" titlebtn="Subir Factura" tipoDocumento='factura' campo_file="file_factura" campo_fecha="fecha_subir_factura" :imgOld="archivosGuardados" @recharge="getRefrescarDocumentos" />
      </vs-popup>

      <!--MODAL PARA OBSERVACION VERIFICACION ACTUAL -->
      <vs-popup :title="`Mostrar observación/es de verificación n° ${pedido.id}`" :active.sync="popupObservacion" class="informacionform" @close="getInformacionLiquidacion">
          <div v-if="disableAsesor">
              <div>
                  <div class="vx-row mb-2" v-for="(item, index) in observacion" :key="index">
                      <div class="vx-col w-full flex items-start">
                          <vs-textarea v-model="item.observacion" :disabled="disableAsesor" counter="300" class="w-full" label="Observación" />
                          <small>{{ item.creador?item.creador:'' }}, fecha reación:{{ item.created_at }}</small>
                      </div>
                  </div>
              </div>
          </div>
          <div v-else>
              <!-- Nueva observación -->
              <div class="vx-row mb-2">
                  <div class="vx-col w-full">
                      <vs-textarea :disabled="disableAsesor" counter="300" class="w-full" label="Nueva observación" :counter-danger.sync="counterDanger" v-model="newObservacion" />
                  </div>
                  <!-- Botón para agregar observación -->
                  <div class="vx-col w-full flex justify-end">
                      <vs-button color="success" @click="agregarNuevaObservacion" class="mt-2 w-1/2" type="gradient">Agregar observación</vs-button>
                  </div>
              </div>
              <div class="vx-row mb-2" v-for="(item, index) in observacion" :key="index">
                  <div class="vx-col w-full flex items-start">
                      <div class="flex flex-col w-full">
                          <vs-tooltip align="center" :text="getTooltipText(item)" position="bottom" color="dark" class="w-full">
                              <template>‎</template>
                              <vs-textarea v-model="item.observacion" :disabled="disableAsesor" counter="300" class="w-full" label="Observación" />
                          </vs-tooltip>
                      </div>
                  </div>
              </div>
          </div>
      </vs-popup>

      <!--DOWNLOAD DOCUMENTOS-->
      <div v-if="mostrarReportePdf">
          <exportLiquidacionVue style="display:none;" :VerificacionSelect="pedido" :sumaTotalVALOR="sumaTotalVALOR" :sumaTotalValorRegalados="Number(totalRegalados) || 0" :DetalleVerificacion="DetalleVerificacion" :tipoReporte="tipoReporte" :totalCobroVenta="Number(totalCobroVenta) || 0" :sendPedido="sendPedido" :datosInstitucion="datosInstitucion" @change="changeHandle" :sumaTotalRegalados="sumaTotalRegalados"/>
      </div>
      <div v-if="mostrarReporteTipoVenta">
          <exportTipoVentaVue style="display:none;" :tipoVenta="tipoVenta" :VerificacionSelect="pedido" :datosInstitucion="datosInstitucion" :sendPedido="sendPedido" :arrayAllCodigos="arrayAllCodigos" @change="changeHandle" />
      </div>
      <!--MODAL SUBIR REVISION-->
      <vs-popup classContent="popup-example" class="padrePopup" title="Subir Revision" :active.sync="popupRevision" fullscreen>
          <p class="font-bold text-warning text-2xl text-center">Evidencia de la revisión</p>
          <vs-divider>SUBA ARCHIVO DE LA REVISION DE VERIFICACIÓN</vs-divider>
          <UploadRevisionVue v-if="popupRevision" :pedido="pedido" titlebtn="Subir la revisión" tipoDocumento="revisiones" campo_file="file_revision" campo_fecha="fecha_revision_subida" :imgOld="archivosGuardados" @recharge="getRefrescarDocumentos" @f_recargeVerificaciones="f_recargeVerificaciones" />
      </vs-popup>
      <!--MODAL VER DOCUMENTOS-->
      <vs-popup title="Documentos Asociados" :active.sync="popupDocumentos" fullscreen @close="getRefrescarDocumentos">
          <div v-if="documentoSeleccionado">
              <vs-tabs v-model="tabDoc" @change="resetPreview">

                  <!-- TAB: Evidencia Verificación -->
                  <vs-tab label="Evidencia Verificación">
                      <div v-if="documentoSeleccionado.file_evidencia && documentoSeleccionado.file_evidencia.length">
                          <div v-for="(fileE, indexE) in documentoSeleccionado.file_evidencia" :key="indexE" class="flex justify-center">
                              <p class="img" :class="{ 'activo': $data_url + fileE.egf_url + fileE.egf_archivo === previewEvidencia }" @click="previsualizarDocumento(fileE.egf_archivo, 'evidencia')">

                                  <b>Evidencia Verificación {{ indexE + 1 }} <br> Fecha de subida: {{ fileE.created_at }}</b>

                                  <i v-if="fileE.egf_archivo.substr(-3) === 'pdf'" class="fa-solid fa-file-pdf icono-pastel rojo"></i>
                                  <i v-else-if="fileE.egf_archivo.substr(-4) === 'docx'" class="fa-solid fa-file-word icono-pastel azul"></i>
                                  <ion-icon v-else class="icono-pastel verde" name="camera-outline"></ion-icon>

                              </p>

                          </div>
                      </div>

                      <p v-else class="flex justify-center">
                          <vs-alert color="danger" icon="warning" class="mt-4">
                              No hay evidencias disponibles.
                          </vs-alert>
                      </p>

                      <!-- Vista Previa -->
                      <div v-if="previewEvidencia" class="document-preview">
                          <h4>Vista Previa</h4>
                          <iframe v-if="previewEvidencia.endsWith('pdf')" :src="previewEvidencia" width="100%" height="700px"></iframe>
                          <iframe v-if="previewEvidencia.endsWith('docx')" :src="previewEvidencia" width="100%" height="700px"></iframe>
                          <!-- <img v-else :src="previewEvidencia" alt="Vista Previa" style="max-width: 100%; height: auto;"> -->
                          <div v-else class="flex justify-center">
                              <image-zoom v-if="isImage(previewEvidencia)" :regular="previewEvidencia" :zoom-amount="3" :click-zoom="true" click-message="De click para aumentar" img-class="img-fluid"></image-zoom>
                          </div>
                      </div>

                  </vs-tab>

                  <!-- TAB: Factura -->
                  <vs-tab label="Factura">

                      <div v-if="documentoSeleccionado.file_factura && documentoSeleccionado.file_factura.length">

                          <div v-for="(fileF, index) in documentoSeleccionado.file_factura" :key="index" class="flex justify-center">
                              <p class="img" :class="{ 'activo': $data_url + fileF.egf_url + fileF.egf_archivo === previewFactura }" @click="previsualizarDocumento(fileF.egf_archivo, 'factura')">

                                  <b>Evidencia Factura {{ index + 1 }} <br> Fecha de subida: {{ fileF.created_at }}</b>

                                  <i v-if="fileF.egf_archivo.substr(-3) === 'pdf'" class="fa-solid fa-file-pdf icono-pastel rojo"></i>
                                  <i v-else-if="fileF.egf_archivo.substr(-4) === 'docx'" class="fa-solid fa-file-word icono-pastel azul"></i>
                                  <ion-icon v-else class="icono-pastel verde" name="camera-outline"></ion-icon>

                              </p>
                          </div>

                      </div>

                      <p v-else class="flex justify-center">
                          <vs-alert color="danger" icon="warning" class="mt-4">
                              No hay evidencias disponibles.
                          </vs-alert>
                      </p>

                      <!-- Vista Previa -->
                      <div v-if="previewFactura" class="document-preview">
                          <h4>Vista Previa</h4>
                          <iframe v-if="previewFactura.endsWith('pdf')" :src="previewFactura" width="100%" height="700px"></iframe>
                          <iframe v-if="previewFactura.endsWith('docx')" :src="previewFactura" width="100%" height="700px"></iframe>
                          <!-- <img v-else :src="previewFactura" alt="Vista Previa" style="max-width: 100%; height: auto;"> -->
                          <div v-else class="flex justify-center">
                              <image-zoom v-if="isImage(previewFactura)" :regular="previewFactura" :zoom-amount="3" :click-zoom="true" click-message="De click para aumentar" img-class="img-fluid">
                              </image-zoom>
                          </div>
                      </div>

                  </vs-tab>

                  <!-- TAB: Evidencias de Revisión -->
                  <vs-tab label="Evidencias de Revisión">

                      <div v-if="documentoSeleccionado.files_revision && documentoSeleccionado.files_revision.length">
                          <div v-for="(fileER, index) in documentoSeleccionado.files_revision" :key="index" class="flex justify-center">
                              <p class="img" :class="{ 'activo': $data_url + fileER.egf_url + fileER.egf_archivo === previewRevision }" @click="previsualizarDocumento(fileER.egf_archivo, 'revisiones')">
                                  <b>Evidencia Revisión {{ index + 1 }} <br> Fecha de subida: {{ fileER.created_at }}</b>

                                  <i v-if="fileER.egf_archivo.substr(-3) === 'pdf'" class="fa-solid fa-file-pdf icono-pastel rojo"></i>
                                  <i v-else-if="fileER.egf_archivo.substr(-4) === 'docx'" class="fa-solid fa-file-word icono-pastel azul"></i>
                                  <ion-icon v-else class="icono-pastel verde" name="camera-outline"></ion-icon>

                              </p>

                          </div>
                      </div>

                      <p v-else class="flex justify-center">
                          <vs-alert color="danger" icon="warning" class="mt-4">
                              No hay evidencias disponibles.
                          </vs-alert>
                      </p>

                      <!-- Vista Previa -->
                      <div v-if="previewRevision" class="document-preview">
                          <h4>Vista Previa</h4>
                          <iframe v-if="previewRevision.endsWith('pdf')" :src="previewRevision" width="100%" height="700px"></iframe>
                          <iframe v-if="previewRevision.endsWith('docx')" :src="'https://view.officeapps.live.com/op/embed.aspx?src='+previewRevision" width="100%" height="700px"></iframe>
                          <!-- <img v-else :src="previewRevision" alt="Vista Previa" style="max-width: 100%; height: auto;"> -->
                          <div v-else class="flex justify-center">
                              <image-zoom v-if="isImage(previewRevision)" :regular="previewRevision" :zoom-amount="3" :click-zoom="true" click-message="De click para aumentar" img-class="img-fluid">
                              </image-zoom>
                          </div>
                      </div>

                  </vs-tab>

              </vs-tabs>
          </div>
      </vs-popup>
      <!--MODAL PARA OBSERVACION REVISION-->
      <vs-popup classContent="popup-example" title="Observación revision" :active.sync="popupObservacionRevision">
          <div class="vx-row mb-2">
              <div class="vx-col w-full">
                  <vs-textarea :disabled="disableAsesor" counter="300" style="width:100%;" height="200px" label="Observación" :counter-danger.sync="counterDanger" v-model="observacion_revision" />
              </div>
          </div>
          <div class="flex justify-center">
              <vs-button color="success" @click="saveObservacionRevision()" class="mt-2" type="gradient">Guardar comentario</vs-button>
          </div>
      </vs-popup>

  </div>
  </template>
  <script>
  import {
    mapState,
    mapActions
  } from 'vuex'
  import imageZoom from 'vue-image-zoomer';
  const  UploadVerificacionVue      = () => import('./components/UploadVerificacion.vue')
  const exportLiquidacionVue        = () => import('./components/exportLiquidacion.vue')
  const LiquidadosDevueltosVue      = () => import('./components/Pedidos/LiquidadosDevueltos.vue')
  const CombosLiquidadosVerificacionVue = () => import('./components/Pedidos/combos/CombosLiquidadosVerificacion.vue');
  const ScreenRegaladosVue          = () => import('./components/Pedidos/Regalados/ScreenRegalados.vue')
  const BeneficiariosPorcentajeVue  = () => import('../pedidos/components/beneficiarios/BeneficiariosPorcentaje.vue')
  const registrar_beneficiariosVue  = () => import('../pedidos/registrar_beneficiarios.vue')
  const TableVerificadosVue         = () => import('./components/TableVerificados.vue')
  const VerDevolucionCodigosVue     = () => import('./components/Pedidos/Devueltos/VerDevolucionCodigos.vue')
  const  UploadRevisionVue          = () => import('./components/UploadRevision.vue')
  import VentaRealVue from '@/views/temporadas/components/VentaReal'
  import exportTipoVentaVue from './components/exportTipoVenta.vue';
  import ScreenConfiguracionVerificacionVue from './components/Pedidos/Configuracion/ScreenConfiguracionVerificacion.vue';
  import PedidosRepository from '@/repositories/PedidosRepository';
  import Generalmix from '../../mixins/Generalmix';
  const historicoCodigosIndividualesVue = () => import('./historicoCodigosIndividuales.vue');
  export default {
  mixins: [Generalmix],
  components:{
    UploadVerificacionVue,
    imageZoom,
    VentaRealVue,
    exportLiquidacionVue,
    exportTipoVentaVue,
    TableVerificadosVue,
    LiquidadosDevueltosVue,
    ScreenRegaladosVue,
    ScreenConfiguracionVerificacionVue,
    BeneficiariosPorcentajeVue,
    registrar_beneficiariosVue,
    VerDevolucionCodigosVue,
    UploadRevisionVue,
    CombosLiquidadosVerificacionVue,
    historicoCodigosIndividualesVue,
    // ScreenConvenioVue,
  },
    data() {
        return{
            usuario:[],
            contrato:'',
            InformacionLiquidacion:[],
            DetalleVerificacion:[],
            ArregloVerCodigos:[],
            popupDetalleVerificacion:false,
            popupVerCodigos:false,
            popupVerDevolucionCodigos:false,
            title:'',
            title2:'',
            verificacion_id:0,
            contContrato:0,
            popupChangeLiquidacion:false,
            nombreInstitucion:'',
            desgloseContrato:[],
            pedido:{},
            popupSolicitud:false,
            popupSolicitudFactura:false,
            popupDocumento:false,
            tipoDocumento:'',
            documento:'',
            userRoot:false,
            userFacturador:false,
            userAsesor:false,
            //VARIABLES PARA EXPORTAR A EXCEL
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            fileName:null,
            selectedFormat: 'xls',
            cellAutoWidth: true,
            activePrompt: false,
            //FIN VARIABLES PARA EXPORTAR A EXCEL
            //variables para observacion
            observacion:'',
            popupObservacion:false,
            counterDanger: false,
            disableAsesor:false,
            datosInstitucion:'',
            maximaVerificacion:0,
            desdeDetalle:0,
            //0 => REPORTE PDF; 1 => REPORTE EXCEL
            tipoReporte:0,
            tipoVenta:1,
            //fin variables para observacion
            //variables para reporte pdf
            mostrarReportePdf:false,
            mostrarReporteTipoVenta:false,
            popupCarga:false,
            //fin variables para reporte pdf
            //variables regalados
            arregloRegalados:[],
            colorx:"#56979B",
            totalRegalados:0,
            //fin variables regalados
            totalCobroVenta:0,
            sumaTotalVALOR:0,
            menuDetalle:1,
            //variables para cobro directa
            setcobro_venta_directa:0,
            settipoPago:0,
            setPersonalizado:0,
            settotalDescuento:0,
            setcampoPersonalizado:"",
            setpermiso_cobro_venta_directa:0,
            //fin variables para cobro directa
            //variables venta real
            // sumaVentaReal:0,
            arregloValoresVentaReal:[],
            //fin variables venta real
            filtroMenu:100,
            arrayAllCodigos:[],
            arrayAllCodigosConCombos:[],
            arrayCombos:[],
            arrayCodigosVerificacion:[],
            verLibrosSelected:'',
            sendPedido:'',
            arregloTodoCodigosIndividuales:[],
            mixinIdInicioFormatoNewData: null,
            arrayTodo:[],
            //REVISION
            popupRevision:false,
            archivosGuardados: [],
            popupDocumentos:false,
            documentoSeleccionado: null,
            tabDoc: 0,
            previewEvidencia: null,
            previewFactura: null,
            previewRevision: null,
            //OBSERVACION REVISION
            popupObservacionRevision:false,
            observacion_revision:'',

            // Nueva observación
            newObservacion: "",
            regaladosReporteNuevo:0,
            sumaTotalRegalados:0,
            CombosTotalDevolucionSueltosPorcentaje:0,
            id_periodoModuloDescuentoVenta:29,
            ifCondicionalDescuentoVenta:0,
      }
    },
    props:{
        desdePedido:{
            type:Number,
            default:0
        },
        contratoPedido:{
            type:String,
            default:''
        },
        id_pedido:{
            type:Number,
            default:0
        },

    },
    watch:{
        setcobro_venta_directa(results){
          let me = this;
          me.setcobro_venta_directa = results
          me.getAllCodigosXContrato()
        },
        settipoPago(results){
          let me = this;
          me.settipoPago = results
        },
        setPersonalizado(results){
          let me = this;
          me.setPersonalizado = results
        },
        settotalDescuento(results){
          let me = this;
          me.settotalDescuento = results
        },
        setcampoPersonalizado(results){
          let me = this;
          me.setcampoPersonalizado = results
        },
        setpermiso_cobro_venta_directa(results){
          let me = this;
          me.setpermiso_cobro_venta_directa = results
        },
        ObjectPedido(results){
          let me = this
          me.sendPedido = me.ObjectPedido
        },
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getUserRoot(me.usuario);
        // this.obtenerArchivosGuardados();
    },
    computed:{
        ...mapState(['pedidoId','userRoot','groupFacturador','ObjectPedido']),
    },
    mounted(){
      let me = this;
      // Verifica si los datos existen en localStorage
      const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
      if (mixinData) {
      // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
      const parsedData = JSON.parse(mixinData);
      me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;
      console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
      } else {
          console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
      }
      // FIN Verificación si los datos existen en localStorage
      me.setcobro_venta_directa     = 0
      me.settipoPago                = 0
      me.setPersonalizado           = 0
      me.settotalDescuento          = 0
      me.setcampoPersonalizado      = ""
      me.setpermiso_cobro_venta_directa = 0
      me.menuDetalle = 1
      if(me.desdePedido == 1){
        me.contrato = me.contratoPedido
        me.getInformacionLiquidacion()
      }
      //user facturador
      if(me.usuario.id_group == 23 || me.usuario.id_group == 22) me.userFacturador = true
      //user asesor
      if(me.usuario.id_group == 11){
        me.userAsesor = true
        me.disableAsesor = true
      }
      me.getPedido()
    },
    computed:{
        sumaTotal(){
            let me = this;
            if(me.DetalleVerificacion.length >0){
              let datos = me.DetalleVerificacion.filter(p => p.cantidad)
              let total = datos.reduce((a, b) => a + (b["cantidad"] || 0), 0);
              return total
            }
        },

    },
    methods: {
      isImage(file) {
          const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'];  // Tipos de imagen admitidos
          const fileExtension = file.split('.').pop().toLowerCase();
          return imageTypes.includes(fileExtension);
      },
      getTooltipText(item) {
        if (item.creador && item.modificador) {
          return `Creado por ${item.creador}, fecha creación: ${item.created_at}, Modificado por ${item.modificador}, fecha modificación: ${item.updated_at}`;
        } else if (item.creador) {
          return `Creado por ${item.creador}, fecha creación: ${item.created_at}`;
        } else if (item.modificador) {
          return `Modificado por ${item.modificador}, fecha modificación: ${item.updated_at}`;
        } else {
          return 'Sin información';
        }
      },
      //OBSERVACION REVISION
      modalObservacionRevision(observacion) {
        let me = this;
        me.observacion_revision='';
        me.observacion_revision = observacion;
        me.popupObservacionRevision = true;
      },
      saveObservacionRevision(){
        let me = this;
        if(me.observacion_revision == "" || me.observacion_revision == null || me.observacion_revision == undefined){
        }else{
          if(me.observacion_revision.length > 300){
            me.$vs.notify({ text: 'Máximo 300 caracteres.', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle',time:4000 })
            return
          }
        }
        let formData = new FormData();
        formData.append('id',          me.pedido.id);
        formData.append('observacion', me.observacion_revision);
        formData.append('contrato',    me.pedido.contrato);
        formData.append('usuario',    me.usuario.idusuario);

        me.$vs.loading()
        this.$http.post(this.$server_url+'saveObservacionRevision', formData)
        .then(res => {
        me.$vs.loading.close()
        me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        })
        this.getRefrescarDocumentos();
        me.popupObservacionRevision = false;
      },
      //FIN OBSERVACION REVISION
      resetPreview() {
        this.previewDocumento = null;
      },
      previsualizarDocumento(url,tipo) {
        let me = this;
        this.previewEvidencia = null;
        this.previewFactura = null;
        this.previewRevision = null;

        let ruta = me.$data_url+'archivos/verificaciones/'+tipo+'/'+url
        if(tipo == 'evidencia'){
          if (url.endsWith('.pdf')) {
            this.previewEvidencia = ruta;
          } else if (url.endsWith('.docx')) {
            this.previewEvidencia = 'https://view.officeapps.live.com/op/embed.aspx?src=' + ruta;
          } else {
            this.previewEvidencia = ruta;
          }
        }else if(tipo == 'factura'){
          if (url.endsWith('.pdf')) {
            this.previewFactura = ruta;
          } else if (url.endsWith('.docx')) {
            this.previewFactura = 'https://view.officeapps.live.com/op/embed.aspx?src=' + ruta;
          } else {
            this.previewFactura = ruta;
          }
        }else if(tipo == 'revisiones'){
          if (url.endsWith('.pdf')) {
            this.previewRevision = ruta;
          } else if (url.endsWith('.docx')) {
            this.previewRevision = 'https://view.officeapps.live.com/op/embed.aspx?src=' + ruta;
          } else {
            this.previewRevision = ruta;
          }
        }
      },
      verDocumentos(tr) {
        this.previewEvidencia = null;
        this.previewFactura = null;
        this.previewRevision = null;
        this.documentoSeleccionado = tr;
        this.popupDocumentos = true;
      },
      obtenerArchivosGuardados(tipo) {
        console.log("pedido", JSON.stringify(this.pedido, null, 2));
        setTimeout(() => {
            this.$http.get(this.$server_url + 'getArchivosRevision?idVerificacion=' + this.pedido.id + '&tipo=' + tipo + '&archivoFactura')
                .then(response => {
                    this.archivosGuardados = response.data;

                    // Verificar si hay archivos con egf_id: null en file_evidencia o file_factura
                    const tieneEvidenciaNull = this.pedido.file_evidencia && this.pedido.file_evidencia.some(file => file.egf_id === null);
                    const tieneFacturaNull = this.pedido.file_factura && this.pedido.file_factura.some(file => file.egf_id === null);

                    // Mostrar el popup correspondiente
                    if (tipo === 'verificacion') {
                        if (tieneEvidenciaNull) {
                          this.pedido.file_evidencia.forEach(file => {
                              if (file.egf_id === null) {
                                  this.archivosGuardados.push({
                                      egf_id: null,
                                      egf_archivo: file.egf_archivo,
                                      egf_url: file.egf_url,
                                      egf_tamano: file.egf_tamano,
                                      created_at: file.created_at,
                                      updated_at: file.updated_at
                                  });
                              }
                          });
                        }
                      this.popupSolicitud = true;
                    } else if (tipo === 'factura') {
                      if (tieneFacturaNull) {
                        this.pedido.file_factura.forEach(file => {
                            if (file.egf_id === null) {
                                this.archivosGuardados.push({
                                    egf_id: null,
                                    egf_archivo: file.egf_archivo,
                                    egf_url: file.egf_url,
                                    egf_tamano: file.egf_tamano,
                                    created_at: file.created_at,
                                    updated_at: file.updated_at
                                });
                            }
                        });
                      }
                      this.popupSolicitudFactura = true;
                    } else if (tipo === 'revision') {
                      this.popupRevision = true;
                    }

                    this.$vs.loading.close();
                })
                .catch(error => {
                    console.error(error);
                    this.$vs.loading.close();
                });
        }, 1000);
      },
      getPedido(){
        let me = this
        me.sendPedido = []
        PedidosRepository.getPedidoXID(me.id_pedido).then(r => { me.sendPedido = r.data[0]; })
      },
      estadoMenu(){
          let me = this;
          localStorage.setItem('menuSelectVerificacion',me.filtroMenu)
          var divs = document.querySelectorAll(".btnMenu");
          for (var i = 0; i < divs.length; i++) {
              divs[i].classList.remove("activeBtn");
          }
          const container = document.querySelector(".menuVerificacion"+me.filtroMenu);
          container.classList.add("activeBtn");
      },

      startDetalle(tr){
        let me = this
        me.mostrarReportePdf              = false
        me.mostrarReporteTipoVenta        = false
        me.menuDetalle                    = 1
        me.setcobro_venta_directa         = tr.cobro_venta_directa;
        me.settipoPago                    = tr.tipoPago;
        me.setPersonalizado               = tr.personalizado;
        me.settotalDescuento              = tr.totalDescuento;
        me.setcampoPersonalizado          = tr.campoPersonalizado;
        me.setpermiso_cobro_venta_directa = tr.permiso_cobro_venta_directa
        me.pedido                         = tr;
        me.getAllCodigosXContrato().then(() => {
          me.$nextTick(() => {
            me.filtroMenu = 0;
            me.estadoMenu();
          });
        });
      },
      abrirModal(){
          let me = this;
          if(me.desdeDetalle == 1){ }
          else  me.popupDetalleVerificacion=true;
      },
      abrirModal2(){
        let me = this;
        me.popupVerDevolucionCodigos = false
        me.popupDetalleVerificacion  = true
        me.getAllCodigosXContrato()
      },
      changeHandleDevolucion(e){
        let me                        = this;
        me.filtroMenu                 = 0;
        me.VerCodigos(e,0)
      },
      //====METODOS PARA OMITIR LOS ARHIVOS
      changeHandle(e){
        let me = this;
        me.mostrarReportePdf         = false
        me.mostrarReporteTipoVenta   = false
        me.popupCarga                = false
        me.popupDetalleVerificacion  = true
      },
      filtrarDecimal(numero){
          let me = this
          if(numero == undefined){
              return 0
          }
          if(numero == 0){
              return numero
          }else{
              const transformar = (numero).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
              return transformar
          }
      },
      getUserRoot(dato) {
          let me = this;
          this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
          .then((result) => {
              if (result.data.length > 0) {
              me.userRoot = true;
              }
          })
          .catch((err) => {
              console.log(err)
          })
      },
      getInformacionLiquidacion(validacion) {
        let me = this;
        me.InformacionLiquidacion   = [];
        me.desgloseContrato         = []
        me.maximaVerificacion       = 0
        me.nombreInstitucion = ""
        if(me.contrato == ""){
            me.$vs.notify({
              text: "Ingrese un contrato por favor",
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-user'
            })
            return false;
        }
        me.$vs.loading();
        this.$http.get(this.$server_url+'n_verificacion?contrato='+me.contrato+'&informacion=yes')
            .then(function (res) {
              me.$vs.loading.close()
                if(res.data.verificaciones.length == 0){
                    me.$vs.notify({
                    text: 'No hay verificaciones en el contrato',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-user'
                    })
                    return
                }
                me.InformacionLiquidacion = res.data.verificaciones
                me.nombreInstitucion      = res.data.institucion[0].nombreInstitucion
                me.datosInstitucion       = res.data.institucion[0]
                let periodoInstitucion    = res.data.institucion[0].id_periodo
                if(me.id_periodoModuloDescuentoVenta <= periodoInstitucion){
                  //me.ifCondicionalDescuentoVenta = 1
                  me.ifCondicionalDescuentoVenta = 0
                }
                me.contContrato           = res.data.length
                me.regaladosReporteNuevo  = res.data.pedido.length > 0 ? res.data.pedido[0].regaladosReporteNuevo : 0
                if(validacion){
                  me.eliminarNotificacionSiNoTieneFactura(res.data.verificaciones);
                }
                if(res.data.message){
                    me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-user'
                    })
                }
                //me.desgloseCodigo();
            })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
      },
      eliminarNotificacionSiNoTieneFactura(datosVerificar) {
        let me = this;
        let datos = datosVerificar;

        // Recorre cada elemento y marca las validaciones
        datos.forEach(element => {
            element.ValidacionFactura = element.file_factura && element.file_factura.length > 0;
            element.ValidacionEvidencia = element.file_evidencia && element.file_evidencia.length > 0;
            element.ValidacionRevision = element.files_revision && element.files_revision.length > 0;
        });

        // Filtra las verificaciones que no tienen los archivos necesarios y tienen estado '0'
        const NotieneArchivos = datos.filter(element =>
            (element.ValidacionFactura === false || element.ValidacionEvidencia === false || element.ValidacionRevision === false) && element.estado === '0'
        );

        // Si no hay verificaciones para eliminar
        if (!NotieneArchivos.length) {
            this.$vs.notify({
                text: "Todas las verificaciones tienen los archivos necesarios o no tienen estado '0', no se elimina la notificación.",
                color: 'info',
                iconPack: 'feather',
                icon: 'icon-check-circle'
            });
            return;
        }

        let guardarIds = NotieneArchivos.map(element => element.id);

        // Enviamos la solicitud para eliminar la notificación
        this.$http.post(this.$server_url + 'eliminarNotificacion', {
            id_padre: guardarIds  // Enviamos los IDs de las verificaciones
        })
        .then(response => {
            const mensaje = response.data.message;
            this.$vs.notify({
                text: mensaje,
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check-circle'
            });
        })
        .catch(error => {
            console.error(error);
            this.$vs.notify({
                text: "Error al actualizar las notificaciones",
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-x-circle'
            });
        });
    },

      desgloseCodigo(){
        let me = this;
        me.desgloseContrato = []
        const { idInstitucion ,id_periodo } = me.datosInstitucion
          this.$http.get(this.$server_url+'n_verificacion?contrato='+me.contrato+'&historico=yes&institucion_id='+idInstitucion+'&periodo_id='+id_periodo)
            .then(function (res) {
              let datos      = res.data.formato
              if(datos.length == 0){
                me.$vs.loading.close()
                return
              }
              me.maximaVerificacion = datos[0].maximaVerificacion
              let getCodigos = res.data.codigos
              let prevalores = []
              datos.forEach(element => {
                var cal = new Object()
                cal.codigo          = element.codigo
                cal.nombre_libro    = element.nombre_libro
                cal.libro_id        = element.libro_id
                var preTotal        = 0
                var contador        = 1
                for (let index = 0; index < me.maximaVerificacion; index++) {
                    let contar = []
                    contar = getCodigos.filter(p => p[`verif${contador}`] > 0 && p.libro_id == element.libro_id)
                    if(contar.length > 0){
                        preTotal += contar.length
                        try {
                        eval("cal.verif" + contador + "=" + contar.length);
                        } catch (error) {
                            console.log("err",error)
                            eval("cal.verif" + contador + "=" + 0);
                        }
                    }
                    contador++;
                }
                cal.total           = preTotal
                prevalores.push(cal)
              });
              if(prevalores.length > 0){
                me.desgloseContrato = prevalores.sort(function(a, b) {
                var nombreA = a.codigo.toLowerCase();
                var nombreB = b.codigo.toLowerCase();
                var numA = parseInt(nombreA.match(/\d+$/)); // extraer el número del final (si existe)
                var numB = parseInt(nombreB.match(/\d+$/)); // extraer el número del final (si existe)
                nombreA = nombreA.replace(/\d+$/, ''); // quitar el número del final
                nombreB = nombreB.replace(/\d+$/, ''); // quitar el número del final

                if (nombreA < nombreB) {
                    return -1;
                }
                if (nombreA > nombreB) {
                    return 1;
                }
                if (numA && !numB) { // si a tiene número y b no, b va primero
                    return 1;
                }
                if (!numA && numB) { // si b tiene número y a no, a va primero
                    return -1;
                }
                if (numA && numB) { // si ambos tienen número, compararlos
                    if (numA < 10 && numB >= 10) { // si a es menor que 10 y b es 10 o mayor, a va primero
                    return -1;
                    }
                    if (numA >= 10 && numB < 10) { // si b es menor que 10 y a es 10 o mayor, b va primero
                    return 1;
                    }
                    return numA - numB; // comparar los números directamente
                }
                return 0; // si son iguales en todo, no hay diferencia
                });
              }
              me.$vs.loading.close()
            })
        .catch(function (error) {
        })
      },
      verCodigosRegalados(tr){
        let me  = this;
        me.ArregloVerCodigos = []
        me.$vs.loading();
        me.title2 = "Códigos del libro "+tr.nombre_libro
        this.$http.get(this.$server_url+'showRegalados/'+me.datosInstitucion.idInstitucion+'/'+me.datosInstitucion.id_periodo+'/'+tr.libro_idlibro+'/'+me.pedido.num_verificacion+'/'+me.pedido.id+'/'+tr.plus)
        .then(function (res) {
            me.ArregloVerCodigos        = res.data
            me.popupDetalleVerificacion = false;
            me.popupVerCodigos          = true;
            me.$vs.loading.close()
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
      },
      VerCodigos(item,filtro){
        let me  = this;
        let tr  = me.verLibrosSelected
        me.ArregloVerCodigos = []
        me.$vs.loading();
        me.title2 = "Códigos del libro "+tr.nombre_libro
        this.$http.get(this.$server_url+'n_verificacion?contrato='+me.pedido.contrato+'&verCodigos=yes&verificacion_id='+tr.IdVerificacion+'&libro_id='+tr.libro_id+'&num_verificacion='+tr.verificacion_id+'&plus='+tr.plus)
        .then(function (res) {

          me.$vs.loading.close()
          let datos = res.data.filter(p => p.estado_liquidacion != '3' && p.quitar_de_reporte != '1')
            if(filtro == 0) me.ArregloVerCodigos = datos
            if(filtro == 1) me.ArregloVerCodigos = datos.filter(x => x.venta_estado == 1 && x.estado_liquidacion == 0)
            if(filtro == 2) me.ArregloVerCodigos = datos.filter(x => x.venta_estado == 2 && x.estado_liquidacion == 0)
            if(filtro == 3) me.ArregloVerCodigos = datos.filter(x => x.estado_liquidacion == 2)
          me.popupDetalleVerificacion = false;
          if(me.filtroMenu == 0){ me.popupVerDevolucionCodigos  = true; }
          else                  { me.popupVerCodigos            = true; }
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
      getAllCodigosXContrato(){
        let me = this;
        // me.sumaVentaReal =0
        me.arregloValoresVentaReal = []
        me.arrayTodo = []
        const { idInstitucion ,id_periodo } = me.datosInstitucion
        let rutaxperiodo = ''
        rutaxperiodo = this.$server_url + 'n_verificacion?contrato=' + me.pedido.contrato +
          '&getAllCodigosXContrato_new=yes&IdVerificacion=' + me.pedido.id +
          '&verificacion_id=' + me.pedido.num_verificacion +
          '&institucion_id=' + idInstitucion +
          '&periodo_id=' + id_periodo +
          '&liquidados=1';
        me.$vs.loading();
        return this.$http.get(rutaxperiodo)
        .then(function (res) {
          if(res.data.status == 0){
            me.m_message(res.data.message,'danger',5000)
            me.$vs.loading.close()
            return
          }
          me.arrayTodo = res.data.filter(p =>
              (p.quitar_de_reporte != '1') &&
              (p.tipo_codigo == '0')
          );
          //codigos invidividuales se exceptuan los que tienen combo y combo generado
          me.arrayAllCodigos = res.data.filter(p =>
              (p.quitar_de_reporte != '1') &&
              (p.combo == null || p.combo == '') &&
              (p.codigo_combo == null || p.codigo_combo == '') &&
              (p.tipo_codigo == '0')
          );
          me.arrayAllCodigosConCombos = res.data.filter(p =>
              (p.quitar_de_reporte != '1') &&
              (p.tipo_codigo == '0')
          );
          //se obtiene los combos
          me.arrayCombos = res.data.filter(p => p.tipo_codigo == '1')
          console.table("arrayCombos",me.arrayCombos)
          me.f_calcularCombosRegaladosDevolucionesSueltos()
          me.getVentaRealXVerificacion()
          me.getRegalados();
          me.getDetallesVerificacion()
          me.$vs.loading.close();
          if(res.data.status == 0){
            me.$vs.notify({
              text:res.data.message,
              color:'danger',
              iconPack: 'feather',
              icon:'icon-alert-triangle'})
          }
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
            me.$vs.notify({
              text:"Hubo un error al intentar cargar los datos",
              color:'danger',
              iconPack: 'feather',
              icon:'icon-alert-triangle'})
            return
        })
      },
      f_calcularCombosRegaladosDevolucionesSueltos(){
        let me = this;
        me.CombosTotalDevolucionSueltosPorcentaje = 0
        me.arrayCombos.map((item) => {
          item.cantidad = item.cantidad_items
          item.nombre_original = item.nombre_libro
          item.subtotal        = (item.precio * item.cantidad).toFixed(2)*1;
          let idtipodoc = item.idtipodoc ? item.idtipodoc : 0;
          // solo a actas afectar el descuento
          if(idtipodoc == 2 || idtipodoc == 4){
            me.CombosTotalDevolucionSueltosPorcentaje += item.CombosTotalDevolucionSueltosPorcentaje
            const descuentoTexto = item.descuento ? item.descuento + "%" : "sin acta de %";
            item.nombre_libro = item.nombre_libro + " - " + descuentoTexto
            item.actaRegalado = 1
          }
          else{
            if(me.ifCondicionalDescuentoVenta == 1){
              //const descuentoTexto = item.descuento ? item.descuento + "%" : "sin descuento %";
              const descuentoTexto = me.sendPedido.descuento + "%";
              item.descuento       = me.sendPedido.descuento
              item.nombre_libro    = item.nombre_libro + " | " + descuentoTexto;
            }
          }
        });
      },
      getVentaRealXVerificacion(){
        let me = this;
        const { idInstitucion ,id_periodo } = me.datosInstitucion
        //si no hay codigos no hace nada
        if(me.arrayAllCodigos.length == 0){ return }
        // me.sumaVentaReal            = 0
        me.arregloValoresVentaReal  = []
        let datos                   = me.arrayAllCodigos.filter(p => p.estado_liquidacion == '0' && p.bc_institucion == idInstitucion && p.estado != '2' && p.contrato == me.pedido.contrato)
        // Itera a través de los elementos del array
        datos.forEach(item => {
          const nombre_libro    = item.nombre_libro;
          const codigo          = item.codigo;
          const precio          = item.precio;
          const libro_id        = item.libro_id;
          const IdVerificacion  = item.IdVerificacion;
          const verificacion_id = item.verificacion_id;
          const libro_idlibro   = item.libro_idlibro;
          // Busca si ya existe un objeto con el mismo libro en groupedData
          const existingGroup = me.arregloValoresVentaReal.find(group => group.nombre_libro === nombre_libro);
          // Si no existe, crea un nuevo objeto y agrégalo a groupedData
          if (!existingGroup) {
            me.arregloValoresVentaReal.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion, verificacion_id, libro_idlibro, cantidad: 1 });
          } else {
            // Si existe, incrementa la cantidad en el objeto existente
            existingGroup.cantidad++;
          }
        });
      },
      getRegalados(){
        let me = this
        me.totalRegalados = 0
        me.totalCobroVenta = 0
        me.arregloRegalados = []
        const { idInstitucion ,id_periodo } = me.datosInstitucion
         //AGRUPADO
         let datos              = me.arrayAllCodigosConCombos.filter(p => (p.estado_liquidacion == '2') && (p.bc_institucion == idInstitucion || p.venta_lista_institucion == idInstitucion) )
        datos.forEach(item => {
          const nombre_libro    = item.nombre_libro;
          const codigo          = item.codigo;
          const precio          = item.precio;
          const libro_id        = item.libro_id;
          const IdVerificacion  = item.IdVerificacion;
          const verificacion_id = item.verificacion_id;
          const libro_idlibro   = item.libro_idlibro;
          const plus            = item.plus;
          // Busca si ya existe un objeto con el mismo libro en groupedData
          const existingGroup = me.arregloRegalados.find(group => group.nombre_libro === nombre_libro);
          // Si no existe, crea un nuevo objeto y agrégalo a groupedData
          if (!existingGroup) {
            me.arregloRegalados.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion,verificacion_id, libro_idlibro, cantidad: 1, plus  });
          } else {
            // Si existe, incrementa la cantidad en el objeto existente
            existingGroup.cantidad++;
          }
        });
        // calcular el total de regalados modulo anterior
        if(me.regaladosReporteNuevo  == 0){
          me.arregloRegalados.map((item) => {
            item.valor        = item.precio * item.cantidad
            me.totalRegalados += item.valor
          });
          if(me.arregloRegalados.length > 0){
            let prevalor        = 0
            //COBRO VENTA DIRECTA=>0 = NADA; 1 = 100%; 2 =porcentaje de la escuela;
            //tipoPago => 0 =  NADA; 1 = Cancelar Total; 2 = Descontar; 3 = Regalado = 4 personalizado
            if(me.settipoPago == 1 || me.settipoPago == 3) { me.totalCobroVenta = 0 }
            if(me.settipoPago == 2 || me.setPersonalizado == 1) {
              prevalor = me.sendPedido.descuento
              //si el cobro de venta directa esta activado
              if(me.setpermiso_cobro_venta_directa == 1){
                me.totalCobroVenta  = ( me.totalRegalados - ( me.totalRegalados * prevalor ) / 100)
              }else{
                me.totalCobroVenta = 0
              }
            }
          }
        }
      },
      //aqui traigo codigos normales y codigos regalados
      getDetallesVerificacion(){
        let me = this;
        me.sumaTotalVALOR             = 0
        me.sumaTotalRegalados         = 0
        me.DetalleVerificacion        = []
        me.arrayCodigosVerificacion   = []
        let datos                     = []
        me.verificacion_id            = me.pedido.id
        const { idInstitucion } = me.datosInstitucion
        me.title = "Verificación N. "+me.pedido.num_verificacion + " del contrato "+ me.pedido.contrato
        //AGRUPADO
        // despues de sierra 2024 para obtener agrupar por actas los codigos regalados
        if(me.regaladosReporteNuevo == 1){
          datos                   = me.arrayAllCodigos.filter(p => (p.estado_liquidacion == '0') && (p.bc_institucion == idInstitucion || p.venta_lista_institucion == idInstitucion) )
        }else{
          datos                   = me.arrayAllCodigos.filter(p => (p.estado_liquidacion == '0' || p.estado_liquidacion == '2') && (p.bc_institucion == idInstitucion || p.venta_lista_institucion == idInstitucion) )
        }
        me.arrayCodigosVerificacion = me.arrayAllCodigos.filter(p => (p.estado_liquidacion == '0' || p.estado_liquidacion == '2') && (p.bc_institucion == idInstitucion || p.venta_lista_institucion == idInstitucion) )
        datos.forEach(item => {
          // const descuentoTexto = item.descuento ? item.descuento + "%" : "sin descuento %";
          var preDescuento     = item.descuento
          if(me.ifCondicionalDescuentoVenta == 1){
            preDescuento       = me.sendPedido.descuento
          }
          const descuentoTexto = preDescuento ? preDescuento + "%" : "sin descuento %";
          if(me.ifCondicionalDescuentoVenta == 1){
            var nombre_libro    = item.nombre_libro + " | " + descuentoTexto;
          }else{
            var nombre_libro    = item.nombre_libro;
          }
          const nombre_original = item.nombre_libro;
          const subtotal        = (item.precio * item.cantidad).toFixed(2)*1;
          // const descuento    = item.descuento;
          const descuento       = preDescuento;
          const codigo          = item.codigo;
          const precio          = item.precio;
          const libro_id        = item.libro_id;
          const IdVerificacion  = item.IdVerificacion;
          const verificacion_id = item.verificacion_id;
          const libro_idlibro   = item.libro_idlibro;
          // Busca si ya existe un objeto con el mismo libro en groupedData
          const existingGroup = me.DetalleVerificacion.find(group => group.nombre_libro === nombre_libro);
          // Si no existe, crea un nuevo objeto y agrégalo a groupedData
          if (!existingGroup) {
            me.DetalleVerificacion.push({ nombre_libro, codigo, precio, libro_id, IdVerificacion,verificacion_id, libro_idlibro ,cantidad: 1, descuento, nombre_original, subtotal });
          } else {
            // Si existe, incrementa la cantidad en el objeto existente
            existingGroup.cantidad++;
          }
        });

        me.DetalleVerificacion.map((item) => {
          item.valor        = item.precio * item.cantidad
          if(me.ifCondicionalDescuentoVenta == 1){
            // Si descuento es null, NaN, 0 o no válido, marcar valor como 0 para revisión
            if (!item.descuento) {
              item.valor = item.valor;
            } else {
              let descuentoValor = (item.valor * item.descuento) / 100;
              item.valor = item.valor - descuentoValor;
              item.subtotal = (item.cantidad * item.precio).toFixed(2)*1;
            }
          }

        });

        //OBSEQUIOS SI PERMISO_ACTA_OBSEQUIOS = 1

        let arrayRegaladosNuevo = []
        // despues de sierra 2024 para obtener agrupar por actas los codigos regalados
        if(me.regaladosReporteNuevo == 1){
          let preRegalados                   = me.arrayAllCodigos.filter(p => (p.estado_liquidacion == '2') )
          preRegalados.forEach(item => {
            const descuentoTexto = item.descuento ? item.descuento + "%" : "sin acta de %";
            const sufijo_HD = item.ifObsequio === 0 ? " (HD)" : "";
            const nombre_libro   = item.nombre_libro + " - " + descuentoTexto + sufijo_HD;
            const nombre_original = item.nombre_libro + sufijo_HD;
            const codigo         = item.codigo;
            const precio         = item.precio;
            const descuento      = item.descuento;
            // Busca si ya existe un objeto con el mismo libro en groupedData
            const existingGroup = arrayRegaladosNuevo.find(group => group.nombre_libro === nombre_libro);

            // Si no existe, crea un nuevo objeto y agrégalo a groupedData
            if (!existingGroup) {
              arrayRegaladosNuevo.push({ nombre_libro, codigo, cantidad: 1, precio, descuento, nombre_original });
            } else {
              // Si existe, incrementa la cantidad en el objeto existente
              existingGroup.cantidad++;
            }
          });
          //sumar arrayRegaladosNuevo
          arrayRegaladosNuevo.map((item) => {
            let precio    = parseFloat(item.precio) || 0;
            let cantidad  = parseFloat(item.cantidad) || 0;
            let descuento = parseFloat(item.descuento);
            item.subtotal = (precio * cantidad).toFixed(2)*1;
            let preValor = precio * cantidad;

            // Si descuento es null, NaN, 0 o no válido, marcar valor como 0 para revisión
            if (!descuento) {
              item.valor = 0;
            } else {
              let descuentoValor = (preValor * descuento) / 100;
              item.valor = preValor - descuentoValor;
            }
            item.actaRegalado = 1
          });
          //=== FIN SUMA REGALADOS CON COMBOS================
        }
        //unir arrayCombos y arrayRegaladosNuevo  a DetalleVerificacion
        me.DetalleVerificacion = [...me.DetalleVerificacion,...arrayRegaladosNuevo,...me.arrayCombos]
        //sumar combos
        me.arrayCombos.forEach(function (item) {
          var idtipodoc = item.idtipodoc || 0;
          var valorBase = item.precio * item.cantidad_items;
          var descuento = item.descuento || 0;

          if (idtipodoc != 2 && idtipodoc != 4) {
            // para que los combos se descuente el descuento individual
            if(me.ifCondicionalDescuentoVenta == 1){
              item.valor = valorBase * (1 - (descuento / 100));
            }else{
              item.valor = valorBase;
            }
          } else {
            item.valor = valorBase * (1 - (descuento / 100));
            console.log("item.codigo:", item.codigo, "valorBase:", valorBase, "descuento:", descuento, "item.valor:", item.valor);
          }
        });

        let regaladosNormales = 0
        // sumar sumaTotalRegalados de arrayRegaladosNuevo
        arrayRegaladosNuevo.forEach(function (item) {
          me.sumaTotalRegalados += item.valor;
          regaladosNormales += item.valor;
        });
        console.log("regaladosNormales",regaladosNormales)
        // sumar sumaTotalRegalados de combos
        me.sumaTotalRegalados += me.CombosTotalDevolucionSueltosPorcentaje
        console.log("regalados combos",me.CombosTotalDevolucionSueltosPorcentaje)
        // dejar valor cero los que tengan actaRegalado = 1 validar que exista la propiedad actaRegalado
        me.DetalleVerificacion.forEach(function (item) {
          if (item.actaRegalado && item.actaRegalado == 1) {
            item.valor = 0;
          }
        });
        // sumar total valor
        me.DetalleVerificacion.forEach(function (item) {
          me.sumaTotalVALOR += item.valor;
        });
        console.log("sumaTotalVALOR",me.sumaTotalVALOR)
        // console.log("totalRegalados",me.totalRegalados)
        console.log("sumaTotalRegalados",me.sumaTotalRegalados)
        me.updateValorLiquidacion()
        me.popupDetalleVerificacion = true
      },
      updateValorLiquidacion(){
        let me = this;
        let formData = new FormData();
        formData.append('verificacion_id',    me.pedido.id);
        if(me.regaladosReporteNuevo == 1){
           formData.append('venta_real',         me.sumaTotalVALOR);
          formData.append('venta_real_regalados',me.totalRegalados)
        }else{
            formData.append('venta_real',         me.sumaTotalVALOR - me.totalRegalados);
            formData.append('venta_real_regalados',me.totalRegalados)
        }
        this.$http.post(this.$server_url+'updateVentaReal', formData)
        .then(res => {
        })
      },
      getRefrescarDocumentos(validacion){
        let me = this;
        me.getInformacionLiquidacion(validacion)
        if(me.popupSolicitudFactura){
          me.f_notificacionFactura(0)
        }
        if(me.popupSolicitud){
          me.f_notificacionFactura(1)
        }
        if(me.popupRevision){
          me.f_notificacionFactura(2)
        }
        me.popupSolicitud = false;
        me.popupSolicitudFactura = false;
        me.popupRevision = false;
        me.documentoSeleccionado = null;
      },
      f_notificacionFactura(tipo){
        let me = this;
        let formData = new FormData();
        if(tipo == 0){
          formData.append('saveNotification',1);
          formData.append('nombre','Subida de factura');
          formData.append('descripcion','');
          formData.append('tipo', 0);
          formData.append('user_created',me.usuario.idusuario);
          formData.append('id_periodo',me.sendPedido.id_periodo);
          formData.append('id_padre',me.pedido.id);
          formData.append('estado',0)
        }
        if(tipo == 1){
          formData.append('saveNotification',1);
          formData.append('nombre','Subida de evidencia');
          formData.append('descripcion','');
          formData.append('tipo',2);
          formData.append('user_created',me.usuario.idusuario);
          formData.append('id_periodo',me.sendPedido.id_periodo);
          formData.append('id_padre',me.pedido.id);
          formData.append('estado',0)
        }
        if(tipo == 2){
          formData.append('saveNotification',1);
          formData.append('nombre','Subida de revisión');
          formData.append('descripcion','');
          formData.append('tipo',3);
          formData.append('user_created',me.usuario.idusuario);
          formData.append('id_periodo',me.sendPedido.id_periodo);
          formData.append('id_padre',me.pedido.id);
          formData.append('estado',0)
        }


        this.$http.post(this.$server_url+'notificaciones', formData)
        .then(res => {
          if(res.data.status == '0'){
            //ocurrio un error
            me.$vs.notify({
              text:res.data.message,
              color:'warning',
              iconPack: 'feather',
              icon:'icon-alert-triangle'})
            return
            }
            if(res.data.status == '2'){
              me.$vs.notify({
                text:res.data.message,
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
              return;
            }
            if(tipo == 1){
              me.$vs.notify({
                text:'Se notifico a facturación',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            }
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.notify({
            text:'Error al crear notificacion',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
        })
      },
      f_recargeVerificaciones(){
        let me = this;
        me.getInformacionLiquidacion()
      },
      recharge(e){
          let me = this
          me.verLibrosSelected = ""
          me.desdeDetalle      = 0
          me.verLibrosSelected = e.data
          //para ver el menu de verificacion libros el ver codigos
          if(e.tipo == 2){ me.VerCodigos(e.data,e.filtro)
              return
          }
          //libros regalados
          if(e.tipo == 3){
              me.verCodigosRegalados(e.data)
              return
          }
          //actualizar cobro venta directa
          if(e.tipo == 4){
            me.getAllCodigosXContrato()
            me.setcobro_venta_directa     = e.data.sendValor
            me.settipoPago                = e.data.sendTipo
            me.settotalDescuento          = e.data.sendtotalDescuento
            me.getInformacionLiquidacion()
            return
          }
          //actualizar codigos regalados
          if(e.tipo == 5){
            me.getAllCodigosXContrato()
            me.updateValorLiquidacion()
            return
          }
          //actualizar valor personalizado
          if(e.tipo == 6){
            me.getAllCodigosXContrato()
            me.setPersonalizado           = e.data.sendValor
            me.settotalDescuento          = e.data.sendtotalDescuento
            me.setcampoPersonalizado      = e.data.sendcampoPersonalizado
            me.getInformacionLiquidacion()
          }
          //actualizar configuracion reporte
          if(e.tipo == 7){
            me.getAllCodigosXContrato()
            me.setpermiso_cobro_venta_directa = e.sendpermiso_cobro_venta_directa
            me.getInformacionLiquidacion()
          }
          //actualizar todo
          if(e.tipo == 8){
            me.getAllCodigosXContrato()
          }
          //recharge only convenios
          me.popupSolicitud         = false
          me.popupSolicitudFactura  = false
          me.popupRevision          = false
      },
      openDocument(tr, archivo,tipo){
        this.previewEvidencia = null;
        this.previewFactura = null;
        this.previewRevision = null;
        // Dependiendo del tipo de archivo, seleccionamos el archivo adecuado
        this.documentoSeleccionado = tr;  // Guardamos todo el objeto del 'tr' que contiene el archivo seleccionado
        this.popupDocumentos = true; // Abrimos el popup de documentos
        // console.log("v",archivo.egf_url + archivo.egf_archivo);
        // Aquí seleccionamos el primer archivo de tipo 'evidencia', 'factura' o 'revisión'
        if (tipo == 'evidencia') {
          // Asignamos el primer archivo de evidencia como la vista previa
          this.previewEvidencia = this.$data_url + archivo.egf_url + archivo.egf_archivo;
        } else if (tipo == 'factura') {
          // Asignamos el primer archivo de factura como la vista previa
          this.previewFactura = this.$data_url + archivo.egf_url + archivo.egf_archivo;
        } else if (tipo == 'revisiones') {
          // Asignamos el primer archivo de revisión como la vista previa
          this.previewRevision = this.$data_url + "archivos/verificaciones/revisiones/" + archivo.egf_archivo;
        }
        // let me = this;
        // if(me.documento.substr(-3) == 'pdf'){
        //     let ruta = me.$data_url+'archivos/verificaciones/'+me.tipoDocumento+'/'+me.documento
        //     window.open(ruta,'_blank')
        //     return
        // }
        // me.popupDocumento = true;
      },
      //METODOS PARA EXPORTAR A EXCEL
      exportToExcel() {
        let headerTitle =
        [
          'Código',
          'Verif1',
          'Verif2',
          'Verif3',
          'Verif4',
          'Verif5',
          'Total',
        ];
        let headerVal = [
          'codigo',
          'verif1',
          'verif2',
          'verif3',
          'verif4',
          'verif5',
          'total',
        ];
        import('@/vendor/Export2Excel').then(excel => {
          const data = this.formatJson(headerVal, this.desgloseContrato)
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: this.contrato,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
          })
          this.clearFields()
        })
      },
      exportVerificacionPdf(tipo){
          let me = this;
          me.popupDetalleVerificacion                 = false
          me.popupCarga                               = true
          //reporte pdf o excel
          if(tipo == 1) {  me.mostrarReportePdf       = true }
          //reporte tipo de venta
          if(tipo == 2) { me.mostrarReporteTipoVenta  = true}

      },
      buscarTodoCodigos(devolucion){
        let me = this
        me.arregloTodoCodigosIndividuales = []
        me.$vs.loading()
        this.$http.get(this.$server_url+`n_verificacion?getAllCodigosIndividualesContrato=1&contrato=${me.pedido.contrato}&num_verificacion=${me.pedido.num_verificacion}&verificacion_id=${me.pedido.id}&devueltos=${devolucion}`)
        .then(function (res) {
            me.$vs.loading.close()
            let datos = res.data
            if(datos.length > 0){
              me.arregloTodoCodigosIndividuales = res.data

              const headerTitle = new Set();
              headerTitle.add("codigo");
              headerTitle.add("codigo_liquidacion");
              headerTitle.add("Nombre libro");
              headerTitle.add("Estado");
              headerTitle.add("Estado_liquidacion");
              headerTitle.add("Bc_estado");
              headerTitle.add("Tipo venta");
              headerTitle.add('Plus');
              headerTitle.add('Liquidado Devuelto');
              headerTitle.add('Combo');
              headerTitle.add('Combo Generado');

              const headerVal = new Set();
              headerVal.add("codigo");
              headerVal.add("codigo_liquidacion");
              headerVal.add("nombrelibro");
              headerVal.add("codigoEstado");
              headerVal.add("liquidacion");
              headerVal.add("barrasEstado");
              headerVal.add("ventaEstado");
              headerVal.add('plus');
              headerVal.add('quitar_de_reporte');
              headerVal.add('combo');
              headerVal.add('codigo_combo');
              //exportar a excel
              me.exportTodoCodigos(headerTitle,headerVal,me.arregloTodoCodigosIndividuales,me.contrato+'_Codigos_Individuales'+'verificacion_'+me.pedido.num_verificacion)
            }else{
              me.$vs.notify({
                text: 'No hay codigos en la verificación',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-user'
              })
            }
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
          me.$vs.notify({
            text: 'Error al obtener los codigos',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-user'
          })
        })
      },
      exportTodoCodigos(valores_headerTitle,valores_headerVal,arrayDatos,nombreArchivo){
        let headerTitle = [...valores_headerTitle];
        let headerVal   = [...valores_headerVal ];
        import('@/vendor/Export2Excel').then(excel => {
          let datos = []
          datos = arrayDatos
          const data = this.formatJson(headerVal, datos)
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: nombreArchivo,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
          })
          this.clearFields()
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
            return v[j]
        }))
      },
      exportToExcelDetalle(tipoReporte){
        let headerTitle =
        [
          'Libro',
          'Código liquidación',
          'Cantidad',
          'Precio',
          'Valor',
        ];
        let headerVal = [
          'nombre_libro',
          'codigo',
          'cantidad',
          'precio',
          'valor',
        ];
        import('@/vendor/Export2Excel').then(excel => {
          let datos = []
          if(tipoReporte == 0) { datos = this.DetalleVerificacion }
          if(tipoReporte == 1) { datos = this.arregloRegalados }
          const data = this.formatJson(headerVal, datos)
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: tipoReporte == 1 ? this.contrato + '_Codigos_Docentes' : this.contrato,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
          })
          this.clearFields()
        })
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
            return v[j]
        }))
      },
      //limpiar campos para exportar de nuevo
      clearFields() {
          this.fileName = ''
          this.cellAutoWidth = true
          this.selectedFormat = 'xls'
      },
      //FIN METODOS PARA EXPORTAR A EXCEL
      openObservacion(){
        let me = this;
        me.$vs.loading()
          this.$http.get(this.$server_url+'getVerificacionXId/'+me.pedido.id)
            .then(function (res) {
              let datos = res.data
              if(datos.length > 0){
                me.observacion = datos[0].observacion
              }
              me.popupObservacion = true
              me.$vs.loading.close()
          })
          .catch(function (error) {
              console.log(error + ' error');
              me.$vs.loading.close()
          })
      },

       // Método para guardar las observaciones (incluyendo las actualizadas)
       guardarObservacion(observacion) {
        let formData = new FormData();
        formData.append('observacion', JSON.stringify(observacion));  // Enviar una observación individual
        formData.append('identificador', observacion.identificador);
        formData.append('tipo_observacion', observacion.tipo_observacion);
        formData.append('usuario', this.usuario.idusuario);
        formData.append('contrato', this.pedido.contrato);
        this.$vs.loading();
        this.$http.post(this.$server_url + 'guardarObservacion', formData)
          .then(res => {

            this.$vs.notify({
              text: res.data.message,
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-check',
            });
            this.$vs.loading.close();
            this.actualizarInfoObservaciones();

          })
          .catch(error => {
            this.$vs.notify({
              text: 'Error al guardar la observación',
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-triangle',
            });
            this.$vs.loading.close();
          });
      },
      actualizarInfoObservaciones(){
        let me = this;
        this.$http.get(this.$server_url+'getVerificacionXId/'+me.pedido.id)
            .then(function (res) {
              let datos = res.data
              if(datos.length > 0){
                me.observacion = datos[0].observacion
              }
          })
          .catch(function (error) {
              console.log(error + ' error');
              me.$vs.loading.close()
          })
      },
      agregarNuevaObservacion() {
        if (this.newObservacion !== "") {
          const nuevaObservacion = {
            id: null,  // Este ID puede ser null ya que es una nueva observación
            observacion: this.newObservacion,
            identificador: this.pedido.id,  // Ajusta según el identificador real
            tipo_observacion: 0,  // Tipo de observación para "verificación"
          };

          // this.observacion.push(nuevaObservacion);
          this.newObservacion = "";  // Limpiar el campo de nueva observación

          // Aquí puedes enviar la nueva observación al back-end
          this.guardarObservacion(nuevaObservacion);
        }
      },
      eliminarObservacion(index) {
        const observacionEliminada = this.observacion[index];

        // Eliminar la observación localmente
        this.observacion.splice(index, 1);

        // Aquí puedes enviar la solicitud al back-end para eliminar la observación
        this.eliminarObservacionDelServidor(observacionEliminada.id);
      },
      eliminarObservacionDelServidor(observacionId) {
        let formData = new FormData();
        formData.append('id', observacionId);

        this.$http.post(this.$server_url + 'eliminarObservacion', formData)
          .then(res => {
            this.$vs.notify({
              text: res.data.message,
              color: 'success',
              iconPack: 'feather',
              icon: 'icon-check',
            });
          })
          .catch(error => {
            this.$vs.notify({
              text: 'Error al eliminar la observación',
              color: 'danger',
              iconPack: 'feather',
              icon: 'icon-alert-triangle',
            });
          });
      },
      // Actualizar una observación
    actualizarObservacion(item) {
      // Verificamos que el contenido de la observación no esté vacío
      if (item.observacion.trim() !== "") {
        // Enviar al servidor para actualizar la observación
        this.$http.post(this.$server_url + 'actualizarObservacion', {
          id: item.id, // El id de la observación
          observacion: item.observacion, // La observación actualizada
          usuario: this.usuario.idusuario,
          contrato: this.pedido.contrato,
          novedad_id: item.novedad_id,
        })
        .then(response => {
          // Notificación o lógica para manejar el éxito
          this.$vs.notify({
            text: 'Observación actualizada correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check',
          });
          this.actualizarInfoObservaciones()
        })
        .catch(error => {
          // Notificación o lógica para manejar errores
          this.$vs.notify({
            text: 'Error al actualizar la observación',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle',
          });
        });
      } else {
        this.$vs.notify({
          text: 'La observación no puede estar vacía',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle',
        });
      }
    },

    },
  }
  </script>

  <style scoped>
  .verif:hover {
      background-color: cornflowerblue;
      transition: 0.5s ease;
      padding: 5px;
      border-radius: 10px;
      color: white;
  }

  .imagen {
      cursor: pointer;
      opacity: 0.8;
      transition: 1s ease all;
  }

  .imagen:hover {
      text-decoration: underline;
      color: #217bc5;
      text-shadow: 2px 4px 2px #ccc;
  }

  .img {
      cursor: pointer;
      opacity: 0.9;
      transition: 0.3s ease-in-out;
      display: flex;
      align-items: center;
      gap: 8px;
      /* Espacio entre el texto y el icono */
      padding: 8px;
      border-radius: 6px;
  }

  .img:hover {
      text-decoration: underline;
      color: #217bc5;
      text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.1);
      background: rgba(33, 123, 197, 0.1);
  }

  /* Clases para iconos pastel */
  .icono-pastel {
      font-size: 20px;
      position: relative;
      top: 3px;
  }

  .rojo {
      color: #ff6961;
  }

  /* Rojo pastel */
  .azul {
      color: #2474c5;
  }

  /* Azul pastel */
  .verde {
      color: #77dd77;
  }

  /* Verde pastel */

  /* Resaltar el activo */
  .activo {
      text-decoration: underline;
      color: #21c5a2;
      text-shadow: 1px 2px 2px rgba(0, 0, 0, 0.1);
      background: rgba(33, 123, 197, 0.1);
  }

  /*ESTILOS MENU**/

  /*MENU*/
  .activeBtn {
      background-color: #1cbeb3;
      color: white !important;
  }

  /**ESTILOS SUB MENU */
  .breadcrumbs {
      border: 1px solid #cbd2d9;
      border-radius: 0.3rem;
      display: inline-flex;
      overflow: hidden;
  }

  .breadcrumbs__item {
      outline: none;
      padding: 0.75em 0.75em 0.75em 1.25em;
      position: relative;
      text-decoration: none;
      transition: background 0.2s linear;
      color: black;
  }

  .breadcrumbs__item:hover:after,
  .breadcrumbs__item:hover {
      background: #000;
      color: #fff;
  }

  .breadcrumbs__item:focus:after,
  .breadcrumbs__item:focus,
  .breadcrumbs__item.is-active:focus {
      background: #1cbeb3;
      color: #fff;
  }

  .breadcrumbs__item:after,
  .breadcrumbs__item:before {
      background: white;
      bottom: 0;
      clip-path: polygon(50% 50%, -50% -50%, 0 100%);
      content: "";
      left: 100%;
      position: absolute;
      top: 0;
      transition: background 0.2s linear;
      width: 1em;
      z-index: 1;
  }

  .breadcrumbs__item:before {
      background: #cbd2d9;
      margin-left: 1px;
  }

  .breadcrumbs__item:last-child {
      border-right: none;
  }

  .breadcrumbs__item.is-active {
      background: #edf1f5;
  }

  .informacionformhijo {
      z-index: 51001;
      /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
      /* position: fixed; */
      /* Asegúrate de que la posición sea adecuada */
  }

  .activo {
      background-color: #d1e7dd;
      /* Verde claro */
      border-radius: 5px;
      padding: 5px;
      font-weight: bold;
  }

  /* Estilo para la alerta */
  .alerta {
      padding: 5px;
      margin: 5px 0;
      border-radius: 5px;
      color: white;
      font-weight: bold;
  }

  /* Estilo específico para la observación de revisión */
  .observacion-revision {
      background-color: #f44336;
      /* Rojo */
  }

  /* Puedes agregar más estilos o clases para diferentes tipos de alertas */

  .informacionform {
      z-index: 51001;
      /* Valor mayor que el del popup del padre */
      position: fixed;
      /* Asegúrate de que la posición sea adecuada */
  }
  .padrePopup{
      z-index: 51001;
      /* Valor menor que el del popup del hijo */
      position: fixed;
      /* Asegúrate de que la posición sea adecuada */
  }


  </style>
