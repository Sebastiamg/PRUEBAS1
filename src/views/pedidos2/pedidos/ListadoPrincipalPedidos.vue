<template>
    <div>
        <div class="flex mt-5">
          <div style="width: 40%;">
            <p>
                <ion-icon name="contract-outline"></ion-icon> Filtro de pedidos por períodos
            </p>
          </div>
          <div style="width: 60%;">
            <!-- idperiodoescolar -->
            <div class="flex">
              <v-select
                :options="arregloPeriodos"
                @input="handlePeriodoChange"
                :reduce="arregloPeriodos => arregloPeriodos"
                label="periodoescolar"
                class="w-full"
                v-model="periodoSelect"
              />
              <vx-tooltip style="display: inline-block;" text="Actualizar pedidos" position="top" color="primary">
                <vs-button class="ml-1" @click="refreshPedidos()"><i class="fa-solid fa-rotate-left"></i></vs-button>
              </vx-tooltip>
            </div>
            <br>
          </div>
        </div>
        <vs-divider>
            <vs-button color="warning" v-if="changePeriodo == false" type="flat" icon="star">Ningun período Seleccionado</vs-button>
            <vs-button v-else color="success" type="flat" icon="star">Periodo seleccionado: <b>{{ periodoSelect.periodoescolar }}</b></vs-button>
        </vs-divider>
        <!-- Tabs-->
        <div class="flex" style="flex-wrap:wrap;" v-if="changePeriodo == true">
            <vs-button line-position="top" type="line"                            @click="estadoMenu(0);"                           class="btnPedidoMenu activeBtnPedido  pedidomenu0 ">Instituciones</vs-button>
            <vs-button line-position="top" color="warning" type="line"            @click="estadoMenu(1);"   v-if="groupFacturador" class="btnPedidoMenu                   pedidomenu1" >Ventas</vs-button>
            <vs-button line-position="top" color="danger"                         @click="estadoMenu(2);"   v-if="groupFacturador && !usarComponenteNuevo" class="btnPedidoMenu                   pedidomenu2" type="line">Agrupados venta</vs-button>
            <!-- <vs-button line-position="top" color="rgb(128, 0, 255)" type="line"   @click="estadoMenu(3);"   v-if="groupFacturador" class="btnPedidoMenu                   pedidomenu3">Pendientes <b style="font-size:16px;" v-if="countPendienteEnviarPerseoProforma > 0">{{ countPendienteEnviarPerseoProforma }}</b></vs-button> -->
            <vs-button line-position="top" color="#e6520e" type="line"            @click="estadoMenu(8);"   v-if="groupFacturador" class="btnPedidoMenu                   pedidomenu8">Pre-Facturas</vs-button>
            <vs-button line-position="top" color="#da3cf9" type="line"            @click="estadoMenu(4);"  v-if="groupFacturador && !usarComponenteNuevo" class="btnPedidoMenu                    pedidomenu4">PERSEO</vs-button>
            <!-- <vs-button line-position="top" color="dark" type="line"               @click="estadoMenu(5);"   v-if="groupFacturador" class="btnPedidoMenu                   pedidomenu5">Información General</vs-button> -->
            <vs-button line-position="top" color="success" type="line"            @click="estadoMenu(6);"   v-if="(userRoot || AdminFacturador || groupFacturador )" class="btnPedidoMenu       pedidomenu6">Cobranzas</vs-button>
            <vs-button line-position="top" color="rgb(41, 184, 255)" type="line"  @click="estadoMenu(7);"  v-if="AdminFacturador || userRoot" class="btnPedidoMenu        pedidomenu7">Cupos puntos de venta</vs-button>
            <vs-button line-position="top" color="#737272" type="line"            @click="estadoMenu(9);"  v-if="groupFacturador || userRoot " class="btnPedidoMenu        pedidomenu9">Reportes</vs-button>
            <vs-button line-position="top" color="#9c9516" type="line"            @click="estadoMenu(10);" v-if="userRoot" class="btnPedidoMenu        pedidomenu10">Guias</vs-button>
        </div>
        <!-- Directo-->
        <div v-if="menu == 0">
          <div v-if="ifNoLibros && periodoSelect.idperiodoescolar">
            <vs-alert color="warning">
              <p>No hay libros asignados</p>
            </vs-alert>
          </div>
            <!-- BOTON GENERAR FORMATO-->
            <div class="mt-2 flex" v-if="changePeriodo" style="flex-wrap:wrap;">
              <vs-button v-if="userRoot" type="relief" class="p-2 mr-4 mt-5" @click="abrirScreenFormatos()">
                  <ion-icon name="document-text-outline"></ion-icon> <span class="ml-2">Configuración de formatos</span>
              </vs-button>
              <vs-button v-if="userRoot" class="p-2 mr-4 mt-5" @click="llenarPedidos()" style="margin-top: -10px;" type="relief">llenar información en temporadas</vs-button>
              <vs-button v-if="userRoot" class="p-2 mr-4 mt-5" @click="Reporte_Regalados()" style="margin-top: -10px;" type="relief">Reporte Agrupado Regalados</vs-button>
            </div>
            <br><br>
            <!--VER PEDIDOS-->
            <div v-if="changePeriodo" style="margin-top: -18px;">
                <vs-button color="primary" v-if="userAsesor || groupFacturador" icon="add" type="border" @click="f_validatePedido()">Crear Pedido</vs-button>
                <listado_pedidosVue class="mt-3" @showPedido="showPedido" :periodoSelect="periodoSelect" :pedidos="pedidos" @changeRecarge="changeHandleRecarga" :userRoot="Boolean(userRoot)" :userAsesor="Boolean(userAsesor)" :groupFacturador="Boolean(groupFacturador)" :userContabilidad="Boolean(userContabilidad)" />
            </div>
        </div>
        <!-- ventas-->
        <div v-if="menu == 1">
            <listado_Ventas v-if="usarComponenteNuevo" class="mt-3" @showPedido="showPedido" :periodoSelect="periodoSelect" :pedidos="pedidos" @changeRecarge="changeHandleRecarga" :userRoot="Boolean(userRoot)" :userAsesor="Boolean(userAsesor)" :groupFacturador="Boolean(groupFacturador)" />
            <listado_VentasOld v-else class="mt-3" @showPedido="showPedido" :periodoSelect="periodoSelect" :pedidos="pedidos" @changeRecarge="changeHandleRecarga" :userRoot="Boolean(userRoot)" :userAsesor="Boolean(userAsesor)" :groupFacturador="Boolean(groupFacturador)" />
        </div>

        <!-- Punto de venta-->
        <div v-if="menu == 2">
          <ScreenAgrupadosVue :periodoSelect="periodoSelect"/>
        </div>
        <!-- Proformas-->
        <div v-if="menu == 3">
            <listadoProformas class="mt-3" @showPedido="showPedido" :periodoSelect="periodoSelect" @changeRecarge="changeHandleRecarga" :userRoot="Boolean(userRoot)" :userAsesor="Boolean(userAsesor)" :groupFacturador="Boolean(groupFacturador)" />
        </div>
        <!--Pre-Fecturas-->
        <div v-if="menu == 8">
            <listadoPreFacturas class="mt-3" @showPedido="showPedido" :periodoSelect="periodoSelect" @changeRecarge="changeHandleRecarga" :userRoot="Boolean(userRoot)" :userAsesor="Boolean(userAsesor)" :groupFacturador="Boolean(groupFacturador)" :usarComponenteNuevo="usarComponenteNuevo" />
        </div>
        <!--PERSEO-->
        <div v-if="menu == 4">
          <ScreenPerseoVue :periodoSelect="periodoSelect"/>
        </div>
        <!--cobranzas-->
        <div v-if="menu == 6">
            <cobranzas :periodoSelect="periodoSelect" :usarComponenteNuevo="usarComponenteNuevo"/>
        </div>
        <!-- Formulario-->
        <div v-if="menu == 7">
            <FormularioProforma class="mt-3" @showPedido="showPedido" :periodoSelect="periodoSelect" @changeRecarge="changeHandleRecarga" :userRoot="Boolean(userRoot)" :userAsesor="Boolean(userAsesor)" :groupFacturador="Boolean(groupFacturador)" />
        </div>
        <!-- Reportes -->
        <div v-if="menu == 9">
            <Reportes class="mt-3" @showPedido="showPedido" :periodo_id="Number(periodoSelect.idperiodoescolar)" :nombrePeriodo="String(periodoSelect.periodoescolar)" :periodoSelect="periodoSelect" @changeRecarge="changeHandleRecarga" :userRoot="Boolean(userRoot)" :userAsesor="Boolean(userAsesor)" :groupFacturador="Boolean(groupFacturador)" :usarComponenteNuevo="usarComponenteNuevo" />
        </div>
        <!-- Reportes -->
        <div v-if="menu == 10">
            <GruiasRemisionVue class="mt-3" @showPedido="showPedido" :periodo_id="Number(periodoSelect.idperiodoescolar)" :nombrePeriodo="String(periodoSelect.periodoescolar)" :periodoSelect="periodoSelect" @changeRecarge="changeHandleRecarga" :userRoot="Boolean(userRoot)" :userAsesor="Boolean(userAsesor)" :groupFacturador="Boolean(groupFacturador)" :visualizar="true" />
        </div>
        <!--MODAL CONFIGURACION DE FORMATOS (precios, pagaré, convenio)-->
        <vs-popup class="informacionformhijo" fullscreen :title="'Configuración de formatos' + (periodoSelect && periodoSelect.periodoescolar ? ' — ' + periodoSelect.periodoescolar : '')" :active.sync="popupScreenFormatos" @close="getFormatoPrecio();">
            <ScreenFormatos
                v-if="popupScreenFormatos"
                :periodoSelect="periodoSelect"
                :enviarPeriodo="enviarPeriodo"
                :arregloSeries="arregloSeries"
                :mixinIdInicioFormatoNewData="mixinIdInicioFormatoNewData"
                :activo="popupScreenFormatos"
                @abrirCargarFormato="popupScreenFormatos = false; popupCargarFormato = true;"
                @cerrar="popupScreenFormatos = false;"
            />
        </vs-popup>
        <!--CARGAR FORMATO ANTERIOR PARA LLENAR EN EL PERIODO NUEVO-->
        <vs-popup :title="'Cargar formato para el período '" :active.sync="popupCargarFormato">
            <CargarFormatoVue v-if="popupCargarFormato" :periodoSelect="periodoSelect" @rechargeFormato="rechargeFormato" />
        </vs-popup>
        <!--REPORTE VENTA DIRECTA O LISTA-->
        <vs-popup title="Reporte" :active.sync="popupMostrarReporteVentaDL" fullscreen class="popopPadre">
          <div v-if="popupMostrarReporteVentaDL">
            <p>Reporte de  {{ periodoSelect.periodoescolar }}</p>
            <ReporteVentaDirectaListaVue :periodo_id="periodoSelect.idperiodoescolar" :sendPeriodo="1"/>
          </div>
        </vs-popup>
        <!--MODAL PARA REPORTE DE BODEGA-->
        <vs-popup title="Reporte de bodega" :active.sync="popupMostrarReporteBodega" fullscreen @close="limpiarCache();">
          <div v-if="popupMostrarReporteBodega">
            <b>Periodo: {{periodoSelect.periodoescolar}}</b>
            <ReportePedidoBodegaVue :periodo_id="Number(periodoSelect.idperiodoescolar)" :nombrePeriodo="String(periodoSelect.periodoescolar)"/>
          </div>
        </vs-popup>
        <!--MODAL PARA REPORTE DE GUIAS ESCUELAS-->
        <vs-popup title="Reporte de guias escuelas" :active.sync="popupMostrarReporteGuiasEscuelas" fullscreen @close="limpiarCache();">
          <div v-if="popupMostrarReporteGuiasEscuelas">
            <b>Periodo: {{periodoSelect.periodoescolar}}</b>
            <ReportePedidoGuiasVue :periodo_id="Number(periodoSelect.idperiodoescolar)" :nombrePeriodo="String(periodoSelect.periodoescolar)"/>
          </div>
        </vs-popup>
        <!--MODAL PARA ELIGIR EL ASESOR-->
        <vs-popup title="Eligir Asesor" :active.sync="popupMostrarAsesores">
          <div v-if="popupMostrarAsesores">
            <PedidosAsesoresModalVue @changeAsesorSelected="changeAsesorSelected"/>
          </div>
        </vs-popup>
        <!-- SECCION REPORTE REGALADOS -->
        <vs-popup class="informacionformhijo" fullscreen :title="`Reporte Regalados del periodo`" :active.sync="popupReporteRegalados_xTemporada">
            <div v-if="popupReporteRegalados_xTemporada">
              <b>Periodo: {{periodoSelect.periodoescolar}}</b>
              <ReporteRegalados_xTemporada :PeriodoSelect="periodoSelect.idperiodoescolar" :nombrePeriodo="periodoSelect.periodoescolar" @change="changeHandleReporteRegalados_xTemporada" />
            </div>
        </vs-popup>
        <!-- SECCION FORMATO PAGARE -->
        <!-- movido a ScreenFormatos.vue -->
        <!-- SECCION FORMATO CONVENIO -->
        <!-- movido a ScreenFormatos.vue -->
    </div>
    </template>

    <script>
    import vSelect from 'vue-select'
    import {
        mapState
    } from "vuex";
    import listado_VentasOld from '@/views/pedidos/listado_ventas.vue'
    const FormatoPedidosVue           = () => import('@/views/pedidos/components/formato/FormatoPedidos.vue')
    const FormatoPedidosVueNew        = () => import('@/views/pedidos/components/formato/FormatoPedidosModify.vue')
    const CargarFormatoVue            = () => import('@/views/pedidos/components/formato/CargarFormato')
    const ScreenFormatos              = () => import('./ScreenFormatos.vue')
    const listado_pedidosVue          = () => import('@/views/pedidos/listado_pedidos2.vue')
    const listado_PuntosVue           = () => import('@/views/pedidos/listado_puntos.vue')
    const listado_Ventas              = () => import('@/views/pedidos/facturacion/contenedor_ventas.vue')
    const listadoProformas            = () => import('./proforma/screen_ListadosProforma.vue')
    const listadoPreFacturas            = () => import('./proforma/menuPrefacturas.vue')
    const ScreenAgrupadosVue          = () => import('../agrupados/ScreenAgrupados.vue')
    const cobranzas                   = () => import('../pedidos/cobranzas/cobranzas.vue')
    const FormularioProforma          = () => import('@/views/pedidos2/pedidos/formulario/lista_fromulario.vue')
    const ScreenPerseoVue             = () => import('./perseo/ScreenPerseo.vue')
    const ReporteVentaDirectaListaVue = () => import('../../pedidos/gerencia/reportes/ReporteVentaDirectaLista.vue')
    const ReportePedidoBodegaVue      = () => import('./reportes/ReportePedidoBodega.vue');
    const ReportePedidoGuiasVue       = () => import('./reportes/components/ReportePedidoGuias.vue');
    const Reportes                    = () => import('./reportes/screenReportes.vue');
    const PedidosAsesoresModalVue     = () => import('./configuracion/PedidosAsesoresModal.vue');
    const GruiasRemisionVue           = () => import('@/views/bodega/guias_remision/guias_remision_list.vue');
    const ReporteRegalados_xTemporada = () => import("@/views/pedidos2/pedidos/reportes/reportePedidos/ReporteActas_Regalados.vue");
    import Codigosmix from "@/mixins/Codigosmix";
    import PopupHistoryMixin from '@/mixins/PopupHistoryMixin'
    export default {
        components: {
            vSelect,
            listado_pedidosVue,
            FormatoPedidosVue,
            FormatoPedidosVueNew,
            CargarFormatoVue,
            listado_PuntosVue,
            listado_Ventas,
            listado_VentasOld,
            listadoProformas,
            ScreenAgrupadosVue,
            cobranzas,
            FormularioProforma,
            ScreenPerseoVue,
            ReporteVentaDirectaListaVue,
            ReportePedidoBodegaVue,
            ReportePedidoGuiasVue,
            listadoPreFacturas,
            Reportes,
            PedidosAsesoresModalVue,
            GruiasRemisionVue,
            ReporteRegalados_xTemporada,
            ScreenFormatos,
        },
        mixins: [Codigosmix, PopupHistoryMixin],
        data() {
            return {
                menu: 0,
                usuario: [],
                periodoSelect: '',
                changePeriodo: false,
                enviarPeriodo: '',
                //variables formato
                arregloSeries: [],
                //fin variables formato
                popupCargarFormato: false,
                pedidos: [],
                popupMostrarReporteVentaDL:false,
                countPendienteEnviarPerseoProforma:0,
                popupMostrarReporteBodega:false,
                popupMostrarReporteGuiasEscuelas:false,
                periodoConfigNew: '',
                mixinIdInicioFormatoNewData: null,
                //variables para formato de ventas nuevo
                formatoVentasMinimo: null,
                formatoVentasMaximo: null,
                //variables para crear pedido asesor desde el root
                popupMostrarAsesores:false,
                asesorSelected:'',
                //fin variables para crear pedido asesor desde el root
                ifNoLibros:false,
                popupReporteRegalados_xTemporada: false,
                // Variable para controlar si usar componente nuevo o antiguo
                usarComponenteNuevo: true, // true = nuevo, false = antiguo
                // Popup configuración de formatos (agrupa precios, pagaré, convenio)
                popupScreenFormatos: false,
            }
        },
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'userContabilidad', 'ObjectPedido', 'groupFacturador', 'userAsesor', 'AdminFacturador']),
        },
        watch: {
            async periodoSelect(results) {
                let me = this;
                if (results == null || results == null || results == undefined) {
                    me.changePeriodo = false
                    localStorage.removeItem('pid')
                    localStorage.removeItem('pnombre')
                } else {
                    me.$vs.loading();
                    me.changePeriodo = true
                    localStorage.setItem('pid', results.idperiodoescolar)
                    localStorage.setItem('pnombre', results.periodoescolar)

                    // Ejecutar todas las operaciones antes de cerrar el loading
                    await me.getPedidos()
                    me.pendienteEnviarPerseo()
                    // Cargar configuración y luego determinar qué componente usar
                    await me.getConfiguracionFormatoVentas();
                    me.determinarComponenteVentas()

                    me.$vs.loading.close();
                }
                me.estadoMenu(0)
            },
            popupFormato_Pagare(newVal) {
                // movido a ScreenFormatos.vue
            },
            popupFormato_Convenio(newVal) {
                // movido a ScreenFormatos.vue
            },
            // Watch para cuando arregloPeriodos se carga desde el padre
            arregloPeriodos: {
                handler(newVal) {
                    let me = this;
                    // Si ya hay períodos disponibles y no hay uno seleccionado, intentar cargar desde localStorage
                    if (newVal && newVal.length > 0 && !me.periodoSelect) {
                        me.cargarPeriodoInicial();
                    }
                },
                immediate: true
            }
        },
        created() {
            let me = this;
            me.usuario = JSON.parse(localStorage.getItem("usuario"))
        },
        mounted() {
            let me = this;
            // Verifica si los datos existen en localStorage
            const mixinData = localStorage.getItem('mixin_IdInicioFormatoNew');
            if (mixinData) {
              // Convierte el JSON en un array de objetos y extrae solo 'minimo' si existe
              const parsedData = JSON.parse(mixinData);
              me.mixinIdInicioFormatoNewData = parsedData.length > 0 ? parsedData[0].minimo : null;

              console.log("Valor de minimo:", me.mixinIdInicioFormatoNewData); // Verifica el valor en consola
            } else {
                console.warn("No se encontraron datos en localStorage para mixin_IdInicioFormatoNew");
            }
            // FIN Verificación si los datos existen en localStorage

            // Cargar configuración de formato de ventas al iniciar
            me.getConfiguracionFormatoVentas();

            me.getSeries();

            // Intentar cargar el período inicial si el array ya está disponible
            me.cargarPeriodoInicial();

            if(me.submenu > 0){
              me.menu = me.submenu
            }
        },
        props: {
            arregloPeriodos: {
                type: Array,
                default: function () {
                    return []
                }
            },
            submenu:{
              type:Number,
              default:0,
            }
        },
        methods: {
          handlePeriodoChange(value) {
            let me = this;
            // Si el valor es null (el usuario limpió el select), no hacer nada más
            if (!value) {
              console.log("ℹ️ Select limpiado, periodo eliminado");
              return;
            }

            // Si hay un valor válido, ejecutar las acciones
            me.menu = 0;
            me.setNumeroMenu(0);
            me.limpiarCache();
            me.getPedidos();
            me.updateVentaReal();
          },
          refreshPedidos() {
            let me = this;
            // Validar que haya un período seleccionado antes de refrescar
            if (!me.periodoSelect) {
              me.$vs.notify({
                text: 'Por favor selecciona un período primero',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
              });
              return;
            }

            me.menu = 0;
            me.setNumeroMenu(0);
            me.limpiarCache();
            me.getPedidos();
            me.updateVentaReal();
          },
          cargarPeriodoInicial() {
            let me = this;
            // Solo intentar cargar si hay períodos disponibles y no hay uno seleccionado
            if (!me.arregloPeriodos || me.arregloPeriodos.length === 0) {
              console.warn("⚠️ arregloPeriodos aún no está cargado");
              return;
            }

            if (me.periodoSelect) {
              console.log("✅ Período ya seleccionado:", me.periodoSelect.periodoescolar);
              return;
            }

            let searchPeriodoActive = localStorage.pid;
            if (searchPeriodoActive) {
              const periodoEncontrado = me.arregloPeriodos.find(x => x.idperiodoescolar == searchPeriodoActive);
              if (periodoEncontrado) {
                me.periodoSelect = periodoEncontrado;
                console.log("✅ Período cargado desde localStorage:", periodoEncontrado.periodoescolar);
              } else {
                console.warn("⚠️ Período en localStorage no encontrado en arregloPeriodos");
              }
            } else {
              console.log("ℹ️ No hay período guardado en localStorage");
            }
          },
          pendienteEnviarPerseo(){
            let me = this
            if(me.groupFacturador){
              me.countPendienteEnviarPerseoProforma = 0
              this.$http.get(this.$server_url+'GetFacturasTodas?estadoPerseo=1&periodo='+me.periodoSelect.idperiodoescolar)
              .then(res => {
                me.countPendienteEnviarPerseoProforma = res.data.length
              })
            }
          },
          llenarPedidos(){
            let me = this;
            this.$http.get(this.$server_url+'llenarInformacionContrato')
            .then(res => {
              console.log(res.data)
              me.$vs.notify({
              text:'Se guardo correctamente',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
            })
          },
          /*METODOS DE REPORTE*/
          mostrarReporteVentaListaDirecta(){
            let me = this
            me.popupMostrarReporteVentaDL = true
          },
          estadoMenu(numMenu){
            let me = this;
            // Si entra al tab de Ventas (menu 1), cargar configuración
            if(numMenu == 1) {
              me.getConfiguracionFormatoVentas();
            }
            // localStorage.setItem('menuSelectDistribuidor',me.filtro)
            var divs = document.querySelectorAll(".btnPedidoMenu");
            for (var i = 0; i < divs.length; i++) {
              divs[i].classList.remove("activeBtnPedido");
            }
            const container = document.querySelector(".pedidomenu"+numMenu);
            //despues de 1 segundo agregar la clase
            setTimeout(() => {
              container.classList.add("activeBtnPedido");
            }, 100)
            me.menu = numMenu
          },
          setNumeroMenu(m,smenu) {
            let me = this
            // Validar que periodoSelect existe antes de acceder a sus propiedades
            if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
              return
            }

            localStorage.periodoIdSelect      = me.periodoSelect.idperiodoescolar;
            localStorage.periodoNombreSelect  = me.periodoSelect.periodoescolar;
            localStorage.setMenu = me.periodoSelect.codigo_contrato;
            localStorage.menuSeleccionado = smenu
            localStorage.nombre_periodoPuntos = me.periodoSelect.periodoescolar
          },
          f_validatePedido(){
            let me = this
            if(me.userAsesor){ me.addPedido(); this.$store.dispatch('setAsesorPedidoSelected', null); return; }
            else if(me.groupFacturador){ me.popupMostrarAsesores = true; return; }
          },
          changeAsesorSelected(e) {
            let me = this;
            me.asesorSelected = '';
            me.asesorSelected = e;
            me.popupMostrarAsesores = false;

            // Asegura que el modal se cierre antes de ejecutar el dispatch y agregar el pedido
            this.$nextTick(() => {
              this.$store.dispatch('setAsesorPedidoSelected', e);
              me.addPedido();
            });
          },

          addPedido() {
            let me = this;
            me.popupMostrarAsesores = false;
            let datos = {
              id_pedido: 0,
              id_periodo: this.periodoSelect.idperiodoescolar,
              periodo: this.periodoSelect.periodoescolar
            };
            this.$store.dispatch('setPedido', datos);
            localStorage.setItem("id_periodo_selected", this.periodoSelect.idperiodoescolar);
            localStorage.setItem("nombre_periodo_selected", this.periodoSelect.periodoescolar);
            me.$emit('showPedido', 1);
          },

          // changeAsesorSelected(e){
          //   let me = this;
          //   me.asesorSelected = ''
          //   me.asesorSelected = e
          //   me.popupMostrarAsesores = false;
          //   this.$store.dispatch('setAsesorPedidoSelected', e);
          //   me.addPedido()
          // },
          // addPedido() {
          //   let me = this
          //   me.popupMostrarAsesores = false;
          //   let datos = {
          //     id_pedido: 0,
          //     id_periodo: this.periodoSelect.idperiodoescolar,
          //     periodo: this.periodoSelect.periodoescolar
          //   }
          //   this.$store.dispatch('setPedido', datos)
          //   localStorage.setItem("id_periodo_selected", this.periodoSelect.idperiodoescolar)
          //   localStorage.setItem("nombre_periodo_selected", this.periodoSelect.periodoescolar)
          //   me.$emit('showPedido', 1)
          // },
          showPedido(e) {
            let me = this
            me.$emit('showPedido', e)
          },
          changeHandleRecarga(e) {
            let me = this;
            me.limpiarCache()
            me.getPedidos()
          },
          updateVentaReal() {
            let me = this
            //si es asesor envio a actualizar la venta real
            if (me.userAsesor) {
              if (me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined) { return }
              const { idusuario } = me.usuario;
              const { idperiodoescolar } = me.periodoSelect
              this.$http.get(this.$server_url + `pedigo_Pagos?updateVentaReal=1&idAsesor=${idusuario}&idPeriodo=${idperiodoescolar}`)
                  .then(res => {})
            }
          },
          async getPedidos() {
            let me = this
            var ruta = ""
            me.pedidos = []
            me.periodoConfigNew = localStorage.pid;
            if (me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined) { return }
            if (me.usuario.id_group == 22) ruta = this.$server_url + 'get_pedidos_periodo_facturador/' + me.periodoSelect.idperiodoescolar + '/' + me.usuario.idusuario
            else ruta = this.$server_url + 'get_pedidos_periodo/' + me.periodoSelect.idperiodoescolar + '/' + me.usuario.id_group + '/' + me.usuario.idusuario

            try {
              const res = await this.$http.get(ruta);
              let datos = res.data.filter(p => p.facturacion_vee == 1)
              me.getFormatoPrecio()
              if (me.usuario.id_group == 22) {
                  me.pedidos = datos.filter(p => ((p.ifagregado_anticipo_aprobado == 1 || p.ifagregado_anticipo_aprobado == 3) || (p.ifanticipo == 0 || p.ifanticipo == null)))
                  return
              }
              if (me.userRoot || me.userAsesor) {
                  me.pedidos = res.data
                  return
              } else {
                me.pedidos = datos
              }
            } catch(e) {
              console.error('Error al obtener pedidos:', e);
              me.$vs.notify({
                text: 'Error al cargar los pedidos',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-circle'
              });
            }
          },
          getFormatoPrecio(){
            let me = this
            me.ifNoLibros = false
            var  nuevarutaxperiodo = ""
            if (me.periodoSelect.idperiodoescolar <= me.mixinIdInicioFormatoNewData) {
                nuevarutaxperiodo = `pedidos2/pedidos?formatoPrecioXPeriodo=1&periodo_id=${ me.periodoSelect.idperiodoescolar }&nuevo=0`;
            } else if (me.periodoSelect.idperiodoescolar > me.mixinIdInicioFormatoNewData) {
                nuevarutaxperiodo = `pedidos2/pedidos?formatoPrecioXPeriodo=1&periodo_id=${ me.periodoSelect.idperiodoescolar }&nuevo=1`;
            }
            me.$http.get(this.$server_url + nuevarutaxperiodo)
              .then(res => {
                if (res.data.length == 0) {
                  me.ifNoLibros = true
                } else {
                  me.ifNoLibros = false
                }
              })
              .catch((e) => {
                console.log("error",e)
                me.$vs.notify(
                  { text: 'Error al cargar el formato de precios', color: 'danger', iconPack: 'feather', icon: 'icon-alert-circle' }
                )
              })
          },
          getSeries() {
            let me = this
            me.arregloSeries = []
            this.$http.get(this.$server_url + 'series_full')
              .then(res => {
                  me.arregloSeries = res.data
              })
          },
          async getConfiguracionFormatoVentas() {
            let me = this;
            // Buscar en la tabla configuracion_general el registro con id=12
            // API: GET /configuracion_general?id=12
            try {
              const res = await this.$http.get(this.$server_url + 'configuracion_general?id=12');
              if (res.data && res.data.length > 0) {
                const config = res.data[0];
                me.formatoVentasMinimo = Number(config.minimo); // 29
                me.formatoVentasMaximo = Number(config.maximo); // 20

                // Guardar en localStorage para que otros componentes puedan acceder
                localStorage.setItem('formatoVentasMinimo', me.formatoVentasMinimo);
                localStorage.setItem('formatoVentasMaximo', me.formatoVentasMaximo);

                console.log("✅ Configuración formato ventas cargada desde configuracion_general:", {
                  id: config.id,
                  nombre: config.nombre,
                  minimo: me.formatoVentasMinimo,
                  maximo: me.formatoVentasMaximo,
                  descripcion: config.descripcion,
                  user_created: config.user_created,
                  created_at: config.created_at
                });
              } else {
                console.warn("⚠️ No se encontró la configuración de formato de ventas (id: 12) en configuracion_general");
                // Valores por defecto si no existe la configuración
                me.formatoVentasMinimo = 29;
                me.formatoVentasMaximo = 20;

                // Guardar en localStorage
                localStorage.setItem('formatoVentasMinimo', me.formatoVentasMinimo);
                localStorage.setItem('formatoVentasMaximo', me.formatoVentasMaximo);
              }
            } catch(e) {
              console.error("❌ Error al obtener configuración de formato de ventas:", e);
              // Valores por defecto en caso de error
              me.formatoVentasMinimo = 29;
              me.formatoVentasMaximo = 20;

              // Guardar en localStorage
              localStorage.setItem('formatoVentasMinimo', me.formatoVentasMinimo);
              localStorage.setItem('formatoVentasMaximo', me.formatoVentasMaximo);
            }
          },
          verFormato() {
            let me = this;
            let datos = me.arregloPeriodos
            let setear = datos.filter(p => p.idperiodoescolar == me.periodoSelect.idperiodoescolar)
            me.enviarPeriodo = setear[0]
          },
          abrirScreenFormatos() {
            let me = this;
            me.verFormato();
            me.popupScreenFormatos = true;
          },
          //Metodos para cargar formato
          rechargeFormato(e) {
            let me = this;
            me.popupCargarFormato = false;
            me.popupScreenFormatos = true;
          },
          Reporte_Regalados() {
            this.popupReporteRegalados_xTemporada = true;
          },
          changeHandleReporteRegalados_xTemporada(e) {
            let me = this;
            if (e.verificarhistoricoedicionmasivaactualizar == 1) {
                console.log("Emit recibido por guardado.");
                me.popupReporteRegalados_xTemporada = false;
            } else if (e.verificarhistoricoedicionmasivaactualizar == 2) {
                console.log("Emit recibido por cancelar.");
                me.popupReporteRegalados_xTemporada = false;
            } else {
                console.log("Emit no recibido");
            }
          },
          // Método para determinar qué componente de ventas usar basado en configuracion_general id=12
          determinarComponenteVentas() {
            let me = this;

            // Validar si tenemos la configuración cargada
            if (me.formatoVentasMinimo === null || me.formatoVentasMaximo === null) {
              console.warn("⚠️ Configuración de formato de ventas no cargada aún, usando componente antiguo por defecto");
              me.usarComponenteNuevo = false;
              localStorage.setItem('usarComponenteNuevo', me.usarComponenteNuevo);
              return;
            }

            if (!me.periodoSelect || !me.periodoSelect.idperiodoescolar) {
              console.warn("⚠️ No hay periodo seleccionado");
              me.usarComponenteNuevo = false;
              localStorage.setItem('usarComponenteNuevo', me.usarComponenteNuevo);
              return;
            }

            const periodoId = Number(me.periodoSelect.idperiodoescolar);

            /**
             * Lógica simplificada basada en configuracion_general id=12:
             * - maximo: 20 - Si periodo == 20 → Componente NUEVO + Sin agrupado
             * - minimo: 29 - Si periodo >= 29 → Componente NUEVO + Sin agrupado
             * - Cualquier otro caso → Componente ANTIGUO + Con agrupado
             */

            // Condición 1: Si periodo es igual al máximo (20)
            if (periodoId == me.formatoVentasMaximo) {
              me.usarComponenteNuevo = true;
              localStorage.setItem('usarComponenteNuevo', me.usarComponenteNuevo);
              console.log(`📊 Periodo ${periodoId} == ${me.formatoVentasMaximo}: Usando componente de ventas NUEVO ✨ (sin agrupados)`);
              return;
            }

            // Condición 2: Si periodo es mayor o igual al mínimo (29)
            if (periodoId >= me.formatoVentasMinimo) {
              me.usarComponenteNuevo = true;
              localStorage.setItem('usarComponenteNuevo', me.usarComponenteNuevo);
              console.log(`📊 Periodo ${periodoId} >= ${me.formatoVentasMinimo}: Usando componente de ventas NUEVO ✨ (sin agrupados)`);
              return;
            }

            // Cualquier otro caso: Componente ANTIGUO + Con agrupado
            me.usarComponenteNuevo = false;
            localStorage.setItem('usarComponenteNuevo', me.usarComponenteNuevo);
            console.log(`📊 Periodo ${periodoId}: Usando componente de ventas ANTIGUO 📋 (con agrupados)`);
          },
          getFormatoPagare() {
            // Tab pagaré gestionado por ScreenFormatos
          },
          cerrarPopupFormato_Pagare() {
              // movido a ScreenFormatos.vue
          },
          changeHandle_FormatoPagare(e) {
              // movido a ScreenFormatos.vue
          },
          //FORMATO_CONVENIO
          getFormatoConvenio() {
            // Tab convenio gestionado por ScreenFormatos
          },
          cerrarPopupFormato_Convenio() {
              // movido a ScreenFormatos.vue
          },
          changeHandle_FormatoConvenio(e) {
              // movido a ScreenFormatos.vue
          },
        }
    }
    </script>
    <style scoped>
    .btnPedidoMenu.pedidomenu0.activeBtnPedido {
      background: #adaeffcb; /* Estilo para el botón "Instituciones" activo */
      color: rgb(255, 255, 255);
    }

    .btnPedidoMenu.pedidomenu1.activeBtnPedido {
      background: #ffc10785; /* Estilo para el botón "Ventas" activo */
      color: rgb(252, 122, 0);
    }

    .btnPedidoMenu.pedidomenu2.activeBtnPedido {
      background: #f7283d6e; /* Estilo para el botón "Agrupados venta" activo */
      color: rgb(255, 255, 255);
    }

    .btnPedidoMenu.pedidomenu3.activeBtnPedido {
      background: rgba(146, 104, 189, 0.664); /* Estilo para el botón "Proformas" activo */
      color: rgb(255, 255, 255) !important;
    }

    .btnPedidoMenu.pedidomenu4.activeBtnPedido {
      background: #e055ec67; /* Estilo para el botón "Perseo" activo */
      color: #7f1988 !important;
      font-weight: bold !important;
    }

    .btnPedidoMenu.pedidomenu5.activeBtnPedido {
      background: #7b7c7c9c; /* Estilo para el botón "Información General" activo */
      color: rgb(255, 255, 255);
    }

    .btnPedidoMenu.pedidomenu6.activeBtnPedido {
      background: #9aecadcb; /* Estilo para el botón "Cobranzas" activo */
      color: rgb(10, 116, 6);
      font-weight:bolder;
    }

    .btnPedidoMenu.pedidomenu7.activeBtnPedido {
      background: hsla(202, 73%, 51%, 0.616); /* Estilo para el botón "Cobranzas" activo */
      color: rgb(11, 84, 219) !important;
      font-weight:bolder;
    }
    .btnPedidoMenu.pedidomenu8.activeBtnPedido {
      background: hsla(19, 73%, 51%, 0.39); /* Estilo para el botón "Cobranzas" activo */
      color: rgb(238, 58, 3) !important;
      font-weight:bolder;
    }
    .btnPedidoMenu.pedidomenu9.activeBtnPedido {
      background: hsla(0, 1%, 65%, 0.39); /* Estilo para el botón "Cobranzas" activo */
      color: rgb(87, 87, 87) !important;
      font-weight:bolder;
    }
    .btnPedidoMenu.pedidomenu10.activeBtnPedido {
      background: hsla(59, 69%, 47%, 0.39); /* Estilo para el botón "Cobranzas" activo */
      color: rgb(129, 127, 5) !important;
      font-weight:bolder;
    }

    .popopPadre {
        z-index: 51002;
        /* Valor mayor que el del popup del padre */
        position: fixed;
        /* Asegúrate de que la posición sea adecuada */
    }

    .informacionformhijo {
        z-index: 51001;
        /* Asegúrate de que este valor sea alto para que el popup hijo del hijo pueda superponerse */
        /* position: fixed; */
        /* Asegúrate de que la posición sea adecuada */
    }
    </style>
