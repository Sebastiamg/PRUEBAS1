<template>
<vx-card title="Mi Perfil" class="rounded-2xl shadow-md overflow-hidden">
    <vs-tabs alignment="fixed" color="primary" class="perfil-tabs">
        <!-- 🧍 TAB 1: DATOS PERSONALES -->
        <vs-tab label="Datos Personales">
            <div class="p-6 space-y-6">
                <!-- Sección de Foto de Perfil -->
                <div class="vx-row mb-8">
                    <div class="vx-col w-full">
                        <div class="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
                            <div class="mb-4">
                                <h4 class="text-lg font-semibold text-gray-700 mb-2">
                                    <i class="feather icon-user mr-2"></i>Foto de Perfil
                                </h4>
                            </div>
                            <!-- Vista previa de la foto -->
                            <div class="mb-6">
                                <div v-if="previewImage && !muyPesado" class="mb-4">
                                    <div class="relative inline-block">
                                        <img :src="previewImage" class="mx-auto block shadow-lg rounded-full w-32 h-32 object-cover border-4 border-green-400 image-zoom-hover cursor-pointer" alt="Preview de la nueva foto" @click="mostrarImagenCompleta(previewImage)" />
                                        <div class="absolute -top-2 -right-2 bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center">
                                            <i class="feather icon-check text-sm"></i>
                                        </div>
                                    </div>
                                    <p class="text-sm text-green-600 mt-2 font-medium">
                                        <i class="feather icon-upload mr-1"></i>Nueva foto seleccionada
                                    </p>
                                    <p class="text-xs text-gray-500">{{ selectedFileName }} ({{ pesoArchivo }} MB)</p>
                                    <p class="text-xs text-blue-500 mt-1">
                                        <i class="feather icon-eye mr-1"></i>Click para ver en tamaño completo
                                    </p>
                                    <vs-button @click="cancelarSeleccion" size="small" type="border" color="danger" class="mt-2">
                                        <i class="feather icon-x mr-1"></i>Cancelar
                                    </vs-button>
                                </div>
                                <!-- Foto actual -->
                                <div v-else-if="usuario.foto_user && usuario.foto_user != 'default.png'">
                                    <vs-avatar class="mx-auto block shadow-lg image-zoom-hover cursor-pointer" size="7.5rem" :src="$data_url + 'archivos/perfil/' + usuario.foto_user" @click="mostrarImagenCompleta($data_url + 'archivos/perfil/' + usuario.foto_user)" />
                                    <p class="text-sm text-gray-500 mt-2">Foto actual</p>
                                    <p class="text-xs text-blue-500 mt-1">
                                        <i class="feather icon-eye mr-1"></i>Click para ver en tamaño completo
                                    </p>
                                </div>
                                <!-- Sin foto -->
                                <div v-else>
                                    <div class="mx-auto flex items-center justify-center w-32 h-32 bg-gray-200 rounded-full border-4 border-gray-300">
                                        <i class="feather icon-user text-4xl text-gray-400"></i>
                                    </div>
                                    <p class="text-sm text-gray-500 mt-2">Sin foto asignada</p>
                                </div>
                            </div>
                            <!-- Input de archivo -->
                            <div class="mb-4">
                                <label for="profileFile" class="cursor-pointer">
                                    <div class="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 shadow-md">
                                        <i class="feather icon-upload mr-2"></i>
                                        <span>Seleccionar Nueva Foto</span>
                                    </div>
                                </label>
                                <input type="file" id="profileFile" class="hidden" @change="obtenerImagen" accept="image/png, image/gif, image/jpeg, image/jpg" />
                            </div>
                            <!-- Info -->
                            <div class="text-sm text-gray-600 space-y-1">
                                <p><i class="feather icon-info mr-1"></i>Tamaño máximo: {{ limiteMegas }} MB</p>
                                <p><i class="feather icon-check-circle mr-1"></i>Formatos: PNG, JPG, JPEG, GIF</p>
                                <p><i class="feather icon-square mr-1"></i>Recomendado: 300x18.75rem o superior</p>
                            </div>
                            <div v-if="msj" class="mt-4 p-3 bg-red-100 border border-red-300 rounded-lg">
                                <p class="text-red-700 text-sm">
                                    <i class="feather icon-alert-triangle mr-1"></i>{{ msj }}
                                </p>
                            </div>
                            <div v-if="porcentaje > 0" class="mt-4">
                                <div class="mb-2">
                                    <span class="text-sm font-medium text-gray-700">Subiendo archivo...</span>
                                </div>
                                <vs-progress :percent="porcentaje" color="success" class="w-full">
                                    {{ porcentaje }}%
                                </vs-progress>
                            </div>
                        </div>
                    </div>
                </div>
                <!-- Datos básicos -->
                <div class="vx-row mb-6">
                    <div class="vx-col w-full sm:w-1/2">
                        <vs-input class="w-full" icon-pack="feather" disabled icon="icon-smartphone" icon-no-border label="Cédula" v-model="usuario.cedula" />
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col w-full sm:w-1/2">
                        <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="usuario.nombres" />
                    </div>
                    <div class="vx-col w-full sm:w-1/2">
                        <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="usuario.apellidos" />
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col w-full sm:w-1/2">
                        <vs-input type="email" class="w-full" disabled icon-pack="feather" icon="icon-mail" icon-no-border label="Correo" v-model="usuario.email" />
                    </div>
                    <div class="vx-col w-full sm:w-1/2">
                        <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Teléfono" v-model="usuario.telefono" />
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col w-full sm:w-1/2">
                        <v-select :options="nacionalidades" label="nacionalidad" :reduce="item => item.nacionalidad" placeholder="--Seleccione Nacionalidad--" class="w-full" v-model="usuario.nacionalidad" />
                    </div>
                    <div class="vx-col w-full sm:w-1/2">
                        <ul class="flex mt-5">
                            <li>
                                <vs-radio v-model="usuario.sexo" vs-name="radios1" vs-value="hombre">Hombre</vs-radio>
                            </li>
                            <li>
                                <vs-radio v-model="usuario.sexo" class="ml-2" vs-name="radios1" vs-value="mujer">Mujer</vs-radio>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="vx-row mb-6" v-show="usuario.id_group == 4">
                    <div class="vx-col w-full sm:w-1/2">
                        Grado:
                        <v-select :options="cursos" :reduce="cursos => cursos" label="nombrenivel" class="w-full" v-model="usuario.curso" />
                    </div>
                    <div class="vx-col w-full sm:w-1/2">
                        Paralelo
                        <v-select id="paralelo" :options="paralelos" :reduce="paralelos => paralelos" label="descripcion" class="w-full" v-model="usuario.paralelo" />
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full">
                        <span>Fecha Nacimiento</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                        <flat-pickr :config="configdateTimePicker" v-model="usuario.fecha_nacimiento" placeholder="Fecha Nacimiento" class="m-1" style="display: inline-block;width: 100%" />
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full">
                        <span>Ciudad</span>
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                        <p>{{ usuario.ciudad }}</p>
                    </div>
                </div>
                <div class="vx-row mb-6">
                    <div class="vx-col sm:w-1/3 w-full">
                        <span>Institución</span>
                        <vs-input class="w-full" type="tel" hidden icon-pack="feather" v-model="usuario.institucion_idInstitucion" />
                    </div>
                    <div class="vx-col sm:w-2/3 w-full">
                        <p>{{ usuario.nombreInstitucion }}</p>
                    </div>
                </div>
                <div class="vx-row text-center">
                    <vs-button @click="guardar" class="w-full mt-4" color="success" icon="icon-save">
                        Guardar Cambios
                    </vs-button>
                </div>
            </div>
        </vs-tab>
        <!-- 🪪 TAB 2: CAMBIO DE CONTRASEÑA -->
        <vs-tab label="Cambio de contraseña">
            <div class="p-6 max-w-xl mx-auto">

                <!-- Header con gradiente -->
                <div class="pwd-perfil-header">
                    <div class="pwd-perfil-icon">
                        <i class="fa-solid fa-key"></i>
                    </div>
                    <div>
                        <div class="pwd-perfil-title">Cambio de contraseña</div>
                        <p class="pwd-perfil-subtitle">Verifica tu identidad e ingresa una nueva contraseña segura.</p>
                    </div>
                </div>

                <!-- Contraseña actual -->
                <div class="pwd-perfil-field">
                    <label class="pwd-perfil-label">Contraseña actual</label>
                    <div class="pwd-perfil-input-wrap">
                        <input
                            ref="password_actual"
                            :type="showPasswordActual ? 'text' : 'password'"
                            class="pwd-perfil-input"
                            :class="classvalidar_password_actual ? 'pwd-perfil-input-error' : ''"
                            placeholder="Ingresa tu contraseña actual"
                            v-model="formCambioPassword.password_actual"
                            @input="quitarEspaciosPwd('password_actual')"
                        />
                        <button class="pwd-perfil-toggle" type="button" @click="showPasswordActual = !showPasswordActual">
                            <i :class="showPasswordActual ? 'feather icon-eye' : 'feather icon-eye-off'"></i>
                        </button>
                    </div>
                </div>

                <!-- Checklist -->
                <div class="pwd-perfil-rules" style="margin-bottom: 20px;">
                    <div class="pwd-perfil-rule" :class="reglasPerfil.longitud ? 'ok' : 'fail'">
                        <i :class="reglasPerfil.longitud ? 'feather icon-check-circle' : 'feather icon-circle'"></i>
                        Mínimo 8 caracteres
                    </div>
                    <div class="pwd-perfil-rule" :class="reglasPerfil.maximo ? 'ok' : 'fail'">
                        <i :class="reglasPerfil.maximo ? 'feather icon-check-circle' : 'feather icon-circle'"></i>
                        Máximo 64 caracteres
                    </div>
                    <div class="pwd-perfil-rule" :class="reglasPerfil.letras ? 'ok' : 'fail'">
                        <i :class="reglasPerfil.letras ? 'feather icon-check-circle' : 'feather icon-circle'"></i>
                        Al menos una letra
                    </div>
                    <div class="pwd-perfil-rule" :class="reglasPerfil.numero ? 'ok' : 'fail'">
                        <i :class="reglasPerfil.numero ? 'feather icon-check-circle' : 'feather icon-circle'"></i>
                        Al menos un número (0-9)
                    </div>
                </div>

                <!-- Nueva contraseña -->
                <div class="pwd-perfil-field">
                    <label class="pwd-perfil-label">Nueva contraseña</label>
                    <div class="pwd-perfil-input-wrap">
                        <input
                            ref="password_nuevo"
                            :type="showPasswordNuevo ? 'text' : 'password'"
                            class="pwd-perfil-input"
                            :class="classvalidar_password_nuevo ? 'pwd-perfil-input-error' : ''"
                            placeholder="Ingresa tu nueva contraseña"
                            v-model="formCambioPassword.password_nuevo"
                            @input="evaluarFortalezaPerfil"
                        />
                        <button class="pwd-perfil-toggle" type="button" @click="showPasswordNuevo = !showPasswordNuevo">
                            <i :class="showPasswordNuevo ? 'feather icon-eye' : 'feather icon-eye-off'"></i>
                        </button>
                    </div>

                    <!-- Barra de fortaleza -->
                    <div class="pwd-perfil-strength-wrap" style="margin-top: 5px; margin-bottom: 15px;">
                        <div class="pwd-perfil-bar">
                            <div class="pwd-perfil-bar-fill" :style="{ width: fortalezaPerfilPct + '%', background: fortalezaPerfilColor }"></div>
                        </div>
                        <span class="pwd-perfil-bar-label" :style="{ color: fortalezaPerfilColor }">{{ fortalezaPerfilTexto }}</span>
                    </div>
                </div>

                <!-- Confirmar nueva contraseña -->
                <div class="pwd-perfil-field">
                    <label class="pwd-perfil-label">Confirmar nueva contraseña</label>
                    <div class="pwd-perfil-input-wrap">
                        <input
                            ref="password_confirm"
                            :type="showPasswordConfirm ? 'text' : 'password'"
                            class="pwd-perfil-input"
                            :class="{
                                'pwd-perfil-input-error': formCambioPassword.password_confirm.length > 2 && formCambioPassword.password_confirm !== formCambioPassword.password_nuevo,
                                'pwd-perfil-input-ok': formCambioPassword.password_confirm.length > 2 && formCambioPassword.password_confirm === formCambioPassword.password_nuevo
                            }"
                            placeholder="Confirma tu nueva contraseña"
                            v-model="formCambioPassword.password_confirm"
                        />
                        <button class="pwd-perfil-toggle" type="button" @click="showPasswordConfirm = !showPasswordConfirm">
                            <i :class="showPasswordConfirm ? 'feather icon-eye' : 'feather icon-eye-off'"></i>
                        </button>
                    </div>
                    <p v-if="formCambioPassword.password_confirm.length > 2 && formCambioPassword.password_confirm !== formCambioPassword.password_nuevo" class="pwd-perfil-msg-error">
                        <i class="feather icon-alert-triangle"></i> Las contraseñas no coinciden
                    </p>
                    <p v-if="formCambioPassword.password_confirm.length > 2 && formCambioPassword.password_confirm === formCambioPassword.password_nuevo" class="pwd-perfil-msg-ok">
                        <i class="feather icon-check-circle"></i> Las contraseñas coinciden
                    </p>
                </div>

                <!-- Botón -->
                <button
                    class="pwd-perfil-btn"
                    :class="formularioPerfilValido ? 'pwd-perfil-btn-active' : 'pwd-perfil-btn-disabled'"
                    :disabled="!formularioPerfilValido"
                    @click="Confirmar_cambio_password()">
                    <i class="feather icon-key"></i>
                    Confirmar cambio de contraseña
                </button>

            </div>
        </vs-tab>
    </vs-tabs>
    <!-- Modal Imagen -->
    <vs-popup class="image-modal" title="Foto de Perfil" :active.sync="mostrarModal">
        <div class="text-center p-4">
            <img :src="imagenModal" class="max-w-full max-h-96 mx-auto rounded-lg shadow-lg" alt="Foto de perfil completa" />
            <div class="mt-4">
                <vs-button @click="mostrarModal = false" color="primary">Cerrar</vs-button>
            </div>
        </div>
    </vs-popup>
