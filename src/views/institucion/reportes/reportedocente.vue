<template>

<div>
        <vs-chip transparent color="danger">
         <vs-avatar />
            Total visitas {{visitasgdocente}}
         </vs-chip>
         <vs-button color="success" type="gradient" size="small" icon="folder" @click="verDocentes()">Listado docentes</vs-button>

     <reportedocentebarra></reportedocentebarra>           
</div> 
</template>



<script>
import axios from 'axios'
import moment from 'moment'
import vSelect from 'vue-select'
import reportedocentebarra from './components/reportedocentebarra.vue'


export default ({
    data() {
        return{
           visitasgdocente:'',
        }
        
    },
    components: {
    reportedocentebarra
  },
    methods:{

      verDocentes() {
            let me = this;
            // console.log( item.idInstitucion )
            // localStorage.statusdocente ="uno"
            localStorage.tipoUser = "docente";
            me.$router.push('/reporte/docente/listado');
        }, 
    

    },

     created() {
        
        let transformar = JSON.parse(localStorage.getItem("visitasgdocente"));
        this.visitasgdocente = transformar;
 
     }

   
})
</script>

