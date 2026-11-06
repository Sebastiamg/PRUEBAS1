<template>
    <vx-card
    title = "Cambiar valores por parámetros de los códigos"
    title-color ="primary"
    subtitle = "Seleccione una institución y realize el cambios de los códigos (Máximo 2000)"
    >
    <vs-alert color="warning" style="height: 80px;">
        <p class="font-bold">*Seleccione una institución y seleccione un radio button</p>
        <p class="font-bold">*Los checkbox que han sido seleccionados modificarán a todos los codigos seleccionados del radio button escogido</p>
    </vs-alert>
    <!-- <pre>{{ arregloChangeCodigos }}</pre> -->
        <vs-divider color="primary">Institucion seleccionada: {{ nombreInstitucion }}</vs-divider>
        <vs-row v-if="codigosPerdidos == true">
          <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <vs-alert active="true">
                Se realizo el cambio de  {{ porcentaje }} códigos
            </vs-alert>
          </vs-col>
        </vs-row>
        <div>
            <TableSelectInstitucion @change="changeHandle"/>
        </div>
        <div v-if="nombreInstitucion.length > 1">
            <vs-collapse style="margin-left: -20px;margin-top: -60px;">
                <vs-collapse-item>
                    <div slot="header">
                        <vs-list-header icon="supervisor_account" :title="'Resultado '+ tmpinformacion.length+' códigos'"></vs-list-header>
                    </div>
                    <div class="mt-5">
                        <ul style="display:flex;flex-wrap: wrap;">
                            <li>
                                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="0"><span class="font-bold">{{sumaTotal}}</span> Todos</vs-radio>
                            </li>
                            <li class="ml-2">
                                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="4"><span style="font-weight:bold;">{{sumaCodigosRegalados}}</span> Códigos Regalados </vs-radio>
                            </li>
                            <li class="ml-2">
                                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="5"><span style="font-weight:bold;">{{sumarCodigosLiquidados}}</span> Códigos Liquidados </vs-radio>
                            </li>
                            <li class="ml-2">
                                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo"  @input="filtroTipo();" vs-value="7"><span style="font-weight:bold;">{{SumaCodigosDevolucion}}</span> Códigos devueltos</vs-radio>
                            </li>
                            <li class="ml-2">
                                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="8"><span style="font-weight:bold;">{{sumarCodigosLeidos}}</span> Códigos leidos (No liquidados) </vs-radio>
                            </li>
                            <li class="ml-2">
                                <vs-radio v-model="codigoTipo" vs-name="radios1codigoTipo" @input="filtroTipo();" vs-value="9"><span style="font-weight:bold;">{{sumarCodigosNoleidos}}</span> Códigos sin leer </vs-radio>
                            </li>
                        </ul>
                    </div>
                    <gestionCodigosLista :arregloCodigos="tmpinformacion" style="width: 100%!important;"/>
                </vs-collapse-item>
            </vs-collapse>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2 flex">
                <vs-input class="w-full" icon="person" label="Id usuario" v-model="codigo.idusuario" />
                <vs-checkbox style="margin-top: 25px;" v-model="chkIdusuario"></vs-checkbox>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-2 flex">
                <vs-input class="w-full" icon="bookmark" label="Contrato" v-model="codigo.contrato" />
                <vs-checkbox style="margin-top: 25px;" v-model="chkContrato"></vs-checkbox>
            </div>
        </div>
        <div class="vx-row mt-4">
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
                <vs-checkbox style="margin-top: 20px;"  v-model="chkEstado_liquidacion"></vs-checkbox>
            </div>
        </div>
        <div class="vx-row mt-5">
            <div class="vx-col sm:w-1/2 w-full mb-2 flex" style="justify-content: space-between;">
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
                <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_estado"></vs-checkbox>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2 flex">
                <vs-input class="w-full" icon="swap_vert" label="Bc_Institucion" v-model="codigo.bc_institucion" />
                <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_Bc_institucion"></vs-checkbox>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-6 flex">
                <vs-input class="w-full" icon="swap_vert" label="Bc_periodo" v-model="codigo.bc_periodo" />
                <vs-checkbox style="margin-top: 15px;"  v-model="chkBc_Bc_periodo"></vs-checkbox>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2 flex">
                <vs-input class="w-full" icon="swap_vert" label="venta_lista_institucion" v-model="codigo.venta_lista_institucion" />
                <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_Venta_lista_institucion"></vs-checkbox>
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
                <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_Venta_estado"></vs-checkbox>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2 flex">
                <vs-input class="w-full" icon="filter" label="verif1" v-model="codigo.verif1" />
                <vs-checkbox style="margin-top: 5px;"  v-model="chkBc_Verif1"></vs-checkbox>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-6 flex">
                <vs-input type="number" class="w-full" icon="filter" label="verif2" v-model="codigo.verif2" />
                <vs-checkbox style="margin-top: 20px;"  v-model="chkBc_Verif2"></vs-checkbox>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-2 flex">
                <vs-input class="w-full" icon="filter" label="verif3" v-model="codigo.verif3" />
                <vs-checkbox style="margin-top: 15px;"  v-model="chkBc_Verif3"></vs-checkbox>
            </div>
            <div class="vx-col sm:w-1/2 w-full mb-0 flex">
                <vs-input type="number" class="w-full" icon="filter" label="verif4" v-model="codigo.verif4" />
                <vs-checkbox style="margin-top: 15px;"  v-model="chkBc_Verif4"></vs-checkbox>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-1/2 w-full mb-0 flex">
                <vs-input class="w-full" icon="filter" label="verif5" v-model="codigo.verif5" />
                <vs-checkbox style="margin-top: 15px;"  v-model="chkBc_Verif5"></vs-checkbox>
            </div>
        </div>
        <div class="vx-row mt-5">
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
                <vs-checkbox class="ml-5" v-model="chkBc_Estado"></vs-checkbox>
            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col w-full flex">
                <vs-button class="mr-3 mb-2" icon="save" @click="openConfirmar()">Realizar cambios</vs-button>
                <vs-button color="danger" class="mb-2" @click="limpiar()" type="border">Resetear</vs-button>
            </div>
        </div>
        <!--MODAL PARA CONFIRMAR-->
        <vs-popup class="holamundo"  title="Confirmar" :active.sync="popupConfirmar">
        <p class="text-center">
            Estas seguro de querer cambiar <b>{{ arregloChangeCodigos.length }}</b> códigos?
        </p>
        <div class="flex mt-5 justify-center">
            <vs-button type="gradient" @click="popupConfirmar = false;guardarCodigo();">Si, deseo cambiar</vs-button>
            <vs-button color="danger"  @click="popupConfirmar = false;" class="ml-2" type="border">Cancelar</vs-button>
        </div>
        </vs-popup>
        <vs-popup fullscreen title="Estos 2000 códigos se van a cambiar" :active.sync="popupLimit">
            <gestionCodigosLista :arregloCodigos="arregloChangeCodigos" style="width: 100%!important;"/>
        </vs-popup>
    </vx-card>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import vSelect from 'vue-select'
