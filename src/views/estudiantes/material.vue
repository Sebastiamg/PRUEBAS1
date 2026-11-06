<template>
<div class="vx-col md:w-full w-full mb-base">
  
    
    <vx-card>
          <vs-button @click="$router.go(-1)" color="dark" type="border">Volver</vs-button> &nbsp;
          <br>  <br>
        <h4 style="text-center"> {{curso.seccion}} {{curso.nombre}} {{curso.aula}} </h4>
        <br><br>
                <vs-tabs>
                    <vs-tab label="Material Digital">
                        <div class="con-tab-ejemplo">

                            <div v-if="materiales.length >0 ">
                                <vs-table max-items="10" search pagination :data="materiales" style="margin-top:-20px">
                                    <template slot="thead">
                                        <vs-th></vs-th>
                                        <vs-th>Nombre</vs-th>
                                        <vs-th>Fecha de asignación</vs-th>
                                        <vs-th>Acciones</vs-th>
                                    </template>
                                    <template slot-scope="{data}">
                                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                            <vs-td>
                                                <vs-avatar size="80px" v-bind:src="$data_url+'tareas/img/'+data[indextr].imagenmaterial" />
                                            </vs-td>
                                            <vs-td>
                                                {{data[indextr].nombrematerial}}<br>
                                                <small>{{data[indextr].descripcionmaterial}}</small>
                                            </vs-td>
                                            <vs-td>
                                                {{data[indextr].updated_at}}<br>
                                            </vs-td>
                                            <vs-td>
                                                <vx-tooltip style="display: inline-block;" text="Abrir juego" position="top" color="primary">
                                                    <vs-button class="modal-default-button" color="primary" type="border" @click="abrirMaterial(tr)" icon-pack="feather" icon="icon-star"> </vs-button>
                                                </vx-tooltip> &nbsp;
                                            
                                            </vs-td>
                                        </vs-tr>
                                    </template>
                                </vs-table>   
                            </div>
                            <div v-else class="p-3">
                                <p> Su docente aún no ha enviado material a este curso. </p>
                            </div>

                        </div>
                    </vs-tab>
                    <vs-tab label="Material pdf/ archivos">
                        <div class="con-tab-ejemplo">
                            <div v-if="archivos.length >0 ">
                                <vs-table max-items="10" search pagination :data="archivos" style="margin-top:-20px">
                                    <template slot="thead">
                                        
                                        <vs-th>Nombre</vs-th>
                                        <vs-th>Fecha de asignación</vs-th>
                                        <vs-th>Acciones</vs-th>
                                    </template>
                                    <template slot-scope="{data}">
                                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                                    
                                            <vs-td>
                                                {{data[indextr].nombre_material}}<br>
                                            </vs-td>
                                            <vs-td>
                                                {{data[indextr].updated_at}}<br>
                                            </vs-td>
                                            <vs-td>
                                                <vs-button color="success"  @click="descargar(tr)" type="relief">Ver archivo</vs-button>
                                            </vs-td>
                                        </vs-tr>
                                    </template>
                                </vs-table>   
                            </div>
                            <div v-else class="p-3">
                                <p> Su docente aún no ha enviado archivos a este curso. </p>
                            </div>
                        </div>
                    </vs-tab>
                
            
                </vs-tabs>
         
            
        
    </vx-card>
    <vs-popup fullscreen title="Material de Apoyo" :active.sync="modalMaterial">
        <iframe id="t0_iframe" frameborder="0" allowfullscreen="true" webkitallowfullscreen="true" mozallowfullscreen="true" style="display: block; width: 97%; height: 90%;  padding: 0px; top: 0px; position: absolute; left: 20px; rigth:20px; top:50px" v-bind:src="linkMaterial"></iframe>
    </vs-popup>
</div>
</template>

<script>
import historicoMixin from "@/mixins/historicomix";
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
export default {
    mixins: [historicoMixin],
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            materiales: [],
            archivos:[],
            usuario: [],
            miusuario:[],
            curso: '',
            linkMaterial: '',
            modalMaterial: false,
        }
    },
    mounted() {
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.miusuario = me.usuario
        me.curso = JSON.parse(localStorage.getItem('curso_material'));
        me.getMaterialCursos();
        me.getArchivosCursos();
    },
    methods: {
        getMaterialCursos() {
            let me = this;
            me.$vs.loading();
            let formData = new FormData();
            formData.append('codigo_curso', me.curso.codigo);
            formData.append('id_usuario', me.usuario.idusuario);
            this.$http.post(this.$server_url+'material_curso', formData)
                .then(function (res) {
                    me.materiales = res.data
                    // console.log(me.materiales)
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

         getArchivosCursos() {
            let me = this;
            me.$vs.loading();
            let formData = new FormData();
            formData.append('codigo_curso', me.curso.codigo);
        
            this.$http.post(this.$server_url+'archivo_curso', formData)
                .then(function (res) {
                    me.archivos = res.data
                    // console.log(me.materiales)
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },
        abrirMaterial(item) {

            let me = this;
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
                'recurso_accion': 'abrir',
                'recurso_tipo': 'material',
                'recurso_nombre': item.nombrematerial,
                'recurso_detalle': 'curso '+item.codigo_curso,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
            if(me.usuario.id_group == 4 ){
                me.saveMaterialApoyo(item)
            }
            me.linkMaterial = item.webmaterial
            console.log(me.linkMaterial)
            me.modalMaterial = true;
        },
        saveMaterialApoyo(item){
            let me = this;
            let asignatura_id = localStorage.idasignatura
            let idusuario     = me.usuario.idusuario
            let url           = item.webmaterial
            let actividad     = item.nombrematerial
            let periodo_id    = localStorage.periodo_id
            this.$http.get(this.$server_url+'conteoActividad?asignatura_id='+asignatura_id+'&idusuario='+idusuario+'&url='+url+'&actividad='+actividad+'&periodo_id='+periodo_id+'&pagina=0&tipo=2')
                .then(function (res) {
                    me.tipos = res.data.tipoArea
                    me.$vs.loading.close()
                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()
                })
        },
        descargar(item){
            let me = this
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
                'recurso_accion': 'abrir',
                'recurso_tipo': 'material',
                'recurso_nombre': item.nombre_archivo,
                'recurso_detalle': 'abir archivo del curso'+item.codigo_curso,
            }
            me.saveHistoricoVisitas(h_idinstitucion, h_idusuario, h_idgrupo, h_idasignatura,h_nombreasignatura,  h_recursotipo,datoHistorico)
              //HISTORICO
            if(me.usuario.id_group == 4 ){
                let asignatura_id = localStorage.idasignatura
                let idusuario     = me.miusuario.idusuario
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
         
            let ruta = me.$data_url+'archivos/'+'material_subir/'+ item.url
            window.open(ruta,'_blank')
           // :href="$server_url+'archivos/'+'material_cargar/'+ data[indextr].url" target="_blank"
        }
    }
}
</script>
<style lang="css">
    .vs-popup--close {
    display: block;
}
</style>
