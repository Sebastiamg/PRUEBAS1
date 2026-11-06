<template>
<div id="knowledge-base-category-page">
<!------modal cargar asignaturas------->
<vs-popup title="Cargar asignaturas" :active.sync="promptCargarAsig">
    <div class="p-2 mb-2" style="background-color: #E5F0FC; color: #1666F1; border-radius: 5px;">
        <span>Estimado docente, con la finalidad de agregar en un futuro, más servicios que dispone la editorial, le solicitamos actualizar la asignatura en los cursos creados.</span>
    </div>

    <div class="w-full mt-3 mb-8">
        <br>
        <div class="vx-row w-full mt-6" v-if="cursos_sin_asignatura[currentx-1]">
            <div class="vx-col sm:w-1/3 w-full mb-2">
                <b>Curso: </b>
            </div>
            <div class="vx-col sm:w-2/3 w-full mb-2">
                {{cursos_sin_asignatura[currentx-1].nombre}}
            </div>
        </div>

        <div class="vx-row w-full mt-6" v-if="cursos_sin_asignatura[currentx-1]">
            <div class="vx-col sm:w-1/3 w-full">
                <b>Asignatura: </b>
            </div>
            <div class="vx-col sm:w-2/3 w-full">
                <vx-input-group>
                    <v-select class="w-full" v-model="asignaturaSelected" :options="asignaturas" :value="cursos_sin_asignatura[currentx-1].id_asignatura" @input="guardarAsignatura()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                    <template slot="append">
                        <div class="append-text btn-addon">
                        <vs-button color="primary" @click="otraActivo=true">Otra</vs-button>
                        </div>
                    </template>
                </vx-input-group>
            </div>
        </div>

        <div class="p-2 mb-2 mt-4" v-if="otraActivo===true" align="justify" style="background-color: #FFC8D4; color: #D50430; border-radius: 5px;">
            <span>
                Antes de crear otra asignatura, verifique nuevamente en el listado asignaturas que se encuentra en la parte superior.<br>
                Las asignaturas de naturales, sociales, lengua, matemática, computación y eca que ya pertenecen a prolipa, serán eliminadas por un administrador.
            </span>
        </div>
        <span v-if="otraActivo===true">Para mayor información escribanos a soporte@prolipa.com.ec</span>

        <div class="vx-row w-full mt-6 mb-8" v-if="otraActivo===true">
            <div class="vx-col sm:w-2/3 w-full ml-auto">
                Especifique: <br>
                <vx-input-group>
                    <vs-input v-model="nombre_otra_asignatura" class="w-full"></vs-input>

                    <template slot="append">
                        <div class="append-text btn-addon">
                        <vs-button color="dark" @click="crearOtraAsignatura()">Guardar</vs-button>
                        </div>
                    </template>
                </vx-input-group>
            </div>
        </div>
    </div>
    <br><br><br><br><br>
    <div class="text-right">Este proceso no le tomará más de 2 minutos</div>
