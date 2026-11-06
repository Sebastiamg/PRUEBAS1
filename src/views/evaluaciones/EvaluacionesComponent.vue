<template>

    <div>
        <!---==============MODALES============-->
        <vs-popup fullscreen title="Crear preguntas" :active.sync="popupCrearPreguntas"
            @accept="verPreguntas(evaluacion.id)" @close="verPreguntas(evaluacion.id)">
            <crear-preguntas />
        </vs-popup>
        <vs-popup title="Evaluación Aleatoria" :active.sync="popupEvalAleatoria">
            <div align="center" style="padding: 5px; border-radius: 5px; background-color: #FFDCD1; color: #D6623A;"
                class="mb-2">
                Si modificó las unidades, guarde la evaluación antes de continuar.
            </div>
            <div align="center" style="padding: 5px; border-radius: 5px; background-color: #C8E1FF; color: #1360BA;"
                class="mb-2">
                Las preguntas aleatorias serán obtenidas únicamente del banco de preguntas de Prolipa
            </div>
            <!--validacin si no existe preguntas-->
            <div v-if="ifNoExistePreguntas" >
                <!--validacion si mi institucion tiene evaluacion personalizada-->
                <div v-if="datosInstitucion[0].evaluacion_personalizada == 1" align="center"  style="padding: 5px; border-radius: 5px; background-color: #FFDCD1; color: #1360BA;" class="mb-2">
                    <p>Su <span class="font-bold">evaluación es personalizada</span>, no hay preguntas asignadas a su institución.</p>
                </div>
            </div>

            <table style="width: 100%;">
                <tr style="background-color: #e5e5e5;">
                    <td><b>Tipo de pregunta</b></td>
                    <td align="center"><b>Puntaje</b></td>
                    <td align="center"><b>Disponibles</b></td>
                    <td align="center"><b>Cantidad</b></td>
                </tr>
                <tbody>
                    <tr v-for="(itemop, indexch) in tipospreguntas" :key="indexch">
                        <td>
                            {{ itemop.label }}
                        </td>
                        <td align="center">
                            {{ itemop.puntaje }} pts.
                        </td>
                        <td align="center">{{ itemop.cantidad }}</td>
                        <td align="center">
                            <vs-input type="number" min="0" v-model="cantidadesField[indexch]"
                                @input="contarPuntosIngresados()" class="mb-4"
                                style="width: 80px; text-align: center;" />
                        </td>
                    </tr>
                    <tr style="background-color: #e5e5e5;">
                        <td colspan="3" style="vertical-align: middle;"><b>Puntaje preguntas actuales:</b></td>
                        <td align="center">
                            <vs-button type="border" color="success">{{ puntajeTotalGrupo }}</vs-button>
                        </td>
                    </tr>
                    <tr style="background-color: #e5e5e5;">
                        <td colspan="3" style="vertical-align: middle;"><b>Puntaje total:</b></td>
                        <td align="center">
                            <vs-button type="border" color="success"
                                v-if="(puntajeIngresado + puntajeTotalGrupo) <= evaluacion.puntos"
                                style="color: green;">{{ puntajeIngresado + puntajeTotalGrupo }}</vs-button>
                            <vs-button type="border" color="danger" v-else style="color: red;">{{ puntajeIngresado +
                                puntajeTotalGrupo }}</vs-button>
                        </td>
                    </tr>
                </tbody>
            </table>
            <vs-button class="w-full mt-3 mb-2" color="success" type="gradient"
                @click="cargarPreguntasAleatorias()">Generar preguntas</vs-button>
        </vs-popup>
        <vs-prompt @cancel="popupEditEval = true; activePromptGrupo = false;"
            @accept="popupEditEval = true; editarEvaluacion()" @close="popupEditEval = true; activePromptGrupo = false;"
            :active.sync="activePromptGrupo">
            <div class="con-exemple-prompt">
                <vs-alert color="danger" active="true">
                    {{ textoConfirmgrup }}
                </vs-alert>
            </div>
        </vs-prompt>
        <vs-prompt @cancel="activePromptEliminar = false;" @accept="eliminarEvaluacion()"
            @close="activePromptEliminar = false;" :active.sync="activePromptEliminar" color="danger">
            <div class="con-exemple-prompt">
                <h5 class="mb-4 mt-4">¿Está seguro de eliminar esta evaluación?</h5>
            </div>
        </vs-prompt>
        <!----modal exportar--------->
        <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel"
            accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">

            <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
            <v-select v-model="selectedFormat" :options="formats" class="my-4" />

        </vs-prompt>
        <!----fin modal exportar--------->
        <!-- modal de aceptar cambio de grupos de evaluaciones si es menor al de la base -->
        <vs-prompt title="Alerta" class="export-options" @cancel="clearFields" accept-text="Aceptar"
            @close="clearFields" :active.sync="popupGrupos">
            <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
                <span>Ha seleccionado un grupo menor de evaluaciones, las preguntas asignadas a los grupos restantes, se
                    ocultarán</span>
            </vs-alert>
        </vs-prompt>
        <!---==============FIN MODALES============-->
        <!-----===PROCESO====-->
        <vx-card>
            <h2 style="color:#7F7E7E" class="mb-4" v-if="evaluaciones[0] != null"><small>Nombre curso:</small>
                {{ evaluaciones[0].nombre_curso }} &nbsp;-&nbsp;
                Aula: {{ evaluaciones[0].aula }}</h2>
            <h4 style="color:#7F7E7E">Código curso: {{ setCurso }} </h4>
            <vs-tabs alignment="fixed">
                <vs-tab label="Evaluaciones" @click="getDatosInstitucion(); getEvalDoc()">
                    <!--LISTADO DE EVALUACIONES-->
                    <div align="center" class="mt-4">
                        <vs-table stripe v-if="evaluaciones != 0" v-model="evalSelected" pagination max-items="25"
                            search :data="evaluaciones">
                            <template slot="header">
                                <vs-button color="primary" type="border" class="m-1" @click="$router.go(-1)"><b>←
                                        Volver</b></vs-button>
                                <vs-button @click="limpiar(); popupEditEval = true; agregarActivo = true;" color="dark"
                                    type="filled" class="m-1">Crear mi evaluación</vs-button>
                                <!-- <vs-button @click="irPreguntas" size="small" style="font-size: 14px;" color="primary" type="filled" class="mr-1">Crear Pregunta</vs-button> -->
                            </template>

                            <template slot="thead">
                                <vs-th sort-key="nombre_evaluacion">Evaluación</vs-th>
                                <vs-th sort-key="fecha">Fecha</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>

                            <template slot-scope="{data}">
                                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                                    <vs-td :data="data[indextr].tipo_nombre">
                                        <b>Asignatura:</b> {{ data[indextr].nombreasignatura }}<br>
                                        <b>Puntos:</b> {{ data[indextr].puntos }} &nbsp;&nbsp;-&nbsp;&nbsp;
                                        <b>Duración:</b> {{ data[indextr].duracion }} min<br>
                                        <b>Tipo:</b> {{ data[indextr].tipo_nombre }} <br>
                                        <b>Nombre Evaluación:</b> {{ tr.nombre_evaluacion }}<br>
                                        <b>Descripción:</b> {{ tr.descripcion }}
                                        <br>
                                        <b>Respuestas:</b>
                                        <p v-if="tr.ver_calificaciones == 1"> Estudiantes pueden ver las respuestas</p>
                                        <p v-else>Estudiantes no pueden ver las respuestas</p>
                                        <div v-if="datosInstitucion.length > 0 && datosInstitucion[0].ifcodigoEvaluacion === 1"
                                            class="text-success">
                                            <p><b>Código de evaluación</b></p>
                                            <p v-if="tr.codigo_evaluacion">{{ tr.codigo_evaluacion }}</p>
                                            <p v-else class="text-warning">código no configurado</p>
                                        </div>
                                    </vs-td>

                                    <vs-td>
                                        <b>Inicio:</b> {{ data[indextr].fecha_inicio }}<br>
                                        <b>Fin:</b> {{ data[indextr].fecha_fin }}<br>
                                        <vs-switch disabled color="success" v-model="data[indextr].estado"
                                            style="width: 70px;">
                                            <span slot="on">Activa</span>
                                            <span slot="off">Inactiva</span>
                                        </vs-switch>
                                    </vs-td>

                                    <vs-td :data="data[indextr].id" style="width: 260px;">
                                        <vs-dropdown vs-custom-content vs-trigger-click>
                                            <vs-button class="a-icons" href.prevent icon="more_vert" type="border"></vs-button>
                                            <vs-dropdown-menu style="width: 320px;" class="cursor">
                                                <vs-dropdown-item>
                                                    <vs-button class="w-full" icon-pack="feather" icon="icon-edit"
                                                            @click="agregarActivo = false; editarFormulario(data[indextr]); popupEditEval = true; id_evaluacion = data[indextr].id;"
                                                            color="success" type="line">Editar evaluación</vs-button>
                                                </vs-dropdown-item>
                                                <vs-dropdown-item>
                                                    <vs-button class="w-full"  icon-pack="feather"
                                                        icon="icon-eye" @click="irRevision(data[indextr], 1);" color="dark"
                                                        type="line">Previsualizar</vs-button>
                                                </vs-dropdown-item>
                                                <vs-dropdown-item>
                                                    <vs-button class="w-full"  icon-pack="feather"
                                                            icon="icon-check-circle" @click="irRevision(data[indextr], 0);"
                                                            color="primary" type="line">Revisar evaluación</vs-button>
                                                </vs-dropdown-item>
                                                <vs-dropdown-item>
                                                    <vs-button class="w-full"  icon-pack="feather"
                                                            icon="icon-trash" @click="openConfirmEliminar(data[indextr]);"
                                                            color="danger" type="line">Eliminar evaluación</vs-button>
                                                </vs-dropdown-item>
                                                <vs-dropdown-item>
                                                    <vs-button class="w-full"  icon-pack="feather" icon="icon-link"
                                                        @click="copiarLink(data[indextr]);" color="warning"
                                                        type="line">Copiar link de evaluación</vs-button>
                                                </vs-dropdown-item>
                                            </vs-dropdown-menu>
                                        </vs-dropdown>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>

                        <vs-button v-if="evaluaciones == 0" class="mt-6 mb-6" type="line"
                            @click="limpiar(); popupEditEval = true; agregarActivo = true;" color="primary">Crear
                            evaluación</vs-button>

                    </div>
                </vs-tab>
                <vs-tab label="Calificaciones" @click="verCalificaciones()">
                    <div v-if="respuestas.length === 0" class="mt-6">No existen calificaciones para este curso</div>
                    <vs-table stripe v-else pagination max-items="25" search :data="respuestas">
                        <template slot="header">
                            <vs-button color="warning" size="small" style="font-size: 14px;"
                                @click="activePrompt = true">Exportar</vs-button>
                        </template>
                        <template slot="thead">
                            <vs-th sort-key="nombres">Estudiante</vs-th>
                            <vs-th v-for="(item, index) in respuestas[0].calificaciones" :key="index">
                                Ev{{ index }}
                            </vs-th>

                        </template>
                        <template slot-scope="{data}">
                            <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                <vs-td :data="tr">
                                    {{ tr.Estudiante }}
                                </vs-td>

                                <vs-td :key="$indexs" v-for="(item, $indexs) in tr.calificaciones">
                                    <span v-if="item">
                                        {{ item }}
                                        <!--boton mostrar detalles-->
                                        <vs-button @click="verDetalles(tr, $indexs)" color="primary" class="ml-3"
                                            type="filled" size="small"><i class="fa-solid fa-eye"></i>
                                            Detalles</vs-button>
                                    </span>
                                    <span v-else>0</span>
                                </vs-td>

                            </vs-tr>
                        </template>
                    </vs-table>
                </vs-tab>
                <vs-tab label="Lista estudiantes">
                    <estudianteCursoVue :setCurso="setCurso" />
                </vs-tab>
            </vs-tabs>
        </vx-card>
        <!--========NUEVOS MODALES==========-->
        <!-- Modal Editar Evaluaciones-->
        <div class="demo-alignment">
            <vs-popup fullscreen classContent="popup-example" v-bind:title="'Evaluación - GRUPO ' + radios1"
                :active.sync="popupEditEval">
                <vs-tabs alignment="fixed">
                    <vs-tab label="Evaluación">
                        <div class="vx-row mt-4">
                            <div class="vx-col sm:w-1/2 w-full" align="left">
                                <div style="font-size: 12px; margin-top: 15px;">Asignatura: </div>
                                <vs-input disabled class="w-full" :value="local_nombreasignatura"></vs-input>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full" align="left">
                                <div style="font-size: 12px; margin-top: 15px;">Unidades </div>
                                <v-select multiple :closeOnSelect="false" v-model="unidadSelected" class="mb-4"
                                    :options="unidades" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full" align="left">
                                <div style="font-size: 12px;">Tipo de evaluación: </div>
                                <v-select class="mb-4 w-full" v-model="tipoevaluacionselect" :options="tiposeval"
                                    :value="tipoevaluacionselect" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full" align="left">
                                <div style="font-size: 12px;">Cuántos grupos de evaluaciones desea crear </div>
                                <v-select class="mb-4" v-if="agregarActivo === true" v-model="grupo_selected"
                                    :options="grupo_opciones" :value="grupo_selected" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                                <v-select class="mb-4" v-else v-model="grupo_selected" :options="grupo_opciones"
                                    :value="grupo_selected" :dir="$vs.rtl ? 'rtl' : 'ltr'"
                                    @input="openConfirmgrupo(evaluacion)" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full">
                                <div style="font-size: 12px;">Fecha inicio: </div>
                                <flat-pickr class="mb-4 w-full" :config="configdateTimePicker"
                                    v-model="evaluacion.fecha_inicio" placeholder="Fecha inicio" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full" align="left">
                                <div style="font-size: 12px;">Fecha fin: </div>
                                <flat-pickr class="mb-4 w-full" :config="configdateTimePicker"
                                    v-model="evaluacion.fecha_fin" placeholder="Fecha fin" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full">
                                <vs-input type="number" class="inputx w-full mb-4" label="Duración (minutos)"
                                    v-model="evaluacion.duracion" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full">
                                <vs-input type="number" class="inputx w-full mb-6" label="Puntos"
                                    v-model="evaluacion.puntos" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full">
                                <vs-textarea class="inputx w-full mb-6" label="Nombre de Evaluación"
                                   v-model="evaluacion.nombre_evaluacion" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full">
                                <vs-textarea class="inputx w-full mb-6" label="Descripción"
                                   v-model="evaluacion.descripcion" />
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mt-4" align="center">
                                <vs-switch vs-icon-on="check" color="success" v-model="evaluacion.estado"
                                    style="width: 120px;" class="mt-6 mb-4">
                                    <span slot="on">Activa</span>
                                    <span slot="off">Inactiva</span>
                                </vs-switch>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mt-4" align="center">
                                <ul class="flex mt-2">
                                    <li>
                                        Estudiantes puede ver calificaciones:
                                    </li>
                                    <li class="ml-5">
                                        <vs-radio v-model="evaluacion.ver_calificaciones"
                                            vs-name="radios1ver_calificaciones" vs-value="1">Si</vs-radio>
                                    </li>
                                    <li>
                                        <vs-radio v-model="evaluacion.ver_calificaciones" class="ml-2"
                                            vs-name="radios1ver_calificaciones" vs-value="0">No</vs-radio>
                                    </li>
                                </ul>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mt-4" align="center"
                                v-if="datosInstitucion.length > 0 && datosInstitucion[0].ifcodigoEvaluacion === 1">
                                <ul class="flex mt-2">
                                    <li>
                                        Código que debe ingresar el estudiante:
                                    </li>
                                    <li class="ml-1" v-if="evaluacion.codigo_evaluacion"><b>{{
                                        evaluacion.codigo_evaluacion
                                            }}</b></li>
                                    <li class="ml-2 text-warning" v-else>(Guarde para que se genere el código de
                                        evaluación)
                                    </li>
                                </ul>
                            </div>
                            <vs-divider />
                            <!--CARGAR PREGUNTAS ALEATORIAS-->
                            <div class="vx-col sm:w-1/2 w-full mt-4" align="center">
                                <vs-button class="mt-2 mb-2 w-full" v-if="agregarActivo === false" color="warning"
                                    type="border"
                                    @click="verPreguntasxEval(evaluacion.id); puntajeTotalGrupo = 0; popupEvalAleatoria = true">Cargar
                                    preguntas aleatorias</vs-button>
                            </div>
                            <div class="vx-col sm:w-1/2 w-full mt-4" align="center">
                                <vs-button class="mt-2 mb-2 w-full" v-if="agregarActivo === false" color="primary"
                                    type="gradient" @click="editarEvaluacion(evaluacion)">Guardar</vs-button>
                                <div v-else>
                                    <vs-button class="mt-2 mb-2 w-full" v-if="guardadoActivo === false" color="success"
                                        type="gradient" @click="agregar()">Guardar</vs-button>
                                </div>
                            </div>
                        </div>
                    </vs-tab>
                    <vs-tab label="Preguntas">
                        <div v-if="ifNoExistePreguntas && evaluacion.id" >
                            <!--validacion si mi institucion tiene evaluacion personalizada-->
                            <div v-if="datosInstitucion[0].evaluacion_personalizada == 1" align="center"  style="padding: 5px; border-radius: 5px; background-color: #FFDCD1; color: #1360BA;" class="mb-2">
                                <p>Su <span class="font-bold">evaluación es personalizada</span>, no hay preguntas asignadas a su institución.</p>
                            </div>
                        </div>
                        <!------lista preguntas por evaluacion----->
                        <div v-if="evaluacion.id === undefined || evaluacion.id === ''"></div>
                        <ul align="center" v-else class="mt-6 mb-2"
                            style="border: 1px solid #D5D5D5; border-radius: 5px;">
                            <vs-radio v-for="(itemp, indexp) in cant_gruposSelec" :key="indexp" v-model="radios1"
                                v-bind:vs-value="indexp + 1" class="m-3" @input="verPreguntasxEval(evaluacion.id)">
                                Grupo {{ indexp + 1 }}
                            </vs-radio>
                        </ul>
                        <vs-table stripe v-if="preguntasEvaluaciones != 0" v-model="pregSelected" pagination
                            max-items="25" search :data="preguntasEvaluaciones.items">
                            <template slot="header">
                                <vs-button @click="popupEditEval = false; popupSelecPreg = true; verPreguntas();"
                                    class="mr-1" size="small" style="font-size: 14px;" color="dark" type="filled">Cargar
                                    preguntas</vs-button>
                                <vs-button @click="irPreguntas" size="small" style="font-size: 14px;" color="primary"
                                    type="filled" class="mr-3">Crear mis preguntas</vs-button>
                            </template>
                            <template slot="thead">
                                <vs-th sort-key="descripcion" style="font-size: 15px; color: #18DE8A;">Preguntas de mi
                                    evaluación - Cantidad: {{ preguntasEvaluaciones.items.length }} - Puntaje:
                                    {{ puntajeTotalGrupo }}
                                </vs-th>
                                <vs-th sort-key="nombre_tipo">Detalle</vs-th>
                                <vs-th>Acciones</vs-th>
                            </template>
                            <template slot-scope="{data}">
                                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                                    <vs-td :data="data[indextr].descripcion">
                                        Tema: {{ data[indextr].nombre_tema }}<br>
                                        <span v-html="renderLatex(data[indextr].descripcion)"></span>
                                        {{data[indextr].img_pregunta  }}
                                        <img v-if="data[indextr].img_pregunta != '' && data[indextr].img_pregunta != 'null' && data[indextr].img_pregunta != null"
                                            v-bind:src="$data_url + 'archivos/img/img_preguntas/' + data[indextr].img_pregunta"
                                            class="img-responsive" style="border-radius: 5px;" width="100px">
                                        <vs-collapse>
                                            <vs-collapse-item>
                                                <div slot="header">
                                                    Opciones
                                                </div>
                                                <div class="mb-5" :key="indexitem"
                                                    v-for="(item, indexitem) in data[indextr].opciones">
                                                    <div style="width: 100%; font-size: 12px; color: #0DCD88;"
                                                        v-if="item.tipo === 1">Respuesta correcta<br></div>
                                                    <div style="width: 100%; font-size: 12px; color: #FD5858;" v-else>
                                                        Respuesta incorrecta<br></div>
                                                    <div style="width: 100%"><span v-html="renderLatex(item.opcion)"></span><br></div>
                                                    <div style="width: 100%"><img
                                                            v-if="item.img_opcion != '' && item.img_opcion != 'null' && item.img_opcion != null"
                                                            v-bind:src="$data_url + 'archivos/img/img_preguntas/' + item.img_opcion"
                                                            class="img-responsive" style="border-radius: 5px;"
                                                            width="100px"></div>
                                                </div>
                                                <div v-if="data[indextr].opciones.length == 0">
                                                    <p class="text-center text-danger">No hay opciones para esta pregunta</p>
                                                </div>
                                            </vs-collapse-item>
                                        </vs-collapse>
                                    </vs-td>

                                    <vs-td :data="data[indextr].nombre_tipo">
                                        {{ data[indextr].clasificacion }}<br>
                                        <b>Puntaje:</b> {{ data[indextr].puntaje_pregunta }}<br>
                                        <b>Tipo:</b> {{ data[indextr].nombre_tipo }}
                                    </vs-td>

                                    <vs-td>
                                        <vs-button @click="quitarPregunta(data[indextr], data[indextr].id_pre_evas)"
                                            color="danger" style="font-size: 13px;" type="filled"
                                            size="small">eliminar</vs-button>
                                    </vs-td>
                                </vs-tr>
                            </template>
                        </vs-table>
                        <div align="center" class="mb-5 mt-5" color="#842993" v-if="preguntasEvaluaciones == 0">
                            <div class="mt-6" v-if="evaluacion.id === undefined || evaluacion.id === ''">
                                Debe crear una evaluación antes de cargar preguntas.
                            </div>
                            <div v-else class="mt-6">
                                <vs-button color="primary" type="line" class="ml-4"
                                    @click="popupEditEval = false; popupSelecPreg = true; verPreguntas(evaluacion.id);">Cargar
                                    preguntas</vs-button>
                                <vs-button @click="irPreguntas" color="primary" type="line" class="ml-3">Crear mis
                                    preguntas</vs-button>
                            </div>
                        </div>
                    </vs-tab>
                    <!-----------fin lista preguntas por evaluacion------------->
                </vs-tabs>
            </vs-popup>
        </div>
        <!----fin modal editar--->
        <!-- Modal Preguntas-->
        <div class="demo-alignment">
            <vs-popup fullscreen classContent="popup-example"
                v-bind:title="'Seleccione las preguntas para esta Evaluación - GRUPO ' + radios1"
                :active.sync="popupSelecPreg">
                <b>Asignaturas:</b> {{ local_nombreasignatura }}<br>
                <div v-if="preguntas != 0"> <b>Cantidad preguntas:</b> {{ preguntas.items.length }}</div>
                <vs-table stripe v-if="preguntas != 0" v-model="pregSelected" pagination max-items="25" search
                    :data="preguntas.items">

                    <template slot="header">
                        <vs-button @click="popupSelecPreg = false; popupEditEval = true;" class="mr-2" size="small"
                            style="font-size: 14px;" color="primary" type="filled"> ← Volver</vs-button>

                        <v-select v-model="unidadSelectedFiltrar" class="mr-2" :options="unidadesFiltrar"
                            @input="filtrarPreguntasxUnidad()" style="width: 180px; min-width: 60px;"
                            :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                        <v-select v-model="tipoSelected" class="mr-2" :options="tipos" @input="filtrarTipos()"
                            style="width: 250px; min-width: 60px;" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                        <v-select v-model="bancoSelected" class="mr-2" :options="bancos" @input="filtrarBancos()"
                            style="width: 250px; min-width: 60px;" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
                    </template>

                    <template slot="thead">
                        <vs-th width="60%" sort-key="descripcion">Pregunta</vs-th>
                        <vs-th width="20%" sort-key="tipo">Tipo</vs-th>
                        <vs-th width="20%">Acciones</vs-th>
                    </template>

                    <template slot-scope="{data}">
                        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                            <vs-td :data="data[indextr].descripcion">
                                Tema: {{ data[indextr].nombre_tema }} <br>
                                <span v-html="renderLatex(data[indextr].descripcion)"></span>
                                <img v-if="data[indextr].img_pregunta != '' && data[indextr].img_pregunta != 'null' && data[indextr].img_pregunta != null"
                                    v-bind:src="$data_url + 'archivos/img/img_preguntas/' + data[indextr].img_pregunta"
                                    class="img-responsive" width="100px" style="border-radius: 5px;">

                                <vs-collapse>
                                    <vs-collapse-item>
                                        <div slot="header">
                                            Opciones
                                        </div>
                                        <div class="mb-5" :key="indexitem"
                                            v-for="(item, indexitem) in data[indextr].opciones">
                                            <div style="width: 100%; font-size: 12px; color: #0DCD88;"
                                                v-if="item.tipo === 1">Respuesta correcta<br></div>
                                            <div style="width: 100%; font-size: 12px; color: #FD5858;" v-else>Respuesta
                                                incorrecta<br></div>
                                            <div style="width: 100%"><span v-html="renderLatex(item.opcion)"></span><br></div>
                                            <div style="width: 100%"><img
                                                    v-if="item.img_opcion != '' && item.img_opcion != 'null' && item.img_opcion != null"
                                                    v-bind:src="$data_url + 'archivos/img/img_preguntas/' + item.img_opcion"
                                                    class="img-responsive" style="border-radius: 5px;" width="100px">
                                            </div>
                                        </div>
                                    </vs-collapse-item>
                                </vs-collapse>
                            </vs-td>

                            <vs-td :data="data[indextr].nombre_tipo">
                                {{ data[indextr].clasificacion }}<br>
                                <b>Puntaje:</b> {{ data[indextr].puntaje_pregunta }}<br>
                                <b>Tipo:</b> {{ data[indextr].nombre_tipo }}
                            </vs-td>

                            <vs-td :data="data[indextr].id">
                                <vs-button @click="cargarPregunta(data[indextr], data[indextr])" size="small"
                                    style="font-size: 13px;" color="success" type="filled">Agregar</vs-button>
                            </vs-td>

                        </vs-tr>
                    </template>
                </vs-table>

                <div class="mb-6 mt-5" color="#842993" v-if="preguntas == 0">
                    <vs-button @click="popupSelecPreg = false; popupEditEval = true;" class="mr-2" size="small"
                        style="font-size: 14px;" color="primary" type="filled"> ← Volver</vs-button>

                    <v-select v-model="unidadSelectedFiltrar" class="mr-2" :options="unidadesFiltrar"
                        @input="filtrarPreguntasxUnidad()" style="display: inline-block; width: 180px; min-width: 60px;"
                        :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                    <v-select v-model="tipoSelected" class="mb-6" :options="tipos" @input="filtrarTipos()"
                        style="width: 250px; min-width: 60px; display: inline-block;" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                    <v-select v-model="bancoSelected" class="mr-2" :options="bancos" @input="filtrarBancos()"
                        style="display: inline-block; width: 250px; min-width: 60px;" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                    <div class="w-full mt-6" align="center" style="height: 700px;" v-if="unidadSelected === ''">
                        Seleccione
                        una
                        unidad</div>

                    <div class="w-full mt-6" align="center" style="height: 700px;" v-else>No existen preguntas para esta
                        unidad.
                    </div>

                    <div class="w-full mt-6" align="center" style="height: 700px;"
                        v-if="tipoSelected === '' && unidadSelected != ''">Seleccione un tipo</div>

                    <div class="w-full mt-6" align="center" style="height: 700px;" v-else>No existen preguntas para el
                        tipo
                        seleccionado</div>
                </div>

            </vs-popup>
        </div>
        <!----fin modal preguntas--->
        <!--MODAL PARA MOSTRAR LOS DETALLES DE LA CALIFICACION-->
        <vs-popup classContent="popup-example" title="Detalle de calificación" :active.sync="popupDetalleCalificacion">
            <div v-if="popupDetalleCalificacion">
                <div v-if="arrayDetalleCalificacion.length > 0">
                    <vs-list>
                        <vs-list-header :title="arrayDetalleCalificacion[0].estudiante"></vs-list-header>
                        <vs-list-item title="Calificación"
                            :subtitle="arrayDetalleCalificacion[0].calificacion"></vs-list-item>
                        <vs-list-item title="Cédula" :subtitle="arrayDetalleCalificacion[0].cedula"></vs-list-item>
                        <vs-list-item title="Fecha que realiza la evaluación"
                            :subtitle="arrayDetalleCalificacion[0].fecha_inicio_evaluacion"></vs-list-item>
                        <vs-list-item title="Fecha que finaliza"
                            :subtitle="arrayDetalleCalificacion[0].fecha_fin_evaluacion !== null ? arrayDetalleCalificacion[0].fecha_fin_evaluacion : (arrayDetalleCalificacion[0].updated_at === arrayDetalleCalificacion[0].fecha_inicio_evaluacion ? 'Evaluación en curso' : arrayDetalleCalificacion[0].updated_at)">
                        </vs-list-item>
                        <vs-list-item title="Dirección IP" :subtitle="arrayDetalleCalificacion[0].ip"></vs-list-item>
                    </vs-list>
                    <div class="flex justify-center">
                        <!--boton para resetear evaluación-->
                        <vs-button @click="confirmResetearEvaluacion(ObjectResetSelected = arrayDetalleCalificacion[0])"
                            color="danger" type="filled" class="mt-4">Resetear evaluación</vs-button>
                    </div>
                </div>
                <div v-else>
                    <p>No se enconto datos del estudiante</p>
                </div>
            </div>
        </vs-popup>
        <!--========FIN NUEVOS MODALES==========-->
    </div>
