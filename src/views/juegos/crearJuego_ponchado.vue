<template>
<div>
<vx-card>
    <div class="vx-row text-center mt-2">
    <div class="vx-col md:w-1/3" align="center">
        <button class="btnwizardSelect" id="btnNav1">1</button><br>
        Juego
    </div>

    <div class="vx-col md:w-1/3" align="center">
        <button class="btnwizard" id="btnNav2">2</button><br>
        Opciones
    </div>

    <div class="vx-col md:w-1/3" align="center">
        <button class="btnwizard" id="btnNav3">3</button><br>
        Ficha técnica
    </div>
</div>

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
        <vs-input label="Título juego"  v-model="juego.nombre_juego" class="w-full" />
    </div>
    <div class="vx-col md:w-1/2 w-full mt-5">
        <vs-input label="Descripción"  v-model="juego.descripcion_juego" class="w-full" />
    </div>

    <div class="vx-col md:w-1/3 w-full mt-5">
        <vs-input type="number" min="1" label="Puntos"  v-model="juego.puntos" class="w-full" />
    </div>
    
    <div class="vx-col md:w-1/3 w-full mt-5">
        <vs-input type="number" min="1" label="Duración(minutos)"  v-model="juego.duracion" class="w-full" />
    </div>

    <div class="vx-col md:w-1/3 w-full mt-5">
        Estado:
        <vs-switch vs-icon-on="check" color="success" v-model="juego.estado_juego" class="mt-2 w-full">
            <span slot="on">Activo</span>
            <span slot="off">Inactivo</span>
        </vs-switch>
    </div>

    <!-- <div class="vx-col md:w-1/2 w-full mt-5">
    Fecha inicio
        <flat-pickr class="w-full" :config="configdateTimePicker" v-model="juego.fecha_inicio" />
    </div>
    <div class="vx-col md:w-1/2 w-full mt-5 mb-6">
    Fecha fin
        <flat-pickr class="w-full" :config="configdateTimePicker" v-model="juego.fecha_fin" />
    </div> -->

    <vs-divider></vs-divider>

    <div class="vx-col md:w-1/2 w-full text-left">
        <vs-button type="filled" @click="$router.go(-1)">Volver</vs-button>
    </div>
    <div class="vx-col md:w-1/2 w-full text-right">
        <vs-button type="filled" v-if="juego.id_juego==='' || juego.id_juego===undefined" @click="agregarJuego(1); pintartab(1)">Siguiente</vs-button>
        <vs-button type="filled" v-else @click="editarJuego(1); pintartab(2)">Siguiente</vs-button>
    </div>
</div>


<div v-if="tabActivo===2">
<div class="vx-row">
    <div class="vx-col md:w-1/3 w-full mt-5" style="border-right: 1px solid #dddd;">
        <vs-button class="mb-4 w-full" type="line" color="black" @click="datos_crear_juego={}; editarPregActivo=false;">Crear pregunta</vs-button>

        <vs-input v-model="datos_crear_juego.pregunta" class="mb-4 w-full" label="Pregunta"></vs-input>
        <vs-input v-model="datos_crear_juego.respuesta" class="mb-4 w-full" label="Respuesta"></vs-input>
        <vs-button class="mb-4 m-1" color="success" type="filled" v-if="editarPregActivo===false" @click="cargarPreguntaJuego(2)">Guardar</vs-button>
        <vs-button class="mb-4 m-1" color="success" type="filled" v-else @click="editarPreguntaJuego(2)">Editar</vs-button>
        <vs-button class="mb-4 m-1" type="filled" color="danger" v-if="editarPregActivo===true" @click="eliminarPreguntaJuego(2)">Eliminar</vs-button>
    </div>

    <div class="vx-col md:w-2/3 w-full mt-8">
        <div class="vx-row" :data="item" :key="index" v-for="(item, index) in preguntas">
            <div class="vx-col md:w-1/5 w-full mb-5 text-center pt-1" style=" font-size: 25px;">
                <b>{{index+1}}</b>
            </div>
            <div class="vx-col md:w-4/5 w-full mb-5 preguntasList" @click="verPregunta(item)">
                Pregunta: {{item.pregunta}}<br>
                Respuesta: {{item.respuesta}}
            </div>
        </div>
    </div>
</div>

<div class="vx-row w-full">
    <vs-divider></vs-divider>

    <div class="vx-col sm:w-1/2 w-full text-left">
        <vs-button type="filled" @click="tabActivo=1; pintartab(1)">Atrás</vs-button>
    </div>
    <div class="vx-col sm:w-1/2 w-full text-right">
        <vs-button type="filled" @click="tabActivo=3; getFicha(); pintartab(3)">Siguiente</vs-button>
    </div>
    </div>

</div>


<div class="vx-row mt-5" v-if="tabActivo===3">
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
</div>
</template>

