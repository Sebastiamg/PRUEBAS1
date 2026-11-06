<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-button @click="$router.go(-1)" color="dark" type="border">Volver</vs-button> &nbsp;
    <vx-card class="mb-base">
        <div v-if="proyectos_asignados.length >0">
            <h3> {{proyectos_asignados[0].nombreasignatura}}</h3>
            <vs-table max-items="10" search pagination :data="proyectos_asignados" style="margin-top:-20px">
                <template slot="thead">
                    <vs-th>Proyecto</vs-th>
                    <vs-th>Fecha asignación</vs-th>
                    <vs-th>Calificación</vs-th>
                    <vs-th>RESPONDER</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            {{data[indextr].nombre}}<br>
                            <small>{{data[indextr].descripcion}}</small>
                        </vs-td>
                        <vs-td>
                            {{fechaLarga(data[indextr].updated_at) }}
                        </vs-td>
                        <vs-td>
                            <label v-if="calificaciones[indextr] != undefined">
                                <span v-if="calificaciones[indextr].calificacion != null ">
                                    <vx-tooltip title="Clic para ver el comentario del docente" color="primary" position="top" type="border">
                                        <vs-button type="border" @click="verComentario(calificaciones[indextr])">{{calificaciones[indextr].calificacion}}</vs-button>
                                    </vx-tooltip>
                                </span>
                                <vs-chip v-else transparent color="warning"> Pendiente calificación </vs-chip>
                            </label>
                            <vs-chip v-else transparent color="danger">Sin respuestas</vs-chip>
                        </vs-td>
                        <vs-td>
                            <vx-tooltip style="display: inline-block;" text="Ver - responder proyecto" position="top" color="success">
                                <vs-button class="m-1" color="success" type="gradient" icon-pack="feather" icon="icon-edit" @click="verProyecto(tr)"></vs-button>
                            </vx-tooltip>
                            <!-- <vx-tooltip style="display: inline-block;" text="Ver comentario de su docente" position="top" color="primary">
                                <vs-button class="m-1" color="primary" type="gradient" icon-pack="feather" icon="icon-eye" @click="verCalificacion(tr)"></vs-button>
                            </vx-tooltip> -->
                        </vs-td>

                    </vs-tr>
                </template>
            </vs-table>
        </div>
        <div v-else>
            <h4> Su docente, aún no le ha asignado ningún proyecto integrador</h4>
        </div>
    </vx-card>

    <vs-popup title="Comentario / sugerencia de su docente" :active.sync="modalCalificacion">
        <p>
            {{tmpComentarioProfesor}}
        </p>
    </vs-popup>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from "moment";
Vue.filter('fecha', function (value) {
    if (value) {
        return moment(String(value)).format('YYYY-MM-DD HH:mm')
    }
});
export default {
    components: {
        'v-select': vSelect,
    },
    mixins: [historicoMixin],
    data() {
        return {
            proyecto: '',
            proyectos_asignados: [],
            calificaciones: [],
            usuario: [],
            modalCalificacion: false,
            tmpComentarioProfesor: '',
            datos: {},
            miusuario: '',
        }
    },
    mounted() {
        let me = this;
        localStorage.removeItem('webq')
        localStorage.removeItem('edita')
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
        me.miusuario = me.usuario;
        me.proyecto = JSON.parse(localStorage.getItem("curso_proyecto"));
        // console.log(me.proyecto)
        me.proyectosAsignados();

    },
    methods: {
        proyectosAsignados() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url + 'proyectos?curso='+localStorage.codigo_curso)
            // axios.get('https://foro.prolipadigital.com.ec/cursos-proyectos?idcurso=' + me.proyecto.idcurso + '&estado=true&_sort=updatedAt:DESC')
                .then(function (response) {
                    me.proyectos_asignados = response.data
                    // console.log(me.proyectos_asignados);
                    for (let index = 0; index < me.proyectos_asignados.length; index++) {
                        me.verCalificacion(me.proyectos_asignados[index])
                    }
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    me.$vs.loading.close()

                    console.log(error + ' no se enlazo a la base a buscar proyectos asignados para el estudiante')
                })
        },
        verCalificacion(item) {
            let me = this;
            // console.log(item.idproyecto, me.usuario.idusuario)
            this.$http.get(this.$server_url+'proyectos?respuestaEstudiante=yes&proyecto_id=' +item.proyecto_id+'&idusuario=' + me.miusuario.idusuario)
            // axios.get('https://foro.prolipadigital.com.ec/respuestas-proyectos?idproyecto=' + item.idproyecto + '&idusuario=' + me.usuario.idusuario)
                .then(function (response) {
                    me.calificaciones.push(response.data[0])
                    // console.log(me.calificaciones)
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' no se enlazo a la base a buscar proyectos asignados para el estudiante')
                })
        },
        verProyecto(item) {
            let me = this;
            localStorage.edita = true;
            // console.log(item)
            if (item.estado == 0) {
                me.$vs.notify({
                    text: 'Este proyecto ha sido suspendido por su docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.proyectosAsignados();
                return
            }
            //guardar visita a este proyecto
            
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = item.asignatura_id;
            let h_nombreasignatura = item.nombreasignatura;
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'proyecto',
                'recurso_nombre': item.nombre,
                'recurso_detalle': '',
                'curso': item.curso,
                'idproyecto': item.proyecto_id,
            }
            let detalle = {
                'curso': item.curso,
                'idproyecto': item.idproyecto,
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            localStorage.webq = JSON.stringify(item);
            this.$router.push('/estudiante/ver_proyecto2');
        },
        verComentario(item) {
            let me = this;
            // console.log(item)
            me.$vs.dialog({
                type: 'confirm',
                color: 'success',
                title: `Comentario de su profesor`,
                acceptText: 'Aceptar',
                cancelText: 'Cerrar',
                text: item.comentario_docente,
            })
        },
        volver() {
            let me = this;
            me.$router.go(-1)
        },
    }
}
</script>

<style lang="css">
.texto-small {
    font-size: 8px;
}
</style>
