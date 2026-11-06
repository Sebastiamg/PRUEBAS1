<template>
<div>
    <vs-alert active="true" class="mt-2 titulo">
        <p style="text-align: center;"> <i class="fa fa-camera" aria-hidden="true"></i> {{ tipoMuestra }} muestras <span style="font-weight: 400;">(Debe Ingresar una imagen para la evidencia)</span></p>

    </vs-alert>

    <vs-row v-if="seleccionadoInsitucion ==  false" class="mt-5">
        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
            <p style="color:red;" v-if="nombreInstitucion == '' || nombreInstitucion == null ">
                <vs-chip color="danger">Sin Institución </vs-chip>
            </p>
            <vs-chip color="success" v-else>
                Institución {{ nombreInstitucion}}
            </vs-chip>
        </vs-col>
    </vs-row>

    <vs-row v-if="seleccionadoInsitucion == false" class="mt-2">
        <vs-col vs-type="flex" vs-justify="left" vs-align="left" vs-w="6">
            <vs-button size="small" color="success" style="border-radius:10px;" @click="seleccionadoInsitucion = true;error = false" icon="control_point" type="line">
                Asignar Institución de prolipa
            </vs-button>
            <vs-button size="small" style="border-radius:10px;" icon="library_add_check" class="ml-1" @click="popupAddNuevaInstitucion = true;" type="line">Añadir nueva institución</vs-button>
        </vs-col>
    </vs-row>

    <div style="width:100%;display:flex;" v-if="seleccionadoInsitucion ==  true" class="mt-5">
        <div style="width:70%;">
            <vs-input icon="search" style="width:100%;" placeholder="Search" @keyup.enter="getInstitucion()" v-model="busquedaInstitucion" />
        </div>

        <div style="width:30%;margin-left:15px;display:flex;">

            <vs-button radius color="warning" @click="getInstitucion()" type="filled" icon="search"></vs-button>
            <vx-tooltip style="display: inline-block;" text="Regresar" position="top" color="primary">
                <vs-button radius color="danger" class="ml-2" @click="seleccionadoInsitucion = false" type="filled" icon="reply"></vs-button>
            </vx-tooltip> &nbsp;

        </div>
    </div>

    <div v-if="instituciones.length >0">
        <vs-table stripe max-items="5" search pagination :data="instituciones">
            <template slot="header">
                <div class="vx-row">
                    <div class="vx-col w-full m-3">
                        Cantidad: {{instituciones.length}}
                    </div>

                </div>
            </template>
            <template slot="thead">
                <vs-th sort-key="nombreInstitucion">Institución</vs-th>
                <vs-th sort-key="nombre">Localidad</vs-th>
                <vs-th>Acciones</vs-th>
            </template>
            <template slot-scope="{data}">
                <vs-tr :key="indextr" v-for="(tr, indextr) in data">

                    <vs-td :data="data[indextr].nombreInstitucion">
                        {{data[indextr].nombreInstitucion}}<br>

                    </vs-td>
                    <vs-td :data="data[indextr].nombreregion">
                        {{data[indextr].nombreregion}} <br>
                        <small>{{data[indextr].ciudad}}</small>
                    </vs-td>
                    <vs-td>
                        <div class="flex">
                            <vs-button size="small" type="relief" style="border-radius: 5px;" icon-pack="feather" icon="icon-bookmark" class="mr-2" color="primary" @click="asginarInstitucion(tr)">
                                Asignar
                            </vs-button>
                        </div>
                    </vs-td>
                </vs-tr>
            </template>
        </vs-table>
    </div>

    <div v-if="seleccionadoInsitucion == false">
        <vs-row class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6" class="mt-4">

                <flat-pickr :config="configdateTimePicker" v-model="fentregar" placeholder="Seleccione una fecha de entrega" style="display: inline-block;width: 97%;" />

            </vs-col>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                <vs-input label="Persona que solicita" class="w-full" placeholder="Persona que solicita" v-model="persona_solicita"/>
            </vs-col>
        </vs-row>

        <vs-row class="mt-2">
            <p class="ml-2">Observación</p>
            <vs-col class="mt-1" vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-textarea counter="500" style="width:100%;" label="Mensaje" :counter-danger.sync="counterDanger" v-model="seguimiento.observacion" />
            </vs-col>
        </vs-row>

        <vs-row class="mt-2"> 
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <div v-if="seguimiento.foto_evidencia == '' || seguimiento.foto_evidencia == null">
                    <p>Sin foto todavia</p>
                </div>
                <div v-else style="box-shadow:5px 4px 20px #ccc;" class="mt-5">
                    <p>Imagen actual:</p>
                    <img style="width: 100%;border-radius:10px; 20px 30px"  :src="$data_url+'archivos/'+'seguimiento/'+'muestra/'+seguimiento.foto_evidencia">
                </div>
            </vs-col>
            <br/>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-5">
                <label class="form-block-input" style="position: relative;right:15px;">
                    <input type="file" class="upload-file form-file-span"  hidden @change="fieldChange" />
                    <span class="form-file-span"><i class="fa fa-cloud-upload"   aria-hidden="true"></i> Selecciona un archivo</span>
                </label>
                
                <br>

            </vs-col>
                <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12" class="mt-5">
                <p  class="ml-5 mt-5" style="color:#ccc;font-weight:500">Seleccionado {{archivoName}}</p>    
            </vs-col>
        </vs-row>

        <vs-row v-if="tipoMuestra == 'Crear'">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
               
                <vs-list>
                    <vs-list-header></vs-list-header>
                    <vs-row v-for="(input,k) in inputs" :key="k">

                        <vs-col vs-type="flex" style="flex-direction: column;" vs-justify="center" vs-align="center" vs-lg="5" vs-w="6" vs-xs="6" vs-sm="6">
                            <vs-list-item title="Seleccione el libro"></vs-list-item>
                            <v-select :options="libros" :reduce="libros => libros" v-model="input.libro" label="nombrelibro" class="w-full" />

                        </vs-col>
                        <vs-col vs-type="flex" style="flex-direction: column;" vs-justify="center" vs-align="center" vs-lg="5" vs-w="6" vs-xs="6" vs-sm="6">
                            <vs-list-item title="Cantidad"></vs-list-item>
                            <vs-input  type="number"  placeholder="Cantidad" style="width: 95%;" v-model="input.cantidad" />
                        </vs-col>
             
                        <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="2" class="mt-5">
                            <vx-tooltip style="display: inline-block;" text="Eliminar fila" position="top" color="primary">
                                <vs-button color="danger" size="large" radius icon="delete" type="line" v-if="k>0" @click="remove(k)" v-show="k == inputs.length-1"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip style="display: inline-block;" text="Agregar fila" position="top" color="primary">
                                <vs-button color="success" size="large" radius icon="add" type="line" @click="add(k)" v-show="k == inputs.length-1">
                                </vs-button>
                            </vx-tooltip>
                        </vs-col>
                    </vs-row>
                </vs-list>
            </vs-col>
        </vs-row>

        <vs-row style="margin-top:80px;">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button @click="uploadFile()" color="success" type="gradient">Guardar Muestras</vs-button>
            </vs-col>
        </vs-row>

    

    </div>

    <!--MODAL PARA AGREGAR NUEVA INSTITUCION-->

    <vs-popup background-color="rgba(255,255,255,.6)"  title="Agregar Nueva Institución" :active.sync="popupAddNuevaInstitucion">

        <vs-row class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <ul class="leftx" style="display:flex;flex-direction: row;">
                    <li class="ml-2">
                        <vs-radio v-model="temporalInstitucion.region" vs-name="radios1" vs-value="1">Sierra</vs-radio>
                    </li>
                    <li class="ml-2">
                        <vs-radio v-model="temporalInstitucion.region" vs-name="radios1" vs-value="2">Costa</vs-radio>
                    </li>
                </ul>
            </vs-col>
        </vs-row>
        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <div class="vx-col w-full mt-5">
                    Seleccione una ciudad:
                    <v-select :options="arregloCiudad" :reduce="arregloCiudad => arregloCiudad" label="nombre" class="w-full" v-model="temporalInstitucion.ciudad" />
                </div>
            </vs-col>
        </vs-row>
        <vs-row class="mt-2">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-input label="Escriba un nombre para la institución" class="w-full" v-model="temporalInstitucion.nombre_institucion" placeholder="Institución" />
            </vs-col>
        </vs-row>

        <vs-row class="mt-5">
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button @click="agregarInstitucionTemporal()" type="gradient">Agregar Institución</vs-button>
            </vs-col>
        </vs-row>
    </vs-popup>

  


