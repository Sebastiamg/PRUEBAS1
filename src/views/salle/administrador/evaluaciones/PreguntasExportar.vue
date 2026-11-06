<template>
  <vx-card
  title="Exportar preguntas del banco de preguntas"
  title-color="primary"
  subtitle="Seleccione una área para exportar por áreas o por asignaturas si desea por asignaturas"
  style="min-height: 100vh;"
  >
    <div class="vx-row mt-3">
      <!------------FILTROS BUSQUEDA PREGUNTAS-------------------->
      <div class="vx-col sm:w-1/2 w-full">
        Área
        <v-select :options="arregloAreas" :reduce="arregloAreas => arregloAreas.id_area" label="nombre_area" v-model="areaSelect" @input="getAsignaturasFiltro();getPreguntas(0)"></v-select>
      </div>
      <div class="vx-col sm:w-1/2 w-full">
        Asignaturas
        <v-select :options="arregloAsignaturas" :reduce="arregloAsignaturas => arregloAsignaturas.id_asignatura" label="nombre_asignatura" @input="getPreguntas(1)" v-model="asignaturaSelected" ></v-select>
      </div>
      <!------------FIN FILTROS BUSQUEDA PREGUNTAS------------------->
    </div>
    <div v-if="arregloPreguntas.length > 0" class="flex mt-3">
        <vs-button @click="ExportToDoc()"  color="#3dd495"  gradient-color-secondary="rgb(130, 207, 23)" type="gradient"><i class="fa-solid fa-download"></i><span class="ml-2">Exportar</span></vs-button>
    </div>
    <div id="MainHTML" class="mt-3" v-if="arregloPreguntas.length > 0">
        <div v-for="(tr,index) in arregloPreguntas" :key="index">
          <h2 class="p-2 text-3xl" style="color:#42E667">Área: {{ tr.nombre_area }}</h2>
            <div v-for="(item,index2) in tr.asignatura" :key="index2">
              <h2 class="p-2 text-warning" style="color:#D6B93A;">Asignatura: {{ item.nombre_asignatura }}</h2>
              <vs-table stripe :data="item.preguntas" no-data-text="No hay preguntas de este tema">
                <template slot="thead">
                  <vs-th sort-key="pregunta">Pregunta</vs-th>
                  <vs-th sort-key="id_tipo_pregunta">Tipo</vs-th>
                </template>
                <template slot-scope="{data}">
                  <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                    <vs-td :data="data[indextr].pregunta.descripcion">
                      <b>{{indextr+1}}. <span v-html="data[indextr].pregunta.descripcion"></span></b><br>
                      <img v-if="data[indextr].img_pregunta!='' && data[indextr].img_pregunta!='null' && data[indextr].img_pregunta!=null" v-bind:src="$data_url+'archivos/img/salle/img_preguntas/'+data[indextr].img_pregunta" class="img-responsive" width="50" height="50" style="border-radius: 5px;">
                      <div slot="header">
                            Opciones
                      </div>
                      <div class="mb-5" :key="indexitem" v-for="(item, indexitem) in data[indextr].opciones">
                        <div style="width: 100%; font-size: 12px; color: #0DCD88;" v-if="item.tipo===1">Respuesta correcta<br></div>
                        <div style="width: 100%; font-size: 12px; color: #FD5858;" v-else>Respuesta incorrecta<br></div>
                        <div style="width: 100%"> {{ item.opcion }}<br></div>
                        <div style="width: 100%" ><img v-if="item.img_opcion!='' && item.img_opcion!='null' && item.img_opcion!=null" v-bind:src="$data_url+'archivos/img/salle/img_preguntas/'+item.img_opcion" class="img-responsive" style="border-radius: 5px;" width="50" height="50"></div>
                      </div>
                    </vs-td>
                    <vs-td :data="data[indextr].pregunta.nombre_tipo">
                      <p>{{data[indextr].pregunta.nombre_tipo}}</p>
                    </vs-td>
                  </vs-tr>
                </template>
              </vs-table>
            </div>
        </div>
    </div>
  </vx-card>
