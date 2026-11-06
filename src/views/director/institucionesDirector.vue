<template>
<div class="vx-col md:w-full w-full mb-base">
    <div class="vx-row" v-if="institucion.length >0">
        <div v-if="VerificarUser == true" class="vx-col w-full mb-base cursor-pointer">
            <div class="vx-col md:w-full w-full mb-base">
                <transition name="fade" mode="out-in">
                    <div v-if="mostrarCategorias" key="cats" class="vx-row cards-grid">
                        <div class="vx-col px-2 mb-base cursor-pointer w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5" v-for="cat in categorias" :key="cat.nombre">
                            <vx-card class="p-2 div-hover h-full flex flex-col" @click="abrirCategoria(cat)">
                                <div class="text-center divinst">
                                    <span class="textinst text-dark font-bold">{{ cat.nombre }}</span>
                                </div>
                                <div class="flex-1 flex items-center justify-center">
                                    <!-- aplicamos clase según modo para animar scale -->
                                    <vs-avatar class="mx-auto my-6 block avatar-resp" :class="{ 'avatar-big': mostrarCategorias, 'avatar-small': !mostrarCategorias }" :src="cat.img" />
                                </div>
                            </vx-card>
                        </div>
                    </div>
                    <div v-else key="insts" class="vx-row cards-grid">
                        <!-- Botón volver -->
                        <div class="vx-col w-full mb-6 px-2 flex justify-start">
                            <vs-button @click="volverCategorias" color="warning" type="filled" class="px-6 py-2 rounded-lg shadow-md">
                                ⬅ Volver
                            </vs-button>
                        </div>
                        <div class="vx-col w-full mb-4 px-2">
                            <vs-input v-model="busquedaInstitucion" placeholder="🔍 Buscar institución..." class="w-full" icon="search" size="large" color="primary" border />
                        </div>
                        <!-- Mensaje si no hay resultados -->
                        <div v-if="institucionesFiltradasBuscadas.length === 0" class="w-full text-center text-red-500 font-bold py-4">
                            No se encontraron resultados para tu búsqueda.
                        </div>
                        <div class="vx-col px-2 mb-base cursor-pointer w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5" v-for="(item, $index) in institucionesFiltradasBuscadas" :key="$index">
                            <vx-card class="p-2 div-hover h-full flex flex-col" @click="getDatos(item)">
                                <div class="text-center divinst">
                                    <span class="textinst text-dark font-bold">{{ item.nombreInstitucion }}</span>
                                </div>
                                <div class="flex-1 flex items-center justify-center">
                                    <vs-avatar v-if="item.imgenInstitucion" class="mx-auto my-6 block avatar-resp" :class="{ 'avatar-big': mostrarCategorias, 'avatar-small': !mostrarCategorias }" :src="$data_url + 'archivos/instituciones_logos/' + item.imgenInstitucion" />
                                    <vs-avatar v-else class="mx-auto my-6 block avatar-resp" :class="{ 'avatar-big': mostrarCategorias, 'avatar-small': !mostrarCategorias }" src="https://thumbs.dreamstime.com/b/escuela-edificio-de-dos-pisos-rojo-construcci%C3%B3n-dibujo-animado-estilo-plano-estructura-para-ni%C3%B1os-en-el-paisaje-urbano-215956734.jpg" />
                                </div>
                            </vx-card>
                        </div>
                    </div>
                </transition>
            </div>
        </div>
        <div v-else-if="VerificarUser == false" class="vx-col w-full lg:w-1/4 sm:w-1/2 mb-base cursor-pointer">
            <div v-for="(item,$index) in institucion" :key="$index">
                <vx-card class="p-2 div-hover h-full flex flex-col" @click="getDatos(item)">
                    <div class="text-center divinst">
                        <span class="textinst text-dark font-bold" style="text-shadow: 1px 5px 8px #f2f2f2;">{{ item.nombreInstitucion }}</span>
                    </div>
                    <vs-avatar v-if="item.imgenInstitucion != '' && item.imgenInstitucion != null" class="mx-auto my-6 block" size="100px" :src="$data_url+'archivos/instituciones_logos/'+item.imgenInstitucion" />
                    <vs-avatar v-else class="mx-auto my-6 block" size="100px" src="https://thumbs.dreamstime.com/b/escuela-edificio-de-dos-pisos-rojo-construcci%C3%B3n-dibujo-animado-estilo-plano-estructura-para-ni%C3%B1os-en-el-paisaje-urbano-215956734.jpg" />
                </vx-card>
            </div>
        </div>
    </div>
    <div v-else>
        <vs-alert title="Mensaje" color="rgb(231, 154, 23)" active="true">
            <p class="font-bold text-center">No tienes instituciones asignadas comunicate con soporte</p>
        </vs-alert>
    </div>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import "vue-select/dist/vue-select.css";
