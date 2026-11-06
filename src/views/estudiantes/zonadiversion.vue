<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-button @click="$router.go(-1)" color="dark" type="border">Volver</vs-button> &nbsp;
    <vx-card>
        <h3>Zona de diversión</h3>
        <div v-if="listaJuegos.length > 0" class="">
            <vs-table stripe pagination max-items="25" search :data="listaJuegos">

                <template slot="thead">
                    <vs-th> </vs-th>
                    <vs-th sort-key="nombre_tipo_juego">Tipo de Juego</vs-th>
                    <vs-th sort-key="nombre_juego">Nombre</vs-th>
                    <vs-th sort-key="fecha">Fecha de envío</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <!-- {{data[indextr]}} -->
                        <vs-td>
                            <!-- <img  class="responsive card-img-top"  alt="" > -->
                            <vs-avatar size="80px" v-bind:src="'https://data.prolipadigital.com.ec/archivos/images/imagenes_juegos/portadas/'+data[indextr].imagen_juego" />
                        </vs-td>
                        <vs-td>
                            {{data[indextr].nombre_tipo_juego }}
                        </vs-td>
                        <vs-td width="40%">
                            {{data[indextr].nombre_juego }} <br>
                            <small> {{data[indextr].descripcion_juego }} </small>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].updated_at }}
                        </vs-td>
                        <vs-td>
                            <vx-tooltip style="display: inline-block;" text="Abrir juego" position="top" color="primary">
                                <vs-button class="modal-default-button" color="primary" type="border" @click="abrirJuego(tr)" icon-pack="feather" icon="icon-star"> </vs-button>
                            </vx-tooltip> &nbsp;
                            <vx-tooltip style="display: inline-block;" text="Ver calificaciones" position="top" color="success">
                                <vs-button icon-pack="feather" icon="icon-feather" type="border" color="success" @click="verCalificaciones(tr)"> </vs-button>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-else class="p-3">
            <p> Su docente aún no ha enviado material a este curso. </p>
        </div>
    </vx-card>
    <vs-popup title="Calificaciones enviadas a su docente" :active.sync="modalCalificaciones">
        <div>
            <vs-table stripe pagination max-items="10" search :data="listaCalificaciones">

                <template slot="thead">
                    <vs-th sort-key="updated_at">Fecha de realización</vs-th>
                    <vs-th sort-key="calificacion">Puntaje</vs-th>
                </template>

                <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{fechaLarga(data[indextr].updated_at) }}
                        </vs-td>
                        <vs-td>
                            {{data[indextr].calificacion}}
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </div>
    </vs-popup>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    mixins: [historicoMixin],
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            data_curso: '',
            listaJuegos: [],
            listaCalificaciones: [],
            url_juego: '',
            modalCalificaciones: false,
            usuario: [],
            miusuario: []
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.miusuario = me.usuario
        me.data_curso = JSON.parse(localStorage.getItem('curso_juego'));
        // console.log(me.data_curso)
        me.getJuegosCurso();
    },
    methods: {
        getJuegosCurso() {
            let me = this;
            me.$vs.loading()

            let url = this.$server_url+'juegos_has_curso/'
            this.$http.get(url + me.data_curso.codigo)
                .then(function (res) {
                    me.listaJuegos = res.data;
                    me.$vs.loading.close()

                    console.log(me.listaJuegos)
                })
                .catch(function (error) {
                    console.log(error);
                    me.$vs.loading.close()

                })
        },
        abrirJuego(item) {
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 8; //8 = juego
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'abrir',
                'recurso_tipo': 'juego',
                'recurso_nombre': item.nombre_juego,
                'recurso_detalle': 'tipo de juego: '+item.nombre_tipo_juego,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)

            switch (item.id_tipo_juego) {
                case 1:
                    me.url_juego = 'jugarponchado'
                    break;
                case 2:
                    me.url_juego = 'jugarsopa_letras'
                    break;
                case 3:
                    me.url_juego = 'jugarSeleccionSimple_estudiante'
                    break;
                case 4:
                  me.url_juego = 'jugarMillonario_estudiante'
                    break;
                case 6:
                    me.url_juego = 'jugar_rompecabezas'
                    break;
            }
            if(me.url_juego == 'jugarMillonario_estudiante'){
              window.open('/' + me.url_juego + '/' + item.id_juego +'/'+me.data_curso.codigo, "_blank");
            }else{
              window.open('/' + me.url_juego + '/' + item.id_juego, "_blank");

            }
        },
        verCalificaciones(item) {
            let me = this;
            // console.log(item)
            me.$vs.loading()

            let formData = new FormData();
            formData.append('id_usuario', me.usuario.idusuario);
            formData.append('id_juego', item.id_juego);
            this.$http.post(this.$server_url+'calificaciones_estudiante_juego', formData)
                .then(function (res) {
                    me.listaCalificaciones = res.data;
                    if (me.listaCalificaciones.length > 0) {
                        me.modalCalificaciones = true;
                    } else {
                        me.$vs.notify({
                            time: 5000,
                            text: 'Este juego aun no lo ha realizado, y no tiene calificaciones.',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error);
                    me.$vs.loading.close()

                })
        }
    }
}
</script>
