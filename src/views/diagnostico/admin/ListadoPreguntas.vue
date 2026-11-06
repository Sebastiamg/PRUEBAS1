<template>
    <div>
        <vx-card
            v-if="usuario.id_group == 1"
            :title="title"
            title-color="primary"
            subtitle="Estas preguntas estarán reflejadas en la prueba diagnóstica del estudiante.">
            <small  v-if="usuario.id_group == 1">Ruta: /diagnostico/preguntas</small>
            <vs-alert class="mt-2" color="success" style="min-height: 60px;">
                <p class="font-bold">!Estas preguntas serán usadas para la validación del ingreso de códigos de libros por parte de los estudiantes</p>
            </vs-alert>
            <vs-table style="margin-top:-20px;" class="mt-3" search :data="arregloLibros" stripe pagination max-items="10">
                <template>
                <div slot="header" class="flex">
                  <vs-button color="rgb(62, 201, 214)" @click="limpiar();addForm();" icon="add" type="filled">Generar preguntas al libro</vs-button>
                </div>
                </template>
                <template slot="thead">
                <vs-th sort-key="nombrelibro">Libro</vs-th>
                <vs-th sort-key="nombrelibro">Cantidad de preguntas</vs-th>
                <vs-th sort-key="nombreInstitucion">Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].nombrelibro">
                        {{  tr.nombrelibro}}
                    </vs-td>
                    <vs-td :data="data[indextr].nombrelibro">
                        {{  tr.contador}}
                    </vs-td>
                    <vs-td>
                    <div class="flex">
                        <vx-tooltip class="ml-3" style="display: inline-block;" text="Editar" position="top" color="success">
                            <vs-button size="small" class="modal-default-button" color="warning" @click="openEditar(data[indextr]);" type="line" icon-pack="feather" icon="icon-edit">
                            </vs-button>
                        </vx-tooltip>
                    </div>
                    </vs-td>
                </vs-tr>
                </template>
            </vs-table>
        </vx-card>
         <!--MODAL PARA AGREGAR-->
      <vs-popup classContent="popup-example" @close="getarregloLibros()" fullscreen  title="Generar Preguntas" :active.sync="popupAgregar">
        <vs-tabs :color="colorx">
          <vs-tab @click="colorx = 'success'" label="Información">
            <div class="vx-row mb-6">
              <div class="vx-col sm:w-1/3 w-full">
                <span>Libro</span>
              </div>
              <div class="vx-col sm:w-2/3 w-full">
                <v-select :options="libros" :disabled="books" id="books" @input="getPreguntas()" :reduce="libros => libros.idlibro" label="nombrelibro" class="w-full" v-model="formulario.libro" />
              </div>
            </div>
            <div class="vx-col w-full mb-2" style="padding: 10px;">
                <vs-divider position="left" color="success">Crear opciones</vs-divider>
                <div class="vx-row mb-2" id="editar">
                    <div class="vx-col w-full mb-1">
                        <div style="border: 1px solid #d5d5d5; border-radius: 5px; padding: 5px 5px 5px 5px;" align="center">
                            <input type="file" name="file2" id="file2" class="inputfile" style="display: none;" v-on:change="mostrarImg(2,2)">
                            <label for="file2" style="margin-bottom: -10px; cursor: pointer; font-weight: bold; width: 100%; font-size: 11px;">
                                <i class="fa-solid fa-cloud"></i> Click aquí para subir imagen
                            </label>
                            <div v-if="src_imagen_opcion==='' || src_imagen_opcion===null || src_imagen_opcion==='null'"></div>
                            <img id="img2" style="border-radius: 5px;" class="img-responsive mb-2" v-bind:src="src_imagen_opcion" v-else>
                        </div>
                        <vs-textarea class="mt-2" label="Nombre Pregunta" v-model="opcion.descripcion" height="60px"/>
                    </div>
                    <div class="vx-row w-full">
                        <div class="vx-col sm:w-1/2 w-full" align="center">
                            <vs-switch style="width: 100px;" color="success" class="mt-3 mb-5" v-model="opcion.tipo">
                                <span slot="on">Verdadero</span>
                                <span slot="off">Falso</span>
                            </vs-switch>
                        </div>
                        <div class="vx-col sm:w-1/2 w-full mb-1" align="center">
                            <vs-button  v-if="editarOpcionActiva===false"  class="mr-3 mb-2" icon="save" @click="cargarOpcion()">Agregar Pregunta</vs-button>
                            <vs-button  v-else class="mr-3 mb-2" color="warning" icon-pack="feather" icon="icon-edit-1" @click="confirmEditarOpcion(opcion)">Editar Pregunta</vs-button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="vx-col w-full">
                <vs-divider position="center" color="primary">Opciones agregadas</vs-divider>
                <div class="vx-row mb-3" :key="indexitem" v-for="(item, indexitem) in opciones">
                    <div class="vx-col sm:w-1/5 w-full" align="center">
                        <img v-if="item.imagen" style="border-radius: 5px;" v-bind:src="$data_url+'archivos/diagnostico/img/img_preguntas/'+item.imagen" width="100">
                    </div>
                    <div class="vx-col sm:w-4/5 w-full">
                        <vs-input class="w-full" v-model="item.pregunta"/>
                        <div class="vx-row" align="center">
                        <div class="vx-col sm:w-1/3 w-full">
                            <vs-switch style="width: 100px;" disabled="true" color="success" class="mt-3 mb-5" v-model="item.opcion">
                                <span slot="on">Verdadero</span>
                                <span slot="off">Falso</span>
                            </vs-switch>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full">
                            <vs-button color="primary" type="line" icon-pack="feather" icon="icon-edit-1" size="small" @click="src_imagen_opcion=''; editarOpcionActiva=true; editarOpcion(item)">Editar</vs-button>
                        </div>
                        <div class="vx-col sm:w-1/3 w-full">
                            <vs-button color="danger" type="line" icon-pack="feather" icon="icon-trash" size="small" @click="quitarOpcion(item)">Eliminar</vs-button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
          </vs-tab>
        </vs-tabs>
      </vs-popup>
    </div>
