<template>
    <div class="px-3">
        <div class="vx-row mb-6">
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full mb-3" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Cédula" v-model="usuario.cedula" />
            </div>
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full mb-3" icon-pack="feather" icon="icon-user" icon-no-border label="Nombres" v-model="usuario.nombres" />
            </div>
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full mb-3" icon-pack="feather" icon="icon-user" icon-no-border label="Apellidos" v-model="usuario.apellidos" />
            </div>
            <div class="vx-col w-full sm:w-1/2">
                <vs-input type="email" class="w-full mb-3" icon-pack="feather" icon="icon-mail" icon-no-border label="Correo" v-model="usuario.email" />
            </div>
            <div class="vx-col w-full sm:w-1/2">
                <vs-input class="w-full mb-3" type="tel" icon-pack="feather" icon="icon-smartphone" icon-no-border label="Teléfono" v-model="usuario.telefono" />
            </div>
        </div>
        <div class="w-full" align="right">
            <vs-button  @click="guardar" color="success">Guardar</vs-button>
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
        VueDocPreview
    },
    data() {
        return {
            file: [],
            user:[],
            usuario: [],
            usuario_creador: [],
            error: '',
            password: '',
            passwordc: '',
            btn: true,
            instituciones: [],
            idregion: '',
            institucion_selected: '',
            institucion_estudiante: [],
        }
    },
    created() {
        this.institucion_selected = localStorage.getItem('institucion_selected_pedido')
    },
    mounted() {
        let me = this;
        me.usuario_creador = JSON.parse(localStorage.getItem('usuario'));
    },
    methods: {
        async guardar() {
            let me = this

             if( me.usuario.nombres == '' || me.usuario.apellidos == '' || me.usuario.email == '' || me.usuario.correo == '' ||  me.usuario.telefono == '' ){
                me.$vs.notify({ color: 'warning', title: 'Alerta', text: 'Complete todos los campos antes de guardar.' })
                return
            }

            me.$vs.loading();

            let formData = new FormData();
            formData.append('cedula', this.usuario.cedula);
            formData.append('nombres', this.usuario.nombres);
            formData.append('apellidos', this.usuario.apellidos);
            formData.append('email', this.usuario.email);
            formData.append('telefono', this.usuario.telefono);
            formData.append('institucion_idInstitucion', this.institucion_selected);
            formData.append('idcreadorusuario', this.usuario_creador.idusuario);

            this.$http.post(this.$server_url+'guardar_responsable_pedido', formData)
            .then(function (response) {
                me.$vs.loading.close();
                if(response.data.status == 0){
                    me.$vs.notify({ color: 'danger', title:'Error' , text: response.data.message, time:4000})
                    return
                }
                me.$vs.notify({ color: 'success', title: 'Éxito', text: 'Responsable registrado correctamente.' })
                
            })
            .catch(function (error) {
              me.$vs.loading.close()
              if (error.response.status == 422) {
                  try {
                      me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.cedula[0] })
                  } catch (error) {

                  }
                  try {
                      me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.nombres[0] })
                  } catch (error) {

                  }
                  try {
                      me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.apellidos[0] })
                  } catch (error) {

                  }
                  try {
                      me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.email[0] })
                  } catch (error) {

                  }
                  try {
                      me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.password[0] })
                  } catch (error) {

                  }
              }

            })
        },
    },
}
</script>
