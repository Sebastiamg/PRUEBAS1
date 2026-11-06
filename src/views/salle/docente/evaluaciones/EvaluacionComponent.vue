<template>
  <div class="evaluation-container vx-row w-full p-4">
    <!-- {{ evaluacion.areas[0][0].asignaturas[0][0].preguntas[0].pregunta.created_at }} -->
    <div class="vx-col sm:w-3/4 w-full pr-4">
      <!-- ENCABEZADO PREMIUM -->
      <div class="header-card mb-4">
        <div class="header-content">
          <div class="header-logo">
            <img src="https://plataforma.prolipadigital.com.ec/img/prolipa.a3e6ff1b.png" alt="Prolipa">
          </div>
          <div class="header-info">
            <div v-if="revisa_admin_salle != 1" class="student-name">
              <i class="feather icon-user"></i>
              <span>{{ usuario.nombres }} {{ usuario.apellidos }}</span>
              <span class="student-id">{{ usuario.cedula }}</span>
            </div>
            <div v-else class="student-name">
              <i class="feather icon-user"></i>
              <span>{{ datos_docente_revisando }}</span>
            </div>
            <div class="date-info">
              <div class="date-item">
                <i class="feather icon-calendar"></i>
                <span>{{ configuracion.fecha_inicio }}</span>
              </div>
              <span class="date-divider">→</span>
              <div class="date-item">
                <i class="feather icon-flag"></i>
                <span>{{ configuracion.fecha_fin }}</span>
              </div>
            </div>
            <div v-if="configuracion.observaciones !== null && configuracion.observaciones != 'null'" class="observations">
              <i class="feather icon-info"></i>
              {{ configuracion.observaciones }}
            </div>
            <div class="evaluation-badge">
              <span>
                {{ EvaluacionSelectSalleNombre }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="evaluacion_activa == 1">
        <!-- AREA CONTENT -->
        <div v-for="(item, index) in evaluacion" :key="index" v-show="selectedIndex === index" class="fade-in">
          <div v-if="mostrar">
            <!-- QUESTIONS CONTAINER PREMIUM -->
            <div v-if="item.asignaturas[selectedAsignaturaIndex]" class="question-card">

              <!-- Question Header -->
              <div class="question-header">
                <div class="question-title">
                  <span class="question-number-badge">{{ currentPregIndex }}</span>
                  <div class="question-title-text">
                    <span class="question-label">Pregunta</span>
                    <span class="subject-name">{{ item.asignaturas[selectedAsignaturaIndex].nombre_asignatura }}</span>
                  </div>
                </div>
                <div class="question-meta">
                  <span class="meta-item type">
                    <i class="feather icon-tag"></i>
                    {{ (item.asignaturas[selectedAsignaturaIndex].preguntas[currentPregIndex - 1] && item.asignaturas[selectedAsignaturaIndex].preguntas[currentPregIndex - 1].nombre_tipo) || 'Pregunta' }}
                  </span>
                  <span class="meta-item points">
                    <i class="feather icon-award"></i>
                    <template v-if="revision_activa">
                      {{ getPuntajeObtenido(item.asignaturas[selectedAsignaturaIndex].preguntas[currentPregIndex - 1]) }} / {{ (item.asignaturas[selectedAsignaturaIndex].preguntas[currentPregIndex - 1] && item.asignaturas[selectedAsignaturaIndex].preguntas[currentPregIndex - 1].puntaje_pregunta) || 0 }} pts
                    </template>
                    <template v-else>
                      {{ (item.asignaturas[selectedAsignaturaIndex].preguntas[currentPregIndex - 1] && item.asignaturas[selectedAsignaturaIndex].preguntas[currentPregIndex - 1].puntaje_pregunta) || 0 }} pts
                    </template>
                  </span>
                </div>
              </div>

              <!-- Question Navigation Pills -->
              <div class="question-nav-pills">
                <button
                  v-for="(itemP, indexP) in item.asignaturas[selectedAsignaturaIndex].preguntas"
                  :key="indexP"
                  @click="paginacion2(indexP + 1, item.asignaturas[selectedAsignaturaIndex].preguntas.length, item.asignaturas[selectedAsignaturaIndex].id_asignatura)"
                  class="nav-pill-btn"
                  :class="getNavPillClass(indexP, itemP, item.asignaturas[selectedAsignaturaIndex].id_asignatura)"
                >
                  {{ indexP + 1 }}
                </button>
              </div>

              <!-- Question Content Area -->
              <div class="question-content">
                <div v-for="(itemP, indexP) in item.asignaturas[selectedAsignaturaIndex].preguntas" :key="indexP"
                  v-show="currentPregIndex === indexP + 1" class="question-animate">

                  <!-- Question Text -->
                  <div class="question-text-container">
                    <div class="question-text">
                      <span v-html="itemP.descripcion"></span>
                    </div>
                  </div>

                  <!-- Question Image -->
                  <div v-if="itemP.img_pregunta && itemP.img_pregunta !== 'null'" class="question-image">
                    <img
                      :src="$data_url + 'archivos/img/salle/img_preguntas/' + itemP.img_pregunta"
                      @click="dataPregunta = itemP; popupMostrarImagen = true;"
                    >
                    <span class="image-hint">
                      <i class="feather icon-zoom-in"></i> Clic para ampliar
                    </span>
                  </div>

                  <!-- Options -->
                  <!--AGREGAR RESPUESTA SELECCIONADA TIPO PREGUNTA MULTIPLE-->
                  <!-- <div v-for="(itemRes, indexRes) in itemP.respuestas" :key="indexRes" style="display: none;">
                      {{opciones_check[itemRes.respuesta] = itemRes.respuesta}}
                  </div> -->
                  <div
                    v-for="(itemRes, indexRes) in itemP.respuestas"
                    :key="indexRes"
                    style="display:none"
                  >
                    {{
                      (opciones_check[itemRes.respuesta] == null)
                        ? opciones_check[itemRes.respuesta] = itemRes.respuesta
                        : opciones_check[itemRes.respuesta]
                    }}
                  </div>
                  <!--FIN  AGREGAR RESPUESTA A MULTIPLE-->
                  <div class="options-container">
                    <!-- Multiple Choice (Checkbox) -->
                    <div v-if="itemP.id_tipo_pregunta === 1" class="options-list">
                      <div v-for="(itemO, indexO) in itemP.opciones" :key="indexO"
                           class="option-item"
                           :class="{
                             'selected': opciones_check[itemO.id_opcion_pregunta],
                             'correct': revision_activa && itemO.tipo == 1 && opciones_check[itemO.id_opcion_pregunta],
                             'incorrect': revision_activa && itemO.tipo == 0 && opciones_check[itemO.id_opcion_pregunta],
                             'show-correct': revision_activa && itemO.tipo == 1 && !opciones_check[itemO.id_opcion_pregunta]
                           }">
                        <div class="option-content">
                          <div v-if="revision_activa" class="revision-indicator">
                            <i v-if="itemO.tipo == 1 && opciones_check[itemO.id_opcion_pregunta]" class="feather icon-check-circle correct-icon"></i>
                            <i v-if="itemO.tipo == 0 && opciones_check[itemO.id_opcion_pregunta]" class="feather icon-x-circle incorrect-icon"></i>
                            <i v-if="itemO.tipo == 1 && !opciones_check[itemO.id_opcion_pregunta]" class="feather icon-check-circle show-correct-icon"></i>
                          </div>
                          <label class="checkbox-label">
                            <vs-checkbox
                              :disabled="revision_activa"
                              v-model="opciones_check[itemO.id_opcion_pregunta]"
                              :vs-value="itemO.id_opcion_pregunta"
                              @input="guardarSeleccion(1, itemO, itemP.opciones, itemP.puntaje_pregunta, item.asignaturas[selectedAsignaturaIndex].id_asignatura, indexP)"
                              class="option-checkbox"
                            >
                              <span class="option-text">{{ itemO.opcion }}</span>
                              <img v-if="itemO.img_opcion && itemO.img_opcion !== 'null'"
                                  :src="$data_url + 'archivos/img/salle/img_preguntas/' + itemO.img_opcion"
                                  class="option-image">
                            </vs-checkbox>
                          </label>
                        </div>
                      </div>
                    </div>

                      <!-- <div v-for="(itemRes, indexRes) in itemP.respuestas" :key="indexRes">
                          {{opciones[itemRes.id_pregunta] = itemRes.respuesta}}
                      </div> -->
                    <!--AGREGAR RESPUESTA SELECCIONADA TIPO PREGUNTA VERDADERO FALSEO Y SIMPLE-->
                    <div v-for="(itemRes, indexRes) in itemP.respuestas" :key="indexRes" style="display:none">
                      {{
                        (opciones[itemRes.id_pregunta] == null)
                          ? opciones[itemRes.id_pregunta] = itemRes.respuesta
                          : opciones[itemRes.id_pregunta]
                      }}
                    </div>
                    <!--FIN  AGREGAR RESPUESTA A VERDADERO FALSO Y SIMPLE-->
                    <!-- Single Choice (Radio) - Sin componente radio, solo borde visual -->
                    <div v-if="itemP.id_tipo_pregunta === 3 || itemP.id_tipo_pregunta === 5" class="options-list">
                      <div v-for="(itemO, indexO) in itemP.opciones" :key="indexO"
                           class="option-item"
                           :class="{
                             'selected': opciones[itemO.id_pregunta] == itemO.id_opcion_pregunta,
                             'correct': revision_activa && itemO.tipo == 1 && opciones[itemO.id_pregunta] == itemO.id_opcion_pregunta,
                             'incorrect': revision_activa && opciones[itemO.id_pregunta] == itemO.id_opcion_pregunta && itemO.tipo != 1,
                             'show-correct': revision_activa && itemO.tipo == 1 && opciones[itemO.id_pregunta] != itemO.id_opcion_pregunta
                           }"
                           @click="!revision_activa && seleccionarOpcion(itemO, itemP, indexP)"
                           :style="!revision_activa ? 'cursor: pointer;' : 'cursor: default;'"
                      >
                        <div class="option-content">
                          <div v-if="revision_activa" class="revision-indicator">
                            <i v-if="itemO.tipo == 1 && opciones[itemO.id_pregunta] == itemO.id_opcion_pregunta" class="feather icon-check-circle correct-icon"></i>
                            <i v-if="opciones[itemO.id_pregunta] == itemO.id_opcion_pregunta && itemO.tipo != 1" class="feather icon-x-circle incorrect-icon"></i>
                            <i v-if="itemO.tipo == 1 && opciones[itemO.id_pregunta] != itemO.id_opcion_pregunta" class="feather icon-check-circle show-correct-icon"></i>
                          </div>
                          <div class="option-text-container">
                            <span class="option-text">{{ itemO.opcion }}</span>
                            <img v-if="itemO.img_opcion && itemO.img_opcion !== 'null'"
                                :src="$data_url + 'archivos/img/salle/img_preguntas/' + itemO.img_opcion"
                                class="option-image">
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Navigation Footer -->
              <div class="question-footer">
                <button
                  @click="anteriorPregunta(item.asignaturas[selectedAsignaturaIndex].id_asignatura)"
                  :disabled="currentPregIndex === 1"
                  class="nav-btn nav-btn-prev"
                  :class="{ 'disabled': currentPregIndex === 1 }"
                >
                  <i class="feather icon-chevron-left"></i>
                  <span>Anterior</span>
                </button>

                <div class="page-indicator">
                  <span class="current">{{ currentPregIndex }}</span>
                  <span class="separator">/</span>
                  <span class="total">{{ item.asignaturas[selectedAsignaturaIndex].preguntas.length }}</span>
                </div>

                <button
                  @click="siguientePregunta(item.asignaturas[selectedAsignaturaIndex].id_asignatura, item.asignaturas[selectedAsignaturaIndex].preguntas.length)"
                  :disabled="currentPregIndex === item.asignaturas[selectedAsignaturaIndex].preguntas.length"
                  class="nav-btn nav-btn-next"
                  :class="{ 'disabled': currentPregIndex === item.asignaturas[selectedAsignaturaIndex].preguntas.length }"
                >
                  <span>Siguiente</span>
                  <i class="feather icon-chevron-right"></i>
                </button>
              </div>

            </div>
          </div>
        </div>
      </div>

      <!-- Error / Finalized State -->
      <div class="alert-card" v-else>
        <div class="alert-icon">
          <i class="feather icon-info"></i>
        </div>
        <h5 class="alert-title">{{ alerta_evaluacion }}</h5>
        <button class="btn-back" @click="$router.go(-1)">
          <i class="feather icon-arrow-left"></i>
          <span>Volver</span>
        </button>
      </div>
    </div>

    <!-- SIDEBAR / TIME - Premium Design -->
    <div class="vx-col sm:w-1/4 w-full">
      <div v-if="evaluacion_activa == 1" class="sidebar-premium sticky top-5">

        <!-- Timer Card -->
        <div class="timer-card" :class="{ 'timer-warning': tiempoRestanteBajo }" v-if="revision_activa == false">
          <div class="timer-header">
            <div class="timer-icon-wrapper">
              <i class="feather icon-clock" :class="{ 'pulse-animation': tiempoRestanteBajo }"></i>
            </div>
            <span class="timer-label">TIEMPO RESTANTE</span>
          </div>
          <div class="reloj timer-display"></div>
          <div class="timer-decoration"></div>
        </div>

        <!-- Results Card (Revision Mode) -->
        <div v-if="revision_activa === true" class="results-card">
          <div class="results-header">
            <i class="feather icon-award"></i>
            <span>Resultados</span>
          </div>

          <div class="score-circle-container">
            <div class="score-circle">
              <svg class="score-ring" viewBox="0 0 100 100">
                <circle class="score-ring-bg" cx="50" cy="50" r="45"/>
                <circle class="score-ring-progress" cx="50" cy="50" r="45"
                  :style="`stroke-dashoffset: ${283 - (283 * calificacion100 / 100)}`"/>
              </svg>
              <div class="score-value">
                <span class="score-number">{{ calificacion100 }}</span>
                <span class="score-total">/100</span>
              </div>
            </div>
          </div>

          <div class="results-stats">
            <div class="stat-item stat-pending">
              <i class="feather icon-alert-circle"></i>
              <span class="stat-value">{{ cantidadPreguntasSinResponder }}</span>
              <span class="stat-label">Sin Responder</span>
            </div>
            <div class="stat-item stat-done">
              <i class="feather icon-list"></i>
              <span class="stat-value">{{ cantidadPreguntasRespondidas }}</span>
              <span class="stat-label">Respondidas</span>
            </div>
          </div>
          <!-- Conteo de incorrectas y correctas deshabilitado temporalmente -->
          <!-- <div class="results-stats">
             <div class="stat-item stat-incorrect">
              <i class="feather icon-x-circle"></i>
              <span class="stat-value">{{ cantidadPreguntasIncorrectas }}</span>
              <span class="stat-label">Incorrectas</span>
            </div>
            <div class="stat-item stat-correct">
              <i class="feather icon-check-circle"></i>
              <span class="stat-value">{{ cantidadPreguntasCorrectas }}</span>
              <span class="stat-label">Correctas</span>
            </div>
          </div> -->
        </div>

        <!-- Progress Card -->
        <div class="progress-card" v-if="!userAdminSalle && revision_activa === false">
          <div class="progress-header">
            <span class="progress-title">
              <i class="feather icon-trending-up"></i>
              Progreso Total
            </span>
            <span class="progress-percentage" :class="getProgressColorClass">
              {{ Math.round((cantidadPreguntasRespondidas / cantidadPreguntas) * 100) || 0 }}%
            </span>
          </div>

          <div class="progress-bar-container">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" :style="`width: ${(cantidadPreguntasRespondidas / cantidadPreguntas) * 100}%`" :class="getProgressBarClass"></div>
            </div>
          </div>

          <div class="progress-details">
            <div class="progress-stat pending">
              <span class="dot"></span>
              <span>{{ cantidadPreguntasSinResponder }} pendientes</span>
            </div>
            <div class="progress-stat completed">
              <span class="dot"></span>
              <span>{{ cantidadPreguntasRespondidas }} listas</span>
            </div>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="actions-container" v-if="!userAdminSalle">
          <button v-if="evaluacion_activa == 1 && revision_activa === false"
            @click="openConfirmFinalizar()"
            class="btn-finalizar">
            <i class="feather icon-check-square"></i>
            <span>Finalizar evaluación</span>
          </button>
          <button v-if="revisa_admin_salle == 1"
            @click="openConfirmFinalizar()"
            class="btn-finalizar">
            <i class="feather icon-check-square"></i>
            <span>Finalizar evaluación</span>
          </button>
        </div>

        <button class="btn-volver" @click="$router.go(-1)">
          <i class="feather icon-arrow-left"></i>
          <span>{{revision_activa == true ? 'Volver' : 'Volver sin terminar'}}</span>
        </button>

        <!-- Navigation Section -->
        <div class="nav-section" v-if="evaluacion.length > 0">

          <!-- Areas Pills -->
          <div class="nav-group">
            <div class="nav-group-title">
              <i class="feather icon-layers"></i>
              <span>Áreas</span>
            </div>
            <div class="nav-pills">
              <button
                v-for="(itemR, indexR) in evaluacion"
                :key="'side-area-'+indexR"
                @click="ver_area(indexR)"
                class="nav-pill"
                :class="{ 'active': selectedIndex === indexR }">
                <span class="pill-text">{{ itemR.nombre_area }}</span>
                <span v-if="selectedIndex === indexR" class="pill-indicator"></span>
              </button>
            </div>
          </div>

          <!-- Asignaturas -->
          <div class="nav-group" v-if="evaluacion[selectedIndex]">
            <div class="nav-group-title">
              <i class="feather icon-book-open"></i>
              <span>Asignaturas</span>
            </div>
            <div class="nav-pills asignaturas">
              <button
                v-for="(itemA, indexA) in evaluacion[selectedIndex].asignaturas"
                :key="'side-asig-'+indexA"
                @click="ver_asignatura(indexA)"
                class="nav-pill"
                :class="getAsignaturaClass(itemA, indexA)">
                <i v-if="!revision_activa && checkAsignaturaCompleta(itemA)" class="feather icon-check-circle completed-icon"></i>
                <i v-if="revision_activa && getAsignaturaEstado(itemA) === 'correctas'" class="feather icon-check-circle completed-icon"></i>
                <i v-if="revision_activa && getAsignaturaEstado(itemA) === 'incorrectas'" class="feather icon-x-circle completed-icon"></i>
                <i v-if="revision_activa && getAsignaturaEstado(itemA) === 'mixto'" class="feather icon-alert-circle completed-icon"></i>
                <span class="pill-text">{{ itemA.nombre_asignatura }}</span>
              </button>
            </div>
          </div>

          <!-- Questions Grid -->
          <div class="nav-group" v-if="evaluacion[selectedIndex] && evaluacion[selectedIndex].asignaturas[selectedAsignaturaIndex]">
            <div class="nav-group-title">
              <i class="feather icon-help-circle"></i>
              <span>Preguntas</span>
              <span class="question-counter">
                {{ currentPregIndex }}/{{ evaluacion[selectedIndex].asignaturas[selectedAsignaturaIndex].preguntas.length }}
              </span>
            </div>
            <div class="questions-grid custom-scrollbar">
              <button
                v-for="(itemP, indexP) in evaluacion[selectedIndex].asignaturas[selectedAsignaturaIndex].preguntas"
                :key="'side-preg-'+indexP"
                @click="paginacion2(indexP + 1, evaluacion[selectedIndex].asignaturas[selectedAsignaturaIndex].preguntas.length, evaluacion[selectedIndex].asignaturas[selectedAsignaturaIndex].id_asignatura)"
                class="question-btn"
                :class="getQuestionBtnClass(indexP, itemP, evaluacion[selectedIndex].asignaturas[selectedAsignaturaIndex].id_asignatura)">
                <span class="question-number">{{ indexP + 1 }}</span>
                <!-- Badge en modo revisión -->
                <span v-if="revision_activa && isPreguntaCorrecta(itemP) === true" class="answered-indicator answered-indicator-correct">
                  <i class="feather icon-check"></i>
                </span>
                <span v-else-if="revision_activa && isPreguntaCorrecta(itemP) === false" class="answered-indicator answered-indicator-incorrect">
                  <i class="feather icon-x"></i>
                </span>
                <!-- Badge en modo normal -->
                <span v-else-if="!revision_activa && isQuestionAnswered(indexP, itemP, evaluacion[selectedIndex].asignaturas[selectedAsignaturaIndex].id_asignatura)" class="answered-indicator">
                  <i class="feather icon-check"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- MODALES -->
    <vs-popup classContent="popup-example" title="Advertencia" :active.sync="popupConfirmStart" @close="handleClose"
      :class="{ 'hide-close': !showCloseButton }">
      <div v-if="intentosEvaluacion == 0">
        <div class="text-center">
            <h3 class="text-2xl font-bold text-success mb-2">¡Buena suerte!</h3>
            <p class="text-gray-600 mb-6">Al comenzar correrá el tiempo asignado.</p>

            <div class="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6 text-left">
                <p class="text-orange-800 font-medium flex items-center">
                    <i class="feather icon-alert-triangle mr-2"></i> Importante:
                </p>
                <p class="text-orange-700 text-sm mt-1">No cambies de pestaña ni cierres el navegador, de lo contrario tu evaluación finalizará automáticamente.</p>
            </div>

            <img src="https://cdn-icons-png.flaticon.com/512/3344/3344374.png" width="120" class="mx-auto mb-6"/>

            <div class="flex justify-center gap-3">
                <vs-button color="success" class="shadow-lg" @click="acceptAlert()">Comenzar Evaluación</vs-button>
                <vs-button color="warning" type="border" @click="volver()">Cancelar</vs-button>
            </div>
        </div>
      </div>

      <div v-if="intentosEvaluacion > 0 && intentosEvaluacion <= maxIntentosVentana">
        <div class="text-center">
            <h3 v-if="maxIntentosVentana - intentosEvaluacion > 0" class="text-xl font-bold text-red-600 mb-3">Advertencia de Abandono</h3>
            <h3 v-else class="text-xl font-bold text-danger text-2xl mb-3">Se te acabaron los intentos</h3>

            <p v-if="maxIntentosVentana - intentosEvaluacion > 0" class="text-gray-700 mb-4">Has abandonado la evaluación previamente.</p>
            <p v-else class="text-gray-700 mb-4">La evaluación ha finalizado.</p>

            <p v-if="maxIntentosVentana - intentosEvaluacion > 0" class="text-gray-900 font-bold text-lg mb-4">
              Te quedan <span class="text-red-600 text-2xl">{{ maxIntentosVentana - intentosEvaluacion }}</span> intentos.
            </p>

            <p v-if="maxIntentosVentana - intentosEvaluacion > 0" class="text-gray-600 text-sm mb-4">Si abandonas nuevamente, la evaluación <b>finalizará automáticamente</b>.</p>
            <img src="https://cdn-icons-png.flaticon.com/512/2797/2797387.png" width="150" class="mx-auto mb-6"/>
        </div>
        <div class="flex justify-center">
          <vs-button v-if="maxIntentosVentana - intentosEvaluacion > 0" @click="acceptAlert()">Continuar Evaluación</vs-button>
          <vs-button v-else color="warning" type="filled" @click="acceptAlert()">Entendido</vs-button>
        </div>
      </div>
      <div v-if="intentosEvaluacion > maxIntentosVentana">
        <div class="text-center">
          <p class="font-bold text-danger text-2xl mb-3">Evaluación Suspendida</p>
          <p class="text-gray-700 mb-4">
            Has excedido el número máximo de <b>{{ maxIntentosVentana }}</b> intentos permitidos.
          </p>
          <p class="text-gray-600 text-sm mb-4">Tu evaluación ha sido finalizada automáticamente.</p>
        </div>
        <div class="flex justify-center">
          <img src="https://cdn-icons-png.flaticon.com/512/3403/3403504.png" width="200" />
        </div>
        <div class="flex justify-center">
          <vs-button color="warning" type="filled" class="mb-2 mt-3" @click="acceptAlert()">Entendido</vs-button>
        </div>
      </div>
    </vs-popup>

    <vs-popup classContent="popup-example" title="Advertencia" :active.sync="popupIntentos">
      <p class="font-bold text-danger text-2xl text-center">¡Atención!</p>
      <p class="text-center mt-2 mb-4">Si sales nuevamente, tu <b>Evaluación Finalizará</b>.</p>
      <div class="flex justify-center mb-4">
        <img src="https://cdn-icons-png.flaticon.com/512/2797/2797387.png" width="120" />
      </div>
      <div class="flex justify-center">
        <button class="button-7" role="button" @click="popupIntentos = false;">Entendido</button>
      </div>
    </vs-popup>

    <vs-popup class="holamundo" fullscreen title="Mostrar imagen" :active.sync="popupMostrarImagen">
      <div class="flex h-full w-full items-center justify-center bg-black" v-if="popupMostrarImagen">
        <image-zoom :regular="$data_url + 'archivos/img/salle/img_preguntas/' + dataPregunta.img_pregunta"
          :zoom-amount="3" :click-zoom="true" click-message="De click para aumentar" img-class="img-fluid" style="max-height: 90vh;">
        </image-zoom>
      </div>
    </vs-popup>

    <vs-popup fullscreen title="Reporte de evaluación del área " :active.sync="popupMostrarReporte">
      <div v-if="popupMostrarReporte">
        <SalleReporteEvaluacionVue :arraySelected="arraySelected" :revision_activa="revision_activa"
          :datos_docente_revisando="datos_docente_revisando" />
      </div>
    </vs-popup>
  </div>
