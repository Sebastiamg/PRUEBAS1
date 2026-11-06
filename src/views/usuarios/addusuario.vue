<template>
<div>
    <vs-button class="mb-4" color="dark" icon-pack="feather" icon="icon-arrow-left" @click="regresar">Regresar</vs-button>
    <div class="vx-row mb-4">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Cédula" v-model="usuario.cedula" />
            <span v-if="errors.cedula" class="text-danger text-sm">{{ errors.cedula[0] }}</span>
        </div>
    </div>
    <div class="vx-row mb-4">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="usuario.nombres" />
            <span v-if="errors.nombres" class="text-danger text-sm">{{ errors.nombres[0] }}</span>
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="usuario.apellidos" />
            <span v-if="errors.apellidos" class="text-danger text-sm">{{ errors.apellidos[0] }}</span>

        </div>
    </div>
    <div class="vx-row mb-4">
        <div class="vx-col w-full sm:w-1/2">
            <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Correo" v-model="usuario.email" />
            <span v-if="errors.email" class="text-danger text-sm">{{ errors.email[0] }}</span>
        </div>
        <div class="vx-col w-full sm:w-1/2">
            <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Teléfono" v-model="usuario.telefono" />
            <span v-if="errors.telefono" class="text-danger text-sm">{{ errors.telefono[0] }}</span>
        </div>
    </div>
    <div class="vx-row mb-4">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Perfil</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="grupo" :reduce="grupo => grupo.id" label="deskripsi" v-model="usuario.id_group"></v-select>
            <span v-if="errors.id_group" class="text-danger text-sm">{{ errors.id_group[0] }}</span>
        </div>
    </div>
    <div class="vx-row mb-4">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Estado</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="estado" :reduce="estado => estado.id" label="label" v-model="usuario.estado_idEstado"></v-select>
            <span v-if="errors.estado_idEstado" class="text-danger text-sm">{{ errors.estado_idEstado[0] }}</span>
        </div>
    </div>
    <div class="vx-row mb-4">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Institución</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <v-select :disabled="true" :options="instituciones" :reduce="instituciones => instituciones.idInstitucion" label="nombreInstitucion" v-model="institucion.idInstitucion"></v-select>
        </div>
    </div>
    <div class="vx-row text-center">
        <vs-button :disabled="btn" @click="guardar" class="w-full mr-3 mb-2" color="success">Guardar</vs-button>
    </div>

</div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
import VueDocPreview from 'vue-doc-preview'
import Vue from 'vue'
import axios from 'axios'
import vue2Dropzone from 'vue2-dropzone'
import 'vue2-dropzone/dist/vue2Dropzone.min.css'

Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
        vueDropzone: vue2Dropzone,
        VueDocPreview,
    },
    props: {
        institucion: Object
    },
    data() {
        return {
            user:[],
            usuario: {},
            estado: [{
                    id: 1,
                    label: "Activo"
                },
                {
                    id: 2,
                    label: "Bloqueado"
                },
                {
                    id: 4,
                    label: "Eliminado"
                }
            ],
            error: '',
            password: '',
            passwordc: '',
            btn: false,
            ciudad: [],
            instituciones: [],
            grupo: [],
            idregion: '',
            idciudad: '',
            ciudadSelect: '',
            errors: {},
        }
    },
    created(){
        let me = this
        me.user = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted() {
        this.getInstituciones();
        this.getPerfiles();
    },
    methods: {
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
            me.btn = false;
            me.$vs.loading({
                color: '#046AE7'
            })
            this.usuario.institucion_idInstitucion = this.institucion.idInstitucion
            this.usuario.name_usuario = this.usuario.email
            this.$http.post(this.$server_url + 'usr', this.usuario)
                .then(function (response) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Usuario guardado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                    })
                    me.regresar();
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    if (error.response.status == 422) {
                        try {
                            me.errors = error.response.data.errors
                            console.log(me.errors)
                        } catch (error) {

                        }
                    }
                })
        },
        obtenerImagen(e) {
            let file = e.target.files[0];
            this.file = file;
        },
        getInstituciones() {
            let me = this;
            this.$http.get(this.$server_url + 'selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) {})
        },
        getPerfiles() {
            let me = this;
            this.$http.get(this.$server_url + 'obtenerPerfiles')
                .then(function (response) {
                    let datos = response.data
                    if(me.user.id_group == 10){
                        me.grupo = datos.filter( p => p.id == 4 || p.id == 6 )
                        return
                    }
                    me.grupo = response.data;
                })
                .catch(function (error) {})
        },
        getInstitucion() {
            let me = this;
            me.usuario.institucion_idInstitucion = ''
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
        generarPassword(mail) {
            let me = this;
            let formData = new FormData();
            formData.append('email', this.usuario.email);
            this.$http.post(this.$server_url + 'restaurarPassword', formData)
                .then(function (response) {
                    me.$vs.notify({
                        text: 'Contraseña generarda...',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-lock'
                    })
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'Error en el proceso',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-lock'
                    })
                })
        },
        regresar() {
            this.$emit("estado", {
                plista: true,
                pnuevo: false,
                peditar: false,
            });
        },
    },
}
</script>

<style>
.uploading-image {
    display: flex;
}
</style>
