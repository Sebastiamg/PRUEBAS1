<template>
  <div>
    <vs-table stripe :multiple="isMultipleEnabled" v-model="pregSelected" pagination max-items="25" search :data="arrayPreguntas">
      <template slot="header">
        <div class="flex">
          <vs-chip class="mr-3">Cantidad {{ arrayPreguntas.length }}</vs-chip>
          <vs-button type="border" color="dark" @click="asignarPreguntas();" icon="check" v-if="btnAsignar == 1 && pregSelected.length > 0">Asignar Preguntas</vs-button>
        </div>
      </template>
      <template slot="thead">
          <vs-th sort-key="pregunta">#</vs-th>
          <vs-th sort-key="pregunta">Pregunta</vs-th>
          <vs-th sort-key="id_tipo_pregunta">Tipo</vs-th>
          <vs-th>Opciones</vs-th>
      </template>
      <template slot-scope="{data}">
      <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
            Pregunta #id
            <p>{{ tr.id }}</p>
            <b>Editor:</b>
            <p>{{ tr.editor }} </p>
            <b>Fecha asignación</b>
            <p>{{ tr.created_at }}</p>
            <p><vs-chip color="primary" v-if="tr.estado == '1'">Activo</vs-chip></p>
            <p><vs-chip color="danger" v-if="tr.estado == '0'">Desactivado</vs-chip></p>
          </vs-td>
          <vs-td :data="data[indextr].descripcion">
            <p><b>Unidad:</b> {{ tr.unidad }}</p>
            <p><b>Tema:</b> {{ tr.nombre_tema }}</p>
              {{ data[indextr].descripcion }}<br>
              <img v-if="data[indextr].img_pregunta!='' && data[indextr].img_pregunta!='null' && data[indextr].img_pregunta!=null" v-bind:src="$data_url+'archivos/img/img_preguntas/'+data[indextr].img_pregunta" class="img-responsive" width="100px" style="border-radius: 5px;">

              <vs-collapse>
              <vs-collapse-item>
                  <div slot="header">
                    <div v-if="data[indextr].opciones.length > 0">
                      Opciones
                    </div>
                    <div v-else>
                      <!--no hay opciones-->
                      <p class="text-center font-bold text-danger">No hay opciones para esta pregunta</p>
                    </div>
                  </div>
                  <div v-if="data[indextr].opciones.length > 0">
                    <div class="mb-5" :key="indexitem" v-for="(item, indexitem) in data[indextr].opciones">
                      <div style="width: 100%; font-size: 12px; color: #0DCD88;" v-if="item.tipo===1">Respuesta correcta<br></div>
                      <div style="width: 100%; font-size: 12px; color: #FD5858;" v-else>Respuesta incorrecta<br></div>
                      <div style="width: 100%"> {{ item.opcion }}<br></div>
                      <div style="width: 100%" ><img v-if="item.img_opcion!='' && item.img_opcion!='null' && item.img_opcion!=null" v-bind:src="$data_url+'archivos/img/img_preguntas/'+item.img_opcion" class="img-responsive" style="border-radius: 5px;" width="100px"></div>
                    </div>
                  </div>
              </vs-collapse-item>
              </vs-collapse>
          </vs-td>
          <vs-td :data="data[indextr].nombre_tipo">
              {{data[indextr].nombre_tipo}}
          </vs-td>
          <vs-td>
            <!--boton eliminar-->
            <vs-button @click="openConfirm(data[indextr])" color="danger" icon="delete" v-if="isbtnQuitar">Quitar</vs-button>
          </vs-td>
      </vs-tr>
      </template>
  </vs-table>
  </div>
</template>
<script>
export default {
  data() {
    return{
      pregSelected:[],
    }
  },
  props: {
    arrayPreguntas: {
      type: Array,
      default: function () {
        return []
      }
    },
    btnAsignar:{
      type:Number,
      default:1
    },
    selectedInstitucion:{
      type:Number,
      default:0
    },
    isMultipleEnabled:{
      type:Boolean,
      default:true
    },
    isbtnQuitar:{
      type:Boolean,
      default:false
    },
    acciones:{
      type:Boolean,
      default:false
    }
  },
  methods: {
    asignarPreguntas(){
      this.$emit('changeAsignar',true ,this.pregSelected)
    },
    //confirm eliminar pregunta
    openConfirm(tr){
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: 'Quitar pregunta',
        text: '¿Está seguro que desea quitar esta pregunta?',
        acceptText: 'Aceptar',
        accept: this.eliminarPregunta,
        parameters: tr
      })
    },
    eliminarPregunta(tr){
      let me = this
      // Code to delete a question
      let formData = new FormData();
      formData.append('id', tr.idAsignado);
      formData.append('id_Pregunta', tr.id);
      me.$http.post(me.$server_url + 'preguntas/delete', formData).then(res => {
        if(res.data.status == 0){
          me.$vs.notify({
            title: 'Error',
            text: res.data.message,
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-circle',
            acceptText: 'Aceptar',
            cancelText: 'Cancelar'
          });
          return;
        }
        me.$vs.notify({
          title: 'Exito',
          text: 'Pregunta Quitada',
          color: 'success',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        me.$emit('changeHandle',true)
      })
    }
  }
}
</script>
