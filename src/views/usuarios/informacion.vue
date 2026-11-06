<template>
<vx-card>
    <vs-row class="mb-4" vs-align="flex-end" vs-type="flex" vs-justify="center" vs-w="12">
        <div class="vx-col sm:w-full md:w-1/2">
            <vs-avatar class="text-center" size="100px" :src="$data_url+'archivos/'+'perfil/'+usuario.foto_user" />
        </div>
        <div class="vx-col sm:w-full md:w-1/2">
            <vs-button ref="loadableButton" id="button-with-loading" class="vs-con-loading__container" @click="generarPassword(usuario.email)" type="relief">
                Resetear contraseña
            </vs-button>
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
    <div class="vx-row mb-6" v-if="usuario.id_group == '4'">
        <div class="vx-col w-full sm:w-1/2">
            Grado:
             <v-select :options="cursos" :reduce="cursos => cursos.orden" label="nombrenivel" class="w-full" v-model="usuario.curso" />
        </div>
        <div class="vx-col w-full sm:w-1/2">
            Paralelo
            <v-select :options="paralelos" :reduce="paralelos => paralelos.id" label="label" v-model="usuario.paralelo"></v-select>
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
            <span>Estado</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <v-select :options="estado" :reduce="estado => estado.id" label="label" v-model="usuario.estado_idEstado"></v-select>
        </div>
    </div>

    <div class="vx-row mb-4">
        <div class="vx-col sm:w-1/3 w-full">
            <span>Institución</span>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
            <v-select :disabled="desabilitar_boton"  :options="instituciones" :reduce="instituciones => instituciones.idInstitucion" label="nombreInstitucion" v-model="usuario.institucion_idInstitucion"></v-select>
        </div>
    </div>

    <div class="vx-row text-center">
        <vs-button :disabled="btn" @click="guardar" class="w-full mr-3 mb-2" color="success">Guardar</vs-button>
    </div>
</vx-card>
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
        usuario: Object
    },
    data() {
        return {
            file: [],
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
            paralelos: [{
                    id: 1,
                    label: "A"
                },
                {
                    id: 2,
                    label: "B"
                },
                {
                    id: 3,
                    label: "C"
                },
                {
                    id: 4,
                    label: "D"
                },
                {
                    id: 5,
                    label: "E"
                },
                {
                    id: 6,
                    label: "F"
                },
            ],
            error: '',
            password: '',
            passwordc: '',
            btn: false,
            ciudad: [],
            instituciones: [],
            grupo: [],
            cursos:[],
            idregion: '',
            idciudad: '',
            ciudadSelect: '',
            backgroundLoading: 'primary',
            colorLoading: '#fff',
            tmpUs: '',
            perfil_autorizado:'',
            desabilitar_boton:false,
        }
    },
    created(){
        let me = this;
    },
    mounted() {
        let me = this;
        me.tmpUs = JSON.parse(localStorage.getItem('usuario'));
        me.perfil_autorizado = me.tmpUs.id_group
        if(me.perfil_autorizado == 1){
            me.desabilitar_boton = false;

        }else{
            me.desabilitar_boton = true;
        }
        me.getInstituciones();
        me.getPerfiles();
        me.infoRegistro()
        // console.log(this.usuario)
        // me.usuario.curso = {orden:me.usuario.curso, nombrenivel:me.usuario.nombrenivel};

    },
    methods: {
        infoRegistro() {
            let me = this;
            this.$http.get(this.$server_url+'infoRegistro')
            .then(function (res) {
                // me.paralelos = res.data.paralelos
                me.cursos = res.data.cursos
            })
            .catch(function (error) {
                console.log(error + ' error');
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
            formData.append('name_usuario', this.usuario.name_usuario);
            formData.append('telefono', this.usuario.telefono);
            formData.append('estado_idEstado', this.usuario.estado_idEstado);
            formData.append('institucion_idInstitucion', this.usuario.institucion_idInstitucion);
            formData.append('id_group', this.usuario.id_group);
            console.log("rr",this.usuario.paralelo)
            if(this.usuario.curso == null || this.usuario.curso == undefined || this.usuario.curso == ""){
                formData.append('curso', "");
            }else{
                formData.append('curso', this.usuario.curso);
            }
             if(this.usuario.paralelo == null || this.usuario.paralelo == undefined || this.usuario.paralelo == ""){
                formData.append('paralelo', "");
            }else{
                formData.append('paralelo', this.usuario.paralelo);
            }
            this.$http.post(this.$server_url + 'usr', formData)
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
                    if(me.tmpUs.id_group == 10){
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
            this.$vs.loading({
                background: this.backgroundLoading,
                color: this.colorLoading,
                container: "#button-with-loading",
                scale: 0.45
            })
            formData.append('email', this.usuario.email);
            this.$http.post(this.$server_url + 'restaurarPassword', formData)
                .then(function (response) {
                    me.$vs.notify({
                        text: 'Use el número de cédula para acceder al perfil del usuario.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-lock'
                    })
                    me.$vs.loading.close("#button-with-loading > .con-vs-loading")
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'Error en el proceso',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-lock'
                    })
                    me.$vs.loading.close("#button-with-loading > .con-vs-loading")
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
