<template>
<div class="vx-row">
    <!-- Mensaje informativo de estado activo -->
    <vs-col vs-w="12" class="mb-4 mp-4">
        <div class="bg-green-50 border-l-4 border-green-600 text-green-800 p-5 rounded-lg">
            <div class="flex items-start">
                <div>
                  <!-- {{ tabFicheroMercado }} -->
                    <p class="font-bold text-xl mb-2">ℹ Atención:</p>
                    <p class="text-base md:text-lg lg:text-xl leading-relaxed">
                        Al aprobar este <span class="font-semibold text-blue-700">fichero de mercado</span>,
                        el <span class="font-semibold text-green-700">asesor</span> quedará habilitado
                        para realizar el <span class="font-semibold text-green-700">pedido correspondiente</span>
                        en la institución <span class="font-semibold text-green-700">{{ tabFicheroMercado.nombreInstitucion }}</span>.
                    </p>
                </div>
            </div>
        </div>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="GuardarComo_FicheroAprobado()" type="relief">Aprobar</vs-button>
    </vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
    </vs-col>
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
            //showAgregarNuevo: false,
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        tabFicheroMercado: {
            type: Object,
            default: function () {
                return {}
            }
        }
    },
    mounted() {
        let me = this;
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        //SECCION GUARDAR NUEVO PRODUCTO
        // getNuevoContUserAgrupacion() {
        //     this.nuevoarray.ca_id = ''
        //     this.nuevoarray.idusuario = ''
        // },
        GuardarComo_FicheroAprobado() {
            let me = this;
            me.$vs.loading();
            let usuariorespo = localStorage.getItem("usuario");
            let usuariolocal = JSON.parse(usuariorespo);
            return new Promise((resolve, reject) => {
                let data_Guardado = {
                    action: 'GuardarDatos_FicheroAprobado',
                    fm_id: me.tabFicheroMercado.fm_id,
                    user_aprobacion: usuariolocal.idusuario,
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
                                text: 'Fichero de mercado aprobado con éxito.',
                                color: 'success',
                                iconPack: 'feather',
                                icon: 'icon-check',
                                time: 5000
                            });
                            this.$emit('change', {
                                verificarficheromercado_Aprobacion: 1
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
                            reject("GuardarComo_FicheroAprobado else", response.data.message);
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
                        reject("GuardarComo_FicheroAprobado catch", error);
                    });
            });
        },
        getCancelar() {
            this.$emit('change', {
                verificarficheromercado_Aprobacion: 2
            });
        },
    },
};
</script>
