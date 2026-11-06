<template>

<div> 
     <vs-card>
        <vs-chip transparent color="danger">
         <vs-avatar />
            Total visitas {{visitasgdocente}}
         </vs-chip>
        <indreportedocentepastel></indreportedocentepastel>
      </vs-card>  
</div> 
</template>



<script>
import axios from 'axios'
import moment from 'moment'
import vSelect from 'vue-select'
import indreportedocentepastel from './reporte-individual-pastel-docente.vue'

export default ({
    data() {
        return{
           visitasgdocente:'',
          
        }
        
    },
    components: {
    indreportedocentepastel,
    
  },
    methods:{

     
    

    },

     created() {
        
        let transformar = JSON.parse(localStorage.getItem("visitasdindividual"));
        this.visitasgdocente = transformar;
 
     }

   
})
</script>

