<template>
<div>
    <vx-card>
        <vs-row class="mb-4" vs-align="flex-end" vs-type="flex" vs-justify="center" vs-w="12">
            <div class="vx-col sm:w-full md:w-1/2">
                <vs-avatar class="text-center" size="100px" :src="$data_url+'archivos/perfil/'+usuario.foto_user" />
            </div>
            <div class="vx-col sm:w-full md:w-1/2">
                <vs-button @click="generarPassword(usuario.email)">Generar contraseña</vs-button>
            </div>
        </vs-row>
        <div class="vx-row mb-4">
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Cédula" v-model="usuario.cedula" />
            </div>
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Usuario" v-model="usuario.name_usuario" />
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="usuario.nombres" />
            </div>
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="usuario.apellidos" />
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col w-full sm:w-1/2">
                <vs-input type="email" class="w-full" icon-pack="feather" icon="icon-mail" icon-no-border label="Correo" v-model="usuario.email" />
            </div>
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full" type="tel" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Teléfono" v-model="usuario.telefono" />
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Perfil</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select :options="grupo" :reduce="grupo => grupo.id" label="deskripsi" v-model="usuario.id_group"></v-select>
            </div>
        </div>
        <div class="vx-row mb-4">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Institución</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <v-select :options="instituciones" :reduce="instituciones => instituciones.idInstitucion" label="nombreInstitucion" v-model="usuario.institucion_idInstitucion"></v-select>
            </div>
        </div>
        <div class="vx-row text-center">
            <vs-button :disabled="btn" @click="guardar" class="w-full mr-3 mb-2" color="success">Guardar</vs-button>
        </div>
    </vx-card>
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
        VueDocPreview
    },
    props: {
        id: String
    },
    data() {
        return {
            file: [],
            usuario: {
                idusuario: ''
            },
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
        }
    },
    mounted() {
        this.getInstituciones();
        this.getPerfiles();
        this.getusuario();
    },
    methods: {
        getusuario() {
            let me = this
            me.$vs.loading({
                color: '#046AE7'
            })
            console.log(this.$route.params.id)
            this.$http.get(this.$server_url+'usr/' + this.id)
                .then(function (response) {
                    me.usuario = response.data;
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    me.$vs.loading.close();
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
            me.btn = false;
            me.$vs.loading({
                color: '#046AE7'
            })
            let formData = new FormData();
            formData.append('idusuario', this.usuario.idusuario);
            formData.append('cedula', this.usuario.cedula);
            formData.append('nombres', this.usuario.nombres);
            formData.append('apellidos', this.usuario.apellidos);
            formData.append('email', this.usuario.email);
            formData.append('telefono', this.usuario.telefono);
            formData.append('institucion_idInstitucion', this.usuario.institucion_idInstitucion);
            formData.append('id_group', this.usuario.id_group);
            this.$http.post(this.$server_url+'usr', formData)
                .then(function (response) {
                    me.$vs.loading.close();
                    me.$vs.notify({
                        text: 'Usuario guardado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-user'
                    })
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        obtenerImagen(e) {
            let file = e.target.files[0];
            this.file = file;
        },
        getInstituciones() {
            let me = this;
            this.$http.get(this.$server_url+'selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                })
                .catch(function (error) {})
        },
        getPerfiles() {
            let me = this;
            this.$http.get(this.$server_url+'rol')
                .then(function (response) {
                    me.grupo = response.data;
                })
                .catch(function (error) {})
        },
        getInstitucion() {
            let me = this;
            me.usuario.institucion_idInstitucion = ''
            this.$http.get(this.$server_url+'selectInstitucion?idregion=' + me.idregion + '&idciudad=' + me.idciudad)
                .then(function (response) {
                    me.instituciones = response.data;
                    // console.log( me.instituciones )
                })
                .catch(function (error) {})
        },
        async getCiudadSelect() {
            let me = this;
            this.$http.get(this.$server_url+"ciudad").then(function (response) {
                me.ciudad = response.data
            });
        },
        generarPassword(mail) {
            let me = this;
             let formData = new FormData();
            formData.append('email', this.usuario.email);
            this.$http.post(this.$server_url+'restaurar',formData)
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
        }
    },
}
</script>

<style>
.uploading-image {
    display: flex;
}
</style>
