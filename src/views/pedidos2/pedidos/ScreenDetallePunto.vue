<template>
    <div>
      <!--DETALLE AGRUPADO-->
      <div>
        <vs-list>
          <div class="flex mr-5" style="flex-wrap: wrap;">
            <div>
              <b>Nombre Grupo</b>
              <p>{{ sendPuntos.ca_descripcion }}</p>
            </div>
            <div class="ml-8">
              <b>Codigo Grupo</b>
              <p>{{ sendPuntos.ca_codigo_agrupado }}</p>
            </div>
            <div class="ml-8">
              <b>Fecha creación:</b>
              <p>{{ datofecha }}</p>
            </div>
            <div class="ml-8">
              <b>Tipo de venta:</b>
              <p>{{ sendPuntos.ca_tipo_pedido == 2 ? 'Venta Lista' : 'Venta Directa' }}</p>
            </div>
          </div>
        </vs-list>
      </div>
      <div>
        <vs-row vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" vs-type="flex" class="m-2">
          <span class="ml-3 mt-3 font-bold">{{sendPuntos.nombreDespacho}}</span>
        </vs-row>
      </div>
      <!--MENU-->
      <div class="flex" style="flex-wrap:wrap;">
          <vs-button line-position="top" type="line" color="primary"  @click="menu = 0;" :class="{ 'active-button-primary': menu === 0 }">Información</vs-button>
          <vs-button line-position="top" type="line" color="success"  @click="menu = 1;" v-if="verificarcontrato>0" :class="{ 'active-button-success': menu === 1 }">Pre - Proformas</vs-button>
          <vs-button line-position="top" type="line" color="dark"     @click="menu = 2;" v-if="verificarcontrato>0" :class="{ 'active-button-dark': menu === 2 }">Documentos de ventas</vs-button>
          <vs-button line-position="top" type="line" color="warning"  @click="menu = 3;" v-if="verificarcontrato>0" :class="{ 'active-button-warning': menu === 3 }">Resumen Ventas</vs-button>
          <!-- <vs-button line-position="top" type="line" color="danger"   @click="menu = 4;" v-if="verificarcontrato>0" :class="{ 'active-button-danger': menu === 4 }"><i class="fa-solid fa-users"></i> Asignar agrupado a clientes</vs-button> -->
          <vs-button line-position="top" type="line" color="danger"   @click="menu = 4;" v-if="verificarcontrato>0" :class="{ 'active-button-danger': menu === 4 }"><i class="fa-solid fa-users"></i> Clientes del agrupado</vs-button>
      </div>
      <!--VENTA REAL Revisión-->
      <!--COMPONENTES-->
      <div v-if="menu == 0">
          <Screeninformacion @changeSend="changeSend" />
      </div>
      <!--proformas-->
      <div v-if="menu == 1">
          <screenProforma />
      </div>
      <!--documentos facturados-->
      <div v-if="menu == 2">
          <documentoventaVue />
      </div>
      <!--Resumen de ventas-->
      <div v-if="menu == 3">
        <ventaVue />
      </div>
      <!--asignar agrupado a clientes-->
      <div v-if="menu == 4">
        <!-- <lista_agrupadosVue :sendPuntos="sendPuntos" :desdeAgrupado="Number(1)"/> -->
        <cliente_agrupadosVue :sendPuntos="sendPuntos"/>
      </div>
    </div>
    </template>

    <script>
    import {
        mapState
    } from "vuex";
    const Screeninformacion       = () => import('./institucion/ScreenInformacion.vue')
    const screenProforma          = () => import('./proforma/ScreenProforma.vue')
    const documentoventaVue       = () => import('./proforma/DocumentosVenta.vue')
    const ventaVue                = () => import('./proforma/venta.vue')
    const lista_agrupadosVue      = () => import('../../facturacion/10_10_1_4/Facturacion/Contrato_Usuario_Agrupado/lista_agrupados.vue')
    const cliente_agrupadosVue    = () => import('./proforma/clienteAgrupado.vue')
    export default {
        components: {
            Screeninformacion,
            screenProforma,
            documentoventaVue,
            ventaVue,
            lista_agrupadosVue,
            cliente_agrupadosVue,
        },
        data() {
            return {
                menu: 0,
                con: '',
                sendPuntos: '',
                verificarcontrato:0,
                datofecha: '',

            }
        },
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPuntos', 'groupFacturador', 'userAsesor']),
        },
        watch: {
            ObjectPuntos(results) {
                let me = this
                me.sendPuntos = me.ObjectPuntos
            },
        },
        mounted() {
            let me = this;
            me.sendPuntos = me.ObjectPuntos;
            me.datofecha = me.sendPuntos.datoAgrupado[0].created_at;
        },
        methods: {
          showPedido(){
            let me = this
            let recuperarqueso = localStorage.menuSeleccionado
            me.$emit('showPedido',0,recuperarqueso)
          },
            changeSend(e) {
                let me = this
                console.log(e);
                me.verificarcontrato=e;
            }
        }
    }
    </script>
<style>
.active-button-primary {
  border-color: #007bff !important; 
  background-color: #e0f7ff !important;
  color: #007bff !important; 
}

.active-button-success {
  border-color: #28a745 !important;
  background-color: #d4edda !important;
  color: #28a745 !important;
}

.active-button-dark {
  border-color: #343a40 !important;
  background-color: #d6d6d6 !important;
  color: #343a40 !important;
}

.active-button-warning {
  border-color: #ffc107 !important;
  background-color: #fff3cd !important; 
  color: #ffc107 !important;
}

.active-button-danger {
  border-color: #dc3545 !important;
  background-color: #f8d7da !important; 
  color: #dc3545 !important; 
}
</style>

