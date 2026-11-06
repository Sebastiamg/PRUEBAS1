<template>
    <div>
        <div v-if="estudiantes.length >0 ">
            <br/>
            <vs-table max-items="10"  search pagination :data="estudiantes" style="margin-top:-40px">
                <template slot="thead">
                    
                    <vs-th>Estudiante</vs-th>
                    <vs-th>Fecha Reserva matrícula</vs-th>
                    <vs-th>Nivel</vs-th>
                    <vs-th>Paralelo</vs-th>
                    <vs-th>Comprobante</vs-th>
                    <vs-th>Estado</vs-th>
                    <vs-th >Acciones</vs-th>
                </template>
                <template slot-scope="{data}">
                    <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                        
                        <vs-td>
                            <div style="display:flex;flex-direction:column;">
                                <div>
                                   
                                    <vs-chip color="success">
                                     {{data[indextr].estudiante}}
                                    </vs-chip>
                                </div>
                             
                                <div>
                                    <vs-chip style="margin-rigth:10px;margin-top:5px;" color="primary">
                                        {{data[indextr].cedula}}
                                    </vs-chip>
                                   
                                </div>
                            </div>
                                        
                            
                        </vs-td>
                        <vs-td>
                            {{data[indextr].fecha_matricula}}<br>
                        </vs-td>
                        <vs-td>
                            {{data[indextr].nombrenivel}}<br>
                        </vs-td>
                        <vs-td>
                            <div v-if="tr.paralelo == 1">
                                <vs-chip color="success">
                                    Paralelo A
                                </vs-chip>
                            </div>

                            <div v-if="tr.paralelo == 2">
                                <vs-chip color="success">
                                    Paralelo B
                                </vs-chip>
                            </div>

                            <div v-if="tr.paralelo == 3">
                                <vs-chip color="success">
                                    Paralelo C
                                </vs-chip>
                            </div>

                            <div v-if="tr.paralelo == 4">
                                <vs-chip color="success">
                                    Paralelo D
                                </vs-chip>
                            </div>

                            <div v-if="tr.paralelo == 5">
                                <vs-chip color="success">
                                    Paralelo E
                                </vs-chip>
                            </div>

                            <div v-if="tr.paralelo == '' || tr.paralelo == null">
                                 <vs-chip color="danger">
                                    No tiene paralelo
                                </vs-chip>   
                            </div>
                            
                        </vs-td>

                        <vs-td>
                     
                            <div v-if="tr.estado_matricula == 1">
                                <vs-chip color="success">
                                    Matriculado
                                </vs-chip>
                            </div>

                            <div v-if="tr.estado_matricula == 2">
                                <vs-chip color="warning">
                                    Reserva
                                </vs-chip>
                            </div>

                             <div v-if="tr.estado_matricula == 3">
                                <vs-chip color="danger">
                                    Retirado
                                </vs-chip>
                            </div>

                
                            
                        </vs-td>
                        <vs-td>

                            <div style="display:flex;">

                                <vx-tooltip style="display: inline-block;" text="Asignar Paralelo" position="top" color="primary">
                                     <vs-button class="modal-default-button" @click="AsignarParalelo(tr)"  size="small" color="primary"  type="filled" icon-pack="feather" icon="icon-user">
                                   
                                    </vs-button>
                                </vx-tooltip> &nbsp;
                  

                                <vx-tooltip style="display: inline-block;" text="Cambiar estado matricula" position="top" color="warning">
                                    <vs-button class="modal-default-button" size="small" @click="CambiarEstadoMatricula(tr)"  color="dark"  type="filled" icon-pack="feather" icon="icon-bookmark">
                                    </vs-button>
                                </vx-tooltip> &nbsp;
                            </div>
                      

                        </vs-td>
                    
                        
                    </vs-tr>
                </template>
            </vs-table>   
        </div>

        <div v-else class="p-3">
            <p> No existe estudiantes . </p>
        </div>

         <!--MODALES-->
        <!--Modal para  asignar paralelo-->
        <vs-popup :active.sync="popupAsignacionParalelo" title="Agregar paralelo al estudiante">
       

            <div class="con-exemple-prompt">
                <vs-list>
                    
                    <vs-list-item v-for="(item,$index) in arregloParalelos" :key="$index" :title="'Paralelo '+item.descripcion">
                        <template slot="avatar">
                            <vs-avatar color="primary" icon-pack="feather" icon="icon-folder" />
                        </template>

                        <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" size="small" type="filled" target="_blank" color="success" @click="guardarParalelos(item)">Asignar</vs-button>

                    </vs-list-item>
                </vs-list>

            
            </div>

        </vs-popup>

          <!--Modal para cambiar estado matricula-->
        <vs-popup :active.sync="popupEstadosMatricula" title="Cambiar estado de matrícula">
       

            <div class="con-exemple-prompt">
                <vs-list>
                    
                    <vs-list-item v-for="(item,$index) in arregloEstados" :key="$index" :title="item.descripcion">
                        <template slot="avatar">
                            <vs-avatar color="primary" icon-pack="feather" icon="icon-folder" />
                        </template>

                        <vs-button class="m-1" style="padding: 7px 5px 7px 5px; font-size: 12px;" size="small" type="filled" target="_blank" color="success" @click="cambiarEstado(item)">Asignar</vs-button>

                    </vs-list-item>
                </vs-list>

            
            </div>

        </vs-popup>
    </div>
   
