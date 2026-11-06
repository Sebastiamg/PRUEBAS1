<template>
    <div>
     


        <!---INFORMACION DEL ESTUDIANTE-->
        <div>
             <div slot="header" style="margin-top:20px;">
                <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Datos del Estudiante</span> </p>
            </div> 

            <div>
                <vs-row>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Nombres"   v-model="estudiante.nombres" style="width:90%;" placeholder="Nombre"/>
                    </vs-col>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Apellidos"  v-model="estudiante.apellidos" style="width:90%;" placeholder="Apellidos"/>
                    </vs-col>

                        <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Cédula" disabled  v-model="estudiante.cedula" style="width:90%;" placeholder="Cédula"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Email"   v-model="estudiante.email" style="width:90%;" placeholder="Email"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Institución" disabled v-model="estudiante.nombreInstitucion" style="width:90%;" placeholder="Institución"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Curso actual" disabled v-model="estudiante.nombrenivel" style="width:90%;" placeholder="Curso actual"/>
                    </vs-col>

                </vs-row>

                <br>        
            </div>    
        </div>

        
        <!---INFORMACION DEL Representante Economico-->
     
        <div>
            <div slot="header" style="margin-top:20px;">
            <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Datos del Representante Económico</span> </p>
            </div> 

            <div>
                <vs-row>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Parentesco"   v-model="estudiante.parentesco_rc" style="width:90%;" placeholder="Parentesco"/>
                    </vs-col>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Nombres"   v-model="estudiante.nombres_rc" style="width:90%;" placeholder="Nombres"/>
                    </vs-col>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Apellidos"  v-model="estudiante.apellidos_rc" style="width:90%;" placeholder="Apellidos"/>
                    </vs-col>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Cédula"  v-model="estudiante.cedula_rc" style="width:90%;" placeholder="Cédula"/>
                    </vs-col>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input type="number" label="Teléfono casa"  v-model="estudiante.telefono_casa_rc" style="width:90%;" placeholder="Teléfono casa"/>
                    </vs-col>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input type="number" label="Teléfono celular"  v-model="estudiante.telefono_celular_rc" style="width:90%;" placeholder="Celular"/>
                    </vs-col>

                    
                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input  label="Dirección"  v-model="estudiante.direccion_rc" style="width:90%;" placeholder="Dirección"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Empresa"  v-model="estudiante.empresa_rc" style="width:90%;" placeholder="Empresa"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Profesión"  v-model="estudiante.profesion_rc" style="width:90%;" placeholder="Profesión"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Dirección trabajo"  v-model="estudiante.direccion_trabajo_rc" style="width:90%;" placeholder="Dirección trabajo"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Email"  v-model="estudiante.email_rc" style="width:90%;" placeholder="Email"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Sexo"  v-model="estudiante.sexo_rc" style="width:90%;" placeholder="Sexo"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Nacionalidad"  v-model="estudiante.nacionalidad_rc" style="width:90%;" placeholder="Nacionalidad"/>
                    </vs-col>


                </vs-row>
                <br/>

            
            </div>  
        </div>

        <!---INFORMACION DEL Representante Legal-->
     
        <div>
             <div slot="header">
                <p style="color:#2A9FF6;"><i class="fa fa-pencil" aria-hidden="true"></i> <span> Datos del Representante legal</span> </p>
            </div> 

            <div>
                <vs-row>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Parentesco"   v-model="estudiante.parentesco_rl" style="width:90%;" placeholder="Parentesco"/>
                    </vs-col>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Nombres"   v-model="estudiante.nombres_rl" style="width:90%;" placeholder="Nombres"/>
                    </vs-col>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Apellidos"  v-model="estudiante.apellidos_rl" style="width:90%;" placeholder="Apellidos"/>
                    </vs-col>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Cédula"  v-model="estudiante.cedula_rl" style="width:90%;" placeholder="Cédula"/>
                    </vs-col>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input type="number" label="Teléfono casa"  v-model="estudiante.telefono_casa_rl" style="width:90%;" placeholder="Teléfono casa"/>
                    </vs-col>

                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input type="number" label="Teléfono celular"  v-model="estudiante.telefono_celular_rl" style="width:90%;" placeholder="Celular"/>
                    </vs-col>

                    
                    <vs-col  vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input  label="Dirección"  v-model="estudiante.direccion_rl" style="width:90%;" placeholder="Dirección"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Empresa"  v-model="estudiante.empresa_rl" style="width:90%;" placeholder="Empresa"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Profesión"  v-model="estudiante.profesion_rl" style="width:90%;" placeholder="Profesión"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Dirección trabajo"  v-model="estudiante.direccion_trabajo_rl" style="width:90%;" placeholder="Dirección trabajo"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Email"  v-model="estudiante.email_rl" style="width:90%;" placeholder="Email"/>
                    </vs-col>
                    
                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Sexo"  v-model="estudiante.sexo_rl" style="width:90%;" placeholder="Sexo"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Nacionalidad"  v-model="estudiante.nacionalidad_rl" style="width:90%;" placeholder="Nacionalidad"/>
                    </vs-col>

                    <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="6">
                        <vs-input label="Email Institucional"   v-model="estudiante.email_institucional_rl" style="width:90%;" placeholder="Email Institucional"/>
                    </vs-col>
                </vs-row>
                <br/>

            
            </div>       
                
        </div>

        <vs-row>
            <vs-col vs-type="flex" vs-justify="center" vs-align="center" vs-w="12">
                <vs-button @click="actualizarData()" id="btnUpdateDatos" type="gradient">Guardar datos</vs-button>
            </vs-col>
        </vs-row>   
   

    </div>
</template>

<script>
export default {
    data() {
        return{
     
            estudiante:[],
            usuario:{
               cedula:'',
               institucion:'',
            }
       
        }
    },
    created(){
        let me = this;
        me.usuario.cedula = localStorage.getItem("cedulaEstudiante")
        me.usuario.institucion = localStorage.getItem("institucionEstudiante");
        me.estudiante = JSON.parse(localStorage.getItem("estudianteData"));
        // me.getDataEstudiante()
    },
    methods:{
        
         getDataEstudiante() {
            let me = this;
            me.$vs.loading();
      
        
            this.$http.get(this.$server_url+'estudiante/matricula?cedula='+me.usuario.cedula+'&institucion_id='+me.usuario.institucion)
                .then(function (res) {
                    me.estudiante = res.data[0]
    
                    me.$vs.loading.close()

                })
                .catch(function (error) {
                    console.log(error + ' error');
                    me.$vs.loading.close()

                })
        },

        actualizarData(){

            let me = this;
            
         
            // me.estudiante.ordenactual = me.ordenactual;
            // me.estudiante.valor = me.valoractual;
            me.estudiante.institucion = me.usuario.institucion 
            // me.estudiante.fecha_inicio_pension = me.fecha_inicio_pension
            // me.estudiante.valor_matricula = me.valor_matricula
            // me.estudiante.periodo = localStorage.getItem('periodo_id');
            me.estudiante.administrador = "yes";
              
            me.$vs.loading()
            this.$http.post(this.$server_url+'updateEstudianteAdministrador', me.estudiante)
                .then(function (res) {
                    me.$vs.loading.close()
                    me.$vs.notify({
                        text: res.data.message,
                        color: 'primary',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    me.getDataEstudiante()
                
                  
                })
                .catch(function (error) {
                    me.$vs.loading.close()
                })

        
        },
    }
}
</script>