</vx-card>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueDocPreview from 'vue-doc-preview'
import Vue from 'vue'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import nacionalidades from './nacionalidades.json';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        vueDropzone: vue2Dropzone,
        VueDocPreview,
        flatPickr
    },
    data() {
        return {
            file: null,
            user: [],
            usuario: [],
            error: '',
            password: '',
            passwordc: '',
            btn: true,
            ciudad: [],
            instituciones: [],
            idregion: '',
            idciudad: '',
            ciudadSelect: '',
            institucion_estudiante: [],
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            paralelos: [],
            cursos: [],
            nacionalidades: [],
            // Variables para la funcionalidad de preview de imagen
            limiteMegas: 2,
            porcentaje: 0,
            pesoArchivo: '',
            muyPesado: false,
            msj: '',
            previewImage: null,
            selectedFileName: '',
            // Variables para el modal de imagen
            mostrarModal: false,
            imagenModal: '',
            formCambioPassword: {
                password_actual: '',
                password_nuevo: '',
                password_confirm: ''
            },
            // Toggle visibilidad contraseñas
            showPasswordActual:  false,
            showPasswordNuevo:   false,
            showPasswordConfirm: false,
            // Validación class (error flash)
            classvalidar_password_actual:  '',
            classvalidar_password_nuevo:   '',
            classvalidar_password_confirm: '',
            // Contraseña (Perfil)
            reglasPerfil: {
                longitud:  false,
                maximo:    false,
                letras:    false,
                numero:    false,
            },
        }
    },
    created() {
        this.nacionalidades = nacionalidades;
        this.infoRegistro();
        this.user = JSON.parse(localStorage.getItem('usuario'));
        this.institucion_estudiante = {
            idInstitucion: this.usuario.institucion_idInstitucion,
            nombreInstitucion: this.usuario.nombreInstitucion
        }
    },
    mounted() {
        let me = this;
        me.getCiudadSelect();
        me.getInstituciones();
        me.userInfo();
    },
    computed: {
        activeUserInfo() {
            return this.$store.state.AppActiveUser
        },
        reglasPerfilAprobadas() {
            return Object.values(this.reglasPerfil).filter(v => v).length;
        },
        fortalezaPerfilPct() {
            if (this.formCambioPassword.password_nuevo.length === 0) return 0;
            return (this.reglasPerfilAprobadas / 4) * 100;
        },
        fortalezaPerfilColor() {
            if (this.formCambioPassword.password_nuevo.length === 0) return '#cbd5e1';
            const c = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
            return c[Math.max(0, this.reglasPerfilAprobadas - 1)] || '#ef4444';
        },
        fortalezaPerfilTexto() {
            if (this.formCambioPassword.password_nuevo.length === 0) return 'Escribe tu contraseña';
            const t = ['Muy débil', 'Débil', 'Buena', 'Fuerte ✓'];
            return t[Math.max(0, this.reglasPerfilAprobadas - 1)] || 'Muy débil';
        },
        formularioPerfilValido() {
            return this.reglasPerfilAprobadas === 4
                && this.formCambioPassword.password_actual.trim() !== ''
                && this.formCambioPassword.password_nuevo === this.formCambioPassword.password_confirm;
        }
    },
    methods: {
        quitarEspaciosPwd(campo) {
            if (this.formCambioPassword[campo] !== undefined) {
                this.formCambioPassword[campo] = this.formCambioPassword[campo].replace(/\s/g, '');
            }
        },
        quitarEspacios(campo) {
            if (this.formCambioPassword[campo]) {
                this.formCambioPassword[campo] = this.formCambioPassword[campo].replace(/\s/g, '');
            }
        },
        evaluarFortalezaPerfil() {
            const p = this.formCambioPassword.password_nuevo;
            this.reglasPerfil.longitud  = p.length >= 8;
            this.reglasPerfil.maximo    = p.length > 0 && p.length <= 64;
            this.reglasPerfil.letras    = /[a-zA-Z]/.test(p);
            this.reglasPerfil.numero    = /[0-9]/.test(p);
        },
        validarcampo_password_actual(textonotify) {
            let me = this;
            if (me.$refs.password_actual) me.$refs.password_actual.focus();
            me.classvalidar_password_actual = 'stylevalidar';
            me.$vs.notify({
                text: textonotify,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000
            });
            setTimeout(() => { me.classvalidar_password_actual = ''; }, 1500);
        },
        validarcampo_password_nuevo() {
            let me = this;
            if (me.$refs.password_nuevo) me.$refs.password_nuevo.focus();
            me.classvalidar_password_nuevo = 'stylevalidar';
            me.$vs.notify({
                text: 'Ingresa tu contraseña nueva.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000
            });
            setTimeout(() => { me.classvalidar_password_nuevo = ''; }, 1500);
        },
        validarcampo_password_confirm() {
            let me = this;
            if (me.$refs.password_confirm) me.$refs.password_confirm.focus();
            me.classvalidar_password_confirm = 'stylevalidar';
            me.$vs.notify({
                text: 'Confirma tu contraseña nueva.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000
            });
            setTimeout(() => { me.classvalidar_password_confirm = ''; }, 1500);
        },
        validar_passwords_no_coinciden() {
            let me = this;
            if (me.$refs.password_confirm) me.$refs.password_confirm.focus();
            me.classvalidar_password_confirm = 'stylevalidar';
            me.classvalidar_password_nuevo   = 'stylevalidar';
            me.$vs.notify({
                text: 'Las contraseñas no coinciden. Verifica e inténtalo nuevamente.',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-x-circle',
                time: 8000
            });
            setTimeout(() => {
                me.classvalidar_password_confirm = '';
                me.classvalidar_password_nuevo   = '';
            }, 1500);
        },
        validar_password_repetido(mensaje) {
            let me = this;
            if (me.$refs.password_nuevo) me.$refs.password_nuevo.focus();
            me.classvalidar_password_nuevo   = 'stylevalidar';
            me.classvalidar_password_confirm = 'stylevalidar';
            me.$vs.notify({
                text: mensaje,
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000
            });
            setTimeout(() => {
                me.classvalidar_password_nuevo   = '';
                me.classvalidar_password_confirm = '';
            }, 1500);
        },
        validar_password_minima_longitud() {
            let me = this;
            if (me.$refs.password_nuevo) me.$refs.password_nuevo.focus();
            me.classvalidar_password_nuevo = 'stylevalidar';
            me.$vs.notify({
                text: 'La contraseña nueva debe tener al menos 8 caracteres.',
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle',
                time: 8000
            });
            setTimeout(() => { me.classvalidar_password_nuevo = ''; }, 1500);
        },
        infoRegistro() {
            let me = this;
            this.$http.get(this.$server_url + 'infoRegistro')
                .then(function (res) {
                    me.paralelos = res.data.paralelos
                    me.cursos = res.data.cursos

                })
                .catch(function (error) {
                    console.log(error + ' error');

                })
        },
        userInfo() {
            let me = this;
            this.$http.get(this.$server_url + 'userInformacion?idusuario=' + me.user.idusuario)
                .then(function (res) {
                    me.usuario = res.data[0]
                    me.usuario.curso = {
                        orden: me.usuario.curso,
                        nombrenivel: me.usuario.nombrenivel
                    };
                    me.usuario.paralelo = {
                        paralelo_id: me.usuario.paralelo,
                        descripcion: me.usuario.descripcion
                    };

                })
                .catch(function (error) {
                    console.log(error + ' error');

                })
        },
        verificar() {
            var n = this.password.localeCompare(this.passwordc);
            if (n == 0) {
                this.btn = false;
                this.error = ""
            } else {
                this.btn = true;
                this.error = "Contraseñas no coinciden"
            }
        },
        async guardar() {
            let me = this

            if (me.usuario.nombres.length >= 200 && me.usuario.nombres !== '') {
                me.$vs.notify({
                    color: 'warning',
                    title: 'Mensaje',
                    text: 'Los nombres no pueden un maximo de 200 caracteres'
                })
                return false;
            }

            if (me.usuario.apellidos && me.usuario.apellidos.length >= 200) {
                me.$vs.notify({
                    color: 'warning',
                    title: 'Mensaje',
                    text: 'Los apellidos no pueden tener más de 200 caracteres'
                });
                return false;
            }

            // Validación para que teléfono tenga solo números
            if (me.usuario.telefono && !/^\d+$/.test(me.usuario.telefono)) {
                me.$vs.notify({
                    color: 'warning',
                    title: 'Error',
                    text: 'El teléfono solo puede contener números'
                });
                return false;
            }
            if (me.usuario.telefono && me.usuario.telefono.length > 15) {
                me.$vs.notify({
                    color: 'warning',
                    title: 'Mensaje',
                    text: 'El teléfono no puede tener más de 15 caracteres'
                });
                return false;
            }

            let formData = new FormData();
            // Solo agregar archivo si se seleccionó uno nuevo
            if (me.file) {
                formData.append('archivo', me.file);
            }
            formData.append('idusuario', this.usuario.idusuario);
            formData.append('nombres', this.usuario.nombres);
            formData.append('apellidos', this.usuario.apellidos);
            formData.append('telefono', this.usuario.telefono || '');
            formData.append('nacionalidad', this.usuario.nacionalidad || '');
            formData.append('fecha_nacimiento', this.usuario.fecha_nacimiento || '');

            if (this.usuario.curso == null || this.usuario.curso == undefined || this.usuario.curso == "") {

            } else {
                formData.append('curso', this.usuario.curso.orden);
            }
            if (this.usuario.paralelo == null || this.usuario.paralelo == undefined || this.usuario.paralelo == "") {

            } else {
                formData.append('paralelo', this.usuario.paralelo.paralelo_id);
            }
            formData.append('genero', this.usuario.sexo || '');
            me.$vs.loading();

            axios.post(this.$data_url + 'api/perfil', formData)
                .then(function (response) {

                    me.file = '';
                    me.$vs.loading.close();
                    localStorage.setItem('usuario', JSON.stringify(response.data[0]));

                    location.reload();
                    me.userInfo()
                })
                .catch(function (error) {
                    me.$vs.loading.close();

                    if (error.response) {
                        const status = error.response.status;
                        let errorMsg = "Error al procesar la solicitud.";

                        if (error.response.data.message) {
                            // Si hay message lo usamos
                            errorMsg = error.response.data.message;
                        }

                        if (error.response.data.errors) {
                            // Si hay errors (objeto con arrays), lo convertimos a texto plano
                            errorMsg = Object.values(error.response.data.errors)
                                .flat()
                                .join(", ");
                        }

                        // Puedes añadir chequeos específicos por status si quieres, ejemplo:
                        if (status === 412) {
                            errorMsg = error.response.data.message || errorMsg;
                        }

                        me.$vs.notify({
                            color: status >= 400 && status < 500 ? 'danger' : 'warning',
                            title: status === 412 ? 'Validación Fallida' : `Error ${status}`,
                            text: errorMsg
                        });

                        console.error("Error del servidor:", status, error.response.data);

                    } else if (error.request) {
                        me.$vs.notify({
                            color: 'danger',
                            title: 'Error de Red',
                            text: 'No hay respuesta del servidor.'
                        });
                        console.error("Sin respuesta:", error.request);

                    } else {
                        me.$vs.notify({
                            color: 'danger',
                            title: 'Error inesperado',
                            text: 'Error inesperado: ' + error.message
                        });
                        console.error("Error desconocido:", error);
                    }
                });

        },
        obtenerImagen(e) {
            let me = this;
            me.file = e.target.files[0];

            if (!me.file) {
                me.previewImage = null;
                me.selectedFileName = '';
                return;
            }

            // Guardar el nombre del archivo
            me.selectedFileName = me.file.name;

            // Crear preview de la imagen
            const reader = new FileReader();
            reader.onload = function (event) {
                me.previewImage = event.target.result;
            };
            reader.readAsDataURL(me.file);

            // Validar tamaño
            me.muyPesado = false;
            me.msj = '';
            me.pesoArchivo = (me.file.size / (1024 * 1024)).toFixed(2); // Convertir a MB

            if (me.pesoArchivo > me.limiteMegas) {
                me.muyPesado = true;
                me.msj = `El archivo pesa ${me.pesoArchivo} MB y excede el límite de ${me.limiteMegas} MB permitido`;
                me.previewImage = null; // No mostrar preview si es muy pesado
            }
        },
        cancelarSeleccion() {
            let me = this;
            me.file = null;
            me.previewImage = null;
            me.selectedFileName = '';
            me.msj = '';
            me.muyPesado = false;
            me.pesoArchivo = '';
            // Limpiar el input file
            document.getElementById('profileFile').value = '';
        },
        getInstituciones() {
            let me = this;
            this.$http.get(this.$server_url + 'selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) {})
        },
        getInstitucion() {
            let me = this;
            me.institucion_estudiante = []
            this.$http.get(this.$server_url + 'selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                    // console.log( me.instituciones )
                })
                .catch(function (error) {})
        },
        async getCiudadSelect() {
            let me = this;
            this.$http.get(this.$server_url + "ciudad").then(function (response) {
                me.ciudad = response.data
            });
        },
        mostrarImagenCompleta(imagenUrl) {
            this.imagenModal = imagenUrl;
            this.mostrarModal = true;
        },
        async Confirmar_cambio_password() {
            let me = this;
            return new Promise((resolve, reject) => {

                if (me.formCambioPassword.password_actual === '' || me.formCambioPassword.password_actual === null || me.formCambioPassword.password_actual === 0) {
                    me.validarcampo_password_actual('Ingresa tu contraseña actual antes de cambiarla.');
                    return;
                }
                if (me.formCambioPassword.password_nuevo === '' || me.formCambioPassword.password_nuevo === null || me.formCambioPassword.password_nuevo === 0) {
                    me.validarcampo_password_nuevo();
                    return;
                }
                if (me.formCambioPassword.password_confirm === '' || me.formCambioPassword.password_confirm === null || me.formCambioPassword.password_confirm === 0) {
                    me.validarcampo_password_confirm();
                    return;
                }
                // 🔹 Validar longitud mínima (6 caracteres)
                if (me.formCambioPassword.password_nuevo.length < 6) {
                    me.validar_password_minima_longitud();
                    return;
                }
                // 🔸 Nueva validación: comprobar si las contraseñas coinciden
                if (me.formCambioPassword.password_nuevo !== me.formCambioPassword.password_confirm) {
                    me.validar_passwords_no_coinciden();
                    return;
                }
                let data_Guardado = {
                    idusuario: me.user.idusuario,
                    password_actual: me.formCambioPassword.password_actual,
                    password_nuevo: me.formCambioPassword.password_nuevo,
                    password_confirm: me.formCambioPassword.password_confirm
                };

                // Mostrar loading
                me.$vs.loading();

                me.$http.post(me.$server_url + 'actualizarPassword_PerfilUser', data_Guardado)
                    .then(response => {
                                me.$vs.loading.close(); // Quitar loading al responder

                                if (response.data.status == 1) {
                                    me.$vs.notify({
                                        text: 'Contraseña cambiada con éxito.',
                                        color: 'success',
                                        iconPack: 'feather',
                                        icon: 'icon-check',
                                        time: 8000
                                    })
                                    me.formCambioPassword.password_actual = '';
                                    me.formCambioPassword.password_nuevo = '';
                                    me.formCambioPassword.password_confirm = '';
                                    // Mostrar modal de éxito
                                    me.$vs.dialog({
                                        type: 'alert',
                                        color: 'success',
                                        title: 'Contraseña Actualizada',
                                        text: 'La contraseña se ha actualizado correctamente. En tu próximo inicio de sesión deberás usar la nueva contraseña para ingresar a la plataforma.',
                                        acceptText: 'Aceptar',
                                        onAccept: () => {}
                                    });
                                    resolve();
                                } else if (response.data.status == 2) {
                                    me.validarcampo_password_actual('La contraseña actual no es correcta.');
                                    reject("Confirmar_cambio_password else 2", response.data.message);
                                } else if (response.data.status == 3) {
                                    me.validar_password_repetido(response.data.message);
                                    reject("Confirmar_cambio_password else 2", response.data.message);
                                } else {
                                    me.$vs.notify({
                                        title: 'Advertencia',
                                        text: response.data.message,
                                        color: 'warning',
                                        iconPack: 'feather',
                                        icon: 'icon-triangle',
                                        time: 8000
                                    });
                                    reject("Confirmar_cambio_password else", response.data.message);
                                }
                            })
                            .catch(error => {
                                me.$vs.loading.close(); // Quitar loading en caso de error
                                console.error('Error al cambiar la contraseña:', error);
                                me.$vs.notify({
                                    title: 'Error',
                                    text: 'Error al cambiar la contraseña.',
                                    color: 'danger',
                                    iconPack: 'feather',
                                    icon: 'icon-alert-circle'
                                });
                                reject("Confirmar_cambio_password catch", error);
                            });
            });
        },
    },
}
</script>

