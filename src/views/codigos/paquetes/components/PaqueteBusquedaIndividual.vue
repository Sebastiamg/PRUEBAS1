<template>
  <div>
    <div class="s009">
      <div class="form">
        <div class="inner-form">
          <div class="basic-search">
            <div class="input-field">
              <input id="search" @keydown.space="(event) => event.preventDefault()" @keyup.enter="getPaquetes" type="text" v-model="busqueda" placeholder="Ingrese el paquete" />
              <div class="icon-wrap cursor-pointer" @click="getPaquetes()">
                <svg class="svg-inline--fa fa-search fa-w-16" fill="#ccc" aria-hidden="true" data-prefix="fas" data-icon="search" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                  <path d="M505 442.7L405.3 343c-4.5-4.5-10.6-7-17-7H372c27.6-35.3 44-79.7 44-128C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c48.3 0 92.7-16.4 128-44v16.3c0 6.4 2.5 12.5 7 17l99.7 99.7c9.4 9.4 24.6 9.4 33.9 0l28.3-28.3c9.4-9.4 9.4-24.6.1-34zM208 336c-70.7 0-128-57.2-128-128 0-70.7 57.2-128 128-128 70.7 0 128 57.2 128 128 0 70.7-57.2 128-128 128z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!--Table-->
    <div class="flex w-full" v-if="arregloPaquetes.length > 0">
      <vs-chip  color="primary">
        Cantidad: <b> {{ arregloPaquetes.length }}</b><br>
      </vs-chip>
      <vs-button
        color="success"
        type="filled"
        icon-pack="feather"
        icon="icon-download"
        @click="exportarExcel"
        class="ml-5"
        >
        Exportar Excel
      </vs-button>
    </div>
    <vs-table max-items="10" stripe search pagination :data="arregloPaquetes">
      <template slot="header">

      </template>
      <template slot="thead">
          <vs-th>Paquete</vs-th>
          <vs-th>Códigos</vs-th>
          <vs-th>Estado</vs-th>
          <!-- <vs-th>Acciones</vs-th> -->
      </template>
      <template slot-scope="{data}">
        <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
          <vs-td width="10%">
              {{  tr.paquete  }}<br>
              <b>Linea:</b>
              <p>{{ tr.linea_producto }}</p>
          </vs-td>
          <vs-td width="30%">
            <div class="overflow-y-auto">
              <vs-divider>
                <div v-if="tr.codigos.length > 0">
                  <b>Paquete: {{ tr.codigos.length }} códigos</b>
                </div>
              </vs-divider>
              <div class="flex mt-4" style="font-size:10px;width: 100%;" v-for="(item,index) in tr.codigos">
                <ul class="features" >
                  <li>
                    <span class="icon">
                      <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 0h24v24H0z" fill="none"></path>
                        <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
                      </svg>
                    </span>
                    <span><strong>{{ item.codigo }} ({{ item.libro }}) </strong><br>doc bodega: <strong>{{ item.factura}}</strong> <br>prefactura: <strong>{{ item.codigo_proforma}}</strong> <br>combo: {{ item.combo}}
                      <br>codigo unión : {{ item.codigo_union}}
                     </span>

                  </li>
                </ul>
              </div>
            </div>
          </vs-td>
          <vs-td width="10%">
            <div v-if="tr.estado == 1">
              <vs-chip v-if="tr.estado == 1" color="success">Disponible</vs-chip><br><br>
              <vs-button v-if="userRoot" class="modal-default-button my-5" size="small" color="danger" @click="tipo=0;tipoTitle='Eliminar';ObjectSelect=tr;popupConfirm=true;" type="filled" icon-pack="feather" icon="icon-x-square"> Eliminar paquete</vs-button>
              <vs-button class="modal-default-button my-5" size="small" color="#E37D09" @click="tipo=2;tipoTitle='Bloquear';ObjectSelect=tr;popupConfirm=true;" type="filled" icon-pack="feather" icon="icon-x-square"> Bloquear paquete</vs-button>
            </div>
            <div v-if="tr.estado == 2">
              <vs-chip v-if="tr.estado == 2" color="danger">Bloqueado</vs-chip><br><br>
              <vs-button v-if="userRoot" class="modal-default-button my-5" size="small" color="danger" @click="tipo=0;tipoTitle='Eliminar';ObjectSelect=tr;popupConfirm=true;" type="filled" icon-pack="feather" icon="icon-x-square"> Eliminar paquete</vs-button>
            </div>
            <div v-if="tr.estado == 0">
              <vs-chip color="warning">Utilizado</vs-chip><br><br>
              <vs-button class="modal-default-button" size="small" color="warning" @click="tipo=1;tipoTitle='Limpiar';ObjectSelect=tr;popupConfirm=true;" type="filled" icon-pack="feather" icon="icon-x-square"> Limpiar paquete </vs-button>
            </div>
          </vs-td>
        </vs-tr>
      </template>
  </vs-table>
    <!--modales-->
    <!--modal confirm-->
    <vs-popup :title="tipoTitle" :active.sync="popupConfirm">
      <div v-if="popupConfirm">
        <p class="text-center">¿Estás seguro que desea <b>{{ tipoTitle }}</b> el paquete <b>{{ ObjectSelect.paquete }}</b>?</p>
        <div class="mt-5">
          <vs-input class="inputx mb-3 w-full" label="Comentario" v-model="comentario" />
        </div>
        <div class="flex justify-center">
          <vs-button class="m-2" v-if="tipo == 0" icon="check" color="success" type="filled" @click="eliminarPaquete();popupConfirm=false;">Aceptar</vs-button>
          <vs-button class="m-2" v-if="tipo == 1" icon="check" color="success" type="filled" @click="limpiarPaquete();popupConfirm=false;">Aceptar</vs-button>
          <vs-button class="m-2" v-if="tipo == 2" icon="check" color="success" type="filled" @click="bloquearPaquete();popupConfirm=false;">Aceptar</vs-button>
          <vs-button class="m-2" color="warning" type="border" @click="popupConfirm=false;">Cancelar</vs-button>
        </div>
      </div>
    </vs-popup>
  </div>
