<template>
<div class="registro-wrapper">
    <!-- Header decorativo -->
    <div class="registro-header">
        <div class="header-bg-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
        </div>
        <div class="header-content">
            <div class="header-icon">
                <i class="feather icon-user-plus"></i>
            </div>
            <h1 class="header-title">Registro de Estudiante</h1>
            <p class="header-subtitle">Complete el formulario para crear su cuenta</p>
        </div>
    </div>
    <!-- Formulario principal -->
    <div class="registro-card">
        <!-- ─── SECCIÓN 1: Búsqueda de Cédula ─── -->
        <div class="seccion">
            <div class="seccion-header">
                <div class="seccion-icon">
                    <i class="feather icon-search"></i>
                </div>
                <div>
                    <h2 class="seccion-titulo">Verificación de Identidad</h2>
                    <p class="seccion-desc">Ingrese su cédula para auto-completar sus datos</p>
                </div>
            </div>
            <div class="cedula-campo">
                <label class="field-label">Cédula de Identidad <span class="required">*</span></label>
                <div class="cedula-input-group">
                    <div class="input-icon-wrap" :class="{ 'input-validated': documentoValidado, 'input-error': errors.cedula }">
                        <i class="feather icon-credit-card input-icon"></i>
                        <input class="custom-input" type="text" placeholder="Ingrese 10 dígitos" v-model="estudiante.cedula" @keyup.enter="consultarDocumento" :disabled="documentoValidado || consultandoSRI" maxlength="10" autocomplete="off" />
                        <span v-if="documentoValidado" class="input-check-icon">
                            <i class="feather icon-check-circle"></i>
                        </span>
                    </div>
                    <button type="button" v-if="!documentoValidado" class="btn-consultar" @click="consultarDocumento()" :disabled="consultandoSRI || estudiante.cedula.length !== 10" :class="{ 'btn-loading': consultandoSRI }">
                        <i v-if="!consultandoSRI" class="feather icon-search"></i>
                        <svg v-else class="spinner" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="30 70" />
                        </svg>
                        {{ consultandoSRI ? 'Verificando...' : 'Verificar' }}
                    </button>
                    <button type="button" v-if="documentoValidado" class="btn-reset" @click="hacerOtraBusqueda()">
                        <i class="feather icon-refresh-cw"></i>
                        Nueva búsqueda
                    </button>
                </div>
                <span v-if="errors.cedula" class="field-error">
                    <i class="feather icon-alert-circle"></i> {{ errors.cedula }}
                </span>
                <div v-if="documentoValidado" class="cedula-validada-badge">
                    <i class="feather icon-shield"></i>
                    Identidad verificada correctamente
                </div>
            </div>
        </div>
        <div class="divider"></div>
        <!-- ─── SECCIÓN 2: Información Personal ─── -->
        <div class="seccion">
            <div class="seccion-header">
                <div class="seccion-icon">
                    <i class="feather icon-user"></i>
                </div>
                <div>
                    <h2 class="seccion-titulo">Información Personal</h2>
                    <p class="seccion-desc">Datos del estudiante a registrar</p>
                </div>
            </div>
            <div class="fields-grid">
                <div class="field-group">
                    <label class="field-label">Nombres <span class="required">*</span></label>
                    <div class="input-icon-wrap" :class="{ 'input-error': errors.nombres }">
                        <i class="feather icon-user input-icon"></i>
                        <input class="custom-input" type="text" placeholder="Ingrese nombres" v-model="estudiante.nombres" />
                    </div>
                    <span v-if="errors.nombres" class="field-error"><i class="feather icon-alert-circle"></i> {{ errors.nombres }}</span>
                </div>
                <div class="field-group">
                    <label class="field-label">Apellidos <span class="required">*</span></label>
                    <div class="input-icon-wrap" :class="{ 'input-error': errors.apellidos }">
                        <i class="feather icon-user input-icon"></i>
                        <input class="custom-input" type="text" placeholder="Ingrese apellidos" v-model="estudiante.apellidos" />
                    </div>
                    <span v-if="errors.apellidos" class="field-error"><i class="feather icon-alert-circle"></i> {{ errors.apellidos }}</span>
                </div>
                <div class="field-group">
                    <label class="field-label">Correo Electrónico <span class="required">*</span></label>
                    <div class="input-icon-wrap" :class="{ 'input-error': errors.email }">
                        <i class="feather icon-mail input-icon"></i>
                        <input class="custom-input" type="email" placeholder="correo@ejemplo.com" v-model="estudiante.email" />
                    </div>
                    <span v-if="errors.email" class="field-error"><i class="feather icon-alert-circle"></i> {{ errors.email }}</span>
                </div>
                <div class="field-group">
                    <label class="field-label">Teléfono</label>
                    <div class="input-icon-wrap">
                        <i class="feather icon-smartphone input-icon"></i>
                        <input class="custom-input" type="text" placeholder="Ingrese teléfono" v-model="estudiante.telefono" @keypress="soloNumeros" maxlength="15" />
                    </div>
                </div>
            </div>
        </div>
        <div class="divider"></div>
        <!-- ─── SECCIÓN 3: Ubicación e Institución Educativa ─── -->
        <div class="seccion">
            <div class="seccion-header">
                <div class="seccion-icon">
                    <i class="feather icon-book-open"></i>
                </div>
                <div>
                    <h2 class="seccion-titulo">Ubicación e Institución Educativa</h2>
                    <p class="seccion-desc">Seleccione su provincia, institución, grado y paralelo</p>
                </div>
            </div>
            <div class="fields-grid">
                <div class="field-group field-full">
                    <label class="field-label">Provincia <span class="required">*</span></label>
                    <div class="select-wrap">
                        <i class="feather icon-map-pin select-icon"></i>
                        <v-select class="custom-vselect" :options="provinciasArray" @input="getInstitucion()" :reduce="provinciasArray => provinciasArray.idprovincia" label="nombreprovincia" v-model="idprovincia" placeholder="Seleccione una provincia" />
                    </div>
                </div>
                <div class="field-group field-full" v-if="registroEvaluacion == false">
                    <label class="field-label">Institución <span class="required">*</span></label>
                    <div class="select-wrap" :class="{ 'input-error': errors.institucion }" v-if="idprovincia">
                        <i class="feather icon-home select-icon"></i>
                        <v-select
                            class="custom-vselect"
                            :options="instituciones"
                            :reduce="instituciones => instituciones.idInstitucion"
                            label="nombrecompletoins"
                            v-model="estudiante.idinstitucion"
                            :placeholder="cargandoInstituciones ? 'Cargando instituciones...' : 'Busque y seleccione su institución'"
                            :disabled="cargandoInstituciones"
                            :loading="cargandoInstituciones"
                        >
                            <template #no-options>
                                <span v-if="cargandoInstituciones">Cargando instituciones...</span>
                                <span v-else>No se encontraron instituciones para la provincia seleccionada</span>
                            </template>
                        </v-select>
                    </div>
                    <vx-tooltip text="Primero seleccione una provincia" position="top" class="w-full block" v-else>
                        <div class="select-wrap" :class="{ 'input-error': errors.institucion }" style="opacity: 0.6; cursor: not-allowed;">
                            <i class="feather icon-home select-icon"></i>
                            <v-select class="custom-vselect" :options="instituciones" :reduce="instituciones => instituciones.idInstitucion" label="nombreInstitucion" v-model="estudiante.idinstitucion" placeholder="Busque y seleccione su institución" :disabled="true" style="pointer-events: none;" />
                        </div>
                    </vx-tooltip>
                    <span v-if="errors.institucion" class="field-error"><i class="feather icon-alert-circle"></i> {{ errors.institucion }}</span>
                </div>
                <div class="field-group">
                    <label class="field-label">Grado <span class="required">*</span></label>
                    <div class="select-wrap" :class="{ 'input-error': errors.grado }">
                        <i class="feather icon-layers select-icon"></i>
                        <v-select class="custom-vselect" :options="cursos" :reduce="cursos => cursos" label="nombrenivel" v-model="estudiante.grado" placeholder="Seleccione grado" />
                    </div>
                    <span v-if="errors.grado" class="field-error"><i class="feather icon-alert-circle"></i> {{ errors.grado }}</span>
                </div>
                <div class="field-group">
                    <label class="field-label">Paralelo <span class="required">*</span></label>
                    <div class="radio-mini-group">
                        <label class="radio-chip" :class="{ 'radio-chip-active': p_otro === 'paralelo' }">
                            <input type="radio" v-model="p_otro" @change="cambiarParalelo(1)" value="paralelo" />
                            <i class="feather icon-grid"></i>
                            Paralelo
                        </label>
                        <label class="radio-chip" :class="{ 'radio-chip-active': p_otro === 'otro' }">
                            <input type="radio" v-model="p_otro" @change="cambiarParalelo(2)" value="otro" />
                            <!-- <i class="feather icon-edit-2"></i> -->
                            Otro
                        </label>
                    </div>
                    <div v-if="p_otro === 'paralelo'" class="select-wrap mt-3" :class="{ 'input-error': errors.paralelo }">
                        <i class="feather icon-tag select-icon"></i>
                        <v-select id="paralelo" class="custom-vselect" :options="paralelos" :reduce="paralelos => paralelos" label="descripcion" v-model="estudiante.paralelo" placeholder="Seleccione paralelo" />
                    </div>
                    <span v-if="errors.paralelo" class="field-error"><i class="feather icon-alert-circle"></i> {{ errors.paralelo }}</span>
                </div>
            </div>
        </div>
        <!-- ─── BOTÓN ENVIAR ─── -->
        <div class="submit-section">
            <button type="button" class="btn-submit" @click="guardar(estudiante)">
                <i class="feather icon-send"></i>
                Registrar Estudiante
            </button>
            <p class="submit-note">
                <i class="feather icon-lock"></i>
                Sus datos están protegidos y serán usados únicamente para su registro
            </p>
        </div>
    </div>
    <!-- Modal de Éxito Personalizado -->
    <vs-popup :button-close-hidden="true" title="¡Registro Exitoso!" :active.sync="popupRegistroActivo" class="success-popup">
        <div class="popup-content text-center">
            <div class="success-icon-wrapper mb-4">
                <i class="feather icon-check-circle text-success" style="font-size: 4rem;"></i>
            </div>
            <h3 class="mb-2 text-primary font-bold">¡Bienvenido a Prolipa!</h3>
            <p class="mb-6 text-gray-600">Su cuenta estudiante ha sido creada correctamente. Utilice estas credenciales para acceder a la plataforma:</p>
            <div class="credentials-box">
                <div class="credential-item">
                    <span class="label"><i class="feather icon-mail"></i> USUARIO</span>
                    <span class="value">{{ registroEmail }}</span>
                </div>
                <div class="divider-horizontal"></div>
                <div class="credential-item">
                    <span class="label"><i class="feather icon-lock"></i> CONTRASEÑA</span>
                    <span class="value">{{ registroCedula }}</span>
                </div>
            </div>
            <button class="btn-submit w-full mt-6" @click="cerrarYRedirigir">
                Entendido, ir al inicio de sesión
            </button>
        </div>
    </vs-popup>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.use(axios)
