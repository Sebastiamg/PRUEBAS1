<template>
<div>
    <div>
        ¿Estás seguro de igualar la proforma <b>{{ tr_data[0].ven_idproforma }}</b> con la venta ? Ambos documentos serán idénticos y se finalizarán.
    </div>
    <br>
    <!-- Tabla con los detalles -->
    <div v-if="detalles.length > 0">
        <h4>Detalles con diferencias</h4>
        <vs-table :data="detalles">
            <template slot="thead">
                <vs-th>Código Producto</vs-th>
                <vs-th>Nombre Producto</vs-th>
                <vs-th>Cantidad Proforma</vs-th>
                <vs-th>Cantidad Venta</vs-th>
                <vs-th>Diferencia</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="index" v-for="(item, index) in data">
                    <vs-td>{{ item.pro_codigo }}</vs-td>
                    <vs-td>{{ item.pro_nombre }}</vs-td>
                    <vs-td>{{ item.cantidad_proforma }}</vs-td>
                    <vs-td>{{ item.cantidad_venta }}</vs-td>
                    <vs-td :style="{ color: item.diferencia > 0 ? 'red' : item.diferencia < 0 ? 'blue' : 'black' }">
                        {{ item.diferencia }}
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>
    <div v-else>
        <p>No hay diferencias entre los detalles de la proforma y la venta, o los datos están cargando...</p>
    </div>
    <br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="QuitarPendiente()" type="relief" class="vs-con-loading__container mr-3" :disabled="isLoading">
            <span v-if="isLoading">Actualizando...</span>
            <span v-else>Actualizar</span>
        </vs-button> 
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
    </vs-col>
    <br>
    <br>
</div>
</template>

  
<script>
import vSelect from "vue-select";

export default {
    data() {
        return {
            detalles: [], // Array para almacenar los detalles
            usuario: [],
            venta_asosiada: '',
            isLoading: false,
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        tr_data: {
            type: [Object, Array],
            default: function () {
                return {};
            },
        },
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
        let me = this;
        me.cargarDetalles(); // Cargar los detalles al montar el componente
    },
    methods: {
        cargarDetalles() {
            let me = this;
            me.$vs.loading();
            me.$http.get(me.$server_url + 'ObtenerDetallesProformaVenta', {
                    params: {
                        id_empresa: me.tr_data[0].id_empresa,
                        ven_idproforma: me.tr_data[0].ven_idproforma,
                    }
                })
                .then((res) => {
                    me.$vs.loading.close();
                    if (res.data.status == 1) {
                        me.detalles = res.data.data;
                        me.venta_asosiada = res.data.venta;
                        me.$vs.notify({
                            text: 'Detalles cargados correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 4000,
                        });
                    } else {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x',
                            time: 7000,
                        });
                    }
                })
                .catch((error) => {
                    console.error('Error al cargar los detalles:', error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error al cargar los detalles.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 7000,
                    });
                });
        },
        QuitarPendiente() {
            let me = this;
            me.isLoading = true;
            me.$vs.loading();
            const datosParaGuardar = {
                id_empresa: me.tr_data[0].id_empresa,
                ven_codigo: me.venta_asosiada,
                user_created: me.usuario.idusuario,
            };
            me.$http
                .post(me.$server_url + 'ActualizarVenta', datosParaGuardar)
                .then((res) => {
                    me.$vs.loading.close();
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check',
                            time: 7000,
                        });
                        this.$emit('change', {
                            verificaractualizacion: 1,
                        });
                    }
                    me.isLoading = false;
                })
                .catch((error) => {
                    me.isLoading = false;
                    console.error('Error al guardar los datos:', error);
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error interno, no se puede guardar.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x',
                        time: 7000,
                    });
                });
        },
        getCancelar() {
            this.$emit('change', {
                verificaractualizacion: 2,
            });
        },
    },
};
</script>

  
<style scoped>
.informacionformhijodehijo {
    z-index: 51002;
    position: fixed;
}

.stylevalidarinput {
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}
</style>
