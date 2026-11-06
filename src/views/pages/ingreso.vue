<template>
<div class="page-login" id="page-login">
    <div class="container">

        <!-- ─── PANEL DE MARCA (izquierda) ─── -->
        <div class="brand-panel">
            <div class="bp-shapes">
                <div class="bp-shape s1"></div>
                <div class="bp-shape s2"></div>
                <div class="bp-shape s3"></div>
                <div class="bp-shape s4"></div>
            </div>
            <div class="bp-content">
                <div class="bp-logo-wrap">
                    <i class="feather icon-book-open"></i>
                </div>
                <div class="bp-brand">Prolipa</div>
                <p class="bp-tagline">Plataforma Educativa Digital</p>
                <div class="bp-sep"></div>
                <h3 class="bp-cta-title">¿Eres estudiante nuevo?</h3>
                <p class="bp-cta-text">Regístrate para acceder a tareas, evaluaciones y contenido exclusivo de tu institución</p>
                <button class="bp-btn" @click="showRegistro=1; sign_up_btn()">
                    <i class="feather icon-user-plus"></i>
                    Registrarme
                </button>
                <img src="./img/log.svg" class="bp-img" alt="" />
            </div>
        </div>

        <!-- ─── PANEL DE CONTENIDO (derecha) ─── -->
        <div class="content-panel">

            <!-- Barra superior (solo en modo registro) -->
            <div class="back-bar">
                <button class="back-btn" @click="sign_in_btn()">
                    <i class="feather icon-arrow-left"></i>
                    Volver al inicio de sesión
                </button>
                <span class="back-brand">
                    <i class="feather icon-book-open"></i> Prolipa
                </span>
            </div>

            <!-- FORMULARIO LOGIN -->
            <div class="sign-in-panel">
                <div class="login-card">
                    <div class="lc-header">
                        <!-- <div class="lc-icon"><i class="feather icon-log-in"></i></div> -->
                        <img src="/logo.png" alt="Prolipa Logo" class="lc-main-logo" />
                        <h2 class="lc-title">Bienvenidos a Prolipa</h2>
                        <p class="lc-sub">Ingresa tus credenciales para continuar</p>
                    </div>

                    <div class="lc-fields">
                        <div class="lf-wrap" :class="{'lf-active': focusEmail}">
                            <i class="feather icon-user lf-ico"></i>
                            <input class="lf-inp" type="text" v-model="user.email" placeholder="Usuario"
                                @focus="focusEmail=true" @blur="focusEmail=false" />
                        </div>
                        <div class="lf-wrap" :class="{'lf-active': focusPass}">
                            <i class="feather icon-lock lf-ico"></i>
                            <input class="lf-inp" :type="showPassword ? 'text' : 'password'"
                                v-on:keyup.enter="login" v-model="user.password" placeholder="Contraseña"
                                @focus="focusPass=true" @blur="focusPass=false" />
                            <i class="feather lf-eye" :class="showPassword ? 'icon-eye-off' : 'icon-eye'"
                                @click="togglePassword"></i>
                        </div>
                    </div>

                    <div v-if="errors" class="lc-error">
                        <i class="feather icon-alert-circle"></i> {{ errors }}
                    </div>

                    <button type="button" class="lc-btn" @click="login" :disabled="isLoading">
                        <svg v-if="isLoading" class="lc-spin" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" stroke-dasharray="30 70"/>
                        </svg>
                        <i v-else class="feather icon-arrow-right"></i>
                        {{ isLoading ? 'Entrando...' : 'Iniciar sesión' }}
                    </button>

                    <div class="lc-forgot">
                        <router-link to="/restaurar" class="forgot-lnk">
                            <i class="feather icon-help-circle"></i> Olvidé mi contraseña
                        </router-link>
                    </div>

                    <div class="lc-services">
                        <div class="srv-label">O accede a nuestros servicios</div>
                        <div class="srv-row">
                            <div class="srv-card" @click="popupPreguntasFaq=true">
                                <div class="srv-ico"><img width="28" height="28" src="https://cdn-icons-png.flaticon.com/512/9210/9210850.png" alt="FAQ"/></div>
                                <span>Preguntas Frecuentes</span>
                            </div>
                            <div class="srv-card" @click="irRecursos()">
                                <div class="srv-ico"><img width="28" height="28" src="https://cdn-icons-png.flaticon.com/128/4714/4714654.png" alt="Recursos"/></div>
                                <span>Recursos</span>
                            </div>
                        </div>
                    </div>

                    <!-- Solo mobile -->
                    <div class="mobile-reg">
                        ¿Estudiante nuevo?
                        <button class="mobile-reg-btn" @click="showRegistro=1; sign_up_btn()">Registrarme aquí</button>
                    </div>
                </div>
            </div>

            <!-- FORMULARIO REGISTRO -->
            <div class="sign-up-panel">
                <RegistroEstudiante @nuevoUser="changeHandle" v-if="showRegistro == 1" />
            </div>
        </div>

        <!-- Panel derecho oculto (mantiene compatibilidad con JS) -->
        <div class="panel right-panel" style="display:none;">
            <div class="content">
                <button class="btn transparent" @click="sign_in_btn()" id="sign-in-btn">Iniciar sesión</button>
            </div>
        </div>
        <!-- Panel izquierdo oculto (mantiene compatibilidad con JS) -->
        <div class="panel left-panel" style="display:none;">
            <div class="content">
                <button class="btn transparent" @click="showRegistro=1;sign_up_btn()" id="sign-up-btn">Registrarme</button>
            </div>
        </div>

    </div>

    <!-- Modal Preguntas Frecuentes -->
    <div class="centerx">
        <vs-popup fullscreen title="Preguntas Frecuentes" :active.sync="popupPreguntasFaq">
            <div>
                <vs-collapse accordion>
                    <vs-collapse-item :key="indextr" v-for="(item, indextr) in preguntasFaq">
                        <div slot="header" style="color:#4EA6EA;font-weight:bold;font-size:25px;">{{ item.pregunta }}</div>
                        <p v-text="item.descripcion"></p>
                        <br/>
                        <div><video-embed :src="item.video"></video-embed></div>
                        <br>
                        <div v-if="item.url != null"><img width="700" :src="$server_url+'preguntas_frecuentes/'+item.url"/></div>
                        <br><br>
                    </vs-collapse-item>
                </vs-collapse>
            </div>
        </vs-popup>
    </div>
