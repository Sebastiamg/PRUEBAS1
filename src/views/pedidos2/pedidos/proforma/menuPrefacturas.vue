<template>
    <div>
        <vx-card>
            <vs-tabs>
                <vs-tab label="Reporte Pre-Facturas" v-if="groupFacturador && !usarComponenteNuevo" @click="menu=0;">
                    <listadoPreFacturas :periodoSelect="periodoSelect"/>
                </vs-tab>
                <vs-tab label="Busqueda de Pre-Facturas" v-if="groupFacturador" @click="menu=1;">
                    <BuscadorPrefacturas :periodoSelect="periodoSelect"/>
                </vs-tab>
                <vs-tab label="Desfase en saldos facturados" v-if="groupFacturador && !usarComponenteNuevo" @click="menu=2;">
                    <vs-alert active>
                        <i class="fa-solid fa-triangle-exclamation"></i> Muestra el listado de saldos que han sido facturados en exceso.
                    </vs-alert>
                    <vs-tabs>
                        <vs-tab label="Prolipa">
                            <desfasFacturacion :periodoSelect="periodoSelect" :empresa="1"/>
                        </vs-tab>
                        <vs-tab label="Calmed">
                            <desfasFacturacion :periodoSelect="periodoSelect" :empresa="3"/>
                        </vs-tab>
                    </vs-tabs>
                </vs-tab>
                <vs-tab label="Saldos facturados" v-if="userRoot && !usarComponenteNuevo" @click="menu=3;">
                    <vs-alert active>
                        <i class="fa-solid fa-triangle-exclamation"></i> Muestra el listado de saldos pendientes de facturar.
                    </vs-alert>
                    <vs-tabs>
                        <vs-tab label="Prolipa">
                            <Facturacion :periodoSelect="periodoSelect" :empresa="1"/>
                        </vs-tab>
                        <vs-tab label="Calmed">
                            <Facturacion :periodoSelect="periodoSelect" :empresa="3"/>
                        </vs-tab>
                    </vs-tabs>
                </vs-tab>
                <vs-tab label="Movimientos entre Documentos" v-if="groupFacturador && !usarComponenteNuevo" @click="menu = 4;">

                </vs-tab>
            </vs-tabs>
            <!--COMPONENTES-->
            <div v-if="menu == 4">
                <ItemsMovidos :periodoSelect="periodoSelect"/>
            </div>
        </vx-card>
    </div>
    </template>

    <script>
    import {
        mapState
    } from "vuex";
    const listadoPreFacturas            = () => import('./screen_listadoPreFacturas.vue')
    const BuscadorPrefacturas = () => import("./preFacturas.vue");
    const desfasFacturacion = () => import("./desfasFacturacion.vue");
    const Facturacion = () => import("./Facturacion.vue");
    const ItemsMovidos = () => import('./components/itemsMovidos.vue')
    export default {
        data() {
            return {
                menu:5,
            };
        },
        mounted() {},
        methods: {},
        //PARA DAR PERMISOS MODIFICAMOS EL Main.vue, state.js, actions.js, mutations-js
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega','groupFacturador']),
        },
        components: {
            listadoPreFacturas,
            BuscadorPrefacturas,
            desfasFacturacion,
            Facturacion,
            ItemsMovidos,
        },
        props:{
          periodoSelect:{
            type:Object,
            default:function(){
              return{}
            }
          },
          usarComponenteNuevo:{
            type:Boolean,
            default:false
          }
        }
    };
    </script>
