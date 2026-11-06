<template>
<div class="vx-col md:w-full w-full mb-base">
    <vs-button v-if="grupo_usuario== 4" style="display: inline" color="dark" type="border" @click="volver()">Volver</vs-button>

    <vx-card>
        <div class="vx-row">
            <div class="vx-col w-full">
                <vs-button @click="valor=0;" class="m-1" size="medium" color="primary" type="border">Datos</vs-button>
                <vs-button @click="valor=1;" class="m-1" size="medium" color="primary" type="border">Introducción</vs-button>
                <vs-button @click="valor=2;" class="m-1" size="medium" color="primary" type="border">Tareas</vs-button>
                <vs-button @click="valor=3;" class="m-1" size="medium" color="primary" type="border">Proceso</vs-button>
                <vs-button @click="valor=4;" class="m-1" size="medium" color="primary" type="border">Recursos</vs-button>
                <vs-button @click="valor=5;" class="m-1" size="medium" color="primary" type="border">Evaluación</vs-button>
                <vs-button @click="valor=6;" class="m-1" size="medium" color="primary" type="border">Conclusiones</vs-button>
                <vs-button @click="valor=7;" class="m-1" size="medium" color="primary" type="border">Créditos</vs-button>
            </div>
        </div>
        <div v-if="valor == 0" class="fade-in">
            <div class="vx-row p-1">
                <div class="vx-col w-full mb-base">
                    <b>Datos generales:</b> <br>
                </div>
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                    <div style="font-size: 12px;"><b>Nombre:</b> </div>
                    <p class="caja-texto"> {{proyectos.nombre}} </p>
                </div>
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                    <div style="font-size: 12px;"><b>Descripción:</b> </div>
                    <p class="caja-texto"> {{proyectos.descripcion}} </p>
                </div>

                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left" v-if="proyectos.fileEstudiante != '' && proyectos.fileEstudiante !== null">
                    <div class="borde-unidad">
                        <div style="font-size: 12px;" class="mb-2">Archivo para el ESTUDIANTE: </div>
                        <div v-if="proyectos.fileEstudiante.length > 0" class="m-1">
                            <p><b>Archivo:</b></p>
                            <p>{{proyectos.fileEstudiante[0].archivo}}</p>
                            <p>
                                <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                    <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileEstudiante[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                    <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileEstudiante[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                </vx-tooltip>
                            </p>
                        </div>
                    </div>
                </div>
                <div class="vx-col w-full mb-base" align="left" v-if="grupo_usuario == 1">
                    <div style="font-size: 12px; "><b>Asignaturas seleccionadas:</b> </div>
                    <div v-if="proyectos.asignaturas != undefined" class="vx-row">
                        <div class="vx-col w-full" align="left" v-if="proyectos.asignaturas != undefined ">
                            <vs-list>
                                <vs-list-item class="ml-6" icon-pack="feather" icon="icon-check" v-for="(item,index) in proyectos.asignaturas" :key="index" :subtitle="item.nombreasignatura">
                                </vs-list-item>
                            </vs-list>
                            <!-- <vs-chip transparent color="primary" class="m-1" icon-pack="feather" icon="icon-check" v-for="(item,index) in proyectos.proyectos_asignaturas" :key="index">
                                <vs-avatar icon="check" color="success" /> {{item.datos.nombreasignatura}}
                            </vs-chip> -->
                        </div>
                    </div>
                    <div v-else>
                        Sin asignaturas
                    </div>
                </div>
            </div>
        </div>
        <div v-if="valor == 1">
            <div class="vx-col w-full m-1">
                <b>Introducción:</b>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left" v-if="proyectos.fileIntroduccion != '' && proyectos.fileIntroduccion !== null">
                    <div class="borde-unidad">
                        <div v-if="proyectos.fileIntroduccion.length > 0" class="m-1">
                            <p><b>Archivo:</b></p>
                            <p>{{proyectos.fileIntroduccion[0].archivo}}</p>
                            <p>
                                <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                    <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileIntroduccion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                    <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileIntroduccion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                </vx-tooltip>
                            </p>
                        </div>
                    </div>
                </div>

                <p class="caja-texto" v-html="proyectos.introduccion"></p>
            </div>
        </div>
        <div v-if="valor == 2">
            <div class="vx-col w-full m-1">
                <b>Tareas:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left" v-if="proyectos.fileTarea != '' && proyectos.fileTarea !== null">
                    <div class="borde-unidad">
                        <div v-if="proyectos.fileTarea.length > 0" class="m-1">
                            <p><b>Archivo:</b></p>
                            <p>{{proyectos.fileTarea[0].archivo}}</p>
                            <p>
                                <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                    <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileTarea[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                    <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileTarea[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                </vx-tooltip>
                            </p>
                        </div>
                    </div>
                </div>
                <p class="caja-texto" v-html="proyectos.tareas"></p>
            </div>
        </div>
        <div v-if="valor == 3">
            <div class="vx-col w-full m-1">
                <b>Proceso:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left" v-if="proyectos.fileProceso != '' && proyectos.fileProceso !== null">
                    <div class="borde-unidad">
                        <div v-if="proyectos.fileProceso.length > 0" class="m-1">
                            <p><b>Archivo:</b></p>
                            <p>{{proyectos.fileProceso[0].archivo}}</p>
                            <p>
                                <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                    <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileProceso[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                    <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileProceso[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                </vx-tooltip>
                            </p>
                        </div>
                    </div>
                </div>
                <p class="caja-texto" v-html="proyectos.proceso"></p>
            </div>
        </div>
        <div v-if="valor == 4">
            <div class="vx-col w-full m-1">
                <b>Recursos:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left" v-if="proyectos.fileRecurso != '' && proyectos.fileRecurso !== null">
                    <div class="borde-unidad">
                        <div v-if="proyectos.fileRecurso.length > 0" class="m-1">
                            <p><b>Archivo:</b></p>
                            <p>{{proyectos.fileRecurso[0].archivo}}</p>
                            <p>
                                <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                    <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileRecurso[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                    <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileRecurso[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                </vx-tooltip>
                            </p>
                        </div>
                    </div>
                </div>
                <p class="caja-texto" v-html="proyectos.recursos"></p>
            </div>
        </div>
        <div v-if="valor == 5">
            <div class="vx-col w-full m-1">
                <b>Evaluación:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left" v-if="proyectos.fileEvaluacion != '' && proyectos.fileEvaluacion !== null">
                    <div class="borde-unidad">
                        <div v-if="proyectos.fileEvaluacion.length > 0" class="m-1">
                            <p><b>Archivo:</b></p>
                            <p>{{proyectos.fileEvaluacion[0].archivo}}</p>
                            <p>
                                <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                    <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileEvaluacion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                    <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileEvaluacion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                </vx-tooltip>
                            </p>
                        </div>
                    </div>
                </div>
                <p class="caja-texto" v-html="proyectos.evaluacion"></p>
            </div>
        </div>
        <div v-if="valor == 6">
            <div class="vx-col w-full m-1">
                <b>Conclusiones:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left" v-if="proyectos.fileConclusion != '' && proyectos.fileConclusion !== null">
                    <div class="borde-unidad">
                        <div v-if="proyectos.fileConclusion.length > 0" class="m-1">
                            <p><b>Archivo:</b></p>
                            <p>{{proyectos.fileConclusion[0].archivo}}</p>
                            <p>
                                <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                    <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileConclusion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                    <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileConclusion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                </vx-tooltip>
                            </p>
                        </div>
                    </div>
                </div>
                <p class="caja-texto" v-html="proyectos.conclusiones"></p>
            </div>
        </div>
        <div v-if="valor == 7">
            <div class="vx-col w-full m-1">
                <b>Créditos:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <p class="caja-texto" v-html="proyectos.creditos"></p>
            </div>
        </div>
        <div class="vx-col w-full m-1" v-if="grupo_usuario == 4">
            <vs-button v-if="valor==1" style="display: inline" class="m-1 flotante" @click="responder()" size="medium" icon-pack="feather" icon="icon-edit" color="success" type="gradient">Responder la Introducción</vs-button>
            <vs-button v-if="valor==2" style="display: inline" class="m-1 flotante" @click="responder()" size="medium" icon-pack="feather" icon="icon-edit" color="success" type="gradient">Responder las Tareas</vs-button>
            <vs-button v-if="valor==3" style="display: inline" class="m-1 flotante" @click="responder()" size="medium" icon-pack="feather" icon="icon-edit" color="success" type="gradient">Responder el Proceso</vs-button>
            <vs-button v-if="valor==4" style="display: inline" class="m-1 flotante" @click="responder()" size="medium" icon-pack="feather" icon="icon-edit" color="success" type="gradient">Responder los Recursos</vs-button>
            <vs-button v-if="valor==5" style="display: inline" class="m-1 flotante" @click="responder()" size="medium" icon-pack="feather" icon="icon-edit" color="success" type="gradient">Responder la Evaluación</vs-button>
            <vs-button v-if="valor==6" style="display: inline" class="m-1 flotante" @click="responder()" size="medium" icon-pack="feather" icon="icon-edit" color="success" type="gradient">Responder las Conclusiones</vs-button>
        </div>
        <vs-button v-if="grupo_usuario!= 4" style="display: inline" color="danger" type="border" icon-pack="feather" @click="volver()" icon="icon-arrow-left">Volver</vs-button>

    </vx-card>
    <vs-popup fullscreen title="" :active.sync="modalRespuestas">
        <div class="vx-col w-full">
            <b>{{titulo}}:</b> <br>
        </div>
        <!-- <vs-button color="primary" type="border" icon-pack="feather" @click="guardar_cerrar()" icon="icon-save">Guardar y cerrar</vs-button> -->
        <div class="vx-col w-full m-1 mb-base">
            <div v-if="valor==1">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Adjuntar archivo: </div>
                        <div v-if="respueta_pry.fileIntroduccion != '' && respueta_pry.fileIntroduccion !== null " class="m-1">
                            <div v-if="respueta_pry.fileIntroduccion.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="respueta_pry.fileIntroduccion[0].archivo.length < long_name_file"> {{respueta_pry.fileIntroduccion[0].archivo}} </label>
                                    <label v-else>
                                        <span v-if="respueta_pry.fileIntroduccion[0].archivo.length > (long_name_file+4)">
                                            {{respueta_pry.fileIntroduccion[0].name.archivo(0,long_name_file)}} .... {{respueta_pry.fileIntroduccion[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{respueta_pry.fileIntroduccion[0].archivo}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileIntroduccion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileIntroduccion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border">Visualizar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(respueta_pry.fileIntroduccion[0],3)">Reemplazar</vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeI == 0" type="file" id="fileI" ref="fileI" v-on:change="handleUploads(1)" />
                            <div class="v-row text-left" v-if="porcentajeI>0">
                                <vs-progress style="height:25px" :percent="porcentajeI" color="success"> {{porcentajeI}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1I != '' "> {{msj1I}} <br></small>
                            <small class="text-danger" v-if="msj2I != '' "> {{msj2I}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full alto" v-model="respueta_pry.introduccion"></quill-editor>
            </div>
            <div v-if="valor==2">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Adjuntar archivo: </div>
                        <div v-if="respueta_pry.fileTarea != '' && respueta_pry.fileTarea !== null " class="m-1">
                            <div v-if="respueta_pry.fileTarea.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="respueta_pry.fileTarea[0].archivo.length < long_name_file"> {{respueta_pry.fileTarea[0].archivo}} </label>
                                    <label v-else>
                                        <span v-if="respueta_pry.fileTarea[0].archivo.length > (long_name_file+4)">
                                            {{respueta_pry.fileTarea[0].archivo.substr(0,long_name_file)}} .... {{respueta_pry.fileTarea[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{respueta_pry.fileTarea[0].archivo}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileTarea[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileTarea[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border">Visualizar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(respueta_pry.fileTarea[0],4)">Reemplazar</vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeT == 0" type="file" id="fileT" ref="fileT" v-on:change="handleUploads(2)" />
                            <div class="v-row text-left" v-if="porcentajeT>0">
                                <vs-progress style="height:25px" :percent="porcentajeT" color="success"> {{porcentajeT}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1T != '' "> {{msj1T}} <br></small>
                            <small class="text-danger" v-if="msj2T != '' "> {{msj2T}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full alto" v-model="respueta_pry.tareas"></quill-editor>
            </div>
            <div v-if="valor==3">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Adjuntar archivo: </div>
                        <div v-if="respueta_pry.fileProceso != '' && respueta_pry.fileProceso !== null " class="m-1">
                            <div v-if="respueta_pry.fileProceso.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="respueta_pry.fileProceso[0].archivo.length < long_name_file"> {{respueta_pry.fileProceso[0].archivo}} </label>
                                    <label v-else>
                                        <span v-if="respueta_pry.fileProceso[0].archivo.length > (long_name_file+4)">
                                            {{respueta_pry.fileProceso[0].archivo.substr(0,long_name_file)}} .... {{respueta_pry.fileProceso[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{respueta_pry.fileProceso[0].archivo}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileProceso[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileProceso[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border">Visualizar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(respueta_pry.fileProceso[0],5)">Reemplazar</vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeP == 0" type="file" id="fileP" ref="fileP" v-on:change="handleUploads(3)" />
                            <div class="v-row text-left" v-if="porcentajeP>0">
                                <vs-progress style="height:25px" :percent="porcentajeP" color="success"> {{porcentajeP}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1P != '' "> {{msj1P}} <br></small>
                            <small class="text-danger" v-if="msj2P != '' "> {{msj2P}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full alto" v-model="respueta_pry.proceso"></quill-editor>
            </div>
            <div v-if="valor==4">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Adjuntar archivo: </div>
                        <div v-if="respueta_pry.fileRecurso != '' && respueta_pry.fileRecurso !== null " class="m-1">
                            <div v-if="respueta_pry.fileRecurso.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="respueta_pry.fileRecurso[0].archivo.length < long_name_file"> {{respueta_pry.fileRecurso[0].archivo}} </label>
                                    <label v-else>
                                        <span v-if="respueta_pry.fileRecurso[0].archivo.length > (long_name_file+4)">
                                            {{respueta_pry.fileRecurso[0].archivo.substr(0,long_name_file)}} .... {{respueta_pry.fileRecurso[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{respueta_pry.fileRecurso[0].archivo}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileRecurso[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileRecurso[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border">Visualizar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(respueta_pry.fileRecurso[0],6)">Reemplazar</vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeR == 0" type="file" id="fileR" ref="fileR" v-on:change="handleUploads(4)" />
                            <div class="v-row text-left" v-if="porcentajeR>0">
                                <vs-progress style="height:25px" :percent="porcentajeR" color="success"> {{porcentajeR}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1R != '' "> {{msj1R}} <br></small>
                            <small class="text-danger" v-if="msj2R != '' "> {{msj2R}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full alto" v-model="respueta_pry.recursos"></quill-editor>
            </div>
            <div v-if="valor==5">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Adjuntar archivo: </div>
                        <div v-if="respueta_pry.fileEvaluacion != '' && respueta_pry.fileEvaluacion !== null " class="m-1">
                            <div v-if="respueta_pry.fileEvaluacion.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="respueta_pry.fileEvaluacion[0].archivo.length < long_name_file"> {{respueta_pry.fileEvaluacion[0].archivo}} </label>
                                    <label v-else>
                                        <span v-if="respueta_pry.fileEvaluacion[0].archivo.length > (long_name_file+4)">
                                            {{respueta_pry.fileEvaluacion[0].archivo.substr(0,long_name_file)}} .... {{respueta_pry.fileEvaluacion[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{respueta_pry.fileEvaluacion[0].archivo}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileEvaluacion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileEvaluacion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border">Visualizar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(respueta_pry.fileEvaluacion[0],7)">Reemplazar</vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeE == 0" type="file" id="fileE" ref="fileE" v-on:change="handleUploads(5)" />
                            <div class="v-row text-left" v-if="porcentajeE>0">
                                <vs-progress style="height:25px" :percent="porcentajeE" color="success"> {{porcentajeE}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1E != '' "> {{msj1E}} <br></small>
                            <small class="text-danger" v-if="msj2E != '' "> {{msj2E}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full alto" v-model="respueta_pry.evaluacion"></quill-editor>
            </div>
            <div v-if="valor==6">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Adjuntar archivo: </div>
                        <div v-if="respueta_pry.fileConclusion != '' && respueta_pry.fileConclusion !== null " class="m-1">
                            <div v-if="respueta_pry.fileConclusion.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="respueta_pry.fileConclusion[0].archivo.length < long_name_file"> {{respueta_pry.fileConclusion[0].archivo}} </label>
                                    <label v-else>
                                        <span v-if="respueta_pry.fileConclusion[0].archivo.length > (long_name_file+4)">
                                            {{respueta_pry.fileConclusion[0].archivo.substr(0,long_name_file)}} .... {{respueta_pry.fileConclusion[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{respueta_pry.fileConclusion[0].archivo}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(respueta_pry.fileConclusion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border">Descargar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(respueta_pry.fileConclusion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border">Visualizar</vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(respueta_pry.fileConclusion[0],8)">Reemplazar</vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeC == 0" type="file" id="fileC" ref="fileC" v-on:change="handleUploads(6)" />
                            <div class="v-row text-left" v-if="porcentajeC>0">
                                <vs-progress style="height:25px" :percent="porcentajeC" color="success"> {{porcentajeC}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1C != '' "> {{msj1C}} <br></small>
                            <small class="text-danger" v-if="msj2C != '' "> {{msj2C}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full alto" v-model="respueta_pry.conclusiones"></quill-editor>
            </div>
        </div>
        <vs-button color="primary" type="border" icon-pack="feather" @click="subirArchivoIntroduccion()" icon="icon-save">Guardar y cerrar</vs-button>
    </vs-popup>

</div>
</template>

<script>
import "quill/dist/quill.core.css";
import "quill/dist/quill.snow.css";
import "quill/dist/quill.bubble.css";
import {
    quillEditor
} from "vue-quill-editor";
import Vue from "vue";
import axios from "axios";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import Datepicker from "vuejs-datepicker";
import flatPickr from "vue-flatpickr-component";
import "flatpickr/dist/flatpickr.css";
import StarRating from "vue-star-rating";
import {
    getIdFromUrl
} from "vue-youtube";
import VueYoutube from "vue-youtube";
Vue.use(VueYoutube);
Vue.use(axios);
export default {
    components: {
        StarRating,
        quillEditor,
        flatPickr,
        'v-select': vSelect,
    },
    data() {
        return {
            archivo: {
                'name': ''
            },
            archivodocente: {
                'name': ''
            },
            proyectos_asignaturas: [],
            idusuario: '',
            asignatura: '',
            nombre: '',
            descripcion: '',
            introduccion: '',
            tareas: '',
            proceso: '',
            recursos: '',
            evaluacion: '',
            conclusiones: '',
            creditos: '',
            estado: '',
            edita_local_WQ: '',
            edita: '',
            tipoProy: true,
            valor: 0,
            grupo_usuario: 0,
            id_proyecto: '',
            modalRespuestas: false,
            r_introduccion: '',
            r_tareas: '',
            r_proceso: '',
            r_recursos: '',
            r_evaluacion: '',
            r_conclusiones: '',
            titulo: '',
            // respueta_pry: [],
            id_resp_proyecto: '',
            datos: {
                'user_nombres': '',
                'user_apellidos': '',
                'user_email': '',
                'user_cedula': '',
                'user_idusuario': '',
                'user_name_usuario': '',
                'user_institucion': '',
                'user_grupo': '',
            },
            proyectos: {
                'nombre': '',
                'descripcion': '',
                'archivo': '',
                'archivodocente': '',
                'idusuario': '',
                'asignatura': {},
                'proyectos_asignaturas': [],
                'introduccion': '',
                'tareas': '',
                'proceso': '',
                'recursos': '',
                'evaluacion': '',
                'conclusiones': '',
                'creditos': '',
                'estado': '',
                'grupo_usuario': '',
                'fileIntroduccion': '',
                'fileTarea': '',
                'fileProceso': '',
                'fileRecurso': '',
                'fileEvaluacion': '',
                'fileConclusion': '',
                'asignaturas':'',
                'fileDocentes':'',
                'fileEstudiante':'',
            },
            respueta_pry: {
                'introduccion': '',
                'tareas': '',
                'proceso': '',
                'recursos': '',
                'evaluacion': '',
                'conclusiones': '',
                'fileIntroduccion': '',
                'fileTarea': '',
                'fileProceso': '',
                'fileRecurso': '',
                'fileEvaluacion': '',
                'fileConclusion': '',
            },
            long_name_file: 30, //cantidad maxima de caracteres a mostrar en el nombre del archivo
            limiteMegas: 10, //permitir maximo de megas
            bytes: 1048576, //para calculo de megas
            msj1I: '',
            msj2I: '',
            porcentajeI: 0,
            muyPesadoI: false,
            pesoArchivoI: 0,
            no_permitidoI: false,
            fileI: '',

            msj1T: '',
            msj2T: '',
            porcentajeT: 0,
            muyPesadoT: false,
            pesoArchivoT: 0,
            no_permitidoT: false,
            fileT: '',

            msj1P: '',
            msj2P: '',
            porcentajeP: 0,
            muyPesadoP: false,
            pesoArchivoP: 0,
            no_permitidoP: false,
            fileP: '',

            msj1R: '',
            msj2R: '',
            porcentajeR: 0,
            muyPesadoR: false,
            pesoArchivoR: 0,
            no_permitidoR: false,
            fileR: '',

            msj1E: '',
            msj2E: '',
            porcentajeE: 0,
            muyPesadoE: false,
            pesoArchivoE: 0,
            no_permitidoE: false,
            fileE: '',

            msj1C: '',
            msj2C: '',
            porcentajeC: 0,
            muyPesadoC: false,
            pesoArchivoC: 0,
            no_permitidoC: false,
            fileC: '',

            ocultar_pendiente: false,

            mensajePeso: 'El archivo que intenta cargar excede el peso permitido, favor verifique para continuar.',
            mensajeArchivo: 'El tipo de archivo que intenta enviar, no esta permitido, favor verifique',

            miusuario: '',
            webQ: '',
            nombreAsignatura: '',
        }
    },
    mounted() {

        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.miusuario = this.usuario
        this.grupo_usuario = this.miusuario.id_group
        this.edita = localStorage.getItem('edita'); //edicion del webquest
        this.webQ = JSON.parse(localStorage.getItem('webq'));
        // console.log(this.webQ)

        this.proyecto = JSON.parse(localStorage.getItem("curso_proyecto"));
        // recopilar datos del estudiante
        this.datos.user_nombres = this.miusuario.nombres
        this.datos.user_apellidos = this.miusuario.apellidos
        this.datos.user_email = this.miusuario.email
        this.datos.user_cedula = this.miusuario.cedula
        this.datos.user_idusuario = this.miusuario.idusuario
        this.datos.user_name_usuario = this.miusuario.name_usuario
        this.datos.user_institucion = this.miusuario.institucion_idInstitucion
        this.datos.user_grupo = this.miusuario.id_group
        // id del proyecto
        this.id_proyecto = this.webQ.proyecto_id
        this.getProyecto();
        this.verificarRespuesta();

    },
    methods: {
        getProyecto() {
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'proyectos/' + me.id_proyecto)
            // axios.get('https://foro.prolipadigital.com.ec/proyectos/' + me.id_proyecto)
                .then(res => {
                    me.$vs.loading.close()
                    let datos = res.data.files
                    //files
                    let fDocente      = []
                    let fEstudiante   = []
                    let fIntroduccion = []
                    let fTarea        = []
                    let fProceso      = []
                    let fRecurso      = []
                    let fEvaluacion   = []
                    let fConclusion   = []
                    fDocente       =  datos.filter(p => p.tipo == 1)
                    fEstudiante    =  datos.filter(p => p.tipo == 2)
                    fIntroduccion  =  datos.filter(p => p.tipo == 3)
                    fTarea         =  datos.filter(p => p.tipo == 4)
                    fProceso       =  datos.filter(p => p.tipo == 5)
                    fRecurso       =  datos.filter(p => p.tipo == 6)
                    fEvaluacion    =  datos.filter(p => p.tipo == 7)
                    fConclusion    =  datos.filter(p => p.tipo == 8)
                    me.proyectos.descripcion = res.data.descripcion
                    me.proyectos.nombre = res.data.nombre
                    me.proyectos.asignaturas = res.data.asignaturas
                    //descripcion
                    me.proyectos.introduccion  = res.data.introduccion
                    me.proyectos.tareas = res.data.tarea 
                    me.proyectos.proceso = res.data.proceso 
                    me.proyectos.recursos = res.data.recurso
                    me.proyectos.evaluacion = res.data.evaluacion
                    me.proyectos.conclusiones = res.data.conclusion 
                    me.proyectos.creditos = res.data.creditos 
                    //FILES
                    me.proyectos.fileDocentes      = fDocente
                    me.proyectos.fileEstudiante    = fEstudiante
                    me.proyectos.fileIntroduccion  = fIntroduccion
                    me.proyectos.fileTarea         = fTarea
                    me.proyectos.fileProceso       = fProceso
                    me.proyectos.fileRecurso       = fRecurso
                    me.proyectos.fileEvaluacion    = fEvaluacion
                    me.proyectos.fileConclusion    = fConclusion
                })
                .catch(e => {
                    console.log('no se conecto a los proyectos ' + e)
                    me.$vs.loading.close()
                })
        },
        verificarRespuesta() {
            let me = this;
            this.$http.get(this.$server_url+'proyectos?respuestaEstudiante=yes&proyecto_id=' + me.id_proyecto+'&idusuario=' + me.miusuario.idusuario)
            // axios.get('https://foro.prolipadigital.com.ec/respuestas-proyectos?idproyecto=' + me.id_proyecto + '&idusuario=' + me.miusuario.idusuario)
                .then(function (res) {
                    if (res.data.length > 0) {
                        let getDatos = res.data[0]
                        // me.respueta_pry = res.data[0]
                        me.id_resp_proyecto = res.data[0].id
                          let datos = res.data[0].files
                        //files
                        let fIntroduccion = []
                        let fTarea        = []
                        let fProceso      = []
                        let fRecurso      = []
                        let fEvaluacion   = []
                        let fConclusion   = []
                        fIntroduccion  =  datos.filter(p => p.tipo == 3)
                        fTarea         =  datos.filter(p => p.tipo == 4)
                        fProceso       =  datos.filter(p => p.tipo == 5)
                        fRecurso       =  datos.filter(p => p.tipo == 6)
                        fEvaluacion    =  datos.filter(p => p.tipo == 7)
                        fConclusion    =  datos.filter(p => p.tipo == 8)
                        //descripcion
                        me.respueta_pry.introduccion  = getDatos.introduccion
                        me.respueta_pry.tareas = getDatos.tarea 
                        me.respueta_pry.proceso = getDatos.proceso 
                        me.respueta_pry.recursos = getDatos.recurso
                        me.respueta_pry.evaluacion = getDatos.evaluacion
                        me.respueta_pry.conclusiones = getDatos.conclusion 
                        //FILES
                        me.respueta_pry.fileIntroduccion  = fIntroduccion
                        me.respueta_pry.fileTarea         = fTarea
                        me.respueta_pry.fileProceso       = fProceso
                        me.respueta_pry.fileRecurso       = fRecurso
                        me.respueta_pry.fileEvaluacion    = fEvaluacion
                        me.respueta_pry.fileConclusion    = fConclusion
                        // console.log(me.id_resp_proyecto )
                        me.fileI = '';
                        window.$("#fileI").val('');
                        me.fileT = '';
                        window.$("#fileT").val('');
                        me.fileP = '';
                        window.$("#fileP").val('');
                        me.fileR = '';
                        window.$("#fileR").val('');
                        me.fileE = '';
                        window.$("#fileE").val('');
                        me.fileC = '';
                        window.$("#fileC").val('');
                    }
                })
                .catch(function (error) {
                    console.log(error + ' AUN NO TIENE RESPUESTAS')
                })
        },
        responder() {
            let me = this;
            me.modalRespuestas = true;
            switch (me.valor) {
                case 1:
                    me.titulo = 'Responder la introducción';
                    break;
                case 2:
                    me.titulo = 'Responder la tarea';
                    break;
                case 3:
                    me.titulo = 'Responder el proceso';
                    break;
                case 4:
                    me.titulo = 'Responder el recurso';
                    break;
                case 5:
                    me.titulo = 'Responder la evaluación';
                    break;
                default:
                    me.titulo = 'Responder la conclusion';
                    break;
            }
        },
        handleUploads(value) {
            if (value == 1) {
                this.no_permitidoI = false;
                this.msj1I = '';
                this.msj2I = '';
                this.porcentajeI = 0;
                this.pesoArchivoI = 0;
                this.muyPesadoI = false;
                this.fileI = this.$refs.fileI.files[0];
                // verificar tamaño de archivo
                this.pesoArchivoI = (this.fileI.size / this.bytes).toFixed(2);
                if (this.pesoArchivoI > this.limiteMegas) {
                    this.muyPesadoI = true;
                    this.msj1I = this.mensajePeso;
                }
                if (this.fileI.type == 'application/x-msdownload') {
                    this.no_permitidoI = true;
                    this.msj2I = this.mensajeArchivo;
                }
            }
            if (value == 2) {
                this.no_permitidoT = false;
                this.msj1T = '';
                this.msj2T = '';
                this.porcentajeT = 0;
                this.pesoArchivoT = 0;
                this.muyPesadoT = false;
                this.fileT = this.$refs.fileT.files[0];
                // verificar tamaño de archivo
                this.pesoArchivoT = (this.fileT.size / this.bytes).toFixed(2);
                if (this.pesoArchivoT > this.limiteMegas) {
                    this.muyPesadoT = true;
                    this.msj1T = this.mensajePeso;
                }
                if (this.fileT.type == 'application/x-msdownload') {
                    this.no_permitidoT = true;
                    this.msj2T = this.mensajeArchivo;
                }
            }
            if (value == 3) {
                this.no_permitidoP = false;
                this.msj1P = '';
                this.msj2P = '';
                this.porcentajeP = 0;
                this.pesoArchivoP = 0;
                this.muyPesadoP = false;
                this.fileP = this.$refs.fileP.files[0];
                // verificar tamaño de archivo
                this.pesoArchivoP = (this.fileP.size / this.bytes).toFixed(2);
                if (this.pesoArchivoP > this.limiteMegas) {
                    this.muyPesadoP = true;
                    this.msj1P = this.mensajePeso;
                }
                if (this.fileP.type == 'application/x-msdownload') {
                    this.no_permitidoP = true;
                    this.msj2P = this.mensajeArchivo;
                }
            }
            if (value == 4) {
                this.no_permitidoR = false;
                this.msj1R = '';
                this.msj2R = '';
                this.porcentajeR = 0;
                this.pesoArchivoR = 0;
                this.muyPesadoR = false;
                this.fileR = this.$refs.fileR.files[0];
                // verificar tamaño de archivo
                this.pesoArchivoR = (this.fileR.size / this.bytes).toFixed(2);
                if (this.pesoArchivoR > this.limiteMegas) {
                    this.muyPesadoR = true;
                    this.msj1R = this.mensajePeso;
                }
                if (this.fileR.type == 'application/x-msdownload') {
                    this.no_permitidoR = true;
                    this.msj2R = this.mensajeArchivo;
                }
            }
            if (value == 5) {
                this.no_permitidoE = false;
                this.msj1E = '';
                this.msj2E = '';
                this.porcentajeE = 0;
                this.pesoArchivoE = 0;
                this.muyPesadoE = false;
                this.fileE = this.$refs.fileE.files[0];
                // verificar tamaño de archivo
                this.pesoArchivoE = (this.fileE.size / this.bytes).toFixed(2);
                if (this.pesoArchivoE > this.limiteMegas) {
                    this.muyPesadoE = true;
                    this.msj1E = this.mensajePeso;
                }
                if (this.fileE.type == 'application/x-msdownload') {
                    this.no_permitidoE = true;
                    this.msj2E = this.mensajeArchivo;
                }
            }
            if (value == 6) {
                this.no_permitidoC = false;
                this.msj1C = '';
                this.msj2C = '';
                this.porcentajeC = 0;
                this.pesoArchivoC = 0;
                this.muyPesadoC = false;
                this.fileC = this.$refs.fileC.files[0];
                // verificar tamaño de archivo
                this.pesoArchivoC = (this.fileC.size / this.bytes).toFixed(2);
                if (this.pesoArchivoC > this.limiteMegas) {
                    this.muyPesadoC = true;
                    this.msj1C = this.mensajePeso;
                }
                if (this.fileC.type == 'application/x-msdownload') {
                    this.no_permitidoC = true;
                    this.msj2C = this.mensajeArchivo;
                }
            }
        },
        subirArchivoIntroduccion() {
            let me = this;
            if (me.muyPesadoI || me.muyPesadoT || me.muyPesadoP || me.muyPesadoR || me.muyPesadoE || me.muyPesadoC) {
                me.$vs.notify({
                    time: 5000,
                    text: 'El archivo que intenta enviar es muy pesado, favor verifique',
                    color: 'warning',
                    icon: 'icon-alert-triangle',
                    iconPack: 'feather'
                })
                return
            }

            let formData = new FormData();
            formData.append('id',          me.id_resp_proyecto)
            formData.append('proyecto_id', me.id_proyecto)
            formData.append('curso',       localStorage.codigo_curso)
            formData.append('idusuario',   me.miusuario.idusuario)
            formData.append('asignatura_id',localStorage.idasignatura)
            formData.append('grupo_usuario',"4")
            formData.append('respuesta',"1")
            //DESCRIPCION
            formData.append('introduccion', me.respueta_pry.introduccion)
            formData.append('tarea',        me.respueta_pry.tareas)
            formData.append('proceso',      me.respueta_pry.proceso)
            formData.append('recurso',      me.respueta_pry.recursos)
            formData.append('evaluacion',   me.respueta_pry.evaluacion)
            formData.append('conclusion',   me.respueta_pry.conclusiones)
            //FILES
            formData.append('fileIntroduccion',me.fileI);
            formData.append('fileTarea',       me.fileT);
            formData.append('fileProceso',     me.fileP);
            formData.append('fileRecurso',     me.fileR);
            formData.append('fileEvaluacion',  me.fileE);
            formData.append('fileConclusion',  me.fileC);
            me.$vs.loading()
            axios.post(this.$data_url+'api/proyectos',formData,{
             // axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                onUploadProgress: uploadEvent => {
                    if (me.pesoArchivoI > 0) {
                        me.porcentajeI = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                    }
                }
            })
            .then(function (response) {
                 me.$vs.loading.close()
                // me.respueta_pry.fileintroduccion = response.data[0].id
                me.$vs.notify({
                    text: 'Archivo INTRODUCCIÓN, cargado correctamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.modalRespuestas = false;
                me.verificarRespuesta();
                    
               
            })
            .catch(error => {
                console.log(' no hay archivo para la introduccion')
                // me.subirArchivoTarea();
                
                me.$vs.loading.close()
            })
           
        },
      
        
        // subirArchivoTarea() {
        //     let me = this;
        //     let formData = new FormData();
        //     formData.append('files', me.fileT);
        //     if (me.fileT != '') {
        //         me.$vs.loading()
        //         axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
        //                 onUploadProgress: uploadEvent => {
        //                     if (me.pesoArchivoT > 0) {
        //                         me.porcentajeT = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
        //                     }
        //                 }
        //             })
        //             .then(function (response) {
        //                 me.respueta_pry.filetareas = response.data[0].id
        //                 me.$vs.notify({
        //                     text: 'Archivo TAREA, cargado correctamente',
        //                     color: 'success',
        //                     iconPack: 'feather',
        //                     icon: 'icon-alert-triangle'
        //                 })
        //                 // me.subirArchivoProceso();
        //                 me.$vs.loading.close()
        //             })
        //             .catch(error => {
        //                 console.log(' no hay archivo para la tarea')
        //                 // me.subirArchivoProceso();
        //                 me.$vs.loading.close()
        //             })
        //     } else {
        //         // me.subirArchivoProceso();
        //     }
        // },
        // subirArchivoProceso() {
        //     let me = this;
        //     let formData = new FormData();
        //     formData.append('files', me.fileP);
        //     if (me.fileP != '') {
        //         me.$vs.loading()
        //         axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
        //                 onUploadProgress: uploadEvent => {
        //                     if (me.pesoArchivoP > 0) {
        //                         me.porcentajeP = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
        //                     }
        //                 }
        //             })
        //             .then(function (response) {
        //                 me.respueta_pry.fileproceso = response.data[0].id
        //                 me.$vs.notify({
        //                     text: 'Archivo PROCESO, cargado correctamente',
        //                     color: 'success',
        //                     iconPack: 'feather',
        //                     icon: 'icon-alert-triangle'
        //                 })
        //                 me.subirArchivoRecurso();
        //                 me.$vs.loading.close()
        //             })
        //             .catch(error => {
        //                 console.log(' no hay archivo para el proceso')
        //                 me.subirArchivoRecurso();
        //                 me.$vs.loading.close()
        //             })
        //     } else {
        //         me.subirArchivoRecurso();
        //     }
        // },
        // subirArchivoRecurso() {
        //     let me = this;
        //     let formData = new FormData();
        //     formData.append('files', me.fileR);
        //     if (me.fileR != '') {
        //         me.$vs.loading()
        //         axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
        //                 onUploadProgress: uploadEvent => {
        //                     if (me.pesoArchivoR > 0) {
        //                         me.porcentajeR = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
        //                     }
        //                 }
        //             })
        //             .then(function (response) {
        //                 me.proyectos.filerecursos = response.data[0].id
        //                 me.$vs.notify({
        //                     text: 'Archivo RECURSO, cargado correctamente',
        //                     color: 'success',
        //                     iconPack: 'feather',
        //                     icon: 'icon-alert-triangle'
        //                 })
        //                 me.subirArchivoEvaluacion();
        //                 me.$vs.loading.close()
        //             })
        //             .catch(error => {
        //                 console.log(' no hay archivo para el recurso')
        //                 me.subirArchivoEvaluacion();
        //                 me.$vs.loading.close()
        //             })
        //     } else {
        //         me.subirArchivoEvaluacion();
        //     }
        // },
        // subirArchivoEvaluacion() {
        //     let me = this;
        //     let formData = new FormData();
        //     formData.append('files', me.fileE);
        //     if (me.fileE != '') {
        //         me.$vs.loading()
        //         axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
        //                 onUploadProgress: uploadEvent => {
        //                     if (me.pesoArchivoE > 0) {
        //                         me.porcentajeE = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
        //                     }
        //                 }
        //             })
        //             .then(function (response) {
        //                 me.respueta_pry.filevaluacion = response.data[0].id
        //                 me.$vs.notify({
        //                     text: 'Archivo EVALUACION, cargado correctamente',
        //                     color: 'success',
        //                     iconPack: 'feather',
        //                     icon: 'icon-alert-triangle'
        //                 })
        //                 me.subirArchivoConclusion();
        //                 me.$vs.loading.close()
        //             })
        //             .catch(error => {
        //                 console.log(' no hay archivo para la evaluacion')
        //                 me.subirArchivoConclusion();
        //                 me.$vs.loading.close()
        //             })
        //     } else {
        //         me.subirArchivoConclusion();
        //     }
        // },
        // subirArchivoConclusion() {
        //     let me = this;
        //     let formData = new FormData();
        //     formData.append('files', me.fileC);
        //     if (me.fileC != '') {
        //         me.$vs.loading()
        //         axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
        //                 onUploadProgress: uploadEvent => {
        //                     if (me.pesoArchivoC > 0) {
        //                         me.porcentajeC = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
        //                     }
        //                 }
        //             })
        //             .then(function (response) {
        //                 me.respueta_pry.fileconclusiones = response.data[0].id
        //                 me.$vs.notify({
        //                     text: 'Archivo CONCLUSION, cargado correctamente',
        //                     color: 'success',
        //                     iconPack: 'feather',
        //                     icon: 'icon-alert-triangle'
        //                 })
        //                 me.guardar_cerrar();
        //                 me.$vs.loading.close()
        //             })
        //             .catch(error => {
        //                 console.log(' no hay archivo para la conclusion')
        //                 me.guardar_cerrar();
        //                 me.$vs.loading.close()
        //             })
        //     } else {
        //         me.guardar_cerrar();
        //     }
        // },
        // guardar_cerrar() {
        //     let me = this;
        //     me.$vs.loading();
        //     // console.log(me.edita_local_WQ.id, me.miusuario.idusuario)

        //     if (me.id_resp_proyecto != '') {
        //         axios.put('https://foro.prolipadigital.com.ec/respuestas-proyectos/' + me.id_resp_proyecto, {
        //                 idusuario: me.miusuario.idusuario,
        //                 idasignatura: me.webQ.idasignatura,
        //                 introduccion: me.respueta_pry.introduccion,
        //                 tareas: me.respueta_pry.tareas,
        //                 proceso: me.respueta_pry.proceso,
        //                 recursos: me.respueta_pry.recursos,
        //                 evaluacion: me.respueta_pry.evaluacion,
        //                 conclusiones: me.respueta_pry.conclusiones,
        //                 fileintroduccion: me.respueta_pry.fileintroduccion,
        //                 filetareas: me.respueta_pry.filetareas,
        //                 fileproceso: me.respueta_pry.fileproceso,
        //                 filerecursos:me.proyectos.filerecursos,
        //                 filevaluacion: me.respueta_pry.filevaluacion,
        //                 fileconclusiones: me.respueta_pry.fileconclusiones,
        //                 datos: me.datos,
        //                 curso: me.webQ.curso
        //             })
        //             .then(function (response) {
        //                 me.respueta_pry = response.data
        //                 me.verificarRespuesta();
        //                 // console.log(me.respueta_pry);
        //                 me.$vs.notify({
        //                     text: 'Respuesta editada correctamente',
        //                     color: 'success',
        //                     iconPack: 'feather',
        //                     icon: 'icon-check'
        //                 })
        //                 me.modalRespuestas = false;
        //                 me.$vs.loading.close()
        //             })
        //             .catch(function (error) {
        //                 console.log(error + ' NO SE EDITA')
        //                 me.$vs.loading.close()
        //             })

        //     } else {
        //         axios.post("https://foro.prolipadigital.com.ec/respuestas-proyectos", {
        //                 idproyecto: me.id_proyecto,
        //                 idusuario: me.miusuario.idusuario,
        //                 idasignatura: me.webQ.idasignatura,
        //                 introduccion: me.respueta_pry.introduccion,
        //                 tareas: me.respueta_pry.tareas,
        //                 proceso: me.respueta_pry.proceso,
        //                 recursos: me.respueta_pry.recursos,
        //                 evaluacion: me.respueta_pry.evaluacion,
        //                 conclusiones: me.respueta_pry.conclusiones,
        //                 fileintroduccion: me.respueta_pry.fileintroduccion,
        //                 filetareas: me.respueta_pry.filetareas,
        //                 fileproceso: me.respueta_pry.fileproceso,
        //                 filerecursos:me.proyectos.filerecursos,
        //                 filevaluacion: me.respueta_pry.filevaluacion,
        //                 fileconclusiones: me.respueta_pry.fileconclusiones,
        //                 datos: me.datos,
        //                 curso: me.webQ.curso
        //             })
        //             .then(function (response) {
        //                 me.verificarRespuesta();
        //                 me.$vs.notify({
        //                     text: 'Respuesta registrada correctamente',
        //                     color: 'success',
        //                     iconPack: 'feather',
        //                     icon: 'icon-alert-triangle'
        //                 })
        //                 me.modalRespuestas = false;
        //                 me.$vs.loading.close()
        //             })
        //             .catch(error => {
        //                 me.$vs.loading.close()
        //             })
        //     }
        // },
        descargaArchivo(item) {
            // console.log(item)
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = me.proyectos.asignaturas[0].asignatura_id;
            let h_nombreasignatura = me.proyectos.asignaturas[0].nombreasignatura;
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'descargar',
                'recurso_tipo': 'proyecto',
                'recurso_nombre': me.proyectos.nombre,
                'recurso_detalle': item.archivo,
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
           if (this.grupo_usuario == 9) {
                this.$vs.notify({
                    text: 'El archivo no esta disponible en la version DEMO',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let url2 = this.$data_url+'archivos/proyectos/'+item.url
            window.open(url2) 
            // this.$vs.loading();
            // axios({
            //         url: this.$server_url+'proyectoImagen/' + item.url,
            //         method: 'GET',
            //         responseType: 'blob',
            //     })
            //     .then((response) => {
            //         var fileURL = window.URL.createObjectURL(new Blob([response.data]));
            //         var fileLink = document.createElement('a');

            //         fileLink.href = fileURL;
            //         fileLink.setAttribute('download', item.archivo);
            //         // fileLink.setAttribute('download', item.archivo + item.ext);
            //         document.body.appendChild(fileLink);

            //         fileLink.click();
            //         this.$vs.notify({
            //             time: 6000,
            //             text: 'El archivo se esta descargando',
            //             color: 'success',
            //             iconPack: 'feather',
            //             icon: 'icon-check'
            //         })
            //         this.$vs.loading.close();
            //     })
            //     .catch(error => {
            //         this.$vs.notify({
            //             text: 'Error en la descarga del archivo',
            //             color: 'warning',
            //             iconPack: 'feather',
            //             icon: 'icon-alert-triangle'
            //         })
            //         this.$vs.loading.close();
            //     })
        },
        visualizar(item) {
            // console.log(item)

            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = me.proyectos.asignaturas[0].asignaturas_id;
            let h_nombreasignatura = me.proyectos.asignaturas[0].nombreasignatura;
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'proyecto',
                'recurso_nombre': me.proyectos.nombre,
                'recurso_detalle': item.archivo,
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            if (item.url.substr(-3) == "pdf" || item.url.substr(-3) == "png" || item.url.substr(-3) == "jpg" || item.url.substr(-3) == "PNG") {
                window.open(this.$data_url+'archivos/proyectos/' + item.url, '_blank');
            } else if ( item.url.substr(-3) == "doc" || item.url.substr(-3) == "ocx" || item.url.substr(-3) == "xls" || item.url.substr(-3) == "lsx" ) {
                window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url+'archivos/proyectos/' + item.url, '_blank');
            }

            // if (item.mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
            //     window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url + item.url)
            // } else if (item.mime = "application/pdf") {
            //     if (item.height != null && item.width != null) {
            //         //si tiene alto y ancho, es una imagen
            //         window.open(+this.$data_url + item.url);
            //     } else {
            //         window.open('https://docs.google.com/viewer?url='+this.$data_url + item.url);
            //     }
            // } else {
            //     this.$vs.notify({
            //         text: 'El archivo no puede ser visualizado, por favor proceda con la descarga',
            //         color: 'warning',
            //         iconPack: 'feather',
            //         icon: 'icon-alert-triangle'
            //     })
            // }
        },
        openConfirmEliminar(item, tipo_elim) {
            let me = this;
            me.file_eliminar = item
            me.tipo_eliminar = tipo_elim; //1-> archivo docente. 2-> archivo estudiante
            // console.log(me.file_eliminar,me.tipo_eliminar)
            // return
            me.modalRespuestas = false;
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: 'Este archivo será eliminado, para cargar el nuevo archivo.',
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.eliminarArchivo,
                cancel: me.f_mostrar_modal,
            })
        },
        f_mostrar_modal() {
            let me = this;
            me.modalRespuestas = true
        },
        eliminarArchivo() {
            let me = this;
            // console.log(me.archivo)
            me.$vs.loading()
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = me.webQ.asignatura_id;
            let h_nombreasignatura = me.webQ.nombreasignatura;
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'eliminar',
                'recurso_tipo': 'proyecto',
                'recurso_nombre': me.webQ.nombre,
                'recurso_detalle': me.file_eliminar.archivo,
                'curso': me.webQ.curso,
                'idproyecto': me.webQ.proyecto_id,
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            axios.get(this.$data_url+'api/proyectos/file/eliminar?id='+me.file_eliminar.id)
            // axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.file_eliminar.id)
                .then(function (res) {
                    if (me.tipo_eliminar == 3) { //elimina archivo INTRODUCCION
                        me.porcentajeI = 0;
                        me.pesoArchivoI = 0;
                        me.respueta_pry.fileIntroduccion = '';
                        me.fileI = '';
                        window.$("#fileI").val('');
                    }
                    if (me.tipo_eliminar == 4) { //elimina archivo TAREA
                        me.porcentajeT = 0;
                        me.pesoArchivoT = 0;
                        me.respueta_pry.fileTarea = '';
                        me.fileT = '';
                        window.$("#fileT").val('');
                    }
                    if (me.tipo_eliminar == 5) { //elimina archivo PROCESO
                        me.porcentajeP = 0;
                        me.pesoArchivoP = 0;
                        me.respueta_pry.fileProceso = '';
                        me.fileP = '';
                        window.$("#fileP").val('');
                    }
                    if (me.tipo_eliminar == 6) { //elimina archivo RECURSO
                        me.porcentajeR = 0;
                        me.pesoArchivoR = 0;
                        me.respueta_pry.fileRecurso = '';
                        me.fileR = '';
                        window.$("#fileR").val('');
                    }
                    if (me.tipo_eliminar == 7) { //elimina archivo EVALUACION
                        me.porcentajeE = 0;
                        me.pesoArchivoE = 0;
                        me.respueta_pry.fileEvaluacion = '';
                        me.fileE = '';
                        window.$("#fileE").val('');
                    }
                    if (me.tipo_eliminar == 8) { //elimina archivo CONCLUSION
                        me.porcentajeC = 0;
                        me.pesoArchivoC = 0;
                        me.respueta_pry.fileConclusion = '';
                        me.fileC = '';
                        window.$("#fileC").val('');
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
                    me.$vs.notify({
                        text: 'No se eliminó el archivo',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                })
            me.modalRespuestas = true;
        },
        volver() {
            let me = this;
            me.$router.go(-1)
        }

    }
}
</script>

<style>
.ql-editor,
.ql-blank {
    min-height: 170px !important;
    /* display: inline-block; */
}

.caja-texto {
    border: 1px solid #ccc;
    padding: 8px;
    border-radius: 5px;
}

.flotante {
    position: fixed;
    bottom: 20px;
    margin: auto;
    transition: all 300ms ease 0ms;
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    z-index: 10;
}

.ventana1 {
    box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
    z-index: 12;
    position: fixed;
    top: 30px;
    left: 30px;
    width: 98%;
    height: 98%;
    background-color: red;
}

.vs-popup--close {
    display: none;
}

.borde-unidad {
    border: 1px dashed #ccc;
    /* display: inline-block; */
    padding: 6px;
    cursor: pointer;
}

.vs-dialog {
    z-index: 9999;
}
</style>
