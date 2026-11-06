<template>
    <div>
        <div>
            <vs-row vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex" class="m-2">
                <span class="ml-3 mt-3 font-bold">{{sendPedido.nombreInstitucion}}</span>
            </vs-row>
        </div>
        <!--MENU-->
        <div class="flex" style="flex-wrap:wrap;">
            <vx-tooltip style="display: inline-block;" text="Refrescar pedido" position="top" color="primary">
                <vs-button radius color="success" type="gradient" class="m-4" icon-pack="feather" icon="icon-refresh-ccw" @click="rechargePedido();"></vs-button>
            </vx-tooltip>
            <vs-button line-position="top" type="line"        class="mt-1 btn-small" :class="{ 'active-institucion': menu === 0 }"   @click="menu = 0;">Institución</vs-button>
            <vs-button line-position="top" color="danger"     class="mt-1 btn-small" :class="{ 'active-beneficiario': menu === 2 }"   @click="menu = 2;" v-if="sendPedido.id_pedido > 0" type="line">Beneficiario</vs-button>
            <vs-button line-position="top" line-origin="left" class="mt-1 btn-small" :class="{ 'active-libros': menu === 1 }"   @click="menu = 1;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="success" type="line" >Libros</vs-button>
            <vs-button line-position="top" line-origin="left" class="mt-1 btn-small" :class="{ 'active-convenios': menu === 3 }"   @click="menu = 3;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0 && !groupFacturador" color="warning" type="line">Convenios</vs-button>
            <vs-button line-position="top" line-origin="left" class="mt-1 btn-small" :class="{ 'active-anticipos': menu === 4 }"   @click="rechargePedido();menu = 4;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="dark" type="line">{{groupFacturador ? 'Pagos':'Anticipos'}}</vs-button>
            <vs-button line-position="top" line-origin="left" class="mt-1 btn-small" :class="{ 'active-anticipos': menu === 5 }"   @click="rechargePedido();menu = 5;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="warning" type="line">Archivos</vs-button>
            <vs-button line-position="top" line-origin="left" class="mt-1 btn-small" :class="{ 'active-anticipos': menu === 6 }"   @click="rechargePedido();menu = 6;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="warning" type="line">Detalle de venta </vs-button>
            <vs-button line-position="top" line-origin="left" class="mt-1 btn-small" :class="{ 'active-anticipos': menu === 7 }"   @click="rechargePedido();menu = 7;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0 && (userRoot || userAsesor)" color="dark" type="line">Leer códigos </vs-button>
            <vs-button line-position="top" type="line"        class="mt-1 btn-small" :class="{ 'active-verificaciones': menu === 8 }"   @click="menu = 8;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0">Verificaciones</vs-button>
            <vs-button line-position="top" line-origin="left" class="mt-1 btn-small" :class="{ 'active-seguimiento': menu === 9 }"   @click="menu = 9;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0" color="success" type="line">Seguimiento pedido</vs-button>
            <vs-button line-position="top" type="line"        class="mt-1 btn-small" :class="{ 'active-alcances': menu === 10 }"   @click="menu = 10;" v-if="(sendPedido.contrato_generado!=null || sendPedido.contrato_generado!=undefined)" color="warning">Alcances</vs-button>
            <vs-button line-position="top" line-origin="left" class="mt-1 btn-small" :class="{ 'active-libros-obsequios': menu === 11 }"  @click="menu = 11;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0 " color="danger" type="line">Libros Hijos Docentes / Obsequios</vs-button>
            <vs-button line-position="top" line-origin="left" class="mt-1 btn-small" :class="{ 'active-detalleCobro': menu === 12 }"  @click="menu = 12;" v-if="sendPedido.id_pedido > 0 && sendPedido.id_responsable > 0 && (sendPedido.contrato_generado!=null || sendPedido.contrato_generado!=undefined) && sendPedido.tipo_venta == 1" color="dark" type="line">Detalle Cobro</vs-button>
            <!-- <vs-button line-position="top" line-origin="left" class="mt-1 btn-small"  :class="{ 'active-novedades': menu === 13 }"  @click="menu = 13;" color="#ba4213" type="line">Novedades</vs-button> -->
            <vs-button v-if="userRoot" line-position="top" line-origin="left" class="mt-1 btn-small"  :class="{ 'active-visualizar': menu === 13 }"  @click="menu = 13;" color="#ba4213" type="line">Visualizadores adicionales</vs-button>
            <vs-button line-position="top" line-origin="left" class="mt-1 btn-small" :class="{ 'active-pagare': menu === 14 }" @click="menu = 14;" v-if="!userAsesor" color="#8e44ad" type="line">Gestión Pagaré</vs-button>
        </div>
        <!--VENTA REAL-->
        <div v-if="sendPedido.id_pedido && menu != 10">
            <BeneficiariosPorcentajeVue :pedido="sendPedido" />
        </div>
        <br>
        <!--COMPONENTES-->
        <div v-if="menu == 0 && ready">
            <ScreenInstitucion @rechargePedido="rechargePedido"/>
        </div>
        <!--LIBROS-->
        <div v-if="menu == 1">
            <ScreenLibrosVue @rechargePedido="rechargePedido" />
        </div>
        <!--BENEFICIARIO-->
        <div v-if="menu == 2 && sendPedido.id_pedido">
            <registrar_beneficiariosVue
            :pro_idperiodoescolar="sendPedido.id_periodo"
            :pro_institucion="sendPedido.id_institucion"
            :pedido="sendPedido"
             @rechargePedido="rechargePedido" />
        </div>
        <!--CONVENIO-->
        <div v-if="menu == 3">
            <ScreenConvenioVue :datosInstitucion="datosInstitucion" />
        </div>
        <!--ANTICIPOS-->
        <div v-if="menu == 4 && sendPedido.id_pedido">
            <ScreenAnticiposVue @rechargePedido="rechargePedido" />
        </div>
        <!--ARCHIVOS-->
        <div v-if="menu == 5 && sendPedido.id_pedido">
          <ScreenArchivosVue/>
        </div>
        <!--DETALLE DE VENTA-->
        <div v-if="menu == 6 && sendPedido.id_pedido">
          <RevisionVentaVue
            :pedido="{
              nombreInstitucion: sendPedido.nombreInstitucion,
              idInstitucion: sendPedido.id_institucion,
              periodoDescripcion: sendPedido.periodo,
              periodo_id: sendPedido.id_periodo,
              idInstitucion: sendPedido.id_institucion,
             }"
            :showAgrupado="1"
          />
        </div>
        <!--LEER CODIGOS-->
        <div v-if="menu == 7 && sendPedido.id_pedido">
          <importCodigosVue :pedido="sendPedido" :desdePedido="Number(1)"/>
        </div>
        <!--VERIFICACIONES-->
        <div v-if="menu == 8 && sendPedido.contrato_generado">
            <ScreenVerificacionesVue />
        </div>
        <!--TRAZABILIDAD-->
        <div v-if="menu == 9 && sendPedido.id_pedido">
            <screenTransabilidaVue :pedido="sendPedido" />
        </div>
        <!--alcances-->
        <div v-if="menu == 10">
          <menuAlcanceVue/>
        </div>
        <!--LibrosObsequios-->
        <div v-if="menu == 11">
            <librosObsequios :sendPedido="sendPedido" />
        </div>
        <!--Cobranza-->
        <div v-if="menu == 12">
            <Cobranza :sendPedido="sendPedido" />
        </div>
        <!--Observaciones-->
        <div v-if="menu == 13">
            <VisualizadoresAdicionalesVue :datosInstitucion="datosInstitucion" :pedido="sendPedido"/>
        </div>
        <!--Gestion Pagare-->
        <div v-if="menu == 14">
            <GestionPagareVue :datosInstitucion="datosInstitucion" :pedido="sendPedido"/>
        </div>
    </div>
    </template>

    <script>
    import {
        mapState
    } from "vuex";
    import PedidosRepository            from "../../../repositories/PedidosRepository";
    const BeneficiariosPorcentajeVue    = () => import('../../pedidos/components/beneficiarios/BeneficiariosPorcentaje.vue')
    const ScreenInstitucion             = () => import('./institucion/ScreenInstitucion.vue')
    const ScreenLibrosVue               = () => import('./libros/ScreenLibros.vue')
    const registrar_beneficiariosVue    = () => import('../../pedidos/registrar_beneficiarios.vue')
    const ScreenConvenioVue             = () => import('../../temporadas/components/Pedidos/Configuracion/Convenios/ScreenConvenio.vue')
    const ScreenAnticiposVue            = () => import('./anticipos/ScreenAnticipos.vue')
    const ScreenArchivosVue             = () => import('./archivos/ScreenPedidosArchivos.vue')
    const ScreenVerificacionesVue       = () => import('../verificaciones/ScreenVerificaciones.vue')
    const screenTransabilidaVue         = () => import('../../pedidos/transabilidad/screenTransabilida.vue')
    const menuAlcanceVue                = () => import('../../pedidos/alcance/menuAlcance.vue')
    const librosObsequios               = () => import('./libros/librosObsequios/librosObsequios.vue')
    const Cobranza                      = () => import('@/views/pedidos2/pedidos/cobranzas/asesores/asesorcobranza.vue')
    // const VisualizadoresAdicionalesVue  = () => import('@/views/institucion/novedades_institucion.vue')
    const VisualizadoresAdicionalesVue  = () => import('@/views/pedidos2/pedidos/visualizadores_adicionales/visualizadores_adicionales_list.vue')
    const RevisionVentaVue              = () => import('../../codigos/components/utils/RevisionVenta.vue')
    const importCodigosVue              = () => import("../../codigos/components/importCodigos.vue");
    const GestionPagareVue              = () => import('@/views/pedidos2/pedidos/gestion_pagare/pedido_gestionpagare/lista_gestionpagare.vue');
    export default {
        components: {
            ScreenInstitucion,
            ScreenLibrosVue,
            BeneficiariosPorcentajeVue,
            registrar_beneficiariosVue,
            ScreenConvenioVue,
            ScreenAnticiposVue,
            ScreenVerificacionesVue,
            screenTransabilidaVue,
            menuAlcanceVue,
            librosObsequios,
            Cobranza,
            VisualizadoresAdicionalesVue,
            ScreenArchivosVue,
            RevisionVentaVue,
            importCodigosVue,
            GestionPagareVue,
        },
        data() {
            return {
                menu: 0,
                ready: false, // Previene que ScreenInstitucion (VsTabs) se monte antes de conocer el menú correcto
                sendPedido: '',
                datosInstitucion: '',
            }
        },
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'groupFacturador', 'userAsesor']),
        },
        watch: {
            ObjectPedido(results) {
                let me = this
                me.sendPedido = me.ObjectPedido
            },
        },
        mounted() {
          let me = this;
          me.sendPedido = me.ObjectPedido
          me.datosInstitucion = {
            idInstitucion: me.sendPedido.id_institucion,
            nombreInstitucion: me.sendPedido.nombreInstitucion,
            id_periodo: me.sendPedido.id_periodo,
          }
          me.updateVentaReal()
          // Aplicar menú guardado (ej: navegar directo a Gestión Pagaré)
          const savedMenu = parseInt(localStorage.getItem('menuNovedad'));
          if (savedMenu > 0) {
            me.menu = savedMenu;
            localStorage.removeItem('menuNovedad');
          }
          // Solo DESPUÉS de fijar el menú, habilitamos el render de ScreenInstitucion.
          // Así VsTabs solo se monta si menu == 0, evitando el error de nextTick.
          me.ready = true;
        },
        methods: {
          rechargePedido() {
            let me = this
            PedidosRepository.getPedidoXID(me.sendPedido.id_pedido).then(r => { this.$store.dispatch('setPedido', r.data[0]); })
          },
          updateVentaReal() {
            let me = this
            if (me.groupFacturador) {
                //si es asesor envio a actualizar la venta real
                if (me.sendPedido.id_periodo == null || me.sendPedido.id_periodo == undefined) {} else {
                    const { id_asesor, id_periodo } = me.sendPedido;
                    this.$http.get(this.$server_url + `pedigo_Pagos?updateVentaReal=1&idAsesor=${id_asesor}&idPeriodo=${id_periodo}`)
                        .then(res => {})
                }
            }
          },
        }
    }
    </script>
    <style>
    .active-institucion {
        background-color: #007bff8a; /* Azul, o cualquier color que prefieras */
        color: rgb(2, 61, 138) !important;
        font-weight: bold !important;
    }

    .active-beneficiario {
        background-color: #dc354677; /* Rojo */
        color: rgb(173, 5, 5) !important;
        font-weight: bold !important;
    }

    .active-libros {
        background-color: #0ead3379; /* Verde */
        color: rgb(17, 109, 9) !important;
        font-weight: bold !important;
    }

    .active-convenios {
        background-color: #ffc107; /* Amarillo */
        color: white !important;
        font-weight: bold !important;
    }

    .active-anticipos {
        background-color: #343a4038; /* Gris oscuro */
        color: rgb(46, 46, 46) !important;
        font-weight: bold !important;
    }

    .active-verificaciones {
        background-color: #17a3b84d; /* Cian */
        font-weight: bold !important;
        color: rgb(5, 115, 122) !important;
    }

    .active-seguimiento {
        background-color: #28a7463f; /* Verde */
        color: rgb(11, 112, 8) !important;
        font-weight: bold !important;
    }

    .active-alcances {
        background-color: #fd770938; /* Amarillo */
        color: rgb(184, 101, 7) !important;
        font-weight: bold !important;
    }

    .active-resumen {
        background-color: #fd7709af; /* Amarillo */
        color: white !important;
        font-weight: bold !important;
    }

    .active-libros-obsequios {
        background-color: #dc354631; /* Rojo */
        font-weight: bold !important;
        color: rgb(156, 7, 7) !important;
    }
    .active-detalleCobro {
        background-color: #343a402a; /* Gris oscuro */
        font-weight: bold !important;
        color: rgb(44, 44, 44) !important;
    }
    .active-visualizar {
        background-color: #f0b86f42; /* Cian */
        font-weight: bold !important;
        color: rgb(197, 93, 7) !important;
    }

    .btn-small {
        padding: 4px 11px !important;
        font-size: 14.1px;
        height: auto !important;
        min-height: unset !important;
        height: 40px !important;
    }
    .active-pagare {
        background-color: #9b59b633;
        font-weight: bold !important;
        color: #6c3483 !important;
    }
    </style>