</template>

<script>
    import {
        mapState
    } from "vuex";
    import imageZoom from 'vue-image-zoomer';
    import vSelect from 'vue-select'
    import $ from 'jquery'
    const SalleReporteEvaluacionVue = () => import('./components/SalleReporteEvaluacion.vue');
    export default {
      components: {
          'v-select': vSelect,
          imageZoom,
          SalleReporteEvaluacionVue
        },
        data(){
          return {
            areaActivaIndex: null,
            currentPregIndex: 1,
            usuario: [],
            evaluacion: [],
            area_activa: 0,
            opciones: [],
            opciones_check: {},
            opciones_guardadas: {},
            id_evaluacion: '',
            evaluacion_activa: 0,
            alerta_evaluacion: '',
            revision_activa: false,
            configuracion: [],
            color_overlay: '',
            text_overlay: '',
            tiempo_evaluacion: 0,
            intervalId: null,
            verificadorServidor: null,
            correrTiempo: true,
            fecha_inicio_evaluacion: null,
            fecha_limite_evaluacion: null,
            fecha_servidor: null,
            evaluacionEnCurso: false,
            calificacion100:0,
            calificacion: 0,
            totalPuntaje:0,
            dataaaa: [],
            current_preg: [],
            revisa_admin_salle: 0,
            datos_docente_revisando: '',
            arregloPeriodos:[],
            //variables para intentos de evaluacion
            intentosEvaluacion:0,
            popupIntentos:false,
            popupConfirmStart:false,
            showCloseButton:false,
            //fin variables para intentos de evaluacion
            //variables para mostrar la imagen
            dataPregunta:'',
            popupMostrarImagen:false,
            //SOLO UNA VEZ CORRERA EL TIEMPO
            correrTiempo:true,
            mostrar:false,
            userAdminSalle:false,
            arraySelected:'',
            popupMostrarReporte:false,
            cantidadPreguntasRespondidas:0,
            cantidadPreguntas:0,
            cantidadPreguntasSinResponder:0,
            cantidadPreguntasCorrectas:0,
            cantidadPreguntasIncorrectas:0,
            seleccion:[],
            intervalId:null,
            selectedIndex: 0,
            selectedAsignaturaIndex: 0,
            maxIntentosVentana: 4, // Máximo de intentos permitidos (por defecto 4, se actualiza desde configuración)
            EvaluacionSelectSalleNombre:'',
          }
        },
        created(){
          let me = this
          me.mostrar = false
          me.usuario = JSON.parse(localStorage.getItem('usuario'));
          if( me.usuario.id_group == 12 || me.usuario.id_group == 1){
            me.userAdminSalle = true
          }
          me.tipo_revisar_activo = localStorage.tipo_revisar
          me.revisa_admin_salle = localStorage.revisa_admin_salle
          me.datos_docente_revisando = localStorage.datos_docente_revisando
          if( me.tipo_revisar_activo === '1' ){
              me.id_evaluacion = localStorage.id_evaluacion_salle
              me.obtener_evaluacion()
              me.obtenerCalificacion()
          }else{
              me.generarEvaluacion()
          }
          me.getConfiguracion()
          me.EvaluacionSelectSalleNombre = localStorage.EvaluacionSelectSalleNombre
        },
        mounted() {
          let me = this
          document.addEventListener("visibilitychange", this.handleVisibilityChange);

          // Prevenir que el usuario salga de la página durante la evaluación
          window.addEventListener('beforeunload', me.handleBeforeUnload);
        },
        beforeDestroy() {
          let me = this
          document.removeEventListener("visibilitychange", this.handleVisibilityChange);
          window.removeEventListener('beforeunload', me.handleBeforeUnload);
          clearInterval(this.intervalId);
          clearInterval(this.verificadorServidor);
          // Limpiar la referencia al intervalo
          this.intervalId = null;
          this.verificadorServidor = null;
          me.evaluacionEnCurso = false;
          //limpiar el reloj
          if(document.getElementById("reloj")){
            document.getElementById("reloj").innerHTML = "";
          }
        },
        computed: {
          ...mapState(['userRoot']),
          shouldShowPreguntas() {
            return (indexP) => {
              return this.currentPregIndex === indexP + 1;
            }
          },
          tiempoRestanteBajo() {
            return this.tiempo_evaluacion < 60;
          },
          getProgressColorClass() {
            const percentage = Math.round((this.cantidadPreguntasRespondidas / this.cantidadPreguntas) * 100) || 0;
            if (percentage >= 75) return 'progress-high';
            if (percentage >= 40) return 'progress-medium';
            return 'progress-low';
          },
          getProgressBarClass() {
            const percentage = Math.round((this.cantidadPreguntasRespondidas / this.cantidadPreguntas) * 100) || 0;
            if (percentage >= 75) return 'bar-high';
            if (percentage >= 40) return 'bar-medium';
            return 'bar-low';
          }
        },
        methods: {
          handleBeforeUnload(event) {
            let me = this
            if(me.evaluacionEnCurso && me.evaluacion_activa === 1){
              const message = '⚠️ ATENCIÓN: Tienes una evaluación en curso. El tiempo sigue corriendo incluso si sales de esta página. ¿Estás seguro de que deseas salir?'
              event.preventDefault()
              event.returnValue = message
              return message
            }
          },
          exportarEvaluacion(){
            let me = this
            me.popupMostrarReporte = true
          },
          handleClose() {
            let me = this;
            me.popupConfirmStart = true
          },
          volver(){
            let me = this;
            me.popupConfirmStart = false
            me.$router.go(-1)
          },
          handleVisibilityChange() {
            let me = this
            if (document.visibilityState === "hidden") {
              console.log("diconnect")
              // El usuario cambió de pestaña o minimizó el navegador
            } else {
              console.log("connect")
              //comentar esto para hacer pruebas
              // Validar dinámicamente según intentos configurados (por defecto 4)
              if(me.intentosEvaluacion > 0 && me.intentosEvaluacion <= me.maxIntentosVentana && (this.usuario.id_group == 13 || this.usuario.id_group == 6)){
                me.popupConfirmStart = true;
              }
              // El usuario volvió a la pestaña o maximizó el navegador
            }
          },
          async generarEvaluacion(){
            let me = this
            me.color_overlay = '#22c16b'
            me.text_overlay = 'Estamos preparando su evaluación, no tomará mucho tiempo'
            me.$vs.loading({ background: me.color_overlay, color: 'rgb(255, 255, 255)',  type: 'sound', text: me.text_overlay })
            await this.$http.get(this.$server_url+'generar_evaluacion_salle/' + me.usuario.idusuario+'/'+me.usuario.institucion_idInstitucion+'/'+localStorage.EvaluacionSelectSalle+'/0')
            .then(res => {
              if(res.data.status == 0){
                me.$vs.notify({title: 'Error', text: res.data.message, color: 'danger'})
                me.$vs.loading.close()
                return
              }
              if(res.data.status === 'time_expired'){
                me.evaluacion_activa = 0
                me.revision_activa = true
                me.alerta_evaluacion = 'El tiempo límite para esta evaluación ha expirado.'
                me.$vs.loading.close()
                return
              }
              if(res.data.length > 0){
                if(me.id_evaluacion != '' && me.id_evaluacion != res.data[0].id_evaluacion){
                  // marcar como evaluacion finalizada
                  me.evaluacion_activa = 0
                  me.revision_activa = true
                  me.alerta_evaluacion = 'Su evaluación ha finalizado.'
                  me.$vs.loading.close()
                  return
                }
              }
              // if( res.data === 0 ){
              //   me.evaluacion_activa = 0
              //   me.revision_activa = true
              //   me.alerta_evaluacion = 'Lo sentimos el tiempo para resolver esta evaluación ha terminado.'
              //   me.$vs.loading.close()
              //   return
              // }
              if( res.data === 1 ){
                me.evaluacion_activa = 0
                me.revision_activa = true
                me.alerta_evaluacion = 'La institución a la que pertenece necesita ser configurada, por favor comuníquese con el administrador del sistema.'
                me.$vs.loading.close()
                return
              }
              if( res.data === 2 ){
                me.evaluacion_activa = 0
                me.revision_activa = true
                me.alerta_evaluacion = 'Su evaluación ha finalizado.'
                me.$vs.loading.close()
                return
              }
              me.evaluacion         = res.data
              me.id_evaluacion      = res.data[0].id_evaluacion
              me.f_estadoPreguntas()
              me.initSeleccion() // Initialize selection array with answered questions
              me.intentosEvaluacion = res.data[0].intentos
              // Validar dinámicamente según intentos configurados
              if(me.intentosEvaluacion <= me.maxIntentosVentana && (me.usuario.id_group == 13 || me.usuario.id_group == 6)){
                me.openConfirm()
              }
              if(me.intentosEvaluacion > me.maxIntentosVentana && (me.usuario.id_group == 13 || me.usuario.id_group == 6)){
                me.popupConfirmStart = false
              }
              me.evaluacion_activa  = 1
              me.mostrar = true
              setTimeout(() => {
                me.ver_area(0)
              },1500)
              me.$vs.loading.close()
            })
            .catch(function (error) {
              console.log(error);
              me.$vs.loading.close()
            })
          },
          getConfiguracion(){
            let me = this
            var InstitucionUser = ""
            if( me.tipo_revisar_activo === '1' ){
              if(me.usuario.id_group == 13 || me.usuario.id_group == 6){
                InstitucionUser = me.usuario.institucion_idInstitucion
              }else{
                InstitucionUser = localStorage.idInstitucionDocente
              }
            }else{
              InstitucionUser = me.usuario.institucion_idInstitucion
            }
            me.$http.get(this.$server_url+'salle_getConfiguracion/' + InstitucionUser+'/'+localStorage.EvaluacionSelectSalle)
            .then(res => {
              me.configuracion = res.data.configuracion[0]

              // Actualizar máximo de intentos desde la configuración
              if(me.configuracion.intentos_ventana){
                me.maxIntentosVentana = parseInt(me.configuracion.intentos_ventana)
                console.log('Intentos de ventana configurados:', me.maxIntentosVentana)
              }

              //el administrador si puede ver las preguntas
              if(me.userAdminSalle && me.tipo_revisar_activo == 1){
              }else{
                 // alert(me.configuracion.ver_respuestas +'  &&  '+ me.tipo_revisar_activo)
                if( me.configuracion.ver_respuestas == 0 && me.tipo_revisar_activo == 1 ){
                  console.log('no puede ver las preguntas')
                  me.alerta_evaluacion = 'La revisión de sus evaluaciones está desactivada.'
                  if( me.revisa_admin_salle != 1 ){ // cuando revisa el admin no se bloquea
                    me.evaluacion_activa = 0
                  }
                }
              }

            })
            .catch(function (error) {
                console.log(error);
            })
          },
          async guardarSeleccion(tipo_pregunta, item, opciones, puntaje,activacion,index){
            let me = this
            if( me.tipo_revisar_activo === 1 ){ return } // no se guardan las respuestas en modo revision
            // se obtiene la cantidad de opciones correctas de la pregunta respondida
            let cant_correctas = 0
            $.each(opciones, function(key, value){
              if(value.tipo === 1){
                  cant_correctas++
              }
            })
            let opciones_seleccionadas = []
            // Fix: Check if opciones_check is populated correctly for this question
             if (tipo_pregunta === 1) { // Checkbox
                $.each(me.opciones_check, function(key, value){
                  for( var i=0; i<opciones.length; i++ ){
                    if( key == opciones[i].id_opcion_pregunta ){
                      if(value !== false ){
                          opciones_seleccionadas.push(key)
                      }
                    }
                  }
                })
             } else { // Radio (Single Choice)
                 // Use item.id_opcion_pregunta if passed directly (itemO), or fallback to me.opciones
                 if (item.id_opcion_pregunta) {
                    opciones_seleccionadas.push(item.id_opcion_pregunta)
                 } else if (me.opciones[item.id_pregunta]) {
                     opciones_seleccionadas.push(me.opciones[item.id_pregunta])
                 }
             }

            let puntaje_seleccion = 0
            // alert(opciones_seleccionadas.length +' <= '+ cant_correctas)
            if( opciones_seleccionadas.length <= cant_correctas ){
              if( item.tipo === 1 ){
                //si la opcion seleccionada es de tipo correcta y no ha excedido la cantidad de opciones correctas
                puntaje_seleccion = (parseFloat(puntaje)/cant_correctas).toFixed(2)
                // alert('puntaje_seleccion bien: ' + puntaje_seleccion)
              }
            }else{
              // se le resta el puntaje cuando selecciona mas opciones de las correctas
              puntaje_seleccion = parseFloat(puntaje)*(-1)
              // alert('puntaje_seleccion else: ' + puntaje_seleccion)
            }
            let dataSeleccion = {
              id_evaluacion: me.id_evaluacion,
              id_usuario: me.usuario.idusuario,
              id_pregunta: item.id_pregunta,
              id_opcion_pregunta: item.id_opcion_pregunta,
              tipo_pregunta: tipo_pregunta,
              puntaje_seleccion: puntaje_seleccion
            }
            await me.$http.post(this.$server_url+'salle_guardarSeleccion', dataSeleccion)
            .then(res => {
              if(res.data.status == 0){
                me.$vs.notify({
                  title: 'Error',
                  text: res.data.message,
                  color: 'danger',
                  position: 'top-right'
                })
              }
              // Handle activacion as object or direct ID
              let id_asign = activacion.id_asignatura ? activacion.id_asignatura : activacion;

              me.calcularEstadoPreguntasLocal()
              me.cambiarAguaradoPregunta(id_asign, index + 1)

              // Visual feedback
              // me.$vs.notify({ title:'Guardado', text:'Respuesta guardada correctamente', color:'success', position:'top-center', time: 1000 })
            })
            .catch(function (error) {
              console.log(error);
            })
          },
          seleccionarOpcion(itemO, itemP, indexP) {
            let me = this;
            // Actualizar el modelo con la opción seleccionada
            me.$set(me.opciones, itemO.id_pregunta, itemO.id_opcion_pregunta);
            // Llamar a guardarSeleccion
            me.guardarSeleccion(
              3,
              itemO,
              itemP.opciones,
              itemP.puntaje_pregunta,
              me.evaluacion[me.selectedIndex].asignaturas[me.selectedAsignaturaIndex].id_asignatura,
              indexP
            );
          },
          ver_area(index){
            this.selectedIndex = index;
            this.selectedAsignaturaIndex = 0;
            this.currentPregIndex = 1;
            // Asegúrate de actualizar la vista si es necesario,
            // aunque con v-if en el template debería ser reactivo.
          },
          ver_asignatura(index) {
            this.selectedAsignaturaIndex = index;
            this.currentPregIndex = 1;

            // Forzar actualización para que los colores se carguen correctamente en modo revisión
            if (this.revision_activa) {
              this.$nextTick(() => {
                setTimeout(() => {
                  this.$forceUpdate();
                }, 50);
              });
            }
          },
          f_estadoPreguntas(){
            let me = this
            // me.cantidadPreguntasRespondidas     = 0
            //   me.cantidadPreguntas              = 0
            //   me.cantidadPreguntasSinResponder  = 0
              me.$http.get(this.$server_url+'f_estadoPreguntas/'+ me.id_evaluacion )
              .then(res => {
                me.cantidadPreguntasRespondidas   = res.data.cantidadPreguntasRespondidas
                me.cantidadPreguntas              = res.data.cantidadPreguntas
                me.cantidadPreguntasSinResponder  = me.cantidadPreguntas - me.cantidadPreguntasRespondidas
              })
          },
          calcularEstadoPreguntasLocal() {
            let me = this;
            me.cantidadPreguntasRespondidas = 0;
            me.cantidadPreguntas = 0;

            // Recorrer todas las áreas, asignaturas y preguntas
            if (me.evaluacion && me.evaluacion.length > 0) {
              me.evaluacion.forEach((area, areaIndex) => {
                if (area.asignaturas && area.asignaturas.length > 0) {
                  area.asignaturas.forEach((asignatura, asigIndex) => {
                    if (asignatura.preguntas && asignatura.preguntas.length > 0) {
                      asignatura.preguntas.forEach((pregunta, pregIndex) => {
                        me.cantidadPreguntas++;

                        // Verificar si la pregunta está respondida usando la misma lógica que isQuestionAnswered
                        const id = `${pregIndex + 1}${asignatura.id_asignatura}`;

                        // Check Radio/Short answer (opciones)
                        let hasLocalRadio = me.opciones[pregunta.id_pregunta] ? true : false;

                        // Check Checkboxes (opciones_check)
                        let hasLocalCheck = false;
                        if (pregunta.id_tipo_pregunta === 1 && pregunta.opciones) {
                          hasLocalCheck = pregunta.opciones.some(opt => me.opciones_check[opt.id_opcion_pregunta]);
                        }

                        // Check base de datos (respuestas guardadas)
                        let hasDB = pregunta.respuestas && pregunta.respuestas.length > 0;

                        // Check selección guardada localmente
                        let hasSaved = me.seleccion.includes(id);

                        if (hasDB || hasSaved || hasLocalRadio || hasLocalCheck) {
                          me.cantidadPreguntasRespondidas++;
                        }
                      });
                    }
                  });
                }
              });
            }

            me.cantidadPreguntasSinResponder = me.cantidadPreguntas - me.cantidadPreguntasRespondidas;
          },
          openConfirm() {
            let me = this;
            me.popupConfirmStart = true
            // this.$vs.dialog({
            //   type: 'confirm',
            //   color: 'success',
            //   title: `¿Listo para empezar?`,
            //   acceptText:'Empezar',
            //   cancelText:'Cancelar',
            //   text: 'Al aceptar empezará a correr el tiempo, buena suerte!',
            //   accept: this.acceptAlert
            // })
          },
          async acceptAlert() {
            let me = this
             if(me.intentosEvaluacion > me.maxIntentosVentana){
              me.popupConfirmStart = false
              me.$router.go(-1)
              return
            }
            me.popupConfirmStart = false
            me.evaluacionEnCurso = true
            await this.saveIntento()
            // document.getElementById("area_activa0").style.display = "block"; // ID removed in refactor
            if(me.correrTiempo){
              me.correrTiempo = false
              this.f_tiempo()
            }
          },
          async saveIntento(){
            let me = this;
            //si es docentes cuantos los intentos
            if(me.usuario.id_group == 13 || me.usuario.id_group == 6){
              let formData = new FormData();
              formData.append('id_evaluacion',me.id_evaluacion);
              formData.append('id_usuario',   me.usuario.idusuario)
              formData.append('intentosEval', me.intentosEvaluacion)
              formData.append('tiempo_evaluacion', me.tiempo_evaluacion)
              await this.$http.post(this.$server_url+'save_finalizar_evalIntentos', formData)
              .then(res => {
                me.intentosEvaluacion = res.data.intentos
                // Guardar las fechas de la evaluación
                if(res.data.fecha_inicio_evaluacion){
                  me.fecha_inicio_evaluacion = res.data.fecha_inicio_evaluacion
                }
                if(res.data.fecha_limite_evaluacion){
                  me.fecha_limite_evaluacion = res.data.fecha_limite_evaluacion
                }

                // Si superó el máximo de intentos, finalizar evaluación
                if(me.intentosEvaluacion > me.maxIntentosVentana){
                  me.finalizarEvaluacion(2) // Tipo 2: Finalizado por exceso de intentos
                }
              })
            }
          },
          async f_tiempo() {
            let me = this

            // Obtener el tiempo restante real desde el servidor
            let tiempo_inicial_segundos = 0

            if(me.fecha_limite_evaluacion){
              // Si ya existe fecha límite, calcular tiempo restante desde el servidor
              let formData = new FormData();
              formData.append('obtener_fecha_servidor', 1);

              await me.$http.post(me.$server_url + 'obtenerCalificacionSalle', formData)
              .then(res => {
                if(res.data.fecha_servidor){
                  let fechaServidor = new Date(res.data.fecha_servidor)
                  let fechaLimite = new Date(me.fecha_limite_evaluacion)
                  let diferencia = Math.floor((fechaLimite - fechaServidor) / 1000)

                  if(diferencia <= 0){
                    // Tiempo agotado
                    me.finalizarEvaluacion()
                    return
                  }
                  tiempo_inicial_segundos = diferencia
                  console.log('Tiempo restante desde servidor:', diferencia, 'segundos')
                }
              })
              .catch(err => {
                console.error('Error al obtener tiempo del servidor:', err)
                // Si falla, calcular basado en preguntas
                let cant_preguntas = 0
                $.each(me.evaluacion, function(key, value){
                  $.each(value.asignaturas, function(keyA, valueA){
                      $.each(valueA.preguntas, function(keyP, valueP){
                          cant_preguntas++
                      })
                  })
                })
                tiempo_inicial_segundos = (cant_preguntas * 3) * 60
              })
            } else {
              // Si no hay fecha límite, calcular tiempo total basado en preguntas
              let cant_preguntas = 0
              $.each(me.evaluacion, function(key, value){
                $.each(value.asignaturas, function(keyA, valueA){
                    $.each(valueA.preguntas, function(keyP, valueP){
                        cant_preguntas++
                    })
                })
              })
              tiempo_inicial_segundos = (cant_preguntas * 3) * 60
            }

            me.tiempo_evaluacion = tiempo_inicial_segundos

            // Función para verificar tiempo con el servidor
            const verificarTiempoServidor = () => {
              if(!me.fecha_limite_evaluacion) return

              let formData = new FormData();
              formData.append('obtener_fecha_servidor', 1);

              me.$http.post(me.$server_url + 'obtenerCalificacionSalle', formData)
              .then(res => {
                if(res.data.fecha_servidor){
                  let fechaServidor = new Date(res.data.fecha_servidor)
                  let fechaLimite = new Date(me.fecha_limite_evaluacion)
                  let diferencia = Math.floor((fechaLimite - fechaServidor) / 1000)

                  if(diferencia <= 0){
                    // Tiempo agotado - Tipo 3: tiempo expirado mientras rendía
                    clearInterval(me.intervalId)
                    clearInterval(me.verificadorServidor)
                    me.finalizarEvaluacion(3)
                  }
                }
              })
              .catch(err => {
                console.error('Error al verificar tiempo del servidor:', err)
              })
            }

            // Verificar tiempo del servidor cada 30 segundos
            me.verificadorServidor = setInterval(verificarTiempoServidor, 30000)

            // Contador visual local
            var n = tiempo_inicial_segundos;
            this.intervalId = setInterval(function() {
              n--;
              me.tiempo_evaluacion = n

              var hours = Math.floor(n / 3600);
              var minutes = Math.floor((n % 3600) / 60);
              var seconds = n % 60;

              // Formatear con ceros a la izquierda
              hours = hours < 10 ? '0' + hours : hours;
              minutes = minutes < 10 ? '0' + minutes : minutes;
              seconds = seconds < 10 ? '0' + seconds : seconds;

              $(".reloj").html(hours + " : " + minutes + " : " + seconds);

              // Cambiar color cuando queda menos de 1 minuto
              if (n < 60) {
                  $(".reloj").css('color', '#FB2452');
              }

              if (n <= 0) {
                  $(".reloj").html("Fin del tiempo");
                  clearInterval(me.intervalId)
                  clearInterval(me.verificadorServidor)
                  // Tipo 3: Tiempo expirado mientras rendía la evaluación
                  me.finalizarEvaluacion(3)
              }
            }, 1000);
          },
            openConfirmFinalizar() {
              let me = this
              let mensaje = "¿Está seguro de finalizar esta evaluación?"
              //si hay preguntas sin responder
              if( me.cantidadPreguntasSinResponder > 0 ){
                mensaje =  `Tienes ${me.cantidadPreguntasSinResponder} preguntas sin responder, ¿Desea finalizar la evaluación?`
              }
              this.$vs.dialog({
                type: 'confirm',
                color: 'warning',
                title: mensaje,
                text: 'Sus respuestas serán enviadas para calificar.',
                accept: this.finalizarEvaluacion,
                acceptText: 'Aceptar',
                cancelText:'Cancelar'
              })
            },
            finalizarEvaluacion(tipo_finalizacion = 1){
              let me = this
              me.evaluacionEnCurso = false
              let id_usuario_eval = me.usuario.idusuario
              if( localStorage.idusuario_evaluacion_salle ){
                id_usuario_eval = localStorage.idusuario_evaluacion_salle
              }
              // tipo_finalizacion: 1 = manual (botón), 3 = tiempo expirado rindiendo
              let data_finalizar = {
                id_evaluacion: me.id_evaluacion,
                id_usuario: id_usuario_eval,
                tipo_finalizacion: tipo_finalizacion
              }
              me.$vs.loading()
              me.$http.post(this.$server_url+'salle_finalizarEvaluacion', data_finalizar)
              .then(res => {
                me.color_overlay = '#90ABF3'
                me.text_overlay = 'Estamos calificando su evaluación, pronto podrá ver sus resultados.'
                if(res.data.status == 0){
                  //close
                  me.$vs.loading.close()
                  //error
                  me.$vs.notify({title: 'Error', text: 'No se pudo finalizar la evaluación, intente nuevamente.',color:'danger'})
                  return
                }
                location.reload()
              })
              .catch(function (error) {
                me.$vs.loading.close()
                console.log(error);
              })
            },
            obtenerCalificacion(){
              let me = this
              me.cantidadPreguntasRespondidas = 0
              me.cantidadPreguntas = 0
              me.cantidadPreguntasSinResponder = 0
              me.$http.get(this.$server_url+'obtenerCalificacion_salle/'+ me.id_evaluacion )
              .then(res => {
                if(res.data.status == 0){
                  me.$vs.notify({
                    title: 'Error',
                    text: res.data.message,
                    color: 'danger',
                    position: 'top-right'
                  })
                  return
                }
                let resultado     = 0
                me.calificacion   = res.data.calificacionFinal.toFixed(2)
                //totalPuntaje
                me.totalPuntaje   = res.data.totalPuntaje
                resultado         = (me.calificacion  / me.totalPuntaje) * 100
                me.calificacion100 = resultado.toFixed(2)
                me.cantidadPreguntasRespondidas = res.data.cantidadPreguntasRespondidas
                me.cantidadPreguntas = res.data.cantidadPreguntas
                me.cantidadPreguntasSinResponder = me.cantidadPreguntas - me.cantidadPreguntasRespondidas
              })
            },
            obtener_evaluacion(){
              let me = this
              me.revision_activa = true
              me.evaluacion_activa = 1
              me.color_overlay = '#22c16b'
              me.text_overlay = 'Estamos cargando su evaluación resuelta ...'
              me.$vs.loading({ background: me.color_overlay, color: 'rgb(255, 255, 255)',  type: 'sound', text: me.text_overlay })
              let id_usuario_eval = me.usuario.idusuario
              if( localStorage.idusuario_evaluacion_salle ){
                id_usuario_eval = localStorage.idusuario_evaluacion_salle
              }
              me.$http.get(this.$server_url+'obtener_evaluacion_salle/'+ me.id_evaluacion + '/' + id_usuario_eval +'/'+localStorage.EvaluacionSelectSalle)
              .then(res => {
                  if(res.data.status === 'time_expired'){
                    me.$vs.loading.close()
                    me.$vs.notify({
                      title: 'Tiempo Expirado',
                      text: 'El tiempo límite para esta evaluación ha expirado y ha sido finalizada automáticamente.',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-clock'
                    })
                    setTimeout(() => {
                      me.$router.push('/docente/evaluaciones/lista')
                    }, 2000)
                    return
                  }
                  let datos = res.data
                  me.evaluacion = datos
                  me.validacionBuenasXMalas = datos

                  // CARGAR LAS RESPUESTAS DEL ESTUDIANTE EN LOS CHECKBOXES Y RADIOS
                  $.each(me.evaluacion, function(keyArea, area){
                    $.each(area.asignaturas, function(keyAsig, asignatura){
                      $.each(asignatura.preguntas, function(keyPreg, pregunta){
                        // Si la pregunta tiene respuestas guardadas
                        if(pregunta.respuestas && pregunta.respuestas.length > 0){
                          // Tipo 1 = Checkbox (múltiple selección)
                          if(pregunta.id_tipo_pregunta === 1){
                            $.each(pregunta.respuestas, function(keyResp, respuesta){
                              me.$set(me.opciones_check, respuesta.id_opcion_pregunta, true)
                            })
                          }
                          // Tipo 3 o 5 = Radio (selección simple)
                          else if(pregunta.id_tipo_pregunta === 3 || pregunta.id_tipo_pregunta === 5){
                            if(pregunta.respuestas[0]){
                              me.$set(me.opciones, pregunta.id_pregunta, pregunta.respuestas[0].id_opcion_pregunta)
                            }
                          }
                        }
                      })
                    })
                  })

                  let calificacion = 0
                  let calificacion_preg = 0
                  let cant_asignaturas = 0
                  let cant_areas = 0
                  let calificacion_pregunta = 0
                  let cant_preguntas = 0
                  let puntaje_preguntas = 0
                  let calificacion_asignatura = 0
                  let calificacion_areas = 0
                  /// ERROR EN CALCULO AQUI XQ NO ESTA CONSIDERNADO LOS VALORES NEGATIVOS COMO EN EL CONTROLADOR DE LOS REPORTES
                  // $.each(me.evaluacion.areas, function(key, value){
                  //   cant_areas++
                  //   $.each(value[0].asignaturas, function(keyA, valueA){
                  //     cant_asignaturas++
                  //     $.each(valueA[0].preguntas, function(keyP, valueP){
                  //       cant_preguntas++
                  //       puntaje_preguntas += valueP.pregunta.puntaje_pregunta
                  //       $.each(valueP.respuestas, function(keyRes, valueRes){
                  //         calificacion_preg = calificacion_preg + valueRes.puntaje
                  //       })
                  //       if( calificacion_preg >= 0 && calificacion_preg <= valueP.pregunta.puntaje_pregunta ){
                  //       }else{
                  //         if( valueP.pregunta.id_tipo_pregunta != 1 ){
                  //           calificacion_preg = valueP.pregunta.puntaje_pregunta
                  //         }else{
                  //           calificacion_preg = 0
                  //         }
                  //       }
                  //       calificacion_pregunta += calificacion_preg
                  //       calificacion_preg = 0
                  //     })
                  //   })
                  //   calificacion_areas += ((calificacion_pregunta*100)/puntaje_preguntas)
                  //   calificacion_pregunta = 0
                  //   puntaje_preguntas = 0
                  //   calificacion_asignatura = 0
                  //   cant_asignaturas = 0
                  // })
                  // me.calificacion = (calificacion_areas/cant_areas).toFixed(2)
                  //mostrar preguntas
                  me.mostrar = true

                  // Forzar actualización inmediata para que Vue detecte los cambios
                  me.$nextTick(() => {
                    me.$forceUpdate()
                  })

                  setTimeout(() => {
                    me.ver_area(0)
                    // Calcular estadísticas de revisión (correctas/incorrectas)
                    me.calcularEstadisticasRevision()
                    // Forzar actualización después de renderizar para pintar todo correctamente
                    me.$nextTick(() => {
                      me.$forceUpdate()
                    })
                  },1500)
                  me.$vs.loading.close()
              })
              .catch(function (error) {
                  me.$vs.loading.close()
                  console.log(error);
              })
            },
            paginacion(index, tam, asign_content){
               // Deprecated but kept for compatibility if needed elsewhere, though unused in new template
             },
             siguientePregunta(asignContent, totalPreguntas) {
               if (this.currentPregIndex < totalPreguntas) {
                 this.currentPregIndex++;
               }
             },
             anteriorPregunta(asignContent) {
               if (this.currentPregIndex > 1) {
                 this.currentPregIndex--;
               }
             },
             paginacion2(indexP, totalPreguntas, asignContent) {
                 this.currentPregIndex = indexP;
             },
            cambiarAguaradoPregunta(asign_content, indexP) {
              const id = `${indexP}${asign_content}`;
              if (!this.seleccion.includes(id)) {
                this.seleccion.push(id);
                this.$forceUpdate();
              }
            },
            isGuardada(id) {
              return this.seleccion.includes(id);
            },
            getPreguntaClass(indexP, itemP, id_asignatura) {
              // 1. Pregunta Activa
              if (this.currentPregIndex === indexP + 1) {
                return 'bg-primary text-white border-primary shadow-md transform scale-110';
              }
              // 2. Pregunta Guardada/Respondida (DB o Sesión)
              const id = `${indexP + 1}${id_asignatura}`;

              // Check Radio/Short answer (opciones)
              let hasLocalRadio = this.opciones[itemP.id_pregunta] ? true : false;

              // Check Checkboxes (opciones_check) - check if any option of this question is selected
              let hasLocalCheck = false;
              if (itemP.id_tipo_pregunta === 1 && itemP.opciones) {
                 hasLocalCheck = itemP.opciones.some(opt => this.opciones_check[opt.id_opcion_pregunta]);
              }

              if ((itemP.respuestas && itemP.respuestas.length > 0) || this.isGuardada(id) || hasLocalRadio || hasLocalCheck) {
                 return 'bg-success text-white border-success shadow-md font-bold transform hover:scale-105';
              }
              // 3. Estado por defecto (Sin responder)
              return 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100';
            },
            checkAsignaturaCompleta(itemA) {
              if (!itemA || !itemA.preguntas) return false;

              // En modo revisión, retornar objeto con estado detallado
              if (this.revision_activa) {
                let correctas = 0;
                let incorrectas = 0;
                let total = itemA.preguntas.length;

                itemA.preguntas.forEach(preg => {
                  const isCorrect = this.isPreguntaCorrecta(preg);
                  if (isCorrect === true) correctas++;
                  if (isCorrect === false) incorrectas++;
                });

                // Retornar objeto para uso en template
                return {
                  todasCorrectas: correctas === total && incorrectas === 0,
                  todasIncorrectas: incorrectas === total && correctas === 0,
                  mixto: correctas > 0 && incorrectas > 0,
                  completada: true
                };
              }

              // Modo normal: verificar si todas están respondidas
              return itemA.preguntas.every((preg, index) => {
                  const id = `${index + 1}${itemA.id_asignatura}`;
                  let hasDB = preg.respuestas && preg.respuestas.length > 0;
                  let hasSaved = this.isGuardada(id);
                  let hasLocalRadio = this.opciones[preg.id_pregunta] ? true : false;
                  let hasLocalCheck = false;
                  if (preg.id_tipo_pregunta === 1 && preg.opciones) {
                     hasLocalCheck = preg.opciones.some(opt => this.opciones_check[opt.id_opcion_pregunta]);
                  }
                  return hasDB || hasSaved || hasLocalRadio || hasLocalCheck;
              });
            },
            initSeleccion() {
              let me = this;
              if (me.evaluacion && me.evaluacion.length > 0) {
                me.evaluacion.forEach(area => {
                  if (area.asignaturas) {
                    area.asignaturas.forEach(asig => {
                      if (asig.preguntas) {
                        asig.preguntas.forEach((preg, index) => {
                          if (preg.respuestas && preg.respuestas.length > 0) {
                             const id = `${index + 1}${asig.id_asignatura}`;
                             if (!me.seleccion.includes(id)) {
                               me.seleccion.push(id);
                             }
                          }
                          // Also check for 'opciones' object (radio buttons) or 'opciones_check' if populated
                          if(me.opciones[preg.id_pregunta]) {
                              const id = `${index + 1}${asig.id_asignatura}`;
                              if (!me.seleccion.includes(id)) me.seleccion.push(id);
                          }
                        });
                      }
                    });
                  }
                });
              }
            },
            // New methods for premium sidebar
            getQuestionBtnClass(indexP, itemP, id_asignatura) {
              // Active question
              if (this.currentPregIndex === indexP + 1) {
                return 'active';
              }

              // En modo revisión, verificar si la pregunta está correcta o incorrecta
              if (this.revision_activa) {
                const isCorrect = this.isPreguntaCorrecta(itemP);
                if (isCorrect === true) {
                  return 'answered-correct';
                } else if (isCorrect === false) {
                  return 'answered-incorrect';
                }
              }

              // Answered question
              if (this.isQuestionAnswered(indexP, itemP, id_asignatura)) {
                return 'answered';
              }
              // Default state
              return 'unanswered';
            },
            isQuestionAnswered(indexP, itemP, id_asignatura) {
              const id = `${indexP + 1}${id_asignatura}`;

              // Check Radio/Short answer (opciones)
              let hasLocalRadio = this.opciones[itemP.id_pregunta] ? true : false;

              // Check Checkboxes (opciones_check)
              let hasLocalCheck = false;
              if (itemP.id_tipo_pregunta === 1 && itemP.opciones) {
                hasLocalCheck = itemP.opciones.some(opt => this.opciones_check[opt.id_opcion_pregunta]);
              }

              return (itemP.respuestas && itemP.respuestas.length > 0) || this.isGuardada(id) || hasLocalRadio || hasLocalCheck;
            },
            isPreguntaCorrecta(itemP) {
              // Solo aplica en modo revisión
              if (!this.revision_activa) return null;

              // Si no tiene opciones, no podemos determinar
              if (!itemP.opciones || itemP.opciones.length === 0) return null;

              // Para preguntas de checkbox (múltiple selección)
              if (itemP.id_tipo_pregunta === 1) {
                let todasCorrectas = true;
                let tieneIncorrecta = false;

                itemP.opciones.forEach(opt => {
                  const seleccionada = this.opciones_check[opt.id_opcion_pregunta];
                  const esCorrecta = opt.tipo == 1;

                  // Si seleccionó una incorrecta
                  if (seleccionada && !esCorrecta) {
                    tieneIncorrecta = true;
                  }
                  // Si no seleccionó una correcta
                  if (!seleccionada && esCorrecta) {
                    todasCorrectas = false;
                  }
                });

                // Es correcta solo si marcó todas las correctas y ninguna incorrecta
                return todasCorrectas && !tieneIncorrecta;
              }

              // Para preguntas de radio (selección simple)
              if (itemP.id_tipo_pregunta === 3 || itemP.id_tipo_pregunta === 5) {
                const opcionSeleccionada = this.opciones[itemP.id_pregunta];
                if (!opcionSeleccionada) return null;

                const opcion = itemP.opciones.find(opt => opt.id_opcion_pregunta == opcionSeleccionada);
                if (!opcion) return null;

                return opcion.tipo == 1;
              }

              return null;
            },
            getAsignaturaEstado(itemA) {
              if (!this.revision_activa || !itemA || !itemA.preguntas) return null;

              let correctas = 0;
              let incorrectas = 0;
              let total = itemA.preguntas.length;

              itemA.preguntas.forEach(preg => {
                const isCorrect = this.isPreguntaCorrecta(preg);
                if (isCorrect === true) correctas++;
                if (isCorrect === false) incorrectas++;
              });

              if (correctas === total && incorrectas === 0) return 'correctas';
              if (incorrectas === total && correctas === 0) return 'incorrectas';
              if (correctas > 0 && incorrectas > 0) return 'mixto';

              return null;
            },
            getAsignaturaClass(itemA, indexA) {
              const classes = {};

              // Siempre agregar active si corresponde
              classes.active = this.selectedAsignaturaIndex === indexA;

              // En modo normal
              if (!this.revision_activa) {
                const completa = this.checkAsignaturaCompleta(itemA);
                classes.completed = completa === true;
                return classes;
              }

              // En modo revisión
              const estado = this.getAsignaturaEstado(itemA);
              if (estado === 'correctas') {
                classes['completed-correct'] = true;
              } else if (estado === 'incorrectas') {
                classes['completed-incorrect'] = true;
              } else if (estado === 'mixto') {
                classes['completed-mixed'] = true;
              }

              return classes;
            },
            getNavPillClass(indexP, itemP, id_asignatura) {
              // Active question
              if (this.currentPregIndex === indexP + 1) {
                return 'active';
              }

              // En modo revisión, verificar si la pregunta está correcta o incorrecta
              if (this.revision_activa) {
                const isCorrect = this.isPreguntaCorrecta(itemP);
                if (isCorrect === true) {
                  return 'answered-correct';
                } else if (isCorrect === false) {
                  return 'answered-incorrect';
                }
              }

              // Answered question (modo normal)
              if (this.isQuestionAnswered(indexP, itemP, id_asignatura)) {
                return 'answered';
              }

              // Default state
              return 'unanswered';
            },
            getPuntajeObtenido(pregunta) {
              if (!pregunta || !pregunta.respuestas) return 0;

              let puntajeTotal = 0;
              pregunta.respuestas.forEach(respuesta => {
                if (respuesta.puntaje) {
                  puntajeTotal += parseFloat(respuesta.puntaje);
                }
              });

              // Asegurar que no sea negativo y redondear a 2 decimales
              return Math.max(0, puntajeTotal).toFixed(2);
            },
            calcularEstadisticasRevision() {
              let me = this;
              me.cantidadPreguntasCorrectas = 0;
              me.cantidadPreguntasIncorrectas = 0;

              if (!me.evaluacion || me.evaluacion.length === 0) return;

              me.evaluacion.forEach(area => {
                if (area.asignaturas) {
                  area.asignaturas.forEach(asig => {
                    if (asig.preguntas) {
                      asig.preguntas.forEach(preg => {
                        me.cantidadPreguntas++;
                        const isCorrect = me.isPreguntaCorrecta(preg);

                        if (isCorrect === true) {
                          me.cantidadPreguntasCorrectas++;
                        } else if (isCorrect === false) {
                          me.cantidadPreguntasIncorrectas++;
                        }
                      });
                    }
                  });
                }
              });
            }


        },
    }
