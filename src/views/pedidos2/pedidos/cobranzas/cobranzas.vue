<template>
<div>
    <div v-if="menu == 0">
        <div>
            <vx-card class="mt-5">
                <!-- <h3> Cobranza </h3> -->
                <vs-tabs alignment="fixed" class="mt-3">
                                    <vs-tab label="Abonos y Cheques" v-if="(AdminFacturador || groupFacturador) && !usarComponenteNuevo">
                        <div class="p-5">
                            <!-- {{ periodoSelect }} -->
                            <div fixed-height="true">
                                <!-- <vs-row>
                                        <vs-row>
                                            <vs-row v-if="mostrarInstituciones">
                                            <vs-col vs-justify="start" vs-align="start" vs-lg="8" vs-sm="12" vs-xs="12">
                                                <font style="font-size: 12px">&nbsp;Institucion O Punto de venta*</font><br>
                                                <v-select :options="Instituciones" :reduce="Instituciones => Instituciones" label="nombreInstitucion" class="w-full h-100" placeholder="--Seleccione--" v-model="InsticionCobranza" @input="exiteDatos = false;cambio(InsticionCobranza)" />
                                                <span v-if="!InsticionCobranza" class="text-danger">Elija Institucion/Punto de Venta</span>
                                            </vs-col>
                                        </vs-row> -->
                                <div class="vx-row">
                                    <!--datos librerias -->
                                    <div class="vx-col w-full ">
                                        <!--libreria-->
                                        <div class="vx-col w-full flex">
                                            <div class="w-full mb-5">
                                                <span>Buscar Datos Institucion o Libreria <small>(Presionar enter para buscar)</small>:</span>
                                                <vs-input v-model="busqueda.puntoVenta" @keypress.enter="datoNoExistente=false;exiteDatos=false;busquedaCliente='';searchData(0)" class="w-full" placeholder="Institucion / Punto de venta" />
                                            </div>
                                            <div class="w-1/6 mt-5">
                                                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="datoNoExistente=false;exiteDatos=false;busquedaCliente='';searchData(0)" icon="search"></vs-button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="vx-col w-full">
                                    <vs-table max-items="5" search pagination :data="arrayPuntoVenta " v-if="arrayPuntoVenta.length>0" striped>
                                        <template slot="header">
                                            <vs-chip color="primary">Cantidad: <b> {{ arrayPuntoVenta.length }}</b></vs-chip>
                                        </template>
                                        <template slot="thead">
                                            <vs-th>Nombre</vs-th>
                                            <vs-th style="width: 200px;">Ruc / Cédula</vs-th>
                                        </template>
                                        <template slot-scope="{data}">
                                            <!-- <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data" :state="tr.estado_ventas == 'No tiene ventas' ? 'danger':null"> -->
                                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                                <vs-td>
                                                    <b class="text-danger">{{ tr.estado_ventas == 'No tiene ventas' ? 'No tiene ventas en este periodo' : '' }}</b><br>
                                                    {{ tr.nombreInstitucion }}<br>
                                                </vs-td>
                                                <vs-td>
                                                    <div>
                                                        {{ (String(tr.ruc).length < 10 ? 'SIN RUC/CI' : tr.ruc) }}
                                                        <vx-tooltip style="display: inline-block;" text="Copiar RUC a la busqueda" position="top" color="primary">
                                                            <vs-button v-if="(String(tr.ruc).length > 10)" style="position: relative;" radius color="danger" type="flat"  @click.stop="busquedaCliente=tr.ruc; getClienteParametro();"><i class="fa-regular fa-copy"></i></vs-button><br>
                                                        </vx-tooltip>
                                                    </div>
                                                </vs-td>
                                                <template slot="expand">
                                                    <div class="w-full">
                                                        <b>Clientes utilizados en la elaboración de Documentos de venta para {{ tr.nombreInstitucion }}</b>
                                                        <template v-if="tr.datosClienteInstitucion.length > 0">
                                                            <vs-list v-for="(cliente, index) in tr.datosClienteInstitucion" :key="index">
                                                                <vs-list-item :title="cliente.nombres" :subtitle="cliente.cedula">
                                                                    <template slot="avatar">
                                                                        <vs-avatar />
                                                                    </template>
                                                                    <vs-button color="danger" @click="busquedaCliente=cliente.cedula;getClienteParametro();">Copiar a la Busqueda </vs-button>
                                                                </vs-list-item>
                                                            </vs-list>
                                                            <!-- <div v-for="(cliente, index) in tr.datosClienteInstitucion" :key="index">
                                                                        <vx-card>
                                                                            <b>{{ cliente.nombres }}</b> <br>
                                                                            <b>{{ cliente.cedula }}</b>
                                                                        </vx-card>
                                                                    </div> -->
                                                        </template>
                                                        <template v-else>
                                                            <vs-alert color="danger" active="true" class="mt-5" icon-pack="feather" icon="icon-alert-triangle">
                                                                No hay <b>Registros</b> realizados a este cliente.
                                                            </vs-alert>
                                                        </template>
                                                    </div>
                                                </template>
                                            </vs-tr>
                                        </template>
                                    </vs-table>
                                </div>
                                <vs-divider class="mt-5">Abonos</vs-divider>
                                <vs-row>
                                    <vs-col vs-justify="start" vs-align="start" vs-lg="6" vs-sm="12" vs-xs="12">
                                        <vs-row vs-type="flex" vs-justify="start" vs-w="12">
                                            <vs-col vs-justify="start" vs-align="start" vs-w="12" class="m-2">
                                                <div>
                                                    <v-select :options="listaEmpresas" :reduce="listaEmpresas => listaEmpresas" label="descripcion_corta" class="w-full h-100" placeholder="--Seleccione Empresa--" v-model="empresaCobranza" @input="exiteDatos = false;Instituciones = [];InsticionCobranza='';datosClienteLocal=[];empresaCobranzaSelected=true;mostrarInstituciones=false;arrayPuntoVenta=[];getClienteParametro()" />
                                                </div>
                                                <div>
                                                    <span v-if="!empresaCobranza || !empresaCobranzaSelected" class="text-danger">Elija una Empresa</span>
                                                </div>
                                            </vs-col>
                                        </vs-row>
                                    </vs-col>
                                    <vs-col vs-justify="start" vs-align="start" vs-lg="6" vs-sm="12" vs-xs="12">
                                        <vs-row vs-type="flex" vs-justify="start" vs-w="12">
                                            <vs-col vs-type="flex" vs-justify="start" vs-align="start" vs-w="12" class="m-2">
                                                <div class="w-full">
                                                    <vs-input @keyup.enter="arrayPuntoVenta=[];getClienteParametro()" placeholder="Buscar Ci/RUC CLiente" v-model="busquedaCliente" class="w-full h-100" />
                                                    <span v-if="!busquedaCliente && busquedaClienteTouched" class="text-danger">Ingrese un CI/RUC</span>
                                                    <span v-if="busquedaCliente && busquedaCliente.length < 10" class="text-danger">Mínimo 10 caracteres</span>
                                                </div>
                                                <div class="w-1/6">
                                                    <vs-button color="warning" type="filled" style="margin-left:10px;" @click="arrayPuntoVenta=[];getClienteParametro();" icon="search" class="w-full"></vs-button>
                                                </div>
                                            </vs-col>
                                        </vs-row>
                                    </vs-col>
                                </vs-row>
                                <vs-row v-if="mostrarInstituciones">
                                    <vs-col vs-justify="start" vs-align="start" vs-lg="8" vs-sm="12" vs-xs="12">
                                        <font style="font-size: 12px">&nbsp;Institución O Punto de venta*</font><br>
                                        <v-select :options="Instituciones" :reduce="Instituciones => Instituciones" label="nombreInstitucion" class="w-full h-100" placeholder="--Seleccione--" v-model="InsticionCobranza" @input="exiteDatos = false;cambio(InsticionCobranza)" />
                                        <span v-if="!InsticionCobranza" class="text-danger">Elija Institución/Punto de Venta</span>
                                    </vs-col>
                                </vs-row>
                                <!-- </vs-row> -->
                                <!-- {{ datosCliente }} -->
                            </div>
                        </div>
                        <div v-if="exiteDatos" class="mt-4" style="">
                            <screenfacturasNotas :empresaCobranza="empresaCobranza" :predioSeleccionado="predioSeleccionado" :InsticionCobranza="InsticionCobranza" :periodoSelect="periodoSelect" :datosCliente="datosCliente" :usarComponenteNuevo="usarComponenteNuevo" />
                        </div>
                        <div v-if="datoNoExistente">
                            <div class="p-5">
                                <vx-card>
                                    <vs-alert color="danger" icon-pack="feather" icon="icon-info">
                                        <span><b style="font-size: 17px;">Cliente no registrado en perseo </b><span v-if=" datosClienteLocal.length>0">pero si tiene documentos de venta en plataforma</span></span>
                                    </vs-alert>
                                    <vs-table max-items="5" search pagination :data="datosClienteLocal " v-if="datosClienteLocal.length>0" striped>
                                        <template slot="header">
                                            <vs-chip color="primary">Cantidad: <b> {{ datosClienteLocal.length }}</b></vs-chip>
                                        </template>
                                        <template slot="thead">
                                            <vs-th>Documento</vs-th>
                                            <vs-th>Ruc / Cédula</vs-th>
                                        </template>
                                        <template slot-scope="{data}">
                                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                                <vs-td>
                                                    {{ tr.ven_codigo }}<br>
                                                </vs-td>
                                                <vs-td>
                                                    {{ tr.ruc_cliente}}<br>
                                                </vs-td>
                                            </vs-tr>
                                        </template>
                                    </vs-table>
                                </vx-card>
                            </div>
                        </div>

                    </vs-tab>
                    <vs-tab label="Abonos y Cheques" v-if="(AdminFacturador || groupFacturador) && usarComponenteNuevo">
                        <div class="p-5">
                            <!-- Búsqueda de Cliente por CI/RUC -->
                            <vx-card v-if="!exiteDatos" class="mb-4">
                                <vs-row>
                                    <!-- Empresa -->
                                    <vs-col vs-lg="5" vs-sm="12" class="mb-3">
                                        <label style="font-size: 13px; font-weight: 600; color: #2c3e50; display: block; margin-bottom: 8px;">
                                            Empresa <span class="text-danger">*</span>
                                        </label>
                                        <v-select
                                            :options="listaEmpresas"
                                            :reduce="listaEmpresas => listaEmpresas"
                                            label="descripcion_corta"
                                            placeholder="Seleccione empresa"
                                            v-model="empresaCobranza"
                                            @input="onEmpresaChangeNuevo()"
                                        />
                                        <span v-if="!empresaCobranza || !empresaCobranzaSelected" class="text-danger" style="font-size: 11px;">Campo requerido</span>
                                    </vs-col>
                                    
                                    <!-- CI/RUC -->
                                    <vs-col vs-lg="7" vs-sm="12" class="mb-3">
                                        <label style="font-size: 13px; font-weight: 600; color: #2c3e50; display: block; margin-bottom: 8px;">
                                            CI o RUC del Cliente <span class="text-danger">*</span>
                                        </label>
                                        <div class="flex">
                                            <vs-input 
                                                @keyup.enter="buscarClienteNuevoManual()" 
                                                @input="busquedaClienteInput = busquedaClienteInput.replace(/[^0-9]/g, '')"
                                                placeholder="Ingrese al menos 10 dígitos" 
                                                v-model="busquedaClienteInput" 
                                                class="w-full"
                                            />
                                            <vs-button
                                                color="primary"
                                                type="filled"
                                                @click="buscarClienteNuevoManual()"
                                                icon="search"
                                                :disabled="!puedeBuscarClienteNuevo"
                                                style="margin-left: 8px;"
                                            >
                                                {{ busquedaEnProcesoNuevo ? 'Buscando...' : 'Buscar' }}
                                            </vs-button>
                                        </div>
                                        <span v-if="busquedaClienteInput && busquedaClienteInput.length < 10" class="text-danger" style="font-size: 11px;">Mínimo 10 caracteres</span>
                                        <p style="font-size: 11px; color: #718096; margin-top: 6px; margin-bottom: 0;">
                                            <i class="feather icon-info" style="font-size: 11px;"></i>
                                            Si no conoce el documento, puede buscarlo por institución abajo
                                        </p>
                                    </vs-col>
                                </vs-row>
                            </vx-card>

                            <!-- Ayuda: Búsqueda por Institución -->
                            <vx-card v-if="!exiteDatos" class="mb-4" style="background-color: #f7fafc; border: 1px dashed #cbd5e0;">
                                <div 
                                    class="flex justify-between items-center cursor-pointer" 
                                    @click="mostrarBusquedaInstitucion = !mostrarBusquedaInstitucion"
                                    style="user-select: none;"
                                >
                                    <div>
                                        <span style="font-size: 13px; font-weight: 600; color: #2d3748;">
                                            <i class="feather icon-help-circle" style="font-size: 14px; margin-right: 6px;"></i>
                                            ¿No conoce el CI/RUC? Busque por nombre de institución
                                        </span>
                                        <p style="font-size: 11px; color: #718096; margin: 4px 0 0 20px;">
                                            Encuentre la institución y copie su RUC para buscar
                                        </p>
                                    </div>
                                    <i class="feather" :class="mostrarBusquedaInstitucion ? 'icon-chevron-up' : 'icon-chevron-down'" style="font-size: 18px; color: #4a5568;"></i>
                                </div>
                                
                                <transition name="slide-fade">
                                    <div v-show="mostrarBusquedaInstitucion" class="mt-3 pt-3" style="border-top: 1px dashed #cbd5e0;">
                                        <cobranzasFiltroLocalVentas
                                            :periodoSelect="periodoSelect"
                                            :listaEmpresas="listaEmpresas"
                                            @copiar-ruc="setBusquedaClienteNueva"
                                        />
                                    </div>
                                </transition>
                            </vx-card>

                            <!-- Resultado de Búsqueda -->
                            <div v-if="usarComponenteNuevo && (busquedaEnProcesoNuevo || validacionPerseoCompletadaNuevo)" class="mt-4">
                                <vx-card>
                                    <div class="flex justify-between items-center mb-3">
                                        <h5 style="font-size: 14px; font-weight: 600; color: #2c3e50; margin: 0;">Información del Cliente</h5>
                                        <vs-chip v-if="exiteDatos && validacionPerseoCompletadaNuevo && mensajeValidacionClienteNuevo" :color="colorValidacionClienteNuevo" size="small">
                                            {{ mensajeValidacionClienteNuevo }}
                                        </vs-chip>
                                    </div>
                                    
                                    <vs-divider class="my-2"></vs-divider>
                                    
                                    <vs-row>
                                        <vs-col vs-lg="8" vs-sm="12">
                                            <div v-if="exiteDatos">
                                                <p class="mb-2" style="font-size: 13px;"><strong>Cliente:</strong> {{ nombreClienteSeleccionado }}</p>
                                                <p class="mb-2" style="font-size: 13px;"><strong>Documento:</strong> {{ documentoClienteEncontradoNuevo }}
                                                    <span v-if="documentoConsultadoNuevo !== documentoClienteEncontradoNuevo" style="font-size: 11px; color: #718096;">(Buscado: {{ documentoConsultadoNuevo }})</span>
                                                </p>
                                                <div class="mb-2 flex items-center" style="font-size: 13px;">
                                                    <strong style="margin-right: 8px;">Empresa:</strong>
                                                    <v-select 
                                                        :options="listaEmpresas" 
                                                        :reduce="emp => emp" 
                                                        label="descripcion_corta" 
                                                        style="flex: 1; max-width: 300px; font-size: 12px;" 
                                                        placeholder="--Seleccione--" 
                                                        v-model="empresaCobranza" 
                                                        @input="cargarClienteEnNuevaEmpresa()" 
                                                    />
                                                </div>
                                            </div>
                                            <div v-else>
                                                <p style="font-size: 13px;"><strong>Buscando:</strong> {{ documentoConsultadoNuevo }}</p>
                                            </div>
                                        </vs-col>
                                        
                                        <vs-col vs-lg="4" vs-sm="12">
                                            <div style="border-left: 1px solid #e2e8f0; padding-left: 16px;">
                                                <div class="mb-2 flex justify-between items-center">
                                                    <span style="font-size: 12px; font-weight: 600;">Plataforma:</span>
                                                    <vs-chip :color="colorEstadoPlataformaNuevo" size="small" style="font-size: 11px;">{{ textoEstadoPlataformaNuevo }}</vs-chip>
                                                </div>
                                                <div class="flex justify-between items-center">
                                                    <span style="font-size: 12px; font-weight: 600;">Perseo:</span>
                                                    <vs-chip :color="colorEstadoPerseoNuevo" size="small" style="font-size: 11px;">{{ textoEstadoPerseoNuevo }}</vs-chip>
                                                </div>
                                            </div>
                                        </vs-col>
                                    </vs-row>
                                    
                                    <vs-divider class="my-2"></vs-divider>
                                    
                                    <div class="flex justify-end">
                                        <vs-button color="primary" type="border" size="small" @click="resetearBusquedaNuevo()">
                                            <i class="feather icon-search mr-1"></i>
                                            Buscar otro cliente
                                        </vs-button>
                                    </div>
                                </vx-card>
                            </div>


                            <vs-row v-if="mostrarInstituciones">
                                <vs-col vs-justify="start" vs-align="start" vs-lg="8" vs-sm="12" vs-xs="12">
                                    <font style="font-size: 12px">&nbsp;Institucion O Punto de venta*</font><br>
                                    <v-select :options="Instituciones" :reduce="Instituciones => Instituciones" label="nombreInstitucion" class="w-full h-100" placeholder="--Seleccione--" v-model="InsticionCobranza" @input="exiteDatos = false;cambio(InsticionCobranza)" />
                                    <span v-if="!InsticionCobranza" class="text-danger">Elija Institucion/Punto de Venta</span>
                                </vs-col>
                            </vs-row>
                        </div>

                        <div v-if="exiteDatos" class="mt-4">
                            <screenfacturasNotas :empresaCobranza="empresaCobranza" :predioSeleccionado="predioSeleccionado" :InsticionCobranza="InsticionCobranza" :periodoSelect="periodoSelect" :datosCliente="datosCliente" :usarComponenteNuevo="usarComponenteNuevo" :refreshTotalesKey="refreshTotalesNuevoKey" />
                        </div>

                        <div v-if="exiteDatos && usarComponenteNuevo" class="mt-4">
                            <cobranzasChequesNuevo :periodoSelect="periodoSelect" :empresaCobranza="empresaCobranza" :datosCliente="datosCliente" @totalesActualizados="actualizarTotalesNuevoDesdeCheques" />
                        </div>

                        <div v-if="datoNoExistente">
                            <div class="p-5">
                                <vx-card>
                                    <vs-alert color="danger" icon-pack="feather" icon="icon-info">
                                        <span><b style="font-size: 17px;">Cliente no registrado en perseo </b><span v-if="datosClienteLocal.length > 0">pero si tiene documentos de venta en plataforma</span></span>
                                    </vs-alert>
                                    <vs-table max-items="5" search pagination :data="datosClienteLocal" v-if="datosClienteLocal.length > 0" striped>
                                        <template slot="header">
                                            <vs-chip color="primary">Cantidad: <b>{{ datosClienteLocal.length }}</b></vs-chip>
                                        </template>
                                        <template slot="thead">
                                            <vs-th>Documento</vs-th>
                                            <vs-th>Ruc / Cedula</vs-th>
                                        </template>
                                        <template slot-scope="{data}">
                                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                                <vs-td>
                                                    {{ tr.ven_codigo }}<br>
                                                </vs-td>
                                                <vs-td>
                                                    {{ tr.ruc_cliente }}<br>
                                                </vs-td>
                                            </vs-tr>
                                        </template>
                                    </vs-table>
                                </vx-card>
                            </div>
                        </div>
                    </vs-tab>
                    <vs-tab label="Cuentas de banco" v-if="AdminFacturador && !usarComponenteNuevo">
                        <cuentasBanco />
                    </vs-tab>
                    <vs-tab label="Reportes" v-if="!usarComponenteNuevo">
                        <vs-divider class="mt-5">Reportes Ventas, Cobranza</vs-divider>
                        <div class="flex" style="justify-content: space-around;">
                            <div class="mt-4">
                                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="abonoExcel('L')" icon-pack="feather" icon="icon-file">EXPORTAR EXCEL V.LISTA</vs-button>
                            </div>
                            <div class="mt-4">
                                <vs-button color="warning" type="filled" style="margin-left:10px;" @click="abonoExcel('V')" icon-pack="feather" icon="icon-file">EXPORTAR EXCEL V.DIRECTA</vs-button>
                            </div>
                        </div>
                        <div class="flex" style="justify-content: center;">
                            <div class="mt-5">
                                <vs-button color="danger" type="filled" style="margin-left:10px;" @click="abonoExcel('All')" icon-pack="feather" icon="icon-file">EXPORTAR EXCEL GENERAL</vs-button>
                            </div>
                        </div>
                        <vs-divider class="mt-5">Reportes Variaciones Venta y abono</vs-divider>
                        <div>
                            <div class="flex" style="justify-content: space-around;">
                                <div class="mt-5">
                                    <vs-button color="success" type="filled" style="margin-left:10px;" @click="mostrarReporteVariaciones()" icon-pack="feather" icon="icon-file">Reporte Variaciones Ventas</vs-button>
                                </div>
                                <div class="mt-5">
                                    <vs-button color="success" type="filled" style="margin-left:10px;" @click="mostrarClientesAbonoNoDocumentos()" icon-pack="feather" icon="icon-file">Abonos sin Documentos</vs-button>
                                </div>
                            </div>
                        </div>
                    </vs-tab>
                    <vs-tab label="Seguimiento" v-if="!usarComponenteNuevo">
                        <seguimientoCuentas :predioSeleccionado="predioSeleccionado" />
                    </vs-tab>
                    <!-- <vs-tab label="Seguimiento General" v-if="userRoot">
                        <seguimientoCuentasGeneral :predioSeleccionado="predioSeleccionado" />
                    </vs-tab> -->
                </vs-tabs>
            </vx-card>
        </div>
        <div>

        </div>
        <!--  <vs-tabs  alignment="fixed">
                        <vs-tab label="Institucion">
                            <div>
                                <div class="p-5">
                                    <vx-card fixed-height="true">
                                        <div style="width:80%; margin: 10px;">
                                            <font style="font-size: 12px">&nbsp;Institucion *</font><br>
                                            <v-select :options="Instituciones" :reduce="Instituciones => Instituciones" label="nombreInstitucion" class="w-full h-100" placeholder="--Seleccione--" v-model="InsticionCobranza" @input="exiteDatos = false;cambio(InsticionCobranza)"/>
                                        </div>
                                    </vx-card>
                                </div>
                                <div v-if="exiteDatos" class="mt-4" style="">
                                    <screenfacturasNotas :predioSeleccionado="predioSeleccionado" :InsticionCobranza="InsticionCobranza"/>
                                </div>
                            </div>
                        </vs-tab>
                        <vs-tab label="Puntos">
                            <div>
                                <div class="p-5">
                                    <vx-card fixed-height="true">
                                        <div style="width:80%; margin: 10px;">
                                            <font style="font-size: 12px">&nbsp;Puntos *</font><br>
                                            <v-select :options="puntos" :reduce="puntos => puntos" label="nombreInstitucion" class="w-full h-100" placeholder="--Seleccione--" v-model="puntosCobranza"/>
                                        </div>
                                    </vx-card>
                                </div>
                                <div v-if="exiteDatos" class="mt-4" style="">
                                    <screenfacturasNotas :predioSeleccionado="predioSeleccionado" :puntosCobranza="puntosCobranza"/>
                                </div>
                            </div>
                        </vs-tab>
                    </vs-tabs>   -->
    </div>
    <div v-if="menu == 1">
        <vx-card title="Cobranzas">
            <div class="flex">
                <div class="flex justify-center m-2">
                    <div class="text-center items-center">
                        <img style="margin-left: 30px;" width="80" src="https://cdn-icons-png.flaticon.com/512/9582/9582985.png" alt="">
                        <span class="text-purple">Total Facturas y Notas</span><br>
                        <h2 class="mb-1 pl-1 font-bold text-purple">$</h2>
                    </div>
                </div>
                <div class="flex justify-center m-2">
                    <div class="text-center items-center">
                        <img style="margin-left: 30px;" width="80" src="https://cdn-icons-png.flaticon.com/512/9582/9582990.png" alt="">
                        <span class="text-orange ml-2">Total Abonos</span><br>
                        <h2 class="mb-1 pl-5 font-bold text-orange">$</h2>
                    </div>
                </div>
            </div>
        </vx-card>
    </div>

    <!-- 🚀 Popup Reporte Progresivo -->
    <reporteProgresivoPopup 
        :active.sync="mostrarPopupProgresivo" 
        :periodoSelect="periodoSelect"
    />
