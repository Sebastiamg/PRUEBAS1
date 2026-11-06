<template>
    <div>
        <vx-card v-bind:title="titPregTipo" title-color="primary" v-bind:subtitle="txtPregTipo">
            <vs-tabs alignment="fixed">
              <vs-tab label="Pregunta">
                <div class="vx-row">
                  <div class="flex justify-center">
                    <p v-for="(item,key) in arregloPeriodos" :key="key">
                      <vs-chip class="ml-2" v-if="item.id == periodoSelect">Período Evaluación Seleccionada: <b class="ml-1">{{ item.nombre }}</b></vs-chip>
                    </p>
                    <br>
                  </div>
                </div>
                  <div class="vx-row mb-5 mt-4">
                    <!------------SELEC TEMA PREGUNTA-------------------->
                    <div class="vx-col sm:w-1/2 w-full">
                      Área
                      <v-select :options="areas" :reduce="areas => areas" label="nombre_area" v-model="area_pregunta" @input="getAsignaturas()"></v-select>
                    </div>
                    <div class="vx-col sm:w-1/2 w-full">
                        Asignatura
                        <v-select :options="asignaturas" :reduce="asignaturas => asignaturas" label="nombre_asignatura" v-model="asignatura_pregunta"></v-select>
                    </div>
                    <!------------FIN SELEC TEMA PREGUNTA-------------------->
                  </div>
                  <div class="vx-row mb-5">
                      <div class="vx-col w-full">
                          <div style="border: 1px solid #d5d5d5; border-radius: 10px; padding: 5px 5px 5px 5px;" align="center" class="mb-2">
                              <input type="file" name="file1" id="file1" class="inputfile" style="display: none;" v-on:change="mostrarImg(1,1)">
                              <label for="file1" style="margin-bottom: -10px; margin-right: 10px; cursor: pointer; color: gray; width: 49%; font-size: 11px; line-height: 80%;">
                                  Click aquí para subir imagen
                              </label>
                              <label @click="quitarImagen(1)" style="margin-bottom: -10px; margin-left: 10px; cursor: pointer; color: red; width: 49%; font-size: 11px;">
                                  Click aquí para quitar imagen
                              </label>
                              <div v-if="src_imagen_pregunta==='' || src_imagen_pregunta===null || src_imagen_pregunta==='null' || src_imagen_pregunta===this.$server_url+'img/salle/img_preguntas/null'"></div>
                              <img id="img1" class="img-responsive mb-2" v-bind:src="src_imagen_pregunta" style="max-width: 400px; border-radius: 5px;" v-else>
                          </div>
                      </div>
                      <div class="vx-col w-full mt-3">
                        <p>Nombre Pregunta</p>
                        <quill-editor class="w-full h-25 alto mt-2" style="height:120px;" v-model="pregunta.descripcion"></quill-editor>
                      </div>
                      <div class="vx-col sm:w-1/4 w-full" style="margin-top: 50px;">
                          <vs-input disabled type="number" class="mb-4 w-full mt-5" label="Puntaje" placeholder="Puntaje" v-model="puntaje_pregunta"/>
                      </div>
                      <div v-if="editarActivo===true" class="vx-col sm:w-1/4 w-full pt-5" align="center" style="margin-top: 50px;">
                        <vs-switch  color="success" @input="CambiarEstadoPreguntaSalle()" v-model="activoPregunta">
                          <span slot="on">Activado</span>
                          <span slot="off">Desactivado</span>
                        </vs-switch>
                      </div>
                      <div class="vx-col sm:w-1/4 w-full pt-5" align="center" style="margin-top: 50px;">
                          <vs-button class="w-full mt-5 p-3" title="Transformar pregunta a respuesta simple o viceversa" icon-pack="feather" icon="icon-loader" color="warning" @click="transformarPregunta()"> Transformar pregunta </vs-button>
                      </div>
                      <div class="vx-col sm:w-1/4 w-full mb-2" align="right" style="margin-top: 50px;">
                          <div v-if="editarActivo">
                              <vs-button class="w-full mt-10" @click="editarPregunta" type="filled">Editar pregunta</vs-button>
                          </div>
                          <div v-else>
                              <vs-button class="w-full mt-10" v-if="guardadoActivo == false" color="success" type="filled" @click="agregar()">Guardar pregunta</vs-button>
                          </div>
                      </div>
                  </div>
              </vs-tab>
              <!-------INICIO TAB OPCIONES PREG TIPO 1, 5----->
              <vs-tab label="Opciones" v-if="pregTipo===1 || pregTipo===5">
                  <div class="vx-col w-full mb-2" style="padding: 10px;">
                    <div class="vx-row">
                      <div class="flex justify-center">
                        <p v-for="(item,key) in arregloPeriodos" :key="key">
                          <vs-chip class="ml-2" v-if="item.id == periodoSelect">Período Evaluación Seleccionada: <b class="ml-1">{{ item.nombre }}</b></vs-chip>
                        </p>
                        <br>
                      </div>
                    </div>
                  <vs-divider position="left" color="success">
                    <span class="divider-title">
                      <feather-icon icon="PlusCircleIcon" svgClasses="w-5 h-5 mr-2" />
                      {{ editarOpcionActiva ? 'Editar Opción' : 'Crear Nueva Opción' }}
                    </span>
                  </vs-divider>

                  <!-- Create/Edit Option Form Card -->
                  <div class="create-option-card" id="editar">
                    <!-- Image Upload Section -->
                    <div class="upload-section">
                      <label class="upload-label">Imagen de la opción (opcional)</label>

                      <div class="upload-area" :class="{'has-image': src_imagen_opcion && src_imagen_opcion !== '' && src_imagen_opcion !== 'null'}">
                        <input
                          type="file"
                          name="file2"
                          id="file2"
                          class="inputfile"
                          accept="image/*"
                          v-on:change="mostrarImg(2,2)"
                        >

                        <!-- Upload placeholder -->
                        <div
                          v-if="!src_imagen_opcion || src_imagen_opcion==='' || src_imagen_opcion===null || src_imagen_opcion==='null' || src_imagen_opcion===this.$server_url+'archivos/img/salle/img_preguntas/'"
                          class="upload-placeholder"
                        >
                          <label for="file2" class="upload-btn-primary">
                            <feather-icon icon="UploadCloudIcon" svgClasses="w-8 h-8 mb-2" />
                            <span class="upload-text">Click para subir imagen</span>
                            <span class="upload-hint">PNG, JPG o GIF (MAX. 2MB)</span>
                          </label>
                        </div>

                        <!-- Image preview -->
                        <div v-else class="image-preview-container">
                          <img id="img2" class="image-preview" v-bind:src="src_imagen_opcion">
                          <div class="image-overlay">
                            <label for="file2" class="overlay-btn">
                              <feather-icon icon="Edit2Icon" svgClasses="w-5 h-5" />
                              Cambiar
                            </label>
                            <button type="button" @click="quitarImagen(2)" class="overlay-btn overlay-btn-delete">
                              <feather-icon icon="Trash2Icon" svgClasses="w-5 h-5" />
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <!-- Option Text Input -->
                    <div class="option-input-section">
                      <vs-textarea
                        class="modern-textarea"
                        label="Texto de la opción"
                        placeholder="Ingrese el texto de la opción de respuesta"
                        v-model="opcion.opcion"
                        height="80px"
                      />
                    </div>

                    <!-- Type Selection and Action Buttons -->
                    <div class="option-footer-form" v-if="pregTipo===1 || pregTipo===5">
                      <div class="type-selector">
                        <label class="type-label">Tipo de respuesta:</label>
                        <div class="switch-container">
                          <vs-switch
                            color="success"
                            v-model="opcion.tipo"
                            class="modern-switch"
                          >
                            <span slot="on">✓ Correcta</span>
                            <span slot="off">✗ Incorrecta</span>
                          </vs-switch>
                        </div>
                      </div>

                      <div class="action-buttons-form">
                        <button
                          v-if="editarOpcionActiva===false"
                          type="button"
                          class="form-btn form-btn-add"
                          @click="cargarOpcion()"
                        >
                          <feather-icon icon="PlusIcon" svgClasses="w-5 h-5" />
                          <span>Agregar Opción</span>
                        </button>
                        <button
                          v-else
                          type="button"
                          class="form-btn form-btn-update"
                          @click="confirmEditarOpcion(opcion)"
                        >
                          <feather-icon icon="SaveIcon" svgClasses="w-5 h-5" />
                          <span>Actualizar Opción</span>
                        </button>
                        <button
                          v-if="editarOpcionActiva===true"
                          type="button"
                          class="form-btn form-btn-cancel"
                          @click="editarOpcionActiva=false; opcion.opcion=''; opcion.tipo=''; src_imagen_opcion=''"
                        >
                          <feather-icon icon="XIcon" svgClasses="w-5 h-5" />
                          <span>Cancelar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  </div>
                  <pre>
                  </pre>
                  <div class="vx-col w-full">
                    <vs-divider position="center" color="primary">Opciones agregadas</vs-divider>

                    <!-- Empty state -->
                    <div v-if="opciones.length === 0" class="empty-state">
                      <feather-icon icon="InboxIcon" svgClasses="w-16 h-16 text-gray-400 mb-3" />
                      <p class="text-gray-500">No hay opciones agregadas aún</p>
                      <p class="text-sm text-gray-400">Las opciones que agregues aparecerán aquí</p>
                    </div>

                    <!-- Options list -->
                    <div class="options-container">
                      <div
                        class="option-card"
                        :key="indexitem"
                        v-for="(item, indexitem) in opciones"
                        :class="{'option-card-correct': item.tipo == 1 || item.tipo === true, 'option-card-incorrect': item.tipo == 0 || item.tipo === false}"
                      >
                        <!-- Option number badge -->
                        <div class="option-number">
                          <span>{{ indexitem + 1 }}</span>
                        </div>

                        <!-- Card content wrapper -->
                        <div class="option-content">
                          <!-- Image section -->
                          <div class="option-image-wrapper" v-if="item.img_opcion">
                            <img
                              class="option-image"
                              v-bind:src="$data_url+'archivos/img/salle/img_preguntas/'+item.img_opcion"
                              :alt="'Imagen opción ' + (indexitem + 1)"
                            >
                          </div>

                          <!-- Text and actions section -->
                          <div class="option-details">
                            <!-- Option text -->
                            <div class="option-text">
                              <p>{{ item.opcion }}</p>
                            </div>

                            <!-- Status and actions row -->
                            <div class="option-footer">
                              <!-- Status badge -->
                              <div class="option-status">
                                <span
                                  class="status-badge"
                                  :class="item.tipo == 1 || item.tipo === true ? 'status-correct' : 'status-incorrect'"
                                >
                                  <feather-icon
                                    :icon="item.tipo == 1 || item.tipo === true ? 'CheckCircleIcon' : 'XCircleIcon'"
                                    svgClasses="w-4 h-4"
                                  />
                                  <span>{{ item.tipo == 1 || item.tipo === true ? 'Correcta' : 'Incorrecta' }}</span>
                                </span>
                              </div>

                              <!-- Action buttons -->
                              <div class="option-actions">
                                <button
                                  class="action-btn action-btn-edit"
                                  @click="editarOpcionActiva=true; editarOpcion(item)"
                                  title="Editar opción"
                                >
                                  <feather-icon icon="Edit2Icon" svgClasses="w-4 h-4" />
                                  <span class="btn-text">Editar</span>
                                </button>
                                <button
                                  class="action-btn action-btn-delete"
                                  @click="quitarOpcion(item)"
                                  title="Eliminar opción"
                                >
                                  <feather-icon icon="Trash2Icon" svgClasses="w-4 h-4" />
                                  <span class="btn-text">Eliminar</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              </vs-tab>
              <!-------FIN TAB OPCIONES PREG TIPO 1, 5----->
              <!-------INICIO TAB OPCIONES PREG TIPO 3, 4----->
              <vs-tab label="Respuesta" v-if="pregTipo===3 || pregTipo===4">
                  <div v-if="pregTipo===3" class="mt-6">
                  <div>
                      <vx-card class="mb-4 mt-6">
                          <vs-radio v-model="opcion.opcion" vs-name="radios1opcion" vs-value="Verdadero">Verdadero</vs-radio>
                      </vx-card>
                      <vx-card class="mb-4">
                          <vs-radio v-model="opcion.opcion" vs-name="radios1opcion" vs-value="Falso">Falso</vs-radio>
                      </vx-card>
                  </div>
                  </div>
                  <div class="vx-col w-full mt-6" align="right">
                      <vs-button  color="primary" type="filled" icon-pack="feather" icon="icon-edit-1" @click="editarOpcionesVF()">Guardar opción</vs-button>
                      <!-- <vs-button v-else color="success" type="filled" @click="editarActivo=true;cargarOpcionesVF()">Guardar</vs-button> -->
                  </div>
              </vs-tab>
              <!-------FIN TAB OPCIONES PREG TIPO 3, 4----->
              <!-------INICIO TAB OPCIONES PREG CERRADA-------->
              <vs-tab label="Palabras Clave" v-if="pregTipo===2">
                  <div class="vx-row mt-6">
                      <div class="vx-col w-full">
                          <vs-alert :active.sync="active1" closable icon-pack="feather" close-icon="icon-x" class="mb-3">
                              Ejemplo: Forma correcta: <span style="color: green;">24, mayo, 1822</span> - Forma Incorrecta: <span style="color: red;">24 de mayo, 1822 </span>
                          </vs-alert>
                          <div style="color: #1A76FA;" class="mb-4 w-full">Evite usar caracteres especiales como: punto, signos de expresión etc...</div>
                          <vs-textarea class="mb-3" label="Palabras clave de la respuesta" placeholder="Escriba las palabras clave de la respuesta separadas por una coma (,)." v-model="palabras_clave"  height="70px"/>
                      </div>
                  </div>
                  <div class="vx-row w-full">
                      <div class="vx-col sm:w-1/2 w-full">
                          <vs-input type="number" class="mb-2 w-full" label="Cantidad de coincidencias" v-model="pregunta.cant_coincidencias"/>
                      </div>
                      <div class="vx-col sm:w-1/2 w-full mt-5">
                          <vs-button class="w-full" v-if="editarActivo===true" @click="editarPalabrasclave" type="filled">Editar</vs-button>
                          <vs-button class="w-full" v-else @click="cargarOpcionAbierta" color="success" type="filled">Guardar</vs-button>
                      </div>
                  </div>
              </vs-tab>
              <!------FIN TAB OPCION TIPO PREG ABIERTA----->
            </vs-tabs>
          </vx-card>
    </div>
