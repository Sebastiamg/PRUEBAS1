<template>
  <div>
    <vs-card>
        <vs-breadcrumb class="mb-5">
          <li>
              <div class="mt-2" style="font-size: 13px;">Código***</div>
              <vs-input v-model="codigo_busqueda" @keyup.enter="buscarCodigos(codigo_busqueda)" class="mr-2" />
          </li>
          <li><br>
              <span style="font-size: 30px;" class="vs-breadcrum--separator">»</span>
          </li>
          <li v-if="usuario.id_group != 17">
              <div class="mt-2" style="font-size: 13px;">Seleccione un libro</div>
              <v-select class="mr-2" style="width: 250px; font-size: 15px; background-color: white;" :options="libros" v-model="codigo.libro" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
          </li>
          <li v-if="usuario.id_group != 17 && codigo.libro && userAdmin">
            <div class="mt-2" style="font-size: 13px;">Escriba contador libro</div>
            <vs-input v-model="contadorLibro" @keyup.enter="buscarCodigoXContador()" class="mr-2" />
          </li>
          <li v-if="usuario.id_group != 17"><br>
              <span style="font-size: 30px;" class="vs-breadcrum--separator">»</span>
          </li>
          <div v-if="usuario.id_group == 11">
            <li>
                <div class="mt-2" style="font-size: 13px;">Ej: 2020-08-24 19:05</div>
                <vs-input v-model="fecha_busqueda" class="mr-2" />
            </li>
          </div>
          <div v-else>
            <li v-if="usuario.id_group != 17  && !codigo.libro">
              <div class="mt-2" style="font-size: 13px;">Ej: 2020-08-24 19:05</div>
              <vs-input v-model="fecha_busqueda" class="mr-2" />
            </li>
          </div>
          <li><br>
            <vs-button v-if="codigo.libro && userAdmin" class="mt-2" radius color="success" type="gradient" icon-pack="feather" icon="icon-search" @click="buscarCodigoXContador()"></vs-button>
            <vs-button v-else class="mt-2" radius color="success" type="gradient" icon-pack="feather" icon="icon-search" @click="buscarCodigos(codigo_busqueda, codigo.libro, fecha_busqueda)"></vs-button>
          </li>
          <li v-if="creador_codigo===14818 || creador_codigo===5103 || creador_codigo===4853 || creador_codigo===35748"><br> &nbsp;
              <vs-button class="mt-2" color="primary" type="gradient" @click="modalAgregarCodigo()">Agregar</vs-button>
          </li>
          <li v-if="arregloStorage.length > 0 && userAdmin"><br> &nbsp;
              <vs-button class="mt-2" color="success" type="gradient" @click="popupMostrarCodigos = true;">Mostrar códigos storage: <b>{{ arregloStorage.length }}</b></vs-button>
          </li>
        </vs-breadcrumb>
        <gestionCodigosLista
            :arregloCodigos="codigosbuscar"
            :btnEditar="Number(0)"
            :btnEliminar="Number(0)"
            :btnEstudiante="Number(1)"
            :btnBloquear="Number(1)"
            :ifFechaEstudiante="Number(1)"
            :btnAddStorage="Number(1)"
            @crud="changeHandle"
            @changeAddStorage="changeAddStorage"
        />
    </vs-card>
    <!--Modal-->
    <!-- modal agregar codigo perdido -->
    <vs-popup title="Agregar código manualmente" :active.sync="modalAgregar">
      <div class="mt-2" style="font-size: 13px;">Seleccione la serie</div>
      <v-select class="mb-4 w-full" v-model="serieSelect" :options="series" @input="verLibrosSeries(serieSelect.id_serie,1)" label="nombre_serie" :reduce="series => series" />
      <!-- {{serieSelect}} -->
      <div class="mt-2" style="font-size: 13px;">Seleccione el libro</div>
      <v-select class="mb-4 w-full" v-model="libroSelect" :options="libros_series" label="nombre" :reduce="libros_series => libros_series" />
      <!-- {{libroSelect}} -->
      <p>
        <vs-input label="Ingresar código" v-model="ing_codigo" />
      </p>
      <div class="mt-4">
        <vs-radio v-model="prueba_diagnostica" vs-value="0" class="mr-4" vs-name="tipo_codigo">Activacion</vs-radio>
        <vs-radio v-model="prueba_diagnostica" vs-value="1" class="mr-4" vs-name="tipo_codigo">Diagnóstica</vs-radio>
      </div>
      <vs-divider></vs-divider>
      <div class="mt-5">
          <vs-button class="mt-2" color="primary" type="gradient" @click="agregar_codigo_perdido()">Agregar código</vs-button>
      </div>
    </vs-popup>
    <!-------modal editar codigo---------->
    <vs-popup title="Editar Código" fullscreen :active.sync="popupEditCodigo">
      <vs-divider> Estudiante </vs-divider>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <vs-input style="width: 85%; display: inline-block;" label="Cédula" v-model="estudiante.cedula" />
              <vs-button style="width: 14.9%; display: inline-block;" class="mt-2" color="primary" type="gradient" icon-pack="feather" icon="icon-search" @click="cargarEstudianteCod(estudiante.cedula)"></vs-button>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <vs-input disabled class="w-full" label="Nombres" v-model="estudiante.nombres" />
          </div>
      </div>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <vs-input disabled class="w-full" label="Apellidos" v-model="estudiante.apellidos" />
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <vs-input disabled class="w-full" label="Email" v-model="estudiante.email" />
          </div>
      </div>
      <vs-divider> Institución Estudiante </vs-divider>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <div style="font-size: 13px;">Institución</div>
              <ul class="leftx" style="display:flex;flex-direction: row;">
                  <li class="ml-2">
                  <vs-radio v-model="periodo.region" vs-name="radiosPeriodo" @input="getPeriodoxRegion();periodo.region ='1'" vs-value="1">Sierra</vs-radio>
                  </li>
                  <li class="ml-2">
                  <vs-radio v-model="periodo.region" vs-name="radiosPeriodo" @input="getPeriodoxRegion();periodo.region ='2'" vs-value="2">Costa</vs-radio>
                  </li>
              </ul>
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <v-select :options="periodos" :reduce="periodos => periodos.idperiodoescolar" label="periodo" class="w-full" v-model="periodo.getPeriodo" />
          </div>
      </div>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <div style="font-size: 13px;">Institución</div>
              <v-select class="w-full" :options="instituciones" v-model="estudiante.nombreInstitucion" @input="asignarInstitucionEstudiante(estudiante.nombreInstitucion)" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <vs-input disabled class="w-full" label="Ciudad" v-model="estudiante.nombreCiudad" />
          </div>
      </div>
      <vs-divider> Código </vs-divider>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <vs-input disabled class="w-full" label="Código" v-model="codigobuscar.codigo" />
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <div style="font-size: 13px;">Serie</div>
              <v-select class="w-full" :options="seriesEdit" v-model="codigobuscar.serie" @input="cambiarSerie(codigobuscar.serie)" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
          </div>
      </div>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <div style="font-size: 13px;">Libro</div>
              <v-select class="w-full" :options="librosEdit" v-model="codigobuscar.libro" @input="cambiarLibro(codigobuscar.libro)" :dir="$vs.rtl ? 'rtl' : 'ltr'" />
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <vs-input disabled class="w-full" label="Año" v-model="codigobuscar.anio" />
          </div>
      </div>
      <div class="vx-row">
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <vs-input disabled class="w-full" label="Fecha Creación" v-model="codigobuscar.fecha_create" />
          </div>
          <div class="vx-col sm:w-1/2 w-full mb-2">
              <vs-button color="success" class="mt-5" style="width: 100%;" type="gradient" @click="editarCodigos(codigobuscar)">Editar</vs-button>
          </div>
      </div>
    </vs-popup>
    <!-- Modal Agregar-->
    <div class="demo-alignment">
      <vs-popup classContent="popup-example" title="Cambiar Estado a codigo" :active.sync="popupCambioEstadoCodigo">
          <vs-input class="inputx mb-3 w-full" label="Observacion por que se realiza el bloqueo/desbloqueo del codigo" v-model="observacionEstado" />
          <br><br>
          <vs-button color="success" class="w-full mb-3" @click="cambioEstadoCodigo()" type="gradient" >Cambiar Estado</vs-button>
      </vs-popup>
    </div>
    <!--MODAL PARA MOSTRAR LOS CODIGOS DEL STORAGE-->
    <vs-popup title="Códigos agregados al storage" :active.sync="popupMostrarCodigos">
      <TableCodigosStorageVue v-if="popupMostrarCodigos" :arregloStorage="arregloStorage" @changeDeleteStorage="changeDeleteStorage"/>
    </vs-popup>
  </div>