</div>
</template>

<script>
import vSelect from "vue-select";
import screenfacturasNotas from "./screenFacturasNotas.vue"
import seguimientoCuentas from "./seguimientoCuentas.vue"
import seguimientoCuentasGeneral from "./seguimientoCuentasGeneral.vue"
import reporteProgresivoPopup from "./reporteProgresivoPopup.vue"
import cobranzasFiltroLocalVentas from "./components/cobranzasFiltroLocalVentas.vue"
import cobranzasChequesNuevo from "./components/cobranzasChequesNuevo.vue"
const cuentasBanco = () => import("@/views/facturacion/10_10_1_4/Facturacion/cuentas_banco_empresa/cuentasBancoEmpresa.vue");
import {
    mapState
} from "vuex";
import * as XLSX from 'xlsx';

export default {
    components: {
        "v-select": vSelect,
        screenfacturasNotas,
        cuentasBanco,
        seguimientoCuentas,
        seguimientoCuentasGeneral,
        reporteProgresivoPopup,
        cobranzasFiltroLocalVentas,
        cobranzasChequesNuevo,
    },
    data() {
        return {
            menu: 0,
            Instituciones: [],
            puntos: [],
            InsticionCobranza: [],
            puntosCobranza: [],
            datosCliente: {},
            predioSeleccionado: 0,
            exiteDatos: false,
            datoEnviar: null,
            busquedaCliente: '',
            empresaCobranza: [],
            listaEmpresas: [],
            mostrarInstituciones: false,
            mostrarBusquedaInstitucion: false,
            busquedaClienteTouched: false,
            empresaCobranzaSelected: false,
            valorSeleccion: 'Seleccion Empresa',
            busquedaClienteLocal: '',
            datosClienteLocal: [],
            busqueda: {
                puntoVenta: '',
            },
            datosSeleccionado: {
                nombreInstitucion: '',
                ciudad: '',
                id_institucion: '',
                idusuario: '',
                nombre: '',
                cedula: '',
                email: '',
                datosInstitucion: [],
                clientesidPerseo: 0,
            },
            arrayPuntoVenta: [],
            claseLibreria: 'w-full',
            listaUsuarios: [],
            datosClienteLocal: [],
            datosCliente: [],
            arregloAbonoVentas: [],
            arregloVariacionVentas: [],
            arregloAbonoNoDocumentos: [],
            datoNoExistente: false,
            mostrarPopupProgresivo: false,
            existeClientePerseoNuevo: false,
            validacionPerseoCompletadaNuevo: false,
            busquedaClienteInput: '',
            busquedaClienteAplicadaNuevo: '',
            documentoClienteEncontradoNuevo: '',
            mensajeValidacionClienteNuevo: '',
            colorValidacionClienteNuevo: 'warning',
            busquedaEnProcesoNuevo: false,
            documentoConsultadoNuevo: '',
            estadoPlataformaNuevo: 'pendiente',
            estadoPerseoNuevo: 'pendiente',
            clienteSeleccionadoNuevo: '',
            empresaSeleccionadaNuevo: '',
            contadorBusquedasNuevo: 0,
            refreshTotalesNuevoKey: 0,
        };
    },
    props: {
        periodoSelect: {
            type: Object,
            default: function () {
                return {}
            }
        },
        usarComponenteNuevo: {
            type: Boolean,
            default: false
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'AdminFacturador', 'empresaPlataforma']),
        nombreClienteSeleccionado() {
            let me = this;
            if (me.usarComponenteNuevo && me.clienteSeleccionadoNuevo) {
                return me.clienteSeleccionadoNuevo;
            }
            if (me.datosCliente && me.datosCliente.length > 0 && me.datosCliente[0].razonsocial) {
                return me.datosCliente[0].razonsocial;
            }
            return 'Cliente no identificado';
        },
        nombreEmpresaSeleccionada() {
            let me = this;
            if (me.usarComponenteNuevo && me.empresaSeleccionadaNuevo) {
                return me.empresaSeleccionadaNuevo;
            }
            if (me.empresaCobranza && me.empresaCobranza.descripcion_corta) {
                return me.empresaCobranza.descripcion_corta;
            }
            if (me.empresaCobranza && me.empresaCobranza.nombre) {
                return me.empresaCobranza.nombre;
            }
            return 'Empresa no seleccionada';
        },
        contadorCaracteresNuevo() {
            let me = this;
            if (!me.busquedaClienteInput) {
                return 0;
            }
            return me.busquedaClienteInput.length;
        },
        puedeBuscarClienteNuevo() {
            let me = this;
            if (me.busquedaEnProcesoNuevo) {
                return false;
            }
            if (!me.empresaCobranzaSelected) {
                return false;
            }
            if (!me.busquedaClienteInput) {
                return false;
            }
            return me.busquedaClienteInput.length >= 10;
        },
        textoEstadoPlataformaNuevo() {
            let me = this;
            if (me.estadoPlataformaNuevo == 'consultando') {
                return 'Consultando';
            }
            if (me.estadoPlataformaNuevo == 'encontrado') {
                return 'Encontrado';
            }
            if (me.estadoPlataformaNuevo == 'no_encontrado') {
                return 'No encontrado';
            }
            return 'Pendiente';
        },
        colorEstadoPlataformaNuevo() {
            let me = this;
            if (me.estadoPlataformaNuevo == 'consultando') {
                return 'warning';
            }
            if (me.estadoPlataformaNuevo == 'encontrado') {
                return 'success';
            }
            if (me.estadoPlataformaNuevo == 'no_encontrado') {
                return 'danger';
            }
            return 'dark';
        },
        textoEstadoPerseoNuevo() {
            let me = this;
            if (me.estadoPerseoNuevo == 'consultando') {
                return 'Consultando';
            }
            if (me.estadoPerseoNuevo == 'encontrado') {
                return 'Encontrado';
            }
            if (me.estadoPerseoNuevo == 'no_encontrado') {
                return 'No encontrado';
            }
            return 'Pendiente';
        },
        colorEstadoPerseoNuevo() {
            let me = this;
            if (me.estadoPerseoNuevo == 'consultando') {
                return 'warning';
            }
            if (me.estadoPerseoNuevo == 'encontrado') {
                return 'success';
            }
            if (me.estadoPerseoNuevo == 'no_encontrado') {
                return 'danger';
            }
            return 'dark';
        }
    },
    watch: {
        busquedaCliente(value) {
            this.busquedaClienteTouched = true;
        },
        busquedaClienteInput(value) {
            this.busquedaClienteTouched = true;
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
        let me = this;
        me.getEmpresas();
        me.predioSeleccionado = parseInt(me.periodoSelect.idperiodoescolar);
        // me.InstitucionesXCobranzas();
    },
    methods: {
        actualizarTotalesNuevoDesdeCheques() {
            this.refreshTotalesNuevoKey = this.refreshTotalesNuevoKey + 1;
        },
        normalizarDocumento(valor) {
            if (!valor) {
                return '';
            }
            let documento = String(valor).replace(/\D/g, '');
            if (documento.length == 13 && documento.slice(-3) == '001') {
                return documento.substring(0, 10);
            }
            return documento;
        },
        generarCandidatosDocumento(valor) {
            let base = String(valor ? valor : '').replace(/\D/g, '');
            let candidatos = [];
            if (base) {
                candidatos.push(base);
            }
            if (base.length == 10) {
                candidatos.push(base + '001');
            }
            if (base.length == 13 && base.slice(-3) == '001') {
                candidatos.push(base.substring(0, 10));
            }
            return [...new Set(candidatos)];
        },
        obtenerDocumentoPerseo(clientePerseo) {
            if (!clientePerseo) {
                return '';
            }
            if (clientePerseo.identificacion) {
                return clientePerseo.identificacion;
            }
            if (clientePerseo.cedula) {
                return clientePerseo.cedula;
            }
            if (clientePerseo.ruc) {
                return clientePerseo.ruc;
            }
            return '';
        },
        obtenerNombrePerseo(clientePerseo) {
            if (!clientePerseo) {
                return '';
            }
            if (clientePerseo.razonsocial) {
                return clientePerseo.razonsocial;
            }
            if (clientePerseo.nombres) {
                return clientePerseo.nombres;
            }
            return '';
        },
        async buscarClienteLocalFlexible(documento) {
            let me = this;
            let candidatos = me.generarCandidatosDocumento(documento);
            for (let i = 0; i < candidatos.length; i++) {
                try {
                    let res = await me.$http.get(me.$server_url + 'getClienteLocal?cedula=' + candidatos[i]);
                    if (res && res.data) {
                        return res.data;
                    }
                } catch (e) {
                }
            }
            return null;
        },
        async buscarClientePerseoFlexible(documento, empresaId) {
            let me = this;
            let candidatos = me.generarCandidatosDocumento(documento);
            for (let i = 0; i < candidatos.length; i++) {
                try {
                    let payload = {
                        busqueda: candidatos[i],
                        empresa: empresaId
                    };
                    let res = await me.$http.post(me.$server_url + 'api/perseo/clientes/clientes_consulta', payload);
                    if (res && res.data && res.data.clientes && res.data.clientes.length > 0) {
                        return res.data.clientes[0];
                    }
                } catch (e) {
                }
            }
            return null;
        },
        documentosCoincidenFlexible(docLocal, docPerseo) {
            let me = this;
            let nLocal = me.normalizarDocumento(docLocal);
            let nPerseo = me.normalizarDocumento(docPerseo);
            if (!nLocal || !nPerseo) {
                return false;
            }
            return nLocal == nPerseo;
        },
        onEmpresaChangeNuevo() {
            let me = this;
            me.exiteDatos = false;
            me.Instituciones = [];
            me.InsticionCobranza = '';
            me.datosClienteLocal = [];
            me.empresaCobranzaSelected = true;
            me.mostrarInstituciones = false;
            me.arrayPuntoVenta = [];
            me.validacionPerseoCompletadaNuevo = false;
            me.existeClientePerseoNuevo = false;
            me.documentoClienteEncontradoNuevo = '';
            me.mensajeValidacionClienteNuevo = '';
            me.colorValidacionClienteNuevo = 'warning';
            me.busquedaEnProcesoNuevo = false;
            me.documentoConsultadoNuevo = '';
            me.estadoPlataformaNuevo = 'pendiente';
            me.estadoPerseoNuevo = 'pendiente';
        },
        buscarClienteNuevoManual() {
            let me = this;
            me.arrayPuntoVenta = [];
            me.busquedaCliente = me.busquedaClienteInput;
            me.getClienteParametro();
            me.busquedaClienteAplicadaNuevo = me.busquedaClienteInput;
        },
        resetearBusquedaNuevo() {
            let me = this;
            me.exiteDatos = false;
            me.busquedaClienteInput = '';
            me.busquedaClienteAplicadaNuevo = '';
            me.busquedaEnProcesoNuevo = false;
            me.validacionPerseoCompletadaNuevo = false;
            me.InsticionCobranza = '';
            me.Instituciones = [];
            me.mostrarInstituciones = false;
        },
        cargarClienteEnNuevaEmpresa() {
            let me = this;
            // Al cambiar empresa, recargar datos del cliente en la nueva empresa
            me.Instituciones = [];
            me.InsticionCobranza = '';
            me.mostrarInstituciones = false;
            
            // Llamar getClienteParametro para buscar el cliente en la nueva empresa
            me.getClienteParametro();
        },
        setBusquedaClienteNueva(documento) {
            let me = this;
            me.busquedaCliente = documento;
            me.busquedaClienteInput = documento;
            me.busquedaClienteTouched = true;
            me.arrayPuntoVenta = [];
            me.getClienteParametro();
        },
        mostrarClientesAbonoNoDocumentos() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'clientesAbonoNoDocumentos?periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    let datos = res.data;
                    me.arregloAbonoNoDocumentos = datos;

                    // Exportar a Excel
                    me.exportarAbonoExcel(me.arregloAbonoNoDocumentos);

                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.error('Error al obtener datos:', error);
                    me.$vs.loading.close();
                });
        },

        exportarAbonoExcel(datos) {
            // Crea una nueva hoja de trabajo
            const worksheet = XLSX.utils.json_to_sheet(datos);

            // Crea un libro de trabajo y agrega la hoja
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Clientes Abono Sin Documentos');

            // Exporta el archivo
            XLSX.writeFile(workbook, 'clientes_abono_sin_documentos.xlsx');
        },
        mostrarReporteVariaciones() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'reporteVariacionVentas?periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    let datos = res.data;

                    const institucionCliente = {};

                    datos.forEach(item => {
                        item.variaciones = []; // Inicializar el campo de variaciones

                        const key = `${item.ruc_cliente}-${item.institucion_id}`;

                        // Validar diferente institución, mismo cliente
                        if (institucionCliente[item.ruc_cliente]) {
                            if (!institucionCliente[item.ruc_cliente].includes(item.institucion_id)) {
                                item.variaciones.push(`Diferente Institución, mismo cliente: ${item.ruc_cliente}.`);
                            }
                        } else {
                            institucionCliente[item.ruc_cliente] = [item.institucion_id];
                        }

                        // Validar diferente cliente, misma institución
                        const institucionKey = item.institucion_id;
                        if (!institucionCliente[institucionKey]) {
                            institucionCliente[institucionKey] = [item.ruc_cliente];
                        } else {
                            if (!institucionCliente[institucionKey].includes(item.ruc_cliente)) {
                                item.variaciones.push(`Diferente Cliente, misma institución: ${item.nombre}.`);
                            }
                        }

                        // Validar diferencia en tipo de venta
                        if (institucionCliente[key]) {
                            if (institucionCliente[key].ven_tipo_inst !== item.ven_tipo_inst) {
                                item.variaciones.push(`Diferente tipo de venta para cliente: ${item.ruc_cliente}, institución: ${item.nombre}.`);
                            }
                        } else {
                            institucionCliente[key] = {
                                ven_tipo_inst: item.ven_tipo_inst
                            };
                        }
                    });
                    me.arregloVariacionVentas = datos;

                    // Filtrar para quedarnos solo con los que tienen variaciones
                    // me.arregloVariacionVentas = datos.filter(item => item.variaciones.length > 0);
                    // console.log('Datos con variaciones:', me.arregloVariacionVentas);

                    // Exportar a Excel
                    me.exportarAExcel(me.arregloVariacionVentas);

                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.error('Error al obtener datos:', error);
                    me.$vs.loading.close();
                });
        },

        exportarAExcel(datos) {
            // Cambiar 'errores' a 'variaciones' en los datos
            const datosExportar = datos.map(item => ({
                ...item,
                variaciones: item.variaciones.join('; ') // Unir variaciones en un solo string
            }));

            // Crea una nueva hoja de trabajo
            const worksheet = XLSX.utils.json_to_sheet(datosExportar);

            // Crea un libro de trabajo y agrega la hoja
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, 'Reporte Variaciones');

            // Exporta el archivo
            XLSX.writeFile(workbook, 'reporte_variaciones.xlsx');
        },

        abonoExcel(tipo) {
            let me = this;
            me.reporteAbonoVentas(tipo);
        },
        reporteAbonoVentas(tipo) {
            let me = this;
            
            // Solo usar el nuevo sistema progresivo para 'All'
            if (tipo == 'All') {
                me.mostrarReporteProgresivo();
                return;
            }

            // Para 'L' y 'V' mantener el flujo original
            me.$vs.loading();
            this.$http.get(this.$server_url + 'reporteAbonoVentasXD?periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    let datos = res.data;
                    if (tipo == 'L') {
                        me.arregloAbonoVentas = datos.filter(datos => datos.punto_venta == '1');
                        console.log(me.arregloAbonoVentas);
                        setTimeout(() => {
                            me.downloadReport(tipo);
                        }, 500);
                    }
                    if (tipo == 'V') {
                        me.arregloAbonoVentas = datos.filter(datos => datos.punto_venta == '0');
                        console.log(me.arregloAbonoVentas);
                        setTimeout(() => {
                            me.downloadReport(tipo);
                        }, 500);
                    }
                    me.$vs.loading.close();

                })
                .catch(function (error) {
                    me.$vs.loading.close();
                });
        },
        mostrarReporteProgresivo() {
            this.mostrarPopupProgresivo = true;
        },
        downloadReport(tipo) {
            let me = this;
            let reportTitle;
            if (tipo == 'L') {
                reportTitle = 'Reporte Ventas, Abonos, Saldos - Librerias';
            }
            if (tipo == 'V') {
                reportTitle = 'Reporte Ventas, Abonos, Saldos - Establecimientos';
            }
            if (tipo == 'All') {
                reportTitle = 'Reporte Ventas, Abonos, Saldos - General';
            }
            const fecha = new Date();
            const opciones = {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            };
            const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
            const wsData = this.prepareData(reportTitle, fechaFormateada, tipo, me.periodoSelect.descripcion);
            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            if (tipo == 'L') {
                // Combinar celdas para el título y cabecera
                ws['!merges'] = [{
                        s: {
                            r: 0,
                            c: 0
                        },
                        e: {
                            r: 0,
                            c: 10
                        }
                    }, // Combina el título en la primera fila
                    {
                        s: {
                            r: 1,
                            c: 0
                        },
                        e: {
                            r: 1,
                            c: 10
                        }
                    },
                    {
                        s: {
                            r: 2,
                            c: 0
                        },
                        e: {
                            r: 2,
                            c: 10
                        }
                    },
                ];
            }
            if (tipo == 'V') {
                // Combinar celdas para el título y cabecera
                ws['!merges'] = [{
                        s: {
                            r: 0,
                            c: 0
                        },
                        e: {
                            r: 0,
                            c: 10
                        }
                    }, // Combina el título en la primera fila
                    {
                        s: {
                            r: 1,
                            c: 0
                        },
                        e: {
                            r: 1,
                            c: 10
                        }
                    },
                    {
                        s: {
                            r: 2,
                            c: 0
                        },
                        e: {
                            r: 2,
                            c: 10
                        }
                    },
                ];
            }
            if (tipo == 'All') {
                // Combinar celdas para el título y cabecera
                ws['!merges'] = [{
                        s: {
                            r: 0,
                            c: 0
                        },
                        e: {
                            r: 0,
                            c: 9
                        }
                    }, // Combina el título en la primera fila
                    {
                        s: {
                            r: 1,
                            c: 0
                        },
                        e: {
                            r: 1,
                            c: 9
                        }
                    },
                    {
                        s: {
                            r: 2,
                            c: 0
                        },
                        e: {
                            r: 2,
                            c: 9
                        }
                    },
                ];
            }

            // Agregar la hoja al libro
            XLSX.utils.book_append_sheet(wb, ws, 'Reporte');

            // Exportar el archivo
            XLSX.writeFile(wb, `${reportTitle}.xlsx`);
        },

        prepareData(reportTitle, fecha, tipo, temporada) {
            const wsData = [];

            // Inicializar variables de totales
            let totalSaldos = 0;
            let totalDevolucion = 0;
            let totalAbono = 0;
            let totalven_valor = 0;
            let totalsubtotal = 0; // Solo usado en tipo 'V'
            let totalRetencion = 0;
            let totalLiquidaciones = 0;
            let totalCruces = 0;
            let totalNotasCredito = 0;
            let totalDevolucionBruta = 0;
            let totalFacturaOperativa = 0;

            // Agregar título (primera fila)
            wsData.push([reportTitle]); // Aquí se establece el texto del título
            wsData.push(['TEMPORADA ' + temporada]); // Espacio vacío
            wsData.push([fecha]); // Espacio vacío
            wsData.push([]); // Espacio vacío

            if (tipo == 'L') {
                // Agregar cabecera
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'LIBRERIA', 'CLIENTE', 'ASESOR', 'COMPRAS', 'PAGOS', 'DEVOLUCIONES', 'RETENCIONES', 'OTROS', 'SALDO','PERIODO','SERIE']);

                // Agregar los datos
                this.arregloAbonoVentas.forEach(item => {
                    const ven_valor = item.valor_total ? parseFloat(item.valor_total) : 0;
                    const abono_total = item.abono_total ? parseFloat(item.abono_total) : 0;
                    const retencion_total = item.retencion_total ? parseFloat(item.retencion_total) : 0;
                    const devolucion = item.devolucion ? parseFloat(item.devolucion) : 0;
                    const saldo = item.tdo_nombre == 'DEVOLUCION SIN EMPRESA'? item.devolucion*-1: item.tdo_nombre == 'ABONO SIN VENTAS' || item.tdo_nombre == 'ABONO SIN PRE-FACTURAS' || item.tdo_nombre == 'ABONO SIN NOTAS'? item.abono_total*-1:(ven_valor - abono_total - devolucion - retencion_total).toFixed(2) * 1; // Convertir a número
                    const subtotal = item.subtotal_total ? parseFloat(item.subtotal_total) : 0;

                    const porcentajeSaldo = subtotal !== 0 ? (saldo / subtotal) : 0;
                    const devNeta = devolucion - (devolucion * porcentajeSaldo);

                    wsData.push([
                        item.empresa,
                        item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        item.nombreInstitucion,
                        item.cliente_facturado,
                        item.asesor,
                        ven_valor.toFixed(2) * 1, // Convertir a número
                        abono_total.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1,
                        // devNeta.toFixed(2) * 1,
                        retencion_total.toFixed(2) * 1,
                        (0).toFixed(2) * 1,
                        saldo, // Ya es un número
                        this.periodoSelect.descripcion,
                        this.empresaPlataforma ? this.empresaPlataforma.descripcion_corta || this.empresaPlataforma.nombre : 'N/A'
                    ]);

                    totalven_valor += ven_valor;
                    totalAbono += abono_total;
                    totalRetencion += retencion_total;
                    totalDevolucion += devolucion;
                    totalSaldos += saldo;
                });

                // Agregar totales
                wsData.push(['', '', '', '', 'TOTAL:', totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, (0).toFixed(2) * 1, totalSaldos.toFixed(2) * 1]);

                // Agregar pie de página
                wsData.push(['']);
                return wsData;
            }

            if (tipo == 'V') {
                // Agregar cabecera
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'INSTITUCION', 'CLIENTE', 'ASESOR', 'V.BRUTA', 'V.NETA', 'ABONOS', 'RETENCIÓN', 'DEVOlUCION', 'SALDO','PERIODO','SERIE']);

                // Agregar los datos
                this.arregloAbonoVentas.forEach(item => {
                    const ven_valor = item.valor_total ? parseFloat(item.valor_total) : 0;
                    const abono_total = item.abono_total ? parseFloat(item.abono_total) : 0;
                    const retencion_total = item.retencion_total ? parseFloat(item.retencion_total) : 0;
                    const descuento_total = item.descuento_total ? parseFloat(item.descuento_total) : 0;
                    const subtotal = item.subtotal_total ? parseFloat(item.subtotal_total) : 0;
                    const devolucion = item.devolucion ? parseFloat(item.devolucion) : 0;

                    const saldo = item.tdo_nombre == 'DEVOLUCION SIN EMPRESA'? item.devolucion*-1: item.tdo_nombre == 'ABONO SIN VENTAS'|| item.tdo_nombre == 'ABONO SIN PRE-FACTURAS' || item.tdo_nombre == 'ABONO SIN NOTAS'? item.abono_total*-1:((ven_valor) - (abono_total + devolucion + retencion_total)).toFixed(2) * 1; // Convertir a número
                    const porcentajeSaldo = subtotal !== 0 ? (saldo / subtotal) : 0;
                    const devNeta = devolucion - (devolucion * porcentajeSaldo);

                    wsData.push([
                        item.empresa,
                        item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        item.nombreInstitucion,
                        item.cliente_facturado,
                        item.asesor,
                        subtotal.toFixed(2) * 1, // Convertir a número
                        ven_valor.toFixed(2) * 1,
                        abono_total.toFixed(2) * 1,
                        retencion_total.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1,
                        // devNeta.toFixed(2) * 1,
                        saldo,
                        this.periodoSelect.descripcion,
                        this.empresaPlataforma ? this.empresaPlataforma.descripcion_corta || this.empresaPlataforma.nombre : 'N/A'
                    ]);

                    totalsubtotal += subtotal;
                    totalven_valor += ven_valor;
                    totalAbono += abono_total;
                    totalDevolucion += devolucion;
                    totalSaldos += saldo;
                    totalRetencion += retencion_total;
                });

                // Agregar totales
                wsData.push(['', '', '', '', 'TOTAL:', totalsubtotal.toFixed(2) * 1, totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalSaldos.toFixed(2) * 1]);

                // Agregar pie de página
                wsData.push(['']);
                return wsData;
            }

            if (tipo == 'All') {
                // Agregar cabecera
                wsData.push(['EMPRESA', 'DOCUMENTO', 'VENTA', 'P.VENTA/INST', 'CLIENTE', 'ASESOR', 'V.BRUTA', 'V.NETA', 'ABONOS','DEV. BRUTA', 'DEVOLUCIONES', 'LIQUIDACIONES', 'RETENCIONES', 'CRUCES','NOTA DE CREDITO','FACT.OPERATIVA', 'SALDO','PERIODO','SERIE']);

                // Agregar los datos
                this.arregloAbonoVentas.forEach(item => {
                    const ven_valor = item.tdo_nombre == 'NOTA DE CREDITO'?0:item.valor_total ? parseFloat(item.valor_total) : 0;
                    const abono_total = item.abono_total ? parseFloat(item.abono_total) : 0;
                    const descuento_total = item.descuento_total ? parseFloat(item.descuento_total) : 0;
                    const subtotal = item.tdo_nombre == 'NOTA DE CREDITO'?0:item.subtotal_total ? parseFloat(item.subtotal_total) : 0;
                    const devolucion = item.devolucion ? parseFloat(item.devolucion) : 0;
                    const devolucion_bruta = item.devolucion_bruta ? parseFloat(item.devolucion_bruta) : 0;
                    const retencion_total = item.retencion_total ? parseFloat(item.retencion_total) : 0;
                    const liquidaciones = item.abono_liquidacion ? parseFloat(item.abono_liquidacion) : 0;
                    const cruces = item.abono_cruce ? parseFloat(item.abono_cruce) : 0;
                    const notasCredito = item.tdo_nombre == 'NOTA DE CREDITO' ? (item.valor_total ? parseFloat(item.valor_total) : 0) : 0;
                    const factura_operativa = item.factura_operativa ? parseFloat(item.factura_operativa) : 0;
                    
                    // Fórmula corregida: FacturaOperativa - (Ventas - (Abonos + Devoluciones + Retenciones + Cruces + NotasCredito))
                    const saldo = item.tdo_nombre == 'DEVOLUCION SIN EMPRESA' ? item.devolucion*-1 : 
                                  item.tdo_nombre == 'ABONO SIN VENTAS' || item.tdo_nombre == 'ABONO SIN PRE-FACTURAS' || item.tdo_nombre == 'ABONO SIN NOTAS' ? item.abono_total*-1 :
                                  (factura_operativa - (ven_valor - (abono_total + devolucion + retencion_total + cruces + notasCredito))).toFixed(2) * 1;
                    
                    wsData.push([
                        item.empresa,
                        item.tdo_nombre,
                        item.punto_venta == 1 ? 'directa' : 'lista',
                        // item.idInstitucion || item.institucion_id,
                        item.nombreInstitucion,
                        item.cliente_facturado,
                        item.asesor,
                        subtotal.toFixed(2) * 1, // Convertir a número
                        ven_valor.toFixed(2) * 1,
                        abono_total.toFixed(2) * 1,
                        devolucion_bruta.toFixed(2) * 1,
                        devolucion.toFixed(2) * 1,
                        liquidaciones.toFixed(2) * 1,
                        retencion_total.toFixed(2) * 1,
                        cruces.toFixed(2) * 1,
                        item.tdo_nombre == 'NOTA DE CREDITO'?notasCredito.toFixed(2) * 1:0,
                        factura_operativa.toFixed(2) * 1,
                        saldo,
                        this.periodoSelect.descripcion,
                        this.empresaPlataforma ? this.empresaPlataforma.descripcion_corta || this.empresaPlataforma.nombre : 'N/A'
                    ]);

                    totalsubtotal += subtotal;
                    totalven_valor += ven_valor;
                    totalAbono += abono_total;
                    totalDevolucion += devolucion;
                    totalDevolucionBruta += devolucion_bruta;
                    totalSaldos += saldo;
                    totalRetencion += retencion_total;
                    totalLiquidaciones += liquidaciones;
                    totalCruces += cruces;
                    totalNotasCredito += (item.tdo_nombre == 'NOTA DE CREDITO' ? notasCredito : 0);
                    totalFacturaOperativa += factura_operativa;
                });

                // Agregar totales
                wsData.push(['', '', '', '', '', 'TOTAL:', totalsubtotal.toFixed(2) * 1, totalven_valor.toFixed(2) * 1, totalAbono.toFixed(2) * 1, totalDevolucionBruta.toFixed(2) * 1, totalDevolucion.toFixed(2) * 1, totalLiquidaciones.toFixed(2) * 1, totalRetencion.toFixed(2) * 1, totalCruces.toFixed(2) * 1, totalNotasCredito.toFixed(2) * 1, totalFacturaOperativa.toFixed(2) * 1, totalSaldos.toFixed(2) * 1]);
                // Agregar pie de página
                wsData.push(['']);
                return wsData;
            }
        },
        searchData() {
            let me = this
            me.arrayPuntoVenta = []
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
            me.$vs.loading()
            this.$http.get(this.$server_url + 'InstitucionesXCobranzas?busqueda=' + me.busqueda.puntoVenta + '&id_periodo=' + me.periodoSelect.idperiodoescolar)
                .then(function (res) {
                    me.$vs.loading.close()
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
        getInformacionClienteCobranza(dato) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getClienteCobranzaxInstitucion?institucion=' + dato + '&periodo=' + me.periodoSelect.idperiodoescolar)
                .then(res => {
                    me.listaUsuarios = res.data;
                    me.$vs.loading.close();

                })
                .catch(err => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
        getEmpresas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    if (me.usarComponenteNuevo) {
                        me.listaEmpresas = res.data.filter(
                            empresa => ![1, 2, 3].includes(empresa.id)
                        );
                    } else {
                        me.listaEmpresas = res.data.filter(empresa => empresa.id != 2);
                    }
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
        getClienteLocal() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getClienteLocal?nombre=' + me.busquedaClienteLocal)
                .then(res => {
                    me.datosClienteLocal = res.data;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
        async getClienteParametro() {
            let me = this;
            me.InsticionCobranza = '';
            me.Instituciones = [];
            me.validacionPerseoCompletadaNuevo = false;
            me.existeClientePerseoNuevo = false;
            me.documentoClienteEncontradoNuevo = '';
            me.mensajeValidacionClienteNuevo = '';
            me.colorValidacionClienteNuevo = 'warning';
            me.busquedaEnProcesoNuevo = false;
            me.documentoConsultadoNuevo = '';
            me.estadoPlataformaNuevo = 'pendiente';
            me.estadoPerseoNuevo = 'pendiente';

            if (!this.empresaCobranzaSelected) {
                me.$vs.notify({
                    text: 'No a seleccionado la empresa.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!me.busquedaCliente) {
                me.$vs.notify({
                    text: 'No a ingresado datos del cliente.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (!this.busquedaCliente || this.busquedaCliente.length < 10) {
                this.$vs.notify({
                    title: 'Error',
                    text: 'Ingrese un valor con al menos 10 caracteres',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            me.exiteDatos = false;
            let datos = {
                busqueda: me.busquedaCliente,
                empresa: me.empresaCobranza.id
            };

            me.$vs.loading();

            if (me.usarComponenteNuevo) {
                me.busquedaEnProcesoNuevo = true;
                me.documentoConsultadoNuevo = String(datos.busqueda);
                me.estadoPlataformaNuevo = 'consultando';
                me.estadoPerseoNuevo = 'consultando';
                let clienteLocal = await me.buscarClienteLocalFlexible(datos.busqueda);
                me.estadoPlataformaNuevo = clienteLocal ? 'encontrado' : 'no_encontrado';
                let clientePerseo = await me.buscarClientePerseoFlexible(datos.busqueda, me.empresaCobranza.id);
                me.estadoPerseoNuevo = clientePerseo ? 'encontrado' : 'no_encontrado';
                let docPerseo = me.obtenerDocumentoPerseo(clientePerseo);
                let docLocal = clienteLocal && clienteLocal.cedula ? clienteLocal.cedula : datos.busqueda;
                let coincide = me.documentosCoincidenFlexible(docLocal, docPerseo);

                me.validacionPerseoCompletadaNuevo = true;
                me.existeClientePerseoNuevo = (clientePerseo && coincide) ? true : false;

                if (clienteLocal && clientePerseo && coincide) {
                    let nombre = '';
                    let busquedaLimpia = String(datos.busqueda).replace(/\D/g, '');
                    let docLocalLimpio = String(docLocal).replace(/\D/g, '');
                    if (clienteLocal.nombres) {
                        nombre = clienteLocal.nombres + (clienteLocal.apellidos ? ' ' + clienteLocal.apellidos : '');
                    }
                    if (!nombre) {
                        nombre = me.obtenerNombrePerseo(clientePerseo);
                    }
                    me.datosCliente = [{
                        identificacion: docPerseo ? docPerseo : docLocal,
                        razonsocial: nombre != '' ? nombre : datos.busqueda,
                        clientesid: clienteLocal.idusuario ? clienteLocal.idusuario : 0,
                        clientesid_perseo: clientePerseo.clientesid ? clientePerseo.clientesid : 0,
                    }];
                    me.busquedaClienteAplicadaNuevo = datos.busqueda;
                    me.documentoClienteEncontradoNuevo = docLocal;
                    me.clienteSeleccionadoNuevo = me.datosCliente[0].razonsocial;
                    me.empresaSeleccionadaNuevo = me.nombreEmpresaSeleccionada;

                    if (busquedaLimpia.length == 13 && docLocalLimpio.length == 10) {
                        me.mensajeValidacionClienteNuevo = 'Cliente sin RUC en plataforma, encontrado con CI.';
                        me.colorValidacionClienteNuevo = 'warning';
                    } else if (busquedaLimpia.length == 10 && docLocalLimpio.length == 13) {
                        me.mensajeValidacionClienteNuevo = 'Cliente sin CI en plataforma, encontrado con RUC.';
                        me.colorValidacionClienteNuevo = 'warning';
                    } else {
                        me.mensajeValidacionClienteNuevo = 'Cliente validado en Perseo y plataforma';
                        me.colorValidacionClienteNuevo = 'success';
                    }

                    me.contadorBusquedasNuevo = me.contadorBusquedasNuevo + 1;
                    me.exiteDatos = true;
                    me.datoNoExistente = false;
                    me.arrayPuntoVenta = [];
                    me.$vs.loading.close();
                    me.busquedaEnProcesoNuevo = false;
                    return;
                }

                me.exiteDatos = false;
                me.arrayPuntoVenta = [];
                me.$vs.loading.close();
                me.busquedaEnProcesoNuevo = false;
                if (clienteLocal && !clientePerseo) {
                    me.$vs.notify({
                        title: 'Validacion',
                        text: 'Cliente encontrado en plataforma, pero no en Perseo.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                } else if (!clienteLocal && clientePerseo) {
                    me.$vs.notify({
                        title: 'Validacion',
                        text: 'Cliente encontrado en Perseo, pero no en plataforma.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                } else if (clienteLocal && clientePerseo && !coincide) {
                    me.$vs.notify({
                        title: 'Validacion',
                        text: 'Cliente existe en ambos sistemas, pero el documento no coincide por formato CI/RUC.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                } else {
                    me.$vs.notify({
                        title: 'Validacion',
                        text: 'No se encontro coincidencia valida entre plataforma y Perseo.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                }
                return;
            }

            this.$http.post(this.$server_url + 'api/perseo/clientes/clientes_consulta', datos)
                .then(function (res) {
                    // Mostrar indicador de ambiente - solo envía el ID de la empresa
                    // me.$store.dispatch('mostrarAmbienteEmpresa', me.empresaCobranza.id);

                    // Verificar si la respuesta contiene datos válidos
                    if (res.data && res.data['clientes'] && res.data['clientes'].length > 0) {
                        me.datosCliente = res.data['clientes'];
                        me.exiteDatos = true;
                        me.$vs.notify({
                            text: 'Búsqueda de cliente exitosa.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.datoNoExistente = false;
                        me.arrayPuntoVenta = [];
                    } else if (res.data && res.data.fault) {
                        // Manejar el caso donde la consulta no devuelve datos
                        me.$vs.notify({
                            text: res.data.fault.faultstring || 'No se encontraron datos en Perseo.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        me.getbusquedaClienteLocal(datos);
                        me.busquedaLocalDocumentos(datos);
                        me.datoNoExistente = true;
                    } else if (!res.data) {
                        // Manejar el caso donde la consulta no devuelve datos
                        me.$vs.notify({
                            text: 'Cliente no encontrado en perseo.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                        me.getbusquedaClienteLocal(datos);
                        me.busquedaLocalDocumentos(datos);
                        me.datoNoExistente = true;
                    } else {
                        // Manejar el caso donde la respuesta no es la esperada
                        me.$vs.notify({
                            text: 'Error inesperado en la respuesta.',
                            color: 'error',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                    }

                    // Cerrar el indicador de carga
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'Error al realizar la consulta: ' + (error.message || 'Error desconocido'),
                        color: 'error',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                    me.$vs.loading.close();
                });
        },
        getbusquedaClienteLocal(datos) {
            let me = this;
            me.datosCliente = [];
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getClienteLocal?cedula=' + datos.busqueda)
                .then(res => {
                    me.datosCliente = res.data;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    me.$vs.notify({
                        text: (error.message || 'Error al buscar cliente local'),
                        color: 'error',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                    me.$vs.loading.close();
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
        busquedaLocalDocumentos(datos) {
            let me = this;
            me.datosClienteLocal = [];
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getClienteLocalDocumentos?cedula=' + datos.busqueda + '&periodo=' + me.periodoSelect.idperiodoescolar + '&empresa=' + me.empresaCobranza.id)
                .then(res => {
                    me.datosClienteLocal = res.data;
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
        cambio(dato) {
            let me = this;
            if (!dato) {
                me.exiteDatos = false;
            } else {
                me.exiteDatos = false;
                setTimeout(() => {
                    me.exiteDatos = true;
                }, 200);
            }
        },
        InstitucionesXCobranzas(datoIdCliente) {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'InstitucionesXCobranzas?periodo=' + me.periodoSelect.idperiodoescolar + '&cliente=' + datoIdCliente + '&empresa=' + me.empresaCobranza.id)
                .then(function (res) {
                    // let datosPuntos = res.data.filter(punto => punto.punto_venta === 1);
                    // let datosInstitucion = res.data.filter(punto => punto.punto_venta === 0);
                    // me.Instituciones = [...new Map(datosInstitucion.map(item => [item.idInstitucion, item])).values()];
                    let datosInstitucion = res.data;
                    me.Instituciones = [...new Map(datosInstitucion.map(item => [item.idInstitucion, item])).values()];
                    if (datosInstitucion.length > 0) {
                        me.mostrarInstituciones = true;
                        me.$vs.notify({
                            text: 'Cliente con instituciones/puntos de venta.',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                    } else {
                        me.mostrarInstituciones = false;
                        me.exiteDatos = false;
                        me.$vs.notify({
                            text: 'Cliente sin instituciones/puntos de venta.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        });
                    }

                    // me.puntos = [...new Map(datosPuntos.map(item => [item.idInstitucion, item])).values()];
                    me.$vs.loading.close()
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user'
                        })
                    }
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'Cliente sin instituciones/puntos de veta.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    console.log(error + ' error');
                    me.$vs.notify({
                        text: 'Ocurrió un error al obtener los datos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    me.mostrarInstituciones = false;
                    me.exiteDatos = false;
                    me.$vs.loading.close()
                })
        },
    }
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
}

.orange {
    border-top: 3px solid hsl(34, 97%, 64%);
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

.panel-busqueda-nuevo {
    border: 1px solid #e9eef5;
    border-radius: 8px;
}

.nuevo-busqueda-meta {
    margin-top: 6px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    font-size: 11px;
}

.seleccion-activa-card {
    border: 1px solid #d8f2e2;
    border-left: 3px solid #28C76F;
    border-radius: 8px;
}

.seleccion-activa-title {
    font-weight: 600;
    color: #1e1e1e;
    margin-bottom: 6px;
    font-size: 13px;
}

.seleccion-activa-grid {
    display: grid;
    gap: 6px;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

/* Animación slide-fade simple */
.slide-fade-enter-active {
    transition: all 0.2s ease;
}

.slide-fade-leave-active {
    transition: all 0.15s ease;
}

.slide-fade-enter,
.slide-fade-leave-to {
    opacity: 0;
    max-height: 0;
}

/* Animación fade simple */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.15s ease;
}

.fade-enter,
.fade-leave-to {
    opacity: 0;
}
</style>
