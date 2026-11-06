<template>
<div>

  <vs-popup title="Agregar un archivo" :active.sync="popupArchivo">

    <span style="top: -10px; position: relative; margin-right: 10px;">Elija un departamento:</span>
    <v-select style="display: inline-block; width: 300px;" class="mb-4" :options="departamentos" :reduce="departamentos => departamentos" label="nombre_categoria" v-model="departamento"></v-select>

    <div class="vx-row mb-6">

      <div class="vx-col w-full">
        <div class="content_archivos content_subir" align="center">

            <div v-if="nombre_file" class="w-full mb-4">

              <vs-button radius color="danger" size="large" type="filled" icon-pack="feather" icon="icon-trash" class="m-3 float-right" style="margin-bottom: -100px;" @click="nombre_file = ''"></vs-button>

              <vs-button radius color="success" :disabled="subir_disabled" size="large" type="filled" icon-pack="feather" icon="icon-upload" class="m-3 float-right" style="margin-bottom: -100px;" @click="guardarArchivo"></vs-button>

              <img v-if="nombre_file.split('.')[1] == 'xls' || nombre_file.split('.')[1] == 'xlsx'" src="../../assets/images/departamentos/excel_ico.png" class="img_selected">
              <img v-else-if="nombre_file.split('.')[1] == 'pdf'" src="../../assets/images/departamentos/pdf_ico.png" class="img_selected">
              <img v-else-if="nombre_file.split('.')[1] == 'png' || nombre_file.split('.')[1] == 'jpg'" src="../../assets/images/departamentos/img_ico.png" class="img_selected">
              <img v-else-if="nombre_file.split('.')[1] == 'mp4' || nombre_file.split('.')[1] == 'mpeg' || nombre_file.split('.')[1] == 'mov' || nombre_file.split('.')[1] == 'wmv'" src="../../assets/images/departamentos/img_ico.png" class="video_selected">
              <img v-else-if="nombre_file.split('.')[1] == 'rar' || nombre_file.split('.')[1] == 'zip'" src="../../assets/images/departamentos/zip_ico.png" class="img_selected">
              <img v-else src="../../assets/images/departamentos/file_ico.png" class="img_selected">

              <b>Nombre archivo:</b> {{nombre_file}} <br>
              <b>Tamaño:</b> <span v-if="size_file>0">{{size_file}}</span><span v-else>0.01</span> <span v-if="size_file < 1">KB</span><span v-else>MB</span> <br>

              <div style="color: red; padding-top: 10px;"><b v-if="size_file > 25">No puede subir archivos que excedan los 25 MB</b></div>
              <div style="color: red; padding-top: 10px;"><b v-if="nombre_valido === false ">El nombre del archivo no es válido, solo se aceptan letras, números y/o guiónes. Renombre el archivo y vuelva a subirlo</b></div>

            </div>

            <div v-else class="w-full text-center">
              <input type="file" name="file1" id="file1" class="inputfile" style="display: none;" v-on:change="mostrarImg(1,1)">
              <label for="file1" style="cursor: pointer; color: gray; font-size: 12px;">
                Click aquí para subir archivo
              </label>
            </div>

        </div>
      </div>

    </div>
  </vs-popup>


  <div class="vx-row mb-6">

    <div class="vx-col sm:w-1/4 w-full">
      <vx-card>

        <vs-list>
          <vs-list-header title="Departamentos" color="primary"></vs-list-header>

          <vs-list-item :key="index" v-for="(item, index) in departamentos"  style="cursor: pointer;">
            <template slot="avatar">
              <img src="../../assets/images/departamentos/folder_ico.png" style="width: 30px; transition: 0.3s;" class="m-4 folder_list" @click="departamento = item; verArchivos(item.id_categoria); fecha_archivo = ''; tipo_selected = '';">
              <p @click="departamento = item; verArchivos(item.id_categoria); fecha_archivo = ''; tipo_selected = '';">
                {{ item.nombre_categoria }}
              </p>
            </template>
          </vs-list-item>
        </vs-list>

      </vx-card>
    </div>

    <div class="vx-col sm:w-3/4 w-full">
      <vx-card>

        <vs-table stripe pagination max-items="10" search :data="archivos_departamento">
        <template slot="header">

            <vs-button style="font-size: 14px;" icon-pack="feather" icon="icon-plus" icon-after color="dark" class="mr-3" type="border" @click="popupArchivo = true;  fecha_archivo = ''; tipo_selected = '';">Agregar</vs-button>

            <datepicker style="width: 120px;" class="mr-3" :minimumView="'month'" :maximumView="'year'"  v-model="fecha_archivo" placeholder="Filtro por fecha" @input="archivos_filtro"></datepicker>

            <!-- <flat-pickr style="width: 120px;" class="mr-3" :config="configdateTimePicker" v-model="fecha_archivo" placeholder="Filtro por fecha" @input="archivos_filtro"/> -->

            <v-select style="width: 170px;" placeholder="Tipo de archivo" v-model="tipo_selected" :options="tipos_archivos" :dir="$vs.rtl ? 'rtl' : 'ltr'" @input="archivos_filtro"></v-select>
        </template>

        <template slot="thead">
            <vs-th colspan="2">Archivo</vs-th>
            <vs-th>Autor</vs-th>
            <!-- <vs-th colspan="2">Fecha</vs-th> -->
        </template>

        <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td>
              <img v-if="tr.nombre_archivo.split('.')[1] == 'xls' || tr.nombre_archivo.split('.')[1] == 'xlsx'" src="../../assets/images/departamentos/excel_ico.png" class="img_list">
              <img v-else-if="tr.nombre_archivo.split('.')[1] == 'pdf'" src="../../assets/images/departamentos/pdf_ico.png" class="img_list">
              <img v-else-if="tr.nombre_archivo.split('.')[1] == 'png' || tr.nombre_archivo.split('.')[1] == 'jpg'" :src="$data_url+'archivos/departamentos/'+tr.nombre_archivo" class="img_list">
              <img v-else-if="tr.nombre_archivo.split('.')[1] == 'mp4' || tr.nombre_archivo.split('.')[1] == 'mpeg' || tr.nombre_archivo.split('.')[1] == 'mov' || tr.nombre_archivo.split('.')[1] == 'wmv'" src="../../assets/images/departamentos/img_ico.png" class="video_selected">
              <img v-else-if="tr.nombre_archivo.split('.')[1] == 'rar' || tr.nombre_archivo.split('.')[1] == 'zip'" src="../../assets/images/departamentos/zip_ico.png" class="img_list">
              <img v-else src="../../assets/images/departamentos/file_ico.png" class="img_list">
          </vs-td>
          <vs-td>{{tr.nombre_archivo.slice(13,100)}}</vs-td>
          <vs-td>{{tr.nombres +' '+tr.apellidos}}</vs-td>
          <!-- <vs-td>{{tr.created_at}}</vs-td> -->
          <vs-td>
            <vs-button size="small" radius color="primary" type="filled" icon-pack="feather" icon="icon-eye" class="m-1" @click="visualizar_archivo(tr);"></vs-button>

            <vs-button size="small" radius color="dark" type="filled" icon-pack="feather" icon="icon-download" class="m-1" @click="descargar_archivo(tr);"></vs-button>
            <vs-button v-if="usuario.idusuario == tr.idusuario || usuario.idusuario == 1" size="small" radius color="danger" type="filled" icon-pack="feather" icon="icon-trash" class="m-1" @click="confirm_eliminar_archivo(); archivo_eliminar = tr"></vs-button>
          </vs-td>
        </vs-tr>
        </template>
        </vs-table>

      </vx-card>
    </div>
  </div>