import TableSelectInstitucion from '../../usuarios/GestionEstudiantes/components/TableSelectInstitucion.vue';
import gestionCodigosLista from './utils/gestionCodigosLista.vue';
export default {
    data() {
       return{
            usuario:[],
            codigo:{
                libro:'',
                idusuario:0,
                contrato:'',
                id_periodo:'',
                estado_liquidacion:1,
                bc_estado:1,
                bc_institucion:0,
                bc_periodo:0,
                venta_estado:0,
                venta_lista_institucion:0,
                contador:1,
                estado:0,
                verif1:'',
                verif2:'',
                verif3:'',
                verif4:'',
                verif5:'',
                bc_fecha_ingreso: null,
            },
            nombreInstitucion:'',
            institucion_id:0,
            error:false,
            statusPeriodo:0,
            periodo_id:0,
            //variables para la consulta
            chkIdusuario:false,
            chkContrato:false,
            chkId_periodo:false,
            chkEstado_liquidacion:false,
            chkBc_estado:false,
            chkBc_Bc_institucion:false,
            chkBc_Bc_periodo:false,
            chkBc_Venta_lista_institucion:false,
            chkBc_Venta_estado:false,
            chkBc_Verif1:false,
            chkBc_Verif2:false,
            chkBc_Verif3:false,
            chkBc_Verif4:false,
            chkBc_Verif5:false,
            chkBc_Estado:false,
            //fin variables para la consulta
            informacion:[],
            tmpinformacion:[],
            arregloChangeCodigos:[],
            arregloCodigosEnviar:[],
            codigosPerdidos:false,
            popupConfirmar:false,
            popupLimit:false,
            porcentaje:0,
            codigoTipo:100,
            tipo:'',
       }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"));
    },
    mounted(){
        let me = this;
    },
    components: {
        'v-select': vSelect,
        flatPickr,
        TableSelectInstitucion,
        gestionCodigosLista
    },
    computed:{
        sumaTotal(){
            let me = this;
            let total = me.informacion.length
            return total
        },
        sumaCodigosRegalados(){
            let me = this;
            let primerFiltro = me.informacion.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
            let datos        = primerFiltro.filter(p => p.estado_liquidacion =='2')
            let resultado    = datos.length
            return resultado
        },
        sumarCodigosLiquidados(){
            let me = this;
            let primerFiltro = me.informacion.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
            let datos        = primerFiltro.filter(p => p.estado_liquidacion =='0')
            let resultado    = datos.length
            return resultado
        },
        SumaCodigosDevolucion(){
            let me = this;
            let datos       = me.informacion.filter(p => p.estado_liquidacion == '3');
            let resultado   = datos.length
            return resultado
        },
        sumarCodigosLeidos(){
            let me = this;
            let primerFiltro = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
            let datos        = primerFiltro.filter(p => p.bc_estado =='2')
            let resultado    = datos.length
            return resultado
        },
        sumarCodigosNoleidos(){
            let me = this;
            let primerFiltro = me.informacion.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
            let datos        = primerFiltro.filter(p => p.bc_estado =='1')
            let resultado    = datos.length
            return resultado
        }
    },
    watch:{
        institucion_id(results){
            let me = this
            if(results > 0){
                me.informacion = []
                me.tmpinformacion = []
                me.arregloChangeCodigos = []
                me.getTipoVenta()
            }else{
                me.informacion = []
                me.tmpinformacion = []
                me.arregloChangeCodigos = []
            }
        }
    },
    methods:{
        changeHandle(e){
            let me = this
            let valor = e.change
            if(valor == 'institucion')       me.institucion_id   = e.value
            if(valor == 'noPeriodo')         me.error            = e.value
            if(valor == 'periodo')           me.statusPeriodo    = e.value
            if(valor == 'periodo_id')        me.periodo_id           = e.value
            if(valor == 'nombreInstitucion') me.nombreInstitucion = e.value
            me.codigosPerdidos = false
            me.porcentaje      = 0
        },
        openConfirmar(){
            let me = this;
              //VALIDACION
            if(me.arregloChangeCodigos.length == 0){
                me.$vs.notify({
                text:'No hay códigos para cambiar',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            if(me.codigoTipo == 100){
                me.$vs.notify({
                text:'Seleccione la cantidad de códigos que se va cambiar',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            if(me.error){
                me.$vs.notify({
                text:'La institución no tiene período',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false;
            }
            if(me.institucion_id <= 0){
                me.$vs.notify({
                text:'Seleccione una institución por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false
            }
            if(me.statusPeriodo == 0){
                me.$vs.notify({
                text:'La institución tiene período inactivo, consulte con el administrador por favor',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return false
            }
            //FIN VALIDACION
            me.popupConfirmar = true
        },
        guardarCodigo(){
            let me = this;
            let formData = new FormData();
            me.$vs.loading();
            formData.append('data_codigos',           JSON.stringify(me.arregloCodigosEnviar))
            formData.append('idusuario',              me.codigo.idusuario)
            formData.append('estado',                 me.codigo.estado)
            formData.append('contrato',               me.codigo.contrato)
            formData.append('id_periodo',             me.codigo.id_periodo)
            formData.append('verif1',                 me.codigo.verif1 == 'null' ? '': me.codigo.verif1 )
            formData.append('verif2',                 me.codigo.verif2 == 'null' ? '': me.codigo.verif2 )
            formData.append('verif3',                 me.codigo.verif3 == 'null' ? '': me.codigo.verif3 )
            formData.append('verif4',                 me.codigo.verif4 == 'null' ? '': me.codigo.verif4 )
            formData.append('verif5',                 me.codigo.verif5 == 'null' ? '': me.codigo.verif5 )
            formData.append('estado_liquidacion',     me.codigo.estado_liquidacion)
            formData.append('bc_estado',              me.codigo.bc_estado)
            formData.append('bc_institucion',         me.codigo.bc_institucion)
            formData.append('bc_periodo',             me.codigo.bc_periodo)
            //auditoria
            formData.append('institucion_id',         me.institucion_id)
            formData.append('periodo_id',             me.periodo_id)
            formData.append('user_created',           me.usuario.idusuario)
            //formData.append('old_values',           JSON.stringify(me.codigosEdit))
            formData.append('venta_estado',           me.codigo.venta_estado)
            formData.append('venta_estado',           me.codigo.venta_estado)
            formData.append('venta_lista_institucion',me.codigo.venta_lista_institucion)
            //parametros reset
            formData.append('chkIdusuario',                 me.chkIdusuario                     ? '1' : '0')
            formData.append('chkContrato',                  me.chkContrato                      ? '1' : '0')
            formData.append('chkId_periodo',                me.chkId_periodo                    ? '1' : '0')
            formData.append('chkEstado_liquidacion',        me.chkEstado_liquidacion            ? '1' : '0')
            formData.append('chkBc_estado',                 me.chkBc_estado                     ? '1' : '0')
            formData.append('chkBc_Bc_institucion',         me.chkBc_Bc_institucion             ? '1' : '0')
            formData.append('chkBc_Bc_periodo',             me.chkBc_Bc_periodo                 ? '1' : '0')
            formData.append('chkBc_Venta_lista_institucion',me.chkBc_Venta_lista_institucion    ? '1' : '0')
            formData.append('chkBc_Venta_estado',           me.chkBc_Venta_estado               ? '1' : '0')
            formData.append('chkBc_Verif1',                 me.chkBc_Verif1                     ? '1' : '0')
            formData.append('chkBc_Verif2',                 me.chkBc_Verif2                     ? '1' : '0')
            formData.append('chkBc_Verif3',                 me.chkBc_Verif3                     ? '1' : '0')
            formData.append('chkBc_Verif4',                 me.chkBc_Verif4                     ? '1' : '0')
            formData.append('chkBc_Verif5',                 me.chkBc_Verif5                     ? '1' : '0')
            //fin variables parametros
            this.$http.post(this.$server_url+'guardarCodigoParametros', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if(res.data.status == '3'){
                        me.$vs.notify({
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                        })
                        return
                    }
                    me.codigosPerdidos    = true
                    me.porcentaje         = res.data.contador
                    me.$vs.notify({
                        text: "Se proceso correctamente",
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.codigoTipo = 100
                    me.getTipoVenta()
              })
              .catch(function (error) {me.$vs.loading.close()})
        },
        filtroTipo(){
            let me = this;
            let datos = me.informacion
            me.arregloChangeCodigos = []
            //para ver los codigos regalados
            if(me.codigoTipo == 4){
                me.tipo = 'regalado';
                let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
                me.tmpinformacion = primerFiltro.filter(p => p.estado_liquidacion =='2')
                me.setArray()
                return
            }
            //para ver los codigos liquidados
            if(me.codigoTipo == 5){
                me.tipo = 'liquidados';
                let primerFiltro = datos.filter(p => p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null);
                me.tmpinformacion = primerFiltro.filter(p => p.estado_liquidacion =='0')
                me.setArray()
                return
            }
            //para ver los codigos devueltos
            if(me.codigoTipo == 7){
                me.tipo = 'devueltos';
                let primerFiltro = datos.filter(p => p.estado_liquidacion == '3');
                me.tmpinformacion = primerFiltro
                me.setArray()
                return
            }
            //para ver los codigos leidos
            if(me.codigoTipo == 8){
                me.tipo = 'leidos';
                let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
                me.tmpinformacion = primerFiltro.filter(p => p.bc_estado =='2')
                me.setArray()
                return
            }
             //para ver los codigos no leidos
            if(me.codigoTipo == 9){
                me.tipo = 'no_leidos';
                let primerFiltro = datos.filter(p => (p.estado == '1' ||  p.estado == '0' ||  p.estado == '' || p.estado == null) && (p.estado_liquidacion == 1));
                me.tmpinformacion = primerFiltro.filter(p => p.bc_estado =='1')
                me.setArray()
                return
            }
            //para ver todos los codigos
            else{
                me.tipo = 'todos';
                me.tmpinformacion = datos
                me.setArray()
            }
        },
        getTipoVenta(tr) {
        let me = this;
        me.informacion = []
        me.tmpinformacion = []
        me.arregloChangeCodigos = []
        me.$vs.loading();
        this.$http.get(this.$server_url+'getTipoVenta?institucion_id='+me.institucion_id+'&periodo_id='+me.periodo_id)
            .then(function (res) {
            me.$vs.loading.close()
            me.informacion = res.data.tipoVenta
            me.tmpinformacion = res.data.tipoVenta
            })
            .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
            })
        },
        setArray(){
            let me = this
            me.arregloChangeCodigos = []
            me.$vs.loading();
            this.$http.get(this.$server_url+'traerCodigosParametros?institucion_id='+me.institucion_id+'&periodo_id='+me.periodo_id+'&tipo='+me.tipo)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arregloChangeCodigos = res.data
                    if(me.tmpinformacion.length > 1999){
                        me.popupLimit = true
                        me.$vs.notify({
                        text:'Va a cambiar '+me.tmpinformacion.length+' códigos '+'Se procedera a cambiar '+me.arregloChangeCodigos.length+' códigos primeramente',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check',
                        time:8000
                        })
                    }else{
                        me.$vs.notify({
                        text:'Va a cambiar '+me.arregloChangeCodigos.length+' códigos ',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check',
                        time:8000
                        })
                    }
                    me.SimplicarArray()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        SimplicarArray(){
            let me = this;
            me.arregloCodigosEnviar = []
            let p = new Promise(function(resolve,reject){
                if(me.arregloChangeCodigos.length){
                    resolve(me.arregloChangeCodigos)
                }else{
                    reject('No hay codigos en esa institucion')
                }
            });
            p.then((res) => {
                let datos = res
                datos.forEach(element => {
                    var cal = new Object();
                    cal.codigo = element.codigo
                    me.arregloCodigosEnviar.push(cal)
                    console.log("cantidad",me.arregloCodigosEnviar.length)
                });
            }).catch((e) => {
                console.log(e)
            })
        },
        limpiar(){
            let me = this
            me.codigo.idusuario=0
            me.codigo.contrato=''
            me.codigo.id_periodo=''
            me.codigo.estado_liquidacion=1
            me.codigo.bc_estado=1
            me.codigo.bc_institucion=0
            me.codigo.bc_periodo=0
            me.codigo.venta_estado=0
            me.codigo.venta_lista_institucion=0
            me.codigo.estado=0
            me.codigo.verif1=''
            me.codigo.verif2=''
            me.codigo.verif3=''
            me.codigo.verif4=''
            me.codigo.verif5=''
            //variables para la consulta
            me.chkIdusuario                  = false
            me.chkContrato                   = false
            me.chkId_periodo                 = false
            me.chkEstado_liquidacion         = false
            me.chkBc_estado                  = false
            me.chkBc_Bc_institucion          = false
            me.chkBc_Bc_periodo              = false
            me.chkBc_Venta_lista_institucion = false
            me.chkBc_Venta_estado            = false
            me.chkBc_Verif1                  = false
            me.chkBc_Verif2                  = false
            me.chkBc_Verif3                  = false
            me.chkBc_Verif4                  = false
            me.chkBc_Verif5                  = false
            me.chkBc_Estado                  = false
            me.codigoTipo                    = 100
            //fin variables para la consulta
        },
    },
}
</script>
