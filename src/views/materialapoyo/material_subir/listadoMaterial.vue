<template>
    <div>
        <vs-card>
            <small  v-if="usuario.id_group == 1" align="left">Ruta: /a_material_cargar</small>
            <div class="flex mb-4" v-if="tipoAsignatura == 0">
                <div class="w-1/5 p-2 bg-gray-400 text-center" >
                    <vs-button  v-if="CreateMaterial == false" color="primary" style="" icon="add"  type="filled" @click="CreateMaterial = true;title='Crear Material';tipo=0;MaterialSend=[];">
                        Crear Material
                    </vs-button>
                    <vs-button  v-else color="success" style="" icon="reply"  type="filled" @click="CreateMaterial = false;cleanGarbage();">
                        Regresar
                    </vs-button>
                </div>
                <div class="w-4/5 p-2 bg-gray-500 text-center">
                    <vs-alert style="display:flex;justify-content:center;">
                        <p class="font-bold">{{ title }}</p>
                    </vs-alert>
                </div>
            </div>
        </vs-card>
        <vs-card v-if="CreateMaterial == false">
            <vs-table max-items="10" stripe search pagination :data="arregloMaterial">
                <template>
                    <div slot="header">
                        <vs-chip color="primary">Cantidad: {{ arregloMaterial.length }}</vs-chip>
                    </div>
                </template>
                <template slot="thead">
                    <vs-th>Libro</vs-th>
                    <vs-th>Material</vs-th>
                    <vs-th>Temas</vs-th>
                    <vs-th>Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        <vs-td>
                            <!-- {{tr}} -->
                            {{data[indextr].nombrelibro}}<br>       
                        </vs-td>
                        <vs-td>
                            <vs-chip color="primary" :href="{url: 'https://lusaxweb.github.io/vuesax/'}">{{data[indextr].nombre_material}}</vs-chip>
                            <!-- {{data[indextr].nombre_material}}--> <br> <br>
                            <small style="margin-left: 15px;">{{ tr.descripcion }}</small>
                        </vs-td>
                        <vs-td>
                            <vs-button color="success" type="line" @click="verTemas(tr)" icon="book" size="small">Ver temas</vs-button>
                        </vs-td>
                        <vs-td>
                            <div style="display: flex;">
                                <vx-tooltip text="Descargar" position="bottom" style="display: inline-block" color="success">
                                    <vs-button style="display: inline" class="m-1" @click="descargaArchivo(tr)" size="small" icon-pack="feather" icon="icon-arrow-down" color="success" type="border"></vs-button>
                                </vx-tooltip>
                                <vx-tooltip style="display: inline-block;"  text="Editar" position="top" color="primary">
                                    <vs-button  v-if="tipoAsignatura == '0'" radius color="primary" @click="openEdit(tr);" type="line" icon="edit">
                                    </vs-button>
                                </vx-tooltip> &nbsp;
                                <vx-tooltip style="display: inline-block;"  text="Eliminar" position="top" color="primary">
                                    <vs-button  v-if="tipoAsignatura == '0'" radius color="danger" @click="openConfirm(tr)" type="line" icon="close">
                                    </vs-button>
                                </vx-tooltip> &nbsp;
                                <vx-tooltip style="display: inline-block;" text="Asignar cursos" position="top" color="warning">
                                    <vs-button  v-if="tipoAsignatura != '0'" size="large" radius icon-pack="feather" icon="icon-folder" @click="verTipoModal = true; archivos=true; data_material = tr; getCursosDocente();nombrematerial=tr.nombre_archivo" color="warning" type="line"></vs-button>
                                </vx-tooltip>   
                            </div>
                        </vs-td> 
                    </vs-tr>
                </template>
            </vs-table>
        </vs-card>
        <vs-card v-if="CreateMaterial == true">
            <crearMaterialVue :tipo="tipo" @listado="changeListado" :MaterialSend="MaterialSend"/>
        </vs-card>
        <!--MODALES-->
        <!--MODAL PARA VER LOS TEMAS-->
        <vs-popup class="holamundo"  title="Temas" :active.sync="popupTemas">
        <!--Unidad 1-->
            <div class="bg-gray-200 p-4" v-for="(item,index) in unidades.unidad1Temas" :key="index">
                <vs-divider>Unidad 1</vs-divider>
                <div style="display:flex;flex-wrap:wrap">
                    <div style="width:49%;" class="p-1" v-for="(tr,i) in item.temas" :key="i">
                        <vs-chip>{{ tr.nombre_tema }}</vs-chip>
                    </div>
                </div>
            </div>
        <!--Unidad 2-->
            <div class="bg-gray-200 p-4" v-for="(item,index) in unidades.unidad2Temas" :key="index">
                <vs-divider>Unidad 2</vs-divider>
                <div style="display:flex;flex-wrap:wrap">
                    <div style="width:49%;" class="p-1" v-for="(tr,i) in item.temas" :key="i">
                        <vs-chip>{{ tr.nombre_tema }}</vs-chip>
                    </div>
                </div>
            </div>
         <!--Unidad 3-->
            <div class="bg-gray-200 p-4" v-for="(item,index) in unidades.unidad3Temas" :key="index">
                <vs-divider>Unidad 3</vs-divider>
                <div style="display:flex;flex-wrap:wrap">
                    <div style="width:49%;" class="p-1" v-for="(tr,i) in item.temas" :key="i">
                        <vs-chip>{{ tr.nombre_tema }}</vs-chip>
                    </div>
                </div>
            </div>
        <!--Unidad 4-->
            <div class="bg-gray-200 p-4" v-for="(item,index) in unidades.unidad4Temas" :key="index">
                <vs-divider>Unidad 4</vs-divider>
                <div style="display:flex;flex-wrap:wrap">
                    <div style="width:49%;" class="p-1" v-for="(tr,i) in item.temas" :key="i">
                        <vs-chip>{{ tr.nombre_tema }}</vs-chip>
                    </div>
                </div>
            </div>
        <!--Unidad 5-->
            <div class="bg-gray-200 p-4" v-for="(item,index) in unidades.unidad5Temas" :key="index">
                <vs-divider>Unidad 5</vs-divider>
                <div style="display:flex;flex-wrap:wrap">
                    <div style="width:49%;" class="p-1" v-for="(tr,i) in item.temas" :key="i">
                        <vs-chip>{{ tr.nombre_tema }}</vs-chip>
                    </div>
                </div>
            </div>
        <!--Unidad 6-->
            <div class="bg-gray-200 p-4" v-for="(item,index) in unidades.unidad6Temas" :key="index">
                <vs-divider>Unidad 6</vs-divider>
                <div style="display:flex;flex-wrap:wrap">
                    <div style="width:49%;" class="p-1" v-for="(tr,i) in item.temas" :key="i">
                        <vs-chip>{{ tr.nombre_tema }}</vs-chip>
                    </div>
                </div>
            </div>
        </vs-popup>
        <!--FIN MODAL PARA VER LOS TEMAS-->  
        <!--MODAL PARA ASIGNAR A UN CURSO-->
        <vs-popup title="Seleccione un curso" :active.sync="modalCursosArchivos">
            <vs-list>
                <vs-list-item v-for="(item,$index) in cursosDocente" :key="$index" :title="item.nombre" :subtitle="item.codigo">
                    <template slot="avatar">
                        <vs-avatar color="primary" icon-pack="feather" icon="icon-folder" />
                    </template>
                    <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" v-if="verTipoModal===true" size="small" type="filled" target="_blank" color="success" @click="asignarCursoArchivo(item)">Asignar archivo</vs-button>
                </vs-list-item>
            </vs-list>
         </vs-popup>
    </div>
