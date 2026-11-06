<template>
    <vx-card
    title="Exportar preguntas del banco de preguntas"
    title-color="primary"
    subtitle="Seleccione un libro y una unidad para filtrar"
    style="min-height: 100vh;"
    >
    <small v-if="usuario.id_group == 1" align="left">Ruta: /a_exportarPreguntas</small>
        <div class="vx-row w-full mb-5 mt-2">
            <div class="vx-col sm:w-1/2 w-full">
                Asignatura
                <v-select class="mb-2" v-model="asignaturaSelected" :options="asignaturas" @input="allTemas();filtrarPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                Unidad
                <v-select class="mb-2" v-model="unidadSelected" :options="unidades" @input="filtrarPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>
            <div class="vx-col sm:w-1/2 w-full">
                Banco
                <v-select v-model="bancoSelected" class="w-full" :options="bancos" @input="getPreguntas()" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
            </div>
            <div class="vx-col sm:w-1/2 w-full" v-if="bancoSelected && unidadSelected && asignaturaSelected">
              <vs-button @click="getPreguntas();" icon="search" class="mt-5">Buscar</vs-button>
            </div>
        </div>
        <div v-if="preguntas.length > 0" class="mt-3">
          <vs-divider>
            <ul class="centerx">
            <li>
              <vs-checkbox @input="getPreguntas()" v-model="popupExportAllPreguntas">Mostrar todo</vs-checkbox>
            </li>
            </ul>
          </vs-divider>
          <div class="flex">
            <vs-button @click="ExportToDoc()"  color="#3dd495"  gradient-color-secondary="rgb(130, 207, 23)" type="gradient"><i class="fa-solid fa-download"></i><span class="ml-2">Exportar</span></vs-button>
            <!-- <vs-button @click="exportAll()"  color="#7DB6B6"  gradient-color-secondary="rgb(130, 207, 23)" type="gradient" class="ml-2"><i class="fa-solid fa-cloud-arrow-down"></i><span class="ml-2">Exportar Todo</span></vs-button> -->
            <vs-chip class="ml-2 mt-2" color="primary">Total temas: {{ preguntas.length }}</vs-chip>
          </div>
        </div>
        <div id="MainHTML" class="mt-3" v-if="preguntas.length > 0">
            <div v-for="(tr,index) in preguntas" :key="index">
              <h2 class="p-2">UNIDAD {{tr.unidad}} | TEMA: {{ tr.nombre_tema.toUpperCase() }} </h2>
              <vs-table stripe :data="tr.items" no-data-text="No hay preguntas de este tema">
                  <template slot="thead">
                      <vs-th sort-key="pregunta">Pregunta</vs-th>
                      <vs-th sort-key="id_tipo_pregunta">Tipo</vs-th>
                  </template>
                  <template slot-scope="{data}">
                  <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                      <vs-td :data="data[indextr].descripcion">
                          <b>{{indextr+1}}. <span v-html="renderLatex(data[indextr].descripcion)"></span></b><br>
                          <img v-if="data[indextr].img_pregunta!='' && data[indextr].img_pregunta!='null' && data[indextr].img_pregunta!=null" v-bind:src="$data_url+'archivos/img/img_preguntas/'+data[indextr].img_pregunta" class="img-responsive" width="50" height="50" style="border-radius: 5px;">
                          <div slot="header">
                              Opciones
                          </div>
                          <div class="mb-5" :key="indexitem" v-for="(item, indexitem) in data[indextr].opciones">
                          <div style="width: 100%; font-size: 12px; color: #0DCD88;" v-if="item.tipo===1">Respuesta correcta<br></div>
                          <div style="width: 100%; font-size: 12px; color: #FD5858;" v-else>Respuesta incorrecta<br></div>
                          <div style="width: 100%" v-html="renderLatex(item.opcion)"></div>
                          <div style="width: 100%" ><img v-if="item.img_opcion!='' && item.img_opcion!='null' && item.img_opcion!=null" v-bind:src="$data_url+'archivos/img/img_preguntas/'+item.img_opcion" class="img-responsive" style="border-radius: 5px;" width="50" height="50"></div>
                          </div>
                      </vs-td>
                      <vs-td :data="data[indextr].nombre_tipo">
                          {{data[indextr].nombre_tipo}}
                      </vs-td>
                  </vs-tr>
                  </template>
              </vs-table>
            </div>
        </div>
    </vx-card>
</template>
<script>

