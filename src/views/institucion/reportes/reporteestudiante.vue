<template>

<div>
    <vs-chip transparent color="danger">
         <vs-avatar />
            Total visitas {{visitasgestudiantes}}
            
      </vs-chip>
      <vs-button color="success" type="gradient" size="small" icon="folder" @click="verEstudiantes()">Listado Estudiantes</vs-button>

     <reporteestudiantebarra></reporteestudiantebarra>           
</div> 
</template>



<script>
import axios from 'axios'
import moment from 'moment'
import vSelect from 'vue-select'
import reporteestudiantebarra from './components/reporteestudiantebarra.vue'


export default ({
    data() {
        return{
           visitasgestudiantes:'',
        }
        
    },
    components: {
    reporteestudiantebarra
  },
    methods:{

     
       verEstudiantes() {
            let me = this;
            // console.log( item.idInstitucion )
            localStorage.tipoUser = "estudiante";
            me.$router.push('/reporte/estudiantes/listado');
        },

    },

     created() {
        
        let transformar = JSON.parse(localStorage.getItem("visitasgestudiantes"));
        this.visitasgestudiantes = transformar;
 
     }

   
})
</script>

