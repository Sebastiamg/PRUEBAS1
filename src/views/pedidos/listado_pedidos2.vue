<template>
<div>
    <!--LISTADO PEDIDOS-->
    <div v-if="menu == 1 && mostrarTipoModulo == 0">
        <!--MENU OPCIONES-->
        <vs-button color="primary" v-if="activeMenu == false" @click="activeMenu = true;" type="line">
            <ion-icon name="grid-outline"></ion-icon> Mostrar menú
        </vs-button>
        <div class="vx-row" v-if="activeMenu">
            <vx-card class="fade-in vx-col w-full sm:w-full md:w-full lg:w-full xl:w-full mb-6">
                <!--DIFERENTE DE BODEGA-->
                <div v-if="!userBodega">
                    <div class="header-sidebar">
                        <h4>
                            <div>
                                <span style="opacity:0.8;" class="text-primary">
                                    <ion-icon name="apps-outline" style="position: relative;top:2px;"></ion-icon> Menú de opciones
                                </span>
                                <vs-button size="small" v-if="userFacturador" class="ml-2" @click="$emit('changeRecarge',true)" style="margin-top: -10px;" type="relief">Recargar pedidos</vs-button>
                            </div>
                            <vs-button color="primary" icon="close" @click="activeMenu = false;" type="flat"></vs-button>
                        </h4>
                    </div>
                    <vs-divider></vs-divider>
                    <!--Opciones 100-->
                    <div class="vx-row">
                        <!--PENDIENTES-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                            <span class="menutitle">
                                <ion-icon name="cash-outline"></ion-icon> Pendientes <small style="font-size:11px;">(Sin contratos)</small>
                            </span>
                            <div class="submenu">
                                <span class="submenutitle menu1" v-if="userAdminFacturador || userRoot || userFacturador || userAsesor" @click="filtro = 1;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Sin anticipos: <b>{{ SumaSinAnticipo }}</b>
                                </span>
                                <span class="submenutitle menu2" v-if="userAdminFacturador || userRoot || userAsesor" @click="filtro = 2;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Con anticipo (sin aprobar): <b>{{ SumaConAnticipoSinAprobar }}</b>
                                </span>
                                <span class="submenutitle menu1003" @click="filtro = 1003;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon>Convenios Pendientes: <b>{{ SumaConveniosPendientes }}</b>
                                </span>
                                <!-- <span class="submenutitle menu13" v-if="userAdminFacturador || userRoot" @click="filtro = 13;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Total: <b>{{ SumaTotalPendientes }}</b>
                                </span> -->
                            </div>
                        </div>
                        <!--APROBADOS 200-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6" v-if="userAdminFacturador || userRoot || userFacturador || userAsesor">
                            <span class="menutitle">
                                <ion-icon name="cash-outline"></ion-icon> Aprobados <small style="font-size:11px;">(Sin contratos)</small>
                            </span>
                            <div class="submenu">
                                <span class="submenutitle menu3" @click="filtro = 3;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Con anticipo (aprobado): <b>{{ SumaConAnticipoAprobados }}</b>
                                </span>
                            </div>
                        </div>
                        <!--GERENCIA 300-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6" v-if="userAdminFacturador || userRoot || userFacturador">
                            <span class="menutitle">
                                <ion-icon name="people-circle-outline"></ion-icon> Gerencia <small style="font-size:11px;">(Sin contratos)</small>
                            </span>
                            <div class="submenu">
                                <span class="submenutitle menu4" v-if="userAdminFacturador || userRoot" @click="filtro = 4;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Solicitud anticipos: <b>{{ SumaSolicitudAnticipos }}</b>
                                </span>
                                <span class="submenutitle menu5" v-if="userAdminFacturador || userRoot || userFacturador" @click="filtro = 5;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Anticipos aprobados: <b>{{ SumaAnticiposGerenciaAprobados }}</b>
                                </span>
                                <span class="submenutitle menu6" v-if="userAdminFacturador || userRoot" @click="filtro = 6;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Anticipos anulados: <b>{{ SumaAnticiposGerenciaAnulados }}</b>
                                </span>
                                <span class="submenutitle menu14" v-if="userAdminFacturador || userRoot" @click="filtro = 14;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Total: <b>{{ SumaTotalGerencia }}</b>
                                </span>
                            </div>
                        </div>
                        <!--CONTRATOS 400-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                            <span class="menutitle">
                                <ion-icon name="albums-outline"></ion-icon> Contratos
                            </span>
                            <div class="submenu">
                                <span class="submenutitle menu7" @click="filtro = 7;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Con anticipos: <b>{{ SumaContratosConAnticipoAprobados }}</b>
                                </span>
                                <span class="submenutitle menu8" @click="filtro = 8;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Sin anticipos: <b>{{ SumaContratoSinAnticipo }}</b>
                                </span>
                                <span class="submenutitle menu15" v-if="userAdminFacturador || userRoot" @click="filtro = 15;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Total: <b>{{ SumaTotalContratos }}</b>
                                </span>
                            </div>
                        </div>
                        <!--CHEQUES 500-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6" v-if="userAdminFacturador || userRoot">
                            <span class="menutitle">
                                <ion-icon name="wallet-outline"></ion-icon> Cheques
                            </span>
                            <div class="submenu">
                                <span class="submenutitle menu9" @click="filtro = 9;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Cheques generados: <b>{{ SumaEntregaCheques }}</b>
                                </span>
                                <span class="submenutitle menu10" @click="filtro = 10;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Pagaré generados: <b>{{ SumaSolicitudesPagares }}</b>
                                </span>
                                <span class="submenutitle menu11" @click="filtro = 11;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Pagaré recibidos: <b>{{ SumaPagareFisicosEntregados }}</b>
                                </span>
                                <span class="submenutitle menu16" v-if="userAdminFacturador || userRoot" @click="filtro = 16;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Total: <b>{{ SumaTotalCheques }}</b>
                                </span>
                            </div>
                        </div>
                        <!--ALCANCE 600-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                            <span class="menutitle">
                                <ion-icon name="reader-sharp"></ion-icon> Alcance
                            </span>
                            <div class="submenu">
                                <span class="submenutitle menu17" @click="filtro = 17;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Pendientes: <b>{{ SumaAlcancePendientes }}</b>
                                </span>
                                <span class="submenutitle menu18" @click="filtro = 18;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Aprobados: <b>{{ SumaAlcanceCerrados }}</b>
                                </span>
                            </div>
                        </div>
                        <!--OTROS 700-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                            <span class="menutitle">
                                <ion-icon name="contract-outline"></ion-icon> Otros
                            </span>
                            <div class="submenu">
                                <span class="submenutitle menu10000 text-warning font-bold" @click="filtro = 10000;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Todos: <b>{{ sumaTotal }}</b>
                                </span>
                                <span class="submenutitle menu19" @click="filtro = 19;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Anulados: <b>{{ SumaAnulados }}</b>
                                </span>
                            </div>
                        </div>
                        <!--TIPOS DE VENTAS 800-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                            <span class="menutitle">
                                <ion-icon name="file-tray-stacked-sharp"></ion-icon> Tipo de venta <small style="font-size:11px;">(contratos)</small>
                            </span>
                            <div class="submenu">
                                <span class="submenutitle menu20" @click="filtro = 20;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Venta directa: <b>{{ SumaVentaDirecta }}</b>
                                </span>
                                <span class="submenutitle menu21" @click="filtro = 21;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Venta lista: <b>{{ SumaVentaLista }}</b>
                                </span>
                            </div>
                        </div>
                        <!--LIBROS HIJOS DOCENTES 900-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                            <span class="menutitle">
                                <ion-icon name="book"></ion-icon> Hijos Docentes/Obs.
                            </span>
                            <div class="submenu">
                                <span class="submenutitle menu24" @click="filtro = 24;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Todos: <b>{{ SumaPedidosLibrosObsequiosTodos }}</b>
                                </span>
                                <span class="submenutitle menu25" @click="filtro = 25;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> H.Doc/Obsequios pendientes: <b>{{ (SumaPedidosLibrosObsequios + SumaPedidosLibrosHijosDocentesPendientes)}}</b>
                                </span>
                            </div>
                        </div>
                        <!--PENDIENTES CIERRES DE PAGOS-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                            <span class="menutitle">
                                <ion-icon name="wallet-sharp"></ion-icon> Cierre de Pagos <small style="font-size:11px;"></small>
                            </span>

                            <div class="submenu">
                                <span class="submenutitle menu30" @click="filtro = 30;filtroTipo();estadoMenu();">
                                      <ion-icon name="caret-forward-outline"></ion-icon>Pago de convenio: <b>{{ SumaPagoConveniosPendientes }}</b>
                                  </span>
                                <span class="submenutitle menu31" @click="filtro = 31;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Anticipos pedido: <b>{{ SumaPagoAnticiposPendientes }}</b>
                                </span>
                            </div>
                        </div>
                        <!--COMISION 1000-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                            <span class="menutitle">
                                <ion-icon name="podium-sharp"></ion-icon> Mas comisión <small style="font-size:11px;"></small>
                            </span>
                            <div class="submenu">
                                <span class="submenutitle menu1000" @click="filtro = 1000;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Pendientes: <b>{{ sumaSolicitudComision }}</b>
                                </span>
                                <span class="submenutitle menu1001" @click="filtro = 1001;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Aprobadas: <b>{{ sumaComisionAprobado }}</b>
                                </span>
                            </div>
                        </div>
                        <!-- Convenios -->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                            <span class="menutitle">
                                <ion-icon name="prism-sharp"></ion-icon> Convenios <small style="font-size:11px;"></small>
                            </span>
                            <div class="submenu">
                                <span class="submenutitle menu1002" @click="filtro = 1002;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Todos: <b>{{ sumaConvenio }}</b>
                                </span>

                                <!-- <span class="submenutitle menu1003" @click="filtro = 1003;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Pendientes: <b>{{ SumaConveniosPendientes }}</b>
                                </span> -->
                                <span class="submenutitle menu1004" @click="filtro = 1004;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Solicitado a gerencia: <b>{{ SumaConvenioSolicitadoGerencia }}</b>
                                </span>
                                <span class="submenutitle menu1006" @click="filtro = 1006;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Aprobados: <b>{{ SumaConveniosAprobados }}</b>
                                </span>
                                <span class="submenutitle menu1007" @click="filtro = 1007;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Cerrados: <b>{{ SumaConveniosCerrados }}</b>
                                </span>
                                 <span class="submenutitle menu1008" @click="filtro = 1008;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Rechazados: <b>{{ SumaConveniosRechazados }}</b>
                                </span>
                                <span class="submenutitle menu1009" @click="filtro = 1009;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Finalizados: <b>{{ SumaConveniosFinalizados }}</b>
                                </span>
                            </div>
                        </div>
                        <!--PAGARES-->
                        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/5 xl:w-1/5 mb-6">
                            <span class="menutitle">
                                <ion-icon name="document-text-outline"></ion-icon> Pagarés <small style="font-size:11px;"></small>
                            </span>

                            <div class="submenu">
                                <span class="submenutitle menu50" @click="filtro = 50;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Sin Evidencia: <b>{{ SumaPagaresSinEvidencia }}</b>
                                </span>
                                <span class="submenutitle menu51" @click="filtro = 51;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Con Evidencia: <b>{{ SumaPagaresConEvidencia }}</b>
                                </span>
                                <span class="submenutitle menu52" @click="filtro = 52;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Anulados: <b>{{ SumaPagaresAnulados }}</b>
                                </span>
                                <span class="submenutitle menu53" @click="filtro = 53;filtroTipo();estadoMenu();">
                                    <ion-icon name="caret-forward-outline"></ion-icon> Total Pagarés: <b>{{ SumaPagaresTotal }}</b>
                                </span>
                            </div>
                        </div>
                    </div>
                    <vs-divider>Filtro por:</vs-divider>
                    <div class="vx-row">
                        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6 mt-1">
                            <vs-row>
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                    <ul class="flex">
                                        <li>
                                            <vs-radio v-model="tipoFecha" @input="titleFecha='Fecha envio'" vs-name="radios1tipoFecha" vs-value="0">Fecha envio</vs-radio>
                                        </li>
                                        <li>
                                            <vs-radio v-model="tipoFecha" class="ml-2" @input="titleFecha='Fecha entrega';" vs-name="radios1tipoFecha" vs-value="1">Fecha Entrega</vs-radio>
                                        </li>
                                    </ul>
                                </vs-col>
                                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                                    <flat-pickr :config="configdateTimePicker" v-model="fechaSelect" @input="filtrarFechas()" :placeholder="titleFecha" class="m-1" style="display: inline-block;width: 100%;" />
                                    <vx-tooltip style="display: inline-block;" text="Limpiar filtro" position="top" color="primary">
                                        <vs-button v-if="fechaSelect" radius color="primary" type="border" icon-pack="feather" @click="fechaSelect='';filtrarFechas()" icon="icon-x"></vs-button>
                                    </vx-tooltip>
                                </vs-col>
                            </vs-row>
                        </div>
                        <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/2 xl:w-1/2 mb-6" style="margin-top: -14px;">
                            <small>Verificaciones de:</small>
                            <div class="flex">
                                <v-select :options="arrayAsesores" @input="filtroAsesores(0);" :reduce="arrayAsesores => arrayAsesores.id_asesor" label="asesor" class="w-full" v-model="asesorSelect" />
                                <vs-button icon="search" class="ml-1" @click="filtroAsesores(0);">Buscar</vs-button>
                                <vx-tooltip style="display: inline-block;" text="Mostrar todo" position="top" color="primary">
                                    <vs-button v-if="asesorSelect" icon-pack="feather" icon="icon-x" class="ml-1" color="danger" @click="filtroAsesores(1);"></vs-button>
                                </vx-tooltip>
                            </div>
                        </div>
                    </div>

                </div>

                <!--venta real asesor todos los contratos-->
                <!--TOTAL VENTA BRUTA-->
                <div class="flex flex-wrap justify-start gap-6">
                    <div class="p-6 pb-0 w-full sm:w-auto" v-if="totalValorPedidosContratos > 0">
                        <div class="flex justify-center">
                            <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-warning mb-4" style="background: rgba(var(--vs-warning),0.15);">
                                <feather-icon icon="ArchiveIcon" svgClasses="h-8 w-7" class="ml-1" />
                            </span>
                        </div>
                        <div class="flex justify-center">
                            <h2 class="mb-1 font-bold" style="opacity:0.7;color:#1E9080;">${{ totalValorPedidosContratos | filtrarDecimal }}</h2>
                        </div>
                        <div class="ml-4"><span class="">Suma en pedidos + alcances + hijos docentes y obsequios (solo contratos)</span></div>
                    </div>
                    <div class="p-6 pb-0 w-full sm:w-auto" v-if="totalRealContratos > 0">
                        <div class="flex justify-center">
                            <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                                <feather-icon icon="ShoppingBagIcon" svgClasses="h-8 w-7" class="ml-1" />
                            </span>
                        </div>
                        <div class="flex justify-center">
                            <h2 class="mb-1 font-bold" style="opacity:0.7;color:#1E9080;">${{ totalRealContratos | filtrarDecimal }}</h2>
                        </div>
                        <div class="ml-4"><span class="">Total Venta Real Contratos (Verificaciones)</span></div>
                    </div>

                    <div class="ml-5 p-6 pb-0 w-full sm:w-auto" v-if="totalValorPedidosContratosD > 0">
                        <div class="flex justify-center">
                            <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-success mb-4" style="background: rgba(var(--vs-success),0.15);">
                                <feather-icon icon="ShoppingBagIcon" svgClasses="h-8 w-7" class="ml-1" />
                            </span>
                        </div>
                        <div class="flex justify-center">
                            <h2 class="mb-1 font-bold text-success" style="opacity:0.7;">${{ totalValorPedidosContratosD | filtrarDecimal }}</h2>
                        </div>
                        <div class="ml-4"><span class="text-success">Pedidos V.Directas</span></div>
                    </div>

                    <div class="p-6 pb-0 w-full sm:w-auto" v-if="totalVDirectaReal > 0">
                        <div class="flex justify-center">
                            <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-warning mb-4" style="background: rgba(var(--vs-warning),0.15);">
                                <feather-icon icon="TruckIcon" svgClasses="h-8 w-7" class="ml-1" />
                            </span>
                        </div>
                        <div class="flex justify-center">
                            <h2 class="mb-1 font-bold text-warning" style="opacity:0.7;">${{ (totalVDirectaReal - totalDevDirectaReal) | filtrarDecimal }}</h2>
                        </div>
                        <div class="text-center mx-auto" style="width: fit-content;">
                            <span class="text-warning">Despacho - Devuelto <br> V.Directas</span>
                        </div>
                    </div>
                </div>
            </vx-card>
            <vx-card title="VENTAS DIRECTAS FACTURADAS" class="mb-2" v-if="userAsesor">
                <div class="flex flex-wrap justify-start gap-6">
                    <div class="ml-5 p-6 pb-0 w-full sm:w-auto" v-if="totalVDirectaReal > 0">
                        <div class="flex justify-center">
                            <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-success mb-4" style="background: rgba(var(--vs-success),0.15);">
                                <feather-icon icon="TrendingUpIcon" svgClasses="h-8 w-7" class="ml-1" />
                            </span>
                        </div>
                        <div class="flex justify-center">
                            <h2 class="mb-1 font-bold text-success" style="opacity:0.7;">${{ totalVDirectaReal | filtrarDecimal }}
                            </h2>
                        </div>
                        <div class="ml-4"><span class="text-success">Facturado V.Directas</span></div>
                    </div>

                    <div class="ml-5 p-6 pb-0 w-full sm:w-auto" v-if="totalVDirectaReal > 0">
                        <div class="flex justify-center">
                            <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-danger mb-4" style="background: rgba(var(--vs-danger),0.15);">
                                <feather-icon icon="TrendingDownIcon" svgClasses="h-8 w-7" class="ml-1" />
                            </span>
                        </div>
                        <div class="flex justify-center">
                            <h2 class="mb-1 font-bold text-danger" style="opacity:0.7;">${{ totalDevDirectaReal | filtrarDecimal }}
                            </h2>
                        </div>
                        <div class="ml-4"><span class="text-danger">Devoluciones V.Directas</span></div>
                    </div>

                    <div class="p-6 pb-0 w-full sm:w-auto" v-if="totalVDirectaReal > 0">
                        <div class="flex justify-center">
                            <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-primary mb-4" style="background: rgba(var(--vs-primary),0.15);">
                                <feather-icon icon="TruckIcon" svgClasses="h-8 w-7" class="ml-1" />
                            </span>
                        </div>
                        <div class="flex justify-center">
                            <h2 class="mb-1 font-bold text-primary" style="opacity:0.7;">${{ (totalVDirectaReal -
                  totalDevDirectaReal) | filtrarDecimal }}</h2>
                        </div>
                        <div class="text-center mx-auto" style="width: fit-content;">
                            <span class="text-primary">Despacho - Devuelto <br> V.Directas</span>
                        </div>
                    </div>

                    <div class="p-6 pb-0 w-full sm:w-auto" v-if="totalAbonoGlobal > 0">
                        <div class="flex justify-center">
                            <span class="p-4 inline-flex rounded-full feather-icon select-none relative text-dark mb-4" style="background: rgba(var(--vs-dark),0.15);">
                                <feather-icon icon="DollarSignIcon" svgClasses="h-8 w-7" class="ml-1" />
                            </span>
                        </div>
                        <div class="flex justify-center">
                            <h2 class="mb-1 font-bold text-dark" style="opacity:0.7;">${{ totalAbonoGlobal | filtrarDecimal }}
                            </h2>
                        </div>
                        <div class="ml-4"><span class="text-dark">Cobros V.Directas</span></div>
                    </div>
                </div>
            </vx-card>
        </div>
        <!--MENU OPCIONES-->
        <!--TABLA-->
        <div>
            <vs-table ref="tablaPedidos" max-items="20" search :data="tmpPedidos" pagination>
                <template slot="header">
                    <vs-chip color="primary" class="ml-1">Cantidad: {{tmpPedidos.length}}</vs-chip>
                    <h5 v-if="!userBodega" class="ml-2">Pedidos período {{ periodoSelect.periodoescolar }} </h5>
                    <span @click="tipoExportacion=1;tryExport();" class="cursor-pointer">
                        <vx-tooltip style="display: inline-block;" text="Seleccione los registros a exportar" position="top" color="primary">
                            <vs-chip transparent class="py-3 ml-5" style="font-weight: bold;" color="dark"><i class="fa-solid fa-download"></i><span class="ml-2">Exportar Reporte Venta</span> </vs-chip>
                        </vx-tooltip>
                    </span>
                </template>
                <template slot="thead">
                    <vs-th>#</vs-th>
                    <vs-th sort-key="nombreInstitucion" width="600">Institución</vs-th>
                    <vs-th sort-key="fecha_envio">Fechas</vs-th>
                    <vs-th>Venta</vs-th>
                    <vs-th>Detalle V.</vs-th>
                    <vs-th>Contrato generado</vs-th>
                    <vs-th sort-key="asesor">Pagos</vs-th>
                    <vs-th>Acciones</vs-th>
                    <vs-th v-if="userRoot" width="50"></vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" :class="{'highlight-row': contratoResaltado == tr.contrato_generado}">
                        <vs-td>
                            {{ tr.id_pedido }}
                            <p class="mt-1" style="margin-left:-5px;" v-if="groupFacturador">
                                <vs-chip v-if="tr.notificados == 1" color="#314278">Notificado</vs-chip>
                            </p>
                        </vs-td>
                        <vs-td>
                            <b>Tipo de venta</b>
                            {{tr.tipo_venta_descr}}
                            <p v-if="userBodega" class="mt-1">
                                <vs-chip color="primary">{{ tr.periodoescolar }}</vs-chip>
                            </p>
                            <p class="font-bold">Institución:
                                <small v-if="userRoot">{{ tr.id_institucion }}</small>
                            </p>
                            <span>{{ tr.nombreInstitucion }} </span>
                            <p><b>Ciudad:</b> {{ tr.nombre_ciudad }}</p>
                            <p class="font-bold">Asesor:</p>
                            <span>{{ tr.responsable }} ( {{ tr.iniciales }} )</span>
                            <p><b>Cédula:</b> {{ tr.cedula_asesor }}</p>
                            <p v-if="groupFacturador && tr.ca_codigo_agrupado"><b>Agrupado: </b>{{ tr.ca_codigo_agrupado }}</p>
                        </vs-td>
                        <vs-td>
                            <div>
                                <p class="font-bold">Fecha de creación:</p>
                                <span>{{ tr.created_at }} </span>
                                <p class="font-bold">Fecha de actualización:</p>
                                <span>{{ tr.updated_at }} </span>
                            </div>
                        </vs-td>
                        <vs-td>
                            <p class="font-bold">Total unidades:</p>
                            <span v-if="tr.alcanceUnidades == null">{{ tr.total_unidades }} </span>
                            <span v-else>{{ parseInt(tr.total_unidades) + parseInt(tr.alcanceUnidades) }}</span>
                            <p class="font-bold">Venta bruta:</p>
                            <span>{{ tr.TotalVentaReal | filtrarDecimal}} </span>

                            <div v-if="tr.ven_neta > 0">
                                <p class="font-bold">Venta Neta:</p>
                                <span>{{ tr.ven_neta | filtrarDecimal }} </span>
                            </div>
                        </vs-td>
                        <vs-td>
                            <p class="font-bold">Comisión:</p>
                            <span>{{ tr.descuento }} </span>
                            <!---COMISION APROBADO POR-->
                            <div v-if="tr.id_grupo_finaliza">
                                <div v-if="tr.solicitud_gerencia_estado == 2">
                                    <span v-if="tr.id_grupo_finaliza == 25" class="text-danger">% Rechazado por gerencia</span>
                                    <span v-else class="text-danger">% Rechazado por facturador</span>
                                </div>
                                <div v-else>
                                    <span v-if="tr.id_grupo_finaliza == 25" class="text-success">% Aprobado por gerencia</span>
                                    <span v-else class="text-success">% Aprobado por facturador</span>
                                </div>
                                <p>{{tr.asesor_editComision}}</p>
                            </div>
                            <!--COMISION PENDIENTE-->
                            <div v-if="tr.solicitud_gerencia_estado == 1 && (userRoot || usuario.id_group == 23)">
                                <vs-button color="#D83A17" class="mt-1" size="small" @click="pedido = tr; popupSolicitudComision = true;">% Solicita mas Comisión</vs-button>
                            </div>
                            <div v-if="tr.ifanticipo == 1">
                                <p class="font-bold">Anticipo sugerido:</p>
                                <span>{{ tr.anticipo }} </span>
                                <p class="font-bold">Anticipo aprobado:</p>
                                <span>{{ tr.anticipo_aprobado }} </span>
                            </div>
                            <div v-if="tr.convenioAnulado == 0">
                                <div v-if="tr.anticipo_global">
                                    <p class="font-bold">Convenio global:</p>
                                    <span>{{ tr.anticipo_global }} </span>
                                </div>
                                <div v-if="tr.convenio_anios > 0">
                                    <p class="font-bold">Convenio:</p>
                                    <span>{{ tr.convenio_anios }} </span>
                                </div>
                                <!-- Documentos de convenio -->
                                <div v-if="(tr.estado == 0 || tr.estado == 1) && (tr.count_convenio_doc_con_evidencia > 0 || tr.count_convenio_doc_sin_evidencia > 0 || tr.count_convenio_doc_anulados > 0)" style="margin-top:8px; padding-top:8px;">
                                    <p class="font-bold" style="margin-bottom:6px;">Documentos convenio</p>
                                    <div style="display:flex; flex-direction:column; gap:6px;">
                                        <div v-if="tr.count_convenio_doc_con_evidencia" class="status-badge status-con-evidencia">
                                            <span class="status-dot"></span>
                                            {{ tr.count_convenio_doc_con_evidencia }} Con evidencia
                                        </div>
                                        <div v-if="tr.count_convenio_doc_sin_evidencia" class="status-badge status-sin-evidencia">
                                            <span class="status-dot"></span>
                                            {{ tr.count_convenio_doc_sin_evidencia }} Sin evidencia
                                        </div>
                                        <div v-if="tr.count_convenio_doc_anulados" class="status-badge status-anulado">
                                            <span class="status-dot"></span>
                                            {{ tr.count_convenio_doc_anulados }} Anulados
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- ESTADOS PAGARES -->
                            <div
                                v-if="tr.count_pagares_sin_evidencia > 0 || tr.count_pagares_con_evidencia > 0 || tr.count_pagares_anulados > 0" style="margin-top:10px; padding-top:10px; border-top:1px solid #dcdcdc;">
                                <p class="font-bold" style="margin-bottom:6px;">
                                    Resumen de pagarés
                                </p>
                                <div style="display:flex; flex-direction:column; gap:6px;">
                                    <div v-if="tr.count_pagares_con_evidencia" class="status-badge status-con-evidencia">
                                        <span class="status-dot"></span>
                                        {{ tr.count_pagares_con_evidencia }} Con evidencia
                                    </div>
                                    <div v-if="tr.count_pagares_sin_evidencia" class="status-badge status-sin-evidencia">
                                        <span class="status-dot"></span>
                                        {{ tr.count_pagares_sin_evidencia }} Sin evidencia
                                    </div>
                                    <div v-if="tr.count_pagares_anulados" class="status-badge status-anulado">
                                        <span class="status-dot"></span>
                                        {{ tr.count_pagares_anulados }} Anulados
                                    </div>
                                </div>
                            </div>
                        </vs-td>
                        <vs-td>
                            <!--Convenio-->
                            <div style="background-color: bisque;overflow: hidden;" class="font-medium mt-1" v-if="tr.convenio_anios > 0 || tr.pedidos_convenios_id > 0">
                              <small v-if="usuario.name_usuario=='sguacan'">#{{ tr.pedidos_convenios_id }}</small>
                              <p v-if="tr.contadorConvenioPendientes > 0">Convenio Pendiente </p>
                              <p v-else-if="tr.contadorConvenioSolicitadoGerencia > 0">Convenio Solicitado a Gerencia</p>
                              <!-- <p v-else-if="tr.contadorConvenioRechazadoGerencia > 0">Convenio Rechazado por Gerencia</p> -->
                              <p v-else-if="tr.contadorConvenioAprobadoGerencia > 0">Convenio Aprobado por Gerencia</p>
                              <p v-else-if="tr.contadorConvenioAprobadoFacturador > 0">Convenio  Aprobado por Facturador</p>
                              <p v-else-if="tr.convenioAnulado > 0">Convenio cerrado</p>
                              <p v-else-if="tr.convenioRechazado > 0">Convenio rechazado</p>
                            </div>
                            <!-- Contrato -->
                            <div class="my-3">
                                <p class="font-bold">Contrato:</p>
                                <span>{{ tr.contrato_generado }} </span>
                                <div v-if="tr.estadoPedido_Pagos">
                                    <div
                                        @mouseenter="cargarHistorialEstado(tr)"
                                        @mouseleave="limpiarHistorialEstado"
                                        style="position: relative; display: inline-block;">
                                        <p
                                            class="text-warning font-bold cursor-pointer"
                                            v-if="tr.estadoPedido_Pagos == 1">
                                            Pagado
                                        </p>
                                        <p
                                            class="text-warning font-bold cursor-pointer"
                                            v-else-if="tr.estadoPedido_Pagos == 2">
                                            Pendiente
                                        </p>
                                        <p
                                            class="text-warning font-bold cursor-pointer"
                                            v-else-if="tr.estadoPedido_Pagos == 3">
                                            Deuda
                                        </p>
                                        <p
                                            class="text-warning font-bold cursor-pointer"
                                            v-else-if="tr.estadoPedido_Pagos == 4">
                                            Liquidado sin códigos
                                        </p>

                                        <!-- Tooltip con historial -->
                                        <div
                                            v-if="mostrarTooltipHistorial && pedidoHistorialActual === tr.id_pedido"
                                            class="tooltip-historial">
                                            <div v-if="cargandoHistorial" class="text-center p-3">
                                                <i class="fa fa-spinner fa-spin"></i> Cargando...
                                            </div>
                                            <div v-else-if="historialEstados.length > 0">
                                                <div class="tooltip-header">
                                                    <strong>Historial de Cambios</strong>
                                                </div>
                                                <div class="tooltip-content">
                                                    <div
                                                        v-for="(item, index) in historialEstados"
                                                        :key="index"
                                                        class="historial-item">
                                                        <div class="historial-cambio">
                                                            <span class="estado-badge estado-anterior">{{ item.estado_anterior_desc }}</span>
                                                            <i class="fa fa-arrow-right mx-1"></i>
                                                            <span class="estado-badge estado-nuevo">{{ item.estado_nuevo_desc }}</span>
                                                        </div>
                                                        <div class="historial-info">
                                                            <div><i class="fa fa-user"></i> {{ item.usuario_nombre }}</div>
                                                            <div><i class="fa fa-clock"></i> {{ formatearFecha(item.fecha) }}</div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div v-else class="text-center p-3 text-muted">
                                                No hay historial de cambios
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div v-if="tr.contrato_generado != null">
                                    <span style="color: #f87770;" v-if="tr.permitir_editar_despues_contrato == 1">
                                        Asesor puede editar el contrato
                                    </span>
                                </div>
                            </div>

                            <!-- Alcance pendiente -->
                            <div v-if="groupFacturador && tr.contadorAlcanceAbierto > 0" class="my-3">
                                <span @click="pedido = tr; verAlcance(tr);" style="background-color:red;color:white;padding:6px;border-radius:5px;">
                                    Alcance pendiente
                                </span>
                            </div>

                            <!-- Cheque -->
                            <div class="my-3">
                                <p v-if="tr.historicoEstado == 6 || tr.historicoEstado == 7 && groupFacturador" @click="mostrarDocumento = true; pedido = tr; popupEnviarCheque = true;" class="text-success cursor-pointer">
                                    <span><i class="fa-solid fa-camera"></i><b> Cheque:</b> enviado desde contabilidad</span>
                                </p>
                                <p v-if="tr.historicoEstado > 7" @click="mostrarDocumento = true; pedido = tr; popupEnviarCheque = true;" class="text-success cursor-pointer">
                                    <span><i class="fa-solid fa-camera"></i><b> Cheque:</b> entregado</span>
                                </p>
                            </div>

                            <!-- Pagaré -->
                            <div class="my-3">
                                <p v-if="tr.historicoEstado == 9" @click="mostrarDocumento = true; pedido = tr; popupRecibirPagare = true;" class="cursor-pointer">
                                    <span><i class="fa-solid fa-camera"></i><b> Pagaré:</b> subido</span>
                                </p>
                                <p v-if="tr.historicoEstado > 9" @click="mostrarDocumento = true; pedido = tr; popupRecibirPagare = true;" class="text-success cursor-pointer">
                                    <span><i class="fa-solid fa-camera"></i><b>Pagaré:</b> recibido (facturador)</span>
                                </p>
                                <p v-if="tr.historicoEstado > 10" @click="mostrarDocumento = true; pedido = tr; popupRecibirPagare = true;" class="text-success cursor-pointer">
                                    <span><i class="fa-solid fa-camera"></i><b>Pagaré:</b> recibido (contabilidad)</span>
                                </p>
                            </div>

                            <!-- Estado y estado de facturación -->
                            <div class="my-3">
                                <p v-if="tr.facturacion_vee == 0 && (userAsesor || userRoot)">
                                    <vs-chip color="danger">Facturador no puede ver</vs-chip>
                                </p>
                                <vs-chip v-if="tr.estado == 0" color="warning">
                                    Pedido incompleto
                                </vs-chip>
                                <vs-chip v-if="tr.estado == 1">
                                    Activo
                                </vs-chip>
                                <vs-chip v-if="tr.estado == 2" color="danger">
                                    Anulado
                                </vs-chip>
                            </div>

                            <!-- Información de anulación -->
                            <div v-if="tr.estado == 2" class="my-3">
                                <p><b>Anulado por:</b> {{ tr.facturador }}</p>
                            </div>

                            <!-- Aprobación por Gerencia -->
                            <div class="my-3">
                                <p class="mt-1">
                                    <vs-chip color="#5E4BE5" v-if="tr.ifagregado_anticipo_aprobado == 3">
                                        Anticipo Aprobado por Gerencia
                                    </vs-chip>
                                </p>
                            </div>

                            <!-- Verificaciones -->
                            <div class="my-3">
                                <p class="mt-1" v-if="tr.verificaciones > 0" @click="pedido = tr; ver_pedido(tr)">
                                    <vs-chip><b>Verificaciones: {{ tr.verificaciones }} </b></vs-chip>
                                </p>
                            </div>

                            <!-- Verificación pendiente -->
                            <div class="my-3">
                                <p class="mt-1" v-if="tr.estado_verificacion > 0" @click="pedido = tr; popupCodigosLiquidarse=true;">
                                    <vs-chip color="warning">Verificación pendiente</vs-chip>
                                </p>
                            </div>
                            <!-- Libros Hijos Docentes y Obsequios -->
                            <div v-if="tr.estado_librosObsequios && tr.estado == 1" class="my-3">
                                <!-- Libros Hijos Docentes pendiente -->
                                <div v-if="(groupFacturador || usuario.id_group == 11) && tr.contadorHijosDocentesAbiertosEnviados > 0" class="my-2" @click="pedido = tr; ver_pedido(tr, 11);">
                                    <vs-chip color="danger">
                                        Libros H. Docs pendiente {{ tr.contadorHijosDocentesAbiertosEnviados }}
                                    </vs-chip>
                                </div>
                                <!-- Libros Obsequios pendiente -->
                                <div v-else-if="(groupFacturador || usuario.id_group == 11) && tr.contadorObsequiosAbiertosEnviados > 0" class="my-2" @click="pedido = tr; ver_pedido(tr, 11);">
                                    <vs-chip color="primary">
                                        Libros Obs pendiente {{ tr.contadorObsequiosAbiertosEnviados }}
                                    </vs-chip>
                                </div>
                                <!-- Título "Libros H.Docs/Obs." -->
                                <div v-else class="my-2" @click="pedido = tr; ver_pedido(tr, 11);">
                                    <vs-chip>
                                        Libros H.Docs/Obs.
                                    </vs-chip>
                                </div>
                            </div>
                        </vs-td>
                        <vs-td>

                            <b>Total Comision:</b>
                            <p>{{ tr.totalValorComision | filtrarDecimal }}</p>
                            <b v-if="tr.totalPagado  > 0">Total Pagado a Clientes:</b>
                            <p v-if="tr.totalPagado > 0" class="text-success">{{ tr.totalPagado | filtrarDecimal }}</p>
                            <b v-if="tr.totalPendienteLiquidar > 0">Pendiente Liquidar:</b>
                            <p v-if="tr.totalPendienteLiquidar > 0" class="text-danger"> {{ tr.totalPendienteLiquidar | filtrarDecimal }}</p>
                            <div v-if="tr.deuda > 0">
                                <p class="font-bold">Deuda anterior:</p>
                                <span class="text-danger">{{ tr.deuda }} <b v-if="tr.deuda_anterior_estado == 1" class="text-success">(PAGADO)</b></span>
                            </div>
                            <div v-if="tr.totalDeudaProxima > 0">
                                <p class="font-bold">Deuda proximo año :</p>
                                <span class="text-danger">{{ tr.totalDeudaProxima }} </span>
                            </div>

                        </vs-td>
                        <vs-td align="center">
                            <vs-dropdown vs-custom-content vs-trigger-click>
                                <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                <vs-dropdown-menu style="width: 320px;" class="cursor">
                                    <div v-if="!userBodega">
                                        <!--VER PEDIDO-->
                                        <vs-dropdown-item>
                                            <vs-button color="success" type="line" class="w-full" @click="ver_pedido(tr)">&nbsp;&nbsp;&nbsp;Ver pedido&nbsp;&nbsp;&nbsp;</vs-button>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item>
                                            <vs-button color="success" type="line" class="w-full" @click="pedido = tr;ver_pagos(tr)">&nbsp;&nbsp;&nbsp;<i class="fa-solid fa-cart-shopping"></i> Ver pagos&nbsp;&nbsp;&nbsp;</vs-button>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="tr.estado == 1 && tr.historicoEstado < 4 && groupFacturador">
                                            <!--ANULAR PEDIDO-->
                                            <vs-button color="danger" type="line" class="w-full" @click="pedido = tr;anular_pedido(tr)">Anular pedido</vs-button>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="tr.estado == 0 && userAsesor">
                                            <!--ANULAR PEDIDO-->
                                            <vs-button color="danger" type="line" class="w-full" @click="pedido = tr;anular_pedido(tr)">Anular pedido</vs-button>
                                        </vs-dropdown-item>
                                        <!--GENERAR PEDIDO-->
                                        <vs-dropdown-item v-if="tr.estado == 2 && userAsesor">
                                            <!--GENERAR PEDIDO-->
                                            <vs-button color="#5BB9E5" type="line" class="w-full" @click="pedido = tr;ConfirmgenerarNuevoPedido(tr)">&nbsp;&nbsp;&nbsp;Generar pedido&nbsp;&nbsp;&nbsp;</vs-button>
                                        </vs-dropdown-item>
                                        <!--REPORTE PEDIDO-->
                                        <vs-dropdown-item v-if="tr.estado == 1 && groupFacturador">
                                            <vs-button icon-pack="feather" class="w-full" icon="icon-file" @click="pedido = tr;chooseBeneficiarioPedido(tr,1);" color="success" type="line">Reporte pedido</vs-button>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="tr.contrato_generado !=null && tr.estado == 1 && groupFacturador">
                                            <!--IMPRIMIR REPORTE CONTRATO WORD-->
                                            <vs-button class="w-full" @click="tipoFile = 0;generarReportePdfContrato(tr,2)" color="primary" type="line">Reporte contrato word</vs-button>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="tr.contrato_generado !=null && tr.estado == 1 && groupFacturador">
                                            <!--IMPRIMIR REPORTE CONTRATO PDF-->
                                            <vs-button class="w-full" icon="picture_as_pdf" @click="tipoFile = 1;generarReportePdfContrato(tr,2); pedido = tr" color="#6A33D2" type="line">Reporte contrato pdf</vs-button>
                                        </vs-dropdown-item>
                                        <!--CAMBIAR ESTADO PEDIDO-->
                                        <!-- <vs-dropdown-item v-if="groupFacturador || userRoot">
                        <vs-button class="w-full"  icon="build" @click="sendPedido = tr; popupEstadoPedido = true;" color="#6A33D2" type="line">Estado pedido</vs-button>
                      </vs-dropdown-item> -->
                                        <vs-dropdown-item v-if="groupFacturador && tr.contrato_generado !=null && tr.estado == 1 && (tr.tipo_venta == '1' || tr.tipo_venta == '2') && (tr.contadorAlcanceAbierto > 0 || tr.contadorAlcanceCerrado > 0)">
                                            <!--ALCANCE-->
                                            <vs-button class="w-full" @click="pedido = tr;verAlcance(tr);" color="warning" type="line">Ver Alcance</vs-button>
                                        </vs-dropdown-item>
                                        <!--ALCANCE ASESOR-->
                                        <vs-dropdown-item v-if="userAsesor && tr.contrato_generado !=null && tr.estado == 1">
                                            <!--ALCANCE-->
                                            <vs-button icon-pack="feather" class="w-full" icon="icon-file" @click="pedido = tr;verAlcance(tr);" color="warning" type="line">Alcance</vs-button>
                                        </vs-dropdown-item>
                                        <!--SOLICITAR VERIFICACION-->
                                        <vs-dropdown-item v-if="tr.contrato_generado != null && tr.estado == 1 && (userRoot || userAsesor || groupFacturador)">
                                            <template v-if="tr.verificaciones >= 5">
                                                <vx-tooltip text="Ya se han realizado todas las verificaciones permitidas para este contrato." position="top" color="danger">
                                                    <vs-button disabled icon-pack="feather" class="w-full" icon="icon-users" color="dark" type="line">
                                                        Solicitar Verificación
                                                    </vs-button>
                                                </vx-tooltip>
                                            </template>
                                            <template v-else>
                                                <vs-button icon-pack="feather" class="w-full" icon="icon-users" @click="pedido = tr; SolicitarVerificacion(tr);" color="dark" type="line">
                                                    Solicitar Verificación
                                                </vs-button>
                                            </template>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="groupFacturador && tr.contrato_generado !=null && tr.estado == 1 && (tr.tipo_venta == '1' || tr.tipo_venta == '2') && (tr.contadorAlcanceAbierto > 0 || tr.contadorAlcanceCerrado > 0)">
                                            <!--TRANSABILIDAD ALCANCE-->
                                            <vs-button class="w-full" color="dark" @click="f_setPedido(tr);pedido=tr;popupMostrarTransabilidadAlcance = true;" type="line">
                                                <ion-icon name="cellular-outline"></ion-icon> Trazabilidad Alcance
                                            </vs-button>
                                        </vs-dropdown-item>
                                        <!--IMRPIMIR CONVENIO (comentado - reemplazado por Gestión Convenio)-->
                                        <!-- <vs-dropdown-item v-if="tr.convenio_anios > 0 && tr.contrato_generado !=null && tr.estado == 1 && groupFacturador && tr.convenioAnulado == 0">
                                            <vs-button class="w-full" icon-pack="feather" icon="icon-printer" @click="pedido= tr;chooseBeneficiarioPedido(tr,3)" color="#3D21C6" type="line">Imprimir convenio</vs-button>
                                        </vs-dropdown-item> -->
                                        <!--GESTIÓN CONVENIO (abre popup directo con ScreenConvenio)-->
                                        <vs-dropdown-item>
                                            <vs-button class="w-full" icon-pack="feather" icon="icon-file-text" @click="f_setPedido(tr); pedido=tr; popupGestionConvenioScreen=true;" color="#3D21C6" type="line">Gestión Convenio</vs-button>
                                        </vs-dropdown-item>
                                        <!--IMPRIMIR PAGARE-->
                                        <!-- <vs-dropdown-item v-if="(tr.anticipo_aprobado > 0 || tr.convenio_anios > 0 ) && tr.contrato_generado !=null && tr.estado == 1">
                                            <vs-button class="w-full" icon-pack="feather" type="line" icon="icon-upload-cloud" @click="ifTipoPago=100;pedido=tr;getDatosPedido();getConvenioGlobal(tr);getAnticipoPedido(tr);chooseBeneficiarioPedido(tr,4)" color="#5BB9E5">Imprimir Pagaré</vs-button>
                                        </vs-dropdown-item> -->
                                        <!-- NUEVO BOTÓN IMPRIMIR PAGARÉ REDIRIGIDO A GESTIÓN PAGARÉ (MENU 14) -->
                                        <vs-dropdown-item v-if="(tr.anticipo_aprobado > 0 || tr.convenio_anios > 0 ) && tr.contrato_generado !=null && tr.estado == 1 && !userAsesor">
                                            <vs-button class="w-full" icon-pack="feather" type="line" icon="icon-file-text" @click="ver_pedido_emit(tr, 14)" color="#8e44ad">Gestión Pagaré</vs-button>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="tr.historicoEstado == 6 && tr.estado == 1 && groupFacturador">
                                            <!--MARCAR COMO RECIBIDO EL CHEQUE DE CONTABILIDAD-->
                                            <vs-button class="w-full" icon-pack="feather" icon="icon-credit-card" @click="pedido = tr;popupRecibiCheque = true" color="warning" type="line">Marcar como recibido cheque</vs-button>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="tr.historicoEstado == 7 && tr.estado == 1 && groupFacturador">
                                            <!--MARCAR CHEQUE COMO ENTREGADO AL ASESOR-->
                                            <vs-button class="w-full" icon-pack="feather" icon="icon-credit-card" @click="pedido = tr;popupEnviarCheque = true" color="dark" type="line">Entrega de cheque a asesor</vs-button>
                                        </vs-dropdown-item>
                                        <vs-dropdown-item v-if="tr.historicoEstado == 9 && tr.estado == 1 && groupFacturador">
                                            <!--MARCAR PAGARE COMO RECIBIDO POR EL ASESOR-->
                                            <vs-button class="w-full" icon-pack="feather" icon="icon-file" @click="mostrarDocumento=false;pedido = tr;popupRecibirPagare = true;" color="dark" type="line">Marcar pagaré recibido</vs-button>
                                        </vs-dropdown-item>

                                        <!--LIQUIDAR CONTRATO-->
                                        <vs-dropdown-item v-if="tr.estado_verificacion > 0 && groupFacturador">
                                            <vs-button icon-pack="feather" class="w-full" icon="icon-shopping-bag" @click="pedido = tr; openConfirmLiquidar(tr)" color="#500ED4" type="filled">Liquidar Contrato</vs-button>
                                        </vs-dropdown-item>
                                        <!--NOTIFICACION REVISACION-->
                                        <vs-dropdown-item v-if="userRoot || userAdminFacturador">
                                            <vs-button icon-pack="feather" v-if="tr.notificados == 0 && tr.contrato_generado == null" class="w-full text-normal" icon="icon-check" @click="pedido = tr; notificarPedido(1)" color="#C74BDE" type="line">Marcar como notificado</vs-button>
                                            <vs-button icon-pack="feather" v-if="tr.notificados == 1" class="w-full" icon="icon-check" @click="pedido = tr; notificarPedido(0)" color="#C74BDE" type="line">Quitar notificado</vs-button>
                                        </vs-dropdown-item>
                                    </div>
                                    <div v-if="userBodega || usuario.name_usuario == 'facturadorm'">
                                        <vs-dropdown-item>
                                            <vs-button icon-pack="feather" class="w-full" icon="icon-airplay" @click="pedido = tr;onlyVer = 1; popupEntregarPedido = true;" color="dark" type="line">Ver Detalle</vs-button>
                                        </vs-dropdown-item>
                                        <!-- <vs-dropdown-item v-if="tipoBodega == 2 && userBodega">
                                            <vs-button icon-pack="feather" class="w-full" icon="icon-activity" @click="pedido = tr;onlyVer = 0;popupEntregarPedido = true;" color="#7AD40E" type="line">Entregar pedido</vs-button>
                                        </vs-dropdown-item> -->
                                    </div>
                                    <!--ELIMINAR PEDIDO-->
                                    <vs-dropdown-item v-if="(tr.estado == 0 || tr.estado == 1) && (tr.contrato_generado == null) && (userRoot || userAsesor)">
                                        <vs-button color="danger" type="line" class="w-full" @click="pedido = tr;getEliminarPedido()">Eliminar pedido</vs-button>
                                    </vs-dropdown-item>
                                    <!--NOVEDADES-->
                                    <vs-dropdown-item>
                                        <vs-button color="primary" type="line" class="w-full" @click="pedido = tr;ver_pedido(tr,12)">Novedades</vs-button>
                                    </vs-dropdown-item>
                                    <!--PERMITIR EDITAR CONTRATO DESPUES DE PEDIDO-->
                                    <vs-dropdown-item v-if="(userRoot ||  userAdminFacturador) && tr.contrato_generado !=null && tr.estado == 1 && tr.verificaciones == 0">
                                        <vs-button color="#fc9994" type="line" class="w-full" @click="pedido = tr;popupPermitirEditarContrato=true;">Permitir Editar Pedido con Contrato</vs-button>
                                    </vs-dropdown-item>
                                    <!--CAMBIAR ESTADO PEDIDO ETIQUETA-->
                                    <vs-dropdown-item v-if="(userRoot || userAdminFacturador) && tr.contrato_generado !=null && tr.estado == 1">
                                        <vs-button color="#000" type="line" class="w-full" @click="pedido = tr; newEstadoPedidoEtiqueta = (tr.estadoPedido_Pagos != null) ? String(tr.estadoPedido_Pagos) : '0'; popupCambiarEstadoPedidoEtiqueta=true;">Cambiar estado pedido</vs-button>
                                    </vs-dropdown-item>
                                    <!--CAMBIAR ASESOR DEL PEDIDO / CONTRATO (solo root)-->
                                    <vs-dropdown-item v-if="userRoot">
                                        <vs-button color="warning" type="line" class="w-full" icon-pack="feather" icon="icon-user-check" @click="pedido = tr; asesorNuevoSelect = null; popupCambiarAsesor = true;">Cambiar asesor</vs-button>
                                    </vs-dropdown-item>

                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </vs-td>
                        <vs-td v-if="userRoot" align="center">
                            <vx-tooltip :text="tr.revision_pedido == 1 ? 'Quitar revisión del pedido' : 'Marcar pedido como revisado' " position="top" color="dark">
                                <vs-switch v-model="tr.revision_pedido" @input="confirmarVerificacion(tr)">
                                    <span slot="on">Revisado</span>
                                    <span slot="off">Sin revisar</span>
                                </vs-switch>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </div>
    <!--ESTADO PEDIDO-->
    <vs-popup class="holamundo2" @close="recargarPedidos();" :title="`Cambiar estado del pedido: ${sendPedido.id_pedido}`" :active.sync="popupEstadoPedido">
        <EstadoPagoVue :sendPedido="sendPedido" v-if="popupEstadoPedido" @change="changeHandleEstadoPedido" />
    </vs-popup>
    <!--DOWNLOAD DOCUMENTOS-->
    <vs-popup fullscreen v-if="mostrarReporte" title="Reporte Pedido" :active.sync="mostrarReporte">
        <exportPedidoVue :ObjectSelected="pedido" :id_beneficiario_pedido="id_beneficiario_pedido" :id_pedido="pedido.id_pedido" :id_periodo="pedido.id_periodo" @change="changeHandle" :nombre_periodo="nombre_periodo" />
    </vs-popup>
    <!--Export convenio-->
    <vs-popup fullscreen v-if="mostrarReporteConvenio" title="Reporte Convenio" :active.sync="mostrarReporteConvenio">
        <exportConvenioVue :empresaSelected="empresaSelected" :anioEmpieza="anioEmpieza" :aniosAnteriorSelect="aniosAnteriorSelect" :id_beneficiario_pedido="id_beneficiario_pedido" :id_pedido="pedido.id_pedido" :id_periodo="pedido.id_periodo" @change="changeHandle" />
    </vs-popup>
    <!--IMPRIMIR PAGARE-->
    <div v-if="mostrarPagareAsesor">
        <exportPagareVue style="display:none;" :ifTipoPago="Number(ifTipoPago)" :empresaSelected="empresaSelected" :aniosAnteriorSelect="aniosAnteriorSelect" :id_beneficiario_pedido="id_beneficiario_pedido" :id_pedido="pedido.id_pedido" :id_periodo="pedido.id_periodo" :contrato="contrato" @change="changeHandle" :pagoConvenio="pagoConvenio" :anticipoPedido="anticipoPedido" :convenioGlobal="convenioGlobal" :numeroPagare="numeroPagare" />
    </div>
    <!--FIN DOWNLOAD DOCUMENTOS-->
    <!--MODALES-->
    <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
        <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
        <img class="mt-2" style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png" />
    </vs-popup>
    <!--MODAL PARA SELECCIONAR UN BENEFICIARIO-->
    <!--MODAL PARA GENERAR CONTRATO MANUAL-->
    <vs-popup class="holamundo" fullscreen :title="'Colocar contrato al pedido #'+pedido.id_pedido" :active.sync="popupGenerarContratoManual">
        <generarContratoVue v-if="popupGenerarContratoManual" :pedido="pedido" @changeContratoManual="changeContratoManual" />
    </vs-popup>
    <!--ESCOGER BENEFICIARIOS-->
    <vs-prompt title="Seleccione un beneficiario para poder generar el reporte" @cancel="close" cancelText="Cancelar" acceptText="Generar" @accept="acceptAlert" @close="close" :active.sync="activePrompt">
        <div class="con-exemple-prompt">
            <p class="mt-2">Seleccione el Beneficiario</p>
            <v-select :options="arregloBeneficiarios" :reduce="arregloBeneficiarios => arregloBeneficiarios" label="beneficiarioComision" class="w-full" v-model="beneficiario" />
        </div>
        <!--TIPO 2 => Reporte contrato -->
        <div v-if="tipo == 3 || tipo == 4">
            <p class="mt-4">Seleccione la empresa por favor</p>
            <v-select :options="arrayEmpresas" :reduce="arrayEmpresas => arrayEmpresas" label="descripcion_corta" class="w-full" v-model="empresaSelected" />
        </div>
        <div v-if="tipo == 3">
            <p class="mt-4">Seleccione el año que comienza el convenio</p>
            <v-select :options="arregloAniosAnteriores" :reduce="arregloAniosAnteriores => arregloAniosAnteriores" class="w-full" v-model="anioEmpieza" @input="validateAniosAnterior" />
        </div>
        <div v-if="tipo == 4 || tipo == 3">
            <p class="mt-4">Seleccione el año final para calcular los dias</p>
            <v-select :options="arregloAniosAnteriores" :reduce="arregloAniosAnteriores => arregloAniosAnteriores" class="w-full" v-model="aniosAnteriorSelect" @input="validateAniosAnterior" />
        </div>
        <div v-if="tipo == 4" class="mt-5">
            <p>Seleccione el tipo de pagaré</p>
            <p>Obtener datos desde:</p>
            <ul class="flex mt-5" style="flex-wrap: wrap;">
                <li v-if="convenioGlobal.valor > 0" class="m-2">
                    <vs-radio v-model="ifTipoPago" vs-name="radios1" vs-value="0">Convenio Global: {{ convenioGlobal.valor}}</vs-radio>
                </li>
                <li v-if="pagoConvenio.valor > 0" class="m-2">
                    <vs-radio v-model="ifTipoPago" vs-name="radios1" vs-value="1">Pago de convenio año actual: {{ pagoConvenio.valor }} </vs-radio>
                </li>
                <li v-if="anticipoPedido.valor > 0" class="m-2">
                    <vs-radio v-model="ifTipoPago" vs-name="radios1" vs-value="2">Anticipo del pedido: {{ anticipoPedido.valor }} </vs-radio>
                </li>
            </ul>
            <p class="mt-4"><b>Número del Pagaré *</b></p>
            <vs-input
                v-model="numeroPagare"
                placeholder="Ej: 001-2026"
                class="w-full mt-2"
                icon-pack="feather"
                icon="icon-hash"
            />
            <small class="text-danger">* Campo obligatorio</small>
        </div>
    </vs-prompt>

    <!--MODAL PARA VER LA TRANSABILIDAD ALCANCE-->
    <vs-popup class="holamundo" title="Ver trazabilidad Alcance" :active.sync="popupMostrarTransabilidadAlcance">
        <div v-if="popupMostrarTransabilidadAlcance">
            <screenTransabilidaAlcanceVue :pedido="pedido" />
        </div>
    </vs-popup>
    <!--MODAL PARA MARCAR COMO RECIBIO EL CHEQUE-->
    <vs-popup class="holamundo" title="Marcar como recibi el cheque" :active.sync="popupRecibiCheque">
        <div v-if="popupRecibiCheque">
            <div class="flex" style="justify-content: center;">
                <img width="500" :src="$data_url+'archivos/pedidos/cheque/'+pedido.evidencia_cheque" />
            </div>
            <vs-button color="success" @click="changeEstadoHistorico(7)" class="mt-5" type="gradient">Recibi el cheque</vs-button>
        </div>
    </vs-popup>
    <!--MODAL PARA ENVIAR CHEQUE ASESOR-->
    <vs-popup class="holamundo" title="Cheque para el asesor" fullscreen :active.sync="popupEnviarCheque">
        <div v-if="popupEnviarCheque">
            <div class="flex" style="justify-content: center;">
                <image-zoom :regular="$data_url+'archivos/pedidos/cheque/'+pedido.evidencia_cheque" :zoom-amount="3" :click-zoom="true" click-message="De click para aumentar" img-class="img-fluid">
                </image-zoom>
                <img width="500" v-if="mostrarDocumento == false" :src="$data_url+'archivos/pedidos/cheque/'+pedido.evidencia_cheque" />
            </div>
            <div class="flex" style="justify-content: center;" v-if="mostrarDocumento == false">
                <vs-button color="success" @click="changeEstadoHistorico(8)" class="mt-5" type="gradient">Entregue cheque al asesor</vs-button>
            </div>
        </div>
    </vs-popup>
    <!--FIN MODAL PARA ENVIAR CHEQUE ASESOR-->
    <!--MODAL PARA MARCAR COMO RECIBIDO PAGARE-->
    <vs-popup class="holamundo" title="Pagaré subido por el asesor" :active.sync="popupRecibirPagare">
        <div v-if="popupRecibirPagare">
            <div class="flex" style="justify-content: center;">
                <img width="500" :src="$data_url+'archivos/pedidos/pagare/'+pedido.evidencia_pagare" />
            </div>
            <div class="flex" style="justify-content: center;" v-if="mostrarDocumento == false">
                <vs-button color="success" @click="changeEstadoHistorico(10)" class="mt-5" type="gradient">Recibi el pagaré fisico por parte del asesor</vs-button>
            </div>
        </div>
    </vs-popup>
    <!--MODAL PARA EXPORTAR A EXCEL-->
    <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="popupExport">
        <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
            <span>Recuerde <b>seleccionar</b> los registros que desea exportar.</span>
        </vs-alert>
        <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
    </vs-prompt>
    <!--MODAL PARA ENTREGAR PEDIDO (BODEGA)-->
    <vs-popup class="holamundo" fullscreen title="Detalle pedido" :active.sync="popupEntregarPedido">
        <pedidosDetalleVue :onlyVer="onlyVer" @changeRecarge="recargarPedidos()" v-if="popupEntregarPedido" :id_pedido="pedido.id_pedido" :id_periodo="pedido.id_periodo" :pedido="pedido" />
    </vs-popup>
    <!--MODAL PARA VER CODIGOS A LIQUIDAR-->
    <vs-popup class="holamundo" fullscreen title="Códigos a liquidar" :active.sync="popupVerLiquidacion">
        <div v-if="popupVerLiquidacion">
          <b>Institución:</b>
          <p>{{ pedido.nombreInstitucion }}</p>
          <b>Contrato:</b>
          <p>{{ pedido.contrato_generado }}</p>
          <br>
            <LiquidacionVentaDirectaVue :pedido="pedido" @ChangeRecarge="recargarPedidos" />
        </div>
    </vs-popup>
    <!--MODAL PARA CODIGOS A LIQUIDARSE-->
    <vs-popup fullscreen title="Codigos a liquidarse" :active.sync="popupCodigosLiquidarse">
        <LiquidacionCodigosVue v-if="popupCodigosLiquidarse" :contratoLiquidacion="pedido.contrato_generado" :estado_verificacion="pedido.estado_verificacion" :insNombre="pedido.nombreInstitucion" :ciuNombre="pedido.nombre_ciudad" @ChangeRegresar="recargarPedidos" />
    </vs-popup>
    <!--popup REPORTES PEDIDOS-->
    <vs-popup :title="'Reportes de pedidos del período '" fullscreen :active.sync="popupReportes">
        <PedidoScreenReportesVue v-if="popupReportes" :periodoSelect="periodoSelect" />
    </vs-popup>
    <!--POPUP MAS COMISION-->
    <vs-popup :title="'Solicitud de más comisión '" :active.sync="popupSolicitudComision">
        <div v-if="popupSolicitudComision">
            <ScreenComisionVue :pedido="Object(pedido)" :tipo="0" @ChangeRegresar="recargarPedidos" />
        </div>
    </vs-popup>
    <!-- Liquidaciones -->
    <vs-popup :title="'Liquidaciones Venta Lista'" fullscreen :active.sync="popupLiquidaciones">
        <!-- Totales con diseño lineal y responsivo -->
        <div class="w-full">
            <ul class="list-disc pl-5 flex flex-wrap justify-center items-center mt-5">
                <li v-for="(item, index) in totalItems" :key="index" class="total-item my-2 mr-4">
                    <span>{{ item.concept }}: <b>{{ item.amount | filtrarDecimal }}</b> </span>
                </li>
            </ul>
        </div>
        <!-- Filtro por Asesor -->
        <div class="flex justify-center items-center my-2">
            Filtrar por asesor: <br>
            <v-select :options="asesores" @input="filterByAsesor();" :reduce="asesores => asesores.id_asesor" label="vendedor" class="w-1/2" v-model="selectedAsesor" @change="filterByAsesor" />
        </div>

        <!-- Tabla de Liquidaciones -->
        <vs-table max-items="10" pagination search :data="filteredLiquidaciones">
            <template slot="header">
                <vs-chip color="primary">Cantidad: <b>{{ filteredLiquidaciones.length }}</b></vs-chip>
                <vs-button color="success" class="mb-2 p-3 ml-3" @click="ExportarLiquidaciones"><i class="fa-solid fa-download"></i> Exportar</vs-button>
            </template>

            <template slot="thead">
                <vs-th width="250">Información</vs-th>
                <!-- <vs-th width="150">ID Pedido</vs-th>
          <vs-th width="250">Contrato Generado</vs-th>
          <vs-th>Institución</vs-th> -->
                <vs-th width="200">Vendedor</vs-th>
                <vs-th>Estado</vs-th>
                <vs-th>Venta Bruta</vs-th>
                <vs-th>Descuento</vs-th>
                <vs-th>Comison</vs-th>
                <vs-th>Venta Neta</vs-th>
                <vs-th sort-key="valor_deudaAnterior">Deuda Anterior</vs-th>
                <vs-th sort-key="valor_convenio">Convenio</vs-th>
                <vs-th sort-key="valor_anticipos">Anticipos</vs-th>
                <vs-th sort-key="valor_liquidacion">Liquidaciones</vs-th>
                <vs-th>Pagos</vs-th>
                <vs-th>Saldo Pendiente</vs-th>
            </template>

            <template slot-scope="{ data }">
                <vs-tr :key="indextr" v-for="(item, indextr) in data">
                    <vs-td>
                        <b># Pedido: </b><br>{{ item.id_pedido }}<br>
                        <b>Contrato:</b><br> {{ item.contrato_generado }}<br>
                        <b>Institución:</b><br>{{ item.nombreInstitucion }}
                    </vs-td>
                    <vs-td>{{ item.vendedor }}</vs-td>
                    <vs-td><b :style="item.verificaciones == 0 ? 'color:red;' : 'color:Black;'">{{ item.verificaciones == 0 ? 'SIN LIQUIDAR' : 'LIQUIDADO' }}</b></vs-td>
                    <vs-td>{{ getVenta(item) }}</vs-td>
                    <vs-td>{{ item.descuento }} %</vs-td>
                    <vs-td>{{ getDescuento(item) }}</vs-td>
                    <vs-td>{{ getVentaNeta(item) }} </vs-td>
                    <vs-td>{{ getDeudaAnterior(item) }}</vs-td>
                    <vs-td>{{ getConvenio(item) }}</vs-td>
                    <vs-td>{{ getAnticipo(item) }}</vs-td>
                    <vs-td>{{ getLiquidaciones(item) }}</vs-td>
                    <vs-td>{{ getAnticiposConvenio(item) }}</vs-td>
                    <vs-td>{{ getSaldoPendiente(item) }}</vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vs-popup>
    <!-- SECCION ELIMINAR PEDIDO -->
    <vs-popup class="informacionformhijo" title="Eliminar pedido" :active.sync="popupEliminarPedido">
        <EliminarPedido v-if="popupEliminarPedido" :pedido="pedido" @change="changeHandleEliminarPedido" />
    </vs-popup>
    <!--MODAL ACTUALIZAR PAGOS-->
    <div v-if="updatePagos">
        <PagosGuardarVue :ObjectSelected="pedido" @f_terminarActualizacionPagos="f_terminarActualizacionPagos" />
    </div>
    <!--MODAL LOADING-->
    <vs-popup :title="'Cargando....'" :active.sync="updatePagos">
        <div v-if="updatePagos">
            <Loading1Vue :title="'Espere mientras se actualiza los valores.......'" />
        </div>
    </vs-popup>
    <!--MODAL PARA PERMITIR EDITAR CONTRATO-->
    <vs-popup class="holamundo" title="Permitir editar contrato" :active.sync="popupPermitirEditarContrato">
        <div v-if="popupPermitirEditarContrato">
            <PedidosPermitirEditarContratoVue :pedido="pedido" @ChangeRecarge="recargarPedidos" />
        </div>
    </vs-popup>
    <!--MODA PARA IMPRIMIR DOCUMENTO-->
    <vs-popup class="holamundo" fullscreen title="Reporte de contrato" :active.sync="popupMostrarDocumento">
        <div v-if="popupMostrarDocumento">
            <exportContratoVue :tipoFile="tipoFile" :beneficiario="beneficiario" :id_periodo="pedido.id_periodo" :id_beneficiario_pedido="id_beneficiario_pedido" :contrato="contrato" @change="changeHandle" />
        </div>
    </vs-popup>
    <vs-popup class="holamundo" title="Cambiar estado del pedido" :active.sync="popupCambiarEstadoPedidoEtiqueta">
        <div v-if="popupCambiarEstadoPedidoEtiqueta">
          <p class="text-center mb-3">Seleccione el tipo de estado del contrato</p>
          <p class="text-center mb-3" v-if="pedido.estadoPedido_Pagos">
            <vs-chip color="warning">Estado actual:
              <b v-if="pedido.estadoPedido_Pagos == 1">Pagado</b>
              <b v-else-if="pedido.estadoPedido_Pagos == 2">Pendiente</b>
              <b v-else-if="pedido.estadoPedido_Pagos == 3">Deuda</b>
              <b v-else-if="pedido.estadoPedido_Pagos == 4">Liquidado sin códigos</b>
              <b v-else>Ninguno</b>
            </vs-chip>
          </p>
            <ul class="flex flex-wrap justify-center">
                <li class="m-2">
                    <vs-radio v-model="newEstadoPedidoEtiqueta" vs-name="radios1" vs-value="0">Ninguno</vs-radio>
                </li>
                <li class="m-2">
                    <vs-radio v-model="newEstadoPedidoEtiqueta" vs-name="radios1" vs-value="1">Pagado</vs-radio>
                </li>
                <li class="m-2">
                    <vs-radio v-model="newEstadoPedidoEtiqueta" vs-name="radios1" vs-value="2">Pendiente</vs-radio>
                </li>
                <li class="m-2">
                    <vs-radio v-model="newEstadoPedidoEtiqueta" vs-name="radios1" vs-value="3">Deuda</vs-radio>
                </li>
                <li class="m-2">
                    <vs-radio v-model="newEstadoPedidoEtiqueta" vs-name="radios1" vs-value="4">Liquidado sin códigos</vs-radio>
                </li>
            </ul>
        </div>
        <div class="flex" style="justify-content: center;" v-if="popupCambiarEstadoPedidoEtiqueta">
            <vs-button color="success" @click="changeEstadoPedidoEtiqueta()" class="mt-5" type="gradient">Cambiar estado del pedido</vs-button>
        </div>
    </vs-popup>

    <!--POPUP CAMBIAR ASESOR DEL PEDIDO / CONTRATO (solo root)-->
    <vs-popup class="holamundo" :title="'Cambiar asesor del pedido #'+pedido.id_pedido" :active.sync="popupCambiarAsesor">
        <div v-if="popupCambiarAsesor">
            <vs-alert color="primary" icon-pack="feather" icon="icon-info" class="mb-4" active="true">
                El código del contrato <b>no cambia</b>: conserva las iniciales y la secuencia del asesor con el que se generó.
                Solo se reasigna el asesor del pedido.
            </vs-alert>

            <div class="vx-row">
                <div class="vx-col w-full md:w-1/2 mb-4">
                    <p class="mb-1"><b>Contrato:</b></p>
                    <p>{{ pedido.contrato_generado ? pedido.contrato_generado : 'Sin contrato generado' }}</p>
                </div>
                <div class="vx-col w-full md:w-1/2 mb-4">
                    <p class="mb-1"><b>Asesor actual:</b></p>
                    <p>{{ pedido.asesor }}</p>
                </div>
            </div>

            <div class="vx-row">
                <div class="vx-col w-full mb-4">
                    <p class="mb-1"><b>Nuevo asesor:</b></p>
                    <v-select
                        :options="arrayAsesores"
                        :reduce="arrayAsesores => arrayAsesores.id_asesor"
                        label="asesor"
                        class="w-full"
                        placeholder="Seleccione el asesor"
                        v-model="asesorNuevoSelect"
                    />
                </div>
            </div>

            <div class="flex" style="justify-content: center;">
                <vs-button color="danger" type="border" class="mt-2 mr-3" @click="popupCambiarAsesor = false">Cancelar</vs-button>
                <vs-button color="success" type="gradient" class="mt-2" :disabled="!asesorNuevoSelect" @click="cambiarAsesorPedido()">Cambiar asesor</vs-button>
            </div>
        </div>
    </vs-popup>

    <!--POPUP CONFIRMACION DE VERIFICACION-->
    <vs-popup class="popup-verificacion" title="Confirmación de Revision" :active.sync="popupConfirmarVerificacion">
        <div v-if="popupConfirmarVerificacion" style="padding: 20px;">

            <!-- Header simple -->
            <div style="text-align: center; margin-bottom: 25px; border-bottom: 1px solid #eee; padding-bottom: 15px;">
                <h4 style="margin: 0; color: #2c3e50; font-weight: 600;">
                    Pedido #{{ pedidoVerificar ? pedidoVerificar.id_pedido : '' }}
                </h4>
                <p style="margin: 8px 0 0 0; color: #7f8c8d; font-size: 14px;">
                    {{ nuevoEstadoRevision ? 'Marcar como revisado' : 'Quitar revisión' }}
                </p>
            </div>

            <!-- Contenido para verificar -->
            <div v-if="nuevoEstadoRevision">
                <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
                    <p style="margin: 0; color: #495057; font-size: 14px;">
                        ¿Confirma que desea marcar este pedido como revisado?
                    </p>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #2c3e50; font-size: 14px;">
                        Observación de revisión *
                    </label>
                    <vs-textarea
                        v-model="observacionVerificacion"
                        placeholder="Escriba la observación de revisión..."
                        rows="4"
                        style="width: 100%;"
                    />
                </div>
            </div>

            <!-- Contenido para quitar verificación -->
            <div v-else>
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
                    <h5 style="margin: 0 0 10px 0; color: #856404; font-size: 15px; font-weight: 600;">
                        ¿Está seguro de quitar la revisión?
                    </h5>
                    <p style="margin: 0 0 10px 0; color: #856404; font-size: 14px;">
                        Esta acción eliminará:
                    </p>
                    <ul style="margin: 0; padding-left: 20px; color: #856404; font-size: 14px;">
                        <li>El estado de revisión del pedido</li>
                        <li>La observación guardada anteriormente</li>
                    </ul>
                </div>

                <!-- Mostrar observación actual -->
                <div v-if="pedidoVerificar && pedidoVerificar.revision_observacion" style="margin-bottom: 20px;">
                    <label style="display: block; font-weight: 500; margin-bottom: 8px; color: #2c3e50; font-size: 14px;">
                        Observación actual que se eliminará:
                    </label>
                    <div style="background: #f8f9fa; border: 1px solid #dee2e6; border-radius: 6px; padding: 12px;">
                        <p style="margin: 0; color: #6c757d; font-style: italic; font-size: 14px;">
                            "{{ pedidoVerificar.revision_observacion }}"
                        </p>
                    </div>
                </div>
            </div>

            <!-- Botones -->
            <div style="display: flex; gap: 12px; justify-content: center; margin-top: 25px; border-top: 1px solid #eee; padding-top: 20px;">
                <vs-button
                    :color="nuevoEstadoRevision ? 'success' : 'danger'"
                    @click="procesarVerificacion()"
                    type="filled">
                    {{ nuevoEstadoRevision ? 'Revisar Pedido' : 'Quitar Revisión' }}
                </vs-button>
                <vs-button
                    color="dark"
                    @click="cancelarVerificacion()"
                    type="line">
                    Cancelar
                </vs-button>
            </div>
        </div>
    </vs-popup>
    <!--VISTA DE MODULO DE PAGOS (SIN POPUP)-->
    <div v-if="menu == 1 && mostrarTipoModulo == 1" class="modulo-pagos-container">
      <div class="mb-4 flex justify-center">
        <vs-button color="primary" icon-pack="feather" icon="icon-arrow-left" @click="regresarAPedidos()">
          Regresar a Pedidos
        </vs-button>
      </div>
      <div class="mb-3">
        <p><b>Escuela:</b> {{ pedido.nombreInstitucion }}</p>
        <p><b>Contrato:</b> {{ pedido.contrato_generado || 'S/N' }}</p>
      </div>
      <ScreenPagos2Vue />
    </div>
    <!--POPUP GESTIÓN CONVENIO DIRECTO-->
    <vs-popup fullscreen title="Gestión Convenio" :active.sync="popupGestionConvenioScreen" @close="recargarPedidos()" class="informacionformhijo">
      <ScreenConvenioVue v-if="popupGestionConvenioScreen" />
    </vs-popup>
