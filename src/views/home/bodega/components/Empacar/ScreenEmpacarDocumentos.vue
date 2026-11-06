<template>
<div>
    <!--MENU-->
    <div class="flex">
        <vs-col vs-justify="center" vs-align="center" vs-w="12" class="m-2">
            <small>Seleccione la empresa:</small>
            <v-select :options="listaEmpresas" :reduce="(listaEmpresas) => listaEmpresas" density="comfortable" label="nombre" class="w-full" placeholder="--Seleccione--" @input="getInstituciones()" v-model="empresa" required />
        </vs-col>
    </div>
    <div class="flex" v-if="empresa">
        <vs-col vs-justify="center" vs-align="center" vs-w="12" class="m-2">
            <small>Seleccione la institución:</small>
            <v-select :options="instituciones" :reduce="(instituciones) => instituciones" density="comfortable" label="nombreInstitucion" class="w-full" placeholder="--Seleccione--" v-model="institucion" @input="getventas()" required />
        </vs-col>
    </div>
    <!--COMPONENTES-->
    <TableDocumentoEmpacadoVue :arrayDocumentos="arrayDocumentos" :tipo="tipo" @changeAddDocumentos="changeAddDocumentos" />
</div>
</template>

<script>
import { acosh } from "core-js/core/number";
import vSelect from "vue-select";
const TableDocumentoEmpacadoVue = () => import('./TableDocumentoEmpacado.vue')
export default {
    components: {
        TableDocumentoEmpacadoVue,
        "v-select": vSelect,
    },
    data() {
        return {
            institucion: '',
            empresa: '',
            tipo: 0,
            arrayDocumentos: [],
            instituciones: [],
            listaEmpresas: [],
        }
    },
    props: {
        arrayAsignados: {
            type: Array,
            default: () => []
        },
        opcion: {
            type: Number,
            default: 0
        }
    },
    mounted() {
        let me = this
        me.getEmpresas();
    },
    methods: {
        getEmpresas() {
            let me = this;
            me.listaEmpresas = [];
            this.$http.get(this.$server_url + 'empresa')
                .then(res => {
                    me.listaEmpresas = res.data;
                    me.listaEmpresas = me.listaEmpresas.filter(empresa => empresa.id !== 2);
                })
                .catch(err => {
                    console.error(err);
                });
        },
        getInstituciones() {
            let me = this;
            me.instituciones = [];
            if (me.empresa == "" || me.empresa == null || me.empresa == undefined) {
                this.$vs.notify({
                    text: "Seleccione una institución",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            } else {
                this.$http.get(this.$server_url + 'InstitucionesDesp?id=' + me.empresa.id + '&op=' + me.opcion)

                    .then(res => {
                        me.instituciones = res.data;
                        if (me.instituciones.length == 0) {
                            this.$vs.notify({
                                text: "No existen instituciones",
                                color: "danger",
                                iconPack: "feather",
                                icon: "icon-alert-triangle",
                            });
                            return;
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    });
            }
        },
        changeDatos() {
            let me = this
            me.$emit('changeDatos', me.institucion)
        },
        getventas() {
            let me = this;
            me.arrayDocumentos = [];
            var url = "";
            if (me.institucion == "" || me.institucion == null || me.institucion == undefined) {
                this.$vs.notify({
                    text: "Seleccione una institución",
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                });
                return;
            } else {
                me.$vs.loading()
                url = "GetVentasP?ventaId=" + me.institucion.idInstitucion + "&op=" + me.opcion+ "&idemp=" + me.empresa.id;
                this.$http.get(this.$server_url + url)
                    .then(res => {
                        me.$vs.loading.close()
                        if (res.data.length == 0) {
                            me.$vs.notify({
                                text: 'No hay actas/notas/facturas pendientes por despachar',
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-x'
                            })
                        }
                        this.arrayDocumentos = res.data;
                        this.changeDatos();
                    })
                    .catch(err => {
                        console.log(err)
                        me.$vs.loading.close()
                    });
            }
        },
        changeAddDocumentos(e) {
            let me = this
            let array=e;
            array.forEach(el => {
                el.despacho = el.libros;
            });
            me.$emit('changeAddDocumentos', array)
        },
    }
}
</script>
