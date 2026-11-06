<template>
  <div>
    <vs-table stripe pagination max-items="25" search :data="pregSelected">
      <template slot="header">
        <vs-chip color="primary">Cantidad {{ pregSelected.length }}</vs-chip>
      </template>
      <template slot="thead">
        <vs-th style="width: 110px;">Imagen</vs-th>
        <vs-th sort-key="pregunta">Pregunta</vs-th>
        <vs-th style="width: 170px;" sort-key="id_tipo_pregunta">Tipo</vs-th>
      </template>
      <template slot-scope="{data}">
      <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
        <vs-td>
            <img v-if="data[indextr].pregunta.img_pregunta!='' && data[indextr].pregunta.img_pregunta!='null' && data[indextr].pregunta.img_pregunta!=null" v-bind:src="$data_url+'archivos/img/salle/img_preguntas/'+data[indextr].pregunta.img_pregunta" class="img-responsive" width="100px" style="border-radius: 5px;">
            <img v-else v-bind:src="$server_url+'img/salle/img_preguntas/logos/question_mark.png'" alt="imágen de referencia" class="img-responsive" width="100px" style="border-radius: 5px;">
        </vs-td>
        <vs-td :data="data[indextr].pregunta.descripcion">
            <div class="text-justify">
              <span v-html="data[indextr].pregunta.descripcion"></span>
            </div>
            <vs-collapse>
            <vs-collapse-item>
                <div slot="header"> ver opciones </div>
                <div class="mb-5" :key="indexitem" v-for="(item, indexitem) in data[indextr].opciones">
                <div style="width: 100%; font-size: 12px; color: #0DCD88;" v-if="item.tipo===1">Respuesta correcta<br></div>
                <div style="width: 100%; font-size: 12px; color: #FD5858;" v-else>Respuesta incorrecta<br></div>
                <div style="width: 100%" class="text-justify"> {{ item.opcion }}<br></div>
                <div style="width: 100%" ><img v-if="item.img_opcion!='' && item.img_opcion!='null' && item.img_opcion!=null" v-bind:src="$data_url+'archivos/img/salle/img_preguntas/'+item.img_opcion" class="img-responsive" style="border-radius: 5px;" width="100px"></div>
                </div>
            </vs-collapse-item>
            </vs-collapse>
        </vs-td>
        <vs-td :data="data[indextr].pregunta.nombre_tipo">
          {{data[indextr].pregunta.nombre_tipo}}
          <b>Período Evaluación:</b>
          {{ data[indextr].pregunta.periodo }}
        </vs-td>
      </vs-tr>
      </template>
  </vs-table>
  </div>
</template>
<script>
export default{
  props:{
    pregSelected:{
      type:Array,
      default:[]
    },
  },
  data(){
    return{

    }
  }
}
</script>
