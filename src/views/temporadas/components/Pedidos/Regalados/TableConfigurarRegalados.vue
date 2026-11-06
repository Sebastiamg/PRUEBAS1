<template>
  <div>
    <div>
      <p class="mt-5">>>Configurar regalados individuales <b>(No combos)</b></p>
      <div class="flex" style="flex-wrap: wrap;">
        <button class="button-33 m-3"  @click="saveRegaladosXVerificacion()" role="button"><ion-icon class="mt-1" name="checkmark-outline"></ion-icon>Asignar {{ sendCodigos.length  }} códigos como regalados a la Verificación # {{ VerificacionSelect.num_verificacion }}</button>
        <button class="button-34 m-3" @click="quitarRegaladosXVerificacion()" role="button"><ion-icon class="mt-1" name="checkmark-outline"></ion-icon>Quitar {{ sendCodigos.length  }} códigos como regalados a la Verificación # {{ VerificacionSelect.num_verificacion }}</button>
      </div>

      <vs-table multiple v-model="sendCodigos" max-items="10" search pagination :data="arregloAllRegalados">
        <template slot="header">
            <vs-chip  color="primary">Cantidad: <b> {{ arregloAllRegalados.length }}</b></vs-chip>
        </template>
        <template slot="thead">
            <vs-th>Libro</vs-th>
            <vs-th>Num verificación</vs-th>
            <vs-th>Fecha Asignación</vs-th>
            <vs-th>Acciones</vs-th>
        </template>
        <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                <vs-td>
                  <b>Libro</b>
                  <p>{{data[indextr].nombrelibro}}<br></p>
                  <b>Código Liquidación</b>
                  <p>{{data[indextr].codigo_liquidacion}}<br></p>
                  <b>Código libro</b>
                  <p>{{data[indextr].codigo}}<br></p>
                  <b>Documento venta:</b>
                  <p>{{ data[indextr].codigo_proforma || 'Sin documento' }}</p>
                  <b>Empresa Documento:</b>
                  <p>{{ tr.descripcion_empresa || 'Sin empresa' }}</p>
                  <div v-if="tr.combo">
                    <b>Combo:</b>
                    <p>{{ tr.combo }}</p>
                  </div>
                  <div v-if="tr.codigo_combo">
                    <b>Combo:</b>
                    <p>{{ tr.codigo_combo }}</p>
                  </div>
                  <div v-if="tr.codigo_paquete">
                    <b>Paquete:</b>
                    <p>{{ tr.codigo_paquete }}</p>
                  </div>
                </vs-td>
                <vs-td>
                  <div v-if="tr.verificacionAsignada == null"><p class="text-danger">No asignado</p></div>
                  <div v-else>{{ tr.verificacionAsignada }}</div>
                </vs-td>
                <vs-td>
                    {{data[indextr].bc_fecha_ingreso}}<br>
                </vs-td>
                <vs-td>
                  <div v-if="tr.verificacionAsignada == null"></div>
                  <div v-else><vs-button @click="quitarDuplicado(tr)" color="danger" type="filled">Quitar de verificación</vs-button>
                  </div>
                </vs-td>
            </vs-tr>
        </template>
      </vs-table>
    </div>
  </div>
