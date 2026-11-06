<template>
    <div>
        <!--PERMISOS DE USUARIOS EXTERNOS-->
        <vs-card class="mt-5">
            <label style="font-weight: bold;">Asignar permisos a usuarios</label><br>
             <vs-chip class="mt-1" color="success" style="font-weight: bold;">Cantidad: {{ users.length }}</vs-chip><br><br>
            <div class="flex mb-4" v-for="(tr,index) in users" :key="index">
                <div class="w-1/3 p-1  text-center">
                    {{ tr.nombres  }}   {{ tr.apellidos  }}<br>
                    <small>{{ tr.email }}</small>
                </div>
                <div class="w-1/3 p-1  text-center">
                    <vs-radio v-model="users[index].recurso_externo" @input="guardarUsuarioExterno(users[index].idusuario,1)" :vs-name="tr.cedula" vs-value="1">Si </vs-radio>
                    <vs-radio v-model="users[index].recurso_externo" @input="guardarUsuarioExterno(users[index].idusuario,0)" class="ml-2" :vs-name="tr.cedula" vs-value="0">No </vs-radio>   
                </div>
            </div>
        </vs-card>
        <!--FIN PERMISOS DE USUARIOS EXTERNOS--->
    </div>
</template>
<script>
export default {
    data() {
       return{
           pusuario:{
             asignar:'1',
           },
           users:[],
       } 
    },
    props:{
        institucion_id:{
            type:String,
            default:0
        },
    },
    mounted(){
        let me = this;
        me.getUsers();
    },
    methods:{
        getUsers(){
            let me = this;
            this.$http.get(this.$server_url+"colegioUsuarios?institucion_id="+me.institucion_id)
            .then(res => {
                me.users = res.data;
            })
            .catch(function(e){
            })
        },
        guardarUsuarioExterno(idusuario,recurso){
            let me = this;
            this.$http.get(this.$server_url + "guardarUsuarioExterno?idusuario="+idusuario+'&recurso='+recurso)
            .then(res => {
                me.$vs.notify({
                text:res.data.message,
                color:'success',
                iconPack: 'feather',
                icon:'icon-check'})
            })
            me.getUsers()
            .catch(function(e){
            })
        },
    }
   
}
</script>