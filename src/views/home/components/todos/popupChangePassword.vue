<template>
<div class="popup-pwd-wrapper">
    <!-- Header con icono y título -->
    <div class="pwd-header">
        <div class="pwd-header-icon">
            <i class="fa-solid fa-key"></i>
        </div>
        <div class="pwd-header-text">
        <div class="pwd-title">Actualización de contraseña</div>
            <p>
                Su contraseña ha sido restablecida o es su primer inicio de sesión.
                Por seguridad, debe establecer una nueva contraseña.
                Este procedimiento es <strong>obligatorio</strong>.
            </p>
        </div>
    </div>
    <!-- Formulario -->
    <div class="pwd-form">
        <!-- Checklist de políticas (Siempre visible al inicio) -->
        <div class="pwd-rules" style="margin-bottom: 20px;">
            <div class="pwd-rule" :class="reglas.longitud ? 'rule-ok' : 'rule-fail'">
                <i :class="reglas.longitud ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
                Mínimo 8 caracteres
            </div>
            <div class="pwd-rule" :class="reglas.maximo ? 'rule-ok' : 'rule-fail'">
                <i :class="reglas.maximo ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
                Máximo 64 caracteres
            </div>
            <div class="pwd-rule" :class="reglas.letras ? 'rule-ok' : 'rule-fail'">
                <i :class="reglas.letras ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
                Al menos una letra
            </div>
            <div class="pwd-rule" :class="reglas.numero ? 'rule-ok' : 'rule-fail'">
                <i :class="reglas.numero ? 'fa-solid fa-circle-check' : 'fa-solid fa-circle-xmark'"></i>
                Al menos un número (0-9)
            </div>
        </div>

        <!-- Nueva contraseña -->
        <div class="pwd-field">
            <label class="pwd-label">
                <i class="fa-solid fa-lock"></i> Nueva contraseña
            </label>
            <div class="pwd-input-wrap">
                <input :type="showPwd ? 'text' : 'password'" class="pwd-input" placeholder="Escribe tu nueva contraseña" v-model="password" @input="evaluarFortaleza" />
                <button class="pwd-toggle" @click="showPwd = !showPwd" type="button">
                    <i :class="showPwd ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
                </button>
            </div>
        </div>

        <!-- Indicador de fortaleza (Siempre visible bajo el input) -->
        <div class="pwd-strength-wrap" style="margin-top: -10px; margin-bottom: 20px;">
            <div class="pwd-strength-bar">
                <div class="pwd-strength-fill" :style="{ width: fortalezaPorcentaje + '%', background: fortalezaColor }">
                </div>
            </div>
            <span class="pwd-strength-label" :style="{ color: fortalezaColor }">{{ fortalezaTexto }}</span>
        </div>

        <!-- Confirmar contraseña -->
        <div class="pwd-field">
            <label class="pwd-label">
                <i class="fa-solid fa-lock-open"></i> Confirmar contraseña
            </label>
            <div class="pwd-input-wrap">
                <input :type="showRepeat ? 'text' : 'password'" class="pwd-input" :class="{ 'pwd-input-error': msg, 'pwd-input-ok': !msg && repeatpassword.length > 3 && repeatpassword === password }" placeholder="Repite tu nueva contraseña" v-model="repeatpassword" />
                <button class="pwd-toggle" @click="showRepeat = !showRepeat" type="button">
                    <i :class="showRepeat ? 'fa-solid fa-eye' : 'fa-solid fa-eye-slash'"></i>
                </button>
            </div>
            <p class="pwd-error-msg" v-if="msg">
                <i class="fa-solid fa-triangle-exclamation"></i> {{ msg }}
            </p>
            <p class="pwd-ok-msg" v-if="!msg && repeatpassword.length > 3 && repeatpassword === password">
                <i class="fa-solid fa-circle-check"></i> Las contraseñas coinciden
            </p>
        </div>
        <!-- Botón de acción -->
        <button class="pwd-btn" :class="{ 'pwd-btn-disabled': !formularioValido, 'pwd-btn-active': formularioValido }" :disabled="!formularioValido" @click="changePassword()">
            <i class="fa-solid fa-key"></i>
            Cambiar contraseña
        </button>
        <!-- Botón de salir -->
        <button class="pwd-btn-logout" @click="logout()" type="button">
            <i class="fa-solid fa-right-from-bracket"></i>
            Salir
        </button>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            usuario: [],
            password: '',
            repeatpassword: '',
            msg: '',
            showPwd: false,
            showRepeat: false,
            reglas: {
                longitud: false,
                maximo: false,
                letras: false,
                numero: false,
            },
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
        this.password = ''
        this.repeatpassword = ''
    },
    computed: {
        reglasAprobadas() {
            return Object.values(this.reglas).filter(v => v).length;
        },
        fortalezaPorcentaje() {
            if (this.password.length === 0) return 0;
            return (this.reglasAprobadas / 4) * 100;
        },
        fortalezaColor() {
            if (this.password.length === 0) return '#cbd5e1';
            const c = ['#ef4444', '#f97316', '#eab308', '#22c55e'];
            return c[Math.max(0, this.reglasAprobadas - 1)] || '#ef4444';
        },
        fortalezaTexto() {
            if (this.password.length === 0) return 'Escribe tu contraseña';
            const t = ['Muy débil', 'Débil', 'Buena', 'Fuerte ✓'];
            return t[Math.max(0, this.reglasAprobadas - 1)] || 'Muy débil';
        },
        formularioValido() {
            return this.reglasAprobadas === 4 &&
                this.password.trim() !== '' &&
                this.password === this.repeatpassword;
        }
    },
    watch: {
        repeatpassword(val) {
            this.msg = (val.length > 2 && val !== this.password) ?
                'Las contraseñas no coinciden' :
                '';
        },
    },
    methods: {
        evaluarFortaleza() {
            const p = this.password;
            this.reglas.longitud = p.length >= 8;
            this.reglas.maximo = p.length > 0 && p.length <= 64;
            this.reglas.letras = /[a-zA-Z]/.test(p);
            this.reglas.numero = /[0-9]/.test(p);
        },
        changePassword() {
            let me = this;
            if (!me.formularioValido) return;

            let formData = new FormData();
            formData.append('idusuario', me.usuario.idusuario);
            formData.append('password', me.password);

            me.$vs.loading();
            this.$http.post(this.$server_url + 'changePassword', formData)
                .then(res => {
                    me.$vs.loading.close();
                    if (res.data.status === 0) {
                        me.$vs.notify({
                            title: 'No se pudo cambiar',
                            text: res.data.message,
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-x-circle',
                            time: 7000
                        });
                        return;
                    }
                    localStorage.setItem('usuario', JSON.stringify(res.data.usuario));
                    me.$emit('changeRecarge', true);

                    me.$vs.dialog({
                        type: 'alert',
                        color: 'success',
                        title: 'Contraseña Actualizada',
                        text: 'La contraseña se ha actualizado correctamente. En tu próximo inicio de sesión deberás usar la nueva contraseña para ingresar a la plataforma.',
                        acceptText: 'Aceptar',
                        onAccept: () => {}
                    });
                })
                .catch(() => {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Error al procesar la solicitud. Intenta de nuevo.',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-x-circle',
                        time: 8000
                    });
                });
        },
        async logout() {
            let me = this;
            if(me.usuario.id_group == 18 || me.usuario.id_group == 19 || me.usuario.id_group == 20 || me.usuario.id_group == 21){
                 this.$router.push('/northospital');
                localStorage.clear();
                location.reload();
            }
            else if(me.usuario.id_group == 16){
                 this.$router.push('/docente/ingreso');
                localStorage.clear();
                location.reload();
                return
            }
            else{
                await this.$store.dispatch('logout');
                window.location.href = '/';
            }
        },
    }
}
</script>