</template>
<script>
import gestionCodigosLista from './utils/gestionCodigosLista.vue'
import TableCodigosStorageVue from './utils/TableCodigosStorage.vue';
import flatPickr from 'vue-flatpickr-component';
import 'flatpickr/dist/flatpickr.css';
import Vue from 'vue'
import axios from 'axios'
import vSelect from 'vue-select'
import moment from 'moment'
import $ from 'jquery'
export default {
    data() {
        return{
        activePrompt: false,
        creador_codigo: null,
        instituciones:[],
        seriesEdit:[],
        usuario:[],
        series:[],
        libros:[],
        libros_series: [],
        reportesActivo: 0,
        codigoSelected: [],
        porcentaje: 0,
        codigo_busqueda: '',
        fecha_busqueda: null,
        codigosbuscar: [],
        codigo:{
            libro:'',
        },
        modalAgregar:false,
        ing_codigo:'',
        serieSelect: '',
        longitud_numeros: '',
        longitud_letras: '',
        nombre_serie:'',
        libroSelect: '',
        codigobuscar: {
            codigo: '',
            libro: '',
            serie: '',
            anio: '',
            libro_idlibro: '',
            fecha_create: ''
        },
        estudiante: {
            idusuario: '',
            cedula: '',
            nombres: '',
            apellidos: '',
            email: '',
            nombreInstitucion: '',
            nombreCiudad: ''
        },
        serieEditar: '',
        libroEditar: '',
        libro_idlibroEditar: '',
        id_periodo: '',
        popupEditCodigo:false,
        itemEstado : [],
        estadoCodigo :"",
        observacionEstado:"",
        idusuarioCodigo: '',
        librosEdit: [],
        libroEdit: {
            id: '',
            label: ''
        },
        dataBusqueda: '',
        codigo_busqueda: '',
        popupCambioEstadoCodigo:false,
        activePrompt: false,
        reporteAsesorActivo: false,
        guardarActivo:'',
        generarActivo:'',
        textAlertCant:'',
        cantidad:'',
        periodo:{
            region:'2',
            getPeriodo:'',
        },
        periodos:[],
        //VARIABLES PARA MOSTRAR CODIGOS EN EL STORAGE
        contadorLibro:'',
        arregloStorage:[],
        popupMostrarCodigos:false,
        userAdmin:false,
        //FIN VARIABLES PARA MOSTRAR CODIGOS EN EL STORAGE
        codigoTemp:'',
        prueba_diagnostica:0,
        tipo_codigo:'',
      }
    },
    components:{
      'v-select': vSelect,
      gestionCodigosLista,
      TableCodigosStorageVue,
    },
    mounted(){
      let me = this;
      me.getPeriodoxRegion()
      //SI HAY CODIGOS EN EL STORAGE
      let getStorage = JSON.parse(localStorage.getItem("getStorage"))
      if(getStorage){
        me.arregloStorage  = getStorage
      }
      //user admin
      if(me.usuario.id_group == 1) me.userAdmin = true
    },
    created() {
        let me = this;
        //para traer el listado de ciudades para filtrar por institucion
        me.buscarlibros();
        me.$http.get(me.$server_url+'series').then(res => {
            me.series = res.data;
        }),
        me.usuario = JSON.parse(localStorage.getItem('usuario'));
        me.creador_codigo = me.usuario.idusuario;
        me.$http.get(me.$server_url+'seriesCambiar').then(res => {
            me.seriesEdit = res.data;
        }),
        me.$http.get(me.$server_url+'institucionesResportes').then(res => {
            me.instituciones = res.data;
        })
    },
    methods:{
        changeHandle(e){
            let me = this;
            me.codigoTemp = e.info.codigo
            if(e.tipo == "editar"){
                me.popupEditCodigo = true
                me.editarCodigo(e.info)
            }else{
                me.ConfirmCambiadoEstadoCodigo(e.info,e.estado)
            }
        },

         buscarlibros() {
            let me = this;
            me.reportesActivo = 0;
            me.codigoSelected = [];
            me.porcentaje = 0;
            me.$http.get(me.$server_url+'librosBuscar').then(res => {
                me.libros = res.data;
            })
        },
        buscarCodigoXContador(){
          let me = this
          let ruta = ""
          me.codigosbuscar = []
          if(me.contadorLibro == "" || me.contadorLibro == null || me.contadorLibro == undefined){
            this.$vs.notify({
              text: 'Ingrese un contador por favor',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }
          if(me.codigo.libro == "" || me.codigo.libro == null || me.codigo.libro == undefined){
            this.$vs.notify({
              text: 'Seleccione un libro por favor para buscar el contador',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }
          if(me.contadorLibro < 2){
            this.$vs.notify({
              text: 'No puede realizar búsquedas menos de 2 ',
              color: 'warning',
              iconPack: 'feather',
              icon: 'icon-alert-triangle'
            })
            return
          }
          me.$vs.loading()
          ruta = this.$server_url+'codigosBuscarCodigoXContador/' + me.codigo.libro.idLibro+'/'+me.contadorLibro
          this.$http.get(ruta).then(res => {
          this.$vs.loading.close()
          this.codigosbuscar = res.data;
            if (res.data[0] === undefined) {
              this.$vs.notify({
                text: 'Código no encontrado',
                color: 'danger',
                iconPack: 'feather',
                icon: 'icon-alert-triangle'
              })
            }
          })
          .catch((err) => {
            this.$vs.loading.close()
          })
        },
        async buscarCodigos(codigo, libro, fecha_busqueda) {
          let me = this;
          this.popupEditCodigo = false;
          if(me.usuario.id_group == 17){
              if(codigo.length < 5){
                  this.$vs.notify({
                      text: 'Minimo 5 caracteres',
                      color: 'danger',
                      iconPack: 'feather',
                      icon: 'icon-alert-triangle'
                  })
                  return false
              }
          }
          this.codigoSelected = [];
          if (codigo != '') {
              this.openLoadingColor();
              this.codigo_busqueda = '';
              this.fecha_busqueda = '';
              this.codigo.libro = '';
              let ruta = ""
              if(me.usuario.id_group == 11){
                  ruta = this.$server_url+'codigosBuscarxCodigo/' + codigo
              }else{
                  ruta = this.$server_url+'codigosBuscarCodigo/' + codigo
              }
              this.$http.get(ruta).then(res => {
                  this.$vs.loading.close()
                  this.codigosbuscar = res.data;
                  if (res.data[0] === undefined) {
                      this.$vs.notify({
                          text: 'Código no encontrado',
                          color: 'danger',
                          iconPack: 'feather',
                          icon: 'icon-alert-triangle'
                      })
                  }
              })

          }else {
              this.codigoSelected = [];
              this.dataBusqueda = libro.label + '*' + fecha_busqueda;

              this.openLoadingColor();
              let data = libro.label + '*' + fecha_busqueda;

              if (libro != '' && libro != null && fecha_busqueda != null) {
                  this.$http.get(this.$server_url+'codigosLibrosFecha/' + data).then(res => {
                      this.$vs.loading.close()
                      this.codigosbuscar = res.data;
                      if (res.data == 0) {
                          this.$vs.notify({
                              text: 'No existen códigos creados para este libro. Puede probar con otra fecha.',
                              color: 'warning',
                              iconPack: 'feather',
                              icon: 'icon-alert-circle'
                          })
                      }
                  })
              } else {
                  this.$vs.loading.close()
                  this.$vs.notify({
                      text: 'Seleccione un libro y escriba una fecha aproximada para realizar la búsqueda.',
                      color: 'warning',
                      iconPack: 'feather',
                      icon: 'icon-alert-circle'
                  })
              }

          }
        },
        async verLibrosSeries(id, item) {
          console.log(id, item)
          this.longitud_numeros = item.longitud_numeros
          this.longitud_letras = item.longitud_letras
          this.nombre_serie = item.nombre_serie
          this.$http.get(this.$server_url+'libros_series/' + id).then(res => {
            this.libros_series = res.data;
          })
        },
         agregar_codigo_perdido() {
            let me = this;
            // console.log(me.ing_codigo, me.serieSelect.nombre_serie, me.libroSelect.nombre, String(me.libroSelect.year), 0, me.creador_codigo, me.libroSelect.idLibro, me.prueba_diagnostica);

            let formData = new FormData();
            formData.append('codigo', me.ing_codigo)
            formData.append('serie', me.serieSelect.nombre_serie)
            formData.append('libro', me.libroSelect.nombre)
            formData.append('anio', String(me.libroSelect.year))
            formData.append('idusuario', 0);
            formData.append('idusuario_creador_codigo', me.usuario.idusuario)
            formData.append('libro_idlibro', parseInt(me.libroSelect.idLibro))
            formData.append('estado', 0);
            formData.append('prueba_diagnostica', me.prueba_diagnostica);
            this.$http.post(this.$server_url+'agregar_codigo_perdido', formData)
                .then(res => {
                    console.log(res.data)
                    me.modalAgregar = false;
                    me.buscarCodigos(me.ing_codigo)
                    me.$vs.notify({
                        text: 'Codigo agregado correctamente',
                        color: 'success',
                        iconPack: 'feather',
                        icon: 'icon-check'
                    })

                })
                .catch(function (error) {
                    console.log('error->  ' + me.ing_codigo);
                });
        },
        editarCodigo(item) {

            this.codigobuscar.codigo = '';
            this.codigobuscar.libro = '';
            this.codigobuscar.serie = '';
            this.codigobuscar.anio = '';
            this.codigobuscar.fecha_create = '';

            this.estudiante.cedula = '';
            this.estudiante.nombres = '';
            this.estudiante.apellidos = '';
            this.estudiante.email = '';
            this.estudiante.nombreInstitucion = '';
            this.estudiante.nombreCiudad = '';

            this.codigobuscar.codigo = item.codigo;
            this.codigobuscar.libro = item.libro;
            this.codigobuscar.serie = item.serie;
            this.codigobuscar.anio = item.anio;
            this.codigobuscar.fecha_create = item.fecha_create;

            this.serieEditar = item.serie;
            this.libroEditar = item.libro;
            this.libro_idlibroEditar = item.libro_idlibro;
            this.periodo.getPeriodo  = ""
            this.periodo.region      = 1
            if (item.idusuario != 0 && item.idusuario !=null) {
                this.idusuarioCodigo      = item.idusuario;
                this.periodo.getPeriodo   = item.id_periodo
                this.serieEditar          = item.serie;
                this.libroEditar          = item.libro;
                this.libro_idlibroEditar  = item.libro_idlibro;

                //datos estudiante
                this.$http.get(this.$server_url+'estudianteCodigo/' + item.idusuario).then(res => {
                        this.estudiantes = res.data;
                        this.estudiante.cedula    = res.data[0].cedula;
                        this.estudiante.nombres   = res.data[0].nombres;
                        this.estudiante.apellidos = res.data[0].apellidos;
                        this.estudiante.email     = res.data[0].email;
                    }),
                    //institucion estudiante
                    this.$http.get(this.$server_url+'institucionEstCod/' + item.idusuario).then(res => {
                      if (res.data === undefined) {
                        return;
                      } else {
                        this.estudiante.nombreInstitucion = {
                          id: res.data[0].idInstitucion,
                          label: res.data[0].nombreInstitucion,
                          id_periodo: res.data[0].id_periodo
                        };
                        // this.id_periodo = res.data[0].id_periodo
                        this.estudiante.nombreCiudad = res.data[0].nombre_ciudad;
                        this.periodo.region          = res.data[0].region
                      }
                    })
            } else {
                return;
            }
        },

          //para obtener el listado de los periodos
        getPeriodoxRegion() {
            let me = this;
            this.$http.get(this.$server_url+'periodo?porAllEstados=yes'+'&region='+me.periodo.region)
                .then(function (res) {
                    me.periodos = res.data
                })
                .catch(function (error) {
                    console.log(error + ' error');

                })
        },
         editarCodigos(item) {
          let me = this;
            if (this.estudiante.cedula === '') {
                this.$vs.notify({
                    text: 'Ingrese un Estudiante antes de Modificar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }

            if (this.estudiante.nombreInstitucion === null || this.estudiante.nombreInstitucion === '' || this.estudiante.nombreInstitucion === undefined) {
                this.$vs.notify({
                    text: 'Seleccione la Institución del Estudiante antes de modificar',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            if(me.periodo.getPeriodo == null || me.periodo.getPeriodo == "" || me.periodo.getPeriodo == undefined){
              this.$vs.notify({
                    text: 'Seleccione un período por favor',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                });
                return;
            }
            // this.openLoadingColor()
            let datos = this.codigobuscar.codigo + '*'
             + this.codigobuscar.libro + '*'
             + this.serieEditar + '*'
             + this.codigobuscar.anio + '*'
             + this.creador_codigo + '*'
             + this.idusuarioCodigo + '*'
             + this.libro_idlibroEditar
             + '*' + this.periodo.getPeriodo
             + '*' + this.estudiante.nombreInstitucion.id;
            //alert(this.codigobuscar.libro);
            if (this.codigobuscar.libro != '' && this.codigobuscar.libro != 'null' && this.codigobuscar.libro != null) {
              this.$http.get(this.$server_url+'editarCodigoBuscado/' + datos)
              .then(function (res) {
                // this.$vs.loading.close()
                // this.popupEditCodigo = false;
                me.buscarCodigos(me.codigoTemp)
              })
              .catch(function (error) {
                // this.$vs.loading.close()
                console.log(error + ' error');
              })
            } else {
              console.log("dos")
                this.$vs.notify({
                    text: 'Seleccione un libro antes de modificar',
                    color: 'danger',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
            }

        },

        cambiarSerie(item) {
            this.$http.get(this.$server_url+'librosSerieCambiar/' + item.id).then(res => {
                this.librosEdit = res.data;
                this.serieEditar = item.label;

                this.codigobuscar.libro = '';
            })
        },
        cambiarLibro(item) {
            this.$http.get(this.$server_url+'librosCambiar/' + item.id).then(res => {
                this.codigobuscar.libro = res.data[0].nombre;
                this.codigobuscar.anio = res.data[0].year;
                this.codigobuscar.fecha_create = res.data[0].created_at;
                this.libro_idlibroEditar = res.data[0].idLibro;
            })
        },

        //Para confirmar el bloqueo del codigo
        ConfirmCambiadoEstadoCodigo(item,estado){
            let me = this;
            me.itemEstado = item;
            me.estadoCodigo = estado;
            localStorage.estado = estado;
            this.$vs.dialog({
                type:'confirm',
                color: 'danger',
                title: `Confirm`,
                text:  'Esta seguro de cambiar el estado del codigo?',
                accept:this.ActivarModalEstadoCodigo
            })
        },
        cargarEstudianteCod(cedula) {
            this.openLoadingColor();
            this.estudiante.cedula = '';
            this.estudiante.nombres = '';
            this.estudiante.apellidos = '';
            this.estudiante.email = '';
            this.estudiante.nombreInstitucion = '';
            this.estudiante.nombreCiudad = '';
            if (cedula != '') {
                this.$http.get(this.$server_url+'cedulasEstudiantes/' + cedula).then(res => {
                    if (res.data[0] === undefined) {
                        this.$vs.loading.close()
                        this.$vs.notify({
                            text: 'Cédula no encontrada',
                            color: 'danger',
                            iconPack: 'feather',
                            icon: 'icon-alert-triangle'
                        })
                    } else {
                        this.$vs.notify({
                            text: 'Estudiante encontrado',
                            color: 'success',
                            iconPack: 'feather',
                            icon: 'icon-check'
                        })

                        this.idusuarioCodigo = res.data[0].idusuario;
                        this.estudiante.cedula = res.data[0].cedula;
                        this.estudiante.nombres = res.data[0].nombres;
                        this.estudiante.apellidos = res.data[0].apellidos;
                        this.estudiante.email = res.data[0].email;

                        //institucion estudiante
                        this.$http.get(this.$server_url+'institucionEstCod/' + res.data[0].idusuario).then(res => {
                            this.$vs.loading.close()
                            if (res.data === undefined) {
                                return;
                            } else {
                                this.estudiante.nombreInstitucion = {
                                    id: res.data[0].idInstitucion,
                                    label: res.data[0].nombreInstitucion,
                                    id_periodo: res.data[0].id_periodo
                                };
                                this.id_periodo = res.data[0].id_periodo
                                this.estudiante.nombreCiudad = res.data[0].nombre_ciudad;
                            }
                        })
                    }
                })
            } else {
              this.$vs.loading.close()
              this.$vs.notify({
                  text: 'Cédula no encontrada',
                  color: 'danger',
                  iconPack: 'feather',
                  icon: 'icon-alert-triangle'
              })
            }
        },
         asignarInstitucionEstudiante(item) {
            let me = this;
            this.estudiante.nombreCiudad = item.nombre_ciudad;
            this.id_periodo = item.id_periodo
            if (this.estudiante.nombres == '') {
                this.estudiante.nombreInstitucion = '';
                this.estudiante.nombreCiudad = '';
                this.$vs.notify({
                    text: 'Ingrese un estudiante antes de asignar una Institución.',
                    color: 'warning',
                    iconPack: 'feather',
                    icon: 'icon-alert-triangle'
                })
                return;
            }
            var formData = new FormData();
            formData.append("id", this.idusuarioCodigo);
            formData.append("idInstitucion", item.id);
            formData.append("codigo", me.codigobuscar.codigo);
            this.$http.post(this.$server_url+'editarInstEstud', formData).then(res => {
                this.$vs.notify({
                    text: 'Institución asignada correctamente',
                    color: 'success',
                    iconPack: 'feather',
                    icon: 'icon-check'
                })
                })
                .catch(function (error) {
                    alert('Error al asignar Institución');
                });

        },
        modalAgregarCodigo() {
            let me = this;
            me.ing_codigo = ''
            me.modalAgregar = true;
        },

         openLoadingColor(libro) {
            this.$vs.loading({
                color: '#1A76F2'
            })
        },

           ActivarModalEstadoCodigo(){
            let me = this;
            me.popupCambioEstadoCodigo = true;
        },

        cambioEstadoCodigo() {
          let me = this;
          if(me.observacionEstado ==""|| me.observacionEstado == undefined){
            me.$vs.notify({
                text: 'Ingrese una observacion por favor',
                color: 'primary',
                iconPack: 'feather',
                icon: 'icon-check'
            })
            return false;
          }
          let formData = new FormData();
          formData.append('periodo', me.itemEstado.idperiodoescolar);
          formData.append("codigo", me.itemEstado.codigo);
          formData.append("estado", me.estadoCodigo);
          formData.append('usuario_editor',me.creador_codigo);
          if(me.estadoCodigo == '2'){
                formData.append("observacion",me.observacionEstado);
          }else{
                formData.append("observacion",me.observacionEstado);
          }
          this.$http.post(this.$server_url+'cambioEstadoCodigo', formData)
            .then(res => {
              if(res.data.message){
                me.$vs.notify({
                  text: res.data.message,
                  color: 'primary',
                  iconPack: 'feather',
                  icon: 'icon-check'
                })
                return false;
              }
              if (me.estadoCodigo == 0) {
                me.$vs.notify({
                  text: 'Codigo activo nuevamente',
                  color: 'success',
                  iconPack: 'feather',
                  icon: 'icon-check'
                })
                me.popupCambioEstadoCodigo = false;
                me.observacionEstado = "";
              } else {
                me.$vs.notify({
                  text: 'Codigo bloqueado',
                  color: 'warning',
                  iconPack: 'feather',
                  icon: 'icon-check'
                })
                me.observacionEstado = "";
                me.popupCambioEstadoCodigo = false;
              }
              me.buscarCodigos(me.itemEstado.codigo);
            })
            .catch(function (error) {
                console.log('Error al bloquear el codigo solicitado ' + me.itemEstado.codigo);
            });
        },
        //METODOS PARA CRUD STORAGE
        changeAddStorage(e){
          let me = this

          let getStorage = JSON.parse(localStorage.getItem("getStorage"))
          if(getStorage){
            me.arregloStorage  = getStorage
          }
          this.$vs.notify({
            text:'Se agrego el código '+e.codigo +" del libro "+e.libro,
            color:'primary',
            iconPack: 'feather',
            icon:'icon-check',
            time:4000
          })
          var cal = new Object()
          cal.codigo = e.codigo
          cal.libro  = e.libro
          me.arregloStorage.push(cal)
          //quitar duplicados
          localStorage.removeItem("getStorage")
          let hash = {};
          let resultado     = me.arregloStorage.filter(o => hash[o.codigo] ? false : hash[o.codigo] = true);
          me.arregloStorage = resultado
          localStorage.setItem('getStorage', JSON.stringify(me.arregloStorage))
        },
        changeDeleteStorage(e){
          let me = this
          this.$vs.notify({
            text:'Se elimino el código '+e.codigo +" del libro "+e.libro,
            color:'warning',
            iconPack: 'feather',
            icon:'icon-check',
            time:4000
          })
          let getStorage = JSON.parse(localStorage.getItem("getStorage"))
          me.arregloStorage = getStorage.filter(p => p.codigo != e.codigo)
          //quitar duplicados
          localStorage.removeItem("getStorage")
          let hash = {};
          let resultado     = me.arregloStorage.filter(o => hash[o.codigo] ? false : hash[o.codigo] = true);
          me.arregloStorage = resultado
          localStorage.setItem('getStorage', JSON.stringify(me.arregloStorage))
        },
        quitarDuplicados(){
          let me = this;
          //quitar duplicados
          localStorage.removeItem("getStorage")
          let hash = {};
          let resultado     = me.arregloStorage.filter(o => hash[o.codigo] ? false : hash[o.codigo] = true);
          me.arregloStorage = resultado
          localStorage.setItem('getStorage', JSON.stringify(me.arregloStorage))
        }
        //FIN METODOS PARA CRUD STORAGE
    }
}
</script>
