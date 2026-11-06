<template>
    <div>
        <vx-card class="mt-5" :title='"CLIENTES DEL AGRUPADO " + sendPuntos.ca_codigo_agrupado'>
            <template v-if="arraycliente.length > 0">
                <vs-list  v-for="(cliente, index) in arraycliente" :key="index">
                    <vs-list-header :title="cliente.nombres"></vs-list-header>
                    <vs-list-item :title="cliente.cedula" :subtitle="cliente.email">
                        <!-- <template slot="avatar">
                            <vs-avatar />
                        </template> -->
                        <vs-button color="success" type="gradient" @click="arrayInfo=cliente;popupClienteInfo=true;">Detalle del Cliente </vs-button>
                    </vs-list-item>
                </vs-list>
            </template>
            <template v-else>
                <vs-alert color="danger" active="true" class="mt-5" icon-pack="feather" icon="icon-alert-triangle">
                    No hay <b>Registros</b>  realizados a este cliente.
                </vs-alert>
            </template>
        </vx-card>
        <vs-popup class="crear" title="Información del cliente" :active.sync="popupClienteInfo">
            <vs-row>         
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <div>
                                <span style="font-size: 15px;">Nombres y Apellidos :</span>
                            </div>
                            <div>
                                <b style="font-size: 15px;">{{ arrayInfo.nombres }}</b>
                            </div>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <div>
                                <span style="font-size: 15px;">CI / RUC :</span>
                            </div>
                            <div>
                                <b style="font-size: 15px;">{{ arrayInfo.cedula }}</b>
                            </div>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <div>
                                <span style="font-size: 15px;">Nombre de usuario :</span>
                            </div>
                            <div>
                                <b style="font-size: 15px;">{{ arrayInfo.name_usuario }}</b>
                            </div>
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <div>
                                <span style="font-size: 15px;">Correo :</span>
                            </div>
                            <div>
                                <b style="font-size: 15px;">{{ arrayInfo.email }}</b>
                            </div>
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="popupClienteInfo=false;" color="danger" type="relief">Volver</vs-button>
            </vs-col>
        </vs-popup>
    </div>
    </template>
    
    <script>
    export default {
        data() {
            return {
                datoAgrupado: [],
                arraycliente: [],
                arrayInfo: [],
                popupClienteInfo: false,
            };
        },
        props: {
            sendPuntos: {
                type: [Object, Array],
                default: {},
            }
        },
        components: {},
        mounted() {
            let me = this;
            this.datoAgrupado= me.sendPuntos;
            this.InfoClienteAgrupado();
        },
        computed: {
    
        },
        methods: {
            InfoClienteAgrupado() {
                let me = this;
                this.$vs.loading();
                this.$http.get(this.$server_url + 'InfoClienteAgrupado/' + me.sendPuntos.ca_codigo_agrupado +'/'+me.sendPuntos.id_periodo)
                    .then(res => {
                        let datos = res.data;
                        me.arraycliente = datos;
                        this.$vs.loading.close();
                    })
                    .catch(function (error) {
                        console.log(error + ' error');
                        me.$vs.loading.close();
                    });
            }
        }
    };
    </script>
    