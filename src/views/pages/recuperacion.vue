<template>
<div class="registro-wrapper" id="page-login">
    <!-- Header decorativo -->
    <div class="registro-header">
        <div class="header-bg-shapes">
            <div class="shape shape-1"></div>
            <div class="shape shape-2"></div>
            <div class="shape shape-3"></div>
        </div>
        <div class="header-content">
            <div class="header-icon">
                <i class="feather icon-unlock"></i>
            </div>
            <h1 class="header-title">Recuperar Contraseña</h1>
            <p class="header-subtitle">
                {{ !cedulaValidada ? 'Ingrese su documento de identidad para comenzar la recuperación' : 'Verifique su identidad ingresando su correo' }}
            </p>
        </div>
    </div>

    <!-- Formulario principal -->
    <div class="registro-card">
        <div class="text-center mb-8">
            <img src="@/assets/images/prolipa.png" alt="ProLipa" class="img-responsive mx-auto" style="max-height: 80px;">
        </div>

        <div v-if="usuario !== null">
            <!-- ─── SECCIÓN: Búsqueda de Cédula ─── -->
            <div class="seccion">
                <div class="seccion-header">
                    <div class="seccion-icon">
                        <i class="feather icon-search"></i>
                    </div>
                    <div>
                        <h2 class="seccion-titulo">Verificación de Identidad</h2>
                        <p class="seccion-desc">Ingrese su número de cédula para consultar su cuenta</p>
                    </div>
                </div>

                <div class="cedula-campo">
                    <label class="field-label">Documento de Identidad <span class="required">*</span></label>
                    <p class="text-xs text-gray-500 mb-2">Cédula, RUC o Pasaporte registrado en la plataforma</p>
                    <div class="cedula-input-group mt-1">
                        <div class="input-icon-wrap w-full" :class="{'input-validated': cedulaValidada}">
                            <i class="feather icon-credit-card input-icon"></i>
                            <input
                                class="custom-input"
                                type="text"
                                placeholder="Ingrese su documento"
                                v-model="cedula"
                                @keyup.enter="getConsulta_OlvideMiPassword_Front"
                                autocomplete="off"
                                :disabled="cedulaValidada"
                                maxlength="15"
                            />
                            <span v-if="cedulaValidada" class="input-check-icon">
                                <i class="feather icon-check-circle"></i>
                            </span>
                        </div>
                        <button v-if="!cedulaValidada" class="btn-submit px-6" style="padding: 10px 24px;" @click="getConsulta_OlvideMiPassword_Front" :disabled="!cedula || cedula.length < 5">
                            Validar
                        </button>
                        <button v-if="cedulaValidada" class="btn-reset px-4" style="padding: 10px 16px;" @click="reiniciarFormulario" title="Reiniciar búsqueda">
                            <i class="feather icon-refresh-cw"></i>
                        </button>
                    </div>
                </div>
            </div>

            <!-- ─── SECCIÓN: Verificación de Correo ─── -->
            <div v-if="cedulaValidada" class="seccion animation-fade mt-8">
                <div class="divider-horizontal my-6"></div>

                <div class="seccion-header">
                    <div class="seccion-icon bg-green">
                        <i class="feather icon-mail"></i>
                    </div>
                    <div>
                        <h2 class="seccion-titulo">Confirmación de Correo</h2>
                        <p class="seccion-desc">Ingrese el correo asociado a su cuenta</p>
                    </div>
                </div>

                <div class="cedula-campo">
                    <label class="field-label">Correo Electrónico <span class="required">*</span></label>
                    <div class="cedula-input-group mt-1">
                        <div class="input-icon-wrap w-full">
                            <i class="feather icon-mail input-icon"></i>
                            <input
                                class="custom-input"
                                type="email"
                                placeholder="correo@ejemplo.com"
                                v-model="email"
                                @keyup.enter="getConsulta_CompletaOlvideMiPassword_Front"
                                autocomplete="off"
                                maxlength="100"
                            />
                        </div>
                    </div>
                </div>

                <div class="submit-section mt-8">
                    <button class="btn-submit w-full text-center justify-center" @click="getConsulta_CompletaOlvideMiPassword_Front" :disabled="!email">
                        Restablecer Contraseña <i class="feather icon-shield ml-2"></i>
                    </button>
                </div>
            </div>

            <div class="mt-8 text-center w-full">
                <router-link to="/" class="hover:underline font-semibold text-primary text-sm flex items-center justify-center">
                    <i class="feather icon-arrow-left mr-2"></i> Volver al inicio de sesión
                </router-link>
            </div>
        </div>
    </div>

    <!-- Modal de Éxito Personalizado -->
    <vs-popup button-close-hidden="true" title="¡Contraseña Restaurada!" :active.sync="popupRegistroActivo" class="success-popup">
        <div class="popup-content text-center">
            <div class="success-icon-wrapper mb-4 flex justify-center mt-4">
                <i class="feather icon-check-circle text-success" style="font-size: 5rem;"></i>
            </div>
            <h3 class="mb-2 text-primary font-bold text-xl">¡Restauración Exitosa!</h3>
            <p class="mb-6 text-gray-600">Su contraseña ha sido restablecida. Puede iniciar sesión utilizando su cédula como nueva contraseña.</p>
            <div class="credentials-box">
                <div class="credential-item">
                    <span class="label"><i class="feather icon-user"></i> USUARIO</span>
                    <span class="value">{{ name_usuario }}</span>
                </div>
                <div class="divider-horizontal"></div>
                <div class="credential-item">
                    <span class="label"><i class="feather icon-lock"></i> CONTRASEÑA</span>
                    <span class="value">{{ cedula }}</span>
                </div>
            </div>
            <button class="btn-submit w-full mt-6" @click="cerrarYRedirigir">
                Ir al Inicio de Sesión
            </button>
        </div>
    </vs-popup>

