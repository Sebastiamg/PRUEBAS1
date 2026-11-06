<template>
<div class="vx-col md:w-full w-full mb-base">
    <!-- <iframe v-if="usuario.id_group===6" id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 100%; height: 100%; margin-left: auto; margin-right: auto; padding: 0px; top: 0px; position: absolute; left: 0px;" v-bind:src="'https://prolipadigital.com.ec/certificado'"></iframe> -->

    <vx-card class="vx-col md:w-full w-full mb-base">
        <div v-if="idgrupo==1">
            <a href="https://prolipadigital.com.ec/inscripciones/public/login" target="_blank" class="p-2" style="border:1px solid #2196f3; border-radius:15px"> Crear seminario</a>
        </div>
        <div v-if="idgrupo==6">
            <p v-if="todoSeminarios.length >0">
                <a href="https://prolipadigital.com.ec/certificado" target="_blank" class="p-2" style="border:1px solid #2196f3; border-radius:15px">Certificado</a> <br><br><br>
            </p>
        </div>
        <p v-if="idgrupo==6"><b>Seminarios que he asistido.</b></p>
        <div v-if="todoSeminarios.length >0" style="margin-top:-40px">
            <vs-table stripe pagination max-items="30" search :data="todoSeminarios">
                <template slot="thead">
                    <vs-th width="40%">Seminario</vs-th>
                    <vs-th sort-key="fecha_inicio">Fecha</vs-th>
                    <vs-th sort-key="hora_inicio">Hora</vs-th>
                    <vs-th sort-key="tiempo_curso">Duración</vs-th>
                    <vs-th>Link</vs-th>
                    <vs-th v-if="idgrupo==1">Participantes</vs-th>
                    <vs-th v-if="idgrupo==1">Encuestas</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{ data[indextr].nombre }}<br>
                            <small><i>{{ data[indextr].descripcion }}</i></small>
                        </vs-td>
                        <vs-td>
                            {{ data[indextr].fecha_inicio }}
                        </vs-td>
                        <vs-td>
                            {{ data[indextr].hora_inicio }}
                        </vs-td>
                        <vs-td>
                            {{ data[indextr].tiempo_curso }}
                        </vs-td>
                        <vs-td>
                            <vs-button size="large" icon-pack="feather" @click="verEnlace(data[indextr])" icon="icon-link" color="primary" type="line"> Ir al enlace</vs-button>
                        </vs-td>
                        <vs-td v-if="idgrupo==1">
                            {{ data[indextr].cantidad_participantes }}
                        </vs-td>
                        <vs-td v-if="idgrupo==1">
                            <vx-tooltip style="display: inline-block;" text="Ver encuesta" position="top" color="primary">
                                <vs-button size="large" radius icon-pack="feather" @click="getEncuestas_X_Seminario(data[indextr])" icon="icon-eye" color="primary" type="line"></vs-button>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-else>Usted no ha asistido a ningún seminario brindado por Prolipa, esperamos contar con su valiosa presencia, en nuestros próximos seminarios.</div>
    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            url: '',
            usuario: [],
            popEncuesta: false,
            todoSeminarios: [],
            todoEncuestas: [],
            num: 0,
            name_seminario: '',
            estrellasT: [],
            idgrupo: '',
            cedulaUser: '',

        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.idgrupo = this.usuario.id_group;
        this.cedulaUser = this.usuario.cedula;
        if (this.idgrupo == 1) {
            this.getSeminarios();
        }
        if (this.idgrupo == 6) {
            this.getSeminariosDocente();
        }
    },
    methods: {
        getSeminarios() {
            let me = this;
            // me.$vs.loading()
            this.$http.get(this.$server_url+'seminario')
                .then(function (response) {
                    me.todoSeminarios = response.data
                    // console.log(me.todoSeminarios)
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        getSeminariosDocente() {
            let me = this;
            // me.$vs.loading()
            this.$http.get(this.$server_url+'seminariosDocente/' + me.cedulaUser)
                .then(function (response) {
                    me.todoSeminarios = response.data
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        getEncuestas_X_Seminario(item) {
            let me = this;
            localStorage.idSemi = item.idseminario;
            localStorage.semiName = item.nombre;
            me.$router.push('/encuesta');
        },
        verEnlace(item) {
            let me = this;
            var datestring = new Date()
            if (item.fecha_inicio >= datestring.toISOString().substr(0, 10)) {
                window.open(item.link_presentacion)
            } else {
                me.$vs.notify({
                    title: 'Caducado',
                    text: 'El enlace esta fuera de tiempo.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            }
        }
    },
}
</script>
