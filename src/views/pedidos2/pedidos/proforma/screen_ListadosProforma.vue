<template>
    <div>
        <vx-card>
            <vs-tabs>
                <vs-tab label="Pre-Facturas enviar a PERSEO" v-if="groupFacturador">
                    <ScreenPrefacturasVue :periodoSelect="periodoSelect"/>
                </vs-tab>
                <vs-tab label="Listado Pre-Proformas" v-if="groupFacturador">
                    <ListadoPreproforma :periodoSelect="periodoSelect"/>
                </vs-tab>
                <vs-tab label="Busqueda de  Pre-Facturas" v-if="groupFacturador">
                    <ListadoPrefacturas :periodoSelect="periodoSelect"/>
                </vs-tab>
            </vs-tabs>
        </vx-card>
    </div>
    </template>

    <script>
    import {
        mapState
    } from "vuex";
    const ListadoPreproforma = () => import("./ListadosProformaGeneral.vue");
    const ScreenPrefacturasVue  = () => import('./components/prefacturas/ScreenPrefacturas.vue');
    const ListadoPrefacturas = () => import("./preFacturas.vue");
    export default {
        data() {
            return {};
        },
        mounted() {},
        methods: {},
        //PARA DAR PERMISOS MODIFICAMOS EL Main.vue, state.js, actions.js, mutations-js
        computed: {
            ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega','groupFacturador']),
        },
        components: {
            ListadoPreproforma,
            ListadoPrefacturas,
            ScreenPrefacturasVue,
        },
        props:{
          periodoSelect:{
            type:Object,
            default:function(){
              return{}
            }
          }
        }
    };
    </script>
