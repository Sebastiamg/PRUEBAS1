<template>
  <div>
    <div>
      <div class="flex justify-center">
        <vs-button color="success" @click="m_imprimirTodos('12px',nombreArchivo,'0px')">Exportar</vs-button>
      </div>
      <vx-card id="seccionImprimir2" class="mt-2">
        <!-- <p class="text-2xl font-bold">Calificación %: {{calificacion100}}/100</p> -->
        <h4 style="font-size:20px;"><b>Total puntos: </b>{{calificacion.toFixed(2)}} / {{totalPuntaje}} -  ({{ calificacion100 }}% / 100%)</h4>
        <div v-for="(itemA, indexA) in arraySelected.asignaturas" :key="indexA">
          <h1 style="text-align: center;"> Preguntas - {{itemA.nombre_asignatura}} </h1>
          <div v-for="(itemP, indexP) in itemA.preguntas" :key="indexP" class="w-full mb-2">
            <table style="width: 100%; margin-top: 10px;">
              <tr>
                <td>
                  <p>*Pregunta de {{itemP.nombre_tipo}}</p>
                </td>
              </tr>
              <tr>
                <td colspan="2">
                  <div class="mt-2" style="font-size: 17px; min-height: 50px;" align="justify"> <b><span v-html="itemP.descripcion"></span></b> </div>
                  <div class="mt-3" v-if="itemP.respuestas.length > 0">
                    <b>{{ itemP.n_pregunta.toFixed(2) }} / {{ itemP.puntaje_pregunta }} pts.</b>
                  </div>
                  <div v-else>
                    <b>0 / {{ itemP.puntaje_pregunta }} pts.</b>
                  </div>
                </td>
              </tr>
              <!--imagen de la pregunta-->
              <tr>
                <td>
                  <img v-if="itemP.img_pregunta !== null && itemP.img_pregunta !== 'null' && itemP.img_pregunta !== ''" :src="$data_url+'archivos/img/salle/img_preguntas/'+itemP.img_pregunta" style="max-width: 400px; border-radius: 5px; mix-blend-mode: multiply;" class="mb-base">
                </td>
              </tr>
              <!--respuestas-->
              <tr>
                <!--se carga array de preguntas de seleccion multiple -->
                <td>
                  <div v-if="itemP.id_tipo_pregunta === 1" class="m-3" style="font-size: 15px;">
                    <div>
                      <div v-for="(itemRes, indexRes) in itemP.respuestas" :key="indexRes" style="display: none;">
                          {{opciones_check[itemRes.respuesta] = itemRes.respuesta}}
                      </div>
                    </div>
                    <div class="text-left mb-5" v-for="(itemO, indexO) in itemP.opciones" :key="indexO">
                      <div v-if="revision_activa===true" style="width: 85%; display: inline-block;">
                        <span v-if="opciones_check[itemO.id_opcion_pregunta] && itemO.tipo == 1" style="color: #3DE090; font-size: 18px;">✔</span>
                        <span v-if="opciones_check[itemO.id_opcion_pregunta] && itemO.tipo == 0" style="color: #E73A5A; font-size: 18px;"><b>X</b></span>

                        <span v-if="opciones_check[itemO.id_opcion_pregunta] && itemO.tipo == 1" class="text-primary font-bold" style="box-shadow: 0px 1px 3px #d8f7ca; background:#d8f7ca !important; -webkit-print-color-adjust: exact">
                          {{ itemO.opcion }}
                        </span>
                        <span v-else >
                           <span v-if="opciones_check[itemO.id_opcion_pregunta] && itemO.tipo == 0" class="text-primary font-bold" style="box-shadow: 0px 1px 3px #f7ceca;background:#f7ceca !important;-webkit-print-color-adjust: exact">
                            {{ itemO.opcion }}
                           </span>
                           <span v-else>
                            {{ itemO.opcion }}
                          </span>
                        </span>
                      </div>
                      <img v-if="itemO.img_opcion !== null && itemO.itemO !== 'null' && itemO.itemO !== ''" :src="$data_url+'archivos/img/salle/img_preguntas/'+itemO.img_opcion" alt="">
                    </div>
                  </div>
                  <div v-if="itemP.id_tipo_pregunta === 3 || itemP.id_tipo_pregunta === 5"  class="m-3" style="font-size: 15px;">
                    <!-- se carga array de preguntas de opcion simple -->
                    <div>
                      <div v-for="(itemRes, indexRes) in itemP.respuestas" :key="indexRes" style="display:none;">
                          {{opciones[itemRes.id_pregunta] = itemRes.respuesta}}
                      </div>
                    </div>
                    <ul class="justify" v-for="(itemO, indexO) in itemP.opciones" :key="indexO" style="list-style: none;">
                        <div style="display:none;">
                          {{ opciones[itemO.seleccionar] =  opciones[itemO.id_pregunta] == itemO.id_opcion_pregunta ? true : false}}
                        </div>
                      <li class="mb-5">
                        <div style="width: 85%; display: inline-block;">
                          <p v-if="opciones[itemO.seleccionar]">
                            <span v-if="itemO.tipo == 1" style="color: #3DE090; font-size: 18px;">✔</span>
                            <span v-else style="color: #E73A5A; font-size: 18px;"><b>X</b></span>
                            <span v-if="itemO.tipo == 1" class="text-primary font-bold" style="box-shadow: 0px 1px 3px #d8f7ca; background:#d8f7ca !important; -webkit-print-color-adjust: exact">
                            {{ itemO.opcion }}
                            </span>
                            <span v-else class="text-primary font-bold" style="box-shadow: 0px 1px 3px #f7ceca;background:#f7ceca !important;-webkit-print-color-adjust: exact">
                              {{ itemO.opcion }}
                            </span>
                          </p>
                          <p v-else>
                            <span>{{ itemO.opcion }}</span>
                          </p>
                          <img v-if="itemO.img_opcion !== null && itemO.itemO !== 'null' && itemO.itemO !== ''" :src="$data_url+'archivos/img/salle/img_preguntas/'+itemO.img_opcion" alt="">
                        </div>
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            </table>
          </div>
        </div>
      </vx-card>
    </div>
  </div>
