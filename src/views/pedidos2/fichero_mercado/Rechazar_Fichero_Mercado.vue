<template>
<div class="vx-row">
    <!-- Mensaje informativo -->
    <vs-col vs-w="12" class="mb-4 mp-4">
        <div class="bg-red-50 border-l-4 border-red-600 text-red-800 p-5 rounded-lg">
            <div class="flex items-start">
                <div>
                    <p class="font-bold text-xl mb-2">⚠ Atención:</p>
                    <p class="text-base md:text-lg lg:text-xl leading-relaxed">
                        Al <span class="font-semibold text-red-700">devolver este fichero de mercado</span>,
                        el <span class="font-semibold text-green-700">fichero</span> quedará habilitado para que
                        el <span class="font-semibold text-green-700">asesor</span> pueda
                        <span class="font-semibold text-blue-700">editarlo nuevamente</span> y realizar las
                        <span class="font-semibold text-blue-700">correcciones o modificaciones necesarias</span>.
                        <br><br>
                        Por favor, especifica en el campo de <span class="font-semibold text-blue-700">Observaciones</span>
                        los motivos de la devolución del fichero o los aspectos que deben corregirse.
                    </p>

                    <!-- Textarea con ref -->
                    <vs-textarea ref="comentario_rechazo" label="Observaciones:" :counter="maxCaracteres" placeholder="Escribe los motivos o indicaciones para el asesor..." class="w-full mt-4" icon="mode_edit" :class="classvalidar_comentario_rechazo" v-model="comentario_rechazo" />
                </div>
            </div>
        </div>
    </vs-col>

    <!-- Botones -->
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2"></vs-col>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="3" class="mt-2">
        <vs-button @click="GuardarComo_FicheroRechazado()" type="relief">Devolver</vs-button>
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
            comentario_rechazo: "",
            classvalidar_comentario_rechazo: "",
            maxCaracteres: 200, // 👈 Límite de caracteres controlado por variable
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        tabFicheroMercado: {
            type: Object,
            default: () => ({}),
        },
    },
    computed: {
        ...mapState(["auth", "userRoot", "susuario", "userAsesor", "AdminBodega"]),
    },
    methods: {
        /** ✅ Validar textarea **/
        validar_comentario() {
            const me = this;
            const textarea = me.$refs.comentario_rechazo.$el.querySelector("textarea");
            const texto = me.comentario_rechazo.trim();

            // Validar vacío
            if (!texto) {
                textarea.focus();
                me.classvalidar_comentario_rechazo = "stylevalidarinput";
                me.$vs.notify({
                    text: "El campo de observaciones no debe estar vacío.",
                    color: "warning",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 4000,
                });
                setTimeout(() => (me.classvalidar_comentario_rechazo = ""), 1500);
                return false;
            }

            // Validar longitud
            if (texto.length > me.maxCaracteres) {
                textarea.focus();
                me.classvalidar_comentario_rechazo = "stylevalidarinput";
                me.$vs.notify({
                    text: `Has excedido el límite de ${me.maxCaracteres} caracteres permitidos.`,
                    color: "danger",
                    iconPack: "feather",
                    icon: "icon-alert-triangle",
                    time: 4000,
                });
                setTimeout(() => (me.classvalidar_comentario_rechazo = ""), 1500);
                return false;
            }

            return true;
        },

        /** Guardar (rechazo) **/
        GuardarComo_FicheroRechazado() {
            const me = this;

            // 🔍 Validar antes de continuar
            if (!me.validar_comentario()) return;

            me.$vs.loading();
            const usuariorespo = localStorage.getItem("usuario");
            const usuariolocal = JSON.parse(usuariorespo);

            const data_Guardado = {
                action: "GuardarDatos_FicheroRechazado",
                fm_id: me.tabFicheroMercado.fm_id,
                user_aprobacion: usuariolocal.idusuario,
                comentario_rechazo: me.comentario_rechazo
            };

            me.$http
                .post(me.$server_url + "Procesar_MetodosPost_Fichero_MercadoController", data_Guardado)
                .then((response) => {
                    me.$vs.loading.close();
                    if (response.data.status == 1) {
                        me.$vs.notify({
                            title: "Éxito",
                            text: "Fichero de mercado devuelto al asesor con éxito.",
                            color: "success",
                            iconPack: "feather",
                            icon: "icon-check",
                            time: 5000,
                        });
                        me.$emit("change", {
                            verificarficheromercado_Rechazar: 1
                        });
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
                    console.error("Error al guardar fichero:", error);
                    me.$vs.notify({
                        title: "Error",
                        text: "Error al guardar el fichero de mercado.",
                        color: "danger",
                        iconPack: "feather",
                        icon: "icon-alert-circle",
                    });
                });
        },

        getCancelar() {
            this.$emit("change", {
                verificarficheromercado_Rechazar: 2
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
