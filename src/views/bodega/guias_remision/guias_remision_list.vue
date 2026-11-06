<template>
<div>
    <div v-if="validacionView == true && !nombreInstitucion">
        <div class="vx-row m-4">
            <div class="vx-col w-full ">
                <div class="vx-col w-full flex">
                    <div class="w-full mb-5">
                        <span>Busqueda x nombre Institucion o Libreria <small>(Presionar enter para buscar)</small>:</span>
                        <vs-input v-model="busqueda" @keypress.enter="searchData(0)" class="w-full" placeholder="Nombre Institucion / Punto de venta" />
                    </div>
                    <div class="w-1/6 mt-5">
                        <vs-button color="warning" type="filled" style="margin-left:10px;" @click="searchData(0)" icon="search"></vs-button>
                    </div>
                </div>
            </div>
        </div>
        <div class="vx-col w-full">
            <vs-table max-items="5" search pagination :data="arrayPuntoVenta " v-if="arrayPuntoVenta.length>0" striped>
                <template slot="header">
                    <vs-chip color="primary">Cantidad: <b> {{ arrayPuntoVenta.length }}</b></vs-chip>
                </template>
                <template slot="thead">
                    <vs-th>Nombre</vs-th>
                    <vs-th>Ruc / Cédula</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{ tr.nombreInstitucion }}<br>
                        </vs-td>
                        <vs-td>
                            {{ (String(tr.ruc).length < 10 ? 'SIN RUC/CI' : tr.ruc) }} <br>
                            <vs-button color="danger" @click="nombreInstitucion = tr.nombreInstitucion;getGuiasClienteParametro(tr.ruc);">Buscar Guias </vs-button><br>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </div>
    <div v-else class="m-4 felx justify-right align-right">
        <vs-button @click="nombreInstitucion='';guias_remision=[]" color="primary" type="border" icon="search">Volver a buscar</vs-button>
    </div>
    <div v-if="guias_remision.length > 0" class="mt-4">
        <h5 v-if="validacionView == true" class="text-center text-danger mt-4">Guias de <b>{{ nombreInstitucion }}</b></h5>
        <vs-table :data="guias_remision" stripe search pagination max-items="5">

            <template slot="thead">
                <vs-th>#Detalles</vs-th>
                <vs-th>Imagen</vs-th>
                <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{ data }">
                <vs-tr v-for="(item, index) in data" :key="index">
                    <vs-td>
                        <p> Documento: <b>{{ item.ven_codigo }}</b></p><br>
                        <p> Guia #: <b style="font-size: 18px;">{{ item.remi_guia_remision }}</b></p>
                    </vs-td>
                    <vs-td>
                        <image-zoom :regular="$data_url + 'archivos/remision/guias/' + item.url" :zoom-amount="3" :click-zoom="true" click-message="Haz clic para ampliar" img-class="img-fluid" />
                    </vs-td>
                    <vs-td>
                        <!-- Enlace nativo -->
                        <a :href="$data_url + 'archivos/remision/guias/' + item.url" :download="item.archivo" target="_blank">
                            <vs-button type="flat" icon-pack="feather" icon="icon-download">
                                Descargar
                            </vs-button>
                        </a>
                        <!-- Botón WhatsApp -->
                        <!-- <vs-button color="success" type="gradient" radius icon-pack="feather" icon="icon-share-2" @click="compartirWhatsApp(item)"></vs-button> -->
                    </vs-td>
                </vs-tr>
            </template>

        </vs-table>
    </div>
    <div v-else>
        <vs-alert color="warning" icon="warning" title="Sin resultados">
            {{ validacionView== true?'Realice una busqueda.':'No se encontraron guías de remisión disponibles para este período y RUC seleccionado.'}}
        </vs-alert>
    </div>
</div>
</template>

<script>
import imageZoom from 'vue-image-zoomer'

export default {
    components: {
        imageZoom,
    },
    data() {
        return {
            usuario: [],
            guias_remision: [],
            guias_rucs: [],

            busqueda: '',
            arrayPuntoVenta: [],
            validacionView: false,
            nombreInstitucion: '',
        }
    },
    props: {
        guias_remision_rucs: {
            type: Array,
            default: () => [],
        },
        periodoSelect: {
            type: Object,
            default: () => ({}),
        },
        visualizar: {
            type: Boolean,
            default: false,
        },
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
    mounted() {
        this.guias_rucs = this.guias_remision_rucs
        this.validacionView = this.visualizar
        if (!this.validacionView) {
            this.getGuiasRemision()
        }
    },
    methods: {
        getGuiasRemision() {
            this.$vs.loading()
            this.$http
                .get(this.$server_url + 'guias_remision_list', {
                    params: {
                        ruc: JSON.stringify(this.guias_rucs),
                        periodo: this.periodoSelect.idperiodoescolar,
                    },
                })
                .then((response) => {
                    this.guias_remision = response.data.filter(
                        (item) => item.archivo !== null && item.url !== null
                    )
                    if(validacionView){
                        this.busqueda = '',
                        this.arrayPuntoVenta = []
                    }
                    this.$vs.loading.close()
                })
                .catch((error) => {
                    console.error(error)
                    this.$vs.loading.close()
                })
        },
        compartirWhatsApp(item) {
            const urlImagen = this.$data_url + 'archivos/remision/guias/' + item.url;
            const mensaje = `Hola, te comparto esta guía de remisión: ${urlImagen}`;
            const enlaceWhatsApp = `https://wa.me/?text=${encodeURIComponent(mensaje)}`;

            // Abre WhatsApp Web o la app
            window.open(enlaceWhatsApp, '_blank');
        },
        getGuiasClienteParametro(ruc){
            this.guias_rucs = {ruc_cliente: ruc}
            this.getGuiasRemision()
            this.busqueda = ''
            this.arrayPuntoVenta = []
        },
        searchData() {
            let me = this
            me.arrayPuntoVenta = []
            if (me.busqueda.length < 4) {
                me.$vs.notify({
                    title: 'Error',
                    text: 'Debe ingresar al menos 4 caracteres',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-circle'
                })
                return
            }
            me.$vs.loading()
            this.$http.get(this.$server_url + 'InstitucionesXCobranzas?busqueda=' + me.busqueda + '&id_periodo=' + me.periodoSelect.idperiodoescolar)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.arrayPuntoVenta = res.data.filter(p => p.ruc !== null && p.ruc !== undefined && p.ruc !== '');
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
    },
}
</script>
