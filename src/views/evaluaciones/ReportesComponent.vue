<template>
    <div>

        <!-- Modal Agregar-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Agregar Tema" :active.sync="popupAddTema">
                <vs-input class="inputx mb-3" placeholder="Nombre Tema" v-model="docente.nombre" style="width: 100%;" />
                
                Asignatura: 
                <v-select class="mb-3" v-model="docente.asignatura" :options="asignaturas" :value="asignaturaSelected" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                Unidad:
                <v-select class="mb-3" v-model="docente.unidad" :options="unidades" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                <vs-button color="success" type="gradient" @click="agregar()">Guardar</vs-button>
            </vs-popup>
        </div>
        <!----FIN MODAL AGREGAR-->



        <!-- Modal Editar Temas-->
        <div class="demo-alignment">
            <vs-popup classContent="popup-example" title="Editar Tema" :active.sync="popupEditTema">

                <vs-input class="inputx mb-3" placeholder="Nombre Tema" v-model="docente.nombre" style="width: 100%;"/>

                <v-select class="mb-3" v-model="docente.asignatura" :options="asignaturas" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                <v-select class="mb-3" v-model="docente.unidad" :options="unidades" :dir="$vs.rtl ? 'rtl' : 'ltr'" />

                <vs-button color="success" type="gradient" @click="editarTema(tema)">Editar</vs-button>
            </vs-popup>
        </div>
        <!----FIN MODAL EDITAR---->



        <!--LISTADO DE TEMA-->
        <div align="center">

            <vs-breadcrumb
            :items="
            [
                {
                title: 'Cursos',
                url: '/cursosInstitucion',
                },
                {
                title: 'Docentes',
                url: '/docentesInstitucion'
                },
                {
                title: 'Estudiantes',
                url: '/estudiantesInstitucion'
                },
                {
                title: 'Active',
                url: '/blog'
                }
            ]"
            ></vs-breadcrumb>

            <vs-table multiple v-model="docenteSelected" pagination max-items="3" search :data="docentes">

                <template slot="thead">
                    <vs-th sort-key="pregunta">Docente</vs-th>
                    <vs-th></vs-th>
                    <vs-th>Acciones</vs-th>
                </template>

                <template slot-scope="{data}">
                <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">

                    <vs-td :data="data[indextr].cedula">
                        {{ 'Cédula: ' + data[indextr].cedula }}<br>
                        {{ 'Nombre: ' + data[indextr].nombres +' '+ data[indextr].apellidos }}<br>
                        {{ 'Email: ' + data[indextr].email }}<br>
                    </vs-td>

                    <vs-td>
                        <img v-if="data[indextr].foto_user!='' && data[indextr].foto_user!='null' && data[indextr].foto_user!=null" v-bind:src="$data_url+'archivos/img/'+data[indextr].foto_user" class="img-responsive" width="50px"><br>
                    </vs-td>

                    <vs-td :data="data[indextr].idusuario">
                        <vs-button radius icon-pack="feather" icon="icon-file" @click="editarFormulario(data[indextr]); popupEditTema=true" color="success" type="gradient" style="display: inline-block;"></vs-button>
                    </vs-td>

                </vs-tr>
                </template>
            </vs-table>

        </div>
    </div>

</template>

<script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import Vue from 'vue'
    import axios from 'axios'
    import vSelect from 'vue-select'
    import moment from 'moment'
    export default {
        data(){
            return {
                docentes: [],
                docente: {cedula: '', nombres: '', apellidos: '', email: '', foto_user: ''},
    
                asignaturas: [],
                asignatura: {id: '', label: ''},
                editarActivo: false,
                docenteSelected: [],
                asignaturaSelected: {id: '', label: ''},
                popupAddTema: false,
                popupEditTema: false,
                usuario: [],
                id_login: null,
                unidades: [
                    {
                    id: "1",
                    label: "Unidad 1",
                    },
                ]
            }
        },
        components: {
            'v-select': vSelect,
            flatPickr
        },
        created(){
            this.usuario = JSON.parse(localStorage.getItem('usuario'));
            this.id_login = this.usuario.idusuario
            this.$http.get(this.$server_url+'docentesInstitucion/'+this.id_login).then(res => {
                this.docentes = res.data;
                //console.log('res.data: ' + res.data[0].cedula);
            }),
            this.$http.get(this.$server_url+'asignaturasDoc/'+this.id_login).then(res => {
                this.asignaturas = res.data;
            })
        },
        methods: {
            onResize() {
            if (window.innerWidth < 769)
                this.isMobile = true;
            else
                this.isMobile = false;
            },
            limpiar(){
                this.docente.nombre = '';
                this.docente.asignatura = '';
                this.docente.unidad = '';
            },
            agregar(){//datos que se obtienen de los inputs
                if(this.docente.nombre.trim() === '' || this.docente.unidad.id.trim() === ''){
                    alert('Debes completar todos los campos antes de guardar');
                    return;
                }
                let formData = new FormData();
                    formData.append('nombre', this.docente.nombre);
                    formData.append('asignatura', this.docente.asignatura.id);
                    formData.append('unidad', this.docente.unidad.id);
                this.$http.post(this.$server_url+'tema', formData)
                .then(res => {
                    this.temas.push(res.data)
                    this.popupAddTema = false
                    this.$vs.notify({
                    text:'Tema guardado exitosamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    
                    location.reload();
                })
            },
            eliminarTema(item, index){ //index => return
                let formData = new FormData();
                    formData.append('id', item.id);
                this.$http.delete(this.$server_url+'tema', formData).then(() => {
                    this.temas.splice(index, 1);
                })
                .catch(function (error) {
                    alert('NO SE PUEDE ELIMINAR ESTE TEMA PORQUE TIENE PREGUNTAS ASIGNADAS.');
                })
            },
            editarFormulario(item){
                this.asignaturaSelected = {id: item.id_asignatura, label: item.nombreasignatura};
                this.docente.nombre = item.label;//nombre_tema=label
                this.docente.asignatura = {id: item.id_asignatura, label: item.nombreasignatura};
                this.docente.unidad = {id: item.unidad, label: 'Unidad '+item.unidad};
                this.docente.id = item.id;
                this.editarActivo = true;//activa el form editar
            },
            editarTema(item){
                let formData = new FormData();
                    formData.append('id', item.id);
                    formData.append('nombre', this.docente.nombre);
                    formData.append('asignatura', this.docente.asignatura.id);
                    formData.append('unidad', this.docente.unidad.id);
                this.$http.post(this.$server_url+`tema`, formData).then(res => {
                    const index = this.temas.findIndex(
                        temaBuscar => temaBuscar.id === res.data.id)
                    this.tema[index] = res.data;
                    this.$http.get(this.$server_url+'tema').then(res => {
                        
                        this.editarActivo = false;//desactiva el form editar
                        this.temas = res.data;
                        this.popupEditTema = false
                        this.$vs.notify({
                        text:'Tema editado exitosamente',
                        color:'success',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    })
                    
                });
            },
        },
    }
</script>