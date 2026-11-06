<template>
<vx-card fixed-height="true">
    <vs-row vs-justify="flex-start">
        <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar característica del producto</vs-button>
        <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
            <p>Búsqueda por filtros</p>
            <br>
            <vs-card class="seccionmostrartodo">
                <div>
                    <vs-input v-if="valorBusqueda !== '2'" class="w-full" @keyup.enter="getProductoCaracteristicaParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;" icon="search" placeholder="Buscar" v-model="busquedaxcodigo" />
                </div>
                <div>
                    <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                        <li class="modelx">
                        </li>
                        <li style="margin:10px 20px 0px 0px;">
                            <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='codigopro'">Código</vs-radio>
                        </li>
                        <li style="margin:10px 10px 0px 0px;">
                            <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda" @input="busqueda='nombres'">Nombres</vs-radio>
                        </li>
                        <li>
                            <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getProductoCaracteristicaParametro();" icon="search"></vs-button>
                        </li>
                    </ul>
                </div>
            </vs-card>
        </vs-col>
    </vs-row>
    <!-- <vs-button type="border" color="success" class="mr-2" @click="getNuevo()">Agregar Nuevo Producto</vs-button> -->
    <vs-table max-items="10" pagination search :data="Productocaracteristica">
        <template slot="header">
            <vs-chip color="primary">Cantidad: <b> {{ Productocaracteristica.length }}</b></vs-chip>
        </template>
        <!-- {{cliCi}} -->
        <template slot="thead">
            <vs-th width="100">
                Código
            </vs-th>
            <vs-th colspan="1" width="500">
                Información General
            </vs-th>
            <vs-th colspan="1" width="350">
                Información Pagina interiores
            </vs-th>
            <vs-th colspan="1" width="400">
                Información Carátula cubierta
            </vs-th>
            <vs-th colspan="1" width="400">
                Fechas y estado
            </vs-th>
            <vs-th width="100">
                Acciones
            </vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                <vs-td :data="data[indextr].pro_car_codigo">
                    {{ data[indextr].pro_car_codigo }}
                </vs-td>
                <vs-td>
                    <small><b>Nombre producto:</b> {{tr.pro_nombre}} </small><br>
                    <small><b>Tamaño:</b> {{tr.pro_tamaño}} </small><br>
                    <small><b>Producto acabados:</b> {{tr.pro_acabados}}</small><br>
                    <!-- <small><b>Producto guías:</b> {{tr.pro_guia}}</small><br> -->
                </vs-td>
                <vs-td>
                    <small><b>Material Interior codigo:</b> {{tr.mat_in_codigo}}</small><br>
                    <small><b>Material Interior nombre:</b> {{tr.mat_in_nombre}}</small><br>
                    <small><b>Producto Interior Pagina:</b> {{tr.pro_int_pagina}}</small><br>
                    <small><b>Producto Interior tinta:</b> {{tr.pro_int_tinta}}</small><br>
                </vs-td>
                <vs-td>
                    <small><b>Material cubierta codigo:</b> {{tr.mat_cub_codigo}}</small><br>
                    <small><b>Material cubierta nombre:</b> {{tr.mat_cub_nombre}}</small><br>
                    <small><b>Producto cubierta recubrimiento:</b> {{tr.pro_cub_recubrimiento}}</small><br>
                    <small><b>Producto cubierta tintas:</b> {{tr.pro_cub_tintas}}</small><br>
                </vs-td>
                <vs-td>
                    <small><b>Fecha creación:</b> {{ tr.created_at || 'No registra' }}</small><br>
                    <small><b>Usuario creador:</b> {{ tr.usuario_creador || 'No registra' }}</small><br>
                    <br>
                    <vs-chip v-if="tr.pro_car_estado == 1" color="primary">Creado</vs-chip>
                    <vs-chip v-if="tr.pro_car_estado == 2" color="warning">Pendiente</vs-chip>
                    <vs-chip v-if="tr.pro_car_estado == 3" color="success">Entregado</vs-chip>
                </vs-td>
                <vs-td :data="data[indextr].pro_car_codigo">
                    <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                        <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                        <vs-dropdown-menu style="width: 250px;" class="cursor">
                            <vs-dropdown-item>
                                <vs-button color="#28C76F" type="line" class="w-full" @click="popupActivo=true;getEditar(tr)">Editar</vs-button>
                                <vs-button color="#EA5455" type="line" class="w-full" @click="popupActivo=true;getPreguntaEliminar(tr)">Eliminar</vs-button>
                            </vs-dropdown-item>
                        </vs-dropdown-menu>
                    </vs-dropdown>
                </vs-td>
            </vs-tr>
        </template>
    </vs-table>
    <!-- SECCION REGISTRO -->
    <vs-popup class="crear" title="Registro nueva caracteristica del producto" :active.sync="popupActivoGuardar" fullscreen>
        <vs-row>
            <!-- {{ tabProductoCaracteristica }} -->
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>Información Caracteristica Producto</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <font style="font-size: 11.5px">&nbsp;Código Producto Caracteristica</font><br>
                        <v-select :options="Producto" :reduce="Producto => Producto.pro_codigo" label="nombre_completo" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProductoCaracteristica.pro_car_codigo" :filter="customFilter" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="11">
                                <font style="font-size: 11.5px">&nbsp;Producto guía</font><br>
                                <v-select :options="Producto_comienzaconG" :reduce="Producto_comienzaconG => Producto_comienzaconG.pro_codigo" label="pro_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProductoCaracteristica.pro_guia" />
                            </vs-col>
                        </vs-row>
                    </vs-col> -->
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto Tamaño " placeholder="Producto Tamaño" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_tamaño" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto acabados " placeholder="Producto acabados" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_acabados" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center; margin-top: 10px"><b>Página/Interiores</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <font style="font-size: 11.5px">&nbsp;Código material interior</font><br>
                        <v-select :options="MaterialInterior" :reduce="MaterialInterior => MaterialInterior.mat_in_codigo" label="nombre_completo" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProductoCaracteristica.mat_in_codigo" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto interior página " type="number" placeholder="Producto interior página" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_int_pagina" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto interior tinta " placeholder="Producto interior tinta" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_int_tinta" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center; margin-top: 10px"><b>Carátula/Cubierta</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <font style="font-size: 11.5px">&nbsp;Código material cubierta</font><br>
                        <v-select :options="MaterialCubierta" :reduce="MaterialCubierta => MaterialCubierta.mat_cub_codigo" label="nombre_completo" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProductoCaracteristica.mat_cub_codigo" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto cubierta recubrimiento " placeholder="Producto cubierta recubrimiento" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_cub_recubrimiento" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto cubierta tintas " placeholder="Producto cubierta tintas" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_cub_tintas" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="guardarnuevo()" type="relief">Guardar</vs-button>&emsp;
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <!-- SECCION EDITAR -->
    <vs-popup class="editar" :title="`Edición de caracteristica del producto: ${tabProductoCaracteristica.pro_car_codigo}`" :active.sync="popupActivoEditar" fullscreen>
        <vs-row>
            <!-- {{ tabProductoCaracteristica }} -->
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center;"><b>{{tabProductoCaracteristica.pro_nombre}} ({{ tabProductoCaracteristica.pro_car_codigo }}) <br> Información Caracteristica Producto</b></vs-col>
            <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="11">
                                <font style="font-size: 11.5px">&nbsp;Código Producto Caracteristica</font><br>
                                <v-select :options="Producto" :reduce="Producto => Producto.pro_codigo" label="pro_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProductoCaracteristica.pro_car_codigo" />
                            </vs-col>
                        </vs-row>
                    </vs-col> -->
            <!-- <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="11">
                                <font style="font-size: 11.5px">&nbsp;Producto guía</font><br>
                                <v-select :options="Producto_comienzaconG" :reduce="Producto_comienzaconG => Producto_comienzaconG.pro_codigo" label="pro_nombre" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProductoCaracteristica.pro_guia" />
                            </vs-col>
                        </vs-row>
                    </vs-col> -->
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto Tamaño " placeholder="Producto Tamaño" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_tamaño" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto acabados " placeholder="Producto acabados" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_acabados" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center; margin-top: 10px"><b>Página/Interiores</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <font style="font-size: 11.5px">&nbsp;Código material interior</font><br>
                        <v-select :options="MaterialInterior" :reduce="MaterialInterior => MaterialInterior.mat_in_codigo" label="nombre_completo" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProductoCaracteristica.mat_in_codigo" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto interior página " type="number" placeholder="Producto interior página" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_int_pagina" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto interior tinta " placeholder="Producto interior tinta" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_int_tinta" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" style="text-align: center; margin-top: 10px"><b>Carátula/Cubierta</b></vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <font style="font-size: 11.5px">&nbsp;Código material cubierta</font><br>
                        <v-select :options="MaterialCubierta" :reduce="MaterialCubierta => MaterialCubierta.mat_cub_codigo" label="nombre_completo" class="w-full h-100" placeholder="--Seleccione--" v-model="tabProductoCaracteristica.mat_cub_codigo" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto cubierta recubrimiento " placeholder="Producto cubierta recubrimiento" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_cub_recubrimiento" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="6" vs-xs="6">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="11">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Producto cubierta tintas " placeholder="Producto cubierta tintas" class="w-full" icon="mode_edit" v-model="tabProductoCaracteristica.pro_cub_tintas" @keypress="validarValor" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
        <br><br>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
            <vs-button @click="editar()" type="relief">Editar</vs-button>&emsp;
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <vs-popup class="eliminar" :title="`¿Confirma que desea eliminar el registro: ${pro_car_codigo}?`" :active.sync="popupActivoEliminar">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getEliminar()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
    <vs-popup class="desactivar" :title="`¿Confirma que desea cambiar el estado del producto: ${pro_car_codigo}?`" :active.sync="popupActivoDesactivar">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="desactivar_activar_producto()" type="relief">Aceptar</vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
        </vs-col>
    </vs-popup>
