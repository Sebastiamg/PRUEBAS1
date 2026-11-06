<template>
<vx-card fixed-height="true">
    <div>
        <vs-button v-if="userRoot" line-position="top" line-origin="left" color="success" type="line" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button>
        <vs-button v-if="userRoot || groupBodega" line-position="top" line-origin="left" color="warning" type="line" class="mr-2 flex-align-items" @click="getEdicionMasivaStock()">Edición Masiva de Stock</vs-button>
        <vs-button v-if="userRoot || groupBodega || userContabilidad" line-position="top" line-origin="left" color="gray" type="line" class="mr-2 flex-align-items" @click="getReporteProductos()">Reporte Productos</vs-button>
        <vs-button v-if="userRoot || groupBodega" line-position="top" line-origin="left" color="primary" type="line" class="mr-2 flex-align-items" @click="HistoricoEdicionMasivaStock()">Histórico Stock</vs-button>
        <vs-button v-if="userRoot" line-position="top" line-origin="left" color="rgb(100, 59, 202)" type="line" class="mr-2 flex-align-items" @click="abrirModalSincronizarPerseo()">
            <i class="feather icon-refresh-cw" style="margin-right: 5px;"></i>Vincular / Sincronizar Perseo
        </vs-button>
        <vs-button v-if="userRoot || AsisGerencia || groupBodega" color="dark" type="border" icon="info" @click="getInformacionProducto()" style="float: right" title="Información">Información</vs-button>
    </div>
    <vs-row vs-justify="flex-start">
        <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
            <p>Búsqueda por filtros</p>
            <br>
            <!-- NORMAL: {{ userFacturador }}
            ADMIN: {{ userAdminFacturador }} -->
            <vs-card class="seccionmostrartodo">
                <div>
                    <vs-input v-if="valorBusqueda != '2' && valorBusqueda != '3'" class="w-full" @keyup.enter="getProductoParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;" icon="search" placeholder="Buscar" v-model="busquedaxcodigo" />
                </div>
                <div>
                    <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                        <li class="modelx">
                        </li>
                        <li style="margin:10px 20px 0px 0px;">
                            <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='codigopro'">Iniciales</vs-radio>
                        </li>
                        <li style="margin:10px 10px 0px 0px;">
                            <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda" @input="busqueda='nombres'">Nombres</vs-radio>
                        </li>
                        <li style="margin:10px 10px 0px 0px;" v-if="userRoot || AsisGerencia || groupBodega">
                            <vs-radio vs-name="radios2" vs-value="2" v-model="valorBusqueda" @input="getProductos_inactivos()">Mostrar inactivos</vs-radio>
                        </li>
                        <li style="margin:10px 10px 0px 0px;" v-if="userRoot || AsisGerencia || groupBodega">
                            <vs-radio vs-name="radios2" vs-value="3" v-model="valorBusqueda" @input="getProductos_stockminimo()">Productos con stock menor al mínimo</vs-radio>
                        </li>
                        <li>
                            <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getProductoParametro();" icon="search"></vs-button>
                        </li>
                    </ul>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <vs-button color="success" @click="exportarCombos" icon="icon-download" icon-pack="feather" class="mt-3" v-if="Productos.length > 0">
      Exportar Excel
    </vs-button>
    <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
    <vs-table max-items="10" stripe pagination search :data="Productos">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ Productos.length }}</b></vs-chip>
        </template>
        <!-- {{cliCi}} -->
        <template slot="thead">
            <vs-th width="100">
                Código
            </vs-th>
            <vs-th colspan="2" width="500" style="text-align: center">
                Información Producto
            </vs-th>
            <vs-th>Estado</vs-th>
            <vs-th width="100" v-if="userRoot || AsisGerencia || groupBodega">
                Acciones
            </vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].pro_codigo">
                    {{ data[indextr].pro_codigo }}
                </vs-td>
                <vs-td>
                   <!--   {{ tr }}-->
                    <small><b>Grupo:</b> {{tr.gru_pro_nombre}} </small><br>
                    <small><b>Nombres:</b> {{tr.pro_nombre}}</small><br>
                    <small><b>Descripción:</b> {{tr.pro_descripcion}}</small><br>
                    <small v-if="tr.id_pro_codigo_padre"><b>Producto padre:</b> {{tr.id_pro_codigo_padre}} - {{ tr.nombre_producto_padre }} <br></small>
                    <small v-if="tr.grupo_codigo_para_v3"><b>Grupo para vue 3:</b> {{tr.nombre_grupo_v3}} <br></small>
                    <small v-if="tr.codigos_combos"><b>Códigos del combo:</b> {{tr.codigos_combos}}</small>
                    <div v-if="userRoot || AsisGerencia || groupBodega">
                        <small><b>Iva:</b>
                            <template v-if="data[indextr].pro_iva == 1">
                                Si
                            </template>
                            <template v-else-if="data[indextr].pro_iva == 0">
                                No
                            </template>
                            <template v-else-if="data[indextr].pro_iva == null">
                                Vacio
                            </template>
                        </small><br>
                    </div>
                    <div v-if="userRoot || AsisGerencia || groupBodega">
                        <small><b>Valor:</b> {{tr.pro_valor}}</small><br>
                    </div>
                    <div v-if="userRoot || AsisGerencia || groupBodega">
                        <small><b>Descuento:</b> {{tr.pro_descuento}}</small><br>
                    </div>
                    <div v-if="userRoot || AsisGerencia || groupBodega">
                        <small><b>Peso:</b> {{tr.pro_peso}}</small><br>
                    </div>
                </vs-td>
                <vs-td>
                    <div v-if="userRoot || AsisGerencia || groupBodega|| userContabilidad">
                      <small><b>Costo:</b> {{tr.pro_costo}}</small>
                    </div>
                    <div v-if="tr.gru_pro_codigo == 1">
                      <small><b>Serie:</b> {{tr.nombre_serie}}</small><br>
                    </div>
                    <small :class="getStockClass(tr.pro_reservar, 1)">Stock General: {{ tr.pro_reservar }}</small><br>
                    <!-- <small :class="getStockClass(tr.pro_stock, 2)">Stock Facturas Prolipa: {{ tr.pro_stock }}</small><br> -->
                    <!-- <small :class="getStockClass(tr.pro_deposito, 4)">Stock Notas Prolipa: {{ tr.pro_deposito }}</small><br> -->
                    <small :class="getStockClass(tr.pro_stockCalmed, 3)">Stock Facturas Calmed: {{ tr.pro_stockCalmed }}</small><br>
                    <!-- <small :class="getStockClass(tr.pro_depositoCalmed, 5)">Stock Notas Calmed: {{ tr.pro_depositoCalmed }}</small><br> -->
                </vs-td>
                <vs-td>
                    <vs-chip v-if="tr.pro_estado == 1" color="success">Activo</vs-chip>
                    <vs-chip v-else color="danger">Inactivo</vs-chip>
                </vs-td>
                <vs-td :data="data[indextr].pro_codigo" v-if="userRoot || AsisGerencia || groupBodega || userContabilidad">
                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu style="width: 250px;" class="cursor">
                            <vs-dropdown-item>
                                <vs-button v-if="tr.pro_estado == 1 && !userContabilidad" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;getEditar(tr)">Editar</vs-button>
                                <vs-button color="primary" type="line" class="w-full" @click="popupActivo=true;verHistoricoIndividual(tr)">
                                    <i class="feather icon-bar-chart-2" style="margin-right: 5px;"></i>Histórico
                                </vs-button>
                                <vs-button v-if="tr.pro_estado == 1 && !userContabilidad" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_producto(tr)">Desactivar producto</vs-button>
                                <vs-button v-if="tr.pro_estado == 0 && !userContabilidad" color="#28C76F" type="line" class="w-full" @click="popupActivo=true;popup_desactivar_activar_producto(tr)">Activar producto</vs-button>
                                <vs-button v-if="!userContabilidad" color="#EA5455" type="line" class="w-full" @click="popupActivo=true;getPreguntaEliminar(tr)">Eliminar</vs-button>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <!-- SECCION REGISTRO -->
    <vs-popup class="crear" title="Registro nuevo producto" :active.sync="popupActivoGuardar">
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Producto</b></vs-col>
            <vs-col v-if="requiereProductoPadre(tabProducto.gru_pro_codigo)" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
              <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-justify="center" vs-align="center" vs-w="11">
                    <font style="font-size: 11.5px">&nbsp;Producto padre</font><br>
                    <v-select :options="arrayTextosSinCombos" :reduce="arrayTextosSinCombos => arrayTextosSinCombos.pro_codigo" label="pro_codigo_nombre" class="w-full h-100" :class="{ 'input-error': errorPadreGuardar }" placeholder="--Seleccione--" v-model="tabProducto.id_pro_codigo_padre" />
                    <span v-if="errorPadreGuardar" style="color: red; font-size: 11.5px;">Seleccione un producto padre</span>
                    <small class="text-danger">No seleccionar si es un producto padre como manantial lengua 2 (solo si es folleto, cuaderno, guia)</small>
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <font style="font-size: 11.5px">&nbsp;Grupo:</font><br>
                        <v-select :options="Grupos" :reduce="Grupos => Grupos.gru_pro_codigo" label="gru_pro_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProducto.gru_pro_codigo" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Código del producto " maxlength="7" placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabProducto.pro_codigo" @input="convertirAMayusculas()" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
              <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-justify="center" vs-align="center" vs-w="10">
                    <font style="font-size: 11.5px">&nbsp;Grupo para v3</font><br>
                        <v-select :options="Grupos" :reduce="Grupos => Grupos.gru_pro_codigo" label="gru_pro_nombre" class="w-full h-100" :class="{ 'input-error': errorGrupoV3Guardar }" placeholder="--Seleccione--" v-model="tabProducto.grupo_codigo_para_v3" @input="handleSelectInputGuardar" />
                    <span v-if="errorGrupoV3Guardar" style="color: red; font-size: 11.5px;">Seleccione un grupo para v3</span>
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col v-if="tabProducto.gru_pro_codigo === 1 || tabProducto.gru_pro_codigo === 3 || tabProducto.gru_pro_codigo === 6" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">&nbsp;Serie</font><br>
                        <v-select :options="series" :reduce="series => series.id_serie" label="nombre_serie" placeholder="--Seleccione--" class="w-full" v-model="tabProducto.id_serie" />
                        <span v-if="!tabProducto.id_serie" style="color: red; font-size: 11.5px;">Este campo es obligatorio</span>
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Nombre " placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabProducto.pro_nombre" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Descripción " placeholder="Descripción" class="w-full" icon="mode_edit" v-model="tabProducto.pro_descripcion" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <!-- <vs-input label="Iva *" type="number" placeholder="Iva" class="w-full" icon="mode_edit" v-model="tabProducto.proIva" /> -->
                        <font style="font-size: 11.5px">&nbsp;IVA *</font><br>
                        <v-select :options="options1" :reduce="options1 => options1.value" label="text" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProducto.pro_iva" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Valor " type="number" placeholder="Valor" class="w-full" icon="mode_edit" v-model="tabProducto.pro_valor" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <font style="font-size: 11.5px; display: inline-flex;">&nbsp;Descuento * &emsp; Formato: 0.00</font><br>
                        <vs-input type="number" id="pro-descuento-input" placeholder="Descuento" class="w-full" icon="mode_edit" v-model="tabProducto.pro_descuento" @keypress="validarDescuento" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Costo " type="number" placeholder="Costo" class="w-full" icon="mode_edit" v-model="tabProducto.pro_costo" @keypress="validarCosto" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Peso " type="number" placeholder="Peso" class="w-full" icon="mode_edit" v-model="tabProducto.pro_peso" @keypress="validarPeso" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <!-- <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center; margin-top: 10px;"><b>Bodega Prolipa</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <vs-input label="Stock Facturas" type="number" placeholder="Stock Facturas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_stock" @keypress="validarStock" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <vs-input label="Stock Notas" type="number" placeholder="Stock Notas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_deposito" @keypress="validarStock" />
                    </vs-col>
                </vs-row>
            </vs-col> -->
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center; margin-top: 10px;"><b>Bodega Calmed</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <vs-input label="Stock Facturas" type="number" placeholder="Stock Facturas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_stockCalmed" @keypress="validarStock" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <vs-input label="Stock Notas" type="number" placeholder="Stock Notas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_depositoCalmed" @keypress="validarStock" />
                    </vs-col>
                </vs-row>
            </vs-col> -->
        </vs-row>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <!-- SECCION EDITAR -->
    <!-- <vs-popup class="editar" :title="`Edición producto: ${tabProducto.pro_codigo}`" :active.sync="popupActivoEditar"> -->
    <vs-popup class="editar" :title="`Edición producto`" :active.sync="popupActivoEditar">
        <vs-row>
            <!-- {{ tabProducto }} -->
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;">
                <b>Información Producto</b>
            </vs-col>
            <vs-col v-if="requiereProductoPadre(tabProducto.gru_pro_codigo)" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
              <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-justify="center" vs-align="center" vs-w="11">
                    <font style="font-size: 11.5px">&nbsp;Producto padre</font><br>
                    <v-select :options="arrayTextosSinCombos" :reduce="arrayTextosSinCombos => arrayTextosSinCombos.pro_codigo" label="pro_codigo_nombre" class="w-full h-100" :class="{ 'input-error': errorPadreEditar }" placeholder="--Seleccione--" v-model="tabProducto.id_pro_codigo_padre" />
                    <span v-if="errorPadreEditar" style="color: red; font-size: 11.5px;">Seleccione un producto padre</span>
                    <small class="text-danger">No seleccionar si es un producto padre como manantial lengua 2 (solo si es folleto, cuaderno, guia)</small>
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <font style="font-size: 11.5px">&nbsp;Grupo</font><br>
                        <v-select :options="Grupos" :reduce="Grupos => Grupos.gru_pro_codigo" label="gru_pro_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProducto.gru_pro_codigo" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Codigo de producto" placeholder="Codigo" class="w-full" icon="mode_edit" v-model="tabProducto.pro_codigo" readonly />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
              <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                <vs-col vs-justify="center" vs-align="center" vs-w="10">
                    <font style="font-size: 11.5px">&nbsp;Grupo para v3</font><br>
                    <v-select :options="Grupos" :reduce="Grupos => Grupos.gru_pro_codigo" label="gru_pro_nombre" class="w-full h-100" :class="{ 'input-error': errorGrupoV3Editar }" placeholder="--Seleccione--" v-model="tabProducto.grupo_codigo_para_v3" @input="handleSelectInputEditar" />
                    <span v-if="errorGrupoV3Editar" style="color: red; font-size: 11.5px;">Seleccione un grupo para v3</span>
                </vs-col>
              </vs-row>
            </vs-col>
            <vs-col v-if="tabProducto.gru_pro_codigo === 1 || tabProducto.gru_pro_codigo === 3 || tabProducto.gru_pro_codigo === 6" vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">&nbsp;Serie</font><br>
                        <v-select :options="series" :reduce="series => series.id_serie" label="nombre_serie" placeholder="--Seleccione--" class="w-full" v-model="tabProducto.id_serie" />
                        <span v-if="!tabProducto.id_serie" style="color: red; font-size: 11.5px;">Este campo es obligatorio</span>
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Nombre " placeholder="Nombre" class="w-full" icon="mode_edit" v-model="tabProducto.pro_nombre" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Descripción " placeholder="Descripción" class="w-full" icon="mode_edit" v-model="tabProducto.pro_descripcion" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <!-- <vs-input label="Iva *" type="number" placeholder="Iva" class="w-full" icon="mode_edit" v-model="tabProducto.proIva" /> -->
                        <font style="font-size: 11.5px">&nbsp;IVA *</font><br>
                        <v-select :options="options1" :reduce="options1 => options1.value" label="text" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProducto.pro_iva" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Valor " type="number" placeholder="Valor" class="w-full" icon="mode_edit" v-model="tabProducto.pro_valor" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <font style="font-size: 11.5px; display: inline-flex;">&nbsp;Descuento * &emsp; Formato: 0.00</font><br>
                        <vs-input type="number" id="pro-descuento-input" placeholder="Descuento" class="w-full" icon="mode_edit" v-model="tabProducto.pro_descuento" @keypress="validarDescuento" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Costo " type="number" placeholder="Costo" class="w-full" icon="mode_edit" v-model="tabProducto.pro_costo" @keypress="validarCosto" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Peso " type="number" placeholder="Peso" class="w-full" icon="mode_edit" v-model="tabProducto.pro_peso" @keypress="validarPeso" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <!-- <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center; margin-top: 10px;"><b>Bodega Prolipa</b></vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="Stock Facturas" type="number" placeholder="Stock Facturas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_stock" @keypress="validarStock" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="Stock Notas" type="number" placeholder="Stock Notas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_deposito" @keypress="validarStock" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center; margin-top: 10px;"><b>Bodega Calmed</b></vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="Stock Facturas" type="number" placeholder="Stock Facturas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_stockCalmed" @keypress="validarStock" />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="10">
                                <vs-input label="Stock Notas" type="number" placeholder="Stock Notas" class="w-full" icon="mode_edit" v-model="tabProducto.pro_depositoCalmed" @keypress="validarStock" />
                            </vs-col>
                        </vs-row>
                    </vs-col> -->
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center; margin-top: 10px;"><b>El stock de los productos se debe actualizar en la sección de<br> "Edición Stock Masiva"</b></vs-col>
        </vs-row>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar el registro: ${pro_codigo} - ${pro_nombre}?`" :active.sync="popupActivoEliminar">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado del producto: ${pro_codigo}?`" :active.sync="popupActivoDesactivar">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="desactivar_activar_producto()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <!-- SECCION INFORMACIÓN -->
    <vs-popup class="informacionformhijo" @close="getConfiguracion()" title="Información" :active.sync="popupInformacionProducto">
        <Informacion_Producto v-if="popupInformacionProducto" :arrayConfiguration="arrayConfiguration" :popupInformacionProducto="popupInformacionProducto" @change="changeHandleInformacionProducto" />
    </vs-popup>
    <!-- SECCION EDICION MASIVA STOCK -->
    <vs-popup class="informacionformhijo" fullscreen @close="getConfiguracion()" title="Edición Masiva de Stock" :active.sync="popupEdicionMasivaStock">
        <EditMasivaPorducto_Producto v-if="popupEdicionMasivaStock" :arrayConfiguration="arrayConfiguration" :popupEdicionMasivaStock="popupEdicionMasivaStock" @change="changeHandleEdicionMasivaStock" />
    </vs-popup>
    <!-- SECCION REPORTE PRODUCTOS -->
    <vs-popup class="informacionformhijo" fullscreen @close="getConfiguracion()" title="Reportes de Productos" :active.sync="popupReporteProductos">
        <ReporteProductosGeneral v-if="popupReporteProductos" @change="changeHandleReporteProductos" />
    </vs-popup>
    </vs-popup>
    <!-- SECCION HISTORICO EDICION MASIVA STOCK -->
    <vs-popup class="informacionformhijo" fullscreen @close="getConfiguracion()" title="Histórico Stock" :active.sync="popupHistoricoEdicionMasivaStock">
        <EditMasivaPorducto_ProductoHistorico v-if="popupHistoricoEdicionMasivaStock" :arrayConfiguration="arrayConfiguration" @change="changeHandleHistoricoEdicionMasivaStock" />
    </vs-popup>
    <!-- SECCION HISTORICO INDIVIDUAL PRODUCTO -->
    <vs-popup class="informacionformhijo" fullscreen :title="`Historico de Stock - ${productoHistoricoSeleccionado.pro_codigo} ${productoHistoricoSeleccionado.pro_nombre}`" :active.sync="popupHistoricoIndividual">
        <div v-if="popupHistoricoIndividual" style="padding: 20px; background: #f5f5f5;">
            <!-- HEADER CON FILTROS Y BÚSQUEDA -->
            <vs-row vs-justify="space-between" style="margin-bottom: 20px; background: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <vs-col vs-w="4" style="padding-right: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                        <i class="feather icon-search" style="margin-right: 5px;"></i>Buscar:
                    </label>
                    <vs-input 
                        v-model="filtroHistoricoIndividual.busqueda" 
                        placeholder="Buscar por usuario, referencia..." 
                        style="width: 100%;"
                    />
                </vs-col>
                <vs-col vs-w="3" style="padding-right: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                        <i class="feather icon-folder" style="margin-right: 5px;"></i>Tipo de Movimiento:
                    </label>
                    <select v-model="filtroHistoricoIndividual.tipo" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                        <option value="">Todos los tipos</option>
                        <option value="0">Textos y Guías Edición Masiva</option>
                        <option value="1">Combos Edición Masiva</option>
                        <option value="2">Movimiento Ingreso</option>
                        <option value="3">Movimiento Egreso</option>
                        <option value="4">Venta</option>
                        <option value="5">Pedido Guías anuladas</option>
                        <option value="6">Compra orden producción</option>
                        <option value="7">Edición orden producción</option>
                        <option value="8">Mover a Depósito CALMED</option>
                        <option value="9">Devolución documentos</option>
                        <option value="10">Igualar venta-proforma</option>
                        <option value="11">Anulación pedido</option>
                        <option value="12">Devolución Sueltos</option>
                        <option value="13">Pedido Guías</option>
                        <option value="14">Devolución Guías</option>
                        <option value="15">Anulación venta</option>
                    </select>
                </vs-col>
                <vs-col vs-w="2" style="padding-right: 10px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 600; color: #333;">
                        <i class="feather icon-bar-chart" style="margin-right: 5px;"></i>Movimiento:
                    </label>
                    <select v-model="filtroHistoricoIndividual.movimiento" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 5px;">
                        <option value="">Todos</option>
                        <option value="entrada">Entradas (+)</option>
                        <option value="salida">Salidas (-)</option>
                    </select>
                </vs-col>
                <vs-col vs-w="3" style="display: flex; align-items: flex-end; gap: 10px;">
                    <vs-button color="success" @click="exportarHistoricoIndividual" icon="icon-download" icon-pack="feather" style="flex: 1;">
                        Exportar
                    </vs-button>
                    <vs-button color="primary" @click="limpiarFiltrosHistorico" icon="icon-refresh-cw" icon-pack="feather" style="flex: 1;">
                        Limpiar
                    </vs-button>
                </vs-col>
            </vs-row>

            <!-- INFORMACIÓN DEL PRODUCTO -->
            <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <vs-row>
                    <vs-col vs-w="3">
                        <strong><i class="feather icon-package" style="margin-right: 5px;"></i>Producto:</strong> {{ productoHistoricoSeleccionado.pro_codigo }}
                    </vs-col>
                    <vs-col vs-w="6">
                        <strong><i class="feather icon-file-text" style="margin-right: 5px;"></i>Nombre:</strong> {{ productoHistoricoSeleccionado.pro_nombre }}
                    </vs-col>
                    <vs-col vs-w="3" style="text-align: right;">
                        <strong><i class="feather icon-list" style="margin-right: 5px;"></i>Total Registros:</strong> {{ historicoFiltrado.length }}
                    </vs-col>
                </vs-row>
            </div>

            <!-- TABLA ESTILO KARDEX CONTABLE -->
            <div style="background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                <div style="overflow-x: auto; max-height: calc(100vh - 350px);">
                    <table style="width: 100%; border-collapse: collapse; font-size: 12px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
                        <thead style="background: #3e5062eb; color: white; position: sticky; top: 0; z-index: 10;">
                            <tr>
                                <th style="padding: 12px 8px; text-align: center; border: 1px solid #34495e; min-width: 100px;">Fecha</th>
                                <th style="padding: 12px 8px; text-align: left; border: 1px solid #34495e; min-width: 150px;">Usuario</th>
                                <th style="padding: 12px 8px; text-align: left; border: 1px solid #34495e; min-width: 200px;">Tipo de Movimiento</th>
                                <th style="padding: 12px 8px; text-align: center; border: 1px solid #34495e; background: #34495e; min-width: 80px;">Entrada</th>
                                <th style="padding: 12px 8px; text-align: center; border: 1px solid #34495e; background: #34495e; min-width: 80px;">Salida</th>
                                <th style="padding: 12px 8px; text-align: center; border: 1px solid #34495e; background: #1abc9c; min-width: 100px;">Stock General</th>
                                <th style="padding: 12px 8px; text-align: left; border: 1px solid #34495e; min-width: 150px;">Referencia</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-if="historicoFiltrado.length === 0">
                                <td colspan="7" style="padding: 40px; text-align: center; color: #999; border: 1px solid #ecf0f1;">
                                    <div style="font-size: 48px; margin-bottom: 10px;">
                                        <i class="feather icon-inbox" style="font-size: 48px; color: #bdc3c7;"></i>
                                    </div>
                                    No se encontraron registros con los filtros aplicados
                                </td>
                            </tr>
                            <tr v-for="(tr, indextr) in historicoFiltrado" :key="indextr" 
                                :style="{ 
                                    background: indextr % 2 === 0 ? '#ffffff' : '#f8f9fa'
                                }">
                                <td style="padding: 10px 8px; text-align: center; border: 1px solid #ecf0f1; white-space: nowrap; font-size: 11px;">
                                    {{ tr.fecha }}
                                </td>
                                <td style="padding: 10px 8px; border: 1px solid #ecf0f1; font-size: 11px;">
                                    {{ tr.usuario }}
                                </td>
                                <td style="padding: 10px 8px; border: 1px solid #ecf0f1;">
                                    <span :style="{
                                        display: 'inline-block',
                                        padding: '3px 8px',
                                        borderRadius: '4px',
                                        fontSize: '10px',
                                        fontWeight: '500',
                                        background: getTipoColorBg(tr.tipo),
                                        color: getTipoColorText(tr.tipo),
                                        border: '1px solid ' + getTipoColorBorder(tr.tipo)
                                    }">
                                        {{ tr.tipo_texto }}
                                    </span>
                                </td>
                                <!-- Entrada -->
                                <td style="padding: 10px 8px; text-align: center; border: 1px solid #ecf0f1; background: #f0fff4;">
                                    <span v-if="tr.diferencia_calmed > 0" style="color: #16a085; font-weight: 700; font-size: 13px;">
                                        {{ tr.diferencia_calmed }}
                                    </span>
                                    <span v-else style="color: #bdc3c7;">-</span>
                                </td>
                                <!-- Salida -->
                                <td style="padding: 10px 8px; text-align: center; border: 1px solid #ecf0f1; background: #fff5f5;">
                                    <span v-if="tr.diferencia_calmed < 0" style="color: #c0392b; font-weight: 700; font-size: 13px;">
                                        {{ Math.abs(tr.diferencia_calmed) }}
                                    </span>
                                    <span v-else style="color: #bdc3c7;">-</span>
                                </td>
                                <!-- Stock General (Saldo) -->
                                <td style="padding: 10px 8px; text-align: center; border: 1px solid #ecf0f1; background: #e8f8f5; font-weight: 700; font-size: 14px; color: #16a085;">
                                    {{ tr.reservar_nuevo !== null && tr.reservar_nuevo !== 'N/A' ? tr.reservar_nuevo : '-' }}
                                </td>
                                <td style="padding: 10px 8px; border: 1px solid #ecf0f1; font-size: 11px; color: #7f8c8d;">
                                    {{ tr.referencia }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <vs-row vs-justify="center" style="margin-top: 20px;">
                <vs-button @click="cerrarHistoricoIndividual()" color="danger" type="relief">Cerrar</vs-button>
            </vs-row>
        </div>
    </vs-popup>
    <!-- SECCION SINCRONIZAR PERSEO -->
    <vs-popup fullscreen class="sincronizarPerseo" title="🔄 Vincular / Sincronizar Perseo" :active.sync="popupSincronizarPerseo">
        <div style="padding: 10px;">
            <!-- PANEL UNIFICADO SIMPLE -->
            <div style="padding: 15px; border: 2px solid #7c3aed; border-radius: 8px; background: #f3e8ff; margin-bottom: 15px;">
                <h3 style="color: #6d28d9; margin-bottom: 10px; font-size: 16px;">🎯 Panel de Vincular IDs y Stock</h3>
                <p style="font-size: 12px; color: #555; margin-bottom: 15px;">Selecciona empresa, consulta TODO, y luego edita solo lo que necesites.</p>

                <vs-row vs-justify="space-between" style="gap: 10px;">
                    <vs-col vs-w="8" vs-sm="12">
                        <v-select
                            :options="[
                                { label: 'Empresa 1 - Prolipa', value: 1 },
                                { label: 'Empresa 3 - Calmed', value: 3 },
                                { label: 'Empresa 4 - Calmed 2026', value: 4 },
                                { label: 'Empresa 5 - Prolipa 2026', value: 5 }
                            ]"
                            :reduce="item => item.value"
                            label="label"
                            class="w-full"
                            v-model="panelUnificado.empresaSeleccionada"
                            placeholder="Selecciona empresa"
                        />
                    </vs-col>
                    <vs-col vs-w="4" vs-sm="12">
                        <vs-button
                            :disabled="sincronizandoPerseo || panelUnificado.empresaSeleccionada === null"
                            @click="consultarUnificado()"
                            color="rgb(124, 58, 237)"
                            type="relief"
                            class="w-full"
                        >
                            {{ sincronizandoPerseo ? '⏳ Consultando...' : '🔍 Consultar TODO' }}
                        </vs-button>
                    </vs-col>
                </vs-row>
            </div>

            <!-- RESULTADO Y EDITOR UNIFICADO -->
            <div v-if="resultadoSincronizacion && resultadoSincronizacion.status === 1" style="padding: 15px; border: 1px solid #86efac; border-radius: 8px; background: #f0fdf4;">
                <p style="font-weight: bold; color: #166534; margin-bottom: 15px;">✅ Consulta completada - {{ resultadoSincronizacion.empresa }}</p>

                <!-- RESUMEN KPI -->
                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 10px; margin-bottom: 15px;">
                    <div style="padding: 8px; background: #ecfdf3; border-radius: 6px; font-size: 12px;">
                        <b style="color: #166534;">📊 Total Plataforma:</b> {{ resultadoSincronizacion.kpis.plataforma_total }}
                    </div>
                    <div style="padding: 8px; background: #ecfdf3; border-radius: 6px; font-size: 12px;">
                        <b style="color: #166534;">🔗 Encontrados:</b> {{ resultadoSincronizacion.kpis.encontrados_codigo }}
                    </div>
                    <div style="padding: 8px; background: #fef3c7; border-radius: 6px; font-size: 12px;">
                        <b style="color: #92400e;">⚠️ Candidatos a actualizar:</b> {{ resultadoSincronizacion.kpis.candidatos_actualizacion }}
                    </div>
                </div>

                <!-- INFO CANDIDATOS -->
                <div style="padding: 10px; background: #e0e7ff; border-left: 4px solid #6366f1; margin-bottom: 15px; border-radius: 4px; font-size: 12px;">
                    <b>❓ ¿Qué significa "Candidatos"?</b>
                    <br>Son productos que <b>PUEDES actualizar</b> porque se encontraron en Perseo.
                    <br>Marca los que quieres guardar debajo y haz clic en "Guardar Seleccionados".
                </div>

                <!-- TABLA EDITORA UNIFICADA -->
                <div style="overflow-x: auto;">
                    <table style="width: 100%; font-size: 11px; border-collapse: collapse; background: #ffffff;">
                        <thead>
                            <tr style="background: #ecfdf3; border-bottom: 2px solid #86efac;">
                                <th style="padding: 8px; text-align: center;">📌 ID</th>
                                <th style="padding: 8px; text-align: center;">📦 Stk</th>
                                <th style="padding: 8px; text-align: left;">Código</th>
                                <th style="padding: 8px; text-align: left;">ID Local</th>
                                <th style="padding: 8px; text-align: left;">Stock Local</th>
                                <th style="padding: 8px; text-align: left; background: #fef3c7;">📌 ID Perseo (Nuevo)</th>
                                <th style="padding: 8px; text-align: left; background: #fef3c7;">📦 Stock Total (Nuevo)</th>
                                <th style="padding: 8px; text-align: left;">Estado</th>
                                <th style="padding: 8px; text-align: center;">Consulta</th>
                            </tr>
                        </thead>
                        <tbody v-if="detalleSincronizacionEditable.length > 0">
                            <tr v-for="(item, idx) in detalleSincronizacionEditable" :key="'row-'+idx" style="border-bottom: 1px solid #e5e7eb;">
                                <td style="padding: 6px; text-align: center;">
                                    <input type="checkbox" v-model="item.aplicar_id" true-value="1" false-value="0" :disabled="item.candidato !== 1" />
                                </td>
                                <td style="padding: 6px; text-align: center;">
                                    <input type="checkbox" v-model="item.aplicar_stock" true-value="1" false-value="0" :disabled="item.candidato !== 1" />
                                </td>
                                <td style="padding: 6px;"><b>{{ item.pro_codigo }}</b></td>
                                <td style="padding: 6px;">{{ item.id_perseo_local }}</td>
                                <td style="padding: 6px;">{{ item.pro_stock_local }}</td>
                                <td style="padding: 6px; background: #fffbeb;">
                                    <input
                                        v-if="item.candidato === 1"
                                        type="number"
                                        v-model.number="item.productosid_perseo_edit"
                                        style="width: 100%; padding: 4px; border: 1px solid #fbbf24; border-radius: 4px;"
                                    />
                                    <span v-else style="color: #999;">-</span>
                                </td>
                                <td style="padding: 6px; background: #fffbeb;">
                                    <input
                                        v-if="item.candidato === 1"
                                        type="number"
                                        v-model.number="item.existenciastotales_edit"
                                        style="width: 100%; padding: 4px; border: 1px solid #fbbf24; border-radius: 4px;"
                                    />
                                    <span v-else style="color: #999;">-</span>
                                </td>
                                <td style="padding: 6px; font-size: 10px;">
                                    <span v-if="item.candidato === 1" style="background: #dcfce7; color: #166534; padding: 2px 6px; border-radius: 3px;">✓ Candidato</span>
                                    <span v-else style="background: #fecaca; color: #991b1b; padding: 2px 6px; border-radius: 3px;">✗ No actualizar</span>
                                </td>
                                <td style="padding: 6px; text-align: center;">
                                    <vs-button
                                        size="small"
                                        type="border"
                                        color="primary"
                                        :disabled="sincronizandoPerseo || item.consultando_perseo === 1"
                                        @click="consultarProductoIndividualPerseo(item)"
                                    >
                                        {{ item.consultando_perseo === 1 ? 'Consultando...' : 'Consultar' }}
                                    </vs-button>
                                </td>
                            </tr>
                        </tbody>
                        <tbody v-else>
                            <tr>
                                <td colspan="10" style="text-align: center; padding: 15px; color: #666;">No hay datos para mostrar</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <!-- BOTONES ACCIONES -->
                <div style="display: flex; gap: 10px; margin-top: 15px; flex-wrap: wrap; justify-content: space-between;">
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <vs-button
                            type="border"
                            color="primary"
                            @click="marcarTodosIDs()"
                        >
                            ✓ Marcar IDs
                        </vs-button>
                        <vs-button
                            type="border"
                            color="primary"
                            @click="desmarcarTodosIDs()"
                        >
                            ✗ Desmarcar IDs
                        </vs-button>
                        <vs-button
                            type="border"
                            color="success"
                            @click="marcarTodosStock()"
                        >
                            ✓ Marcar Stock
                        </vs-button>
                        <vs-button
                            type="border"
                            color="success"
                            @click="desmarcarTodosStock()"
                        >
                            ✗ Desmarcar Stock
                        </vs-button>
                    </div>
                    <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                        <vs-button
                            :disabled="sincronizandoPerseo || cantidadIdsSeleccionados() < 1"
                            color="primary"
                            type="relief"
                            @click="guardarSeleccionadosID()"
                        >
                            💾 Guardar {{ cantidadIdsSeleccionados() }} ID(s)
                        </vs-button>
                        <vs-button
                            :disabled="sincronizandoPerseo || cantidadStockSeleccionados() < 1"
                            color="success"
                            type="relief"
                            @click="guardarSeleccionadosStock()"
                        >
                            💾 Guardar {{ cantidadStockSeleccionados() }} Stock
                        </vs-button>
                    </div>
                </div>
            </div>

            <div v-else-if="resultadoSincronizacion && resultadoSincronizacion.status !== 1" style="padding: 15px; border: 1px solid #fca5a5; border-radius: 8px; background: #fef2f2;">
                <p style="color: #991b1b; font-weight: bold;">❌ Error: {{ resultadoSincronizacion.mensaje }}</p>
            </div>
            <!-- Botón cerrar -->
            <vs-row vs-justify="center" style="margin-top: 20px;">
                <vs-button @click="cerrarSincronizacionPerseo()" color="danger" type="relief">Cerrar</vs-button>
            </vs-row>
        </div>
    </vs-popup>
