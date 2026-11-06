<template>
<div>
    <vs-prompt @cancel="activePromptEliminar=false;" @accept="eliminarForo()" title="Confirmar" acceptText="Aceptar" cancelText="Cancelar" @close="activePromptEliminar=false;" :active.sync="activePromptEliminar" color="danger">
        <div class="con-example-prompt">
            ¿Está seguro de eliminar este foro?
        </div>
    </vs-prompt>

    <vs-popup fullscreen title="Crear foro" title-color="primary" :active.sync="popupActive" class="p-5">
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-full">
                <b>Titulo del foro</b>
                <vs-input type="text" class="inputx w-full mb-6" v-model="tema" placeholder="Nombre o titulo del foro" />
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/2 w-full">
                <b>Fecha de inicio</b>
                <flat-pickr class="w-full" :config="configdateTimePicker" v-model="fecha_inicio" />
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                <b>Fecha de final</b>
                <flat-pickr class="w-full" :config="configdateTimePicker" v-model="fecha_final" />
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/2 w-full">
                <b>Estado</b>
                <vs-switch class="" vs-icon-on="check" color="success" v-model="estado" style="width: 100px;">
                    <span slot="on">Activo</span>
                    <span slot="off">Inactivo</span>
                </vs-switch>
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                <b>TODOS PUEDEN VER LOS COMENTARIOS</b>
                <vs-switch class="" vs-icon-on="check" color="success" v-model="ver_comentarios" style="width: 100px;">
                    <span slot="on">Habilitado</span>
                    <span slot="off">Deshabilitado</span>
                </vs-switch>
            </div>
        </div>
        <div class="vx-row mb-6">
            <!-- <div class="vx-col sm:w-1/3 w-full">
            </div> -->
        </div>
        <div class="w-full">
            <b>Agregue contenido a su foro:</b>
        </div>
        <div class="vx-col mt-4 w-full">
            <quill-editor class="w-full h-25" style="height:250px" v-model="descripcion"></quill-editor>
        </div>
        <br>
        <div class="vx-row mt-6">
            <div class="vx-col mt-8 sm:w-2/3 w-full ml-auto">
                <vs-button class="mr-3 mb-2" @click="guardar">Guardar</vs-button>
                <vs-button color="danger" type="border" @click="vaciar();popupActive = false" class="mb-2">Cancelar</vs-button>
            </div>
        </div>
    </vs-popup>

    <vx-card>
        <center>
            <h1>{{nombre_curso}}</h1>
        </center>

        <!-- LISTADO FOROS POR CURSO -->
        <vs-table pagination max-items="25" search :data="foros">
            <template slot="header" v-if="grupo_usuario != 10">
                <!-- <vs-button color="primary" type="border" class="m-1" @click="$router.go(-1)"><b>← Volver</b></vs-button> -->
                <vs-button @click="id_foro_selec=''; popupActive=true; agregarActivo=true;" color="dark" type="filled" class="m-1">Crear foro</vs-button>
            </template>

            <template slot="thead">
                <vs-th sort-key="nombre_evaluacion">Foro</vs-th>
                <vs-th sort-key="fecha_final">Fecha final</vs-th>
                <vs-th sort-key="estado">Estado</vs-th>
                <vs-th>Acciones</vs-th>
            </template>

            <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td>{{data[indextr].tema}}</vs-td>
                    <vs-td>{{data[indextr].fecha_final | fecha}}</vs-td>
                    <vs-td>
                        <span v-if="data[indextr].estado==1" class="text-success">Publicado</span>
                        <span v-else class="text-danger">Inactivo</span>
                    </vs-td>
                    <vs-td>
                        <vx-tooltip style="display: inline-block;" text="Ver foro" position="top" color="primary">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-eye" @click="irForo(data[indextr].id_foro)" color="primary" type="line"></vs-button>
                        </vx-tooltip>

                        <vx-tooltip style="display: inline-block;" text="Editar foro" position="top" color="success">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-edit" @click="agregarActivo=false; id_foro_selec=data[indextr].id_foro; editarFormulario(data[indextr]); popupEditEval=true;" color="success" type="line"></vs-button>
                        </vx-tooltip>

                        <vx-tooltip style="display: inline-block;" text="Eliminar foro" position="top" color="danger">
                            <vs-button size="large" radius icon-pack="feather" icon="icon-trash" @click="openConfirmEliminar(data[indextr]);" color="danger" type="line"></vs-button>
                        </vx-tooltip>

                    </vs-td>

                </vs-tr>
            </template>
        </vs-table>
        <!--FIN LISTADO FOROS POR CURSO -->
    </vx-card>
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
import moment from "moment";
Vue.filter('fecha', function (value) {
    if (value) {
        return moment(String(value)).format('YYYY-MM-DD HH:mm')
    }
});
export default {
    components: {
        StarRating,
        quillEditor,
        flatPickr,
        'v-select': vSelect,
    },
    data() {
        return {
            popupActive: false,
            popupEditar: false,
            usuario: [],
            fecha_inicio: "",
            fecha_final: "",
            descripcion: "",
            estado: true,
            e_fecha_inicio: "",
            e_fecha_final: "",
            e_descripcion: "",
            e_estado: true,
            idtarea: "",
            editorOption: {
                theme: "bubble",
            },
            respuestas: [],
            estudiantes: [],
            foro: {
                descripcion: ""
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d H:i:s'
            },
            foros: [],
            agregarActivo: false,
            activePromptEliminar: false,
            id_foro_selec: '',
            nombre_curso: '',
            tema: '',
            conteo: [],
            ver_comentarios: false, //eldocente puede permitir a los estudiantes, ver las respuestas de sus compañeros
            grupo_usuario: '',
        };
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.nombre_curso = localStorage.nombre_curso
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem("usuario"))
        this.grupo_usuario = this.usuario.id_group;
        this.getForos();
        this.vaciar();
    },
    methods: {
        showCurrentRating: function (rating) {
            this.currentRating = (rating === 0) ? this.currentSelectedRating : "Click to select " + rating + " stars"
        },
        setCurrentSelectedRating: function (rating) {
            this.currentSelectedRating = "You have Selected: " + rating + " stars";
        },
        getDate(date) {
            var d = new Date(date);
            var datestring = d.getDate() + "-" + (d.getMonth() + 1) + "-" + d.getFullYear() + " " +
                d.getHours() + ":" + d.getMinutes();
            return datestring;
        },
        getForos() {
            let me = this;
            this.$http.get(this.$server_url + 'foros_curso/'+localStorage.codigo)
                .then(function (response) {
                    me.foros = response.data;
                    me.vaciar();
                })
                .catch(function (error) {});
        },
        contarRespuestas(item) {
            let me = this;
            axios.get("https://foro.prolipadigital.com.ec/respuestas?idforo=" + id)
                .then(function (response) {
                    me.conteo = response.data;
                    console.log(me.conteo)
                })
                .catch(function (error) {});
        },
        guardar() {
            let me = this;
            if (me.tema == "") {
                me.$vs.notify({
                    text: 'Ingrese el nombre o titulo del foro.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let estado = me.estado == true ? 1 : 0
            let ver_comentarios = me.ver_comentarios == true ? 1 : 0
            let formData = new FormData();
            formData.append('id_foro', me.id_foro_selec);
            formData.append('tema', me.tema);
            formData.append('descripcion', me.descripcion);
            formData.append('fecha_inicio', me.fecha_inicio);
            formData.append('fecha_final', me.fecha_final);
            formData.append('codigo_curso', localStorage.codigo);
            formData.append('id_usuario', me.usuario.idusuario);
            formData.append('estado', estado);
            formData.append('ver_comentarios', ver_comentarios);

            this.$http.post(this.$server_url+'foros', formData)
            .then(function (response) {
                me.foro = {};
                me.getForos();
                me.$vs.notify({ text: 'Foro creado correctamente.', color: 'success', iconPack: 'feather', icon: 'icon-check' })
                me.popupActive = false;
            })
            .catch(function (error) {});
        },
        editarFormulario(foro) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            me.popupActive = true;
            me.foro = foro;
            me.descripcion = foro.descripcion
            me.fecha_inicio = foro.fecha_inicio
            me.fecha_final = foro.fecha_final
            me.estado = foro.estado
            me.tema = foro.tema
            me.ver_comentarios = foro.ver_comentarios
        },

        openConfirmEliminar(item) {
            let me = this;
            if (me.grupo_usuario == 10) {
                me.$vs.notify({
                    text: 'Este contenido pertenece a otro docente',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return;
            }
            me.id_foro_selec = item.id_foro
            me.activePromptEliminar = true;
        },
        eliminarForo() {
            let me = this;
            this.$http.get(this.$server_url+'eliminar_foro/'+me.id_foro_selec)
                .then(res => {
                    me.getForos()
                })
                .catch(function (error) {
                    me.$vs.notify({
                        text: 'No se puede eliminar este foro',
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },
        vaciar() {
            let me = this;
            me.tema = '';
            me.fecha_inicio = '';
            me.fecha_final = '';
            me.estado = true;
            me.ver_comentarios = false;
            me.descripcion = '';
        },
        irForo(id_foro) {
            let me = this
            localStorage.idForo = id_foro
            if (me.grupo_usuario == 10) {
                me.$router.push('/director/institucion/docentes/contenidos/libro/curso/foro/respuestas')
            } else {
                me.$router.push('/docente/respuestas_foro')
            }
        }
    },
};
</script>
