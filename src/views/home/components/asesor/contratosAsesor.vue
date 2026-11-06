<template>
    <div>      
        <vs-card v-if="usuario.id_group == 11" style="min-height:500px;">
            <vs-tabs alignment="center">
                <vs-tab label="Contratos - Periodos Activos">
                    <div>
                        <contratoActivos/>
                    </div>
                </vs-tab>
                <vs-tab label="Contratos - Periodos Inactivos"> 
                    <div>
                        <contratosDesactivos/>
                    </div>
                </vs-tab>
            </vs-tabs>
        </vs-card>
    </div>
</template>

<script>
import vSelect from 'vue-select'
import contratoActivos from './components/contratoActivos.vue'
import contratosDesactivos from './components/contratosDesactivos.vue'
export default {
 
    data() {
        return{
        usuario:[],
        }
    },
    components: {
        'v-select': vSelect,
        contratoActivos,
        contratosDesactivos,
                
    },
    created(){
        let me = this;
        me.usuario = JSON.parse(localStorage.getItem('usuario'))
    },
  
    methods:{
      
    }
}
</script>