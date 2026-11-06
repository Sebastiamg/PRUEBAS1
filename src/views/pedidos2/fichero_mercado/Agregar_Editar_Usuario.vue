<template>
<vx-card fixed-height="true">
    <vs-row>
        <vs-divider>Información</vs-divider>
        <!-- {{ verificarcrear_actualizarUsuario }}<br>
        {{ nuevoarray }} -->
        <!-- {{ verificarcrear_actualizarUsuario }} -->
        <vs-row vs-align="center">
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="start" vs-lg="10" vs-sm="8" vs-xs="8">
                        <div class="w-full flex flex-col">
                            <vs-input label="Cédula o RUC" placeholder="Cédula o RUC" class="w-full" icon="mode_edit" ref="cedula" :class="classvalidar_cedula" v-model="nuevoarray.cedula" @keypress="validarkey_cedula($event)" @paste="validarnopegar($event)" :readonly="verificarcrear_actualizarUsuario === 'update' && cedulaOriginal !== null" />
                            <div v-if="verificarcrear_actualizarUsuario === 'create' || (verificarcrear_actualizarUsuario === 'update' && cedulaOriginal === null)" class="text-warning text-sm mt-2">
                                ⚠️ Si ingresa una cédula, asegúrese de escribirla correctamente, no podrá editarla luego.
                            </div>
                        </div>
                    </vs-col>
                </vs-row>
            </vs-col>

            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="10" vs-sm="8" vs-xs="8">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Nombre" placeholder="Nombre" class="w-full" icon="mode_edit" ref="nombres" :class="classvalidar_nombres" v-model="nuevoarray.nombres" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="10" vs-sm="8" vs-xs="8">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Apellido" placeholder="Apellido" class="w-full" icon="mode_edit" ref="apellidos" :class="classvalidar_apellidos" v-model="nuevoarray.apellidos" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="10" vs-sm="8" vs-xs="8">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Correo" placeholder="Correo" class="w-full" icon="mode_edit" ref="email" :class="classvalidar_email" v-model="nuevoarray.email" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="10" vs-sm="8" vs-xs="8">
                        <!-- {{tabusuario.pv_tipo_usuario}}  //Para ver que propiedad quiero guardar -->
                        <vs-input label="Teléfono" placeholder="Teléfono" class="w-full" icon="mode_edit" ref="telefono" :class="classvalidar_telefono" v-model="nuevoarray.telefono" @keypress="validarkey_telefono($event)" @paste="validarnopegar($event)" />
                    </vs-col>
                </vs-row>
            </vs-col>
            <vs-col vs-justify="center" vs-align="center" vs-lg="12" vs-sm="12" vs-xs="12">
                <vs-row vs-type="flex" vs-justify="center" vs-w="12">
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-lg="10" vs-sm="8" vs-xs="8">
                        <table class="w-full">
                            <tr>
                                <td>
                                    <font style="font-size: 11.5px">Fecha de Nacimiento</font>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <div class="flex items-center ">
                                        <flat-pickr :config="configdateTimePicker" v-model="nuevoarray.fecha_nacimiento" placeholder="Fecha Nacimiento" class="w-full" />
                                        <vs-button color="danger" type="flat" icon-pack="feather" icon="icon-x-circle" size="small" @click="limpiarFechaNacimiento" title="Limpiar fecha">
                                            Limpiar
                                        </vs-button>
                                    </div>
                                </td>
                            </tr>
                        </table>
                    </vs-col>
                </vs-row>
            </vs-col>
        </vs-row>
    </vs-row>
    <!-- {{ itemUsuarioPlantelEnviar }} -->
    <br><br>
    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-2">
        <vs-button @click="guardarnuevoeditarClientePompy()" type="relief">Guardar</vs-button>&emsp;
        <vs-button @click="getCancelar()" color="danger" type="relief">Cancelar</vs-button>
    </vs-col>
    <br>
    <br>