</template>
<script>
import { mapState } from "vuex";
import XLSX from 'xlsx';
export default{
  data(){
    return{

      arregloPaquetes:[],
      busqueda:'',
      ObjectSelect:'',
      comentario:'',
      //tipo => 0 eliminar; 1 limpiar
      tipo:0,
      tipoTitle:'',
      popupConfirm:false,
      usuario:JSON.parse(localStorage.getItem('usuario')),
    }
  },
  computed:{
    ...mapState(["auth",'userRoot']),
  },
  methods:{
    getPaquetes(){
      let me = this
      me.arregloPaquetes = []
      if(me.busqueda == ""){
        me.$vs.notify({
        text:'El campo esta vacio debe ingresar algo para la búsqueda',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      if(me.busqueda.length < 6){
        me.$vs.notify({
        text:'Mínimo de campos 6 carácteres',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      me.$vs.loading()
      this.$http.get(this.$server_url+'paquetes/paquetes/'+me.busqueda)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.length == 0){
            me.$vs.notify({
            text:'No se encontro paquetes con esa descripción',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
          }
          me.arregloPaquetes = res.data
          if(me.arregloPaquetes.length == 0){
            me.$vs.notify({
            text:'No se encontro paquetes con esa descripción',
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check'})
          }
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error + ' error');
        })
    },
    limpiarPaquete(){
      let me = this
      if(me.comentario == ""){
        me.$vs.notify({
        text:'Debe ingresar un comentario',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      let formData = new FormData()
      formData.append('paquete',      me.ObjectSelect.paquete)
      formData.append('cleanPaquete', "yes")
      formData.append('comentario',   'Paquete '+ me.ObjectSelect.paquete +' limpiado_'+me.comentario)
      formData.append('user_created', me.usuario.idusuario)
      formData.append('data_codigos', JSON.stringify(me.ObjectSelect.codigos))
      formData.append('periodo_id',   localStorage.periodo_id)
      me.$vs.loading()
      this.$http.post(this.$server_url+'paquetes/PaqueteModificar',formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-x'})
            return
          }
          me.getPaquetes()
          me.comentario = ""
          me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        })
        .catch(function (error) {
          me.$vs.loading.close()
          me.$vs.notify({
          text:'Error al limpiar el paquete',
          color:'danger',
          iconPack: 'feather',
          icon:'icon-x'})
          console.log(error + ' error');
        })
    },
    eliminarPaquete(){
      let me = this
      if(me.comentario == ""){
        me.$vs.notify({
        text:'Debe ingresar un comentario',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      let formData = new FormData()
      formData.append('paquete',        me.ObjectSelect.paquete)
      formData.append('comentario',     'Paquete '+ me.ObjectSelect.paquete+"_eliminado_"+me.comentario)
      formData.append('user_created',   me.usuario.idusuario)
      formData.append('eliminarPaquete', "yes")
      me.$vs.loading()
      this.$http.post(this.$server_url+'paquetes/PaqueteModificar',formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-x'})
            return
          }
          me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.getPaquetes()
          me.comentario = ""
        })
        .catch(function (error) {
          me.$vs.loading.close()
          me.$vs.notify({
          text:'Error al eliminar el paquete',
          color:'danger',
          iconPack: 'feather',
          icon:'icon-x'})
          console.log(error + ' error');
        })
    },
    bloquearPaquete(){
      let me = this
      if(me.comentario == ""){
        me.$vs.notify({
        text:'Debe ingresar un comentario',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      let formData = new FormData()
      formData.append('paquete',        me.ObjectSelect.paquete)
      formData.append('comentario',     'Paquete '+ me.ObjectSelect.paquete+"_bloqueado_"+me.comentario)
      formData.append('user_created',   me.usuario.idusuario)
      formData.append('bloquearPaquete', "yes")
      me.$vs.loading()
      this.$http.post(this.$server_url+'paquetes/PaqueteModificar',formData)
        .then(function (res) {
          me.$vs.loading.close()
          if(res.data.status == 0){
            me.$vs.notify({
            text:res.data.message,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-x'})
            return
          }
          me.$vs.notify({
          text:res.data.message,
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          me.getPaquetes()
          me.comentario = ""
        })
        .catch(function (error) {
          me.$vs.loading.close()
          me.$vs.notify({
          text:'Error al bloquear el paquete',
          color:'danger',
          iconPack: 'feather',
          icon:'icon-x'})
          console.log(error + ' error');
        })
    },
    exportarExcel(){
      let me = this
      if(me.arregloPaquetes.length == 0){
        me.$vs.notify({
          text:'No hay datos para exportar',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-alert-circle'
        })
        return
      }

      // Preparar datos para exportar
      let datosExportar = []
      me.arregloPaquetes.forEach(paquete => {
        // Agregar filas de códigos
        paquete.codigos.forEach((codigo, index) => {
          datosExportar.push({
            'codigo': codigo.codigo,
            'Libro': codigo.libro,
            'Doc Bodega': codigo.factura,
            'Prefactura': codigo.codigo_proforma,
            'Combo': codigo.combo,
            'Código Unión': codigo.codigo_union,
            'Paquete': index === 0 ? paquete.paquete : '',
            'Estado': index === 0 ? (paquete.estado == 1 ? 'Disponible' : paquete.estado == 2 ? 'Bloqueado' : 'Utilizado') : '',
            'Cantidad Códigos': index === 0 ? paquete.codigos.length : '',
          })
        })
      })

      // Crear libro de Excel
      const ws = XLSX.utils.json_to_sheet(datosExportar)
      const wb = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(wb, ws, 'Paquetes')

      // Generar nombre del archivo con fecha
      const fecha = new Date()
      const nombreArchivo = `Paquetes_${me.busqueda}_${fecha.getDate()}-${fecha.getMonth()+1}-${fecha.getFullYear()}.xlsx`

      // Descargar archivo
      XLSX.writeFile(wb, nombreArchivo)

      me.$vs.notify({
        text:'Excel exportado correctamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'
      })
    }
  }
}
</script>
<style scoped>

/**
 * 1. Correct the odd appearance in Chrome and Safari.
 * 2. Correct the outline style in Safari.
 */
[type="search"] {
  -webkit-appearance: textfield;
  /* 1 */
  outline-offset: -2px;
  /* 2 */
}

/**
 * Remove the inner padding and cancel buttons in Chrome and Safari on macOS.
 */
[type="search"]::-webkit-search-cancel-button,
[type="search"]::-webkit-search-decoration {
  -webkit-appearance: none;
}

 .s009 {
  /*min-height: 100vh;*/
 display: -ms-flexbox;
 display: flex;
 -ms-flex-pack: center;
  justify-content: center;
  -ms-flex-align: center;
  align-items: center;
 /* background: #d9eff5;*/
  padding: 15px;
  font-family: 'Lato', sans-serif;
}

.s009 .form {
  width: 100%;
  max-width: 790px;
  margin: 0;
}

.s009 .form .inner-form {
  width: 100%;
}

.s009 .form .inner-form .input-field {
  position: relative;
  transition: 0.5s ease-in-out;
}
.input-field:hover{
  transform: translateY(-6px);
}
.s009 .form .inner-form .input-field input {
  height: 100%;
  border: 0;
  background: #fff;
  display: block;
  width: 100%;
  padding: 10px 32px 10px 70px;
  font-size: 18px;
  color: #666;
  border-radius: 3px;
  height: 70px;
  color: #555;
  font-family: 'Lato', sans-serif;
}

.s009 .form .inner-form .input-field input.placeholder {
  color: #999;
  font-size: 18px;
  font-weight: 600;
}

.s009 .form .inner-form .input-field input:-moz-placeholder {
  color: #999;
  font-size: 18px;
  font-weight: 600;
}

.s009 .form .inner-form .input-field input::-webkit-input-placeholder {
  color: #999;
  font-size: 18px;
  font-weight: 600;
}

.s009 .form .inner-form .input-field input:hover, .s009 form .inner-form .input-field input:focus {
  box-shadow: none;
  outline: 0;
}

.s009 .form .inner-form .input-field .btn-search {
  min-width: 100px;
  height: 40px;
  padding: 0 15px;
  background: #00bbec;
  white-space: nowrap;
  border-radius: 0;
  font-size: 14px;
  color: #fff;
  transition: all .2s ease-out, color .2s ease-out;
  border: 0;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0px 2px 5px 0px rgba(0, 0, 0, 0.15);
}

.s009 .form .inner-form .input-field .btn-search:hover, .s009 form .inner-form .input-field .btn-search:focus {
  background: #00a7d3;
}

.s009 .form .inner-form .input-field .btn-delete {
  min-width: 100px;
  height: 40px;
  padding: 0 15px;
  background: transparent;
  white-space: nowrap;
  border-radius: 0;
  font-size: 14px;
  color: #666;
  transition: all .2s ease-out, color .2s ease-out;
  border: 0;
  cursor: pointer;
  font-weight: bold;
}

.s009 .form .inner-form .input-field .btn-delete:hover, .s009 form .inner-form .input-field .btn-delete:focus {
  color: #000;
  outline: 0;
  box-shadow: none;
}

.s009 .form .inner-form .basic-search {
  box-shadow: 0px 8px 20px 0px rgba(0, 0, 0, 0.15);
  border-bottom: 2px solid #00bbec;
}

.s009 .form .inner-form .basic-search .input-field {
  width: 100%;
}

.s009 .form .inner-form .basic-search .input-field input {
  padding: 10px 80px 10px 40px;
}

.s009 .form .inner-form .basic-search .input-field .icon-wrap {
  position: absolute;
  top: 0;
  right: 0;
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
      align-items: center;
  width: 60px;
  height: 100%;
  transition: 1s ease;
}

.s009 .form .inner-form .basic-search .input-field .icon-wrap svg {
  width: 34px;
  height: 34px;
  fill: #ccc;
}
.icon-wrap:hover {
  transform: translateY(-2px);
}
/*ESTILOS CODIGOS*/

.features {
  display: flex;
  flex-direction: column;
}
.features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.features li + * {
  margin-top: 0.75rem;
}
.features .icon {
  background-color: #1FCAC5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  border-radius: 50%;
  width: 20px;
  height: 20px;
}
.features .icon svg {
  width: 14px;
  height: 14px;
}
.features + * {
  margin-top: 1.25rem;
}
</style>
