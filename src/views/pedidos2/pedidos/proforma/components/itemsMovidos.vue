<template>
    <div>
        <vx-card>
            <vs-tabs>
                <vs-tab label="Notas Movidas a Pre Facturas" v-if="groupFacturador" @click="menu=0;">
                    <NotasMovidasVue :periodoSelect="periodoSelect"/>
                    <!-- <NotasMovidasAnterioresVue :periodoSelect="periodoSelect"/> -->
                </vs-tab>
                <vs-tab label="Saldos en Prefacturas a Notas" v-if="groupFacturador" @click="menu=1;">
                    <PrefacturasMovidasNotas :periodoSelect="periodoSelect"/>
                </vs-tab>
            </vs-tabs>
        </vx-card>
    </div>
    </template>

    <script>
    import {
        mapState
    } from "vuex";
    const NotasMovidasAnterioresVue = () => import('./notas/NotasMovidasAnteriores.vue')
    const PrefacturasMovidasNotas   = () => import('./prefacturas/listaMovimientoPrefacturas.vue')
    const NotasMovidasVue           = () => import('./notas/NotasMovidas.vue')
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
            NotasMovidasAnterioresVue,
            PrefacturasMovidasNotas,
            NotasMovidasVue
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
