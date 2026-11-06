<template>
<div>
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
                <div class="w-3/3 ml-auto">
                    <vs-button color="danger" class="w-full" type="line" icon-pack="feather" icon="icon-file" icon-after>Pdf con guía</vs-button>
                </div>
                <div class="w-3/3 ml-auto">
                    <vs-button color="danger" class="w-full" type="line" icon-pack="feather" icon="icon-file" icon-after>Pdf con guía</vs-button>
                </div>
                <div class="w-3/3 ml-auto">
                    <vs-button color="danger" class="w-full" type="line" icon-pack="feather" icon="icon-file" icon-after>Guía didáctica</vs-button>
                </div>
                <div class="w-3/3 ml-auto mt-3">
                    <vs-button color="primary" class="w-full" type="border" icon-pack="feather" @click="datolibro(item.weblibro)" icon="icon-book">Libro Web</vs-button>
                </div>
            </vx-card>
        </div>
    </div>
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
        this.getLibros()
    },
    methods: {
        async getLibros() {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            this.$http.get(this.$server_url+'libros?idusuario=5763&idinstitucion=66')
                .then(function (response) {
                    me.libros = response.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        datolibro(url) {
            localStorage.url = url;
            this.$router.push('/libro/digital');

        }
    },
}
</script>
