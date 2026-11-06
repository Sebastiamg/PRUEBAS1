<template>
<vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
        <h4 class="font-bold">Se ha cerrado la sesión</h4>
    </div>
    <vs-divider class="mb-0"></vs-divider>
    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :key="$vs.rtl">
        <div class="p-6 text-center">
            <!-- Imagen -->
            <img src="@/assets/images/pages/session-faild.jpg" alt="login" class="mx-auto mb-4" style="width: 90%;" />

            <!-- Mensaje de sesión expirada -->
            <div class="px-4">
                <h1 class="text-xl font-bold text-gray-900 mb-2 text-danger">
                    Su sesión expiró
                </h1>
                <p class="text-sm text-gray-600">
                    Para continuar trabajando, inicia sesión nuevamente.
                </p>
                <p class="text-sm text-gray-600 mt-2">
                    Si tiene problemas para iniciar sesión, por favor contacte con el equipo de soporte.
                </p>
            </div>
        </div>
    </component>

    <!-- Botón de acción -->
    <div class="p-4 text-center" slot="footer">
        <vs-button color="danger" type="gradient"  @click="salir()">
            Iniciar sesión nuevamente
        </vs-button>
    </div>
</vs-sidebar>
</template>

<script>
import VuePerfectScrollbar from 'vue-perfect-scrollbar'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
export default {
    props: {
        isSidebarActive: {
            type: Boolean,
            required: true
        },
        data: {
            type: Object,
            default: () => {}
        }
    },
    components: {
        'v-select': vSelect,
        VuePerfectScrollbar
    },
    data() {
        return {
            usuario:[],
        }
    },
    mounted() {
        
    },
    created(){
        let me = this
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    computed: {
        isSidebarActiveLocal: {
            get() {
                return this.isSidebarActive
            },
            set(val) {
                if (!val) {
                    this.$emit('closeSidebar')
                }
            }
        },
        isFormValid() {
            return !this.errors.any() && this.dataName && this.dataCategory && this.dataPrice > 0
        },
        scrollbarTag() {
            return this.$store.getters.scrollbarTag
        }
    },
    methods: {
        async salir() {
            // Emit close events (do not mutate parent prop directly)
            try { this.$emit('update:isSidebarActive', false); } catch (_) {}
            try { this.$emit('closeSidebar'); } catch (_) {}

            // Clear lock flag and auth tokens so reload won't re-open the bloqueo
            try { localStorage.removeItem('session_locked'); } catch (_) {}
            try { localStorage.removeItem('tk'); } catch (_) {}
            try { localStorage.removeItem('usuario'); } catch (_) {}
            try { localStorage.removeItem('token'); } catch (_) {}

            try {
                // Reset Vuex (this depends on your store organization)
                await this.$store.dispatch('logout')
            } catch (e) {
                console.warn("Error en logout del store, igual redirigimos:", e)
            }

            // Redirect to login according to user type
            const ruta = (this.usuario && this.usuario.id_group === 16) ? '/docente/ingreso' : '/';
            this.$router.push(ruta)
        }
    },
}
</script>

<style lang="scss" scoped>
.add-new-data-sidebar {
    ::v-deep .vs-sidebar--background {
        z-index: 52010;
    }

    ::v-deep .vs-sidebar {
        z-index: 52010;
        width: 50%;
        max-width: 50%;

        .img-upload {
            margin-top: 2rem;

            .con-img-upload {
                padding: 0;
            }

            .con-input-upload {
                width: 100%;
                margin: 0;
            }
        }
    }
}

.scroll-area--data-list-add-new {
    // height: calc(var(--vh, 1vh) * 100 - 4.3rem);
    height: calc(var(--vh, 1vh) * 100 - 16px - 45px - 82px);

    &:not(.ps) {
        overflow-y: auto;
    }
}
</style>
