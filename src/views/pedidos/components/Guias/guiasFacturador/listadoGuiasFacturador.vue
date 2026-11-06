<template>
    <div>
      <vs-alert style="height: 70px;" v-if="!AdminBodega || userBodegaNormal">
        <p>
          Los documentos de actas que no esten enviados a <b>PERSEO</b> <b> bodega</b> no va a poder visualizar
        </p>
      </vs-alert>
      
      <!-- Barra de acciones superior -->
      <div class="custom-action-bar">
        <div class="action-left">
          <h3 class="view-title">Listado de Pedidos de Guías</h3>
        </div>
        <div class="action-search">
          <div class="global-search-wrapper">
            <svg class="global-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            <input
              type="text"
              class="global-search-input-native"
              placeholder="Buscar por Acta, Asesor, documento (A-GC26-...)..."
              v-model="busquedaGlobal"
              @keyup.enter="buscarGlobal()"
            />
            <button v-if="busquedaGlobal" class="global-search-clear" @click="limpiarBusquedaGlobal()" title="Limpiar búsqueda">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          <vs-button
            color="primary"
            type="filled"
            @click="buscarGlobal()"
            class="search-submit-btn"
          >Buscar</vs-button>
        </div>
        <div class="action-right">
          <!--boton para recargar-->
          <vs-button v-if="filtro != 3" color="primary" type="filled" icon="refresh" @click="recargarGuias()">Recargar</vs-button>
          <!--boton para solicitar guia-->
          <vs-button v-if="groupFacturador" color="success" type="filled" icon-pack="feather" icon="icon-plus" @click="f_validatePedido()">Solicitar guía</vs-button>
          <!--boton reporte guias asesor-->
          <vs-button v-if="userRoot" color="warning" type="filled" icon-pack="feather" icon="icon-file-text" @click="abrirReporteGuiasAsesor()">Reporte guias asesor</vs-button>
        </div>
      </div>

      <!-- Banner de resultados de búsqueda -->
      <div v-if="filtro == -1" class="search-results-banner">
        <div class="search-banner-content">
          <svg class="w-5 h-5 text-info" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <span class="font-semibold text-sm">Mostrando resultados de búsqueda global para: <b>"{{ busquedaGlobal }}"</b></span>
        </div>
        <vs-button size="small" color="warning" type="border" @click="limpiarBusquedaGlobal()">Limpiar y volver</vs-button>
      </div>

      <!-- Filtro de Fechas - Solo visible en filtro de Entregados -->
      <div v-if="filtro == 3" class="date-filter-card">
        <div class="vx-row">
          <div class="vx-col w-full md:w-1/4 px-2 mb-3 md:mb-0">
            <label class="vs-input--label font-semibold">Fecha Inicio:</label>
            <vs-input type="date" v-model="fechaInicio" class="w-full" />
          </div>
          <div class="vx-col w-full md:w-1/4 px-2 mb-3 md:mb-0">
            <label class="vs-input--label font-semibold">Fecha Fin:</label>
            <vs-input type="date" v-model="fechaFin" class="w-full" />
          </div>
          <div class="vx-col w-full md:w-1/4 px-2 mb-3 md:mb-0 btn-container-align">
            <vs-button @click="filtrarPorFechas()" color="success" type="filled" icon-pack="feather" icon="icon-filter" class="w-full">
              Filtrar por Fechas
            </vs-button>
          </div>
          <div class="vx-col w-full md:w-1/4 px-2 btn-container-align">
            <vs-button @click="limpiarFiltroFechas()" color="warning" type="border" icon-pack="feather" icon="icon-x" class="w-full">
              Limpiar Filtro
            </vs-button>
          </div>
        </div>
      </div>

      <!-- Barra de navegación de filtros (Reemplaza vs-radio) -->
      <div class="filter-tabs-container">
        <ul class="filter-tabs-list">
          <li v-if="userAdmin == true || usuario.id_group == 27" 
              class="filter-tab-item" 
              :class="{ active: filtro == 0 }" 
              data-value="0"
              @click="filtro = 0; filtroTipo();">
            <span class="filter-badge badge-pending">{{sumaPendientes}}</span>
            <span>Pendientes</span>
          </li>
          <li class="filter-tab-item" 
              :class="{ active: filtro == 1 }" 
              data-value="1"
              @click="filtro = 1; filtroTipo();">
            <span class="filter-badge badge-approved">{{ SumaAprobados }}</span>
            <span>Aprobados</span>
          </li>
          <li class="filter-tab-item" 
              :class="{ active: filtro == 2 }" 
              data-value="2"
              @click="filtro = 2; filtroTipo();">
            <span class="filter-badge badge-partial">{{ SumaAprobadosPendientes }}</span>
            <span>Aprobados con pendientes</span>
          </li>
          <li class="filter-tab-item" 
              :class="{ active: filtro == 4 }" 
              data-value="4"
              @click="filtro = 4; filtroTipo();">
            <span class="filter-badge badge-cancelled">{{ SumaAnulados }}</span>
            <span>Anulados por facturación</span>
          </li>
          <li v-if="!AdminBodega || userBodegaNormal" 
              class="filter-tab-item" 
              :class="{ active: filtro == 5 }" 
              data-value="5"
              @click="filtro = 5; filtroTipo();">
            <span class="filter-badge badge-no-perseo">{{ SumaSinEnviarPerseo }}</span>
            <span>Sin enviar a PERSEO</span>
          </li>
          <li v-if="!AdminBodega || userBodegaNormal" 
              class="filter-tab-item" 
              :class="{ active: filtro == 6 }" 
              data-value="6"
              @click="filtro = 6; filtroTipo();">
            <span class="filter-badge badge-perseo">{{ SumaEnviadosPerseo }}</span>
            <span>Enviados a PERSEO</span>
          </li>
          <li class="filter-tab-item" 
              :class="{ active: filtro == 3 }" 
              data-value="3"
              @click="filtro = 3; filtroTipo();">
            <span class="filter-badge badge-delivered">{{ SumaEntregados }}</span>
            <span>Entregados / Despachados</span>
          </li>
        </ul>
        
        <!-- Búsqueda específica en entregados -->
        <div v-if="(usuario.id_group == 22 || usuario.id_group == 23 || usuario.id_group == 27) && filtro == 3" class="search-acta-container">
          <vs-input icon-after="true" style="width: 250px;" icon="search" placeholder="Buscar Acta" v-model="busquedaxcodigo" @keyup.enter="filtrarPedidos()" />
        </div>
      </div>

        <vs-table search :data="tmpPedidos" stripe pagination max-items="10" class="custom-pedidos-table">
            <template slot="header">
                <vs-chip color="primary" class="font-semibold">Cantidad: {{ tmpPedidos.length }}</vs-chip>
            </template>
            <template slot="thead">
                <vs-th style="width: 60px;"># ID</vs-th>
                <vs-th style="width: 25%;" sort-key="asesor">Asesor / Responsables</vs-th>
                <vs-th style="width: 15%;" sort-key="fecha_envio">Fechas</vs-th>
                <vs-th style="width: 8%;" sort-key="total_unidades_guias">Guías</vs-th>
                <vs-th style="width: 47%;" sort-key="estado_entrega">Estado / Documentos</vs-th>
                <vs-th style="width: 5%;">Acc.</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                     <vs-td class="font-bold text-gray-500"> {{ tr.id_pedido }} </vs-td>
                     <vs-td>
                        <div class="responsable-simple-container">
                            <div class="responsable-name">{{ tr.responsable }}</div>
                            <div class="responsable-details-vertical">
                                <div class="detail-item"><b>C.I:</b> {{ tr.cedula }}</div>
                                <div v-if="filtro > 0 && tr.empresa" class="detail-item"><b>Empresa:</b> {{ tr.empresa }}</div>
                                <div class="detail-item"><b>Período: </b> <span class="periodo-chip-simple">{{ tr.periodo }}</span></div>
                            </div>
                            <div class="responsable-badges-row">
                                <span v-if="tr.facturacion_vee == 0" class="badge-simple bg-danger-light text-danger">Facturador no puede ver</span>
                                <span v-if="tr.guias_version_perseo == 1" class="badge-simple bg-primary-light text-primary">perseo</span>
                            </div>
                        </div>
                     </vs-td>
                     <vs-td>
                        <div class="dates-simple">
                            <span class="date-label-simple">Envío:</span>
                            <span class="date-value-simple">{{ tr.fecha_envio ? tr.fecha_envio.substring(0,10) : '—' }}</span>
                            <span class="date-label-simple muted">Creación:</span>
                            <span class="date-value-simple muted">{{ tr.created_at ? tr.created_at.substring(0,10) : '—' }}</span>
                        </div>
                     </vs-td>
                     <vs-td class="font-bold text-center text-lg text-primary">
                        {{ tr.total_unidades_guias }}
                     </vs-td>
                     <vs-td>
                        <!-- ANULADO -->
                        <div v-if="tr.estado == 2" class="anulado-box-compact">
                            <span class="anulado-title">✕ Anulado</span>
                            <span class="anulado-detail">{{ tr.usuario_anulado }} · {{ tr.message_anulado }}</span>
                        </div>

                        <!-- FILA 1: Obs + Estado -->
                        <div class="estado-row">
                            <vx-tooltip v-if="tr.observacion != null" text="Ver Observación asesor" position="top" color="primary">
                                <button class="obs-btn" @click="pedido=tr;popupObservacion=true;">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                                    Obs
                                </button>
                            </vx-tooltip>
                            <span class="estado-badge-compact"
                                  :class="{
                                    'eb-created':  tr.estado_entrega == 0,
                                    'eb-approved': tr.estado_entrega == 1,
                                    'eb-delivered':tr.estado_entrega == 2,
                                    'eb-partial':  tr.estado_entrega == 3
                                  }">
                                <b>Pedido:</b>
                                <span v-if="tr.estado_entrega == 0" class="ml-1">Creado</span>
                                <span v-if="tr.estado_entrega == 1" class="ml-1">Aprobado</span>
                                <span v-if="tr.estado_entrega == 2" class="ml-1">Entregado</span>
                                <span v-if="tr.estado_entrega == 3" class="ml-1">Pend. despacho</span>
                            </span>
                        </div>

                        <!-- FILA 2: Acta -->
                        <div v-if="tr.ven_codigo != null" class="acta-inline">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>
                            <span>{{ tr.ven_codigo }}</span>
                        </div>

                        <!-- FILA 3: Fechas proceso (módulo antiguo) -->
                        <div v-if="tr.estado_entrega > 0 && tr.guias_version_perseo == 0" class="proceso-dates">
                            <span v-if="tr.estado_entrega > 0">✓ {{ tr.fecha_aprobado_facturacion }}</span>
                            <span v-if="tr.estado_entrega > 1"> · ↗ {{ tr.fecha_entrega_bodega }}</span>
                        </div>
                        <div v-if="tr.estado_entrega == '3' && tr.guias_version_perseo == 0" class="text-xs text-danger font-bold">Con pendientes</div>

                        <!-- DOCUMENTOS PERSEO: listado en tabla altamente legible y moderna -->
                        <div v-if="tr.pendientes && tr.pendientes.length > 0 && tr.guias_version_perseo == 1" class="docs-perseo-section">
                            <div class="docs-perseo-header">
                                <span>Documentos Actas ({{ tr.pendientes.length }})</span>
                                <button class="docs-ver-todo-btn" @click="pedido=tr; tabInicial='Documentos de venta'; popupGenerarDocumento=true;">Ver todo</button>
                            </div>
                            <table class="sub-table-docs">
                                <thead>
                                    <tr>
                                        <th>Documento</th>
                                        <th>Enviado Perseo</th>
                                        <th>Fechas</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(p, index) in tr.pendientes" :key="index">
                                        <td>
                                            <a class="dp-code-link" @click="abrirDocumentoPerseo(p, tr)">{{ p.ven_codigo }}</a>
                                        </td>
                                        <td>
                                            <div class="perseo-col-info">
                                                <span class="perseo-status-indicator" :class="{ 'sent': p.estadoPerseo == 1 }">
                                                    {{ p.estadoPerseo == 1 ? 'Sí' : 'No' }}
                                                </span>
                                                <span v-if="p.pedido_codigo" class="perseo-pedido-code">
                                                    {{ p.pedido_codigo }}
                                                </span>
                                            </div>
                                        </td>
                                        <td class="dates-col-info">
                                            <div class="sub-date"><span>Creación:</span> {{ p.ven_fecha ? p.ven_fecha.substring(0,10) : '—' }}</div>
                                            <div class="sub-date" v-if="p.fecha_proceso_despacho"><span>Despacho:</span> {{ p.fecha_proceso_despacho.substring(0,10) }}</div>
                                        </td>
                                        <td>
                                            <span class="sub-status-badge" :class="'badge-status-' + p.est_ven_codigo">
                                                {{ p.est_ven_codigo == 1 ? 'Despachado' : p.est_ven_codigo == 2 ? 'Pendiente' : 'Anulado' }}
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <!-- DOCUMENTOS ANTIGUO: links limpios -->
                        <div v-if="tr.pendientes && tr.pendientes.length > 0 && tr.guias_version_perseo == 0" class="docs-legacy-section">
                            <span v-for="(p,index) in tr.pendientes" :key="index"
                                  class="legacy-doc-link cursor-pointer"
                                  @click="pedido=tr;ObjectPedidoHijo=p;f_mostrarDocumentoPendiente()">
                                {{ p.ven_codigo }}
                            </span>
                        </div>
                    </vs-td>
                    <vs-td align="center">
                        <vs-dropdown vs-custom-content vs-trigger-click>
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 250px;" class="cursor">
                                <!--Generar  ACTA-->
                                <vs-dropdown-item v-if="groupFacturador && tr.guias_version_perseo == 1">
                                     <vs-button class="w-full" color="dark"  icon-pack="feather" icon="icon-check" type="line" @click="popupGenerarDocumento=true;pedido = tr;tabInicial='Resumen';">Módulo Perseo</vs-button>
                                </vs-dropdown-item>
                                 <!--APROBAR ACTA-->
                                <vs-dropdown-item v-if="groupFacturador && tr.ven_codigo == null && tr.estado == 1  && tr.guias_version_perseo == 0">
                                    <vx-tooltip style="display: inline-block;" text="AL PRESIONAR SE ENVIARA AL SISTEMA DE FACTURACION" position="top" color="primary">
                                     <vs-button class="w-full" color="dark"  icon-pack="feather" icon="icon-check" type="line" @click="verResumen =false;pedido = tr;tipoProceso=0;openConfirmEmpresa(0)">Aprobar solicitud</vs-button>
                                    </vx-tooltip>
                                </vs-dropdown-item>
                                <!--APROBAR PENDIENTES-->
                                <vs-dropdown-item v-if="groupFacturador && tr.estado_entrega == '3' && tr.estado == 1 && tr.guias_version_perseo == 0">
                                    <vs-button class="w-full" color="danger"  icon-pack="feather" icon="icon-check" type="line" @click="verResumen =false;pedido = tr;tipoProceso=0;openConfirmEmpresa(1)">Aprobar pendientes</vs-button>
                                </vs-dropdown-item>
                                <!--IMPRIMIR ACTA FACTURACION-->
                                <vs-dropdown-item v-if="( userAdmin == true ) && tr.ven_codigo != null && tr.guias_version_perseo == 0">
                                    <vs-button class="w-full" color="#3541D3" icon-pack="feather" icon="icon-printer" type="line" @click="pedido = tr;ImprimirActa(0)">Imprimir acta(f)</vs-button>
                                </vs-dropdown-item>
                                <!--IMPRIMIR ACTA BODEGA-->
                                <vs-dropdown-item v-if="( usuario.id_group == 1  || usuario.id_group == 27 ) && tr.ven_codigo != null && (filtro == 1 || filtro == 2 || filtro == 3) && tr.guias_version_perseo == 0">
                                    <vs-button class="w-full" color="#3541D3" icon-pack="feather" icon="icon-printer" type="line" @click="pedido = tr;ImprimirActa(1)">Imprimir acta(b)</vs-button>
                                </vs-dropdown-item>
                                <!--RESUMEN-->
                                <vs-dropdown-item v-if="tr.guias_version_perseo == 0">
                                    <vs-button class="w-full"  icon="visibility" type="line" @click="verResumen =true;pedido = tr;tipoProceso=0;openConfirmEmpresa()">Resumen</vs-button>
                                </vs-dropdown-item>
                                <!--EDITAR PEDIDO-->
                                <vs-dropdown-item v-if="tr.estado_entrega == 0 && tr.estado != 2">
                                    <vs-button class="w-full" icon-pack="feather" color="warning" icon="icon-edit" type="line" @click="editarPedido(tr)">Editar</vs-button>
                                </vs-dropdown-item>
                                <!--ANULAR PEDIDO-->
                                <vs-dropdown-item v-if="groupFacturador && tr.estado == 1 && (tr.estado_entrega == 1 || tr.estado_entrega == 3 ) && tr.guias_version_perseo == 0">
                                    <vs-button class="w-full" color="danger" type="line" @click="pedido = tr;popupConfirmAnular=true;"><i class="fa-solid fa-delete-left"></i> Anular guia aprobada</vs-button>
                                </vs-dropdown-item>
                                <!--ENTREGAR GUIAS AL ASESOR(bodega)-->
                                <vs-dropdown-item v-if="(usuario.id_group == 17 || usuario.id_group == 27 || usuario.id_group == 1) && (tr.estado_entrega == 1) && tr.estado == 1">
                                    <!-- <vx-tooltip style="display: inline-block;" text="MARCAR COMO GUIAS ENTREGADAS AL ASESOR(BODEGA)" position="top" color="primary"> -->
                                        <vs-button class="w-full"  icon-pack="feather" color="dark" icon="icon-book" type="line" @click="pedido = tr;openConfirm(tr);">Entregar guias</vs-button>
                                    <!-- </vx-tooltip> -->
                                </vs-dropdown-item>
                                <!--REPORTE GUIA-->
                                <vs-dropdown-item v-if="usuario.id_group != 11 && tr.guias_version_perseo == 0">
                                    <vs-button class="w-full"  icon-pack="feather" icon="icon-file" @click="pedido = tr;getReporteGuia(tr);" color="success" type="line">Reporte guia</vs-button>
                                </vs-dropdown-item>
                                <!--ELIMINAR PEDIDO-->
                                <vs-dropdown-item v-if="tr.estado_entrega == 0 && (tr.estado == 1 || tr.estado == 0)">
                                    <vs-button class="w-full"  color="danger" type="line" @click="confirma_delete_pedido(tr)">Eliminar pedido</vs-button>
                                </vs-dropdown-item>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--IMPRIMIR GUIA-->
        <vs-popup fullscreen v-if="mostrarReporteG" title="Reporte Guia" :active.sync="mostrarReporteG">
            <exportGuiasVue :ObjectPedido="pedido" :id_periodo="pedido.id_periodo" :id_pedido="pedido.id_pedido" @change="changeHandle" />
        </vs-popup>
        <!--EXPORTAR ACTA FACTURADOR - ASESOR-->
        <vs-popup fullscreen v-if="mostrarImprimirActa" title="Acta" :active.sync="mostrarImprimirActa">
            <exportActaGuiasVue  v-if="mostrarImprimirActa" :pedido="pedido" @change="changeHandle" />
        </vs-popup>
        <!--EXPORTAR ACTA BODEGA - ASESOR-->
        <vs-popup fullscreen v-if="mostrarImprimirActaBodega" title="Acta" :active.sync="mostrarImprimirActaBodega">
            <exportActaGuiasBodegaVue v-if="mostrarImprimirActaBodega" :pedido="pedido" @change="changeHandle" />
        </vs-popup>
        <!--EXPORTAR ACTA BODEGA -PENDIENTES-->
        <vs-popup fullscreen v-if="mostrarImprimirActaBodegaPendientes" title="Acta" :active.sync="mostrarImprimirActaBodegaPendientes">
          <div v-if="mostrarImprimirActaBodegaPendientes">
            <exportActaGuiasBodegaPendientesVue :pedido="pedido" :ObjectPedidoHijo="ObjectPedidoHijo" @change="changeHandle"/>
          </div>
        </vs-popup>
        <!--IMPRIMIR DOCUMENTO PERSEO-->
        <vs-popup
          fullscreen
          :active.sync="popupDocumentoPerseo"
          v-if="popupDocumentoPerseo"
          title="Documento de Venta"
        >
          <GuiasPrintDocumentoVenta
            v-if="popupDocumentoPerseo"
            :objectedDocumentoVenta="facturaDocumentoPerseo"
          />
        </vs-popup>
        <!--MODAL CARGAR-->
        <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
            <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
            <img class="mt-2" style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png" />
        </vs-popup>
        <!--MODAL DETALLE DE LIBROS-->
        <vs-popup title="Detalle de libros" fullscreen :active.sync="modalLibros">
            <vs-table max-items="100" search pagination :data="arregloLibros">
                <template slot="header">
                    <div class="row">
                        <div class="col-12">Total Libros: <b>{{totalLibros}}</b></div>
                        <div class="col-12">Items: <b>{{arregloLibros.length}}</b></div>
                    </div>
                </template>
                <template slot="thead">
                    <vs-th>Libro</vs-th>
                    <vs-th>Cant. unidades</vs-th>
                    <vs-th>Precio unitario</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].nombrelibro}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].valor}}<br>
                        </vs-td>
                        <vs-td>
                            {{tr.precio}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-popup>
        <!--MODAL CONFIRMAR APROBAR-->
        <vs-popup class="popupPadre" fullscreen title="Generar Actas" :active.sync="popupGenerarDocumento" @close="recargarGuias">
          <div v-if="popupGenerarDocumento">
            <ScreenGuiasFacturador :ObjectSelected="pedido" :mixinIdInicioFormatoNewData="mixinIdInicioFormatoNewData" :initialTab="tabInicial"/>
          </div>
        </vs-popup>
        <!--MODAL PARA VER OBSERVACION DEL FACTURADOR-->
        <vs-popup classContent="popup-example" title="Ver comentario Asesor" :active.sync="popupObservacion">
            <p class="font-bold text-warning text-2xl">Comentario Asesor:</p>
            <vs-divider style="margin-top: -2px;"></vs-divider>
            <p class="">{{ pedido.observacion }}</p>
        </vs-popup>
        <!--MODADL PARA MOSTRAR LA EMPRESA -->
        <vs-popup classContent="popup-example" title="Empresa" :active.sync="popupMostrarEmpresa" @close="popupMostrarEmpresa = false;empresa=null;">
            <p class="font-bold text-warning text-2xl">Seleccione la Empresa:</p>
            <v-select :disabled="pedido.estado_entrega > 0" :options="arrayEmpresas" :reduce="arrayEmpresas => arrayEmpresas" label="nombre" class="w-full" v-model="empresa" />
            <br>
            <div class="flex justify-center mt-5">
              <vs-button icon="save" v-if="empresa" class="mr-3" @click="verStock">Seleccionar</vs-button>
              <vs-button color="warning" class="ml-2" @click="popupMostrarEmpresa = false;empresa=null;" icon-pack="feather" type="filled" icon="icon-x-circle">Cancelar</vs-button>
            </div>
            <br><br><br>
        </vs-popup>
         <!--MODAL CONFIRMAR APROBAR-->
        <vs-popup class="holamundo" fullscreen title="Stock de guias" :active.sync="popupConfirmAprobar">
          <div v-if="popupConfirmAprobar">
            <p> <b>Empresa:</b> {{ arrayEmpresas.find(p => p.id == empresa.id).nombre }} <br></p>
            <p v-if="verResumen == false && pedido.estado_entrega != '3'" class="font-bold text-warning text-2xl text-center">Está seguro de aprobar la solicitud de guias?</p>
            <p v-if="verResumen == false && pedido.estado_entrega == '3'" class="font-bold text-warning text-2xl text-center">Aprobacion de guias pendientes</p>
            <GuiasStockVue v-if="popupConfirmAprobar" :arregloStock="arregloStock" :ObjectedSelected="pedido" :verResumen="verResumen" @changeAprobar="changeAprobar" @changeAprobarPendientes="changeAprobarPendientes"/>
            <div v-if="verResumen == false && pedido.estado_entrega != '3'">
              <vs-divider></vs-divider>
              <div v-if="NohayStock && ifAprobarSinStock == '0'">
                <vs-alert color="danger"><p class="text-center">No hay stock no se puede aprobar</p></vs-alert>
              </div>
              <div v-else-if="ifAprobarSinStock == '1'">
                <vs-alert color="warning"><p class="text-center">Aprobar sin stock</p></vs-alert>
                <div class="flex justify-center mt-4">
                  <vs-button color="primary" @click="enviarGuiasBDMilton();" type="border" icon="save">Si deseo aprobar</vs-button>
                  <vs-button color="warning" class="ml-2" @click="popupConfirmAprobar = false;" icon-pack="feather" type="filled" icon="icon-x-circle">Cancelar</vs-button>
                </div>
              </div>
              <div v-else>
                <div class="flex justify-center">
                  <vs-button color="primary" @click="enviarGuiasBDMilton();" type="border" icon="save">Si deseo aprobar</vs-button>
                  <vs-button color="warning" class="ml-2" @click="popupConfirmAprobar = false;" icon-pack="feather" type="filled" icon="icon-x-circle">Cancelar</vs-button>
                </div>
              </div>
            </div>
          </div>
          <br><br>
        </vs-popup>
        <!--MODAL CONFIRMAR ANULACION-->
        <vs-popup class="holamundo" title="Anular pedido aprobado" :active.sync="popupConfirmAnular">
          <div v-if="popupConfirmAnular">
            <b>Documento:</b>
            <p>{{ pedido.ven_codigo }}</p>
            <p class="font-semibold mt-5 text-danger">Esta seguro de anular esta solicitud de guias. al hacerlo regresara el stock a bodega lo aprobado?</p>
            <vs-divider></vs-divider>
            <div>
                <p><b>Mensaje:</b></p>
                <vs-input v-model="message_anulado" placeholder="Escribe un mensaje para el usuario que anuló el pedido" type="textarea" rows="3" class="w-full"></vs-input>
            </div>
            <div class="flex justify-center mt-5">
                <vs-button color="danger" @click="anularPedido" type="border" icon="save">Si deseo anular</vs-button>
                <vs-button color="warning" class="ml-5" @click="popupConfirmAnular = false;" icon-pack="feather" type="filled" icon="icon-x-circle">Cancelar</vs-button>
            </div>
          </div>
        </vs-popup>
        <!--MODAL PARA ELIGIR EL PERIODO Y ASESOR-->
        <vs-popup title="Crear Solicitud de Guía" :active.sync="popupMostrarPeriodoYAsesor" @close="limpiarFormularioGuia()">
          <div v-if="popupMostrarPeriodoYAsesor">
            <p class="text-center mb-4 font-semibold text-lg">Complete la información para crear la solicitud de guía</p>
            
            <!-- Selección de Período -->
            <div class="mb-4">
              <label class="vs-input--label font-semibold mb-2">Período *</label>
              <v-select 
                :options="arregloPeriodos" 
                :reduce="arregloPeriodos => arregloPeriodos" 
                label="periodoescolar" 
                class="w-full" 
                v-model="periodoSelectedGuia" 
                placeholder="Seleccione un período"
              />
            </div>
            
            <!-- Selección de Asesor -->
            <div class="mb-4">
              <label class="vs-input--label font-semibold mb-2">Asesor *</label>
              <v-select 
                :options="arreglosAsesores" 
                :reduce="arreglosAsesores => arreglosAsesores" 
                label="usuario" 
                class="w-full" 
                v-model="asesorSelected" 
                placeholder="Seleccione un asesor"
              />
            </div>
            
            <vs-divider></vs-divider>
            
            <div class="flex justify-center mt-5">
              <vs-button 
                color="success" 
                @click="f_crearSolicitudGuia()" 
                type="gradient"
                icon-pack="feather"
                icon="icon-check"
                :disabled="!periodoSelectedGuia || !asesorSelected"
              >
                Crear Solicitud
              </vs-button>
              <vs-button 
                color="warning" 
                class="ml-2" 
                @click="limpiarFormularioGuia()" 
                icon-pack="feather" 
                type="border" 
                icon="icon-x-circle"
              >
                Cancelar
              </vs-button>
            </div>
            <br><br><br><br><br><br>
          </div>
        </vs-popup>

        <!-- POPUP REPORTE GUIAS ASESOR -->
        <vs-popup
          fullscreen
          title="Reporte Guías Asesor"
          :active.sync="popupReporteGuiasAsesor"
          @close="limpiarReporteGuiasAsesor()"
        >
          <div v-if="popupReporteGuiasAsesor">
            <div class="vx-row mb-4">
              <div class="vx-col w-full md:w-1/3 px-2 mb-3 md:mb-0">
                <label class="vs-input--label font-semibold mb-2">Período *</label>
                <v-select
                  :options="arregloPeriodosTodos"
                  :reduce="p => p"
                  label="periodoescolar"
                  class="w-full"
                  v-model="periodoReporteGuia"
                  placeholder="Seleccione un período"
                  @input="mostrarReporteGuiasAsesor = false"
                />
              </div>
              <div class="vx-col w-full md:w-1/3 px-2 mb-3 md:mb-0">
                <label class="vs-input--label font-semibold mb-2">Asesor *</label>
                <v-select
                  :options="arreglosAsesores"
                  :reduce="a => a"
                  label="usuario"
                  class="w-full"
                  v-model="asesorReporteGuia"
                  placeholder="Seleccione un asesor"
                  @input="mostrarReporteGuiasAsesor = false"
                />
              </div>
              <div class="vx-col w-full md:w-1/3 px-2 btn-container-align">
                <vs-button
                  color="primary"
                  type="filled"
                  icon-pack="feather"
                  icon="icon-search"
                  class="w-full"
                  :disabled="!periodoReporteGuia || !asesorReporteGuia"
                  @click="verReporteGuiasAsesor()"
                >
                  Ver reporte
                </vs-button>
              </div>
            </div>

            <vs-divider></vs-divider>

            <div v-if="mostrarReporteGuiasAsesor && periodoReporteGuia && asesorReporteGuia">
              <ReportePedidoGuiasIndividualVue
                :key="'reporte-' + asesorReporteGuia.idusuario + '-' + periodoReporteGuia.idperiodoescolar"
                :id_asesor="Number(asesorReporteGuia.idusuario)"
                :id_periodo="Number(periodoReporteGuia.idperiodoescolar)"
                :nombre_periodo="periodoReporteGuia.periodoescolar"
              />
            </div>
            <div v-else class="text-center mt-5">
              <p class="text-gray-600">Seleccione período y asesor, luego pulse <b>Ver reporte</b>.</p>
            </div>
            <br><br><br><br><br>
          </div>
        </vs-popup>
    </div>
    </template>
    <script>
    import {
      mapState
    } from "vuex";
    import exportGuiasVue from '../../../../temporadas/components/exportGuias.vue';
    import exportActaGuiasVue from '../../../../temporadas/components/exportActaGuias.vue';
    import exportActaGuiasBodegaVue from '../../../../temporadas/components/exportActaGuiasBodega.vue';
    import vSelect from 'vue-select'
    import Generalmix from "../../../../../mixins/Generalmix";
    const exportActaGuiasBodegaPendientesVue = () => import('../../../../temporadas/components/Pedidos/exportActaGuiasBodegaPendientes.vue')
    const ScreenGuiasFacturador = () => import('./ScreenGuiasFacturador.vue')
    const GuiasPrintDocumentoVenta = () => import('./GuiasPrintDocumentoVenta.vue')
    const ReportePedidoGuiasIndividualVue = () => import('../../../../pedidos2/pedidos/reportes/components/ReportePedidoGuiasIndividual.vue')
    import GuiasStockVue from '../GuiasStock.vue';
    export default {
      mixins: [Generalmix],
      components: {
        exportGuiasVue,
        exportActaGuiasVue,
        exportActaGuiasBodegaVue,
        exportActaGuiasBodegaPendientesVue,
        ScreenGuiasFacturador,
        GuiasPrintDocumentoVenta,
        ReportePedidoGuiasIndividualVue,
        vSelect,
        GuiasStockVue
      },
        data() {
          return {
            usuario: [],
            tmpPedidos: [],
            pedido: {},
            id_pedido: 0,
            popupCarga: false,
            mostrarReporteG: false,
            mostrarImprimirActa:false,
            mostrarImprimirActaBodega:false,
            mostrarImprimirActaBodegaPendientes:false,
            pedidoGuiaEliminar: '',
            filtro: 0,
            arregloLibros: [],
            arregloStock:[],
            modalLibros: false,
            popupGenerarDocumento:false,
            verResumen:false,
            tabInicial: 'Resumen',
            totalLibros: 0,
            userAdmin:false,
            userFacturador:false,
            NohayStock:false,
            popupObservacion:false,
            busquedaxcodigo:'',
            tipoProceso:0,
            popupMostrarEmpresa:false,
            arrayEmpresas:[],
            empresa:null,
            mixinIdInicioFormatoNewData: null,
            //variables para aprovar sin stock
            ifAprobarSinStock:false,
            arrayGuiasSend:[],
            //fin variables para aprovar sin stock
            ifAprobarPendientes:0,
            ObjectPedidoHijo:'',
            //variables para anular pedido
            message_anulado:'',
            popupConfirmAnular:false,
            //fin variables para anular pedido
            //variables para imprimir documento perseo
            facturaDocumentoPerseo: null,
            popupDocumentoPerseo: false,
            //fin variables para imprimir documento perseo
            popupConfirmAprobar:false,
            //variables para filtro de fechas
            fechaInicio: '',
            fechaFin: '',
            pedidosOriginales: [], //para almacenar todos los pedidos sin filtro de fecha
            datosFiltradosPorFecha: false, // indica si pedidosOriginales tiene filtro de fecha aplicado
            //fin variables para filtro de fechas
            //variables para crear guía desde facturador
            popupMostrarPeriodoYAsesor: false,
            asesorSelected: null,
            periodoSelectedGuia: null,
            arregloPeriodos: [],
            arreglosAsesores: [],
            //fin variables para crear guía desde facturador
            //variables para reporte guias asesor
            popupReporteGuiasAsesor: false,
            periodoReporteGuia: null,
            asesorReporteGuia: null,
            mostrarReporteGuiasAsesor: false,
            arregloPeriodosTodos: [],
            //fin variables para reporte guias asesor
            //variables para busqueda global
            busquedaGlobal: '',
            //fin variables para busqueda global
            //variables para busqueda por documento
            busquedaDocumento: '',
            resultadosDocumento: null,
            tmpPedidosBackup: [], // copia del filtro activo para restaurar
          }
        },
        props: {
            pedidos: {
                type: Array,
                default: []
            },
            id_periodo: {
                type: Number,
                default: 0
            },
        },
        created() {
            let me = this;
            me.usuario = JSON.parse(localStorage.getItem("usuario"))
        },
        watch: {
            pedidos(results) {
                let me = this;
                // Solo usar pedidos externos si los hay, sino obtener datos internamente
                if(results && results.length > 0){
                    me.pedidosOriginales = results; // Guardar todos los pedidos sin filtro
                    me.tmpPedidos = []
                    me.filtroTipo()
                }
            },
        },
        mounted() {
            let me = this;

            // Inicializar fechas: primer día del mes actual y hoy
            const hoy = new Date();
            const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            me.fechaInicio = primerDiaMes.toISOString().substring(0, 10);
            me.fechaFin = hoy.toISOString().substring(0, 10);

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

            // Determinar filtro inicial
            if(me.usuario.id_group == 27 || me.usuario.id_group == 17){
                me.filtro = 1
            }else{
                me.filtro = 0
            }

            // Obtener guias al montar el componente sin entregados (tipo del filtro inicial)
            me.getGuias(false, me.filtro).then(() => {
                // Aplicar filtro después de cargar datos
                me.filtroTipo();
            });

            //user admin
            if(me.usuario.id_group  == 22 || me.usuario.id_group == 23 || me.usuario.id_group == 1){
                me.userAdmin = true
            }
            //user facturador
            if(me.usuario.id_group  == 22 || me.usuario.id_group == 23){
                me.userFacturador = true
            }
            
            // Obtener períodos y asesores para el facturador
            if(me.groupFacturador){
                me.getPeriodos();
                me.getAsesores();
            }
        },
        computed: {
          ...mapState(['userRoot','userAsesor', 'userBodegaNormal','AdminBodega','groupFacturador']),
            sumaPendientes() {
                let me = this;
                const source = me.pedidosOriginales.length > 0 ? me.pedidosOriginales : me.pedidos;
                //pendientes admin bodega
                var predatos = []
                predatos = source
                // Si es userRoot, mostrar pedidos con estado 0 o 1
                let datos = me.userRoot 
                    ? predatos.filter(p => (p.estado_entrega == 0) && (p.estado == 0 || p.estado == 1))
                    : predatos.filter(p => (p.estado_entrega == 0) && (p.estado == 1));
                let resultado = datos.length
                return resultado
            },
            SumaAprobados() {
                let me = this;
                const source = me.pedidosOriginales.length > 0 ? me.pedidosOriginales : me.pedidos;
                let datos = source.filter(p => (p.estado_entrega == 1) && (p.estado == 1));
                let resultado = datos.length
                return resultado
            },
            SumaAprobadosPendientes() {
                let me = this;
                const source = me.pedidosOriginales.length > 0 ? me.pedidosOriginales : me.pedidos;
                let datos = source.filter(p => (p.estado_entrega == 3) && (p.estado == 1) && p.despachado_bodega == 0);
                let resultado = datos.length
                return resultado
            },
            SumaEntregados() {
                let me = this;
                const source = me.pedidosOriginales.length > 0 ? me.pedidosOriginales : me.pedidos;
                let datos = source.filter(p => ((p.estado_entrega == 2) || (p.despachado_bodega == 1)) && (p.estado == 1));
                let resultado = datos.length
                return resultado
            },
            SumaAnulados(){
                let me = this;
                const source = me.pedidosOriginales.length > 0 ? me.pedidosOriginales : me.pedidos;
                let datos = source.filter(p => (p.estado == 2));
                let resultado = datos.length
                return resultado
            },
            SumaSinEnviarPerseo(){
                let me = this;
                const source = me.pedidosOriginales.length > 0 ? me.pedidosOriginales : me.pedidos;
                let datos = source.filter(p => {
                    if(p.guias_version_perseo == 1 && p.pendientes && p.pendientes.length > 0){
                        return p.pendientes.some(hijo => hijo.estadoPerseo == 0 && hijo.est_ven_codigo != 3); // Solo contar como sin enviar si no está anulado
                    }
                    return false;
                });
                let resultado = datos.length
                return resultado
            },
            SumaEnviadosPerseo(){
                let me = this;
                const source = me.pedidosOriginales.length > 0 ? me.pedidosOriginales : me.pedidos;
                let datos = source.filter(p => {
                    if(p.guias_version_perseo == 1 && p.pendientes && p.pendientes.length > 0){
                        return p.pendientes.some(hijo => hijo.estadoPerseo == 1 && hijo.est_ven_codigo != 3); // Solo contar como enviados si no está anulado
                    }
                    return false;
                });
                let resultado = datos.length
                return resultado
            }
        },
        methods: {
          //METODO PARA OBTENER GUIAS
          async getGuias(aplicarFiltroFecha = false, tipoFiltro = null) {
            let me = this;
            try {
                me.$vs.loading();

                // Construir URL con parámetros
                let url = me.$server_url + 'get_pedidos_guias?id_group=' + me.usuario.id_group;

                 // Enviar tipo de filtro al backend
                 if (tipoFiltro !== null) {
                     if (tipoFiltro === -1 && me.busquedaGlobal && me.busquedaGlobal.trim() !== '') {
                         url += '&search=' + encodeURIComponent(me.busquedaGlobal.trim());
                     } else {
                         url += '&tipo_filtro=' + tipoFiltro;
                     }
                 }

                // Solo aplicar filtro de fechas si se indica explícitamente
                if (aplicarFiltroFecha && me.fechaInicio && me.fechaFin) {
                    url += '&fecha_inicio=' + me.fechaInicio + '&fecha_fin=' + me.fechaFin;
                }

                const response = await me.$http.get(url);
                me.$vs.loading.close();

                let datos = response.data;

                // Filtrar por userRoot si no es root
                if(!me.userRoot){
                    datos = datos.filter(p => p.facturacion_vee == 1)
                }

                // Asignar datos según el grupo
                if (me.groupFacturador) {
                    me.pedidosOriginales = datos.filter(p => p.pedido_facturacion === 1);
                } else if (me.AdminBodega && !me.userBodegaNormal) {
                    me.pedidosOriginales = datos.filter(p => p.pedido_bodega === 1);
                } else if (me.userAsesor) {
                    me.pedidosOriginales = datos.filter(p => p.pedido_asesor === 1);
                } else {
                    me.pedidosOriginales = datos;
                }

                // Marcar si los datos están filtrados por fecha
                me.datosFiltradosPorFecha = aplicarFiltroFecha;

                // Aplicar filtro de tipo solo si no estamos en un flujo que ya lo aplicará
                // (para evitar loop infinito)
                // me.filtroTipo();

            } catch (error) {
                console.error("Error al obtener guías:", error);
                me.$vs.loading.close();
                me.$vs.notify({
                    text: 'Error al cargar las guías',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 3000
                });
            }
          },
          //FIN METODO PARA ONTENER GUIAS
          openConfirmEmpresa(){
            let me = this
            me.$http.get(me.$server_url+'empresa')
            .then(function (res) {
                if(res.data.status == 0){
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time:3000
                    })
                    return
                }
                me.arrayEmpresas       = res.data
                //remover el id 2
                me.arrayEmpresas       = me.arrayEmpresas.filter(p => p.id != 2)
                //si pedido.estado_entrega es mayor a 0 colocar el id empresa en el campo empresa
                if(me.pedido.estado_entrega > 0){
                    me.empresa = me.arrayEmpresas.find(p => p.id == me.pedido.empresa_id)
                }
                me.popupMostrarEmpresa = true
            })
          },
          verStock(){
              let me = this;
              me.arregloStock = []
              if(me.empresa == null || me.empresa == "" || me.empresa == undefined){
                  me.$vs.notify({
                      text: 'Seleccione una empresa',
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle',
                      time:3000
                  })
                  return
              }
              me.popupMostrarEmpresa = false
              me.$vs.loading()
              var url = ""
              //resumen para facturacion
              // if(me.tipoProceso == 0){
                  if(me.pedido.id_periodo <= me.mixinIdInicioFormatoNewData){
                      var url = this.$server_url+'guias?verStock=yes&id_pedido='+me.pedido.id_pedido+'&empresa='+me.empresa.id
                  }else if(me.pedido.id_periodo > me.mixinIdInicioFormatoNewData){
                      var url = this.$server_url+'guias?verStock_new=yes&id_pedido='+me.pedido.id_pedido+'&empresa='+me.empresa.id
                  }
              //}
              // //resumen para bodega
              // if(me.tipoProceso == 1){
              //     if(me.pedido.id_periodo <= me.mixinIdInicioFormatoNewData){
              //         url = this.$server_url+'guias?verStockGuiasProlipa=yes&id_pedido='+me.pedido.id_pedido+'&acta='+me.pedido.ven_codigo
              //     }else if(me.pedido.id_periodo > me.mixinIdInicioFormatoNewData){
              //         url = this.$server_url+'guias?verStockGuiasProlipa_new=yes&id_pedido='+me.pedido.id_pedido+'&acta='+me.pedido.ven_codigo
              //     }
              // }
              this.$http.get(url)
                  .then(function (res) {
                      me.$vs.loading.close()
                      if(res.data.status == 0){
                          me.$vs.notify({
                              text: res.data.message,
                              color: 'danger',
                              iconPack: 'feather',
                              icon: 'icon-alert-triangle',
                              time:3000
                          })
                          return
                      }
                      //ingresar libros en array
                      let datos = res.data
                      if(me.tipoProceso == 0){
                          //validate que haya stock
                          let validate = datos.filter(p => p.nuevoStock < 0)
                          if(validate.length > 0){
                              me.NohayStock = true
                          }else{
                              me.NohayStock = false
                          }
                          //fin validate que haya stock
                      }

                      var predatos = []
                      predatos = datos
                      me.arregloStock = predatos.sort(function(a, b) {
                          var nombreA = a.nombrelibro.toLowerCase();
                          var nombreB = b.nombrelibro.toLowerCase();
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
                      //open confirm
                      //del arregloStock separar en un propiedad cantidad_descontar color el nuevoStock que  sea menor a 0
                      me.arregloStock.forEach(item => {
                          item.cantidadAutorizar = 0
                          if(item.nuevoStock < 0){
                              item.cantidad_descontar = Math.abs(item.nuevoStock)
                          }else{
                              item.cantidad_descontar = 0
                          }
                      })
                      me.popupConfirmAprobar = true
                  })
                  .catch(function (error) {
                      console.log(error + ' error');
                      me.$vs.loading.close()
                      me.$vs.notify({
                          text: "Ocurrio un error al cargar los datos",
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-alert-triangle',
                          time:3000
                      })
                  })

          },
          enviarGuiasBDMilton(){
              let me = this
              let nuevarutaxperiodo = '';
              //validacion
              if(me.pedido.codigo_contrato == null || me.pedido.codigo_contrato == "" || me.pedido.codigo_contrato == undefined || me.pedido.iniciales == "" || me.pedido.iniciales == null || me.pedido.iniciales == "null"){
                  me.$vs.notify({
                      text: 'El codigo del periodo o las iniciales del asesor no estan configuradas',
                      color: 'primary',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  })
                  return
              }
              if(me.usuario.iniciales == null || me.usuario.iniciales == "null" || me.usuario.iniciales == "" || me.usuario.iniciales == undefined){
                  me.$vs.notify({
                      text: 'El codigo del usuario facturador no esta configurado',
                      color: 'primary',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  })
                  return
              }
              let formData = new FormData();
              formData.append('id_pedido',            me.pedido.id_pedido)
              formData.append('codigo_contrato',      me.pedido.codigo_contrato)
              formData.append('iniciales',            me.pedido.iniciales);
              formData.append('usuario_fact',         me.usuario.idusuario)
              formData.append('codigo_usuario_fact',  me.usuario.iniciales);
              formData.append('region_idregion',      me.pedido.region_idregion)
              formData.append('asesor_id',            me.pedido.id_asesor)
              formData.append('id_periodo',           me.pedido.id_periodo)
              formData.append('empresa_id',           me.empresa.id)
              formData.append('guias_send',           JSON.stringify(me.arrayGuiasSend))
              formData.append('ifAprobarSinStock',    me.ifAprobarSinStock)
              formData.append('ifAprobarPendientes',  me.ifAprobarPendientes)
              if(me.ifAprobarPendientes == '1'){
                formData.append('ven_codigoPadre',me.pedido.ven_codigo)
              }
              if (me.pedido.id_periodo <= me.mixinIdInicioFormatoNewData) {
                formData.append('ifnuevo',            0)

              }else if (me.pedido.id_periodo > me.mixinIdInicioFormatoNewData) {
                formData.append('ifnuevo',            1)

              }
              me.$vs.loading()
              for (let [key, value] of formData.entries()) {
                  console.log(`${key}: ${value}`);
              }
                if(me.ifAprobarPendientes == '1'){
                    formData.append('guardarGuiasPendientes',1)
                    nuevarutaxperiodo = 'guias';
                }else{
                    nuevarutaxperiodo = 'guardarGuiasBDMilton_new';
                }
              this.$http.post(this.$server_url+nuevarutaxperiodo, formData)
              .then(function (res) {
                  me.$vs.loading.close()
                  if(res.data.status == 0){
                      me.$vs.notify({
                          text: res.data.message,
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-alert-triangle',
                          time:3000
                      })
                      return
                  }
                  me.$vs.notify({
                      text: 'Se guardo correctamente',
                      color: 'primary',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  })
                  me.popupGenerarDocumento = false;
                  me.popupMostrarEmpresa = false;
                  me.ifAprobarPendientes = 0
                  me.arrayGuiasSend      = []
                  me.ifAprobarSinStock   = 0
                  me.$emit('changeRecarge', true)
              })
              .catch(function (error) {
                  me.$vs.loading.close();
                  // Manejo de errores HTTP 500 y otros errores
                  let errorMessage = 'Error desconocido';
                  if (error.response && error.response.data && error.response.data.message) {
                      errorMessage = error.response.data.message;
                  }
                  me.$vs.notify({
                      text: errorMessage,
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  });
              });
          },
          changeHandle(e) {
              let me                                  = this;
              me.popupCarga                           = false
              me.mostrarReporteG                      = false
              me.mostrarImprimirActa                  = false
              me.mostrarImprimirActaBodega            = false
              me.mostrarImprimirActaBodegaPendientes  = false
              me.pedido                               = {}
              me.ObjectPedidoHijo                     = { }
          },
          ver_pedido(item) {
              let me = this;
              localStorage.setItem("id_periodo_selected", item.id_periodo)
              localStorage.setItem("nombre_periodo_selected", item.periodo)
              this.$store.dispatch('setGuia',item)
              this.$emit('showPedido',1)
          },
          getReporteGuia(tr) {
              let me = this;
              localStorage.setItem("id_periodo_selected", tr.id_periodo)
              localStorage.setItem("nombre_periodo_selected", tr.periodo)
              me.id_pedido = tr.id_pedido
              // me.popupCarga = true
              me.mostrarReporteG = true
          },
          ImprimirActa(tipo){
              let me                              = this;
              // me.popupCarga                       = true
              if(tipo == 0){
                  me.mostrarImprimirActa          = true
              }
              if(tipo == 1){
                  me.mostrarImprimirActaBodega    = true
              }

          },
          f_mostrarDocumentoPendiente(){
            let me = this
            me.mostrarImprimirActaBodegaPendientes = true
          },
          confirma_delete_pedido(item) {
              let me = this;
              me.pedidoGuiaEliminar = item;
              me.$vs.dialog({
                  type: 'confirm',
                  color: 'danger',
                  title: 'Confirmar',
                  text: 'Seguro desea eliminar este pedido?. No lo podrá recuperar',
                  acceptText: 'Aceptar',
                  cancelText: 'Cancelar',
                  accept: me.f_eliminarGuiaPedido
              })
          },
          f_eliminarGuiaPedido() {
              let me = this;
              let rutaperiodofinal = '';
              if (me.pedidoGuiaEliminar.id_periodo <= me.mixinIdInicioFormatoNewData) {
                  rutaperiodofinal = 'deletePedidoGuia/';
              }else if(me.pedidoGuiaEliminar.id_periodo > me.mixinIdInicioFormatoNewData){
                  rutaperiodofinal = 'deletePedidoGuia_new/';
              }
              this.$http.get(this.$server_url + rutaperiodofinal + me.pedidoGuiaEliminar.id_pedido)
                  .then((result) => {
                      console.log(result.data)
                      me.$vs.notify({
                          color: 'danger',
                          text: 'Pedido eliminado correctamente'
                      })
                      // Eliminar el item del array local inmediatamente para refrescar la tabla
                      const idEliminado = me.pedidoGuiaEliminar.id_pedido;
                      me.pedidosOriginales = me.pedidosOriginales.filter(p => p.id_pedido !== idEliminado);
                      me.tmpPedidos = me.tmpPedidos.filter(p => p.id_pedido !== idEliminado);
                      me.tmpPedidosBackup = me.tmpPedidosBackup.filter(p => p.id_pedido !== idEliminado);
                      me.$emit('changeRecarge', true)
                  }).catch((err) => {
                      console.log(err)
                  });
          },
          async filtroTipo(dato) {
              let me = this;
              me.tmpPedidos = []

              // Si es filtro 3 (Entregados), cargar datos con filtro de fecha y tipo 3
              if (me.filtro == 3) {
                  if (!me.datosFiltradosPorFecha) {
                      await me.getGuias(true, 3);
                  }
                  // No hacer return, continuar para aplicar el filtro
              }
              // Para los demás filtros, cargar datos sin entregados (excluir estado_entrega=2)
              else if (me.filtro != 3) {
                  if (me.datosFiltradosPorFecha || me.pedidosOriginales.length === 0) {
                      await me.getGuias(false, me.filtro);
                  }
              }

              // Usar pedidosOriginales en lugar de pedidos
              const source = me.pedidosOriginales.length > 0 ? me.pedidosOriginales : me.pedidos;
              // Resetear búsqueda por documento al cambiar de filtro
              me.busquedaDocumento = '';
              me.resultadosDocumento = null;
              me.tmpPedidosBackup = [];
              //para ver los pedidos pendientes
              if (me.filtro == 0) {
                  //bodega mostrar los pedidos pendientes de bodega
                  var predatos = []
                  predatos = source
                  // Si es userRoot, mostrar pedidos con estado 0 o 1
                  let datos = me.userRoot 
                      ? predatos.filter(p => (p.estado_entrega == 0 && (p.estado == 0 || p.estado == 1)))
                      : predatos.filter(p => (p.estado_entrega == 0 && p.estado == 1));
                  me.tmpPedidos = datos
                  return
              }
              //para ver los pedidos aprobados
              else if (me.filtro == 1) {
                  let datos = source.filter(p => (p.estado_entrega == 1) && p.estado == 1);
                  me.tmpPedidos = datos
                  return
              }
              //para ver los pedidos pendientes
              else if (me.filtro == 2) {
                  let datos = source.filter(p => (p.estado_entrega == 3) && p.estado == 1 && p.despachado_bodega == 0);
                  me.tmpPedidos = datos
                  return
              }
              // entregados por bodega
              else if(me.filtro == 3){
                if(dato){
                    let datos = source.filter(guias => {
                          return ((guias.estado_entrega == 2 || guias.despachado_bodega == 1) && guias.estado == 1) && guias.ven_codigo.toString().toUpperCase().includes(dato.toUpperCase());
                    });
                    me.tmpPedidos = datos;
                    return;
                }else{
                    let datos = source.filter(g => ((g.estado_entrega == 2 || g.despachado_bodega == 1) && g.estado == 1));
                    me.tmpPedidos = datos;
                    return;
                }
              }
              // anulados por facturacion
              else if(me.filtro == 4){
                var predatos = []
                predatos = source
                let datos = predatos.filter(p => (p.estado == 2));
                me.tmpPedidos = datos
                return
              }
              // sin enviar a perseo
              else if(me.filtro == 5){
                let datos = source.filter(p => {
                    if(p.guias_version_perseo == 1 && p.pendientes && p.pendientes.length > 0){
                        return p.pendientes.some(hijo => hijo.estadoPerseo == 0  && hijo.est_ven_codigo != 3); // Solo contar como sin enviar si no está anulado
                    }
                    return false;
                });
                me.tmpPedidos = datos
                return
              }
              // enviados a perseo
              else if(me.filtro == 6){
                let datos = source.filter(p => {
                    if(p.guias_version_perseo == 1 && p.pendientes && p.pendientes.length > 0){
                        return p.pendientes.some(hijo => hijo.estadoPerseo == 1 && hijo.est_ven_codigo != 3); // Solo contar como enviados si no está anulado
                    }
                    return false;
                });
                me.tmpPedidos = datos
                return
              }
              // resultados de búsqueda global
              else if(me.filtro == -1) {
                  me.tmpPedidos = source;
                  return;
              }
          },
          filtrarPedidos() {
              let me = this;
              const busqueda = this.busquedaxcodigo.toUpperCase();
              if (busqueda.length > 0 && this.filtro == 3) {
                  this.filtroTipo(busqueda);
              }else{
                  this.filtroTipo(busqueda);
                      me.$vs.notify({
                      text: 'No tiene datos de',
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  })
              }
          },
          verificarTodosEnviadosPerseo(pedido) {
              if(pedido.guias_version_perseo === 1 && pedido.pendientes && pedido.pendientes.length > 0) {
                  return pedido.pendientes.every(hijo => hijo.estadoPerseo === 1);
              }
              return false;
          },
          //====METODOS DE BODEGA======
          openConfirm(){
              this.$vs.dialog({
                  type:'confirm',
                  color: 'danger',
                  title: `Confirmar`,
                  acceptText:'aceptar',
                  cancelText:'cancelar',
                  text: 'Esta seguro de entregar esta solicitud de guias?',
                  accept:this.entregarPedido
              })
          },
          entregarPedido() {
              let me = this
              me.$vs.loading();
              let data = {
                  'id_pedido': this.pedido.id_pedido,
                  'estado': '2',
                  'grupo': 'bodega',
                  'acta':this.pedido.ven_codigo,
                  'asesor_id':this.pedido.id_asesor
              }
              this.$http.post(this.$server_url + 'entregarPedido', data)
                  .then(res => {
                      me.f_notificaciones('Pedido entregado', 'success', 'check')
                      me.$emit('changeRecarge', true)
                      me.$vs.loading.close();
                  })
                  .catch(err => {
                      console.log(err)
                      me.$vs.loading.close();
                  })
          },
          f_notificaciones(msj, color, icono) {
              let me = this;
              me.$vs.notify({
                  text: msj,
                  color: color,
                  iconPack: 'feather',
                  icon: icono
              })
              return;
          },
          //====FIN METODOS DE BODEGA====
          //METODOS PARA APROBAR SIN STOCK
          changeAprobar(e,guiasSend=[]){
              let me = this
              me.arrayGuiasSend     = []
              me.ifAprobarSinStock  = e
              me.arrayGuiasSend     = guiasSend
            //   me.verStock()
          },
          changeAprobarPendientes(e){
            let me = this
            me.arrayGuiasSend     = []
            me.arrayGuiasSend     = e
            me.popupGenerarDocumento = false
            me.f_confirmarAprobarPendientes()
          },
          f_confirmarAprobarPendientes(){
            let me = this
            me.ifAprobarPendientes = 1
            this.$vs.dialog({
              type:'confirm',
              color: 'danger',
              title: `Confirm`,
              text: `¿Estás seguro de aprobar las guias pendientes de ${this.arrayGuiasSend.length} libros?`,
              accept:this.enviarGuiasBDMilton,
              acceptText:'Aceptar',
              cancelText:'Cancelar',
              cancel: () => {
                me.popupGenerarDocumento = true;
              }
            })
          },
          //METODOS PARA ANULAR PEDIDO
          anularPedido() {
            let me = this
            //quitar espacios
            me.message_anulado = me.message_anulado.trim();
            if(me.message_anulado == ''){
                me.m_message('Escribe un mensaje porque se anuló el pedido', 'danger', 'alert-triangle')
                return
            }

            me.$vs.loading();
            let formData = new FormData();
            formData.append('anularPedidoAprobado', 1)
            formData.append('id_pedido',            me.pedido.id_pedido)
            formData.append('user_created',         me.usuario.idusuario)
            formData.append('message_anulado',      me.message_anulado)
            if (me.pedido.id_periodo <= me.mixinIdInicioFormatoNewData) {
            formData.append('ifnuevo',            0)

            }else if (me.pedido.id_periodo > me.mixinIdInicioFormatoNewData) {
            formData.append('ifnuevo',            1)

            }
            this.$http.post(this.$server_url + 'guias', formData)
            .then(res => {
                me.$vs.loading.close();
                if(res.data.status == 0){
                    me.m_message(res.data.message, 'danger', 'alert-triangle')
                    return
                }
                me.m_message(res.data.message, 'success', 'check')
                me.popupConfirmAnular = false;
                me.message_anulado = '';
                me.$emit('changeRecarge', true)
            })
            .catch(err => {
            console.log(err)
            me.$vs.loading.close();
            })
          },
          abrirDocumentoPerseo(p, tr) {
            let me = this;
            me.$vs.loading();
            me.$http.get(me.$server_url + 'guias?listadoDocumentoVentaGuias=1&id_pedido=' + tr.id_pedido)
            .then((res) => {
                me.$vs.loading.close();
                let documento = res.data.find(d => d.ven_codigo === p.ven_codigo);
                if (documento) {
                    me.facturaDocumentoPerseo = documento;
                    me.popupDocumentoPerseo = true;
                } else {
                    me.$vs.notify({
                        text: 'Documento no encontrado',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 3000
                    });
                }
            })
            .catch((err) => {
                me.$vs.loading.close();
                console.error(err);
                me.$vs.notify({
                    text: 'Error al cargar el documento',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 3000
                });
            });
          },
          //METODOS PARA FILTRO DE FECHAS
          filtrarPorFechas() {
            let me = this;
            if (!me.fechaInicio || !me.fechaFin) {
                me.$vs.notify({
                    text: 'Por favor, seleccione ambas fechas',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    time: 3000
                });
                return;
            }

            // Validar que fecha inicio sea menor o igual a fecha fin
            if (new Date(me.fechaInicio) > new Date(me.fechaFin)) {
                me.$vs.notify({
                    text: 'La fecha de inicio debe ser menor o igual a la fecha fin',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle',
                    time: 3000
                });
                return;
            }

            // Aplicar filtro de fechas solo para el filtro de entregados (tipo 3)
            me.getGuias(true, 3).then(() => {
                me.filtroTipo();
            });

            me.$vs.notify({
                text: 'Filtro de fechas aplicado correctamente',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-check',
                time: 2000
            });
          },
          limpiarFiltroFechas() {
            let me = this;
            // Resetear fechas a valores predeterminados
            const hoy = new Date();
            const primerDiaMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
            me.fechaInicio = primerDiaMes.toISOString().substring(0, 10);
            me.fechaFin = hoy.toISOString().substring(0, 10);

            // Recargar datos con el filtro de fecha usando las nuevas fechas (primer día del mes a hoy)
            me.getGuias(true, 3).then(() => {
                me.filtroTipo();
            });

            me.$vs.notify({
                text: 'Filtro de fechas restablecido a valores por defecto',
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-refresh-cw',
                time: 2000
            });
          },
          //FIN METODOS PARA FILTRO DE FECHAS
          //METODO PARA RECARGAR GUIAS AL CERRAR MODAL
          recargarGuias() {
            let me = this;
            // Si hay búsqueda activa (filtro == -1), re-ejecutar la búsqueda global para mantener resultados
            if (me.filtro === -1 && me.busquedaGlobal && me.busquedaGlobal.trim() !== '') {
              me.buscarGlobal();
              return;
            }
            me.getGuias(false, me.filtro).then(() => {
              me.filtroTipo();
            });
          },
          //FIN METODO PARA RECARGAR GUIAS AL CERRAR MODAL
          //METODO PARA EDITAR PEDIDO
          editarPedido(item) {
            let me = this;
            // Guardar el período en localStorage
            localStorage.setItem("id_periodo_selected", item.id_periodo);
            localStorage.setItem("nombre_periodo_selected", item.periodo);
            
            // Guardar el pedido en el store
            this.$store.dispatch('setGuia', item);
            
            // Crear el objeto del período para pasarlo a ScreenGuias
            let periodoData = {
              idperiodoescolar: item.id_periodo,
              periodoescolar: item.periodo
            };
            
            // Emitir evento con el item del pedido y el período
            me.$emit('showPedido', 1, item, periodoData);
          },
          //FIN METODO PARA EDITAR PEDIDO
          //METODOS PARA SOLICITAR GUIA DESDE FACTURADOR
          getPeriodos() {
            let me = this;
            me.$vs.loading();
            me.$http.get(me.$server_url + 'periodo')
              .then(res => {
                me.$vs.loading.close();
                me.arregloPeriodos = res.data.filter(p => p.estado == 1);
              })
              .catch(err => {
                me.$vs.loading.close();
                console.error('Error al cargar períodos:', err);
                me.$vs.notify({
                  text: 'Error al cargar los períodos',
                  color: 'danger',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle'
                });
              });
          },
          getPeriodosTodos() {
            let me = this;
            me.$http.get(me.$server_url + 'periodo')
              .then(res => {
                me.arregloPeriodosTodos = Array.isArray(res.data) ? res.data : (res.data.data || []);
              })
              .catch(err => {
                console.error('Error al cargar todos los períodos:', err);
                me.$vs.notify({
                  text: 'Error al cargar los períodos',
                  color: 'danger',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle'
                });
              });
          },
          getAsesores() {
            let me = this;
            me.$vs.loading();
            me.$http.get(me.$server_url + 'getUsuariosPorRol/11')
              .then(res => {
                me.$vs.loading.close();
                me.arreglosAsesores = res.data.filter(p => p.estado_idEstado == 1).sort((a, b) => a.usuario.localeCompare(b.usuario));
              })
              .catch(err => {
                me.$vs.loading.close();
                console.error('Error al cargar asesores:', err);
                me.$vs.notify({
                  text: 'Error al cargar los asesores',
                  color: 'danger',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle'
                });
              });
          },
          f_validatePedido() {
            let me = this;
            // Si los asesores no se cargaron (groupFacturador no estaba listo en mounted), cargarlos ahora
            if (me.arreglosAsesores.length === 0) {
              me.getAsesores();
            }
            if (me.arregloPeriodos.length === 0) {
              me.getPeriodos();
            }
            // Abrir el popup unificado
            me.popupMostrarPeriodoYAsesor = true;
          },
          limpiarFormularioGuia() {
            let me = this;
            me.popupMostrarPeriodoYAsesor = false;
            me.periodoSelectedGuia = null;
            me.asesorSelected = null;
          },
          f_crearSolicitudGuia() {
            let me = this;
            
            // Validar que ambos campos estén seleccionados
            if (!me.periodoSelectedGuia) {
              me.$vs.notify({
                text: 'Por favor seleccione un período',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
              });
              return;
            }
            
            if (!me.asesorSelected) {
              me.$vs.notify({
                text: 'Por favor seleccione un asesor',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
              });
              return;
            }
            
            console.log('Período seleccionado:', me.periodoSelectedGuia);
            console.log('Asesor seleccionado:', me.asesorSelected);
            
            // Cerrar popup
            me.popupMostrarPeriodoYAsesor = false;
            
            // Guardar en el store y navegar
            this.$nextTick(() => {
              console.log('Despachando al store:', me.asesorSelected);
              this.$store.dispatch('setAsesorPedidoSelected', me.asesorSelected);
              
              // Esperar un poco para que el store se actualice
              setTimeout(() => {
                console.log('Navegando a formulario con asesor:', me.$store.state.asesorPedidoSelected);
                me.goToGuias();
              }, 100);
            });
          },
          goToGuias() {
            let me = this;
            localStorage.id_pedido = '';
            
            // Usar el período seleccionado en el popup
            let periodo_id = me.periodoSelectedGuia.idperiodoescolar;
            let periodo_nombre = me.periodoSelectedGuia.periodoescolar;
            
            localStorage.setItem("id_periodo_selected", periodo_id);
            localStorage.setItem("nombre_periodo_selected", periodo_nombre);
            
            let datos = {
              id_pedido: 0,
              id_periodo: periodo_id,
              periodo: periodo_nombre
            };
            
            this.$store.dispatch('setGuia', datos);
            
            // Emitir evento con el período seleccionado para que ScreenGuias.vue lo use
            this.$emit('showPedido', 1, datos, me.periodoSelectedGuia);
            
            // Resetear variables
            me.periodoSelectedGuia = null;
            me.asesorSelected = null;
          },
          //FIN METODOS PARA SOLICITAR GUIA DESDE FACTURADOR
          //METODOS PARA REPORTE GUIAS ASESOR
          abrirReporteGuiasAsesor() {
            let me = this;
            if (me.arreglosAsesores.length === 0) {
              me.getAsesores();
            }
            if (me.arregloPeriodosTodos.length === 0) {
              me.getPeriodosTodos();
            }
            me.popupReporteGuiasAsesor = true;
          },
          verReporteGuiasAsesor() {
            let me = this;
            if (!me.periodoReporteGuia) {
              me.$vs.notify({
                text: 'Por favor seleccione un período',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
              });
              return;
            }
            if (!me.asesorReporteGuia) {
              me.$vs.notify({
                text: 'Por favor seleccione un asesor',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
              });
              return;
            }
            me.mostrarReporteGuiasAsesor = false;
            me.$nextTick(() => {
              me.mostrarReporteGuiasAsesor = true;
            });
          },
          limpiarReporteGuiasAsesor() {
            let me = this;
            me.popupReporteGuiasAsesor = false;
            me.periodoReporteGuia = null;
            me.asesorReporteGuia = null;
            me.mostrarReporteGuiasAsesor = false;
          },
          //FIN METODOS PARA REPORTE GUIAS ASESOR
          //METODOS PARA BUSQUEDA GLOBAL
          buscarGlobal() {
            let me = this;
            if (!me.busquedaGlobal || me.busquedaGlobal.trim() == '') {
              me.limpiarBusquedaGlobal();
              return;
            }
            
            me.$vs.loading();
            let url = me.$server_url + 'get_pedidos_guias?id_group=' + me.usuario.id_group + '&search=' + encodeURIComponent(me.busquedaGlobal.trim());
            
            me.$http.get(url)
              .then(res => {
                me.$vs.loading.close();
                let datos = res.data;
                
                // Filtrar por userRoot si no es root
                if(!me.userRoot){
                    datos = datos.filter(p => p.facturacion_vee == 1);
                }
                
                // Asignar datos según el grupo
                if (me.groupFacturador) {
                    me.tmpPedidos = datos.filter(p => p.pedido_facturacion === 1);
                    me.pedidosOriginales = datos.filter(p => p.pedido_facturacion === 1);
                } else if (me.AdminBodega && !me.userBodegaNormal) {
                    me.tmpPedidos = datos.filter(p => p.pedido_bodega === 1);
                    me.pedidosOriginales = datos.filter(p => p.pedido_bodega === 1);
                } else if (me.userAsesor) {
                    me.tmpPedidos = datos.filter(p => p.pedido_asesor === 1);
                    me.pedidosOriginales = datos.filter(p => p.pedido_asesor === 1);
                } else {
                    me.tmpPedidos = datos;
                    me.pedidosOriginales = datos;
                }
                
                me.filtro = -1; // -1 indica resultados de búsqueda global
                
                me.$vs.notify({
                  text: 'Búsqueda global completada. Encontrados: ' + me.tmpPedidos.length,
                  color: 'success',
                  iconPack: 'feather',
                  icon: 'icon-search',
                  time: 2500
                });
              })
              .catch(err => {
                me.$vs.loading.close();
                console.error(err);
                me.$vs.notify({
                  text: 'Error al realizar la búsqueda',
                  color: 'danger',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle'
                });
              });
          },
          limpiarBusquedaGlobal() {
            let me = this;
            me.busquedaGlobal = '';
            // Restaurar el filtro inicial según el grupo
            if(me.usuario.id_group == 27 || me.usuario.id_group == 17){
                me.filtro = 1;
            }else{
                me.filtro = 0;
            }
            me.getGuias(false, me.filtro).then(() => {
              me.filtroTipo();
            });
          },
          //METODO PARA BUSCAR POR DOCUMENTO (ven_codigo o pedido_codigo)
          buscarPorDocumento() {
            let me = this;
            const query = (me.busquedaDocumento || '').trim().toUpperCase();

            if (!query) {
              // Sin búsqueda: restaurar tmpPedidos desde el filtro activo
              me.resultadosDocumento = null;
              if (me.tmpPedidosBackup.length > 0) {
                me.tmpPedidos = [...me.tmpPedidosBackup];
              }
              return;
            }

            // Guardar copia de la lista actual si no hay backup todavía
            if (me.tmpPedidosBackup.length === 0) {
              me.tmpPedidosBackup = [...me.tmpPedidos];
            }

            const source = me.tmpPedidosBackup.length > 0 ? me.tmpPedidosBackup : me.tmpPedidos;

            const resultado = source.filter(pedido => {
              // Buscar en pendientes[].ven_codigo
              const enPendientes = pedido.pendientes && pedido.pendientes.some(p =>
                p.ven_codigo && p.ven_codigo.toString().toUpperCase().includes(query)
              );
              // Buscar en pedido_codigo
              const enPedidoCodigo = pedido.pedido_codigo &&
                pedido.pedido_codigo.toString().toUpperCase().includes(query);
              // Buscar en ven_codigo del pedido raíz
              const enVenCodigo = pedido.ven_codigo &&
                pedido.ven_codigo.toString().toUpperCase().includes(query);
              return enPendientes || enPedidoCodigo || enVenCodigo;
            });

            me.tmpPedidos = resultado;
            me.resultadosDocumento = resultado.length;
          }
        }
    }
    </script>
    <style scoped>
    .popupPadre {
        z-index: 51001;
    }

    /* Barra de acciones superior */
    .custom-action-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 15px;
      margin-bottom: 20px;
      padding-bottom: 15px;
      border-bottom: 1px solid #e2e8f0;
    }
    .view-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #1e293b;
      margin: 0;
    }
    .action-search {
      display: flex;
      align-items: center;
      gap: 8px;
      flex: 1;
      max-width: 480px;
      margin: 0 15px;
    }
    .global-search-wrapper {
      position: relative;
      flex: 1;
      display: flex;
      align-items: center;
    }
    .global-search-icon {
      position: absolute;
      left: 10px;
      width: 15px;
      height: 15px;
      stroke: #94a3b8;
      pointer-events: none;
      flex-shrink: 0;
    }
    .global-search-input-native {
      width: 100%;
      padding: 8px 34px 8px 32px;
      border: 1px solid #cbd5e1;
      border-radius: 8px;
      font-size: 13px;
      color: #1e293b;
      background: #fff;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .global-search-input-native:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
    }
    .global-search-input-native::placeholder { color: #94a3b8; }
    .global-search-clear {
      position: absolute;
      right: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border: none;
      background: #e2e8f0;
      border-radius: 50%;
      cursor: pointer;
      transition: background 0.15s;
      padding: 0;
    }
    .global-search-clear svg {
      width: 10px;
      height: 10px;
      stroke: #475569;
    }
    .global-search-clear:hover { background: #cbd5e1; }
    .search-submit-btn {
      flex-shrink: 0;
    }
    .action-right {
      display: flex;
      gap: 10px;
    }

    /* Tarjeta de filtro de fechas */
    .date-filter-card {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 16px;
      margin-bottom: 24px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.02);
    }
    .btn-container-align {
      display: flex;
      align-items: flex-end;
    }

    /* Barra de navegación de filtros (Pills interactivos) */
    .filter-tabs-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 24px;
    }
    .filter-tabs-list {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      padding: 0;
      margin: 0;
      list-style: none;
    }
    .filter-tab-item {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      border-radius: 30px;
      background-color: #f1f5f9;
      color: #64748b;
      font-weight: 600;
      font-size: 13px;
      border: 1px solid transparent;
      transition: all 0.2s ease-in-out;
      user-select: none;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
    }
    .filter-tab-item:hover {
      background-color: #e2e8f0;
      color: #334155;
      transform: translateY(-1px);
    }
    .filter-tab-item.active {
      background-color: #ffffff;
      border-color: #2563eb;
      color: #1e3a8a;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04);
    }
    
    /* Configuración de badges y bordes activos */
    .filter-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 2px 6px;
      font-size: 11px;
      font-weight: 700;
      border-radius: 20px;
      color: #475569;
      min-width: 20px;
      background-color: #e2e8f0;
      transition: all 0.2s ease;
    }

    .filter-tab-item:hover .filter-badge {
      background-color: #cbd5e1;
      color: #334155;
    }

    .filter-tab-item.active .filter-badge {
      background-color: #2563eb;
      color: #ffffff;
    }

    .search-acta-container {
      margin-top: 4px;
    }

    /* Reestructuración de Asesor/Responsable */
    .responsable-grid {
      display: flex;
      flex-direction: column;
      gap: 8px;
      font-size: 13px;
      padding: 4px 0;
    }
    .meta-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .meta-icon {
      width: 14px;
      height: 14px;
      color: #94a3b8;
      flex-shrink: 0;
    }
    .meta-label {
      color: #64748b;
      font-weight: 500;
      font-size: 12px;
    }
    .meta-value {
      color: #334155;
    }

    /* ── ASESOR/RESPONSABLE SIMPLE ── */
    .responsable-simple-container {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 12px;
      padding: 4px 0;
    }
    .responsable-name {
      font-weight: 700;
      color: #1e293b;
      font-size: 13px;
      line-height: 1.3;
    }
    .responsable-details-vertical {
      display: flex;
      flex-direction: column;
      gap: 3px;
      color: #64748b;
      font-size: 11px;
    }
    .periodo-chip-simple {
      display: inline-block;
      font-size: 9.5px;
      font-weight: 600;
      color: #1e40af;
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      border-radius: 4px;
      padding: 0px 5px;
    }
    .responsable-badges-row {
      display: flex;
      gap: 6px;
      margin-top: 2px;
    }
    .badge-simple {
      font-size: 10px;
      font-weight: 600;
      padding: 1px 5px;
      border-radius: 4px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .bg-danger-light {
      background-color: #fef2f2;
    }
    .bg-primary-light {
      background-color: #eff6ff;
    }

    /* Fechas de Envío/Creación */
    .dates-container {
      display: flex;
      flex-direction: column;
      font-size: 12px;
    }
    .date-row {
      display: flex;
      justify-content: space-between;
      gap: 6px;
    }
    .date-label {
      font-weight: 600;
      color: #64748b;
    }
    .date-value {
      color: #334155;
    }

    /* Estado de Pedido Badges */
    .state-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      background-color: #f8fafc;
    }
    .state-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background-color: #94a3b8;
    }
    .state-created {
      border-color: #cbd5e1;
      color: #475569;
    }
    .state-created .state-dot { background-color: #64748b; }

    .state-approved {
      border-color: #bbf7d0;
      color: #15803d;
      background-color: #f0fdf4;
    }
    .state-approved .state-dot { background-color: #22c55e; }

    .state-delivered {
      border-color: #86efac;
      color: #166534;
      background-color: #ecfdf5;
    }
    .state-delivered .state-dot { background-color: #10b981; }

    .state-partial {
      border-color: #fed7aa;
      color: #c2410c;
      background-color: #fff7ed;
    }
    .state-partial .state-dot { background-color: #f97316; }

    .acta-code-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background-color: #eff6ff;
      border: 1px solid #bfdbfe;
      color: #1e40af;
      padding: 4px 10px;
      border-radius: 6px;
      font-size: 12px;
    }

    /* Anulación */
    .anulado-box {
      border: 1px solid #fecdd3;
      background-color: #fff5f5;
    }

    /* Documentos Perseo / Grid list */
    .documents-section-wrapper {
      background-color: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      padding: 10px;
    }
    .section-title {
      letter-spacing: 0.5px;
      text-transform: uppercase;
      color: #475569;
    }
    .document-badge-list {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .document-card-item {
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
      transition: all 0.2s ease;
    }
    .document-card-item:hover {
      border-color: #cbd5e1;
      transform: translateY(-0.5px);
    }
    .doc-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .doc-code-link {
      font-weight: 700;
      color: #2563eb;
      text-decoration: underline;
      cursor: pointer;
      font-size: 12px;
    }
    .doc-code-link:hover {
      color: #1d4ed8;
    }
    .doc-status-pill {
      display: inline-flex;
      align-items: center;
      padding: 1px 6px;
      border-radius: 12px;
      font-size: 10px;
      font-weight: 600;
    }
    .status-despachado { background-color: #d1fae5; color: #065f46; }
    .status-pendiente { background-color: #ffedd5; color: #9a3412; }
    .status-anulado { background-color: #fee2e2; color: #991b1b; }
    
    .doc-meta-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10px;
      color: #64748b;
    }
    
    .perseo-status-box {
      padding: 5px 8px;
      border-radius: 4px;
      font-size: 10px;
    }
    .perseo-envio-yes {
      background-color: #f0fdf4;
      border: 1px solid #bbf7d0;
      color: #166534;
    }
    .perseo-envio-no {
      background-color: #fff1f2;
      border: 1px solid #fecdd3;
      color: #9f1239;
    }

    /* Pendientes antiguos */
    .legacy-doc-pill {
      display: inline-block;
      padding: 3px 8px;
      border-radius: 4px;
      background-color: #f1f5f9;
      border: 1px solid #cbd5e1;
      color: #3b82f6;
      font-size: 11px;
      font-weight: 600;
      text-decoration: underline;
      transition: background-color 0.15s;
    }
    .legacy-doc-pill:hover {
      background-color: #e2e8f0;
    }

    /* Banner de resultados de búsqueda global */
    .search-results-banner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 16px;
      margin-bottom: 16px;
      background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
      border: 1px solid #bfdbfe;
      border-radius: 10px;
      gap: 12px;
    }
    .search-banner-content {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #1e40af;
      font-size: 13px;
    }
    .search-banner-content svg {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      stroke: #3b82f6;
    }

    /* Chip período - pequeño y discreto */
    .periodo-chip {
      display: inline-block;
      font-size: 10px;
      font-weight: 500;
      color: #64748b;
      background-color: #f1f5f9;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 1px 6px;
      letter-spacing: 0.02em;
    }

    /* Chip Módulo con Perseo - muy sutil, casi invisible */
    .perseo-module-chip {
      display: inline-block;
      font-size: 9px;
      font-weight: 500;
      color: #94a3b8;
      background-color: transparent;
      border: 1px solid #e2e8f0;
      border-radius: 4px;
      padding: 0px 5px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      opacity: 0.5;
    }

    /* Búsqueda por documento */
    .doc-search-container {
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-top: 10px;
      padding: 10px 14px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
    }
    .doc-search-inner {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .doc-search-icon {
      width: 16px;
      height: 16px;
      flex-shrink: 0;
      stroke: #64748b;
    }
    .doc-search-input {
      flex: 1;
      min-width: 0;
      border: 1px solid #cbd5e1;
      border-radius: 7px;
      padding: 7px 12px;
      font-size: 13px;
      color: #1e293b;
      background: #fff;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
    }
    .doc-search-input:focus {
      border-color: #6366f1;
      box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
    }
    .doc-search-input::placeholder {
      color: #94a3b8;
    }
    .doc-search-clear {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border: none;
      background: #fee2e2;
      border-radius: 50%;
      cursor: pointer;
      flex-shrink: 0;
      transition: background 0.15s;
    }
    .doc-search-clear svg {
      width: 12px;
      height: 12px;
      stroke: #dc2626;
    }
    .doc-search-clear:hover {
      background: #fecaca;
    }
    .doc-search-btn {
      padding: 7px 16px;
      border: none;
      border-radius: 7px;
      background: linear-gradient(135deg, #6366f1, #8b5cf6);
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      flex-shrink: 0;
      transition: opacity 0.15s, transform 0.1s;
    }
    .doc-search-btn:hover {
      opacity: 0.9;
      transform: translateY(-1px);
    }
    .doc-search-results {
      font-size: 11px;
      color: #6366f1;
      font-weight: 500;
      padding-left: 24px;
    }

    /* ── FECHAS COMPACTAS (SIMPLIFICADAS) ── */
    .dates-simple {
      display: flex;
      flex-direction: column;
      gap: 1px;
      font-size: 11px;
      line-height: 1.3;
    }
    .date-label-simple {
      font-weight: 700;
      color: #64748b;
      font-size: 9px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .date-label-simple.muted {
      color: #94a3b8;
    }
    .date-value-simple {
      color: #334155;
      font-variant-numeric: tabular-nums;
      margin-bottom: 3px;
    }
    .date-value-simple:last-child {
      margin-bottom: 0;
    }
    .date-value-simple.muted {
      color: #94a3b8;
    }

    /* ── ESTADO COMPACTO ── */
    .estado-row {
      display: flex;
      align-items: center;
      gap: 6px;
      flex-wrap: wrap;
      margin-bottom: 5px;
    }
    .estado-badge-compact {
      display: inline-flex;
      align-items: center;
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .eb-created  { background: #f1f5f9; color: #475569; }
    .eb-approved { background: #dcfce7; color: #166534; }
    .eb-delivered{ background: #dbeafe; color: #1e40af; }
    .eb-partial  { background: #fef9c3; color: #854d0e; }

    /* ── OBS BUTTON ── */
    .obs-btn {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 2px 7px;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      background: #1e293b;
      color: #fff;
      font-size: 11px;
      font-weight: 600;
      cursor: pointer;
      transition: opacity 0.15s;
    }
    .obs-btn svg { width: 11px; height: 11px; stroke: #fff; }
    .obs-btn:hover { opacity: 0.85; }

    /* ── ACTA INLINE ── */
    .acta-inline {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 11px;
      font-weight: 600;
      color: #2563eb;
      margin-bottom: 5px;
      text-decoration: underline;
    }
    .acta-inline svg { width: 11px; height: 11px; stroke: #2563eb; flex-shrink: 0; }

    /* ── ANULADO COMPACTO ── */
    .anulado-box-compact {
      display: flex;
      flex-direction: column;
      gap: 1px;
      padding: 4px 6px 4px 8px;
      background: transparent;
      border-left: 2px solid #ef4444;
      margin-bottom: 6px;
    }
    .anulado-title {
      font-size: 11px;
      font-weight: 700;
      color: #dc2626;
    }
    .anulado-detail {
      font-size: 10px;
      color: #ef4444;
      white-space: normal;
      word-break: break-word;
    }

    /* ── FECHAS PROCESO ── */
    .proceso-dates {
      font-size: 10px;
      color: #64748b;
      margin-bottom: 4px;
    }

    /* ── DOCS PERSEO SECCION ── */
    .docs-perseo-section {
      margin-top: 6px;
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
    }
    .docs-perseo-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 5px;
      font-size: 10px;
      font-weight: 600;
      color: #64748b;
    }
    .docs-ver-todo-btn {
      font-size: 10px;
      font-weight: 600;
      color: #2563eb;
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      text-decoration: underline;
    }
    .docs-ver-todo-btn:hover { color: #1d4ed8; }

    /* ── SUB TABLA DE DOCUMENTOS ── */
    .sub-table-docs {
      width: 100%;
      border-collapse: collapse;
      margin-top: 6px;
      font-size: 11px;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      overflow: hidden;
    }
    .sub-table-docs th {
      background: #f8fafc;
      color: #64748b;
      font-weight: 600;
      text-align: left;
      padding: 6px 8px;
      border-bottom: 1px solid #e2e8f0;
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.02em;
    }
    .sub-table-docs td {
      padding: 6px 8px;
      border-bottom: 1px solid #f1f5f9;
      color: #334155;
      vertical-align: middle;
    }
    .sub-table-docs tr:last-child td {
      border-bottom: none;
    }
    .dp-code-link {
      font-weight: 600;
      color: #2563eb;
      text-decoration: underline;
      cursor: pointer;
    }
    .dp-code-link:hover {
      color: #1d4ed8;
    }
    .perseo-col-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .perseo-status-indicator {
      font-weight: 700;
      color: #dc2626;
    }
    .perseo-status-indicator.sent {
      color: #166534;
    }
    .perseo-pedido-code {
      font-size: 9.5px;
      color: #64748b;
    }
    .dates-col-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
    }
    .sub-date {
      color: #475569;
      font-size: 10px;
      white-space: nowrap;
    }
    .sub-date span {
      font-weight: 600;
      color: #94a3b8;
    }
    .sub-status-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 600;
      font-size: 10px;
      white-space: nowrap;
    }
    .badge-status-1 { background-color: #dcfce7; color: #166534; }
    .badge-status-2 { background-color: #fef9c3; color: #854d0e; }
    .badge-status-3 { background-color: #fee2e2; color: #991b1b; }

    /* ── DOCS ANTIGUO ── */
    .docs-legacy-section {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-top: 5px;
    }
    .legacy-doc-link {
      font-size: 11px;
      font-weight: 600;
      color: #2563eb;
      text-decoration: underline;
    }
    .legacy-doc-link:hover {
      color: #1d4ed8;
    }
    </style>
