<template>

<div> 
     <vs-card>
        <vs-chip transparent color="danger">
         <vs-avatar />
            Total visitas {{visitasgestudiante}}
         </vs-chip>
        <indreporteestudiantepastel></indreporteestudiantepastel>
      </vs-card>  
</div> 
</template>



<script>
import axios from 'axios'
import moment from 'moment'
import vSelect from 'vue-select'
import indreporteestudiantepastel from './indreporte-estudiante-pastel.vue'
export default ({
    data() {
        return{
           visitasgestudiante:'',
          
        }
        
    },
    components: {
   indreporteestudiantepastel,
  },
    methods:{

     
    

    },

     created() {
        
        let transformar = JSON.parse(localStorage.getItem("visitasdindividualestudiante"));
        this.visitasgestudiante = transformar;
 
     }

   
})
</script>