<script>
    import flatPickr from 'vue-flatpickr-component';
    import 'flatpickr/dist/flatpickr.css';
    import Vue from 'vue'
    import axios from 'axios'
    import vSelect from 'vue-select'
    import moment from 'moment'
    import $ from 'jquery'
    export default {
        data(){
            return {
                asignaturaSelected: '',
                unidadSelected: {id: 1, label: "Unidad 1"},
                datos_crear_juego: {},
                data_juego: [],
                datos_ficha: {},
                juego: {estado_juego: false,},
                preguntas: [],
                temas: [],
                usuario: [],
                asignaturas: [],
                unidades: [
                    { id: "1", label: "Unidad 1", }, { id: "2", label: "Unidad 2", }, { id: "3", label: "Unidad 3", }, { id: "4", label: "Unidad 4", }, { id: "5", label: "Unidad 5", }, { id: "6", label: "Unidad 6", }, { id: "7", label: "Unidad 7", }, { id: "8", label: "Unidad 8", }
                ],
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
            }
        },
        components: {
                'v-select': vSelect,
                flatPickr,
        },
        created(){
            let me = this
            me.asignaturaSelected = {id: localStorage.idasignatura, label: localStorage.nombreasignatura}
            me.usuario = JSON.parse(localStorage.getItem('usuario'))
            me.tipoUsuario = me.usuario.id_group
            me.id_tipo_juego = localStorage.getItem('id_tipo_juego')
            if( JSON.parse(localStorage.getItem('data_juego')) ){
                me.juego = JSON.parse(localStorage.getItem('data_juego'))
                me.id_juego = me.juego.id_juego
                me.asignaturaSelected = {id: me.juego.temas[0].idasignatura, label: me.juego.temas[0].nombreasignatura}
                me.juego.estado_juego = me.juego.estado_juego
            }
        },
        mounted() {
            let me = this
            me.getTemas()
            me.cargarSelecTemas()
            me.getAsignaturas()
        },
        methods: {
            getAsignaturas(){
                let me = this
                if( me.tipoUsuario === 1 ){
                    this.$http.get(this.$server_url+'asignaturasDoc/0').then(res => {
                        me.asignaturas = res.data;
                        me.$vs.loading.close()
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                }else{
                    return
                }
            },
            cargarSelecTemas(){
                let me = this
                if( me.juego.temas ){
                    for( var i=0; i<me.juego.temas.length; i++ ){
                        me.id_temas.push({id: me.juego.temas[i].id, nombre_tema: me.juego.temas[i].nombre_tema})
                    }
                }
            },
            getPreguntas(){
                let me = this
                this.$http.get(this.$server_url+'j_contenidos/'+me.id_juego).then(res => {
                    me.preguntas = res.data;
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            getTemas(){
                let me = this

                if( me.asignaturaSelected.id ){
                    me.$vs.loading()
                    const formData = new FormData();
                        formData.append('asignatura', me.asignaturaSelected.id);
                        formData.append('unidad', me.unidadSelected.id);
                    this.$http.post(this.$server_url+'temasignunidad', formData).then(res => {
                    //this.$http.get(this.$server_url+'temAsignaruta/'+ me.asignaturaSelected.id).then(res => {
                        me.temas = res.data;
                        me.$vs.loading.close()
                    })
                    .catch(function (error) {
                        console.log(error);
                    })
                }else{
                    return
                }
                
            },
            agregarJuego(tab){
                let me = this;
                me.juego.fecha_inicio='2021-01-01 12:00:00'; me.juego.fecha_fin='2021-01-01 12:00:00';
                if( me.id_temas==='' || me.juego.nombre_juego==='' || me.juego.descripcion_juego==='' || me.juego.puntos==='' || me.juego.duracion==='' || me.id_temas===undefined || me.juego.nombre_juego===undefined || me.juego.descripcion_juego===undefined || me.juego.puntos===undefined || me.juego.duracion===undefined || me.id_temas.length < 1 ){
                    me.$vs.notify({
                        text:'Debe completar todos los campos antes de continuar',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-alert-triangle'})
                    return
                }
                
                let estado_juego = 1
                if( me.juego.estado_juego === false ){
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
                this.$http.post(this.$server_url+'j_juegos', formData)
                    .then(res => {
                        me.id_juego = res.data.id_juego
                        me.guardarTemasJuego()
                        me.$vs.loading.close()
                    })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
            editarJuego(){
                let me = this;
                me.juego.fecha_inicio='2021-01-01 12:00:00'; me.juego.fecha_fin='2021-01-01 12:00:00';
                if( me.id_temas==='' || me.juego.nombre_juego==='' || me.juego.descripcion_juego==='' || me.juego.puntos==='' || me.juego.duracion==='' || me.id_temas===undefined || me.juego.nombre_juego===undefined || me.juego.descripcion_juego===undefined || me.juego.puntos===undefined || me.juego.duracion===undefined || me.id_temas.length < 1 ){
                    me.$vs.notify({
                        text:'Debe completar todos los campos antes de continuar',
                        color:'warning',
                        iconPack: 'feather',
                        icon:'icon-alert-triangle'})
                    return
                }
                me.$vs.loading()
                
                let estado_juego = 1
                if( me.juego.estado_juego === false ){
                    estado_juego = 0
                }
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
                this.$http.post(this.$server_url+'j_juegos', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        me.eliminarTemasJuego()
                        me.getPreguntas()
                    })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
            eliminarTemasJuego(){
                let me = this
                me.$vs.loading()
                this.$http.get(this.$server_url+'eliminarTemasJuego/'+ me.id_juego)
                    .then(res => {
                        me.$vs.loading.close()
                        me.guardarTemasJuego()
                    })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
            guardarTemasJuego(){
                let me = this
                me.$vs.loading()
                let temas_vector = []

                for( var i=0; i<me.id_temas.length; i++ ){
                    temas_vector.push(me.id_temas[i].id)
                }
                

                let formData = new FormData();
                    formData.append('id_juego', me.id_juego);
                    formData.append('id_temas', temas_vector);
                this.$http.post(this.$server_url+'guardarTemasJuego', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        me.tabActivo = 2
                        me.datos_crear_juego = {}
                        me.editarPregActivo = false
                        me.pintartab(2)
                    })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
            verPregunta(item){
                let me = this
                me.editarPregActivo = true
                me.datos_crear_juego = {}
                me.datos_crear_juego = item
            },
            cargarPreguntaJuego(){
                let me = this
                let formData = new FormData();
                    formData.append('id_juego', me.id_juego);
                    formData.append('pregunta', me.datos_crear_juego.pregunta);
                    formData.append('respuesta', me.datos_crear_juego.respuesta);
                this.$http.post(this.$server_url+'j_contenidos', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        me.getPreguntas()
                        me.datos_crear_juego = {}
                        me.editarPregActivo = false
                        me.$vs.notify({
                        text:'Editado correctamente',
                        color:'success',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
            editarPreguntaJuego(){
                let me = this
                let formData = new FormData();
                    formData.append('id_contenido_juego', me.datos_crear_juego.id_contenido_juego);
                    formData.append('id_juego', me.id_juego);
                    formData.append('pregunta', me.datos_crear_juego.pregunta);
                    formData.append('respuesta', me.datos_crear_juego.respuesta);
                this.$http.post(this.$server_url+'j_contenidos', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        me.getPreguntas()
                        me.datos_crear_juego = {}
                        me.editarPregActivo = false
                        me.$vs.notify({
                        text:'Editado correctamente',
                        color:'success',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
            eliminarPreguntaJuego(){
                let me = this
                this.$http.delete(this.$server_url+'j_contenidos/'+me.datos_crear_juego.id_contenido_juego)
                    .then(res => {
                        me.$vs.loading.close()
                        me.getPreguntas()
                        me.datos_crear_juego = {}
                        me.editarPregActivo = false
                        me.$vs.notify({
                        text:'Eliminado correctamente',
                        color:'success',
                        iconPack: 'feather',
                        icon:'icon-check'})
                    })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
            getFicha(){
                let me = this
                me.$vs.loading()
                this.$http.get(this.$server_url+'j_juegos/'+ me.id_juego)
                .then(res => {
                    me.datos_ficha = res.data[0];
                    console.log(res.data)
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error);
                })
            },
            guardarFicha(){
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
                this.$http.post(this.$server_url+'j_juegos_ficha', formData)
                    .then(res => {
                        me.$vs.loading.close()
                        me.$vs.notify({
                        text:'Ficha guardada correctamente',
                        color:'success',
                        iconPack: 'feather',
                        icon:'icon-check'})
                        me.$router.go(-1)
                    })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
            },
            pintartab(n) {
                for( var i=1;  i<4; i++ ){
                    $("#btnNav"+i).removeClass("btnwizardSelect");
                    $("#btnNav"+i).addClass("btnwizard");
                }
                $("#btnNav"+n).removeClass("btnwizard");
                $("#btnNav"+n).addClass("btnwizardSelect");
                /*document.getElementById('btnNav'+n).style.background = 'red'
                document.getElementById('btnNav'+n).style.color = 'white'*/
            }
        },
    }
</script>

<style>
    .btnwizard{
        width: 65px;
        height: 65px;
        font-size: 22px;
        padding: 0px;
        border-radius: 100%;
        border: 2px solid rgb(29, 90, 182);
        background-color: white;
        color: rgb(29, 90, 182);
    }
    .btnwizardSelect{
        width: 65px;
        height: 65px;
        font-size: 22px;
        padding: 0px;
        border-radius: 100%;
        border: 2px solid rgb(29, 90, 182);
        background-color:  rgb(29, 90, 182);
        color: white;
    }
    .preguntasList:hover{
        color: rgb(36, 87, 226);
        text-decoration: underline;
        cursor: pointer;
    }
</style>