<style scoped>
/* ── Wrapper ── */
.popup-pwd-wrapper {
    font-family: 'Inter', 'Segoe UI', system-ui, sans-serif;
    max-width: 480px;
    margin: 0 auto;
    color: #1e293b;
}

/* ── Header ── */
.pwd-header {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    background: linear-gradient(135deg, #1d4ed8 0%, #60a5fa 100%);
    border-radius: 14px;
    padding: 20px 24px;
    margin-bottom: 24px;
    color: white;
    box-shadow: 0 4px 20px rgba(29, 78, 216, 0.30);
}

.pwd-header-icon {
    width: 52px;
    height: 52px;
    background: rgba(255, 255, 255, 0.18);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    backdrop-filter: blur(6px);
    border: 1px solid rgba(255, 255, 255, 0.25);
}

.pwd-header-icon .material-symbols-rounded {
    font-size: 30px;
    font-variation-settings: 'FILL'1, 'wght'500, 'GRAD'0, 'opsz'30;
    color: white;
    line-height: 1;
}

.pwd-title {
    font-size: 15px;
    font-weight: 700;
    letter-spacing: 0.3px;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    margin: 0 0 4px;
    line-height: 1.3;
    color: #fff;
}

.pwd-header-text p {
    margin: 0;
    font-size: 12px;
    opacity: 0.92;
    line-height: 1.5;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.20);
}

