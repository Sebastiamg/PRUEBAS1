<template>
<vx-card fixed-height="true">
    <vs-row>
        <vs-divider>Información</vs-divider>
        <vs-row vs-align="center">
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="7" vs-sm="7" vs-xs="7">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Nombre Editorial" placeholder="Nombre Editorial" class="w-full" icon="mode_edit" v-model="nuevoarray.edi_nombre" ref="edi_nombre" :class="classvalidar_edi_nombre" />
                        <!-- {{ tab_Editoriales }} -->
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
    </vs-row>
    <br><br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarnuevoeditar_Editoriales()" type="relief">Guardar</vs-button>&emsp;
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
            edi_id: 0,
            nuevoarray: {
                edi_nombre: '',
            },
            classvalidar_edi_nombre: '',
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
        tab_Editoriales: {
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
            me.nuevoarray.edi_nombre = '';
            me.nuevoarray.user_created = usuarioObjeto.idusuario;
            me.nuevoarray.user_edit = usuarioObjeto.idusuario;
            // me.getNuevoContUserAgrupacion();
        } else if (me.verificarcrear_actualizar == 'update') {
            // console.log("Entro en actualizar");
            me.nuevoarray.edi_id = me.tab_Editoriales.edi_id;
            me.nuevoarray.edi_nombre = me.tab_Editoriales.edi_nombre;
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
        validarcampo_edi_nombre() {
            let me = this;
            const focusnombreInstitucion = me.$refs.edi_nombre.$el.querySelector('input');
            focusnombreInstitucion.focus();
            me.classvalidar_edi_nombre = 'stylevalidar';
            //Notificación de vacio
            me.$vs.notify({
                text: 'Escriba el nombre de la editorial antes de guardar',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_edi_nombre = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        guardarnuevoeditar_Editoriales() {
            let me = this;
            let datos = {};
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (me.nuevoarray.edi_nombre === '' || me.nuevoarray.edi_nombre === null || me.nuevoarray.edi_nombre === 0) {
                me.validarcampo_edi_nombre();
                return;
            }
            me.$vs.loading()
            if (me.verificarcrear_actualizar === 'create') {
                datos = {
                    "action": "Post_Registrar_modificar_Editoriales",
                    "edi_nombre": this.nuevoarray.edi_nombre,
                    "user_created": this.nuevoarray.user_created,
                    "user_edit": this.nuevoarray.user_edit
                }
            } else if (me.verificarcrear_actualizar === 'update') {
                datos = {
                    "action": "Post_Registrar_modificar_Editoriales",
                    "edi_id": this.nuevoarray.edi_id,
                    "edi_nombre": this.nuevoarray.edi_nombre,
                    "user_created": this.nuevoarray.user_created,
                    "user_edit": this.nuevoarray.user_edit
                }
            } else {
                console.log("Guardado no controlado");
            }
            // console.log(datos,'datos');
            // return
            //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_Editoriales', datos)
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
