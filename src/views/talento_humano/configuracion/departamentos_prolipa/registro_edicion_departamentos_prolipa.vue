<template>
<vx-card fixed-height="true">
    <vs-row>
        <vs-divider>Información</vs-divider>
        <vs-row vs-align="center">
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                        <vs-input label="Nombre departamento prolipa" placeholder="Nombre departamento prolipa" class="w-full" icon="mode_edit" v-model="nuevoarray.tdp_nombre" ref="tdp_nombre" :class="classvalidar_tdp_nombre" />
                    </vs-col>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                        <vs-input label="Iniciales" placeholder="Iniciales" class="w-full" icon="mode_edit" v-model="nuevoarray.tdp_iniciales" />
                    </vs-col>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                        <vs-input type="number" label="Secuencial Acta Entrega" placeholder="Secuencial Acta Entrega" class="w-full" icon="mode_edit" v-model="nuevoarray.tdp_secuencial_acta_entrega" />
                    </vs-col>
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12" class="mt-2">
                        <vs-input type="number" label="Secuencial Memo" placeholder="Secuencial Memo" class="w-full" icon="mode_edit" v-model="nuevoarray.tdp_secuencial_memo" />
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
    </vs-row>
    <br><br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarnuevoeditar_DepartamentosProlipa()" type="relief">Guardar</vs-button>&emsp;
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
            tdp_id: 0,
            nuevoarray: {
                tdp_nombre: '',
                tdp_iniciales: '',
                tdp_secuencial_acta_entrega: 0,
                tdp_secuencial_memo: 0,
            },
            classvalidar_tdp_nombre: '',
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
        tab_DepartamentosProlipa: {
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
            me.nuevoarray.tdp_nombre = '';
            me.nuevoarray.created_by = usuarioObjeto.idusuario;
            me.nuevoarray.updated_by = usuarioObjeto.idusuario;
            // me.getNuevoContUserAgrupacion();
        } else if (me.verificarcrear_actualizar == 'update') {
            // console.log("Entro en actualizar");
            me.nuevoarray.tdp_id = me.tab_DepartamentosProlipa.tdp_id;
            me.nuevoarray.tdp_nombre = me.tab_DepartamentosProlipa.tdp_nombre;
            me.nuevoarray.tdp_iniciales = me.tab_DepartamentosProlipa.tdp_iniciales;
            me.nuevoarray.tdp_secuencial_acta_entrega = me.tab_DepartamentosProlipa.tdp_secuencial_acta_entrega;
            me.nuevoarray.tdp_secuencial_memo = me.tab_DepartamentosProlipa.tdp_secuencial_memo;
            me.nuevoarray.updated_by = usuarioObjeto.idusuario;
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
        validarcampo_tdp_nombre() {
            let me = this;
            const focusnombreInstitucion = me.$refs.tdp_nombre.$el.querySelector('input');
            focusnombreInstitucion.focus();
            me.classvalidar_tdp_nombre = 'stylevalidar';
            //Notificación de vacio
            me.$vs.notify({
                text: 'Escriba el nombre de la departamento prolipa antes de guardar',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                me.classvalidar_tdp_nombre = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        guardarnuevoeditar_DepartamentosProlipa() {
            let me = this;
            let datos = {};
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            if (me.nuevoarray.tdp_nombre === '' || me.nuevoarray.tdp_nombre === null || me.nuevoarray.tdp_nombre === 0) {
                me.validarcampo_tdp_nombre();
                return;
            }
            me.$vs.loading()
            if (me.verificarcrear_actualizar === 'create') {
                datos = {
                    "action": "Post_Registrar_modificar_DepartamentosProlipa",
                    "tdp_nombre": this.nuevoarray.tdp_nombre,
                    "tdp_iniciales": this.nuevoarray.tdp_iniciales,
                    "tdp_secuencial_acta_entrega": this.nuevoarray.tdp_secuencial_acta_entrega,
                    "tdp_secuencial_memo": this.nuevoarray.tdp_secuencial_memo,
                    "created_by": this.nuevoarray.created_by,
                    "updated_by": this.nuevoarray.updated_by
                }
            } else if (me.verificarcrear_actualizar === 'update') {
                datos = {
                    "action": "Post_Registrar_modificar_DepartamentosProlipa",
                    "tdp_id": this.nuevoarray.tdp_id,
                    "tdp_nombre": this.nuevoarray.tdp_nombre,
                    "tdp_iniciales": this.nuevoarray.tdp_iniciales,
                    "tdp_secuencial_acta_entrega": this.nuevoarray.tdp_secuencial_acta_entrega,
                    "tdp_secuencial_memo": this.nuevoarray.tdp_secuencial_memo,
                    "created_by": this.nuevoarray.created_by,
                    "updated_by": this.nuevoarray.updated_by
                }
            } else {
                console.log("Guardado no controlado");
            }
            // console.log(datos,'datos');
            // return
            //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url + 'VerifcarMetodosPost_DepartamentosProlipa', datos)
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



