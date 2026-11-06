<template>
    <div>
        <div v-if="menu == 1">
            <br>
            <vs-button color="primary" type="border" @click="menu = 0;">← Regresar</vs-button>
            <DetalleContratoVue :contrato="pedido"/>
        </div>
        <div v-if="menu == 2">
            <br>
            <vs-button color="primary" class="ml-4" type="border" @click="menu = 0;">← Regresar</vs-button>
            <vs-tabs alignment="fixed">
                <vs-tab label="Verificaciones">
                    <div>
                        <historicoCodigosNuevoVue :contratoPedido="pedido.contrato_generado" :desdePedido="1" />
                    </div>
                </vs-tab>
                <vs-tab label="Trazabilidad">
                    <div>
                        <VerificacionTrazabilidadVue :contratoPedido="pedido.contrato_generado"/>
                    </div>
                </vs-tab>

            </vs-tabs>
        </div>
        <vs-table v-if="menu == 0" stripe max-items="10" search pagination :data="arregloContratos">
            <template slot="header">
                <vs-chip  color="primary">Cantidad: <b> {{ arregloContratos.length }}</b></vs-chip>
            </template>
            <template slot="thead">
                <vs-th>Contrato</vs-th>
                <vs-th>Institución</vs-th>
                <vs-th>Datos</vs-th>
                <vs-th>Verificación</vs-th>
                <vs-th >Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>
                        {{data[indextr].contrato}}<br>
                        <!--CHEQUE-->
                        <p v-if="tr.historicoEstado > 7" @click="pedido=tr;popupVerCheque = true;" class="text-success cursor-pointer"><span><i class="fa-solid fa-camera"></i><b> Cheque:</b> entregado</span></p>
                        <!--PAGARE-->
                        <p v-if="tr.historicoEstado == 9" @click="pedido=tr;popupVerPagare = true;" class="cursor-pointer mt-1"><span><i class="fa-solid fa-camera"></i><b> Pagaré:</b> subido</span></p>
                        <p v-if="tr.historicoEstado >9 " @click="pedido=tr;popupVerPagare = true;" class="text-success cursor-pointer"><span><i class="fa-solid fa-camera"></i><b>Pagaré:</b> recibido(facturador)</span></p>
                        <p v-if="tr.historicoEstado >10 " @click="pedido=tr;popupVerPagare = true;" class="text-success cursor-pointer"><span><i class="fa-solid fa-camera"></i><b>Pagaré:</b> recibido(contabilidad)</span></p>
                    </vs-td>
                    <vs-td>
                        {{data[indextr].insNombre}}<br>
                        <b>Ciudad:</b> {{data[indextr].ciuNombre}}<br>
                    </vs-td>
                    <vs-td>
                        <b>Pedido #</b> {{data[indextr].id_pedido}}<br>
                        <b>Tipo de venta:</b> <span v-if="tr.tipo_venta == 1"> Directa</span> <span v-if="tr.tipo_venta == 2"> Lista</span><br>
                        <b>Anticipo</b> {{data[indextr].anticipo_aprobado}}<br>
                        <p class="mt-1">
                            <vs-chip color="danger" v-if="tr.id_pedido == null || tr.id_pedido ==  ''">Falta crear pedido en plataforma</vs-chip>
                        </p>
                    </vs-td>
                    <vs-td>
                        <p class="mt-1 cursor-pointer" v-if="tr.verificaciones > 0" @click="pedido = tr; VerVerificaciones(tr)"><vs-chip><b>Verificaciones:  {{ tr.verificaciones }} </b></vs-chip></p><br><br>
                        <div v-if="tr.estado_verificacion > 0">
                            <vs-chip color="warning">Verificación pendiente</vs-chip>
                        </div>
                    </vs-td>
                    <vs-td align="center">
                        <vs-dropdown vs-custom-content vs-trigger-click>
                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                            <vs-dropdown-menu style="width: 300px;" class="cursor">
                                <vs-dropdown-item>
                                    <!--DETALLES-->
                                    <vs-button class="w-full" color="primary" @click="pedido = tr; menu = 1;" type="line" ><ion-icon name="cellular-outline"></ion-icon> Ver detalles </vs-button>
                                </vs-dropdown-item>
                                <div v-if="desdeAdmin == 0">
                                    <vs-dropdown-item>
                                        <!--VER PEDIDO-->
                                        <vs-button color="success" type="line" class="w-full" @click="ver_pedido(tr)">&nbsp;&nbsp;&nbsp;Ver pedido&nbsp;&nbsp;&nbsp;</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item>
                                        <!--ALCANCE-->
                                        <vs-button icon-pack="feather" class="w-full" v-if="tr.contrato_generado !=null && tr.estado == 1 && (tr.tipo_venta == '1' || tr.tipo_venta == '2')"  icon="icon-file" @click="pedido = tr;verAlcance(tr);" color="warning" type="line">Alcance</vs-button>
                                    </vs-dropdown-item>
                                    <!--SOLICITAR VERIFICACION-->
                                    <vs-dropdown-item>
                                        <vs-button icon-pack="feather" class="w-full" v-if="tr.estado == 1 " icon="icon-users" @click="pedido = tr;SolicitarVerificacion(tr);" color="dark" type="line">Solicitar Verificación</vs-button>
                                    </vs-dropdown-item>
                                    <!--VER INFORMACION VERIFICACIONES-->
                                    <vs-dropdown-item>
                                        <vs-button icon-pack="feather" class="w-full" v-if="tr.estado == 1 && tr.verificaciones > 0" icon="icon-activity" @click="pedido = tr; VerVerificaciones(tr)" color="#7AD40E" type="line">Ver Verificación</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item>
                                    <!--IMPRIMIR PAGARE-->
                                        <vs-button v-if="tr.anticipo_aprobado > 0" class="w-full" @click="chooseBeneficiarioPedido(tr)" color="primary" type="line">Imprimir Pagaré</vs-button>
                                    </vs-dropdown-item>
                                    <vs-dropdown-item>
                                        <!----SUBIR PAGARE-->
                                        <vs-button v-if="tr.historicoEstado == 8 || tr.historicoEstado == 9" class="w-full" icon="picture_as_pdf" @click="pedido = tr;popupUpload = true" color="#6A33D2" type="line">Subir Pagaré</vs-button>
                                    </vs-dropdown-item>
                                </div>
                            </vs-dropdown-menu>
                        </vs-dropdown>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
        <!--DESCARGAR FORMATO PAGARE-->
        <div v-if="mostrarReporte">
        <exportPagareVue style="display: none;" v-if="mostrarReporte" :id_beneficiario_pedido="id_beneficiario_pedido" :contrato="contrato" :id_pedido="pedidoEnviar" :id_periodo="periodoEnviar" @change="changeHandle" />
        </div>
        <!--MODAL PARA SELECCIONAR UN BENEFICIARIO-->
        <vs-prompt
        title="Seleccione un beneficiario para poder generar el reporte"
        @cancel="close"
        cancelText="Cancelar"
        acceptText="Generar"
        @accept="acceptAlert"
        @close="close"
        :active.sync="activePrompt">
            <div class="con-exemple-prompt">
            <v-select :options="arregloBeneficiarios" :reduce="arregloBeneficiarios => arregloBeneficiarios" label="nombres_beneficiario" class="w-full" v-model="beneficiario" />
            </div>
        </vs-prompt>
        <!--MODAL PARA LA CARGA DEL ARCHIVO-->
        <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
        <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
        <img  class="mt-2"  style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png"/>
        </vs-popup>
        <!--MODAL PARA SUBIR EL PAGARE-->
        <div class="demo-alignment">
        <vs-popup classContent="popup-example" title="Subir evidencia del pagaré" :active.sync="popupUpload" @close="changeValor()">
            <uploadFileVue v-if="popupUpload" :id_pedido = "pedido.id_pedido" tipoDocumento="pagare" campo_fecha="fecha_orden_firmada" :imgOld="pedido.evidencia_pagare" campo_file="evidencia_pagare" estadoHistorico="9"/>
        </vs-popup>
        </div>
        <!--MODAL PARA ENVIAR CHEQUE ASESOR-->
        <vs-popup class="holamundo" fullscreen title="Cheque para el asesor" :active.sync="popupVerCheque">
            <image-zoom
            :regular="$data_url+'archivos/pedidos/cheque/'+pedido.evidencia_cheque"
            :zoom-amount="3"
            :click-zoom="true"
            click-message="De click para aumentar"
            img-class="img-fluid"
            >
            </image-zoom>
        </vs-popup>
        <!--FIN MODAL PARA ENVIAR CHEQUE ASESOR-->
        <!--MODAL PARA MARCAR COMO RECIBIDO PAGARE-->
        <vs-popup class="holamundo" title="Pagaré subido por el asesor" :active.sync="popupVerPagare">
            <image-zoom
              :regular="$data_url+'archivos/pedidos/pagare/'+pedido.evidencia_pagar"
              :zoom-amount="3"
              :click-zoom="true"
              click-message="De click para aumentar"
              img-class="img-fluid"
              >
            </image-zoom>
        </vs-popup>
        <!--MODAL PARA VER LA LIQUIDACION-->
        <vs-popup class="holamundo" fullscreen title="Códigos a liquidar" :active.sync="popupVerLiquidacion">
            <div v-if="popupVerLiquidacion">
                <!--VENTA DIRECTA-->
                <div v-if="pedido.tipo_venta == 1">
                    <p>Verificación venta directa</p>
                    <LiquidacionVentaDirectaVue :pedido="pedido" @ChangeRecarge="getValores"/>
                </div>
                <!--VENTAS LISTA-->
                <div v-if="pedido.tipo_venta == 2">
                    <p>Verificación venta lista</p>
                    <LiquidacionCodigosVue
                        :contratoLiquidacion="pedido.contrato_generado"
                        :estado_verificacion="pedido.estado_verificacion"
                        :insNombre="pedido.insNombre"
                        :ciuNombre="pedido.ciuNombre"
                        @ChangeRegresar="regresar"
                    />
                </div>
            </div>
        </vs-popup>
    </div>
