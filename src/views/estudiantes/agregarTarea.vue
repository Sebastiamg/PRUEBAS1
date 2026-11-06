<template>
<div class="vx-col w-full mt-4">
    <vx-card title="Enviar Tarea">
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <b>
                    <feather-icon icon="PaperclipIcon" svgClasses="w-4 h-4 mr-2"></feather-icon>
                    Archivo
                </b>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <div v-if="tarea.nombre===null || tarea.nombre==='null' || tarea.nombre == 'undefined'">
                    --
                </div>
                <a v-else :href="$data_url+'tareas/'+tarea.url" target="_blank">
                    <feather-icon icon="FileIcon" svgClasses="w-4 h-4 mr-2"></feather-icon>
                    {{tarea.nombre}}
                </a>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <b>Descripción</b>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                {{tarea.descripcion}}
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <b>Fecha de inicial</b>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
               {{tarea.fecha_inicio}}
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <b>Fecha Final</b>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                {{tarea.fecha_final}}
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <b>Adjuntar tarea</b>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-input v-if="porcentaje == 0" type="file" class="w-full" icon-pack="feather" icon="icon-img" v-model="archivo" icon-no-border @change="obtenerImagen" download />
                <div class="v-row text-left" v-if="porcentaje>0">
                            <vs-progress style="height:25px" :percent="porcentaje" color="success"> {{porcentaje}}% </vs-progress>
                        </div><br>
                <p class="text-danger" v-if="msj"> {{msj}} <br> El peso actual de su archivo es: <b>{{pesoArchivo}} mb. </b> </p>
                <p>Peso máximo permitido: <strong>{{limiteMegas}} mb</strong></p>
                <small>El nombre del archivo no debe contener tildes, "ñ" o signos especiales para que el docente lo reciba correctamente.</small>
            </div>
        </div>
        <div class="vx-row mb-6">
            <div class="vx-col sm:w-1/3 w-full">
                <b>Comentario</b>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vs-textarea class="mt-8" v-model="comentario_estudiante" />

            </div>
        </div>
        <div class="vx-row">
            <div class="vx-col sm:w-2/3 w-full ml-auto">
                <vs-button color="success" type="border" @click="guardar()" class="mb-2">Enviar</vs-button>
                &nbsp;&nbsp;
                &nbsp;&nbsp;
                <vs-button color="danger" type="border" class="mb-2" to="/estudiante/curso/virtual">Cancelar</vs-button>
            </div>
        </div>
    </vx-card>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import vSelect from "vue-select";
import "vue-select/dist/vue-select.css";
import VueDocPreview from "vue-doc-preview";
import Vue from "vue";
import axios from "axios";
import vue2Dropzone from "vue2-dropzone";
import "vue2-dropzone/dist/vue2Dropzone.min.css";
Vue.use(axios);

