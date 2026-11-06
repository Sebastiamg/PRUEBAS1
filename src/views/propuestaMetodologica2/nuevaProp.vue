<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <div class="vx-row mt-4">
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Nombre: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="adaptacion.nombre" maxlength="100" placeholder="Nombre del documento" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Descripción: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="adaptacion.descripcion" maxlength="100" placeholder="Descripción del documento" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Asignatura: </div>
                <v-select class="mb-4 w-full" v-model="asignaturaSelect" :options="asignaturas" label="nombreasignatura" :reduce="asignaturas => asignaturas" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                <div style="font-size: 12px; ">Estado: </div>
                <vs-switch class="" vs-icon-on="check" color="success" v-model="adaptacion.estado" style="width: 100px;">
                    <span slot="on">Publicada</span>
                    <span slot="off">Inactivo</span>
                </vs-switch>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <div v-if="adaptacion.unidad1[0] != null"> Archivo actual: <br>
                        <label v-if="adaptacion.unidad1[0].archivo.length > long_name_file"> {{adaptacion.unidad1[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad1[0].ext}} </label>
                        <label v-else> {{adaptacion.unidad1[0].archivo}} </label>
                        <br>
                        <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                            <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad1[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Quitar archivo" position="bottom" color="danger">
                            <vs-button @click="openConfirmEliminar(adaptacion.unidad1[0],1)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                        </vx-tooltip>
                    </div>
                    <label v-else>
                        <div class="">Cargar archivo de unidad 1</div> <br>
                        <input ref="file1" id="file1" :accept="tipo_archivo" type="file" @change="cargaUnidad(1)" />
                        <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                        <p class="text-danger"> {{msj1}} </p>
                        <div class="v-row text-left" v-if="porcentaje1 > 0">
                            <vs-progress style="height:25px" :percent="porcentaje1" color="success"> {{porcentaje1}}% </vs-progress>
                        </div>
                    </label>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <div v-if="adaptacion.unidad2[0] != null"> Archivo actual: <br>
                        <label v-if="adaptacion.unidad2[0].archivo.length > long_name_file"> {{adaptacion.unidad2[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad2[0].ext}} </label>
                        <label v-else> {{adaptacion.unidad2[0].archivo}} </label>
                        <br>
                        <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                            <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad2[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Quitar archivo" position="bottom" color="danger">
                            <vs-button @click="openConfirmEliminar(adaptacion.unidad2[0],2)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                        </vx-tooltip>
                    </div>
                    <label v-else>
                        <div class="">Cargar archivo de unidad 2</div> <br>
                        <input v-if="porcentaje2 == 0" ref="file2" id="file2" :accept="tipo_archivo" type="file" @change="cargaUnidad(2)" />
                        <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                        <p class="text-danger"> {{msj2}} </p>
                        <div class="v-row text-left" v-if="porcentaje2 > 0">
                            <vs-progress style="height:25px" :percent="porcentaje2" color="success"> {{porcentaje2}}% </vs-progress>
                        </div>
                    </label>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <div v-if="adaptacion.unidad3[0] != null"> Archivo actual: <br>
                        <label v-if="adaptacion.unidad3[0].archivo.length > long_name_file"> {{adaptacion.unidad3[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad3[0].ext}} </label>
                        <label v-else> {{adaptacion.unidad3[0].archivo}} </label>
                        <br>
                        <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                            <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad3[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Quitar archivo" position="bottom" color="danger">
                            <vs-button @click="openConfirmEliminar(adaptacion.unidad3[0],3)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                        </vx-tooltip>
                    </div>
                    <label v-else>
                        <div class="">Cargar archivo de unidad 3</div> <br>
                        <input v-if="porcentaje3 == 0" ref="file3" id="file3" :accept="tipo_archivo" type="file" @change="cargaUnidad(3)" />
                        <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                        <p class="text-danger"> {{msj3}} </p>
                        <div class="v-row text-left" v-if="porcentaje3 > 0">
                            <vs-progress style="height:25px" :percent="porcentaje3" color="success"> {{porcentaje3}}% </vs-progress>
                        </div>
                    </label>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <div v-if="adaptacion.unidad4[0] != null"> Archivo actual: <br>
                        <label v-if="adaptacion.unidad4[0].archivo.length > long_name_file"> {{adaptacion.unidad4[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad4[0].ext}} </label>
                        <label v-else> {{adaptacion.unidad4[0].archivo}} </label>
                        <br>
                        <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                            <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad4[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Quitar archivo" position="bottom" color="danger">
                            <vs-button @click="openConfirmEliminar(adaptacion.unidad4[0],4)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                        </vx-tooltip>
                    </div>
                    <label v-else>
                        <div class="">Cargar archivo de unidad 4</div> <br>
                        <input v-if="porcentaje4 == 0" ref="file4" id="file4" :accept="tipo_archivo" type="file" @change="cargaUnidad(4)" />
                        <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                        <p class="text-danger"> {{msj4}} </p>
                        <div class="v-row text-left" v-if="porcentaje4 > 0">
                            <vs-progress style="height:25px" :percent="porcentaje4" color="success"> {{porcentaje4}}% </vs-progress>
                        </div>
                    </label>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <div v-if="adaptacion.unidad5[0] != null"> Archivo actual: <br>
                        <label v-if="adaptacion.unidad5[0].archivo.length > long_name_file"> {{adaptacion.unidad5[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad5[0].ext}} </label>
                        <label v-else> {{adaptacion.unidad5[0].archivo}} </label>
                        <br>
                        <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                            <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad5[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Quitar archivo" position="bottom" color="danger">
                            <vs-button @click="openConfirmEliminar(adaptacion.unidad5[0],5)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                        </vx-tooltip>
                    </div>
                    <label v-else>
                        <div class="">Cargar archivo de unidad 5</div> <br>
                        <input v-if="porcentaje5 == 0" ref="file5" id="file5" :accept="tipo_archivo" type="file" @change="cargaUnidad(5)" />
                        <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                        <p class="text-danger"> {{msj5}} </p>
                        <div class="v-row text-left" v-if="porcentaje5 > 0">
                            <vs-progress style="height:25px" :percent="porcentaje5" color="success"> {{porcentaje5}}% </vs-progress>
                        </div>
                    </label>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <div v-if="adaptacion.unidad6[0] != null"> Archivo actual: <br>
                        <label v-if="adaptacion.unidad6[0].archivo.length > long_name_file"> {{adaptacion.unidad6[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad6[0].ext}} </label>
                        <label v-else> {{adaptacion.unidad6[0].archivo}} </label>
                        <br>
                        <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                            <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad6[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                        </vx-tooltip>
                        <vx-tooltip style="display: inline-block;" text="Quitar archivo" position="bottom" color="danger">
                            <vs-button @click="openConfirmEliminar(adaptacion.unidad6[0],6)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                        </vx-tooltip>
                    </div>
                    <label v-else>
                        <div class="">Cargar archivo de unidad 6</div> <br>
                        <input v-if="porcentaje6 == 0" ref="file6" id="file6" :accept="tipo_archivo" type="file" @change="cargaUnidad(6)" />
                        <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                        <p class="text-danger"> {{msj6}} </p>
                        <div class="v-row text-left" v-if="porcentaje6 > 0">
                            <vs-progress style="height:25px" :percent="porcentaje6" color="success"> {{porcentaje6}}% </vs-progress>
                        </div>
                    </label>
                </div>
            </div>
            <div class="vx-col sm:w-1/1 w-full mt-4">
                <vs-button @click="$router.go(-1);" color="dark" type="border">Volver</vs-button> &nbsp;
                <vs-button v-if="edita ==1" class="m-2 mb-2" color="success" type="gradient" style="width: 150px" @click="verificarDatos()">Guardar</vs-button>
                <vs-button v-if="edita ==2" class="m-2 mb-2" color="warning" type="gradient" style="width: 150px" @click="verificarDatos()">Editar</vs-button>
            </div>
        </div>
    </vx-card>
</div>
</template>
<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            //tipo de archivo permitido para cargar (docx, doc)
            tipo_archivo: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/msword',
            long_name_file: 25, //longitud del nombre de archivo a mostrar
            limiteMegas: 5, //maximo de megas permitido a subir en cada archivo
            usuario: '',
            titulo: '',
            edita: '',
            datosEditar: '',
            asignaturas: [],
            adaptaciones:[],
            asignaturaSelect: {
                'idasignatura': '',
                'nombreasignatura': '',
                'area_idarea': '',
                'nivel_idnivel': '',
                'user_grupoUsuario': '',
                'user_idUsuario': '',
                'user_nombreUsuario': '',
                'user_email': '',
                'asignatura_id':'',
            },
            
            adaptacion: {
                'id': '',
                'nombre': "",
                'descripcion': '',
                'asignatura': '',
                'unidad1': [],
                'unidad2': [],
                'unidad3': [],
                'unidad4': [],
                'unidad5': [],
                'unidad6': [],
                'estado': 'true',
            },
            elim_u1: '',
            elim_u2: '',
            elim_u3: '',
            elim_u4: '',
            elim_u5: '',
            elim_u6: '',
            bytes: 1048576,
            msjError: 'El peso del archivo excede el limite permitido, verifique antes de continuar',

            porcentaje1: '',
            pesoArchivo1: '',
            muyPesado1: '',
            msj1: '',

            porcentaje2: '',
            pesoArchivo2: '',
            muyPesado2: '',
            msj2: '',

            porcentaje3: '',
            pesoArchivo3: '',
            muyPesado3: '',
            msj3: '',

            porcentaje4: '',
            pesoArchivo4: '',
            muyPesado4: '',
            msj4: '',

            porcentaje5: '',
            pesoArchivo5: '',
            muyPesado5: '',
            msj5: '',

            porcentaje6: '',
            pesoArchivo6: '',
            muyPesado6: '',
            msj6: '',
            file_eliminar:'',
            unidad_eliminar:'',
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.edita = localStorage.getItem('editarA')
        if (me.edita == 1) {
            me.titulo = 'Nueva propuesta metodológica'
        }
        if (me.edita == 2) {
            me.datosEditar = JSON.parse(localStorage.getItem('contenidoAD'));
            //guardar en arreglo    
            me.adaptacion = {
                "id":               me.datosEditar.id,
                "idusuario":        me.datosEditar.idusuario,
                "responsable":      me.datosEditar.responsable,
                "grupo_usuario":    me.datosEditar.grupo_usuario,
                "nombre":           me.datosEditar.nombre,
                "descripcion":      me.datosEditar.descripcion,
                "nombreasignatura": me.datosEditar.nombreasignatura,
                "asignatura_id":    me.datosEditar.asignatura_id,
                "estado":           me.datosEditar.estado,
                "created_at":       me.datosEditar.created_at,
                "updated_at":       me.datosEditar.updated_at,
                "unidad1":          me.datosEditar.unidad1,
                "unidad2":          me.datosEditar.unidad2,
                "unidad3":          me.datosEditar.unidad3,
                "unidad4":          me.datosEditar.unidad4,
                "unidad5":          me.datosEditar.unidad5,
                "unidad6":          me.datosEditar.unidad6
            };
        me.adaptaciones = me.adaptacion
        me.asignaturaSelect.idasignatura     = me.datosEditar.asignatura_id
        me.asignaturaSelect.nombreasignatura = me.datosEditar.nombreasignatura
        // console.log(me.datosEditar)
        me.titulo = 'Editar propuesta metodológica'
        }
        me.getAsignaturas();
    },
    methods: {
        getAsignaturas() {
            let me = this;
            this.$http.get(this.$server_url+'asignaturasActi')
                .then(res => {
                    me.asignaturas = res.data
                })
                .catch(error => {
                    console.log(error)
                })
        },
        cargaUnidad(unidad) {
            let me = this;
            if (unidad == 1) {
                me.msj1='';
                me.porcentaje1 = 0;
                me.pesoArchivo1 = 0;
                me.muyPesado1 = false;
                me.file1 = me.$refs.file1.files[0];
                // verificar tamaño de archivo
                me.pesoArchivo1 = (me.file1.size / me.bytes).toFixed(2);
                if (me.pesoArchivo1 > me.limiteMegas) {
                    me.muyPesado1 = true;
                    me.msj1 = me.msjError;
                }
                // me.adaptacion.unidad1[0] = me.file1;
                console.log(me.adaptacion.unidad1)
            }
            if (unidad == 2) {
                me.msj2='';
                me.porcentaje2 = 0;
                me.pesoArchivo2 = 0;
                me.muyPesado2 = false;
                me.file2 = me.$refs.file2.files[0];
                // verificar tamaño de archivo
                me.pesoArchivo2 = (me.file2.size / me.bytes).toFixed(2);
                if (me.pesoArchivo2 > me.limiteMegas) {
                    me.muyPesado2 = true;
                    me.msj2 = me.msjError;
                }
                me.adaptacion.unidad2 = me.file2;
            }
            if (unidad == 3) {
                me.msj3='';
                me.porcentaje3 = 0;
                me.pesoArchivo3 = 0;
                me.muyPesado3 = false;
                me.file3 = me.$refs.file3.files[0];
                // verificar tamaño de archivo
                me.pesoArchivo3 = (me.file3.size / me.bytes).toFixed(2);
                if (me.pesoArchivo3 > me.limiteMegas) {
                    me.muyPesado3 = true;
                    me.msj3 = me.msjError;
                }
                me.adaptacion.unidad3 = me.file3;
            }
            if (unidad == 4) {
                me.msj4='';
                me.porcentaje4 = 0;
                me.pesoArchivo4 = 0;
                me.muyPesado4 = false;
                me.file4 = me.$refs.file4.files[0];
                // verificar tamaño de archivo
                me.pesoArchivo4 = (me.file4.size / me.bytes).toFixed(2);
                if (me.pesoArchivo4 > me.limiteMegas) {
                    me.muyPesado4 = true;
                    me.msj4 = me.msjError;
                }
                me.adaptacion.unidad4 = me.file4;
            }
            if (unidad == 5) {
                me.msj5='';
                me.porcentaje5 = 0;
                me.pesoArchivo5 = 0;
                me.muyPesado5 = false;
                me.file5 = me.$refs.file5.files[0];
                // verificar tamaño de archivo
                me.pesoArchivo5 = (me.file5.size / me.bytes).toFixed(2);
                if (me.pesoArchivo5 > me.limiteMegas) {
                    me.muyPesado5 = true;
                    me.msj5 = me.msjError;
                }
                me.adaptacion.unidad5 = me.file5;
            }
            if (unidad == 6) {
                me.msj6='';
                me.porcentaje6 = 0;
                me.pesoArchivo6 = 0;
                me.muyPesado6 = false;
                me.file6 = me.$refs.file6.files[0];
                // verificar tamaño de archivo
                me.pesoArchivo6 = (me.file6.size / me.bytes).toFixed(2);
                if (me.pesoArchivo6 > me.limiteMegas) {
                    me.muyPesado6 = true;
                    me.msj6 = me.msjError;
                }
                me.adaptacion.unidad6 = me.file6;
            }
            console.log(me.adaptacion)
        },
        openConfirmEliminar(item, unidad) {
            let me = this;
            me.file_eliminar = item
            me.unidad_eliminar = unidad;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: 'Este archivo será eliminado, para cargar el nuevo archivo.',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarArchivo
            })
        },
        eliminarArchivo() {
            let me = this;
            me.$vs.loading()
            axios.get(this.$data_url+'api/propuesta/file/eliminar?id='+me.file_eliminar.id)
                .then(function (res) {
                    if (me.unidad_eliminar == 1) { //elimina unidad 1
                        me.adaptacion.unidad1 = [];
                        me.muyPesado1 = '';
                        me.msj1 = '';
                        me.file1 = '';
                        window.$("#file1").val('');
                    }
                    if (me.unidad_eliminar == 2) { //elimina unidad 2
                        me.adaptacion.unidad2 = [];
                        me.muyPesado2 = '';
                        me.msj2 = '';
                        me.file2 = '';
                        window.$("#file2").val('');
                    }
                    if (me.unidad_eliminar == 3) { //elimina unidad 3
                        me.adaptacion.unidad3 = [];
                        me.muyPesado3 = '';
                        me.msj3 = '';
                        me.file3 = '';
                        window.$("#file3").val('');
                    }
                    if (me.unidad_eliminar == 4) { //elimina unidad 4
                        me.adaptacion.unidad4 = [];
                        me.muyPesado4 = '';
                        me.msj4 = '';
                        me.file4 = '';
                        window.$("#file4").val('');
                    }
                    if (me.unidad_eliminar == 5) { //elimina unidad 5
                        me.adaptacion.unidad5 = [];
                        me.muyPesado5 = '';
                        me.msj5 = '';
                        me.file5 = '';
                        window.$("#file5").val('');
                    }
                    if (me.unidad_eliminar == 6) { //elimina unidad 6
                        me.adaptacion.unidad6 = [];
                        me.muyPesado6 = '';
                        me.msj6 = '';        
                        me.file6 = '';
                        window.$("#file6").val('');
                    }
                    me.$vs.notify({
                        text: 'Archivo eliminado correctamente.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'No se eliminó el archivo',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    
                })
        },

        // quitarArchivo(item, unidad) {
        //     let me = this;
        //     console.log('e',item)
        //     switch (unidad) {
        //         case 1:
        //             me.elim_u1 = item[0].id //id de archivo a eliminar
        //             me.adaptacion.unidad1 = [];
        //             me.muyPesado1 = '';
        //             me.msj1 = '';
        //             // console.log('quita unidad 1', me.adaptacion)
        //             break;
        //         case 2:
        //             me.elim_u2 = item[0].id //id de archivo a eliminar
        //             me.adaptacion.unidad2 = [];
        //             me.muyPesado2 = '';
        //             me.msj2 = '';
        //             break;
        //         case 3:
        //             me.elim_u3 = item[0].id //id de archivo a eliminar
        //             me.adaptacion.unidad3 = [];
        //             me.muyPesado3 = '';
        //             me.msj3 = '';
        //             break;
        //         case 4:
        //             me.elim_u4 = item[0].id //id de archivo a eliminar
        //             me.adaptacion.unidad4 = [];
        //             me.muyPesado4 = '';
        //             me.msj4 = '';
        //             break;
        //         case 5:
        //             me.elim_u5 = item[0].id //id de archivo a eliminar
        //             me.adaptacion.unidad5 = [];
        //             me.muyPesado5 = '';
        //             me.msj5 = '';
        //             break;
        //         case 6:
        //             me.elim_u6 = item[0].id //id de archivo a eliminar
        //             me.adaptacion.unidad6 = [];
        //             me.muyPesado6 = '';
        //             me.msj6 = '';
        //             break;
        //     }
        // },
        verificarDatos() {
            let me = this;
            if (me.muyPesado1 || me.muyPesado2 || me.muyPesado3 || me.muyPesado4 || me.muyPesado5 || me.muyPesado6) {
                me.$vs.notify({
                    text: 'Verifique el tamaño de sus archivos, antes de continuar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.adaptacion.nombre == "") {
                me.$vs.notify({
                    text: 'Ingrese el nombre del proyecto',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.asignaturaSelect.idasignatura < 1) {
                me.$vs.notify({
                    text: 'Seleccione la asignatura antes de continuar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.subirUnidad1();
        },
        subirUnidad1() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.file1);
            if (me.file1 == undefined) {
                me.subirUnidad2();
            }else{
                this.$http.post(this.$server_url+'upload/file', formData,{
                // axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivo1 > 0) {
                                me.porcentaje1 = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.adaptacion.unidad1 = response.data[0];
                        me.$vs.notify({
                            text: 'Archivo de la UNIDAD 1 cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirUnidad2();
                        // me.$vs.loading.close()
                    })
                    .catch(error => {
                        me.archivo = '';
                        console.log(' no se ha seleccionado ningun archivo unidad  1 ')
                        me.subirUnidad2();
                        // me.$vs.loading.close()
                    })
            }
            
           
        },
        subirUnidad2() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.file2);
            if (me.file2 == undefined) {
                me.subirUnidad3();
            }else{
                this.$http.post(this.$server_url+'upload/file', formData,{
                // axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivo2 > 0) {
                                me.porcentaje2 = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.adaptacion.unidad2 = response.data[0]
                        me.$vs.notify({
                            text: 'Archivo de la UNIDAD 2 cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirUnidad3();
                        // me.$vs.loading.close()
                    })
                    .catch(error => {
                        me.archivo = '';
                        console.log(' no se ha seleccionado ningun archivo unidad 2  ')
                        me.subirUnidad3();
                        // me.$vs.loading.close()
                    })
            }
        },
        subirUnidad3() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.file3);
            if (me.file3 == undefined) {
                me.subirUnidad4();
            }else{
                this.$http.post(this.$server_url+'upload/file', formData,{
                // axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivo3 > 0) {
                                me.porcentaje3 = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.adaptacion.unidad3 = response.data[0]
                        me.$vs.notify({
                            text: 'Archivo de la UNIDAD 3 cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirUnidad4();
                        // me.$vs.loading.close()
                    })
                    .catch(error => {
                        me.archivo = '';
                        console.log(' no se ha seleccionado ningun archivo unidad 3  ')
                        me.subirUnidad4();
                        // me.$vs.loading.close()
                    })
            } 
        },
        subirUnidad4() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.file4);
            if (me.file4 == undefined) {
                me.subirUnidad5();
            }else{
                this.$http.post(this.$server_url+'upload/file', formData,{
                // axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivo4 > 0) {
                                me.porcentaje4 = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.adaptacion.unidad4 = response.data[0]
                        me.$vs.notify({
                            text: 'Archivo de la UNIDAD 4 cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirUnidad5();
                        // me.$vs.loading.close()
                    })
                    .catch(error => {
                        me.archivo = '';
                        console.log(' no se ha seleccionado ningun archivo unidad 4  ')
                        me.subirUnidad5();
                        // me.$vs.loading.close()
                    })
            }
        },
        subirUnidad5() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.file5);
            if (me.file5 == undefined) {
                me.subirUnidad6();
            }else{
                this.$http.post(this.$server_url+'upload/file', formData,{
                // axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivo5 > 0) {
                                me.porcentaje5 = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.adaptacion.unidad5 = response.data[0]
                        me.$vs.notify({
                            text: 'Archivo de la UNIDAD 5 cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirUnidad6();
                        // me.$vs.loading.close()
                    })
                    .catch(error => {
                        me.archivo = '';
                        console.log(' no se ha seleccionado ningun archivo unidad 5  ')
                        me.subirUnidad6();
                        // me.$vs.loading.close()
                    })
            }
        },
        subirUnidad6() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.file6);
            if (me.file6 == undefined) {
                me.guarda_o_edita()
            }else{
                this.$http.post(this.$server_url+'upload/file', formData,{
                // axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivo6 > 0) {
                                me.porcentaje6 = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.adaptacion.unidad6 = response.data[0]
                        me.$vs.notify({
                            text: 'Archivo de la UNIDAD 6 cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.guarda_o_edita();
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        me.archivo = '';
                        console.log(' no se ha seleccionado ningun archivo unidad 6  ')
                        me.guarda_o_edita();
                        me.$vs.loading.close()
                    })
            }
        },
        guarda_o_edita() {
            let me = this;
            if (me.edita) {
                // me.editaWQ();
                me.registrarPropuesta();
                me.$vs.loading.close()
            }
            if (!me.edita) {
                me.registrarPropuesta();
                me.$vs.loading.close()
            }
        },
        registrarPropuesta(){
            let me = this;   
            let formData = new FormData();
            //DESCRIPCION
            formData.append('nombre',           me.adaptacion.nombre)
            formData.append('descripcion',      me.adaptacion.descripcion)
            formData.append('asignatura_id',    me.asignaturaSelect.idasignatura)
            if(me.adaptacion.estado){
               formData.append('estado',        "1")
            }else{
               formData.append('estado',        "0")
            }
            formData.append('idusuario',        me.usuario.idusuario)
            formData.append('grupo_usuario',    me.usuario.id_group)
            //FILES
            if(me.file1 == undefined)  me.file1 = ""
            if(me.file2 == undefined)  me.file2 = ""  
            if(me.file3 == undefined)  me.file3 = "" 
            if(me.file4 == undefined)  me.file4 = "" 
            if(me.file5 == undefined)  me.file5 = ""    
            if(me.file6 == undefined)  me.file6 = "" 
            formData.append('fileUnidad1',      me.file1);
            formData.append('fileUnidad2',      me.file2);
            formData.append('fileUnidad3',      me.file3);
            formData.append('fileUnidad4',      me.file4);
            formData.append('fileUnidad5',      me.file5);
            formData.append('fileUnidad6',      me.file6);
            if(me.edita){
                formData.append('id',me.adaptacion.id)
            }
            me.$vs.loading()
            axios.post(this.$data_url+'api/guardarPropuesta',formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.volver()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Error al guardar la propuesta metodológica',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
        },
        descargaArchivo(item) {
            // console.log(item)
            let url2 = this.$data_url+'archivos/propuestas/'+item.url
             window.open(url2)
            // axios({
            //         url: this.$data_url + 'archivos/propuestas/' + item.url,
            //         method: 'GET',
            //         responseType: 'blob',
            //     })
            //     .then((response) => {
            //         var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            //         var fileLink = document.createElement('a');

            //         fileLink.href = fileURL;
            //         fileLink.setAttribute('download', item.archivo);
            //         document.body.appendChild(fileLink);

            //         fileLink.click();
            //         this.$vs.notify({
            //             text: 'El archivo se esta descargando',
            //             color: 'success',
            //             iconPack: 'feather',
            //             icon: 'icon-check'
            //         })
            //     })
            //     .catch(error => {
            //         this.$vs.notify({
            //             text: 'Error en la descarga del archivo',
            //             color: 'warning',
            //             iconPack: 'feather',
            //             icon: 'icon-alert-triangle'
            //         })
            //     })
        },
        volver() {
            let me = this;
            me.$router.go(-1);
        }
    }
}
</script>

<style>
/* input[type="file"] {
    display: none;
} */

.text-danger {
    font-size: 11px;
}

.borde-unidad {
    border: 1px dashed #ccc;
    /* display: inline-block; */
    padding: 6px;
    cursor: pointer;
}
</style>
