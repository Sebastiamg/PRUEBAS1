<template>
<div>
    <!-- <div>
            <vs-row vs-justify="flex-start">
                <vs-col type="flex" vs-justify="flex-start" vs-align="flex-start" class="m-2" vs-w="12">
                    <vs-card class="pt-5 pl-5" >
                        <vs-row>
                            <vs-input class="w" @keyup.enter="getFacturaParametro()" icon-after="true" label-placeholder="icon-after" style="margin:0px 0px 20px 0px;" icon="search" placeholder="Buscar" v-model="busquedaxnombre" />
                            <vs-button color="warning" type="filled" style="margin-left:10px;" @click="getFacturaParametro();" icon="search"></vs-button>
                        </vs-row>
                        <vs-row>
                            <ul class="leftx" style="display:flex;margin:0px 0px 0px 20px;">
                                <li class="modelx">
                                </li>
                                <li style="margin:10px 10px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='documento'">Documento</vs-radio>
                                </li>
                                <li style="margin:10px 10px 0px 0px;">
                                    <vs-radio vs-name="radios1" vs-value="0" v-model="valorBusqueda" @input="busqueda='cliente'">Cliente</vs-radio>
                                </li>
                            </ul>
                        </vs-row>
                    </vs-card>
                </vs-col>
            </vs-row>
        </div> -->
    <div>
        <vs-table max-items="10" pagination search :data="arreglofacturas">
            <template slot="thead">
                <vs-th>Documento</vs-th>
                <vs-th>CI/RUC</vs-th>
                <vs-th>Fecha</vs-th>
                <vs-th>Sub. Total</vs-th>
                <vs-th>Total</vs-th>
                <!-- <vs-th>Acciones</vs-th> -->
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>{{ tr.ven_codigo }}</vs-td>
                    <vs-td>{{ tr.ruc_cliente}}</vs-td>
                    <vs-td>{{ tr.ven_fecha }}</vs-td>
                    <vs-td>{{ tr.ven_subtotal }}</vs-td>
                    <vs-td>{{ tr.ven_valor }}</vs-td>
                    <!-- <vs-td :data="data[indextr].ven_codigo">
                            <vs-dropdown vs-custom-content vs-trigger-click title="Opciones">
                                <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                <vs-dropdown-menu style="width: 250px;" class="cursor">
                                    <vs-dropdown-item>
                                        <vs-button color="#28C76F" type="line" class="w-full" @click="popupRetencion=true; arregloaFactura=tr; getRetencion(tr)">Generar Retención</vs-button>
                                    </vs-dropdown-item>
                                </vs-dropdown-menu>
                            </vs-dropdown>
                        </vs-td> -->
                </vs-tr>
            </template>
        </vs-table>
    </div>
    <div>
        <vs-popup :title="`Aplicar Retención a ${arregloaFactura.ven_codigo}`" :active.sync="popupRetencion">
            <vs-row>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <div>Fecha Retención:</div>
                            <flat-pickr :config="configdateTimePicker" v-model="tabRetencion.fechaRetencion" placeholder="Fecha de cobro" style="display: inline-block;width: 100%" />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <font style="font-size: 11.5px">Retencion de Retención:</font><br>
                            <v-select :options="porcentajeRetencion" :reduce="(porcentajeRetencion) => porcentajeRetencion.value" label="text" value="value" class="w-full h-100" placeholder="--Seleccione--" v-model="tabRetencion.porcentajeRetencion" />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <vs-row>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <div>N° de Documento:</div>
                            <vs-input type="text" class="inputx w-full mb-6" v-model="tabRetencion.documento" placeholder="Numero de documento" @keypress="validateInput" @paste="validatePaste" min="0" readonly />
                        </vs-col>
                    </vs-row>
                </vs-col>
                <vs-col vs-justify="center" vs-align="center" vs-lg="6" vs-sm="12" vs-xs="12">
                    <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                        <vs-col vs-justify="center" vs-align="center" vs-w="10">
                            <div class="mb-2">Valor Retención:</div>
                            <vs-input type="number" class="inputx w-full mb-6" v-model="tabRetencion.valor" placeholder="Valor Chueque" readonly />
                        </vs-col>
                    </vs-row>
                </vs-col>
            </vs-row>
            <br><br>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
                <vs-button @click="guardarRetencion()" type="relief">Guardar</vs-button>&emsp;
                <vs-button @click="popupRetencion=false" color="danger" type="relief">Cancelar</vs-button>
            </vs-col>
            <!-- <pre>{{ arregloaFactura }}</pre> -->
        </vs-popup>
    </div>
