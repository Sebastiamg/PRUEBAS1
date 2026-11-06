<template>
    <div class="mt-2">
        <div class="vx-row mt-2">
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Asignatura: </div>
                <v-select class="mb-4 w-full" v-model="asignaturaSelect" :options="asignaturas" label="nombreasignatura" :reduce="asignaturas => asignaturas.idasignatura" />
                <!-- {{ asignaturaSelect }} -->
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <div style="font-size: 12px; ">Unidad: </div>
                <v-select class="mb-4 w-full" v-model="unidadesSelect" :options="unidades" label="nombre_unidad" :reduce="unidades => unidades.id" />
                <!-- {{ unidadesSelect }} -->
            </div>
            <div class="vx-col w-full" align="left">
                <vs-input type="text" class="inputx w-full mb-6" v-model="datos.titulo" maxlength="200" label="Nombre de la ficha" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <small>Tipo de ficha</small> <br />
                <form>
                    <vs-radio class="m-3" v-model="datos.tipo" vs-value="0">Sin Guia</vs-radio>
                    <vs-radio class="m-3" v-model="datos.tipo" vs-value="1">Con Guia</vs-radio>
                </form>
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
                <small>Estado</small> <br />
                <form>
                    <vs-radio class="m-3" v-model="datos.estado" vs-value="1">Activo</vs-radio>
                    <vs-radio class="m-3" v-model="datos.estado" vs-value="0">Inactivo</vs-radio>
                </form>
            </div>
            <vs-divider>Archivos</vs-divider>
            <div style="margin-top: -5px;">
                <p class="font-bold letra">Seleccione los archivos (Máximo 20 MB):</p>
                <br>
                <p>
                    <input type="file" name="file1" id="file1" multiple class="inputfile" style="display: none;" v-on:change="mostrarImg">
                    <label for="file1" class="farchivo">
                        <ion-icon name="download-outline" style="position: relative;top:3px;font-size: 15px;"></ion-icon> <span class="ml-1" style="font-size: 12px;">Buscar Archivo</span>
                    </label>
                </p>
            </div>
            <br>
        </div>
        <br>
        <div class="row mt-1">
            <div class="flex">
                <div class="flex" v-for="(tr,key) in attachmentArray" :key="key"> 
                    <div class="flex ml-2" style="flex-direction: column;">
                        <!--BASE-->
                        <div v-if="tr.local == 1">
                            <img id="img1" v-if="tr.tipo == 'img'" width="100" class="img-responsive mb-2 ml-1" :src="$data_url+'archivos/fichas/'+tr.url" style="border-radius: 5px;max-height: 60px;">
                            <img v-if="tr.tipo == 'other'" style="max-height: 60px;width: 50px;"  src="@/assets/images/file-icons/doc.png"/>
                            <small class="mt-1">{{ tr.name }}</small>
                        </div>
                        <!--LOCAL-->
                        <div v-else>
                            <img id="img1" v-if="tr.tipo == 'img'" width="100" class="img-responsive mb-2 ml-1" v-bind:src="tr.img" style="border-radius: 5px;max-height: 60px;">
                            <img v-else style="max-height: 60px;width: 50px;"  src="@/assets/images/file-icons/doc.png"/>
                            <small class="mt-1">{{ tr.name }}</small>
                        </div>
                    </div>
                    <vs-button radius type="line"  @click="removeItemFromArr(attachmentArray,tr)" class="ml-2 mt-4" color="danger" icon="delete"></vs-button>
                </div>
            </div> 
        </div>
        <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-5" align="left">
            <vs-button :icon="btn_icon" :color="btn_color" @click="f_guardar()">{{ btn_txt }} Ficha</vs-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import vSelect from 'vue-select';
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            btn_icon: '',
            btn_color: '',
            btn_txt: '',
            mensaje: '',
            asignaturas: [],
            asignaturaSelect: '',
            unidades: [{
                "id": 1,
                "nombre_unidad": 'Unidad 1'
            }, {
                "id": 2,
                "nombre_unidad": 'Unidad 2'
            }, {
                "id": 3,
                "nombre_unidad": 'Unidad 3'
            }, {
                "id": 4,
                "nombre_unidad": 'Unidad 4'
            }, {
                "id": 5,
                "nombre_unidad": 'Unidad 5'
            }, {
                "id": 6,
                "nombre_unidad": 'Unidad 6'
            }, {
                "id": 7,
                "nombre_unidad": 'Unidad 7'
            }, {
                "id": 8,
                "nombre_unidad": 'Unidad 8'
            }],
            unidadesSelect: {},
            modalAdd: false,
            listaDatos: [],
            datos: {},
            titulo: '',
            //variables de files
            attachmentArray:[],
            //fin variables de files
        }
    },
    mounted() {
        let me = this;
        me.getAsignaturas();
        me.f_agregar(me.ficha)
    },
    props:{
        ficha:{
            type:Object,
            default:{}
        },
    },
    methods: {
        getFiles(){
            let me = this;
            this.$http.get(this.$server_url + 'fichas/'+me.ficha.id)
                .then(res => {
                    let datos = res.data.files
                    if(me.datos.length == 0){
                        me.attachmentArray = []
                        return 
                    }
                    datos.forEach(element => {
                        var cal = new Object();
                        cal.id          = element.id
                        cal.ficha_id    = element.ficha_id
                        cal.name        = element.archivo
                        cal.url         = element.url
                        let tipo = ""
                        if(element.ext == "PNG" || element.ext == "png" || element.ext == "JPEG" || element.ext == "jpeg" || element.ext == "JPG" || element.ext == "jpg"){
                            tipo = "img"
                        } 
                        else{
                            tipo = "other"
                        }
                        cal.tipo        = tipo
                        cal.local       = 1
                        me.attachmentArray.push(cal)
                    });
                })
                .catch(error => {
                    console.log(error)
                })
        },
        getAsignaturas() {
            let me = this;
            this.$http.get(this.$server_url + 'asignaturasActi')
                .then(res => {
                    me.asignaturas = res.data;
                })
                .catch(error => {
                    console.log(error)
                })
        },
        f_agregar() {
            let me = this;
            let item = me.ficha
            me.datos = {
                'id': 0,
                'titulo': '',
                'tipo': 0,
                'estado': 1,
            }
            me.btn_icon = 'save';
            me.btn_color = 'success';
            me.btn_txt = 'Agregar';
            me.titulo = 'Agregar ficha';
            me.mensaje = 'Ficha registrada correctamente';
            if (item.id != undefined) {
                me.getFiles()
                me.btn_icon = 'edit';
                me.btn_color = 'warning';
                me.btn_txt = 'Editar';
                me.titulo = 'Editar ficha';
                me.datos = {
                    'id': item.id,
                    'titulo': item.titulo,
                    'tipo': item.tipo,
                    'estado': item.estado,
                }
                me.asignaturaSelect = item.id_asignatura;
                me.unidadesSelect = me.unidades[item.id_unidad-1].id;
                me.mensaje = 'Ficha editada correctamente';
            }
        },
        f_guardar() {
            let me = this;
            if(me.attachmentArray.length == 0){
              me.$vs.notify({
                text: "Suba un archivo al menos",
                color: 'warning',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
              return
            }
            let msj;
            if (me.datos.titulo == '') {
                msj = 'Ingrese el titulo de la ficha';
                me.f_notificaciones(msj, 'danger', 'icon-alert-triangle')
                return
            }
            if (me.asignaturaSelect == null) {
                msj = 'Seleccione la asignatura';
                me.f_notificaciones(msj, 'danger', 'icon-alert-triangle')
                return
            }
            if (me.unidadesSelect == null) {
                msj = 'Seleccione la unidad';
                me.f_notificaciones(msj, 'danger', 'icon-alert-triangle')
                return
            }
            let formData = new FormData();
            //files
            //enviar solo los files locales
            //local 0 = local; 1 => de la base 
            let arrayOnlyLocal = me.attachmentArray.filter(p => p.local == 0)
            if(arrayOnlyLocal.length == 0){
                formData.append('noSendFiles',   'yes');
            }else{
                let imgsEnviar = []
                //setear only files
                arrayOnlyLocal.forEach(element => {
                    imgsEnviar.push(element.file)
                });
                for(let i=0; i<arrayOnlyLocal.length;i++){
                    formData.append('archivos[]',   imgsEnviar[i]);
                }  
            }
            formData.append('id',               me.datos.id)
            formData.append('titulo',           me.datos.titulo)
            formData.append('tipo',             me.datos.tipo)
            formData.append('estado',           me.datos.estado)
            formData.append('id_asignatura',    me.asignaturaSelect)
            formData.append('id_unidad',        me.unidadesSelect)
            formData.append('periodo_id',       localStorage.periodo_id)
            const config = { headers: { 'Content-Type': 'multipart/form-data' } };
            me.$vs.loading();
            axios.post(this.$data_url + 'api/saveFichas', formData, config)
            // this.$http.post(this.$server_url + 'fichas', me.datos)
                .then((result) => {
                    me.$vs.loading.close();
                    // console.log('ficha save', result.data);
                    me.f_notificaciones(me.mensaje, 'success', 'icon-alert-triangle');
                    me.$emit('recharge',true)
                })
                .catch((err) => {
                    me.$vs.loading.close();
                    console.log(err)
                    let msj = 'Error al registrar la ficha';
                    me.f_notificaciones(msj, 'danger', 'icon-alert-triangle')
                })
        },
        f_notificaciones(msj, color, icono) {
            let me = this;
            me.$vs.notify({
                text: msj,
                color: color,
                iconPack: 'feather',
                icon: icono
            })
            return;
        },
        //METODOS FILES
        mostrarImg(e){
            let me = this;
           // var archivo = document.getElementById("file1").files[0];
            let selectedFiles = e.target.files;
            for(let i=0;i<selectedFiles.length;i++){
                // this.attachmentArray.push(selectedFiles[i]);
                let archivo = selectedFiles[i]
                me.setFile(archivo)
            }
        },
        setFile(archivo){
            let me = this;
            let tipo =""
            if(archivo.type == "image/png" || archivo.type == "image/gif" || archivo.type == "image/jpeg" || archivo.type == "image/jpg"){
               tipo = "img"
            } 
            else{
               tipo = "other"
            }
            var reader = new FileReader();
            if (me) {
                    reader.readAsDataURL(archivo );
                    reader.onloadend = function () {
                        var cal      = new Object();
                        cal.file     = archivo
                        cal.img      = reader.result
                        cal.tipo     = tipo
                        cal.name     = archivo.name
                        //local 0 ; 1 de la base
                        cal.local    = 0
                        me.attachmentArray.push(cal)
                    } 
                }
            return me.attachmentArray
        },
        removeItemFromArr (arr, item) {
            let me = this;
            const i = arr.indexOf(item)
            arr.splice(i, 1)
            if(item.local == 1){
                me.deleteOnlyFile(item.id)
            }
        },
        deleteOnlyFile(id){
            let me = this;
            axios.get(this.$data_url + 'api/deleteFileFicha/'+id)
            .then(res => {
            })
            .catch(error => {
                console.log(error)
            })
        }
        //FIN METODOS FILES
    },
}
</script>
<style scoped>
.farchivo{
    margin-top: 50px!important;
    cursor: pointer; 
    /* color: gray; */
     width: 200px; 
    font-size: 11px;
    line-height: 80%;
    transition: 0.5s ease all;
    padding: 10px 10px;
    background-color: DodgerBlue;
    border: none;
    color: white;
    border-radius: 5px;
    margin-left: 10px;
}
.farchivo:hover{
    background-color: #7C7B89;
    color:white;
    border-radius: 5px;
}
</style>