</template>

<script>
export default {
    data() {
       return{
        popupAsignacionParalelo:false,
        popupEstadosMatricula:false,
        estudiantes:[],
        institucion:[],
        arregloParalelos:[],
        arregloEstados:[
            {
                id:1,
                descripcion:"Matriculado"
            },
             {
                id:2,
                descripcion:"Reserva"
            },
             {
                id:3,
                descripcion:"Retirado"
            }
        ]
       } 
    },
    created(){
        let me = this;
        me.institucion = JSON.parse(localStorage.getItem("institucion"))
        me.getEstudiantesSinParalelo();
      
    },
    methods:{
        getEstudiantesSinParalelo() {
            let me = this;
            let periodo_id = localStorage.getItem("periodo_id");
            this.$http.get(this.$server_url+'estudianteParalelo?reserverEstudiante=yes'+'&periodo_id='+periodo_id+'&institucion_id='+me.institucion.idInstitucion)
                .then(function (res) {
                    me.estudiantes = res.data

                })
                .catch(function (error) {
                    console.log(error + ' error');  

                })
        },

        //traer paralelos  asignados
    
        traerParalelosAsignados(nivel_id){
            let me = this;
            localStorage.setItem('nivel_id',nivel_id)
             let periodo_id = localStorage.getItem("periodo_id");
             this.$http.get(this.$server_url+'estudianteParalelo?traerParaleloParaEstudiante=yes'+'&nivel_id='+nivel_id+'&periodo_id='+periodo_id+'&institucion_id='+me.institucion.idInstitucion)
                .then(function (res) {
                    me.arregloParalelos = res.data
                   
                })
                .catch(function (error) {
                    console.log(error + ' error');
                

                })
        },

        AsignarParalelo(tr){
            let me = this;
            localStorage.setItem('id_matricula',tr.id_matricula)
            me.traerParalelosAsignados(tr.nivel_id)
            me.popupAsignacionParalelo = true;
        },

        CambiarEstadoMatricula(tr){
            let me = this;
            localStorage.setItem('id_matricula',tr.id_matricula)
            this.popupEstadosMatricula = true;
          
        },

        guardarParalelos(item){
            let me = this;

            let formData = new FormData();
            
            formData.append('id_matricula',localStorage.getItem('id_matricula'))
            formData.append('paralelo',item.paralelo_id)
            formData.append('editarParaleloIndividual',"yes")
        

            me.$vs.loading()
            this.$http.post(this.$server_url+'guardarParalelos', formData)
                .then(function (res) {
                    me.$vs.loading.close() 
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })

                    me.traerParalelosAsignados(localStorage.getItem("nivel_id"))
                    me.getEstudiantesSinParalelo();
   
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        },

        cambiarEstado(item){
             let me = this;

            let formData = new FormData();
            
            formData.append('id_matricula',localStorage.getItem('id_matricula'))
            formData.append('estado',item.id)
            formData.append('cambiarEstado',"yes")
        

            me.$vs.loading()
            this.$http.post(this.$server_url+'guardarParalelos', formData)
                .then(function (res) {
                    me.$vs.loading.close() 
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })

                    me.traerParalelosAsignados(localStorage.getItem("nivel_id"))
                    me.getEstudiantesSinParalelo();
   
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })
        }
    }
}
</script>