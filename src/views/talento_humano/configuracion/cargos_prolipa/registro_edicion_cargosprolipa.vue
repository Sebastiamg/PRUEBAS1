<template>
<vx-card fixed-height="true">
    <vs-row>
        <vs-divider>Información</vs-divider>
        <vs-row vs-align="center">
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="7" vs-sm="7" vs-xs="7">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Nombre Cargo" placeholder="Nombre Cargo" class="w-full" icon="mode_edit" v-model="nuevoarray.ina_nombre" ref="ina_nombre" :class="classvalidar_ina_nombre" />
                        <!-- {{ tab_Institucion_Autoridades }} -->
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
    </vs-row>
    <br><br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarnuevoeditar_Institucion_Autoridades()" type="relief">Guardar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
    </vs-col>
    <br>
    <br>
</vx-card>
</template>

<script>
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
export default {
    data() {
        return {
            DiasActivos: [],
            ina_id: 0,
            nuevoarray: {
                ina_nombre: '',
            },
            classvalidar_ina_nombre: '',
        };
    },
    components: {
        "v-select": vSelect,
    },
    props: {
        verificarcrear_actualizar: {
            type: String,
            default: '',
        },
        tab_Institucion_Autoridades: {
            type: Object,
            default: function () {
                return {}
            }
        },
    },
    mounted() {
        let me = this;
        const usuariorespo = localStorage.getItem("usuario");
        const usuarioObjeto = JSON.parse(usuariorespo);
        if (me.verificarcrear_actualizar == 'create') {
            me.nuevoarray.ina_nombre = '';
            me.nuevoarray.user_created = usuarioObjeto.idusuario;
            me.nuevoarray.user_edit = usuarioObjeto.idusuario;
            // me.getNuevoContUserAgrupacion();
        } else if (me.verificarcrear_actualizar == 'update') {
            // console.log("Entro en actualizar");
            me.nuevoarray.ina_id = me.tab_Institucion_Autoridades.ina_id;
            me.nuevoarray.ina_nombre = me.tab_Institucion_Autoridades.ina_nombre;
            me.nuevoarray.user_edit = usuarioObjeto.idusuario;
        } else {
            console.log("Validación no controlada");
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        validarnopegar(event) {
            // Obtener el texto pegado
            let pastedText = (event.clipboardData || window.clipboardData).getData('text');
            // Verificar si el texto pegado contiene solo números
            if (!/^\d+$/.test(pastedText)) {
                event.preventDefault();
                return;
            }
        },
        validarcampo_ina_nombre() {
            let me = this;
            const focusnombreInstitucion = me.$refs.ina_nombre.$el.querySelector('input');
            focusnombreInstitucion.focus();
            me.classvalidar_ina_nombre = 'stylevalidar';
            //Notificación de vacio
            me.$vs.notify({
                text: 'Escriba el nombre del Cargo antes de guardar',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_ina_nombre = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        guardarnuevoeditar_Institucion_Autoridades() {
            let me = this;
            let datos = {};
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (me.nuevoarray.ina_nombre === '' || me.nuevoarray.ina_nombre === null || me.nuevoarray.ina_nombre === 0) {
                me.validarcampo_ina_nombre();
                return;
            }
            me.$vs.loading()
            if (me.verificarcrear_actualizar === 'create') {
                datos = {
                    "action": "Post_Registrar_modificar_CargosProlipa",
                    "ina_nombre": this.nuevoarray.ina_nombre,
                    "user_created": this.nuevoarray.user_created,
                    "user_edit": this.nuevoarray.user_edit
                }
            } else if (me.verificarcrear_actualizar === 'update') {
                datos = {
                    "action": "Post_Registrar_modificar_CargosProlipa",
                    "ina_id": this.nuevoarray.ina_id,
                    "ina_nombre": this.nuevoarray.ina_nombre,
                    "user_created": this.nuevoarray.user_created,
                    "user_edit": this.nuevoarray.user_edit
                }
            } else {
                console.log("Guardado no controlado");
            }
            // console.log(datos,'datos');
            // return
            //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_Institucion_Autoridades', datos)
                .then(res => {
                    me.$vs.loading.close()
                    // this.getContUserAgrupacionParametro();
                    if (res.data.status == 1) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                        me.$emit('change', {
                            verificacionemitsaveandedit: 1
                        });
                    }
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    console.log(error + ' error');
                });
        },
        getCancelar() {
            this.$emit('change', {
                verificacionemitsaveandedit: 2
            });
        },
    },
};
</script>

<style scoped>
.stylevalidar {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}
</style>
