<template>
<vx-card title="Cambio de Contraseña">
    <div class="vx-col  w-full mb-base">
        <form enctype="multipart/form-data">
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Contraseña Nueva</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <vs-input @input="verificar" type="password"  class="w-full" icon-pack="feather" icon-no-border v-model="password" />
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Verificar Contraseña</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <vs-input  @input="verificar" type="password" class="w-full" icon-no-border v-model="passwordv" />
                    <span class="text-danger text-sm">{{ error }}</span>
                </div>
            </div>

            <div class="flex flex-wrap mt-4">
                <div class="w-1/3 ml-auto">
                    <vs-button color="success" :disabled="btn" type="border" @click="guardar()" class="mb-2 w-full">Enviar</vs-button>
                </div>
            </div>
        </form>
    </div>
</vx-card>
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
            institucion: {},
            titulo: '',
            ciudad: [],
            usuario: [],
            region: [],
            periodo: [],
            vendedor: [],
            password:'',
            passwordv:'',
            error:'',
            btn:true
        }
    },
    mounted() {
        // this.getCiudadSelect();
        // this.getRegionSelect();
        // this.getPeriodoSelect();
        // this.getVendedor();
        if (!this.$route.params.id) {
            this.titulo = "Nueva Institución";
        } else {
            this.titulo = "Editar Institución";
            this.getInstitucion(this.$route.params.id);
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        // console.log( this.usuario.idusuario) 
    },
    methods: {
        verificar(){
            var n = this.password.localeCompare(this.passwordv);
            if(n == 0){
                this.btn = false;
                this.error = ""
            }else{
                this.btn = true;
                this.error = "Contraseñas no coinciden"
            }
        },
        guardar() {
            let me = this;
            let formData = new FormData();
            formData.append('idusuario', me.usuario.idusuario);
            formData.append('password', me.password);
            this.$http.post(this.$server_url+"cambio_password", formData)
                .then(function (response) {
                    localStorage.setItem('usuario', JSON.stringify(response.data));
                    me.$router.push('/home');
                })
                .catch(function (error) {
				})
        },
    },
}
</script>