/* ── Form ── */
.pwd-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* ── Labels y campos ── */
.pwd-label {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 6px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.pwd-input-wrap {
    position: relative;
}

.pwd-input {
    width: 100%;
    padding: 11px 42px 11px 14px;
    border: 1.5px solid #cbd5e1;
    border-radius: 10px;
    font-size: 14px;
    background: #f8fafc;
    color: #1e293b;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    outline: none;
    box-sizing: border-box;
}

.pwd-input:focus {
    border-color: #2563eb;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}

.pwd-input-error {
    border-color: #ef4444 !important;
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.12) !important;
}

.pwd-input-ok {
    border-color: #22c55e !important;
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.12) !important;
}

.pwd-toggle {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: #94a3b8;
    padding: 0;
    font-size: 15px;
    transition: color 0.2s;
}

.pwd-toggle:hover {
    color: #2563eb;
}

/* ── Mensajes de error/ok ── */
.pwd-error-msg {
    margin: 5px 0 0;
    font-size: 11px;
    color: #ef4444;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
}

.pwd-ok-msg {
    margin: 5px 0 0;
    font-size: 11px;
    color: #22c55e;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;
}

/* ── Barra de fortaleza ── */
.pwd-strength-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
}

.pwd-strength-bar {
    flex: 1;
    height: 5px;
    background: #e2e8f0;
    border-radius: 10px;
    overflow: hidden;
}

.pwd-strength-fill {
    height: 100%;
    border-radius: 10px;
    transition: width 0.35s ease, background 0.35s ease;
}

.pwd-strength-label {
    font-size: 11px;
    font-weight: 700;
    min-width: 70px;
    text-align: right;
    transition: color 0.3s;
}

/* ── Reglas ── */
.pwd-rules {
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 10px;
    padding: 12px 16px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6px 12px;
}

.pwd-rule {
    font-size: 11px;
    display: flex;
    align-items: center;
    gap: 6px;
    font-weight: 500;
    transition: color 0.2s;
}

.rule-ok {
    color: #16a34a;
}

.rule-fail {
    color: #94a3b8;
}

.pwd-rule i {
    font-size: 13px;
}

/* ── Botón ── */
.pwd-btn {
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
    letter-spacing: 0.3px;
}

.pwd-btn-active {
    background: linear-gradient(135deg, #1e3a5f, #2563eb);
    color: white;
    box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
}

.pwd-btn-active:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 18px rgba(37, 99, 235, 0.45);
}

.pwd-btn-disabled {
    background: #e2e8f0;
    color: #94a3b8;
    cursor: not-allowed;
}

/* ── Botón Salir ── */
.pwd-btn-logout {
    width: 100%;
    padding: 13px;
    border: 1.5px solid #ef4444;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.25s ease;
    letter-spacing: 0.3px;
    background: transparent;
    color: #ef4444;
    margin-top: 5px;
}

.pwd-btn-logout:hover {
    background: #ef4444;
    color: white;
    box-shadow: 0 4px 14px rgba(239, 68, 68, 0.25);
}

/* ── Nota al pie ── */
.pwd-info-note {
    text-align: center;
    font-size: 11px;
    color: #515964;
    font-weight: 500;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 5px;
}
</style>
