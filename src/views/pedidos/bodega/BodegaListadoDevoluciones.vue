<template>
    <div>
        <div>
            <vs-radio class="m-3" v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="0"><b>{{ sumaPendientes  }}</b> Pendientes</vs-radio>
            <vs-radio class="m-3" v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="1"><b>{{ SumaEntregados }}</b> Entregados</vs-radio>
            <vs-radio class="m-3" v-model="filtro" @input="filtroTipo();" vs-name="radios1tipo" vs-value="2"><b>{{ SumaRechazados }}</b> Rechazados</vs-radio>
        </div>
        <div class="m-2 mb-4">
            <vs-table search :data="listaContratos">
                <template slot="header">
                    <vs-chip color="primary" class="ml-1">Cantidad: {{listaContratos.length}}</vs-chip>
                </template>
                <template slot="thead">
                    <vs-th width="25%" sort-key="apellidos">Asesor / Responsable</vs-th>
                    <vs-th width="30%" sort-key="total_venta">detalles</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            <small>id: </small> {{tr.id}} <br />
                            <small><b>Acta:</b></small> {{ tr.ven_codigo }}<br />
                            <small><b>Asesor:</b></small> {{tr.asesor }}<br />
                            <vs-chip color="primary">{{ tr.periodo }}</vs-chip>
                        </vs-td>
                        <vs-td >
                            <small v-if="tr.estado == 1"><b>Fecha bodega recibe: </b></small> <span> {{tr.fecha_aprobacion != null ?  tr.fecha_aprobacion: ''}}</span><br />
                        </vs-td>
                        <vs-td>
                            <div class="flex">
                                <vs-button class="m-1" icon="visibility" type="border" @click="getDetalles(tr)">ver guias</vs-button>
                                <vs-button class="m-1" icon-pack="feather" icon="icon-printer" type="border" color="dark" @click="pedido = tr;ImprimirActa(tr)">Imprimir acta</vs-button>
                                <vx-tooltip style="display: inline-block;" text="Marcar como guias recibidas por el asesor" position="top" color="dark">
                                    <vs-button v-if="tr.estado == 0" class="m-1" icon="check" type="border" color="warning" @click="pedido = tr;openConfirmEmpresa(tr)">Recibir guias</vs-button>
                                </vx-tooltip>
                            </div>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <!--MODAL CARGAR-->
        <vs-popup class="holamundo" title="Cargando" :active.sync="popupCarga">
            <p class="text-warning text-3xl bg-dark"><i class="fa-solid fa-cloud"></i> <b class="ml-2">Espere mientras se descarga el archivo</b></p>
            <img class="mt-2" style="margin-left: 35px;" src="https://cdn-icons-png.flaticon.com/512/4578/4578845.png" />
        </vs-popup>
        <!--DETALLES-->
        <vs-popup class="holamundo" fullscreen :title="'Detalles de la Devolución'" :active.sync="popupDetalles">
            <DetalleDevolucionVue v-if="popupDetalles" :arregloDetalle="arregloDetalle"/>
        </vs-popup>
        <!--EXPORTAR ACTA BODEGA - ASESOR-->
        <div v-if="mostrarImprimirActa">
            <exportActaGuiasBodegaDevolucionVue style="display: none;" :pedido = "pedido" @change="changeHandle"/>
        </div>
        <!--MODADL PARA MOSTRAR LA EMPRESA -->
        <vs-popup classContent="popup-example" title="Empresa" :active.sync="popupMostrarEmpresa" @close="popupMostrarEmpresa = false;empresa=null;">
          <div class="mb-4 p-4 bg-blue-100 border border-blue-400 rounded">
            <p class="text-blue-800 font-semibold">
              <i class="feather icon-info mr-2"></i>
              <strong>Importante:</strong> Al recibir las guías se aumentará el stock.
            </p>
          </div>
          <p class="font-bold text-warning text-2xl">Seleccione la Empresa a devolver las guias:</p>
          <v-select :options="arrayEmpresas" :reduce="arrayEmpresas => arrayEmpresas" label="nombre" class="w-full" v-model="empresa" />
          <br>
          <div class="flex justify-center mt-5">
            <!--seleccionar-->
            <vs-button icon="save" v-if="empresa" class="mr-3" @click="enviarGuiasBDMilton">Si, deseo devolver</vs-button>
            <!--cancelar-->
            <vs-button color="warning" class="ml-2" @click="popupMostrarEmpresa = false;empresa=null;" icon-pack="feather" type="filled" icon="icon-x-circle">Cancelar</vs-button>
          </div>
          <br><br><br>
        </vs-popup>
    </div>
    </template>
    <script>
    import DetalleDevolucionVue from '../components/Guias/devolucionGuias/components/DetalleDevolucion.vue'
    import exportActaGuiasBodegaDevolucionVue from '../../temporadas/components/exportActaGuiasBodegaDevolucion.vue';
    import vSelect from 'vue-select';
    export default {
        name: 'lista-de-contratos-gerencia',
        components: {
            'v-select': vSelect,
            DetalleDevolucionVue,
            exportActaGuiasBodegaDevolucionVue
        },
        data() {
            return {
                usuario:[],
                listaContratos: [],
                listaContratosTmp: [],
                pedido:{},
                noroot: '',
                tipo_pedido: 0,
                filtro: 0,
                totalLibros: 0,
                //variables para exportar
                mostrarImprimirActa:false,
                popupCarga:false,
                //fin variables para exporta el acta
                //variables para el detalle de guias
                arregloDetalle:[],
                popupDetalles:false,
                //fin variables para el detalle de guias
                arrayEmpresas:[],
                popupMostrarEmpresa:false,
                empresa:null,
            }
        },
        computed: {
            sumaPendientes() {
                let me = this;
                let datos = me.listaContratosTmp.filter(p => (p.estado == 0));
                let resultado = datos.length
                return resultado
            },
            SumaEntregados() {
                let me = this;
                let datos = me.listaContratosTmp.filter(p => (p.estado == 1));
                let resultado = datos.length
                return resultado
            },
            SumaRechazados() {
                let me = this;
                let datos = me.listaContratosTmp.filter(p => (p.estado == 2));
                let resultado = datos.length
                return resultado
            },
        },
        mounted() {
            let me = this;
            me.usuario = JSON.parse(localStorage.getItem('usuario'));
            me.f_pedidos()
        },
        methods: {
            changeHandle(e) {
                let me                  = this;
                me.popupCarga           = false
                me.mostrarImprimirActa  = false
            },
            ImprimirActa(){
                let me                  = this;
                // me.popupCarga           = true
                me.mostrarImprimirActa  = true
            },
            f_pedidos() {
                let me = this;
                me.$vs.loading()
                this.$http.get(this.$server_url + 'guias?listadoGuias=yes')
                    .then((res) => {
                        var predatos = []
                        let datos = res.data
                        if( me.usuario.id_group == 22 || me.usuario.id_group == 23 || me.usuario.id_group == 1 ){
                            predatos= datos.filter(p => p.pedido_facturacion == 1)
                        }
                        if( me.usuario.id_group == 17 || me.usuario.id_group == 27 ){
                            predatos= datos.filter(p => p.pedido_bodega == 1)
                        }
                        if( me.usuario.id_group == 11 || me.usuario.id_group == 11 ){
                            predatos= datos.filter(p => p.pedido_asesor == 1)
                        }

                        me.listaContratosTmp = predatos.filter(p => p.cantidad_devolver != 0 || p.cantidad_devuelta_codigoslibros != 0)
                        me.filtroTipo();
                        me.$vs.loading.close()
                    }).catch((err) => {
                        console.log(err)
                        me.$vs.loading.close()
                    });
            },
            filtroTipo() {
                let me = this;
                me.listaContratos = []
                //pendientes
                if (me.filtro == 0) {
                    let datos = me.listaContratosTmp.filter(p => (p.estado == 0));
                    me.listaContratos = datos
                    return
                }
                //aprobados
                if (me.filtro == 1) {
                    let datos = me.listaContratosTmp.filter(p => (p.estado == 1));
                    me.listaContratos = datos
                    return
                }
                //aprobados
                if (me.filtro == 2) {
                    let datos = me.listaContratosTmp.filter(p => (p.estado == 2));
                    me.listaContratos = datos
                    return
                }
            },
            getDetalles(tr) {
                let me = this;
                me.arregloDetalle = []
                me.$vs.loading();
                this.$http.get(this.$server_url+'guias?detalle=yes&id='+tr.id)
                    .then(function (res) {
                        let datos = res.data
                        me.arregloDetalle = datos.filter(p => p.cantidad_devuelta > 0 || p.cantidad_devuelta_codigoslibros > 0)
                        me.popupDetalles  = true
                        me.$vs.loading.close()
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.loading.close()
                    })
            },
            openConfirm(){
                this.$vs.dialog({
                    type:'confirm',
                    color: 'danger',
                    title: `Confirmar`,
                    acceptText:'aceptar',
                    cancelText:'cancelar',
                    text: 'Esta seguro de recibir esta devolución de guias?',
                    accept:this.enviarGuiasBDMilton
                })
            },
            openConfirmEmpresa(){
              let me = this
              me.$http.get(me.$server_url+'empresa')
              .then(function (res) {
                  if(res.data.status == 0){
                      me.$vs.notify({
                          text: res.data.message,
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-alert-triangle',
                          time:3000
                      })
                      return
                  }
                  me.arrayEmpresas       = res.data
                  //remover el id 2
                  me.arrayEmpresas       = me.arrayEmpresas.filter(p => p.id != 2)
                  me.popupMostrarEmpresa = true
              })
            },
            enviarGuiasBDMilton(){
                let me = this;
                if(me.empresa == null || me.empresa == "" || me.empresa == undefined){
                    me.$vs.notify({
                        text: 'Debe seleccionar una empresa',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
                //validacion
                if(me.pedido.codigo_contrato == null || me.pedido.codigo_contrato == "" || me.pedido.codigo_contrato == undefined || me.pedido.iniciales == "" || me.pedido.iniciales == null || me.pedido.iniciales == "null"){
                    me.$vs.notify({
                        text: 'El codigo del periodo o las iniciales del asesor no estan configuradas',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                }
                let formData = new FormData();
                formData.append('id_pedido',            me.pedido.id)
                formData.append('codigo_contrato',      me.pedido.codigo_contrato)
                formData.append('iniciales',            me.pedido.iniciales);
                formData.append('region_idregion',      me.pedido.region_idregion)
                formData.append('id_periodo',           me.pedido.periodo_id)
                formData.append('empresa_id',           me.empresa.id)
                formData.append('user_created',         me.usuario.idusuario)
                formData.append('periodo_id',           me.pedido.periodo_id)
                me.$vs.loading()
                this.$http.post(this.$server_url+'guardarDevolucionBDMilton', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if(res.data.status == 0){
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time:3000
                        })
                        return
                    }
                    me.popupMostrarEmpresa = false
                    me.$vs.notify({
                        text: 'Se guardo correctamente',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.f_pedidos()
                    me.actualizarBodegaProlipa(res.data)
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'No se puedo guardar',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
            },
            actualizarBodegaProlipa(ven_codigo) {
                let me = this
                me.$vs.loading();
                let formData = new FormData();
                formData.append('devolverGuias' ,'yes')
                formData.append('acta'          , ven_codigo)
                formData.append('asesor_id'     , this.pedido.asesor_id)
                this.$http.post(this.$server_url + 'entregarPedido', formData)
                    .then(res => {
                        // me.f_notificaciones('Pedido entregado', 'success', 'check')
                        me.f_pedidos();
                        me.$vs.loading.close();
                    })
                    .catch(err => {
                        console.log(err)
                        me.$vs.loading.close();
                    })
            },
            f_notificaciones(msj, color, icono) {
                let me = this;
                me.$vs.notify({
                    text: msj,
                    color: color,
                    iconPack: 'feather',
                    icon: icono
                })
                return;
            }
        },
    }
    </script>