</template>
<script>
  import axios from 'axios'
  import vSelect from 'vue-select'
  import "quill/dist/quill.core.css";
  import "quill/dist/quill.snow.css";
  import "quill/dist/quill.bubble.css";
  import {
      quillEditor
  } from "vue-quill-editor";
export default{
    components:{
        quillEditor,
        vSelect,
    },
    data(){
        return{
            pregunta: {descripcion: '', tema: {id: '', label: ''}, respuesta: '', opcion1: '', opcion2: '', opcion3: '', img_pregunta: '', img_respuesta: '', img_opcion1: '', img_opcion2: '', img_opcion3: '', puntaje_pregunta: '', cant_coincidencias: 0},
            opcion: {id_opcion_pregunta: '', id_pregunta: '', opcion: '', img_opcion: '', tipo: ''},
            opciones: [],
            img_opcion_old:'',
            src_imagen_opcion:'',
            src_imagen_pregunta:'',
            activoPregunta:true,
            id_opcion_tipo234:'',
            palabras_clave:'',
            editarOpcionActiva:false,
            id_preguntaActiva: '',
        }
    },
    props:{
        usuario:{
            type:Object,
            default:{}
        },
        arregloPeriodos:{
            type:Array,
            default:[]
        },
        periodoSelect:{
            type:Number,
            default:0
        },
        editarActivo:{
            type:Boolean,
            default:false,
        },
        guardadoActivo:{
            type:Boolean,
            default:false
        },
        pregTipo:{
            type:Number,
            default:1
        },
        titPregTipo:{
            type:String,
            default:""
        },
        txtPregTipo:{
            type:String,
            default:""
        },
        areas:{
            type:Array,
            default:[]
        },
        asignaturas:{
            type:Array,
            default:[]
        },
        active1:{
            type:Boolean,
            default:false,
        },
        area_pregunta:{
            type:Object,
            default:{}
        },
        asignatura_pregunta:{
            type:Object,
            default:{}
        },
        preguntaSelect:{
            type:String,
            default:""
        },
        puntaje_pregunta:{
            type:Number,
            default:1
        },
    },
    watch:{
        guardadoActivo(results){
            if(results == false){
                this.limpiar()
            }
        },
    },
    mounted(){
        let me = this
        this.limpiar()
        if(me.editarActivo){
          me.f_getDataPregunta()
        }
    },
    methods:{
        f_getDataPregunta(){
          let me = this;
          this.$http.get(this.$server_url + `Post_traerPreguntaSalle?id_pregunta_send=${me.preguntaSelect.id_pregunta}`)
          .then(function (res) {
            let dataE               = res.data.items[0]
            if(dataE.pregunta.estado == 1){
            me.activoPregunta               = true
            }else{
            me.activoPregunta               = false
            }
            me.pregunta                     = dataE.pregunta
            me.id_preguntaActiva            = dataE.pregunta.id_pregunta;
            me.img_preg_old                 = dataE.pregunta.img_pregunta;
            me.puntaje_pregunta             = dataE.pregunta.puntaje_pregunta;
            if(dataE.pregunta.img_pregunta=='' || dataE.pregunta.img_pregunta==null || dataE.pregunta.img_pregunta=='null'){
            }else{
              me.src_imagen_pregunta = me.$data_url+'archivos/img/salle/img_preguntas/'+dataE.pregunta.img_pregunta;
            }
            ///mostrar opciones
            if(me.pregTipo == 3){
            if(dataE.opciones.length > 0){
                let preOpciones             = dataE.opciones.filter(p => p.tipo == '1')
                me.opcion                   = preOpciones[0]
            }
            }else{
            me.opcion = {}
            }
            me.opciones                     = dataE.opciones
            if(dataE.opciones.length > 0){
            me.palabras_clave               = dataE.opciones[0].opcion;
            me.pregunta.cant_coincidencias  = dataE.opciones[0].cant_coincidencias;
            me.id_opcion_tipo234            = dataE.opciones[0].id_opcion_pregunta;
            }

          })
          .catch(function (error) {
              console.log(error + ' error');
          })
        },
        agregar(){
            let me = this;
            if( me.pregunta.descripcion.trim() === '' || me.puntaje_pregunta === '' || me.puntaje_pregunta === undefined || me.asignatura_pregunta === null || me.asignatura_pregunta === undefined){
            me.$vs.notify({
            text:'Debe completar todos los campos antes de guardar',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
            return;
            }
            if( me.asignatura_pregunta.id_asignatura === '' || me.asignatura_pregunta.id_asignatura === undefined ){
            me.$vs.notify({
            text:'Seleccione una asignatura antes de guardar',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
            return;
            }
            me.$vs.loading()
            let fileImgPreg
            fileImgPreg = document.getElementById("file1").files[0];
            me.pregunta.file1 = fileImgPreg;
            const formData = new FormData();
            formData.append('descripcion',      me.pregunta.descripcion);
            formData.append('img_pregunta',     fileImgPreg);
            formData.append('id_tipo_pregunta', me.pregTipo);
            formData.append('id_asignatura',    me.asignatura_pregunta.id_asignatura);
            formData.append('puntaje_pregunta', me.puntaje_pregunta);
            formData.append('editor',           me.usuario.idusuario);
            formData.append('n_evaluacion',     me.periodoSelect)
            formData.append('estado',           1)
            axios.post(this.$data_url+'api/preguntas_salle', formData)
            .then(res => {
                me.id_preguntaActiva    = res.data.id_pregunta;
                me.$vs.loading.close()
                me.$emit('changeRecharge',4)
                me.$vs.notify({
                text:'Pregunta creada exitosamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error + ': error al crear pregunta');
            })
        },
        editarPregunta(){
            let me = this;
            if( me.pregunta.descripcion.trim() === '' || me.puntaje_pregunta === '' || me.puntaje_pregunta === undefined || me.asignatura_pregunta === null || me.asignatura_pregunta === undefined){
            me.$vs.notify({
                text:'Debe completar todos los campos antes de guardar',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-alert-triangle'})
            return;
            }
            if( me.asignatura_pregunta.id_asignatura === '' || me.asignatura_pregunta.id_asignatura === undefined ){
            me.$vs.notify({
                text:'Seleccione una asignatura antes de guardar',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-alert-triangle'})
            return;
            }
            me.$vs.loading()
            let fileImgPreg = document.getElementById("file1").files[0];
            if(fileImgPreg === undefined ){
                fileImgPreg = me.pregunta.img_pregunta;
            }
            const formData = new FormData();
            formData.append('id_pregunta',      me.pregunta.id_pregunta);
            formData.append('id_tipo_pregunta', me.pregTipo);
            formData.append('id_asignatura',    me.asignatura_pregunta.id_asignatura);
            formData.append('descripcion',      me.pregunta.descripcion);
            formData.append('img_pregunta',     fileImgPreg);
            formData.append('img_pregunta_old', me.img_preg_old);
            formData.append('puntaje_pregunta', me.puntaje_pregunta);
            formData.append('editor',           me.usuario.idusuario);
            formData.append('n_evaluacion',     me.periodoSelect);
            formData.append('estado',           me.pregunta.estado)
            axios.post(this.$data_url+'api/preguntas_salle', formData).then(res => {
            me.$emit('changeRecharge',2)
            me.img_preg_old = res.data.img_pregunta
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Pregunta editada correctamente',
            color:'success',
            iconPack: 'feather',
            icon:'icon-check'})
            })
            .catch(function (error) {
                console.log(error);
                me.$vs.loading.close()
            })
        },
        limpiar(){
            let me = this;
            this.src_imagen_pregunta        = '';
            this.src_imagen_opcion          = '';
            this.opciones                   = [];
            this.pregunta.descripcion       = '';
            this.pregunta.cant_coincidencias='';
            this.pregunta.opcion            = '';
            this.opcion.opcion              = '';
            this.opcion.tipo                = '';
            this.palabras_clave             = '';
            this.editarOpcionActiva         = false
            this.id_preguntaActiva          = '';
        },
        editarOpcion(item){
            let me                          = this;
            //cargar formulario de opciones
            me.img_opcion_old               = ""
            // location.href                   = '#editar'
            me.img_opcion_old               = item.img_opcion
            document.getElementById("file2").value = '';
            me.opcion                       = item
            // Solo asignar src_imagen_opcion si la imagen existe y no está vacía
            if(item.img_opcion && item.img_opcion !== '' && item.img_opcion !== 'null' && item.img_opcion !== null){
                me.src_imagen_opcion        = this.$data_url+'archivos/img/salle/img_preguntas/'+item.img_opcion;
            } else {
                me.src_imagen_opcion        = '';
            }
        },
        confirmEditarOpcion(item){
            let me                          = this;
            me.editarOpcionActiva           = false;
            let fileImgOpcion;
            fileImgOpcion = document.getElementById("file2").files[0];
            if(fileImgOpcion === undefined ){
                fileImgOpcion = item.img_opcion;
            }
            let tipo = 0;
            if( me.opcion.tipo === true || me.opcion.tipo === 1 ){
                tipo = 1;
            }
            const formData = new FormData();
            formData.append('opcion',               me.opcion.opcion);
            formData.append('tipo',                 tipo);
            formData.append('img_opcion',           fileImgOpcion);
            formData.append('img_opcion_old',       me.img_opcion_old);
            formData.append('id_opcion_pregunta',   item.id_opcion_pregunta);
            formData.append('id_pregunta',          item.id_pregunta);
            formData.append('cant_coincidencias',   0);
            formData.append('n_evaluacion',         me.periodoSelect);
            axios.post(this.$data_url+'api/editar_opcion_salle', formData)
            .then(res => {
                me.opciones             = res.data;
                me.editarOpcionActiva   = false;
                me.opcion.opcion        = '';
                me.opcion.tipo          = '';
                me.src_imagen_opcion    = '';
                me.$emit('changeRecharge',2)
                me.$vs.notify({
                text:'Opción editada correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        mostrarImg(file, img){
            let me                  = this;
            me.src_imagen_opcion    = ' ';
            me.src_imagen_pregunta  = ' ';
            var archivo = document.getElementById("file"+file).files[0];
            var reader = new FileReader();
            if (me) {
                reader.readAsDataURL(archivo );
                reader.onloadend = function () {
                    document.getElementById("img"+img).src = reader.result;
                }
            }
        },
        quitarOpcion(item){
            let me = this;
            axios.get(this.$data_url+'api/quitar_opcion_salle/'+item.id_opcion_pregunta)
            .then(res => {
                me.removeItemFromArr(me.opciones, item)
                me.$emit('changeRecharge',2)
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        removeItemFromArr (arr, item) {
          const i = arr.indexOf(item)
          arr.splice(i, 1)
        },
        quitarImagen(id){
          let me = this
          document.getElementById('file' + id).value = null;
          if( document.getElementById("img" + id) ){
            document.getElementById("img" + id).src = '';
          }
          if( id === 1 ){
            me.img_preg_old = ''
          }else{
            me.img_opcion_old = ''
          }
        },
        editarPalabrasclave(){
          let me = this;
          if( me.pregunta.cant_coincidencias === '' || me.pregunta.cant_coincidencias === undefined || me.pregunta.cant_coincidencias < 0){
              me.$vs.notify({
              text:'Ingrese la cantidad de coincidencias de palabras clave.',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check'})
              return
          }
          var cantCoin = parseInt(me.pregunta.cant_coincidencias)
          if( me.id_opcion_tipo234 != '' ){
              let palabrasV = me.palabras_clave.replace(/ /gi, '')
              const formData = new FormData();
              formData.append('opcion', palabrasV);
              formData.append('tipo', 1);
              formData.append('img_opcion', '');
              formData.append('img_opcion_old', '');
              formData.append('id_opcion_pregunta', me.id_opcion_tipo234);
              formData.append('id_pregunta', me.pregunta.id_pregunta);
              formData.append('cant_coincidencias', cantCoin);
              formData.append('n_evaluacion',         me.periodoSelect);
              me.$vs.loading()
              axios.post(this.$data_url+'api/editar_opcion_salle', formData)
              .then(res => {
                me.$vs.loading.close()
                  me.opciones           = res.data;
                  me.editarOpcionActiva = false;
                  me.opcion.opcion      = '';
                  me.opcion.tipo        = '';
                  me.src_imagen_opcion  = '';
                  me.$emit('changeRecharge',2)
                  me.$vs.loading.close()
                  me.$vs.notify({
                  text:'Palabras clave guardada correctamente',
                  color:'success',
                  iconPack: 'feather',
                  icon:'icon-check'})
              })
              .catch(function (error) {
                  me.$vs.loading.close()
                  console.log(error);
              })
          }else{
              me.cargarOpcionAbierta()
          }
        },
        cargarOpcion(){
            let me = this;
            if( me.id_preguntaActiva === '' ){
                me.$vs.notify({
                    text:'Debe crear una pregunta antes de cargar las opciones.',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
            }else{
                me.$vs.loading()
                const formData = new FormData();
                let fileImgPreg = document.getElementById("file2").files[0];
                let tipo = 0;
                if( me.opcion.tipo === true ){
                    tipo = 1;
                }
                formData.append('opcion',               me.opcion.opcion);
                formData.append('id_pregunta',          me.id_preguntaActiva);
                formData.append('img_opcion',           fileImgPreg);
                formData.append('tipo',                 tipo);
                formData.append('cant_coincidencias',   0);
                formData.append('n_evaluacion',         me.periodoSelect);
                axios.post(this.$data_url+'api/cargar_opcion_salle', formData)
                .then(res => {
                    me.opciones             = res.data;
                    me.opcion.opcion        = '';
                    me.opcion.tipo          = '';
                    me.src_imagen_opcion    = '';
                    document.getElementById("file2").value = '';
                    me.$vs.loading.close()
                    me.$emit('changeRecharge',2)
                    //notify guardado
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
            }
        },
        cargarOpcionAbierta(){
            let me = this;
            if( me.pregunta.cant_coincidencias === '' || me.pregunta.cant_coincidencias === undefined || me.pregunta.cant_coincidencias < 0){
            me.$vs.notify({
            text:'Ingrese la cantidad de coincidencias de palabras clave.',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            return
            }
            if( me.id_preguntaActiva === '' ){
            me.$vs.notify({
            text:'Debe crear una pregunta antes de cargar las opciones.',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
            }else{
            let tipo = 6;
            let palabrasV = me.palabras_clave.replace(/ /gi, '')
            const formData = new FormData();
            formData.append('opcion',               palabrasV);
            formData.append('tipo',                 tipo);
            formData.append('img_opcion',           null);
            formData.append('id_pregunta',          me.id_preguntaActiva);
            formData.append('cant_coincidencias',   parseInt(me.pregunta.cant_coincidencias));
            formData.append('n_evaluacion',         me.periodoSelect);
            me.$vs.loading()
            axios.post(this.$data_url+'api/cargar_opcion_salle', formData)
            .then(res => {
                me.id_opcion_tipo234       = res.data[0].id_opcion_pregunta
                me.opciones             = res.data;
                me.opcion.opcion        = '';
                me.opcion.tipo          = '';
                me.src_imagen_opcion    = '';
                me.$emit('changeRecharge',2)
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Palabras clave guardadas correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error);
            })
            }
        },
        cargarOpcionesVF(){
            let me = this;
            if( me.id_preguntaActiva === '' ){
                me.$vs.notify({
                text:'Debe crear una pregunta antes de cargar las opciones.',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
            }else{
                me.$vs.loading()
                const formData = new FormData();
                formData.append('opcion',       me.opcion.opcion);
                formData.append('id_pregunta',  me.id_preguntaActiva);
                formData.append('img_opcion', null);
                formData.append('tipo', 1);
                formData.append('cant_coincidencias', 0);
                this.$http.post(this.$server_url+'cargar_opcion_vf_salle', formData)
                .then(res => {
                    // me.opcion.opcion        = '';
                    // me.opcion.tipo          = '';
                    me.editarActivo            = true
                    me.src_imagen_opcion       = '';
                    me.$vs.loading.close()
                    me.$vs.notify({
                    text:'Opción guardada correctamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    me.$emit('changeRecharge',3)
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
            }
        },
        editarOpcionesVF(){
            let me = this;
            me.$vs.loading()
            const formData = new FormData();
                formData.append('opcion',       me.opcion.opcion);
                formData.append('id_pregunta',  me.id_preguntaActiva);
                formData.append('img_opcion', null);
                formData.append('tipo', 1);
                formData.append('id_opcion', 1);
                formData.append('cant_coincidencias', 0);
            this.$http.post(this.$server_url+'cargar_opcion_vf_salle', formData)
            .then(res => {
                me.$vs.loading.close()
                me.$emit('changeRecharge',2)
                me.$vs.notify({
                text:'Opción guardada correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error);
            })
        },
        transformarPregunta(){
            let me = this
            me.$vs.loading()
            const formData = new FormData();
            formData.append('id_pregunta', me.pregunta.id_pregunta);
            formData.append('id_tipo_pregunta', me.pregTipo);
            this.$http.post(this.$server_url+'transformar_preguntas_salle', formData).then(res => {
            me.$vs.notify({
            text:'Pregunta transformada correctamente.',
            color:'primary',
            iconPack: 'feather',
            icon:'icon-check'})
            me.$emit('changeRecharge',1)
            me.$vs.loading.close()
            })
            .catch(function (error) {
            me.$vs.loading.close()
            })
        },
        //METODOS PARA CAMBIAR ESTADO PREGUNTA
        CambiarEstadoPreguntaSalle(){
            let me        = this
            let est       = 0
            if(me.activoPregunta){
            est         = 1
            }else{
            est         = 0
            }
            me.pregunta.estado = est
            let formData  = new FormData();
            formData.append('id_pregunta',    me.pregunta.id_pregunta);
            formData.append('estado',         est)
            me.$vs.loading()
            this.$http.post(this.$server_url+'CambiarEstadoPreguntaSalle', formData)
            .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({
            text:'Se cambio de estado correctamente',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            })
            me.$emit('changeRecharge',2)
            })
        },
       //FIN METODOS PARA CAMBIAR ESTADO PREGUNTA
    }
}
</script>

<style scoped lang="scss">
/* ============================================
   OPCIONES AGREGADAS - MODERN DESIGN
   ============================================ */

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  text-align: center;
  animation: fadeIn 0.4s ease-in;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Options Container */
.options-container {
  display: grid;
  gap: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 2rem;
}

/* Option Card */
.option-card {
  position: relative;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 12px;
  padding: 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  animation: slideIn 0.3s ease-out backwards;
  animation-delay: calc(var(--index, 0) * 50ms);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.option-card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.option-card-correct {
  border-left: 4px solid #28a745;
}

.option-card-correct:hover {
  border-color: #28a745;
  background: linear-gradient(135deg, #f0fff4 0%, #e6f9ec 100%);
}

.option-card-incorrect {
  border-left: 4px solid #dc3545;
}

.option-card-incorrect:hover {
  border-color: #dc3545;
  background: linear-gradient(135deg, #fff5f5 0%, #ffe5e5 100%);
}

/* Option Number Badge */
.option-number {
  position: absolute;
  top: -10px;
  left: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.875rem;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
  z-index: 10;
  transition: all 0.3s ease;
}

.option-card:hover .option-number {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.5);
}

/* Card Content */
.option-content {
  display: flex;
  gap: 1.5rem;
  align-items: flex-start;
  width: 100%;
}

/* Image Wrapper */
.option-image-wrapper {
  width: 120px;
  height: 120px;
  flex-shrink: 0;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  background: #f0f0f0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.option-card:hover .option-image-wrapper {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: scale(1.05);
}

.option-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.option-card:hover .option-image {
  transform: scale(1.1);
}

/* Option Details */
.option-details {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;
}

/* Option Text */
.option-text {
  width: 100%;
  min-height: 40px;
  display: flex;
  align-items: center;
}

.option-text p {
  font-size: 1rem;
  line-height: 1.6;
  color: #2c3e50;
  margin: 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  font-weight: 500;
}

/* Option Footer */
.option-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* Status Badge */
.option-status {
  display: flex;
  align-items: center;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.375rem 0.875rem;
  border-radius: 20px;
  font-size: 0.813rem;
  font-weight: 600;
  transition: all 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.status-correct {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.status-incorrect {
  background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
  color: white;
}

.status-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12);
}

/* Action Buttons */
.option-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  background: white;
  color: #495057;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  outline: none;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.action-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.action-btn-edit {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
}

.action-btn-edit:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.action-btn-delete {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.action-btn-delete:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  box-shadow: 0 4px 12px rgba(220, 53, 69, 0.3);
}

.btn-text {
  display: inline;
}

/* Responsive Design */
@media (max-width: 768px) {
  .option-content {
    grid-template-columns: 1fr;
  }

  .option-image-wrapper {
    width: 100%;
    height: 180px;
    margin: 0 auto;
  }

  .option-footer {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .option-actions {
    width: 100%;
    justify-content: stretch;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .btn-text {
    display: inline;
  }
}

@media (max-width: 480px) {
  .option-card {
    padding: 1rem;
  }

  .option-number {
    width: 28px;
    height: 28px;
    font-size: 0.75rem;
    top: -8px;
    left: 12px;
  }

  .option-actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
  }
}

/* Dark Mode Support */
.theme-dark {
  .option-card {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  }

  .option-card:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }

  .option-card-correct:hover {
    background: linear-gradient(135deg, #2f4538 0%, #1e3a2a 100%);
  }

  .option-card-incorrect:hover {
    background: linear-gradient(135deg, #4a2e32 0%, #3a2228 100%);
  }

  .option-text p {
    color: #e2e8f0;
  }

  .option-footer {
    border-top-color: rgba(255, 255, 255, 0.1);
  }

  .action-btn {
    background: #374151;
    color: #e5e7eb;
  }

  .option-image-wrapper {
    background: #1a202c;
  }
}

/* Animation for nth-child items */
.option-card:nth-child(1) { --index: 0; }
.option-card:nth-child(2) { --index: 1; }
.option-card:nth-child(3) { --index: 2; }
.option-card:nth-child(4) { --index: 3; }
.option-card:nth-child(5) { --index: 4; }
.option-card:nth-child(6) { --index: 5; }
.option-card:nth-child(7) { --index: 6; }
.option-card:nth-child(8) { --index: 7; }
.option-card:nth-child(9) { --index: 8; }
.option-card:nth-child(10) { --index: 9; }

/* ============================================
   CREAR/EDITAR OPCIONES - FORM SECTION
   ============================================ */

/* Divider Title */
.divider-title {
  display: inline-flex;
  align-items: center;
  font-weight: 600;
  font-size: 1rem;
  color: #28a745;
}

/* Create Option Card */
.create-option-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafb 100%);
  border-radius: 12px;
  padding: 1.75rem;
  margin: 1.5rem 0 2rem 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(40, 167, 69, 0.1);
  transition: all 0.3s ease;
}

.create-option-card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
}

/* Upload Section */
.upload-section {
  margin-bottom: 1.5rem;
}

.upload-label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: #495057;
  margin-bottom: 0.75rem;
}

.upload-area {
  position: relative;
  min-height: 200px;
  border: 2px dashed #cbd5e0;
  border-radius: 10px;
  background: #f8f9fa;
  transition: all 0.3s ease;
  overflow: hidden;
}

.upload-area:hover {
  border-color: #667eea;
  background: #f0f4ff;
}

.upload-area.has-image {
  border-style: solid;
  border-color: transparent;
  background: transparent;
}

.inputfile {
  width: 0.1px;
  height: 0.1px;
  opacity: 0;
  overflow: hidden;
  position: absolute;
  z-index: -1;
}

/* Upload Placeholder */
.upload-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 2rem;
}

.upload-btn-primary {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.upload-btn-primary:hover {
  transform: translateY(-4px);
}

.upload-btn-primary:hover .upload-text {
  color: #667eea;
}

.upload-text {
  font-size: 1rem;
  font-weight: 600;
  color: #495057;
  margin-bottom: 0.5rem;
  transition: color 0.3s ease;
}

.upload-hint {
  font-size: 0.75rem;
  color: #6c757d;
}

/* Image Preview Container */
.image-preview-container {
  position: relative;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.image-preview {
  width: 100%;
  height: auto;
  display: block;
  max-height: 300px;
  object-fit: cover;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-preview-container:hover .image-overlay {
  opacity: 1;
}

.overlay-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: white;
  color: #495057;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.overlay-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.overlay-btn-delete {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: white;
}

.overlay-btn-delete:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
}

/* Option Input Section */
.option-input-section {
  margin-bottom: 1.5rem;
}

.modern-textarea {
  width: 100%;
}

/* Option Footer Form */
.option-footer-form {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding-top: 1rem;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
}

/* Type Selector */
.type-selector {
  flex: 1;
  min-width: 200px;
}

.type-label {
  display: block;
  font-weight: 600;
  font-size: 0.875rem;
  color: #495057;
  margin-bottom: 0.75rem;
}

.switch-container {
  display: flex;
  align-items: center;
}

.modern-switch {
  transform: scale(1.1);
}

/* Action Buttons Form */
.action-buttons-form {
  display: flex;
  gap: 0.75rem;
  align-items: center;
  flex-wrap: wrap;
}

.form-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  outline: none;
  white-space: nowrap;
}

.form-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.form-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.form-btn-add {
  background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
  color: white;
}

.form-btn-add:hover {
  background: linear-gradient(135deg, #20c997 0%, #17a2b8 100%);
  box-shadow: 0 6px 16px rgba(40, 167, 69, 0.3);
}

.form-btn-update {
  background: linear-gradient(135deg, #007bff 0%, #0056b3 100%);
  color: white;
}

.form-btn-update:hover {
  background: linear-gradient(135deg, #0056b3 0%, #004085 100%);
  box-shadow: 0 6px 16px rgba(0, 123, 255, 0.3);
}

.form-btn-cancel {
  background: linear-gradient(135deg, #6c757d 0%, #5a6268 100%);
  color: white;
}

.form-btn-cancel:hover {
  background: linear-gradient(135deg, #5a6268 0%, #4e555b 100%);
  box-shadow: 0 6px 16px rgba(108, 117, 125, 0.3);
}

/* Responsive Design for Form */
@media (max-width: 768px) {
  .create-option-card {
    padding: 1.25rem;
  }

  .option-footer-form {
    flex-direction: column;
    align-items: stretch;
  }

  .action-buttons-form {
    width: 100%;
    flex-direction: column;
  }

  .form-btn {
    width: 100%;
    justify-content: center;
  }

  .type-selector {
    width: 100%;
  }

  .image-preview {
    max-height: 250px;
  }
}

@media (max-width: 480px) {
  .create-option-card {
    padding: 1rem;
  }

  .upload-placeholder {
    min-height: 150px;
    padding: 1rem;
  }

  .upload-btn-primary {
    padding: 1rem;
  }

  .upload-text {
    font-size: 0.875rem;
  }

  .form-btn {
    padding: 0.625rem 1.25rem;
    font-size: 0.813rem;
  }
}

/* Dark Mode Support for Form */
.theme-dark {
  .create-option-card {
    background: linear-gradient(135deg, #2d3748 0%, #1a202c 100%);
    border-color: rgba(40, 167, 69, 0.2);
  }

  .upload-area {
    background: #1a202c;
    border-color: #4a5568;
  }

  .upload-area:hover {
    border-color: #667eea;
    background: #2d3748;
  }

  .upload-label,
  .type-label {
    color: #e2e8f0;
  }

  .upload-text {
    color: #cbd5e0;
  }

  .upload-hint {
    color: #a0aec0;
  }

  .option-footer-form {
    border-top-color: rgba(255, 255, 255, 0.1);
  }
}
</style>
