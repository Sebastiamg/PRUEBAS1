<template>
<div>
    <div>
        <!--LISTADO EMPAQUE-->
        <div v-if="menu == 0">
            <br>
            <small class="font-medium ml-6">Filtro de Empacado Pendientes:</small>
            <div class="flex" v-if="valorBusqueda==1">
                <flat-pickr @input="ValidateRadioEmpaque();" :config="configdateTimePicker" v-model="fecha" placeholder="Fecha" class="m-1" style="display: inline-block;width: 100%;" />
                <vs-button icon="search" @click="ValidateRadioEmpaque();" class="p-3">Buscar</vs-button>
            </div>
            <div>
                <ul class="leftx" style="display: flex; margin: 0px 0px 0px 20px">
                    <li class="modelx"></li>
                    <li style="margin: 10px 10px 0px 0px">
                        <vs-radio vs-name="radios2" vs-value="0" v-model="valorBusqueda" @change="ValidateRadioEmpaque()">Pendientes</vs-radio>
                    </li>
                    <li style="margin: 10px 10px 0px 0px">
                        <vs-radio vs-name="radios2" vs-value="1" v-model="valorBusqueda" @change="ValidateRadioEmpaque()">Buscar Pendientes por fecha</vs-radio>
                    </li>
                </ul>
            </div>
            <EmpacarListadoVue @changeCreate="changeCreate" :arrayEmpaques="arrayEmpaques" @change="change" />
        </div>
        <!--CREAR EMPAQUE-->
        <div v-if="menu == 1">
            <vs-button type="line" class="mt-2" @click="menu = 0;" @changeHandle="changeHandle">← Regresar</vs-button>
            <EmpacarCrearVue :opcion="opcion" @change="change" />
        </div>
    </div>
</div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import moment from "moment";
const EmpacarListadoVue = () => import('./EmpacarListado.vue')
const EmpacarCrearVue = () => import('./EmpacarCrear.vue');
export default {
    components: {
        flatPickr,
        EmpacarCrearVue,
        EmpacarListadoVue,
    },
    data() {
        return {
            menu: 0,
            opcion: '',
            arrayEmpaques: [],
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d',                
                onChange: this.onDateChange,
            },
            fecha: null,
            valorBusqueda:0,
        }
    },
    created() {
        let me = this
        me.getEmpaquesPendientes()
    },
    mounted() {
        let me = this
        me.fecha = moment();
        // Agregar el día
        me.fecha = me.fecha.format('YYYY-MM-DD');
    },
    methods: {
        onDateChange(selectedDates, dateStr, instance) {
            instance.close();
        },
        ValidateRadioEmpaque(){
            let me = this
            if(this.valorBusqueda === "0"){
                this.getEmpaquesPendientes()
            }else if(me.valorBusqueda === "1"){
                me.getEmpaquesXFecha()
            }
        },
        change(e) {
            let me = this;
            me.menu = 0;
            me.arrayEmpaques = [];
            me.ValidateRadioEmpaque()
            // if (e == true) {
            //     me.menu = 0;
            //     me.arrayEmpaques = [];
            //     me.getEmpaquesPendientes();
            // }
        },
        change1(e) {
            let me = this;
            me.menu = 0;
            me.arrayEmpaques = [];
            me.ValidateRadioEmpaque()
            // if (e == true) {
            //     me.menu = 0;
            //     me.arrayEmpaques = [];
            //     me.getEmpaquesXFecha();
            // }
        },
        changeHandle(e) {
            let me = this
            me.menu = 0
            me.getEmpaquesXFecha()
        },
        changeCreate(e) {
            let me = this;
            console.log(e);
            me.menu = e[0].menu;
            me.opcion = e[0].op;
            console.log(me.menu);
            console.log(me.opcion);
        },
        getEmpaquesPendientes() {
            let me = this
            me.arrayEmpaques = []
            this.$vs.loading();
            this.$http.get(this.$server_url + `empaqueBodega?pendientes=1&todos=1`)
                .then(function (res) {
                    if (res.data.length == 0) {
                        me.$vs.notify({
                            text: `No se encontro resultado`,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    }
                    me.arrayEmpaques = res.data;
                    this.$vs.loading.close();
                })
                .catch((error) => {
                    // console.error(error);
                    this.$vs.loading.close();
                });
        },
        getEmpaquesXFecha() {
            let me = this
            me.arrayEmpaques = []
            if (me.fecha == null || me.fecha == "" || me.fecha == undefined) {
                return
            }
            this.$vs.loading();
            this.$http.get(this.$server_url + `empaqueBodega?pendientes=1&fecha=${me.fecha}`)
                .then(function (res) {
                    if (res.data.length == 0) {
                        me.$vs.notify({
                            text: `No se encontro resultado con la fecha ${me.fecha}`,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                    }
                    me.arrayEmpaques = res.data
                    this.$vs.loading.close();
                })
                .catch((error) => {
                    // console.error(error);
                    this.$vs.loading.close();
                });
        },
    }
}
</script>