<style>
.uploading-image {
    display: flex;
}

/* Efecto de zoom en hover para las imágenes */
.image-zoom-hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    overflow: hidden;
}

.image-zoom-hover:hover {
    transform: scale(1.1);
    box-shadow: 0 .625rem 1.5625rem rgba(0, 0, 0, 0.3);
    z-index: 10;
}

/* Efecto específico para imágenes dentro de contenedores relativos */
.image-zoom-hover img {
    transition: transform 0.3s ease;
}

.image-zoom-hover:hover img {
    transform: scale(1.1);
}

/* Estilo para el modal de imagen */
.image-modal .vs-popup {
    max-width: 90vw;
    max-height: 90vh;
}

.image-modal .vs-popup--content {
    padding: 0;
}

/* Animación suave para el indicador de zoom */
.image-zoom-hover .absolute {
    transition: opacity 0.3s ease;
    opacity: 0.7;
}

.image-zoom-hover:hover .absolute {
    opacity: 1;
}

/* Efecto de hover para el botón de seleccionar archivo */
.bg-primary:hover {
    background-color: #007bff !important;
    color: white !important;
    transform: translateY(-0.0625rem);
    box-shadow: 0 .25rem .75rem rgba(0, 0, 0, 0.15);
}

/* Mejora visual para el contenedor de la imagen */
.relative.inline-block {
    transition: all 0.3s ease;
}

