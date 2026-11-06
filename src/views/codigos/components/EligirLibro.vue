<template>
  <div>
      <div id="seccionCodigos">
          <!------listado series---->
          <div class="btn-group">
              <vs-button :key="indexitem" v-for="(item, indexitem) in series" class="m-1" @click="serieAsignada = 'Libros de '+item.nombre_serie; verLibrosSeries(item.id_serie, item);" color="success" type="gradient"><span style="text-transform: uppercase;">{{ item.nombre_serie }}</span></vs-button>
          </div>
          <!-----fin listado series---------------->
          <vx-card v-bind:title="serieAsignada" class="mt-3 mb-3" title-color="primary" subtitle="Seleccione una serie para ver sus libros disponibles.">
              <div class="btn-group">
                  <vs-table max-items="10" v-if="libros_series.length > 0" search pagination :data="libros_series">
                      <template slot="header">
                          <div>
                              <p>Cantidad: <span>{{libros_series.length}}</span> </p>
                          </div>
                      </template>
                      <template slot="thead">
                          <vs-th>Libro</vs-th>
                          <vs-th>Acciones</vs-th>
                      </template>
                      <template slot-scope="{data}">
                          <vs-tr :key="indextr" v-for="(tr, indextr) in data">
                              <vs-td>
                                  {{ tr.nombrelibro }}
                              </vs-td>
                              <vs-td>
                                  <vs-button v-bind:color="tr.boton"  @click="idLibro = tr.idLibro; codigo_liquidacion= tr.codigo_liquidacion; id_serie = tr.id_serie; iniciales = tr.iniciales; nombre = tr.nombrelibro; anio = tr.year; version = tr.version; libroAsignado=tr.nombrelibro; verVistaBuscar();estadoContador(tr.idLibro)" type="line">
                                  Seleccionar
                                  </vs-button>
                              </vs-td>
                          </vs-tr>
                      </template>
                  </vs-table>
              </div>
          </vx-card>
      </div>
      <!--GENERAR CODIGOS-->
      <div id="seccionGenerar" style="display: none;">
        <p class="text-center text-success font-bold text-3xl" v-if="exportado == 1"><ion-icon name="star-outline"></ion-icon> Se exporto el archivo <b>{{ filename }}</b></p>
          <!-- <vs-button color="primary" @click="regresarVista()" type="border" icon="home">Regresar</vs-button> -->
          <vx-card v-bind:title="'Generar Códigos para ' + libroAsignado" class="mt-3 mb-3" title-color="primary" subtitle="El archivo excel generado DEBE SER ENVIADO PARA IMPRESIÓN, y al DEPARTAMENTO MULTIMEDIA">
              <!--FILTRO PARA GENERAR CODIGOS-->
              <!-- <div v-if="guardarActivo!='' && codigos[0]">
                  <ul class="flex">
                      <li>
                          <b>SELECCIONE EL TIPO DE PROCESO:</b>
                      </li>
                      <li>
                      <vs-radio v-model="tipoCodigo" @input="generarNombreFile()" class="ml-3" vs-name="radios1tipoCodigo" vs-value="0">Códigos activación</vs-radio>
                      </li>
                      <li>
                      <vs-radio v-model="tipoCodigo" @input="generarNombreFile()" class="ml-2" vs-name="radios1tipoCodigo" vs-value="1">Con prueba diagnóstica</vs-radio>
                      </li>
                  </ul>
              </div> -->
              <!--FILTRO EN LA TABLA-->
              <div v-if="exportarActivo!=''">
                  <ul class="flex">
                      <li>
                          <b>FILTRAR TABLA POR:</b>
                      </li>
                      <li>
                      <vs-radio v-if="tipoCodigo == 0 || tipoCodigo == 2" v-model="tipoCodigoSelect" @input="setearTable()" class="ml-3" vs-name="radios1tipoCodigoSelect" vs-value="0">Codigo activación</vs-radio>
                      </li>
                      <li>
                      <vs-radio v-if="tipoCodigo == 1 || tipoCodigo == 2" v-model="tipoCodigoSelect" @input="setearTable()" class="ml-2" vs-name="radios1tipoCodigoSelect" vs-value="1">Con prueba diagnóstica</vs-radio>
                      </li>
                  </ul>
              </div>
              <div v-if="codigosNoIngresados.length > 0">
                  <div :key="indexitem" v-for="(item, indexitem) in codigosNoIngresados">
                      <p>Estos codigos no se pudieron ingresar</p>
                      <vs-chip color="primary">{{item.codigo}}</vs-chip>
                  </div>
              </div>
              <vs-progress v-if="porcentaje === 100 && guardarActivo!=''" :height="8" :percent="porcentaje" color="success"></vs-progress>
              <vs-progress v-if="progressInterActivo != ''" indeterminate color="primary"></vs-progress>
              <b style="color: #0AD68C;">{{ textAlertCant }}</b>
              <vs-table multiple v-model="codigoSelected" pagination max-items="25" search :data="codigos">
                <template slot="header">
                    Cantidad:&nbsp;&nbsp;
                    <vx-tooltip color="warning" text="Ingrese la cantidad de códigos que desea generar (máximo 10000)">
                        <vs-input class="inputx mr-3" @keyup.enter="exportarActivo = '';generarCodigos(cantidad);" style="width: 80px; text-align: center;" v-model="cantidad" />
                    </vx-tooltip>
                    <vx-tooltip color="warning" text="Ingrese Palabras P o si el código es largo la letra P antes de presionar GENERAR (Para códigos de diagnóstico)">
                        <vs-input class="inputx mr-3" v-if="cantidad<=10000 && generarActivo!=''"  style="width: 80px; text-align: center;" v-model="palabraDiagnostico" />
                    </vx-tooltip>
                    <vs-button color="primary" class="generarBoton mr-2" size="small" style="font-size: 13px;" @click="exportarActivo = '';tipoCodigo = 0;generarCodigos(cantidad);"  v-if="cantidad<=10000 && palabraDiagnostico.length < 3 && generarActivo!=''">Generar Códigos Activación</vs-button>
                    <vs-button color="warning" class="generarBoton mr-2" size="small" style="font-size: 13px;" @click="exportarActivo = '';tipoCodigo = 1;generarCodigos(cantidad);"  v-if="cantidad<=10000 && palabraDiagnostico.length < 3 && generarActivo!=''">Generar Códigos Diagnóstico</vs-button>                    <vs-button color="danger" size="small" style="font-size: 13px;" v-if="cantidad>10000">Cantidad excede los 10000</vs-button>
                    <vx-tooltip v-if="exportarActivo!=''" color="warning" text="Antes de exportar seleccione los codigos deseados.">
                        <vs-button color="dark" size="small" class="ml-5" style="font-size: 14px;" @click="exportarProceso();">Exportar</vs-button>
                    </vx-tooltip>
                    <div v-else-if="guardarActivo!='' && codigos[0]" style="display:flex;">
                        <vs-button color="success" size="small" class="ml-5" style="font-size: 14px;" @click="guardarCodigos(); guardarActivo = ''">Guardar</vs-button>
                        <vx-tooltip color="warning" text="Generar codigos de barras" style="margin-left:20px;border-radius:20px;">
                        </vx-tooltip>
                    </div>
                  </template>
                  <template slot="thead">
                    <vs-th sort-key="codigo">Código</vs-th>
                    <vs-th sort-key="libro">Libro</vs-th>
                    <vs-th sort-key="serie">Serie</vs-th>
                    <vs-th sort-key="anio">Año</vs-th>
                    <vs-th sort-key="libro_idlibro">Tipo</vs-th>
                    <vs-th sort-key="contador">Contador</vs-th>
                    <vs-th sort-key="secuencia">secuencia</vs-th>
                    <vs-th sort-key="imprimir">imprimir</vs-th>
                  </template>
                  <template slot-scope="{data}">
                    <vs-tr :data="tr" :key="indextr" v-for="(tr, indextr) in data">
                      <vs-td :data="data[indextr].codigo">
                          {{ data[indextr].codigo }}
                      </vs-td>
                      <vs-td :data="data[indextr].libro">
                          {{ data[indextr].libro }}
                      </vs-td>
                      <vs-td :data="data[indextr].serie">
                          {{ data[indextr].serie }}
                      </vs-td>
                      <vs-td :data="data[indextr].anio">
                          {{ data[indextr].anio }}
                      </vs-td>
                      <td>
                        {{ tipoCodigo == 0 ? 'CODIGO DE ACTIVACION DEL LIBRO' : 'PRUEBA DIAGNOSTICA' }}
                      </td>
                      <vs-td :data="data[indextr].contador">
                          {{ data[indextr].contador }}
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
          </vx-card>
      </div>
     <br>
      <!----modal exportar--------->
      <vs-prompt title="Exportar a Excel" class="export-options" @cancle="clearFields" @accept="exportToExcel" accept-text="Exportar" @close="clearFields" :active.sync="activePrompt">
        <vs-alert class="mb-3" color="danger" icon-pack="feather" icon="icon-info">
            <span>Recuerde <b>seleccionar</b> los códigos que desea exportar.</span>
        </vs-alert>
        <vs-input v-model="fileName" placeholder="Ingrese el nombre del archivo" class="w-full" />
        <v-select v-model="selectedFormat" :options="formats" class="my-4" />
      </vs-prompt>
  </div>
