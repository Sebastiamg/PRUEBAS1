<template>
<div>
    <div class="vx-row text-center mt-2">
        <div class="vx-col md:w-1/3" align="center">
            <button class="btnwizardSelect" id="btnNav1">1</button><br>
            Juego
        </div>

        <div class="vx-col md:w-1/3" align="center">
            <button class="btnwizard" id="btnNav2">2</button><br>
            Preguntas
        </div>

        <div class="vx-col md:w-1/3" align="center">
            <button class="btnwizard" id="btnNav3">3</button><br>
            Ficha técnica
        </div>
    </div>

    <vx-card>
        <div class="vx-row" v-if="tabActivo===1">

            <div class="vx-col md:w-1/2 w-full mt-5">
                Asignatura:
                <v-select v-if="tipoUsuario===6" v-model="asignaturaSelected" :options="asignaturas" :dir="$vs.rtl ? 'rtl' : 'ltr'" disabled />
                <v-select v-else v-model="asignaturaSelected" :options="asignaturas" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>
            <div class="vx-col md:w-1/2 w-full mt-5">
                Unidad
                <v-select v-model="unidadSelected" :options="unidades" @input="getTemas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>

            <div class="vx-col w-full mt-5">
                Temas:
                <v-select multiple :closeOnSelect="false" :options="temas" :reduce="temas => temas" label="nombre_tema" class="w-full" v-model="id_temas" />
            </div>

            <div class="vx-col md:w-1/2 w-full mt-5">
                <vs-input label="Título juego" v-model="juego.nombre_juego" class="w-full" />
            </div>
            <div class="vx-col md:w-1/2 w-full mt-5">
                <vs-input label="Descripción" v-model="juego.descripcion_juego" class="w-full" />
            </div>

            <div class="vx-col md:w-1/3 w-full mt-5">
                <vs-input type="number" min="1" label="Puntos" v-model="juego.puntos" class="w-full" />
            </div>

            <div class="vx-col md:w-1/3 w-full mt-5">
                <vs-input type="number" min="1" label="Duración(minutos)" v-model="juego.duracion" class="w-full" />
            </div>

            <div class="vx-col md:w-1/3 w-full mt-5">
                Estado:
                <vs-switch vs-icon-on="check" color="success" v-model="juego.estado_juego" class="mt-2 w-full">
                    <span slot="on">Activo</span>
                    <span slot="off">Inactivo</span>
                </vs-switch>
            </div>
            <vs-divider></vs-divider>

            <div class="vx-col md:w-1/2 w-full text-left">
                <vs-button type="filled" @click="$router.go(-1)">Volver</vs-button>
            </div>
            <div class="vx-col md:w-1/2 w-full text-right">
                <vs-button type="filled" v-if="juego.id_juego==='' || juego.id_juego===undefined" @click="agregarJuego(1); pintartab(1)">Siguiente</vs-button>
                <vs-button type="filled" v-else @click="editarJuego(1); pintartab(2)">Siguiente</vs-button>
            </div>

        </div>
    </vx-card>

    <div v-if="tabActivo===2">
        <vx-card>
        <vs-button color="primary" @click="cambiaVista()" v-if="view_op == 2">Agregar pregunta</vs-button>
        <vs-button color="success" @click="cambiaVista()" v-if="view_op == 1">Ver preguntas</vs-button>
        <span> Total preguntas: &nbsp;<b>&nbsp; {{preguntas.length}}</b></span>
        <div v-if="view_op == 1">
            <div class="pregunta m-4">
                <div class="vx-row mb-3">
                    <div class="vx-col md:w-1/2 w-full mt-2">
                        <vs-textarea v-model="j_juego_contenido.pregunta" class="mb-4 w-full" label="Pregunta"></vs-textarea>
                    </div>
                    <div class="vx-col md:w-1/2 w-full mt-2">
                        <div class="borde-unidad">
                            <div v-if="file0 != '' "> Archivo actual: <br>
                                <label> {{file0.name}} </label>
                                <vx-tooltip style="display: inline-block;" text="Quitar archivo" position="bottom" color="danger">
                                    <vs-button @click="quitarArchivo(0)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                                </vx-tooltip>
                            </div>
                            <label v-if="file0 == '' &&  img_db0 == '' ">
                                <input style="display:none" id="file0" ref="file0" accept="image/png, image/gif, image/jpeg, image/gif, image/jpg" type="file" @change="imagenPregunta(0)" />
                                <vs-button icon-pack="feather" icon="icon-image" color="dark" type="border" @click="$refs.file0.click()">Seleccionar imagen <small>(opcional)</small></vs-button>
                                <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                            </label>
                            <div class="v-row text-left" v-if="porcentaje0 > 0">
                                <vs-progress style="height:20px" :percent="porcentaje0" color="success"> {{porcentaje0}}% </vs-progress>
                            </div>
                            <small class="text-danger"> {{msj0}} </small>
                            <div v-if="img_db0 != ''">
                                <small><b>Archivo actual: </b></small>
                                <vx-tooltip style="display: inline-block;" text="Reemplazar archivo" position="top" color="danger">
                                    <vs-button @click="deleteImagen(img_db0,0, j_juego_contenido.id_contenido_juego)" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border"></vs-button>
                                </vx-tooltip> <br>
                                <img @click="mostrarImagen(img_db0)" height="70" style="display:inline-block" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+img_db0">
                            </div>
                        </div>
                    </div>
                    <center class="vx-col w-full">
                        <p class="text-center"><small class="text-danger"> {{msj_pregunta}} </small></p>
                    </center>
                </div>
            </div>
            <div class="opciones-pregunta" >
                <div class="vx-row m-2 p-1">
                    <vs-divider>Opción 1 - requerida</vs-divider>
                    <div class="vx-col md:w-1/3">
                        <label>¿Respuesta correcta?</label>
                        <vs-checkbox v-model="id_check1" class="p-2 m-2 border" color="success">Si</vs-checkbox>
                    </div>
                    <div class="vx-col md:w-1/3">
                        <label>Respuesta:</label>
                        <vs-input v-model="id_input1" class="w-full" type="text"></vs-input>
                    </div>
                    <div class="vx-col md:w-1/3">
                        <div class="borde-unidad">
                            <div v-if="file1 != '' "> Archivo actual: <br>
                                <label> {{file1.name}} </label>
                                <vx-tooltip style="display: inline-block;" text="Quitar archivo" position="bottom" color="danger">
                                    <vs-button @click="quitarArchivo(1)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                                </vx-tooltip>
                            </div>
                            <label v-if="file1 == '' &&  img_db1 == '' ">
                                <input style="display:none" id="file1" ref="file1" accept="image/png, image/gif, image/jpeg, image/gif, image/jpg" type="file" @change="imagenPregunta(1)" />
                                <vs-button icon-pack="feather" icon="icon-image" color="dark" type="border" @click="$refs.file1.click()">Seleccionar imagen <small>(opcional)</small></vs-button>
                                <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                            </label>
                            <div class="v-row text-left" v-if="porcentaje1 > 0">
                                <vs-progress style="height:20px" :percent="porcentaje1" color="success"> {{porcentaje1}}% </vs-progress>
                            </div>
                            <small class="text-danger"> {{msj1}} </small>
                            <div v-if="img_db1 != ''">
                                <small> <b>Archivo actual: </b></small>
                                <vx-tooltip style="display: inline-block;" text="Reemplazar archivo" position="top" color="danger">
                                    <vs-button @click="deleteImagen(img_db1,1, id_opcion1)" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border"></vs-button>
                                </vx-tooltip> <br>
                                <img @click="mostrarImagen(img_db1)" height="70" style="display:inline-block" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+img_db1">
                            </div>
                        </div>
                    </div>
                    <center class="vx-col w-full">
                        <p class="text-center"><small class="text-danger"> {{msj_op_1}} </small></p>
                    </center>
                </div>
                <div class="vx-row m-2 p-1">
                    <vs-divider>Opción 2 - requerida</vs-divider>
                    <div class="vx-col md:w-1/3">
                        <label>¿Respuesta correcta?</label>
                        <vs-checkbox v-model="id_check2" class="p-2 m-2 border" color="success">Si</vs-checkbox>
                    </div>
                    <div class="vx-col md:w-1/3">
                        <label>Respuesta:</label>
                        <vs-input v-model="id_input2" class="w-full" type="text"></vs-input>
                    </div>
                    <div class="vx-col md:w-1/3">
                        <div class="borde-unidad">
                            <div v-if="file2 != '' "> Archivo actual: <br>
                                <label> {{file2.name}} </label>
                                <vx-tooltip style="display: inline-block;" text="Quitar archivo" position="bottom" color="danger">
                                    <vs-button @click="quitarArchivo(2)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                                </vx-tooltip>
                            </div>
                            <label v-if="file2 == '' &&  img_db2 == '' ">
                                <input style="display:none" id="file2" ref="file2" accept="image/png, image/gif, image/jpeg, image/gif, image/jpg" type="file" @change="imagenPregunta(2)" />
                                <vs-button icon-pack="feather" icon="icon-image" color="dark" type="border" @click="$refs.file2.click()">Seleccionar imagen <small>(opcional)</small></vs-button>
                                <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                            </label>
                            <div class="v-row text-left" v-if="porcentaje2 > 0">
                                <vs-progress style="height:20px" :percent="porcentaje2" color="success"> {{porcentaje2}}% </vs-progress>
                            </div>
                            <small class="text-danger"> {{msj2}} </small>
                            <div v-if="img_db2 != ''">
                                <small><b>Archivo actual: </b></small>
                                <vx-tooltip style="display: inline-block;" text="Reemplazar archivo" position="top" color="danger">
                                    <vs-button @click="deleteImagen(img_db2,2, id_opcion2)" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border"></vs-button>
                                </vx-tooltip> <br>
                                <img @click="mostrarImagen(img_db2)" height="70" style="display:inline-block" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+img_db2">
                            </div>
                        </div>
                    </div>
                    <center class="vx-col w-full">
                        <p class="text-center"><small class="text-danger"> {{msj_op_2}} </small></p>
                    </center>
                </div>
                <div class="vx-row m-2 p-1">
                    <vs-divider>Opción 3</vs-divider>
                    <div class="vx-col md:w-1/3">
                        <label>¿Respuesta correcta?</label>
                        <vs-checkbox v-model="id_check3" class="p-2 m-2 border" color="success">Si</vs-checkbox>
                    </div>
                    <div class="vx-col md:w-1/3">
                        <label>Respuesta:</label>
                        <vs-input v-model="id_input3" class="w-full" type="text"></vs-input>
                    </div>
                    <div class="vx-col md:w-1/3">
                        <div class="borde-unidad">
                            <div v-if="file3 != '' "> Archivo actual: <br>
                                <label> {{file3.name}} </label>
                                <vx-tooltip style="display: inline-block;" text="Quitar archivo" position="bottom" color="danger">
                                    <vs-button @click="quitarArchivo(3)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                                </vx-tooltip>
                            </div>
                            <label v-if="file3 == '' &&  img_db3 == ''  ">
                                <input style="display:none" id="file3" ref="file3" accept="image/png, image/gif, image/jpeg, image/gif, image/jpg" type="file" @change="imagenPregunta(3)" />
                                <vs-button icon-pack="feather" icon="icon-image" color="dark" type="border" @click="$refs.file3.click()">Seleccionar imagen <small>(opcional)</small></vs-button>
                                <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                            </label>
                            <div class="v-row text-left" v-if="porcentaje3 > 0">
                                <vs-progress style="height:20px" :percent="porcentaje3" color="success"> {{porcentaje3}}% </vs-progress>
                            </div>
                            <small class="text-danger"> {{msj3}} </small>
                            <div v-if="img_db3 != ''">
                                <small><b>Archivo actual: </b></small>
                                <vx-tooltip style="display: inline-block;" text="Reemplazar archivo" position="top" color="danger">
                                    <vs-button @click="deleteImagen(img_db3,3, id_opcion3)" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border"></vs-button>
                                </vx-tooltip> <br>
                                <img @click="mostrarImagen(img_db3)" height="70" style="display:inline-block" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+img_db3">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="vx-row m-2 p-1">
                    <vs-divider>Opción 4</vs-divider>
                    <div class="vx-col md:w-1/3">
                        <label>¿Respuesta correcta?</label>
                        <vs-checkbox v-model="id_check4" class="p-2 m-2 border" color="success">Si</vs-checkbox>
                    </div>
                    <div class="vx-col md:w-1/3">
                        <label>Respuesta:</label>
                        <vs-input v-model="id_input4" class="w-full" type="text"></vs-input>
                    </div>
                    <div class="vx-col md:w-1/3">
                        <div class="borde-unidad">
                            <div v-if="file4 != '' "> Archivo actual: <br>
                                <label> {{file4.name}} </label>
                                <vx-tooltip style="display: inline-block;" text="Quitar archivo" position="bottom" color="danger">
                                    <vs-button @click="quitarArchivo(4)" size="small" icon-pack="feather" icon="icon-trash" color="danger" type="border"></vs-button>
                                </vx-tooltip>
                            </div>
                            <label v-if="file4 == '' &&  img_db4 == '' ">
                                <input style="display:none" id="file4" ref="file4" accept="image/png, image/gif, image/jpeg, image/gif, image/jpg" type="file" @change="imagenPregunta(4)" />
                                <vs-button icon-pack="feather" icon="icon-image" color="dark" type="border" @click="$refs.file4.click()">Seleccionar imagen <small>(opcional)</small></vs-button>
                                <p><small> Tamaño máximo: {{limiteMegas}} mb. </small></p>
                            </label>
                            <div class="v-row text-left" v-if="porcentaje4 > 0">
                                <vs-progress style="height:20px" :percent="porcentaje4" color="success"> {{porcentaje4}}% </vs-progress>
                            </div>
                            <small class="text-danger"> {{msj4}} </small>
                            <div v-if="img_db4 != ''">
                                <small><b>Archivo actual: </b></small>
                                <vx-tooltip style="display: inline-block;" text="Reemplazar archivo" position="top" color="danger">
                                    <vs-button @click="deleteImagen(img_db4, 4, id_opcion4)" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border"></vs-button>
                                </vx-tooltip> <br>
                                <img @click="mostrarImagen(img_db4)" height="70" style="display:inline-block" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+img_db4">
                            </div>
                        </div>
                    </div>
                </div>

                <div class="vx-row">
                    <vs-button class="mb-4 m-1" :color="color_boton" type="filled" v-if="editarPregActivo===false" icon-pack="feather" icon="icon-save" @click="verificarDatos(2)">{{txt_boton}}</vs-button>
                </div>
            </div>
        </div>
        <div v-if="view_op == 2">
            <div id="div-with-loading" class="vx-col w-full vs-con-loading__container m-2">
                <vs-table stripe max-items="50" search pagination :data="preguntas" id="div-with-loading" class="vs-con-loading__container">
                    <!-- <template slot="header">
                        Total preguntas: &nbsp;<b>&nbsp; {{preguntas.length}}</b>
                    </template> -->
                    <template slot="thead">
                        <vs-th width="20%">Imagen</vs-th>
                        <vs-th width="30%">Pregunta</vs-th>
                        <vs-th width="40%">Opciones</vs-th>
                        <vs-th width="10%">Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td class="align-top">
                                <vs-avatar @click="mostrarImagen(data[indextr].pregunta.imagen)" v-if="data[indextr].pregunta.imagen != null" size="100px" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+data[indextr].pregunta.imagen"></vs-avatar>
                            </vs-td>
                            <vs-td class="align-top">
                                {{data[indextr].pregunta.pregunta}}
                            </vs-td>
                            <vs-td>
                                <table v-if="data[indextr].opciones.length > 0">
                                    <thead>
                                        <tr>
                                            <th width="10%"></th>
                                            <th>imagen</th>
                                            <th>opción</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr v-for="(op, indexop) in data[indextr].opciones" :key="indexop">
                                            <td>
                                                <vs-button v-if="op.tipo_opcion == 1" size="small" icon-pack="feather" icon="icon-check" color="success"></vs-button>
                                                <vs-button v-if="op.tipo_opcion == 0" size="small" icon-pack="feather" icon="icon-x" color="danger"></vs-button>
                                            </td>
                                            <td>
                                                <vs-avatar @click="mostrarImagen(op.imagen_opcion)" v-if="op.imagen_opcion != null" size="40px" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+op.imagen_opcion"></vs-avatar>
                                            </td>
                                            <td>{{op.nombre_opcion}}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </vs-td>
                            <vs-td>
                                <vs-button class="mb-4 m-1" color="success" type="filled" @click="editarPreguntaJuego(2,tr)">Editar</vs-button>
                            </vs-td>
                        </vs-tr>
                    </template>
                </vs-table>
            </div>
        </div>

            <div class="vx-row w-full">
                <vs-divider></vs-divider>
                <div class="vx-col sm:w-1/2 w-full text-left">
                    <vs-button type="filled" @click="tabActivo=1; pintartab(1)">Atrás</vs-button>
                </div>
                <div class="vx-col sm:w-1/2 w-full text-right">
                    <vs-button type="filled" @click="tabActivo=3; getFicha(); pintartab(3)">Siguiente</vs-button>
                </div>
            </div>
     
        </vx-card>
    </div>

    <vx-card class="mt-5" v-if="tabActivo===3">
        <div class="vx-row">
            <div class="vx-col sm:w-1/3 w-full">
                <span>Bloque curricular</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input v-model="datos_ficha.bloque_curricular" class="mb-6 w-full"></vs-input>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Grado</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input v-model="datos_ficha.grado" class="mb-6 w-full"></vs-input>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Destrezas</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-textarea v-model="datos_ficha.destrezas" class="mb-6 w-full"></vs-textarea>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Habilidades</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-textarea v-model="datos_ficha.habilidades" class="mb-6 w-full"></vs-textarea>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Elaborado por</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input v-model="datos_ficha.elaborado_por" class="mb-6 w-full"></vs-input>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Intencion didáctica</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-textarea v-model="datos_ficha.intencion_didactica" class="mb-6 w-full"></vs-textarea>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Consigna</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-textarea v-model="datos_ficha.consigna" class="mb-6 w-full"></vs-textarea>
            </div>

            <div class="vx-col sm:w-1/3 w-full">
                <span>Consideraciones</span>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-textarea v-model="datos_ficha.consideraciones" class="mb-6 w-full"></vs-textarea>
            </div>

            <vs-divider></vs-divider>

            <div class="vx-col sm:w-1/2 w-full text-left">
                <vs-button type="filled" @click="editarJuego(2); pintartab(2)">Atrás</vs-button>
            </div>
            <div class="vx-col sm:w-1/2 w-full text-right">
                <vs-button type="filled" @click="guardarFicha(3);">Guardar Ficha</vs-button>
            </div>

        </div>
    </vx-card>

    <!-- MODAL PARA MOSTRAR IMAGEN -->
    <vs-popup title="Imagen" title-color="primary" :active.sync="modalImagen" class="p-5">
        <center>
            <img v-if="imagen_a_mostrar != ''" height="350" style="display:inline-block" :src="$data_url+'archivos/images/imagenes_juegos/seleccionSimple/'+imagen_a_mostrar">
        </center>
    </vs-popup>
