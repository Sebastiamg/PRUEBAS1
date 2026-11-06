<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <!-- <div class="vx-col w-full mb-base">
            <vs-button @click="volver()" style="display:inline" color="dark" type="border">Volver</vs-button> &nbsp;
            <h4 style="display:inline">{{titulo}} </h4>
        </div> -->
        <div class="vx-row mt-4">
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-5" align="left">
                <div style="font-size: 12px; ">Nombre: </div>
                <!-- <vs-input type="text" class="inputx w-full mb-6" v-model="adaptacion.nombre" maxlength="100" placeholder="Nombre del documento" /> -->
                <p class="caja-texto">{{adaptacion.nombre}} </p>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-5" align="left">
                <div style="font-size: 12px; ">Descripción: </div>
                <p class="caja-texto">{{adaptacion.descripcion}} </p>
                <!-- <vs-input type="text" class="inputx w-full mb-6" v-model="adaptacion.descripcion" maxlength="100" placeholder="Descripción del documento" /> -->
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-5" align="left">
                <div style="font-size: 12px; ">Asignatura: </div>
                <!-- <v-select class="mb-4 w-full" v-model="asignaturaSelect" :options="asignaturas" label="nombreasignatura" :reduce="asignaturas => asignaturas" /> -->
                <p class="caja-texto">{{adaptacion.nombreasignatura}} </p>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                <div style="font-size: 12px; ">Estado: </div>
                <p class="caja-texto">
                    <label v-if="adaptacion.estado" class="text-success"> Disponible </label>
                    <label v-else class="text-danger"> Inactivo </label>
                </p>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <b>Unidad 1:</b> <br>
                    <div v-if="adaptacion.unidad1 != undefined && adaptacion.unidad1 != null">
                        <div v-if="adaptacion.unidad1.length > 0">
                            <label v-if="adaptacion.unidad1[0].archivo.length > long_name_file"> {{adaptacion.unidad1[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad1[0].ext}} </label>
                            <label v-else> {{adaptacion.unidad1[0].archivo}} </label>
                            <br>
                            <vx-tooltip v-if="grupo_usuario == 1 || grupo_usuario == 6 || grupo_usuario == 9 ||  grupo_usuario == 16" text="Descargar archivo en mi equipo" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad1[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Visualizar archivo" position="bottom" color="primary">
                                <vs-button style="display: inline" @click="mostrarArchivo(adaptacion.unidad1,1)" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                            </vx-tooltip>
                        </div>
                        <div v-else><i>Unidad 1 no disponible por el momento.</i></div>
                    </div>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <b>Unidad 2:</b> <br>
                    <div v-if="adaptacion.unidad2 != undefined && adaptacion.unidad2 != null">
                        <div v-if="adaptacion.unidad2.length > 0">
                            <label v-if="adaptacion.unidad2[0].archivo.length > long_name_file"> {{adaptacion.unidad2[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad2[0].ext}} </label>
                            <label v-else> {{adaptacion.unidad2[0].archivo}} </label>
                            <br>
                            <vx-tooltip v-if="grupo_usuario == 1 || grupo_usuario == 6 || grupo_usuario == 9  || grupo_usuario == 16" text="Descargar archivo en mi equipo" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad2[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Visualizar archivo" position="bottom" color="primary">
                                <vs-button style="display: inline" @click="mostrarArchivo(adaptacion.unidad2,2)" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                            </vx-tooltip>
                        </div>
                        <div v-else><i>Unidad 2 no disponible por el momento.</i></div>
                    </div>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <b>Unidad 3:</b> <br>
                    <div v-if="adaptacion.unidad3 != undefined && adaptacion.unidad3 != null">
                        <div v-if="adaptacion.unidad3.length > 0">
                            <label v-if="adaptacion.unidad3[0].archivo.length > long_name_file"> {{adaptacion.unidad3[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad3[0].ext}} </label>
                            <label v-else> {{adaptacion.unidad3[0].archivo}} </label>
                            <br>
                            <vx-tooltip v-if="grupo_usuario == 1 || grupo_usuario == 6 || grupo_usuario == 9 || grupo_usuario == 16" text="Descargar archivo en mi equipo" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad3[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Visualizar archivo" position="bottom" color="primary">
                                <vs-button style="display: inline" @click="mostrarArchivo(adaptacion.unidad3,3)" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                            </vx-tooltip>
                        </div>
                        <div v-else><i>Unidad 3 no disponible por el momento.</i></div>
                    </div>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <b>Unidad 4:</b> <br>
                    <div v-if="adaptacion.unidad4 != undefined && adaptacion.unidad4 != null">
                        <div v-if="adaptacion.unidad4.length > 0">
                            <label v-if="adaptacion.unidad4[0].archivo.length > long_name_file"> {{adaptacion.unidad4[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad4[0].ext}} </label>
                            <label v-else> {{adaptacion.unidad4[0].archivo}} </label>
                            <br>
                            <vx-tooltip v-if="grupo_usuario == 1 || grupo_usuario == 6 || grupo_usuario == 9 || grupo_usuario == 16" text="Descargar archivo en mi equipo" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad4[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Visualizar archivo" position="bottom" color="primary">
                                <vs-button style="display: inline" @click="mostrarArchivo(adaptacion.unidad4,4)" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                            </vx-tooltip>
                        </div>
                        <div v-else><i>Unidad 4 no disponible por el momento.</i></div>
                    </div>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <b>Unidad 5:</b> <br>
                    <div v-if="adaptacion.unidad5 != undefined && adaptacion.unidad5 != null">
                        <div v-if="adaptacion.unidad5.length > 0">
                            <label v-if="adaptacion.unidad5[0].archivo.length > long_name_file"> {{adaptacion.unidad5[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad5[0].ext}} </label>
                            <label v-else> {{adaptacion.unidad5[0].archivo}} </label>
                            <br>
                            <vx-tooltip v-if="grupo_usuario == 1 || grupo_usuario == 6 || grupo_usuario == 9 || grupo_usuario == 16" text="Descargar archivo en mi equipo" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad5[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Visualizar archivo" position="bottom" color="primary">
                                <vs-button style="display: inline" @click="mostrarArchivo(adaptacion.unidad5,5)" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                            </vx-tooltip>
                        </div>
                        <div v-else><i>Unidad 5 no disponible por el momento.</i></div>
                    </div>
                </div>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
                <div class="borde-unidad">
                    <b>Unidad 6:</b> <br>
                    <div v-if="adaptacion.unidad6 != undefined && adaptacion.unidad6 != null">
                        <div v-if="adaptacion.unidad6.length > 0">
                            <label v-if="adaptacion.unidad6[0].archivo.length > long_name_file"> {{adaptacion.unidad6[0].archivo.substr(0,long_name_file)}}.....{{adaptacion.unidad6[0].ext}} </label>
                            <label v-else> {{adaptacion.unidad6[0].archivo}} </label>
                            <br>
                            <vx-tooltip v-if="grupo_usuario == 1 || grupo_usuario == 6 || grupo_usuario == 9 || grupo_usuario == 16" text="Descargar archivo en mi equipo" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(adaptacion.unidad6[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Visualizar archivo" position="bottom" color="primary">
                                <vs-button style="display: inline" @click="mostrarArchivo(adaptacion.unidad6,6)" size="small" icon-pack="feather" icon="icon-eye" color="primary" type="border">Visualizar</vs-button>
                            </vx-tooltip>
                        </div>
                        <div v-else><i>Unidad 6 no disponible por el momento.</i></div>
                    </div>
                </div>
            </div>

        </div>
    </vx-card>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    components: {
        'v-select': vSelect,
    },
    mixins: [historicoMixin],
    data() {
        return {
            asignaturas: [],
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
                'unidad1': '',
                'unidad2': '',
                'unidad3': '',
                'unidad4': '',
                'unidad5': '',
                'unidad6': '',
                'estado': '',
            },
            datosEditar: '',
            adaptacion: '',
            asignaturaSelect: '',
            titulo: '',
            long_name_file: 25, //longitud del nombre de archivo a mostrar
            usuario: '',
            grupo_usuario: '',
            miusuario:'',
        }
    },
    mounted() {
        let me = this;
        localStorage.removeItem('verArticulo');
        me.datosEditar = JSON.parse(localStorage.getItem('contenidoAD'));
        console.log('rr',me.datosEditar.asignatura_id)
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.miusuario=me.usuario
        me.grupo_usuario = me.usuario.id_group;
        me.adaptacion = me.datosEditar;
        // me.asignaturaSelect.idasignatura     = me.datosEditar.asignatura_id
        // me.asignaturaSelect.nombreasignatura = me.datosEditar.nombreasignatura
        me.titulo = 'Ver contenido de la propuesta metodológica'
        // console.log(me.datosEditar)
        // console.log(me.datosEditar.unidad1[0])
    },
    methods: {
        descargaArchivo(item) {
            // console.log(item)
            if (this.grupo_usuario == 9) {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            // this.$vs.loading()
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = me.asignaturaSelect.idasignatura
            let h_nombreasignatura = me.asignaturaSelect.nombreasignatura
            let h_recursotipo = 7; //7 =propuesta
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'descargar',
                'recurso_tipo': 'propuesta',
                'recurso_nombre': item.archivo,
                'recurso_detalle': '',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            let url2 = this.$data_url+'archivos/propuestas/'+item.url
            window.open(url2)
            // axios({
            //         url: 'https://foro.prolipadigital.com.ec' + item.url,
            //         method: 'GET',
            //         responseType: 'blob',
            //     })
            //     .then((response) => {
            //         var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            //         var fileLink = document.createElement('a');

            //         fileLink.href = fileURL;
            //         fileLink.setAttribute('download', item.name + item.ext);
            //         document.body.appendChild(fileLink);

            //         fileLink.click();
            //         this.$vs.notify({
            //             text: 'El archivo ' + item.name + ' se ha descargado correctamente',
            //             color: 'success',
            //             iconPack: 'feather',
            //             icon: 'icon-check'
            //         })
            //         this.$vs.loading.close()
            //     })
            //     .catch(error => {
            //         this.$vs.notify({
            //             text: 'Error en la descarga del archivo, es posible que el archivo sea muy pesado, o se encuentre dañado. Favor comuniquese con su asesor',
            //             color: 'warning',
            //             iconPack: 'feather',
            //             icon: 'icon-alert-triangle'
            //         })
            //         this.$vs.loading.close()
            //     })
        },
        mostrarArchivo(item) {
            let me = this;
            console.log(item)
             let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 7; //7 =propuesta
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'propuesta',
                'recurso_nombre': item[0].archivo,
                'recurso_detalle': '',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo,datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
             if (item[0].url.substr(-3) == "pdf" || item[0].url.substr(-3) == "png" || item[0].url.substr(-3) == "jpg" || item[0].url.substr(-3) == "PNG") {
                window.open(this.$data_url+'archivos/propuestas/' + item[0].url, '_blank');
            } else if ( item[0].url.substr(-3) == "doc" || item[0].url.substr(-3) == "ocx" || item[0].url.substr(-3) == "xls" || item[0].url.substr(-3) == "lsx" ) {
                window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url+'archivos/propuestas/' + item[0].url, '_blank');
            }
        },
        
        volver() {
            this.$router.go(-1);
        },
    }
}
</script>

<style>
.caja-texto {
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 5px;
}
</style>
