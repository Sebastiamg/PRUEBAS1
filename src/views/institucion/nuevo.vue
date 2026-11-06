<template>
<vs-sidebar click-not-close position-right parent="body" default-index="1" color="primary" class="add-new-data-sidebar items-no-padding" spacer v-model="isSidebarActiveLocal">
    <div class="mt-6 flex items-center justify-between px-6">
        <!-- <h4>{{ Object.entries(this.data).length === 0 ? "ADD NEW" : "UPDATE" }} ITEM</h4> -->
        <h4>Nueva Institución</h4>
        <feather-icon icon="XIcon" @click.stop="isSidebarActiveLocal = false" class="cursor-pointer"></feather-icon>
    </div>
    <vs-divider class="mb-0"></vs-divider>

    <component :is="scrollbarTag" class="scroll-area--data-list-add-new" :key="$vs.rtl">

        <div class="p-6">
            <div class="vx-row mb-6">
                <input type="text" v-model="institucion.idInstitucion" hidden>
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Nombre</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <vs-input class="w-full" icon-no-border v-model="institucion.nombreInstitucion" />
                    <span class="text-danger text-sm" v-show="errors.nombreInstitucion">{{ errors.nombreInstitucion }}</span>
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Dirección</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <vs-input class="w-full" icon-no-border v-model="institucion.direccionInstitucion" />
                    <span class="text-danger text-sm" v-show="errors.direccionInstitucion">{{ errors.direccionInstitucion }}</span>
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Teléfono</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <vs-input class="w-full" icon-no-border v-model="institucion.telefonoInstitucion" />
                    <span class="text-danger text-sm" v-show="errors.telefonoInstitucion">{{ errors.telefonoInstitucion }}</span>
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Solicitud</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <vs-input class="w-full" icon-no-border v-model="institucion.solicitudInstitucion" />
                    <span class="text-danger text-sm" v-show="errors.solicitudInstitucion">{{ errors.solicitudInstitucion }}</span>
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Región</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <ul class="demo-alignment">
                        <li>
                            <vs-radio v-model="institucion.region_idregion" vs-value="2">Costa</vs-radio>
                        </li>
                        <li>
                            <vs-radio v-model="institucion.region_idregion" vs-value="1">Sierra</vs-radio>
                        </li>
                    </ul>
                    <span class="text-danger text-sm" v-show="errors.region_idregion">{{ errors.region_idregion }}</span>
                </div>
            </div>

            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Ciudad</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <v-select :options="ciudad" :reduce="ciudad => ciudad.idciudad" label="nombre" v-model="institucion.ciudad_id"></v-select>
                    <span class="text-danger text-sm" v-show="errors.ciudad_id">{{ errors.ciudad_id }}</span>
                </div>
            </div>

            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Vendedor</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <v-select :options="vendedor" :reduce="vendedor => vendedor.cedula" label="nombres" v-model="institucion.vendedorInstitucion"></v-select>
                    <span class="text-danger text-sm" v-show="errors.vendedorInstitucion">{{ errors.vendedorInstitucion }}</span>
                </div>
            </div>

            <div class="vx-row mb-6" v-if="!institucion.idInstitucion">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Período Escolar</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <v-select :options="periodo" :reduce="periodo => periodo.idperiodoescolar" label="descripcion" v-model="institucion.periodoescolar"></v-select>
                    <span class="text-danger text-sm" v-show="errors.periodoescolar">{{ errors.periodoescolar }}</span>
                </div>
            </div>
        </div>
    </component>

    <div class="p-2 text-center" slot="footer">
        <div class="flex flex-wrap mt-4">
            <div class="w-1/3 ml-auto">
                <vs-button color="danger" type="border" class="mb-2" @click.stop="isSidebarActiveLocal = false">Cancelar</vs-button>
            </div>
            <div class="w-1/3 ml-auto">
                <vs-button color="success" type="border" @click="guardar(institucion)" class="mb-2">Registrar institución</vs-button>
            </div>
        </div>
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
        numero:'',
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
            institucion: {
                'idInstitucion': '',
                'nombreInstitucion': '',
                'telefonoInstitucion': '',
                'direccionInstitucion': '',
                'solicitudInstitucion': '',
                'vendedorInstitucion': '',
                'periodoescolar': '',
                'ciudad_id': '',
                'region_idregion': '',
            },
            errors: {
                'nombreInstitucion': '',
                'telefonoInstitucion': '',
                'direccionInstitucion': '',
                'solicitudInstitucion': '',
                'vendedorInstitucion': '',
                'periodoescolar': '',
                'ciudad_id': '',
                'region_idregion': '',
            },
            titulo: '',
            ciudad: [],
            region: [],
            periodo: [],
            vendedor: []
        }
    },
    mounted() {
        this.getCiudadSelect();
        this.getRegionSelect();
        this.getPeriodoSelect();
        this.getVendedor();
        if (!this.$route.params.id) {
            this.titulo = "Nueva Institución";
        } else {
            this.titulo = "Editar Institución";
            this.getInstitucion(this.$route.params.id);
        }
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
        // isFormValid() {
        //     return !this.errors.any() && this.dataName && this.dataCategory && this.dataPrice > 0
        // },
        scrollbarTag() {
            return this.$store.getters.scrollbarTag
        }
    },
    methods: {
        async getCiudadSelect() {
            let me = this;
            this.$http.get(this.$server_url+"ciudad").then(function (response) {
                me.ciudad = response.data;
                // console.log(me.ciudad);
            });
        },
        async getRegionSelect() {
            let me = this;
            this.$http.get(this.$server_url+"region").then(function (response) {
                me.region = response.data;
            });
        },
        async getPeriodoSelect() {
            let me = this;
            this.$http.get(this.$server_url+"periodo").then(function (response) {
                me.periodo = response.data;
            });
        },
        async getInstitucion(idinstitucion) {
            let me = this;
            console.log(idinstitucion);
            this.$http.get(this.$server_url+"institucion/" + idinstitucion)
                .then(function (response) {
                    // console.log(response.data);
                    me.institucion = response.data;
                })
                .catch(function (error) {})
        },
        guardar(data) {
            let me = this;
            this.errors = {
                'idInstitucion': '',
                'nombreInstitucion': '',
                'telefonoInstitucion': '',
                'direccionInstitucion': '',
                'solicitudInstitucion': '',
                'vendedorInstitucion': '',
                'periodoescolar': '',
                'ciudad_id': '',
                'region_idregion': '',
            }
            let formData = new FormData();
            formData.append('idInstitucion', me.institucion.idInstitucion);
            formData.append('nombreInstitucion', me.institucion.nombreInstitucion);
            formData.append('telefonoInstitucion', me.institucion.telefonoInstitucion);
            formData.append('direccionInstitucion', me.institucion.direccionInstitucion);
            formData.append('solicitudInstitucion', me.institucion.solicitudInstitucion);
            formData.append('vendedorInstitucion', me.institucion.vendedorInstitucion);
            formData.append('periodoescolar', me.institucion.periodoescolar);
            formData.append('ciudad_id', me.institucion.ciudad_id);
            formData.append('region_idregion', me.institucion.region_idregion);
            this.$http.post(this.$server_url+"institucion", formData)
                .then(function (response) {
                    me.isSidebarActiveLocal = false
                })
                .catch(function (error) {
                    if (error.response.status == '422') {
                        console.log(error.response.data);
                        me.errors.nombreInstitucion = error.response.data.errors.nombreInstitucion[0];
                        me.errors.telefonoInstitucion = error.response.data.errors.telefonoInstitucion[0];
                        me.errors.direccionInstitucion = error.response.data.errors.direccionInstitucion[0];
                        me.errors.solicitudInstitucion = error.response.data.errors.solicitudInstitucion[0];
                        me.errors.vendedorInstitucion = error.response.data.errors.vendedorInstitucion[0];
                        me.errors.periodoescolar = error.response.data.errors.periodoescolar[0];
                        me.errors.ciudad_id = error.response.data.errors.ciudad_id[0];
                        me.errors.region_idregion = error.response.data.errors.region_idregion[0];
                    }
                })
        },
        async getVendedor() {
            let me = this;
            this.$http.get(this.$server_url+'vendedor')
                .then(function (response) {
                    me.vendedor = response.data;
                    // console.log(me.vendedor);
                })
                .catch(function (error) {})
        },
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