</div>
</template>

<script>
import RegistroEstudiante from './RegistroEstudiante.vue'
import { mapState, mapActions } from 'vuex'
import Vue from 'vue'
import Embed from 'v-video-embed'
Vue.use(Embed);
import Carousel from './components/carousel/Carousel.vue';
import CarouselSlide from './components/carousel/CarouselSlide';
export default {
    data() {
        return {
            popupPreguntasFaq: false,
            user: { email: '', password: '' },
            showPassword: false,
            checkbox_remember_me: false,
            popupIrRegistro: false,
            slides: 's1.jpg',
            inc: 1, rdn: 1, x: true, repeticiones: 30, anterior: '', cadena: '',
            preguntasFaq: [],
            showRegistro: 0,
            isLoading: false,
            focusEmail: false,
            focusPass: false,
        }
    },
    components: { Carousel, CarouselSlide, RegistroEstudiante },
    computed: {
        ...mapState(['usuario']),
        ...mapState(['auth']),
        ...mapState(['errors']),
        ...mapState(['contador'])
    },
    mounted() {
        this.checkExistingSession();
        this.getUsuario();
        this.preguntasfaq();
        window.addEventListener('storage', this.handleStorageChange);
    },
    beforeDestroy() {
        window.removeEventListener('storage', this.handleStorageChange);
    },
    methods: {
        checkExistingSession() {
            try {
                const usuario = localStorage.getItem('usuario');
                const token = localStorage.getItem('tk');
                const sessionLocked = localStorage.getItem('session_locked');
                if (sessionLocked) return;
                if (usuario && token) {
                    const userData = JSON.parse(usuario);
                    if (userData && userData.idusuario) {
                        const lastActivity = localStorage.getItem('last_activity');
                        if (lastActivity) {
                            const idleTimeSeconds = Math.floor((Date.now() - parseInt(lastActivity, 10)) / 1000);
                            if (idleTimeSeconds < 3600) this.$router.push('/home');
                        }
                    }
                }
            } catch (e) { console.warn('Error checking existing session:', e); }
        },
        handleStorageChange(event) {
            if (event.key === 'usuario' && event.newValue && !event.oldValue) {
                try {
                    const newUser = JSON.parse(event.newValue);
                    if (newUser && newUser.idusuario && this.$route.path === '/') {
                        this.$router.push('/home');
                    }
                } catch (e) { console.warn('Error parsing usuario from storage:', e); }
            }
        },
        togglePassword() { this.showPassword = !this.showPassword; },
        incrementarContador(e) {
            e.preventDefault();
            this.$store.dispatch('incrementar', "variable :V")
            this.$store.dispatch('prueba')
        },
        changeHandle(e) {
            const container = document.querySelector(".container");
            container.classList.remove("sign-up-mode");
        },
        sign_in_btn() {
            const container = document.querySelector(".container");
            container.classList.remove("sign-up-mode");
        },
        sign_up_btn() {
            const container = document.querySelector(".container");
            container.classList.add("sign-up-mode");
        },
        irWebinar() {
            let route = this.$router.resolve({ path: '/webinar/presentacion' });
            window.open(route.href, '_blank');
        },
        irRecursos() {
            window.open("https://plataforma.prolipadigital.com.ec/v/eyJpdiI6IkNCNkFjYU1B", '_blank');
        },
        async preguntasfaq() {
            let me = this;
            await this.$http.get(this.$server_url + "preguntasfaq")
                .then(function(response) { me.preguntasFaq = response.data })
                .catch(function(error) { console.log(error) });
        },
        async getUsuario() {
            await this.$store.dispatch('getUsuario', this.user);
            if (this.$store.state.auth == true) return await this.$router.push('/home');
        },
        async login(e) {
            let me = this;
            if (e && e.preventDefault) e.preventDefault();
            if (me.isLoading) return;
            if (me.user.email.trim() == "" || me.user.password.trim() == "") {
                me.$vs.notify({ text: 'Por favor ingrese su usuario y su password', color: 'warning', iconPack: 'feather', icon: 'icon-check' });
                return;
            }
            me.isLoading = true;
            try {
                await this.$store.dispatch('login', this.user);
                if (localStorage.getItem("bloqueoUser") == "yes") {
                    this.$store.dispatch('logout');
                    me.$vs.notify({ text: 'Su usuario se encuentra bloqueado, por favor envíe un correo a soporte@prolipa.com.ec', color: 'warning', iconPack: 'feather', icon: 'icon-check', time: 8000 });
                    return await this.$router.push('/');
                } else {
                    if (me.auth) {
                        try { localStorage.removeItem('session_locked'); } catch (_) {}
                        return await this.$router.push('/home');
                    }
                }
            } finally { me.isLoading = false; }
        },
        getSlides() { this.inc++; this.rdn = Math.ceil(Math.random() * 6); this.slides = 's' + this.rdn + '.jpg'; },
    },
}
</script>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

