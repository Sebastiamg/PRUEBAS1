<template>
<div class="vx-row">
    <!-- Mensaje de advertencia elegante sin sombra ni efectos -->
    <vs-col vs-w="12" class="mb-4 mp-4">
        <div class="bg-blue-50 border-l-4 border-blue-600 text-blue-800 p-5 rounded-lg">
            <div class="flex items-start">
                <!-- <ion-icon name="information-circle-outline" class="text-3xl mr-4 mt-1"></ion-icon> -->
                <div>
                    <p class="font-bold text-xl mb-2">⚠ Atención:</p>
                    <p class="text-base md:text-lg lg:text-xl leading-relaxed">
                        Al enviar este fichero para aprobación de la institución <i style="font-weight: bold;">{{ tabFicheroMercado.nombreInstitucion }}</i>,
                        <span class="font-semibold text-blue-700">no podrá editarlo nuevamente</span>.
                        Asegúrese de que toda la información esté correcta antes de continuar.
                    </p>
                </div>
            </div>
        </div>
    </vs-col>
<!-- {{ tabFicheroMercado }} -->
    <!-- Botones centrados -->
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="space-x-4">
        <vs-button @click="EnviarParaAprobacion()" color="primary" type="filled" class="px-6 py-3 font-medium text-lg">
            Enviar para Aprobación
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
        return {
        };
    },
    props: {
        tabFicheroMercado: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'ObjectPedido', 'userAsesor', 'groupFacturador']),
    },
    mounted() {
      console.log(this.tabFicheroMercado, "sss");
    },
    methods: {
        EnviarParaAprobacion() {
            let me = this;
            me.$vs.loading();
            let usuariorespo = localStorage.getItem("usuario");
            let usuariolocal = JSON.parse(usuariorespo);
            return new Promise((resolve, reject) => {
                let data_Guardado = {
                    action: 'GuardarDatos_EnviarParaAprobacion',
                    fm_id: me.tabFicheroMercado.fm_id,
                    user_envia_para_aprobacion: usuariolocal.idusuario,
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
                                text: 'Fichero de mercado enviado para aprobación.',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check'
                            });
                            this.$emit('change', {
                                verificarficheromercado_enviar_para_Aprobacion: 1
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
                verificarficheromercado_enviar_para_Aprobacion: 2
            });
        },
    }
};
</script>
