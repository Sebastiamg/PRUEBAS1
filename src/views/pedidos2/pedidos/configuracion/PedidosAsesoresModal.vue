<template>
    <div>
        <div>
            <p class="text-center">Seleccione el asesor que desea asignar al pedido</p>
            <v-select :options="arreglosAsesores" :reduce="arreglosAsesores => arreglosAsesores" label="usuario" class="w-full mt-5" v-model="asesorSelected" />
        </div>
        <br>
        <div class="mt-5 flex justify-center">
            <vs-button color="success" @click="f_userSelected()" type="gradient">Asignar usuario para pedido</vs-button>
        </div>
        <br><br><br><br><br>
    </div>
</template>
<script>
import UserRepository from '../../../../repositories/UserRepository';
import Generalmix from '../../../../mixins/Generalmix';
import vSelect from 'vue-select'
export default{
    mixins:[Generalmix],
    components:{
        vSelect,
    },
    data(){
        return{
            arreglosAsesores:[],
            asesorSelected:'',
        }
    },
    mounted(){
        let me = this
        me.getUsuarios()
    },
    methods:{
        getUsuarios(){
            let me = this;
            me.$vs.loading()
            UserRepository.getUsuariosXRolx(11).then(p => {
                me.$vs.loading.close()
                me.arreglosAsesores = p.data.filter(p => p.estado_idEstado == 1).sort((a, b) => a.usuario.localeCompare(b.usuario))
                //unir usuario y cedula en campo llamado usuario_cedula
                // me.arreglosAsesores.forEach(p => {
                //     p.usuario_cedula = p.usuario + ' - ' + p.cedula
                // })
            })
        },
        f_userSelected(){
            let me = this;
            if(me.asesorSelected == null | me.asesorSelected == '' || me.asesorSelected == undefined){
                me.m_message('Debe seleccionar un asesor', 'warning', 'icon-alert-triangle')
                return;
            }
            me.$emit('changeAsesorSelected', me.asesorSelected)
        },
    }
}
</script>