</template>
<script>
import imprimirMixin from "@/mixins/Pedidosmix";
import Generalmix from "../../../../../mixins/Generalmix";
export default {
  mixins: [imprimirMixin, Generalmix],
  data() {
    return{
      opciones: [],
      opciones_check: {},
      id_evaluacion:0,
      calificacion:0,
      id_area:0,
      nombreArchivo:'',
      calificacion100:0,
      totalPuntaje:0,
    }
  },
  props:{
    arraySelected:{
      type:[Array,Object],
      default:function(){
        return []
      }
    },
    revision_activa:{
      type:Boolean,
      default:false
    },
    datos_docente_revisando:{
      type:String,
      default:''
    },
  },
  mounted(){
    let me = this
    me.nombreArchivo = me.datos_docente_revisando + " - " +me.arraySelected.nombre_area
    me.id_area       = me.arraySelected.id_area
    me.id_evaluacion = me.arraySelected.id_evaluacion
    me.calculos()
  },
  methods:{
    calculos(){
      let me = this
      let formData = new FormData();
      formData.append('id_evaluacion',me.id_evaluacion);
      formData.append('id_area',      me.id_area);
      this.$http.post(this.$server_url+'obtenerCalificacionSalle', formData)
      .then(res => {
        if(res.data.status == 0){
          me.$vs.notify({title: 'Error', text: res.data.message, color: 'danger'})
          return
        }
        let resultado     = 0
        me.totalPuntaje   = res.data.totalPuntaje
        me.calificacion   = res.data.arrayCalificacionFinal.reduce((sum, item) => {
          return sum + (item.puntaje || 0);
        }, 0);
        resultado         = (me.calificacion  / me.totalPuntaje) * 100
        me.calificacion100 = resultado.toFixed(2)
      })
    },
  }
}
</script>