import vSelect from "vue-select";
Vue.use(axios)
Vue.component("v-select", vSelect);
export default {
    data() {
        return {
            usuario: [],
            users: [],
            docentes: [],
            data: [],
            institucion: [],
            usuario: [],
            inst_director: '',
            cantidad_inst: '',
            VerificarUser: false,
            ArrayComiles: [],
            mostrarCategorias: true,
            institucionesFiltradas: [],
            categorias: [{
                    nombre: 'FAE',
                    tipo: 4,
                    img: this.$data_url + 'archivos/upload/img_plataforma/LOGO_FAE.png'
                },
                {
                    nombre: 'NAVAL',
                    tipo: 5,
                    img: this.$data_url + 'archivos/upload/img_plataforma/LOGO_NAVAL.png'
                },
                {
                    nombre: 'TERRESTRE',
                    tipo: 3,
                    img: this.$data_url + 'archivos/upload/img_plataforma/LOGO_TERRESTRE.png'
                },
            ],
            busquedaInstitucion: '',
        }
    },
    computed: {
        institucionesFiltradasBuscadas() {
            if (!this.busquedaInstitucion) {
                return this.institucionesFiltradas;
            }
            const termino = this.busquedaInstitucion.toLowerCase();
            return this.institucionesFiltradas.filter(inst =>
                inst.nombreInstitucion.toLowerCase().includes(termino)
            );
        }
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
    mounted() {
        let me = this;
        localStorage.removeItem('tipoUser');
        me.funcionesGlobal()
    },
    methods: {
        async funcionesGlobal() {
            try {
                this.$vs.loading();
                await this.getVerificarDirectorPara_Comiles();
                if (this.VerificarUser == true) {
                    await this.getTodas_FAE_NAVAL_TERESTRE_FRONT();
                } else {
                    await this.getInstitucionesDirector();
                }
                this.$vs.loading.close();
            } catch (error) {
                console.error('Error en metodoInicial:', error);
            }
        },
        async getVerificarDirectorPara_Comiles() {
            let me = this;
            me.$vs.loading()
            return new Promise((resolve, reject) => {
                this.$http.get(this.$server_url + 'VerificarDirectorGeneralComiles?idusuario=' + me.usuario.idusuario)
                    .then(res => {
                        me.$vs.loading.close()
                        const respuesta = res.data.data;
                        console.log(respuesta, "hola");
                        if (respuesta.length > 0) {
                            me.VerificarUser = true;
                        } else if (respuesta.length == 0) {
                            me.VerificarUser = false;
                        }
                        resolve();
                    })
                    .catch(function (error) {
                        console.log(error)
                        me.$vs.loading.close()
                        reject();
                    })
            });
        },
        async getTodas_FAE_NAVAL_TERESTRE_FRONT() {
            let me = this;
            me.$vs.loading()
            return new Promise((resolve, reject) => {
                this.$http.get(this.$server_url + 'getTodas_FAE_NAVAL_TERESTRE_BACK')
                    .then(res => {
                        me.$vs.loading.close()
                        me.institucion = res.data;
                        me.ArrayComiles = res.data;
                        resolve();
                    })
                    .catch(function (error) {
                        console.log(error)
                        me.$vs.loading.close()
                        reject();
                    })
            });
        },
        async getInstitucionesDirector() {
            let me = this;
            me.$vs.loading()
            return new Promise((resolve, reject) => {
                this.$http.get(this.$server_url + 'verInstitucionDirector?idusuario=' + me.usuario.idusuario)
                    .then(res => {
                        me.$vs.loading.close()
                        me.institucion = res.data;
                        resolve();
                    })
                    .catch(function (error) {
                        console.log(error)
                        me.$vs.loading.close()
                        reject();
                    })
            });
        },
        abrirCategoria(cat) {
            this.institucionesFiltradas = this.ArrayComiles.filter(i => i.tipo_institucion === cat.tipo);
            this.mostrarCategorias = false;
        },
        volverCategorias() {
            this.mostrarCategorias = true;
            this.institucionesFiltradas = [];
        },
        getDatos(item) {
            let me = this;
            // console.log(item)
            localStorage.institucion = JSON.stringify(item);
            localStorage.tipoUser = "docente";
            me.$router.push('/director/institucion/docentes');
        }
    },
}
</script>

<style>
/* Estilos generales para divinst y textinst */
.divinst, .textinst {
    font-size: 13px;
    text-align: center;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Hover animado */
.div-hover {
    transition: box-shadow 180ms ease, transform 180ms ease;
}

.div-hover:hover {
    box-shadow: 0 15px 20px rgba(208, 205, 205, 0.9);
    transform: translateY(-4px);
}

/* AVATAR: transición suave y animación */
.avatar-resp {
    display: inline-block;
    overflow: hidden;
    transition: transform 320ms cubic-bezier(.2, .9, .3, 1), opacity 220ms ease;
    transform-origin: center center;
    width: 150px !important; /* Aumenta el tamaño de avatar por defecto */
    height: 150px !important; /* Aumenta el tamaño de avatar por defecto */
    border-radius: 9999px; /* Redondear el avatar */
}

/* Tamaños de avatar */
.avatar-big {
    transform: scale(0.85);
    opacity: 1;
}

.avatar-small {
    transform: scale(0.82);
    opacity: 0.98;
}

/* Ajustes responsive */
@media (max-width: 1024px) {
    .avatar-small {
        transform: scale(0.86);
    }
}

@media (max-width: 768px) {
    .avatar-resp {
        width: 100px !important; /* Aumenta el tamaño para pantallas medianas */
        height: 100px !important; /* Aumenta el tamaño para pantallas medianas */
    }

    .insts-mode .avatar-resp {
        width: 90px !important; /* Ajuste adicional para insts-mode */
        height: 90px !important; /* Ajuste adicional para insts-mode */
    }
}

@media (max-width: 480px) {
    .avatar-resp {
        width: 80px !important; /* Ajuste para pantallas pequeñas */
        height: 80px !important; /* Ajuste para pantallas pequeñas */
    }

    .insts-mode .avatar-resp {
        width: 70px !important; /* Ajuste adicional para insts-mode */
        height: 70px !important; /* Ajuste adicional para insts-mode */
    }
}

/* Animaciones fade */
.fade-enter-active,
.fade-leave-active {
    transition: opacity 280ms ease, transform 280ms ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
    transform: translateY(6px);
}

.fade-enter-to,
.fade-leave-from {
    opacity: 1;
    transform: translateY(0);
}

/* Grid básico */
.cards-grid {
    display: flex;
    flex-wrap: wrap;
    margin-left: -0.5rem;
    margin-right: -0.5rem;
}

/* Hover / Tarjetas */
.div-hover {
    transition: box-shadow 180ms ease, transform 180ms ease;
}

.div-hover:hover {
    box-shadow: 0 15px 20px rgba(208, 205, 205, 0.9);
    transform: translateY(-4px);
}

</style>