.relative.inline-block:hover {
    transform: translateY(-0.125rem);
}

/* Estilo para el avatar con zoom */
.vs-avatar.image-zoom-hover {
    border-radius: 50%;
    overflow: hidden;
}

/* Estilo específico para el indicador de zoom */
.zoom-indicator {
    transition: all 0.3s ease;
    backdrop-filter: blur(.125rem);
    border: .0625rem solid rgba(255, 255, 255, 0.2);
}

.zoom-indicator:hover {
    background-color: rgba(0, 0, 0, 0.9) !important;
    transform: scale(1.1);
}

/* Animación de pulso para el indicador */
.image-zoom-hover:hover .zoom-indicator {
    animation: pulse-zoom 1.5s infinite;
}

@keyframes pulse-zoom {
    0% {
        transform: scale(1);
        opacity: 0.8;
    }

    50% {
        transform: scale(1.1);
        opacity: 1;
    }

    100% {
        transform: scale(1);
        opacity: 0.8;
    }
}

/* Mejora del cursor para las imágenes */
.image-zoom-hover {
    cursor: zoom-in;
}

/* Efecto de brillo en hover */
.image-zoom-hover:hover {
    filter: brightness(1.05);
}

/* Responsive para el modal */
@media (max-width: 48rem) {
    .image-modal img {
        max-height: 70vh;
    }

    .zoom-indicator {
        width: .375rem !important;
        height: .375rem !important;
        font-size: .625rem;
    }
}

