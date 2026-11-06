<template>
<div>
    <div class="vx-row">
        <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-3" v-for="(item,$index) in cuadernos" :key="$index">
            <vx-card class="text-center">
                <div slot="no-body">
                    <!-- <img v-if="item.webcuaderno != null " class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/cuadernodigital/'+item.webcuaderno+'/portada.png'" alt="Card image cap">
                    <img v-else class="responsive card-img-top" v-bind:src="$data_url+'archivos/img/'+item.portada" alt="Card image cap"> -->
                    <img v-if="item.webcuaderno != '' " class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/cuadernodigital/'+item.webcuaderno+'/portada.jpg'" alt="Card image cap">
                    <img v-else class="responsive card-img-top" v-bind:src="$data_url+'tareas/img/'+item.portada" alt="Card image cap">
                </div>
                <p class="font-bold">
                    {{item.nombrecuaderno}}
                </p>
                <small>
                    {{item.descripcioncuaderno}}
                </small>
                <div class="w-3/3 ml-auto mt-3">
                    <vs-button color="primary" class="w-full" type="border" icon-pack="feather" @click="datocuaderno(item)" icon="icon-book">Cuaderno Web</vs-button>
                </div>
            </vx-card>
        </div>
    </div>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.use(axios)
export default {
    mixins: [historicoMixin],
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            activePrompt: false,
            activePrompt2: false,
            val: '',
            idcuaderno: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            cuadernos: [],
            usuario: [],
            miusuario:[],
            codigo: '',
            isNavOpen: false,
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.miusuario = this.usuario;
    },
    mounted() {
        this.wasSidebarOpen = this.$store.state.reduceButton
        this.$store.commit('TOGGLE_REDUCE_BUTTON', false)
        this.getLibros()
    },
    methods: {
        async getLibros() {
            let me = this;
            this.$http.get(this.$server_url+'codigosCuaderno?idusuario=' + me.usuario.idusuario)
                .then(function (response) {
                    me.cuadernos = response.data
                })
                .catch(function (error) {})
        },
        datocuaderno(url) {
            let me = this;
            //GUARDAR EN EL HISTORICO
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = url.asignatura_idasignatura
            let h_nombreasignatura = url.descripcioncuaderno
            let h_recursotipo = 3; //1 = libro
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'cuaderno',
                'recurso_nombre': url.nombrecuaderno,
                'recurso_detalle': 'cuaderno completo',
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico) 
            localStorage.url = url.webcuaderno;
            // this.$router.push('/estudiante/cuaderno/digital');
            let route = me.$router.resolve({path: '/estudiante/cuaderno/digital'});
            window.open(route.href, '_blank');
        },
        acceptAlert() {
            let me = this;
            let formData = new FormData();
            if (!me.codigo) {
                me.$vs.notify({
                    color: 'warning',
                    title: 'Ingrese un código',
                })
            } else {
                formData.append('codigo', me.codigo);
                formData.append('idusuario', me.usuario.idusuario);
                this.$http.post(this.$server_url+'codigosCuaderno', formData)
                    .then(function (response) {
                        me.getLibros();
                        me.codigo = ''
                        me.$vs.notify({
                            color: 'success',
                            title: 'Guardado',
                            text: 'Libro Agregado'
                        })
                    })
                    .catch(function (error) {})
            }

        },
        close() {
            this.$vs.notify({
                color: 'danger',
                title: '',
                text: 'Datos no guardados!'
            })
        },
    },
}
</script>
