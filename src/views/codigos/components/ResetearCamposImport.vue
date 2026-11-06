<template>
<vx-card title="Import cambiar valores por parámetros de los códigos" title-color="primary" subtitle="(Máximo 1500)">
    <p class="font-bold">Observación del cambio</p>
    <vs-input icon="icon-message-square" class="w-full mt-2" icon-pack="feather" placeholder="Comentario" v-model="observacion" />

    <div class="mt-4">
        <p class="font-bold mb-2">¿Actualizar código de unión?</p>
        <ul class="flex">
            <li>
                <vs-radio v-model="withCodigoUnion" vs-name="radioswithCodigoUnion" vs-value="0">No</vs-radio>
            </li>
            <li>
                <vs-radio class="ml-3" v-model="withCodigoUnion" vs-name="radioswithCodigoUnion" vs-value="1">Sí</vs-radio>
            </li>
        </ul>
    </div>
    <vs-row v-if="codigosPerdidos == true" class="mt-5">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-alert active="true">
                <p class="text-center">Se realizo el cambio de {{ porcentaje }} códigos</p>
            </vs-alert>
        </vs-col>
    </vs-row>
    <import-excel :onSuccess="loadDataInTable" class="mb-4 mt-5" />
    <vs-alert v-if="tableData.length > 0" color="danger" class="mb-3 mt-2" icon-pack="feather" icon="icon-alert-triangle">
        <p class="text-center">Excel cargado exitosamente. ¿Está seguro de cambiar estos códigos?</p><br>
    </vs-alert>
    <vs-row  class="mt-2">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <div class="vx-row">
                <div class="vx-col w-full flex">
                    <vs-button v-if="tableData.length > 0 && tableData.length <= 2000 " class="mr-3 mb-2" icon="save" @click="openConfirm()">Realizar cambios</vs-button>
                    <vs-button v-if="tableData.length > 0 && tableData.length <= 2000 " color="danger" class="mb-2 mr-3" @click="limpiar()" type="border">Resetear campos</vs-button>
                   <!--boton mostrar errores-->
                    <vs-button v-if="arrayProblemas.length > 0" color="warning" class="mb-2" @click="popupMostrarErrores=true">Mostrar Errores</vs-button>
                </div>
            </div>
        </vs-col>
    </vs-row>
    <!--TABLA QUE MUESTRA AL IMPORT-->
    <vx-card v-if="tableData.length && header.length">
        <vs-table stripe pagination :max-items="10" search :data="tableData">
            <template slot="header">
                <h4>Códigos a cambiar {{tableData.length}}</h4>
            </template>
            <template slot="thead">
                <vs-th :sort-key="heading" v-for="heading in header" :key="heading">{{ heading }}</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="col" v-for="(col, indexcol) in data[indextr]" :key="indexcol + col">
                        {{ col }}
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </vx-card>
    <!---CAMPOS A RESETEAR-->
    <vs-divider color="primary">Campos a resetear</vs-divider>
    <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <vs-input class="w-full" icon="person" label="Id usuario" v-model="codigo.idusuario" />
            <vs-checkbox style="margin-top: 25px;" v-model="chkIdusuario"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <vs-input class="w-full" icon="bookmark" label="Contrato" v-model="codigo.contrato" />
            <vs-checkbox style="margin-top: 25px;" v-model="chkContrato"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <vs-input class="w-full" icon="swap_horiz" label="Id Periodo" v-model="codigo.id_periodo" />
            <vs-checkbox style="margin-top: 20px;" v-model="chkId_periodo"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full flex" style="justify-content: space-between;">
            <div class="mt-5">
                <p class="ml-2">Estado liquidacion</p>
                <ul class="flex mt-2 ml-2">
                    <li>
                        <vs-radio v-model="codigo.estado_liquidacion" vs-name="radiosestado_liquidacion" vs-value="0">Liquidado</vs-radio>
                    </li>
                    <li>
                        <vs-radio v-model="codigo.estado_liquidacion" class="ml-3" vs-name="radiosestado_liquidacion" vs-value="1">Sin liquidar</vs-radio>
                    </li>
                    <li>
                        <vs-radio class="ml-3" v-model="codigo.estado_liquidacion" vs-name="radiosestado_liquidacion" vs-value="2">Regalado</vs-radio>
                    </li>
                    <li>
                        <vs-radio class="ml-3" v-model="codigo.estado_liquidacion" vs-name="radiosestado_liquidacion" vs-value="3">Devuelto</vs-radio>
                    </li>
                </ul>
            </div>
            <vs-checkbox style="margin-top: 20px;" v-model="chkEstado_liquidacion"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-6 flex" style="justify-content: space-between;">
            <div>
                <p class="ml-2 mt-5">Regalado liquidado</p>
                <ul class="flex mt-2 ml-2">
                    <li>
                        <vs-radio v-model="codigo.liquidado_regalado" vs-name="radiosliquidado_regalado" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio class="ml-3" v-model="codigo.liquidado_regalado" vs-name="radiosliquidado_regalado" vs-value="0">NO</vs-radio>
                    </li>
                </ul>
            </div>
            <vs-checkbox style="margin-top: 5px;" v-model="chkBc_liquidado_regalado"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full flex mb-2 mt-2" style="justify-content: space-between;">
            <div>
                <p class="ml-2">Bc_estado</p>
                <ul class="flex mt-2 ml-2">
                    <li>
                        <vs-radio v-model="codigo.bc_estado" vs-name="radiosEstado2bc_estado" vs-value="1">Sin leer</vs-radio>
                    </li>
                    <li>
                        <vs-radio class="ml-3" v-model="codigo.bc_estado" vs-name="radiosEstado2bc_estado" vs-value="2">Leido</vs-radio>
                    </li>
                </ul>
            </div>
            <div>
                <vs-checkbox style="margin-top: 25px!important" v-model="chkBc_estado"></vs-checkbox>
            </div>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <vs-input class="w-full" icon="swap_vert" label="Bc_Institucion" v-model="codigo.bc_institucion" />
            <vs-checkbox style="margin-top: 5px;" v-model="chkBc_Bc_institucion"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-6 flex">
            <vs-input class="w-full" icon="swap_vert" label="Bc_periodo" v-model="codigo.bc_periodo" />
            <vs-checkbox style="margin-top: 15px;" v-model="chkBc_Bc_periodo"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <vs-input class="w-full" icon="swap_vert" label="venta_lista_institucion" v-model="codigo.venta_lista_institucion" />
            <vs-checkbox style="margin-top: 5px;" v-model="chkBc_Venta_lista_institucion"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-6 flex" style="justify-content: space-between;">
            <div>
                <p class="ml-2">Venta estado</p>
                <ul class="flex mt-2 ml-2">
                    <li>
                        <vs-radio v-model="codigo.venta_estado" vs-name="radiosventa_estado" vs-value="0">Nada</vs-radio>
                    </li>
                    <li>
                        <vs-radio class="ml-3" v-model="codigo.venta_estado" vs-name="radiosventa_estado" vs-value="1">Venta directa</vs-radio>
                    </li>
                    <li>
                        <vs-radio class="ml-3" v-model="codigo.venta_estado" vs-name="radiosventa_estado" vs-value="2">Venta lista</vs-radio>
                    </li>
                </ul>
            </div>
            <vs-checkbox style="margin-top: 5px;" v-model="chkBc_Venta_estado"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <vs-input class="w-full" icon="filter" label="verif1" v-model="codigo.verif1" />
            <vs-checkbox style="margin-top: 5px;" v-model="chkBc_Verif1"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-6 flex">
            <vs-input type="number" class="w-full" icon="filter" label="verif2" v-model="codigo.verif2" />
            <vs-checkbox style="margin-top: 20px;" v-model="chkBc_Verif2"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <vs-input class="w-full" icon="filter" label="verif3" v-model="codigo.verif3" />
            <vs-checkbox style="margin-top: 15px;" v-model="chkBc_Verif3"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-0 flex">
            <vs-input type="number" class="w-full" icon="filter" label="verif4" v-model="codigo.verif4" />
            <vs-checkbox style="margin-top: 15px;" v-model="chkBc_Verif4"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-0 flex">
            <vs-input class="w-full" icon="filter" label="verif5" v-model="codigo.verif5" />
            <vs-checkbox style="margin-top: 15px;" v-model="chkBc_Verif5"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-0 flex mt-3">
            <vs-input class="w-full" icon="filter" label="Código unión" v-model="codigo.codigo_union" />
            <vs-checkbox v-model="chkBc_codigo_union"></vs-checkbox>
        </div>

        <div class="vx-col sm:w-1/2 w-full mb-0 flex mt-3">
            <vs-input class="w-full" icon="filter" label="codigo_proforma" v-model="codigo.codigo_proforma" />
            <vs-checkbox v-model="chkBc_codigo_proforma"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-6 flex">
            <div class="w-full">
                <small class="text-gray-600">Empresa del documento</small>
                <v-select :options="arrayEmpresas" :reduce="empresa => empresa.id" label="nombre" class="w-full" v-model="codigo.proforma_empresa" placeholder="Seleccione empresa" />
            </div>
            <vs-checkbox style="margin-top: 30px; margin-left: 10px;" v-model="chkBc_proforma_empresa"></vs-checkbox>
        </div>
        <div class="vx-col w-full mb-6 flex">
            <div>
                <ul class="flex">
                    <li>
                        <vs-radio v-model="codigo.estado" vs-name="radiosEstado2" vs-value="0">Activo</vs-radio>
                    </li>
                    <li>
                        <vs-radio class="ml-3" v-model="codigo.estado" vs-name="radiosEstado2" vs-value="2">Bloqueado</vs-radio>
                    </li>
                </ul>
            </div>
            <vs-checkbox class="ml-5" v-model="chk_estado"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <div class="w-full">
                <small class="text-gray-600">Libro (libro_idlibro)</small>
                <v-select :options="arrayLibrosIndividuales" :reduce="libro => libro.codigo_liquidacion" label="nombreCompleto" class="w-full" v-model="codigo.codigo_liquidacion_libro" @input="onLibroIndivualSelected" placeholder="Seleccione libro" />
            </div>
            <vs-checkbox style="margin-top: 30px; margin-left: 10px;" v-model="chkLibro_idlibro"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <div class="w-full">
                <small class="text-gray-600">Combo</small>
                <!-- <vs-input class="w-full" icon="layers" label="Combo" v-model="codigo.combo" /> -->
                <v-select :options="arrayCombos" :reduce="arrayCombos => arrayCombos.codigo_liquidacion" label="combolibro" class="w-full" v-model="codigo.combo" />
            </div>
            <vs-checkbox style="margin-top: 30px; margin-left: 10px;" v-model="chkCombo"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <vs-input class="w-full" icon="layers" label="codigo_combo" v-model="codigo.codigo_combo" />
            <vs-checkbox style="margin-top: 15px;" v-model="chkCodigo_combo"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <vs-input class="w-full" icon="file-text" label="Factura" v-model="codigo.factura" />
            <vs-checkbox style="margin-top: 15px;" v-model="chkFactura"></vs-checkbox>
        </div>
            <div class="vx-col sm:w-1/2 w-full mb-2 flex">
            <vs-input class="w-full" icon="file-text" label="Documento de devolución" v-model="codigo.documento_devolucion" />
            <vs-checkbox style="margin-top: 15px;" v-model="chkDocumento_devolucion"></vs-checkbox>
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2 flex">
           <div>
                <p class="ml-2 mt-5">¿Devuelto en documento de venta? <small>(marcar NO cuando se limpie el documento de devolución)</small> </p>
                <ul class="flex ml-2 mt-2">
                    <li>
                        <vs-radio v-model="codigo.devuelto_proforma" vs-name="radiosdevuelto_proforma" vs-value="1">Si</vs-radio>
                    </li>
                    <li>
                        <vs-radio class="ml-3" v-model="codigo.devuelto_proforma" vs-name="radiosdevuelto_proforma" vs-value="0">No</vs-radio>
                    </li>
                </ul>
            </div>
            <vs-checkbox class="ml-5" v-model="chkDevuelto_proforma"></vs-checkbox>
        </div>
         <div class="vx-col sm:w-1/2 w-full mb-2 flex">
           <div>
              <p v-if="codigo.quitar_de_reporte == 1">El codigo debe tener verificación para quitar del reporte</p>
              <p class="ml-2 mt-5">¿Quitar del reporte?</p>
              <ul class="flex ml-2 mt-2">
                  <li>
                      <vs-radio v-model="codigo.quitar_de_reporte" vs-name="radiosquitar_de_reporte" vs-value="1">Si</vs-radio>
                  </li>
                  <li>
                      <vs-radio class="ml-3" v-model="codigo.quitar_de_reporte" vs-name="radiosquitar_de_reporte" vs-value="0">No</vs-radio>
                  </li>
              </ul>
            </div>
            <vs-checkbox class="ml-5" v-model="chkQuitar_de_reporte"></vs-checkbox>
        </div>
    </div>

    <!--MODAL PARA CONFIRMAR-->
    <vs-popup small title="Confirmación" :active.sync="modalConfirm">
        <div class="w-full mb-base" align="center">
          <h4>Está seguro de aplicar estos {{ arregloCodigosEnviar.length }} códigos?</h4>
          <b class="mt-3">Actualizar código de unión?</b>
          <p v-if="withCodigoUnion == 1">Se actualizará el código de unión.</p>
          <p v-if="withCodigoUnion == 0">No se actualizará el código de unión.</p>
        </div>
        <div class="w-full mt-5" align="center">
            <vs-button class="mb-2" color="danger" type="gradient" @click="guardarCodigo()"> Confirmar </vs-button>
        </div>
    </vs-popup>
    <!--popup para errores-->
    <vs-popup classContent="popup-example" title="Resultados" :active.sync="popupMostrarErrores">
        <div v-if="popupMostrarErrores">
            <TableReutilizableVue :title="'Se encontraros los siguientes errores'" :headers="['codigo','mensaje']" :fieldKeys="['codigo','message']" :ifexportar="Number(1)" :tableData="arrayProblemas" />
        </div>
    </vs-popup>
    <br><br><br><br>