</script>
<style scoped>
/* ========================================
   GLOBAL EVALUATION CONTAINER
   ======================================== */
.evaluation-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
}

/* ========================================
   HEADER CARD - PREMIUM
   ======================================== */
.header-card {
  background: white;
  border-radius: 16px;
  padding: 16px 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 20px;
}

.header-logo {
  flex-shrink: 0;
}

.header-logo img {
  max-width: 120px;
  height: auto;
  border-radius: 8px;
}

.header-info {
  flex: 1;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px;
  justify-content: flex-end;
}

.student-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.student-name i {
  color: #8b5cf6;
  font-size: 14px;
}

.student-id {
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 11px;
  color: #64748b;
  font-weight: 500;
}

.date-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #64748b;
}

.date-item {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f8fafc;
  padding: 4px 10px;
  border-radius: 8px;
}

.date-item i {
  font-size: 12px;
  color: #3b82f6;
}

.date-divider {
  color: #cbd5e1;
  font-size: 12px;
}

.observations {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #64748b;
  font-style: italic;
  background: #fffbeb;
  padding: 4px 10px;
  border-radius: 8px;
  border: 1px solid #fef3c7;
}

.observations i {
  color: #f59e0b;
}

.evaluation-badge {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 700;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* ========================================
   QUESTION CARD - PREMIUM
   ======================================== */
.question-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.question-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.question-number-badge {
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 800;
}

.question-title-text {
  display: flex;
  flex-direction: column;
}

.question-label {
  font-size: 14px;
  font-weight: 700;
}

.subject-name {
  font-size: 11px;
  opacity: 0.8;
}

.question-meta {
  display: flex;
  gap: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  background: rgba(255, 255, 255, 0.15);
  padding: 4px 10px;
  border-radius: 8px;
}

.meta-item i {
  font-size: 12px;
}

/* Question Navigation Pills */
.question-nav-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  padding: 12px 16px;
  background: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
}

