<template>
<div>
    <!-- <div v-if="menu == 0">
                    <pre>{{ sendPuntos }}</pre>
                    <div style="text-align: center;">
                        <vx-card title="Cobranzas">
                            <vs-row vs-justify="center">
                                <vs-col vs-w="12" class="vs-align-center m-2">
                                    <h2 class="text-danger">Sin Documentos</h2>
                                    <center>
                                        <img width="100" style="margin-top: 25px;" src="https://cdn-icons-png.flaticon.com/512/5433/5433091.png" alt="">
                                    </center>
                                    <vs-alert color="danger" title="Sin Documentos" active="true">
                                        Dato Seleccionado sin documentos (preFacturas o Notas).
                                    </vs-alert>
                                </vs-col>
                            </vs-row>
                        </vx-card>
                    </div>
                </div> -->
    <div v-if="menu == 3">
        <div class="m-3">
            <div>
                <vx-card class="m-5" v-if="arregloContrarios.length>0" title-color="#EA5455" title="Se encontraron documentos con variación en el CI/RUC de este cliente.">
                    <div>
                        <vs-table max-items="10" :data="arregloContrarios " v-if="arregloContrarios.length>0" striped>
                            <template slot="header">
                                <vs-chip class="m-2" color="danger">Cantidad: <b> {{ arregloContrarios.length }}</b></vs-chip>
                            </template>
                            <template slot="thead">
                                <vs-th>Documento</vs-th>
                                <vs-th>Ruc / Cédula</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" :state="arregloContrarios.length>0 ? 'danger':null">
                                    <vs-td>
                                        {{ tr.ven_codigo }}<br>
                                    </vs-td>
                                    <vs-td>
                                        {{ tr.ruc_cliente}}<br>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                </vx-card>
                <template>
                    <div :class="usarComponenteNuevo ? 'p-3' : 'p-6'">
                        <!-- Título -->
                        <h2 v-if="!usarComponenteNuevo" class="text-2xl font-bold text-gray-800 mb-6">Resumen de Cobranzas: <span class="text-primary">{{ datosCliente[0].razonsocial }}</span></h2>
                        <div v-if="usarComponenteNuevo" style="margin-bottom: 10px;">
                            <span style="font-size: 14px; font-weight: 600; color: #1e293b;">{{ datosCliente[0].razonsocial }}</span>
                        </div>

                        <div v-if="usarComponenteNuevo" style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; margin-bottom: 12px;">
                            <div style="background: white; border-left: 3px solid #3b82f6; border-radius: 4px; padding: 8px 10px; border: 1px solid #e5e7eb;">
                                <p style="font-size: 8px; margin: 0 0 2px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; color: #64748b;">Total Notas</p>
                                <h3 style="font-size: 16px; font-weight: 700; line-height: 1.2; margin: 0 0 2px 0; color: #0f172a;">${{ totalNotas | filtrarDecimal }}</h3>
                                <p style="margin: 0; font-size: 8px; font-weight: 600; letter-spacing: 0.3px; color: #64748b;">{{ cantidadNotas }} doc.</p>
                            </div>
                            <div style="background: white; border-left: 3px solid #10b981; border-radius: 4px; padding: 8px 10px; border: 1px solid #e5e7eb;">
                                <p style="font-size: 8px; margin: 0 0 2px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; color: #64748b;">Gestionado</p>
                                <h3 style="font-size: 16px; font-weight: 700; line-height: 1.2; margin: 0 0 2px 0; color: #0f172a;">${{ totalPagosNuevo | filtrarDecimal }}</h3>
                                <p style="margin: 0; font-size: 8px; font-weight: 600; letter-spacing: 0.3px; color: #64748b;">Abonos + Dev.</p>
                            </div>
                            <div style="background: white; border-left: 3px solid #f59e0b; border-radius: 4px; padding: 8px 10px; border: 1px solid #e5e7eb;">
                                <p style="font-size: 8px; margin: 0 0 2px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; color: #64748b;">Saldo Pendiente</p>
                                <h3 style="font-size: 16px; font-weight: 700; line-height: 1.2; margin: 0 0 2px 0; color: #0f172a;">${{ saldoPendienteNuevo | filtrarDecimal }}</h3>
                                <p style="margin: 0; font-size: 8px; font-weight: 600; letter-spacing: 0.3px; color: #64748b;">Por cobrar</p>
                            </div>
                            <div style="background: white; border-left: 3px solid #7367f0; border-radius: 4px; padding: 8px 10px; border: 1px solid #e5e7eb;">
                                <p style="font-size: 8px; margin: 0 0 2px 0; font-weight: 700; text-transform: uppercase; letter-spacing: 0.3px; color: #64748b;">Avance</p>
                                <h3 style="font-size: 16px; font-weight: 700; line-height: 1.2; margin: 0; color: #0f172a;">{{ avanceCobroNuevo.toFixed(1) }}%</h3>
                                <div style="margin-top: 4px; width: 100%; height: 5px; border-radius: 999px; background: #e5e7eb; overflow: hidden;">
                                    <div style="height: 100%; border-radius: 999px; background: #7367f0; transition: width 0.3s ease;" :style="{ width: avanceCobroNuevo.toFixed(1) + '%' }"></div>
                                </div>
                            </div>
                        </div>

                        <!-- Resumen general -->
                        <div v-if="!usarComponenteNuevo" class="flex flex-wrap justify-center gap-6 mb-10">
                            <!-- Total Documentos -->
                            <div class="rounded-xl text-center p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 bg-purple-50 border border-purple-200">
                                <img width="60" src="https://cdn-icons-png.flaticon.com/512/9582/9582985.png" class="mx-auto mb-2" />
                                <p class="text-sm font-semibold text-purple">{{ usarComponenteNuevo ? 'Total Notas' : 'Total PreFact. y Notas' }}</p>
                                <h3 class="text-2xl font-bold text-purple mt-1">${{ usarComponenteNuevo ? (totalNotas | filtrarDecimal) : ((totalFacturas + totalNotas) | filtrarDecimal) }}</h3>
                            </div>

                            <!-- Total Abonos -->
                            <div class="rounded-xl text-center p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 bg-orange-50 border border-orange-200">
                                <img width="60" src="https://cdn-icons-png.flaticon.com/512/9582/9582990.png" class="mx-auto mb-2" />
                                <p class="text-sm font-semibold text-orange">Total Abonos</p>
                                <h3 class="text-2xl font-bold text-orange mt-1">${{ usarComponenteNuevo ? (abonoNotas | filtrarDecimal) : ((abonoFacturas + abonoNotas) | filtrarDecimal) }}</h3>
                            </div>

                            <!-- Total Devoluciones -->
                            <div v-if="devoluciones_all.length > 0" class="rounded-xl text-center p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 bg-blue-50 border border-blue-200">
                                <img width="60" src="https://cdn-icons-png.flaticon.com/512/9582/9582998.png" class="mx-auto mb-2" />
                                <p class="text-sm font-semibold text-blue">Total Devoluciones</p>
                                <h3 class="text-2xl font-bold text-blue mt-1">${{ usarComponenteNuevo ? (totalDevolucionesNotas | filtrarDecimal) : ((totalDevolucionesFacturas + totalDevolucionesNotas) | filtrarDecimal) }}</h3>
                            </div>

                            <!-- Devoluciones sin empresa -->
                            <div v-if="datosDevolucionesSinEmpresa.length > 0" class="rounded-xl text-center p-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/5 bg-red-50 border border-red-200">
                                <img width="60" src="https://cdn-icons-png.flaticon.com/512/5427/5427430.png" class="mx-auto mb-2" />
                                <p class="text-sm font-semibold text-red">Dev. Sin Empresa</p>
                                <h3 class="text-2xl font-bold text-red mt-1">${{ totalDevolucionesSinEmpresa | filtrarDecimal }}</h3>
                            </div>
                        </div>


                        <!-- Botón Devoluciones sin Empresa -->
                        <div class="flex justify-center mb-6" v-if="datosDevolucionesSinEmpresa.length > 0">
                            <vs-button color="danger" type="line" @click="popupVerSinEmpresa = true" icon-pack="feather" icon="icon-eye">
                                Ver Devoluciones sin empresa
                            </vs-button>
                        </div>

                        <!-- Botones de acción agrupados -->
                        <div v-if="!usarComponenteNuevo" class="flex flex-wrap justify-between gap-4 mb-8">
                            <div class="flex flex-wrap gap-2">
                                <vs-dropdown vs-custom-content vs-trigger-click>
                                    <vs-button class="btn-drop" type="relief" icon="expand_more">Generar</vs-button>
                                    <vs-dropdown-menu class="w-64">
                                        <vs-dropdown-item >
                                            <div class="flex items-center gap-2 text-success font-bold p-2" @click="newAbono()">
                                                <vs-icon icon="attach_money"></vs-icon>
                                                <span>Nuevo Abono</span>
                                            </div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="!usarComponenteNuevo && totalFacturasReales > 0">
                                            <div class="flex items-center gap-2 text-danger font-bold p-2" @click="verificareditornew = 'new';NuevaRetencion()">
                                                <vs-icon icon="receipt"></vs-icon>
                                                <span>Generar Retención</span>
                                            </div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="!usarComponenteNuevo && (cantidadFacturas > 0 || cantidadNotas > 0)">
                                            <div class="flex items-center gap-2 text-warning font-bold p-2" @click="NuevoCruce()">
                                                <vs-icon icon="shuffle"></vs-icon>
                                                <span>Nuevo Cruce</span>
                                            </div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="!usarComponenteNuevo && (cantidadFacturas > 0 || cantidadNotas > 0)">
                                            <div class="flex items-center gap-2 text-primary font-bold p-2" @click="abrirFacturaOperativa()">
                                                <vs-icon icon="description"></vs-icon>
                                                <span>Generar Fact. Operativa</span>
                                            </div>
                                        </vs-dropdown-item>
                                    </vs-dropdown-menu>
                                </vs-dropdown>
                            </div>
                            <div>
                                <vs-button color="primary" type="relief" v-if="cargoDevoluciones" @click="popupPDF = true">Reporte Individual</vs-button>
                            </div>
                        </div>

                        <div v-if="usarComponenteNuevo" style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 12px;">
                            <vs-button color="success" type="filled" size="small" @click="newAbono()" style="font-size: 11px; padding: 5px 12px; min-height: 30px;">
                                <i class="feather icon-plus" style="font-size: 12px; margin-right: 4px;"></i>
                                Nuevo Abono
                            </vs-button>
                            <vs-button color="primary" type="border" size="small" :disabled="totalAbonoNotas <= 0" @click="openabonoNotas()" style="font-size: 11px; padding: 5px 12px; min-height: 30px;">
                                <i class="feather icon-list" style="font-size: 12px; margin-right: 4px;"></i>
                                Ver Abonos ({{ totalAbonoNotas }})
                            </vs-button>
                            <vs-button color="dark" type="border" size="small" v-if="cargoDevoluciones" @click="popupPDF = true" style="font-size: 11px; padding: 5px 12px; min-height: 30px;">
                                <i class="feather icon-file-text" style="font-size: 12px; margin-right: 4px;"></i>
                                Reporte
                            </vs-button>
                        </div>

                        <!-- Bloques de detalle -->
                        <div :class="usarComponenteNuevo ? 'grid grid-cols-1 gap-4' : 'grid grid-cols-1 lg:grid-cols-2 gap-6'">
                        
                        <!-- BLOQUE PREFACTURAS (solo visible en modo antiguo) -->
                        <div v-if="!usarComponenteNuevo" class="bg-purple-50 p-6 rounded-xl shadow purple">
                            <h3 class="text-xl font-bold text-purple mb-4">PreFacturas</h3>
                            <table class="w-full text-sm text-gray-950 ">
                            <tr><td class="py-1">N° PreFacturas:</td><td class="text-right font-semibold">{{ cantidadFacturas }}</td></tr>
                            <tr><td class="py-1">Total Ventas:</td><td class="text-right font-semibold">${{ totalFacturas | filtrarDecimal }}</td></tr>
                            <tr><td class="py-1">N° Devoluciones Facturas:</td><td class="text-right font-semibold">{{ devolucionesFacturas.length }}</td></tr>
                            <tr><td class="py-1">Total Devoluciones Facturas:</td><td class="text-right font-semibold">${{ totalDevolucionesFacturas | filtrarDecimal }}</td></tr>
                            <tr><td class="py-1">Cant. Abonos:</td><td class="text-right font-semibold">{{ totalAbonoFacturas }}</td></tr>
                            <tr><td class="py-1">Abonado en PreFacturas:</td><td class="text-right font-semibold">${{ abonoFacturas | filtrarDecimal }}</td></tr>
                            <tr><td class="py-1">Cant. Retenciones:</td><td class="text-right font-semibold">{{ totalRetencionValor }}</td></tr>
                            <tr><td class="py-1">Total Retenciones:</td><td class="text-right font-semibold">${{ retencionValor | filtrarDecimal }}</td></tr>
                            <tr><td class="py-1">Cant. Cruces:</td><td class="text-right font-semibold">{{ totalCruceValor }}</td></tr>
                            <tr><td class="py-1">Total Cruces:</td><td class="text-right font-semibold">${{ cruceValor | filtrarDecimal }}</td></tr>
                            <tr><td class="py-1">N° Fact. Operativas:</td><td class="text-right font-semibold">{{ cantidadFacturasOperativasPrefacturas }}</td></tr>
                            <tr><td class="py-1">Total Fact. Operativas:</td><td class="text-right font-semibold">${{ totalFacturasOperativasPrefacturas | filtrarDecimal }}</td></tr>
                            <tr><td class="py-1">Total Pagos:</td><td class="text-right font-semibold">${{ totalDevolucionesFacturas + abonoFacturas + retencionValor + cruceValor | filtrarDecimal }}</td></tr>
                            <tr><td class="py-1">Saldo pendiente:</td><td class="text-right font-semibold">${{ (totalFacturas - totalDevolucionesFacturas - abonoFacturas - retencionValor - cruceValor) + totalFacturasOperativasPrefacturas | filtrarDecimal }}</td></tr>
                            </table>
                            <div class="mt-4 flex justify-center">
                                <vs-dropdown vs-custom-content vs-trigger-click>
                                    <vs-button color="purple" type="relief" icon="visibility">Ver Detalles</vs-button>
                                    <vs-dropdown-menu class="w-48">
                                        <vs-dropdown-item v-if="cantidadFacturas > 0" divider>
                                            <div @click="popupVerFacturas = true" class="p-2">PreFacturas</div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="devolucionesFacturas.length > 0" divider>
                                            <div @click="popupVerFacturasDevoluciones = true" class="p-2">Devoluciones</div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="totalRetencionValor > 0" divider>
                                            <div @click="ListadoRetenciones()" class="p-2">Retenciones</div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="totalCruceValor > 0" divider>
                                            <div @click="ListadoCruces('facturas')" class="p-2">Cruces</div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="cantidadFacturasOperativasPrefacturas > 0" divider>
                                            <div @click="filtroFacturasOperativas='prefacturas'; popupVerFacturasOperativas = true" class="p-2">Fact. Operativas</div>
                                        </vs-dropdown-item>
                                    </vs-dropdown-menu>
                                </vs-dropdown>
                            </div>
                            <div class="mt-4 text-center">
                            <p class="text-sm text-gray-800">N° Abonos PreFacturas: <b class="text-purple">{{ totalAbonoFacturas }}</b></p>
                            <vs-button v-if="totalAbonoFacturas > 0 && AdminFacturador" class="mt-2" color="#800080" type="relief" @click="openabonoFacturas()">Ver Abonos</vs-button>
                            </div>
                        </div>

                        <!-- BLOQUE PREFACTURAS (nuevo - línea compacta) -->
                        <div v-if="usarComponenteNuevo && cantidadFacturas > 0" style="display: flex; align-items: center; gap: 12px; background: #f8f9fa; border-left: 3px solid #8b5cf6; border-radius: 4px; padding: 6px 10px; margin-bottom: 10px;">
                            <span style="font-size: 10px; font-weight: 700; color: #475569;">PreFacturas</span>
                            <vs-chip color="dark" style="font-size: 7px; padding: 1px 5px;">Solo info</vs-chip>
                            <div style="display: flex; align-items: baseline; gap: 3px;">
                                <span style="font-size: 9px; color: #64748b;">Docs:</span>
                                <span style="font-size: 12px; font-weight: 700; color: #1e293b;">{{ cantidadFacturas }}</span>
                                <span style="font-size: 10px; font-weight: 600; color: #8b5cf6;">${{ totalFacturas | filtrarDecimal }}</span>
                            </div>
                            <div v-if="devolucionesFacturas.length > 0" style="display: flex; align-items: baseline; gap: 3px;">
                                <span style="font-size: 9px; color: #64748b;">Dev:</span>
                                <span style="font-size: 12px; font-weight: 700; color: #1e293b;">{{ devolucionesFacturas.length }}</span>
                                <span style="font-size: 10px; font-weight: 600; color: #8b5cf6;">${{ totalDevolucionesFacturas | filtrarDecimal }}</span>
                            </div>
                            <div style="flex: 1"></div>
                            <vs-button color="primary" type="border" size="small" @click="popupVerFacturas = true" style="font-size: 9px; padding: 2px 10px; min-height: 24px;">Ver</vs-button>
                        </div>

                        <!-- BLOQUE NOTAS -->
                        <div :class="usarComponenteNuevo ? 'notas-card-ejecutivo p-3 rounded-xl shadow notas-card-full' : 'bg-orange-50 p-6 rounded-xl shadow orange'">
                            <h3 :class="usarComponenteNuevo ? 'notas-title-ejecutivo mb-3' : 'text-xl font-bold text-orange mb-4'">Notas</h3>
                            <table v-if="!usarComponenteNuevo" class="w-full text-sm text-gray-950">
                            <tr><td class="py-1">N° Notas:</td><td class="text-right font-semibold">{{ cantidadNotas }}</td></tr>
                            <tr v-if="!usarComponenteNuevo"><td class="py-1">Total Ventas:</td><td class="text-right font-semibold">${{ totalNotas.toFixed(2) }}</td></tr>
                            <tr v-if="!usarComponenteNuevo || devolucionesNotas.length > 0"><td class="py-1">N° Devoluciones Notas:</td><td class="text-right font-semibold">{{ devolucionesNotas.length }}</td></tr>
                            <tr v-if="!usarComponenteNuevo"><td class="py-1">Total Devoluciones Notas:</td><td class="text-right font-semibold">${{ totalDevolucionesNotas | filtrarDecimal }}</td></tr>
                            <tr v-if="!usarComponenteNuevo || totalAbonoNotas > 0"><td class="py-1">Cant. Abonos:</td><td class="text-right font-semibold">{{ totalAbonoNotas }}</td></tr>
                            <tr v-if="!usarComponenteNuevo"><td class="py-1">Abonado en Notas:</td><td class="text-right font-semibold">${{ abonoNotas.toFixed(2) }}</td></tr>
                            <tr v-if="!usarComponenteNuevo || totalCruceValorNotas > 0"><td class="py-1">Cant. Cruces:</td><td class="text-right font-semibold">{{ totalCruceValorNotas }}</td></tr>
                            <tr v-if="!usarComponenteNuevo"><td class="py-1">Total Cruces:</td><td class="text-right font-semibold">${{ cruceValorNotas | filtrarDecimal }}</td></tr>

                             <!-- Facturas Operativas (Notas) -->
                             <tr v-if="!usarComponenteNuevo || cantidadFacturasOperativasNotas > 0"><td class="py-1">N° Fact. Operativas:</td><td class="text-right font-semibold">{{ cantidadFacturasOperativasNotas }}</td></tr>
                             <tr v-if="!usarComponenteNuevo"><td class="py-1">Total Fact. Operativas:</td><td class="text-right font-semibold">${{ totalFacturasOperativasNotas | filtrarDecimal }}</td></tr>

                            <tr v-if="!usarComponenteNuevo"><td class="py-1">Saldo pendiente:</td><td class="text-right font-semibold">${{ (totalNotas - totalDevolucionesNotas - abonoNotas - cruceValorNotas) + totalFacturasOperativasNotas | filtrarDecimal }}</td></tr>
                            <!-- <tr v-if="usarComponenteNuevo"><td colspan="2" class="py-2 text-sm text-gray-700">Los totales monetarios se muestran en las tarjetas KPI superiores.</td></tr> -->
                            </table>

                            <div v-if="usarComponenteNuevo" class="resumen-ejecutivo-row resumen-notas-scroll">
                                <div class="resumen-ejecutivo-item">
                                    <span class="resumen-ejecutivo-label">Notas</span>
                                    <span class="resumen-ejecutivo-main">{{ cantidadNotas }}</span>
                                    <span class="resumen-ejecutivo-value">${{ totalNotas | filtrarDecimal }}</span>
                                </div>
                                <div class="resumen-ejecutivo-item">
                                    <span class="resumen-ejecutivo-label">Devoluciones</span>
                                    <span class="resumen-ejecutivo-main">{{ devolucionesNotas.length }}</span>
                                    <span class="resumen-ejecutivo-value">${{ totalDevolucionesNotas | filtrarDecimal }}</span>
                                </div>
                                <div class="resumen-ejecutivo-item">
                                    <span class="resumen-ejecutivo-label">Abonos</span>
                                    <span class="resumen-ejecutivo-main">{{ totalAbonoNotas }}</span>
                                    <span class="resumen-ejecutivo-value">${{ abonoNotasGestionadoNuevo | filtrarDecimal }}</span>
                                </div>
                                <div class="resumen-ejecutivo-item">
                                    <span class="resumen-ejecutivo-label">Fact. Operativas</span>
                                    <span class="resumen-ejecutivo-main">{{ cantidadFacturasOperativasNotas }}</span>
                                    <span class="resumen-ejecutivo-value">${{ totalFacturasOperativasNotas | filtrarDecimal }}</span>
                                </div>
                                <div class="resumen-ejecutivo-item resumen-ejecutivo-item-saldo">
                                    <span class="resumen-ejecutivo-label">Saldo</span>
                                    <span class="resumen-ejecutivo-value">${{ saldoPendienteNuevo | filtrarDecimal }}</span>
                                </div>
                            </div>

                            <!-- Acciones -->
                            <!-- Acciones Dropdown -->
                            <div class="mt-4 flex justify-center">
                                <vs-dropdown vs-custom-content vs-trigger-click>
                                    <vs-button :color="usarComponenteNuevo ? 'warning' : 'orange'" :type="usarComponenteNuevo ? 'border' : 'relief'" icon="visibility">Ver Detalles</vs-button>
                                    <vs-dropdown-menu class="w-48">
                                        <vs-dropdown-item v-if="cantidadNotas > 0" divider>
                                            <div @click="popupVerNotas = true" class="p-2">
                                                Notas
                                            </div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="devolucionesNotas.length > 0" divider>
                                            <div @click="popupVerNotasDevoluciones = true" class="p-2">
                                                Devoluciones
                                            </div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="!usarComponenteNuevo && totalCruceValorNotas > 0" divider>
                                            <div @click="ListadoCruces('notas')" class="p-2">
                                                Cruces
                                            </div>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="cantidadFacturasOperativasNotas > 0" divider>
                                            <div @click="filtroFacturasOperativas='notas'; popupVerFacturasOperativas = true" class="p-2">
                                                Fact. Operativas
                                            </div>
                                        </vs-dropdown-item>
                                    </vs-dropdown-menu>
                                </vs-dropdown>
                            </div>

                            <div v-if="!usarComponenteNuevo" class="mt-4 text-center">
                            <p class="text-sm text-gray-800">N° Abonos Notas: <b class="text-orange">{{ totalAbonoNotas }}</b></p>
                            <vs-button v-if="totalAbonoNotas > 0 && AdminFacturador" class="mt-2" color="orange" type="relief" @click="openabonoNotas()">Ver Abonos</vs-button>
                            </div>
                        </div>

                         <!-- BLOQUE FACTURAS OPERATIVAS ELIMINADO -->
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
    <div v-if="mostrarCheques && !usarComponenteNuevo" class="m-3">
        <vs-divider>Sección Cheques</vs-divider>
        <div style="align-content: start;" v-if="AdminFacturador">
            <div>
                <div class="flex justify-start">
                    <div class="m-2">
                        <vs-button color="primary" type="relief" @click="newCheque()">Registro cheque</vs-button>
                    </div>
                </div>
            </div>
            <div class="m-2">
                <screenCheques :nombreCliente="nombreCliente" :datosCliente="datosCliente" :empresaCobranza="empresaCobranza" :Cheques="Cheques" :permisosCheque="permisosCheque" :periodoSelect="periodoSelect" :periodoPuntosOInstitucion="periodoPuntosOInstitucion" @chequeCobrado="chequeCobrado" :totalFacturas="totalFacturas" :totalNotas="totalNotas" />
            </div>
        </div>
    </div>
    <div>
        <!-- <div v-if="menu == 1"> -->
        <!-- <vs-button line-position="top" line-origin="right" color="primary" type="line" @click="menu = 3; mostrarCheques = true;">🡨 Regresar</vs-button> -->
        <vs-popup v-if="popupVerFacturas" title="Facturas" :active.sync="popupVerFacturas" class="popopPadre popup-cobranza-estandar">
            <screenFacturas v-if="popupVerFacturas" :arreglofacturas="arreglofacturas" :institucionPuntosOInstitucion="institucionPuntosOInstitucion" :periodoPuntosOInstitucion="periodoPuntosOInstitucion" />
        </vs-popup>
        <vs-popup fullscreen v-if="popupVerFacturasDevoluciones" title="Devoluciones de Facturas" :active.sync="popupVerFacturasDevoluciones" class="popopPadre popup-cobranza-estandar">
            <!-- {{devolucionesFacturas}} -->
            <screenFacturasDevolucion v-if="popupVerFacturasDevoluciones" :devolucionesFacturas="devolucionesFacturas" :institucionPuntosOInstitucion="institucionPuntosOInstitucion" :periodoPuntosOInstitucion="periodoPuntosOInstitucion" />
        </vs-popup>
    </div>
    <div>
        <!-- <div v-if="menu == 2"> -->
        <!-- <vs-button line-position="top" line-origin="right" color="primary" type="line" @click="menu = 3; mostrarCheques = true;">🡨 Regresar</vs-button> -->
        <vs-popup fullscreen v-if="popupVerNotas" title="Notas" :active.sync="popupVerNotas" class="popopPadre popup-cobranza-estandar">
            <screenNotas v-if="popupVerNotas" :arreglonotas="arreglonotas" />
        </vs-popup>
        <vs-popup fullscreen v-if="popupVerNotasDevoluciones" title="Devoluciones de Notas" :active.sync="popupVerNotasDevoluciones" class="popopPadre popup-cobranza-estandar">
            <screenNotasDevolucion v-if="popupVerNotasDevoluciones" :devolucionesNotas="devolucionesNotas" />
        </vs-popup>
    </div>
    <div>
        <!-- POPUP VER LISTADO FACTURAS OPERATIVAS -->
        <vs-popup v-if="popupVerFacturasOperativas" title="Listado Facturas Operativas" :active.sync="popupVerFacturasOperativas" class="popopPadre popup-cobranza-estandar">
            <div class="p-4">
                 <vs-table max-items="10" pagination search :data="facturasOperativasFiltradas">
                    <template slot="thead">
                        <vs-th>Documento</vs-th>
                        <vs-th>Fecha</vs-th>
                        <vs-th>Destino</vs-th>
                        <vs-th>Estado</vs-th>
                        <vs-th>Observación</vs-th>
                        <vs-th>Valor</vs-th>
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>{{ tr.ven_codigo }}</vs-td>
                            <vs-td>{{ tr.ven_fecha }}</vs-td>
                            <vs-td>
                                <vs-chip :color="tr.destino_nombre == 'Notas' ? 'warning' : 'purple'">
                                    {{ tr.destino_nombre || (tr.ven_observacion && tr.ven_observacion.includes('Notas') ? 'Notas' : 'PreFacturas') }}
                                </vs-chip>
                            </vs-td>
                            <vs-td>
                                <vs-chip :color="tr.est_ven_codigo === 3 ? 'danger' : 'success'">
                                    {{ tr.est_ven_codigo === 3 ? 'ANULADO' : 'COMPLETO' }}
                                </vs-chip>
                            </vs-td>
                            <vs-td>{{ tr.ven_observacion }}</vs-td>
                            <vs-td>$ {{ tr.ven_valor | filtrarDecimal }}</vs-td>
                            <vs-td>
                                <vs-button size="small" color="primary" icon="print" @click="verPDFFacturaOperativa(tr)">Imprimir</vs-button>
                                <vs-button v-if="tr.est_ven_codigo !== 3" size="small" color="danger" icon="block" @click="anularFacturaOperativa(tr)" class="ml-2">Anular</vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </vs-popup>

        <!-- POPUP IMPRIMIR FACTURA OPERATIVA (Igual a Proformas) -->
        <vs-popup v-if="popupImprimirFacturaOperativa" title="Imprimir Factura Operativa" :active.sync="popupImprimirFacturaOperativa" class="popup-pdf-hijo popup-cobranza-estandar popup-cobranza-pdf">
            <FacturaOperativaPDF v-if="popupImprimirFacturaOperativa" :factura="facturaOperativaImprimir" :datosCliente="datosCliente[0]" :empresa="empresa" />
        </vs-popup>
    </div>
    <div>
        <vs-popup fullscreen :title="`Devoluciones sin empresa`" :active.sync="popupVerSinEmpresa" class="popopPadre popup-cobranza-estandar">
            <div>
                <div>
                    <h4 style="color: red;">ESTOS <b>VALORES DE DOCUMENTOS DE DEVOLUCIÓN</b> NO HAN SIDO APLICADOS A NINGUNA EMPRESA Y NO TIENEN DESCUENTOS APLICADOS.</h4>
                </div>
                <!-- Mostrar tabla de devoluciones sin empresa -->
                <div v-if="datosDevolucionesSinEmpresa.length > 0">
                    <vs-table max-items="10" pagination search :data="datosDevolucionesSinEmpresa">
                        <template slot="thead">
                            <vs-th>Codigo Devolución</vs-th>
                            <vs-th>Institución</vs-th>
                            <vs-th>Total Precio</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>{{ tr.codigo_devolucion }}</vs-td>
                                <vs-td>{{ tr.nombreInstitucion }}</vs-td>
                                <vs-td>{{ tr.total_precio.toFixed(2) }}</vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>

                    <!-- Mostrar el total de devoluciones -->
                    <div class="total">
                        <strong>Total Devoluciones Sin Empresa:</strong>
                        <h4 class="mx-3">{{ totalDevolucionesSinEmpresa.toFixed(2) }}</h4>
                    </div>
                </div>

                <!-- Mostrar mensaje si no hay datos -->
                <div v-else>
                    <p>No hay devoluciones sin empresa.</p>
                </div>
            </div>
        </vs-popup>
    </div>
    <vs-popup v-if="popupAbonos" title="Abono" :active.sync="popupAbonos" @close="handleCloseAbono" :class="[{ 'popup-cobranza-estandar': usarComponenteNuevo }, { 'hide-close': !showCloseButton }]" fullscreen>
        <div v-if="usarComponenteNuevo" >
            <div class="abono-nuevo-header">
                <div class="abono-nuevo-header-left">
                    <!-- <div class="abono-nuevo-eyebrow">Nuevo flujo</div> -->
                    <div class="abono-nuevo-title">Abono a Notas</div>
                    <div class="abono-nuevo-subtitle">Distribuye el valor entre las notas y valida que cuadre exacto.</div>
                </div>
                <div class="abono-nuevo-summary">
                    <div class="abono-summary-card">
                        <span>Valor abono</span>
                        <b>${{ Number(tabAbono.valor) | filtrarDecimal }}</b>
                    </div>
                    <div class="abono-summary-card">
                        <span>Distribuido</span>
                        <b>${{ totalDistribuidoAbonoNuevo | filtrarDecimal }}</b>
                    </div>
                    <div class="abono-summary-card abono-summary-card-warning">
                        <span>Saldo</span>
                        <b>${{ saldoPendienteDistribucionNuevo | filtrarDecimal }}</b>
                    </div>
                </div>
            </div>

            <div class="abono-nuevo-badges">
                <span class="abono-chip abono-chip-primary">Destino: Notas</span>
                <span class="abono-chip">Concepto oculto para usuario</span>
                <span class="abono-chip">Validación: suma exacta</span>
            </div>

            <div class="abono-nuevo-form-grid">
                <div class="abono-field">
                    <label>Fecha</label>
                    <flat-pickr :config="configdateTimePicker" v-model="tabAbono.fecha" placeholder="Fecha" style="display:inline-block;width:100%" />
                </div>
                <div class="abono-field">
                    <label>Cuenta</label>
                    <v-select :options="Cuentas" :reduce="Cuentas => Cuentas.cue_pag_codigo" label="cue_pag_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabAbono.cuenta" />
                </div>
                <div class="abono-field">
                    <label>Tipo</label>
                    <div class="flex flex-wrap gap-3 pt-2">
                        <vs-radio v-model="tabAbono.tipoAbono" vs-name="radiostipoAbonoNuevo" vs-value="0">Deposito</vs-radio>
                        <vs-radio v-model="tabAbono.tipoAbono" vs-name="radiostipoAbonoNuevo" vs-value="1">Transferencia</vs-radio>
                    </div>
                </div>
                <div class="abono-field">
                    <label>Documento Abono #</label>
                    <vs-input type="number" class="w-full" v-model="tabAbono.numeroDocumento" placeholder="Numero deposito" @blur="agregarValorAlTextarea" />
                </div>
                <div class="abono-field">
                    <label>Valor a distribuir</label>
                    <vs-input type="number" class="w-full" v-model="tabAbono.valor" placeholder="Valor" @input="calcularTotalDistribuidoAbonoNuevo" />
                </div>
                <div class="abono-field">
                    <label>Destino</label>
                    <div class="flex gap-4 pt-2 abono-destino-fixed">
                        <vs-radio v-model="tabAbono.notasOfactura" vs-name="radiosNotasNuevo" vs-value="1">Notas</vs-radio>
                        <vs-radio v-model="tabAbono.notasOfactura" vs-name="radiosNotasNuevo" vs-value="0" disabled>Facturas</vs-radio>
                    </div>
                </div>
            </div>

            <div class="abono-nuevo-tabla mt-4">
                <div class="abono-section-title">Distribución por documento</div>
                <div class="abono-table-head">
                    <span>Documento</span>
                    <span>Valor</span>
                    <span>Ya abonado</span>
                    <span>Disponible</span>
                    <span>Abono</span>
                </div>
                <div v-if="documentosAbonoNuevo.length > 0" class="abono-table-body">
                    <div v-for="(tr, indextr) in documentosAbonoNuevo" :key="indextr" class="abono-table-row" :class="{ 'abono-table-row-disabled': Number(tr.saldo_disponible) <= 0 }">
                        <span class="abono-doc-code">{{ tr.ven_codigo }}</span>
                        <span>${{ Number(tr.ven_valor).toFixed(2) }}</span>
                        <span>${{ Number(tr.ven_valor_abono).toFixed(2) }}</span>
                        <span class="abono-disponible">${{ Number(tr.saldo_disponible).toFixed(2) }}</span>
                        <vs-input type="number" class="abono-input-mini" v-model="tr.abono_manual" @input="actualizarDistribucionAbonoNuevo(indextr)" :max="tr.saldo_disponible" min="0" :disabled="Number(tr.saldo_disponible) <= 0" />
                    </div>
                </div>
                <div v-else class="abono-empty-state">
                    No hay notas disponibles para distribuir.
                </div>
            </div>

            <input type="hidden" v-model="tabAbono.concepto" />

            <div class="flex justify-center gap-3 mt-4 pb-2">
                <vs-button @click="guardarAbono()" type="relief">Guardar</vs-button>
                <vs-button @click="popupAbonos=false" color="danger" type="relief">Cancelar</vs-button>
            </div>
        </div>
        <div v-else>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>Fecha: </div>
                        <!-- <vs-input type="date" class="inputx w-full mb-6" v-model="tabAbono.fecha" placeholder="fecha"/> -->
                        <flat-pickr :config="configdateTimePicker" v-model="tabAbono.fecha" placeholder="Fecha " style="display: inline-block;width: 100%" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Cuenta:</font><br>
                        <v-select :options="Cuentas" :reduce="Cuentas => Cuentas.cue_pag_codigo" label="cue_pag_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabAbono.cuenta" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row class="mt-2">
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                    <div class="text-danger" v-if="tabAbono.cuenta == 6"><b>Ingreso de liquidación</b></div>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row class="mt-2">
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div class="mb-2">Tipo:</div>
                        <vs-radio v-model="tabAbono.tipoAbono" class="ml-2" vs-name="radiostipoAbono" vs-value="0">Deposito</vs-radio>
                        <vs-radio v-model="tabAbono.tipoAbono" class="ml-2" vs-name="radiostipoAbono" vs-value="1">Transferencia</vs-radio>
                        <!-- <vs-radio v-model="tabAbono.tipoAbono" class="ml-2" vs-name="radiostipoAbono" vs-value="2" >cheque</vs-radio> -->
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div class="mb-2">Documento Abono #:</div>
                        <vs-input type="number" class="inputx w-full mb-6" v-model="tabAbono.numeroDocumento" placeholder="Numero deposito" @blur="agregarValorAlTextarea" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row class="mt-2">
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div class="mb-2">Destino:</div>
                        <!-- <vs-radio v-model="tabAbono.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="1" :disabled="totalNotas == 0" @change="resetearValor">Notas</vs-radio>
                                    <vs-radio v-model="tabAbono.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="0" :disabled="totalFacturas == 0" @change="resetearValor">Facturas</vs-radio> -->
                        <vs-radio v-model="tabAbono.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="1">Notas</vs-radio>
                        <vs-radio v-model="tabAbono.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="0" :disabled="usarComponenteNuevo">Facturas</vs-radio>
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>Valor Abono:</div>
                        <!-- <vs-input type="text" class="inputx w-full mb-6" v-model="tabAbono.valor" placeholder="Valor" :disabled="!tabAbono.notasOfactura" @click.native="seleccionTipo" @keypress="validateInput" @paste="validatePaste" min="0" :max="tabAbono.notasOfactura == 0 ? (totalNotas - abonoNotas): (totalFacturas - abonoFacturas)" @input="validateQuantity()" /> -->
                        <vs-input type="text" class="inputx w-full mb-6" v-model="tabAbono.valor" placeholder="Valor" :disabled="!tabAbono.notasOfactura" @paste="validatePaste" min="0" @click.native="seleccionTipo" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row class="mt-2">
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>Concepto del Abono:</div>
                        <!-- <vs-input type="text" class="inputx w-full mb-6" v-model="tabAbono.valor" placeholder="Valor" :disabled="!tabAbono.notasOfactura" @click.native="seleccionTipo" @keypress="validateInput" @paste="validatePaste" min="0" :max="tabAbono.notasOfactura == 0 ? (totalNotas - abonoNotas): (totalFacturas - abonoFacturas)" @input="validateQuantity()" /> -->
                        <div @mousedown="seleccionTipo2">
                            <vs-textarea class="inputx w-full mb-6" v-model="tabAbono.concepto" placeholder="concepto" :readonly="!tabAbono.numeroDocumento" />
                        </div>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="guardarAbono()" type="relief">Guardar</vs-button>&emsp;
            <vs-button @click="popupAbonos=false" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
        </div>
    </vs-popup>
    <vs-popup fullscreen v-if="popupAbonosNotas" title="Notas abonos" :active.sync="popupAbonosNotas" :class="usarComponenteNuevo ? 'popopPadre popup-cobranza-estandar' : 'popopPadre'">
        <notasAbonoNuevo v-if="usarComponenteNuevo" :periodo="periodoPuntosOInstitucion" :empresa="empresa.id" :cliente="datosCliente[0].identificacion" @actualizarTodo="actualizarTodo" />
        <notasAbono v-else :periodo="periodoPuntosOInstitucion" :empresa="empresa.id" :cliente="datosCliente[0].identificacion" @actualizarTodo="actualizarTodo" />

        <!-- <vs-table max-items="10" pagination :data="arregloAbonoNotas">
                        <template slot="thead">
                            <vs-th>Información</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    <b>Fecha Abono:</b> {{ tr.abono_fecha }} <br>
                                    <b>Valor Abono:</b> ${{ tr.abono_notas }} <br>
                                    <b>Tipo:</b> {{ tr.abono_tipo == 0 ? 'Deposito': tr.abono_tipo == 1 ? 'Transferencia': tr.abono_tipo == 2 ? 'Cheque': ' Retencion' }} <br>
                                    <b>Documento:</b> {{ tr.abono_documento }} <br>
                                </vs-td>
                                <vs-td align="center">
                                  <vx-tooltip v-if="usuario.id_group==1"text="Editar" position="top" color="danger">
                                        <vs-button  v-if="tr.estadoPerseo == 0" @click="remover(tr);" color="danger" type="relief" icon="delete"></vs-button>
                                  </vx-tooltip>
                              </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                    <br><br>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                        <vs-button @click="popupAbonosNotas=false" color="danger" type="relief">Volver</vs-button>
                    </vs-col> -->
    </vs-popup>
    <vs-popup fullscreen v-if="popupAbonosFacturas" title="Facturas abonos" :active.sync="popupAbonosFacturas" class="popopPadre">
        <!-- <facturasAbono :arregloAbonoFacturas="arregloAbonoFacturas" :periodo="periodoPuntosOInstitucion" :empresa="empresa.id" :cliente="datosCliente[0].identificacion"/> -->
        <facturasAbono :periodo="periodoPuntosOInstitucion" :empresa="empresa.id" :cliente="datosCliente[0].identificacion" @actualizarTodo="actualizarTodo" />
        <!-- <pre>{{ arregloAbonoFacturas }}</pre> -->
        <!-- <vs-table max-items="10" pagination :data="arregloAbonoFacturas">
                        <template slot="thead">
                            <vs-th>Información Abono</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    <b>Fecha Abono:</b> {{ tr.abono_fecha }} <br>
                                    <b>Valor Abono:</b> ${{ tr.abono_facturas }} <br>
                                    <b>Tipo:</b> {{ tr.abono_tipo == 0 ? 'Deposito': tr.abono_tipo == 1 ? 'Transferencia': tr.abono_tipo == 2 ? 'Cheque': ' Retencion' }} <br>
                                    <b>Documento:</b> {{ tr.abono_documento }} <br>
                                    <b>Concepto:</b> {{ tr.abono_concepto  }} <br>
                                    <b>Estado envio Perseo:</b>
                                    <div v-if="tr.estadoPerseo == 0">
                                        <vs-chip color="warning">No enviado a perseo</vs-chip>
                                    </div>
                                    <div v-else>
                                        <vs-chip color="success">Enviado a perseo</vs-chip>
                                    </div>
                                </vs-td>
                                <vs-td align="center">
                                  <vx-tooltip v-if="usuario.id_group==1" ext="Eliminar" position="top" style="z-index: 9999;">
                                        <vs-button  v-if="tr.estadoPerseo == 0" @click="remover(tr);" color="danger" type="relief" icon="delete"></vs-button>
                                  </vx-tooltip>
                                  <vs-button v-if="tr.estadoPerseo == 0" @click="tipoAbono=0;popupAbonosFacturas=false;ObjectSelected=tr;openConfirmEnviarPerseo(tr,1);" class="mt-3" color="primary" type="relief" icon="check">Enviar a perseo</vs-button>
                                  <br>
                              </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                    <br><br>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                        <vs-button @click="popupAbonosFacturas=false" color="danger" type="relief">Volver</vs-button>
                    </vs-col> -->
    </vs-popup>
    <vs-popup v-if="promptVisible" title="Abonos Eliminacion" :active.sync="promptVisible">
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b style="font-size: 15px">Confirmar Eliminacion De Abono</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    ¿Estás seguro que deseas eliminar el abono con ID {{ abono_id.abono_id }}?
                </vs-row>
                <br><br>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                    <vs-button @click="eliminarAbono(abono_id)" color="danger" type="relief">Aceptar</vs-button>
                    <vs-button @click="cancelarEliminarAbono()" color="success" type="relief">Cancelar</vs-button>
                </vs-col>
            </vs-col>
        </vs-row>
    </vs-popup>
    <vs-popup v-if="popupCheques" :title="`Registro Cheque de ${ tabCheque.institucion }`" :active.sync="popupCheques" @close="handleCloseCheque" :class="{ 'hide-close': !showCloseButton, 'popup-cobranza-estandar': usarComponenteNuevo }">
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Banco:</font><br>
                        <!-- <v-select :options="Bancos" :reduce="Bancos => Bancos.ban_codigo" label="ban_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabCheque.banco" /> -->
                        <v-select :options="Bancos" :reduce="Bancos => Bancos" label="descripcion" class="w-full h-100" placeholder="--Seleccione--" v-model="tabCheque.banco" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Tipo de cheque:</font><br>
                        <v-select :options="tipoCheque" :reduce="(tipoCheque) => tipoCheque.value" label="text" value="value" class="w-full h-100" placeholder="--Seleccione--" v-model="tabCheque.tipoCheque" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>Valor:</div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="tabCheque.valor" placeholder="Valor" @keypress="validateInput" @paste="validatePaste" min="0" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col v-if="tabCheque.tipoCheque === 1" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>Fecha de cobro:</div>
                        <flat-pickr :config="configdateTimePicker" v-model="tabCheque.fechaCobro" placeholder="Fecha de cobro" style="display: inline-block;width: 100%" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row class="mt-2">
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div class="mb-2">Cuenta N°:</div>
                        <vs-input type="number" class="inputx w-full mb-6" v-model="tabCheque.cuentaCheque" placeholder="Cuenta numero" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div class="mb-2">Numero de Cheque:</div>
                        <vs-input type="number" class="inputx w-full mb-6" v-model="tabCheque.numeroCheque" placeholder="Numero de cheque" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row class="mt-2">
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>Referencia:</div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="tabCheque.referencia" placeholder="Numero Documento" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="guardarCheque()" type="relief">Guardar</vs-button>&emsp;
            <vs-button @click="popupCheques=false" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <vs-popup v-if="popupPDF" title="Reporte de Cartera" :active.sync="popupPDF" class="popup-cobranza-pdf" fullscreen>
        <div align="center" class="mb-5">
            <vs-button v-if="!usarComponenteNuevo || !datosCliente || !datosCliente[0].clientesid_perseo" @click="imprimirPDF" type="relief" color="danger">Imprimir PDF</vs-button>
            <vs-button v-if="!usarComponenteNuevo || !datosCliente || !datosCliente[0].clientesid_perseo" @click="descargarExcel" type="relief" color="success" class="mx-5">Descargar Excel</vs-button>
        </div>
        <div class="mt-4">
            <reportePerseoIndividual v-if="usarComponenteNuevo && datosCliente && datosCliente.length > 0 && datosCliente[0].clientesid_perseo" 
                :datosCliente="datosCliente" 
                :clientesidPerseo="datosCliente[0].clientesid_perseo" 
                :empresaCobranza="empresaCobranza"
                :datosFacturasNotas="datosFacturasNotas"
                :datosAbonos="datosAbonos"
                :periodoPuntosOInstitucion="periodoPuntosOInstitucion"
                :periodoSelect="periodoSelect"
                :devoluciones_all="devoluciones_all"
                :tiposDocumento="tiposDocumento"
                ref="hijoComponente" />
            <div v-else>
                <reporteNuevo v-if="usarComponenteNuevo" :datosCliente="datosCliente" :empresaCobranza="empresaCobranza" :periodoPuntosOInstitucion="periodoPuntosOInstitucion" :periodoSelect="periodoSelect" :devoluciones_all="devoluciones_all" ref="hijoComponente" />
                <reporte v-else :datosCliente="datosCliente" :empresaCobranza="empresaCobranza" :periodoPuntosOInstitucion="periodoPuntosOInstitucion" :periodoSelect="periodoSelect" :devoluciones_all="devoluciones_all" ref="hijoComponente" />
            </div>
        </div>
    </vs-popup>
    <vs-popup :title="`Generar Retención `" :active.sync="popupRetencion" v-if="userRoot">
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>Fecha Retención:</div>
                        <flat-pickr :config="configdateTimePicker" v-model="tabRetencion.fechaRetencion" placeholder="Fecha de cobro" style="display: inline-block;width: 100%" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">Retencion de Retención:</font><br>
                        <v-select :options="porcentajeRetencion" :reduce="(porcentajeRetencion) => porcentajeRetencion.value" label="text" value="value" class="w-full h-100" placeholder="--Seleccione--" v-model="tabRetencion.porcentajeRetencion" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div>N° de Documento:</div>
                        <vs-input type="text" class="inputx w-full mb-6" v-model="tabRetencion.documento" placeholder="Numero de documento" @keypress="validateInput" @paste="validatePaste" min="0" readonly />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <div class="mb-2">Valor Retención:</div>
                        <vs-input type="number" class="inputx w-full mb-6" v-model="tabRetencion.valor" placeholder="Valor Retencion" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="guardarRetencion()" type="relief">Guardar</vs-button>&emsp;
            <vs-button @click="popupRetencion=false" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
        <!-- <pre>{{ arregloaFactura }}</pre> -->
    </vs-popup>
    <!-- SECCION NUEVA RETENCION -->
    <vs-popup fullscreen class="informacionformhijo" @close="MetodosInicio()" title="Nueva Retención" :active.sync="popupRetencionNew">
        <RetencionesComponent v-if="popupRetencionNew" :verificareditornew="verificareditornew" :datos="datosCliente[0]" :empresa="empresaCobranza" @change="changeHandleRetencionComponent" />
    </vs-popup>
    <!-- SECCION LISTADO RETENCIONES -->
    <vs-popup fullscreen class="informacionformhijo" @close="MetodosInicio()" title="Listado Retenciones" :active.sync="popupListadoRetencion">
        <ListadoRetencionesComponent v-if="popupListadoRetencion" :datos="datosCliente[0]" :empresa="empresaCobranza" @change="changeHandleListadoRetencionComponent" />
    </vs-popup>
    <!-- SECCION CUENTAS CRUZADAS -->
    <!-- CREAR CRUCE -->
    <vs-popup fullscreen class="informacionformhijo" @close="CerrarCrearcionCruce('cancelar-guardado')" title="Crear Cruce" :active.sync="popupCuentasCruzadas">
        <createdCuentasCruzadas v-if="popupCuentasCruzadas" :datos="datosCliente[0]" :empresa="empresaCobranza" :periodoSelect="periodoSelect" :usarComponenteNuevo="usarComponenteNuevo" @CerrarCrearcionCruce="CerrarCrearcionCruce" />
    </vs-popup>
    <!-- SECCION LISTADO CRUCES -->
    <vs-popup fullscreen class="informacionformhijo" title="Listado Cruces" :active.sync="popupListadoCruces">
        <ListadoCrucesComponent v-if="popupListadoCruces" :datos="datosCliente[0]" :empresa="empresaCobranza" :periodoSelect="periodoSelect" :tipoListadoCruces="tipoListadoCruces" @editadoCruce="editadoCruce" />
    </vs-popup>

    <!-- MODAL FACTURA OPERATIVA -->
    <vs-popup fullscreen title="Factura Operativa" :active.sync="popupFacturaOperativa">
        <div class="p-4">
            <!-- Header con Información (Codigo y Fecha) -->
            <div class="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                    <label class="font-bold block text-sm mb-1">Documento:</label>
                    <span class="text-lg font-bold text-primary">{{ facturaOperativa.numeroDocumento || 'Generando...' }}</span>
                </div>
                <!-- Fecha -->
                <div class="text-left">
                    <label class="font-bold block text-sm mb-1">Fecha:</label>
                    <div style="width: 150px;">
                        <flat-pickr :config="configdateTimePicker" v-model="facturaOperativa.fecha" placeholder="Fecha" style="width: 100%;" />
                    </div>
                </div>
            </div>

            <!-- Destino -->
             <!-- <vs-radio v-model="tabAbono.notasOfactura" class="ml-2" vs-name="radiosNotas" vs-value="1">Notas</vs-radio> -->
            <div class="mb-6">
                <label class="block font-bold mb-2">Destino</label>
                <div class="flex gap-4">
                    <vs-radio v-model="facturaOperativa.destino" vs-name="radioDestino" vs-value="0">Prefacturas</vs-radio>
                    <vs-radio v-model="facturaOperativa.destino" vs-name="radioDestino" vs-value="1">Notas</vs-radio>
                </div>
            </div>

            <!-- Cliente -->
            <div class="mb-6">
                <label class="block font-bold mb-2">Cliente</label>
                <div class="border p-2 rounded bg-gray-100">
                    {{ datosCliente.length > 0 ? datosCliente[0].razonsocial : 'Cliente no seleccionado' }}
                </div>
            </div>

            <!-- Observacion -->
            <div class="mb-6">
                <label class="block font-bold mb-2">Observación</label>
                <vs-textarea v-model="facturaOperativa.observacion" placeholder="Ingresar una observación" class="w-full" height="100px" />
            </div>

            <!-- Valor Total -->
            <div class="mb-6">
                <label class="block font-bold mb-2">Valor total</label>
                <vs-input 
                    type="number" 
                    v-model="facturaOperativa.valor" 
                    placeholder="Valor numerico" 
                    class="w-full" 
                    :danger="errorValor != ''" 
                    :danger-text="errorValor"
                    @input="validarValorDebounce()"
                />
            </div>

            <!-- Botones -->
            <div class="flex justify-center gap-4 mt-8">
                <vs-button color="success" type="border" @click="guardarFacturaOperativa()">Guardar</vs-button>
                <vs-button color="danger" type="border" @click="popupFacturaOperativa = false">Cancelar</vs-button>
            </div>
        </div>
    </vs-popup>
