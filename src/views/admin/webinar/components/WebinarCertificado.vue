<template>
<div class="w-full">
<div id="printSection" class="contenedor">
    <img src="../../../../assets/images/seminarios/diploma.jpg" style="width: 100%; -webkit-print-color-adjust: exact;">
    
    <div style="font-family: font_diploma; font-size: 45px; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);">
        {{usuario[0].nombres +' '+usuario[0].apellidos}}
    </div>

    <div align="center">
      <div style="font-family: font_diploma; line-height: 80%; font-size: 45px; width: 90%; position: absolute; top: 66%; left: 50%; transform: translate(-50%, -50%);">
          {{data_seminario.nombre}}
      </div>
    </div>

    <div style="width: 100%; padding-right: 130px; text-align: right; font-family: font_diploma; font-size: 35px; position: absolute; top: 79%; left: 50%; transform: translate(-50%, -50%);">
        <!-- {{data_seminario.fecha_fin.substring(0,10)}} -->
        {{fechaLarga(data_seminario.fecha_fin).split(' ')[1]}} {{fechaLarga(data_seminario.fecha_fin).split(' ')[2]}} {{fechaLarga(data_seminario.fecha_fin).split(' ')[3]}} {{fechaLarga(data_seminario.fecha_fin).split(' ')[4]}} {{fechaLarga(data_seminario.fecha_fin).split(' ')[5]}}
    </div>

</div>


<vs-popup title="Sigue estos pasos para descargar tu certificado"  :active.sync="popupSeminario">
    <img src="../../../../assets/images/seminarios/tutorialDescarga.png" style="width: 100%;"><br><br>
    <vs-button color="primary" class="w-full mb-1" type="gradient" @click="descargarCertificado()">Descargar</vs-button>
</vs-popup>

</div>
</template>

<script>
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
Vue.use(axios)
export default {
    components: {
        'v-select': vSelect,
    },
    data() {
        return {
            popupSeminario: true,
            data_seminario: [],
            usuario: [],
        }
    },
    mounted() {
        this.usuario = JSON.parse(localStorage.getItem('userWebinar'));
        this.data_seminario = JSON.parse(localStorage.getItem('data_seminario'))
        this.valPopupDesc()
    },
    methods: {
        valPopupDesc(){
            setTimeout(function(){
                if( this.popupSeminario == false ){
                    this.popupSeminario = true
                }
            }, 3000);
        },
        descargarCertificado(){
            this.popupSeminario = false
            setTimeout(function(){ 
                window.print();
            }, 1000);
        }
    },
}
</script>


  <style>
    @font-face {
      font-family: "font_diploma";
      src: url("../../../../assets/images/seminarios/SavoyePlain.otf");
    }

    .contenedor{
        position: relative;
        display: inline-block;
        text-align: center;
    }
  </style>
