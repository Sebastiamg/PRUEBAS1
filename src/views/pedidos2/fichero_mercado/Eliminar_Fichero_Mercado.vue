<template>
<div class="vx-row">
    <!-- Mensaje informativo -->
    <vs-col vs-w="12" class="mb-4 mp-4">
        <div class="bg-red-50 border-l-4 border-red-600 text-red-800 p-6 rounded-lg">
            <div v-if="Array_FicheroMercadoBuscado.length > 0">
                <!-- TITULO -->
                <div class="flex items-center mb-4">
                    <span class="text-2xl mr-2">⚠</span>
                    <h2 class="font-bold text-xl">Atención</h2>
                </div>
                <!-- ESTADOS 0,1,2,3,4 SIN PEDIDO -->
                <div v-if="['0','1'].includes(Array_FicheroMercadoBuscado[0].fm_estado) || (['2','3','4'].includes(Array_FicheroMercadoBuscado[0].fm_estado) && (Array_FicheroMercadoBuscado[0].id_pedido == null))">
                    <p class="mb-3 text-base">
                        El fichero de mercado del establecimiento
                        <span class="font-semibold text-green-700">
                            {{ Array_FicheroMercadoBuscado[0].nombreInstitucion || '' }}
                        </span>
                        se encuentra en estado:
                        <b>
                            <span v-if="Array_FicheroMercadoBuscado[0].fm_estado == '0'">Inactivo</span>
                            <span v-else-if="Array_FicheroMercadoBuscado[0].fm_estado == '1'">Creado / Activo</span>
                            <span v-else-if="Array_FicheroMercadoBuscado[0].fm_estado == '2'">Enviado para aprobación</span>
                            <span v-else-if="Array_FicheroMercadoBuscado[0].fm_estado == '3'">Aprobado</span>
                            <span v-else-if="Array_FicheroMercadoBuscado[0].fm_estado == '4'">Devuelto</span>
                        </b>
                        y <b>no</b> tiene ningun pedido asociado.
                    </p>
                    <div class="bg-white border border-red-200 rounded-md p-4 mb-4">
                        <p class="font-semibold mb-2">Eliminar este fichero implica:</p>
                        <ul class="list-disc pl-5 text-sm text-gray-700">
                            <li>-Crear un nuevo fichero de mercado.</li>
                            <li>-Realizar nuevamente todo el proceso para su aprobación.</li>
                            <li>-Perder toda la información registrada.</li>
                        </ul>
                    </div>
                    <p class="font-bold text-red-700" style="text-align: center;">
                        ¿Está seguro de eliminar el fichero de mercado?
                    </p>
                </div>
                <!-- ESTADO 2,3,4 CON PEDIDO EN ESTADOS 0 Y 1 (ACTIVO)-->
                <div v-else-if="['2','3','4'].includes(Array_FicheroMercadoBuscado[0].fm_estado) && Array_FicheroMercadoBuscado[0].id_pedido != null && [0,1].includes(Array_FicheroMercadoBuscado[0].estado_pedido)">
                    <p>
                        El fichero de mercado del establecimiento
                        <span class="font-semibold text-green-700">
                            {{ Array_FicheroMercadoBuscado[0].nombreInstitucion || '' }}
                        </span>
                        se encuentra en estado:
                        <span class="font-semibold text-green-700">
                            <span v-if="Array_FicheroMercadoBuscado[0].fm_estado == '2'">Enviado para aprobación</span>
                            <span v-else-if="Array_FicheroMercadoBuscado[0].fm_estado == '3'">Aprobado</span>
                            <span v-else-if="Array_FicheroMercadoBuscado[0].fm_estado == '4'">Devuelto</span>
                        </span>
                        y tiene un pedido asociado en estado: <b>Activo</b>.
                    </p>
                    <p class="font-bold text-red-700 mt-3" style="text-align: center;">
                        No es posible eliminar este fichero.
                    </p>
                </div>
                <!-- ESTADO 2,3,4 CON PEDIDO EN ESTADO 2 (ANULADO)-->
                <div v-else-if="['2','3','4'].includes(Array_FicheroMercadoBuscado[0].fm_estado) && Array_FicheroMercadoBuscado[0].id_pedido != null && [2].includes(Array_FicheroMercadoBuscado[0].estado_pedido)">
                    <p>
                        El fichero de mercado del establecimiento
                        <span class="font-semibold text-green-700">
                            {{ Array_FicheroMercadoBuscado[0].nombreInstitucion || '' }}
                        </span>
                        ya se encuentra
                        <span class="font-semibold text-green-700">
                            <span v-if="Array_FicheroMercadoBuscado[0].fm_estado == '2'">Enviado para aprobación</span>
                            <span v-else-if="Array_FicheroMercadoBuscado[0].fm_estado == '3'">Aprobado</span>
                            <span v-else-if="Array_FicheroMercadoBuscado[0].fm_estado == '4'">Devuelto</span>
                        </span>
                        y tiene un pedido asociado en estado: <b>Anulado</b>.
                        <div class="bg-white border border-red-200 rounded-md p-4 mb-4">
                            <p class="font-semibold mb-2">Eliminar este fichero implica:</p>
                            <ul class="list-disc pl-5 text-sm text-gray-700">
                                <li>-Crear un nuevo fichero de mercado.</li>
                                <li>-Realizar nuevamente todo el proceso para su aprobación.</li>
                                <li>-Perder toda la información registrada.</li>
                                <li v-if="Array_FicheroMercadoBuscado[0].fm_estado == '3'">-No poder crear un pedido con este establecimiento en este periodo hasta que se apruebe el fichero nuevamente.</li>
                            </ul>
                        </div>
                    </p>
                    <p class="font-bold text-red-700 mt-3" style="text-align: center;">
                        ¿Está seguro de eliminar el fichero de mercado?
                    </p>
                </div>
                <div v-else>
                  Estado del fichero desconocido.
                </div>
            </div>
            <!-- SIN DATOS / OTROS -->
            <div v-else>
              <div class="flex items-center mb-4">
                    <span class="text-2xl mr-2">⚠</span>
                    <h2 class="font-bold text-xl">Atención</h2>
                </div>
                <p class="font-bold">No se encontraron datos para este fichero o fue eliminado.</p>
            </div>
        </div>
    </vs-col>
    <!-- Botones -->
    <vs-row vs-justify="center">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2" v-if="Array_FicheroMercadoBuscado.length > 0 &&
        (['0','1'].includes(Array_FicheroMercadoBuscado[0].fm_estado)
        || (['2','3','4'].includes(Array_FicheroMercadoBuscado[0].fm_estado) && (Array_FicheroMercadoBuscado[0].id_pedido == null || Array_FicheroMercadoBuscado[0].estado_pedido == 2)))">
            <vs-button @click="Post_Eliminar_FicheroMercado()" type="relief">
                Sí, Eliminar
            </vs-button>
        </vs-col>
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
            <vs-button @click="getCancelar()" color="danger" type="relief">
                Cancelar
            </vs-button>
        </vs-col>
    </vs-row>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
