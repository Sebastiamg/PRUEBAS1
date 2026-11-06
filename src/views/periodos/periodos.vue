<template>
<div>
    <div>
        <vs-alert active="true" class="mt-2" color="danger" v-if="filtroCambioPeriodo.length > 2">
            <p class="text-center">
                <ion-icon name="warning-outline"></ion-icon> Existe más de 2 <b>períodos</b> para asignación en las instituciones
            </p>
        </vs-alert>
    </div>
    <br>
    <!--Contenido del boton agregar un periodo-->
    <div class="centerx">
        <vs-popup classContent="popup-example" :title="titleModal" :active.sync="popupActivo2">
            <div class="vx-col w-full mt-5">
                <label>Fecha inicial</label>
                <flat-pickr :config="configdateTimePicker" v-model="periodo.fecha_inicial" placeholder="Fecha Final" class="m-1 inputx w-full" style="display: inline-block;" />
            </div>
            <div class="vx-col w-full mt-5">
                <label>Fecha Final</label>
                <flat-pickr :config="configdateTimePicker" v-model="periodo.fecha_final" placeholder="Fecha Final" class="m-1 inputx w-full" style="display: inline-block;" />
            </div>
            <div class="vx-col w-full mt-5">
                <label>Descripcion</label>
                <vs-input class="inputx w-full" placeholder="Descripcion" v-model="periodo.descripcion" />
            </div>
            <div class="vx-col w-full mt-5">
                <label>Código contrato(Ejem.C23)</label>
                <vs-input class="inputx w-full" placeholder="Cod contrato" v-model="periodo.codigo_contrato" />
            </div>
            <div class="vx-col w-full mt-5">
                <ul class="leftx">
                    <li class="modelx">
                        Seleccione la region
                    </li>
                    <br>
                    <li>
                        <vs-radio v-model="periodo.region_idregion" vs-name="radios1" vs-value="1">Sierra</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.region_idregion" vs-name="radios1" vs-value="2">Costa</vs-radio>
                    </li>
                </ul>
            </div>
            <div class="vx-col w-full mt-5">
                <label>Periodo escolar</label>
                <vs-input class="inputx w-full" placeholder="Periodo escolar" v-model="periodo.periodoescolar" />
            </div>
            <vs-divider>Configuración porcentajes</vs-divider>
            <div class="vx-col w-full mt-5">
                <label>Porcentaje Descuento</label>
                <vs-input class="inputx w-full" maxlength="3" placeholder="Porcentaje Descuento" @keypress="validarkey_pvn_cantidad($event)" v-model="periodo.porcentaje_descuento" />
            </div>
            <div class="vx-col w-full mt-5">
                <label>Máximo porcentaje autorizado</label>
                <vs-input class="inputx w-full" maxlength="3" placeholder="Máximo porcentaje autorizado" @keypress="validarkey_pvn_cantidad($event)" v-model="periodo.maximo_porcentaje_autorizado" />
            </div>
            <div class="vx-col w-full mt-5">
                <label>Porcentaje Obsequio</label>
                <vs-input class="inputx w-full" maxlength="3" placeholder="Porcentaje Obsequio" @keypress="validarkey_pvn_cantidad($event)" v-model="periodo.porcentaje_obsequio" />
            </div>
            <vs-divider>Permisos Reportes</vs-divider>
            <div class="vx-col w-full mt-5">
              Visible para reporte de contabilidad
                <ul class="flex mt-1">
                    <li>
                        <vs-radio v-model="periodo.reporte_contabilidad" vs-name="radios1reporte_contabilidad" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.reporte_contabilidad" class="ml-2" vs-name="radios1reporte_contabilidad" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <!--reporte_gerencia-->
            <div class="vx-col w-full mt-5">
              Visible para reporte de gerencia
              <ul class="flex mt-1">
                <li>
                    <vs-radio v-model="periodo.reporte_gerencia" vs-name="radios1reporte_gerencia" vs-value="1">Si</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="periodo.reporte_gerencia" class="ml-2" vs-name="radios1reporte_gerencia" vs-value="0">No</vs-radio>
                </li>
              </ul>
            </div>
            <vs-divider>Permisos pedidos</vs-divider>
            <!--PERIODO FACTURADOR-->
            <div class="vx-col w-full mt-5">
                Visible para pedidos(facturador)
                <ul class="flex mt-1">
                    <li>
                        <vs-radio v-model="periodo.pedido_facturacion" vs-name="radios1pedido_facturacion" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.pedido_facturacion" class="ml-2" vs-name="radios1pedido_facturacion" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <!--PERIODO GERENCIA-->
            <div class="vx-col w-full mt-5">
                Visible para pedidos(Gerencia)
                <ul class="flex mt-1">
                    <li>
                        <vs-radio v-model="periodo.pedido_gerencia" vs-name="radios1gerencia" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.pedido_gerencia" class="ml-2" vs-name="radios1gerencia" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <!--PERIODO BODEGA-->
            <div class="vx-col w-full mt-5">
                Visible para pedidos(Bodega)
                <ul class="flex mt-1">
                    <li>
                        <vs-radio v-model="periodo.pedido_bodega" vs-name="radios1pedido_bodega" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.pedido_bodega" class="ml-2" vs-name="radios1pedido_bodega" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <!--PERIODO ASESOR-->
            <div class="vx-col w-full mt-5">
                Visible para pedidos(Asesor)
                <ul class="flex mt-1">
                    <li>
                        <vs-radio v-model="periodo.pedido_asesor" vs-name="radios1pedido_asesor" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.pedido_asesor" class="ml-2" vs-name="radios1pedido_asesor" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <vs-divider>Permisos fichero de mercado</vs-divider>
            <!--FICHERO DE MERCADO-->
            <div class="vx-col w-full mt-5">
                Visible para mostrar en fichero de mercado
                <ul class="flex mt-1">
                    <li>
                        <vs-radio v-model="periodo.permiso_fichero_mercado" vs-name="radios1permiso_fichero_mercado" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.permiso_fichero_mercado" class="ml-2" vs-name="radios1permiso_fichero_mercado" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <vs-divider>Permisos obsequios</vs-divider>
            <!--PERIODO OBSEQUIO ADMIN-->
            <div class="vx-col w-full mt-5">
                Visible para Obsequios(Admin)
                <ul class="flex mt-1">
                    <li>
                        <vs-radio v-model="periodo.obsequios_admin" vs-name="radios1obsequios_admin" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.obsequios_admin" class="ml-2" vs-name="radios1obsequios_admin" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <!--PERIODO OBSEQUIO FACTURADOR-->
            <div class="vx-col w-full mt-5">
                Visible para Obsequios(Facturador)
                <ul class="flex mt-1">
                    <li>
                        <vs-radio v-model="periodo.obsequios_facturador" vs-name="radios1obsequios_facturador" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.obsequios_facturador" class="ml-2" vs-name="radios1obsequios_facturador" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <!--PERIODO OBSEQUIO GERENCIA-->
            <div class="vx-col w-full mt-5">
                Visible para Obsequios(Gerencia)
                <ul class="flex mt-1">
                    <li>
                        <vs-radio v-model="periodo.obsequios_gerencia" vs-name="radios1obsequios_gerencia" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.obsequios_gerencia" class="ml-2" vs-name="radios1obsequios_gerencia" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <!--PERIODO OBSEQUIO ASESOR-->
            <div class="vx-col w-full mt-5">
                Visible para Obsequios(Asesor)
                <ul class="flex mt-1">
                    <li>
                        <vs-radio v-model="periodo.obsequio_asesor" vs-name="radios1obsequio_asesor" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.obsequio_asesor" class="ml-2" vs-name="radios1obsequio_asesor" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <vs-divider>Permisos activación periodo</vs-divider>
            <!--PERIODO OBSEQUIO ADMIN-->
            <div class="vx-col w-full mt-5">
                Visible para el asesor cambiar de período
                <ul class="flex mt-1">
                    <li>
                        <vs-radio v-model="periodo.cambiar_periodo" vs-name="radios1cambiar_periodo" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="periodo.cambiar_periodo" class="ml-2" vs-name="radios1cambiar_periodo" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <vs-divider color="warning">Limitacion para el asesor</vs-divider>
            <div class="vx-col w-full mt-5">
                <flat-pickr :config="configdateTimePicker" v-model="periodo.toDate" placeholder="Fecha Limite" class="m-1 inputx w-full" style="display: inline-block;" />
            </div>
            <br>
            <vs-button @click="agregarPeriodo();" color="primary" type="filled">Guardar Cambios</vs-button>
        </vs-popup>
    </div>
    <!--FIN DEL CONTENIDO POPUP PARA AGREGAR UN Agregar / Editar-->
    <vx-card title="Periodo Escolar" v-if="usuario.id_group == '1'">
        <!--PERIODOS ACTIVOS ASESOS CAMBIAR-->
        <b class="font-semibold text-success">Períodos para asignación de instituciones:</b>
        <ul class="features mt-1">
            <li v-for="(item,key) in filtroCambioPeriodo" :key="key">
                <span class="icon">
                    <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                    </svg>
                </span>
                <span><strong>Periodo: </strong>{{ item.periodoescolar }}</span>
            </li>
        </ul>
        <!--FIN PERIODOS ACTIVOS ASESORS PUEDE CAMBIAR-->
        <small v-if="usuario.id_group == 1" align="left">Ruta: /a_periodos</small>
        <p class="mt-3"> Hay {{ periodosActivos }} periodos activos. </p>
        <!--Tabla para el listado de la tabla periodos-->
        <vs-table stripe max-items="50" search pagination :data="arregloPeriodos">
            <template slot="header">
                <vs-button @click="limpiarcampos();addPeriodo();" style="margin-left: 5px;" color="success" type="filled">
                    + Agregar periodo
                </vs-button>
            </template>
            <template slot="thead">
                <!-- <vs-th>Nombre</vs-th> -->
                <!-- <vs-th>Region</vs-th> -->
                <!-- <vs-th>Fecha limite período</vs-th> -->
                <!-- <vs-th>Cod. contrato</vs-th> -->
                <vs-th width="25%">Periodo</vs-th>
                <vs-th width="25%">Detalles</vs-th>
                <vs-th width="30%">Estado</vs-th>
                <vs-th width="20%">Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].periodoescolar">
                        <p>
                            id - {{ tr.idperiodoescolar }}
                        </p>
                        <p>
                            <b><small>Región:</small></b><br>
                            <label v-if="data[indextr].region_idregion == '1'">SIERRA</label>
                            <label v-if="data[indextr].region_idregion == '2'">COSTA</label>
                        </p>
                        <p>
                            <b><small>Periodo:</small></b><br>
                            {{data[indextr].periodoescolar}}
                        </p>
                        <p>
                            <b><small>Descripción:</small> </b><br>
                            {{data[indextr].descripcion}}
                        </p>
                        <p>
                            <b><small>Código contrato:</small> </b><br>
                            {{ tr.codigo_contrato }}
                        </p>
                        <p>
                            <b><small>Fecha limite periodo:</small>  </b><br>
                            {{data[indextr].fecha_final}}
                        </p>
                    </vs-td>
                    <vs-td>
                        <b><small>% Descuento:</small></b> <br>
                        {{ tr.porcentaje_descuento }}%<br />
                        <b><small>Max % autorizado: </small></b> <br>
                        {{ tr.maximo_porcentaje_autorizado }}%<br />
                        <b><small>% Obsequios:</small> </b><br>
                         {{ tr.porcentaje_obsequio }}%<br />
                    </vs-td>
                    <vs-td :data="data[indextr].estado">
                        <label v-if="data[indextr].estado == '1'" class="text-success">Activo</label>
                        <label v-if="data[indextr].estado == '0'" class="text-danger">Inactivo</label>
                        <vs-divider>Reportes:</vs-divider>
                        <div class="flex" style="flex-direction: column;">
                            <vs-chip v-if="tr.reporte_contabilidad == 1">Contabilidad</vs-chip>
                            <vs-chip v-if="tr.reporte_gerencia == 1" style="margin: 5px 0px;">Gerencia</vs-chip>
                        </div>
                        <vs-divider>Pedidos:</vs-divider>
                        <div class="flex" style="flex-direction: column;">
                            <vs-chip v-if="tr.pedido_facturacion == 1">facturación</vs-chip>
                            <vs-chip v-if="tr.pedido_gerencia == 1" style="margin: 5px 0px;">Gerencia</vs-chip>
                            <vs-chip v-if="tr.pedido_bodega == 1" style="margin: 5px 0px;">Bodega</vs-chip>
                            <vs-chip v-if="tr.pedido_asesor == 1" style="margin: 5px 0px;">Asesor</vs-chip>
                        </div>
                        <vs-divider>Fichero de mercado:</vs-divider>
                        <div class="flex" style="flex-direction: column;">
                            <vs-chip v-if="tr.permiso_fichero_mercado == 1">Activo</vs-chip>
                            <vs-chip v-if="tr.permiso_fichero_mercado == 0">Inactivo</vs-chip>
                        </div>
                        <vs-divider>Obsequios</vs-divider>
                        <div class="flex" style="flex-direction: column;">
                            <vs-chip v-if="tr.obsequios_admin == 1">Admin</vs-chip>
                            <vs-chip v-if="tr.obsequios_facturador == 1" style="margin: 5px 0px;">Facturador</vs-chip>
                            <vs-chip v-if="tr.obsequios_gerencia == 1" style="margin: 5px 0px;">Gerencia</vs-chip>
                            <vs-chip v-if="tr.obsequio_asesor == 1" style="margin: 5px 0px;">Asesor</vs-chip>
                        </div>
                        <!--CAMBIAR PERIODO-->
                        <vs-chip v-if="tr.cambiar_periodo == 1" class="ml-2 mt-1" color="dark">Activo para asignar periodo</vs-chip>
                    </vs-td>
                    <vs-td :data="tr">
                        <div class="flex">
                            <vs-button type="border" size="small" icon-pack="feather" icon="icon-edit" class="mr-2" color="success" @click="update = true; openModal(data[indextr]);"></vs-button>
                            <vs-button type="border" v-if="data[indextr].estado == '1'" size="small" icon-pack="feather" icon="icon-x" class="mr-2" color="danger" @click="desactivar(data[indextr].idperiodoescolar)"></vs-button>
                            <vs-button color="primary" v-if="data[indextr].estado == '0'" size="small" type="border" icon-pack="feather" icon="icon-check" @click="activar(data[indextr].idperiodoescolar)"></vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>
