<template>
<div>
    <div class="vx-row text-center mt-2">
        <div class="vx-col md:w-1/3" align="center">
            <button class="btnwizardSelect" id="btnNav1">1</button><br>
            Juego
        </div>

        <div class="vx-col md:w-1/3" align="center">
            <button class="btnwizard" id="btnNav2">2</button><br>
            Imágenes
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
                <vs-button type="filled" v-else @click="editarJuego(1); pintartab(2)">Siguientes</vs-button>
            </div>

        </div>
    </vx-card>

    <div v-if="tabActivo===2">
        <vx-card>

            <formrompecabezas ref="formrompecabezas" />

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
            <img v-if="imagen_a_mostrar != ''" height="350" style="display:inline-block" :src="$data_url+ruta_images+imagen_a_mostrar">
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
import formrompecabezas from './form_rompecabezas.vue'
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

            msjError: 'La imagen que intenta cargar es muy pesada, verifique por favor.',

            msj_imagen: '',

            txt_boton: 'Guardar pregunta y opciones',
            color_boton: 'success',
            tipo_accion: 1, //1-guardar - 2-editar
            modalImagen: false,
            imagen_a_mostrar: '',
            view_op: 1,
            ruta_images:'archivos/images/imagenes_juegos/seleccionSimple/',
        }
    },
    components: {
        'v-select': vSelect,
        flatPickr,
        formrompecabezas,
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
        me.getTemas()
        me.cargarSelecTemas()
        me.getAsignaturas()
    },
    methods: {
        getAsignaturas() {
            let me = this
            if (me.tipoUsuario === 1) {
                this.$http.get(this.$server_url + 'asignaturasDoc/0').then(res => {
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
            this.$http.get(this.$server_url + 'pregunta_opciones/' + me.id_juego)
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
                console.log(me.asignaturaSelected.id, me.unidadSelected.id)
                this.$http.post(this.$server_url + 'temasignunidad', formData).then(res => {
                        //this.$http.get(this.$server_url+'temAsignaruta/'+ me.asignaturaSelected.id).then(res => {
                        me.temas = res.data;
                        console.log(res.data)
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
            this.$http.post(this.$server_url + 'j_juegos', formData)
                .then(res => {
                    me.id_juego = res.data.id_juego

                    localStorage.setItem('id_rompecabezas', me.id_juego);

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
            this.$http.post(this.$server_url + 'j_juegos', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.eliminarTemasJuego()
                    me.getPreguntas()

                    localStorage.setItem('id_rompecabezas', me.id_juego);

                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        eliminarTemasJuego() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url + 'eliminarTemasJuego/' + me.id_juego)
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
            this.$http.post(this.$server_url + 'guardarTemasJuego', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.tabActivo = 2
                    me.datos_crear_juego = {}
                    me.editarPregActivo = false
                    me.pintartab(2)
                    me.getImagenesRomp()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },
        getFicha() {
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url + 'j_juegos/' + me.id_juego)
                .then(res => {
                    me.datos_ficha = res.data[0];

                    $.each(me.datos_ficha, function (key, value) {
                        // console.log('key: ' + me.datos_ficha[key]+' _ value: '+value)
                        if (value == 'null' || value == null || value == '') {
                            me.datos_ficha[key] = ''
                        }
                    });

                    me.$vs.loading.close()
                })
                .catch(function (error) {})
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
            this.$http.post(this.$server_url + 'j_juegos_ficha', formData)
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
        },
        getImagenesRomp() {

            this.$refs.formrompecabezas.get_img_rompecabezas();

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
