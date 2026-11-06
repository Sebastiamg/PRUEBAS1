<template>
  <div>
    <!------ELEGIR TIPO PREGUNTA--------->
    <vs-popup fullscreen classContent="popup-example" title="Crear Preguntas" :active.sync="popupTipoPreg">
      <div class="vx-row">
        <div class="vx-col sm:w-1/4 w-full mb-4">
          <vx-card v-if="usuario.id_group === 1 || usuario.id_group === 5">
            <div class="btn-group" align="center">
              <vs-button type="flat"
                v-if="usuario.id_group === 1 || usuario.id_group === 5 || asignaturaSelected.id > 619" color="primary"
                @click="irTemas">Crear {{ tema_ambito }}</vs-button>
            </div>
            <vs-divider v-if="editarActivo === false" />
            <div class="btn-group" align="center" v-if="editarActivo === false">
              <vs-button type="flat" class="w-full"
                @click="pregTipo = 5; limpiar(); pregunta.puntaje_pregunta = 1;">Selección simple</vs-button>
              <vs-button type="flat" class="w-full"
                @click="pregTipo = 1; limpiar(); pregunta.puntaje_pregunta = 1;">Opción múltiple</vs-button>
              <vs-button type="flat" class="w-full"
                @click="pregTipo = 3; limpiar(); pregunta.puntaje_pregunta = 0.5;">Verdadero/Falso</vs-button>
              <!--<vs-button type="flat" class="w-full" @click="pregTipo = 4; limpiar()" style="min-width: 150px;">Si/No</vs-button>-->
              <vs-button type="flat" class="w-full"
                @click="pregTipo = 2; limpiar(); pregunta.puntaje_pregunta = 2;">Pregunta cerrada</vs-button>
              <vs-button type="flat" class="w-full"
                @click="pregTipo = 6; limpiar(); pregunta.puntaje_pregunta = 2;">Pregunta abierta</vs-button>
            </div>
          </vx-card>
          <vx-card v-if="usuario.id_group === 6">
            <div class="btn-group" align="center" v-if="editarActivo === false">
              <vs-button type="flat" class="w-full"
                @click="pregTipo = 5; limpiar(); pregunta.puntaje_pregunta = 1;">Selección simple</vs-button>
              <vs-button type="flat" class="w-full"
                @click="pregTipo = 1; limpiar(); pregunta.puntaje_pregunta = 1;">Opción múltiple</vs-button>
              <vs-button type="flat" class="w-full"
                @click="pregTipo = 3; limpiar(); pregunta.puntaje_pregunta = 0.5;">Verdadero/Falso</vs-button>
              <!--<vs-button type="flat" class="w-full" @click="pregTipo = 4; limpiar()" style="min-width: 150px;">Si/No</vs-button>-->
              <vs-button type="flat" class="w-full"
                @click="pregTipo = 2; limpiar(); pregunta.puntaje_pregunta = 2;">Pregunta cerrada</vs-button>
              <vs-button type="flat" class="w-full"
                @click="pregTipo = 6; limpiar(); pregunta.puntaje_pregunta = 2;">Pregunta abierta</vs-button>
            </div>
          </vx-card>
        </div>
        <!-------FIN BOTONES TIPOS PREGUNTA------------>
        <!-------INICIO MODAL CREAR PREGUNTAS--------->
        <div class="vx-col sm:w-3/4 w-full">
          <vx-card v-bind:title="titPregTipo" title-color="primary" v-bind:subtitle="txtPregTipo">
            <vs-tabs alignment="fixed" v-model="activeTab">
              <vs-tab label="Pregunta">
                <div class="vx-row mb-5 mt-4">
                  <!------------SELEC TEMA PREGUNTA-------------------->
                  <div class="vx-col sm:w-1/2 w-full">
                    Asignatura
                    <v-select :options="asignaturas" :reduce="asignaturas => asignaturas" label="label"
                      placeholder="--Seleccione--" class="mb-2" v-model="asignaturaSelected"
                      @input="filtrarPreguntas()" />
                  </div>
                  <div class="vx-col sm:w-1/2 w-full">
                    Unidad
                    <v-select :options="unidades" :reduce="unidades => unidades" label="label"
                      placeholder="--Seleccione--" class="mb-2" v-model="unidadSelected" @input="filtrarPreguntas()" />
                  </div>
                  <div class="vx-col w-full">
                    {{ tema_ambito }}
                    <vx-input-group class="mb-2">
                      <v-select :options="temas" :reduce="temas => temas" label="label" placeholder="Seleccionar tema"
                        clearable v-model="pregunta.tema" @input="verpreguntasxtema()" />
                      <template slot="append">
                        <div class="append-text btn-addon">
                          <vs-button color="primary"
                            v-if="usuario.id_group === 1 || usuario.id_group === 5 || asignaturaSelected.id > 619"
                            @click="$router.push('/temas')">Crear {{ tema_ambito }}</vs-button>
                        </div>
                      </template>
                    </vx-input-group>
                  </div>
                  <!------------FIN SELEC TEMA PREGUNTA-------------------->

                </div>
                <div class="vx-row mb-5">
                  <div class="vx-col w-full">
                    <div class="upload-area-pregunta"
                      style="border: 2px dashed #a8b3cf; border-radius: 12px; padding: 20px; background: linear-gradient(135deg, #f8f9fb 0%, #eef1f5 100%); transition: all 0.3s ease; cursor: pointer;"
                      align="center">
                      <input type="file" name="file1" id="file1" class="inputfile" style="display: none;"
                        v-on:change="mostrarImg(1, 1)">
                      <label for="file1"
                        style="cursor: pointer; color: #6b7280; width: 100%; font-size: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px;"
                        class="font-bold">
                        <i class="fa-solid fa-upload" style="font-size: 24px; color: #a8b3cf;"></i>
                        <span>Click aquí para subir imagen de la pregunta</span>
                        <div style="font-size: 10px; color: #666;">
                          <strong>Solo formatos PNG, JPG - Máximo 1MB</strong>
                        </div>
                      </label>
                      <div
                        v-if="src_imagen_pregunta === '' || src_imagen_pregunta === null || src_imagen_pregunta === 'null'">
                      </div>
                      <div v-else>
                        <img id="img1" class="img-responsive mb-2" v-bind:src="src_imagen_pregunta"
                          style="border-radius: 5px;">
                        <!--button para quitar-->
                        <vs-button @click="quitarImagen()" class="mt-5" color="danger" icon-pack="feather"
                          icon="icon-x">Quitar</vs-button>
                      </div>
                    </div>
                    <!--<div align="center">
                        <vs-button color="danger" type="line" icon-pack="feather" icon="icon-trash" size="small" @click="src_imagen_pregunta = ''"></vs-button>
                    </div>-->
                  </div>
                  <div class="vx-col w-full mt-4">
                    <MathLiveEditor 
                      class="mb-4" 
                      label="Nombre Pregunta" 
                      v-model="pregunta.descripcion" 
                      height="120px"
                      :preview="true"
                      :hideInternalButtons="true"
                    />
                  </div>
                  <div class="vx-col sm:w-full w-full">
                    <ul class="leftx">
                      <li>
                        <vs-radio v-model="pregunta.estado" vs-name="radios1estado" vs-value="1">Activo</vs-radio>
                      </li>
                      <li>
                        <vs-radio v-model="pregunta.estado" vs-name="radios1estado" vs-value="0">Desactivado</vs-radio>
                      </li>
                    </ul>
                  </div>
                  <div class="vx-col sm:w-1/2 w-full">
                    <vs-input disabled v-if="usuario.institucion_idInstitucion != 66" type="number" class="mb-4 w-full"
                      label="Puntaje" placeholder="Puntaje" v-model="pregunta.puntaje_pregunta" />
                    <vs-input v-else disabled type="number" class="mb-4 w-full" label="Puntaje" placeholder="Puntaje"
                      v-model="pregunta.puntaje_pregunta" />
                  </div>
                  <div class="vx-col sm:w-1/2 w-full mb-2" align="right">
                    <div v-if="editarActivo === true">
                      <vs-button class="w-full mt-6" @click="editarPregunta" type="filled">Editar pregunta</vs-button>
                    </div>

                    <div v-else>
                      <vs-button class="w-full mt-6" v-if="guardadoActivo === false" color="success" type="filled"
                        @click="agregar()">Guardar pregunta</vs-button>
                    </div>
                  </div>
                </div>
              </vs-tab>
              <!-------INICIO TAB OPCIONES PREG TIPO 1, 5----->
              <vs-tab label="Opciones" v-if="pregTipo === 1 || pregTipo === 5">
                <div class="vx-col w-full mb-2" style="padding: 10px;">
                  <vs-divider position="left" color="success">Crear opciones</vs-divider>
                  <div class="vx-row mb-2" id="editar">
                    <div class="vx-col w-full mb-1">
                      <div class="upload-area-opcion"
                        style="border: 2px dashed #a8b3cf; border-radius: 12px; padding: 20px; background: linear-gradient(135deg, #f8f9fb 0%, #eef1f5 100%); transition: all 0.3s ease; cursor: pointer;"
                        align="center">
                        <input type="file" name="file2" id="file2" class="inputfile" style="display: none;"
                          v-on:change="mostrarImg(2, 2)">
                        <label for="file2"
                          style="cursor: pointer; color: #6b7280; width: 100%; font-size: 12px; display: flex; flex-direction: column; align-items: center; gap: 8px;"
                          class="font-bold">
                          <i class="fa-solid fa-upload" style="font-size: 24px; color: #a8b3cf;"></i>
                          <span>Click aquí para subir imagen</span>
                          <div style="font-size: 10px; color: #666;">
                            <strong>Solo formatos PNG, JPG - Máximo 1MB</strong>
                          </div>
                        </label>
                        <div
                          v-if="!src_imagen_opcion || src_imagen_opcion === '' || src_imagen_opcion === 'null' || src_imagen_opcion === 'undefined' || src_imagen_opcion.trim() === ''">
                        </div>
                        <img id="img2" style="border-radius: 5px;" class="img-responsive mb-2"
                          v-bind:src="src_imagen_opcion"
                          v-else>
                      </div>

                      <MathLiveEditor 
                        ref="opcionEditor"
                        :key="opcionEditorKey"
                        class="mt-2" 
                        label="Nombre Opción" 
                        v-model="opcion.opcion" 
                        height="100px"
                        :preview="true"
                        :hideInternalButtons="true"
                      />
                      <!--<div align="center">
                          <vs-button color="danger" type="line" icon-pack="feather" icon="icon-trash" size="small" @click="src_imagen_opcion = ''"></vs-button>
                      </div>-->

                      <!-- Input antiguo comentado - ahora se usa MathLiveEditor arriba -->
                      <!-- <vs-textarea class="mt-2" label="Nombre Opción" v-model="opcion.opcion" height="60px" /> -->
                    </div>

                    <div class="vx-row w-full" v-if="pregTipo === 1 || pregTipo === 5">

                      <div class="vx-col sm:w-1/2 w-full" align="center">
                        <vs-switch style="width: 100px;" color="success" class="mt-3 mb-5" v-model="opcion.tipo">
                          <span slot="on">Correcta</span>
                          <span slot="off">Incorrecta</span>
                        </vs-switch>
                      </div>
                      <div class="vx-col sm:w-1/2 w-full mb-1" align="center">
                        <vs-button v-if="editarOpcionActiva === false" color="success" type="flat" icon-pack="feather"
                          icon="icon-plus" @click="cargarOpcion()">Agregar</vs-button>

                        <div v-else class="vx-row">
                          <div class="vx-col w-1/2">
                            <vs-button color="success" class="w-full" type="flat" icon-pack="feather"
                              icon="icon-check" @click="confirmEditarOpcion(opcion)">Guardar</vs-button>
                          </div>
                          <div class="vx-col w-1/2">
                            <vs-button color="danger" class="w-full" type="border" icon-pack="feather"
                              icon="icon-x" @click="cancelarEdicionOpcion()">Cancelar</vs-button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="vx-col w-full">
                  <vs-divider position="center" color="primary">Opciones agregadas</vs-divider>

                  <div class="vx-row mb-3" :key="indexitem" v-for="(item, indexitem) in opciones">

                    <div class="vx-col sm:w-1/5 w-full" align="center">
                      <img v-if="item.img_opcion && item.img_opcion.trim() !== '' && item.img_opcion !== 'null' && item.img_opcion !== 'undefined'" style="border-radius: 5px;"
                        v-bind:src="$data_url + 'archivos/img/img_preguntas/' + item.img_opcion" width="100%">
                      <vs-button v-if="item.img_opcion && item.img_opcion.trim() !== '' && item.img_opcion !== 'null' && item.img_opcion !== 'undefined'" @click="quitarImagenOpcion(item)" class="mt-2" color="danger"
                        icon-pack="feather" icon="icon-x" size="small">Quitar imagen</vs-button>
                    </div>
                    <div class="vx-col sm:w-4/5 w-full">
                      <!-- Mostrar opción con fórmulas renderizadas -->
                      <div class="opcion-display" v-html="renderLatex(item.opcion)" style="padding: 10px; border: 1px solid #e0e0e0; border-radius: 5px; min-height: 40px; background: #f9f9f9;"></div>

                      <div class="vx-row" align="center">
                        <div class="vx-col sm:w-1/3 w-full">
                          <vs-switch style="width: 100px;" disabled="true" color="success" class="mt-3 mb-5"
                            v-model="item.tipo">
                            <span slot="on">Correcta</span>
                            <span slot="off">Incorrecta</span>
                          </vs-switch>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full">
                          <vs-button color="primary" type="line" icon-pack="feather" icon="icon-edit-1" size="small"
                            @click="src_imagen_opcion = ''; editarOpcionActiva = true; editarOpcion(item)">Editar</vs-button>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full">
                          <vs-button color="danger" type="line" icon-pack="feather" icon="icon-trash" size="small"
                            @click="quitarOpcion(item)">Eliminar</vs-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </vs-tab>
              <!-------FIN TAB OPCIONES PREG TIPO 1, 5----->
              <!-------INICIO TAB OPCIONES PREG TIPO 3, 4----->
              <vs-tab label="Respuesta" v-if="pregTipo === 3 || pregTipo === 4">
                <div v-if="pregTipo === 3" class="mt-6">

                  <div v-if="opciones.length > 0">
                    <div class="mb-3" :key="indexitem" v-for="(item, indexitem) in opciones">
                      <label class="radio-option-card">
                        <input 
                          type="radio" 
                          :value="item.opcion" 
                          v-model="opcion.opcion"
                          name="respuesta_vf"
                        />
                        <span class="radio-label">{{ item.opcion }}</span>
                      </label>
                    </div>
                  </div>
                  <div v-else>
                    <div class="mb-4 mt-6">
                      <label class="radio-option-card">
                        <input 
                          type="radio" 
                          value="Verdadero" 
                          v-model="opcion.opcion"
                          name="respuesta_vf"
                        />
                        <span class="radio-label">Verdadero</span>
                      </label>
                    </div>

                    <div class="mb-4">
                      <label class="radio-option-card">
                        <input 
                          type="radio" 
                          value="Falso" 
                          v-model="opcion.opcion"
                          name="respuesta_vf"
                        />
                        <span class="radio-label">Falso</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div v-if="pregTipo === 4" class="mt-6">
                  <div v-if="opciones.length > 0">
                    <div class="mb-3" :key="indexitem" v-for="(item, indexitem) in opciones">
                      <label class="radio-option-card">
                        <input 
                          type="radio" 
                          :value="item.opcion" 
                          v-model="opcion.opcion"
                          name="respuesta_sino"
                        />
                        <span class="radio-label">{{ item.opcion }}</span>
                      </label>
                    </div>
                  </div>
                  <div v-else>
                    <div class="mb-4 mt-6">
                      <label class="radio-option-card">
                        <input 
                          type="radio" 
                          value="Si" 
                          v-model="opcion.opcion"
                          name="respuesta_sino"
                        />
                        <span class="radio-label">Si</span>
                      </label>
                    </div>

                    <div class="mb-4">
                      <label class="radio-option-card">
                        <input 
                          type="radio" 
                          value="No" 
                          v-model="opcion.opcion"
                          name="respuesta_sino"
                        />
                        <span class="radio-label">No</span>
                      </label>
                    </div>
                  </div>
                </div>

                <div class="vx-col w-full mt-6" align="right">
                  <vs-button v-if="editarActivo === true" color="primary" type="filled" icon-pack="feather"
                    icon="icon-edit-1" @click="editarOpcionesDico()">Editar</vs-button>

                  <vs-button v-else color="success" type="filled" @click="cargarOpcionesDico()">Guardar</vs-button>
                </div>
              </vs-tab>
              <!-------FIN TAB OPCIONES PREG TIPO 3, 4----->
              <!-------INICIO TAB OPCIONES PREG CERRADA-------->
              <vs-tab label="Palabras Clave" v-if="pregTipo === 2">
                <div class="vx-row mt-6">
                  <div class="vx-col w-full">
                    <vs-alert :active.sync="active1" closable icon-pack="feather" close-icon="icon-x" class="mb-3">
                      Ejemplo: Forma correcta: <span style="color: green;">24, mayo, 1822</span> - Forma Incorrecta:
                      <span style="color: red;">24 de mayo, 1822 </span>
                    </vs-alert>

                    <div style="color: #1A76FA;" class="mb-4 w-full">Evite usar caracteres especiales como: punto,
                      signos de expresión
                      etc...</div>

                    <vs-textarea class="mb-3" label="Palabras clave de la respuesta"
                      placeholder="Escriba las palabras clave de la respuesta separadas por una coma (,)."
                      v-model="palabras_clave" height="70px" />
                  </div>
                </div>

                <div class="vx-row w-full">
                  <div class="vx-col sm:w-1/2 w-full">
                    <vs-input type="number" class="mb-2 w-full" label="Cantidad de coincidencias"
                      v-model="pregunta.cant_coincidencias" />
                  </div>
                  <div class="vx-col sm:w-1/2 w-full mt-5">
                    <vs-button class="w-full" v-if="editarActivo === true" @click="editarPalabrasclave"
                      type="filled">Editar</vs-button>

                    <vs-button class="w-full" v-else @click="cargarOpcionAbierta" color="success"
                      type="filled">Guardar</vs-button>
                  </div>
                </div>

              </vs-tab>
              <!------FIN TAB OPCION TIPO PREG ABIERTA----->
              <!-------INICIO TAB PREG ABIERTA-------->
              <vs-tab label="Información" v-if="pregTipo === 6">
                <div class="mt-6" align="center">
                  <h4 class="mt-6">Esta pregunta no puede tener respuestas. Debe ser calificada manualmente por el
                    docente.</h4>
                </div>
              </vs-tab>
              <!------FIN TAB OPCION TIPO PREG ABIERTA----->
            </vs-tabs>
          </vx-card>
          <!-------FIN MODAL CREAR PREGUNTAS--------->

        </div>
      </div>
    </vs-popup>
    <!------FIN ELEGIR TIPO PREGUNTA--------->
    <!--LISTADO DE Pregunta-->
    <vx-card>
      <!-- Filtros destacados -->
      <div class="filtros-destacados mb-4" v-if="usuario.id_group == 1">
        <p class="text-center">Filtrar para mostrar en asignatura</p>
        <div class="vx-row w-full">
          <div class="vx-col sm:w-1/2 w-full">
            <div class="filtro-item">
              <label class="filtro-label">🎯 Filtrar por serie</label>
              <v-select :options="arraySeries" :reduce="arraySeries => arraySeries.id_serie" label="nombre_serie"
                placeholder="--Seleccione una serie--" class="mb-2" v-model="seriesSelected"
                @input="filtrarPorSerie()" />
            </div>
          </div>
          <div class="vx-col sm:w-1/2 w-full">
            <div class="filtro-item">
              <label class="filtro-label">📚 Filtrar por área</label>
              <v-select :options="arrayAreas" :reduce="arrayAreas => arrayAreas.idarea" label="nombrearea"
                placeholder="--Seleccione un área--" class="mb-2" v-model="areasSelected" @input="filtrarPorArea()" />
            </div>
          </div>
        </div>
        <div class="vx-row w-full mt-3">
          <div class="vx-col w-full" align="center">
            <vs-button color="warning" type="flat" icon-pack="feather" @click="limpiarFiltros()">
              🧹 Limpiar filtros
            </vs-button>
          </div>
        </div>
      </div>

      <!-- Filtros comunes - consolidados para evitar duplicación -->
      <div class="vx-row w-full mb-4">
        <div class="vx-col sm:w-1/2 w-full">
          Asignatura
          <v-select :options="asignaturas" :reduce="asignaturas => asignaturas" label="label"
            placeholder="--Seleccione--" class="mb-2" v-model="asignaturaSelected" @input="filtrarPreguntas()"
            :disabled="usuario.id_group != 1" />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          Unidad
          <v-select :options="unidades" :reduce="unidades => unidades" label="label" placeholder="--Seleccione--"
            class="mb-2" v-model="unidadSelected" @input="filtrarPreguntas()" />
        </div>
        <div class="vx-col w-full">
          {{ tema_ambito }}
          <vx-input-group class="mb-2">
            <v-select :options="temas" :reduce="temas => temas" label="label" placeholder="Seleccionar tema" clearable
              v-model="pregunta.tema" @input="verpreguntasxtema()" />
            <template slot="append">
              <div class="append-text btn-addon">
                <vs-button color="primary"
                  v-if="usuario.id_group === 1 || usuario.id_group === 5 || asignaturaSelected.id > 619"
                  @click="$router.push('/temas')">Crear {{ tema_ambito }}</vs-button>
              </div>
            </template>
          </vx-input-group>
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          Banco
          <v-select :options="bancos" :reduce="bancos => bancos" label="label" placeholder="--Seleccione--"
            class="w-full" v-model="bancoSelected" @input="verpreguntasxtema()" />
        </div>
        <div class="vx-col sm:w-1/2 w-full">
          Tipo
          <v-select :options="tipos" :reduce="tipos => tipos" label="label" placeholder="--Seleccione--" class="w-full"
            v-model="tipoSelected" @input="filtrarTipos()" />
        </div>
      </div>

      <!-- Contenido específico según el estado de preguntas -->
      <div v-if="preguntas.items === undefined">
        <!-- <vs-button v-if="usuario.id_group===6" @click="$router.push('/evaluaciones');" size="small" style="font-size: 14px; display: inline-block;" class="mr-2" color="primary" type="filled">← Evaluaciones</vs-button> -->
        <vs-button v-if="pregunta.tema.id != ''"
          @click="active1 != active1; popupTipoPreg = true; id_preguntaActiva = ''; editarOpcionActiva = false; editarActivo = false; pregTipo = 1; limpiar();"
          size="small" style="font-size: 14px; display: inline-block;" color="dark" class="mr-3" type="filled">Crear
          pregunta</vs-button>
      </div>
      <div v-else>
        <vs-table stripe v-model="pregSelected" pagination max-items="25" search :data="preguntas.items">
          <template slot="header">
            <small>Cantidad: {{ preguntas.items.length }}</small>
            <vs-button v-if="pregunta.tema.id != ''"
              @click="active1 != active1; popupTipoPreg = true; id_preguntaActiva = ''; editarOpcionActiva = false; editarActivo = false; pregTipo = 1; limpiar();"
              size="small" style="font-size: 14px;" color="dark" class="ml-3" type="filled">Crear pregunta</vs-button>
          </template>

          <template slot="thead">
            <vs-th sort-key="pregunta">#</vs-th>
            <vs-th sort-key="pregunta">Pregunta</vs-th>
            <vs-th sort-key="id_tipo_pregunta">Tipo</vs-th>
            <vs-th>Acciones</vs-th>
          </template>

          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
                <p>{{ tr.id }}</p>
                <b>Editor:</b>
                <p>{{ tr.editor }} </p>
                <b>Fecha creación:</b>
                <p>{{ tr.created_at }}</p>
                <b>Fechas modificación:</b>
                <p>{{ tr.updated_at }}</p>
                <p><vs-chip color="primary" v-if="tr.estado == '1'">Activo</vs-chip></p>
                <p><vs-chip color="danger" v-if="tr.estado == '0'">Desactivado</vs-chip></p>
              </vs-td>
              <vs-td :data="data[indextr].descripcion">
                <div v-html="renderLatex(data[indextr].descripcion)"></div>
                <img
                  v-if="data[indextr].img_pregunta != '' && data[indextr].img_pregunta != 'null' && data[indextr].img_pregunta != null"
                  v-bind:src="$data_url + 'archivos/img/img_preguntas/' + data[indextr].img_pregunta"
                  class="img-responsive" width="100px" style="border-radius: 5px;">
                <vs-divider>Opciones</vs-divider>
                <div class="mb-5" :key="indexitem" v-for="(item, indexitem) in data[indextr].opciones">
                  <div style="width: 100%; font-size: 12px; color: #0DCD88;" v-if="item.tipo === 1">Respuesta
                    correcta<br>
                  </div>
                  <div style="width: 100%; font-size: 12px; color: #FD5858;" v-else>Respuesta incorrecta<br></div>
                  <div style="width: 100%" v-html="renderLatex(item.opcion)"></div>
                  <div style="width: 100%"><img
                      v-if="item.img_opcion && item.img_opcion.trim() !== '' && item.img_opcion !== 'null' && item.img_opcion !== 'undefined'"
                      v-bind:src="$data_url + 'archivos/img/img_preguntas/' + item.img_opcion" class="img-responsive"
                      style="border-radius: 5px;" width="100px"></div>
                </div>
                <div v-if="data[indextr].opciones.length == 0">
                  <p class="text-center text-danger">No hay opciones para esta pregunta</p>
                </div>
              </vs-td>

              <vs-td :data="data[indextr].nombre_tipo">
                {{ data[indextr].nombre_tipo }}
              </vs-td>

              <vs-td :data="data[indextr].id" align="center">
                <vs-button
                  v-if="usuario.idusuario === data[indextr].idusuario || usuario.id_group === 1 || usuario.id_group === 5"
                  @click="src_imagen_opcion = ''; src_imagen_pregunta = ''; pregunta.puntaje = 1; popupTipoPreg = true; editarFormulario(data[indextr]);"
                  size="small" style="padding: 7px; width: 80px; font-size: 12px;" color="primary" type="gradient"
                  class="m-1">editar</vs-button>

                <vs-button v-if="userRoot" @click="datosEliminar = tr; confirmarEliminarPreg()" size="small"
                  style="padding: 7px; width: 80px; font-size: 12px;" color="danger" type="filled"
                  class="m-1">eliminar</vs-button>

                <vs-button v-if="usuario.id_group === 6" @click="cargarPreguntaEval(data[indextr])" size="small"
                  style="padding: 7px; width: 150px; font-size: 12px;" color="success" type="filled" class="m-1">cargar
                  a evaluación</vs-button>
              </vs-td>

            </vs-tr>
          </template>
        </vs-table>
      </div>
      <div v-if="preguntas.items === undefined">
        <vs-table stripe v-model="pregSelected" pagination max-items="5" search :data="preguntas">
          <template slot="thead">
            <vs-th sort-key="pregunta">#</vs-th>
            <vs-th sort-key="pregunta">Pregunta</vs-th>
            <vs-th sort-key="id_tipo_pregunta">Tipo</vs-th>
            <vs-th>Acciones</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td>
              </vs-td>ya
              <vs-td :data="data[indextr].descripcion">
              </vs-td>
              <vs-td :data="data[indextr].nombre_tipo">
              </vs-td>
              <vs-td :data="data[indextr].id" align="center">
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
        <br><br><br><br><br><br><br><br><br>
      </div>
    </vx-card>
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
import MathLiveEditor from '@/components/MathLiveEditor.vue'
import { renderLatex } from '@/utils/renderLatex'
import 'mathlive/mathlive-static.css'
import 'mathlive/mathlive-fonts.css'
import 'katex/dist/katex.min.css'
import {
  mapState
} from "vuex";
var img_preg_old = '', img_opcion_old = '';
export default {
  data() {
    return {
      asignaturas: [],
      asignaturasOriginal: [], // Array temporal para guardar las asignaturas originales
      asignatura: { id: '', label: '' },
      preguntas: [],
      pregunta: { descripcion: '', tema: { id: '', label: '' }, respuesta: '', opcion1: '', opcion2: '', opcion3: '', img_pregunta: '', img_respuesta: '', img_opcion1: '', img_opcion2: '', img_opcion3: '', puntaje_pregunta: '', estado: 1 },
      temas: [],
      tema: { id: '', label: '', id_asignatura: '', unidad: '' },
      temaSelected: { id: '', label: '' },
      opcion: { id_opcion_pregunta: '', id_pregunta: '', opcion: '', img_opcion: '', tipo: '' },
      opciones: [],
      editarActivo: false,
      popupAddPreg: false,
      popupEditPreg: false,
      popupTipoPreg: false,
      popupAddPregVarOp: false,
      pregSelected: [],
      pregTipo: 1,
      activeTab: 0, // Controla el tab activo (0 = Pregunta, 1 = Opciones/Respuesta/etc)
      titPregTipo: '',
      txtPregTipo: '',
      active1: true,
      tipo_opcion: '',
      cargarOpcionActivo: false,
      guardadoActivo: false,
      'tableList': [
        'vs-th: Component',
        'vs-tr: Component',
        'vs-td: Component',
        'thread: Slot',
        'tbody: Slot',
        'header: Slot'
      ],
      usuario: [],
      docente: null,

      id_preguntaActiva: '',
      editarOpcionActiva: false,
      opcionEditorKey: 0, // Key para forzar re-renderizado del MathLiveEditor
      src_imagen_pregunta: '',
      src_imagen_opcion: '',
      palabras_clave: '',
      id_opcion_tipo234: '',
      urlOrigen: '',
      url: '',
      id_pregunta_creada: null,
      opcionselecradio: '',
      asignaturaSelected: '',
      unidadSelected: '',
      unidades: [
        { id: "1", label: "Unidad 1", }, { id: "2", label: "Unidad 2", }, { id: "3", label: "Unidad 3", }, { id: "4", label: "Unidad 4", }, { id: "5", label: "Unidad 5", }, { id: "6", label: "Unidad 6", }, { id: "7", label: "Unidad 7", }, { id: "8", label: "Unidad 8", }
      ],
      tipoSelected: '',
      tipos: [
        { id: "1", label: "Opción múltiple", }, { id: "2", label: "Respuesta cerrada", }, { id: "3", label: "Verdadero/Falso", }, { id: "5", label: "Selección simple" }, { id: "6", label: "Respuesta abierta" }
      ],
      datosEliminar: [],
      idPregEliminar: '',
      bancoSelected: { id: '3', label: 'Ambas' },
      bancos: [
        { id: '1', label: 'Preguntas de Prolipa' },
        { id: '2', label: 'Solo mis preguntas' },
        { id: '3', label: 'Ambas' },
      ],
      tema_ambito: 'Tema',
      arrayQuestions: [],
      srcPreguntaAQuitar: '',
      arraySeries: [],
      arrayAreas: [],
      seriesSelected: '',
      areasSelected: '',
    }
  },
  components: {
    'v-select': vSelect,
    flatPickr,
    MathLiveEditor
  },
  created() {
    let me = this;
    me.$vs.loading()
    me.usuario = JSON.parse(localStorage.getItem('usuario'));
    me.docente = me.usuario.idusuario
    me.url = location.pathname.split('/');
    var urlBack = window.location.href
    var urlV = urlBack.split('/')
    me.urlOrigen = urlV[0] + '/' + urlV[1] + '/' + urlV[2] + '/temas'
    if (me.url[2] === undefined) {
      this.$http.get(this.$server_url + 'asignaturasDoc/0').then(res => {
        me.asignaturas = res.data;
        me.asignaturasOriginal = [...res.data]; // Guardar copia del array original
        me.$vs.loading.close()
      })
    } else {
      this.$http.get(this.$server_url + 'asignaturasDoc/' + me.docente).then(res => {
        me.asignaturas = res.data;
        me.asignaturasOriginal = [...res.data]; // Guardar copia del array original
        me.$vs.loading.close()
      })
    }

    me.asignaturaSelected = { id: localStorage.idasignatura, label: localStorage.nombreasignatura }
  },
  mounted() {
    let me = this
    me.cargarDatosIniciales()
  },
  computed: {
    ...mapState(['userRoot']),
  },
  watch: {
    // Resetear el tab activo cuando se cierra el popup
    popupTipoPreg(newVal) {
      if (!newVal) {
        // Cuando el popup se cierra, resetear al primer tab (Pregunta)
        this.activeTab = 0;
      }
    },
    // Limpiar el campo de opción cuando se cambia al tab de opciones
    activeTab(newVal) {
      if (newVal === 1) {
        // Si cambia al tab de Opciones/Respuesta (índice 1)
        
        // Para preguntas tipo 3 (V/F) o tipo 4 (Si/No), asignar la opción correcta
        if ((this.pregTipo === 3 || this.pregTipo === 4) && this.opciones.length > 0 && this.editarActivo) {
          // Buscar la opción correcta
          const opcionCorrecta = this.opciones.find(opt => opt.tipo == 1);
          if (opcionCorrecta) {
            // Usar múltiples $nextTick y setTimeout para asegurar renderizado completo
            this.$nextTick(() => {
              setTimeout(() => {
                this.opcion.opcion = opcionCorrecta.opcion;
                console.log('Tab Respuesta activado - Opción seleccionada:', opcionCorrecta.opcion);
                
                // Forzar actualización del DOM
                this.$forceUpdate();
              }, 200);
            });
          }
        } else if (this.pregTipo === 1 || this.pregTipo === 5) {
          // Para opciones múltiples, limpiar el campo
          this.opcion.opcion = '';
          this.src_imagen_opcion = '';
          this.editarOpcionActiva = false;
          // Incrementar la key para forzar re-renderizado del MathLiveEditor
          this.opcionEditorKey++;
        }
      }
    }
  },
  methods: {
    onResize() {
      if (window.innerWidth < 769)
        this.isMobile = true;
      else
        this.isMobile = false;
    },
    renderLatex,
    async f_series() {
      let me = this;
      try {
        const res = await this.$http.get(this.$server_url + 'series');
        this.arraySeries = res.data.filter(p => p.id_serie != '19' && p.ser_estado == '1'); // Excluir serie 19
        return res.data;
      } catch (error) {
        console.error('Error cargando series:', error);
        throw error;
      }
    },
    async f_areas() {
      let me = this;
      try {
        const res = await this.$http.get(this.$server_url + 'areas');
          me.arrayAreas = res.data.area.filter(a => a.estado == '1' && !a.nombrearea.includes('Combo'));
        return res.data;
      } catch (error) {
        console.error('Error cargandas:', error);
        throw error;
      }
    },
    // Método para filtrar asignaturas por serie
    filtrarPorSerie() {
      let me = this;
      // Guardar en localStorage cuando se selecciona una serie
      if (me.seriesSelected && me.seriesSelected !== '') {
        localStorage.setItem('setBancoPreguntaSerie', me.seriesSelected);
      } else {
        localStorage.removeItem('setBancoPreguntaSerie');
      }
      me.aplicarFiltrosCombinados();
    },
    // Método para filtrar asignaturas por área
    filtrarPorArea() {
      let me = this;
      // Guardar en localStorage cuando se selecciona un área
      if (me.areasSelected && me.areasSelected !== '') {
        localStorage.setItem('setBancoPreguntaArea', me.areasSelected);
      } else {
        localStorage.removeItem('setBancoPreguntaArea');
      }
      me.aplicarFiltrosCombinados();
    },
    // Método para aplicar filtros combinados (serie Y/O área)
    aplicarFiltrosCombinados() {
      let me = this;
      let asignaturasFiltradas = [...me.asignaturasOriginal];

      // Aplicar filtro por serie si está seleccionada
      if (me.seriesSelected && me.seriesSelected !== '') {
        asignaturasFiltradas = asignaturasFiltradas.filter(asignatura =>
          asignatura.id_serie == me.seriesSelected
        );
      }

      // Aplicar filtro por área si está seleccionada (combinado con serie si ambos están seleccionados)
      if (me.areasSelected && me.areasSelected !== '') {
        asignaturasFiltradas = asignaturasFiltradas.filter(asignatura =>
          asignatura.area_idarea == me.areasSelected
        );
      }

      // Si no hay filtros seleccionados, mostrar todas las asignaturas originales
      if ((!me.seriesSelected || me.seriesSelected === '') && (!me.areasSelected || me.areasSelected === '')) {
        asignaturasFiltradas = [...me.asignaturasOriginal];
      }

      // Aplicar el filtro
      me.asignaturas = asignaturasFiltradas;

      // Limpiar selección de asignatura actual
      me.asignaturaSelected = '';
      me.filtrarPreguntas();
    },
    // Método para limpiar solo los filtros de serie y área
    limpiarFiltros() {
      let me = this;
      // Limpiar las selecciones de filtros
      me.seriesSelected = '';
      me.areasSelected = '';
      // Limpiar localStorage
      localStorage.removeItem('setBancoPreguntaSerie');
      localStorage.removeItem('setBancoPreguntaArea');
      // Restaurar el array original de asignaturas
      me.asignaturas = [...me.asignaturasOriginal];
      // NO limpiar la asignatura seleccionada - mantener la selección actual
      // Actualizar vista de preguntas
      me.filtrarPreguntas();
    },
    // Método para cargar datos iniciales y luego filtros desde localStorage
    async cargarDatosIniciales() {
      let me = this;

      try {
        // Cargar series y áreas en paralelo
        await Promise.all([
          me.f_series(),
          me.f_areas()
        ]);

        // Esperar un poco más para asegurar que los datos estén completamente cargados
        setTimeout(() => {
          me.cargarFiltrosDesdeLocalStorage();
        }, 300);

      } catch (error) {
        console.error('Error cargando datos iniciales:', error);
      }
    },

    // Método para cargar filtros desde localStorage al inicializar
    cargarFiltrosDesdeLocalStorage() {
      let me = this;

      // Verificar si existe serie guardada en localStorage
      const serieGuardada = localStorage.getItem('setBancoPreguntaSerie');
      if (serieGuardada && serieGuardada !== '' && me.arraySeries.length > 0) {
        // Convertir a entero para comparación correcta
        const serieId = parseInt(serieGuardada);
        // Buscar el objeto completo de la serie en el array
        const serieEncontrada = me.arraySeries.find(serie => serie.id_serie === serieId);
        if (serieEncontrada) {
          me.seriesSelected = serieId; // Asignar el ID como entero para que funcione el v-select
        }
      }

      // Verificar si existe área guardada en localStorage
      const areaGuardada = localStorage.getItem('setBancoPreguntaArea');
      if (areaGuardada && areaGuardada !== '' && me.arrayAreas.length > 0) {
        // Convertir a entero para comparación correcta
        const areaId = parseInt(areaGuardada);
        // Buscar el objeto completo del área en el array
        const areaEncontrada = me.arrayAreas.find(area => area.idarea === areaId);
        if (areaEncontrada) {
          me.areasSelected = areaId; // Asignar el ID como entero para que funcione el v-select
        }
      }

      // Si hay filtros guardados, aplicarlos
      if ((serieGuardada && me.arraySeries.length > 0) || (areaGuardada && me.arrayAreas.length > 0)) {
        me.aplicarFiltrosCombinados();
      }
    },
    limpiar() {
      this.guardadoActivo = false;
      this.opciones = [];
      this.pregunta.descripcion = '';
      this.pregunta.puntaje_pregunta = '';
      //this.pregunta.tema = '';
      this.pregunta.opcion = '';
      this.opcion.opcion = '';
      this.opcion.tipo = '';
      this.src_imagen_pregunta = '';
      this.srcPreguntaAQuitar = '';
      this.src_imagen_opcion = '';
      this.editarActivo = false;
      this.palabras_clave = '';
      this.id_preguntaActiva = '';
      this.editarOpcionActiva = false;
      this.pregunta.cant_coincidencias = '';
      this.pregunta.puntaje_pregunta = 1;
      this.pregunta.estado = 1;
      switch (this.pregTipo) {
        case 1:
          this.titPregTipo = 'Crear pregunta de opción múltiple.';
          this.txtPregTipo = 'Esta pregunta puede tener una o varias opciones correctas. Las opciones pueden contener: solo texto, solo imágenes o ambas.';
          break;
        case 2:
          this.titPregTipo = 'Crear pregunta cerrada';
          this.txtPregTipo = 'Esta pregunta debe ser respondida de forma escrita. La respuesta correcta debe contener palabras clave para poder comparar con la respuesta del estudiante.';
          break;
        case 3:
          this.titPregTipo = 'Crear pregunta de Verdadero o Falso';
          this.txtPregTipo = 'Esta pregunta debe tener dos opciones, una correcta y otra incorrecta.';
          break;
        case 4:
          this.titPregTipo = 'Crear pregunta de tipo dicotómica (Si o No)';
          this.txtPregTipo = 'Esta pregunta debe tener dos opciones, una correcta y otra incorrecta.';
          break;
        case 5:
          this.titPregTipo = 'Crear pregunta de selección simple';
          this.txtPregTipo = 'Esta pregunta puede tener solo una opción correcta. Las opciones pueden contener: solo texto, solo imágenes o ambas.';
          break;
        default:
          this.titPregTipo = 'Crear pregunta abierta';
          this.txtPregTipo = 'Esta pregunta no tiene una respuesta. Es una pregunta de opinión que se deberá calificar manualmente.';
          break;
      }
    },
    addTypeQuestion() {
      switch (this.pregTipo) {
        case 1:
          this.titPregTipo = 'Crear pregunta de opción múltiple.';
          this.txtPregTipo = 'Esta pregunta puede tener una o varias opciones correctas. Las opciones pueden contener: solo texto, solo imágenes o ambas.';
          break;
        case 2:
          this.titPregTipo = 'Crear pregunta cerrada';
          this.txtPregTipo = 'Esta pregunta debe ser respondida de forma escrita. La respuesta correcta debe contener palabras clave para poder comparar con la respuesta del estudiante.';
          break;
        case 3:
          this.titPregTipo = 'Crear pregunta de Verdadero o Falso';
          this.txtPregTipo = 'Esta pregunta debe tener dos opciones, una correcta y otra incorrecta.';
          break;
        case 4:
          this.titPregTipo = 'Crear pregunta de tipo dicotómica (Si o No)';
          this.txtPregTipo = 'Esta pregunta debe tener dos opciones, una correcta y otra incorrecta.';
          break;
        case 5:
          this.titPregTipo = 'Crear pregunta de selección simple';
          this.txtPregTipo = 'Esta pregunta puede tener solo una opción correcta. Las opciones pueden contener: solo texto, solo imágenes o ambas.';
          break;
        default:
          this.titPregTipo = 'Crear pregunta abierta';
          this.txtPregTipo = 'Esta pregunta no tiene una respuesta. Es una pregunta de opinión que se deberá calificar manualmente.';
          break;
      }
    },
    agregar() {
      let me = this;
      if (me.pregunta.descripcion.trim() === '' || me.pregunta.tema === '' || me.pregunta.tema === undefined || me.pregunta.tema === null || this.pregunta.puntaje_pregunta === '' || me.pregunta.puntaje_pregunta === undefined) {
        me.$vs.notify({
          text: 'Debe completar todos los campos antes de guardar',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        return;
      }

      if (me.pregunta.tema.id === '') {
        me.$vs.notify({
          text: 'Seleccione un ' + me.tema_ambito + ' antes de guardar',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        return;
      }

      me.$vs.loading()
      let fileImgPreg
      fileImgPreg = document.getElementById("file1").files[0];
      me.pregunta.file1 = fileImgPreg;

      const formData = new FormData();
      formData.append('descripcion', me.pregunta.descripcion);
      formData.append('tema', me.pregunta.tema.id);
      formData.append('img_pregunta', fileImgPreg);
      formData.append('id_tipo_pregunta', me.pregTipo);
      formData.append('puntaje_pregunta', me.pregunta.puntaje_pregunta);
      formData.append('idusuario', me.usuario.idusuario);
      formData.append('estado', me.pregunta.estado);
      formData.append('grupo_user', me.usuario.id_group);
      axios.post(this.$data_url + 'api/pregunta', formData)
        .then(res => {
          me.guardadoActivo = true;
          me.id_preguntaActiva = res.data.id;
          me.filtrarTipos()
          me.$vs.notify({
            text: 'Pregunta creada exitosamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
        })
        .catch(function (error) {
          console.log(error + ': error al crear pregunta');
        })


    },
    cargarOpcion() {
      let me = this;
      if (me.id_preguntaActiva === '') {
        me.$vs.notify({
          text: 'Debe crear una pregunta antes de cargar las opciones.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
      } else {
        me.$vs.loading()

        const formData = new FormData();

        let fileImgPreg = document.getElementById("file2").files[0];
        let tipo = 0;
        if (me.opcion.tipo === true) {
          tipo = 1;
        }
        formData.append('opcion', me.opcion.opcion);
        formData.append('id_pregunta', me.id_preguntaActiva);
        formData.append('img_opcion', fileImgPreg);
        formData.append('tipo', tipo);
        formData.append('cant_coincidencias', 0);

        axios.post(this.$data_url + 'api/cargarOpcion', formData)
          .then(res => {
            me.opciones = res.data;
            me.msgExito('cargada');
            
            // Esperar 2 segundos antes de limpiar para que el usuario vea el resultado
            setTimeout(() => {
              me.opcion.opcion = '';
              me.opcion.tipo = '';
              me.src_imagen_opcion = '';
              document.getElementById("file2").value = '';
              me.opcionEditorKey++; // Forzar re-renderizado del editor
              // Resetear el editor después de que se re-renderice
              me.$nextTick(() => {
                if (me.$refs.opcionEditor) {
                  me.$refs.opcionEditor.resetEditor();
                }
              });
            }, 2000); // 2 segundos de delay
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    },
    cargarOpcionAbierta() {
      let me = this;
      if (me.pregunta.cant_coincidencias === '' || me.pregunta.cant_coincidencias === undefined || me.pregunta.cant_coincidencias < 0) {
        me.$vs.notify({
          text: 'Ingrese la cantidad de coincidencias de palabras clave.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        return
      }

      if (me.id_preguntaActiva === '') {
        me.$vs.notify({
          text: 'Debe crear una pregunta antes de cargar las opciones.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
      } else {
        me.$vs.loading()
        let tipo = 1;
        let palabrasV = me.palabras_clave.replace(/ /gi, '')
        const formData = new FormData();
        formData.append('opcion', palabrasV);
        formData.append('id_pregunta', me.id_preguntaActiva);
        formData.append('img_opcion', null);
        formData.append('tipo', tipo);
        formData.append('cant_coincidencias', parseInt(me.pregunta.cant_coincidencias));
        this.$http.post(this.$server_url + 'cargarOpcion', formData)
          .then(res => {
            me.opciones = res.data;
            me.opcion.opcion = '';
            me.opcion.tipo = '';
            me.src_imagen_opcion = '';
            me.msgExito('guardada');
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    },
    cargarOpcionesDico() {
      let me = this;
      if (me.id_preguntaActiva === '') {
        me.$vs.notify({
          text: 'Debe crear una pregunta antes de cargar las opciones.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
      } else {
        me.$vs.loading()
        const formData = new FormData();
        formData.append('opcion', me.opcion.opcion);
        formData.append('id_pregunta', me.id_preguntaActiva);
        formData.append('img_opcion', null);
        formData.append('tipo', 1);
        formData.append('cant_coincidencias', 0);
        this.$http.post(this.$server_url + 'cargarOpcionDico', formData)
          .then(res => {
            me.opcion.opcion = '';
            me.opcion.tipo = '';
            me.src_imagen_opcion = '';
            me.msgExito('guardada');
          })
          .catch(function (error) {
            console.log(error);
          })
      }
    },
    confirmEditarOpcion(item) {
      let me = this;
      me.editarOpcionActiva = false;

      let fileImgOpcion;
      fileImgOpcion = document.getElementById("file2").files[0];

      if (fileImgOpcion === undefined) {
        fileImgOpcion = item.img_opcion;
      }

      let tipo = 0;
      if (me.opcion.tipo === true || me.opcion.tipo === 1) {
        tipo = 1;
      }

      const formData = new FormData();
      formData.append('opcion', me.opcion.opcion);
      formData.append('tipo', tipo);
      formData.append('img_opcion', fileImgOpcion);
      formData.append('img_opcion_old', img_opcion_old);
      formData.append('id_opcion_pregunta', item.id_opcion_pregunta);
      formData.append('id_pregunta', item.id_pregunta);
      formData.append('cant_coincidencias', 0);
      axios.post(this.$data_url + 'api/editarOpcion', formData).
        then(res => {
          me.opciones = res.data;
          me.msgExito('cargada');
          
          // Esperar 2 segundos antes de limpiar para que el usuario vea el resultado
          setTimeout(() => {
            me.editarOpcionActiva = false;
            me.opcion.opcion = '';
            me.opcion.tipo = '';
            me.opcion.id_opcion_pregunta = '';
            me.opcion.id_pregunta = '';
            me.src_imagen_opcion = '';
            document.getElementById("file2").value = '';
            me.opcionEditorKey++; // Forzar re-renderizado del editor
            // Resetear el editor después de que se re-renderice
            me.$nextTick(() => {
              if (me.$refs.opcionEditor) {
                me.$refs.opcionEditor.resetEditor();
              }
            });
          }, 2000); // 2 segundos de delay
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    cancelarEdicionOpcion() {
      let me = this;
      me.editarOpcionActiva = false;
      me.opcion.opcion = '';
      me.opcion.tipo = '';
      me.opcion.id_opcion_pregunta = '';
      me.opcion.id_pregunta = '';
      me.src_imagen_opcion = '';
      document.getElementById("file2").value = '';
      me.opcionEditorKey++; // Forzar re-renderizado del editor
      // Resetear el editor después de que se re-renderice
      me.$nextTick(() => {
        if (me.$refs.opcionEditor) {
          me.$refs.opcionEditor.resetEditor();
        }
      });
    },
    editarOpcion(item) {
      let me = this;
      location.href = '#editar'
      me.opcion.opcion = '';
      document.getElementById("file2").value = '';

      me.opcion.opcion = item.opcion;
      me.opcion.tipo = item.tipo;
      me.opcion.id_opcion_pregunta = item.id_opcion_pregunta;
      me.opcion.id_pregunta = item.id_pregunta;

      img_opcion_old = item.img_opcion;
      // Solo mostrar imagen si existe y no es vacía o null
      if (item.img_opcion && item.img_opcion != '' && item.img_opcion != 'null') {
        me.src_imagen_opcion = this.$data_url + 'archivos/img/img_preguntas/' + item.img_opcion;
      } else {
        me.src_imagen_opcion = '';
      }
    },
    editarOpcionesDico() {
      let me = this;
      me.$vs.loading()
      const formData = new FormData();
      formData.append('opcion', me.opcion.opcion);
      formData.append('id_pregunta', me.id_preguntaActiva);
      formData.append('img_opcion', null);
      formData.append('tipo', 1);
      formData.append('id_opcion', 1);
      formData.append('cant_coincidencias', 0);

      this.$http.post(this.$server_url + 'cargarOpcionDico', formData)
        .then(res => {
          me.msgExito('editada');
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    confirmarEliminarPreg() {
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirmar',
        acceptText: 'Si, deseo eliminar',
        cancelText: 'Cancelar',
        text: '¿Está seguro de eliminar esta pregunta?',
        accept: this.eliminarPregunta
      })
    },
    eliminarPregunta() {
      let me = this;
      axios.get(this.$data_url + 'api/eliminarPregunta?id=' + me.datosEliminar.id)
        .then(res => {
          // this.$http.get(this.$server_url+`eliminarPregunta/`+me.datosEliminar.id).then(() => {
          if (res.data.status == 0) {
            me.$vs.notify({
              text: res.data.message,
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-check',
              time: 4000
            })
            return;
          }
          me.filtrarTipos();

          /*this.$http.get(this.$server_url+'preguntasDocente/'+me.usuario.idusuario).then(res => {
              me.preguntas = res.data;
              me.$vs.loading.close()
          })
          .catch(function (error) {
              console.log(error + ': error al eliminar pregunta');
          })*/
        })
        .catch(function (error) {
          alert(error + 'NO SE PUEDE ELIMINAR ESTA PREGUNTA, YA QUE SE ESTÁ UTILIZANDO EN UNA EVALUACIÓN.');
        })
    },
    quitarOpcion(item) {
      let me = this;
      me.$vs.loading()
      this.$http.get(this.$server_url + 'quitarOpcion/' + item.id_opcion_pregunta)
        .then(res => {
          me.removeItemFromArr(me.opciones, item)
          me.$vs.loading.close()
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    editarFormulario(item) {
      let me = this;
      me.limpiar();
      me.pregTipo = item.id_tipo_pregunta;
      me.addTypeQuestion();
      me.id_preguntaActiva = item.id;
      me.temaSelected = { id: item.id_tema, label: item.nombre_tema };
      me.pregunta.descripcion = item.descripcion;
      me.pregunta.tema = { id: item.id_tema, label: item.nombre_tema };
      me.pregunta.id = item.id;
      me.pregunta.img_pregunta = item.img_pregunta;
      me.pregunta.puntaje_pregunta = item.puntaje_pregunta;
      me.pregunta.estado = item.estado
      img_preg_old = item.img_pregunta;
      me.srcPreguntaAQuitar = item.img_pregunta;
      // Solo mostrar imagen si existe y no es null
      if (item.img_pregunta != '' && item.img_pregunta != null && item.img_pregunta != 'null') { 
        me.src_imagen_pregunta = this.$data_url + 'archivos/img/img_preguntas/' + item.img_pregunta; 
      } else {
        me.src_imagen_pregunta = '';
      }
      me.editarActivo = true;
      ///mostrar opciones
      this.$http.get(this.$server_url + 'verOpciones/' + item.id)
        .then(res => {
          if (res.data.length > 0) {
            me.opciones = res.data;
            me.palabras_clave = res.data[0].opcion;
            me.id_opcion_tipo234 = res.data[0].id_opcion_pregunta;
            me.pregunta.cant_coincidencias = res.data[0].cant_coincidencias;
            
            // Para preguntas tipo 3 (Verdadero/Falso) y tipo 4 (Si/No), NO asignar aquí
            // La asignación se hará cuando el usuario cambie al tab "Respuesta"
            // Esto se maneja en el watcher de activeTab
            if (item.id_tipo_pregunta !== 3 && item.id_tipo_pregunta !== 4) {
              me.opcion.opcion = res.data[0].opcion;
            }
          }
        })
        .catch(function (error) {
          console.log(error);
        })
    },
    quitarImagen() {
      let me = this;
      me.src_imagen_pregunta = '';
      document.getElementById("file1").value = ''
      img_preg_old = '';
    },
    editarPregunta() {
      let me = this;
      if (me.pregunta.estado == "" || me.pregunta.estado == null || me.pregunta.estado == undefined) {
        me.$vs.notify({
          text: 'Debe seleccionar un estado para la pregunta',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        return;
      }
      if (me.pregunta.descripcion.trim() === '' || me.pregunta.tema === '' || me.pregunta.tema === undefined || me.pregunta.tema === null || me.pregunta.puntaje_pregunta === '' || me.pregunta.puntaje_pregunta === undefined) {
        me.$vs.notify({
          text: 'Debe completar todos los campos antes de guardar',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        return;
      }

      me.$vs.loading()
      let fileImgPreg;
      const formData = new FormData();
      fileImgPreg = document.getElementById("file1").files[0];
      if (fileImgPreg === undefined) {
        // fileImgPreg = me.pregunta.img_pregunta;
        formData.append('img_pregunta', "");
      } else {
        formData.append('img_pregunta', fileImgPreg);
      }
      formData.append('descripcion', me.pregunta.descripcion);
      formData.append('tema', me.pregunta.tema.id);
      // formData.append('img_pregunta', fileImgPreg);
      formData.append('img_pregunta_old', img_preg_old);
      formData.append('id', me.pregunta.id);
      formData.append('puntaje_pregunta', me.pregunta.puntaje_pregunta);
      formData.append('idusuario', me.usuario.idusuario);
      formData.append('estado', me.pregunta.estado);
      formData.append('srcPreguntaAQuitar', me.srcPreguntaAQuitar);
      axios.post(this.$data_url + 'api/pregunta', formData).then(res => {
        document.getElementById("file1").value = ''
        me.msgExito('editada');
        me.srcPreguntaAQuitar = '';
      })
        .catch(function (error) {
          console.log(error);
        })
    },
    mostrarImg(file, img) {
      let me = this;

      var archivo = document.getElementById("file" + file).files[0];

      // Validar si se seleccionó un archivo
      if (!archivo) {
        return;
      }

      // Validar tipo de archivo (solo PNG y JPG)
      const tiposPermitidos = ['image/png', 'image/jpg', 'image/jpeg'];
      if (!tiposPermitidos.includes(archivo.type)) {
        me.$vs.notify({
          text: 'Solo se permiten archivos PNG y JPG',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-x'
        });
        // Limpiar el input y la imagen mostrada
        document.getElementById("file" + file).value = '';
        me.limpiarImagenError(file);
        return;
      }

      // Validar tamaño del archivo (máximo 1MB = 1048576 bytes)
      const maxSize = 1048576; // 1MB en bytes
      if (archivo.size > maxSize) {
        me.$vs.notify({
          text: 'La imagen no puede superar 1MB de tamaño',
          color: 'danger',
          iconPack: 'feather',
          icon: 'icon-x'
        });
        // Limpiar el input y la imagen mostrada
        document.getElementById("file" + file).value = '';
        me.limpiarImagenError(file);
        return;
      }

      // Si pasa todas las validaciones, mostrar la imagen
      var reader = new FileReader();
      if (me) {
        reader.readAsDataURL(archivo);
        reader.onloadend = function () {
          // Verificar si el elemento img existe antes de asignar src
          const imgElement = document.getElementById("img" + img);
          if (imgElement) {
            imgElement.src = reader.result;
            imgElement.style.display = 'block';
          }

          // Asignar la imagen según el tipo
          if (file === 1) {
            me.src_imagen_pregunta = reader.result;
          } else if (file === 2) {
            me.src_imagen_opcion = reader.result;
          }

          // Notificación de éxito
          me.$vs.notify({
            text: 'Imagen cargada correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
        }
      }
    },
    // Método para limpiar imagen cuando hay errores de validación
    limpiarImagenError(file) {
      let me = this;
      if (file === 1) {
        // Limpiar imagen de pregunta
        me.src_imagen_pregunta = '';
        const imgElement = document.getElementById("img1");
        if (imgElement) {
          imgElement.src = '';
          imgElement.style.display = 'none';
        }
      } else if (file === 2) {
        // Limpiar imagen de opción
        me.src_imagen_opcion = '';
        const imgElement = document.getElementById("img2");
        if (imgElement) {
          imgElement.src = '';
          imgElement.style.display = 'none';
        }
      }
    },
    // Método para quitar imagen de una opción específica
    quitarImagenOpcion(item) {
      let me = this;
      me.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Confirmar',
        text: '¿Está seguro de quitar la imagen de esta opción?',
        accept: () => {
          // Aquí iría la lógica para eliminar la imagen del servidor si es necesario
          item.img_opcion = '';
          me.$vs.notify({
            text: 'Imagen eliminada correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
        }
      });
    },
    removeItemFromArr(arr, item) {
      const i = arr.indexOf(item)
      arr.splice(i, 1)
    },
    editarPalabrasclave() {
      let me = this;
      if (me.pregunta.cant_coincidencias === '' || me.pregunta.cant_coincidencias === undefined || me.pregunta.cant_coincidencias < 0) {
        me.$vs.notify({
          text: 'Ingrese la cantidad de coincidencias de palabras clave.',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        return
      }
      var cantCoin = parseInt(me.pregunta.cant_coincidencias)
      if (me.id_opcion_tipo234 != '') {
        me.$vs.loading()
        let palabrasV = me.palabras_clave.replace(/ /gi, '')
        const formData = new FormData();
        formData.append('opcion', palabrasV);
        formData.append('tipo', 1);
        formData.append('img_opcion', '');
        formData.append('img_opcion_old', '');
        formData.append('id_opcion_pregunta', me.id_opcion_tipo234);
        formData.append('id_pregunta', me.pregunta.id);
        formData.append('cant_coincidencias', cantCoin);

        this.$http.post(this.$server_url + 'editarOpcion', formData).
          then(res => {
            me.opciones = res.data;
            me.editarOpcionActiva = false;
            me.opcion.opcion = '';
            me.opcion.tipo = '';
            me.src_imagen_opcion = '';
            me.msgExito('editada');
          })
          .catch(function (error) {
            console.log(error);
          })
      } else {
        me.cargarOpcionAbierta()
      }
    },
    msgExito(tipo_msg) {
      let me = this;
      me.preguntas = []
      var tipobanco;
      if (me.bancoSelected === null || me.bancoSelected === '') {
        tipobanco = 'todos'
      } else {
        if (me.bancoSelected.id === '3') {
          tipobanco = 'todos'
        }
        if (me.bancoSelected.id === '1') {
          tipobanco = 'prolipa'
        }

        if (me.bancoSelected.id === '2') {
          tipobanco = 'docente'
        }
      }
      me.tipoSelected = '';
      const formData = new FormData();
      formData.append('id', me.pregunta.tema.id);
      formData.append('tipobanco', tipobanco);
      formData.append('usuario', me.usuario.idusuario);
      formData.append('id_group', me.usuario.id_group)
      formData.append('institucion_id', me.usuario.institucion_idInstitucion)
      var url = ""
      if (me.usuario.id_group == 6) {
        url = 'preguntas_x_tema_Docente'
      } else {
        url = 'preguntasxtema'
      }
      this.$http.post(this.$server_url + url, formData).then(res => {
        let datos = res.data
        if (datos.items) {
          if (datos.items.length > 0) {
            if (me.usuario.id_group == 6) {
              me.preguntas = { items: datos.items.filter(item => item.estado == 1) };
            }
            else { me.preguntas = res.data; }
          }
        }
        me.editarActivo = false;
        if (tipo_msg != 'cargada') {
          me.popupTipoPreg = false;
        }
        me.$vs.loading.close()
        me.$vs.notify({
          text: 'Pregunta ' + tipo_msg + ' exitosamente',
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-check'
        })
      })
        .catch(function (error) {
          console.log(error);
        })

    },
    verpreguntasxtema() {
      let me = this;
      me.preguntas = []
      me.arrayQuestions = []
      if (me.pregunta.tema.id === undefined || me.pregunta.tema.id === null || me.pregunta.tema.id === '' || me.pregunta.tema === '') {
        return;
      }

      var tipobanco;
      if (me.bancoSelected === null || me.bancoSelected === '') {
        tipobanco = 'todos'
      } else {
        if (me.bancoSelected.id === '3') {
          tipobanco = 'todos'
        }
        if (me.bancoSelected.id === '1') {
          tipobanco = 'prolipa'
        }

        if (me.bancoSelected.id === '2') {
          tipobanco = 'docente'
        }
      }
      me.$vs.loading()
      me.tipoSelected = '';
      const formData = new FormData();
      formData.append('id', me.pregunta.tema.id);
      formData.append('tipobanco', tipobanco);
      formData.append('usuario', me.usuario.idusuario);
      formData.append('id_group', me.usuario.id_group)
      formData.append('institucion_id', me.usuario.institucion_idInstitucion)
      var url = ""
      if (me.usuario.id_group == 6) {
        url = 'preguntas_x_tema_Docente'
      } else {
        url = 'preguntasxtema'
      }
      this.$http.post(this.$server_url + url, formData)
        // this.$http.post(this.$server_url+'preguntasxtema', formData)
        .then(res => {
          me.$vs.loading.close()
          let datos = res.data
          me.arrayQuestions = datos
          if (datos.items) {
            if (datos.items.length > 0) {
              if (me.usuario.id_group == 6) {
                me.preguntas = { items: datos.items.filter(item => item.estado == 1) };
              }
              else { me.preguntas = res.data; }
            }
          }
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error);
          me.$vs.notify({
            text: 'Hubo problemas con preguntas para este tema',
            color: 'warning',
            iconPack: 'feather',
            icon: 'icon-check'
          })
        })
    },
    irTemas() {
      let me = this;
      me.popupTipoPreg = false;
      window.location.href = me.urlOrigen;
    },
    filtrarPreguntas() {
      let me = this;
      me.preguntas = []
      me.preguntas.id = ''

      // Limpiar temas cuando cambia la asignatura
      me.temas = []
      me.pregunta.tema = { id: '', label: '' }

      if (me.asignaturaSelected.id === undefined) {
        me.$vs.notify({
          text: 'Seleccione una asignatura antes de filtrar por Unidades',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        })
        return;
      }

      if (me.asignaturaSelected.id === 113 || me.asignaturaSelected.id === 114 || me.asignaturaSelected.id === 115) {
        me.tema_ambito = 'Ámbito'
      } else {
        me.tema_ambito = 'Tema'
      }

      if (me.unidadSelected.id === undefined) {
        return;
      }
      me.$vs.loading()
      const formData = new FormData();
      formData.append('asignatura', me.asignaturaSelected.id);
      formData.append('unidad', me.unidadSelected.id);

      this.$http.post(this.$server_url + 'temasignunidad', formData).then(res => {
        let datos = res.data
        if (me.usuario.id_group == 6) {
          me.temas = datos.filter(p => p.tipo_tema == 0);
          me.temas = me.temas.filter(p => !p.nombre_tema.startsWith("0."));
        }
        else { me.temas = datos }
        me.$vs.loading.close()
      })
        .catch(function (error) {
          console.log(error);
        })

    },
    filtrarTipos() {
      let me = this;
      if (me.pregunta.tema.id === '') {
        return;
      }
      if (me.tipoSelected === null || me.tipoSelected === undefined || me.tipoSelected === '' || me.tipoSelected === 'null') {
        me.verpreguntasxtema()
      } else {
        me.preguntas = []
        me.preguntas = { items: me.arrayQuestions.items.filter(item => item.id_tipo_pregunta == me.tipoSelected.id) };
        // var tipobanco;
        // if( me.bancoSelected===null || me.bancoSelected==='' ){
        //     tipobanco ='todos'
        // }else{
        //     if( me.bancoSelected.id==='3'){
        //         tipobanco = 'todos'
        //     }
        //     if(me.bancoSelected.id==='1'){
        //         tipobanco = 'prolipa'
        //     }
        //     if(me.bancoSelected.id==='2'){
        //         tipobanco = 'docente'
        //     }
        // }
        // me.$vs.loading()
        // const formData = new FormData();
        // formData.append('tema',             me.pregunta.tema.id);
        // formData.append('tipo',             me.tipoSelected.id);
        // formData.append('usuario',          me.usuario.idusuario);
        // formData.append('tipobanco',        tipobanco);
        // formData.append('id_group',         me.usuario.id_group)
        // formData.append('institucion_id',   me.usuario.institucion_idInstitucion)
        // this.$http.post(this.$server_url+'preguntastipo', formData).then(res => {
        //     me.preguntas = res.data;
        //     me.$vs.loading.close()
        // })
        // .catch(function (error) {
        //     console.log(error);
        // })
      }
    },
    cargarPreguntaEval(item) {
      let me = this;
      me.$vs.loading()
      let formData = new FormData();
      formData.append('id_evaluacion', localStorage.id_desde_eval);
      formData.append('id_pregunta', item.id);
      formData.append('grupo', localStorage.grupo_desde_eval);
      me.$http.post(this.$server_url + 'pregEvaluacion', formData)
        .then(res => {
          let msg = 'Pregunta cargada correctamente'
          if (res.data == 0) {
            msg = 'No puede cargar más de una vez la misma pregunta'
          }
          me.$vs.loading.close()
          me.$vs.notify({
            text: msg,
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          })
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error);
        })
    }
  }
}
</script>
<style scoped>
.radio-option-card {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  background: white;
  border: 2px solid #e5e8ed;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 10px;
}

.radio-option-card:hover {
  border-color: #4CAF50;
  background: #f8fdf9;
}

.radio-option-card input[type="radio"] {
  width: 20px;
  height: 20px;
  margin-right: 12px;
  cursor: pointer;
  accent-color: #4CAF50;
}

.radio-option-card input[type="radio"]:checked + .radio-label {
  color: #4CAF50;
  font-weight: 600;
}

.radio-label {
  font-size: 16px;
  color: #374151;
  cursor: pointer;
  user-select: none;
}

.filtros-destacados {
  border: 2px solid #a8b3cf;
  border-radius: 12px;
  padding: 20px;
  background: linear-gradient(135deg, #f8f9fb 0%, #eef1f5 100%);
  box-shadow: 0 4px 15px rgba(168, 179, 207, 0.12);
  margin-bottom: 20px;
}

.filtro-item {
  background: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e8ed;
  transition: all 0.3s ease;
}

.filtro-item:hover {
  /* Hover deshabilitado para evitar efectos de transparencia */
}

.filtro-label {
  font-weight: 600;
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 8px;
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.filtro-item .v-select {
  background-color: white !important;
  opacity: 1 !important;
}

.filtro-item .v-select .vs__dropdown-toggle {
  background-color: white !important;
  border: 1px solid #d1d5db !important;
  border-radius: 6px !important;
  opacity: 1 !important;
  background: white !important;
}

.filtro-item .v-select .vs__selected-options {
  background-color: white !important;
  background: white !important;
  opacity: 1 !important;
}

.filtro-item .v-select .vs__search {
  background-color: white !important;
  background: white !important;
  opacity: 1 !important;
}

.filtro-item .v-select .vs__search input {
  background-color: white !important;
  background: white !important;
  opacity: 1 !important;
}

.filtro-item .v-select .vs__dropdown-menu {
  background-color: white !important;
  background: white !important;
  opacity: 1 !important;
}

.filtro-item .v-select .vs__selected-options {
  background-color: white !important;
}

.filtro-item .v-select .vs__search {
  background-color: white !important;
}


.filtro-item .v-select .vs__selected-options {
  background-color: white !important;
}

.filtro-item .v-select .vs__search {
  background-color: white !important;
}
</style>