Vue.component("v-select", vSelect);
import $ from 'jquery'

export default {
    data() {
        return {
            popupRegistroActivo: false,
            forceClosePopup: false,
            registroEmail: "",
            registroCedula: "",
            mostrar: false,
            p_otro: 'paralelo',
            documento: "",
            cedulaVerificar: "",
            firstName: "",
            email: "",
            checkbox_remember_me: false,
            errors: {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                paralelo: '',
                grado: '',
            },
            ciudad: [],
            provinciasArray: [],
            institucion: [],
            instituciones: [],
            idregion: '',
            idprovincia: '',
            estudiante: {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                idinstitucion: '',
                paralelo: '',
                grado: '',
            },
            linkEvaluacion: '',
            vectorLink: '',
            registroEvaluacion: false,
            numero: '',
            validacionCedula: false,
            paralelos: [],
            cursos: [],
            documentoValidado: false,
            consultandoSRI: false,
            datosSRI: null,
            errorSRI: null,
            cargandoInstituciones: false,
        }
    },

    watch: {
        popupRegistroActivo(val) {
            // Prevenir que el popup se cierre al hacer clic fuera de él
            if (!val && !this.forceClosePopup) {
                this.$nextTick(() => {
                    this.popupRegistroActivo = true;
                });
            }
        },
        'estudiante.cedula'(val) {
            if (val) this.errors.cedula = '';
        },
        'estudiante.nombres'(val) {
            if (val && val.trim() !== '') this.errors.nombres = '';
        },
        'estudiante.apellidos'(val) {
            if (val && val.trim() !== '') this.errors.apellidos = '';
        },
        'estudiante.email'(val) {
            if (val && val.trim() !== '') this.errors.email = '';
        },
        'estudiante.idinstitucion'(val) {
            if (val) this.errors.institucion = '';
        },
        'estudiante.grado'(val) {
            if (val) this.errors.grado = '';
        },
        'estudiante.paralelo'(val) {
            if (val) this.errors.paralelo = '';
        },
        'p_otro'(val) {
            this.errors.paralelo = '';
        }
    },

    mounted() {
        this.linkEvaluacion = localStorage.getItem('evaluacionxLink')
        if (this.linkEvaluacion != '' && this.linkEvaluacion != null) {
            this.registroEvaluacion = true
            this.vectorLink = (this.linkEvaluacion).split('-')
        }
        this.infoRegistro()
        this.getProvinciasSelect();
        this.getInstitucion();
        if (localStorage.tk != null) {
            this.$router.push('/home');
        } else {}
    },

    methods: {
        soloNumeros(e) {
            let charCode = (e.which) ? e.which : e.keyCode;
            if (charCode > 31 && (charCode < 48 || charCode > 57)) {
                e.preventDefault();
            }
        },
        cambiarParalelo(estado) {
            if (estado == 1) {
                $('#paralelo').css('display', 'block');
            } else {
                $('#paralelo').css('display', 'none').css('margin-top', '20px');
            }
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

        formSubmitted() {
            alert("Form submitted!");
        },

        guardar(item) {
            let me = this;
            
            // 1. Limpiar todos los errores
            me.errors = {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                institucion: '',
                paralelo: '',
                grado: '',
            };
            let hasErrors = false;

            // 2. Validaciones locales en orden visual (Top -> Bottom)
            
            // Cédula validada
            // if (!me.documentoValidado) {
            //     me.errors.cedula = "Debe consultar y verificar su cédula antes de continuar";
            //     hasErrors = true;
            // }

            // Nombres y Apellidos
            if (!item.nombres || item.nombres.trim() === '') {
                me.errors.nombres = "Los nombres son obligatorios";
                hasErrors = true;
            }
            if (!item.apellidos || item.apellidos.trim() === '') {
                me.errors.apellidos = "Los apellidos son obligatorios";
                hasErrors = true;
            }

            // Correo Electrónico
            if (!item.email || item.email.trim() === '') {
                me.errors.email = "El correo electrónico es obligatorio";
                hasErrors = true;
            } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) {
                me.errors.email = "Ingrese un correo electrónico válido";
                hasErrors = true;
            }

            // Institución
            if (me.registroEvaluacion === false && (!item.idinstitucion || item.idinstitucion === '')) {
                me.errors.institucion = "Debe seleccionar una institución";
                hasErrors = true;
            }

            // Grado
            if (!item.grado || item.grado.orden == undefined || item.grado.orden == null || item.grado.orden === "") {
                me.errors.grado = "Seleccione un grado";
                hasErrors = true;
            }

            // Paralelo
            if (me.p_otro == 'paralelo') {
                if (!item.paralelo || item.paralelo.paralelo_id == undefined || item.paralelo.paralelo_id == null || item.paralelo.paralelo_id === "") {
                    me.errors.paralelo = "Seleccione un paralelo";
                    hasErrors = true;
                }
            }

            // 3. Evaluar y detener si hay errores
            if (hasErrors) {
                me.$vs.notify({
                    title: 'Formulario Incompleto',
                    text: 'Por favor, revise los campos marcados en rojo antes de registrarse.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle',
                    time: 5000
                });
                return false;
            }

            // 4. Proceso normal si no hay errores
            me.cedulaVerificar = "";
            let formData = new FormData();

            let institucionID = item.idinstitucion;
            let paraveloEval = item.paralelo ? item.paralelo.paralelo_id : '-';
            let gradoEval = item.grado ? item.grado.orden : '-';
            
            if (me.registroEvaluacion === true) {
                institucionID = me.vectorLink[2];
                paraveloEval = '-';
                gradoEval = '-';
            }

            formData.append('cedula', item.cedula);
            formData.append('nombres', item.nombres);
            formData.append('apellidos', item.apellidos);
            formData.append('email', item.email);
            formData.append('name_usuario', item.email);
            formData.append('institucion', institucionID);
            
            if (me.p_otro == 'paralelo') {
                formData.append('paralelo', item.paralelo.paralelo_id);
            } else {
                formData.append('paralelo', "otro");
            }
            formData.append('grado', item.grado.orden);

            me.$vs.loading();
            this.$http.post(this.$server_url + "register", formData)
                .then(function (response) {
                    me.$vs.loading.close();
                    me.registroEmail = item.email;
                    me.registroCedula = item.cedula;
                    me.popupRegistroActivo = true;
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    if (error.response && error.response.status == 422) {
                        // Asignar los errores del backend a nuestra variable reactiva
                        let errorsDB = error.response.data.errors;
                        if (errorsDB.cedula)      me.errors.cedula      = errorsDB.cedula[0];
                        if (errorsDB.nombres)     me.errors.nombres     = errorsDB.nombres[0];
                        if (errorsDB.apellidos)   me.errors.apellidos   = errorsDB.apellidos[0];
                        if (errorsDB.email)       me.errors.email       = errorsDB.email[0];
                        if (errorsDB.institucion) me.errors.institucion = errorsDB.institucion[0];
                        if (errorsDB.paralelo)    me.errors.paralelo    = errorsDB.paralelo[0];
                        if (errorsDB.grado)       me.errors.grado       = errorsDB.grado[0];

                        me.$vs.notify({
                            title: 'Error de Validación',
                            text: 'Algunos datos ya están registrados o son inválidos',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x-circle',
                            time: 6000
                        });
                    } else {
                        me.$vs.notify({
                            title: 'Error del Servidor',
                            text: 'No se pudo realizar el registro. Intente nuevamente.',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time: 6000
                        });
                    }
                });
        },

        cerrarYRedirigir() {
            this.forceClosePopup = true;
            this.popupRegistroActivo = false;
            this.$vs.notify({
                text: 'Usuario guardado. Ahora ya puede iniciar sesión.',
                color: 'success',
                iconPack: 'feather',
                icon: 'icon-user',
                time: 5000,
            });
            this.limpiarFormulario();
            this.$emit('nuevoUser', true);
        },

        limpiarFormulario() {
            this.documentoValidado = false;
            this.consultandoSRI = false;
            this.datosSRI = null;
            this.errorSRI = null;

            this.estudiante.cedula = '';
            this.estudiante.nombres = '';
            this.estudiante.apellidos = '';
            this.estudiante.email = '';
            this.estudiante.telefono = '';
            this.estudiante.idinstitucion = '';
            this.estudiante.paralelo = '';
            this.estudiante.grado = '';

            this.idregion = '';
            this.idprovincia = '';
            this.p_otro = 'paralelo';
            this.instituciones = [];

            this.errors = {
                cedula: '',
                nombres: '',
                apellidos: '',
                email: '',
                paralelo: '',
                grado: '',
                institucion: ''
            };
        },

        getInstitucion() {
            let me = this;
            // Limpiar la institución seleccionada al cambiar de ciudad
            me.estudiante.idinstitucion = '';

            // Si no hay provincia, vaciar la lista y no buscar
            if (!me.idprovincia) {
                me.instituciones = [];
                return;
            }

            me.cargandoInstituciones = true;
            me.instituciones = [];
            this.$http.get(this.$server_url + 'InstitucionxProvincias_Estudiantes?idprovincia=' + me.idprovincia)
                .then(function (response) {
                    me.instituciones = response.data;
                    me.cargandoInstituciones = false;
                })
                .catch(function (error) {
                    me.cargandoInstituciones = false;
                })
        },

        async getCiudadSelect() {
            let me = this;
            this.$http.get(this.$server_url + "ciudad").then(function (response) {
                me.ciudad = response.data
            });
        },

        async getProvinciasSelect() {
            let me = this;
            this.$http.get(this.$server_url + "Provincias_Para_RegistroEstudiantes").then(function (response) {
                me.provinciasArray = response.data
            });
        },

        hacerOtraBusqueda() {
            this.documentoValidado = false;
            this.consultandoSRI = false;
            this.datosSRI = null;
            this.errorSRI = null;
            this.estudiante.cedula = '';
            this.estudiante.nombres = '';
            this.estudiante.apellidos = '';
            this.$vs.notify({
                text: 'Listo para una nueva consulta',
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-refresh-cw'
            });
        },

        consultarDocumento() {
            const me = this;
            if (!me.estudiante.cedula) {
                me.$vs.notify({
                    text: 'Debe ingresar el número de cédula',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if (me.estudiante.cedula.length !== 10) {
                me.$vs.notify({
                    text: 'La cédula debe tener exactamente 10 dígitos',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            me.consultandoSRI = true;
            me.datosSRI = null;
            me.errorSRI = null;
            const formData = new FormData();
            formData.append('getCedulaRegistroCivil', 1);
            formData.append('cedula', me.estudiante.cedula);
            me.$http.post(me.$server_url + 'pedidos2/pedidos', formData)
                .then(function (response) {
                    me.consultandoSRI = false;
                    if (response && response.data && response.data.data && response.data.data.data) {
                        var datos = response.data.data.data;
                        me.datosSRI = datos;
                        if (datos.names) {
                            var full = datos.names.trim();
                            var partes = full.split(/\s+/).filter(function (p) {
                                return p;
                            });
                            if (partes.length >= 4) {
                                me.estudiante.apellidos = partes.slice(0, 2).join(' ');
                                me.estudiante.nombres = partes.slice(2).join(' ');
                            } else if (partes.length === 3) {
                                me.estudiante.apellidos = partes[0];
                                me.estudiante.nombres = partes.slice(1).join(' ');
                            } else if (partes.length === 2) {
                                me.estudiante.apellidos = partes[0];
                                me.estudiante.nombres = partes[1];
                            } else if (partes.length === 1) {
                                me.estudiante.nombres = partes[0];
                                me.estudiante.apellidos = '';
                            }
                        }
                        me.documentoValidado = true;
                        me.$vs.notify({
                            text: 'Cédula validada correctamente con API',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        });
                    } else {
                        // Si la API no devuelve datos, mostrar warning
                        me.consultandoSRI = false;
                        me.documentoValidado = false;
                        me.$vs.notify({
                            title: 'Datos no encontrados',
                            text: 'Complete los campos manualmente',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time: 6000
                        });
                    }
                })
                .catch(function (error) {
                    console.error('Error al consultar cédula con API:', error);
                    // Si la API falla, mostrar warning
                    me.consultandoSRI = false;
                    me.documentoValidado = false;
                    me.$vs.notify({
                        title: 'Complete los campos manualmente',
                        text: 'No se pudo verificar su documento de identidad',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time: 6000
                    });
                });
        },
    },

    components: {}
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════
   WRAPPER GENERAL
═══════════════════════════════════════════════ */
.registro-wrapper {
    min-height: 100%;
    width: 100%;
    padding: 0 0 220px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

/* ═══════════════════════════════════════════════
   HEADER DECORATIVO
═══════════════════════════════════════════════ */
.registro-header {
    position: relative;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 40%, #0f3460 100%);
    padding: 48px 40px 60px;
    overflow: hidden;
    border-radius: 0 0 32px 32px;
    margin-bottom: -24px;
}

.header-bg-shapes {
    position: absolute;
    inset: 0;
    pointer-events: none;
}

.shape {
    position: absolute;
    border-radius: 50%;
    opacity: 0.08;
    background: white;
}

.shape-1 {
    width: 300px;
    height: 300px;
    top: -100px;
    right: -60px;
}

.shape-2 {
    width: 180px;
    height: 180px;
    bottom: -60px;
    left: 10%;
    opacity: 0.05;
}

.shape-3 {
    width: 80px;
    height: 80px;
    top: 50%;
    left: 50%;
    opacity: 0.06;
}

.header-content {
    position: relative;
    text-align: center;
    color: white;
}

.header-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 20px;
    margin-bottom: 16px;
    font-size: 28px;
    color: #7dd3fc;
}

.header-title {
    font-size: 28px;
    font-weight: 700;
    color: white;
    margin: 0 0 8px;
    letter-spacing: -0.5px;
}

.header-subtitle {
    font-size: 15px;
    color: rgba(255, 255, 255, 0.65);
    margin: 0;
}

/* ═══════════════════════════════════════════════
   CARD PRINCIPAL
═══════════════════════════════════════════════ */
.registro-card {
    background: #ffffff;
    border-radius: 24px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.06);
    padding: 40px 40px 60px;
    position: relative;
    z-index: 1;
    margin: 0 auto;
    max-width: 900px;
}

/* ═══════════════════════════════════════════════
   SECCIONES
═══════════════════════════════════════════════ */
.seccion {
    padding: 8px 0;
}

.seccion-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 24px;
}

.seccion-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    min-width: 44px;
    background: linear-gradient(135deg, #e0f2fe, #bae6fd);
    border-radius: 12px;
    font-size: 20px;
    color: #0369a1;
}

.seccion-titulo {
    font-size: 17px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 2px;
}

.seccion-desc {
    font-size: 13px;
    color: #64748b;
    margin: 0;
}

.divider {
    height: 1px;
    background: linear-gradient(to right, transparent, #e2e8f0, transparent);
    margin: 28px 0;
}

/* ═══════════════════════════════════════════════
   GRID DE CAMPOS
═══════════════════════════════════════════════ */
.fields-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.field-full {
    grid-column: 1 / -1;
}

.field-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

/* ═══════════════════════════════════════════════
   LABELS Y CAMPOS
═══════════════════════════════════════════════ */
.field-label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.01em;
}

.required {
    color: #ef4444;
    margin-left: 2px;
}

.input-icon-wrap {
    position: relative;
    display: flex;
    align-items: center;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    transition: all 0.2s ease;
}

.input-icon-wrap:focus-within {
    border-color: #0ea5e9;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.12);
}

.input-icon-wrap.input-validated {
    border-color: #22c55e;
    background: #f0fdf4;
}

.input-icon-wrap.input-error {
    border-color: #ef4444;
    background: #fef2f2;
}

.input-icon {
    font-size: 16px;
    color: #94a3b8;
    padding: 0 12px;
    pointer-events: none;
    flex-shrink: 0;
}

.custom-input {
    flex: 1;
    border: none;
    background: transparent;
    padding: 11px 12px 11px 0;
    font-size: 14px;
    color: #1e293b;
    outline: none;
    width: 100%;
}

.custom-input::placeholder {
    color: #cbd5e1;
}

.custom-input:disabled {
    color: #64748b;
    cursor: not-allowed;
}

.input-check-icon {
    color: #22c55e;
    font-size: 18px;
    padding-right: 12px;
}

/* ═══════════════════════════════════════════════
   CÉDULA - INPUT GROUP
═══════════════════════════════════════════════ */
.cedula-campo {
    max-width: 600px;
}

.cedula-input-group {
    display: flex;
    gap: 12px;
    align-items: stretch;
}

.cedula-input-group .input-icon-wrap {
    flex: 1;
}

.btn-consultar {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
    background: linear-gradient(135deg, #f59e0b, #d97706);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(245, 158, 11, 0.35);
}

.btn-consultar:hover:not(:disabled) {
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(245, 158, 11, 0.45);
}

.btn-consultar:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
}

.btn-consultar.btn-loading {
    pointer-events: none;
}

.spinner {
    width: 16px;
    height: 16px;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.btn-reset {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 0 20px;
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    color: white;
    border: none;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    transition: all 0.2s ease;
    box-shadow: 0 2px 8px rgba(14, 165, 233, 0.35);
}

.btn-reset:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.45);
}

/* Badge validado */
.cedula-validada-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 10px;
    padding: 8px 16px;
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    border: 1px solid #86efac;
    border-radius: 8px;
    color: #166534;
    font-size: 13px;
    font-weight: 600;
}

/* ═══════════════════════════════════════════════
   ERRORES
═══════════════════════════════════════════════ */
.field-error {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: #ef4444;
    font-weight: 500;
}

/* ═══════════════════════════════════════════════
   RADIO CARDS (Región)
═══════════════════════════════════════════════ */
.radio-group {
    display: flex;
    gap: 12px;
}

.radio-card {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    background: #f8fafc;
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 600;
    color: #475569;
    transition: all 0.2s ease;
    user-select: none;
}

.radio-card input[type="radio"] {
    display: none;
}

.radio-card:hover {
    border-color: #0ea5e9;
    background: #f0f9ff;
}

.radio-card-active {
    border-color: #0ea5e9 !important;
    background: linear-gradient(135deg, #e0f2fe, #f0f9ff) !important;
    color: #0369a1 !important;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.12);
}

.radio-card i {
    font-size: 18px;
}

/* ═══════════════════════════════════════════════
   CHIPS PARALELO
═══════════════════════════════════════════════ */
.radio-mini-group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
}

.radio-chip {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 7px 14px;
    background: #f1f5f9;
    border: 1.5px solid #e2e8f0;
    border-radius: 20px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    transition: all 0.2s ease;
    user-select: none;
}

.radio-chip input[type="radio"] {
    display: none;
}

.radio-chip:hover {
    border-color: #0ea5e9;
    background: #f0f9ff;
}

.radio-chip-active {
    border-color: #0ea5e9 !important;
    background: linear-gradient(135deg, #0ea5e9, #0284c7) !important;
    color: white !important;
}

.mt-3 {
    margin-top: 12px;
}

/* ═══════════════════════════════════════════════
   V-SELECT PERSONALIZADO
═══════════════════════════════════════════════ */
.select-wrap {
    position: relative;
    display: flex;
    align-items: center;
}

.select-icon {
    position: absolute;
    left: 12px;
    z-index: 2;
    font-size: 15px;
    color: #94a3b8;
    pointer-events: none;
}

.custom-vselect {
    width: 100%;
}

.custom-vselect :deep(.vs__dropdown-toggle) {
    border: 1.5px solid #e2e8f0;
    border-radius: 10px;
    background: #f8fafc;
    padding: 4px 8px 4px 36px;
    /* min-height: 44px; */
    transition: all 0.2s ease;
    cursor: pointer;
}

.custom-vselect :deep(.vs__dropdown-toggle:hover),
.custom-vselect :deep(.vs--open .vs__dropdown-toggle) {
    border-color: #0ea5e9;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.12);
}

.custom-vselect :deep(.vs__search) {
    font-size: 14px;
    color: #1e293b;
}

.custom-vselect :deep(.vs__selected) {
    font-size: 14px;
    color: #1e293b;
    margin: 2px 2px;
}

.custom-vselect :deep(.vs__dropdown-menu) {
    width: 100%;
    min-width: 100%;
    box-sizing: border-box;
}

.custom-vselect :deep(.vs__dropdown-option) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    white-space: normal;
    word-break: break-word;
}

.custom-vselect :deep(.vs__dropdown-option--highlight) {
    display: block;
    width: 100%;
    box-sizing: border-box;
    background: #0ea5e9;
    color: #fff;
}

.custom-vselect :deep(.vs__clear),
.custom-vselect :deep(.vs__open-indicator) {
    color: #94a3b8;
}

.select-wrap.input-error .custom-vselect :deep(.vs__dropdown-toggle) {
    border-color: #ef4444;
    background: #fef2f2;
}

/* ═══════════════════════════════════════════════
   BOTÓN SUBMIT
═══════════════════════════════════════════════ */
.submit-section {
    margin-top: 36px;
    text-align: center;
    padding-top: 28px;
    border-top: 1px solid #f1f5f9;
}

.btn-submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 14px 48px;
    background: linear-gradient(135deg, #1a1a2e, #0f3460);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    letter-spacing: 0.02em;
    transition: all 0.25s ease;
    box-shadow: 0 4px 16px rgba(15, 52, 96, 0.35);
}

.btn-submit:hover {
    background: linear-gradient(135deg, #16213e, #1a4080);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15, 52, 96, 0.45);
}

.btn-submit:active {
    transform: translateY(0);
}

.btn-submit i {
    font-size: 18px;
}

.submit-note {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    margin-top: 14px;
    font-size: 12px;
    color: #94a3b8;
}

/* ═══════════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════════ */
@media (max-width: 768px) {
    .registro-header {
        padding: 36px 24px 48px;
        border-radius: 0 0 24px 24px;
    }

    .header-title {
        font-size: 22px;
    }

    .registro-card {
        padding: 28px 20px;
        border-radius: 20px;
    }

    .fields-grid {
        grid-template-columns: 1fr;
    }

    .field-full {
        grid-column: 1;
    }

    .cedula-input-group {
        flex-direction: column;
    }

    .btn-consultar,
    .btn-reset {
        padding: 12px 20px;
        justify-content: center;
    }

    .radio-group {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .registro-header {
        padding: 28px 16px 40px;
    }

    .registro-card {
        padding: 20px 16px;
        border-radius: 16px;
    }

    .seccion-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
    }

    .btn-submit {
        width: 100%;
        justify-content: center;
    }
}

/* ═══════════════════════════════════════════════
   SUCCESS POPUP (Custom VS-Popup)
═══════════════════════════════════════════════ */
.success-popup :deep(.vs-popup) {
    border-radius: 20px;
    max-width: 450px !important;
}

.success-icon-wrapper {
    animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.credentials-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px;
    text-align: left;
    margin-top: 10px;
}

.credential-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.credential-item .label {
    font-size: 11px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.credential-item .value {
    font-size: 16px;
    font-weight: 600;
    color: #0f172a;
}

.divider-horizontal {
    height: 1px;
    background: #cbd5e1;
    margin: 12px 0;
}

@keyframes scaleIn {
    from {
        transform: scale(0.5);
        opacity: 0;
    }

    to {
        transform: scale(1);
        opacity: 1;
    }
}
</style>
