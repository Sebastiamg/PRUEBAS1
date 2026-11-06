<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-button class="mb-4" color="dark" icon-pack="feather" icon="icon-arrow-left" @click="regresar">Regresar</vs-button>
    <vx-card>
        <p><b>Nombre:</b> {{datoU.nombres}} {{datoU.apellidos}} </p>
        <p><b>Email:</b> {{datoU.email}} </p>
        <p><b>Cédula:</b> {{datoU.cedula}} </p>

        <div class="mt-5">
            <vs-tabs alignment="fixed">
                <vs-tab v-if="oculto" :label="'Cursos ( '+cursosDocente.length+' )'">
                    <div v-if="cursosDocente.length>0">
                        <vs-table max-items="30" search pagination :data="cursosDocente">
                            <template slot="header">
                                Total de cursos: &nbsp; <b>{{cursosDocente.length}}</b>
                            </template>
                            <template slot="thead">
                                <vs-th sort-key="codigo">Código curso</vs-th>
                                <vs-th>Datos</vs-th>
                                <vs-th sort-key="updated_at">Fecha</vs-th>
                                <vs-th sort-key="estado">Estado</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td :data="data[indextr].codigo">
                                        {{ data[indextr].codigo }}
                                    </vs-td>
                                    <vs-td :data="data[indextr].nombre">
                                        <b>Nombre:</b> {{ data[indextr].nombre }}<br>
                                        <b>Aula:</b> {{ data[indextr].aula }}<br>
                                        <b>Seccion:</b> {{ data[indextr].seccion }}
                                        <span v-if="data[indextr].id_asignatura == 0" class="text-danger"> <br> Sin asignatura</span>
                                    </vs-td>
                                    <vs-td :data="data[indextr].updated_at">
                                        <small> Actualizado: {{ data[indextr].updated_at }}<br>
                                            Creado: {{ data[indextr].created_at }}</small>
                                    </vs-td>
                                    <vs-td :data="data[indextr].estado">
                                        <span v-if="data[indextr].estado ==0" class="text-danger">Eliminado</span>
                                        <span v-else class="text-success">Activo</span>
                                    </vs-td>
                                    <vs-td>
                                        <!-- <vx-tooltip style="display: inline-block;" text="Ver contenido del curso" position="top" color="success">
                                            <vs-button style="display:inline-block" class="mt-2" radius color="success" type="gradient" icon-pack="feather" icon="icon-eye" @click="contenidoCurso(data[indextr])"></vs-button>
                                        </vx-tooltip> -->

                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div v-else>
                        <p class="p-5"> No tenemos registros de este usuario en nuestra base de datos. </p>
                    </div>
                </vs-tab>
                <vs-tab :label="'Libros ( '+libros.length+' )'">
                    <div v-if="libros.length>0">
                        <vs-table max-items="30" search pagination :data="libros" stripe>
                            <template slot="header">
                                Total de asginaturas: &nbsp; <b>{{libros.length}}</b>
                            </template>
                            <template slot="thead">
                                <vs-th sort-key="nombreasignatura">Asignatura</vs-th>
                                <vs-th sort-key="nombres">Ver contenido</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td>
                                        {{data[indextr].nombreasignatura}}
                                    </vs-td>
                                    <vs-td>
                                        <span @click="irDesgloseLibro(data[indextr])">
                                            <vs-avatar v-if="data[indextr].weblibro != null " size="50px" v-bind:src="$data_url+'archivos/upload/libro/'+data[indextr].weblibro+'/portada.png'" alt="Card image cap" />
                                            <vs-avatar v-else size="50px" :src="$data_url+'archivos/upload/iconos/docente-curso/cursos.png'" alt="libro" />
                                        </span>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div v-else>
                        <p class="p-5"> No se han asignado libros de Prolipa a este docente. </p>
                    </div>
                </vs-tab>
                <vs-tab :label="'Visitas ('+listaVisitas.length+' )' ">
                    <div v-if="listaVisitas.length>0">
                        <vs-table max-items="30" search pagination :data="listaVisitas">
                            <template slot="header">
                                Total de accesos: &nbsp; <b>{{listaVisitas.length}}</b>
                            </template>
                            <template slot="thead">
                                <vs-th sort-key="cedula">Fecha</vs-th>
                                <vs-th sort-key="nombres">Hora</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td>
                                        {{data[indextr].fecha}}
                                    </vs-td>
                                    <vs-td>
                                        {{ data[indextr].hora}}
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                    </div>
                    <div v-else>
                        <p class="p-5"> No tenemos registros de este usuario en nuestra base de datos. </p>
                    </div>
                </vs-tab>
            </vs-tabs>
        </div>
    </vx-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    props:{
        datoU:Object
    },
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            docente: '',
            listaVisitas: [],
            cursosDocente: [],
            libros: [],
            tmplibros: '',
            datoU: '',
            oculto: false,
            grupo_usuario: 0,
        }
    },
    mounted() {
        let me = this;
        // me.datoU = JSON.parse(localStorage.getItem('datoUser'))
        localStorage.removeItem("idDocente");
        localStorage.removeItem("idlibro");
        localStorage.removeItem("idasignatura");
        localStorage.removeItem("nombreasignatura");
        // console.log(me.datoU)
        //me.grupo_usuario = me.datoU.id_group;
        // me.getCursos();
        me.getLibros();
        // me.getVisitas();
    },
    methods: {
        regresar() {
            this.$emit("estado", {
                plista: true,
                pnuevo: false,
                peditar: false,
            });
        },
        getCursos() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'cursos_x_usuario/' + me.datoU.name_usuario)
                .then(res => {
                    if (res.data.length > 0) {
                        me.cursosDocente = res.data;
                        me.$vs.loading.close();
                    } else {
                        me.$vs.notify({
                            text: 'No se encontraron registros',
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    }
                })
                .catch(error => {
                    me.$vs.loading.close();
                    console.log(' no se conecto a consultar los cursos ' + error)
                })
        },
        getLibros() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'libros?idusuario=' + me.datoU.idusuario+'&periodo_id='+localStorage.periodo_id)
                .then(function (response) {
                    me.libros = response.data
                    // console.log(me.libros)
                    me.$vs.loading.close();
                    me.getAsignaturasDocente();
                })
                .catch(function (error) {
                    console.log('error al conectar a los libros del docente ' + error)
                    me.$vs.loading.close();
                })

        },
        getAsignaturasDocente() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'asignaturas_crea_docente/' + me.datoU.idusuario)
                .then(function (response) {
                    me.tmplibros = (response.data)
                    for (let index = 0; index < me.tmplibros.length; index++) {
                        me.libros.push(me.tmplibros[index])
                    }
                    // console.log(me.libros)
                    me.$vs.loading.close();

                })
                .catch(function (error) {
                    me.$vs.loading.close();

                })
        },
        contenidoCurso(item) {
            let me = this;
            console.log(item)
            localStorage.datoUser = JSON.stringify(item);
        },
        verPDF(url) {
            localStorage.url = url;
            window.open('/docente/libro/pdfsinguia', '_blank');
        },
        irDesgloseLibro(item) {
            let me = this
            // console.log(item)
            // para consulta del DIRECTOR
            localStorage.idDocente = me.datoU.idusuario
            // fin para consulta del DIRECTOR
            localStorage.idlibro = item.idlibro
            localStorage.idasignatura = item.idasignatura
            localStorage.nombreasignatura = item.nombreasignatura
            localStorage.tipo_asignatura = "prolipa"; //asignaturas de prolipa
            me.$router.push('/director/institucion/docentes/contenidos/libro')
        },
    }
}
</script>
