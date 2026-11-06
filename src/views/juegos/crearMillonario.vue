<template>
  <div>
    <!-- Wizard Steps -->
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

    <!-- Step 1: Game Configuration -->
    <vx-card v-if="tabActivo === 1">
      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full mt-5">
          <label class="vs-input--label">Asignatura</label>
          <v-select v-model="asignaturaSelected" :options="asignaturas" :disabled="tipoUsuario === 6"
            :dir="$vs.rtl ? 'rtl' : 'ltr'" />
        </div>
        <div class="vx-col md:w-1/2 w-full mt-5">
          <label class="vs-input--label">Unidad</label>
          <v-select v-model="unidadSelected" :options="unidades" @input="getTemas" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
        </div>

        <div class="vx-col w-full mt-5">
          <label class="vs-input--label">Temas</label>
          <v-select multiple :closeOnSelect="false" :options="temas" :reduce="tema => tema" label="nombre_tema"
            class="w-full" v-model="id_temas" />
        </div>

        <div class="vx-col md:w-1/2 w-full mt-5">
          <vs-input label="Título del juego" v-model="juego.nombre_juego" class="w-full" />
        </div>
        <div class="vx-col md:w-1/2 w-full mt-5">
          <vs-input label="Descripción" v-model="juego.descripcion_juego" class="w-full" />
        </div>

        <div class="vx-col md:w-1/3 w-full mt-5">
          <vs-input type="number" min="1" label="Puntos" v-model="juego.puntos" class="w-full" />
        </div>

        <div class="vx-col md:w-1/3 w-full mt-5">
          <vs-input type="number" min="1" label="Duración (minutos)" v-model="juego.duracion" class="w-full" />
        </div>

        <div class="vx-col md:w-1/3 w-full mt-5">
          <label class="vs-input--label">Estado</label>
          <vs-switch v-model="juego.estado_juego" class="mt-2 w-full">
            <span slot="on">Activo</span>
            <span slot="off">Inactivo</span>
          </vs-switch>
        </div>
      </div>

      <vs-divider></vs-divider>

      <div class="vx-row">
        <div class="vx-col md:w-1/2 w-full text-left">
          <vs-button type="filled" @click="$router.go(-1)">Volver</vs-button>
        </div>
        <div class="vx-col md:w-1/2 w-full text-right">
          <vs-button type="filled" v-if="!juego.id_juego" @click="agregarJuego">
            Siguiente
          </vs-button>
          <vs-button type="filled" v-else @click="editarJuego">
            Siguiente
          </vs-button>
        </div>
      </div>
    </vx-card>

    <!-- Step 2: Questions Management -->
    <div v-if="tabActivo === 2">
      <vx-card>
        <div class="vx-row mb-4">
          <div class="vx-col w-full flex justify-between items-center">
            <div>
              <span class="text-lg font-semibold">Total preguntas: {{ preguntas.length }}</span>
            </div>
            <div>
              <vs-button :color="view_op === 1 ? 'success' : 'primary'" @click="toggleView">
                <span v-if="view_op === 1">Ver preguntas</span>
                <span v-else>Agregar pregunta</span>
              </vs-button>
            </div>
          </div>
        </div>

        <!-- Question Form -->
        <div v-if="view_op === 1" class="question-form">
          <div class="pregunta-card">
            <div class="vx-row">
              <div class="vx-col md:w-1/2 w-full">
                <vs-textarea v-model="formPregunta.pregunta" label="Pregunta" class="w-full"
                  :danger="!!formErrors.pregunta" :danger-text="formErrors.pregunta" />
              </div>
              <div class="vx-col md:w-1/2 w-full">
                <div class="image-upload-section">
                  <div v-if="currentImage.pregunta" class="current-image">
                    <span class="font-semibold">Imagen actual:</span>
                    <div class="flex items-center mt-2">
                      <img @click="mostrarImagen(currentImage.pregunta)" height="70"
                        :src="getImageUrl(currentImage.pregunta)" class="cursor-pointer mr-2">
                      <vs-button @click="eliminarImagen('pregunta', formPregunta.id_contenido_juego)" size="small"
                        icon-pack="feather" icon="icon-trash" color="danger" type="border" />
                    </div>
                  </div>
                  <div v-else>
                    <input type="file" ref="filePregunta" accept="image/*" class="hidden"
                      @change="handleImageUpload('pregunta', $event)">
                    <vs-button icon-pack="feather" icon="icon-image" color="dark" type="border"
                      @click="$refs.filePregunta.click()">
                      Seleccionar imagen
                      <small>(opcional)</small>
                    </vs-button>
                    <p><small>Tamaño máximo: {{ limiteMegas }} MB</small></p>
                  </div>
                  <div v-if="uploadProgress.pregunta > 0" class="mt-2">
                    <vs-progress :percent="uploadProgress.pregunta" color="success" />
                  </div>
                  <small v-if="uploadErrors.pregunta" class="text-danger">{{ uploadErrors.pregunta }}</small>
                </div>
              </div>
            </div>
          </div>

          <!-- Options -->
          <div class="options-container mt-4">
            <div v-for="index in 4" :key="index" class="option-card mb-4">
              <vs-divider>Opción {{ index }} {{ index <= 2 ? '- requerida' : '' }}</vs-divider>
                  <div class="vx-row">
                    <div class="vx-col md:w-1/4">
                      <label>¿Respuesta correcta?</label>
                      <vs-checkbox v-model="formOpciones[index - 1].correcta" class="p-2">Sí</vs-checkbox>
                    </div>
                    <div class="vx-col md:w-1/3">
                      <label>Respuesta</label>
                      <vs-input v-model="formOpciones[index - 1].texto" class="w-full"
                        :danger="!!formErrors[`opcion${index}`]" />
                    </div>
                    <div class="vx-col md:w-1/3">
                      <div class="image-upload-section">
                        <div v-if="currentImage[`opcion${index}`]" class="current-image">
                          <div class="flex items-center">
                            <img @click="mostrarImagen(currentImage[`opcion${index}`])" height="50"
                              :src="getImageUrl(currentImage[`opcion${index}`])" class="cursor-pointer mr-2">
                            <vs-button @click="eliminarImagen(`opcion${index}`, formOpciones[index - 1].id)" size="small"
                              icon-pack="feather" icon="icon-trash" color="danger" type="border" />
                          </div>
                        </div>
                        <div v-else>
                          <input type="file" :ref="'fileOpcion' + index" accept="image/*" class="hidden"
                            @change="handleImageUpload('opcion' + index, $event)">
                          <vs-button icon-pack="feather" icon="icon-image" color="dark" type="border"
                            @click="$refs['fileOpcion' + index][0].click()">
                            Imagen <small>(opcional)</small>
                          </vs-button>
                        </div>
                        <div v-if="uploadProgress[`opcion${index}`] > 0" class="mt-2">
                          <vs-progress :percent="uploadProgress[`opcion${index}`]" color="success" />
                        </div>
                        <small v-if="uploadErrors[`opcion${index}`]"
                          class="text-danger">{{ uploadErrors[`opcion${index}`] }}</small>
                      </div>
                    </div>
                  </div>
                  <small v-if="formErrors[`opcion${index}`]"
                    class="text-danger">{{ formErrors[`opcion${index}`] }}</small>
            </div>

            <div class="vx-row">
              <vs-button class="mx-auto" :color="modoEdicion ? 'warning' : 'success'" @click="guardarPregunta"
                icon-pack="feather" :icon="modoEdicion ? 'icon-edit' : 'icon-save'">
                {{ modoEdicion ? 'Actualizar' : 'Guardar' }} pregunta
              </vs-button>
            </div>
          </div>
        </div>

        <!-- Questions List -->
        <div v-if="view_op === 2" class="questions-list">
          <vs-table stripe max-items="50" search pagination :data="preguntas">
            <template slot="thead">
              <vs-th>Imagen</vs-th>
              <vs-th>Pregunta</vs-th>
              <vs-th>Opciones</vs-th>
              <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
              <vs-tr v-for="(item, index) in data" :key="index">
                <vs-td>
                  <vs-avatar v-if="item.pregunta.imagen" @click="mostrarImagen(item.pregunta.imagen)" size="70px"
                    :src="getImageUrl(item.pregunta.imagen)" class="cursor-pointer" />
                </vs-td>
                <vs-td>{{ item.pregunta.pregunta }}</vs-td>
                <vs-td>
                  <div class="options-grid">
                    <div v-for="(opcion, idx) in item.opciones" :key="idx" class="option-item flex items-center mb-1">
                      <vs-button :color="opcion.tipo_opcion === 1 ? 'success' : 'danger'" size="small"
                        :icon-pack="opcion.tipo_opcion === 1 ? 'feather' : 'feather'"
                        :icon="opcion.tipo_opcion === 1 ? 'icon-check' : 'icon-x'" class="mr-2" />
                      <span v-if="opcion.imagen_opcion">
                        <vs-avatar @click="mostrarImagen(opcion.imagen_opcion)" size="30px"
                          :src="getImageUrl(opcion.imagen_opcion)" class="cursor-pointer mr-2" />
                      </span>
                      <span>{{ opcion.nombre_opcion }}</span>
                    </div>
                  </div>
                </vs-td>
                <vs-td>
                  <vs-button color="success" type="filled" @click="editarPregunta(item)">
                    Editar
                  </vs-button>
                </vs-td>
              </vs-tr>
            </template>
          </vs-table>
        </div>

        <vs-divider></vs-divider>

        <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full text-left">
            <vs-button type="filled" @click="cambiarPaso(1)">Atrás</vs-button>
          </div>
          <div class="vx-col sm:w-1/2 w-full text-right">
            <vs-button type="filled" @click="cambiarPaso(3)">Siguiente</vs-button>
          </div>
        </div>
      </vx-card>
    </div>

    <!-- Step 3: Technical Sheet -->
    <vx-card v-if="tabActivo === 3" class="mt-5">
      <div class="vx-row">
        <div class="vx-col sm:w-1/3 w-full">
          <label class="font-semibold">Bloque curricular</label>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input v-model="fichaTecnica.bloque_curricular" class="mb-6 w-full" />
        </div>

        <div class="vx-col sm:w-1/3 w-full">
          <label class="font-semibold">Grado</label>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input v-model="fichaTecnica.grado" class="mb-6 w-full" />
        </div>

        <div class="vx-col sm:w-1/3 w-full">
          <label class="font-semibold">Destrezas</label>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-textarea v-model="fichaTecnica.destrezas" class="mb-6 w-full" />
        </div>

        <div class="vx-col sm:w-1/3 w-full">
          <label class="font-semibold">Habilidades</label>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-textarea v-model="fichaTecnica.habilidades" class="mb-6 w-full" />
        </div>

        <div class="vx-col sm:w-1/3 w-full">
          <label class="font-semibold">Elaborado por</label>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-input v-model="fichaTecnica.elaborado_por" class="mb-6 w-full" />
        </div>

        <div class="vx-col sm:w-1/3 w-full">
          <label class="font-semibold">Intención didáctica</label>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-textarea v-model="fichaTecnica.intencion_didactica" class="mb-6 w-full" />
        </div>

        <div class="vx-col sm:w-1/3 w-full">
          <label class="font-semibold">Consigna</label>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-textarea v-model="fichaTecnica.consigna" class="mb-6 w-full" />
        </div>

        <div class="vx-col sm:w-1/3 w-full">
          <label class="font-semibold">Consideraciones</label>
        </div>
        <div class="vx-col sm:w-2/3 w-full">
          <vs-textarea v-model="fichaTecnica.consideraciones" class="mb-6 w-full" />
        </div>
      </div>

      <vs-divider></vs-divider>

      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full text-left">
          <vs-button type="filled" @click="cambiarPaso(2)">Atrás</vs-button>
        </div>
        <div class="vx-col sm:w-1/2 w-full text-right">
          <vs-button type="filled" @click="guardarFicha">Guardar Ficha</vs-button>
        </div>
      </div>
    </vx-card>

    <!-- Image Modal -->
    <vs-popup title="Imagen" :active.sync="modalImagen">
      <div class="text-center">
        <img v-if="imagenSeleccionada" :src="getImageUrl(imagenSeleccionada)" class="max-w-full">
      </div>
    </vs-popup>
  </div>
