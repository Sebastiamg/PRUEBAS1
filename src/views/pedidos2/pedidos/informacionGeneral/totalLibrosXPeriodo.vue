<template>
    <div>
        <div class="mt-5">
            <ul class="flex">
                <li>
                    <vs-radio v-model="ifContratos" @input="getLibrosPeriodo();" class="mr-3" vs-name="radios1ifContratos" vs-value="0">Pedidos sin contratos</vs-radio>
                </li>
                <li>
                    <vs-radio v-model="ifContratos" @input="getLibrosPeriodo();" class="mr-3" vs-name="radios1ifContratos" vs-value="1">Pedidos con contratos</vs-radio>
                </li>
                <li>
                    <!--boton filtrar-->
                    <vs-button @click="getLibrosPeriodo()" class="btn btn-sm" style="margin-top: -5px;" icon-pack="feather" icon="icon-refresh-cw" type="border" color="primary">filtrar</vs-button>
                </li>
            </ul>
        </div>
        <div class="contenedor-libros">
            <div>
                <p>Libros: <b>{{ obtenerLibros.resumen.total_libros || 0 }} </b></p>
                <p>Cantidad de libros:<b> {{ obtenerLibros.resumen.total_ejemplares || 0 }} </b></p>
            </div>
            <div class="m-3" v-if="obtenerLibros.libros.length > 0">
                <TableReutilizableVue :title="'Libros en pedidos'"
                    :headers="['Código', 'Nombre libro', 'Cantidad libros', 'Pedidos']"
                    :fieldKeys="['codigo_liquidacion', 'nombrelibro', 'cantidad', 'pedidos']" 
                    :maxItems="20"
                    :ifexportar="Number(1)" :tableData="obtenerLibros.libros" />

            </div>
        </div>
    </div>
   
</template>

<script>
const TableReutilizableVue = () => import('@/views/pedidos2/pedidos/reportes/components/TableReutilizable.vue')

export default {
    data() {
        return {
            id_periodo: null,
            // obtenerLibros: {},
            obtenerLibros: {
                libros: [],
                resumen: {
                    total_libros: 0,
                    total_pedidos: 0,
                    total_ejemplares: 0
                }
            },
            ifContratos:1,
        };
    },
    components: {
        TableReutilizableVue,
    },
    props: {
        periodoConsulta: {
            type: String,
            default: false
        }
    },
    mounted() {
        // console.log("Componente montado screenInformacionGeneral");
        let me = this;
        me.getLibrosPeriodo();
    },
    methods: {
        async getLibrosPeriodo() {
            let me = this;
            let formData = new FormData();
            formData.append('id_periodo', this.periodoConsulta);
            formData.append('ifContratos', me.ifContratos)
            me.$vs.loading();
            this.$http.post(this.$server_url + 'contarLibrosPorPeriodo', formData)
                .then(function (response) {
                    me.obtenerLibros = response.data;
                    console.log(me.obtenerLibros)
                    me.$f_notificacion('Libros obtenidos correctamente');
                })
                .catch(function (error) {
                    me.$f_notificacion('Error en el proceso', 'danger', 'icon-alert-triangle')
                })
                .finally(() => {
                    me.$vs.loading.close();
                })
        }
    }
};
</script>
