<template>
    <div>
        <vs-card >

            <div v-if="simuladores.length > 0 ">
                <br/>
            
                <vs-table max-items="10" search pagination :data="simuladores">
                    <template slot="thead">
                        
                        <vs-th v-if="usuario.id_group == '6'">Asignatura</vs-th>
                        <vs-th>Nombre del simulador</vs-th>
                        <vs-th>Descripción</vs-th>
                        <!-- <vs-th>Tipo Ruta</vs-th> -->
                        <vs-th>Enlaces</vs-th> 
                        <vs-th v-if="usuario.id_group == '6'">Acciones</vs-th>
                    </template>
                    <template slot-scope="{data}">
                        <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                            
                            <vs-td v-if="usuario.id_group == '6'">
                              
                                {{data[indextr].nombreasignatura}}<br>
                                
                            </vs-td>
                            <vs-td>
                              
                                {{data[indextr].nombre}}<br>
                            </vs-td>

                            <vs-td>
                                {{data[indextr].descripcion}}<br>
                            </vs-td>
                            
                            <!-- <vs-td>
                                <vs-chip :color="tr.tipo_ruta == 2 ? 'success' : 'primary'">
                                    {{ tr.tipo_ruta == 2 ? 'Ruta Prolipa' : 'Ruta Externa' }}
                                </vs-chip>
                            </vs-td> -->
                            
                            <vs-td>
                                <div>
                                    <p>Enlace Simulador:</p>
                                    <template v-if="tr.tipo_ruta == 2">
                                        <vs-button size="small" color="success" @click="abrirSimuladorEmbebido(tr.link)">
                                            <i class="feather icon-eye"></i> Ver enlace
                                        </vs-button>
                                    </template>
                                    <template v-else>
                                        <a :href="tr.link" target="_blank">{{tr.link}}</a>
                                    </template>
                                    <br>   
                                </div>

                                <template>
                                    <div v-if="tr.link_tutorial == '' || tr.link_tutorial == 'null' || tr.link_tutorial == null">
                                        
                                        
                                    </div>
                                    <div v-else>
                                        <p>Enlace Tutorial:</p>
                                        <a :href="tr.link_tutorial" target="_blank">{{tr.link_tutorial}}</a><br>   
                                    </div>
                                </template>
                          
                            </vs-td>

                            <vs-td v-if="usuario.id_group == '6'">
                                
                                <div style="display:flex;">

                                    <vx-tooltip style="display: inline-block;" text="Asignar cursos" position="top" color="warning">
                                        <vs-button size="large" radius icon-pack="feather" icon="icon-folder" @click="verTipoModal = true; data_material = data[indextr];       getCursosDocente()" color="warning" type="line">

                                        </vs-button>
                                    </vx-tooltip>

                                </div>
                              

                            </vs-td> 
                            
                        </vs-tr>
                    </template>
                </vs-table>   
            </div>

            <div v-else style="margin:20px 0px 0px 25px;">
                <p> No existe Simuladores aun. </p>
            </div>

        </vs-card>

        <!--PARA LOS MODALES -->
        <vs-popup title="Seleccione un curso" :active.sync="modalCursosAsignacion">
        <vs-list>
             <vs-row>
                 <p>Cursos agregados:</p>
                <vs-col vs-type="flex" vs-justify="start" vs-align="left" vs-w="12" style="margin-top:10px;">
                     <div v-for="(recorrer,l) in cursoSimuladores" :key="l" >
                         
                         <div style="display:flex;">
                            <vs-chip color="primary">
                                    {{ recorrer.codigo_curso }}
                            </vs-chip>

                            <vx-tooltip style="display: inline-block;" text="Quitar asignacion" position="top" color="warning">
                                <vs-button size="large" radius icon-pack="feather" icon="icon-x" @click="data_material = recorrer;quitarSimulador()" color="danger" type="line">

                                </vs-button>
                            </vx-tooltip>
                         </div>
                     
                    </div>
                </vs-col>
            </vs-row>
            
            <br/>

            <vs-list-item v-for="(item,$index) in cursosDocente" :key="$index" :title="item.nombre" :subtitle="item.codigo">

             
                <template slot="avatar">
                    <vs-avatar color="primary" icon-pack="feather" icon="icon-folder" />
                </template>

                
                <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" size="small" type="filled" target="_blank" color="success" @click="asignarCurso(item)">Asignar Simulador</vs-button>
             

                <!-- <div v-else>
                     <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" size="small" type="filled" target="_blank" color="danger" @click="quitarSimulador(item)">Quitar Simulador</vs-button>

                </div> -->

            </vs-list-item>
        </vs-list>
    </vs-popup>

    </div>
</template>


<script>
import vSelect from 'vue-select'
export default {
    data(){
        return{
            simuladores:[],
            usuario:[],
            cursosDocente:[],
            modalCursosAsignacion:false,
            cursoSimuladores:[],
        }
    },

    components: {
        'v-select': vSelect,
                
     },

    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        if(me.usuario.id_group == '6'){
            me.getSimuladores();
        }
        if(me.usuario.id_group == '4'){
            me.getSimuladoresEstudiante();
        }
       
       
    },
    methods:{

        //para obtener el listado de los simuladores para el docente
        getSimuladores() {
            let me = this;
            me.$vs.loading();
            this.$http.get(this.$server_url+'simulador?asignatura=yes&idasignatura='+localStorage.getItem("idasignatura"))
                .then(function (res) {
                    me.simuladores = res.data;
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        abrirSimuladorEmbebido(url) {
            // Guardar la URL en localStorage
            localStorage.setItem('simulador_url', url);
            // Abrir en nueva ventana
            window.open('/admin/simulador/ruta', '_blank');
        },

        getSimuladoresEstudiante() {
            let me = this;
            me.$vs.loading();
          
            this.$http.get(this.$server_url+'simulador?estudiante=yes'+'&codigo_curso='+localStorage.getItem("codigo_curso"))
                .then(function (res) {
                    me.simuladores = res.data;
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        getCursosDocente() {
            let me = this
            let formData = new FormData();

            
            formData.append('simulador_id',me.data_material.simulador_id)
            formData.append('id_usuario', me.usuario.idusuario);
            formData.append('id_asignatura', localStorage.idasignatura);
            this.$http.post(this.$server_url+'cursosLibrosSimulador', formData)
                .then(function (res) {
                    me.cursosDocente = res.data.cursos
                    me.cursoSimuladores = res.data.simuladores
                    me.modalCursosAsignacion = true; 
                  
                })
                .catch(function (error) {})
        },

           asignarCurso(item) {
         
            let me = this;
        
            let formData = new FormData();
            formData.append('codigo_curso', item.codigo);
            formData.append('simulador_id', me.data_material.simulador_id);
            me.$vs.loading()
            this.$http.post(this.$server_url+'asignarSimulador', formData)
                .then(function (res) {
                    me.getCursosDocente()
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },

        quitarSimulador(){
            let me = this;
        
            let formData = new FormData();
            formData.append('codigo_curso', me.data_material.codigo_curso);
            formData.append('simulador_curso_id', me.data_material.simulador_curso_id);
            me.$vs.loading()
            this.$http.post(this.$server_url+'quitarSimulador', formData)
                .then(function (res) {
                    me.getCursosDocente()
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        
        },

       
       

    }
}
</script>