</div>
</template>

    
<script>
import vSelect from "vue-select";
import flatPickr from 'vue-flatpickr-component';
export default {
    components: {
        "v-select": vSelect,
        flatPickr,
    },
    data() {
        return {
            arregloaFactura: [],
            popupRetencion: false,
            porcentajeRetencion: [{
                    text: '--Seleccione--',
                    value: null
                },
                {
                    text: '0.75 %',
                    value: 0.75
                },
                {
                    text: '1 %',
                    value: 1
                },
                {
                    text: '1.75 %',
                    value: 1.75
                },
                {
                    text: '2 %',
                    value: 2
                },
                {
                    text: '2.75 %',
                    value: 2.75
                },
                {
                    text: '3 %',
                    value: 3
                },
                {
                    text: '10 %',
                    value: 10
                },
            ],
            tabRetencion: {
                fechaRetencion: '',
                porcentajeRetencion: '',
                documento: '',
                valor: '',
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            usuario: [],
            // instituion: '',
            periodo: '',

        };
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    props: {
        arreglofacturas: {
            type: [Object, Array],
            default: {},
        },
        periodoPuntosOInstitucion: {
            type: Number,
            default: 20,
        },
        // institucionPuntosOInstitucion: {
        //     type: Number,
        //     default: 0,
        // }
    },
    mounted() {
        let me = this;
        // me.instituion = me.institucionPuntosOInstitucion;
        me.periodo = me.periodoPuntosOInstitucion;
    },
    computed: {

    },
    methods: {
        validateInput(event) {
            const charCode = event.which ? event.which : event.keyCode;
            if ((charCode < 48 || charCode > 57) && charCode !== 44 && charCode !== 46) {
                event.preventDefault();
            }
        },
        validatePaste(event) {
            const clipboardData = event.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData('text/plain');
            const numbersOnly = pastedText.replace(/[^\d]/g, '');
            document.execCommand("insertText", false, numbersOnly);
            event.preventDefault();
        },
        getRetencion() {
            let me = this;
            me.tabRetencion.porcentajeRetencion = '';
            me.tabRetencion.documento = me.arregloaFactura.ven_codigo
            me.tabRetencion.valor = me.arregloaFactura.ven_valor
            me.tabRetencion.fechaRetencion = new Date().toISOString().substr(0, 10);
            me.popupRetencion = true;

        },
        guardarRetencion() {
            let me = this;
            if (!me.tabRetencion.porcentajeRetencion) {
                me.$vs.notify({
                    text: 'No a ingresado la retencion',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            let formData = new FormData();
            formData.append("abono_fecha", me.tabRetencion.fechaRetencion);
            formData.append("abono_porcentaje", me.tabRetencion.porcentajeRetencion);
            formData.append("abono_documento", me.tabRetencion.documento);
            formData.append("abono_valor_retencion", me.tabRetencion.valor);
            formData.append("abono_tipo", 3);
            // formData.append('abono_institucion', me.instituion);
            formData.append('abono_periodo', me.periodo);
            // formData.append("institucion", me.institucionPuntosOInstitucion);
            formData.append("periodo", me.periodoPuntosOInstitucion);
            formData.append('user_created', me.usuario.idusuario);
            me.$vs.loading();
            this.$http.post(this.$server_url + 'retencion_registro', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.$vs.loading.close();
                    } else {
                        me.$vs.notify({
                            text: 'Se guardó correctamente',
                            color: 'primary',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.popupRetencion = false
                        me.$vs.loading.close();
                        this.actualizarDatosAbono();
                    }
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: error.response.data.message, // Aquí usamos error en lugar de res
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close();
                });
        },
    }
};
</script>
