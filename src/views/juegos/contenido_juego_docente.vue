<template>
<div>
    <vs-prompt @cancel="activePromptEliminar=false;" @accept="eliminarJuego()" @close="activePromptEliminar=false;" :active.sync="activePromptEliminar" color="danger" title="Confirmar">
        <div class="con-exemple-prompt">
            ¿Está seguro de eliminar este juego?
        </div>
    </vs-prompt>

    <vs-popup title="Seleccione un curso" :active.sync="modalCursosEnvioLink">
        <vs-list>
            <vs-list-item v-for="(item,$index) in cursosDocente" :key="$index" :title="item.nombre" :subtitle="item.codigo">
                <template slot="avatar">
                    <vs-avatar color="primary" icon-pack="feather" icon="icon-folder" />
                </template>
                <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" v-if="verTipoModal===true" size="small" type="filled" target="_blank" color="primary" @click="previsualizarJuegos(item)">Visualizar</vs-button>

                <!-- <vs-button class="m-1" v-if="verTipoModal===true" size="small" type="filled" target="_blank" color="success" @click="copiarLink(item.codigo)">Link</vs-button> -->
                <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" v-if="verTipoModal===true" size="small" type="filled" target="_blank" color="success" @click="asignarCurso(item)">Asignar juego</vs-button>

                <vs-button v-if="verTipoModal===false" type="filled" target="_blank" style="font-size: 12px;" size="small" color="warning" @click="modalCursosEnvioLink=false; verCalificaciones(item)">Ver calificaciones</vs-button>
            </vs-list-item>
        </vs-list>
    </vs-popup>

    <vx-card v-bind:title="nombre_tipo_juego">
        <!-- <vs-button color="primary" class="mr-2" type="border" icon-pack="feather" @click="$router.go(-1)" icon="icon-arrow-left"><b>Volver</b></vs-button> -->

        <vs-tabs alignment="fixed">
            <vs-tab :label="'Mis juegos (' + cant_juegos +')'">
                <!-----listado juegos DOCENTE--------->
                <div v-if="juegos">
                    <vs-button @click="irCrearjuego('')" color="dark" type="filled">Crear juego</vs-button>
                    <vs-table stripe pagination max-items="25" search :data="juegos">
                        <template slot="thead">
                            <vs-th sort-key="nombre_juego">Juegos</vs-th>
                            <vs-th sort-key="temas">Unidad - tema</vs-th>
                            <!-- <vs-th sort-key="fecha">Fecha</vs-th> -->
                            <vs-th>Acciones</vs-th>
                        </template>

                        <template slot-scope="{data}">
                            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                                <vs-td>
                                    <b>{{data[indextr].temas[0].nombreasignatura}}</b> <br>
                                    <b>{{ data[indextr].nombre_juego.toUpperCase() }}</b><br>
                                    <!-- <b>Descripción:</b> {{ data[indextr].descripcion_juego }}<br> -->
                                    <b>Duración:</b> {{ data[indextr].duracion }} min<br>
                                    <b>Puntos:</b> {{ data[indextr].puntos }}<br>
                                    <b>Estado:</b> <span v-if="data[indextr].estado_juego === 1" style="color: green;"> ACTIVO </span>
                                    <span v-else style="color: red;"> INACTIVO </span>
                                </vs-td>
                                <vs-td>

                                    <div :data="item" :key="index" v-for="(item, index) in data[indextr].temas">
                                        <div class="mb-4">Unidad {{item.unidad}} <br> {{item.nombre_tema}}</div>
                                    </div>
                                </vs-td>
                                <vs-td :data="data[indextr].id" style="width: 260px;">
                                    <vx-tooltip style="display: inline-block;" text="Editar juego" position="top" color="success">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-edit" @click="irCrearjuego(data[indextr])" color="success" type="line"></vs-button>
                                    </vx-tooltip>

                                    <vx-tooltip style="display: inline-block;" text="Eliminar juego" position="top" color="danger">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-trash" @click="juegoElimin=data[indextr].id_juego; openConfirmEliminar();" color="danger" type="line"></vs-button>
                                    </vx-tooltip>

                                    <vx-tooltip style="display: inline-block;" text="Ver calificaciones" position="top" color="primary">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-eye" @click="verTipoModal = false; data_juego = data[indextr]; getCursosDocente()" color="primary" type="line"></vs-button>
                                    </vx-tooltip>

                                    <vx-tooltip style="display: inline-block;" text="Asignar cursos" position="top" color="warning">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-folder" @click="verTipoModal = true; data_juego = data[indextr]; getCursosDocente();nombre_juego = tr.nombre_juego" color="warning" type="line"></vs-button>
                                    </vx-tooltip>
                                </vs-td>
                            </vs-tr>
                        </template>
                    </vs-table>
                </div>
                <div v-else>
                    <vs-button color="primary" class="mr-2" type="border" style="display: inline-block;" @click="$router.go(-1)"><b>Volver</b></vs-button>
                    <div v-if="usuario.id_group == 16">
                         <vs-button @click="irCrearjuego('')" v-if="mijuego.agregar == '1'" color="dark" style="display: inline-block;" type="filled">Crear juego</vs-button>
                    </div>
                    <vs-button @click="irCrearjuego('')" v-else color="dark" style="display: inline-block;" type="filled">Crear juego</vs-button>
                </div>
                <!------fin listado juegos DOCENTE--------->
            </vs-tab>

            <!-- se ocultan los juegos de prolipa, al abri una asignatura creada por el docente -->
            <vs-tab :label="'Juegos Prolipa (' + cant_juegosprolipa +')'" v-if="tipo_asignatura== 'prolipa' ">
                <vs-table v-if="juegosprolipa" stripe pagination max-items="25" search :data="juegosprolipa">
                    <!-- <template slot="header">
                        <vs-button color="primary" class="mr-2" type="border" icon-pack="feather" @click="$router.go(-1)" icon="icon-arrow-left"><b>Volver</b></vs-button>
                    </template> -->
                    <template slot="thead">
                        <vs-th sort-key="nombre_juego">Juegos Prolipa</vs-th>
                        <vs-th sort-key="temas">Unidad - tema</vs-th>
                        <!-- <vs-th sort-key="fecha">Fecha</vs-th> -->
                        <vs-th>Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td>
                                <b>{{data[indextr].temas[0].nombreasignatura}}</b> <br>
                                <b>{{ data[indextr].nombre_juego.toUpperCase() }}</b><br>
                                <!-- <b>Descripción:</b> {{ data[indextr].descripcion_juego }}<br> -->
                                <b>Duración:</b> {{ data[indextr].duracion }} min<br>
                                <b>Puntos:</b> {{ data[indextr].puntos }}<br>
                                <b>Estado:</b> <span v-if="data[indextr].estado_juego === 1" style="color: green;"> ACTIVO </span>
                                <span v-else style="color: red;"> INACTIVO </span>
                            </vs-td>
                            <vs-td>
                                <div :data="item" :key="index" v-for="(item, index) in data[indextr].temas">
                                    <div class="mb-4">Unidad {{item.unidad}} <br> {{item.nombre_tema}}</div>
                                </div>
                            </vs-td>
                            <vs-td :data="data[indextr].id" style="width: 260px;">
                                <div v-if="usuario.id_group == 16">
                                    <vx-tooltip style="display: inline-block;" v-if="juegoProlipa.asignar == '1'" text="Asignar cursos" position="top" color="warning">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-folder" @click="verTipoModal = true; data_juego = data[indextr]; getCursosDocente();nombre_juego = tr.nombre_juego" color="warning" type="line"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" v-if="juegoProlipa.ver == '1'" text="Ver calificaciones" position="top" color="primary">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-edit" @click="verTipoModal = false; data_juego = data[indextr]; getCursosDocente()" color="primary" type="line"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" v-if="juegoProlipa.previsualizar == '1'" text="Previsualizar juego" position="top" color="primary">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-eye" @click="previsualizarJuego(data[indextr])" color="primary" type="line"></vs-button>
                                    </vx-tooltip>
                                </div>
                                <div v-else>
                                    <vx-tooltip style="display: inline-block;" text="Asignar cursos" position="top" color="warning">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-folder" @click="verTipoModal = true; data_juego = data[indextr]; getCursosDocente();nombre_juego = tr.nombre_juego" color="warning" type="line"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="Ver calificaciones" position="top" color="primary">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-edit" @click="verTipoModal = false; data_juego = data[indextr]; getCursosDocente()" color="primary" type="line"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip style="display: inline-block;" text="Previsualizar juego" position="top" color="primary">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-eye" @click="previsualizarJuego(data[indextr])" color="primary" type="line"></vs-button>
                                    </vx-tooltip>
                                </div>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </vs-tab>
        </vs-tabs>
    </vx-card>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
