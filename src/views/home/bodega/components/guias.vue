<template>
    <div>
        <vx-card>
            <vs-tabs>
                <vs-tab label="Listado de guias" v-if="usuario.id_group == 23 || usuario.id_group == 22 || usuario.id_group == 17 || usuario.id_group == 27 ||  userRoot == true">
                    <div class="mt-3">
                        <div v-if="menu == 0">
                            <!-- <vs-button color="warning" @click="popupPeriodos = true" icon="add" icon-after type="filled">Crear solicitud guias</vs-button> -->
                            <vs-divider></vs-divider>
                            <listadoGuiasFacturadorVue class="mt-5" @showPedido="showPedido"/>
                        </div>
                        <div v-if="menu == 1">
                            <vs-button color="warning" @click="menu = 0;"  icon-after type="line">◄ Regresar</vs-button>
                            <vs-divider></vs-divider>
                            <pedidosGuiasVue/>
                        </div>
                    </div>
                </vs-tab>
                <vs-tab label="Devoluciones - guias">
                    <BodegaListadoDevolucionesVue />
                </vs-tab>
                <!-- <vs-tab label="Solicitar devolución - guias">
                    <div class="mt-2">
                        <p>Seleccione período para trabajar con las devoluciones</p>
                        <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelect" />
                    </div>
                    <br>
                    <ScreenDevolucionGuiasVue :periodoBodega="periodoSelect.idperiodoescolar" v-if="workPeriodo" class="mt-4"/>
                    <br><br><br><br>
                </vs-tab> -->
            </vs-tabs>
        </vx-card>
        <!--MODALES-->
        <!--Modal para seleccionar periodo para las guias-->
        <vs-popup class="holamundo" title="Seleccione un período para realiza solicitud de guias" :active.sync="popupPeriodos">
            <div>
                <p>Seleccione periodo</p>
                <v-select :options="arregloPeriodos" :reduce="arregloPeriodos => arregloPeriodos" label="periodoescolar" class="w-full" v-model="periodoSelect" />
            </div>
            <div class="flex justify-center mt-5">
                <vs-button class="mr-3 mb-2" @click="goToGuias()">Generar solicitud</vs-button>
                <vs-button color="warning" type="border" class="mb-2" @click="popupPeriodos = false;">Cancelar</vs-button>
            </div>
        </vs-popup>
    </div>
    </template>

    <script>
    const listadoGuiasFacturadorVue     = () => import('../../../pedidos/components/Guias/guiasFacturador/listadoGuiasFacturador.vue')
    const ListadoLibrosBodega           = () => import('../../../pedidos/listadoLibrosBodega.vue')
    const BodegaListadoDevolucionesVue  = () => import('../../../pedidos/bodega/BodegaListadoDevoluciones.vue')
    const ScreenDevolucionGuiasVue      = () => import('../../../pedidos/components/Guias/devolucionGuias/ScreenDevolucionGuias.vue')
    const pedidosGuiasVue               = () => import('../../../pedidos/components/Guias/pedidos.vue')
    import vSelect from 'vue-select'
    export default {
        components: {
            ListadoLibrosBodega,
            BodegaListadoDevolucionesVue,
            listadoGuiasFacturadorVue,
            vSelect,
            ScreenDevolucionGuiasVue,
            pedidosGuiasVue
        },
        data() {
            return {
                usuario:[],
                arregloPeriodos:[],
                popupPeriodos:false,
                periodoSelect:'',
                workPeriodo:false,
                menu:0,
            };
        },
        created(){
            let me = this;
            let usuarioJSON = localStorage.getItem("usuario");
            if (usuarioJSON !== null) {
                me.usuario = JSON.parse(usuarioJSON);
            }
        },
        mounted() {
            let me = this
            me.getPeriodos()
        },
        watch:{
            periodoSelect(results){
                let me = this
                if(results == "" || results == null || results == undefined || results == "null"){
                    me.workPeriodo = false
                }else{
                    me.workPeriodo = true
                }
            },
        },
        methods: {
            showPedido(e){
                let me = this;
                me.menu = e
            },
            getPeriodos(){
                let me = this
                this.$http.get(this.$server_url+'get_periodos_pedidos')
                .then(res => {
                    let datos = res.data
                    if(datos.length == 0){
                        me.periodos = []
                    }
                    if( me.usuario.id_group == 22 || me.usuario.id_group == 23 || me.usuario.id_group == 1 ){
                        me.arregloPeriodos = datos.filter(p => p.pedido_facturacion == 1)
                    }
                    if( me.usuario.id_group == 17 || me.usuario.id_group == 27 ){
                        me.arregloPeriodos = datos.filter(p => p.pedido_bodega == 1)
                    }
                    if( me.usuario.id_group == 11 || me.usuario.id_group == 11 ){
                        me.arregloPeriodos = datos.filter(p => p.pedido_asesor == 1)
                    }
                })
            },
            goToGuias(){
                let me = this;
                if(me.periodoSelect == "" || me.periodoSelect == null || me.periodoSelect == undefined){
                    me.$vs.notify({
                    text:'Seleccione un periodo por favor',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return
                }
                me.popupPeriodos = false;
                //buscar periodo sierra asignado a bodega
                // localStorage.id_pedido = ''
                localStorage.setItem("id_periodo_selected", this.periodoSelect.idperiodoescolar)
                localStorage.setItem("nombre_periodo_selected", this.periodoSelect.periodoescolar)
                let datos = {
                    id_pedido:0,
                }
                this.$store.dispatch('setGuia',datos)
                me.menu = 1
                // this.$router.push('/pedidos/guias/bodega/0')
            },
        },

    }
</script>