</template>
<script>
import vSelect from 'vue-select'
import moment from 'moment'
import 'moment/locale/es';
import $ from 'jquery'
export default{
  data(){
    return{
      libros_series:[],
      series:[],
      codigosNoIngresados:[],
      traercodigos:[],
      nombre: null,
      anio:'',
      idLibro:'',
      nombre_serie: '',
      longitud_numeros: '',
      longitud_letras: '',
      serieAsignada: 'Serie seleccionada',
      libroAsignado: '',
      exportarActivo:'',
      porcentaje: 0,
      cantidad: null,
      usuario:[],
      creador_codigo: null,
      textAlertCant: '',
      codigos: [],
      codigo: {
          codigo: '',
          libro: '',
          serie: '',
          anio: '',
          libro_idlibro: ''
      },
      progressInterActivo: '',
      generarActivo: ' ',
      guardarActivo: '',
      //variables para exportar a excel
      codigoSelected: [],
      fileName: null,
      formats: ['xls', 'xlsx', 'csv', 'txt'],
      cellAutoWidth: true,
      selectedFormat: 'xlsx',
      activePrompt: false,
      ///fin variables para exportar a excel
      //variables para tipo de proceso codigo
      tipoCodigo:0,
      tipoCodigoSelect:0,
      codigosDiagnostica:[],
      tmpCodigos:[],
      palabraDiagnostico:'P',
      //fin variables para tipo de proceso codigo
      //variables para el nombre del archivo al exportar
      day:'',
      mes:'',
      year:'',
      fecha:'',
      exportado:0,
      //fin variables para el nombre del archivo al exportar
    }
  },
  components:{
    vSelect,
  },
  methods:{
    //traer series
    async verLibrosSeries(id, item) {
        this.longitud_numeros   = item.longitud_numeros
        this.longitud_letras    = item.longitud_letras
        this.nombre_serie       = item.nombre_serie
        this.longitud_codigo    = item.longitud_codigo
        this.$http.get(this.$server_url + 'libros_series/' + id).then(res => {
            this.libros_series  = res.data;
        })
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
    //generar codigos
    generarCodigos(fin) {
        let me = this;
        this.codigoSelected = [];
        if (fin > 10000) {
          me.$vs.notify({
            color: 'primary',
            title: 'Mensaje',
            text: 'Máximo 10000 codigos se puede generar para el excel'
          })
          return false;
        }
        me.generarNombreFile()
        //activacion
        if(me.tipoCodigo == 0){
          this.code = this.codigo_liquidacion + "-";
        }
        //diagnostico
        if(me.tipoCodigo == 1){
          this.code = this.palabraDiagnostico+this.codigo_liquidacion + "-";
        }
        // this.code = this.codigo_liquidacion + "-";
        me.codigos              = [];
        me.codigosDiagnostica   = [];
        let formData = new FormData();
        formData.append('longitud',this.longitud_codigo);
        formData.append('code',this.code);
        formData.append('cantidad',fin);
        me.$vs.loading();
        this.$http.post(this.$server_url+'generarCodigos', formData)
        .then(function (res) {
            me.traercodigos = res.data.codigos;
            me.agregarAlaTabla()
            me.$vs.loading.close()
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
    },
    //agregar codigos a la tabla
    agregarAlaTabla(){
        let me  = this;
        //this.codigoSelected = [];
        me.codigos      = [];
        let idLibrog    = me.idLibro;
        let id_serieg   = me.id_serie;
        let nombreg     = me.nombre;
        let aniog       = me.anio;
        //ASIGNAR A CADA CODIGO LOS DATOS COMO LIBRO,SERIE
        me.traercodigos.map(p => {
            //codigos anteriores
            me.codigos.push({
                codigo: p.codigo,
                libro: nombreg,
                serie: id_serieg,
                anio: aniog,
                libro_idlibro: idLibrog
            });
            //codigos con prueba diagnostica
            me.codigosDiagnostica.push({
                codigo: p.codigo,
                libro: nombreg,
                serie: id_serieg,
                anio: aniog,
                libro_idlibro: idLibrog
            });
        })
        this.guardarActivo = 1;
        me.$vs.notify({
            color: 'primary',
            title: 'Mensaje',
            text: 'Codigos Cargados'
        })
    },
    //Guardar codigos en la BD
    async guardarCodigos() {
        let me = this;
        this.generarActivo           = '';
        this.progressInterActivo     = 1;
        var codigosEnviar            = [];
        var codigosEnviarDiagnostico = [];
        for (var i = this.porcentaje; i < this.codigos.length; i++) {
            //codigos anteriores
            codigosEnviar.push(this.codigos[i].codigo);
            //codigos prueba diagnostica
            codigosEnviarDiagnostico.push(this.codigosDiagnostica[i].codigo);
        }
        this.openLoadingColor()
        var formData = new FormData();
        if(me.tipoCodigo == 0 || me.tipoCodigo == 2){
            formData.append("codigo",           codigosEnviar);
        }
        if(me.tipoCodigo == 1 || me.tipoCodigo == 2){
            formData.append("codigosDiagnostico",codigosEnviarDiagnostico);
        }
        formData.append("serie",                this.nombre_serie);
        formData.append("libro",                this.nombre);
        formData.append("anio",                 this.anio);
        formData.append("idlibro",              this.idLibro);
        formData.append("estado",               0);
        formData.append("idusuario",            this.creador_codigo);
        formData.append("contador",             localStorage.contadorSerie);
        formData.append('contadorDiagnostico',  localStorage.contadorSerieDiagnostica)
        formData.append("tipoCodigo",           me.tipoCodigo);
        me.$vs.loading();
        //SE GENERA LOS CODIGOS PERO NO SE VERIFICA CON LA BASE
        this.$http.post(this.$server_url + 'codigosLibros', formData)
            .then(res => {
                //porcentaje
                var porcentajeAnterior      = 0
                var porcentajeDiagnostico   = 0
                var resultadoPorcentaje     = 0
                porcentajeAnterior          = res.data.porcentajeAnterior
                porcentajeDiagnostico       = res.data.porcentajeDiagnostico
                resultadoPorcentaje         = porcentajeAnterior +  porcentajeDiagnostico
                //only codigos
                if(me.tipoCodigo == 0){
                    this.tipoCodigoSelect   = me.tipoCodigo
                    this.codigosNoIngresados= res.data.codigosNoIngresadosDiagnostico;
                }
                //only diagnostico
                if(me.tipoCodigo == 1){
                    this.tipoCodigoSelect   = me.tipoCodigo
                    this.codigosNoIngresados= res.data.codigosNoIngresadosAnterior;
                }
                //ambos
                if(me.tipoCodigo == 2){
                    this.tipoCodigoSelect   = 0
                    this.codigosNoIngresados= res.data.codigosNoIngresadosAnterior;
                }
                this.porcentaje             = resultadoPorcentaje
                this.codigosNoIngresados    = res.data.codigosNoIngresadosAnterior;
                this.$vs.loading.close()
                this.textAlertCant          = 'Se han guardado con éxito: ' + this.porcentaje + ' códigos.';
                this.progressInterActivo    = '';
                this.generarActivo          = '';
                var datos                   = this.creador_codigo + '*' + this.porcentaje;
                this.$http.get(this.$server_url + 'codigosLibrosExportados/' + datos)
                .then(res => {
                    this.$vs.loading.close()
                    me.tmpCodigos = res.data
                    me.setearTable()
                    me.estadoContador()
                    //solo codigos
                    // let datos = res.data.codigos_libros
                    // datos.sort((p,p2) => p.contador - p2.contador);
                    // this.codigos = datos;
                    // //con prueba diagnostica
                    // let datos2 = res.data.codigos_librosDiagnostica
                    // datos.sort((p,p2) => p.contador - p2.contador);
                    // //fin con prueba diagnostica
                    // this.codigos            = datos;
                    // this.codigosDiagnostica = datos2;
                    // this.exportarActivo = 1;
                    //this.porcentaje = 0;
                    if (res.data == 0) {
                        alert('No existen más códigos disponibles. Se ha producido un error al exportar. Comuníquese con el departamento de sistemas para exportar el Excel.');
                    }
                })
            })
            .catch(function (error) {
                this.$vs.loading.close()
                alert('Error no existen códigos disponibles ' + error);
            });
    },
    setearTable(){
      let me = this;
      this.codigoSelected     = [];
      let datos               = me.tmpCodigos
      datos.sort((p,p2) => p.contador - p2.contador);
      this.codigos            = datos.filter(p => p.prueba_diagnostica == me.tipoCodigoSelect);
      this.exportarActivo     = 1;
      this.porcentaje         = 0;
      me.exportToExcel()
    },
    verVistaBuscar() {
        this.codigos = [];
        this.codigoSelected = [];
        $('#seccionCodigos').css('display', 'none');
        $('#seccionGenerar').css('display', 'block');
    },
    //obtener el estado del ultimo codigo el contador
    estadoContador(libro){
        let me = this;
        me.$vs.loading();
        this.$http.get(this.$server_url+'contadorCodigo?libro='+me.idLibro)
        .then(function (res) {
            me.$vs.loading.close()
            localStorage.setItem('contadorSerie',            res.data.contador)
            localStorage.setItem('contadorSerieDiagnostica', res.data.contadorDiagnostica)
        })
        .catch(function (error) {
            console.log(error + ' error');
            me.$vs.loading.close()
        })
    },
    openLoadingColor(libro) {
        this.$vs.loading({
            color: '#1A76F2'
        })
    },
    //==METODOS PARA EXPORTAR A EXCEL====/
    exportarProceso() {
        this.activePrompt = true
    },
    exportToExcel() {
      let me = this
      let headerTitle = ""
      let headerVal = ""
        headerTitle = ['codigo', 'libro', 'serie', 'año','Tipo', 'contador','secuencia','imprimir'];
        headerVal = ['codigo', 'libro', 'serie', 'anio','', 'contador','',''];
      // let codigoSelectedMayus = this.codigoSelected
      let codigoSelectedMayus = this.codigos
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
        this.cantidad = '';
        this.codigoSelected = [];
        this.exportado      = 1
        me.$vs.notify({
        text:'Se exporto corectamente',
        color:'success',
        iconPack: 'feather',
        icon:'icon-check'})
      })
    },
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
  },
  created(){
    let me = this;
    this.$http.get(this.$server_url + 'series').then(res => {
      this.series = res.data;
    })
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.creador_codigo = this.usuario.idusuario;
    moment.lang("es")
    me.day        = moment().format('DD');
    me.mes        = moment().format('MMMM');
    me.year       = moment().format('YYYY')
    let preFecha  = me.day+'-'+me.mes+'-'+me.year
    me.fecha      = preFecha.toUpperCase()
  },
}
</script>