</div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
export default {
    data: () => ({
        //para el modal
        popupActivo1: false,
        popupActivo2: false,
        //para actualizar
        update: true,
        id: 0,
        titleModal: '',
        arregloPeriodos: [],
        usuario: '',
        usuario_id: '',
        periodo: {
            fecha_inicial: '',
            fecha_final: '',
            descripcion: '',
            codigo_contrato: '',
            region_idregion: '1',
            periodoescolar: '',
            fromDate: null,
            toDate: null,
            pedido_facturacion: 0,
            pedido_gerencia: 0,
            pedido_bodega: 0,
            pedido_asesor: 0,
            permiso_fichero_mercado: 0,
            obsequios_admin: 0,
            obsequios_facturador: 0,
            obsequios_gerencia: 0,
            obsequio_asesor: 0,
            cambiar_periodo: 0,
            porcentaje_descuento: 0,
            maximo_porcentaje_autorizado: 0,
            porcentaje_obsequio: 0,
            reporte_contabilidad:0,
            reporte_gerencia: 0,
        },
        configdateTimePicker: {
            enableTime: true,
            dateFormat: 'Y-m-d'
        },
        userRoot: false,
        filtroCambioPeriodo: 0,
        periodosActivos:0,
    }),
    components: {
        flatPickr,
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.usuario_id = me.usuario.idusuario
        console.log(me.usuario_id)
        me.getAdmin();
        me.getUserRoot(me.usuario);
    },
    methods: {
        validarkey_pvn_cantidad(event) {
            // Verificar si la tecla presionada es un número.
            if (!/\d/.test(event.key)) {
                event.preventDefault();
                return;
            }
            // Validar el formato del número
            // if (!/^\d{0,5}(\.\d{0,3})?$/.test(numentero)) {
            //     libro.pvn_cantidad = '';
            //     console.log("reset");
            // }
        },
        getUserRoot(dato) {
            let me = this;
            this.$http.get(this.$server_url + 'permisos/' + dato.idusuario)
                .then((result) => {
                    if (result.data.length > 0) {
                        me.userRoot = true;
                    }
                    if (this.usuario.id_group == 11 || this.userRoot == true) {
                        this.disableAsesor = false
                        this.disableFacturador = true
                    } else {
                        this.disableAsesor = true
                        this.disableFacturador = false
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
        },
        getAdmin() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'periodo')
                .then(function (response) {
                    me.arregloPeriodos = response.data;
                    let datos = response.data
                    if (datos.length > 0) {
                        //solo puede activo 2 periodos para cambiar
                        let preData = datos.filter(p => p.cambiar_periodo == '1')
                        me.filtroCambioPeriodo = preData
                    }
                    me.periodosActivos = datos.filter(p => p.estado == '1').length;
                    // console.log("Períodos activos:", me.periodosActivos);
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        addPeriodo() {
            let me = this;
            if (me.userRoot) {
                me.id = 0
                me.popupActivo2 = true;
            } else {
                me.$vs.notify({
                    time: 8000,
                    text: 'No tiene permiso para agregar periodos escolares, consulte con el administradores.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            }
        },
        //para agregar periodo
        agregarPeriodo() {
            let me = this;
            let formData = new FormData();
            //validacion
            if (me.periodo.codigo_contrato == null || me.periodo.codigo_contrato == "" || me.periodo.codigo_contrato == undefined || me.periodo.codigo_contrato == "null") {
                me.$vs.notify({
                    text: 'Código de contrato obligatorio',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return
            }
            formData.append('id',                   me.id);
            formData.append('fecha_inicial',        me.periodo.fecha_inicial);
            formData.append('fecha_final',          me.periodo.fecha_final);
            formData.append('descripcion',          me.periodo.descripcion);
            formData.append('region_idregion',      me.periodo.region_idregion);
            formData.append('periodoescolar',       me.periodo.periodoescolar);
            formData.append('fhasta_limite',        me.periodo.toDate);
            formData.append('codigo_contrato',      me.periodo.codigo_contrato);
            //permisos reportes
            formData.append('reporte_contabilidad', me.periodo.reporte_contabilidad)
            formData.append('reporte_gerencia', me.periodo.reporte_gerencia)
            //pedidos
            formData.append('pedido_facturacion', me.periodo.pedido_facturacion);
            formData.append('pedido_gerencia', me.periodo.pedido_gerencia)
            formData.append('pedido_bodega', me.periodo.pedido_bodega);
            formData.append('pedido_asesor', me.periodo.pedido_asesor);
            //fichero de mercado
            formData.append('permiso_fichero_mercado', me.periodo.permiso_fichero_mercado);
            //obsequios
            formData.append('obsequios_admin', me.periodo.obsequios_admin);
            formData.append('obsequios_facturador', me.periodo.obsequios_facturador);
            formData.append('obsequios_gerencia', me.periodo.obsequios_gerencia);
            formData.append('obsequio_asesor', me.periodo.obsequio_asesor);
            //cambiar periodo
            formData.append('cambiar_periodo', me.periodo.cambiar_periodo);
            formData.append('porcentaje_descuento', parseInt(me.periodo.porcentaje_descuento));
            formData.append('maximo_porcentaje_autorizado', parseInt(me.periodo.maximo_porcentaje_autorizado));
            formData.append('porcentaje_obsequio', parseInt(me.periodo.porcentaje_obsequio));
            me.$vs.loading()
            this.$http.post(this.$server_url + 'periodo', formData)
                .then(res => {
                    me.getAdmin();
                    me.popupActivo1 = false
                    me.popupActivo2 = false
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Periodo guardado exitosamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },
        openModal(data = {}) {
            let me = this;
            if (me.userRoot) {
                this.popupActivo1                   = true;
                this.id                             = data.idperiodoescolar;
                this.titleModal                     = "Modificar Periodo";
                this.periodo.fecha_inicial          = data.fecha_inicial;
                this.periodo.fecha_final            = data.fecha_final;
                this.periodo.descripcion            = data.descripcion;
                this.periodo.region_idregion        = data.region_idregion;
                this.periodo.periodoescolar         = data.periodoescolar;
                this.periodo.fromDate               = data.finicio_limite;
                this.periodo.toDate                 = data.fhasta_limite;
                this.periodo.codigo_contrato        = data.codigo_contrato
                //permisos de reporte
                this.periodo.reporte_contabilidad   = data.reporte_contabilidad
                this.periodo.reporte_gerencia       = data.reporte_gerencia
                //pedidos
                this.periodo.pedido_facturacion = data.pedido_facturacion
                this.periodo.pedido_gerencia = data.pedido_gerencia
                this.periodo.pedido_bodega = data.pedido_bodega
                this.periodo.pedido_asesor = data.pedido_asesor
                //fichero de mercado
                this.periodo.permiso_fichero_mercado = data.permiso_fichero_mercado
                //obsequios
                this.periodo.obsequios_admin = data.obsequios_admin
                this.periodo.obsequios_facturador = data.obsequios_facturador
                this.periodo.obsequios_gerencia = data.obsequios_gerencia
                this.periodo.obsequio_asesor = data.obsequio_asesor
                //cambiar periodo
                this.periodo.cambiar_periodo = data.cambiar_periodo
                this.periodo.porcentaje_descuento = data.porcentaje_descuento
                this.periodo.maximo_porcentaje_autorizado = data.maximo_porcentaje_autorizado
                this.periodo.porcentaje_obsequio = data.porcentaje_obsequio
                me.popupActivo2 = true
            } else {
                me.$vs.notify({
                    time: 8000,
                    text: 'No tiene permiso para editar periodos escolares, consulte con el administrador.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            }
        },
        limpiarcampos() {
            this.id                           = 0;
            this.titleModal                   = "Crear Periodo";
            this.periodo.fecha_inicial        = "";
            this.periodo.fecha_final          = "";
            this.periodo.descripcion          = "";
            this.periodo.region_idregion      = "";
            this.periodo.periodoescolar       = "";
            this.periodo.fromDate             = "";
            this.periodo.toDate               = "";
            this.periodo.codigo_contrato      = "";
            //permisos reportes
            this.periodo.reporte_contabilidad = 0
            this.periodo.reporte_gerencia     = 0
            //pedidos
            this.periodo.pedido_facturacion   = 0
            this.periodo.pedido_gerencia      = 0
            this.periodo.pedido_bodega        = 0
            this.periodo.pedido_asesor        = 0
            //fichero de mercado
            this.periodo.permiso_fichero_mercado = 0
            //obsequios
            this.periodo.obsequios_admin      = 0
            this.periodo.obsequios_facturador = 0
            this.periodo.obsequios_gerencia   = 0
            this.periodo.obsequio_asesor      = 0
            //cambiar periodo
            this.periodo.cambiar_periodo      = 0
            this.periodo.porcentaje_descuento = 35
            this.periodo.maximo_porcentaje_autorizado = 45
            this.periodo.porcentaje_obsequio  = 2
        },
        // desactivar el estado de la tabla
        desactivar(idperiodoescolar) {
            let me = this;
            if (me.userRoot) {
                let me = this;
                let formData = new FormData();
                formData.append('idperiodoescolar', idperiodoescolar);
                me.$vs.loading()
                this.$http.post(this.$server_url + 'periodo/desactivar', formData)
                    .then(res => {
                        me.getAdmin();
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Periodo  actualizado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    })
            } else {
                me.$vs.notify({
                    time: 8000,
                    text: 'No tiene permiso para desactivar periodos escolares, consulte con el administrador.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            }
        },
        activar(idperiodoescolar) {
            let me = this;
            if (me.userRoot) {
                let formData = new FormData();
                formData.append('idperiodoescolar', idperiodoescolar);
                me.$vs.loading()
                this.$http.post(this.$server_url + 'periodo/activar', formData)
                    .then(res => {
                        me.getAdmin();
                        me.$vs.loading.close()
                        me.$vs.notify({
                            text: 'Periodo  actualizado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    })
            } else {
                me.$vs.notify({
                    time: 8000,
                    text: 'No tiene permiso para activar periodos escolares, consulte con el administrador.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            }
        },
    },
}
</script>

<style scoped>
.features {
    display: flex;
    flex-direction: column;
}

.features li {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.features li+* {
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

.features+* {
    margin-top: 1.25rem;
}
</style>