</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)

export default {
    data() {
        return {
            cedulaValidada: false,
            email: "",
            cedula: "",
            name_usuario: "",
            usuario: '',
            errors: [],
            popupRegistroActivo: false,
        }
    },
    methods: {
        getConsulta_OlvideMiPassword_Front() {
            let me = this;
            if(!me.cedula || me.cedula.trim() === '') {
                me.$vs.notify({ text: "Debe ingresar su número de cédula.", color: 'warning', iconPack: 'feather', icon: 'icon-alert-circle' });
                return;
            }

            me.$vs.loading({ type: 'point' });
            let parametrosxfiltro = {
                action: 'getConsulta_OlvideMiPassword_Back',
                cedula: me.cedula,
            };

            this.$http.get(this.$server_url + 'VerifcarMetodosGet_UsuarioController', { params: parametrosxfiltro })
            .then(res => {
                me.$vs.loading.close();
                if (res.data.status === 1) {
                    me.cedulaValidada = true;
                } else {
                    me.cedulaValidada = false;
                    me.$vs.notify({
                        text: res.data.message || "La cédula ingresada no se encuentra registrada.",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x-circle',
                        time: 4000
                    });
                }
            })
            .catch(err => {
                console.error(err);
                me.$vs.loading.close();
                me.$vs.notify({ text: "Error de conexión al verificar la cédula.", color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' });
            });
        },

        getConsulta_CompletaOlvideMiPassword_Front() {
            let me = this;
            if(!me.email || me.email.trim() === '') {
                me.$vs.notify({ text: "Debe ingresar su correo electrónico.", color: 'warning', iconPack: 'feather', icon: 'icon-alert-circle' });
                return;
            }

            me.$vs.loading({ type: 'point' });
            let parametrosxfiltro = {
                action: 'getConsulta_CompletaOlvideMiPassword_Back',
                cedula: me.cedula,
                email: me.email
            };

            this.$http.get(this.$server_url + 'VerifcarMetodosGet_UsuarioController', { params: parametrosxfiltro })
            .then(res => {
                if (res.data.status === 1) {
                    me.name_usuario = res.data.name_usuario || '';
                    me.llamarRestauracion(res.data.idusuario);
                } else {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: res.data.message || "El correo electrónico no coincide con la cédula registrada.",
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x-circle',
                        time: 7000
                    });
                }
            })
            .catch(err => {
                console.error(err);
                me.$vs.loading.close();
                me.$vs.notify({ text: "Error de conexión al verificar los datos.", color: 'danger', iconPack: 'feather', icon: 'icon-alert-triangle' });
            });
        },

        llamarRestauracion(idusuario) {
            let me = this;
            let formData = new FormData();
            formData.append('idusuario', idusuario);

            this.$http.post(this.$server_url + 'restaurarPasswordXIdUser', formData)
            .then(response => {
                me.$vs.loading.close();
                if (response.data.status === 1) {
                    me.popupRegistroActivo = true;
                } else {
                    me.$vs.notify({
                        text: response.data.message || "No se pudo restaurar la contraseña.",
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-circle',
                        time: 7000
                    });
                }
            })
            .catch(error => {
                me.$vs.loading.close();
                console.error(error);
                me.$vs.notify({
                    title: 'Error de Servidor',
                    text: 'Error al intentar restablecer la contraseña.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
            });
        },

        cerrarYRedirigir() {
            this.popupRegistroActivo = false;
            setTimeout(() => {
                this.$router.push('/');
            }, 300);
        },

        reiniciarFormulario() {
            this.cedulaValidada = false;
            this.cedula = '';
            this.email = '';
            this.name_usuario = '';
        }
    },
}
</script>

<style scoped>
/* ═══════════════════════════════════════════════
   WRAPPER GENERAL
═══════════════════════════════════════════════ */
.registro-wrapper {
    min-height: 100vh;
    width: 100%;
    padding: 0 0 40px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background-color: #f8fafc;
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

.shape-1 { width: 300px; height: 300px; top: -100px; right: -60px; }
.shape-2 { width: 180px; height: 180px; bottom: -60px; left: 10%; opacity: 0.05; }
.shape-3 { width: 80px; height: 80px; top: 50%; left: 50%; opacity: 0.06; }

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
    padding: 40px;
    position: relative;
    z-index: 1;
    margin: 0 auto;
    max-width: 600px;
}

/* ═══════════════════════════════════════════════
   SECCIONES
═══════════════════════════════════════════════ */
.seccion {
    padding: 8px 0;
}
.animation-fade {
    animation: fadeIn 0.4s ease-out;
}
@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
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
.seccion-icon.bg-green {
    background: linear-gradient(135deg, #dcfce7, #bbf7d0);
    color: #166534;
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

/* ═══════════════════════════════════════════════
   LABELS Y CAMPOS
═══════════════════════════════════════════════ */
.field-label {
    font-size: 13px;
    font-weight: 600;
    color: #374151;
    letter-spacing: 0.01em;
}
.required { color: #ef4444; margin-left: 2px; }

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

.custom-input::placeholder { color: #cbd5e1; }

.cedula-campo { width: 100%; }
.cedula-input-group { display: flex; gap: 12px; align-items: stretch; }

/* ═══════════════════════════════════════════════
   BOTONES
═══════════════════════════════════════════════ */
.btn-submit {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 24px;
    background: linear-gradient(135deg, #0ea5e9, #0284c7);
    color: white;
    border: none;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 14px rgba(14, 165, 233, 0.35);
}

.btn-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(14, 165, 233, 0.45);
    background: linear-gradient(135deg, #0284c7, #0369a1);
}

.btn-submit:disabled {
    background: #cbd5e1;
    box-shadow: none;
    cursor: not-allowed;
    color: #f8fafc;
}

.btn-reset {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 14px 24px;
    background: white;
    color: #64748b;
    border: 1.5px solid #cbd5e1;
    border-radius: 12px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
}

.btn-reset:hover {
    background: #f8fafc;
    border-color: #94a3b8;
    color: #334155;
}

/* ═══════════════════════════════════════════════
   POPUP DE SUCCESS
═══════════════════════════════════════════════ */
.credentials-box {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    padding: 20px;
    margin-top: 20px;
    text-align: left;
}

.credential-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.credential-item .label {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12px;
    font-weight: 700;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.credential-item .value {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    padding-left: 20px;
    font-family: monospace;
}

.divider-horizontal {
    height: 1px;
    background: #e2e8f0;
    margin: 16px 0;
}
</style>
