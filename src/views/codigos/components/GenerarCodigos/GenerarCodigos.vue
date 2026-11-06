<template>
    <vx-card>
      <!--SELECT LIBRO-->
      <div class="vx-row">
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <span>Serie:</span>
          <v-select @input="getLibros()" :options="arregloSeries" :reduce="arregloSeries => arregloSeries" label="nombre_serie" class="w-full" v-model="serieSelect" />
        </div>
        <div class="vx-col sm:w-1/2 w-full mb-2">
          <span>Libro:</span>
          <v-select @input="arregloCodigos = [];estadoProceso=0;exportado=0;" :options="arregloLibros" :reduce="arregloLibros => arregloLibros" label="libroProCodigo" class="w-full" v-model="libroSelect" />
        </div>
      </div>
      <p class="text-danger text-2xl font-bold mt-2 text-center" v-if="msgError">{{ msgError }}</p>
      <br>
      <!--TOTAL GUARDADOS-->
      <div class="flex justify-center" v-if="estadoProceso == 2">
        <ul class="features flex justify-center" >
          <li>
            <span class="icon">
              <svg height="24" width="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 0h24v24H0z" fill="none"></path>
                <path fill="currentColor" d="M10 15.172l9.192-9.193 1.415 1.414L10 18l-6.364-6.364 1.414-1.414z"></path>
              </svg>
            </span>
            <span v-if="tipoCodigo == 0"><strong>Códigos Activación Ingresados: {{ porcentajeA }} </strong></span>
            <span v-if="tipoCodigo == 1"><strong>Códigos Diagnóstico Ingresados: {{ porcentajeA }} </strong></span>
          </li>
        </ul>
      </div>
      <br>
      <!--FIN SELECT LIBRO-->
      <vs-progress v-if="porcentaje === 100 && estadoProceso > 0" :height="8" :percent="porcentaje" color="success"></vs-progress>
      <vs-progress v-if="progressInterActivo != ''" indeterminate color="primary"></vs-progress>
      <p class="text-center text-success font-bold text-3xl mt-3" v-if="exportado == 1"><ion-icon name="star-outline"></ion-icon> Se exporto el archivo <b>{{ filename }}</b></p>
      <!--GENERAR CODIGOS-->
      <div class="flex mt-5" style="flex-wrap:wrap;">
        <span class="mt-3 ml-5 font-bold">Cantidad:</span>
        <div class="mt-1">
          <vx-tooltip color="warning" text="Ingrese la cantidad de códigos que desea generar (máximo 3000)">
            <vs-input type="number" class="inputx ml-2" min="1" max="3000" @keyup.enter="generarCodigos(cantidad);" style="width: 150px; text-align: center;margin-top:-3px;" v-model="cantidad" />
          </vx-tooltip>
        </div>
        <div class="ml-3 mt-1">
          <vs-button color="primary" class="generarBoton mr-2" size="small" style="font-size: 13px;" @click="tipoCodigo = 0;generarCodigos(cantidad);estadoContador();"  v-if="cantidad<=10000">Generar Códigos Activación</vs-button>
          <vs-button color="warning" class="generarBoton mr-2" size="small" style="font-size: 13px;" @click="tipoCodigo = 1;generarCodigos(cantidad);estadoContador();"  v-if="cantidad<=10000">Generar Códigos Diagnóstico</vs-button>
          <vs-button color="danger" size="small" style="font-size: 13px;" v-if="cantidad>10000">Cantidad excede los 10000</vs-button>
        </div>
        <div>
          <div v-if="estadoProceso == 1 && arregloCodigos[0]" style="display:flex;">
            <vs-button color="success" size="small" class="ml-5" style="font-size: 14px;margin-top: 5px;" @click="guardarCodigos(); estadoProceso = 0;">Guardar</vs-button>
            <vx-tooltip color="warning" text="Generar codigos de barras" style="margin-left:20px;border-radius:20px;">
            </vx-tooltip>
          </div>
          <vx-tooltip v-if="estadoProceso == 2" color="warning" text="Antes de exportar seleccione los codigos deseados.">
              <vs-button color="dark" size="small" class="ml-5" style="font-size: 14px;margin-top: 5px;" @click="generarNombreFile();exportToExcel();">Exportar</vs-button>
          </vx-tooltip>
        </div>
      </div>
      <div v-if="preCodigos.length > 0" class="vx-row mt-3">
        <div >
          <div v-for="(item,key) in preCodigos" :key="key">
            <p>{{ item }}</p>
          </div>
        </div>
        <div class="ml-5">
          <div v-for="(item,key2) in preActivacion" :key="key2">
            <p>{{ item }}</p>
          </div>
        </div>
        <div class="ml-4">
          <div v-for="(item,key3) in preCodigos" :key="key3">
            <p>OR codigo='{{ item }}'</p>
          </div>
        </div>
      </div>
      <!--TABLA-->
      <!-- <b style="color: #0AD68C;">{{ textAlertCant }}</b> -->
      <vs-table pagination max-items="25" search :data="arregloCodigos">
        <template slot="header">
          <ion-icon name="eye-off-outline" v-if="preCodigos.length > 0" @click="preCodigos = []"></ion-icon>
          <p @click="formatCode()">
            <vs-chip>Cantidad {{ arregloCodigos.length  }}</vs-chip>
          </p>
        </template>
        <template slot="thead">
          <vs-th sort-key="codigo">Código </vs-th>
          <vs-th sort-key="libro">Libro</vs-th>
          <vs-th sort-key="libro">Serie</vs-th>
          <vs-th sort-key="anio">Año</vs-th>
          <vs-th sort-key="anio">Tipo</vs-th>
          <vs-th sort-key="contador">Contador</vs-th>
          <vs-th sort-key="secuencia">secuencia</vs-th>
          <vs-th sort-key="imprimir">imprimir</vs-th>
        </template>
        <template slot-scope="{data}">
          <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
            <vs-td>
              {{ data[indextr].codigo }}
            </vs-td>
            <vs-td>
              {{ data[indextr].libro }}
            </vs-td>
            <vs-td>
              {{ data[indextr].serie }}
            </vs-td>
            <vs-td>
              {{ data[indextr].anio }}
            </vs-td>
            <vs-td>
              {{ tipoCodigo == 0 ? 'CODIGO DE ACTIVACION DEL LIBRO' : 'PRUEBA DIAGNOSTICA' }}
            </vs-td>
            <vs-td>
              {{ data[indextr].contadorCodigoA }}
            </vs-td>
            <vs-td :data="data[indextr]">
                {{ indextr+1 }}
            </vs-td>
            <vs-td>
                1
            </vs-td>
          </vs-tr>
        </template>
      </vs-table>
      <br><br><br><br><br>
      <!--MODAL-->
      <!--MODAL PROBLEMA CODIGOS-->
      <vs-popup classContent="popup-example" title="códigos que no se pudieron ingresar" :active.sync="popupProblemas">
        <vs-table multiple pagination max-items="10" search :data="codigosNoIngresados" v-if="popupProblemas">
          <template slot="header">
          </template>
          <template slot="thead">
            <vs-th sort-key="codigo">Código activación</vs-th>
            <vs-th sort-key="codigo">Motivo</vs-th>
          </template>
          <template slot-scope="{data}">
            <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
              <vs-td :data="data[indextr].codigo">
                  {{ data[indextr].codigo }}
              </vs-td>
              <vs-td :data="data[indextr].message">
                {{ data[indextr].message }}
              </vs-td>
            </vs-tr>
          </template>
        </vs-table>
      </vs-popup>
    </vx-card>
  </template>
  <script>
  import vSelect from 'vue-select'
  import moment from 'moment'
  export default{
    data(){
      return{
        usuario:[],
        arregloCodigos:[],
        codigosNoIngresados:[],
        cantidad:0,
        estadoProceso:0,
        porcentaje:0,
        progressInterActivo:0,
        textAlertCant:'',
        popupProblemas:false,
        //varaibles para exportar excel
        fileName: null,
        formats: ['xls', 'xlsx', 'csv', 'txt'],
        cellAutoWidth: true,
        selectedFormat: 'xlsx',
        exportado:0,
        arregloSeries:[],
        arregloLibros:[],
        serieSelect:'',
        libroSelect:'',
        conActivacion:true,
        codeA:'',
        contadorActivacion:1,
        contadorDiagnostica:1,
        codigo_liquidacion:'',
        msgError:'',
        fecha:'',
        preCodigos:[],
        preActivacion:[],
        palabraDiagnostico:'P',
        tipoCodigo:0,
      }
    },
    components:{
      vSelect,
    },
    created(){
      let me = this;
      me.usuario = JSON.parse(localStorage.getItem("usuario"))
    },
    mounted(){
      let me = this;
      me.getSeries()
      moment.locale("es")
    me.day        = moment().format('DD');
      me.mes        = moment().format('MMMM');
      me.year       = moment().format('YYYY')
      let preFecha  = me.day+'-'+me.mes+'-'+me.year
      me.fecha      = preFecha.toUpperCase()
    },
    methods:{
      getSeries(){
        let me = this;
        this.$http.get(this.$server_url + 'series').then(res => {
          //filtrar diferente que tenga la palabra PLUS
          //let datos = res.data.filter(p => p.nombre_serie.toUpperCase().indexOf('PLUS') == -1)
          let datos = res.data.filter(p => p.id_serie != 22)
          this.arregloSeries = datos;
        })
      },
      getLibros(){
        let me = this;
        me.arregloLibros  = []
        me.arregloCodigos = []
        me.libroSelect    = ''
        me.estadoProceso  = 0;
        me.exportado      = 0;
        if(me.serieSelect == null || me.serieSelect == "" || me.serieSelect == undefined){
          me.$vs.notify({
          text:'Seleccione una serie por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        this.$http.get(this.$server_url + 'libros_series/' + me.serieSelect.id_serie).then(res => {
          this.arregloLibros  = res.data;
        })
      },
      //obtener el estado del ultimo codigo el contador
      estadoContador(){
        let me = this;
        if(me.libroSelect == null || me.libroSelect == "" || me.libroSelect == undefined){
          me.contadorActivacion  = 1
          me.contadorDiagnostica = 1
          return
        }
        this.$http.get(this.$server_url+'contadorCodigo?libro='+me.libroSelect.idLibro)
        .then(function (res) {
          me.contadorActivacion  = res.data.contador
          me.contadorDiagnostica = res.data.contadorDiagnostica
        })
        .catch(function (error) {
          console.log(error + ' error');
        })
      },
      //generar codigos
      generarCodigos(fin) {
        let me = this;
        me.preCodigos     = []
        me.preActivacion  = []
        me.msgError = ""
        if(me.serieSelect == null || me.serieSelect == "" || me.serieSelect == undefined){
          me.$vs.notify({
          text:'Seleccione una serie por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        if(me.libroSelect == null || me.libroSelect == "" || me.libroSelect == undefined){
          me.$vs.notify({
          text:'Seleccione un libro por favor',
          color:'warning',
          iconPack: 'feather',
          icon:'icon-check'})
          return
        }
        this.codigo_liquidacion = me.libroSelect.codigo_liquidacion
        if(me.codigo_liquidacion == null || me.codigo_liquidacion == "null" || me.codigo_liquidacion == "SIN CODIGO"){
          me.msgError = "Este libro no tiene código de liquidación, comuníquese con soporte"
          return
        }
        //activacion
        this.codeA             = this.codigo_liquidacion + "-";
        this.textAlertCant     = '';
        this.exportado         = 0,
        this.arregloCodigos    = []
        this.estadoProceso     = 0
        this.porcentajeA       = 0
        if (fin > 3000) {
          me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'Máximo 3000 códigos se puede generar para el excel'
          })
          return false;
        }
        if(fin == 0 ){
          me.$vs.notify({
            color: 'warning',
            title: 'Mensaje',
            text: 'Debe escribir al menos 1 código para generar'
          })
          return false;
        }
        //activacion
        if(me.tipoCodigo == 0){
          this.code = this.codigo_liquidacion + "-";
        }
        //diagnostico
        if(me.tipoCodigo == 1){
          this.code = this.palabraDiagnostico+this.codigo_liquidacion + "-";
        }
        me.arregloCodigos              = [];
        let formData = new FormData();
        formData.append('longitud',  this.serieSelect.longitud_codigo);
        formData.append('code',     this.code);
        formData.append('cantidad',  fin);
        me.$vs.loading();
        this.$http.post(this.$server_url+'generarCodigos', formData)
        .then(function (res) {
          me.$vs.loading.close()
          let datos         = res.data.codigos
          datos.map(p => {
            me.arregloCodigos.push({
              codigo              : p.codigo,
              libro               : me.libroSelect.nombre_imprimir,
              serie               : me.serieSelect.nombre_serie,
              anio                : me.libroSelect.year,
              libro_idlibro       : me.libroSelect.idLibro,
              contadorCodigoA     : '',
            });
            me.generarNombreFile()
          })
          // codigos ahora contiene los códigos de activación
          me.estadoProceso = 1;
          me.$vs.notify({
            color: 'primary',
            title: 'Mensaje',
            text: 'Codigos Cargados'
          })
        })
        .catch(function (error) {
          console.log(error + ' error');
          me.$vs.loading.close()
        })
      },
      formatCode(){
        let me = this
        me.preCodigos     = []
        me.preActivacion  = []
        let nuevaData = me.arregloCodigos
        nuevaData.forEach((dato) => {
          me.preCodigos.push(dato.codigo);
          me.preActivacion.push(dato.codigo);
        });
      },
      generarNombreFile(){
        let me = this;
        //nombre file
        //tipoCodigo => 0 = activacion; 1 prueba diagnostico
        if(me.tipoCodigo == 0){
          me.fileName = 'ACTIVACION-'+me.codigo_liquidacion+'-'+me.cantidad+'C-'+me.fecha
        }else{
          me.fileName = 'DIAGNOSTICO-'+me.codigo_liquidacion+'-'+me.cantidad+'C-'+me.fecha
        }
      },
      // generarNombreFile(){
      //   let me = this;
      //   const currentDate = new Date();
      //   const currenFecha = moment(currentDate, 'DD/MM/YYYY HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
      //   me.fileName = `${this.arregloCodigos.length}c-${this.libroSelect.nombre}-${currenFecha}`
      // },
      //Guardar codigos en la BD
      async guardarCodigos() {
        let me = this;
        this.progressInterActivo     = 1;
        this.openLoadingColor()
        var formData = new FormData();
        formData.append("user_created",         me.usuario.idusuario);
        formData.append("data_codigos",         JSON.stringify(me.arregloCodigos));
        if(me.tipoCodigo == 0)                  { formData.append("contador",   me.contadorActivacion); }
        if(me.tipoCodigo == 1)                  { formData.append("contador",   me.contadorDiagnostica);
        }
        formData.append("prueba_diagnostica",   me.tipoCodigo);
        me.$vs.loading();
        this.$http.post(this.$server_url + 'guardarCodigos2', formData)
        .then(res => {
          this.$vs.loading.close()
          //porcentaje
          me.arregloCodigos           = []
          me.arregloCodigos           = res.data.codigosGuardados
          me.codigosNoIngresados      = res.data.codigosNoIngresados
          me.porcentajeA              = res.data.porcentajeA
          me.estadoProceso            = 2;
          me.codigos
          this.progressInterActivo    = '';
          if(this.codigosNoIngresados > 0){
            me.popupProblemas         = true
          }else{
            me.exportToExcel()
          }
        })
        .catch(function (error) {
          this.$vs.loading.close()
          alert('Error no existen códigos disponibles ' + error);
        });
      },
      //METODOS PARA EXPORTAR EXCEL
      exportToExcel() {
        let me = this
        let headerTitle = ""
        let headerVal = ""
          headerTitle = ['codigo', 'libro', 'serie', 'año','Tipo', 'contador','secuencia','imprimir'];
          headerVal = ['codigo', 'libro', 'serie', 'anio','', 'contadorCodigoA','',''];
        let codigoSelectedMayus = this.arregloCodigos
        for (var i = 0; i < codigoSelectedMayus.length; i++) {
          for (var key in codigoSelectedMayus[i]) {
              if (typeof codigoSelectedMayus[i][key] == "string") {
                codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
              }
          }
        }
        import('@/vendor/Export2Excel').then(excel => {
          const list = codigoSelectedMayus
          const data = this.formatJson(headerVal, list)
          for (var i = 0; i < data.length; i++) {
            data[i][4] = me.tipoCodigo == 0 ? 'CODIGO DE ACTIVACION DEL LIBRO': 'PRUEBA DIAGNOSTICA'
            data[i][6] = i+1
            data[i][7] = 1
          }
          excel.export_json_to_excel({
            header: headerTitle,
            data,
            filename: this.fileName,
            autoWidth: this.cellAutoWidth,
            bookType: this.selectedFormat
          })
          this.clearFields()
          this.guardarActivo = '';
          this.generarActivo = ' ';
          this.textAlertCant = '';
          // this.cantidad = '';
          this.codigoSelected = [];
          this.exportado      = 1
          me.$vs.notify({
          text:'Se exporto corectamente',
          color:'success',
          iconPack: 'feather',
          icon:'icon-check'})
        })
      },
      // exportToExcel() {
      //   let me = this
      //   //setear array
      //   var printArray = []
      //   me.arregloCodigos.forEach(element => {
      //     var cal = new Object()
      //     cal.activacion_barras   = "*"+element.codigo_activacion+"*"
      //     cal.codigo_activacion   = element.codigo_activacion
      //     cal.libro               = element.libro
      //     cal.contadorCodigoA     = element.contadorCodigoA +" -"
      //     printArray.push(cal)
      //  });
      //   let headerTitle = ""
      //   let headerVal = ""
      //     headerTitle = [
      //       'Activación barras',
      //       'Código activación',
      //       'Contador Activación',
      //       'Activación',
      //     ];
      //     headerVal = [
      //       'activacion_barras',
      //       'codigo_activacion',
      //       'contadorCodigoA',
      //       '',
      //     ];
      //   let codigoSelectedMayus = printArray
      //   for (var i = 0; i < codigoSelectedMayus.length; i++) {
      //     for (var key in codigoSelectedMayus[i]) {
      //         if (typeof codigoSelectedMayus[i][key] == "string") {
      //             codigoSelectedMayus[i][key] = codigoSelectedMayus[i][key].toUpperCase();
      //         }
      //     }
      //   }
      //   import('@/vendor/Export2Excel').then(excel => {
      //     const list = codigoSelectedMayus
      //     const data = this.formatJson(headerVal, list)
      //     for (var i = 0; i < data.length; i++) {
      //       data[i][3]   ="Activación "+me.libroSelect.nombre_imprimir
      //     }
      //     excel.export_json_to_excel({
      //       header: headerTitle,
      //       data,
      //       filename: this.fileName,
      //       autoWidth: this.cellAutoWidth,
      //       bookType: this.selectedFormat
      //     })
      //     this.clearFields()
      //     // this.textAlertCant  = '';
      //     this.cantidad       = '';
      //     this.exportado      = 1
      //     me.$vs.notify({
      //     text:'Se exporto corectamente',
      //     color:'success',
      //     iconPack: 'feather',
      //     icon:'icon-check'})
      //   })
      // },
      formatJson(filterVal, jsonData) {
          return jsonData.map(v => filterVal.map(j => {
              return v[j]
          }))
      },
      clearFields() {
          this.fileName = ''
          this.cellAutoWidth = true
          this.selectedFormat = 'xls'
      },
      openLoadingColor(libro) {
        this.$vs.loading({
            color: '#1A76F2'
        })
      },
    },
  }
  </script>
  <style scoped>
  /*CSS IMPORTADOS*/
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

