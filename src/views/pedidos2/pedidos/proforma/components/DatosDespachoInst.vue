<template>
<div>
    <div class="vx-row justify-center">
        <!--datos librerias -->
        <div class="vx-col w-full sm:w-full md:w-1/2 lg:w-1/2 xl:w-1/2">
            <!--libreria-->
            <div class="vx-col w-full">
                <span>Buscar cambio Punto de Despacho <small>(Presionar enter para buscar)</small>:</span>
                <vs-input v-model="busqueda.puntoVenta" @keypress.enter="searchData()" class="w-full" placeholder="Institucion / Punto de venta" />
            </div>
            <!--datos librerias -->
            <!-- <div v-if="datosSeleccionado.nombreInstitucion">
                <vs-list>
                    <vs-list-item icon="check" :title="'Libreria Seleccionada: '+datosSeleccionado.nombreInstitucion">
                        <div class="flex">
                            <vs-button @click="f_quitarPuntoVenta()" class="ml-2 p-3" color="#D39C5E" type="filled" icon-pack="feather" icon="icon-x">Quitar</vs-button>
                        </div>
                    </vs-list-item>
                </vs-list>
            </div> -->
        </div>
    </div>
    <div class="vx-row mt-2 justify-center">
        <!--tabla de busqueda punto de venta-->
        <div class="vx-col w-full sm:w-full md:w-3/4 lg:w-3/4 xl:w-3/4">
            <vs-table max-items="10" search pagination stripe :data="arrayPuntoVenta" v-if="arrayPuntoVenta.length > 0">
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b> {{ arrayPuntoVenta.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Nombre</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].nombreInstitucion}} <b v-if="tr.validate_pedidos==1">(Se está trabajando en este periodo)</b><br>
                            <span v-if="tr.representante">Asesor: {{tr.representante}} </span>
                        </vs-td>
                        <vs-td>
                            <vs-button @click="f_selectPuntoVenta(data[indextr])" class="ml-2 p-3" color="primary" type="filled" icon-pack="feather" icon="icon-check">Seleccionar</vs-button>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </div>
</div>
</template>

<script>
import vSelect from 'vue-select';
export default {
    components: {
        vSelect,
    },
    data() {
        return {
            usuario: localStorage.usuario ? JSON.parse(localStorage.usuario) : {},
            arrayPuntoVenta: [],
            busqueda: {
                cedula: '',
                puntoVenta: '',
            },
            claseLibreria: 'w-full',
            datosSeleccionado: {},
            institucion_id: 0,
        }
    },
    props: {
        id_periodo: {
            type: Number,
            default: 0
        },
        empresa: {
            type: [Object, String],
            default: () => ({})
        },
        soloInstitucion: {
            type: Boolean,
            default: false,
        },
        editData: {
            type: [Object, String],
            default: () => ({})
        },
    },
    mounted() {
        let me = this;
        me.datosSeleccionado = {
            nombreInstitucion: me.editData.nombreInstitucion,
            id_institucion: me.editData.id_institucion,
        }
    },
    methods: {
        searchData() {
            let me = this
            var url = ""
            if (me.busqueda.puntoVenta.length < 4) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Debe ingresar al menos 4 caracteres',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                })
                return
            }
            url = 'pedidos2/pedidos?getDatosPuntosVenta=1&busqueda=' + me.busqueda.puntoVenta + '&id_periodo=' + me.id_periodo
            me.$vs.loading()
            this.$http.get(this.$server_url + url)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arrayPuntoVenta = res.data
                    if (me.arrayPuntoVenta.length == 0) {
                        me.$vs.notify({
                            title: 'Error',
                            text: 'No se encontraron datos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                    me.$vs.notify({
                        title: 'Error',
                        text: 'Error al buscar los datos',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle'
                    })
                })
        },
        f_selectPuntoVenta(tr) {
            console.log("Datos consulta:", tr);
            this.datosSeleccionado.nombreInstitucion = tr.nombreInstitucion;
            this.datosSeleccionado.id_institucion = tr.idInstitucion;
            this.arrayPuntoVenta = [];
            console.log("Datos seleccionados", this.datosSeleccionado);

            this.$emit('enviarDatosDespacho', this.datosSeleccionado);
        },
        f_quitarPuntoVenta() {
            console.log("Quitando punto de venta");
            this.datosSeleccionado = {
                nombreInstitucion: '',
                id_institucion: '',
            };
            this.busqueda.puntoVenta = '';
            this.arrayPuntoVenta = [];
            this.$emit('enviarDatosDespacho', this.datosSeleccionado);
        }
    }
}
</script>