</div>
</template>

<script>

import Vue from 'vue'
import axios from 'axios'
Vue.use(axios)
import vSelect from "vue-select";
import flatPickr from 'vue-flatpickr-component'
import 'flatpickr/dist/flatpickr.css';
import Datepicker from 'vuejs-datepicker';
export default {
data(){
    return {
      active:false,
      activePrompt: false,
      descripcion: '',
      value1: '',
      value2: '',
      departamento: {},
      departamentos: [],
      nombre_file: '',
      size_file: '',
      subir_disabled: false,
      nombre_valido: true,
      archivo_seleccionado: [],
      popupArchivo: false,
      archivos_departamento: [],
      departamento_selected: '',
      usuario: [],
      fecha_archivo: '',
      configdateTimePicker: {
          enableTime: true,
          dateFormat: 'Y-m'
      },
      tipo_selected: '',
      tipos_archivos: [
        {id: '0', label: 'Todos'},
        {id: '1', label: 'Excel'},
        {id: '2', label: 'Word'},
        {id: '3', label: 'Imágenes'},
        {id: '4', label: 'Comprimidos'},
        {id: '5', label: 'Videos'},
        {id: '6', label: 'PDF'},
        {id: '7', label: 'Otros'},
      ],
      archivo_eliminar: [],
    }
  },
  components: {
    'v-select': vSelect,
    flatPickr,
    Datepicker
  },
  mounted() {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.getDepartamentos()
  },
  methods:{
    getDepartamentos(){
      let me = this
      this.$http.get(me.$server_url+'files_departamentos')
      .then(res => {
          me.departamentos = res.data
          me.verArchivos(res.data[0].id_categoria)
      })
      .catch(function (error) {
          console.log(error);
      })
    },
    mostrarImg(file, img){
        let me = this;
        var archivo = document.getElementById("file1").files[0];
        me.archivo_seleccionado = archivo
        me.nombre_file = archivo.name
        me.size_file = (archivo.size / 1000000).toFixed(2)
        if( me.size_file > 15 ){
          me.subir_disabled = true
        }
        if ( !/^[a-zA-Z]*$/g.test(me.nombre_file) ) {
            me.nombre_valido = true
        }else{
          me.nombre_valido = false
          me.subir_disabled = true
        }
    },
    guardarArchivo(){
      let me = this

      if( me.departamento ){
        if( me.departamento.id_categoria){

          me.$vs.loading()
          // var fileArchivo = document.getElementById("file1").files[0];

          const formData = new FormData();
          formData.append('id_departamento', me.departamento.id_categoria);
          formData.append('nombre_archivo', me.archivo_seleccionado);
          formData.append('id_usuario', me.usuario.idusuario);
          axios.post(this.$data_url+'api/files_departamentos_save', formData)
          .then(res => {
              me.$vs.loading.close()
              me.verArchivos(me.departamento_selected)
              me.$vs.notify({
              text:'Archivo subido exitosamente.',
              color:'success',
              iconPack: 'feather',
              icon:'icon-check'})
          })
          .catch(function (error) {
              me.$vs.loading.close()
              console.log(error + ': error al crear archivo_seleccionado');
          })

        }else{
          this.$vs.notify({
              color: 'warning',
              title: 'Seleccione un departamento antes de subir su archivo.',
          })
        }
      }else{
        this.$vs.notify({
            color: 'warning',
            title: 'Seleccione un departamento antes de subir su archivo.',
        })
      }

    },
    verArchivos(id_categoria){
      let me = this
      me.nombre_file = ''
      me.departamento_selected = id_categoria
      me.$vs.loading()
      this.$http.get(me.$server_url+'ver_archivos_departamento/'+id_categoria)
      .then(res => {
          me.archivos_departamento = res.data
          me.$vs.loading.close()
          me.popupArchivo = false
      })
      .catch(function (error) {
          me.$vs.loading.close()
          console.log(error);
      })
    },
    archivos_filtro(){
      let me = this
      me.$vs.loading()

      let mes = ''
      let mes_filtro  = ''
      if( me.fecha_archivo ){
        mes = (me.fecha_archivo.getMonth()+1).toString()
        if( mes.length == 1 ){ mes = ('0' + mes) }
        mes_filtro = me.fecha_archivo.getFullYear()  + "-" + mes
      }



      var fecha = 'null'
      var tipo = 'null'
      if( mes_filtro ){fecha = mes_filtro}
      if( me.tipo_selected ){if( me.tipo_selected.id ){tipo = me.tipo_selected.id}}

      this.$http.get(me.$server_url+'archivos_departamento_filtro/'+me.departamento_selected+'/'+fecha+'/'+tipo)
      .then(res => {
          me.archivos_departamento = res.data
          me.$vs.loading.close()
          me.popupArchivo = false
      })
      .catch(function (error) {
          me.$vs.loading.close()
          console.log(error);
      })
    },
    confirm_eliminar_archivo(){
      this.$vs.dialog({
        type: 'confirm',
        color: 'danger',
        title: `Confirmar`,
        text: '¿Está seguro de eliminar este archivo?',
        accept: this.eliminar_archivo
      })
    },
    eliminar_archivo(){
      let me = this

      const formData = new FormData();
      formData.append('id_usuario', me.usuario.idusuario);
      formData.append('nombre_archivo', me.archivo_eliminar.nombre_archivo);
      formData.append('id_archivo', me.archivo_eliminar.id_archivo);

      this.$http.post(me.$server_url+'remover_archivo', formData)
      .then(res => {
          me.verArchivos(me.departamento_selected)
          me.$vs.loading.close()
      })
      .catch(function (error) {
          me.$vs.loading.close()
          console.log(error);
      })
    },
    visualizar_archivo(item){
      let me = this

      if (item.nombre_archivo.substr(-3) == "pdf" || item.nombre_archivo.substr(-3) == "png" || item.nombre_archivo.substr(-3) == "jpg") {
          window.open(this.$data_url+'archivos/departamentos/' + item.nombre_archivo, '_blank');
      } else if ( item.nombre_archivo.substr(-3) == "doc" || item.nombre_archivo.substr(-3) == "ocx" || item.nombre_archivo.substr(-3) == "xls" || item.nombre_archivo.substr(-3) == "lsx" ) {
          window.open('https://view.officeapps.live.com/op/embed.aspx?src='+this.$data_url+'archivos/departamentos/' + item.nombre_archivo, '_blank');
      }

    },
    descargar_archivo(item){
      let me = this

      window.open(this.$data_url+'archivos/departamentos/' + item.nombre_archivo, '_blank');

    },
  }
}
</script>


<style>
.content_archivos{
  -webkit-box-shadow: 0px 0px 7px 0px rgba(212,212,212,1);
  -moz-box-shadow: 0px 0px 7px 0px rgba(212,212,212,1);
  box-shadow: 0px 0px 7px 0px rgba(212,212,212,1);
  border-radius: 5px;
  min-height: 100px;
}

.content_subir{
  display: -ms-flexbox;
  display: -webkit-flex;
  display: flex;
  -ms-flex-align: center;
  -webkit-align-items: center;
  -webkit-box-align: center;
  align-items: center;
}
.img_selected{
  width: 170px; border-radius: 5px;
}
.img_list{
  width: 70px; border-radius: 5px;
}
.folder_list:hover{
  width: 40px !important;
  opacity: 0.5;
}
</style>