/* ─── LAYOUT BASE ─── */
.page-login, #page-login {
    width: 100%;
    margin: 0;
    padding: 0;
    min-height: 100vh;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    background: #f8fafc;
}

.container {
    position: relative;
    width: 100vw;
    max-width: 100%;
    height: 100vh;
    overflow: hidden;
    background: #f8fafc;
}

/* ─── BRAND PANEL ─── */
.brand-panel {
    position: absolute;
    left: 0; top: 0; bottom: 0;
    width: 42%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: transform 0.9s cubic-bezier(0.77, 0, 0.175, 1);
    z-index: 10;
}

.bp-shapes { position: absolute; inset: 0; pointer-events: none; }

.bp-shape {
    position: absolute;
    border-radius: 50%;
    background: rgba(255,255,255,0.06);
}
.s1 { width: 380px; height: 380px; top: -130px; right: -90px; }
.s2 { width: 250px; height: 250px; bottom: -80px; left: -70px; opacity: 0.04; }
.s3 { width: 110px; height: 110px; top: 52%; right: 12%; opacity: 0.05; }
.s4 { width: 60px; height: 60px; top: 25%; left: 10%; opacity: 0.08; }

.bp-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 40px 32px;
    color: white;
    gap: 0;
    width: 100%;
}

.bp-logo-wrap {
    width: 72px; height: 72px;
    background: rgba(255,255,255,0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255,255,255,0.15);
    border-radius: 22px;
    display: flex; align-items: center; justify-content: center;
    font-size: 30px; color: #7dd3fc;
    margin-bottom: 16px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
}

.bp-brand {
    font-size: 30px; font-weight: 800;
    color: white; letter-spacing: -0.5px;
    margin-bottom: 6px;
}

.bp-tagline {
    font-size: 13px;
    color: rgba(255,255,255,0.55);
    margin-bottom: 28px;
}