</vx-card>
</template>

<script>
import ImportExcel from './importExcel.vue'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select'
import TableSelectInstitucion from '../../usuarios/GestionEstudiantes/components/TableSelectInstitucion.vue';
import gestionCodigosLista from './utils/gestionCodigosLista.vue';
import LibroRepository from '../../../repositories/LibroRepository';
import Generalmix from '../../../mixins/Generalmix';
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')
export default {
    mixins: [Generalmix],
    data() {
        return {
            usuario: [],
            codigo: {
                libro: '',
                libro_idlibro: null,
                codigo_liquidacion_libro: null,
                serie: '',
                anio: '',
                idusuario: 0,
                contrato: '',
                id_periodo: '',
                estado_liquidacion: 1,
                bc_estado: 1,
                bc_institucion: 0,
                bc_periodo: 0,
                venta_estado: 0,
                venta_lista_institucion: 0,
                contador: 1,
                estado: 0,
                verif1: '',
                verif2: '',
                verif3: '',
                verif4: '',
                verif5: '',
                codigo_union: '',
                liquidado_regalado: 0,
                codigo_proforma: '',
                proforma_empresa: 1,
                bc_fecha_ingreso: null,
                combo: '',
                codigo_combo: '',
                factura: '',
                documento_devolucion: '',
                devuelto_proforma: 0,
                quitar_de_reporte: 0,
            },
            nombreInstitucion: '',
            institucion_id: 0,
            error: false,
            statusPeriodo: 0,
            periodo_id: 0,
            //variables para la consulta
            chkIdusuario: false,
            chkContrato: false,
            chkId_periodo: false,
            chkEstado_liquidacion: false,
            chkBc_estado: false,
            chkBc_Bc_institucion: false,
            chkBc_Bc_periodo: false,
            chkBc_Venta_lista_institucion: false,
            chkBc_Venta_estado: false,
            chkBc_Verif1: false,
            chkBc_Verif2: false,
            chkBc_Verif3: false,
            chkBc_Verif4: false,
            chkBc_Verif5: false,
            chk_estado: false,
            chkBc_codigo_union: false,
            chkBc_liquidado_regalado: false,
            chkBc_codigo_proforma: false,
            chkBc_proforma_empresa: false,
            chkLibro_idlibro: false,
            chkCombo: false,
            chkCodigo_combo: false,
            chkFactura: false,
            chkDocumento_devolucion: false,
            chkDevuelto_proforma: false,
            chkQuitar_de_reporte: false,
            //fin variables para la consulta
            informacion: [],
            tmpinformacion: [],
            arregloChangeCodigos: [],
            arregloCodigosEnviar: [],
            codigosPerdidos: false,
            popupLimit: false,
            porcentaje: 0,
            tipo: '',
            //VARIABLES PARA IMPORT
            tableData: [],
            header: [],
            sheetName: '',
            errores: [],
            modalConfirm: false,
            modalErrores: false,
            //FIN VARIABLES PARA IMPORT
            observacion: '',
            arrayCombos: [],
            arrayLibrosIndividuales: [],
            withCodigoUnion: 0,
            popupMostrarErrores: false,
            arrayProblemas: [],
            arrayEmpresas: [],
        }
    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"));
    },
    mounted() {
        let me = this;
        me.getCombos();
        me.getLibrosIndividuales();
        me.getEmpresas();
    },
    components: {
        'v-select': vSelect,
        flatPickr,
        TableSelectInstitucion,
        gestionCodigosLista,
        ImportExcel,
        TableReutilizableVue,
    },

    methods: {
        getEmpresas(){
            let me = this;
            let url = this.$server_url + 'empresa2';
            this.$http.get(url).then(function (response) {
                me.arrayEmpresas = response.data;
            }).catch(function (error) {
                console.log(error);
            });
        },
        getCombos(){
          let me = this
          LibroRepository.getAllCombos()
            .then(r => {
                if (r && r.data) {
                    this.arrayCombos = r.data
                }
            })
            .catch(error => {
                console.error('Error al cargar combos:', error)
                me.$vs.notify({
                    text: 'Error al cargar los combos.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            })
        },
        getLibrosIndividuales() {
            let me = this
            me.$http.get(me.$server_url + 'Todo_Libros_Individuales_pedido_alcance_formatoprecio')
                .then(res => {
                    me.arrayLibrosIndividuales = res.data || []
                })
                .catch(error => {
                    console.error('Error al cargar libros individuales:', error)
                    me.$vs.notify({
                        text: 'Error al cargar los libros.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
        },
        onLibroIndivualSelected(codigoLiquidacion) {
            const selected = this.arrayLibrosIndividuales.find(libro => libro.codigo_liquidacion === codigoLiquidacion)
            if (selected) {
                this.codigo.libro_idlibro = selected.idLibro
                this.codigo.libro = selected.nombre
                this.codigo.serie = selected.nombre_serie || ''
                this.codigo.anio = selected.year != null ? String(selected.year) : ''
            } else {
                this.codigo.libro_idlibro = null
                this.codigo.libro = ''
                this.codigo.serie = ''
                this.codigo.anio = ''
            }
        },
        loadDataInTable({
            results,
            header,
            meta
        }) {
            this.arregloCodigosEnviar = []
            this.codigosPerdidos = false
            this.header = header
            this.tableData = results
            this.sheetName = meta.sheetName
            this.arrayProblemas = []
            this.porcentaje = 0
        },
        openConfirm(tipo) {
            let me = this
            // validar comentario y quitar trim
            me.observacion = me.observacion.trim()
            if (me.observacion === '') {
                me.$vs.notify({
                    text: 'Ingrese un comentario.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.tableData.length === 0 || !me.tableData[0] || !me.tableData[0].codigo) {
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Corrija el formato del excel y vuelva a intentar.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.chkLibro_idlibro && (!me.codigo.codigo_liquidacion_libro || me.codigo.codigo_liquidacion_libro === '' || me.codigo.codigo_liquidacion_libro === null)) {
                me.$vs.notify({
                    text: 'Debe seleccionar un libro cuando la opción está marcada.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
                // Validación para combo
            if (me.chkCombo && (!me.codigo.combo || me.codigo.combo === '' || me.codigo.combo === null || me.codigo.combo === undefined)) {
                /*me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Debe seleccionar un combo cuando la opción está marcada.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                */
            }
            me.errores = []
            $.each(me.tableData, function (key, value) {
                if (!value.codigo) {
                    me.errores.push(value)
                }
            })
            if (me.errores.length > 0) {
                me.modalErrores = true
            } else {
                me.modalConfirm = true
                me.SimplicarArray()
            }
        },
        guardarCodigo() {
            let me = this;


            let formData = new FormData();
            formData.append('comentario', me.observacion)
            formData.append('withCodigoUnion', me.withCodigoUnion)
            formData.append('data_codigos', JSON.stringify(me.arregloCodigosEnviar))
            formData.append('idusuario', me.codigo.idusuario)
            formData.append('estado', me.codigo.estado)
            formData.append('contrato', me.codigo.contrato)
            formData.append('id_periodo', me.codigo.id_periodo)
            formData.append('verif1', me.codigo.verif1 == 'null' ? '' : me.codigo.verif1)
            formData.append('verif2', me.codigo.verif2 == 'null' ? '' : me.codigo.verif2)
            formData.append('verif3', me.codigo.verif3 == 'null' ? '' : me.codigo.verif3)
            formData.append('verif4', me.codigo.verif4 == 'null' ? '' : me.codigo.verif4)
            formData.append('verif5', me.codigo.verif5 == 'null' ? '' : me.codigo.verif5)
            formData.append('estado_liquidacion', me.codigo.estado_liquidacion)
            formData.append('bc_estado', me.codigo.bc_estado)
            formData.append('bc_institucion', me.codigo.bc_institucion)
            formData.append('bc_periodo', me.codigo.bc_periodo)
            formData.append('codigo_union', (me.codigo.codigo_union == 'null' || me.codigo.codigo_union == '') ? '' : me.codigo.codigo_union)
            formData.append('liquidado_regalado', me.codigo.liquidado_regalado)
            //auditoria
            formData.append('institucion_id', me.institucion_id)
            formData.append('periodo_id', me.periodo_id)
            formData.append('user_created', me.usuario.idusuario)
            //formData.append('old_values',           JSON.stringify(me.codigosEdit))
            formData.append('venta_estado', me.codigo.venta_estado)
            formData.append('venta_lista_institucion', me.codigo.venta_lista_institucion)
            formData.append('codigo_proforma', me.codigo.codigo_proforma || '')
            formData.append('proforma_empresa', me.codigo.proforma_empresa)
            formData.append('libro_idlibro', me.codigo.libro_idlibro || '')
            formData.append('libro', me.codigo.libro || '')
            formData.append('serie', me.codigo.serie || '')
            formData.append('anio', me.codigo.anio || '')
            formData.append('combo', me.codigo.combo || '')
            formData.append('codigo_combo', me.codigo.codigo_combo || '')
            formData.append('factura', me.codigo.factura || '')
            formData.append('documento_devolucion', me.codigo.documento_devolucion || '')
            formData.append('devuelto_proforma', me.codigo.devuelto_proforma || 0)
            formData.append('quitar_de_reporte', me.codigo.quitar_de_reporte || 0)
            //parametros reset
            formData.append('chkIdusuario', me.chkIdusuario ? '1' : '0')
            formData.append('chkContrato', me.chkContrato ? '1' : '0')
            formData.append('chkId_periodo', me.chkId_periodo ? '1' : '0')
            formData.append('chkEstado_liquidacion', me.chkEstado_liquidacion ? '1' : '0')
            formData.append('chkBc_liquidado_regalado', me.chkBc_liquidado_regalado ? '1' : '0')
            formData.append('chkBc_estado', me.chkBc_estado ? '1' : '0')
            formData.append('chkBc_Bc_institucion', me.chkBc_Bc_institucion ? '1' : '0')
            formData.append('chkBc_Bc_periodo', me.chkBc_Bc_periodo ? '1' : '0')
            formData.append('chkBc_Venta_lista_institucion', me.chkBc_Venta_lista_institucion ? '1' : '0')
            formData.append('chkBc_Venta_estado', me.chkBc_Venta_estado ? '1' : '0')
            formData.append('chkBc_Verif1', me.chkBc_Verif1 ? '1' : '0')
            formData.append('chkBc_Verif2', me.chkBc_Verif2 ? '1' : '0')
            formData.append('chkBc_Verif3', me.chkBc_Verif3 ? '1' : '0')
            formData.append('chkBc_Verif4', me.chkBc_Verif4 ? '1' : '0')
            formData.append('chkBc_Verif5', me.chkBc_Verif5 ? '1' : '0')
            formData.append('chk_estado', me.chk_estado ? '1' : '0')
            formData.append('chkBc_codigo_union', me.chkBc_codigo_union ? '1' : '0')
            formData.append('chkBc_codigo_proforma', me.chkBc_codigo_proforma ? '1' : '0')
            formData.append('chkBc_proforma_empresa', me.chkBc_proforma_empresa ? '1' : '0')
            formData.append('chkLibro_idlibro', me.chkLibro_idlibro ? '1' : '0')
            formData.append('chkCombo', me.chkCombo ? '1' : '0')
            formData.append('chkCodigo_combo', me.chkCodigo_combo ? '1' : '0')
            formData.append('chkFactura', me.chkFactura ? '1' : '0')
            formData.append('chkDocumento_devolucion', me.chkDocumento_devolucion ? '1' : '0')
            formData.append('chkDevuelto_proforma', me.chkDevuelto_proforma ? '1' : '0')
            formData.append('chkQuitar_de_reporte', me.chkQuitar_de_reporte ? '1' : '0')
            //fin variables parametros
            me.$vs.loading();
            this.$http.post(this.$server_url + 'guardarCodigoParametros', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == '0') {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    me.codigosPerdidos = true
                    me.modalConfirm = false
                    me.tableData = []
                    me.porcentaje = res.data.contador
                    me.arrayProblemas = res.data.arrayProblemas || []

                    if(me.arrayProblemas.length > 0) {
                      me.popupMostrarErrores = true
                      me.$vs.notify({
                        text: "Se guardaron algunos códigos pero se encontraron errores.",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                      })
                    } else {
                       me.$vs.notify({
                          text: "Se proceso correctamente",
                          color: 'primary',
                          iconPack: 'feather',
                          icon: 'icon-alert-triangle'
                      })
                        me.popupMostrarErrores = false
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Error al procesar la solicitud. Intente nuevamente.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    console.error('Error:', error)
                })
        },
        SimplicarArray() {
            let me = this;
            me.arregloCodigosEnviar = []
            let p = new Promise(function (resolve, reject) {
                if (me.tableData.length > 0) {
                    resolve(me.tableData)
                } else {
                    reject('No hay codigos en su archivo')
                }
            });
            p.then((res) => {
                let datos = res
                datos.forEach(element => {
                    var cal = new Object();
                    cal.codigo = element.codigo
                    me.arregloCodigosEnviar.push(cal)
                });
            }).catch((e) => {
                console.log(e)
            })
        },
        limpiar() {
            let me = this
            me.codigo.idusuario = 0
            me.codigo.contrato = ''
            me.codigo.id_periodo = ''
            me.codigo.estado_liquidacion = 1
            me.codigo.bc_estado = 1
            me.codigo.bc_institucion = 0
            me.codigo.bc_periodo = 0
            me.codigo.venta_estado = 0
            me.codigo.venta_lista_institucion = 0
            me.codigo.estado = 0
            me.codigo.verif1 = ''
            me.codigo.verif2 = ''
            me.codigo.verif3 = ''
            me.codigo.verif4 = ''
            me.codigo.verif5 = ''
            me.codigo.codigo_union = ''
            me.codigo.liquidado_regalado = 0
            me.codigo.codigo_proforma = ''
            me.codigo.proforma_empresa = '1'
            me.codigo.libro = ''
            me.codigo.libro_idlibro = null
            me.codigo.codigo_liquidacion_libro = null
            me.codigo.serie = ''
            me.codigo.anio = ''
            me.codigo.combo = ''
            me.codigo.codigo_combo = ''
            me.codigo.factura = ''
            me.codigo.documento_devolucion = ''
            me.codigo.devuelto_proforma = 0
            me.codigo.quitar_de_reporte = 0
            //variables para la consulta
            me.chkIdusuario = false
            me.chkContrato = false
            me.chkId_periodo = false
            me.chkEstado_liquidacion = false
            me.chkBc_estado = false
            me.chkBc_Bc_institucion = false
            me.chkBc_Bc_periodo = false
            me.chkBc_Venta_lista_institucion = false
            me.chkBc_Venta_estado = false
            me.chkBc_Verif1 = false
            me.chkBc_Verif2 = false
            me.chkBc_Verif3 = false
            me.chkBc_Verif4 = false
            me.chkBc_Verif5 = false
            me.chk_estado = false
            me.chkBc_codigo_union = false
            me.chkBc_liquidado_regalado = false
            me.chkBc_codigo_proforma = false
            me.chkBc_proforma_empresa = false
            me.chkliquidado_regalado = false
            me.chkLibro_idlibro = false
            me.chkCombo = false
            me.chkCodigo_combo = false
            me.chkFactura = false
            me.chkDocumento_devolucion = false
            me.chkDevuelto_proforma = false
            me.chkQuitar_de_reporte = false
            me.withCodigoUnion = 0
            //fin variables para la consulta
        },
    },
}
</script>