</div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select'
const exportContratoVue = () => import('../temporadas/components/exportContrato.vue')
const exportPedidoVue = () => import('../temporadas/components/exportContrato2.vue')
const exportConvenioVue = () => import('../temporadas/components/exportConvenio.vue')
const screenTransabilidaAlcanceVue = () => import('@/views/pedidos/transabilidad/screenTransabilidaAlcance')
const exportPagareVue = () => import('../temporadas/components/exportPagare.vue')
const generarContratoVue = () => import('./components/milton/generarContrato.vue')
const pedidosDetalleVue = () => import('../temporadas/components/pedidosDetalle.vue')
const LiquidacionVentaDirectaVue = () => import('./asesor/contratos/LiquidacionVentaDirecta.vue')
const LiquidacionCodigosVue = () => import('./asesor/contratos/LiquidacionCodigos.vue')
const PedidoScreenReportesVue = () => import('../pedidos2/pedidos/reportes/PedidoScreenReportes.vue');
const ScreenComisionVue = () => import('@/views/pedidos2/pedidos/comision/ScreenComision.vue')
const EstadoPagoVue = () => import('@/views/pedidos2/pedidos/anticipos/pagos2/Pagos2Estado.vue')
const EliminarPedido = () => import('@/views/pedidos/components/eliminar_pedido.vue')
const PagosGuardarVue = () => import('../pedidos2/pedidos/anticipos/pagos2/PagosGuardar.vue')
const Loading1Vue = () => import('../configuracion/Reutilizable/Loading1.vue')
const PedidosPermitirEditarContratoVue = () => import('../pedidos2/pedidos/configuracion/PedidosPermitirEditarContrato.vue')
import PedidosRepository from '../../repositories/PedidosRepository';
const ScreenPagos2Vue = () => import('../pedidos2/pedidos/anticipos/pagos2/ScreenPagos2.vue');
const ScreenConvenioVue   = () => import('@/views/temporadas/components/Pedidos/Configuracion/Convenios/ScreenConvenio.vue');
import moment from "moment";
import imageZoom from 'vue-image-zoomer';
import Codigosmix from "@/mixins/Codigosmix";
export default {
    components: {
        vSelect,
        screenTransabilidaAlcanceVue,
        exportContratoVue,
        exportPedidoVue,
        exportConvenioVue,
        exportPagareVue,
        imageZoom,
        generarContratoVue,
        flatPickr,
        pedidosDetalleVue,
        LiquidacionVentaDirectaVue,
        LiquidacionCodigosVue,
        PedidoScreenReportesVue,
        ScreenComisionVue,
        EstadoPagoVue,
        EliminarPedido,
        PagosGuardarVue,
        Loading1Vue,
        PedidosPermitirEditarContratoVue,
        ScreenPagos2Vue,
        ScreenConvenioVue,
    },
    mixins: [Codigosmix],
    data() {
        return {
            menuNovedad: 0,
            usuario: [],
            datosBusquedaCobro: [],
            resultadosBusqueda: [],
            totalAbonoGlobal: 0,
            // pedidos:[],
            tmpPedidos: [],
            zonas: [],
            zonaselect: '',
            arregloBeneficiarios: [],
            pedido: {},
            contrato: '',
            filtro: 10000,
            id_periodo: 0,
            popupEstadoPedido: false,
            popupMostrarTransabilidad: false,
            popupMostrarTransabilidadAlcance: false,
            popupMostrarPedido: false,
            //variables modales files export
            mostrarReporte: false,
            popupCarga: false,
            mostrarReporteC: false,
            mostrarReporteConvenio: false,
            mostrarPagareAsesor: false,
            activePrompt: false,
            //variables modales filex export
            //files de beneficiarios
            id_beneficiario_pedido: '',
            beneficiario: '',
            tipo: '',
            //fin files de beneficiarios
            userFacturador: false,
            userAdminFacturador: false,
            userBodega: false,
            tipoFile: 0,
            //variables historico
            popupRecibiCheque: false,
            popupEnviarCheque: false,
            popupRecibirPagare: false,
            mostrarDocumento: false,
            //fin variables historico
            popupGenerarContratoManual: false,
            activeMenu: true,
            //variables para verificaciones
            menu: 1,
            //fin variables para verificaciones
            //variables para exportar
            fileName: null,
            popupExport: false,
            popupGestionConvenioScreen: false,
            codigoSelected: [],
            reportesActivo: 0,
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xlsx',
            tipoExportacion: 0,
            //fin variables para exportar excel
            //variables para filtrar fechas
            fechaSelect: null,
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            flatpickrOptions: {
                locale: 'es',
                // Otras opciones de configuración...
            },
            //tipoFecha => 0 = fecha envio; 1 = fecha entrega
            tipoFecha: 0,
            titleFecha: 'Fecha envio',
            //fin variables para filtrar fechas
            //variables para anios anteriores
            arregloAniosAnteriores: [],
            aniosAnteriorSelect: '',
            anioEmpieza: '',
            //fin variables para anios anteriores
            //variables bodega//
            tipoBodega: 2,
            popupEntregarPedido: false,
            //fin variables bodega
            menuTab: 0,
            //variables para solicitar verificacion
            popupVerLiquidacion: false,
            popupCodigosLiquidarse: false,
            //fin variables para solicitar verificacion
            //Apis para empresas
            arrayEmpresas: [],
            empresaSelected: '',
            //fin Apis para empresas
            totalRealContratos: 0,
            totalValorPedidosContratos: 0,
            totalValorPedidosContratosD: 0,
            totalValorPedidosContratosL: 0,
            popupReportes: false,
            arrayAsesores: [],
            asesorSelect: '',
            popupSolicitudComision: false,
            cantidadCodigosLiquidados: 0,
            backgroundLoading: '#fff',
            sendPedido: {
                id_pedido: ''
            },
            ifTipoPago: 0,
            pagoConvenio: {
                valor: 0,
                estado: 0
            },
            anticipoPedido: {
                valor: 0,
                estado: 0
            },
            convenioGlobal: {
                valor: 0,
                estado: 0
            },
            numeroPagare: '', // Nuevo campo para el número del pagaré
            liquidaciones: [], // Datos originales de las liquidaciones
            selectedAsesor: null, // Asesor seleccionado para filtrar
            filteredLiquidaciones: [], // Lista filtrada por asesor
            asesores: [], // Lista de asesores extraída de las liquidaciones
            popupLiquidaciones: false,
            popupEliminarPedido: false,
            totalVDirectaReal: 0,
            totalDevDirectaReal: 0,
            //variables para actualizar pagos
            updatePagos: false,
            //fin variables para actualizar pagos
            popupPermitirEditarContrato: false,
            popupMostrarDocumento: false,
            newEstadoPedidoEtiqueta: '0',
            popupCambiarEstadoPedidoEtiqueta: false,
            //cambiar asesor del pedido/contrato (solo root)
            popupCambiarAsesor: false,
            asesorNuevoSelect: null,
            //Variables para confirmación de verificación
            popupConfirmarVerificacion: false,
            pedidoVerificar: null,
            observacionVerificacion: '',
            estadoOriginalVerificacion: null,
            //Fin variables para confirmación de verificación
            popupPagos: false,
            //Variable para cambiar entre vista de pedidos y pagos
            mostrarTipoModulo: 0, // 0 = pedidos, 1 = pagos
            contratoUltimoVisto: '', // Guardar el último contrato visto en pagos
            contratoResaltado: '', // Para resaltar temporalmente el contrato
            // Variables para historial de estados
            mostrarTooltipHistorial: false,
            pedidoHistorialActual: null,
            historialEstados: [],
            cargandoHistorial: false,
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        console.log("periodoSelect", me.periodoSelect)
        me.id_periodo = me.periodoSelect.idperiodoescolar
        me.nombre_periodo = me.periodoSelect.periodoescolar
    },
    mounted() {
        let me = this;
        // me.getzonas();
        me.generateHistorico()
        me.getAniosAnteriores()
        me.anioEmpieza = moment().format('YYYY')
        //user permisos
        if (me.usuario.id_group == 22) me.userFacturador = true
        if (me.usuario.id_group == 23) me.userAdminFacturador = true
        if (me.usuario.id_group == 27) me.userBodega = true
        if (me.usuario.id_group != 11) {
            me.getAsesores()
        }
        //menu
        else {
            let menuSelect = localStorage.menuSelect
            if (menuSelect) {
                me.filtro = menuSelect
                setTimeout(function () {
                    me.filtroTipo()
                }, 1000);
            } else {
                setTimeout(function () {
                    me.filtroTipo()
                }, 1000);
            }
        }
        if (me.userAsesor) {
            me.getTotalVentaRealContratos()
        }
        localStorage.removeItem("menuNovedad");
        //remover
        const seccionImprimir = document.getElementById('seccionImprimir2');
        if (seccionImprimir) {
            seccionImprimir2.remove(); // Eliminar el elemento completamente
            seccionImprimir.innerHTML = ''; // Limpiar el contenido
        }
    },
    props: {
        periodoSelect: {
            type: Object,
            default: {},
        },
        pedidos: {
            type: Array,
            default: []
        },
        userAsesor: {
            type: Boolean,
            default: false,
        },
        userRoot: {
            type: Boolean,
            default: false,
        },
        groupFacturador: {
            type: Boolean,
            default: false,
        },
        userContabilidad: {
            type: Boolean,
            default: false,
        },
    },
    watch: {
        periodoSelect(results) {
            let me = this;
            me.id_periodo = me.periodoSelect.idperiodoescolar
            me.nombre_periodo = me.periodoSelect.periodoescolar
            me.asesorSelect = ""
            me.codigoSelected = []
            me.getTotalVentaRealContratos()
        },
        pedidos(results) {
            let me = this;
            me.tmpPedidos = []
            if (me.userBodega) {
                // me.filtroBodega()
            } else {
                me.filtroTipo()
            }
        },
    },
    computed: {
        sumaTotal() {
            let me = this;
            let total = me.pedidos.length
            return total
        },
        SumaSinAnticipo() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado == 1 || p.estado == 0) && ((p.contrato_generado == null || p.contrato_generado == "")) && (p.ifanticipo == 0));
            let resultado = datos.length
            return resultado
        },
        SumaConAnticipoSinAprobar() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado == 1 || p.estado == 0) && ((p.contrato_generado == null || p.contrato_generado == "")) && (p.ifanticipo == 1) && ((p.ifagregado_anticipo_aprobado == 0)));
            let resultado = datos.length
            return resultado
        },
        SumaConAnticipoAprobados() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado == 1) && ((p.contrato_generado == null || p.contrato_generado == "")) && p.ifagregado_anticipo_aprobado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaAnulados() {
            let me = this
            let datos = me.pedidos.filter(p => p.estado == 2);
            let resultado = datos.length
            return resultado
        },
        //CHEQUES
        SumaEntregaCheques() {
            let me = this
            let datos = me.pedidos.filter(p => p.estado == 1 && (p.historicoEstado == 6 || p.historicoEstado == 7));
            let resultado = datos.length
            return resultado
        },
        SumaSolicitudesPagares() {
            let me = this
            let datos = me.pedidos.filter(p => p.estado == 1 && (p.historicoEstado == 9));
            let resultado = datos.length
            return resultado
        },
        SumaPagareFisicosEntregados() {
            let me = this
            let datos = me.pedidos.filter(p => p.estado == 1 && (p.historicoEstado == 10 || p.historicoEstado == 11));
            let resultado = datos.length
            return resultado
        },
        //FIN CHEQUES
        //GERENCIA
        SumaSolicitudAnticipos() {
            let me = this
            let datos = me.pedidos.filter(p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 2));
            let resultado = datos.length
            return resultado
        },
        SumaAnticiposGerenciaAprobados() {
            let me = this
            let datos = me.pedidos.filter(p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 3));
            let resultado = datos.length
            return resultado
        },
        SumaAnticiposGerenciaAnulados() {
            let me = this
            let datos = me.pedidos.filter(p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 4));
            let resultado = datos.length
            return resultado
        },
        //FIN GERENCIA
        SumaContratoSinAnticipo() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado == 1) && ((p.contrato_generado != null)) && (p.ifanticipo == 0 || p.ifanticipo == null));
            let resultado = datos.length
            return resultado
        },
        SumaContratosConAnticipoAprobados() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado == 1) && ((p.contrato_generado != null)) && p.ifanticipo == 1);
            let resultado = datos.length
            return resultado
        },
        //===TOTAL PENDIENTES=========
        SumaTotalPendientes() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado == 1) && ((p.contrato_generado == null || p.contrato_generado == "")) && (p.ifanticipo == 1 || p.ifanticipo == 0) && ((p.ifagregado_anticipo_aprobado == 0)));
            let resultado = datos.length
            return resultado
        },
        //===FIN TOTAL PENDIENTES=====
        //===TOTAL GERENCIA=========
        SumaTotalGerencia() {
            let me = this;
            let datos = me.pedidos.filter(p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 2 || p.ifagregado_anticipo_aprobado == 3 || p.ifagregado_anticipo_aprobado == 4));
            let resultado = datos.length
            return resultado
        },
        //===FIN TOTAL GERENCIA=====
        //===TOTAL CONTRATOS========
        SumaTotalContratos() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado == 1) && ((p.contrato_generado != null)) && (p.ifanticipo == 1 || p.ifanticipo == 0 || p.ifanticipo == null));
            let resultado = datos.length
            return resultado
        },
        //===FIN TOTAL CONTRATOS====
        //===TOTAL CHEQUES==========
        SumaTotalCheques() {
            let me = this;
            let datos = me.pedidos.filter(p => p.estado == 1 && (p.historicoEstado == 6 || p.historicoEstado == 7 || p.historicoEstado == 9 || p.historicoEstado == 10 || p.historicoEstado == 11));
            let resultado = datos.length
            return resultado
        },
        //===FIN TOTAL CHEQUES======
        //===ALCANCE================
        //ALCANCES PENDIENTES
        SumaAlcancePendientes() {
            let me = this;
            let datos = me.pedidos.filter(p => p.estado == 1 && (p.contadorAlcanceAbierto > 0));
            let resultado = datos.length
            return resultado
        },
        //ALCANCE CERRADOS O APROBADOS
        SumaAlcanceCerrados() {
            let me = this;
            let datos = me.pedidos.filter(p => p.estado == 1 && (p.contadorAlcanceCerrado > 0));
            let resultado = datos.length
            return resultado
        },
        //===FIN ALCANCE============
        //===TIPOS DE VENTA=========
        //venta directa
        SumaVentaDirecta() {
            let me = this;
            let datos = me.pedidos.filter(p => p.tipo_venta == 1 && p.estado == 1 && ((p.contrato_generado != null)));
            let resultado = datos.length
            return resultado
        },
        SumaVentaLista() {
            let me = this;
            let datos = me.pedidos.filter(p => p.tipo_venta == 2 && p.estado == 1 && ((p.contrato_generado != null)));
            let resultado = datos.length
            return resultado
        },
        //COMISION
        sumaSolicitudComision() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado == 1 || p.estado == 0) && ((p.solicitud_gerencia_estado == 1)));
            let resultado = datos.length
            return resultado
        },
        sumaConvenio() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado == 1 || p.estado == 0) && ((p.convenio_anios > 0)));
            let resultado = datos.length
            return resultado
        },
        sumaComisionAprobado() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado == 1 || p.estado == 0) && (p.id_grupo_finaliza == 25 || p.id_grupo_finaliza == 23 || p.id_grupo_finaliza == 1));
            let resultado = datos.length
            return resultado
        },
        //FIN COMISION

        SumaPedidosLibrosHijosDocentesAprobados() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado_librosObsequios == 5) && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaPedidosLibrosHijosDocentesPendientes() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.estado_librosObsequios == 3 || p.estado_librosObsequios == 4) && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaPagoConveniosPendientes() {
            let me = this;
            let datos = me.pedidos.filter(p => p.contadorPendientesConvenio > 0 && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaConveniosPendientes(){
            let me = this;
            let datos = me.pedidos.filter(p => p.contadorConvenioPendientes > 0 && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaConvenioSolicitadoGerencia(){
            let me = this;
            let datos = me.pedidos.filter(p => p.contadorConvenioSolicitadoGerencia > 0 && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        //conveniosFinalizados
        SumaConveniosFinalizados(){
          let me = this
          let datos = me.pedidos.filter(p => p.convenioFinalizados > 0 && p.estado == 1);
          let resultado = datos.length
          return resultado
        },
        SumaConveniosAprobados(){
            let me = this;
            let datos = me.pedidos.filter(p => (p.contadorConvenioAprobadoGerencia > 0 || p.contadorConvenioAprobadoFacturador > 0) && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaConveniosCerrados(){
            let me = this;
            let datos = me.pedidos.filter(p => p.convenioAnulado > 0 && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaConveniosRechazados(){
            let me = this;
            let datos = me.pedidos.filter(p => p.convenioRechazado > 0 && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaPagoAnticiposPendientes() {
            let me = this;
            let datos = me.pedidos.filter(p => p.contadorPendientesAnticipos > 0 && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaPagaresSinEvidencia() {
            let me = this;
            let datos = me.pedidos.filter(p => p.count_pagares_sin_evidencia > 0 && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaPagaresConEvidencia() {
            let me = this;
            let datos = me.pedidos.filter(p => p.count_pagares_con_evidencia > 0 && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaPagaresAnulados() {
            let me = this;
            let datos = me.pedidos.filter(p => p.count_pagares_anulados > 0 && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaPagaresTotal() {
            let me = this;
            let datos = me.pedidos.filter(p => (p.count_pagares_sin_evidencia > 0 || p.count_pagares_con_evidencia > 0 || p.count_pagares_anulados > 0) && p.estado == 1);
            let resultado = datos.length
            return resultado
        },

        SumaPedidosLibrosObsequiosTodos() {
            let me = this;
            let datos = me.pedidos.filter(p => p.estado_librosObsequios && p.estado == 1);
            let resultado = datos.length
            return resultado
        },
        SumaPedidosLibrosObsequios() {
            let me = this;
            let datos = me.pedidos.filter(p => p.estado == 1 && (p.contadorObsequiosAbiertosEnviados > 0));
            let resultado = datos.length
            return resultado
        },
        //========================FIN FILTROS PARA BODEGA========================
        totalVenta() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getVenta(item));
            }, 0).toFixed(2);
        },

        totalVentaDescuento() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getDescuento(item));
            }, 0).toFixed(2);
        },

        totalAnticiposConvenio() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getAnticiposConvenio(item)) || 0;
            }, 0).toFixed(2);
        },

        totalSaldoPendiente() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getSaldoPendiente(item));
            }, 0).toFixed(2);
        },
        totalConvenio() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getConvenio(item));
            }, 0).toFixed(2);
        },
        totalAnticipos() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getAnticipo(item));
            }, 0).toFixed(2);
        },
        totalLiquidaciones() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getLiquidaciones(item));
            }, 0).toFixed(2);
        },
        totalVentaNeta() {
            return this.filteredLiquidaciones.reduce((total, item) => {
                return total + parseFloat(this.getVentaNeta(item));
            }, 0).toFixed(2);
        },
        totalItems() {
            return [{
                    concept: "Total Venta Bruta",
                    amount: this.totalVenta * 1
                },
                {
                    concept: "Total Comisiones",
                    amount: this.totalVentaDescuento * 1
                },
                {
                    concept: "Total Venta Neta",
                    amount: this.totalVentaNeta * 1
                },
                {
                    concept: "Total Convenios",
                    amount: this.totalConvenio * 1
                },
                {
                    concept: "Total Anticipos",
                    amount: this.totalAnticipos * 1
                },
                {
                    concept: "Total Liquidaciones",
                    amount: this.totalLiquidaciones * 1
                },
                {
                    concept: "Total Pagos",
                    amount: this.totalAnticiposConvenio * 1
                },
                {
                    concept: "Saldo Pendiente",
                    amount: this.totalSaldoPendiente * 1
                }
            ];
        },
    },
    methods: {
        validateAniosAnterior() {
            // console.log(this.aniosAnteriorSelect,"vlorrrrrrrrr");
            if (this.aniosAnteriorSelect < this.anioEmpieza) {
                // Mostrar notificación de error
                this.$vs.notify({
                    text: 'El año final debe ser mayor al de comienzo.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x',
                    time: '5000'
                });
                // Resetear el valor de aniosAnteriorSelect
                this.aniosAnteriorSelect = null;
            }
        },
        getAniosAnteriores() {
            let me = this;
            me.arregloAniosAnteriores = []
            // Obtener la fecha actual
            var fechaActual = new Date();
            // Obtener el año actual
            var añoActual = fechaActual.getFullYear();
            // Array para almacenar los últimos 5 años anteriores
            var ultimosCincoAñosAnteriores = [];
            // Array para almacenar los próximos 10 años
            var proximosCincoAños = [];
            // Calcular los últimos 5 años anteriores
            for (var i = 1; i <= 10; i++) {
                ultimosCincoAñosAnteriores.push(añoActual - i);
            }
            // Calcular los próximos 15 años
            for (var i = 0; i <= 10; i++) {
                proximosCincoAños.push(añoActual + i);
            }
            var todosLosAños = [...ultimosCincoAñosAnteriores, ...proximosCincoAños]
            // Ordenar el array en orden ascendente
            todosLosAños.sort(function (a, b) {
                return a - b;
            });
            // Imprimir los próximos 5 años
            me.arregloAniosAnteriores = todosLosAños
        },
        changeContratoManual(e) {
            let me = this
            me.popupGenerarContratoManual = false;
            me.$emit('changeRecarge', true)
            // me.getPedidos()
        },
        generateHistorico() {
            let me = this;
            this.$http.get(this.$server_url + 'pedidosConAnticipo')
                .then(res => {})
        },
        filtroTipo() {
            let me = this;
            me.estadoMenu()
            me.tmpPedidos = []
            me.tmparregloFiltroFecha = []
            me.fechaSelect = ""
            //para ver todos
            if (me.filtro == 10000) {
                let total = me.pedidos
                me.tmpPedidos = total
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //para ver los pedidos sin anticipo
            if (me.filtro == 1) {
                let datos = me.pedidos.filter(p => (p.estado == 1 || p.estado == 0) && ((p.contrato_generado == null || p.contrato_generado == "")) && (p.ifanticipo == 0));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //para ver los pedidos con anticipo(sin aprobar)
            if (me.filtro == 2) {
                let datos = me.pedidos.filter(p => (p.estado == 1 || p.estado == 0) && ((p.contrato_generado == null || p.contrato_generado == "")) && (p.ifanticipo == 1) && ((p.ifagregado_anticipo_aprobado == 0)));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //======Todos pendientes==========
            if (me.filtro == 13) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && ((p.contrato_generado == null || p.contrato_generado == "")) && (p.ifanticipo == 1 || p.ifanticipo == 0) && ((p.ifagregado_anticipo_aprobado == 0)));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //======Fin todos pendientes======
            //para ver los pedidos con anticipo(aprobados)
            if (me.filtro == 3) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && ((p.contrato_generado == null || p.contrato_generado == "")) && p.ifagregado_anticipo_aprobado == 1);
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //para ver los solicitudes de anticipos a gerencia
            if (me.filtro == 4) {
                let datos = me.pedidos.filter(p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 2));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //para ver los anticipos solicitados al gerente aprobados
            if (me.filtro == 5) {
                let datos = me.pedidos.filter(p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 3));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //para ver los anticipos solicitados al gerente anulados
            if (me.filtro == 6) {
                let datos = me.pedidos.filter(p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 4));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //para ver los contratos con anticipos
            if (me.filtro == 7) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && ((p.contrato_generado != null)) && p.ifanticipo == 1);
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //para ver los contratos sin anticipos
            if (me.filtro == 8) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && ((p.contrato_generado != null)) && (p.ifanticipo == 0 || p.ifanticipo == null));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //para ver las entregas para el asesor(cheques generados)
            if (me.filtro == 9) {
                let datos = me.pedidos.filter(p => p.estado == 1 && (p.historicoEstado == 6 || p.historicoEstado == 7));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //para ver las posibles entregas de pagares
            if (me.filtro == 10) {
                let datos = me.pedidos.filter(p => p.estado == 1 && (p.historicoEstado == 9));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //para ver los pagares entregados fisicos
            if (me.filtro == 11) {
                let datos = me.pedidos.filter(p => p.estado == 1 && (p.historicoEstado == 10 || p.historicoEstado == 11));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //===TOTAL GERENCIA======
            if (me.filtro == 14) {
                let datos = me.pedidos.filter(p => p.estado == 1 && (p.contrato_generado == null || p.contrato_generado == "") && (p.ifagregado_anticipo_aprobado == 2 || p.ifagregado_anticipo_aprobado == 3 || p.ifagregado_anticipo_aprobado == 4));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //===TOTAL CONTRATOS=====
            if (me.filtro == 15) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && ((p.contrato_generado != null)));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //==FIN TOTAL CONTRATOS===
            //===TOTAL CHEQUES========
            if (me.filtro == 16) {
                let datos = me.pedidos.filter(p => p.estado == 1 && (p.historicoEstado == 6 || p.historicoEstado == 7 || p.historicoEstado == 9 || p.historicoEstado == 10 || p.historicoEstado == 11));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //===ALCANCE=============
            //Alcance pendientes
            if (me.filtro == 17) {
                let datos = me.pedidos.filter(p => p.estado == 1 && (p.contadorAlcanceAbierto > 0));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //Alcance cerrado
            if (me.filtro == 18) {
                let datos = me.pedidos.filter(p => p.estado == 1 && (p.contadorAlcanceCerrado > 0));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //===FIN ALCACANCE=======
            //para ver los pedidos anulados
            if (me.filtro == 19) {
                let datos = me.pedidos.filter(p => p.estado == 2);
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //TIPO VENTA=============
            //Venta directa
            if (me.filtro == 20) {
                let datos = me.pedidos.filter(p => p.tipo_venta == 1 && p.estado == 1 && ((p.contrato_generado != null)));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //Venta Lista
            if (me.filtro == 21) {
                let datos = me.pedidos.filter(p => p.tipo_venta == 2 && p.estado == 1 && ((p.contrato_generado != null)));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            // LIBROS HIJOS DOCENTES
            // PEDIDO LIBROS  HIJOS DOCENTES PENDIENTE
            if (me.filtro == 22 || me.filtro == 25) {
                let datos = me.pedidos.filter(p => p.estado_librosObsequios && p.estado == 1 && p.contadorHijosDocentesAbiertosEnviados > 0);
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            // PEDIDO LIBROS HIJOS DOCENTES APROBADOS
            if (me.filtro == 24) {
                let datos = me.pedidos.filter(p => p.estado_librosObsequios);
                me.tmpPedidos = datos;
                me.tmparregloFiltroFecha = me.tmpPedidos;
                return
            }
            if (me.filtro == 25 || me.filtro == 22) {
                let datos = me.pedidos.filter(p => p.estado_librosObsequios && p.estado == 1 && p.contadorObsequiosAbiertosEnviados > 0);
                me.tmpPedidos = datos;
                me.tmparregloFiltroFecha = me.tmpPedidos;
                return
            }
            //CIERRE DE PAGOS
            if (me.filtro == 30) {
                let datos = me.pedidos.filter(p => p.estado == 1 && p.contadorPendientesConvenio > 0);
                me.tmpPedidos = datos;
                me.tmparregloFiltroFecha = me.tmpPedidos;
                return
            }
            if (me.filtro == 31) {
                let datos = me.pedidos.filter(p => p.estado == 1 && p.contadorPendientesAnticipos > 0);
                me.tmpPedidos = datos;
                me.tmparregloFiltroFecha = me.tmpPedidos;
                return
            }
            //PAGARES
            if (me.filtro == 50) {
                let datos = me.pedidos.filter(p => p.count_pagares_sin_evidencia > 0 && p.estado == 1);
                me.tmpPedidos = datos;
                me.tmparregloFiltroFecha = me.tmpPedidos;
                return
            }
            if (me.filtro == 51) {
                let datos = me.pedidos.filter(p => p.count_pagares_con_evidencia > 0 && p.estado == 1);
                me.tmpPedidos = datos;
                me.tmparregloFiltroFecha = me.tmpPedidos;
                return
            }
            if (me.filtro == 52) {
                let datos = me.pedidos.filter(p => p.count_pagares_anulados > 0 && p.estado == 1);
                me.tmpPedidos = datos;
                me.tmparregloFiltroFecha = me.tmpPedidos;
                return
            }
            if (me.filtro == 53) {
                let datos = me.pedidos.filter(p => (p.count_pagares_sin_evidencia > 0 || p.count_pagares_con_evidencia > 0 || p.count_pagares_anulados > 0) && p.estado == 1);
                me.tmpPedidos = datos;
                me.tmparregloFiltroFecha = me.tmpPedidos;
                return
            }
            //===COMISION=============
            //Solicitud de comision
            if (me.filtro == 1000) {
                let datos = me.pedidos.filter(p => (p.estado == 1 || p.estado == 0) && ((p.solicitud_gerencia_estado == 1)));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //Comision aprobada
            if (me.filtro == 1001) {
                let datos = me.pedidos.filter(p => (p.estado == 1 || p.estado == 0) && (p.id_grupo_finaliza));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }

            //Convenio
            if (me.filtro == 1002) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && (p.convenio_anios > 0));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }

            // Convenios pendientes
            if (me.filtro == 1003) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && (p.contadorConvenioPendientes > 0));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            // Convenios solicitados por gerencia
            if (me.filtro == 1004) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && (p.contadorConvenioSolicitadoGerencia > 0));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            // Convenios aprobados por gerencia o facturador
            if (me.filtro == 1006) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && (p.contadorConvenioAprobadoGerencia > 0 || p.contadorConvenioAprobadoFacturador > 0));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            // Convenios cerrrados
            if (me.filtro == 1007) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && (p.convenioAnulado > 0));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            // Convenios rechazados
            if (me.filtro == 1008) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && (p.convenioRechazado > 0));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            // Convenios finalizados
            if (me.filtro == 1009) {
                let datos = me.pedidos.filter(p => (p.estado == 1) && (p.convenioFinalizados > 0));
                me.tmpPedidos = datos
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
            //==FIN TOTAL CHEQUES
            else {
                let total = me.pedidos
                me.tmpPedidos = total
                me.tmparregloFiltroFecha = me.tmpPedidos
                return
            }
        },

        estadoMenu() {
            let me = this;
            localStorage.setItem('menuSelect', me.filtro)
            var divs = document.querySelectorAll(".submenutitle");
            for (var i = 0; i < divs.length; i++) {
                divs[i].classList.remove("active");
            }
            const container = document.querySelector(".menu" + me.filtro);
            // Validar que el elemento exista antes de acceder a classList
            if (container) {
                container.classList.add("active");
            }
        },
        getzonas() {
            this.$http.get(this.$server_url + 'GetZona_todo')
                .then(res => {
                    this.zonas = res.data;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        ver_pedido(item, menuNovedad = 0) {
            let me = this;
            this.$http.get(`${this.$server_url}pedidos/${item.id_pedido}`)
                .then((res) => {
                    if (res.data.length == 0) {
                        me.$vs.notify({
                            text: 'No se encontró el pedido',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        return;
                    }
                    console.log("datos", res.data[0]);
                    me.$store.dispatch('setPedido', res.data[0]);
                    localStorage.setItem("id_periodo_selected", me.id_periodo);
                    localStorage.setItem("nombre_periodo_selected", me.nombre_periodo);
                    localStorage.setItem("contrato_generado", item.contrato_generado);
                    localStorage.setItem("pedido_desde_admin", 'activo');
                    localStorage.setItem("menuNovedad", menuNovedad);
                    me.$emit('showPedido', 1);
                })
                .catch((error) => {
                    console.error("Error al obtener los datos:", error);
                });
        },
        // Versión rápida: usa los datos del tr ya cargados en la tabla (sin llamada HTTP).
        // Ideal para botones donde no se necesita refrescar el pedido antes de navegar.
        ver_pedido_emit(item, menuNovedad = 0) {
            let me = this;
            me.$store.dispatch('setPedido', item);
            localStorage.setItem("id_periodo_selected", me.id_periodo);
            localStorage.setItem("nombre_periodo_selected", me.nombre_periodo);
            localStorage.setItem("contrato_generado", item.contrato_generado);
            localStorage.setItem("pedido_desde_admin", 'activo');
            localStorage.setItem("menuNovedad", menuNovedad);
            me.$emit('showPedido', 1);
        },
        ver_pagos(item){
          let me = this;
          this.$http.get(`${this.$server_url}pedidos/${item.id_pedido}`)
          .then((res) => {
            if (res.data.length == 0) {
              me.$vs.notify({
                  text: 'No se encontró el pedido',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle'
              });
              return;
            }
            me.pedido = res.data[0];
            me.pedido.id_periodo = item.id_periodo;
            me.pedido.nombreInstitucion = item.nombreInstitucion;
            me.pedido.nombre_ciudad = item.nombre_ciudad;
            me.pedido.nombre_zona = item.nombre_zona;
            me.pedido.nombre_provincia = item.nombre_provincia;
            me.pedido.asesor = item.asesor;
            me.pedido.nombre_periodo = item.nombre_periodo;
            me.pedido.anticipo_porcentaje = item.anticipo_porcentaje;
            me.pedido.fecha_envio = item.fecha_envio;
            me.pedido.estadoPedido_Pagos = item.estadoPedido_Pagos;
            me.$store.dispatch('setPedido', me.pedido);
            localStorage.setItem("id_periodo_selected", me.id_periodo);
            localStorage.setItem("nombre_periodo_selected", me.nombre_periodo);
            localStorage.setItem("contrato_generado", item.contrato_generado);
            localStorage.setItem("pedido_desde_admin", 'activo');
            // Guardar el contrato para buscarlo al regresar
            me.contratoUltimoVisto = item.contrato_generado || '';
            me.mostrarTipoModulo = 1; // Cambiar a vista de pagos
          })
          .catch((error) => {
              console.error("Error al obtener los datos:", error);
          });
        },
        regresarAPedidos(){
          let me = this;
          me.mostrarTipoModulo = 0; // Volver a vista de pedidos

          // Esperar a que se renderice completamente la vista de pedidos
          me.$nextTick(() => {
            me.filtroTipo(); // Recargar los pedidos después de que el DOM esté listo

            // Esperar a que se renderice la tabla
            setTimeout(() => {
              console.log('Contrato a buscar:', me.contratoUltimoVisto);
              console.log('Ref tabla:', me.$refs.tablaPedidos);

              if (me.$refs.tablaPedidos) {
                // Método 1: Asignar al componente
                me.$refs.tablaPedidos.search = me.contratoUltimoVisto;
                console.log('Search asignado:', me.$refs.tablaPedidos.search);

                // Método 2: Forzar actualización del componente
                me.$refs.tablaPedidos.$forceUpdate();

                // Método 3: Acceder directamente al input del DOM
                setTimeout(() => {
                  const searchInput = document.querySelector('.vs-table--search input');
                  if (searchInput) {
                    searchInput.value = me.contratoUltimoVisto;
                    // Disparar evento input para que Vue detecte el cambio
                    searchInput.dispatchEvent(new Event('input', { bubbles: true }));
                  }

                  // Hacer scroll hacia la tabla
                  const tablaElement = document.querySelector('.vs-table');
                  if (tablaElement) {
                    tablaElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }, 100);

                // Resaltar temporalmente el contrato
                me.contratoResaltado = me.contratoUltimoVisto;

                // Quitar el resaltado después de 3 segundos
                setTimeout(() => {
                  me.contratoResaltado = '';
                }, 3000);
              } else {
                console.log('No se encontró la referencia a tablaPedidos');
              }
            }, 300);
          });
        },
        SolicitarVerificacion(tr) {
            let me = this;
            if (tr.id_pedido == null || tr.id_pedido == "") {
                me.$vs.notify({
                    text: 'Su contrato no tiene pedido en plataforma',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return
            }
            me.popupVerLiquidacion = true;
        },
        f_setPedido(tr){
          let me = this
          me.$store.dispatch('setPedido', tr);
        },
        anular_pedido(item) {
            let me = this
            me.id_pedido = item.id_pedido
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar este pedido?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.confirm_anular_pedido
            })
        },
        confirm_anular_pedido(item) {
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url + 'anular_pedido_asesor/' + me.id_pedido + '/' + me.usuario.idusuario + '/' + me.pedido.contrato_generado)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    me.$vs.notify({
                        text: 'Se anulo correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$emit('changeRecarge', true)
                    // me.getPedidos()
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'No se pudo guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close();
                })
        },
        changeEstadoHistorico(estado) {
            let me = this
            let formData = new FormData();
            formData.append('id_pedido', me.pedido.id_pedido);
            formData.append('estado', estado);
            if (estado == 7) formData.append('campo', 'fecha_facturador_recibe_cheque')
            if (estado == 8) formData.append('campo', 'fecha_envio_cheque_for_asesor')
            if (estado == 10) formData.append('campo', 'fecha_que_recibe_orden_firmada')
            me.$vs.loading();
            this.$http.post(this.$server_url + 'cambiarEstadoHistorico', formData)
                .then(function (res) {
                    me.$vs.loading.close();
                    me.$emit('changeRecarge', true)
                    // me.getPedidos()
                    me.pedido = {}
                    me.popupEnviarCheque = false
                    me.popupRecibirPagare = false
                    me.popupRecibiCheque = false
                    me.$vs.notify({
                        text: 'Se registro correctamente',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                })
        },
        //====METODOS PARA EMITIR LOS ARHIVOS
        changeHandle(e) {
            let me = this;
            me.mostrarReporte = false
            me.popupCarga = false
            me.mostrarReporteC = false
            me.mostrarReporteConvenio = false
            me.mostrarPagareAsesor = false
        },
        acceptAlert() {
            let me = this
            if (me.beneficiario == "" || me.beneficiario == null || me.beneficiario == undefined) {
                me.$vs.notify({
                    text: 'Seleccione un beneficiario por favor',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                me.activePrompt = true
                return
            }
            //si es export pagare obligo a pedir un año
            if (me.tipo == 4 || me.tipo == 3) {
                if (me.aniosAnteriorSelect == null || me.aniosAnteriorSelect == "" || me.aniosAnteriorSelect == undefined) {
                    me.$vs.notify({
                        text: 'Seleccione un año final a calcular por favor',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.activePrompt = true
                    return
                }
                //EMPRESA
                if (me.empresaSelected == "" || me.empresaSelected == null || me.empresaSelected == undefined) {
                    me.$vs.notify({
                        text: 'Seleccione una empresa por favor',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.activePrompt = true
                    return
                }
            }
            //si tipo 4
            if (me.tipo == 4) {
                //Validar que el número de pagaré no esté vacío
                if (!me.numeroPagare || me.numeroPagare.trim() === '') {
                    me.$vs.notify({
                        text: 'Debe ingresar el número del pagaré',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time: 4000
                    })
                    me.activePrompt = true
                    return
                }
                //si el ifTipoPago a 100 debe seleccionar un tipo de pagare
                if (this.ifTipoPago == 100) {
                    me.$vs.notify({
                        text: 'Debe seleccionar un tipo de pagare',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time: 4000
                    })
                    me.activePrompt = true
                    return
                }
                if (this.ifTipoPago == 0) {
                    //el convenioGlobal.valor debe ser mayor a cero
                    if (me.convenioGlobal.valor == 0) {
                        me.$vs.notify({
                            text: 'El convenio global no tiene valor',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 4000
                        })
                        me.activePrompt = true
                        return
                    }
                } else if (this.ifTipoPago == 1) {
                    //el pagoConvenio.estado tiene cero es pendiente
                    // if(me.pagoConvenio.estado == 0){
                    //   me.$vs.notify({
                    //     text:'El pago de convenio del convenio del año se encuentra pendiente por cerrar',
                    //     color:'warning',
                    //     iconPack: 'feather',
                    //     icon:'icon-check',
                    //     time:4000
                    //   })
                    //   me.activePrompt = true
                    //   return
                    // }
                } else if (this.ifTipoPago == 2) {
                    //el anticipoPedido.valor tiene cero es pendiente
                    // if(me.anticipoPedido.estado == 0){
                    //   me.$vs.notify({
                    //     text:'El anticipo del pedido se encuentra pendiente por cerrar',
                    //     color:'warning',
                    //     iconPack: 'feather',
                    //     icon:'icon-check',
                    //     time:4000
                    //   })
                    //   me.activePrompt = true
                    //   return
                    // }
                }
            }
            //si es convenio obligatorio seleccionar el año que empieza el convenio
            if (me.tipo == 3) {
                if (me.anioEmpieza == null || me.anioEmpieza == "" || me.anioEmpieza == undefined) {
                    me.$vs.notify({
                        text: 'Seleccione el año que comienza el convenio por favor',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.activePrompt = true
                    return
                }
            }
            me.id_beneficiario_pedido = me.beneficiario.id_beneficiario_pedido
            if (me.tipo == 1 || me.tipo == 3) {
                if (me.tipo == 1) me.mostrarReporte = true
                if (me.tipo == 3) me.mostrarReporteConvenio = true
            } else if (me.tipo != 1 || me.tipo != 3) {
                // me.popupCarga                              = true
                // if(me.tipo == 2) me.mostrarReporteC        = true
                if (me.tipo == 2) me.popupMostrarDocumento = true
                if (me.tipo == 4) me.mostrarPagareAsesor = true
            }
        },
        chooseBeneficiarioPedido(tr, tipo) {
            let me = this;
            me.getBeneficiarios(tr.id_pedido)
            me.getEmpresas()
            me.tipo = tipo
            me.contrato = tr.contrato_generado
            me.activePrompt = true
        },
        getDatosPedido() {
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url + `getConvenio?pedido=${me.pedido.id_pedido}`)
                .then(res => {
                    me.$vs.loading.close();
                    let datos = res.data
                    if (datos.length > 0) {
                        me.pagoConvenio.valor = datos[0].doc_valor
                        me.pagoConvenio.estado = datos[0].estado
                    } else {
                        me.pagoConvenio.valor = 0
                        me.pagoConvenio.estado = 0
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        getConvenioGlobal() {
            let me = this
            this.$http.get(this.$server_url + `getConvenioGlobalActivo?institucion=${me.pedido.id_institucion}`)
                .then(res => {
                    let datos = res.data
                    if (datos.length > 0) {
                        me.convenioGlobal.valor = datos[0].anticipo_global
                        me.convenioGlobal.estado = 1
                    } else {
                        me.convenioGlobal.valor = 0
                        me.convenioGlobal.estado = 1
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        getAnticipoPedido() {
            let me = this
            me.$vs.loading();
            this.$http.get(this.$server_url + `getAnticipoPedido?pedido=${me.pedido.id_pedido}`)
                .then(res => {
                    me.$vs.loading.close();
                    let datos = res.data
                    if (datos.length > 0) {
                        me.anticipoPedido.valor = datos[0].doc_valor
                        me.anticipoPedido.estado = datos[0].estado
                    } else {
                        me.anticipoPedido.valor = 0
                        me.anticipoPedido.estado = 0
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        generarReportePdfContrato(tr, tipo) {
            let me = this;
            if (tr.contrato_generado == "null" || tr.contrato_generado == null || tr.contrato_generado == "" || tr.contrato_generado == undefined) {
                me.$vs.notify({
                    text: "No se puede visualizar el reporte del contrato porque no tiene código de contrato",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 7000
                })
                return
            }
            me.getBeneficiarios(tr.id_pedido)
            me.tipo = tipo
            me.activePrompt = true
            me.contrato = tr.contrato_generado
        },
        getBeneficiarios(pedido) {
            let me = this
            me.arregloBeneficiarios = []
            me.beneficiario = ''
            this.$http.get(this.$server_url + 'get_beneficiarios_pedidos/' + pedido)
                .then(res => {
                    me.arregloBeneficiarios = res.data
                })
        },
        getEmpresas() {
            let me = this
            me.arrayEmpresas = []
            me.empresaSelected = ''
            this.$http.get(this.$server_url + 'empresa/')
                .then(res => {
                    me.arrayEmpresas = res.data
                })
        },
        close() {
            this.numeroPagare = '' // Limpiar el número del pagaré
            this.$vs.notify({
                color: 'danger',
                title: 'Mensaje',
                text: 'Has cancelado la generación del reporte!'
            })
        },
        //====FIN METODOS PARA EMITIR ARCHIVOS
        //metodos para alcance
        verAlcance(tr) {
            let me = this;
            //limpiar setAlcance para que no se duplique
            this.$store.dispatch('setPedido', {})
            this.$store.dispatch('setPedido', tr)
            me.$emit('showPedido', 2)
        },
        ver_obsequios(tr) {
            let me = this;
            //limpiar setAlcance para que no se duplique
            this.$store.dispatch('setPedido', {})
            this.$store.dispatch('setPedido', tr)
            me.$emit('showPedido', 3)
        },
        //metodos para librosObsequios
        verlibrosObsequios(tr) {
            let me = this;
            this.$store.dispatch('setPedido', tr)
            me.$emit('showPedido', 3)
        },
        //====METODOS PARA VERIFICACIONES========
        VerVerificaciones(tr) {
            let me = this
            if (tr.id_pedido == null || tr.id_pedido == "") {
                me.$vs.notify({
                    text: 'Su contrato no tiene pedido en plataforma',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return
            }
            me.menu = 2
        },
        openConfirmLiquidar() {
            let me = this
            me.cantidadCodigosLiquidados = 0
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                acceptText: 'Si, deseo realizar la liquidación',
                text: `Estás seguro de liquidar el contrato ${ me.pedido.contrato_generado }?`,
                accept: this.LiquidarContrato
            })
        },
        LiquidarContrato(valor = 0) {
            let me = this;
            if (valor == 0) {
                this.$vs.loading({
                    type: 'sound', // Tipo de loader
                    text: `Estamos liquidando los códigos, por favor espera puede tardar algunos minutos...`, // Texto personalizado con salto de línea
                    background: this.backgroundLoading, // Color de fondo personalizado
                    color: 'rgb(228, 238, 225)' // Color del texto
                });
            } else {
                me.cantidadCodigosLiquidados = me.cantidadCodigosLiquidados + valor
                this.$vs.loading({
                    type: 'sound', // Puedes elegir otros tipos según la documentación
                    text: `Se han liquidado ${this.cantidadCodigosLiquidados} códigos, Por favor espere un momento hasta finalizar el proceso...`, // Texto personalizado con salto de línea
                    background: this.backgroundLoading,
                    color: 'rgb(255, 255, 255)'
                });
            }
            this.$http.get(this.$server_url + 'liquidarFacturacionVersion2/' + me.pedido.contrato_generado + '/' + me.usuario.idusuario)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == '0') {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time:8000
                        })
                        return
                    }
                   if (res.data.consultarGuardado.flat().length > 0) {
                      me.$vs.notify({
                        text: 'Existen combos en otras escuelas en su liquidación',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check',
                        time: 8000
                      });
                    }
                    if (res.data.status == 2) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.f_actualizarValoresReporte()
                        return
                    } else {
                        me.verEstadoLiquidacion(res.data)
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        f_actualizarValoresReporte() {
            let me = this
            me.updatePagos = true;
        },
        f_terminarActualizacionPagos() {
            let me = this
            me.updatePagos = false;
            me.$emit('changeRecarge', true)
        },
        verEstadoLiquidacion(data) {
            let me = this
            let faltante = data.faltante
            let liquidado = data.guardados
            //si faltante es mayor a cero ejecuto la api liquidarContrato de nuevo
            if (faltante > 0) {
                me.LiquidarContrato(liquidado)
            } else {
                me.$emit('changeRecarge',true)
                me.$vs.notify({
                    text: 'Se realizo la liquidación correctamsente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                this.f_actualizarValoresReporte()
            }
        },
        /**
         * Calcula el total de la venta real de contratos.
         *
         * @returns {void}
         */
        getTotalVentaRealContratos() {
            let me = this;
            me.datosBusquedaCobro = [];
            me.resultadosBusqueda = [];

            if (me.usuario.id_group == 11) {
                me.totalRealContratos = 0;
                me.totalValorPedidosContratos = 0;
                me.totalValorPedidosContratosD = 0;
                me.totalValorPedidosContratosL = 0;

                me.$http.get(this.$server_url + `pedigo_Pagos?getVentaRealXAsesor=1&idAsesor=${me.usuario.idusuario}&idPeriodo=${me.id_periodo}`)
                    .then((res) => {
                        let datos = res.data;
                        let datosDirecta = datos.filter(p => p.tipo_venta == 1);

                        if (datos.length > 0) {
                            datos.forEach(element => {
                                me.totalRealContratos += element.TotalVentaReal;
                                me.totalValorPedidosContratos += element.pedido_alcance_hijos_d_obseq;

                                switch (element.tipo_venta) {
                                    case 1:
                                        me.totalValorPedidosContratosD += element.pedido_alcance_hijos_d_obseq;
                                        break;
                                    case 2:
                                        me.totalValorPedidosContratosL += element.pedido_alcance_hijos_d_obseq;
                                        break;
                                }
                            });
                        }

                        if (datosDirecta.length > 0) {
                            datosDirecta.forEach(element => {
                                me.datosBusquedaCobro.push({
                                    institucion: element.id_institucion,
                                    periodo: element.id_periodo
                                });
                            });
                        }

                        me.totalAbonoGlobal = 0;
                        me.totalVDirectaReal = 0;
                        me.totalDevDirectaReal = 0;

                        // Peticiones múltiples
                        let requests1 = me.datosBusquedaCobro.map(cobro => {
                            return me.$http.get(this.$server_url + "getSalesAndPayments?institucion=" + cobro.institucion + "&periodo=" + cobro.periodo)
                                .then((response) => {
                                    me.totalAbonoGlobal += response.data.total_abono;
                                    me.resultadosBusqueda.push(response.data);
                                }).catch((error) => {
                                    console.error("Error en la consulta de ventas y pagos (requests1):", error);
                                });
                        });

                        // Solo una petición con el primer elemento
                        let requests2 = [];
                        if (me.datosBusquedaCobro.length > 0) {
                            let cobro = me.datosBusquedaCobro[0];
                            requests2.push(
                                me.$http.get(this.$server_url + "getSalesAndPayments?AsesorPedidos=yes&institucion=" + cobro.institucion + "&periodo=" + cobro.periodo + '&asesor=' + me.usuario.idusuario)
                                .then((response) => {
                                    let datos = response.data.data;

                                    me.totalVDirectaReal = datos.reduce((acc, item) => acc + item.ValorVentaDirecta, 0);
                                    me.totalDevDirectaReal = datos.reduce((acc, item) => acc + item.TotalDevoluciones, 0);

                                    me.resultadosBusqueda.push(response.data);
                                }).catch((error) => {
                                    console.error("Error en la consulta de ventas y pagos (requests2):", error);
                                })
                            );
                        }

                        // Ejecutar todas las peticiones en paralelo
                        Promise.all([
                            Promise.all(requests1),
                            Promise.all(requests2)
                        ]).then(() => {
                            console.log("Todas las consultas finalizaron.");
                            console.log("Total Abono Global:", me.totalAbonoGlobal);
                            console.log("Total Venta Directa Real:", me.totalVDirectaReal);
                            console.log("Total Devoluciones Directas:", me.totalDevDirectaReal);
                        });

                    })
                    .catch((error) => {
                        console.error("Error en la consulta inicial:", error);
                    });
            }
        },
        //====FIN METODOS PARA VERIFICACIONES====
        //====METODOS PARA EXCEL=====
        //para limipiar los campos del excel
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        //metodo par descargar el excel
        exportToExcel() {
            let me = this
            let predatos = []
            predatos = me.codigoSelected.filter(p => p.estado != 2)
            //aumentar una propiedad llamada comisionAsesor en el array de predatos con un map
            predatos.map(function (item) {
                let ven_neta = 0
                let comisionAsesor = 0
                let TotalVentaReal = 0
                let valorDescuento = 0
                //deuda si deuda_anterior_estado es 1 la deuda saldra 0
                if (item.deuda_anterior_estado == 1) {
                    item.deuda = 0
                }
                //venta real
                if (item.TotalVentaReal == null || item.TotalVentaReal == "") {
                    TotalVentaReal = 0;
                } else {
                    TotalVentaReal = item.TotalVentaReal.toFixed(2);
                }
                //valorDescuento
                if (item.valorDescuento == null || item.valorDescuento == "") {
                    valorDescuento = 0;
                } else {
                    valorDescuento = item.valorDescuento.toFixed(2);
                }
                if (item.ven_neta == null || item.ven_neta == "") {
                    //ven_neta
                    ven_neta = 0;
                    comisionAsesor = 0;
                } else {
                    //ven_neta
                    ven_neta = item.ven_neta.toFixed(2);
                    comisionAsesor = (item.ven_neta * 0.02).toFixed(2);
                }

                item.comisionAsesor = comisionAsesor * 1
                item.TotalVentaReal = TotalVentaReal * 1
                item.valorDescuento = valorDescuento * 1
                item.ven_neta       = ven_neta * 1
                item.pedido_bruto = item.pedido_bruto ? (item.pedido_bruto * 1).toFixed(2) * 1 : 0
                item.estado_liquidacion = item.estado_liquidacion || 'SIN LIQUIDAR'
            })
            //array final
            let headerTitle = [];
            let headerVal = [];
            //para exportar los pedidos
            if (me.tipoExportacion == 0) {
                headerTitle = [
                    'Contrato',
                    'Tipo de venta',
                    'Asesor',
                    'Cédula asesor',
                    'Institución',
                    'Ciudad',
                    // 'Fecha envio',
                    // 'Fecha entrega',
                    'Total unidades',
                    'Venta bruta',
                    'Venta Real',
                    'Comisión',
                    'Anticipo aprobado',
                    // 'Estado'
                ];
                headerVal = [
                    'contrato_generado',
                    'tipo_venta_descr',
                    'responsable',
                    'cedula',
                    'nombreInstitucion',
                    'nombre_ciudad',
                    // 'fecha_envio',
                    // 'fecha_entrega',
                    'total_unidades',
                    'total_venta',
                    'TotalVentaReal',
                    'descuento',
                    'anticipo_aprobado',
                    // 'estadoPedido'
                ];
            }
            //para exportar el reporte de venta
            if (me.tipoExportacion == 1) {
                headerTitle = [
                    'CONTRATO',
                    'ASESOR',
                    'TIPO DE VENTA',
                    'CATEGORIA',
                    'ESTABLECIMIENTO',
                    'DEUDA ANTERIOR',
                    'DEUDA PRÓXIMA',
                    'PEDIDO BRUTO',
                    'VENTAS BRUTAS',
                    'COMISIÓN',
                    'VALOR DE ESCUELA',
                    'VENTAS NETAS',
                    'COMISION ASESOR 2%',
                    'CIUDAD',
                    'PERÍODO',
                    'PROVINCIA',
                    'PARROQUIA',
                    'FECHA FUNDACIÓN',
                    'DIRECCIÓN',
                    'TELÉFONO',
                    'ESTADO LIQUIDACION',
                ];
                headerVal = [
                    'contrato_generado',
                    'responsable',
                    'tipo_venta_descr',
                    'tipo_descripcion',
                    'nombreInstitucion',
                    'deuda',
                    'totalDeudaProxima',
                    'pedido_bruto',
                    'TotalVentaReal',
                    'descuento',
                    'valorDescuento',
                    'ven_neta',
                    'comisionAsesor',
                    'nombre_ciudad',
                    'periodo',
                    'nombreprovincia',
                    'parr_nombre',
                    'fecha_fundacion',
                    'direccionInstitucion',
                    'telefonoInstitucion',
                    'estado_liquidacion'
                ];
            }
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
        //==FIN METODOS PARA EXPORTAR EXCEL=====
        //metodo para exportar los registros de liquidaciones
        // Calcula la venta total
        getVenta(item) {
            // Verifica si 'verificaciones' es mayor a 0
            if (item.verificaciones > 0) {
                return item.TotalVentaReal.toFixed(2); // Si está liquidado, devuelve el valor real
            } else {
                // Si no está liquidado, suma 'total_venta' y los alcances (si existen)
                const ventaTotal = item.total_venta + (item.alcances ? item.alcances * 1 : 0);
                return ventaTotal.toFixed(2); // Devuelve el total con 2 decimales
            }
        },
        // Calcula la venta con el descuento aplicado
        getVentaDescuento(item) {
            const venta = this.getVenta(item);
            return (venta - (venta * item.descuento) / 100).toFixed(2);
        },
        getDescuento(item) {
            const venta = this.getVenta(item);
            return ((venta * item.descuento) / 100).toFixed(2);
        },
        getDeudaAnterior(item) {
            return (item.valor_deudaAnterior * 1).toFixed(2);
        },
        getConvenio(item) {
            return (item.valor_convenio * 1).toFixed(2);
        },
        getAnticipo(item) {
            return (item.valor_anticipos * 1).toFixed(2);
        },
        getLiquidaciones(item) {
            return (item.valor_liquidacion * 1).toFixed(2);
        },
        getVentaNeta(item) {
            const venta = this.getVenta(item);
            const convenio = this.getDescuento(item);
            return (venta * 1 - convenio * 1).toFixed(2);
        },
        // Calcula los anticipos o el convenio
        // getAnticiposConvenio(item) {
        //   return  item.valor_convenio && item.valor_anticipos && item.valor_liquidacion?
        //     item.valor_convenio.toFixed(2)*1 + item.valor_anticipos.toFixed(2)*1 + item.valor_liquidacion.toFixed(2)*1:
        //     item.valor_convenio && item.valor_anticipos
        //     ? item.valor_convenio.toFixed(2)*1 + item.valor_anticipos.toFixed(2)*1:
        //     item.valor_convenio && item.valor_liquidacion
        //     ? item.valor_convenio.toFixed(2)*1 + item.valor_liquidacion.toFixed(2)*1:
        //     item.valor_anticipos && item.valor_liquidacion
        //     ? item.valor_anticipos.toFixed(2)*1 + item.valor_liquidacion.toFixed(2)*1
        //     : item.valor_convenio
        //     ? item.valor_convenio.toFixed(2)*1
        //     : item.valor_anticipos
        //     ? item.valor_anticipos.toFixed(2)*1
        //     : 0;
        // },
        getAnticiposConvenio(item) {
            // Función auxiliar para asegurar que se redondeen y se devuelvan solo dos decimales
            function roundToTwoDecimalPlaces(value) {
                return parseFloat(value.toFixed(2));
            }

            // Convertimos los valores a números con dos decimales
            const valorConvenio = item.valor_convenio ? roundToTwoDecimalPlaces(item.valor_convenio) : 0;
            const valorAnticipos = item.valor_anticipos ? roundToTwoDecimalPlaces(item.valor_anticipos) : 0;
            const valorLiquidacion = item.valor_liquidacion ? roundToTwoDecimalPlaces(item.valor_liquidacion) : 0;
            const valorDeudaAnterior = item.valor_deudaAnterior ? roundToTwoDecimalPlaces(item.valor_deudaAnterior) : 0;

            // Caso cuando los cuatro valores existen
            if (valorConvenio && valorAnticipos && valorLiquidacion && valorDeudaAnterior) {
                // Comprobamos si hay variaciones entre los valores
                if (valorConvenio !== valorAnticipos || valorConvenio !== valorLiquidacion || valorConvenio !== valorDeudaAnterior ||
                    valorAnticipos !== valorLiquidacion || valorAnticipos !== valorDeudaAnterior || valorLiquidacion !== valorDeudaAnterior) {
                    return roundToTwoDecimalPlaces(valorConvenio + valorAnticipos + valorLiquidacion + valorDeudaAnterior); // Sumar si hay variación
                }
                return roundToTwoDecimalPlaces(valorConvenio + valorAnticipos + valorLiquidacion + valorDeudaAnterior); // Caso sin variaciones
            }

            // Caso cuando existen tres valores
            if ((valorConvenio && valorAnticipos && valorLiquidacion) ||
                (valorConvenio && valorAnticipos && valorDeudaAnterior) ||
                (valorConvenio && valorLiquidacion && valorDeudaAnterior) ||
                (valorAnticipos && valorLiquidacion && valorDeudaAnterior)) {
                return roundToTwoDecimalPlaces(valorConvenio + valorAnticipos + valorLiquidacion + valorDeudaAnterior);
            }

            // Caso cuando existen dos valores y hay variación entre ellos
            if ((valorConvenio && valorAnticipos) ||
                (valorConvenio && valorLiquidacion) ||
                (valorConvenio && valorDeudaAnterior) ||
                (valorAnticipos && valorLiquidacion) ||
                (valorAnticipos && valorDeudaAnterior) ||
                (valorLiquidacion && valorDeudaAnterior)) {
                return roundToTwoDecimalPlaces(valorConvenio + valorAnticipos + valorLiquidacion + valorDeudaAnterior);
            }

            // Caso cuando solo existe un valor
            if (valorConvenio) return roundToTwoDecimalPlaces(valorConvenio);
            if (valorAnticipos) return roundToTwoDecimalPlaces(valorAnticipos);
            if (valorLiquidacion) return roundToTwoDecimalPlaces(valorLiquidacion);
            if (valorDeudaAnterior) return roundToTwoDecimalPlaces(valorDeudaAnterior);

            // Caso por defecto cuando ninguno de los valores existe
            return '0';
        },
        // Calcula el saldo pendiente
        getSaldoPendiente(item) {
            const ventaDescuento = this.getDescuento(item);
            const anticiposConvenio = this.getAnticiposConvenio(item);
            return (ventaDescuento - parseFloat(anticiposConvenio)).toFixed(2);
        },
        // Método para filtrar las liquidaciones por asesor
        filterByAsesor() {
            if (this.selectedAsesor) {
                this.filteredLiquidaciones = this.liquidaciones.filter(item => item.id_asesor === this.selectedAsesor);
            } else {
                this.filteredLiquidaciones = this.liquidaciones; // Si no hay filtro, mostrar todo
            }
        },
        // Método para obtener las liquidaciones y extraer la lista de asesores
        async verLiquidaciones() {
            try {
                this.$vs.loading();

                // Hacer la solicitud GET para obtener las liquidaciones
                const response = await this.$http.get(`${this.$server_url}get_liquidaciones?periodo=${this.periodoSelect.idperiodoescolar}&tipoVenta=2`);

                this.liquidaciones = response.data;
                this.filteredLiquidaciones = this.liquidaciones;

                // Extraer los asesores únicos de las liquidaciones
                this.asesores = [...new Set(this.liquidaciones.map(item => item.id_asesor))].map(id => {
                    const asesor = this.liquidaciones.find(item => item.id_asesor === id);
                    return {
                        id_asesor: asesor.id_asesor,
                        vendedor: asesor.vendedor
                    };
                });

                this.$vs.loading.close();
                this.popupLiquidaciones = true;
            } catch (error) {
                this.$vs.loading.close();
                console.error('Error al obtener las liquidaciones:', error);
            }
        },
        async ExportarLiquidaciones() {
            try {
                this.$vs.loading();
                let me = this;
                const periodo = this.periodoSelect.periodoescolar; // Obtener el periodo

                // Hacer la solicitud GET al backend para obtener los datos
                const response = await this.$http.get(this.$server_url + 'get_liquidaciones?periodo=' + me.periodoSelect.idperiodoescolar + '&tipoVenta=2');
                const liquidaciones = response.data; // Los datos de liquidaciones

                // Crear un libro de trabajo de Excel
                const wb = XLSX.utils.book_new();

                // Preparar los datos del reporte de liquidaciones
                const wsData = [];

                // Agregar título y encabezados al reporte
                wsData.push(["Reporte de Liquidaciones"]); // Título
                wsData.push([`Periodo: ${periodo}`]); // Información adicional del periodo
                wsData.push([]); // Espacio vacío
                wsData.push([
                    '# Pedido', 'Contrato Generado', 'Institución', 'Vendedor',
                    'Venta Bruta', 'Estado', 'Descuento', 'Comisión', 'Venta Neta',
                    'Deuda Anterior', 'Convenio', 'Anticipos',
                    'Liquidaciones', 'Pagos', 'Saldo Pendiente'
                ]); // Encabezado de la tabla

                // Agregar los datos de liquidaciones
                let totalVentaTotal = 0;
                let totalVentaReal = 0;
                let totalComision = 0;
                let totalAnticiposConvenio = 0;
                let totalSaldoPendiente = 0;
                let totalDeuda = 0;
                let totalConvenio = 0;
                let totalAnticipos = 0;
                let totalLiquidaciones = 0;
                let totalVentaNeta = 0;

                liquidaciones.forEach(item => {
                    const ventaTotal = Number(this.getVenta(item)) || 0; // Convertir a número
                    const descuento = item.descuento || 0;
                    const comision = Number(this.getDescuento(item)) || 0; // Convertir a número
                    const anticiposConvenio = Number(this.getAnticiposConvenio(item)) || 0; // Convertir a número
                    const saldoPendiente = Number(this.getSaldoPendiente(item)) || 0; // Convertir a número
                    const deuda = Number(this.getDeudaAnterior(item)) || 0; // Convertir a número
                    const estado = item.verificaciones > 0 ? 'LIQUIDADO' : 'SIN LIQUIDAR';
                    const convenio = Number(this.getConvenio(item)) || 0; // Convertir a número
                    const anticipos = Number(this.getAnticipo(item)) || 0; // Convertir a número
                    const liquidaciones = Number(this.getLiquidaciones(item)) || 0; // Convertir a número
                    const ventaNeta = Number(this.getVentaNeta(item)) || 0;

                    const ventaReal = Number(item.TotalVentaReal) || 0; // Accediendo directamente a TotalVentaReal

                    // Agregar los valores a la hoja de Excel
                    wsData.push([
                        item.id_pedido,
                        item.contrato_generado,
                        item.nombreInstitucion,
                        item.vendedor,
                        ventaTotal.toFixed(2) * 1,
                        estado,
                        `${descuento} %`,
                        comision.toFixed(2) * 1,
                        ventaNeta.toFixed(2) * 1,
                        deuda.toFixed(2) * 1,
                        convenio.toFixed(2) * 1,
                        anticipos.toFixed(2) * 1,
                        liquidaciones.toFixed(2) * 1,
                        anticiposConvenio.toFixed(2) * 1,
                        saldoPendiente.toFixed(2) * 1,
                    ]);

                    // Sumar los totales
                    totalVentaTotal += ventaTotal;
                    totalVentaReal += ventaReal;
                    totalComision += comision;
                    totalAnticiposConvenio += anticiposConvenio;
                    totalSaldoPendiente += saldoPendiente;
                    totalDeuda += deuda;
                    totalConvenio += convenio;
                    totalAnticipos += anticipos;
                    totalLiquidaciones += liquidaciones;
                    totalVentaNeta += ventaNeta
                });

                // Agregar los totales al final de la hoja de liquidaciones
                wsData.push(['', '', '', 'Totales:',
                    totalVentaTotal.toFixed(2),
                    '', '',
                    totalComision.toFixed(2),
                    totalVentaNeta.toFixed(2),
                    totalDeuda.toFixed(2),
                    totalConvenio.toFixed(2),
                    totalAnticipos.toFixed(2),
                    totalLiquidaciones.toFixed(2),
                    totalAnticiposConvenio.toFixed(2),
                    totalSaldoPendiente.toFixed(2)
                ]);

                // Crear la hoja de liquidaciones
                const ws = XLSX.utils.aoa_to_sheet(wsData);

                // Agregar la hoja de liquidaciones al libro de trabajo
                XLSX.utils.book_append_sheet(wb, ws, 'Liquidaciones');

                // Crear la hoja de liquidaciones por asesor
                const wsAsesoresData = [];
                wsAsesoresData.push(["Liquidaciones por Asesor"]); // Título de la nueva hoja
                wsAsesoresData.push([`Periodo: ${periodo}`]); // Información adicional del periodo
                wsAsesoresData.push([]); // Espacio vacío

                // Agregar el encabezado para la hoja de asesores
                wsAsesoresData.push([
                    'Asesor', 'Venta Total', 'Comisión Total', 'Deuda Anterior Total', 'Convenio Total', 'Anticipos Total',
                    'Total Liquidaciones', 'Pagos Total', 'Saldo Pendiente Total'
                ]);

                // Crear un objeto para almacenar las sumas por asesor
                const resumenAsesores = {};

                liquidaciones.forEach(item => {
                    const asesor = item.vendedor;
                    const ventaTotal = Number(this.getVenta(item)) || 0; // Convertir a número
                    const comision = Number(this.getDescuento(item)) || 0; // Comisión
                    const anticiposConvenio = Number(this.getAnticiposConvenio(item)) || 0; // Anticipos/Convenio
                    const deuda = Number(this.getDeudaAnterior(item)) || 0; // Deuda anterior
                    const convenio = Number(this.getConvenio(item)) || 0; // Convenio
                    const anticipo = Number(this.getAnticipo(item)) || 0; // Anticipo
                    const liquidaciones = Number(this.getLiquidaciones(item)) || 0; // Liquidaciones
                    const saldoPendiente = Number(this.getSaldoPendiente(item)) || 0; // Saldo Pendiente

                    // Inicializar el objeto del asesor si no existe
                    if (!resumenAsesores[asesor]) {
                        resumenAsesores[asesor] = {
                            ventaTotal: 0,
                            comisionTotal: 0,
                            anticiposConvenioTotal: 0,
                            deudaAnteriorTotal: 0,
                            convenioTotal: 0,
                            anticipoTotal: 0,
                            liquidacionesTotal: 0,
                            saldoPendienteTotal: 0,
                        };
                    }

                    // Sumar los valores (sin importar el estado de liquidación)
                    resumenAsesores[asesor].ventaTotal += ventaTotal;
                    resumenAsesores[asesor].comisionTotal += comision;
                    resumenAsesores[asesor].deudaAnteriorTotal += deuda;
                    resumenAsesores[asesor].convenioTotal += convenio;
                    resumenAsesores[asesor].anticipoTotal += anticipo;
                    resumenAsesores[asesor].liquidacionesTotal += liquidaciones;
                    resumenAsesores[asesor].anticiposConvenioTotal += anticiposConvenio;
                    resumenAsesores[asesor].saldoPendienteTotal += saldoPendiente;
                });

                // Agregar las filas por asesor (todo sumado en un solo total)
                Object.keys(resumenAsesores).forEach(asesorId => {
                    const asesor = resumenAsesores[asesorId];

                    wsAsesoresData.push([
                        asesorId,
                        asesor.ventaTotal.toFixed(2), // Venta total
                        asesor.comisionTotal.toFixed(2), // Comisión total
                        asesor.deudaAnteriorTotal.toFixed(2), // Deuda anterior total
                        asesor.convenioTotal.toFixed(2), // Convenio total
                        asesor.anticipoTotal.toFixed(2), // Anticipo total
                        asesor.liquidacionesTotal.toFixed(2), // Liquidaciones total
                        asesor.anticiposConvenioTotal.toFixed(2), // Anticipos/Convenio total
                        asesor.saldoPendienteTotal.toFixed(2), // Saldo pendiente total
                    ]);
                });

                // Crear la hoja del libro con los datos de los asesores
                const wsAsesores = XLSX.utils.aoa_to_sheet(wsAsesoresData);

                // Agregar la hoja de liquidaciones por asesor al libro de trabajo
                XLSX.utils.book_append_sheet(wb, wsAsesores, 'Liquidaciones por Asesor');

                // Exportar el archivo Excel
                XLSX.writeFile(wb, `Liquidaciones_${periodo}.xlsx`);
                this.$vs.loading.close();
            } catch (error) {
                this.$vs.loading.close();
                console.error('Error al exportar liquidaciones:', error);
            }
        },
        tryExport() {
            let me = this
            //limpiar localstorage la variable tmpPedidos
            localStorage.removeItem('tmpPedidos')
            //guardar en localstorage el tmpPedidos
            localStorage.setItem('tmpPedidos', JSON.stringify(me.tmpPedidos))
            //establecer nombre de archivo por defecto si no existe
            if (!me.fileName || me.fileName === "") {
                me.fileName = `Reporte-venta-TODOS-${me.periodoSelect.periodoescolar}`
            }
            //ejecutar despues un 1 segundo
            setTimeout(function () {
                me.codigoSelected = JSON.parse(localStorage.getItem('tmpPedidos'))
                    .filter(p => p.estado != 2)
                //en contrato_generado reemplazar por no existe
                // me.codigoSelected =  me.codigoSelected.forEach(element => {
                //   if(element.contrato_generado == null || element.contrato_generado == ""){
                //     element.contrato_generado = "No existe"
                //   }
                // });
                if (me.codigoSelected.length == 0) {
                    me.$vs.notify({
                        text: 'No hay datos para exportar',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return
                }
                me.popupExport = true
            }, 1000)
        },
        //==METODOS PARA FILTRO FECHAS===
        filtrarFechas() {
            let me = this;
            me.tmpPedidos = []
            if ((me.fechaSelect == null || me.fechaSelect == "" || me.fechaSelect == undefined) && (me.zonaselect == null || me.zonaselect == '' || me.zonaselect == undefined)) {
                me.tmpPedidos = me.tmparregloFiltroFecha
                return
            } else {
                //fecha envio
                if (me.tipoFecha == 0) {
                    me.tmpPedidos = me.tmparregloFiltroFecha.filter(p => p.f_fecha_envio == me.fechaSelect)
                    return
                }
                //fecha entrega
                if (me.tipoFecha == 1) {
                    me.tmpPedidos = me.tmparregloFiltroFecha.filter(p => p.f_fecha_entrega == me.fechaSelect)
                    return
                }
                //zona
                if (me.tipoFecha == 2) {
                    me.tmpPedidos = me.tmparregloFiltroFecha.filter(p => p.f_zona_id == me.zonaselect);
                    return
                }
            }
        },
        filtroAsesores(tipo) {
            let me = this;
            me.fileName = ""
            me.codigoSelected = []
            me.tmpPedidos = []
            if (tipo == 1) {
                me.asesorSelect = ""
                me.fileName = `Reporte-venta-TODOS-${me.periodoSelect.periodoescolar}`
                me.tmpPedidos = me.tmparregloFiltroFecha
                return
            }
            if (me.asesorSelect == "" || me.asesorSelect == null || me.asesorSelect == undefined) {
                me.fileName = `Reporte-venta-TODOS-${me.periodoSelect.periodoescolar}`
                me.tmpPedidos = me.tmparregloFiltroFecha
                return
            }
            let datos = me.arrayAsesores.filter(p => p.id_asesor == me.asesorSelect)
            me.fileName = `Reporte-venta-${datos[0].asesor}-${me.periodoSelect.periodoescolar}`
            me.tmpPedidos = me.tmparregloFiltroFecha.filter(p => p.id_asesor == me.asesorSelect && (p.verificaciones > 0 || p.estadoPedido_Pagos == 4))
            return
        },
        //===METODOS NOTIFICAR REVISION==
        notificarPedido(notificados) {
            let me = this;
            let formData = new FormData();
            formData.append('changeRevisonNotificacion', 'yes')
            formData.append('id_pedido', me.pedido.id_pedido);
            formData.append('notificados', notificados);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'actualizarPedido', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.recargarPedidos()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        //==FIN METODOS NOTIFICAR REVISION===
        recargarPedidos() {
            let me = this;
            me.popupVerLiquidacion = false
            me.popupEntregarPedido = false
            me.popupPermitirEditarContrato = false
            me.$emit('changeRecarge', true)
        },
        ///====METODOS ASESOR====
        //METODOS PARA GENERAR UN NUEVO PEDIDO A PARTIR DE UN PEDIDO ANULADO
        ConfirmgenerarNuevoPedido(tr) {
            let me = this;
            this.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                text: 'Estas seguro de generar un nuevo pedido con los mismos datos',
                accept: this.generarNuevoPedido
            })
        },
        generarNuevoPedido() {
            let me = this;
            let formData = new FormData();
            formData.append('id_pedido', 0);
            formData.append('pedidoAnterior', me.pedido.id_pedido);
            formData.append('tipo_venta', me.pedido.tipo_venta);
            formData.append('tipo_venta_descr', me.pedido.tipo_venta_descr);
            // formData.append('fecha_envio',          me.pedido.fecha_envio);
            // formData.append('fecha_entrega',        me.pedido.fecha_entrega);
            formData.append('institucion', me.pedido.id_institucion);
            formData.append('periodo', me.pedido.id_periodo);
            formData.append('descuento', me.pedido.descuento);
            formData.append('anticipo', me.pedido.anticipo);
            formData.append('id_asesor', me.pedido.id_asesor);
            formData.append('observacion', me.pedido.observacion);
            if (me.pedido.imagen == 'undefined') {
                formData.append('imagen', "");
            } else {
                formData.append('imagen', me.pedido.imagen);
            }
            formData.append('ifanticipo', me.pedido.ifanticipo);
            formData.append('convenio_anios', me.pedido.convenio_anios)
            formData.append('anticipo_aprobado', 0)
            formData.append('ifagregado_anticipo_aprobado', 0)
            formData.append('id_responsable', me.pedido.id_responsable)
            formData.append('generarNuevo', 'yes')
            me.$vs.loading()
            this.$http.post(this.$server_url + 'pedidos', formData)
                .then(res => {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 8000
                        })
                        return
                    }
                    me.$vs.notify({
                        text: 'Se genero un nuevo pedido correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
            me.recargarPedidos()
        },
        filtrarDecimal2(numero) {
            let me = this
            //o o null o si no es numero
            if (numero == 0 || numero == null || isNaN(numero)) {
                return numero
            } else {
                var numeroRedondeado = numero;
                // Reemplazar el punto decimal con una coma
                var numeroConComa = numeroRedondeado.replace('.', ',');
                return numeroConComa;
            }
        },
        getAsesores() {
            let me = this
            PedidosRepository.rep_getAsesores().then(r => {
                me.arrayAsesores = r.data
            })
        },
        changeHandleEstadoPedido(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            me.popupEstadoPedido = false;
            me.recargarPedidos();
            // console.log("realizarcchangefin")

        },
        getEliminarPedido() {
            this.popupEliminarPedido = true;
        },
        changeHandleEliminarPedido(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificacionemiteliminar == 1) {
                console.log("Emit recibido por aceptar.");
                me.popupEliminarPedido = false;
                me.limpiarCache();
                me.recargarPedidos();
            } else if (e.verificacionemiteliminar == 2) {
                console.log("Emit recibido por cancelado.");
                me.popupEliminarPedido = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        getComentariosInstitucion() {
            console.log('obtener comentarios de la institucion')
        },
        //cambiar el asesor del pedido/contrato. Solo root (el back tambien lo valida)
        cambiarAsesorPedido(){
          let me = this;
          if(!me.asesorNuevoSelect){
            me.$vs.notify({ text:'Seleccione el asesor nuevo', color:'warning', iconPack:'feather', icon:'icon-alert-triangle' })
            return
          }
          let formData = new FormData();
          formData.append('cambiarAsesorPedido', '1');
          formData.append('id_pedido',        me.pedido.id_pedido);
          formData.append('id_asesor_nuevo',  me.asesorNuevoSelect);
          formData.append('user_edit',        me.usuario.idusuario);
          me.$vs.loading()
          this.$http.post(this.$server_url + 'metodosPostPedidos', formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({ text: res.data.message, color:'danger', iconPack:'feather', icon:'icon-alert-triangle' })
                    return
                }
                me.$vs.notify({ text: res.data.message, color:'success', iconPack:'feather', icon:'icon-check' })
                me.popupCambiarAsesor = false
                me.asesorNuevoSelect  = null
                me.recargarPedidos()
            })
            .catch(function (error) {
                me.$vs.loading.close()
                me.$vs.notify({ text:'Error al cambiar el asesor del pedido', color:'danger', iconPack:'feather', icon:'icon-alert-triangle' })
            })
        },
        changeEstadoPedidoEtiqueta(){
          let me = this;
          let formData = new FormData();
          formData.append('changeEstadoPedidoEtiqueta', '1');
          formData.append('id_pedido', me.pedido.id_pedido);
          formData.append('estadoPedido_Pagos', me.newEstadoPedidoEtiqueta);
          formData.append('user_edit',me.usuario.idusuario)
          me.$vs.loading()
          this.$http.post(this.$server_url + 'metodosPostPedidos', formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return
                }
                me.$vs.notify({
                    text: res.data.message,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                me.popupCambiarEstadoPedidoEtiqueta = false
                me.recargarPedidos()
            })
            .catch(function (error) {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Error al cambiar el estado del pedido',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
            })
        },
        //Funciones para confirmación de verificación
        confirmarVerificacion(pedido) {
            let me = this;

            // Revertir inmediatamente el switch al estado anterior
            // para que mantenga el valor real de la BD hasta que se confirme
            pedido.revision_pedido = pedido.revision_pedido ? 0 : 1;

            // Guardar el nuevo estado que se quiere aplicar
            me.nuevoEstadoRevision = pedido.revision_pedido ? 0 : 1;
            me.pedidoVerificar = { ...pedido };
            me.observacionVerificacion = pedido.revision_observacion || '';
            me.popupConfirmarVerificacion = true;
        },

        // Función simple para manejar el cambio del checkbox
        onRevisionCheckboxChange() {
            // Esta función se puede usar si necesitas validaciones adicionales
            // Por ahora, el v-model maneja automáticamente el cambio
        },

        procesarVerificacion() {
            let me = this;

            // Si está marcando como verificado (1), requiere observación
            if (me.nuevoEstadoRevision && !me.observacionVerificacion.trim()) {
                me.$vs.notify({
                    text: 'La observación es requerida para verificar el pedido',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            let formData = new FormData();
            formData.append('id_pedido', me.pedidoVerificar.id_pedido);

            if (me.nuevoEstadoRevision) {
                // Si está verificado (1), enviar observación
                formData.append('revision_pedido', 1);
                formData.append('revision_observacion', me.observacionVerificacion);
            } else {
                // Si no está verificado (0), enviar bandera para limpiar
                formData.append('revision_pedido', 0);
                formData.append('quitar_revisado', 1); // Bandera para que el backend limpie la observación
            }

            console.log('Estado a guardar:', me.nuevoEstadoRevision ? 'Verificado' : 'No verificado');

            me.$vs.loading();
            this.$http.post(this.$server_url + 'updateRevisionPedido', formData)
                .then(res => {
                    me.$vs.loading.close();
                    if(res.data.status == 0){
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                        return;
                    }

                    let mensaje = me.nuevoEstadoRevision
                        ? 'Pedido verificado correctamente'
                        : 'Verificación removida correctamente';

                    me.$vs.notify({
                        text: mensaje,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });

                    // SOLO AQUÍ se actualiza el estado real del pedido
                    let pedidoOriginal = me.tmpPedidos.find(p => p.id_pedido === me.pedidoVerificar.id_pedido);
                    if (pedidoOriginal) {
                        pedidoOriginal.revision_pedido = me.nuevoEstadoRevision;
                        // Si se quitó la verificación, limpiar la observación localmente también
                        pedidoOriginal.revision_observacion = me.nuevoEstadoRevision
                            ? me.observacionVerificacion
                            : '';
                    }

                    me.popupConfirmarVerificacion = false;
                    me.limpiarDatosVerificacion();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error al actualizar la verificación',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                });
        },
        cancelarVerificacion() {
            let me = this;
            me.popupConfirmarVerificacion = false;
            me.limpiarDatosVerificacion();
        },

        limpiarDatosVerificacion() {
            let me = this;
            me.pedidoVerificar = null;
            me.observacionVerificacion = '';
            me.nuevoEstadoRevision = null;
        },
        //Fin funciones para confirmación de verificación

        // Métodos para historial de estados
        cargarHistorialEstado(pedido) {
            let me = this;
            me.pedidoHistorialActual = pedido.id_pedido;
            me.mostrarTooltipHistorial = true;
            me.cargandoHistorial = true;
            me.historialEstados = [];

            let formData = new FormData();
            formData.append('getHistorialEstadoPagos', '1');
            formData.append('id_pedido', pedido.id_pedido);

            this.$http.post(this.$server_url + 'metodosPostPedidos', formData)
                .then(res => {
                    me.cargandoHistorial = false;
                    if (res.data.status == 1) {
                        me.historialEstados = res.data.historial;
                    } else {
                        me.historialEstados = [];
                    }
                })
                .catch(error => {
                    me.cargandoHistorial = false;
                    me.historialEstados = [];
                    console.error('Error al cargar historial:', error);
                });
        },

        limpiarHistorialEstado() {
            let me = this;
            // Agregar un pequeño delay para que el usuario pueda mover el mouse al tooltip
            setTimeout(() => {
                me.mostrarTooltipHistorial = false;
                me.pedidoHistorialActual = null;
            }, 300);
        },

        formatearFecha(fecha) {
            if (!fecha) return '';
            // Formato: DD/MM/YYYY HH:mm
            const date = new Date(fecha);
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0');
            const anio = date.getFullYear();
            const hora = String(date.getHours()).padStart(2, '0');
            const minutos = String(date.getMinutes()).padStart(2, '0');
            return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
        },
    }
}
</script>

<style lang="scss" scoped>
.header-sidebar {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    width: 100%;

    h4 {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        >button {
            margin-left: 10px;
        }
    }
}

.active {
    font-weight: bold;
    color: #269CE3;
    background-color: #F0F5F9;
    padding: 2px 0px;
    border-radius: 5px;
}

.menutitle {
    font-weight: bold;
    font-size: 17px;
}

.submenu {
    display: flex;
    flex-direction: column;
    margin-top: 5px;
}

.submenutitle {
    padding: 5px 0px;
    margin-top: 8px;
    cursor: pointer;
    transition: 0.2s ease-in all;
    font-size: 12px;
}

.submenutitle:hover {
    text-decoration: underline;
    color: #41A7E5;
}

.fade-in {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 0.2s;
}

@keyframes fadeInOpacity {
    0% {
        opacity: 0;
    }

    50% {
        opacity: 0.7;
    }

    100% {
        opacity: 1;
    }
}

.status-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 600;
    line-height: 1;
    white-space: nowrap;
}

/* Sin evidencia */
.status-sin-evidencia {
    background-color: rgba(255, 159, 67, 0.10);
    color: #a85a00;
    border: 1px solid rgba(255, 159, 67, 0.25);
}
.status-sin-evidencia .status-dot {
    width: 6px;
    height: 6px;
    background-color: #ff9f43;
    border-radius: 50%;
}

/* Con evidencia */
.status-con-evidencia {
    background-color: rgba(40, 199, 111, 0.10);
    color: #1f6f3a;
    border: 1px solid rgba(40, 199, 111, 0.25);
}
.status-con-evidencia .status-dot {
    width: 6px;
    height: 6px;
    background-color: #28c76f;
    border-radius: 50%;
}

/* Anulado */
.status-anulado {
    background-color: rgba(234, 84, 85, 0.10);
    color: #a21b1b;
    border: 1px solid rgba(234, 84, 85, 0.25);
}
.status-anulado .status-dot {
    width: 6px;
    height: 6px;
    background-color: #ea5455;
    border-radius: 50%;
}
</style><style scoped>
/* Estilos para los totales y diseño responsivo */
/* .totals-container {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.total-item {
  flex: 1 1 calc(25% - 1rem);
  min-width: 300px;
  width: 250px;
  background-color: #f9f9f9;
  padding: 10px;
  margin: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.totals-row {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
} */
.total-item {

    background-color: #f9f9f9;
    padding: 10px;
    margin: 10px;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Estilo para el filtro de asesor */
.filter-container {
    margin-bottom: 1rem;
    padding: 10px;
    background-color: #f4f4f4;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Responsividad para pantallas pequeñas */
@media (max-width: 768px) {
    .total-item {
        flex: 1 1 100%;
    }

    .totals-row {
        flex-direction: column;
    }
}

.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}


/* Responsive */
@media (max-width: 640px) {
    .verificacion-container {
        min-width: auto;
        margin: 10px;
    }

    .verificacion-header {
        padding: 20px;
    }

    .verificacion-content {
        padding: 20px;
    }

    .verificacion-footer {
        flex-direction: column;
    }

    .action-button, .cancel-button {
        width: 100%;
    }
}

/* Estilos para módulo de pagos */
.modulo-pagos-container {
    padding: 20px;
    background: #fff;
    border-radius: 8px;
}

/* Resaltar fila del contrato visto */
::v-deep .highlight-row {
    background-color: #fff3cd !important;
    animation: fadeOutHighlight 3s ease-out;
}

@keyframes fadeOutHighlight {
    0% {
        background-color: #fff3cd;
    }
    70% {
        background-color: #fff3cd;
    }
    100% {
        background-color: transparent;
    }
}

/* Estilos para tooltip de historial */
.tooltip-historial {
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    margin-top: 8px;
    min-width: 350px;
    max-width: 450px;
    background: #fff;
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    z-index: 9999;
    font-size: 13px;
}

.tooltip-historial::before {
    content: '';
    position: absolute;
    top: -8px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 8px solid #e0e0e0;
}

.tooltip-historial::after {
    content: '';
    position: absolute;
    top: -7px;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid #fff;
}

.tooltip-header {
    padding: 12px 16px;
    background: #f8f9fa;
    border-bottom: 1px solid #e0e0e0;
    border-radius: 8px 8px 0 0;
    font-weight: 600;
    color: #2c3e50;
}

.tooltip-content {
    max-height: 300px;
    overflow-y: auto;
    padding: 8px;
}

.historial-item {
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    transition: background 0.2s;
}

.historial-item:last-child {
    border-bottom: none;
}

.historial-item:hover {
    background: #f8f9fa;
}

.historial-cambio {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    flex-wrap: wrap;
}

.estado-badge {
    display: inline-block;
    padding: 4px 10px;
    border-radius: 4px;
    font-size: 11px;
    font-weight: 600;
    text-transform: uppercase;
}

.estado-anterior {
    background: #fee;
    color: #c33;
}

.estado-nuevo {
    background: #efe;
    color: #3a3;
}

.historial-info {
    font-size: 12px;
    color: #666;
    margin-top: 4px;
}

.historial-info div {
    margin: 3px 0;
}

.historial-info i {
    width: 16px;
    margin-right: 6px;
    color: #999;
}

.cursor-pointer {
    cursor: pointer;
}
</style>