</vx-card>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import {
    Spanish
} from 'flatpickr/dist/l10n/es.js'
flatpickr.localize(Spanish)
import {
    mapState
} from "vuex";
import vSelect from "vue-select";
export default {
    data() {
        return {
            nuevoarray: {},
            classvalidar_cedula: '',
            classvalidar_nombres: '',
            classvalidar_apellidos: '',
            classvalidar_email: '',
            classvalidar_telefono: '',
            configdateTimePicker: {
                // enableTime: true,
                altInput: true,
                altFormat: 'Y-F-d', // Esto es lo que se ve: 2025-Mayo-02
                dateFormat: 'Y-m-d', // Esto es lo que se envía: 2025-05-02
                maxDate: new Date()
            },
            cedulaOriginal: null,
        };
    },
    components: {
        "v-select": vSelect,
        flatPickr,
    },
    props: {
        verificarcrear_actualizarUsuario: {
            type: String,
            default: '',
        },
        institucionSeleccionada: {
            type: Object,
            default: () => ({})
        },
        itemUsuarioPlantelEnviar: {
            type: Object,
            default: () => ({})
        }
    },
    mounted() {
        let me = this;
        const usuariorespo = localStorage.getItem("usuario");
        const usuarioObjeto = JSON.parse(usuariorespo);
        if (me.verificarcrear_actualizarUsuario === 'create') {
            me.nuevoarray = {
                cedula: '',
                nombres: '',
                apellidos: '',
                telefono: '',
                email: '',
                fecha_nacimiento: null,
                idcreadorusuario: usuarioObjeto.idusuario, // se guarda quién lo creó
            };
            me.cedulaOriginal = null; // siempre editable
            // me.getNuevoContUserAgrupacion();
        } else if (me.verificarcrear_actualizarUsuario === 'update') {
            // console.log("Entro en actualizar");
            me.nuevoarray = {
                idusuario: this.itemUsuarioPlantelEnviar.idusuario,
                cedula: this.itemUsuarioPlantelEnviar.cedula,
                nombres: this.itemUsuarioPlantelEnviar.nombres,
                apellidos: this.itemUsuarioPlantelEnviar.apellidos,
                telefono: this.itemUsuarioPlantelEnviar.telefono,
                email: this.itemUsuarioPlantelEnviar.email,
                fecha_nacimiento: this.itemUsuarioPlantelEnviar.fecha_nacimiento,
                idcreadorusuario: usuarioObjeto.idusuario, // se guarda quién lo creó
            };
            me.cedulaOriginal = this.itemUsuarioPlantelEnviar.cedula; // puede ser null
        } else {
            console.log("Validación no controlada");
        }
    },
    computed: {
        ...mapState(["auth", 'userRoot', 'susuario', 'userAsesor', 'AdminBodega']),
    },
    methods: {
        validarkey_cedula(event) {
            let cedula = this.nuevoarray.cedula;
            // Verificar si la tecla presionada es un número.
            if (!/\d/.test(event.key)) {
                event.preventDefault();
            }
            // Validar el formato del número
            if (!/^\d{0,15}(\.\d{0,0})?$/.test(cedula)) {
                this.nuevoarray.cedula = '';
                console.log("reset");
            }
        },
        validarkey_telefono(event) {
            let secuencial = this.nuevoarray.tdo_secuencial;
            // Verificar si la tecla presionada es un número.
            if (!/\d/.test(event.key)) {
                event.preventDefault();
            }
            // Validar el formato del número
            if (!/^\d{0,10}(\.\d{0,0})?$/.test(secuencial)) {
                this.nuevoarray.tdo_secuencial = '';
                console.log("reset");
            }
        },
        validarnopegar(event) {
            // Obtener el texto pegado
            let pastedText = (event.clipboardData || window.clipboardData).getData('text');
            // Verificar si el texto pegado contiene solo números
            if (!/^\d+$/.test(pastedText)) {
                event.preventDefault();
                return;
            }
        },
        alert_cedula() {
            const focus_cedula = this.$refs.cedula.$el.querySelector('input');
            focus_cedula.focus();
            this.classvalidar_cedula = 'stylevalidar';
            this.$vs.notify({
                text: 'Escriba la cédula antes de guardar',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                this.classvalidar_cedula = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        alert_nombres() {
            const focus_nombres = this.$refs.nombres.$el.querySelector('input');
            focus_nombres.focus();
            this.classvalidar_nombres = 'stylevalidar';
            this.$vs.notify({
                text: 'Escriba un nombre antes de guardar',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                this.classvalidar_nombres = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        alert_apellidos() {
            const focus_apellidos = this.$refs.apellidos.$el.querySelector('input');
            focus_apellidos.focus();
            this.classvalidar_apellidos = 'stylevalidar';
            this.$vs.notify({
                text: 'Escriba una letra antes de guardar',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                this.classvalidar_apellidos = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        alert_telefono() {
            const focus_telefono = this.$refs.telefono.$el.querySelector('input');
            focus_telefono.focus();
            this.classvalidar_telefono = 'stylevalidar';
            this.$vs.notify({
                text: 'Escriba un teléfono antes de guardar',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
            });
            // Quitar la clase después de la duración de la animación
            setTimeout(() => {
                this.classvalidar_telefono = '';
            }, 1500); // Ajusta según la duración de tu animación
        },
        alert_email(mensaje = 'Escriba un email válido antes de guardar') {
            const focus_email = this.$refs.email.$el.querySelector('input');
            focus_email.focus();
            this.classvalidar_email = 'stylevalidar';
            this.$vs.notify({
                text: mensaje,
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 5000
            });
            setTimeout(() => {
                this.classvalidar_email = '';
            }, 1500);
        },
        validarEmailBasico(email) {
            // Expresión regular básica: algo@algo.algo
            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return regex.test(email);
        },
        guardarnuevoeditarClientePompy() {
            let me = this;
            //VALIDACION DE CAMPOS NULOS Y VACIOS
            // if (this.nuevoarray.cedula === '' || this.nuevoarray.cedula === null || this.nuevoarray.cedula === 'undefined') {
            //     this.alert_cedula();
            //     return;
            // }
            if (this.nuevoarray.nombres === '' || this.nuevoarray.nombres === null || this.nuevoarray.nombres === 'undefined') {
                this.alert_nombres();
                return;
            }
            if (this.nuevoarray.apellidos === '' || this.nuevoarray.apellidos === null || this.nuevoarray.apellidos === 'undefined') {
                this.alert_apellidos();
                return;
            }
            // if (this.nuevoarray.email === '' || this.nuevoarray.email === null || this.nuevoarray.email === 'undefined') {
            //     this.alert_email('Escriba un email antes de guardar');
            //     return;
            // }
            if (this.nuevoarray.email !== '' && this.nuevoarray.email !== null && this.nuevoarray.email !== undefined) {
                if (!this.validarEmailBasico(this.nuevoarray.email)) {
                    this.alert_email('Ingrese un correo válido (ej: usuario@dominio.com)');
                    return;
                }
            }
            if (this.nuevoarray.telefono === '' || this.nuevoarray.telefono === null || this.nuevoarray.telefono === 'undefined') {
                this.alert_telefono();
                return;
            }
            me.$vs.loading()

            // Construcción de datos según acción
            let datos = {
                cedula: this.nuevoarray.cedula,
                nombres: this.nuevoarray.nombres,
                apellidos: this.nuevoarray.apellidos,
                email: this.nuevoarray.email,
                telefono: this.nuevoarray.telefono,
                fecha_nacimiento: this.nuevoarray.fecha_nacimiento
            };
            let mensaje = ""; // mensaje dinámico según acción
            if (me.verificarcrear_actualizarUsuario === 'create') {
                datos.idcreadorusuario = this.nuevoarray.idcreadorusuario;
                datos.institucion_idInstitucion = this.institucionSeleccionada.idInstitucion;
                mensaje = "Usuario creado con éxito.";
            } else if (me.verificarcrear_actualizarUsuario === 'update') {
                datos.idusuario = this.nuevoarray.idusuario;
                datos.modificado_por = this.nuevoarray.modificado_por;
                mensaje = "Usuario actualizado con éxito.";
            } else {
                console.log("Guardado no controlado");
                me.$vs.loading.close();
                return;
            }
            // console.log(datos, 'hola');
            // return
            //axios.post(this.$apifacturacion_url + 'f_Vendedor', datos)
            this.$http.post(this.$server_url + 'PostCrearEditarUsuariosFichero', datos)
                .then(res => {
                    me.$vs.loading.close()
                    // this.getContUserAgrupacionParametro();
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                    } else if (res.data.status == 1) {
                        me.$vs.notify({
                            text: mensaje,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$emit('change', {
                            verificar_CrearEditarUsuario: 1,
                            idusuario_enviar: datos.idusuario,
                            cedula: datos.cedula,
                            email: datos.email
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
                verificar_CrearEditarUsuario: 2
            });
        },
        limpiarFechaNacimiento() {
            this.nuevoarray.fecha_nacimiento = null;
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