</vs-popup>
<!-------fin modal cargar asignaturas---------->
    <div v-if="listStudents == false">
        <!-- <vs-button color="dark" type="relief" to="/docente/cursos" @click="nuevo()" >Agregar curso</vs-button> -->

        <div class="flex flex-wrap gap-4 items-center">
            <vs-chip transparent color="primary">
            Cantidad de cursos de la asignatura &nbsp;<b>{{asignatura_selected}}</b>: &nbsp;&nbsp;&nbsp;<span style="font-weight: bold; font-size: 15px;"> {{ curso.length }}</span>
            </vs-chip>
            <vs-button color="dark" class="px-3 py-2" type="relief" to="/docente/curso/nuevo" @click="nuevo()" >Agregar curso</vs-button>
        </div>

        <div class="vx-row mt-4 match-height">
            <div class="vx-col w-full sm:w-1/2 md:w-1/3 mb-base" v-for="section in curso" :key="section.id">
                <vx-card :title="section.nombre+' '+section.seccion">
                    <p class="text-center">
                        <img src="@/assets/images/pages/graphic-3.png" alt="graphic" width="100" class="mx-auto">
                    </p>
                    <vs-list>
                        <vs-list-item icon-pack="feather" icon="icon-check" title="Asignatura" :subtitle="section.nombreasignatura"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-check" title="Paralelo" :subtitle="section.aula"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-check" title="Código" :subtitle="section.codigo"></vs-list-item>
                        <vs-list-item icon-pack="feather" icon="icon-check" title="Cantidad estudiantes">
                            <vs-chip color="success">{{ section.estudiantes }}</vs-chip>
                        </vs-list-item>
                    </vs-list>
                    <div class=" mt-2" align="center">
                        <div style="display:flex;width:100%;justify-content:center;">
                            <vx-tooltip  color="primary" text="Ver Evaluaciones" style="display: inline-block;">
                                <vs-button color="primary" size="small" type="relief" icon-pack="feather" @click="verEvaluaciones(section)" class="m-2">Ver curso</vs-button>
                            </vx-tooltip>
                            <vx-tooltip color="success" text="Editar curso" style="display: inline-block;">
                                <vs-button color="success" size="small" type="relief" icon-pack="feather"  @click="editar(section.idcurso)" class="m-2">Editar curso</vs-button>
                            </vx-tooltip>
                            <vx-tooltip color="danger" text="Eliminar curso" style="display: inline-block;">
                                <vs-button color="danger" size="small" type="relief" icon-pack="feather"  @click="eliminar(); idcurso = section.idcurso" class="m-2">Eliminar curso</vs-button>
                            </vx-tooltip>
                        </div>
                        <div class="w-full p-2 bg-gray-400 text-center">
                            <vs-button
                            icon    = "assignment"
                            class   = "w-full"
                            color   = "success"
                            type    = "gradient"
                            @click  =   "setCurso           = section.codigo;
                                        listStudents        = true;
                                        setNombreAsignatura = section.nombreasignatura
                                        setAula             = section.aula
                            "
                            >
                            Ver listado estudiantes
                            </vs-button>
                        </div>
                    </div>
                </vx-card>
            </div>
        </div>
    </div>
    <vs-card v-else>
        <vs-button color="success" size="small"  @click  = "listStudents = false;getCurso();" type="filled" icon="reply">REGRESAR</vs-button>
        <estudianteCursoVue :setCurso="setCurso" :setNombreAsignatura="setNombreAsignatura" :setAula="setAula"/>
    </vs-card>
</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
Vue.use(axios)
import estudianteCursoVue from './components/estudianteCurso.vue'

