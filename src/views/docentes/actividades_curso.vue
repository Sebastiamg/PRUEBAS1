<template>
<div>
    <vx-card>
        <div class="vx-col w-full mb-6 text-center">
            <!-- <vs-button color="primary" type="border" class="m-1 mr-4" style="display: flex; margin-left: auto; padding: 10px 15px 10px 15px;" @click="$router.go(-1)"><b>← Volver</b></vs-button> -->
            <h2><b>{{nombre_curso}}</b></h2>
        </div>

        Seleccione una unidad:
        <v-select :options="unidades" @input="getActividades()" :reduce="unidades => unidades.id_unidad_libro" label="label_unidad" v-model="unidadSelected" class="mb-4"></v-select>

        <div style="color: #0D60E4;">Puede compartir el link de las actividades a sus estudiantes para que las resuelvan.</div>

        <vs-list>
            <vs-list-header title="Actividades" color="warning"></vs-list-header>
            <vs-list-item v-for="(item,$index) in actividades" :key="$index" v-bind:title="item.nombre_tema +' - pág. '+ item.page">
                <template slot="avatar">
                    <vs-avatar color="warning" icon-pack="feather" icon="icon-file" />
                </template>
                <vs-button color="primary" class="btn_ver" @click="copiarLink(item)">Link</vs-button>
            </vs-list-item>
        </vs-list>
    </vx-card>

</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
Vue.use(axios)

export default {
    data() {
        return {
            usuario: [],
            unidades: [],
            actividades: [],
            idasignatura: '',
            unidades: [],
            unidadSelected: '',
            carpeta: '',
            nombre_curso: '',
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.idasignatura = localStorage.idasignatura
        this.nombre_curso = localStorage.nombre_curso
        this.getUnidades()
    },
    computed: {},
    methods: {
        getUnidades() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+'unidades_asignatura/' + me.idasignatura)
                .then(function (response) {
                    me.unidades = response.data
                    me.carpeta = response.data[0].weblibro
                    me.unidadSelected = response.data[0].id_unidad_libro
                    me.$vs.loading.close()
                    me.getActividades()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        getActividades() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+'actividades_libros_unidad/' + me.unidadSelected)
                .then(function (response) {
                    me.actividades = response.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {})
        },
        copiarLink(item) {
            let me = this
            let host = location.protocol + '//' + location.hostname +':'+ location.port

            let ruta = host +'/actividades_digitales/'+ me.carpeta + '²actividades²' + item.link + '.html'
            let link = this.$data_url+'archivos/upload/libro/' + ruta
            var aux = document.createElement("input");
            aux.setAttribute("value", ruta);
            document.body.appendChild(aux);
            aux.select();

            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({
                        text: 'Error al copiar el link',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                } else {
                    me.$vs.notify({
                        text: 'Link copiado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }

            document.body.removeChild(aux);
        }
    },
    components: {
        'v-select': vSelect
    },
    mounted() {

    }
}
</script>

<style>
.btn_ver {
    font-size: 14px;
    padding: 5px 25px 5px 25px !important;
}
</style>