.stylevalidar {
    /* border: 2px solid #00f; */
    box-shadow: 0px 0px 2px 4px #ff0000;
    border-radius: 5px;
}

/* ─── Tab Cambio de Contraseña (Perfil) ─── */
.pwd-perfil-header {
    display: flex;
    align-items: center;
    gap: 14px;
    background: linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%);
    border-radius: 14px;
    padding: 18px 22px;
    margin-bottom: 22px;
    color: white;
    box-shadow: 0 4px 18px rgba(29,78,216,0.28);
}
.pwd-perfil-icon {
    width: 50px;
    height: 50px;
    background: rgba(255,255,255,0.18);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    border: 1px solid rgba(255,255,255,0.25);
}
.pwd-perfil-icon .material-symbols-rounded {
    font-size: 28px;
    font-variation-settings: 'FILL' 1, 'wght' 500, 'GRAD' 0, 'opsz' 28;
    color: white;
    line-height: 1;
}
.pwd-perfil-title {
    font-size: 15px;
    font-weight: 700;
    margin-bottom: 3px;
    text-shadow: 0 1px 3px rgba(0,0,0,0.2);
}
.pwd-perfil-subtitle {
    margin: 0;
    font-size: 12px;
    opacity: 0.9;
    line-height: 1.4;
    text-shadow: 0 1px 2px rgba(0,0,0,0.15);
}
.pwd-perfil-field {
    margin-bottom: 16px;
}
.pwd-perfil-label {
    display: block;
    font-size: 11px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 6px;
}
.pwd-perfil-input-wrap {
    position: relative;
}
.pwd-perfil-input {
    width: 100%;
    padding: 11px 42px 11px 14px;
    border: 1.5px solid #cbd5e1;
    border-radius: 10px;
    font-size: 14px;
    background: #f8fafc;
    color: #1e293b;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
}
.pwd-perfil-input:focus {
    border-color: #2563eb;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37,99,235,0.12);
}
.pwd-perfil-input-error { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,0.12) !important; }
.pwd-perfil-input-ok    { border-color: #22c55e !important; box-shadow: 0 0 0 3px rgba(34,197,94,0.12)  !important; }
.pwd-perfil-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    font-size: 14px;
    transition: color 0.2s;
    padding: 0;
}
.pwd-perfil-toggle:hover { color: #2563eb; }
.pwd-perfil-strength-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 8px;
}
.pwd-perfil-bar {
    flex: 1;
    height: 5px;
    background: #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
}
.pwd-perfil-bar-fill {
    height: 100%;
    border-radius: 10px;
    transition: width 0.35s ease, background 0.35s ease;
}
.pwd-perfil-bar-label {
    font-size: 11px;
    font-weight: 700;
    min-width: 68px;
    text-align: right;
    transition: color 0.3s;
}
.pwd-perfil-rules {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 10px 14px;
    margin-top: 8px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 5px 10px;
}
.pwd-perfil-rule {
    font-size: 11px;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 5px;
    transition: color 0.2s;
}
.pwd-perfil-rule.ok   { color: #16a34a; }
.pwd-perfil-rule.fail { color: #94a3b8; }
.pwd-perfil-msg-error {
    margin: 5px 0 0;
    font-size: 11px;
    color: #ef4444;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
}
.pwd-perfil-msg-ok {
    margin: 5px 0 0;
    font-size: 11px;
    color: #22c55e;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
}
.pwd-perfil-btn {
    width: 100%;
    padding: 13px;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.25s ease;
    margin-top: 4px;
}
.pwd-perfil-btn-active {
    background: linear-gradient(135deg, #1e40af, #2563eb);
    color: white;
    box-shadow: 0 4px 14px rgba(37,99,235,0.35);
}
.pwd-perfil-btn-active:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(37,99,235,0.45);
}
.pwd-perfil-btn-disabled {
    background: #e2e8f0;
    color: #94a3b8;
    cursor: not-allowed;
}
.pwd-perfil-note {
    text-align: center;
    font-size: 11px;
    color: #515964;
    font-weight: 500;
    margin-top: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
</style>