</div>
</template>

<script>
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
            endesarrollo: false,
            asignaturaSelected: '',
            unidadSelected: {
                id: 1,
                label: "Unidad 1"
            },
            datos_crear_juego: {},
            data_juego: [],
            datos_ficha: {},
            juego: {
                estado_juego: false,
            },
            preguntas: [],
            temas: [],
            usuario: [],
            asignaturas: [],
            unidades: [{
                id: "1",
                label: "Unidad 1",
            }, {
                id: "2",
                label: "Unidad 2",
            }, {
                id: "3",
                label: "Unidad 3",
            }, {
                id: "4",
                label: "Unidad 4",
            }, {
                id: "5",
                label: "Unidad 5",
            }, {
                id: "6",
                label: "Unidad 6",
            }, {
                id: "7",
                label: "Unidad 7",
            }, {
                id: "8",
                label: "Unidad 8",
            }],
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s'
            },
            tabActivo: 1,
            id_juego: '',
            id_tipo_juego: '',
            activePromptEditarCrear: false,
            id_temas: [],
            editarPregActivo: false,
            tipoUsuario: 1,
            //adivinanzas
            j_juego_contenido: {
                'id_contenido_juego': 0,
                'id_juego': '',
                'pregunta': '',
                'imagen': '',
                'estado': 1
            },
            j_juego_opciones: {
                'nombre_opcion': '',
                'tipo_opcion': '',
                'imagen_opcion': ''
            },
            bytes: 1048576, //1 mega
            limiteMegas: 0.7,
            msj: '',

            msj_pregunta: '',
            msj_op_1: '',
            msj_op_2: '',
            msj_imagen0: '',
            file0: '',
            muyPesado0: '',
            pesoArchivo0: '',
            msj0: '',
            porcentaje0: 0,

            msj_imagen1: '',
            file1: '',
            muyPesado1: '',
            pesoArchivo1: '',
            msj1: '',
            porcentaje1: 0,

            msj_imagen2: '',
            file2: '',
            muyPesado2: '',
            pesoArchivo2: '',
            msj2: '',
            porcentaje2: 0,

            msj_imagen3: '',
            file3: '',
            muyPesado3: '',
            pesoArchivo3: '',
            msj3: '',
            porcentaje3: 0,

            msj_imagen4: '',
            file4: '',
            muyPesado4: '',
            pesoArchivo4: '',
            msj4: '',
            porcentaje4: 0,

            msjError: 'La imagen que intenta cargar es muy pesada, verifique por favor.',

            msj_imagen: '',

            id_check1: '',
            id_check2: '',
            id_check3: '',
            id_check4: '',
            id_input1: '',
            id_input2: '',
            id_input3: '',
            id_input4: '',
            id_opcion1: '',
            id_opcion2: '',
            id_opcion3: '',
            id_opcion4: '',

            img_db0: '',
            img_db1: '',
            img_db2: '',
            img_db3: '',
            img_db4: '',

            txt_boton: 'Guardar pregunta y opciones',
            color_boton: 'success',
            tipo_accion: 1, //1-guardar - 2-editar
            modalImagen: false,
            imagen_a_mostrar: '',
            view_op : 1,
        }
    },
    components: {
        'v-select': vSelect,
        flatPickr,
    },
    created() {
        let me = this
    },
    mounted() {
        let me = this
        me.asignaturaSelected = {
            id: localStorage.idasignatura,
            label: localStorage.nombreasignatura
        }
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
        // console.log( me.usuario )
        me.tipoUsuario = me.usuario.id_group
        me.id_tipo_juego = localStorage.getItem('id_tipo_juego')
        if (JSON.parse(localStorage.getItem('data_juego'))) {
            me.juego = JSON.parse(localStorage.getItem('data_juego'))
            me.id_juego = me.juego.id_juego
            me.asignaturaSelected = {
                id: me.juego.temas[0].idasignatura,
                label: me.juego.temas[0].nombreasignatura
            }
        }
        // console.log('id juego->' + me.id_juego)
        me.getTemas()
        me.cargarSelecTemas()
        me.getAsignaturas()
        // me.getPreguntas()

    },
    methods: {
        cambiaVista(){
            let me = this;

            me.view_op == 1 ? me.view_op = 2 : me.view_op = 1;
        },
        getAsignaturas() {
            let me = this
            if (me.tipoUsuario === 1) {
                this.$http.get(this.$server_url+'asignaturasDoc/0').then(res => {
                        me.asignaturas = res.data;
                        me.$vs.loading.close()
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            } else {
                return
            }
        },
        cargarSelecTemas() {
            let me = this
            if (me.juego.temas) {
                for (var i = 0; i < me.juego.temas.length; i++) {
                    me.id_temas.push({
                        id: me.juego.temas[i].id,
                        nombre_tema: me.juego.temas[i].nombre_tema
                    })
                }
            }
        },
        getPreguntas() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+'pregunta_opciones/' + me.id_juego)
                .then(res => {
                    if (res.data.items != undefined) {
                        me.preguntas = res.data.items;
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
        },
        getTemas() {
            let me = this

            if (me.asignaturaSelected.id) {
                me.$vs.loading()
                const formData = new FormData();
                formData.append('asignatura', me.asignaturaSelected.id);
                formData.append('unidad', me.unidadSelected.id);
                this.$http.post(this.$server_url+'temasignunidad', formData).then(res => {
                        //this.$http.get(this.$server_url+'temAsignaruta/'+ me.asignaturaSelected.id).then(res => {
                        me.temas = res.data;
                        me.$vs.loading.close()
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
            } else {
                return
            }

        },

        agregarJuego(tab) {
            let me = this;
            me.juego.fecha_inicio = '2021-01-01 12:00:00';
            me.juego.fecha_fin = '2021-01-01 12:00:00';
            if (me.id_temas === '' || me.juego.nombre_juego === '' || me.juego.descripcion_juego === '' || me.juego.puntos === '' || me.juego.duracion === '' || me.id_temas === undefined || me.juego.nombre_juego === undefined || me.juego.descripcion_juego === undefined || me.juego.puntos === undefined || me.juego.duracion === undefined || me.id_temas.length < 1) {
                me.$vs.notify({
                    text: 'Debe completar todos los campos antes de continuar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            let estado_juego = 1
            if (me.juego.estado_juego === false) {
                estado_juego = 0
            }

            me.$vs.loading()
            let formData = new FormData();
            formData.append('id_tipo_juego', me.id_tipo_juego);
            formData.append('id_docente', me.usuario.idusuario);
            formData.append('nombre_juego', me.juego.nombre_juego);
            formData.append('descripcion_juego', me.juego.descripcion_juego);
            formData.append('puntos', me.juego.puntos);
            formData.append('duracion', me.juego.duracion);
            formData.append('fecha_inicio', me.juego.fecha_inicio);
            formData.append('fecha_fin', me.juego.fecha_fin);
            formData.append('estado', estado_juego);
            this.$http.post(this.$server_url+'j_juegos', formData)
                .then(res => {
                    me.id_juego = res.data.id_juego
                    me.guardarTemasJuego()
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        editarJuego() {
            let me = this;
            me.juego.fecha_inicio = '2021-01-01 12:00:00';
            me.juego.fecha_fin = '2021-01-01 12:00:00';
            if (me.id_temas === '' || me.juego.nombre_juego === '' || me.juego.descripcion_juego === '' || me.juego.puntos === '' || me.juego.duracion === '' || me.id_temas === undefined || me.juego.nombre_juego === undefined || me.juego.descripcion_juego === undefined || me.juego.puntos === undefined || me.juego.duracion === undefined || me.id_temas.length < 1) {
                me.$vs.notify({
                    text: 'Debe completar todos los campos antes de continuar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            let estado_juego = 1
            if (me.juego.estado_juego === false) {
                estado_juego = 0
            }
            me.$vs.loading()

            let formData = new FormData();
            formData.append('id_juego', me.id_juego);
            formData.append('id_tipo_juego', me.id_tipo_juego);
            formData.append('id_docente', me.usuario.idusuario);
            formData.append('nombre_juego', me.juego.nombre_juego);
            formData.append('descripcion_juego', me.juego.descripcion_juego);
            formData.append('puntos', me.juego.puntos);
            formData.append('duracion', me.juego.duracion);
            formData.append('fecha_inicio', me.juego.fecha_inicio);
            formData.append('fecha_fin', me.juego.fecha_fin);
            formData.append('estado', estado_juego);
            this.$http.post(this.$server_url+'j_juegos', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.eliminarTemasJuego()
                    me.getPreguntas()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        eliminarTemasJuego() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+'eliminarTemasJuego/' + me.id_juego)
                .then(res => {
                    me.$vs.loading.close()
                    me.guardarTemasJuego()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        guardarTemasJuego() {
            let me = this
            me.$vs.loading()
            let temas_vector = []

            for (var i = 0; i < me.id_temas.length; i++) {
                temas_vector.push(me.id_temas[i].id)
            }

            let formData = new FormData();
            formData.append('id_juego', me.id_juego);
            formData.append('id_temas', temas_vector);
            this.$http.post(this.$server_url+'guardarTemasJuego', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.tabActivo = 2
                    me.datos_crear_juego = {}
                    me.editarPregActivo = false
                    me.pintartab(2)
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        verPregunta(item) {
            let me = this
            me.editarPregActivo = true
            me.datos_crear_juego = {}
            me.datos_crear_juego = item
        },
        quitarArchivo(num) {
            let me = this;
            if (num == 0) {
                window.$("#file0").val('')
                me.file0 = {};
                me.msj0 = '';
            }
            if (num == 1) {
                window.$("#file1").val('')
                me.file1 = '';
                me.msj1 = '';
            }
            if (num == 2) {
                window.$("#file2").val('')
                me.file2 = '';
                me.msj2 = '';
            }
            if (num == 3) {
                window.$("#file3").val('')
                me.file3 = '';
                me.msj3 = '';
            }
            if (num == 4) {
                window.$("#file4").val('')
                me.file4 = '';
                me.msj4 = '';
            }

        },
        imagenPregunta(num) {
            let me = this;
            if (num == 0) {
                me.msj0 = '';
                me.porcentaje0 = 0;
                me.pesoArchivo0 = 0;
                me.muyPesado0 = false;
                me.file0 = me.$refs.file0.files[0];
                // verificar tamaño de archivo
                me.pesoArchivo0 = (me.file0.size / me.bytes).toFixed(2);
                if (me.pesoArchivo0 > me.limiteMegas) {
                    me.muyPesado0 = true;
                    me.msj0 = me.msjError;
                }
            }
            if (num == 1) {
                me.msj1 = '';
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
            }
            if (num == 2) {
                me.msj2 = '';
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
            }
            if (num == 3) {
                me.msj3 = '';
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
            }
            if (num == 4) {
                me.msj4 = '';
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
            }
        },
        verificarDatos() {
            let me = this
            me.msj_pregunta = '';
            me.msj_op_1 = '';
            me.msj_op_2 = '';
            if (me.j_juego_contenido.pregunta == '' && me.file0 == '' && me.img_db0 == '') {
                me.msj_pregunta = 'Ingrese una pregunta o seleccione una imagen.';
                me.$vs.notify({
                    text: 'Ingrese una pregunta o seleccione una imagen.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.muyPesado0 || me.muyPesado1 || me.muyPesado2 || me.muyPesado3 || me.muyPesado4) {
                me.$vs.notify({
                    time: 5000,
                    text: 'El archivo que intenta subir, excede el peso permitido, verifique antes de continuar.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.id_input1 == '' && me.file1 == '' && me.img_db1 == '') {
                me.msj_op_1 = 'Ingrese la primera opción de respuesta o seleccione una imagen.';
                me.$vs.notify({
                    text: 'Ingrese la primera opción de respuesta o seleccione una imagen.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.id_input2 == '' && me.file2 == '' && me.img_db2 == '') {
                me.msj_op_2 = 'Ingrese la primera opción de respuesta o seleccione una imagen.';
                me.$vs.notify({
                    text: 'Ingrese la segunda opción de respuesta o seleccione una imagen.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            if (me.id_check1 == false && me.id_check2 == false && me.id_check3 == false && me.id_check4 == false) {
                me.$vs.notify({
                    text: 'Seleccione almenos una respuesta correcta',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            me.cargarPreguntas();
        },
        cargarPreguntas() {
            let me = this
            // console.log(me.id_opcion3, me.id_opcion4)
            // return
            me.$vs.loading()
            let formData = new FormData();
            formData.append('id_contenido_juego', me.j_juego_contenido.id_contenido_juego);
            formData.append('id_juego', me.id_juego);
            formData.append('pregunta', me.j_juego_contenido.pregunta);
            formData.append('img_pregunta', me.file0);
            formData.append('id_opcion1', me.id_opcion1);
            formData.append('id_opcion2', me.id_opcion2);
            formData.append('id_opcion3', me.id_opcion3);
            formData.append('id_opcion4', me.id_opcion4);
            formData.append('img_opcion1', me.file1);
            formData.append('img_opcion2', me.file2);
            formData.append('img_opcion3', me.file3);
            formData.append('img_opcion4', me.file4);
            formData.append('check1', me.id_check1 == true ? '1' : '0');
            formData.append('check2', me.id_check2 == true ? '1' : '0');
            formData.append('check3', me.id_check3 == true ? '1' : '0');
            formData.append('check4', me.id_check4 == true ? '1' : '0');
            formData.append('input1', me.id_input1);
            formData.append('input2', me.id_input2);
            formData.append('input3', me.id_input3);
            formData.append('input4', me.id_input4);

            axios.post(this.$data_url+'api/saveSeleccion', formData)
                .then(res => {
                    // console.log(res.data)
                    me.$vs.loading.close()
                    me.getPreguntas();
                    // me.j_juego_contenido.imagen = res.data.imagen
                    me.file0 = '';
                    window.$("#file0").val('');
                    me.file1 = '';
                    window.$("#file1").val('');
                    me.file2 = '';
                    window.$("#file2").val('');
                    me.file3 = '';
                    window.$("#file3").val('');
                    me.file4 = '';
                    window.$("#file4").val('');
                    me.vaciar();
                    me.txt_boton = 'Guardar pregunta y opciones';
                    me.color_boton = 'success'

                    var msj_accion = '';
                    me.tipo_accion == 1 ? msj_accion = 'Contenido registrado correctamente. ' : msj_accion = 'Contenido actualizado correctamente. '
                    me.$vs.notify({
                        text: msj_accion,
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.tipo_accion = 1; // por defecto en opcion guardar
                    me.cambiaVista();
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        editarPreguntaJuego(num, item) {
            let me = this
            me.vaciar();
            console.log(item)
            me.cambiaVista();
            me.txt_boton = 'Editar pregunta y opciones';
            me.color_boton = 'warning';
            me.tipo_accion = 2; // cambia mensaje al editar
            me.j_juego_contenido.id_contenido_juego = item.pregunta.id_contenido_juego
            me.j_juego_contenido.pregunta = item.pregunta.pregunta != null ? item.pregunta.pregunta : '';
            me.img_db0 = item.pregunta.imagen == null ? '' : item.pregunta.imagen;

            // return
            if (item.opciones[0] != undefined) {
                me.img_db1 = item.opciones[0].imagen_opcion == null ? '' : item.opciones[0].imagen_opcion;
                me.id_opcion1 = item.opciones[0].id_opcion_contenido != null ? item.opciones[0].id_opcion_contenido : '';
                me.id_check1 = item.opciones[0].tipo_opcion != null ? item.opciones[0].tipo_opcion : '';
                me.id_input1 = item.opciones[0].nombre_opcion != null ? item.opciones[0].nombre_opcion : '';
            }

            if (item.opciones[1] != undefined) {
                me.img_db2 = item.opciones[1].imagen_opcion != null ? item.opciones[1].imagen_opcion : '';
                me.id_opcion2 = item.opciones[1].id_opcion_contenido != null ? item.opciones[1].id_opcion_contenido : '';
                me.id_check2 = item.opciones[1].tipo_opcion != null ? item.opciones[1].tipo_opcion : '';
                me.id_input2 = item.opciones[1].nombre_opcion != null ? item.opciones[1].nombre_opcion : '';
            }

            if (item.opciones[2] != undefined) {
                me.img_db3 = item.opciones[2].imagen_opcion != null ? item.opciones[2].imagen_opcion : '';
                me.id_opcion3 = item.opciones[2].id_opcion_contenido != null ? item.opciones[2].id_opcion_contenido : '';
                me.id_check3 = item.opciones[2].tipo_opcion != null ? item.opciones[2].tipo_opcion : '';
                me.id_input3 = item.opciones[2].nombre_opcion != null ? item.opciones[2].nombre_opcion : '';
            }

            if (item.opciones[3] != undefined) {
                me.img_db4 = item.opciones[3].imagen_opcion != null ? item.opciones[3].imagen_opcion : '';
                me.id_opcion4 = item.opciones[3].id_opcion_contenido != null ? item.opciones[3].id_opcion_contenido : '';
                me.id_check4 = item.opciones[3].tipo_opcion != null ? item.opciones[3].tipo_opcion : '';
                me.id_input4 = item.opciones[3].nombre_opcion != null ? item.opciones[3].nombre_opcion : '';
            }
            console.log( me.file1,me.img_db2 )
            // console.log('id-pregunta ' + me.j_juego_contenido.id_contenido_juego, 'op1 ' + me.id_opcion1, 'op2 ' + me.id_opcion2, 'op3 ' + me.id_opcion3, 'op4 ' + me.id_opcion4, 'img1 '+ me.img_db1)
        },
        deleteImagen(item, val, id_update) {
            let me = this;
            let formData = new FormData();
            me.$vs.loading();
            if (val == 0) {
                // 0 -> actualiza el campo imagen de la pregunta, de la tabla j_contenido_juegos
                formData.append('edita_id_pregunta', id_update);
            } else {
                // 0 -> actualiza el campo imagen de la opcion seleccionada, de la tabla j_opciones_contenidos
                formData.append('edita_id_opcion', id_update);
            }
            formData.append('img_eliminar', item); //nombre de la imagen a eliminar, de la base y del public
            console.log(item, val, id_update)
            this.$http.post(this.$server_url+'deleteImagen', formData)
                .then(res => {
                    console.log(res.data)
                    val == 0 ? me.img_db0 = '' : val == 1 ? me.img_db1 = '' : val == 2 ? me.img_db2 = '' : val == 3 ? me.img_db3 = '' : me.img_db4 = '';
                    console.log(me.img_db0, me.img_db1, me.img_db2, me.img_db3, me.img_db4)
                    me.getPreguntas();
                    me.$vs.notify({
                        text: 'la imagen ha sido quitada.',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check',
                    })
                    me.$vs.loading.close();
                })
                .catch(e => {
                    console.log(e)
                    me.$vs.loading.close();
                })
        },
        vaciar() {
            let me = this;
            //vaciar los ids de imagenes, inputs, checks para edicion y eliminar 
            me.j_juego_contenido.pregunta = '';
            me.j_juego_contenido.id_contenido_juego = '';
            me.id_check1 = '';
            me.id_check2 = '';
            me.id_check3 = '';
            me.id_check4 = '';
            me.id_input1 = '';
            me.id_input2 = '';
            me.id_input3 = '';
            me.id_input4 = '';
            me.id_opcion1 = '';
            me.id_opcion2 = '';
            me.id_opcion3 = '';
            me.id_opcion4 = '';
            me.img_db0 = '';
            me.img_db1 = '';
            me.img_db2 = '';
            me.img_db3 = '';
            me.img_db4 = '';
        },
        mostrarImagen(item) {
            let me = this;
            me.imagen_a_mostrar = item;
            me.modalImagen = true;
        },
        eliminarPreguntaJuego() {
            let me = this
            this.$http.delete(this.$server_url+'j_contenidos/' + me.datos_crear_juego.id_contenido_juego)
                .then(res => {
                    me.$vs.loading.close()
                    me.getPreguntas()
                    me.datos_crear_juego = {}
                    me.editarPregActivo = false
                    me.$vs.notify({
                        text: 'Eliminado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        getFicha() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+'j_juegos/' + me.id_juego)
                .then(res => {
                    me.datos_ficha = res.data[0];

                    $.each(me.datos_ficha,function(key, value){
                        // console.log('key: ' + me.datos_ficha[key]+' _ value: '+value)
                        if( value == 'null' || value == null || value == '' ){
                            me.datos_ficha[key] = ''
                        }
                    });

                    me.$vs.loading.close()
                })
                .catch(function (error) {
                })
        },
        guardarFicha() {
            let me = this
            let formData = new FormData();
            formData.append('id_juego', me.id_juego);
            formData.append('bloque_curricular', me.datos_ficha.bloque_curricular);
            formData.append('grado', me.datos_ficha.grado);
            formData.append('destrezas', me.datos_ficha.destrezas);
            formData.append('habilidades', me.datos_ficha.habilidades);
            formData.append('elaborado_por', me.datos_ficha.elaborado_por);
            formData.append('consigna', me.datos_ficha.consigna);
            formData.append('intencion_didactica', me.datos_ficha.intencion_didactica);
            formData.append('consideraciones', me.datos_ficha.consideraciones);
            this.$http.post(this.$server_url+'j_juegos_ficha', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Ficha guardada correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.$router.go(-1)
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        pintartab(n) {
            for (var i = 1; i < 4; i++) {
                $("#btnNav" + i).removeClass("btnwizardSelect");
                $("#btnNav" + i).addClass("btnwizard");
            }
            $("#btnNav" + n).removeClass("btnwizard");
            $("#btnNav" + n).addClass("btnwizardSelect");
            /*document.getElementById('btnNav'+n).style.background = 'red'
            document.getElementById('btnNav'+n).style.color = 'white'*/
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
}

.btnwizardSelect {
    width: 65px;
    height: 65px;
    font-size: 22px;
    padding: 0px;
    border-radius: 100%;
    border: 2px solid rgb(29, 90, 182);
    background-color: rgb(29, 90, 182);
    color: white;
}

.preguntasList:hover {
    color: rgb(36, 87, 226);
    text-decoration: underline;
    cursor: pointer;
}

.borde-unidad {
    border: 1px dashed #ccc;
    /* display: inline-block; */
    padding: 6px;
    cursor: pointer;
}
</style>