</template>

<script>
import vSelect from 'vue-select'
import 'vue-select/dist/vue-select.css'

export default {
  components: {
    'v-select': vSelect
  },
  data() {
    return {
      // Wizard
      tabActivo: 1,
      view_op: 2,

      // User and game data
      usuario: JSON.parse(localStorage.getItem('usuario')) || {},
      tipoUsuario: 0,
      id_tipo_juego: localStorage.getItem('id_tipo_juego'),
      id_juego: '',

      // Selections
      asignaturaSelected: null,
      unidadSelected: { id: "1", label: "Unidad 1" },
      id_temas: [],

      // Lists
      asignaturas: [],
      temas: [],
      preguntas: [],

      // Game data
      juego: {
        nombre_juego: '',
        descripcion_juego: '',
        puntos: '',
        duracion: '',
        estado_juego: true
      },

      // Question form
      formPregunta: {
        id_contenido_juego: '',
        pregunta: ''
      },
      formOpciones: [
        { id: '', texto: '', correcta: false },
        { id: '', texto: '', correcta: false },
        { id: '', texto: '', correcta: false },
        { id: '', texto: '', correcta: false }
      ],

      // Images management
      currentImage: {
        pregunta: '',
        opcion1: '',
        opcion2: '',
        opcion3: '',
        opcion4: ''
      },
      uploadFiles: {
        pregunta: null,
        opcion1: null,
        opcion2: null,
        opcion3: null,
        opcion4: null
      },
      uploadProgress: {
        pregunta: 0,
        opcion1: 0,
        opcion2: 0,
        opcion3: 0,
        opcion4: 0
      },
      uploadErrors: {
        pregunta: '',
        opcion1: '',
        opcion2: '',
        opcion3: '',
        opcion4: ''
      },

      // Technical sheet
      fichaTecnica: {
        bloque_curricular: '',
        grado: '',
        destrezas: '',
        habilidades: '',
        elaborado_por: '',
        intencion_didactica: '',
        consigna: '',
        consideraciones: ''
      },

      // Validation
      formErrors: {},

      // UI state
      modoEdicion: false,
      modalImagen: false,
      imagenSeleccionada: '',

      // Constants
      bytesPorMega: 1048576,
      limiteMegas: 0.7,
      rutaImages: 'archivos/images/imagenes_juegos/seleccionSimple/',

      // Predefined units
      unidades: [
        { id: "1", label: "Unidad 1" },
        { id: "2", label: "Unidad 2" },
        { id: "3", label: "Unidad 3" },
        { id: "4", label: "Unidad 4" },
        { id: "5", label: "Unidad 5" },
        { id: "6", label: "Unidad 6" },
        { id: "7", label: "Unidad 7" },
        { id: "8", label: "Unidad 8" }
      ]
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.tipoUsuario = this.usuario.id_group || 1

      if (localStorage.idasignatura) {
        this.asignaturaSelected = {
          id: localStorage.idasignatura,
          label: localStorage.nombreasignatura
        }
      }

      const savedGame = JSON.parse(localStorage.getItem('data_juego'))
      if (savedGame) {
        this.juego = savedGame
        this.id_juego = savedGame.id_juego
        if (savedGame.temas && savedGame.temas.length) {
          this.asignaturaSelected = {
            id: savedGame.temas[0].idasignatura,
            label: savedGame.temas[0].nombreasignatura
          }
          this.id_temas = savedGame.temas.map(t => ({
            id: t.id,
            nombre_tema: t.nombre_tema
          }))
        }
      }

      this.getAsignaturas()
      this.getTemas()
      if (this.id_juego) {
        this.getPreguntas()
        this.getFicha()
      }
    },

    toggleView() {
      this.view_op = this.view_op === 1 ? 2 : 1
      if (this.view_op === 1) {
        this.limpiarFormularioPregunta()
      }
    },

    cambiarPaso(paso) {
      this.tabActivo = paso
      this.actualizarWizard(paso)
    },

    actualizarWizard(paso) {
      for (let i = 1; i <= 3; i++) {
        const btn = document.getElementById(`btnNav${i}`)
        if (btn) {
          btn.className = i === paso ? 'btnwizardSelect' : 'btnwizard'
        }
      }
    },

    getImageUrl(imageName) {
      return `${this.$data_url}${this.rutaImages}${imageName}`
    },

    async getAsignaturas() {
      if (this.tipoUsuario !== 1) return

      try {
        const response = await this.$http.get(`${this.$server_url}asignaturasDoc/0`)
        this.asignaturas = response.data
      } catch (error) {
        console.error('Error loading subjects:', error)
      }
    },

    async getTemas() {
      if (
        !this.asignaturaSelected ||
        !this.asignaturaSelected.id ||
        !this.unidadSelected ||
        !this.unidadSelected.id
      ) return

      try {
        this.$vs.loading()
        const formData = new FormData()
        formData.append('asignatura', this.asignaturaSelected.id)
        formData.append('unidad', this.unidadSelected.id)

        const response = await this.$http.post(`${this.$server_url}temasignunidad`, formData)
        this.temas = response.data
      } catch (error) {
        console.error('Error loading topics:', error)
      } finally {
        this.$vs.loading.close()
      }
    },

    async getPreguntas() {
      if (!this.id_juego) return

      try {
        this.$vs.loading()
        const response = await this.$http.get(`${this.$server_url}pregunta_opciones/${this.id_juego}`)
        this.preguntas = response.data.items || []
      } catch (error) {
        console.error('Error loading questions:', error)
      } finally {
        this.$vs.loading.close()
      }
    },

    async getFicha() {
      if (!this.id_juego) return

      try {
        this.$vs.loading()
        const response = await this.$http.get(`${this.$server_url}j_juegos/${this.id_juego}`)
        if (response.data[0]) {
          const data = response.data[0]
          Object.keys(this.fichaTecnica).forEach(key => {
            this.fichaTecnica[key] = data[key] && data[key] !== 'null' ? data[key] : ''
          })
        }
      } catch (error) {
        console.error('Error loading technical sheet:', error)
      } finally {
        this.$vs.loading.close()
      }
    },

    async agregarJuego() {
      if (!this.validarJuego()) return

      try {
        this.$vs.loading()
        const formData = new FormData()
        formData.append('id_tipo_juego', this.id_tipo_juego)
        formData.append('id_docente', this.usuario.idusuario)
        formData.append('nombre_juego', this.juego.nombre_juego)
        formData.append('descripcion_juego', this.juego.descripcion_juego)
        formData.append('puntos', this.juego.puntos)
        formData.append('duracion', this.juego.duracion)
        formData.append('fecha_inicio', '2021-01-01 12:00:00')
        formData.append('fecha_fin', '2021-01-01 12:00:00')
        formData.append('estado', this.juego.estado_juego ? 1 : 0)

        const response = await this.$http.post(`${this.$server_url}j_juegos`, formData)
        this.id_juego = response.data.id_juego
        await this.guardarTemasJuego()
        this.cambiarPaso(2)
      } catch (error) {
        console.error('Error creating game:', error)
        this.$vs.notify({
          title: 'Error',
          text: 'Error al crear el juego',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      } finally {
        this.$vs.loading.close()
      }
    },

    async editarJuego() {
      if (!this.validarJuego()) return

      try {
        this.$vs.loading()
        const formData = new FormData()
        formData.append('id_juego', this.id_juego)
        formData.append('id_tipo_juego', this.id_tipo_juego)
        formData.append('id_docente', this.usuario.idusuario)
        formData.append('nombre_juego', this.juego.nombre_juego)
        formData.append('descripcion_juego', this.juego.descripcion_juego)
        formData.append('puntos', this.juego.puntos)
        formData.append('duracion', this.juego.duracion)
        formData.append('fecha_inicio', '2021-01-01 12:00:00')
        formData.append('fecha_fin', '2021-01-01 12:00:00')
        formData.append('estado', this.juego.estado_juego ? 1 : 0)

        await this.$http.post(`${this.$server_url}j_juegos`, formData)
        await this.eliminarTemasJuego()
        this.cambiarPaso(2)
      } catch (error) {
        console.error('Error editing game:', error)
        this.$vs.notify({
          title: 'Error',
          text: 'Error al editar el juego',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      } finally {
        this.$vs.loading.close()
      }
    },

    async eliminarTemasJuego() {
      try {
        await this.$http.get(`${this.$server_url}eliminarTemasJuego/${this.id_juego}`)
        await this.guardarTemasJuego()
      } catch (error) {
        console.error('Error deleting game topics:', error)
      }
    },

    async guardarTemasJuego() {
      try {
        const temasVector = this.id_temas.map(t => t.id)
        const formData = new FormData()
        formData.append('id_juego', this.id_juego)
        formData.append('id_temas', temasVector)

        await this.$http.post(`${this.$server_url}guardarTemasJuego`, formData)
        this.getPreguntas()
      } catch (error) {
        console.error('Error saving game topics:', error)
      }
    },

    validarJuego() {
      if (!this.id_temas.length ||
        !this.juego.nombre_juego ||
        !this.juego.descripcion_juego ||
        !this.juego.puntos ||
        !this.juego.duracion) {

        this.$vs.notify({
          title: 'Error',
          text: 'Debe completar todos los campos antes de continuar',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return false
      }
      return true
    },

    handleImageUpload(type, event) {
      const file = event.target.files[0]
      if (!file) return

      const fileSize = (file.size / this.bytesPorMega).toFixed(2)
      if (fileSize > this.limiteMegas) {
        this.uploadErrors[type] = `La imagen excede el límite de ${this.limiteMegas} MB`
        return
      }

      this.uploadFiles[type] = file
      this.uploadProgress[type] = 0
      this.uploadErrors[type] = ''

      const interval = setInterval(() => {
        if (this.uploadProgress[type] < 100) {
          this.uploadProgress[type] += 10
        } else {
          clearInterval(interval)
        }
      }, 100)
    },

    async guardarPregunta() {
      if (!this.validarPregunta()) return

      try {
        this.$vs.loading()
        const formData = new FormData()

        // Datos básicos
        formData.append('id_contenido_juego', this.formPregunta.id_contenido_juego || '')
        formData.append('id_juego', this.id_juego)
        formData.append('pregunta', this.formPregunta.pregunta)

        // Imagen de la pregunta
        if (this.uploadFiles.pregunta) {
          formData.append('img_pregunta', this.uploadFiles.pregunta)
        }

        // IDs de opciones existentes
        formData.append('id_opcion1', this.formOpciones[0].id || '')
        formData.append('id_opcion2', this.formOpciones[1].id || '')
        formData.append('id_opcion3', this.formOpciones[2].id || '')
        formData.append('id_opcion4', this.formOpciones[3].id || '')

        // Checkboxes (respuestas correctas)
        formData.append('check1', this.formOpciones[0].correcta ? '1' : '0')
        formData.append('check2', this.formOpciones[1].correcta ? '1' : '0')
        formData.append('check3', this.formOpciones[2].correcta ? '1' : '0')
        formData.append('check4', this.formOpciones[3].correcta ? '1' : '0')

        // Textos de las opciones
        formData.append('input1', this.formOpciones[0].texto || '')
        formData.append('input2', this.formOpciones[1].texto || '')
        formData.append('input3', this.formOpciones[2].texto || '')
        formData.append('input4', this.formOpciones[3].texto || '')

        // Imágenes de las opciones
        if (this.uploadFiles.opcion1) {
          formData.append('img_opcion1', this.uploadFiles.opcion1)
        }
        if (this.uploadFiles.opcion2) {
          formData.append('img_opcion2', this.uploadFiles.opcion2)
        }
        if (this.uploadFiles.opcion3) {
          formData.append('img_opcion3', this.uploadFiles.opcion3)
        }
        if (this.uploadFiles.opcion4) {
          formData.append('img_opcion4', this.uploadFiles.opcion4)
        }

        // Usar axios directamente con la URL completa
        const response = await this.$http.post(`${this.$server_url}saveSeleccion`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })

        if (response.data) {
          this.$vs.notify({
            title: 'Éxito',
            text: this.modoEdicion ? 'Pregunta actualizada correctamente' : 'Pregunta guardada correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })

          await this.getPreguntas()
          this.limpiarFormularioPregunta()
          this.view_op = 2
        }

      } catch (error) {
        console.error('Error saving question:', error)
        let errorMsg = error.message
        if (error.response && error.response.data && error.response.data.message) {
          errorMsg = error.response.data.message
        }
        this.$vs.notify({
          title: 'Error',
          text: 'Error al guardar la pregunta: ' + errorMsg,
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      } finally {
        this.$vs.loading.close()
      }
    },

    validarPregunta() {
      const errors = {}
      this.formErrors = {}

      if (!this.formPregunta.pregunta && !this.uploadFiles.pregunta && !this.currentImage.pregunta) {
        errors.pregunta = 'Ingrese una pregunta o seleccione una imagen'
      }

      if (!this.formOpciones[0].texto && !this.uploadFiles.opcion1 && !this.currentImage.opcion1) {
        errors.opcion1 = 'La primera opción es requerida'
      }
      if (!this.formOpciones[1].texto && !this.uploadFiles.opcion2 && !this.currentImage.opcion2) {
        errors.opcion2 = 'La segunda opción es requerida'
      }

      const tieneCorrecta = this.formOpciones.some(o => o.correcta)
      if (!tieneCorrecta) {
        this.$vs.notify({
          title: 'Error',
          text: 'Seleccione al menos una respuesta correcta',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return false
      }

      if (Object.keys(errors).length > 0) {
        this.formErrors = errors
        this.$vs.notify({
          title: 'Error',
          text: 'Complete los campos requeridos',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-alert-triangle'
        })
        return false
      }

      return true
    },

    editarPregunta(item) {
      this.modoEdicion = true
      this.view_op = 1

      this.formPregunta = {
        id_contenido_juego: item.pregunta.id_contenido_juego,
        pregunta: item.pregunta.pregunta || ''
      }
      this.currentImage.pregunta = item.pregunta.imagen || ''

      item.opciones.forEach((opcion, index) => {
        if (index < 4) {
          this.formOpciones[index] = {
            id: opcion.id_opcion_contenido || '',
            texto: opcion.nombre_opcion || '',
            correcta: opcion.tipo_opcion === 1
          }
          this.currentImage[`opcion${index + 1}`] = opcion.imagen_opcion || ''
        }
      })
    },

    async eliminarImagen(tipo, id) {
      if (!id) return

      try {
        this.$vs.loading()
        const formData = new FormData()

        if (tipo === 'pregunta') {
          formData.append('edita_id_pregunta', id)
        } else {
          formData.append('edita_id_opcion', id)
        }

        formData.append('img_eliminar', this.currentImage[tipo])

        await this.$http.post(`${this.$server_url}deleteImagen`, formData)

        this.currentImage[tipo] = ''
        if (tipo === 'pregunta') {
          this.formPregunta.imagen = ''
        } else {
          const index = parseInt(tipo.replace('opcion', '')) - 1
          if (index >= 0) {
            this.formOpciones[index].imagen = ''
          }
        }

        this.$vs.notify({
          title: 'Éxito',
          text: 'Imagen eliminada correctamente',
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-check'
        })
      } catch (error) {
        console.error('Error deleting image:', error)
        this.$vs.notify({
          title: 'Error',
          text: 'Error al eliminar la imagen',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      } finally {
        this.$vs.loading.close()
      }
    },

    limpiarFormularioPregunta() {
      this.formPregunta = { id_contenido_juego: '', pregunta: '' }
      this.formOpciones = [
        { id: '', texto: '', correcta: false },
        { id: '', texto: '', correcta: false },
        { id: '', texto: '', correcta: false },
        { id: '', texto: '', correcta: false }
      ]
      this.currentImage = { pregunta: '', opcion1: '', opcion2: '', opcion3: '', opcion4: '' }
      this.uploadFiles = { pregunta: null, opcion1: null, opcion2: null, opcion3: null, opcion4: null }
      this.uploadProgress = { pregunta: 0, opcion1: 0, opcion2: 0, opcion3: 0, opcion4: 0 }
      this.uploadErrors = { pregunta: '', opcion1: '', opcion2: '', opcion3: '', opcion4: '' }
      this.formErrors = {}
      this.modoEdicion = false
    },

    async guardarFicha() {
      try {
        this.$vs.loading()
        const formData = new FormData()
        formData.append('id_juego', this.id_juego)

        Object.keys(this.fichaTecnica).forEach(key => {
          formData.append(key, this.fichaTecnica[key] || '')
        })

        await this.$http.post(`${this.$server_url}j_juegos_ficha`, formData)

        this.$vs.notify({
          title: 'Éxito',
          text: 'Ficha guardada correctamente',
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-check'
        })

        this.$router.go(-1)
      } catch (error) {
        console.error('Error saving technical sheet:', error)
        this.$vs.notify({
          title: 'Error',
          text: 'Error al guardar la ficha',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-alert-circle'
        })
      } finally {
        this.$vs.loading.close()
      }
    },

    mostrarImagen(imagen) {
      this.imagenSeleccionada = imagen
      this.modalImagen = true
    }
  }
}
</script>

<style scoped>
.btnwizard,
.btnwizardSelect {
  width: 65px;
  height: 65px;
  font-size: 22px;
  padding: 0;
  border-radius: 50%;
  border: 2px solid rgb(29, 90, 182);
  transition: all 0.3s ease;
  cursor: pointer;
}

.btnwizard {
  background-color: white;
  color: rgb(29, 90, 182);
}

.btnwizardSelect {
  background-color: rgb(29, 90, 182);
  color: white;
}

.pregunta-card,
.option-card {
  background-color: #f8f8f8;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
}

.image-upload-section {
  border: 1px dashed #ccc;
  padding: 15px;
  border-radius: 8px;
  text-align: center;
  transition: all 0.3s ease;
}

.image-upload-section:hover {
  border-color: rgb(29, 90, 182);
  background-color: rgba(29, 90, 182, 0.05);
}

.hidden {
  display: none;
}

.current-image img {
  border-radius: 4px;
  object-fit: cover;
}

.options-grid {
  max-height: 200px;
  overflow-y: auto;
}

.option-item {
  padding: 5px;
  border-bottom: 1px solid #eee;
}

.option-item:last-child {
  border-bottom: none;
}

.cursor-pointer {
  cursor: pointer;
}

@media (max-width: 768px) {

  .btnwizard,
  .btnwizardSelect {
    width: 45px;
    height: 45px;
    font-size: 18px;
  }

  .pregunta-card,
  .option-card {
    padding: 10px;
  }
}
</style>