</div>
</template>

<script>
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    data() {
        return {
            busquedaInstitucion: '',
            seleccionadoInsitucion: false,
            error: false,
            popupAddNuevaInstitucion: false,
            popupEditEvidencia:false,
            institucion: '',
            institucion_id: '',
            periodo: '',
            periodo_id: '',
            arregloCiudad: [],
            temporalInstitucion: {
                ciudad: '',
                nombreInstitucion: '',
                region: '2',
            },
            institucion_id_temporal: '',
            estado_institucion_temporal: 0,
            periodo_id_temporal: 0,
            nombreInstitucionTemporal: '',
            estado: '5',
            usuario: [],
            seguimiento: {
                observacion: '',
                solicitante: '',
                foto_evidencia:''
            },
            configdateTimePicker: {
                enableTime: true,
                dateFormat: 'Y-m-d'
            },
            fentregar: null,
            counterDanger: false,
            libros: [],
            //para los inputs
            inputs: [{
                cantidad: '',
                libro: '',
                evidencia: [],

            }],
            attachments: [],
            form: new FormData,
            numeroIteM: '0',
            instituciones: [],  
            errorImage:'',
            tamanioError:'',
            archivoName:'',
            persona_solicita:'',
        }
    },
    props: {
        tipoMuestra: {
            type: String,
            default: "Crear"
        },
        id: {
            type: String,
            default: "0"
        },
        observacion: {
            type: String,
            default: ""
        },
        solicitante: {
            type: String,
            default: ""
        },
        nombreInstitucion: {
            type: String,
            default: ""
        },
        fecha_entrega: {
            type: String,
            default: null
        },
        foto_evidencia:{
            type:String,
            default:''
        },

    },
    components: {
        'v-select': vSelect,
        flatPickr

    },
    created() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.institucion = localStorage.getItem("institucion_seguimiento_nombre")
        me.institucion_id = localStorage.getItem("institucion_seguimiento_id")
        me.periodo = localStorage.getItem("institucion_seguimiento_periodo")
        me.periodo_id = localStorage.getItem("institucion_seguimiento_periodo_id")
        me.isAdmin = localStorage.getItem("adminSeguimiento")
        me.getLibros()
        me.listaCiudades()
        me.fentregar = me.fecha_entrega
      
        if(me.tipoMuestra == "Editar"){
            me.persona_solicita = me.solicitante
            me.seguimiento.observacion = me.observacion
            me.seguimiento.foto_evidencia = me.foto_evidencia
            me.DetalleMuestras()
        }
    },
    methods: {

        //lista de ciudades para usar en el select
        listaCiudades() {
            let me = this
            this.$http.get(this.$server_url + `ciudad`).then(res => {
                    me.arregloCiudad = res.data;
                })
                .catch(function (error) {
                    console.log(error)
                })
        },
        asginarInstitucion(tr) {
            let me = this;
            me.institucion_id = tr.idInstitucion
            me.nombreInstitucion = tr.nombreInstitucion
            me.estado_institucion_temporal = 0;
            me.seleccionadoInsitucion = false;
            me.instituciones = []
        },
        //para obtener las instituciones de prolipa
        getInstitucion() {
            let me = this;
            me.instituciones = [];
            if (me.busquedaInstitucion.length < 5) {
                me.$vs.notify({
                    text: 'Minimo 5 caracteres de busqueda',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                 return false;
            }

            me.$vs.loading()
            this.$http.get(this.$server_url + 'listaInsitucionAsesor?busqueda=' + me.busquedaInstitucion + '&cedula=' + me.usuario.cedula)
                .then(function (res) {
                    // me.tmpInstituciones = res.data;
                    me.instituciones = res.data;
                    // me.filtroRegion();
                    me.$vs.loading.close()
                    if (res.data.message) {
                        me.$vs.notify({
                            text: res.data.message,
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-user',
                            time: 8000
                        })
                    }
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        agregarInstitucionTemporal() {
            let me = this;
            if (me.temporalInstitucion.nombre_institucion == "" || me.temporalInstitucion.nombre_institucion == null || me.temporalInstitucion.nombre_institucion == undefined) {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Debe escribir una institución por favor'
                })
                return false;
            }
            let formData = new FormData();
            formData.append('nombre_institucion', me.temporalInstitucion.nombre_institucion);
            formData.append('ciudad', me.temporalInstitucion.ciudad.nombre);
            formData.append('region', me.temporalInstitucion.region);
            formData.append('asesor_id', me.usuario.idusuario);
            me.$vs.loading()
            this.$http.post(this.$server_url + 'GuardarInstitucionTemporal', formData)
                .then(res => {
                    me.$vs.loading.close()
                    me.popupAddNuevaInstitucion = false;
                    me.seleccionadoInsitucion = false;
                    me.nombreInstitucion = me.temporalInstitucion.nombre_institucion
                    me.institucion_id_temporal = res.data.institucion_temporal_id
                    me.instituciones = []
                    me.periodo_id_temporal = res.data.periodo_id
                    me.estado_institucion_temporal = 1;
                    me.$vs.notify({
                        text: "Se creo la institución correctamente",
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                })
        },
        NumeroItem(id) {
            let me = this;
            localStorage.setItem('NumeroItem', id)
            me.numeroIteM = localStorage.getItem('NumeroItem', id)
        },
        add(k) {
            let me = this;
            if (this.inputs[k].libro == "") {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Debe seleccionar un libro'
                })
                return false;
            }

            if (this.inputs[k].cantidad.length == "") {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'Debe escribir una cantidad de entrega'
                })
                return false;
            }

            this.inputs.push({
                cantidad: '',
                libro: '',

            })
            
        },

        remove(index) {
            this.attachments.splice(index, 1)
            this.inputs.splice(index, 1)
        },
    
         //para subir archivos
        fieldChange(e){
            let me = this;
                me.errorImage = 'no'
                me.tamanioError="no"
                this.attachments = [];
                let selectedFiles=e.target.files;
                let validar = e.target.files[0].type;

                let tamanio = e.target.files[0].size;
                
                if(tamanio > 1000000){
                    me.tamanioError="yes"
                    me.$vs.notify({
                        text:'El tamaño de la imagen excede 1MB',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-check'})  
                        return false;  
                }
                
            
                if(validar == 'image/png' || validar == 'image/jpg' || validar == 'image/jpeg'){
                    for(let i=0;i<selectedFiles.length;i++){

                      this.attachments.push(selectedFiles[i]);
                      localStorage.setItem('nameArchivo',this.attachments[0].name)
                      me.archivoName = localStorage.getItem("nameArchivo")
                     }
                     me.errorImage = 'no'
                }else{
                  me.errorImage = 'yes'
                  me.$vs.notify({
                    text:'Formato de imagen no aceptada solo se acepta png/jpg/jpeg',
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    return false;
                  
                
                }   
        },


        //para guardar
        uploadFile() {
            let me = this;
        
            if (me.seguimiento.observacion.length >= 500) {
                me.$vs.notify({
                    color: 'primary',
                    title: 'Mensaje',
                    text: 'El observación debe tener un maximo de 500 caracteres'
                })
                return false;
            }
        
            if (me.fentregar == null) {
                me.$vs.notify({
                    text: 'Debe escoger una fecha de entrega',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                return false;
            }


            if (me.tipoMuestra == "Editar") {
                this.form.append('muestra_id', me.id);
            }
            if(me.tipoMuestra == "Crear"){
                if(me.attachments.length == 0){
                    me.$vs.notify({
                    text:'Seleccione una imagen antes de enviar',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})  
                    return false; 
                }
            }

            //Si se envia imagenes
            for(let i=0; i<this.attachments.length;i++){
                if(me.attachments.length == 0){
                }else{
                 this.form.append('enviarArchivo','yes');
                 this.form.append('archivo[]',this.attachments[i]);
                }
            }

            this.form.append('fecha_entrega', me.fentregar);
            this.form.append('observacion', me.seguimiento.observacion);
            this.form.append('persona_solicita', me.persona_solicita);
            this.form.append('institucion_id', me.institucion_id);
            this.form.append('institucion_id_temporal', me.institucion_id_temporal);
            this.form.append('estado_institucion_temporal', me.estado_institucion_temporal);
            this.form.append('periodo_id_temporal', me.periodo_id_temporal);
            this.form.append('nombreInstitucion', me.nombreInstitucion);
            this.form.append('tipoMuestra', me.tipoMuestra);
            if (me.isAdmin == "yes") {
                me.asesorDesdeAdmin = localStorage.getItem("institucion_seguimiento_asesor_id")
                this.form.append('usuario_editor', me.usuario.idusuario);
                this.form.append('admin', "yes");
            } else {
                me.asesorDesdeAdmin = me.usuario.idusuario
            }
            this.form.append('asesor_id', me.asesorDesdeAdmin);
            this.form.append('periodo_id', me.periodo_id)

            for (let i = 0; i < this.inputs.length; i++) {
                // this.form.append('archivo[]', me.inputs[i].evidencia);
                this.form.append('cantidad[]', me.inputs[i].cantidad);
                this.form.append('libro[]', me.inputs[i].libro.idlibro);
            }
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            };
            document.querySelectorAll('.upload-file').value = [];
            me.$vs.loading()
            axios.post(this.$data_url+'api/muestra', this.form, config)
            // this.$http.post(this.$server_url + 'muestra', this.form, config)
            .then(response => {
                    me.$vs.loading.close()
                    if (response.data.status == "0") {
                        me.$vs.notify({
                            text: 'No se pudo ingresar la informacion',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        this.form = "";
                        me.libro.libro = "";
                        // me.borrartodo()
                        me.inputs.cantidad = "";
                        me.inputs.libro = "";
                        me.inputs.evidencia = "";
                       
                       
                    }
                    if (response.data.status == "1") {
                        me.$vs.notify({
                            text: 'Se guardo correctamente',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })
                        me.$vs.loading.close()
                        location.reload()
                    }
                })
                .catch(response => {
                    me.$vs.loading.close()
                });

        },
        //para obtener el listado de Tipos de Area
        getLibros() {
            let me = this;
            this.$http.get(this.$server_url + 'listaLibro')
                .then(function (res) {
                    me.libros = res.data.libros
                })
                .catch(function (error) {
                    console.log(error + ' error')
                })
        },

      

       
    }
}
</script>

<style scoped>
/* Formato de etiqueta */
.titulo {
    background: #4CB8C4;
    /* fallback for old browsers */
    background: -webkit-linear-gradient(to right, #3CD3AD, #4CB8C4);
    /* Chrome 10-25, Safari 5.1-6 */
    background: linear-gradient(to right, #3CD3AD, #4CB8C4);
    /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
    color: white;
    letter-spacing: 1px;

}

.image1 {
    filter: drop-shadow(0 0 5px coral);
    border-radius: 20px;
    cursor: pointer;
    opacity: 0.7;
}

.image1:hover {
    opacity: 1
}

.form-block-input {

    display: flex;
    max-width: 400px;
    overflow: hidden;
    font-size: 0.9em;
    color: #777;
    margin-left: 50px;
    border: 1px #25a solid;

    padding: 0;
    border-radius: 3px;
    border: none;
}

/* Ocultar campo tipo file */
input[type="file"].form-file {
    display: none;
}

/* Botón para seleccionar archivos */
button.form-file-button {
    vertical-align: middle;
    color: #fff;
    background: #24A6F6;
    margin: 0;
    border: 0;
    width: 50px;
    padding: 2px 8px;
    transform: scaleX(-1);
    /* Invertir botón horizontalmente */
}

/* Lista de archivos */
span.form-file-span {
    flex: 1;
    display: inline-block;
    text-align: left;
    padding: 4px 10px;
    background: #24A6F6;
    color: #fff;
    padding: 10px;
    border-radius: 5px 15px;
    cursor: pointer;
    font-size: 20px;

}

/* Arhchivos en lista */
span.form-files {
    display: inline-block;
    color: #555;
    background: #ccf;

    margin: 2px 8px 2px 0;
    padding: 2px 5px;
    white-space: nowrap;
    border-radius: 3px;
}

/* Quitar margen horizontal al último elemento en la lista */
span.form-block-span:last-child {
    margin: 2px 0;
}
</style>