</template>
<script>
export default{
  data() {
    return {
      arregloAllRegalados:[],
      sendCodigos:[],
    };
  },
  props:{
    datosInstitucion:{
      type:Object,
      default:function(){
        return {}
      }
    },
    VerificacionSelect:{
      type:Object,
      default:function(){
        return {}
      }
    },
    contrato:{
      type:String,
      default:''
    }
  },
  mounted(){
    let me = this
    me.getAllRegalados()
  },
  methods:{
    getAllRegalados(){
      let me = this
      me.sendCodigos=[]
      me.arregloAllRegalados = []
      me.$vs.loading()
      this.$http.get(this.$server_url+'getAllRegalados/'+me.datosInstitucion.idInstitucion+'/'+me.datosInstitucion.id_periodo)
        .then(function (res) {
          me.$vs.loading.close()
          let datos = res.data.filter(p => p.quitar_de_reporte != '1' && p.combo == null)
          if(datos.length > 0){
            me.arregloAllRegalados = datos
            me.arregloAllRegalados.sort((a,b) => a.nombrelibro - b.nombrelibro)
          }
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error + ' error');
        })
    },
    quitarDuplicado(tr){
      let me = this;
      let formData = new FormData();
      let data_codigos = []
      data_codigos.push({codigo:tr.codigo})
      formData.append('data_codigos',  JSON.stringify(data_codigos));
      me.$vs.loading()
      this.$http.post(this.$server_url+'CleanRegalado', formData)
        .then(function (res) {
          me.getAllRegalados();
          me.$vs.loading.close()
          me.$vs.notify({
          text:'Se guardo correctamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
          let datos = {
            tipo:5,
          }
          me.$emit('recharge',datos)
        })
        .catch(function (error) {
          me.$vs.loading.close()
          console.log(error + ' error');
          me.$vs.notify({
            text:'Error al quitar los códigos',
            color:'danger',
            iconPack: 'feather',
            icon:'icon-alert-triangle'})
        })
    },
    saveRegaladosXVerificacion() {
      let me = this;
      if (me.sendCodigos.length == 0) {
        me.$vs.notify({
          text: 'Seleccione algún libro para guardar',
          color: 'warning',
          iconPack: 'feather',
          icon: 'icon-check'
        });
        return;
      }

      let formData = new FormData();
      formData.append('verificacion_id', me.VerificacionSelect.id);
      formData.append('num_verificacion', me.VerificacionSelect.num_verificacion);
      formData.append('data_codigos', JSON.stringify(me.sendCodigos));
      formData.append('contrato', me.contrato);

      me.$vs.loading();

      this.$http.post(this.$server_url + 'saveRegaladosXVerificacion', formData)
        .then(res => {
          me.getAllRegalados();
          me.$vs.loading.close();
          me.$vs.notify({
            text: 'Se guardó correctamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });

          let datos = {
            tipo: 5,
          };
          me.$emit('recharge', datos);
          me.sendCodigos = [];
        })
        .catch(err => {
          me.$vs.loading.close();
          me.$vs.notify({
            text: 'Error al asignar los códigos',
            color: 'danger',
            iconPack: 'feather',
            icon: 'icon-alert-triangle'
          });
        });
    },
    quitarRegaladosXVerificacion(){
      let me = this;
      if(me.sendCodigos.length == 0){
        me.$vs.notify({
        text:'Seleccione algun libro para quitar',
        color:'warning',
        iconPack: 'feather',
        icon:'icon-check'})
        return
      }
      let formData = new FormData();
      formData.append('data_codigos',     JSON.stringify(me.sendCodigos));
      me.$vs.loading()
      this.$http.post(this.$server_url+'CleanRegalado', formData)
      .then(res => {
      me.getAllRegalados();
      me.$vs.loading.close()
      me.$vs.notify({
          text:'Se quito los códigos correctamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
      })
      let datos = {
        tipo:5,
      }
      me.$emit('recharge',datos)
      me.sendCodigos = []
      .catch((err) =>{
        me.$vs.loading.close()
        me.$vs.notify({
          text:'Error al quitar los códigos',
          color:'danger',
          iconPack: 'feather',
          icon:'icon-alert-triangle'})
      })
    },
  }
}
</script>
<style scoped>
/**BOTON SELECCIONADO */
/* CSS */
.button-33 {
  background-color: #c2fbd7;
  border-radius: 100px;
  box-shadow: rgba(44, 187, 99, .2) 0 -25px 18px -14px inset,rgba(44, 187, 99, .15) 0 1px 2px,rgba(44, 187, 99, .15) 0 2px 4px,rgba(44, 187, 99, .15) 0 4px 8px,rgba(44, 187, 99, .15) 0 8px 16px,rgba(44, 187, 99, .15) 0 16px 32px;
  color: green;
  cursor: pointer;
  display: inline-block;
  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 250ms;
  border: 0;
  font-size: 16px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-33:hover {
  box-shadow: rgba(44,187,99,.35) 0 -25px 18px -14px inset,rgba(44,187,99,.25) 0 1px 2px,rgba(44,187,99,.25) 0 2px 4px,rgba(44,187,99,.25) 0 4px 8px,rgba(44,187,99,.25) 0 8px 16px,rgba(44,187,99,.25) 0 16px 32px;
  transform: scale(1.05) rotate(-1deg);
}

.button-34 {
  background-color: #fbc2c2; /* rojo claro, similar al verde claro original */
  border-radius: 100px;
  box-shadow: rgba(187, 44, 44, 0.2) 0 -25px 18px -14px inset,
              rgba(187, 44, 44, 0.15) 0 1px 2px,
              rgba(187, 44, 44, 0.15) 0 2px 4px,
              rgba(187, 44, 44, 0.15) 0 4px 8px,
              rgba(187, 44, 44, 0.15) 0 8px 16px,
              rgba(187, 44, 44, 0.15) 0 16px 32px;
  color: darkred;
  cursor: pointer;
  display: inline-block;
  font-family: CerebriSans-Regular,-apple-system,system-ui,Roboto,sans-serif;
  padding: 7px 20px;
  text-align: center;
  text-decoration: none;
  transition: all 250ms;
  border: 0;
  font-size: 16px;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-34:hover {
  box-shadow: rgba(187, 44, 44, 0.35) 0 -25px 18px -14px inset,
              rgba(187, 44, 44, 0.25) 0 1px 2px,
              rgba(187, 44, 44, 0.25) 0 2px 4px,
              rgba(187, 44, 44, 0.25) 0 4px 8px,
              rgba(187, 44, 44, 0.25) 0 8px 16px,
              rgba(187, 44, 44, 0.25) 0 16px 32px;
  transform: scale(1.05) rotate(-1deg);
}

</style>