</div>
</template>

<script>
import screenFacturas from "./facturas/screenFacturas.vue";
import screenFacturasDevolucion from "./facturas/screenDevolucionesFactura.vue";
import screenNotasDevolucion from "./facturas/screenDevolucionesNota.vue";
import screenNotas from "./facturas/screenNotas.vue";
import screenCheques from "./facturas/screenCheques.vue";
import createdCuentasCruzadas from "./cruceCuentas/createdCuentasCruzadas.vue";
import ListadoCrucesComponent from "./cruceCuentas/listCuentasCruzadas.vue";
import reporte from "./components/reporteIndividualCobranza.vue";
import reporteNuevo from "./components/reporteIndividualCobranzaNuevo.vue";
import reportePerseoIndividual from "./components/reportePerseoIndividual.vue";
import facturasAbono from "./components/facturasAbono.vue";
import notasAbonoNuevo from "./components/notasAbonoNuevo.vue";
import notasAbono from "./components/notasAbono.vue";
import vSelect from "vue-select";
import flatPickr from 'vue-flatpickr-component';
import {
    mapState
} from "vuex";
import * as XLSX from 'xlsx';
import imprimirMixin from "@/mixins/Pedidosmix";
const RetencionesComponent = () => import("@/views/pedidos2/pedidos/cobranzas/components/Retencioncomponent.vue");
const ListadoRetencionesComponent = () => import("@/views/pedidos2/pedidos/cobranzas/components/RetencionListado.vue");