export default {
    data() {
        return {
            juegos: [],
            juegosprolipa: [],
            usuario: [],
            miusuario:[],
            tabActivo: 1,
            id_juego: '',
            id_tipo_juego: '',
            nombre_tipo_juego: '',
            juegoElimin: [],
            activePromptEliminar: false,
            url_juego: '',
            modalCursosCalificacions: false,
            cursos: [],
            data_juego: [],
            modalCursosEnvioLink: false,
            cursosDocente: [],
            verTipoModal: false,
            tipo_asignatura: '',
            cant_juegosprolipa: 0,
            cant_juegos: 0,
            grupo_usuario: '',
             //====VARIABLES PARA RECURSOS EXTERNOS
            libro:{
                libroweb:'1',
                libro_con_guia:'1',
                guia_didactica:'1',
                unidades:'1',
            },
            curso:{
                ver:'1',
                agregar:'1',
                editar:'1',
                eliminar:'1',
            },
            cuaderno:{
                guia:'1',
                didactica:'1',
                web:'1',
            },
            planificacion:{
                descargar:'1',
                visualizar:'1',
            },
            //variables para recursos adicionales
            mijuego:{
                agregar:'1',
                editar:'1',
                eliminar:'1',
                ver:'1',
                asignar:'1',
            },
            juegoProlipa:{
                asignar:'1',
                ver:'1',
                previsualizar:'1',
            },
            materialDigital:{
                ver:'1',
                previsualizar:'1',
                asignar:'1',
            },
            materialpdf:{
                subir:'1',
                ver:'1',
                descargar:'1',
                asignar:'1',
            },
            propuesta:{
                ver:'1',
            },
            adaptacion:{
                ver:'1',
            },
            articulo:{
                lengua:'1',
                matematica:'1',
                naturales:'1',
                sociales:'1',
                ensenanza:'1',
            },
            documentom:{
                ver:'1',
            },
            permisosExternos:'',
          //fin de variables para recursos adicionales
          //FIN DE VARIABLES PARA RECURSOS EXTERNOS
        }
    },
    mixins: [historicoMixin],
    components: {
        'v-select': vSelect,
        flatPickr,
    },
    created() {
        let me = this
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
        me.miusuario = me.usuario
        me.miusuario = me.usuario
        me.grupo_usuario = me.usuario.id_group;
        me.idusuario = me.usuario.idusuario;
        if (me.grupo_usuario == 10) { //director
            me.datoU = JSON.parse(localStorage.getItem('datoUser'))
            me.miusuario = me.datoU
        }

        me.id_tipo_juego = localStorage.getItem('id_tipo_juego')
        me.nombre_tipo_juego = localStorage.getItem('nombre_tipo_juego')
        me.tipo_asignatura = localStorage.getItem("tipo_asignatura")
    },
    mounted() {
        let me = this
        me.getJuegos()
        me.getJuegosProlipa()
         //PERMISOS EXTERNOS
        if(localStorage.status_permisos == "yes"){
            me.permisosExternos = JSON.parse(localStorage.permisosExternos)
            me.libro                    = me.permisosExternos.permisos_libros
            me.curso                    = me.permisosExternos.permisos_cursos
            me.cuaderno                 = me.permisosExternos.permisos_cuadernos
            me.planificacion            = me.permisosExternos.permisos_planificaciones
            //data de los recursos adicionales
            me.mijuego                  = me.permisosExternos.zona_diversion_mi_juego
            me.juegoProlipa             = me.permisosExternos.zona_diversion_juego_prolipa
            me.materialDigital          = me.permisosExternos.material_apoyo_digital
            me.materialpdf              = me.permisosExternos.material_apoyo_pdf
            me.propuesta                = me.permisosExternos.propuestas_metodologicas
            me.adaptacion               = me.permisosExternos.adaptaciones
            me.articulo                 = me.permisosExternos.articulos
            me.documentom               = me.permisosExternos.documentos_ministeriales
        }
        //FIN DE PERMISOS EXTERNOS
    },
    methods: {

        getJuegos() {
            let me = this
            me.$vs.loading()
            const formData = new FormData();
            formData.append('id_tipo_juego', me.id_tipo_juego);
            formData.append('id_docente', me.miusuario.idusuario);
            formData.append('id_asignatura', localStorage.idasignatura);
            this.$http.post(this.$server_url + 'j_juegos_tipo', formData)
                .then(res => {
                    me.juegos = res.data.items;
                    if (res.data.items) {
                        me.cant_juegos = me.juegos.length
                    }

                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        getJuegosProlipa() {
            let me = this
            me.$vs.loading()
            const formData = new FormData();
            formData.append('id_tipo_juego', me.id_tipo_juego);
            formData.append('id_asignatura', localStorage.idasignatura);
            this.$http.post(this.$server_url + 'j_juegos_tipo_prolipa', formData)
                .then(res => {
                    me.juegosprolipa = res.data.items;
                    if (res.data.items) {
                        me.cant_juegosprolipa = me.juegosprolipa.length
                    }

                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        irCrearjuego(item) {
            let me = this
            console.log(item)
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            localStorage.setItem('data_juego', JSON.stringify(item));

            switch (me.id_tipo_juego) {
                case '1':
                    // if (me.tipo_asignatura == "docente") {
                    //     me.$router.push('/a_crear_juego_ponchado')
                    // }
                    if (me.tipo_asignatura == "prolipa") {
                        if(me.usuario.id_group == 16){
                            me.$router.push('/colegios/crear_juego_ponchado')
                        }else{
                            me.$router.push('/crear_juego_ponchado')
                        }

                    }
                    break;
                case '2':
                    // if (me.tipo_asignatura == "docente") {
                    //     me.$router.push('/a_crear_juego_sopa')
                    // }
                    if (me.tipo_asignatura == "prolipa") {
                        if(me.usuario.id_group == 16){
                            me.$router.push('/colegios/crear_juego_sopa')
                        }else{
                            me.$router.push('/crear_juego_sopa')
                        }
                    }
                    break;
                case '3':
                    // if (me.tipo_asignatura == "docente") {
                    //     me.$router.push('/crearJuegoSeleccionSimple')
                    // }
                    if (me.tipo_asignatura == "prolipa") {
                        if(me.usuario.id_group == 16){
                            me.$router.push('/colegios/crearJuegoSeleccionSimple_docente')
                        }else{
                            me.$router.push('/crearJuegoSeleccionSimple_docente')
                        }

                    }
                    break;
                case '4':
                    if (me.tipo_asignatura == "prolipa") {
                        if(me.usuario.id_group == 16){
                            e.$router.push('/colegios/crearJuegoMillonario_docente')
                        }else{
                            me.$router.push('/crearJuegoMillonario_docente')
                        }
                    }
                    break;
                case '5':
                    if (me.tipo_asignatura == "prolipa") {
                        if(me.usuario.id_group == 16){
                            me.$router.push('/colegios/crearJuegoMemoria_docente')
                        }else{
                            me.$router.push('/crearJuegoMemoria_docente')
                        }
                    }
                    break;
                case '6':
                    if (me.tipo_asignatura == "prolipa") {
                        if(me.usuario.id_group == 16){
                            me.$router.push('/colegios/crearRompecabezas_docente')
                        }else{
                            me.$router.push('/crearRompecabezas_docente')
                        }

                    }
                    break;
            }
        },
        openConfirmEliminar() {
            let me = this
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            me.activePromptEliminar = true;
        },
        eliminarJuego() {
            let me = this;
            this.$http.get(this.$server_url + `j_juegos_eliminar/${me.juegoElimin}`).then(res => {
                    me.getJuegos()
                    me.$vs.notify({
                        text: 'Juego eliminado',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
                .catch(function (error) {

                })
        },
        getCursosDocente() {
            let me = this
            let formData = new FormData();
            formData.append('id_usuario', me.miusuario.idusuario);
            formData.append('id_asignatura', localStorage.idasignatura);
            formData.append('periodo_id', localStorage.periodo_id);
            this.$http.post(this.$server_url + 'curso_libro_docente', formData)
                .then(function (res) {
                    me.cursosDocente = res.data
                    me.modalCursosEnvioLink = true
                })
                .catch(function (error) {})
        },
        verCalificaciones(item) {
            let me = this
            localStorage.codigo_calif = item.codigo
            localStorage.nombre_curso_calif = item.nombre
            localStorage.id_curso_calif = me.data_juego.id_juego
            localStorage.nombre_juego_calif = me.data_juego.nombre_juego
            localStorage.tipo_juego_calif = me.nombre_tipo_juego
            // me.$router.push('/docente/juegos_curso')
            window.open('/docente/juegos_curso', '_blank');
        },
        copiarLink(codigo) {
            let me = this
            let date = new Date()
            let fecha_actual = moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')

            if (fecha_actual < me.data_juego.fecha_inicio || fecha_actual > me.data_juego.fecha_fin) {
                me.$vs.notify({
                    text: 'Este juego aún no está disponible. Verifique las fechas de inicio y fin.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            switch (me.id_tipo_juego) {
                case '1':
                    me.url_juego = 'ponchado'
                    break;
                case '2':
                    me.url_juego = 'sopa_letras'
                    break;
                case '3':
                    me.url_juego = 'jugarSeleccionSimple'
                    break;
                case '4':
                    me.url_juego = 'jugarMillonario'
                    break;
                case '6':
                    me.url_juego = 'rompecabezas'
                    break;
            }

            let link = window.location.host + '/' + me.url_juego + '/' + me.data_juego.id_juego + '/' + codigo
            var aux = document.createElement("input");
            aux.setAttribute("value", link);
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
                        title: 'Link copiado',
                        text: 'Puede enviar este link a sus estudiantes.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }

            document.body.removeChild(aux);
        },
        previsualizarJuegos(item) {
            let me = this
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
                'recurso_accion': 'ver',
                'recurso_tipo': 'juego',
                'recurso_nombre': me.nombre_juego,
                'recurso_detalle': 'curso donde es visto el juego '+item.codigo,
                'tipo juego':localStorage.nombre_tipo_juego
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)

            switch (me.id_tipo_juego) {
                case '1':
                    me.url_juego = 'ponchado'
                    break;
                case '2':
                    me.url_juego = 'sopa_letras'
                    break;
                case '3':
                    me.url_juego = 'jugarSeleccionSimple'
                    break;
                case '4':
                    me.url_juego = 'jugarMillonario'
                    break;
                case '6':
                    me.url_juego = 'rompecabezas'
                    break;
            }

            window.open('/' + me.url_juego + '/' + me.data_juego.id_juego + '/' + item.codigo, "_blank");

        },
        previsualizarJuego(item) {
             let me = this
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
                'recurso_accion': 'ver',
                'recurso_tipo': 'juego',
                'recurso_nombre': item.nombre_juego,
                'recurso_detalle': 'curso donde es visto el juego '+localStorage.codigo,
                'tipo juego':localStorage.nombre_tipo_juego
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            let url_juego = ''
            let id_tipo = parseInt(item.id_tipo_juego)
            console.log(item)
            // return
            switch (id_tipo) {
                case 1:
                    url_juego = 'ponchado'
                    break;
                case 2:
                    url_juego = 'sopa_letras'
                    break;
                case 3:
                    url_juego = 'jugarSeleccionSimple'
                    break;
                case 4:
                    url_juego = 'jugarMillonario'
                    break;
                case 6:
                    url_juego = 'rompecabezas'
                    break;
            }

            window.open('/' + url_juego + '/' + item.id_juego + '/previsualizar', "_blank");

        },
        asignarCurso(item) {
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
            let formData = new FormData();
            formData.append('codigo_curso', item.codigo);
            formData.append('id_juego', me.data_juego.id_juego);
            this.$http.post(this.$server_url + 'asignar_cursos_juego', formData)
                .then(function (res) {
                    console.log('pp',res.data)
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    if(res.data.status == 1){
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
                            'recurso_accion': 'asignar',
                            'recurso_tipo': 'juego',
                            'recurso_nombre': me.nombre_juego,
                            'recurso_detalle': 'asignado al curso '+item.codigo,
                            'tipo juego':localStorage.nombre_tipo_juego
                        }
                        me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
                    }
                      me.getCursosDocente()
                })
                .catch(function (error) {})
        }
    },
}
</script>

<style>
.btnwizard {
    width: 65px;
    height: 65px;
    font-size: 22px;
    padding: 0px;
    border-radius: 100%;
    border: 2px solid rgb(29, 90, 182);
    background-color: white;
    color: rgb(29, 90, 182);
    cursor: pointer;
}
</style>