export default {
    mixins: [historicoMixin],
    components: {
        "v-select": vSelect,
        vueDropzone: vue2Dropzone,
        VueDocPreview,
    },
    data() {
        return {
            porcentaje: 0,
            archivo: [],
            asignaturas: [],
            listaContenido: [],
            file: [],
            usuario: [],
            miusuario:[],
            idasignatura: "",
            descripcion: "",
            comentario_estudiante: '',
            dropzoneOptions: {
                url: this.$data_url+"api/addTareaContenido",
                dictDefaultMessage: "<i class='fa fa-cloud-upload'></i> Click o arrastra un archivo aquí.",
                chunking: true,
                thumbnailWidth: 150,
                maxFilesize: 200,
                addRemoveLinks: true,
                headers: {
                    "My-Awesome-Header": "header value",
                },
            },
            tarea: {},
            limiteMegas: 30, //permitir maximo de megas
            bytes: 1048576, //para calculo de megas
            pesoArchivo: 0,
            muyPesado: false,
            msj: '',
        };
    },
    created() {
        let me = this
        this.usuario = JSON.parse(localStorage.getItem("usuario"));
        me.miusuario = this.usuario
        this.tarea.nombre = localStorage.nombre;
        this.tarea.descripcion = localStorage.descripcion;
        this.tarea.comentario_estudiante = localStorage.comentario_estudiante;
        this.tarea.fecha_inicio = localStorage.fecha_inicio;
        this.tarea.fecha_final = localStorage.fecha_final;
        this.tarea.url = localStorage.url;
    },
    mounted() {},
    methods: {
        guardarFile(file) {
            let me = this;
            me.file = file;
        },
        obtenerImagen(e) {
            this.msj = '';
            this.porcentaje = 0;
            this.pesoArchivo = 0;
            this.muyPesado = false;
            let file = e.target.files[0];
            this.file = file;
            // verificar tamaño de archivo
            this.pesoArchivo = (this.file.size / this.bytes).toFixed(2);
            console.log(this.pesoArchivo)
            if (this.pesoArchivo > this.limiteMegas) {
                this.muyPesado = true;
                this.msj = ' El archivo que está subiendo, excede el peso permitido, favor reduzca su peso, para continuar con el envío de su tarea.';
            }
        },
        async guardar() {
            let me = this;
            if (me.muyPesado) {
                me.$vs.notify({
                    text: 'El archivo que intenta enviar es muy pesado, favor corrija antes de continuar.',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            }

            let comentarioEst;
            if (me.comentario_estudiante === '' || me.comentario_estudiante === null || me.comentario_estudiante === 'null') {
                comentarioEst = '--';
            } else {
                comentarioEst = me.comentario_estudiante;
            }

            me.$vs.loading({
                color: "#046AE7",
                text: me.porcentaje,
            });
            const config = {
                onUploadProgress: function (progressEvent) {
                    var percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                    me.porcentaje = percentCompleted;
                    console.log(percentCompleted)
                }
            };
            let h_idinstitucion = me.miusuario.institucion_idInstitucion;
            let h_idusuario = me.miusuario.idusuario;
            let h_idgrupo = me.miusuario.id_group;
            let h_idasignatura = localStorage.idasignatura
            let h_nombreasignatura = localStorage.nombreasignatura
            let h_recursotipo = 11; //11 = tarea
            let datoHistorico = {
              recurso_accion:'Subir tarea',
              recurso_detalle: me.comentario_estudiante,
              referencia_id: localStorage.getItem("idtarea"),
              tabla_referencia: "tarea",
              curso:localStorage.codigo
            }
            let h_id_curso          = localStorage.idcurso
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico,h_id_curso)

            let formData = new FormData();
            formData.append("archivo", me.file);
            formData.append("idusuario", me.usuario.idusuario);
            formData.append("idcurso", localStorage.idcurso);
            formData.append("descripcion", me.descripcion);
            formData.append("comentario_estudiante", comentarioEst);
            formData.append("idtarea", localStorage.getItem("idtarea"));
            axios
                .post(this.$data_url+"api/addTareaContenido", formData, config)
                .then(function (response) {
                    me.file = "";
                    me.$vs.loading.close();
                    me.$router.push("/estudiante/curso/virtual");
                })
                .catch(function (error) {
                    me.$vs.loading.close();
                    if (error.response.status == 422) {
                        me.errors = error.response.data.errors;
                    }
                });

        },
    },
};
</script>

<style scoped>
/* Mejoras sutiles sin cambiar estructura */
.vx-card {
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Etiquetas un poco más atractivas */
.vx-row b {
    color: #374151;
    font-size: 14px;
    display: flex;
    align-items: center;
}

/* Links de archivos mejorados */
.vx-col a {
    color: #3b82f6;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s;
    display: inline-flex;
    align-items: center;
}

.vx-col a:hover {
    color: #1d4ed8;
}

/* Fecha final con color para urgencia */
.vx-row:nth-child(4) .vx-col:last-child {
    color: #dc2626;
    font-weight: 600;
}

/* Mejora del input de archivo */
.vs-input[type="file"] {
    border: 2px dashed #d1d5db;
    border-radius: 8px;
    padding: 16px;
    background-color: #f9fafb;
    transition: border-color 0.2s;
}

.vs-input[type="file"]:hover {
    border-color: #9ca3af;
}

/* Advertencias de archivo - solo mostrar cuando hay error */
.text-danger {
    color: #dc2626;
    border: 1px solid #fecaca;
    border-radius: 6px;
    padding: 8px 12px;
    margin: 12px 0;
    background-color: transparent;
}

/* Información de límites */
.vx-col small {
    color: #6b7280;
    font-style: italic;
}

/* Textarea de comentarios */
.vs-textarea {
    border-radius: 6px;
}

/* Botones mejorados */
.vs-button {
    border-radius: 6px;
    font-weight: 500;
    padding: 10px 20px;
}

/* Separador sutil entre secciones */
.vx-row {
    border-bottom: 1px solid #f3f4f6;
    padding-bottom: 16px;
}

.vx-row:last-child {
    border-bottom: none;
    padding-top: 20px;
}
</style>