export default {
    mixins: [imprimirMixin],
    components: {
        "v-select": vSelect,
        flatPickr,
        screenFacturas,
        screenFacturasDevolucion,
        screenNotas,
        screenNotasDevolucion,
        screenCheques,
        facturasAbono,
        notasAbono,
        notasAbonoNuevo,
        imprimirMixin,
        reporte,
        reporteNuevo,
        reportePerseoIndividual,
        RetencionesComponent,
        ListadoRetencionesComponent,
        createdCuentasCruzadas,
        ListadoCrucesComponent,
        FacturaOperativaPDF: () => import('./FacturaOperativaPDF.vue')
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'AdminFacturador']),
        facturasOperativasFiltradas() {
            if (this.filtroFacturasOperativas === 'notas') {
                return this.arregloFacturasOperativasNotas;
            } else if (this.filtroFacturasOperativas === 'prefacturas') {
                return this.arregloFacturasOperativasPrefacturas;
            }
            return this.arregloFacturasOperativas;
        },
        totalChequesNoCobradosNuevo() {
            let total = 0;
            if (this.Cheques && this.Cheques.length > 0) {
                for (let i = 0; i < this.Cheques.length; i++) {
                    let cheque = this.Cheques[i];
                    let estado = cheque && cheque.chq_estado != null ? Number(cheque.chq_estado) : 0;
                    if (estado !== 1) {
                        total += cheque && cheque.chq_valor ? Number(cheque.chq_valor) : 0;
                    }
                }
            }
            return total;
        },
        abonoNotasGestionadoNuevo() {
            let base = Number(this.abonoNotas);
            let ajuste = Number(this.totalChequesNoCobradosNuevo);
            let resultado = base - ajuste;
            return resultado > 0 ? resultado : 0;
        },
        totalPagosNuevo() {
            return Number(this.totalDevolucionesNotas) + Number(this.abonoNotasGestionadoNuevo);
        },
        saldoPendienteNuevo() {
            return (Number(this.totalNotas) - Number(this.totalDevolucionesNotas) - Number(this.abonoNotasGestionadoNuevo)) + Number(this.totalFacturasOperativasNotas);
        },
        totalDistribuidoAbonoNuevo() {
            let total = 0;
            for (let i = 0; i < this.documentosAbonoNuevo.length; i++) {
                total += this.documentosAbonoNuevo[i].abono_manual ? Number(this.documentosAbonoNuevo[i].abono_manual) : 0;
            }
            return total;
        },
        saldoPendienteDistribucionNuevo() {
            return Number(this.tabAbono.valor) - Number(this.totalDistribuidoAbonoNuevo);
        },
        abonoVentasJsonNuevo() {
            return this.documentosAbonoNuevo.map(item => {
                return {
                    ven_codigo: item.ven_codigo,
                    ven_valor: item.ven_valor,
                    ven_valor_abono: item.ven_valor_abono,
                    abono_manual: item.abono_manual ? Number(item.abono_manual) : 0,
                    saldo_disponible: item.saldo_disponible,
                };
            });
        },
        avanceCobroNuevo() {
            let total = Number(this.totalNotas);
            if (total <= 0) {
                return 0;
            }
            let porcentaje = (this.totalPagosNuevo / total) * 100;
            if (porcentaje < 0) {
                return 0;
            }
            if (porcentaje > 100) {
                return 100;
            }
            return porcentaje;
        },
        estadoCobranzaNuevo() {
            if (Number(this.totalNotas) <= 0) {
                return 'Sin cartera';
            }
            if (Number(this.saldoPendienteNuevo) <= 0) {
                return 'Al dia';
            }
            if (this.avanceCobroNuevo >= 70) {
                return 'En seguimiento';
            }
            return 'Riesgo alto';
        },
        colorEstadoCobranzaNuevo() {
            if (Number(this.totalNotas) <= 0) {
                return 'primary';
            }
            if (Number(this.saldoPendienteNuevo) <= 0) {
                return 'success';
            }
            if (this.avanceCobroNuevo >= 70) {
                return 'warning';
            }
            return 'danger';
        },
        descripcionEstadoCobranzaNuevo() {
            if (Number(this.totalNotas) <= 0) {
                return 'No hay valores pendientes para gestionar.';
            }
            if (Number(this.saldoPendienteNuevo) <= 0) {
                return 'La cartera del cliente esta cubierta.';
            }
            if (this.avanceCobroNuevo >= 70) {
                return 'Buen ritmo de recuperacion de cartera.';
            }
            return 'Priorizar gestion: saldo alto pendiente.';
        }
    },
    data() {
        return {
            menu: 3,
            arreglofacturas: [],
            arreglonotas: [],
            arreglocheques: [],
            arregloBeneficiario: [],
            arregloNotasFacturas: [],
            cantidadFacturas: 0,
            totalFacturas: 0,
            abonoFacturas: 0,
            cantidadNotas: 0,
            totalNotas: 0,
            abonoNotas: 0,
            totalAbonoFacturas: 0,
            totalAbonoNotas: 0,
            // pendienteNotas: 0,
            // pendienteFacturas: 0,
            popupAbonos: false,
            popupAbonosNotas: false,
            popupAbonosFacturas: false,
            popupCheques: false,
            mostrarCheques: false,
            permisosCheque: false,
            popupPDF: false,
            documentosAbonoNuevo: [],
            tabAbono: {
                notasOfactura: '',
                valor: '',
                tipoAbono: '',
                fecha: '',
                cuenta: '',
                numeroDocumento: '',
                concepto: '',
            },
            tabCheque: {
                banco: '',
                tipoCheque: '',
                valor: '',
                fechaCobro: '',
                referencia: '',
                numeroCheque: '',
                referencia: '',
                institucion: '',
                periodo: '',
                cuentaCheque: '',
            },
            tipoCheque: [{
                    text: '--Seleccione--',
                    value: null
                },
                {
                    text: 'Garantia',
                    value: 0
                },
                {
                    text: 'Posfechado',
                    value: 1
                },
            ],
            cliente: '',
            disableRadios: false,
            disableFacturas: false,
            arregloAbonoNotas: [],
            arregloAbonoFacturas: [],
            arrayPuntos: [],
            pedidoPuntosOInstitucion: '',
            institucionPuntosOInstitucion: '',
            periodoPuntosOInstitucion: 0,
            empresa: '',
            promptVisible: false,
            abono_id: '',
            setMenu: 0,
            ObjectSelected: '',
            tipoAbono: 0,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',
                onChange: this.onDateChange,
            },
            usuario: [],
            Cuentas: [],
            Bancos: [],
            Cheques: [],
            AllAbonos: [],
            arregloContrarios: [],
            // radiostipoAbono: 0,
            nombreDestintivo: '',
            nombreCliente: '',
            showCloseButton: false,
            devolucionesFacturas: [],
            devolucionesNotas: [],
            totalDevolucionesFacturas: 0,
            totalDevolucionesNotas: 0,
            popupVerNotas: false,
            popupVerNotasDevoluciones: false,
            popupVerFacturas: false,
            popupVerFacturasDevoluciones: false,
            popupVerFacturasOperativas: false,
            arregloFacturasOperativas: [],
            cantidadFacturasOperativas: 0,
            totalFacturasOperativas: 0,
            // Nuevas variables para desglose
            arregloFacturasOperativasNotas: [],
            arregloFacturasOperativasPrefacturas: [],
            cantidadFacturasOperativasNotas: 0,
            totalFacturasOperativasNotas: 0,
            cantidadFacturasOperativasPrefacturas: 0,
            totalFacturasOperativasPrefacturas: 0,
            filtroFacturasOperativas: 'all', // all, notas, prefacturas
            popupImprimirFacturaOperativa: false,
            facturaOperativaImprimir: {},
            devoluciones_all: [],
            cargoDevoluciones: false,
            datosDevolucionesSinEmpresa: [],
            totalDevolucionesSinEmpresa: 0,
            popupVerSinEmpresa: false,
            popupRetencion: false,
            porcentajeRetencion: [{
                    text: '--Seleccione--',
                    value: null
                },
                {
                    text: '0.75 %',
                    value: 0.75
                },
                {
                    text: '1 %',
                    value: 1
                },
                {
                    text: '1.75 %',
                    value: 1.75
                },
                {
                    text: '2 %',
                    value: 2
                },
                {
                    text: '2.75 %',
                    value: 2.75
                },
                {
                    text: '3 %',
                    value: 3
                },
                {
                    text: '10 %',
                    value: 10
                },
            ],
            tabRetencion: {
                fechaRetencion: '',
                porcentajeRetencion: '',
                documento: '',
                valor: '',
            },
            totalRetencionValor: 0,
            retencionValor: 0,
            totalCruceValor: 0,
            cruceValor: 0,
            totalCruceValorNotas: 0,
            cruceValorNotas: 0,
            popupRetencionNew: false,
            popupListadoRetencion: false,
            popupCuentasCruzadas: false,
            popupListadoCruces: false,
            tipoListadoCruces: '',
            totalFacturasReales: 0,
            popupFacturaOperativa: false,
            facturaOperativa: {
                destino: 1, // 1: Notas by default based on screenshot check
                fecha: '',
                observacion: '',
                valor: '',
                numeroDocumento: '',
            },
            institucionesUnicas: [],
            errorValor: '',
            timerValidacion: null,
            tiposDocumento: {},
            datosFacturasNotas: [],
            datosAbonos: [],
        };
    },
    props: {
        predioSeleccionado: {
            type: Number,
            default: 20
        },
        // InsticionCobranza: {
        //     type: [Object, Array],
        //     default: () => ({}),
        // },
        puntosCobranza: {
            type: [Object, Array],
            default: () => ({}),
        },
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        },
        datosCliente: {
            type: Array,
            default: [],
        },
        empresaCobranza: {
            type: [Object, Array],
            default: () => ({}),
        },
        usarComponenteNuevo: {
            type: Boolean,
            default: false
        },
        refreshTotalesKey: {
            type: Number,
            default: 0
        }
    },
    watch: {
        refreshTotalesKey() {
            let me = this;
            if (!me.usarComponenteNuevo) {
                return;
            }
            if (!me.datosCliente || me.datosCliente.length == 0) {
                return;
            }
            me.getFacturaNotaParametro();
            me.actualizarDatosAbono();
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
        let me = this;
        me.setMenu = localStorage.setMenu
        me.nombreCliente = me.datosCliente[0].razonsocial;
        // console.log('institucion',me.InsticionCobranza);
        // console.log('punto',me.puntosCobranza);

        // me.institucionPuntosOInstitucion = me.InsticionCobranza.idInstitucion;
        me.periodoPuntosOInstitucion = me.predioSeleccionado;
        // me.nombreDestintivo = me.InsticionCobranza.nombreInstitucion
        me.empresa = me.empresaCobranza;
        me.obtenerTiposDocumento();
        me.getFacturaNotaParametro();
        me.GetCheque_todo();
        me.actualizarDatosAbono();
        // if (me.InsticionCobranza) {
        //     // me.pedidoPuntosOInstitucion = me.sendPedido.id_pedido;
        //     me.institucionPuntosOInstitucion = me.InsticionCobranza.idInstitucion;
        //     me.periodoPuntosOInstitucion = me.predioSeleccionado;
        //     me.nombreDestintivo = me.InsticionCobranza.nombreInstitucion

        //     me.getFacturaNotaParametro();
        //     me.GetCheque_todo();

        // } else  if (me.puntosCobranza) {
        //     // me.getFacturaNotaParametroPunto();
        //     // me.pedidoPuntosOInstitucion = me.sendPuntos.id_despacho;
        //     me.institucionPuntosOInstitucion = me.puntosCobranza.idInstitucion;
        //     me.periodoPuntosOInstitucion = me.predioSeleccionado;
        //     me.nombreDestintivo = me.puntosCobranza.nombreInstitucion

        //     me.getFacturaNotaParametro();

        // } else {
        //     console.log('error');
        // }

    },
    methods: {
        abrirFacturaOperativa() {
            this.popupFacturaOperativa = true;
            this.facturaOperativa.fecha = new Date().toISOString().substr(0, 10);
            this.facturaOperativa.valor = '';
            this.facturaOperativa.observacion = '';
            this.facturaOperativa.destino = 1; // Default
            this.errorValor = '';
            this.facturaOperativa.numeroDocumento = ''; // Resetear o loading
            this.generarCodigoDocumento();
        },
        generarCodigoDocumento() {
            let me = this;
            let empresaId = me.empresa.id;
            let letraEmpresa = "";

            // Determinar la letra de la empresa (Lógica heredada de Cruce)
            if (empresaId === 1) {
                letraEmpresa = "P";
            } else if (empresaId === 3) {
                letraEmpresa = "C";
            }

            // ID 20 es para FACTURA OPERATIVA según lo indicado
            let url = "getCodigoSecuencial?id=20&empresa=" + empresaId;

            me.$vs.loading();
            this.$http.get(this.$server_url + url)
                .then((response) => {
                    me.$vs.loading.close();
                    if (response.data.status == 0) {
                         me.$vs.notify({ text: 'Error al generar código', color: 'danger', iconPack: 'feather', icon: 'icon-alert-circle' });
                    } else {
                        const datos = response.data;
                        const codigoBase = datos[0]; // Debería ser "FO"
                        const numeroBase = datos[1]; // Secuencial
                        
                        // Construcción del código: FO-LetraEmpresa-Contrato-Iniciales-Secuencial
                        // Asegurando que periodoSelect tenga codigo_contrato y usuario iniciales, si no, usar placeholders o vacios
                        let contrato = me.periodoSelect.codigo_contrato || '';
                        let iniciales = me.usuario.iniciales || '';

                        let codigoGenerado = `${codigoBase}-${letraEmpresa}-${contrato}-${iniciales}-${numeroBase}`;
                        me.facturaOperativa.numeroDocumento = codigoGenerado;
                    }
                })
                .catch((error) => {
                    me.$vs.loading.close();
                    console.error("Error al obtener secuencial:", error);
                     me.$vs.notify({ text: 'Error de red al generar código', color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' });
                });
        },
        validarValorDebounce() {
            if (this.timerValidacion) {
                clearTimeout(this.timerValidacion);
            }
            this.timerValidacion = setTimeout(() => {
                this.validarValor();
            }, 1000); 
        },
        validarValor() {
            this.errorValor = '';
            if (this.facturaOperativa.valor === '' || this.facturaOperativa.valor === null) {
                 this.errorValor = ''; // No error if empty, let save validation handle required
                 return;
            }
            if (parseFloat(this.facturaOperativa.valor) <= 0) {
                this.errorValor = 'El valor debe ser mayor a 0';
            }
        },
        guardarFacturaOperativa() {
            let me = this;
            
            // Validar antes de guardar también
            me.validarValor();
            if (me.errorValor) {
                return;
            }

            // Validaciones básicas
            if (!me.facturaOperativa.fecha) {
                me.$vs.notify({ text: 'Seleccione una fecha', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                return;
            }
            if (!me.facturaOperativa.destino) {
                me.$vs.notify({ text: 'Seleccione un destino', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                return;
            }
            if (!me.facturaOperativa.observacion) {
                me.$vs.notify({ text: 'Ingrese una observación', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                return;
            }
            if (!me.facturaOperativa.valor) {
                me.$vs.notify({ text: 'Ingrese un valor', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' });
                return;
            }
            // Preparar datos para "guardar" (imprimir en consola)
            let datosGuardado = {
                destino: me.facturaOperativa.destino, // 1: Notas, 0: Prefacturas
                fecha: me.facturaOperativa.fecha,
                clienteId: me.datosCliente[0] ? me.datosCliente[0].identificacion : null, // Cedula/RUC
                observacion: me.facturaOperativa.observacion,
                valor: me.facturaOperativa.valor,
                instituciones_ids: me.institucionesUnicas, // Array de IDs
                cliente: me.datosCliente[0], // Objeto cliente completo (para sacar usuario id en back si se prefiere, pero ya mandamos cedula)
                documento_codigo: me.facturaOperativa.numeroDocumento,
                periodo_id: me.periodoSelect.idperiodoescolar,
                user_created: me.usuario.idusuario,
                id_empresa: me.empresa.id,
            };

            me.$vs.loading();
            this.$http.post(this.$server_url + 'guardar_factura_operativa', datosGuardado)
                .then(res => {
                    me.$vs.loading.close();
                    if(res.data.status == 1){
                        me.$vs.notify({
                            text: 'Factura Operativa guardada correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.popupFacturaOperativa = false;
                        me.getFacturaNotaParametro(); // Recargar datos
                    } else {
                        me.$vs.notify({
                            text: res.data.message || 'Error al guardar',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                })
                .catch(error => {
                    me.$vs.loading.close();
                    console.error(error);
                    me.$vs.notify({
                        text: 'Error de servidor al guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                });
        },
        verPDFFacturaOperativa(item){
             let me = this;
             me.facturaOperativaImprimir = item;
             me.popupImprimirFacturaOperativa = true;
        },
        NuevoCruce() {
            let me = this;
            me.popupCuentasCruzadas = true;
        },
        editadoCruce(e){
            let me = this;
            this.actualizarDatosAbono();
            if(e == 'sin-datos'){
                this.popupListadoCruces = false;
                this.$vs.notify({
                    title: 'Sin Listado Cruces',
                    text: 'No se encontraron datos o no tiene cruces en la lista.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                })
            }
        },
        CerrarCrearcionCruce(e) {
            let me = this;
            console.log('entro al emit cruces cerrar ')
            if (e) {
                if (e == 'errorCodigo') {

                    this.$vs.notify({
                        title: 'Error',
                        text: 'Error al obtener el código del documento.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    me.popupCuentasCruzadas = false;

                } else if (e == 'guardado') {

                    this.actualizarDatosAbono();
                    me.popupCuentasCruzadas = false;

                } else if (e == 'cancelar-guardado') {

                    this.$vs.notify({
                        title: 'Mensaje',
                        text: 'Se canceló la creación del cruce.',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    });
                    me.popupCuentasCruzadas = false;

                } else if (e == 'error-guardado') {

                    me.popupCuentasCruzadas = false;

                }
            }

        },
        imprimirPDF() {
            // Emitir evento al hijo para ejecutar la impresión
            this.$refs.hijoComponente.m_imprimirTodos('12px', 'ReporteAbonos_' + this.datosCliente[0].razonsocial, '0px', '', 'landscape');
        },
        descargarExcel() {
            // Emitir evento al hijo para ejecutar la generación del archivo Excel
            this.$refs.hijoComponente.generateExcel();
        },
        MetodosInicio() {
            let me = this;
            me.getFacturaNotaParametro();
            me.GetCheque_todo();
            me.actualizarDatosAbono();
        },
        handleCloseCheque() {
            let me = this;
            me.popupCheques = true
        },
        handleCloseAbono() {
            let me = this;
            me.popupAbonos = true;
        },
        actualizarTodo() {
            let me = this;
            me.actualizarDatosAbono();
        },
        onDateChange(selectedDates, dateStr, instance) {
            instance.close();
        },
        agregarValorAlTextarea() {
            if (this.tabAbono.concepto) {
                this.tabAbono.concepto += ' ' + this.tabAbono.numeroDocumento;
            } else {
                this.tabAbono.concepto = this.tabAbono.numeroDocumento;
            }
        },
        seleccionTipo() {
            let me = this;
            if (!this.tabAbono.notasOfactura) {
                me.$vs.notify({
                    text: 'No a selecionado el destino de Cobro de cheque',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                me.camporequerido = true;
                return;
            } else {
                me.camporequerido = false;
            }
        },
        seleccionTipo2() {
            let me = this;
            if (!this.tabAbono.numeroDocumento) {
                me.$vs.notify({
                    text: 'No a ingresado el documento de Cobro de cheque',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                me.camporequerido = true;
                return;
            } else {
                me.camporequerido = false;
            }
        },
        NuevaRetencion() {
            let me = this;
            me.popupRetencionNew = true;
        },
        ListadoRetenciones() {
            let me = this;
            me.popupListadoRetencion = true;
        },
        ListadoCruces(tipo) {
            let me = this;
            me.tipoListadoCruces = tipo;
            me.popupListadoCruces = true;
        },
        changeHandleRetencionComponent(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificarretencion == 1) {
                console.log("Emit recibido por guardado.");
                me.popupRetencionNew = false;
                this.MetodosInicio();
            } else if (e.verificarretencion == 2) {
                console.log("Emit recibido por cerrar.");
                this.MetodosInicio();
                me.popupRetencionNew = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleListadoRetencionComponent(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificarlistadoretencion == 1) {
                console.log("Emit recibido por guardado.");
                me.popupListadoRetencion = false;
                this.MetodosInicio();
            } else if (e.verificarlistadoretencion == 2) {
                console.log("Emit recibido por cerrar.");
                this.MetodosInicio();
                me.popupListadoRetencion = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        openConfirmEnviarPerseo(abono, tipo) {
            //tipo 0 = notas, 1 = facturas
            let me = this;
            me.$vs.dialog({
                title: 'Confirmación',
                text: `¿Estás seguro que deseas enviar el abono con ID ${abono.abono_id} a Perseo?`,
                acceptText: 'Enviar',
                cancelText: 'Cancelar',
                type: 'confirm',
                color: 'warning',
                accept: () => {
                    me.enviarPerseo(abono);
                },
                //cancelar
                cancel: () => {
                    if (tipo == 0) {
                        me.popupAbonosNotas = true;
                    }
                    if (tipo == 1) {
                        me.popupAbonosFacturas = true;
                    }
                }
            });
        },
        enviarPerseo() {
            let me = this;
            let formData = new FormData();
            formData.append("abono_id", this.ObjectSelected.abono_id);
            formData.append("usuarioCreador", `${this.usuario.nombres} ${this.usuario.apellidos}`);
            me.$vs.loading();
            this.$http
                .post(this.$server_url + "api/perseo/transaccion/cobros_crear", formData)
                .then((res) => {
                    if (res.data != null || res.data != undefined || res.data != 0) {
                        me.$vs.loading.close();
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
                                text: "Ocurrio un error en el envío a Perseo",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                            return;
                        }
                        if (me.tipoAbono == 0) {
                            me.obtenerAbonos('notas')
                        } else {
                            me.obtenerAbonos('facturas')
                        }
                        me.$vs.notify({
                            text: "Envío a Perseo exitoso",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                        //abrir modal
                        if (me.tipoAbono == 0) {
                            me.popupAbonosNotas = false;
                        }
                        if (me.tipoAbono == 1) {
                            me.popupAbonosFacturas = false;
                        }
                    } else {
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "Se produjo algún fallo en el envío a Perseo",
                            color: "#F8C471",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    me.$vs.loading.close();
                    if (error.response.data.fault && error.response.data.fault.detail) {
                        me.$vs.notify({
                            text: error.response.data.fault.detail,
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    } else {
                        me.$vs.notify({
                            text: "No se pudo enviar a Perseo",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    }
                });
        },
        chequeCobrado() {
            let me = this;
            me.getFacturaNotaParametro();
            me.GetCheque_todo();
            me.actualizarDatosAbono();
        },
        seleccionTipo() {
            let me = this;
            if (!this.tabAbono.notasOfactura) {
                me.$vs.notify({
                    text: 'No a selecionado el destino del Abono',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
        },
        resetearValor() {
            let me = this;
            me.tabAbono.valor = '';
        },
        validateInput(event) {
            const charCode = event.which ? event.which : event.keyCode;
            if ((charCode < 48 || charCode > 57) && charCode !== 44 && charCode !== 46) {
                event.preventDefault();
            }
        },
        validatePaste(event) {
            const clipboardData = event.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData('text/plain');
            const numbersOnly = pastedText.replace(/[^\d]/g, '');
            document.execCommand("insertText", false, numbersOnly);
            event.preventDefault();
        },
        validateQuantity() {
            let me = this;
            if (me.tabAbono.notasOfactura == 0) {
                let diferencia = this.totalFacturas - this.abonoFacturas;
                if (me.tabAbono.valor > diferencia) {
                    me.tabAbono.valor = diferencia.toFixed(2);
                }
            } else {
                let diferencia = this.totalNotas - this.abonoNotas;
                if (me.tabAbono.valor > diferencia) {
                    me.tabAbono.valor = diferencia.toFixed(2);
                }
            }

        },
        GetCuentasAll() {
            let me = this;
            this.$vs.loading();
            this.$http.get(this.$server_url + 'GetCuentasAll')
                .then(res => {
                    me.Cuentas = res.data.filter(cuentas => cuentas.cue_pag_estado != 1)
                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
        GetBanco_todo() {
            let me = this;
            this.$vs.loading();
            this.$http.post(this.$server_url + 'api/perseo/consultas/clientes_bancos_consulta')
                .then(res => {
                    me.Bancos = res.data['bancoc'];
                    // console.log(me.Bancos)
                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
            // this.$http.get(this.$server_url + 'GetBanco_todo')
            //     .then(res => {
            //         me.Bancos = res.data
            //         this.$vs.loading.close();
            //     })
            //     .catch(function (error) {
            //         console.log(error + ' error');
            //         me.$vs.loading.close();
            //     });
        },
        GetCheque_todo() {
            let me = this;
            this.$vs.loading();
            // this.$http.get(this.$server_url + 'GetCheque_todo?institucion=' + me.institucionPuntosOInstitucion + '&periodo=' + me.periodoPuntosOInstitucion+'&empresa='+me.empresa.id+'&cliente='+me.datosCliente[0].clientesid)
            this.$http.get(this.$server_url + 'GetCheque_todo?periodo=' + me.periodoPuntosOInstitucion + '&empresa=' + me.empresa.id + '&cliente=' + me.datosCliente[0].identificacion)
                .then(res => {
                    me.Cheques = res.data;
                    if (me.Cheques) {
                        me.mostrarCheques = true;
                    }
                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
        menus(menu) {
            let me = this;
            me.menu = menu;
            if (menu != 3) {
                me.mostrarCheques = false;
            }
        },
        newAbono() {
            let me = this;
            me.tabAbono.valor = '';
            me.tabAbono.notasOfactura = me.usarComponenteNuevo ? 1 : '';
            me.tabAbono.fecha = new Date().toISOString().substr(0, 10);
            me.tabAbono.cuenta = '';
            me.tabAbono.numeroDocumento = '';
            me.tabAbono.concepto = 'CLIENTE: ' + me.nombreCliente + ' ' + 'DOCUMENTO: ';
            me.tabAbono.tipoAbono = '0';
            // me.radiostipoAbono = 0;
            me.GetCuentasAll();
            if (me.usarComponenteNuevo) {
                me.inicializarDocumentosAbonoNuevo();
            }
            me.popupAbonos = true;

        },
        inicializarDocumentosAbonoNuevo() {
            let me = this;
            me.documentosAbonoNuevo = [];
            if (!me.arreglonotas || me.arreglonotas.length == 0) {
                return;
            }
            for (let i = 0; i < me.arreglonotas.length; i++) {
                let nota = me.arreglonotas[i];
                let valor = nota && nota.ven_valor ? Number(nota.ven_valor) : 0;
                let abonado = nota && nota.ven_valor_abono ? Number(nota.ven_valor_abono) : 0;
                let saldo = valor - abonado;
                if (saldo < 0) {
                    saldo = 0;
                }
                me.documentosAbonoNuevo.push({
                    ven_codigo: nota.ven_codigo,
                    ven_valor: valor,
                    ven_valor_abono: abonado,
                    saldo_disponible: saldo,
                    abono_manual: 0,
                });
            }
        },
        actualizarDistribucionAbonoNuevo(index) {
            let me = this;
            let item = me.documentosAbonoNuevo[index];
            if (!item) {
                return;
            }
            let ingreso = item.abono_manual ? Number(item.abono_manual) : 0;
            let saldoDisponible = Number(item.saldo_disponible);
            let valorAbono = Number(me.tabAbono.valor);
            if (ingreso < 0) {
                item.abono_manual = 0;
                ingreso = 0;
            }
            if (ingreso > saldoDisponible) {
                item.abono_manual = saldoDisponible;
                ingreso = saldoDisponible;
            }
            if (me.totalDistribuidoAbonoNuevo > valorAbono && valorAbono > 0) {
                me.$vs.notify({
                    text: 'La distribución supera el valor del abono',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
            }
        },
            calcularTotalDistribuidoAbonoNuevo() {
                if (!this.usarComponenteNuevo || !this.documentosAbonoNuevo || this.documentosAbonoNuevo.length == 0) {
                    return;
                }
                this.documentosAbonoNuevo = this.documentosAbonoNuevo.map(item => {
                    let abonoManual = item.abono_manual ? Number(item.abono_manual) : 0;
                    let saldoDisponible = Number(item.saldo_disponible);
                    if (abonoManual > saldoDisponible) {
                        abonoManual = saldoDisponible;
                    }
                    if (abonoManual < 0) {
                        abonoManual = 0;
                    }
                    return Object.assign({}, item, { abono_manual: abonoManual });
                });
            },
        newCheque() {
            let me = this;
            me.GetBanco_todo();

            // me.tabCheque.institucion = me.InsticionCobranza.nombreInstitucion;
            me.tabCheque.banco = '';
            me.tabCheque.tipoCheque = '';
            me.tabCheque.valor = '';
            me.tabCheque.fechaCobro = new Date().toISOString().substr(0, 10);;
            me.tabCheque.referencia = me.periodoSelect.codigo_contrato;
            me.tabCheque.periodo = me.periodoPuntosOInstitucion;
            me.tabCheque.numeroCheque = '';
            me.tabCheque.cuentaCheque = '';
            me.popupCheques = true;

        },
        guardarAbono() {
            let me = this;
            if (me.usarComponenteNuevo) {
                me.tabAbono.notasOfactura = 1;
            }
            let totalesFacturaNotas = (me.totalFacturas + me.totalNotas).toFixed(2);

            if (!me.tabAbono.fecha) {
                me.$vs.notify({
                    text: 'No a selecionado la fecha del abono',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabAbono.cuenta) {
                me.$vs.notify({
                    text: 'No a selecionado la cuenta del abono',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabAbono.tipoAbono) {
                me.$vs.notify({
                    text: 'No a seleccionado el tipo',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabAbono.numeroDocumento) {
                me.$vs.notify({
                    text: 'No a ingresado el deposito #',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabAbono.notasOfactura) {
                me.$vs.notify({
                    text: 'No a seleccionado el destino',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabAbono.valor) {
                me.$vs.notify({
                    text: 'No a ingresado el valor del abono',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (me.tabAbono.valor == 0) {
                me.$vs.notify({
                    text: 'No puede enviar un abono 0',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.tabAbono.concepto.trim()) {
                me.$vs.notify({
                    text: 'No ha ingresado el concepto del abono.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (me.usarComponenteNuevo) {
                if (Number(me.totalDistribuidoAbonoNuevo) !== Number(me.tabAbono.valor)) {
                    me.$vs.notify({
                        text: 'La suma distribuida debe coincidir con el valor del abono',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }
                for (let i = 0; i < me.documentosAbonoNuevo.length; i++) {
                    let item = me.documentosAbonoNuevo[i];
                    if (Number(item.abono_manual) > Number(item.saldo_disponible)) {
                        me.$vs.notify({
                            text: 'El abono de un documento no puede superar el saldo disponible',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    }
                }
            }
            let abonoConcepto = me.tabAbono.concepto;

            abonoConcepto = abonoConcepto.replace(/ {5,}/g, '    ');
            let formData = new FormData();
            formData.append("notasOfactura", me.tabAbono.notasOfactura);
            formData.append("abono_fecha", me.tabAbono.fecha);
            formData.append("abono_tipo", me.tabAbono.tipoAbono);
            formData.append("abono_cuenta", me.tabAbono.cuenta);
            formData.append("abono_documento", me.tabAbono.numeroDocumento);
            formData.append("abono_valor", me.tabAbono.valor);
            formData.append("abono_empresa", me.empresa.id);
            // formData.append("institucion", me.institucionPuntosOInstitucion);
            formData.append("periodo", me.periodoPuntosOInstitucion);
            formData.append("abono_totalNotas", (me.totalNotas).toFixed(2));
            formData.append("abono_totalFacturas", (me.totalFacturas).toFixed(2));
            formData.append('abono_clientePerseo', me.usuario.idusuario);
            formData.append('idClientePerseo', me.datosCliente[0].clientesid);
            formData.append('clienteCodigoPerseo', me.datosCliente[0].clientescodigo);
            formData.append('user_created', me.usuario.idusuario);
            formData.append('abono_concepto', abonoConcepto);
            formData.append('abono_ruc_cliente', me.datosCliente[0].identificacion);
            if (me.usarComponenteNuevo) {
                formData.append('abono_ventas', JSON.stringify(me.abonoVentasJsonNuevo));
                formData.append('abono_total_distribuido', me.totalDistribuidoAbonoNuevo);
                formData.append('abono_tipo_destino', 'notas');
            }
            // formData.append("tipo", me.setMenu );
            me.$vs.loading();
            this.$http.post(this.$server_url + (me.usarComponenteNuevo ? 'abono_registro_nuevo' : 'abono_registro'), formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close();
                    } else {
                        me.$vs.notify({
                            text: 'Se guardó correctamente',
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.popupAbonos = false
                        me.$vs.loading.close();
                    }
                    me.actualizarDatosAbono();
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'Error al guardar',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close();
                });
        },
        guardarCheque() {
            let me = this;
            if (!me.tabCheque.banco) {
                me.mostrarAlerta('No ha seleccionado el banco');
                return;
            }
            if (me.tabCheque.tipoCheque === null || me.tabCheque.tipoCheque === '') {
                me.mostrarAlerta('No ha seleccionado el tipo de cheque');
                return;
            }
            if (me.tabCheque.valor <= 0) {
                me.mostrarAlerta('El valor del cheque debe ser mayor que 0');
                return;
            }
            if (me.tabCheque.tipoCheque === 1 && (me.tabCheque.fecha === null || me.tabCheque.fecha === '')) {
                me.mostrarAlerta('No ha seleccionado la fecha del cheque');
                return;
            }
            if (!me.tabCheque.cuentaCheque) {
                me.mostrarAlerta('No ha ingresado la cuenta del cheque');
                return;
            }
            if (!me.tabCheque.numeroCheque) {
                me.mostrarAlerta('No ha ingresado el número del cheque');
                return;
            }
            if (!me.tabCheque.referencia) {
                me.mostrarAlerta('No ha ingresado la referencia del cheque');
                return;
            }

            // Construir objeto FormData con los datos del cheque
            let formData = new FormData();
            formData.append('ban_codigo', me.tabCheque.banco.bancocid);
            formData.append('chq_nombrebanco', me.tabCheque.banco.descripcion);
            formData.append('chq_tipo', me.tabCheque.tipoCheque);
            formData.append('chq_valor', me.tabCheque.valor);
            if (me.tabCheque.tipoCheque === 1) {
                formData.append('chq_fecha_cobro', me.tabCheque.fechaCobro);
            }
            formData.append('chq_cuenta', me.tabCheque.cuentaCheque);
            formData.append('chq_referenca', me.tabCheque.referencia);
            formData.append('chq_numero', me.tabCheque.numeroCheque);
            // formData.append('chq_institucion', me.institucionPuntosOInstitucion);
            formData.append('chq_periodo', me.periodoPuntosOInstitucion);
            formData.append('chq_empresa', me.empresa.id);
            formData.append('chq_cliente', me.datosCliente[0].identificacion);
            formData.append('user_created', me.usuario.idusuario);
            this.$http.post(this.$server_url + 'cheque_registro', formData)
                .then(response => {
                    this.$vs.loading.close();
                    if (response.data.status === 1) {
                        this.$vs.notify({
                            text: 'Cheque registrado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.popupCheques = false;
                    } else if ((response.data.status === 0)) {
                        this.$vs.notify({
                            text: response.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }
                    me.GetCheque_todo();
                    me.actualizarDatosAbono();

                })
                .catch(error => {
                    this.$vs.notify({
                        text: 'Error al registrar el cheque: ' + error.response.data.message,
                        color: 'error',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                });
        },
        actualizarDatosAbono() {
            let me = this;
            // me.$http.get(me.$server_url + 'abono_pedido?institucion=' + me.institucionPuntosOInstitucion + '&periodo=' + me.periodoPuntosOInstitucion+'&empresa='+me.empresa.id+'&cliente='+me.datosCliente[0].clientesid)
            me.$http.get(me.$server_url + 'abono_pedido?periodo=' + me.periodoPuntosOInstitucion + '&empresa=' + me.empresa.id + '&cliente=' + me.datosCliente[0].identificacion)
                .then(function (resAbono) {
                    let abonoDatos = resAbono.data;

                    if (abonoDatos.length > 0) {
                        me.abonoFacturas = parseFloat(abonoDatos[0].abonofacturas);
                        me.abonoNotas = parseFloat(abonoDatos[0].abononotas);
                        me.totalAbonoFacturas = parseFloat(abonoDatos[0].totalAbonoFacturas);
                        me.totalAbonoNotas = parseFloat(abonoDatos[0].totalAbonoNotas);
                        me.totalRetencionValor = parseFloat(abonoDatos[0].totalRetencionValor);
                        me.retencionValor = parseFloat(abonoDatos[0].retencionValor);
                        me.totalCruceValor = parseFloat(abonoDatos[0].totalCruceValor);
                        me.cruceValor = parseFloat(abonoDatos[0].cruceValor);
                        me.totalCruceValorNotas = parseFloat(abonoDatos[0].totalCruceValorNotas);
                        me.cruceValorNotas = parseFloat(abonoDatos[0].cruceValorNotas);
                        // me.pendienteFacturas -= me.totalAbonoFacturas;
                        // me.pendienteNotas -= me.totalAbonoNotas;
                    } else {
                        me.abonoFacturas = 0;
                        me.abonoNotas = 0;
                        me.totalAbonoFacturas = 0;
                        me.totalAbonoNotas = 0;
                        me.pendienteFacturas = 0;
                        me.pendienteNotas = 0;
                        me.totalRetencionValor = 0;
                        me.retencionValor = 0;
                        me.totalCruceValor = 0;
                        me.cruceValor = 0;
                        me.totalCruceValorNotas = 0;
                        me.cruceValorNotas = 0;
                    }
                })
                .catch(function (errorAbono) {
                    console.log(errorAbono + ' error');
                });
        },
        mostrarAlerta(mensaje) {
            this.$vs.notify({
                text: mensaje,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
        },
        getFacturaNotaParametro() {
            let me = this;
            let busqueda, ruc, ci;

            let identificacion = me.datosCliente[0].identificacion;
            let esRUC = identificacion.length >= 11 && identificacion.length <= 13 ? true : false;

            if (esRUC) {
                ruc = identificacion;
                busqueda = identificacion.slice(0, -3); // Eliminar los últimos 3 dígitos para RUC
                ci = busqueda;
            } else {
                ci = identificacion; // Añadir '001' al final para CI
                ruc = identificacion + '001';
                busqueda = identificacion;
            }

            this.$vs.loading();
            this.$http.get(`${this.$server_url}get_facturasNotasxParametro?periodo=${me.periodoPuntosOInstitucion}&empresa=${me.empresa.id}&cliente=${busqueda}&reporte=2`)
                .then(function (res) {
                    let datos = res.data;
                    me.arregloNotasFacturas = datos;
                    let arregloNotasFacturasValidacion = datos;
                    
                    // Extraer institucion_id únicos
                    const ids = datos.map(item => item.institucion_id).filter(id => id != null);
                    me.institucionesUnicas = [...new Set(ids)];
                    console.log('Instituciones únicas:', me.institucionesUnicas);

                    console.log(esRUC, busqueda);

                    if (arregloNotasFacturasValidacion.length > 0) {
                        if (esRUC) {
                            // Si es RUC, buscar en los datos usando CI
                            me.arregloContrarios = arregloNotasFacturasValidacion.filter(item => item.ruc_cliente == ci);
                            console.log('Documentos Contrarios ala busqueda RUC', me.arregloContrarios);
                            console.log(' busqueda', busqueda);
                            me.$vs.notify({
                                text: "Cliente con documentos con RUC y CI",
                                color: "warning",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                        } else {
                            // Si es CI, buscar en los datos usando RUC
                            me.arregloContrarios = arregloNotasFacturasValidacion.filter(item => item.ruc_cliente == ruc);
                            console.log('Documentos Contrarios ala busqueda CI', me.arregloContrarios);
                            me.$vs.notify({
                                text: "Cliente con documentos con CI y RUC",
                                color: "warning",
                                iconPack: "feather",
                                icon: "icon-check",
                            });
                        }
                    }

                    if (me.arregloNotasFacturas.length > 0) {
                        me.menu = 3;
                        me.arreglofacturas = datos.filter(item => item.idtipodoc === 1);
                        me.cantidadFacturas = me.arreglofacturas.length;
                        me.totalFacturas = me.arreglofacturas.reduce((total, factura) => total + factura.ven_valor, 0);
                        // me.pendienteFacturas = me.totalFacturas;

                        me.arreglonotas = datos.filter(item => item.idtipodoc === 4 || item.idtipodoc === 3);
                        me.cantidadNotas = me.arreglonotas.length;
                        me.totalNotas = me.arreglonotas.reduce((total, nota) => total + nota.ven_valor, 0);
                        // me.pendienteNotas = me.totalNotas;
                        
                        // Facturas Operativas (ID 20)
                        me.arregloFacturasOperativas = datos.filter(item => item.idtipodoc === 20).map(item => {
                            // Inferir destino si no viene
                            let esNota = item.ven_observacion && item.ven_observacion.includes('Notas');
                            item.destino_nombre = esNota ? 'Notas' : 'PreFacturas';
                            return item;
                        });

                        me.cantidadFacturasOperativas = me.arregloFacturasOperativas.length;
                        me.totalFacturasOperativas = me.arregloFacturasOperativas.reduce((total, fo) => total + fo.ven_valor, 0);

                        // Separar
                        me.arregloFacturasOperativasNotas = me.arregloFacturasOperativas.filter(item => item.destino_nombre === 'Notas');
                        me.cantidadFacturasOperativasNotas = me.arregloFacturasOperativasNotas.length;
                        // Solo sumar las que NO estan anuladas (est_ven_codigo !== 3)
                        me.totalFacturasOperativasNotas = me.arregloFacturasOperativasNotas.filter(fo => fo.est_ven_codigo !== 3).reduce((total, fo) => total + fo.ven_valor, 0);

                        me.arregloFacturasOperativasPrefacturas = me.arregloFacturasOperativas.filter(item => item.destino_nombre === 'PreFacturas');
                        me.cantidadFacturasOperativasPrefacturas = me.arregloFacturasOperativasPrefacturas.length;
                        // Solo sumar las que NO estan anuladas (est_ven_codigo !== 3)
                        me.totalFacturasOperativasPrefacturas = me.arregloFacturasOperativasPrefacturas.filter(fo => fo.est_ven_codigo !== 3).reduce((total, fo) => total + fo.ven_valor, 0);

                        // Combinar todos los documentos para reportePerseoIndividual
                        me.datosFacturasNotas = [
                            ...me.arreglofacturas,
                            ...me.arreglonotas,
                            ...me.arregloFacturasOperativas
                        ];

                        me.permisosCheque = true;

                        me.actualizarDatosAbono();
                        me.getClienteDocumentosdevolucioneSinEmpresa();
                        setTimeout(function () {
                            me.$vs.loading();
                            me.traerDevoluciones(me.arreglonotas, me.arreglofacturas);
                        }, 500);

                    } else {
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "Cliente sin documentos",
                            color: "warning",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                    }

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
            this.$http.get(`${this.$server_url}get_facturaRealxParametro?periodo=${me.periodoPuntosOInstitucion}&empresa=${me.empresa.id}&cliente=${busqueda}`)
                .then(function (res) {
                me.totalFacturasReales = res.data.length;
                if (me.totalFacturasReales > 0) {
                    me.$vs.notify({
                        text: "Cliente con Facturas reales",
                        color: "success",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                } else {
                    me.$vs.notify({
                        text: "Cliente sin Facturas reales",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                }
            });
        },
        getClienteDocumentosdevolucioneSinEmpresa() {
            let me = this;
            this.$http.get(`${this.$server_url}getClienteDocumentos?cliente=${me.datosCliente[0].identificacion}&periodo=${me.periodoSelect.idperiodoescolar}`)
                .then(function (res) {
                    let datos = res.data;
                    me.datosDevolucionesSinEmpresa = datos[0];

                    // Calcular el total de las devoluciones
                    me.totalDevolucionesSinEmpresa = me.datosDevolucionesSinEmpresa.reduce((total, devolucion) => total + devolucion.total_precio, 0);

                    console.log('Datos de devoluciones sin empresa:', me.datosDevolucionesSinEmpresa);
                    console.log('Total de devoluciones sin empresa:', me.totalDevolucionesSinEmpresa);

                    // Si se desea mostrar un popup o modal después de obtener los datos
                    // me.popupVerSinEmpresa = true;
                })
                .catch(function (error) {
                    console.log('Error:', error);
                    me.$vs.loading.close();
                });
        },
        async traerDevoluciones(notas, facturas) {
            let me = this;
            me.devolucionesFacturas = [];
            me.devolucionesNotas = [];

            // Función para obtener detalles de devolución
            const obtenerDetallesDevolucion = async (documento) => {
                try {
                    const res = await me.$http.get(`${me.$server_url}obtenerDetallesDevolucion?documento=${documento}&empresa=${me.empresa.id}`);
                    return res.data.length > 0 ? res.data : []; // Devuelve el array de devoluciones
                } catch (error) {
                    console.error('Error obteniendo detalles de devolución:', error);
                    return []; // Devuelve un array vacío si hay un error
                }
            };

            // Iniciar loading
            me.$vs.loading();

            // Función genérica para procesar facturas o notas
            const procesarDevoluciones = async (documentos, tipo) => {
                const devoluciones = await Promise.all(documentos.map(async (documento) => {
                    // Si usamos componente nuevo, ignoramos las que sean de tipo prefactura (PF-)
                    if (me.usarComponenteNuevo && documento.ven_codigo.includes('PF-')) {
                        return [];
                    }
                    const detalles = await obtenerDetallesDevolucion(documento.ven_codigo);
                    return detalles.map(devolucion => ({
                        codigo_devolucion: devolucion.codigo_devolucion,
                        id_cliente: devolucion.id_cliente,
                        total_precio: devolucion.total_precio,
                        nombreInstitucion: devolucion.nombreInstitucion,
                        total_descuento: devolucion.ValorConDescuento,
                        documento: devolucion.documento
                    }));
                }));

                // Aplanar el array de devoluciones y asignarlo a la propiedad correspondiente
                const devolucionesAplanadas = devoluciones.flat();
                if (tipo === 'facturas') {
                    me.devolucionesFacturas = devolucionesAplanadas;
                } else if (tipo === 'notas') {
                    me.devolucionesNotas = devolucionesAplanadas;
                }
            };

            try {
                // Si usamos el componente nuevo, NO consultamos facturas/prefacturas, solo notas
                if (me.usarComponenteNuevo) {
                    await Promise.all([
                        procesarDevoluciones(notas, 'notas')
                    ]);
                } else {
                    // Ejecutar ambas funciones en paralelo
                    await Promise.all([
                        procesarDevoluciones(facturas, 'facturas'),
                        procesarDevoluciones(notas, 'notas')
                    ]);
                }

                // Calcular los totales por separado para facturas y notas
                me.totalDevolucionesFacturas = me.devolucionesFacturas.reduce((total, devolucion) => total + devolucion.total_descuento, 0);
                me.totalDevolucionesNotas = me.devolucionesNotas.reduce((total, devolucion) => total + devolucion.total_descuento, 0);

                // Combinar todas las devoluciones
                me.devoluciones_all = [...me.devolucionesFacturas, ...me.devolucionesNotas];

                // Verificar si el número de devoluciones coincide
                if ((me.devolucionesFacturas.length + me.devolucionesNotas.length) === me.devoluciones_all.length) {
                    me.cargoDevoluciones = true;
                } else {
                    console.error('No hay coincidencias en los datos de devoluciones');
                }
            } catch (error) {
                console.error('Error procesando las devoluciones:', error);
            } finally {
                // Cerrar el loading al finalizar
                me.$vs.loading.close();
            }
        },

        openabonoNotas() {
            let me = this;
            me.popupAbonosNotas = true;
            me.obtenerAbonos('notas');

        },
        openabonoFacturas() {
            let me = this;
            me.popupAbonosFacturas = true;
            me.obtenerAbonos('facturas');

        },
        obtenerAbonos(documento) {
            let me = this;
            this.$vs.loading();
            // this.$http.get(this.$server_url + 'obtenerAbonos?institucion=' + me.institucionPuntosOInstitucion + '&periodo=' + me.periodoPuntosOInstitucion+'&empresa='+me.empresa.id)
            this.$http.get(this.$server_url + 'obtenerAbonos?periodo=' + me.periodoPuntosOInstitucion + '&empresa=' + me.empresa.id + '&cliente=' + me.datosCliente[0].identificacion)
                .then(res => {
                    let datos = res.data;

                    if (documento === 'notas') {
                        me.arregloAbonoNotas = datos.abonos_con_notas.map(abono => ({
                            ...abono,
                            created_at: new Date(abono.created_at).toLocaleString(),
                            updated_at: new Date(abono.updated_at).toLocaleString()
                        }));
                    } else if (documento === 'facturas') {
                        me.arregloAbonoFacturas = datos.abonos_con_facturas.map(abono => ({
                            ...abono,
                            created_at: new Date(abono.created_at).toLocaleString(),
                            updated_at: new Date(abono.updated_at).toLocaleString()
                        }));
                    } else if (documento === 'excel') {
                        me.AllAbonos = datos;
                        me.exportToExcel();
                    } else if (documento === 'pdf') {
                        me.AllAbonos = datos;
                        me.popupPDF = true;

                    }

                    // Combinar todos los abonos para reportePerseoIndividual
                    me.datosAbonos = [
                        ...(me.arregloAbonoNotas || []),
                        ...(me.arregloAbonoFacturas || [])
                    ];

                    this.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close();
                });
        },
        remover(abono) {
            let me = this;
            me.abono_id = abono;
            me.popupAbonosNotas = false;
            me.popupAbonosFacturas = false
            me.promptVisible = true;
        },
        cancelarEliminarAbono() {
            this.popupAbonosNotas = true;
            this.popupAbonosFacturas = true;
            this.promptVisible = false;
        },
        eliminarAbono(abono) {
            let me = this;
            this.$http.post(this.$server_url + 'eliminarAbono?', {
                    abono_id: abono.abono_id,
                    usuario: me.usuario.idusuario
                })
                .then(res => {
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check-circle",
                        });
                    } else {
                        me.$vs.notify({
                            text: 'Abono eliminado correctamente',
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check-circle",
                        });
                    }
                    me.promptVisible = false;
                    me.popupAbonosNotas = false;
                    me.popupAbonosFacturas = false;
                    this.actualizarDatosAbono();
                })
                .catch(error => {
                    console.error('Error al eliminar abono:', error);
                    me.$vs.notify({
                        text: 'Error al eliminar el abono',
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                    });
                });
        },
        anularFacturaOperativa(factura) {
            let me = this;
            
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar Anulación',
                text: `¿Está seguro que desea anular la Factura Operativa ${factura.ven_codigo}?`,
                accept: () => {
                    me.$vs.loading();
                    me.$http.post(`${me.$server_url}cambiarEstado`, {
                        ven_codigo: factura.ven_codigo
                    })
                    .then(res => {
                        me.$vs.loading.close();
                        if (res.data.status === 1) {
                            me.$vs.notify({
                                text: res.data.message || 'Factura anulada correctamente',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check-circle',
                            });
                            // Actualizar el estado localmente
                            factura.est_ven_codigo = 3;
                            // Recalcular totales
                            me.totalFacturasOperativasNotas = me.arregloFacturasOperativasNotas.filter(fo => fo.est_ven_codigo !== 3).reduce((total, fo) => total + fo.ven_valor, 0);
                            me.totalFacturasOperativasPrefacturas = me.arregloFacturasOperativasPrefacturas.filter(fo => fo.est_ven_codigo !== 3).reduce((total, fo) => total + fo.ven_valor, 0);
                        } else {
                            me.$vs.notify({
                                text: res.data.message || 'Error al anular factura',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle',
                            });
                        }
                    })
                    .catch(error => {
                        me.$vs.loading.close();
                        console.error('Error al anular:', error);
                        me.$vs.notify({
                            text: 'Error al anular la factura operativa',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle',
                        });
                    });
                }
            });
        },
        exportToExcel() {
            let me = this;
            const formatDate = (fecha) => {
                if (!fecha) return '';
                const date = new Date(fecha);
                return date.toISOString().split('T')[0];
            };

            const reportTitle = 'REPORTE - CARTERA POR COBRAR - ' + me.datosCliente[0].razonsocial;
            const empresa = me.empresa.descripcion_corta;
            const fechaActual = new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });

            const wsData = [];
            wsData.push([reportTitle, '', '', '', '', '', '', '', '', empresa]); // Título
            wsData.push(['Fecha: ' + fechaActual]); // Fecha
            wsData.push([]); // Espacio vacío

            // Encabezados
            const headers = ["Código", "Tipo", "Fecha", "Valor", "Abono", "Destino", "Fecha Abono", "Dep. N°", "Dev. Valor", "Dev. Documento", "Dev. Referencia"];
            wsData.push(headers);

            // Combinar datos de facturas, abonos y devoluciones
            const combinedData = [];
            let totalventa = 0;
            let totalabono = 0;
            let totaldescuento = 0;

            // Iterar sobre las facturas
            for (let i = 0; i < this.arregloNotasFacturas.length; i++) {
                const factura = this.arregloNotasFacturas[i];
                const abono = this.AllAbonos['abonos_all'][i] || {};

                const abonoValor = parseFloat(abono.abono_notas > 0 ? abono.abono_notas :
                    abono.abono_facturas > 0 ? abono.abono_facturas : 0) || 0;

                // Buscar todas las devoluciones correspondientes a la factura (si existen)
                const devoluciones = this.devoluciones_all.filter(d => d.documento === factura.ven_codigo);

                let devolucionCodigo = '';
                let devolucionDocumento = '';
                let devolucionDescuento = 0;

                // Si hay devoluciones, las agrupamos por documento
                if (devoluciones.length > 0) {
                    // Agrupar devoluciones por documento
                    const devolucionesAgrupadas = devoluciones.reduce((acumulador, devolucion) => {
                        if (!acumulador[devolucion.documento]) {
                            acumulador[devolucion.documento] = {
                                codigosDevolucion: [],
                                totalDescuento: 0
                            };
                        }
                        acumulador[devolucion.documento].codigosDevolucion.push(devolucion.codigo_devolucion);
                        acumulador[devolucion.documento].totalDescuento += parseFloat(devolucion.total_descuento || 0);
                        return acumulador;
                    }, {});

                    // Ahora, para cada grupo de devoluciones con el mismo documento, agregamos la fila
                    Object.keys(devolucionesAgrupadas).forEach(documento => {
                        const agrupado = devolucionesAgrupadas[documento];
                        devolucionCodigo = agrupado.codigosDevolucion.join(', '); // Concatenamos los códigos
                        devolucionDocumento = documento; // El documento de referencia
                        devolucionDescuento = agrupado.totalDescuento; // Sumar los descuentos
                    });
                }

                // Agregar la fila con los datos de la factura y las devoluciones agrupadas
                combinedData.push([
                    factura.ven_codigo || '',
                    factura.idtipodoc === 1 ? 'PreFactura' :
                    factura.idtipodoc === 2 ? 'Acta' :
                    factura.idtipodoc === 4 ? 'Nota' :
                    factura.idtipodoc === 3 ? 'Nota' :
                    factura.idtipodoc === 20 ? 'Factura Operativa' : 'error',
                    formatDate(factura.ven_fecha),
                    (Number(factura.ven_valor) || 0).toFixed(2) * 1,
                    abonoValor.toFixed(2) * 1,
                    abono.abono_notas > 0 ? 'Notas' :
                    abono.abono_facturas > 0 ? 'PreFactura' : '',
                    abono.abono_fecha || '',
                    abono.abono_documento || '',
                    devolucionDescuento.toFixed(2) * 1, // Total descuento de las devoluciones agrupadas
                    devolucionCodigo, // Códigos de devolución concatenados
                    devolucionDocumento, // Documento de la devolución (referencia)
                ]);

                totalventa += Number(factura.ven_valor) || 0;
                totalabono += abonoValor;
                totaldescuento += devolucionDescuento;
            }

            // Agregar los abonos que no tienen factura asociada
            for (let j = 0; j < this.AllAbonos['abonos_all'].length; j++) {
                if (j >= this.arregloNotasFacturas.length) {
                    const abono = this.AllAbonos['abonos_all'][j];
                    const abonoValor = parseFloat(abono.abono_notas > 0 ? abono.abono_notas :
                        abono.abono_facturas > 0 ? abono.abono_facturas : 0) || 0;

                    combinedData.push([
                        '',
                        '',
                        '',
                        '',
                        abonoValor.toFixed(2),
                        abono.abono_notas ? 'Notas' : 'PreFactura',
                        abono.abono_fecha || '',
                        abono.abono_documento || '',
                        '', // No hay devolución asociada
                        '', // Documento de devolución
                        '0.00' // Total descuento
                    ]);
                    totalabono += abonoValor;
                }
            }

            // Agregar los datos al array de salida
            combinedData.forEach(row => {
                wsData.push(row);
            });

            // Calcular y agregar los totales
            const saldo = totalventa - totaldescuento - totalabono;
            wsData.push(['', '', 'Total Venta', totalventa.toFixed(2) * 1, totalabono.toFixed(2) * 1, '', '', '', totaldescuento.toFixed(2) * 1]);
            wsData.push(['', '', 'Pagos', totalabono.toFixed(2) * 1 + totaldescuento.toFixed(2) * 1]);
            wsData.push(['', '', 'Saldo', saldo.toFixed(2) * 1]);

            // wsData.push(['']);
            // wsData.push(['']);
            // wsData.push(['']);

            // const headers2 = ["Dev. Valor", "Dev. Documento", "Dev. Referencia"];
            // wsData.push(headers2);
            // // Agregar los datos al array de Devolucion sin documentos
            // me.datosDevolucionesSinEmpresa.forEach(row => {
            //     wsData.push(row);
            // });

            // Crear el libro de trabajo y la hoja
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            // Combinar celdas para el título
            ws['!merges'] = [{
                    s: {
                        r: 0,
                        c: 0
                    },
                    e: {
                        r: 0,
                        c: 7
                    }
                },
                {
                    s: {
                        r: 1,
                        c: 0
                    },
                    e: {
                        r: 1,
                        c: 9
                    }
                }
            ];

            // Agregar la hoja al libro
            XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

            // Exportar el archivo Excel
            XLSX.writeFile(wb, 'ReporteVentas_' + (me.datosCliente[0].razonsocial).trim() + '.xlsx');
        },
        guardarRetencion() {
            let me = this;
            if (!me.tabRetencion.porcentajeRetencion) {
                me.$vs.notify({
                    text: 'No a ingresado la retencion',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let formData = new FormData();
            formData.append("abono_fecha", me.tabRetencion.fechaRetencion);
            formData.append("abono_porcentaje", me.tabRetencion.porcentajeRetencion);
            // formData.append("abono_documento",  me.tabRetencion.documento);
            formData.append("abono_valor_retencion", me.tabRetencion.valor);
            formData.append("abono_tipo", 3);
            // formData.append('abono_institucion', me.instituion);
            formData.append('abono_periodo', me.periodoPuntosOInstitucion);
            formData.append('user_created', me.usuario.idusuario);
            formData.append('abono_empresa', me.empresa.id);
            formData.append('abono_clientePerseo', me.datosCliente[0].identificacion);

            formData.append('idClientePerseo', me.datosCliente[0].clientesid);
            formData.append('clienteCodigoPerseo', me.datosCliente[0].clientescodigo);
            formData.append('abono_ruc_cliente', me.datosCliente[0].identificacion);

            me.$vs.loading();
            this.$http.post(this.$server_url + 'retencion_registro', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close();
                    } else {
                        me.$vs.notify({
                            text: 'Se guardó correctamente',
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.popupRetencion = false
                        me.$vs.loading.close();
                        this.actualizarDatosAbono();
                    }
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: error.response.data.message, // Aquí usamos error en lugar de res
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close();
                });
        },
        obtenerTiposDocumento() {
            let me = this;
            this.$http.get(`${this.$server_url}GetTipoDocumento_todo`)
                .then((res) => {
                    // Crear un mapa: tdo_id => tdo_letra
                    res.data.forEach(tipo => {
                        me.tiposDocumento[tipo.tdo_id] = tipo.tdo_letra || '';
                    });
                })
                .catch((error) => {
                    console.error('Error al obtener tipos de documento:', error);
                });
        }
    },

}
</script>

<style>
.box p {
    color: hsl(229, 6%, 66%);
}

.box {
    border-radius: 5px;
    box-shadow: 0px 30px 40px -20px hsl(229, 6%, 66%);
    padding: 30px;
    margin: 20px;
    background-color: white;
    cursor: pointer;
    transition: 1s ease;
}

.box:hover {
    box-shadow: 15px 10px 15px #0000;
}

@media (max-width: 912px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 820px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 450px) {
    .box {
        height: 200px;
    }

    .img {
        margin-top: -40px;
    }
}

@media (max-width: 400px) {
    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 414px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 375px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 280px) {
    .box {
        width: 100% !important;
    }

    img {
        margin-top: -40px;
        width: 50px;
    }
}

@media (max-width: 950px) and (min-width: 450px) {
    .box {
        text-align: center;
        height: 180px;
    }
}

.purple {
    border-top: 3px solid hsl(261, 81%, 61%);
    box-shadow: 2px 2px 10px hsla(261, 44%, 75%, 0.849);
    border-radius: 10px;
    padding: 10px;
}

.orange {
    border-top: 3px solid hsl(34, 97%, 64%);
    box-shadow: 2px 2px 10px hsla(24, 57%, 65%, 0.842);
    border-radius: 10px;
    padding: 10px;
}

@media (min-width: 950px) {
    .row1-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .row2-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .box-down {
        position: relative;
        top: 150px;
    }

    .box {
        width: 28%;

    }

    .header p {
        width: 30%;
    }

}

.facturas {
    background: #c018b8;
    color: #fff;
    min-width: 20px;
    height: 25px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 18px;
    width: 25px;
}

.text-purple {
    color: hsl(261, 81%, 61%);
    ;
}

.text-orange {
    color: hsl(34, 97%, 64%);
}

.text-red {
    color: hsl(7, 97%, 64%);
}

.text-blue {
    color: hsl(241, 97%, 64%);
}

/* .box.purple {
                position: relative;
                padding: 20px;  Ajusta según sea necesario
                background-image: url('https://cdn-icons-png.flaticon.com/512/3062/3062544.png');
                background-size:auto;
                background-position: center;
                background-repeat: no-repeat;
                background-blend-mode: lighten; Ajusta el blend mode según sea necesario

                background-color: rgba(255, 255, 255, 0.5); Fondo semitransparente
                color: #333; Color del texto para asegurar contraste
            }

            .box.purple .content {
                position: relative;
                z-index: 1;
            } */
</style><style scoped>
/* ============================================================================
   ESTÁNDAR UNIFICADO PARA FLUJO NUEVO DE COBRANZAS
   ============================================================================ */

/* Z-Index Management */
.popopPadre {
    z-index: 51002;
    position: fixed;
}

.popup-pdf-hijo {
    z-index: 52005 !important;
}

.informacionformhijo {
    z-index: 51001;
}

.hide-close .vs-popup--close {
    display: none;
}

/* ============================================================================
   POPUP ESTÁNDAR - Contenedor base
   Los popups respetan su tamaño natural. Fullscreen usa todo el viewport.
   No-fullscreen se adapta al contenido sin forzar 98vw.
   ============================================================================ */
.popup-cobranza-estandar :deep(.con-vs-popup) {
    border-radius: 10px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.popup-cobranza-estandar :deep(.vs-popup--content) {
    padding: 14px 16px 16px 16px;
    background: #ffffff;
}

/* ============================================================================
   BOTONES - Estilo compacto, sutil y ejecutivo
   ============================================================================ */
.popup-cobranza-estandar :deep(.vs-button),
.popup-cobranza-estandar :deep(.con-vs-button) .vs-button {
    min-height: 32px !important;
    padding: 0.4rem 0.9rem !important;
    border-radius: 6px !important;
    font-size: 11px !important;
    font-weight: 600 !important;
    letter-spacing: 0.2px !important;
    text-transform: uppercase;
    transition: all 0.2s ease;
    outline: none;
}

.popup-cobranza-estandar :deep(.vs-button:hover) {
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* ============================================================================
   INPUTS Y SELECTS - Estilo unificado
   ============================================================================ */
.popup-cobranza-estandar :deep(.vs-input),
.popup-cobranza-estandar :deep(.con-vs-input) input,
.popup-cobranza-estandar :deep(.vs-textarea) {
    height: 32px !important;
    font-size: 12px !important;
    background: white;
    color: #2c3e50;
}

.popup-cobranza-estandar :deep(.vs-input:focus),
.popup-cobranza-estandar :deep(.con-vs-input) input:focus,
.popup-cobranza-estandar :deep(.vs-textarea:focus) {
    border-color: #046AE7 !important;
    box-shadow: 0 0 0 2px rgba(4, 106, 231, 0.08);
}

.popup-cobranza-estandar :deep(.vs-input::placeholder) {
    color: #bdbdbd;
    font-size: 12px;
}

.popup-cobranza-estandar :deep(.vs-textarea) {
    min-height: 60px !important;
    resize: vertical;
}

/* ============================================================================
   SELECT COMPONENTS (v-select)
   ============================================================================ */
.popup-cobranza-estandar :deep(.v-select) {
    min-height: 32px;
}

.popup-cobranza-estandar :deep(.v-select .vs__control) {
    min-height: 32px !important;
    border: 1px solid #dde3ec !important;
    border-radius: 6px !important;
    padding: 2px 8px !important;
    background: white;
    font-size: 12px;
}

.popup-cobranza-estandar :deep(.v-select .vs__control:focus),
.popup-cobranza-estandar :deep(.v-select .vs__control.vs__control--open) {
    border-color: #046AE7 !important;
    box-shadow: 0 0 0 3px rgba(4, 106, 231, 0.1);
}

.popup-cobranza-estandar :deep(.v-select .vs__dropdown-menu) {
    border: 1.5px solid #e0e6ed;
    border-radius: 6px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.popup-cobranza-estandar :deep(.v-select .vs__option--selected) {
    background: #046AE7;
    color: white;
}

.popup-cobranza-estandar :deep(.v-select .vs__option--highlighted) {
    background: #e0ecff;
    color: #046AE7;
}

/* ============================================================================
   TABLAS - Estilo unificado
   ============================================================================ */
.popup-cobranza-estandar :deep(.vs-table),
.popup-cobranza-estandar :deep(.con-vs-table) {
    font-size: 12px !important;
    width: 100%;
}

.popup-cobranza-estandar :deep(.vs-table thead th),
.popup-cobranza-estandar :deep(.con-vs-table .vs-table--thead th) {
    font-size: 10px !important;
    text-transform: uppercase !important;
    letter-spacing: 0.3px !important;
    color: #2c3e50 !important;
    font-weight: 700 !important;
    background: #f8fafc;
    padding: 8px 10px !important;
    border-bottom: 1px solid #dde3ec !important;
}

.popup-cobranza-estandar :deep(.vs-table tbody td),
.popup-cobranza-estandar :deep(.con-vs-table .vs-table--tbody td) {
    padding: 8px 10px !important;
    border-bottom: 1px solid #f1f5f9 !important;
    vertical-align: middle;
    color: #2c3e50;
}

.popup-cobranza-estandar :deep(.vs-table tbody tr:hover),
.popup-cobranza-estandar :deep(.con-vs-table .vs-table--tbody tr:hover) {
    background: #f8fafc !important;
}

.popup-cobranza-estandar :deep(.vs-table tbody tr),
.popup-cobranza-estandar :deep(.con-vs-table .vs-table--tbody tr) {
    border-bottom: 1px solid #f1f5f9;
}

/* ============================================================================
   RADIOS Y CHECKBOXES
   ============================================================================ */
.popup-cobranza-estandar :deep(.vs-radio) {
    margin-right: 12px;
}

.popup-cobranza-estandar :deep(.vs-radio label) {
    font-size: 13px;
    font-weight: 500;
    color: #2c3e50;
}

.popup-cobranza-estandar :deep(.vs-checkbox label) {
    font-size: 13px;
    font-weight: 500;
    color: #2c3e50;
}

/* ============================================================================
   LABELS Y TEXTOS
   ============================================================================ */
.popup-cobranza-estandar :deep(label) {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #2c3e50;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
}

.popup-cobranza-estandar :deep(.form-field-label) {
    font-size: 12px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
}

/* ============================================================================
   CHIPS
   ============================================================================ */
.popup-cobranza-estandar :deep(.vs-chip) {
    padding: 4px 10px !important;
    font-size: 11px !important;
    border-radius: 6px !important;
    font-weight: 600;
    text-transform: uppercase;
}

/* ============================================================================
   DIVIDERS
   ============================================================================ */
.popup-cobranza-estandar :deep(.vs-divider) {
    margin: 16px 0;
    border-top: 1px solid #dde3ec;
}

/* ============================================================================
   ESPACIADO Y GRID
   ============================================================================ */
.popup-cobranza-estandar :deep(.vs-row) {
    gap: 12px;
}

.popup-cobranza-estandar :deep(.vs-col) {
    padding: 0 !important;
}

.popup-cobranza-estandar :deep(.form-grid) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
    margin-bottom: 16px;
}

@media (max-width: 768px) {
    .popup-cobranza-estandar :deep(.form-grid) {
        grid-template-columns: 1fr;
    }
}

/* ============================================================================
   UTILIDADES
   ============================================================================ */
.text-right {
    text-align: right;
}

.text-center {
    text-align: center;
}

.text-left {
    text-align: left;
}

.text-success {
    color: #28C76F;
}

.text-danger {
    color: #EA5455;
}

.text-warning {
    color: #FF9F43;
}

.text-primary {
    color: #046AE7;
}

/* ============================================================================
   ANIMACIONES
   ============================================================================ */
.popup-cobranza-estandar :deep(.fade-in) {
    animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(-5px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

/* PDF popup: tamaño natural sin forzar */
.popup-cobranza-pdf :deep(.vs-button) {
    min-height: 32px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    padding: 0.4rem 0.9rem;
}

.popup-cobranza-pdf :deep(.vs-table) {
    font-size: 12px;
}

.popup-cobranza-pdf :deep(.vs-table thead th) {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #64748b;
    font-weight: 700;
}

.popup-cobranza-pdf :deep(.vs-input--input),
.popup-cobranza-pdf :deep(.vs-textarea),
.popup-cobranza-pdf :deep(.vs__search),
.popup-cobranza-pdf :deep(.vs__dropdown-toggle) {
    font-size: 12px;
    border-radius: 6px;
}

.kpi-info-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    padding: 8px 10px;
}

.kpi-info-item {
    display: flex;
    flex-direction: column;
    gap: 2px;
    flex: 1;
    min-width: 140px;
}

.kpi-info-label {
    font-size: 9px;
    text-transform: uppercase;
    color: #6e6b7b;
    font-weight: 700;
    letter-spacing: 0.3px;
}

.kpi-info-value {
    font-size: 12px;
    color: #2c2c2c;
    font-weight: 600;
}

.kpi-state-note {
    font-size: 11px;
    color: #6e6b7b;
    line-height: 1.2;
}

.kpi-grid-nuevo {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 8px;
}

.kpi-card {
    border-radius: 8px;
    padding: 6px 10px;
    color: #1f2937;
    box-shadow: none;
    border: 1px solid #e5e7eb;
    background: #ffffff;
}

.kpi-card-label {
    font-size: 9px;
    margin-bottom: 2px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #64748b;
}

.kpi-card-value {
    font-size: 0.9rem;
    font-weight: 700;
    line-height: 1.2;
    margin: 0;
    color: #0f172a;
}

.kpi-card-helper {
    margin-top: 2px;
    margin-bottom: 0;
    font-size: 9px;
    font-weight: 600;
    letter-spacing: 0.3px;
    color: #64748b;
}

.kpi-card-primary {
    border-left: 4px solid #046ae7;
}

.kpi-card-success {
    border-left: 4px solid #28c76f;
}

.kpi-card-warning {
    border-left: 4px solid #ff9f43;
}

.kpi-card-dark {
    border-left: 4px solid #7367f0;
}

.kpi-progress-wrap {
    margin-top: 6px;
}

.kpi-progress-track {
    width: 100%;
    height: 7px;
    border-radius: 999px;
    background: #e5e7eb;
    overflow: hidden;
}

.kpi-progress-fill {
    height: 100%;
    border-radius: 999px;
    background: #7367f0;
    transition: width 0.3s ease;
}

.acciones-nuevo {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    align-items: center;
}

.acciones-ejecutivo .vs-button {
    border-radius: 6px;
    min-height: 30px;
    font-weight: 600;
    font-size: 11px;
    padding: 0.35rem 0.75rem;
}

.resumen-notas-nuevo {
    display: flex;
    flex-wrap: nowrap;
    gap: 6px;
    margin-top: 4px;
}

.resumen-notas-scroll {
    overflow-x: auto;
    overflow-y: hidden;
    padding-bottom: 2px;
}

.notas-card-ejecutivo {
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-top: 2px solid #ff9f43;
}

.notas-title-ejecutivo {
    font-size: 0.95rem;
    line-height: 1.2;
    font-weight: 700;
    color: #1f2937;
}

.resumen-ejecutivo-row {
    display: flex;
    align-items: stretch;
    gap: 8px;
    margin-bottom: 6px;
}

.resumen-ejecutivo-item {
    min-width: 120px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    padding: 4px 8px;
    display: flex;
    flex-direction: column;
    gap: 1px;
}

.resumen-ejecutivo-label {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    font-weight: 700;
    color: #64748b;
}

.resumen-ejecutivo-main {
    font-size: 13px;
    font-weight: 800;
    color: #1e293b;
}

.resumen-ejecutivo-value {
    font-size: 11px;
    font-weight: 700;
    color: #b45309;
}

.resumen-ejecutivo-item-saldo {
    background: #fff7ed;
    border-color: #fed7aa;
}

.resumen-notas-item {
    background: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 999px;
    padding: 2px 10px;
    font-size: 12px;
    color: #9a3412;
    font-weight: 600;
    white-space: nowrap;
}

.notas-card-full {
    width: 100%;
}

.abono-nuevo-panel {
    width: min(980px, 96vw);
    max-width: 980px;
    padding: 8px 0 6px;
}

.abono-nuevo-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 12px;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #ffffff;
}

.abono-nuevo-header-left {
    min-width: 200px;
}

.abono-nuevo-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(255, 159, 67, 0.14);
    color: #b45309;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.4px;
    text-transform: uppercase;
    margin-bottom: 8px;
}

.abono-nuevo-title {
    font-size: 0.95rem;
    line-height: 1.1;
    font-weight: 700;
    color: #111827;
}

.abono-nuevo-subtitle {
    margin-top: 6px;
    font-size: 12px;
    color: #6b7280;
    line-height: 1.5;
}

.abono-nuevo-summary {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    min-width: 300px;
}

.abono-summary-card {
    border-radius: 6px;
    border: 1px solid #e5e7eb;
    background: #ffffff;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.abono-summary-card span {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    font-weight: 800;
    color: #64748b;
}

.abono-summary-card b {
    font-size: 0.85rem;
    font-weight: 700;
    color: #111827;
}

.abono-summary-card-warning {
    border-color: #fed7aa;
    background: #fff7ed;
}

.abono-summary-card-warning b {
    color: #b45309;
}

.abono-nuevo-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 6px;
}

.abono-chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 9px;
    border-radius: 999px;
    border: 1px solid #e5e7eb;
    background: #f8fafc;
    color: #475569;
    font-size: 10px;
    font-weight: 700;
}

.abono-chip-primary {
    background: rgba(4, 106, 231, 0.08);
    border-color: rgba(4, 106, 231, 0.18);
    color: #046ae7;
}

.abono-nuevo-form-grid {
    margin-top: 8px;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 8px;
    padding: 10px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #ffffff;
}

.abono-field {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.abono-field label {
    font-size: 10px;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    color: #64748b;
}

.abono-destino-fixed .vs-radio--label {
    font-weight: 700;
}

.abono-nuevo-tabla {
    margin-top: 8px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #ffffff;
    overflow: hidden;
}

.abono-section-title {
    padding: 8px 12px 4px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    color: #475569;
}

.abono-table-head,
.abono-table-row {
    display: grid;
    grid-template-columns: 1.25fr 0.8fr 0.95fr 0.95fr 1fr;
    gap: 8px;
    align-items: center;
}

.abono-table-head {
    padding: 7px 12px;
    background: #f8fafc;
    border-top: 1px solid #e5e7eb;
    border-bottom: 1px solid #e5e7eb;
}

.abono-table-head span {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    font-weight: 800;
    color: #64748b;
}

.abono-table-body {
    max-height: 300px;
    overflow-y: auto;
}

.abono-table-row {
    padding: 6px 12px;
    border-bottom: 1px solid #eef2f7;
    font-size: 12px;
    color: #1f2937;
}

.abono-table-row:last-child {
    border-bottom: 0;
}

.abono-table-row-disabled {
    opacity: 0.55;
    background: #f8fafc;
}

.abono-doc-code {
    font-weight: 800;
    color: #046ae7;
}

.abono-disponible {
    font-weight: 700;
    color: #b45309;
}

.abono-input-mini {
    width: 100%;
}

.abono-input-mini .vs-input--input {
    height: 32px;
    border-radius: 6px;
}

.abono-empty-state {
    padding: 10px 12px;
    color: #64748b;
    font-size: 12px;
}

.abono-nuevo-panel .flex.justify-center.gap-3.mt-4.pb-2 {
    padding-top: 8px;
}

.cheque-distribucion-head,
.cheque-distribucion-row {
    display: grid;
    grid-template-columns: 1.25fr 0.8fr 0.95fr 0.95fr 1fr;
    gap: 8px;
    align-items: center;
}

.cheque-distribucion-head {
    margin-top: 6px;
    padding: 7px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 6px 6px 0 0;
    background: #f8fafc;
}

.cheque-distribucion-head span {
    font-size: 9px;
    text-transform: uppercase;
    letter-spacing: 0.35px;
    font-weight: 800;
    color: #64748b;
}

.cheque-distribucion-body {
    border: 1px solid #e5e7eb;
    border-top: 0;
    border-radius: 0 0 6px 6px;
    max-height: 220px;
    overflow-y: auto;
}

.cheque-distribucion-row {
    padding: 8px 12px;
    border-bottom: 1px solid #eef2f7;
    font-size: 12px;
}

.cheque-distribucion-row:last-child {
    border-bottom: 0;
}

.cheque-input-mini {
    width: 100%;
}

.cheque-input-mini .vs-input--input {
    height: 32px;
    border-radius: 6px;
}

.cheque-distribucion-footer {
    display: flex;
    justify-content: space-between;
    gap: 10px;
    margin-top: 8px;
    font-size: 12px;
    color: #334155;
}

@media (max-width: 1100px) {
    .kpi-grid-nuevo {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .kpi-info-bar {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 640px) {
    .kpi-grid-nuevo {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }

    .kpi-info-bar {
        grid-template-columns: repeat(1, minmax(0, 1fr));
    }

    .abono-nuevo-panel {
        min-width: 100%;
        padding: 0;
    }

    .abono-nuevo-header,
    .abono-nuevo-form-grid {
        grid-template-columns: repeat(1, minmax(0, 1fr));
        display: grid;
    }

    .abono-nuevo-header {
        padding: 12px;
    }

    .abono-nuevo-summary {
        grid-template-columns: repeat(1, minmax(0, 1fr));
        min-width: 100%;
        width: 100%;
    }

    .abono-table-head,
    .abono-table-row,
    .cheque-distribucion-head,
    .cheque-distribucion-row {
        min-width: 720px;
    }

    .abono-nuevo-tabla,
    .cheque-distribucion-body {
        overflow-x: auto;
    }

    .cheque-distribucion-footer {
        flex-direction: column;
    }
}
</style>
