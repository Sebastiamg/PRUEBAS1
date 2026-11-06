<template>
<div class="vx-col md:w-full w-full mb-base">
    <vx-card>
        <div class="vx-col w-full mb-base">
            <h4> {{titulo}} </h4>
        </div>
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
                <div class="vx-col w-full m-1">
                    <b>Datos generales:</b> <br>
                </div>
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                    <div style="font-size: 12px;">Nombre: </div>
                    <vs-input type="text" class="inputx w-full mb-6" v-model="proyectos.nombre" maxlength="100" placeholder="Nombre del proyecto" />
                </div>
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                    <div style="font-size: 12px;">Descripción: </div>
                    <vs-textarea v-model="proyectos.descripcion" class="inputx w-full mb-6" />
                </div>
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left" v-if="grupo_usuario == 1">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Archivo para el DOCENTE: </div>
                        <div v-if="proyectos.archivodocente != '' && proyectos.archivodocente !== null " class="m-1">
                            <div v-if="proyectos.archivodocente.length > 0">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="proyectos.archivodocente[0].name.length < long_name_file"> {{proyectos.archivodocente[0].name}} </label>
                                    <label v-else>
                                        <span v-if="proyectos.archivodocente[0].name.length > (long_name_file+4)">
                                            {{proyectos.archivodocente[0].name.substr(0,long_name_file)}} .... {{proyectos.archivodocente[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{proyectos.archivodocente[0].name}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.archivodocente[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.archivodocente[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(proyectos.archivodocente[0],1)"></vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentaje1 == 0" type="file" id="file1" ref="file1" v-on:change="docenteFileUpload()" />
                            <div class="v-row text-left" v-if="porcentaje1>0">
                                <vs-progress style="height:25px" :percent="porcentaje1" color="success"> {{porcentaje1}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msjD1 != '' "> {{msjD1}} <br></small>
                            <small class="text-danger" v-if="msjD2 != '' "> {{msjD2}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>

                        </div>
                    </div>
                </div>
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-base" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Archivo para el ESTUDIANTE: </div>
                        <div v-if="proyectos.archivo != '' && proyectos.archivo !== null " class="m-1">
                            <div v-if="proyectos.archivo.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="proyectos.archivo[0].name.length < long_name_file"> {{proyectos.archivo[0].name}} </label>
                                    <label v-else>
                                        <span v-if="proyectos.archivo[0].name.length > (long_name_file+4)">
                                            {{proyectos.archivo[0].name.substr(0,long_name_file)}} .... {{proyectos.archivo[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{proyectos.archivo[0].name}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.archivo[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.archivo[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(proyectos.archivo[0],2)"></vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentaje == 0" type="file" id="file" ref="file" v-on:change="handleFileUpload()" />
                            <div class="v-row text-left" v-if="porcentaje>0">
                                <vs-progress style="height:25px" :percent="porcentaje" color="success"> {{porcentaje}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1 != '' "> {{msj1}} <br></small>
                            <small class="text-danger" v-if="msj2 != '' "> {{msj2}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div><br>
                <div class="vx-col w-full mt-5" align="left">
                    <div style="font-size: 12px; ">Asignaturas: </div>
                    <small>Puede seleccionar una o varias asignaturas </small>
                    <v-select multiple :closeOnSelect="false" class="mb-4 w-full" v-model="asignaturaSelect" :options="asignaturas" label="nombreasignatura" :reduce="asignaturas => asignaturas" />
                </div>
                <div v-if="proyectos.proyectos_asignaturas != null" class="vx-col w-full">
                    <vs-divider>Este proyecto esta asignado a:</vs-divider>
                    <div class="vx-col w-full" align="left" v-if="proyectos.proyectos_asignaturas != undefined ">
                        <vs-list>
                            <vs-list-item class="ml-6" icon-pack="feather" icon="icon-check" v-for="(item,index) in proyectos.proyectos_asignaturas" :key="index" :subtitle="item.datos.nombreasignatura">
                                <vx-tooltip style="display: inline-block;" text="Quitar proyecto de esta asignatura" position="top" color="danger">
                                    <vs-button class="mr-6" size="small" color="danger" icon-pack="feather" icon="icon-trash" @click="quitarAignaturaAsignada(item)"></vs-button>
                                </vx-tooltip>
                            </vs-list-item>
                        </vs-list>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="valor == 1" class="fade-in">
            <div class="vx-col w-full m-1">
                <b>Introducción:</b> <br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Archivo </div>
                        <div v-if="proyectos.fileIntroduccion != '' && proyectos.fileIntroduccion !== null " class="m-1">
                            <div v-if="proyectos.fileIntroduccion.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="proyectos.fileIntroduccion[0].name.length < long_name_file"> {{proyectos.fileIntroduccion[0].name}} </label>
                                    <label v-else>
                                        <span v-if="proyectos.fileIntroduccion[0].name.length > (long_name_file+4)">
                                            {{proyectos.fileIntroduccion[0].name.substr(0,long_name_file)}} .... {{proyectos.fileIntroduccion[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{proyectos.fileIntroduccion[0].name}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileIntroduccion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileIntroduccion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(proyectos.fileIntroduccion[0],3)"></vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeI == 0" type="file" id="fileI" ref="fileI" v-on:change="introduccionUpload()" />
                            <div class="v-row text-left" v-if="porcentajeI>0">
                                <vs-progress style="height:25px" :percent="porcentajeI" color="success"> {{porcentajeI}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1I != '' "> {{msj1I}} <br></small>
                            <small class="text-danger" v-if="msj2I != '' "> {{msj2I}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full h-25 alto" v-model="proyectos.introduccion"></quill-editor>
            </div>
        </div>
        <div v-if="valor == 2" class="fade-in">
            <div class="vx-col w-full m-1">
                <b>Tareas:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Archivo </div>
                        <div v-if="proyectos.fileTarea != '' && proyectos.fileTarea !== null " class="m-1">
                            <div v-if="proyectos.fileTarea.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="proyectos.fileTarea[0].name.length < long_name_file"> {{proyectos.fileTarea[0].name}} </label>
                                    <label v-else>
                                        <span v-if="proyectos.fileTarea[0].name.length > (long_name_file+4)">
                                            {{proyectos.fileTarea[0].name.substr(0,long_name_file)}} .... {{proyectos.fileTarea[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{proyectos.fileTarea[0].name}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileTarea[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileTarea[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(proyectos.fileTarea[0],4)"></vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeT == 0" type="file" id="fileT" ref="fileT" v-on:change="tareaUpload()" />
                            <div class="v-row text-left" v-if="porcentajeT>0">
                                <vs-progress style="height:25px" :percent="porcentajeT" color="success"> {{porcentajeT}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1T != '' "> {{msj1T}} <br></small>
                            <small class="text-danger" v-if="msj2T != '' "> {{msj2T}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full h-25 alto" v-model="proyectos.tareas"></quill-editor>

            </div>
        </div>
        <div v-if="valor == 3" class="fade-in">
            <div class="vx-col w-full m-1">
                <b>Proceso:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Archivo </div>
                        <div v-if="proyectos.fileProceso != '' && proyectos.fileProceso !== null " class="m-1">
                            <div v-if="proyectos.fileProceso.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="proyectos.fileProceso[0].name.length < long_name_file"> {{proyectos.fileProceso[0].name}} </label>
                                    <label v-else>
                                        <span v-if="proyectos.fileProceso[0].name.length > (long_name_file+4)">
                                            {{proyectos.fileProceso[0].name.substr(0,long_name_file)}} .... {{proyectos.fileProceso[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{proyectos.fileProceso[0].name}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileProceso[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileProceso[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(proyectos.fileProceso[0],5)"></vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeP == 0" type="file" id="fileP" ref="fileP" v-on:change="procesoUpload()" />
                            <div class="v-row text-left" v-if="porcentajeP>0">
                                <vs-progress style="height:25px" :percent="porcentajeP" color="success"> {{porcentajeP}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1P != '' "> {{msj1P}} <br></small>
                            <small class="text-danger" v-if="msj2P != '' "> {{msj2P}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full h-25 alto" v-model="proyectos.proceso"></quill-editor>

            </div>
        </div>
        <div v-if="valor == 4" class="fade-in">
            <div class="vx-col w-full m-1">
                <b>Recursos:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Archivo </div>
                        <div v-if="proyectos.fileRecurso != '' && proyectos.fileRecurso !== null " class="m-1">
                            <div v-if="proyectos.fileRecurso.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="proyectos.fileRecurso[0].name.length < long_name_file"> {{proyectos.fileRecurso[0].name}} </label>
                                    <label v-else>
                                        <span v-if="proyectos.fileRecurso[0].name.length > (long_name_file+4)">
                                            {{proyectos.fileRecurso[0].name.substr(0,long_name_file)}} .... {{proyectos.fileRecurso[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{proyectos.fileRecurso[0].name}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileRecurso[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileRecurso[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(proyectos.fileRecurso[0],6)"></vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeR == 0" type="file" id="fileR" ref="fileR" v-on:change="recursoUpload()" />
                            <div class="v-row text-left" v-if="porcentajeR>0">
                                <vs-progress style="height:25px" :percent="porcentajeR" color="success"> {{porcentajeR}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1R != '' "> {{msj1R}} <br></small>
                            <small class="text-danger" v-if="msj2R != '' "> {{msj2R}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full h-25 alto" v-model="proyectos.recursos"></quill-editor>
            </div>
        </div>
        <div v-if="valor == 5" class="fade-in">
            <div class="vx-col w-full m-1">
                <b>Evaluación:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Archivo </div>
                        <div v-if="proyectos.fileEvaluacion != '' && proyectos.fileEvaluacion !== null " class="m-1">
                            <div v-if="proyectos.fileEvaluacion.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="proyectos.fileEvaluacion[0].name.length < long_name_file"> {{proyectos.fileEvaluacion[0].name}} </label>
                                    <label v-else>
                                        <span v-if="proyectos.fileEvaluacion[0].name.length > (long_name_file+4)">
                                            {{proyectos.fileEvaluacion[0].name.substr(0,long_name_file)}} .... {{proyectos.fileEvaluacion[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{proyectos.fileEvaluacion[0].name}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileEvaluacion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileEvaluacion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(proyectos.fileEvaluacion[0],7)"></vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeE == 0" type="file" id="fileE" ref="fileE" v-on:change="evaluacionUpload()" />
                            <div class="v-row text-left" v-if="porcentajeE>0">
                                <vs-progress style="height:25px" :percent="porcentajeE" color="success"> {{porcentajeE}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1E != '' "> {{msj1E}} <br></small>
                            <small class="text-danger" v-if="msj2E != '' "> {{msj2E}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full h-25 alto" v-model="proyectos.evaluacion"></quill-editor>

            </div>
        </div>
        <div v-if="valor == 6" class="fade-in">
            <div class="vx-col w-full m-1">
                <b>Conclusiones:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mb-2" align="left">
                    <div class="borde-unidad p-3">
                        <div style="font-size: 12px;" class="mb-2">Archivo </div>
                        <div v-if="proyectos.fileConclusion != '' && proyectos.fileConclusion !== null " class="m-1">
                            <div v-if="proyectos.fileConclusion.length >0" class="m-1">
                                <p><b>Archivo actual:</b></p>
                                <p>
                                    <label v-if="proyectos.fileConclusion[0].name.length < long_name_file"> {{proyectos.fileConclusion[0].name}} </label>
                                    <label v-else>
                                        <span v-if="proyectos.fileConclusion[0].name.length > (long_name_file+4)">
                                            {{proyectos.fileConclusion[0].name.substr(0,long_name_file)}} .... {{proyectos.fileConclusion[0].ext}}
                                        </span>
                                        <span v-else>
                                            {{proyectos.fileConclusion[0].name}}
                                        </span>
                                    </label>
                                </p>
                                <p>
                                    <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                        <vs-button style="display: inline" class="m-1" @click="descargaArchivo(proyectos.fileConclusion[0])" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Visualizar" position="bottom" style="display: inline-block" color="warning">
                                        <vs-button style="display: inline" class="m-1" @click="visualizar(proyectos.fileConclusion[0])" size="small" icon-pack="feather" icon="icon-eye" color="warning" type="border"></vs-button>
                                    </vx-tooltip>
                                    <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                        <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="openConfirmEliminar(proyectos.fileConclusion[0],8)"></vs-button>
                                    </vx-tooltip>
                                </p>
                            </div>
                        </div>
                        <div v-else>
                            <input v-if="porcentajeC == 0" type="file" id="fileC" ref="fileC" v-on:change="conclusionUpload()" />
                            <div class="v-row text-left" v-if="porcentajeC>0">
                                <vs-progress style="height:25px" :percent="porcentajeC" color="success"> {{porcentajeC}}% </vs-progress>
                            </div><br>
                            <small class="text-danger" v-if="msj1C != '' "> {{msj1C}} <br></small>
                            <small class="text-danger" v-if="msj2C != '' "> {{msj2C}} <br></small>
                            <small>Tamaño máximo: {{limiteMegas}} mb.</small>
                        </div>
                    </div>
                </div>
                <quill-editor class="w-full h-25 alto" v-model="proyectos.conclusiones"></quill-editor>
            </div>
        </div>
        <div v-if="valor == 7" class="fade-in">
            <div class="vx-col w-full m-1">
                <b>Créditos:</b><br>
            </div>
            <div class="vx-col w-full m-1 mb-base">
                <quill-editor class="w-full h-25 alto" v-model="proyectos.creditos"></quill-editor>
            </div>
        </div>
        <div class="vx-col w-full m-1">
            <vs-button v-if="!edita" style="display: inline" class="m-1" @click="verificarCampos()" size="medium" icon-pack="feather" icon="icon-save" color="success" type="gradient">Guardar</vs-button>
            <vs-button v-else style="display: inline" class="m-1" @click="verificarCampos()" size="medium" icon-pack="feather" icon="icon-save" color="success" type="gradient">Editar</vs-button>
            <vs-button style="display: inline" color="danger" type="border" icon-pack="feather" @click="volver()" icon="icon-arrow-left">Volver</vs-button>

        </div>

    </vx-card>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
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
    mixins: [historicoMixin],
    data() {
        return {
            archivo: '',
            archivodocente: '',
            // idusuario: '',
            asignatura: {},
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
            idWQ: '',
            valor: 0,
            asignaturaDocente: '',
            idasignatura: '',
            asignaturas: [],
            asignaturaSelect: [],
            file: '',
            file1: '',
            usuario: '',
            edita_local_WQ: '',
            edita: '',
            long_name_file: 30, //cantidad maxima de caracteres a mostrar en el nombre del archivo
            porcentaje: 0,
            porcentaje1: 0,
            limiteMegas: 10, //permitir maximo de megas
            bytes: 1048576, //para calculo de megas
            pesoArchivo: 0,
            pesoArchivo1: 0,
            muyPesado: false,
            muyPesado1: false,
            camposVacios: '',
            tipoBoton: 'border',
            deshabilitar: false,
            titulo: '',
            grupo_usuario: '',
            no_permitido: false,
            no_permitidoD: false,
            msj1: '',
            msj2: '',
            msjD1: '',
            msjD2: '',

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

            file_eliminar: '',
            tipo_eliminar: '',
            asignat_eliminar: '',
            tmp_asignaturaSelect: '',
            id_asignats: [],
            proyectos_asignaturas: [],
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
            },
            miusuario: '',
            mensajePeso: 'El archivo que intenta cargar excede el peso permitido, favor verifique para continuar.',
            mensajeArchivo: 'El tipo de archivo que intenta enviar, no esta permitido, favor verifique',
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'))
        this.miusuario = this.usuario
        this.grupo_usuario = this.miusuario.id_group
        this.idasignatura = localStorage.getItem('idasignatura')
        if (this.grupo_usuario == 6) { ///si es docente, la asignatura se carga en base al libro seleccionado
            this.deshabilitar = true;
            this.getAsignaturaId(this.idasignatura); //si es docente, la asignatura ya esta seleccionada con el libro
        } else {
            this.getAsignaturas(); //si es redactor de Prolipa, puede elegir las asignaturas
        }
        // this.idusuario = this.miusuario.idusuario
        this.edita = localStorage.getItem('edita'); //edicion del webquest
        if (this.edita) {
            // this.edita_local_WQ = JSON.parse(localStorage.getItem('webq'));
            this.webQ = JSON.parse(localStorage.getItem('webq'));
            // this.idWQ = this.edita_local_WQ.id;
            this.getProyectosAsignaturas();
            this.getProyecto();
            this.titulo = 'Editar proyecto'
        } else {
            this.titulo = 'Agregar nuevo proyecto'
        }
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
        getAsignaturaId(id) {
            let me = this;
            this.$http.get(this.$server_url+'asignaturaIdProyectos/' + id)
                .then(res => {
                    me.asignaturaSelect = res.data[0]
                    // console.log(me.asignaturaSelect)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getProyecto() {
            let me = this;
            me.$vs.loading()
            axios.get('https://foro.prolipadigital.com.ec/proyectos/' + me.webQ.id)
                .then(res => {
                    me.proyectos = res.data
                    // console.log(res.data)
                    me.$vs.loading.close()
                })
                .catch(e => {
                    console.log('no se conecto a los proyectos ' + e)
                    me.$vs.loading.close()
                })
        },
        handleFileUpload() {
            this.no_permitido = false;
            this.msj1 = '';
            this.msj2 = '';
            this.porcentaje = 0;
            this.pesoArchivo = 0;
            this.muyPesado = false;
            this.file = this.$refs.file.files[0];
            // verificar tamaño de archivo
            this.pesoArchivo = (this.file.size / this.bytes).toFixed(2);
            if (this.pesoArchivo > this.limiteMegas) {
                this.muyPesado = true;
                this.msj1 = this.mensajePeso;
            }
            if (this.file.type == 'application/x-msdownload') {
                this.no_permitido = true;
                this.msj2 = this.mensajeArchivo;
            }
        },
        docenteFileUpload() {
            this.no_permitidoD = false;
            this.msjD1 = '';
            this.msjD2 = '';
            this.porcentaje1 = 0;
            this.pesoArchivo1 = 0;
            this.muyPesado1 = false;
            this.file1 = this.$refs.file1.files[0];
            // verificar tamaño de archivo
            this.pesoArchivo1 = (this.file1.size / this.bytes).toFixed(2);
            if (this.pesoArchivo1 > this.limiteMegas) {
                this.muyPesado1 = true;
                this.msjD1 = this.mensajePeso;
            }
            if (this.file1.type == 'application/x-msdownload') {
                this.no_permitidoD = true;
                this.msjD2 = this.mensajeArchivo;
            }
        },
        introduccionUpload() {
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
        },
        tareaUpload() {
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
        },
        procesoUpload() {
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
        },
        recursoUpload() {
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
        },
        evaluacionUpload() {
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
        },
        conclusionUpload() {
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
        },
        verificarCampos() {
            let me = this;
            let repetida = false;
            let repe_asign = '';
            if (me.muyPesado || me.muyPesado1 || me.muyPesadoI || me.muyPesadoT || me.muyPesadoP || me.muyPesadoR || me.muyPesadoE || me.muyPesadoC) {
                me.$vs.notify({
                    text: 'El archivo que intenta cargar excede el peso permitido, favor verifique para continuar.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.no_permitido || me.no_permitidoD || me.no_permitidoI || me.no_permitidoT || me.no_permitidoP || me.no_permitidoR || me.no_permitidoE || me.no_permitidoC) {
                me.$vs.notify({
                    text: 'El tipo de archivo que intenta enviar, no esta permitido, favor verifique',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.proyectos.nombre == "") {
                me.valor = 0;
                me.$vs.notify({
                    text: 'Ingrese el nombre del proyecto',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.$vs.loading.close()
                return
            }
            if (me.proyectos.descripcion == "") {
                me.valor = 0;
                me.$vs.notify({
                    text: 'Ingrese la descripción del proyecto',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.$vs.loading.close()
                return
            }
            if (me.asignaturaSelect.length == 0 && !me.edita) {
                me.valor = 0;
                me.$vs.notify({
                    text: 'Seleccione almenos una asignatura para este proyecto',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.$vs.loading.close()
                return
            }

            // console.log(me.asignaturaSelect)
            if (me.asignaturaSelect != '') { //asignaturas ya asignadas
                for (let index = 0; index < me.asignaturaSelect.length; index++) {
                    // console.log(me.asignaturaSelect[index].idasignatura, me.proyectos.proyectos_asignaturas[index].idasignatura)
                    for (let j = 0; j < me.proyectos.proyectos_asignaturas.length; j++) {
                        if (me.asignaturaSelect[index].idasignatura == me.proyectos.proyectos_asignaturas[j].idasignatura) {
                            // console.log(index, me.asignaturaSelect[index].idasignatura, j, me.proyectos.proyectos_asignaturas[j].idasignatura)
                            repetida = true;
                            repe_asign += me.asignaturaSelect[index].nombreasignatura + ' ';
                        }
                    }
                }
            }
            if (repetida) {
                me.$vs.notify({
                    time: 5000,
                    text: 'Las asignaturas ' + repe_asign + ', ya se encuentran asignadas, verifique antes de continuar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.proyectos.introduccion == "" || me.proyectos.tareas == "" || me.proyectos.proceso == "" || me.proyectos.recursos == "" || me.proyectos.evaluacion == "" || me.proyectos.conclusiones == "" || me.proyectos.creditos == "") {
                me.camposVacios = '';
                me.proyectos.introduccion == "" ? me.camposVacios += ' introducción,' : me.camposVacios += '';
                me.proyectos.tareas == "" ? me.camposVacios += '  tareas,' : me.camposVacios += '';
                me.proyectos.proceso == "" ? me.camposVacios += ' proceso,' : me.camposVacios += '';
                me.proyectos.recursos == "" ? me.camposVacios += ' recursos,' : me.camposVacios += '';
                me.proyectos.evaluacion == "" ? me.camposVacios += ' evaluación,' : me.camposVacios += '';
                me.proyectos.conclusiones == "" ? me.camposVacios += ' conclusiones,' : me.camposVacios += '';
                me.proyectos.creditos == "" ? me.camposVacios += ' créditos,' : me.camposVacios += '';
                me.$vs.loading.close()
                me.$vs.dialog({
                    type: 'confirm',
                    color: 'primary',
                    title: 'Confirmar',
                    text: 'Los campos: ' + me.camposVacios + ' se encuentran vacíos, ¿Desea continuar?',
                    acceptText: 'Aceptar',
                    cancelText: 'Cancelar',
                    accept: me.subirArchivo
                })
            } else
                me.subirArchivo();
        },
        subirArchivo() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.file);
            if (me.file != '') {
                me.$vs.loading()
                axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivo > 0) {
                                me.porcentaje = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.proyectos.archivo = response.data[0].id
                        me.$vs.notify({
                            text: 'Archivo para el ESTUDIANTE cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirArchivoDocente();
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(' no hay archivo para el estudiante')
                        me.subirArchivoDocente();
                        me.$vs.loading.close()
                    })
            } else {
                me.subirArchivoDocente();
            }
        },
        subirArchivoDocente() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.file1);
            if (me.file1 != '') {
                me.$vs.loading()
                axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivo1 > 0) {
                                me.porcentaje1 = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.proyectos.archivodocente = response.data[0].id
                        me.$vs.notify({
                            text: 'Archivo para el DOCENTE, cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirArchivoIntroduccion();
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(' no hay archivo para el docente')
                        me.subirArchivoIntroduccion();
                        me.$vs.loading.close()
                    })
            } else {
                me.subirArchivoIntroduccion();
            }
        },
        subirArchivoIntroduccion() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.fileI);
            if (me.fileI != '') {
                me.$vs.loading()
                axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivoI > 0) {
                                me.porcentajeI = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.proyectos.fileIntroduccion = response.data[0].id
                        me.$vs.notify({
                            text: 'Archivo para la INTRODUCCIÓN, cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirArchivoTarea();
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(' no hay archivo para la introduccion')
                        me.subirArchivoTarea();
                        me.$vs.loading.close()
                    })
            } else {
                me.subirArchivoTarea();
            }
        },
        subirArchivoTarea() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.fileT);
            if (me.fileT != '') {
                me.$vs.loading()
                axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivoT > 0) {
                                me.porcentajeT = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.proyectos.fileTarea = response.data[0].id
                        me.$vs.notify({
                            text: 'Archivo para la TAREA, cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirArchivoProceso();
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(' no hay archivo para la tarea')
                        me.subirArchivoProceso();
                        me.$vs.loading.close()
                    })
            } else {
                me.subirArchivoProceso();
            }
        },
        subirArchivoProceso() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.fileP);
            if (me.fileP != '') {
                me.$vs.loading()
                axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivoP > 0) {
                                me.porcentajeP = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.proyectos.fileProceso = response.data[0].id
                        me.$vs.notify({
                            text: 'Archivo para el PROCESO, cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirArchivoRecurso();
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(' no hay archivo para el proceso')
                        me.subirArchivoRecurso();
                        me.$vs.loading.close()
                    })
            } else {
                me.subirArchivoRecurso();
            }
        },
        subirArchivoRecurso() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.fileR);
            if (me.fileR != '') {
                me.$vs.loading()
                axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivoR > 0) {
                                me.porcentajeR = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.proyectos.fileRecurso = response.data[0].id
                        me.$vs.notify({
                            text: 'Archivo para el RECURSO, cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirArchivoEvaluacion();
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(' no hay archivo para el recurso')
                        me.subirArchivoEvaluacion();
                        me.$vs.loading.close()
                    })
            } else {
                me.subirArchivoEvaluacion();
            }
        },
        subirArchivoEvaluacion() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.fileE);
            if (me.fileE != '') {
                me.$vs.loading()
                axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivoE > 0) {
                                me.porcentajeE = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.proyectos.fileEvaluacion = response.data[0].id
                        me.$vs.notify({
                            text: 'Archivo para la EVALUACION, cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.subirArchivoConclusion();
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(' no hay archivo para la evaluacion')
                        me.subirArchivoConclusion();
                        me.$vs.loading.close()
                    })
            } else {
                me.subirArchivoConclusion();
            }
        },
        subirArchivoConclusion() {
            let me = this;
            let formData = new FormData();
            formData.append('files', me.fileC);
            if (me.fileC != '') {
                me.$vs.loading()
                axios.post("https://foro.prolipadigital.com.ec/upload", formData, {
                        onUploadProgress: uploadEvent => {
                            if (me.pesoArchivoC > 0) {
                                me.porcentajeC = Math.round(uploadEvent.loaded / uploadEvent.total * 100);
                            }
                        }
                    })
                    .then(function (response) {
                        me.proyectos.fileConclusion = response.data[0].id
                        me.$vs.notify({
                            text: 'Archivo para la CONCLUSION, cargado correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                        me.guardaEdita();
                        me.$vs.loading.close()
                    })
                    .catch(error => {
                        console.log(' no hay archivo para la conclusion')
                        me.guardaEdita();
                        me.$vs.loading.close()
                    })
            } else {
                me.guardaEdita();
            }
        },
        guardaEdita() {
            let me = this;
            if (me.edita) {
                me.editaWQ();
                me.$vs.loading.close()
            }
            if (!me.edita) {
                me.registrarProyecto();
                me.$vs.loading.close()
            }
        },
        registrarProyecto() {
            let me = this;
            me.$vs.loading()
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = me.asignaturaSelect[0].idasignatura;
            let h_nombreasignatura = me.asignaturaSelect[0].nombreasignatura;
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'crear',
                'recurso_tipo': 'proyecto',
                'recurso_nombre': me.proyectos.nombre,
                'recurso_detalle': '',
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            axios.post('https://foro.prolipadigital.com.ec/proyectos', {
                    'nombre': me.proyectos.nombre,
                    'descripcion': me.proyectos.descripcion,
                    'archivo': me.proyectos.archivo,
                    'archivodocente': me.proyectos.archivodocente,
                    'fileIntroduccion': me.proyectos.fileIntroduccion,
                    'fileTarea': me.proyectos.fileTarea,
                    'fileProceso': me.proyectos.fileProceso,
                    'fileRecurso': me.proyectos.fileRecurso,
                    'fileEvaluacion': me.proyectos.fileEvaluacion,
                    'fileConclusion': me.proyectos.fileConclusion,
                    'idusuario': me.miusuario.idusuario,
                    'asignatura': {
                        'user_nombre': me.miusuario.nombres,
                        'user_apellido': me.miusuario.apellidos,
                        'user_email': me.miusuario.email,
                        'user_institucion': me.miusuario.institucion_idInstitucion,
                        'name_usuario': me.miusuario.name_usuario,
                        'cedula': me.miusuario.cedula,
                        'idusuario': me.miusuario.idusuario,
                        'grupo_usuario': me.miusuario.id_group,
                        'nombreasignatura': me.asignaturaSelect[0].nombreasignatura,
                        'idasignatura': me.asignaturaSelect[0].idasignatura,
                        'area_idarea': me.asignaturaSelect[0].area_idarea,
                        'nivel_idnivel': me.asignaturaSelect[0].nivel_idnivel,
                        'tipo_asignatura': me.asignaturaSelect[0].tipo_asignatura,
                    },
                    'introduccion': me.proyectos.introduccion,
                    'tareas': me.proyectos.tareas,
                    'proceso': me.proyectos.proceso,
                    'recursos': me.proyectos.recursos,
                    'evaluacion': me.proyectos.evaluacion,
                    'conclusiones': me.proyectos.conclusiones,
                    'creditos': me.proyectos.creditos,
                    'estado': true,
                    'grupo_usuario': String(me.grupo_usuario),
                })
                .then(res => {
                    me.idWQ = res.data.id
                    // console.log(me.asignaturaSelect)
                    for (let index = 0; index < me.asignaturaSelect.length; index++) {
                        axios.post('https://foro.prolipadigital.com.ec/proyectos-asignaturas', {
                                'idproyecto': me.idWQ,
                                'idasignatura': me.asignaturaSelect[index].idasignatura,
                                'estado': true,
                                'datos': {
                                    'user_nombre': me.miusuario.nombres,
                                    'user_apellido': me.miusuario.apellidos,
                                    'user_email': me.miusuario.email,
                                    'user_institucion': me.miusuario.institucion_idInstitucion,
                                    'name_usuario': me.miusuario.name_usuario,
                                    'cedula': me.miusuario.cedula,
                                    'idusuario': me.miusuario.idusuario,
                                    'grupo_usuario': me.miusuario.id_group,
                                    'nombreasignatura': me.asignaturaSelect[index].nombreasignatura,
                                    'area_idarea': me.asignaturaSelect[index].area_idarea,
                                    'nivel_idnivel': me.asignaturaSelect[index].nivel_idnivel,
                                    'tipo_asignatura': me.asignaturaSelect[index].tipo_asignatura,
                                },
                            })
                            .then(response => {
                                me.proyectos.proyectos_asignaturas.push(response.data.id);
                                // console.log(me.id_asignats)
                                axios.put('https://foro.prolipadigital.com.ec/proyectos/' + me.idWQ, {
                                        'proyectos_asignaturas': me.proyectos.proyectos_asignaturas
                                    })
                                    .then(respp => {
                                        // console.log('editando proyecto, con proyectos asignaturas')
                                        // console.log(respp)
                                        me.$vs.loading.close()
                                    })
                                    .catch(error => {
                                        console.log(' no se edito el proyecto con las asignaturas ')
                                        me.$vs.loading.close()
                                    })

                            })
                            .catch(error => {
                                console.log('no se registro las asignaturas ' + error)
                            })
                    }
                    me.$vs.notify({
                        text: 'Proyecto guardado correctamente ',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                    me.volver()
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.notify({
                        text: 'Error al guardar el proyecto ',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                })
        },
        editaWQ() {
            let me = this;
            axios.put('https://foro.prolipadigital.com.ec/proyectos/' + me.webQ.id, {
                    'nombre': me.proyectos.nombre,
                    'descripcion': me.proyectos.descripcion,
                    'archivo': me.proyectos.archivo,
                    'archivodocente': me.proyectos.archivodocente,
                    'fileIntroduccion': me.proyectos.fileIntroduccion,
                    'fileTarea': me.proyectos.fileTarea,
                    'fileProceso': me.proyectos.fileProceso,
                    'fileRecurso': me.proyectos.fileRecurso,
                    'fileEvaluacion': me.proyectos.fileEvaluacion,
                    'fileConclusion': me.proyectos.fileConclusion,
                    'idusuario': me.proyectos.idusuario,
                    'asignatura': {
                        'user_nombre': me.miusuario.nombres,
                        'user_apellido': me.miusuario.apellidos,
                        'user_email': me.miusuario.email,
                        'user_institucion': me.miusuario.institucion_idInstitucion,
                        'name_usuario': me.miusuario.name_usuario,
                        'cedula': me.miusuario.cedula,
                        'idusuario': me.miusuario.idusuario,
                        'grupo_usuario': me.miusuario.id_group,
                        'nombreasignatura': me.proyectos.proyectos_asignaturas[0].datos.nombreasignatura,
                        'idasignatura': me.proyectos.proyectos_asignaturas[0].idasignatura,
                        'area_idarea': me.proyectos.proyectos_asignaturas[0].datos.area_idarea,
                        'nivel_idnivel': me.proyectos.proyectos_asignaturas[0].datos.nivel_idnivel,
                        'tipo_asignatura': me.proyectos.proyectos_asignaturas[0].datos.tipo_asignatura,
                    },
                    'introduccion': me.proyectos.introduccion,
                    'tareas': me.proyectos.tareas,
                    'proceso': me.proyectos.proceso,
                    'recursos': me.proyectos.recursos,
                    'evaluacion': me.proyectos.evaluacion,
                    'conclusiones': me.proyectos.conclusiones,
                    'creditos': me.proyectos.creditos,
                    'estado': true,
                    'grupo_usuario': String(me.grupo_usuario),
                })
                .then(res => {
                    if (me.asignaturaSelect != '') {
                        for (let index = 0; index < me.asignaturaSelect.length; index++) {
                            axios.post('https://foro.prolipadigital.com.ec/proyectos-asignaturas', {
                                    'idproyecto': me.webQ.id,
                                    'idasignatura': me.asignaturaSelect[index].idasignatura,
                                    'estado': true,
                                    'datos': {
                                        'user_nombre': me.miusuario.nombres,
                                        'user_apellido': me.miusuario.apellidos,
                                        'user_email': me.miusuario.email,
                                        'user_institucion': me.miusuario.institucion_idInstitucion,
                                        'name_usuario': me.miusuario.name_usuario,
                                        'cedula': me.miusuario.cedula,
                                        'idusuario': me.miusuario.idusuario,
                                        'grupo_usuario': me.miusuario.id_group,
                                        'nombreasignatura': me.asignaturaSelect[index].nombreasignatura,
                                        'area_idarea': me.asignaturaSelect[index].area_idarea,
                                        'nivel_idnivel': me.asignaturaSelect[index].nivel_idnivel,
                                        'tipo_asignatura': me.asignaturaSelect[index].tipo_asignatura,
                                    },
                                })
                                .then(response => {
                                    // me.id_asignats.push(response.data.id);
                                    me.proyectos.proyectos_asignaturas.push(response.data.id);
                                    // console.log(me.proyectos.proyectos_asignaturas)
                                    axios.put('https://foro.prolipadigital.com.ec/proyectos/' + me.webQ.id, {
                                            'proyectos_asignaturas': me.proyectos.proyectos_asignaturas
                                        })
                                        .then(respp => {
                                            console.log('editando proyecto, con proyectos asignaturas')
                                            // console.log(respp)
                                            me.$vs.loading.close()
                                        })
                                        .catch(error => {
                                            console.log(' no se edito el proyecto con las asignaturas ')
                                            me.$vs.loading.close()
                                        })

                                })
                                .catch(error => {
                                    console.log('no se registro la asignaturas ' + error)
                                })
                        }
                    }
                    me.$vs.notify({
                        text: 'Proyecto editado correctamente ',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$vs.loading.close()
                })
                .catch(error => {
                    console.log(error)
                    me.$vs.notify({
                        text: 'Error al guardar el proyecto ',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.$vs.loading.close()
                })
            me.volver();
        },
        volver() {
            let me = this;
            if (me.edita) {
                localStorage.removeItem('webq')
                localStorage.removeItem('edita')
            }
            me.$router.go(-1);
        },
        descargaArchivo(item) {
            // console.log(item)
            this.$vs.loading();
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = me.proyectos.proyectos_asignaturas[0].idasignatura;
            let h_nombreasignatura = me.proyectos.proyectos_asignaturas[0].datos.nombreasignatura;
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'descarga',
                'recurso_tipo': 'proyecto',
                'recurso_nombre': me.proyectos.nombre,
                'recurso_detalle': item.name,
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            axios({
                    url: 'https://foro.prolipadigital.com.ec' + item.url,
                    method: 'GET',
                    responseType: 'blob',
                })
                .then((response) => {
                    var fileURL = window.URL.createObjectURL(new Blob([response.data]));
                    var fileLink = document.createElement('a');

                    fileLink.href = fileURL;
                    fileLink.setAttribute('download', item.name + item.ext);
                    document.body.appendChild(fileLink);

                    fileLink.click();
                    this.$vs.notify({
                        text: 'El archivo se esta descargando',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    this.$vs.loading.close();
                })
                .catch(error => {
                    this.$vs.notify({
                        text: 'Error en la descarga del archivo',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    this.$vs.loading.close();
                })
        },
        openConfirmEliminar(item, tipo_elim) {
            let me = this;
            me.file_eliminar = item
            me.tipo_eliminar = tipo_elim; //1-> archivo docente. 2-> archivo estudiante
            // console.log(me.file_eliminar)
            // return
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
            // console.log(me.archivo)
            me.$vs.loading()
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = me.proyectos.proyectos_asignaturas[0].idasignatura;
            let h_nombreasignatura = me.proyectos.proyectos_asignaturas[0].datos.nombreasignatura;
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'eliminar',
                'recurso_tipo': 'proyecto',
                'recurso_nombre': me.proyectos.nombre,
                'recurso_detalle': me.file_eliminar.name,
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            axios.delete("https://foro.prolipadigital.com.ec/upload/files/" + me.file_eliminar.id)
                .then(function (res) {
                    if (me.tipo_eliminar == 2) { //elimina archivo del estudiante
                        me.porcentaje = 0;
                        me.pesoArchivo = 0;
                        me.proyectos.archivo = '';
                        me.file = '';
                        window.$("#file").val('');
                    }
                    if (me.tipo_eliminar == 1) { //elimina archivo del docente
                        me.porcentaje1 = 0;
                        me.pesoArchivo1 = 0;
                        me.proyectos.archivodocente = '';
                        me.file1 = '';
                        window.$("#file1").val('');
                    }
                    if (me.tipo_eliminar == 3) { //elimina archivo INTRODUCCION
                        me.porcentajeI = 0;
                        me.pesoArchivoI = 0;
                        me.proyectos.fileIntroduccion = '';
                        me.fileI = '';
                        window.$("#fileI").val('');
                    }
                    if (me.tipo_eliminar == 4) { //elimina archivo TAREA
                        me.porcentajeT = 0;
                        me.pesoArchivoT = 0;
                        me.proyectos.fileTarea = '';
                        me.fileT = '';
                        window.$("#fileT").val('');
                    }
                    if (me.tipo_eliminar == 5) { //elimina archivo PROCESO
                        me.porcentajeP = 0;
                        me.pesoArchivoP = 0;
                        me.proyectos.fileProceso = '';
                        me.fileP = '';
                        window.$("#fileP").val('');
                    }
                    if (me.tipo_eliminar == 6) { //elimina archivo RECURSO
                        me.porcentajeR = 0;
                        me.pesoArchivoR = 0;
                        me.proyectos.fileRecurso = '';
                        me.fileR = '';
                        window.$("#fileR").val('');
                    }
                    if (me.tipo_eliminar == 7) { //elimina archivo EVALUACION
                        me.porcentajeE = 0;
                        me.pesoArchivoE = 0;
                        me.proyectos.fileEvaluacion = '';
                        me.fileE = '';
                        window.$("#fileE").val('');
                    }
                    if (me.tipo_eliminar == 8) { //elimina archivo CONCLUSION
                        me.porcentajeC = 0;
                        me.pesoArchivoC = 0;
                        me.proyectos.fileConclusion = '';
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
        },
        quitarAignaturaAsignada(item) {
            let me = this;
            // console.log(item)
            me.asignat_eliminar = item
            // me.getProyectosAsignaturas();
            if (me.proyectos.proyectos_asignaturas.length == 1) {
                me.$vs.notify({
                    text: 'Este proyecto debe pertenecer a almenos una asignatura',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Confirmar',
                text: 'Este proyecto no se mostrará en ' + item.datos.nombreasignatura,
                acceptText: 'Aceptar',
                cancelText: 'Cancelar',
                accept: me.quitarAsignacion
            })
        },
        quitarAsignacion() {
            let me = this;
            axios.delete('https://foro.prolipadigital.com.ec/proyectos-asignaturas/' + me.asignat_eliminar.id)
                .then(res => {
                    me.getProyectosAsignaturas();
                    me.$vs.notify({
                        text: 'El proyecto no se mostrará en la asignatura seleccionada',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getProyectosAsignaturas() {
            let me = this;
            axios.get('https://foro.prolipadigital.com.ec/proyectos-asignaturas?idproyecto=' + me.webQ.id)
                .then(res => {
                    me.proyectos.proyectos_asignaturas = res.data
                    // console.log(me.proyectos.proyectos_asignaturas)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        visualizar(item) {
            let me = this;
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = me.proyectos.proyectos_asignaturas[0].idasignatura;
            let h_nombreasignatura = me.proyectos.proyectos_asignaturas[0].datos.nombreasignatura;
            let h_recursotipo = 5; //5 = proyecto
            let datoHistorico = {
                'user_nombre': me.miusuario.nombres,
                'user_apellido': me.miusuario.apellidos,
                'user_email': me.miusuario.email,
                'user_cedula': me.miusuario.cedula,
                'recurso_accion': 'ver',
                'recurso_tipo': 'proyecto',
                'recurso_nombre': me.proyectos.nombre,
                'recurso_detalle': item.name,
            }
            // console.log(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico)
            me.historicoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura, h_nombreasignatura, h_recursotipo, datoHistorico);
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            if (item.mime == "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
                window.open('https://view.officeapps.live.com/op/embed.aspx?src=https://foro.prolipadigital.com.ec' + item.url)
            }
            if (item.mime = "application/pdf") {
                if (item.height != null && item.width != null) {
                    //si tiene alto y ancho, es una imagen
                    window.open('https://foro.prolipadigital.com.ec' + item.url);
                } else {
                    window.open('https://docs.google.com/viewer?url=https://foro.prolipadigital.com.ec' + item.url);
                }
            }
        },
    }
}
</script>

<style>
.alto {
    height: 360px;
    display: inline-block;
}

.fade-in {
    opacity: 1;
    animation-name: fadeInOpacity;
    animation-iteration-count: 1;
    animation-timing-function: ease-in;
    animation-duration: 0.5s;
}

@keyframes fadeInOpacity {
    0% {
        opacity: 0;
    }

    100% {
        opacity: 1;
    }
}

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
