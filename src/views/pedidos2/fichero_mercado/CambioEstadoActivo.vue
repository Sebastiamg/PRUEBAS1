<template>
<div class="vx-row">
    <!-- Mensaje informativo de estado activo -->
    <vs-col vs-w="12" class="mb-4 mp-4">
        <div class="bg-green-50 border-l-4 border-green-600 text-green-800 p-5 rounded-lg">
            <div class="flex items-start">
                <div>
                    <p class="font-bold text-xl mb-2">ℹ Atención:</p>
                    <p class="text-base md:text-lg lg:text-xl leading-relaxed">
                        Al confirmar este cambio, el fichero quedará <span class="font-semibold text-green-700">Activo</span>,
                        permitiendo que el asesor lo pueda editar nuevamente.
                        Por lo tanto, deberá ser enviado para aprobación nuevamente.
                    </p>

                </div>
            </div>
        </div>
    </vs-col>

    <!-- Botones centrados -->
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="space-x-4">
        <vs-button @click="GuardarComoActivo_Fichero()" color="success" type="filled" class="px-6 py-3 font-medium text-lg">
            Confirmar cambio de estado
        </vs-button>

        <vs-button @click="getCancelar()" color="danger" type="relief" class="px-6 py-3 font-medium text-lg">
            Cancelar
        </vs-button>
    </vs-col>
</div>
</template>

<script>
import {
    mapState
} from "vuex";
export default {
    data() {
        return {};
    },
    props: {
        Fichero_Array: {
            type: Array,
            default: [],
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    mounted() {
        console.log(this.Fichero_Array, "sss");
    },
    methods: {
        GuardarComoActivo_Fichero() {
            let me = this;
            me.$vs.loading();
            let usuariorespo = localStorage.getItem("usuario");
            let usuariolocal = JSON.parse(usuariorespo);
            return new Promise((resolve, reject) => {
                let data_Guardado = {
                    action: 'GuardarDatos_GuardarComoActivo_Fichero',
                    fm_id: me.Fichero_Array[0].fm_id,
                    user_edit: usuariolocal.idusuario,
                };
                // console.log(data_Guardado, "testtttt_autoridades");
                // resolve();
                // return;
                me.$http.post(me.$server_url + 'Procesar_MetodosPost_Fichero_MercadoController', data_Guardado)
                    .then(response => {
                        if (response.data.status == 1) {
                            me.$vs.loading.close();
                            me.$vs.notify({
                                title: 'Éxito',
                                text: 'Fichero activado correctamente.',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                            this.$emit('change', {
                                verificarficheromercado_CambioEstado: 1
                            });
                            resolve();
                        } else {
                            me.$vs.loading.close();
                            me.$vs.notify({
                                title: 'Error',
                                text: response.data.message,
                                color: 'danger',
                                iconPack: 'feather',
                                icon: 'icon-alert-circle'
                            });
                            reject("EnviarParaAprobacion else", response.data.message);
                        }
                    })
                    .catch(error => {
                        me.$vs.loading.close();
                        console.error('Error al guardar fichero:', error);
                        me.$vs.notify({
                            title: 'Error',
                            text: 'Error al guardar el fichero de mercado.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-circle'
                        });
                        reject("EnviarParaAprobacion catch", error);
                    });
            });
        },
        getCancelar() {
            this.$emit('change', {
                verificarficheromercado_CambioEstado: 2
            });
        },
    }
};
</script>