</vx-card>
</template>

<script>
import {
    mapState
} from 'vuex';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select';
import Codigosmix from "@/mixins/Codigosmix";
const Informacion_Producto = () => import("@/views/facturacion/10_10_1_4/orden_pedido/producto_crud_informacion.vue");
const EditMasivaPorducto_Producto = () => import("@/views/facturacion/10_10_1_4/orden_pedido/ediciones_stock_masiva/producto_edicionstockmasiva.vue");
const EditMasivaPorducto_ProductoHistorico = () => import("@/views/facturacion/10_10_1_4/orden_pedido/ediciones_stock_masiva/producto_edicionstockmasivahistorico.vue");
const ReporteProductosGeneral = () => import("@/views/facturacion/10_10_1_4/orden_pedido/components/screen_reportes_producto_crud.vue");
export default {
    mixins: [Codigosmix],
    data() {
        return {
            options1: [{
                    text: '--Seleccione--',
                    value: null
                },
                {
                    text: 'Si',
                    value: 1
                },
                {
                    text: 'No',
                    value: 0
                },
            ],
            Productos: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            tabProducto: {
                pro_codigo: '',
                gru_pro_codigo: '',
                pro_nombre: '',
                pro_descripcion: '',
                pro_iva: '',
                pro_valor: '',
                pro_descuento: '',
                pro_stock: '',
                pro_stockCalmed: '',
                pro_deposito: '',
                pro_depositoCalmed: '',
                pro_costo: '',
                pro_peso: '',
                pro_estado: '',
                id_serie: '',
                idlibro: '',
                year: '',
                sumainicial: '',
                valornuevosumado: '',
                calculoaplicara_pro_reservar: '',
                pro_reservar_anterior: '',
                id_pro_codigo_padre: '',
                grupo_codigo_para_v3: '',
            },
            errorPadreGuardar: false,
            errorPadreEditar: false,
            errorGrupoV3Guardar: false,
            errorGrupoV3Editar: false,
            series: [],
            libros: [],
            pro_codigo: null,
            pro_nombre: null,
            mostrarSeleccionSerie: false,
            idlibro: null,
            id_serie: null,
            pro_codigo_antiguo: 0,
            id_serie_antiguo: null,
            Grupos: [],
            Producto_sinfiltro: [],
            Producto_inactivos: [],
            busquedaxcodigo: "",
            valorBusqueda: "0",
            checkBox_mostrarinactivos: false,
            busqueda: '',
            numeros: 0,
            arrayConfiguration: [],
            popupInformacionProducto: false,
            popupEdicionMasivaStock: false,
            popupReporteProductos: false,
            popupHistoricoEdicionMasivaStock: false,
            //showAgregarNuevo: false,
            arrayTextosSinCombos: [],
            // Sincronizar Perseo
            popupSincronizarPerseo: false,
            sincronizandoPerseo: false,
            resultadoSincronizacion: null,
            ultimaConsultaSincronizacion: {
                idEmpresa: null,
                tipo: null,
                requiereConfirmacion: false,
            },
            panelAdminSincronizacion: {
                busqueda: '',
                filtroEstado: 'todos',
                opcionesEstado: [
                    { label: 'Todos', value: 'todos' },
                    { label: 'Solo candidatos', value: 'candidatos' },
                    { label: 'Con error / no candidato', value: 'no_candidatos' },
                    { label: 'Sin total Perseo', value: 'sin_total_perseo' },
                    { label: 'Sin ID local', value: 'sin_id_local' },
                    { label: 'ID no coincide', value: 'id_no_coincide' },
                ]
            },
            detalleSincronizacionEditable: [],
            panelReConsultaSinTotal: {
                busqueda: '',
            },
            panelUnificado: {
                empresaSeleccionada: null,
                consultaIds: null,
                consultaStock: null,
            },
            // Histórico individual
            popupHistoricoIndividual: false,
            productoHistoricoSeleccionado: {
                pro_codigo: '',
                pro_nombre: '',
            },
            historicoIndividualData: [],
            filtroHistoricoIndividual: {
                busqueda: '',
                tipo: '',
                movimiento: '', // 'entrada', 'salida', ''
            },
        }
    },
    watch: {
        valorBusqueda(newValue) {
            if (newValue === '0') {
                this.Productos = [];
            } else if (newValue === '1') {
                this.Productos = [];
            }
            if (newValue === '2') {
                this.valorBusqueda = '2';
                this.busqueda = 'codigopro';
            }
        },
        'tabProducto.pro_codigo': function (newVal, oldVal) {
            const numeros = newVal.replace(/\D/g, '');
            this.tabProducto.year = numeros;
            this.tabProducto.codigo_liquidacion = newVal;
        },
        'tabProducto.gru_pro_codigo': function (newValue, oldValue) {
            // Actualiza la visibilidad del bloque de selección de serie basado en la condición
            this.mostrarSeleccionSerie = (newValue === 1 || newValue === 3 || newValue === 6);
            if (!this.requiereProductoPadre(newValue)) {
                this.tabProducto.id_pro_codigo_padre = '';
                this.errorPadreGuardar = false;
                this.errorPadreEditar = false;
            }
        }
    },
    components: {
        'v-select': vSelect,
        Informacion_Producto,
        EditMasivaPorducto_Producto,
        EditMasivaPorducto_ProductoHistorico,
        ReporteProductosGeneral,
    },
    computed: {
        ...mapState(['userRoot', 'groupFacturador', 'AdminBodega', 'groupBodega', 'AsisGerencia', 'userFacturador', 'userAdminFacturador','userContabilidad']),
        historicoFiltrado() {
            let datos = this.historicoIndividualData;
            
            // Filtrar por búsqueda
            if (this.filtroHistoricoIndividual.busqueda) {
                const busqueda = this.filtroHistoricoIndividual.busqueda.toLowerCase();
                datos = datos.filter(item => 
                    item.usuario.toLowerCase().includes(busqueda) ||
                    item.referencia.toLowerCase().includes(busqueda) ||
                    item.tipo_texto.toLowerCase().includes(busqueda)
                );
            }
            
            // Filtrar por tipo
            if (this.filtroHistoricoIndividual.tipo !== '') {
                datos = datos.filter(item => item.tipo == this.filtroHistoricoIndividual.tipo);
            }
            
            // Filtrar por movimiento
            if (this.filtroHistoricoIndividual.movimiento === 'entrada') {
                datos = datos.filter(item => item.diferencia_calmed > 0 || item.diferencia_reservar > 0);
            } else if (this.filtroHistoricoIndividual.movimiento === 'salida') {
                datos = datos.filter(item => item.diferencia_calmed < 0 || item.diferencia_reservar < 0);
            }
            
            return datos;
        }
    },
    mounted() {
      this.getGrupoProducto();
      this.getProducto();
      this.getLibros()
      this.listaSeries();
      this.getConfiguracion();
      this.f_getTextosSinCombos();
    },
    methods: {
        f_getTextosSinCombos(){
          let me = this;
          this.$http.get(this.$server_url + 'GetProductoXGrupo?grupo_codigo=1&sinCombos=1')
            .then(function (res) {
              me.arrayTextosSinCombos = res.data;
            })
            .catch(function (error) {
              console.log(error + ' error');
            })
        },
        getInformacionProducto() {
            this.popupInformacionProducto = true;
        },
        getEdicionMasivaStock() {
            this.popupEdicionMasivaStock = true;
        },
        getReporteProductos() {
            this.popupReporteProductos = true;
        },
        HistoricoEdicionMasivaStock() {
            this.popupHistoricoEdicionMasivaStock = true;
        },
        abrirModalSincronizarPerseo() {
            this.popupSincronizarPerseo = true;
            this.resultadoSincronizacion = null;
            this.sincronizandoPerseo = false;
            this.panelAdminSincronizacion.busqueda = '';
            this.panelAdminSincronizacion.filtroEstado = 'todos';
            this.panelReConsultaSinTotal.busqueda = '';
            this.detalleSincronizacionEditable = [];
            this.panelUnificado = {
                empresaSeleccionada: null,
                consultaIds: null,
                consultaStock: null,
            };
            this.ultimaConsultaSincronizacion = {
                idEmpresa: null,
                tipo: null,
                requiereConfirmacion: false,
            };
        },
        cerrarSincronizacionPerseo() {
            this.popupSincronizarPerseo = false;
            this.resultadoSincronizacion = null;
            this.sincronizandoPerseo = false;
            this.panelAdminSincronizacion.busqueda = '';
            this.panelAdminSincronizacion.filtroEstado = 'todos';
            this.detalleSincronizacionEditable = [];
            this.panelReConsultaSinTotal.busqueda = '';
            this.panelUnificado = {
                empresaSeleccionada: null,
                consultaIds: null,
                consultaStock: null,
            };
            this.ultimaConsultaSincronizacion = {
                idEmpresa: null,
                tipo: null,
                requiereConfirmacion: false,
            };
        },
        prepararPanelAdministrativoSincronizacion() {
            const resultado = this.resultadoSincronizacion;
            this.detalleSincronizacionEditable = [];

            if (!resultado || !resultado.detalle_consulta || !Array.isArray(resultado.detalle_consulta)) {
                return;
            }

            for (let i = 0; i < resultado.detalle_consulta.length; i++) {
                const item = resultado.detalle_consulta[i];
                const esCandidato = item && item.candidato === 1 ? 1 : 0;

                this.detalleSincronizacionEditable.push({
                    pro_codigo: item && item.pro_codigo ? item.pro_codigo : '',
                    id_perseo_local: item && item.id_perseo_local != null ? item.id_perseo_local : 0,
                    pro_stock_local: item && item.pro_stock_local != null ? item.pro_stock_local : 0,
                    productosid_perseo: item && item.productosid_perseo != null ? item.productosid_perseo : 0,
                    existenciastotales: item && item.existenciastotales != null ? item.existenciastotales : '',
                    estado: item && item.estado ? item.estado : '',
                    motivo: item && item.motivo ? item.motivo : '',
                    candidato: esCandidato,
                    aplicar: esCandidato,
                    productosid_perseo_edit: item && item.productosid_perseo != null ? item.productosid_perseo : '',
                    existenciastotales_edit: item && item.existenciastotales != null ? item.existenciastotales : '',
                    consultando_perseo: 0,
                });
            }
        },
        consultarProductoIndividualPerseo(item) {
            const me = this;

            if (!item || !item.pro_codigo) {
                me.$vs.notify({
                    text: 'Producto inválido para consultar.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            const idEmpresa = me.panelUnificado && me.panelUnificado.empresaSeleccionada
                ? me.panelUnificado.empresaSeleccionada
                : me.ultimaConsultaSincronizacion.idEmpresa;

            if (!idEmpresa) {
                me.$vs.notify({
                    text: 'Selecciona empresa para consultar en Perseo.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            item.consultando_perseo = 1;

            me.$http.post(me.$server_url + 'api/perseo/productos/productos_consulta_x_id', {
                id_empresa: idEmpresa,
                codigos: [item.pro_codigo]
            })
            .then(function (res) {
                const data = res && res.data ? res.data : {};
                const productos = data && data.productos && Array.isArray(data.productos) ? data.productos : [];

                if (productos.length < 1) {
                    me.$vs.notify({
                        text: 'No se encontró el producto en Perseo.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                }

                const productoPerseo = productos[0];
                const idPerseo = productoPerseo && productoPerseo.productosid ? parseInt(productoPerseo.productosid) : 0;
                const totalPerseo = productoPerseo && productoPerseo.existenciastotales != null ? parseFloat(productoPerseo.existenciastotales) : null;

                item.productosid_perseo = idPerseo;
                item.productosid_perseo_edit = idPerseo;

                if (totalPerseo != null) {
                    item.existenciastotales = totalPerseo;
                    item.existenciastotales_edit = totalPerseo;
                }

                item.estado = 'consultado_individual';
                item.motivo = 'Consulta individual en Perseo';
                item.candidato = 1;
                item.aplicar = 1;

                me.$vs.notify({
                    text: 'Producto consultado correctamente en Perseo.',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
            })
            .catch(function (error) {
                let mensajeError = 'Error al consultar producto en Perseo.';
                if (error.response && error.response.data) {
                    if (error.response.data.mensaje) {
                        mensajeError = error.response.data.mensaje;
                    } else if (error.response.data.error) {
                        mensajeError = error.response.data.error;
                    }
                }
                me.$vs.notify({
                    text: mensajeError,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
            })
            .finally(function () {
                item.consultando_perseo = 0;
            });
        },
        getDetalleConsultaAdmin() {
            const lista = this.detalleSincronizacionEditable;
            const resultado = [];
            const filtro = this.panelAdminSincronizacion.filtroEstado;
            const textoBusqueda = this.panelAdminSincronizacion.busqueda ? this.panelAdminSincronizacion.busqueda.toString().trim().toUpperCase() : '';

            for (let i = 0; i < lista.length; i++) {
                const item = lista[i];
                const codigo = item && item.pro_codigo ? item.pro_codigo.toString().toUpperCase() : '';

                if (textoBusqueda !== '' && codigo.indexOf(textoBusqueda) === -1) {
                    continue;
                }

                if (filtro === 'candidatos' && item.candidato !== 1) {
                    continue;
                }
                if (filtro === 'no_candidatos' && item.candidato === 1) {
                    continue;
                }
                if (filtro === 'sin_total_perseo' && item.estado !== 'sin_total_perseo') {
                    continue;
                }
                if (filtro === 'sin_id_local' && item.estado !== 'sin_id_local') {
                    continue;
                }
                if (filtro === 'id_no_coincide' && item.estado !== 'id_no_coincide') {
                    continue;
                }

                resultado.push(item);
            }

            return resultado;
        },
        marcarTodosIDs() {
            for (let i = 0; i < this.detalleSincronizacionEditable.length; i++) {
                const item = this.detalleSincronizacionEditable[i];
                if (item.candidato === 1) {
                    item.aplicar_id = 1;
                }
            }
        },
        desmarcarTodosIDs() {
            for (let i = 0; i < this.detalleSincronizacionEditable.length; i++) {
                this.detalleSincronizacionEditable[i].aplicar_id = 0;
            }
        },
        marcarTodosStock() {
            for (let i = 0; i < this.detalleSincronizacionEditable.length; i++) {
                const item = this.detalleSincronizacionEditable[i];
                if (item.candidato === 1) {
                    item.aplicar_stock = 1;
                }
            }
        },
        desmarcarTodosStock() {
            for (let i = 0; i < this.detalleSincronizacionEditable.length; i++) {
                this.detalleSincronizacionEditable[i].aplicar_stock = 0;
            }
        },
        cantidadIdsSeleccionados() {
            let total = 0;
            for (let i = 0; i < this.detalleSincronizacionEditable.length; i++) {
                if (parseInt(this.detalleSincronizacionEditable[i].aplicar_id) === 1) {
                    total++;
                }
            }
            return total;
        },
        cantidadStockSeleccionados() {
            let total = 0;
            for (let i = 0; i < this.detalleSincronizacionEditable.length; i++) {
                if (parseInt(this.detalleSincronizacionEditable[i].aplicar_stock) === 1) {
                    total++;
                }
            }
            return total;
        },
        guardarSeleccionadosID() {
            const me = this;

            if (!me.resultadoSincronizacion || me.resultadoSincronizacion.status !== 1) {
                me.$vs.notify({
                    text: 'Primero haz una consulta',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            const conIdsCambio = [];

            for (const item of me.detalleSincronizacionEditable) {
                if (parseInt(item.aplicar_id) !== 1) continue;
                if (item.productosid_perseo_edit && item.productosid_perseo_edit > 0) {
                    conIdsCambio.push({
                        pro_codigo: item.pro_codigo,
                        productosid_perseo: item.productosid_perseo_edit,
                        aplicar: 1
                    });
                }
            }

            if (conIdsCambio.length < 1) {
                me.$vs.notify({
                    text: 'No hay IDs seleccionados para guardar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            me.sincronizandoPerseo = true;
            const idEmpresa = me.panelUnificado.empresaSeleccionada;

            me.$http.post(me.$server_url + 'api/perseo/productos/sincronizar_existencias_perseo', {
                id_empresa: idEmpresa,
                tipo: 'ids',
                accion: 'confirmar',
                modo: 'manual',
                detalle_seleccionado: conIdsCambio
            })
            .then(() => {
                me.sincronizandoPerseo = false;
                me.$vs.notify({
                    text: `✅ Guardados: ${conIdsCambio.length} ID(s)`,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                me.desmarcarTodosIDs();
                me.getProducto();
            })
            .catch(error => {
                me.sincronizandoPerseo = false;
                const msg = (error.response && error.response.data && error.response.data.mensaje)
                    ? error.response.data.mensaje
                    : 'Error al guardar IDs';
                me.$vs.notify({
                    text: msg,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
            });
        },
        guardarSeleccionadosStock() {
            const me = this;

            if (!me.resultadoSincronizacion || me.resultadoSincronizacion.status !== 1) {
                me.$vs.notify({
                    text: 'Primero haz una consulta',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            const conStockCambio = [];

            for (const item of me.detalleSincronizacionEditable) {
                if (parseInt(item.aplicar_stock) !== 1) continue;
                if (item.existenciastotales_edit && item.existenciastotales_edit > 0) {
                    conStockCambio.push({
                        pro_codigo: item.pro_codigo,
                        existenciastotales: item.existenciastotales_edit,
                        aplicar: 1
                    });
                }
            }

            if (conStockCambio.length < 1) {
                me.$vs.notify({
                    text: 'No hay Stock seleccionado para guardar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            me.sincronizandoPerseo = true;
            const idEmpresa = me.panelUnificado.empresaSeleccionada;

            me.$http.post(me.$server_url + 'api/perseo/productos/sincronizar_existencias_perseo', {
                id_empresa: idEmpresa,
                tipo: 'stock',
                accion: 'confirmar',
                modo: 'manual',
                detalle_seleccionado: conStockCambio
            })
            .then(() => {
                me.sincronizandoPerseo = false;
                me.$vs.notify({
                    text: `✅ Guardados: ${conStockCambio.length} Stock`,
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                me.desmarcarTodosStock();
                me.getProducto();
            })
            .catch(error => {
                me.sincronizandoPerseo = false;
                const msg = (error.response && error.response.data && error.response.data.mensaje)
                    ? error.response.data.mensaje
                    : 'Error al guardar Stock';
                me.$vs.notify({
                    text: msg,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
            });
        },
        puedeConfirmarSincronizacion(tipo) {
            if (!this.resultadoSincronizacion) {
                return false;
            }
            if (this.resultadoSincronizacion.status !== 1) {
                return false;
            }
            if (this.resultadoSincronizacion.tipo !== tipo) {
                return false;
            }
            if (!this.ultimaConsultaSincronizacion.requiereConfirmacion) {
                return false;
            }
            if (this.ultimaConsultaSincronizacion.idEmpresa === null) {
                return false;
            }
            if (this.ultimaConsultaSincronizacion.tipo !== tipo) {
                return false;
            }
            if (
                this.resultadoSincronizacion.kpis
                && this.resultadoSincronizacion.kpis.candidatos_actualizacion !== undefined
                && this.resultadoSincronizacion.kpis.candidatos_actualizacion < 1
            ) {
                return false;
            }
            return true;
        },
        consultarSincronizacionPerseo(idEmpresa, tipo) {
            let me = this;
            me.sincronizandoPerseo = true;
            me.resultadoSincronizacion = null;

            me.$http.post(me.$server_url + 'api/perseo/productos/sincronizar_existencias_perseo', {
                id_empresa: idEmpresa,
                tipo: tipo,
                accion: 'consultar'
            })
            .then(function (res) {
                me.sincronizandoPerseo = false;
                me.resultadoSincronizacion = res.data;
                me.prepararPanelAdministrativoSincronizacion();
                me.ultimaConsultaSincronizacion = {
                    idEmpresa: idEmpresa,
                    tipo: tipo,
                    requiereConfirmacion: res.data && res.data.requiere_confirmacion === 1,
                };

                if (res.data.status === 1) {
                    me.$vs.notify({
                        text: 'Consulta completada. Revise KPIs y confirme para aplicar cambios.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                } else {
                    me.$vs.notify({
                        text: res.data.mensaje ? res.data.mensaje : 'Error en el proceso',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                }
            })
            .catch(function (error) {
                me.sincronizandoPerseo = false;
                let mensajeError = 'Error de conexión con el servidor';
                if (error.response && error.response.data) {
                    mensajeError = error.response.data.mensaje ? error.response.data.mensaje : (error.response.data.message ? error.response.data.message : mensajeError);
                }
                me.resultadoSincronizacion = {
                    status: 0,
                    mensaje: mensajeError
                };
                me.ultimaConsultaSincronizacion = {
                    idEmpresa: null,
                    tipo: null,
                    requiereConfirmacion: false,
                };
                me.$vs.notify({
                    text: mensajeError,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
            });
        },
        confirmarSincronizacionPerseo(tipo) {
            let me = this;

            if (!me.puedeConfirmarSincronizacion(tipo)) {
                me.$vs.notify({
                    text: 'Primero debe consultar y tener productos candidatos para confirmar.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            const idEmpresa = me.ultimaConsultaSincronizacion.idEmpresa;

            me.sincronizandoPerseo = true;

            me.$http.post(me.$server_url + 'api/perseo/productos/sincronizar_existencias_perseo', {
                id_empresa: idEmpresa,
                tipo: tipo,
                accion: 'confirmar'
            })
            .then(function (res) {
                me.sincronizandoPerseo = false;
                me.resultadoSincronizacion = res.data;
                me.prepararPanelAdministrativoSincronizacion();
                me.ultimaConsultaSincronizacion.requiereConfirmacion = false;

                if (res.data.status === 1) {
                    me.$vs.notify({
                        text: res.data.mensaje,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    me.getProducto();
                } else {
                    me.$vs.notify({
                        text: res.data.mensaje ? res.data.mensaje : 'Error en la confirmación',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                }
            })
            .catch(function (error) {
                me.sincronizandoPerseo = false;
                let mensajeError = 'Error de conexión con el servidor';
                if (error.response && error.response.data) {
                    mensajeError = error.response.data.mensaje ? error.response.data.mensaje : (error.response.data.message ? error.response.data.message : mensajeError);
                }
                me.$vs.notify({
                    text: mensajeError,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
            });
        },
        obtenerProductosSinTotal() {
            if (!this.resultadoSincronizacion || !this.resultadoSincronizacion.detalle_consulta) {
                return [];
            }
            return this.resultadoSincronizacion.detalle_consulta.filter(item => item.estado === 'sin_total_perseo');
        },
        filtrarProductosSinTotal() {
            let productos = this.obtenerProductosSinTotal();
            const busqueda = (this.panelReConsultaSinTotal.busqueda || '').toLowerCase();

            if (busqueda.length > 0) {
                productos = productos.filter(item => {
                    return (item.pro_codigo || '').toLowerCase().includes(busqueda);
                });
            }

            return productos;
        },
        reConsultarProductosSinTotal() {
            let me = this;
            const productosSinTotal = this.obtenerProductosSinTotal();

            if (productosSinTotal.length < 1) {
                this.$vs.notify({
                    text: 'No hay productos sin total para re-consultar.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            me.sincronizandoPerseo = true;

            // Extraer codigos de productos sin total
            const codigosSinTotal = productosSinTotal.map(item => item.pro_codigo);

            me.$http.post(me.$server_url + 'api/perseo/productos/productos_consulta_x_id', {
                id_empresa: me.ultimaConsultaSincronizacion.idEmpresa,
                codigos: codigosSinTotal
            })
            .then(function (res) {
                me.sincronizandoPerseo = false;

                if (res.data.productos && res.data.productos.length > 0) {
                    // Actualizar el resultado de sincronización con los nuevos datos
                    const mapNuevosProductos = {};
                    res.data.productos.forEach(prod => {
                        if (prod.productocodigo) {
                            mapNuevosProductos[prod.productocodigo] = prod;
                        }
                    });

                    // Actualizar detalle_consulta con los nuevos datos
                    if (me.resultadoSincronizacion && me.resultadoSincronizacion.detalle_consulta) {
                        me.resultadoSincronizacion.detalle_consulta.forEach(item => {
                            if (item.estado === 'sin_total_perseo' && mapNuevosProductos[item.pro_codigo]) {
                                const nuevoProd = mapNuevosProductos[item.pro_codigo];
                                if (nuevoProd.existenciastotales) {
                                    item.existenciastotales = nuevoProd.existenciastotales;
                                    item.estado = 'candidato_stock_reconsultado';
                                    item.motivo = 're-consultado y obtuvo dato';
                                    item.candidato = 1;
                                }
                            }
                        });
                    }

                    me.$vs.notify({
                        text: `Re-consulta completada: ${res.data.total_encontrados} encontrado(s), ${res.data.total_no_encontrados} no encontrado(s).`,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                } else {
                    me.$vs.notify({
                        text: res.data.total_encontrados > 0 ? 'Re-consulta completada pero sin nuevos datos.' : 'No se encontraron productos en la re-consulta.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                }
            })
            .catch(function (error) {
                me.sincronizandoPerseo = false;
                let mensajeError = 'Error en la re-consulta';
                if (error.response && error.response.data) {
                    mensajeError = error.response.data.mensaje ? error.response.data.mensaje : (error.response.data.message ? error.response.data.message : mensajeError);
                }
                me.$vs.notify({
                    text: mensajeError,
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
            });
        },
        consultarUnificado() {
            const me = this;
            const idEmpresa = me.panelUnificado.empresaSeleccionada;

            if (!idEmpresa) {
                me.$vs.notify({
                    text: 'Selecciona una empresa primero',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            me.sincronizandoPerseo = true;
            me.resultadoSincronizacion = null;
            me.detalleSincronizacionEditable = [];

            // PASO 1: Consultar IDS
            me.$http.post(me.$server_url + 'api/perseo/productos/sincronizar_existencias_perseo', {
                id_empresa: idEmpresa,
                tipo: 'ids',
                accion: 'consultar',
                detalle_seleccionado: []
            })
            .then(function (resIds) {
                // PASO 2: Consultar STOCK
                return me.$http.post(me.$server_url + 'api/perseo/productos/sincronizar_existencias_perseo', {
                    id_empresa: idEmpresa,
                    tipo: 'stock',
                    accion: 'consultar',
                    detalle_seleccionado: []
                }).then(resStock => {
                    return { idsResponse: resIds.data, stockResponse: resStock.data };
                });
            })
            .then(function (responses) {
                me.sincronizandoPerseo = false;

                // Combina resultados - Merge simple
                const idsRes = responses.idsResponse;
                const stockRes = responses.stockResponse;

                if (!idsRes || !stockRes) {
                    throw new Error('Respuestas vacías');
                }

                // Usa la respuesta de IDs como base
                const merged = {
                    status: (idsRes.status && stockRes.status) ? 1 : 0,
                    empresa: idsRes.empresa || stockRes.empresa || 'Desconocida',
                    mensaje: idsRes.mensaje || stockRes.mensaje || 'Consulta completada',
                    kpis: {
                        plataforma_total: (idsRes.kpis && idsRes.kpis.plataforma_total) ? parseInt(idsRes.kpis.plataforma_total) : 0,
                        encontrados_codigo: (idsRes.kpis && idsRes.kpis.encontrados_codigo) ? parseInt(idsRes.kpis.encontrados_codigo) : 0,
                        candidatos_actualizacion: (idsRes.kpis && idsRes.kpis.candidatos_actualizacion) ? parseInt(idsRes.kpis.candidatos_actualizacion) : 0
                    }
                };

                // Copia solo el detalle_consulta mínimo necesario
                if (stockRes.detalle_consulta && Array.isArray(stockRes.detalle_consulta)) {
                    me.detalleSincronizacionEditable = stockRes.detalle_consulta.map(item => ({
                        pro_codigo: (item && item.pro_codigo) ? item.pro_codigo : '',
                        id_perseo_local: (item && item.id_perseo_local) ? item.id_perseo_local : '',
                        pro_stock_local: (item && item.pro_stock_local !== null && item.pro_stock_local !== undefined) ? item.pro_stock_local : 0,
                        productosid_perseo: (item && item.productosid_perseo) ? item.productosid_perseo : 0,
                        productosid_perseo_edit: (item && item.productosid_perseo) ? item.productosid_perseo : 0,
                        existenciastotales: (item && item.existenciastotales !== null && item.existenciastotales !== undefined) ? item.existenciastotales : 0,
                        existenciastotales_edit: (item && item.existenciastotales !== null && item.existenciastotales !== undefined) ? item.existenciastotales : 0,
                        estado: (item && item.estado) ? item.estado : '',
                        candidato: (item && item.candidato) ? item.candidato : 0,
                        motivo: (item && item.motivo) ? item.motivo : '',
                        consultando_perseo: 0,
                        aplicar: 0
                    }));
                }

                me.resultadoSincronizacion = merged;
            })
            .catch(function (error) {
                me.sincronizandoPerseo = false;
                let mensajeError = 'Error en la consulta unificada';
                if (error.response && error.response.data && error.response.data.mensaje) {
                    mensajeError = error.response.data.mensaje;
                }
                me.resultadoSincronizacion = {
                    status: 0,
                    mensaje: 'Error: ' + mensajeError
                };
            });
        },
        combinarResultadosUnificados() {
            let me = this;

            if (!me.panelUnificado.consultaIds || !me.panelUnificado.consultaStock) {
                return;
            }

            const resIds = me.panelUnificado.consultaIds;
            const resStock = me.panelUnificado.consultaStock;

            const mapDetalleIds = {};
            const mapDetalleStock = {};

            if (resIds && resIds.detalle_consulta) {
                resIds.detalle_consulta.forEach(item => {
                    mapDetalleIds[item.pro_codigo] = item;
                });
            }

            if (resStock && resStock.detalle_consulta) {
                resStock.detalle_consulta.forEach(item => {
                    mapDetalleStock[item.pro_codigo] = item;
                });
            }

            const todosLosCodigos = new Set([
                ...Object.keys(mapDetalleIds),
                ...Object.keys(mapDetalleStock)
            ]);

            const detalleUnificado = Array.from(todosLosCodigos).map(codigo => {
                const itemIds = mapDetalleIds[codigo];
                const itemStock = mapDetalleStock[codigo];
                const base = (itemStock) ? itemStock : (itemIds) ? itemIds : {};

                return {
                    pro_codigo: codigo,
                    id_perseo_local: (base && base.id_perseo_local) ? base.id_perseo_local : 0,
                    productosid_perseo: (base && base.productosid_perseo) ? base.productosid_perseo : 0,
                    existenciastotales: (base && base.existenciastotales) ? base.existenciastotales : 0,
                    estado: (base && base.estado) ? base.estado : 'desconocido',
                    motivo: (base && base.motivo) ? base.motivo : '',
                    candidato: (base && base.candidato === 1) ? 1 : 0,
                    estado_ids: (itemIds && itemIds.estado) ? itemIds.estado : 'n/a',
                    estado_stock: (itemStock && itemStock.estado) ? itemStock.estado : 'n/a',
                };
            });

            const empresaResIds = (resIds && resIds.empresa) ? resIds.empresa : null;
            const empresaResStock = (resStock && resStock.empresa) ? resStock.empresa : null;
            const empresaNombre = empresaResIds ? empresaResIds : (empresaResStock ? empresaResStock : 'Desconocida');

            const productosRecibidosIds = (resIds && resIds.productos_recibidos) ? resIds.productos_recibidos : 0;
            const productosRecibidosStock = (resStock && resStock.productos_recibidos) ? resStock.productos_recibidos : 0;
            const maxProductosRecibidos = productosRecibidosIds > productosRecibidosStock ? productosRecibidosIds : productosRecibidosStock;

            const kpisIds = (resIds && resIds.kpis) ? resIds.kpis : {};
            const kpisStock = (resStock && resStock.kpis) ? resStock.kpis : {};

            const platformaTotal = (kpisStock && kpisStock.plataforma_total) ? kpisStock.plataforma_total : ((kpisIds && kpisIds.plataforma_total) ? kpisIds.plataforma_total : 0);
            const encontradosCodigo = ((kpisIds && kpisIds.encontrados_codigo) ? kpisIds.encontrados_codigo : 0) + ((kpisStock && kpisStock.encontrados_codigo) ? kpisStock.encontrados_codigo : 0);
            const noEncontradosCodigo = (kpisIds && kpisIds.no_encontrados_codigo) ? kpisIds.no_encontrados_codigo : 0;
            const noEncontradosCodigoStock = (kpisStock && kpisStock.no_encontrados_codigo) ? kpisStock.no_encontrados_codigo : 0;
            const maxNoEncontrados = noEncontradosCodigo > noEncontradosCodigoStock ? noEncontradosCodigo : noEncontradosCodigoStock;
            const candidatos = ((kpisIds && kpisIds.candidatos_actualizacion) ? kpisIds.candidatos_actualizacion : 0) + ((kpisStock && kpisStock.candidatos_actualizacion) ? kpisStock.candidatos_actualizacion : 0);

            me.resultadoSincronizacion = {
                status: 1,
                tipo: 'unificado',
                empresa: empresaNombre,
                mensaje: 'Consulta unificada completada. Puedes editar IDs y Stock en el mismo panel.',
                requiere_confirmacion: true,
                productos_recibidos: maxProductosRecibidos,
                productos_actualizados: 0,
                productos_ignorados: 0,
                errores: [],
                kpis: {
                    plataforma_total: platformaTotal,
                    perseo_total: maxProductosRecibidos,
                    encontrados_codigo: encontradosCodigo,
                    no_encontrados_codigo: maxNoEncontrados,
                    candidatos_actualizacion: candidatos,
                    sin_id_local: (kpisStock && kpisStock.sin_id_local) ? kpisStock.sin_id_local : 0,
                    id_no_coincide: (kpisStock && kpisStock.id_no_coincide) ? kpisStock.id_no_coincide : 0,
                    ya_vinculados: (kpisIds && kpisIds.ya_vinculados) ? kpisIds.ya_vinculados : 0,
                    sin_total_perseo: (kpisStock && kpisStock.sin_total_perseo) ? kpisStock.sin_total_perseo : 0,
                    consultas_individuales: (kpisStock && kpisStock.consultas_individuales) ? kpisStock.consultas_individuales : 0,
                    consultas_individuales_con_dato: (kpisStock && kpisStock.consultas_individuales_con_dato) ? kpisStock.consultas_individuales_con_dato : 0,
                },
                detalle_consulta: detalleUnificado,
                detalle_actualizados: [],
            };

            me.ultimaConsultaSincronizacion = {
                idEmpresa: me.panelUnificado.empresaSeleccionada,
                tipo: 'unificado',
                requiereConfirmacion: true,
            };
        },
        changeHandleInformacionProducto(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificarinfoactualizar == 1) {
                console.log("Emit recibido por aceptar.");
                me.popupInformacionProducto = false;
                this.getConfiguracion();
            } else if (e.verificarinfoactualizar == 2) {
                console.log("Emit recibido por cerrar.");
                this.getConfiguracion();
                me.popupInformacionProducto = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleEdicionMasivaStock(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificaredicionmasivaactualizar == 1) {
                console.log("Emit recibido por guardado.");
                me.popupEdicionMasivaStock = false;
                this.getConfiguracion();
            } else if (e.verificaredicionmasivaactualizar == 2) {
                console.log("Emit recibido por cancelar.");
                this.getConfiguracion();
                me.popupEdicionMasivaStock = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleReporteProductos(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificarhistoricoedicionmasivaactualizar == 1) {
                console.log("Emit recibido por guardado.");
                me.popupHistoricoEdicionMasivaStock = false;
                this.getConfiguracion();
            } else if (e.verificarhistoricoedicionmasivaactualizar == 2) {
                console.log("Emit recibido por cancelar.");
                this.getConfiguracion();
                me.popupHistoricoEdicionMasivaStock = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        changeHandleHistoricoEdicionMasivaStock(e) {
            let me = this;
            // console.log("realizarcchangeinicio")
            // console.log(e.verificacionemiteliminar); // Debería imprimir 1
            if (e.verificarhistoricoedicionmasivaactualizar == 1) {
                console.log("Emit recibido por guardado.");
                me.popupHistoricoEdicionMasivaStock = false;
                this.getConfiguracion();
            } else if (e.verificarhistoricoedicionmasivaactualizar == 2) {
                console.log("Emit recibido por cancelar.");
                this.getConfiguracion();
                me.popupHistoricoEdicionMasivaStock = false;
            } else {
                console.log("Emit no recibido");
            }
        },
        getStockClass(value, id) {
            const config = this.arrayConfiguration.find(config => config.id === id);
            if (!config) return '';

            if (value < 1) {
                return 'text-red';
            } else if (value < config.minimo) {
                return 'text-orange';
            } else {
                return 'text-green'; // Color verde si es mayor o igual al mínimo
            }
        },
        getConfiguracion() {
            let me = this;
            this.$http.get(this.$server_url + 'inventario/configuracion')
                .then(function (res) {
                    me.arrayConfiguration = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        handleSelectInputGuardar(selectedItem) {
            // Resetear el error cuando se selecciona un valor
            if (selectedItem !== null && selectedItem !== '') {
                this.errorGrupoV3Guardar = false;
            }
            if (selectedItem === 1) {
                // Llama a tu función aquí
                this.funcionPrueba();
            }
        },
        handleSelectInputEditar(selectedItem) {
            // Resetear el error cuando se selecciona un valor
            if (selectedItem !== null && selectedItem !== '') {
                this.errorGrupoV3Editar = false;
            }
            if (selectedItem === 1) {
                // Llama a tu función aquí
                this.funcionPrueba();
            }
        },
        funcionPrueba() {
            console.log('prueba')
        },
        convertirAMayusculas() {
            const numerosString = this.tabProducto.pro_codigo.replace(/\D/g, '');
            this.numeros = numerosString ? parseInt(numerosString) : 0; // Asignar el valor a tabProducto.pro_codigo
            // Extraer los números y almacenarlos en la variable 'numeros'

            // Convertir el texto a mayúsculas
            this.tabProducto.pro_codigo = this.tabProducto.pro_codigo.toUpperCase();
            this.pro_codigo_antiguo = this.tabProducto.pro_codigo;
            this.id_serie_antiguo = this.tabProducto.id_serie;
        },
        ObtenerCodigo() {
            const codigoActual = this.tabProducto.pro_codigo;
            this.pro_codigo_antiguo = codigoActual; // Asignar el valor a tabProducto.pro_codigo
        },
        requiereProductoPadre(gruProCodigo) {
            const gruposSinPadre = [1, 8, 12, 18];
            return !gruposSinPadre.includes(Number(gruProCodigo));
        },
        isGrupoProhibido(gru_pro_codigo) {
            // Aquí puedes colocar la lógica para verificar si el grupo es prohibido
            if (gru_pro_codigo === 1) {
                // Muestra la notificación de error
                this.$vs.notify({
                    text: 'No puedes guardar con este grupo',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
                return true; // Devuelve true si el grupo es prohibido
            } else {
                return false; // Devuelve false si el grupo no es prohibido
            }
        },
        validarDescuento() {
            let descuento = this.tabProducto.pro_descuento;
            // Reemplazar comas por puntos solo si hay comas en la cadena
            if (descuento.includes(',')) {
                descuento = descuento.replace(',', '.');
                this.tabProducto.pro_descuento = descuento;
            }
            // Validar el formato del número
            if (!/^\d{0,14}(\.\d{0,2})?$/.test(descuento)) {
                this.tabProducto.pro_descuento = '';
                console.log("reset");
            }
        },
        validarValor() {
            const valor = this.tabProducto.proValor;
            if (/^\d/.test(valor)) { // si comienza con un dígito
                if (!/^\d{0,18}(\.\d{1,5})?$/.test(valor)) {
                    this.tabProducto.proValor = '';
                }
            } else if (/^[,.e]/.test(valor)) { // si comienza con una coma o un punto
                if (!/^([,.]\d{1,5})?$/.test(valor)) {
                    this.tabProducto.proValor = '';
                }
            } else { // si comienza con cualquier otro caracter
                this.tabProducto.proValor = '';
            }
        },
        validarStock() {
            let stock = this.tabProducto.proStock;
            if (!/^\d+$/.test(stock) || isNaN(stock)) {
                this.tabProducto.proStock = '';
            }
        },
        validarCosto() {
            const costo = this.tabProducto.proCosto;
            if (/^\d/.test(costo)) { // si comienza con un dígito
                if (!/^\d{0,18}(\.\d{1,5})?$/.test(costo)) {
                    this.tabProducto.proCosto = '';
                }
            } else if (/^[,.e]/.test(costo)) { // si comienza con una coma o un punto
                if (!/^([,.]\d{1,5})?$/.test(costo)) {
                    this.tabProducto.proCosto = '';
                }
            } else { // si comienza con cualquier otro caracter
                this.tabProducto.proCosto = '';
            }
        },
        validarPeso() {
            const peso = this.tabProducto.proPeso;
            if (/^\d/.test(peso)) { // si comienza con un dígito
                if (!/^\d{0,15}(\.\d{1,5})?$/.test(peso)) {
                    this.tabProducto.proPeso = '';
                }
            } else if (/^[,.e]/.test(peso)) { // si comienza con una coma o un punto
                if (!/^([,.]\d{1,5})?$/.test(peso)) {
                    this.tabProducto.proPeso = '';
                }
            } else { // si comienza con cualquier otro caracter
                this.tabProducto.proPeso = '';
            }
        },
        handleRadioInput(opcion) {
            // Vacía el array Productos cuando se selecciona la opción 'nombres'
            if (opcion === 'nombres') {
                this.Productos = [];
            } else if (opcion === 'codigopro') {
                this.Productos = [];
            }
        },
        getGrupoProducto() {
            let me = this;
            this.$http.get(this.$server_url + 'GetGrupoProducto_todo')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.Grupos = res.data;
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getLibros() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getLibroP')
                .then(function (res) {
                    me.libros = res.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        getProducto() {
            let me = this;
            this.$http.get(this.$server_url + 'GetProducto')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.Producto_sinfiltro = res.data;
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getProductos_inactivos() {
            let me = this;
            this.busquedaxcodigo = '';
            this.getConfiguracion();
            me.$vs.loading();
            this.$http.get(this.$server_url + 'GetProducto_Inactivo')
                .then(res => {
                    this.Productos = res.data;
                    if (me.Productos.length === 0) {
                        me.$vs.notify({
                            text: 'No hay productos inactivos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                        me.Productos = [];
                        me.$vs.loading.close();
                    } else {
                        me.$vs.loading.close();
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-user'
                            });
                        }

                        me.Productos.forEach(producto => {
                            let suma = (producto.pro_stock || 0) +
                                (producto.pro_stockCalmed || 0) +
                                (producto.pro_deposito || 0) +
                                (producto.pro_depositoCalmed || 0);
                            // Campos calculados
                            producto.sumainicial = suma;
                            producto.valornuevosumado = suma; // Inicializado como 0, actualiza según sea necesario
                            producto.calculoaplicara_pro_reservar = 0; // Inicializado como 0
                            producto.pro_reservar_anterior = producto.pro_reservar; // Guardar el valor anterior
                            // Agregar clases de color a las propiedades de cada producto
                            producto.pro_reservarClass = me.getStockClass(producto.pro_reservar, 1);
                            producto.pro_stockClass = me.getStockClass(producto.pro_stock, 2);
                            producto.pro_depositoClass = me.getStockClass(producto.pro_deposito, 4);
                            producto.pro_stockCalmedClass = me.getStockClass(producto.pro_stockCalmed, 3);
                            producto.pro_depositoCalmedClass = me.getStockClass(producto.pro_depositoCalmed, 5);
                        });
                    }
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },
        getProductos_stockminimo() {
            let me = this;
            this.busquedaxcodigo = '';
            this.getConfiguracion();
            me.$vs.loading();
            this.$http.get(this.$server_url + 'GetProducto_StockMenor')
                .then(res => {
                    this.Productos = res.data;
                    if (me.Productos.length === 0) {
                        me.$vs.notify({
                            text: 'No hay productos en stock mínimo',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                        me.Productos = [];
                        me.$vs.loading.close();
                    } else {
                        me.$vs.loading.close();
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-user'
                            });
                        }

                        me.Productos.forEach(producto => {
                            let suma = (producto.pro_stock || 0) +
                                (producto.pro_stockCalmed || 0) +
                                (producto.pro_deposito || 0) +
                                (producto.pro_depositoCalmed || 0);
                            // Campos calculados
                            producto.sumainicial = suma;
                            producto.valornuevosumado = suma; // Inicializado como 0, actualiza según sea necesario
                            producto.calculoaplicara_pro_reservar = 0; // Inicializado como 0
                            producto.pro_reservar_anterior = producto.pro_reservar; // Guardar el valor anterior
                            // Agregar clases de color a las propiedades de cada producto
                            producto.pro_reservarClass = me.getStockClass(producto.pro_reservar, 1);
                            producto.pro_stockClass = me.getStockClass(producto.pro_stock, 2);
                            producto.pro_depositoClass = me.getStockClass(producto.pro_deposito, 4);
                            producto.pro_stockCalmedClass = me.getStockClass(producto.pro_stockCalmed, 3);
                            producto.pro_depositoCalmedClass = me.getStockClass(producto.pro_depositoCalmed, 5);
                        });
                        // console.log(me.Productos, "productoencotnrado");
                    }
                })
                .catch(err => {
                    console.log(err);
                    me.$vs.loading.close();
                });
        },
        getProductoParametro() {
            let me = this;
            this.checkBox_mostrarinactivos = false;
            this.tabProducto.gru_pro_codigo;
            if (this.userAdminFacturador == true || this.userFacturador == true) {

            }
            this.getConfiguracion();

            if (me.busquedaxcodigo.length < 2) {
                me.$vs.notify({
                    text: 'Mínimo 2 caracteres de búsqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                });
                return false;
            }

            me.$vs.loading();
            this.$http.get(this.$server_url + 'GetProductoActivosxFiltro?busqueda=' + me.busqueda + '&razonbusqueda=' + me.busquedaxcodigo)
                .then(function (res) {
                    me.Productos = res.data;
                    if (me.Productos.length === 0) {
                        me.$vs.notify({
                            text: 'No hay productos para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                        me.Productos = [];
                        me.$vs.loading.close();
                    } else {
                        me.$vs.loading.close();
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-user'
                            });
                        }
                        // Filtrar si el usuario es facturador o admin facturador
                        // Filtrar si el usuario es facturador o admin facturador
                        if (me.userFacturador || me.userAdminFacturador) {
                            me.Productos = me.Productos.filter(p => p.gru_pro_codigo == 1 || p.gru_pro_codigo == 2)
                            //test
                            // Verificar si después del filtro hay productos
                            if (me.Productos.length === 0) {
                                me.$vs.notify({
                                    text: 'No hay productos para esta búsqueda',
                                    color: 'danger',
                                    iconPack: 'feather',
                                    icon: 'icon-x'
                                });
                                return; // Salimos para evitar ejecutar el forEach
                            }
                        }
                        me.Productos.forEach(producto => {
                            let suma = (producto.pro_stock || 0) +
                                (producto.pro_stockCalmed || 0) +
                                (producto.pro_deposito || 0) +
                                (producto.pro_depositoCalmed || 0);
                            // Campos calculados
                            producto.sumainicial = suma;
                            producto.valornuevosumado = suma; // Inicializado como 0, actualiza según sea necesario
                            producto.calculoaplicara_pro_reservar = 0; // Inicializado como 0
                            producto.pro_reservar_anterior = producto.pro_reservar; // Guardar el valor anterior
                            // Aplicar las clases de color a las propiedades existentes
                            producto.pro_reservarClass = me.getStockClass(producto.pro_reservar, 1);
                            producto.pro_stockClass = me.getStockClass(producto.pro_stock, 2);
                            producto.pro_depositoClass = me.getStockClass(producto.pro_deposito, 4);
                            producto.pro_stockCalmedClass = me.getStockClass(producto.pro_stockCalmed, 3);
                            producto.pro_depositoCalmedClass = me.getStockClass(producto.pro_depositoCalmed, 5);
                        });
                        // console.log(me.Productos,"tesssssssssssssssss");
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: 'No hay productos para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                        me.Productos = [];
                        me.$vs.loading.close();
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                });
        },
        //lista de series para usar en el select
        listaSeries() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url + `GetSeriesL`).then(res => {
                    me.series = res.data;
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error)
                    me.$vs.loading.close();
                })
        },
        validarCampoSerie() {
            // Verifica si tabProducto.gru_pro_codigo es 1, 3 o 6
            if (this.tabProducto.gru_pro_codigo === 1 || this.tabProducto.gru_pro_codigo === 3 || this.tabProducto.gru_pro_codigo === 6) {
                // Verifica si el campo de serie está vacío
                if (!this.tabProducto.id_serie) {
                    // El campo está vacío, devuelve false para indicar que la validación falló
                    return false;
                }
            }
            // Si no se cumple la condición, devuelve true automáticamente sin validar el campo de serie
            return true;
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabProducto.pro_codigo = ''
            this.tabProducto.gru_pro_codigo = null
            this.tabProducto.pro_costo = null
            this.tabProducto.pro_descripcion = ''
            this.tabProducto.pro_descuento = ''
            this.tabProducto.pro_iva = null
            this.tabProducto.pro_nombre = ''
            this.tabProducto.pro_peso = ''
            this.tabProducto.pro_stock = ''
            this.tabProducto.pro_stockCalmed = ''
            this.tabProducto.pro_deposito = ''
            this.tabProducto.pro_depositoCalmed = ''
            this.tabProducto.pro_valor = ''
            this.tabProducto.id_serie = ''
            this.tabProducto.id_pro_codigo_padre = ''
            this.tabProducto.grupo_codigo_para_v3 = ''
            this.errorPadreGuardar = false
            this.errorGrupoV3Guardar = false
        },
        guardarnuevo() {
            let me = this;
            let resultado = me.Producto_sinfiltro.filter(v => v.pro_codigo == this.tabProducto.pro_codigo);
            let resultado2 = me.series.filter(v => v.codigo_liquidacion == this.tabProducto.pro_codigo);
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            const numeros = this.tabProducto.pro_codigo.replace(/\D/g, '');
            // VALIDAR STOCK Y DEPÓSITO
            let pro_reservar = 0;

            // Verificación y ajuste de pro_deposito
            if (this.tabProducto.pro_deposito === 0 || this.tabProducto.pro_deposito === '') {
                this.tabProducto.pro_deposito = 0;
            } else {
                this.tabProducto.pro_deposito = parseFloat(this.tabProducto.pro_deposito);
            }

            // Verificación y ajuste de pro_depositoCalmed
            if (this.tabProducto.pro_depositoCalmed === 0 || this.tabProducto.pro_depositoCalmed === '') {
                this.tabProducto.pro_depositoCalmed = 0;
            } else {
                this.tabProducto.pro_depositoCalmed = parseFloat(this.tabProducto.pro_depositoCalmed);
            }

            // Verificación y ajuste de pro_stock
            if (this.tabProducto.pro_stock === 0 || this.tabProducto.pro_stock === '') {
                this.tabProducto.pro_stock = 0;
            } else {
                this.tabProducto.pro_stock = parseFloat(this.tabProducto.pro_stock);
            }

            // Verificación y ajuste de pro_stockCalmed
            if (this.tabProducto.pro_stockCalmed === 0 || this.tabProducto.pro_stockCalmed === '') {
                this.tabProducto.pro_stockCalmed = 0;
            } else {
                this.tabProducto.pro_stockCalmed = parseFloat(this.tabProducto.pro_stockCalmed);
            }

            // Calcular pro_reservar como la suma de todas las variables
            pro_reservar = this.tabProducto.pro_stock +
                this.tabProducto.pro_stockCalmed +
                this.tabProducto.pro_deposito +
                this.tabProducto.pro_depositoCalmed;

            if (numeros == 0 || numeros == '') {
                this.tabProducto.year = 0
            } else {
                this.tabProducto.year = numeros;
            }

            if (resultado.length > 0 || resultado2.length > 0) {
                me.$vs.notify({
                    text: 'Ya existe un registro con ese código de producto',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (this.tabProducto.pro_codigo === '' || this.tabProducto.pro_codigo === null) {
                me.$vs.notify({
                    text: 'Escriba el código del Producto antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabProducto.gru_pro_codigo === '' || this.tabProducto.gru_pro_codigo === null) {
                me.$vs.notify({
                    text: 'Seleccione el grupo del producto antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.validarCampoSerie()) {
                console.log('El campo de serie está lleno. Puedes continuar con el guardado.');
            } else {
                me.$vs.notify({
                    text: 'El campo de serie está vacío. No puedes continuar con el guardado.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.requiereProductoPadre(this.tabProducto.gru_pro_codigo)) {
              // validamos que tabProducto.id_pro_codigo_padre no este vacio
              if (this.tabProducto.id_pro_codigo_padre == '' || this.tabProducto.id_pro_codigo_padre === null || this.tabProducto.id_pro_codigo_padre == undefined) {
                  this.errorPadreGuardar = true;
                  this.$forceUpdate();
                  this.$nextTick(() => {
                    me.$vs.notify({
                        text: 'Seleccione el producto padre antes de guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                  });
                  return;
              } else {
                  this.errorPadreGuardar = false;
              }
            }
            if(this.tabProducto.grupo_codigo_para_v3 == '' || this.tabProducto.grupo_codigo_para_v3 === null){
              this.errorGrupoV3Guardar = true;
              this.$forceUpdate();
              this.$nextTick(() => {
                me.$vs.notify({
                    text: 'Ingrese el grupo para v3 antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
              });
              return;
            } else {
              this.errorGrupoV3Guardar = false;
            }
            let datos = {
                "pro_codigo": this.tabProducto.pro_codigo,
                "gru_pro_codigo": this.tabProducto.gru_pro_codigo,
                "pro_nombre": this.tabProducto.pro_nombre,
                "pro_descripcion": this.tabProducto.pro_descripcion,
                "pro_iva": this.tabProducto.pro_iva,
                "pro_valor": parseFloat(this.tabProducto.pro_valor),
                "pro_descuento": parseFloat(this.tabProducto.pro_descuento),
                "pro_reservar": parseFloat(pro_reservar),
                "pro_stock": parseFloat(this.tabProducto.pro_stock),
                "pro_deposito": parseFloat(this.tabProducto.pro_deposito),
                "pro_stockCalmed": parseFloat(this.tabProducto.pro_stockCalmed),
                "pro_depositoCalmed": parseFloat(this.tabProducto.pro_depositoCalmed),
                "pro_costo": parseFloat(this.tabProducto.pro_costo),
                "pro_peso": parseFloat(this.tabProducto.pro_peso),
                "nombrelibro": this.tabProducto.pro_nombre,
                "nombre_imprimir": this.tabProducto.pro_nombre,
                "descripcionlibro": this.tabProducto.pro_descripcion,
                "serie": 0,
                "weblibro": null,
                "pdfsinguia": null,
                "pdfconguia": null,
                "guiadidactica": null,
                "asignatura_idasignatura": null,
                "portada": "portada.png",
                "demo": null,
                "id_serie": this.tabProducto.id_serie,
                "codigo_liquidacion": this.tabProducto.pro_codigo,
                "year": parseInt(this.tabProducto.year),
                "version2": parseInt(this.tabProducto.year),
                "s_weblibro": null,
                "s_pdfsinguia": null,
                "s_pdfconguia": null,
                "s_guiadidactica": null,
                "s_portada": "portada.png",
                "c_weblibro": null,
                "c_pdfsinguia": null,
                "c_pdfconguia": null,
                "c_guiadidactica": null,
                "c_portada": "portada.png",
                "user_created": usuarioObjeto.idusuario,
                "id_pro_codigo_padre": this.tabProducto.id_pro_codigo_padre,
                "grupo_codigo_para_v3": this.tabProducto.grupo_codigo_para_v3
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url + 'Registrar_modificar_producto', datos)
                // this.$http.post(this.$server_url+'guardarLibro', datos2)
                .then(res => {
                    me.$vs.loading.close()
                    // this.getProducto();
                    this.getProductoParametro();
                    me.$vs.notify({
                        text: res.data.message || 'Guardado con éxito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    });
                    this.errorPadreGuardar = false;
                    this.errorPadreEditar = false;
                    this.errorGrupoV3Guardar = false;
                    this.errorGrupoV3Editar = false;
                    this.popupActivoEditar = false;
                    this.popupActivoDesactivar = false;
                    this.popupActivoGuardar = false;
                    this.popupActivoEliminar = false;
                })
                .catch(function () {
                    me.$vs.loading.close();
                    const errorMsg = err.response && err.response.data && err.response.data.message ?
                        err.response.data.message :
                        'Producto no se pudo guardar';
                    me.$vs.notify({
                        text: errorMsg,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    });
                })
        },
        getEditar(tr) {
            this.popupActivoEditar = true
            this.tabProducto.pro_codigo = tr.pro_codigo
            this.pro_codigo_antiguo = tr.pro_codigo
            this.tabProducto.gru_pro_codigo = tr.gru_pro_codigo
            this.id_serie_antiguo = tr.gru_pro_codigo
            this.tabProducto.pro_nombre = tr.pro_nombre
            this.tabProducto.pro_descripcion = tr.pro_descripcion
            this.tabProducto.pro_iva = tr.pro_iva
            this.tabProducto.pro_valor = tr.pro_valor
            this.tabProducto.pro_descuento = tr.pro_descuento
            this.tabProducto.pro_stock = tr.pro_stock
            this.tabProducto.pro_stockCalmed = tr.pro_stockCalmed
            this.tabProducto.pro_deposito = tr.pro_deposito
            this.tabProducto.pro_depositoCalmed = tr.pro_depositoCalmed
            this.tabProducto.pro_costo = tr.pro_costo
            this.tabProducto.pro_peso = tr.pro_peso
            this.tabProducto.id_serie = tr.id_serie
            this.tabProducto.idlibro = tr.idlibro
            this.tabProducto.year = tr.year
            this.tabProducto.sumainicial = tr.sumainicial
            this.tabProducto.valornuevosumado = tr.valornuevosumado
            this.tabProducto.calculoaplicara_pro_reservar = tr.calculoaplicara_pro_reservar
            this.tabProducto.pro_reservar_anterior = tr.pro_reservar_anterior
            this.tabProducto.id_pro_codigo_padre = tr.id_pro_codigo_padre
            this.tabProducto.grupo_codigo_para_v3 = tr.grupo_codigo_para_v3
            this.errorPadreEditar = false
            this.errorGrupoV3Editar = false
        },
        editar() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            const numeros = this.tabProducto.pro_codigo.replace(/\D/g, '');
            // VALIDAR STOCK Y DEPÓSITO
            let pro_reservar = 0;
            // Verificación y ajuste de pro_deposito
            if (this.tabProducto.pro_deposito === 0 || this.tabProducto.pro_deposito === '') {
                this.tabProducto.pro_deposito = 0;
            } else {
                this.tabProducto.pro_deposito = parseFloat(this.tabProducto.pro_deposito);
            }

            // Verificación y ajuste de pro_depositoCalmed
            if (this.tabProducto.pro_depositoCalmed === 0 || this.tabProducto.pro_depositoCalmed === '') {
                this.tabProducto.pro_depositoCalmed = 0;
            } else {
                this.tabProducto.pro_depositoCalmed = parseFloat(this.tabProducto.pro_depositoCalmed);
            }

            // Verificación y ajuste de pro_stock
            if (this.tabProducto.pro_stock === 0 || this.tabProducto.pro_stock === '') {
                this.tabProducto.pro_stock = 0;
            } else {
                this.tabProducto.pro_stock = parseFloat(this.tabProducto.pro_stock);
            }

            // Verificación y ajuste de pro_stockCalmed
            if (this.tabProducto.pro_stockCalmed === 0 || this.tabProducto.pro_stockCalmed === '') {
                this.tabProducto.pro_stockCalmed = 0;
            } else {
                this.tabProducto.pro_stockCalmed = parseFloat(this.tabProducto.pro_stockCalmed);
            }
            // Calcular pro_reservar como la suma de todas las variables
            this.tabProducto.valornuevosumado = (Number(this.tabProducto.pro_stock) || 0) +
                (Number(this.tabProducto.pro_stockCalmed) || 0) +
                (Number(this.tabProducto.pro_deposito) || 0) +
                (Number(this.tabProducto.pro_depositoCalmed) || 0);
            this.calculoaplicara_pro_reservar = this.tabProducto.valornuevosumado - this.tabProducto.sumainicial;
            pro_reservar = this.tabProducto.pro_reservar_anterior + this.calculoaplicara_pro_reservar;
            // console.log("tabProducto", this.calculoaplicara_pro_reservar);
            if (numeros == 0 || numeros == '') {
                this.tabProducto.year = 0
            } else {
                this.tabProducto.year = numeros;
            }
            if (this.tabProducto.pro_codigo === '' || this.tabProducto.pro_codigo === null) {
                me.$vs.notify({
                    text: 'Escriba el código del Vendedor antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            console.log(this.tabProducto.gru_pro_codigo, "grupo codigo");
            if (this.tabProducto.gru_pro_codigo === '' || this.tabProducto.gru_pro_codigo === null) {
                me.$vs.notify({
                    text: 'Seleccione un grupo antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.validarCampoSerie()) {
                console.log('El campo de serie está lleno. Puedes continuar con el guardado.');
            } else {
                me.$vs.notify({
                    text: 'El campo de serie está vacío. No puedes continuar con el guardado.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.requiereProductoPadre(this.tabProducto.gru_pro_codigo) && this.requiereProductoPadre(this.tabProducto.grupo_codigo_para_v3)) {
                // validamos que tabProducto.id_pro_codigo_padre no este vacio
                if (this.tabProducto.id_pro_codigo_padre == '' || this.tabProducto.id_pro_codigo_padre === null || this.tabProducto.id_pro_codigo_padre == undefined) {
                    this.errorPadreEditar = true;
                    this.$forceUpdate();
                    this.$nextTick(() => {
                      me.$vs.notify({
                          text: 'Seleccione el producto padre antes de editar',
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-alert-triangle'
                      });
                    });
                    return;
                } else {
                    this.errorPadreEditar = false;
                }
            }
            if(this.tabProducto.grupo_codigo_para_v3 == '' || this.tabProducto.grupo_codigo_para_v3 === null){
              this.errorGrupoV3Editar = true;
              this.$forceUpdate();
              this.$nextTick(() => {
                me.$vs.notify({
                    text: 'Ingrese el grupo para v3 antes de editar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
              });
              return;
            } else {
              this.errorGrupoV3Editar = false;
            }
            if (this.tabProducto.gru_pro_codigo === 1 || this.tabProducto.gru_pro_codigo === 3 || this.tabProducto.gru_pro_codigo === 6 || this.tabProducto.gru_pro_codigo === '1') {
                let datos = {
                    "pro_codigo": this.tabProducto.pro_codigo,
                    "pro_codigo_antiguo": this.pro_codigo_antiguo,
                    "gru_pro_codigo": this.tabProducto.gru_pro_codigo,
                    "pro_nombre": this.tabProducto.pro_nombre,
                    "pro_descripcion": this.tabProducto.pro_descripcion,
                    "pro_iva": this.tabProducto.pro_iva,
                    "pro_valor": parseFloat(this.tabProducto.pro_valor),
                    "pro_descuento": parseFloat(this.tabProducto.pro_descuento),
                    "pro_reservar": parseFloat(pro_reservar),
                    "pro_stock": parseFloat(this.tabProducto.pro_stock),
                    "pro_deposito": parseFloat(this.tabProducto.pro_deposito),
                    "pro_stockCalmed": parseFloat(this.tabProducto.pro_stockCalmed),
                    "pro_depositoCalmed": parseFloat(this.tabProducto.pro_depositoCalmed),
                    "pro_costo": parseFloat(this.tabProducto.pro_costo),
                    "pro_peso": parseFloat(this.tabProducto.pro_peso),
                    "nombrelibro": this.tabProducto.pro_nombre,
                    "nombre_imprimir": this.tabProducto.pro_nombre,
                    "descripcionlibro": this.tabProducto.pro_descripcion,
                    "idlibro": this.tabProducto.idlibro,
                    "id_serie": this.tabProducto.id_serie,
                    "codigo_liquidacion": this.tabProducto.pro_codigo,
                    "year": parseInt(this.tabProducto.year),
                    "version2": parseInt(this.tabProducto.year),
                    "user_created": usuarioObjeto.idusuario,
                    "id_pro_codigo_padre": this.tabProducto.id_pro_codigo_padre,
                    "grupo_codigo_para_v3": this.tabProducto.grupo_codigo_para_v3
                }
                // console.log(datos, "datos a enviar");
                // return;
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
                this.$http.post(this.$server_url + 'Registrar_modificar_producto', datos)
                    // this.$http.post(this.$server_url+'guardarLibro', datos2)
                    .then(res => {
                        me.$vs.loading.close()
                        //this.getProducto();
                        if (me.valorBusqueda == 0 || me.valorBusqueda == 1) {
                            this.getProductoParametro();
                        } else if (me.valorBusqueda == 2) {
                            this.getProductos_inactivos();
                        } else if (me.valorBusqueda == 3) {
                            this.getProductos_stockminimo();
                        }

                        me.$vs.notify({
                            text: res.data.message || 'Producto guardado con éxito',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });

                        this.errorPadreGuardar = false;
                        this.errorPadreEditar = false;
                        this.popupActivoEditar = false;
                        this.popupActivoDesactivar = false;
                        this.popupActivoGuardar = false;
                        this.popupActivoEliminar = false;
                    })
                    .catch(function () {
                        me.$vs.loading.close();
                        const errorMsg = err.response && err.response.data && err.response.data.message ?
                            err.response.data.message :
                            'Producto no se pudo guardar';
                        me.$vs.notify({
                            text: errorMsg,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        });
                    })
            } else {
                // console.log("dos");
                if (this.id_serie_antiguo == 1 || this.id_serie_antiguo == 3 || this.id_serie_antiguo == 6) {
                    me.$vs.notify({
                        text: 'No tiene permitido cambiar de grupo',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    });
                    return;
                } else {
                    let datos = {
                        "pro_codigo": this.tabProducto.pro_codigo,
                        "gru_pro_codigo": this.tabProducto.gru_pro_codigo,
                        "pro_codigo_antiguo": this.pro_codigo_antiguo,
                        "pro_nombre": this.tabProducto.pro_nombre,
                        "pro_descripcion": this.tabProducto.pro_descripcion,
                        "pro_iva": this.tabProducto.pro_iva,
                        "pro_valor": parseFloat(this.tabProducto.pro_valor),
                        "pro_reservar": parseFloat(pro_reservar),
                        "pro_descuento": parseFloat(this.tabProducto.pro_descuento),
                        "pro_stock": parseFloat(this.tabProducto.pro_stock),
                        "pro_deposito": parseFloat(this.tabProducto.pro_deposito),
                        "pro_stockCalmed": parseFloat(this.tabProducto.pro_stockCalmed),
                        "pro_depositoCalmed": parseFloat(this.tabProducto.pro_deposito),
                        "pro_costo": parseFloat(this.tabProducto.pro_costo),
                        "pro_peso": parseFloat(this.tabProducto.pro_peso),
                        'id_pro_codigo_padre': this.tabProducto.id_pro_codigo_padre,
                        "grupo_codigo_para_v3": this.tabProducto.grupo_codigo_para_v3,
                    }
                    // console.log(datos, "datos3 a enviar");
                    // return;
                    me.$vs.loading()
                    //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
                    this.$http.post(this.$server_url + 'Registrar_modificar_producto', datos)
                        .then(res => {
                            me.$vs.loading.close()
                            //this.getProducto();
                            this.getProductoParametro();

                            me.$vs.notify({
                                text: res.data.message || 'Producto guardado con éxito',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });

                            this.errorPadreGuardar = false;
                            this.errorPadreEditar = false;
                            this.errorGrupoV3Guardar = false;
                            this.errorGrupoV3Editar = false;
                            this.popupActivoEditar = false;e;
                            this.errorGrupoV3Editar = false;
                            this.popupActivoEditar = false;
                            this.popupActivoDesactivar = false;
                            this.popupActivoGuardar = false;
                            this.popupActivoEliminar = false;
                        })
                        .catch(function () {
                            me.$vs.loading.close();
                            const errorMsg = err.response && err.response.data && err.response.data.message ?
                                err.response.data.message :
                                'Producto no se pudo guardar';
                            me.$vs.notify({
                                text: errorMsg,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        })
                }
            }
        },
        popup_desactivar_activar_producto(tr) {
            this.popupActivoDesactivar = true
            this.pro_codigo = tr.pro_codigo
            this.tabProducto.pro_estado = tr.pro_estado
        },
        desactivar_activar_producto() {
            let me = this;
            let valornuevo = this.tabProducto.pro_estado;
            // console.log(valornuevo + 'valornuevoeatdoprocutp' + this.pro_codigo);
            if (valornuevo == 1) {
                valornuevo = 0;
                let datos = {
                    "pro_codigo": this.pro_codigo,
                    "pro_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url + 'Desactivar_producto', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        this.getProductoParametro();
                        me.$vs.notify({
                            text: 'Cambio de estado exitoso',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        this.popupActivoEditar = false;
                        this.popupActivoDesactivar = false;
                        this.popupActivoGuardar = false;
                        this.popupActivoEliminar = false;
                    })
                    .catch(error => {
                        console.log(error);
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'No se pudo realizar el cambio de estado',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            } else if (valornuevo == 0) {
                valornuevo = 1;
                let datos = {
                    "pro_codigo": this.pro_codigo,
                    "pro_estado": valornuevo,
                }
                me.$vs.loading()
                //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
                this.$http.post(this.$server_url + 'Desactivar_producto', datos)
                    .then(res => {
                        me.$vs.loading.close()
                        this.getProductos_inactivos();
                        me.$vs.notify({
                            text: 'Cambio de estado exitoso',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        this.popupActivoEditar = false;
                        this.popupActivoDesactivar = false;
                        this.popupActivoGuardar = false;
                        this.popupActivoEliminar = false;
                    })
                    .catch(error => {
                        console.log(error);
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'No se pudo realizar el cambio de estado',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                    })
            }

        },
        getPreguntaEliminar(tr) {
            this.popupActivoEliminar = true
            this.pro_codigo = tr.pro_codigo
            this.pro_nombre = tr.pro_nombre
            this.valorBusqueda = '0'
        },
        getEliminar() {
            let me = this;
            let datos = {
                "pro_codigo": this.pro_codigo,
                "pro_nombre": this.pro_nombre,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "Eliminar_producto", datos)
                .then(data => {
                    me.$vs.loading.close()
                    //this.getProducto();
                    this.getProductoParametro();
                    me.$vs.notify({
                        text: 'Producto eliminado con exito',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })

                    this.popupActivoEditar = false;
                    this.popupActivoDesactivar = false;
                    this.popupActivoGuardar = false;
                    this.popupActivoEliminar = false;
                })
                .catch(function () {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Producto no se pudo eliminar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        getCancelar() {
            this.popupActivoEditar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
            this.popupActivoDesactivar = false;
        },
        exportarCombos() {
        let me = this;

        // Paso 1: Determinar el máximo número de productos en combos
        let maxProductosCombo = Math.max(
          ...me.Productos.map(p => (p.productosCombo ? p.productosCombo.length : 0))
        );

        // Paso 2: Crear encabezados
        let headers = ['Codigo', 'Nombre', 'Descripcion'];
        let fieldKeys = ['codigo', 'pro_nombre', 'descripcion'];

        for (let i = 1; i <= maxProductosCombo; i++) {
          headers.push(`Codigo${i}`);
          fieldKeys.push(`codigo${i}`);
        }

        // Paso 3: Crear datos planos
        let datosPlano = me.Productos.map(producto => {
          let objPlano = {
            codigo: producto.pro_codigo,
            pro_nombre: producto.pro_nombre,         // <- nuevo campo
            descripcion: producto.pro_descripcion,   // <- ya existente
          };

          if (producto.productosCombo && Array.isArray(producto.productosCombo)) {
            producto.productosCombo.forEach((item, idx) => {
              objPlano[`codigo${idx + 1}`] = `${item.pro_codigo} - ${item.pro_nombre}`;
            });
          }

          return objPlano;
        });

        // Paso 4: Exportar
        let nameFile = 'Reporte_Productos';
        me.m_exportTodo(headers, fieldKeys, datosPlano, nameFile);
      },
      // Métodos para histórico individual
      verHistoricoIndividual(tr) {
        let me = this;
        me.productoHistoricoSeleccionado = {
            pro_codigo: tr.pro_codigo,
            pro_nombre: tr.pro_nombre,
        };
        me.popupHistoricoIndividual = true;
        me.cargarHistoricoIndividual(tr.pro_codigo);
      },
      cargarHistoricoIndividual(pro_codigo) {
        let me = this;
        me.$vs.loading();
        me.$http.get(me.$server_url + 'GetHistoricoStockProducto?pro_codigo=' + pro_codigo)
            .then(function (res) {
                me.$vs.loading.close();
                // Los datos ya vienen procesados desde el backend
                me.historicoIndividualData = res.data.map(item => {
                    return {
                        fecha: item.fecha,
                        usuario: item.usuario_nombre || 'N/A',
                        tipo: item.psh_tipo,
                        tipo_texto: me.getTipoTexto(item.psh_tipo),
                        stock_calmed_anterior: item.stock_calmed_anterior !== null ? item.stock_calmed_anterior : 'N/A',
                        stock_calmed_nuevo: item.stock_calmed_nuevo !== null ? item.stock_calmed_nuevo : 'N/A',
                        diferencia_calmed: item.diferencia_calmed !== null ? item.diferencia_calmed : 0,
                        reservar_anterior: item.reservar_anterior !== null ? item.reservar_anterior : 'N/A',
                        reservar_nuevo: item.reservar_nuevo !== null ? item.reservar_nuevo : 'N/A',
                        diferencia_reservar: item.diferencia_reservar !== null ? item.diferencia_reservar : 0,
                        referencia: item.psh_id_ven_codigo || 'N/A',
                    };
                });
            })
            .catch(function (error) {
                me.$vs.loading.close();
                console.log(error);
                me.$vs.notify({
                    text: 'Error al cargar el histórico del producto',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-x'
                });
            });
      },
      getTipoTexto(tipo) {
        const tipos = {
            0: 'Textos y Guías Edición Masiva',
            1: 'Combos Edición Masiva',
            2: 'Movimiento no Operativo - Ingreso',
            3: 'Movimiento no Operativo - Egreso',
            4: 'Generación de documento de venta',
            5: 'Pedido de Guías anuladas',
            6: 'Creación compra de orden de producción',
            7: 'Edición compra de orden de producción',
            8: 'Mover Stock a Depósito CALMED',
            9: 'Devolución de códigos por documentos',
            10: 'Igualar la venta a la proforma',
            11: 'Anulación de pedido hijos docentes/obsequios',
            12: 'Devolución de códigos por Sueltos',
            13: 'Pedido de Guías',
            14: 'Devolución de Guías (Asesor)',
            15: 'Anulación de venta',
        };
        return tipos[tipo] || 'Tipo no controlado';
      },
      getTipoColor(tipo) {
        const colores = {
            0: 'warning',     // Textos y Guías Edición Masiva
            1: 'primary',     // Combos Edición Masiva
            2: 'success',     // Movimiento no Operativo - Ingreso
            3: 'danger',      // Movimiento no Operativo - Egreso
            4: 'danger',      // Generación de documento de venta
            5: 'dark',        // Pedido de Guías anuladas
            6: 'info',        // Creación compra de orden de producción
            7: 'info',        // Edición compra de orden de producción
            8: 'primary',     // Mover Stock a Depósito CALMED
            9: 'success',     // Devolución de códigos por documentos
            10: 'warning',    // Igualar la venta a la proforma
            11: 'dark',       // Anulación de pedido hijos docentes/obsequios
            12: 'success',    // Devolución de códigos por Sueltos
            13: 'info',       // Pedido de Guías
            14: 'success',    // Devolución de Guías (Asesor)
            15: 'dark',       // Anulación de venta
        };
        return colores[tipo] || 'gray';
      },
      cerrarHistoricoIndividual() {
        this.popupHistoricoIndividual = false;
        this.historicoIndividualData = [];
        this.filtroHistoricoIndividual = {
            busqueda: '',
            tipo: '',
            movimiento: '',
        };
      },
      limpiarFiltrosHistorico() {
        this.filtroHistoricoIndividual = {
            busqueda: '',
            tipo: '',
            movimiento: '',
        };
      },
      getTipoColorBg(tipo) {
        const colores = {
            0: '#fff9e6', 1: '#e8f4fd', 2: '#e8f8f5', 3: '#fde8e8', 4: '#fde8e8',
            5: '#f4e8fd', 6: '#e8f4fd', 7: '#e8f4fd', 8: '#e8f4fd', 9: '#e8f8f5',
            10: '#fff9e6', 11: '#f4e8fd', 12: '#e8f8f5', 13: '#e8f4fd', 14: '#e8f8f5',
            15: '#f4e8fd',
        };
        return colores[tipo] || '#f8f9fa';
      },
      getTipoColorText(tipo) {
        const colores = {
            0: '#d68910', 1: '#2874a6', 2: '#16a085', 3: '#c0392b', 4: '#c0392b',
            5: '#8e44ad', 6: '#2874a6', 7: '#2874a6', 8: '#2874a6', 9: '#16a085',
            10: '#d68910', 11: '#8e44ad', 12: '#16a085', 13: '#2874a6', 14: '#16a085',
            15: '#8e44ad',
        };
        return colores[tipo] || '#5d6d7e';
      },
      getTipoColorBorder(tipo) {
        const colores = {
            0: '#f9ca7b', 1: '#85c1e9', 2: '#7dcea0', 3: '#ec7063', 4: '#ec7063',
            5: '#bb8fce', 6: '#85c1e9', 7: '#85c1e9', 8: '#85c1e9', 9: '#7dcea0',
            10: '#f9ca7b', 11: '#bb8fce', 12: '#7dcea0', 13: '#85c1e9', 14: '#7dcea0',
            15: '#bb8fce',
        };
        return colores[tipo] || '#d5dbdb';
      },
      exportarHistoricoIndividual() {
        let me = this;
        let headers = ['Fecha', 'Usuario', 'Tipo', 'Entrada', 'Salida', 'Stock General', 'Referencia'];
        let data = me.historicoFiltrado.map(item => ({
            fecha: item.fecha,
            usuario: item.usuario,
            tipo_texto: item.tipo_texto,
            entrada: item.diferencia_calmed > 0 ? item.diferencia_calmed : '',
            salida: item.diferencia_calmed < 0 ? Math.abs(item.diferencia_calmed) : '',
            stock_general: item.reservar_nuevo !== null && item.reservar_nuevo !== 'N/A' ? item.reservar_nuevo : '',
            referencia: item.referencia,
        }));
        let fieldKeys = ['fecha', 'usuario', 'tipo_texto', 'entrada', 'salida', 'stock_general', 'referencia'];
        let nameFile = `Historico_${me.productoHistoricoSeleccionado.pro_codigo}`;
        me.m_exportTodo(headers, fieldKeys, data, nameFile);
      }
    },
    // created(){
    //     let url = "https://localhost:7252/api/Vendedor";
    //     axios.get(url).then((response) => this.Vendedores = response.data);
    //     // fetch("https://localhost:7252/api/Vendedor/")
    //     // .then(response => response.json())
    //     // .then((data) => (this.Vendedores = data));
    //     // // .then(data => (this.totalVuePackages = data.total));
    // }
}
</script>

<style scoped>
.text-red {
    color: red;
    font-weight: bold;
}

.text-orange {
    color: orange;
    font-weight: bold;
}

.text-green {
    color: green;
    font-weight: bold;
}

.bordeglosario {
    border: 1px solid #000;
    margin: 0px;
    padding: 0px;
}

.informacionformhijo {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}

.input-error {
    border: 2px solid red !important;
}

.input-error /deep/ .vs__control {
    border-color: red !important;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.3) !important;
}

.input-error /deep/ .vs__dropdown-toggle {
    border: 2px solid red !important;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.3) !important;
}
</style>