</template>
<script>
import vSelect from 'vue-select'
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import axios from 'axios';
import $ from 'jquery'
var img_opcion_old = '';
export default {
    data() {
        return{
            libros:[],
            arregloLibros:[],
            usuario:[],
            id:0,
            popupAgregar:false,
            editarOpcionActiva: false,
            verSolicitud:false,
            opcion: {id_opcion_pregunta: 0, id_pregunta: '', descripcion: '', img_opcion: '', tipo: ''},
            opciones:[],
            formulario:{
              libro:'',
              descripcion:'',
              institucion:'',
              periodo:'',
              estado:'1',
            },
            src_imagen_opcion: '',
            title:'',
            colorx:'success',
            books:false,
            pregunta_delete:'',
        }
    },
    components:{
        flatPickr,
        vSelect,
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getLibros();
        me.getarregloLibros();
    },
    mounted(){
        let me = this;
        me.title = "Preguntas para la prueba diagnóstica"
    },
    methods:{
        getarregloLibros(){
            let me = this;
            this.$http.get(this.$server_url + 'diagnostico?getBooks=yes')
                .then(function (res) {
                    me.arregloLibros = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        openEditar(tr){
            let me = this;
            me.formulario.libro = tr.libro_id
            me.getPreguntas()
            me.popupAgregar = true;
            me.books = true
        },
        addForm(){
            let me = this;
            me.popupAgregar = true;
            me.books = false
        },
        getPreguntas(){
            let me = this;
            me.opciones = []
            if(me.formulario.libro == '' || me.formulario.libro == null || me.formulario.libro == undefined){
                me.$vs.notify({
                    text:'Debe seleccionar un libro.',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return;
            }
            this.$http.get(this.$server_url + 'diagnostico?getPreguntas=yes&libro_id='+me.formulario.libro)
                .then(function (res) {
                    me.opciones = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })

        },
        getLibros() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url + 'listaLibro')
                .then(function (res) {
                    me.libros = res.data.libros
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        mostrarImg(file, img){
            let me = this;
            me.src_imagen_opcion = ' ';
            me.src_imagen_pregunta = ' ';
            var archivo = document.getElementById("file"+file).files[0];
            var reader = new FileReader();
            if (me) {
                reader.readAsDataURL(archivo );
                reader.onloadend = function () {
                    //document.getElementById("img"+img).style.display = "block";
                    document.getElementById("img"+img).src = reader.result;
                }
            }
        },
        cargarOpcion(){
            let me = this;
            if(me.opcion.descripcion.trim() == ""){
                me.$vs.notify({
                text:'Debe ingresar la descripción de la pregunta.',
                color:'warning',
                iconPack: 'feather',
                icon:'icon-check'})
                return
            }
            if(me.formulario.libro == '' || me.formulario.libro == null || me.formulario.libro == undefined){
                me.$vs.notify({
                    text:'Debe seleccionar un libro.',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
            }else{
                me.$vs.loading()
                const formData = new FormData();
                let fileImgPreg = document.getElementById("file2").files[0];
                let tipo = 0;
                if( me.opcion.tipo === true ){
                    tipo = 1;
                }
                formData.append('pregunta',     me.opcion.descripcion);
                formData.append('imagen',       fileImgPreg);
                formData.append('opcion',       tipo);
                formData.append('libro_id',     me.formulario.libro);
                axios.post(this.$data_url+'api/cargarOpcionDiagnostico', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.opciones = res.data;
                    me.opcion.descripcion = '';
                    me.opcion.tipo = '';
                    me.src_imagen_opcion = '';
                    me.opcion.id_opcion_pregunta = 0;
                    document.getElementById("file2").value = '';
                    me.$vs.notify({
                    text:'Se guardo correctamente',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    me.getarregloLibros()
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                    console.log(error);
                })
            }
        },
        editarOpcion(item){
            let me = this;
            me.opcion.pregunta = '';
            document.getElementById("file2").value = '';
            me.opcion.descripcion        = item.pregunta;
            me.opcion.tipo               = item.opcion;
            me.opcion.id_opcion_pregunta = item.id;
            img_opcion_old = item.imagen;
            me.src_imagen_opcion = this.$data_url+'archivos/diagnostico/img/img_preguntas/'+item.imagen;
        },
        confirmEditarOpcion(item){
            let me = this;
            me.editarOpcionActiva= false;
            let fileImgOpcion;
            fileImgOpcion = document.getElementById("file2").files[0];
            if(fileImgOpcion === undefined ){
                fileImgOpcion = item.img_opcion;
            }
            let tipo = 0;
            if( me.opcion.tipo === true || me.opcion.tipo === 1 ){
                tipo = 1;
            }
            const formData = new FormData();
            formData.append('pregunta', me.opcion.descripcion);
            formData.append('opcion', tipo);
            formData.append('img_opcion', fileImgOpcion);
            formData.append('img_opcion_old', img_opcion_old);
            formData.append('id', item.id_opcion_pregunta);
            formData.append('libro_id',     me.formulario.libro);
            axios.post(this.$data_url+'api/editarOpcionDiagnostico', formData).
            then(res => {
                me.opciones = res.data;
                me.editarOpcionActiva = false;
                me.opcion.descripcion = '';
                me.opcion.tipo = '';
                me.src_imagen_opcion = '';
                me.opcion.id_opcion_pregunta = 0;
                me.$vs.notify({
                text:'Se guardo correctamente',
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        quitarOpcion(item){
            let me = this;
            me.pregunta_delete  = item
            this.$http.get(this.$server_url+'diagnostico/'+item.id)
                .then(function (res) {
                    if(res.data.status == 0){
                        me.$vs.notify({
                        text:res.data.message,
                        color:'danger',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        return
                    }
                    me.removePregunta()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
        },
        removePregunta(){
            let me = this;
            let formData = new FormData();
            formData.append('id',me.pregunta_delete.id)
            me.$vs.loading()
            axios.post(this.$data_url+'api/eliminarOpcionDiagnostica', formData)
            .then(res => {
                me.removeItemFromArr(me.opciones, me.pregunta_delete)
                me.pregunta_delete = ''
                me.$vs.notify({
                text:"Se elimino correctamente",
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
                me.$vs.loading.close()
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        removeItemFromArr (arr, item) {
            const i = arr.indexOf(item)
            arr.splice(i, 1)
        },
         openConfirm(tr){
            let me = this;
            me.id = tr.id
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar?',
                accept:this.eliminarLink
            })
        },
        eliminarLink(){
        let me = this
        me.$vs.loading()
        this.$http.delete(this.$server_url+'formularioDocente/'+me.id)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.status == 0){
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'danger',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle',
                        time:3000,
                    })
                    return
                }
                me.$vs.notify({
                    text: 'Se elimino correctamente el formulario',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                me.getForms()
            })
            .catch(function (error) {
            me.$vs.loading.close()
            console.log(error)
            })
        },
        limpiar(){
          let me                        = this;
          me.formulario.id              = 0
          me.formulario.toDate          = null
          me.formulario.descripcion     = ""
          me.formulario.institucion     = ""
          me.formulario.periodo         = ""
          me.formulario.estado          = 1
          me.formulario.libro           = ""
          me.opcion.descripcion         = '';
          me.opcion.tipo                = '';
          me.src_imagen_opcion          = '';
          me.opcion.tipo                = false
          me.opcion.id_opcion_pregunta  = 0;
          me.opciones                   = []
          me.editarOpcionActiva         = false
        },
    }
}
</script>
