<template>
<vx-card fixed-height="true">
    <vs-row vs-justify="flex-start">
        <vs-button type="border" color="success" class="mr-2" @click="verificar()">Agregar orden de trabajo</vs-button>
        <vx-tooltip v-if="Ordentrabajo.length === 0" text="Realice una búsqueda primero para exportar" position="bottom" color="warning" style="display: inline-block;">
            <vs-button color="success" disabled class="mr-2" type="border">
                <ion-icon name="download-outline"></ion-icon> Exportar Excel (0)
            </vs-button>
        </vx-tooltip>
        <vs-button v-else color="success" class="mr-2" @click="Accion_ExportarExcel()">
            <ion-icon name="download-outline"></ion-icon> Exportar Excel ({{ Ordentrabajo.length }})
        </vs-button>
        <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
            <p>Búsqueda por filtros</p>
            <br />
            <vs-card class="seccionmostrartodo">
                <div>
                    <div v-if="valorBusqueda == '0'">
                        <vs-input class="w-full" @keyup.enter="getOrdenParametro()" icon-after="true" label-placeholder="icon-after" style="margin: 0px 0px 20px 0px" icon="search" placeholder="Buscar" v-model="busquedaxcodigo" />
                    </div>
                    <div v-if="valorBusqueda == '3'">
                        <vs-row style="margin: 0px 0px 20px 0px">
                            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                    <font style="font-size: 11.5px">&nbsp;Temporada:</font><br />
                                    <v-select multiple :closeOnSelect="false" :options="options1" :reduce="(options1) => options1" label="text" class="w-full" value="value" placeholder="--Seleccione--" v-model="region" />
                                </vs-col>
                            </vs-row>
                            <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                                <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                                    <font style="font-size: 11.5px">&nbsp;Año:</font><br />
                                    <v-select multiple :closeOnSelect="false" :options="options2" :reduce="(options2) => options2" label="text" class="w-full " value="value" placeholder="--Seleccione--" v-model="anio" />
                                </vs-col>
                            </vs-row>
                        </vs-row>
                    </div>
                    <div v-else></div>
                </div>
                <div>
                    <ul class="leftx" style="display: flex; margin: 0px 0px 0px 20px">
                        <li class="modelx"></li>
                        <li style="margin: 10px 20px 0px 0px">
                            <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda = 'codigo'">Código</vs-radio>
                        </li>
                        <li style="margin: 10px 10px 0px 0px">
                            <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda" @input="busqueda = 'pendiente';getOrdenParametro()">Pendientes</vs-radio>
                        </li>
                        <li style="margin: 10px 10px 0px 0px">
                            <vs-radio vs-name="radios3" vs-value="2" v-model="valorBusqueda" @input="busqueda = 'finalizado';getOrdenParametro()">Finalizado</vs-radio>
                        </li>
                        <li style="margin: 10px 10px 0px 0px">
                            <vs-radio vs-name="radios3" vs-value="3" v-model="valorBusqueda" @input="busqueda = 'temporada'">Temporada</vs-radio>
                        </li>
                        <li>
                            <vs-button color="warning" type="filled" style="margin-left: 10px" @click="getOrdenParametro()" icon="search"></vs-button>
                        </li>
                    </ul>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
    <TableOrdenesVue :Ordentrabajo="Ordentrabajo" @popup_desactivar_activar_orden="popup_desactivar_activar_orden" @getDeta="getDeta" @getEditar="getEditar" @getPreguntaEliminar="getPreguntaEliminar" @getExcelx="getExcelx" @getPDF="getPDF" />

    <!-- SECCION REGISTRO -->

    <!-- SECCION REGISTRO -->
    <vs-popup class="crear informacionformhijo1" title="Generar orden de trabajo" :active.sync="popupActivoGuardar" fullscreen>
        <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b style="color: blue">SELECCIONE LA TEMPORADA Y AÑO</b></vs-col>
        <vs-row style="height: 150px">
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">&nbsp;Temporada:</font><br />
                        <v-select :options="options1" :reduce="(options1) => options1" placeholder="--Seleccione--" label="text" class="small" style="height: 30px" v-model="tabTemporada.temp" @input="Validarselects()" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10">
                        <font style="font-size: 11.5px">&nbsp;Año:</font><br />
                        <v-select :options="options2" :reduce="(options2) => options2" placeholder="--Seleccione--" label="text" class="small" @input="Validarselects()" v-model="tabTemporada.anio" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <template v-if='tabTemporada.temp && tabTemporada.anio'>
            <vs-row style="margin-top: -80px">
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                </vs-col>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>REGISTRO DE ORDEN DE TRABAJO</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <vs-input label="Código:" class="w-full" icon="error_outline" disabled v-model="tabOrdenTrabajo.codigo" />
                        </vs-col>
                    </vs-row>
                    <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <vs-input label="Fecha:" class="w-full" icon="error_outline" disabled v-model="tabOrdenTrabajo.fecha" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <p>Empresa: *</p>
                            <v-select :options="listaEmpresas" :reduce="listaEmpresas => listaEmpresas.id" label="nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabOrdenTrabajo.empresa" />
                        </vs-col>
                    </vs-row>
                    <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <p>Proveedor: *</p>
                            <v-select :options="options4" :reduce="(options4) => options4.prov_codigo" density="comfortable" label="prov_nombre" class="w-full" value="prov_codigo" placeholder="--Seleccione--" v-model="tabOrdenTrabajo.prov_codigo" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <p>Aprobado por: *</p>
                            <vs-input placeholder="Nombre" class="w-full" v-model="tabOrdenTrabajo.aprobado" />
                        </vs-col>
                    </vs-row>
                    <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <p>Solicitado por: *</p>
                            <vs-input placeholder="Nombre" class="w-full" v-model="tabOrdenTrabajo.solicitado" />
                        </vs-col>
                    </vs-row>
                    <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <p>Elaborado por: *</p>
                            <vs-input placeholder="Nombre" class="w-full" v-model="tabOrdenTrabajo.elaborado" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                            <vs-textarea label="Observación: *" placeholder="Escribe..." class="w-full" icon="mode_edit" v-model="tabOrdenTrabajo.observacion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <div style="display: inline-flex;">
                            <b>¿La órden va a contener productos duplicados? &emsp;</b>
                            <vs-switch color="primary" :class="classValidarSwitch_nuevo" vs-icon-on="check_box" vs-icon-off="block" v-model="switchduplicarproductos_nuevo" :disabled="deshabilitarSwitch" @change="getmetodoconfirmacioncambiarEstadoSwitch()">
                                <span slot="on">SI</span>
                                <span slot="off">NO</span>
                            </vs-switch>
                        </div>
                    </vs-row>
                    <br>
                </vs-col>
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Añadir productos.</b></vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="block" vs-justify="center" vs-align="center" vs-w="7" vs-sm="9" class="m-2">
                            <!-- Select para elegir productos -->
                            <v-select placeholder="--Buscar y seleccionar--" label="nombre_completo" class="mb-4 w-full h-100" :options="options3" :reduce="(option) => option" @option:selected="Productos_a_agregar_nuevo" v-model="productoSeleccionado" :filter="customFilter"></v-select>
                            <!-- Tabla para mostrar productos seleccionados -->
                            <div align="center">
                                <table v-if="productosSeleccionados.length" class="tabla-seleccionados" border="1">
                                    <thead>
                                        <tr>
                                            <th colspan="4" style="text-align: center; font-size: 16px; border: 0.5px solid #000;">Productos para añadir a la orden de producción</th>
                                        </tr>
                                        <tr>
                                            <th>#</th>
                                            <th>Producto</th>
                                            <th>Código</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(item, index) in productosSeleccionados" :key="index">
                                            <td>{{ index + 1 }}</td>
                                            <td>{{ item.pro_nombre }}</td>
                                            <td>{{ item.pro_codigo }}</td>
                                            <td align="center">
                                                <vs-tooltip text="Quitar" position="right" color="danger">
                                                    <template>‎</template>
                                                    <vs-button style="display: inline-flex;" color="danger" radius type="gradient" icon="clear" @click="eliminarProducto(index)"></vs-button>
                                                </vs-tooltip>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <!-- <p v-else>No hay productos seleccionados.</p> -->
                            </div>
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="1" vs-sm="1">
                            <vs-tooltip text="Agregar a la órden de producción" position="right" color="primary">
                                <template>‎</template>
                                <vs-button style="display: inline-block;" color="success" type="relief" icon="add" @click="add(k)"></vs-button>
                            </vs-tooltip>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                                <v-select style="width: 100%;" placeholder="--Buscar y seleccionar--" multiple :closeOnSelect="false" v-model="pro_codigo" label="pro_nombre" class="mb-4" :options="options3" :reduce="(options3) => options3.pro_codigo" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                            </vs-col>
                            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="1" vs-sm="1" class="m-2">
                                <vs-button color="success" type="relief" icon="add" @click="add(k)"></vs-button>
                            </vs-col>
                        </vs-row>
                    </vs-col> -->
                <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Detalle de orden</b></vs-col>

                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
                    <br />

                    <vs-table :data="inputs">
                        <vs-tr v-for="(input, k) in inputs" :key="k">
                            <vs-td width="50"><br /><b>{{ k + 1 }}</b></vs-td>
                            <vs-td width="550">
                                <b>Libro {{input.pro_nombre}}</b><br>
                                <b>Id: </b> {{input.pro_codigo}}<br>
                            </vs-td>
                            <vs-td width="550">
                                <b>Páginas: </b> {{input.pro_int_pagina}}<br>
                                <b>Tamaño: </b> {{input.pro_tamaño}}<br>
                                <div class="acabados-row">
                                    <vx-tooltip text="Cambiar acabado" position="left" color="primary">
                                        <vs-button icon="swap_horiz" size="small" color="primary" class="acabados-btn" @click="get_Proacabado_seleccion(input.pro_codigo, k, 'crear')" />
                                    </vx-tooltip>
                                    <b>Acabados:</b>
                                    <span>{{ input.pro_acabados }}</span>
                                </div>
                                <br>
                                <b>Recubrimiento: </b> {{input.pro_cub_recubrimiento}}<br>
                                <b>Código Interior: </b> {{input.mat_in_codigo}}<br>
                                <b>Tintas Interior: </b> {{input.pro_int_tinta}}<br>
                                <b>Código Cubierta: </b> {{input.mat_cub_codigo}}<br>
                                <b>Tintas Cubierta:: </b> {{input.pro_cub_tintas}}<br>
                            </vs-td>
                            <vs-td width="1000">
                                <vs-input label="Cantidad: *" class="w-full m-1" placeholder="2010" icon="mode_edit" type="number" @keydown="filterKey" v-model="input.cantidad" />

                                <vs-input label="Posible Entrega: *" class="w-full" type="date" v-model="input.fe_entrega" />
                                <vs-textarea label="Observaciones: *" placeholder="Escribe......" icon="mode_edit" class="w-full" v-model="input.observacion" />
                            </vs-td>
                            <vs-td v-if="inputs.length>0">
                                <vs-tooltip text="Quitar de la órden" position="top" color="danger">
                                    <template>‎</template>
                                    <vs-button style="display: inline-block;" v-if="k > -1" @click="remove(k)" color="danger" type="relief" icon="delete"></vs-button>
                                </vs-tooltip>
                            </vs-td>
                        </vs-tr>
                    </vs-table>
                </vs-col>
            </vs-row>
            <br /><br />
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="getTemporada()" color="warning" type="relief">Limpiar</vs-button>&emsp;
                <vs-button @click="guardarnuevo1()" color="success" type="relief">Guardar</vs-button>&emsp;
                <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </template>
    </vs-popup>
    <!-- detalles -->
    <vs-popup class="detalle" :title="`Detalles orden de trabajo: ${tabOrdenTrabajo.codigo}`" :active.sync="popupdetalle" fullscreen>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <vs-input label="Código:" class="w-full" icon="error_outline" disabled v-model="tabOrdenTrabajo.codigo" />
                    </vs-col>
                </vs-row>
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <vs-input label="Fecha: " class="w-full" icon="error_outline" disabled v-model="tabOrdenTrabajo.fecha" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <p>Proveedor: *</p>
                        <v-select :options="options4" :reduce="(options4) => options4.prov_codigo" density="comfortable" label="prov_nombre" class="w-full" value="prov_codigo" placeholder="--Seleccione--" v-model="tabOrdenTrabajo.prov_codigo" disabled />
                    </vs-col>
                </vs-row>
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <p>Empresa: *</p>
                        <v-select :options="listaEmpresas" :reduce="listaEmpresas => listaEmpresas.id" label="nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabOrdenTrabajo.empresa" disabled />
                    </vs-col>
                </vs-row>

            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <p>Aprobado por: *</p>
                        <vs-input placeholder="Nombre" disabled class="w-full" v-model="tabOrdenTrabajo.aprobado" />
                    </vs-col>
                </vs-row>
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <p>Solicitado por: *</p>
                        <vs-input placeholder="Nombre" disabled class="w-full" v-model="tabOrdenTrabajo.solicitado" />
                    </vs-col>
                </vs-row>
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <p>Elaborado por: *</p>
                        <vs-input placeholder="Nombre" disabled class="w-full" v-model="tabOrdenTrabajo.elaborado" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <vs-textarea label="Observación: *" placeholder="Escribe..." class="w-full" icon="error_outline" v-model="tabOrdenTrabajo.observacion" disabled />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Detalle de orden</b></vs-col>
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
                <br />
                <vs-table :data="inputs">
                    <vs-tr v-for="(input, k) in inputs" :key="k">
                        <vs-td width="50"><br /><b>{{ k + 1 }}</b></vs-td>
                        <vs-td width="550">
                            <b>Libro {{input.pro_nombre}}</b><br>
                            <b>Id: </b> {{input.pro_codigo}}<br>
                        </vs-td>
                        <vs-td width="550">
                            <b>Páginas: </b> {{input.det_or_int_paginas}}<br>
                            <b>Tamaño: </b> {{input.det_or_tamaño}}<br>
                            <b>Acabados: </b> {{input.det_or_acabados}}<br>
                            <b>Recubrimiento: </b> {{input.det_or_recubrimiento}}<br>
                            <b>Código Interior: </b> {{input.det_or_in_codigo}}<br>
                            <b>Tintas Interior: </b> {{input.det_or_in_tintas}}<br>
                            <b>Código Cubierta: </b> {{input.mat_cub_codigo}}<br>
                            <!-- <b>Tintas Cubierta:: </b> {{input.det_or_cub_tintas}}<br> -->
                        </vs-td>
                        <vs-td width="800">
                            <b>Cantidad: </b> {{input.det_or_cantidad}}<br>
                            <b>Posible Entrega: </b> {{input.det_or_posible_entrega}}<br>
                            <b>Observaciones: </b> {{input.det_or_observaciones}}<br>

                        </vs-td>

                    </vs-tr>
                </vs-table>
            </vs-col>
        </vs-row>
        <br /><br />
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>

    <!-- SECCION EDITAR -->
    <vs-popup class="editar informacionformhijo1" :title="`Edición orden de trabajo: ${tabOrdenTrabajo.codigo}`" :active.sync="popupActivoEditar" fullscreen>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <vs-input label="Código:" class="w-full" icon="error_outline" disabled v-model="tabOrdenTrabajo.codigo" />
                    </vs-col>
                </vs-row>
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <vs-input label="Fecha: " class="w-full" icon="error_outline" disabled v-model="tabOrdenTrabajo.fecha" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <p>Empresa: *</p>
                        <v-select :options="listaEmpresas" :reduce="listaEmpresas => listaEmpresas.id" label="nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabOrdenTrabajo.empresa" />
                    </vs-col>
                </vs-row>
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <p>Proveedor: *</p>
                        <v-select :options="options4" :reduce="(options4) => options4.prov_codigo" density="comfortable" label="prov_nombre" class="w-full" value="prov_codigo" placeholder="--Seleccione--" v-model="tabOrdenTrabajo.prov_codigo" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <p>Aprobado por: *</p>
                        <vs-input placeholder="Nombre" class="w-full" v-model="tabOrdenTrabajo.aprobado" />
                    </vs-col>
                </vs-row>
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <p>Solicitado por: *</p>
                        <vs-input placeholder="Nombre" class="w-full" v-model="tabOrdenTrabajo.solicitado" />
                    </vs-col>
                </vs-row>
                <vs-row vs-type="flex" vs-justify="center" vs-w="6">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <p>Elaborado por: *</p>
                        <vs-input placeholder="Nombre" class="w-full" v-model="tabOrdenTrabajo.elaborado" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="10" class="m-2">
                        <vs-textarea label="Observación: *" placeholder="Escribe..." class="w-full" icon="mode_edit" v-model="tabOrdenTrabajo.observacion" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <div style="display: inline-flex;">
                        <b>¿La órden va a contener productos duplicados? &emsp;</b>
                        <vs-switch style="width: 55px;" :class="classValidarSwitch_edit" color="primary" vs-icon-on="check_box" vs-icon-off="block" v-model="switchduplicarproductos_edit" :disabled="deshabilitarSwitch" @change="getmetodoconfirmacioncambiarEstadoSwitch()">
                            <span slot="on">SI</span>
                            <span slot="off">NO</span>
                        </vs-switch>
                    </div>
                </vs-row>
                <br>
                <div align="center">
                    <vs-button @click="getDetallar(tabOrdenTrabajo.codigo)" type="relief">Agregar más Productos</vs-button>
                </div>
                <br>
            </vs-col>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Detalle de orden</b></vs-col>
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
                <br />
                <vs-table :data="inputs">
                    <vs-tr v-for="(input, k) in inputs" :key="k">
                        <vs-td width="50"><br /><b>{{ k + 1 }}</b></vs-td>
                        <vs-td width="350">
                            <b>Libro {{input.pro_nombre}}</b><br>
                            <b>Id: </b> {{input.pro_codigo}}<br>
                        </vs-td>
                        <vs-td width="750">
                            <table class="table1">
                                <tr>
                                    <td>
                                        <b>Páginas: </b>
                                    </td>
                                    <td>
                                        <vs-input size="small" class="w-full" v-model="input.det_or_int_paginas" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Tamaño: </b></td>
                                    <td>
                                        <vs-input size="small" class="w-full" v-model="input.det_or_tamaño" />
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <div class="acabados-row">
                                            <vx-tooltip text="Cambiar acabado" position="left" color="primary">
                                                <vs-button color="primary" type="gradient" size="small" icon="swap_horiz" @click="get_Proacabado_seleccion(input.pro_codigo, k, 'editar')" />
                                            </vx-tooltip>
                                            <b>Acabados:</b>
                                            <span>{{ input.pro_acabados }}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <vs-textarea size="small" class="w-full" v-model="input.det_or_acabados" style="margin:0px;" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Recubrimiento: </b></td>
                                    <td>
                                        <vs-input size="small" class="w-full" v-model="input.det_or_recubrimiento" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Código Interior: </b></td>

                                    <td>
                                        <v-select :options="MaterialInterior" :reduce="MaterialInterior => MaterialInterior.mat_in_codigo" label="mat_in_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="input.det_or_in_codigo" />
                                        <vs-input size="small" class="w-full" v-model="input.det_or_in_codigo" disabled />
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Tintas Interior: </b></td>
                                    <td>
                                        <vs-input size="small" class="w-full" v-model="input.det_or_in_tintas" />
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Código Cubierta: </b></td>
                                    <td>
                                        <v-select :options="MaterialCubierta" :reduce="MaterialCubierta => MaterialCubierta.mat_cub_codigo" label="mat_cub_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="input.mat_cub_codigo" />
                                        <vs-input size="small" class="w-full" v-model="input.mat_cub_codigo" disabled />
                                    </td>
                                </tr>
                                <tr>
                                    <td><b>Tintas Cubierta: </b></td>
                                    <td>
                                        <vs-input size="small" class="w-full" v-model="input.det_or_cub_tintas" />
                                    </td>
                                </tr>
                            </table>
                        </vs-td>
                        <vs-td width="900">

                            <vs-input label="Cantidad:" class="w-full m-1" placeholder="2010" icon="mode_edit" type="number" min="0" @keydown="filterKey" v-model="input.det_or_cantidad" />
                            <vs-input label="Posible Entrega: " class="w-full m-1" v-model="input.det_or_posible_entrega" />
                            <vs-textarea label="Observaciones: " placeholder="Escribe......" icon="mode_edit" class="w-full" v-model="input.det_or_observaciones" />
                        </vs-td>

                        <vs-td>
                            <vs-tooltip text="Quitar de la órden" position="top" color="danger">
                                <template>‎</template>
                                <vs-button style="display: inline-block;" v-if="k > -1" @click="getremove1(k, input.det_or_codigo)" color="danger" type="relief" icon="delete"></vs-button>
                            </vs-tooltip>
                        </vs-td>
                    </vs-tr>
                </vs-table>
            </vs-col>
        </vs-row>
        <br /><br />
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="editar()" type="relief" color="success" icon="edit">Finalizar Edición </vs-button>&emsp;
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
        <!-- eliminar  productos de la orden de produccion -->
        <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar el detalle de la orden: ${tabOrdenTrabajo.codigo}?`" :active.sync="popupEliminar">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="
                                    remove1(k, codigoEliminar);
                                    popupEliminar = false;
                                  " type="relief">Aceptar</vs-button>
            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
                <vs-button @click="popupEliminar = false" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
        </vs-popup>
    </vs-popup>
    <!-- añadir mas productos a la orden de produccion -->
    <vs-popup class="Detalle informacionformhijo2" :title="`Detalles Orden de trabajo: ${tabOrdenTrabajo.codigo}`" :active.sync="popupadd" fullscreen @close="getEditar2()">
        <vs-row>
            <!-- {{ orden }} -->
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center">
                <vs-input label="Código:" class="w-full" icon="error_outline" disabled v-model="tabOrdenTrabajo.codigo" />
                <br>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <div style="display: inline-flex;">
                        <b>¿La órden va a contener productos duplicados? &emsp;</b>
                        <vs-switch style="width: 55px;" :class="classValidarSwitch_edit" color="primary" vs-icon-on="check_box" vs-icon-off="block" v-model="switchduplicarproductos_edit" :disabled="deshabilitarSwitch" @change="getmetodoconfirmacioncambiarEstadoSwitch()">
                            <span slot="on">SI</span>
                            <span slot="off">NO</span>
                        </vs-switch>
                    </div>
                </vs-row>
                <br>
            </vs-col>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Añadir productos.</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="block" vs-justify="center" vs-align="center" vs-w="6" vs-sm="9" class="m-2">
                        <!-- Select para elegir productos -->
                        <v-select placeholder="--Buscar y seleccionar--" label="nombre_completo" class="mb-4 w-full h-100" :options="options3" :reduce="(option) => option" @option:selected="Productos_a_agregar_edit" v-model="productoSeleccionado" :filter="customFilter"></v-select>
                        <div align="center">
                            <!-- Tabla para mostrar productos seleccionados -->
                            <table v-if="productosSeleccionados.length" class="tabla-seleccionados" border="1">
                                <thead>
                                    <tr>
                                        <th colspan="4" style="text-align: center; font-size: 16px; border: 0.5px solid #000;">Productos para añadir a la orden de producción</th>
                                    </tr>
                                    <tr>
                                        <th>#</th>
                                        <th>Producto</th>
                                        <th>Código</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="(item, index) in productosSeleccionados" :key="index">
                                        <td>{{ index + 1 }}</td>
                                        <td>{{ item.pro_nombre }}</td>
                                        <td>{{ item.pro_codigo }}</td>
                                        <td align="center">
                                            <vs-tooltip text="Quitar" position="right" color="danger">
                                                <template>‎</template>
                                                <vs-button style="display: inline-flex;" color="danger" radius type="gradient" icon="clear" @click="eliminarProducto(index)"></vs-button>
                                            </vs-tooltip>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <!-- <p v-else>No hay productos seleccionados.</p> -->
                        </div>
                    </vs-col>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="1" vs-sm="1">
                        <vs-tooltip text="Agregar items a la tabla" position="right" color="primary">
                            <template>‎</template>
                            <vs-button style="display: inline-block;" color="success" type="relief" icon="add" @click="add(k)"></vs-button>
                        </vs-tooltip>
                    </vs-col>
                </vs-row>
            </vs-col>
            <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="8" vs-sm="9" class="m-2">
                            <v-select style="width: 100%;" placeholder="--Buscar y seleccionar--" multiple :closeOnSelect="false" v-model="pro_codigo" label="pro_nombre" class="mb-4" :options="options3" :reduce="(options3) => options3.pro_codigo" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                        </vs-col>
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="1" vs-sm="1" class="m-2">
                            <vs-button color="success" type="relief" icon="add" @click="add(k)"></vs-button>
                        </vs-col>
                    </vs-row>
                </vs-col> -->
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Detalle de orden</b></vs-col>

            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-divider>Cantidad: {{ inputs.length }}</vs-divider>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-table search :data="inputs" no-data-text="No hay productos para añadir a la orden de producción">
                    <vs-tr v-for="(input, k) in inputs" :key="k">
                        <vs-td width="50"><br /><b>{{ k + 1 }}</b></vs-td>
                        <vs-td width="550">
                            <b>Libro {{input.pro_nombre}}</b><br>
                            <b>Id: </b> {{input.pro_codigo}}<br>
                        </vs-td>
                        <vs-td width="550">
                            <b>Páginas: </b> {{input.pro_int_pagina}}<br>
                            <b>Tamaño: </b> {{input.pro_tamaño}}<br>
                            <div class="acabados-row">
                                <vx-tooltip text="Cambiar acabado" position="left" color="primary">
                                    <vs-button color="primary" type="gradient" size="small" icon="swap_horiz" @click="get_Proacabado_seleccion(input.pro_codigo, k, 'detalle')" />
                                </vx-tooltip>
                                <b>Acabados:</b>
                                <span>{{ input.pro_acabados }}</span>
                            </div>
                            <br>
                            <b>Recubrimiento: </b> {{input.pro_cub_recubrimiento}}<br>
                            <b>Código Interior: </b> {{input.mat_in_codigo}}<br>
                            <b>Tintas Interior: </b> {{input.pro_int_tinta}}<br>
                            <b>Código Cubierta: </b> {{input.mat_cub_codigo}}<br>
                            <b>Tintas Cubierta:: </b> {{input.pro_cub_tintas}}<br>
                        </vs-td>
                        <vs-td width="1000">
                            <vs-input label="Cantidad: *" class="w-full m-1" placeholder="2010" icon="mode_edit" type="number" min="0" @keydown="filterKey" v-model="input.cantidad" />

                            <vs-input label="Posible Entrega: *" class="w-full m-1" type="date" v-model="input.fe_entrega" />
                            <vs-textarea label="Observaciones: *" placeholder="Escribe......" icon="mode_edit" class="w-full" v-model="input.observacion" />
                        </vs-td>

                        <vs-td>
                            <vs-tooltip text="Quitar de la órden" position="top" color="danger">
                                <template>‎</template>
                                <vs-button style="display: inline-block;" v-if="k > -1" @click="remove(k)" color="danger" type="relief" icon="delete"></vs-button>
                            </vs-tooltip>
                        </vs-td>
                    </vs-tr>
                </vs-table>
            </vs-col>
        </vs-row>
        <br /><br />
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="guardarnuevo(); getEditar2(); " color="success" type="relief">Añadir a orden</vs-button>&emsp;
            <vs-button @click="popupadd = false; popupActivoEditar = true; getEditar2()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>

    <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar el registro: ${tabOrdenTrabajo.codigo}?`" :active.sync="popupActivoEliminar">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>

    <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado de la orden de trabajo: ${tabOrdenTrabajo.codigo}?`" :active.sync="popupActivoDesactivar">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="desactivar_activar_orden()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>

    <!-- Popup selector de acabados -->
    <vs-popup class="seleccionaracabado" title="Seleccionar Acabado" :active.sync="popupAcabadosSelector">
        <vs-row>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center"><b>Acabados disponibles</b></vs-col>
            <vs-col vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-divider>Cantidad: {{ acabadosDisponibles.length }}</vs-divider>
                <br />
                <vs-table :data="acabadosDisponibles" no-data-text="No hay acabados disponibles">
                    <template slot="thead">
                        <vs-th>Acabado</vs-th>
                        <vs-th>Acción</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr v-for="(acabado, index) in data" :key="index">
                            <vs-td>{{ acabado.det_or_acabados }}</vs-td>
                            <vs-td>
                                <vs-button color="primary" type="relief" size="small" @click="seleccionarAcabado(acabado.det_or_acabados)">Seleccionar</vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-col>
        </vs-row>
        <br /><br />
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="popupAcabadosSelector = false" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <vue-html2pdf v-if="verPdf" :filename="`${selectOrden.or_codigo}.pdf`" :show-layout="false" :float-layout="true" :enable-download="true" :preview-modal="true" :paginate-elements-by-height="1400" :pdf-quality="2" :manual-pagination="true" pdf-format="a4" :pdf-margin="10" pdf-orientation="landscape" pdf-content-width="1400px" ref="html2Pdf">
        <section slot="pdf-content" style="margin: 5%;">
            <section class="pdf-item">
                <table style="width: 80%;" class="tablaHeader">
                    <tr>
                        <td style="padding:10px; justify-content: center; width: 250px;">
                            <center>
                                <img class="img-responsive mb-2 ml-1" :src="dataempresa.img_base64" style=" display: flex;width: 80px;">
                            </center>
                        </td>
                        <td style="padding:10px;">
                            <center>
                                <b style="font-size: 18px; justify-content: center;">ORDEN DE TRABAJO</b>
                                <br>
                                <p style="font-size: 18px; justify-content: center;">{{nombreEmpresaActual}}</p>
                            </center>
                        </td>
                    </tr>
                </table>
            </section>
            <section class="pdf-item">
                <table style="width: 80%; font-size: 12px;">
                    <tr>
                        <td><b>ORDEN DE TRABAJO: </b></td>
                        <td><b>{{ selectOrden.or_codigo }}</b></td>
                        <td style="width: 50px;"></td>
                        <td style="width: 50px;"></td>
                        <td>FECHA: </td>
                        <td><b>{{ selectOrden.or_fecha }}</b></td>
                    </tr>
                    <tr>
                        <td><b>Nombre del proveedor: </b></td>
                        <td>{{ selectOrden.prov_nombre }}</td>
                    </tr>
                    <tr>
                        <td><b>Dirección: </b></td>
                        <td>{{ selectOrden.prov_direccion }}</td>
                    </tr>
                    <tr>
                        <td><b>Telefono: </b></td>
                        <td>{{ selectOrden.prov_telefono }}</td>
                    </tr>
                    <tr>
                        <td><b>Atención a: </b></td>
                        <td>ND</td>
                    </tr>
                </table>
            </section>
            <section class="pdf-item">
                <div v-for="(chunk, key) in chunkedDatosOrdenDetalle" :key="key">
                    <div>
                        <table class="tabla3" style="width: 80%;">
                            <thead>
                                <tr>
                                    <th rowspan="2">CÓDIGO</th>
                                    <th rowspan="2">DESCRIPCION</th>
                                    <th rowspan="2">FECHA POSIBLE <br> DE ENTREGA</th>
                                    <th rowspan="2">CANTIDAD</th>
                                    <th rowspan="2" style="width: 50px;">GUIAS</th>
                                    <th rowspan="2">PLANIFIC.</th>
                                    <th rowspan="2">OBSERVACIÓN</th>
                                    <th rowspan="2">TAMAÑO</th>
                                    <th colspan="3">PAGINAS INTERIORES</th>
                                    <th colspan="3">CARATULA CUBIERTA</th>
                                    <th rowspan="2">ACABADOS</th>
                                </tr>
                                <tr>
                                    <th>PAG. INT.</th>
                                    <th>MATERIAL</th>
                                    <th>TINTAS</th>
                                    <th>MATERIAL</th>
                                    <th>RECUB.</th>
                                    <th>TINTAS</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, k) in chunk" :key="k">
                                    <td>{{ item.pro_codigo }}</td>
                                    <td style="max-width: 200px; word-wrap: break-word; overflow: hidden; text-overflow: ellipsis;">{{ item.pro_nombre }}</td>
                                    <td>{{ formatDate(item.det_or_posible_entrega) }}</td>
                                    <td>{{ item.det_or_cantidad }}</td>
                                    <td>{{ item.det_or_guias }}</td>
                                    <td>{{ item.det_or_planificacion }}</td>
                                    <td>{{ item.det_or_observaciones }}</td>
                                    <td>{{ item.det_or_tamaño }}</td>
                                    <td>{{ item.det_or_int_paginas }}</td>
                                    <td>{{ item.det_or_in_codigo }}</td>
                                    <td>{{ item.det_or_in_tintas }}</td>
                                    <td>{{ item.mat_cub_codigo }}</td>
                                    <td>{{ item.det_or_recubrimiento }}</td>
                                    <td>{{ item.det_or_cub_tintas }}</td>
                                    <td>{{ item.det_or_acabados }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <!-- <div class="html2pdf__page-break" v-if="key < chunkedDatosOrdenDetalle.length - 1"></div> -->
                    <div v-if="key !== chunkedDatosOrdenDetalle.length - 1" style="margin-bottom: 45px;">
                        <div class="html2pdf__page-break" v-if="key + 1 && chunkedDatosOrdenDetalle.length > 1 " style="margin-bottom: 25px;"></div>
                    </div>
                </div>
            </section>
            <section class="pdf-item mt-5" style="width: 80%;">
                <b>Observaciones: </b><br>
                {{ selectOrden.or_observacion}}
            </section>
            <section class="pdf-item">
                <b>Aprobado por: {{selectOrden.or_aprobacion}} </b><br><br>
            </section>
            <section class="pdf-item">
                <b>Solicitado por: {{selectOrden.or_solicitado }} </b><br><br>
            </section>
            <section class="pdf-item">
                <b>Elaborado por: {{ selectOrden.or_elaborado }} </b><br><br>
            </section>
        </section>
    </vue-html2pdf>
</vx-card>
</template>

<script>
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
import VueHtml2pdf from "vue-html2pdf";
import XLSX from 'xlsx';
import TableOrdenesVue from "./components/TableOrdenes.vue";
import { mapState } from "vuex";
export default {
    data() {
        return {
            k: "",
            orden: '',
            counter: 0,
            Ordentrabajo: [],
            popupdetalle: false,
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupEliminar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            popuptemporada: false,
            popupadd: false,
            MaterialInterior: [],
            MaterialCubierta: [],
            codigoEliminar: [],
            tabTemporada: {
                temp: "",
                anio: "",
            },
            changeValues: false,
            tabOrdenTrabajo: {
                codigo: "",
                fecha: "",
                serie: "",
                prov_codigo: "",
                observacion: "",
                pro_car_codigo: "",
                empresa: "",
                prov_direccion: "",
                prov_telefono: "",
                aprobado: '',
                elaborado: '',
                solicitado: '',
            },
            inputs: [],
            id: "",
            idusuarioresp: "",
            pro_codigo: "",
            region: [],
            anio: [],
            Ordentodo: [],
            obser: "",
            Producto: [],
            busqueda: 'codigo',
            busquedaxcodigo: "",
            valorBusqueda: "0",
            checkBox_mostrarinactivos: false,
            options1: [{
                    text: "COSTA",
                    value: "C"
                },
                {
                    text: "SIERRA",
                    value: "S"
                },
            ],
            options3: [],
            options4: [],
            options: [],
            options2: [],
            listaEmpresas: [],
            cellAutoWidth: true,
            selectedFormat: 'xlsx',
            verPdf: true,
            selectOrden: {},
            datosOrdenDetalle: [],
            dataempresa: [],
            numerodeorden: '',
            switchduplicarproductos_nuevo: false,
            switchduplicarproductos_edit: false,
            productosSeleccionados: [],
            productoSeleccionado: null,
            Switchbandera: 0, // Bandera para evitar ejecuciones múltiples
            inputs_edit: [],
            verificar_edit_or_new: '',
            deshabilitarSwitch: false, // Variable para deshabilitar
            classValidarSwitch_nuevo: '',
            classValidarSwitch_edit: '',
            nombreEmpresaActual: '',
            popupAcabadosSelector: false,
            acabadosDisponibles: [],
            acabadoSeleccionadoIndex: null,
            acabadoSeleccionadoContexto: '',
        };
    },

    components: {
        "v-select": vSelect,
        TableOrdenesVue,
        VueHtml2pdf
    },
    computed: {
        ...mapState(["userRoot", "userAdministrador"]),
        chunkedDatosOrdenDetalle() {
            const chunkSize = 13;
            const arrayCopy = [...this.datosOrdenDetalle];
            const chunks = [];
            while (arrayCopy.length > 0) {
                chunks.push(arrayCopy.splice(0, chunkSize));
            }
            return chunks;
        },
        // Los elementos seleccionados para mostrar como chips
        // Computado para los elementos seleccionados
        // Los elementos seleccionados para mostrar como chips
        // Ordenar las opciones para que las seleccionadas aparezcan primero
        sortedOptions() {
            return this.options3.sort((a, b) => {
                if (this.pro_codigo.includes(a.pro_codigo) && !this.pro_codigo.includes(b.pro_codigo)) {
                    return -1; // `a` va primero si está seleccionado
                }
                if (!this.pro_codigo.includes(a.pro_codigo) && this.pro_codigo.includes(b.pro_codigo)) {
                    return 1; // `b` va primero si está seleccionado
                }
                return 0; // Mantiene el orden original
            });
        }
    },
    mounted() {
        this.busquedaxcodigo = '';
        this.busqueda = 'codigo';
        this.empresaActual();
        this.mostrarFechayhora();
        this.mostrarFecha();
        this.llenarOptions2();
    },
    methods: {
        customFilter(options, search) {
            if (!search) return options;
            
            // Función para eliminar tildes/acentos y convertir a minúsculas
            const normalize = (str) => {
                return String(str || '').normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
            };

            const searchTerms = normalize(search).split(/\s+/).filter(t => t);

            return options.filter(option => {
                // Unimos todos los valores del objeto en un solo string para buscar en todos los campos (nombre, codigo, etc.)
                const valuesString = Object.values(option)
                    .filter(val => typeof val === 'string' || typeof val === 'number')
                    .map(val => normalize(val))
                    .join(' ');
                
                return searchTerms.every(term => valuesString.includes(term));
            });
        },
        getmetodoconfirmacioncambiarEstadoSwitch() {
            // console.log(this.Switchbandera, "cuantos");
            this.deshabilitarSwitch = true; // Deshabilita el switch
            if (this.verificar_edit_or_new == 'new') {
                // console.log("change_new");
                if (this.Switchbandera === 0) {
                    this.cambiarEstadoSwitch_nuevo();
                }
            } else if (this.verificar_edit_or_new == 'edit') {
                // console.log("change_edit");
                if (this.Switchbandera === 0) {
                    this.cambiarEstadoSwitch_edit();
                }
            }
            // Configurar un temporizador para restablecer Switchbandera después de 1 segundo
            setTimeout(() => {
                this.Switchbandera = 0;
            }, 1000);
        },
        cambiarEstadoSwitch_nuevo() {
            let me = this;
            // console.log(this.switchduplicarproductos_nuevo, "valorswwwww");
            // console.log(this.productosSeleccionados, "valorproductosSeleccionados");
            // console.log(this.inputs, "valoinputs");

            me.Switchbandera = 1;

            // console.log("primero");

            // Obtener códigos únicos de productosSeleccionados e inputs
            const codigosProductosSeleccionados = me.productosSeleccionados.map(item => item.pro_codigo);
            const codigosTabla = me.inputs.map(item => item.pro_codigo);

            // Usar Sets para detectar duplicados
            const setProductos = new Set();
            const setTabla = new Set();
            let duplicadosProductos = new Set();
            let duplicadosTabla = new Set();
            let duplicadosAmbos = new Set();

            // Detectar duplicados en productosSeleccionados
            codigosProductosSeleccionados.forEach(codigo => {
                if (setProductos.has(codigo)) {
                    duplicadosProductos.add(codigo);
                }
                setProductos.add(codigo);
            });

            // Detectar duplicados en inputs (tabla)
            codigosTabla.forEach(codigo => {
                if (setTabla.has(codigo)) {
                    duplicadosTabla.add(codigo);
                }
                setTabla.add(codigo);
            });

            // Detectar duplicados entre productosSeleccionados y inputs
            codigosProductosSeleccionados.forEach(codigo => {
                if (setTabla.has(codigo)) {
                    duplicadosAmbos.add(codigo);
                }
            });

            // Mostrar notificaciones según el tipo de duplicado
            if (duplicadosAmbos.size > 0) {
                this.$vs.notify({
                    text: `Tanto en la orden como en los productos seleccionados existen productos duplicados: ${[...duplicadosAmbos].join(', ')}`,
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 6000
                });
            } else if (duplicadosProductos.size > 0) {
                this.$vs.notify({
                    text: `En los productos seleccionados hay duplicados: ${[...duplicadosProductos].join(', ')}`,
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 6000
                });
            } else if (duplicadosTabla.size > 0) {
                this.$vs.notify({
                    text: `En la tabla existen productos duplicados: ${[...duplicadosTabla].join(', ')}`,
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 6000
                });
            }

            // Restaurar switch si hay duplicados
            if (duplicadosAmbos.size > 0 || duplicadosProductos.size > 0 || duplicadosTabla.size > 0) {
                this.switchduplicarproductos_nuevo = true;
            }
            setTimeout(() => {
                this.deshabilitarSwitch = false; // Deshabilita el switch
            }, 1500)
        },
        cambiarEstadoSwitch_edit() {
            let me = this;
            // console.log(this.switchduplicarproductos_edit, "valorswwwww");
            // console.log(this.productosSeleccionados, "valorproductosSeleccionados");
            // console.log(this.inputs_edit, "valoinputs_edit");

            me.Switchbandera = 1;

            // console.log("primero");

            // Obtener códigos únicos de productosSeleccionados e inputs_edit
            const codigosProductosSeleccionados = me.productosSeleccionados.map(item => item.pro_codigo);
            const codigosTabla = me.inputs_edit.map(item => item.pro_codigo);
            const codigosTabladetalle = me.inputs.map(item => item.pro_codigo);

            // console.log(codigosProductosSeleccionados, "primero");
            // console.log(codigosTabla, "segundo");
            // console.log(codigosTabladetalle, "tercero");

            // Usar Sets para detectar duplicados
            const setProductos = new Set();
            const setTabla = new Set();
            let duplicadosProductos = new Set();
            let duplicadosPrincipal = new Set();
            let duplicadosTabla = new Set();
            let duplicadosAmbos = new Set();
            let duplicadosTabladetalle = new Set();

            // Detectar duplicados en productosSeleccionados
            codigosProductosSeleccionados.forEach(codigo => {
                if (setProductos.has(codigo)) {
                    duplicadosProductos.add(codigo);
                }
                setProductos.add(codigo);
            });

            // Detectar duplicados en inputs_edit (tabla)
            codigosTabla.forEach(codigo => {
                if (setTabla.has(codigo)) {
                    duplicadosTabla.add(codigo);
                }
                setTabla.add(codigo);
            });

            // Detectar duplicados entre productosSeleccionados y inputs_edit
            codigosProductosSeleccionados.forEach(codigo => {
                if (setTabla.has(codigo)) {
                    duplicadosAmbos.add(codigo);
                }
            });

            // Detectar duplicados entre inputs y inputs_edit
            codigosTabladetalle.forEach(codigo => {
                if (setTabla.has(codigo)) {
                    duplicadosTabladetalle.add(codigo);
                }
            });

            codigosTabladetalle.forEach(codigo => {
                if (setProductos.has(codigo)) {
                    duplicadosPrincipal.add(codigo);
                }
                setProductos.add(codigo);
            });

            // Mostrar notificaciones según el tipo de duplicado
            if (duplicadosAmbos.size > 0) {
                this.$vs.notify({
                    text: `Tanto en la tabla como en los productos seleccionados existen productos duplicados: ${[...duplicadosAmbos].join(', ')}`,
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 6000
                });
            } else if (duplicadosProductos.size > 0) {
                this.$vs.notify({
                    text: `En los productos seleccionados hay duplicados: ${[...duplicadosProductos].join(', ')}`,
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 6000
                });
            } else if (duplicadosTabla.size > 0) {
                this.$vs.notify({
                    text: `En la orden existen productos duplicados: ${[...duplicadosTabla].join(', ')}`,
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 6000
                });
            } else if (duplicadosTabladetalle.size > 0) {
                this.$vs.notify({
                    text: `En la orden y en esta nueva lista ya existen los productos: ${[...duplicadosTabladetalle].join(', ')}`,
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 6000
                });
            } else if (duplicadosPrincipal.size > 0) {
                this.$vs.notify({
                    text: `En la orden existen productos duplicados: ${[...duplicadosPrincipal].join(', ')}`,
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 6000
                });
            }

            // Restaurar switch si hay duplicados
            if (duplicadosAmbos.size > 0 || duplicadosProductos.size > 0 || duplicadosTabla.size > 0 || duplicadosTabladetalle.size > 0 || duplicadosPrincipal.size > 0) {
                this.switchduplicarproductos_edit = true;
            }
            setTimeout(() => {
                this.deshabilitarSwitch = false; // Deshabilita el switch
            }, 1500)
        },
        Productos_a_agregar_nuevo(producto) {
            if (!producto) return;

            if (this.switchduplicarproductos_nuevo) {
                // Permite agregar duplicados
                this.productosSeleccionados.push({
                    ...producto
                });
                this.productoSeleccionado = null; // Limpia el select después de seleccionar
            } else {
                // Verifica si el producto ya está en la lista
                const existetabla = this.productosSeleccionados.some(p => p.pro_codigo == producto.pro_codigo);
                const existeanadir = this.inputs.some(p => p.pro_codigo == producto.pro_codigo);
                // console.log(this.productosSeleccionados, "existetabla");
                // console.log(producto, "productooo");

                if (existetabla) {
                    this.$vs.notify({
                        text: "Para insertar productos duplicados, habilite el switch para duplicados.",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                        time: 6000
                    });
                    this.alert_switchduplicarproductos_nuevo();
                    this.productoSeleccionado = null;
                    return false;
                } else if (existeanadir) {
                    this.$vs.notify({
                        text: "Este producto ya esta añadido, para insertar productos duplicados, habilite el switch para duplicados.",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                        time: 6000
                    });
                    this.alert_switchduplicarproductos_nuevo();
                    this.productoSeleccionado = null;
                    return false;
                } else {
                    console.log("Producto diferente.");
                }

                // Si no existetabla, lo agrega
                this.productosSeleccionados.push({
                    ...producto
                });
                this.productoSeleccionado = null;
            }
        },
        alert_switchduplicarproductos_nuevo() {
            // console.log("edit2");
            this.classValidarSwitch_nuevo = 'stylevalidar';

            setTimeout(() => {
                this.classValidarSwitch_nuevo = '';
            }, 1500);
        },
        alert_switchduplicarproductos_edit() {
            // console.log("edit1");
            this.classValidarSwitch_edit = 'stylevalidar';

            setTimeout(() => {
                this.classValidarSwitch_edit = '';
            }, 1500);
        },
        Productos_a_agregar_edit(producto) {
            // console.log(this.inputs_edit, "inputs_edit");
            // console.log(this.inputs, "inputs");
            if (!producto) return;

            if (this.switchduplicarproductos_edit) {
                // Permite agregar duplicados
                this.productosSeleccionados.push({
                    ...producto
                });
                this.productoSeleccionado = null; // Limpia el select después de seleccionar
            } else {
                // Verifica si el producto ya está en la lista
                const existetabla = this.productosSeleccionados.some(p => p.pro_codigo == producto.pro_codigo);
                const existeanadir = this.inputs_edit.some(p => p.pro_codigo == producto.pro_codigo);
                const nuevoitem = this.inputs.some(p => p.pro_codigo == producto.pro_codigo);
                // console.log(this.productosSeleccionados, "existetabla");
                // console.log(producto, "productooo");

                if (existetabla) {
                    this.$vs.notify({
                        text: "Para insertar productos duplicados, habilite el switch.",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                        time: 6000
                    });
                    this.alert_switchduplicarproductos_edit();
                    this.productoSeleccionado = null;
                    return false;
                } else if (existeanadir) {
                    this.$vs.notify({
                        text: "Este producto ya esta añadido, para insertar productos duplicados, habilite el switch.",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                        time: 6000
                    });
                    this.alert_switchduplicarproductos_edit();
                    this.productoSeleccionado = null;
                    return false;
                } else if (nuevoitem) {
                    this.$vs.notify({
                        text: "Este producto ya esta en la orden, para insertar productos duplicados, habilite el switch.",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-alert-triangle",
                        time: 6000
                    });
                    this.alert_switchduplicarproductos_edit();
                    this.productoSeleccionado = null;
                    return false;
                } else {
                    console.log("Producto diferente.");
                }

                // Si no existetabla, lo agrega
                this.productosSeleccionados.push({
                    ...producto
                });
                this.productoSeleccionado = null;
            }
        },
        eliminarProducto(index) {
            let me = this;
            me.$vs.loading();
            setTimeout(() => {
                this.productosSeleccionados.splice(index, 1);
                me.$vs.loading.close();
            }, 1000);
        },
        formatDate(dateString) {
            // Formatear la fecha para mostrar solo la parte de la fecha
            const date = new Date(dateString);
            return date.toLocaleDateString(); // Puedes ajustar el formato según lo necesites
        },
        getMaterialCubierta() {
            let me = this;
            this.$http.get(this.$server_url + 'Get_Materialcubierta')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.MaterialCubierta = res.data;
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getMaterialInterior() {
            let me = this;
            this.$http.get(this.$server_url + 'Get_Materialinterior')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.MaterialInterior = res.data;
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err)
                })
        },
        llenarOptions2() {
            const anioactual = new Date().getFullYear();
            const anioSIguiente = anioactual + 1;
            for (let anio = anioSIguiente; anio >= 2010; anio--) {
                this.options2.push({
                    text: anio.toString(),
                    value: anio.toString().slice(2)
                });
            }
        },
        getEmpresas() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    me.listaEmpresas = res.data.filter(empresa => empresa.id != 2);
                    me.$vs.loading.close();
                })
                .catch(err => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
        filterKey(e) {
            const key = e.key;
            if (key === "." || key === "-" || key === "e" || key === "+")
                return e.preventDefault();
        },
        Validarselects() {
            let me = this;
            if (!me.tabTemporada.temp) {
                me.$vs.notify({
                    text: "Seleccione la Temporada",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-check",
                });
                return false;
            }
            if (!me.tabTemporada.anio) {
                me.$vs.notify({
                    text: "Seleccione el año",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-check",
                });
                return false;
            }
            me.$vs.loading();
            this.getNuevo(me.tabTemporada.temp.value, me.tabTemporada.anio.value);
            me.$vs.loading.close();
        },
        getDeta(tr) {
            let me = this;
            this.popupdetalle = true;
            this.tabOrdenTrabajo.codigo = tr.or_codigo;
            this.tabOrdenTrabajo.fecha = tr.or_fecha;
            this.tabOrdenTrabajo.observacion = tr.or_observacion;
            this.tabOrdenTrabajo.aprobado = tr.or_aprobacion;
            this.tabOrdenTrabajo.solicitado = tr.or_solicitado == undefined ? 'sin dato' : tr.or_solicitado;
            this.tabOrdenTrabajo.elaborado = tr.or_elaborado !== undefined ? tr.or_elaborado : 'sin dato';
            this.options4 = [];
            this.tabOrdenTrabajo.prov_codigo = {
                prov_codigo: tr.prov_codigo,
                prov_nombre: tr.prov_nombre
            };
            this.inputs = [];

            me.$vs.loading();
            this.getprov();
            var url = "";
            url = this.$server_url + "Get_Ordendetalle?or_codigo=" + tr.or_codigo;
            this.$http
                .get(url)
                .then(function (res) {
                    me.inputs = res.data;

                    me.inputs.push();
                    me.$vs.loading.close();
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-user",
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error + " error");
                    this.inputs = [];
                    me.$vs.loading.close();
                });
        },
        exportToExcel() {
            let me = this
            let headerTitle = ""
            let headerVal = ""

            //INSTITUCION
            let TitleInstitucion = []
            TitleInstitucion.push("ORDEN DE TRABAJO Nº:") //1
            TitleInstitucion.push(me.tabOrdenTrabajo.codigo) //2
            TitleInstitucion.push("") //3
            TitleInstitucion.push("") //4
            TitleInstitucion.push("") //5
            TitleInstitucion.push("FECHA:") //6
            TitleInstitucion.push(me.tabOrdenTrabajo.fecha) //7
            TitleInstitucion.push("") //8
            TitleInstitucion.push("") //9
            TitleInstitucion.push("") //10
            TitleInstitucion.push("") //11
            TitleInstitucion.push("") //12
            TitleInstitucion.push("") //13
            TitleInstitucion.push("") //13
            TitleInstitucion.push("") //15
            //TEMPORADA - CONVENIO
            let TitleTemporada = []
            TitleTemporada.push("Nombre del Proveedor:") //1
            TitleTemporada.push(me.tabOrdenTrabajo.prov_codigo) //2
            TitleTemporada.push("") //3
            TitleTemporada.push("") //4
            TitleTemporada.push("") //5
            TitleTemporada.push("") //6
            TitleTemporada.push("") //7
            TitleTemporada.push("") //8
            TitleTemporada.push("") //9
            TitleTemporada.push("") //10
            TitleTemporada.push("") //11
            TitleTemporada.push("") //12
            TitleTemporada.push("") //13
            TitleTemporada.push("") //14
            TitleTemporada.push("") //15

            //proveedor direccion
            let TitleProveedorD = []
            TitleProveedorD.push("Dirección:") //1
            TitleProveedorD.push(me.tabOrdenTrabajo.prov_direccion) //2
            TitleProveedorD.push("") //3
            TitleProveedorD.push("") //4
            TitleProveedorD.push("") //5
            TitleProveedorD.push("") //6
            TitleProveedorD.push("") //7
            TitleProveedorD.push("") //8
            TitleProveedorD.push("") //9
            TitleProveedorD.push("") //10
            TitleProveedorD.push("") //11
            TitleProveedorD.push("") //12
            TitleProveedorD.push("") //13
            TitleProveedorD.push("") //14
            TitleProveedorD.push("") //15

            //proveedor telefono
            let TitleProveedorT = []
            TitleProveedorT.push("Teléfono:") //1
            TitleProveedorT.push(me.tabOrdenTrabajo.prov_telefono) //2
            TitleProveedorT.push("") //3
            TitleProveedorT.push("") //4
            TitleProveedorT.push("") //5
            TitleProveedorT.push("") //6
            TitleProveedorT.push("") //7
            TitleProveedorT.push("") //8
            TitleProveedorT.push("") //9
            TitleProveedorT.push("") //10
            TitleProveedorT.push("") //11
            TitleProveedorT.push("") //12
            TitleProveedorT.push("") //13
            TitleProveedorT.push("") //14
            TitleProveedorT.push("") //15

            //ASESOR
            let TitleAsesor = []
            TitleAsesor.push("OBSERVACIÓN:") //1
            TitleAsesor.push(me.tabOrdenTrabajo.observacion) //2
            TitleAsesor.push("") //3
            TitleAsesor.push("") //4
            TitleAsesor.push("") //5
            TitleAsesor.push("") //6
            TitleAsesor.push("") //7
            TitleAsesor.push("") //8
            TitleAsesor.push("") //9
            TitleAsesor.push("") //10
            TitleAsesor.push("") //11
            TitleAsesor.push("") //12
            TitleAsesor.push("") //13
            TitleAsesor.push("") //14
            TitleAsesor.push("") //15

            //Espacio en blanco
            let TitleEspacio = []
            TitleEspacio.push("")
            TitleEspacio.push("")
            TitleEspacio.push("") //3
            TitleEspacio.push("") //4
            TitleEspacio.push("") //5
            TitleEspacio.push("") //6
            TitleEspacio.push("") //7
            TitleEspacio.push("") //8
            TitleEspacio.push("") //9
            TitleEspacio.push("") //10
            TitleEspacio.push("") //11
            TitleEspacio.push("") //12
            TitleEspacio.push("") //13
            TitleEspacio.push("") //14
            TitleEspacio.push("") //15
            //CODIGOS
            headerTitle = [
                'CÓDIGO', //1
                'DESCRIPCION', //2
                'FECHA POSIBLE DE ENTREGA', //3
                'CANTIDAD', //4
                'GUIAS', //14
                'PLANIFIC.', //15
                'OBSERVACIÓN', //5
                'TAMAÑO', //7
                'PÁGINAS INTERIOR', //6
                'MATERIAL INTERIOR', //10
                'TINTAS INTERIOR', //11
                'MATERIAL CUBIERTA', //12
                'RECUBRIMIENTO CUBIERTA', //9
                'TINTAS CUBIERTA', //13
                'ACABADOS', //8
            ];
            headerVal = [
                'pro_codigo', //1
                'pro_nombre', //2
                'det_or_posible_entrega', //3
                'det_or_cantidad', //4
                'det_or_guias', //14
                'det_or_planificacion', //15
                'det_or_observaciones', //5
                'det_or_tamaño', //7
                'det_or_int_paginas', //6
                'det_or_in_codigo', //10
                'det_or_in_tintas', //11
                'mat_cub_codigo', //12
                'det_or_recubrimiento', //9
                'det_or_cub_tintas', //13
                'det_or_acabados', //8
            ];

            // Formatear datos de fecha en me.inputs
            me.inputs.forEach(item => {
                item.det_or_posible_entrega = this.formatDateForExcel(item.det_or_posible_entrega);
            });

            import('@/vendor/Export2Excel').then(excel => {
                const data = this.formatJson(headerVal, me.inputs)
                // console.log(data);
                //SUBTOTAL
                excel.export_json_to_excel({
                    multiHeader: [TitleInstitucion, TitleTemporada, TitleProveedorD, TitleAsesor, TitleEspacio],
                    header: headerTitle,
                    data,
                    filename: `${me.tabOrdenTrabajo.codigo}`,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                });

                this.clearFields()
            }).catch(error => {
                console.error('Error en la exportación a Excel:', error);
            });
        },
        formatDateForExcel(dateString) {
            const date = new Date(dateString);
            const day = date.getDate();
            const month = date.getMonth() + 1;
            const year = date.getFullYear();

            return `${day}-${month}-${year}`;
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
        //limpiar campos para exportar de nuevo
        clearFields() {
            this.fileName = 'Orden'
            this.cellAutoWidth = true
            this.selectedFormat = 'xlsx'
        },
        getExcelx(tr) {
            let me = this;
            this.tabOrdenTrabajo.codigo = tr.or_codigo;
            this.tabOrdenTrabajo.fecha = tr.or_fecha;
            this.tabOrdenTrabajo.observacion = tr.or_observacion;
            this.tabOrdenTrabajo.prov_codigo = tr.prov_nombre;
            this.tabOrdenTrabajo.prov_direccion = tr.prov_direccion;
            this.tabOrdenTrabajo.prov_telefono = tr.prov_telefono;
            me.inputs = [];
            me.$vs.loading();
            var url = "";
            url = this.$server_url + "Get_Ordendetalle?or_codigo=" + tr.or_codigo;
            this.$http
                .get(url)
                .then(function (res) {
                    me.inputs = res.data;
                    me.$vs.loading.close();
                    if (me.inputs.length > 0) {
                        me.exportToExcel();
                        me.$vs.notify({
                            text: "Excel generado correctamente.",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-user",
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error + " error");
                    this.inputs = [];
                    me.$vs.loading.close();
                });
        },
        getPDF(orden) {
            let me = this;
            me.selectOrden = {},
                me.datosOrdenDetalle = [];

            // me.$vs.loading();
            this.$http.get(this.$server_url + "Get_Ordendetalle?or_codigo=" + orden.or_codigo)
                .then(function (res) {
                    me.datosOrdenDetalle = res.data;
                    me.selectOrden = orden;
                    // console.log('datos', me.selectOrden)
                    me.getempresa(orden);
                })
                .catch(function (error) {
                    console.log(error + " error");
                    me.$vs.loading.close();
                });
        },
        getempresa(orden) {
            let me = this;
            me.$vs.loading();
            this.$http
                .get(this.$server_url + "Get_empresaOrden?or_codigo=" + orden.or_codigo)
                .then((res) => {
                    me.dataempresa = res.data[0];
                    // console.log('empresa', me.dataempresa);
                    me.verPdf = true;

                    me.$nextTick(() => {
                        me.$refs.html2Pdf.generatePdf();
                    });
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },
        getOrden() {
            let me = this;
            let url =
                this.$server_url +
                "GetOrden_xfiltro?busqueda=undefined&razonbusqueda=" +
                me.tabOrdenTrabajo.codigo;
            me.$vs.loading();
            this.$http
                .get(url)
                .then(function (res) {
                    me.Ordentrabajo = res.data;

                    if (me.Ordentrabajo.length === 0) {
                        me.$vs.notify({
                            text: "No hay órden de trabajo para esta búsqueda",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        me.Ordentrabajo = [];
                        me.region = [];
                        me.anio = [];
                        me.$vs.loading.close();
                    } else {
                        me.$vs.loading.close();
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: "success",
                                iconPack: "feather",
                                icon: "icon-user",
                            });
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: "No hay órden de trabajo para esta búsqueda",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        me.Ordentrabajo = [];
                        me.$vs.loading.close();
                    } else {
                        console.log(error + " error");
                        me.$vs.loading.close();
                    }
                });
        },
        getOrdenParametro() {
            let me = this;
            let url;
            if (me.busqueda == "codigo" && me.busquedaxcodigo.length > 0) {
                if (me.busquedaxcodigo.length < 2) {
                    me.$vs.notify({
                        text: "Minimo 2 caracteres de busqueda",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    return false;
                }
                url =
                    this.$server_url +
                    "GetOrden_xfiltro?busqueda=" +
                    me.busqueda +
                    "&razonbusqueda=" +
                    me.busquedaxcodigo;
            } else if (me.busqueda == "undefined" && me.busquedaxcodigo.length > 0) {
                if (me.busquedaxcodigo.length < 2) {
                    me.$vs.notify({
                        text: "Minimo 2 caracteres de busqueda",
                        color: "warning",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    return false;
                }
                url =
                    this.$server_url +
                    "GetOrden_xfiltro?busqueda=" +
                    me.busqueda +
                    "&razonbusqueda=" +
                    me.busquedaxcodigo;
            } else if (me.busqueda == "temporada") {
                const regiones = Array.isArray(me.region) ? me.region.map(r => r.value) : [];
                const anios = Array.isArray(me.anio) ? me.anio.map(a => a.value) : [];
                url =
                    this.$server_url +
                    "GetOrden_xfiltro?busqueda=" +
                    me.busqueda +
                    "&regiones=" +
                    encodeURIComponent(JSON.stringify(regiones)) +
                    "&anios=" +
                    encodeURIComponent(JSON.stringify(anios));
            } else {
                url = this.$server_url + "GetOrden_xfiltro?busqueda=" + me.busqueda;
            }
            me.$vs.loading();
            this.$http
                .get(url)
                .then(function (res) {
                    me.Ordentrabajo = res.data;

                    if (me.Ordentrabajo.length === 0) {
                        me.$vs.notify({
                            text: "No hay órden de trabajo para esta búsqueda",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        me.Ordentrabajo = [];
                        me.$vs.loading.close();
                    } else {
                        me.$vs.loading.close();
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: "success",
                                iconPack: "feather",
                                icon: "icon-user",
                            });
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: "No hay órden de trabajo para esta búsqueda",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                        me.Ordentrabajo = [];
                        me.$vs.loading.close();
                    } else {
                        console.log(error + " error");
                        me.$vs.loading.close();
                    }
                });
        },
        mostrarFechayhora: function () {
            const date = new Date();
            const formatear =
                date.getFullYear() +
                "-" +
                ("0" + (date.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + date.getDate()).slice(-2) +
                " " +
                ("0" + date.getHours()).slice(-2) +
                ":" +
                ("0" + date.getMinutes()).slice(-2) +
                ":" +
                ("0" + date.getSeconds()).slice(-2);

            return formatear;
        },
        mostrarFecha: function () {
            let currendate = new Date();
            let Nueva = new Date();
            Nueva.setDate(currendate.getDate() + 15);
            const res =
                Nueva.getFullYear() +
                "-" +
                ("0" + (Nueva.getMonth() + 1)).slice(-2) +
                "-" +
                ("0" + Nueva.getDate()).slice(-2);
            return res;
        },
        add(k) {
            let me = this;
            let fe = me.mostrarFecha();
            // console.log(this.productosSeleccionados, "seleccionados");
            // console.log(this.pro_codigo, "seleccionados2");
            if (me.productosSeleccionados.length == 0) {
                me.$vs.notify({
                    text: "No ha seleccionado ningun producto para añadir.",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-x",
                });
                return
            }
            // return;
            me.$vs.loading();
            const codigos = this.productosSeleccionados.map(item => item.pro_codigo);
            // Verifica si `codigos` es un array de múltiples códigos seleccionados
            let nombres = Array.isArray(codigos) ? codigos : [codigos];
            // console.log(nombres, "queelimina");
            // Mapea cada código a una promesa de fetch
            const fetchPromises = nombres.map((nombre) => {
                return fetch(this.$server_url + "GetProductoCaracter?pro_codigo=" + nombre)
                    .then((res) => res.json())
                    .then((res) => {
                        // Variables para los datos de cada producto
                        let a, b, c, d, e, f, g, h, i, j;

                        // Asignación de valores usando `Object.entries`
                        Object.entries(res[0]).forEach((elem) => {
                            if (elem[0] === "pro_codigo") a = elem[1];
                            else if (elem[0] === "pro_nombre") b = elem[1];
                            else if (elem[0] === "pro_tama\u00f1o") c = elem[1];
                            else if (elem[0] === "mat_in_codigo") d = elem[1];
                            else if (elem[0] === "pro_int_tinta") e = elem[1];
                            else if (elem[0] === "mat_cub_codigo") f = elem[1];
                            else if (elem[0] === "pro_cub_recubrimiento") g = elem[1];
                            else if (elem[0] === "pro_cub_tintas") h = elem[1];
                            else if (elem[0] === "pro_acabados") i = elem[1];
                            else if (elem[0] === "pro_int_pagina") j = elem[1];
                        });

                        // Crear el objeto de datos para el producto actual
                        let datos = {
                            id: 0,
                            pro_codigo: a,
                            pro_nombre: b,
                            pro_int_pagina: j,
                            pro_tamaño: c,
                            pro_acabados: i,
                            pro_cub_recubrimiento: g,
                            cantidad: "",
                            fe_entrega: fe,
                            observacion: "",
                            mat_in_codigo: d,
                            pro_int_tinta: e,
                            mat_cub_codigo: f,
                            pro_cub_tintas: h,
                        };

                        // Agrega el producto a `inputs`
                        this.inputs.push(datos);

                        // Elimina el código de `options3` después de agregarlo
                        // const index = this.options3.findIndex(option => option.pro_codigo === a);
                        // if (index !== -1) {
                        //     this.options3.splice(index, 1);
                        // }
                        this.productosSeleccionados = [];
                    })
                    .catch((error) => {
                        if (error.response != "") {
                            me.$vs.notify({
                                text: "No está registrado las características del producto para la orden de trabajo en esta búsqueda",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-x",
                            });
                        } else {
                            console.log(error + " error");
                        }
                    });
            });

            // Espera a que todas las promesas se completen antes de cerrar el loading
            Promise.all(fetchPromises)
                .then(() => {
                    me.pro_codigo = []; // Limpiar el modelo `pro_codigo` después de procesar todos los códigos seleccionados
                    me.$vs.loading.close();
                })
                .catch((error) => {
                    console.error("Error en la ejecución de fetch:", error);
                    me.$vs.loading.close(); // Asegurar que el loading se cierre incluso si hay un error
                });
        },
        remove(index) {
            let me = this;
            let preId = 0;
            me.$vs.loading();
            setTimeout(() => {
                preId = this.inputs[index].id;
                if (preId > 0) {
                    let formData = new FormData();
                    formData.append("id", preId);
                }
                let removedItem = this.inputs.splice(index, 1)[0];
                me.$vs.loading.close();
            }, 1000);
        },
        getremove1(index, b) {
            this.popupEliminar = true;

            this.codigoEliminar = b;
            this.k = index;
        },
        remove1(index, b) {
            let me = this;
            let preId = 0;
            let datos = {
                det_or_codigo: b,
            };
            me.$vs.loading();
            this.$http
                .post(this.$server_url + "Eliminar_OrdenDetalle", datos)
                .then((res) => {
                    preId = this.inputs[index].id;
                    if (preId > 0) {
                        let formData = new FormData();
                        formData.append("id", preId);

                        this.inputs.splice(index, 1);
                    } else {
                        this.inputs.splice(index, 1);
                    }
                    me.$vs.loading.close();

                    me.$vs.notify({
                        text: "Detalle de la orden eliminado con exito",
                        color: "success",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "Detalle de la orden no se pudo eliminar",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        edit() {
            let me = this;
            let formData = new FormData();
            formData.append("data_detalleorden", JSON.stringify(this.inputs));
            this.$vs.loading();
            this.$http
                .post(this.$server_url + "PostOrdenDetalle_Editar", formData)
                .then((res) => {
                    this.$vs.loading.close();
                    this.getOrden();
                    this.$vs.notify({
                        text: "Detalle de orden editado con exito",
                        color: "success",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                })
                .catch(function () {
                    this.$vs.loading.close();
                    this.$vs.notify({
                        text: "Detalle de Orden de trabajo no se pudo editar",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        verificar() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            if (!usuarioObjeto.iniciales) {
                this.$vs.dialog({
                    type: 'confirm',
                    color: 'danger',
                    title: `Error`,
                    // acceptText: 'Aceptar',
                    cancelText: 'Cancelar',
                    text: 'Usuario sin iniciales, no puede generar Orden de trabajo. Comuniquese con el equipo de soporte.',
                    // accept: this.aceptarLibrosObsequios
                })
                return
            } else {
                me.getTemporada()
            }
        },
        getTemporada() {
            this.verificar_edit_or_new = 'new';
            this.popupActivoGuardar = true;
            this.tabTemporada.temp = "";
            this.tabTemporada.anio = "";
            this.switchduplicarproductos_nuevo = false;
            this.productosSeleccionados = [];
            // this.tabTemporada.anio = "{ text: '2024', value: '24' }";
            this.mostrarFecha();
        },

        //SECCION GUARDAR NUEVO PRODUCTO
        getDetallar(tr) {
            let me = this;
            this.inputs_edit = this.inputs;
            this.popupadd = true;
            this.popupActivoEditar = true;
            this.productosSeleccionados = [];
            this.inputs = this.inputs_edit;
            this.inputs = [];
            let dataDetalles = [];
            this.$http
                .get(`${this.$server_url}Get_Ordendetalle?or_codigo=${tr}`)
                .then((res) => {
                    dataDetalles = res.data;
                    this.getserie(dataDetalles);
                })
                .catch((err) => {
                    console.error(err);
                    this.$vs.loading.close();
                });
        },
        getNuevo(a, b) {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            me.usuarioCreador = usuarioObjeto.idusuario;
            me.idusuarioresp = usuarioObjeto.iniciales;
            me.tabOrdenTrabajo.observacion = "";
            me.options4 = [];
            me.pro_codigo = "";

            let c, d;
            let ne = [];

            var f = this.mostrarFechayhora();
            if (!a || !b) {
                this.$vs.notify({
                    text: "seleccione los datos antes ",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            } else {
                me.$vs.loading();
                me.getEmpresas();
                me.getserie();
                me.getprov();
                me.$vs.loading();
                this.$http
                    .get(this.$server_url + "Get_Codigo")
                    .then((res) => {
                        ne = res.data;
                        c = ne[0];
                        d = ne[1];
                        me.id = c + "-" + a + b + "-" + me.idusuarioresp + "-" + d;
                        me.$vs.loading.close();
                        me.tabOrdenTrabajo.codigo = me.id;
                        me.tabOrdenTrabajo.fecha = me.mostrarFechayhora();
                        me.tabOrdenTrabajo.empresa = "";
                        me.tabOrdenTrabajo.prov_codigo = "";
                        me.tabOrdenTrabajo.aprobado = "Ing. Miguel Calderon";
                        me.tabOrdenTrabajo.solicitado = "";
                        me.tabOrdenTrabajo.elaborado = "";
                    })
                    .catch((err) => {
                        console.log(err);
                        me.$vs.loading.close();
                    });
                this.popupActivoGuardar = true;
                this.inputs = [];
            }
        },
        getserie(dataDetalles) {
            let me = this;
            this.pro_codigo = "";
            this.options3 = [];
            me.$vs.loading();
            this.$http
                .get(`${this.$server_url}GetProd`)
                .then((res) => {
                    this.options3 = res.data;
                    // Agregamos la propiedad 'nombre_completo' a cada producto
                    this.options3 = this.options3.map(p => ({
                        ...p,
                        nombre_completo: `${p.pro_nombre} (${p.pro_codigo})`
                    }));
                    // if (Array.isArray(dataDetalles)) {
                    //     const detallesCodigos = dataDetalles.map(detalle => detalle.pro_codigo);
                    //     this.options3 = this.options3.filter((option) => !detallesCodigos.includes(option.pro_codigo));
                    // } else {
                    //     console.warn('dataDetalles is not an array');
                    // }
                    me.$vs.loading.close();

                })
                .catch((err) => {
                    console.error(err);
                    this.options3 = [];
                    me.$vs.loading.close();

                });
        },
        getprov() {
            let me = this;
            me.options4 = [];
            me.$vs.loading();
            this.$http
                .get(this.$server_url + "Get_provedor")
                .then((res) => {
                    me.options4 = res.data;
                    me.$vs.loading.close();
                })
                .catch((err) => {
                    console.log(err);
                    me.options4 = [];
                    me.$vs.loading.close();
                });
        },
        guardarnuevo1() {
            let me = this;
            var f = me.mostrarFechayhora();
            let cod = me.id;
            let a = me.tabOrdenTrabajo.prov_codigo;
            let formData = new FormData();

            let b = "1";
            if (!me.tabOrdenTrabajo.empresa) {
                me.$vs.notify({
                    text: "Selecciona la empresa",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            if (!me.tabOrdenTrabajo.prov_codigo) {
                me.$vs.notify({
                    text: "Selecciona el proveedor",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            if (!me.tabOrdenTrabajo.aprobado) {
                me.$vs.notify({
                    text: "Falta el dato aprabado por",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            if (!me.tabOrdenTrabajo.solicitado) {
                me.$vs.notify({
                    text: "Falta el dato solicitado por",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            if (!me.tabOrdenTrabajo.elaborado) {
                me.$vs.notify({
                    text: "Falta el dato elaborado por",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }

            if (!me.tabOrdenTrabajo.observacion) {
                me.$vs.notify({
                    text: "Escriba la observacion antes de guardar",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            if (me.inputs.length == 0) {
                me.$vs.notify({
                    text: "Agregue los detalles antes de guardar",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            me.inputs.forEach((input, index) => {
                if (input.cantidades == 0) {
                    this.input.splice(index, 1);
                }
            });
            formData.append("or_codigo", cod);
            formData.append("usu_codigo", me.idusuarioresp);
            formData.append("or_fecha", f);
            formData.append("prov_codigo", parseInt(a));
            formData.append("or_estado", parseInt(b));
            formData.append("or_observacion", me.tabOrdenTrabajo.observacion);
            formData.append("or_empresa", me.tabOrdenTrabajo.empresa);
            formData.append("or_aprobacion", me.tabOrdenTrabajo.aprobado);
            formData.append("or_solicitado", me.tabOrdenTrabajo.solicitado);
            formData.append("or_elaborado", me.tabOrdenTrabajo.elaborado);
            formData.append("user_created", me.usuarioCreador);
            formData.append("data_detalleorden", JSON.stringify(me.inputs));
            me.$vs.loading();
            this.$http
                .post(this.$server_url + "PostOrden_Registrar_modificar", formData)
                .then((res) => {
                    if (res.data) {
                        me.$vs.notify({
                            text: "La orden de trabajo y sus detalles se han guardado correctamente.",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                    }
                    me.$vs.loading.close();
                    me.Ordentrabajo = [];
                    this.popupActivoEditar = false;
                    this.popupActivoDesactivar = false;
                    this.popupActivoGuardar = false;
                    this.popupActivoEliminar = false;
                })
                .catch(function () {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "Orden de trabajo no se pudo guardar",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        guardarnuevo() {
            let me = this;
            me.id = me.tabOrdenTrabajo.codigo;
            let formData = new FormData();

            formData.append("data_detalleorden", JSON.stringify(me.inputs));
            formData.append("or_codigo", me.id);
            me.$vs.loading();
            this.$http
                .post(this.$server_url + "PostOrdenDetalle_Registra", formData)
                .then((res) => {
                    me.Ordentrabajo = [];
                    me.$vs.loading.close();
                    me.getOrden();
                    me.$vs.notify({
                        text: "La orden de trabajo y los detalles se ha guardado con exito",
                        color: "success",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    me.popupadd = false;
                })
                .catch(function () {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "Orden de trabajo no se pudo guardar",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        getEditar(tr) {
            // console.log("editingggg");
            let me = this;
            this.verificar_edit_or_new = 'edit';
            me.orden = tr.or_codigo;
            me.productosSeleccionados = [];
            this.popupActivoEditar = true;
            this.tabOrdenTrabajo.codigo = tr.or_codigo;
            this.tabOrdenTrabajo.fecha = tr.or_fecha;
            this.tabOrdenTrabajo.observacion = tr.or_observacion;
            this.tabOrdenTrabajo.nombreEmpresa = tr.nombreEmpresa;
            this.tabOrdenTrabajo.empresa = tr.or_empresa;
            this.tabOrdenTrabajo.aprobado = tr.or_aprobacion;
            this.tabOrdenTrabajo.solicitado = tr.or_solicitado == undefined ? 'sin dato' : tr.or_solicitado;
            this.tabOrdenTrabajo.elaborado = tr.or_elaborado !== undefined ? tr.or_elaborado : 'sin dato';
            this.getEmpresas();
            this.options4 = [];
            this.getprov();
            this.getMaterialCubierta();
            this.getMaterialInterior();
            // console.log(me.orden, "numeroooooooooooooo");
            this.tabOrdenTrabajo.prov_codigo = {
                prov_codigo: tr.prov_codigo,
                prov_nombre: tr.prov_nombre
            };
            this.inputs = [];
            me.$vs.loading();
            var url = "";
            url = this.$server_url + "Get_Ordendetalle?or_codigo=" + tr.or_codigo;
            this.$http.get(url).then(function (res) {
                    me.inputs = res.data;
                    // console.log(me.inputs,"1");
                    // console.log(me.inputs_edit,"1");
                    // Crear un conjunto para hacer el seguimiento de los pro_codigo únicos
                    const proCodigoSet = new Set();
                    // Recorrer los registros de me.inputs para detectar duplicados
                    let duplicado = false;
                    me.inputs.forEach(item => {
                        if (proCodigoSet.has(item.pro_codigo)) {
                            duplicado = true; // Si ya existe el pro_codigo, es un duplicado
                        } else {
                            proCodigoSet.add(item.pro_codigo); // Si no, lo agregamos al conjunto
                        }
                    });
                    // Asignar el valor de switchduplicarproductos_edit según si hay duplicados o no
                    me.switchduplicarproductos_edit = duplicado;
                    me.$vs.loading.close();
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-user",
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error + " error");
                    this.inputs = [];
                    me.$vs.loading.close();
                });
        },
        getEditar2() {
            let me = this;
            this.verificar_edit_or_new = 'edit';
            me.$vs.loading();
            this.inputs_edit = [];
            var url = "";
            url = this.$server_url + "Get_Ordendetalle?or_codigo=" + me.orden;
            this.$http
                .get(url)
                .then(function (res) {
                    me.inputs = res.data;
                    me.$vs.loading.close();
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-user",
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error + " error");
                    this.inputs = [];
                    me.$vs.loading.close();
                });
        },
        editar() {
            let me = this;
            let a = me.tabOrdenTrabajo.prov_codigo;
            if (!me.tabOrdenTrabajo.aprobado) {
                me.$vs.notify({
                    text: "Falta el dato aprabado por",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            if (!me.tabOrdenTrabajo.solicitado) {
                me.$vs.notify({
                    text: "Falta el dato solicitado por",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            if (!me.tabOrdenTrabajo.elaborado) {
                me.$vs.notify({
                    text: "Falta el dato elaborado por",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            if (!me.tabOrdenTrabajo.observacion) {
                me.$vs.notify({
                    text: "Escriba los datos antes de editar",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            if (me.inputs.length == 0) {
                me.$vs.notify({
                    text: "Se requiere al menos un elemento para guardar los detalles exitosamente.",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            }
            let formData = new FormData();
            formData.append("or_codigo", me.tabOrdenTrabajo.codigo);
            formData.append("prov_codigo", parseInt(a));
            formData.append("or_empresa", me.tabOrdenTrabajo.empresa);
            formData.append("or_observacion", me.tabOrdenTrabajo.observacion);
            formData.append("or_aprobacion", me.tabOrdenTrabajo.aprobado);
            formData.append("or_solicitado", me.tabOrdenTrabajo.solicitado);
            formData.append("or_elaborado", me.tabOrdenTrabajo.elaborado);
            formData.append("data_detalleorden", JSON.stringify(this.inputs));

            me.$vs.loading();
            this.$http
                .post(this.$server_url + "PostOrden_Registrar_modificar", formData)
                .then((res) => {
                    if (res.data) {
                        me.$vs.notify({
                            text: "La orden de trabajo y sus detalles se han actualizado correctamente.",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                    }
                    me.$vs.loading.close();
                    this.popupActivoEditar = false;
                    me.Ordentrabajo = [];
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "Orden de trabajo no se pudo actualizar.",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        popup_desactivar_activar_orden(tr) {
            // console.log("llego", tr)
            this.popupActivoDesactivar = true;
            this.tabOrdenTrabajo.codigo = tr.or_codigo;
            this.tabOrdenTrabajo.or_estado = tr.or_estado;
        },
        desactivar_activar_orden() {
            let me = this;
            let valornuevo = me.tabOrdenTrabajo.or_estado;
            if (valornuevo == 1) {
                valornuevo = 2;
                let datos = {
                    or_codigo: me.tabOrdenTrabajo.codigo,
                    or_estado: valornuevo,
                };
                me.$vs.loading();
                this.$http
                    .post(this.$server_url + "Desactivar_Orden", datos)
                    .then((res) => {
                        me.$vs.loading.close();
                        me.Ordentrabajo = [];
                        me.$vs.notify({
                            text: "Orden Finalizada",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                        me.getCancelar();
                    })
                    .catch((error) => {
                        console.log(error);
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "No se pudo finalizar la orden",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    });
            } else if (valornuevo == 2) {
                valornuevo = 1;
                let datos = {
                    or_codigo: me.tabOrdenTrabajo.codigo,
                    or_estado: valornuevo,
                };
                me.$vs.loading();
                this.$http
                    .post(this.$server_url + "Desactivar_Orden", datos)
                    .then((res) => {
                        me.$vs.loading.close();
                        me.Ordentrabajo = [];
                        me.$vs.notify({
                            text: "Orden Pendiente",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                        });
                        me.getCancelar();
                    })
                    .catch((error) => {
                        console.log(error);
                        me.$vs.loading.close();
                        me.$vs.notify({
                            text: "No se pudo poner en pendiente la orden",
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-x",
                        });
                    });
            }
        },
        getPreguntaEliminar(tr) {
            let me = this;
            this.popupActivoEliminar = true;
            this.tabOrdenTrabajo.codigo = tr.or_codigo;
        },
        getEliminar() {
            let me = this;
            // console.log(this.tabOrdenTrabajo.codigo);
            let datos = {
                or_codigo: this.tabOrdenTrabajo.codigo,
            };
            me.$vs.loading();
            this.$http
                .post(this.$server_url + "Eliminar_Orden", datos)
                .then((data) => {
                    me.$vs.loading.close();
                    me.Ordentrabajo = [];
                    me.$vs.notify({
                        text: "Orden de trabajo eliminado con exito",
                        color: "success",
                        iconPack: "feather",
                        icon: "icon-check",
                    });
                    me.getCancelar();
                })
                .catch(function () {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "Orden de trabajo no se pudo eliminar",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        getCancelar() {
            let me = this;
            this.popupActivoEditar = false;
            this.popupActivoGuardar = false;
            this.popupActivoEliminar = false;
            this.popupActivoDesactivar = false;
            this.popuptemporada = false;
            this.popupadd = false;
            this.popupdetalle = false;
        },
        async empresaActual() {
            await this.$http.get(this.$server_url + 'empresaActual')
                .then(res => {
                    this.nombreEmpresaActual = res.data[0].descripcion_corta;
                })
                .catch(err => {
                    console.log(err);
                });
        },
        get_Proacabado_seleccion(pro_codigo, index, contexto) {
            let me = this;
            me.acabadoSeleccionadoIndex = index;
            me.acabadoSeleccionadoContexto = contexto;
            me.$vs.loading();
            this.$http
                .get(this.$server_url + "Get_Detallexprocodigo?pro_codigo=" + pro_codigo)
                .then(function (res) {
                    me.acabadosDisponibles = res.data;
                    me.$vs.loading.close();
                    if (me.acabadosDisponibles.length > 0) {
                        me.popupAcabadosSelector = true;
                    } else {
                        me.$vs.notify({
                            text: "No hay acabados disponibles para este producto",
                            color: "warning",
                            iconPack: "feather",
                            icon: "icon-alert-triangle",
                        });
                    }
                })
                .catch(function (error) {
                    console.log(error + " error");
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: "Error al obtener los acabados",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-x",
                    });
                });
        },
        seleccionarAcabado(acabado) {
            let me = this;
            if (me.acabadoSeleccionadoIndex !== null) {
                // Actualizar el acabado en el array inputs según el contexto
                if (me.acabadoSeleccionadoContexto === 'crear' || me.acabadoSeleccionadoContexto === 'detalle') {
                    me.inputs[me.acabadoSeleccionadoIndex].pro_acabados = acabado;
                } else if (me.acabadoSeleccionadoContexto === 'editar') {
                    me.inputs[me.acabadoSeleccionadoIndex].det_or_acabados = acabado;
                }
                me.$vs.notify({
                    text: "Acabado actualizado correctamente",
                    color: "success",
                    iconPack: "feather",
                    icon: "icon-check",
                });
            }
            me.popupAcabadosSelector = false;
            me.acabadoSeleccionadoIndex = null;
            me.acabadoSeleccionadoContexto = '';
        },
        Accion_ExportarExcel() {
            let me = this;
            if (me.Ordentrabajo.length === 0) {
                me.$vs.notify({
                    text: "No hay órdenes de trabajo cargadas para exportar",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle"
                });
                return;
            }
            
            const codigos = me.Ordentrabajo.map(item => item.or_codigo);
            
            me.$vs.loading({
                text: "Preparando exportación..."
            });
            
            let formData = new FormData();
            formData.append("or_codigos", JSON.stringify(codigos));
            
            me.$http.post(me.$server_url + "ExportarOrdenTrabajoExcel", formData)
                .then(res => {
                    me.$vs.loading.close();
                    const data = res.data;
                    if (data.length === 0) {
                        me.$vs.notify({
                            text: "No se encontraron detalles para exportar",
                            color: "warning",
                            iconPack: "feather",
                            icon: "icon-alert-triangle"
                        });
                        return;
                    }
                    me.exportarAExcelMasivo(data);
                })
                .catch(err => {
                    me.$vs.loading.close();
                    console.error("Error al exportar órdenes de trabajo:", err);
                    me.$vs.notify({
                        text: "Error al obtener datos para exportar",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-circle"
                    });
                });
        },
        exportarAExcelMasivo(data) {
            let me = this;
            const headerTitle = [
                'Código Orden',
                'Región',
                'Año',
                'Proveedor',
                'Empresa',
                'Estado',
                'Código Producto',
                'Producto',
                'Cantidad Solicitada',
                'Fecha de Solicitud',
                'Cantidad Recibida',
                'Fecha Recepción',
                'Tamaño',
                'Páginas',
                'Código Interior',
                'Tintas Interior',
                'Código Cubierta',
                'Tintas Cubierta',
                'Acabados',
                'Posible Entrega',
                'Recubrimiento',
                'Elaborado Por',
                'Aprobado Por',
                'Solicitado Por'
            ];
            
            const headerVal = [
                'or_codigo',
                'or_region',
                'or_anio',
                'prov_nombre',
                'nombre_empresa',
                'or_estado_texto',
                'pro_codigo',
                'pro_nombre',
                'det_or_cantidad',
                'or_fecha',
                'cantidad_recibida',
                'fecha_recepcion',
                'det_or_tamaño',
                'det_or_int_paginas',
                'det_or_in_codigo',
                'det_or_in_tintas',
                'mat_cub_codigo',
                'det_or_cub_tintas',
                'det_or_acabados',
                'det_or_posible_entrega',
                'det_or_recubrimiento',
                'us_elaborado',
                'or_aprobacion',
                'or_solicitado'
            ];

            const formattedData = data.map(item => {
                let estadoText = "Desconocido";
                if (item.or_estado == 1) estadoText = "Pendiente";
                if (item.or_estado == 2) estadoText = "Finalizado";
                
                let regionExport = "";
                let anioExport = "";
                
                if (item.or_codigo) {
                    const parts = item.or_codigo.split('-');
                    if (parts.length > 1) {
                        const match = parts[1].match(/^([CS])(\d+)/i);
                        if (match) {
                            const letter = match[1].toUpperCase();
                            const yearPart = match[2];
                            
                            if (letter === 'C') regionExport = "COSTA";
                            else if (letter === 'S') regionExport = "SIERRA";
                            
                            anioExport = yearPart;
                        }
                    }
                }
                
                return {
                    ...item,
                    or_estado_texto: estadoText,
                    or_region: regionExport,
                    or_anio: anioExport,
                    det_or_posible_entrega: item.det_or_posible_entrega ? me.formatDateForExcel(item.det_or_posible_entrega) : ""
                };
            });

            const dataExcel = me.formatJson(headerVal, formattedData);
            dataExcel.unshift(headerTitle);

            try {
                const wb = XLSX.utils.book_new();
                const ws = XLSX.utils.aoa_to_sheet(dataExcel);

                if (me.cellAutoWidth) {
                    const colWidth = dataExcel.map(row => row.map(val => {
                        if (val == null) {
                            return { 'wch': 10 };
                        } else if (val.toString().charCodeAt(0) > 255) {
                            return { 'wch': val.toString().length * 2 };
                        } else {
                            return { 'wch': val.toString().length };
                        }
                    }));
                    let result = colWidth[0] || [];
                    for (let i = 1; i < colWidth.length; i++) {
                        for (let j = 0; j < colWidth[i].length; j++) {
                            if (!result[j]) result[j] = { 'wch': 10 };
                            if (result[j]['wch'] < colWidth[i][j]['wch']) {
                                result[j]['wch'] = colWidth[i][j]['wch'];
                            }
                        }
                    }
                    // Columna "Acabados" es la índice 18 (0-based) — ancho fijo 30
                    const acabadosColIndex = headerVal.indexOf('det_or_acabados');
                    if (acabadosColIndex >= 0) {
                        result[acabadosColIndex] = { 'wch': 30 };
                    }
                    ws['!cols'] = result;
                }

                XLSX.utils.book_append_sheet(wb, ws, "DETALLES_ORDEN");

                const filename = `Ordenes_Trabajo_Export_${new Date().toISOString().slice(0, 10)}`;
                XLSX.writeFile(wb, `${filename}.xlsx`);

                me.$vs.notify({
                    text: "Excel generado correctamente.",
                    color: "success",
                    iconPack: "feather",
                    icon: "icon-check",
                });
            } catch (error) {
                console.error('Error en la exportación a Excel:', error);
                me.$vs.notify({
                    text: "No se pudo generar el archivo Excel",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-x"
                });
            }
        },
    },
};
</script>

<style>
.tabla3 {
    font-size: 8px;
    width: auto;
    border-collapse: collapse;
    /* margin-left: -50px; */
    border: 1px solid black;
    color: #000;
}

.tabla3 th,
.tabla3 td {
    font-size: 8px;
    padding: 2px;
    text-align: center;
    color: #000;
}

.tabla3 th {
    border-bottom: 1px solid #000;
    border-right: 1px solid #000;

    color: #000;
}

.tabla3 td {
    font-size: 8px;
    max-width: 200px;
    /* Ancho máximo para el contenido */
    word-wrap: break-word;
    /* Permitir el corte de palabras */
    overflow: hidden;
    /* Controlar el desbordamiento */
    text-overflow: ellipsis;
    /* Mostrar puntos suspensivos si se desborda */
    padding: 0px;
    padding-top: 5PX;
    padding-bottom: 5PX;
    /* Ajustar el padding según sea necesario */
    border-bottom: 0.5px solid #000;
    border-right: 0.5px solid #000;
    color: #000;
}

.table1 tr,
.table1 td {
    padding: 0;
    margin: 0;
}

.tablaHeader {
    font-size: 8px;
    /* width: 100%; */
    color: #000;
    border-collapse: collapse;
    /* Tamaño de letra deseado */
}

.tablaHeader tr,
.tablaHeader td {
    font-size: 8px;
    /* Tamaño de letra para celdas de datos y encabezados */
    border: 1px solid black;
    /* Borde sólido de 1px de grosor y color negro */
    padding: 8px;
    /* Espaciado interno de las celdas */
    text-align: center;
    color: #000;
    /* Alineación centrada del texto en todas las celdas */
}

.informacionformhijo1 {
    z-index: 51001;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}

.informacionformhijo2 {
    z-index: 51002;
    /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
    /* position: fixed; */
    /* Asegúrate de que la posición sea adecuada */
}

.selected-list ul {
    list-style: none;
    padding: 0;
}

.selected-list li {
    background: #f1f1f1;
    margin: 5px 0;
    padding: 8px;
    border-radius: 4px;
}

.stylevalidar {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

.switch-error {
    border: 2px solid red !important;
    border-radius: 5px;
    transition: border 0.3s ease-in-out;
}

.acabados-row {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.acabados-btn {
    min-width: 0 !important;
    width: auto !important;
    padding: 2px !important;
    margin: 0 !important;
}

.acabados-btn .vs-button--icon {
    font-size: 14px;
}

.acabados-row .vs-button {
    opacity: 0.9;
    transition: all 0.2s ease;
}

.acabados-row:hover .vs-button {
    opacity: 1;
}
</style>
