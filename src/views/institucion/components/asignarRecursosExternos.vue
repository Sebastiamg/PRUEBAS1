<template>
    <div>
        <div class="flex">
            <div v-if="verUsuarios == false">
                <vs-button color="success" v-if="addPermisos == false" @click="$emit('regresar',0)" icon="reply" type="filled">Regresar</vs-button>
                <vs-button color="success" v-else @click="addPermisos = false" icon="reply" type="filled">Regresar</vs-button>
            </div>
            <div v-if="addPermisos == false">
                <vs-button color="primary" v-if="verUsuarios == false" @click="verUsuarios = true" class="ml-2" icon="people" type="filled">Usuarios externos</vs-button>
                <vs-button color="success" v-else @click="verUsuarios = false" icon="reply" type="filled">Regresar</vs-button>    
            </div>
        </div>
        <vs-alert active="true" color="warning" class="mt-4">
             <p>!Asignar permisos externos a la institucion <span style="font-weight: bold;">{{ permisosNombreInstitucion }}</span></p>   
        </vs-alert>
        <div v-if="addPermisos" class="mt-5">
          <!--PERMISOS DEL ACORDEON-->
            <vs-card>
                <label style="font-weight: bold;">Permisos del acordeón del libro: <span>{{ nombreasignatura }}</span> </label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-2  text-center">
                        Libro  
                    </div>
                    <div class="w-1/3 p-2  text-center">
                        <vs-radio v-model="acordeon.libro" vs-name="acordeonlibro" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="acordeon.libro" class="ml-2" vs-name="acordeonlibro" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-2  text-center">
                        Cursos  
                    </div>
                    <div class="w-1/3 p-2  text-center">
                        <vs-radio v-model="acordeon.curso" vs-name="acordeoncurso" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="acordeon.curso" class="ml-2" vs-name="acordeoncurso" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-2  text-center">
                        Cuadernos 
                    </div>
                    <div class="w-1/3 p-2  text-center">
                        <vs-radio v-model="acordeon.cuaderno" vs-name="acordeoncuaderno" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="acordeon.cuaderno" class="ml-2" vs-name="acordeoncuaderno" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-2  text-center">
                        Planificaciones
                    </div>
                    <div class="w-1/3 p-2  text-center">
                        <vs-radio v-model="acordeon.planificacion" vs-name="acordeonplanificacion" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="acordeon.planificacion" class="ml-2" vs-name="acordeonplanificacion" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-2  text-center">
                        Recursos adicionales
                    </div>
                    <div class="w-1/3 p-2  text-center">
                        <vs-radio v-model="acordeon.recursos_adicional" vs-name="acordeonrecursos_adicional" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="acordeon.recursos_adicional" class="ml-2" vs-name="acordeonrecursos_adicional" vs-value="0">No </vs-radio>   
                    </div>
                </div>
            </vs-card>
            <!--FIN PERMISOS DEL ACORDEON-->
            <!--PERMISOS DEL LIBRO-->
            <vs-card v-if="acordeon.libro == '1'">
                <label style="font-weight: bold;">Asignar permisos al libro: <span>{{ nombreasignatura }}</span> </label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-2  text-center">
                         Libro web   
                    </div>
                    <div class="w-1/3 p-2  text-center">
                        <vs-radio v-model="libro.libroweb" vs-name="libroweb" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="libro.libroweb" class="ml-2" vs-name="libroweb" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4" v-if="libro.libroweb == '1'">
                    <div class="w-1/3 p-2  text-center">
                        Mostrar todo el libro
                    </div>
                    <div class="w-1/3 p-2  text-center" >
                        <vx-tooltip style="display: inline-block;" text="Generar link de libro" position="top" color="dark">
                            <vs-radio v-model="libro.todo"  :class="[libro.todo == '1' ? '' : 'margin-left:43px']" vs-name="librotodo" vs-value="1">Si </vs-radio>
                            <vs-radio v-model="libro.todo" class="ml-2" vs-name="librotodo" vs-value="0">No </vs-radio>  
                            <vs-button size="small" v-if="libro.todo == '0'"  style="display: inline-block;" class="p-2 ml-5" icon-pack="feather" icon="icon-link" color="dark" @click="getLinksLibros(); popupLinkLibro=true;"></vs-button>
                        </vx-tooltip>
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-2  text-center">
                         Libro con guia   
                    </div>
                    <div class="w-1/3 p-2  text-center">
                        <vs-radio v-model="libro.libro_con_guia" vs-name="libro_con_guia" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="libro.libro_con_guia" class="ml-2" vs-name="libro_con_guia" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-2  text-center">
                         Libro guia didactica 
                    </div>
                    <div class="w-1/3 p-2  text-center">
                        <vs-radio v-model="libro.guia_didactica" vs-name="guia_didactica" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="libro.guia_didactica" class="ml-2" vs-name="guia_didactica" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-2  text-center">
                        Unidades
                    </div>
                    <div class="w-1/3 p-2  text-center">
                        <vs-radio v-model="libro.unidades" vs-name="unidades" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="libro.unidades" class="ml-2" vs-name="unidades" vs-value="0">No </vs-radio>   
                    </div>
                </div>
            </vs-card>
            <!--FIN PERMISOS DEL LIBRO-->
            <!--PERMISOS DE CURSOS-->
            <vs-card v-if="acordeon.curso == '1'">
                <label style="font-weight: bold;">Asignar permisos a los cursos</label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                        Ver curso  
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="curso.ver" vs-name="cver" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="curso.ver" class="ml-2" vs-name="cver" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                        Agregar curso   
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="curso.agregar" vs-name="cagregar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="curso.agregar" class="ml-2" vs-name="cagregar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                        Editar curso
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="curso.editar" vs-name="ceditar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="curso.editar" class="ml-2" vs-name="ceditar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                        Eliminar curso
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="curso.eliminar" vs-name="celiminar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="curso.eliminar" class="ml-2" vs-name="celiminar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
            </vs-card>
            <!--FIN PERMISOS DE CURSOS-->
            <!--PERMISOS DE CUADERNOS-->
            <vs-card v-if="acordeon.cuaderno == '1'">
                <label style="font-weight: bold;">Asignar permisos a los cuadernos</label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                        Pdf con guia 
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="cuaderno.guia" vs-name="cguia" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="cuaderno.guia" class="ml-2" vs-name="cguia" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                       Guia didáctica
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="cuaderno.didactica" vs-name="cdidactica" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="cuaderno.didactica" class="ml-2" vs-name="cdidactica" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                        Cuaderno web
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="cuaderno.web" vs-name="cweb" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="cuaderno.web" class="ml-2" vs-name="cweb" vs-value="0">No </vs-radio>   
                    </div>
                </div>
            </vs-card>
            <!--FIN PERMISOS DE CUADERNOS-->
            <!--PERMISOS DE PLANIFICACIONES-->
            <vs-card v-if="acordeon.planificacion == '1'">
                <label style="font-weight: bold;">Asignar permisos a los planificaciones</label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                        Descargar planificación 
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="planificacion.descargar" vs-name="pdescargar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="planificacion.descargar" class="ml-2" vs-name="pdescargar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                       Visualizar planificación
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="planificacion.visualizar" vs-name="pvisualizar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="planificacion.visualizar" class="ml-2" vs-name="pvisualizar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
            </vs-card>
            <!--FIN PERMISOS DE PLANIFICACIONES-->
            <!--==========================================RECURSOS ADICIONALES===================================================================-->
            <vs-divider>Recurso adicionales</vs-divider>
            <div v-if="acordeon.recursos_adicional == '1'">
            <!--PERMISOS DE ZONA DE DIVERSION(MIS JUEGOS)-->
            <vs-card>
                <label style="font-weight: bold;">Asignar permisos a zona de diversión(Mis juegos)</label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Crear juego
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="mijuego.agregar" vs-name="mijuego_agregar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="mijuego.agregar" class="ml-2" vs-name="mijuego_agregar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Editar juego
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="mijuego.editar" vs-name="mijuego_editar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="mijuego.editar" class="ml-2" vs-name="mijuego_editar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Eliminar juego
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="mijuego.eliminar" vs-name="mijuego_eliminar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="mijuego.eliminar" class="ml-2" vs-name="mijuego_eliminar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Ver Calificaciones
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="mijuego.ver" vs-name="mijuego_ver" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="mijuego.ver" class="ml-2" vs-name="mijuego_ver" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Asignar a curso
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="mijuego.asignar" vs-name="mijuego_asignar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="mijuego.asignar" class="ml-2" vs-name="mijuego_asignar" vs-value="0">No </vs-radio>   
                    </div>
                </div> 
            </vs-card>
            <!--FIN PERMISOS DE DIVERSION(MIS JUEGOS)-->
            <!--PERMISOS DE ZONA DE DIVERSION(JUEGOS PROLIPA)-->
            <vs-card>
                <label style="font-weight: bold;">Asignar permisos a zona de diversión(Juegos Prolipa)</label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Asignar a curso
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="juegoProlipa.asignar" vs-name="juegoProlipa_asignar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="juegoProlipa.asignar" class="ml-2" vs-name="juegoProlipa_asignar" vs-value="0">No </vs-radio>   
                    </div>
                </div> 
                 <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Ver Calificaciones
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="juegoProlipa.ver" vs-name="juegoProlipa_ver" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="juegoProlipa.ver" class="ml-2" vs-name="juegoProlipa_ver" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Previsualizar juego
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="juegoProlipa.previsualizar" vs-name="juegoProlipa_previsualizar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="juegoProlipa.previsualizar" class="ml-2" vs-name="juegoProlipa_previsualizar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
               
            </vs-card>
            <!--FIN PERMISOS DE DIVERSION(JUEGOS PROLIPA)-->
            <!--PERMISOS PARA MATERIAL DE APOYO(Material)-->
            <vs-card>
                <label style="font-weight: bold;">Asignar permisos a Material Apoyo(Material digital)</label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Ver temas
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="materialDigital.ver" vs-name="materialDigital_ver" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="materialDigital.ver" class="ml-2" vs-name="materialDigital_ver" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Previsualizar Material
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="materialDigital.previsualizar" vs-name="materialDigital_previsualizar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="materialDigital.previsualizar" class="ml-2" vs-name="materialDigital_previsualizar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Asignar a curso
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="materialDigital.asignar" vs-name="materialDigital_asignar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="materialDigital.asignar" class="ml-2" vs-name="materialDigital_asignar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
            </vs-card>
            <!--FIN PERMISOS PARA MATERIAL DE APOYO(Material)-->
            <!--PERMISOS PARA MATERIAL DE APOYO(Material pdf/archivos)-->
            <vs-card>
                <label style="font-weight: bold;">Asignar permisos a Material Apoyo(Material pdf/archivos)</label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Subir archivos
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="materialpdf.subir" vs-name="materialpdf_subir" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="materialpdf.subir" class="ml-2" vs-name="materialpdf_subir" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Ver Temas
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="materialpdf.ver" vs-name="materialpdf_ver" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="materialpdf.ver" class="ml-2" vs-name="materialpdf_ver" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Descargar
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="materialpdf.descargar" vs-name="materialpdf_descargar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="materialpdf.descargar" class="ml-2" vs-name="materialpdf_descargar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                    Asignar a curso
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="materialpdf.asignar" vs-name="materialpdf_asignar" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="materialpdf.asignar" class="ml-2" vs-name="materialpdf_asignar" vs-value="0">No </vs-radio>   
                    </div>
                </div>
            </vs-card>
            <!--FIN PERMISOS PARA MATERIAL DE APOYO(Material pdf/archivos)-->
            <!--PERMISOS PARA PROPUESTAS METODOLÓGICAS-->
            <vs-card>
                <label style="font-weight: bold;">Asignar permisos a Propuestas Metodológicas</label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                     Ver Contenido
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="propuesta.ver" vs-name="propuesta_ver" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="propuesta.ver" class="ml-2" vs-name="propuesta_ver" vs-value="0">No </vs-radio>   
                    </div>
                </div>
            </vs-card>
            <!--FIN PERMISOS PARA PROPUESTAS METODOLÓGICAS-->
            <!--PERMISOS PARA ADAPTACIONES CURRICULARES-->
            <vs-card>
                <label style="font-weight: bold;">Asignar permisos a Adaptaciones Curriculares</label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                     Ver Contenido
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="adaptacion.ver" vs-name="adaptacion_ver" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="adaptacion.ver" class="ml-2" vs-name="adaptacion_ver" vs-value="0">No </vs-radio>   
                    </div>
                </div>
            </vs-card>
            <!--FIN PERMISOS PARA ADAPTACIONES CURRICULARES-->
            <!--PERMISOS PARA ARTICULOS-->
            <vs-card>
                <label style="font-weight: bold;">Asignar permisos a Artículos</label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                     Lengua
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="articulo.lengua" vs-name="articulo_lengua" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="articulo.lengua" class="ml-2" vs-name="articulo_lengua" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                     Matemática
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="articulo.matematica" vs-name="articulo_matematica" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="articulo.matematica" class="ml-2" vs-name="articulo_matematica" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                     Ciencias Naturales
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="articulo.naturales" vs-name="articulo_naturales" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="articulo.naturales" class="ml-2" vs-name="articulo_naturales" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                     Ciencias Sociales
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="articulo.sociales" vs-name="articulo_sociales" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="articulo.sociales" class="ml-2" vs-name="articulo_sociales" vs-value="0">No </vs-radio>   
                    </div>
                </div>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                     Enseñanza educación
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="articulo.ensenanza" vs-name="articulo_ensenanza" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="articulo.ensenanza" class="ml-2" vs-name="articulo_ensenanza" vs-value="0">No </vs-radio>   
                    </div>
                </div>
            </vs-card>
            <!--FIN PERMISOS PARA ARTICULOS-->
            <!--PERMISOS PARA DOCUMENTOS MINESTERIALES-->
            <vs-card>
                <label style="font-weight: bold;">Asignar permisos a Documentos Minesteriales</label>
                <div class="flex mb-4">
                    <div class="w-1/3 p-1  text-center">
                     Ver Publicación
                    </div>
                    <div class="w-1/3 p-1  text-center">
                        <vs-radio v-model="documentom.ver" vs-name="documentom_ver" vs-value="1">Si </vs-radio>
                        <vs-radio v-model="documentom.ver" class="ml-2" vs-name="documentom_ver" vs-value="0">No </vs-radio>   
                    </div>
                </div>
            </vs-card>
            <!--FIN PERMISOS PARA DOCUMENTOS MINESTERIALES-->
            </div>
            <!--==========================================FIN RECURSOS ADICIONALES===================================================================-->
            <vs-row>
              <vs-button @click="agregaAsignacion()" class="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 border-b-4 border-blue-700 hover:border-blue-500 rounded" type="filled">
                Guardar Permisos
              </vs-button>
            </vs-row>
        </div>
        <div v-if="addPermisos == false && verUsuarios == false">
            <div class="m-2">
                <vs-divider color="success">Libros seleccionadas ( {{seleccionadas.length}} ) </vs-divider>
                <vs-collapse>
                    <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down">
                        <div slot="header">
                            Ver ( {{seleccionadas.length}} )
                        </div>
                        <div class="vx-row">
                            <div class="vx-col sm:w-full text-right" v-if="seleccionadas.length >1">
                                <!-- <vs-button type="border" color="danger" size="small" @click="confirmaQuitar()">Quitar todas <span class="feather icon icon-trash"></span></vs-button> -->
                            </div>
                            <div class="vx-col sm:w-full">
                                <div v-for="(item, index) in seleccionadas" :key="index" class="m-1 p-1 asig-select text-dark">
                                    {{item.nombreasignatura}} &nbsp; &nbsp;
                                    <vs-button @click="update=true;openModalEditarPermisos(item)"  style="display:inline" size="small" color="primary" radius type="border" icon-pack="feather" icon="icon-edit"></vs-button>
                                    <vs-button @click="eliminaAsignacionColegio(item)" style="display:inline" size="small" color="danger" radius type="border" icon-pack="feather" icon="icon-trash"></vs-button>
                                </div>
                            </div>
                        </div>
                    </vs-collapse-item>
                </vs-collapse>
            </div>
            <div class="m-2">
                <vs-divider color=primary> Areas ( {{area.length}} ) </vs-divider>
                <vs-collapse>
                    <vs-collapse-item icon-pack="feather" icon-arrow="icon-arrow-down" v-for="(listItem, index) in area" :key="index" :title="listItem.name">
                        <div slot="header">
                            {{listItem.name}}
                        </div>
                        <vs-button v-for="(listIAsig, indexAsig) in listItem.children" :key="indexAsig" type="border" color="primary" class="p-2 m-1" @click="openModalPermisos(listIAsig)">
                            {{listIAsig.name}}
                        </vs-button>
                    </vs-collapse-item>
                </vs-collapse>
            </div>   
        </div>
        <div v-if="verUsuarios" class="mt-2">
            <usuarioRecursosExternosVue :institucion_id ="institucion_id"/>
        </div>
        <!--MODALES-->
        <!--MODAL PARA GENERAR LINK-->
        <vs-popup fullscreen title="Generar link" :active.sync="popupLinkLibro">
            <div class="vx-row mb-base p-3">
                <div class="vx-col sm:w-1/2 w-full mb-3">
                <vs-input type="number" class="w-full" label="Página inicio" v-model="link.pag_ini" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                <vs-input type="number" class="w-full" label="Página fin" v-model="link.pag_fin" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                <div style="color: gray; font-size: 12px;">Fecha inicio</div>
                <flat-pickr class="w-full" :config="configdateTimePicker" v-model="link.fecha_inicio" />
                </div>
                <div class="vx-col sm:w-1/2 w-full mb-3">
                <div style="color: gray; font-size: 12px;">Fecha caducidad</div>
                <flat-pickr class="w-full" :config="configdateTimePicker" v-model="link.fecha_caducidad" />
                </div>
                <div class="vx-col w-full">
                <vs-button @click="guardarLink()">Guardar link</vs-button>
                </div>
            </div>
            <vs-divider></vs-divider>
            <vs-table max-items="10" stripe search pagination :data="links" class="mb-3">
                <template slot="thead">
                    <vs-th>#</vs-th>
                    <vs-th>Pág inicio</vs-th>
                    <vs-th>Pág fin</vs-th>
                    <vs-th>Fecha inicio</vs-th>
                    <vs-th>Fecha fin</vs-th>
                    <vs-th>Recurso externo</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td> {{indextr+1}} </vs-td>
                        <vs-td> {{data[indextr].pag_ini}} </vs-td>
                        <vs-td> {{data[indextr].pag_fin}} </vs-td>
                        <vs-td> {{data[indextr].fecha_ini}} </vs-td>
                        <vs-td> {{data[indextr].fecha_fin}} </vs-td>
                        <vs-td> 
                            <div v-if="tr.recurso_externo == '0'">
                                <vs-chip color="warning">No</vs-chip>   
                            </div>
                            <div v-else>
                                <vs-chip color="warning">Si</vs-chip><br><br>
                                <small>Asignado a {{ tr.nombreInstitucion }}</small>
                            </div>     
                        </vs-td>
                        <vs-td align="center">
                            <vx-tooltip style="display: inline-block;" text="Copiar link" position="top" color="success">
                                <vs-button size="small" class="modal-default-button" color="success" @click="copiarLink(data[indextr])" type="line" icon-pack="feather" icon="icon-copy"> </vs-button>
                            </vx-tooltip>
                        </vs-td>
                    </vs-tr>
                </template>
            </vs-table>
        </vs-popup>
    </div>
