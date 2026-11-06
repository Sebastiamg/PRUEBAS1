<template>
<div>
    <div v-if="isLoading" class="demo-alignment">
        <span v-if="isLoading">Verificando...</span>
        <span v-else>Error</span>
    </div>
    <div class="alignment" v-if="datosVerifycar === false">
        <img src="https://cdn-icons-png.flaticon.com/512/675/675564.png" alt="" />
        <h2 style="color: white; text-align: center">Acceso no válido</h2>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            backgroundLoading: '#000000',
            isLoading: true,
            codigo: null,
            datosVerifycar: null,
            datosInstitucion: [],
            referer:null,
        };
    },
    mounted() {
    this.clearLocalStorage(); 

    this.codigo = this.$route.query.codigo;

    if (!this.codigo) {
        console.warn("No se recibió el parámetro 'codigo' en la URL.");
        this.isLoading = false;
        return;
    }
    this.referer = this.$route.query.referer;
    if (!this.referer) {
        console.warn("No se recibió el parámetro 'referer' en la URL.");
        this.isLoading = false;
        return;
    }

    this.openLoadingBackground();

    setTimeout(() => {
        this.getverificacion(this.codigo, this.referer);
    }, 2000);
},
    methods: {
        getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    return null; // Si no encuentra la cookie, retorna null
},
        clearLocalStorage() {
            localStorage.removeItem('datosInstitucion');
            console.log("LocalStorage 'datosInstitucion' eliminado.");
        },

        openLoadingBackground() {
            this.$vs.loading({
                background: this.backgroundLoading,
                color: 'white',
                type: 'radius',
            });
        },

        ErrorLoadingBackground() {
            this.$vs.loading({
                background: this.backgroundLoading,
                color: 'white',
                type: 'none',
            });
        },
        successLoadingBackground() {
            this.$vs.loading({
                background: this.backgroundLoading,
                color: 'white',
                type: 'sound',
            });
        },

        getverificacion(codigo, referer) {
            this.isLoading = true;

            // Aquí aseguramos que la cookie 'referer' es pasada correctamente
            this.$http.get(`${this.$server_url}verifyCode?code=${codigo}&referer=${encodeURIComponent(referer)}`)
                .then(res => {
                    this.datosVerifycar = res.data.success;
                    this.isLoading = false;
                    this.datosInstitucion = res.data.datos;
                    if (this.datosVerifycar) {
                        this.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check-circle',
                        });
                        this.$vs.loading.close();
                        this.backgroundLoading = '#57d943';
                        this.successLoadingBackground();
                        setTimeout(() => {
                            localStorage.setItem('datosInstitucion', this.datosVerifycar);
                            const datosInstitucionStr = encodeURIComponent(JSON.stringify(this.datosInstitucion));
                            this.$router.push(`/libros_institucion?datosInstitucion=${datosInstitucionStr}`);
                            this.$vs.loading.close();
                        }, 1000);
                    } else {
                        this.$vs.notify({
                            text: res.data.message,
                            color: 'error',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                        });
                        this.$vs.loading.close();
                        this.backgroundLoading = '#fa5555';
                        this.ErrorLoadingBackground();
                    }
                })
                .catch(error => {
                    this.isLoading = false;
                    this.$vs.notify({
                        text: 'Error al conectar con el servidor.',
                        color: 'error',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                    });
                    console.error('Error al obtener libros de institución', error);
                });
        },
    },
};
</script>

    
<style scoped>
.demo-alignment {
    position: fixed;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 24px;
    color: white;
    z-index: 300010;
}

.alignment {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: white;
    z-index: 300010;
}

.codigo-container {
    position: fixed;
    margin-top: 20px;
    text-align: center;
    font-size: 18px;
    color: white;
    z-index: 300011;
}
</style>
