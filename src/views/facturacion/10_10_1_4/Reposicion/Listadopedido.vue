<template>
    <!--TABLA-->
    <div>
        <!-- <vs-col v-if="menu==1" vs-w="12" class="mt-2 m-3" >
            <vs-chip color="#24c1a0" >
                {{nombre}}
            </vs-chip>
        </vs-col> -->
        <div v-if="menu==0" >
            <vs-col vs-w="12" class="mt-2 m-3" >
            <!-- <vs-table max-items="20" search :data="pedidos" pagination>
                <template slot="header">
                    <vs-chip color="primary" class="ml-1">Cantidad: {{pedidos.length}}</vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>#</vs-th>
                    <vs-th >Identificador</vs-th>
                    <vs-th>Detalles</vs-th>
                    <vs-th>Descripción</vs-th>
                    <vs-th>Accion</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="k" v-for="(tr, k) in data">
                        <vs-td>
                            <b>{{ k + 1 }}</b>
                        </vs-td>
                        <vs-td>
                            <b>Id: </b><span>{{ tr.ca_codigo_agrupado }} </span><br/>
                            <b>Período: </b><span>{{ tr.id_periodo }} </span>
                        </vs-td>
                        <vs-td>
                            <span v-if="tr.ca_tipo_pedido==1">Directa </span>
                            <span v-if="tr.ca_tipo_pedido==2">Por Lista </span>
                        </vs-td>
                        <vs-td>
                            <span >{{tr.ca_descripcion}} </span>
                        </vs-td>
                        <vs-td align="center">
                            <vs-button color="rgb(59,222,200)" type="line" class="w-full" @click="ver_pedido(tr);setNumeroMenu(3); menu=1">Venta</vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table> -->
        </vs-col>
        </div>
        <!-- <div v-if="menu !=1">
            <vs-button type="line" @click="menu = 0;" class="p-3 m-3">◄ Regresar</vs-button>
        </div> -->
        <div v-if="menu==1 && cargado">
            <div class="mt-2 m-3">
                <vs-chip color="#24c1a0" >
                    {{nombre}}
                </vs-chip>
            </div>            
            <listadoAgrupado :info="info" @recharge="cargarDatos" />
        </div>
    </div>
    </template>

    <script>
    import {
        mapState
    } from "vuex";

    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import vSelect from 'vue-select';
    const listadoAgrupado = () => import("./listadoAgrupadosLibreria.vue");

    export default {
        components: {
            vSelect,
            listadoAgrupado,
        },
        data() {
            return {
                menu: 1,
                info: [],
                pedidos: [],
                usuario: '',
                id_institucion: '',
                id_periodo: '',
                nombre: '',
                cargado:false,
            }
        },
        created() {
            let me = this
            const usuariorespo = localStorage.getItem("usuario");
            me.usuario = JSON.parse(usuariorespo);
            me.id_periodo = localStorage.getItem("periodo_id");
            me.nombre =localStorage.getItem("nombreInstitucion");

        },
        mounted() {
            let me = this;
            const usuariorespo = localStorage.getItem("usuario");
            me.usuario = JSON.parse(usuariorespo);
            me.id_periodo = localStorage.getItem("periodo_id");
            me.nombre =localStorage.getItem("nombreInstitucion");
            // me.getpedidos();
            me.getproformas();


        },
        computed: {},
        methods: {
            cargarDatos() {
                this.getproformas();
            },
            ver_pedido(item) {
                let me = this;
                me.info = item;
            },
            setNumeroMenu(m) {
                localStorage.setMenu = m
            },
            getproformas(){
                let me = this;
                me.pedidos = [];
                me.$http.get(me.$server_url + "Get_proformasCliente?usuario=" + me.usuario.idusuario)
                    .then(function (res) {
                        me.pedidos = res.data;
                        me.info = res.data;
                        if (me.pedidos.length == 0) {
                            me.$vs.notify({
                                text: 'No hay pedidos realizados o entregas asignadas.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        }
                        me.cargado=true;
                    })
                    .catch(function (error) {
                        console.error('Error al obtener pedidos:', error);
                    });
            },
            getpedidos() {
                let me = this;
                me.pedidos = [];
                me.$http.get(me.$server_url + "Get_pedidoSolicitud?usuario=" + me.usuario.idusuario)
                    .then(function (res) {
                        me.pedidos = res.data;
                        if (me.pedidos.length == 0) {
                            me.$vs.notify({
                                text: 'No hay pedidos realizados o entregas asignadas.',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            });
                        }
                    })
                    .catch(function (error) {
                        console.error('Error al obtener pedidos:', error);
                        // Aquí puedes manejar el error de acuerdo a tus necesidades
                    });
            },

        }
    }
    </script>

    <style lang="scss" scoped>
    .header-sidebar {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100%;

        h4 {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;

            >button {
                margin-left: 10px;
            }
        }
    }

    .active {
        font-weight: bold;
        color: #269CE3;
        background-color: #F0F5F9;
        padding: 2px 0px;
        border-radius: 5px;
    }

    .menutitle {
        font-weight: bold;
        font-size: 17px;
    }

    .submenu {
        display: flex;
        flex-direction: column;
        margin-top: 5px;
    }

    .submenutitle {
        padding: 5px 0px;
        margin-top: 8px;
        cursor: pointer;
        transition: 0.2s ease-in all;
        font-size: 12px;
    }

    .submenutitle:hover {
        text-decoration: underline;
        color: #41A7E5;
    }

    .fade-in {
        opacity: 1;
        animation-name: fadeInOpacity;
        animation-iteration-count: 1;
        animation-timing-function: ease-in;
        animation-duration: 0.2s;
    }

    @keyframes fadeInOpacity {
        0% {
            opacity: 0;
        }

        50% {
            opacity: 0.7;
        }

        100% {
            opacity: 1;
        }
    }
    </style>