</template>
<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import usuarioRecursosExternosVue from './usuarioRecursosExternos.vue';
export default {
    data() {
       return{
          institucion_id:0,
          area:[],
          seleccionadas:[],
          addPermisos:false,
          verUsuarios:false,
          id:0,
          radicional_id:0,
          asignatura_id:'',
          nombreasignatura:'',
          acordeon:{
            libro:'1',
            curso:'1',
            cuaderno:'1',
            planificacion:'1',
            recursos_adicional:'1',
          },
          libro:{
            libroweb:'1',
            libro_con_guia:'1',
            guia_didactica:'1',
            unidades:'1',
            todo:'1',
          },
          curso:{
            ver:'1',
            agregar:'1',
            editar:'1',
            eliminar:'1',
          },
          cuaderno:{
            guia:'1',
            didactica:'1',
            web:'1',
          },
          planificacion:{
            descargar:'1',
            visualizar:'1',
          },
          //variables para recursos adicionales
          mijuego:{
            agregar:'1',
            editar:'1',
            eliminar:'1',
            ver:'1',
            asignar:'1',
          },
          juegoProlipa:{
            asignar:'1',
            ver:'1',
            previsualizar:'1',
          },
          materialDigital:{
            ver:'1',
            previsualizar:'1',
            asignar:'1',
          },
          materialpdf:{
            subir:'1',
            ver:'1',
            descargar:'1',
            asignar:'1',
          },
          propuesta:{
            ver:'1',
          },
          adaptacion:{
            ver:'1',
          },
          articulo:{
            lengua:'1',
            matematica:'1',
            naturales:'1',
            sociales:'1',
            ensenanza:'1',
          },
          documentom:{
            ver:'1',
          },
          //fin de variables para recursos adicionales
          //VARIABLES PARA GENERAR LINK
          libro_id:'',
          libro_web:'',
          links:[],
          popupLinkLibro:false,
          link:{
            pag_ini: '',
            pag_fin: '',
            fecha_inicio: '',
            fecha_caducidad: '',
          },
          configdateTimePicker: {
              enableTime: true,
              dateFormat: 'Y-m-d H:i:s'
          },
          //fin variable para generar link
       } 
    },
    components:{
        usuarioRecursosExternosVue,
        flatPickr
    },
    props:{
        permisosInstitucion:{
            type:String,
            default:0
        },
        permisosNombreInstitucion:{
            type:String,
            default:""
        }
    },
    mounted(){
        let me = this;
        me.getAreaSelect();
        me.getSeleccionadasColegios();
        me.institucion_id = me.permisosInstitucion
    },
    methods:{
         getAreaSelect() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + "selectArea").then(function (response) {
                me.area = response.data.items;
                me.$vs.loading.close();
            });
        },
        getSeleccionadasColegios() {
            let me = this;
            me.seleccionadas = []
            me.$vs.loading();
            this.$http.get(this.$server_url + "asignaturas_x_colegio?institucion_id="+me.permisosInstitucion)
                .then(res => {
                    let datos = res.data
                    console.log('rr',res.data)
                    for(let i = 0; i<datos.length; i++){
                        me.seleccionadas.push({
                            "id":datos[i].id,
                            "nombreasignatura":datos[i].nombreasignatura,
                            "idasignatura":datos[i].idasignatura,
                            "area_idarea":datos[i].area_idarea,
                            "institucion_id":datos[i].institucion_id,
                            "asignatura_id":datos[i].asignatura_id,
                            "permisos_acordeon":JSON.parse(datos[i].permisos_acordeon),
                            "permisos_libros":JSON.parse(datos[i].permisos_libros),
                            "permisos_cursos":JSON.parse(datos[i].permisos_cursos),
                            "permisos_cuadernos":JSON.parse(datos[i].permisos_cuadernos),
                            "permisos_planificaciones":JSON.parse(datos[i].permisos_planificaciones),
                            "zona_diversion_mi_juego":JSON.parse(datos[i].zona_diversion_mi_juego),
                            "zona_diversion_juego_prolipa":JSON.parse(datos[i].zona_diversion_juego_prolipa),
                            "material_apoyo_digital":JSON.parse(datos[i].material_apoyo_digital),
                            "material_apoyo_pdf":JSON.parse(datos[i].material_apoyo_pdf),
                            "propuestas_metodologicas":JSON.parse(datos[i].propuestas_metodologicas),
                            "adaptaciones":JSON.parse(datos[i].adaptaciones),
                            "articulos":JSON.parse(datos[i].articulos),
                            "documentos_ministeriales":JSON.parse(datos[i].documentos_ministeriales),
                            "radicional_id":datos[i].radicional_id
                        })
                    }
                    me.$vs.loading.close();
                })
                .catch(function(e){
                    me.$vs.loading.close();
                });
        },
        openModalPermisos(item){
            let me = this;
            me.id               = 0
            me.radicional_id    = 0
            me.addPermisos      = true
            me.asignatura_id    = item.id
            me.nombreasignatura = item.name
            me.libro_id         = item.idlibro
            me.libro_web       =  item.weblibro
        },
        openModalEditarPermisos(tr){
            let me                      = this;
            me.id                       = tr.id
            me.radicional_id            = tr.radicional_id
            me.nombreasignatura         = tr.nombreasignatura
            me.asignatura_id            = tr.idasignatura
            me.acordeon                 = tr.permisos_acordeon
            me.libro                    = tr.permisos_libros
            me.curso                    = tr.permisos_cursos
            me.cuaderno                 = tr.permisos_cuadernos
            me.planificacion            = tr.permisos_planificaciones
            //data de los recursos adicionales
            me.mijuego                  = tr.zona_diversion_mi_juego
            me.juegoProlipa             = tr.zona_diversion_juego_prolipa 
            me.materialDigital          = tr.material_apoyo_digital 
            me.materialpdf              = tr.material_apoyo_pdf 
            me.propuesta                = tr.propuestas_metodologicas 
            me.adaptacion               = tr.adaptaciones 
            me.articulo                 = tr.articulos 
            me.documentom               = tr.documentos_ministeriales 
            me.addPermisos              = true
        },
        agregaAsignacion() {
            let me = this;
            let data = new FormData();
            data.append('id',                               me.id)
            data.append('radicional_id',                    me.radicional_id)
            data.append('institucion_id',                   me.permisosInstitucion)
            data.append('asignatura_id',                    me.asignatura_id)
            data.append('permisos_acordeon',                JSON.stringify(me.acordeon))
            data.append('permisos_libros',                  JSON.stringify(me.libro))
            data.append('permisos_cursos',                  JSON.stringify(me.curso))
            data.append('permisos_cuadernos',               JSON.stringify(me.cuaderno))
            data.append('permisos_planificaciones',         JSON.stringify(me.planificacion))
            //data de los recursos adicionales
            data.append('zona_diversion_mi_juego',          JSON.stringify(me.mijuego))
            data.append('zona_diversion_juego_prolipa',     JSON.stringify(me.juegoProlipa))
            data.append('material_apoyo_digital',           JSON.stringify(me.materialDigital))
            data.append('material_apoyo_pdf',               JSON.stringify(me.materialpdf))
            data.append('propuestas_metodologicas',         JSON.stringify(me.propuesta))
            data.append('adaptaciones',                     JSON.stringify(me.adaptacion))
            data.append('articulos',                        JSON.stringify(me.articulo))
            data.append('documentos_ministeriales',         JSON.stringify(me.documentom))
            this.$http.post(this.$server_url + "asignar_asignatura_colegio", data)
                .then(function (res) {
                    // console.log(res.data);
                    if (res.data > 0) {
                        me.$vs.notify({
                            time: 7000,
                            text: 'Esta asignatura ya se encuentra asignada a la institución',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        me.$vs.notify({
                            text: 'Asignatura agregada a la institución',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.getSeleccionadasColegios()
                        me.addPermisos = false 
                        me.limpiar()
                    }
                    me.$vs.loading.close();
                });
        },
        eliminaAsignacionColegio(item) {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + "eliminaAsignacionColegio/" + item.id)
                .then(function (res) {
                    me.$vs.notify({
                        text: item.nombreasignatura + ' eliminada',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    me.getSeleccionadasColegios() 
                    me.$vs.loading.close();
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        limpiar(){
            let me = this
            me.id                               = 0
            me.asignatura_id                    = ""
            me.nombreasignatura                 = ""
            me.acordeon.libro                   = "1"
            me.acordeon.curso                   = "1"
            me.acordeon.cuaderno                = "1"
            me.acordeon.planificacion           = "1"
            me.acordeon.recursos_adicional      = "1"
            me.libro.libroweb                   = "1"
            me.libro.libro_con_guia             = "1"
            me.libro.guia_didactica             = "1"
            me.libro.unidades                   = "1"
            me.curso.ver                        = "1"
            me.curso.agregar                    = "1"
            me.curso.editar                     = "1"
            me.curso.eliminar                   = "1"
            me.cuaderno.guia                    = "1"
            me.cuaderno.didactica               = "1"
            me.cuaderno.web                     = "1"
            me.planificacion.descargar          = "1"
            me.planificacion.visualizar         = "1"
            //variables para recursos adicionales
            me.mijuego.agregar                  = "1"
            me.mijuego.editar                   = "1"
            me.mijuego.eliminar                 = "1"
            me.mijuego.ver                      = "1"
            me.mijuego.asignar                  = "1"
            me.juegoProlipa.asignar             = "1"
            me.juegoProlipa.ver                 = "1"
            me.juegoProlipa.previsualizar       = "1"
            me.materialDigital.ver              = "1"
            me.materialDigital.previsualizar    = "1"
            me.materialDigital.asignar          = "1"
            me.materialpdf.subir                = "1"
            me.materialpdf.ver                  = "1"
            me.materialpdf.descargar            = "1"
            me.materialpdf.asignar              = "1"
            me.propuesta.ver                    = "1"
            me.adaptacion.ver                   = "1"
            me.articulo.lengua                  = "1"
            me.articulo.matematica              = "1"
            me.articulo.naturales               = "1"
            me.articulo.sociales                = "1"
            me.articulo.ensenanza               = "1"
            me.documentom.ver                   = "1"        
          //fin de variables para recursos adicionales
        },
        //METODOS PARA GENERAR LINK
         getLinksLibros(){
          let me = this
          me.$vs.loading();
          me.$http.get(this.$server_url + 'colegios_get_links_libro?id_libro=' + me.libro_id+'&institucion_id='+me.permisosInstitucion)
          .then(res => {
              me.links = res.data
              me.$vs.loading.close()
          })
          .catch(function (error) { me.$vs.loading.close() })
        },
         guardarLink(){
          let me = this
          me.$vs.loading();
          //GENERA ENLCACE 
            let host = location.protocol + '//' + location.hostname +':'+ location.port
            let ruta = host +'/libro_free/'+ me.link.pag_ini+'4.3'+me.link.pag_fin+'4.3'+me.link.fecha_inicio+'4.3'+me.link.fecha_caducidad+'4.3'+me.libro_web
          let formData = new FormData();
          formData.append('id_libro', me.libro_id);
          formData.append('pag_ini', me.link.pag_ini);
          formData.append('pag_fin', me.link.pag_fin);
          formData.append('fecha_ini', me.link.fecha_inicio);
          formData.append('fecha_fin', me.link.fecha_caducidad);
          formData.append('institucion_id', me.permisosInstitucion);
          formData.append('recurso_externo', "yes");
          formData.append('link', ruta);
          me.$http.post(this.$server_url + 'guardar_link_libro', formData)
          .then(res => {
             me.$vs.loading.close()
              if(res.data.status == '0'){
                   me.$vs.notify({
                  text:res.data.message,
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check'})
                  return false
              }
              me.getLinksLibros();
              me.$vs.loading.close()
              me.$vs.notify({ text: 'Link guardado con éxito', color: 'success', iconPack: 'feather', icon: 'icon-check' })
          })
          .catch(function (error) { me.$vs.loading.close() })
        },
        copiarLink(item){
          let me = this
            let host = location.protocol + '//' + location.hostname +':'+ location.port
            let ruta = host +'/libro_free/'+ item.pag_ini+'4.3'+item.pag_fin+'4.3'+item.fecha_ini+'4.3'+item.fecha_fin+'4.3'+item.weblibro
            var aux = document.createElement("input");
            console.log('ruta',ruta)
            aux.setAttribute("value", ruta);
            document.body.appendChild(aux);
            aux.select();
            try {
                var status = document.execCommand('copy');
                if (!status) {
                    me.$vs.notify({ text: 'Error al copiar el link', color: 'warning', iconPack: 'feather', icon: 'icon-alert-triangle' })
                } else {
                    me.$vs.notify({ text: 'Link copiado', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                }
            } catch (err) {
                console.log('No se pudo copiar');
            }

            document.body.removeChild(aux);
        }
        //FIN METODO PARA GENERAR LINK
    }
}
</script>