export default {
    data() {
        return {
            Array_FicheroMercadoBuscado: [],
            isrunLoading_metodoInicialGlobal: false,
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        Fichero_Array: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        ...mapState(["auth", "userRoot", "susuario", "userAsesor", "AdminBodega"]),
    },
    mounted() {
        this.metodoInicialGlobal();
    },
    methods: {
        async metodoInicialGlobal() {
            let me = this;
            try {
                me.isrunLoading_metodoInicialGlobal = true;
                me.$vs.loading();
                await me.get_Verificar_EstadoFichero();
                me.isrunLoading_metodoInicialGlobal = false
                me.$vs.loading.close();
            } catch (error) {
                console.error('Error en metodoInicialGlobal:', error);
                me.$vs.loading.close();
            }
        },
        get_Verificar_EstadoFichero() {
            return new Promise((resolve, reject) => {
                let enviardata = {
                    action: 'Verificar_EstadoFichero',
                    fm_id: this.Fichero_Array[0].fm_id
                };
                this.$http.get(this.$server_url + 'Procesar_MetodosGet_Fichero_MercadoController', {
                        params: enviardata
                    })
                    .then(response => {
                        if (response.data && response.data.length > 0) {
                            this.Array_FicheroMercadoBuscado = response.data;
                            // console.log('✅ Datos del fichero de mercado encontrados:', this.Array_FicheroMercadoBuscado);
                            resolve();
                        } else {
                            // this.$vs.notify({
                            //     title: 'Error',
                            //     text: 'No se encontraron datos para este fichero o ya fue eliminado.',
                            //     color: 'danger',
                            //     iconPack: 'feather',
                            //     icon: 'icon-alert-circle'
                            // });
                            resolve();
                        }
                    })
                    .catch(error => {
                        console.error('Error al buscar el fichero de mercado:', error);
                        this.$vs.notify({
                            title: 'Error',
                            text: 'Error al buscar los datos del fichero de mercado.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("getNivelesTodo", error);
                    });
            });
        },
        Post_Eliminar_FicheroMercado() {
            const me = this;
            me.$vs.loading();
            const data_Guardado = {
                action: "Eliminar_FicheroMercado",
                fm_id: this.Array_FicheroMercadoBuscado[0].fm_id,
            };
            me.$http.post(me.$server_url + "Procesar_MetodosPost_Fichero_MercadoController", data_Guardado)
                .then((response) => {
                    me.$vs.loading.close();
                    if (response.data.status == 1) {
                        me.$vs.notify({
                            title: "Éxito",
                            text: "Fichero de mercado eliminado con éxito.",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                            time: 5000,
                        });
                        me.$emit("change", {
                            verificarficheromercado_Eliminar: 1
                        });
                    } else if (response.data.status == 0) {
                        me.Array_FicheroMercadoBuscado = [];
                        me.$vs.notify({
                            title: "Atención",
                            text: response.data.message,
                            color: "warning",
                            iconPack: "feather",
                            icon: "icon-alert-circle",
                        });
                        this.metodoInicialGlobal();
                    } else {
                        me.$vs.notify({
                            title: "Error",
                            text: response.data.message,
                            color: "danger",
                            iconPack: "feather",
                            icon: "icon-alert-circle",
                        });
                    }
                })
                .catch((error) => {
                    me.$vs.loading.close();
                    console.error("Error al eliminar fichero:", error);
                    me.$vs.notify({
                        title: "Error",
                        text: "Error al eliminar el fichero de mercado.",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                    });
                });
        },

        getCancelar() {
            this.$emit("change", {
                verificarficheromercado_Eliminar: 2
            });
        },
    },
};
</script>

<style scoped>
.stylevalidarinput {
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}
</style>