.bp-sep {
    width: 48px; height: 2px;
    background: rgba(255,255,255,0.18);
    border-radius: 2px;
    margin-bottom: 24px;
}

.bp-cta-title {
    font-size: 18px; font-weight: 700;
    color: white;
    margin-bottom: 10px;
}

.bp-cta-text {
    font-size: 13px;
    color: rgba(255,255,255,0.62);
    line-height: 1.65;
    margin-bottom: 22px;
    max-width: 240px;
}

.bp-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 12px 28px;
    background: rgba(255,255,255,0.11);
    border: 1.5px solid rgba(255,255,255,0.28);
    border-radius: 10px;
    color: white; font-size: 14px; font-weight: 600;
    cursor: pointer;
    transition: all 0.25s ease;
    font-family: 'Inter', sans-serif;
    margin-bottom: 28px;
    backdrop-filter: blur(4px);
}

.bp-btn:hover {
    background: rgba(255,255,255,0.2);
    border-color: rgba(255,255,255,0.5);
    transform: translateY(-2px);
}

.bp-img {
    width: 210px;
    opacity: 0.65;
    pointer-events: none;
}

/* ─── CONTENT PANEL ─── */
.content-panel {
    position: absolute;
    top: 0; bottom: 0; right: 0;
    left: 42%;
    background: #f8fafc;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    transition: left 0.9s cubic-bezier(0.77, 0, 0.175, 1);
}

/* Barra de regreso */
.back-bar {
    position: absolute;
    top: 0; left: 0; right: 0;
    z-index: 20;
    padding: 14px 24px;
    display: flex; align-items: center; justify-content: space-between;
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 8px rgba(0,0,0,0.06);
    opacity: 0;
    transform: translateY(-100%);
    transition: opacity 0.4s ease, transform 0.4s ease;
    pointer-events: none;
}

.back-btn {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 8px 16px;
    background: #f1f5f9; border: 1px solid #e2e8f0;
    border-radius: 8px; font-size: 13px; font-weight: 600;
    color: #1e293b; cursor: pointer;
    transition: all 0.2s; font-family: 'Inter', sans-serif;
}