</template>
<script>
import vSelect from 'vue-select'
export default{
  data(){
      return{
        arregloAreas:[],
        arregloAsignaturas:[],
        arregloPreguntas:[],
        periodoSelect:'',
        areaSelect:'',
        asignaturaSelected:'',
      }
  },
  components:{
    vSelect,
  },
  mounted(){
    let me = this;
    me.usuario = JSON.parse(localStorage.getItem("usuario"))
    let getEvaluacionSelect = localStorage.EvaluacionSelectSalle
    if(getEvaluacionSelect){
      me.periodoSelect = parseInt(getEvaluacionSelect)
      me.getAreas()
    }
  },
  methods:{
    getAreas(){
      let me                = this
      me.arregloAreas       = []
      me.arregloAsignaturas = []
      me.arregloPreguntas   = []
      me.areaSelect         = ""
      me.asignaturaSelected = ""
      if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
        me.$vs.notify({
        text:'Seleccione una Evaluación Período por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      this.$http.get(this.$server_url+'areas_salle')
      .then(res => {
        let datos = res.data
        if(datos.length > 0){
          me.arregloAreas = datos.filter(p => p.n_evaluacion == me.periodoSelect)
        }
      })
      .catch(function (error) {
          console.log(error);
      })
    },
    getAsignaturasFiltro(){
      let me = this
      me.arregloPreguntas    = []
      me.asignaturaSelected  = ""
      this.$http.get(this.$server_url+'asignaturas_area_salle/' + me.areaSelect)
      .then(res => {
        me.arregloAsignaturas = res.data;
      })
      .catch(function (error) {
          console.log(error);
      })
    },
    getPreguntas(tipo){
      let me = this;
      me.arregloPreguntas = []
      //tipo => 0 = por areas; 1 = por asignaturas
      if(me.areaSelect == null || me.areaSelect == "" || me.areaSelect == undefined){
        me.$vs.notify({
        text:'Seleccione una area por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      if(tipo == 1){
        if(me.asignaturaSelected == null || me.asignaturaSelected == "" || me.asignaturaSelected == undefined){
          me.$vs.notify({
          text:'Seleccione una Asignatura por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
      }
      this.$http.get(this.$server_url+'salle/exportAllPreguntasXAsignatura?periodo='+me.periodoSelect+'&area='+me.areaSelect+'&asignatura='+me.asignaturaSelected+'&tipo='+tipo)
        .then(function (res) {
          me.arregloPreguntas = res.data
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
    },
    ExportToDoc(){
      let me = this;
      if(me.periodoSelect == null || me.periodoSelect == "" || me.periodoSelect == undefined){
        me.$vs.notify({
        text:'Seleccione una Evaluación Período por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      if(me.areaSelect == null || me.areaSelect == "" || me.areaSelect == undefined){
        me.$vs.notify({
        text:'Seleccione una area por favor',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      let setPeriodo = localStorage.EvaluacionSelectSalleNombre? localStorage.EvaluacionSelectSalleNombre : ""
      let getArea    = me.arregloAreas.filter(p => p.id_area == me.areaSelect)
      let setArea    = getArea[0].nombre_area
      let filename = ""
      filename = 'Preguntas '+setPeriodo+'_'+setArea
      var HtmlHead = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      var EndHtml = "</body></html>";
      //complete html
      var html = HtmlHead +document.getElementById("MainHTML").innerHTML+EndHtml;
      //specify the type
      var blob = new Blob(['\ufeff', html], {
        type: 'application/msword'
      });
      // Specify link url
      var url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
      // Specify file name
      filename = filename?filename+'.doc':'document.doc';
      // Create download link element
      var downloadLink = document.createElement("a");
      document.body.appendChild(downloadLink);
      if(navigator.msSaveOrOpenBlob ){
        navigator.msSaveOrOpenBlob(blob, filename);
      }else{
        // Create a link to the file
        downloadLink.href = url;
        // Setting the file name
        downloadLink.download = filename;
        //triggering the function
        downloadLink.click();
      }
      document.body.removeChild(downloadLink);
    },
  }
}
</script>
