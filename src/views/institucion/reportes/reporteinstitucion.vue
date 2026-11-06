<template>
<div>
    
    <div class="">
     
        <vs-tabs>
        <vs-tab label="Institucion">
            <div class="con-tab-ejemplo">
                <vs-card> 
                  <vs-chip transparent color="danger">
                    <vs-avatar />
                 
                        Total visitas {{visitasginstitucion}}
                    </vs-chip>
                   
                    <h1 style="text-align:center; font-weigth:100;">Reporte estadistico de {{visitasnombreinstitucion}}</h1>
                     <!--Para el reporte en grafico-->
                    <reporteinstitucionbarra></reporteinstitucionbarra>
                    <!--Para el reporte en pdf-->
                    <pdfinstitucion></pdfinstitucion>
                </vs-card>
            </div>
        </vs-tab>
        <vs-tab label="Docentes" @click="getReporteDocente()">
            <div class="con-tab-ejemplo">
                <vs-card> 
                    <!--Para el reporte en grafico-->
                    <reportedocente></reportedocente>
                     <!--Para el reporte en pdf-->
                    <pdfdocente></pdfdocente>
                </vs-card> 
            </div>
        </vs-tab>
        <vs-tab label="Estudiantes">
            <div class="con-tab-ejemplo">
                <vs-card> 
                    <reporteestudiante></reporteestudiante>
                </vs-card> 
            </div>
        </vs-tab>
     
        </vs-tabs>
    </div>

      

    
            
</div> 
</template>



<script>
import axios from 'axios'
import moment from 'moment'
import vSelect from 'vue-select'
import reportedocente from './reportedocente.vue'
import reporteestudiante from './reporteestudiante.vue'
import reporteinstitucionbarra from './components/reporteinstitucionbarra.vue'
//para los reportes pdfs
import pdfinstitucion from './components/pdfinstitucion.vue'
import pdfdocente from './components/pdfdocente.vue'




export default ({
    data() {
        return{
           docentes:[],
           visitasginstitucion:'',
           visitasnombreinstitucion:'',
           historicoDocenteArreglo:[],
           historicoinstitucionArreglo:[],
            visitasid:"",
        }
        
    },
    components: {
    reporteinstitucionbarra,
    reportedocente,
    reporteestudiante,
    //para los reportes pdf
    pdfinstitucion,
    pdfdocente,
  },
    methods:{

      getReporteDocente(){
            let transformar2 = JSON.parse(localStorage.getItem("visitasid"));
            let item = transformar2;
            let me = this;
            axios.get('https://foro.prolipadigital.com.ec/historico-recursos?idinstitucion='+item+'&_limit=-1')
            .then(res=>{
                   
                this.historicoinstitucionArreglo = res.data;

                //para guardar en localstorage el historico de docentes
                me.historicoDocenteArreglo = this.historicoinstitucionArreglo.filter(p => p.idgrupo == "6");
               localStorage.setItem("historicoDocenteArreglo", JSON.stringify(this.historicoDocenteArreglo));

            })
            .catch(err=>{
                console.log( err )
            })
        },
        
    
    

    },
    created() {
        //para traer del localstorage las visitas de la institucion
        let transformar3 = JSON.parse(localStorage.getItem("visitasid"));
        this.visitasid = transformar3;

        //para traer del localstorage las visitas de la institucion
        let transformar = JSON.parse(localStorage.getItem("visitasginstitucion"));
        this.visitasginstitucion = transformar;
        //para traer del localstorage el nombre de la institucion
         let transformar2 = JSON.parse(localStorage.getItem("visitasnombreinstitucion"));
        this.visitasnombreinstitucion = transformar2;

 
     }

     

   
})
</script>