</vx-card>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select';
export default {
    data() {
        return {
            Productocaracteristica: [],
            popupActivoGuardar: false,
            popupActivoEditar: false,
            popupActivoDesactivar: false,
            popupActivoEliminar: false,
            tabProductoCaracteristica: {
                pro_nombre: '',
                pro_car_codigo: '',
                pro_tamaño: '',
                pro_int_pagina: '',
                mat_in_codigo: '',
                pro_int_tinta: '',
                mat_cub_codigo: '',
                pro_cub_recubrimiento: '',
                pro_cub_tintas: '',
                pro_acabados: '',
                // pro_guia: '',
            },
            pro_car_codigo: 0,
            Productocaracteristica_todo: [],
            MaterialCubierta: [],
            MaterialInterior: [],
            // Producto_comienzaconG: [],
            Producto: [],
            busquedaxcodigo: "",
            valorBusqueda: "0",
            checkBox_mostrarinactivos: false,
            //showAgregarNuevo: false,
        }
    },
    watch: {
        valorBusqueda(newValue) {
            if (newValue === '0') {
                this.Productos = [];
            } else if (newValue === '1') {
                this.Productos = [];
            }
        }
    },
    components: {
        'v-select': vSelect,
    },
    mounted() {
        //this.getProductoCaracteristica_pro_cub_int();
        this.getProductoCaracteristica();
        this.getProducto();
        this.getMaterialCubierta();
        this.getMaterialInterior();
        // this.getProductos_comienzaconG();
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
        getProducto() {
            let me = this;
            this.$http.get(this.$server_url + 'GetProducto_ParaCaracteristicas')
                .then(res => {
                    // Asignamos los datos recibidos
                    this.Producto = res.data;

                    // Agregamos la propiedad 'nombre_completo' a cada producto
                    this.Producto = this.Producto.map(p => ({
                        ...p,
                        nombre_completo: `${p.pro_nombre} (${p.pro_codigo})`
                    }));

                    // Verificamos en consola
                    console.log(this.Producto);
                })
                .catch(err => {
                    console.log(err);
                });
        },
        getProductoCaracteristica() {
            let me = this;
            this.$http.get(this.$server_url + 'GetCarateristicaProducto_todo')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.Productocaracteristica_todo = res.data;
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getProductoCaracteristica_pro_cub_int() {
            let me = this;
            this.$http.get(this.$server_url + 'GetCaracteristicaProducto_pro_cub_int')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.Productocaracteristica = res.data;
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getMaterialCubierta() {
            let me = this;
            this.$http.get(this.$server_url + 'Get_Materialcubierta')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.MaterialCubierta = res.data.map(p => ({
                        ...p,
                        nombre_completo: `${p.mat_cub_nombre} (${p.mat_cub_codigo})`
                    }));
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
                    this.MaterialInterior = res.data.map(p => ({
                        ...p,
                        nombre_completo: `${p.mat_in_nombre} (${p.mat_in_codigo})`
                    }));
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getProductos_comienzaconG() {
            let me = this;
            this.$http.get(this.$server_url + 'GetProducto_ComienzaconG')
                //axios.get(this.$apifacturacion_url + 'f_Producto')
                .then(res => {
                    //let resultado = res.data.productos.filter(p => p.proCodigo !== 0);
                    //this.Productos = resultado;
                    this.Producto_comienzaconG = res.data;
                    // console.log(this.Productos);
                    // console.log(this.Grupos);
                })
                .catch(err => {
                    console.log(err)
                })
        },
        getProductoCaracteristicaParametro() {
            let me = this;
            this.checkBox_mostrarinactivos = false;
            //this.showAgregarNuevo = true;
            if (me.busquedaxcodigo.length < 2) {
                me.$vs.notify({
                    text: 'Minimo 2 caracteres de busqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }
            me.$vs.loading()
            //axios.get(this.$apifacturacion_url + 'f_Producto/GetxParametros?busqueda='+me.busqueda+'&razonbusqueda='+me.busquedaxcodigo)
            this.$http.get(this.$server_url + 'GetCaracteristicaProducto_pro_cub_int_xfiltro?busqueda=' + me.busqueda + '&razonbusqueda=' + me.busquedaxcodigo)
                .then(function (res) {
                    // me.tmpVenta = res.data;
                    // let resultado = res.data.filter(c => c.cliCi !== 0);
                    me.Productocaracteristica = res.data;
                    if (me.Productocaracteristica.length === 0) {
                        me.$vs.notify({
                            text: 'No hay caracteristicas de productos para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Productocaracteristica = [];
                        me.$vs.loading.close()
                    } else {
                        // me.filtroRegion();
                        me.$vs.loading.close()
                        if (res.data.message) {
                            me.$vs.notify({
                                text: res.data.message,
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-user'
                            })
                        }
                    }
                })
                .catch(function (error) {
                    if (error.response && error.response.status === 404) {
                        me.$vs.notify({
                            text: 'No hay caracteristicas de productos para esta búsqueda',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x'
                        })
                        me.Productocaracteristica = [];
                        me.$vs.loading.close()
                    } else {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    }
                })
        },
        //SECCION GUARDAR NUEVO PRODUCTO
        getNuevo() {
            this.popupActivoGuardar = true
            this.tabProductoCaracteristica.pro_car_codigo = ''
            this.tabProductoCaracteristica.pro_tamaño = ''
            this.tabProductoCaracteristica.pro_int_pagina = null
            this.tabProductoCaracteristica.mat_in_codigo = ''
            this.tabProductoCaracteristica.pro_int_tinta = ''
            this.tabProductoCaracteristica.mat_cub_codigo = ''
            this.tabProductoCaracteristica.pro_cub_recubrimiento = ''
            this.tabProductoCaracteristica.pro_cub_tintas = ''
            this.tabProductoCaracteristica.pro_acabados = ''
            // this.tabProductoCaracteristica.pro_guia = ''
        },
        guardarnuevo() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            const usuarioObjeto = JSON.parse(usuariorespo);
            let resultado = me.Productocaracteristica_todo.filter(v => v.pro_car_codigo == this.tabProductoCaracteristica.pro_car_codigo);
            if (resultado.length > 0) {
                me.$vs.notify({
                    text: 'Ya existe un registro con ese código de la caracteristica del producto',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (this.tabProductoCaracteristica.mat_in_codigo === '' || this.tabProductoCaracteristica.mat_in_codigo === null) {
                me.$vs.notify({
                    text: 'Seleccione el material interior antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabProductoCaracteristica.mat_cub_codigo === '' || this.tabProductoCaracteristica.mat_cub_codigo === null) {
                me.$vs.notify({
                    text: 'Seleccione el material cubierta antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let datos = {
                "pro_car_codigo": this.tabProductoCaracteristica.pro_car_codigo,
                "pro_tamaño": this.tabProductoCaracteristica.pro_tamaño,
                "pro_int_pagina": parseInt(this.tabProductoCaracteristica.pro_int_pagina),
                "mat_in_codigo": this.tabProductoCaracteristica.mat_in_codigo,
                "pro_int_tinta": this.tabProductoCaracteristica.pro_int_tinta,
                "mat_cub_codigo": this.tabProductoCaracteristica.mat_cub_codigo,
                "pro_cub_recubrimiento": this.tabProductoCaracteristica.pro_cub_recubrimiento,
                "pro_cub_tintas": this.tabProductoCaracteristica.pro_cub_tintas,
                "pro_acabados": this.tabProductoCaracteristica.pro_acabados,
                // "pro_guia": this.tabProductoCaracteristica.pro_guia,
                "user_created": usuarioObjeto.idusuario,
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url + 'Registrar_modificar_CaracteristicaProducto', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getProducto();
                    this.getProductoCaracteristicaParametro();
                    this.getProductoCaracteristica();
                    me.$vs.notify({
                        text: 'Característica del producto guardada con exito',
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
                        text: 'Característica del producto no se pudo guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        // getProducto() {
        // axios.get('https://localhost:7252/api/Vendedor')
        //     .then(res => {
        //     let resultado = res.data.filter(c => c.cliCi !== null && c.cliCi !== '');
        //     this.Vendedores = resultado;
        //     console.log(this.Vendedores);
        //     })
        //     .catch(err => {
        //     console.log(err);
        //     });
        // },
        getEditar(tr) {
            this.popupActivoEditar = true
            this.tabProductoCaracteristica.pro_car_codigo = tr.pro_car_codigo
            this.tabProductoCaracteristica.pro_tamaño = tr.pro_tamaño
            this.tabProductoCaracteristica.pro_int_pagina = tr.pro_int_pagina
            this.tabProductoCaracteristica.mat_in_codigo = tr.mat_in_codigo
            this.tabProductoCaracteristica.pro_int_tinta = tr.pro_int_tinta
            this.tabProductoCaracteristica.mat_cub_codigo = tr.mat_cub_codigo
            this.tabProductoCaracteristica.pro_cub_recubrimiento = tr.pro_cub_recubrimiento
            this.tabProductoCaracteristica.pro_cub_tintas = tr.pro_cub_tintas
            this.tabProductoCaracteristica.pro_acabados = tr.pro_acabados
            // this.tabProductoCaracteristica.pro_guia = tr.pro_guia
            this.tabProductoCaracteristica.pro_nombre = tr.pro_nombre
            // this.$router.push('/prueba/editar/' + this.id);
            // console.log(id);
            // this.$params.id;
        },
        editar() {
            let me = this;
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (this.tabProductoCaracteristica.mat_in_codigo === '' || this.tabProductoCaracteristica.mat_in_codigo === null) {
                me.$vs.notify({
                    text: 'Seleccione el material interior antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (this.tabProductoCaracteristica.mat_cub_codigo === '' || this.tabProductoCaracteristica.mat_cub_codigo === null) {
                me.$vs.notify({
                    text: 'Seleccione el material cubierta antes de guardar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let datos = {
                "pro_car_codigo": this.tabProductoCaracteristica.pro_car_codigo,
                "pro_tamaño": this.tabProductoCaracteristica.pro_tamaño,
                "pro_int_pagina": parseInt(this.tabProductoCaracteristica.pro_int_pagina),
                "mat_in_codigo": this.tabProductoCaracteristica.mat_in_codigo,
                "pro_int_tinta": this.tabProductoCaracteristica.pro_int_tinta,
                "mat_cub_codigo": this.tabProductoCaracteristica.mat_cub_codigo,
                "pro_cub_recubrimiento": this.tabProductoCaracteristica.pro_cub_recubrimiento,
                "pro_cub_tintas": this.tabProductoCaracteristica.pro_cub_tintas,
                "pro_acabados": this.tabProductoCaracteristica.pro_acabados,
                // "pro_guia": this.tabProductoCaracteristica.pro_guia,
            }
            me.$vs.loading()
            //axios.post(this.$apifacturacion_url + 'f_Producto/AggOrUpdateProducto', datos)
            this.$http.post(this.$server_url + 'Registrar_modificar_CaracteristicaProducto', datos)
                .then(res => {
                    me.$vs.loading.close()
                    this.getProductoCaracteristicaParametro();
                    this.getProductoCaracteristica();
                    me.$vs.notify({
                        text: 'Característica del producto editado con éxito',
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
                        text: 'Característica del producto no se pudo editar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x'
                    })
                })
        },
        popup_desactivar_activar_producto(tr) {
            this.popupActivoDesactivar = true
            this.pro_codigo = tr.pro_codigo
            this.tabProductoCaracteristica.pro_estado = tr.pro_estado
        },
        desactivar_activar_producto() {
            let me = this;
            let valornuevo = this.tabProductoCaracteristica.pro_estado;
            console.log(valornuevo + 'valornuevoeatdoprocutp' + this.pro_codigo);
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
                        this.getProductoCaracteristicaParametro();
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
            this.pro_car_codigo = tr.pro_car_codigo
        },

        getEliminar() {
            let me = this;
            let datos = {
                "pro_car_codigo": this.pro_car_codigo,
            }
            me.$vs.loading()
            this.$http.post(this.$server_url + "Eliminar_CaracteristicaProducto", datos)
                .then(data => {
                    me.$vs.loading.close()
                    this.getProducto();
                    this.getProductoCaracteristicaParametro();
                    this.getProductoCaracteristica()
                    me.$vs.notify({
                        text: 'Característica del producto eliminado con exito',
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
                        text: 'Característica del producto no se pudo eliminar',
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