.nav-pill-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  background: white;
  font-size: 12px;
  font-weight: 700;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-pill-btn:hover {
  transform: scale(1.1);
  border-color: #3b82f6;
}

.nav-pill-btn.unanswered {
  background: #f8fafc;
  border-color: #e2e8f0;
  color: #94a3b8;
}

.nav-pill-btn.answered {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

/* Estados de revisión para pills de navegación superior */
.nav-pill-btn.answered-correct {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.nav-pill-btn.answered-incorrect {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.nav-pill-btn.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 2px 10px rgba(59, 130, 246, 0.4);
  transform: scale(1.15);
}

/* Question Content */
.question-content {
  padding: 20px;
  min-height: 300px;
}

.question-text-container {
  margin-bottom: 20px;
}

.question-text {
  background: linear-gradient(135deg, #eff6ff 0%, #f5f3ff 100%);
  border-left: 4px solid #8b5cf6;
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 15px;
  line-height: 1.7;
  color: #1e293b;
}

.question-image {
  text-align: center;
  margin-bottom: 20px;
}

.question-image img {
  max-width: 100%;
  max-height: 250px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  cursor: zoom-in;
  transition: transform 0.3s ease;
}

.question-image img:hover {
  transform: scale(1.02);
}

.image-hint {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  margin-top: 8px;
}

.image-hint i {
  margin-right: 4px;
}

/* Options Styling */
.options-container {
  max-width: 600px;
  margin: 0 auto;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.option-item {
  background: #f8fafc;
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
  overflow: hidden;
}

.option-item:hover {
  border-color: #3b82f6;
  background: #eff6ff;
}

.option-item.selected {
  border-color: #3b82f6;
  background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.option-item.selected {
  border-width: 3px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15) !important;
}

.option-item.correct {
  border-color: #22c55e !important;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%) !important;
  border-width: 3px !important;
}

.option-item.incorrect {
  border-color: #ef4444 !important;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%) !important;
  border-width: 3px !important;
}

.option-item.show-correct {
  border-color: #86efac !important;
  background: linear-gradient(135deg, #f7fee7 0%, #ecfccb 100%) !important;
  border-width: 2px !important;
  border-style: dashed !important;
  opacity: 0.8;
}

.option-content {
  display: flex;
  align-items: center;
  padding: 14px 16px;
}

.option-text-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.revision-indicator {
  margin-right: 12px;
  min-width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.correct-icon {
  color: #22c55e;
  font-size: 24px;
  font-weight: bold;
}

.incorrect-icon {
  color: #ef4444;
  font-size: 24px;
  font-weight: bold;
}

.show-correct-icon {
  color: #84cc16;
  font-size: 22px;
  opacity: 0.6;
}

.option-checkbox,
.option-radio {
  flex: 1;
}

.option-text {
  font-size: 14px;
  font-weight: 500;
  color: #334155;
}

.option-image {
  display: block;
  margin-top: 8px;
  max-height: 100px;
  border-radius: 8px;
}

/* Question Footer */
.question-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.nav-btn-prev {
  background: white;
  border: 2px solid #e2e8f0;
  color: #64748b;
}

.nav-btn-prev:hover:not(.disabled) {
  background: #f1f5f9;
  border-color: #94a3b8;
}

.nav-btn-next {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.nav-btn-next:hover:not(.disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4);
}

.nav-btn.disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.page-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
}

.page-indicator .current {
  font-weight: 800;
  color: #3b82f6;
  font-size: 16px;
}

.page-indicator .separator {
  color: #cbd5e1;
}

.page-indicator .total {
  color: #64748b;
  font-weight: 500;
}

/* Alert Card */
.alert-card {
  background: white;
  border-radius: 16px;
  padding: 40px;
  text-align: center;
  box-shadow: 0 4px 25px rgba(0, 0, 0, 0.08);
}

.alert-icon {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.alert-icon i {
  font-size: 28px;
  color: #64748b;
}

.alert-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  color: white;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
  transition: all 0.2s ease;
}

.btn-back:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(34, 197, 94, 0.4);
}

/* ========================================
   COMPACT PREMIUM SIDEBAR
   ======================================== */
.sidebar-premium {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Timer Card - Compact */
.timer-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 14px;
  padding: 14px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.timer-card.timer-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  box-shadow: 0 8px 25px rgba(245, 87, 108, 0.3);
  animation: warningPulse 1.5s ease-in-out infinite;
}

@keyframes warningPulse {
  0%, 100% { box-shadow: 0 8px 25px rgba(245, 87, 108, 0.3); }
  50% { box-shadow: 0 8px 35px rgba(245, 87, 108, 0.5); }
}

.timer-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 8px;
}

.timer-icon-wrapper {
  width: 28px;
  height: 28px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.timer-icon-wrapper i {
  font-size: 14px;
  color: white;
}

.pulse-animation {
  animation: pulse 1s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
}

.timer-label {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: rgba(255, 255, 255, 0.9);
  text-transform: uppercase;
}

.timer-display {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 2rem !important;
  font-weight: 800 !important;
  color: white !important;
  text-align: center;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  background: transparent !important;
  padding: 4px 0 !important;
  margin: 0 !important;
}

.timer-decoration {
  position: absolute;
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  top: -60px;
  right: -60px;
  pointer-events: none;
}

/* Results Card - Compact */
.results-card {
  background: white;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-bottom: 12px;
}

.results-header i {
  font-size: 18px;
  color: #f59e0b;
}

.results-header span {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
}

.score-circle-container {
  display: flex;
  justify-content: center;
  margin-bottom: 14px;
}

.score-circle {
  position: relative;
  width: 100px;
  height: 100px;
}

.score-ring {
  transform: rotate(-90deg);
  width: 100%;
  height: 100%;
}

.score-ring-bg {
  fill: none;
  stroke: #e2e8f0;
  stroke-width: 8;
}

.score-ring-progress {
  fill: none;
  stroke: #3b82f6;
  stroke-width: 8;
  stroke-linecap: round;
  stroke-dasharray: 283;
  transition: stroke-dashoffset 1s ease-out;
}

.score-value {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.score-number {
  font-size: 26px;
  font-weight: 800;
  /* background: linear-gradient(135deg, #3b82f6, #8b5cf6); */
  -webkit-background-clip: text;
  -webkit-text-fill-color: #8b5cf6;
  background-clip: text;
  line-height: 1;
}

.score-total {
  display: block;
  font-size: 11px;
  color: #94a3b8;
  font-weight: 600;
}

.results-stats {
  display: flex;
  justify-content: space-around;
  gap: 8px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border-radius: 10px;
  flex: 1;
}

.stat-item i {
  font-size: 16px;
  margin-bottom: 2px;
}

.stat-item .stat-value {
  font-size: 18px;
  font-weight: 800;
}

.stat-item .stat-label {
  font-size: 9px;
  color: #64748b;
  font-weight: 500;
}

.stat-pending {
  background: #fef2f2;
}
.stat-pending i, .stat-pending .stat-value { color: #ef4444; }

.stat-done {
  background: #f0fdf4;
}
.stat-done i, .stat-done .stat-value { color: #22c55e; }

/* Progress Card - Compact */
.progress-card {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: #475569;
}

.progress-title i {
  font-size: 12px;
  color: #8b5cf6;
}

.progress-percentage {
  font-size: 16px;
  font-weight: 800;
}

.progress-percentage.progress-low { color: #ef4444; }
.progress-percentage.progress-medium { color: #f59e0b; }
.progress-percentage.progress-high { color: #22c55e; }

.progress-bar-container {
  margin-bottom: 8px;
}

.progress-bar-bg {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 8px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  border-radius: 8px;
  transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.progress-bar-fill::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
  animation: shimmer 2s infinite;
}

@keyframes shimmer {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}

.bar-low { background: linear-gradient(90deg, #ef4444, #f87171); }
.bar-medium { background: linear-gradient(90deg, #f59e0b, #fbbf24); }
.bar-high { background: linear-gradient(90deg, #22c55e, #4ade80); }

.progress-details {
  display: flex;
  justify-content: space-between;
}

.progress-stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
}

.progress-stat .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.progress-stat.pending { color: #ef4444; }
.progress-stat.pending .dot { background: #ef4444; }

.progress-stat.completed { color: #22c55e; }
.progress-stat.completed .dot { background: #22c55e; }

/* Action Buttons - Compact */
.actions-container {
  margin-bottom: 6px;
}

.btn-finalizar {
  width: 100%;
  padding: 12px 16px;
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border: none;
  border-radius: 10px;
  color: white;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.3);
  transition: all 0.3s ease;
}

.btn-finalizar:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.4);
}

.btn-finalizar i {
  font-size: 14px;
}

.btn-volver {
  width: 100%;
  padding: 10px 14px;
  background: transparent;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  color: #64748b;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  transition: all 0.2s ease;
}

.btn-volver:hover {
  background: #f8fafc;
  border-color: #94a3b8;
  color: #475569;
}

.btn-volver i {
  font-size: 14px;
}

/* Navigation Section - Compact */
.nav-section {
  background: white;
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.nav-group {
  margin-bottom: 12px;
}

.nav-group:last-child {
  margin-bottom: 0;
}

.nav-group-title {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 10px;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid #f1f5f9;
}

.nav-group-title i {
  font-size: 12px;
  color: #8b5cf6;
}

.question-counter {
  margin-left: auto;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  color: white;
  padding: 2px 6px;
  border-radius: 8px;
  font-size: 9px;
}

/* Navigation Pills - Compact */
.nav-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  justify-content: center;
}

.nav-pill {
  padding: 6px 12px;
  border-radius: 20px;
  border: 2px solid #e2e8f0;
  background: white;
  color: #64748b;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 4px;
}

.nav-pill:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background: #eff6ff;
}

.nav-pill.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 3px 10px rgba(59, 130, 246, 0.3);
}

.nav-pill.completed {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 3px 10px rgba(34, 197, 94, 0.3);
}

/* Estados de revisión para asignaturas */
.nav-pill.completed-correct {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 3px 10px rgba(34, 197, 94, 0.3);
}

.nav-pill.completed-incorrect {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 3px 10px rgba(239, 68, 68, 0.3);
}

.nav-pill.completed-mixed {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-color: transparent;
  color: white;
  box-shadow: 0 3px 10px rgba(245, 158, 11, 0.3);
}

/* Mantener active por encima de los demás estados */
.nav-pill.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  border-color: transparent !important;
  color: white !important;
  box-shadow: 0 3px 10px rgba(59, 130, 246, 0.3) !important;
}

.completed-icon {
  font-size: 10px;
}

.pill-indicator {
  position: absolute;
  bottom: -6px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: #3b82f6;
  border-radius: 50%;
}

/* Questions Grid - Compact */
.questions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(32px, 1fr));
  gap: 6px;
  max-height: 140px;
  overflow-y: auto;
  padding: 2px;
}

.question-btn {
  position: relative;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: 2px solid #e2e8f0;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.question-btn .question-number {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
}

.question-btn:hover {
  transform: scale(1.1);
  border-color: #3b82f6;
}

.question-btn.unanswered {
  background: #f8fafc;
  border-color: #e2e8f0;
}

.question-btn.unanswered .question-number {
  color: #94a3b8;
}

.question-btn.answered {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.question-btn.answered .question-number {
  color: white;
}

/* Estados de revisión para preguntas */
.question-btn.answered-correct {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(34, 197, 94, 0.3);
}

.question-btn.answered-correct .question-number {
  color: white;
}

.question-btn.answered-incorrect {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
  border-color: transparent;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.3);
}

.question-btn.answered-incorrect .question-number {
  color: white;
}

.question-btn.active {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-color: transparent;
  box-shadow: 0 3px 10px rgba(59, 130, 246, 0.4);
  transform: scale(1.15);
}

.question-btn.active .question-number {
  color: white;
}

.answered-indicator {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 12px;
  height: 12px;
  background: #22c55e;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid white;
}

.answered-indicator i {
  font-size: 6px;
  color: white;
}

/* Badge para preguntas correctas en modo revisión */
.answered-indicator-correct {
  background: #22c55e;
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.4);
}

.answered-indicator-correct i {
  font-size: 6px;
  color: white;
  font-weight: bold;
}

/* Badge para preguntas incorrectas en modo revisión */
.answered-indicator-incorrect {
  background: #ef4444;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.4);
}

.answered-indicator-incorrect i {
  font-size: 7px;
  color: white;
  font-weight: bold;
}

/* ========================================
   UTILITIES & ANIMATIONS
   ======================================== */
.custom-scrollbar::-webkit-scrollbar {
  height: 4px;
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 4px;
}

.question-animate {
  animation: slideIn 0.3s ease-out forwards;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.fade-in {
  animation: fadeIn 0.4s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.checkbox-full-width .vs-checkbox--label {
  width: 100%;
}

/* Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    text-align: center;
  }

  .header-info {
    justify-content: center;
  }

  .question-header {
    flex-direction: column;
    gap: 10px;
  }

  .question-meta {
    justify-content: center;
  }
}
.checkbox-label {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  width: 100%;
}
.checkbox-label .vs-checkbox {
  margin-right: 8px;
}
</style>
