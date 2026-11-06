<template>
    <div>
        <div v-if="ifCrearAsesor == false"> 
            <!---ASIGNAR COMO DISTRIBUIDOR-->
            <div class="vx-row mb-6" >
                <div class="vx-col sm:w-1/3 w-full">
                    <span>Asesores:</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <v-select :options="arregloAsesores" :reduce="arregloAsesores => arregloAsesores.idusuario" label="nombre_completo" class="w-full" v-model="asignar.asesor" />
                </div>
            </div>
            <div class="vx-row mb-6">
                <div class="vx-col sm:w-1/3 w-full">
                <span>Estado</span>
                </div>
                <div class="vx-col sm:w-2/3 w-full">
                    <ul class="flex">
                        <li>
                        <vs-radio v-model="asignar.estado" class="mr-2" vs-name="radiosestado1" vs-value="1">Activo</vs-radio>
                        </li>
                        <li>
                        <vs-radio v-model="asignar.estado" vs-name="radiosestado1" vs-value="0">Desactivado</vs-radio>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="flex justify-center">
                <vs-button color="success" class="mr-3" type="gradient" @click="save_distribuidor()">{{ editar == 1 ? 'Editar' : 'Asignar'}} Distribuidor</vs-button>
                <vs-button color="success" type="line" v-if="editar == 0" @click="ifCrearAsesor = true;">Crear un nuevo Usuario</vs-button>
            </div> 
        </div>
        <!--CREAR USUARIO-->
        <template v-if="ifCrearAsesor">
            <vs-button color="primary" type="border" @click="ifCrearAsesor=false;">← Regresar</vs-button>
            <!--REGISTRAR NUEVO USUARIO-->
            <vs-divider>Registrar nuevo Usuario</vs-divider>
            <div class="vx-col w-full mb-3">
                <span class="text-danger" style="font-size: 12px;">(obligatorio)</span>
                <vs-input label="Registre la cédula" v-model="beneficiario.num_identificacion" class="w-full" />
            </div>
            <div class="vx-col w-full mb-3">
                <span class="text-danger" style="font-size: 12px;">(obligatorio)</span>
                <vs-input label="Nombres" v-model="beneficiario.nombres" class="w-full" />
            </div>
            <div class="vx-col w-full mb-3">
                <span class="text-danger" style="font-size: 12px;">(obligatorio)</span>
                <vs-input label="Apellidos" v-model="beneficiario.apellidos" class="w-full" />
            </div>
            <div class="vx-col w-full mb-3">
                <span class="text-danger" style="font-size: 12px;">(obligatorio)</span>
                <vs-input label="Correo"  v-model="beneficiario.correo" class="w-full" />
            </div>
            <vs-divider></vs-divider>
            <div class="w-full" align="center">
                <vs-button color="success" type="gradient" @click="guardarNuevoUser()">Crear Usuario</vs-button>
            </div> 
        </template>
        <br><br><br><br>
    </div>
</template>
<script>
import vSelect from 'vue-select'
export default{
    components:{
        vSelect,
    },
    data(){
        return{
            arregloAsesores:[],
            asignar:{
                id:0,
                asesor:'',
                estado:1,
            },
            ifCrearAsesor:false,
            beneficiario: { 
                num_identificacion:'',
                nombres:'',
                apellidos:'',
                correo:'',
            },
        }
    },
    props:{
        usuario:{
            type:Object,
            default:function(){
                return {}
            }
        },
        distribuidorSelect:{
            type:Object,
            default:function(){
                return {}
            }
        },
        editar:{
            type:Number,
            default:0
        },
    },
    created(){
        let me = this
        me.getResponsables()    
    },
    mounted(){
        let me = this;
        if(me.editar == 0) me.limpiar()
        else               me.setEdit()
    },
    methods:{
        getResponsables(){
            let me = this
            this.$http.get(this.$server_url+'distribuidor?getUserxRol=yes')
            .then(res => {
                me.arregloAsesores = res.data
            })
        },
        save_distribuidor(){
            let me  = this;
            if(me.asignar.asesor == "" || me.asignar.asesor == null || me.asignar.asesor == undefined){
                me.$vs.notify({ color: 'danger', title:'Error' , text: "Debe completar seleccionar un asesor", time:4000})
                return
            }
            let formData = new FormData();
            formData.append('save_distribuidor',    'yes')
            formData.append('id',                   me.asignar.id);
            formData.append('user_created',         me.usuario.idusuario);
            formData.append('idusuario',            me.asignar.asesor );
            formData.append('estado',               me.asignar.estado);
            me.$vs.loading()
            this.$http.post(this.$server_url+'distribuidor', formData)
            .then(res => {
            me.$vs.loading.close()
            me.$vs.notify({ color: 'success', title:'Exito' , text: res.data.message, time:4000})
            me.$emit('recharge',2)
            })
            .catch(function (error) {
              me.$vs.loading.close()
            })
        },
        guardarNuevoUser() {
            let me = this
            const { num_identificacion ,nombres, apellidos,correo} = this.beneficiario
            if(num_identificacion == "" || nombres == "" || apellidos == "" || correo == ""){
                me.$vs.notify({ color: 'danger', title:'Error' , text: "Debe completar todos los campos", time:4000})
                return
            }
            const { institucion_idInstitucion, idusuario } = me.usuario
            me.$vs.loading();
            let formData = new FormData();
            formData.append('save_user',                'yes')
            formData.append('cedula',                   this.beneficiario.num_identificacion);
            formData.append('nombres',                  this.beneficiario.nombres);
            formData.append('apellidos',                this.beneficiario.apellidos);
            formData.append('email',                    this.beneficiario.correo);
            formData.append('telefono',                 0);
            formData.append('id_group',                 11)
            formData.append('institucion_idInstitucion',institucion_idInstitucion);
            formData.append('idcreadorusuario',         idusuario);
            this.$http.post(this.$server_url+'distribuidor', formData)
            .then(function (response) {
                me.$vs.loading.close();
                if(response.data.status == 0){
                    me.$vs.notify({ color: 'danger', title:'Error' , text: response.data.message, time:4000})
                    return
                }
                me.ifCrearAsesor = false
                me.$vs.notify({ color: 'success', title: 'Éxito', text: 'Usuario registrado correctamente.' })
                me.getResponsables()
                me.asignar.asesor = response.data.idusuario
            })
            .catch(function (error) {
              me.$vs.loading.close()
                if (error.response.status == 422) {
                    try {
                        me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.cedula[0] })
                    } catch (error) {
                    }
                    try {
                        me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.nombres[0] })
                    } catch (error) {
                    }
                    try {
                        me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.apellidos[0] })
                    } catch (error) {
                    }
                    try {
                        me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.email[0] })
                    } catch (error) {
                    }
                    try {
                        me.$vs.notify({ color: 'warning', title: 'Alerta', text: error.response.data.errors.password[0] })
                    } catch (error) {
                    }
                }
            })
        },
        limpiar(){
            let me = this
            me.asignar={
                id:0,
                asesor:'',
                estado:1
            }
            me.beneficiario= { 
                num_identificacion:'',
                nombres:'',
                apellidos:'',
                correo:'',
            }
        },
        setEdit(){
            let me = this;
            me.asignar.id     = me.distribuidorSelect.distribuidor_id
            me.asignar.asesor = me.distribuidorSelect.idusuario
            me.asignar.estado = me.distribuidorSelect.estado
        }
    }
}
</script>