import vSelect from 'vue-select'
import { renderLatex } from '@/utils/renderLatex'
import 'mathlive/mathlive-static.css'
import 'mathlive/mathlive-fonts.css'
import 'katex/dist/katex.min.css'
import html2canvas from 'html2canvas'

export default{
    data(){
        return{
          usuario:[],
          asignaturas:[],
          unidades:[],
          temas:[],
          datoEnviar:[],
          asignaturaSelected:'',
          unidadSelected:'',
          tema_ambito:'',
          preguntas: [],
          unidades: [
              { id: "1", label: "Unidad 1", }, { id: "2", label: "Unidad 2", }, { id: "3", label: "Unidad 3", }, { id: "4", label: "Unidad 4", }, { id: "5", label: "Unidad 5", }, { id: "6", label: "Unidad 6", }, { id: "7", label: "Unidad 7", }, { id: "8", label: "Unidad 8", }
          ],
          bancoSelected: {id:'3',label:'Ambas'},
          bancos: [
              {id:'1',label:'Preguntas de Prolipa'},
              // {id:'2',label:'Solo mis preguntas'},
              {id:'3',label:'Todo'},
          ],
          arrayAllTemas:[],
          popupExportAllPreguntas:false,
          arrayAllPreguntas:[],
        }
    },
    components:{
        vSelect,
    },
    mounted(){
      let me = this;
      me.getAsignaturas()
      me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    methods:{
      renderLatex,
      closeDocument(){
        this.popupExportAllPreguntas = false
      },
      allTemas(){
        let me = this;
        me.arrayAllTema = []
        if(me.asignaturaSelected == "" || me.asignaturaSelected == undefined || me.asignaturaSelected == null){
          return
        }
        this.$http.get(this.$server_url+'allTemasxAsignatura?asignatura='+me.asignaturaSelected.id)
        .then(res => {
            me.arrayAllTemas = res.data;
        })
      },
      async ExportToDoc(){
          let me = this;
          if(me.asignaturaSelected == "" || me.asignaturaSelected == undefined || me.asignaturaSelected == null){
              me.$vs.notify({
              text:'Seleccione una asignatura y una unidad',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check'})
              return
          }
          if(me.unidadSelected == "" || me.unidadSelected == undefined || me.unidadSelected == null){
              me.$vs.notify({
              text:'Seleccione una asignatura y una unidad',
              color:'warning',
              iconPack: 'feather',
              icon:'icon-check'})
              return
          }
          
          me.$vs.loading({
            text: 'Generando documento con fórmulas...'
          });
          
          let filename = ""
          if(me.popupExportAllPreguntas){
            filename = me.asignaturaSelected.label + " - " + "Todas las preguntas"
          }else{
            filename = me.asignaturaSelected.label + " - " +me.unidadSelected.label
          }
          
          // Clonar el contenido para procesarlo sin afectar el DOM original
          var mainElement = document.getElementById("MainHTML");
          var clonedElement = mainElement.cloneNode(true);
          
          const formulaSelector = '.katex, .ML__latex';
          const originalFormulaElements = mainElement.querySelectorAll(formulaSelector);
          const clonedFormulaElements = clonedElement.querySelectorAll(formulaSelector);
          
          // Procesar cada fórmula convirtiéndola a imagen
          for (let i = 0; i < originalFormulaElements.length; i++) {
            try {
              const originalFormulaEl = originalFormulaElements[i];
              const clonedFormulaEl = clonedFormulaElements[i];
              
              if (originalFormulaEl && clonedFormulaEl) {
                // Guardar estilos originales
                const originalPadding = originalFormulaEl.style.padding;
                const originalBackground = originalFormulaEl.style.backgroundColor;
                const originalFontSize = originalFormulaEl.style.fontSize;
                
                // Aplicar estilos temporales para captura
                originalFormulaEl.style.padding = '2px 4px'; // Padding más pequeño
                originalFormulaEl.style.backgroundColor = 'white';
                originalFormulaEl.style.fontSize = '12px'; // Reducir tamaño de fuente
                
                // Capturar el elemento original como imagen con escala reducida
                const canvas = await html2canvas(originalFormulaEl, {
                  backgroundColor: '#FFFFFF',
                  scale: 1.5, // Reducir escala para imágenes más pequeñas
                  logging: false,
                  useCORS: true,
                  windowWidth: originalFormulaEl.scrollWidth + 10,
                  windowHeight: originalFormulaEl.scrollHeight + 10
                });
                
                // Restaurar estilos originales
                originalFormulaEl.style.padding = originalPadding;
                originalFormulaEl.style.backgroundColor = originalBackground;
                originalFormulaEl.style.fontSize = originalFontSize;
                
                // Convertir canvas a imagen base64
                const imgData = canvas.toDataURL('image/png');
                
                // Crear elemento img con width en lugar de height
                const img = document.createElement('img');
                img.src = imgData;
                img.style.verticalAlign = 'middle';
                img.style.display = 'inline-block';
                img.style.margin = '0 2px';
                // Usar width en lugar de height para que Word lo respete mejor
                img.width = Math.floor(canvas.width * 0.65); // 65% del tamaño original
                
                // Reemplazar el elemento de fórmula clonado con la imagen
                clonedFormulaEl.parentNode.replaceChild(img, clonedFormulaEl);
              }
            } catch (e) {
              console.error('Error capturando fórmula ' + i + ':', e);
            }
          }
          
          var HtmlHead = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title><style>body{font-family: 'Times New Roman', Times, serif; font-size: 12pt;} img{vertical-align: middle; display: inline-block;}</style></head><body>";
          var EndHtml = "</body></html>";
          
          //complete html usando el elemento clonado y procesado
          var html = HtmlHead + clonedElement.innerHTML + EndHtml;
          
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
          
          me.$vs.loading.close();
          
          me.$vs.notify({
            text: 'Documento exportado exitosamente',
            color: 'success',
            iconPack: 'feather',
            icon: 'icon-check'
          });
      },
        getAsignaturas(){
            let me = this;
            this.$http.get(this.$server_url+'asignaturasDoc/0').then(res => {
                me.asignaturas = res.data;
                me.$vs.loading.close()
            })
        },
        filtrarPreguntas(){
            let me = this;
            me.preguntas.id = ''
            me.datoEnviar   = []
            me.preguntas    = []
            if( me.asignaturaSelected.id === undefined ){
                me.$vs.notify({
                    text:'Seleccione una asignatura antes de filtrar por Unidades',
                    color:'warning',
                    iconPack: 'feather',
                    icon:'icon-check'})
                return;
            }
            if( me.asignaturaSelected.id===113 || me.asignaturaSelected.id===114 || me.asignaturaSelected.id===115 ){
                me.tema_ambito = 'Ámbito'
            }else{
                me.tema_ambito = 'Tema'
            }
            if( me.unidadSelected.id === undefined ){
                return;
            }
            me.temas      = []
            me.datoEnviar = []
            me.preguntas  = []
            //me.pregunta.tema.id = ''
            this.$http.get(this.$server_url+'temasignunidadExport?asignatura='+me.asignaturaSelected.id+'&unidad='+me.unidadSelected.id)
            .then(res => {
                me.temas = res.data;
                me.getPreguntas()
            })
            .catch(function (error) {
                console.log(error);
            })
        },
        getPreguntas(){
            let me = this;
            me.preguntas = []
            me.datoEnviar = []
            if(me.bancoSelected == "" || me.bancoSelected == undefined || me.bancoSelected == null){
                me.$vs.notify({
                    text: "Seleccione los tipos de preguntas a mostrar",
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return
            }
            let sendTemas = []
            if(me.popupExportAllPreguntas){
              sendTemas = me.arrayAllTemas
            }else{
              sendTemas = me.temas
            }
            //enviar solo los ids
            sendTemas.forEach(element => {
                var cal         = new Object();
                cal.id          = element.id
                cal.nombre_tema = element.nombre_tema
                cal.unidad      = element.unidad
                me.datoEnviar.push(cal)
            });
            let formData = new FormData();
            me.$vs.loading()
            formData.append('temas',JSON.stringify(me.datoEnviar));
            this.$http.post(this.$server_url+'preguntasxUnidadytema',formData)
            .then(res => {
                me.$vs.loading.close()
                if(res.data.length == 0){
                    me.$vs.notify({
                        text: "No hay datos que mostrar",
                        color: 'warning',
                        iconPack: 'feather',
                        icon: 'icon-alert-triangle'
                    })
                    return
                }
                if(me.popupExportAllPreguntas){
                  me.preguntas = res.data
                  return
                }
                //FILTRAR(PROLIPA - TODO)
                let filtro = me.bancoSelected.id
                let datos = res.data
                //PROLIPA
                if(filtro == 1){
                    me.preguntas = datos.filter(p => p.idusuario != me.usuario)
                }else{
                    me.preguntas = datos;
                }
            })
            .catch((error) =>{
                me.$vs.loading.close()
                me.$vs.notify({
                    text: "Error al cargar las preguntas",
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            })
        },
    }
}
</script>
