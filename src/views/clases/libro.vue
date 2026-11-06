<template>
<div>
    <div class="demo-alignment">
        <vs-button @click="activePrompt = true" color="dark">Agregar libro</vs-button>
    </div>
    <div class="vx-row">
        <div class="vx-col w-1/2 md:w-1/3 xl:w-1/4 mt-3" v-for="(item,$index) in libros" :key="$index">
            <vx-card class="text-center">
                <div slot="no-body">
                    <img v-if="item.weblibro != null " class="responsive card-img-top" v-bind:src="$data_url+'archivos/upload/libro/'+item.weblibro+'/portada.png'" alt="Card image cap">
                    <img v-else class="responsive card-img-top" v-bind:src="$data_url+'archivos/img/'+item.portada" alt="Card image cap">
                </div>
                <p class="font-bold">
                    {{item.nombrelibro}}
                </p>
                <small>
                    {{item.descripcionlibro}}
                </small>
                <div class="flex flex-wrap mt-4">
                    <div class="w-1/3 ml-auto">
                        <vs-button radius color="primary" type="filled" @click="datolibro(item.weblibro)" icon-pack="feather" icon="icon-eye"></vs-button>
                    </div>
                    <div class="w-1/3 ml-auto">
                        <vs-button radius color="danger" type="filled" @click="eliminarLibro(item.id)" icon-pack="feather" icon="icon-trash"></vs-button>
                    </div>
                </div>
            </vx-card>
        </div>
    </div>
    <vs-prompt title="Nuevo libro" @cancel="idlibro=''" @accept="acceptAlert" @close="close" :active.sync="activePrompt">
        <div class="con-exemple-prompt">
            <span>Selecciona un libro</span>
            <v-select :options="select" :reduce="select => select.idlibro" label="nombrelibro" v-model="idlibro"></v-select>
        </div>
    </vs-prompt>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css';
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            activePrompt: false,
            activePrompt2: false,
            val: '',
            idlibro: '',
            valMultipe: {
                value1: '',
                value2: ''
            },
            select: [],
            libros: [],
        }
    },
    computed: {
        validName() {
            return (this.valMultipe.value1.length > 0 && this.valMultipe.value2.length > 0)
        }
    },
    mounted() {
        this.getLibroSelect()
        this.getLibros()
    },
    methods: {
        acceptAlert() {
            let me = this;
            let formData = new FormData();
            formData.append('idlibro', me.idlibro);
            formData.append('idcurso', 908);
            this.$http.post(this.$server_url+'postLibroCurso', formData)
                .then(function (response) {
                    me.getLibros();
                    me.$vs.notify({
                        color: 'success',
                        title: 'Guardado',
                        text: 'Libro Agregado'
                    })
                })
                .catch(function (error) {})

        },
        close() {
            this.$vs.notify({
                color: 'danger',
                title: '',
                text: 'Datos no guardados!'
            })
        },
        clearValMultiple() {
            this.valMultipe.value1 = "";
            this.valMultipe.value2 = "";
        },
        async getLibroSelect() {
            let me = this;
            var url = this.$server_url+"librosEstudiante?idusuario=5763";
            this.$http.get(url).then(function (response) {
                    me.select = response.data;
                })
                .catch(function (error) {

                });
        },
        async getLibros() {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            this.$http.get(this.$server_url+'librosCurso?idcurso=908')
                .then(function (response) {
                    me.libros = response.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        eliminarLibro(id) {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            this.$http.get(this.$server_url+'librosCursoEliminar?id=' + id)
                .then(function (response) {
                    me.$vs.notify({
                        color: 'success',
                        title: '',
                        text: 'Libro eliminado!'
                    })
                    me.$vs.loading.close()
                    me.getLibros();
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        datolibro(url){
            localStorage.url = url;
            this.$router.push('/libro/digital');

        }
    },
}
</script>
