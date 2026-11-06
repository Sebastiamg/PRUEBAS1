<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <!-- <vs-button @click="volver()" color="dark" type="border">Volver</vs-button> &nbsp; -->
        <center>
            <h4> {{nombre_curso}} </h4>
        </center>
        <div v-if="grupo_usuario == 6">
            <vs-button @click="crearProyecto()" color="success">Agregar proyecto</vs-button>
        </div>
        <div class="mt-5">
            <vs-tabs alignment="fixed">
                <vs-tab :label="'Mis proyectos ( '+proyectos_docente.length+' )' ">
                    <vs-table max-items="20" search pagination :data="proyectos_docente">
                        <template slot="thead">
                            <vs-th sort-key="nombre">Nombre</vs-th>
                            <vs-th>Asignatura</vs-th>
                            <vs-th sort-key="updatedAt">Fecha</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <!-- mostrar solo los proyectos creados por el docente -->
                            <!-- <vs-tr :key="indextr" v-for="(tr, indextr) in data" v-if="data[indextr].asignatura.idasignatura == asignaturaDocente && data[indextr].idusuario== miusuario.idusuario"> -->
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{data[indextr].nombre}} <br>
                                    <small class="descripcion">{{data[indextr].descripcion}}</small>
                                </vs-td>
                                <vs-td width="25%">
                                    <span v-if="data[indextr].asignaturas.length > 0">
                                        <vs-chip transparent color="success" v-for="(pr, indexpr) in data[indextr].asignaturas" :key="indexpr">
                                            {{pr.nombreasignatura}}
                                        </vs-chip>
                                    </span>
                                    <span v-else class="text-danger"> Sin asignaturas </span>
                                </vs-td>
                                <vs-td width="25%">
                                    <small>
                                        Creado: {{data[indextr].created_at | fecha}}<br>
                                        Actualizado: {{data[indextr].updated_at | fecha}}
                                    </small>
                                </vs-td>
                                <vs-td width="15%">    
                                    <vx-tooltip style="display: inline-block;" text="editar proyecto" position="top" color="success">
                                        <vs-button @click="editaWebQ(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="visualizar proyecto" position="top" color="primary">
                                        <vs-button @click="verWebQ(data[indextr],tipoProy='docente')" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="gradient"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="asignar proyecto" position="top" color="warning">
                                        <vs-button @click="confirmarAsignar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-link" color="warning" type="gradient"></vs-button>
                                    </vx-tooltip>

                                    <vx-tooltip style="display: inline-block;" text="eliminar proyecto" position="top" color="danger" v-if="data[indextr].idusuario == miusuario.idusuario">
                                        <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                                    </vx-tooltip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>
                <vs-tab :label="'Proyectos Prolipa ( '+ proyectos_prolipa.length + ' )'" v-if="tipo_asignatura  == 'prolipa'">
                    <vs-table max-items="20" search pagination :data="proyectos_prolipa">
                        <template slot="thead">
                            <vs-th sort-key="nombre">Nombre</vs-th>
                            <!-- <vs-th>Asignatura</vs-th> -->
                            <vs-th sort-key="updatedAt">Fecha</vs-th>
                            <vs-th>Acciones</vs-th>
                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td>
                                    {{data[indextr].nombre}} <br>
                                    <small>{{data[indextr].descripcion}}</small>
                                </vs-td>
                                <!-- <vs-td width="25%">
                                    <div v-for="(pr, indexpr) in data[indextr].proyectos_asignaturas" :key="indexpr">
                                        <li>
                                            <small>{{pr.datos.nombreasignatura}}</small>
                                        </li>
                                    </div>
                                </vs-td> -->
                                <vs-td width="25%">
                                    <small>
                                        <span v-if="grupo_usuario == '1' || grupo_usuario ==10"> Responsable: {{data[indextr].asignatura.user_nombre}} {{data[indextr].asignatura.user_apellido}}<br> </span>
                                        Creado: {{data[indextr].created_at | fecha}}<br>
                                        Actualizado: {{data[indextr].updated_at | fecha}}
                                    </small>
                                </vs-td>
                                <vs-td width="15%">
                                    <vx-tooltip style="display: inline-block;" text="visualizar proyecto" position="top" color="primary">
                                        <vs-button @click="verWebQ(data[indextr], tipoProy='prolipa')" size="small" radius icon-pack="feather" icon="icon-eye" color="primary" type="line"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="asignar proyecto" position="top" color="warning">
                                        <vs-button @click="confirmarAsignar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-link" color="warning" type="gradient"></vs-button>
                                    </vx-tooltip>

                                    <label v-if="grupo_usuario == 1">
                                        <vx-tooltip style="display: inline-block;" text="editar proyecto" position="top" color="success" v-if="data[indextr].idusuario == miusuario.idusuario">
                                            <vs-button @click="editaWebQ(data[indextr])" size="small" radius icon-pack="feather" icon="icon-edit" color="success" type="gradient"></vs-button>
                                        </vx-tooltip>

                                        <vx-tooltip style="display: inline-block;" text="eliminar proyecto" position="top" color="danger" v-if="data[indextr].idusuario == miusuario.idusuario">
                                            <vs-button @click="openConfirmEliminar(data[indextr])" size="small" radius icon-pack="feather" icon="icon-trash" color="danger" type="gradient"></vs-button>
                                        </vx-tooltip>
                                    </label>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>

                <vs-tab :label="'Asignados a este curso ( '+ proyectos_asignados.length + ' )' ">
                    <div v-if="proyectos_asignados.length >0">
                        <p class="m-3">
                        </p>
                        <vs-table max-items="20" search pagination :data="proyectos_asignados" style="margin-top:-20px">
                            <template slot="thead">
                                <vs-th sort-key="nombre">Nombre</vs-th>
                                <vs-th sort-key="updatedAt">Fecha</vs-th>
                                <vs-th>Estado</vs-th>
                                <vs-th>Respuestas</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td>
                                        {{data[indextr].nombre}}<br>
                                        <small>{{data[indextr].descripcion}}</small>
                                    </vs-td>
                                    <vs-td width="30%">
                                        <b>Asignado:</b> {{ fechaLarga(data[indextr].created_at)}}<br>
                                        <b>Actualizado:</b> {{ fechaLarga(data[indextr].updated_at)}}
                                    </vs-td>
                                    <vs-td width="20%">
                                        <vs-switch class="" vs-icon-on="check" color="success" v-model="data[indextr].estado" @click="cambiarEstado(tr)" style="width: 100px;">
                                            <span slot="on">Activo</span>
                                            <span slot="off">Inactivo </span>
                                        </vs-switch>
                                        <small v-if="data[indextr].estado == 0" class="text-danger" style="font-size:10px">Los estudiantes no podrán visualizar este proyecto</small>
                                    </vs-td>
                                    <vs-td width="10%">
                                        <vs-button class="m-1" color="primary" type="gradient" icon-pack="feather" icon="icon-eye" size="small" @click="verRespuestas(data[indextr])">Respuestas</vs-button>
                                        <vs-button class="m-1" color="danger" type="gradient" icon-pack="feather" icon="icon-trash" size="small" @click="confirmarQuitarAsignacion(tr)">Quitar</vs-button>
                                    </vs-td>

                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div v-else>
                        <p class="m-3"> No tiene proyectos asignados a este curso</p>
                    </div>
                </vs-tab>
            </vs-tabs>
        </div>
    </vx-card>
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
            lista_proyectos: '',
            eliminaWQ: '',
            usuario: '',
            grupo_usuario: '',
            proyectos_prolipa: [],
            proyectos_todo_docentes: [],
            proyectos_docente: [],
            asignaturaDocente: '',
            tipoProy: '',
            codigocurso: '',
            idcurso: '',
            itemAsignarProyecto: '',
            tmp_asignar: {},
            datos: {},
            proyectos_asignados: [],
            datos: {},
            nombre_curso: '',
            tipo_asignatura: '',
            miusuario: '',
            conRespuestas: false,
            respuestasEliminar: [],
            datoU: '',
            idusuario: '',
            grupo_usuario: '',
            filesEstudiantes:[],

        }
    },
    mounted() {
        localStorage.removeItem('webq')
        localStorage.removeItem('edita')
        localStorage.removeItem('proyecto')
        this.tipo_asignatura = localStorage.getItem('tipo_asignatura');
        this.codigocurso = localStorage.getItem('codigo');
        this.idcurso = localStorage.getItem('idcurso');
        this.nombre_curso = localStorage.nombre_curso
        this.tmp_asignar.curso = this.codigocurso;
        // console.log('curso actual-> ' + this.tmp_asignar.curso)
        this.nombreasignaturaDocente = localStorage.getItem('nombreasignatura')
        this.asignaturaDocente = localStorage.getItem('idasignatura')
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.miusuario = this.usuario
        this.grupo_usuario = this.usuario.id_group;
        this.idusuario = this.usuario.idusuario;
        if (this.grupo_usuario == 10) { //director
            this.datoU = JSON.parse(localStorage.getItem('datoUser'))
            this.miusuario = this.datoU
            // console.log(this.datoU)
            // this.idusuario = this.datoU.idusuario;
        }
        this.getProyectos();
        this.proyectosAsignados();
    },
    methods: {
        getProyectos() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'proyectos?docente=yes')
                .then(res => {
                    me.$vs.loading.close()
                    me.lista_proyectos = res.data;
                    me.proyectos_docente = [];
                    me.proyectos_prolipa = [];
                    for (let index = 0; index < me.lista_proyectos.length; index++) {
                        // // filtrar los proyectos del docente, de la asignatura  que se encuentre seleccionado
                        for (let j = 0; j < me.lista_proyectos[index].asignaturas.length; j++) {
                            if (me.lista_proyectos[index].grupo_usuario == 6 &&
                                me.lista_proyectos[index].idusuario == me.miusuario.idusuario &&
                                me.lista_proyectos[index].asignaturas[j].asignatura_id == me.asignaturaDocente
                            ) {
                                me.proyectos_docente.push(me.lista_proyectos[index]);
                            }
                            if (me.lista_proyectos[index].grupo_usuario == 1 &&
                                me.lista_proyectos[index].asignaturas[j].asignatura_id == me.asignaturaDocente
                            ) {
                                me.proyectos_prolipa.push(me.lista_proyectos[index]);
                            }
                        }
                    }
                })
                .catch(error => {
                    console.log(' no hay conexion con la base de datos ' + error)
                    me.$vs.loading.close()
                })
        },
        crearProyecto() {
            let me = this
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return
            }

            this.$router.push('/docente/crearProyecto2');
        },
        editaWebQ(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            localStorage.edita = true;
            localStorage.webq = JSON.stringify(item);
            this.$router.push('/docente/crearProyecto2');
        },
          openConfirmEliminar(item) {
            let me = this;
            me.eliminaWQ = item
            // console.log(item, me.eliminaWQ)
            // return
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Está seguro en eliminar este proyecto?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.f_eliminarWebQ
            })
        },
        f_eliminarWebQ() {
            let me = this;
            let cantidad = me.eliminaWQ.asignaturas.length;
            let conteo = 0;
            //eliminar archivo

            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = me.eliminaWQ.asignaturas[0].asignatura_id
            let h_nombreasignatura = me.eliminaWQ.asignaturas[0].nombreasignatura
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'eliminar',
                'recurso_tipo':'proyecto',
                'recurso_nombre': me.eliminaWQ.nombre,
                'recurso_detalle': '',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            this.$http.post(this.$server_url+'proyectos/eliminar?id='+ me.eliminaWQ.id+'&eproyecto=yes')
                // axios.delete('https://foro.prolipadigital.com.ec/proyectos/' + me.eliminaWQ.id)
                    .then(res => {
                        me.$vs.notify({
                            text: 'Proyecto eliminado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getProyectos()
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.notify({
                            text: 'No se eliminó el proyecto',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
                        //}
                   // })
                    //.catch(error => {
                     //   console.log('no se eliminaron las asignaturas asociadas a este proyecto ' + error)
                    //})

            //}
            //eliminar proyecto
        },
        verWebQ(item) {
            let me = this;
            // console.log(item);
            me.datos.user_nombres = me.miusuario.nombres
            me.datos.user_apellidos = me.miusuario.apellidos
            me.datos.user_email = me.miusuario.email
            me.datos.user_name_usuario = me.miusuario.name_usuario
            me.datos.user_telefono = me.miusuario.telefono
            me.datos.user_institucion = me.miusuario.institucion_idInstitucion
            me.datos.nombre_proyecto = item.nombre
            me.datos.descripcion_proyecto = item.descripcion
            me.datos.asignatura = me.nombreasignaturaDocente
            me.datos.idasignatura = me.asignaturaDocente
            me.datos.idproyecto = item.idproyecto
            // axios.post('https://foro.prolipadigital.com.ec/historico-proyectos/', {
            //         'idusuario': me.miusuario.idusuario,
            //         'idgrupo': me.miusuario.id_group,
            //         'datos': me.datos
            //     })
            //     .then(function (response) {})
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo':'proyecto',
                'recurso_nombre': item.nombre,
                'recurso_detalle': '',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            localStorage.edita = true;
            localStorage.webq = JSON.stringify(item);
            if (me.grupo_usuario == 10) {
                this.$router.push('/director/institucion/docentes/contenidos/libro/curso/proyectos/verproyecto2');
            } else {

                this.$router.push('/ver_quest2');
            }
        },
        confirmarAsignar(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            // localStorage.proyecto = JSON.stringify(item);
            // me.$router.push('/docente/asignarProyecto');
            // console.log(item)
            me.tmp_asignar.idasignatura = me.asignaturaDocente
            me.tmp_asignar.idusuario = me.miusuario.idusuario
            me.tmp_asignar.idcurso = me.idcurso
            me.tmp_asignar.idproyecto = item.id
            me.tmp_asignar.proyecto = item
            me.datos.asignatura = me.nombreasignaturaDocente
            me.datos.nombre_proyecto = item.nombre
            me.datos.descripcion_proyecto = item.descripcion
            // console.log(me.tmp_asignar, me.datos)
            for (let index = 0; index < me.proyectos_asignados.length; index++) {
                // console.log(me.proyectos_asignados[index].curso)
                if (me.tmp_asignar.idproyecto == me.proyectos_asignados[index].proyecto_id) {
                    me.$vs.notify({
                        text: 'El proyecto ya se encuentra asignado a este curso.',
                        time: 7000,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
            }
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: '¿Desea agregar este proyecto al curso?',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.asignarProyectoSeleccionado
            })
        },
        asignarProyectoSeleccionado() {
           let me = this;
           //guardar
           let formaData = new FormData()
           formaData.append('guardarCurso','yes')
           formaData.append('curso',me.tmp_asignar.curso)
           formaData.append('proyecto_id',me.tmp_asignar.idproyecto)
           formaData.append('asignatura_id',me.tmp_asignar.idasignatura)
           formaData.append('idusuario',me.tmp_asignar.idusuario)
            this.$http.post(this.$server_url + 'proyectos',formaData)          
            // axios.post('https://foro.prolipadigital.com.ec/cursos-proyectos', {
            //         curso: me.tmp_asignar.curso,
            //         datos: me.datos,
            //         idasignatura: me.tmp_asignar.idasignatura,
            //         idusuario: me.tmp_asignar.idusuario,
            //         idcurso: me.tmp_asignar.idcurso,
            //         idproyecto: me.tmp_asignar.idproyecto,
            //         estado: true,
            //         proyectos: [],
            //     })
                .then(function (response) {
                    me.$vs.notify({
                        text: 'Proyecto asignado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.proyectosAsignados()
                    // console.log(response.data);
                })
                .catch(function (error) {
                    console.log(error + ' no se agrego el curso proyecto')
                })
        },
        proyectosAsignados() {
            let me = this;
            // console.log(me.tmp_asignar.curso)
            me.$vs.loading()
            this.$http.get(this.$server_url + 'proyectos?curso='+me.tmp_asignar.curso)
            // axios.get('https://foro.prolipadigital.com.ec/cursos-proyectos?curso=' + me.tmp_asignar.curso)
                .then(function (response) {
                    me.proyectos_asignados = response.data
                    // console.log(me.proyectos_asignados);
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' no se enlazo a la base a buscar proyectos asignados')
                    me.$vs.loading.close()
                })
        },
        confirmarQuitarAsignacion(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            me.id_eliminar = item
            // console.log(item, me.conRespuestas)
            me.respuestasEliminar = [];
            this.$http.get(this.$server_url+'proyectos?archivosEstudiante=yes&proyecto_id=' + item.proyecto_id+'&curso_id='+ item.curso)
            .then(function(res){
                me.filesEstudiantes = res.data
            })
            this.$http.get(this.$server_url+'proyectos?respuestas=yes&proyecto_id=' + item.proyecto_id+'&curso_id='+ item.curso)
            // axios.get('https://foro.prolipadigital.com.ec/respuestas-proyectos?idproyecto=' + item.idproyecto + '&curso=' + item.curso)
                .then(function (res) {
                    if (res.data.length > 0) {
                        me.conRespuestas = true;
                        me.respuestasEliminar = (res.data)
                        console.log(me.respuestasEliminar)
                        me.$vs.dialog({
                            type: 'confirm',
                            color: 'danger',
                            title: `Confirmar`,
                            text: 'Este proyecto ya tiene ' + res.data.length + ' respuestas. Si lo elimina, NO PODRÁ RECUPERAR DICHA INFORMACIÓN. ¿Esta seguro que desea eliminar? ',
                            acceptText: 'Aceptar',
                            cancelText: 'Cancelar',
                            accept: me.eliminarAsignacion
                        })
                    } else {
                        me.$vs.dialog({
                            type: 'confirm',
                            color: 'danger',
                            title: `Confirmar`,
                            text: '¿Está seguro en eliminar esta asignación?',
                            acceptText: 'Aceptar',
                            cancelText: 'Cancelar',
                            accept: me.eliminarAsignacion
                        })
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    // console.log(error + ' no se enlazo a la base a buscar proyectos asignados')
                    me.$vs.loading.close()
                })
            // return

        },
        eliminarAsignacion() {
            let me = this;
            let res_eliminadas = me.respuestasEliminar.length;
            let conteo = 0;
            //eliminar proyecto
            // console.log(me.conRespuestas)

            if (me.conRespuestas) {
                for (let index = 0; index < me.filesEstudiantes.length; index++) {
                axios.get(this.$data_url+'api/proyectos/file/eliminar?id='+me.filesEstudiantes[index].id)
                    // axios.delete('https://foro.prolipadigital.com.ec/respuestas-proyectos/' + me.respuestasEliminar.files[index].id)
                    //     .then(res => {
                    //         // conteo++;
                    //     this.$http.get(this.$server_url+'proyectos?respuestas=yes&proyecto_id=' + me.itemProyecto.proyecto_id+'&curso_id='+ me.itemProyecto.curso)
                            // console.log(conteo, res_eliminadas)
                            // if (me.respuestasEliminar[index].fileintroduccion != '' && me.respuestasEliminar[index].fileintroduccion !== null && me.respuestasEliminar[index].fileintroduccion !== undefined) {
                            //     axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].fileintroduccion[0].id)
                            //         .then(res => {
                            //             // console.log( 'fileintroduccion borrado' )
                            //         })
                            //         .catch(err => {
                            //             // console.log( 'fileintroduccion NEGADOOOOOOOOOOOO' )
                            //         })
                            // }
                            // if (me.respuestasEliminar[index].filetareas != '' && me.respuestasEliminar[index].filetareas !== null && me.respuestasEliminar[index].filetareas !== undefined) {
                            //     axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].filetareas[0].id)
                            //         .then(res => {
                            //             // console.log( 'filetareas borrado' )
                            //         })
                            //         .catch(err => {
                            //             // console.log( 'filetareas NEGADOOOOOOOOOOOO' )
                            //         })
                            // }
                            // if (me.respuestasEliminar[index].fileproceso != '' && me.respuestasEliminar[index].fileproceso !== null && me.respuestasEliminar[index].fileproceso !== undefined) {
                            //     axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].fileproceso[0].id)
                            //         .then(res => {
                            //             // console.log( 'fileproceso borrado' )
                            //         })
                            //         .catch(err => {
                            //             // console.log( 'fileproceso NEGADOOOOOOOOOOOO' )
                            //         })
                            // }
                            // if (me.respuestasEliminar[index].filerecursos != '' && me.respuestasEliminar[index].filerecursos !== null && me.respuestasEliminar[index].filerecursos !== undefined) {
                            //     axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].filerecursos[0].id)
                            //         .then(res => {
                            //             // console.log( 'filerecursos borrado' )
                            //         })
                            //         .catch(err => {
                            //             // console.log( 'filerecursos NEGADOOOOOOOOOOOO' )
                            //         })
                            // }
                            // if (me.respuestasEliminar[index].filevaluacion != '' && me.respuestasEliminar[index].filevaluacion !== null && me.respuestasEliminar[index].filevaluacion !== undefined) {
                            //     axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].filevaluacion[0].id)
                            //         .then(res => {
                            //             // console.log( 'filevaluacion borrado' )
                            //         })
                            //         .catch(err => {
                            //             // console.log( 'filevaluacion NEGADOOOOOOOOOOOO' )
                            //         })
                            // }
                            // if (me.respuestasEliminar[index].fileconclusiones != '' && me.respuestasEliminar[index].fileconclusiones !== null && me.respuestasEliminar[index].fileconclusiones !== undefined) {
                            //     axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.respuestasEliminar[index].fileconclusiones[0].id)
                            //         .then(res => {
                            //             // console.log( 'fileconclusiones borrado' )
                            //         })
                            //         .catch(err => {
                            //             // console.log( 'fileconclusiones NEGADOOOOOOOOOOOO' )
                            //         })
                            // }
                            // if (conteo == res_eliminadas) {
                              
                                // eliminar la asignacion, despues de eliminar sus respuestas
                               
                           // }
                        // })
                        // .catch(error => {
                        //     console.log(error)
                        //     me.$vs.notify({
                        //         text: 'Las respuestas no se lograron eliminar.',
                        //         color: 'warning',
                        //         iconPack: 'feather',
                        //         icon: 'icon-alert-triangle'
                        //     })
                        // })
                }
                me.$vs.notify({
                    text: 'Todas las respuestas han sido eliminadas',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                axios.get(this.$data_url+'api/proyectos/file/eliminar?eliminarEstudiantesAsignacion=yes&proyecto_id='+me.id_eliminar.proyecto_id+'&curso_id='+me.id_eliminar.curso)
                // axios.delete('https://foro.prolipadigital.com.ec/cursos-proyectos/' + me.id_eliminar.id)
                    .then(res => {
                        me.$vs.notify({
                            text: 'Respuestas de los estudiantes fue eliminada correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.proyectosAsignados()
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.notify({
                            text: 'No se pudo eliminar la asignacion de los estudiantes',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
                 axios.get(this.$data_url+'api/proyectos/file/eliminar?eliminarAsignacionCurso=yes&id='+me.id_eliminar.id)
                // axios.delete('https://foro.prolipadigital.com.ec/cursos-proyectos/' + me.id_eliminar.id)
                    .then(res => {
                        me.$vs.notify({
                            text: 'Asignación eliminada correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.proyectosAsignados()
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.notify({
                            text: 'No se eliminó la asignación',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })

            } else {
                // eliminar la asignacion, cuando aun no tiene respuestas
                 axios.get(this.$data_url+'api/proyectos/file/eliminar?eliminarAsignacionCurso=yes&id='+me.id_eliminar.id)
                // axios.delete('https://foro.prolipadigital.com.ec/cursos-proyectos/' + me.id_eliminar.id)
                    .then(res => {
                        me.$vs.notify({
                            text: 'Asignacion eliminada correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.proyectosAsignados()
                    })
                    .catch(error => {
                        console.log(error)
                        me.$vs.notify({
                            text: 'No se eliminó la asignación',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    })
            }

        },
        cambiarEstado(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            // console.log(item.id, item.estado)
            me.$vs.loading()
            let formData = new FormData();
            formData.append('id',item.id)
            formData.append('cambiarEstado','yes')
            if(item.estado == 1){
               formData.append('estado','0')
            }else{
               formData.append('estado','1')  
            }
             this.$http.post(this.$server_url + 'proyectos',formData)
            // axios.put('https://foro.prolipadigital.com.ec/cursos-proyectos/' + item.id, {
            //         estado: !item.estado
            //     })
                .then(function (response) {
                    me.$vs.notify({
                        text: 'Estado actualizado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.proyectosAsignados();
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' no se cambio de estado')
                    me.$vs.loading.close()
                })
        },
        verRespuestas(item) {
            let me = this;
            // console.log(item)
            localStorage.proyecto_curso = JSON.stringify(item)
            if (me.grupo_usuario == 10) {
                me.$router.push('/director/institucion/docentes/contenidos/libro/curso/proyectos/respuestas');

            } else {
                me.$router.push('/docente/proyectos/respuestas2');
            }
        },
        volver() {
            let me = this;
            this.$router.go(-1);
        },
    }
}
</script>

<style lang="css">
.descripcion {
    color: rgb(123, 159, 160);
}
</style>