</template>
<script>
import historicoMixin from "@/mixins/historicomix";
import axios from 'axios'
import crearMaterialVue from './components/crearMaterial.vue'
export default {
    mixins: [historicoMixin],
    data() {
        return{
            usuario:[],
            id:0,
            CreateMaterial:false,
            title:"Listado de material",
            popupTemas:false,
            arregloMaterial:[],
            unidades:{
                unidad1Temas:[],
                unidad2Temas:[],
                unidad3Temas:[],
                unidad4Temas:[],
                unidad5Temas:[],
                unidad6Temas:[],
            },
            tipo:0,
            MaterialSend:[],
            //VARIABLES PARA ASIGNAR CURSOS
            verTipoModal: false,
            data_material: [],
            archivos:false,
            nombrematerial:'',
            modalCursosArchivos:false,
            modalCursosEnvioLink:false,
            cursosDocente:[],
            //FIN VARIABLES PARA ASIGNAR CURSOS
        }
    },
    components:{
        crearMaterialVue,
    },
    props:{
        tipoAsignatura:{
            type:String,
            default:"0",
        },
        asignatura:{
            type:String,
            default:"0",
        },
        asignaturaName:{
            type:String,
            default:"",
        }
    },
    methods:{
        descargaArchivo(item){
            let me = this;
            if(me.usuario.id_group ==4 || me.usuario.id_group ==6){
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
                //FIN HISTORICO
            }
            let url2 = this.$data_url+'archivos/material_subir/'+item.url
            window.open(url2)
        },
        changeListado(e){
           let me = this;
           me.CreateMaterial = e
           me.getMaterial();
        },
        getMaterial(){       
            let me = this;
            me.$vs.loading()
            this.$http.get(this.$server_url+'getMaterialSubir')
            .then(res => {
                me.$vs.loading.close()
                if(me.tipoAsignatura == 0){
                    me.arregloMaterial = res.data
                }else{
                    me.arregloMaterial = res.data.filter(p => p.idasignatura == me.asignatura)
                }
               
            })
            .catch(function(e){
                 me.$vs.loading.close()
            })
        },
        verTemas(tr){
            let me = this;
            me.limpiar()
            me.$vs.loading()
            this.$http.get(this.$server_url+'material/subir/temas/'+tr.id)
            .then(res => {
                me.$vs.loading.close()
                let datos                = res.data
                //unidad1
                let unidad1Temas         = datos.filter(p => p.unidad == 1)
                for(let i =0; i<unidad1Temas.length; i++){
                    me.unidades.unidad1Temas.push({
                        "id":       unidad1Temas[i].id,
                        "unidad":   unidad1Temas[i].unidad,
                        "temas":    JSON.parse(unidad1Temas[i].temas)
                    })
                }
                //unidad2  
                let unidad2Temas         = datos.filter(p => p.unidad == 2)
                for(let i =0; i<unidad2Temas.length; i++){
                    me.unidades.unidad2Temas.push({
                        "id":       unidad2Temas[i].id,
                        "unidad":   unidad2Temas[i].unidad,
                        "temas":    JSON.parse(unidad2Temas[i].temas)
                    })
                } 
                //unidad3  
                let unidad3Temas         = datos.filter(p => p.unidad == 3)
                for(let i =0; i<unidad3Temas.length; i++){
                    me.unidades.unidad3Temas.push({
                        "id":       unidad3Temas[i].id,
                        "unidad":   unidad3Temas[i].unidad,
                        "temas":    JSON.parse(unidad3Temas[i].temas)
                    })
                } 
                //unidad4  
                let unidad4Temas         = datos.filter(p => p.unidad == 4)
                for(let i =0; i<unidad4Temas.length; i++){
                    me.unidades.unidad4Temas.push({
                        "id":       unidad4Temas[i].id,
                        "unidad":   unidad4Temas[i].unidad,
                        "temas":    JSON.parse(unidad4Temas[i].temas)
                    })
                } 
                //unidad5 
                let unidad5Temas         = datos.filter(p => p.unidad == 5)
                for(let i =0; i<unidad5Temas.length; i++){
                    me.unidades.unidad5Temas.push({
                        "id":       unidad5Temas[i].id,
                        "unidad":   unidad5Temas[i].unidad,
                        "temas":    JSON.parse(unidad5Temas[i].temas)
                    })
                } 
                //unidad6 
                let unidad6Temas         = datos.filter(p => p.unidad == 6)
                for(let i =0; i<unidad6Temas.length; i++){
                    me.unidades.unidad6Temas.push({
                        "id":       unidad6Temas[i].id,
                        "unidad":   unidad6Temas[i].unidad,
                        "temas":    JSON.parse(unidad6Temas[i].temas)
                    })
                } 
                me.popupTemas            = true 
            })
            .catch(function(e){
                 me.$vs.loading.close()
            })
        },
        openEdit(tr){
            let me              = this;
            me.CreateMaterial   = true;
            me.title            ='Editar Material'
            me.tipo             = 1
            me.MaterialSend     = tr
        },
        openConfirm(tr){
            let me = this;
            me.id = tr.id
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirmar`,
                text: 'Estas seguro de eliminar este material de apoyo?',
                accept:this.eliminarMaterial
            })
        },
        eliminarMaterial(){
            let me = this;
            let formData = new FormData();
            formData.append('id',  me.id)
            me.$vs.loading()
            axios.post(this.$data_url + 'api/eliminar/material/subir', formData)
                .then(function (response) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: 'Se elimino correctamente',
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.id = 0
                    me.getMaterial()
                //    me.$emit('file',response.data)
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
         
        },
        getCursosDocente() {
            let me = this
            let formData = new FormData();
            formData.append('id_usuario', me.usuario.idusuario);
            formData.append('id_asignatura', me.asignatura);
            formData.append('periodo_id',localStorage.periodo_id)
            this.$http.post(this.$server_url+'curso_libro_docente', formData)
                .then(function (res) {
                    me.cursosDocente = res.data
                    if(me.archivos){
                        me.modalCursosArchivos = true
                    }else{
                         me.modalCursosEnvioLink = true
                    }   
                  
                })
                .catch(function (error) {})
        },
            //para asignar el curso con el archivo
            asignarCursoArchivo(item){
                let me = this;
                if (me.usuario.id_group == 10) {
                    me.$vs.notify({
                        text: 'Este contenido pertenece a otro docente',
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })
                    return;
                }
            let formData = new FormData();
            formData.append('codigo_curso', item.codigo);
            formData.append('id_archivo', me.data_material.id);
            this.$http.post(this.$server_url+'asignar_cursos_archivos', formData)
                .then(function (res) {
                    me.getCursosDocente()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    if(res.data.status == 1){
                        let h_idinstitucion = me.miusuario.institucion_idInstitucion;
                        let h_idusuario = me.miusuario.idusuario;
                        let h_idgrupo = me.miusuario.id_group;
                        let h_idasignatura = localStorage.idasignatura
                        let h_nombreasignatura = localStorage.nombreasignatura
                        let h_recursotipo = 9; //9 = material
                        let datoHistorico = {
                            'user_nombre': me.miusuario.nombres,
                            'user_apellido': me.miusuario.apellidos,
                            'user_email': me.miusuario.email,
                            'user_cedula': me.miusuario.cedula,
                            'recurso_accion': 'asignar',
                            'recurso_tipo': 'material',
                            'recurso_nombre': 'archivo: '+me.nombrematerial,
                            'recurso_detalle': 'asignar archivo al curso '+item.codigo,
                        }
                        me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
                    }
                })
                .catch(function (error) {})
        },
        limpiar(){
            let me = this;
            me.unidades.unidad1Temas   = []
            me.unidades.unidad1Temas   = []
            me.unidades.unidad2Temas   = []
            me.unidades.unidad3Temas   = []
            me.unidades.unidad4Temas   = []
            me.unidades.unidad5Temas   = []
            me.unidades.unidad6Temas   = []
        },
        cleanGarbage(){
            this.$http.get(this.$server_url+'cargarmaterial?limpiar=yes')
            .then(res => {
                this.getMaterial()
            })
            .catch(function(e){
            })
        }
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem("usuario"))
        me.getMaterial();
    },
}
</script>