export default {
    data() {
        return {
            curso: [],
            usuario: [],
            idcurso: '',
            promptCargarAsig: false,
            cursos_sin_asignatura: [],
            asignaturas: [],
            asignaturaSelected: {},
            currentx: 1,
            otraActivo: false,
            nombre_otra_asignatura: '',
            listStudents:false,
            setCurso:'',
            setNombreAsignatura:'',
            setAula:'',
            asignatura_selected: '',
        }
    },
    created() {
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        this.asignatura_selected = localStorage.getItem('nombreasignatura')
        this.validarAsignaturas()
        this.getAsignaturas()
    },
    mounted() {

    },
    computed: {},
    methods: {
        getAsignaturas(){
            let me = this
            me.$vs.loading()
            this.$http.get(this.$server_url+'asignaturasDoc/'+me.usuario.idusuario).then(res => {

                me.asignaturas = res.data;
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        validarAsignaturas(){
            let me = this
            this.$http.get(this.$server_url+'verif_asignatura_por_curso/' + me.usuario.idusuario)
            .then(function (res) {
                me.cursos_sin_asignatura = res.data;
                if( me.cursos_sin_asignatura[me.currentx-1] ){
                    me.promptCargarAsig = true
                }else{
                    me.promptCargarAsig = false
                }
            })
            .catch(function (error) {})
        },
        getCurso() {
            let me = this;
            me.$vs.loading()
            let id_asignatura = localStorage.idasignatura
            this.$http.get(this.$server_url+'cursos_evaluaciones_asignatura_doc/' + me.usuario.idusuario+'/'+id_asignatura)
            // this.$http.get(this.$server_url+'cursos_evaluaciones/' + me.usuario.idusuario)
            .then(function (response) {
                me.$vs.loading.close()
                me.curso = response.data;
            })
            .catch(function (error) {
                me.$vs.loading.close()
            })
        },
        verEvaluaciones(section){
            if( section.nombreasignatura ){
                localStorage.codigo = section.codigo;
                localStorage.idcurso = section.idcurso;
                localStorage.idasignatura = section.idasignatura;
                localStorage.nombreasignatura = section.nombreasignatura;
                this.$router.push(`/evaluaciones`);
            }else{
                this.$vs.notify({
                text:'Para poder crear una evaluación el curso debe tener una asignatura. Puede cargar la asignatura de este curso dando click en "Editar"',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-alert-triangle'})
                this.editar(section.idcurso)
            }
        },
        nuevo(){
            localStorage.idcurso = '';
        },
        editar(idcurso) {
            localStorage.idcurso = idcurso;
            this.$router.push(`/docente/curso/editar`);
        },
        eliminar() {
            this.$vs.dialog({
                color: 'danger',
                title: `Eliminar Curso`,
                text: 'Seguro desea eliminar?',
                accept: this.acceptAlert,
            })
        },
        acceptAlert() {
            let me = this;
            this.$http.get(this.$server_url+"eliminarCurso?idcurso=" + me.idcurso)
                .then(function (response) {
                    me.$vs.notify({
                        color: 'success',
                        title: 'Aceptado',
                        text: 'Curso eliminado'
                    })
                    me.getCurso();
                })
                .catch(function (error) {
                    me.$vs.notify({
                        color: 'danger',
                        title: 'Error',
                        text: error
                    })
                })
        },
        guardarAsignatura(){
            let me = this
            let formData = new FormData();
            formData.append('id_asignatura', me.asignaturaSelected.id);
            formData.append('id_curso', me.cursos_sin_asignatura[me.currentx-1].idcurso);

            me.$vs.loading()
            this.$http.post(this.$server_url+'cargar_asignatura_curso', formData)
            .then(function (res) {
                me.validarAsignaturas()
                me.getCurso()
                me.asignaturaSelected = {}
                me.$vs.loading.close()
                me.$vs.notify({
                text:'Asignatura guardada correctamente.',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        crearOtraAsignatura(){
            let me = this
            let formData = new FormData();
            formData.append('nombre', me.nombre_otra_asignatura);
            formData.append('area', 83);
            formData.append('nivel', 30);
            formData.append('tipo_asignatura', 0);

            me.$vs.loading()
            this.$http.post(this.$server_url+'asignatura', formData)
            .then(function (res) {
                me.asignaturaSelected.id = res.data.idasignatura
                me.guardarAsignatura()
                me.asignaturaDocente(res.data.idasignatura)
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error)
            })
        },
        asignaturaDocente(id_asignatura){
            let me = this
            let formData = new FormData();
            formData.append('usuario_idusuario', me.usuario.idusuario);
            formData.append('asignatura_idasignatura', id_asignatura);

            me.$vs.loading()
            this.$http.post(this.$server_url+'guardar_asignatura_usuario', formData)
            .then(function (res) {
                me.nombre_otra_asignatura = ''
                me.otraActivo = false
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error)
            })
        }
    },
    components: {
        'v-select': vSelect,
        estudianteCursoVue,
    },

    mounted() {
        this.getCurso();
    }
}
</script>