</template>

<script>
import crearPreguntas from './PreguntasComponent.vue'
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import VueRouter from 'vue-router'
import $ from 'jquery'
import estudianteCursoVue from '@/views/docentes/components/estudianteCurso.vue'
import historicoMixin from "@/mixins/historicomix";
import { renderLatex } from '@/utils/renderLatex'
import 'mathlive/mathlive-static.css'
import 'mathlive/mathlive-fonts.css'
import 'katex/dist/katex.min.css'

export default {
    mixins: [historicoMixin],
    props: {
        evaluacionAdmin: {
            type: Object,
            default: null
        },
        nuevaEvaluacionAdmin: {
            type: Object,
            default: null
        }
    },
    data() {
        return {
            fileName: null,
            formats: ['xls', 'xlsx', 'csv', 'txt'],
            cellAutoWidth: true,
            selectedFormat: 'xls',
            activePrompt: false,
            popupGrupos: false,
            evaluaciones: [],
            evaluacion: {
                asignatura: '',
                descripcion: '',
                fecha_inicio: '',
                fecha_fin: '',
                estado: '',
                puntos: '',
                duracion: '',
                ver_calificaciones: '1',
                codigo_evaluacion: "",
                descripcion: '',
                nombre_evaluacion: ''
            },
            preguntas: [], //preguntas disponibles para cada evaluacion
            pregunta: {
                descripcion: '',
                respuesta: '',
                opcion1: '',
                opcion2: '',
                opcion3: ''
            },
            preguntasEvaluaciones: [], //preguntas cargadas a las evaluaciones
            preguntaEvaluacion: {
                descripcion: '',
                respuesta: '',
                opcion1: '',
                opcion2: '',
                opcion3: ''
            },
            preguntasEvaluacionesResponder: [],
            preguntaEvaluacioneResponder: {
                descripcion: '',
                id_tema: '',
                respuesta: '',
                opcion1: '',
                opcion2: '',
                opcion3: '',
                img_pregunta: '',
                img_respuesta: '',
                img_opcion1: '',
                img_opcion2: '',
                img_opcion3: ''
            },
            asignaturas: [],
            asignatura: { id: '', label: '' },
            asignaturaSelected: { id: '', label: '' },
            editarActivo: false,
            date: new Date().toJSON(),
            datetime: null,

            agregarActivo: false,
            popupEditEval: false,
            popupSelecPreg: false,
            popupResolver: false,
            estado_evaluacion: ['inactiva'],
            evalSelected: [],
            pregSelected: [],
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
            nombre_docente: null,
            apellido_docente: null,
            active1: true,
            calificaciones: [],
            calificacionesSelected: [],
            evaluacionestabla: [],
            respuestas: [],
            estudiantes: [],
            alumnos: [],
            urlOrigen: '',
            id_evaluacion: '',
            guardadoActivo: false,
            unidadSelectedFiltrar: '',
            unidSelect: [],
            unidadesFiltrar: [],
            unidadSelected: [],
            unidades: [
                { id: "1", label: "Unidad 1" },
                { id: "2", label: "Unidad 2" },
                { id: "3", label: "Unidad 3" },
                { id: "4", label: "Unidad 4" },
                { id: "5", label: "Unidad 5" },
                { id: "6", label: "Unidad 6" }
            ],
            tipoSelected: '',
            tipos: [
                { id: "1", label: "Opción múltiple", }, { id: "2", label: "Respuesta cerrada", }, { id: "3", label: "Verdadero/Falso", }, { id: "5", label: "Selección simple" }, { id: "6", label: "Respuesta abierta" }
            ],
            tiposeval: [],
            tipoevaluacionselect: '',
            grupo_selected: '',
            grupo_opciones: [
                { id: '1', label: '1 grupo' },
                { id: '2', label: '2 grupos' },
                { id: '3', label: '3 grupos' },
                { id: '4', label: '4 grupos' },
                { id: '5', label: '5 grupos' }
            ],
            cant_grupos_select: '',
            radios1: 1,
            grupoEstudianteSelec: '',
            gruposEstudiantes: [
                { id: '1', label: 'Grupo 1' },
                { id: '2', label: 'Grupo 2' },
                { id: '3', label: 'Grupo 3' },
                { id: '4', label: 'Grupo 4' },
                { id: '5', label: 'Grupo 5' }
            ],
            estudiantesEval: [],
            activePromptGrupo: false,
            textoConfirmgrup: '',
            puntajeTotalGrupo: 0,
            popupEvalAleatoria: false,
            tipospreguntas: [],
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s'
            },
            bancoSelected: { id: '3', label: 'Ambas' },
            bancos: [
                { id: '1', label: 'Preguntas de Prolipa' },
                { id: '2', label: 'Solo mis preguntas' },
                { id: '3', label: 'Ambas' },
            ],
            cant_gruposSelec: [1],
            cant_preguntast1: 0,
            cant_preguntast2: 0,
            cant_preguntast3: 0,
            cant_preguntast4: 0,
            cant_preguntast5: 0,
            puntajeIngresado: 0,
            tiposPregAl: [1, 2, 3, 5, 6],
            puntajetipo: [1, 2, 0.5, 1, 2],
            cantidadesField: [0, 0, 0, 0, 0],
            indexCantField: 0,
            evalElimin: [],
            activePromptEliminar: false,
            local_idasignatura: '',
            local_nombreasignatura: '',
            popupCrearPreguntas: false,
            arrayDetalleCalificacion: [],
            popupDetalleCalificacion: false,
            ObjectResetSelected: '',
            idEvaluacionReset: '',
            datosInstitucion: [],
            setCurso: '',
            idInstitucionConsulta: '',
            ifNoExistePreguntas: false,
        }
    },
    components: {
        'v-select': vSelect,
        'crear-preguntas': crearPreguntas,
        flatPickr,
        estudianteCursoVue,
    },
    created() {
        let me = this;
        if (Object.keys(this.nuevaEvaluacionAdmin || {}).length > 0) {
            me.local_idasignatura = this.nuevaEvaluacionAdmin.id_asignatura
            me.local_nombreasignatura = this.nuevaEvaluacionAdmin.nombreasignatura
            localStorage.setItem("codigo", this.nuevaEvaluacionAdmin.codigo_curso);
            me.setCurso = (localStorage.getItem('codigo'));
            // me.usuario = this.nuevaEvaluacionAdmin.id_docente
            me.usuario = JSON.parse(localStorage.getItem("usuarioDocente"))
            me.docente = this.nuevaEvaluacionAdmin.id_docente
            me.nombre_docente = me.usuario.nombres
            me.apellido_docente = me.usuario.apellidos
            me.idInstitucionConsulta = this.nuevaEvaluacionAdmin.institucion_idInstitucion;
            me.getEvalDoc();
            me.f_inicio();
            me.getDatosInstitucion();
            return
        }
        if (Object.keys(this.evaluacionAdmin || {}).length > 0) {
            //edicion de evaluaciones desde el modulo de usuarios desde el administrador
            localStorage.setItem("local_idasignatura", this.evaluacionAdmin.id_asignatura);
            localStorage.setItem("local_nombreasignatura", this.evaluacionAdmin.nombreasignatura);
            me.local_idasignatura = this.evaluacionAdmin.id_asignatura
            me.local_nombreasignatura = this.evaluacionAdmin.nombreasignatura
            localStorage.setItem("codigo", this.evaluacionAdmin.codigo_curso);
            me.setCurso = (localStorage.getItem('codigo'));
            // me.usuario = this.evaluacionAdmin.id_docente
            me.usuario = JSON.parse(localStorage.getItem("usuarioDocente"))
            me.docente = this.evaluacionAdmin.id_docente
            me.nombre_docente = me.usuario.nombres
            me.apellido_docente = me.usuario.apellidos
            me.id_evaluacion = this.evaluacionAdmin.id;
            me.idInstitucionConsulta = this.evaluacionAdmin.institucion_idInstitucion;
            console.log('evaluacionAdmin me.idInstitucionConsulta', me.idInstitucionConsulta)
            me.getEvalDoc();
            me.f_inicio();
            me.getDatosInstitucion();
            return
        }

        me.setCurso = (localStorage.getItem('codigo'));
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.docente = me.usuario.idusuario
        me.nombre_docente = me.usuario.nombres
        me.apellido_docente = me.usuario.apellidos
        var urlBack = window.location.href
        var urlV = urlBack.split('/')
        me.urlOrigen = urlV[0] + '/' + urlV[1] + '/' + urlV[2]

        me.local_idasignatura = localStorage.idasignatura
        me.local_nombreasignatura = localStorage.nombreasignatura

        me.idInstitucionConsulta = me.usuario.institucion_idInstitucion
        me.getEvalDoc();
        me.f_inicio();
        me.getDatosInstitucion();
    },
    methods: {
        renderLatex,
        f_inicio() {
            let me = this;
            this.$http.get(this.$server_url + 'asignaturasDoc/' + me.docente)
                .then(res => {
                    me.asignaturas = res.data;
                })
                .catch(function (error) {
                    console.log(error);
                });
            this.$http.get(this.$server_url + 'tipoevaluacion')
                .then(res => {
                    me.tiposeval = res.data
                })
                .catch(function (error) {
                    console.log(error)
                })

        },
        getDatosInstitucion() {
            let me = this;
            //datos institucion
            this.$http.get(this.$server_url + 'cod_evaluacion_institucion/' + me.idInstitucionConsulta)
                .then(res => {
                    me.datosInstitucion = res.data
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        verDetalles(tr, item) {
            let me = this
            me.idEvaluacionReset = tr.ids[item]
            let idUser = tr.idusuario
            let formData = new FormData();
            formData.append('idEvaluacion', me.idEvaluacionReset);
            formData.append('idUser', idUser);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'detallesCalificaciones', formData)
                .then(res => {
                    me.$vs.loading.close()
                    this.arrayDetalleCalificacion = res.data
                    me.popupDetalleCalificacion = true
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
        },
        confirmResetearEvaluacion() {
            let me = this
            me.popupDetalleCalificacion = false
            me.$vs.dialog({
                type: 'confirm',
                color: 'danger',
                title: 'Resetear evaluación',
                text: '¿Está seguro que desea resetear la evaluación del estudiante' + ' ' + me.ObjectResetSelected.estudiante,
                acceptText: 'Aceptar',
                accept: () => {
                    me.resetearEvaluacion(me.ObjectResetSelected)
                },
                cancel: () => {
                    me.popupDetalleCalificacion = true
                }
            })
        },
        resetearEvaluacion() {
            let me = this
            let formData = new FormData();
            formData.append('id_estudiante', me.ObjectResetSelected.idusuario);
            formData.append('id_evaluacion', me.idEvaluacionReset)
            me.$vs.loading()
            me.$http.post(me.$server_url + 'resetearEvaluacion', formData)
                .then(function (res) {
                    me.$vs.loading.close()
                    if (res.data.status == 0) {
                        me.$vs.notify({
                            text: 'Ocurrio algun error',
                            color: 'danger',
                            iconPack: 'feather'
                        })
                        return
                    }
                    me.popupDetalleCalificacion = false
                    me.verCalificaciones()
                    me.$vs.notify({
                        text: 'Evaluación reseteada correctamente',
                        color: 'success',
                        iconPack: 'feather'
                    })

                })
                .catch(function (error) {
                    console.log(error)
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Error al resetear la evaluación',
                        color: 'danger',
                        iconPack: 'feather'
                    })
                })

        },
        exportToExcel() {
            let headerTitle = ['Cédula', 'Estudiante'];
            let headerVal = ['Cedula', 'Estudiante'];

            for (let index = 0; index < this.alumnos[0].total.length; index++) {
                headerTitle.push("Evaluación" + index)
                headerVal.push("Evaluacion" + index)
            }

            import('@/vendor/Export2Excel').then(excel => {
                const list = this.respuestas
                const data = this.formatJson(headerVal, list)
                excel.export_json_to_excel({
                    header: headerTitle,
                    data,
                    filename: this.fileName,
                    autoWidth: this.cellAutoWidth,
                    bookType: this.selectedFormat
                })
                this.clearFields()
                this.guardarActivo = '';
                this.generarActivo = ' ';
                this.textAlertCant = '';
                this.cantidad = '';
                this.codigoSelected = [];
            })
        },
        formatJson(filterVal, jsonData) {
            return jsonData.map(v => filterVal.map(j => {
                return v[j]
            }))
        },
        clearFields() {
            this.fileName = ''
            this.cellAutoWidth = true
            this.selectedFormat = 'xls'
        },
        onResize() {
            if (window.innerWidth < 769)
                this.isMobile = true;
            else
                this.isMobile = false;
        },
        getEvalDoc() {
            let me = this
            me.$vs.loading()
            let formData1 = new FormData();
            formData1.append('docente', me.docente);
            formData1.append('codigo', localStorage.codigo);
            me.$http.post(this.$server_url + 'evaluacionesDocente', formData1)
                .then(res => {
                    me.evaluaciones = res.data;
                    me.$vs.loading.close()
                    // console.log(me.evaluaciones)
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        limpiar() {
            this.evaluacion.duracion = '';
            this.evaluacion.ver_calificaciones = 1;
            this.evaluacion.codigo_evaluacion = '';
            this.evaluacion.descripcion = '';
            this.evaluacion.fecha_inicio = '';
            this.evaluacion.fecha_fin = '';
            this.evaluacion.estado = '';
            this.evaluacion.puntos = '';
            this.evaluacion.descripcion = '';
            this.evaluacion.nombre_evaluacion = '';
            this.preguntas = [];
            this.preguntasEvaluaciones = [];
            this.evaluacion.id = '';
            this.guardadoActivo = false;
            this.unidadSelected = [];
            this.grupo_selected = '';
            this.radios1 = 1;
            this.puntajeIngresado = 0;
            this.cantidadesField = [0, 0, 0, 0, 0];
            this.id_evaluacion = '';
        },
        agregar() {
            let me = this;
            if(me.evaluacion.nombre_evaluacion.trim() === '') {
                me.$vs.notify({
                    text: 'El nombre de la evaluación no puede estar vacío o contener solo espacios en blanco',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }

            if (me.evaluacion.puntos === '' || me.evaluacion.duracion === '' || me.tipoevaluacionselect.id === '' || me.grupo_selected.id === '' || me.unidadSelected.id === '') {
                me.$vs.notify({
                    text: 'Debe completar todos los campos antes de guardar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            if (me.evaluacion.fecha_inicio == "" || me.evaluacion.fecha_inicio == null || me.evaluacion.fecha_inicio == undefined) {
                me.$vs.notify({
                    text: 'Debe seleccionar una fecha de inicio',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            if (me.evaluacion.fecha_fin == "" || me.evaluacion.fecha_fin == null || me.evaluacion.fecha_fin == undefined) {
                me.$vs.notify({
                    text: 'Debe seleccionar una fecha fin',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            if (me.grupo_selected === '' || me.grupo_selected === null || me.grupo_selected === undefined) {
                me.$vs.notify({
                    text: 'Debe seleccionar la cantidad de grupos',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            var idunidades = [];
            for (var i = 0; i < this.unidadSelected.length; i++) {
                idunidades.push(this.unidadSelected[i].id);
            }

            me.$vs.loading()
            let estado;
            if (me.evaluacion.estado == true) {
                estado = 1;
            } else {
                estado = 0;
            }

            let formData = new FormData();
            formData.append('nombre_evaluacion', me.evaluacion.nombre_evaluacion);
            formData.append('asignatura', me.local_idasignatura);
            formData.append('descripcion', me.evaluacion.descripcion || '');
            formData.append('puntos', me.evaluacion.puntos);
            formData.append('duracion', me.evaluacion.duracion);
            formData.append('fecha_inicio', me.evaluacion.fecha_inicio);
            formData.append('fecha_fin', me.evaluacion.fecha_fin);
            formData.append('estado', estado);
            formData.append('docente', me.docente);
            formData.append('codigo', localStorage.codigo);
            formData.append('idtipoeval', me.tipoevaluacionselect.id);
            formData.append('id_grupo_opciones', me.grupo_selected.id);
            formData.append('cant_unidades', idunidades);
            formData.append('ver_calificaciones', me.evaluacion.ver_calificaciones)
            formData.append('codigo_evaluacion', me.evaluacion.codigo_evaluacion)
            me.$http.post(this.$server_url + 'evaluacion', formData)
                .then(res => {
                    me.$vs.loading.close()
                    if(res.data.status == 0){
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'warning',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle',
                            time:7000,
                        })
                        return;
                    }
                    me.getEvalDoc();
                    me.unidSelect = idunidades
                    me.agregarActivo = false
                    me.guardadoActivo = true
                    me.editarActivo = true
                    me.evaluacion.id = res.data.id
                    me.id_evaluacion = res.data.id
                    //me.popupEditEval = false
                    me.cant_gruposSelec = []
                    for (var i = 1; i <= me.grupo_selected.id; i++) {
                        me.cant_gruposSelec.push(i)
                    }
                    me.$vs.notify({
                        text: 'Evaluación guardada exitosamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.verTiposPreguntas()
                    //guardar historico
                    let h_idinstitucion = me.idInstitucionConsulta;
                    let h_idusuario = me.usuario.idusuario;
                    let h_idgrupo = me.usuario.id_group;
                    let h_idasignatura = me.local_idasignatura
                    let h_nombreasignatura = me.local_nombreasignatura
                    let h_recursotipo = 21; //21 =evaluaciones
                    let datoHistorico = null
                    me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)

                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + ' agregar');
                })

        },
        openConfirmEliminar(item) {
            let me = this;
            me.evalElimin = item
            me.activePromptEliminar = true;
        },
        eliminarEvaluacion() {
            let me = this;
            me.$http.get(this.$server_url + `eliminar_evaluacion/${me.evalElimin.id}`).then(res => {
                if (res.data === 0) {
                    me.$vs.notify({
                        text: 'No se puede eliminar esta evaluación porque ya esta siendo utilizada por sus estudiantes.',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                } else {
                    me.getEvalDoc()
                }
            })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'No se puede eliminar esta evaluación porque ya esta siendo utilizada por sus estudiantes!' + error,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },
        editarFormulario(item) {
            let me = this;
            me.cantidadesField = [0, 0, 0, 0, 0];
            me.radios1 = 1;
            me.asignaturaSelected = { id: item.id_asignatura, label: item.nombreasignatura };
            me.evaluacion.nombre_evaluacion = item.nombre_evaluacion;
            me.evaluacion.descripcion = item.descripcion;
            me.evaluacion.puntos = item.puntos;
            me.evaluacion.fecha_inicio = item.fecha_inicio;
            me.evaluacion.fecha_fin = item.fecha_fin;
            me.evaluacion.duracion = item.duracion;
            me.evaluacion.estado = item.estado;
            me.evaluacion.id = item.id;
            me.evaluacion.ver_calificaciones = item.ver_calificaciones
            me.evaluacion.codigo_evaluacion = item.codigo_evaluacion
            me.tipoevaluacionselect = { id: item.id_tipoeval, label: item.tipo_nombre };
            me.grupo_selected = { id: item.grupos_evaluacion, label: item.grupos_evaluacion + ' grupos' };
            me.cant_gruposSelec = []
            for (var i = 1; i <= me.grupo_selected.id; i++) {
                me.cant_gruposSelec.push(i)
            }
            me.editarActivo = true; //activa el form editar

            me.unidSelect = item.cant_unidades.split(',');
            me.cant_grupos_select = me.grupo_selected.id; //cantidad de grupos o filas de evaluaciones desde la base
            me.unidadSelected = [];
            for (var i = 0; i < me.unidSelect.length; i++) {
                me.unidadSelected.push({ id: me.unidSelect[i], label: 'Unidad ' + me.unidSelect[i] });
            }

            me.verPreguntasxEval(item.id);
            me.verEstudiantesEval();
        },
        openConfirmgrupo(item) {
            let me = this;
            this.popupEditEval = false;
            if (me.grupo_selected.id < me.cant_grupos_select) {
                me.textoConfirmgrup = 'Ha seleccionado un grupo menor de evaluaciones, las preguntas asignadas a los grupos restantes, se ocultarán'
            } else {
                me.textoConfirmgrup = 'Ha seleccionado un grupo mayor de evaluaciones, debe asignar preguntas a los nuevos grupos.';
            }
            me.activePromptGrupo = true;
        },
        editarEvaluacion(item) {
            let me = this;
            item = me.evaluacion;
            if(me.evaluacion.nombre_evaluacion.trim() === '') {
                me.$vs.notify({
                    text: 'El nombre de la evaluación no puede estar vacío o contener solo espacios en blanco',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }

            if (me.grupo_selected === '' || me.grupo_selected === null || me.grupo_selected === undefined) {
                me.$vs.notify({
                    text: 'Debe seleccionar la cantidad de grupos',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            if (me.evaluacion.fecha_inicio === '' || me.evaluacion.fecha_fin === '' || me.evaluacion.puntos === '' || me.evaluacion.duracion === '' || me.tipoevaluacionselect === null || me.tipoevaluacionselect === '' || me.grupo_selected.id === '') {
                me.$vs.notify({
                    text: 'Debe completar todos los campos antes de guardar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }


            let idunidades = [];
            for (var i = 0; i < this.unidadSelected.length; i++) {
                idunidades.push(this.unidadSelected[i].id);
            }

            me.$vs.loading()
            let estado;
            if (me.evaluacion.estado == true) {
                estado = 1;
            } else {
                estado = 0;
            }

            let descripVal = me.evaluacion.descripcion;
            if (me.evaluacion.descripcion === '' || me.evaluacion.descripcion === null || me.evaluacion.descripcion === 'null') {
                descripVal = ' '
            }

            let formData = new FormData();
            formData.append('id', item.id);
            formData.append('nombre_evaluacion', me.evaluacion.nombre_evaluacion);
            formData.append('asignatura', me.local_idasignatura);
            formData.append('descripcion', descripVal || '');
            formData.append('puntos', me.evaluacion.puntos);
            formData.append('duracion', me.evaluacion.duracion);
            formData.append('fecha_inicio', me.evaluacion.fecha_inicio);
            formData.append('fecha_fin', me.evaluacion.fecha_fin);
            formData.append('estado', estado);
            formData.append('docente', me.docente);
            formData.append('codigo', localStorage.codigo);
            formData.append('idtipoeval', me.tipoevaluacionselect.id);
            formData.append('id_grupo_opciones', me.grupo_selected.id);
            formData.append('cant_unidades', idunidades);
            formData.append('ver_calificaciones', me.evaluacion.ver_calificaciones)
            formData.append('codigo_evaluacion', me.evaluacion.codigo_evaluacion)
            me.$http.post(this.$server_url + 'evaluacion', formData)
            .then(res => {
                if(res.data.status == 0){
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time:7000,
                    })
                    return;
                }
                const index = me.evaluaciones.findIndex(
                evaluacionBuscar => evaluacionBuscar.id === res.data.id)
                me.evaluacion.codigo_evaluacion = res.data.codigo_evaluacion
                me.evaluacion[index] = res.data;
                me.getEvalDoc();
                me.editarActivo = false; //desactiva el form editar
                //me.popupEditEval = false
                me.cant_gruposSelec = []
                for (var i = 1; i <= me.grupo_selected.id; i++) {
                    me.cant_gruposSelec.push(i)
                }
                me.$vs.loading.close()
                me.$vs.notify({
                    text: 'Evaluación editada exitosamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                //guardar historico
                let h_idinstitucion = me.idInstitucionConsulta;
                let h_idusuario = me.docente;
                let h_idgrupo = 6;
                let h_idasignatura = me.local_idasignatura
                let h_nombreasignatura = me.local_nombreasignatura
                let h_recursotipo = 21; //21 =evaluaciones
                let datoHistorico = null
                me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            })
                .catch(function (error) {
                    console.log(error);
                })
        },
        verPreguntas() {
            let me = this;
            me.preguntas = [];
            // me.id_evaluacion = id;
            me.tipoSelected = '';
            me.$vs.loading()
            me.unidadesFiltrar = [];

            for (var i = 0; i < me.unidadSelected.length; i++) {
                me.unidadesFiltrar.push({ id: me.unidadSelected[i].id, label: 'Unidad ' + me.unidadSelected[i].id });
            }
            me.unidadSelectedFiltrar = { id: me.unidadSelected[0].id, label: 'Unidad ' + me.unidadSelected[0].id }
            me.filtrarPreguntasxUnidad()
        },
        cargarPregunta(item, index) {
            let me = this;
            me.$vs.loading()
            let formData = new FormData();
            formData.append('id_evaluacion', me.evaluacion.id);
            formData.append('id_pregunta', item.id);
            formData.append('grupo', me.radios1);
            me.$http.post(this.$server_url + 'pregEvaluacion', formData)
                .then(res => {


                    me.filtrarBancos()

                    /*if(me.unidadSelectedFiltrar==='' || me.unidadSelectedFiltrar===null || me.unidadSelectedFiltrar.id===undefined){
                        console.log('no hay preguntas para mostrar');
                    }else{
                        if( me.tipoSelected.id === '' || me.tipoSelected === null || me.tipoSelected.id === undefined){
                            me.filtrarPreguntasxUnidad()
                        }else{
                            me.filtrarTipos()
                        }
                    }*/

                    me.verPreguntasxEval(me.evaluacion.id);

                    me.$vs.notify({
                        text: 'Pregunta asignada a esta evaluación',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
                .catch(function (error) {
                    console.log(error);
                })
        },
        quitarPregunta(index, id) {
            let me = this;
            me.$vs.loading()
            me.$http.get(this.$server_url + `quitarPregEvaluacion/${id}`).then(() => {
                me.verPreguntasxEval(index.id_evaluacion);
            })
                .catch(function (error) {
                    console.log(error);
                })
        },
        backEndDateFormat: function (date) {
            return moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
        },
        removeItemFromArr(arr, item) {
            const i = arr.indexOf(item)
            arr.splice(i, 1)
        },
        irPreguntas() {
            if (this.id_evaluacion === '') {
                this.id_evaluacion = 0
            }

            localStorage.id_desde_eval = this.evaluacion.id
            localStorage.grupo_desde_eval = this.radios1
            localStorage.crea_desde_eval = true

            this.popupSelecPreg = false
            this.popupCrearPreguntas = true
            // window.location.href = this.urlOrigen+'/preguntas/'+this.id_evaluacion;
        },
        verCalificaciones() {
            let me = this;
            me.$vs.loading()
            me.$http.get(this.$server_url + `verCalificacionEval/${localStorage.codigo}`)
                .then(response => {
                    me.respuestas = []
                    var respuesta = response.data;
                    me.estudiantes = response.data;

                    if (response.data.length != 0) {
                        me.alumnos = response.data.items;
                        me.alumnos.forEach(element => {
                            var cal = new Object();
                            cal.idusuario = element.usuario_idusuario
                            cal.Cedula = element.cedula
                            cal.Estudiante = element.nombres + " " + element.apellidos
                            cal.calificaciones = new Object();
                            cal.ids = new Object();
                            for (let index = 0; index < element.total.length; index++) {
                                try {
                                    //   console.log("wu",element.calificaciones[index])
                                    if (element.calificaciones[index].calificacion === null) {
                                        element.calificaciones[index].calificacion = 0
                                        cal.calificaciones[index] = element.calificaciones[index].calificacion + '/' + element.calificaciones[index].puntos
                                        cal.ids[index] = element.calificaciones[index].id
                                    } else {
                                        cal.calificaciones[index] = element.calificaciones[index].calificacion + '/' + element.calificaciones[index].puntos
                                        cal.ids[index] = element.calificaciones[index].id
                                    }
                                    eval("cal.Evaluacion" + index + "=" + element.calificaciones[index].calificacion);

                                } catch (error) {
                                    element.calificaciones[index].calificacion = 0
                                    cal.calificaciones[index] = element.calificaciones[index].calificacion + '/' + element.calificaciones[index].puntos
                                    eval("cal.Evaluacion" + index + "=" + 0);
                                }
                            }
                            me.respuestas.push(cal)
                        });
                        // console.log("test",me.respuestas)
                    }
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })

            me.$http.get(this.$server_url + `verEvalCursoExport/${localStorage.codigo}`).then(res => {
                me.evaluacionestabla = res.data;
            })
                .catch(function (error) {
                    console.log(error);
                })

        },
        filtrarPreguntasxUnidad() {
            let me = this;
            if (me.unidadSelectedFiltrar === '' || me.unidadSelectedFiltrar === null || me.unidadSelectedFiltrar.id === undefined) {
                return;
            }
            me.bancoSelected = { id: '3', label: 'Ambas' }

            var tipo;
            if (me.tipoSelected === null || me.tipoSelected === '') {
                tipo = 'null'
            } else {
                tipo = me.tipoSelected.id
            }

            me.$vs.loading()
            const formData = new FormData();
            formData.append('evaluacion', me.id_evaluacion);
            formData.append('unidad', me.unidadSelectedFiltrar.id);
            formData.append('grupo', me.radios1);
            formData.append('tipo', tipo);
            formData.append('idusuario', me.usuario.idusuario)
            formData.append('usuario', me.usuario.idusuario)
            formData.append('id_group', me.usuario.id_group)
            formData.append('institucion_id', me.usuario.institucion_idInstitucion)
            formData.append('preguntasAll', 1)
            this.$http.post(this.$server_url + 'preguntasxunidad', formData).then(res => {
                me.preguntas = res.data;
                // console.log("uwu",me.preguntas)
                me.$vs.loading.close()
            })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })

        },
        filtrarTipos() {
            let me = this;
            if (me.unidadSelectedFiltrar === '' || me.unidadSelectedFiltrar === null || me.unidadSelectedFiltrar.id === undefined) {
                return;
            }

            if (me.tipoSelected === '' || me.tipoSelected === null || me.tipoSelected.id === undefined) {
                me.filtrarPreguntasxUnidad()
                return;
            }

            me.$vs.loading()
            const formData = new FormData();
            formData.append('evaluacion', me.id_evaluacion);
            formData.append('unidad', me.unidadSelectedFiltrar.id);
            formData.append('tipo', me.tipoSelected.id);
            formData.append('grupo', me.radios1);
            formData.append('idusuario', me.usuario.idusuario)
            formData.append('usuario', me.usuario.idusuario)
            formData.append('id_group', me.usuario.id_group)
            formData.append('institucion_id', me.usuario.institucion_idInstitucion)
            formData.append('preguntasAll', 1)
            me.$http.post(this.$server_url + 'preguntasxunidad', formData).then(res => {
                // me.$http.post(this.$server_url+'preguntasevaltipounidad', formData).then(res => {
                me.preguntas = res.data;
                // console.log("uwu2",me.preguntas)
                me.bancoSelected = {}
                me.$vs.loading.close()
            })
                .catch(function (error) {
                    console.log(error);
                })

        },
        verPreguntasxEval(id_evaluacion) {
            let me = this;
            me.verTiposPreguntas()
            let formData = new FormData();
            formData.append('evaluacion', id_evaluacion);
            formData.append('grupo', me.radios1);
            me.$vs.loading()
            me.$http.post(this.$server_url + `pregEvaluacionGrupo`, formData).then(res => {
                me.preguntasEvaluaciones = res.data;
                if (me.preguntasEvaluaciones.items === undefined) {
                    console.log('no existen preguntas para el grupo seleccionado');
                } else {
                    me.puntajeTotalGrupo = 0;
                    for (var i = 0; i < me.preguntasEvaluaciones.items.length; i++) {
                        me.puntajeTotalGrupo += me.preguntasEvaluaciones.items[i].puntaje_pregunta;
                    }
                }
                me.$vs.loading.close()
            })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error + 'verPreguntasxEval');
                })
        },
        verEstudiantesEval() {
            let me = this;
            me.$vs.loading()
            me.$http.get(this.$server_url + `verEstCursoEval/${localStorage.codigo}`).then(res => {
                me.estudiantesEval = res.data;
                me.$vs.loading.close()
            })
                .catch(function (error) {
                    console.log(error);
                })
        },
        asignarGrupoEst(item) {
            let me = this;
            let formData = new FormData();
            formData.append('estudiante', item.idusuario);
            formData.append('grupo', item.grupo);
            formData.append('codigo', localStorage.codigo);
            me.$http.post(this.$server_url + `asignarGrupoEst`, formData).then(res => {
            })
                .catch(function (error) {
                    console.log(error);
                })
        },
        irRevision(item, val) {
            localStorage.removeItem('nombresImprimir')
            localStorage.setItem('id_evalRevisar', item.id);
            localStorage.setItem('previsualizar_eval', val);
            //this.$router.push('/revisarevaluacion')

            window.location.href = this.urlOrigen + '/revisarevaluacion';
        },
        contarPuntosIngresados() {
            let me = this
            me.puntajeIngresado = 0;
            var cantField = 0;
            for (var i = 0; i < me.cantidadesField.length; i++) {
                if (Number.isNaN(parseInt(me.cantidadesField[i]))) {
                    cantField = 0;
                } else {
                    cantField = parseInt(me.cantidadesField[i])
                }
                me.puntajeIngresado += (me.puntajetipo[i] * parseInt(cantField))
            }
        },
        cargarPreguntasAleatorias() {
            let me = this
            me.puntajeIngresado = 0;
            var cantField = 0;
            for (var i = 0; i < me.cantidadesField.length; i++) {

                if (Number.isNaN(parseInt(me.cantidadesField[i]))) {
                    cantField = 0;
                } else {
                    cantField = parseInt(me.cantidadesField[i])
                }
                me.puntajeIngresado += (me.puntajetipo[i] * parseInt(cantField))
            }

            if (me.puntajeIngresado <= 0) {
                return
            }

            if (me.puntajeIngresado > me.evaluacion.puntos || (me.puntajeTotalGrupo + me.puntajeIngresado) > me.evaluacion.puntos) {
                me.$vs.notify({
                    text: 'El puntaje de las preguntas excede al puntaje de esta evaluación',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            me.$vs.loading()
            let cantidad = me.cantidadesField
            let unidades = []

            for (var i = 0; i < me.unidadSelected.length; i++) {
                unidades.push(me.unidadSelected[i].id)
            }

            let formData = new FormData();
            formData.append('evaluacion', me.evaluacion.id);
            formData.append('puntos', me.evaluacion.puntos);
            formData.append('grupos', me.grupo_selected.id);
            formData.append('cant_pregs', cantidad);
            formData.append('unidades', unidades);
            formData.append('tipos', me.tiposPregAl);
            formData.append('usuario', me.usuario.idusuario);
            formData.append('id_group', me.usuario.id_group);
            formData.append('institucion_id', me.usuario.institucion_idInstitucion);
            me.$http.post(this.$server_url + `cargarPregsRand`, formData).then(res => {
                me.popupEvalAleatoria = false
                me.verPreguntasxEval(me.evaluacion.id)
                me.$vs.notify({
                    text: 'Preguntas cargadas correctamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                me.cantidadesField = [0, 0, 0, 0, 0]
                me.puntajeIngresado = 0
                me.$vs.loading.close()
            })
                .catch(function (error) {
                    console.log(error);
                })
        },
        filtrarBancos() {
            let me = this
            if (me.unidadSelectedFiltrar === '' || me.unidadSelectedFiltrar === null || me.unidadSelectedFiltrar.id === undefined) {
                return;
            }

            if (me.bancoSelected === null) {
                var bancoSel = 3
            } else {
                var bancoSel = me.bancoSelected.id;
            }

            switch (bancoSel) {
                case '1':
                    me.filtrarxProlipa()
                    break;
                case '2':
                    me.filtrarxDocente()
                    break;
                default:
                    me.filtrarPreguntasxUnidad()
            }

        },
        filtrarxDocente() {
            let me = this
            me.$vs.loading()
            var tipo;
            if (me.tipoSelected === null || me.tipoSelected === '') {
                tipo = 'null'
            } else {
                tipo = me.tipoSelected.id
            }
            const formData = new FormData();
            formData.append('evaluacion', me.id_evaluacion);
            formData.append('unidad', me.unidadSelectedFiltrar.id);
            formData.append('grupo', me.radios1);
            formData.append('usuario', me.usuario.idusuario);
            formData.append('tipo', tipo);
            formData.append('id_group', me.usuario.id_group);
            formData.append('institucion_id', me.usuario.institucion_idInstitucion);
            formData.append('preguntasDocentes', 1);
            me.$http.post(this.$server_url + 'preguntasxunidad', formData).then(res => {
                // me.$http.post(this.$server_url+'preguntasxbancoDocente', formData).then(res => {
                me.preguntas = res.data
                console.log("uwu3", me.preguntas.items.filter(p => p.id_tema == 41))
                me.$vs.loading.close()
            })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
        },
        filtrarxProlipa() {
            let me = this
            me.$vs.loading()
            var tipo;
            if (me.tipoSelected === null || me.tipoSelected === '') {
                tipo = 'null'
            } else {
                tipo = me.tipoSelected.id
            }
            const formData = new FormData();
            formData.append('evaluacion', me.id_evaluacion);
            formData.append('unidad', me.unidadSelectedFiltrar.id);
            formData.append('usuario', me.usuario.idusuario);
            formData.append('grupo', me.radios1);
            formData.append('tipo', tipo);
            formData.append('id_group', me.usuario.id_group);
            formData.append('institucion_id', me.usuario.institucion_idInstitucion);
            formData.append('preguntasProlipa', 1);
            me.$http.post(this.$server_url + 'preguntasxunidad', formData).then(res => {
                // me.$http.post(this.$server_url+'preguntasxbancoProlipa', formData).then(res => {
                me.preguntas = res.data;
                console.log("uwu4")
                me.$vs.loading.close()
            })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
        },
        copiarLink(item) {
            let me = this
            let date = new Date()
            let fecha_actual = moment(date, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss')

            //if( fecha_actual < item.fecha_inicio || fecha_actual > item.fecha_fin ){
            if (fecha_actual > item.fecha_fin) {
                me.$vs.notify({
                    text: 'Esta evaluación aún no está disponible. Verifique las fechas de inicio y fin.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }

            if (item.estado != 1) {
                me.$vs.notify({
                    text: 'Esta evaluación está inactiva',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }


            let link = me.urlOrigen + '/responderEvaluacion/' + item.id + '-' + localStorage.codigo + '-' + me.idInstitucionConsulta
            var aux = document.createElement("input");
            aux.setAttribute("value", link);
            document.body.appendChild(aux);
            aux.select();

            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({
                        text: 'Error al copiar el link',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                } else {
                    me.$vs.notify({
                        text: 'Link copiado',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }

            document.body.removeChild(aux);
        },
        verTiposPreguntas() {
            let me = this
            me.ifNoExistePreguntas = false
            let v_unidades = []
            $.each(me.unidadSelected, function (key, value) {
                v_unidades.push(value.id)
            });

            me.$http.get(this.$server_url + 'tipospreguntas/' + localStorage.idasignatura + '/' + v_unidades + '/' + me.usuario.id_group + '/' + me.usuario.institucion_idInstitucion)
                .then(res => {
                    me.tipospreguntas = res.data

                    // Verifica si todos tienen cantidad igual a 0
                    me.ifNoExistePreguntas = me.tipospreguntas.every(item => item.cantidad == 0)
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
    },
}
</script>
