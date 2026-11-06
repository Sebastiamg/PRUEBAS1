<template>
<div>
    <vs-card>
        <div class="vx-row m-2">
            <div class="vx-col w-full mb-base" align="left">
                <div v-if="MaterialSend.length == 0 || changeArchivo">
                    <div style="font-size: 12px;">Cargar Archivo </div>
                    <upload :tipo="tipo" :id="MaterialSend.id" class="w-full flex justify-center" v-on:file="info"></upload>
                </div>
               
                <div v-else class="borde-unidad">
                    <div style="font-size: 12px;" class="mb-2">Archivo actual: </div>
                    <div class="m-1">
                        <p><b>Archivo:</b></p>
                        <p>{{MaterialSend.archivo}}</p>
                        <p>
                            <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                <vs-button style="display: inline" class="m-1" @click="descargaArchivo(MaterialSend)" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                            </vx-tooltip>
                            <vx-tooltip text="Reemplazar archivo" position="bottom" style="display: inline-block" color="danger">
                                <vs-button style="display: inline" class="m-1" size="small" icon-pack="feather" icon="icon-shuffle" color="danger" type="border" @click="changeArchivo = true;"></vs-button>
                            </vx-tooltip>
                        </p>
                    </div>
                </div>
               
            </div>
            <div class="vx-col w-full" align="left">
                <div style="font-size: 12px; ">Libro: </div>
                 <v-select @input="filtrarUnidades()"  :options="arregloLibros" :reduce="arregloLibros => arregloLibros" label="nombrelibro" class="w-full" v-model="material.libro" />
            </div>
            <div class="vx-col w-full mt-4" align="left">
                <div style="font-size: 12px;">Nombre del material: </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="material.nombre_material" maxlength="300" placeholder="nombre" />
            </div>
            <div class="vx-col w-full" align="left">
                <div style="font-size: 12px;">Descripcion </div>
                <vs-input type="text" class="inputx w-full mb-6" v-model="material.descripcion" maxlength="350" placeholder="descripcion" />
            </div>
            <div class="vx-col w-full mb-base" align="left">
                <div style="font-size: 12px;">Estado </div>
                <vs-radio v-model="material.Estado_idEstado" vs-name="radioEstado" class="m-2" vs-value="1">Activo</vs-radio>
                <vs-radio v-model="material.Estado_idEstado"  vs-name="radioEstado" class="m-2" color="danger" vs-value="0">Inactivo</vs-radio>
            </div>
            <vs-divider>Seleccione los Temas</vs-divider>
            <!--Unidad 1-->
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" align="left">
            <div style="font-size: 12px; ">Unidad 1: </div>
                <v-select @input="filtrarTemas()" disabled :options="arregloTraeUnidades2" :reduce="arregloTraeUnidades2 => arregloTraeUnidades2.id_unidad_libro" label="unidad" class="w-full" v-model="unidades.unidad1" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full " align="left">
                <div style="font-size: 12px; ">Temas: </div>
                <div class="flex">
                    <v-select multiple  :closeOnSelect="false" :options="arregloUnidad1Temas" id="temas" :reduce="arregloUnidad1Temas => arregloUnidad1Temas" label="nombre_tema" class="w-full" v-model="unidades.unidad1Temas" />
                    <vx-tooltip   text="Añadir temas" position="top" color="primary">
                        <vs-button style="margin-left:2px;" @click="verTemas(1,unidades.unidad1);" size="small" color="success" type="flat" icon="add">HAGA CLICK</vs-button>
                    </vx-tooltip>
                </div>
            </div>
            <vs-divider></vs-divider>
            <!--Fin Unidad 1-->
            <!--Unidad 2-->
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-1" align="left">
                <div style="font-size: 12px; ">Unidad 2: </div>
                 <v-select @input="filtrarTemas()" disabled :options="arregloTraeUnidades2" :reduce="arregloTraeUnidades2 => arregloTraeUnidades2.id_unidad_libro" label="unidad" class="w-full" v-model="unidades.unidad2" />
                
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" mt-1 align="left">
                <div style="font-size: 12px; ">Temas: </div>
                <div class="flex">
                    <v-select multiple  :closeOnSelect="false" :options="arregloUnidad2Temas" id="temas" :reduce="arregloUnidad2Temas => arregloUnidad2Temas" label="nombre_tema" class="w-full" v-model="unidades.unidad2Temas" />
                    <vx-tooltip   text="Añadir temas" position="top" color="primary">
                        <vs-button style="margin-left:2px;" @click="verTemas(2,unidades.unidad2);"  color="success" size="small" type="flat" icon="add">HAGA CLICK</vs-button>
                    </vx-tooltip>
                </div>
            </div>
            <vs-divider></vs-divider>
            <!--Fin Unidad 2-->
            <!--Unidad 3-->
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-1" align="left">
                <div style="font-size: 12px; ">Unidad 3: </div>
                 <v-select @input="filtrarTemas()" disabled :options="arregloTraeUnidades2" :reduce="arregloTraeUnidades2 => arregloTraeUnidades2.id_unidad_libro" label="unidad" class="w-full" v-model="unidades.unidad3" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" mt-1 align="left">
                <div style="font-size: 12px; ">Temas: </div>
                <div class="flex">
                    <v-select multiple  :closeOnSelect="false" :options="arregloUnidad3Temas" id="temas" :reduce="arregloUnidad3Temas => arregloUnidad3Temas" label="nombre_tema" class="w-full" v-model="unidades.unidad3Temas" />
                    <vx-tooltip   text="Añadir temas" position="top" color="primary">
                        <vs-button style="margin-left:2px;" @click="verTemas(3,unidades.unidad3);"  color="success" type="flat" size="small" icon="add">HAGA CLICK</vs-button>
                    </vx-tooltip>
                </div>
            </div>
            <vs-divider></vs-divider>
            <!--Fin Unidad 3-->
            <!--Unidad 4-->
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-1" align="left">
                <div style="font-size: 12px; ">Unidad 4: </div>
                 <v-select @input="filtrarTemas()" disabled :options="arregloTraeUnidades2" :reduce="arregloTraeUnidades2 => arregloTraeUnidades2.id_unidad_libro" label="unidad" class="w-full" v-model="unidades.unidad4" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" mt-1 align="left">
                <div style="font-size: 12px; ">Temas: </div>
                <div class="flex">
                    <v-select multiple  :closeOnSelect="false" :options="arregloUnidad4Temas" id="temas" :reduce="arregloUnidad4Temas => arregloUnidad4Temas" label="nombre_tema" class="w-full" v-model="unidades.unidad4Temas" />
                    <vx-tooltip   text="Añadir temas" position="top" color="primary">
                        <vs-button style="margin-left:2px;" @click="verTemas(4,unidades.unidad4);"  color="success" type="flat" size="small" icon="add">HAGA CLICK</vs-button>
                    </vx-tooltip>
                </div>
            </div>
            <vs-divider></vs-divider>
            <!--Fin Unidad 4-->
            <!--Unidad 5-->
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-1" align="left">
                <div style="font-size: 12px; ">Unidad 5: </div>
                 <v-select @input="filtrarTemas()" disabled :options="arregloTraeUnidades2" :reduce="arregloTraeUnidades2 => arregloTraeUnidades2.id_unidad_libro" label="unidad" class="w-full" v-model="unidades.unidad5" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" mt-1 align="left">
                <div style="font-size: 12px; ">Temas: </div>
                <div class="flex">
                    <v-select multiple  :closeOnSelect="false" :options="arregloUnidad5Temas" id="temas" :reduce="arregloUnidad5Temas => arregloUnidad5Temas" label="nombre_tema" class="w-full" v-model="unidades.unidad5Temas" />
                    <vx-tooltip   text="Añadir temas" position="top" color="primary">
                        <vs-button style="margin-left:2px;" @click="verTemas(5,unidades.unidad5);"  color="success" type="flat" size="small" icon="add">HAGA CLICK</vs-button>
                    </vx-tooltip>
                </div>
            </div>
            <vs-divider></vs-divider>
            <!--Fin Unidad 5-->
            <!--Unidad 6-->
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full mt-1" align="left">
                <div style="font-size: 12px; ">Unidad 6: </div>
                 <v-select @input="filtrarTemas()" disabled :options="arregloTraeUnidades2" :reduce="arregloTraeUnidades2 => arregloTraeUnidades2.id_unidad_libro" label="unidad" class="w-full" v-model="unidades.unidad6" />
            </div>
            <div class="vx-col sm:w-1/2 lg:w-1/2 w-full" mt-1 align="left">
                <div style="font-size: 12px; ">Temas: </div>
                <div class="flex">
                    <v-select multiple  :closeOnSelect="false" :options="arregloUnidad6Temas" id="temas" :reduce="arregloUnidad6Temas => arregloUnidad6Temas" label="nombre_tema" class="w-full" v-model="unidades.unidad6Temas" />
                    <vx-tooltip   text="Añadir temas" position="top" color="primary">
                        <vs-button style="margin-left:2px;" @click="verTemas(6,unidades.unidad6);"  color="success" type="flat" size="small" icon="add">HAGA CLICK</vs-button>
                    </vx-tooltip>
                </div>
            </div>
            <vs-divider></vs-divider>
            <!--Fin Unidad 6-->
            <div class="vx-col w-full flex justify-end">
                <vs-button style="display:inline" class="m-2 mb-2 uppercase" type="filled" @click="guardar()"> Guardar </vs-button>
            </div>
        </div>
    </vs-card>