.back-btn:hover { background: #e0f2fe; color: #0284c7; border-color: #bae6fd; }

.back-brand {
    display: flex; align-items: center; gap: 6px;
    font-size: 16px; font-weight: 800; color: #0f3460;
    font-family: 'Inter', sans-serif;
}

/* Sign-in panel */
.sign-in-panel {
    flex: 1;
    display: flex; align-items: center; justify-content: center;
    padding: 40px 24px;
    transition: opacity 0.4s ease, transform 0.4s ease;
    opacity: 1; transform: translateX(0);
}

/* Sign-up panel */
.sign-up-panel {
    position: absolute;
    inset: 0;
    overflow-y: auto;
    opacity: 0;
    pointer-events: none;
    transition: opacity 0.4s ease 0.25s;
    background: #f8fafc;
}

/* ─── SIGN-UP MODE ─── */
.container.sign-up-mode .brand-panel {
    transform: translateX(-105%);
}

.container.sign-up-mode .content-panel {
    left: 0;
}

.container.sign-up-mode .back-bar {
    opacity: 1;
    transform: translateY(0);
    pointer-events: all;
}

.container.sign-up-mode .sign-in-panel {
    opacity: 0;
    pointer-events: none;
    transform: translateX(-40px);
}

.container.sign-up-mode .sign-up-panel {
    opacity: 1;
    pointer-events: all;
    padding-top: 58px;
}

/* ─── LOGIN CARD ─── */
.login-card {
    width: 100%;
    max-width: 400px;
    display: flex; flex-direction: column; align-items: center;
}

.lc-header {
    display: flex; flex-direction: column; align-items: center;
    margin-bottom: 28px;
}

.lc-main-logo {
    height: 48px;
    width: auto;
    object-fit: contain;
    margin-bottom: 20px;
}

.lc-title {
    font-size: 26px; font-weight: 800;
    color: #1e293b; letter-spacing: -0.5px;
    margin-bottom: 4px;
}

.lc-sub { font-size: 13px; color: #94a3b8; }

.lc-fields {
    width: 100%;
    display: flex; flex-direction: column; gap: 12px;
    margin-bottom: 16px;
}

.lf-wrap {
    display: flex; align-items: center;
    background: white;
    border: 1.5px solid #e2e8f0;
    border-radius: 12px;
    padding: 0 14px; height: 50px;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.05);
}

.lf-wrap.lf-active {
    border-color: #0ea5e9;
    box-shadow: 0 0 0 3px rgba(14,165,233,0.12);
}

.lf-ico { font-size: 16px; color: #94a3b8; margin-right: 10px; flex-shrink: 0; }

.lf-inp {
    flex: 1; background: none; border: none; outline: none;
    font-size: 14px; font-weight: 500; color: #1e293b;
    font-family: 'Inter', sans-serif;
}

.lf-inp::placeholder { color: #aab4be; font-weight: 400; }

.lf-eye {
    font-size: 16px; color: #94a3b8; cursor: pointer;
    margin-left: 8px; transition: color 0.2s;
}
.lf-eye:hover { color: #0ea5e9; }

.lc-error {
    width: 100%; font-size: 12.5px; color: #ef4444;
    background: #fef2f2; border: 1px solid #fecaca;
    border-radius: 8px; padding: 8px 12px; margin-bottom: 12px;
    display: flex; align-items: center; gap: 6px;
    font-family: 'Inter', sans-serif;
}

.lc-btn {
    width: 100%; height: 50px;
    background: linear-gradient(135deg, #1a1a2e, #0f3460);
    color: white; border: none; border-radius: 12px;
    font-size: 15px; font-weight: 700; font-family: 'Inter', sans-serif;
    display: flex; align-items: center; justify-content: center; gap: 8px;
    cursor: pointer; transition: all 0.25s ease;
    box-shadow: 0 4px 16px rgba(15,52,96,0.28);
    margin-bottom: 14px;
}

.lc-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #16213e, #1a4080);
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(15,52,96,0.4);
}

.lc-btn:disabled { opacity: 0.65; cursor: not-allowed; transform: none; }
.lc-btn i { font-size: 16px; }

.lc-spin {
    width: 18px; height: 18px;
    animation: lspin 0.9s linear infinite;
}

@keyframes lspin { to { transform: rotate(360deg); } }

.lc-forgot { width: 100%; text-align: right; margin-bottom: 24px; }

.forgot-lnk {
    font-size: 13px; color: #0ea5e9; text-decoration: none;
    font-family: 'Inter', sans-serif;
    display: inline-flex; align-items: center; gap: 4px;
    transition: color 0.2s;
}
.forgot-lnk:hover { color: #0284c7; text-decoration: underline; }

/* Servicios rápidos */
.lc-services { width: 100%; }

.srv-label {
    font-size: 12px; color: #94a3b8; text-align: center;
    font-family: 'Inter', sans-serif; margin-bottom: 12px;
    display: flex; align-items: center; gap: 10px;
}
.srv-label::before, .srv-label::after {
    content: ''; flex: 1; height: 1px; background: #e2e8f0;
}

.srv-row { display: flex; gap: 12px; justify-content: center; }

.srv-card {
    display: flex; flex-direction: column; align-items: center; gap: 6px;
    cursor: pointer; transition: transform 0.2s; flex: 1; max-width: 150px;
}
.srv-card:hover { transform: translateY(-3px); }

.srv-ico {
    width: 58px; height: 58px; border-radius: 14px;
    background: white; border: 1.5px solid #e2e8f0;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    transition: all 0.2s;
}
.srv-card:hover .srv-ico { border-color: #0ea5e9; box-shadow: 0 4px 14px rgba(14,165,233,0.18); }

.srv-card span {
    font-size: 11px; color: #64748b; text-align: center;
    font-family: 'Inter', sans-serif;
}

/* Solo mobile */
.mobile-reg {
    margin-top: 20px; font-size: 13px; color: #64748b;
    font-family: 'Inter', sans-serif; display: none; text-align: center;
}
.mobile-reg-btn {
    background: none; border: none; color: #0ea5e9;
    font-weight: 700; cursor: pointer; font-family: 'Inter', sans-serif; font-size: 13px;
}

/* ─── RESPONSIVE ─── */
@media (max-width: 900px) {
    .brand-panel { width: 38%; }
    .content-panel { left: 38%; }
    .bp-img { width: 160px; }
    .bp-cta-text { font-size: 12px; }
}

@media (max-width: 680px) {
    .brand-panel { display: none; }
    .mobile-reg { display: block; }
    .content-panel { left: 0; }
    .sign-in-panel { padding: 24px 16px; }
}

@media (max-width: 420px) {
    .lc-title { font-size: 22px; }
    .login-card { max-width: 100%; }
}
</style>
