<template>
<div class="vx-row">
    <div class="vx-col w-full" fixed-height="true">
        <vx-card title="Búsqueda de Clientes">
            <div class="p-6">
                <!-- Mostrar cliente seleccionado -->
                <div v-if="ObjectClientSelected && ObjectClientSelected.nombres" class="mb-6">
                    <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div class="flex items-center justify-between">
                            <div class="flex items-center">
                                <div class="flex-shrink-0">
                                    <svg class="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <h3 class="text-lg font-medium text-green-800">Cliente Seleccionado</h3>
                                    <div class="mt-1">
                                        <p class="text-sm text-green-700">
                                            <span class="font-semibold">{{ ObjectClientSelected.nombres }}</span>
                                        </p>
                                        <p class="text-sm text-green-600">
                                            RUC/CI: {{ ObjectClientSelected.cedula }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <vs-button
                                color="warning"
                                type="line"
                                @click="buscarOtroCliente()"
                                icon="search"
                            >
                                Buscar Otro Cliente
                            </vs-button>
                        </div>
                    </div>
                </div>

                <!-- Formulario de búsqueda -->
                <div v-else>
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 class="text-lg font-medium text-gray-800 mb-4">
                            Buscar Institución o Librería
                        </h3>

                        <div class="flex gap-3">
                            <div class="flex-1">
                                <label class="block text-sm font-medium text-gray-700 mb-2">
                                    Nombre de la institución
                                    <small class="text-gray-500">(Presionar Enter para buscar)</small>
                                </label>
                                <vs-input
                                    v-model="busqueda.puntoVenta"
                                    @keypress.enter="realizarBusqueda()"
                                    class="w-full"
                                    placeholder="Escriba el nombre de la institución o punto de venta"
                                />
                            </div>
                            <div class="flex items-end">
                                <vs-button
                                    color="primary"
                                    type="filled"
                                    @click="realizarBusqueda()"
                                    icon="search"
                                >
                                    Buscar
                                </vs-button>
                            </div>
                        </div>
                    </div>

                    <!-- Resultados de búsqueda -->
                    <div v-if="arrayPuntoVenta.length > 0" class="mt-6">
                        <div class="bg-white rounded-lg border border-gray-200">
                            <div class="px-4 py-3 border-b border-gray-200">
                                <div class="flex items-center justify-between">
                                    <h4 class="text-lg font-medium text-gray-900">Resultados de Búsqueda</h4>
                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                        {{ arrayPuntoVenta.length }} {{ arrayPuntoVenta.length === 1 ? 'resultado' : 'resultados' }}
                                    </span>
                                </div>
                            </div>

                            <div class="divide-y divide-gray-200">
                                <div v-for="(institucion, index) in arrayPuntoVenta" :key="index" class="p-4">
                                    <div class="flex items-center justify-between">
                                        <div class="flex-1">
                                            <h5 class="text-lg font-medium text-gray-900">{{ institucion.nombreInstitucion }}</h5>
                                            <p v-if="institucion.estado_ventas === 'No tiene ventas'" class="text-sm text-red-600 mt-1">
                                                ⚠️ No tiene ventas en este período
                                            </p>
                                        </div>
                                        <vs-button
                                            color="primary"
                                            type="line"
                                            @click="expandirInstitucion(institucion)"
                                            icon="chevron_right"
                                        >
                                            Ver Clientes
                                        </vs-button>
                                    </div>

                                    <!-- Lista de clientes expandida -->
                                    <div v-if="institucion.expanded" class="mt-4 pl-4 border-l-2 border-blue-200">
                                        <h6 class="text-sm font-medium text-gray-700 mb-3">
                                            Clientes disponibles para {{ institucion.nombreInstitucion }}:
                                        </h6>

                                        <div v-if="institucion.datosClienteInstitucion && institucion.datosClienteInstitucion.length > 0" class="space-y-2">
                                            <div v-for="(cliente, clienteIndex) in institucion.datosClienteInstitucion" :key="clienteIndex"
                                                 class="flex items-center justify-between bg-gray-50 rounded-lg p-3 border border-gray-200">
                                                <div class="flex items-center">
                                                    <div class="flex-shrink-0">
                                                        <div class="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                                                            <svg class="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                        </div>
                                                    </div>
                                                    <div class="ml-3">
                                                        <p class="text-sm font-medium text-gray-900">{{ cliente.nombres }}</p>
                                                        <p class="text-sm text-gray-500">RUC/CI: {{ cliente.cedula }}</p>
                                                    </div>
                                                </div>
                                                <vs-button
                                                    @click="seleccionarCliente(cliente, institucion)"
                                                    color="success"
                                                    type="filled"
                                                    size="small"
                                                    icon="check"
                                                >
                                                    Seleccionar
                                                </vs-button>
                                            </div>
                                        </div>

                                        <div v-else class="text-center py-4">
                                            <div class="text-yellow-600">
                                                <svg class="mx-auto h-12 w-12 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                                </svg>
                                                <p class="mt-2 text-sm text-yellow-600">No hay registros de clientes para esta institución</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </vx-card>
        <!-- Grid Container: Cards de Notas lado a lado -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5" v-if="arrayClientePrefacturas.length>0">
            <!-- Card 1: Convertir Saldos Pendientes a Notas de Intercambio (DESHABILITADA TEMPORALMENTE) -->
            <vx-card title="NOTAS DE INTERCAMBIO" class="opacity-50 pointer-events-none">
                <div class="text-center p-4">
                    <vs-alert color="warning" icon-pack="feather" icon="icon-alert-triangle">
                        <span><b>Funcionalidad temporalmente deshabilitada</b><br>Esta sección está en proceso de actualización.</span>
                    </vs-alert>
                </div>
                <!-- Contenido comentado temporalmente
                <div v-if="arrayClientePrefacturas.length>0">
                    <vs-alert class="my-3" :active="inputValidtipo" color="danger" icon-pack="feather" icon="icon-info">
                        <span v-if="inputValidtipo && inputValid">Hay variaciones en los <b>tipos de venta y descuentos</b> en los documentos.</span>
                        <span v-else-if="inputValidtipo">Hay variaciones en los <b>tipos de venta</b> en los documentos.</span>
                    </vs-alert>
                </div>
                <div v-if="arrayClientePrefacturas.length>0">
                    <div title="Valores de saldos pendientes se convertirán a notas">
                        <div class="vx-row flex justify-center">
                        </div>
                        <div class="flex justify-center flex-wrap">
                            <vs-button color="warning" v-if="datosProlipa.length > 0" class="mx-2 mb-2">
                                Saldo a notas Prolipa
                            </vs-button>
                            <vs-button color="warning" v-if="datosCalmed.length > 0" class="mx-2 mb-2">
                                Saldo a notas Calmed
                            </vs-button>
                        </div>
                    </div>
                </div>
                -->
            </vx-card>

            <!-- Card 2: Convertir Desfas a Nota de Crédito -->
            <vx-card title="NOTAS DE CRÉDITO">
                <div v-if="arrayClientePrefacturas.length>0">
                    <vs-alert class="my-3" :active="inputValidtipo" color="danger" icon-pack="feather" icon="icon-info">
                        <span v-if="inputValidtipo && inputValid">Hay variaciones en los <b>tipos de venta y descuentos</b> en los documentos.</span>
                        <span v-else-if="inputValidtipo">Hay variaciones en los <b>tipos de venta</b> en los documentos.</span>
                    </vs-alert>
                </div>
                <div v-if="arrayClientePrefacturas.length>0">
                    <div title="El excedente de facturación se convertirá a nota de crédito">
                        <div v-if="verNotasCredito">
                            <!-- <div class="w-full flex justify-center" v-if="NotasCredito && NotasCredito.length > 0">
                            <font style="font-size: 15.5px">&nbsp;Documentos generados:
                                <feather-icon icon="FileTextIcon" class="cursor-pointer ml-4 mr-6 mt-1" :badge="NotasCredito.length" />
                            </font>
                        </div> -->
                            <!-- <vs-table :data="NotasCredito" v-if="NotasCredito.length>0 && verNotasCredito" style="width: auto;">
                            <template slot-scope="{ data }">
                                <div class="overflow-y-auto flex">
                                    <vs-tr v-for="(doc, index) in data" :key="index" class="flex">
                                        <vs-td :data="doc">
                                            <vs-button color="primary" @click="getDocumentos(doc.ven_codigo )" type="line">
                                                <i class="fa-regular fa-eye"></i> {{ doc.ven_codigo }}
                                            </vs-button>
                                        </vs-td>
                                    </vs-tr>
                                </div>
                            </template>
                        </vs-table>
                        <div v-else>
                            <vs-alert color="danger" icon-pack="feather" icon="icon-info">
                                <span>Sin documentos para la devolución.</span>
                            </vs-alert>
                        </div> -->
                        </div>
                        <div class="vx-row flex justify-center flex-wrap">
                            <vs-button v-if="datosProlipa.length > 0" class="mx-2 mb-2" color="success" @click="validacionCantNotasCredito=false;validacionNotasCredito=false;checkMarcarLLenar = false; checkBox2 = false; selectedOption = null; SelectInstitucion = ''; datosFR = []; inputValidtipo && inputValid ? confirmarVariaciontipoDescuento(1, 2) : inputValidtipo ? confirmarVariaciontipo(1, 2) : inputValid ? confirmacionVariacion(1, 2) : crearFacturaReal(1, 2);">
                                Crear nota de Crédito Prolipa
                            </vs-button>
                            <vs-button v-if="datosCalmed.length > 0" class="mx-2 mb-2" color="success" @click="validacionCantNotasCredito=false;validacionNotasCredito=false;checkMarcarLLenar = false; checkBox2 = false; selectedOption = null; SelectInstitucion = ''; datosFR = []; inputValidtipo && inputValid ? confirmarVariaciontipoDescuento(3, 2) : inputValidtipo ? confirmarVariaciontipo(3, 2) : inputValid ? confirmacionVariacion(3, 2) : crearFacturaReal(3, 2);">
                                Crear nota de Crédito Calmed
                            </vs-button>
                        </div>
                    </div>
                </div>
            </vx-card>
        </div>

        <!-- Card 3: Listado de Notas Generadas -->
        <vx-card class="mt-5" title="LISTADO DE NOTAS GENERADAS" v-if="NotasCreditoClientes.length>0">
            <div v-if="NotasCreditoClientes.length>0">
                <vs-table max-items="10" pagination search :data="NotasCreditoClientes" v-if="NotasCreditoClientes.length>0" no-data-text="No hay datos disponibles">
                    <template slot="header">
                        <font style="font-size: 15.5px">Cantidad notas:
                            <feather-icon icon="FileTextIcon" class="cursor-pointer ml-4 mr-6 mt-1" :badge="NotasCreditoClientes.length" />
                        </font>
                    </template>
                    <template slot="thead">
                        <vs-th width="300"># Documento</vs-th>
                        <vs-th width="150">Fecha Nota Credito</vs-th>
                        <vs-th width="150">Estado</vs-th>
                        <vs-th width="100">Acciones</vs-th>
                    </template>
                    <template slot-scope="{ data }">
                        <vs-tr v-if="data.length > 0" v-for="(tr, indextr) in data" :key="indextr">
                            <vs-td>
                                <template v-if="tr.idtipodoc==16">
                                    <b>Fecha creacion: {{ tr.ven_fecha }}</b><br>
                                </template>
                                <b class="text-danger">{{tr.idtipodoc==16?'Nota Crédito':'Nota intercambio'}}</b><br />
                                {{ tr.ven_codigo }}
                                <br />
                                <b>{{ tr.id_empresa==1 || tr.id_empresa==6 ? 'Prolipa' : tr.id_empresa==3 ? 'Calmed' : '' }}</b>
                                <br>Venta: <b v-if="tr.ven_tipo_inst === 'V' || !tr.ven_tipo_inst">Directa</b>
                                <b v-else>Por Lista</b><br />
                                <b>Institución: </b>{{ tr.nombreInstitucion }}<br />
                                <!-- Solo muestra FECHA SRI si existe, sin agregar <br> si no hay valor -->
                                <template v-if="tr.fecha_sri">
                                    <b class="text-success">FECHA SRI: {{ tr.fecha_sri }}</b><br>
                                </template>

                                <!-- Solo muestra DOCUMENTO SRI si existe, sin agregar <br> si no hay valor -->
                                <template v-if="tr.documento_sri">
                                    <b class="text-success">DOCUMENTO SRI: {{ tr.documento_sri }}</b><br>
                                </template>
                            </vs-td>
                            <vs-td v-if="tr.idtipodoc==16">
                                <p class="font-bold">Fecha:</p>
                                <span>{{ tr.fecha_notaCredito }}</span>
                            </vs-td>
                            <vs-td v-else>
                                <p class="font-bold">Fecha:</p>
                                <span>{{ tr.ven_fecha }}</span>
                            </vs-td>
                            <vs-td>
                                <span v-if="tr.idPuntoventa"><b>Grupo:</b> {{ tr.idPuntoventa }}</span><br />
                                <vs-chip v-if="tr.est_ven_codigo === 14" color="danger">PENDIENTE DE ASOCIAR SRI</vs-chip>
                                <vs-chip v-if="tr.est_ven_codigo === 15" color="LimeGreen">ASOCIADO SRI</vs-chip>
                                <vs-chip v-else-if="tr.est_ven_codigo === 13" color="dark">Intercambio</vs-chip>
                            </vs-td>
                            <vs-td>
                                <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                                    <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                    <vs-dropdown-menu style="width: 250px" class="cursor">
                                        <vs-dropdown-item>
                                            <vs-button color="#28C76F" type="line" class="w-full" @click="getDocumentos(tr.ven_codigo, tr.id_empresa)">Imprimir</vs-button>
                                            <vs-button v-if="tr.idtipodoc==16" color="danger" type="line" class="items-center mt-4" @click="popupSRI = true; itemSeleccionado = tr;">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-pencil-bolt">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M4 20h4l10.5 -10.5a2.828 2.828 0 1 0 -4 -4l-10.5 10.5v4" />
                                                    <path d="M13.5 6.5l4 4" />
                                                    <path d="M19 16l-2 3h4l-2 3" />
                                                </svg>
                                                Añadir datos SRI Nota de Crédito
                                            </vs-button>
                                        </vs-dropdown-item>
                                    </vs-dropdown-menu>
                                </vs-dropdown>
                            </vs-td>
                        </vs-tr>
                        <!-- <vs-tr v-else>
                            <vs-td colspan="7" class="text-center">No hay datos disponibles.</vs-td>
                        </vs-tr> -->
                    </template>
                </vs-table>
            </div>
        </vx-card>
        <vs-popup :active.sync="popupSRI" v-if="popupSRI" title="Asociar datos:">
            <DatosSRINotasCredito v-if="popupSRI" :ItemSeleccionado="itemSeleccionado" @documento-no-seleccionado="documentoNoSeleccionado" @actualizado-datos="documentoActualizado" />
        </vs-popup>

        <!-- Popup para seleccionar empresa de cruce -->
        <vs-popup :active.sync="popupSeleccionEmpresaCruce" title="Seleccionar Empresa para Facturación Cruzada">
            <div class="p-4">
                <div class="mb-4">
                    <p class="text-gray-700 mb-3">
                        Seleccione la empresa con la que desea cruzar la factura
                        <b class="text-primary">{{ facturaEnProceso ? facturaEnProceso.id_factura : '' }}</b>
                    </p>

                    <label class="block text-sm font-medium text-gray-700 mb-2">Empresa de Cruce:</label>
                    <v-select
                        :options="empresasDisponibles"
                        :reduce="empresa => empresa.id"
                        label="descripcion_corta"
                        class="w-full"
                        placeholder="--Seleccione una empresa--"
                        v-model="empresaCruceSeleccionada"
                    >
                        <template v-slot:option="option">
                            <div class="flex items-center">
                                <span class="font-semibold">{{ option.descripcion_corta }}</span>
                                <span class="ml-2 text-sm text-gray-500">(ID: {{ option.id }})</span>
                            </div>
                        </template>
                    </v-select>
                </div>

                <div class="flex justify-end space-x-3 mt-6">
                    <vs-button
                        type="border"
                        color="danger"
                        @click="popupSeleccionEmpresaCruce = false"
                    >
                        Cancelar
                    </vs-button>
                    <vs-button
                        color="success"
                        @click="confirmarSeleccionEmpresaCruce"
                        :disabled="!empresaCruceSeleccionada"
                    >
                        Confirmar
                    </vs-button>
                </div>
            </div>
        </vs-popup>

        <!-- Popup para generar PDF -->
        <vs-popup fullscreen :title="`${id}`" v-if="tdo==1&&id" :active.sync="popupImprimir">
            <facturaVue v-if="popupImprimir" :factu="factu" :id="id" @change="change" :op="op" />
        </vs-popup>
        <!-- <vs-button color="#3243c2" v-if="datosRucCliente.length>0 && usuario.id_group == 1"  type="flat" class="w-full mt-2" @click="entrarGruias(datosRucCliente)">Ver Guias Remision</vs-button> -->
        <vx-card :title="'Reporte de '+ObjectClientSelected.nombres" class="mt-5" v-if="arrayClientePrefacturas.length>0">
            <div v-if="arrayClientePrefacturas.length>0">
                <vs-alert :active="inputValid" color="danger" icon-pack="feather" icon="icon-info">
                    <span>Hay variaciones en los valores de <b>descuentos</b> en los documentos. {{ ven_desc_por_unique }}</span>
                </vs-alert>
                <vs-button @click="getEmpresas(1);">Crear Factura Real</vs-button>

                <!-- Tabs para Prefacturas, Facturado Real y Comparativo -->
                <div class="flex justify-center mb-4">
                    <vs-button
                        class="mx-2"
                        :class="{'active-button': tabDocumentos === 'prefacturas'}"
                        type="line"
                        line-position="bottom"
                        line-origin="center"
                        :color="tabDocumentos === 'prefacturas' ? 'primary' : 'dark'"
                        @click="tabDocumentos = 'prefacturas'"
                    >
                        Prefacturas
                    </vs-button>
                    <vs-button
                        class="mx-2"
                        :class="{'active-button': tabDocumentos === 'facturado'}"
                        type="line"
                        line-position="bottom"
                        line-origin="center"
                        :color="tabDocumentos === 'facturado' ? 'primary' : 'dark'"
                        @click="getEmpresas();tabDocumentos = 'facturado'"
                    >
                        Facturado Real
                    </vs-button>
                    <vs-button
                        class="mx-2"
                        :class="{'active-button': tabDocumentos === 'comparativo'}"
                        type="line"
                        line-position="bottom"
                        line-origin="center"
                        :color="tabDocumentos === 'comparativo' ? 'primary' : 'dark'"
                        @click="tabDocumentos = 'comparativo'"
                    >
                        Comparativo de Ventas y Facturado Real
                    </vs-button>
                </div>

                <!-- Tab Prefacturas -->
                <div v-if="tabDocumentos === 'prefacturas'">
                    <vs-table max-items="10" pagination search :data="arrayClientePrefacturas" v-if="arrayClientePrefacturas.length>0" no-data-text="No hay datos disponibles">
                        <template slot="header">
                            <vs-chip color="primary">
                                Cantidad: <b>{{ arrayClientePrefacturas ? arrayClientePrefacturas.length : 0 }}</b>
                            </vs-chip>
                            <!-- Botón único para crear factura -->

                        </template>
                        <template slot="thead">
                            <vs-th width="300"># Documento</vs-th>
                            <vs-th width="100">Empresa remitente</vs-th>
                            <vs-th width="900">Información documento</vs-th>
                            <vs-th width="200">Estado</vs-th>
                            <vs-th width="100">Acciones</vs-th>
                        </template>
                        <template slot-scope="{ data }">
                            <vs-tr v-if="data.length > 0" v-for="(tr, indextr) in data" :key="indextr">
                                <vs-td>
                                    {{ tr.ven_codigo }}
                                    <br />Venta: <b v-if="tr.ven_tipo_inst === 'V' || !tr.ven_tipo_inst">Directa</b>
                                    <b v-else>Por Lista</b>
                                    <br /><b>Facturador: </b>{{ tr.responsable }}
                                    <span v-if="tr.ven_tipo_inst === 'V' || !tr.ven_tipo_inst">
                                        <br /><b>Asesor: </b>{{ tr.asesor }}
                                    </span>
                                    <span v-if="tr.ven_idproforma">
                                        <br /><b>Pre-Proforma: </b>{{ tr.ven_idproforma }}
                                    </span>
                                </vs-td>
                                <vs-td>{{ tr.descripcion_corta}} </vs-td>
                                <vs-td>
                                    <b>Cliente:</b> <span v-if="tr.clienteUsuario">{{ tr.clienteUsuario }}</span><br>
                                    <b>Institución:</b> <span>{{ tr.clienteInstitucion }}</span><br />
                                    <b>Período escolar:</b> <span>{{ tr.periodoescolar }}</span>
                                    <p class="font-bold">Fecha:</p>
                                    <span>{{ tr.ven_fecha }}</span>
                                </vs-td>
                                <vs-td>
                                    <span v-if="tr.idPuntoventa"><b>Grupo:</b> {{ tr.idPuntoventa }} </span><br />
                                    <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #ff0000" v-if="tr.est_ven_codigo === 3" color="danger">Anulado</div>
                                        <div v-if="tr.usuario_anulado">
                                            <b>Anulado por:</b>
                                            <p>{{ tr.usuario_anulado }}</p>
                                        </div>
                                        <div v-if="tr.fecha_anulacion">
                                            <b>Fecha de anulado:</b>
                                            <p>{{ tr.fecha_anulacion }}</p>
                                        </div>
                                        <div v-if="tr.observacionAnulacion">
                                            <b>Observación anulado:</b>
                                            <p>{{ tr.observacionAnulacion }}</p>
                                        </div>
                                        <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #23BF23" v-if="tr.est_ven_codigo === 1" color="#23BF23">Despachado</div>
                                        <div v-if="tr.est_ven_codigo === 2">
                                            <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: DarkOrange" color="DarkOrange">Pendiente de despacho</div>
                                            <br><br>
                                            <!-- <vs-button v-if="tr.estadoPerseo == 0 && tr.idtipodoc==1 && tr.est_ven_codigo != 3" color="dark" type="border" class="p-3" @click="ObjectSelected=tr;confirmEnviarPerseo(tr)"><i class="fa-brands fa-discord"></i> Enviar a perseo </vs-button> -->
                                        </div>
                                        <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #00BFBF" v-if="tr.est_ven_codigo === 4" color="#00BFBF">Liquidado</div>
                                        <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #D86161" v-if="tr.est_ven_codigo === 5" color="#D86161">Deuda</div>
                                        <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #009999" v-if="tr.est_ven_codigo === 6" color="#009999">Cargado</div>
                                        <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #FF7C26" v-if="tr.est_ven_codigo === 7" color="#FF7C26">Por depositar</div>
                                        <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #D800D8" v-if="tr.est_ven_codigo === 8" color="#D800D8">Sin cuenta</div>
                                        <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #FF2626" v-if="tr.est_ven_codigo === 9" color="#FF2626">Error cuenta</div>
                                        <div style="padding:5px; border-radius:5px; color:White; font-size:10px;text-align:center; font-weight:bold; background-color: #AF7AC5" v-if="tr.est_ven_codigo === 10" color="#AF7AC5">Empacado</div>
                                </vs-td>
                                <vs-td>
                                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                        <vs-dropdown-menu style="width: 250px" class="cursor">
                                            <vs-dropdown-item>
                                                <vs-button color="#28C76F" type="line" class="w-full" @click="getDocumentos(tr.ven_codigo,tr.id_empresa)">Imprimir</vs-button>
                                            </vs-dropdown-item>
                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>

                <!-- Tab Facturado Real -->
                <div v-if="tabDocumentos === 'facturado'">
                    <vs-table max-items="10" pagination search :data="arrayFacturasReales" no-data-text="No hay facturas reales disponibles">
                        <template slot="header">
                            <vs-chip color="success">
                                Cantidad: <b>{{ arrayFacturasReales ? arrayFacturasReales.length : 0 }}</b>
                            </vs-chip>
                        </template>
                        <template slot="thead">
                            <vs-th width="250"># Factura</vs-th>
                            <vs-th width="200">Cliente</vs-th>
                            <vs-th width="150">RUC/Cédula</vs-th>
                            <vs-th width="120">Descuento %</vs-th>
                            <vs-th width="120">Subtotal</vs-th>
                            <vs-th width="120">Total</vs-th>
                            <vs-th width="200">Facturación Cruzada</vs-th>
                            <vs-th width="100">Acciones</vs-th>
                        </template>
                        <template slot-scope="{ data }">
                            <vs-tr v-if="data.length > 0" v-for="(tr, indextr) in data" :key="indextr">
                                <vs-td>
                                    <b class="text-primary">{{ tr.id_factura }}</b>
                                    <br />
                                    <span class="text-sm text-gray-600">Fecha: {{ tr.ven_fecha }}</span>
                                    <br>
                                    <span class="text-sm text-gray-600">Empresa: <b class="text-primary">{{ tr.id_empresa==1 || tr.id_empresa==6 ? 'PROLIPA' : 'CALMED' }}</b></span>
                                </vs-td>
                                <vs-td>
                                    <b>{{ tr.cliente }}</b>
                                </vs-td>
                                <vs-td>
                                    {{ tr.cedula }}
                                </vs-td>
                                <vs-td>
                                    <vs-chip color="warning">
                                        {{ tr.ven_desc_por }}%
                                    </vs-chip>
                                </vs-td>
                                <vs-td>
                                    <b>${{ tr.ven_subtotal.toFixed(2) }}</b>
                                </vs-td>
                                <vs-td>
                                    <b class="text-success">${{ tr.ven_valor.toFixed(2) }}</b>
                                </vs-td>
                                <vs-td>
                                    <div class="flex items-center justify-center">
                                        <vs-switch
                                            :value="tr.factura_cruzada == 1"
                                            @input="confirmarFacturacionCruzada(tr, $event)"
                                        >
                                            <span slot="on">Sí</span>
                                            <span slot="off">No</span>
                                        </vs-switch>
                                    </div>
                                </vs-td>
                                <vs-td>
                                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                        <vs-dropdown-menu style="width: 250px" class="cursor">
                                            <vs-dropdown-item>
                                                <vs-button color="DarkOrchid" type="line" class="w-full" @click="factu= tr;getreporte(tr)">Generar pdf</vs-button>
                                            </vs-dropdown-item>
                                        </vs-dropdown-menu>
                                    </vs-dropdown>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>

                <!-- Tab Comparativo -->
                <div v-if="tabDocumentos === 'comparativo'">
                    <ComparativoVentasFacturas
                        :prefacturas="arrayClientePrefacturas"
                        :facturas="arrayFacturasReales"
                        :cliente="ObjectClientSelected"
                    />
                </div>
            </div>
            <vs-popup fullscreen :active.sync="popupFR" :title="`Reporte ${ObjectClientSelected.nombres} (${empresa})`" @close="getAllPrefacturas(datacliente);limpiarModalEmpresa">
                <div class="p-4 bg-white shadow-lg rounded-lg">
                    <div class="w-full">
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- Primera columna - Información del cliente -->
                            <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <h3 class="text-lg font-medium text-gray-800 mb-4 border-b border-gray-300 pb-2">
                                    Información del Cliente
                                </h3>
                                <!-- {{ usuarioReporte }} -->

                                <!-- Selección de Institución -->
                                <!-- <div class="mb-4">
                                    <div v-if="!institucionesVariacion" class="bg-white rounded-md p-3 border border-gray-200">
                                        <label class="text-sm font-medium text-gray-700 block mb-1">Institución</label>
                                        <p class="text-gray-900 font-medium">{{ datainstitucionunique.nombreInstitucion }}</p>
                                    </div>

                                    <div v-else class="space-y-3">
                                        <div class="bg-white rounded-md p-3 border border-gray-200">
                                            <label class="text-sm font-medium text-gray-700 block mb-2">
                                                Selección de Institución/Punto de venta
                                            </label>
                                            <v-select
                                                :options="institucionesreporte"
                                                :reduce="institucionesreporte => institucionesreporte"
                                                label="nombreInstitucion"
                                                class="w-full"
                                                placeholder="--Seleccione una institución--"
                                                v-model="SelectInstitucion"
                                                @input="validarSeleccionInstitucion()"
                                            />
                                        </div>

                                        <div v-if="!SelectInstitucion">
                                            <vs-alert color="danger" icon-pack="feather" icon="icon-info">
                                                <span>Seleccione <b>la Institución/Punto de venta</b>.</span>
                                            </vs-alert>
                                        </div>

                                        <div v-if="SelectInstitucion" class="bg-white rounded-md p-3 border border-gray-200">
                                            <div class="flex items-center justify-between">
                                                <div>
                                                    <label class="text-sm font-medium text-gray-700 block mb-1">
                                                        Institución/Punto de venta seleccionado
                                                    </label>
                                                    <p class="text-gray-900 font-medium">
                                                        {{ datainstitucionunique.nombreInstitucion }}
                                                    </p>
                                                    <p class="text-sm text-gray-500">ID: {{ datainstitucionunique.idInstitucion }}</p>
                                                </div>
                                                <vs-button
                                                    color="warning"
                                                    type="line"
                                                    size="small"
                                                    @click="mostrarSelectInstitucion=true;cambiarInstitucion()"
                                                    icon="edit"
                                                >
                                                    Cambiar
                                                </vs-button>
                                            </div>
                                        </div>
                                    </div>
                                </div> -->

                                <!-- Información adicional del cliente -->
                                <div class="space-y-3">
                                    <div class="flex items-center py-2 border-b border-gray-200">
                                        <span class="text-sm text-gray-600 w-32">Cliente:</span>
                                        <span class="text-sm font-medium text-gray-900">{{ ObjectClientSelected.nombres }}</span>
                                    </div>

                                    <div class="flex items-center py-2 border-b border-gray-200">
                                        <span class="text-sm text-gray-600 w-32">RUC Cliente:</span>
                                        <span class="text-sm font-medium text-gray-900">{{ ObjectClientSelected.cedula }}</span>
                                    </div>

                                    <div class="flex items-center py-2 border-b border-gray-200">
                                        <span class="text-sm text-gray-600 w-32">Período escolar:</span>
                                        <span class="text-sm font-medium text-gray-900">{{ periodoSelect.descripcion }}</span>
                                    </div>

                                    <div class="flex items-center py-2 border-b border-gray-200">
                                        <span class="text-sm text-gray-600 w-32">Fecha:</span>
                                        <span class="text-sm font-medium text-gray-900">{{ fechaActual }}</span>
                                    </div>

                                    <div class="flex items-center py-2">
                                        <span class="text-sm text-gray-600 w-32">Empresa:</span>
                                        <span class="text-sm font-medium text-gray-900">{{ empresa }}</span>
                                    </div>
                                </div>
                            </div>

                            <!-- Segunda columna - Configuración de factura -->
                            <div class="bg-gray-50 rounded-lg p-5 border border-gray-200">
                                <h3 class="text-lg font-medium text-gray-800 mb-4 border-b border-gray-300 pb-2">
                                    Configuración de Factura
                                </h3>

                                <!-- Número de factura -->
                                <div class="bg-white rounded-md p-3 border border-gray-200 mb-4 text-center">
                                    <label class="text-sm font-medium text-gray-700 block mb-1">Número de Factura</label>
                                    <span class="text-lg font-semibold text-blue-600">#{{ codigo }}</span>
                                </div>

                                <!-- Opciones de configuración -->
                                <div class="space-y-4">
                                    <div class="bg-white rounded-md p-3 border border-gray-200">
                                        <label class="text-sm font-medium text-gray-700 block mb-3">Opciones de Facturación</label>

                                        <div class="space-y-3">
                                            <label class="flex items-center cursor-pointer">
                                                <vs-checkbox
                                                    color="success"
                                                    v-model="checkBox2"
                                                    @input="quitarvalidacion"
                                                    class="mr-3"
                                                />
                                                <span class="text-sm text-gray-700">Permitir facturar más de lo despachado</span>
                                            </label>

                                            <label class="flex items-center cursor-pointer">
                                                <vs-checkbox
                                                    color="success"
                                                    v-model="checkMarcarLLenar"
                                                    class="mr-3"
                                                />
                                                <span class="text-sm text-gray-700">Llenar y seleccionar automáticamente</span>
                                            </label>
                                        </div>
                                    </div>

                                    <!-- Filtros -->
                                    <div class="bg-white rounded-md p-3 border border-gray-200">
                                        <label class="text-sm font-medium text-gray-700 block mb-2">Filtros de visualización</label>
                                        <v-select
                                            class="w-full"
                                            v-model="selectedOption"
                                            :options="options"
                                            :reduce="options => options.value"
                                            @change="applyFilters"
                                            @input="applyFilters"
                                            placeholder="Selecciona un filtro"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- Panel de información de facturación cruzada -->
                    <div v-if="esFacturacionCruzada" class="mb-4">
                        <div class="bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400 rounded-lg shadow-lg p-4">
                            <div class="flex items-center mb-2">
                                <div class="flex-shrink-0">
                                    <svg class="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                                    </svg>
                                </div>
                                <div class="ml-3">
                                    <h3 class="text-lg font-bold text-orange-800">
                                        <i class="fas fa-exchange-alt mr-2"></i>Facturación Cruzada Activa
                                    </h3>
                                </div>
                            </div>
                            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3">
                                <div class="bg-white rounded-lg p-3 shadow-sm border border-orange-200">
                                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Prefacturas de:</div>
                                    <div class="text-base font-bold text-gray-900">{{ empresaOrigenNombre }}</div>
                                </div>
                                <div class="bg-white rounded-lg p-3 shadow-sm border border-orange-200">
                                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Facturar con:</div>
                                    <div class="text-base font-bold text-blue-600">{{ empresaFacturacionNombre }}</div>
                                </div>
                                <div class="bg-white rounded-lg p-3 shadow-sm border border-orange-200">
                                    <div class="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Cliente destino a Perseo:</div>
                                    <div class="text-base font-bold text-green-600">{{ clienteFacuracionCruzada.nombres }} {{ clienteFacuracionCruzada.apellidos }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="w-full">
                            <div class="flex items-center mb-2">
                                <p class="text-gray-700">Institución / Punto de venta:</p>
                                <p class="ml-2 text-lg text-blue-600 font-bold">{{ ObjectClientSelected.nombreInstitucion }}</p>
                            </div>
                            <div class="w-full">
                                <div class="w-1/2">
                                    <div class="flex items-center mb-2">
                                        <p class="text-gray-600">Fecha: <span class="font-semibold">{{ fechaActual }}</span></p>
                                    </div>
                                </div>
                                <div class="w-1/2">
                                    <div class="flex items-center mb-2">
                                        <p class="text-gray-600">Empresa: <span class="font-semibold">{{ empresa }}</span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="flex flex-col mt-2">
                                <div class="flex items-center mb-2">
                                    <div v-if="!institucionesVariacion">
                                        <div class="mb-2">
                                            <p class="text-gray-600">Institución: <span class="font-semibold">{{ datainstitucionunique.nombreInstitucion }}</span></p>
                                        </div>
                                        <div>
                                        <p class="text-gray-600">RUC: <span class="font-semibold">{{ datainstitucionunique.ruc_institucion }}</span></p>
                                        </div>
                                    </div>
                                    <div class="w-full" v-else>
                                        <div class="w-1/2 justify-center flex">
                                            <p class="font-semibold">Selección de Institución:</p>
                                            <v-select :options="institucionesreporte" :reduce="institucionesreporte => institucionesreporte" label="clienteUsuario" class="w-full h-100" placeholder="--Seleccione--" v-model="SelectInstitucion" @input="validarSeleccionInstitucion()" />
                                        </div>
                                        <div class="w-1/2" v-if="!SelectInstitucion">
                                            <vs-alert color="danger" icon-pack="feather" icon="icon-info">
                                                <span>Seleccione <b>la instituci�n</b>.</span>
                                            </vs-alert>
                                        </div>
                                        <div v-if="SelectInstitucion" class="w-f1/2 mt-2">
                                            <div class="mb-2">
                                                <p class="text-gray-600">Institución: <span class="font-semibold">{{ datainstitucionunique.nombreInstitucion }}</span></p>
                                            </div>
                                            <div>
                                                <p class="text-gray-600">RUC: <span class="font-semibold">{{ datainstitucionunique.ruc_institucion }}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-center mb-2">
                                    <p class="text-gray-600">Período escolar: <span class="font-semibold">{{ periodoSelect.descripcion }}</span></p>
                                </div>
                            </div>
                        </div>
                        <vs-divider></vs-divider>
                        <div class="flex justify-center mb-3">
                            <span class="mx-4">Factura Real #: {{codigo}}</span>
                        </div>
                        <div class="flex items-center" style="width: 90%">
                            <div class="fle x w-1/2 md:w-full items-center">
                                <vs-checkbox class="ml-5" color="success" v-model="checkBox2" @input="quitarvalidacion">Permitir Facturar más de lo despachado.</vs-checkbox>
                                <vs-checkbox class="ml-5 mt-3" color="success" v-model="checkMarcarLLenar">Llenar y seleccionar.</vs-checkbox>
                            </div>
                            <div class="flex w-1/2 md:w-full items-center mr-5 ">
                                <span class="mx-1">Filtrar: </span>
                                <v-select class="w-full" style="width: 200px;" v-model="selectedOption" :options="options" :reduce="options => options.value" @change="applyFilters" @input="applyFilters" placeholder="Selecciona un filtro"></v-select>
                            </div>
                        </div> -->
                    <div v-if="datosAllFR" class="table-container mt-5">
                        <vs-table class="mt-2" :data="datosAllFR" :max-items="20" search no-data-text="No hay datos disponibles">
                            <template slot="header">
                                <vs-chip color="#49218a">Cantidad: <b> {{ datosAllFR.length }}</b></vs-chip>
                                <p class="mx-3"><b>Total ítems seleccionados: {{ checkedItemCount }}</b></p>
                            </template>
                            <template slot="thead">
                                <vs-th width="20">
                                    <vs-checkbox color="dark" v-model="selectAll" @change="toggleAll"></vs-checkbox>
                                </vs-th>
                                <vs-th width="20">
                                    #
                                </vs-th>
                                <vs-th sort-key="pro_codigo">Codigo</vs-th>
                                <vs-th sort-key="nombre">Producto</vs-th>
                                <vs-th>Cantidad en Prefacturas</vs-th>
                                <vs-th>Cantidad devuelta</vs-th>
                                <vs-th>Cantidad ya Facturada</vs-th>
                                <vs-th>Cantidad Nota Crédito</vs-th>
                                <vs-th>Cantidad Facturada - Nota Crédito</vs-th>
                                <vs-th>Cantidad disponible a Facturar </vs-th>
                                <vs-th>Precio * Unidad</vs-th>
                                <vs-th>Precio * Cantidad</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="k" v-for="(tr, k) in data" :state="(tr.det_ven_cantidad - tr.det_ven_dev) < tr.cantidad_facturada-tr.cantidad_nota_credito  ? 'danger':null">
                                    <vs-td>
                                        <vs-checkbox color="dark" v-model="tr.check_real_facturar" :disabled="tr.check_cantidades"></vs-checkbox>
                                    </vs-td>
                                    <vs-td>
                                        <span>{{k+1}}</span>
                                    </vs-td>
                                    <vs-td>
                                        {{ tr.pro_codigo}}
                                    </vs-td>
                                    <vs-td>
                                        {{ tr.nombre }}
                                    </vs-td>
                                    <vs-td>{{ tr.det_ven_cantidad}}</vs-td>
                                    <vs-td>{{ tr.det_ven_dev }}</vs-td>
                                    <vs-td>{{ tr.cantidad_facturada }}</vs-td>
                                    <vs-td>{{ tr.cantidad_nota_credito }}</vs-td>
                                    <vs-td>{{ tr.cantidad_facturada - tr.cantidad_nota_credito }}</vs-td>
                                    <vs-td>
                                        <vs-input :disabled="tr.check_cantidades" v-model="tr.cantidad_real_facturar" :min="0" :max="(tr.det_ven_cantidad - tr.det_ven_dev) - (tr.cantidad_facturada - tr.cantidad_nota_credito)" @input="validateInput(tr)" /><br>
                                        <span v-if="tr.cantidad_facturada - tr.cantidad_nota_credito > tr.det_ven_cantidad - tr.det_ven_dev" class="text-danger font-bold">Cantidad facturada excedida</span>
                                    </vs-td>
                                    <vs-td> {{ tr.det_ven_valor_u }} </vs-td>
                                    <vs-td style="text-align: right;"> {{ (tr.det_ven_valor_u * tr.cantidad_real_facturar).toFixed(2) }} </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <vs-divider></vs-divider>
                    <div class="w-full flex justify-between mt-3">
                        <div class="checked-count w-1/2">
                            <p><b>Total ítems seleccionados: {{ checkedItemCount }}</b></p>
                        </div>
                        <div class="w-1/2">
                            <table style="width: 100%; text-align: right;">
                                <tr>
                                    <td>
                                        <p><b>SUBTOTAL $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ subtotal.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="flex justify-end items-center justify-items-center">
                                            <p><b>DESCUENTO </b></p>
                                            <span v-if="descuentoVariacion" class="flex items-center">
                                                <vs-input max="100" min="0" v-model="inputDescuento" type="number" placeholder="Descuento" style="width: 100px;" class="mx-2" />
                                                <p><b> %</b></p>
                                            </span>
                                            <span v-else>
                                                <p><b class="mx-2"> {{ ven_desc_por_unique[0] }} %</b></p>
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <p><b>{{ descuento.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>(SUBTOTAL - DESCUENTO) $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ subtotalDescuento.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>IVA $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ iva.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>TRANSPORTE $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ transporte.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>TOTAL $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ total.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="flex justify-center mt-5">
                        <vs-button class="vs-con-loading__container" color="success" type="relief" @click="guardarDatos" :disabled="isLoading">
                            <span v-if="isLoading">GUARDANDO...</span>
                            <span v-else>Guardar</span>
                        </vs-button>
                        <!-- <vs-button @click="guardarDatos" color="success" type="relief">Guardar</vs-button> -->
                    </div>
                </div>
            </vs-popup>
            <vs-popup title="PREFACTURA a NOTA" fullscreen :active.sync="popupPrefacturaANotas" @close="isLoading?handleCloseAbono():getAllPrefacturas(datacliente);" :class="{ 'hide-close': isLoading }">
                <div class="p-4 bg-white shadow-lg rounded-lg">
                    <div class="w-full">
                        <div class="flex items-center mb-2">
                            <p class="text-gray-700">Institución / Punto de venta:</p>
                            <p class="ml-2 text-lg text-blue-600 font-bold">{{ ObjectClientSelected.nombreInstitucion }}</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <!-- Primera columna -->
                            <div>
                                <div class="flex items-center mb-2">
                                    <p class="text-gray-600">Fecha: <span class="font-semibold">{{ fechaActual }}</span></p>
                                </div>
                                <div class="flex items-center mb-2">
                                    <p class="text-gray-600">Empresa: <span class="font-semibold">{{ empresa }}</span></p>
                                </div>

                                <div class="flex flex-col mt-2">
                                    <div class="flex items-center mb-2">
                                        <div v-if="!institucionesVariacion">
                                            <div class="mb-2">
                                                <p class="text-gray-600">Institución: <span class="font-semibold">{{ datainstitucionunique.nombreInstitucion }}</span></p>
                                            </div>
                                        </div>
                                        <div class="w-full" v-else>
                                            <div class="flex items-center w-full">
                                                <p class="font-semibold">Selección de Institución:</p>
                                                <v-select :options="institucionesreporte" :reduce="institucionesreporte => institucionesreporte" label="nombreInstitucion" class="w-full h-100 ml-2" placeholder="--Seleccione--" v-model="SelectInstitucion" @input="validarSeleccionInstitucion()" />
                                            </div>
                                            <div class="w-full mt-2" v-if="!SelectInstitucion">
                                                <vs-alert color="danger" icon-pack="feather" icon="icon-info">
                                                    <span>Seleccione <b>la instituci�n</b>.</span>
                                                </vs-alert>
                                            </div>
                                            <div v-if="SelectInstitucion" class="w-full mt-2">
                                                <div class="mb-2">
                                                    <p class="text-gray-600">Institución: <span class="font-semibold">{{ datainstitucionunique.nombreInstitucion }} - {{ datainstitucionunique.idInstitucion }}</span></p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center mb-2">
                                        <p class="text-gray-600">Período escolar: <span class="font-semibold">{{ periodoSelect.descripcion }}</span></p>
                                    </div>
                                </div>
                            </div>
                            <!-- Segunda columna -->
                            <div class="w-full rounded-lg p-4">
                                <div class="flex justify-center mb-3">
                                    <span class="mx-4 text-danger"><b>Nota #: {{codigo}}</b></span> <br>
                                </div>
                                <div class="flex justify-center mb-3">
                                    <h4 class="text-danger font-bold">{{ tipo_ven_codigo==1 ?"Venta Directa":tipo_ven_codigo==2?"Venta Lista":'' }}</h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="datosAllFR" class="table-container mt-5">
                        <vs-table class="mt-2" :data="datosAllFR" :max-items="20" search no-data-text="No hay datos disponibles">
                            <template slot="header">
                                <vs-chip color="red">Cantidad: <b> {{ datosAllFR.length }}</b></vs-chip>
                            </template>
                            <template slot="thead">
                                <vs-th width="20">
                                </vs-th>
                                <vs-th width="20">
                                    #
                                </vs-th>
                                <vs-th sort-key="pro_codigo">Codigo</vs-th>
                                <vs-th sort-key="nombre">Producto</vs-th>
                                <vs-th>Cantidad en Prefacturas</vs-th>
                                <vs-th>Cantidad devuelta</vs-th>
                                <vs-th>Cantidad ya Facturada</vs-th>
                                <vs-th>Cantidad Nota Credito</vs-th>
                                <vs-th style="color: red;">Cantidad a Nota</vs-th>
                                <vs-th>Precio * Unidad</vs-th>
                                <vs-th>Precio * Cantidad</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="k" v-for="(tr, k) in data">
                                    <vs-td>
                                        <vs-checkbox color="red" v-model="tr.check_real_facturar" disabled></vs-checkbox>
                                    </vs-td>
                                    <vs-td>
                                        <span>{{k+1}}</span>
                                    </vs-td>
                                    <vs-td>
                                        {{ tr.pro_codigo}}
                                    </vs-td>
                                    <vs-td>
                                        {{ tr.nombre }}
                                    </vs-td>
                                    <vs-td>{{ tr.det_ven_cantidad}}</vs-td>
                                    <vs-td>{{ tr.det_ven_dev }}</vs-td>
                                    <vs-td>{{ tr.cantidad_facturada }}</vs-td>
                                    <vs-td>{{ tr.cantidad_nota_credito }}</vs-td>
                                    <vs-td>{{ tr.cantidad_real_facturar }}</vs-td>
                                    <vs-td> {{ tr.det_ven_valor_u }} </vs-td>
                                    <vs-td style="text-align: right;"> {{ (tr.det_ven_valor_u * tr.cantidad_real_facturar).toFixed(2) }} </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <vs-divider></vs-divider>
                    <div class="w-full flex justify-end mt-3">
                        <div class="w-1/2">
                            <table style="width: 100%; text-align: right;">
                                <tr>
                                    <td>
                                        <p><b>SUBTOTAL $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ subtotal.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="flex justify-end items-center justify-items-center">
                                            <p><b>DESCUENTO </b></p>
                                            <span v-if="descuentoVariacion" class="flex items-center">
                                                <vs-input max="100" min="0" v-model="inputDescuento" type="number" placeholder="Descuento" style="width: 100px;" class="mx-2" />
                                                <p><b> %</b></p>
                                            </span>
                                            <span v-else>
                                                <p><b class="mx-2"> {{ ven_desc_por_unique[0] }} %</b></p>
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <p><b>{{ descuento.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>(SUBTOTAL - DESCUENTO) $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ subtotalDescuento.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>IVA $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ iva.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>TRANSPORTE $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ transporte.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>TOTAL $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ total.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="flex justify-center mt-5">
                        <vs-button class="vs-con-loading__container" color="danger" type="relief" @click="guardarDatosNotas" :disabled="isLoading">
                            <span v-if="isLoading">GUARDANDO...</span>
                            <span v-else>Guardar</span>
                        </vs-button>
                        <!-- <vs-button @click="guardarDatos" color="success" type="relief">Guardar</vs-button> -->
                    </div>
                </div>
            </vs-popup>
            <vs-prompt title="Seleccione el tipo de venta" @cancel="close" cancelText="Cancelar" acceptText="Generar" @accept="acceptAlert" @close="close" :active.sync="activePrompt">
                <div class="con-exemple-prompt">
                    <p class="mt-2">Seleccione el Tipo de venta</p>
                    <v-select :options="optionsVenta" :reduce="optionsVenta => optionsVenta.value" label="label" class="w-full" v-model="tipo_ven_codigo" />
                </div>
            </vs-prompt>
            <vs-popup fullscreen v-if="popupDocumento" :title="'Detalle:'" :active.sync="popupDocumento" class="popopPadre">
                <div v-if="popupDocumento">
                    <documentoVenta :DocumentoVenta="DocumentoVenta[0]" :DocumentoDetalleVenta="DocumentoDetalleVenta" />
                </div>
            </vs-popup>
            <vs-popup title="NOTA DE CRÉDITO" fullscreen :active.sync="popupNotaDeCredito" @close="isLoading?handleCloseAbono():getAllPrefacturas(datacliente);" :class="{ 'hide-close': isLoading }">
                <div class="p-4 bg-white shadow-lg rounded-lg">
                    <div class="w-full">
                        <div class="flex items-center mb-2">
                            <p class="text-gray-700">Cliente:</p>
                            <p class="ml-2 text-lg text-blue-600 font-bold">{{ ObjectClientSelected.nombres }}</p>
                        </div>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <div class="flex items-center mb-2">
                                    <!-- <p class="text-gray-600">Fecha: <span class="font-semibold">{{ fechaActual }}</span></p> -->
                                    <p class="text-gray-600 mr-4">Fecha:</p>
                                    <flat-pickr :config="configdateTimePicker" v-model="fechaActual" placeholder="Fecha " style="display: inline-block;width: 70%" />
                                </div>
                                <div class="flex items-center mb-2">
                                    <p class="text-gray-600">Empresa: <span class="font-semibold">{{ empresa }}</span></p>
                                </div>

                                <div class="flex flex-col mt-2">
                                    <div class="flex items-center mb-2">
                                        <div>
                                            <div class="mb-2">
                                                <p class="text-gray-600">Cliente: <span class="font-semibold">{{ ObjectClientSelected.nombres }}</span></p>
                                            </div>
                                            <div>
                                                <p class="text-gray-600">RUC/Cédula: <span class="font-semibold">{{ ObjectClientSelected.cedula }}</span></p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="flex items-center mb-2">
                                        <p class="text-gray-600">Período escolar: <span class="font-semibold">{{ periodoSelect.descripcion }}</span></p>
                                    </div>
                                </div>
                            </div>
                            <div class="w-full rounded-lg p-4">
                                <div class="flex justify-center mb-3">
                                    <h4 class="mx-4 text-danger"><b>Nota Crédito #: {{codigo}}</b></h4> <br>
                                </div>
                                <!-- <div class="flex justify-center mb-3">
                                    <h4 class="text-danger font-bold">{{ tipo_ven_codigo==1 ?"Venta Directa":tipo_ven_codigo==2?"Venta Lista":'' }}</h4>
                                </div> -->
                            </div>
                        </div>
                    </div>
                    <div class="flex justify-center items-center mt-5">
                        <h5>Configuracion:</h5>
                        <div class="items-center">
                            <vs-checkbox color="red" v-model="validacionNotasCredito" @input="ValidarNotas">Excluir items</vs-checkbox>
                            <vs-checkbox color="red" v-model="validacionCantNotasCredito">Cambiar cantidades a convertir de los items</vs-checkbox>
                        </div>
                    </div>
                    <div v-if="datosAllFR" class="table-container mt-5">
                        <vs-table class="mt-2" :data="datosAllFR" :max-items="20" search no-data-text="No hay datos disponibles">
                            <template slot="header">
                                <vs-chip color="red">Cantidad: <b> {{ datosAllFR.length }}</b></vs-chip>
                                <p><b>Total ítems seleccionados: {{ checkedItemCount }}</b></p>
                            </template>
                            <template slot="thead">
                                <vs-th width="20">
                                </vs-th>
                                <vs-th width="20">
                                    #
                                </vs-th>
                                <vs-th sort-key="pro_codigo">Codigo</vs-th>
                                <vs-th sort-key="nombre">Producto</vs-th>
                                <vs-th>Cantidad en Prefacturas</vs-th>
                                <vs-th>Cantidad devuelta</vs-th>
                                <vs-th>Cantidad ya Facturada</vs-th>
                                <vs-th>Cantidad en Nota Crédito</vs-th>
                                <vs-th style="color: red;">Cantidad convertir a Nota Crédito</vs-th>
                                <vs-th>Precio * Unidad</vs-th>
                                <vs-th>Precio * Cantidad</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="k" v-for="(tr, k) in data">
                                    <vs-td>
                                        <vs-checkbox color="red" v-model="tr.check_real_facturar" :disabled="!validacionNotasCredito"></vs-checkbox>
                                    </vs-td>
                                    <vs-td>
                                        <span>{{k+1}}</span>
                                    </vs-td>
                                    <vs-td>
                                        {{ tr.pro_codigo}}
                                    </vs-td>
                                    <vs-td>
                                        {{ tr.nombre }}
                                    </vs-td>
                                    <vs-td>{{ tr.det_ven_cantidad}}</vs-td>
                                    <vs-td>{{ tr.det_ven_dev }}</vs-td>
                                    <vs-td>{{ tr.cantidad_facturada }}</vs-td>
                                    <vs-td>{{ tr.cantidad_nota_credito }}</vs-td>
                                    <vs-td v-if="validacionCantNotasCredito">
                                        <vs-input :disabled="!validacionCantNotasCredito" v-model="tr.cantidad_real_facturar" :min="0" :max="(tr.det_ven_cantidad - tr.det_ven_dev) - (tr.cantidad_facturada - tr.cantidad_nota_credito)" @input="validateInputNota(tr)" /><br>
                                    </vs-td>
                                    <vs-td v-else>{{ tr.cantidad_real_facturar }}</vs-td>
                                    <vs-td> {{ tr.det_ven_valor_u }} </vs-td>
                                    <vs-td style="text-align: right;"> {{ (tr.det_ven_valor_u * tr.cantidad_real_facturar).toFixed(2) }} </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <vs-divider></vs-divider>
                    <div class="w-full flex justify-end mt-3">
                        <div class="checked-count w-1/2">
                            <p><b>Total ítems seleccionados: {{ checkedItemCount }}</b></p>
                        </div>
                        <div class="w-1/2">
                            <table style="width: 100%; text-align: right;">
                                <tr>
                                    <td>
                                        <p><b>SUBTOTAL $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ subtotal.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="flex justify-end items-center justify-items-center">
                                            <p><b>DESCUENTO </b></p>
                                            <span v-if="descuentoVariacion" class="flex items-center">
                                                <vs-input max="100" min="0" v-model="inputDescuento" type="number" placeholder="Descuento" style="width: 100px;" class="mx-2" />
                                                <p><b> %</b></p>
                                            </span>
                                            <span v-else>
                                                <p><b class="mx-2"> {{ ven_desc_por_unique[0] }} %</b></p>
                                            </span>
                                        </div>
                                    </td>
                                    <td>
                                        <p><b>{{ descuento.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>(SUBTOTAL - DESCUENTO) $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ subtotalDescuento.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>IVA $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ iva.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>TRANSPORTE $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ transporte.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p><b>TOTAL $</b></p>
                                    </td>
                                    <td>
                                        <p><b>{{ total.toFixed(2) }}</b></p>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </div>
                    <div class="flex justify-center mt-5">
                        <vs-button class="vs-con-loading__container" color="danger" type="relief" @click="guardarDatosNotaCredito" :disabled="isLoading">
                            <span v-if="isLoading">GUARDANDO...</span>
                            <span v-else>Guardar</span>
                        </vs-button>
                    </div>
                </div>
            </vs-popup>
        </vx-card>
        <vs-popup v-model="popupVisible" title="Productos sin stock suficiente" :active.sync="popupVisible">
            <div v-if="productosNoDisponibles.length">
                <vs-table class="mt-2" :data="productosNoDisponibles" :max-items="20" stripe no-data-text="No hay datos disponibles" style="border-radius: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
                    <template slot="thead">
                        <vs-th sort-key="pro_codigo" style="background-color: #f7f7f7; text-align: center; font-weight: bold;">Código</vs-th>
                        <vs-th sort-key="cantidad_solicitada" style="background-color: #f7f7f7; text-align: center; font-weight: bold;">Cantidad solicitada</vs-th>
                        <vs-th sort-key="stock_disponible" style="background-color: #f7f7f7; text-align: center; font-weight: bold;">Stock disponible</vs-th>
                    </template>
                    <template slot-scope="{ data }">
                        <vs-tr :key="k" v-for="(tr, k) in data">
                            <vs-td style="text-align: center; padding: 8px; font-size: 14px;">{{ tr.codigo }}</vs-td>
                            <vs-td style="text-align: center; padding: 8px; font-size: 14px;">{{ tr.cantidad_solicitada }}</vs-td>
                            <vs-td style="text-align: center; padding: 8px; font-size: 14px;">
                                <span :style="{ color: tr.stock_disponible < tr.cantidad_solicitada ? 'red' : 'green' }">
                                    {{ tr.stock_disponible }}
                                </span>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
            <vs-alert v-else type="error" dense>¡No se encontraron productos sin stock!</vs-alert>
            <div class="flex justify-center mt-4">
                <vs-button @click="popupVisible = false" color="primary">Cerrar</vs-button>
            </div>
        </vs-popup>
        <!--modal guias remision-->

        <vs-popup title="Guias de Remision" :active.sync="popupRemision" fullscreen>
            <div v-if="popupRemision">
                <GruiasRemisionVue v-if="popupRemision" :guias_remision_rucs="datosRucCliente" :periodoSelect="periodoSelect"/>
            </div>
        </vs-popup>

        <!-- NUEVA VALIDACION DE EMPRESA-->
        <!-- Modal para seleccionar empresa -->
        <vs-popup :active.sync="showEmpresaModal" title="Configuración de Facturación Real" class="empresa-modal" @close="limpiarModalEmpresa">
            <div class="empresa-modal-content">
                <!-- Descripción del proceso -->
                <div v-if="!facturarConOtraEmpresa" class="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <div class="flex items-center">
                        <feather-icon icon="InfoIcon" class="text-blue-600 mr-3" size="20" />
                        <div>
                            <p class="text-sm text-blue-700">
                                Seleccione la empresa donde desea generar la factura real
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Selector de empresa principal -->
                <div class="form-group mb-4">
                    <label class="block text-sm font-semibold text-gray-800 mb-2">
                        <feather-icon icon="BuildingIcon" class="inline mr-2" size="16" />
                        Empresa (para manejo de Facturación Real):
                    </label>
                    <v-select
                        v-model="empresaSeleccionada"
                        :options="opcionesEmpresa"
                        placeholder="Seleccione una empresa..."
                        label="label"
                        :reduce="option => option.value"
                        class="empresa-select"
                        :class="{ 'border-red-300': !empresaSeleccionada && showValidation }"
                        :disabled="facturarConOtraEmpresa"
                    >
                        <template v-slot:option="option">
                            <div class="flex items-center">
                                <feather-icon
                                    :icon="option.value === 1 ? 'BookIcon' : 'BriefcaseIcon'"
                                    class="mr-2"
                                    :class="option.value === 1 ? 'text-blue-500' : 'text-red-500'"
                                    size="16"
                                />
                                <span>{{ option.label }}</span>
                                <span v-if="option.disabled" class="ml-2 text-xs text-gray-500">(Sin datos)</span>
                            </div>
                        </template>
                        <template v-slot:selected-option="option">
                            <div class="flex items-center">
                                <feather-icon
                                    :icon="option.value === 1 ? 'BookIcon' : 'BriefcaseIcon'"
                                    class="mr-2"
                                    :class="option.value === 1 ? 'text-blue-500' : 'text-red-500'"
                                    size="16"
                                />
                                <span class="font-medium">{{ option.label }}</span>
                            </div>
                        </template>
                    </v-select>
                    <div v-if="!empresaSeleccionada && showValidation" class="mt-1 text-sm text-red-600">
                        <feather-icon icon="AlertCircleIcon" class="inline mr-1" size="14" />
                        Por favor seleccione una empresa
                    </div>
                </div>

                <!-- Switch para facturar con otra empresa -->
                <div v-if="empresaSeleccionada" class="form-group mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
                    <div class="flex items-center mb-2">
                        <vs-switch v-model="facturarConOtraEmpresa" color="warning" @input="resetOtraEmpresa">
                            <span slot="on">SÍ</span>
                            <span slot="off">NO</span>
                        </vs-switch>
                        <label class="ml-3 text-sm font-semibold text-gray-800">
                            Facturar con otra empresa <b>(PERSEO)</b>
                        </label>
                    </div>
                    <p class="text-xs text-gray-600">
                        Activar si desea crear la factura en una empresa diferente a la seleccionada
                    </p>
                </div>

                <!-- Selector de empresa para facturación (solo si switch está activado) -->
                <div v-if="facturarConOtraEmpresa" class="form-group mt-4">
                    <label class="block text-sm font-semibold text-gray-800 mb-2">
                        <feather-icon icon="CreditCardIcon" class="inline mr-2" size="16" />
                        Empresa para crear Cruce de Facturación:
                    </label>
                    <v-select
                        v-model="empresaFacturacion"
                        :options="opcionesEmpresaFacturacion"
                        placeholder="Seleccione empresa para facturación..."
                        label="label"
                        :reduce="option => option.value"
                        class="empresa-select"
                        :class="{ 'border-red-300': !empresaFacturacion && showValidation && facturarConOtraEmpresa }"
                    >
                        <template v-slot:option="option">
                            <div class="flex items-center">
                                <feather-icon
                                    :icon="option.value === 1 ? 'BookIcon' : 'BriefcaseIcon'"
                                    class="mr-2"
                                    :class="option.value === 1 ? 'text-blue-500' : 'text-red-500'"
                                    size="16"
                                />
                                <span>{{ option.label }}</span>
                            </div>
                        </template>
                        <template v-slot:selected-option="option">
                            <div class="flex items-center">
                                <feather-icon
                                    :icon="option.value === 1 ? 'BookIcon' : 'BriefcaseIcon'"
                                    class="mr-2"
                                    :class="option.value === 1 ? 'text-blue-500' : 'text-red-500'"
                                    size="16"
                                />
                                <span class="font-medium">{{ option.label }}</span>
                            </div>
                        </template>
                    </v-select>
                </div>

                <!-- Búsqueda de cliente para otra empresa -->
                <div v-if="facturarConOtraEmpresa && empresaFacturacion" class="form-group mt-4">
                    <label class="block text-sm font-semibold text-gray-800 mb-2">
                        <feather-icon icon="SearchIcon" class="inline mr-2" size="16" />
                        Buscar Cliente en <b>(PERSEO)</b> {{ getEmpresaNombre(empresaFacturacion) }}:
                    </label>

                    <!-- Selector de tipo de búsqueda -->
                    <div class="mb-2">
                        <div class="flex" style="gap: 1rem;">
                            <vs-radio v-model="tipoBusquedaOtraEmpresa" vs-value="identificacion" color="primary">
                                CI / RUC
                            </vs-radio>
                            <vs-radio v-model="tipoBusquedaOtraEmpresa" vs-value="contenido" color="primary">
                                Nombre / Razón Social
                            </vs-radio>
                        </div>
                    </div>

                    <div class="flex">
                        <vs-input
                            v-model="busquedaClienteOtraEmpresa"
                            @keypress.enter="searchClientePerseoOtraEmpresa()"
                            @input="tipoBusquedaOtraEmpresa === 'identificacion' ? validarNumeroOtraEmpresa() : null"
                            class="w-full"
                            :placeholder="tipoBusquedaOtraEmpresa === 'identificacion'
                                ? 'Ingrese la cédula (10 dígitos) o RUC (13 dígitos) completo'
                                : 'Ingrese el nombre o razón social (mínimo 3 caracteres)'"
                        />
                        <vs-button
                            @click="searchClientePerseoOtraEmpresa()"
                            class="ml-2"
                            color="primary"
                            icon="search"
                            :loading="searchingCliente"
                            :disabled="!validarLongitudOtraEmpresa()"
                        >
                            {{ searchingCliente ? 'Buscando...' : 'Buscar' }}
                        </vs-button>
                    </div>
                    <small class="block mt-1" :style="{color: validarLongitudOtraEmpresa() ? '#6b7280' : '#ef4444'}">
                        {{ obtenerMensajeValidacionOtraEmpresa() }}
                    </small>
                </div>

                <!-- Tabla de clientes encontrados -->
                <div v-if="arrayClientesOtraEmpresa.length > 0" class="mt-4">
                    <h6 class="text-sm font-semibold text-gray-800 mb-2">Resultados de Búsqueda:</h6>
                    <vs-table
                        :data="arrayClientesOtraEmpresa"
                        max-items="5"
                        no-data-text="No se encontraron clientes"
                    >
                        <template slot="header">
                            <vs-chip color="primary">
                                Clientes encontrados: <b>{{ arrayClientesOtraEmpresa.length }}</b>
                            </vs-chip>
                        </template>
                        <template slot="thead">
                            <vs-th>Razón Social / Nombre</vs-th>
                            <vs-th>Identificación</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr v-for="(cliente, index) in data" :key="index">
                                <vs-td>
                                    <div class="flex items-center">
                                        <feather-icon
                                            icon="UserIcon"
                                            class="text-gray-500 mr-2"
                                            size="14"
                                        />
                                        {{ cliente.razonsocial }}
                                    </div>
                                </vs-td>
                                <vs-td>
                                    <span class="font-mono text-sm">{{ cliente.identificacion }}</span>
                                </vs-td>
                                <vs-td>
                                    <vs-button
                                        @click="SelectInstitucionOtraEmpresa(cliente)"
                                        color="success"
                                        type="filled"
                                        icon="check"
                                        size="small"
                                    >
                                        Seleccionar
                                    </vs-button>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>

                <!-- Mensaje cuando no hay resultados -->
                <div v-if="busquedaClienteOtraEmpresa && arrayClientesOtraEmpresa.length === 0 && searchingCliente === false && busquedaRealizada" class="mt-4 p-3" style="background-color: #fff3cd; border: 1px solid #ffecb5; border-radius: 4px;">
                    <div class="flex items-center">
                        <feather-icon icon="AlertTriangleIcon" style="color: #664d03; margin-right: 8px;" size="16" />
                        <div>
                            <p class="text-sm" style="color: #664d03;">No se encontraron resultados para la búsqueda</p>
                            <p class="text-xs mt-1" style="color: #856404;">Verifique que la identificación ingresada sea correcta</p>
                        </div>
                    </div>
                </div>

                <!-- Cliente seleccionado para otra empresa -->
                <div v-if="clienteOtraEmpresa" class="mt-4" style="padding: 8px; background-color: #f8f9fa; border: 1px solid #28a745; border-radius: 4px;">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center">
                            <feather-icon icon="UserCheckIcon" style="color: #28a745; margin-right: 6px;" size="14" />
                            <span style="color: #495057; font-weight: 500; font-size: 13px;">Cliente Confirmado:</span>
                            <span style="color: #212529; font-weight: 600; font-size: 13px; margin-left: 6px;">
                                {{ clienteOtraEmpresa.nombres }} {{ clienteOtraEmpresa.apellidos }} ({{ clienteOtraEmpresa.cedula }})
                            </span>
                        </div>
                        <vs-button
                            @click="quitarClienteOtraEmpresa()"
                            color="danger"
                            type="border"
                            size="small"
                            icon="edit"
                            style="font-size: 11px; padding: 4px 8px;"
                        >
                            Cambiar
                        </vs-button>
                    </div>
                </div>

                <!-- Resumen de configuración -->
                <div v-if="empresaSeleccionada" class="mt-6 p-4" style="background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 4px;">
                    <div class="flex items-center mb-4">
                        <feather-icon icon="FileTextIcon" style="color: #495057; margin-right: 8px;" size="20" />
                        <h4 class="text-base font-semibold" style="color: #212529;">
                            {{ facturarConOtraEmpresa ? 'Configuración final de Facturación Cruzada' : 'Datos para Factura Real' }} <b>(PERSEO)</b>
                        </h4>
                    </div>

                    <div class="space-y-3">
                        <div v-if="!facturarConOtraEmpresa" class="p-3" style="background-color: white; border: 1px solid #e9ecef; border-radius: 4px;">
                            <div class="flex items-center justify-between">
                                <div>
                                    <p class="text-xs font-medium uppercase tracking-wide" style="color: #6c757d;">Empresa de Facturación:</p>
                                    <p class="text-lg font-bold mt-1" style="color: #0d6efd;">{{ getEmpresaNombre(empresaSeleccionada) }}</p>
                                </div>
                                <vs-chip color="primary" class="ml-2">Facturación Real Normal</vs-chip>
                            </div>
                        </div>

                        <div v-else class="space-y-3">
                            <div class="p-3" style="background-color: #cff4fc; border: 1px solid #b6effb; border-radius: 4px;">
                                <p class="text-m font-medium uppercase tracking-wide mb-1" style="color: #055160;">Empresa para Operaciones:</p>
                                <p class="text-base font-bold" style="color: #0a58ca;">{{ getEmpresaNombre(empresaSeleccionada) }}</p>
                                <p class="text-m mt-1" style="color: #055160;">Maneja códigos, validaciones y procesos</p>
                            </div>

                            <div v-if="empresaFacturacion" class="p-3" style="background-color: #d1e7dd; border: 1px solid #badbcc; border-radius: 4px;">
                                <p class="text-m font-medium uppercase tracking-wide mb-1" style="color: #0f5132;">Empresa de Destino <b>(PERSEO)</b>:</p>
                                <p class="text-base font-bold" style="color: #198754;">{{ getEmpresaNombre(empresaFacturacion) }}</p>
                                <p class="text-m mt-1" style="color: #0f5132;">Donde se creará la factura real</p>
                            </div>

                            <div v-if="clienteOtraEmpresa" class="p-3" style="background-color: #cff4fc; border: 1px solid #b6effb; border-radius: 4px;">
                                <p class="text-m font-medium uppercase tracking-wide mb-1" style="color: #0a58ca;">Cliente de Destino <b>(PERSEO)</b>:</p>
                                <p class="text-base font-bold" style="color: #0a58ca;">{{ clienteOtraEmpresa.nombres }} {{ clienteOtraEmpresa.apellidos }}</p>
                                <p class="text-m mt-1" style="color: #055160;">Cliente en la empresa de destino</p>
                            </div>

                            <div class="flex justify-center">
                                <vs-chip color="danger" class="px-4 py-1">
                                    <feather-icon icon="ArrowRightIcon" class="mr-1" size="12" />
                                    Facturación Real Cruzada Activa
                                </vs-chip>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Botones de acción -->
                <div class="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-200">
                    <vs-button
                        type="border"
                        color="danger"
                        @click="cancelarSeleccionEmpresa"
                        icon-pack="feather"
                        icon="icon-x"
                    >
                        Cancelar
                    </vs-button>
                    <vs-button
                        color="success"
                        :disabled="!validarSelecciones()"
                        @click="confirmarSeleccionEmpresa"
                        icon="check"
                        :loading="isProcessing"
                    >
                        {{ isProcessing ? 'Procesando...' : 'Confirmar y Crear Factura' }}
                    </vs-button>
                </div>
            </div>
        </vs-popup>
    </div>
</div>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
import {
    metadata
} from "core-js/fn/reflect";
import flatPickr from 'vue-flatpickr-component';
const documentoVenta = () => import('@/views/pedidos2/pedidos/proforma/documentoVenta.vue');
const DatosSRINotasCredito = () => import('@/views/pedidos2/pedidos/reportes/DatosSRINotasCredito.vue');
const GruiasRemisionVue = () => import('@/views/bodega/guias_remision/guias_remision_list.vue');
const facturaVue = () => import('@/views/pedidos2/pedidos/proforma/facturaReal.vue');
const ComparativoVentasFacturas = () => import('@/views/pedidos2/pedidos/proforma/ComparativoVentasFacturas.vue');

export default {
    data() {
        return {
            showEmpresaModal: false,
            empresaSeleccionada: null,
            popupImprimir: false,
            popupImprime: false,
            popupActa: false,
            datos: [],
            id: '',
            tdo: '',
            tip: '',
            factu: [],
            activePrompt: false,
            arrayPeriodo: [],
            busqueda: {
                cedula: '',
                puntoVenta: '',
            },
            arrayInstitucion: [],
            arrayPuntoVenta: [],
            busquedaInstitucion: '',
            busquedaClienteTouched: false,
            empresaCobranza: null,
            empresaCobranzaSelected: false,
            Instituciones: [],
            InsticionCobranza: null,
            mostrarInstituciones: false,
            exiteDatos: false,
            datoNoExistente: false,
            datosClienteLocal: [],
            datosInstitucion: null,
            arrayClientePrefacturas: [],
            ObjectClientSelected: {},
            mostrarBusquedaInstitucion: false,
            ObjectInstitucionSelected:{},

            dataInstitucion: {},
            popupFR: false,
            datosFR: [],
            empresa: '',
            idempresa: '',
            ven_desc_por1: null,
            ven_desc_por_unique: [],
            tip_ven_codigo_por_unique: [],
            institucionesreporte: [],
            inputDescuento: 0,
            subtotal: 0,
            descuento: 0,
            subtotalDescuento: 0,
            iva: 0,
            transporte: 0,
            total: 0,
            descuentoVariacion: false,
            inputValid: false,
            inputValidtipo: false,
            institucionesVariacionP: false,
            institucionesVariacionC: false,
            institucionesVariacion: false,
            datosAllFR: [],
            datosAllFROriginal: [],
            fechaActual: '',
            datainstitucionunique: {
                id_institucion: '',
                nombreInstitucion: ''
            },
            SelectInstitucion: '',
            datosProlipa: '',
            datosCalmed: '',
            tabDocumentos: 'prefacturas', // Tab activo para documentos
            arrayFacturasReales: [], // Array para facturas reales (viene de la BD con campo factura_cruzada)
            popupSeleccionEmpresaCruce: false, // Popup para seleccionar empresa de cruce
            empresasDisponibles: [], // Array de empresas disponibles
            empresaCruceSeleccionada: null, // Empresa seleccionada para el cruce
            facturaEnProceso: null, // Factura que se está procesando
            // Variables para generar PDF
            factu: '',
            tdo: 0,
            op: '',
            codigo: '',
            checkBox2: false,
            checkBox666: false,
            options: [{
                    value: null,
                    label: 'Todos'
                },
                {
                    value: 'pendiente',
                    label: 'Solo Pendiente'
                },
                {
                    value: 'ordenar',
                    label: 'Ordenar Primero Pendientes'
                },
                {
                    value: 'marcadas',
                    label: 'Solo lo Seleccionado'
                }
            ],
            selectedOption: null,
            checkMarcarLLenar: false,
            isLoading: false,
            selectAll: false,
            popupPrefacturaANotas: false,
            tipoVentaVariacion: false,
            activePrompt: false,
            tipo_ven_codigo: 0,
            optionsVenta: [{
                    value: 0,
                    label: 'Seleccione tipo de venta.'
                },
                {
                    value: 1,
                    label: 'venta directa'
                },
                {
                    value: 2,
                    label: 'venta lista'
                },
            ],
            empresaVariacion: null,
            tipoVariacion: null,
            NotasIntercambio: [],
            DocumentoDetalleVenta: [],
            DocumentoVenta: [],
            popupDocumento: false,
            verNotasIntercambio: false,
            letra: '',
            validacionNovariacion: false,
            validacionSinVariacion: false,
            documentosVentas: [],
            codigosVentas: [],
            popupNotaDeCredito: false,
            selectedTab: 'saldos',
            NotasCredito: [],
            verNotasCredito: false,
            NotasCreditoClientes: [],
            verNotasCreditoClientes: false,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                onChange: this.onDateChange,
            },
            validacionNotasCredito: false,
            validacionCantNotasCredito: false,
            popupSRI: false,
            itemSeleccionado: {},
            //stock no disponible
            popupVisible: false, // Controla la visibilidad del popup
            productosNoDisponibles: [], // Aquí almacenamos los productos sin stock suficiente

            //Guias de Remision
            guias_remision_rucs:[],
            popupRemision:false,
            datosRucInstitucion:[],

            usuarioReporte:[],

            // Variables para modal de empresa
            datosProlipa: [],
            datosCalmed: [],
            showValidation: false,
            isProcessing: false,

            // Variables para facturación con otra empresa
            facturarConOtraEmpresa: false,
            empresaFacturacion: null,
            clienteOtraEmpresa: null,
            busquedaClienteOtraEmpresa: '',
            arrayClientesOtraEmpresa: [],
            tipoBusquedaOtraEmpresa: 'identificacion', // 'identificacion' o 'contenido'

            // Lista de empresas
            listaEmpresas: [],

            // Variables para mantener info de facturación cruzada
            empresaFunciones: null,
            empresaFactura: null,

            // Variables persistentes para mostrar en modal de factura real
            esFacturacionCruzada: false,
            empresaOrigenNombre: '',
            empresaFacturacionNombre: '',
            clienteFacuracionCruzada: null,

            //variable de busqueda
            busquedaRealizada: false,

            //control del select de institucion
            mostrarSelectInstitucion: true
        };
    },
    components: {
        "v-select": vSelect,
        flatPickr,
        documentoVenta,
        DatosSRINotasCredito,
        GruiasRemisionVue,
        facturaVue,
        ComparativoVentasFacturas,
    },
    mounted() {
        this.calculateTotals();
        this.obtenerFechaActual();
        this.getEmpresas();
    },
    props: {
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    computed: {
        checkedItemCount() {
            return this.datosAllFR.filter(item => item.check_real_facturar).length;
        },
        opcionesEmpresa() {
            return this.listaEmpresas.map(empresa => ({
                label: empresa.descripcion_corta,
                value: empresa.id,
                disabled: (empresa.id === 1 ? this.datosProlipa.length === 0 :
                          empresa.id === 3 ? this.datosCalmed.length === 0 : false)
            })).filter(option => !option.disabled); // Solo mostrar opciones habilitadas
        },
        opcionesEmpresaFacturacion() {
            if (!this.empresaSeleccionada) return [];

            return this.listaEmpresas.map(empresa => ({
                label: empresa.descripcion_corta,
                value: empresa.id
            })).filter(option =>
                option.value !== this.empresaSeleccionada
            );
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    watch: {
        datosAllFR: {
            handler() {
                this.calculateTotals();
            },
            deep: true
        },
        // inputDescuento: 'calculateTotals',
        inputDescuento(newValue) {
            // Limitar el valor de inputDescuento entre 0 y 100
            if (newValue < 0) {
                this.inputDescuento = 0;
            } else if (newValue > 100) {
                this.inputDescuento = 100;
            }
            // Llama a la función de cálculo de totales
            this.calculateTotals();
        },
        // Watcher para limpiar datos cuando cambia el tipo de búsqueda
        tipoBusquedaOtraEmpresa(newVal) {
            this.busquedaClienteOtraEmpresa = '';
            this.arrayClientesOtraEmpresa = [];
            this.clienteOtraEmpresa = null;
            this.busquedaRealizada = false;
        },
        // Watcher para limpiar resultados cuando se limpia el input
        busquedaClienteOtraEmpresa(newVal) {
            if (!newVal || newVal.trim() === '') {
                this.arrayClientesOtraEmpresa = [];
                this.busquedaRealizada = false;
            }
        }
    },
    methods: {
        // NUEVA FUNCION PARA CREAR FACTURA SEGUN EMPRESA SELECCIONADA
        crearFacturaEmpresa() {
            // Resetear variables como antes
            this.checkMarcarLLenar = false;
            this.checkBox2 = false;
            this.selectedOption = null;
            this.SelectInstitucion = '';
            this.datosFR = [];

            // Validación de tipo de venta y descuento
            if (this.inputValid && this.inputValidtipo) {
                // Hay variación en descuento Y en tipo de venta
                this.confirmarVariaciontipoDescuento(this.empresaSeleccionada);
            } else if (this.inputValidtipo && !this.inputValid) {
                // Solo hay variación en tipo de venta
                this.confirmarVariaciontipo(this.empresaSeleccionada);
            } else if (this.inputValid && !this.inputValidtipo) {
                // Solo hay variación en descuento
                this.confirmacionVariacion(this.empresaSeleccionada);
            } else {
                // No hay variaciones
                this.crearFacturaReal(this.empresaSeleccionada);
            }
            this.showEmpresaModal = false;
        },

        // Método para cancelar la selección de empresa
        cancelarSeleccionEmpresa() {
            this.empresaSeleccionada = null;
            this.showValidation = false;
            this.showEmpresaModal = false;
            this.facturarConOtraEmpresa = false;
            this.resetOtraEmpresa();
        },

        // Método para confirmar la selección de empresa
        confirmarSeleccionEmpresa() {
            if (!this.validarSelecciones()) {
                this.showValidation = true;
                let mensaje = 'Por favor complete todos los campos requeridos';

                if (!this.empresaSeleccionada) {
                    mensaje = 'Por favor seleccione una empresa';
                } else if (this.facturarConOtraEmpresa && !this.empresaFacturacion) {
                    mensaje = 'Por favor seleccione la empresa para facturación';
                } else if (this.facturarConOtraEmpresa && !this.clienteOtraEmpresa) {
                    mensaje = 'Por favor seleccione un cliente para la otra empresa';
                }

                this.$vs.notify({
                    color: 'danger',
                    title: 'Error',
                    text: mensaje
                });
                return;
            }

            this.isProcessing = true;
            this.showValidation = false;

            // Resetear variables como antes
            this.checkMarcarLLenar = false;
            this.checkBox2 = false;
            this.selectedOption = null;
            this.SelectInstitucion = '';
            this.datosFR = [];

            // Determinar qué empresa usar para las funciones y cuál para la facturación
            let empresaFunciones = this.empresaSeleccionada;
            let empresaFactura = this.facturarConOtraEmpresa ? this.empresaFacturacion : this.empresaSeleccionada;

            // Guardar información para mostrar en el modal de factura real
            this.empresaFunciones = empresaFunciones;
            this.empresaFactura = empresaFactura;

            // Guardar información persistente para mostrar en modal de factura real
            if (this.facturarConOtraEmpresa && this.clienteOtraEmpresa) {
                this.esFacturacionCruzada = true;
                this.empresaOrigenNombre = this.getEmpresaNombre(this.empresaSeleccionada);
                this.empresaFacturacionNombre = this.getEmpresaNombre(this.empresaFacturacion);
                this.clienteFacuracionCruzada = { ...this.clienteOtraEmpresa };
            } else {
                this.esFacturacionCruzada = false;
                this.empresaOrigenNombre = '';
                this.empresaFacturacionNombre = '';
                this.clienteFacuracionCruzada = null;
            }

            // Actualizar variables globales si es necesario
            if (this.facturarConOtraEmpresa && this.clienteOtraEmpresa) {
                // Aquí puedes actualizar los datos del cliente si es necesario
                // Por ejemplo, actualizar dataclienteunique con los datos del cliente de otra empresa
            }

            // Validación de tipo de venta y descuento
            if (this.inputValid && this.inputValidtipo) {
                // Hay variación en descuento Y en tipo de venta
                this.confirmarVariaciontipoDescuento(empresaFunciones);
            } else if (this.inputValidtipo && !this.inputValid) {
                // Solo hay variación en tipo de venta
                this.confirmarVariaciontipo(empresaFunciones);
            } else if (this.inputValid && !this.inputValidtipo) {
                // Solo hay variación en descuento
                this.confirmacionVariacion(empresaFunciones);
            } else {
                // No hay variaciones
                this.crearFacturaReal(empresaFunciones);
            }

            // Cerrar modal - NO resetear estado de facturación cruzada
            setTimeout(() => {
                this.isProcessing = false;
                this.showEmpresaModal = false;
                this.empresaSeleccionada = null;
                // No resetear facturarConOtraEmpresa ni esFacturacionCruzada aquí
                // para mantener la información durante la facturación
            }, 1000);
        },

        // Método para obtener empresas
        getEmpresas(param) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    me.listaEmpresas = res.data.filter(empresa => empresa.id != 2);
                    if (param == 1) {
                        me.showEmpresaModal = true;
                    }
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },

        // Método para obtener el nombre de la empresa
        getEmpresaNombre(value) {
            const empresa = this.listaEmpresas.find(emp => emp.id === value);
            return empresa ? empresa.descripcion_corta : 'Empresa desconocida';
        },

        // Método para resetear datos de otra empresa
        resetOtraEmpresa() {
            this.empresaFacturacion = null;
            this.clienteOtraEmpresa = null;
            this.busquedaClienteOtraEmpresa = '';
            this.arrayClientesOtraEmpresa = [];
            this.tipoBusquedaOtraEmpresa = 'identificacion';
            this.empresaFunciones = null;
            this.empresaFactura = null;
            // Limpiar información persistente solo cuando se desactiva el switch
            if (!this.facturarConOtraEmpresa) {
                this.esFacturacionCruzada = false;
                this.empresaOrigenNombre = '';
                this.empresaFacturacionNombre = '';
                this.clienteFacuracionCruzada = null;
            }
        },

        // Método específico para resetear solo el estado de facturación cruzada
        resetFacturacionCruzada() {
            this.facturarConOtraEmpresa = false;
            this.esFacturacionCruzada = false;
            this.empresaOrigenNombre = '';
            this.empresaFacturacionNombre = '';
            this.clienteFacuracionCruzada = null;
            this.empresaFacturacion = null;
            this.clienteOtraEmpresa = null;
            this.busquedaClienteOtraEmpresa = '';
            this.arrayClientesOtraEmpresa = [];
            this.tipoBusquedaOtraEmpresa = 'identificacion';
        },

        // Método para buscar clientes en Perseo para otra empresa
        searchClientePerseoOtraEmpresa() {
            let me = this;
            if (!me.empresaFacturacion) return;

            // Validar según el tipo de búsqueda
            if (!me.validarLongitudOtraEmpresa()) {
                let mensaje = '';
                if (me.tipoBusquedaOtraEmpresa === 'identificacion') {
                    mensaje = 'Debe ingresar la cédula completa (10 dígitos) o RUC completo (13 dígitos)';
                } else {
                    mensaje = 'Debe ingresar al menos 3 caracteres para buscar por nombre';
                }

                me.$vs.notify({
                    title: 'Error de Validación',
                    text: mensaje,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            me.arrayClientesOtraEmpresa = [];
            me.busquedaRealizada = true; // Marcar que se realizó una búsqueda
            let formData = new FormData();

            // Enviar el parámetro correcto según el tipo de búsqueda seleccionado
            if (me.tipoBusquedaOtraEmpresa === 'identificacion') {
                formData.append("identificacion", me.busquedaClienteOtraEmpresa);
            } else {
                formData.append("contenido", me.busquedaClienteOtraEmpresa);
            }

            formData.append("empresa", me.empresaFacturacion);

            me.$vs.loading();
            this.$http
                .post(this.$server_url + "api/perseo/clientes/clientes_consulta", formData)
                .then((res) => {
                    me.$vs.loading.close();
                    if (res.data.fault) {
                        this.$vs.notify({
                            text: res.data.fault.faultstring,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        return;
                    }
                    me.arrayClientesOtraEmpresa = res.data.clientes;
                    if (me.arrayClientesOtraEmpresa.length === 0) {
                        me.$vs.notify({
                            title: 'Sin resultados',
                            text: `No se encontraron clientes con ${me.tipoBusquedaOtraEmpresa === 'identificacion' ? 'esa identificación' : 'ese nombre'} en Perseo`,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "Error al buscar los datos en Perseo",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },

        // Método para seleccionar cliente de otra empresa
        SelectInstitucionOtraEmpresa(cliente) {
            let me = this;

            // Verificar si el cliente ya existe en el sistema
            var url = 'pedidos2/pedidos?getDatosClient=1&busqueda=' + cliente.identificacion;
            this.$http.get(this.$server_url + url)
                .then(function (res) {
                    let datos = res.data;
                    if (datos == 0) {
                        me.crearUsuarioOtraEmpresa(cliente);
                    } else {
                        me.asignarClienteOtraEmpresa(datos[0], cliente);
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al verificar el cliente',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },

        // Método para crear usuario para otra empresa
        crearUsuarioOtraEmpresa(clientePerseo) {
            let me = this;
            let completo = clientePerseo.razonsocial.trim();
            let palabras = completo.split(/\s+/);

            let nombres = '';
            let apellidos = '';

            if (palabras.length >= 3) {
                apellidos = palabras.slice(0, 2).join(' ');
                nombres = palabras.slice(2).join(' ');
            } else if (palabras.length === 2) {
                apellidos = palabras[0];
                nombres = palabras[1];
            } else if (palabras.length === 1) {
                apellidos = palabras[0];
                nombres = palabras[0];
            } else {
                apellidos = completo;
                nombres = completo;
            }

            let formData = new FormData();
            formData.append('crearUsuario', 1);
            formData.append('cedula', clientePerseo.identificacion);
            formData.append('nombres', nombres);
            formData.append('apellidos', apellidos);
            formData.append('email', clientePerseo.email || '');
            formData.append('id_grupo', 33);
            formData.append('institucion', 66);
            formData.append('user_created', me.usuario.idusuario);
            formData.append('telefono', 0);

            me.$vs.loading();
            this.$http.post(this.$server_url + 'pedidos2/pedidos', formData)
                .then(res => {
                    me.$vs.loading.close();
                    me.asignarClienteOtraEmpresa(res.data[0], clientePerseo);
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al crear el usuario',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },

        // Método para asignar cliente de otra empresa
        asignarClienteOtraEmpresa(usuarioSistema, clientePerseo) {
            // Si el usuario ya existe en el sistema, usar esos datos
            let nombres = usuarioSistema.nombres || '';
            let apellidos = usuarioSistema.apellidos || '';

            // Si no hay nombres/apellidos en el sistema, usar razón social de Perseo
            if (!nombres && !apellidos && clientePerseo.razonsocial) {
                let completo = clientePerseo.razonsocial.trim();
                let palabras = completo.split(/\s+/);

                if (palabras.length >= 3) {
                    apellidos = palabras.slice(0, 2).join(' ');
                    nombres = palabras.slice(2).join(' ');
                } else if (palabras.length === 2) {
                    apellidos = palabras[0];
                    nombres = palabras[1];
                } else if (palabras.length === 1) {
                    nombres = palabras[0];
                    apellidos = '';
                } else {
                    nombres = completo;
                    apellidos = '';
                }
            }

            this.clienteOtraEmpresa = {
                idusuario: usuarioSistema.idusuario,
                nombres: nombres,
                apellidos: apellidos,
                cedula: usuarioSistema.cedula,
                email: usuarioSistema.email,
                clientesidPerseo: clientePerseo.clientesid
            };
            this.arrayClientesOtraEmpresa = [];
            this.busquedaClienteOtraEmpresa = '';
        },

        // Método para validar números (solo para identificación)
        validarNumeroOtraEmpresa() {
            if (this.tipoBusquedaOtraEmpresa === 'identificacion') {
                this.busquedaClienteOtraEmpresa = this.busquedaClienteOtraEmpresa.replace(/\D/g, '');
                if (this.busquedaClienteOtraEmpresa.length > 13) {
                    this.busquedaClienteOtraEmpresa = this.busquedaClienteOtraEmpresa.slice(0, 13);
                }
            }
        },

        // Método para validar longitud según tipo de búsqueda
        validarLongitudOtraEmpresa() {
            if (this.tipoBusquedaOtraEmpresa === 'identificacion') {
                const longitud = this.busquedaClienteOtraEmpresa.length;
                return longitud >= 10 && longitud <= 13;
            } else {
                return this.busquedaClienteOtraEmpresa.length >= 3;
            }
        },

        // Método para obtener mensaje de validación dinámico
        obtenerMensajeValidacionOtraEmpresa() {
            if (this.tipoBusquedaOtraEmpresa === 'identificacion') {
                const longitud = this.busquedaClienteOtraEmpresa.length;
                if (longitud === 0) {
                    return 'Ingrese la cédula (10 dígitos) o RUC (13 dígitos) completo';
                } else if (longitud < 10) {
                    return `Faltan ${10 - longitud} dígito(s). Cédula: 10 dígitos, RUC: 13 dígitos`;
                } else if (longitud === 10) {
                    return '✓ Cédula completa (10 dígitos) - Puede buscar';
                } else if (longitud > 10 && longitud < 13) {
                    return `Faltan ${13 - longitud} dígito(s) para RUC completo`;
                } else if (longitud === 13) {
                    return '✓ RUC completo (13 dígitos) - Puede buscar';
                }
            } else {
                const longitud = this.busquedaClienteOtraEmpresa.length;
                if (longitud === 0) {
                    return 'Ingrese el nombre o razón social del cliente';
                } else if (longitud < 3) {
                    return `Faltan ${3 - longitud} caracter(es). Mínimo 3 caracteres requeridos`;
                } else {
                    return `✓ ${longitud} caracteres - Puede buscar`;
                }
            }
            return '';
        },

        // Método para quitar cliente de otra empresa
        quitarClienteOtraEmpresa() {
            this.clienteOtraEmpresa = null;
        },

        // Método para validar selecciones
        validarSelecciones() {
            if (!this.empresaSeleccionada) return false;

            if (this.facturarConOtraEmpresa) {
                return this.empresaFacturacion && this.clienteOtraEmpresa;
            }

            return true;
        },
        limpiarModalEmpresa() {
            // Limpiar selecciones de empresa
            this.empresaSeleccionada = null;
            this.empresaFacturacion = null;
            this.facturarConOtraEmpresa = false;

            // Limpiar búsqueda y resultados de cliente
            this.busquedaClienteOtraEmpresa = '';
            this.arrayClientesOtraEmpresa = [];
            this.clienteOtraEmpresa = null;
            this.searchingCliente = false;
            this.busquedaRealizada = false;
            this.tipoBusquedaOtraEmpresa = 'identificacion';

            // Limpiar validaciones
            this.showValidation = false;
            this.isProcessing = false;
        },
        //FIN NUEVA FUNCION PARA CREAR FACTURA SEGUN EMPRESA SELECCIONADA
        //GUIAS REMISION
        entrarGruias(ruc){
            let me = this
            me.guias_remision_rucs = ruc
            me.popupRemision = true
        },
        handleCloseAbono() {
            let me = this;
            me.popupPrefacturaANotas = true;
            me.$vs.notify({
                color: 'danger',
                title: 'Mensaje',
                text: 'No puede salir hasta que se complete la convercion del documento.',
            })
        },
        onDateChange(selectedDates, dateStr, instance) {
            instance.close();
        },
        acceptAlert() {
            let me = this;
            if (me.tipo_ven_codigo == 0) {
                me.activePrompt = true;
                me.$vs.notify({
                    color: 'danger',
                    title: 'Mensaje',
                    text: 'Debe seleccionar el tipo de venta.'
                })
                return
            } else {
                me.crearFacturaReal(me.empresaVariacion, me.tipoVariacion);
                me.tipoVentaVariacion = true;
            }
        },
        close() {
            this.$vs.notify({
                color: 'danger',
                title: 'Mensaje',
                text: 'Has cancelado el cambio saldos a notas!'
            })
        },
        toggleAll() {
            this.datosAllFR.forEach(tr => {
                if (!tr.check_cantidades) {
                    tr.check_real_facturar = this.selectAll;
                }
            });
        },
        ValidarNotas() {
            this.datosAllFR.forEach(tr => {
                if (!tr.check_real_facturar) {
                    tr.check_real_facturar = true;
                }
            });
        },
        applyFilters() {
            let filteredData = [...this.datosAllFROriginal];

            if (this.selectedOption === 'pendiente') {
                filteredData = filteredData.filter(item => !item.check_cantidades);
                if (filteredData.length == 0) {
                    this.$vs.notify({
                        title: 'Error',
                        text: 'No tiene cantidades Pendientes.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                }
            } else if (this.selectedOption === 'ordenar') {
                filteredData.sort((a, b) => {
                    return (a.check_cantidades === b.check_cantidades) ? 0 : (a.check_cantidades ? 1 : -1);
                });
            } else if (this.selectedOption === 'marcadas') {
                filteredData = filteredData.filter(item => item.check_real_facturar);
                if (filteredData.length == 0) {
                    this.$vs.notify({
                        title: 'Error',
                        text: 'No tiene cantidades seleccionadas.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                }
            }

            this.datosAllFR = filteredData;
        },
        cambioItems() {
            if (this.checkBox666) {
                this.datosAllFR = this.datosAllFR.filter(item => !item.check_cantidades);
            } else {
                this.datosAllFR = [...this.datosAllFROriginal];
            }
        },
        quitarvalidacion() {
            let me = this;

            // Calcular la cantidad real a facturar
            me.datosAllFR.forEach(item => {
                const cantidadRealFacturar = Math.max(0, (item.det_ven_cantidad - item.det_ven_dev) - (item.cantidad_facturada - item.cantidad_nota_credito));
                item.cantidad_real_facturar = cantidadRealFacturar;
                item.check_cantidades = cantidadRealFacturar === 0;
            });

            // Actualizar check_cantidades según el estado de checkBox2
            if (this.checkBox2) {
                me.datosAllFR.forEach(item => {
                    if (item.check_cantidades) {
                        item.check_cantidades = false;
                    }
                });
            } else {
                me.datosAllFR.forEach(item => {
                    item.check_cantidades = item.cantidad_real_facturar === 0;
                });
            }
        },
        validateInput(tr) {
            // Convertir a número
            const value = parseFloat(tr.cantidad_real_facturar);
            const max = Math.max(0, (tr.det_ven_cantidad - tr.det_ven_dev) - (tr.cantidad_facturada - tr.cantidad_nota_credito));
            if (!this.checkBox2) {
                // Asegúrate de que el valor sea un número
                if (isNaN(value) || value <= 0) {
                    tr.cantidad_real_facturar = 0; // Ajustar a 0 si es negativo o NaN
                    if (this.checkMarcarLLenar == true) {
                        tr.check_real_facturar = false;
                    }
                } else if (value > max) {
                    tr.cantidad_real_facturar = max; // Ajustar al máximo si se excede
                    this.$vs.notify({
                        title: 'Error',
                        text: 'No puede ingresar más, ya que no tiene suficiente cantidad disponible para facturar.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return;
                } else {
                    // Aquí simplemente se asegura que `value` sea un número
                    tr.cantidad_real_facturar = value; // Guarda como número
                    if (this.checkMarcarLLenar == true) {
                        tr.check_real_facturar = true;
                    }
                }
            }

        },
        validateInputNota(tr) {
            // Convertir a número
            const value = parseFloat(tr.cantidad_real_facturar);
            const max = Math.abs((tr.det_ven_cantidad - tr.det_ven_dev) - (tr.cantidad_facturada - tr.cantidad_nota_credito));
            if (!this.checkBox2) {
                // Asegúrate de que el valor sea un número
                if (isNaN(value) || value <= 0) {
                    tr.cantidad_real_facturar = 0; // Ajustar a 0 si es negativo o NaN
                    if (this.checkMarcarLLenar == true) {
                        tr.check_real_facturar = false;
                    }
                } else if (value > max) {
                    tr.cantidad_real_facturar = max; // Ajustar al máximo si se excede
                    this.$vs.notify({
                        title: 'Error',
                        text: 'No puede ingresar más, ya que no tiene suficiente cantidad disponible para facturar.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return;
                } else {
                    // Aquí simplemente se asegura que `value` sea un número
                    tr.cantidad_real_facturar = value; // Guarda como número
                    if (this.checkMarcarLLenar == true) {
                        tr.check_real_facturar = true;
                    }
                }
            }

        },
        getcod(a, callback, tipoVariacion) {
            let me = this;
            let letraEmpresa, url, codigoVenta;

            // Determinar la letra de la empresa
            if (a === 1) {
                letraEmpresa = 'P';
            } else if (a === 3) {
                letraEmpresa = 'C';
            } else if (a === 4) {
                letraEmpresa = 'GC26';
            } else if (a === 5) {
                letraEmpresa = 'P26';
            } else {
                letraEmpresa = '';
            }

            // console.log('no variacion', me.validacionNovariacion);
            // console.log('sin variacion', me.validacionSinVariacion);
            // console.log('tipoVariacion', tipoVariacion);
            // console.log('me.tipoVariacion', me.tipoVariacion);

            // Determinar la URL según tipo de variación
            if (tipoVariacion == 1 && !me.validacionSinVariacion) {
                if (me.tipo_ven_codigo == 1) {
                    url = 'Get_CodVenta?letra=AI&id=' + a;
                } else if (me.tipo_ven_codigo == 2) {
                    url = 'Get_CodVenta?letra=BC&id=' + a;
                }
            } else if (!tipoVariacion && !me.validacionSinVariacion) {
                if (me.tipo_ven_codigo == 1) {
                    url = 'Get_CodVenta?letra=AI&id=' + a;
                } else if (me.tipo_ven_codigo == 2) {
                    url = 'Get_CodVenta?letra=BC&id=' + a;
                }
            }
            if (tipoVariacion == 1 && me.validacionSinVariacion) {
                if (me.tipo_ven_codigo == 1) {
                    url = 'Get_CodVenta?letra=AI&id=' + a;
                } else if (me.tipo_ven_codigo == 2) {
                    url = 'Get_CodVenta?letra=BC&id=' + a;
                }
            }

            // Realizar la solicitud HTTP
            this.$http.get(this.$server_url + url)
                .then(response => {
                    const datos = response.data;

                    // Verificar si hay datos suficientes
                    if (datos.length < 2) {
                        callback(null); // Devolver null si los datos no son suficientes
                        return;
                    }

                    const codigoBase = datos[0];
                    const numeroBase = datos[1]; // Asegurar que sea un número
                    const numeroSecuencial = parseInt(datos[1]); // Asegurar que sea un número

                    // Determinar el prefijo del tipo de venta
                    let prefijoVenta = '';
                    if (me.tipo_ven_codigo === 1) {
                        prefijoVenta = 'AI';
                    } else if (me.tipo_ven_codigo === 2) {
                        prefijoVenta = 'BC';
                    }

                    // Generar el código base con los componentes
                    let codigoBaseComponente = `${codigoBase}-${letraEmpresa}-${this.periodoSelect.codigo_contrato}-${this.usuario.iniciales}-${numeroBase}`;

                    // Generar el código de venta según tipo de variación
                    if (tipoVariacion === 1) {
                        // Si hay variación, se asigna el prefijo 'N-'
                        codigoVenta = `N-${letraEmpresa}-${this.periodoSelect.codigo_contrato}-${this.usuario.iniciales}-${prefijoVenta}${numeroSecuencial}`;
                    } else {
                        // Si no hay variación, se utiliza el código base sin el prefijo 'N-'
                        codigoVenta = codigoBaseComponente;
                    }

                    // Llamar al callback con el código de venta
                    callback(codigoVenta);
                })
                .catch(error => {
                    console.error("Error al obtener el código de venta:", error);
                    callback(null); // Manejar el error devolviendo null
                });
        },
        getcodFR(a, callback, tipoVariacion) {
            let me = this;
            let letraEmpresa, url, codigoVenta;

            // Determinar la letra de la empresa
            if (a === 1) {
                letraEmpresa = 'P';
            } else if (a === 3) {
                letraEmpresa = 'C';
            } else if (a === 4) {
                letraEmpresa = 'GC26';
            } else if (a === 5) {
                letraEmpresa = 'P26';
            } else {
                letraEmpresa = '';
            }
            if (tipoVariacion === 1 || tipoVariacion === 2) {
                return;
            }

            if (!me.tipoVariacion && me.validacionNovariacion && !me.validacionSinVariacion) {
                console.log("validacionNovariacion  001")
                url = 'Get_CodVenta?letra=FR&id=' + a;
            }
            if (!me.tipoVariacion && !me.validacionNovariacion && me.validacionSinVariacion) {
                console.log("validacionSinVariacion  002")
                url = 'Get_CodVenta?letra=FR&id=' + a;
            }

            if (tipoVariacion && me.validacionNovariacion && !me.validacionSinVariacion) {
                console.log("tipoVariacion  003")
                url = 'Get_CodVenta?letra=FR&id=' + a;
            }
            if (tipoVariacion && !me.validacionNovariacion && me.validacionSinVariacion) {
                console.log("validacionSinVariacion  004")
                url = 'Get_CodVenta?letra=FR&id=' + a;
            }

            // Realizar la solicitud HTTP
            this.$http.get(this.$server_url + url)
                .then(response => {
                    const datos = response.data;

                    // Verificar si hay datos suficientes
                    if (datos.length < 2) {
                        callback(null); // Devolver null si los datos no son suficientes
                        return;
                    }

                    const codigoBase = datos[0];
                    const numeroBase = datos[1]; // Asegurar que sea un número
                    const numeroSecuencial = parseInt(datos[1]); // Asegurar que sea un número

                    // Generar el código base con los componentes
                    let codigoBaseComponente = `${codigoBase}-${letraEmpresa}-${this.periodoSelect.codigo_contrato}-${this.usuario.iniciales}-${numeroBase}`;

                    codigoVenta = codigoBaseComponente;

                    // Llamar al callback con el código de venta
                    callback(codigoVenta);
                })
                .catch(error => {
                    console.error("Error al obtener el código de venta:", error);
                    callback(null); // Manejar el error devolviendo null
                });
        },
        getcodNC(a, callback, tipoVariacion) {
            let me = this;
            let letraEmpresa, url, codigoVenta;

            // Determinar la letra de la empresa
            if (a === 1) {
                letraEmpresa = 'P';
            } else if (a === 3) {
                letraEmpresa = 'C';
            } else if (a === 4) {
                letraEmpresa = 'GC26';
            } else if (a === 5) {
                letraEmpresa = 'P26';
            } else {
                letraEmpresa = '';
            }

            if (!me.tipoVariacion && me.validacionNovariacion && !me.validacionSinVariacion) {
                console.log("validacionNovariacion  001")
                url = 'Get_CodVenta?letra=NC&id=' + a;
            }
            if (!me.tipoVariacion && !me.validacionNovariacion && me.validacionSinVariacion) {
                console.log("validacionSinVariacion  002")
                url = 'Get_CodVenta?letra=NC&id=' + a;
            }

            if (tipoVariacion && me.validacionNovariacion && !me.validacionSinVariacion) {
                console.log("tipoVariacion  003")
                url = 'Get_CodVenta?letra=NC&id=' + a;
            }
            if (tipoVariacion && !me.validacionNovariacion && me.validacionSinVariacion) {
                console.log("validacionSinVariacion  004")
                url = 'Get_CodVenta?letra=NC&id=' + a;
            }

            // Realizar la solicitud HTTP
            this.$http.get(this.$server_url + url)
                .then(response => {
                    const datos = response.data;

                    // Verificar si hay datos suficientes
                    if (datos.length < 2) {
                        callback(null); // Devolver null si los datos no son suficientes
                        return;
                    }

                    const codigoBase = datos[0];
                    const numeroBase = datos[1]; // Asegurar que sea un número
                    const numeroSecuencial = parseInt(datos[1]); // Asegurar que sea un número

                    // Determinar el prefijo del tipo de venta
                    let prefijoVenta = '';
                    if (me.tipo_ven_codigo === 1) {
                        prefijoVenta = 'AI';
                    } else if (me.tipo_ven_codigo === 2) {
                        prefijoVenta = 'BC';
                    }

                    // Generar el código base con los componentes
                    let codigoBaseComponente = `${codigoBase}-${letraEmpresa}-${this.periodoSelect.codigo_contrato}-${this.usuario.iniciales}-${numeroBase}`;

                    // Generar el código de venta según tipo de variación
                    codigoVenta = codigoBaseComponente;

                    // Llamar al callback con el código de venta
                    callback(codigoVenta);
                })
                .catch(error => {
                    console.error("Error al obtener el código de venta:", error);
                    callback(null); // Manejar el error devolviendo null
                });
        },
        guardarDatos() {
            let me = this;
            this.isLoading = true;
            // Validaciones
            if (!this.ObjectClientSelected.nombres) {
                this.isLoading = false;
                this.$vs.notify({
                    title: 'Error',
                    text: 'La cliente es requerido.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            // if (!this.datainstitucionunique || !this.datainstitucionunique.nombreInstitucion) {
            //     this.isLoading = false;
            //     this.$vs.notify({
            //         title: 'Error',
            //         text: 'La institución o punto de despacho es requerido.',
            //         color: 'danger',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-circle'
            //     });
            //     return;
            // }

            if (!this.institucionesreporte) {
                this.isLoading = false;
                this.$vs.notify({
                    title: 'Error',
                    text: 'La institución o punto de despacho es requerido.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            const itemsSeleccionados = this.datosAllFR.filter(item => item.check_real_facturar);

            if (itemsSeleccionados.length === 0) {
                this.isLoading = false;
                this.$vs.notify({
                    title: 'Error',
                    text: 'Debe seleccionar al menos un ítem.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            // Verificar si hay cantidades en 0
            const itemsConCantidadCero = itemsSeleccionados.filter(item => item.cantidad_real_facturar == 0);
            if (itemsConCantidadCero.length > 0) {
                this.isLoading = false;
                this.$vs.notify({
                    title: 'Advertencia',
                    text: 'Hay ítems seleccionados con cantidad en 0.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            if (me.descuentoVariacion && !me.inputDescuento) {
                this.isLoading = false;
                this.$vs.notify({
                    title: 'Error',
                    text: 'Debes ingresar el descuento.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            let instituciones = this.institucionesreporte;
            let ids = instituciones.map(i => i.idInstitucion).join(',');

            const datosParaGuardar = {
                institucion: ids,
                cliente: this.dataclienteunique,
                items: itemsSeleccionados,
                subtotal: this.subtotal.toFixed(2),
                descuento_porcentaje: this.inputDescuento ? this.inputDescuento : this.ven_desc_por_unique[0],
                descuento: this.descuento.toFixed(2),
                subtotalDescuento: this.subtotalDescuento.toFixed(2),
                iva: this.iva.toFixed(2),
                transporte: this.transporte.toFixed(2),
                total: this.total.toFixed(2),
            };

            let formData = new FormData();
            formData.append("data_detalle", JSON.stringify(datosParaGuardar.items));
            formData.append("ven_codigo", me.codigo);
            // Usar empresa de facturación si hay facturación cruzada
            formData.append("id_empresa", me.esFacturacionCruzada && me.empresaFactura ? me.empresaFactura : me.idempresa);
            formData.append("ven_desc_por", datosParaGuardar.descuento_porcentaje);
            formData.append("ven_iva_por", 0);
            formData.append("ven_descuento", datosParaGuardar.descuento);
            formData.append("ven_iva", datosParaGuardar.iva);
            formData.append("ven_transporte", datosParaGuardar.transporte);
            formData.append("ven_valor", datosParaGuardar.total);
            formData.append("ven_subtotal", datosParaGuardar.subtotal);
            formData.append("id_ins_depacho", datosParaGuardar.institucion);
            formData.append("periodo_id", me.periodoSelect.idperiodoescolar);
            // Usar cliente de otra empresa si hay facturación cruzada
            if (me.esFacturacionCruzada && me.clienteFacuracionCruzada) {
                formData.append("ven_cliente", me.clienteFacuracionCruzada.idusuario);
                formData.append("clientesidPerseo", me.clienteFacuracionCruzada.clientesidPerseo);
            } else {
                formData.append("ven_cliente", datosParaGuardar.cliente.id_usuario);
                formData.append("clientesidPerseo", datosParaGuardar.cliente.clientesidPerseo);
            }
            formData.append("ven_fecha", me.fechaActual);
            formData.append("user_created", me.usuario.idusuario);
            formData.append("tip_ven_codigo", me.tipo_ven_codigo); // Agregar tipo de venta

            // Agregar campos de facturación cruzada si aplica
            if (me.esFacturacionCruzada && me.empresaFactura) {
                formData.append("factura_cruzada", 1);
                formData.append("empresa_cruzada", me.empresaFunciones); // La empresa original (de donde vienen las prefacturas)
            } else {
                formData.append("factura_cruzada", 0);
                formData.append("empresa_cruzada", null);
            }

            // formData.append("data_ventas", JSON.stringify(me.perseo));

            // console.log('Datos a guardar:', datosParaGuardar);
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
            // Aquí puedes realizar una llamada a tu API para guardar los datos
            this.$http.post(this.$server_url + "PostFacturarReal", formData)
                .then(response => {
                    // Manejar la respuesta de éxito
                    this.$vs.notify({
                        title: 'Éxito',
                        text: 'Datos guardados correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });

                    // Resetear estado de facturación cruzada después del éxito
                    this.resetFacturacionCruzada();
                    this.getAllFacturadoReal(this.ObjectClientSelected);
                    this.popupFR = false; // Cierra el popup
                })
                .catch(error => {
                    // Manejar el error
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Error al guardar los datos.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    console.error('Error al guardar datos:', error);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        },
        validarSeleccionInstitucion() {
            let me = this;
            console.log('dato institucion selecionado',this.SelectInstitucion)
            if (!this.SelectInstitucion) {
                me.$vs.notify({
                    title: 'Sin datos',
                    text: 'No se logro marcar la seleccion de la institución.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
            } else {
                me.datainstitucionunique.id_institucion = me.SelectInstitucion.idInstitucion;
                me.datainstitucionunique.nombreInstitucion = me.SelectInstitucion.nombreInstitucion;
                me.mostrarSelectInstitucion = false;
            }
        },
        cambiarInstitucion() {
            // Limpiar la selección actual
            this.SelectInstitucion = '';
            this.datainstitucionunique = {
                id_institucion: '',
                nombreInstitucion: '',
                ruc_institucion: '',
                puntoDespacho: '',
            };
        },
        realizarBusqueda() {
            // Limpiar datos anteriores
            this.datoNoExistente = false;
            this.exiteDatos = false;
            this.busquedaCliente = '';
            this.arrayPuntoVenta = [];

            // Realizar búsqueda
            this.searchData(0);
        },
        expandirInstitucion(institucion) {
            // Toggle del estado expandido
            this.$set(institucion, 'expanded', !institucion.expanded);
        },
        seleccionarCliente(cliente, institucion) {
            // Asignar cliente seleccionado
            this.ObjectClientSelected = {
                ...cliente,
                nombreInstitucion: institucion.nombreInstitucion
            };

            // Limpiar arrays y búsquedas
            this.arrayCliente = [];
            this.busqueda.cedula = '';

            // Obtener prefacturas del cliente
            this.getAllPrefacturas(cliente);

            //Obtener facturado real
            this.getAllFacturadoReal(cliente);

            // Limpiar resultados de búsqueda
            this.arrayPuntoVenta = [];
            this.busqueda.puntoVenta = '';
        },
        getAllFacturadoReal(cliente){
            let me = this;
            console.log('BUSQUEDA DE FACTURADO REAL',cliente);
            me.$vs.loading();
            this.$http.get(this.$server_url + `get_facturaRealxParametro?periodo=${me.periodoSelect.idperiodoescolar}&cliente=${cliente.cedula}`)
                .then((result) => {
                    me.$vs.loading.close();
                    if (result.data) {
                        me.arrayFacturasReales = result.data;
                    }
                })
                .catch((err) => {
                    me.$vs.loading.close();
                    console.log(err);
                });
        },

        buscarOtroCliente() {
            // Reinicia todos los datos al estado original
            Object.assign(this.$data, this.$options.data.call(this))

            // // Limpiar completamente todo
            // this.ObjectClientSelected = {};
            // this.arrayCliente = [];
            // this.arrayPuntoVenta = [];
            // this.busqueda = {
            //     puntoVenta: '',
            //     cedula: ''
            // };
            // this.datoNoExistente = false;
            // this.exiteDatos = false;
            // this.busquedaCliente = '';

            // // Limpiar datos de prefacturas
            // this.datosProlipa = [];
            // this.datosCalmed = [];
            // this.datosAllFR = [];
            // this.datosAllFROriginal = [];

            // // Resetear validaciones
            // this.institucionesVariacion = false;
            // this.institucionesVariacionP = false;
            // this.institucionesVariacionC = false;

            // // Resetear datos de institución
            // this.datainstitucionunique = {
            //     id_institucion: '',
            //     nombreInstitucion: '',
            //     ruc_institucion: '',
            //     puntoDespacho: '',
            // };

            // this.SelectInstitucion = '';
            // this.institucionesreporte = [];

            // this.arrayClientePrefacturas = []
        },
        obtenerFechaActual() {
            const fecha = new Date();
            const anio = fecha.getFullYear();
            const mes = String(fecha.getMonth() + 1).padStart(2, '0');
            const dia = String(fecha.getDate()).padStart(2, '0');
            this.fechaActual = `${anio}-${mes}-${dia}`;
        },
        calculateTotals() {
            // Función de redondeo comercial mejorada para aplicaciones financieras
            const redondeoComercial = (num, decimales = 2) => {
                if (isNaN(num)) return 0;
                const factor = Math.pow(10, decimales);
                // Para valores financieros, redondear .5 hacia arriba siempre
                // Agregar una pequeña cantidad para forzar redondeo hacia arriba en casos .5
                const adjusted = num * factor;
                const decimalPart = adjusted - Math.floor(adjusted);

                // Si el decimal es exactamente .5 (con tolerancia para errores de punto flotante)
                if (Math.abs(decimalPart - 0.5) < 0.0000001) {
                    return Math.ceil(adjusted) / factor;
                } else {
                    return Math.round((num + Number.EPSILON) * factor) / factor;
                }
            };

            // Inicializa subtotal y otros valores
            this.subtotal = 0;
            this.descuento = 0;
            this.subtotalDescuento = 0;
            this.total = 0;

            // Calcula subtotal solo para los items seleccionados (sin redondear aún)
            const subtotalItems = this.datosAllFR.reduce((sum, tr) => {
                if (tr.check_real_facturar) { // Solo suma si el checkbox está marcado
                    return sum + ((tr.det_ven_valor_u || 0) * (tr.cantidad_real_facturar || 0));
                }
                return sum;
            }, 0);

            // Calcula descuento porcentaje
            let descuentoPorcentaje = 0;
            if (this.descuentoVariacion) {
                descuentoPorcentaje = this.inputDescuento > 0 ? this.inputDescuento : 0;
            } else {
                descuentoPorcentaje = this.ven_desc_por_unique[0] || 0;
            }

            // Calcular descuento sin redondear aún (usar subtotal sin redondear para mejor precisión)
            const descuentoCalculado = (subtotalItems * descuentoPorcentaje / 100);

            // Calcular subtotal después del descuento SIN redondeos intermedios
            const subtotalDescuentoCalculado = subtotalItems - descuentoCalculado;

            // Ahora aplicar redondeo comercial a los valores finales
            this.subtotal = redondeoComercial(subtotalItems);
            this.descuento = redondeoComercial(descuentoCalculado);
            this.subtotalDescuento = redondeoComercial(subtotalDescuentoCalculado);

            console.log('Debug detallado:');
            console.log('- Subtotal sin redondear:', subtotalItems);
            console.log('- Porcentaje descuento:', descuentoPorcentaje);
            console.log('- Descuento sin redondear:', descuentoCalculado);
            console.log('- Subtotal-Descuento sin redondear:', subtotalDescuentoCalculado);
            console.log('- Subtotal final:', this.subtotal);
            console.log('- Descuento final:', this.descuento);
            console.log('- Subtotal-Descuento final:', this.subtotalDescuento);

            // IVA y transporte
            this.iva = 0;
            this.transporte = 0;

            // Total
            this.total = this.subtotalDescuento;
        },
        confirmarVariaciontipo(empresa, tipo) {
            let me = this;
            me.empresaVariacion = null;
            me.tipoVariacion = null;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmación',
                text: '¿Está seguro de variar el tipo de venta?',
                accept: function () {
                    me.tipo_ven_codigo = 0;
                    me.empresaVariacion = empresa;
                    me.tipoVariacion = tipo;
                    me.activePrompt = true;
                    // me.crearFacturaReal(empresa,tipo);
                    // me.tipoVentaVariacion = true;
                },
                reject: function () {
                    console.log('Confirmación rechazada');
                }
            });
        },

        confirmarVariaciontipoDescuento(empresa, tipo) {
            let me = this;
            me.empresaVariacion = null;
            me.tipoVariacion = null;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmación',
                text: '¿Está seguro de variar el descuento y el tipo de venta?',
                accept: function () {
                    // me.crearFacturaReal(empresa,tipo);
                    me.tipo_ven_codigo = 0;
                    me.empresaVariacion = empresa;
                    me.tipoVariacion = tipo;
                    me.descuentoVariacion = true;
                    me.tipoVentaVariacion = true;
                    me.activePrompt = true;

                },
                reject: function () {
                    console.log('Confirmación rechazada');
                }
            });
        },
        confirmacionVariacion(empresa, tipo) {
            let me = this;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmación',
                text: '¿Está seguro de variar el descuento en el reporte?',
                accept: function () {
                    me.crearFacturaReal(empresa, tipo);
                    me.descuentoVariacion = true;
                },
                reject: function () {
                    console.log('Confirmación rechazada');
                }
            });
        },
        crearFacturaReal(empresa, tipo) {
            console.log("empresa", empresa, "tipo", tipo);
            let me = this;
            me.datosFR = [];
            me.idempresa = '';
            me.empresa = '';
            me.codigo = '';
            me.institucionesreporte = [];
            const clientesSet = new Map(); // Usar un Map para clientes únicos
            const institucionesSet = new Map(); // Usar un Map para clientes únicos

            this.obtenerFechaActual();

            if (empresa == 1 || empresa == 6) {
                me.datosFR = me.arrayClientePrefacturas.filter(f => f.id_empresa == empresa);
                me.idempresa = me.datosFR[0].id_empresa;
                me.empresa = me.datosFR[0].descripcion_corta;
                console.log('datos creacion',me.datosProlipa)
                me.datosProlipa.forEach(prefactura => {
                    // Extraer instituciones únicas
                    if (prefactura.institucion_id !== undefined && prefactura.clienteInstitucion !== undefined) {
                        const institucionInfo = {
                            idInstitucion: prefactura.institucion_id,
                            nombreInstitucion: prefactura.clienteInstitucion,
                        };
                        // Agregar como clave en el Map para mantener la unicidad
                        institucionesSet.set(prefactura.institucion_id, institucionInfo);
                    }
                    // Extraer clientes únicos
                    if (prefactura.ven_cliente !== undefined && prefactura.ruc_cliente !== undefined && prefactura.clienteUsuario !== undefined && prefactura.clientesidPerseo !== undefined) {
                            const clienteInfo = {
                                ven_cliente: prefactura.ven_cliente,
                                ruc_cliente: prefactura.ruc_cliente,
                                clienteUsuario: prefactura.clienteUsuario,
                                clientesidPerseo: prefactura.clientesidPerseo,
                            };
                            // Agregar como clave en el Map para mantener la unicidad
                            clientesSet.set(clienteInfo.ruc_cliente, clienteInfo);
                        }

                });

                // Convertir el Map a un array
                me.usuarioReporte = Array.from(clientesSet.values());

                if (me.usuarioReporte.length === 1) {
                    me.dataclienteunique = {
                        id_usuario: me.usuarioReporte[0].ven_cliente,
                        nombreCliente: me.usuarioReporte[0].clienteUsuario,
                        ruc_cliente: me.usuarioReporte[0].ruc_cliente,
                        clientesidPerseo: me.usuarioReporte[0].clientesidPerseo,
                    };
                }

                // Convertir el Map a un array
                me.institucionesreporte = Array.from(institucionesSet.values());
console.log('datos unicos', me.institucionesreporte)
                // Manejo de institución única
                if (me.institucionesreporte.length === 1) {
                    me.datainstitucionunique = {
                        id_institucion: me.institucionesreporte[0].idInstitucion,
                        nombreInstitucion: me.institucionesreporte[0].nombreInstitucion,
                    };
                }

                me.institucionesVariacionP = clientesSet.size > 1;
                me.institucionesVariacion = me.institucionesVariacionP;
                if (tipo === 1) {
                    me.getcod(empresa, (codigoVenta) => {
                        if (codigoVenta) {
                            me.codigo = codigoVenta;
                            console.log("Código de venta asignado:", me.codigo);
                        } else {
                            console.log("No se pudo obtener el código de venta.");
                            this.$vs.notify({
                                title: 'Error',
                                text: 'No se pudo obtener el código de venta.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                            return;
                        }
                    }, tipo);
                }
                if (tipo === 2) {
                    me.getcodNC(empresa, (codigoVenta) => {
                        if (codigoVenta) {
                            me.codigo = codigoVenta;
                            console.log("Código de venta asignado:", me.codigo);
                        } else {
                            console.log("No se pudo obtener el código de venta.");
                            this.$vs.notify({
                                title: 'Error',
                                text: 'No se pudo obtener el código de venta.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                            return;
                        }
                    }, tipo);
                } else {
                    // Usar empresa de facturación si hay facturación cruzada
                    let empresaParaCodigo = me.esFacturacionCruzada && me.empresaFactura ? me.empresaFactura : empresa;
                    me.getcodFR(empresaParaCodigo, (codigoVenta) => {
                        if (codigoVenta) {
                            me.codigo = codigoVenta;
                            console.log("Código de venta asignado:", me.codigo);
                        } else {
                            console.log("No se pudo obtener el código de venta.");
                            this.$vs.notify({
                                title: 'Error',
                                text: 'No se pudo obtener el código de venta.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                            return;
                        }
                    }, tipo);
                }

            } else if (empresa == 3) {
                me.datosFR = me.arrayClientePrefacturas.filter(f => f.id_empresa == empresa);
                me.idempresa = me.datosFR[0].id_empresa;
                me.empresa = me.datosFR[0].descripcion_corta;
                console.log('datos creacion',me.datosCalmed)

                me.datosCalmed.forEach(prefactura => {
                    // Extraer instituciones únicas
                    if (prefactura.institucion_id !== undefined && prefactura.clienteInstitucion !== undefined) {
                        const institucionInfo = {
                            idInstitucion: prefactura.institucion_id,
                            nombreInstitucion: prefactura.clienteInstitucion
                        };
                        // Agregar como clave en el Map para mantener la unicidad
                        institucionesSet.set(prefactura.institucion_id, institucionInfo);
                    }
                    // Extraer clientes únicos
                    if (prefactura.ven_cliente !== undefined && prefactura.ruc_cliente !== undefined && prefactura.clienteUsuario !== undefined && prefactura.clientesidPerseo !== undefined) {
                        const clienteInfo = {
                            ven_cliente: prefactura.ven_cliente,
                            ruc_cliente: prefactura.ruc_cliente,
                            clienteUsuario: prefactura.clienteUsuario,
                            clientesidPerseo: prefactura.clientesidPerseo,
                        };
                        // Agregar como clave en el Map para mantener la unicidad
                        clientesSet.set(clienteInfo.ruc_cliente, clienteInfo);
                    }

                });

                // Convertir el Map a un array
                me.usuarioReporte = Array.from(clientesSet.values());


                // Manejo de cliente único
                if (me.usuarioReporte.length === 1) {
                    me.dataclienteunique = {
                        id_usuario: me.usuarioReporte[0].ven_cliente,
                        nombreCliente: me.usuarioReporte[0].clienteUsuario,
                        ruc_cliente: me.usuarioReporte[0].ruc_cliente,
                        clientesidPerseo: me.usuarioReporte[0].clientesidPerseo,
                    };
                }


                // Convertir el Map a un array
                me.institucionesreporte = Array.from(institucionesSet.values());
                console.log('datos unicos', me.institucionesreporte)

                // Manejo de institución única
                if (me.institucionesreporte.length === 1) {
                    me.datainstitucionunique = {
                        id_institucion: me.institucionesreporte[0].idInstitucion,
                        nombreInstitucion: me.institucionesreporte[0].nombreInstitucion
                    }
                }

                me.institucionesVariacionC = clientesSet.size > 1;
                me.institucionesVariacion = me.institucionesVariacionC;

                if (tipo === 1) {
                    me.getcod(empresa, (codigoVenta) => {
                        if (codigoVenta) {
                            me.codigo = codigoVenta;
                            console.log("Código de venta asignado:", me.codigo);
                        } else {
                            console.log("No se pudo obtener el código de venta.");
                            this.$vs.notify({
                                title: 'Error',
                                text: 'No se pudo obtener el código de venta.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                            return;
                        }
                    }, tipo);
                }
                if (tipo === 2) {
                    me.getcodNC(empresa, (codigoVenta) => {
                        if (codigoVenta) {
                            me.codigo = codigoVenta;
                            console.log("Código de venta asignado:", me.codigo);
                        } else {
                            console.log("No se pudo obtener el código de venta.");
                            this.$vs.notify({
                                title: 'Error',
                                text: 'No se pudo obtener el código de venta.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                            return;
                        }
                    }, tipo);
                } else {
                    // Usar empresa de facturación si hay facturación cruzada
                    let empresaParaCodigo = me.esFacturacionCruzada && me.empresaFactura ? me.empresaFactura : empresa;
                    me.getcodFR(empresaParaCodigo, (codigoVenta) => {
                        if (codigoVenta) {
                            me.codigo = codigoVenta;
                            console.log("Código de venta asignado:", me.codigo);
                        } else {
                            console.log("No se pudo obtener el código de venta.");
                            this.$vs.notify({
                                title: 'Error',
                                text: 'No se pudo obtener el código de venta.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                            return;
                        }
                    }, tipo);
                }
            }

            me.datosAllFR = [];
            me.$vs.loading();
            if (tipo === 1) {
                me.agruparCods(me.idempresa, tipo);
            } else if (tipo === 2) {
                me.agruparCodsNC(me.idempresa, tipo);
            } else {
                me.agrupar(me.idempresa, tipo);
            }
        },
        getCantidadFacturada() {
            let me = this;

            return this.$http.get(this.$server_url + 'getCantidadFacturadaXcliente', {
                params: {
                    cedula: me.ObjectClientSelected.cedula,
                    empresa: me.idempresa,
                    periodo: me.periodoSelect.idperiodoescolar
                }
            }).then(res => {
                return res.data; // Retorna los datos de la respuesta
            }).catch(err => {
                console.log(err);
                return []; // Retorna un array vacío en caso de error
            });
        },
        getCantidadNotaCredito() {
            let me = this;

            return this.$http.get(this.$server_url + 'getCantidadNotaCreditoXcliente', {
                params: {
                    cedula: me.ObjectClientSelected.cedula,
                    empresa: me.idempresa,
                    periodo: me.periodoSelect.idperiodoescolar
                }
            }).then(res => {
                return res.data; // Retorna los datos de la respuesta
            }).catch(err => {
                console.log(err);
                return []; // Retorna un array vacío en caso de error
            });
        },
        agruparCods(empresa, tipo) {
            let me = this;
            let promises = [];
            me.datosAllFROriginal = [];
            me.codigosVentas = [];

            // Obtener las prefacturas
            me.datosFR.forEach(fr => {
                if (fr.ven_codigo) {
                    let promise = this.$http.get(this.$server_url + 'Get_PREFacturaCodigos?ven_codigo=' + fr.ven_codigo + '&idemp=' + fr.id_empresa)
                        .then(res => {
                            return res.data; // Retorna directamente los datos
                        })
                        .catch(err => {
                            console.log(err);
                            return []; // Retorna un array vacío en caso de error
                        });
                    promises.push(promise);
                }
            });

            // Espera a que todas las promesas se resuelvan
            Promise.all(promises)
                .then(results => {
                    me.codigosVentas = results.flat(); // Aplana el array
                })
                .catch(err => {
                    me.$vs.loading.close(); // Cierra el loading
                    console.log(err);
                })
                .finally(() => {
                    me.agruparN(empresa, tipo);
                });
        },
        agruparCodsNC(empresa, tipo) {
            let me = this;
            let promises = [];
            me.datosAllFROriginal = [];
            me.documentosVentas = [];

            // Obtener las prefacturas
            me.datosFR.forEach(fr => {
                if (fr.ven_codigo) {
                    me.documentosVentas.push({
                        ven_codigo: fr.ven_codigo,
                        idemp: fr.id_empresa
                    });
                    let promise = this.$http.get(this.$server_url + 'Get_PREFactura?ven_codigo=' + fr.ven_codigo + '&idemp=' + fr.id_empresa)
                        .then(res => {
                            return res.data; // Retorna directamente los datos
                        })
                        .catch(err => {
                            console.log(err);
                            return []; // Retorna un array vacío en caso de error
                        });
                    promises.push(promise);
                }
            });

            // Espera a que todas las promesas se resuelvan
            Promise.all(promises)
                .then(results => {
                    me.datosAllFR = results.flat(); // Aplana el array

                    // Agrupación por pro_codigo
                    const grouped = me.datosAllFR.reduce((acc, item) => {
                        const existing = acc.find(el => el.pro_codigo === item.pro_codigo);
                        if (existing) {
                            // Sumar valores de las propiedades correspondientes
                            existing.det_ven_dev += item.det_ven_dev;
                            existing.det_ven_cantidad += item.det_ven_cantidad;
                        } else {
                            acc.push({
                                ...item
                            });
                        }
                        return acc;
                    }, []);

                    // Obtener cantidades facturadas y cantidades de nota crédito
                    return Promise.all([
                        me.getCantidadFacturada(empresa),
                        me.getCantidadNotaCredito(empresa) // Llamar la nueva función para obtener cantidad de nota crédito
                    ]).then(([cantidadFacturada, cantidadNotaCredito]) => {
                        // Crear un mapa para las cantidades facturadas
                        const cantidadFacturadaMap = new Map(cantidadFacturada.map(item => [item.pro_codigo, item.det_ven_cantidad]));
                        const cantidadNotaCreditoMap = new Map(cantidadNotaCredito.map(item => [item.pro_codigo, item.det_ven_cantidad]));

                        // Filtrar y calcular la cantidad real a facturar
                        me.datosAllFR = grouped
                            .map(item => {
                                // Calcula la cantidad real a facturar
                                const cantidadRealFacturar = (item.det_ven_cantidad - item.det_ven_dev);
                                const cantidadFacturada = cantidadFacturadaMap.get(item.pro_codigo) || 0;
                                const cantidadNotaCredito = cantidadNotaCreditoMap.get(item.pro_codigo) || 0; // Obtener la cantidad de nota crédito

                                // Solo continuar si la cantidad facturada es mayor que la diferencia entre cantidad y devoluciones
                                if (cantidadRealFacturar < cantidadFacturada) {
                                    const cantidadRealFacturarResult = cantidadFacturada - cantidadRealFacturar;

                                    // Si cantidad_real_facturar es igual a cantidad_nota_credito, no incluir el item
                                    if (cantidadRealFacturarResult === cantidadNotaCredito) {
                                        return null; // Excluir este item
                                    }

                                    return {
                                        ...item,
                                        cantidad_real_facturar: cantidadRealFacturarResult - cantidadNotaCredito,
                                        cantidad_facturada: cantidadFacturada, // Añadir cantidad facturada
                                        cantidad_nota_credito: cantidadNotaCredito, // Añadir cantidad de nota crédito
                                        check_real_facturar: tipo == 2 && cantidadRealFacturar < cantidadFacturada && cantidadRealFacturarResult != cantidadNotaCredito ? true : false,
                                        check_cantidades: cantidadRealFacturar === 0, // Aquí utilizamos la variable ya calculada
                                    };
                                } else {
                                    // Si no cumple la condición, simplemente no incluir el item
                                    return null;
                                }
                            })
                            .filter(item => item !== null); // Filtra los nulls (excluye los items donde cantidad_real_facturar == cantidad_nota_credito)

                        // Actualiza la copia original para el filtrado
                        me.datosAllFROriginal = [...me.datosAllFR]; // Asegúrate de guardar la copia aquí
                        me.datosAllFR = me.datosAllFR.filter(item => item.cantidad_real_facturar > 0); // Filtra los items donde cantidad_real_facturar == 0
                        if (me.datosAllFR.length > 0) {
                            me.popupNotaDeCredito = me.datosAllFR.length > 0; // Establece el valor de popupFR
                        } else {
                            me.$vs.notify({
                                title: 'Sin datos',
                                text: 'No se encontraron desfases.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                        }
                    });
                })
                .catch(err => {
                    me.$vs.loading.close(); // Cierra el loading
                    console.log(err);
                })
                .finally(() => {
                    me.$vs.loading.close(); // Cierra el loading
                });
        },
        agruparN(empresa, tipo) {
            let me = this;
            let promises = [];
            me.datosAllFROriginal = [];
            me.documentosVentas = [];

            // Obtener las prefacturas
            me.datosFR.forEach(fr => {
                if (fr.ven_codigo) {
                    me.documentosVentas.push({
                        ven_codigo: fr.ven_codigo,
                        idemp: fr.id_empresa
                    });
                    let promise = this.$http.get(this.$server_url + 'Get_PREFactura?ven_codigo=' + fr.ven_codigo + '&idemp=' + fr.id_empresa)
                        .then(res => {
                            return res.data; // Retorna directamente los datos
                        })
                        .catch(err => {
                            console.log(err);
                            return []; // Retorna un array vacío en caso de error
                        });
                    promises.push(promise);
                }
            });

            // Espera a que todas las promesas de las prefacturas se resuelvan
            Promise.all(promises)
                .then(results => {
                    me.datosAllFR = results.flat(); // Aplana el array

                    // Agrupación por pro_codigo
                    const grouped = me.datosAllFR.reduce((acc, item) => {
                        const existing = acc.find(el => el.pro_codigo === item.pro_codigo);
                        if (existing) {
                            // Sumar valores de las propiedades correspondientes
                            existing.det_ven_dev += item.det_ven_dev;
                            existing.det_ven_cantidad += item.det_ven_cantidad;
                        } else {
                            acc.push({
                                ...item
                            });
                        }
                        return acc;
                    }, []);

                    // Obtener las cantidades facturadas y las cantidades de nota de crédito en paralelo
                    return Promise.all([
                        me.getCantidadFacturada(empresa),
                        me.getCantidadNotaCredito(empresa) // Se incluye la llamada a getCantidadNotaCredito
                    ]).then(([cantidadFacturada, cantidadNotaCredito]) => {
                        // Crear un mapa para las cantidades facturadas
                        const cantidadMap = new Map(cantidadFacturada.map(item => [item.pro_codigo, item.det_ven_cantidad]));
                        const notaCreditoMap = new Map(cantidadNotaCredito.map(item => [item.pro_codigo, item.det_ven_cantidad]));

                        me.datosAllFR = grouped.map(item => {
                            // Calcula la cantidad real a facturar
                            const cantidadRealFacturar = Math.max(0, (item.det_ven_cantidad - item.det_ven_dev) - ((cantidadMap.get(item.pro_codigo) || 0) - (notaCreditoMap.get(item.pro_codigo) || 0)));

                            return {
                                ...item,
                                cantidad_real_facturar: cantidadRealFacturar,
                                cantidad_facturada: cantidadMap.get(item.pro_codigo) || 0, // Añadir cantidad facturada
                                cantidad_nota_credito: notaCreditoMap.get(item.pro_codigo) || 0, // Añadir cantidad de nota de crédito
                                check_real_facturar: tipo === 1 && cantidadRealFacturar > 0 ? true : false,
                                check_cantidades: cantidadRealFacturar === 0, // Aquí utilizamos la variable ya calculada
                            };
                        });

                        // Actualiza la copia original para el filtrado
                        me.datosAllFROriginal = [...me.datosAllFR]; // Asegúrate de guardar la copia aquí
                        me.datosAllFR = me.datosAllFR.filter(item => item.cantidad_real_facturar > 0); // Filtra los items donde cantidad_real_facturar == 0
                        if (me.datosAllFR.length > 0) {
                            // me.verificacionStock(me.datosAllFR, empresa);
                            me.popupPrefacturaANotas = me.datosAllFR.length > 0; // Establece el valor de popupFR
                        } else {
                            me.$vs.notify({
                                title: 'Sin datos',
                                text: 'No se encontraron saldos.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                        }
                    });
                })
                .catch(err => {
                    me.$vs.loading.close(); // Cierra el loading
                    console.log(err);
                })
                .finally(() => {
                    me.$vs.loading.close(); // Cierra el loading
                });
        },
        verificacionStock(datos, empresa) {
            let me = this;
            let datosStock = [];

            // Preparamos los datos para enviarlos al backend
            datos.forEach(element => {
                let cal = new Object();
                cal.codigo = element.pro_codigo;
                cal.cantidad = element.cantidad_real_facturar;
                cal.empresa = empresa; // Pasamos la empresa también
                datosStock.push(cal);
            });

            // Enviamos los datos al servidor para verificar el stock
            this.$http.post(this.$server_url + 'verificarStock', datosStock)
                .then(res => {
                    if (res.data.status === 0) {
                        // Si no hay suficiente stock, mostramos la lista de productos sin stock
                        this.productosNoDisponibles = res.data.productos_no_disponibles;
                        this.popupVisible = true; // Abre el popup
                        return;

                        // // Notificamos sobre los productos que no tienen stock suficiente
                        // let mensaje = 'No hay suficiente stock para los siguientes productos: \n';
                        // productosNoDisponibles.forEach(producto => {
                        //     mensaje += `Código: ${producto.codigo}, Cantidad solicitada: ${producto.cantidad_solicitada}, Stock disponible: ${producto.stock_disponible}\n`;
                        // });

                        // me.$vs.notify({
                        //     text: mensaje, // Mensaje con los productos sin stock suficiente
                        //     color: 'warning',
                        //     iconPack: 'feather',
                        //     icon: 'icon-alert-triangle'
                        // });
                        // return; // Salimos del método si no hay stock suficiente
                    } else {
                        // Si el stock es suficiente, mostramos un mensaje de éxito
                        me.$vs.notify({
                            text: res.data.message, // Mensaje de éxito
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle'
                        });

                        // Si todo fue correcto, actualizamos los datos
                        me.popupPrefacturaANotas = me.datosAllFR.length > 0; // Establecemos el valor de popupFR
                    }

                })
                .catch(err => {
                    // Manejo de errores
                    console.error("Error al verificar el stock:", err);
                    me.$vs.notify({
                        text: 'Hubo un error al verificar el stock. Intenta nuevamente.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },
        agrupar(empresa, tipo) {
            let me = this;
            let promises = [];
            me.datosAllFROriginal = [];
            me.documentosVentas = [];

            // Obtener las prefacturas
            me.datosFR.forEach(fr => {
                if (fr.ven_codigo) {
                    me.documentosVentas.push({
                        ven_codigo: fr.ven_codigo,
                        idemp: fr.id_empresa
                    });
                    let promise = this.$http.get(this.$server_url + 'Get_PREFactura?ven_codigo=' + fr.ven_codigo + '&idemp=' + fr.id_empresa)
                        .then(res => {
                            return res.data; // Retorna directamente los datos
                        })
                        .catch(err => {
                            console.log(err);
                            return []; // Retorna un array vacío en caso de error
                        });
                    promises.push(promise);
                }
            });

            // Espera a que todas las promesas de las prefacturas se resuelvan
            Promise.all(promises)
                .then(results => {
                    me.datosAllFR = results.flat(); // Aplana el array

                    // Agrupación por pro_codigo
                    const grouped = me.datosAllFR.reduce((acc, item) => {
                        const existing = acc.find(el => el.pro_codigo === item.pro_codigo);
                        if (existing) {
                            // Sumar valores de las propiedades correspondientes
                            existing.det_ven_dev += item.det_ven_dev;
                            existing.det_ven_cantidad += item.det_ven_cantidad;
                        } else {
                            acc.push({
                                ...item
                            });
                        }
                        return acc;
                    }, []);

                    // Obtener las cantidades facturadas y las cantidades de nota de crédito en paralelo
                    return Promise.all([
                        me.getCantidadFacturada(empresa),
                        me.getCantidadNotaCredito(empresa) // Se incluye la llamada a getCantidadNotaCredito
                    ]).then(([cantidadFacturada, cantidadNotaCredito]) => {
                        // Crear un mapa para las cantidades facturadas
                        const cantidadMap = new Map(cantidadFacturada.map(item => [item.pro_codigo, item.det_ven_cantidad]));
                        const notaCreditoMap = new Map(cantidadNotaCredito.map(item => [item.pro_codigo, item.det_ven_cantidad]));

                        me.datosAllFR = grouped.map(item => {
                            // Calcula la cantidad real a facturar
                            const cantidadRealFacturar = Math.max(0, item.det_ven_cantidad - item.det_ven_dev - ((cantidadMap.get(item.pro_codigo) || 0) - (notaCreditoMap.get(item.pro_codigo) || 0)));

                            return {
                                ...item,
                                cantidad_real_facturar: cantidadRealFacturar,
                                cantidad_facturada: cantidadMap.get(item.pro_codigo) || 0, // Añadir cantidad facturada
                                cantidad_nota_credito: notaCreditoMap.get(item.pro_codigo) || 0, // Añadir cantidad de nota de crédito
                                check_real_facturar: tipo === 1 && cantidadRealFacturar > 0 ? true : false,
                                check_cantidades: cantidadRealFacturar === 0, // Aquí utilizamos la variable ya calculada
                            };
                        });

                        // Actualiza la copia original para el filtrado
                        me.datosAllFROriginal = [...me.datosAllFR]; // Asegúrate de guardar la copia aquí

                        me.popupFR = me.datosAllFR.length > 0; // Establece el valor de popupFR
                    });
                })
                .catch(err => {
                    me.$vs.loading.close(); // Cierra el loading
                    console.log(err);
                })
                .finally(() => {
                    me.$vs.loading.close(); // Cierra el loading
                });
        },

        getAllPrefacturas(datos) {
            let me = this;
            me.ven_desc_por_unique = [];
            me.tip_ven_codigo_por_unique = [];
            me.datacliente = datos;
            me.tipo_ven_codigo = 0;
            me.tipoVariacion = null;
            me.validacionSinVariacion = false;
            me.validacionNovariacion = false;
            me.datosRucCliente = []
            me.$vs.loading();

            // this.$http.get(this.$server_url + 'getAllPrefacturas?busqueda=' + datos.idInstitucion + '&periodo=' + me.periodoSelect.idperiodoescolar)
            this.$http.get(this.$server_url + 'getAllPrefacturasXCliente?busqueda=' + datos.cedula + '&periodo=' + me.periodoSelect.idperiodoescolar)
                .then(function (res) {
                    me.arrayClientePrefacturas = res.data;
                    if (me.arrayClientePrefacturas.length === 0) {
                        me.$vs.notify({
                            title: 'Sin datos',
                            text: 'No se encontraron prefacturas.',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                    } else {
                        // Extraer valores únicos de ven_desc_por y tip_ven_codigo
                        const descuentos = new Set();
                        const tiposVenta = new Set();

                        me.arrayClientePrefacturas.forEach(prefactura => {
                            if (prefactura.ven_desc_por !== undefined) {
                                descuentos.add(prefactura.ven_desc_por);
                            }
                        });

                        me.arrayClientePrefacturas.forEach(prefactura => {
                            if (prefactura.tip_ven_codigo !== undefined) {
                                tiposVenta.add(prefactura.tip_ven_codigo);
                            }
                        });

                        me.datosProlipa = me.arrayClientePrefacturas.filter(f => f.id_empresa == 1 || f.id_empresa == 6);
                        me.datosCalmed = me.arrayClientePrefacturas.filter(f => f.id_empresa == 3);

                        me.ven_desc_por_unique = Array.from(descuentos);
                        me.tip_ven_codigo_por_unique = Array.from(tiposVenta);
                        console.log('tipo venta all facturas', me.tip_ven_codigo_por_unique);

                        // Verificar si 'tip_ven_codigo_por_unique' tiene exactamente un elemento
                        if (me.tip_ven_codigo_por_unique.length === 1) {
                            me.validacionSinVariacion = true;
                            me.validacionNovariacion = false;
                            me.tipo_ven_codigo = me.tip_ven_codigo_por_unique[0]; // Asignamos el único valor
                        } else {
                            me.validacionNovariacion = true;
                            me.validacionSinVariacion = false;
                            me.tipo_ven_codigo = 0; // Asignamos 0 si tiene más de un valor o está vacío
                        }

                        console.log('tipo_ven_codigo:', me.tipo_ven_codigo);

                        // Comprobar variaciones
                        me.inputValid = descuentos.size > 1; // Activa la alerta si hay variaciones
                        me.inputValidtipo = tiposVenta.size > 1; // Activa la alerta si hay variaciones

                        me.getNotasIntercambio(datos);
                        me.getNotasCredito(datos);
                        me.getNotasCLiente(datos);

                        const rucsFiltrados = res.data
                        .map(r => r.ruc_cliente)
                        .filter(ruc => ruc !== null && ruc !== undefined && ruc !== '');

                        // Eliminar duplicados y devolver en formato de objetos
                        const rucsUnicos = [...new Set(rucsFiltrados)].map(ruc => ({ ruc_Institucion: ruc }));

                        me.datosRucCliente = rucsUnicos;
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al buscar los datos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },
        getNotasIntercambio(datos) {
            let me = this;
            let id = me.periodoSelect.idperiodoescolar;
            me.$vs.loading();
            // this.$http.get(this.$server_url + "getNotasIntercambio?institucion=" + datos.idInstitucion + '&periodo=' + id)
            this.$http.get(this.$server_url + "getNotasIntercambioXcliente?cedula=" + datos.cedula + '&periodo=' + id)
                .then(function (res) {
                    me.NotasIntercambio = res.data['notas'];
                    if (!me.NotasIntercambio[0].intercambio_doc.length > 0) {
                        me.verNotasIntercambio = false; // No hay datos válidos
                    } else {
                        me.verNotasIntercambio = true; // Hay datos válidos
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error);
                });
        },
        getNotasCredito(datos) {
            let me = this;
            let id = me.periodoSelect.idperiodoescolar;
            me.$vs.loading();
            // this.$http.get(this.$server_url + "getNotasCredito?institucion=" + datos.idInstitucion + '&periodo=' + id)
            this.$http.get(this.$server_url + "getNotasCreditoXcliente?cedula=" + datos.cedula + '&periodo=' + id)
                .then(function (res) {
                    me.NotasCredito = res.data;
                    if (me.NotasCredito.length > 0) {
                        me.verNotasCredito = true;
                    } else {
                        me.verNotasCredito = false;
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error);
                });
        },
        getNotasCLiente(datos) {
            let me = this;
            let id = me.periodoSelect.idperiodoescolar;
            me.$vs.loading();
            // this.$http.get(this.$server_url + "getNotasCLiente?institucion=" + datos.idInstitucion + '&periodo=' + id)
            this.$http.get(this.$server_url + "getNotasCLienteXcliente?cedula=" + datos.cedula + '&periodo=' + id)
                .then(function (res) {
                    me.NotasCreditoClientes = res.data;
                    if (me.NotasCreditoClientes.length > 0) {
                        me.verNotasCreditoClientes = true;
                    } else {
                        me.verNotasCreditoClientes = false;
                    }
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error);
                });
        },
        searchData(tipo) {
            let me = this
            var url = ""
            //minimo 4 caracteres
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
            url = 'InstitucionesXCobranzas?busqueda=' + me.busqueda.puntoVenta + '&id_periodo=' + me.periodoSelect.idperiodoescolar + '&prefacturas=1'
            me.$vs.loading()
            this.$http.get(this.$server_url + url)
                .then(function (res) {
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
                    me.arrayPuntoVenta = me.arrayPuntoVenta.filter(m => m.estado_ventas === "Tiene ventas");
                    if (me.arrayPuntoVenta.length == 0) {
                        me.$vs.notify({
                            title: 'Error',
                            text: 'No se encontraron datos de instituciones o puntos de venta con prefacturas',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        })
                    }
                    me.$vs.loading.close()
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




        change(e) {
            if (e == true) {
                this.tdo = 0;
            }
        },
        handleChange() {
            console.log('Cambio detectado');
        },

        // guardarDatosNotas() {
        //     let me = this;
        //     this.isLoading = true;
        //     // Validaciones
        //     if (!this.ObjectClientSelected.nombreInstitucion) {
        //         this.isLoading = false;
        //         this.$vs.notify({
        //             title: 'Error',
        //             text: 'La institución es requerida.',
        //             color: 'danger',
        //             iconPack: 'feather',
        //             icon: 'icon-alert-circle'
        //         });
        //         return;
        //     }

        //     if (!this.datainstitucionunique || !this.datainstitucionunique.nombreInstitucion) {
        //         this.isLoading = false;
        //         this.$vs.notify({
        //             title: 'Error',
        //             text: 'El cliente es requerido.',
        //             color: 'danger',
        //             iconPack: 'feather',
        //             icon: 'icon-alert-circle'
        //         });
        //         return;
        //     }

        //     const itemsSeleccionados = this.datosAllFR.filter(item => item.check_real_facturar);

        //     if (itemsSeleccionados.length === 0) {
        //         this.isLoading = false;
        //         this.$vs.notify({
        //             title: 'Error',
        //             text: 'Debe seleccionar al menos un ítem.',
        //             color: 'danger',
        //             iconPack: 'feather',
        //             icon: 'icon-alert-circle'
        //         });
        //         return;
        //     }

        //     // Verificar si hay cantidades en 0
        //     const itemsConCantidadCero = itemsSeleccionados.filter(item => item.cantidad_real_facturar == 0);
        //     if (itemsConCantidadCero.length > 0) {
        //         this.isLoading = false;
        //         this.$vs.notify({
        //             title: 'Advertencia',
        //             text: 'Hay ítems seleccionados con cantidad en 0.',
        //             color: 'warning',
        //             iconPack: 'feather',
        //             icon: 'icon-alert-triangle'
        //         });
        //         return;
        //     }

        //     if (me.descuentoVariacion && !me.inputDescuento) {
        //         this.isLoading = false;
        //         this.$vs.notify({
        //             title: 'Error',
        //             text: 'Debes ingresar el descuento.',
        //             color: 'danger',
        //             iconPack: 'feather',
        //             icon: 'icon-alert-circle'
        //         });
        //         return;
        //     }

        //     // Reducir los datos de los ítems a solo los campos que necesitas
        //     const datosReducidos = itemsSeleccionados.map(item => ({
        //         pro_codigo: item.pro_codigo,
        //         cantidad_real_facturar: item.cantidad_real_facturar
        //     }));

        //     const datosParaGuardar = {
        //         institucion: this.ObjectClientSelected.idInstitucion,
        //         Institución: this.datainstitucionunique,
        //         items: datosReducidos,
        //         subtotal: this.subtotal.toFixed(2),
        //         descuento_porcentaje: this.inputDescuento?this.inputDescuento:this.ven_desc_por_unique[0],
        //         descuento: this.descuento.toFixed(2),
        //         subtotalDescuento: this.subtotalDescuento.toFixed(2),
        //         iva: this.iva.toFixed(2),
        //         transporte: this.transporte.toFixed(2),
        //         total: this.total.toFixed(2),
        //     };

        //     let formData = new FormData();
        //         formData.append("data_detalle", JSON.stringify(datosParaGuardar.items));
        //         formData.append("ven_codigo", me.codigo);
        //         formData.append("id_empresa", me.idempresa);
        //         formData.append("ven_desc_por", datosParaGuardar.descuento_porcentaje);
        //         formData.append("ven_iva_por", 0);
        //         formData.append("ven_descuento", datosParaGuardar.descuento);
        //         formData.append("ven_iva", datosParaGuardar.iva);
        //         formData.append("ven_transporte", datosParaGuardar.transporte);
        //         formData.append("ven_valor", datosParaGuardar.total);
        //         formData.append("ven_subtotal", datosParaGuardar.subtotal);
        //         formData.append("id_ins_depacho", datosParaGuardar.institucion);
        //         formData.append("periodo_id", me.periodoSelect.idperiodoescolar);
        //         formData.append("ven_cliente", datosParaGuardar.cliente.id_usuario);
        //         formData.append("clientesidPerseo", datosParaGuardar.cliente.clientesidPerseo);
        //         formData.append("ven_fecha", me.fechaActual);
        //         formData.append("user_created", me.usuario.idusuario);
        //         formData.append("tipoVenta", me.tipo_ven_codigo);
        //         formData.append("ruc_cliente", datosParaGuardar.cliente.ruc_cliente);
        //         formData.append("letra", me.letra);
        //         formData.append("documentosVentas", JSON.stringify(me.documentosVentas));
        //         // formData.append("data_ventas", JSON.stringify(me.perseo));

        //     // console.log('Datos a guardar:', datosParaGuardar);
        //     for (let [key, value] of formData.entries()) {
        //         console.log(`${key}:`, value);
        //     }
        //     // Aquí puedes realizar una llamada a tu API para guardar los datos
        //     this.$http.post(this.$server_url + "cambioPrefacturasANota", formData)
        //         .then(response => {
        //             // Manejar la respuesta de éxito
        //            if(response.data.status == 0){
        //                 this.$vs.notify({
        //                     title: 'Éxito',
        //                     text: 'Datos guardados correctamente.',
        //                     color: 'success',
        //                     iconPack: 'feather',
        //                     icon: 'icon-check'
        //                 });
        //                 this.getAllPrefacturas(me.datacliente);
        //                 this.popupPrefacturaANotas = false;
        //             }else{
        //                 this.$vs.notify({
        //                     title: 'Error',
        //                     text: 'Datos guardados incorrectamente.',
        //                     color: 'danger',
        //                     iconPack: 'feather',
        //                     icon: 'icon-x'
        //                 });
        //             }
        //         })
        //         .catch(error => {
        //             // Manejar el error
        //             this.$vs.notify({
        //                 title: 'Error',
        //                 text: 'Error al guardar los datos.',
        //                 color: 'danger',
        //                 iconPack: 'feather',
        //                 icon: 'icon-alert-circle'
        //             });
        //             console.error('Error al guardar datos:', error);
        //         })
        //         .finally(() => {
        //             this.isLoading = false;
        //         });
        // },
        guardarDatosNotas() {
            let me = this;
            this.isLoading = true;

            // Validaciones
            return new Promise((resolve, reject) => {
                // Validaciones
                if (!this.ObjectClientSelected.nombreInstitucion) {
                    this.isLoading = false;
                    this.$vs.notify({
                        title: 'Error',
                        text: 'La institución es requerida.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return reject('La institución es requerida.');
                }

                if (!this.datainstitucionunique || !this.datainstitucionunique.nombreInstitucion) {
                    this.isLoading = false;
                    this.$vs.notify({
                        title: 'Error',
                        text: 'El cliente es requerido.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return reject('El cliente es requerido.');
                }

                const itemsSeleccionados = this.datosAllFR.filter(item => item.check_real_facturar);

                if (itemsSeleccionados.length === 0) {
                    this.isLoading = false;
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Debe seleccionar al menos un ítem.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return reject('Debe seleccionar al menos un ítem.');
                }

                // Verificar si hay cantidades en 0
                const itemsConCantidadCero = itemsSeleccionados.filter(item => item.cantidad_real_facturar == 0);
                if (itemsConCantidadCero.length > 0) {
                    this.isLoading = false;
                    this.$vs.notify({
                        title: 'Advertencia',
                        text: 'Hay ítems seleccionados con cantidad en 0.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return reject('Hay ítems con cantidad en 0.');
                }

                if (me.descuentoVariacion && !me.inputDescuento) {
                    this.isLoading = false;
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Debes ingresar el descuento.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return reject('Debes ingresar el descuento.');
                }

                // Reducir los datos de los ítems a solo los campos que necesitas
                const datosReducidos = itemsSeleccionados.map(item => ({
                    pro_codigo: item.pro_codigo,
                    cantidad_real_facturar: item.cantidad_real_facturar
                }));

                const datosParaGuardar = {
                    institucion: this.ObjectClientSelected.institucion_id,
                    Institucion: this.datainstitucionunique,
                    items: datosReducidos,
                    subtotal: this.subtotal.toFixed(2),
                    descuento_porcentaje: this.inputDescuento ? this.inputDescuento : this.ven_desc_por_unique[0],
                    descuento: this.descuento.toFixed(2),
                    subtotalDescuento: this.subtotalDescuento.toFixed(2),
                    iva: this.iva.toFixed(2),
                    transporte: this.transporte.toFixed(2),
                    total: this.total.toFixed(2),

                };

                let formData = new FormData();
                formData.append("data_detalle", JSON.stringify(datosParaGuardar.items));
                formData.append("ven_codigo", me.codigo);
                formData.append("id_empresa", me.idempresa);
                formData.append("ven_desc_por", datosParaGuardar.descuento_porcentaje);
                formData.append("ven_iva_por", 0);
                formData.append("ven_descuento", datosParaGuardar.descuento);
                formData.append("ven_iva", datosParaGuardar.iva);
                formData.append("ven_transporte", datosParaGuardar.transporte);
                formData.append("ven_valor", datosParaGuardar.total);
                formData.append("ven_subtotal", datosParaGuardar.subtotal);
                formData.append("id_ins_depacho", datosParaGuardar.institucion);
                formData.append("periodo_id", me.periodoSelect.idperiodoescolar);
                formData.append("ven_cliente", datosParaGuardar.cliente.id_usuario);
                formData.append("clientesidPerseo", datosParaGuardar.cliente.clientesidPerseo);
                formData.append("ven_fecha", me.fechaActual);
                formData.append("user_created", me.usuario.idusuario);
                formData.append("tip_ven_codigo", me.tipo_ven_codigo);
                formData.append("ruc_cliente", datosParaGuardar.cliente.ruc_cliente);
                formData.append("letra", me.letra);
                formData.append("documentosVentas", JSON.stringify(me.documentosVentas));
                formData.append("codigosVentas", JSON.stringify(me.codigosVentas));

                // Llamada al primer método cambioPrefacturasANota
                this.$http.post(this.$server_url + "cambioPrefacturasANota", formData)
                    .then(response => {
                        // Manejar la respuesta de éxito
                        if (response.data.status == 0) {
                            this.$vs.notify({
                                title: 'Éxito',
                                text: 'Datos guardados correctamente.',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                            this.getAllPrefacturas(me.datacliente);
                            this.popupPrefacturaANotas = false;
                        } else {
                            this.$vs.notify({
                                title: 'Error',
                                text: 'Datos guardados incorrectamente.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        }
                    })
                    .catch(error => {
                        // Manejar el error
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al guardar los datos.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        this.isLoading = false;
                        console.error('Error al guardar datos:', error);
                        reject(error); // Rechaza la promesa si ocurre un error en la llamada principal
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            });
        },
        getDocumentos(documentos, empresa) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentos=yes&documentos=' + documentos + '&empresa=' + empresa)
                .then((res) => {
                    me.DocumentoVenta = res.data;
                    if (me.DocumentoVenta.length > 0) {
                        let codigo = me.DocumentoVenta[0].ven_codigo;
                        let empresa = me.DocumentoVenta[0].empresa_id;
                        this.getDocumentosDetalles(codigo, empresa);
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Documento no encontrado.',
                            type: 'error',
                        });
                    }

                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los documentos.',
                        type: 'error',
                    });
                    me.$vs.loading.close();
                });
        },
        getDocumentosDetalles(codigo, empresa) {
            let me = this;
            // console.log(codigo, empresa,'dsdsadsaddsa');
            me.$vs.loading();
            this.$http.get(this.$server_url + 'devoluciones?CargarDocumentosDetalles=yes&codigo=' + codigo + '&empresa=' + empresa)
                .then((res) => {
                    this.DocumentoDetalleVenta = res.data;
                    if (this.DocumentoDetalleVenta.length > 0) {
                        this.popupDocumento = true;
                    } else {
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Detalle Documento no encontrado.',
                            type: 'error',
                        });
                    }
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Hubo un problema al cargar los detalles de los documentos.',
                        type: 'error',
                    });
                    me.$vs.loading.close();
                });
        },
        guardarDatosNotaCredito() {
            let me = this;
            this.isLoading = true;

            // Validaciones
            return new Promise((resolve, reject) => {
                // Validación de cliente (ya no de institución)
                if (!this.ObjectClientSelected || !this.ObjectClientSelected.nombres) {
                    this.isLoading = false;
                    this.$vs.notify({
                        title: 'Error',
                        text: 'El cliente es requerido.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return reject('El cliente es requerido.');
                }

                const itemsSeleccionados = this.datosAllFR.filter(item => item.check_real_facturar);

                if (itemsSeleccionados.length === 0) {
                    this.isLoading = false;
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Debe seleccionar al menos un ítem.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return reject('Debe seleccionar al menos un ítem.');
                }

                // Verificar si hay cantidades en 0
                const itemsConCantidadCero = itemsSeleccionados.filter(item => item.cantidad_real_facturar == 0);
                if (itemsConCantidadCero.length > 0) {
                    this.isLoading = false;
                    this.$vs.notify({
                        title: 'Advertencia',
                        text: 'Hay ítems seleccionados con cantidad en 0.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return reject('Hay ítems con cantidad en 0.');
                }

                if (me.descuentoVariacion && !me.inputDescuento) {
                    this.isLoading = false;
                    this.$vs.notify({
                        title: 'Error',
                        text: 'Debes ingresar el descuento.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    return reject('Debes ingresar el descuento.');
                }

                // Reducir los datos de los ítems a solo los campos que necesitas
                const datosReducidos = itemsSeleccionados.map(item => ({
                    pro_codigo: item.pro_codigo,
                    cantidad_real_facturar: item.cantidad_real_facturar,
                    precio: item.det_ven_valor_u
                }));

                // Estructura actualizada: usar cliente en lugar de institución
                const datosParaGuardar = {
                    cliente: {
                        id_usuario: this.ObjectClientSelected.id_usuario,
                        clientesidPerseo: this.ObjectClientSelected.clientesidPerseo,
                        ruc_cliente: this.ObjectClientSelected.cedula,
                        nombres: this.ObjectClientSelected.nombres
                    },
                    items: datosReducidos,
                    subtotal: this.subtotal.toFixed(2),
                    descuento_porcentaje: this.inputDescuento ? this.inputDescuento : this.ven_desc_por_unique[0],
                    descuento: this.descuento.toFixed(2),
                    subtotalDescuento: this.subtotalDescuento.toFixed(2),
                    iva: this.iva.toFixed(2),
                    transporte: this.transporte.toFixed(2),
                    total: this.total.toFixed(2),

                };

                let formData = new FormData();
                formData.append("data_detalle", JSON.stringify(datosParaGuardar.items));
                formData.append("ven_codigo", me.codigo);
                formData.append("id_empresa", me.idempresa);
                formData.append("ven_desc_por", datosParaGuardar.descuento_porcentaje);
                formData.append("ven_iva_por", 0);
                formData.append("ven_descuento", datosParaGuardar.descuento);
                formData.append("ven_iva", datosParaGuardar.iva);
                formData.append("ven_transporte", datosParaGuardar.transporte);
                formData.append("ven_valor", datosParaGuardar.total);
                formData.append("ven_subtotal", datosParaGuardar.subtotal);
                // Ya no se envía id_ins_depacho porque ahora es por cliente
                formData.append("periodo_id", me.periodoSelect.idperiodoescolar);
                formData.append("ven_cliente", datosParaGuardar.cliente.id_usuario);
                formData.append("clientesidPerseo", datosParaGuardar.cliente.clientesidPerseo);
                formData.append("ven_fecha", me.fechaActual);
                formData.append("user_created", me.usuario.idusuario);
                formData.append("tip_ven_codigo", me.tipo_ven_codigo);
                formData.append("ruc_cliente", datosParaGuardar.cliente.ruc_cliente);
                formData.append("letra", me.letra);
                formData.append("documentosVentas", JSON.stringify(me.documentosVentas));

                // Llamada al primer método cambioPrefacturasANota
                this.$http.post(this.$server_url + "cambioDesfasANotaCredito", formData)
                    .then(response => {
                        // Manejar la respuesta de éxito
                        if (response.data.status == 0) {
                            this.$vs.notify({
                                title: 'Éxito',
                                text: 'Datos guardados correctamente.',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                            this.getAllPrefacturas(me.datacliente);
                            this.popupNotaDeCredito = false;
                        } else {
                            this.$vs.notify({
                                title: 'Error',
                                text: 'Datos guardados incorrectamente.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        }
                    })
                    .catch(error => {
                        // Manejar el error
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al guardar los datos.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        this.isLoading = false;
                        console.error('Error al guardar datos:', error);
                        reject(error); // Rechaza la promesa si ocurre un error en la llamada principal
                    })
                    .finally(() => {
                        this.isLoading = false;
                    });
            });

        },
        documentoNoSeleccionado() {
            this.popupSRI = false;
        },
        documentoActualizado() {
            this.popupSRI = false;
            this.getAllPrefacturas(this.datacliente);
        },
        getreporte(tr) {
            this.tdo = 0;
            this.id = tr.id_factura;
            if (tr.idtipodoc == 11) {
                this.tdo = 1;
                this.op = '1';
            }
            this.popupImprimir = true;
        },
        change(e) {
            if (e == true) {
                this.tdo = 0;
            }
        },
        confirmarFacturacionCruzada(factura, nuevoValor) {
            let me = this;
            const nuevoEstado = nuevoValor ? 1 : 0;

            if (nuevoEstado === 1) {
                // Activar facturación cruzada
                // Verificar cuántas empresas hay disponibles
                const empresasDisponibles = me.listaEmpresas.filter(emp => emp.id !== factura.id_empresa);

                if (empresasDisponibles.length === 1) {
                    // Solo hay 2 empresas en total, asignar automáticamente la otra
                    this.$vs.dialog({
                        type: 'confirm',
                        color: 'warning',
                        title: 'Confirmar Facturación Cruzada',
                        text: `¿Está seguro de activar la facturación cruzada para la factura ${factura.id_factura}? Se cruzará con la empresa ${empresasDisponibles[0].descripcion_corta}.`,
                        accept: () => {
                            me.actualizarFacturacionCruzada(factura, nuevoEstado, empresasDisponibles[0].id);
                        },
                        cancel: () => {
                            // No hacer nada, el switch se mantiene en su estado actual
                        }
                    });
                } else if (empresasDisponibles.length > 1) {
                    // Hay más de 2 empresas, mostrar selector
                    me.facturaEnProceso = factura;
                    me.empresasDisponibles = empresasDisponibles;
                    me.empresaCruceSeleccionada = null;
                    me.popupSeleccionEmpresaCruce = true;
                } else {
                    // No hay empresas disponibles
                    me.$vs.notify({
                        title: 'Error',
                        text: 'No hay empresas disponibles para cruzar.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                }
            } else {
                // Desactivar facturación cruzada
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: 'Desactivar Facturación Cruzada',
                    text: `¿Está seguro de desactivar la facturación cruzada para la factura ${factura.id_factura}?`,
                    accept: () => {
                        me.actualizarFacturacionCruzada(factura, nuevoEstado, null);
                    },
                    cancel: () => {
                        // No hacer nada, el switch se mantiene en su estado actual
                    }
                });
            }
        },
        confirmarSeleccionEmpresaCruce() {
            let me = this;

            if (!me.empresaCruceSeleccionada) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Debe seleccionar una empresa para el cruce.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                });
                return;
            }

            me.actualizarFacturacionCruzada(me.facturaEnProceso, 1, me.empresaCruceSeleccionada);
            me.popupSeleccionEmpresaCruce = false;
        },
        actualizarFacturacionCruzada(factura, nuevoEstado, empresaCruzada) {
            let me = this;

            let formData = new FormData();
            formData.append("id_factura", factura.id_factura);
            formData.append("factura_cruzada", nuevoEstado);
            formData.append("id_empresa", factura.id_empresa);
            formData.append("empresa_cruzada", empresaCruzada || '');

            me.$vs.loading();

            this.$http
                .post(this.$server_url + "actualizarFacturacionCruzada", formData)
                .then((response) => {
                    me.$vs.loading.close();

                    if (response.data.status === 0 || response.data.success) {
                        // Actualizar el valor en el array local
                        factura.factura_cruzada = nuevoEstado;
                        factura.empresa_cruzada = empresaCruzada;

                        me.$vs.notify({
                            title: nuevoEstado === 1 ? 'Facturación Cruzada Activada' : 'Facturación Cruzada Desactivada',
                            text: `La factura ${factura.id_factura} ha sido actualizada correctamente.`,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                    } else {
                        me.$vs.notify({
                            title: 'Error',
                            text: response.data.message || 'No se pudo actualizar la facturación cruzada.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error al actualizar facturación cruzada:', error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al actualizar la facturación cruzada.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                });
        },
    },
};
</script>

<style>
.text {
    z-index: 9;
    background: var(--bg);
    color: var(--color);
    font-size: 11px;
    padding: 1.5px;
    border-radius: 1px;
    height: fit-content;
    cursor: pointer;
    box-shadow: 0 4px 16px 4px rgba(0, 0, 0, 0.15);
}

.table-container {
    max-height: 605px;
    overflow-y: auto;
}

.checked-count {
    margin-top: 10px;
    /* Espaciado opcional */
}

.active-button {
    background-color: #a3a2a24b;
    /* Verde para indicar activo */
    color: rgba(114, 114, 114, 0.671);
    /* Color del texto */
}

/* Estilos para el modal de empresa */
.empresa-modal .vs-popup {
    border-radius: 12px;
}

.empresa-modal-content {
    padding: 0;
    min-width: 400px;
}

.empresa-select {
    border-radius: 8px;
    border: 2px solid #e5e7eb;
    transition: border-color 0.2s ease-in-out;
}

.empresa-select:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.empresa-select.border-red-300 {
    border-color: #f87171;
}

.form-group label {
    font-weight: 600;
}

/* Animaciones para las alertas informativas */
.bg-blue-50, .bg-green-50 {
    transition: all 0.3s ease-in-out;
}

/* Estilo para los iconos en las opciones */
.vs-select__option {
    padding: 12px 16px;
}

/* Mejorar el espaciado de los botones en el footer */
.empresa-modal .vs-popup--footer {
    padding: 16px 24px;
    background-color: #f9fafb;
    border-top: 1px solid #e5e7eb;
}
</style><style lang="scss">
.hide-close .vs-popup--close {
    display: none;
}
</style>