</div>
</template>

<script>
import vSelect from 'vue-select'
import upload from './upload.vue'
export default {
    data() {
        return {
            changeArchivo:false,
            material: {
                Estado_idEstado:'1',
                asignatura_idasignatura:'',
                descripcion:'',
                nombre:'',
                nombre_material:'',
                user_created:'',
                libro:'',
                id:'',
            },
            limiteMegas: 5,
            bytes: 1048576,
            msjError: 'El peso del archivo excede el limite permitido, verifique antes de continuar',
            usuario:'',
            porcentaje1: '',
            pesoArchivo1: '',
            muyPesado1: '',
            msj1: '',
            file1: '',
            asignaturas: [],
            arregloLibros:[],
            arregloTraeUnidades2:[],
            arregloTraerTemas:[],
            unidades:{
                unidad1:'',
                unidad2:'',
                unidad3:'',
                unidad4:'',
                unidad5:'',
                unidad6:'',
                unidad1Temas:[],
                unidad2Temas:[],
                unidad3Temas:[],
                unidad4Temas:[],
                unidad5Temas:[],
                unidad6Temas:[],
            },
            arregloUnidad1Temas:[],
            arregloUnidad2Temas:[],
            arregloUnidad3Temas:[],
            arregloUnidad4Temas:[],
            arregloUnidad5Temas:[],
            arregloUnidad6Temas:[],
        }
    },
    props:{
        MaterialSend:{
            type:Object,
            default:{}
        },
        tipo:{
            type:Number,
            default:0,
        }
    },
    components: {
        'v-select': vSelect,
        upload
    },
    mounted() {
        let me = this
        this.listalibros()
        this.usuario = JSON.parse(localStorage.getItem('usuario'));
        if(me.tipo == 1){
            me.OpenEdit();
        }
    },
    methods: {
        //lista de libros para usar en el select
        listalibros(){
            let me = this
            this.$http.get(this.$server_url+`libroserie`).then(res => {
                me.arregloLibros = res.data.libroslista;
                })
                .catch(function (error) {
                console.log(error)
                })
        },
        info(item) {
            let me = this;
            if(me.tipo == 1){
                this.material.id = me.MaterialSend.id
            }else{
                this.material.id = item.id
            }
            this.material.nombre = item.nombre
            this.material.nombre_material = item.nombre
        },
        OpenEdit(){
            let me                      = this;
            me.material.libro           = { idlibro:me.MaterialSend.libro_id, nombrelibro:me.MaterialSend.nombrelibro }
            me.material.nombre_material = me.MaterialSend.nombre_material
            me.material.descripcion     = me.MaterialSend.descripcion
            me.material.Estado_idEstado = me.MaterialSend.estado
            me.material.nombre          = me.MaterialSend.archivo
            me.filtrarUnidades()
            me.OpenEditTemas()
        },
        OpenEditTemas(){
            let me = this;
            let datos                = me.MaterialSend.temas
            //unidad1
            let unidad1Temas         = datos.filter(p => p.unidad == 1)
            for(let i =0; i<unidad1Temas.length; i++){
                me.unidades.unidad1Temas = JSON.parse(unidad1Temas[i].temas)
            }
            //unidad2  
            let unidad2Temas         = datos.filter(p => p.unidad == 2)
            for(let i =0; i<unidad2Temas.length; i++){
                me.unidades.unidad2Temas = JSON.parse(unidad2Temas[i].temas)
            } 
            //unidad3  
            let unidad3Temas         = datos.filter(p => p.unidad == 3)
            for(let i =0; i<unidad3Temas.length; i++){
                me.unidades.unidad3Temas = JSON.parse(unidad3Temas[i].temas)
            } 
            //unidad4  
            let unidad4Temas         = datos.filter(p => p.unidad == 4)
            for(let i =0; i<unidad4Temas.length; i++){
                me.unidades.unidad4Temas = JSON.parse(unidad4Temas[i].temas)
            } 
            //unidad5 
            let unidad5Temas         = datos.filter(p => p.unidad == 5)
            for(let i =0; i<unidad5Temas.length; i++){
                me.unidades.unidad5Temas = JSON.parse(unidad5Temas[i].temas)
            } 
            //unidad6 
            let unidad6Temas         = datos.filter(p => p.unidad == 6)
            for(let i =0; i<unidad6Temas.length; i++){
                me.unidades.unidad6Temas = JSON.parse(unidad6Temas[i].temas)
            } 
        },
        descargaArchivo(item){
            let me = this;
            if(me.usuario.id_group == 4 || me.usuario.id_group == 6){
                //HISTORICO
                let asignatura_id = item.idasignatura
                let idusuario     = me.usuario.idusuario
                let url           = "material_subir"
                let actividad     = item.nombre_material
                let periodo_id    = localStorage.periodo_id
                this.$http.get(this.$server_url+'conteoActividad?asignatura_id='+asignatura_id+'&idusuario='+idusuario+'&url='+url+'&actividad='+actividad+'&periodo_id='+periodo_id+'&pagina=0&tipo=2')
                .then(function (res) {
                })
                .catch(function (error) {
                    console.log(error + ' error');
                })
            }
           
            //FIN HISTORICO
            let url2 = this.$data_url+'archivos/material_subir/'+item.url
            window.open(url2)
        },
        guardar() {
            let me = this;
            if(me.material.libro == null || me.material.libro == undefined || me.material.libro == ""){
                  me.$vs.notify({
                  text:'Tiene que seleccionar un libro',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check'})
                return false
            }
            if(me.material.nombre == ""){
                  me.$vs.notify({
                  text:'Tiene que subir un archivo',
                  color:'warning',
                  iconPack: 'feather',
                  icon:'icon-check'})
                return false
            }
            me.$vs.loading();
            let formData = new FormData();
            //Editar
            if(me.tipo == 1){
                formData.append('id',                                    me.MaterialSend.id);
            }
            //GUARDAR
            else{
                formData.append('id',                                    me.material.id);
            }
            formData.append('libro_id',                                  me.material.libro.idlibro);
            formData.append('nombre_material',                           me.material.nombre_material);
            if(me.material.descripcion == null || me.material.descripcion == "null"){
                formData.append('descripcion',                           "");
            }else{
                formData.append('descripcion',                           me.material.descripcion);
            }
            formData.append('estado',                                    me.material.Estado_idEstado);
            formData.append('user_created',                              me.usuario.idusuario);
            //save units
            if(me.unidades.unidad1Temas !=undefined)formData.append('unidad1Temas',JSON.stringify(me.unidades.unidad1Temas))
            if(me.unidades.unidad2Temas !=undefined)formData.append('unidad2Temas',JSON.stringify(me.unidades.unidad2Temas))
            if(me.unidades.unidad3Temas !=undefined)formData.append('unidad3Temas',JSON.stringify(me.unidades.unidad3Temas))
            if(me.unidades.unidad4Temas !=undefined)formData.append('unidad4Temas',JSON.stringify(me.unidades.unidad4Temas))
            if(me.unidades.unidad5Temas !=undefined)formData.append('unidad5Temas',JSON.stringify(me.unidades.unidad5Temas))
            if(me.unidades.unidad6Temas !=undefined)formData.append('unidad6Temas',JSON.stringify(me.unidades.unidad6Temas))
            this.$http.post(this.$server_url + 'guardarMaterialSubir',   formData)
                .then(res => {
                    me.$vs.loading.close();
                    me.$vs.notify({
                    text:res.data.message,
                    color:'success',
                    iconPack: 'feather',
                    icon:'icon-check'})
                    var item = {}
                    me.$emit('listado',false)
                    // item.planificacion = {}
                    // item.menu = {
                    //     plista: true,
                    //     pnuevo: false,
                    //     peditar: false
                    // }
                    // me.$emit('item', item)
                })
                .catch(e => {
                    console.log(e)
                    me.$vs.loading.close();
                })
        },
        //filtro para filtrar unidad por libro
        filtrarUnidades(){
            let me = this;
            const formData = new FormData();
                if( me.material.libro.idlibro === undefined ){
                me.$vs.notify({
                    text:'Seleccione una libro antes de filtrar por unidades',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return;
            }
            me.arregloTraeUnidades2 = [];
            me.$vs.loading()
            this.$http.get(this.$server_url+'traerunidades?idlibro='+ me.material.libro.idlibro)
            .then(res => { 
            me.arregloTraeUnidades2 = res.data;
            me.setUnits(me.arregloTraeUnidades2);
            me.$vs.loading.close()
            })
            .catch(function (error) {
                me.$vs.loading.close()
                console.log(error);
            })  
        },
        setUnits(tr){
            let me = this;
            let getUnidad1 = tr.filter(p => p.unit == 1)
            let getUnidad2 = tr.filter(p => p.unit == 2)
            let getUnidad3 = tr.filter(p => p.unit == 3)
            let getUnidad4 = tr.filter(p => p.unit == 4)
            let getUnidad5 = tr.filter(p => p.unit == 5)
            let getUnidad6 = tr.filter(p => p.unit == 6)
            //enviar a las unidades
            me.unidades.unidad1 = getUnidad1
            me.unidades.unidad2 = getUnidad2
            me.unidades.unidad3 = getUnidad3
            me.unidades.unidad4 = getUnidad4
            me.unidades.unidad5 = getUnidad5
            me.unidades.unidad6 = getUnidad6
        },
        verTemas(unidad,unidad_id){
            let me = this; 
            if(unidad_id == undefined || unidad_id == null || unidad_id == ""){
                me.$vs.notify({
                    text:'Seleccione una libro antes de filtrar los temas',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return; 
            }
            me.$vs.loading()
            const formData = new FormData();
            formData.append('id_unidad_libro', unidad_id[0].id_unidad_libro);
            this.$http.post(this.$server_url+'traertemas', formData).then(res => {
                me.$vs.loading.close()
                if(unidad == 1) me.arregloUnidad1Temas = res.data
                if(unidad == 2) me.arregloUnidad2Temas = res.data
                if(unidad == 3) me.arregloUnidad3Temas = res.data
                if(unidad == 4) me.arregloUnidad4Temas = res.data
                if(unidad == 5) me.arregloUnidad5Temas = res.data
                if(unidad == 6) me.arregloUnidad6Temas = res.data
            })
            .catch(function (error) {
                console.log(error);
            })  
        },
    },
}
</script>
<style>
.borde-unidad {
    border: 1px dashed #ccc;
    /* display: inline-block; */
    padding: 6px;
    cursor: pointer;
}
</style>

