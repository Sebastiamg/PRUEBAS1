<template>
<div class="vx-row">
    <div class="vx-col mt-4 w-full">
        <vx-card he title-color="primary">
            <div class="vx-row mb-6 mt-4">
                <div class="vx-col sm:w-1/2 w-full">
                    <b class="mt-8">Unidades</b><br>
                    <div class="radio-group  grupo-unidades">
                        <input type="radio" id="option-one" name="selector" @input="getContenido()" @click="unidad=1" v-bind:value="'1'"><label for="option-one">1</label>
                        <input type="radio" id="option-two" name="selector" @input="getContenido()" @click="unidad=2" v-bind:value="'2'"><label for="option-two">2</label>
                        <input type="radio" id="option-three" name="selector" @input="getContenido()" @click="unidad=3" v-bind:value="'3'"><label for="option-three">3</label>
                        <input type="radio" id="option-4" name="selector" @input="getContenido()" @click="unidad=4" v-bind:value="'4'"><label for="option-4">4</label>
                        <input type="radio" id="option-5" name="selector" @input="getContenido()" @click="unidad=5" v-bind:value="'5'"><label for="option-5">5</label>
                        <input type="radio" id="option-6" name="selector" @input="getContenido()" @click="unidad=6" v-bind:value="'6'"><label for="option-6">6</label>
                        <input type="radio" id="option-7" name="selector" @input="getContenido()" @click="unidad=7" v-bind:value="'7'"><label for="option-7">7</label>
                        <input type="radio" id="option-8" name="selector" @input="getContenido()" @click="unidad=8" v-bind:value="'8'"><label for="option-8">8</label>
                    </div>
                </div>
                <!-- <div class="vx-col sm:w-3/4 w-full">
                    <div class="demo-alignment">
                        <input type="radio" id="radioPerfiles1" @input="getContenido()" @click="unidad=1" v-bind:value="'1'" v-model="unidad" class="option-input radio">
                        <b for="uno"> Unidad 1</b>
                        <input type="radio" id="radioPerfiles1" @input="getContenido()" @click="unidad=2" v-bind:value="'2'" v-model="unidad" class="option-input radio">
                        <b for="uno"> Unidad 2</b>
                        <input type="radio" id="radioPerfiles1" @input="getContenido()" @click="unidad=3" v-bind:value="'3'" v-model="unidad" class="option-input radio">
                        <b for="uno"> Unidad 3</b>
                        <input type="radio" id="radioPerfiles1" @input="getContenido()" @click="unidad=4" v-bind:value="'4'" v-model="unidad" class="option-input radio">
                        <b for="uno"> Unidad 4</b>
                        <input type="radio" id="radioPerfiles1" @input="getContenido()" @click="unidad=5" v-bind:value="'5'" v-model="unidad" class="option-input radio">
                        <b for="uno"> Unidad 5</b>
                        <input type="radio" id="radioPerfiles1" @input="getContenido()" @click="unidad=6" v-bind:value="'6'" v-model="unidad" class="option-input radio">
                        <b for="uno"> Unidad 6</b>
                        <input type="radio" id="radioPerfiles1" @input="getContenido()" @click="unidad=7" v-bind:value="'7'" v-model="unidad" class="option-input radio">
                        <b for="uno"> Unidad 7</b>
                        <input type="radio" id="radioPerfiles1" @input="getContenido()" @click="unidad=8" v-bind:value="'8'" v-model="unidad" class="option-input radio">
                        <b for="uno"> Unidad 8</b>
                    </div>
                </div> -->
                <div class="vx-col sm:w-1/2 w-full">
                    <b class="mt-8">Asignatura</b>
                    <v-select class="mb-base" @input="getContenido()" :options="asignaturas" :reduce="asignaturas => asignaturas.asignatura_idasignatura" v-model="idasignatura" label="nombreasignatura" />
                </div>
            </div>
            <!-- <br>
            <div class="vx-row mb-6 mt-4">
                
                <div class="vx-col sm:w-2/3 w-full">
                </div>
            </div> -->
            <vs-table max-items="10" search pagination :data="listaContenido">
                <template slot="thead">
                    <vs-th>Archivo</vs-th>
                    <vs-th>Temas</vs-th>
                    <vs-th sort-key="unidad">Unidad</vs-th>
                    <vs-th>Fecha de registro</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td :data="data[indextr].nombre">
                            <a v-bind:href="$data_url+'tareas/'+data[indextr].url" target="_blank">
                                <p>
                                    {{data[indextr].nombre.substr(0,35)}}
                                </p>
                            </a>
                        </vs-td>
                        <vs-td>
                            <ul :key="item" v-for="item in data[indextr].temas">
                                <li>{{item.nombre_tema}} </li>
                            </ul>
                        </vs-td>
                        <vs-td :data="data[indextr].unidad">
                            {{data[indextr].unidad}}
                        </vs-td>
                        <vs-td :data="data[indextr].updated_at">
                            {{data[indextr].updated_at}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vx-card>
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
            unidad: '',
            usuario: [],
            asignaturas: [],
            listaContenido: [],
            file: [],
            idasignatura: '',
            dropzoneOptions: {
                url: './',
                dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> Click o arrastra un archivo aquí.",
                chunking: true,
                thumbnailWidth: 150,
                maxFilesize: 10.5,
                addRemoveLinks: true,
                headers: {
                    "My-Awesome-Header": "header value"
                }
            },
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
    },
    mounted() {
        this.getAsignaturas();
        this.getContenidoTodo();
    },
    methods: {
        async getContenido() {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            var url = this.$server_url+"getContenidoTodo?idusuario="+me.usuario.idusuario+"&idasignatura=" + me.idasignatura + "&unidad="+me.unidad;
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data.items;
                    me.listaContenido = response.data.items;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                });
        },
        async getAsignaturas() {
            let me = this;
            this.$http.get(this.$server_url+"asignatura/"+me.usuario.idusuario)
                .then(function (response) {
                    me.asignaturas = response.data
                })
                .catch(function (error) {})
        },
        async getContenidoTodo() {
            let me = this;
            me.$vs.loading({
                color: '#046AE7'
            })
            var url = this.$server_url+"getContenidoTodo?idusuario="+me.usuario.idusuario;
            this.$http.get(url).then(function (response) {
                    var respuesta = response.data.items;
                    me.listaContenido = response.data.items;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
    },
}
</script>


<style lang="scss">
$bg: #004bd6;
$fg: lighten($bg, 20%);
$borderWidth: 2px;

.grupo-unidades >input[type=radio] {
    position: absolute;
    visibility: hidden;
    display: none;
}

.grupo-unidades >label {
    // color: lighten($bg, 40%);
    color: rgb(0, 0, 0);
    display: inline-block;
    cursor: pointer;
    font-weight: 500;
    padding: 5px 20px;
    background: #cddcfc;
}

.grupo-unidades >input[type=radio]:checked+label {
    color: lighten($bg, 60%);
    background: $fg;
}

.grupo-unidades >label+input[type=radio]+label {
    // border: solid $borderWidth $fg;
    // background: $fg;
}

.radio-group {
    // border: solid $borderWidth $fg;
    display: inline-block;
    margin: 5px;
    border-radius: 10px;
    overflow: hidden;
}

@import url('https://fonts.googleapis.com/css?family=Roboto');
</style>