</template>
<script>
import vSelect from 'vue-select';
import exportPagareVue from '../../../temporadas/components/exportPagare.vue';
import uploadFileVue from '../../contabilidad/uploadFile.vue';
import DetalleContratoVue from './DetalleContrato.vue';
import LiquidacionCodigosVue from './LiquidacionCodigos.vue'
import historicoCodigosNuevoVue from '../../../temporadas/historicoCodigosNuevo.vue';
import VerificacionTrazabilidadVue from '../../../temporadas/VerificacionTrazabilidad.vue';
import Vue from 'vue';
import imageZoom from 'vue-image-zoomer';
import LiquidacionVentaDirectaVue from './LiquidacionVentaDirecta.vue';
export default{
    data(){
        return{
            usuario:[],
            arregloVenta:[],
            arregloContratos:[],
            pedido:{},
            contrato:'',
            menu:0,
            //variables export
            mostrarReporte:false,
            popupCarga:false,
            activePrompt:false,
            id_beneficiario_pedido:0,
            beneficiario:'',
            pedidoEnviar:0,
            periodoEnviar:0,
            arregloBeneficiarios:[],
            //fin variables export
            //variables para historico
            popupUpload:false,
            popupVerCheque:false,
            popupVerPagare:false,
            //fin variables para historico
            //variables para liquidacion
            popupVerLiquidacion:false,
            //fin variables para liquidacion
        }
    },
    components:{
        vSelect,
        DetalleContratoVue,
        exportPagareVue,
        uploadFileVue,
        imageZoom,
        LiquidacionCodigosVue,
        historicoCodigosNuevoVue,
        VerificacionTrazabilidadVue,
        LiquidacionVentaDirectaVue,
    },
    props:{
        id_periodo:{
            type:Number,
            default:0,
        },
        asesorSelect:{
            type:Number,
            default:0,
        },
        desdeAdmin:{
            type:Number,
            default:0,
        },
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.userAsesor = 0
        if(me.desdeAdmin == 1){
            me.userAsesor = me.asesorSelect
        }else{
            me.userAsesor = me.usuario.idusuario
        }
    },
    watch:{
        asesorSelect(results){
            let me = this;
            me.userAsesor = results
            console.log("test",results)
            me.getValores()
        },
    },
    mounted(){
        let me = this;
        me.getValores()
    },
    methods:{
        getValores(){
            let me = this;
            me.arregloContratos = []
            me.$vs.loading()
            var sendUsuario = ""
            if(me.userAsesor == 68750){
                sendUsuario = "26087"
            }else{
                sendUsuario = me.userAsesor
            }
            this.$http.get(this.$server_url+'reporteVentaIndividual?periodo_id='+me.id_periodo+'&idusuario='+sendUsuario)
                .then(function (res) {
                    me.$vs.loading.close()
                    let datos = res.data.contratos
                    if(datos.length > 0){
                        me.arregloContratos  = datos.sort((a, b) => {
                        if (a.contrato < b.contrato) {
                            return 1;
                        }
                        if (a.contrato > b.contrato) {
                            return -1;
                        }
                        return 0;
                        });
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' error');
                })
        },
        ver_pedido(item){
            let me = this;
            if(item.id_pedido == null){
                me.$vs.notify({
                text:'Su contrato no tiene pedido en el sistema de prolipa',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            localStorage.setItem("id_periodo_selected", this.id_periodo)
           // localStorage.setItem("nombre_periodo_selected", this.nombre_periodo)
            localStorage.setItem("contrato_generado", item.contrato_generado)
            localStorage.setItem("pedido_desde_admin", 'activo')
            this.$router.push('/pedidos/'+item.id_pedido)
        },
        //metodos para alcance
        verAlcance(tr){
            let me = this;
            if(tr.id_pedido == null){
                me.$vs.notify({
                text:'Su contrato no tiene pedido en el sistema de prolipa',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            localStorage.setItem('alcance_periodo',     me.pedido.id_periodo)
            localStorage.setItem('alcance_id_pedido',   me.pedido.id_pedido)
            setTimeout(function(){ return me.$router.push('/alcance') }, 1000);
        },
        //METODOS EXPORTAR
        changeHandle(e){
            let me = this;
            me.mostrarReporte  = false
            me.popupCarga      = false
        },
        getBeneficiarios(pedido){
            let me = this
            me.arregloBeneficiarios = []
            me.beneficiario         = ''
            this.$http.get(this.$server_url+'get_beneficiarios_pedidos/'+pedido)
            .then(res => {
                me.arregloBeneficiarios = res.data
            })
        },
        chooseBeneficiarioPedido(tr){
            let me = this;
            me.contrato = ""
            if(tr.id_pedido == null){
                me.$vs.notify({
                text:'Su contrato no tiene pedido en el sistema de prolipa',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.getBeneficiarios(tr.id_pedido)
            me.activePrompt = true
            me.pedidoEnviar   = tr.id_pedido
            me.periodoEnviar  = tr.id_periodo
            me.contrato       = tr.contrato
        },
        acceptAlert(){
        let me = this
        if(me.beneficiario == "" || me.beneficiario == null || me.beneficiario == undefined){
          me.$vs.notify({
          text:'Seleccione un beneficiario por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        me.id_beneficiario_pedido = me.beneficiario.id_beneficiario_pedido
        me.popupCarga        = true
        me.mostrarReporte    = true
      },
      SolicitarVerificacion(tr){
        let me = this;
        // if(tr.tipo_venta == 1){
        //   if(tr.periodo == 'Sierra 2023'){
        //     me.$vs.notify({
        //     text:'El modulo para verificaciones de sierra no esta disponible',
        //     color:'warning',
        //     iconPack: 'feather',
        //     icon:'icon-check',
        //     time:5000,
        //     })
        //     return
        //   }
        // }
        if(tr.id_pedido == null || tr.id_pedido == ""){
            me.$vs.notify({
            text:'Su contrato no tiene pedido en plataforma',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return
        }
        me.popupVerLiquidacion = true;
      },
        VerVerificaciones(tr){
            let me = this
            if(tr.id_pedido == null || tr.id_pedido == ""){
                me.$vs.notify({
                text:'Su contrato no tiene pedido en plataforma',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            me.menu = 2
        },
        regresar(){
            let me = this;
            me.popupVerLiquidacion = false;
            me.getValores()
        },
        close(){
            this.$vs.notify({
            color:'danger',
            title:'Mensaje',
            text:'Has cancelado la generación del reporte!'
            })
        },
    },
}
</script>
