<template>
    <div>
        <vx-card class="">
            <vs-list-header icon="supervisor_account" :title="'Materia: '+nombrelibro"></vs-list-header>
            <vs-list-header icon="supervisor_account" :title="'Estudiante: '+estudiante"></vs-list-header>
            <vs-list-header icon="supervisor_account" :title="'Calificación: '+calificacion.calificacion_diagnostica+'/'+calificacion.cantidad_preguntas"></vs-list-header>
            <br>
            <small class="font-bold" v-if="arregloRespuestas.length > 0 ">Instrucción: Lea detenidamente las preguntas y escoga verdadero o falso</small>
            <vs-divider></vs-divider>
            <br><br>
            <div class="vx-row mb-3" :key="indexitem" v-for="(item, indexitem) in arregloRespuestas">
                <div class="vx-col sm:w-1/5 w-full" align="center">
                    <img v-if="item.imagen" style="border-radius: 5px;" v-bind:src="$data_url+'archivos/diagnostico/img/img_preguntas/'+item.imagen" width="100">
                </div>
                <div class="vx-col sm:w-4/5 w-full" style="display: flex;justify-content: space-between;" >
                    <p class="text-primary  font-light">{{indexitem + 1}}. {{item.pregunta}}</p>
                    <div class="vx-row" align="center">
                        <div class="vx-col  w-full flex">
                            <div>
                                <span>Verdadero </span>  <input disabled  class="ml-2" type="radio" id="html" v-model="item.respuesta_estudiante" :name="indexitem" value="1">
                                <span class="ml-5">Falso </span> <input disabled class="ml-2"  type="radio" id="html" v-model="item.respuesta_estudiante" :name="indexitem" value="0">
                            </div>
                            <div>
                                <vs-chip v-if="item.respuesta_estudiante == item.respuesta_correcta" transparent class="mb-2 ml-2" style="font-weight: bold;" color="success"><i class="fa-solid fa-check"></i> <b class="ml-1"></b></vs-chip>
                                <vs-chip v-else transparent class="mb-2 ml-2" style="font-weight: bold;" color="danger"><i class="fa-solid fa-x"></i> <b class="ml-1"></b></vs-chip>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <br><br><br><br>
            <!-- <div class="flex mt-5">
                <vs-button color="success" v-if="getError == false" icon="save" class="mr-3 mb-2 ml-5" @click="openConfirm()">Enviar evaluación</vs-button>
            </div> -->
        </vx-card>
    </div>
</template>
<script>
export default{
    props:{
        arregloRespuestas:{
            type:Array,
            default:[]
        },
        nombrelibro:{
            type:String,
            default:""
        },
        estudiante:{
            type:String,
            default:""
        },
        calificacion:{
            type:Object,
            default:{}
        }
    },  
    data(){
        return{

        }
    }
}
</script>