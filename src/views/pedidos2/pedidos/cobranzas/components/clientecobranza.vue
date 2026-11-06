<template>
<div>
    <div v-if="listaUsuarios.length>0">
        <vx-card class="mt-4" fixed-height="true" :title="'Informacion Cliente de '+ InsticionCobranza.nombreInstitucion">
            <div v-for="(datos, index) in listaUsuarios" :key="index">
                <div>
                    <vs-chip>Cliente: {{ index+1 }}</vs-chip>
                </div>
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <div>Nombres:</div>
                                <vs-input type="text" class="inputx w-full mb-6" :value="datos.nombres +' '+ datos.apellidos" placeholder="Numero Documento" disabled />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                    <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                        <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                            <vs-col vs-justify="center" vs-align="center" vs-w="10">
                                <div>N° Cedula / Ruc:</div>
                                <vs-input type="text" class="inputx w-full mb-6" :value="datos.cedula" placeholder="Numero Documento" readonly />
                            </vs-col>
                        </vs-row>
                    </vs-col>
                </vs-row>
            </div>
        </vx-card>
    </div>
    <div v-else>
        <center>
            <h2 class="text-danger">Sin clientes</h2>
            <img width="100" style="margin-top: 25px;" src="https://cdn-icons-png.flaticon.com/512/3593/3593735.png" alt="">
        </center>
    </div>
</div>
</template>

<script>
import vSelect from "vue-select";

export default {
    components: {
        "v-select": vSelect,
    },
    data() {
        return {
            datoInsticionCobranza: [],
            espunto: [],
            listaUsuarios: [],
        };
    },
    props: {
        InsticionCobranza: {
            type: Object,
            default: {}
        },
        predioSeleccionado: {
            type: Number,
            default: 0
        },
    },
    computed: {},
    watch: {
        busquedaCliente(value) {
            this.busquedaClienteTouched = true;
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
        let me = this;
        me.datoInsticionCobranza = me.InsticionCobranza;
        if (me.datoInsticionCobranza.punto_venta == 0) {
            console.log("es institucion");
        } else if (me.datoInsticionCobranza.punto_venta == 1) {
            console.log("es punto de venta");
        }
        me.getInformacionClienteCobranza()

    },
    methods: {
        getInformacionClienteCobranza() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'getClienteCobranzaxInstitucion?institucion=' + me.datoInsticionCobranza.idInstitucion + '&periodo=' + me.predioSeleccionado)
                .then(res => {
                    me.listaUsuarios = res.data;
                    me.$vs.loading.close();

                })
                .catch(err => {
                    console.error(err);
                    me.$vs.loading.close();
                });
        },

    }
}
</script>
